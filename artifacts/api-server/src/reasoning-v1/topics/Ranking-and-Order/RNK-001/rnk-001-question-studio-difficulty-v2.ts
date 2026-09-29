export const RNK_001_QUESTION_STUDIO_DIFFICULTY_MODEL_V2 =
  "RNK_001_QUESTION_STUDIO_DIFFICULTY_V2" as const;

export type RnkQuestionStudioDerivedDifficulty = "Easy" | "Medium" | "Hard";

type AnyQuestion = Record<string, any>;

export interface RnkQuestionStudioDifficultyRecord {
  readonly modelId: typeof RNK_001_QUESTION_STUDIO_DIFFICULTY_MODEL_V2;
  readonly label: RnkQuestionStudioDerivedDifficulty;
  readonly score: number | null;
  readonly sourceDifficulty: string | null;
  readonly instanceDerived: boolean;
  readonly factors: readonly string[];
}

function normalizedSourceDifficulty(question: AnyQuestion): RnkQuestionStudioDerivedDifficulty {
  const text = String(question.difficulty ?? question.difficultyBand ?? "Medium").toLowerCase();
  if (text.includes("easy")) return "Easy";
  if (text.includes("hard")) return "Hard";
  return "Medium";
}

function sourceQlId(question: AnyQuestion): string {
  return String(
    question.permanentQlId
      ?? question.qlId
      ?? question.permanentProfile?.permanentQlId
      ?? question.reviewMetadata?.permanentProfile?.permanentQlId
      ?? question.candidateRuntimeProfile?.permanentQlId
      ?? question.candidateProfile?.permanentQlId
      ?? "",
  );
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

function ql042Difficulty(question: AnyQuestion): RnkQuestionStudioDifficultyRecord {
  const state = question.state as AnyQuestion | undefined;
  const evidence = question.evidence as AnyQuestion | undefined;
  const metadata = question.reviewMetadata as AnyQuestion | undefined;
  const mode = String(question.mode ?? "");
  if (!state || !evidence || !metadata) {
    throw new Error("RNK-QL-042 difficulty derivation requires frozen composition state, evidence and review metadata.");
  }

  const total = Number(state.total);
  const categoryA = Number(state.categoryATotal);
  const categoryB = Number(state.categoryBTotal);
  const rank = Number(state.targetRankFromTop);
  const divisor = gcd(categoryA, categoryB);
  const ratioA = categoryA / divisor;
  const ratioB = categoryB / divisor;
  const derivationSteps = Number(metadata.derivationSteps ?? 4);
  const factors: string[] = [];
  let score = 2;

  if (mode === "OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER") {
    score += 2;
    factors.push("hard source lane: derive other-category ahead from target-category after count");
  } else if (mode.includes("AHEAD_FROM")) {
    score += 1;
    factors.push("requested ahead-count must be reconstructed from an after-count");
  }

  if (String(evidence.side) === "AFTER") {
    score += 1;
    factors.push("evidence count is given after the target and must be converted");
  }

  if (derivationSteps >= 5) {
    score += 1;
    factors.push("five-step composition derivation");
  }

  if (Number.isFinite(total) && total >= 120) {
    score += 1;
    factors.push("large ranked population");
  }

  if (Number.isFinite(rank) && rank >= 32) {
    score += 1;
    factors.push("deeper target rank");
  }

  if (Number.isFinite(ratioA) && Number.isFinite(ratioB) && Math.max(ratioA, ratioB) >= 4) {
    score += 1;
    factors.push(`less immediate category ratio ${ratioA}:${ratioB}`);
  }

  const label: RnkQuestionStudioDerivedDifficulty = score >= 5 ? "Hard" : "Medium";
  return {
    modelId: RNK_001_QUESTION_STUDIO_DIFFICULTY_MODEL_V2,
    label,
    score,
    sourceDifficulty: question.difficulty == null ? null : String(question.difficulty),
    instanceDerived: true,
    factors,
  };
}

export function deriveRnkQuestionStudioDifficulty(
  question: AnyQuestion,
): RnkQuestionStudioDifficultyRecord {
  if (sourceQlId(question) === "RNK-QL-042") {
    return ql042Difficulty(question);
  }

  const label = normalizedSourceDifficulty(question);
  return {
    modelId: RNK_001_QUESTION_STUDIO_DIFFICULTY_MODEL_V2,
    label,
    score: null,
    sourceDifficulty: question.difficulty == null ? null : String(question.difficulty),
    instanceDerived: true,
    factors: ["frozen family runtime already derives difficulty from generated instance structure"],
  };
}
