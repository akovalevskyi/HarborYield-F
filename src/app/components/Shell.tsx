"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppKitButton } from "@reown/appkit/react";
import WalletTools from "./WalletTools";
import type { NetworkInfo } from "@/app/lib/types";

export default function Shell({
  title,
  subtitle,
  networks,
  children,
}: {
  title: string;
  subtitle?: string;
  networks: Record<string, NetworkInfo>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">◎</div>
          <div>
            <p className="brand-eyebrow">Oasis Ledger</p>
            <h1>{title}</h1>
            {subtitle ? <p className="brand-subtitle">{subtitle}</p> : null}
          </div>
        </div>
        <nav className="nav">
          <Link className={pathname === "/" ? "active" : ""} href="/">
            Dashboard
          </Link>
          <Link className={pathname === "/shop" ? "active" : ""} href="/shop">
            Shop
          </Link>
          <Link className={pathname === "/marketplace" ? "active" : ""} href="/marketplace">
            Marketplace
          </Link>
        </nav>
        <div className="wallet">
          <AppKitButton />
        </div>
      </header>
      <main className="layout">
        <section className="main">{children}</section>
      </main>
      <footer className="footer">
        <WalletTools networks={networks} showOasis />
      </footer>
    </div>
  );
}
