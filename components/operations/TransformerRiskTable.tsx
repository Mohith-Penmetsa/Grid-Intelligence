import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { getAllAnalyzedTransformers } from "@/lib/intelligence/transformer-risk";

export function TransformerRiskTable({ selectedId, onSelect }: { selectedId: string | null, onSelect: (id: string) => void }) {
  const analyzedData = getAllAnalyzedTransformers();
  
  return (
    <Card className="bg-surface-2 border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface-3/50 border-b border-border/50">
            <tr>
              <th className="px-2 py-3 font-medium whitespace-nowrap min-w-[110px]">Transformer ID</th>
              <th className="px-2 py-3 font-medium">Area</th>
              <th className="px-2 py-3 font-medium text-right">Input</th>
              <th className="px-2 py-3 font-medium text-right">Consumption</th>
              <th className="px-2 py-3 font-medium text-right">Tech Loss</th>
              <th className="px-2 py-3 font-medium text-right">Comm Loss</th>
              <th className="px-2 py-3 font-medium text-center">Risk Score</th>
              <th className="px-2 py-3 font-medium">Status</th>
              <th className="px-2 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {analyzedData.map((analysis) => {
              const t = analysis.data;
              const isSelected = selectedId === t.id;
              const isCritical = analysis.riskLevel === "critical" || analysis.riskLevel === "high";
              const isMedium = analysis.riskLevel === "medium";
              
              return (
                <tr 
                  key={t.id} 
                  onClick={() => onSelect(t.id)}
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-surface-3",
                    isSelected && "bg-primary/10 border-l-4 border-l-primary",
                    !isSelected && "border-l-4 border-l-transparent"
                  )}
                >
                  <td className="px-2 py-3 font-medium whitespace-nowrap text-foreground">{t.id}</td>
                  <td className="px-2 py-3 text-muted-foreground min-w-[120px]">{t.area}</td>
                  <td className="px-2 py-3 text-right">{t.input}</td>
                  <td className="px-2 py-3 text-right">{t.consumed}</td>
                  <td className="px-2 py-3 text-right text-muted-foreground">{t.techLoss}</td>
                  <td className="px-2 py-3 text-right font-medium text-amber-400">{t.commLoss}</td>
                  <td className="px-2 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", isCritical ? "bg-risk-critical" : (isMedium ? "bg-amber-400" : "bg-emerald-400"))}
                          style={{ width: `${analysis.riskScore}%` }}
                        />
                      </div>
                      <span className="w-5 text-xs font-semibold text-foreground">{analysis.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <Badge variant="outline" className={cn(
                      "font-bold px-1.5 py-0 text-[10px] uppercase",
                      isCritical ? "border-risk-critical text-risk-critical bg-risk-critical/10" : 
                      (isMedium ? "border-amber-500/50 text-amber-500 bg-amber-500/10" : "border-emerald-500/50 text-emerald-500 bg-emerald-500/10")
                    )}>
                      {analysis.riskLevel === "safe" ? "Normal" : analysis.riskLevel}
                    </Badge>
                  </td>
                  <td className="px-2 py-3 text-right">
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
