"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { erc20Abi, parseGwei } from "viem";
import Shell from "../components/Shell";
import BlockingModal from "../components/BlockingModal";
import ReceiptModal from "../components/ReceiptModal";
import { useAssets } from "../lib/useAssets";
import type { Asset } from "../lib/types";
import { chainIconMap, formatChainId, formatChainName } from "../lib/chainLabel";
import { wagmiConfig } from "@/config/appkit";

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
    name: "buyListing",
    stateMutability: "nonpayable",
    inputs: [
      { name: "listingId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
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

type ListingView = {
  id: number;
  chainId: number;
  seller: `0x${string}`;
  rwa1155: `0x${string}`;
  tokenId: number;
  amount: number;
  pricePerUnit: number;
  active: boolean;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

export default function MarketplacePage() {
  const { address, isConnected } = useAccount();
  const walletChain = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const { signTypedDataAsync } = useSignTypedData();
  const { assets, networks } = useAssets();

  const [listings, setListings] = useState<ListingView[]>([]);
  const [status, setStatus] = useState<string>("Ready.");
  const [busy, setBusy] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [search, setSearch] = useState("");
  const [receiptTx, setReceiptTx] = useState<string | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [buyAmounts, setBuyAmounts] = useState<Record<number, number>>({});

  const getFeeOverrides = async (chainId: number) => {
    const client = publicClient && publicClient.chain?.id === chainId ? publicClient : undefined;
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

  const assetByKey = useMemo(() => {
    const map = new Map<string, Asset>();
    assets.forEach((asset) => {
      map.set(`${asset.chainId}:${asset.tokenId}`, asset);
    });
    return map;
  }, [assets]);

  const listingAssets = useMemo(() => {
    const map = new Map<string, Asset>();
    listings.forEach((listing) => {
      const key = `${listing.chainId}:${listing.tokenId}`;
      const asset = assetByKey.get(key);
      if (asset) map.set(key, asset);
    });
    return Array.from(map.values());
  }, [assetByKey, listings]);

  const supplyQueries = useMemo(() => {
    return listingAssets.map((asset) => ({
      abi: supplyAbi,
      address: asset.contract,
      functionName: "totalSupply",
      args: [BigInt(asset.tokenId)],
      chainId: asset.chainId,
    }));
  }, [listingAssets]);

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
      const asset = listingAssets[idx];
      if (!asset) return;
      const value = item.result as bigint | undefined;
      next[`${asset.chainId}:${asset.tokenId}`] = Number(value ?? 0n);
    });
    setSupplyMap(next);
  }, [listingAssets, supplyData]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!Object.keys(networks).length) return;
      const next: ListingView[] = [];
      for (const [id, info] of Object.entries(networks)) {
        const chain = Number(id);
        if (!info?.routerAndDelivery) continue;
        try {
          const count = (await readContract(wagmiConfig, {
            address: info.routerAndDelivery,
            abi: marketAbi,
            functionName: "getActiveListingCount",
            args: [],
            chainId: chain,
          })) as bigint;

          if (count === 0n) continue;
          const ids = (await readContract(wagmiConfig, {
            address: info.routerAndDelivery,
            abi: marketAbi,
            functionName: "getActiveListingIds",
            args: [0n, count],
            chainId: chain,
          })) as bigint[];

          for (const rawId of ids) {
            const listing = (await readContract(wagmiConfig, {
              address: info.routerAndDelivery,
              abi: marketAbi,
              functionName: "listings",
              args: [rawId],
              chainId: chain,
            })) as readonly [string, string, bigint, bigint, bigint, boolean];

            next.push({
              id: Number(rawId),
              chainId: chain,
              seller: listing[0] as `0x${string}`,
              rwa1155: listing[1] as `0x${string}`,
              tokenId: Number(listing[2]),
              amount: Number(listing[3]),
              pricePerUnit: Number(listing[4]),
              active: listing[5],
            });
          }
        } catch (_err) {
          // Ignore chain read errors for MVP
        }
      }
      if (active) setListings(next.filter((item) => item.active));
    };
    load();
    return () => {
      active = false;
    };
  }, [networks, refreshTick]);


  const handleBuy = async (listing: ListingView, amount: number) => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    const network = networks[String(listing.chainId)];
    if (!network) return;
    if (!Number.isFinite(amount) || amount <= 0) {
      setStatus("Invalid amount.");
      return;
    }
    if (amount > listing.amount) {
      setStatus("Amount exceeds listing.");
      return;
    }

    setBusy(true);
    try {
      if (walletChain !== listing.chainId) {
        setStatus("Switching chain...");
        try {
          await switchChainAsync({ chainId: listing.chainId });
        } catch (err) {
          setStatus(`Switch failed: ${String((err as Error).message ?? err)}`);
          return;
        }
      }

      const totalPrice = BigInt(listing.pricePerUnit) * BigInt(amount);
      const balance = (await readContract(wagmiConfig, {
        address: network.usdx,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
        chainId: listing.chainId,
      })) as bigint;
      if (balance < totalPrice) {
        setStatus("Insufficient USDx balance.");
        return;
      }

      const allowance = (await readContract(wagmiConfig, {
        address: network.usdx,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, network.routerAndDelivery],
        chainId: listing.chainId,
      })) as bigint;

      if (allowance < totalPrice) {
        setStatus("Approving USDx...");
        const feeOverrides = await getFeeOverrides(listing.chainId);
        const approveHash = await writeContractAsync({
          address: network.usdx,
          abi: erc20Abi,
          functionName: "approve",
          args: [network.routerAndDelivery, totalPrice],
          chainId: listing.chainId,
          ...feeOverrides,
        });
        await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });
      }

      setStatus("Signing purchase...");
      const nonce = (await readContract(wagmiConfig, {
        address: network.routerAndDelivery,
        abi: marketAbi,
        functionName: "nonces",
        args: [address],
        chainId: listing.chainId,
      })) as bigint;
      const deadline = Math.floor(Date.now() / 1000) + 600;
      const signature = await signTypedDataAsync({
        domain: {
          name: "AllInOneNEW",
          version: "1",
          chainId: listing.chainId,
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
          amount: BigInt(amount),
          nonce,
          deadline,
        },
      });

      setStatus("Relaying purchase...");
      const resp = await fetch("/api/market/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chainId: listing.chainId,
          buyer: address,
          listingId: listing.id,
          amount,
          deadline,
          signature,
        }),
      });
      const receiptJson = await resp.json();
      if (receiptJson?.oasisTxHash) {
        setReceiptTx(receiptJson.oasisTxHash);
        setReceiptOpen(true);
      }
      setStatus("Trade recorded in Oasis.");
      setRefreshTick((v) => v + 1);
    } catch (err) {
      setStatus(`Buy error: ${String((err as Error).message ?? err)}`);
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async (listing: ListingView) => {
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    const network = networks[String(listing.chainId)];
    if (!network) return;
    if (listing.seller.toLowerCase() !== address.toLowerCase()) {
      setStatus("Only seller can cancel.");
      return;
    }

    setBusy(true);
    try {
      setStatus("Signing cancel...");
      const nonce = (await readContract(wagmiConfig, {
        address: network.routerAndDelivery,
        abi: marketAbi,
        functionName: "nonces",
        args: [address],
        chainId: listing.chainId,
      })) as bigint;
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
      const resp = await fetch("/api/market/cancel", {
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
      const receiptJson = await resp.json();
      if (receiptJson?.oasisTxHash) {
        setReceiptTx(receiptJson.oasisTxHash);
        setReceiptOpen(true);
      }
      setStatus("Cancel recorded in Oasis.");
      setRefreshTick((v) => v + 1);
    } catch (err) {
      setStatus(`Cancel error: ${String((err as Error).message ?? err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Marketplace" subtitle="Secondary trading on each chain." networks={networks}>
      <BlockingModal open={busy} message={status} />
      <ReceiptModal
        open={receiptOpen}
        href={receiptTx ? `https://explorer.oasis.io/testnet/sapphire/tx/${receiptTx}` : null}
        label="View receipt in Oasis"
        onClose={() => setReceiptOpen(false)}
      />
      <div className="panel">
        <div className="panel-title">
          <span>Active Listings</span>
          <span className="chip ghost">{listings.length} live</span>
        </div>
        <div className="search-row">
          <input
            className="input"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {listings.length === 0 ? (
          <p className="muted">No listings yet. Create one below.</p>
        ) : (
          <div className="marketplace-grid">
            {listings
              .filter((listing) => {
                if (!search.trim()) return true;
                const q = search.trim().toLowerCase();
                const asset = assetByKey.get(`${listing.chainId}:${listing.tokenId}`);
                return (
                  String(listing.tokenId).includes(q) ||
                  asset?.name?.toLowerCase().includes(q) ||
                  (asset?.category ?? "").toLowerCase().includes(q)
                );
              })
              .map((listing) => {
              const key = `${listing.chainId}:${listing.tokenId}`;
              const asset = assetByKey.get(key);
              const buyAmount = buyAmounts[listing.id] ?? 1;
              return (
                <div key={`${listing.chainId}-${listing.id}`} className="asset-card">
                  <div
                    className="asset-image"
                    style={{ backgroundImage: `url(${asset?.image ?? ""})` }}
                  />
                  <div className="asset-body">
                    <p className="tag">{asset?.category ?? "Listing"}</p>
                    <div className="chain-badge">
                      {chainIconMap[listing.chainId] ? (
                        <img
                          className="chain-icon"
                          src={chainIconMap[listing.chainId]}
                          alt={`Chain ${listing.chainId}`}
                        />
                      ) : (
                        <span className={`chain-dot chain-${listing.chainId}`} />
                      )}
                      <span>{formatChainName(listing.chainId)}</span>
                      <span className="chain-id">{formatChainId(listing.chainId)}</span>
                    </div>
                    <h3>{asset?.name ?? `Token #${listing.tokenId}`}</h3>
                    <p className="muted small">
                      Seller{" "}
                      {address && listing.seller.toLowerCase() === address.toLowerCase()
                        ? "You"
                        : `${listing.seller.slice(0, 6)}…${listing.seller.slice(-4)}`}
                    </p>
                    {address && listing.seller.toLowerCase() === address.toLowerCase() && (
                      <p className="chip ghost">Your listing</p>
                    )}
                    <div className="asset-meta">
                      <span>Amount:</span>
                      <strong>{listing.amount}</strong>
                    </div>
                    <div className="asset-meta">
                      <span>Issued:</span>
                      <strong>
                        {asset?.supplyForDemo != null ? formatNumber(asset.supplyForDemo) : "—"}
                      </strong>
                    </div>
                    <div className="asset-meta">
                      <span>Available:</span>
                      <strong>
                        {asset?.supplyForDemo != null
                          ? formatNumber(
                              Math.max(
                                asset.supplyForDemo -
                                  (supplyMap[`${listing.chainId}:${listing.tokenId}`] ?? 0),
                                0
                              )
                            )
                          : "—"}
                      </strong>
                    </div>
                    <div className="asset-meta">
                      <span>Buy qty:</span>
                      <input
                        className="input tiny"
                        type="number"
                        min={1}
                        max={listing.amount}
                        value={buyAmount}
                        onChange={(e) =>
                          setBuyAmounts((prev) => ({
                            ...prev,
                            [listing.id]: Math.min(
                              listing.amount,
                              Math.max(1, Number(e.target.value || 1))
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="asset-meta">
                      <span>Price / unit:</span>
                      <strong>{formatNumber(listing.pricePerUnit)} USDx</strong>
                    </div>
                    <div className="inline-actions">
                      <button
                        className="button tiny"
                        disabled={busy || !isConnected}
                        onClick={() => handleBuy(listing, buyAmount)}
                      >
                        Buy
                      </button>
                      {address && listing.seller.toLowerCase() === address.toLowerCase() && (
                        <button
                          className="button tiny ghost"
                          disabled={busy || !isConnected}
                          onClick={() => handleCancel(listing)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Link className="button ghost tiny" href="/shop">
        Browse assets
      </Link>
    </Shell>
  );
}
