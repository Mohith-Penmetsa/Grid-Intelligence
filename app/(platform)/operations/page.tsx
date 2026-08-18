import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ComingSoon } from "@/components/shared/ComingSoon";

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
      <ComingSoon milestone="Milestone 3 — Operations Dashboard" />
    </PageShell>
  );
}
