import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ComingSoon } from "@/components/shared/ComingSoon";

// ─── Metadata ─────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Consumer Intelligence",
  description:
    "Risk-ranked consumer analysis with explainable anomaly signals and inspection recommendations.",
};

// ─── Consumers Page ───────────────────────────────────────────

export default function ConsumersPage() {
  return (
    <PageShell
      title="Consumer Intelligence"
      description="Risk-ranked consumer profiles with explainable anomaly signals. Identify high-risk consumers for inspection."
    >
      <ComingSoon milestone="Milestone 5 — Consumer Intelligence" />
    </PageShell>
  );
}
