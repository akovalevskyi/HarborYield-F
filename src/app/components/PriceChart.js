"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function PriceChart({ series, title, height = 160, showLegend = true }) {
  const hasData = series.some((s) => s.data.length > 0);
  if (!hasData) return null;
  const merged = new Map();
  for (const s of series) {
    for (const p of s.data) {
      if (!merged.has(p.label)) merged.set(p.label, { label: p.label });
      merged.get(p.label)[s.name] = p.value;
    }
  }
  const rows = Array.from(merged.values());
  return (
    <div className="chart-card">
      {title ? <p className="chart-title">{title}</p> : null}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={rows} margin={{ top: 10, right: 12, left: 6, bottom: 0 }}>
          <XAxis dataKey="label" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              borderColor: "rgba(0,0,0,0.08)",
              fontSize: 12,
            }}
            formatter={(value) => [`${Number(value).toFixed(2)} USDx`, "Price"]}
          />
          {showLegend ? <Legend /> : null}
          {series.map((s) =>
            s.data.length ? (
              <Line
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
