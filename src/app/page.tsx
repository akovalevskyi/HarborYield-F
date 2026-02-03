"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useReadContracts } from "wagmi";
import Shell from "./components/Shell";
import { useAssets } from "./lib/useAssets";
import { chainIconMap, formatChainId, formatChainName } from "./lib/chainLabel";
import type { Asset } from "./lib/types";

const balanceAbi = [
  {
    type: "function",
    name: "balanceOfBatch",
    stateMutability: "view",
    inputs: [
      { name: "accounts", type: "address[]" },
      { name: "ids", type: "uint256[]" },
    ],
    outputs: [{ type: "uint256[]", name: "balances" }],
  },
] as const;

const supplyAbi = [
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "supply", type: "uint256" }],
  },
] as const;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function computeHealthScore(items: { asset: Asset; owned: number }[]) {
  const totalValue = items.reduce((acc, item) => acc + item.asset.priceUSDx * item.owned, 0);
  if (totalValue === 0) return null;
  const weighted = items.reduce((acc, item) => {
    const score = item.asset.healthScore ?? 0;
    return acc + score * item.asset.priceUSDx * item.owned;
  }, 0);
  return Math.round(weighted / totalValue);
}

export default function DashboardPage() {
  const { address } = useAccount();
  const { assets, networks, loading, error } = useAssets();

  const chainGroups = useMemo(() => {
    const groups = new Map<number, Asset[]>();
    for (const asset of assets) {
      const list = groups.get(asset.chainId) ?? [];
      list.push(asset);
      groups.set(asset.chainId, list);
    }
    return groups;
  }, [assets]);

  const chainList = useMemo(() => Array.from(chainGroups.keys()).sort((a, b) => a - b), [chainGroups]);

  const readContracts = useMemo(() => {
    if (!address) return [];
    return chainList
      .map((chain) => {
        const info = networks[String(chain)];
        const list = chainGroups.get(chain) ?? [];
        const ids = list.map((asset) => asset.tokenId);
        if (!info || ids.length === 0) return null;
        return {
          abi: balanceAbi,
          address: info.rwa1155,
          functionName: "balanceOfBatch",
          args: [ids.map(() => address), ids],
          chainId: chain,
        };
      })
      .filter(Boolean) as {
      abi: typeof balanceAbi;
      address: `0x${string}`;
      functionName: "balanceOfBatch";
      args: [`0x${string}`[], number[]];
      chainId: number;
    }[];
  }, [address, chainGroups, chainList, networks]);

  const ownedBalancesByChain = useReadContracts({
    contracts: readContracts,
    query: {
      enabled: Boolean(address && readContracts.length > 0),
      refetchInterval: 15000,
    },
  });

  const portfolio = useMemo(() => {
    const out: (Asset & { owned: number })[] = [];
    chainList.forEach((chain, idx) => {
      const list = chainGroups.get(chain) ?? [];
      const result = ownedBalancesByChain.data?.[idx]?.result as bigint[] | undefined;
      list.forEach((asset, aidx) => {
        const owned = Number(result?.[aidx] ?? 0n);
        if (owned > 0) out.push({ ...asset, owned });
      });
    });
    return out;
  }, [chainGroups, chainList, ownedBalancesByChain.data]);

  const supplyQueries = useMemo(() => {
    return portfolio.map((asset) => ({
      abi: supplyAbi,
      address: asset.contract,
      functionName: "totalSupply",
      args: [BigInt(asset.tokenId)],
      chainId: asset.chainId,
    }));
  }, [portfolio]);

  const { data: supplyData } = useReadContracts({
    contracts: supplyQueries,
    query: {
      enabled: supplyQueries.length > 0,
      refetchInterval: 15000,
    },
  });

  const [supplyMap, setSupplyMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!supplyData) return;
    const next: Record<string, number> = {};
    supplyData.forEach((item, idx) => {
      const asset = portfolio[idx];
      if (!asset) return;
      const value = item.result as bigint | undefined;
      next[`${asset.chainId}:${asset.tokenId}`] = Number(value ?? 0n);
    });
    setSupplyMap(next);
  }, [portfolio, supplyData]);

  const totalValue = portfolio.reduce((acc, item) => acc + item.priceUSDx * item.owned, 0);
  const healthScore = computeHealthScore(portfolio.map((asset) => ({ asset, owned: asset.owned })));

  return (
    <Shell
      title="Portfolio Dashboard"
      subtitle="Unified view of your cross-chain RWA portfolio"
      networks={networks}
    >
      <div className="hero">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Your multi-chain positions in one place</h2>
          <p className="muted">
            Oasis keeps the canonical history. Your wallet reflects what you own right now.
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span>Total Value</span>
          <strong>{formatNumber(totalValue)} USDx</strong>
          <p className="muted">Based on initial prices</p>
        </div>
        <div className="stat-card">
          <span>Health Score</span>
          <strong>{healthScore ?? "—"}</strong>
          <p className="muted">Weighted by value</p>
        </div>
        <div className="stat-card">
          <span>Assets Held</span>
          <strong>{portfolio.length}</strong>
          <p className="muted">Across {chainList.length} networks</p>
        </div>
        <div className="stat-card">
          <span>Status</span>
          <strong>{loading ? "Loading..." : error ? "Offline" : "Live"}</strong>
          <p className="muted">{error ? "Backend unavailable" : "Connected to backend"}</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <span>My Assets</span>
          <span className="chip ghost">{portfolio.length} items</span>
        </div>
        {portfolio.length === 0 ? (
          <div className="empty">
            <p>No assets yet. Visit the Shop to build your basket.</p>
            <Link className="button tiny" href="/shop">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="asset-grid">
            {portfolio.map((asset) => (
              <Link
                key={`${asset.chainId}-${asset.tokenId}`}
                href={`/asset/${asset.chainId}/${asset.tokenId}`}
                className="asset-card"
              >
                <div className="asset-image" style={{ backgroundImage: `url(${asset.image})` }} />
                <div className="asset-body">
                  <div>
                    <p className="tag">{asset.category ?? "Asset"}</p>
                    <div className="chain-badge">
                      {chainIconMap[asset.chainId] ? (
                        <img
                          className="chain-icon"
                          src={chainIconMap[asset.chainId]}
                          alt={`Chain ${asset.chainId}`}
                        />
                      ) : (
                        <span className={`chain-dot chain-${asset.chainId}`} />
                      )}
                      <span>{formatChainName(asset.chainId)}</span>
                      <span className="chain-id">{formatChainId(asset.chainId)}</span>
                    </div>
                    <h3>{asset.name}</h3>
                    <p className="muted small">{asset.subname}</p>
                  </div>
                  <div className="asset-meta">
                    <span>Owned</span>
                    <strong>{asset.owned}</strong>
                  </div>
                  <div className="asset-meta">
                    <span>Issued</span>
                    <strong>
                      {asset.supplyForDemo != null ? formatNumber(asset.supplyForDemo) : "—"}
                    </strong>
                  </div>
                  <div className="asset-meta">
                    <span>Available</span>
                    <strong>
                      {asset.supplyForDemo != null
                        ? formatNumber(
                            Math.max(
                              asset.supplyForDemo -
                                (supplyMap[`${asset.chainId}:${asset.tokenId}`] ?? 0),
                              0
                            )
                          )
                        : "—"}
                    </strong>
                  </div>
                  <div className="asset-meta">
                    <span>Health</span>
                    <strong>{asset.healthScore ?? "—"}</strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
