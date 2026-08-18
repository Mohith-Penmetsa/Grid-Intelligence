import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ComingSoon } from "@/components/shared/ComingSoon";

// ─── Types ────────────────────────────────────────────────────

interface InspectionDetailPageProps {
  params: Promise<{ id: string }>;
}

// ─── Metadata ─────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: InspectionDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Inspection ${id}`,
    description: `Details, evidence, and outcome for inspection ${id}.`,
  };
}

// ─── Inspection Detail Page ───────────────────────────────────

export default async function InspectionDetailPage({
  params,
}: InspectionDetailPageProps) {
  const { id } = await params;

  return (
    <PageShell
      title={`Inspection ${id}`}
      description="Inspection details, assigned inspector, evidence collection, and outcome recording."
    >
      <ComingSoon milestone="Milestone 6 — Inspection Detail & Evidence" />
    </PageShell>
  );
}
