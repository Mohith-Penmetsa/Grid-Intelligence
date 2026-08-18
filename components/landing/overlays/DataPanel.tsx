"use client";

import { cn } from "@/lib/utils";
import { DEMO_TRANSFORMER_ENERGY } from "@/lib/landing/demo-data";

// ─── DataPanel ───────────────────────────────────────────────
// Energy flow data panel for Scene 3 (Transformer Analysis).

export function DataPanel({ className }: { className?: string }) {
  const data = DEMO_TRANSFORMER_ENERGY;

  const rows = [
    { label: "Transformer Input", value: data.input, color: "oklch(0.72 0.18 200)" },
    { label: "Consumer Consumption", value: data.consumerConsumption, color: "oklch(0.72 0.18 150)" },
    { label: "Technical Loss", value: data.technicalLoss, color: "oklch(0.72 0.08 240)" },
    { label: "Commercial Loss", value: data.commercialLoss, color: "oklch(0.72 0.22 30)" },
  ];

  return (
    <div
      data-scene-id="data-panel"
      className={cn(
        "flex flex-col gap-0 opacity-0",
        "rounded-xl border border-white/10 bg-white/5 backdrop-blur-md",
        "overflow-hidden min-w-[260px]",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]"
           style={{ color: "oklch(0.72 0.18 200)" }}>
          {data.label}
        </p>
        <p className="mt-0.5 text-[10px]" style={{ color: "oklch(0.5 0.02 240)" }}>
          {data.note}
        </p>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {rows.map((row, i) => (
          <div
            key={i}
            data-scene-id={`data-row-${i}`}
            className="flex items-center justify-between gap-8 border-b border-white/5 px-4 py-3 opacity-0 last:border-0"
          >
            <span className="text-[11px] text-white/60">{row.label}</span>
            <div className="flex items-baseline gap-1">
              <span
                className="text-xl font-semibold tabular-nums"
                style={{ color: row.color }}
              >
                {row.value.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-white/40">{data.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Loss bar */}
      <div className="px-4 pb-4 pt-3">
        <div className="mb-1.5 flex justify-between text-[10px]">
          <span style={{ color: "oklch(0.5 0.02 240)" }}>Commercial Loss</span>
          <span style={{ color: "oklch(0.72 0.22 30)" }} className="font-semibold">
            {((data.commercialLoss / data.input) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            data-scene-id="loss-bar"
            className="h-full rounded-full"
            style={{
              width: `${(data.commercialLoss / data.input) * 100}%`,
              background: "oklch(0.72 0.22 30)",
              transformOrigin: "left",
              transform: "scaleX(0)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
