"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGridState } from "@/lib/store/grid-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, ClipboardCheck, Camera, MapPin, FileText, X, ChevronLeft, ChevronRight, Trash2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { InspectionOutcome } from "@/lib/store/types";
import { CameraModal } from "./CameraModal";

export function InspectorWorkspace() {
  const { officers, inspections, transformers, startInspection, updateEvidence, completeInspection } = useGridState();
  
  const [activeOfficerId, setActiveOfficerId] = useState<string | null>(null);
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null);
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{ evidenceId: string, index: number } | null>(null);

  const [fieldObservations, setFieldObservations] = useState("");
  const [outcomeState, setOutcomeState] = useState<Partial<InspectionOutcome>>({
    actualFinding: "no_issue"
  });

  const activeInspections = inspections.filter(i => 
    i.officerId === activeOfficerId && 
    (i.status === "assigned" || i.status === "in_progress")
  );

  const activeInspection = inspections.find(i => i.id === selectedInspectionId);

  const handleStart = () => {
    if (activeInspection && activeInspection.status === "assigned") {
      startInspection(activeInspection.id);
    }
  };

  const handleCaptureEvidence = (evidenceId: string, imageUrl: string) => {
    if (activeInspection) {
      const existingEv = activeInspection.evidence.find(e => e.id === evidenceId);
      const newMediaArray = [...(existingEv?.media || []), {
        id: `m-${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        timestamp: new Date().toISOString()
      }];
      updateEvidence(activeInspection.id, evidenceId, { status: "verified", media: newMediaArray });
    }
  };

  const handleDeleteMedia = (evidenceId: string, mediaIndex: number) => {
    if (activeInspection) {
      const existingEv = activeInspection.evidence.find(e => e.id === evidenceId);
      if (existingEv && existingEv.media) {
        const newMediaArray = [...existingEv.media];
        newMediaArray.splice(mediaIndex, 1);
        const status = newMediaArray.length > 0 ? "verified" : "pending";
        updateEvidence(activeInspection.id, evidenceId, { status, media: newMediaArray });
        if (newMediaArray.length === 0) {
          setPreviewMedia(null);
        } else if (previewMedia && previewMedia.index >= newMediaArray.length) {
          setPreviewMedia({ evidenceId, index: newMediaArray.length - 1 });
        }
      }
    }
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleComplete = () => {
    if (!activeInspection) return;

    // Validate evidence checklist
    const unverified = activeInspection.evidence.filter(ev => ev.status !== "verified" && ev.key !== "additional_site_evidence");
    if (unverified.length > 0) {
      setErrorMsg(`Please complete all required evidence checklist items before submitting.`);
      return;
    }

    // Validate field observations
    if (!fieldObservations || fieldObservations.trim().length < 10) {
      setErrorMsg("Please enter detailed field observations (minimum 10 characters).");
      return;
    }

    if (!outcomeState.actualFinding) {
      setErrorMsg("Please select a primary final finding.");
      return;
    }

    setErrorMsg(null);
    completeInspection(activeInspection.id, {
      inspectionId: activeInspection.id,
      actualFinding: outcomeState.actualFinding as any,
      confirmed: true
    }, fieldObservations);
    
    setSelectedInspectionId(null);
    setFieldObservations("");
  };

  const renderPreviewModal = () => {
    if (!previewMedia || !activeInspection) return null;
    const ev = activeInspection.evidence.find(e => e.id === previewMedia.evidenceId);
    if (!ev || !ev.media || ev.media.length === 0) return null;
    const mediaItem = ev.media[previewMedia.index];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in">
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="destructive" size="icon" onClick={() => handleDeleteMedia(previewMedia.evidenceId, previewMedia.index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setPreviewMedia(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 w-full max-w-4xl px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={previewMedia.index === 0}
            onClick={() => setPreviewMedia({ ...previewMedia, index: previewMedia.index - 1 })}
            className="shrink-0 h-12 w-12 rounded-full bg-surface-2/50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex-1 flex flex-col items-center gap-4">
            <img src={mediaItem.url} alt="Evidence preview" className="max-h-[80vh] object-contain rounded-lg shadow-2xl border border-border" />
            <div className="text-sm font-medium text-muted-foreground bg-surface-2/50 px-4 py-1 rounded-full">
              Photo {previewMedia.index + 1} of {ev.media.length}
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            disabled={previewMedia.index === ev.media.length - 1}
            onClick={() => setPreviewMedia({ ...previewMedia, index: previewMedia.index + 1 })}
            className="shrink-0 h-12 w-12 rounded-full bg-surface-2/50"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      {/* Officer "Login" Mock */}
      <Card className="bg-surface-2 border-border/50">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Inspector View</span>
            <span className="text-xs text-muted-foreground">Select an officer to view their assigned field tasks.</span>
          </div>
          <Select onValueChange={(val) => { setActiveOfficerId(val); setSelectedInspectionId(null); }}>
            <SelectTrigger className="w-[250px] bg-surface-1">
              <SelectValue placeholder="Select Officer Profile" />
            </SelectTrigger>
            <SelectContent>
              {officers.map(o => (
                <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {!activeOfficerId ? (
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-border border-dashed bg-surface-2/30">
          <p className="text-sm text-muted-foreground">Please select an officer profile to access the workspace.</p>
        </div>
      ) : activeInspections.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 h-[300px] rounded-lg border border-border border-dashed bg-surface-2/30">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          <p className="text-sm font-medium text-foreground">No active inspections in progress.</p>
          <p className="text-xs text-muted-foreground">You are all caught up.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Task List */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-tight text-foreground/90 uppercase">In Progress</h3>
            {activeInspections.map(ins => {
              const t = transformers.find(tr => tr.id === ins.transformerId);
              return (
                <Card 
                  key={ins.id} 
                  className={`bg-surface-2 border-border/50 cursor-pointer transition-colors ${activeInspection?.id === ins.id ? "ring-2 ring-primary border-primary/50" : "hover:bg-surface-3"}`}
                  onClick={() => { setSelectedInspectionId(ins.id); handleStart(); }}
                >
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{ins.id}</span>
                      <Badge variant="outline" className={`text-[9px] uppercase ${ins.priority === "critical" ? "text-risk-critical border-risk-critical/30" : "text-amber-500 border-amber-500/30"}`}>{ins.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {t?.area}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Task Execution Context */}
          {activeInspection && (
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <Card className="bg-surface-2 border-border/50">
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-bold">Execute: {activeInspection.id}</CardTitle>
                      </div>
                      <Badge variant="outline" className="border-border bg-surface-1">
                        Transformer: {activeInspection.transformerId}
                      </Badge>
                    </div>
                    
                    {/* Separate AI Explanation vs Field Observation reminder */}
                    <div className="flex flex-col gap-1 mt-2 p-3 bg-risk-critical/5 border border-risk-critical/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-risk-critical" />
                        <span className="text-xs font-bold text-risk-critical uppercase">AI Prediction Flag</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{activeInspection.triggerReason}</span>
                      {activeInspection.predictedRiskType && (
                        <span className="text-xs text-muted-foreground mt-1">
                          Model predicted: <strong className="uppercase">{activeInspection.predictedRiskType.replace("_", " ")}</strong> (Confidence/Risk: {activeInspection.predictedRiskScore})
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex flex-col gap-6">
                  
                  {/* Checklist */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Field Checklist & Evidence</h4>
                    <div className="flex flex-col gap-3">
                      {activeInspection.evidence.map(ev => (
                        <div key={ev.id} className="flex flex-col p-4 rounded-lg border border-border/50 bg-surface-1 gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {ev.status === "verified" ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground shrink-0" />
                              )}
                              <span className="text-sm font-semibold text-foreground">{ev.label}</span>
                            </div>
                            <Button size="sm" className="h-7 text-xs gap-2 bg-surface-2 hover:bg-surface-3 text-foreground border border-border" onClick={() => setActiveEvidenceId(ev.id)}>
                              <Camera className="h-3 w-3" /> Capture Photo
                            </Button>
                          </div>
                          
                          {ev.media && ev.media.length > 0 && (
                            <div className="flex flex-col gap-2 pl-8 pt-2">
                              <span className="text-xs font-medium text-emerald-500">{ev.media.length} photo{ev.media.length > 1 ? "s" : ""} captured</span>
                              <div className="flex flex-wrap gap-2">
                                {ev.media.map((m, idx) => (
                                  <div 
                                    key={m.id} 
                                    className="relative w-16 h-16 rounded border border-border overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all group"
                                    onClick={() => setPreviewMedia({ evidenceId: ev.id, index: idx })}
                                  >
                                    <img src={m.url} alt={`Evidence ${idx+1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <span className="text-[10px] font-bold text-white">View</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FIELD OBSERVATIONS (Human logic separate from AI) */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Field Observations</h4>
                    <div className="flex flex-col gap-2">
                      <textarea 
                        className="w-full h-24 rounded-md border border-input bg-surface-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Record detailed site observations, meter condition, wiring condition, seal condition, customer/site observations, etc."
                        value={fieldObservations}
                        onChange={(e) => setFieldObservations(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Outcome Recording */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Structured Final Finding</h4>
                    
                    <div className="flex flex-col gap-3">
                      <Select 
                        value={outcomeState.actualFinding as string} 
                        onValueChange={(val: any) => setOutcomeState(prev => ({ ...prev, actualFinding: val }))}
                      >
                        <SelectTrigger className="w-full bg-surface-1 font-semibold">
                          <SelectValue placeholder="Select confirmed finding" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_issue">No Issue Found / Normal Load</SelectItem>
                          <SelectItem value="meter_issue">Meter Malfunction</SelectItem>
                          <SelectItem value="tampering">Physical Tampering Confirmed</SelectItem>
                          <SelectItem value="illegal_connection">Illegal Connection / Bypass Confirmed</SelectItem>
                          <SelectItem value="seal_violation">Meter Seal Violation</SelectItem>
                          <SelectItem value="other">Other Confirmed Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      {errorMsg && <span className="text-xs font-medium text-risk-critical mr-auto self-center">{errorMsg}</span>}
                      <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={handleComplete}>
                        <FileText className="h-4 w-4" /> Submit Report & Complete
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>

            </div>
          )}
        </div>
      )}
      
      {activeEvidenceId && (
        <CameraModal 
          onClose={() => setActiveEvidenceId(null)} 
          onCapture={(url) => handleCaptureEvidence(activeEvidenceId, url)} 
        />
      )}

      {renderPreviewModal()}
    </div>
  );
}




