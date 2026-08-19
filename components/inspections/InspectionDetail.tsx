import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ClipboardCheck, AlertTriangle, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InspectionData, InspectionStatus, MOCK_OFFICERS } from "@/lib/intelligence/inspection-data";
import { getAllAnalyzedConsumers } from "@/lib/intelligence/consumer-risk";
import { getAllAnalyzedTransformers } from "@/lib/intelligence/transformer-risk";

export function InspectionDetail({ inspection, onClose, onUpdateStatus }: { inspection: InspectionData, onClose: () => void, onUpdateStatus: (id: string, status: InspectionStatus, officer?: string) => void }) {
  const [selectedOfficer, setSelectedOfficer] = useState<string>(inspection.assignedOfficer || "");
  
  useEffect(() => {
    setSelectedOfficer(inspection.assignedOfficer || "");
  }, [inspection.id, inspection.assignedOfficer]);

  const allConsumers = getAllAnalyzedConsumers();
  const allTransformers = getAllAnalyzedTransformers();
  
  const consumerAnalysis = allConsumers.find(c => c.data.id === inspection.consumerId);
  const transformerAnalysis = allTransformers.find(t => t.data.id === consumerAnalysis?.data.transformerId);

  const expectedConsumption = consumerAnalysis?.data.expectedConsumption || 0;
  const observedConsumption = consumerAnalysis?.data.actualConsumption || 0;
  const deviationPercentage = expectedConsumption > 0 ? ((expectedConsumption - observedConsumption) / expectedConsumption) * 100 : 0;
  const commercialLossExposure = consumerAnalysis?.commercialLossExposure || 0;
  
  const transformerId = transformerAnalysis?.data.id || "Unknown";
  const area = consumerAnalysis?.data.area || "Unknown";
  const transformerRiskScore = transformerAnalysis?.riskScore || 0;
  const transformerRiskLevel = transformerAnalysis?.riskLevel || "safe";

  const isHighRisk = inspection.priority === "critical" || inspection.priority === "high";

  const handleAssign = () => {
    if (selectedOfficer) {
      onUpdateStatus(inspection.id, "assigned", selectedOfficer);
    }
  };

  const getRecommendation = () => {
    if (inspection.status === "completed") {
      return "Inspection completed. Review the field evidence for final outcome.";
    }
    switch (inspection.priority) {
      case "critical":
        return "High-priority field inspection recommended because recorded consumption is substantially below the expected baseline and the associated transformer shows elevated commercial loss.";
      case "high":
        return "High-priority field inspection recommended. Anomalous behavior exceeds normal variance.";
      case "medium":
        return "Targeted field inspection recommended to verify meter functionality and investigate moderate consumption deviations.";
      case "low":
      default:
        return "Routine monitoring and verification recommended. No critical anomalies detected.";
    }
  };

  const getExpectedOutcome = () => {
    if (inspection.status === "completed") {
      return "Completed.";
    }
    return isHighRisk ? "Meter tampering or unmetered bypass." : "Routine verification of meter health.";
  };

  return (
    <Card className="bg-surface-2 border-border/50 animate-in slide-in-from-top-4 fade-in duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Transformer / Field Inspection</span>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold">{inspection.id}</CardTitle>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
          Collapse <ChevronUp className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          
          {/* Left Column: Context & Evidence */}
          <div className="flex flex-col p-6 gap-8">
            {/* Top metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</span>
                <Badge variant="outline" className={`w-fit mt-1 font-bold uppercase border-primary/50 text-primary bg-primary/10`}>
                  {inspection.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Priority</span>
                <span className={`text-xl font-bold uppercase ${isHighRisk ? "text-risk-critical" : inspection.priority === "medium" ? "text-amber-500" : "text-emerald-500"}`}>{inspection.priority}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Risk Score</span>
                <span className="text-xl font-black text-foreground">{inspection.riskScore}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Consumer ID</span>
                <span className="text-sm font-medium text-foreground mt-1">{inspection.consumerId}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Transformer ID</span>
                <span className="text-sm font-medium text-foreground mt-1">{transformerId}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Area</span>
                <span className="text-sm font-medium text-foreground mt-1">{area}</span>
              </div>
            </div>

            {/* Why created */}
            <div className="flex flex-col mt-4">
              <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Primary Trigger</h3>
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-surface-3/50 border border-border/50">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <AlertTriangle className={isHighRisk ? "text-risk-critical" : "text-amber-500"} size={16} />
                  {inspection.triggerReason}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Observed:</span>
                    <span className="text-sm font-medium">{observedConsumption} units</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Expected:</span>
                    <span className="text-sm font-medium">{expectedConsumption} units</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Deviation:</span>
                    <span className={`text-sm font-bold ${deviationPercentage > 20 ? "text-risk-critical" : "text-amber-500"}`}>{deviationPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Commercial Loss Exposure:</span>
                    <span className="text-sm font-medium">{commercialLossExposure} units</span>
                  </div>
                </div>

                <div className="h-px bg-border/50 my-2"></div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Transformer Risk ({transformerId}):</span>
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold ${
                    transformerRiskLevel === "critical" || transformerRiskLevel === "high" 
                      ? "border-risk-critical text-risk-critical bg-risk-critical/10" 
                      : transformerRiskLevel === "medium" 
                        ? "border-amber-500 text-amber-500 bg-amber-500/10" 
                        : "border-emerald-500 text-emerald-500 bg-emerald-500/10"
                  }`}>
                    {transformerRiskScore} / 100 — {transformerRiskLevel}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Field Evidence */}
            <div className="flex flex-col mt-4">
              <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Field Evidence Verification</h3>
              <div className="flex flex-col gap-2">
                {inspection.evidence.map((ev, idx) => {
                  let colorClass = "text-muted-foreground border-border/50";
                  if (ev.status === "verified") colorClass = "text-emerald-500 border-emerald-500/30 bg-emerald-500/5";
                  if (ev.status === "flagged") colorClass = "text-risk-critical border-risk-critical/30 bg-risk-critical/5";
                  
                  return (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded border ${colorClass}`}>
                      <div className="flex items-center gap-3">
                        {ev.status === "verified" ? <CheckCircle2 className="h-4 w-4" /> : 
                         ev.status === "flagged" ? <AlertTriangle className="h-4 w-4" /> : 
                         <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />}
                        <span className="text-sm font-medium text-foreground">{ev.label}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] uppercase bg-surface-3">
                        {ev.status.replace("_", " ")}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              {inspection.officerNotes && (
                <div className="mt-4 p-4 bg-surface-3/30 border border-border/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground">Officer Notes</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{inspection.officerNotes}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Workflow & Assignment */}
          <div className="flex flex-col p-6 gap-8">
            
            <div className="flex flex-col rounded-lg border border-border/50 bg-surface-3/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className={
                  inspection.status === "completed" ? "text-emerald-500" :
                  isHighRisk ? "h-5 w-5 text-risk-critical" : 
                  inspection.priority === "medium" ? "h-5 w-5 text-amber-500" : "h-5 w-5 text-emerald-500"
                } />
                <h3 className="text-sm font-semibold text-foreground">
                  {inspection.status === "completed" ? "Completed Inspection" : "Recommended Field Action"}
                </h3>
                {inspection.status !== "completed" && (
                  <Badge variant="secondary" className="ml-auto text-[10px] bg-primary/10 text-primary border-0">Model-ready recommendation</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {getRecommendation()}
              </p>
              {inspection.status !== "completed" && (
                <span className="text-xs text-foreground font-medium">Expected Investigation Outcome: <span className="text-muted-foreground font-normal">{getExpectedOutcome()}</span></span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Inspection Workflow</h3>
              
              {/* Assignment */}
              <div className="flex flex-col gap-2 p-4 border border-border/50 rounded-lg bg-surface-2">
                <span className="text-xs font-semibold text-foreground">Assign Officer</span>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 h-9 rounded-md border border-border/50 bg-surface-1 px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    value={selectedOfficer}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                    disabled={inspection.status === "completed" || inspection.status === "cancelled"}
                  >
                    <option value="">-- Select Officer --</option>
                    {MOCK_OFFICERS.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <Button 
                    size="sm" 
                    onClick={handleAssign}
                    disabled={!selectedOfficer || selectedOfficer === inspection.assignedOfficer || inspection.status === "completed"}
                  >
                    Assign
                  </Button>
                </div>
                {inspection.assignedOfficer && (
                  <span className="text-xs text-muted-foreground mt-1">Currently assigned to: <strong className="text-foreground">{inspection.assignedOfficer}</strong></span>
                )}
              </div>

              {/* Status Actions */}
              <div className="flex flex-col gap-2 p-4 border border-border/50 rounded-lg bg-surface-2">
                <span className="text-xs font-semibold text-foreground">Update Status</span>
                
                {inspection.status === "completed" ? (
                  <div className="flex items-center gap-2 p-3 mt-2 rounded bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-500">Inspection successfully marked completed.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button 
                      variant={inspection.status === "in_progress" ? "default" : "outline"}
                      className={inspection.status === "in_progress" ? "bg-purple-500 hover:bg-purple-600 text-white" : ""}
                      disabled={!inspection.assignedOfficer}
                      onClick={() => onUpdateStatus(inspection.id, "in_progress")}
                    >
                      {inspection.status === "in_progress" ? "Update Evidence" : "Start Inspection"}
                    </Button>
                    <Button 
                      variant="outline"
                      className=""
                      disabled={inspection.status !== "in_progress"}
                      onClick={() => onUpdateStatus(inspection.id, "completed")}
                    >
                      Mark Completed
                    </Button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </CardContent>
    </Card>
  );
}
