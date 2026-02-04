"use client";

import { chainIconMap } from "../lib/chainLabel";

const categoryKeyMap = [
  { match: (v) => v.includes("real estate"), key: "real-estate", label: "RE" },
  { match: (v) => v.includes("art"), key: "art", label: "ART" },
  { match: (v) => v.includes("commodity"), key: "commodities", label: "COM" },
  { match: (v) => v.includes("credit"), key: "credit", label: "CRD" },
  { match: (v) => v.includes("private"), key: "private-equity", label: "PE" },
  { match: (v) => v.includes("collectible"), key: "collectibles", label: "COL" },
  { match: (v) => v.includes("fund"), key: "funds", label: "FUND" },
  { match: (v) => v.includes("carbon"), key: "carbon", label: "CO2" },
  { match: (v) => v.includes("royalt"), key: "royalties", label: "ROY" },
  { match: (v) => v === "ip" || v.includes(" ip"), key: "ip", label: "IP" },
  { match: (v) => v.includes("infrastructure"), key: "infrastructure", label: "INF" },
  { match: (v) => v.includes("equit"), key: "equities", label: "EQ" },
];

function getCategoryMeta(category) {
  const value = (category ?? "").toLowerCase();
  for (const entry of categoryKeyMap) {
    if (entry.match(value)) return entry;
  }
  return { key: "default", label: "RWA" };
}

export default function AssetImage({ image, category, chainId, className }) {
  const hasImage = Boolean(image);
  const meta = getCategoryMeta(category);
  const logoSrc = chainId ? chainIconMap[chainId] : undefined;
  const classes = [className, hasImage ? "" : "fallback", hasImage ? "" : `cat-${meta.key}`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={hasImage ? { backgroundImage: `url(${image})` } : undefined}>
      {!hasImage ? (
        <>
          <div className="asset-fallback-overlay" />
          <div className="asset-fallback-logo">
            {logoSrc ? <img src={logoSrc} alt="" aria-hidden="true" /> : <span>{meta.label}</span>}
          </div>
        </>
      ) : null}
    </div>
  );
}
