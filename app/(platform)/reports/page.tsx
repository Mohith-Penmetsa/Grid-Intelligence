import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ComingSoon } from "@/components/shared/ComingSoon";

// ─── Metadata ─────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Reports & Analytics",
  description:
    "Performance reports, inspection outcomes, revenue recovery analytics, and model feedback.",
};

// ─── Reports Page ─────────────────────────────────────────────

export default function ReportsPage() {
  return (
    <PageShell
      title="Reports & Analytics"
      description="Inspection performance reports, revenue recovery analytics, and feedback for AI model improvement."
    >
      <ComingSoon milestone="Milestone 7 — Reports & Analytics" />
    </PageShell>
  );
}
