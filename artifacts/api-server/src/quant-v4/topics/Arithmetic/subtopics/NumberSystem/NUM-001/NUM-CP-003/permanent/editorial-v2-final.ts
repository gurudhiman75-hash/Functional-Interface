import type { NumCp003PermanentQlId } from "./allocation";
import { buildNumCp003FinalQuestionSpecificConcept } from "./editorial-v2-concept-final";
import {
  NUM_CP003_EDITORIAL_V2_RELEASE,
  runNumCp003EditorialV2,
  type NumCp003EditorialV2Question,
} from "./editorial-v2";
import { buildNumCp003FinalTeachingSolution } from "./editorial-v2-teaching-solution-final";
import type { NumCp003PermanentRuntimeInput } from "./runtime";

export { NUM_CP003_EDITORIAL_V2_RELEASE };
export type { NumCp003EditorialV2Question };

function math(value: string | number | bigint): string {
  return `\\(${String(value)}\\)`;
}

function formatInteger(value: bigint | number): string {
  return typeof value === "bigint"
    ? value.toLocaleString("en-IN")
    : Math.trunc(value).toLocaleString("en-IN");
}

function fillSingleDigit(template: string, digit: number): bigint {
  return BigInt(template.replaceAll("X", String(digit)));
}

function strengthenUniqueMissingDigitVerification(
  question: NumCp003EditorialV2Question,
  solution: readonly string[],
): readonly string[] {
  const state = question.hiddenState;
  if (state.kind !== "SINGLE_DIGIT_CANDIDATE_SET" || state.projection !== "UNIQUE_VALID_DIGIT") {
    return solution;
  }
  const digit = state.validDigits[0];
  if (digit === undefined) return solution;

  const completed = fillSingleDigit(state.template, digit);
  const exactChecks = state.divisors.map((divisor) =>
    math(`${formatInteger(completed)} \\div ${formatInteger(divisor)} = ${formatInteger(completed / divisor)}`));
  const verification = exactChecks.length === 1
    ? `${exactChecks[0]} is exact`
    : `${exactChecks.join(" and ")} are exact`;

  const finalLine = `Checking the allowed digits leaves only ${math(`X = ${digit}`)}. Substituting it gives ${math(formatInteger(completed))}; ${verification}, so the completed number satisfies every required divisibility condition.`;
  return Object.freeze([...solution.slice(0, -1), finalLine]);
}

function refineQuestion(question: NumCp003EditorialV2Question): NumCp003EditorialV2Question {
  const solution = strengthenUniqueMissingDigitVerification(
    question,
    buildNumCp003FinalTeachingSolution(question.hiddenState),
  );
  if (solution.length < 2 || solution.length > 4) {
    throw new Error(`${question.permanentQlId}/${question.seed}: final V2 solution must contain 2-4 lines`);
  }

  const concept = buildNumCp003FinalQuestionSpecificConcept(question.hiddenState);
  if (!concept.startsWith("This question tests ")) {
    throw new Error(`${question.permanentQlId}/${question.seed}: concept does not identify the tested skill`);
  }

  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      concept,
      solution,
    }),
  });
}

export function runNumCp003EditorialV2Final(
  input: NumCp003PermanentRuntimeInput = {},
): NumCp003EditorialV2Question {
  return refineQuestion(runNumCp003EditorialV2(input));
}

export function runNumCp003EditorialV2FinalForQl(
  questionLanguageId: NumCp003PermanentQlId,
  seed: string,
): NumCp003EditorialV2Question {
  return runNumCp003EditorialV2Final({ questionLanguageId, seed, language: "en" });
}
