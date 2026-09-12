/**
 * CP010 Question Families:
 * CP010-F01: Phrase to One-Word Substitution (ਵਾਕੰਸ਼ ਲਈ ਇੱਕ ਸ਼ਬਦ)
 * CP010-F02: Word to Definitional Meaning (ਸ਼ਬਦ ਦਾ ਵਿਆਖਿਆਤਮਕ ਅਰਥ)
 * CP010-F03: Contextual Sentence Blank Fill (ਵਾਕ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਦੀ ਪੂਰਤੀ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import { ONE_WORD_ITEMS, type OneWordItem } from "./CP010-authorities";

function assembleCP010Question(input: {
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
      `Insufficient distinct distractors for CP010 ${input.familyId}. Got ${filteredDistractors.length}`
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
    id: `PUN-001-CP010-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP010",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP010-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

// -------------------------------------------------------------------------
// TEMPLATES: F01 (Phrase to One-Word)
// -------------------------------------------------------------------------

const CP010_F01_EASY_TEMPLATES = [
  (p: string) => `ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਢੁਕਵਾਂ ਸ਼ਬਦ ਚੁਣੋ:

“${p}”`,
  (p: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਵਾਕੰਸ਼ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਇੱਕ ਸ਼ਬਦ ਕਿਹੜਾ ਹੋਵੇਗਾ?

“${p}”`,
  (p: string) => `“${p}” — ਇਸ ਸ਼ਬਦ-ਸਮੂਹ ਦਾ ਸੰਖੇਪ ਅਰਥ ਦਰਸਾਉਂਦਾ ਇੱਕ ਸ਼ਬਦ ਚੁਣੋ:`,
];

const CP010_F01_MED_TEMPLATES = [
  (p: string) => `ਕਿਸੇ ਅਜਿਹੇ ਵਿਅਕਤੀ, ਵਸਤੂ ਜਾਂ ਸਥਿਤੀ ਲਈ ਜੋ “${p}”, ਕਿਹੜਾ ਸ਼ਬਦ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
  (p: string) => `ਦਿੱਤੇ ਗਏ ਕਥਨ “${p}” ਲਈ ਇੱਕ ਢੁਕਵਾਂ ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਸ਼ਬਦ ਦੱਸੋ:`,
  (p: string) => `ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਦੇ ਸ਼ਬਦ-ਭੰਡਾਰ ਅਨੁਸਾਰ “${p}” ਲਈ ਸਹੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
];

const CP010_F01_HARD_TEMPLATES = [
  (p: string) => `ਹੇਠਾਂ ਦਰਜ ਵਾਕੰਸ਼ “${p}” ਨੂੰ ਸੰਖੇਪ ਰੂਪ ਵਿੱਚ ਕੀ ਆਖਿਆ ਜਾਂਦਾ ਹੈ?`,
  (p: string) => `ਪ੍ਰੀਖਿਆ ਨਿਯਮਾਂ ਅਨੁਸਾਰ “${p}” ਦਾ ਸਹੀ ਇਕਹਿਰਾ ਸ਼ਬਦ ਰੂਪ ਚੁਣੋ:`,
  (p: string) => `ਜੇਕਰ “${p}” ਦੇ ਭਾਵ ਨੂੰ ਇੱਕ ਸ਼ਬਦ ਵਿੱਚ ਬਿਆਨ ਕਰਨਾ ਹੋਵੇ, ਤਾਂ ਢੁਕਵਾਂ ਸ਼ਬਦ ਹੋਵੇਗਾ:`,
];

// -------------------------------------------------------------------------
// TEMPLATES: F02 (Word to Definitional Meaning)
// -------------------------------------------------------------------------

const CP010_F02_EASY_TEMPLATES = [
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਕਿਸ ਵਾਕੰਸ਼ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
  (w: string) => `‘${w}’ ਸ਼ਬਦ ਦਾ ਸਹੀ ਵਿਆਖਿਆਤਮਕ ਵਾਕੰਸ਼ (ਅਰਥ) ਕਿਹੜਾ ਹੈ?`,
  (w: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸ਼ਬਦ ‘${w}’ ਦੀ ਸਹੀ ਪਰਿਭਾਸ਼ਾ ਦਿੰਦਾ ਹੈ?`,
];

const CP010_F02_MED_TEMPLATES = [
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਦਾ ਸੰਦਰਭ ਸਪਸ਼ਟ ਕਰਨ ਵਾਲਾ ਢੁਕਵਾਂ ਵਾਕੰਸ਼ ਚੁਣੋ:`,
  (w: string) => `ਕਿਸ ਵਾਕੰਸ਼ ਦੇ ਸੰਖੇਪ ਰੂਪ ਵਜੋਂ ਸ਼ਬਦ ‘${w}’ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
  (w: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${w}’ ਸ਼ਬਦ ਦਾ ਵਿਸਥਾਰਿਤ ਵਾਕੰਸ਼ ਕਿਹੜਾ ਹੈ?`,
];

const CP010_F02_HARD_TEMPLATES = [
  (w: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਦੇ ਮੂਲ ਭਾਵ ਨੂੰ ਦਰਸਾਉਂਦਾ ਵਾਕੰਸ਼ ਚੁਣੋ:`,
  (w: string) => `‘${w}’ ਕਿਸ ਅਰਥ ਦਾ ਪ੍ਰਤੀਕ ਹੈ? ਸਹੀ ਵਾਕੰਸ਼ ਦੀ ਚੋਣ ਕਰੋ:`,
  (w: string) => `ਵਿਆਕਰਨਿਕ ਅਰਥ-ਵਿਗਿਆਨ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਪੂਰਨ ਵਾਕੰਸ਼ੀ ਵਿਸਥਾਰ ਕੀ ਹੈ?`,
];

// -------------------------------------------------------------------------
// TEMPLATES: F03 (Contextual Blank Fill)
// -------------------------------------------------------------------------

const CP010_F03_EASY_TEMPLATES = [
  (p: string) => `ਵਾਕ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਇੱਕ ਢੁਕਵਾਂ ਸ਼ਬਦ ਚੁਣੋ:

“ਜੋ ਵਿਅਕਤੀ ਜਾਂ ਵਸਤੂ ${p}, ਉਸ ਨੂੰ _____ ਆਖਦੇ ਹਨ।”`,
  (p: string) => `ਕਥਨ ਪੂਰਾ ਕਰੋ: “ਸਮਾਜ ਵਿੱਚ ਅਜਿਹਾ ਮਨੁੱਖ ਜੋ ${p}, ਉਸ ਲਈ ਢੁਕਵਾਂ ਸ਼ਬਦ _____ ਹੈ।”`,
];

const CP010_F03_MED_TEMPLATES = [
  (p: string) => `ਖ਼ਾਲੀ ਥਾਂ ਭਰ ਕੇ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ:

“ਅਸੀਂ ਉਸ ਨੂੰ _____ ਕਹਿੰਦੇ ਹਾਂ ਕਿਉਂਕਿ ਉਹ ${p}।”`,
  (p: string) => `“ਉਹ ${p}, ਇਸੇ ਕਰਕੇ ਸਾਰੇ ਉਸ ਨੂੰ _____ ਵਜੋਂ ਜਾਣਦੇ ਹਨ।” — ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:`,
];

const CP010_F03_HARD_TEMPLATES = [
  (p: string) => `ਦਿੱਤੇ ਪ੍ਰਸੰਗ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਸਹੀ ਸ਼ਬਦ ਲੱਭੋ:

“ਜੋ ${p}, ਉਸ ਦਾ ਇਕਹਿਰਾ ਨਾਮ _____ ਹੈ।”`,
  (p: string) => `ਪ੍ਰਸੰਗਿਕ ਵਾਕ ਮੁਕੰਮਲ ਕਰੋ: “ਜੋ ਸਥਿਤੀ ${p}, ਉਸ ਨੂੰ ਸ਼ਾਸਤਰੀ ਰੂਪ ਵਿੱਚ _____ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।”`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Phrase to One-Word Substitution
// -------------------------------------------------------------------------
export function generateCP010F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const item = rng.pickOne(ONE_WORD_ITEMS);

  const templatePool =
    difficulty === "Easy"
      ? CP010_F01_EASY_TEMPLATES
      : difficulty === "Hard"
      ? CP010_F01_HARD_TEMPLATES
      : CP010_F01_MED_TEMPLATES;

  const stemTemplate = rng.pickOne(templatePool);

  return assembleCP010Question({
    familyId: "F01",
    seed,
    difficulty,
    stem: stemTemplate(item.phrasePa),
    correctAnswer: item.wordPa,
    distractors: item.distractors,
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: Word to Definitional Meaning
// -------------------------------------------------------------------------
export function generateCP010F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const item = rng.pickOne(ONE_WORD_ITEMS);

  const templatePool =
    difficulty === "Easy"
      ? CP010_F02_EASY_TEMPLATES
      : difficulty === "Hard"
      ? CP010_F02_HARD_TEMPLATES
      : CP010_F02_MED_TEMPLATES;

  const stemTemplate = rng.pickOne(templatePool);

  // Distractors are other phrases from the knowledge base
  const otherPhrases = ONE_WORD_ITEMS.filter((i) => i.id !== item.id).map((i) => i.phrasePa);

  return assembleCP010Question({
    familyId: "F02",
    seed,
    difficulty,
    stem: stemTemplate(item.wordPa),
    correctAnswer: item.phrasePa,
    distractors: otherPhrases,
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 3: Contextual Sentence Blank Fill
// -------------------------------------------------------------------------
export function generateCP010F03(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const item = rng.pickOne(ONE_WORD_ITEMS);

  const templatePool =
    difficulty === "Easy"
      ? CP010_F03_EASY_TEMPLATES
      : difficulty === "Hard"
      ? CP010_F03_HARD_TEMPLATES
      : CP010_F03_MED_TEMPLATES;

  const stemTemplate = rng.pickOne(templatePool);

  return assembleCP010Question({
    familyId: "F03",
    seed,
    difficulty,
    stem: stemTemplate(item.phrasePa),
    correctAnswer: item.wordPa,
    distractors: item.distractors,
    explanation: `${item.explanationPa} ਇਸ ਲਈ ਖ਼ਾਲੀ ਥਾਂ ਉੱਤੇ ‘${item.wordPa}’ ਆਵੇਗਾ।`,
    authorityIds: [item.id],
  });
}
