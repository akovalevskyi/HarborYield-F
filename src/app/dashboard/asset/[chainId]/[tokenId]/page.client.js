"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useSignTypedData,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { erc1155Abi, parseAbiItem, parseGwei } from "viem";
import ReactECharts from "echarts-for-react";
import Shell from "../../../../components/Shell";
import BlockingModal from "../../../../components/BlockingModal";
import ReceiptModal from "../../../../components/ReceiptModal";
import { useAssets } from "../../../../lib/useAssets";
import { formatChainName } from "../../../../lib/chainLabel";
import { wagmiConfig } from "src/config/appkit";
import { backendUrl } from "src/app/lib/backendUrl";

const marketAbi = [
  {
    type: "function",
    name: "nonces",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "nonce", type: "uint256" }],
  },
];

const balanceAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ name: "balance", type: "uint256" }],
  },
];

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

const formatEntryType = (kind) => {
  if (kind === 1) return "Minted";
  if (kind === 2) return "Delivered";
  if (kind === 3) return "Trade";
  if (kind === 4) return "Transfer";
  if (kind === 5) return "Listed";
  if (kind === 6) return "Burned";
  return "Activity";
};

const formatDateLabel = (ts, fallbackId) => {
  if (ts && Number.isFinite(ts)) {
    return new Date(ts * 1000).toLocaleDateString();
  }
  if (fallbackId != null) return `Entry ${String(fallbackId)}`;
  return "—";
};

export default function DashboardAssetPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const walletChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { signTypedDataAsync } = useSignTypedData();
  const { assets, networks } = useAssets();
  const chainId = Number(params.chainId);
  const tokenId = Number(params.tokenId);
  const publicClient = usePublicClient({ chainId });
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);
  const [sellPrice, setSellPrice] = useState(0);
  const [status, setStatus] = useState("Ready.");
  const [busy, setBusy] = useState(false);
  const [receiptHref, setReceiptHref] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [priceSeries, setPriceSeries] = useState([]);
  const [priceLoading, setPriceLoading] = useState(false);
  const [historySource, setHistorySource] = useState("oasis");
  const [historyNonce, setHistoryNonce] = useState(0);
  const asset = useMemo(
    () => assets.find((item) => Number(item.chainId) === chainId && Number(item.tokenId) === tokenId),
    [assets, chainId, tokenId]
  );
  const network = networks?.[String(chainId)];

  const chainMeta = useMemo(() => {
    const networkName = networks?.[String(chainId)]?.name;
    const name = networkName
      ? networkName.charAt(0).toUpperCase() + networkName.slice(1)
      : formatChainName(chainId);
    const icon = chainId === 80002 ? "/pol.svg" : "/eth.svg";
    return { name, icon };
  }, [chainId, networks]);

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
  const issuerRateRaw = asset?.issuerScore ?? asset?.issuer_score ?? asset?.issuerRate ?? null;
  const issuerRate =
    typeof issuerRateRaw === "number" ? `${issuerRateRaw}/100` : issuerRateRaw ?? "—";
  const issuedRaw = asset?.supplyForDemo ?? asset?.issued ?? asset?.supply ?? asset?.available;
  const aprValue = asset?.apr;
  const aprLabel =
    aprValue === true
      ? "APR"
      : typeof aprValue === "number"
      ? `${aprValue}%`
      : typeof aprValue === "string"
      ? aprValue
      : null;

  const contractAddress = asset?.contract ?? "0x0000000000000000000000000000000000000000";

  const { data: ownedBalance } = useReadContract({
    abi: balanceAbi,
    address: contractAddress,
    functionName: "balanceOf",
    args: address && asset ? [address, BigInt(asset.tokenId)] : undefined,
    chainId,
    query: { enabled: Boolean(address && asset?.contract) },
  });

  const ownedQty = Number(ownedBalance ?? 0n);
  const ownedValue = ownedQty * unitPrice;

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

  useEffect(() => {
    if (sellPrice > 0 || !unitPrice) return;
    setSellPrice(unitPrice);
  }, [sellPrice, unitPrice]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!asset) return;
      setPriceLoading(true);
      try {
        let normalized = [];
        let source = "oasis";
        try {
          const res = await fetch(
            `${backendUrl}/entries/asset/${asset.chainId}/${asset.contract}/${asset.tokenId}`
          );
          if (res.ok) {
            const json = await res.json();
            const entries = Array.isArray(json?.entries) ? json.entries : [];
            normalized = entries
              .map((entry) => ({
                id: Number(entry.id),
                kind: Number(entry.kind),
                price: Number(entry.price ?? 0),
                amount: Number(entry.amount ?? 0),
                recordedAt: Number(entry.recordedAt ?? 0),
              }))
              .sort((a, b) => (b.recordedAt || 0) - (a.recordedAt || 0));
          }
        } catch (_err) {
          normalized = [];
        }

        if (!normalized.length && publicClient && asset?.contract) {
          source = "chain";
          const latestBlock = await publicClient.getBlockNumber();
          const fromBlock = latestBlock > 200000n ? latestBlock - 200000n : 0n;
          const transferSingleEvent = parseAbiItem(
            "event TransferSingle(address indexed operator,address indexed from,address indexed to,uint256 id,uint256 value)"
          );
          const transferBatchEvent = parseAbiItem(
            "event TransferBatch(address indexed operator,address indexed from,address indexed to,uint256[] ids,uint256[] values)"
          );

          const [singleLogs, batchLogs] = await Promise.all([
            publicClient.getLogs({
              address: asset.contract,
              event: transferSingleEvent,
              fromBlock,
              toBlock: latestBlock,
            }),
            publicClient.getLogs({
              address: asset.contract,
              event: transferBatchEvent,
              fromBlock,
              toBlock: latestBlock,
            }),
          ]);

          const ZERO = "0x0000000000000000000000000000000000000000";
          const entries = [];

          singleLogs.forEach((log) => {
            const id = Number(log.args?.id ?? 0);
            if (id !== tokenId) return;
            const amount = Number(log.args?.value ?? 0);
            const from = String(log.args?.from ?? "");
            const to = String(log.args?.to ?? "");
            let kind = 4;
            if (from.toLowerCase() === ZERO) kind = 1;
            if (to.toLowerCase() === ZERO) kind = 6;
            entries.push({
              id: log.transactionHash ?? `${log.blockNumber}-${log.logIndex}`,
              kind,
              price: 0,
              amount,
              blockNumber: log.blockNumber,
            });
          });

          batchLogs.forEach((log) => {
            const ids = Array.isArray(log.args?.ids) ? log.args.ids.map((v) => Number(v)) : [];
            const values = Array.isArray(log.args?.values)
              ? log.args.values.map((v) => Number(v))
              : [];
            const idx = ids.findIndex((id) => id === tokenId);
            if (idx === -1) return;
            const amount = values[idx] ?? 0;
            const from = String(log.args?.from ?? "");
            const to = String(log.args?.to ?? "");
            let kind = 4;
            if (from.toLowerCase() === ZERO) kind = 1;
            if (to.toLowerCase() === ZERO) kind = 6;
            entries.push({
              id: log.transactionHash ?? `${log.blockNumber}-${log.logIndex}`,
              kind,
              price: 0,
              amount,
              blockNumber: log.blockNumber,
            });
          });

          const uniqueBlocks = Array.from(new Set(entries.map((entry) => entry.blockNumber)));
          const blockMap = new Map();
          await Promise.all(
            uniqueBlocks.map(async (blockNumber) => {
              if (blockNumber == null) return;
              const block = await publicClient.getBlock({ blockNumber });
              blockMap.set(blockNumber, Number(block.timestamp));
            })
          );

          normalized = entries
            .map((entry) => ({
              id: entry.id,
              kind: entry.kind,
              price: entry.price,
              amount: entry.amount,
              recordedAt: blockMap.get(entry.blockNumber) ?? 0,
            }))
            .sort((a, b) => (b.recordedAt || 0) - (a.recordedAt || 0));
        }

        if (!active) return;
        setHistoryEntries(normalized);
        setHistorySource(normalized.length ? source : "none");

        const timeline = [];
        if (unitPrice) {
          const oldestTs =
            normalized.length > 0
              ? Math.min(
                  ...normalized.map((e) => (e.recordedAt > 0 ? e.recordedAt : Date.now() / 1000))
                )
              : Math.floor(Date.now() / 1000);
          timeline.push({ ts: oldestTs - 86400, value: Number(unitPrice) });
        }

        for (const entry of normalized) {
          if (entry.kind !== 3 && entry.kind !== 5) continue;
          const unit = entry.amount > 0 ? entry.price / entry.amount : entry.price;
          if (!unit) continue;
          timeline.push({ ts: entry.recordedAt || Math.floor(Date.now() / 1000), value: unit });
        }

        timeline.sort((a, b) => a.ts - b.ts);
        let series = timeline.map((point) => ({
          name: new Date(point.ts * 1000).toLocaleDateString(),
          value: Math.round(point.value * 100) / 100,
        }));

        if (!series.length && unitPrice) {
          const seed = (tokenId || 1) % 7;
          const values = [
            unitPrice * (0.92 + seed * 0.01),
            unitPrice * (1.04 - seed * 0.005),
            unitPrice * (0.97 + seed * 0.004),
            unitPrice * (1.02 - seed * 0.003),
            unitPrice,
          ];
          const today = new Date();
          series = values.map((value, idx) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (values.length - 1 - idx));
            return { name: d.toLocaleDateString(), value: Math.round(value * 100) / 100 };
          });
        }

        if (series.length === 1) {
          const d = new Date();
          d.setDate(d.getDate() - 1);
          series.unshift({ name: d.toLocaleDateString(), value: series[0].value });
        }

        if (active) setPriceSeries(series);
      } catch (_err) {
        if (!active) return;
        setHistoryEntries([]);
        setPriceSeries([]);
      } finally {
        if (active) setPriceLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [asset, tokenId, unitPrice, historyNonce]);

  const handleTransfer = async () => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!asset || !network?.routerAndDelivery) {
      setStatus("Asset not found.");
      return;
    }
    if (!transferTo) {
      setStatus("Recipient address required.");
      return;
    }
    if (transferAmount <= 0) {
      setStatus("Amount must be positive.");
      return;
    }
    if (walletChainId !== chainId) {
      setStatus("Switching chain...");
      try {
        await switchChainAsync({ chainId });
      } catch (err) {
        setStatus(`Switch failed: ${String(err?.message ?? err)}`);
        return;
      }
    }
    setBusy(true);
    try {
      setStatus("Approving transfer...");
      const feeOverrides = await getFeeOverrides();
      const approveHash = await writeContractAsync({
        address: asset.contract,
        abi: erc1155Abi,
        functionName: "setApprovalForAll",
        args: [network.routerAndDelivery, true],
        chainId,
        ...feeOverrides,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });

      setStatus("Signing transfer...");
      const nonce = await readContract(wagmiConfig, {
        address: network.routerAndDelivery,
        abi: marketAbi,
        functionName: "nonces",
        args: [address],
        chainId,
      });
      const deadline = Math.floor(Date.now() / 1000) + 600;
      const signature = await signTypedDataAsync({
        domain: {
          name: "AllInOneNEW",
          version: "1",
          chainId,
          verifyingContract: network.routerAndDelivery,
        },
        types: {
          TransferAsset: [
            { name: "from", type: "address" },
            { name: "rwa1155", type: "address" },
            { name: "to", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "TransferAsset",
        message: {
          from: address,
          rwa1155: asset.contract,
          to: transferTo,
          tokenId: BigInt(asset.tokenId),
          amount: BigInt(transferAmount),
          nonce,
          deadline,
        },
      });

      setStatus("Relaying transfer...");
      const resp = await fetch(`${backendUrl}/market/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chainId,
          from: address,
          to: transferTo,
          rwa1155: asset.contract,
          tokenId: asset.tokenId,
          amount: transferAmount,
          deadline,
          signature,
        }),
      });
      const receiptJson = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(receiptJson?.error || `Transfer failed (${resp.status})`);
      }
      if (receiptJson?.oasisTxHash) {
        setReceiptHref(`https://explorer.oasis.io/testnet/sapphire/tx/${receiptJson.oasisTxHash}`);
        setReceiptOpen(true);
      }
      setStatus("Transfer recorded in Oasis.");
      setHistoryNonce((value) => value + 1);
    } catch (err) {
      setStatus(`Transfer error: ${String(err?.message ?? err)}`);
    } finally {
      setBusy(false);
    }
  };

  const handleListing = async () => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!asset || !network?.routerAndDelivery) {
      setStatus("Asset not found.");
      return;
    }
    if (sellAmount <= 0 || sellPrice <= 0) {
      setStatus("Amount and price must be positive.");
      return;
    }
    if (walletChainId !== chainId) {
      setStatus("Switching chain...");
      try {
        await switchChainAsync({ chainId });
      } catch (err) {
        setStatus(`Switch failed: ${String(err?.message ?? err)}`);
        return;
      }
    }
    setBusy(true);
    try {
      setStatus("Approving listing...");
      const feeOverrides = await getFeeOverrides();
      const approveHash = await writeContractAsync({
        address: asset.contract,
        abi: erc1155Abi,
        functionName: "setApprovalForAll",
        args: [network.routerAndDelivery, true],
        chainId,
        ...feeOverrides,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });

      setStatus("Signing listing...");
      const nonce = await readContract(wagmiConfig, {
        address: network.routerAndDelivery,
        abi: marketAbi,
        functionName: "nonces",
        args: [address],
        chainId,
      });
      const deadline = Math.floor(Date.now() / 1000) + 600;
      const signature = await signTypedDataAsync({
        domain: {
          name: "AllInOneNEW",
          version: "1",
          chainId,
          verifyingContract: network.routerAndDelivery,
        },
        types: {
          CreateListing: [
            { name: "seller", type: "address" },
            { name: "rwa1155", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
            { name: "pricePerUnit", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "CreateListing",
        message: {
          seller: address,
          rwa1155: asset.contract,
          tokenId: BigInt(asset.tokenId),
          amount: BigInt(sellAmount),
          pricePerUnit: BigInt(sellPrice),
          nonce,
          deadline,
        },
      });

      setStatus("Relaying listing...");
      const resp = await fetch(`${backendUrl}/market/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chainId,
          seller: address,
          rwa1155: asset.contract,
          tokenId: asset.tokenId,
          amount: sellAmount,
          pricePerUnit: sellPrice,
          deadline,
          signature,
        }),
      });
      const receiptJson = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(receiptJson?.error || `Listing failed (${resp.status})`);
      }
      if (receiptJson?.oasisTxHash) {
        setReceiptHref(`https://explorer.oasis.io/testnet/sapphire/tx/${receiptJson.oasisTxHash}`);
        setReceiptOpen(true);
      }
      setStatus("Listing recorded in Oasis.");
      setHistoryNonce((value) => value + 1);
    } catch (err) {
      setStatus(`Listing error: ${String(err?.message ?? err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <BlockingModal open={busy} message={status} />
      <ReceiptModal
        open={receiptOpen}
        href={receiptHref}
        label="View receipt in Oasis"
        title="Transaction Ready"
        subtitle="Your transaction has been recorded."
        onClose={() => setReceiptOpen(false)}
      />
      <button className="back-button" type="button" onClick={() => router.back()}>
        ← Back
      </button>
      <div className="asset-note">ASSET CARD FOR DASHBOARD</div>
      <section className="asset-hero">
        <div className="asset-media" style={imageStyle}>
          {aprLabel ? <span className="badge badge-top">APR {aprLabel}</span> : null}
        </div>
        <div className="asset-info">
          <div className="card-category">{asset?.category ?? "Other"}</div>
          <h1>{asset?.name ?? "Untitled"}</h1>
          <div className="asset-sub">{asset?.subname ?? asset?.issuer ?? "—"}</div>
          <p className="asset-description">{asset?.description ?? "—"}</p>
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
              <span>Issued</span>
              <strong>{formatNumber(issuedRaw)}</strong>
            </div>
            <div>
              <span>Basic Price</span>
              <strong>{unitPrice ? `${formatNumber(unitPrice)} USDx` : "—"}</strong>
            </div>
          </div>
          <div className="asset-holdings">
            <div className="holding-card">
              <span>You own</span>
              <strong>{formatNumber(ownedQty)}</strong>
            </div>
            <div className="holding-card">
              <span>Value</span>
              <strong>{unitPrice ? `${formatNumber(ownedValue)} USDx` : "—"}</strong>
            </div>
          </div>
          <div className="asset-actions dashboard-actions">
            <div className="action-card">
              <div className="action-title">Transfer to address</div>
              <input
                type="text"
                placeholder="0x…"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
              />
              <button className="buy-button" type="button" onClick={handleTransfer} disabled={busy}>
                Transfer
              </button>
            </div>
            <div className="action-card">
              <div className="action-title">List on marketplace</div>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Amount"
                value={sellAmount}
                onChange={(e) => setSellAmount(Number(e.target.value))}
              />
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Price per unit (USDx)"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
              />
              <button className="buy-button" type="button" onClick={handleListing} disabled={busy}>
                Create listing
              </button>
            </div>
          </div>
          <div className="asset-foot">
            <div>Contract: {asset?.contract ?? "—"}</div>
            <div>Chain: {params.chainId} · Token: {params.tokenId}</div>
          </div>
        </div>
      </section>
      <section className="asset-history">
        <div className="history-grid">
          <div className="history-list">
            <div className="history-title">
              Token history{" "}
              {historySource === "oasis"
                ? "(By Oasis)"
                : historySource === "chain"
                ? "(On-chain)"
                : "(No data)"}
            </div>
            {historyEntries.length ? (
              historyEntries.map((entry) => (
                <div key={entry.id} className="history-row">
                  <div>
                    <div className="history-type">{formatEntryType(entry.kind)}</div>
                    <div className="history-id">{formatDateLabel(entry.recordedAt, entry.id)}</div>
                  </div>
                  <div className="history-meta">
                    <span>{entry.amount ? `${formatNumber(entry.amount)} units` : "—"}</span>
                    <strong>{entry.price ? `${formatNumber(entry.price)} USDx` : "—"}</strong>
                  </div>
                </div>
              ))
            ) : (
              <div className="history-row">
                <div>
                  <div className="history-type">No activity yet</div>
                  <div className="history-id">Oasis has no entries for this asset.</div>
                </div>
                <div className="history-meta">
                  <span>—</span>
                  <strong>—</strong>
                </div>
              </div>
            )}
          </div>
          <div className="chart-card chart-card-glow">
            {priceLoading ? (
              <p className="muted">Loading price history...</p>
            ) : priceSeries.length ? (
              <ReactECharts
                style={{ height: 240, width: "100%" }}
                option={{
                  grid: { left: 8, right: 12, top: 8, bottom: 8, containLabel: true },
                  xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: priceSeries.map((d) => d.name),
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { color: "#6b7280", fontSize: 10 },
                  },
                  yAxis: {
                    type: "value",
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { lineStyle: { color: "rgba(0,0,0,0.06)" } },
                    axisLabel: { color: "#6b7280", fontSize: 10 },
                  },
                  tooltip: {
                    trigger: "axis",
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e5e5",
                    borderWidth: 1,
                    textStyle: { color: "#111111", fontSize: 11 },
                    formatter: (params) => {
                      const point = params?.[0];
                      return point ? `${point.axisValue}<br/><b>${point.data}</b>` : "";
                    },
                  },
                  series: [
                    {
                      type: "line",
                      data: priceSeries.map((d) => d.value),
                      smooth: true,
                      symbol: "circle",
                      symbolSize: 6,
                      lineStyle: {
                        width: 3,
                        color: {
                          type: "linear",
                          x: 0,
                          y: 0,
                          x2: 1,
                          y2: 0,
                          colorStops: [
                            { offset: 0, color: "#22c55e" },
                            { offset: 1, color: "#06b6d4" },
                          ],
                        },
                      },
                      itemStyle: {
                        color: "#ffffff",
                        borderColor: "#22c55e",
                        borderWidth: 2,
                      },
                      areaStyle: {
                        color: {
                          type: "linear",
                          x: 0,
                          y: 0,
                          x2: 0,
                          y2: 1,
                          colorStops: [
                            { offset: 0, color: "rgba(34, 197, 94, 0.22)" },
                            { offset: 1, color: "rgba(6, 182, 212, 0.02)" },
                          ],
                        },
                      },
                    },
                  ],
                }}
              />
            ) : (
              <p className="muted">No price history yet.</p>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
