/**
 * CP004 Question Families:
 * CP004-F01: Gender Transformation (ਲਿੰਗ ਬਦਲੋ)
 * CP004-F02: Number Transformation (ਵਚਨ ਬਦਲੋ)
 * CP004-F03: Sentence-level Agreement Inflection (ਵਾਕ-ਪੱਧਰੀ ਲਿੰਗ/ਵਚਨ ਰੂਪਾਂਤਰਣ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  GENDER_PAIRS,
  NUMBER_PAIRS,
  type GenderPair,
  type NumberPair,
} from "./CP004-authorities";

function assembleCP004Question(input: {
  familyId: string;
  seed: number;
  difficulty: PunjabiDifficulty;
  stem: string;
  correctAnswer: string;
  distractors: readonly string[];
  explanation: string;
  authorityIds: readonly string[];
}): PunjabiGeneratedQuestion {
  const diffOffset = input.difficulty === "Easy" ? 11111 : input.difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(input.seed + diffOffset);

  const filteredDistractors = Array.from(
    new Set(input.distractors.map((d) => d.trim()))
  ).filter((d) => d !== input.correctAnswer.trim());

  if (filteredDistractors.length < 3) {
    throw new Error(
      `Insufficient distinct distractors for CP004 ${input.familyId}. Got ${filteredDistractors.length}`
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
    id: `PUN-001-CP004-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP004",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP004-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

const CP004_F01_EASY_TEMPLATES = [
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਦਾ ਲਿੰਗ ਬਦਲ ਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:`,
  (w: string) => `‘${w}’ ਦਾ ਲਿੰਗ ਬਦਲਣ 'ਤੇ ਕਿਹੜਾ ਸ਼ਬਦ ਬਣੇਗਾ?`,
  (w: string) => `ਸਧਾਰਨ ਰੂਪ ਵਿੱਚ ‘${w}’ ਦਾ ਉਲਟ ਲਿੰਗ ਕਿਹੜਾ ਹੈ?`,
  (w: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਹੀ ਲਿੰਗ-ਜੋੜੀਦਾਰ ਚੁਣੋ:`,
];

const CP004_F01_MED_TEMPLATES = [
  (w: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${w}’ ਦਾ ਸਹੀ ਲਿੰਗ-ਰੂਪਾਂਤਰਣ ਕਿਹੜਾ ਹੈ?`,
  (w: string) => `ਵਿਆਕਰਣਕ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਲਿੰਗ ਪਰਿਵਰਤਨ ਦੱਸੋ:`,
  (w: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸ਼ੁੱਧ ਲਿੰਗ ਬਦਲਿਆ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
  (w: string) => `ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਇਸਤਰੀ/ਪੁਲਿੰਗ ਰੂਪ ਚੁਣੋ:`,
];

const CP004_F01_HARD_TEMPLATES = [
  (w: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਸ਼ੁੱਧ ਉਲਟ ਲਿੰਗ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
  (w: string) => `‘${w}’ ਦਾ ਵਿਸ਼ੇਸ਼ ਨਿਯਮਾਂ ਅਧੀਨ ਲਿੰਗ-ਰੂਪਾਂਤਰਿਤ ਰੂਪ ਪਛਾਣੋ:`,
  (w: string) => `ਹੇਠ ਲਿਖੇ ਸ਼ਬਦ ‘${w}’ ਦਾ ਪ੍ਰਮਾਣਿਕ ਲਿੰਗ ਬਦਲਿਆ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
  (w: string) => `ਅਨਿਯਮਿਤ/ਵਿਸ਼ੇਸ਼ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਸਹੀ ਲਿੰਗ ਰੂਪ ਦੱਸੋ:`,
];

const CP004_F02_EASY_TEMPLATES = [
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਦਾ ਵਚਨ ਬਦਲ ਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:`,
  (w: string) => `‘${w}’ ਦਾ ਵਚਨ ਬਦਲਣ 'ਤੇ ਕਿਹੜਾ ਸ਼ਬਦ ਬਣੇਗਾ?`,
  (w: string) => `ਸਧਾਰਨ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਬਹੁਵਚਨ/ਇਕਵਚਨ ਰੂਪ ਚੁਣੋ:`,
  (w: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਹੀ ਵਚਨ ਬਦਲਿਆ ਰੂਪ ਦੱਸੋ:`,
];

const CP004_F02_MED_TEMPLATES = [
  (w: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${w}’ ਦਾ ਸਹੀ ਵਚਨ-ਰੂਪਾਂਤਰਣ ਕਿਹੜਾ ਹੈ?`,
  (w: string) => `ਵਿਆਕਰਣਕ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਸਹੀ ਵਚਨ ਕਿਹੜਾ ਬਣੇਗਾ?`,
  (w: string) => `‘${w}’ ਦਾ ਸ਼ੁੱਧ ਵਚਨ ਪਰਿਵਰਤਿਤ ਰੂਪ ਪਛਾਣੋ:`,
  (w: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਧੀਨ ‘${w}’ ਦਾ ਵਚਨ ਬਦਲੋ:`,
];

const CP004_F02_HARD_TEMPLATES = [
  (w: string) => `ਵਿਸ਼ੇਸ਼ ਵਿਆਕਰਣਕ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਸ਼ੁੱਧ ਵਚਨ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
  (w: string) => `‘${w}’ ਸ਼ਬਦ ਦਾ ਟਕਸਾਲੀ ਬਹੁਵਚਨ/ਇਕਵਚਨ ਰੂਪ ਚੁਣੋ:`,
  (w: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${w}’ ਦਾ ਪ੍ਰਮਾਣਿਕ ਵਚਨ-ਰੂਪਾਂਤਰਣ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
  (w: string) => `ਵਚਨ ਬਦਲਣ ਦੇ ਵਿਸ਼ੇਸ਼ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਸਹੀ ਰੂਪ ਦੱਸੋ:`,
];

const CP004_F03_EASY_TEMPLATES = [
  (type: string, s: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਸਧਾਰਨ ਵਾਕ ਦਾ ‘${type}’ ਕਰਕੇ ਸਹੀ ਰੂਪ ਚੁਣੋ:\n\n“${s}”`,
  (type: string, s: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਦਾ ਸਹੀ ‘${type}’ ਰੂਪ ਕਿਹੜਾ ਹੋਵੇਗਾ?\n“${s}”`,
];

const CP004_F03_MED_TEMPLATES = [
  (type: string, s: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਦਾ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ‘${type}’ ਕਰੋ:\n\n“${s}”`,
  (type: string, s: string) => `ਵਾਕ-ਵਟਾਂਦਰੇ ਦੇ ਨੇਮਾਂ ਅਧੀਨ ਵਾਕ “${s}” ਦਾ ‘${type}’ ਕਰੋ:`,
];

const CP004_F03_HARD_TEMPLATES = [
  (type: string, s: string) => `“${s}” — ਇਸ ਵਾਕ ਦਾ ‘${type}’ ਕਰਨ ਉਪਰੰਤ ਸ਼ੁੱਧ ਰੂਪ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
  (type: string, s: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ “${s}” ਦਾ ਸਹੀ ‘${type}’ ਰੂਪ ਚੁਣੋ:`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Gender Transformation (ਲਿੰਗ ਬਦਲੋ)
// -------------------------------------------------------------------------
export function generateCP004F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);

  const pair: GenderPair = rng.pickOne(GENDER_PAIRS);

  // Direction: masculine -> feminine or feminine -> masculine
  const toFeminine = rng.next() > 0.4;
  const sourceWord = toFeminine ? pair.masculine : pair.feminine;
  const targetWord = toFeminine ? pair.feminine : pair.masculine;

  const rawDistractors = [...pair.commonDistractors];
  if (!toFeminine) {
    rawDistractors.push(pair.masculine + "ਆ", pair.masculine + "ੇ", pair.feminine + "ਾ", pair.masculine + "ੀ");
  } else {
    rawDistractors.push(pair.feminine + "ਆਂ", pair.masculine + "ਾਂ", pair.masculine + "ੇ");
  }
  const distractors = Array.from(new Set(rawDistractors)).filter((d) => d.trim() !== targetWord.trim());
  const templates = difficulty === "Easy" ? CP004_F01_EASY_TEMPLATES : difficulty === "Medium" ? CP004_F01_MED_TEMPLATES : CP004_F01_HARD_TEMPLATES;
  const stemTemplate = rng.pickOne(templates);

  return assembleCP004Question({
    familyId: "F01",
    seed,
    difficulty,
    stem: stemTemplate(sourceWord),
    correctAnswer: targetWord,
    distractors,
    explanation: `${pair.explanationPa} ਇਸ ਲਈ ‘${sourceWord}’ ਦਾ ਲਿੰਗ ਪਰਿਵਰਤਨ ‘${targetWord}’ ਹੈ।`,
    authorityIds: [pair.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: Number Transformation (ਵਚਨ ਬਦਲੋ)
// -------------------------------------------------------------------------
export function generateCP004F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);

  const pair: NumberPair = rng.pickOne(NUMBER_PAIRS);

  const toPlural = rng.next() > 0.35;
  const sourceWord = toPlural ? pair.singular : pair.plural;
  const targetWord = toPlural ? pair.plural : pair.singular;

  const rawDistractors = [...pair.commonDistractors];
  if (!toPlural) {
    rawDistractors.push(pair.singular + "ਾਂ", pair.singular + "ੇ", pair.plural + "ਾਂ", pair.singular + "ੋ");
  } else {
    rawDistractors.push(pair.singular + "ਾਂ", pair.singular + "ੇ", pair.singular + "ਵਾਂ", pair.singular + "ੀਆਂ");
  }
  const distractors = Array.from(new Set(rawDistractors)).filter((d) => d.trim() !== targetWord.trim());
  const templates = difficulty === "Easy" ? CP004_F02_EASY_TEMPLATES : difficulty === "Medium" ? CP004_F02_MED_TEMPLATES : CP004_F02_HARD_TEMPLATES;
  const stemTemplate = rng.pickOne(templates);

  return assembleCP004Question({
    familyId: "F02",
    seed,
    difficulty,
    stem: stemTemplate(sourceWord),
    correctAnswer: targetWord,
    distractors,
    explanation: `${pair.explanationPa} ਇਸ ਲਈ ‘${sourceWord}’ ਦਾ ਵਚਨ ਪਰਿਵਰਤਨ ‘${targetWord}’ ਹੈ।`,
    authorityIds: [pair.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 3: Sentence-Wide Inflectional Agreement (ਵਾਕ ਵਟਾਂਦਰਾ)
// -------------------------------------------------------------------------
interface SentenceInflectionCase {
  baseSentence: string;
  transformedSentence: string;
  transformationType: "ਲਿੰਗ ਬਦਲੋ" | "ਵਚਨ ਬਦਲੋ";
  distractors: readonly string[];
  explanation: string;
}

const SENTENCE_CASES: readonly SentenceInflectionCase[] = [
  {
    baseSentence: "ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਦਾ ਹੈ।",
    transformedSentence: "ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਦੇ ਹਨ।",
    transformationType: "ਵਚਨ ਬਦਲੋ",
    distractors: [
      "ਮੁੰਡਿਆਂ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਦਾ ਹੈ।",
      "ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਦਾ ਹਨ।",
      "ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡਦੀਆਂ ਹਨ।",
    ],
    explanation: "ਕਰਤਾ ‘ਮੁੰਡਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਮੁੰਡੇ’ ਹੋਣ 'ਤੇ ਕਿਰਿਆ ਵੀ ‘ਖੇਡਦਾ ਹੈ’ ਤੋਂ ਬਦਲ ਕੇ ‘ਖੇਡਦੇ ਹਨ’ ਹੋ ਜਾਂਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਘੋੜਾ ਤੇਜ਼ ਦੌੜ ਰਿਹਾ ਹੈ।",
    transformedSentence: "ਘੋੜੀ ਤੇਜ਼ ਦੌੜ ਰਹੀ ਹੈ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਘੋੜੀ ਤੇਜ਼ ਦੌੜ ਰਿਹਾ ਹੈ।",
      "ਘੋੜੀਆਂ ਤੇਜ਼ ਦੌੜ ਰਹੀਆਂ ਹਨ।",
      "ਘੋੜੀ ਤੇਜ਼ ਦੌੜਦੇ ਹਨ।",
    ],
    explanation: "ਕਰਤਾ ‘ਘੋੜਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਘੋੜੀ’ ਹੋਣ 'ਤੇ ਕਿਰਿਆ ਵੀ ਪੁਲਿੰਗ ‘ਰਿਹਾ ਹੈ’ ਤੋਂ ਇਸਤਰੀ ਲਿੰਗ ‘ਰਹੀ ਹੈ’ ਵਿੱਚ ਬਦਲਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਕੁੜੀ ਕਿਤਾਬ ਪੜ੍ਹਦੀ ਹੈ।",
    transformedSentence: "ਕੁੜੀਆਂ ਕਿਤਾਬਾਂ ਪੜ੍ਹਦੀਆਂ ਹਨ।",
    transformationType: "ਵਚਨ ਬਦਲੋ",
    distractors: [
      "ਕੁੜੀਆਂ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਹਨ።",
      "ਕੁੜੀਏ ਕਿਤਾਬਾਂ ਪੜ੍ਹਦੀ ਹੈ।",
      "ਕੁੜੀਆਂ ਕਿਤਾਬਾਂ ਪੜ੍ਹਦੇ ਹਨ।",
    ],
    explanation: "ਕਰਤਾ ‘ਕੁੜੀ’ ਦਾ ਬਹੁਵਚਨ ‘ਕੁੜੀਆਂ’, ਕਰਮ ‘ਕਿਤਾਬ’ ਦਾ ‘ਕਿਤਾਬਾਂ’ ਅਤੇ ਕਿਰਿਆ ‘ਪੜ੍ਹਦੀਆਂ ਹਨ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਧੋਬੀ ਕੱਪੜੇ ਧੋ ਰਿਹਾ ਹੈ।",
    transformedSentence: "ਧੋਬਣ ਕੱਪੜੇ ਧੋ ਰਹੀ ਹੈ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਧੋਬਣੀ ਕੱਪੜੇ ਧੋ ਰਿਹਾ ਹੈ।",
      "ਧੋਬਣ ਕੱਪੜੇ ਧੋ ਰਿਹਾ ਹੈ।",
      "ਧੋਬੀਆਣੀ ਕੱਪੜੇ ਧੋ ਰਹੀਆਂ ਹਨ।",
    ],
    explanation: "‘ਧੋਬੀ’ ਦਾ ਲਿੰਗ ‘ਧੋਬਣ’ ਅਤੇ ਕਿਰਿਆ ‘ਧੋ ਰਹੀ ਹੈ’ ਹੋ ਜਾਵੇਗੀ।",
  },
  {
    baseSentence: "ਬੱਚਾ ਰੋ ਰਿਹਾ ਹੈ।",
    transformedSentence: "ਬੱਚੇ ਰੋ ਰਹੇ ਹਨ।",
    transformationType: "ਵਚਨ ਬਦਲੋ",
    distractors: [
      "ਬੱਚਿਆਂ ਰੋ ਰਿਹਾ ਹੈ।",
      "ਬੱਚੇ ਰੋ ਰਹੀਆਂ ਹਨ।",
      "ਬੱਚੇ ਰੋ ਰਿਹਾ ਹੈ।",
    ],
    explanation: "‘ਬੱਚਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਬੱਚੇ’ ਅਤੇ ਕਿਰਿਆ ‘ਰੋ ਰਹੇ ਹਨ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਕੁੱਤਾ ਭੌਂਕ ਰਿਹਾ ਹੈ।",
    transformedSentence: "ਕੁੱਤੀ ਭੌਂਕ ਰਹੀ ਹੈ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਕੁੱਤੀ ਭੌਂਕ ਰਿਹਾ ਹੈ।",
      "ਕੁੱਤੀਆਂ ਭੌਂਕ ਰਹੇ ਹਨ।",
      "ਕੁੱਤੀ ਭੌਂਕਦੇ ਹਨ।",
    ],
    explanation: "‘ਕੁੱਤਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਕੁੱਤੀ’ ਅਤੇ ਕਿਰਿਆ ‘ਭੌਂਕ ਰਹੀ ਹੈ’ ਹੁੰਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਚਿੜੀ ਰੁੱਖ 'ਤੇ ਬੈਠੀ ਹੈ।",
    transformedSentence: "ਚਿੜੀਆਂ ਰੁੱਖਾਂ 'ਤੇ ਬੈਠੀਆਂ ਹਨ।",
    transformationType: "ਵਚਨ ਬਦਲੋ",
    distractors: [
      "ਚਿੜੀਆਂ ਰੁੱਖ 'ਤੇ ਬੈਠੀ ਹੈ।",
      "ਚਿੜੀਆਂ ਰੁੱਖਾਂ 'ਤੇ ਬੈਠੇ ਹਨ।",
      "ਚਿੜੀ ਰੁੱਖਾਂ 'ਤੇ ਬੈਠੀਆਂ ਹਨ।",
    ],
    explanation: "‘ਚਿੜੀ’ ਦਾ ਬਹੁਵਚਨ ‘ਚਿੜੀਆਂ’ ਅਤੇ ਕਿਰਿਆ ‘ਬੈਠੀਆਂ ਹਨ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਦਾਸ ਹੱਥ ਜੋੜ ਕੇ ਬੇਨਤੀ ਕਰਦਾ ਹੈ।",
    transformedSentence: "ਦਾਸੀ ਹੱਥ ਜੋੜ ਕੇ ਬੇਨਤੀ ਕਰਦੀ ਹੈ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਦਾਸਣੀ ਹੱਥ ਜੋੜ ਕੇ ਬੇਨਤੀ ਕਰਦੀ ਹੈ।",
      "ਦਾਸੀ ਹੱਥ ਜੋੜ ਕੇ ਬੇਨਤੀ ਕਰਦਾ ਹੈ।",
      "ਦਾਸੀਆਂ ਹੱਥ ਜੋੜ ਕੇ ਬੇਨਤੀ ਕਰਦੇ ਹਨ।",
    ],
    explanation: "‘ਦਾਸ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਦਾਸੀ’ ਅਤੇ ਕਿਰਿਆ ‘ਕਰਦੀ ਹੈ’ ਹੁੰਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਸ਼ੇਰ ਜੰਗਲ ਵਿੱਚ ਗਰਜ ਰਿਹਾ ਹੈ।",
    transformedSentence: "ਸ਼ੇਰਨੀ ਜੰਗਲ ਵਿੱਚ ਗਰਜ ਰਹੀ ਹੈ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਸ਼ੇਰਨੀ ਜੰਗਲ ਵਿੱਚ ਗਰਜ ਰਿਹਾ ਹੈ।",
      "ਸ਼ੇਰਨੀਆਂ ਜੰਗਲ ਵਿੱਚ ਗਰਜ ਰਹੇ ਹਨ।",
      "ਸ਼ੇਰੀ ਜੰਗਲ ਵਿੱਚ ਗਰਜ ਰਹੀ ਹੈ।",
    ],
    explanation: "‘ਸ਼ੇਰ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਸ਼ੇਰਨੀ’ ਅਤੇ ਕਿਰਿਆ ‘ਗਰਜ ਰਹੀ ਹੈ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਅਧਿਆਪਕ ਜਮਾਤ ਨੂੰ ਪੜ੍ਹਾਉਂਦਾ ਹੈ।",
    transformedSentence: "ਅਧਿਆਪਕਾ ਜਮਾਤ ਨੂੰ ਪੜ੍ਹਾਉਂਦੀ ਹੈ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਅਧਿਆਪਕਾ ਜਮਾਤ ਨੂੰ ਪੜ੍ਹਾਉਂਦਾ ਹੈ।",
      "ਅਧਿਆਪਕਣੀ ਜਮਾਤ ਨੂੰ ਪੜ੍ਹਾਉਂਦੀ ਹੈ।",
      "ਅਧਿਆਪਕਾਵਾਂ ਜਮਾਤ ਨੂੰ ਪੜ੍ਹਾਉਂਦੇ ਹਨ।",
    ],
    explanation: "‘ਅਧਿਆਪਕ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਅਧਿਆਪਕਾ’ ਅਤੇ ਕਿਰਿਆ ‘ਪੜ੍ਹਾਉਂਦੀ ਹੈ’ ਹੁੰਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਸੇਠ ਨੇ ਗ਼ਰੀਬ ਦੀ ਮਦਦ ਕੀਤੀ।",
    transformedSentence: "ਸੇਠਾਣੀ ਨੇ ਗ਼ਰੀਬ ਦੀ ਮਦਦ ਕੀਤੀ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਸੇਠਣੀ ਨੇ ਗ਼ਰੀਬ ਦੀ ਮਦਦ ਕੀਤੀ।",
      "ਸੇਠੀ ਨੇ ਗ਼ਰੀਬ ਦੀ ਮਦਦ ਕੀਤੀ।",
      "ਸੇਠਾਣੀਆਂ ਨੇ ਗ਼ਰੀਬ ਦੀ ਮਦਦ ਕੀਤੇ।",
    ],
    explanation: "‘ਸੇਠ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਸੇਠਾਣੀ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    baseSentence: "ਪਤੀ ਆਪਣੀ ਜ਼ਿੰਮੇਵਾਰੀ ਨਿਭਾਉਂਦਾ ਹੈ।",
    transformedSentence: "ਪਤਨੀ ਆਪਣੀ ਜ਼ਿੰਮੇਵਾਰੀ ਨਿਭਾਉਂਦੀ ਹੈ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਪਤਨੀ ਆਪਣੀ ਜ਼ਿੰਮੇਵਾਰੀ ਨਿਭਾਉਂਦਾ ਹੈ।",
      "ਪਤੀਣੀ ਆਪਣੀ ਜ਼ਿੰਮੇਵਾਰੀ ਨਿਭਾਉਂਦੀ ਹੈ।",
      "ਪਤਨੀਆਂ ਆਪਣੀ ਜ਼ਿੰਮੇਵਾਰੀ ਨਿਭਾਉਂਦੇ ਹਨ।",
    ],
    explanation: "‘ਪਤੀ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਪਤਨੀ’ ਅਤੇ ਕਿਰਿਆ ‘ਨਿਭਾਉਂਦੀ ਹੈ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਮਾਲੀ ਬਗ਼ੀਚੇ ਵਿੱਚ ਪੌਦਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇ ਰਿਹਾ ਹੈ।",
    transformedSentence: "ਮਾਲਣ ਬਗ਼ੀਚੇ ਵਿੱਚ ਪੌਦਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇ ਰਹੀ ਹੈ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਮਾਲਣੀ ਬਗ਼ੀਚੇ ਵਿੱਚ ਪੌਦਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇ ਰਹੀ ਹੈ।",
      "ਮਾਲਣ ਬਗ਼ੀਚੇ ਵਿੱਚ ਪੌਦਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇ ਰਿਹਾ ਹੈ।",
      "ਮਾਲੀਆਣੀ ਬਗ਼ੀਚੇ ਵਿੱਚ ਪੌਦਿਆਂ ਨੂੰ ਪਾਣੀ ਦੇ ਰਹੇ ਹਨ।",
    ],
    explanation: "‘ਮਾਲੀ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਮਾਲਣ’ ਅਤੇ ਕਿਰਿਆ ‘ਦੇ ਰਹੀ ਹੈ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਰਾਤ ਨੂੰ ਅਸਮਾਨ ਵਿੱਚ ਤਾਰਾ ਚਮਕਦਾ ਹੈ।",
    transformedSentence: "ਰਾਤਾਂ ਨੂੰ ਅਸਮਾਨ ਵਿੱਚ ਤਾਰੇ ਚਮਕਦੇ ਹਨ।",
    transformationType: "ਵਚਨ ਬਦਲੋ",
    distractors: [
      "ਰਾਤਾਂ ਨੂੰ ਅਸਮਾਨ ਵਿੱਚ ਤਾਰਾ ਚਮਕਦੇ ਹਨ।",
      "ਰਾਤ ਨੂੰ ਅਸਮਾਨ ਵਿੱਚ ਤਾਰਿਆਂ ਚਮਕਦਾ ਹੈ।",
      "ਰਾਤਾਂ ਨੂੰ ਅਸਮਾਨ ਵਿੱਚ ਤਾਰੇ ਚਮਕਦੀਆਂ ਹਨ।",
    ],
    explanation: "‘ਰਾਤ’ ਦਾ ਬਹੁਵਚਨ ‘ਰਾਤਾਂ’, ‘ਤਾਰਾ’ ਦਾ ‘ਤਾਰੇ’ ਅਤੇ ਕਿਰਿਆ ‘ਚਮਕਦੇ ਹਨ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਕਮਰੇ ਵਿੱਚ ਪੱਖਾ ਚੱਲ ਰਿਹਾ ਹੈ।",
    transformedSentence: "ਕਮਰਿਆਂ ਵਿੱਚ ਪੱਖੇ ਚੱਲ ਰਹੇ ਹਨ।",
    transformationType: "ਵਚਨ ਬਦਲੋ",
    distractors: [
      "ਕਮਰੇ ਵਿੱਚ ਪੱਖੇ ਚੱਲ ਰਿਹਾ ਹੈ।",
      "ਕਮਰਿਆਂ ਵਿੱਚ ਪੱਖਾ ਚੱਲ ਰਹੇ ਹਨ।",
      "ਕਮਰੇ ਵਿੱਚ ਪੱਖਿਆਂ ਚੱਲ ਰਹੀਆਂ ਹਨ।",
    ],
    explanation: "ਸੰਬੰਧਕੀ ਬਹੁਵਚਨ ਵਿੱਚ ‘ਕਮਰਿਆਂ ਵਿੱਚ’, ‘ਪੱਖੇ’ ਅਤੇ ਕਿਰਿਆ ‘ਚੱਲ ਰਹੇ ਹਨ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਨਦੀ ਪਹਾੜ ਵਿੱਚੋਂ ਨਿਕਲਦੀ ਹੈ।",
    transformedSentence: "ਨਦੀਆਂ ਪਹਾੜਾਂ ਵਿੱਚੋਂ ਨਿਕਲਦੀਆਂ ਹਨ।",
    transformationType: "ਵਚਨ ਬਦਲੋ",
    distractors: [
      "ਨਦੀਆਂ ਪਹਾੜ ਵਿੱਚੋਂ ਨਿਕਲਦਾ ਹੈ।",
      "ਨਦੀਏ ਪਹਾੜਾਂ ਵਿੱਚੋਂ ਨਿਕਲਦੀਆਂ ਹਨ।",
      "ਨਦੀਆਂ ਪਹਾੜਾਂ ਵਿੱਚੋਂ ਨਿਕਲਦੇ ਹਨ।",
    ],
    explanation: "‘ਨਦੀ’ ਦਾ ਬਹੁਵਚਨ ‘ਨਦੀਆਂ’, ‘ਪਹਾੜਾਂ ਵਿੱਚੋਂ’ ਅਤੇ ਕਿਰਿਆ ‘ਨਿਕਲਦੀਆਂ ਹਨ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਕੁਰਸੀ ਉੱਤੇ ਕਾਪੀ ਪਈ ਹੈ।",
    transformedSentence: "ਕੁਰਸੀਆਂ ਉੱਤੇ ਕਾਪੀਆਂ ਪਈਆਂ ਹਨ।",
    transformationType: "ਵਚਨ ਬਦਲੋ",
    distractors: [
      "ਕੁਰਸੀਆਂ ਉੱਤੇ ਕਾਪੀ ਪਈ ਹੈ।",
      "ਕੁਰਸੀ ਉੱਤੇ ਕਾਪੀਆਂ ਪਈ ਹੈ।",
      "ਕੁਰਸੀਆਂ ਉੱਤੇ ਕਾਪੀਆਂ ਪਏ ਹਨ।",
    ],
    explanation: "‘ਕੁਰਸੀ’ ਦਾ ‘ਕੁਰਸੀਆਂ’, ‘ਕਾਪੀ’ ਦਾ ‘ਕਾਪੀਆਂ’ ਅਤੇ ਕਿਰਿਆ ‘ਪਈਆਂ ਹਨ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਘੋੜਾ ਘਾਹ ਚਰ ਰਿਹਾ ਹੈ।",
    transformedSentence: "ਘੋੜੇ ਘਾਹ ਚਰ ਰਹੇ ਹਨ।",
    transformationType: "ਵਚਨ ਬਦਲੋ",
    distractors: [
      "ਘੋੜਿਆਂ ਘਾਹ ਚਰ ਰਿਹਾ ਹੈ।",
      "ਘੋੜੇ ਘਾਹ ਚਰ ਰਿਹਾ ਹੈ।",
      "ਘੋੜੇ ਘਾਹ ਚਰ ਰਹੀਆਂ ਹਨ।",
    ],
    explanation: "‘ਘੋੜਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਘੋੜੇ’ ਅਤੇ ਕਿਰਿਆ ‘ਚਰ ਰਹੇ ਹਨ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਸਭਾ ਵਿੱਚ ਨਵਾਂ ਮਤਾ ਪਾਸ ਹੋਇਆ।",
    transformedSentence: "ਸਭਾਵਾਂ ਵਿੱਚ ਨਵੇਂ ਮਤੇ ਪਾਸ ਹੋਏ।",
    transformationType: "ਵਚਨ ਬਦਲੋ",
    distractors: [
      "ਸਭਾਵਾਂ ਵਿੱਚ ਨਵਾਂ ਮਤਾ ਪਾਸ ਹੋਏ।",
      "ਸਭਾ ਵਿੱਚ ਨਵੇਂ ਮਤੇ ਪਾਸ ਹੋਇਆ।",
      "ਸਭਾਵਾਂ ਵਿੱਚ ਨਵੀਆਂ ਮਤਿਆਂ ਪਾਸ ਹੋਈਆਂ।",
    ],
    explanation: "‘ਸਭਾ’ ਦਾ ‘ਸਭਾਵਾਂ’, ‘ਨਵਾਂ ਮਤਾ’ ਦਾ ‘ਨਵੇਂ ਮਤੇ’ ਅਤੇ ਕਿਰਿਆ ‘ਪਾਸ ਹੋਏ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਮਾਸਟਰ ਜੀ ਸਬਕ ਪੜ੍ਹਾ ਰਹੇ ਹਨ।",
    transformedSentence: "ਮਾਸਟਰਨੀ ਜੀ ਸਬਕ ਪੜ੍ਹਾ ਰਹੇ ਹਨ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਮਾਸਟਰੀ ਜੀ ਸਬਕ ਪੜ੍ਹਾ ਰਹੇ ਹਨ।",
      "ਮਾਸਟਰਣ ਜੀ ਸਬਕ ਪੜ੍ਹਾ ਰਿਹਾ ਹੈ।",
      "ਮਾਸਟਰਨੀਆਂ ਜੀ ਸਬਕ ਪੜ੍ਹਾ ਰਹੇ ਹਨ।",
    ],
    explanation: "‘ਮਾਸਟਰ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਮਾਸਟਰਨੀ’ ਹੁੰਦਾ ਹੈ ਅਤੇ ਸਤਿਕਾਰ ਵਜੋਂ ਬਹੁਵਚਨੀ ਕਿਰਿਆ ਲੱਗਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਸੱਪ ਖੁੱਡ ਵਿੱਚ ਵੜ ਗਿਆ।",
    transformedSentence: "ਸੱਪਣੀ ਖੁੱਡ ਵਿੱਚ ਵੜ ਗਈ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਸੱਪਣੀ ਖੁੱਡ ਵਿੱਚ ਵੜ ਗਿਆ।",
      "ਸੱਪੀ ਖੁੱਡ ਵਿੱਚ ਵੜ ਗਈ।",
      "ਸੱਪਣੀਆਂ ਖੁੱਡ ਵਿੱਚ ਵੜ ਗਏ।",
    ],
    explanation: "‘ਸੱਪ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਸੱਪਣੀ’ ਅਤੇ ਕਿਰਿਆ ‘ਵੜ ਗਈ’ ਬਣਦੀ ਹੈ।",
  },
  {
    baseSentence: "ਕਵੀ ਨੇ ਨਵੀਂ ਕਵਿਤਾ ਲਿਖੀ।",
    transformedSentence: "ਕਵਿੱਤਰੀ ਨੇ ਨਵੀਂ ਕਵਿਤਾ ਲਿਖੀ।",
    transformationType: "ਲਿੰਗ ਬਦਲੋ",
    distractors: [
      "ਕਵੀਆਣੀ ਨੇ ਨਵੀਂ ਕਵਿਤਾ ਲਿਖੀ।",
      "ਕਵਿਣੀ ਨੇ ਨਵੀਂ ਕਵਿਤਾ ਲਿਖੀ।",
      "ਕਵਿੱਤਰੀ ਨੇ ਨਵੀਆਂ ਕਵਿਤਾਵਾਂ ਲਿਖੇ।",
    ],
    explanation: "‘ਕਵੀ’ ਦਾ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਇਸਤਰੀ ਲਿੰਗ ‘ਕਵਿੱਤਰੀ’ ਹੁੰਦਾ ਹੈ।",
  },
];

export function generateCP004F03(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);

  const testCase = rng.pickOne(SENTENCE_CASES);

  return assembleCP004Question({
    familyId: "F03",
    seed,
    difficulty,
    stem: `ਹੇਠਾਂ ਦਿੱਤੇ ਵਾਕ ਦਾ ‘${testCase.transformationType}’ ਕਰਕੇ ਸਹੀ ਰੂਪ ਚੁਣੋ:\n\n“${testCase.baseSentence}”`,
    correctAnswer: testCase.transformedSentence,
    distractors: testCase.distractors,
    explanation: testCase.explanation,
    authorityIds: ["PUN-AUTH-SENTENCE-INFLECTION"],
  });
}
