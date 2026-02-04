"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { readContract } from "@wagmi/core";
import {
  useAccount,
  useChainId,
  useSignTypedData,
  useSwitchChain,
} from "wagmi";
import Shell from "../components/Shell";
import BlockingModal from "../components/BlockingModal";
import ReceiptModal from "../components/ReceiptModal";
import { useAssets } from "../lib/useAssets";
import { chainIconMap } from "../lib/chainLabel";
import { wagmiConfig } from "src/config/appkit";
import { backendUrl } from "src/app/lib/backendUrl";

const marketAbi = [
  {
    type: "function",
    name: "getActiveListingCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "count", type: "uint256" }],
  },
  {
    type: "function",
    name: "getActiveListingIds",
    stateMutability: "view",
    inputs: [
      { name: "start", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
    outputs: [{ name: "ids", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "listings",
    stateMutability: "view",
    inputs: [{ name: "listingId", type: "uint256" }],
    outputs: [
      { name: "seller", type: "address" },
      { name: "rwa1155", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "pricePerUnit", type: "uint256" },
      { name: "active", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "nonces",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "nonce", type: "uint256" }],
  },
];

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

const formatNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return numberFormat.format(value);
  return "—";
};

const formatApr = (apr) => {
  if (apr == null || apr === false) return null;
  if (apr === true) return "APR";
  return `APR ${formatNumber(apr)}%`;
};

export default function MarketplacePage() {
  const { assets, networks } = useAssets();
  const { address, isConnected } = useAccount();
  const walletChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { signTypedDataAsync } = useSignTypedData();

  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("Ready.");
  const [busy, setBusy] = useState(false);
  const [receiptTx, setReceiptTx] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [refreshTick, setRefreshTick] = useState(0);


  const assetByKey = useMemo(() => {
    const map = new Map();
    assets.forEach((asset) => {
      map.set(`${asset.chainId}:${asset.tokenId}`, asset);
    });
    return map;
  }, [assets]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!Object.keys(networks).length) return;
      const next = [];
      for (const [id, info] of Object.entries(networks)) {
        const chain = Number(id);
        if (!info?.routerAndDelivery) continue;
        try {
          const count = await readContract(wagmiConfig, {
            address: info.routerAndDelivery,
            abi: marketAbi,
            functionName: "getActiveListingCount",
            args: [],
            chainId: chain,
          });
          if (count === 0n) continue;
          const ids = await readContract(wagmiConfig, {
            address: info.routerAndDelivery,
            abi: marketAbi,
            functionName: "getActiveListingIds",
            args: [0n, count],
            chainId: chain,
          });
          for (const rawId of ids) {
            const listing = await readContract(wagmiConfig, {
              address: info.routerAndDelivery,
              abi: marketAbi,
              functionName: "listings",
              args: [rawId],
              chainId: chain,
            });
            next.push({
              id: Number(rawId),
              chainId: chain,
              seller: listing[0],
              rwa1155: listing[1],
              tokenId: Number(listing[2]),
              amount: Number(listing[3]),
              pricePerUnit: Number(listing[4]),
              active: Boolean(listing[5]),
            });
          }
        } catch (_err) {
          // ignore per-chain errors
        }
      }
      if (active) setListings(next.filter((item) => item.active));
    };
    load();
    return () => {
      active = false;
    };
  }, [networks, refreshTick]);

  const categories = useMemo(() => {
    const set = new Set();
    listings.forEach((listing) => {
      const asset = assetByKey.get(`${listing.chainId}:${listing.tokenId}`);
      if (asset?.category) set.add(asset.category);
      else set.add("Other");
    });
    const list = Array.from(set.values());
    const hasOther = list.includes("Other");
    const sorted = list.filter((label) => label !== "Other").sort();
    if (hasOther) sorted.push("Other");
    return ["All", ...sorted];
  }, [listings, assetByKey]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  const filteredListings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings.filter((listing) => {
      const asset = assetByKey.get(`${listing.chainId}:${listing.tokenId}`);
      const category = asset?.category ?? "Other";
      if (activeCategory !== "All" && category !== activeCategory) return false;
      if (!q) return true;
      return (
        String(listing.tokenId).includes(q) ||
        asset?.name?.toLowerCase().includes(q) ||
        (asset?.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [activeCategory, assetByKey, listings, search]);

  const handleCancel = async (listing) => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    const network = networks[String(listing.chainId)];
    if (!network?.routerAndDelivery) return;
    if (listing.seller.toLowerCase() !== address.toLowerCase()) {
      setStatus("Only seller can cancel.");
      return;
    }
    setBusy(true);
    try {
      if (walletChainId !== listing.chainId) {
        setStatus("Switching chain...");
        await switchChainAsync({ chainId: listing.chainId });
      }

      setStatus("Signing cancel...");
      const nonce = await readContract(wagmiConfig, {
        address: network.routerAndDelivery,
        abi: marketAbi,
        functionName: "nonces",
        args: [address],
        chainId: listing.chainId,
      });
      const deadline = Math.floor(Date.now() / 1000) + 600;
      const signature = await signTypedDataAsync({
        domain: {
          name: "AllInOneNEW",
          version: "1",
          chainId: listing.chainId,
          verifyingContract: network.routerAndDelivery,
        },
        types: {
          CancelListing: [
            { name: "seller", type: "address" },
            { name: "listingId", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "CancelListing",
        message: {
          seller: address,
          listingId: BigInt(listing.id),
          nonce,
          deadline,
        },
      });

      setStatus("Relaying cancel...");
      const resp = await fetch(`${backendUrl}/market/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chainId: listing.chainId,
          seller: address,
          listingId: listing.id,
          deadline,
          signature,
        }),
      });
      const receiptJson = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(receiptJson?.error || `Cancel failed (${resp.status})`);
      if (receiptJson?.oasisTxHash) {
        setReceiptTx(receiptJson.oasisTxHash);
        setReceiptOpen(true);
      }
      setStatus("Cancel recorded in Oasis.");
      setRefreshTick((v) => v + 1);
    } catch (err) {
      setStatus(`Cancel error: ${String(err?.message ?? err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <BlockingModal open={busy} message={status} />
      <ReceiptModal
        open={receiptOpen}
        href={receiptTx ? `https://explorer.oasis.io/testnet/sapphire/tx/${receiptTx}` : null}
        label="View receipt in Oasis"
        onClose={() => setReceiptOpen(false)}
      />
      <section className="hero compact">
        <div className="hero-top">
          <h1>Marketplace listings across chains.</h1>
          <p>Assets bought earlier are relisted here. You’ll see your listings too, alongside everyone else’s.</p>
        </div>
      </section>
      <section className="placeholder">
        <div className="filters-row">
          <div className="filters">
            {categories.map((label) => (
              <button
                key={label}
                className={`pill filter-pill ${activeCategory === label ? "is-active" : ""}`}
                type="button"
                onClick={() => setActiveCategory(label)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="search">
            <input
              type="text"
              placeholder="Search listings"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {filteredListings.length === 0 ? (
          <p className="empty-state">No listings yet. Create one from your dashboard.</p>
        ) : (
          <div className="grid">
            {filteredListings.map((listing) => {
              const asset = assetByKey.get(`${listing.chainId}:${listing.tokenId}`);
              const isMine =
                address && listing.seller && listing.seller.toLowerCase() === address.toLowerCase();
              const image = asset?.image || null;
              const issuer = asset?.subname ?? asset?.issuer ?? "—";
              return (
                <Link
                  key={`${listing.chainId}-${listing.id}`}
                  className="card"
                  href={`/marketplace/asset/${listing.chainId}/${listing.tokenId}?listingId=${listing.id}`}
                >
                  <div className={`card-media ${image ? "has-image" : "no-image"}`}>
                    <div className="card-media-bg" style={image ? { background: image } : undefined} />
                    <div className="card-media-top">
                      {asset && formatApr(asset.apr) ? <span className="badge">APR {formatApr(asset.apr)}</span> : <span />}
                      <span className="network-pill">
                        <img src={chainIconMap[listing.chainId] || "/eth.svg"} alt="" aria-hidden="true" />
                      </span>
                    </div>
                    {!image ? (
                      <div className="glyph">{(asset?.category ?? "OT").slice(0, 2)}</div>
                    ) : null}
                  </div>
                  <div className="card-body">
                    <div className="card-category">{asset?.category ?? "Listing"}</div>
                    <div className="card-title">{asset?.name ?? `Token #${listing.tokenId}`}</div>
                    <div className="card-sub">{issuer}</div>
                    <div className="card-description">{asset?.description ?? "—"}</div>
                    <div className="card-stats">
                      <div>
                        <span>Issuer Rate</span>
                        <strong>
                          {asset?.issuerScore != null ? `${Math.round(asset.issuerScore)}/100` : "—"}
                        </strong>
                      </div>
                      <div>
                        <span>Listed</span>
                        <strong>{formatNumber(listing.amount)}</strong>
                      </div>
                    </div>
                    <div className="card-actions">
                      <div className="card-price">{formatNumber(listing.pricePerUnit)} USDx</div>
                      {isMine ? (
                        <button
                          className="cancel-button"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCancel(listing);
                          }}
                          disabled={busy}
                        >
                          Cancel Listing
                        </button>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </Shell>
  );
}
