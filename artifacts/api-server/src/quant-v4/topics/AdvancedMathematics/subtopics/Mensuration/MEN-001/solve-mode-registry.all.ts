import { MEN_001_CP002_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.cp002";
import { MEN_001_CP003_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.cp003";
import { MEN_001_CP004_RUNTIME_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.cp004.runtime";
import { MEN_001_CP005_EXHAUSTIVENESS_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.cp005.exhaustiveness";
import { MEN_001_CP005_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.cp005";
import { MEN_001_CP005_OVERLAP_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.cp005.overlap";
import { MEN_001_CP005_REFINED_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.cp005.refined";
import { MEN_001_EXHAUSTIVENESS_RUNTIME_SOLVE_MODE_REGISTRY } from "./solve-mode-registry.exhaustiveness.runtime";
import { MEN_001_SOLVE_MODE_REGISTRY as MEN_001_CP001_SOLVE_MODE_REGISTRY } from "./solve-mode-registry";

export const MEN_001_SOLVE_MODE_REGISTRY = {
  ...MEN_001_CP001_SOLVE_MODE_REGISTRY,
  ...MEN_001_CP002_SOLVE_MODE_REGISTRY,
  ...MEN_001_CP003_SOLVE_MODE_REGISTRY,
  ...MEN_001_CP004_RUNTIME_SOLVE_MODE_REGISTRY,
  ...MEN_001_EXHAUSTIVENESS_RUNTIME_SOLVE_MODE_REGISTRY,
  ...MEN_001_CP005_SOLVE_MODE_REGISTRY,
  ...MEN_001_CP005_REFINED_SOLVE_MODE_REGISTRY,
  ...MEN_001_CP005_OVERLAP_SOLVE_MODE_REGISTRY,
  ...MEN_001_CP005_EXHAUSTIVENESS_SOLVE_MODE_REGISTRY,
} as const;

export type Men001SolveMode = keyof typeof MEN_001_SOLVE_MODE_REGISTRY;

export function getMen001SolveModeDefinition(mode: string) {
  if (!(mode in MEN_001_SOLVE_MODE_REGISTRY)) {
    throw new Error(`MEN-001 has no runtime definition for solve mode ${mode}.`);
  }
  return MEN_001_SOLVE_MODE_REGISTRY[mode as Men001SolveMode];
}

export function getMen001SolveModeIds(): Men001SolveMode[] {
  return Object.keys(MEN_001_SOLVE_MODE_REGISTRY) as Men001SolveMode[];
}
