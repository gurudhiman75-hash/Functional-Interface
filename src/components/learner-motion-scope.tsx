import { createContext, useContext, type ReactNode } from "react";

const LearnerMotionContext = createContext(false);

/** React context follows portals, while the test runner stays outside this scope. */
export function LearnerMotionScope({ children }: { children: ReactNode }) {
  return <LearnerMotionContext.Provider value={true}>{children}</LearnerMotionContext.Provider>;
}

export function useLearnerSurfaceMotion(surface: "menu" | "dialog" | "overlay" | "sheet" | "tabs") {
  const enabled = useContext(LearnerMotionContext);
  return enabled ? { "data-et-motion": "learner", "data-et-surface": surface } : {};
}
