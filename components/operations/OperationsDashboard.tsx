"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Activity, TrendingUp, AlertTriangle, ClipboardCheck, Eye, Map } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGridState } from "@/lib/store/grid-context";
import { calculateTransformerRisk, getPriorityConsumers } from "@/lib/intelligence/risk-engine";
import { useState } from "react";
import { CreateInspectionModal } from "@/components/inspections/CreateInspectionModal";

export function OperationsDashboard() {
  const router = useRouter();
  const { transformers, consumers, inspections, settings } = useGridState();

  const [modalData, setModalData] = useState<{ transformerId: string, consumerIds: string[] } | null>(null);

  const activeInspections = inspections.filter(i => i.status !== "completed").length;
  const totalInput = transformers.reduce((acc, curr) => acc + curr.input, 0);
  const totalCommLoss = transformers.reduce((acc, curr) => acc + curr.commLoss, 0);
  const networkLossPct = totalInput > 0 ? (totalCommLoss / totalInput) * 100 : 0;

  // Compute queue
  const queue = transformers.map(t => {
    const risk = calculateTransformerRisk(t, consumers, settings);
    const pConsumers = getPriorityConsumers(t.id, consumers, settings);
    const criticalConsumers = pConsumers.filter(c => c.tamperEvents > 0 || ((c.expectedConsumption - c.actualConsumption) / c.expectedConsumption) > 0.5);
    
    return {
      transformer: t,
      risk,
      priorityConsumersCount: criticalConsumers.length > 0 ? criticalConsumers.length : pConsumers.length,
      consumerIds: pConsumers.map(c => c.id),
      hasActiveInspection: inspections.some(i => i.transformerId === t.id && i.status !== "completed")
    };
  }).sort((a, b) => (b.risk.readinessScore || 0) - (a.risk.readinessScore || 0));

  const getRiskColor = (level: string) => {
    if (level === "critical") return "text-risk-critical border-risk-critical/30 bg-risk-critical/10";
    if (level === "high") return "text-orange-500 border-orange-500/30 bg-orange-500/10";
    if (level === "medium") return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
  };

  return (
    <>
      <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
        
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-surface-2 border-border/50">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2"><Activity size={14}/> Network Status</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-emerald-500">ONLINE</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-surface-2 border-border/50">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2"><TrendingUp size={14}/> Comm Loss (30d)</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-risk-critical">{networkLossPct.toFixed(1)}%</span>
                <span className="text-xs font-medium text-risk-critical mb-1">+{totalCommLoss} U</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-surface-2 border-border/50">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2"><AlertTriangle size={14}/> High Risk TRs</span>
              <span className="text-2xl font-black text-orange-500">{queue.filter(q => q.risk.level === "critical" || q.risk.level === "high").length}</span>
            </CardContent>
          </Card>
          <Card className="bg-surface-2 border-border/50">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2"><ClipboardCheck size={14}/> Active Inspections</span>
              <span className="text-2xl font-black text-primary">{activeInspections}</span>
            </CardContent>
          </Card>
        </div>

        {/* Priority Queue */}
        <Card className="bg-surface-2 border-border/50">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-semibold tracking-tight uppercase flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                  Priority Inspection Queue
                </CardTitle>
                <span className="text-xs text-muted-foreground">Ranked by overall intelligence risk and field inspection readiness.</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface-3/50 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Rank</th>
                    <th className="px-4 py-3 font-medium">Transformer</th>
                    <th className="px-4 py-3 font-medium text-center">Risk Score</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Comm Loss</th>
                    <th className="px-4 py-3 font-medium text-center">Priority Consumers</th>
                    <th className="px-4 py-3 font-medium text-center">Readiness</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {queue.map((item, index) => (
                    <tr key={item.transformer.id} className="hover:bg-surface-3/50 transition-colors">
                      <td className="px-4 py-3 font-black text-muted-foreground">#{index + 1}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{item.transformer.id}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-foreground">{item.risk.score}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`font-bold uppercase text-[10px] ${getRiskColor(item.risk.level)}`}>
                          {item.risk.level}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-risk-critical">
                        {((item.transformer.commLoss / item.transformer.input) * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-foreground">{item.priorityConsumersCount}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className="font-black bg-surface-1 border-border text-foreground">
                          {item.risk.readinessScore}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.push(`/transformers/${item.transformer.id}`)} title="View Intelligence">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary" onClick={() => router.push(`/map?focus=${item.transformer.id}`)} title="View on Map">
                            <Map className="h-4 w-4" />
                          </Button>
                          {!item.hasActiveInspection ? (
                            <Button size="sm" className="h-7 text-[11px] ml-2" onClick={() => setModalData({ transformerId: item.transformer.id, consumerIds: item.consumerIds })}>
                              Create Inspection
                            </Button>
                          ) : (
                            <Badge variant="outline" className="ml-2 h-7 rounded-sm border-primary/30 text-primary bg-primary/10 flex items-center justify-center">
                              In Queue
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {modalData && (
        <CreateInspectionModal 
          transformerId={modalData.transformerId} 
          consumerIds={modalData.consumerIds} 
          onClose={() => setModalData(null)} 
        />
      )}
    </>
  );
}

