import { useEffect, useMemo, useState } from "react";
import type { Asset, AssetsPayload, NetworkInfo } from "./types";

type AssetsState = {
  assets: Asset[];
  networks: Record<string, NetworkInfo>;
  loading: boolean;
  error: string | null;
};

export function useAssets(): AssetsState {
  const [data, setData] = useState<AssetsState>({
    assets: [],
    networks: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const res = await fetch("/api/assets");
        if (!res.ok) throw new Error(`assets fetch failed: ${res.status}`);
        const json = (await res.json()) as AssetsPayload;
        if (!active) return;
        setData({
          assets: json.assets ?? [],
          networks: json.networks ?? {},
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!active) return;
        setData((prev) => ({
          ...prev,
          loading: false,
          error: String((err as Error)?.message ?? err),
        }));
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => data, [data]);
}
