/**
 * CP009 Question Families:
 * CP009-F01: Synonym Resolution (ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ)
 * CP009-F02: Antonym Resolution (ਵਿਰੋਧੀ ਸ਼ਬਦ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  ANTONYM_PAIRS,
  SYNONYM_SETS,
  type AntonymPair,
  type SynonymSet,
} from "./CP009-authorities";

function assembleCP009Question(input: {
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
      `Insufficient distinct distractors for CP009 ${input.familyId}. Got ${filteredDistractors.length}`
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
    id: `PUN-001-CP009-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP009",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP009-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

// -------------------------------------------------------------------------
const CP009_F01_STEM_TEMPLATES = [
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਹੀ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਚੁਣੋ:`,
  (w: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਮਾਨਾਰਥੀ (ਇੱਕੋ ਜਿਹੇ ਅਰਥ ਵਾਲਾ) ਹੈ?`,
  (w: string) => `‘${w}’ ਦੇ ਸਮਾਨ ਅਰਥ ਪ੍ਰਗਟਾਉਣ ਵਾਲਾ ਢੁਕਵਾਂ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  (w: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਲਈ ਟਕਸਾਲੀ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਦੱਸੋ:`,
  (w: string) => `ਟਕਸਾਲੀ ਸ਼ਬਦ-ਭੰਡਾਰ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਪਰਿਆਇਵਾਚੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  (w: string) => `ਕਿਹੜਾ ਵਿਕਲਪ ‘${w}’ ਦੇ ਸਮਾਨਅਰਥੀ ਭਾਵ ਨੂੰ ਸਹੀ ਰੂਪ ਵਿੱਚ ਦਰਸਾਉਂਦਾ ਹੈ?`,
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਦੇ ਤੁਲਨਾਤਮਕ ਅਰਥ ਰੱਖਣ ਵਾਲੇ ਸ਼ਬਦ ਦੀ ਚੋਣ ਕਰੋ:`,
  (w: string) => `ਪ੍ਰੀਖਿਆ ਸ਼ਬਦਾਵਲੀ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਪਰਿਆਇ ਕਿਹੜਾ ਹੈ?`,
];

const CP009_F02_STEM_TEMPLATES = [
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਹੀ ਵਿਰੋਧੀ (ਉਲਟ-ਭਾਵੀ) ਸ਼ਬਦ ਚੁਣੋ:`,
  (w: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਸ਼ਬਦ ‘${w}’ ਦਾ ਉਲਟ ਅਰਥ ਦਰਸਾਉਂਦਾ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  (w: string) => `‘${w}’ ਸ਼ਬਦ ਦਾ ਵਿਰੋਧਾਭਾਸੀ (Antonym) ਸ਼ਬਦ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
  (w: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਹੀ ਉਲਟ-ਭਾਵੀ ਸ਼ਬਦ ਦੱਸੋ:`,
  (w: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕਿਹੜਾ ਬਣਦਾ ਹੈ?`,
  (w: string) => `ਕਿਹੜਾ ਵਿਕਲਪ ‘${w}’ ਦੇ ਉਲਟ ਅਰਥ ਨੂੰ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ?`,
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਦੇ ਵਿਪਰੀਤ ਭਾਵ ਨੂੰ ਪ੍ਰਗਟਾਉਂਦਾ ਸ਼ਬਦ ਲੱਭੋ:`,
  (w: string) => `‘${w}’ ਦੇ ਵਿਰੋਧੀ ਅਰਥਾਂ ਵਾਲੇ ਸਹੀ ਵਿਕਲਪ ਦੀ ਚੋਣ ਕਰੋ:`,
];

const CP009_F03_SYN_TEMPLATES = [
  (w: string) => `ਵਾਕ ਵਿੱਚ ਵਰਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਦਾ ਢੁਕਵਾਂ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਚੁਣੋ:\n\n“ਉਸ ਦਾ ਵਿਵਹਾਰ ਸਭ ਲਈ ‘${w}’ ਅਤੇ ਪ੍ਰੇਰਨਾਦਾਇਕ ਹੈ।”`,
  (w: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚ ‘${w}’ ਦੀ ਥਾਂ ਕਿਹੜਾ ਸਮਾਨਾਰਥੀ ਸ਼ਬਦ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ?\n\n“ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ‘${w}’ ਬਣਨ ਦੀ ਸਿੱਖਿਆ ਦਿੱਤੀ।”`,
  (w: string) => `ਵਾਕ ਦੇ ਪ੍ਰਸੰਗ ਅਨੁਸਾਰ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਹੀ ਸਮਾਨਾਰਥੀ ਵਿਕਲਪ ਲੱਭੋ:\n\n“ਸਮਾਜ ਵਿੱਚ ‘${w}’ ਸੋਚ ਰੱਖਣ ਵਾਲੇ ਵਿਅਕਤੀ ਦਾ ਹਰ ਕੋਈ ਆਦਰ ਕਰਦਾ ਹੈ।”`,
];

const CP009_F03_ANT_TEMPLATES = [
  (w: string) => `ਵਾਕ ਦੇ ਪ੍ਰਸੰਗ ਵਿੱਚ ਰੇਖਾਂਕਿਤ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਹੀ ਵਿਰੋਧੀ (ਉਲਟ-ਭਾਵੀ) ਸ਼ਬਦ ਕੀ ਹੋਵੇਗਾ?\n\n“ਜੀਵਨ ਵਿੱਚ ‘${w}’ ਹੋਣਾ ਸਫ਼ਲਤਾ ਲਈ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ।”`,
  (w: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨ ਵਿੱਚ ‘${w}’ ਦਾ ਵਿਰੋਧੀ ਅਰਥ ਪ੍ਰਗਟ ਕਰਦਾ ਸ਼ਬਦ ਚੁਣੋ:\n\n“ਹਰ ਮਨੁੱਖ ਨੂੰ ‘${w}’ ਦੇ ਮਾਰਗ ਉੱਤੇ ਚੱਲਣ ਦਾ ਜਤਨ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।”`,
  (w: string) => `ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ‘${w}’ ਦੇ ਉਲਟ ਭਾਵ ਵਾਲੇ ਸ਼ਬਦ ਦੀ ਚੋਣ ਕਰੋ:\n\n“ਉਸ ਦੇ ਮਨ ਵਿੱਚ ‘${w}’ ਦੀ ਭਾਵਨਾ ਬਿਲਕੁਲ ਨਹੀਂ ਸੀ।”`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Synonym Resolution (ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ)
// -------------------------------------------------------------------------
export function generateCP009F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);

  const item = rng.pickOne(SYNONYM_SETS);

  // Bidirectional / Multi-node query
  const swap = rng.next() > 0.5;
  const sourceWord = swap ? item.primarySynonym : item.headword;
  const targetWord = swap ? item.headword : item.primarySynonym;

  const easyTemplates = [
    (w: string) => `ਸਧਾਰਨ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਚੁਣੋ:`,
    (w: string) => `‘${w}’ ਦੇ ਸਮਾਨ ਅਰਥ ਪ੍ਰਗਟਾਉਣ ਵਾਲਾ ਢੁਕਵਾਂ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    (w: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਮਾਨਾਰਥੀ ਸ਼ਬਦ ਦੱਸੋ:`,
  ];
  const medTemplates = [
    (w: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਮਾਨਾਰਥੀ (ਇੱਕੋ ਜਿਹੇ ਅਰਥ ਵਾਲਾ) ਹੈ?`,
    (w: string) => `ਟਕਸਾਲੀ ਸ਼ਬਦ-ਭੰਡਾਰ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਪਰਿਆਇਵਾਚੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    (w: string) => `ਕਿਹੜਾ ਵਿਕਲਪ ‘${w}’ ਦੇ ਸਮਾਨਅਰਥੀ ਭਾਵ ਨੂੰ ਸਹੀ ਰੂਪ ਵਿੱਚ ਦਰਸਾਉਂਦਾ ਹੈ?`,
  ];
  const hardTemplates = [
    (w: string) => `ਪ੍ਰੀਖਿਆ ਸ਼ਬਦਾਵਲੀ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਪਰਿਆਇ ਕਿਹੜਾ ਹੈ?`,
    (w: string) => `ਸ਼ਬਦ ‘${w}’ ਦੇ ਤੁਲਨਾਤਮਕ ਅਰਥ ਰੱਖਣ ਵਾਲੇ ਸ਼ਬਦ ਦੀ ਚੋਣ ਕਰੋ:`,
    (w: string) => `ਉੱਚ-ਪੱਧਰੀ ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਲੱਭੋ:`,
  ];
  const templates = difficulty === "Easy" ? easyTemplates : difficulty === "Medium" ? medTemplates : hardTemplates;
  const stemTemplate = rng.pickOne(templates);

  return assembleCP009Question({
    familyId: "F01",
    seed,
    difficulty,
    stem: stemTemplate(sourceWord),
    correctAnswer: targetWord,
    distractors: item.distractors,
    explanation: `${item.explanationPa} ਇਸ ਦੇ ਹੋਰ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਹਨ: ${item.otherSynonyms.join(", ")}।`,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: Antonym Resolution (ਵਿਰੋਧੀ ਸ਼ਬਦ)
// -------------------------------------------------------------------------
export function generateCP009F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);

  const item = rng.pickOne(ANTONYM_PAIRS);

  // Bidirectional antonym query
  const toAntonym = rng.next() > 0.4;
  const sourceWord = toAntonym ? item.word : item.antonym;
  const targetWord = toAntonym ? item.antonym : item.word;

  const easyTemplates = [
    (w: string) => `ਸਧਾਰਨ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਉਲਟ-ਭਾਵੀ (ਵਿਰੋਧੀ) ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    (w: string) => `ਸ਼ਬਦ ‘${w}’ ਦਾ ਉਲਟ ਅਰਥ ਦੇਣ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ:`,
    (w: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਦਾ ਸਹੀ ਉਲਟ-ਭਾਵੀ ਸ਼ਬਦ ਦੱਸੋ:`,
  ];
  const medTemplates = [
    (w: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਸ਼ਬਦ ‘${w}’ ਦਾ ਉਲਟ ਅਰਥ ਦਰਸਾਉਂਦਾ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    (w: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕਿਹੜਾ ਬਣਦਾ ਹੈ?`,
    (w: string) => `ਕਿਹੜਾ ਵਿਕਲਪ ‘${w}’ ਦੇ ਉਲਟ ਅਰਥ ਨੂੰ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ?`,
  ];
  const hardTemplates = [
    (w: string) => `‘${w}’ ਸ਼ਬਦ ਦਾ ਵਿਰੋਧਾਭਾਸੀ (Antonym) ਸ਼ਬਦ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
    (w: string) => `ਸ਼ਬਦ ‘${w}’ ਦੇ ਵਿਪਰੀਤ ਭਾਵ ਨੂੰ ਪ੍ਰਗਟਾਉਂਦਾ ਸ਼ਬਦ ਲੱਭੋ:`,
    (w: string) => `ਪ੍ਰੀਖਿਆ ਦੇ ਪੱਧਰ ਅਨੁਸਾਰ ‘${w}’ ਦਾ ਸਹੀ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  ];
  const templates = difficulty === "Easy" ? easyTemplates : difficulty === "Medium" ? medTemplates : hardTemplates;
  const stemTemplate = rng.pickOne(templates);

  // When asking in reverse, include item.word in options and swap appropriately
  const rawDistractors = [...item.distractors];
  if (!toAntonym) {
    rawDistractors.push(item.word + "ਤਾ", item.antonym + "ਪੁਣਾ");
  }

  return assembleCP009Question({
    familyId: "F02",
    seed,
    difficulty,
    stem: stemTemplate(sourceWord),
    correctAnswer: targetWord,
    distractors: rawDistractors,
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 3: Contextual In-Sentence Evaluation (ਵਾਕ-ਪ੍ਰਸੰਗ ਵਿੱਚ ਪਰਖ)
// -------------------------------------------------------------------------
export function generateCP009F03(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);
  const isSynonym = rng.next() > 0.5;

  if (isSynonym) {
    const item = rng.pickOne(SYNONYM_SETS);
    const stemTemplate = rng.pickOne(CP009_F03_SYN_TEMPLATES);

    return assembleCP009Question({
      familyId: "F03",
      seed,
      difficulty,
      stem: stemTemplate(item.headword),
      correctAnswer: item.primarySynonym,
      distractors: item.distractors,
      explanation: `${item.explanationPa} ਇਸ ਵਾਕ ਵਿੱਚ ‘${item.headword}’ ਦਾ ਸਹੀ ਸਮਾਨਾਰਥੀ ‘${item.primarySynonym}’ ਹੈ।`,
      authorityIds: [item.id],
    });
  } else {
    const item = rng.pickOne(ANTONYM_PAIRS);
    const stemTemplate = rng.pickOne(CP009_F03_ANT_TEMPLATES);

    return assembleCP009Question({
      familyId: "F03",
      seed,
      difficulty,
      stem: stemTemplate(item.word),
      correctAnswer: item.antonym,
      distractors: item.distractors,
      explanation: `${item.explanationPa} ਇਸ ਵਾਕ ਵਿੱਚ ‘${item.word}’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘${item.antonym}’ ਹੈ।`,
      authorityIds: [item.id],
    });
  }
}

