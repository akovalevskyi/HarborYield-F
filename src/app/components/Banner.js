"use client";

import { useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useChainId, useSwitchChain, useWriteContract } from "wagmi";
import { wagmiConfig } from "src/config/appkit";
import assetsData from "src/data/assets.json";

const usdxFaucetAbi = [
  {
    type: "function",
    name: "faucet",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
];

const SEPOLIA_ID = 11155111;
const AMOY_ID = 80002;
const BSC_TESTNET_ID = 97;

export default function Banner() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [faucetBusy, setFaucetBusy] = useState(null);

  const handleAddNetwork = async (targetChainId) => {
    const ethereum = globalThis?.ethereum;
    if (!ethereum?.request) return;
    try {
      if (targetChainId === SEPOLIA_ID) {
        const chainParams = {
          chainId: "0xaa36a7",
          chainName: "Sepolia",
          nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
        };
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainParams.chainId }],
          });
        } catch (err) {
          if (err?.code !== 4902) throw err;
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [chainParams],
          });
        }
        return;
      }
      if (targetChainId === AMOY_ID) {
        const chainParams = {
          chainId: "0x13882",
          chainName: "Polygon Amoy",
          nativeCurrency: { name: "Polygon", symbol: "POL", decimals: 18 },
          rpcUrls: ["https://polygon-amoy-bor-rpc.publicnode.com"],
          blockExplorerUrls: ["https://amoy.polygonscan.com"],
        };
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainParams.chainId }],
          });
        } catch (err) {
          if (err?.code !== 4902) throw err;
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [chainParams],
          });
        }
      }
    } catch (err) {
      console.warn("Add network error:", err);
    }
  };

  const handleAddToken = async (targetChainId) => {
    const network = assetsData?.networks?.[String(targetChainId)];
    if (!network) return;
    if (chainId !== targetChainId) {
      try {
        await switchChainAsync({ chainId: targetChainId });
      } catch (err) {
        console.warn("Switch chain error:", err);
        return;
      }
    }
    const target = assetsData?.networks?.[String(targetChainId)];
    if (!target?.usdx) return;
    const ethereum = globalThis?.ethereum;
    if (!ethereum?.request) return;
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
    } catch (err) {
      console.warn("Add token error:", err);
    }
  };

  const handleFaucet = async (targetChainId) => {
    const target = assetsData?.networks?.[String(targetChainId)];
    if (!target?.usdx || !isConnected || !address) return;
    try {
      setFaucetBusy(targetChainId);
      if (chainId !== targetChainId) {
        await switchChainAsync({ chainId: targetChainId });
      }
      const hash = await writeContractAsync({
        address: target.usdx,
        abi: usdxFaucetAbi,
        functionName: "faucet",
        args: [],
        chainId: targetChainId,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
    } catch (err) {
      console.warn("Faucet error:", err);
    } finally {
      setFaucetBusy(null);
    }
  };

  const buttons = [
    {
      label: faucetBusy === SEPOLIA_ID ? "Faucet USDx (Sepolia)..." : "Faucet USDx (Sepolia)",
      onClick: () => handleFaucet(SEPOLIA_ID),
      disabled: faucetBusy === SEPOLIA_ID,
    },
    {
      label: faucetBusy === AMOY_ID ? "Faucet USDx (Amoy)..." : "Faucet USDx (Amoy)",
      onClick: () => handleFaucet(AMOY_ID),
      disabled: faucetBusy === AMOY_ID,
    },
    {
      label:
        faucetBusy === BSC_TESTNET_ID
          ? "Faucet USDx (BSC Testnet)..."
          : "Faucet USDx (BSC Testnet)",
      onClick: () => handleFaucet(BSC_TESTNET_ID),
      disabled: faucetBusy === BSC_TESTNET_ID,
    },
  ];

  return (
    <div className="banner">
      <div className="banner-text">
        <div>
          This project runs on test networks: Sepolia, Amoy, BSC Testnet, Oasis Sapphire. Use
          USDx (USDC/USDT-like) to interact.
        </div>
        <div>Sepolia USDx: {assetsData?.networks?.["11155111"]?.usdx ?? "—"}</div>
        <div>Amoy USDx: {assetsData?.networks?.["80002"]?.usdx ?? "—"}</div>
        <div>BSC Testnet USDx: {assetsData?.networks?.["97"]?.usdx ?? "—"}</div>
      </div>
      <div className="banner-actions">
        {buttons.map((item) => (
          <button
            key={item.label}
            className="pill"
            type="button"
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
