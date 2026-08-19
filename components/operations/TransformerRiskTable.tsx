import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MOCK_TRANSFORMERS = [
  { id: "TR-104", area: "Bhimavaram Zone 4", input: 1200, consumed: 1080, techLoss: 40, commLoss: 80, risk: 95, status: "Critical" },
  { id: "TR-106", area: "Bhimavaram Zone 4", input: 850, consumed: 800, techLoss: 25, commLoss: 25, risk: 44, status: "Medium" },
  { id: "TR-102", area: "Bhimavaram Zone 4", input: 920, consumed: 880, techLoss: 28, commLoss: 12, risk: 42, status: "Medium" },
  { id: "TR-105", area: "Bhimavaram Zone 4", input: 1100, consumed: 1060, techLoss: 35, commLoss: 5, risk: 37, status: "Normal" },
  { id: "TR-101", area: "Bhimavaram Zone 4", input: 780, consumed: 755, techLoss: 22, commLoss: 3, risk: 31, status: "Normal" },
  { id: "TR-103", area: "Bhimavaram Zone 4", input: 640, consumed: 620, techLoss: 18, commLoss: 2, risk: 28, status: "Normal" },
];

export function TransformerRiskTable({ selectedId, onSelect }: { selectedId: string | null, onSelect: (id: string) => void }) {
  return (
    <Card className="bg-surface-2 border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface-3/50 border-b border-border/50">
            <tr>
              <th className="px-4 py-3 font-medium">Transformer ID</th>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium text-right">Input</th>
              <th className="px-4 py-3 font-medium text-right">Consumption</th>
              <th className="px-4 py-3 font-medium text-right">Tech Loss</th>
              <th className="px-4 py-3 font-medium text-right">Comm Loss</th>
              <th className="px-4 py-3 font-medium text-center">Risk Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {MOCK_TRANSFORMERS.map((t) => {
              const isSelected = selectedId === t.id;
              const isCritical = t.status === "Critical";
              
              return (
                <tr 
                  key={t.id} 
                  onClick={() => onSelect(t.id)}
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-surface-3",
                    isSelected && "bg-surface-3 border-l-2 border-l-primary",
                    !isSelected && "border-l-2 border-l-transparent"
                  )}
                >
                  <td className="px-4 py-3 font-medium whitespace-nowrap text-foreground">{t.id}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{t.area}</td>
                  <td className="px-4 py-3 text-right">{t.input}</td>
                  <td className="px-4 py-3 text-right">{t.consumed}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{t.techLoss}</td>
                  <td className="px-4 py-3 text-right font-medium text-amber-400">{t.commLoss}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", isCritical ? "bg-risk-critical" : (t.status === "Medium" ? "bg-amber-400" : "bg-emerald-400"))}
                          style={{ width: `${t.risk}%` }}
                        />
                      </div>
                      <span className="w-6 text-xs font-semibold text-foreground">{t.risk}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn(
                      "font-bold",
                      isCritical ? "border-risk-critical text-risk-critical bg-risk-critical/10" : 
                      (t.status === "Medium" ? "border-amber-500/50 text-amber-500 bg-amber-500/10" : "border-emerald-500/50 text-emerald-500 bg-emerald-500/10")
                    )}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-8 text-[12px]">
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
