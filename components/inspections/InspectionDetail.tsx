"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Inspection } from "@/lib/store/types";
import { ClipboardCheck, Map, ChevronUp, AlertTriangle, UserPlus, PlayCircle, CheckCircle2 } from "lucide-react";
import { useGridState } from "@/lib/store/grid-context";
import { calculateTransformerRisk } from "@/lib/intelligence/risk-engine";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CameraModal } from "@/components/workspace/CameraModal";

export function InspectionDetail({ 
  inspection, 
  onClose 
}: { 
  inspection: Inspection, 
  onClose: () => void 
}) {
  const router = useRouter();
  const { transformers, consumers, officers, settings, assignOfficer, startInspection } = useGridState();
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);

  const transformer = transformers.find(t => t.id === inspection.transformerId);
  const tRisk = transformer ? calculateTransformerRisk(transformer, consumers, settings).level : "unknown";
  
  const isCritical = inspection.priority === "critical";
  const assignedOfficerObj = officers.find(o => o.id === inspection.officerId);

  const totalPhotos = inspection.evidence.reduce((acc, ev) => acc + (ev.media?.length || 0), 0);

  const getOutcomeBadge = (predicted: string | undefined, actual: string | undefined) => {
    if (!predicted || !actual) return null;
    if (actual === "other") return <Badge className="bg-surface-3 text-muted-foreground border-border text-[9px] mt-2">UNRESOLVED / NOT EVALUATED</Badge>;
    const isPredictedIssue = predicted !== "no_issue" && predicted !== "safe";
    const isActualIssue = actual !== "no_issue";

    if (isPredictedIssue && isActualIssue) return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] mt-2">TRUE POSITIVE</Badge>;
    if (isPredictedIssue && !isActualIssue) return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[9px] mt-2">FALSE POSITIVE</Badge>;
    if (!isPredictedIssue && isActualIssue) return <Badge className="bg-risk-critical/10 text-risk-critical border-risk-critical/20 text-[9px] mt-2">FALSE NEGATIVE</Badge>;
    return null;
  };

  return (
    <>
    <Card className="bg-surface-2 border-border/50 animate-in slide-in-from-top-4 fade-in duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Inspection Detail</span>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold">{inspection.id}</CardTitle>
            <Badge variant="outline" className={`ml-2 uppercase text-[10px] ${isCritical ? "text-risk-critical border-risk-critical/30" : "text-amber-500 border-amber-500/30"}`}>
              {inspection.priority}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
          Collapse <ChevronUp className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          
          {/* Left Column */}
          <div className="flex flex-col p-6 gap-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</span>
                <span className="text-lg font-bold uppercase mt-1 text-foreground">{inspection.status.replace("_", " ")}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Target Transformer</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-primary hover:underline cursor-pointer" onClick={() => router.push(`/transformers/${inspection.transformerId}`)}>
                    {inspection.transformerId}
                  </span>
                  <Badge variant="outline" className={`text-[10px] uppercase ${tRisk === "critical" ? "text-risk-critical border-risk-critical/30 bg-risk-critical/10" : ""}`}>
                    {tRisk} Risk
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><AlertTriangle size={14}/> AI Prediction & Trigger</h3>
              <div className="p-3 rounded-lg bg-surface-3/50 border border-border/50 flex flex-col gap-2">
                <span className="text-sm text-foreground">{inspection.triggerReason}</span>
                {inspection.predictedRiskType && (
                  <span className="text-xs text-muted-foreground mt-1">
                    Model predicted: <strong className="uppercase">{inspection.predictedRiskType.replace("_", " ")}</strong> (Confidence/Risk: {inspection.predictedRiskScore})
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><ClipboardCheck size={14}/> Target Consumers</h3>
              <div className="flex flex-wrap gap-2">
                {inspection.consumerIds.map(cid => (
                  <Badge key={cid} variant="secondary" className="cursor-pointer hover:bg-primary/20" onClick={() => router.push(`/consumers/${cid}`)}>
                    {cid}
                  </Badge>
                ))}
              </div>
            </div>
            
            {inspection.status === "completed" && (
               <div className="flex flex-col gap-4 p-4 rounded-lg bg-surface-3 border border-border/50">
                 <div className="flex flex-col gap-2">
                   <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><CheckCircle2 size={14}/> Field Observations</h3>
                   <p className="text-sm italic text-foreground">"{inspection.fieldObservations || "No remarks provided"}"</p>
                 </div>
                 
                 <div className="flex flex-col gap-2 border-t border-border/30 pt-3">
                   <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Structured Outcome</h3>
                   <span className="text-sm font-bold uppercase">
                     {(inspection as any).actualFinding ? (inspection as any).actualFinding.replace("_", " ") : "CONFIRMED"}
                   </span>
                   {getOutcomeBadge(inspection.predictedRiskType, (inspection as any).actualFinding)}
                 </div>
               </div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col p-6 gap-6">
            <div className="flex flex-col rounded-lg border border-border/50 bg-surface-3/30 p-5 gap-4">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Field Assignment</h3>
              </div>
              
              {inspection.status === "pending" ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">Assign a field officer to dispatch this inspection.</p>
                  <Select onValueChange={(val) => assignOfficer(inspection.id, val)}>
                    <SelectTrigger className="w-full bg-surface-1">
                      <SelectValue placeholder="Select Officer" />
                    </SelectTrigger>
                    <SelectContent>
                      {officers.map(o => (
                        <SelectItem key={o.id} value={o.id}>{o.name} ({o.role})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3 rounded bg-surface-2 border border-border/50">
                    <span className="text-sm font-medium text-foreground">{assignedOfficerObj?.name}</span>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">{assignedOfficerObj?.role}</Badge>
                  </div>
                  
                  {inspection.status === "assigned" && (
                    <Button className="w-full bg-primary hover:bg-primary/90 mt-2 gap-2" onClick={() => startInspection(inspection.id)}>
                      <PlayCircle className="h-4 w-4" /> Start Inspection
                    </Button>
                  )}
                  {inspection.status === "in_progress" && (
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 mt-2 gap-2" onClick={() => router.push(`/workspace`)}>
                      <ClipboardCheck className="h-4 w-4" /> Open Inspector Workspace
                    </Button>
                  )}
                  {inspection.status === "completed" && (
                    <Button variant="outline" className="w-full mt-2" disabled>
                      Inspection Completed
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col rounded-lg border border-border/50 bg-surface-3/30 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Evidence Log</h3>
                </div>
                <Badge variant="outline" className="text-[10px]">{totalPhotos} Photos</Badge>
              </div>
              
              <div className="flex flex-col gap-3">
                {inspection.evidence.map(ev => (
                  <div key={ev.id} className="flex flex-col gap-2 p-3 rounded border border-border/30 bg-surface-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{ev.label}</span>
                      <Badge variant="outline" className={`text-[9px] uppercase ${ev.status === "verified" ? "text-emerald-500 border-emerald-500/30" : "text-muted-foreground"}`}>
                        {ev.status}
                      </Badge>
                    </div>
                    {ev.media && ev.media.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {ev.media.map((m, idx) => (
                          <div 
                            key={m.id} 
                            className="w-12 h-12 rounded border border-border overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary"
                            onClick={() => setPreviewMedia(m.url)}
                          >
                            <img src={m.url} alt={`Evidence ${idx+1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button variant="ghost" className="w-full gap-2 border border-border/50 hover:bg-surface-3" onClick={() => router.push(`/map?focus=${inspection.transformerId}`)}>
              <Map className="h-4 w-4" /> View Location on Map
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>

    {previewMedia && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in" onClick={() => setPreviewMedia(null)}>
        <img src={previewMedia} alt="Evidence preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl" />
      </div>
    )}
    </>
  );
}


