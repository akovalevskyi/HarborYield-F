export const chainIconMap = {
  11155111: "/eth.svg",
  80002: "/pol.svg",
};

export function formatChainName(chainId) {
  if (chainId === 11155111) return "Sepolia";
  if (chainId === 80002) return "Polygon Amoy";
  return `Chain ${chainId}`;
}

export function formatChainId(chainId) {
  return `Id:${chainId}`;
}

export function formatChainLabel(chainId) {
  return `${formatChainName(chainId)} (${formatChainId(chainId)})`;
}
