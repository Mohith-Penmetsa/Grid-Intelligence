"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity, ArrowRight, Zap, Users, ClipboardCheck } from "lucide-react";

// ─── ReducedMotionFallback ────────────────────────────────────
// Shown when the user has prefers-reduced-motion: reduce.
// A clean, static product overview page — no animation, no 3D.

export function ReducedMotionFallback() {
  const steps = [
    { icon: Zap, label: "Transformer Analysis", desc: "Identify commercial loss at transformer level" },
    { icon: Users, label: "Consumer Risk", desc: "Rank consumers by risk signals with explainability" },
    { icon: ClipboardCheck, label: "Targeted Inspection", desc: "Assign inspectors to the highest-priority cases" },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-[#030810]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" style={{ color: "oklch(0.65 0.18 220)" }} />
          <span className="text-sm font-semibold text-white">GridIntel</span>
        </div>
        <Link
          href={ROUTES.OPERATIONS}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "border-white/20 text-white hover:bg-white/10"
          )}
        >
          Enter Platform
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-6"
             style={{ background: "oklch(0.20 0.06 240)" }}>
          <Activity className="h-7 w-7" style={{ color: "oklch(0.65 0.18 220)" }} />
        </div>

        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Grid Intelligence
        </h1>
        <p className="mb-2 text-lg" style={{ color: "oklch(0.65 0.18 220)" }}>
          From grid data to targeted field action.
        </p>
        <p className="mb-10 max-w-lg text-base leading-relaxed" style={{ color: "oklch(0.6 0.02 240)" }}>
          AI-powered inspection intelligence for electricity distribution operations.
        </p>

        {/* Steps */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3 max-w-2xl">
          {steps.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col gap-2 rounded-xl p-4 text-left"
              style={{ background: "oklch(0.14 0.02 240)", border: "1px solid oklch(1 0 0 / 8%)" }}
            >
              <Icon className="h-5 w-5" style={{ color: "oklch(0.65 0.18 220)" }} />
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.02 240)" }}>{desc}</p>
            </div>
          ))}
        </div>

        <Link
          href={ROUTES.OPERATIONS}
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-11 gap-2 px-6"
          )}
        >
          Enter Operations Center
          <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
    </div>
  );
}
