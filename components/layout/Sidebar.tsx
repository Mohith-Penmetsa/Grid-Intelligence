"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLATFORM_NAV, APP_NAME, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Zap,
  Users,
  ClipboardCheck,
  BarChart3,
  ChevronRight,
  Activity,
} from "lucide-react";

// ─── Icon Map ────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Zap,
  Users,
  ClipboardCheck,
  BarChart3,
};

// ─── Component ───────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-[240px] flex-col border-r border-sidebar-border",
        "bg-sidebar text-sidebar-foreground shrink-0"
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <Activity className="h-4 w-4 text-primary-foreground" />
        </div>
        <Link href={ROUTES.HOME} className="flex items-center gap-1">
          <span className="text-[15px] font-semibold tracking-tight text-sidebar-foreground">
            {APP_NAME}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        {PLATFORM_NAV.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <p className="mb-1 px-2 text-[10.5px] font-medium uppercase tracking-widest text-muted-foreground/70">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon ? ICON_MAP[item.icon] : null;
              const isActive =
                pathname === item.href ||
                (item.href !== ROUTES.OPERATIONS &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium",
                    "transition-colors duration-150",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
                      )}
                    />
                  )}
                  <span className="flex-1 truncate">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <p className="text-[11px] text-muted-foreground/50">
          DISCOM Operations Platform
        </p>
      </div>
    </aside>
  );
}
