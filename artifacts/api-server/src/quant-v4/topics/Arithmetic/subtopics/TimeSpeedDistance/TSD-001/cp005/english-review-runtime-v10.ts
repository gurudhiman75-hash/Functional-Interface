import { divide } from "../foundation/rational";
import { formatDurationHours } from "../cp003/generation-support";
import type { TsdCp005EnglishReviewQuestion, TsdCp005ReviewOptionAudit } from "./english-review-runtime";
import { generateCp005EnglishAuditPoolV9, generateCp005ReviewSetV9 } from "./english-review-runtime-v9";

const ONE_TURN_TIME_MODES = new Set([
  "findMeetingAfterOneTravellerTurnsBack",
  "findShuttleMeetingTime",
  "findPassThenCatchAfterTurnaround",
]);

function improveReturnMeetingDistractor(question: TsdCp005EnglishReviewQuestion): TsdCp005EnglishReviewQuestion {
  if (!ONE_TURN_TIME_MODES.has(question.solveMode)) return question;
  const targetIndex = question.internalOptionAudit.findIndex((entry) => entry.misconceptionId === "USE_PURSUIT_DIFFERENCE_AFTER_TURN");
  if (targetIndex < 0) throw new Error(`${question.solveMode}: V10 expected pursuit-difference distractor`);
  const L = question.input.routeDistance;
  const v = question.input.speedB;
  if (!L || !v) throw new Error(`${question.solveMode}: V10 missing route/speed for distractor replacement`);
  const replacementText = formatDurationHours(divide(L, v));
  const otherTexts = question.internalOptionAudit.filter((_entry, index) => index !== targetIndex).map((entry) => entry.text);
  if (otherTexts.includes(replacementText)) throw new Error(`${question.solveMode}: V10 slower-full-route distractor collided with an existing option`);

  const replacement: TsdCp005ReviewOptionAudit = Object.freeze({
    text: replacementText,
    misconceptionId: "USE_SLOWER_FULL_ROUTE_TIME",
    isCorrect: false,
    wrongWorking: Object.freeze({
      calculation: "L / v",
      diagnosis: "Used the time the slower traveller would need to reach the far endpoint instead of the earlier time when the returning faster traveller meets it.",
    }),
  });
  const audits = [...question.internalOptionAudit];
  audits[targetIndex] = replacement;
  const frozenAudit = Object.freeze(audits);
  const options = Object.freeze(frozenAudit.map((entry) => entry.text));
  if (new Set(options).size !== 4) throw new Error(`${question.solveMode}: V10 selected options are not unique`);
  return Object.freeze({ ...question, internalOptionAudit: frozenAudit, options });
}

export function generateCp005ReviewSetV10(perAuthority = 6): readonly TsdCp005EnglishReviewQuestion[] {
  return Object.freeze(generateCp005ReviewSetV9(perAuthority).map(improveReturnMeetingDistractor));
}

/** Structural stress audit is intentionally unchanged; V10 improves curated options only. */
export function generateCp005EnglishAuditPoolV10(perAuthority = 30): readonly TsdCp005EnglishReviewQuestion[] {
  return generateCp005EnglishAuditPoolV9(perAuthority);
}
