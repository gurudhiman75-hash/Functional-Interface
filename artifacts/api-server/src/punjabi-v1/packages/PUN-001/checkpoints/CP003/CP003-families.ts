/**
 * CP003 Question Families:
 * CP003-F01: Nominal Subtype Classification (ਨਾਂਵ/ਪੜਨਾਂਵ ਸ਼੍ਰੇਣੀ ਵੰਡ)
 * CP003-F02: In-Sentence Functional Extraction (ਵਾਕ ਵਿੱਚੋਂ ਸ਼ਨਾਖ਼ਤ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  NOUN_CATEGORIES,
  PRONOUN_CATEGORIES,
  type NounCategoryItem,
  type PronounCategoryItem,
} from "./CP003-authorities";

function assembleCP003Question(input: {
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

  const filteredDistractors = input.distractors.filter(
    (d) => d.trim() !== input.correctAnswer.trim()
  );
  if (filteredDistractors.length < 3) {
    throw new Error(
      `Insufficient distinct distractors for CP003 ${input.familyId}. Got ${filteredDistractors.length}`
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
    id: `PUN-001-CP003-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP003",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP003-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

const CP003_NOUN_STEM_TEMPLATES = [
  (w: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${w}’ ਕਿਹੜਾ ਨਾਂਵ ਹੈ?`,
  (w: string) => `‘${w}’ ਦਾ ਸੰਬੰਧ ਕਿਸ ਨਾਂਵ ਸ਼੍ਰੇਣੀ ਨਾਲ ਹੈ?`,
  (w: string) => `‘${w}’ ਨਾਂਵ ਦੀ ਕਿਹੜੀ ਕਿਸਮ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
  (w: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸ਼ਬਦ ‘${w}’ ਕਿਸ ਨਾਂਵ-ਵੰਨਗੀ ਅਧੀਨ ਆਉਂਦਾ ਹੈ?`,
  (w: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਦੀ ਸਹੀ ਨਾਂਵ ਸ਼੍ਰੇਣੀ ਚੁਣੋ:`,
];

const CP003_PRONOUN_STEM_TEMPLATES = [
  (w: string) => `ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਅਨੁਸਾਰ ‘${w}’ ਕਿਹੜਾ ਪੜਨਾਂਵ ਹੈ?`,
  (w: string) => `‘${w}’ ਦਾ ਸੰਬੰਧ ਕਿਸ ਪੜਨਾਂਵ ਸ਼੍ਰੇਣੀ ਨਾਲ ਹੈ?`,
  (w: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸ਼ਬਦ ‘${w}’ ਪੜਨਾਂਵ ਦੀ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਪੜਨਾਂਵ ਦੀ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਪ੍ਰਮਾਣਿਕ ਉਦਾਹਰਨ ਹੈ?`,
  (w: string) => `ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${w}’ ਕਿਸ ਵਰਗ ਦਾ ਪੜਨਾਂਵ ਹੈ?`,
];

const CP003_F02_EASY_TEMPLATES = [
  (cat: string, s: string) => `ਹੇਠ ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ‘${cat}’ ਕਿਹੜਾ ਸ਼ਬਦ ਹੈ?\n\n“${s}”`,
  (cat: string, s: string) => `ਵਾਕ “${s}” ਵਿੱਚੋਂ ‘${cat}’ ਸ਼ਬਦ ਚੁਣੋ:`,
];

const CP003_F02_MED_TEMPLATES = [
  (cat: string, s: string) => `ਵਾਕ ਵਿੱਚੋਂ ‘${cat}’ ਦੀ ਸਹੀ ਸ਼ਨਾਖ਼ਤ ਕਰੋ:\n\n“${s}”`,
  (cat: string, s: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਵਿੱਚ ‘${cat}’ ਵਜੋਂ ਕਿਹੜਾ ਪਦ ਆਇਆ ਹੈ?\n“${s}”`,
];

const CP003_F02_HARD_TEMPLATES = [
  (cat: string, s: string) => `“${s}” — ਇਸ ਕਥਨ ਵਿੱਚ ‘${cat}’ ਵਜੋਂ ਕਿਹੜਾ ਪਦ ਵਰਤਿਆ ਗਿਆ ਹੈ?`,
  (cat: string, s: string) => `ਵਿਆਕਰਣਕ ਕਾਰਜ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਵਿਚਲੇ ‘${cat}’ ਦੀ ਪਛਾਣ ਕਰੋ:`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Nominal Subtype Classification (ਨਾਂਵ/ਪੜਨਾਂਵ ਸ਼੍ਰੇਣੀ ਵੰਡ)
// -------------------------------------------------------------------------
export function generateCP003F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  if (difficulty === "Easy") {
    const askAboutNoun = rng.next() > 0.5;
    if (askAboutNoun) {
      const category = rng.pickOne(NOUN_CATEGORIES);
      const exampleWord = rng.pickOne(category.examples);
      const distractorCategories = NOUN_CATEGORIES.filter((c) => c.subtypeId !== category.subtypeId).map(
        (c) => c.namePa
      );
      return assembleCP003Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: `ਸਧਾਰਨ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਸ਼ਬਦ ‘${exampleWord}’ ਨਾਂਵ ਦੀ ਕਿਹੜੀ ਕਿਸਮ ਹੈ?`,
        correctAnswer: category.namePa,
        distractors: distractorCategories,
        explanation: `‘${exampleWord}’ ${category.namePa} ਹੈ। (${category.definitionPa})`,
        authorityIds: [`PUN-AUTH-NOUN-${category.subtypeId}`],
      });
    } else {
      const pronounCat = rng.pickOne(PRONOUN_CATEGORIES);
      const exampleWord = rng.pickOne(pronounCat.examples);
      const distractorPronouns = PRONOUN_CATEGORIES.filter((c) => c.subtypeId !== pronounCat.subtypeId).map(
        (c) => c.namePa
      );
      return assembleCP003Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: `ਸਧਾਰਨ ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਵਿੱਚ ਸ਼ਬਦ ‘${exampleWord}’ ਪੜਨਾਂਵ ਦੀ ਕਿਹੜੀ ਕਿਸਮ ਹੈ?`,
        correctAnswer: pronounCat.namePa,
        distractors: distractorPronouns,
        explanation: `ਸ਼ਬਦ ‘${exampleWord}’ ${pronounCat.namePa} ਹੈ। (${pronounCat.definitionPa})`,
        authorityIds: [`PUN-AUTH-PRONOUN-${pronounCat.subtypeId}`],
      });
    }
  }

  if (difficulty === "Medium") {
    // Direct subtype identification for a noun
    const category = rng.pickOne(NOUN_CATEGORIES);
    const exampleWord = rng.pickOne(category.examples);
    const stemTemplate = rng.pickOne(CP003_NOUN_STEM_TEMPLATES);

    const distractorCategories = NOUN_CATEGORIES.filter((c) => c.subtypeId !== category.subtypeId).map(
      (c) => c.namePa
    );

    return assembleCP003Question({
      familyId: "F01",
      seed,
      difficulty,
      stem: stemTemplate(exampleWord),
      correctAnswer: category.namePa,
      distractors: distractorCategories,
      explanation:
        `‘${exampleWord}’ ${category.namePa} ਹੈ। (${category.definitionPa})`,
      authorityIds: [`PUN-AUTH-NOUN-${category.subtypeId}`],
    });
  }

  // Hard Difficulty: Pronoun Subtype or Subtle Distinction (e.g. ਨਿੱਜ-ਵਾਚਕ vs ਸੰਬੰਧ-ਵਾਚਕ)
  const pronounCat = rng.pickOne(PRONOUN_CATEGORIES);
  const exampleWord = rng.pickOne(pronounCat.examples);
  const stemTemplate = rng.pickOne(CP003_PRONOUN_STEM_TEMPLATES);

  const distractorPronouns = PRONOUN_CATEGORIES.filter((c) => c.subtypeId !== pronounCat.subtypeId).map(
    (c) => c.namePa
  );

  return assembleCP003Question({
    familyId: "F01",
    seed,
    difficulty,
    stem: stemTemplate(exampleWord),
    correctAnswer: pronounCat.namePa,
    distractors: distractorPronouns,
    explanation:
      `ਸ਼ਬਦ ‘${exampleWord}’ ${pronounCat.namePa} ਹੈ। (${pronounCat.definitionPa})`,
    authorityIds: [`PUN-AUTH-PRONOUN-${pronounCat.subtypeId}`],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: In-Sentence Functional Extraction (ਵਾਕ ਵਿੱਚੋਂ ਸ਼ਨਾਖ਼ਤ)
// -------------------------------------------------------------------------
interface InSentenceNominalCase {
  sentence: string;
  targetWord: string;
  categoryLabel: string;
  explanation: string;
}

const SENTENCE_NOMINAL_CASES: readonly InSentenceNominalCase[] = [
  {
    sentence: "ਸਾਡੀ ਫ਼ੌਜ ਨੇ ਦੇਸ਼ ਦੀਆਂ ਸਰਹੱਦਾਂ ਦੀ ਬਹਾਦਰੀ ਨਾਲ ਰਾਖੀ ਕੀਤੀ।",
    targetWord: "ਫ਼ੌਜ",
    categoryLabel: "ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "ਇਸ ਵਾਕ ਵਿੱਚ ‘ਫ਼ੌਜ’ ਜਵਾਨਾਂ ਦੇ ਸਮੂਹ ਜਾਂ ਇਕੱਠ ਦਾ ਬੋਧ ਕਰਵਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਗ਼ਰੀਬੀ ਕਾਰਨ ਕਈ ਬੱਚੇ ਸਕੂਲ ਨਹੀਂ ਜਾ ਪਾਉਂਦੇ।",
    targetWord: "ਗ਼ਰੀਬੀ",
    categoryLabel: "ਭਾਵ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਗ਼ਰੀਬੀ’ ਨੂੰ ਛੋਹਿਆ ਜਾਂ ਵੇਖਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ, ਕੇਵਲ ਮਹਿਸੂस ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਭਾਵ-ਵਾਚਕ ਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਮਨੁੱਖ ਨੂੰ ਸੋਨਾ ਅਤੇ ਚਾਂਦੀ ਨਾਲੋਂ ਵਿੱਦਿਆ ਨੂੰ ਵੱਧ ਮਹੱਤਵ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।",
    targetWord: "ਸੋਨਾ",
    categoryLabel: "ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਸੋਨਾ’ ਇੱਕ ਤੋਲੀ ਜਾਂ ਮਿਣੀ ਜਾਣ ਵਾਲੀ ਧਾਤ ਹੈ, ਇਸ ਲਈ ਇਹ ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਉਹ ਆਪਣੇ ਆਪ ਸਾਰਾ ਜ਼ਰੂਰੀ ਕੰਮ ਮੁਕੰਮਲ ਕਰ ਲਵੇਗਾ।",
    targetWord: "ਆਪਣੇ ਆਪ",
    categoryLabel: "ਨਿੱਜ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਆਪਣੇ ਆਪ’ ਕਰਤਾ ਨਾਲ ਆ ਕੇ ਨਿੱਜਤਾ ਦਾ ਬੋਧ ਕਰਵਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਨਿੱਜ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਜੋ ਮਿਹਨਤ ਕਰੇਗਾ, ਸੋ ਜ਼ਿੰਦਗੀ ਵਿੱਚ ਸਫ਼ਲ ਹੋਵੇਗਾ।",
    targetWord: "ਜੋ",
    categoryLabel: "ਸੰਬੰਧ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਜੋ’ ਦੋ ਉਪਵਾਕਾਂ ਨੂੰ ਜੋੜਨ ਵਾਲਾ ਸੰਬੰਧ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਦਰਵਾਜ਼ੇ 'ਤੇ ਕੌਣ ਖੜ੍ਹਾ ਹੈ?",
    targetWord: "ਕੌਣ",
    categoryLabel: "ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਕੌਣ’ ਪੁੱਛ-ਗਿੱਛ ਜਾਂ ਪ੍ਰਸ਼ਨ ਪੁੱਛਣ ਲਈ ਵਰਤਿਆ ਗਿਆ ਪੜਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਸ਼ਹੀਦ ਭਗਤ ਸਿੰਘ ਨੇ ਦੇਸ਼ ਦੀ ਆਜ਼ਾਦੀ ਲਈ ਆਪਣਾ ਆਪਾ ਕੁਰਬਾਨ ਕਰ ਦਿੱਤਾ。",
    targetWord: "ਭਗਤ ਸਿੰਘ",
    categoryLabel: "ਖ਼ਾਸ ਨਾਂਵ",
    explanation: "‘ਭਗਤ ਸਿੰਘ’ ਇੱਕ ਮਹਾਨ ਇਤਿਹਾਸਕ ਸ਼ਖ਼ਸੀਅਤ ਦਾ ਖ਼ਾਸ ਨਾਂ ਹੈ, ਇਸ ਲਈ ਇਹ ਖ਼ਾਸ ਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਗਰਮੀਆਂ ਦੀ ਰੁੱਤ ਵਿੱਚ ਬੱਚਿਆਂ ਦਾ ਇੱਜੜ ਨਹਿਰ ਕਿਨਾਰੇ ਖੇਡ ਰਿਹਾ ਸੀ。",
    targetWord: "ਇੱਜੜ",
    categoryLabel: "ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਇੱਜੜ’ ਪਸ਼ੂਆਂ ਜਾਂ ਜੀਵਾਂ ਦੇ ਸਮੂਹ ਲਈ ਵਰਤਿਆ ਗਿਆ ਸ਼ਬਦ ਹੈ, ਇਸ ਲਈ ਇਹ ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਕਿਸਾਨਾਂ ਨੇ ਮੰਡੀ ਵਿੱਚ ਆਪਣੀ ਕਣਕ ਵੇਚਣ ਲਈ ਢੇਰੀ ਲਗਾ ਦਿੱਤੀ。",
    targetWord: "ਕਣਕ",
    categoryLabel: "ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਕਣਕ’ ਤੋਲਣ ਵਾਲੀ ਅਨਾਜ ਵਸਤੂ ਹੈ, ਇਸ ਲਈ ਇਹ ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਸੱਚਾਈ ਦੀ ਹਮੇਸ਼ਾ ਝੂਠ ਉੱਤੇ ਸ਼ਾਨਦਾਰ ਜਿੱਤ ਹੁੰਦੀ ਹੈ。",
    targetWord: "ਸੱਚਾਈ",
    categoryLabel: "ਭਾਵ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਸੱਚਾਈ’ ਇੱਕ ਗੁਣ ਜਾਂ ਅਹਿਸਾਸ ਹੈ ਜਿਸ ਨੂੰ ਵੇਖਿਆ ਨਹੀਂ ਮਹਿਸੂस ਕੀਤਾ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਭਾਵ-ਵਾਚਕ ਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਮਿਠਾਸ ਭਰੀ ਬੋਲੀ ਨਾਲ ਹਰ ਕੋਈ ਆਪਣਾ ਬਣ ਜਾਂਦਾ ਹੈ。",
    targetWord: "ਮਿਠਾਸ",
    categoryLabel: "ਭਾਵ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਮਿਠਾਸ’ ਮਹਿਸੂਸ ਹੋਣ ਵਾਲਾ ਭਾਵ ਹੈ, ਇਸ ਲਈ ਇਹ ਭਾਵ-ਵਾਚਕ ਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਅਧਿਆਪਕ ਦੇ ਆਉਣ 'ਤੇ ਸਾਰੀ ਜਮਾਤ ਪੜ੍ਹਾਈ ਵਿੱਚ ਰੁੱਝ ਗਈ。",
    targetWord: "ਜਮਾਤ",
    categoryLabel: "ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਜਮਾਤ’ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਸਮੂਹ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਤੁਸੀਂ ਕੱਲ੍ਹ ਸਮੇਂ ਸਿਰ ਦਫ਼ਤਰ ਜ਼ਰੂਰ ਪਹੁੰਚ ਜਾਣਾ。",
    targetWord: "ਤੁਸੀਂ",
    categoryLabel: "ਪੁਰਖ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਤੁਸੀਂ’ ਸੁਣਨ ਵਾਲੇ ਵਿਅਕਤੀ (ਮੱਧਮ ਪੁਰਖ) ਲਈ ਵਰਤਿਆ ਗਿਆ ਪੜਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਕੋਈ ਬਾਹਰ ਖੜ੍ਹਾ ਉੱਚੀ ਆਵਾਜ਼ ਵਿੱਚ ਬੁਲਾ ਰਿਹਾ ਹੈ。",
    targetWord: "ਕੋਈ",
    categoryLabel: "ਅਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਕੋਈ’ ਅਣਦੱਸੇ ਅਤੇ ਅਨਿਸ਼ਚਿਤ ਵਿਅਕਤੀ ਲਈ ਵਰਤਿਆ ਗਿਆ ਅਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਤੁਹਾਡੇ ਹੱਥ ਵਿੱਚ ਕੀ ਫੜਿਆ ਹੋਇਆ ਹੈ?",
    targetWord: "ਕੀ",
    categoryLabel: "ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਕੀ’ ਕਿਸੇ ਚੀਜ਼ ਬਾਰੇ ਪੁੱਛ-ਗਿੱਛ ਕਰਨ ਵਾਲਾ ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਸੁਖਵਿੰਦਰ ਨੇ ਆਪਣਾ ਜ਼ਰੂਰੀ ਕੰਮ ਖ਼ੁਦ ਹੀ ਮੁਕੰਮਲ ਕਰ ਲਿਆ。",
    targetWord: "ਖ਼ੁਦ",
    categoryLabel: "ਨਿੱਜ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਖ਼ੁਦ’ ਕਰਤਾ ਦੀ ਨਿੱਜਤਾ ਦਾ ਬੋਧ ਕਰਵਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਨਿੱਜ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ。",
  },
  {
    sentence: "ਅੰਮ੍ਰਿਤਸਰ ਵਿਖੇ ਸਥਿਤ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਸਿੱਖ ਧਰਮ ਦਾ ਕੇਂਦਰ ਹੈ।",
    targetWord: "ਅੰਮ੍ਰਿਤਸਰ",
    categoryLabel: "ਖ਼ਾਸ ਨਾਂਵ",
    explanation: "‘ਅੰਮ੍ਰਿਤਸਰ’ ਇੱਕ ਖ਼ਾਸ ਅਤੇ ਇਤਿਹਾਸਕ ਸ਼ਹਿਰ ਦਾ ਨਾਂ ਹੈ, ਇਸ ਲਈ ਇਹ ਖ਼ਾਸ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਦਰਿਆ ਵਿੱਚ ਪਾਣੀ ਦਾ ਵਹਾਅ ਬਹੁਤ ਜ਼ਿਆਦਾ ਤੇਜ਼ ਸੀ।",
    targetWord: "ਦਰਿਆ",
    categoryLabel: "ਆਮ ਨਾਂਵ",
    explanation: "‘ਦਰਿਆ’ ਸਮੁੱਚੀ ਦਰਿਆ ਸ਼੍ਰੇਣੀ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਆਮ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਪਿੰਡ ਦੀ ਪੰਚਾਇਤ ਨੇ ਝਗੜੇ ਦਾ ਨਿਬੇੜਾ ਬੜੇ ਸੁਚੱਜੇ ਢੰਗ ਨਾਲ ਕੀਤਾ।",
    targetWord: "ਪੰਚਾਇਤ",
    categoryLabel: "ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਪੰਚਾਇਤ’ ਪੰਚਾਂ ਦੇ ਸਮੂਹ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਦੁਕਾਨਦਾਰ ਨੇ ਖ਼ਾਲਸ ਸਰ੍ਹੋਂ ਦਾ ਤੇਲ ਗਾਹਕ ਨੂੰ ਵੇਚਿਆ।",
    targetWord: "ਤੇਲ",
    categoryLabel: "ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਤੇਲ’ ਤੋਲੀ ਜਾਂ ਮਿਣੀ ਜਾਣ ਵਾਲੀ ਤਰਲ ਵਸਤੂ ਹੈ, ਇਸ ਲਈ ਇਹ ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਨਿਮਰਤਾ ਅਤੇ ਸਬਰ ਮਨੁੱਖ ਦੇ ਜੀਵਨ ਨੂੰ ਉੱਚਾ ਚੁੱਕਦੇ ਹਨ।",
    targetWord: "ਨਿਮਰਤਾ",
    categoryLabel: "ਭਾਵ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਨਿਮਰਤਾ’ ਅੰਦਰੂਨੀ ਗੁਣ ਜਾਂ ਭਾਵ ਹੈ ਜਿਸ ਨੂੰ ਵੇਖਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ, ਇਸ ਲਈ ਇਹ ਭਾਵ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਉਸ ਦੀ ਅਣਥੱਕ ਕੁਰਬਾਨੀ ਸਦਕਾ ਦੇਸ਼ ਆਜ਼ਾਦ ਹੋਇਆ ਸੀ।",
    targetWord: "ਕੁਰਬਾਨੀ",
    categoryLabel: "ਭਾਵ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਕੁਰਬਾਨੀ’ ਇੱਕ ਅਹਿਸਾਸ ਅਤੇ ਭਾਵ ਹੈ, ਇਸ ਲਈ ਇਹ ਭਾਵ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਬੱਚਿਆਂ ਦੀ ਟੋਲੀ ਪਾਰਕ ਵਿੱਚ ਫੁੱਲ ਤੋੜ ਰਹੀ ਸੀ।",
    targetWord: "ਟੋਲੀ",
    categoryLabel: "ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਟੋਲੀ’ ਬੱਚਿਆਂ ਦੇ ਸਮੂਹ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਸੁਨਿਆਰੇ ਨੇ ਸ਼ੁੱਧ ਸੋਨੇ ਦੇ ਗਹਿਣੇ ਬਣਾ ਕੇ ਤਿਆਰ ਕੀਤੇ।",
    targetWord: "ਸੋਨੇ",
    categoryLabel: "ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਸੋਨਾ’ ਧਾਤ ਹੈ ਜੋ ਤੋਲੀ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਜਿਹੜੇ ਮਿਹਨਤ ਕਰਦੇ ਹਨ, ਉਹ ਹੀ ਇਮਤਿਹਾਨ ਵਿੱਚ ਸਫ਼ਲ ਹੁੰਦੇ ਹਨ।",
    targetWord: "ਜਿਹੜੇ",
    categoryLabel: "ਸੰਬੰਧ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਜਿਹੜੇ’ ਦੋ ਉਪਵਾਕਾਂ ਨੂੰ ਜੋੜਨ ਵਾਲਾ ਸੰਬੰਧ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਇਹ ਮੇਰੀ ਪਸੰਦੀਦਾ ਇਤਿਹਾਸਕ ਪੁਸਤਕ ਹੈ।",
    targetWord: "ਇਹ",
    categoryLabel: "ਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਇਹ’ ਨੇੜੇ ਪਈ ਵਸਤੂ ਵੱਲ ਨਿਸ਼ਚੇ ਨਾਲ ਇਸ਼ਾਰਾ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਉਹ ਦੂਰ ਖੜ੍ਹਾ ਵਿਅਕਤੀ ਸਾਡੇ ਪਿੰਡ ਦਾ ਸਰਪੰਚ ਹੈ।",
    targetWord: "ਉਹ",
    categoryLabel: "ਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਉਹ’ ਦੂਰ ਦੀ ਵਸਤੂ/ਵਿਅਕਤੀ ਵੱਲ ਸੰਕੇਤ ਕਰਨ ਵਾਲਾ ਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਕਿਸ ਨੇ ਤੁਹਾਡੀ ਸੁੰਦਰ ਕਲਮ ਚੋਰੀ ਕੀਤੀ ਸੀ?",
    targetWord: "ਕਿਸ",
    categoryLabel: "ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਕਿਸ’ ਪ੍ਰਸ਼ਨ ਪੁੱਛਣ ਲਈ ਵਰਤਿਆ ਗਿਆ ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਅਸੀਂ ਸਾਰੇ ਭਾਰਤ ਵਾਸੀ ਇੱਕ ਦੂਜੇ ਦੇ ਭਰਾ ਹਾਂ।",
    targetWord: "ਅਸੀਂ",
    categoryLabel: "ਪੁਰਖ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਅਸੀਂ’ ਗੱਲ ਕਰਨ ਵਾਲੇ (ਉੱਤਮ ਪੁਰਖ ਬਹੁ-ਵਚਨ) ਲਈ ਵਰਤਿਆ ਗਿਆ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਤੁਸੀਂ ਮੇਰੇ ਘਰ ਕੱਲ੍ਹ ਸ਼ਾਮ ਨੂੰ ਜ਼ਰੂਰ ਆਉਣਾ।",
    targetWord: "ਤੁਸੀਂ",
    categoryLabel: "ਪੁਰਖ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਤੁਸੀਂ’ ਸੁਣਨ ਵਾਲੇ (ਮੱਧਮ ਪੁਰਖ) ਲਈ ਆਦਰ-ਸੂਚਕ ਪੁਰਖ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਉੱਥੇ ਕਈ ਲੋਕ ਬਿਨਾਂ ਕਿਸੇ ਕੰਮ ਤੋਂ ਘੁੰਮ ਰਹੇ ਸਨ।",
    targetWord: "ਕਈ",
    categoryLabel: "ਅਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਕਈ’ ਅਣਗਿਣਤ ਅਤੇ ਅਨਿਸ਼ਚਿਤ ਸੰਖਿਆ ਦਾ ਬੋਧ ਕਰਵਾਉਂਦਾ ਅਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਕੁਝ ਖਾਣ ਲਈ ਮੇਜ਼ ਉੱਤੇ ਰੱਖ ਦਿਓ।",
    targetWord: "ਕੁਝ",
    categoryLabel: "ਅਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਕੁਝ’ ਅਨਿਸ਼ਚਿਤ ਵਸਤੂ ਦਾ ਬੋਧ ਕਰਵਾਉਂਦਾ ਅਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਮੈਂ ਆਪਣੀ ਪੜ੍ਹਾਈ ਦਾ ਕੰਮ ਆਪ ਹੀ ਕਰਦਾ ਹਾਂ।",
    targetWord: "ਆਪ",
    categoryLabel: "ਨਿੱਜ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਆਪ’ ਕਰਤਾ ਨਾਲ ਆ ਕੇ ਨਿੱਜਤਾ ਦਾ ਪ੍ਰਗਟਾਵਾ ਕਰਦਾ ਨਿੱਜ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਸਤਲੁਜ ਦਰਿਆ ਪੰਜਾਬ ਦੀ ਧਰਤੀ ਨੂੰ ਹਰਾ-ਭਰਾ ਬਣਾਉਂਦਾ ਹੈ।",
    targetWord: "ਸਤਲੁਜ",
    categoryLabel: "ਖ਼ਾਸ ਨਾਂਵ",
    explanation: "‘ਸਤਲੁਜ’ ਪੰਜਾਬ ਦੇ ਇੱਕ ਵਿਸ਼ੇਸ਼ ਦਰਿਆ ਦਾ ਖ਼ਾਸ ਨਾਂ ਹੈ।",
  },
  {
    sentence: "ਕਮਰੇ ਵਿੱਚ ਮੇਜ਼ ਉੱਤੇ ਕਈ ਪੁਸਤਕਾਂ ਸਜਾਈਆਂ ਹੋਈਆਂ ਹਨ।",
    targetWord: "ਪੁਸਤਕਾਂ",
    categoryLabel: "ਆਮ ਨਾਂਵ",
    explanation: "‘ਪੁਸਤਕਾਂ’ ਸਮੁੱਚੀ ਸ਼੍ਰੇਣੀ ਨੂੰ ਦਰਸਾਉਂਦਾ ਆਮ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਲੋਕਾਂ ਦੀ ਭਾਰੀ ਭੀੜ ਨੇ ਮੰਤਰੀ ਜੀ ਦਾ ਸਵਾਗਤ ਕੀਤਾ।",
    targetWord: "ਭੀੜ",
    categoryLabel: "ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਭੀੜ’ ਇਕੱਠੇ ਹੋਏ ਲੋਕਾਂ ਦੇ ਸਮੂਹ ਨੂੰ ਦਰਸਾਉਂਦਾ ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਸਤਲੁਜ ਅਤੇ ਬਿਆਸ ਪੰਜਾਬ ਦੇ ਪ੍ਰਮੁੱਖ ਦਰਿਆ ਹਨ।",
    targetWord: "ਬਿਆਸ",
    categoryLabel: "ਖ਼ਾਸ ਨਾਂਵ",
    explanation: "‘ਬਿਆਸ’ ਪੰਜਾਬ ਦੇ ਵਿਸ਼ੇਸ਼ ਦਰਿਆ ਦਾ ਖ਼ਾਸ ਨਾਂ ਹੋਣ ਕਰਕੇ ਖ਼ਾਸ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਮਨੁੱਖ ਨੂੰ ਹਮੇਸ਼ਾ ਨਿਮਰਤਾ ਅਤੇ ਸਹਿਣਸ਼ੀਲਤਾ ਧਾਰਨ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।",
    targetWord: "ਨਿਮਰਤਾ",
    categoryLabel: "ਭਾਵ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਨਿਮਰਤਾ’ ਮਨ ਦਾ ਗੁਣ ਜਾਂ ਭਾਵ ਹੈ, ਇਸ ਲਈ ਇਹ ਭਾਵ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਹਲਵਾਈ ਨੇ ਸ਼ੁੱਧ ਦੁੱਧ ਅਤੇ ਖੰਡ ਤੋਂ ਮਿਠਾਈ ਤਿਆਰ ਕੀਤੀ।",
    targetWord: "ਦੁੱਧ",
    categoryLabel: "ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਦੁੱਧ’ ਮਿਣਨਯੋਗ ਪਦਾਰਥ ਹੋਣ ਕਰਕੇ ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਸਭਾ ਵਿੱਚ ਬਹੁਤ ਸਾਰੇ ਵਿਦਵਾਨ ਇਕੱਠੇ ਹੋਏ ਸਨ।",
    targetWord: "ਸਭਾ",
    categoryLabel: "ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਸਭਾ’ ਵਿਅਕਤੀਆਂ ਦੇ ਇਕੱਠ ਨੂੰ ਦਰਸਾਉਂਦਾ ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਤੁਸੀਂ ਕਿਹੜੀ ਜਮਾਤ ਵਿੱਚ ਪੜ੍ਹਦੇ ਹੋ?",
    targetWord: "ਕਿਹੜੀ",
    categoryLabel: "ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਕਿਹੜੀ’ ਪੁੱਛ-ਗਿੱਛ ਜਾਂ ਪ੍ਰਸ਼ਨ ਲਈ ਵਰਤਿਆ ਗਿਆ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਉਹ ਆਪ ਹੀ ਸਾਰੇ ਫ਼ੈਸਲੇ ਲੈਂਦਾ ਹੈ।",
    targetWord: "ਆਪ ਹੀ",
    categoryLabel: "ਨਿੱਜ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਆਪ ਹੀ’ ਨਿੱਜਤਾ ਦਾ ਬੋਧ ਕਰਵਾਉਂਦਾ ਨਿੱਜ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਕੋਈ ਬਾਹਰ ਦਰਵਾਜ਼ਾ ਖੜਕਾ ਰਿਹਾ ਹੈ।",
    targetWord: "ਕੋਈ",
    categoryLabel: "ਅਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਕੋਈ’ ਅਨਿਸ਼ਚਿਤ ਵਿਅਕਤੀ ਲਈ ਵਰਤਿਆ ਗਿਆ ਅਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਇਹ ਮੇਰਾ ਪਿੰਡ ਹੈ ਜਿੱਥੇ ਮੇਰਾ ਬਚਪਨ ਬੀਤਿਆ।",
    targetWord: "ਇਹ",
    categoryLabel: "ਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਇਹ’ ਨੇੜੇ ਦੇ ਨਾਂਵ ਵੱਲ ਸੰਕੇਤ ਕਰਨ ਵਾਲਾ ਨਿਸ਼ਚੇ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਮੈਂ ਰੋਜ਼ ਸਵੇਰੇ ਸੈਰ ਕਰਨ ਜਾਂਦਾ ਹਾਂ।",
    targetWord: "ਮੈਂ",
    categoryLabel: "ਪੁਰਖ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਮੈਂ’ ਉੱਤਮ ਪੁਰਖ (ਗੱਲ ਕਰਨ ਵਾਲੇ) ਲਈ ਵਰਤਿਆ ਗਿਆ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਜੋ ਬੀਜੋਗੇ, ਸੋ ਵੱਢੋਗੇ।",
    targetWord: "ਸੋ",
    categoryLabel: "ਸੰਬੰਧ-ਵਾਚਕ ਪੜਨਾਂਵ",
    explanation: "‘ਸੋ’ ਦੋ ਉਪਵਾਕਾਂ ਨੂੰ ਆਪਸ ਵਿੱਚ ਜੋੜਨ ਵਾਲਾ ਸੰਬੰਧ-ਵਾਚਕ ਪੜਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਕਲਾਕਾਰ ਨੇ ਕੈਨਵਸ ਉੱਤੇ ਸੁੰਦਰ ਕੁਦਰਤੀ ਦ੍ਰਿਸ਼ ਚਿਤਰਿਆ।",
    targetWord: "ਕਲਾਕਾਰ",
    categoryLabel: "ਆਮ ਨਾਂਵ",
    explanation: "‘ਕਲਾਕਾਰ’ ਸਮੁੱਚੀ ਸ਼੍ਰੇਣੀ ਲਈ ਵਰਤਿਆ ਗਿਆ ਆਮ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਹਸਪਤਾਲ ਵਿੱਚ ਮਰੀਜ਼ਾਂ ਦੀ ਦੇਖਭਾਲ ਚੰਗੀ ਤਰ੍ਹਾਂ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।",
    targetWord: "ਹਸਪਤਾਲ",
    categoryLabel: "ਆਮ ਨਾਂਵ",
    explanation: "‘ਹਸਪਤਾਲ’ ਇੱਕ ਆਮ ਸਥਾਨ ਦਾ ਬੋਧ ਕਰਵਾਉਂਦਾ ਆਮ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਸੁਨਿਆਰਾ ਚਾਂਦੀ ਦੇ ਭਾਂਡੇ ਪਾਲਿਸ਼ ਕਰ ਰਿਹਾ ਸੀ।",
    targetWord: "ਚਾਂਦੀ",
    categoryLabel: "ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਚਾਂਦੀ’ ਤੋਲਣਯੋਗ ਧਾਤ ਹੋਣ ਕਾਰਨ ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਇਮਾਨਦਾਰੀ ਸਭ ਤੋਂ ਉੱਤਮ ਨੀਤੀ ਹੈ।",
    targetWord: "ਇਮਾਨਦਾਰੀ",
    categoryLabel: "ਭਾਵ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਇਮਾਨਦਾਰੀ’ ਇੱਕ ਅਮੂਰਤ ਨੈਤਿਕ ਗੁਣ ਹੈ, ਇਸ ਲਈ ਇਹ ਭਾਵ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
  {
    sentence: "ਕਿਸਾਨਾਂ ਦੀ ਪੰਚਾਇਤ ਨੇ ਪਿੰਡ ਦੇ ਵਿਕਾਸ ਲਈ ਮਤਾ ਪਾਸ ਕੀਤਾ।",
    targetWord: "ਪੰਚਾਇਤ",
    categoryLabel: "ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ",
    explanation: "‘ਪੰਚਾਇਤ’ ਪੰਚਾਂ ਦੇ ਸਮੂਹ ਨੂੰ ਦਰਸਾਉਂਦਾ ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ ਹੈ।",
  },
];

export function generateCP003F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const selectedCase = rng.pickOne(SENTENCE_NOMINAL_CASES);

  // Distractors are other distinct words extracted from the sentence
  const rawWords = selectedCase.sentence
    .replace(/[।.,!?]/g, "")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w !== selectedCase.targetWord && w.length >= 2);

  const uniqueSentenceWords = Array.from(new Set(rawWords));
  const distinctDistractors = rng.pickDistinct(uniqueSentenceWords, 3);
  const templates = difficulty === "Easy" ? CP003_F02_EASY_TEMPLATES : difficulty === "Medium" ? CP003_F02_MED_TEMPLATES : CP003_F02_HARD_TEMPLATES;
  const stemTemplate = rng.pickOne(templates);

  return assembleCP003Question({
    familyId: "F02",
    seed,
    difficulty,
    stem: stemTemplate(selectedCase.categoryLabel, selectedCase.sentence),
    correctAnswer: selectedCase.targetWord,
    distractors: distinctDistractors,
    explanation: selectedCase.explanation,
    authorityIds: ["PUN-AUTH-NOMINAL-SENTENCE"],
  });
}
