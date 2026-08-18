import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import type { TsdCp005EnglishReviewQuestion } from "./english-review-runtime";
import { generateCp005EnglishAuditPoolV7, generateCp005ReviewQuestionV7 } from "./english-review-runtime-v7";

const RAW_FRACTION = /\b\d+\/\d+\b/;

function explanationHasAwkwardFraction(question: TsdCp005EnglishReviewQuestion): boolean {
  const text = [question.explanation.method, ...question.explanation.steps, question.explanation.shortcut, question.explanation.finalAnswer].join(" ");
  const matches = text.matchAll(/\b(\d+)\/(\d+)\b/g);
  for (const match of matches) {
    const numerator = Number(match[1]);
    const denominator = Number(match[2]);
    // Simple ratio arithmetic such as 2/3, 3/2 or 5/8 is normal in a worked
    // solution. Reject the large raw rational forms that read like generator
    // output (for example 60/13 hours or 4800/13 km).
    if (numerator > 10 || denominator > 10) return true;
  }
  return false;
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
    && !text.includes("?")
    && !text.includes("road-study")
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
  // The underlying selected-state generator has a 30-state route/speed cycle.
  // Search two full cycles from a deterministic offset so selection remains
  // reproducible while rejecting exam-unfriendly learner surfaces.
  const start = (authorityIndex * 11 + questionOrdinal * 7) % 30;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const stateIndex = (start + attempt) % 30;
    const seed = `cp005-review-v8:${authorityIndex}:${questionOrdinal}:state-${stateIndex}`;
    const candidate = generateCp005ReviewQuestionV7(authorityKey, seed, questionOrdinal);
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

/**
 * The large audit deliberately retains exact rational states. V8's new gate is
 * specifically about the curated learner-review surface, not about weakening
 * the mathematical stress surface.
 */
export function generateCp005EnglishAuditPoolV8(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  return generateCp005EnglishAuditPoolV7(perAuthority);
}
