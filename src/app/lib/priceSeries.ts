import type { Asset } from "./types";

export function buildPriceSeries(asset: Asset | null) {
  if (!asset) return [];
  const base = asset.priceUSDx ?? 0;
  if (!base) return [];
  const seed = (asset.tokenId ?? 1) % 7;
  const values = [
    base * (0.92 + seed * 0.01),
    base * (1.04 - seed * 0.005),
    base * (0.97 + seed * 0.004),
    base * (1.02 - seed * 0.003),
    base,
  ];
  return values.map((value, idx) => ({
    label: `t${idx + 1}`,
    value,
  }));
}
