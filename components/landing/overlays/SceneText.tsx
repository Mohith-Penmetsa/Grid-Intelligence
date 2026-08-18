"use client";

import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

interface SceneTextProps {
  sceneId: string; // data attribute for GSAP targeting
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  note?: string;
  className?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg" | "xl";
}

// ─── SceneText ───────────────────────────────────────────────
// Cinematic text overlay block.
// GSAP targets [data-scene-id] for fade/reveal animations.

export function SceneText({
  sceneId,
  eyebrow,
  title,
  titleAccent,
  subtitle,
  note,
  className,
  align = "left",
  size = "lg",
}: SceneTextProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[align];

  const titleClass = {
    sm: "text-2xl sm:text-3xl",
    md: "text-3xl sm:text-4xl",
    lg: "text-4xl sm:text-5xl lg:text-6xl",
    xl: "text-5xl sm:text-6xl lg:text-7xl",
  }[size];

  return (
    <div
      data-scene-id={sceneId}
      className={cn(
        "flex flex-col gap-3 opacity-0",
        alignClass,
        className
      )}
    >
      {eyebrow && (
        <span
          className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-blue"
          style={{ color: "oklch(0.72 0.18 220)" }}
        >
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          "font-semibold leading-[1.05] tracking-tight text-white",
          titleClass
        )}
      >
        {title}
        {titleAccent && (
          <>
            {" "}
            <span style={{ color: "oklch(0.78 0.2 200)" }}>{titleAccent}</span>
          </>
        )}
      </h2>

      {subtitle && (
        <p
          className="text-base leading-relaxed sm:text-lg"
          style={{ color: "oklch(0.72 0.03 240)" }}
        >
          {subtitle}
        </p>
      )}

      {note && (
        <p
          className="mt-1 text-xs"
          style={{ color: "oklch(0.55 0.03 240)" }}
        >
          {note}
        </p>
      )}
    </div>
  );
}
