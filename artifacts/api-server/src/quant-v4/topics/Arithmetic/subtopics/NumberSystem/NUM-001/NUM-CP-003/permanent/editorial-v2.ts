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

function cleanInline(value: unknown): string {
  return latexifyNumCp003LearnerText(
    String(value ?? "")
      .replace(/\*\*/gu, "")
      .replace(/[ \t]+/gu, " ")
      .trim(),
  );
}

function cleanStem(value: unknown): string {
  return latexifyNumCp003LearnerText(
    String(value ?? "")
      .replace(/\*\*/gu, "")
      .split("\n")
      .map((line) => line.replace(/[ \t]+/gu, " ").trimEnd())
      .join("\n")
      .trim(),
  );
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

function lastMatching(lines: readonly string[], pattern: RegExp): string | undefined {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (pattern.test(lines[index]!)) return lines[index];
  }
  return undefined;
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
      const result = lastMatching(lines, /digits that satisfy|valid digits|completed numbers|complete set|required sum|required count/iu);
      const calculations = lines.filter((line) =>
        line !== result
        && !/^(?:Choose the|Count the valid|Only .* works|Therefore)/iu.test(line)
        && /divisib|digit sum|last digit|last two|last three|alternating|Split|cannot be used|\\div|\\times/iu.test(line));
      const selected = calculations.slice(0, result ? 3 : 4);
      if (result) selected.push(result);
      return Object.freeze(uniqueLines(selected).slice(0, 4));
    }

    case "ORDERED_PAIR_CANDIDATE_SET": {
      const result = lastMatching(lines, /valid ordered pairs|number of valid pairs|complete answer|There are .* valid ordered pairs/iu);
      const calculations = lines.filter((line) =>
        line !== result
        && !/^(?:Only .* works|So the complete answer|Therefore)/iu.test(line)
        && /X \+ Y|divisib|digit sum|last two|last three|alternating|both the|\\div|\\times/iu.test(line));
      const selected = calculations.slice(0, result ? 3 : 4);
      if (result) selected.push(result);
      return Object.freeze(uniqueLines(selected).slice(0, 4));
    }

    case "DIGIT_BOUND_MULTIPLE":
    case "ONE_DIVISOR_RANGE":
    case "LINKED_ARITHMETIC_DIVISIBILITY":
      return Object.freeze(removeFinalRestatement(lines).slice(0, 4));

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
