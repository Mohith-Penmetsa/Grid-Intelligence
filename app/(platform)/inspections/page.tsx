import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ComingSoon } from "@/components/shared/ComingSoon";

// ─── Metadata ─────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Inspection Center",
  description:
    "Manage field inspections: assign inspectors, track progress, and record outcomes.",
};

// ─── Inspections Page ─────────────────────────────────────────

export default function InspectionsPage() {
  return (
    <PageShell
      title="Inspection Center"
      description="Manage and track all field inspections. Assign inspectors, monitor progress, and capture outcomes."
    >
      <ComingSoon milestone="Milestone 6 — Inspection Management" />
    </PageShell>
  );
}
