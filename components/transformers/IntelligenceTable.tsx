import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Transformer, RiskAssessment } from "@/lib/store/types";

interface IntelligenceTableProps {
  data: { transformer: Transformer; risk: RiskAssessment }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function IntelligenceTable({ data, selectedId, onSelect }: IntelligenceTableProps) {
  return (
    <Card className="bg-surface-2 border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface-3/50 border-b border-border/50">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[120px]">Transformer ID</th>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium text-center">Risk Score</th>
              <th className="px-4 py-3 font-medium">Risk Level</th>
              <th className="px-4 py-3 font-medium text-right">Input (U)</th>
              <th className="px-4 py-3 font-medium text-right">Comm Loss</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {data.map((row) => {
              const { transformer, risk } = row;
              const isSelected = selectedId === transformer.id;
              
              const isCritical = risk.level === "critical";
              const isHigh = risk.level === "high";
              const isMedium = risk.level === "medium";

              return (
                <tr 
                  key={transformer.id} 
                  onClick={() => onSelect(transformer.id)}
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-surface-3",
                    isSelected && "bg-primary/10 border-l-4 border-l-primary",
                    !isSelected && "border-l-4 border-l-transparent"
                  )}
                >
                  <td className="px-4 py-3 font-bold whitespace-nowrap text-foreground">{transformer.id}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{transformer.area}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("font-bold", isCritical || isHigh ? "text-risk-critical" : isMedium ? "text-amber-500" : "text-emerald-500")}>
                      {risk.score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn(
                      "font-bold uppercase text-[10px]",
                      isCritical ? "border-risk-critical text-risk-critical bg-risk-critical/10" : 
                      isHigh ? "border-orange-500/50 text-orange-500 bg-orange-500/10" :
                      (isMedium ? "border-amber-500/50 text-amber-500 bg-amber-500/10" : "border-emerald-500/50 text-emerald-500 bg-emerald-500/10")
                    )}>
                      {risk.level}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{transformer.input.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("font-medium", (transformer.commLoss / transformer.input) > 0.03 ? "text-risk-critical" : "text-muted-foreground")}>
                      {transformer.commLoss.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">Analyze</span>
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

