export type NetworkInfo = {
  name: string;
  explorer: string;
  usdx: `0x${string}`;
  rwa1155: `0x${string}`;
  routerAndDelivery: `0x${string}`;
  minterRole?: `0x${string}`;
  faucet?: string;
};

export type Asset = {
  chainId: number;
  contract: `0x${string}`;
  tokenId: number;
  name: string;
  subname?: string;
  description?: string;
  category?: string;
  healthScore?: number;
  priceUSDx: number;
  image: string;
  supplyForDemo?: number;
};

export type AssetsPayload = {
  networks: Record<string, NetworkInfo>;
  assets: Asset[];
};
