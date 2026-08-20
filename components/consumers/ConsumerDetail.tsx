"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Consumer } from "@/lib/store/types";
import { ShieldAlert, Zap, Calendar, Users, Map, Activity, MapPin, ChevronUp } from "lucide-react";
import { RiskAssessment } from "@/lib/store/types";
import { useGridState } from "@/lib/store/grid-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateInspectionModal } from "@/components/inspections/CreateInspectionModal";

export function ConsumerDetail({ 
  consumer, 
  risk, 
  onClose 
}: { 
  consumer: Consumer, 
  risk: RiskAssessment, 
  onClose: () => void 
}) {
  const router = useRouter();
  const { inspections, transformers } = useGridState();
  const [showModal, setShowModal] = useState(false);

  const isHighRisk = risk.level === "critical" || risk.level === "high";
  const parentTransformer = transformers.find(t => t.id === consumer.transformerId);
  
  const lastInspection = [...inspections]
    .filter(i => i.consumerIds.includes(consumer.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const getOutcomeBadge = (predicted: string | undefined, actual: string | undefined) => {
    if (!predicted || !actual) return null;
    if (actual === "other") return <Badge className="bg-surface-3 text-muted-foreground border-border text-[9px] mt-2">UNRESOLVED / NOT EVALUATED</Badge>;
    const isPredictedIssue = predicted !== "no_issue" && predicted !== "safe";
    const isActualIssue = actual !== "no_issue";

    if (isPredictedIssue && isActualIssue) return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px]">TRUE POSITIVE</Badge>;
    if (isPredictedIssue && !isActualIssue) return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[9px]">FALSE POSITIVE</Badge>;
    if (!isPredictedIssue && isActualIssue) return <Badge className="bg-risk-critical/10 text-risk-critical border-risk-critical/20 text-[9px]">FALSE NEGATIVE</Badge>;
    return null;
  };

  const getEvidenceCount = (inspection: any) => {
    if (!inspection.evidence) return 0;
    return inspection.evidence.reduce((acc: number, curr: any) => acc + (curr.media?.length || 0), 0);
  };

  return (
    <>
      <Card className="bg-surface-2 border-border/50 animate-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="flex flex-row items-start justify-between border-b border-border/50 pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Consumer Intelligence</span>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">{consumer.id}</CardTitle>
              <Badge variant="outline" className="ml-2 font-mono text-[10px] text-muted-foreground">{consumer.meterId}</Badge>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" /> {consumer.area}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
            Collapse <ChevronUp className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
            
            {/* Left Column */}
            <div className="flex flex-col p-6 gap-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Risk Score</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-2xl font-black ${isHighRisk ? "text-risk-critical" : "text-foreground"}`}>{risk.score}</span>
                    <span className="text-sm font-medium text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Expected</span>
                  <span className="text-lg font-bold text-foreground mt-1">{consumer.expectedConsumption} <span className="text-sm font-normal text-muted-foreground">U</span></span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Actual</span>
                  <span className={`text-lg font-bold mt-1 ${consumer.actualConsumption < consumer.expectedConsumption * 0.5 ? "text-risk-critical" : "text-emerald-500"}`}>{consumer.actualConsumption} <span className="text-sm font-normal text-muted-foreground">U</span></span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><ShieldAlert size={14}/> Behavioral Anomalies</h3>
                <div className="flex flex-col gap-2">
                  {risk.drivers.map((driver, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface-3/50 border border-border/50">
                      <span className="text-sm font-medium text-foreground">{driver.name}</span>
                      <Badge variant="secondary" className="text-[10px] font-bold">+{driver.contribution} impact</Badge>
                    </div>
                  ))}
                  {risk.drivers.length === 0 && (
                    <span className="text-sm text-muted-foreground italic p-2">No significant anomalies detected.</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Calendar size={14}/> Inspection History</h3>
                {lastInspection ? (
                  <div className="flex flex-col p-4 rounded-lg bg-surface-3/30 border border-border/50 gap-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-foreground">{lastInspection.id}</span>
                      <span className="text-xs font-semibold text-muted-foreground">{new Date(lastInspection.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="text-[10px] uppercase border-border">{lastInspection.status}</Badge>
                      <Badge variant="outline" className="text-[10px] uppercase border-border">{getEvidenceCount(lastInspection)} Photos</Badge>
                      {lastInspection.status === "completed" && getOutcomeBadge(lastInspection.predictedRiskType, "actualFinding" in lastInspection ? (lastInspection as any).actualFinding : lastInspection.outcomeId ? "no_issue" : "")}
                    </div>

                    {lastInspection.fieldObservations && (
                      <div className="mt-2 bg-surface-1 p-2 rounded border border-border/30">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">Field Observations</span>
                        <p className="text-xs text-foreground mt-1">"{lastInspection.fieldObservations}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">No prior inspections for this consumer.</span>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col p-6 gap-8">
              <div className="flex flex-col rounded-lg border border-border/50 bg-surface-3/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className={`h-5 w-5 ${isHighRisk ? "text-risk-critical" : "text-emerald-500"}`} />
                  <h3 className="text-sm font-semibold text-foreground">Action Recommendation</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {isHighRisk 
                    ? "Severe drop in expected consumption indicates possible meter bypass or tampering. Schedule field inspection immediately." 
                    : "Consumption aligns with expected profiles. No immediate action required."}
                </p>
                <div className="flex flex-col gap-2">
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setShowModal(true)}>Schedule Inspection</Button>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button variant="outline" onClick={() => router.push(`/transformers/${consumer.transformerId}`)}>View Transformer</Button>
                    <Button variant="outline" onClick={() => router.push(`/map?focus=${consumer.id}`)}>View on Map</Button>
                  </div>
                </div>
              </div>

              {parentTransformer && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Zap size={14}/> Parent Transformer Context</h3>
                  <div className="flex flex-col p-4 rounded-lg border border-border/50 bg-surface-1 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">{parentTransformer.id}</span>
                      <span className="text-xs text-muted-foreground">{parentTransformer.area}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase text-muted-foreground">Total Input</span>
                        <span className="text-sm font-semibold">{parentTransformer.input} U</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase text-muted-foreground">Comm Loss</span>
                        <span className={`text-sm font-bold ${parentTransformer.commLoss > 50 ? "text-risk-critical" : "text-amber-500"}`}>{parentTransformer.commLoss} U</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </CardContent>
      </Card>
      
      {showModal && (
        <CreateInspectionModal 
          transformerId={consumer.transformerId}
          consumerIds={[consumer.id]}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}


