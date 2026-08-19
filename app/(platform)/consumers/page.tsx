import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ConsumerIntelligenceDashboard } from "@/components/consumers/ConsumerIntelligenceDashboard";

export const metadata: Metadata = {
  title: "Consumer Intelligence",
  description:
    "Risk-ranked consumer analysis with explainable anomaly signals and inspection recommendations.",
};

export default function ConsumersPage() {
  return (
    <PageShell
      title="Consumer Intelligence"
      description="Analyze consumer consumption behavior, detect abnormal patterns, and prioritize field action."
    >
      <ConsumerIntelligenceDashboard />
    </PageShell>
  );
}
