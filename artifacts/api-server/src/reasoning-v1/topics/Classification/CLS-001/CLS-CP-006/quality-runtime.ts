import {
  clsCp006FormatItem,
  clsCp006IsVowel,
  clsCp006LetterPosition,
  clsCp006RuleValue,
} from "./alphabet-domain";
import { generateClsCp006Question } from "./runtime";
import type {
  ClsCp006Item,
  ClsCp006PrototypeId,
  ClsCp006RuleId,
  GeneratedClsCp006Question,
} from "./types";

export type ClsCp006PresentationQualityAudit = {
  readonly result: "PASS" | "FAIL";
  readonly reasons: readonly string[];
};

function matchSentence(matches: boolean, objectKind: "letter" | "pair"): string {
  return matches
    ? `This ${objectKind} matches the common rule.`
    : `This ${objectKind} does not match the common rule.`;
}

function richerEvidence(
  item: ClsCp006Item,
  ruleId: ClsCp006RuleId,
  commonValue: string,
): string {
  const actualValue = clsCp006RuleValue(item, ruleId);
  const matches = actualValue === commonValue;
  if (item.kind === "LETTER") {
    const letter = item.letters[0];
    const position = clsCp006LetterPosition(letter);
    switch (ruleId) {
      case "LETTER_VOWEL_CONSONANT_CLASS":
        return `${letter} is ${clsCp006IsVowel(letter) ? "a vowel" : "a consonant"}. ${matchSentence(matches, "letter")}`;
      case "LETTER_POSITION_PARITY":
        return `${letter} is at alphabet position ${position}, which is ${position % 2 === 0 ? "even" : "odd"}. ${matchSentence(matches, "letter")}`;
      case "LETTER_ALPHABET_HALF":
        return `${letter} is at alphabet position ${position}, so it lies in the ${position <= 13 ? "first half (A–M)" : "second half (N–Z)"}. ${matchSentence(matches, "letter")}`;
      default:
        throw new Error(`Unsupported single-letter quality rule: ${ruleId}`);
    }
  }

  const [first, second] = item.letters;
  const firstPosition = clsCp006LetterPosition(first);
  const secondPosition = clsCp006LetterPosition(second);
  const pair = clsCp006FormatItem(item);
  switch (ruleId) {
    case "PAIR_ABSOLUTE_POSITION_GAP": {
      const gap = Math.abs(secondPosition - firstPosition);
      return `${pair} has an absolute position gap of ${gap}: |${secondPosition} - ${firstPosition}| = ${gap}. ${matchSentence(matches, "pair")}`;
    }
    case "PAIR_SIGNED_POSITION_GAP": {
      const gap = secondPosition - firstPosition;
      const magnitude = Math.abs(gap);
      const direction = gap >= 0 ? "after" : "before";
      const positionWord = magnitude === 1 ? "position" : "positions";
      return `${pair} shows the second letter ${magnitude} ${positionWord} ${direction} the first: ${secondPosition} - ${firstPosition} = ${gap}. ${matchSentence(matches, "pair")}`;
    }
    case "PAIR_POSITION_SUM": {
      const total = firstPosition + secondPosition;
      return `${pair} has position total ${total}: ${firstPosition} + ${secondPosition} = ${total}. ${matchSentence(matches, "pair")}`;
    }
    case "PAIR_OPPOSITE_STATUS": {
      const total = firstPosition + secondPosition;
      const status = total === 27 ? "forms an opposite-letter pair" : "does not form an opposite-letter pair";
      return `${pair} ${status}: ${firstPosition} + ${secondPosition} = ${total}. ${matchSentence(matches, "pair")}`;
    }
    case "PAIR_VOWEL_CONSONANT_COMPOSITION": {
      const firstClass = clsCp006IsVowel(first) ? "vowel" : "consonant";
      const secondClass = clsCp006IsVowel(second) ? "vowel" : "consonant";
      return `${pair} has a ${firstClass} followed by a ${secondClass}. ${matchSentence(matches, "pair")}`;
    }
    default:
      throw new Error(`Unsupported letter-pair quality rule: ${ruleId}`);
  }
}

export function auditClsCp006PresentationQuality(
  question: GeneratedClsCp006Question,
): ClsCp006PresentationQualityAudit {
  const reasons: string[] = [];
  if (question.evidenceByOption.length !== question.options.length) {
    reasons.push("Every option must have one evidence line.");
  }
  question.evidenceByOption.forEach((evidence, index) => {
    const option = question.options[index]!;
    if (!evidence.startsWith(option)) {
      reasons.push(`Evidence ${index + 1} does not begin with its displayed option.`);
    }
    if (!/matches the common rule|does not match the common rule/.test(evidence)) {
      reasons.push(`Evidence ${index + 1} does not state its match result.`);
    }
    if (/\b1 positions\b/.test(evidence)) {
      reasons.push(`Evidence ${index + 1} uses incorrect singular/plural wording.`);
    }
    if (question.optionKind === "LETTER_PAIR" && question.intendedRuleId !== "PAIR_VOWEL_CONSONANT_COMPOSITION") {
      if (!/\d/.test(evidence) || !evidence.includes("=")) {
        reasons.push(`Pair evidence ${index + 1} does not show the active calculation.`);
      }
      const calculationIndex = evidence.indexOf(":");
      if (calculationIndex <= option.length) {
        reasons.push(`Pair evidence ${index + 1} lacks plain-language reasoning before calculation.`);
      }
    }
  });

  const conclusion = question.explanation.stepByStep.at(-1) ?? "";
  if (conclusion !== `Therefore, ${question.answer} is the odd one out.`) {
    reasons.push("The final conclusion does not name the stored answer exactly.");
  }
  if (question.explanation.stepByStep.length !== question.options.length + 1) {
    reasons.push("Step-by-step explanation must contain one option check plus one conclusion.");
  }
  if (!/odd|different|differs|does not/i.test(question.stem)) {
    reasons.push("The stem does not clearly request classification.");
  }
  if (/what is the position|find the position|how many letters|move .* places|rearrange/i.test(question.stem)) {
    reasons.push("The stem leaks into Alphabet Test direct-operation ownership.");
  }
  if (question.options.length === 5 && /\bThree\b/.test(question.stem)) {
    reasons.push("A five-option stem incorrectly claims that only three options share the rule.");
  }
  if (question.options.length === 4 && /\bFour\b/.test(question.stem)) {
    reasons.push("A four-option stem incorrectly claims that all four options share the rule.");
  }

  const learnerText = [
    question.stem,
    ...question.options,
    question.answer,
    ...question.evidenceByOption,
    ...question.explanation.coreConcept,
    ...question.explanation.stepByStep,
    ...question.explanation.examSpeedShortcut,
    ...question.explanation.commonTrapWarning,
  ].join("\n");
  if (/CLS-|PROT-|LETTER_[A-Z_]+|PAIR_[A-Z_]+|dataset version|candidate rule/i.test(learnerText)) {
    reasons.push("Learner text exposes an internal identifier.");
  }
  if (/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText)) {
    reasons.push("Learner text contains an invalid runtime token.");
  }
  if (/\b1 (?:positions|places)\b/.test(learnerText)) {
    reasons.push("Learner text contains incorrect singular/plural gap wording.");
  }

  return {
    result: reasons.length === 0 ? "PASS" : "FAIL",
    reasons,
  };
}

export function generateClsCp006QualityQuestion(
  prototypeId: ClsCp006PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp006Question {
  const base = generateClsCp006Question(prototypeId, seed, optionCount);
  const evidenceByOption = base.items.map((item) =>
    richerEvidence(item, base.intendedRuleId, base.intendedRuleValue),
  );
  const question: GeneratedClsCp006Question = {
    ...base,
    evidenceByOption,
    explanation: {
      ...base.explanation,
      stepByStep: [
        ...evidenceByOption,
        `Therefore, ${base.answer} is the odd one out.`,
      ],
    },
  };
  const audit = auditClsCp006PresentationQuality(question);
  if (audit.result !== "PASS") {
    throw new Error(
      `CLS-CP-006 presentation audit failed for ${prototypeId}/${seed}/${optionCount}: ${audit.reasons.join("; ")}`,
    );
  }
  return question;
}
