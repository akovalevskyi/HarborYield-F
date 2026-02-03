"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { waitForTransactionReceipt } from "@wagmi/core";
import { decodeEventLog, erc20Abi, parseEventLogs, parseGwei } from "viem";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContracts,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import Shell from "../components/Shell";
import BlockingModal from "../components/BlockingModal";
import AssetInfoModal from "../components/AssetInfoModal";
import ReceiptModal from "../components/ReceiptModal";
import { useAssets } from "../lib/useAssets";
import type { Asset } from "../lib/types";
import { chainIconMap, formatChainId, formatChainName } from "../lib/chainLabel";
import { wagmiConfig } from "@/config/appkit";

type BasketLeg = {
  chainId: number;
  rwa1155: `0x${string}`;
  tokenIds: number[];
  amounts: number[];
};

type Basket = {
  to: `0x${string}`;
  legs: BasketLeg[];
};

const routerAbi = [
  {
    type: "event",
    name: "Paid",
    inputs: [
      { indexed: true, name: "batchId", type: "bytes32" },
      { indexed: true, name: "payer", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: true, name: "basketHash", type: "bytes32" },
      { indexed: false, name: "encryptedBasket", type: "bytes" },
    ],
    anonymous: false,
  },
  {
    type: "function",
    name: "pay",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "basketHash", type: "bytes32" },
      { name: "encryptedBasket", type: "bytes" },
    ],
    outputs: [{ name: "batchId", type: "bytes32" }],
  },
] as const;

const apiBase = "/api";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

export default function ShopPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { assets, networks, loading, error } = useAssets();
  const [supplyMap, setSupplyMap] = useState<Record<string, number>>({});

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [payChainId, setPayChainId] = useState<number>(11155111);
  const publicClient = usePublicClient({ chainId: payChainId });
  const [status, setStatus] = useState<string>("Ready.");
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);
  const [receiptTx, setReceiptTx] = useState<string | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const getFeeOverrides = async () => {
    if (!publicClient) return {};
    const fees = await publicClient.estimateFeesPerGas();
    const maxFeeCap = parseGwei("1000");
    const priorityFeeCap = parseGwei("30");
    const maxFeePerGas =
      fees.maxFeePerGas && fees.maxFeePerGas < maxFeeCap ? fees.maxFeePerGas : maxFeeCap;
    const maxPriorityFeePerGas =
      fees.maxPriorityFeePerGas && fees.maxPriorityFeePerGas < priorityFeeCap
        ? fees.maxPriorityFeePerGas
        : priorityFeeCap;
    return { maxFeePerGas, maxPriorityFeePerGas };
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((asset) => {
      if (asset.category) set.add(asset.category);
    });
    return ["All", ...Array.from(set.values())];
  }, [assets]);

  const filteredAssets = useMemo(() => {
    const byCategory = category === "All" ? assets : assets.filter((asset) => asset.category === category);
    if (!search.trim()) return byCategory;
    const q = search.trim().toLowerCase();
    return byCategory.filter((asset) => {
      return (
        asset.name.toLowerCase().includes(q) ||
        (asset.subname ?? "").toLowerCase().includes(q) ||
        (asset.category ?? "").toLowerCase().includes(q) ||
        String(asset.tokenId).includes(q)
      );
    });
  }, [assets, category, search]);

  const supplyQueries = useMemo(() => {
    return assets.map((asset) => ({
      abi: [
        {
          type: "function",
          name: "totalSupply",
          stateMutability: "view",
          inputs: [{ name: "id", type: "uint256" }],
          outputs: [{ name: "supply", type: "uint256" }],
        },
      ],
      address: asset.contract,
      functionName: "totalSupply",
      args: [BigInt(asset.tokenId)],
      chainId: asset.chainId,
    }));
  }, [assets]);

  const { data: supplyData } = useReadContracts({
    contracts: supplyQueries,
    query: {
      enabled: supplyQueries.length > 0,
      refetchInterval: 15000,
    },
  });

  useEffect(() => {
    if (!supplyData) return;
    const next: Record<string, number> = {};
    supplyData.forEach((item, idx) => {
      const asset = assets[idx];
      if (!asset) return;
      const value = item.result as bigint | undefined;
      next[`${asset.chainId}:${asset.tokenId}`] = Number(value ?? 0n);
    });
    setSupplyMap(next);
  }, [assets, supplyData]);

  const selected = useMemo(() => {
    return assets
      .map((asset) => ({
        asset,
        qty: quantities[`${asset.chainId}:${asset.tokenId}`] ?? 0,
      }))
      .filter((item) => item.qty > 0);
  }, [quantities, assets]);

  const totalUSDx = useMemo(() => {
    return selected.reduce((acc, item) => {
      return acc + BigInt(Math.round(item.asset.priceUSDx)) * BigInt(item.qty);
    }, 0n);
  }, [selected]);

  const totalBase = totalUSDx * 1_000_000n;

  const basket: Basket | null = useMemo(() => {
    if (!address) return null;
    const legs = new Map<string, BasketLeg>();
    for (const item of selected) {
      const key = `${item.asset.chainId}:${item.asset.contract}`;
      const leg = legs.get(key) ?? {
        chainId: item.asset.chainId,
        rwa1155: item.asset.contract,
        tokenIds: [],
        amounts: [],
      };
      leg.tokenIds.push(item.asset.tokenId);
      leg.amounts.push(item.qty);
      legs.set(key, leg);
    }
    return {
      to: address,
      legs: Array.from(legs.values()),
    };
  }, [selected, address]);

  const payNetwork = networks[String(payChainId)];

  const handleQty = (asset: Asset, delta: number) => {
    setQuantities((prev) => {
      const key = `${asset.chainId}:${asset.tokenId}`;
      const next = Math.max(0, (prev[key] ?? 0) + delta);
      return { ...prev, [key]: next };
    });
  };

  const handlePay = async () => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!payNetwork) {
      setStatus("Unknown pay network.");
      return;
    }
    if (!basket || basket.legs.length === 0) {
      setStatus("Basket is empty.");
      return;
    }
    if (chainId !== payChainId) {
      setStatus("Switching wallet network...");
      try {
        await switchChainAsync({ chainId: payChainId });
        setStatus("Network switched. Click pay again.");
      } catch (err) {
        setStatus(`Switch failed: ${String((err as Error).message ?? err)}`);
      }
      return;
    }

    setBusy(true);
    try {
      setStatus("Encrypting basket...");
      const encResp = await fetch(`${apiBase}/encryptBasket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basket }),
      });
      if (!encResp.ok) {
        throw new Error(`encryptBasket failed: ${encResp.status}`);
      }
      const { basketHash, encryptedBasket } = await encResp.json();

      setStatus("Approving USDx...");
      const feeOverrides = await getFeeOverrides();
      const approveHash = await writeContractAsync({
        address: payNetwork.usdx,
        abi: erc20Abi,
        functionName: "approve",
        args: [payNetwork.routerAndDelivery, totalBase],
        chainId: payChainId,
        ...feeOverrides,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });

      setStatus("Calling pay()...");
      const payHash = await writeContractAsync({
        address: payNetwork.routerAndDelivery,
        abi: routerAbi,
        functionName: "pay",
        args: [totalBase, basketHash, encryptedBasket],
        chainId: payChainId,
        ...feeOverrides,
      });
      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: payHash });
      let batchId: `0x${string}` | undefined;
      try {
        const paidLogs = parseEventLogs({
          abi: routerAbi,
          logs: receipt.logs,
          eventName: "Paid",
        });
        const paid = paidLogs[0];
        if (paid) batchId = paid.args.batchId;
      } catch (_err) {
        // fall through to manual decode
      }

      if (!batchId) {
        const eventSig = "Paid(bytes32,address,uint256,bytes32,bytes)";
        const topic0 = `0x${ethers.keccak256(ethers.toUtf8Bytes(eventSig)).slice(2)}` as `0x${string}`;
        const log = receipt.logs.find(
          (l) => l.address.toLowerCase() === payNetwork.routerAndDelivery.toLowerCase() && l.topics?.[0] === topic0
        );
        if (log) {
          const decoded = decodeEventLog({
            abi: routerAbi,
            data: log.data,
            topics: log.topics,
            eventName: "Paid",
          });
          batchId = decoded.args.batchId as `0x${string}`;
        }
      }

      if (!batchId) {
        throw new Error("Paid event not found in receipt");
      }

      setStatus("Sending batchId to backend...");
      const execResp = await fetch(`${apiBase}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payChainId,
          batchId,
          payTxHash: payHash,
        }),
      });
      const execJson = await execResp.json();
      if (!execResp.ok) {
        throw new Error(`execute failed: ${JSON.stringify(execJson)}`);
      }
      const oasisTx = execJson?.result?.paymentTxHash ?? null;
      setReceiptTx(oasisTx);
      if (oasisTx) setReceiptOpen(true);
      setStatus(`Done. Batch ${batchId}`);
      setQuantities({});
    } catch (err) {
      setStatus(`Error: ${String((err as Error).message ?? err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Primary Shop" subtitle="Build a cross-chain basket and pay once." networks={networks}>
      <BlockingModal open={busy} message={status} />
      <ReceiptModal
        open={receiptOpen}
        href={receiptTx ? `https://explorer.oasis.io/testnet/sapphire/tx/${receiptTx}` : null}
        label="View receipt in Oasis"
        onClose={() => setReceiptOpen(false)}
      />
      <AssetInfoModal
        open={Boolean(activeAsset)}
        asset={activeAsset}
        available={
          activeAsset
            ? Math.max(
                activeAsset.supplyForDemo - (supplyMap[`${activeAsset.chainId}:${activeAsset.tokenId}`] ?? 0),
                0
              )
            : null
        }
        onClose={() => setActiveAsset(null)}
      />
      <div className="shop-layout">
        <div className="panel">
          <div className="panel-title">
            <span>Shop Categories</span>
          <div className="chip-row">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          </div>
          <div className="search-row">
            <input
              className="input"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {loading ? <p className="muted">Loading assets...</p> : null}
          {error ? <p className="muted">Backend error: {error}</p> : null}
          <div className="asset-grid">
            {filteredAssets.map((asset) => (
            <div
              key={`${asset.chainId}-${asset.tokenId}`}
              className="asset-card"
              role="button"
              tabIndex={0}
              onClick={() => setActiveAsset(asset)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveAsset(asset);
              }}
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
                <p className="small muted">{asset.description ?? "No description provided."}</p>
                <div className="asset-meta compact">
                  <span>Health:</span>
                  <strong>{asset.healthScore ?? "—"}</strong>
                </div>
                <div className="asset-meta compact">
                  <span>Available:</span>
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
                <div className="asset-meta compact">
                  <span>Issued:</span>
                  <strong>
                    {asset.supplyForDemo != null ? formatNumber(asset.supplyForDemo) : "—"}
                  </strong>
                </div>
                <div className="asset-meta compact">
                  <span>Price:</span>
                  <strong>{formatNumber(asset.priceUSDx)} USDx</strong>
                </div>
                <div className="stepper">
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleQty(asset, -1); }}>
                    -
                  </button>
                  <span>{quantities[`${asset.chainId}:${asset.tokenId}`] ?? 0}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleQty(asset, 1); }}>
                    +
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>

        <div className="panel basket">
        <div className="panel-title">
          <span>Basket</span>
          <span className="chip ghost">{selected.length} items</span>
        </div>
        {selected.length === 0 ? (
          <p className="muted">Add assets to build a cross-chain basket.</p>
        ) : (
          <div className="basket-list">
            {selected.map((item) => (
              <div key={`${item.asset.chainId}:${item.asset.tokenId}`} className="basket-row">
                <div>
                  <strong>{item.asset.name}</strong>
                  <p className="muted small">
                    {formatChainName(item.asset.chainId)} {formatChainId(item.asset.chainId)} • Token #
                    {item.asset.tokenId}
                  </p>
                </div>
                <div className="basket-meta">
                  <span>{item.qty} × {item.asset.priceUSDx} USDx</span>
                  <strong>{formatNumber(item.asset.priceUSDx * item.qty)} USDx</strong>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="divider" />
        <div className="basket-actions">
          <label>
            Pay chain
            <select
              value={payChainId}
              onChange={(e) => setPayChainId(Number(e.target.value))}
              className="select"
            >
              {Object.entries(networks).map(([id, info]) => (
                <option key={id} value={id}>
                  {formatChainName(Number(id))} {formatChainId(Number(id))}
                </option>
              ))}
            </select>
          </label>
          <div className="total">
            <span>Total</span>
            <strong>{formatNumber(Number(totalUSDx))} USDx</strong>
          </div>
          <button className="button" type="button" onClick={handlePay} disabled={busy}>
            {busy ? "Processing..." : "Pay & Deliver"}
          </button>
          <p className="muted small">{status}</p>
        </div>
        </div>
      </div>
    </Shell>
  );
}
