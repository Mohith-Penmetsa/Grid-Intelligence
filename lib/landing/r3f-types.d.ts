// ─── R3F JSX ThreeElements Declaration ───────────────────────
// Required for React 19 + @react-three/fiber v9 TypeScript support.
// This extends the JSX IntrinsicElements to include all Three.js object types.

import type { ThreeElements } from "@react-three/fiber";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
