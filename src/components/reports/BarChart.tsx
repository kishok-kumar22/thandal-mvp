import React from "react";
import { formatNumberIN } from "@/lib/format";

export interface BarChartItem {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartItem[];
  title?: string;
  height?: number;
}

export function BarChart({ data, title = "Amount by payment mode", height = 320 }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#64748B]">
        No chart data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 0);

  // Compute nice tick step (nice multiples: 500, 1000, 2000, 5000, etc.)
  let step = 500;
  if (maxValue > 10000) step = 2500;
  else if (maxValue > 5000) step = 1000;
  else if (maxValue > 2000) step = 500;
  else if (maxValue > 500) step = 200;
  else if (maxValue > 0) step = 100;
  else step = 500;

  // The axis max is the first tick STRICTLY ABOVE the largest value
  // (e.g. for 3,000 gives an axis up to 3,500)
  const axisMax = Math.ceil((maxValue + 1) / step) * step;

  // Generate ticks from 0 to axisMax
  const ticks: number[] = [];
  for (let t = 0; t <= axisMax; t += step) {
    ticks.push(t);
  }

  // SVG Coordinate space
  const svgWidth = 460;
  const svgHeight = height;
  const paddingLeft = 45;
  const paddingRight = 30;
  const paddingTop = 35;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / axisMax) * chartHeight;
  };

  // Bar layout
  const barWidth = Math.min(70, chartWidth / (data.length * 2));
  const slotWidth = chartWidth / data.length;

  const summaryText = data
    .map((d) => `${d.label}: ₹${formatNumberIN(d.value)}`)
    .join(", ");

  return (
    <div className="w-full">
      {/* Screen-reader accessible table fallback */}
      <div className="sr-only">
        <table>
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">Payment Mode</th>
              <th scope="col">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((d) => (
              <tr key={d.label}>
                <td>{d.label}</td>
                <td>{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Responsive Pure SVG Chart */}
      <svg
        role="img"
        aria-label={`${title}. ${summaryText}`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible select-none"
      >
        {/* Horizontal Grid lines and Y-axis tick labels */}
        {ticks.map((tickVal) => {
          const y = getY(tickVal);
          return (
            <g key={tickVal}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={paddingLeft + chartWidth}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray={tickVal === 0 ? "none" : "2 2"}
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fontWeight="500"
                fill="#64748B"
              >
                {formatNumberIN(tickVal)}
              </text>
            </g>
          );
        })}

        {/* Vertical Bars and Value Labels */}
        {data.map((item, idx) => {
          const centerX = paddingLeft + idx * slotWidth + slotWidth / 2;
          const barX = centerX - barWidth / 2;
          const barY = getY(item.value);
          const barH = chartHeight - (barY - paddingTop);

          return (
            <g key={item.label} className="transition-all">
              {/* Solid blue bar with square top */}
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={Math.max(2, barH)}
                fill="#1F6BFF"
                rx="0"
                className="hover:opacity-90 cursor-pointer"
              >
                <title>{`${item.label}: ₹${formatNumberIN(item.value)}`}</title>
              </rect>

              {/* Bold value label directly above bar */}
              <text
                x={centerX}
                y={barY - 8}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#0B1B3F"
              >
                {formatNumberIN(item.value)}
              </text>

              {/* Category label below X-axis */}
              <text
                x={centerX}
                y={paddingTop + chartHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fontWeight="500"
                fill="#475569"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
