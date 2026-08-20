import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Inspection } from "@/lib/store/types";
import { useGridState } from "@/lib/store/grid-context";
import { calculateTransformerRisk } from "@/lib/intelligence/risk-engine";

interface InspectionTableProps {
  data: Inspection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function InspectionTable({ data, selectedId, onSelect }: InspectionTableProps) {
  const { transformers, consumers, officers, settings } = useGridState();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-amber-500 border-amber-500/30 bg-amber-500/10";
      case "assigned": return "text-blue-500 border-blue-500/30 bg-blue-500/10";
      case "in_progress": return "text-primary border-primary/30 bg-primary/10";
      case "completed": return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
      case "cancelled": return "text-muted-foreground border-border bg-surface-3";
      default: return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-risk-critical border-risk-critical/30 bg-risk-critical/10";
      case "high": return "text-orange-500 border-orange-500/30 bg-orange-500/10";
      case "medium": return "text-amber-500 border-amber-500/30 bg-amber-500/10";
      case "low": return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
      default: return "";
    }
  };

  return (
    <Card className="bg-surface-2 border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface-3/50 border-b border-border/50">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[100px]">ID</th>
              <th className="px-4 py-3 font-medium text-center">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-center">Transformer Risk</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Assigned To</th>
              <th className="px-4 py-3 font-medium text-right">Created</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {data.map((inspection) => {
              const isSelected = selectedId === inspection.id;
              
              const t = transformers.find(t => t.id === inspection.transformerId);
              const risk = t ? calculateTransformerRisk(t, consumers, settings).score : 0;
              const officer = officers.find(o => o.id === inspection.officerId);

              return (
                <tr 
                  key={inspection.id} 
                  onClick={() => onSelect(inspection.id)}
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-surface-3",
                    isSelected && "bg-primary/10 border-l-4 border-l-primary",
                    !isSelected && "border-l-4 border-l-transparent"
                  )}
                >
                  <td className="px-4 py-3 font-bold whitespace-nowrap text-foreground">{inspection.id}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className={cn("font-bold uppercase text-[10px]", getPriorityColor(inspection.priority))}>
                      {inspection.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn("font-bold uppercase text-[10px]", getStatusColor(inspection.status))}>
                      {inspection.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-foreground">
                      {risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {officer ? (
                      <span className="text-foreground">{officer.name}</span>
                    ) : (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">
                    {new Date(inspection.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">Manage</span>
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

