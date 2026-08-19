import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ArrowDown, Activity, AlertTriangle, ShieldAlert, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RiskAnalysis } from "@/lib/intelligence/transformer-risk";

export function IntelligenceDetail({ analysis, onClose }: { analysis: RiskAnalysis, onClose: () => void }) {
  const t = analysis.data;
  const expectedAvailable = t.input - t.techLoss;
  const isHighRisk = analysis.riskLevel === "critical" || analysis.riskLevel === "high";

  return (
    <Card className="bg-surface-2 border-border/50 animate-in slide-in-from-top-4 fade-in duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Transformer Analysis</span>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold">{t.id}</CardTitle>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
          Collapse <ChevronUp className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          
          {/* Left Column: Stats & Energy Flow */}
          <div className="flex flex-col p-6 gap-8">
            {/* Top metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Area</span>
                <span className="text-sm font-medium text-foreground mt-1">{t.area}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Risk Score</span>
                <span className="text-2xl font-black text-foreground">{analysis.riskScore}<span className="text-sm font-medium text-muted-foreground ml-1">/100</span></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Risk Level</span>
                <Badge variant="outline" className={`w-fit mt-1 font-bold uppercase ${isHighRisk ? "border-risk-critical text-risk-critical bg-risk-critical/10" : "border-amber-500 text-amber-500 bg-amber-500/10"}`}>
                  {analysis.riskLevel}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Comm. Loss %</span>
                <span className="text-2xl font-bold text-amber-400">{analysis.commercialLossPercentage.toFixed(1)}%</span>
              </div>
            </div>

            {/* Reconciliation */}
            <div className="flex flex-col mt-4">
              <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-6 font-semibold">Energy Flow Reconciliation</h3>
              
              <div className="flex flex-col gap-0 max-w-md">
                <div className="flex items-center justify-between p-3 rounded bg-surface-3">
                  <span className="text-sm font-medium text-foreground">Input Energy</span>
                  <span className="text-sm font-bold">{t.input} units</span>
                </div>
                
                <div className="flex justify-center py-1.5">
                  <ArrowDown className="h-4 w-4 text-muted-foreground/70" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded border border-border/50">
                  <span className="text-sm text-muted-foreground">Expected Technical Loss</span>
                  <span className="text-sm font-medium text-muted-foreground">- {t.techLoss} units</span>
                </div>
                
                <div className="flex justify-center py-1.5">
                  <ArrowDown className="h-4 w-4 text-muted-foreground/70" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded bg-primary/5 border border-primary/20">
                  <span className="text-sm font-medium text-primary">Expected Available Energy</span>
                  <span className="text-sm font-bold text-primary">{expectedAvailable} units</span>
                </div>
                
                <div className="flex justify-center py-1.5">
                  <ArrowDown className="h-4 w-4 text-muted-foreground/70" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded border border-border/50">
                  <span className="text-sm text-muted-foreground">Recorded Consumer Consumption</span>
                  <span className="text-sm font-medium text-muted-foreground">- {t.consumed} units</span>
                </div>
                
                <div className="flex justify-center py-1.5">
                  <ArrowDown className={isHighRisk ? "h-4 w-4 text-risk-critical/70" : "h-4 w-4 text-amber-500/70"} />
                </div>
                
                <div className={`flex items-center justify-between p-4 rounded border ${isHighRisk ? "bg-risk-critical/10 border-risk-critical/30" : "bg-amber-500/10 border-amber-500/30"}`}>
                  <span className={`text-sm font-bold ${isHighRisk ? "text-risk-critical" : "text-amber-500"}`}>Unexplained Commercial Loss</span>
                  <span className={`text-sm font-black ${isHighRisk ? "text-risk-critical" : "text-amber-500"}`}>{t.commLoss} units</span>
                </div>
              </div>
            </div>

            {/* Anomaly Signals */}
            {analysis.anomalies.length > 0 && (
              <div className="flex flex-col mt-4">
                <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Anomaly Signals</h3>
                <div className="flex flex-col gap-2">
                  {analysis.anomalies.map((anomaly, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded bg-surface-3/50 border border-border/50">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-foreground">{anomaly.signal}</span>
                        <span className="text-xs text-muted-foreground">
                          Observed: <strong className="text-foreground">{anomaly.observedValue}</strong> (Expected: {anomaly.expectedValue})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Explainable AI & Actions */}
          <div className="flex flex-col p-6 gap-8">
            <div className="flex flex-col border border-border/50 rounded-lg bg-surface-3/30 overflow-hidden">
              <div className="flex items-center gap-2 p-3 bg-primary/10 border-b border-primary/20">
                <Cpu className="h-4 w-4 text-primary" />
                <h3 className="text-xs uppercase tracking-wider font-semibold text-primary">Explainable AI � Risk Assessment</h3>
                <Badge variant="secondary" className="ml-auto text-[10px] bg-primary/20 text-primary border-0">Model-ready analysis</Badge>
              </div>
              <div className="p-5 flex flex-col gap-5">
                <div className="flex justify-between items-end border-b border-border/50 pb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Confidence</span>
                    <span className="text-lg font-bold text-foreground">{analysis.confidence}%</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Assessment</span>
                    <span className={`text-lg font-bold uppercase ${isHighRisk ? "text-risk-critical" : "text-amber-500"}`}>{analysis.riskLevel} RISK</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Why is this transformer high risk?</span>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {analysis.explanation}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Contributing Factors</span>
                  <div className="flex flex-col gap-2">
                    {analysis.factors.map((factor, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-foreground font-medium">{idx + 1}. {factor.name}</span>
                        <div className="flex items-center gap-2 w-1/3">
                          <div className="h-1.5 flex-1 bg-surface-1 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${factor.contribution}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="flex flex-col p-5 rounded-lg border border-border/50 bg-surface-3/50">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className={isHighRisk ? "h-5 w-5 text-risk-critical" : "h-5 w-5 text-amber-500"} />
                <h3 className="text-sm font-semibold text-foreground">Recommended Action</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                {isHighRisk ? "High-priority field inspection recommended. Unexplained commercial loss is significantly above baseline." : "Monitor closely. Commercial loss detected but below critical threshold."}
              </p>
              <Button className={`w-full ${isHighRisk ? "bg-risk-critical hover:bg-risk-critical/90 text-risk-critical-fg" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}>
                Create Inspection
              </Button>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
