"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, FileText, TrendingUp, AlertTriangle, Zap, IndianRupee, Users, ShieldAlert } from "lucide-react";
import { getAllAnalyzedTransformers } from "@/lib/intelligence/transformer-risk";
import { getAllAnalyzedConsumers } from "@/lib/intelligence/consumer-risk";
import { MOCK_INSPECTIONS } from "@/lib/intelligence/inspection-data";

export function ReportsDashboard() {
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // Data ingestion
  const transformers = getAllAnalyzedTransformers();
  const consumers = getAllAnalyzedConsumers();
  const inspections = MOCK_INSPECTIONS;

  // KPIs
  const totalInput = transformers.reduce((acc, t) => acc + t.data.input, 0);
  const totalTechLoss = transformers.reduce((acc, t) => acc + t.data.techLoss, 0);
  const totalCommLoss = transformers.reduce((acc, t) => acc + t.data.commLoss, 0);
  const totalCommLossPct = totalInput > 0 ? (totalCommLoss / totalInput) * 100 : 0;
  
  const highRiskTransformers = transformers.filter(t => t.riskLevel === "critical" || t.riskLevel === "high");
  const highRiskConsumers = consumers.filter(c => c.riskLevel === "critical" || c.riskLevel === "high");
  
  const activeInspections = inspections.filter(i => i.status === "pending" || i.status === "assigned" || i.status === "in_progress");
  const completedInspections = inspections.filter(i => i.status === "completed");

  // Insights
  const worstTransformer = [...transformers].sort((a, b) => b.data.commLoss - a.data.commLoss)[0];
  const worstConsumer = [...consumers].sort((a, b) => b.commercialLossExposure - a.commercialLossExposure)[0];
  
  const totalCriticalEntities = transformers.filter(t => t.riskLevel === "critical").length + consumers.filter(c => c.riskLevel === "critical").length;

  const handleGenerate = () => {
    setReportGenerating(true);
    setReportGenerated(false);
    setTimeout(() => {
      setReportGenerating(false);
      setReportGenerated(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-2 p-4 rounded-lg border border-border/50">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Grid Intelligence Report
          </h2>
          <span className="text-sm text-muted-foreground">Aggregated data across Transformers, Consumers, and Field Operations.</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleGenerate} 
            disabled={reportGenerating}
          >
            {reportGenerating ? "Generating..." : reportGenerated ? "Regenerate" : "Generate Report"}
          </Button>
          <Button 
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!reportGenerated}
          >
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {reportGenerated && (
        <div className="flex items-center gap-2 p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Report generated successfully. Data snapshot captured for export.</span>
        </div>
      )}

      {/* 1. Report Overview */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">1. Performance Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-surface-2 border-border/50">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Total Energy Input</span>
              <span className="text-2xl font-black text-foreground">{totalInput.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">units</span></span>
            </CardContent>
          </Card>
          <Card className="bg-surface-2 border-border/50">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Total Tech Loss</span>
              <span className="text-2xl font-black text-amber-500">{totalTechLoss.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">units</span></span>
            </CardContent>
          </Card>
          <Card className="bg-surface-2 border-border/50">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Commercial Loss</span>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-risk-critical">{totalCommLoss.toLocaleString()}</span>
                <span className="text-sm font-bold text-risk-critical mb-1">({totalCommLossPct.toFixed(1)}%)</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-surface-2 border-border/50">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Active Inspections</span>
              <span className="text-2xl font-black text-primary">{activeInspections.length} <span className="text-sm font-medium text-muted-foreground">pending</span></span>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Loss Analysis */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">2. Loss Distribution</h3>
          <Card className="bg-surface-2 border-border/50 h-full">
            <CardContent className="p-5 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">Technical Loss vs Commercial Loss</span>
                  <span className="text-muted-foreground">{totalTechLoss} vs {totalCommLoss} units</span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden">
                  <div className="bg-amber-500" style={{ width: `${(totalTechLoss / (totalTechLoss + totalCommLoss)) * 100}%` }}></div>
                  <div className="bg-risk-critical" style={{ width: `${(totalCommLoss / (totalTechLoss + totalCommLoss)) * 100}%` }}></div>
                </div>
                <div className="flex items-center gap-4 text-xs mt-1">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-muted-foreground">Tech Loss</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-risk-critical"></div><span className="text-muted-foreground">Comm Loss</span></div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Top Loss Contributors</span>
                <div className="flex flex-col gap-2">
                  {transformers.slice(0,3).map(t => (
                    <div key={t.data.id} className="flex items-center justify-between p-2 rounded bg-surface-3/50 text-sm">
                      <span className="font-medium text-foreground">{t.data.id} <span className="text-muted-foreground ml-1">({t.data.area})</span></span>
                      <span className="font-bold text-risk-critical">{t.data.commLoss} units</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3. Risk Distribution */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">3. Entity Risk Status</h3>
          <Card className="bg-surface-2 border-border/50 h-full">
            <CardContent className="p-5 flex flex-col gap-6">
              
              {/* Transformers Risk */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2"><Zap className="h-4 w-4 text-muted-foreground" /> Transformers</span>
                  <span className="text-xs font-medium text-muted-foreground">Total: {transformers.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["critical", "high", "medium", "safe"].map(level => {
                    const count = transformers.filter(t => t.riskLevel === level || (level === "safe" && t.riskLevel === "low")).length;
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

              {/* Consumers Risk */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> Consumers Analyzed</span>
                  <span className="text-xs font-medium text-muted-foreground">Total: {consumers.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["critical", "high", "medium", "safe"].map(level => {
                    const count = consumers.filter(c => c.riskLevel === level || (level === "safe" && c.riskLevel === "low")).length;
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
        
        {/* 4. Inspection Performance */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">4. Inspection Pipeline</h3>
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
                  <Badge variant="outline" className="font-bold text-emerald-500 border-emerald-500/30 bg-emerald-500/10">{completedInspections.length}</Badge>
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

        {/* 5. Key Operational Insights */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">5. Executive Insights</h3>
          <Card className="bg-surface-2 border-border/50 h-full">
            <CardContent className="p-5 flex flex-col gap-4">
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-risk-critical/10 border border-risk-critical/20">
                <ShieldAlert className="h-5 w-5 text-risk-critical mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-risk-critical">Critical Entities Require Attention</span>
                  <span className="text-xs text-muted-foreground">
                    There are currently <strong className="text-foreground">{totalCriticalEntities} critical-risk entities</strong> across the network requiring immediate inspection dispatch.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-3/50 border border-border/50">
                <IndianRupee className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">Highest Network Loss Source</span>
                  <span className="text-xs text-muted-foreground">
                    Transformer <strong className="text-foreground">{worstTransformer?.data.id}</strong> ({worstTransformer?.data.area}) is generating the most severe unexplained loss (<strong className="text-foreground">{worstTransformer?.data.commLoss} units</strong>).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-3/50 border border-border/50">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">Most Anomalous Consumer</span>
                  <span className="text-xs text-muted-foreground">
                    Consumer <strong className="text-foreground">{worstConsumer?.data.id}</strong> (Meter: {worstConsumer?.data.meterId}) shows the highest deviation at <strong className="text-risk-critical">{worstConsumer?.deviationPercentage.toFixed(1)}% below baseline</strong>.
                  </span>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex justify-end">
                <Badge variant="secondary" className="text-[10px] bg-surface-1 border-0">Insights derived from model-ready analysis</Badge>
              </div>

            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
