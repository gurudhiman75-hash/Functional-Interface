import { TSD_CP004_REVIEW_AUTHORITIES } from "./generator";
import { polishCp004ActorStem, strengthenCp004Explanation } from "./presentation-remediation";
import { generateCp004Question } from "./question-runtime";
import type { TsdCp004GeneratedQuestion, TsdCp004GeneratedState } from "./runtime-types";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const REVIEW_VARIANT_COUNT = 6;

function polishReviewQuestion(question: TsdCp004GeneratedQuestion): TsdCp004GeneratedQuestion {
  const state: TsdCp004GeneratedState = Object.freeze({
    authorityKey: question.authorityKey,
    permanentQlId: question.permanentQlId,
    solveMode: question.solveMode,
    representation: question.representation,
    context: question.context,
    input: question.input,
    seed: question.seed,
  });
  return Object.freeze({
    ...question,
    stem: polishCp004ActorStem(state, question.stem),
    explanation: strengthenCp004Explanation(
      question.authorityKey,
      question.input,
      question.solution,
      question.answerText,
      question.explanation,
    ),
  });
}

function selectUniqueReviewQuestion(
  authorityKey: string,
  variant: number,
  selected: readonly TsdCp004GeneratedQuestion[],
): TsdCp004GeneratedQuestion {
  const baseline = generateCp004Question(authorityKey, `english-review:${authorityKey}:${variant}`);
  const targetMode = baseline.solveMode;
  for (let cycle = 0; cycle < 60; cycle += 1) {
    const index = variant + cycle * REVIEW_VARIANT_COUNT;
    const candidate = polishReviewQuestion(generateCp004Question(authorityKey, `english-review:${authorityKey}:${index}`));
    if (candidate.solveMode !== targetMode) continue;
    if (Number(candidate.representation.split(":").at(-1) ?? "-1") !== variant) continue;
    if (selected.some((row) => row.mathematicalFingerprint === candidate.mathematicalFingerprint)) continue;
    if (selected.some((row) => row.stem === candidate.stem)) continue;
    return candidate;
  }
  throw new Error(`${authorityKey}: could not find a unique mathematical state for review variant ${variant} without changing its solve mode`);
}

export function generateCp004AuditPool(seedsPerAuthority = 40): readonly TsdCp004GeneratedQuestion[] {
  if (!Number.isInteger(seedsPerAuthority) || seedsPerAuthority < 1) throw new Error("seedsPerAuthority must be positive");
  const rows: TsdCp004GeneratedQuestion[] = [];
  for (const authorityKey of TSD_CP004_REVIEW_AUTHORITIES) {
    for (let index = 0; index < seedsPerAuthority; index += 1) rows.push(generateCp004Question(authorityKey, `audit:${authorityKey}:${index}`));
  }
  return Object.freeze(rows);
}

export function generateCp004ReviewQuestions(rowsPerAuthority = 6): readonly TsdCp004GeneratedQuestion[] {
  if (!Number.isInteger(rowsPerAuthority) || rowsPerAuthority < 1 || rowsPerAuthority > REVIEW_VARIANT_COUNT) {
    throw new Error(`rowsPerAuthority must be an integer from 1 to ${REVIEW_VARIANT_COUNT}`);
  }
  const rows: TsdCp004GeneratedQuestion[] = [];
  for (const authorityKey of TSD_CP004_REVIEW_AUTHORITIES) {
    const selected: TsdCp004GeneratedQuestion[] = [];
    for (let variant = 0; variant < rowsPerAuthority; variant += 1) {
      selected.push(selectUniqueReviewQuestion(authorityKey, variant, selected));
    }
    if (new Set(selected.map((row) => row.stem)).size !== selected.length) throw new Error(`${authorityKey}: duplicate stem in review selection`);
    if (new Set(selected.map((row) => row.mathematicalFingerprint)).size !== selected.length) throw new Error(`${authorityKey}: duplicate mathematical fingerprint in review selection`);
    rows.push(...selected);
  }
  return Object.freeze(rows);
}

export function optionLabel(index: number): "A" | "B" | "C" | "D" {
  const label = OPTION_LABELS[index];
  if (!label) throw new Error(`invalid option index ${index}`);
  return label;
}
