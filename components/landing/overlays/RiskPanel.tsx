"use client";

import { cn } from "@/lib/utils";
import { DEMO_CONSUMER_RISK } from "@/lib/landing/demo-data";

// ─── RiskPanel ───────────────────────────────────────────────
// Explainable risk signal panel for Scene 7 (Consumer Risk).

export function RiskPanel({ className }: { className?: string }) {
  const consumer = DEMO_CONSUMER_RISK;
  const maxContribution = Math.max(...consumer.signals.map((s) => s.contribution));

  return (
    <div
      data-scene-id="risk-panel"
      className={cn(
        "flex flex-col gap-0 opacity-0",
        "rounded-xl border border-white/10 bg-white/5 backdrop-blur-md",
        "overflow-hidden min-w-[280px]",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "oklch(0.72 0.18 200)" }}
            >
              {consumer.label}
            </p>
            <p className="mt-0.5 text-[10px]" style={{ color: "oklch(0.5 0.02 240)" }}>
              {consumer.note}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums text-white">
              {consumer.riskScore}
            </p>
            <p
              className="text-[10px] font-medium"
              style={{ color: "oklch(0.72 0.22 30)" }}
            >
              / 100
            </p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            data-scene-id="risk-score-bar"
            className="h-full rounded-full"
            style={{
              width: `${consumer.riskScore}%`,
              background:
                "linear-gradient(90deg, oklch(0.65 0.2 220), oklch(0.72 0.22 30))",
              transformOrigin: "left",
              transform: "scaleX(0)",
            }}
          />
        </div>
      </div>

      {/* Signals */}
      <div className="px-4 py-3">
        <p
          className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "oklch(0.55 0.03 240)" }}
        >
          Signals contributing to inspection priority
        </p>
        <div className="flex flex-col gap-3">
          {consumer.signals.map((signal, i) => (
            <div
              key={i}
              data-scene-id={`signal-${i}`}
              className="flex flex-col gap-1.5 opacity-0"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] text-white/70">
                  {signal.shortLabel}
                </span>
                <span
                  className="text-[11px] font-semibold tabular-nums"
                  style={{ color: "oklch(0.72 0.22 30)" }}
                >
                  {signal.contribution}
                </span>
              </div>
              <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(signal.contribution / maxContribution) * 100}%`,
                    background: "oklch(0.65 0.2 220)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
