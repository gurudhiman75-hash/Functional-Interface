import { validSingleDigits } from "../../foundation/divisibility";
import type { DeterministicRandom } from "../../foundation/prng";
import { DIVISORS, audit, nodes, type Raw } from "./core";
import type { SufficiencyClass, Wave03MisconceptionId, Wave03OptionAudit } from "./types";

export const SUFFICIENCY_TEXT: Record<SufficiencyClass, string> = {
  STATEMENT_I_ALONE: "Statement I alone is sufficient, but Statement II alone is not sufficient.",
  STATEMENT_II_ALONE: "Statement II alone is sufficient, but Statement I alone is not sufficient.",
  BOTH_TOGETHER_ONLY: "Both statements together are sufficient, but neither statement alone is sufficient.",
  EVEN_TOGETHER_INSUFFICIENT: "Even both statements together are not sufficient.",
};

export function classifySufficiency(firstDigits: number[], secondDigits: number[], intersection: number[]): SufficiencyClass | null {
  if (intersection.length === 0) return null;
  const firstUnique = firstDigits.length === 1;
  const secondUnique = secondDigits.length === 1;
  if (firstUnique && !secondUnique) return "STATEMENT_I_ALONE";
  if (!firstUnique && secondUnique) return "STATEMENT_II_ALONE";
  if (!firstUnique && !secondUnique && intersection.length === 1) return "BOTH_TOGETHER_ONLY";
  if (!firstUnique && !secondUnique && intersection.length > 1) return "EVEN_TOGETHER_INSUFFICIENT";
  return null;
}

export function dataSufficiency(random: DeterministicRandom): Raw {
  const desired = random.pick(["STATEMENT_I_ALONE", "STATEMENT_II_ALONE", "BOTH_TOGETHER_ONLY", "EVEN_TOGETHER_INSUFFICIENT"] as const);
  for (let attempt = 0; attempt < 5000; attempt += 1) {
    const length = random.int(4, 7);
    const parts = Array.from({ length }, (_unused, index) => String(random.int(index === 0 ? 1 : 0, 9)));
    parts[random.int(1, length - 1)] = "X";
    const template = parts.join("");
    const firstDivisor = random.pick(DIVISORS);
    let secondDivisor = random.pick(DIVISORS);
    while (secondDivisor === firstDivisor) secondDivisor = random.pick(DIVISORS);
    const firstDigits = validSingleDigits(template, firstDivisor);
    const secondDigits = validSingleDigits(template, secondDivisor);
    const intersection = firstDigits.filter((digit) => secondDigits.includes(digit));
    const sufficiencyClass = classifySufficiency(firstDigits, secondDigits, intersection);
    if (sufficiencyClass !== desired) continue;

    const options = (Object.keys(SUFFICIENCY_TEXT) as SufficiencyClass[]).map((classification) => {
      if (classification === sufficiencyClass) {
        return audit(SUFFICIENCY_TEXT[classification], "CORRECT", `Statement I gives {${firstDigits.join(", ")}}, Statement II gives {${secondDigits.join(", ")}}, and their intersection is {${intersection.join(", ")}}.`);
      }
      const misconception: Wave03MisconceptionId = classification === "STATEMENT_I_ALONE"
        ? "STATEMENT_I_ONLY_MISREAD"
        : classification === "STATEMENT_II_ALONE"
          ? "STATEMENT_II_ONLY_MISREAD"
          : classification === "BOTH_TOGETHER_ONLY"
            ? "BOTH_TOGETHER_MISREAD"
            : "INSUFFICIENT_MISREAD";
      return audit(SUFFICIENCY_TEXT[classification], misconception, `The actual candidate sets are I = {${firstDigits.join(", ")}}, II = {${secondDigits.join(", ")}}, intersection = {${intersection.join(", ")}}.`);
    });

    return {
      hiddenState: { kind: "MISSING_DIGIT_DATA_SUFFICIENCY", template, firstDivisor, secondDivisor, firstDigits, secondDigits, intersection, sufficiencyClass },
      difficulty: "Hard",
      answerSemantic: "SUFFICIENCY_CLASS",
      stem: `What can be concluded about the missing digit X in ${template}? Statement I: The number is divisible by ${firstDivisor}. Statement II: The number is divisible by ${secondDivisor}. Which option correctly describes whether X can be determined?`,
      answer: SUFFICIENCY_TEXT[sufficiencyClass],
      options,
      explanation: {
        coreConcept: "A statement is sufficient only when its complete admissible digit set contains exactly one value.",
        strategy: "Compute the candidate set from each statement separately, then inspect their intersection.",
        steps: [`Statement I permits {${firstDigits.join(", ")}}.`, `Statement II permits {${secondDigits.join(", ")}}.`, `Together they permit {${intersection.join(", ")}}, giving the stated sufficiency classification.`],
        shortcut: "Never combine the statements before checking whether either one is already sufficient alone.",
        verification: `Independent substitution of X = 0 through 9 reproduces both candidate sets and their intersection.`,
        conclusion: SUFFICIENCY_TEXT[sufficiencyClass],
        traps: ["Test each statement separately first.", "A non-empty set is not necessarily unique.", "Two statements can be consistent yet still insufficient."],
      },
      nodes: nodes(`${template} with two divisibility statements.`, "A singleton candidate set determines X.", `I = {${firstDigits.join(", ")}}, II = {${secondDigits.join(", ")}}.`, `Intersection = {${intersection.join(", ")}}.`, SUFFICIENCY_TEXT[sufficiencyClass]),
      fingerprint: `ds:${template}:${firstDivisor}:${secondDivisor}:${firstDigits.join("")}:${secondDigits.join("")}:${sufficiencyClass}`,
    };
  }
  throw new Error(`Could not build data-sufficiency class ${desired}`);
}

export function powerDifferenceDivisor(random: DeterministicRandom): Raw {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const secondBase = BigInt(random.int(2, 20));
    const difference = BigInt(random.int(2, 14));
    const firstBase = secondBase + difference;
    const exponent = random.pick([3, 5, 7] as const);
    const value = firstBase ** BigInt(exponent) - secondBase ** BigInt(exponent);
    const correctDivisor = difference;
    const wrongCandidates: Wave03OptionAudit[] = [
      audit((firstBase + secondBase).toString(), "USED_SUM_INSTEAD_OF_DIFFERENCE", `The base sum ${firstBase + secondBase} is not the guaranteed factor; the exact value leaves remainder ${value % (firstBase + secondBase)}.`),
      audit(BigInt(exponent).toString(), "USED_EXPONENT_AS_DIVISOR", `The exponent ${exponent} is not generally a divisor; the exact value leaves remainder ${value % BigInt(exponent)}.`),
      audit((firstBase * secondBase).toString(), "USED_BASE_PRODUCT", `The base product ${firstBase * secondBase} is not the identity factor; the exact value leaves remainder ${value % (firstBase * secondBase)}.`),
      audit((difference + 1n).toString(), "FALSE_GENERALISATION", `${difference + 1n} is adjacent to the base difference but the exact value leaves remainder ${value % (difference + 1n)}.`),
      audit((difference - 1n).toString(), "FALSE_GENERALISATION", `${difference - 1n} is adjacent to the base difference but is not guaranteed by the identity.`),
      audit(firstBase.toString(), "FALSE_GENERALISATION", `The first base ${firstBase} is not the factor supplied by the power-difference identity.`),
      audit(secondBase.toString(), "FALSE_GENERALISATION", `The second base ${secondBase} is not the factor supplied by the power-difference identity.`),
    ].filter((candidate) => {
      const candidateValue = BigInt(candidate.text);
      return candidateValue > 1n && candidateValue !== correctDivisor && value % candidateValue !== 0n;
    });
    const uniqueWrong = [...new Map(wrongCandidates.map((candidate) => [candidate.text, candidate])).values()];
    if (uniqueWrong.length < 3) continue;
    const wrong = random.shuffle(uniqueWrong).slice(0, 3);
    const options = [
      audit(correctDivisor.toString(), "CORRECT", `${firstBase} - ${secondBase} = ${correctDivisor}, which divides every ${firstBase}^n - ${secondBase}^n.`),
      ...wrong,
    ];
    return {
      hiddenState: { kind: "POWER_DIFFERENCE_DIVISOR", firstBase, secondBase, exponent, value, correctDivisor, divisorOptions: [correctDivisor, ...wrong.map((row) => BigInt(row.text))] },
      difficulty: "Hard",
      answerSemantic: "DIVISOR",
      stem: `Which option is guaranteed to divide ${firstBase}^${exponent} - ${secondBase}^${exponent}?`,
      answer: correctDivisor.toString(),
      options,
      explanation: {
        coreConcept: "For every positive integer n, a^n - b^n contains the factor a - b.",
        strategy: `Use the identity with a = ${firstBase} and b = ${secondBase}.`,
        steps: [`The base difference is ${firstBase} - ${secondBase} = ${correctDivisor}.`, `The expression factors as (${firstBase} - ${secondBase}) times an integer sum.`, `Therefore, ${correctDivisor} divides the expression.`],
        shortcut: "For a power difference, test the difference of the bases first.",
        verification: `Exact evaluation gives ${value}, and ${value} ÷ ${correctDivisor} = ${value / correctDivisor}.`,
        conclusion: `Therefore, ${correctDivisor} is the guaranteed divisor.`,
        traps: ["Do not automatically use the sum of the bases.", "The exponent itself is not generally a factor.", "Apply the identity to a difference of like powers."],
      },
      nodes: nodes(`Expression ${firstBase}^${exponent} - ${secondBase}^${exponent}.`, "Use a^n - b^n = (a-b)(...).", `a-b = ${correctDivisor}.`, `${value} is exactly divisible by ${correctDivisor}.`, `Answer ${correctDivisor}.`),
      fingerprint: `power-diff:${firstBase}:${secondBase}:${exponent}:${correctDivisor}:${wrong.map((row) => row.text).join(",")}`,
    };
  }
  throw new Error("Could not build guaranteed power-difference divisor state");
}

export function claimVerification(random: DeterministicRandom): Raw {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const number = BigInt(random.int(10_000, 9_999_999));
    const divisors = random.shuffle([...DIVISORS]).slice(0, 4);
    if (new Set(divisors.map(String)).size !== 4) continue;
    const correctClaimIndex = random.int(0, 3);
    const claims = divisors.map((divisor, index) => {
      const actuallyDivisible = number % divisor === 0n;
      const assertedDivisible = index === correctClaimIndex ? actuallyDivisible : !actuallyDivisible;
      return {
        text: `${number} is ${assertedDivisible ? "divisible" : "not divisible"} by ${divisor}.`,
        divisor,
        assertedDivisible,
        actuallyDivisible,
      };
    });
    const options = claims.map((claim) => {
      const remainder = number % claim.divisor;
      const truth = claim.assertedDivisible === claim.actuallyDivisible;
      return truth
        ? audit(claim.text, "CORRECT", `The remainder on division by ${claim.divisor} is ${remainder}, so this statement is true.`)
        : audit(claim.text, "FALSE_GENERALISATION", `The remainder on division by ${claim.divisor} is ${remainder}, so this statement is false.`);
    });
    if (options.filter((row) => row.misconceptionId === "CORRECT").length !== 1) continue;

    return {
      hiddenState: { kind: "DIVISIBILITY_CLAIM", number, claims, correctClaimIndex },
      difficulty: "Easy",
      answerSemantic: "TRUTH_CLAIM",
      stem: `Which of the following statements about ${number} is correct?`,
      answer: claims[correctClaimIndex]!.text,
      options,
      explanation: {
        coreConcept: "A divisibility claim is true exactly when its asserted remainder status matches exact division.",
        strategy: "Apply the appropriate divisibility rule or calculate the remainder for each statement.",
        steps: claims.map((claim) => `${number} mod ${claim.divisor} = ${number % claim.divisor}; therefore the statement “${claim.text}” is ${claim.assertedDivisible === claim.actuallyDivisible ? "true" : "false"}.`),
        shortcut: "Use specialised digit rules where available, but verify composite divisors completely.",
        verification: `Exactly one of the four asserted claims agrees with the exact remainders.`,
        conclusion: `Therefore, “${claims[correctClaimIndex]!.text}” is the correct statement.`,
        traps: ["A convenient last digit does not prove every divisibility claim.", "For a negative claim, a non-zero remainder makes the claim true.", "Check the complete composite-divisor condition."],
      },
      nodes: nodes(`Four claims about ${number}.`, "Compare each assertion with its exact remainder.", `Only claim ${correctClaimIndex + 1} matches.`, "All four divisors were tested.", claims[correctClaimIndex]!.text),
      fingerprint: `claim:${number}:${claims.map((claim) => `${claim.divisor}:${claim.assertedDivisible}`).join("|")}`,
    };
  }
  throw new Error("Could not build claim-verification state");
}
