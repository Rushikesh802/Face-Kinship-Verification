"""
KinshipPipeline — End-to-end kinship verification.

Orchestrates:
  1. RetinaFace (via InsightFace) → detect & align faces to 112×112
  2. AdaFace IR-101 backbone → extract 512-d L2-normalized embeddings
  3. KinshipHead → predict kinship probability
"""

import os
import sys
import shutil
import logging
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from huggingface_hub import hf_hub_download
from torchvision import transforms

from .kinship_head import KinshipHead
from .face_detector import FaceDetector

logger = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────
HF_MODEL_ID = "minchul/cvlface_adaface_ir101_webface12m"
EMBED_DIM = 512
IMG_SIZE = 112
DEFAULT_THRESHOLD = 0.5187  # Youden's J from validation

# AdaFace / ArcFace standard normalization
FACE_TRANSFORM = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
])


def _download_backbone(repo_id: str, local_dir: str) -> None:
    """Download CVLFace model files from HuggingFace."""
    os.makedirs(local_dir, exist_ok=True)
    files_txt = os.path.join(local_dir, "files.txt")
    if not os.path.exists(files_txt):
        hf_hub_download(repo_id, "files.txt", local_dir=local_dir, local_dir_use_symlinks=False)

    with open(files_txt) as f:
        extra_files = [line.strip() for line in f if line.strip()]

    for fname in extra_files + ["config.json", "wrapper.py", "model.safetensors"]:
        dest = os.path.join(local_dir, fname)
        if not os.path.exists(dest):
            logger.info(f"Downloading {fname}...")
            hf_hub_download(repo_id, fname, local_dir=local_dir, local_dir_use_symlinks=False)


def _load_backbone_direct(local_dir: str) -> nn.Module:
    """
    Load AdaFace backbone directly using the repo's own loader,
    bypassing AutoModel (which has compatibility issues).
    """
    cwd = os.getcwd()
    try:
        os.chdir(local_dir)
        if local_dir not in sys.path:
            sys.path.insert(0, local_dir)

        from omegaconf import OmegaConf
        from models import get_model

        model_conf = OmegaConf.load("pretrained_model/model.yaml")
        backbone = get_model(model_conf)
        backbone.load_state_dict_from_path("pretrained_model/model.pt")
    finally:
        os.chdir(cwd)
        if local_dir in sys.path:
            sys.path.remove(local_dir)

    return backbone


class KinshipPipeline:
    """Full kinship verification pipeline."""

    def __init__(
        self,
        model_weights_path: str,
        backbone_dir: str = "./adaface_ir101",
        device: str = "auto",
    ):
        # Device
        if device == "auto":
            self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self._device = torch.device(device)

        logger.info(f"Using device: {self._device}")

        self._model_weights_path = model_weights_path
        self._backbone_dir = backbone_dir

        # Lazy-loaded components
        self._backbone: Optional[nn.Module] = None
        self._head: Optional[KinshipHead] = None
        self._detector: Optional[FaceDetector] = None
        self._threshold: float = DEFAULT_THRESHOLD

    @property
    def is_loaded(self) -> bool:
        return self._backbone is not None and self._head is not None

    def load(self) -> None:
        """Load all models. Called once at startup."""
        if self.is_loaded:
            return

        # 1. Face detector (RetinaFace via InsightFace)
        logger.info("Loading face detector...")
        self._detector = FaceDetector()

        # 2. AdaFace backbone
        logger.info(f"Loading AdaFace backbone from {HF_MODEL_ID}...")
        _download_backbone(HF_MODEL_ID, self._backbone_dir)
        self._backbone = _load_backbone_direct(self._backbone_dir)
        self._backbone.eval()
        for p in self._backbone.parameters():
            p.requires_grad_(False)
        self._backbone.to(self._device)

        # 3. KinshipHead + weights
        logger.info(f"Loading KinshipHead from {self._model_weights_path}...")
        self._head = KinshipHead(
            embed_dim=EMBED_DIM,
            hidden_dims=[64],
            dropout=0.60,
        )

        ckpt = torch.load(self._model_weights_path, map_location=self._device, weights_only=False)
        self._head.load_state_dict(ckpt["model_state"])
        self._threshold = ckpt.get("threshold", DEFAULT_THRESHOLD)
        self._head.eval()
        self._head.to(self._device)

        logger.info(
            f"Pipeline ready — threshold={self._threshold:.4f}, "
            f"AUC={ckpt.get('best_auc', 'N/A')}, epoch={ckpt.get('epoch', 'N/A')}"
        )

    def _extract_embedding(self, aligned_face_bgr: np.ndarray) -> torch.Tensor:
        """Convert aligned BGR face → 512-d L2-normalized embedding."""
        # BGR → RGB → PIL
        face_rgb = cv2.cvtColor(aligned_face_bgr, cv2.COLOR_BGR2RGB)
        face_pil = Image.fromarray(face_rgb)

        # Transform and add batch dim
        tensor = FACE_TRANSFORM(face_pil).unsqueeze(0).to(self._device)

        with torch.no_grad():
            out = self._backbone(tensor)
            emb = out[0] if isinstance(out, (list, tuple)) else out
            if isinstance(emb, dict):
                emb = next(iter(emb.values()))
            emb = F.normalize(emb, p=2, dim=1)

        return emb  # [1, 512]

    def predict(
        self, image1: Image.Image, image2: Image.Image
    ) -> dict:
        """
        Run full kinship verification on two PIL images.

        Returns:
            {
                "is_related": bool,
                "confidence": float (0-100),
                "raw_probability": float (0-1),
                "threshold": float,
                "face1_bbox": [x1, y1, x2, y2] or null,
                "face2_bbox": [x1, y1, x2, y2] or null,
            }
        """
        if not self.is_loaded:
            self.load()

        # Detect and align faces
        aligned1, bbox1 = self._detector.detect_and_align(image1, target_size=IMG_SIZE)
        if aligned1 is None:
            raise ValueError("No face detected in the first image.")

        aligned2, bbox2 = self._detector.detect_and_align(image2, target_size=IMG_SIZE)
        if aligned2 is None:
            raise ValueError("No face detected in the second image.")

        # Extract embeddings
        emb1 = self._extract_embedding(aligned1)
        emb2 = self._extract_embedding(aligned2)

        # Predict kinship
        with torch.no_grad():
            logit = self._head(emb1, emb2)
            probability = torch.sigmoid(logit).item()

        is_related = probability >= self._threshold
        confidence = round(probability * 100, 2)

        # Round bboxes for JSON
        if bbox1:
            bbox1 = [round(v, 1) for v in bbox1]
        if bbox2:
            bbox2 = [round(v, 1) for v in bbox2]

        return {
            "is_related": is_related,
            "confidence": confidence,
            "raw_probability": round(probability, 6),
            "threshold": round(self._threshold, 4),
            "face1_bbox": bbox1,
            "face2_bbox": bbox2,
        }
