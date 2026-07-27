import type { EditorialDifficulty } from "./editorial-content";

export type DifficultySignal =
  | "VISIBLE_SINGLE_RELATION"
  | "VISIBLE_FORWARD_MULTIPLIER"
  | "TWO_OR_THREE_VISIBLE_STEPS"
  | "HIDDEN_PERCENTAGE_BASE"
  | "SINGLE_REVERSE_OPERATION"
  | "MULTI_STAGE_REVERSE"
  | "MISSING_INTERMEDIATE"
  | "COUPLED_INVERSE"
  | "MULTIPLE_CONSTRAINTS"
  | "WEIGHTED_AGGREGATION"
  | "PRODUCT_MIX"
  | "IRRELEVANT_DATA"
  | "TABLE_INTERPRETATION"
  | "CASELET_DEPENDENCY"
  | "STATEMENT_EVALUATION"
  | "DATA_SUFFICIENCY";

const SIGNAL_WEIGHTS: Readonly<Record<DifficultySignal, number>> = {
  VISIBLE_SINGLE_RELATION: 0,
  VISIBLE_FORWARD_MULTIPLIER: 1,
  TWO_OR_THREE_VISIBLE_STEPS: 2,
  HIDDEN_PERCENTAGE_BASE: 2,
  SINGLE_REVERSE_OPERATION: 2,
  MULTI_STAGE_REVERSE: 4,
  MISSING_INTERMEDIATE: 3,
  COUPLED_INVERSE: 4,
  MULTIPLE_CONSTRAINTS: 4,
  WEIGHTED_AGGREGATION: 3,
  PRODUCT_MIX: 4,
  IRRELEVANT_DATA: 2,
  TABLE_INTERPRETATION: 2,
  CASELET_DEPENDENCY: 3,
  STATEMENT_EVALUATION: 3,
  DATA_SUFFICIENCY: 5,
};

export type DifficultyProfile = Readonly<{
  signals: readonly DifficultySignal[];
  arithmeticBurden?: "LOW" | "MODERATE" | "HIGH";
}>;

export type DifficultyCalibration = Readonly<{
  difficulty: EditorialDifficulty;
  score: number;
  rationale: string;
}>;

export function calibrateDifficulty(profile: DifficultyProfile): DifficultyCalibration {
  const uniqueSignals = [...new Set(profile.signals)];
  const signalScore = uniqueSignals.reduce((total, signal) => total + SIGNAL_WEIGHTS[signal], 0);
  const burdenScore = profile.arithmeticBurden === "HIGH" ? 2 : profile.arithmeticBurden === "MODERATE" ? 1 : 0;
  const score = signalScore + burdenScore;

  const difficulty: EditorialDifficulty = score <= 1 ? "Easy" : score <= 5 ? "Medium" : "Hard";
  const readableSignals = uniqueSignals.map((signal) => signal.toLowerCase().replaceAll("_", " "));
  const rationale = readableSignals.length === 0
    ? "No reasoning signal was supplied."
    : `${difficulty} because the task uses ${readableSignals.join(", ")}${profile.arithmeticBurden ? ` with ${profile.arithmeticBurden.toLowerCase()} arithmetic burden` : ""}.`;

  return { difficulty, score, rationale };
}

export function assertDifficulty(
  declared: EditorialDifficulty,
  profile: DifficultyProfile,
): DifficultyCalibration {
  const calibration = calibrateDifficulty(profile);
  if (calibration.difficulty !== declared) {
    throw new Error(`Difficulty mismatch: declared ${declared}, calibrated ${calibration.difficulty}. ${calibration.rationale}`);
  }
  return calibration;
}
