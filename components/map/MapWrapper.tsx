"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const SharedGridMap = dynamic(() => import("./SharedGridMap"), { ssr: false });

export default function MapWrapper() {
  return (
    <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-surface-2 text-muted-foreground">Loading Map...</div>}>
      <SharedGridMap />
    </Suspense>
  );
}

