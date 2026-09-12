/**
 * CP013 Question Families:
 * CP013-F01: Sentence Classification (ਬਣਤਰ ਅਤੇ ਕਾਰਜ ਪੱਖੋਂ ਵਾਕ ਦੀ ਵੰਡ)
 * CP013-F02: Sentence Transformation (ਵਾਕ-ਵਟਾਂਦਰਾ)
 * CP013-F03: Sentence Correction (ਵਾਕ-ਸ਼ੁੱਧੀ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  CP013_CLASSIFICATION_ITEMS,
  CP013_CORRECTION_ITEMS,
  CP013_TRANSFORMATION_ITEMS,
  type SentenceClassificationItem,
  type SentenceCorrectionItem,
  type SentenceTransformationItem,
} from "./CP013-authorities";

function assembleCP013Question(input: {
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
    new Set(
      input.distractors
        .map((d) => d.trim())
        .filter((d) => d.length > 0 && d !== input.correctAnswer.trim())
    )
  );

  if (filteredDistractors.length < 3) {
    throw new Error(
      `Insufficient distinct distractors for CP013 ${input.familyId}. Got ${filteredDistractors.length} for answer '${input.correctAnswer}'`
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
    id: `PUN-001-CP013-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP013",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.1.0",
      fingerprint: `FINGERPRINT-CP013-${input.familyId}-${input.seed}-${input.difficulty.toUpperCase()}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

// -------------------------------------------------------------------------
// FAMILY 1: Sentence Classification (ਬਣਤਰ ਅਤੇ ਕਾਰਜ ਪੱਖੋਂ ਵਾਕ-ਵੰਡ)
// -------------------------------------------------------------------------

const STRUCTURE_POOL = ["ਸਧਾਰਨ ਵਾਕ", "ਸੰਯੁਕਤ ਵਾਕ", "ਮਿਸ਼ਰਤ ਵਾਕ", "ਗੁੰਝਲਦਾਰ ਵਾਕ"] as const;
const FUNCTION_POOL = [
  "ਹਾਂ-ਵਾਚਕ ਵਾਕ",
  "ਨਾਂਹ-ਵਾਚਕ ਵਾਕ",
  "ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਵਾਕ",
  "ਹੁਕਮੀ ਵਾਕ",
  "ਵਿਸਮਈ ਵਾਕ",
] as const;

const CP013_GRAMMAR_DEFINITIONS = [
  {
    stem: "ਜਿਸ ਵਾਕ ਵਿੱਚ ਕੇਵਲ ਇੱਕ ਹੀ ਸੁਤੰਤਰ ਉਪਵਾਕ ਅਤੇ ਇੱਕ ਹੀ ਸਮਾਪਿਕਾ ਕਿਰਿਆ ਹੋਵੇ, ਉਸ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
    correct: "ਸਧਾਰਨ ਵਾਕ",
    distractors: ["ਸੰਯੁਕਤ ਵਾਕ", "ਮਿਸ਼ਰਤ ਵਾਕ", "ਗੁੰਝਲਦਾਰ ਵਾਕ"],
    exp: "ਇੱਕੋ ਸਮਾਪਿਕਾ ਕਿਰਿਆ ਵਾਲਾ ਵਾਕ 'ਸਧਾਰਨ ਵਾਕ' ਅਖਵਾਉਂਦਾ ਹੈ।",
  },
  {
    stem: "ਦੋ ਜਾਂ ਦੋ ਤੋਂ ਵੱਧ ਸੁਤੰਤਰ ਉਪਵਾਕਾਂ ਨੂੰ ਸਮਾਨ ਯੋਜਕਾਂ (ਅਤੇ, ਪਰ, ਜਾਂ ਆਦਿ) ਨਾਲ ਜੋੜ ਕੇ ਬਣਿਆ ਵਾਕ ਕੀ ਅਖਵਾਉਂਦਾ ਹੈ?",
    correct: "ਸੰਯੁਕਤ ਵਾਕ",
    distractors: ["ਸਧਾਰਨ ਵਾਕ", "ਮਿਸ਼ਰਤ ਵਾਕ", "ਅਧੀਨ ਉਪਵਾਕ"],
    exp: "ਸਮਾਨ ਯੋਜਕਾਂ ਨਾਲ ਜੁੜੇ ਸੁਤੰਤਰ ਉਪਵਾਕਾਂ ਦੇ ਸਮੂਹ ਨੂੰ 'ਸੰਯੁਕਤ ਵਾਕ' ਕਹਿੰਦੇ ਹਨ।",
  },
  {
    stem: "ਜਿਸ ਵਾਕ ਵਿੱਚ ਇੱਕ ਮੁੱਖ ਉਪਵਾਕ ਅਤੇ ਇੱਕ ਜਾਂ ਵੱਧ ਅਧੀਨ ਉਪਵਾਕ ਯੋਜਕਾਂ ਨਾਲ ਜੁੜੇ ਹੋਣ, ਉਸ ਨੂੰ ਕੀ ਆਖਦੇ ਹਨ?",
    correct: "ਮਿਸ਼ਰਤ ਵਾਕ",
    distractors: ["ਸਧਾਰਨ ਵਾਕ", "ਸੰਯੁਕਤ ਵਾਕ", "ਹੁਕਮੀ ਵਾਕ"],
    exp: "ਮੁੱਖ ਅਤੇ ਅਧੀਨ ਉਪਵਾਕਾਂ ਦੇ ਸੁਮੇਲ ਨੂੰ 'ਮਿਸ਼ਰਤ ਵਾਕ' ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",
  },
  {
    stem: "ਪੰਜਾਬੀ ਵਾਕ-ਬਣਤਰ ਦੀ ਸਾਧਾਰਨ ਤਰਤੀਬ (Word Order) ਕਿਹੜੀ ਹੈ?",
    correct: "ਕਰਤਾ + ਕਰਮ + ਕਿਰਿਆ (SOV)",
    distractors: [
      "ਕਰਤਾ + ਕਿਰਿਆ + ਕਰਮ (SVO)",
      "ਕਿਰਿਆ + ਕਰਤਾ + ਕਰਮ (VSO)",
      "ਕਰਮ + ਕਰਤਾ + ਕਿਰਿਆ (OSV)",
    ],
    exp: "ਪੰਜਾਬੀ ਵਿੱਚ ਵਾਕ ਦੀ ਮੂਲ ਤਰਤੀਬ ਕਰਤਾ (Subject), ਕਰਮ (Object) ਅਤੇ ਕਿਰਿਆ (Verb) ਹੁੰਦੀ ਹੈ।",
  },
  {
    stem: "ਵਾਕ ਵਿੱਚ ਜਿਸ ਬਾਰੇ ਕੁਝ ਕਿਹਾ ਜਾਂਦਾ ਹੈ, ਉਸ ਨੂੰ ਵਿਆਕਰਨ ਅਨੁਸਾਰ ਕੀ ਆਖਦੇ ਹਨ?",
    correct: "ਉਦੇਸ਼ (Subject)",
    distractors: ["ਵਿਧੇਯ (Predicate)", "ਸਮਾਪਿਕਾ ਕਿਰਿਆ", "ਸੰਬੰਧਕ"],
    exp: "ਵਾਕ ਦੇ ਦੋ ਮੁੱਖ ਭਾਗ ਹੁੰਦੇ ਹਨ: ਉਦੇਸ਼ (ਜਿਸ ਬਾਰੇ ਗੱਲ ਹੋਵੇ) ਅਤੇ ਵਿਧੇਯ (ਉਦੇਸ਼ ਬਾਰੇ ਜੋ ਕਿਹਾ ਜਾਵੇ)।",
  },
  {
    stem: "ਵਾਕ ਵਿੱਚ ਉਦੇਸ਼ (ਕਰਤਾ) ਬਾਰੇ ਜੋ ਕੁਝ ਵਿਧਾਨ ਕੀਤਾ ਜਾਂ ਦੱਸਿਆ ਜਾਵੇ, ਉਸ ਨੂੰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
    correct: "ਵਿਧੇਯ (Predicate)",
    distractors: ["ਉਦੇਸ਼ (Subject)", "ਪੂਰਕ (Complement)", "ਯੋਜਕ (Conjunction)"],
    exp: "ਉਦੇਸ਼ ਬਾਰੇ ਦਿੱਤੀ ਗਈ ਸੂਚਨਾ ਨੂੰ 'ਵਿਧੇਯ' ਆਖਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    stem: "ਜਿਸ ਵਾਕ ਵਿੱਚ ਕਿਸੇ ਕੰਮ ਦੇ ਕਰਨ ਜਾਂ ਹੋਣ ਦੀ ਸਧਾਰਨ ਹਾਂ-ਪੱਖੀ ਸੂਚਨਾ ਮਿਲੇ, ਉਸ ਨੂੰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
    correct: "ਹਾਂ-ਵਾਚਕ ਵਾਕ",
    distractors: ["ਨਾਂਹ-ਵਾਚਕ ਵਾਕ", "ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਵਾਕ", "ਹੁਕਮੀ ਵਾਕ"],
    exp: "ਹਾਂ-ਪੱਖੀ ਬਿਆਨ ਵਾਲੇ ਵਾਕ ਨੂੰ 'ਹਾਂ-ਵਾਚਕ ਵਾਕ' ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",
  },
  {
    stem: "ਜਿਸ ਵਾਕ ਵਿੱਚ ਕਿਸੇ ਕੰਮ ਦੇ ਨਾ ਹੋਣ ਜਾਂ ਇਨਕਾਰ ਦਾ ਭਾਵ ਪ੍ਰਗਟ ਹੋਵੇ, ਉਹ ਕਿਹੜਾ ਵਾਕ ਹੁੰਦਾ ਹੈ?",
    correct: "ਨਾਂਹ-ਵਾਚਕ ਵਾਕ",
    distractors: ["ਹਾਂ-ਵਾਚਕ ਵਾਕ", "ਵਿਸਮਈ ਵਾਕ", "ਹੁਕਮੀ ਵਾਕ"],
    exp: "ਇਨਕਾਰ ਜਾਂ ਮਨਾਹੀ ਵਾਲੇ ਵਾਕ ਨੂੰ 'ਨਾਂਹ-ਵਾਚਕ ਵਾਕ' ਆਖਦੇ ਹਨ।",
  },
  {
    stem: "ਜਿਸ ਵਾਕ ਵਿੱਚ ਕੋਈ ਆਗਿਆ, ਹੁਕਮ, ਨਸੀਹਤ ਜਾਂ ਪ੍ਰਾਰਥਨਾ ਕੀਤੀ ਗਈ ਹੋਵੇ, ਉਸ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
    correct: "ਹੁਕਮੀ ਵਾਕ",
    distractors: ["ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਵਾਕ", "ਵਿਸਮਈ ਵਾਕ", "ਸੰਯੁਕਤ ਵਾਕ"],
    exp: "ਹੁਕਮ, ਆਗਿਆ ਜਾਂ ਬੇਨਤੀ ਪ੍ਰਗਟ ਕਰਨ ਵਾਲੇ ਵਾਕ ਨੂੰ 'ਹੁਕਮੀ ਵਾਕ' ਆਖਦੇ ਹਨ।",
  },
  {
    stem: "ਮਨ ਦੇ ਅਚਾਨਕ ਖ਼ੁਸ਼ੀ, ਸ਼ੋਕ, ਹੈਰਾਨੀ ਜਾਂ ਡਰ ਦੇ ਵਲਵਲਿਆਂ ਨੂੰ ਪ੍ਰਗਟ ਕਰਨ ਵਾਲਾ ਵਾਕ ਕਿਹੜਾ ਹੁੰਦਾ ਹੈ?",
    correct: "ਵਿਸਮਈ ਵਾਕ",
    distractors: ["ਬਿਆਨੀਆ ਵਾਕ", "ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਵਾਕ", "ਹੁਕਮੀ ਵਾਕ"],
    exp: "ਤੀਬਰ ਭਾਵਨਾਵਾਂ ਅਤੇ ਮਨੋਵੇਗਾਂ ਨੂੰ ਦਰਸਾਉਣ ਵਾਲਾ ਵਾਕ 'ਵਿਸਮਈ ਵਾਕ' ਹੁੰਦਾ ਹੈ।",
  },
];

export function generateCP013_F01(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium"
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);

  if (difficulty === "Easy") {
    const isDef = rng.next() > 0.65;
    if (isDef) {
      const defItem = rng.pickOne(CP013_GRAMMAR_DEFINITIONS);
      return assembleCP013Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: defItem.stem,
        correctAnswer: defItem.correct,
        distractors: defItem.distractors,
        explanation: defItem.exp,
        authorityIds: ["PUN-SYNTAX-DEF-01"],
      });
    }

    const item: SentenceClassificationItem = rng.pickOne(CP013_CLASSIFICATION_ITEMS);
    const isStructure = rng.next() > 0.4;
    if (isStructure) {
      const distractors = STRUCTURE_POOL.filter((t) => t !== item.structureType);
      const templates = [
        (s: string) => `ਸਧਾਰਨ ਵਾਕ “${s}” ਦੀ ਬਣਤਰ ਪੱਖੋਂ ਕਿਸਮ ਦੱਸੋ:`,
        (s: string) => `ਵਾਕ “${s}” ਬਣਤਰ ਦੇ ਆਧਾਰ 'ਤੇ ਕਿਹੜਾ ਹੈ?`,
        (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਦੀ ਬਣਤਰੀ ਕਿਸਮ ਚੁਣੋ: “${s}”`,
        (s: string) => `ਦਿੱਤਾ ਗਿਆ ਵਾਕ “${s}” ਬਣਤਰ ਪੱਖੋਂ ਕਿਹੜਾ ਭੇਦ ਹੈ?`,
        (s: string) => `“${s}” — ਇਹ ਵਾਕ ਕਿਸ ਬਣਤਰੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
        (s: string) => `ਸੰਰਚਨਾ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਦਾ ਸਹੀ ਭੇਦ ਲੱਭੋ:`,
      ];
      const stem = rng.pickOne(templates)(item.sentencePa);
      return assembleCP013Question({
        familyId: "F01",
        seed,
        difficulty,
        stem,
        correctAnswer: item.structureType,
        distractors,
        explanation: `${item.explanationPa} ਇਸ ਲਈ ਇਹ ਬਣਤਰ ਪੱਖੋਂ '${item.structureType}' ਹੈ।`,
        authorityIds: [item.id, "PUN-SYNTAX-STRUCTURE-01"],
      });
    } else {
      const distractors = FUNCTION_POOL.filter((t) => t !== item.functionType);
      const templates = [
        (s: string) => `ਵਾਕ “${s}” ਦਾ ਭਾਵ ਜਾਂ ਕਾਰਜ ਕੀ ਹੈ?`,
        (s: string) => `ਅਰਥ ਦੇ ਪੱਖੋਂ ਵਾਕ “${s}” ਕਿਹੋ ਜਿਹਾ ਹੈ?`,
        (s: string) => `ਕਾਰਜ ਅਨੁਸਾਰ ਦਿੱਤੇ ਵਾਕ “${s}” ਦੀ ਸਹੀ ਸ਼੍ਰੇਣੀ ਚੁਣੋ:`,
        (s: string) => `ਵਾਕ “${s}” ਦਾ ਕਾਰਜੀ ਪ੍ਰਗਟਾਵਾ ਕਿਹੜਾ ਹੈ?`,
        (s: string) => `“${s}” — ਭਾਵ ਜਾਂ ਅਰਥ ਪੱਖੋਂ ਇਸ ਵਾਕ ਦੀ ਕਿਸਮ ਦੱਸੋ:`,
        (s: string) => `ਬੋਲਚਾਲੀ ਲਹਿਜੇ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਦਾ ਕਾਰਜੀ ਭੇਦ ਕੀ ਹੈ?`,
      ];
      const stem = rng.pickOne(templates)(item.sentencePa);
      return assembleCP013Question({
        familyId: "F01",
        seed,
        difficulty,
        stem,
        correctAnswer: item.functionType,
        distractors,
        explanation: `${item.explanationPa} ਇਸ ਲਈ ਇਹ ਕਾਰਜ ਪੱਖੋਂ '${item.functionType}' ਹੈ।`,
        authorityIds: [item.id, "PUN-SYNTAX-FUNCTION-01"],
      });
    }
  }

  if (difficulty === "Medium") {
    const item: SentenceClassificationItem = rng.pickOne(CP013_CLASSIFICATION_ITEMS);
    const isStructure = rng.next() > 0.35;
    if (isStructure) {
      const distractors = STRUCTURE_POOL.filter((t) => t !== item.structureType);
      const templates = [
        (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਦੀ ਬਣਤਰ ਪੱਖੋਂ ਕਿਸਮ ਪਛਾਣੋ:\n"${s}"`,
        (s: string) => `ਬਣਤਰ ਦੇ ਆਧਾਰ 'ਤੇ ਹੇਠਾਂ ਦਿੱਤਾ ਵਾਕ ਕਿਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?\n“${s}”`,
        (s: string) => `“${s}” — ਬਣਤਰ ਪੱਖੋਂ ਇਹ ਕਿਸ ਪ੍ਰਕਾਰ ਦਾ ਵਾਕ ਹੈ?`,
        (s: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਦੀ ਬਣਤਰ ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ਚੁਣੋ:\n“${s}”`,
        (s: string) => `ਵਿਆਕਰਨਕ ਬਣਤਰ ਪੱਖੋਂ ਵਾਕ “${s}” ਦਾ ਸਹੀ ਭੇਦ ਕਿਹੜਾ ਹੈ?`,
        (s: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਨ ਨੇਮਾਂ ਅਧੀਨ ਵਾਕ “${s}” ਦੀ ਬਣਤਰ ਨਿਰਧਾਰਿਤ ਕਰੋ:`,
      ];
      const stem = rng.pickOne(templates)(item.sentencePa);
      return assembleCP013Question({
        familyId: "F01",
        seed,
        difficulty,
        stem,
        correctAnswer: item.structureType,
        distractors,
        explanation: `${item.explanationPa} ਇਸ ਲਈ ਇਹ ਬਣਤਰ ਪੱਖੋਂ '${item.structureType}' ਹੈ।`,
        authorityIds: [item.id, "PUN-SYNTAX-STRUCTURE-01"],
      });
    } else {
      const distractors = FUNCTION_POOL.filter((t) => t !== item.functionType);
      const templates = [
        (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਦੀ ਕਾਰਜ ਜਾਂ ਭਾਵ ਪੱਖੋਂ ਕਿਸਮ ਦੱਸੋ:\n"${s}"`,
        (s: string) => `ਕਾਰਜ ਜਾਂ ਅਰਥ ਦੇ ਪੱਖ ਤੋਂ ਦਿੱਤਾ ਗਿਆ ਵਾਕ ਕਿਹੜਾ ਹੈ?\n“${s}”`,
        (s: string) => `“${s}” — ਇਹ ਵਾਕ ਪ੍ਰਗਟਾਵੇ/ਭਾਵ ਅਨੁਸਾਰ ਕਿਸ ਵੰਡ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
        (s: string) => `ਵਾਕ “${s}” ਦਾ ਕਾਰਜੀ ਅਤੇ ਭਾਵ-ਬੋਧਕ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
        (s: string) => `ਅਰਥ ਅਤੇ ਕਾਰਜ ਦੇ ਆਧਾਰ 'ਤੇ ਵਾਕ “${s}” ਦੀ ਕਿਸਮ ਦੱਸੋ:`,
        (s: string) => `ਪ੍ਰਗਟਾਵੇ ਦੇ ਲਹਿਜੇ ਅਨੁਸਾਰ “${s}” ਦਾ ਸਹੀ ਵਰਗ ਕਿਹੜਾ ਹੈ?`,
      ];
      const stem = rng.pickOne(templates)(item.sentencePa);
      return assembleCP013Question({
        familyId: "F01",
        seed,
        difficulty,
        stem,
        correctAnswer: item.functionType,
        distractors,
        explanation: `${item.explanationPa} ਇਸ ਲਈ ਇਹ ਕਾਰਜ ਪੱਖੋਂ '${item.functionType}' ਹੈ।`,
        authorityIds: [item.id, "PUN-SYNTAX-FUNCTION-01"],
      });
    }
  }

  // Hard
  const item: SentenceClassificationItem = rng.pickOne(CP013_CLASSIFICATION_ITEMS);
  const isStructure = rng.next() > 0.4;
  if (isStructure) {
    const distractors = STRUCTURE_POOL.filter((t) => t !== item.structureType);
    const templates = [
      (s: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਦਾ ਸ਼ੁੱਧ ਬਣਤਰੀ ਵਰਗੀਕਰਨ ਚੁਣੋ:`,
      (s: string) => `ਵਿਸ਼ੇਸ਼ ਸੰਰਚਨਾ ਵਾਲੇ ਵਾਕ “${s}” ਦੀ ਸਹੀ ਸ਼੍ਰੇਣੀ ਕਿਹੜੀ ਹੈ?`,
      (s: string) => `ਸੰਰਚਨਾਤਮਕ ਵਿਸ਼ਲੇਸ਼ਣ ਦੇ ਆਧਾਰ 'ਤੇ ਵਾਕ “${s}” ਦੀ ਸ਼੍ਰੇਣੀ ਪਛਾਣੋ:`,
      (s: string) => `ਉਪਵਾਕਾਂ ਦੇ ਆਪਸੀ ਸੰਬੰਧਾਂ ਦੀ ਪੜਚੋਲ ਕਰਕੇ ਦੱਸੋ ਕਿ “${s}” ਕਿਸ ਪ੍ਰਕਾਰ ਦਾ ਵਾਕ ਹੈ:`,
      (s: string) => `ਵਾਕ-ਸੰਰਚਨਾ ਦੇ ਗੂੜ੍ਹ ਵਿਆਕਰਨਕ ਨੇਮਾਂ ਅਧੀਨ ਵਾਕ “${s}” ਦੀ ਕਿਸਮ ਕਿਹੜੀ ਹੈ?`,
      (s: string) => `ਡੂੰਘੇ ਵਿਆਕਰਨਕ ਮੁਲੰਕਣ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਦੀ ਬਣਤਰੀ ਸੰਰਚਨਾ ਕੀ ਹੈ?`,
    ];
    const stem = rng.pickOne(templates)(item.sentencePa);
    return assembleCP013Question({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: item.structureType,
      distractors,
      explanation: `${item.explanationPa} ਇਸ ਲਈ ਇਹ ਬਣਤਰ ਪੱਖੋਂ '${item.structureType}' ਹੈ।`,
      authorityIds: [item.id, "PUN-SYNTAX-STRUCTURE-02"],
    });
  } else {
    const distractors = FUNCTION_POOL.filter((t) => t !== item.functionType);
    const templates = [
      (s: string) => `ਪ੍ਰਗਟਾਵੇ ਅਤੇ ਸੰਚਾਰ-ਕਾਰਜ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਦਾ ਸ਼ੁੱਧ ਵਰਗ ਕਿਹੜਾ ਹੈ?`,
      (s: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਵਿੱਚ “${s}” ਨੂੰ ਕਾਰਜ ਪੱਖੋਂ ਕਿਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਰੱਖਿਆ ਜਾਵੇਗਾ?`,
      (s: string) => `ਭਾਵ-ਬੋਧਕ ਵਿਸ਼ਲੇਸ਼ਣ ਦੇ ਆਧਾਰ 'ਤੇ ਵਾਕ “${s}” ਦਾ ਸਹੀ ਕਾਰਜੀ ਭੇਦ ਕਿਹੜਾ ਹੈ?`,
      (s: string) => `ਸੰਚਾਰੀ ਮੰਤਵ ਅਤੇ ਪ੍ਰਗਟਾਵੇ ਦੀ ਸ਼ੈਲੀ ਅਨੁਸਾਰ “${s}” ਦਾ ਸਹੀ ਰੂਪ ਦੱਸੋ:`,
      (s: string) => `ਭਾਸ਼ਾਈ ਪ੍ਰਯੋਗ ਅਤੇ ਵਾਕੰਸ਼ਕ ਲਹਿਜੇ ਅਨੁਸਾਰ “${s}” ਦੀ ਸਹੀ ਕਾਰਜੀ ਸ਼੍ਰੇਣੀ ਕੀ ਹੈ?`,
    ];
    const stem = rng.pickOne(templates)(item.sentencePa);
    return assembleCP013Question({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: item.functionType,
      distractors,
      explanation: `${item.explanationPa} ਇਸ ਲਈ ਇਹ ਕਾਰਜ ਪੱਖੋਂ '${item.functionType}' ਹੈ।`,
      authorityIds: [item.id, "PUN-SYNTAX-FUNCTION-02"],
    });
  }
}

// -------------------------------------------------------------------------
// FAMILY 2: Sentence Transformation (ਵਾਕ-ਵਟਾਂਦਰਾ)
// -------------------------------------------------------------------------

export function generateCP013_F02(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium"
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);
  const item: SentenceTransformationItem = rng.pickOne(CP013_TRANSFORMATION_ITEMS);

  if (difficulty === "Easy") {
    const templates = [
      (target: string, orig: string) => `ਸਧਾਰਨ ਨੇਮਾਂ ਅਨੁਸਾਰ ਵਾਕ “${orig}” ਨੂੰ '${target}' ਵਿੱਚ ਬਦਲੋ:`,
      (target: string, orig: string) => `“${orig}” — ਇਸ ਵਾਕ ਦਾ ਸਹੀ '${target}' ਰੂਪ ਚੁਣੋ:`,
      (target: string, orig: string) => `ਵਾਕ “${orig}” ਦਾ ਢੁਕਵਾਂ '${target}' ਰੂਪਾਂਤਰਣ ਕੀ ਹੋਵੇਗਾ?`,
      (target: string, orig: string) => `ਮੂਲ ਵਾਕ “${orig}” ਨੂੰ '${target}' ਵਿੱਚ ਬਦਲ ਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:`,
      (target: string, orig: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਨੂੰ ਬਿਨਾਂ ਭਾਵ ਬਦਲੇ '${target}' ਵਿੱਚ ਲਿਖੋ: “${orig}”`,
      (target: string, orig: string) => `ਨਿਯਮ ਅਨੁਸਾਰ ਵਾਕ “${orig}” ਦਾ ਪਰਿਵਰਤਿਤ '${target}' ਰੂਪ ਦੱਸੋ:`,
    ];
    const stem = rng.pickOne(templates)(item.targetCategory, item.originalSentence);
    return assembleCP013Question({
      familyId: "F02",
      seed,
      difficulty,
      stem,
      correctAnswer: item.correctSentence,
      distractors: item.distractors,
      explanation: `${item.explanationPa} ਸਹੀ ਰੂਪ: "${item.correctSentence}"`,
      authorityIds: [item.id, "PUN-SYNTAX-TRANSFORMATION-01"],
    });
  }

  if (difficulty === "Medium") {
    const isReverse = rng.next() > 0.75;
    if (isReverse) {
      const templates = [
        (origCat: string, correctS: string) => `ਵਾਕ “${correctS}” ਦਾ ਮੂਲ '${origCat}' ਰੂਪ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
        (origCat: string, correctS: string) => `“${correctS}” ਨੂੰ ਵਾਪਸ '${origCat}' ਵਿੱਚ ਵਟਾਂਦਰਾ ਕਰਨ 'ਤੇ ਸਹੀ ਵਾਕ ਚੁਣੋ:`,
        (origCat: string, correctS: string) => `ਹੇਠ ਦਿੱਤੇ ਰੂਪਾਂਤਰਿਤ ਵਾਕ ਦਾ ਮੂਲ '${origCat}' ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?\n“${correctS}”`,
        (origCat: string, correctS: string) => `ਵਾਕ-ਵਟਾਂਦਰੇ ਦੇ ਉਲਟ ਅਧਿਐਨ ਅਨੁਸਾਰ “${correctS}” ਦਾ ਮੂਲ '${origCat}' ਰੂਪ ਦੱਸੋ:`,
      ];
      const stem = rng.pickOne(templates)(item.originalCategory, item.correctSentence);
      return assembleCP013Question({
        familyId: "F02",
        seed,
        difficulty,
        stem,
        correctAnswer: item.originalSentence,
        distractors: item.distractors,
        explanation: `ਵਾਕ ਦਾ ਮੂਲ ਰੂਪ “${item.originalSentence}” ਹੈ। ${item.explanationPa}`,
        authorityIds: [item.id, "PUN-SYNTAX-TRANSFORMATION-REVERSE"],
      });
    }

    const templates = [
      (target: string, orig: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਦਾ ਬਿਨਾਂ ਅਰਥ ਬਦਲੇ '${target}' ਵਿੱਚ ਸਹੀ ਰੂਪ ਚੁਣੋ:\nਮੂਲ ਵਾਕ: "${orig}"`,
      (target: string, orig: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਨੂੰ ਵਿਆਕਰਣਕ ਨੇਮਾਂ ਅਨੁਸਾਰ '${target}' ਵਿੱਚ ਰੂਪਾਂਤਰਿਤ ਕਰੋ:\n“${orig}”`,
      (target: string, orig: string) => `“${orig}” — ਇਸ ਵਾਕ ਦਾ ਢੁਕਵਾਂ '${target}' ਰੂਪ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
      (target: string, orig: string) => `ਮੂਲ ਵਾਕ “${orig}” ਨੂੰ '${target}' ਵਿੱਚ ਬਦਲਣ 'ਤੇ ਕਿਹੜਾ ਵਾਕ ਬਣੇਗਾ?`,
      (target: string, orig: string) => `ਵਾਕ-ਵਟਾਂਦਰੇ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ “${orig}” ਦਾ ਸ਼ੁੱਧ '${target}' ਰੂਪ ਚੁਣੋ:`,
      (target: string, orig: string) => `ਵਿਆਕਰਨਕ ਸ਼ੁੱਧਤਾ ਨਾਲ “${orig}” ਦਾ ਪਰਿਵਰਤਿਤ '${target}' ਵਿਕਲਪ ਚੁਣੋ:`,
    ];
    const stem = rng.pickOne(templates)(item.targetCategory, item.originalSentence);
    return assembleCP013Question({
      familyId: "F02",
      seed,
      difficulty,
      stem,
      correctAnswer: item.correctSentence,
      distractors: item.distractors,
      explanation: `${item.explanationPa} ਸਹੀ ਰੂਪ: "${item.correctSentence}"`,
      authorityIds: [item.id, "PUN-SYNTAX-TRANSFORMATION-01"],
    });
  }

  // Hard
  const isReverse = rng.next() > 0.7;
  if (isReverse) {
    const templates = [
      (origCat: string, correctS: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਨ ਨੇਮਾਂ ਅਧੀਨ ਵਾਕ “${correctS}” ਦਾ ਸ਼ੁੱਧ ਮੂਲ '${origCat}' ਰੂਪ ਪਛਾਣੋ:`,
      (origCat: string, correctS: string) => `ਵਾਕ-ਵਟਾਂਦਰੇ ਦੇ ਉਲਟ ਅਧਿਐਨ ਅਨੁਸਾਰ “${correctS}” ਦਾ ਸਹੀ '${origCat}' ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
      (origCat: string, correctS: string) => `ਰੂਪਾਂਤਰਿਤ ਵਾਕ “${correctS}” ਦੀ ਮੂਲ ਵਿਆਕਰਨਕ '${origCat}' ਸੰਰਚਨਾ ਕਿਹੜੀ ਸੀ?`,
    ];
    const stem = rng.pickOne(templates)(item.originalCategory, item.correctSentence);
    return assembleCP013Question({
      familyId: "F02",
      seed,
      difficulty,
      stem,
      correctAnswer: item.originalSentence,
      distractors: item.distractors,
      explanation: `ਮੂਲ '${item.originalCategory}' ਵਾਕ: "${item.originalSentence}"। ${item.explanationPa}`,
      authorityIds: [item.id, "PUN-SYNTAX-TRANSFORMATION-HARD-REVERSE"],
    });
  }

  const templates = [
    (target: string, orig: string) => `ਵਾਕ-ਵਟਾਂਦਰੇ ਦੇ ਉਚੇਚੇ ਨੇਮਾਂ ਅਧੀਨ “${orig}” ਦਾ ਸ਼ੁੱਧ '${target}' ਰੂਪ ਪਛਾਣੋ:`,
    (target: string, orig: string) => `ਅਰਥ ਬਦਲੇ ਬਿਨਾਂ ਵਾਕ “${orig}” ਨੂੰ '${target}' ਵਿੱਚ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਰੂਪਾਂਤਰਿਤ ਵਾਕ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
    (target: string, orig: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਨਕ ਨੇਮਾਵਲੀ ਅਨੁਸਾਰ “${orig}” ਦਾ ਪਰਿਵਰਤਿਤ '${target}' ਰੂਪ ਚੁਣੋ:`,
    (target: string, orig: string) => `ਗੂੜ੍ਹ ਵਾਕੰਸ਼ਕ ਸੰਰਚਨਾ ਅਨੁਸਾਰ “${orig}” ਨੂੰ ਬਿਨਾਂ ਭਾਵ ਬਦਲੇ '${target}' ਵਿੱਚ ਕਿਵੇਂ ਲਿਖਿਆ ਜਾਵੇਗਾ?`,
    (target: string, orig: string) => `ਵਾਕ ਸੰਰਚਨਾ ਵਿੱਚ ਬਿਨਾਂ ਵਿਗਾੜ ਪੈਦਾ ਕੀਤੇ “${orig}” ਦਾ ਸਟੀਕ '${target}' ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
  ];
  const stem = rng.pickOne(templates)(item.targetCategory, item.originalSentence);
  return assembleCP013Question({
    familyId: "F02",
    seed,
    difficulty,
    stem,
    correctAnswer: item.correctSentence,
    distractors: item.distractors,
    explanation: `${item.explanationPa} ਸਹੀ ਰੂਪ: "${item.correctSentence}"`,
    authorityIds: [item.id, "PUN-SYNTAX-TRANSFORMATION-HARD"],
  });
}

// -------------------------------------------------------------------------
// FAMILY 3: Sentence Correction (ਵਾਕ-ਸ਼ੁੱਧੀ)
// -------------------------------------------------------------------------

export function generateCP013_F03(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium"
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);
  const item: SentenceCorrectionItem = rng.pickOne(CP013_CORRECTION_ITEMS);

  if (difficulty === "Easy") {
    const isDirect = rng.next() > 0.4;
    if (isDirect) {
      const templates = [
        (s: string) => `ਸਧਾਰਨ ਵਾਕ “${s}” ਦੀ ਅਸ਼ੁੱਧੀ ਦੂਰ ਕਰਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:`,
        (s: string) => `ਵਾਕ “${s}” ਦਾ ਸ਼ੁੱਧ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
        (s: string) => `ਅਸ਼ੁੱਧ ਵਾਕ “${s}” ਦਾ ਸਹੀ ਟਕਸਾਲੀ ਰੂਪ ਦੱਸੋ:`,
        (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਨੂੰ ਸ਼ੁੱਧ ਕਰਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:\n“${s}”`,
        (s: string) => `“${s}” — ਇਸ ਵਾਕ ਵਿੱਚੋਂ ਵਿਆਕਰਨਕ ਅਸ਼ੁੱਧੀ ਦੂਰ ਕਰਕੇ ਸ਼ੁੱਧ ਵਾਕ ਚੁਣੋ:`,
      ];
      const stem = rng.pickOne(templates)(item.incorrectSentence);
      return assembleCP013Question({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer: item.correctSentence,
        distractors: item.distractors,
        explanation: `ਅਸ਼ੁੱਧੀ ਦੀ ਕਿਸਮ: ${item.errorType}। ${item.explanationPa} ਸ਼ੁੱਧ ਰੂਪ: "${item.correctSentence}"`,
        authorityIds: [item.id, "PUN-SYNTAX-CORRECTION-01"],
      });
    } else {
      const candidateDistractors = [item.incorrectSentence, ...item.distractors];
      const templates = [
        (err: string, orig: string) => `‘${err}’ ਦੀ ਅਸ਼ੁੱਧੀ ਵਾਲੇ ਵਾਕ “${orig}” ਦਾ ਸ਼ੁੱਧ ਰੂਪ ਚੁਣੋ:`,
        (err: string, orig: string) => `ਵਾਕ “${orig}” ਵਿੱਚ ‘${err}’ ਠੀਕ ਕਰਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:`,
        (err: string, orig: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ “${orig}” ਵਿੱਚੋਂ ‘${err}’ ਦੂਰ ਕਰਕੇ ਸ਼ੁੱਧ ਵਾਕ ਦੱਸੋ:`,
        (err: string, orig: string) => `ਵਾਕ “${orig}” (${err}) ਦਾ ਸਹੀ ਵਿਆਕਰਨਕ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
      ];
      const stem = rng.pickOne(templates)(item.errorType, item.incorrectSentence);
      return assembleCP013Question({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer: item.correctSentence,
        distractors: candidateDistractors,
        explanation: `ਸ਼ੁੱਧ ਵਾਕ: "${item.correctSentence}"। ਨਿਯਮ: ${item.explanationPa}`,
        authorityIds: [item.id, "PUN-SYNTAX-CORRECTION-02"],
      });
    }
  }

  if (difficulty === "Medium") {
    const isTypeError = rng.next() > 0.7;
    if (isTypeError) {
      const otherErrorTypes = [
        "ਲਿੰਗ ਅਤੇ ਵਚਨ ਅਨੁਸਾਰ ਕਿਰਿਆ ਅਸ਼ੁੱਧੀ",
        "ਅਣਲੋੜੀਂਦੇ ਸੰਬੰਧਕੀ ਦੁਹਰਾਅ ਦੀ ਅਸ਼ੁੱਧੀ",
        "ਪਦ-ਕ੍ਰਮ (ਸ਼ਬਦਾਂ ਦੀ ਤਰਤੀਬ) ਦੀ ਅਸ਼ੁੱਧੀ",
        "ਨਿਜਵਾਚਕ ਪੜਨਾਂਵ ਸੰਬੰਧੀ ਅਸ਼ੁੱਧੀ",
        "ਕਰਤਾ-ਕਿਰਿਆ ਮੇਲ ਅਸ਼ੁੱਧੀ",
        "ਸੰਬੰਧਕੀ ਪਿਛੇਤਰ ਵਚਨ ਅਸ਼ੁੱਧੀ",
        "ਸਮਾਨਾਰਥਕ ਸ਼ਬਦਾਂ ਦਾ ਅਣਲੋੜੀਂਦਾ ਦੁਹਰਾਅ",
        "ਸਤਿਕਾਰਵਾਚਕ ਬਹੁਵਚਨ ਕਿਰਿਆ ਅਸ਼ੁੱਧੀ",
        "ਕਰਮ ਅਨੁਸਾਰ ਭੂਤਕਾਲੀ ਕਿਰਿਆ ਲਿੰਗ ਅਸ਼ੁੱਧੀ",
      ].filter((t) => t !== item.errorType);

      const templates = [
        (s: string) => `ਅਸ਼ੁੱਧ ਵਾਕ “${s}” ਵਿੱਚ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਸ ਪ੍ਰਕਾਰ ਦਾ ਵਿਆਕਰਨਕ ਦੋਸ਼ ਹੈ?`,
        (s: string) => `ਵਾਕ “${s}” ਵਿੱਚ ਮੌਜੂਦ ਵਿਆਕਰਨਕ ਅਸ਼ੁੱਧੀ ਦੀ ਸ਼੍ਰੇਣੀ ਪਛਾਣੋ:`,
        (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ “${s}” ਵਿੱਚ ਕਿਹੜੇ ਵਿਆਕਰਨਕ ਨਿਯਮ ਦੀ ਉਲੰਘਣਾ ਹੋਈ ਹੈ?`,
        (s: string) => `ਵਿਆਕਰਨਕ ਦ੍ਰਿਸ਼ਟੀ ਤੋਂ ਵਾਕ “${s}” ਵਿੱਚ ਕਿਹੜੀ ਮੁੱਖ ਕਮੀ ਹੈ?`,
      ];
      const stem = rng.pickOne(templates)(item.incorrectSentence);
      return assembleCP013Question({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer: item.errorType,
        distractors: otherErrorTypes,
        explanation: `ਇਸ ਵਾਕ ਵਿੱਚ ‘${item.errorType}’ ਹੈ। ${item.explanationPa} ਸ਼ੁੱਧ ਵਾਕ: "${item.correctSentence}"`,
        authorityIds: [item.id, "PUN-SYNTAX-CORRECTION-TYPE"],
      });
    }

    const useDirectCorrection = rng.next() > 0.45;
    if (useDirectCorrection) {
      const templates = [
        (s: string) => `ਹੇਠ ਲਿਖੇ ਅਸ਼ੁੱਧ ਵਾਕ ਦਾ ਵਿਆਕਰਨਕ ਪੱਖੋਂ ਸ਼ੁੱਧ ਰੂਪ ਕਿਹੜਾ ਹੈ?\nਅਸ਼ੁੱਧ ਵਾਕ: "${s}"`,
        (s: string) => `ਦਿੱਤੇ ਗਏ ਅਸ਼ੁੱਧ ਵਾਕ ਨੂੰ ਸੁਧਾਰ ਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:\n“${s}”`,
        (s: string) => `“${s}” — ਇਸ ਅਸ਼ੁੱਧ ਵਾਕ ਦਾ ਟਕਸਾਲੀ ਸ਼ੁੱਧ ਰੂਪ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
        (s: string) => `ਅਸ਼ੁੱਧ ਵਾਕ “${s}” ਦੀ ਸ਼ੁੱਧ ਵਿਆਕਰਨਕ ਤਰਤੀਬ ਕਿਹੜੀ ਹੈ?`,
        (s: string) => `ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਦਾ ਸ਼ੁੱਧ ਸੰਸਕਰਨ ਕਿਹੜਾ ਹੈ?`,
      ];
      const stem = rng.pickOne(templates)(item.incorrectSentence);
      return assembleCP013Question({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer: item.correctSentence,
        distractors: item.distractors,
        explanation: `ਅਸ਼ੁੱਧੀ ਦੀ ਕਿਸਮ: ${item.errorType}। ${item.explanationPa} ਸ਼ੁੱਧ ਰੂਪ: "${item.correctSentence}"`,
        authorityIds: [item.id, "PUN-SYNTAX-CORRECTION-01"],
      });
    } else {
      const candidateDistractors = [item.incorrectSentence, ...item.distractors];
      const templates = [
        (err: string, orig: string) =>
          `‘${err}’ ਸੰਬੰਧੀ ਵਿਆਕਰਨਕ ਨੇਮਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦਿਆਂ ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਸ਼ੁੱਧ ਵਾਕ ਚੁਣੋ (ਅਸ਼ੁੱਧ ਸੰਦਰਭ: “${orig}”):`,
        (err: string, orig: string) =>
          `ਵਾਕ “${orig}” ਵਿੱਚ ‘${err}’ ਦੀ ਅਸ਼ੁੱਧੀ ਹੈ। ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸ਼ੁੱਧ ਹੈ?`,
        (err: string, orig: string) =>
          `ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ‘${err}’ ਤੋਂ ਮੁਕਤ ਬਿਲਕੁਲ ਸ਼ੁੱਧ ਵਾਕ ਦੀ ਪਛਾਣ ਕਰੋ (ਮੂਲ: “${orig}”):`,
        (err: string, orig: string) =>
          `ਅਸ਼ੁੱਧ ਵਾਕ “${orig}” (${err}) ਦੇ ਆਧਾਰ 'ਤੇ ਦੱਸੋ ਕਿ ਵਿਆਕਰਣਕ ਪੱਖੋਂ ਸ਼ੁੱਧ ਵਾਕ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
      ];
      const stem = rng.pickOne(templates)(item.errorType, item.incorrectSentence);
      return assembleCP013Question({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer: item.correctSentence,
        distractors: candidateDistractors,
        explanation: `ਸ਼ੁੱਧ ਵਾਕ: "${item.correctSentence}"। ਨਿਯਮ: ${item.explanationPa}`,
        authorityIds: [item.id, "PUN-SYNTAX-CORRECTION-02"],
      });
    }
  }

  // Hard: Spot Pure Correct Sentence or Spot Incorrect Sentence
  const modeVal = rng.next();
  if (modeVal > 0.65) {
    // Spot pure correct sentence
    const otherItems = CP013_CORRECTION_ITEMS.filter((other) => other.id !== item.id);
    const shuffledOthers = rng.shuffle([...otherItems]);
    const distractors = shuffledOthers.slice(0, 3).map((o) => o.incorrectSentence);

    const templates = [
      (s: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ “${s}” ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਵਿਆਕਰਨਕ ਨੇਮਾਂ ਅਨੁਸਾਰ ਪੂਰੀ ਤਰ੍ਹਾਂ ‘ਸ਼ੁੱਧ ਵਾਕ’ ਦੀ ਚੋਣ ਕਰੋ:`,
      (s: string) => `ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਵਿਆਕਰਨ ਅਨੁਸਾਰ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਾਕ ਦੋਸ਼-ਮੁਕਤ (ਬਿਲਕੁਲ ਸ਼ੁੱਧ) ਹੈ (ਮੂਲ: “${s}”)?`,
      (s: string) => `ਹੇਠ ਲਿਖੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਸ਼ੁੱਧ ਵਾਕ ਦੀ ਪਛਾਣ ਕਰੋ (ਸੰਬੰਧਿਤ ਅਸ਼ੁੱਧ ਵਾਕ: “${s}”):`,
      (s: string) => `ਵਿਆਕਰਨਕ ਸ਼ੁੱਧਤਾ ਦੀ ਦ੍ਰਿਸ਼ਟੀ ਤੋਂ ਹੇਠਾਂ ਦਿੱਤੇ ਵਾਕਾਂ ਵਿੱਚੋਂ ਸਹੀ ਵਾਕ ਚੁਣੋ (ਅਸ਼ੁੱਧ ਵਾਕ: “${s}”):`,
      (s: string) => `ਪੰਜਾਬੀ ਵਾਕ-ਸੰਰਚਨਾ ਦੇ ਨੇਮਾਂ ਅਨੁਸਾਰ ਨਿਰਦੋਸ਼ ਵਾਕ ਦੀ ਸ਼ਨਾਖ਼ਤ ਕਰੋ (ਪ੍ਰਸੰਗ: “${s}”):`,
    ];
    const stem = rng.pickOne(templates)(item.incorrectSentence);
    return assembleCP013Question({
      familyId: "F03",
      seed,
      difficulty,
      stem,
      correctAnswer: item.correctSentence,
      distractors,
      explanation: `ਕੇਵਲ ਵਾਕ “${item.correctSentence}” ਹੀ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸ਼ੁੱਧ ਹੈ। ਬਾਕੀ ਵਾਕਾਂ ਵਿੱਚ ਵਿਆਕਰਨਕ ਦੋਸ਼ ਹਨ। ${item.explanationPa}`,
      authorityIds: [item.id, "PUN-SYNTAX-CORRECTION-SPOT"],
    });
  }

  if (modeVal > 0.35) {
    // Spot incorrect sentence
    const otherItems = CP013_CORRECTION_ITEMS.filter((other) => other.id !== item.id);
    const shuffledOthers = rng.shuffle([...otherItems]);
    const distractors = shuffledOthers.slice(0, 3).map((o) => o.correctSentence);

    const templates = [
      (s: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ “${s}” ਵਾਲੇ ਵਿਆਕਰਨਕ ਨੇਮਾਂ ਦੇ ਉਲਟ ‘ਅਸ਼ੁੱਧ ਵਾਕ’ ਦੀ ਪਛਾਣ ਕਰੋ:`,
      (s: string) => `ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਨਿਯਮਾਵਲੀ ਅਨੁਸਾਰ ਦਿੱਤੇ ਵਾਕਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਾਕ ਦੋਸ਼ਪੂਰਨ (ਅਸ਼ੁੱਧ) ਹੈ (ਸੰਦਰਭ: “${s}”)?`,
      (s: string) => `ਹੇਠ ਲਿਖੇ ਚਾਰ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਅਸ਼ੁੱਧ ਵਾਕ ਚੁਣੋ (ਅਧਿਐਨ ਪ੍ਰਸੰਗ: “${s}”):`,
      (s: string) => `ਵਿਆਕਰਨਕ ਦ੍ਰਿਸ਼ਟੀ ਤੋਂ ਹੇਠਾਂ ਦਿੱਤੇ ਵਾਕਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਾਕ ਅਸ਼ੁੱਧ ਹੈ (ਨਮੂਨਾ: “${s}”)?`,
      (s: string) => `ਕਿਹੜੇ ਵਾਕ ਵਿੱਚ ਵਿਆਕਰਨਕ ਨੇਮਾਂ ਦੀ ਉਲੰਘਣਾ ਹੋਈ ਹੈ (ਮੂਲ: “${s}”)?`,
    ];
    const stem = rng.pickOne(templates)(item.correctSentence);
    return assembleCP013Question({
      familyId: "F03",
      seed,
      difficulty,
      stem,
      correctAnswer: item.incorrectSentence,
      distractors,
      explanation: `ਵਾਕ “${item.incorrectSentence}” ਅਸ਼ੁੱਧ ਹੈ। ਅਸ਼ੁੱਧੀ: ${item.errorType}। ਸ਼ੁੱਧ ਰੂਪ: "${item.correctSentence}"।`,
      authorityIds: [item.id, "PUN-SYNTAX-CORRECTION-SPOT-ERR"],
    });
  }

  const templates = [
    (s: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣਕ ਨੇਮਾਂ ਅਨੁਸਾਰ ਅਸ਼ੁੱਧ ਵਾਕ “${s}” ਦਾ ਪੂਰਨ ਸ਼ੁੱਧ ਵਿਕਲਪ ਚੁਣੋ:`,
    (s: string) => `ਵਾਕ-ਸ਼ੁੱਧੀ ਦੇ ਵਿਸ਼ੇਸ਼ ਨਿਯਮਾਂ ਅਧੀਨ “${s}” ਦੀ ਸ਼ੁੱਧ ਤਰਤੀਬ ਕਿਹੜੀ ਹੈ?`,
    (s: string) => `ਉੱਚ-ਪੱਧਰੀ ਪੜਚੋਲ: ਅਸ਼ੁੱਧ ਵਾਕ “${s}” ਦਾ ਸੰਪੂਰਨ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
    (s: string) => `ਵਾਕ “${s}” ਵਿੱਚ ਵਿਆਕਰਨਕ ਨੇਮਾਂ ਦੀ ਅਣਦੇਖੀ ਕੀਤੀ ਗਈ ਹੈ। ਇਸ ਦਾ ਸਭ ਤੋਂ ਸ਼ੁੱਧ ਰੂਪ ਚੁਣੋ:`,
    (s: string) => `ਸੰਪੂਰਨ ਵਿਆਕਰਨਕ ਸ਼ੁੱਧੀ ਉਪਰੰਤ ਵਾਕ “${s}” ਦਾ ਸਟੀਕ ਰੂਪ ਕੀ ਬਣੇਗਾ?`,
  ];
  const stem = rng.pickOne(templates)(item.incorrectSentence);
  return assembleCP013Question({
    familyId: "F03",
    seed,
    difficulty,
    stem,
    correctAnswer: item.correctSentence,
    distractors: item.distractors,
    explanation: `ਅਸ਼ੁੱਧੀ ਦੀ ਕਿਸਮ: ${item.errorType}। ${item.explanationPa} ਸ਼ੁੱਧ ਰੂਪ: "${item.correctSentence}"`,
    authorityIds: [item.id, "PUN-SYNTAX-CORRECTION-HARD"],
  });
}
