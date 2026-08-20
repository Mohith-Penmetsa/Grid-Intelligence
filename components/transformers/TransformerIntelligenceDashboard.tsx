"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, Zap, ServerCrash } from "lucide-react";
import { IntelligenceTable } from "./IntelligenceTable";
import { IntelligenceDetail } from "./IntelligenceDetail";
import { useGridState } from "@/lib/store/grid-context";
import { calculateTransformerRisk } from "@/lib/intelligence/risk-engine";

export function TransformerIntelligenceDashboard() {
  const [selectedTransformerId, setSelectedTransformerId] = useState<string | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  const { transformers, consumers, settings } = useGridState();

  const data = transformers.map(t => ({
    transformer: t,
    risk: calculateTransformerRisk(t, consumers, settings)
  })).sort((a, b) => b.risk.score - a.risk.score);

  const selectedAnalysis = selectedTransformerId ? data.find((a) => a.transformer.id === selectedTransformerId) : null;

  useEffect(() => {
    if (selectedTransformerId && analysisRef.current) {
      analysisRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedTransformerId]);

  const stats = {
    total: data.length,
    critical: data.filter((d) => d.risk.level === "critical").length,
    high: data.filter((d) => d.risk.level === "high").length,
    abnormal: data.filter((d) => d.transformer.commLoss / d.transformer.input > 0.025).length,
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Analyzed</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-foreground">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Critical Risk</span>
              <div className="h-8 w-8 rounded-full bg-risk-critical/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-risk-critical" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-risk-critical">{stats.critical}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">High Risk</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ServerCrash className="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-amber-500">{stats.high}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Abnormal Loss</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-foreground">{stats.abnormal}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-foreground/90 uppercase">
            Transformer Ranking
          </h2>
        </div>
        <IntelligenceTable 
          data={data}
          selectedId={selectedTransformerId} 
          onSelect={setSelectedTransformerId} 
        />
      </section>

      <section className="w-full scroll-mt-24" ref={analysisRef}>
        {selectedAnalysis ? (
          <IntelligenceDetail 
            transformer={selectedAnalysis.transformer} 
            risk={selectedAnalysis.risk}
            onClose={() => setSelectedTransformerId(null)} 
          />
        ) : (
          <div className="flex h-[120px] items-center justify-center rounded-lg border border-border border-dashed bg-surface-2/30">
            <p className="text-sm text-muted-foreground">
              Select a transformer to view intelligence analysis
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

