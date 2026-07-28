import { createRandom, type DeterministicRandom } from "../../foundation/prng";
import { generateClaimAuthority } from "./authority-claim";
import { generateDataSufficiencyAuthority } from "./authority-data-sufficiency";
import { generateDirectBoundaryRangeRepeatedAuthority } from "./authority-direct-boundary-range-repeated";
import { generateLinkedAuthority } from "./authority-linked";
import { generatePairAuthority } from "./authority-pair";
import { generateSingleDigitAuthority } from "./authority-single-digit";
import {
  completeSingleDigitNumber,
  countMultiplesInclusive,
  digitSetText,
  enumerateOrderedPairs,
  enumerateSingleDigits,
  greatestMultipleAtOrBelow,
  lastNDigitBoundary,
  leastMultipleAtOrAbove,
  pairSetText,
  pairText,
  shuffleOptions,
} from "./runtime-core";
import type {
  NumCp003RawRetainedQuestion,
  NumCp003RetainedHiddenState,
  NumCp003RetainedQuestion,
  NumCp003RetainedTemplateLabel,
} from "./runtime-types";
import { NUM_CP003_RETAINED_TEMPLATE_REGISTRY } from "./template-registry";

export const NUM_CP003_RETAINED_TEMPLATE_LABELS = NUM_CP003_RETAINED_TEMPLATE_REGISTRY.map(
  (entry) => entry.temporaryTemplateLabel,
) as NumCp003RetainedTemplateLabel[];

function rawFor(label: NumCp003RetainedTemplateLabel, random: DeterministicRandom): NumCp003RawRetainedQuestion {
  if ([
    "NUM-CP003-QLT2-02",
    "NUM-CP003-QLT2-03",
    "NUM-CP003-QLT2-04",
    "NUM-CP003-QLT2-05",
    "NUM-CP003-QLT2-06",
    "NUM-CP003-QLT2-07",
  ].includes(label)) return generateSingleDigitAuthority(label, random);

  if ([
    "NUM-CP003-QLT2-08",
    "NUM-CP003-QLT2-09",
    "NUM-CP003-QLT2-10",
    "NUM-CP003-QLT2-11",
  ].includes(label)) return generatePairAuthority(label, random);

  if ([
    "NUM-CP003-QLT2-01",
    "NUM-CP003-QLT2-12",
    "NUM-CP003-QLT2-13",
    "NUM-CP003-QLT2-14",
  ].includes(label)) return generateDirectBoundaryRangeRepeatedAuthority(label, random);

  if (label === "NUM-CP003-QLT2-15") return generateLinkedAuthority(random);
  if (label === "NUM-CP003-QLT2-16") return generateDataSufficiencyAuthority(random);
  if (label === "NUM-CP003-QLT2-17") return generateClaimAuthority(random);
  throw new Error(`Unsupported retained template ${label}`);
}

function classifySufficiency(
  first: readonly number[],
  second: readonly number[],
): "I_ALONE" | "II_ALONE" | "EACH_ALONE" | "BOTH_TOGETHER" | "INSUFFICIENT" {
  const secondSet = new Set(second);
  const together = first.filter((value) => secondSet.has(value));
  if (first.length === 1 && second.length === 1 && first[0] === second[0]) return "EACH_ALONE";
  if (first.length === 1 && second.length !== 1) return "I_ALONE";
  if (second.length === 1 && first.length !== 1) return "II_ALONE";
  if (first.length > 1 && second.length > 1 && together.length === 1) return "BOTH_TOGETHER";
  return "INSUFFICIENT";
}

function sufficiencyAnswer(value: "I_ALONE" | "II_ALONE" | "EACH_ALONE" | "BOTH_TOGETHER" | "INSUFFICIENT"): string {
  switch (value) {
    case "I_ALONE": return "Statement I alone is sufficient, but Statement II alone is not sufficient.";
    case "II_ALONE": return "Statement II alone is sufficient, but Statement I alone is not sufficient.";
    case "EACH_ALONE": return "Each statement alone is sufficient.";
    case "BOTH_TOGETHER": return "Both statements together are sufficient, but neither alone is sufficient.";
    case "INSUFFICIENT": return "Even both statements together are not sufficient.";
  }
}

function parseDigitPattern(pattern: string, variable: "A" | "B", digit: number): bigint {
  const replaced = pattern.replace(variable, String(digit));
  if (!/^\d+$/u.test(replaced)) throw new Error(`Invalid digit pattern ${pattern}`);
  return BigInt(replaced);
}

function claimTruth(text: string, number: bigint, divisor: bigint): boolean {
  const assertsNotDivisible = text.includes("not divisible");
  const assertsDivisible = text.includes(" is divisible ");
  if (!assertsNotDivisible && !assertsDivisible) throw new Error(`Unparseable claim: ${text}`);
  const actualDivisible = number % divisor === 0n;
  return assertsNotDivisible ? !actualDivisible : actualDivisible;
}

export function verifyRetainedAnswer(state: NumCp003RetainedHiddenState): string {
  switch (state.kind) {
    case "DIRECT_DIVISIBILITY": {
      const matching = state.divisorOptions.filter((divisor) => {
        const divisible = state.number % divisor === 0n;
        return state.requestedPolarity === "DIVISIBLE" ? divisible : !divisible;
      });
      if (matching.length !== 1) throw new Error(`Direct state has ${matching.length} matching options`);
      return matching[0]!.toString();
    }

    case "SINGLE_DIGIT_CANDIDATE_SET": {
      const valid = enumerateSingleDigits(state.template, state.divisors);
      if (state.projection === "UNIQUE_VALID_DIGIT") {
        if (valid.length !== 1) throw new Error("Unique-digit state is not unique");
        return String(valid[0]);
      }
      if (state.projection === "EXTREMUM_VALID_DIGIT") {
        if (valid.length < 2) throw new Error("Extremum digit state lacks multiple candidates");
        return String(state.extremumDirection === "LARGEST" ? valid[valid.length - 1] : valid[0]);
      }
      if (state.projection === "VALID_DIGIT_COUNT") return String(valid.length);
      if (state.projection === "VALID_DIGIT_SUM") return String(valid.reduce((sum, digit) => sum + digit, 0));
      if (state.projection === "COMPLETE_VALID_DIGIT_SET") return digitSetText(valid);
      if (state.projection === "EXTREMUM_COMPLETED_NUMBER") {
        if (valid.length < 2) throw new Error("Completed-number extremum lacks multiple candidates");
        const digit = state.extremumDirection === "GREATEST" ? valid[valid.length - 1]! : valid[0]!;
        return completeSingleDigitNumber(state.template, digit).toString();
      }
      throw new Error(`Unknown single-digit projection ${state.projection}`);
    }

    case "ORDERED_PAIR_CANDIDATE_SET": {
      const valid = enumerateOrderedPairs(state.template, state.divisors, state.relation);
      if (state.projection === "UNIQUE_VALID_ORDERED_PAIR") {
        if (valid.length !== 1) throw new Error("Unique-pair state is not unique");
        return pairText(valid[0]!);
      }
      if (state.projection === "VALID_ORDERED_PAIR_COUNT") return String(valid.length);
      if (state.projection === "COMPLETE_VALID_ORDERED_PAIR_SET") return pairSetText(valid);
      if (state.projection === "PAIR_SOLUTION_CLASS") {
        if (valid.length === 0) return "No solution";
        if (valid.length === 1) return "Exactly one solution";
        return "More than one solution";
      }
      throw new Error(`Unknown pair projection ${state.projection}`);
    }

    case "DIGIT_BOUND_MULTIPLE": {
      const lower = 10n ** BigInt(state.digits - 1);
      const upper = lastNDigitBoundary(state.digits);
      const answer = state.direction === "LEAST"
        ? leastMultipleAtOrAbove(lower, state.divisor)
        : greatestMultipleAtOrBelow(upper, state.divisor);
      return answer.toString();
    }

    case "ONE_DIVISOR_RANGE":
      return countMultiplesInclusive(state.lower, state.upper, state.divisor).toString();

    case "IMPLICIT_REPEATED_NUMERAL": {
      const matching = state.divisorOptions.filter((divisor) => state.number % divisor === 0n);
      if (matching.length !== 1) throw new Error(`Repeated-numeral state has ${matching.length} matching divisors`);
      return matching[0]!.toString();
    }

    case "LINKED_ARITHMETIC_DIVISIBILITY": {
      const arithmeticPairs: Array<[number, number]> = [];
      const validPairs: Array<[number, number]> = [];
      for (let first = 0; first <= 9; first += 1) {
        for (let second = 0; second <= 9; second += 1) {
          const source = parseDigitPattern(state.sourcePattern, "A", first);
          const result = parseDigitPattern(state.resultPattern, "B", second);
          if (state.addend + source !== result) continue;
          arithmeticPairs.push([first, second]);
          if (result % state.divisor === 0n) validPairs.push([first, second]);
        }
      }
      if (arithmeticPairs.length <= validPairs.length || validPairs.length < 2) {
        throw new Error("Linked state fails material-divisibility invariant");
      }
      const digits = [...new Set(validPairs.map((pair) => pair[0]))].sort((left, right) => left - right);
      if (digits.length < 2) throw new Error("Linked state lacks an extremum choice");
      return String(state.direction === "LARGEST" ? digits[digits.length - 1] : digits[0]);
    }

    case "DATA_SUFFICIENCY":
      return sufficiencyAnswer(classifySufficiency(state.candidatesI, state.candidatesII));

    case "CLAIM_VALIDATION": {
      const matching = state.claims.filter((claim) => {
        const truth = claimTruth(claim.text, claim.number, claim.divisor);
        if (truth !== claim.isTrue) throw new Error(`Stored claim truth mismatch: ${claim.text}`);
        return state.requestedPolarity === "CORRECT" ? truth : !truth;
      });
      if (matching.length !== 1) throw new Error(`Claim state has ${matching.length} matching assertions`);
      return matching[0]!.text;
    }
  }
}

export function generateNumCp003RetainedQuestion(
  label: NumCp003RetainedTemplateLabel,
  seed: string,
): NumCp003RetainedQuestion {
  if (!NUM_CP003_RETAINED_TEMPLATE_LABELS.includes(label)) throw new Error(`Unknown retained template ${label}`);
  const random = createRandom(`${label}:${seed}`);
  const raw = rawFor(label, random);
  const stem = raw.stem.endsWith("?") ? raw.stem : `${raw.stem.replace(/[.]+$/u, "")}?`;
  const shuffled = shuffleOptions(random, raw.optionAudit);
  const verifierAnswer = verifyRetainedAnswer(raw.hiddenState);
  const expectedOptionCount = label === "NUM-CP003-QLT2-16" ? 5 : 4;
  const errors: string[] = [];

  if (verifierAnswer !== raw.answer) errors.push(`Verifier ${verifierAnswer} != answer ${raw.answer}`);
  if (shuffled.rows.length !== expectedOptionCount) errors.push(`Expected ${expectedOptionCount} options`);
  if (new Set(shuffled.rows.map((row) => row.text)).size !== expectedOptionCount) errors.push("Options are not unique");
  if (shuffled.rows.filter((row) => row.misconceptionId === "CORRECT").length !== 1) errors.push("Expected one CORRECT option label");
  if (shuffled.rows[shuffled.correctIndex]?.text !== raw.answer) errors.push("Correct-index answer mismatch");
  if (!stem.endsWith("?")) errors.push("Stem is not interrogative");
  if (raw.explanation.steps.length < 3) errors.push("Explanation has fewer than three steps");
  if (raw.explanation.traps.length !== 3) errors.push("Explanation must contain three traps");
  if (raw.optionAudit.some((row) => row.diagnostic.trim().length < 16)) errors.push("Option diagnostic is too short");
  if (!raw.reasoningNodes.some((node) => node.kind === "VERIFICATION")) errors.push("Reasoning graph lacks verification");

  return {
    canonicalProblemId: "NUM-CP-003",
    temporaryTemplateLabel: label,
    permanentQlId: null,
    seed,
    difficulty: raw.difficulty,
    answerSemantic: raw.answerSemantic,
    stem,
    answer: raw.answer,
    options: shuffled.rows.map((row) => row.text),
    correctIndex: shuffled.correctIndex,
    optionAudit: shuffled.rows,
    hiddenState: raw.hiddenState,
    explanation: raw.explanation,
    reasoningGraph: { nodes: raw.reasoningNodes },
    fingerprint: raw.fingerprint,
    validation: { ok: errors.length === 0, errors, verifierAnswer },
    reviewStatus: "UNREVIEWED_RETAINED_CANDIDATE",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
