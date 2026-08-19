import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { OperationsDashboard } from "@/components/operations/OperationsDashboard";

// ─── Metadata ─────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Operations Center",
  description:
    "Command view of all active operations, high-risk areas, and inspection status.",
};

// ─── Operations Page ──────────────────────────────────────────

export default function OperationsPage() {
  return (
    <PageShell
      title="Operations Center"
      description="Command view of all active operations, high-risk areas, and ongoing inspections."
    >
      <OperationsDashboard />
    </PageShell>
  );
}
