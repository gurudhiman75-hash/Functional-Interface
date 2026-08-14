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
const ALLOWED_MIXED_WORKING_DENOMINATORS = new Set([2, 3, 4, 5, 8, 10]);

function finalTextPolish(text: string): string {
  const percent = "([0-9]+(?:\\.[0-9]+)?(?:\\s+[0-9]+\\/[0-9]+)?)";
  const bareAmount = "((?:[0-9]+(?:\\.[0-9]+)?(?:\\s+[0-9]+\\/[0-9]+)?|[0-9]*x))";
  const amount = `(${bareAmount.slice(1, -1)} litres)`;
  return text
    .replace(/\ba acid-water solution\b/giu, "an acid-water solution")
    .replace(/\ba alcohol-water mixture\b/giu, "an alcohol-water mixture")
    .replace(
      new RegExp(`\\bof ${percent}% spirit mixture\\b`, "giu"),
      "of a spirit-water mixture containing $1% spirit",
    )
    .replace(
      new RegExp(`\\ba mixture that is ${percent}% spirit\\b`, "giu"),
      "a spirit-water mixture containing $1% spirit",
    )
    .replace(
      new RegExp(`\\b${bareAmount} litre (?=(?:sample|portion|batch|mixture|solution|transfer|return|amount|quantity|container|vessel|tank|drum)\\b)`, "giu"),
      "$1-litre ",
    )
    .replace(
      new RegExp(`\\b${bareAmount} litre\\b`, "giu"),
      (_match, numericAmount: string) =>
        `${numericAmount} ${numericAmount === "1" ? "litre" : "litres"}`,
    )
    .replace(new RegExp(`${amount} is moved B→A`, "giu"), "$1 is transferred from B to A")
    .replace(new RegExp(`${amount} is moved A→B`, "giu"), "$1 is transferred from A to B")
    .replace(
      new RegExp(`${amount} of ([^,.;?]+) is (transferred|sent|moved|poured|added|returned|removed)`, "giu"),
      "$1 of $2 are $3",
    )
    .replace(
      new RegExp(`${amount} is (transferred|sent|moved|poured|added|returned|removed)`, "giu"),
      "$1 are $2",
    )
    .replace(new RegExp(`${amount} of the mixed A is moved back`, "giu"), "$1 of the mixed liquid in A is transferred back")
    .replace(/,\s+What\s+/gu, ", what ")
    .replace(/What is the final ([a-z]+)\s*:\s*([a-z]+) ratio in B\?/giu, "What is the final $1-to-$2 ratio in B?")
    .replace(new RegExp(`\\b${amount} goes\\b`, "giu"), "$1 are transferred")
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

function visibleWorkingIsFriendly(lines: readonly string[]): boolean {
  for (const line of lines) {
    for (const match of line.matchAll(/\b\d+\s+(\d+)\/(\d+)\b/gu)) {
      const denominator = Number(match[2]);
      if (!ALLOWED_MIXED_WORKING_DENOMINATORS.has(denominator)) return false;
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
  if (!visibleWorkingIsFriendly(question.explanation.visibleLines)) return false;
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
  if (/\b(?:[0-9]+(?:\.\d+)?(?:\s+[0-9]+\/[0-9]+)?|[0-9]*x) litres(?: of [^,.;?]+)? is (?:transferred|sent|moved|poured|added|returned|removed)\b/iu.test(learnerText)) return false;
  if (/\b(?:[2-9]|\d{2,})(?:\.\d+)?(?:\s+\d+\/\d+)? litre\b/iu.test(learnerText)) return false;
  if (/\blitres is moved [AB]→[AB]\b/iu.test(learnerText)) return false;
  if (/What is the final [a-z]+\s*:\s*[a-z]+ ratio/iu.test(question.stem)) return false;
  if (/\b\d+(?:\.\d+)?% spirit mixture\b/iu.test(learnerText)) return false;
  if (/\ba mixture that is \d+(?:\.\d+)?% spirit\b/iu.test(learnerText)) return false;
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
