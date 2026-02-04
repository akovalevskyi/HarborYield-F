"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAccount, useReadContracts } from "wagmi";
import Shell from "../components/Shell";
import ReactECharts from "echarts-for-react";
import { useAssets } from "../lib/useAssets";
import { formatChainName } from "../lib/chainLabel";

const balanceBatchAbi = [
  {
    type: "function",
    name: "balanceOfBatch",
    stateMutability: "view",
    inputs: [
      { name: "accounts", type: "address[]" },
      { name: "ids", type: "uint256[]" },
    ],
    outputs: [{ type: "uint256[]", name: "balances" }],
  },
];

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

const formatNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return numberFormatter.format(value);
  }
  return "—";
};

const formatCurrency = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${formatNumber(value)} USDx`;
  }
  return "—";
};

const computeHealthScore = (items) => {
  const totalValue = items.reduce((acc, item) => acc + item.priceUSDx * item.owned, 0);
  if (!totalValue) return null;
  const weighted = items.reduce((acc, item) => {
    const score = item.healthScore ?? 0;
    return acc + score * item.priceUSDx * item.owned;
  }, 0);
  return Math.round(weighted / totalValue);
};

const donutColors = ["#16a34a", "#0ea5e9", "#a855f7", "#f59e0b", "#ef4444", "#22c55e", "#94a3b8"];

const buildPriceSeries = (asset) => {
  const base = (asset.priceUSDx ?? 0) * (asset.owned ?? 1);
  if (!base) return [];
  const seed = (asset.tokenId ?? 1) % 7;
  const values = [
    base * (0.92 + seed * 0.01),
    base * (1.04 - seed * 0.005),
    base * (0.97 + seed * 0.004),
    base * (1.02 - seed * 0.003),
    base,
  ];
  return values.map((value, idx) => ({ label: `t${idx + 1}`, value }));
};

function HealthGauge({ value = 75 }) {
  const safeValue = Math.min(100, Math.max(0, value));
  const status = safeValue >= 75 ? "Good" : safeValue >= 50 ? "Fair" : "Poor";
  const statusClass = status.toLowerCase();

  return (
    <div className="health-score-card">
      <div className="health-score-header">
        <span>Health Score</span>
        <span className="info-dot">?</span>
      </div>
      <div className="health-gauge" style={{ "--value": safeValue, "--progress": safeValue }}>
        <svg className="health-gauge-svg" viewBox="0 0 260 160" aria-hidden="true">
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="260" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff3b30" />
              <stop offset="25%" stopColor="#ff7a00" />
              <stop offset="50%" stopColor="#ffd000" />
              <stop offset="75%" stopColor="#b6f300" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            className="health-track"
            d="M 20 140 A 110 110 0 0 1 240 140"
            pathLength="100"
          />
          <path
            className="health-progress"
            d="M 20 140 A 110 110 0 0 1 240 140"
            pathLength="100"
          />
        </svg>
        <div className="health-value">
          {safeValue}
        </div>
        <div className={`health-chip health-chip-${statusClass}`}>{status}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const { assets, networks } = useAssets();

  const chainGroups = useMemo(() => {
    const groups = new Map();
    assets.forEach((asset) => {
      const list = groups.get(asset.chainId) ?? [];
      list.push(asset);
      groups.set(asset.chainId, list);
    });
    return groups;
  }, [assets]);

  const chainList = useMemo(() => Array.from(chainGroups.keys()).sort((a, b) => a - b), [chainGroups]);

  const readContracts = useMemo(() => {
    if (!address) return [];
    return chainList
      .map((chainId) => {
        const list = chainGroups.get(chainId) ?? [];
        if (!list.length) return null;
        const network = networks?.[String(chainId)];
        const contractAddress = network?.rwa1155 ?? list[0]?.contract;
        if (!contractAddress) return null;
        const ids = list.map((asset) => asset.tokenId);
        return {
          abi: balanceBatchAbi,
          address: contractAddress,
          functionName: "balanceOfBatch",
          args: [ids.map(() => address), ids],
          chainId,
        };
      })
      .filter(Boolean);
  }, [address, chainGroups, chainList, networks]);

  const { data: ownedBalancesData } = useReadContracts({
    contracts: readContracts,
    query: {
      enabled: Boolean(address && readContracts.length > 0),
      refetchInterval: 15000,
    },
  });

  const portfolio = useMemo(() => {
    const out = [];
    chainList.forEach((chainId, idx) => {
      const list = chainGroups.get(chainId) ?? [];
      const result = ownedBalancesData?.[idx]?.result;
      list.forEach((asset, aidx) => {
        const owned = Number(result?.[aidx] ?? 0n);
        if (owned > 0) out.push({ ...asset, owned });
      });
    });
    return out;
  }, [chainGroups, chainList, ownedBalancesData]);

  const totalValue = portfolio.reduce((acc, asset) => acc + asset.priceUSDx * asset.owned, 0);
  const healthScore = computeHealthScore(portfolio);
  const positionsCount = portfolio.length;
  const strategyRating =
    healthScore == null ? "—" : healthScore >= 75 ? "Low Risk" : healthScore >= 50 ? "Balanced" : "High Risk";

  const portfolioSeries = useMemo(() => {
    if (!portfolio.length) return [];
    const seriesList = portfolio.map((asset) => buildPriceSeries(asset));
    const length = Math.max(...seriesList.map((series) => series.length));
    return Array.from({ length }, (_, idx) => {
      const label = seriesList.find((series) => series[idx])?.[idx]?.label ?? `t${idx + 1}`;
      const value = seriesList.reduce((acc, series) => acc + (series[idx]?.value ?? 0), 0);
      return { name: label, value: Math.round(value) };
    });
  }, [portfolio]);

  const allocationData = useMemo(() => {
    const map = new Map();
    portfolio.forEach((asset) => {
      const key = asset.category ?? "Other";
      map.set(key, (map.get(key) ?? 0) + asset.priceUSDx * asset.owned);
    });
    return Array.from(map.entries())
      .map(([name, value], idx) => ({
        name,
        value,
        color: donutColors[idx % donutColors.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [portfolio]);

  const allocationTotal = allocationData.reduce((sum, item) => sum + item.value, 0);
  const allocationSeries = allocationData.map((item) => ({
    value: item.value,
    name: item.name,
    itemStyle: { color: item.color },
  }));

  return (
    <Shell>
      {!isConnected ? (
        <section className="hero compact">
          <div className="hero-top">
            <h1>Connect your wallet to view your portfolio.</h1>
            <p>We’ll show your positions, history, and receipts once connected.</p>
          </div>
        </section>
      ) : (
        <section className="dashboard">
          <div className="hero-top dashboard-hero">
            <h1>Dashboard</h1>
            <p>All assets in one place.</p>
          </div>
          <div className="dashboard-summary">
            <div className="summary-card">
              <div className="summary-inner overview">
                <div className="summary-title">Overview</div>
                <div className="summary-subtitle">Snapshot of your portfolio health</div>
                <div className="overview-card">
                  <div className="overview-left">
                    <HealthGauge value={healthScore ?? 0} />
                  </div>
                <div className="overview-right">
                  <div className="metric">
                    <span>Total Value</span>
                    <strong>{formatCurrency(totalValue)}</strong>
                  </div>
                  <div className="metric">
                    <span>Strategy Rating</span>
                    <strong>{strategyRating}</strong>
                  </div>
                  <div className="metric">
                    <span>Positions</span>
                    <strong>{positionsCount} assets</strong>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="summary-card">
              <div className="summary-inner">
                <div className="summary-title">Allocations</div>
                <div className="summary-subtitle">Breakdown by asset category</div>
                <div className="summary-chart">
                  <div className="pie-layout">
                    <div className="pie-chart">
                      <ReactECharts
                        style={{ height: 220, width: "100%" }}
                        option={{
                          tooltip: {
                            trigger: "item",
                            backgroundColor: "#ffffff",
                            borderColor: "#e5e5e5",
                            borderWidth: 1,
                            textStyle: { color: "#111111", fontSize: 11 },
                            formatter: ({ name, value, percent }) =>
                              `${name}<br/><b>${value}</b> (${percent}%)`,
                          },
                          series: [
                            {
                              type: "pie",
                              radius: ["52%", "80%"],
                              center: ["50%", "50%"],
                              avoidLabelOverlap: true,
                              padAngle: 2,
                              itemStyle: { borderRadius: 10 },
                              label: { show: false },
                              labelLine: { show: false },
                              data: allocationSeries,
                            },
                          ],
                        }}
                      />
                    </div>
                    <div className="pie-legend-list">
                      {allocationData.map((item) => {
                        const percent = allocationTotal
                          ? Math.round((item.value / allocationTotal) * 100)
                          : 0;
                        return (
                          <div key={item.name} className="pie-legend-row">
                            <span className="legend-left">
                              <i className="legend-dot" style={{ background: item.color }} />
                              {item.name}
                            </span>
                            <span className="legend-right">{percent}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="summary-wide">
            <div className="summary-card">
              <div className="summary-inner">
                <div className="summary-title">Portfolio growth</div>
                <div className="summary-chart">
                  <ReactECharts
                    style={{ height: 260, width: "100%" }}
                    option={{
                      grid: { left: 10, right: 16, top: 12, bottom: 8, containLabel: true },
                      xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: portfolioSeries.map((d) => d.name),
                        axisLine: { show: false },
                        axisTick: { show: false },
                        axisLabel: { color: "#6b7280", fontSize: 10 },
                      },
                      yAxis: {
                        type: "value",
                        axisLine: { show: false },
                        axisTick: { show: false },
                        splitLine: { lineStyle: { color: "rgba(0,0,0,0.06)" } },
                        axisLabel: { color: "#6b7280", fontSize: 10 },
                      },
                      tooltip: {
                        trigger: "axis",
                        backgroundColor: "#ffffff",
                        borderColor: "#e5e5e5",
                        borderWidth: 1,
                        textStyle: { color: "#111111", fontSize: 11 },
                        formatter: (params) => {
                          const point = params?.[0];
                          return point ? `${point.axisValue}<br/><b>${point.data}</b>` : "";
                        },
                      },
                      series: [
                        {
                          type: "line",
                          data: portfolioSeries.map((d) => d.value),
                          smooth: true,
                          symbol: "circle",
                          symbolSize: 7,
                          lineStyle: {
                            width: 3,
                            color: {
                              type: "linear",
                              x: 0,
                              y: 0,
                              x2: 1,
                              y2: 0,
                              colorStops: [
                                { offset: 0, color: "#22c55e" },
                                { offset: 1, color: "#06b6d4" },
                              ],
                            },
                          },
                          itemStyle: {
                            color: "#ffffff",
                            borderColor: "#22c55e",
                            borderWidth: 2,
                          },
                          areaStyle: {
                            color: {
                              type: "linear",
                              x: 0,
                              y: 0,
                              x2: 0,
                              y2: 1,
                              colorStops: [
                                { offset: 0, color: "rgba(34, 197, 94, 0.22)" },
                                { offset: 1, color: "rgba(6, 182, 212, 0.02)" },
                              ],
                            },
                          },
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-list">
            <div className="list-header">
              <span>My assets</span>
              <span className="muted">Items: {positionsCount}</span>
            </div>
            {portfolio.map((asset) => {
              const ownedValue = asset.priceUSDx * asset.owned;
              return (
                <Link
                  key={`${asset.chainId}-${asset.tokenId}`}
                  className="list-row"
                  href={`/dashboard/asset/${asset.chainId}/${asset.tokenId}`}
                >
                  <div>
                    <div className="list-title">{asset.name}</div>
                    <div className="list-sub">
                      {formatChainName(asset.chainId)} · Token #{asset.tokenId}
                    </div>
                  </div>
                  <div className="list-meta">
                    <span>Qty</span>
                    <strong>{formatNumber(asset.owned)}</strong>
                  </div>
                  <div className="list-meta">
                    <span>Value</span>
                    <strong>{formatCurrency(ownedValue)}</strong>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </Shell>
  );
}
