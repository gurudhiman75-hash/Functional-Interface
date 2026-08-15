import { cp003Teacher } from "../../editorial/simple-teacher-voice-cp003";
import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";
import { getNumCp003PermanentAllocation } from "./allocation";
import type { NumCp003PermanentQlId } from "./allocation";
import {
  runNumCp003PermanentPipeline,
  type NumCp003PermanentQuestion,
  type NumCp003PermanentRuntimeInput,
} from "./runtime";
import { latexifyNumCp003LearnerText } from "./editorial-v2-math";

export const NUM_CP003_EDITORIAL_V2_RELEASE = Object.freeze({
  releaseId: "NUM-001-CP003-EN-EDITORIAL-V2-REVIEW",
  packageId: "NUM-001",
  cpId: "NUM-CP-003",
  language: "en",
  locale: "en-IN",
  status: "EDITORIAL_V2_CONTROLLED_REVIEW",
  permanentQlRange: "NUM-QL-001..NUM-QL-017",
  permanentQlCount: 17,
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const);

export interface NumCp003EditorialV2Explanation {
  readonly concept: string;
  readonly solution: readonly string[];
  readonly finalAnswer: string;
}

type ReplacedFields =
  | "stem"
  | "options"
  | "answer"
  | "explanation"
  | "reviewStatus"
  | "maturity"
  | "allocationStatus";

export type NumCp003EditorialV2Question = Omit<NumCp003PermanentQuestion, ReplacedFields> & {
  readonly stem: string;
  readonly options: readonly string[];
  readonly answer: string;
  readonly canonicalAnswer: string;
  readonly explanation: NumCp003EditorialV2Explanation;
  readonly editorialVersion: "NUM-CP-003-EDITORIAL-V2";
  readonly sourceReviewStatus: NumCp003PermanentQuestion["reviewStatus"];
  readonly reviewStatus: "EDITORIAL_V2_CONTROLLED_REVIEW";
  readonly maturity: "EDITORIAL_REVIEW";
  readonly allocationStatus: "EDITORIAL_V2_CONTROLLED_REVIEW";
};

function humaniseLearnerWording(value: string): string {
  return value
    .replace(/\bIn this question,?\s*/giu, "")
    .replace(/\bCompute or infer\b/giu, "Find")
    .replace(/\bExact testing leaves\b/giu, "Checking gives")
    .replace(/\badmissible domain\b/giu, "possible digit range")
    .replace(/\badmissible\b/giu, "possible")
    .replace(/\bcandidate[- ]set\b/giu, "possible values")
    .replace(/\bcardinality\b/giu, "number of values")
    .replace(/\bremainder status\b/giu, "remainder")
    .replace(/\btopology\b/giu, "pattern")
    .replace(/\buniversal guarantee\b/giu, "always-true result")
    .replace(
      /\$0\$ cannot be used because \$[^$]+\$ must remain a full number with the stated number of digits\./gu,
      "$0$ cannot be used because $X$ is the leading digit.",
    );
}

function cleanInline(value: unknown): string {
  return latexifyNumCp003LearnerText(
    humaniseLearnerWording(
      String(value ?? "")
        .replace(/\*\*/gu, "")
        .replace(/[ \t]+/gu, " ")
        .trim(),
    ),
  );
}

function cleanStem(value: unknown): string {
  return latexifyNumCp003LearnerText(
    humaniseLearnerWording(
      String(value ?? "")
        .replace(/\*\*/gu, "")
        .split("\n")
        .map((line) => line.replace(/[ \t]+/gu, " ").trimEnd())
        .join("\n")
        .trim(),
    ),
  );
}

function math(value: string): string {
  return `\\(${value}\\)`;
}

function setMath(values: readonly number[]): string {
  return math(`\\{${values.join(", ")}\\}`);
}

function pairSetMath(pairs: ReadonlyArray<readonly [number, number]>): string {
  if (pairs.length === 0) return math("\\varnothing");
  return math(`\\{${pairs.map(([x, y]) => `(${x}, ${y})`).join(", ")}\\}`);
}

function formatInteger(value: bigint | number): string {
  return typeof value === "bigint"
    ? value.toLocaleString("en-IN")
    : Math.trunc(value).toLocaleString("en-IN");
}

function fillSingleDigit(template: string, digit: number): string {
  return template.replaceAll("X", String(digit));
}

function fillLinkedPattern(pattern: string, a: number, b: number): string {
  return pattern.replaceAll("A", String(a)).replaceAll("B", String(b));
}

function singleCandidateSummary(
  state: Extract<NumCp003RetainedHiddenState, { kind: "SINGLE_DIGIT_CANDIDATE_SET" }>,
): string {
  const valid = state.validDigits;
  const validSet = setMath(valid);

  switch (state.projection) {
    case "UNIQUE_VALID_DIGIT":
      return `The only valid digit is ${math(`X = ${valid[0]}`)}.`;

    case "EXTREMUM_VALID_DIGIT": {
      const largest = state.extremumDirection === "LARGEST" || state.extremumDirection === "GREATEST";
      const answer = largest ? valid.at(-1) : valid[0];
      return `The valid digits are ${validSet}, so the ${largest ? "largest" : "smallest"} is ${math(`X = ${answer}`)}.`;
    }

    case "VALID_DIGIT_COUNT":
      return `The valid digits are ${validSet}, so the count is ${math(String(valid.length))}.`;

    case "VALID_DIGIT_SUM": {
      const total = valid.reduce((sum, digit) => sum + digit, 0);
      const working = valid.length > 0 ? `${valid.join(" + ")} = ${total}` : "0";
      return `The valid digits are ${validSet}; ${math(working)}.`;
    }

    case "COMPLETE_VALID_DIGIT_SET":
      return `Therefore, the complete valid digit set is ${validSet}.`;

    case "EXTREMUM_COMPLETED_NUMBER": {
      const values = valid.map((digit) => BigInt(fillSingleDigit(state.template, digit)));
      const greatest = state.extremumDirection === "GREATEST" || state.extremumDirection === "LARGEST";
      const answer = greatest ? values.at(-1)! : values[0]!;
      const rendered = values.map((value) => math(formatInteger(value))).join(", ");
      return `The valid completed numbers are ${rendered}; the ${greatest ? "greatest" : "smallest"} is ${math(formatInteger(answer))}.`;
    }

    default:
      return `The valid digits are ${validSet}.`;
  }
}

function orderedPairSummary(
  state: Extract<NumCp003RetainedHiddenState, { kind: "ORDERED_PAIR_CANDIDATE_SET" }>,
): string {
  const validSet = pairSetMath(state.validPairs);

  switch (state.projection) {
    case "UNIQUE_VALID_ORDERED_PAIR":
      return `The only valid ordered pair is ${pairSetMath([state.validPairs[0]!])}.`;

    case "VALID_ORDERED_PAIR_COUNT":
      return `The valid ordered pairs are ${validSet}, so the count is ${math(String(state.validPairs.length))}.`;

    case "COMPLETE_VALID_ORDERED_PAIR_SET":
      return `Therefore, the complete valid ordered-pair set is ${validSet}.`;

    case "PAIR_SOLUTION_CLASS": {
      const count = state.validPairs.length;
      if (count === 0) return "No ordered pair satisfies every condition, so there is no solution.";
      if (count === 1) return `The only valid ordered pair is ${validSet}, so there is exactly one solution.`;
      return `The valid ordered pairs are ${validSet}, so there are ${math(String(count))} solutions.`;
    }

    default:
      return `The valid ordered pairs are ${validSet}.`;
  }
}

function linkedArithmeticSolution(
  state: Extract<NumCp003RetainedHiddenState, { kind: "LINKED_ARITHMETIC_DIVISIBILITY" }>,
): readonly string[] {
  const validSet = pairSetMath(state.validPairs);
  const selected = state.validPairs.find(([a]) => a === state.answerDigit);
  if (!selected) throw new Error(`Missing linked-arithmetic answer pair for A=${state.answerDigit}`);
  const [a, b] = selected;
  const source = BigInt(fillLinkedPattern(state.sourcePattern, a, b));
  const result = BigInt(fillLinkedPattern(state.resultPattern, a, b));
  const divisor = state.divisor;
  const direction = state.direction === "LARGEST" ? "largest" : "smallest";
  const validA = state.validPairs.map(([value]) => value);

  return Object.freeze([
    cleanInline(`The valid ${math("(A, B)")} pairs are ${validSet}.`),
    cleanInline(
      `For ${math(`A = ${a}`)} and ${math(`B = ${b}`)}, ${math(`${formatInteger(source)} + ${formatInteger(state.addend)} = ${formatInteger(result)}`)}.`,
    ),
    cleanInline(
      `${math(`${formatInteger(result)} \\div ${formatInteger(divisor)} = ${formatInteger(result / divisor)}`)}, so the completed result is divisible by ${math(formatInteger(divisor))}.`,
    ),
    cleanInline(
      `The valid ${math("A")} values are ${setMath(validA)}, so the ${direction} is ${math(`A = ${state.answerDigit}`)}.`,
    ),
  ]);
}

function conceptFor(state: NumCp003RetainedHiddenState): string {
  switch (state.kind) {
    case "DIRECT_DIVISIBILITY":
      return "Use the quickest divisibility rule for each option; exact divisibility means the remainder is 0.";
    case "SINGLE_DIGIT_CANDIDATE_SET":
      return "The missing digit must satisfy every divisibility condition at the same time.";
    case "ORDERED_PAIR_CANDIDATE_SET":
      return "The ordered pair must satisfy every condition, and the positions of X and Y matter.";
    case "DIGIT_BOUND_MULTIPLE":
      return "Use the boundary remainder to reach the nearest required multiple.";
    case "ONE_DIVISOR_RANGE":
      return "Count multiples up to the upper limit, then subtract those before the lower limit.";
    case "IMPLICIT_REPEATED_NUMERAL":
      return "Form the repeated number first, then test the options with quick divisibility rules.";
    case "LINKED_ARITHMETIC_DIVISIBILITY":
      return "The digit pair must satisfy both the addition and the divisibility condition.";
    case "DATA_SUFFICIENCY":
      return "A statement is sufficient only if it determines one unique value of X.";
    case "CLAIM_VALIDATION":
      return "Check each claim using the divisibility rule for its divisor.";
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}

function removeFinalRestatement(lines: readonly string[]): string[] {
  return lines.filter((line) =>
    !/^(?:Therefore|So the correct choice|Only .* works, so that is the answer)/iu.test(line));
}

function uniqueLines(lines: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const line of lines) {
    const normalized = line.trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

function preferredWorkingWithResult(
  lines: readonly string[],
  preferred: readonly string[],
  result: string,
  excluded: RegExp,
): readonly string[] {
  const selected = uniqueLines(preferred.filter((line) => line !== result));
  for (const line of lines) {
    if (selected.length >= 1) break;
    if (line === result || excluded.test(line) || selected.includes(line)) continue;
    selected.push(line);
  }
  selected.push(result);
  return Object.freeze(uniqueLines(selected).slice(0, 4));
}

function compactSolution(
  state: NumCp003RetainedHiddenState,
  rawSteps: readonly unknown[],
): readonly string[] {
  const lines = uniqueLines(rawSteps.map(cleanInline));

  switch (state.kind) {
    case "DIRECT_DIVISIBILITY": {
      const checks = lines.filter((line) => /^Check\b/iu.test(line));
      return Object.freeze((checks.length > 0 ? checks : removeFinalRestatement(lines)).slice(0, 4));
    }

    case "SINGLE_DIGIT_CANDIDATE_SET": {
      const summary = cleanInline(singleCandidateSummary(state));
      const outcome = /^(?:Choose the|Count the valid|Only .* works|Therefore|The digits that satisfy|The completed numbers)/iu;
      const highValue = lines.filter((line) =>
        !outcome.test(line)
        && /cannot be used|digit-sum|last[- ]two|last[- ]three|alternating|gives|difference|\\div|\\times/iu.test(line));
      const secondary = lines.filter((line) =>
        !outcome.test(line)
        && /Split|last[- ]digit|rule for|divisib/iu.test(line));
      const preferred = uniqueLines([...highValue, ...secondary]).slice(0, 3);
      return preferredWorkingWithResult(lines, preferred, summary, outcome);
    }

    case "ORDERED_PAIR_CANDIDATE_SET": {
      const summary = cleanInline(orderedPairSummary(state));
      const outcome = /^(?:Only .* works|So the complete answer|Therefore|The valid ordered pairs|There are |The number of valid pairs)/iu;
      const highValue = lines.filter((line) =>
        !outcome.test(line)
        && /extra condition|digit-sum|last[- ]two|last[- ]three|alternating|gives|difference|\\div|\\times/iu.test(line));
      const secondary = lines.filter((line) =>
        !outcome.test(line)
        && /both the|last[- ]digit|rule for|divisib/iu.test(line));
      const preferred = uniqueLines([...highValue, ...secondary]).slice(0, 3);
      return preferredWorkingWithResult(lines, preferred, summary, outcome);
    }

    case "DIGIT_BOUND_MULTIPLE":
    case "ONE_DIVISOR_RANGE":
      return Object.freeze(removeFinalRestatement(lines).slice(0, 4));

    case "LINKED_ARITHMETIC_DIVISIBILITY":
      return linkedArithmeticSolution(state);

    case "IMPLICIT_REPEATED_NUMERAL": {
      const formation = lines.find((line) => /^Repeating\b/iu.test(line));
      const checks = lines.filter((line) => /^Check\b/iu.test(line));
      if (checks.length > 0) {
        const first = formation ? `${formation} ${checks[0]}` : checks[0]!;
        return Object.freeze([first, ...checks.slice(1, 4)].slice(0, 4));
      }
      return Object.freeze(removeFinalRestatement(lines).slice(0, 4));
    }

    case "DATA_SUFFICIENCY":
      return Object.freeze(lines.filter((line) => !/^Therefore/iu.test(line)).slice(0, 4));

    case "CLAIM_VALIDATION":
      return Object.freeze(lines.filter((line) => !/^Therefore/iu.test(line)).slice(0, 4));

    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}

function buildEditorialV2Question(source: NumCp003PermanentQuestion): NumCp003EditorialV2Question {
  const allocation = getNumCp003PermanentAllocation(source.permanentQlId);
  const row = {
    checkpoint: "NUM-CP-003",
    allocation,
    title: allocation.qlTemplateId,
    question: source,
  };
  const teacher = cp003Teacher(row);
  const options = Object.freeze(source.options.map((option) => cleanInline(option)));
  const correctIndex = source.correctIndex;
  const answer = options[correctIndex];
  if (!answer) {
    throw new Error(`${source.permanentQlId}/${source.seed}: missing correct option at index ${correctIndex}`);
  }

  const solution = compactSolution(source.hiddenState, teacher.steps);
  if (solution.length < 2 || solution.length > 4) {
    throw new Error(
      `${source.permanentQlId}/${source.seed}: Editorial V2 solution must contain 2-4 direct lines; received ${solution.length}`,
    );
  }

  const explanation = Object.freeze({
    concept: cleanInline(conceptFor(source.hiddenState)),
    solution,
    finalAnswer: answer,
  });

  return Object.freeze({
    ...source,
    stem: cleanStem(source.stem),
    options,
    answer,
    canonicalAnswer: answer,
    explanation,
    editorialVersion: "NUM-CP-003-EDITORIAL-V2" as const,
    sourceReviewStatus: source.reviewStatus,
    reviewStatus: "EDITORIAL_V2_CONTROLLED_REVIEW" as const,
    maturity: "EDITORIAL_REVIEW" as const,
    allocationStatus: "EDITORIAL_V2_CONTROLLED_REVIEW" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
}

export function runNumCp003EditorialV2(
  input: NumCp003PermanentRuntimeInput = {},
): NumCp003EditorialV2Question {
  return buildEditorialV2Question(runNumCp003PermanentPipeline(input));
}

export function runNumCp003EditorialV2ForQl(
  questionLanguageId: NumCp003PermanentQlId,
  seed: string,
): NumCp003EditorialV2Question {
  return runNumCp003EditorialV2({ questionLanguageId, seed, language: "en" });
}
