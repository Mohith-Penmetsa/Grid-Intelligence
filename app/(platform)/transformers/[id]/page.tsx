"use client";

import { PageShell } from "@/components/shared/PageShell";
import { IntelligenceDetail } from "@/components/transformers/IntelligenceDetail";
import { useGridState } from "@/lib/store/grid-context";
import { calculateTransformerRisk } from "@/lib/intelligence/risk-engine";
import { useRouter, useParams } from "next/navigation";

export default function TransformerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { transformers, consumers, settings } = useGridState();
  const transformer = transformers.find(t => t.id === id);

  if (!transformer) {
    return (
      <PageShell title={`Transformer Not Found`} description={`Could not locate transformer ${id}`}>
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-border border-dashed bg-surface-2/30">
          <p className="text-sm text-muted-foreground">Transformer {id} does not exist in the current grid context.</p>
        </div>
      </PageShell>
    );
  }

  const risk = calculateTransformerRisk(transformer, consumers, settings);

  return (
    <PageShell
      title={`Transformer ${id}`}
      description="Detailed risk signals, commercial loss breakdown, connected consumers, and inspection history."
    >
      <IntelligenceDetail 
        transformer={transformer} 
        risk={risk} 
        onClose={() => router.back()} 
      />
    </PageShell>
  );
}
