export const chainIconMap: Record<number, string> = {
  11155111: "/eth.svg",
  80002: "/pol.svg",
};

export function formatChainName(chainId: number) {
  if (chainId === 11155111) return "Sepolia";
  if (chainId === 80002) return "Polygon Amoy";
  return `Chain ${chainId}`;
}

export function formatChainId(chainId: number) {
  return `Id:${chainId}`;
}

export function formatChainLabel(chainId: number) {
  return `${formatChainName(chainId)} (${formatChainId(chainId)})`;
}
