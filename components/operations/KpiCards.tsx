import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, IndianRupee, Users, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const KPIS = [
  {
    label: "Transformers Monitored",
    value: "126",
    icon: Activity,
    colorClass: "text-blue-400",
    bgClass: "bg-blue-400/10",
  },
  {
    label: "High-Risk Transformers",
    value: "8",
    icon: AlertTriangle,
    colorClass: "text-risk-critical",
    bgClass: "bg-risk-critical/20",
  },
  {
    label: "Commercial Loss Detected",
    value: "?18.4L",
    icon: IndianRupee,
    colorClass: "text-amber-400",
    bgClass: "bg-amber-400/10",
  },
  {
    label: "Priority Consumers",
    value: "34",
    icon: Users,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  {
    label: "Pending Inspections",
    value: "12",
    icon: ClipboardCheck,
    colorClass: "text-muted-foreground",
    bgClass: "bg-muted",
  },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {KPIS.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label} className="bg-surface-2 border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", kpi.bgClass)}>
                <Icon className={cn("h-5 w-5", kpi.colorClass)} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold tracking-tight">{kpi.value}</span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {kpi.label}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
