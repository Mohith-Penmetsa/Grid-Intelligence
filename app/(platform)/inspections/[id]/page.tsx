"use client";

import { PageShell } from "@/components/shared/PageShell";
import { InspectionDetail } from "@/components/inspections/InspectionDetail";
import { useGridState } from "@/lib/store/grid-context";
import { useRouter, useParams } from "next/navigation";

export default function InspectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { inspections } = useGridState();
  const inspection = inspections.find(i => i.id === id);

  if (!inspection) {
    return (
      <PageShell title={`Inspection Not Found`} description={`Could not locate inspection ${id}`}>
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-border border-dashed bg-surface-2/30">
          <p className="text-sm text-muted-foreground">Inspection {id} does not exist in the current grid context.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`Inspection ${id}`}
      description="Inspection details, assigned inspector, evidence collection, and outcome recording."
    >
      <InspectionDetail 
        inspection={inspection} 
        onClose={() => router.back()} 
      />
    </PageShell>
  );
}
