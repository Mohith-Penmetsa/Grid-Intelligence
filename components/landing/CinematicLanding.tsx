"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity, ArrowRight } from "lucide-react";
import { ScrollController } from "./ScrollController";
import { ReducedMotionFallback } from "./ReducedMotionFallback";
import { DataPanel } from "./overlays/DataPanel";
import { RiskPanel } from "./overlays/RiskPanel";
import { PriorityPanel, TransformerRiskGrid } from "./overlays/PriorityPanel";
import { createDefaultSceneState } from "./SceneCanvas";
import { DEMO_INSPECTION_CARD } from "@/lib/landing/demo-data";

// ─── Lazy-load the heavy 3D canvas ────────────────────────────
const SceneCanvas = dynamic(
  () => import("./SceneCanvas").then((m) => ({ default: m.SceneCanvas })),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full"
        style={{ background: "#030810" }}
        aria-hidden="true"
      />
    ),
  }
);

// ─── CinematicLanding ─────────────────────────────────────────
// Root orchestrator for the landing page experience.
// Manages the pinned cinematic section, GSAP controller, and HTML overlays.

export function CinematicLanding() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null);
  const scrollSpacerRef = useRef<HTMLDivElement>(null);

  // Shared scene state — mutated by ScrollController every tick, read by SceneCanvas
  const sceneStateRef = useRef(createDefaultSceneState());

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // SSR — render nothing until mounted (avoids hydration issues with 3D)
  if (!mounted) {
    return (
      <div
        className="h-[100vh] w-full"
        style={{ background: "#07111A" }}
        aria-hidden="true"
      />
    );
  }

  if (reducedMotion) {
    return <ReducedMotionFallback />;
  }

  return (
    <div className="relative w-full" style={{ background: "#07111A" }}>
      {/* ── Pinned cinematic section ─────────────────────────── */}
      {/* The container is pinned; scrollSpacerRef creates the scroll distance */}
      <div
        ref={setContainerNode}
        className="relative h-dvh w-full overflow-hidden"
        style={{ background: "#07111A" }}
      >
        {/* 3D Canvas — fills entire viewport */}
        <div className="absolute inset-0 z-0">
          <SceneCanvas sceneStateRef={sceneStateRef} />
        </div>

        {/* Minimal top navigation */}
        <nav className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: "oklch(0.20 0.06 240 / 0.8)" }}
            >
              <Activity
                className="h-4 w-4"
                style={{ color: "oklch(0.72 0.18 220)" }}
              />
            </div>
            <span className="text-sm font-semibold text-white/90">
              GridIntel
            </span>
          </div>
          <Link
            href={ROUTES.OPERATIONS}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-white/20 bg-white/5 text-white/80 backdrop-blur-sm hover:bg-white/10 hover:text-white"
            )}
          >
            Enter Platform
          </Link>
        </nav>

        {/* ── HTML Overlay Layers ─────────────────────────────── */}
        {/* All overlays positioned absolute within the pinned viewport */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="relative h-full w-full max-w-screen-xl px-8 md:px-16">

            {/* ── SCENE 1 — INTRODUCTION ── */}
            <div className="absolute bottom-1/3 left-8 md:left-16 flex flex-col gap-4 max-w-2xl">
              <div
                data-scene-id="intro-title"
                className="opacity-0 translate-y-8"
                style={{ transform: "translateY(30px)" }}
              >
                <p
                  className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-shadow-cinematic"
                  style={{ color: "#00C8FF" }}
                >
                  Grid Intelligence
                </p>
                <h1
                  className="text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl text-shadow-cinematic"
                >
                  From grid data
                  <br />
                  <span style={{ color: "#39D9FF" }}>
                    to targeted
                  </span>
                  <br />
                  field action.
                </h1>
              </div>

              <p
                data-scene-id="intro-subtitle"
                className="text-lg leading-relaxed opacity-0 text-shadow-cinematic text-white/90"
                style={{
                  transform: "translateY(20px)",
                }}
              >
                AI-powered inspection intelligence for electricity distribution operations.
              </p>

              <p
                data-scene-id="intro-desc"
                className="text-sm opacity-0 text-shadow-cinematic text-white/60"
                style={{
                  transform: "translateY(20px)",
                }}
              >
                Scroll to visualize network flow
              </p>
            </div>

            {/* ── SCENE 2 — NETWORK ── */}
            <div className="absolute bottom-1/3 left-8 md:left-16 max-w-xl">
              <div
                data-scene-id="network-text"
                className="opacity-0"
                style={{ transform: "translateY(20px)" }}
              >
                <p
                  className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: "oklch(0.72 0.18 220)" }}
                >
                  Distribution Network
                </p>
                <h2 className="text-4xl font-semibold text-white sm:text-5xl">
                  One feeder.
                  <br />
                  Multiple transformers.
                </h2>
              </div>
            </div>

            {/* ── SCENE 3 — TRANSFORMER ANALYSIS ── */}
            <div className="absolute bottom-1/4 left-8 md:left-16 max-w-lg">
              <div
                data-scene-id="transformer-text"
                className="opacity-0"
                style={{ transform: "translateY(20px)" }}
              >
                <p
                  className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: "oklch(0.72 0.18 220)" }}
                >
                  Transformer Analysis
                </p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  Where is energy
                  <br />
                  being lost?
                </h2>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "oklch(0.6 0.02 240)" }}
                >
                  Account for technical losses first. Then identify
                  the commercial loss gap.
                </p>
              </div>
            </div>
            <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 pointer-events-auto">
              <DataPanel />
            </div>

            {/* ── SCENE 4 — LOSS ANALYSIS ── */}
            <div className="absolute bottom-1/3 left-8 md:left-16 max-w-xl">
              <div
                data-scene-id="loss-text"
                className="opacity-0"
                style={{ transform: "translateY(20px)" }}
              >
                <p
                  className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: "oklch(0.72 0.18 220)" }}
                >
                  Commercial Loss Assessment
                </p>
                <h2 className="text-4xl font-semibold text-white sm:text-5xl">
                  Narrow the search.
                  <br />
                  Find the loss
                  <br />
                  <span style={{ color: "oklch(0.72 0.22 30)" }}>
                    before the consumer.
                  </span>
                </h2>
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{ color: "oklch(0.6 0.02 240)" }}
                >
                  Prioritize transformers with abnormal commercial loss before
                  expanding the search to individual consumers.
                </p>
              </div>
            </div>

            {/* ── SCENE 5 — RISK RANKING ── */}
            <div className="absolute bottom-1/4 left-8 md:left-16 max-w-lg">
              <div
                data-scene-id="risk-text"
                className="opacity-0"
                style={{ transform: "translateY(20px)" }}
              >
                <p
                  className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: "oklch(0.72 0.18 220)" }}
                >
                  Transformer Risk
                </p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  Not all transformers
                  <br />
                  carry equal risk.
                </h2>
              </div>
            </div>
            <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 pointer-events-auto">
              <TransformerRiskGrid />
            </div>

            {/* ── SCENE 6 — CONSUMER ANALYSIS ── */}
            <div className="absolute bottom-1/3 left-8 md:left-16 max-w-xl">
              <div
                data-scene-id="consumer-text"
                className="opacity-0"
                style={{ transform: "translateY(20px)" }}
              >
                <p
                  className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: "oklch(0.72 0.18 220)" }}
                >
                  Consumer Analysis
                </p>
                <h2 className="text-4xl font-semibold text-white sm:text-5xl">
                  287 consumers.
                  <br />
                  4 priority
                  <br />
                  <span style={{ color: "oklch(0.72 0.22 30)" }}>
                    candidates.
                  </span>
                </h2>
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{ color: "oklch(0.6 0.02 240)" }}
                >
                  Not every consumer is inspected equally.
                  Anomalous patterns narrow the focus.
                </p>
              </div>
            </div>

            {/* ── PRIORITY PANEL ── */}
            <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 pointer-events-auto">
              <PriorityPanel />
            </div>

            {/* ── SCENE 7a — PRIORITY RESULT ── */}
            {/* Left: Assign Inspection text */}
            <div className="absolute bottom-1/3 left-8 md:left-16 max-w-xl">
              <div
                data-scene-id="inspection-text"
                className="opacity-0"
                style={{ transform: "translateY(20px)" }}
              >
                <p
                  className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: "#39BDE8" }}
                >
                  Inspector Action
                </p>
                <h2 className="text-4xl font-semibold sm:text-5xl" style={{ color: "#F5F7FA" }}>
                  AI supports
                  <br />
                  the inspector.
                </h2>
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{ color: "#A7B3BF" }}
                >
                  Signals and context — decision and judgment
                  remain human.
                </p>
              </div>
            </div>
            {/* Right: Priority card */}
            <div
              data-scene-id="inspection-card"
              className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 pointer-events-auto opacity-0"
              style={{ transform: "translateY(20px)" }}
            >
              <div
                className="flex flex-col rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden min-w-[280px]"
              >
                {/* Header */}
                <div className="border-b border-white/10 px-5 py-3 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#39BDE8" }}>
                    Priority #1
                  </p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ background: "rgba(240,93,78,0.15)", color: "#F05D4E" }}
                  >
                    HIGH
                  </span>
                </div>
                {/* Body */}
                <div className="flex flex-col gap-3 px-5 py-4">
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: "#A7B3BF" }}>Transformer</span>
                    <span className="font-medium" style={{ color: "#F5F7FA" }}>TR-104</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: "#A7B3BF" }}>Consumer</span>
                    <span className="font-medium" style={{ color: "#F5F7FA" }}>C-014</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: "#A7B3BF" }}>Risk Score</span>
                    <span className="font-bold" style={{ color: "#F05D4E" }}>94%</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: "#A7B3BF" }}>Status</span>
                    <span className="font-bold" style={{ color: "#F05D4E" }}>HIGH</span>
                  </div>
                </div>
                {/* CTA */}
                <div className="border-t border-white/10">
                  <Link
                    href={ROUTES.INSPECTIONS}
                    className="flex items-center justify-center gap-2 px-5 py-3 text-[12px] font-semibold transition-colors hover:bg-white/10 w-full"
                    style={{ color: "#39BDE8" }}
                  >
                    Assign Inspection
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── SCENE 8 — FINAL CLOSING ── */}
            {/* Full width centered message replacing everything from State 7 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-8">
              <div
                data-scene-id="closing-quote"
                className="opacity-0 max-w-3xl flex flex-col items-center"
                style={{ transform: "translateY(20px)" }}
              >
                <p
                  className="mb-6 text-[10px] font-bold uppercase tracking-[0.25em] text-shadow-cinematic"
                  style={{ color: "#00C8FF" }}
                >
                  FROM NETWORK TO ACTION
                </p>
                <h2 className="text-4xl font-semibold sm:text-6xl tracking-tight mb-6 text-shadow-cinematic text-white">
                  From network-wide data
                  <br />
                  <span style={{ color: "#39D9FF" }}>to targeted field action.</span>
                </h2>
                <p className="text-base leading-relaxed mb-12 max-w-xl text-shadow-cinematic text-white/80">
                  The complete inspection intelligence loop — data, analysis,
                  <br className="hidden sm:block" />
                  risk, priority, inspection, outcome, feedback.
                </p>
                
                <div
                  data-scene-id="closedloop-cta"
                  className="pointer-events-auto"
                >
                  <Link
                    href={ROUTES.OPERATIONS}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "h-12 gap-2 px-8 text-base font-medium rounded-md shadow-lg transition-all duration-300",
                      "hover:bg-[#122F4A] hover:border-[#39D9FF] hover:shadow-[0_0_20px_rgba(57,217,255,0.15)]"
                    )}
                    style={{ background: "#0D2439", color: "#F5F7FA", border: "1px solid rgba(57,189,232,0.3)" }}
                  >
                    Enter Operations Center
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator — visible only at top */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-70"
          aria-hidden="true"
        >
          <div
            className="h-8 w-px animate-pulse"
            style={{ background: "linear-gradient(to bottom, oklch(0.72 0.18 220 / 0), oklch(0.72 0.18 220))" }}
          />
        </div>

        {/* GSAP ScrollController — renders nothing, drives state */}
        <ScrollController
          containerNode={containerNode}
          sceneStateRef={sceneStateRef}
        />
      </div>
    </div>
  );
}
