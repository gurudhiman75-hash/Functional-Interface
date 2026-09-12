import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "./validator";
import {
  CARRIER_RULES,
  GURMUKHI_VARGS,
  LAGAKHAR_RULES,
  type CarrierRule,
  type LagakharRule,
  type VargAuthority,
} from "./CP001-authorities";

function assembleQuestion(input: {
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
      `Insufficient distinct distractors for family ${input.familyId}. Got ${filteredDistractors.length}`
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
    id: `PUN-001-CP001-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP001",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

export const GURMUKHI_35 = [
  "ੳ", "ਅ", "ੲ", "ਸ", "ਹ",
  "ਕ", "ਖ", "ਗ", "ਘ", "ਙ",
  "ਚ", "ਛ", "ਜ", "ਝ", "ਞ",
  "ਟ", "ਠ", "ਡ", "ਢ", "ਣ",
  "ਤ", "ਥ", "ਦ", "ਧ", "ਨ",
  "ਪ", "ਫ", "ਬ", "ਭ", "ਮ",
  "ਯ", "ਰ", "ਲ", "ਵ", "ੜ",
];

export const VARG_MAP: Record<string, { varg: string; place: string }> = {
  "ਕ": { varg: "ਕ-ਵਰਗ", place: "ਕੰਠੀ (ਕੰਠ/ਗਲਾ)" },
  "ਖ": { varg: "ਕ-ਵਰਗ", place: "ਕੰਠੀ (ਕੰਠ/ਗਲਾ)" },
  "ਗ": { varg: "ਕ-ਵਰਗ", place: "ਕੰਠੀ (ਕੰਠ/ਗਲਾ)" },
  "ਘ": { varg: "ਕ-ਵਰਗ", place: "ਕੰਠੀ (ਕੰਠ/ਗਲਾ)" },
  "ਙ": { varg: "ਕ-ਵਰਗ", place: "ਕੰਠੀ (ਕੰਠ/ਗਲਾ)" },
  "ਚ": { varg: "ਚ-ਵਰਗ", place: "ਤਾਲਵੀ (ਤਾਲੂ)" },
  "ਛ": { varg: "ਚ-ਵਰਗ", place: "ਤਾਲਵੀ (ਤਾਲੂ)" },
  "ਜ": { varg: "ਚ-ਵਰਗ", place: "ਤਾਲਵੀ (ਤਾਲੂ)" },
  "ਝ": { varg: "ਚ-ਵਰਗ", place: "ਤਾਲਵੀ (ਤਾਲੂ)" },
  "ਞ": { varg: "ਚ-ਵਰਗ", place: "ਤਾਲਵੀ (ਤਾਲੂ)" },
  "ਟ": { varg: "ਟ-ਵਰਗ", place: "ਮੂਰਧਨੀ / ਉਲਟ-ਜੀਭੀ" },
  "ਠ": { varg: "ਟ-ਵਰਗ", place: "ਮੂਰਧਨੀ / ਉਲਟ-ਜੀਭੀ" },
  "ਡ": { varg: "ਟ-ਵਰਗ", place: "ਮੂਰਧਨੀ / ਉਲਟ-ਜੀਭੀ" },
  "ਢ": { varg: "ਟ-ਵਰਗ", place: "ਮੂਰਧਨੀ / ਉਲਟ-ਜੀਭੀ" },
  "ਣ": { varg: "ਟ-ਵਰਗ", place: "ਮੂਰਧਨੀ / ਉਲਟ-ਜੀਭੀ" },
  "ਤ": { varg: "ਤ-ਵਰਗ", place: "ਦੰਤੀ (ਦੰਦ)" },
  "ਥ": { varg: "ਤ-ਵਰਗ", place: "ਦੰਤੀ (ਦੰਦ)" },
  "ਦ": { varg: "ਤ-ਵਰਗ", place: "ਦੰਤੀ (ਦੰਦ)" },
  "ਧ": { varg: "ਤ-ਵਰਗ", place: "ਦੰਤੀ (ਦੰਦ)" },
  "ਨ": { varg: "ਤ-ਵਰਗ", place: "ਦੰਤੀ (ਦੰਦ)" },
  "ਪ": { varg: "ਪ-ਵਰਗ", place: "ਹੋਠੀ (ਬੁੱਲ੍ਹ)" },
  "ਫ": { varg: "ਪ-ਵਰਗ", place: "ਹੋਠੀ (ਬੁੱਲ੍ਹ)" },
  "ਬ": { varg: "ਪ-ਵਰਗ", place: "ਹੋਠੀ (ਬੁੱਲ੍ਹ)" },
  "ਭ": { varg: "ਪ-ਵਰਗ", place: "ਹੋਠੀ (ਬੁੱਲ੍ਹ)" },
  "ਮ": { varg: "ਪ-ਵਰਗ", place: "ਹੋਠੀ (ਬੁੱਲ੍ਹ)" },
};

export const LAGA_TO_CARRIER: Record<string, string> = {
  "ਮੁਕਤਾ": "ਅ",
  "ਕੰਨਾ": "ਅ",
  "ਦੁਲਾਵਾਂ": "ਅ",
  "ਕਨੌੜਾ": "ਅ",
  "ਸਿਹਾਰੀ": "ੲ",
  "ਬਿਹਾਰੀ": "ੲ",
  "ਲਾਂ": "ੲ",
  "ਔਂਕੜ": "ੳ",
  "ਦੁਲੈਂਕੜ": "ੳ",
  "ਹੋੜਾ": "ੳ",
};

// -----------------------------------------------------------------------------
// F01: Alphabetics, Vargs, Order, Dutt & Anunasak
// -----------------------------------------------------------------------------

const CP001_F01_EASY_AFTER = [
  (target: string) => `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਅਨੁਸਾਰ ਅੱਖਰ ‘${target}’ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਕਿਹੜਾ ਅੱਖਰ ਆਉਂਦਾ ਹੈ?`,
  (target: string) => `ਵਰਣਮਾਲਾ ਦੀ ਤਰਤੀਬ ਮੁਤਾਬਕ ਅੱਖਰ ‘${target}’ ਤੋਂ ਅਗਲਾ ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`,
  (target: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${target}’ ਤੋਂ ਠੀਕ ਬਾਅਦ ਆਉਣ ਵਾਲਾ ਅੱਖਰ ਚੁਣੋ:`,
];

const CP001_F01_EASY_BEFORE = [
  (target: string) => `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਅੱਖਰ ‘${target}’ ਤੋਂ ਤੁਰੰਤ ਪਹਿਲਾਂ ਕਿਹੜਾ ਅੱਖਰ ਆਉਂਦਾ ਹੈ?`,
  (target: string) => `ਵਰਣਮਾਲਾ ਕ੍ਰਮ ਅਨੁਸਾਰ ‘${target}’ ਤੋਂ ਪਿਛਲਾ (ਪਹਿਲਾ) ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`,
  (target: string) => `‘${target}’ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਆਉਣ ਵਾਲਾ ਗੁਰਮੁਖੀ ਅੱਖਰ ਦੱਸੋ:`,
];

const CP001_F01_EASY_VARG = [
  (letter: string) => `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਅੱਖਰ ‘${letter}’ ਕਿਸ ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
  (letter: string) => `ਅੱਖਰ ‘${letter}’ ਦਾ ਸੰਬੰਧ ਕਿਸ ਮੁੱਖ ਵਰਗ ਨਾਲ ਹੈ?`,
  (letter: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${letter}’ ਕਿਸ ਵਰਗ ਦਾ ਅੰਗ ਹੈ?`,
];

const CP001_F01_MED_PLACE = [
  (letter: string) => `ਧੁਨੀ ਵਿਗਿਆਨ ਅਨੁਸਾਰ ਅੱਖਰ ‘${letter}’ ਦਾ ਉਚਾਰਨ ਸਥਾਨ ਕਿਹੜਾ ਹੈ?`,
  (letter: string) => `ਅੱਖਰ ‘${letter}’ ਦੇ ਉਚਾਰਨ ਵੇਲੇ ਮੁੱਖ ਉਚਾਰਨ ਅੰਗ ਕਿਹੜਾ ਹੁੰਦਾ ਹੈ?`,
  (letter: string) => `ਵਿਆਕਰਨ ਅਨੁਸਾਰ ‘${letter}’ ਕਿਸ ਪ੍ਰਕਾਰ ਦੀ ਧੁਨੀ (ਉਚਾਰਨ ਅੰਗ ਪੱਖੋਂ) ਹੈ?`,
];

const CP001_F01_MED_VARG_MEMBER = [
  (varg: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅੱਖਰ ‘${varg}’ ਦਾ ਮੈਂਬਰ ਹੈ?`,
  (varg: string) => `‘${varg}’ ਨਾਲ ਸੰਬੰਧਿਤ ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`,
  (varg: string) => `ਵਰਣਮਾਲਾ ਦੀ ਸ਼੍ਰੇਣੀ ਵੰਡ ਅਨੁਸਾਰ ‘${varg}’ ਵਿੱਚ ਕਿਹੜਾ ਅੱਖਰ ਆਉਂਦਾ ਹੈ?`,
];

const CP001_F01_MED_ANUNASAK = [
  "ਹੇਠ ਲਿਖੇ ਅੱਖਰਾਂ ਵਿੱਚੋਂ ‘ਅਨੁਨਾਸਕ’ (ਨਾਸਕੀ) ਅੱਖਰ ਕਿਹੜਾ ਹੈ?",
  "ਦਿੱਤੇ ਗਏ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਨਾਸਕੀ ਧੁਨੀ ਵਾਲਾ ਅੱਖਰ ਚੁਣੋ:",
  "ਗੁਰਮੁਖੀ ਦੇ ਪੰਜ ਨਾਸਕੀ ਵਿਅੰਜਨਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅੱਖਰ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ?",
];

const CP001_F01_MED_DUTT = [
  "ਹੇਠ ਲਿਖੇ ਅੱਖਰਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ‘ਦੁੱਤ ਅੱਖਰ’ (ਪੈਰੀਂ ਪੈਣ ਵਾਲਾ ਅੱਖਰ) ਹੈ?",
  "ਦਿੱਤੇ ਗਏ ਅੱਖਰਾਂ ਵਿੱਚੋਂ ਦੁੱਤ ਅੱਖਰ ਦੀ ਪਛਾਣ ਕਰੋ:",
  "ਕਿਹੜਾ ਅੱਖਰ ਦੂਜੇ ਵਿਅੰਜਨ ਦੇ ਪੈਰ ਵਿੱਚ ਲਿਖਿਆ ਜਾ ਸਕਦਾ ਹੈ?",
];

const CP001_F01_HARD_AFTER = [
  (target: string) => `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਦੀ ਰਵਾਇਤੀ ਤਰਤੀਬ ਅਨੁਸਾਰ ਅੱਖਰ ‘${target}’ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਕਿਹੜਾ ਅੱਖਰ ਆਉਂਦਾ ਹੈ?`,
  (target: string) => `ਪੈਂਤੀ ਅੱਖਰੀ ਦੇ ਸ਼ੁੱਧ ਕ੍ਰਮ ਵਿੱਚ ‘${target}’ ਤੋਂ ਅਗਲਾ ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`,
  (target: string) => `ਪ੍ਰੀਖਿਆ ਪੱਧਰ 'ਤੇ ਦੱਸੋ: ਗੁਰਮੁਖੀ ਵਿੱਚ ‘${target}’ ਤੋਂ ਬਾਅਦ ਕਿਹੜਾ ਵਰਣ ਆਉਂਦਾ ਹੈ?`,
];

const CP001_F01_HARD_BEFORE = [
  (target: string) => `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਦੀ ਰਵਾਇਤੀ ਤਰਤੀਬ ਅਨੁਸਾਰ ਅੱਖਰ ‘${target}’ ਤੋਂ ਤੁਰੰਤ ਪਹਿਲਾਂ ਕਿਹੜਾ ਅੱਖਰ ਆਉਂਦਾ ਹੈ?`,
  (target: string) => `ਵਰਣਮਾਲਾ ਕ੍ਰਮ ਵਿੱਚ ‘${target}’ ਦੇ ਤੁਰੰਤ ਪੂਰਵਲਾ (ਪਹਿਲਾ) ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`,
  (target: string) => `ਸ਼ੁੱਧ ਗੁਰਮੁਖੀ ਤਰਤੀਬ ਅਨੁਸਾਰ ‘${target}’ ਤੋਂ ਪਹਿਲਾਂ ਆਉਣ ਵਾਲਾ ਵਰਣ ਪਛਾਣੋ:`,
];

const CP001_F01_HARD_NOT_ANUNASAK = [
  "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅੱਖਰ ‘ਅਨੁਨਾਸਕ’ (ਨਾਸਕੀ) ਅੱਖਰ ਨਹੀਂ ਹੈ?",
  "ਦਿੱਤੇ ਗਏ ਅੱਖਰਾਂ ਵਿੱਚੋਂ ਗ਼ੈਰ-ਨਾਸਕੀ (ਜੋ ਨਾਸਕੀ ਨਹੀਂ ਹੈ) ਅੱਖਰ ਚੁਣੋ:",
  "ਕਿਹੜੇ ਅੱਖਰ ਦੇ ਉਚਾਰਨ ਵੇਲੇ ਆਵਾਜ਼ ਨੱਕ ਵਿੱਚੋਂ ਨਹੀਂ ਨਿਕਲਦੀ?",
];

const CP001_F01_HARD_NOT_DUTT = [
  "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅੱਖਰ ਪੈਰ ਵਿੱਚ ਪੈਣ ਵਾਲਾ (ਦੁੱਤ ਅੱਖਰ) ਨਹੀਂ ਹੈ?",
  "ਕਿਹੜਾ ਅੱਖਰ ਦੁੱਤ ਅੱਖਰਾਂ (ਹ, ਰ, ਵ) ਦੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ?",
  "ਗੁਰਮੁਖੀ ਵਿਆਕਰਨ ਅਨੁਸਾਰ ਕਿਹੜਾ ਵਰਣ ਪੈਰੀਂ ਨਹੀਂ ਲਿਖਿਆ ਜਾਂਦਾ?",
];

const CP001_F01_HARD_NAVEEN = [
  "ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਦੀ ‘ਨਵੀਨ ਟੋਲੀ’ (ਪੈਰ-ਬਿੰਦੀ ਵਾਲੇ ਅੱਖਰਾਂ) ਵਿੱਚ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅੱਖਰ ਸ਼ਾਮਲ ਹੈ?",
  "ਫ਼ਾਰਸੀ ਅਤੇ ਅਰਬੀ ਧੁਨੀਆਂ ਦੇ ਸਹੀ ਉਚਾਰਨ ਲਈ ਸ਼ਾਮਲ ਕੀਤੇ ਨਵੀਨ ਅੱਖਰਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅੱਖਰ ਦਿੱਤਾ ਗਿਆ ਹੈ?",
  "ਪੈਰ-ਬਿੰਦੀ ਵਾਲੀ ਨਵੀਨ ਸ਼੍ਰੇਣੀ ਦਾ ਪ੍ਰਤੀਨਿਧ ਅੱਖਰ ਕਿਹੜਾ ਹੈ?",
];

export function generateCP001F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  if (difficulty === "Easy") {
    const subType = rng.pickOne(["LETTER_AFTER", "LETTER_BEFORE", "LETTER_TO_VARG"]);

    if (subType === "LETTER_AFTER") {
      const idx = rng.nextInt(0, GURMUKHI_35.length - 2);
      const target = GURMUKHI_35[idx]!;
      const after = GURMUKHI_35[idx + 1]!;
      const distractors = GURMUKHI_35.filter((l) => l !== after && l !== target);
      const stem = rng.pickOne(CP001_F01_EASY_AFTER)(target);
      return assembleQuestion({
        familyId: "F01",
        seed,
        difficulty,
        stem,
        correctAnswer: after,
        distractors,
        explanation: `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ‘${target}’ ਤੋਂ ਬਾਅਦ ‘${after}’ ਆਉਂਦਾ ਹੈ।`,
        authorityIds: ["PUN-AUTH-ORTHO-001"],
      });
    }

    if (subType === "LETTER_BEFORE") {
      const idx = rng.nextInt(1, GURMUKHI_35.length - 1);
      const target = GURMUKHI_35[idx]!;
      const before = GURMUKHI_35[idx - 1]!;
      const distractors = GURMUKHI_35.filter((l) => l !== before && l !== target);
      const stem = rng.pickOne(CP001_F01_EASY_BEFORE)(target);
      return assembleQuestion({
        familyId: "F01",
        seed,
        difficulty,
        stem,
        correctAnswer: before,
        distractors,
        explanation: `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ‘${target}’ ਤੋਂ ਪਹਿਲਾਂ ‘${before}’ ਆਉਂਦਾ ਹੈ।`,
        authorityIds: ["PUN-AUTH-ORTHO-001"],
      });
    }

    // LETTER_TO_VARG
    const letters = Object.keys(VARG_MAP);
    const chosenLetter = rng.pickOne(letters);
    const info = VARG_MAP[chosenLetter]!;
    const vargDistractors = [
      "ਕ-ਵਰਗ", "ਚ-ਵਰਗ", "ਟ-ਵਰਗ", "ਤ-ਵਰਗ", "ਪ-ਵਰਗ"
    ].filter((v) => v !== info.varg);
    const stem = rng.pickOne(CP001_F01_EASY_VARG)(chosenLetter);
    return assembleQuestion({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: info.varg,
      distractors: vargDistractors,
      explanation: `ਅੱਖਰ ‘${chosenLetter}’ ‘${info.varg}’ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`,
      authorityIds: ["PUN-AUTH-ORTHO-007"],
    });
  }

  if (difficulty === "Medium") {
    const subType = rng.pickOne(["PRONUNCIATION_PLACE", "VARG_MEMBER", "ANUNASAK_IDENTIFY", "DUTT_IDENTIFY"]);

    if (subType === "PRONUNCIATION_PLACE") {
      const letters = Object.keys(VARG_MAP);
      const chosenLetter = rng.pickOne(letters);
      const info = VARG_MAP[chosenLetter]!;
      const allPlaces = [
        "ਕੰਠੀ (ਕੰਠ/ਗਲਾ)",
        "ਤਾਲਵੀ (ਤਾਲੂ)",
        "ਮੂਰਧਨੀ / ਉਲਟ-ਜੀਭੀ",
        "ਦੰਤੀ (ਦੰਦ)",
        "ਹੋਠੀ (ਬੁੱਲ੍ਹ)",
      ];
      const distractors = allPlaces.filter((p) => p !== info.place);
      const stem = rng.pickOne(CP001_F01_MED_PLACE)(chosenLetter);
      return assembleQuestion({
        familyId: "F01",
        seed,
        difficulty,
        stem,
        correctAnswer: info.place,
        distractors,
        explanation: `ਅੱਖਰ ‘${chosenLetter}’ ਦਾ ਉਚਾਰਨ ਸਥਾਨ ‘${info.place}’ ਹੈ।`,
        authorityIds: ["PUN-AUTH-ORTHO-007"],
      });
    }

    if (subType === "ANUNASAK_IDENTIFY") {
      const stem = rng.pickOne(CP001_F01_MED_ANUNASAK);
      const correctLetter = rng.pickOne(["ਙ", "ਞ", "ਣ", "ਨ", "ਮ"]);
      const distractorPool = [
        "ਕ", "ਖ", "ਗ", "ਚ", "ਛ", "ਜ", "ਟ", "ਠ", "ਡ", "ਤ",
        "ਥ", "ਦ", "ਧ", "ਪ", "ਫ", "ਬ", "ਭ", "ਲ", "ਸ"
      ];
      return assembleQuestion({
        familyId: "F01",
        seed,
        difficulty,
        stem,
        correctAnswer: correctLetter,
        distractors: distractorPool,
        explanation: `‘${correctLetter}’ ਇੱਕ ਅਨੁਨਾਸਕ ਅੱਖਰ ਹੈ। ਗੁਰਮੁਖੀ ਵਿੱਚ 5 ਅਨੁਨਾਸਕ ਅੱਖਰ ਹਨ: ਙ, ਞ, ਣ, ਨ, ਮ।`,
        authorityIds: ["PUN-AUTH-ORTHO-006"],
      });
    }

    if (subType === "DUTT_IDENTIFY") {
      const stem = rng.pickOne(CP001_F01_MED_DUTT);
      const correctLetter = rng.pickOne(["ਹ", "ਰ", "ਵ"]);
      const distractorPool = [
        "ਸ", "ਕ", "ਦ", "ਬ", "ਲ", "ਮ", "ਚ", "ਟ", "ਪ", "ਤ", "ਨ", "ਜ"
      ];
      return assembleQuestion({
        familyId: "F01",
        seed,
        difficulty,
        stem,
        correctAnswer: correctLetter,
        distractors: distractorPool,
        explanation: `‘${correctLetter}’ ਦੁੱਤ ਅੱਖਰ ਹੈ। ਗੁਰਮੁਖੀ ਵਿੱਚ ਤਿੰਨ ਦੁੱਤ ਅੱਖਰ ਹੁੰਦੇ ਹਨ: ‘ਹ’, ‘ਰ’, ਅਤੇ ‘ਵ’।`,
        authorityIds: ["PUN-AUTH-ORTHO-005"],
      });
    }

    // VARG_MEMBER
    const varg = rng.pickOne(GURMUKHI_VARGS.slice(1, 6));
    const correctLetter = rng.pickOne(varg.letters.slice(0, 4));
    const distractorLetters: string[] = [];
    for (const otherVarg of GURMUKHI_VARGS) {
      if (otherVarg.vargNamePa !== varg.vargNamePa) {
        distractorLetters.push(otherVarg.letters[0]!, otherVarg.letters[1]!);
      }
    }
    const stem = rng.pickOne(CP001_F01_MED_VARG_MEMBER)(varg.vargNamePa);
    return assembleQuestion({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: correctLetter,
      distractors: distractorLetters,
      explanation: `ਅੱਖਰ ‘${correctLetter}’ ‘${varg.vargNamePa}’ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`,
      authorityIds: ["PUN-AUTH-ORTHO-007"],
    });
  }

  // Hard
  const subType = rng.pickOne(["LETTER_AFTER_HARD", "LETTER_BEFORE_HARD", "NOT_ANUNASAK", "NOT_DUTT", "NAVEEN_IDENTIFY"]);

  if (subType === "LETTER_AFTER_HARD") {
    const idx = rng.nextInt(0, GURMUKHI_35.length - 2);
    const target = GURMUKHI_35[idx]!;
    const after = GURMUKHI_35[idx + 1]!;
    const distractors = GURMUKHI_35.filter((l) => l !== after && l !== target);
    const stem = rng.pickOne(CP001_F01_HARD_AFTER)(target);
    return assembleQuestion({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: after,
      distractors,
      explanation: `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਦੀ ਤਰਤੀਬ ਅਨੁਸਾਰ ‘${target}’ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ‘${after}’ ਆਉਂਦਾ ਹੈ।`,
      authorityIds: ["PUN-AUTH-ORTHO-001"],
    });
  }

  if (subType === "LETTER_BEFORE_HARD") {
    const idx = rng.nextInt(1, GURMUKHI_35.length - 1);
    const target = GURMUKHI_35[idx]!;
    const before = GURMUKHI_35[idx - 1]!;
    const distractors = GURMUKHI_35.filter((l) => l !== before && l !== target);
    const stem = rng.pickOne(CP001_F01_HARD_BEFORE)(target);
    return assembleQuestion({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: before,
      distractors,
      explanation: `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਦੀ ਤਰਤੀਬ ਅਨੁਸਾਰ ‘${target}’ ਤੋਂ ਤੁਰੰਤ ਪਹਿਲਾਂ ‘${before}’ ਆਉਂਦਾ ਹੈ।`,
      authorityIds: ["PUN-AUTH-ORTHO-001"],
    });
  }

  if (subType === "NOT_ANUNASAK") {
    const nonAnunasak = rng.pickOne([
      "ਕ", "ਖ", "ਗ", "ਘ", "ਚ", "ਛ", "ਜ", "ਝ", "ਟ", "ਠ", "ਡ", "ਢ",
      "ਤ", "ਥ", "ਦ", "ਧ", "ਪ", "ਫ", "ਬ", "ਭ", "ਯ", "ਰ", "ਲ", "ਵ", "ੜ"
    ]);
    const anunasakDistractors = rng.pickDistinct(["ਙ", "ਞ", "ਣ", "ਨ", "ਮ"], 3);
    const stem = rng.pickOne(CP001_F01_HARD_NOT_ANUNASAK);
    return assembleQuestion({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: nonAnunasak,
      distractors: anunasakDistractors,
      explanation: `‘${nonAnunasak}’ ਅਨੁਨਾਸਕ ਅੱਖਰ ਨਹੀਂ ਹੈ। ਗੁਰਮੁਖੀ ਵਿੱਚ ਕੇਵਲ 5 ਅਨੁਨਾਸਕ ਅੱਖਰ ਹਨ: ਙ, ਞ, ਣ, ਨ, ਮ।`,
      authorityIds: ["PUN-AUTH-ORTHO-006"],
    });
  }

  if (subType === "NOT_DUTT") {
    const nonDutt = rng.pickOne([
      "ਕ", "ਖ", "ਗ", "ਚ", "ਜ", "ਟ", "ਤ", "ਦ", "ਨ", "ਪ", "ਬ", "ਮ", "ਲ", "ੜ", "ਸ", "ਯ"
    ]);
    const stem = rng.pickOne(CP001_F01_HARD_NOT_DUTT);
    return assembleQuestion({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: nonDutt,
      distractors: ["ਹ", "ਰ", "ਵ"],
      explanation: `‘${nonDutt}’ ਦੁੱਤ ਅੱਖਰ ਨਹੀਂ ਹੈ। ਗੁਰਮੁਖੀ ਵਿੱਚ ਕੇਵਲ ਤਿੰਨ ਅੱਖਰ ਹੀ ਪੈਰ ਵਿੱਚ ਪੈ ਸਕਦੇ ਹਨ: ‘ਹ’, ‘ਰ’, ‘ਵ’।`,
      authorityIds: ["PUN-AUTH-ORTHO-005"],
    });
  }

  // NAVEEN_IDENTIFY
  const naveenLetter = rng.pickOne(["ਸ਼", "ਖ਼", "ਗ਼", "ਜ਼", "ਫ਼", "ਲ਼"]);
  const normalConsonants = ["ਸ", "ਖ", "ਗ", "ਜ", "ਫ", "ਲ", "ਕ", "ਚ", "ਟ", "ਤ", "ਪ"];
  const naveenDistractors = rng.pickDistinct(normalConsonants, 3);
  const stem = rng.pickOne(CP001_F01_HARD_NAVEEN);
  return assembleQuestion({
    familyId: "F01",
    seed,
    difficulty,
    stem,
    correctAnswer: naveenLetter,
    distractors: naveenDistractors,
    explanation: `‘${naveenLetter}’ ਨਵੀਨ ਟੋਲੀ ਦਾ ਅੱਖਰ ਹੈ। ਨਵੀਨ ਟੋਲੀ ਵਿੱਚ ਕੁੱਲ 6 ਅੱਖਰ ਸ਼ਾਮਲ ਹਨ: ਸ਼, ਖ਼, ਗ਼, ਜ਼, ਫ਼, ਅਤੇ ਲ਼।`,
    authorityIds: ["PUN-AUTH-ORTHO-008"],
  });
}

// -----------------------------------------------------------------------------
// F02: Lagaan & Matras, Carriers, Word Matra Identification
// -----------------------------------------------------------------------------

export interface WordLagaItem {
  readonly word: string;
  readonly laga: string;
  readonly explanation: string;
}

export const WORD_LAGA_ITEMS: readonly WordLagaItem[] = [
  // ਮੁਕਤਾ
  { word: "ਘਰ", laga: "ਮੁਕਤਾ", explanation: "‘ਘਰ’ ਸ਼ਬਦ ਵਿੱਚ ਕੋਈ ਲਗ-ਮਾਤਰਾ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਇਹ ‘ਮੁਕਤਾ’ ਲਗ ਦੀ ਉਦਾਹਰਨ ਹੈ।" },
  { word: "ਜਲ", laga: "ਮੁਕਤਾ", explanation: "‘ਜਲ’ ਸ਼ਬਦ ਮੁਕਤਾ (ਬਿਨਾਂ ਕਿਸੇ ਲਗ ਚਿੰਨ੍ਹ ਵਾਲਾ) ਹੈ।" },
  { word: "ਫਲ", laga: "ਮੁਕਤਾ", explanation: "‘ਫਲ’ ਸ਼ਬਦ ਵਿੱਚ ਦੋਵੇਂ ਅੱਖਰ ਮੁਕਤਾ ਹਨ।" },
  { word: "ਬਲ", laga: "ਮੁਕਤਾ", explanation: "‘ਬਲ’ ਸ਼ਬਦ ਮੁਕਤਾ ਧੁਨੀ ਨਾਲ ਬਣਿਆ ਹੈ।" },
  { word: "ਮਨ", laga: "ਮੁਕਤਾ", explanation: "‘ਮਨ’ ਸ਼ਬਦ ਮੁਕਤਾ ਲਗ ਦੀ ਉਦਾਹਰਨ ਹੈ।" },
  { word: "ਕਰ", laga: "ਮੁਕਤਾ", explanation: "‘ਕਰ’ ਸ਼ਬਦ ਵਿੱਚ ਮੁਕਤਾ ਲਗ ਹੈ।" },

  // ਕੰਨਾ (ਾ)
  { word: "ਕਾਰ", laga: "ਕੰਨਾ", explanation: "‘ਕਾਰ’ ਸ਼ਬਦ ਵਿੱਚ ਕੱਕੇ ਨਾਲ ‘ਕੰਨਾ’ (ਾ) ਲੱਗਾ ਹੋਇਆ ਹੈ।" },
  { word: "ਪਾਠ", laga: "ਕੰਨਾ", explanation: "‘ਪਾਠ’ ਸ਼ਬਦ ਵਿੱਚ ਪੱਪੇ ਨਾਲ ‘ਕੰਨਾ’ (ਾ) ਲੱਗਾ ਹੋਇਆ ਹੈ।" },
  { word: "ਹਾਰ", laga: "ਕੰਨਾ", explanation: "‘ਹਾਰ’ ਸ਼ਬਦ ਵਿੱਚ ਹਾਹੇ ਨਾਲ ‘ਕੰਨਾ’ (ਾ) ਦੀ ਵਰਤੋਂ ਹੋਈ ਹੈ।" },
  { word: "ਤਾਰ", laga: "ਕੰਨਾ", explanation: "‘ਤਾਰ’ ਸ਼ਬਦ ਵਿੱਚ ਤੱਤੇ ਨਾਲ ‘ਕੰਨਾ’ (ਾ) ਆਇਆ ਹੈ।" },
  { word: "ਬਾਗ", laga: "ਕੰਨਾ", explanation: "‘ਬਾਗ’ ਸ਼ਬਦ ਵਿੱਚ ਬੱਬੇ ਨਾਲ ‘ਕੰਨਾ’ (ਾ) ਲੱਗਾ ਹੈ।" },
  { word: "ਦਾਸ", laga: "ਕੰਨਾ", explanation: "‘ਦਾਸ’ ਸ਼ਬਦ ਵਿੱਚ ਦੱਦੇ ਨਾਲ ‘ਕੰਨਾ’ (ਾ) ਵਰਤਿਆ ਗਿਆ ਹੈ।" },

  // ਸਿਹਾਰੀ (ਿ)
  { word: "ਕਿਤਾਬ", laga: "ਸਿਹਾਰੀ", explanation: "‘ਕਿਤਾਬ’ ਸ਼ਬਦ ਵਿੱਚ ਕੱਕੇ ਨਾਲ ‘ਸਿਹਾਰੀ’ (ਿ) ਲੱਗੀ ਹੋਈ ਹੈ।" },
  { word: "ਦਿਲ", laga: "ਸਿਹਾਰੀ", explanation: "‘ਦਿਲ’ ਸ਼ਬਦ ਵਿੱਚ ਦੱਦੇ ਨਾਲ ‘ਸਿਹਾਰੀ’ (ਿ) ਲੱਗੀ ਹੈ।" },
  { word: "ਦਿਨ", laga: "ਸਿਹਾਰੀ", explanation: "‘ਦਿਨ’ ਸ਼ਬਦ ਵਿੱਚ ਦੱਦੇ ਨਾਲ ‘ਸਿਹਾਰੀ’ (ਿ) ਵਰਤੀ ਗਈ ਹੈ।" },
  { word: "ਸਿਰ", laga: "ਸਿਹਾਰੀ", explanation: "‘ਸਿਰ’ ਸ਼ਬਦ ਵਿੱਚ ਸੱਸੇ ਨਾਲ ‘ਸਿਹਾਰੀ’ (ਿ) ਲੱਗੀ ਹੋਈ ਹੈ।" },
  { word: "ਮਿਲ", laga: "ਸਿਹਾਰੀ", explanation: "‘ਮਿਲ’ ਸ਼ਬਦ ਵਿੱਚ ਮੱਮੇ ਨਾਲ ‘ਸਿਹਾਰੀ’ (ਿ) ਆਈ ਹੈ।" },
  { word: "ਚਿਰ", laga: "ਸਿਹਾਰੀ", explanation: "‘ਚਿਰ’ ਸ਼ਬਦ ਵਿੱਚ ਚੱਚੇ ਨਾਲ ‘ਸਿਹਾਰੀ’ (ਿ) ਲੱਗੀ ਹੈ।" },

  // ਬਿਹਾਰੀ (ੀ)
  { word: "ਪਾਣੀ", laga: "ਬਿਹਾਰੀ", explanation: "‘ਪਾਣੀ’ ਸ਼ਬਦ ਦੇ ਅੰਤ ਵਿੱਚ ਣਾਣੇ ਨਾਲ ‘ਬਿਹਾਰੀ’ (ੀ) ਲੱਗੀ ਹੋਈ ਹੈ।" },
  { word: "ਨਦੀ", laga: "ਬਿਹਾਰੀ", explanation: "‘ਨਦੀ’ ਸ਼ਬਦ ਵਿੱਚ ਦੱਦੇ ਨਾਲ ‘ਬਿਹਾਰੀ’ (ੀ) ਲੱਗੀ ਹੈ।" },
  { word: "ਤੀਰ", laga: "ਬਿਹਾਰੀ", explanation: "‘ਤੀਰ’ ਸ਼ਬਦ ਵਿੱਚ ਤੱਤੇ ਨਾਲ ‘ਬਿਹਾਰੀ’ (ੀ) ਵਰਤੀ ਗਈ ਹੈ।" },
  { word: "ਖੀਰ", laga: "ਬਿਹਾਰੀ", explanation: "‘ਖੀਰ’ ਸ਼ਬਦ ਵਿੱਚ ਖੱਖੇ ਨਾਲ ‘ਬਿਹਾਰੀ’ (ੀ) ਆਈ ਹੈ।" },
  { word: "ਵੀਰ", laga: "ਬਿਹਾਰੀ", explanation: "‘ਵੀਰ’ ਸ਼ਬਦ ਵਿੱਚ ਵਾਵੇ ਨਾਲ ‘ਬਿਹਾਰੀ’ (ੀ) ਲੱਗੀ ਹੈ।" },
  { word: "ਹਾਥੀ", laga: "ਬਿਹਾਰੀ", explanation: "‘ਹਾਥੀ’ ਸ਼ਬਦ ਵਿੱਚ ਥੱਥੇ ਨਾਲ ‘ਬਿਹਾਰੀ’ (ੀ) ਲੱਗੀ ਹੋਈ ਹੈ।" },

  // ਔਂਕੜ (ੁ)
  { word: "ਗੁਲਾਬ", laga: "ਔਂਕੜ", explanation: "‘ਗੁਲਾਬ’ ਸ਼ਬਦ ਵਿੱਚ ਗੱਗੇ ਨਾਲ ‘ਔਂਕੜ’ (ੁ) ਲੱਗਾ ਹੋਇਆ ਹੈ।" },
  { word: "ਪੁਲ", laga: "ਔਂਕੜ", explanation: "‘ਪੁਲ’ ਸ਼ਬਦ ਵਿੱਚ ਪੱਪੇ ਨਾਲ ‘ਔਂਕੜ’ (ੁ) ਲੱਗਾ ਹੈ।" },
  { word: "ਸੁਣ", laga: "ਔਂਕੜ", explanation: "‘ਸੁਣ’ ਸ਼ਬਦ ਵਿੱਚ ਸੱਸੇ ਨਾਲ ‘ਔਂਕੜ’ (ੁ) ਵਰਤਿਆ ਗਿਆ ਹੈ।" },
  { word: "ਕੁਲ", laga: "ਔਂਕੜ", explanation: "‘ਕੁਲ’ ਸ਼ਬਦ ਵਿੱਚ ਕੱਕੇ ਨਾਲ ‘ਔਂਕੜ’ (ੁ) ਆਇਆ ਹੈ।" },
  { word: "ਬੁਰਾ", laga: "ਔਂਕੜ", explanation: "‘ਬੁਰਾ’ ਸ਼ਬਦ ਵਿੱਚ ਬੱਬੇ ਨਾਲ ‘ਔਂਕੜ’ (ੁ) ਲੱਗਾ ਹੈ।" },
  { word: "ਤੁਰ", laga: "ਔਂਕੜ", explanation: "‘ਤੁਰ’ ਸ਼ਬਦ ਵਿੱਚ ਤੱਤੇ ਨਾਲ ‘ਔਂਕੜ’ (ੁ) ਲੱਗਾ ਹੋਇਆ ਹੈ।" },

  // ਦੁਲੈਂਕੜ (ੂ)
  { word: "ਸੂਰਜ", laga: "ਦੁਲੈਂਕੜ", explanation: "‘ਸੂਰਜ’ ਸ਼ਬਦ ਵਿੱਚ ਸੱਸੇ ਨਾਲ ‘ਦੁਲੈਂਕੜ’ (ੂ) ਲੱਗਾ ਹੋਇਆ ਹੈ।" },
  { word: "ਦੂਰ", laga: "ਦੁਲੈਂਕੜ", explanation: "‘ਦੂਰ’ ਸ਼ਬਦ ਵਿੱਚ ਦੱਦੇ ਨਾਲ ‘ਦੁਲੈਂਕੜ’ (ੂ) ਲੱਗਾ ਹੈ।" },
  { word: "ਨੂਰ", laga: "ਦੁਲੈਂਕੜ", explanation: "‘ਨੂਰ’ ਸ਼ਬਦ ਵਿੱਚ ਨੱਨੇ ਨਾਲ ‘ਦੁਲੈਂਕੜ’ (ੂ) ਵਰਤਿਆ ਗਿਆ ਹੈ।" },
  { word: "ਚੂਹਾ", laga: "ਦੁਲੈਂਕੜ", explanation: "‘ਚੂਹਾ’ ਸ਼ਬਦ ਵਿੱਚ ਚੱਚੇ ਨਾਲ ‘ਦੁਲੈਂਕੜ’ (ੂ) ਆਇਆ ਹੈ।" },
  { word: "ਬੂਟ", laga: "ਦੁਲੈਂਕੜ", explanation: "‘ਬੂਟ’ ਸ਼ਬਦ ਵਿੱਚ ਬੱਬੇ ਨਾਲ ‘ਦੁਲੈਂਕੜ’ (ੂ) ਲੱਗਾ ਹੈ।" },
  { word: "ਮੂਲ", laga: "ਦੁਲੈਂਕੜ", explanation: "‘ਮੂਲ’ ਸ਼ਬਦ ਵਿੱਚ ਮੱਮੇ ਨਾਲ ‘ਦੁਲੈਂਕੜ’ (ੂ) ਲੱਗਾ ਹੋਇਆ ਹੈ।" },

  // ਲਾਂ (ੇ)
  { word: "ਕੇਲਾ", laga: "ਲਾਂ", explanation: "‘ਕੇਲਾ’ ਸ਼ਬਦ ਵਿੱਚ ਕੱਕੇ ਨਾਲ ‘ਲਾਂ’ (ੇ) ਲੱਗੀ ਹੋਈ ਹੈ।" },
  { word: "ਮੇਲਾ", laga: "ਲਾਂ", explanation: "‘ਮੇਲਾ’ ਸ਼ਬਦ ਵਿੱਚ ਮੱਮੇ ਨਾਲ ‘ਲਾਂ’ (ੇ) ਲੱਗੀ ਹੈ।" },
  { word: "ਸੇਬ", laga: "ਲਾਂ", explanation: "‘ਸੇਬ’ ਸ਼ਬਦ ਵਿੱਚ ਸੱਸੇ ਨਾਲ ‘ਲਾਂ’ (ੇ) ਵਰਤੀ ਗਈ ਹੈ।" },
  { word: "ਦੇਵ", laga: "ਲਾਂ", explanation: "‘ਦੇਵ’ ਸ਼ਬਦ ਵਿੱਚ ਦੱਦੇ ਨਾਲ ‘ਲਾਂ’ (ੇ) ਆਈ ਹੈ।" },
  { word: "ਤੇਲ", laga: "ਲਾਂ", explanation: "‘ਤੇਲ’ ਸ਼ਬਦ ਵਿੱਚ ਤੱਤੇ ਨਾਲ ‘ਲਾਂ’ (ੇ) ਲੱਗੀ ਹੈ।" },
  { word: "ਰੇਲ", laga: "ਲਾਂ", explanation: "‘ਰੇਲ’ ਸ਼ਬਦ ਵਿੱਚ ਰਾਰੇ ਨਾਲ ‘ਲਾਂ’ (ੇ) ਲੱਗੀ ਹੋਈ ਹੈ।" },

  // ਦੁਲਾਵਾਂ (ੈ)
  { word: "ਸੈਰ", laga: "ਦੁਲਾਵਾਂ", explanation: "‘ਸੈਰ’ ਸ਼ਬਦ ਵਿੱਚ ਸੱਸੇ ਨਾਲ ‘ਦੁਲਾਵਾਂ’ (ੈ) ਲੱਗੀ ਹੋਈ ਹੈ।" },
  { word: "ਪੈਰ", laga: "ਦੁਲਾਵਾਂ", explanation: "‘ਪੈਰ’ ਸ਼ਬਦ ਵਿੱਚ ਪੱਪੇ ਨਾਲ ‘ਦੁਲਾਵਾਂ’ (ੈ) ਲੱਗੀ ਹੈ।" },
  { word: "ਬੈਲ", laga: "ਦੁਲਾਵਾਂ", explanation: "‘ਬੈਲ’ ਸ਼ਬਦ ਵਿੱਚ ਬੱਬੇ ਨਾਲ ‘ਦੁਲਾਵਾਂ’ (ੈ) ਵਰਤੀ ਗਈ ਹੈ।" },
  { word: "ਮੈਲ", laga: "ਦੁਲਾਵਾਂ", explanation: "‘ਮੈਲ’ ਸ਼ਬਦ ਵਿੱਚ ਮੱਮੇ ਨਾਲ ‘ਦੁਲਾਵਾਂ’ (ੈ) ਆਈ ਹੈ।" },
  { word: "ਕੈਮਰਾ", laga: "ਦੁਲਾਵਾਂ", explanation: "‘ਕੈਮਰਾ’ ਸ਼ਬਦ ਵਿੱਚ ਕੱਕੇ ਨਾਲ ‘ਦੁਲਾਵਾਂ’ (ੈ) ਲੱਗੀ ਹੈ।" },
  { word: "ਥੈਲਾ", laga: "ਦੁਲਾਵਾਂ", explanation: "‘ਥੈਲਾ’ ਸ਼ਬਦ ਵਿੱਚ ਥੱਥੇ ਨਾਲ ‘ਦੁਲਾਵਾਂ’ (ੈ) ਲੱਗੀ ਹੋਈ ਹੈ।" },

  // ਹੋੜਾ (ੋ)
  { word: "ਮੋਰ", laga: "ਹੋੜਾ", explanation: "‘ਮੋਰ’ ਸ਼ਬਦ ਵਿੱਚ ਮੱਮੇ ਨਾਲ ‘ਹੋੜਾ’ (ੋ) ਲੱਗਾ ਹੋਇਆ ਹੈ।" },
  { word: "ਚੋਰ", laga: "ਹੋੜਾ", explanation: "‘ਚੋਰ’ ਸ਼ਬਦ ਵਿੱਚ ਚੱਚੇ ਨਾਲ ‘ਹੋੜਾ’ (ੋ) ਲੱਗਾ ਹੈ।" },
  { word: "ਕੋਟ", laga: "ਹੋੜਾ", explanation: "‘ਕੋਟ’ ਸ਼ਬਦ ਵਿੱਚ ਕੱਕੇ ਨਾਲ ‘ਹੋੜਾ’ (ੋ) ਵਰਤਿਆ ਗਿਆ ਹੈ।" },
  { word: "ਘੋੜਾ", laga: "ਹੋੜਾ", explanation: "‘ਘੋੜਾ’ ਸ਼ਬਦ ਵਿੱਚ ਘੱਘੇ ਨਾਲ ‘ਹੋੜਾ’ (ੋ) ਆਇਆ ਹੈ।" },
  { word: "ਢੋਲ", laga: "ਹੋੜਾ", explanation: "‘ਢੋਲ’ ਸ਼ਬਦ ਵਿੱਚ ਢੱਡੇ ਨਾਲ ‘ਹੋੜਾ’ (ੋ) ਲੱਗਾ ਹੈ।" },
  { word: "ਬੋਲ", laga: "ਹੋੜਾ", explanation: "‘ਬੋਲ’ ਸ਼ਬਦ ਵਿੱਚ ਬੱਬੇ ਨਾਲ ‘ਹੋੜਾ’ (ੋ) ਲੱਗਾ ਹੋਇਆ ਹੈ।" },

  // ਕਨੌੜਾ (ੌ)
  { word: "ਫ਼ੌਜ", laga: "ਕਨੌੜਾ", explanation: "‘ਫ਼ੌਜ’ ਸ਼ਬਦ ਵਿੱਚ ਫ਼ਫ਼ੇ ਨਾਲ ‘ਕਨੌੜਾ’ (ੌ) ਲੱਗਾ ਹੋਇਆ ਹੈ।" },
  { word: "ਪੌਦਾ", laga: "ਕਨੌੜਾ", explanation: "‘ਪੌਦਾ’ ਸ਼ਬਦ ਵਿੱਚ ਪੱਪੇ ਨਾਲ ‘ਕਨੌੜਾ’ (ੌ) ਲੱਗਾ ਹੈ।" },
  { word: "ਔਰਤ", laga: "ਕਨੌੜਾ", explanation: "‘ਔਰਤ’ ਸ਼ਬਦ ਵਿੱਚ ੳ/ਅ ਸਵਰ ਨਾਲ ‘ਕਨੌੜਾ’ (ੌ) ਵਰਤਿਆ ਗਿਆ ਹੈ।" },
  { word: "ਕੌਲ", laga: "ਕਨੌੜਾ", explanation: "‘ਕੌਲ’ ਸ਼ਬਦ ਵਿੱਚ ਕੱਕੇ ਨਾਲ ‘ਕਨੌੜਾ’ (ੌ) ਆਇਆ ਹੈ।" },
  { word: "ਦੌੜ", laga: "ਕਨੌੜਾ", explanation: "‘ਦੌੜ’ ਸ਼ਬਦ ਵਿੱਚ ਦੱਦੇ ਨਾਲ ‘ਕਨੌੜਾ’ (ੌ) ਲੱਗਾ ਹੈ।" },
  { word: "ਚੌਕ", laga: "ਕਨੌੜਾ", explanation: "‘ਚੌਕ’ ਸ਼ਬਦ ਵਿੱਚ ਚੱਚੇ ਨਾਲ ‘ਕਨੌੜਾ’ (ੌ) ਲੱਗਾ ਹੋਇਆ ਹੈ।" },
];

export const LAGA_SYMBOLS = [
  { symbol: "ਾ", name: "ਕੰਨਾ" },
  { symbol: "ਿ", name: "ਸਿਹਾਰੀ" },
  { symbol: "ੀ", name: "ਬਿਹਾਰੀ" },
  { symbol: "ੁ", name: "ਔਂਕੜ" },
  { symbol: "ੂ", name: "ਦੁਲੈਂਕੜ" },
  { symbol: "ੇ", name: "ਲਾਂ" },
  { symbol: "ੈ", name: "ਦੁਲਾਵਾਂ" },
  { symbol: "ੋ", name: "ਹੋੜਾ" },
  { symbol: "ੌ", name: "ਕਨੌੜਾ" },
];

const ALL_LAGAN_LIST = [
  "ਮੁਕਤਾ", "ਕੰਨਾ", "ਸਿਹਾਰੀ", "ਬਿਹਾਰੀ", "ਔਂਕੜ", "ਦੁਲੈਂਕੜ", "ਲਾਂ", "ਦੁਲਾਵਾਂ", "ਹੋੜਾ", "ਕਨੌੜਾ"
];

const CP001_F02_EASY_CARRIER = [
  (carrier: string) => `ਸਵਰ ਵਾਹਕ ‘${carrier}’ ਨਾਲ ਕੁੱਲ ਕਿੰਨੀਆਂ ਲਗਾਂ ਲੱਗਦੀਆਂ ਹਨ?`,
  (carrier: string) => `ਗੁਰਮੁਖੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘${carrier}’ ਨਾਲ ਕਿੰਨੀਆਂ ਲਗਾਂ-ਮਾਤਰਾਂ ਜੁੜ ਸਕਦੀਆਂ ਹਨ?`,
  (carrier: string) => `ਸਵਰ ਅੱਖਰ ‘${carrier}’ ਨਾਲ ਵਰਤੀਆਂ ਜਾਣ ਵਾਲੀਆਂ ਲਗਾਂ ਦੀ ਗਿਣਤੀ ਦੱਸੋ:`,
];

const CP001_F02_EASY_WORD = [
  (word: string) => `ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜੀ ਲਗ (ਮਾਤਰਾ) ਦੀ ਵਰਤੋਂ ਕੀਤੀ ਗਈ ਹੈ?`,
  (word: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ਆਈ ਲਗ-ਮਾਤਰਾ ਪਛਾਣੋ:`,
  (word: string) => `‘${word}’ ਸ਼ਬਦ ਕਿਸ ਲਗ ਦੀ ਪ੍ਰਮੁੱਖ ਉਦਾਹਰਨ ਹੈ?`,
];

const CP001_F02_MED_ALLOWED = [
  (carrier: string) => `ਹੇਠ ਲਿਖੀਆਂ ਲਗਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਲਗ ਸਵਰ ਵਾਹਕ ‘${carrier}’ ਨਾਲ ਲੱਗਦੀ ਹੈ?`,
  (carrier: string) => `ਕਿਹੜੀ ਲਗ-ਮਾਤਰਾ ਸਵਰ ਵਾਹਕ ‘${carrier}’ ਨਾਲ ਸਹੀ ਢੰਗ ਨਾਲ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?`,
  (carrier: string) => `ਗੁਰਮੁਖੀ ਨਿਯਮ ਮੁਤਾਬਕ ਸਵਰ ‘${carrier}’ ਨਾਲ ਕਿਹੜੀ ਲਗ ਲੱਗਣੀ ਜਾਇਜ਼ ਹੈ?`,
];

const CP001_F02_MED_REVERSE = [
  (laga: string) => `ਲਗ ‘${laga}’ ਗੁਰਮੁਖੀ ਦੇ ਕਿਸ ਸਵਰ ਵਾਹਕ ਨਾਲ ਵਰਤੀ ਜਾ ਸਕਦੀ ਹੈ?`,
  (laga: string) => `ਕਿਹੜੇ ਸਵਰ ਅੱਖਰ ਨਾਲ ‘${laga}’ ਲਗਾਈ ਜਾਂਦੀ ਹੈ?`,
  (laga: string) => `ਨਿਯਮ ਅਨੁਸਾਰ ਲਗ ‘${laga}’ ਕਿਸ ਸਵਰ ਵਾਹਕ ਨਾਲ ਜੁੜਦੀ ਹੈ?`,
];

const CP001_F02_MED_WORD = [
  (word: string) => `ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ਵਿਆਕਰਨ ਅਨੁਸਾਰ ਕਿਹੜੀ ਲਗ-ਮਾਤਰਾ ਸ਼ਾਮਲ ਹੈ?`,
  (word: string) => `‘${word}’ ਸ਼ਬਦ ਅੰਦਰ ਵਰਤੀ ਗਈ ਲਗ ਦੀ ਸ਼ੁੱਧ ਪਛਾਣ ਕਰੋ:`,
  (word: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ਕਿਹੜੀ ਲਗ ਦਰਜ ਹੈ?`,
];

const CP001_F02_HARD_PROHIBITED = [
  (carrier: string) => `ਹੇਠ ਲਿਖੀਆਂ ਲਗਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਲਗ ਸਵਰ ਵਾਹਕ ‘${carrier}’ ਨਾਲ ਨਹੀਂ ਲੱਗ ਸਕਦੀ?`,
  (carrier: string) => `ਨਿਯਮਾਂ ਅਨੁਸਾਰ ‘${carrier}’ ਨਾਲ ਕਿਹੜੀ ਲਗ ਲਗਾਉਣੀ ਅਸ਼ੁੱਧ ਹੈ?`,
  (carrier: string) => `ਕਿਹੜੀ ਲਗ ਦਾ ਪ੍ਰਯੋਗ ਸਵਰ ਅੱਖਰ ‘${carrier}’ ਨਾਲ ਵਰਜਿਤ ਹੈ?`,
];

const CP001_F02_HARD_SYMBOL = [
  (symbol: string) => `ਗੁਰਮੁਖੀ ਲਿਪੀ ਚਿੰਨ੍ਹ ‘${symbol}’ ਕਿਸ ਲਗ-ਮਾਤਰਾ ਦਾ ਸੂਚਕ ਹੈ?`,
  (symbol: string) => `ਲਿਪੀ ਚਿੰਨ੍ਹ ‘${symbol}’ ਨੂੰ ਪੰਜਾਬੀ ਵਿਆਕਰਨ ਵਿੱਚ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?`,
  (symbol: string) => `ਦਿੱਤਾ ਗਿਆ ਮਾਤਰਾ ਚਿੰਨ੍ਹ ‘${symbol}’ ਕਿਹੜੀ ਲਗ ਦਰਸਾਉਂਦਾ ਹੈ?`,
];

const CP001_F02_HARD_WORD = [
  (word: string) => `ਉਚਾਰਨ ਅਤੇ ਲਿਪੀ ਅਨੁਸਾਰ ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ਕਿਹੜੀ ਲਗ ਮੌਜੂਦ ਹੈ?`,
  (word: string) => `ਪ੍ਰੀਖਿਆ ਦ੍ਰਿਸ਼ਟੀਕੋਣ ਤੋਂ ਦੱਸੋ: ‘${word}’ ਵਿੱਚ ਵਰਤੀ ਗਈ ਲਗ ਕਿਹੜੀ ਹੈ?`,
  (word: string) => `ਸ਼ਬਦ ‘${word}’ ਕਿਸ ਵਿਸ਼ੇਸ਼ ਲਗ-ਮਾਤਰਾ ਦਾ ਰੂਪ ਧਾਰਨ ਕਰਦਾ ਹੈ?`,
];

export function generateCP001F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  if (difficulty === "Easy") {
    const subType = rng.pickOne(["CARRIER_COUNT", "WORD_LAGA_EASY"]);

    if (subType === "WORD_LAGA_EASY") {
      const item = rng.pickOne(WORD_LAGA_ITEMS);
      const distractors = ALL_LAGAN_LIST.filter((l) => l !== item.laga);
      const stem = rng.pickOne(CP001_F02_EASY_WORD)(item.word);
      return assembleQuestion({
        familyId: "F02",
        seed,
        difficulty,
        stem,
        correctAnswer: item.laga,
        distractors,
        explanation: item.explanation,
        authorityIds: ["PUN-AUTH-CARRIER-001"],
      });
    }

    const carrier = rng.pickOne(CARRIER_RULES);
    const stem = rng.pickOne(CP001_F02_EASY_CARRIER)(carrier.carrier);
    return assembleQuestion({
      familyId: "F02",
      seed,
      difficulty,
      stem,
      correctAnswer: String(carrier.allowedCount),
      distractors: ["1", "2", "4", "5", "6", "10"].filter(
        (n) => n !== String(carrier.allowedCount)
      ),
      explanation: carrier.explanationPa,
      authorityIds: ["PUN-AUTH-CARRIER-001"],
    });
  }

  if (difficulty === "Medium") {
    const subType = rng.pickOne(["CARRIER_ALLOWED", "LAGA_CARRIER_REVERSE", "WORD_LAGA_MED"]);

    if (subType === "WORD_LAGA_MED") {
      const item = rng.pickOne(WORD_LAGA_ITEMS);
      const distractors = ALL_LAGAN_LIST.filter((l) => l !== item.laga);
      const stem = rng.pickOne(CP001_F02_MED_WORD)(item.word);
      return assembleQuestion({
        familyId: "F02",
        seed,
        difficulty,
        stem,
        correctAnswer: item.laga,
        distractors,
        explanation: item.explanation,
        authorityIds: ["PUN-AUTH-CARRIER-002"],
      });
    }

    if (subType === "LAGA_CARRIER_REVERSE") {
      const laganNames = Object.keys(LAGA_TO_CARRIER);
      const laga = rng.pickOne(laganNames);
      const correctCarrier = LAGA_TO_CARRIER[laga]!;
      const distractors = ["ੳ", "ਅ", "ੲ", "ਸ"].filter((c) => c !== correctCarrier);
      const stem = rng.pickOne(CP001_F02_MED_REVERSE)(laga);
      return assembleQuestion({
        familyId: "F02",
        seed,
        difficulty,
        stem,
        correctAnswer: correctCarrier,
        distractors,
        explanation: `ਲਗ ‘${laga}’ ਸਵਰ ਵਾਹਕ ‘${correctCarrier}’ ਨਾਲ ਲੱਗਦੀ ਹੈ।`,
        authorityIds: ["PUN-AUTH-CARRIER-002"],
      });
    }

    // CARRIER_ALLOWED
    const carrier = rng.pickOne(CARRIER_RULES);
    const correctLagan = rng.pickOne(carrier.allowedLaganNamesPa);
    const distractorLagan: string[] = [];
    for (const other of CARRIER_RULES) {
      if (other.carrier !== carrier.carrier) {
        distractorLagan.push(...other.allowedLaganNamesPa);
      }
    }
    const stem = rng.pickOne(CP001_F02_MED_ALLOWED)(carrier.carrier);
    return assembleQuestion({
      familyId: "F02",
      seed,
      difficulty,
      stem,
      correctAnswer: correctLagan,
      distractors: distractorLagan,
      explanation: `ਸਵਰ ਵਾਹਕ ‘${carrier.carrier}’ ਨਾਲ ਲੱਗਣ ਵਾਲੀਆਂ ਲਗਾਂ ਹਨ: ${carrier.allowedLaganNamesPa.join(", ")}। ਇਸ ਲਈ ‘${correctLagan}’ ਸਹੀ ਉੱਤਰ ਹੈ।`,
      authorityIds: ["PUN-AUTH-CARRIER-002"],
    });
  }

  // Hard
  const subType = rng.pickOne(["CARRIER_PROHIBITED", "LAGA_SYMBOL_HARD", "WORD_LAGA_HARD"]);

  if (subType === "WORD_LAGA_HARD") {
    const item = rng.pickOne(WORD_LAGA_ITEMS);
    const distractors = ALL_LAGAN_LIST.filter((l) => l !== item.laga);
    const stem = rng.pickOne(CP001_F02_HARD_WORD)(item.word);
    return assembleQuestion({
      familyId: "F02",
      seed,
      difficulty,
      stem,
      correctAnswer: item.laga,
      distractors,
      explanation: item.explanation,
      authorityIds: ["PUN-AUTH-CARRIER-003"],
    });
  }

  if (subType === "LAGA_SYMBOL_HARD") {
    const item = rng.pickOne(LAGA_SYMBOLS);
    const distractors = ALL_LAGAN_LIST.filter((l) => l !== item.name);
    const stem = rng.pickOne(CP001_F02_HARD_SYMBOL)(item.symbol);
    return assembleQuestion({
      familyId: "F02",
      seed,
      difficulty,
      stem,
      correctAnswer: item.name,
      distractors,
      explanation: `ਗੁਰਮੁਖੀ ਵਿੱਚ ਚਿੰਨ੍ਹ ‘${item.symbol}’ ‘${item.name}’ ਲਗ ਦਾ ਪ੍ਰਤੀਕ ਹੈ।`,
      authorityIds: ["PUN-AUTH-CARRIER-003"],
    });
  }

  // CARRIER_PROHIBITED
  const carrier = rng.pickOne(CARRIER_RULES);
  const prohibitedLaganList: string[] = [];
  for (const other of CARRIER_RULES) {
    if (other.carrier !== carrier.carrier) {
      prohibitedLaganList.push(...other.allowedLaganNamesPa);
    }
  }
  const prohibitedLagan = rng.pickOne(prohibitedLaganList);
  const allowedLagan = rng.pickDistinct(carrier.allowedLaganNamesPa, 3);
  const stem = rng.pickOne(CP001_F02_HARD_PROHIBITED)(carrier.carrier);
  return assembleQuestion({
    familyId: "F02",
    seed,
    difficulty,
    stem,
    correctAnswer: prohibitedLagan,
    distractors: allowedLagan,
    explanation: `‘${carrier.carrier}’ ਨਾਲ ਕੇਵਲ [${carrier.allowedLaganNamesPa.join(", ")}] ਹੀ ਲੱਗ ਸਕਦੀਆਂ ਹਨ। ਲਗ ‘${prohibitedLagan}’ ਇਸ ਨਾਲ ਨਹੀਂ ਲੱਗ ਸਕਦੀ।`,
    authorityIds: ["PUN-AUTH-CARRIER-003"],
  });
}

// -----------------------------------------------------------------------------
// F03: Lagakhars (ਬਿੰਦੀ, ਟਿੱਪੀ, ਅੱਧਕ)
// -----------------------------------------------------------------------------

export interface LagakharWordItem {
  readonly word: string;
  readonly expectedLagakhar: string;
  readonly explanation: string;
}

export const LAGAKHAR_WORD_ITEMS: readonly LagakharWordItem[] = [
  // ਅੱਧਕ (26 words)
  { word: "ਸੱਚ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਸੱਚ’ ਸ਼ਬਦ ਵਿੱਚ ਚੱਚੇ ਦੀ ਦੂਹਰੀ ਆਵਾਜ਼ ਲਈ ਸੱਸੇ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਬੱਚਾ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਬੱਚਾ’ ਸ਼ਬਦ ਵਿੱਚ ਚੱਚੇ ਦੀ ਦੋਹਰੀ ਆਵਾਜ਼ ਲਈ ਬੱਬੇ ਉੱਤੇ ਅੱਧਕ ਦੀ ਵਰਤੋਂ ਹੁੰਦੀ ਹੈ।" },
  { word: "ਹੱਥ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਹੱਥ’ ਸ਼ਬਦ ਵਿੱਚ ਥੱਥੇ ਦੀ ਆਵਾਜ਼ ਉੱਤੇ ਜ਼ੋਰ ਦੇਣ ਲਈ ਹਾਹੇ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਮੱਖਣ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਮੱਖਣ’ ਵਿੱਚ ਖੱਖੇ ਦੀ ਦੋਹਰੀ ਆਵਾਜ਼ ਲਈ ਮੱਮੇ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਰੱਸੀ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਰੱਸੀ’ ਵਿੱਚ ਸੱਸੇ ਦੀ ਆਵਾਜ਼ ਦੂਹਰੀ ਕਰਨ ਲਈ ਰਾਰੇ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਜੱਜ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਜੱਜ’ ਸ਼ਬਦ ਵਿੱਚ ਜੱਜੇ ਦੀ ਦੂਹਰੀ ਧੁਨੀ ਲਈ ਪਹਿਲੇ ਜੱਜੇ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਲੱਕੜ", expectedLagakhar: "ਅੱਧਕ", explanation: "ਕੱਕੇ ਦੀ ਦੋਹਰੀ ਆਵਾਜ਼ ਲਈ ਲੱਲੇ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਨੱਕ", expectedLagakhar: "ਅੱਧਕ", explanation: "ਕੱਕੇ 'ਤੇ ਜ਼ੋਰ ਦੇਣ ਲਈ ਨੱਨੇ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਅੱਖ", expectedLagakhar: "ਅੱਧਕ", explanation: "ਖੱਖੇ ਦੀ ਦੋਹਰੀ ਧੁਨੀ ਲਈ ਐੜੇ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਦੁੱਧ", expectedLagakhar: "ਅੱਧਕ", explanation: "ਧੱਦੇ 'ਤੇ ਜ਼ੋਰ ਦੇਣ ਲਈ ਦੱਦੇ ਨੂੰ ਔਂਕੜ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਰੁੱਖ", expectedLagakhar: "ਅੱਧਕ", explanation: "ਖੱਖੇ 'ਤੇ ਜ਼ੋਰ ਦੇਣ ਲਈ ਰਾਰੇ ਨੂੰ ਔਂਕੜ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਪੱਤਾ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਪੱਤਾ’ ਵਿੱਚ ਤੱਤੇ ਦੀ ਦਬਾਅ ਵਾਲੀ ਆਵਾਜ਼ ਲਈ ਪੱਪੇ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਬਿੱਲੀ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਬਿੱਲੀ’ ਵਿੱਚ ਲੱਲੇ ਦੀ ਆਵਾਜ਼ ਦੂਹਰੀ ਕਰਨ ਲਈ ਬੱਬੇ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਕੁੱਤਾ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਕੁੱਤਾ’ ਸ਼ਬਦ ਵਿੱਚ ਤੱਤੇ ਦੀ ਦੂਹਰੀ ਆਵਾਜ਼ ਪ੍ਰਗਟਾਉਣ ਲਈ ਕੱਕੇ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਦਿੱਲੀ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਦਿੱਲੀ’ ਸ਼ਬਦ ਵਿੱਚ ਲੱਲੇ ਉੱਤੇ ਬਲ ਦੇਣ ਲਈ ਦੱਦੇ ਦੀ ਸਿਹਾਰੀ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਛਿੱਕ", expectedLagakhar: "ਅੱਧਕ", explanation: "ਕੱਕੇ 'ਤੇ ਦਬਾਅ ਲਈ ਛੱਛੇ ਦੀ ਸਿਹਾਰੀ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਮੱਝ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਮੱਝ’ ਸ਼ਬਦ ਵਿੱਚ ਝੱਜੇ ਦੀ ਦੂਹਰੀ ਆਵਾਜ਼ ਲਈ ਮੱਮੇ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਨਿੱਕਾ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਨਿੱਕਾ’ ਵਿੱਚ ਕੱਕੇ 'ਤੇ ਬਲ ਲਈ ਨੱਨੇ ਦੀ ਸਿਹਾਰੀ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਵੱਡਾ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਵੱਡਾ’ ਵਿੱਚ ਡੱਡੇ 'ਤੇ ਜ਼ੋਰ ਲਈ ਵਾਵੇ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਫੁੱਲ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਫੁੱਲ’ ਵਿੱਚ ਲੱਲੇ ਦੀ ਆਵਾਜ਼ ਦੂਹਰੀ ਕਰਨ ਲਈ ਫੱਫੇ ਦੇ ਔਂਕੜ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਚੁੱਲ੍ਹਾ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਚੁੱਲ੍ਹਾ’ ਸ਼ਬਦ ਵਿੱਚ ਚੱਚੇ ਦੇ ਔਂਕੜ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਗੱਲ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਗੱਲ’ ਸ਼ਬਦ ਵਿੱਚ ਲੱਲੇ ਦੀ ਦੂਹਰੀ ਆਵਾਜ਼ ਲਈ ਗੱਗੇ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਮੱਥਾ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਮੱਥਾ’ ਸ਼ਬਦ ਵਿੱਚ ਥੱਥੇ 'ਤੇ ਬਲ ਦੇਣ ਲਈ ਮੱਮੇ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਪੱਕਾ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਪੱਕਾ’ ਸ਼ਬਦ ਵਿੱਚ ਕੱਕੇ ਦੀ ਆਵਾਜ਼ ਦੂਹਰੀ ਕਰਨ ਲਈ ਪੱਪੇ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਕੱਚਾ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਕੱਚਾ’ ਵਿੱਚ ਚੱਚੇ ਦੀ ਦੋਹਰੀ ਆਵਾਜ਼ ਲਈ ਕੱਕੇ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },
  { word: "ਲੱਤ", expectedLagakhar: "ਅੱਧਕ", explanation: "‘ਲੱਤ’ ਵਿੱਚ ਤੱਤੇ ਦੀ ਦਬਾਅ ਵਾਲੀ ਆਵਾਜ਼ ਲਈ ਲੱਲੇ 'ਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ।" },

  // ਟਿੱਪੀ (27 words)
  { word: "ਕੰਘੀ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਕੰਘੀ’ ਸ਼ਬਦ ਵਿੱਚ ਕੱਕੇ ਨਾਲ ਮੁਕਤਾ ਲਗ ਹੈ, ਜਿਸ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਟਿੱਪੀ (ੰ) ਲੱਗਦੀ ਹੈ।" },
  { word: "ਪਤੰਗ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਪਤੰਗ’ ਵਿੱਚ ਤੱਤੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਰਕੇ ਨਾਸਕੀ ਸੁਰ ਲਈ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਰੰਗ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਰੰਗ’ ਸ਼ਬਦ ਵਿੱਚ ਰਾਰੇ ਨਾਲ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਸਿੰਘ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "ਸਿਹਾਰੀ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਪ੍ਰਗਟ ਕਰਨ ਲਈ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਮੁੰਡਾ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "ਔਂਕੜ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਟਿੱਪੀ ਦੀ ਵਰਤੋਂ ਹੁੰਦੀ ਹੈ।" },
  { word: "ਕੁੰਜੀ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "ਔਂਕੜ ਨਾਲ ਨਾਸਕੀ ਸੁਰ ਲਈ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਪਿੰਡ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "ਸਿਹਾਰੀ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਟਿੱਪੀ ਲਗਾਈ ਜਾਂਦੀ ਹੈ।" },
  { word: "ਖੰਡ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "ਮੁਕਤਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਸੁਰ ਲਈ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਸੁੰਦਰ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "ਔਂਕੜ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਟਿੱਪੀ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।" },
  { word: "ਚੰਦ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "ਮੁਕਤਾ ਅੱਖਰ ਨਾਲ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਝੰਡਾ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "ਮੁਕਤਾ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਦੰਦ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਦੰਦ’ ਵਿੱਚ ਦੱਦੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਾਰਨ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਅੰਬ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਅੰਬ’ ਵਿੱਚ ਐੜੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਾਰਨ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਜੰਗਲ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਜੰਗਲ’ ਵਿੱਚ ਜੱਜੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਰਕੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਸੰਗਤ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਸੰਗਤ’ ਵਿੱਚ ਸੱਸੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਾਰਨ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਪੰਛੀ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਪੰਛੀ’ ਵਿੱਚ ਪੱਪੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਾਰਨ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਅੰਗੂਰ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਅੰਗੂਰ’ ਵਿੱਚ ਐੜੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਾਰਨ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਪਿੰਜਰਾ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਪਿੰਜਰਾ’ ਵਿੱਚ ਸਿਹਾਰੀ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਹੰਸ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਹੰਸ’ ਵਿੱਚ ਹਾਹੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਰਕੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਡੰਡਾ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਡੰਡਾ’ ਵਿੱਚ ਡੱਡੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਰਕੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਸੰਤਰਾ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਸੰਤਰਾ’ ਵਿੱਚ ਸੱਸੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਾਰਨ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਕੰਧ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਕੰਧ’ ਵਿੱਚ ਕੱਕੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਾਰਨ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਪੰਧ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਪੰਧ’ ਵਿੱਚ ਪੱਪੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਾਰਨ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਮੰਦਰ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਮੰਦਰ’ ਵਿੱਚ ਮੱਮੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਾਰਨ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਬੰਦੂਕ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਬੰਦੂਕ’ ਵਿੱਚ ਬੱਬੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਰਕੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਕੁੰਡਲ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਕੁੰਡਲ’ ਵਿੱਚ ਔਂਕੜ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਮੰਗਲ", expectedLagakhar: "ਟਿੱਪੀ", explanation: "‘ਮੰਗਲ’ ਵਿੱਚ ਮੱਮੇ ਨਾਲ ਮੁਕਤਾ ਹੋਣ ਕਰਕੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।" },

  // ਬਿੰਦੀ (27 words)
  { word: "ਮਾਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਹਮੇਸ਼ਾ ਬਿੰਦੀ (ਂ) ਲੱਗਦੀ ਹੈ।" },
  { word: "ਗਾਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "‘ਗਾਂ’ ਸ਼ਬਦ ਵਿੱਚ ਕੰਨਾ ਲਗ ਹੋਣ ਕਰਕੇ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਨੀਂਦ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਬਿਹਾਰੀ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਪ੍ਰਗਟਾਉਣ ਲਈ ਬਿੰਦੀ ਲਗਾਈ ਜਾਂਦੀ ਹੈ।" },
  { word: "ਗੇਂਦ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਲਾਂ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਚੋਂਚ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਹੋੜਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਸੁਰ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਚੌਂਕ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕਨੌੜਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਪੀਂਘ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਬਿਹਾਰੀ ਲਗ ਨਾਲ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਬੈਂਕ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਦੁਲਾਵਾਂ ਲਗ ਨਾਲ ਨਾਸਕੀ ਸੁਰ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਜੌਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕਨੌੜਾ ਲਗ ਨਾਲ ਬਿੰਦੀ ਦੀ ਵਰਤੋਂ ਹੁੰਦੀ ਹੈ।" },
  { word: "ਸੌਂਫ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਹੋੜਾ/ਕਨੌੜਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਧੁਨੀ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਕਾਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਬਾਹਾਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨਾ ਲਗ ਦੇ ਬਹੁਵਚਨ ਰੂਪ ਵਿੱਚ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਅੱਖਾਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨਾ ਲਗ ਨਾਲ ਬਹੁਵਚਨ ਨਾਸਕੀ ਧੁਨੀ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਕਿਤਾਬਾਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨੇ ਉੱਤੇ ਨਾਸਕੀ ਸੁਰ ਲਈ ਬਿੰਦੀ ਲਗਾਈ ਜਾਂਦੀ ਹੈ।" },
  { word: "ਕੁਰਸੀਆਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨੇ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਮੇਜ਼ਾਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨੇ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਧੀਆਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨੇ ਨਾਲ ਨਾਸਕੀ ਸੁਰ ਲਈ ਬਿੰਦੀ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।" },
  { word: "ਰਾਤਾਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨੇ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਛਾਂ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਜਾਂਦਾ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਖਾਂਦਾ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕੰਨੇ ਨਾਲ ਨਾਸਕੀ ਸੁਰ ਲਈ ਬਿੰਦੀ ਲਗਾਈ ਜਾਂਦੀ ਹੈ।" },
  { word: "ਪੀਂਦਾ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਬਿਹਾਰੀ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਸੌਂਦਾ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕਨੌੜਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਰਹਿੰਦਾ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਸਿਹਾਰੀ-ਕੰਨਾ ਸੁਮੇਲ ਵਿੱਚ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਹੋਂਦ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਹੋੜਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਧੁਨੀ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਗੋਂਦ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਹੋੜਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
  { word: "ਧੌਂਸ", expectedLagakhar: "ਬਿੰਦੀ", explanation: "ਕਨੌੜਾ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।" },
];

const CP001_F03_EASY_WORD = [
  (word: string) => `ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ਕਿਹੜੇ ਲਗਾਖਰ ਦੀ ਵਰਤੋਂ ਹੋਈ ਹੈ?`,
  (word: string) => `ਦਿੱਤੇ ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ਆਏ ਲਗਾਖਰ ਦੀ ਪਛਾਣ ਕਰੋ:`,
  (word: string) => `‘${word}’ ਸ਼ਬਦ ਵਿੱਚ ਕਿਹੜਾ ਸਹਾਇਕ ਲਿਪੀ ਚਿੰਨ੍ਹ (ਲਗਾਖਰ) ਲੱਗਾ ਹੈ?`,
];

const CP001_F03_EASY_TOTAL = [
  "ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਲਗਾਖਰ ਹਨ?",
  "ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਪੰਜਾਬੀ ਵਿੱਚ ਲਗਾਖਰਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?",
  "ਲਗਾਂ ਨਾਲ ਲੱਗਣ ਵਾਲੇ ਸਹਾਇਕ ਲਿਪੀ ਚਿੰਨ੍ਹ (ਲਗਾਖਰ) ਕਿੰਨੇ ਹੁੰਦੇ ਹਨ?",
];

const CP001_F03_EASY_ADDAK = [
  "ਕਿਸੇ ਅੱਖਰ ਦੀ ਆਵਾਜ਼ ਨੂੰ ਦੂਹਰਾ (ਬਲ ਵਾਲਾ) ਪ੍ਰਗਟ ਕਰਨ ਲਈ ਕਿਸ ਲਗਾਖਰ ਦੀ ਵਰਤੋਂ ਕੀਤੀ ਜਾਂਦੀ ਹੈ?",
  "ਧੁਨੀ ਉੱਤੇ ਦਬਾਅ ਜਾਂ ਬਲ ਦੇਣ ਲਈ ਕਿਹੜਾ ਲਗਾਖਰ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
  "ਦੋਹਰੀ ਆਵਾਜ਼ ਪ੍ਰਗਟ ਕਰਨ ਲਈ ਕਿਹੜੇ ਲਗਾਖਰ ਦੀ ਵਰਤੋਂ ਹੁੰਦੀ ਹੈ?",
];

const CP001_F03_MED_WORD = [
  (word: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਸ਼ਬਦ ‘${word}’ ਅੰਦਰ ਕਿਹੜਾ ਲਗਾਖਰ ਸਹੀ ਰੂਪ ਵਿੱਚ ਦਰਜ ਹੈ?`,
  (word: string) => `ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ਨਾਸਕੀ ਜਾਂ ਦੂਹਰੀ ਆਵਾਜ਼ ਲਈ ਕਿਹੜਾ ਲਗਾਖਰ ਵਰਤਿਆ ਗਿਆ ਹੈ?`,
  (word: string) => `‘${word}’ ਸ਼ਬਦ ਵਿੱਚ ਵਰਤਿਆ ਗਿਆ ਲਗਾਖਰ ਚੁਣੋ:`,
];

const CP001_F03_MED_COUNT = [
  (name: string) => `ਲਗਾਖਰ ‘${name}’ ਕਿੰਨੀਆਂ ਲਗਾਂ ਨਾਲ ਲੱਗਦਾ/ਲੱਗਦੀ ਹੈ?`,
  (name: string) => `ਗੁਰਮੁਖੀ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ‘${name}’ ਨਾਲ ਕਿੰਨੀਆਂ ਲਗਾਂ ਜੁੜ ਸਕਦੀਆਂ ਹਨ?`,
  (name: string) => `‘${name}’ ਲਗਾਖਰ ਦੀ ਵਰਤੋਂ ਕਿੰਨੀਆਂ ਲਗਾਂ-ਮਾਤਰਾਂ ਨਾਲ ਜਾਇਜ਼ ਹੈ?`,
];

const CP001_F03_HARD_WORD = [
  (word: string) => `ਵਿਆਕਰਨਿਕ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ਆਏ ਲਗਾਖਰ ਦਾ ਨਾਮ ਦੱਸੋ:`,
  (word: string) => `ਲਿਪੀ ਨੇਮਾਂ ਮੁਤਾਬਕ ‘${word}’ ਵਿੱਚ ਪ੍ਰਯੋਗ ਕੀਤੇ ਲਗਾਖਰ ਦੀ ਸ਼੍ਰੇਣੀ ਦੱਸੋ:`,
  (word: string) => `ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਪਰਖ: ‘${word}’ ਵਿੱਚ ਕਿਹੜਾ ਲਗਾਖਰ ਨਿਯਮ ਅਨੁਸਾਰ ਆਇਆ ਹੈ?`,
];

const CP001_F03_HARD_BINDI = [
  "ਹੇਠ ਲਿਖੀਆਂ ਲਗਾਂ ਵਿੱਚੋਂ ਕਿਸ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ‘ਬਿੰਦੀ’ ਦੀ ਵਰਤੋਂ ਹੁੰਦੀ ਹੈ (ਟਿੱਪੀ ਦੀ ਨਹੀਂ)?",
  "ਕਿਹੜੀ ਲਗ ਨਾਲ ਨਾਸਕੀ ਸੁਰ ਪ੍ਰਗਟਾਉਣ ਲਈ ਲਾਜ਼ਮੀ ਤੌਰ 'ਤੇ ‘ਬਿੰਦੀ’ ਲੱਗਦੀ ਹੈ?",
  "ਦੀਰਘ ਲਗਾਂ ਅਨੁਸਾਰ ਕਿਸ ਮਾਤਰਾ ਨਾਲ ਬਿੰਦੀ ਲਗਾਈ ਜਾਂਦੀ ਹੈ?",
];

const CP001_F03_HARD_TIPPI = [
  "ਹੇਠ ਲਿਖੀਆਂ ਲਗਾਂ ਵਿੱਚੋਂ ਕਿਸ ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਪ੍ਰਗਟ ਕਰਨ ਲਈ ‘ਟਿੱਪੀ’ ਲੱਗਦੀ ਹੈ?",
  "ਲਘੂ ਲਗਾਂ ਦੇ ਨਿਯਮ ਅਨੁਸਾਰ ਕਿਸ ਮਾਤਰਾ ਨਾਲ ਟਿੱਪੀ ਦੀ ਵਰਤੋਂ ਹੁੰਦੀ ਹੈ?",
  "ਕਿਹੜੀ ਲਗ-ਮਾਤਰਾ ਨਾਲ ਨਾਸਕਤਾ ਲਈ ਟਿੱਪੀ ਲਗਾਉਣਾ ਵਿਆਕਰਨਿਕ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ?",
];

export function generateCP001F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  if (difficulty === "Easy") {
    const subType = rng.pickOne(["WORD_LAGAKHAR_EASY", "TOTAL_LAGAKHAR", "ADDAK_FUNCTION"]);

    if (subType === "WORD_LAGAKHAR_EASY") {
      const item = rng.pickOne(LAGAKHAR_WORD_ITEMS);
      const distractors = ["ਬਿੰਦੀ", "ਟਿੱਪੀ", "ਅੱਧਕ", "ਮੁਕਤਾ"].filter(
        (d) => d !== item.expectedLagakhar
      );
      const stem = rng.pickOne(CP001_F03_EASY_WORD)(item.word);
      return assembleQuestion({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer: item.expectedLagakhar,
        distractors,
        explanation: item.explanation,
        authorityIds: ["PUN-AUTH-LAGAKHAR-003"],
      });
    }

    if (subType === "TOTAL_LAGAKHAR") {
      const stem = rng.pickOne(CP001_F03_EASY_TOTAL);
      return assembleQuestion({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer: "3",
        distractors: ["2", "4", "5", "10"],
        explanation: "ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ 3 ਲਗਾਖਰ ਹਨ: ਬਿੰਦੀ (ਂ), ਟਿੱਪੀ (ੰ), ਅਤੇ ਅੱਧਕ (ੱ)। ਇਹ ਲਗਾਂ ਦੇ ਨਾਲ ਸਹਾਇਕ ਚਿੰਨ੍ਹਾਂ ਵਜੋਂ ਵਰਤੇ ਜਾਂਦੇ ਹਨ।",
        authorityIds: ["PUN-AUTH-LAGAKHAR-001"],
      });
    }

    // ADDAK_FUNCTION
    const stem = rng.pickOne(CP001_F03_EASY_ADDAK);
    return assembleQuestion({
      familyId: "F03",
      seed,
      difficulty,
      stem,
      correctAnswer: "ਅੱਧਕ",
      distractors: ["ਬਿੰਦੀ", "ਟਿੱਪੀ", "ਸਿਹਾਰੀ", "ਹੋੜਾ"],
      explanation: "ਅੱਧਕ (ੱ) ਦਬਾਅ ਜਾਂ ਬਲ ਦਾ ਚਿੰਨ੍ਹ ਹੈ। ਜਿਸ ਅੱਖਰ ਦੀ ਆਵਾਜ਼ ਦੂਹਰੀ ਕਰਨੀ ਹੋਵੇ, ਉਸ ਤੋਂ ਪਹਿਲੇ ਅੱਖਰ ਉੱਤੇ ਅੱਧਕ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ।",
      authorityIds: ["PUN-AUTH-LAGAKHAR-002"],
    });
  }

  if (difficulty === "Medium") {
    const subType = rng.pickOne(["WORD_LAGAKHAR_MED", "LAGAKHAR_COUNT"]);

    if (subType === "WORD_LAGAKHAR_MED") {
      const item = rng.pickOne(LAGAKHAR_WORD_ITEMS);
      const distractors = ["ਬਿੰਦੀ", "ਟਿੱਪੀ", "ਅੱਧਕ", "ਮੁਕਤਾ"].filter(
        (d) => d !== item.expectedLagakhar
      );
      const stem = rng.pickOne(CP001_F03_MED_WORD)(item.word);
      return assembleQuestion({
        familyId: "F03",
        seed,
        difficulty,
        stem,
        correctAnswer: item.expectedLagakhar,
        distractors,
        explanation: item.explanation,
        authorityIds: ["PUN-AUTH-LAGAKHAR-003"],
      });
    }

    // LAGAKHAR_COUNT
    const lagakhar = rng.pickOne(LAGAKHAR_RULES);
    const stem = rng.pickOne(CP001_F03_MED_COUNT)(lagakhar.namePa);
    return assembleQuestion({
      familyId: "F03",
      seed,
      difficulty,
      stem,
      correctAnswer: String(lagakhar.laganCount),
      distractors: ["2", "4", "5", "6", "8", "3"].filter(
        (n) => n !== String(lagakhar.laganCount)
      ),
      explanation: lagakhar.explanationPa,
      authorityIds: ["PUN-AUTH-LAGAKHAR-003"],
    });
  }

  // Hard
  const subType = rng.pickOne(["WORD_LAGAKHAR_HARD", "BINDI_ALLOWED", "TIPPI_ALLOWED"]);

  if (subType === "WORD_LAGAKHAR_HARD") {
    const item = rng.pickOne(LAGAKHAR_WORD_ITEMS);
    const distractors = ["ਬਿੰਦੀ", "ਟਿੱਪੀ", "ਅੱਧਕ", "ਮੁਕਤਾ"].filter(
      (d) => d !== item.expectedLagakhar
    );
    const stem = rng.pickOne(CP001_F03_HARD_WORD)(item.word);
    return assembleQuestion({
      familyId: "F03",
      seed,
      difficulty,
      stem,
      correctAnswer: item.expectedLagakhar,
      distractors,
      explanation: item.explanation,
      authorityIds: ["PUN-AUTH-LAGAKHAR-003"],
    });
  }

  const bindiLagan = ["ਕੰਨਾ", "ਬਿਹਾਰੀ", "ਲਾਂ", "ਦੁਲਾਵਾਂ", "ਹੋੜਾ", "ਕਨੌੜਾ"];
  const tippiLagan = ["ਮੁਕਤਾ", "ਸਿਹਾਰੀ", "ਔਂਕੜ", "ਦੁਲੈਂਕੜ"];

  if (subType === "BINDI_ALLOWED") {
    const correctMatra = rng.pickOne(bindiLagan);
    const distractors = rng.pickDistinct(tippiLagan, 3);
    const stem = rng.pickOne(CP001_F03_HARD_BINDI);
    return assembleQuestion({
      familyId: "F03",
      seed,
      difficulty,
      stem,
      correctAnswer: correctMatra,
      distractors,
      explanation: `‘${correctMatra}’ ਨਾਲ ਹਮੇਸ਼ਾ ਬਿੰਦੀ (ਂ) ਦੀ ਵਰਤੋਂ ਹੁੰਦੀ ਹੈ। ਗੁਰਮੁਖੀ ਵਿੱਚ 6 ਲਗਾਂ (ਕੰਨਾ, ਬਿਹਾਰੀ, ਲਾਂ, ਦੁਲਾਵਾਂ, ਹੋੜਾ, ਕਨੌੜਾ) ਨਾਲ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ।`,
      authorityIds: ["PUN-AUTH-LAGAKHAR-004"],
    });
  }

  // TIPPI_ALLOWED
  const correctMatra = rng.pickOne(tippiLagan);
  const distractors = rng.pickDistinct(bindiLagan, 3);
  const stem = rng.pickOne(CP001_F03_HARD_TIPPI);
  return assembleQuestion({
    familyId: "F03",
    seed,
    difficulty,
    stem,
    correctAnswer: correctMatra,
    distractors,
    explanation: `‘${correctMatra}’ ਲਘੂ ਲਗ ਹੈ ਅਤੇ ਇਸ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਟਿੱਪੀ (ੰ) ਲੱਗਦੀ ਹੈ। ਮੁਕਤਾ, ਸਿਹਾਰੀ, ਔਂਕੜ ਅਤੇ ਦੁਲੈਂਕੜ ਨਾਲ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ।`,
    authorityIds: ["PUN-AUTH-LAGAKHAR-005"],
  });
}
