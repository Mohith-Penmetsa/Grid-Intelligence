import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { InspectionData } from "@/lib/intelligence/inspection-data";
import { getAllAnalyzedConsumers } from "@/lib/intelligence/consumer-risk";

interface InspectionTableProps {
  data: InspectionData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function InspectionTable({ data, selectedId, onSelect }: InspectionTableProps) {
  const allConsumers = getAllAnalyzedConsumers();

  return (
    <Card className="bg-surface-2 border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface-3/50 border-b border-border/50">
            <tr>
              <th className="px-3 py-3 font-medium whitespace-nowrap min-w-[110px]">Inspection ID</th>
              <th className="px-3 py-3 font-medium whitespace-nowrap">Consumer ID</th>
              <th className="px-3 py-3 font-medium whitespace-nowrap">Transformer ID</th>
              <th className="px-3 py-3 font-medium">Area</th>
              <th className="px-3 py-3 font-medium text-center">Risk Score</th>
              <th className="px-3 py-3 font-medium">Priority</th>
              <th className="px-3 py-3 font-medium whitespace-nowrap">Assigned Officer</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {data.map((ins) => {
              const consumerAnalysis = allConsumers.find(c => c.data.id === ins.consumerId);
              const transformerId = consumerAnalysis?.data.transformerId || "Unknown";
              const area = consumerAnalysis?.data.area || "Unknown";

              const isSelected = selectedId === ins.id;
              const isCritical = ins.priority === "critical";
              const isHigh = ins.priority === "high";
              const isMedium = ins.priority === "medium";
              const isHighRisk = isCritical || isHigh;
              
              const getStatusColor = (status: string) => {
                switch(status) {
                  case "pending": return "text-amber-500 bg-amber-500/10 border-amber-500/50";
                  case "assigned": return "text-blue-400 bg-blue-400/10 border-blue-400/50";
                  case "in_progress": return "text-purple-400 bg-purple-400/10 border-purple-400/50";
                  case "completed": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/50";
                  default: return "text-muted-foreground bg-surface-3 border-border/50";
                }
              };
              
              return (
                <tr 
                  key={ins.id} 
                  onClick={() => onSelect(ins.id)}
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-surface-3",
                    isSelected && "bg-primary/10 border-l-4 border-l-primary",
                    !isSelected && "border-l-4 border-l-transparent"
                  )}
                >
                  <td className="px-3 py-3 font-medium whitespace-nowrap text-foreground">{ins.id}</td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{ins.consumerId}</td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{transformerId}</td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{area}</td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", isHighRisk ? "bg-risk-critical" : (isMedium ? "bg-amber-400" : "bg-emerald-400"))}
                          style={{ width: `${ins.riskScore}%` }}
                        />
                      </div>
                      <span className="w-5 text-xs font-semibold text-foreground">{ins.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="outline" className={cn(
                      "font-bold px-1.5 py-0 text-[10px] uppercase",
                      isCritical ? "border-risk-critical text-risk-critical bg-risk-critical/10" : 
                      isHigh ? "border-orange-500/50 text-orange-500 bg-orange-500/10" :
                      (isMedium ? "border-amber-500/50 text-amber-500 bg-amber-500/10" : "border-emerald-500/50 text-emerald-500 bg-emerald-500/10")
                    )}>
                      {ins.priority}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-foreground whitespace-nowrap">
                    {ins.assignedOfficer ? ins.assignedOfficer : <span className="text-muted-foreground italic">Unassigned</span>}
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="outline" className={cn("font-semibold px-1.5 py-0 text-[10px] uppercase", getStatusColor(ins.status))}>
                      {ins.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
