import { cn } from "@/lib/utils";
import { Construction } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────

interface ComingSoonProps {
  milestone?: string;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────
/*
  Used as a placeholder for pages that are not yet implemented.
  Shows which milestone will build this feature.
*/
export function ComingSoon({ milestone, className }: ComingSoonProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        "rounded-xl border border-dashed border-border",
        "bg-muted/30 px-8 py-16 text-center",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Construction className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          This view is under construction
        </p>
        {milestone && (
          <p className="text-xs text-muted-foreground">
            Coming in:{" "}
            <span className="font-medium text-foreground">{milestone}</span>
          </p>
        )}
      </div>
    </div>
  );
}
