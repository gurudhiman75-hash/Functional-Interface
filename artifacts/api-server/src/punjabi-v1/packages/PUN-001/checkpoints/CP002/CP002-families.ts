/**
 * CP002 Question Families:
 * CP002-F01: Direct Orthographic Choice (ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਚੋਣ)
 * CP002-F02: In-Sentence Error Identification (ਵਾਕ ਵਿੱਚ ਅਸ਼ੁੱਧ ਸ਼ਬਦ ਦੀ ਪਛਾਣ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import { CP002_SPELLING_ITEMS, type SpellingItem } from "./CP002-authorities";

function assembleCP002Question(input: {
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
      `Insufficient distinct distractors for CP002 ${input.familyId}. Got ${filteredDistractors.length}`
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
    id: `PUN-001-CP002-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP002",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP002-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

// -------------------------------------------------------------------------
const CP002_F01_SHUDH_TEMPLATES = [
  (spoken: string) => `ਬੋਲਚਾਲ ਵਿੱਚ ਅਕਸਰ ਬੋਲੇ ਜਾਂਦੇ ਸ਼ਬਦ ‘${spoken}’ ਦਾ ਟਕਸਾਲੀ ਅਤੇ ਮਿਆਰੀ ਸ਼ਬਦ-ਜੋੜ ਕਿਹੜਾ ਹੈ?`,
  (spoken: string) => `‘${spoken}’ ਧੁਨੀ-ਰੂਪ ਲਈ ਪੰਜਾਬੀ ਵਿਆਕਰਨ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਚੁਣੋ:`,
  (spoken: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${spoken}’ ਦੇ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ਦੀ ਪਛਾਣ ਕਰੋ:`,
  (spoken: string) => `ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਅਨੁਸਾਰ ‘${spoken}’ ਲਈ ਸਹੀ ਅਤੇ ਪ੍ਰਮਾਣਿਤ ਸ਼ਬਦ-ਜੋੜ ਕਿਹੜਾ ਹੈ?`,
  (spoken: string) => `ਦਿੱਤੇ ਗਏ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${spoken}’ ਦਾ ਵਿਆਕਰਨਕ ਤੌਰ 'ਤੇ ਸ਼ੁੱਧ ਰੂਪ ਦੱਸੋ:`,
];

const CP002_F01_ASHUDH_TEMPLATES = [
  (w1: string, w2: string) => `‘${w1}’ ਅਤੇ ‘${w2}’ ਵਰਗੇ ਸ਼ਬਦਾਂ ਦੇ ਸ਼ੁੱਧ-ਅਸ਼ੁੱਧ ਜੋੜਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦਿਆਂ ਅਸ਼ੁੱਧ ਵਿਕਲਪ ਚੁਣੋ:`,
  (w1: string, w2: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਚਾਰ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ-ਜੋੜ ਟਕਸਾਲੀ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਅਸ਼ੁੱਧ (ਗ਼ਲਤ) ਹੈ? (ਸੰਦਰਭ: ‘${w1}’, ‘${w2}’):`,
  (w1: string, w2: string) => `ਟਕਸਾਲੀ ਸ਼ਬਦ-ਜੋੜ ਨੇਮਾਂ ਅਨੁਸਾਰ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਅਸ਼ੁੱਧ ਸ਼ਬਦ ਦੀ ਸ਼ਨਾਖ਼ਤ ਕਰੋ (ਸ਼ੁੱਧ ਸੰਦਰਭ: ‘${w1}’):`,
  (w1: string, w2: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ਅਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਵਾਲਾ ਵਿਕਲਪ ਲੱਭੋ (ਸ਼ੁੱਧ ਉਦਾਹਰਨ: ‘${w1}’):`,
];

const CP002_F02_STEM_TEMPLATES = [
  (s: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ਕਿਹੜਾ ਸ਼ਬਦ ਅਸ਼ੁੱਧ ਲਿਖਿਆ ਗਿਆ ਹੈ?\n\n“${s}”`,
  (s: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਵਿੱਚ ਸ਼ਬਦ-ਜੋੜਾਂ ਪੱਖੋਂ ਅਸ਼ੁੱਧ ਸ਼ਬਦ ਦੀ ਸ਼ਨਾਖ਼ਤ ਕਰੋ:\n\n“${s}”`,
  (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚ ਅਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ:\n\n“${s}”`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Direct Orthographic Choice (ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਚੋਣ)
// -------------------------------------------------------------------------
export function generateCP002F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const item = rng.pickOne(CP002_SPELLING_ITEMS);

  if (difficulty === "Easy" || difficulty === "Medium") {
    // Select the CORRECT spelling among 1 correct + 3 incorrect variations
    const distractors = item.incorrectVariations;
    const spoken = rng.pickOne(item.incorrectVariations);
    const easyTemplates = [
      (spoken: string) => `ਬੋਲਚਾਲ ਵਿੱਚ ਅਕਸਰ ਬੋਲੇ ਜਾਂਦੇ ਸ਼ਬਦ ‘${spoken}’ ਦਾ ਟਕਸਾਲੀ ਅਤੇ ਮਿਆਰੀ ਸ਼ਬਦ-ਜੋੜ ਕਿਹੜਾ ਹੈ?`,
      (spoken: string) => `‘${spoken}’ ਧੁਨੀ-ਰੂਪ ਲਈ ਪੰਜਾਬੀ ਵਿਆਕਰਨ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਚੁਣੋ:`,
    ];
    const medTemplates = [
      (spoken: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${spoken}’ ਦੇ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ਦੀ ਪਛਾਣ ਕਰੋ:`,
      (spoken: string) => `ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਅਨੁਸਾਰ ‘${spoken}’ ਲਈ ਸਹੀ ਅਤੇ ਪ੍ਰਮਾਣਿਤ ਸ਼ਬਦ-ਜੋੜ ਕਿਹੜਾ ਹੈ?`,
      (spoken: string) => `ਦਿੱਤੇ ਗਏ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${spoken}’ ਦਾ ਵਿਆਕਰਨਕ ਤੌਰ 'ਤੇ ਸ਼ੁੱਧ ਰੂਪ ਦੱਸੋ:`,
    ];
    const templates = difficulty === "Easy" ? easyTemplates : medTemplates;
    const stem = rng.pickOne(templates)(spoken);

    return assembleCP002Question({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: item.correct,
      distractors,
      explanation: `${item.explanationPa} ਬਾਕੀ ਵਿਕਲਪ ਅਸ਼ੁੱਧ ਹਨ।`,
      authorityIds: [item.id],
    });
  }

  // Hard Difficulty: Select the INCORRECT (ਅਸ਼ੁੱਧ) spelling among 3 correct words + 1 incorrect word
  const incorrectWord = rng.pickOne(item.incorrectVariations);
  // Pick 3 OTHER words in their CORRECT form
  const otherItems = CP002_SPELLING_ITEMS.filter((i) => i.id !== item.id);
  const selectedOthers = rng.pickDistinct(otherItems, 3);
  const correctWords = selectedOthers.map((i) => i.correct);
  const stem = rng.pickOne(CP002_F01_ASHUDH_TEMPLATES)(correctWords[0]!, correctWords[1]!);

  return assembleCP002Question({
    familyId: "F01",
    seed,
    difficulty,
    stem,
    correctAnswer: incorrectWord,
    distractors: correctWords,
    explanation: `‘${incorrectWord}’ ਅਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ। ਇਸ ਦਾ ਸ਼ੁੱਧ ਰੂਪ ‘${item.correct}’ ਹੈ। (${item.explanationPa}) ਬਾਕੀ ਤਿੰਨੋਂ ਵਿਕਲਪ [${correctWords.join(", ")}] ਬਿਲਕੁਲ ਸ਼ੁੱਧ ਹਨ।`,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: In-Sentence Error Identification (ਵਾਕ ਵਿੱਚ ਅਸ਼ੁੱਧ ਸ਼ਬਦ ਦੀ ਪਛਾਣ)
// -------------------------------------------------------------------------
interface SentenceContext {
  template: (word: string) => string;
}

const SENTENCE_TEMPLATES: Record<string, SentenceContext> = {
  "ਸ਼ਹਿਰ": { template: (w) => `ਅਸੀਂ ਕੱਲ੍ਹ ਆਪਣੇ ਦੋਸਤਾਂ ਨਾਲ ਵੱਡੇ ${w} ਘੁੰਮਣ ਗਏ ਸਾਂ।` },
  "ਨਹਿਰ": { template: (w) => `ਪਿੰਡ ਦੇ ਬਾਹਰਵਾਰ ਪਾਣੀ ਦੀ ਇੱਕ ਵੱਡੀ ${w} ਵਗਦੀ ਹੈ।` },
  "ਸੂਰਜ": { template: (w) => `ਸਵੇਰ ਵੇਲੇ ਪੂਰਬ ਦਿਸ਼ਾ ਵਿੱਚੋਂ ${w} ਚੜ੍ਹਦਾ ਹੈ।` },
  "ਕਿਰਪਾ": { template: (w) => `ਸਭ ਉੱਤੇ ਪ੍ਰਮਾਤਮਾ ਦੀ ਮਿਹਰ ਅਤੇ ${w} ਬਣੀ ਰਹੇ।` },
  "ਕਾਨੂੰਨ": { template: (w) => `ਦੇਸ਼ ਦੇ ਹਰੇਕ ਨਾਗਰਿਕ ਨੂੰ ਸੰਵਿਧਾਨਕ ${w} ਦੀ ਪਾਲਣਾ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।` },
  "ਪੜ੍ਹਨਾ": { template: (w) => `ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਰੋਜ਼ਾਨਾ ਮਨ ਲਗਾ ਕੇ ${w} ਚਾਹੀਦਾ ਹੈ।` },
  "ਜ਼ਰੂਰ": { template: (w) => `ਤੁਸੀਂ ਕੱਲ੍ਹ ਦੀ ਜ਼ਰੂਰੀ ਸਭਾ ਵਿੱਚ ${w} ਸ਼ਾਮਲ ਹੋਣਾ।` },
  "ਸਕੂਲ": { template: (w) => `ਬੱਚੇ ਸਮੇਂ ਸਿਰ ਆਪਣੇ ${w} ਪਹੁੰਚ ਗਏ।` },
  "ਵਿਹੜਾ": { template: (w) => `ਸਾਡੇ ਪੁਰਾਣੇ ਘਰ ਦਾ ${w} ਬਹੁਤ ਖੁੱਲ੍ਹਾ ਅਤੇ ਹਵਾਦਾਰ ਸੀ।` },
  "ਦੁਪਹਿਰ": { template: (w) => `ਗਰਮੀਆਂ ਦੀ ਤਿੱਖੀ ${w} ਵੇਲੇ ਸੜਕਾਂ 'ਤੇ ਸੰਨਾਟਾ ਛਾ ਜਾਂਦਾ ਹੈ।` },
  "ਤਿਉਹਾਰ": { template: (w) => `ਦੀਵਾਲੀ ਪੰਜਾਬੀਆਂ ਦਾ ਸਭ ਤੋਂ ਹਰਮਨ-ਪਿਆਰਾ ${w} ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।` },
  "ਇਸ਼ਨਾਨ": { template: (w) => `ਸ਼ਰਧਾਲੂਆਂ ਨੇ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਪਵਿੱਤਰ ਸਰੋਵਰ ਵਿੱਚ ${w} ਕੀਤਾ।` },
  "ਸੰਸਾਰ": { template: (w) => `ਇਸ ਪੂਰੇ ${w} ਵਿੱਚ ਸੱਚ ਦੀ ਹਮੇਸ਼ਾ ਜਿੱਤ ਹੁੰਦੀ ਹੈ।` },
  "ਪ੍ਰੀਖਿਆ": { template: (w) => `ਸਾਰੇ ਮਿਹਨਤੀ ਵਿਦਿਆਰਥੀ ਸਾਲਾਨਾ ${w} ਦੀ ਡਟ ਕੇ ਤਿਆਰੀ ਕਰ ਰਹੇ ਹਨ।` },
  "ਵਿਦਿਆਰਥੀ": { template: (w) => `ਇੱਕ ਆਦਰਸ਼ ${w} ਆਪਣੇ ਸਮੇਂ ਦੀ ਸਹੀ ਕਦਰ ਕਰਦਾ ਹੈ।` },
  "ਮਹੱਤਵ": { template: (w) => `ਜੀਵਨ ਵਿੱਚ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਦਾ ਬਹੁਤ ਵੱਡਾ ${w} ਹੁੰਦਾ ਹੈ।` },
  "ਪ੍ਰਸਿੱਧ": { template: (w) => `ਉਹ ਪੰਜਾਬੀ ਸਾਹਿਤ ਦੇ ਇੱਕ ਬਹੁਤ ${w} ਲੇਖਕ ਅਤੇ ਚਿੰਤਕ ਹਨ।` },
  "ਸੰਵਿਧਾਨ": { template: (w) => `ਡਾ. ਭੀਮ ਰਾਓ ਅੰਬੇਡਕਰ ਨੂੰ ਭਾਰਤੀ ${w} ਦਾ ਨਿਰਮਾਤਾ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।` },
  "ਵਿਸ਼ਵਾਸ": { template: (w) => `ਸੱਚੇ ਮਿੱਤਰਾਂ ਉੱਤੇ ਹਮੇਸ਼ਾ ਅਟੁੱਟ ${w} ਬਣਿਆ ਰਹਿੰਦਾ ਹੈ।` },
  "ਜਿਊਣਾ": { template: (w) => `ਸਵੈ-ਮਾਣ ਨਾਲ ${w} ਹੀ ਅਸਲ ਜ਼ਿੰਦਗੀ ਦਾ ਮਨੋਰਥ ਹੈ।` },
  "ਮਿਹਨਤ": { template: (w) => `ਲਗਨ ਅਤੇ ਸਖ਼ਤ ${w} ਨਾਲ ਹੀ ਜ਼ਿੰਦਗੀ ਵਿੱਚ ਵੱਡੀ ਸਫ਼ਲਤਾ ਮਿਲਦੀ ਹੈ।` },
  "ਲਹਿਰ": { template: (w) => `ਸਮੁੰਦਰ ਵਿੱਚੋਂ ਪਾਣੀ ਦੀ ਇੱਕ ਬਹੁਤ ਉੱਚੀ ${w} ਉੱਠੀ।` },
  "ਪਹਿਰਾਵਾ": { template: (w) => `ਪੰਜਾਬੀਆਂ ਦਾ ਰਵਾਇਤੀ ${w} ਕੁੜਤਾ-ਚਾਦਰ ਅਤੇ ਪੱਗ ਹੈ।` },
  "ਸੁਨਹਿਰੀ": { template: (w) => `ਕਣਕ ਦੇ ਪੱਕੇ ਖੇਤ ਧੁੱਪ ਵਿੱਚ ${w} ਰੰਗ ਵਾਂਗ ਚਮਕ ਰਹੇ ਹਨ।` },
  "ਪਹੁੰਚਣਾ": { template: (w) => `ਮੁਸਾਫ਼ਰਾਂ ਨੂੰ ਸਮੇਂ ਸਿਰ ਰੇਲਵੇ ਸਟੇਸ਼ਨ 'ਤੇ ${w} ਚਾਹੀਦਾ ਹੈ।` },
  "ਸੰਦੂਕ": { template: (w) => `ਦਾਦੀ ਜੀ ਨੇ ਪੁਰਾਣਾ ਕੀਮਤੀ ਸਾਮਾਨ ਲੱਕੜ ਦੇ ਵੱਡੇ ${w} ਵਿੱਚ ਸਾਂਭ ਕੇ ਰੱਖਿਆ।` },
  "ਬੰਦੂਕ": { template: (w) => `ਸੁਰੱਖਿਆ ਗਾਰਡ ਨੇ ਆਪਣੇ ਮੋਢੇ 'ਤੇ ਲੰਮੀ ${w} ਟੰਗੀ ਹੋਈ ਸੀ।` },
  "ਮੂਰਖ": { template: (w) => `ਸਿਆਣੇ ਕਹਿੰਦੇ ਹਨ ਕਿ ਕਿਸੇ ${w} ਨਾਲ ਬਹਿਸ ਨਹੀਂ ਕਰਨੀ ਚਾਹੀਦੀ।` },
  "ਦੂਰ": { template: (w) => `ਪਹਾੜੀ ਇਲਾਕੇ ਦਾ ਪਿੰਡ ਸ਼ਹਿਰ ਤੋਂ ਬਹੁਤ ${w} ਸਥਿਤ ਹੈ।` },
  "ਸੂਰਮਾ": { template: (w) => `ਮੈਦਾਨ-ਏ-ਜੰਗ ਵਿੱਚ ਆਪਣੀ ਜਾਨ ਵਾਰਨ ਵਾਲਾ ਯੋਧਾ ਹੀ ਅਸਲ ${w} ਅਖਵਾਉਂਦਾ ਹੈ।` },
  "ਬੁੱਧੀਮਾਨ": { template: (w) => `ਇੱਕ ${w} ਵਿਅਕਤੀ ਹਮੇਸ਼ਾ ਸੋਚ-ਸਮਝ ਕੇ ਸਹੀ ਨਿਰਣਾ ਲੈਂਦਾ ਹੈ।` },
  "ਮਿੱਤਰਤਾ": { template: (w) => `ਸੱਚੀ ਅਤੇ ਨਿਰਸਵਾਰਥ ${w} ਦੁਨੀਆ ਦੀ ਸਭ ਤੋਂ ਵੱਡੀ ਦੌਲਤ ਹੈ।` },
  "ਉੱਤਰ": { template: (w) => `ਵਿਦਿਆਰਥੀ ਨੇ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਹਰੇਕ ਸਵਾਲ ਦਾ ਸਹੀ ${w} ਲਿਖਿਆ।` },
  "ਜ਼ਿੰਮੇਵਾਰੀ": { template: (w) => `ਹਰੇਕ ਨਾਗਰਿਕ ਨੂੰ ਆਪਣੇ ਪਰਿਵਾਰ ਅਤੇ ਦੇਸ਼ ਪ੍ਰਤੀ ਆਪਣੀ ${w} ਨਿਭਾਉਣੀ ਚਾਹੀਦੀ ਹੈ।` },
  "ਫ਼ੈਸਲਾ": { template: (w) => `ਜੱਜ ਸਾਹਿਬ ਨੇ ਦੋਵਾਂ ਧਿਰਾਂ ਦੀਆਂ ਦਲੀਲਾਂ ਸੁਣ ਕੇ ਆਪਣਾ ਅੰਤਿਮ ${w} ਸੁਣਾਇਆ।` },
  "ਖ਼ਬਰ": { template: (w) => `ਸਵੇਰ ਦੀ ਤਾਜ਼ਾ ${w} ਸੁਣ ਕੇ ਸਾਰੇ ਲੋਕ ਹੈਰਾਨ ਰਹਿ ਗਏ।` },
  "ਕਾਗ਼ਜ਼": { template: (w) => `ਸਰਕਾਰੀ ਦਫ਼ਤਰ ਵਿੱਚ ਸਾਰੇ ਜ਼ਰੂਰੀ ${w} ਜਮ੍ਹਾਂ ਕਰਵਾਉਣੇ ਪੈਣਗੇ।` },
  "ਨਤੀਜਾ": { template: (w) => `ਸਾਲਾਨਾ ਇਮਤਿਹਾਨ ਦਾ ਸ਼ਾਨਦਾਰ ${w} ਵੇਖ ਕੇ ਮਾਪੇ ਬਹੁਤ ਖ਼ੁਸ਼ ਹੋਏ।` },
  "ਤਬਦੀਲੀ": { template: (w) => `ਸਮੇਂ ਦੇ ਨਾਲ ਸਮਾਜ ਵਿੱਚ ਸਕਾਰਾਤਮਕ ${w} ਆਉਣੀ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ।` },
  "ਵਜ਼ੀਰ": { template: (w) => `ਰਾਜੇ ਦੇ ਦਰਬਾਰ ਵਿੱਚ ਮੁੱਖ ${w} ਨੇ ਸਿਆਣਪ ਭਰੀ ਸਲਾਹ ਦਿੱਤੀ।` },
  "ਸੁਤੰਤਰਤਾ": { template: (w) => `ਦੇਸ਼ ਦੀ ${w} ਲਈ ਅਣਗਿਣਤ ਦੇਸ਼-ਭਗਤਾਂ ਨੇ ਕੁਰਬਾਨੀਆਂ ਦਿੱਤੀਆਂ।` },
  "ਸੱਭਿਆਚਾਰ": { template: (w) => `ਪੰਜਾਬ ਦਾ ਅਮੀਰ ${w} ਸਾਰੀ ਦੁਨੀਆ ਵਿੱਚ ਮਸ਼ਹੂਰ ਹੈ।` },
  "ਇਤਿਹਾਸ": { template: (w) => `ਸਾਨੂੰ ਆਪਣੇ ਪੁਰਖਿਆਂ ਦੇ ਗੌਰਵਮਈ ${w} ਤੋਂ ਪ੍ਰੇਰਨਾ ਲੈਣੀ ਚਾਹੀਦੀ ਹੈ।` },
};

export function generateCP002F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const spellingItem = rng.pickOne(CP002_SPELLING_ITEMS);
  const incorrectWord = rng.pickOne(spellingItem.incorrectVariations);

  let sentenceWithErr: string;
  if (SENTENCE_TEMPLATES[spellingItem.correct]) {
    sentenceWithErr = SENTENCE_TEMPLATES[spellingItem.correct]!.template(incorrectWord);
  } else {
    const genericTemplates = [
      (w: string) => `ਸਰਕਾਰੀ ਦਸਤਾਵੇਜ਼ ਅਤੇ ਅਧਿਕਾਰਤ ਲਿਖਤ ਵਿੱਚ ${w} ਸ਼ਬਦ ਦੀ ਵਰਤੋਂ ਬਹੁਤ ਸੋਚ-ਸਮਝ ਕੇ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`,
      (w: string) => `ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਸਮਝਾਇਆ ਕਿ ਪੰਜਾਬੀ ਵਾਕ ਵਿੱਚ ${w} ਨੂੰ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਲਿਖਣਾ ਚਾਹੀਦਾ ਹੈ।`,
      (w: string) => `ਅੱਜ ਦੀ ਸਵੇਰ ਦੀ ਅਖ਼ਬਾਰ ਵਿੱਚ ${w} ਬਾਰੇ ਇੱਕ ਬਹੁਤ ਹੀ ਮਹੱਤਵਪੂਰਨ ਲੇਖ ਛਪਿਆ ਹੋਇਆ ਹੈ।`,
      (w: string) => `ਸਮਾਜਿਕ ਅਤੇ ਸੱਭਿਆਚਾਰਕ ਸਮਾਗਮ ਦੌਰਾਨ ਮੁੱਖ ਬੁਲਾਰੇ ਨੇ ${w} ਵਿਸ਼ੇ ਉੱਤੇ ਵਿਸਥਾਰ ਨਾਲ ਚਰਚਾ ਕੀਤੀ।`,
    ];
    sentenceWithErr = rng.pickOne(genericTemplates)(incorrectWord);
  }

  // Distractors are other words from the same sentence
  const rawWordsInSentence = sentenceWithErr
    .replace(/[।.,!?]/g, "")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w !== incorrectWord && w.length >= 2);

  const uniqueSentenceWords = Array.from(new Set(rawWordsInSentence));
  const distinctDistractorWords = rng.pickDistinct(uniqueSentenceWords, 3);
  const stemTemplate = rng.pickOne(CP002_F02_STEM_TEMPLATES);

  return assembleCP002Question({
    familyId: "F02",
    seed,
    difficulty,
    stem: stemTemplate(sentenceWithErr),
    correctAnswer: incorrectWord,
    distractors: distinctDistractorWords,
    explanation: `ਵਾਕ ਵਿੱਚ ਵਰਤਿਆ ਗਿਆ ਸ਼ਬਦ ‘${incorrectWord}’ ਅਸ਼ੁੱਧ ਹੈ। ਇਸ ਦਾ ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘${spellingItem.correct}’ ਹੈ। (${spellingItem.explanationPa})`,
    authorityIds: [spellingItem.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 3: Contextual Blank Fill (ਵਾਕ-ਪ੍ਰਸੰਗ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਭਰਨਾ)
// -------------------------------------------------------------------------
const CP002_F03_STEM_TEMPLATES = [
  (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਭਰਨ ਲਈ ਵਿਆਕਰਨਕ ਪੱਖੋਂ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਚੁਣੋ:\n\n“${s}”`,
  (s: string) => `ਵਾਕ ਦੇ ਪ੍ਰਸੰਗ ਅਨੁਸਾਰ ਢੁਕਵਾਂ ਅਤੇ ਟਕਸਾਲੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ਚੁਣ ਕੇ ਖ਼ਾਲੀ ਥਾਂ ਪੂਰੀ ਕਰੋ:\n\n“${s}”`,
  (s: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਦੀ ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ਵਾਲੇ ਵਿਕਲਪ ਦੀ ਪਛਾਣ ਕਰੋ:\n\n“${s}”`,
];

export function generateCP002F03(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const spellingItem = rng.pickOne(CP002_SPELLING_ITEMS);

  let sentenceWithBlank: string;
  if (SENTENCE_TEMPLATES[spellingItem.correct]) {
    sentenceWithBlank = SENTENCE_TEMPLATES[spellingItem.correct]!.template("_____");
  } else {
    const genericTemplates = [
      (w: string) => `ਸਰਕਾਰੀ ਦਸਤਾਵੇਜ਼ ਅਤੇ ਅਧਿਕਾਰਤ ਲਿਖਤ ਵਿੱਚ ${w} ਸ਼ਬਦ ਦੀ ਵਰਤੋਂ ਬਹੁਤ ਸੋਚ-ਸਮਝ ਕੇ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`,
      (w: string) => `ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਸਮਝਾਇਆ ਕਿ ਪੰਜਾਬੀ ਵਾਕ ਵਿੱਚ ${w} ਨੂੰ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਲਿਖਣਾ ਚਾਹੀਦਾ ਹੈ।`,
      (w: string) => `ਅੱਜ ਦੀ ਸਵੇਰ ਦੀ ਅਖ਼ਬਾਰ ਵਿੱਚ ${w} ਬਾਰੇ ਇੱਕ ਬਹੁਤ ਹੀ ਮਹੱਤਵਪੂਰਨ ਲੇਖ ਛਪਿਆ ਹੋਇਆ ਹੈ।`,
    ];
    sentenceWithBlank = rng.pickOne(genericTemplates)("_____");
  }

  const easyF03 = [
    (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਭਰਨ ਲਈ ਵਿਆਕਰਨਕ ਪੱਖੋਂ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਚੁਣੋ:\n\n“${s}”`,
  ];
  const medF03 = [
    (s: string) => `ਵਾਕ ਦੇ ਪ੍ਰਸੰਗ ਅਨੁਸਾਰ ਢੁਕਵਾਂ ਅਤੇ ਟਕਸਾਲੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ਚੁਣ ਕੇ ਖ਼ਾਲੀ ਥਾਂ ਪੂਰੀ ਕਰੋ:\n\n“${s}”`,
  ];
  const hardF03 = [
    (s: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਦੀ ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ਵਾਲੇ ਵਿਕਲਪ ਦੀ ਪਛਾਣ ਕਰੋ:\n\n“${s}”`,
  ];
  const templatesF03 = difficulty === "Easy" ? easyF03 : difficulty === "Hard" ? hardF03 : medF03;
  const stem = rng.pickOne(templatesF03)(sentenceWithBlank);

  return assembleCP002Question({
    familyId: "F03",
    seed,
    difficulty,
    stem,
    correctAnswer: spellingItem.correct,
    distractors: spellingItem.incorrectVariations,
    explanation: `ਵਾਕ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘${spellingItem.correct}’ ਹੈ। (${spellingItem.explanationPa}) ਬਾਕੀ ਵਿਕਲਪ ਅਸ਼ੁੱਧ ਹਨ।`,
    authorityIds: [spellingItem.id],
  });
}

