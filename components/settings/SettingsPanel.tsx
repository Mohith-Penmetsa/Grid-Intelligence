"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGridState } from "@/lib/store/grid-context";
import { useState } from "react";
import { Save, AlertTriangle, Settings2 } from "lucide-react";

export function SettingsPanel() {
  const { settings, updateSettings } = useGridState();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-3xl pb-10">
      <Card className="bg-surface-2 border-border/50">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-bold">Intelligence Thresholds</CardTitle>
              <CardDescription>Adjust the threshold limits used by the risk calculation engine. Changes will reflect instantly across all dashboards.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-8">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Transformer Risk Threshold</span>
                <span className="text-xs text-muted-foreground">The score (0-100) above which a transformer is marked as CRITICAL.</span>
              </div>
              <span className="font-bold text-lg text-primary">{localSettings.transformerRiskThreshold}</span>
            </div>
            <input 
              type="range" 
              min="50" max="100" 
              value={localSettings.transformerRiskThreshold}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, transformerRiskThreshold: parseInt(e.target.value) }))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Consumer Risk Threshold</span>
                <span className="text-xs text-muted-foreground">The score (0-100) above which a consumer is flagged for priority investigation.</span>
              </div>
              <span className="font-bold text-lg text-primary">{localSettings.consumerRiskThreshold}</span>
            </div>
            <input 
              type="range" 
              min="50" max="100" 
              value={localSettings.consumerRiskThreshold}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, consumerRiskThreshold: parseInt(e.target.value) }))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Inspection Priority Threshold</span>
                <span className="text-xs text-muted-foreground">The baseline risk score required to assign a CRITICAL inspection priority.</span>
              </div>
              <span className="font-bold text-lg text-primary">{localSettings.inspectionPriorityThreshold}</span>
            </div>
            <input 
              type="range" 
              min="40" max="100" 
              value={localSettings.inspectionPriorityThreshold}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, inspectionPriorityThreshold: parseInt(e.target.value) }))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex items-center p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-500/90 font-medium leading-relaxed">
              Lowering thresholds will increase the number of critical alerts and dispatch queue sizes. Ensure adequate field officer availability before tuning these parameters down.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/50">
            <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" /> {isSaved ? "Saved Successfully" : "Save Configuration"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

