"use client";

import { useMemo } from "react";
import assetsData from "../../data/assets.json";

const toNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").trim();
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export function useAssets() {
  return useMemo(() => {
    const rawAssets = Array.isArray(assetsData?.assets) ? assetsData.assets : [];
    const networks = assetsData?.networks ?? {};
    const normalizedAssets = rawAssets.map((asset) => {
      const priceUSDx = toNumber(asset.priceUSDx ?? asset.price) ?? 0;
      const chainId = Number(asset.chainId);
      const contract =
        asset.contract || asset.rwa1155 || networks[String(chainId)]?.rwa1155 || null;
      return {
        ...asset,
        chainId,
        tokenId: Number(asset.tokenId),
        priceUSDx,
        contract,
        issuerScore: asset.issuerScore ?? asset.issuer_score,
        assetUrl: asset.assetUrl ?? asset.asset_url,
      };
    });

    return {
      assets: normalizedAssets,
      networks,
      loading: false,
      error: null,
    };
  }, []);
}
