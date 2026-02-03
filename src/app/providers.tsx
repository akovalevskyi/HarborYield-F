"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { appKitConfig, wagmiConfig } from "@/config/appkit";

declare global {
  // eslint-disable-next-line no-var
  var __appKit: unknown | undefined;
}

const queryClient = new QueryClient();

if (!globalThis.__appKit) {
  globalThis.__appKit = createAppKit(appKitConfig);
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
