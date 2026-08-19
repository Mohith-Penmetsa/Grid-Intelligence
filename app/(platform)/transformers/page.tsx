import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { TransformerIntelligenceDashboard } from "@/components/transformers/TransformerIntelligenceDashboard";

export const metadata: Metadata = {
  title: "Transformer Intelligence",
  description:
    "Risk-ranked transformer analysis with commercial loss assessment and inspection prioritization.",
};

export default function TransformersPage() {
  return (
    <PageShell
      title="Transformer Intelligence"
      description="Analyze transformer behavior, detect abnormal loss patterns, and prioritize field action."
    >
      <TransformerIntelligenceDashboard />
    </PageShell>
  );
}
