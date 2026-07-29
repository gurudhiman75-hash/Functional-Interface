import { fillSingleDigit } from "../../foundation/divisibility";
import type { DeterministicRandom } from "../../foundation/prng";
import { difficultyFromState, digitSetText, option, randomTemplate, reasoningNodes, singleDigitDomain } from "./runtime-core";
import type { NumCp003RawRetainedQuestion } from "./runtime-types";

interface PredicateEvidence {
  id: string;
  text: string;
  candidates: number[];
}

type SufficiencyClass = "I_ALONE" | "II_ALONE" | "EACH_ALONE" | "BOTH_TOGETHER" | "INSUFFICIENT";

const PRIME_DIGITS = new Set([2, 3, 5, 7]);
const SQUARE_DIGITS = new Set([0, 1, 4, 9]);

function intersection(left: readonly number[], right: readonly number[]): number[] {
  const rightSet = new Set(right);
  return left.filter((value) => rightSet.has(value));
}

function sameCandidates(left: readonly number[], right: readonly number[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function buildPredicatePool(template: string, domain: readonly number[], random: DeterministicRandom): PredicateEvidence[] {
  const predicates: PredicateEvidence[] = [];
  const add = (id: string, text: string, candidates: number[]): void => {
    const sorted = [...new Set(candidates)].sort((a, b) => a - b);
    if (sorted.length === 0 || sorted.length === domain.length) return;
    if (predicates.some((predicate) => sameCandidates(predicate.candidates, sorted) && predicate.text === text)) return;
    predicates.push({ id, text, candidates: sorted });
  };

  for (const divisor of [3n, 4n, 5n, 6n, 8n, 9n, 11n, 12n, 18n, 25n, 36n, 45n] as const) {
    add(
      `DIVISIBLE_${divisor}`,
      `The completed number ${template} is divisible by ${divisor}.`,
      domain.filter((digit) => BigInt(fillSingleDigit(template, digit)) % divisor === 0n),
    );
  }

  add("EVEN", "X is an even digit.", domain.filter((digit) => digit % 2 === 0));
  add("ODD", "X is an odd digit.", domain.filter((digit) => digit % 2 === 1));
  add("PRIME", "X is a prime digit.", domain.filter((digit) => PRIME_DIGITS.has(digit)));
  add("SQUARE", "X is a perfect-square digit.", domain.filter((digit) => SQUARE_DIGITS.has(digit)));
  add("EVEN_PRIME", "X is an even prime digit.", domain.filter((digit) => digit === 2));
  add("PRIME_GT_5", "X is a prime digit greater than 5.", domain.filter((digit) => PRIME_DIGITS.has(digit) && digit > 5));
  add("NONZERO_MULTIPLE_5", "X is a non-zero digit divisible by 5.", domain.filter((digit) => digit !== 0 && digit % 5 === 0));
  add("SQUARE_GT_5", "X is a perfect-square digit greater than 5.", domain.filter((digit) => SQUARE_DIGITS.has(digit) && digit > 5));

  for (const threshold of [1, 2, 3, 4, 5, 6, 7, 8]) {
    add(`GT_${threshold}`, `X is greater than ${threshold}.`, domain.filter((digit) => digit > threshold));
    add(`LT_${threshold}`, `X is less than ${threshold}.`, domain.filter((digit) => digit < threshold));
  }
  for (const divisor of [2, 3, 4, 5]) {
    add(`DIGIT_MULTIPLE_${divisor}`, `X is a digit divisible by ${divisor}.`, domain.filter((digit) => digit % divisor === 0));
  }

  const shuffledDomain = random.shuffle(domain);
  for (let size = 2; size <= Math.min(4, domain.length - 1); size += 1) {
    for (let index = 0; index < 5; index += 1) {
      const values = random.shuffle(shuffledDomain).slice(0, size).sort((a, b) => a - b);
      add(`MEMBER_${values.join("_")}`, `X is one of the digits ${digitSetText(values)}.`, values);
    }
  }

  return predicates;
}

function classify(first: readonly number[], second: readonly number[]): SufficiencyClass | null {
  const together = intersection(first, second);
  if (together.length === 0) return null;
  if (first.length === 1 && second.length === 1 && first[0] === second[0]) return "EACH_ALONE";
  if (first.length === 1 && second.length !== 1) return "I_ALONE";
  if (second.length === 1 && first.length !== 1) return "II_ALONE";
  if (first.length > 1 && second.length > 1 && together.length === 1) return "BOTH_TOGETHER";
  if (first.length !== 1 && second.length !== 1 && together.length > 1) return "INSUFFICIENT";
  return null;
}

function classText(value: SufficiencyClass): string {
  switch (value) {
    case "I_ALONE": return "Statement I alone is sufficient, but Statement II alone is not sufficient.";
    case "II_ALONE": return "Statement II alone is sufficient, but Statement I alone is not sufficient.";
    case "EACH_ALONE": return "Each statement alone is sufficient.";
    case "BOTH_TOGETHER": return "Both statements together are sufficient, but neither alone is sufficient.";
    case "INSUFFICIENT": return "Even both statements together are not sufficient.";
  }
}

export function generateDataSufficiencyAuthority(random: DeterministicRandom): NumCp003RawRetainedQuestion {
  const targetClass = random.pick(["I_ALONE", "II_ALONE", "EACH_ALONE", "BOTH_TOGETHER", "INSUFFICIENT"] as const);

  for (let attempt = 0; attempt < 5_000; attempt += 1) {
    const template = randomTemplate(random, 1);
    const domain = singleDigitDomain(template);
    const pool = buildPredicatePool(template, domain, random);
    const candidatePairs: Array<[PredicateEvidence, PredicateEvidence]> = [];

    for (const first of pool) {
      for (const second of pool) {
        if (first.id === second.id || first.text === second.text) continue;
        if (classify(first.candidates, second.candidates) === targetClass) candidatePairs.push([first, second]);
      }
    }
    if (candidatePairs.length === 0) continue;

    const [statementI, statementII] = random.pick(candidatePairs);
    const together = intersection(statementI.candidates, statementII.candidates);
    const answer = classText(targetClass);
    const classOrder: SufficiencyClass[] = ["I_ALONE", "II_ALONE", "EACH_ALONE", "BOTH_TOGETHER", "INSUFFICIENT"];
    const rows = classOrder.map((value) => option(
      classText(value),
      value === targetClass ? "CORRECT" : `MISCLASSIFIED_${value}`,
      value === targetClass
        ? `Statement I leaves ${digitSetText(statementI.candidates)}, Statement II leaves ${digitSetText(statementII.candidates)}, and together they leave ${digitSetText(together)}.`
        : `The candidate-set sizes are I: ${statementI.candidates.length}, II: ${statementII.candidates.length}, together: ${together.length}; this does not match ${value}.`,
    ));

    return {
      difficulty: targetClass === "EACH_ALONE" ? "Medium" : targetClass === "BOTH_TOGETHER" || targetClass === "INSUFFICIENT" ? "Hard" : difficultyFromState(template.length + 2),
      answerSemantic: "SUFFICIENCY_CLASS",
      stem: random.pick([
        `What is the digit X in ${template}? Decide whether the statements are sufficient.\nStatement I: ${statementI.text}\nStatement II: ${statementII.text}`,
        `For the missing digit X in ${template}, determine the sufficiency of the following information.\nI. ${statementI.text}\nII. ${statementII.text}`,
        `Can X in ${template} be determined uniquely? Use the two statements below.\nStatement I: ${statementI.text}\nStatement II: ${statementII.text}`,
        `Assess whether the value of X in ${template} is uniquely determined.\nI. ${statementI.text}\nII. ${statementII.text}`,
      ]),
      answer,
      optionAudit: rows,
      hiddenState: {
        kind: "DATA_SUFFICIENCY",
        template,
        domain,
        statementI: statementI.text,
        statementII: statementII.text,
        candidatesI: statementI.candidates,
        candidatesII: statementII.candidates,
        candidatesTogether: together,
        sufficiencyClass: targetClass,
      },
      explanation: {
        coreConcept: "Data sufficiency asks whether the visible evidence determines one unique digit, not whether a convenient value can be found.",
        strategy: "Evaluate the candidate set under each statement separately, then evaluate their intersection.",
        steps: [
          `Statement I leaves ${digitSetText(statementI.candidates)}.`,
          `Statement II leaves ${digitSetText(statementII.candidates)}.`,
          `Together they leave ${digitSetText(together)}, so the correct class is: ${answer}`,
        ],
        shortcut: "A statement is sufficient exactly when its candidate set has one member; both together are evaluated by set intersection.",
        verification: `The candidate-set sizes are ${statementI.candidates.length}, ${statementII.candidates.length} and ${together.length} for I, II and both together.`,
        conclusion: answer,
        traps: [
          "Do not combine the statements before checking each one alone.",
          "A non-empty candidate set is not sufficient unless it has exactly one member.",
          "Both statements must be mutually consistent; an empty intersection is not a valid determination.",
        ],
      },
      reasoningNodes: reasoningNodes(
        `The admissible digit domain for ${template} is ${digitSetText(domain)}.`,
        "A statement is sufficient only when it leaves one candidate.",
        `I → ${digitSetText(statementI.candidates)}, II → ${digitSetText(statementII.candidates)}, together → ${digitSetText(together)}.`,
        `The resulting sufficiency class is ${targetClass}.`,
        answer,
      ),
      fingerprint: `ds:${targetClass}:${template}:${statementI.id}:${statementII.id}:${digitSetText(together)}`,
    };
  }

  throw new Error(`Unable to construct data-sufficiency class ${targetClass}`);
}
