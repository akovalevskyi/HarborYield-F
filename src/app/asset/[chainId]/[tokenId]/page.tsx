"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContracts,
  useSignTypedData,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { erc1155Abi, parseGwei } from "viem";
import Shell from "@/app/components/Shell";
import BlockingModal from "@/app/components/BlockingModal";
import ReceiptModal from "@/app/components/ReceiptModal";
import { useAssets } from "@/app/lib/useAssets";
import { wagmiConfig } from "@/config/appkit";
import PriceChart from "@/app/components/PriceChart";
import { chainIconMap, formatChainName } from "@/app/lib/chainLabel";

const marketAbi = [
  {
    type: "function",
    name: "createListing",
    stateMutability: "nonpayable",
    inputs: [
      { name: "rwa1155", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "pricePerUnit", type: "uint256" },
    ],
    outputs: [{ name: "listingId", type: "uint256" }],
  },
  {
    type: "function",
    name: "nonces",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "nonce", type: "uint256" }],
  },
] as const;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

export default function AssetPage() {
  const params = useParams() as { chainId?: string | string[]; tokenId?: string | string[] };
  const chainParam = Array.isArray(params?.chainId) ? params.chainId[0] : params?.chainId;
  const tokenParam = Array.isArray(params?.tokenId) ? params.tokenId[0] : params?.tokenId;
  const chainId = Number(chainParam);
  const tokenId = Number(tokenParam);

  const { assets, networks } = useAssets();
  const { address, isConnected } = useAccount();
  const walletChain = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { signTypedDataAsync } = useSignTypedData();
  const publicClient = usePublicClient({ chainId });

  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);
  const [sellPrice, setSellPrice] = useState(0);
  const [status, setStatus] = useState("Ready.");
  const [busy, setBusy] = useState(false);
  const [receiptHref, setReceiptHref] = useState<string | null>(null);
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

  const asset = useMemo(
    () => assets.find((a) => a.chainId === chainId && a.tokenId === tokenId),
    [assets, chainId, tokenId]
  );
  const network = networks[String(chainId)];

  const supplyQueries = useMemo(() => {
    if (!asset || !address) return [];
    return [
      {
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
      },
      {
        abi: [
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
        ],
        address: asset.contract,
        functionName: "balanceOf",
        args: [address, BigInt(asset.tokenId)],
        chainId: asset.chainId,
      },
    ];
  }, [asset, address]);

  const { data: supplyData } = useReadContracts({
    contracts: supplyQueries,
    query: {
      enabled: supplyQueries.length > 0,
      refetchInterval: 15000,
    },
  });

  const totalSupply = Number((supplyData?.[0]?.result as bigint | undefined) ?? 0n);
  const owned = Number((supplyData?.[1]?.result as bigint | undefined) ?? 0n);

  const [priceSeries, setPriceSeries] = useState<{ label: string; value: number }[]>([]);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!asset) return;
      setPriceLoading(true);
      try {
        const apiUrl = `/api/entries/asset/${asset.chainId}/${asset.contract}/${asset.tokenId}`;
        let res = await fetch(apiUrl);
        if (!res.ok) {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          if (backendUrl) {
            res = await fetch(
              `${backendUrl}/entries/asset/${asset.chainId}/${asset.contract}/${asset.tokenId}`
            );
          }
        }
        if (!res.ok) throw new Error(`asset entries failed: ${res.status}`);
        const json = await res.json();
        const entries = Array.isArray(json.entries) ? json.entries : [];
        const normalized = entries.map(
          (e: {
            kind: number | string;
            from?: string;
            to?: string;
            price?: number | string;
            amount?: number | string;
            recordedAt?: number | string;
          }) => ({
            kind: Number(e.kind),
            from: String(e.from ?? ""),
            to: String(e.to ?? ""),
            price: Number(e.price ?? 0),
            amount: Number(e.amount ?? 0),
            recordedAt: Number(e.recordedAt ?? 0),
          })
        );
        const timeline: { ts: number; value: number }[] = [];
        if (asset?.priceUSDx != null) {
          const oldestTs =
            normalized.length > 0
              ? Math.min(...normalized.map((e) => (e.recordedAt > 0 ? e.recordedAt : Date.now() / 1000)))
              : Math.floor(Date.now() / 1000);
          timeline.push({ ts: oldestTs - 86400, value: Number(asset.priceUSDx) });
        }
        for (const e of normalized) {
          if (e.kind !== 3 && e.kind !== 5) continue;
          const unit = e.amount > 0 ? e.price / e.amount : e.price;
          timeline.push({ ts: e.recordedAt || Math.floor(Date.now() / 1000), value: unit });
        }
        timeline.sort((a, b) => a.ts - b.ts);
        const series = timeline.map((p) => ({
          label: new Date(p.ts * 1000).toLocaleDateString(),
          value: p.value,
        }));
        if (series.length === 1) {
          const d = new Date();
          d.setDate(d.getDate() - 1);
          series.unshift({ label: d.toLocaleDateString(), value: series[0].value });
        }
        setPriceSeries(series);
      } catch (_err) {
        setPriceSeries([]);
      } finally {
        setPriceLoading(false);
      }
    };
    run();
  }, [asset]);

  const handleTransfer = async () => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!asset || !network) {
      setStatus("Asset not found.");
      return;
    }
    if (!transferTo) {
      setStatus("Recipient address required.");
      return;
    }
    if (walletChain !== chainId) {
      setStatus("Switching chain...");
      try {
        await switchChainAsync({ chainId });
      } catch (err) {
        setStatus(`Switch failed: ${String((err as Error).message ?? err)}`);
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
      const nonce = (await readContract(wagmiConfig, {
        address: network.routerAndDelivery,
        abi: marketAbi,
        functionName: "nonces",
        args: [address],
        chainId,
      })) as bigint;
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
      const resp = await fetch("/api/market/transfer", {
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
      const receiptJson = await resp.json();
      if (receiptJson?.oasisTxHash) {
        setReceiptHref(`https://explorer.oasis.io/testnet/sapphire/tx/${receiptJson.oasisTxHash}`);
        setReceiptOpen(true);
      }
      setStatus("Transfer recorded in Oasis.");
    } catch (err) {
      setStatus(`Transfer error: ${String((err as Error).message ?? err)}`);
    } finally {
      setBusy(false);
    }
  };

  const handleSell = async () => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!asset || !network) {
      setStatus("Asset not found.");
      return;
    }
    if (sellAmount <= 0 || sellPrice <= 0) {
      setStatus("Amount and price must be positive.");
      return;
    }
    if (walletChain !== chainId) {
      setStatus("Switching chain...");
      try {
        await switchChainAsync({ chainId });
      } catch (err) {
        setStatus(`Switch failed: ${String((err as Error).message ?? err)}`);
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
      const nonce = (await readContract(wagmiConfig, {
        address: network.routerAndDelivery,
        abi: marketAbi,
        functionName: "nonces",
        args: [address],
        chainId,
      })) as bigint;
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
      const resp = await fetch("/api/market/list", {
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
      const receiptJson = await resp.json();
      if (receiptJson?.oasisTxHash) {
        setReceiptHref(`https://explorer.oasis.io/testnet/sapphire/tx/${receiptJson.oasisTxHash}`);
        setReceiptOpen(true);
      }
      setStatus("Listing recorded in Oasis.");
    } catch (err) {
      setStatus(`Listing error: ${String((err as Error).message ?? err)}`);
    } finally {
      setBusy(false);
    }
  };

  if (!asset) {
    return (
      <Shell title="Asset" subtitle="Not found" networks={networks}>
        <div className="panel">
          <p>Asset not found.</p>
          <Link className="button tiny" href="/shop">
            Back to Shop
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title={asset.name} subtitle={asset.subname} networks={networks}>
      <BlockingModal open={busy} message={status} />
      <ReceiptModal
        open={receiptOpen}
        href={receiptHref}
        label="View receipt in Oasis"
        title="Transaction Ready"
        subtitle="Your transaction has been recorded."
        onClose={() => setReceiptOpen(false)}
      />
      <div className="panel asset-detail">
        <div className="asset-hero">
          <div className="asset-hero-image" style={{ backgroundImage: `url(${asset.image})` }} />
          <div className="asset-hero-meta">
            <p className="tag">{asset.category ?? "Asset"}</p>
            <h2>{asset.name}</h2>
            <p className="muted">{asset.description ?? "No description provided."}</p>
            <div className="asset-meta-grid">
              <div>
                <span>Network:</span>
                <strong className="chain-inline">
                  {chainIconMap[chainId] ? (
                    <img src={chainIconMap[chainId]} alt={`Chain ${chainId}`} />
                  ) : (
                    <span className={`chain-dot chain-${chainId}`} />
                  )}
                  <span>{formatChainName(chainId)}</span>
                </strong>
              </div>
              <div>
                <span>Chain ID:</span>
                <strong>{chainId}</strong>
              </div>
              <div>
                <span>Token ID:</span>
                <strong>#{asset.tokenId}</strong>
              </div>
              <div>
                <span>Available:</span>
                <strong>
                  {asset.supplyForDemo != null
                    ? formatNumber(Math.max(asset.supplyForDemo - totalSupply, 0))
                    : "—"}
                </strong>
              </div>
              <div>
                <span>Issued:</span>
                <strong>{asset.supplyForDemo != null ? formatNumber(asset.supplyForDemo) : "—"}</strong>
              </div>
              <div>
                <span>Owned:</span>
                <strong>{owned}</strong>
              </div>
              <div>
                <span>Health Score:</span>
                <strong>{asset.healthScore ?? "—"}</strong>
              </div>
              <div>
                <span>Initial Price:</span>
                <strong>{formatNumber(asset.priceUSDx)} USDx</strong>
              </div>
            </div>
            <div className="inline-actions">
              <Link className="button ghost" href="/marketplace">
                View Marketplace
              </Link>
              <Link className="button ghost" href="/shop">
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="asset-actions">
        <div className="panel">
          <div className="panel-title">
            <span>Price History</span>
            <span className="chip ghost">Oasis ledger</span>
          </div>
          {priceLoading ? (
            <p className="muted">Loading price history...</p>
          ) : priceSeries.length === 0 ? (
            <p className="muted">No price history yet.</p>
          ) : (
            <PriceChart
              title="Price timeline"
              series={[{ name: "Price", data: priceSeries, color: "#0f766e" }]}
            />
          )}
        </div>

        <div className="panel">
          <div className="panel-title">
            <span>Transfer Asset</span>
            <span className="chip ghost">Direct move</span>
          </div>
          <div className="form-grid">
            <label>
              Recipient
              <input
                className="input"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                placeholder="0x..."
              />
            </label>
            <label>
              Amount
              <input
                className="input"
                type="number"
                min={1}
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
              />
            </label>
          </div>
          <button className="button" disabled={busy} onClick={handleTransfer}>
            {busy ? "Working..." : "Transfer"}
          </button>
          <p className="muted small">{status}</p>
        </div>

        <div className="panel">
          <div className="panel-title">
            <span>List for Sale</span>
            <span className="chip ghost">Secondary market</span>
          </div>
          <div className="form-grid">
            <label>
              Amount
              <input
                className="input"
                type="number"
                min={1}
                value={sellAmount}
                onChange={(e) => setSellAmount(Number(e.target.value))}
              />
            </label>
            <label>
              Price / unit (USDx)
              <input
                className="input"
                type="number"
                min={1}
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
              />
            </label>
          </div>
          <button className="button" disabled={busy} onClick={handleSell}>
            {busy ? "Working..." : "Create Listing"}
          </button>
          <p className="muted small">{status}</p>
        </div>
      </div>
    </Shell>
  );
}
