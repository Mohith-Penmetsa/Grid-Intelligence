"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGridState } from "@/lib/store/grid-context";
import { Zap, Users, AlertTriangle, TrendingUp, BrainCircuit, Activity, IndianRupee } from "lucide-react";
import { calculateTransformerRisk, calculateConsumerRisk } from "@/lib/intelligence/risk-engine";

export function ReportsDashboard() {
  const { transformers, consumers, inspections, outcomes, settings } = useGridState();

  const totalInput = transformers.reduce((sum, t) => sum + t.input, 0);
  const totalTechLoss = transformers.reduce((sum, t) => sum + t.techLoss, 0);
  const totalCommLoss = transformers.reduce((sum, t) => sum + t.commLoss, 0);
  const totalConsumed = transformers.reduce((sum, t) => sum + t.consumed, 0);

  const overallCommLossPct = totalInput > 0 ? (totalCommLoss / totalInput) * 100 : 0;
  const overallTechLossPct = totalInput > 0 ? (totalTechLoss / totalInput) * 100 : 0;

  const tRisks = transformers.map(t => ({ t, risk: calculateTransformerRisk(t, consumers, settings) }));
  const cRisks = consumers.map(c => ({ c, risk: calculateConsumerRisk(c, settings) }));

  const worstTransformer = [...tRisks].sort((a, b) => b.t.commLoss - a.t.commLoss)[0];
  const worstConsumer = [...cRisks].sort((a, b) => {
    const aDev = (a.c.expectedConsumption - a.c.actualConsumption) / (a.c.expectedConsumption || 1);
    const bDev = (b.c.expectedConsumption - b.c.actualConsumption) / (b.c.expectedConsumption || 1);
    return bDev - aDev;
  })[0];

  const completedInspections = inspections.filter(i => i.status === "completed");
  
  let evaluatedCount = 0;
  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;
  let trueNegatives = 0;

  completedInspections.forEach(ins => {
    // Try to get actual finding directly from inspection, fallback to outcome array
    const outcome = outcomes.find(o => o.inspectionId === ins.id);
    const actual = ins.actualFinding || outcome?.actualFinding;
    const predicted = ins.predictedRiskType;
    
    if (!predicted || !actual || actual === "other") {
      return; // UNRESOLVED
    }

    evaluatedCount++;

    const isPredictedIssue = predicted !== "no_issue" && predicted !== "safe";
    const isActualIssue = actual !== "no_issue";

    if (isPredictedIssue && isActualIssue) {
      if (predicted === actual || actual.includes(predicted) || predicted.includes(actual)) {
        truePositives++;
      } else {
        falsePositives++;
        falseNegatives++;
      }
    }
    else if (isPredictedIssue && !isActualIssue) falsePositives++;
    else if (!isPredictedIssue && isActualIssue) falseNegatives++;
    else if (!isPredictedIssue && !isActualIssue) trueNegatives++;
  });

  

  const precision = (truePositives + falsePositives) > 0 ? (truePositives / (truePositives + falsePositives)) * 100 : 0;
  const recall = (truePositives + falseNegatives) > 0 ? (truePositives / (truePositives + falseNegatives)) * 100 : 0;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">1. Network Energy Balance</h3>
          <Card className="bg-surface-2 border-border/50 h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full gap-6">
              
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Total Energy Input</span>
                <span className="text-3xl font-black text-foreground">{totalInput.toLocaleString()} <span className="text-sm font-semibold text-muted-foreground">Units</span></span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1 p-3 bg-surface-3/50 rounded-lg border border-border/50">
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold">Consumed</span>
                  <span className="text-lg font-bold text-emerald-500">{totalConsumed.toLocaleString()} U</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-surface-3/50 rounded-lg border border-border/50">
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold">Tech Loss</span>
                  <span className="text-lg font-bold text-amber-500">{totalTechLoss.toLocaleString()} U</span>
                  <span className="text-[10px] text-muted-foreground">{overallTechLossPct.toFixed(1)}%</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-risk-critical/10 rounded-lg border border-risk-critical/30">
                  <span className="text-[10px] uppercase text-risk-critical font-bold">Unexplained</span>
                  <span className="text-lg font-bold text-risk-critical">{totalCommLoss.toLocaleString()} U</span>
                  <span className="text-[10px] font-semibold text-risk-critical">{overallCommLossPct.toFixed(1)}%</span>
                </div>
              </div>

              <div className="w-full h-4 rounded-full overflow-hidden flex bg-surface-3 border border-border/50">
                <div className="h-full bg-emerald-500" style={{ width: `${(totalConsumed/totalInput)*100}%` }} title="Consumed"></div>
                <div className="h-full bg-amber-500" style={{ width: `${(totalTechLoss/totalInput)*100}%` }} title="Technical Loss"></div>
                <div className="h-full bg-risk-critical" style={{ width: `${(totalCommLoss/totalInput)*100}%` }} title="Commercial / Unexplained Loss"></div>
              </div>

            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">2. Intelligence Risk Distribution</h3>
          <Card className="bg-surface-2 border-border/50 h-full">
            <CardContent className="p-5 flex flex-col gap-6">
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2"><Zap className="h-4 w-4 text-muted-foreground" /> Transformers Analyzed</span>
                  <span className="text-xs font-medium text-muted-foreground">Total: {transformers.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["critical", "high", "medium", "safe"].map(level => {
                    const count = tRisks.filter(t => t.risk.level === level || (level === "safe" && t.risk.level === "low")).length;
                    let color = "bg-emerald-500/20 text-emerald-500";
                    if (level === "critical") color = "bg-risk-critical/20 text-risk-critical";
                    if (level === "high") color = "bg-orange-500/20 text-orange-500";
                    if (level === "medium") color = "bg-amber-500/20 text-amber-500";
                    
                    return (
                      <div key={`tr-${level}`} className={`flex flex-col items-center justify-center p-2 rounded-lg ${color} border border-border/10`}>
                        <span className="text-xl font-black">{count}</span>
                        <span className="text-[10px] uppercase font-bold">{level}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> Consumers Analyzed</span>
                  <span className="text-xs font-medium text-muted-foreground">Total: {consumers.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["critical", "high", "medium", "safe"].map(level => {
                    const count = cRisks.filter(c => c.risk.level === level || (level === "safe" && c.risk.level === "low")).length;
                    let color = "bg-emerald-500/20 text-emerald-500";
                    if (level === "critical") color = "bg-risk-critical/20 text-risk-critical";
                    if (level === "high") color = "bg-orange-500/20 text-orange-500";
                    if (level === "medium") color = "bg-amber-500/20 text-amber-500";
                    
                    return (
                      <div key={`c-${level}`} className={`flex flex-col items-center justify-center p-2 rounded-lg ${color} border border-border/10`}>
                        <span className="text-xl font-black">{count}</span>
                        <span className="text-[10px] uppercase font-bold">{level}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </CardContent>
          </Card>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">3. Inspection Pipeline</h3>
          <Card className="bg-surface-2 border-border/50 h-full">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center p-3 bg-surface-3 rounded border border-border/50">
                  <span className="text-sm font-medium text-foreground">Pending Dispatch</span>
                  <Badge variant="outline" className="font-bold text-amber-500 border-amber-500/30 bg-amber-500/10">{inspections.filter(i => i.status === "pending").length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-3 rounded border border-border/50">
                  <span className="text-sm font-medium text-foreground">Assigned & In Progress</span>
                  <Badge variant="outline" className="font-bold text-primary border-primary/30 bg-primary/10">{inspections.filter(i => i.status === "assigned" || i.status === "in_progress").length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-3 rounded border border-border/50">
                  <span className="text-sm font-medium text-foreground">Completed Successfully</span>
                  <Badge variant="outline" className="font-bold text-emerald-500 border-emerald-500/30 bg-emerald-500/10">{inspections.filter(i => i.status === "completed").length}</Badge>
                </div>
                <div className="h-px bg-border/50 my-2"></div>
                <div className="flex justify-between items-center p-3 bg-risk-critical/5 rounded border border-risk-critical/20">
                  <span className="text-sm font-medium text-foreground">Critical Priority Inspections</span>
                  <Badge variant="outline" className="font-bold text-risk-critical border-risk-critical/30 bg-risk-critical/10">{inspections.filter(i => i.priority === "critical").length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">4. Closed-Loop Feedback & Insights</h3>
          <Card className="bg-surface-2 border-border/50 h-full">
            <CardContent className="p-5 flex flex-col gap-4">
              
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-surface-3/50 border border-primary/20">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">Model Prediction vs Actual Field Outcome</span>
                </div>
                
                {evaluatedCount > 0 ? (
                  <>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      <div className="flex flex-col items-center justify-center p-2 rounded bg-surface-1 border border-border/50">
                        <span className="text-xl font-bold text-foreground">{evaluatedCount}</span>
                        <span className="text-[10px] text-muted-foreground font-semibold">EVALUATED</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 rounded bg-emerald-500/10 border border-emerald-500/30">
                        <span className="text-xl font-bold text-emerald-500">{truePositives}</span>
                        <span className="text-[10px] text-emerald-500 font-semibold">TRUE POSITIVE</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 rounded bg-orange-500/10 border border-orange-500/30">
                        <span className="text-xl font-bold text-orange-500">{falsePositives}</span>
                        <span className="text-[10px] text-orange-500 font-semibold">FALSE POSITIVE</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 rounded bg-risk-critical/10 border border-risk-critical/30">
                        <span className="text-xl font-bold text-risk-critical">{falseNegatives}</span>
                        <span className="text-[10px] text-risk-critical font-semibold">FALSE NEGATIVE</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 rounded bg-blue-500/10 border border-blue-500/30">
                        <span className="text-xl font-bold text-blue-500">{trueNegatives}</span>
                        <span className="text-[10px] text-blue-500 font-semibold">TRUE NEGATIVE</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Precision</span>
                          <span className="text-sm font-bold">{precision.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-1 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${precision}%` }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Recall</span>
                          <span className="text-sm font-bold">{recall.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-1 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${recall}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center p-6 border border-dashed border-border/50 rounded bg-surface-1 mt-2">
                    <span className="text-sm text-muted-foreground italic">No evaluated outcomes yet</span>
                  </div>
                )}
              </div>

              {worstTransformer && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-3/50 border border-border/50">
                  <IndianRupee className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-foreground">Highest Network Loss Source</span>
                    <span className="text-xs text-muted-foreground">
                      Transformer <strong className="text-foreground">{worstTransformer.t.id}</strong> ({worstTransformer.t.area}) is generating the most severe unexplained loss (<strong className="text-foreground">{worstTransformer.t.commLoss} units</strong>).
                    </span>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}













