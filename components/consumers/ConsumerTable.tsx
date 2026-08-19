import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConsumerRiskAnalysis } from "@/lib/intelligence/consumer-risk";

interface ConsumerTableProps {
  data: ConsumerRiskAnalysis[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ConsumerTable({ data, selectedId, onSelect }: ConsumerTableProps) {
  return (
    <Card className="bg-surface-2 border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface-3/50 border-b border-border/50">
            <tr>
              <th className="px-3 py-3 font-medium whitespace-nowrap min-w-[110px]">Consumer ID</th>
              <th className="px-3 py-3 font-medium whitespace-nowrap">Meter ID</th>
              <th className="px-3 py-3 font-medium whitespace-nowrap">Transformer ID</th>
              <th className="px-3 py-3 font-medium text-right whitespace-nowrap">Expected Cons.</th>
              <th className="px-3 py-3 font-medium text-right whitespace-nowrap">Actual Cons.</th>
              <th className="px-3 py-3 font-medium text-right">Deviation</th>
              <th className="px-3 py-3 font-medium text-right">Exposure</th>
              <th className="px-3 py-3 font-medium text-center">Risk Score</th>
              <th className="px-3 py-3 font-medium">Risk Level</th>
              <th className="px-3 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {data.map((analysis) => {
              const c = analysis.data;
              const isSelected = selectedId === c.id;
              const isCritical = analysis.riskLevel === "critical";
              const isHigh = analysis.riskLevel === "high";
              const isMedium = analysis.riskLevel === "medium";
              const isHighRisk = isCritical || isHigh;
              
              return (
                <tr 
                  key={c.id} 
                  onClick={() => onSelect(c.id)}
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-surface-3",
                    isSelected && "bg-primary/10 border-l-4 border-l-primary",
                    !isSelected && "border-l-4 border-l-transparent"
                  )}
                >
                  <td className="px-3 py-3 font-medium whitespace-nowrap text-foreground">{c.id}</td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{c.meterId}</td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{c.transformerId}</td>
                  <td className="px-3 py-3 text-right">{c.expectedConsumption}</td>
                  <td className="px-3 py-3 text-right font-medium text-amber-400">{c.actualConsumption}</td>
                  <td className="px-3 py-3 text-right font-bold text-risk-critical">-{analysis.deviation}</td>
                  <td className="px-3 py-3 text-right">{analysis.commercialLossExposure}</td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", isHighRisk ? "bg-risk-critical" : (isMedium ? "bg-amber-400" : "bg-emerald-400"))}
                          style={{ width: `${analysis.riskScore}%` }}
                        />
                      </div>
                      <span className="w-5 text-xs font-semibold text-foreground">{analysis.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="outline" className={cn(
                      "font-bold px-1.5 py-0 text-[10px] uppercase",
                      isHighRisk ? "border-risk-critical text-risk-critical bg-risk-critical/10" : 
                      (isMedium ? "border-amber-500/50 text-amber-500 bg-amber-500/10" : "border-emerald-500/50 text-emerald-500 bg-emerald-500/10")
                    )}>
                      {analysis.riskLevel}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
                      Analyze
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
