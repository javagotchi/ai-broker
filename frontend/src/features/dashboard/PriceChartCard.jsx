import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const PriceChartCard = ({ overview }) => {
  if (!overview) {
    return null;
  }

  return (
    <div className="paper-panel p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="eyebrow mb-1">Trend</p>
          <h2 className="section-title mb-0">20-day close series</h2>
        </div>
        <span className="newspaper-badge">Daily</span>
      </div>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <AreaChart data={overview.series}>
            <defs>
              <linearGradient id="closeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111111" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#111111" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(17,17,17,0.12)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(17,17,17,0.65)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(17,17,17,0.65)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 2", "dataMax + 2"]}
            />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                color: "#111111",
                border: "1px solid rgba(17,17,17,0.18)",
                borderRadius: "2px",
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#111111"
              strokeWidth={1.8}
              fill="url(#closeFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
