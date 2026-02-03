import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: Promise<{ chainId: string; rwa1155: string; tokenId: string }>;
  }
) {
  const { chainId, rwa1155, tokenId } = await params;
  const upstream = await fetch(`${backendUrl}/entries/asset/${chainId}/${rwa1155}/${tokenId}`);
  const contentType = upstream.headers.get("content-type") ?? "application/json";
  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType },
  });
}
