import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export async function POST(req: Request) {
  const body = await req.text();
  const upstream = await fetch(`${backendUrl}/market/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const contentType = upstream.headers.get("content-type") ?? "application/json";
  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType },
  });
}
