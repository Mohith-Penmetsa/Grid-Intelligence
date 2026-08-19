import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { InspectionIntelligenceDashboard } from "@/components/inspections/InspectionIntelligenceDashboard";

export const metadata: Metadata = {
  title: "Inspection Center",
  description:
    "Manage, prioritize, assign, and track field inspections derived from transformer and consumer intelligence.",
};

export default function InspectionsPage() {
  return (
    <PageShell
      title="Inspection Center"
      description="Manage field operations, track verification evidence, and assign officers to flagged anomaly sites."
    >
      <InspectionIntelligenceDashboard />
    </PageShell>
  );
}
