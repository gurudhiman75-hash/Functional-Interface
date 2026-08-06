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

function chooseStem(templates: readonly string[], seed: number, salt: string): string {
  return templates[hashText(`${salt}:${seed}`) % templates.length]!;
}

function simpleStem(question: GeneratedClsCp003Question, seed: number): string {
  if (question.task === "RESOLVE_JUMBLES_AND_FIND_OUTLIER") {
    return chooseStem([
      "Unscramble each option. Which word belongs to a different group?",
      "Rearrange the letters to form words. Which word is different from the others?",
      "Form a word from each jumble. Which word comes from a different group?",
      "Solve the jumbled words and find the one that does not belong with the others.",
    ], seed, "jumbled-word");
  }

  switch (question.intendedRuleId) {
    case "WORD_LENGTH":
      return chooseStem([
        "Which word has a different number of letters?",
        "Choose the word whose length is different from the others.",
        "Find the word that does not have the same letter count.",
        "Which word is different in length?",
      ], seed, "word-length");
    case "VOWEL_COUNT":
      return chooseStem([
        "Which word has a different number of vowels?",
        "Choose the word with a different vowel count.",
        "Find the word that does not have the same number of vowels.",
        "Which word is different when its vowels are counted?",
      ], seed, "vowel-count");
    case "REPEATED_LETTER_TOPOLOGY":
      return chooseStem([
        "Which word has a different repeated-letter pattern?",
        "Choose the word whose letters repeat differently.",
        "Find the word that does not follow the same repeat pattern.",
        "In which word is the letter-repeat pattern different?",
      ], seed, "repeat-pattern");
    case "PALINDROME_STATUS":
      return chooseStem([
        "Which word behaves differently when read backwards?",
        "Read the words backwards. Which one is different?",
        "Choose the word that does not follow the same backward-reading pattern.",
        "Which word is different when read from right to left?",
      ], seed, "palindrome");
    case "BOUNDARY_LETTER_CLASS":
      return chooseStem([
        "Which word has a different first-and-last letter pattern?",
        "Compare the first and last letters. Which word is different?",
        "Choose the word whose starting and ending letters follow a different pattern.",
        "Which word does not match the others at its two ends?",
      ], seed, "boundary-letters");
    case "PRIMARY_AFFIX":
      return chooseStem([
        "Which word has a different beginning or ending?",
        "Choose the word that does not share the same beginning or ending.",
        "Find the word with a different prefix or suffix pattern.",
        "Which word does not match the common beginning or ending?",
      ], seed, "affix");
    default:
      return chooseStem([
        "Which word is different from the others?",
        "Choose the word that does not fit with the rest.",
        "Find the word with a different letter pattern.",
        "Which word does not belong with the others?",
      ], seed, "word-default");
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
    stem: simpleStem(source, seed),
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
