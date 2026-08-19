"use client";

import { useState } from "react";
import { KpiCards } from "./KpiCards";
import { TransformerRiskTable } from "./TransformerRiskTable";
import { TransformerDetail } from "./TransformerDetail";

export function OperationsDashboard() {
  const [selectedTransformerId, setSelectedTransformerId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* KPI Overview */}
      <section>
        <KpiCards />
      </section>

      {/* Main Content Area: Table + Detail Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
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

        <div className="lg:col-span-1">
          {selectedTransformerId ? (
            <TransformerDetail 
              transformerId={selectedTransformerId} 
              onClose={() => setSelectedTransformerId(null)} 
            />
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-border border-dashed bg-surface-2/30">
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
