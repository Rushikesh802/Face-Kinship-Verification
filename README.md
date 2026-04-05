# KinVerify — Face Kinship Verification

AI-powered facial kinship verification using **AdaFace IR-101**, **SCRFD (InsightFace)**, and a custom **Siamese neural network**.

## Quick Start

### Prerequisites
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- [Node.js](https://nodejs.org/) v18+

### Backend (FastAPI)

```bash
cd backend
uv sync                          # Install Python dependencies
uv run uvicorn main:app --reload # Start API on http://localhost:8000
```

> On first run, the AdaFace backbone (~250 MB) will be automatically downloaded from HuggingFace.

### Frontend (React)

```bash
cd frontend
npm install     # Install JS dependencies
npm run dev     # Start dev server on http://localhost:5173
```

The frontend proxies `/api/*` requests to the backend at `localhost:8000`.

## Architecture

```
Input Images → SCRFD Detection → 112×112 Alignment
→ AdaFace IR-101 → 512-d Embeddings → Siamese Fusion Head
→ Kinship Probability (threshold: 0.5187)
```

## Model Details

| Property | Value |
|----------|-------|
| Backbone | AdaFace IR-101 (WebFace12M) |
| Embedding | 512-d, L2-normalized |
| Head | 1026→64→1 (BN + GELU + Dropout 0.60) |
| AUC-ROC | 0.931 |
| Threshold | 0.5187 (Youden's J) |
| Training | KinFaceW-II + FIW (2-stage) |

## API

### `POST /api/verify-kinship`

```bash
curl -X POST http://localhost:8000/api/verify-kinship \
  -F "image1=@person1.jpg" \
  -F "image2=@person2.jpg"
```

Response:
```json
{
  "is_related": true,
  "confidence": 73.42,
  "raw_probability": 0.7342,
  "threshold": 0.5187,
  "face1_bbox": [45.2, 30.1, 180.5, 210.3],
  "face2_bbox": [52.0, 28.4, 175.2, 205.1]
}
```
