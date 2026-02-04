import assetsData from "src/data/assets.json";
import PageClient from "./page.client";

export const dynamicParams = false;

export function generateStaticParams() {
  const assets = Array.isArray(assetsData?.assets) ? assetsData.assets : [];
  return assets.map((asset) => ({
    chainId: String(asset.chainId),
    tokenId: String(asset.tokenId),
  }));
}

export default function Page(props) {
  return <PageClient {...props} />;
}
