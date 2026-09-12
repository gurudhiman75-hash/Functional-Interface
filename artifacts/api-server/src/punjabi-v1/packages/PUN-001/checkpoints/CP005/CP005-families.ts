/**
 * CP005 Question Families:
 * CP005-F01: Adjective Classification & Degrees (ਵਿਸ਼ੇਸ਼ਣ ਸ਼੍ਰੇਣੀ ਵੰਡ ਅਤੇ ਅਵਸਥਾਵਾਂ)
 * CP005-F02: Adverb Classification & Extraction (ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਸ਼੍ਰੇਣੀ ਵੰਡ)
 * CP005-F03: Degree Transformation & Sentence Comparison (ਅਵਸਥਾ ਪਰਿਵਰਤਨ ਅਤੇ ਤੁਲਨਾ)
 * CP005-F04: Adjective Agreement & Inflection (ਵਿਕਾਰੀ/ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਲਿੰਗ-ਵਚਨ ਅਨੁਕੂਲਤਾ)
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
  ADJECTIVE_AGREEMENT_ITEMS,
  type AdjectiveCategoryItem,
  type AdverbCategoryItem,
  type DegreeItem,
  type AdjectiveAgreementItem,
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

// -------------------------------------------------------------------------
// FAMILY 3: Degree Transformation & Sentence Comparison (ਵਿਸ਼ੇਸ਼ਣ ਦੀਆਂ ਅਵਸਥਾਵਾਂ ਅਤੇ ਤੁਲਨਾ)
// -------------------------------------------------------------------------

const CP005_F03_EASY_TEMPLATES = [
  (word: string) => `ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਰੂਪ ‘${word}’ ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਕਿਹੜੀ ਅਵਸਥਾ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
  (word: string) => `ਸ਼ਬਦ ‘${word}’ ਵਿਸ਼ੇਸ਼ਣ ਦੀਆਂ ਤਿੰਨਾਂ ਅਵਸਥਾਵਾਂ ਵਿੱਚੋਂ ਕਿਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
  (word: string) => `ਦਿੱਤਾ ਗਿਆ ਸ਼ਬਦ ‘${word}’ ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਕਿਹੜੀ ਤੁਲਨਾਤਮਕ ਅਵਸਥਾ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ?`,
];

const CP005_F03_MED_TEMPLATES = [
  (base: string) => `ਵਿਸ਼ੇਸ਼ਣ ‘${base}’ ਦੀ ‘ਅਧਿਕਤਰ ਅਵਸਥਾ’ (Comparative Degree) ਕਿਹੜੀ ਹੋਵੇਗੀ?`,
  (base: string) => `ਜਦੋਂ ਦੋ ਵਸਤਾਂ ਦੀ ਆਪਸੀ ਤੁਲਨਾ ਕਰਨੀ ਹੋਵੇ ਤਾਂ ‘${base}’ ਦਾ ਕਿਹੜਾ ਤੁਲਨਾਤਮਕ ਰੂਪ ਵਰਤਿਆ ਜਾਵੇਗਾ?`,
  (base: string) => `‘${base}’ ਵਿਸ਼ੇਸ਼ਣ ਦਾ ਅਧਿਕਤਮ (Superlative) ਤੁਲਨਾਤਮਕ ਰੂਪ ਚੁਣੋ:`,
  (higher: string) => `ਅਧਿਕਤਰ ਤੁਲਨਾਤਮਕ ਰੂਪ ‘${higher}’ ਦਾ ਮੂਲ ਸਧਾਰਨ (Positive Degree) ਵਿਸ਼ੇਸ਼ਣ ਕੀ ਹੈ?`,
];

const CP005_F03_HARD_TEMPLATES = [
  (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚ ਵਰਤੇ ਗਏ ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਤੁਲਨਾਤਮਕ ਅਵਸਥਾ ਪਛਾਣੋ:\n“${s}”`,
  (s: string) => `ਵਾਕ “${s}” ਵਿੱਚ ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਕਿਹੜੀ ਡਿਗਰੀ/ਅਵਸਥਾ ਦੀ ਵਰਤੋਂ ਹੋਈ ਹੈ?`,
];

export function generateCP005F03(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const degreeCategories = [
    "ਸਧਾਰਨ ਅਵਸਥਾ (Positive Degree)",
    "ਅਧਿਕਤਰ ਅਵਸਥਾ (Comparative Degree)",
    "ਅਧਿਕਤਮ ਅਵਸਥਾ (Superlative Degree)",
  ];

  if (difficulty === "Easy") {
    const item = rng.pickOne(DEGREE_ITEMS);
    const formType = rng.pickOne(["base", "higher", "highest"] as const);

    let word: string;
    let correctAnswer: string;
    let explDegree: string;

    if (formType === "base") {
      word = item.base;
      correctAnswer = "ਸਧਾਰਨ ਅਵਸਥਾ (Positive Degree)";
      explDegree = "ਸਧਾਰਨ ਅਵਸਥਾ ਵਿੱਚ ਕਿਸੇ ਇੱਕ ਵਸਤੂ ਜਾਂ ਵਿਅਕਤੀ ਦਾ ਗੁਣ ਦੱਸਿਆ ਜਾਂਦਾ ਹੈ ਬਿਨਾਂ ਕਿਸੇ ਤੁਲਨਾ ਦੇ।";
    } else if (formType === "higher") {
      word = item.higher;
      correctAnswer = "ਅਧਿਕਤਰ ਅਵਸਥਾ (Comparative Degree)";
      explDegree = "ਅਧਿਕਤਰ ਅਵਸਥਾ ਵਿੱਚ ਦੋ ਵਸਤਾਂ ਜਾਂ ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਤੁਲਨਾ ਕਰਕੇ ਇੱਕ ਨੂੰ ਦੂਜੇ ਨਾਲੋਂ ਵਧੇਰੇ ਜਾਂ ਘੱਟ ਦੱਸਿਆ ਜਾਂਦਾ ਹੈ।";
    } else {
      word = item.highest;
      correctAnswer = "ਅਧਿਕਤਮ ਅਵਸਥਾ (Superlative Degree)";
      explDegree = "ਅਧਿਕਤਮ ਅਵਸਥਾ ਵਿੱਚ ਕਿਸੇ ਇੱਕ ਨੂੰ ਸਭ ਨਾਲੋਂ ਵਧੇਰੇ ਜਾਂ ਸ੍ਰੇਸ਼ਠ ਦੱਸਿਆ ਜਾਂਦਾ ਹੈ।";
    }

    const distractors = [
      ...degreeCategories.filter((c) => c !== correctAnswer),
      "ਸੰਯੁਕਤ ਅਵਸਥਾ (Compound Degree)",
      "ਗੁਣਾਤਮਕ ਅਵਸਥਾ",
    ];

    const stem = rng.pickOne(CP005_F03_EASY_TEMPLATES)(word);

    return assembleCP005Question({
      familyId: "F03",
      seed,
      difficulty,
      stem,
      correctAnswer,
      distractors,
      explanation: `‘${word}’ ${correctAnswer} ਹੈ। ${explDegree}`,
      authorityIds: ["PUN-AUTH-ADJ-DEGREE-IDENTIFY"],
    });
  }

  if (difficulty === "Medium") {
    const item = rng.pickOne(DEGREE_ITEMS);
    const mode = rng.pickOne(["toHigher", "toHighest", "fromHigher"] as const);

    if (mode === "toHigher") {
      const stem = `ਵਿਸ਼ੇਸ਼ਣ ‘${item.base}’ ਦੀ ‘ਅਧਿਕਤਰ ਅਵਸਥਾ’ (Comparative Degree) ਕਿਹੜੀ ਹੈ?`;
      const correctAnswer = item.higher;
      const distractors = [
        item.highest,
        item.base,
        item.base + "ਪੁਣਾ",
        "ਵੱਧ " + item.base,
        item.base + "ਤਮ",
      ].filter((d) => d !== correctAnswer);

      return assembleCP005Question({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer,
        distractors,
        explanation: `‘${item.base}’ ਦੀ ਅਧਿਕਤਰ ਅਵਸਥਾ ‘${item.higher}’ ਹੈ (ਅਧਿਕਤਮ ਅਵਸਥਾ ‘${item.highest}’ ਹੈ)।`,
        authorityIds: ["PUN-AUTH-ADJ-DEGREE-CONVERT"],
      });
    } else if (mode === "toHighest") {
      const stem = `ਵਿਸ਼ੇਸ਼ਣ ‘${item.base}’ ਦੀ ‘ਅਧਿਕਤਮ ਅਵਸਥਾ’ (Superlative Degree) ਕਿਹੜੀ ਹੈ?`;
      const correctAnswer = item.highest;
      const distractors = [
        item.higher,
        item.base,
        "ਘੱਟ " + item.base,
        item.base + "ਤਰ",
      ].filter((d) => d !== correctAnswer);

      return assembleCP005Question({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer,
        distractors,
        explanation: `‘${item.base}’ ਦੀ ਅਧਿਕਤਮ ਅਵਸਥਾ ‘${item.highest}’ ਹੈ, ਜੋ ਸਭ ਨਾਲੋਂ ਉੱਤਮਤਾ ਪ੍ਰਗਟ ਕਰਦੀ ਹੈ।`,
        authorityIds: ["PUN-AUTH-ADJ-DEGREE-CONVERT"],
      });
    } else {
      const stem = `ਅਧਿਕਤਰ ਤੁਲਨਾਤਮਕ ਰੂਪ ‘${item.higher}’ ਦਾ ਮੂਲ ਸਧਾਰਨ (Positive Degree) ਵਿਸ਼ੇਸ਼ਣ ਕੀ ਹੈ?`;
      const correctAnswer = item.base;
      const distractors = [
        item.highest,
        item.higher + "ਪੁਣਾ",
        "ਸਭ ਤੋਂ " + item.base,
        item.base + "ਵਾਲਾ",
      ].filter((d) => d !== correctAnswer);

      return assembleCP005Question({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer,
        distractors,
        explanation: `‘${item.higher}’ ਦਾ ਮੂਲ ਸਧਾਰਨ ਰੂਪ ‘${item.base}’ ਹੈ।`,
        authorityIds: ["PUN-AUTH-ADJ-DEGREE-BASE"],
      });
    }
  }

  // Hard Difficulty: Contextual sentence analysis & syntactic rules
  const hardSentences = [
    {
      sentence: "ਮਾਊਂਟ ਐਵਰੈਸਟ ਦੁਨੀਆ ਦੀ ਸਭ ਤੋਂ ਉੱਚੀ ਚੋਟੀ ਹੈ।",
      degree: "ਅਧਿਕਤਮ ਅਵਸਥਾ (Superlative Degree)",
      expl: "ਜਦੋਂ ਕਿਸੇ ਇੱਕ ਵਸਤੂ ਦੀ ਤੁਲਨਾ ਸਮੂਹ ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਨਾਲ ਕਰਕੇ ਉਸ ਨੂੰ ਸਭ ਤੋਂ ਸ੍ਰੇਸ਼ਠ ਜਾਂ ਉੱਚਾ ਦੱਸਿਆ ਜਾਵੇ, ਤਾਂ ਅਧਿਕਤਮ ਅਵਸਥਾ ਹੁੰਦੀ ਹੈ।",
    },
    {
      sentence: "ਸਤਲੁਜ ਬਿਆਸ ਨਾਲੋਂ ਲੰਮੇਰਾ ਦਰਿਆ ਹੈ।",
      degree: "ਅਧਿਕਤਰ ਅਵਸਥਾ (Comparative Degree)",
      expl: "ਇੱਥੇ ਦੋ ਦਰਿਆਵਾਂ (ਸਤਲੁਜ ਅਤੇ ਬਿਆਸ) ਦੀ ਆਪਸੀ ਤੁਲਨਾ ਕੀਤੀ ਗਈ ਹੈ, ਇਸ ਲਈ ‘ਲੰਮੇਰਾ’ ਅਧਿਕਤਰ ਅਵਸਥਾ ਹੈ।",
    },
    {
      sentence: "ਹਰਮੀਤ ਜਮਾਤ ਦਾ ਇੱਕ ਹੁਸ਼ਿਆਰ ਵਿਦਿਆਰਥੀ ਹੈ।",
      degree: "ਸਧਾਰਨ ਅਵਸਥਾ (Positive Degree)",
      expl: "ਇੱਥੇ ‘ਹੁਸ਼ਿਆਰ’ ਸਧਾਰਨ ਗੁਣ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ, ਬਿਨਾਂ ਕਿਸੇ ਹੋਰ ਨਾਲ ਤੁਲਨਾ ਕੀਤੇ।",
    },
    {
      sentence: "ਇਹ ਸਵਾਲ ਪਹਿਲੇ ਸਵਾਲ ਨਾਲੋਂ ਔਖੇਰਾ ਸੀ।",
      degree: "ਅਧਿਕਤਰ ਅਵਸਥਾ (Comparative Degree)",
      expl: "ਦੋ ਸਵਾਲਾਂ ਦੀ ਆਪਸੀ ਤੁਲਨਾ ਹੋਣ ਕਾਰਨ ‘ਔਖੇਰਾ’ ਅਧਿਕਤਰ ਅਵਸਥਾ ਹੈ।",
    },
    {
      sentence: "ਸਚਿਨ ਆਪਣੇ ਸਮੇਂ ਦਾ ਮਹਾਨਤਮ ਬੱਲੇਬਾਜ਼ ਮੰਨਿਆ ਜਾਂਦਾ ਸੀ।",
      degree: "ਅਧਿਕਤਮ ਅਵਸਥਾ (Superlative Degree)",
      expl: "‘ਮਹਾਨਤਮ’ ਵਿੱਚ ਤਤਸਮ ਪਿਛੇਤਰ ‘ਤਮ’ ਲੱਗ ਕੇ ਅਧਿਕਤਮ ਅਵਸਥਾ (ਸਭ ਨਾਲੋਂ ਮਹਾਨ) ਬਣੀ ਹੈ।",
    },
    {
      sentence: "ਇਹ ਪੁਸਤਕ ਦੂਜੀ ਪੁਸਤਕ ਨਾਲੋਂ ਸ਼੍ਰੇਸ਼ਠਤਰ ਹੈ।",
      degree: "ਅਧਿਕਤਰ ਅਵਸਥਾ (Comparative Degree)",
      expl: "‘ਸ਼੍ਰੇਸ਼ਠਤਰ’ ਵਿੱਚ ‘ਤਰ’ ਪਿਛੇਤਰ ਦੋ ਵਸਤਾਂ ਦੀ ਤੁਲਨਾ ਲਈ ਅਧਿਕਤਰ ਅਵਸਥਾ ਦਰਸਾਉਂਦਾ ਹੈ।",
    },
  ];

  const chosen = rng.pickOne(hardSentences);
  const stem = rng.pickOne(CP005_F03_HARD_TEMPLATES)(chosen.sentence);
  const distractors = [
    ...degreeCategories.filter((c) => c !== chosen.degree),
    "ਸੰਯੁਕਤ ਅਵਸਥਾ (Compound Degree)",
    "ਕਾਰਕੀ ਅਵਸਥਾ (Case Degree)",
  ];

  return assembleCP005Question({
    familyId: "F03",
    seed,
    difficulty,
    stem,
    correctAnswer: chosen.degree,
    distractors,
    explanation: chosen.expl,
    authorityIds: ["PUN-AUTH-ADJ-DEGREE-CONTEXT"],
  });
}

// -------------------------------------------------------------------------
// FAMILY 4: Adjective Agreement & Inflection (ਵਿਕਾਰੀ/ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਲਿੰਗ-ਵਚਨ ਅਨੁਕੂਲਤਾ)
// -------------------------------------------------------------------------

const CP005_F04_EASY_TEMPLATES = [
  (adj: string) => `ਵਿਆਕਰਣਕ ਵਰਗੀਕਰਨ ਅਨੁਸਾਰ ਵਿਸ਼ੇਸ਼ਣ ‘${adj}’ ਕਿਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
  (adj: string) => `ਕੀ ਵਿਸ਼ੇਸ਼ਣ ‘${adj}’ ਨਾਂਵ ਦੇ ਲਿੰਗ ਜਾਂ ਵਚਨ ਬਦਲਣ ਨਾਲ ਬਦਲਦਾ ਹੈ (ਵਿਕਾਰੀ) ਜਾਂ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ (ਅਵਿਕਾਰੀ)?`,
];

export function generateCP005F04(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  if (difficulty === "Easy") {
    const item = rng.pickOne(ADJECTIVE_AGREEMENT_ITEMS);
    const stem = rng.pickOne(CP005_F04_EASY_TEMPLATES)(item.masculineSingular);

    const correctAnswer = item.isDeclinable
      ? "ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ (ਜੋ ਲਿੰਗ/ਵਚਨ ਅਨੁਸਾਰ ਰੂਪ ਬਦਲਦਾ ਹੈ)"
      : "ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ (ਜੋ ਹਰ ਹਾਲਤ ਵਿੱਚ ਇੱਕ ਸਮਾਨ ਰਹਿੰਦਾ ਹੈ)";

    const distractors = [
      item.isDeclinable
        ? "ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ (ਜੋ ਹਰ ਹਾਲਤ ਵਿੱਚ ਇੱਕ ਸਮਾਨ ਰਹਿੰਦਾ ਹੈ)"
        : "ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ (ਜੋ ਲਿੰਗ/ਵਚਨ ਅਨੁਸਾਰ ਰੂਪ ਬਦਲਦਾ ਹੈ)",
      "ਪੜਨਾਂਵੀ ਵਿਸ਼ੇਸ਼ਣ",
      "ਸੰਖਿਆ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ",
      "ਪਰਿਮਾਣ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ",
    ];

    return assembleCP005Question({
      familyId: "F04",
      seed,
      difficulty,
      stem,
      correctAnswer,
      distractors,
      explanation: item.notePa,
      authorityIds: ["PUN-AUTH-ADJ-DECLENSION-TYPE"],
    });
  }

  if (difficulty === "Medium") {
    // Agreement fill in the blank
    const item = rng.pickOne(ADJECTIVE_AGREEMENT_ITEMS);
    const targetCase = rng.pickOne([
      "mascPlural",
      "femSingular",
      "femPlural",
    ] as const);

    let nounPhrase: string;
    let correctAnswer: string;
    let explanationContext: string;

    if (item.isDeclinable) {
      if (targetCase === "mascPlural") {
        nounPhrase = `ਚਾਰ ______ (${item.masculineSingular}) ${item.exampleNounMasc}ੇ`;
        correctAnswer = item.masculinePlural;
        explanationContext = `ਪੁਲਿੰਗ ਬਹੁਵਚਨ ਨਾਂਵ ਨਾਲ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਦਾ ਰੂਪ ‘${item.masculinePlural}’ ਲੱਗੇਗਾ।`;
      } else if (targetCase === "femSingular") {
        nounPhrase = `ਇੱਕ ______ (${item.masculineSingular}) ${item.exampleNounFem}`;
        correctAnswer = item.feminineSingular;
        explanationContext = `ਇਸਤਰੀ ਲਿੰਗ ਇੱਕਵਚਨ ਨਾਂਵ ਨਾਲ ਵਿਸ਼ੇਸ਼ਣ ਦਾ ਰੂਪ ‘${item.feminineSingular}’ ਲੱਗੇਗਾ।`;
      } else {
        nounPhrase = `ਕਈ ______ (${item.masculineSingular}) ${item.exampleNounFem}ਾਂ`;
        correctAnswer = item.femininePlural;
        explanationContext = `ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ਨਾਂਵ ਨਾਲ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਦਾ ਰੂਪ ‘${item.femininePlural}’ ਲੱਗੇਗਾ।`;
      }
    } else {
      // Indeclinable
      nounPhrase = `ਸਾਰੇ ______ (${item.masculineSingular}) ${item.exampleNounMasc}`;
      correctAnswer = item.masculineSingular;
      explanationContext = `‘${item.masculineSingular}’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ, ਇਸ ਦਾ ਰੂਪ ਲਿੰਗ ਜਾਂ ਵਚਨ ਬਦਲਣ ਨਾਲ ਨਹੀਂ ਬਦਲਦਾ।`;
    }

    const stem = `ਹੇਠ ਲਿਖੇ ਸ਼ਬਦ-ਜੁੱਟ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਵਿਸ਼ੇਸ਼ਣ ਦਾ ਵਿਆਕਰਣਕ ਤੌਰ 'ਤੇ ਸ਼ੁੱਧ ਰੂਪ ਚੁਣੋ:\n“${nounPhrase}”`;

    const allOptions = item.isDeclinable
      ? [
          item.masculineSingular,
          item.masculinePlural,
          item.feminineSingular,
          item.femininePlural,
          item.masculineSingular + "ਵਾਲਾ",
        ]
      : [
          item.masculineSingular,
          item.masculineSingular + "ੇ",
          item.masculineSingular + "ੀ",
          item.masculineSingular + "ੀਆਂ",
          item.masculineSingular + "ਾਂ",
          item.masculineSingular + "ਵਾਲਾ",
        ];
    const distractors = Array.from(new Set(allOptions)).filter((o) => o !== correctAnswer);

    return assembleCP005Question({
      familyId: "F04",
      seed,
      difficulty,
      stem,
      correctAnswer,
      distractors,
      explanation: `${item.notePa} ${explanationContext}`,
      authorityIds: ["PUN-AUTH-ADJ-AGREEMENT-FILL"],
    });
  }

  // Hard Difficulty: Sentence Agreement Error Detection
  const agreementSentenceCases = [
    {
      correct: "ਸੋਹਣੀਆਂ ਕੁੜੀਆਂ ਨੇ ਮਿੱਠੇ ਗੀਤ ਗਾਏ।",
      incorrects: [
        "ਸੋਹਣਾ ਕੁੜੀਆਂ ਨੇ ਮਿੱਠਾ ਗੀਤ ਗਾਏ।",
        "ਸੋਹਣੇ ਕੁੜੀਆਂ ਨੇ ਮਿੱਠੀਆਂ ਗੀਤ ਗਾਏ।",
        "ਸੋਹਣੀ ਕੁੜੀਆਂ ਨੇ ਮਿੱਠੇ ਗੀਤ ਗਾਏ।",
      ],
      reason: "ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ‘ਕੁੜੀਆਂ’ ਨਾਲ ‘ਸੋਹਣੀਆਂ’ ਅਤੇ ਪੁਲਿੰਗ ਬਹੁਵਚਨ ‘ਗੀਤ’ ਨਾਲ ‘ਮਿੱਠੇ’ ਵਿਸ਼ੇਸ਼ਣ ਆਉਣਾ ਚਾਹੀਦਾ ਹੈ।",
    },
    {
      correct: "ਕਾਲੇ ਘੋੜੇ ਮੈਦਾਨ ਵਿੱਚ ਤੇਜ਼ ਦੌੜ ਰਹੇ ਹਨ।",
      incorrects: [
        "ਕਾਲਾ ਘੋੜੇ ਮੈਦਾਨ ਵਿੱਚ ਤੇਜ਼ ਦੌੜ ਰਹੇ ਹਨ।",
        "ਕਾਲੀ ਘੋੜੇ ਮੈਦਾਨ ਵਿੱਚ ਤੇਜ਼ ਦੌੜ ਰਹੇ ਹਨ।",
        "ਕਾਲੀਆਂ ਘੋੜੇ ਮੈਦਾਨ ਵਿੱਚ ਤੇਜ਼ ਦੌੜ ਰਹੇ ਹਨ।",
      ],
      reason: "ਪੁਲਿੰਗ ਬਹੁਵਚਨ ‘ਘੋੜੇ’ ਨਾਲ ਵਿਸ਼ੇਸ਼ਣ ਦਾ ਰੂਪ ‘ਕਾਲੇ’ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਨਾ ਕਿ ‘ਕਾਲਾ’।",
    },
    {
      correct: "ਇਮਾਨਦਾਰ ਕਰਮਚਾਰੀਆਂ ਦਾ ਸਭ ਆਦਰ ਕਰਦੇ ਹਨ।",
      incorrects: [
        "ਇਮਾਨਦਾਰੇ ਕਰਮਚਾਰੀਆਂ ਦਾ ਸਭ ਆਦਰ ਕਰਦੇ ਹਨ।",
        "ਇਮਾਨਦਾਰੀ ਕਰਮਚਾਰੀਆਂ ਦਾ ਸਭ ਆਦਰ ਕਰਦੇ ਹਨ।",
        "ਇਮਾਨਦਾਰੀਆਂ ਕਰਮਚਾਰੀਆਂ ਦਾ ਸਭ ਆਦਰ ਕਰਦੇ ਹਨ।",
      ],
      reason: "‘ਇਮਾਨਦਾਰ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ, ਇਸ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਇਮਾਨਦਾਰੇ’ ਜਾਂ ‘ਇਮਾਨਦਾਰੀਆਂ’ ਨਹੀਂ ਬਣਦਾ।",
    },
    {
      correct: "ਵੱਡੀਆਂ ਇਮਾਰਤਾਂ ਭੂਚਾਲ ਨਾਲ ਹਿੱਲ ਗਈਆਂ।",
      incorrects: [
        "ਵੱਡਾ ਇਮਾਰਤਾਂ ਭੂਚਾਲ ਨਾਲ ਹਿੱਲ ਗਈਆਂ।",
        "ਵੱਡੇ ਇਮਾਰਤਾਂ ਭੂਚਾਲ ਨਾਲ ਹਿੱਲ ਗਈਆਂ।",
        "ਵੱਡੀ ਇਮਾਰਤਾਂ ਭੂਚਾਲ ਨਾਲ ਹਿੱਲ ਗਈਆਂ।",
      ],
      reason: "ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ‘ਇਮਾਰਤਾਂ’ ਨਾਲ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ‘ਵੱਡੀਆਂ’ ਲੱਗੇਗਾ।",
    },
    {
      correct: "ਉਸ ਕੋਲ ਚਾਰ ਸੁੰਦਰ ਤਸਵੀਰਾਂ ਹਨ।",
      incorrects: [
        "ਉਸ ਕੋਲ ਚਾਰ ਸੁੰਦਰੀਆਂ ਤਸਵੀਰਾਂ ਹਨ।",
        "ਉਸ ਕੋਲ ਚਾਰ ਸੁੰਦਰੇ ਤਸਵੀਰਾਂ ਹਨ।",
        "ਉਸ ਕੋਲ ਚਾਰ ਸੁੰਦਰੀ ਤਸਵੀਰਾਂ ਹਨ।",
      ],
      reason: "‘ਸੁੰਦਰ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ, ਇਸ ਲਈ ਬਹੁਵਚਨ ਵਿੱਚ ਵੀ ਇਸ ਦਾ ਰੂਪ ‘ਸੁੰਦਰ’ ਹੀ ਰਹਿੰਦਾ ਹੈ।",
    },
  ];

  const chosenCase = rng.pickOne(agreementSentenceCases);
  const stem = `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਵਿਸ਼ੇਸ਼ਣ-ਨਾਂਵ ਲਿੰਗ-ਵਚਨ ਸੁਮੇਲ (Agreement) ਪੱਖੋਂ ਬਿਲਕੁਲ ਸ਼ੁੱਧ ਵਾਕ ਕਿਹੜਾ ਹੈ?`;

  return assembleCP005Question({
    familyId: "F04",
    seed,
    difficulty,
    stem,
    correctAnswer: chosenCase.correct,
    distractors: chosenCase.incorrects,
    explanation: chosenCase.reason,
    authorityIds: ["PUN-AUTH-ADJ-AGREEMENT-SENTENCE"],
  });
}
