import {
  getClsCp003EnglishContract,
  type ClsCp003EnglishQlId,
} from "./cp003-english-contracts";
import { generateClsCp003DiscoveryQuestion } from "./discovery-runtime";
import type { GeneratedClsCp003Question } from "./types";

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function optionCountForSeed(qlId: ClsCp003EnglishQlId, seed: number): 4 | 5 {
  return hashText(`${qlId}:option-count:${seed}`) % 4 === 0 ? 5 : 4;
}

function simpleStem(question: GeneratedClsCp003Question): string {
  if (question.task === "RESOLVE_JUMBLES_AND_FIND_OUTLIER") {
    return "Unscramble each option. Which word belongs to a different group?";
  }
  switch (question.intendedRuleId) {
    case "WORD_LENGTH":
      return "Which word has a different number of letters?";
    case "VOWEL_COUNT":
      return "Which word has a different number of vowels?";
    case "REPEATED_LETTER_TOPOLOGY":
      return "Which word has a different repeated-letter pattern?";
    case "PALINDROME_STATUS":
      return "Which word behaves differently when read backwards?";
    case "BOUNDARY_LETTER_CLASS":
      return "Which word has a different first-and-last letter pattern?";
    case "PRIMARY_AFFIX":
      return "Which word has a different beginning or ending?";
    default:
      return "Which word is different from the others?";
  }
}

function simpleShortcut(question: GeneratedClsCp003Question): string {
  if (question.task === "RESOLVE_JUMBLES_AND_FIND_OUTLIER") {
    return "Solve the easiest jumble first and name its group. Then solve the others and find the word outside that group.";
  }
  switch (question.intendedRuleId) {
    case "WORD_LENGTH":
      return "Count the letters in each word. Choose the word with a different count.";
    case "VOWEL_COUNT":
      return "Count A, E, I, O and U in each word. Choose the word with a different count.";
    case "REPEATED_LETTER_TOPOLOGY":
      return "Mark the repeated letters in each word. Choose the word with a different repeat pattern.";
    case "PALINDROME_STATUS":
      return "Read each word from both ends. Choose the one that behaves differently.";
    case "BOUNDARY_LETTER_CLASS":
      return "Look only at the first and last letters. Mark each as a vowel or consonant, then compare.";
    case "PRIMARY_AFFIX":
      return "Underline the common beginning or ending. Choose the word that does not have it.";
    default:
      return "Compare the letters in each word and choose the one with a different pattern.";
  }
}

export function generateClsCp003EnglishQuestion(
  qlId: ClsCp003EnglishQlId,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }
  const contract = getClsCp003EnglishContract(qlId);
  const prototypeIndex = hashText(`${qlId}:prototype:${seed}`) % contract.allowedPrototypeIds.length;
  const sourcePrototypeId = contract.allowedPrototypeIds[prototypeIndex]!;
  const optionCount = requestedOptionCount ?? optionCountForSeed(qlId, seed);
  const source = generateClsCp003DiscoveryQuestion(sourcePrototypeId, seed, optionCount);
  if (source.task !== contract.task) {
    throw new Error(`${qlId}/${seed} generated task ${source.task}, expected ${contract.task}`);
  }
  return {
    ...source,
    stem: simpleStem(source),
    explanation: {
      ...source.explanation,
      examSpeedShortcut: [simpleShortcut(source)],
    },
    qlId,
    permanentQlId: qlId,
    reviewOnly: true as const,
    questionStudioVisible: false as const,
    metadata: {
      ...source.metadata,
      runtimeVersion: "cls-cp003-english-runtime-v2" as const,
      sourcePrototypeId,
      solveContractId: contract.solveContractId,
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

export type GeneratedClsCp003EnglishQuestion = ReturnType<typeof generateClsCp003EnglishQuestion>;
