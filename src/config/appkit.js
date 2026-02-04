import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { polygonAmoy, sepolia } from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_PROJECT_ID in frontend_new/.env.local");
}

export const networks = [sepolia, polygonAmoy];

export const metadata = {
  name: "RWA Hub",
  description: "Multi-chain RWA control in one network",
  url: appUrl,
  icons: ["https://avatars.githubusercontent.com/u/179229932?s=200&v=4"],
};

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

export const appKitConfig = {
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: "light",
};
