/**
 * CP005 Question Families:
 * CP005-F01: Adjective Classification & Degrees (ਵਿਸ਼ੇਸ਼ਣ ਸ਼੍ਰੇਣੀ ਵੰਡ ਅਤੇ ਅਵਸਥਾਵਾਂ)
 * CP005-F02: Adverb Classification & Extraction (ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਸ਼੍ਰੇਣੀ ਵੰਡ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  ADJECTIVE_CATEGORIES,
  ADVERB_CATEGORIES,
  DEGREE_ITEMS,
  type AdjectiveCategoryItem,
  type AdverbCategoryItem,
  type DegreeItem,
} from "./CP005-authorities";

function assembleCP005Question(input: {
  familyId: string;
  seed: number;
  difficulty: PunjabiDifficulty;
  stem: string;
  correctAnswer: string;
  distractors: readonly string[];
  explanation: string;
  authorityIds: readonly string[];
}): PunjabiGeneratedQuestion {
  const rng = createRng(input.seed);

  const filteredDistractors = Array.from(
    new Set(input.distractors.map((d) => d.trim()))
  ).filter((d) => d !== input.correctAnswer.trim());

  if (filteredDistractors.length < 3) {
    throw new Error(
      `Insufficient distinct distractors for CP005 ${input.familyId}. Got ${filteredDistractors.length}`
    );
  }

  const selectedDistractors = rng.pickDistinct(filteredDistractors, 3);

  const rawOptions: PunjabiQuestionOption[] = [
    { id: "opt-correct", text: input.correctAnswer, isCorrect: true },
    { id: "opt-dist-1", text: selectedDistractors[0]!, isCorrect: false },
    { id: "opt-dist-2", text: selectedDistractors[1]!, isCorrect: false },
    { id: "opt-dist-3", text: selectedDistractors[2]!, isCorrect: false },
  ];

  const shuffledOptions = rng.shuffle(rawOptions);
  const correctIndex = shuffledOptions.findIndex((o) => o.isCorrect);

  const q: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP005-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP005",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP005-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

const CP005_F01_EASY_TEMPLATES = [
  () => "ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘ਵਿਸ਼ੇਸ਼ਣ’ ਦੀਆਂ ਕੁੱਲ ਕਿੰਨੀਆਂ ਕਿਸਮਾਂ ਹੁੰਦੀਆਂ ਹਨ?",
  () => "ਵਿਆਕਰਣਕ ਸ਼੍ਰੇਣੀ ਵੰਡ ਅਨੁਸਾਰ ਵਿਸ਼ੇਸ਼ਣ ਕਿੰਨੇ ਪ੍ਰਕਾਰ ਦੇ ਹੁੰਦੇ ਹਨ?",
  () => "ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਵਿੱਚ ਵਿਸ਼ੇਸ਼ਣ ਦੇ ਕਿੰਨੇ ਮੁੱਖ ਭੇਦ ਮੰਨੇ ਜਾਂਦੇ ਹਨ?",
];

const CP005_F01_MED_TEMPLATES = [
  (ex: string) => `ਸ਼ਬਦ ‘${ex}’ ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਉਦਾਹਰਨ ਹੈ?`,
  (ex: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${ex}’ ਕਿਸ ਸ਼੍ਰੇਣੀ ਦੇ ਵਿਸ਼ੇਸ਼ਣ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
  (ex: string) => `ਦਿੱਤਾ ਗਿਆ ਸ਼ਬਦ ‘${ex}’ ਵਿਸ਼ੇਸ਼ਣ ਦੇ ਕਿਹੜੇ ਭੇਦ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
  (ex: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${ex}’ ਨੂੰ ਕਿਸ ਪ੍ਰਕਾਰ ਦਾ ਵਿਸ਼ੇਸ਼ਣ ਕਿਹਾ ਜਾਵੇਗਾ?`,
  (ex: string) => `ਵਿਸ਼ੇਸ਼ਣ ਵਰਗੀਕਰਨ ਅਨੁਸਾਰ ਸ਼ਬਦ ‘${ex}’ ਦਾ ਸਹੀ ਵਰਗ ਦੱਸੋ:`,
  (ex: string) => `‘${ex}’ ਕਿਸ ਵਿਸ਼ੇਸ਼ਣ ਸ਼੍ਰੇਣੀ ਦੀ ਪ੍ਰਮਾਣਿਕ ਉਦਾਹਰਨ ਹੈ?`,
];

const CP005_F01_HARD_TEMPLATES = [
  (base: string) => `ਵਿਸ਼ੇਸ਼ਣ ‘${base}’ ਦੀ ‘ਅਧਿਕਤਰ ਅਵਸਥਾ’ (Comparative degree) ਕਿਹੜੀ ਹੈ?`,
  (base: string) => `‘${base}’ ਸ਼ਬਦ ਦਾ ਅਧਿਕਤਰ ਰੂਪ ਕੀ ਬਣੇਗਾ?`,
  (base: string) => `ਦੋ ਵਸਤਾਂ ਜਾਂ ਵਿਅਕਤੀਆਂ ਦੀ ਆਪਸੀ ਤੁਲਨਾ ਕਰਨ ਲਈ ‘${base}’ ਦਾ ਕਿਹੜਾ ਰੂਪ ਵਰਤਿਆ ਜਾਵੇਗਾ?`,
  (base: string) => `ਤੁਲਨਾਤਮਕ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${base}’ ਦੀ ਅਧਿਕਤਮ ਜਾਂ ਅਧਿਕਤਰ ਅਵਸਥਾ ਚੁਣੋ:`,
];

const CP005_F02_EASY_TEMPLATES = [
  () => "ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਵਿੱਚ ‘ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ’ ਦੀਆਂ ਕੁੱਲ ਕਿੰਨੀਆਂ ਕਿਸਮਾਂ ਮੰਨੀਆਂ ਗਈਆਂ ਹਨ?",
  () => "ਵਿਆਕਰਣਕ ਨੇਮਾਂ ਅਨੁਸਾਰ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਦੇ ਕਿੰਨੇ ਭੇਦ ਹੁੰਦੇ ਹਨ?",
  () => "ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਨਿਯਮਾਵਲੀ ਅਨੁਸਾਰ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਨੂੰ ਕਿੰਨੇ ਵਰਗਾਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਹੈ?",
];

const CP005_F02_SENTENCE_TEMPLATES = [
  (s: string, w: string) => `ਵਾਕ “${s}” ਵਿੱਚ ਰੇਖਾਂਕਿਤ ਸ਼ਬਦ ‘${w}’ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਕਿਹੜੀ ਕਿਸਮ ਹੈ?`,
  (s: string, w: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ “${s}” ਵਿੱਚ ‘${w}’ ਕਿਸ ਪ੍ਰਕਾਰ ਦਾ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ?`,
  (s: string, w: string) => `ਹੇਠਾਂ ਲਿਖੇ ਵਾਕ ਵਿੱਚ ‘${w}’ ਦੀ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਸ਼੍ਰੇਣੀ ਪਛਾਣੋ:\n“${s}”`,
  (s: string, w: string) => `“${s}” — ਇਸ ਵਾਕ ਵਿੱਚ ਵਰਤਿਆ ਸ਼ਬਦ ‘${w}’ ਕਿਹੜਾ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ?`,
  (s: string, w: string) => `ਵਾਕ “${s}” ਵਿੱਚ ‘${w}’ ਦਾ ਵਿਆਕਰਣਕ ਕਾਰਜ ਕਿਹੜਾ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਦਰਸਾਉਂਦਾ ਹੈ?`,
  (s: string, w: string) => `ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ਪਦ ‘${w}’ ਦਾ ਸਹੀ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਭੇਦ ਕਿਹੜਾ ਹੈ?\n“${s}”`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Adjective Classification & Degrees (ਵਿਸ਼ੇਸ਼ਣ ਸ਼੍ਰੇਣੀ ਵੰਡ)
// -------------------------------------------------------------------------
export function generateCP005F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  if (difficulty === "Easy") {
    const category = rng.pickOne(ADJECTIVE_CATEGORIES);
    const example = rng.pickOne(category.examples);
    const distractorCategories = ADJECTIVE_CATEGORIES.filter(
      (c) => c.subtypeId !== category.subtypeId
    ).map((c) => c.namePa);

    return assembleCP005Question({
      familyId: "F01",
      seed,
      difficulty,
      stem: `ਸਧਾਰਨ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਸ਼ਬਦ ‘${example}’ ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਕਿਹੜੀ ਕਿਸਮ ਹੈ?`,
      correctAnswer: category.namePa,
      distractors: distractorCategories,
      explanation: `‘${example}’ ${category.namePa} ਹੈ। (${category.definitionPa})`,
      authorityIds: [`PUN-AUTH-ADJ-${category.subtypeId}`],
    });
  }

  if (difficulty === "Medium") {
    const category = rng.pickOne(ADJECTIVE_CATEGORIES);
    const example = rng.pickOne(category.examples);

    const otherCategories = ADJECTIVE_CATEGORIES.filter((c) => c.subtypeId !== category.subtypeId).map(
      (c) => c.namePa
    );
    const stem = rng.pickOne(CP005_F01_MED_TEMPLATES)(example);

    return assembleCP005Question({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: category.namePa,
      distractors: otherCategories,
      explanation: `‘${example}’ ${category.namePa} ਹੈ। (${category.definitionPa})`,
      authorityIds: [`PUN-AUTH-ADJ-${category.subtypeId}`],
    });
  }

  // Hard Difficulty: Degrees of Comparison (ਵਿਸ਼ੇਸ਼ਣ ਦੀਆਂ ਅਵਸਥਾਵਾਂ: ਸਧਾਰਨ, ਅਧਿਕਤਰ, ਅਧਿਕਤਮ)
  const chosenDegree = rng.pickOne(DEGREE_ITEMS);
  const stem = rng.pickOne(CP005_F01_HARD_TEMPLATES)(chosenDegree.base);

  return assembleCP005Question({
    familyId: "F01",
    seed,
    difficulty,
    stem,
    correctAnswer: chosenDegree.higher,
    distractors: [chosenDegree.highest, chosenDegree.base, chosenDegree.base + "ਪੁਣਾ", "ਵੱਧ " + chosenDegree.base],
    explanation:
      `ਵਿਸ਼ੇਸ਼ਣ ਦੀਆਂ ਤਿੰਨ ਅਵਸਥਾਵਾਂ ਹੁੰਦੀਆਂ ਹਨ: ਸਧਾਰਨ ਅਵਸਥਾ (${chosenDegree.base}), ਅਧਿਕਤਰ ਅਵਸਥਾ (${chosenDegree.higher}), ਅਤੇ ਅਧਿਕਤਮ ਅਵਸਥਾ (${chosenDegree.highest})।`,
    authorityIds: ["PUN-AUTH-ADJ-DEGREE"],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: Adverb Classification & Extraction (ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਸ਼੍ਰੇਣੀ ਵੰਡ)
// -------------------------------------------------------------------------
interface AdverbSentenceCase {
  sentence: string;
  targetWord: string;
  adverbCategory: string;
  explanation: string;
}

const ADVERB_SENTENCE_CASES: readonly AdverbSentenceCase[] = [
  {
    sentence: "ਰੇਲਗੱਡੀ ਪਟੜੀ ਉੱਤੇ ਬਹੁਤ ਤੇਜ਼ ਦੌੜ ਰਹੀ ਹੈ।",
    targetWord: "ਤੇਜ਼",
    adverbCategory: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    explanation: "‘ਤੇਜ਼’ ਸ਼ਬਦ ਕਿਰਿਆ (ਦੌੜਨਾ) ਦਾ ਢੰਗ ਜਾਂ ਤਰੀਕਾ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਵਿਦਿਆਰਥੀ ਨੇ ਇਮਤਿਹਾਨ ਵਿੱਚ ਸਾਰੇ ਪ੍ਰਸ਼ਨ ਧਿਆਨਪੂਰਵਕ ਹੱਲ ਕੀਤੇ।",
    targetWord: "ਧਿਆਨਪੂਰਵਕ",
    adverbCategory: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    explanation: "‘ਧਿਆਨਪੂਰਵਕ’ ਸ਼ਬਦ ਕੰਮ ਕਰਨ ਦਾ ਢੰਗ ਦਰਸਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਅਸੀਂ ਸਾਰੇ ਕੱਲ੍ਹ ਸਵੇਰੇ ਅੰਮ੍ਰਿਤਸਰ ਜਾਵਾਂਗੇ।",
    targetWord: "ਕੱਲ੍ਹ",
    adverbCategory: "ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਕੱਲ੍ਹ’ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਵਾਪਰਨ ਦਾ ਸਮਾਂ ਦਰਸਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਉਹ ਰੋਜ਼ਾਨਾ ਪੁਸਤਕਾਲੇ ਵਿੱਚ ਜਾ ਕੇ ਅਧਿਐਨ ਕਰਦਾ ਹੈ।",
    targetWord: "ਰੋਜ਼ਾਨਾ",
    adverbCategory: "ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਰੋਜ਼ਾਨਾ’ ਸ਼ਬਦ ਸਮੇਂ ਦੀ ਨਿਰੰਤਰਤਾ ਅਤੇ ਕਿਰਿਆ ਦਾ ਸਮਾਂ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ।",
  },
  {
    sentence: "ਬੱਚੇ ਮੈਦਾਨ ਦੇ ਅੰਦਰ ਖੇਡ ਰਹੇ ਹਨ।",
    targetWord: "ਅੰਦਰ",
    adverbCategory: "ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਅੰਦਰ’ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਦਾ ਸਥਾਨ ਦੱਸਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਸਾਡਾ ਨਵਾਂ ਦਫ਼ਤਰ ਮੁੱਖ ਸੜਕ ਦੇ ਬਿਲਕੁਲ ਨੇੜੇ ਸਥਿਤ ਹੈ।",
    targetWord: "ਨੇੜੇ",
    adverbCategory: "ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਨੇੜੇ’ ਸ਼ਬਦ ਸਥਾਨਿਕ ਸਥਿਤੀ ਦੱਸਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਉਸ ਨੇ ਇੱਕੋ ਗ਼ਲਤੀ ਮੁੜ-ਮੁੜ ਦੁਹਰਾਈ।",
    targetWord: "ਮੁੜ-ਮੁੜ",
    adverbCategory: "ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਗਿਣਤੀ-ਵਾਚਕ)",
    explanation: "‘ਮੁੜ-ਮੁੜ’ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਦੁਹਰਾਓ ਜਾਂ ਗਿਣਤੀ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਅਧਿਆਪਕ ਨੇ ਇਹ ਜ਼ਰੂਰੀ ਨਿਯਮ ਕਈ ਵਾਰ ਸਮਝਾਇਆ।",
    targetWord: "ਕਈ ਵਾਰ",
    adverbCategory: "ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਗਿਣਤੀ-ਵਾਚਕ)",
    explanation: "‘ਕਈ ਵਾਰ’ ਸ਼ਬਦ ਕਿਰਿਆ ਦੀ ਵਾਰੀ ਜਾਂ ਦੁਹਰਾਓ ਦੀ ਗਿਣਤੀ ਦੱਸਦਾ ਹੈ।",
  },
  {
    sentence: "ਉਹ ਬਿਮਾਰ ਸੀ, ਇਸ ਲਈ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਹਾਜ਼ਰ ਨਾ ਹੋ ਸਕਿਆ।",
    targetWord: "ਇਸ ਲਈ",
    adverbCategory: "ਕਾਰਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਇਸ ਲਈ’ ਕਿਰਿਆ ਦੇ ਨਾ ਹੋਣ ਦਾ ਕਾਰਨ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਕਾਰਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਤੁਸੀਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਹੋਣ ਵਾਲੀ ਬੈਠਕ ਵਿੱਚ ਜ਼ਰੂਰ ਸ਼ਾਮਲ ਹੋਵੋ।",
    targetWord: "ਜ਼ਰੂਰ",
    adverbCategory: "ਤਾਕੀਦ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਨਿਰਨਾ/ਪੱਕਿਆਈ)",
    explanation: "‘ਜ਼ਰੂਰ’ ਸ਼ਬਦ ਕਿਰਿਆ ਦੀ ਤਾਕੀਦ ਜਾਂ ਪੱਕਿਆਈ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਤਾਕੀਦ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਇਹ ਫ਼ੈਸਲਾ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਬਿਲਕੁਲ ਸਹੀ ਲਿਆ ਗਿਆ ਹੈ।",
    targetWord: "ਬਿਲਕੁਲ",
    adverbCategory: "ਤਾਕੀਦ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਨਿਰਨਾ/ਪੱਕਿਆਈ)",
    explanation: "‘ਬਿਲਕੁਲ’ ਸ਼ਬਦ ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਤਾ ਵਿੱਚ ਦ੍ਰਿੜ੍ਹਤਾ ਅਤੇ ਤਾਕੀਦ ਪੈਦਾ ਕਰਦਾ ਹੈ।",
  },
  {
    sentence: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਸ਼ਾਮ ਨੂੰ ਜਾ ਰਹੇ ਹੋ? ਆਹੋ, ਮੈਂ ਜਾਵਾਂਗਾ।",
    targetWord: "ਆਹੋ",
    adverbCategory: "ਨਿਰਣੇ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਆਹੋ’ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਬਾਰੇ ਹਾਂ-ਵਾਚਕ ਫ਼ੈਸਲਾ ਦਰਸਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਨਿਰਣੇ-ਵਾਚਕ ਹੈ।",
  },
  {
    sentence: "ਮਹਿਮਾਨ ਦੁਪਹਿਰੇ ਸਾਡੇ ਘਰ ਪਹੁੰਚੇ।",
    targetWord: "ਦੁਪਹਿਰੇ",
    adverbCategory: "ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਦੁਪਹਿਰੇ’ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਵਾਪਰਨ ਦਾ ਸਮਾਂ ਦਰਸਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਸੂਰਜ ਛਿਪਣ ਮਗਰੋਂ ਠੰਢੀ ਹਵਾ ਚੱਲਣ ਲੱਗੀ।",
    targetWord: "ਮਗਰੋਂ",
    adverbCategory: "ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਮਗਰੋਂ’ ਸ਼ਬਦ ਕਿਰਿਆ ਦਾ ਸਮਾਂ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਦਰਵਾਜ਼ੇ ਦੇ ਬਾਹਰ ਦੋ ਪਹਿਰੇਦਾਰ ਖੜ੍ਹੇ ਸਨ।",
    targetWord: "ਬਾਹਰ",
    adverbCategory: "ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਬਾਹਰ’ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਦਾ ਸਥਾਨ ਦੱਸਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਘਰ ਦੇ ਸਾਹਮਣੇ ਇੱਕ ਸੁੰਦਰ ਬਾਗ਼ ਬਣਿਆ ਹੋਇਆ ਹੈ।",
    targetWord: "ਸਾਹਮਣੇ",
    adverbCategory: "ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਸਾਹਮਣੇ’ ਸ਼ਬਦ ਸਥਾਨਿਕ ਸਥਿਤੀ ਦੱਸਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਬੁੱਢਾ ਆਦਮੀ ਸੜਕ ਉੱਤੇ ਹੌਲੀ-ਹੌਲੀ ਤੁਰ ਰਿਹਾ ਸੀ।",
    targetWord: "ਹੌਲੀ-ਹੌਲੀ",
    adverbCategory: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    explanation: "‘ਹੌਲੀ-ਹੌਲੀ’ ਤੁਰਨ ਦੀ ਰਫ਼ਤਾਰ ਅਤੇ ਢੰਗ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਸਿਪਾਹੀ ਨੇ ਚੋਰ ਨੂੰ ਫੜਨ ਲਈ ਜ਼ੋਰ ਨਾਲ ਦੌੜ ਲਗਾਈ।",
    targetWord: "ਜ਼ੋਰ ਨਾਲ",
    adverbCategory: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    explanation: "‘ਜ਼ੋਰ ਨਾਲ’ ਕਿਰਿਆ ਦਾ ਤਰੀਕਾ ਅਤੇ ਢੰਗ ਦਰਸਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਵਿਦਿਆਰਥੀਆਂ ਨੇ ਵਾਰੋ-ਵਾਰੀ ਆਪਣੀ ਗੱਲ ਸਭਾ ਅੱਗੇ ਰੱਖੀ।",
    targetWord: "ਵਾਰੋ-ਵਾਰੀ",
    adverbCategory: "ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਗਿਣਤੀ-ਵਾਚਕ)",
    explanation: "‘ਵਾਰੋ-ਵਾਰੀ’ ਕਿਰਿਆ ਦੇ ਦੁਹਰਾਓ ਅਤੇ ਵਾਰੀ ਦਾ ਬੋਧ ਕਰਵਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਉਹ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਕਮਰੇ ਵਿੱਚੋਂ ਬਾਹਰ ਚਲੇ ਗਏ।",
    targetWord: "ਇੱਕ-ਇੱਕ ਕਰਕੇ",
    adverbCategory: "ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਗਿਣਤੀ-ਵਾਚਕ)",
    explanation: "‘ਇੱਕ-ਇੱਕ ਕਰਕੇ’ ਕਿਰਿਆ ਦੀ ਕ੍ਰਮਵਾਰ ਗਿਣਤੀ ਦਰਸਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਉਹ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਫ਼ੇਲ੍ਹ ਹੋ ਗਿਆ ਕਿਉਂਕਿ ਉਸ ਨੇ ਮਿਹਨਤ ਨਹੀਂ ਕੀਤੀ ਸੀ।",
    targetWord: "ਕਿਉਂਕਿ",
    adverbCategory: "ਕਾਰਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਕਿਉਂਕਿ’ ਕਿਰਿਆ ਦੇ ਵਾਪਰਨ ਦਾ ਕਾਰਨ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਕਾਰਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਮੈਂ ਤੈਨੂੰ ਬੇਸ਼ੱਕ ਇਹ ਭੇਤ ਦੱਸ ਸਕਦਾ ਹਾਂ।",
    targetWord: "ਬੇਸ਼ੱਕ",
    adverbCategory: "ਤਾਕੀਦ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਨਿਰਨਾ/ਪੱਕਿਆਈ)",
    explanation: "‘ਬੇਸ਼ੱਕ’ ਕਥਨ ਵਿੱਚ ਨਿਸੰਗਤਾ ਅਤੇ ਤਾਕੀਦ ਪੈਦਾ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਤਾਕੀਦ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਕੀ ਤੁਸੀਂ ਇਹ ਖ਼ਬਰ ਸੁਣੀ ਹੈ? ਜੀ ਹਾਂ, ਮੈਂ ਸੁਣੀ ਹੈ।",
    targetWord: "ਜੀ ਹਾਂ",
    adverbCategory: "ਨਿਰਣੇ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਜੀ ਹਾਂ’ ਹਾਂ-ਵਾਚਕ ਫ਼ੈਸਲਾ ਦਰਸਾਉਂਦਾ ਨਿਰਣੇ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਕੀ ਉਹ ਕੱਲ੍ਹ ਸ਼ਹਿਰ ਜਾਵੇਗਾ? ਨਹੀਂ, ਉਹ ਨਹੀਂ ਜਾਵੇਗਾ।",
    targetWord: "ਨਹੀਂ",
    adverbCategory: "ਨਿਰਣੇ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਨਹੀਂ’ ਨਾਂਹ-ਵਾਚਕ ਫ਼ੈਸਲਾ ਦਰਸਾਉਂਦਾ ਨਿਰਣੇ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਅਸੀਂ ਸਵੇਰੇ ਤੜਕੇ ਸੈਰ ਕਰਨ ਜਾਂਦੇ ਹਾਂ।",
    targetWord: "ਤੜਕੇ",
    adverbCategory: "ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਤੜਕੇ’ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਜਾਂ ਸਵੇਰ ਦੇ ਸਮੇਂ ਦਾ ਬੋਧ ਕਰਵਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਸੜਕ ਦੇ ਆਸ-ਪਾਸ ਸੰਘਣੇ ਰੁੱਖ ਲੱਗੇ ਹੋਏ ਹਨ।",
    targetWord: "ਆਸ-ਪਾਸ",
    adverbCategory: "ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਆਸ-ਪਾਸ’ ਦੁਆਲੇ ਦੇ ਸਥਾਨ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਉਸ ਨੇ ਸਾਰਿਆਂ ਦੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਖਿੜੇ-ਮੱਥੇ ਦਿੱਤੇ।",
    targetWord: "ਖਿੜੇ-ਮੱਥੇ",
    adverbCategory: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    explanation: "‘ਖਿੜੇ-ਮੱਥੇ’ ਕੰਮ ਕਰਨ ਦਾ ਸੁਹਾਵਣਾ ਢੰਗ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਰੇਲਗੱਡੀ ਸਮੇਂ ਸਿਰ ਪਲੇਟਫ਼ਾਰਮ 'ਤੇ ਪਹੁੰਚੀ।",
    targetWord: "ਸਮੇਂ ਸਿਰ",
    adverbCategory: "ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਸਮੇਂ ਸਿਰ’ ਕਿਰਿਆ ਦੇ ਵਾਪਰਨ ਦਾ ਸਹੀ ਵਕਤ ਦੱਸਦਾ ਹੈ।",
  },
  {
    sentence: "ਸਿਪਾਹੀ ਹਮੇਸ਼ਾ ਦੇਸ਼ ਦੀ ਸੇਵਾ ਲਈ ਤਿਆਰ ਰਹਿੰਦੇ ਹਨ।",
    targetWord: "ਹਮੇਸ਼ਾ",
    adverbCategory: "ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਹਮੇਸ਼ਾ’ ਸਮੇਂ ਦੀ ਨਿਰੰਤਰਤਾ ਦਰਸਾਉਂਦਾ ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    sentence: "ਪੰਛੀ ਆਕਾਸ਼ ਵਿੱਚ ਉੱਚਾ ਉੱਡ ਰਹੇ ਹਨ।",
    targetWord: "ਉੱਚਾ",
    adverbCategory: "ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਉੱਚਾ’ ਕਿਰਿਆ ਦਾ ਸਥਾਨ ਅਤੇ ਉਚਾਈ ਦੱਸਦਾ ਹੈ।",
  },
  {
    sentence: "ਮਹਿਮਾਨ ਬਾਹਰ ਵਰਾਂਡੇ ਵਿੱਚ ਬੈਠੇ ਸਨ।",
    targetWord: "ਬਾਹਰ",
    adverbCategory: "ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਬਾਹਰ’ ਕਿਰਿਆ ਦੇ ਹੋਣ ਦਾ ਸਥਾਨ ਦੱਸਦਾ ਹੈ।",
  },
  {
    sentence: "ਬੱਚੇ ਨੇ ਖ਼ੁਸ਼ੀ-ਖ਼ੁਸ਼ੀ ਆਪਣਾ ਸਾਰਾ ਕੰਮ ਨਿਬੇੜਿਆ।",
    targetWord: "ਖ਼ੁਸ਼ੀ-ਖ਼ੁਸ਼ੀ",
    adverbCategory: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    explanation: "‘ਖ਼ੁਸ਼ੀ-ਖ਼ੁਸ਼ੀ’ ਕੰਮ ਕਰਨ ਦਾ ਢੰਗ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ।",
  },
  {
    sentence: "ਉਹ ਬੜੀ ਚਲਾਕੀ ਨਾਲ ਆਪਣੀ ਗੱਲ ਮਨਵਾ ਗਿਆ।",
    targetWord: "ਚਲਾਕੀ ਨਾਲ",
    adverbCategory: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    explanation: "‘ਚਲਾਕੀ ਨਾਲ’ ਕੰਮ ਕਰਨ ਦਾ ਢੰਗ ਦਰਸਾਉਂਦਾ ਹੈ।",
  },
  {
    sentence: "ਤੁਸੀਂ ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਦਵਾਈ ਲਓ।",
    targetWord: "ਦੋ ਵਾਰ",
    adverbCategory: "ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਗਿਣਤੀ-ਵਾਚਕ)",
    explanation: "‘ਦੋ ਵਾਰ’ ਕਿਰਿਆ ਦੇ ਦੁਹਰਾਓ ਦੀ ਗਿਣਤੀ ਦੱਸਦਾ ਹੈ।",
  },
  {
    sentence: "ਉਹ ਬਾਰ-ਬਾਰ ਇੱਕੋ ਗੱਲ ਦੁਹਰਾ ਰਿਹਾ ਸੀ।",
    targetWord: "ਬਾਰ-ਬਾਰ",
    adverbCategory: "ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਗਿਣਤੀ-ਵਾਚਕ)",
    explanation: "‘ਬਾਰ-ਬਾਰ’ ਕਿਰਿਆ ਦੀ ਵਾਰ-ਵਾਰ ਹੋਣ ਵਾਲੀ ਗਿਣਤੀ ਦੱਸਦਾ ਹੈ।",
  },
  {
    sentence: "ਮਰੀਜ਼ ਨੂੰ ਬਹੁਤ ਘੱਟ ਭੁੱਖ ਲੱਗਦੀ ਹੈ।",
    targetWord: "ਬਹੁਤ ਘੱਟ",
    adverbCategory: "ਪਰਿਮਾਣ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਮਿਣਤੀ-ਵਾਚਕ)",
    explanation: "‘ਬਹੁਤ ਘੱਟ’ ਕਿਰਿਆ ਦੀ ਮਾਤਰਾ ਜਾਂ ਮਿਣਤੀ ਦੱਸਦਾ ਹੈ।",
  },
  {
    sentence: "ਸਾਨੂੰ ਜ਼ਰੂਰਤ ਅਨੁਸਾਰ ਥੋੜ੍ਹਾ ਖਾਣਾ ਚਾਹੀਦਾ ਹੈ।",
    targetWord: "ਥੋੜ੍ਹਾ",
    adverbCategory: "ਪਰਿਮਾਣ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਮਿਣਤੀ-ਵਾਚਕ)",
    explanation: "‘ਥੋੜ੍ਹਾ’ ਕਿਰਿਆ ਦੀ ਮਾਤਰਾ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ।",
  },
  {
    sentence: "ਉਹ ਥੱਕ ਗਿਆ ਸੀ ਤਾਂ ਹੀ ਸੌਂ ਗਿਆ।",
    targetWord: "ਤਾਂ ਹੀ",
    adverbCategory: "ਕਾਰਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਤਾਂ ਹੀ’ ਕਿਰਿਆ ਦਾ ਕਾਰਨ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ।",
  },
  {
    sentence: "ਮੀਂਹ ਪੈਣ ਕਾਰਨ ਮੈਚ ਰੱਦ ਹੋ ਗਿਆ।",
    targetWord: "ਕਾਰਨ",
    adverbCategory: "ਕਾਰਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਕਾਰਨ’ ਕਾਰਜ ਦੇ ਨਾ ਹੋਣ ਦੀ ਵਜ੍ਹਾ ਦੱਸਦਾ ਹੈ।",
  },
  {
    sentence: "ਅਸੀਂ ਕੱਲ੍ਹ ਨਿਸਚੇ ਹੀ ਇਹ ਸਮਝੌਤਾ ਕਰਾਂਗੇ।",
    targetWord: "ਨਿਸਚੇ ਹੀ",
    adverbCategory: "ਤਾਕੀਦ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਨਿਰਨਾ/ਪੱਕਿਆਈ)",
    explanation: "‘ਨਿਸਚੇ ਹੀ’ ਕਥਨ ਵਿੱਚ ਪੱਕਿਆਈ ਪੈਦਾ ਕਰਦਾ ਹੈ।",
  },
  {
    sentence: "ਉਹ ਬੇਸ਼ੱਕ ਆਪਣੇ ਵਾਅਦੇ 'ਤੇ ਪੂਰਾ ਉਤਰੇਗਾ।",
    targetWord: "ਬੇਸ਼ੱਕ",
    adverbCategory: "ਤਾਕੀਦ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਨਿਰਨਾ/ਪੱਕਿਆਈ)",
    explanation: "‘ਬੇਸ਼ੱਕ’ ਕਿਰਿਆ ਬਾਰੇ ਦ੍ਰਿੜ੍ਹਤਾ ਦਰਸਾਉਂਦਾ ਹੈ।",
  },
  {
    sentence: "ਕੀ ਤੁਸੀਂ ਸਹਿਮਤ ਹੋ? ਹਾਂ ਜੀ, ਅਸੀਂ ਸਹਿਮਤ ਹਾਂ।",
    targetWord: "ਹਾਂ ਜੀ",
    adverbCategory: "ਨਿਰਣੇ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਹਾਂ ਜੀ’ ਹਾਂ-ਪੱਖੀ ਫ਼ੈਸਲਾ ਦਰਸਾਉਂਦਾ ਨਿਰਣੇ-ਵਾਚਕ ਹੈ।",
  },
  {
    sentence: "ਕੀ ਉਸ ਨੇ ਚੋਰੀ ਕੀਤੀ? ਨਹੀਂ, ਉਸ ਨੇ ਨਹੀਂ ਕੀਤੀ।",
    targetWord: "ਨਹੀਂ",
    adverbCategory: "ਨਿਰਣੇ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਨਹੀਂ’ ਨਾਂਹ-ਪੱਖੀ ਨਿਰਣਾ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ।",
  },
  {
    sentence: "ਪਾਣੀ ਕੱਲ੍ਹ ਸਵੇਰ ਤੋਂ ਲਗਾਤਾਰ ਵਗ ਰਿਹਾ ਹੈ।",
    targetWord: "ਲਗਾਤਾਰ",
    adverbCategory: "ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਲਗਾਤਾਰ’ ਸਮੇਂ ਦੀ ਨਿਰੰਤਰਤਾ ਦੱਸਦਾ ਹੈ।",
  },
  {
    sentence: "ਸਾਰੇ ਬੱਚੇ ਜਮਾਤ ਦੇ ਅੰਦਰ ਸ਼ਾਂਤ ਬੈਠੇ ਸਨ।",
    targetWord: "ਅੰਦਰ",
    adverbCategory: "ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    explanation: "‘ਅੰਦਰ’ ਸਥਾਨਿਕ ਸਥਿਤੀ ਦਰਸਾਉਂਦਾ ਹੈ।",
  },
  {
    sentence: "ਦਰਜ਼ੀ ਨੇ ਬੜੀ ਸਫ਼ਾਈ ਨਾਲ ਕੱਪੜੇ ਸੀਤੇ।",
    targetWord: "ਸਫ਼ਾਈ ਨਾਲ",
    adverbCategory: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    explanation: "‘ਸਫ਼ਾਈ ਨਾਲ’ ਕੰਮ ਦਾ ਤਰੀਕਾ ਅਤੇ ਢੰਗ ਦੱਸਦਾ ਹੈ।",
  },
  {
    sentence: "ਕਿਸਾਨ ਨੇ ਸਖ਼ਤ ਮਿਹਨਤ ਕਰਕੇ ਫ਼ਸਲ ਪਾਲੀ।",
    targetWord: "ਸਖ਼ਤ",
    adverbCategory: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    explanation: "‘ਸਖ਼ਤ’ ਕਿਰਿਆ ਦਾ ਢੰਗ ਦਰਸਾਉਂਦਾ ਹੈ।",
  },
];

export function generateCP005F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  if (difficulty === "Easy") {
    const selectedCase = rng.pickOne(ADVERB_SENTENCE_CASES);
    const words = selectedCase.sentence
      .replace(/[।.,!?]/g, "")
      .split(/\s+/)
      .filter((w) => w !== selectedCase.targetWord && !w.includes(selectedCase.targetWord));
    const fallbackWords = ["ਕਿਤਾਬ", "ਘਰ", "ਸਕੂਲ", "ਸਵੇਰ", "ਦਰਵਾਜ਼ਾ"];
    const distractors = Array.from(new Set([...words, ...fallbackWords])).filter(
      (w) => w !== selectedCase.targetWord
    );
    const stem = `ਸਧਾਰਨ ਵਾਕ “${selectedCase.sentence}” ਵਿੱਚ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`;
    return assembleCP005Question({
      familyId: "F02",
      seed,
      difficulty,
      stem,
      correctAnswer: selectedCase.targetWord,
      distractors,
      explanation: selectedCase.explanation,
      authorityIds: ["PUN-AUTH-ADV-IDENTIFY"],
    });
  }

  const selectedCase = rng.pickOne(ADVERB_SENTENCE_CASES);
  const otherCategories = ADVERB_CATEGORIES.filter((c) => c.namePa !== selectedCase.adverbCategory).map(
    (c) => c.namePa
  );
  const templates = difficulty === "Hard"
    ? [
        (s: string, w: string) => `“${s}” — ਇਸ ਵਾਕ ਵਿੱਚ ਵਰਤਿਆ ਸ਼ਬਦ ‘${w}’ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਕਿਹੜੀ ਗੂੜ੍ਹ ਸ਼੍ਰੇਣੀ ਅਧੀਨ ਆਉਂਦਾ ਹੈ?`,
        (s: string, w: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਵਿਚਲੇ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਹੀ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਭੇਦ ਦੱਸੋ:`,
      ]
    : CP005_F02_SENTENCE_TEMPLATES;
  const stem = rng.pickOne(templates)(selectedCase.sentence, selectedCase.targetWord);

  return assembleCP005Question({
    familyId: "F02",
    seed,
    difficulty,
    stem,
    correctAnswer: selectedCase.adverbCategory,
    distractors: otherCategories,
    explanation: selectedCase.explanation,
    authorityIds: ["PUN-AUTH-ADV-SENTENCE"],
  });
}
