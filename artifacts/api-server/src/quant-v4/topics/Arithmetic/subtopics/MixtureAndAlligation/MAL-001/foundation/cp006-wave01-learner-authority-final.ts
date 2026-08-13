import {
  generateMalCp006Wave01LearnerPolishFinalQuestion,
  MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  malCp006Wave01LearnerPolishStable,
  type MalCp006Wave01V2PrototypeId,
  verifyMalCp006Wave01V2Answer,
} from "./cp006-wave01-learner-polish-final";
import type { MalCp006DiscoveryQuestion } from "./cp006-types";

export const MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY_ID =
  "MAL-CP006-EN-WAVE01-FINAL-LEARNER-AUTHORITY-V1" as const;

export {
  MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  type MalCp006Wave01V2PrototypeId,
  verifyMalCp006Wave01V2Answer,
};

const ALLOWED_OPTION_FRACTION_DENOMINATORS = new Set([2, 3, 4, 5, 8, 10]);
const ALLOWED_PERCENT_FRACTION_DENOMINATORS = new Set([2, 3, 4, 5]);

function learnerOptionIsFriendly(option: string): boolean {
  for (const match of option.matchAll(/(\d+)\/(\d+)/gu)) {
    const denominator = Number(match[2]);
    if (!ALLOWED_OPTION_FRACTION_DENOMINATORS.has(denominator)) return false;
    if (
      option.includes("%") &&
      !ALLOWED_PERCENT_FRACTION_DENOMINATORS.has(denominator)
    ) {
      return false;
    }
  }
  return true;
}

function surfaceIsClean(question: MalCp006DiscoveryQuestion): boolean {
  if (!question.validation.ok) return false;
  if (!question.options.every(learnerOptionIsFriendly)) return false;
  if (question.optionAudit.some((entry, index) => entry.text !== question.options[index])) {
    return false;
  }
  const learnerText = [
    question.stem,
    ...question.options,
    ...question.explanation.visibleLines,
    question.explanation.optionalHelp.commonMistake,
    ...question.explanation.optionalHelp.verification,
  ].join(" ");
  if (/\ba acid-water\b/iu.test(learnerText)) return false;
  if (/\b1 litres\b/iu.test(learnerText)) return false;
  if (/salt solution component|component load|state key|current fraction|global component/iu.test(learnerText)) {
    return false;
  }
  return true;
}

export function generateMalCp006Wave01FinalLearnerAuthorityQuestion(
  prototypeId: MalCp006Wave01V2PrototypeId,
  seed = "mal-cp006-wave01-final-authority:default",
): MalCp006DiscoveryQuestion {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const candidateSeed =
      attempt === 0 ? seed : `${seed}:authority-retry:${attempt}`;
    const question = generateMalCp006Wave01LearnerPolishFinalQuestion(
      prototypeId,
      candidateSeed,
    );
    if (surfaceIsClean(question)) {
      return {
        ...question,
        requestedSeed: seed,
      };
    }
  }
  throw new Error(
    `${prototypeId}: no final learner-authority state survived for ${seed}.`,
  );
}

export function malCp006Wave01FinalLearnerAuthorityStable(
  question: MalCp006DiscoveryQuestion,
): string {
  return malCp006Wave01LearnerPolishStable(question);
}
