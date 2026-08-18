import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

interface PageShellProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────
/*
  PageShell wraps every platform page with a consistent:
  - Page heading + description
  - Optional action slot (buttons, filters)
  - Content area

  Keep this component purely structural — no visual chrome yet.
*/
export function PageShell({
  title,
  description,
  actions,
  children,
  className,
}: PageShellProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground text-pretty">
              {description}
            </p>
          )}
        </div>

        {/* Actions slot */}
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Page Content */}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
