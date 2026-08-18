import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ComingSoon } from "@/components/shared/ComingSoon";

// ─── Types ────────────────────────────────────────────────────

interface ConsumerDetailPageProps {
  params: Promise<{ id: string }>;
}

// ─── Metadata ─────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: ConsumerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Consumer ${id}`,
    description: `Explainable risk profile and inspection history for consumer ${id}.`,
  };
}

// ─── Consumer Detail Page ─────────────────────────────────────

export default async function ConsumerDetailPage({
  params,
}: ConsumerDetailPageProps) {
  const { id } = await params;

  return (
    <PageShell
      title={`Consumer ${id}`}
      description="Explainable risk signals, consumption patterns, and inspection history."
    >
      <ComingSoon milestone="Milestone 5 — Consumer Detail & Explainability" />
    </PageShell>
  );
}
