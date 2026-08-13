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

function finalTextPolish(text: string): string {
  return text
    .replace(/\ba acid-water solution\b/giu, "an acid-water solution")
    .replace(/\ba alcohol-water mixture\b/giu, "an alcohol-water mixture")
    .replace(/\b([0-9]+(?:\.[0-9]+)?(?:\s+[0-9]+\/[0-9]+)? litres) goes\b/giu, "$1 is transferred")
    .replace(/\b1 litres\b/giu, "1 litre");
}

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

function applyFinalTextPolish(
  question: MalCp006DiscoveryQuestion,
): MalCp006DiscoveryQuestion {
  const stem = finalTextPolish(question.stem);
  const options = question.options.map(finalTextPolish);
  const answer = finalTextPolish(question.answer);
  const visibleLines = question.explanation.visibleLines.map(finalTextPolish);
  const commonMistake = finalTextPolish(
    question.explanation.optionalHelp.commonMistake,
  );
  const verification = question.explanation.optionalHelp.verification.map(
    finalTextPolish,
  );
  const optionAudit = question.optionAudit.map((entry, index) => ({
    ...entry,
    text: options[index]!,
  }));
  return {
    ...question,
    stem,
    answer,
    options,
    optionAudit,
    explanation: {
      ...question.explanation,
      visibleLines,
      answerLine: `Answer: ${answer}`,
      optionalHelp: {
        ...question.explanation.optionalHelp,
        commonMistake,
        verification,
      },
    },
  };
}

function surfaceIsClean(question: MalCp006DiscoveryQuestion): boolean {
  if (!question.validation.ok) return false;
  if (!question.options.every(learnerOptionIsFriendly)) return false;
  if (
    question.optionAudit.some(
      (entry, index) => entry.text !== question.options[index],
    )
  ) {
    return false;
  }
  const learnerText = [
    question.stem,
    ...question.options,
    ...question.explanation.visibleLines,
    question.explanation.optionalHelp.commonMistake,
    ...question.explanation.optionalHelp.verification,
  ].join(" ");
  if (/\ba (?:acid|alcohol)-water\b/iu.test(learnerText)) return false;
  if (/\b1 litres\b/iu.test(learnerText)) return false;
  if (/\blitres goes\b/iu.test(learnerText)) return false;
  if (
    /salt solution component|component load|state key|current fraction|global component/iu.test(
      learnerText,
    )
  ) {
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
    const question = applyFinalTextPolish(
      generateMalCp006Wave01LearnerPolishFinalQuestion(
        prototypeId,
        candidateSeed,
      ),
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
