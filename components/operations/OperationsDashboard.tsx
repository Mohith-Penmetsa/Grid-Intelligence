"use client";

import { useState, useRef, useEffect } from "react";
import { KpiCards } from "./KpiCards";
import { TransformerRiskTable } from "./TransformerRiskTable";
import { TransformerDetail } from "./TransformerDetail";

export function OperationsDashboard() {
  const [selectedTransformerId, setSelectedTransformerId] = useState<string | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTransformerId && analysisRef.current) {
      analysisRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedTransformerId]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* KPI Overview */}
      <section>
        <KpiCards />
      </section>

      {/* Main Content Area: Table + Detail Panel */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-foreground/90 uppercase">
              Transformer Risk Analysis
            </h2>
          </div>
          <TransformerRiskTable 
            selectedId={selectedTransformerId} 
            onSelect={setSelectedTransformerId} 
          />
        </div>

        <div className="w-full scroll-mt-24" ref={analysisRef}>
          {selectedTransformerId ? (
            <TransformerDetail 
              transformerId={selectedTransformerId} 
              onClose={() => setSelectedTransformerId(null)} 
            />
          ) : (
            <div className="flex h-[120px] items-center justify-center rounded-lg border border-border border-dashed bg-surface-2/30">
              <p className="text-sm text-muted-foreground">
                Select a transformer to view analysis
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
