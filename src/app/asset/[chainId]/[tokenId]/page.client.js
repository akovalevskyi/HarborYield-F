"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import Shell from "../../../components/Shell";
import BlockingModal from "../../../components/BlockingModal";
import ReceiptModal from "../../../components/ReceiptModal";
import assetsData from "../../../../data/assets.json";
import { appKit } from "src/app/lib/appkitClient";
import { backendUrl } from "src/app/lib/backendUrl";
import { wagmiConfig } from "src/config/appkit";

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

const apiBase = backendUrl;

export default function AssetPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const walletChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const chainId = Number(params.chainId);
  const tokenId = Number(params.tokenId);
  const networks = assetsData?.networks ?? {};
  const assets = Array.isArray(assetsData?.assets) ? assetsData.assets : [];
  const asset = useMemo(
    () => assets.find((item) => Number(item.chainId) === chainId && Number(item.tokenId) === tokenId),
    [assets, chainId, tokenId]
  );
  const [payChainId, setPayChainId] = useState(11155111);
  const payNetwork = networks[String(payChainId)];
  const publicClient = usePublicClient({ chainId: payChainId });
  const [status, setStatus] = useState("Ready.");
  const [busy, setBusy] = useState(false);
  const [receiptTx, setReceiptTx] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    if (walletChainId && networks[String(walletChainId)]) {
      setPayChainId(walletChainId);
      return;
    }
    if (asset?.chainId && networks[String(asset.chainId)]) {
      setPayChainId(asset.chainId);
    }
  }, [asset?.chainId, networks, walletChainId]);

  const chainMeta = CHAIN_META[chainId] || {
    name: assetsData?.networks?.[String(chainId)]?.name ?? `Chain ${chainId || "?"}`,
    icon: "/eth.svg",
  };

  const image =
    typeof asset?.image === "string" && asset.image.trim().length > 0
      ? asset.image
      : "linear-gradient(135deg, #cfd6df, #f4f1ed)";
  const imageStyle = useMemo(() => {
    if (!image) return undefined;
    if (typeof image === "string" && (image.startsWith("http") || image.startsWith("/"))) {
      return {
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { background: image };
  }, [image]);
  const unitPrice = toNumber(asset?.priceUSDx ?? asset?.price) ?? 0;
  const issuerRateRaw = asset?.issuer_score ?? asset?.issuerScore ?? asset?.issuerRate ?? null;
  const issuerRate =
    typeof issuerRateRaw === "number" ? `${issuerRateRaw}/100` : issuerRateRaw ?? "—";
  const fallbackMaxSupply =
    toNumber(asset?.supplyForDemo ?? asset?.maxSupply ?? asset?.available ?? asset?.issued ?? asset?.supply) ??
    null;
  const aprValue = asset?.apr;
  const aprLabel =
    aprValue === true
      ? "APR"
      : typeof aprValue === "number"
      ? `${aprValue}%`
      : typeof aprValue === "string"
      ? aprValue
      : null;

  const supplyQueries = useMemo(() => {
    if (!asset?.contract) return [];
    return [
      {
        abi: totalSupplyAbi,
        address: asset.contract,
        functionName: "totalSupply",
        args: [BigInt(tokenId)],
        chainId,
      },
      {
        abi: maxSupplyAbi,
        address: asset.contract,
        functionName: "maxSupply",
        args: [BigInt(tokenId)],
        chainId,
      },
    ];
  }, [asset?.contract, chainId, tokenId]);

  const { data: supplyData } = useReadContracts({
    contracts: supplyQueries,
    query: { enabled: supplyQueries.length > 0, refetchInterval: 15000 },
  });

  const mintedOnChain =
    typeof supplyData?.[0]?.result === "bigint" ? Number(supplyData[0].result) : null;
  const maxOnChain =
    typeof supplyData?.[1]?.result === "bigint" ? Number(supplyData[1].result) : null;

  const issuedValue = maxOnChain ?? fallbackMaxSupply;
  const availableValue =
    issuedValue != null ? Math.max(issuedValue - (mintedOnChain ?? 0), 0) : null;

  const [qty, setQty] = useState(1);
  const totalPrice = useMemo(() => {
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 0;
    return safeQty * unitPrice;
  }, [qty, unitPrice]);

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

  const totalBase = useMemo(() => {
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 0;
    if (!unitPrice || safeQty <= 0) return 0n;
    try {
      const unit = parseUnits(String(unitPrice), usdxDecimals);
      return unit * BigInt(safeQty);
    } catch (_err) {
      return 0n;
    }
  }, [qty, unitPrice, usdxDecimals]);

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

  const handleBuy = async () => {
    if (!asset) {
      setStatus("Asset not found.");
      return;
    }
    if (!asset.contract) {
      setStatus("Missing asset contract.");
      return;
    }
    if (!isConnected || !address) {
      appKit?.open?.();
      setStatus("Connect wallet first.");
      return;
    }
    if (!payNetwork?.usdx || !payNetwork?.routerAndDelivery) {
      setStatus("Unknown pay network.");
      return;
    }
    if (totalBase <= 0n) {
      setStatus("Enter a valid quantity.");
      return;
    }
    if (usdxBalanceBase && totalBase > usdxBalanceBase) {
      const balance = Number(formatUnits(usdxBalanceBase, usdxDecimals));
      setStatus(`Not enough USDx. Balance: ${formatNumber(balance)}`);
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

    setBusy(true);
    try {
      setStatus("Encrypting order...");
      const basket = {
        to: address,
        legs: [
          {
            chainId: asset.chainId,
            rwa1155: asset.contract,
            tokenIds: [asset.tokenId],
            amounts: [Math.max(1, Math.floor(qty))],
          },
        ],
      };
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
            // ignore non-matching logs
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
    } catch (err) {
      setStatus(`Error: ${String(err?.message ?? err)}`);
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
      <button className="back-button" type="button" onClick={() => router.back()}>
        ← Back
      </button>
      {!asset ? (
        <section className="asset-hero">
          <div className="asset-media" style={imageStyle} />
          <div className="asset-info">
            <div className="card-category">Unknown</div>
            <h1>Asset not found</h1>
            <div className="asset-sub">
              Chain {params.chainId} · Token {params.tokenId}
            </div>
            <p className="asset-description">
              We couldn&apos;t find this asset in the current dataset.
            </p>
          </div>
        </section>
      ) : (
        <section className="asset-hero">
          <div className="asset-media" style={imageStyle}>
            {aprLabel ? <span className="badge badge-top">APR {aprLabel}</span> : null}
          </div>
          <div className="asset-info">
            <div className="card-category">{asset.category ?? "Other"}</div>
            <h1>{asset.name ?? "Untitled"}</h1>
            <div className="asset-sub">{asset.subname ?? asset.issuer ?? "—"}</div>
            <p className="asset-description">{asset.description ?? "—"}</p>
            <div className="asset-network">
              <span className="network-pill">
                <img src={chainMeta.icon} alt="" aria-hidden="true" />
              </span>
              <span>{chainMeta.name}</span>
            </div>
            <div className="asset-meta">
              <div>
                <span>Issuer Rate</span>
                <strong>{issuerRate}</strong>
              </div>
            <div>
              <span>Available</span>
              <strong>{availableValue != null ? formatNumber(availableValue) : "—"}</strong>
            </div>
            <div>
              <span>Issued</span>
              <strong>{issuedValue != null ? formatNumber(issuedValue) : "—"}</strong>
            </div>
            </div>
            <div className="asset-actions">
              <div className="asset-price">
                {unitPrice > 0 ? `${formatNumber(unitPrice)} USDx` : "—"}
              </div>
              <label className="asset-qty">
                <span>Quantity</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                />
              </label>
              <button
                className="buy-button"
                type="button"
                onClick={handleBuy}
                disabled={busy || !asset}
              >
                Buy · {formatNumber(totalPrice)} USDx
              </button>
            </div>
            <div className="asset-foot">
              <div>Contract: {asset.contract ?? "—"}</div>
              <div>
                Chain: {params.chainId} · Token: {params.tokenId}
              </div>
            </div>
          </div>
        </section>
      )}
    </Shell>
  );
}
