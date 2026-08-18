import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ComingSoon } from "@/components/shared/ComingSoon";

// ─── Types ────────────────────────────────────────────────────

interface TransformerDetailPageProps {
  params: Promise<{ id: string }>;
}

// ─── Metadata ─────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: TransformerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Transformer ${id}`,
    description: `Detailed risk analysis and inspection history for transformer ${id}.`,
  };
}

// ─── Transformer Detail Page ──────────────────────────────────

export default async function TransformerDetailPage({
  params,
}: TransformerDetailPageProps) {
  const { id } = await params;

  return (
    <PageShell
      title={`Transformer ${id}`}
      description="Detailed risk signals, commercial loss breakdown, connected consumers, and inspection history."
    >
      <ComingSoon milestone="Milestone 4 — Transformer Detail View" />
    </PageShell>
  );
}
