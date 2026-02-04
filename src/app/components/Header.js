"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { appKit } from "src/app/lib/appkitClient";
import { USDX_BY_CHAIN, USDX_DECIMALS } from "src/app/lib/usdx";

const chainIconMap = {
  11155111: "/eth.svg",
  80002: "/pol.svg",
};

function shortAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function formatBalance(value) {
  if (value == null) return "--";
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(num);
}

export default function Header() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const usdxAddress = USDX_BY_CHAIN[chainId];

  const { data: balance } = useReadContract({
    abi: erc20Abi,
    address: usdxAddress ?? "0x0000000000000000000000000000000000000000",
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(isConnected && address && usdxAddress),
      refetchInterval: 12000,
    },
  });

  const balanceDisplay = isConnected && balance
    ? formatBalance(formatUnits(balance, USDX_DECIMALS))
    : "--";

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-mark">RWA Hub</div>
      </div>
      <nav className="nav">
        <Link className={pathname === "/" ? "active" : ""} href="/">
          Shop
        </Link>
        <Link className={pathname === "/marketplace" ? "active" : ""} href="/marketplace">
          Marketplace
        </Link>
        <Link className={pathname === "/dashboard" ? "active" : ""} href="/dashboard">
          Dashboard
        </Link>
      </nav>
      <div className="wallet">
        <div className="balance">
          <span className="label">USDx Balance:</span>
          <span className="value">{balanceDisplay}</span>
        </div>
        <button
          className={`connect ${isConnected ? "connected" : ""}`}
          type="button"
          onClick={() => {
            appKit?.open?.();
          }}
        >
          {isConnected ? (
            <span className="connect-inner">
              {chainIconMap[chainId] ? (
                <img className="chain-icon" src={chainIconMap[chainId]} alt="" aria-hidden="true" />
              ) : null}
              <span>{shortAddress(address)}</span>
            </span>
          ) : (
            "Connect Wallet"
          )}
        </button>
      </div>
    </header>
  );
}
