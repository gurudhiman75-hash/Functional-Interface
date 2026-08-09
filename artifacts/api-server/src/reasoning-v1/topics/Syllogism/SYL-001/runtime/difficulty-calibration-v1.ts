import type { SurfacePremiseForm, SylDifficulty, TermId } from "../foundation/types";
import type { SylQlDefinition, SylScenarioSpec, SylTaskKind } from "./types";

export interface SylDifficultyBreakdownV1 {
  premiseLoad: number;
  termLoad: number;
  topologyLoad: number;
  specialFormLoad: number;
  taskLoad: number;
  total: number;
  band: SylDifficulty;
}

const SPECIAL_FORM_LOAD: Readonly<Partial<Record<SurfacePremiseForm, number>>> = Object.freeze({
  SOME_NOT: 1,
  ONLY: 1,
  ARE_ONLY: 1,
  A_FEW: 1,
  NOT_ALL: 1,
  ONLY_A_FEW: 2,
  IDENTITY: 2,
});

const TASK_LOAD: Readonly<Record<SylTaskKind, number>> = Object.freeze({
  SELECT_DEFINITE_CONCLUSION: 0,
  SELECT_NON_FOLLOWING_CONCLUSION: 1,
  TWO_CONCLUSION_FOLLOW_MASK: 1,
  THREE_CONCLUSION_FOLLOW_MASK: 2,
  SELECT_GENUINE_POSSIBILITY: 1,
  SELECT_IMPOSSIBLE_CONCLUSION: 1,
  CLASSIFY_CONCLUSION_MODALITY: 1,
  TWO_CONCLUSION_EITHER_OR: 2,
  CLASSIFY_CONCLUSION_PAIR: 2,
  ONLY_SELECT_DEFINITE_CONCLUSION: 1,
  ONLY_TWO_CONCLUSION_MASK: 2,
  ONLY_MODAL_CLASSIFICATION: 2,
  FEW_SELECT_DEFINITE_CONCLUSION: 1,
  FEW_MODAL_CLASSIFICATION: 2,
  FEW_TWO_CONCLUSION_MASK: 2,
  MIXED_TWO_CONCLUSION_MASK: 2,
  MIXED_THREE_CONCLUSION_MASK: 3,
  MIXED_MODAL_CLASSIFICATION: 3,
});

function premiseLoad(count: number): number {
  if (count <= 2) return 0;
  if (count === 3) return 1;
  return 2;
}

function termLoad(count: number): number {
  if (count <= 3) return 0;
  if (count === 4) return 1;
  return 2;
}

function topologyLoad(topology: SylScenarioSpec["topology"]): number {
  if (topology === "LINEAR") return 0;
  if (topology === "BRANCHING" || topology === "CONVERGING") return 1;
  return 2;
}

function bandForScore(score: number): SylDifficulty {
  if (score <= 2) return "EASY";
  if (score <= 5) return "MEDIUM";
  return "HARD";
}

export function calibrateSylDifficultyV1(
  definition: SylQlDefinition,
  scenario: SylScenarioSpec,
): SylDifficultyBreakdownV1 {
  const terms = new Set<TermId>();
  scenario.premises.forEach((premise) => {
    terms.add(premise.subject);
    terms.add(premise.predicate);
  });

  const specialFormLoad = scenario.premises.reduce(
    (sum, premise) => sum + (SPECIAL_FORM_LOAD[premise.form] ?? 0),
    0,
  );
  const breakdown = {
    premiseLoad: premiseLoad(scenario.premises.length),
    termLoad: termLoad(terms.size),
    topologyLoad: topologyLoad(scenario.topology),
    specialFormLoad,
    taskLoad: TASK_LOAD[definition.taskKind],
  };
  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return {
    ...breakdown,
    total,
    band: bandForScore(total),
  };
}

export const SYL_DIFFICULTY_CALIBRATION_V1 = Object.freeze({
  authorityId: "SYL_001_STRUCTURAL_DIFFICULTY_CALIBRATION_V1",
  status: "AUDIT_ONLY_NOT_ACTIVE",
  scoreBands: {
    EASY: "0..2",
    MEDIUM: "3..5",
    HARD: "6+",
  },
  principles: [
    "Difficulty is computed from the task and scenario together, not copied from a scenario label.",
    "More premises, more terms, non-linear topology and special forms increase structural load.",
    "Three-conclusion, either-or and mixed tasks add task-processing load.",
    "The score is a structural prior and must later be calibrated with student response data.",
  ],
  activationPermitted: false,
});
