"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useSignTypedData,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { erc20Abi, parseAbiItem, parseGwei } from "viem";
import ReactECharts from "echarts-for-react";
import Shell from "../../../../components/Shell";
import BlockingModal from "../../../../components/BlockingModal";
import ReceiptModal from "../../../../components/ReceiptModal";
import { useAssets } from "../../../../lib/useAssets";
import { formatChainName } from "../../../../lib/chainLabel";
import { wagmiConfig } from "src/config/appkit";

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

const numberFormat = new Intl.NumberFormat("en-US");

const formatNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return numberFormat.format(value);
  return "—";
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

export default function MarketplaceAssetPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chainId = Number(params.chainId);
  const tokenId = Number(params.tokenId);
  const listingParam = searchParams?.get("listingId");
  const listingIdFromQuery = listingParam ? Number(listingParam) : null;

  const { assets, networks } = useAssets();
  const asset = useMemo(
    () => assets.find((item) => Number(item.chainId) === chainId && Number(item.tokenId) === tokenId),
    [assets, chainId, tokenId]
  );
  const network = networks?.[String(chainId)];

  const { address, isConnected } = useAccount();
  const walletChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { signTypedDataAsync } = useSignTypedData();
  const publicClient = usePublicClient({ chainId });

  const [listing, setListing] = useState(null);
  const [listingLoading, setListingLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("Ready.");
  const [busy, setBusy] = useState(false);
  const [receiptTx, setReceiptTx] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [priceSeries, setPriceSeries] = useState([]);
  const [priceLoading, setPriceLoading] = useState(false);

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

  const unitPrice = listing?.pricePerUnit ?? 0;
  const listedAmount = listing?.amount ?? 0;
  const hasListing = Boolean(listing && listing.active !== false && listedAmount > 0);
  const isMine = address && listing?.seller?.toLowerCase() === address.toLowerCase();

  useEffect(() => {
    if (listedAmount > 0 && qty > listedAmount) {
      setQty(listedAmount);
    }
  }, [listedAmount, qty]);

  const totalPrice = useMemo(() => {
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 0;
    return safeQty * unitPrice;
  }, [qty, unitPrice]);

  const getFeeOverrides = async (chain) => {
    const client = publicClient && publicClient.chain?.id === chain ? publicClient : undefined;
    if (!client) return {};
    const fees = await client.estimateFeesPerGas();
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
    let active = true;
    const loadListing = async () => {
      if (!network?.routerAndDelivery) return;
      setListingLoading(true);
      try {
        if (listingIdFromQuery != null) {
          const data = await readContract(wagmiConfig, {
            address: network.routerAndDelivery,
            abi: marketAbi,
            functionName: "listings",
            args: [BigInt(listingIdFromQuery)],
            chainId,
          });
          if (!active) return;
          setListing({
            id: listingIdFromQuery,
            chainId,
            seller: data[0],
            rwa1155: data[1],
            tokenId: Number(data[2]),
            amount: Number(data[3]),
            pricePerUnit: Number(data[4]),
            active: Boolean(data[5]),
          });
          return;
        }

        const count = await readContract(wagmiConfig, {
          address: network.routerAndDelivery,
          abi: marketAbi,
          functionName: "getActiveListingCount",
          args: [],
          chainId,
        });
        if (count === 0n) {
          setListing(null);
          return;
        }
        const ids = await readContract(wagmiConfig, {
          address: network.routerAndDelivery,
          abi: marketAbi,
          functionName: "getActiveListingIds",
          args: [0n, count],
          chainId,
        });
        for (const rawId of ids) {
          const data = await readContract(wagmiConfig, {
            address: network.routerAndDelivery,
            abi: marketAbi,
            functionName: "listings",
            args: [rawId],
            chainId,
          });
          if (Number(data[2]) !== tokenId) continue;
          if (!active) return;
          setListing({
            id: Number(rawId),
            chainId,
            seller: data[0],
            rwa1155: data[1],
            tokenId: Number(data[2]),
            amount: Number(data[3]),
            pricePerUnit: Number(data[4]),
            active: Boolean(data[5]),
          });
          return;
        }
        if (active) setListing(null);
      } catch (_err) {
        if (active) setListing(null);
      } finally {
        if (active) setListingLoading(false);
      }
    };
    loadListing();
    return () => {
      active = false;
    };
  }, [listingIdFromQuery, chainId, tokenId, network?.routerAndDelivery]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!asset) return;
      setPriceLoading(true);
      try {
        let normalized = [];
        try {
          const res = await fetch(`/api/entries/asset/${asset.chainId}/${asset.contract}/${asset.tokenId}`);
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
  }, [asset, tokenId, unitPrice, publicClient]);

  const handleBuy = async () => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!listing || !network?.routerAndDelivery) {
      setStatus("Listing not found.");
      return;
    }
    if (qty <= 0 || qty > listing.amount) {
      setStatus("Invalid quantity.");
      return;
    }
    setBusy(true);
    try {
      if (walletChainId !== chainId) {
        setStatus("Switching chain...");
        await switchChainAsync({ chainId });
      }
      const totalPrice = BigInt(listing.pricePerUnit) * BigInt(qty);
      const balance = await readContract(wagmiConfig, {
        address: network.usdx,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
        chainId,
      });
      if (balance < totalPrice) {
        setStatus("Insufficient USDx balance.");
        return;
      }
      const allowance = await readContract(wagmiConfig, {
        address: network.usdx,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, network.routerAndDelivery],
        chainId,
      });
      if (allowance < totalPrice) {
        setStatus("Approving USDx...");
        const feeOverrides = await getFeeOverrides(chainId);
        const approveHash = await writeContractAsync({
          address: network.usdx,
          abi: erc20Abi,
          functionName: "approve",
          args: [network.routerAndDelivery, totalPrice],
          chainId,
          ...feeOverrides,
        });
        await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });
      }

      setStatus("Signing purchase...");
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
          BuyListing: [
            { name: "buyer", type: "address" },
            { name: "listingId", type: "uint256" },
            { name: "amount", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "BuyListing",
        message: {
          buyer: address,
          listingId: BigInt(listing.id),
          amount: BigInt(qty),
          nonce,
          deadline,
        },
      });

      setStatus("Relaying purchase...");
      const resp = await fetch("/api/market/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chainId,
          buyer: address,
          listingId: listing.id,
          amount: qty,
          deadline,
          signature,
        }),
      });
      const receiptJson = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(receiptJson?.error || `Buy failed (${resp.status})`);
      if (receiptJson?.oasisTxHash) {
        setReceiptTx(receiptJson.oasisTxHash);
        setReceiptOpen(true);
      }
      setStatus("Trade recorded in Oasis.");
    } catch (err) {
      setStatus(`Buy error: ${String(err?.message ?? err)}`);
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!listing || !network?.routerAndDelivery) {
      setStatus("Listing not found.");
      return;
    }
    if (listing.seller.toLowerCase() !== address.toLowerCase()) {
      setStatus("Only seller can cancel.");
      return;
    }
    setBusy(true);
    try {
      if (walletChainId !== chainId) {
        setStatus("Switching chain...");
        await switchChainAsync({ chainId });
      }
      setStatus("Signing cancel...");
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
      const resp = await fetch("/api/market/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chainId,
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
      <button className="back-button" type="button" onClick={() => router.back()}>
        ← Back
      </button>
      <div className="asset-note">ASSET CARD FOR MARKETPLACE</div>
      <section className="asset-hero">
        <div className="asset-media" style={imageStyle} />
        <div className="asset-info">
          <div className="card-category">{asset?.category ?? "Listing"}</div>
          <h1>{asset?.name ?? `Token #${tokenId}`}</h1>
          <div className="asset-sub">{asset?.subname ?? asset?.issuer ?? "—"}</div>
          <p className="asset-description">{asset?.description ?? "—"}</p>
          <div className="asset-network">
            <span className="network-pill">
              <img src={chainId === 80002 ? "/pol.svg" : "/eth.svg"} alt="" aria-hidden="true" />
            </span>
            <span>{formatChainName(chainId)}</span>
          </div>
          <div className="asset-meta">
            <div>
              <span>Issuer Rate</span>
              <strong>
                {asset?.issuerScore != null ? `${Math.round(asset.issuerScore)}/100` : "—"}
              </strong>
            </div>
            <div>
              <span>Issued</span>
              <strong>{asset?.supplyForDemo != null ? formatNumber(asset.supplyForDemo) : "—"}</strong>
            </div>
            <div>
              <span>Listed</span>
              <strong>{listingLoading ? "…" : hasListing ? formatNumber(listedAmount) : "—"}</strong>
            </div>
          </div>
          <div className="asset-actions">
            <div className="asset-price">
              {listingLoading ? "…" : hasListing ? `${formatNumber(unitPrice)} USDx` : "—"}
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
              disabled={busy || !hasListing}
            >
              Buy · {formatNumber(totalPrice)} USDx
            </button>
            {isMine && hasListing ? (
              <button className="cancel-button" type="button" onClick={handleCancel} disabled={busy || !listing}>
                Cancel Listing
              </button>
            ) : null}
            {!listingLoading && !hasListing ? (
              <p className="muted small">No active listings for this asset.</p>
            ) : null}
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
            <div className="history-title">Token history</div>
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
