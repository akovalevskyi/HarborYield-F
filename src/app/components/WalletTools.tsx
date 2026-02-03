"use client";

import { useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useChainId, useSwitchChain, useWriteContract } from "wagmi";
import { erc20Abi } from "viem";
import { wagmiConfig } from "@/config/appkit";
import type { NetworkInfo } from "@/app/lib/types";

const usdxFaucetAbi = [
  {
    type: "function",
    name: "faucet",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;

export default function WalletTools({
  networks,
  showOasis,
}: {
  networks: Record<string, NetworkInfo>;
  showOasis?: boolean;
}) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<string>("Wallet tools ready.");
  const [faucetBusy, setFaucetBusy] = useState<number | null>(null);

  const handleFaucet = async (targetChainId: number) => {
    const target = networks[String(targetChainId)];
    if (!isConnected || !address) {
      setStatus("Connect wallet first.");
      return;
    }
    if (!target) {
      setStatus("Unknown faucet network.");
      return;
    }
    try {
      setFaucetBusy(targetChainId);
      if (chainId !== targetChainId) {
        setStatus(`Switching to ${target.name}...`);
        await switchChainAsync({ chainId: targetChainId });
      }
      setStatus(`Calling faucet on ${target.name}...`);
      const hash = await writeContractAsync({
        address: target.usdx,
        abi: usdxFaucetAbi,
        functionName: "faucet",
        args: [],
        chainId: targetChainId,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      setStatus(`Faucet OK on ${target.name}. Tx: ${hash}`);
    } catch (err) {
      setStatus(`Faucet error: ${String((err as Error).message ?? err)}`);
    } finally {
      setFaucetBusy(null);
    }
  };

  const handleAddToken = async (targetChainId: number) => {
    const target = networks[String(targetChainId)];
    if (!target) {
      setStatus("Unknown network.");
      return;
    }
    const ethereum = (globalThis as { ethereum?: { request?: (args: unknown) => Promise<unknown> } }).ethereum;
    if (!ethereum?.request) {
      setStatus("No wallet provider detected.");
      return;
    }
    try {
      await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: target.usdx,
            symbol: "USDx",
            decimals: 6,
          },
        },
      });
      setStatus(`USDx added in ${target.name}.`);
    } catch (err) {
      setStatus(`Add token error: ${String((err as Error).message ?? err)}`);
    }
  };

  const handleAddNetwork = async (targetChainId: number) => {
    const ethereum = (globalThis as { ethereum?: { request?: (args: unknown) => Promise<unknown> } }).ethereum;
    if (!ethereum?.request) {
      setStatus("No wallet provider detected.");
      return;
    }
    try {
      if (targetChainId === 11155111) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia",
              nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
        setStatus("Sepolia added to wallet.");
        return;
      }
      if (targetChainId === 80002) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13882",
              chainName: "Polygon Amoy",
              nativeCurrency: { name: "Polygon", symbol: "POL", decimals: 18 },
              rpcUrls: ["https://polygon-amoy-bor-rpc.publicnode.com"],
              blockExplorerUrls: ["https://amoy.polygonscan.com"],
            },
          ],
        });
        setStatus("Amoy added to wallet.");
        return;
      }
      if (targetChainId === 23295) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x5aff",
              chainName: "Oasis Sapphire Testnet",
              nativeCurrency: { name: "TEST", symbol: "TEST", decimals: 18 },
              rpcUrls: ["https://testnet.sapphire.oasis.io"],
              blockExplorerUrls: ["https://explorer.oasis.io/testnet/sapphire"],
            },
          ],
        });
        setStatus("Oasis Sapphire Testnet added to wallet.");
      }
    } catch (err) {
      setStatus(`Add network error: ${String((err as Error).message ?? err)}`);
    }
  };

  const sepoliaId = 11155111;
  const amoyId = 80002;

  return (
    <div className="wallet-tools footer-links">
      <span className="footer-label">Wallet tools</span>
      <button className="link-button" type="button" onClick={() => handleAddNetwork(sepoliaId)}>
        Add Sepolia
      </button>
      <button className="link-button" type="button" onClick={() => handleAddNetwork(amoyId)}>
        Add Amoy
      </button>
      {showOasis ? (
        <button className="link-button" type="button" onClick={() => handleAddNetwork(23295)}>
          Add Oasis
        </button>
      ) : null}
      <button className="link-button" type="button" onClick={() => handleAddToken(sepoliaId)}>
        Add USDx Sepolia
      </button>
      <button className="link-button" type="button" onClick={() => handleAddToken(amoyId)}>
        Add USDx Amoy
      </button>
      <button
        className="link-button"
        type="button"
        onClick={() => handleFaucet(sepoliaId)}
        disabled={faucetBusy === sepoliaId}
      >
        {faucetBusy === sepoliaId ? "Faucet..." : "Faucet Sepolia"}
      </button>
      <button
        className="link-button"
        type="button"
        onClick={() => handleFaucet(amoyId)}
        disabled={faucetBusy === amoyId}
      >
        {faucetBusy === amoyId ? "Faucet..." : "Faucet Amoy"}
      </button>
      <span className="wallet-tools-status">{status}</span>
    </div>
  );
}
