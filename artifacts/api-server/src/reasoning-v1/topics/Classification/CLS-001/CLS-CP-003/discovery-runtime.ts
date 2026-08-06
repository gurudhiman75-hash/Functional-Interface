import {
  analyzeClsCp003Word,
  auditClsCp003DisplayedWords,
  generateClsCp003Prototype as generateSourcePrototype,
} from "./runtime";
import { CLS_CP003_WORDS } from "./word-dataset.en";
import type {
  ClsCp003BoundaryClass,
  ClsCp003PrototypeId,
  ClsCp003RepeatedTopology,
  ClsCp003RuleId,
  GeneratedClsCp003Question,
} from "./types";

const SOURCE_SEED_STRIDE = 128;
const MAX_EDITORIAL_ATTEMPTS = SOURCE_SEED_STRIDE;
const WORD_BY_NORMALIZED = new Map(
  CLS_CP003_WORDS.map((entry) => [entry.word.toLocaleLowerCase("en-IN"), entry]),
);

function topologyText(value: ClsCp003RepeatedTopology): string {
  switch (value) {
    case "ALL_UNIQUE":
      return "all its letters are different";
    case "ONE_REPEATED_LETTER":
      return "exactly one letter repeats";
    case "MULTIPLE_REPEATED_LETTERS":
      return "more than one letter repeats";
    case "TRIPLE_OR_MORE":
      return "one letter occurs at least three times";
  }
}

function boundaryText(value: ClsCp003BoundaryClass): string {
  switch (value) {
    case "VOWEL_VOWEL":
      return "starts and ends with a vowel";
    case "VOWEL_CONSONANT":
      return "starts with a vowel and ends with a consonant";
    case "CONSONANT_VOWEL":
      return "starts with a consonant and ends with a vowel";
    case "CONSONANT_CONSONANT":
      return "starts and ends with a consonant";
  }
}

function affixText(value: string): string {
  const labels: Readonly<Record<string, string>> = {
    PREFIX_UN: "the prefix un-",
    PREFIX_RE: "the prefix re-",
    PREFIX_DIS: "the prefix dis-",
    PREFIX_PRE: "the prefix pre-",
    PREFIX_MIS: "the prefix mis-",
    SUFFIX_FUL: "the suffix -ful",
    SUFFIX_LESS: "the suffix -less",
    SUFFIX_NESS: "the suffix -ness",
    SUFFIX_MENT: "the suffix -ment",
    SUFFIX_TION: "the suffix -tion",
    SUFFIX_ABLE: "the suffix -able",
  };
  return labels[value] ?? value;
}

function exactOddReason(question: GeneratedClsCp003Question): string {
  const odd = question.answer;
  const canonical = question.canonicalWords[question.correctIndex]!.toLocaleLowerCase("en-IN");
  const governed = WORD_BY_NORMALIZED.get(canonical);
  const features = analyzeClsCp003Word(canonical, governed?.primaryAffix ?? "NONE");
  const ruleId = question.intendedRuleId as ClsCp003RuleId;
  switch (ruleId) {
    case "WORD_LENGTH":
      return `${odd} has ${features.length} letters, so its length is different.`;
    case "VOWEL_COUNT":
      return `${odd} has ${features.vowelCount} vowel${features.vowelCount === 1 ? "" : "s"}, so its vowel count is different.`;
    case "REPEATED_LETTER_TOPOLOGY":
      return `${odd} has a different repetition pattern: ${topologyText(features.repeatedTopology)}.`;
    case "PALINDROME_STATUS":
      return features.palindrome
        ? `${odd} reads the same forwards and backwards, unlike the other words.`
        : `${odd} does not read the same forwards and backwards.`;
    case "BOUNDARY_LETTER_CLASS":
      return `${odd} ${boundaryText(features.boundaryClass)}, so its first-and-last letter class is different.`;
    case "PRIMARY_AFFIX":
      return `${odd} does not contain ${affixText(question.intendedRuleValue)}.`;
  }
}

function polishDirectExplanation(question: GeneratedClsCp003Question): GeneratedClsCp003Question {
  if (question.task !== "FIND_WORD_STRUCTURE_OUTLIER") return question;
  return {
    ...question,
    explanation: {
      ...question.explanation,
      stepByStep: [
        question.explanation.stepByStep[0]!,
        exactOddReason(question),
        question.explanation.stepByStep[2]!,
      ],
    },
  };
}

function maximumExternalSeed(): number {
  return Math.floor((Number.MAX_SAFE_INTEGER - (SOURCE_SEED_STRIDE - 1)) / SOURCE_SEED_STRIDE);
}

export function generateClsCp003DiscoveryQuestion(
  prototypeId: ClsCp003PrototypeId,
  seed = 0,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp003Question {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > maximumExternalSeed()) {
    throw new Error(`Seed must be a supported non-negative safe integer: ${seed}`);
  }

  if (prototypeId !== "CLS-CP003-PROT-007") {
    return polishDirectExplanation(generateSourcePrototype(prototypeId, seed, optionCount));
  }

  const base = seed * SOURCE_SEED_STRIDE;
  for (let attempt = 0; attempt < MAX_EDITORIAL_ATTEMPTS; attempt += 1) {
    const sourceSeed = base + attempt;
    const candidate = generateSourcePrototype(prototypeId, sourceSeed, optionCount);
    const visibleStructure = auditClsCp003DisplayedWords(candidate.options);
    if (visibleStructure.result !== "NO_VALID_RULE") continue;
    return {
      ...candidate,
      seed,
      ambiguityAudit: {
        ...candidate.ambiguityAudit,
        candidateSupports: [],
        reason: "Every jumble resolves uniquely, one resolved word differs by class, and no visible structural shortcut identifies an outlier.",
      },
      difficultyFeatures: {
        ...candidate.difficultyFeatures,
        candidateRuleCount: 0,
      },
    };
  }

  throw new Error(`${prototypeId}/${seed}/${optionCount} did not produce a shortcut-free jumbled state`);
}