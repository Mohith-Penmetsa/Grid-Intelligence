"use client";

import { usePathname } from "next/navigation";
import { PLATFORM_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Breadcrumb Builder ───────────────────────────────────────

function useBreadcrumb(): { label: string; href?: string }[] {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Home" }];
  }

  // Find the matching nav item for the first segment
  const allItems = PLATFORM_NAV.flatMap((g) => g.items);
  const crumbs: { label: string; href?: string }[] = [];

  let accumulated = "";
  for (const segment of segments) {
    accumulated += `/${segment}`;

    // Try to match known nav item
    const match = allItems.find((item) => item.href === accumulated);

    if (match) {
      crumbs.push({ label: match.label, href: accumulated });
    } else {
      // Dynamic segment — show it formatted
      const label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      crumbs.push({ label, href: accumulated });
    }
  }

  return crumbs;
}

// ─── Component ───────────────────────────────────────────────

export function Topbar() {
  const breadcrumbs = useBreadcrumb();
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label ?? "Platform";

  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between",
        "border-b border-border bg-background/80 backdrop-blur-sm",
        "px-6 shrink-0"
      )}
    >
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
          {breadcrumbs.map((crumb, index) => (
            <span
              key={crumb.href ?? crumb.label}
              className="flex items-center gap-1.5"
            >
              {index > 0 && (
                <span className="text-muted-foreground/40 text-xs">/</span>
              )}
              <span
                className={cn(
                  "text-[13.5px]",
                  index === breadcrumbs.length - 1
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground transition-colors"
                )}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right: Global Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
