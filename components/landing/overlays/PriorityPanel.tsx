"use client";

import { cn } from "@/lib/utils";
import {
  DEMO_PRIORITY_LIST,
  DEMO_TRANSFORMER_RISKS,
} from "@/lib/landing/demo-data";

// ─── PriorityPanel ───────────────────────────────────────────
// Scene 8: Ranked inspection priority list.

export function PriorityPanel({ className }: { className?: string }) {
  const riskColors: Record<string, string> = {
    HIGH: "oklch(0.72 0.22 30)",
    MEDIUM: "oklch(0.80 0.18 80)",
    LOW: "oklch(0.65 0.14 200)",
  };

  return (
    <div
      data-scene-id="priority-panel"
      className={cn(
        "flex flex-col opacity-0",
        "rounded-xl border border-white/10 bg-white/5 backdrop-blur-md",
        "overflow-hidden min-w-[300px]",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "oklch(0.72 0.18 200)" }}
        >
          Inspection Priority
        </p>
        <p className="text-[10px]" style={{ color: "oklch(0.5 0.02 240)" }}>
          TR-104 · {DEMO_PRIORITY_LIST.length} priority candidates identified
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[24px_1fr_48px_52px] items-center gap-2 border-b border-white/5 px-4 py-2">
        {["#", "Consumer", "Risk", "Level"].map((h) => (
          <span
            key={h}
            className="text-[9px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: "oklch(0.45 0.02 240)" }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {DEMO_PRIORITY_LIST.map((item, i) => (
        <div
          key={item.rank}
          data-scene-id={`priority-row-${i}`}
          className={cn(
            "grid grid-cols-[24px_1fr_48px_52px] items-center gap-2 px-4 py-3 opacity-0",
            "border-b border-white/5 last:border-0",
            item.rank === 1 && "bg-white/5"
          )}
        >
          <span
            className="text-[11px] font-bold tabular-nums"
            style={{
              color:
                item.rank === 1
                  ? "oklch(0.72 0.22 30)"
                  : "oklch(0.45 0.02 240)",
            }}
          >
            {item.rank}
          </span>
          <span className="text-[12px] font-medium text-white">
            {item.consumerId}
          </span>
          <span
            className="text-right text-[13px] font-semibold tabular-nums"
            style={{ color: riskColors[item.riskLabel] }}
          >
            {item.riskScore}
          </span>
          <span
            className="text-right text-[9px] font-semibold uppercase tracking-wider"
            style={{ color: riskColors[item.riskLabel] }}
          >
            {item.riskLabel}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── TransformerRiskGrid ──────────────────────────────────────
// Scene 5: Grid of transformer risk scores.

export function TransformerRiskGrid({ className }: { className?: string }) {
  const targetId = "TR-104";

  return (
    <div
      data-scene-id="transformer-risk-grid"
      className={cn("flex flex-col gap-2 opacity-0", className)}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: "oklch(0.72 0.18 200)" }}
      >
        Transformer Risk Rankings
      </p>
      <div className="flex flex-col gap-1.5">
        {DEMO_TRANSFORMER_RISKS.map((t, i) => {
          const isTarget = t.id === targetId;
          return (
            <div
              key={t.id}
              data-scene-id={`tr-risk-${i}`}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 opacity-0",
                isTarget
                  ? "bg-white/10 ring-1 ring-white/20"
                  : "bg-white/5"
              )}
            >
              <span
                className="w-14 text-[11px] font-medium"
                style={{
                  color: isTarget ? "white" : "oklch(0.6 0.02 240)",
                }}
              >
                {t.id}
              </span>
              {/* Risk bar */}
              <div className="flex-1">
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${t.riskScore}%`,
                      background: isTarget
                        ? "oklch(0.72 0.22 30)"
                        : "oklch(0.55 0.1 220)",
                    }}
                  />
                </div>
              </div>
              <span
                className="w-6 text-right text-[12px] font-semibold tabular-nums"
                style={{
                  color: isTarget
                    ? "oklch(0.72 0.22 30)"
                    : "oklch(0.5 0.02 240)",
                }}
              >
                {t.riskScore}
              </span>
              {isTarget && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider"
                  style={{ color: "oklch(0.72 0.22 30)" }}
                >
                  #1
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
