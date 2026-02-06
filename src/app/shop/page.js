"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { waitForTransactionReceipt } from "@wagmi/core";
import { decodeEventLog, erc20Abi, formatUnits, parseEventLogs, parseGwei, parseUnits } from "viem";
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
import ReceiptModal from "../components/ReceiptModal";
import assetsData from "../../data/assets.json";
import { wagmiConfig } from "src/config/appkit";
import { backendUrl } from "src/app/lib/backendUrl";

const CHAIN_META = {
  11155111: { name: "Sepolia", icon: "/eth.svg" },
  80002: { name: "Polygon Amoy", icon: "/pol.svg" },
  421614: { name: "Arbitrum Sepolia", icon: "/arb.svg" },
};

const numberFormat = new Intl.NumberFormat("en-US");

const formatNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return numberFormat.format(value);
  }
  return value ?? "—";
};

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

const formatScore = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return `${value}/100`;
  return String(value);
};

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "string") {
    return value.includes("USDx") ? value : `${value} USDx`;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${numberFormat.format(value)} USDx`;
  }
  return String(value);
};

const formatApr = (value) => {
  if (value === undefined || value === null || value === false) return null;
  if (typeof value === "string") return value.includes("%") ? value : `${value}%`;
  if (typeof value === "number" && Number.isFinite(value)) return `${value}%`;
  return String(value);
};

const parseAmountBase = (value, decimals) => {
  const cleaned = String(value ?? "").replace(/,/g, ".").trim();
  if (!cleaned) return 0n;
  try {
    const parsed = parseUnits(cleaned, decimals);
    return parsed > 0n ? parsed : 0n;
  } catch {
    return 0n;
  }
};

const totalSupplyAbi = [
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "supply", type: "uint256" }],
  },
];

const maxSupplyAbi = [
  {
    type: "function",
    name: "maxSupply",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "supply", type: "uint256" }],
  },
];

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
];

const apiBase = backendUrl;

const normalizeAssets = (data) => {
  const assets = Array.isArray(data?.assets) ? data.assets : Array.isArray(data) ? data : [];
  return assets.map((asset) => {
    const chainId = Number(asset.chainId);
    const meta = CHAIN_META[chainId] || { name: `Chain ${chainId || "?"}`, icon: "/eth.svg" };
    const image =
      typeof asset.image === "string" && asset.image.trim().length > 0 ? asset.image : null;
    const priceUSDx = toNumber(asset.priceUSDx ?? asset.price) ?? 0;
    const maxSupply =
      toNumber(asset.supplyForDemo ?? asset.maxSupply ?? asset.available ?? asset.issued) ?? null;
    const issuedHint = toNumber(asset.issued ?? asset.minted ?? asset.supply) ?? null;
    const availableHint = toNumber(asset.available ?? asset.supplyForDemo ?? asset.supply) ?? null;
    const issuerScoreValue =
      toNumber(asset.issuer_score ?? asset.issuerScore ?? asset.issuerRate) ?? null;
    const healthScore = toNumber(asset.healthScore ?? asset.health_score) ?? null;

    return {
      name: asset.name ?? "Untitled",
      issuer: asset.subname ?? asset.issuer ?? asset.issuer_name ?? "—",
      category: asset.category ?? "Other",
      network: meta.name,
      chainIcon: meta.icon,
      chainId,
      tokenId: Number(asset.tokenId),
      contract: asset.contract ?? asset.rwa1155 ?? null,
      price: formatPrice(asset.priceUSDx ?? asset.price),
      priceUSDx,
      apr: formatApr(asset.apr),
      aprValue: typeof asset.apr === "number" ? asset.apr : null,
      image,
      description: asset.description ?? "",
      maxSupply,
      issuedHint,
      availableHint,
      issuerScore: formatScore(asset.issuer_score ?? asset.issuerScore ?? asset.issuerRate),
      issuerScoreValue,
      healthScore,
    };
  });
};

export default function ShopPage() {
  const { address, isConnected } = useAccount();
  const walletChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const cards = useMemo(() => normalizeAssets(assetsData), []);
  const networks = assetsData?.networks ?? {};
  const categories = useMemo(() => {
    const unique = new Set(cards.map((card) => card.category).filter(Boolean));
    const list = Array.from(unique);
    const hasOther = list.includes("Other");
    const sorted = list.filter((label) => label !== "Other").sort();
    if (hasOther) sorted.push("Other");
    return ["All", ...sorted];
  }, [cards]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [strategyAmount, setStrategyAmount] = useState("");
  const [strategyKey, setStrategyKey] = useState(null);
  const [strategyQuantities, setStrategyQuantities] = useState({});
  const [payChainId, setPayChainId] = useState(11155111);
  const publicClient = usePublicClient({ chainId: payChainId });
  const [status, setStatus] = useState("Ready.");
  const [busy, setBusy] = useState(false);
  const [receiptTx, setReceiptTx] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const supplyCards = useMemo(
    () => cards.filter((card) => card.contract && card.tokenId),
    [cards]
  );

  useEffect(() => {
    if (walletChainId && networks[String(walletChainId)]) {
      setPayChainId(walletChainId);
    }
  }, [walletChainId, networks]);

  const totalSupplyQueries = useMemo(
    () =>
      supplyCards.map((card) => ({
        abi: totalSupplyAbi,
        address: card.contract,
        functionName: "totalSupply",
        args: [BigInt(card.tokenId)],
        chainId: card.chainId,
      })),
    [supplyCards]
  );

  const maxSupplyQueries = useMemo(
    () =>
      supplyCards.map((card) => ({
        abi: maxSupplyAbi,
        address: card.contract,
        functionName: "maxSupply",
        args: [BigInt(card.tokenId)],
        chainId: card.chainId,
      })),
    [supplyCards]
  );

  const { data: totalSupplyData } = useReadContracts({
    contracts: totalSupplyQueries,
    query: {
      enabled: totalSupplyQueries.length > 0,
      refetchInterval: 15000,
    },
  });

  const { data: maxSupplyData } = useReadContracts({
    contracts: maxSupplyQueries,
    query: {
      enabled: maxSupplyQueries.length > 0,
      refetchInterval: 60000,
    },
  });

  const mintedMap = useMemo(() => {
    const map = {};
    if (!totalSupplyData) return map;
    totalSupplyData.forEach((item, idx) => {
      const card = supplyCards[idx];
      if (!card) return;
      const value = item?.result;
      if (typeof value === "bigint") {
        map[`${card.chainId}:${card.tokenId}`] = Number(value);
      }
    });
    return map;
  }, [totalSupplyData, supplyCards]);

  const maxMap = useMemo(() => {
    const map = {};
    if (!maxSupplyData) return map;
    maxSupplyData.forEach((item, idx) => {
      const card = supplyCards[idx];
      if (!card) return;
      const value = item?.result;
      if (typeof value === "bigint") {
        map[`${card.chainId}:${card.tokenId}`] = Number(value);
      }
    });
    return map;
  }, [maxSupplyData, supplyCards]);

  const payNetwork = networks[String(payChainId)];
  const usdxQueries = useMemo(() => {
    if (!address || !payNetwork?.usdx) return [];
    return [
      {
        abi: erc20Abi,
        address: payNetwork.usdx,
        functionName: "balanceOf",
        args: [address],
        chainId: payChainId,
      },
      {
        abi: erc20Abi,
        address: payNetwork.usdx,
        functionName: "decimals",
        args: [],
        chainId: payChainId,
      },
    ];
  }, [address, payChainId, payNetwork?.usdx]);

  const { data: usdxData } = useReadContracts({
    contracts: usdxQueries,
    query: {
      enabled: usdxQueries.length > 0,
      refetchInterval: 15000,
    },
  });

  const usdxBalanceBase = (usdxData?.[0]?.result ?? 0n);
  const usdxDecimals = Number(usdxData?.[1]?.result ?? 6);
  const usdxBalanceValue = useMemo(() => {
    if (!isConnected || !address || !usdxData) return null;
    return Number(formatUnits(usdxBalanceBase, usdxDecimals));
  }, [address, isConnected, usdxBalanceBase, usdxDecimals, usdxData]);

  const strategyBudgetBase = useMemo(
    () => parseAmountBase(strategyAmount, usdxDecimals),
    [strategyAmount, usdxDecimals]
  );
  const strategyValid =
    isConnected && strategyBudgetBase > 0n && usdxBalanceBase > 0n && strategyBudgetBase <= usdxBalanceBase;

  const getAvailable = (card) => {
    const key = `${card.chainId}:${card.tokenId}`;
    const minted = mintedMap[key] ?? 0;
    const maxSupply = maxMap[key] && maxMap[key] > 0 ? maxMap[key] : card.maxSupply;
    if (maxSupply == null) return Infinity;
    return Math.max(maxSupply - minted, 0);
  };

  const getStrategyAssets = (key) => {
    const list = cards.filter((card) => card.priceUSDx > 0 && getAvailable(card) > 0);
    if (!list.length) return [];
    if (key === "D") {
      return [...list].sort((a, b) => a.priceUSDx - b.priceUSDx).slice(0, 6);
    }
    return [...list].sort((a, b) => a.priceUSDx - b.priceUSDx).slice(0, 6);
  };

  const getWeight = (card, key) => {
    const issuer = Math.max(card.issuerScoreValue ?? 50, 1);
    const health = Math.max(card.healthScore ?? 50, 1);
    const apr = typeof card.aprValue === "number" ? card.aprValue : 0;
    if (key === "A") return issuer * health;
    if (key === "B") return Math.max(apr, 0) * (issuer / 100);
    if (key === "C") return issuer * 0.5 + health * 0.5;
    return 1 / Math.max(card.priceUSDx, 1);
  };

  const selectedSummary = useMemo(() => {
    const entries = Object.entries(strategyQuantities).filter(([, qty]) => qty > 0);
    const totalAssets = entries.length;
    const totalTokens = entries.reduce((acc, [, qty]) => acc + qty, 0);
    return { totalAssets, totalTokens };
  }, [strategyQuantities]);

  const selectedKeys = useMemo(() => {
    const keys = Object.keys(strategyQuantities).filter((key) => strategyQuantities[key] > 0);
    return new Set(keys);
  }, [strategyQuantities]);

  const hasSelection = selectedSummary.totalAssets > 0;

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

  const handleStrategy = (key) => {
    if (!strategyValid) {
      setStatus("Enter a valid amount within your balance.");
      return;
    }
    setActiveCategory("All");
    setQuery("");
    const pool = getStrategyAssets(key);
    if (!pool.length) {
      setStatus("No assets available for this strategy.");
      return;
    }
    const budgetNumber = Number(formatUnits(strategyBudgetBase, usdxDecimals));
    const maxShare = key === "B" ? 0.35 : key === "D" ? 0.4 : 0.3;
    const weights = pool.map((card) => Math.max(getWeight(card, key), 0));
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    const next = {};
    let spent = 0;
    pool.forEach((card, idx) => {
      const share = totalWeight ? (budgetNumber * weights[idx]) / totalWeight : 0;
      const rawQty = Math.floor(share / card.priceUSDx);
      const maxQtyByCap = Math.floor((budgetNumber * maxShare) / card.priceUSDx);
      const maxQty = Math.min(getAvailable(card), maxQtyByCap);
      const qty = Math.max(0, Math.min(rawQty, maxQty));
      next[`${card.chainId}:${card.tokenId}`] = qty;
      spent += qty * card.priceUSDx;
    });

    const withQty = pool.filter((card) => (next[`${card.chainId}:${card.tokenId}`] ?? 0) > 0);
    if (withQty.length < 3) {
      const candidates = pool
        .filter((card) => (next[`${card.chainId}:${card.tokenId}`] ?? 0) === 0)
        .sort((a, b) => a.priceUSDx - b.priceUSDx);
      for (const card of candidates) {
        if (withQty.length >= 3) break;
        if (spent + card.priceUSDx > budgetNumber) break;
        if (getAvailable(card) < 1) continue;
        const keyCard = `${card.chainId}:${card.tokenId}`;
        next[keyCard] = 1;
        spent += card.priceUSDx;
        withQty.push(card);
      }
    }

    const cheapest = [...pool].sort((a, b) => a.priceUSDx - b.priceUSDx)[0];
    if (cheapest) {
      const keyCheapest = `${cheapest.chainId}:${cheapest.tokenId}`;
      const maxQty = getAvailable(cheapest);
      while (spent + cheapest.priceUSDx <= budgetNumber && (next[keyCheapest] ?? 0) + 1 <= maxQty) {
        next[keyCheapest] = (next[keyCheapest] ?? 0) + 1;
        spent += cheapest.priceUSDx;
      }
    }

    setStrategyKey(key);
    setStrategyQuantities(next);
    setStatus("Strategy applied.");
  };

  const handleBuySuggested = async () => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!payNetwork?.usdx || !payNetwork?.routerAndDelivery) {
      setStatus("Unknown pay network.");
      return;
    }
    const selected = cards
      .map((card) => ({
        card,
        qty: strategyQuantities[`${card.chainId}:${card.tokenId}`] ?? 0,
      }))
      .filter((item) => item.qty > 0 && item.card.contract);

    if (!selected.length) {
      setStatus("Select a strategy first.");
      return;
    }
    if (walletChainId !== payChainId) {
      setStatus("Switching wallet network...");
      try {
        await switchChainAsync({ chainId: payChainId });
        setStatus("Network switched. Click buy again.");
      } catch (err) {
        setStatus(`Switch failed: ${String(err?.message ?? err)}`);
      }
      return;
    }

    const totalBase = selected.reduce((acc, item) => {
      const unitBase = parseUnits(String(item.card.priceUSDx || 0), usdxDecimals);
      return acc + unitBase * BigInt(item.qty);
    }, 0n);

    if (totalBase <= 0n) {
      setStatus("Invalid total amount.");
      return;
    }
    if (usdxBalanceBase && totalBase > usdxBalanceBase) {
      setStatus("Insufficient USDx balance.");
      return;
    }

    const basket = {
      to: address,
      legs: [],
    };
    const legs = new Map();
    selected.forEach(({ card, qty }) => {
      const key = `${card.chainId}:${card.contract}`;
      const leg = legs.get(key) ?? {
        chainId: card.chainId,
        rwa1155: card.contract,
        tokenIds: [],
        amounts: [],
      };
      leg.tokenIds.push(card.tokenId);
      leg.amounts.push(qty);
      legs.set(key, leg);
    });
    basket.legs = Array.from(legs.values());

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

      setStatus("Processing payment...");
      const payHash = await writeContractAsync({
        address: payNetwork.routerAndDelivery,
        abi: routerAbi,
        functionName: "pay",
        args: [totalBase, basketHash, encryptedBasket],
        chainId: payChainId,
        ...feeOverrides,
      });
      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: payHash });
      let batchId = null;
      try {
        const paidLogs = parseEventLogs({
          abi: routerAbi,
          logs: receipt.logs,
          eventName: "Paid",
        });
        batchId = paidLogs?.[0]?.args?.batchId ?? null;
      } catch (_err) {
        batchId = null;
      }
      if (!batchId) {
        for (const log of receipt.logs ?? []) {
          try {
            const decoded = decodeEventLog({
              abi: routerAbi,
              data: log.data,
              topics: log.topics,
              eventName: "Paid",
            });
            batchId = decoded?.args?.batchId ?? null;
            if (batchId) break;
          } catch (_err) {
            // ignore
          }
        }
      }
      if (!batchId) {
        throw new Error("Paid event not found in receipt");
      }

      setStatus("Recording receipt on Oasis...");
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
      setStrategyQuantities({});
      setStrategyKey(null);
      setStrategyAmount("");
    } catch (err) {
      setStatus(`Error: ${String(err?.message ?? err)}`);
    } finally {
      setBusy(false);
    }
  };

  const filteredCards = useMemo(() => {
    if (selectedKeys.size > 0) {
      return cards.filter((card) => selectedKeys.has(`${card.chainId}:${card.tokenId}`));
    }
    const q = query.trim().toLowerCase();
    return cards.filter((card) => {
      const matchesCategory = activeCategory === "All" || card.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [
        card.name,
        card.issuer,
        card.category,
        card.description,
        card.network,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [cards, activeCategory, query, selectedKeys]);

  const getCardBackground = (image) => {
    if (!image) return undefined;
    if (typeof image === "string" && image.startsWith("http")) {
      return { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    return { background: image };
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
      <section className="hero">
        <div className="hero-top">
          <h1>Multi-chain RWAs, one control plane.</h1>
          <p>
            RWAs are fragmented across chains and wallets. RWA Hub unifies them so you can
            discover, buy, and manage from one network.
          </p>
          <p>
            Your positions live here. Oasis Sapphire keeps the canonical history with asset
            privacy, while your wallet reflects what you own right now.
          </p>
        </div>
      </section>

      <section className="placeholder">
        <div className="strategies">
          <div className="strategies-header">
            <span className="eyebrow">Portfolio helper</span>
            <span className={`muted ${hasSelection ? "is-active" : ""}`}>
              {hasSelection
                ? `Selected ${selectedSummary.totalAssets} assets, total tokens ${selectedSummary.totalTokens}`
                : "Build a balanced portfolio for a target amount."}
            </span>
          </div>
          <div className="strategies-row">
            <label className="strategy-input">
              <input
                type="number"
                placeholder="Target amount (USDx)"
                min="0"
                step="1"
                value={strategyAmount}
                onChange={(e) => {
                  setStrategyAmount(e.target.value);
                  setStrategyKey(null);
                  setStrategyQuantities({});
                }}
              />
            </label>
            <div className="strategy-actions">
              {[
                { key: "A", label: "Low-risk" },
                { key: "C", label: "Balanced" },
                { key: "B", label: "Growth" },
                { key: "D", label: "High-profit" },
              ].map((item) => (
                <button
                  key={item.key}
                  className={`strategy-button ${strategyValid ? "is-ready" : ""} ${
                    strategyKey === item.key ? "is-active" : ""
                  }`}
                  type="button"
                  onClick={() => handleStrategy(item.key)}
                  disabled={!strategyValid || busy}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              className="buy-button"
              type="button"
              onClick={handleBuySuggested}
              disabled={!hasSelection || busy}
            >
              Buy Suggested Assets
            </button>
          </div>
        </div>
        <div className="filters-row">
          <div className="filters">
            {categories.map((label) => (
              <button
                key={label}
                className={`pill filter-pill ${activeCategory === label ? "is-active" : ""}`}
                type="button"
                onClick={() => {
                  if (hasSelection) {
                    setStrategyKey(null);
                    setStrategyQuantities({});
                  }
                  setActiveCategory(label);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="search">
            <input
              type="text"
              placeholder="Search assets"
              value={query}
              onChange={(e) => {
                if (hasSelection) {
                  setStrategyKey(null);
                  setStrategyQuantities({});
                }
                setQuery(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="grid">
          {filteredCards.map((card) => {
            const key = `${card.chainId}:${card.tokenId}`;
            const minted = mintedMap[key];
            const maxSupply = maxMap[key] && maxMap[key] > 0 ? maxMap[key] : card.maxSupply;
            const available =
              maxSupply != null && minted != null ? Math.max(maxSupply - minted, 0) : card.availableHint;

            return (
              <Link key={key} className="card" href={`/asset/${card.chainId}/${card.tokenId}`}>
                <div className={`card-media ${card.image ? "has-image" : "no-image"}`}>
                  <div className="card-media-bg" style={getCardBackground(card.image)} />
                  <div className="card-media-top">
                    {card.apr ? <span className="badge">APR {card.apr}</span> : <span />}
                    <span className="network-pill">
                      <img src={card.chainIcon} alt="" aria-hidden="true" />
                    </span>
                  </div>
                  {!card.image ? <div className="glyph">{card.category.slice(0, 2)}</div> : null}
                </div>
                <div className="card-body">
                  <div className="card-category">{card.category}</div>
                  <div className="card-title">{card.name}</div>
                  <div className="card-sub">{card.issuer}</div>
                  <div className="card-description">{card.description}</div>
                  <div className="card-stats">
                    <div>
                      <span>Issuer Rate</span>
                      <strong>{card.issuerScore}</strong>
                    </div>
                    <div>
                      <span>Available</span>
                      <strong>{formatNumber(available)}</strong>
                    </div>
                    <div>
                      <span>Issued</span>
                      <strong>{formatNumber(maxSupply ?? card.issuedHint)}</strong>
                    </div>
                  </div>
                  <div className="card-price">{card.price}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </Shell>
  );
}
