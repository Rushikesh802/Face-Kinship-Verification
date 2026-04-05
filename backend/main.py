"""
Face Kinship Verification API — FastAPI Backend

Endpoints:
  POST /api/verify-kinship  — accepts two images, returns kinship prediction
  GET  /api/health          — health check
"""

import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from ml.pipeline import KinshipPipeline

# ── Logging ───────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

# ── Paths ─────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
MODEL_WEIGHTS = BASE_DIR.parent / "best_model.pt"
BACKBONE_DIR = BASE_DIR / "adaface_ir101"

# ── Pipeline singleton ────────────────────────────────────────────────────
pipeline = KinshipPipeline(
    model_weights_path=str(MODEL_WEIGHTS),
    backbone_dir=str(BACKBONE_DIR),
)


# ── Lifespan ──────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Loading ML pipeline on startup...")
    pipeline.load()
    logger.info("ML pipeline ready.")
    yield
    logger.info("Shutting down.")


# ── App ───────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Face Kinship Verification API",
    version="1.0.0",
    description="Verify whether two faces share a familial kinship relationship.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ───────────────────────────────────────────────────────────────
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


async def _read_image(upload: UploadFile, label: str) -> Image.Image:
    """Validate and read an uploaded image file."""
    if upload.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"{label}: Unsupported image type '{upload.content_type}'. "
                   f"Allowed: {', '.join(ALLOWED_TYPES)}",
        )

    data = await upload.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"{label}: File too large ({len(data) / 1e6:.1f} MB). Max: 10 MB.",
        )

    try:
        img = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail=f"{label}: Could not decode image.")

    return img


# ── Endpoints ─────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": pipeline.is_loaded,
    }


@app.post("/api/detect-face")
async def detect_face(image: UploadFile = File(..., description="Image to detect face in")):
    img = await _read_image(image, "Image")
    try:
        if not pipeline.is_loaded:
            pipeline.load()
        aligned, bbox = pipeline._detector.detect_and_align(img, target_size=112)
        if bbox is None:
            return {"bbox": None}
        return {"bbox": [round(v, 1) for v in bbox]}
    except Exception as e:
        logger.exception("Detection failed")
        return {"bbox": None}


@app.post("/api/verify-kinship")
async def verify_kinship(
    image1: UploadFile = File(..., description="First face image"),
    image2: UploadFile = File(..., description="Second face image"),
):
    """
    Verify kinship between two uploaded face images.

    Returns JSON with:
      - is_related: boolean prediction
      - confidence: percentage (0-100)
      - raw_probability: sigmoid output (0-1)
      - threshold: decision boundary used
      - face1_bbox / face2_bbox: detected face bounding boxes
    """
    img1 = await _read_image(image1, "Image 1")
    img2 = await _read_image(image2, "Image 2")

    try:
        result = pipeline.predict(img1, img2)
    except ValueError as e:
        # No face detected
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="Internal prediction error.")

    return result


# ── Run directly ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
