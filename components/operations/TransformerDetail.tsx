import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowDown, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TransformerDetail({ transformerId, onClose }: { transformerId: string, onClose: () => void }) {
  // Hardcoded to TR-104 for the checkpoint
  return (
    <Card className="bg-surface-2 border-border/50 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">Analysis: {transformerId}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-y-auto">
        {/* Top metrics */}
        <div className="grid grid-cols-2 gap-4 p-5 bg-surface-3/30 border-b border-border/50">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</span>
            <Badge variant="outline" className="w-fit border-risk-critical text-risk-critical bg-risk-critical/10 font-bold">CRITICAL</Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Risk Score</span>
            <span className="text-2xl font-black text-foreground">95<span className="text-sm font-medium text-muted-foreground ml-1">/100</span></span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Comm. Loss %</span>
            <span className="text-xl font-bold text-foreground">6.7%</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Location</span>
            <span className="text-sm font-medium text-foreground">Bhimavaram Zone 4</span>
          </div>
        </div>

        {/* Calculation Flow */}
        <div className="p-6 flex flex-col gap-0">
          <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Energy Flow Reconciliation</h3>
          
          <div className="flex items-center justify-between p-3 rounded bg-surface-3">
            <span className="text-sm font-medium text-foreground">Input Energy</span>
            <span className="text-sm font-bold">1,200 units</span>
          </div>
          
          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground/70" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded border border-border/50">
            <span className="text-sm text-muted-foreground">Expected Technical Loss</span>
            <span className="text-sm font-medium text-muted-foreground">- 40 units</span>
          </div>
          
          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground/70" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded bg-primary/5 border border-primary/20">
            <span className="text-sm font-medium text-primary">Expected Available Energy</span>
            <span className="text-sm font-bold text-primary">1,160 units</span>
          </div>
          
          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground/70" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded border border-border/50">
            <span className="text-sm text-muted-foreground">Recorded Consumer Consumption</span>
            <span className="text-sm font-medium text-muted-foreground">- 1,080 units</span>
          </div>
          
          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-risk-critical/70" />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded bg-risk-critical/10 border border-risk-critical/30">
            <span className="text-sm font-bold text-risk-critical">Unexplained Commercial Loss</span>
            <span className="text-sm font-black text-risk-critical">80 units</span>
          </div>
        </div>

        {/* Loss Visual Comparison */}
        <div className="p-6 pt-0">
          <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Loss Breakdown</h3>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground font-medium">Technical Loss (40)</span>
              <span className="text-foreground font-bold">Commercial Loss (80)</span>
            </div>
            {/* Visual Bar */}
            <div className="h-4 w-full flex rounded-sm overflow-hidden bg-surface-3">
              <div className="h-full bg-slate-400" style={{ width: "33.3%" }} />
              <div className="h-full bg-risk-critical" style={{ width: "66.7%" }} />
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted-foreground">33% of total loss</span>
              <span className="text-foreground font-medium">67% of total loss</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
