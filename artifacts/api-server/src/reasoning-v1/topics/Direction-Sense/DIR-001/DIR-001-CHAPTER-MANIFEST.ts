import type { DirectionQuestionLogicContract } from "./foundation/types";

export const DIR_001_CHECKPOINTS = [
  { checkpointId: "DIR-CP-001", purpose: "Compass orientation, rotation and facing" },
  { checkpointId: "DIR-CP-002", purpose: "Single-path endpoint and final facing" },
  { checkpointId: "DIR-CP-003", purpose: "Distance, displacement and shortest return" },
  { checkpointId: "DIR-CP-004", purpose: "Relative-position graphs and point relations" },
  { checkpointId: "DIR-CP-005", purpose: "Multiple movers and endpoint comparison" },
  { checkpointId: "DIR-CP-006", purpose: "Coded direction language" },
  { checkpointId: "DIR-CP-007", purpose: "Sun, shadow and environmental orientation" },
  { checkpointId: "DIR-CP-008", purpose: "Advanced mixed, inverse and caselet synthesis" },
] as const;

export interface QlNeedEvidence {
  readonly hiddenStateTopology?: string;
  readonly answerDemand?: string;
  readonly solveDirection?: string;
  readonly generatorContract?: string;
  readonly independentSolverContract?: string;
  readonly rendererContract?: string;
  readonly misconceptionProfile?: string;
  readonly inverseOrReconstructionBurden?: string;
  readonly localizationContract?: string;
}

export interface SolveModeNeedEvidence {
  readonly operationFamily: string;
  readonly independentSolverEntryPoint: string;
  readonly materiallyDifferentFromExisting: string;
}

export const DIR_001_ALLOCATION_POLICY = Object.freeze({
  qlAllocation: "NEED_BASED",
  solveModeAllocation: "NEED_BASED_OPTIONAL",
  qlIdPermanence: "PERMANENT_AFTER_MERGE",
  qlSequence: "CHAPTER_WIDE_CONTINUOUS",
  fixedQlTotal: null,
  fixedSolveModeInventory: null,
});

export function hasMaterialQlNeed(evidence: QlNeedEvidence): boolean {
  return Object.values(evidence).some((value) => typeof value === "string" && value.trim().length > 0);
}

export function assertMaterialQlNeed(evidence: QlNeedEvidence): void {
  if (!hasMaterialQlNeed(evidence)) {
    throw new Error(
      "A new Direction QL requires a material difference in topology, answer demand, generation, solving, rendering, misconception, inverse burden, or localization.",
    );
  }
}

export function assertMaterialSolveModeNeed(evidence: SolveModeNeedEvidence): void {
  for (const [field, value] of Object.entries(evidence)) {
    if (!value.trim()) {
      throw new Error(`Solve-mode need evidence is missing ${field}`);
    }
  }
}

export function nextDirectionQlId(existing: readonly Pick<DirectionQuestionLogicContract, "qlId">[]): string {
  const numbers = existing.map(({ qlId }) => {
    const match = /^DIR-QL-(\d{3,})$/.exec(qlId);
    if (!match) {
      throw new Error(`Invalid Direction QL ID: ${qlId}`);
    }
    return Number(match[1]);
  });
  const next = numbers.length === 0 ? 1 : Math.max(...numbers) + 1;
  return `DIR-QL-${String(next).padStart(3, "0")}`;
}

export function assertContinuousDirectionQlIds(
  qls: readonly Pick<DirectionQuestionLogicContract, "qlId">[],
): void {
  const expected = qls.map((_, index) => `DIR-QL-${String(index + 1).padStart(3, "0")}`);
  const actual = qls.map(({ qlId }) => qlId);
  if (actual.some((qlId, index) => qlId !== expected[index])) {
    throw new Error(`Direction QL IDs must be continuous. Expected ${expected.join(", ")}; received ${actual.join(", ")}`);
  }
}

export const DIR_001_MANIFEST = Object.freeze({
  packageId: "DIR-001",
  productCode: "REAS-DIR",
  allocationPolicy: DIR_001_ALLOCATION_POLICY,
  checkpoints: DIR_001_CHECKPOINTS,
  runtimeRegistry: "chapter-registry.ts",
});
