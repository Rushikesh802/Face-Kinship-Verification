"""
Face detection and alignment using MTCNN (facenet-pytorch).

Detects faces, extracts 5-point landmarks, and aligns to 112×112
using the standard ArcFace/AdaFace similarity transform.
MTCNN is a cascade of P-Net, R-Net, O-Net — robust multi-task face detector.
"""

import cv2
import numpy as np
from PIL import Image
from typing import Optional
import logging
import torch

logger = logging.getLogger(__name__)

# Standard ArcFace 112×112 reference landmarks
ARCFACE_REF_LANDMARKS = np.array([
    [38.2946, 51.6963],   # left eye
    [73.5318, 51.5014],   # right eye
    [56.0252, 71.7366],   # nose tip
    [41.5493, 92.3655],   # left mouth
    [70.7299, 92.2041],   # right mouth
], dtype=np.float32)


def _align_face(img_bgr: np.ndarray, landmarks: np.ndarray, target_size: int = 112) -> np.ndarray:
    """Align face to target_size×target_size using similarity transform."""
    src_pts = landmarks.astype(np.float32)
    dst_pts = ARCFACE_REF_LANDMARKS.copy()

    # Use cv2.estimateAffinePartial2D for robust similarity transform
    M, _ = cv2.estimateAffinePartial2D(src_pts, dst_pts)
    if M is None:
        return cv2.resize(img_bgr, (target_size, target_size))

    aligned = cv2.warpAffine(img_bgr, M, (target_size, target_size), borderValue=0)
    return aligned


class FaceDetector:
    """MTCNN-based face detector with ArcFace/AdaFace alignment."""

    def __init__(self):
        self._mtcnn = None

    def _ensure_loaded(self) -> None:
        if self._mtcnn is None:
            from facenet_pytorch import MTCNN
            self._mtcnn = MTCNN(
                keep_all=True,
                device=torch.device("cpu"),
                select_largest=False,
                min_face_size=40,
                thresholds=[0.6, 0.7, 0.7],
            )
            logger.info("MTCNN face detector loaded.")

    def detect_and_align(
        self, image: Image.Image, target_size: int = 112
    ) -> tuple[Optional[np.ndarray], Optional[list[float]]]:
        """
        Detect the largest face and align it to target_size×target_size.

        Returns:
            aligned_face: np.ndarray (H, W, 3) BGR, or None if no face found
            bbox: [x1, y1, x2, y2] or None
        """
        self._ensure_loaded()

        img_rgb = image.convert("RGB")
        img_np_rgb = np.array(img_rgb)
        img_bgr = cv2.cvtColor(img_np_rgb, cv2.COLOR_RGB2BGR)

        # Detect faces — returns boxes (N,4), probs (N,), landmarks (N,5,2)
        boxes, probs, landmarks = self._mtcnn.detect(img_rgb, landmarks=True)

        if boxes is None or len(boxes) == 0:
            return None, None

        # Select the largest face by area
        areas = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
        best_idx = int(np.argmax(areas))

        bbox = boxes[best_idx].tolist()  # [x1, y1, x2, y2]

        # 5-point landmarks: left_eye, right_eye, nose, mouth_left, mouth_right
        lm = landmarks[best_idx]  # shape (5, 2)

        # Align face using similarity transform
        aligned = _align_face(img_bgr, lm, target_size)

        return aligned, bbox

    def detect_bbox_only(self, image: Image.Image) -> Optional[list[float]]:
        """Just get the bounding box of the largest face."""
        self._ensure_loaded()
        img_rgb = image.convert("RGB")
        boxes, _, _ = self._mtcnn.detect(img_rgb, landmarks=True)
        if boxes is None or len(boxes) == 0:
            return None
        areas = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
        best_idx = int(np.argmax(areas))
        return boxes[best_idx].tolist()
