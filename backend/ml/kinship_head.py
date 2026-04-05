"""
KinshipHead — Siamese classification head for kinship verification.

Exact architecture from the training notebook:
  Fusion:  [|a−b|, a⊙b, cos(a,b), ‖a−b‖₂]  → 512*2 + 2 = 1026 dims
  MLP:     Linear(1026→64, bias=False) → BN(64) → GELU → Dropout(0.60) → Linear(64→1)
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class KinshipHead(nn.Module):
   

    def __init__(self, embed_dim: int = 512, hidden_dims: list | None = None, dropout: float = 0.60):
        super().__init__()
        if hidden_dims is None:
            hidden_dims = [64]

        in_dim = embed_dim * 2 + 2  # 512+512+1+1 = 1026

        layers: list[nn.Module] = []
        for h in hidden_dims:
            layers += [
                nn.Linear(in_dim, h, bias=False),
                nn.BatchNorm1d(h),
                nn.GELU(),
                nn.Dropout(p=dropout),
            ]
            in_dim = h
        layers.append(nn.Linear(in_dim, 1))
        self.head = nn.Sequential(*layers)
        self._init_weights()

    def _init_weights(self) -> None:
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.kaiming_normal_(m.weight, nonlinearity="linear")
                if m.bias is not None:
                    nn.init.zeros_(m.bias)
            elif isinstance(m, nn.BatchNorm1d):
                nn.init.ones_(m.weight)
                nn.init.zeros_(m.bias)

    def _fuse(self, a: torch.Tensor, b: torch.Tensor) -> torch.Tensor:
        diff = torch.abs(a - b)
        product = a * b
        cos = F.cosine_similarity(a, b).unsqueeze(1)
        l2 = torch.norm(diff, dim=1, keepdim=True)
        return torch.cat([diff, product, cos, l2], dim=1)

    def forward(self, emb_a: torch.Tensor, emb_b: torch.Tensor) -> torch.Tensor:
        return self.head(self._fuse(emb_a, emb_b))
