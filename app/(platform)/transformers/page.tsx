import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ComingSoon } from "@/components/shared/ComingSoon";

// ─── Metadata ─────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Transformer Intelligence",
  description:
    "Risk-ranked transformer analysis with commercial loss assessment and inspection prioritization.",
};

// ─── Transformers Page ────────────────────────────────────────

export default function TransformersPage() {
  return (
    <PageShell
      title="Transformer Intelligence"
      description="Risk-ranked analysis of distribution transformers. Identify commercial losses and prioritize inspections."
    >
      <ComingSoon milestone="Milestone 4 — Transformer Intelligence" />
    </PageShell>
  );
}
