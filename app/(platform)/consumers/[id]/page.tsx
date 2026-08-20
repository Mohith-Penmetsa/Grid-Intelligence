"use client";

import { PageShell } from "@/components/shared/PageShell";
import { ConsumerDetail } from "@/components/consumers/ConsumerDetail";
import { useGridState } from "@/lib/store/grid-context";
import { calculateConsumerRisk } from "@/lib/intelligence/risk-engine";
import { useRouter, useParams } from "next/navigation";

export default function ConsumerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { consumers, settings } = useGridState();
  const consumer = consumers.find(c => c.id === id);

  if (!consumer) {
    return (
      <PageShell title={`Consumer Not Found`} description={`Could not locate consumer ${id}`}>
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-border border-dashed bg-surface-2/30">
          <p className="text-sm text-muted-foreground">Consumer {id} does not exist in the current grid context.</p>
        </div>
      </PageShell>
    );
  }

  const risk = calculateConsumerRisk(consumer, settings);

  return (
    <PageShell
      title={`Consumer ${id}`}
      description="Explainable risk signals, consumption patterns, and inspection history."
    >
      <ConsumerDetail 
        consumer={consumer} 
        risk={risk} 
        onClose={() => router.back()} 
      />
    </PageShell>
  );
}
