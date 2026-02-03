"use client";

import type { Asset } from "@/app/lib/types";
import { useEffect, useState } from "react";
import PriceChart from "@/app/components/PriceChart";
import { chainIconMap, formatChainId, formatChainName } from "@/app/lib/chainLabel";

export default function AssetInfoModal({
  open,
  asset,
  available,
  onClose,
}: {
  open: boolean;
  asset: Asset | null;
  available?: number | null;
  onClose: () => void;
}) {
  const [series, setSeries] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const chainId = asset?.chainId ?? 0;
  const contract = asset?.contract ?? "";
  const tokenId = asset?.tokenId ?? 0;
  const initialPrice = asset?.priceUSDx ?? 0;
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!open || !asset) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/entries/asset/${chainId}/${contract}/${tokenId}`);
        if (!res.ok) return;
        const json = await res.json();
        const entries = Array.isArray(json.entries) ? json.entries : [];
        const normalized = entries.map(
          (e: {
            kind: number | string;
            price?: number | string;
            amount?: number | string;
            recordedAt?: number | string;
          }) => ({
            kind: Number(e.kind),
            price: Number(e.price ?? 0),
            amount: Number(e.amount ?? 0),
            recordedAt: Number(e.recordedAt ?? 0),
          })
        );
        const timeline: { ts: number; value: number }[] = [];
        if (initialPrice != null) {
          const oldestTs =
            normalized.length > 0
              ? Math.min(
                  ...normalized.map((e) => (e.recordedAt > 0 ? e.recordedAt : Date.now() / 1000))
                )
              : Math.floor(Date.now() / 1000);
          timeline.push({ ts: oldestTs - 86400, value: Number(initialPrice) });
        }
        for (const e of normalized) {
          if (e.kind !== 3 && e.kind !== 5) continue;
          const unit = e.amount > 0 ? e.price / e.amount : e.price;
          timeline.push({ ts: e.recordedAt || Math.floor(Date.now() / 1000), value: unit });
        }
        timeline.sort((a, b) => a.ts - b.ts);
        if (!active) return;
        const points = timeline.map((p) => ({
          label: new Date(p.ts * 1000).toLocaleDateString(),
          value: p.value,
        }));
        if (points.length === 1) {
          const d = new Date();
          d.setDate(d.getDate() - 1);
          points.unshift({ label: d.toLocaleDateString(), value: points[0].value });
        }
        setSeries(points);
      } catch (_err) {
        if (!active) return;
        setSeries([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [asset, open]);
  if (!open || !asset) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal wide">
        <div className="modal-image" style={{ backgroundImage: `url(${asset.image})` }} />
        <div className="modal-content">
          <div>
            <p className="tag">{asset.category ?? "Asset"}</p>
            <h3>{asset.name}</h3>
            <p className="muted">{asset.subname}</p>
          </div>
          <p className="muted small">{asset.description ?? "No description provided."}</p>
          <div className="modal-grid">
            <div>
              <span>Token:</span>
              <strong>#{asset.tokenId}</strong>
            </div>
            <div>
              <span>Network:</span>
              <strong className="chain-inline">
                {chainIconMap[asset.chainId] ? (
                  <img src={chainIconMap[asset.chainId]} alt={`Chain ${asset.chainId}`} />
                ) : (
                  <span className={`chain-dot chain-${asset.chainId}`} />
                )}
                <span>{formatChainName(asset.chainId)}</span>
              </strong>
            </div>
            <div>
              <span>Chain ID:</span>
              <strong>{formatChainId(asset.chainId)}</strong>
            </div>
            <div>
              <span>Health:</span>
              <strong>{asset.healthScore ?? "—"}</strong>
            </div>
            <div>
              <span>Price:</span>
              <strong>{asset.priceUSDx} USDx</strong>
            </div>
            {available != null ? (
              <div>
                <span>Available:</span>
                <strong>{formatNumber(available)}</strong>
              </div>
            ) : null}
            <div>
              <span>Issued:</span>
              <strong>
                {asset.supplyForDemo != null ? formatNumber(asset.supplyForDemo) : "—"}
              </strong>
            </div>
          </div>
          {loading ? (
            <div className="chart skeleton">Loading price history...</div>
          ) : series.length ? (
            <PriceChart title="Price timeline" series={[{ name: "Price", data: series, color: "#0f766e" }]} />
          ) : (
            <p className="muted small">No price history yet.</p>
          )}
          <button className="button ghost tiny" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
