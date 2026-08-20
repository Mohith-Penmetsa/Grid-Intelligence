"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGridState } from "@/lib/store/grid-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, X } from "lucide-react";
import { calculateTransformerRisk, calculateConsumerRisk } from "@/lib/intelligence/risk-engine";

export function CreateInspectionModal({ 
  transformerId, 
  consumerIds, 
  onClose 
}: { 
  transformerId: string, 
  consumerIds: string[], 
  onClose: () => void 
}) {
  const { createInspection, officers, transformers, consumers, settings } = useGridState();
  
  const [priority, setPriority] = useState<"critical" | "high" | "medium" | "low">("high");
  const [officerId, setOfficerId] = useState<string>("");
  const [triggerReason, setTriggerReason] = useState("Manual trigger from Intelligence Analysis");

  const handleSubmit = () => {
    // Calculate prediction based on entities at time of creation
    const transformer = transformers.find(t => t.id === transformerId);
    let predictedRiskScore = 0;
    let predictedRiskType = "no_issue";
    let predictedReasons: string[] = [];

    if (transformer) {
      const tRisk = calculateTransformerRisk(transformer, consumers, settings);
      predictedRiskScore = tRisk.score;
      predictedReasons = tRisk.drivers.map(d => d.name);
      if (tRisk.level === "critical") predictedRiskType = "tampering";
      else if (tRisk.level === "high") predictedRiskType = "meter_issue";
      else if (tRisk.level === "medium") predictedRiskType = "billing_issue";
    }

    createInspection({
      transformerId,
      consumerIds,
      priority,
      officerId: officerId || null,
      triggerReason,
      predictedRiskScore,
      predictedRiskType,
      predictedReasons,
      evidence: [
        { id: "ev-1", key: "meter_check", label: "Meter Bypass Verification", status: "pending", media: [] },
        { id: "ev-2", key: "seal_photo", label: "Meter Seal Photo", status: "pending", media: [] },
        { id: "ev-add", key: "additional_site_evidence", label: "Additional Site Evidence", status: "pending", media: [] }
      ]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface-2 p-6 shadow-xl animate-in zoom-in-95">
        
        <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Create Inspection</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Target Transformer</span>
            <div className="px-3 py-2 bg-surface-1 border border-border/50 rounded font-medium text-sm">
              {transformerId}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Priority</span>
            <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
              <SelectTrigger className="bg-surface-1">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Assign Officer (Optional)</span>
            <Select value={officerId} onValueChange={setOfficerId}>
              <SelectTrigger className="bg-surface-1">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Leave Unassigned</SelectItem>
                {officers.map(o => (
                  <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Trigger Reason</span>
            <textarea 
              className="w-full h-20 rounded-md border border-input bg-surface-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={triggerReason}
              onChange={(e) => setTriggerReason(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSubmit}>Create Task</Button>
          </div>
        </div>

      </div>
    </div>
  );
}
