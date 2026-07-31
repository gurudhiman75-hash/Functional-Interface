import {
  CLS_CP004_ENGLISH_CONTRACT,
  CLS_CP004_ENGLISH_QL_ID,
  type ClsCp004EnglishQlId,
} from "./cp004-english-contract";
import { generateClsCp004DiscoveryQuestion } from "./discovery-runtime";
import { clsCp004DivisorForRule } from "./number-domain";
import type { GeneratedClsCp004Question } from "./types";

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function optionCountForSeed(seed: number): 4 | 5 {
  return hashText(`${CLS_CP004_ENGLISH_QL_ID}:option-count:${seed}`) % 4 === 0 ? 5 : 4;
}

function simpleStem(seed: number): string {
  const templates = [
    "Which number is different from the others?",
    "Choose the number that does not fit with the others.",
    "Find the number that is different from the rest.",
    "Which number does not follow the same rule as the others?",
    "Select the number that does not belong with the rest.",
  ] as const;
  return templates[hashText(`number-stem:${seed}`) % templates.length]!;
}

function simpleShortcut(question: GeneratedClsCp004Question): string {
  const divisor = clsCp004DivisorForRule(question.intendedRuleId);
  if (divisor !== null) {
    return `Use the quick divisibility rule for ${divisor} instead of long division.`;
  }
  switch (question.intendedRuleId) {
    case "DIGIT_COUNT":
      return "Count the digits in each number and write the count beside it.";
    case "PARITY":
      return "Check the last digit only. 0, 2, 4, 6 and 8 mean the number is even.";
    case "PRIMALITY_CLASS":
      return "Try small prime divisors up to the square root. If none divides exactly, the number is prime.";
    case "PERFECT_SQUARE_STATUS":
      return "Compare the options with familiar squares such as 4, 9, 16, 25, 36 and 49.";
    case "PERFECT_CUBE_STATUS":
      return "Compare the options with familiar cubes such as 8, 27, 64, 125 and 216.";
    case "DIVISOR_COUNT":
      return "Write the factor pairs of each number. Count both numbers in every pair.";
    case "DIGIT_PARITY_COMPOSITION":
      return "Mark every digit as odd or even, then compare the patterns.";
    case "DIGIT_SUM":
      return "Add the digits of each number and write the total beside it.";
    case "DIGIT_PRODUCT":
      return "Multiply the digits of each number and write the result beside it.";
    case "PALINDROME_STATUS":
      return "Reverse each number. A palindrome stays exactly the same.";
    case "NEAR_POWER_CLASS":
      return "Find the nearest square or cube. Check whether the number is one more or one less.";
    case "TRIANGULAR_STATUS":
      return "Write the running totals 1, 3, 6, 10, 15, 21 and so on. A matching number is triangular.";
    default:
      return "Work out the same number fact for every option, write it down, and choose the different result.";
  }
}

export function generateClsCp004EnglishQuestion(
  qlId: ClsCp004EnglishQlId = CLS_CP004_ENGLISH_QL_ID,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  if (qlId !== CLS_CP004_ENGLISH_QL_ID) throw new Error(`Unknown CLS-CP-004 English QL: ${qlId}`);
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }
  const prototypeCount = CLS_CP004_ENGLISH_CONTRACT.allowedPrototypeIds.length;
  const prototypeIndex = seed % prototypeCount;
  const sourcePrototypeId = CLS_CP004_ENGLISH_CONTRACT.allowedPrototypeIds[prototypeIndex]!;
  const sourceSeed = Math.floor(seed / prototypeCount);
  const optionCount = requestedOptionCount ?? optionCountForSeed(seed);
  const source = generateClsCp004DiscoveryQuestion(sourcePrototypeId, sourceSeed, optionCount);
  return {
    ...source,
    stem: simpleStem(seed),
    explanation: {
      ...source.explanation,
      examSpeedShortcut: [simpleShortcut(source)],
    },
    seed,
    qlId,
    permanentQlId: qlId,
    reviewOnly: true as const,
    questionStudioVisible: false as const,
    metadata: {
      ...source.metadata,
      runtimeVersion: "cls-cp004-english-runtime-v2" as const,
      sourcePrototypeId,
      sourcePrototypeSeed: sourceSeed,
      solveContractId: CLS_CP004_ENGLISH_CONTRACT.solveContractId,
      sourceSaturationStatus: "ENGLISH_SOURCE_SATURATED" as const,
    },
    lifecycle: {
      permanentQlId: qlId,
      reviewStatus: "FROZEN_ENGLISH_RUNTIME_PROOF" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      questionStudioDiscoverable: false as const,
    },
  };
}

export type GeneratedClsCp004EnglishQuestion = ReturnType<typeof generateClsCp004EnglishQuestion>;
