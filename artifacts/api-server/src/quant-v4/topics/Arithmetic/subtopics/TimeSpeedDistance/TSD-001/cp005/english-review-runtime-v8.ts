import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import type { TsdCp005EnglishReviewQuestion } from "./english-review-runtime";
import { generateCp005EnglishAuditPoolV7, generateCp005ReviewQuestionV7 } from "./english-review-runtime-v7";

const RAW_FRACTION = /\b\d+\/\d+\b/;

function explanationHasAwkwardFraction(question: TsdCp005EnglishReviewQuestion): boolean {
  const text = [question.explanation.method, ...question.explanation.steps, question.explanation.shortcut, question.explanation.finalAnswer].join(" ");
  for (const match of text.matchAll(/\b(\d+)\/(\d+)\b/g)) {
    const numerator = Number(match[1]);
    const denominator = Number(match[2]);
    // Simple ratio arithmetic such as 2/3, 3/2 or 5/8 is normal in a worked
    // solution. Reject large raw rationals that read like generator output.
    if (numerator > 10 || denominator > 10) return true;
  }
  return false;
}

function normalizeExamStem(stem: string): string {
  return stem
    .replace("Find the time of their next meeting after both-endpoint motion has begun.", "After their first meeting, how long after the start will they meet again?")
    .replace("A road trial follows two vehicles on the same bounded route.", "Two vehicles travel on a straight route between fixed endpoints A and B.")
    .replace("A motion log records repeated travel between two fixed checkpoints.", "Two travellers move repeatedly between two fixed checkpoints.")
    .replace("A starts from P at", "A starts from P at")
    .replace("touches Q and immediately returns", "reaches Q and immediately returns");
}

function learnerText(question: TsdCp005EnglishReviewQuestion): string {
  return [
    question.stem,
    question.answerText,
    question.explanation.method,
    ...question.explanation.steps,
    question.explanation.shortcut,
    question.explanation.finalAnswer,
  ].join(" ");
}

export function isCp005ExamFriendlySelectedState(question: TsdCp005EnglishReviewQuestion): boolean {
  const text = learnerText(question);
  return !RAW_FRACTION.test(question.stem)
    && !RAW_FRACTION.test(question.answerText)
    && !explanationHasAwkwardFraction(question)
    && !text.includes("road-study")
    && !text.includes("both-endpoint motion")
    && !text.includes("keep reflecting")
    && !text.toLowerCase().includes("km-equivalent")
    && !text.includes("Use the stated distances, speeds and times exactly as given");
}

function selectQuestion(
  authorityKey: string,
  authorityIndex: number,
  questionOrdinal: number,
  usedFingerprints: Set<string>,
  usedStems: Set<string>,
): TsdCp005EnglishReviewQuestion {
  const start = (authorityIndex * 11 + questionOrdinal * 7) % 30;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const stateIndex = (start + attempt) % 30;
    const seed = `cp005-review-v8:${authorityIndex}:${questionOrdinal}:state-${stateIndex}`;
    const base = generateCp005ReviewQuestionV7(authorityKey, seed, questionOrdinal);
    const stem = normalizeExamStem(base.stem);
    const candidate = stem === base.stem ? base : Object.freeze({ ...base, stem });
    if (!isCp005ExamFriendlySelectedState(candidate)) continue;
    if (usedFingerprints.has(candidate.mathematicalFingerprint)) continue;
    if (usedStems.has(candidate.stem)) continue;
    usedFingerprints.add(candidate.mathematicalFingerprint);
    usedStems.add(candidate.stem);
    return candidate;
  }
  throw new Error(`${authorityKey}/ordinal-${questionOrdinal}: no exam-friendly V8 selected state found in deterministic 30-state cycle`);
}

export function generateCp005ReviewSetV8(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  if (!Number.isInteger(perAuthority) || perAuthority <= 0) throw new Error("CP005 V8 perAuthority must be a positive integer");
  const usedFingerprints = new Set<string>();
  const usedStems = new Set<string>();
  const rows: TsdCp005EnglishReviewQuestion[] = [];
  for (let authorityIndex = 0; authorityIndex < TSD_CP005_APPROVED_LEARNER_AUTHORITIES.length; authorityIndex += 1) {
    const authority = TSD_CP005_APPROVED_LEARNER_AUTHORITIES[authorityIndex]!;
    for (let questionOrdinal = 0; questionOrdinal < perAuthority; questionOrdinal += 1) {
      rows.push(selectQuestion(authority.authorityKey, authorityIndex, questionOrdinal, usedFingerprints, usedStems));
    }
  }
  return Object.freeze(rows);
}

/** Large audit deliberately retains exact rational stress states. */
export function generateCp005EnglishAuditPoolV8(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  return generateCp005EnglishAuditPoolV7(perAuthority);
}
