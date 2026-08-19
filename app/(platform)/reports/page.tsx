import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ReportsDashboard } from "@/components/reports/ReportsDashboard";

export const metadata: Metadata = {
  title: "Reports & Analytics",
  description:
    "Performance reports, inspection outcomes, revenue recovery analytics, and model feedback.",
};

export default function ReportsPage() {
  return (
    <PageShell
      title="Reports & Analytics"
      description="Executive overview of grid loss, high-risk entities, and field operation performance."
    >
      <ReportsDashboard />
    </PageShell>
  );
}
