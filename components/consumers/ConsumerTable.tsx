import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Consumer, RiskAssessment } from "@/lib/store/types";

interface ConsumerTableProps {
  data: { consumer: Consumer; risk: RiskAssessment }[];
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
              <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[120px]">Consumer ID</th>
              <th className="px-4 py-3 font-medium">Meter ID</th>
              <th className="px-4 py-3 font-medium">Transformer ID</th>
              <th className="px-4 py-3 font-medium text-center">Risk Score</th>
              <th className="px-4 py-3 font-medium">Risk Level</th>
              <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Expected (U)</th>
              <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Actual (U)</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {data.map((row) => {
              const { consumer, risk } = row;
              const isSelected = selectedId === consumer.id;
              
              const isCritical = risk.level === "critical";
              const isHigh = risk.level === "high";
              const isMedium = risk.level === "medium";
              
              const deviationPercentage = consumer.expectedConsumption > 0 ? ((consumer.expectedConsumption - consumer.actualConsumption) / consumer.expectedConsumption) * 100 : 0;

              return (
                <tr 
                  key={consumer.id} 
                  onClick={() => onSelect(consumer.id)}
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-surface-3",
                    isSelected && "bg-primary/10 border-l-4 border-l-primary",
                    !isSelected && "border-l-4 border-l-transparent"
                  )}
                >
                  <td className="px-4 py-3 font-bold whitespace-nowrap text-foreground">{consumer.id}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{consumer.meterId}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{consumer.transformerId}</td>
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
                  <td className="px-4 py-3 text-right text-muted-foreground">{consumer.expectedConsumption.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("font-medium", deviationPercentage > 20 ? "text-risk-critical" : "text-muted-foreground")}>
                      {consumer.actualConsumption.toLocaleString()}
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

