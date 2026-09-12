/**
 * CP014 Question Families:
 * CP014-F01: Passage Factual Retrieval (ਪਾਠ-ਬੋਧ - ਤੱਥ ਆਧਾਰਿਤ ਪ੍ਰਸ਼ਨ)
 * CP014-F02: Passage Inferential & Title (ਪਾਠ-ਬੋਧ - ਭਾਵ-ਅਰਥ ਅਤੇ ਸਿਰਲੇਖ)
 * CP014-F03: Official Administrative Translation (ਪ੍ਰਬੰਧਕੀ ਅਤੇ ਦਫ਼ਤਰੀ ਸ਼ਬਦਾਵਲੀ)
 * CP014-F04: Contextual Administrative Usage (ਪ੍ਰਬੰਧਕੀ ਪ੍ਰਸੰਗ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  CP014_ADMIN_TERMS,
  CP014_PASSAGES,
  type AdministrativeTranslationItem,
  type ReadingPassageItem,
} from "./CP014-authorities";

function assembleCP014Question(input: {
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
    new Set(
      input.distractors
        .map((d) => d.trim())
        .filter((d) => d.length > 0 && d !== input.correctAnswer.trim())
    )
  );
  if (filteredDistractors.length < 3) {
    throw new Error(
      `Insufficient distinct distractors for CP014 ${input.familyId}. Got ${filteredDistractors.length}`
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
    id: `PUN-001-CP014-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP014",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP014-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

// -----------------------------------------------------------------------------
// TEMPLATES: F01 (Factual Retrieval)
// -----------------------------------------------------------------------------

const CP014_F01_EASY_TEMPLATES = [
  (txt: string, q: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਪੈਰੇ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ ਅਤੇ ਪੁੱਛੇ ਗਏ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
  (txt: string, q: string) => `ਦਿੱਤੇ ਗਏ ਸਰਲ ਗਦ-ਟੁਕੜੇ (ਪੈਰੇ) ਨੂੰ ਪੜ੍ਹ ਕੇ ਸਹੀ ਉੱਤਰ ਦੀ ਚੋਣ ਕਰੋ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
];

const CP014_F01_MED_TEMPLATES = [
  (txt: string, q: string) => `ਪਾਠ-ਬੋਧ ਆਧਾਰਿਤ ਪ੍ਰਸ਼ਨ ਦਾ ਢੁਕਵਾਂ ਉੱਤਰ ਚੁਣੋ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
  (txt: string, q: string) => `ਹੇਠ ਲਿਖੇ ਪੈਰੇ ਦੇ ਮੁੱਖ ਤੱਥਾਂ ਅਨੁਸਾਰ ਸਹੀ ਵਿਕਲਪ ਦੱਸੋ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
];

const CP014_F01_HARD_TEMPLATES = [
  (txt: string, q: string) => `ਪੰਜਾਬੀ ਪਾਠ-ਬੋਧ ਪਰਖ: ਹੇਠ ਲਿਖੇ ਪੈਰੇ ਨੂੰ ਵਿਚਾਰਦੇ ਹੋਏ ਪ੍ਰਸ਼ਨ ਦਾ ਸਟੀਕ ਉੱਤਰ ਚੁਣੋ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
  (txt: string, q: string) => `ਦਿੱਤੇ ਗਏ ਗੁੰਝਲਦਾਰ ਪੈਰੇ ਦੀ ਗੰਭੀਰ ਪੜ੍ਹਤ ਉਪਰੰਤ ਪੁੱਛੇ ਗਏ ਪ੍ਰਸ਼ਨ ਦਾ ਸ਼ੁੱਧ ਉੱਤਰ ਦਿਓ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
];

// -----------------------------------------------------------------------------
// TEMPLATES: F02 (Inferential & Title)
// -----------------------------------------------------------------------------

const CP014_F02_EASY_TEMPLATES = [
  (txt: string, q: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਪੈਰੇ ਦੇ ਆਧਾਰ 'ਤੇ ਢੁਕਵਾਂ ਉੱਤਰ ਚੁਣੋ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
  (txt: string, q: string) => `ਦਿੱਤੇ ਗਏ ਪੈਰੇ ਨੂੰ ਸਮਝ ਕੇ ਪੁੱਛੇ ਗਏ ਸਵਾਲ ਦਾ ਸਹੀ ਜਵਾਬ ਦਿਓ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
];

const CP014_F02_MED_TEMPLATES = [
  (txt: string, q: string) => `ਦਿੱਤੇ ਗਏ ਪੈਰੇ ਵਿੱਚੋਂ ਭਾਵ-ਅਰਥ ਜਾਂ ਸਿਰਲੇਖ ਦੀ ਪਛਾਣ ਕਰੋ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
  (txt: string, q: string) => `ਪੈਰੇ ਦੀਆਂ ਅੰਤਰੀਵੀ ਸਤਰਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਕੇ ਢੁਕਵਾਂ ਉੱਤਰ ਚੁਣੋ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
];

const CP014_F02_HARD_TEMPLATES = [
  (txt: string, q: string) => `ਪੈਰੇ ਦੇ ਡੂੰਘੇ ਭਾਵ-ਅਰਥ ਅਤੇ ਕੇਂਦਰੀ ਵਿਚਾਰ ਦਾ ਆਲੋਚਨਾਤਮਕ ਮੁਲਾਂਕਣ ਕਰਕੇ ਉੱਤਰ ਦਿਓ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
  (txt: string, q: string) => `ਸੰਦਰਭੀ ਸਮਝ ਅਤੇ ਅਪ੍ਰਤੱਖ ਸੰਕੇਤਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਸਹੀ ਵਿਕਲਪ ਦੀ ਪਛਾਣ ਕਰੋ:

"${txt}"

ਪ੍ਰਸ਼ਨ: ${q}`,
];

// -----------------------------------------------------------------------------
// TEMPLATES: F03 (Administrative Translation)
// -----------------------------------------------------------------------------

const CP014_EN_TO_PA_EASY_TEMPLATES = [
  (term: string) => `ਅੰਗਰੇਜ਼ੀ ਪ੍ਰਬੰਧਕੀ ਪਦ ‘${term}’ ਦਾ ਸਹੀ ਅਤੇ ਮਿਆਰੀ ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਚੁਣੋ:`,
  (term: string) => `ਸਰਲ ਦਫ਼ਤਰੀ ਸ਼ਬਦਾਵਲੀ ਅਨੁਸਾਰ ‘${term}’ ਦਾ ਪੰਜਾਬੀ ਰੂਪ ਕੀ ਹੋਵੇਗਾ?`,
  (term: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ‘${term}’ ਦਾ ਢੁਕਵਾਂ ਪੰਜਾਬੀ ਅਰਥ ਦੱਸੋ:`,
];

const CP014_EN_TO_PA_MED_TEMPLATES = [
  (term: string) => `ਪੰਜਾਬ ਸਰਕਾਰੀ ਦਫ਼ਤਰੀ ਕੰਮਕਾਜ ਅਨੁਸਾਰ ਹੇਠ ਲਿਖੇ ਅੰਗਰੇਜ਼ੀ ਪ੍ਰਬੰਧਕੀ ਸ਼ਬਦ ਦਾ ਢੁਕਵਾਂ ਪੰਜਾਬੀ ਰੂਪ ਕਿਹੜਾ ਹੈ?
'${term}'`,
  (term: string) => `ਦਫ਼ਤਰੀ ਸ਼ਬਦਾਵਲੀ ਅਨੁਸਾਰ ‘${term}’ ਦਾ ਸਹੀ ਪੰਜਾਬੀ ਬਦਲ ਕਿਹੜਾ ਹੈ?`,
  (term: string) => `ਸਰਕਾਰੀ ਦਸਤਾਵੇਜ਼ਾਂ ਵਿੱਚ ਵਰਤੇ ਜਾਂਦੇ ਪਦ ‘${term}’ ਦਾ ਪ੍ਰਮਾਣਿਕ ਪੰਜਾਬੀ ਸਮਾਨਾਰਥੀ ਚੁਣੋ:`,
];

const CP014_EN_TO_PA_HARD_TEMPLATES = [
  (term: string) => `ਪ੍ਰਬੰਧਕੀ ਸੇਵਾਵਾਂ (PPSC/PSSSB) ਮਿਆਰ ਅਨੁਸਾਰ ਅੰਗਰੇਜ਼ੀ ਤਕਨੀਕੀ ਪਦ ‘${term}’ ਦਾ ਪ੍ਰਮਾਣਿਕ ਪੰਜਾਬੀ ਸਮਾਨਾਰਥੀ ਦੱਸੋ:`,
  (term: string) => `ਦਫ਼ਤਰੀ ਕਾਨੂੰਨੀ ਅਤੇ ਪ੍ਰਬੰਧਕੀ ਨਿਯਮਾਵਲੀ ਮੁਤਾਬਕ ‘${term}’ ਲਈ ਨਿਰਧਾਰਿਤ ਪੰਜਾਬੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  (term: string) => `ਰਾਜ ਪ੍ਰਸ਼ਾਸਨਿਕ ਸ਼ਬਦ-ਕੋਸ਼ ਅਨੁਸਾਰ ‘${term}’ ਦਾ ਅਧਿਕਾਰਤ ਪੰਜਾਬੀ ਪਾਰਿਭਾਸ਼ਿਕ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
];

const CP014_PA_TO_EN_EASY_TEMPLATES = [
  (term: string) => `ਦਫ਼ਤਰੀ ਪੰਜਾਬੀ ਸ਼ਬਦ ‘${term}’ ਲਈ ਢੁਕਵਾਂ ਅੰਗਰੇਜ਼ੀ ਪ੍ਰਬੰਧਕੀ ਪਦ (Term) ਚੁਣੋ:`,
  (term: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਪੰਜਾਬੀ ਸ਼ਬਦ ‘${term}’ ਦਾ ਸਹੀ ਅੰਗਰੇਜ਼ੀ ਅਨੁਵਾਦ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
  (term: string) => `ਸਰਲ ਪ੍ਰਬੰਧਕੀ ਅਨੁਵਾਦ: ‘${term}’ ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਕੀ ਆਖਿਆ ਜਾਂਦਾ ਹੈ?`,
];

const CP014_PA_TO_EN_MED_TEMPLATES = [
  (term: string) => `ਪ੍ਰਬੰਧਕੀ ਪ੍ਰੀਖਿਆਵਾਂ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਹੇਠ ਲਿਖੇ ਪੰਜਾਬੀ ਦਫ਼ਤਰੀ ਸ਼ਬਦ ਦਾ ਮਿਆਰੀ ਅੰਗਰੇਜ਼ੀ ਸਮਾਨਾਰਥੀ ਚੁਣੋ:
'${term}'`,
  (term: string) => `ਸਰਕਾਰੀ ਪੱਤਰ-ਵਿਹਾਰ ਵਿੱਚ ਵਰਤੇ ਜਾਂਦੇ ਪੰਜਾਬੀ ਪਦ ‘${term}’ ਦਾ ਅੰਗਰੇਜ਼ੀ ਬਰਾਬਰਤਾ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  (term: string) => `ਦਫ਼ਤਰੀ ਕਾਰਜ-ਪ੍ਰਣਾਲੀ ਅਨੁਸਾਰ ਪੰਜਾਬੀ ਸ਼ਬਦ ‘${term}’ ਦਾ ਸਟੀਕ ਅੰਗਰੇਜ਼ੀ ਬਦਲ ਦੱਸੋ:`,
];

const CP014_PA_TO_EN_HARD_TEMPLATES = [
  (term: string) => `ਉੱਚ-ਪੱਧਰੀ ਪ੍ਰਬੰਧਕੀ ਸ਼ਬਦਾਵਲੀ ਕੋਸ਼ ਅਨੁਸਾਰ ਪੰਜਾਬੀ ਸ਼ਬਦ ‘${term}’ ਦਾ ਅਧਿਕਾਰਤ ਅੰਗਰੇਜ਼ੀ ਬਦਲ ਦੱਸੋ:`,
  (term: string) => `ਰਾਜ ਪ੍ਰਬੰਧ ਵਿੱਚ ਦਰਜ ਪੰਜਾਬੀ ਸ਼ਬਦ ‘${term}’ ਲਈ ਮਾਨਤਾ-ਪ੍ਰਾਪਤ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਦੀ ਪਛਾਣ ਕਰੋ:`,
  (term: string) => `ਪ੍ਰਸ਼ਾਸਕੀ ਨਿਯਮਾਂ ਅਤੇ ਕਾਨੂੰਨੀ ਗਜ਼ਟ ਅਨੁਸਾਰ ਪੰਜਾਬੀ ਪਦ ‘${term}’ ਦਾ ਪ੍ਰਮਾਣਿਕ ਅੰਗਰੇਜ਼ੀ ਪਾਰਿਭਾਸ਼ਿਕ ਰੂਪ ਚੁਣੋ:`,
];

// -----------------------------------------------------------------------------
// TEMPLATES: F04 (Contextual Administrative Usage)
// -----------------------------------------------------------------------------

const OFFICIAL_DEPARTMENTS = [
  "ਪੰਜਾਬ ਲੋਕ ਸੇਵਾ ਕਮਿਸ਼ਨ (PPSC)",
  "ਪੰਜਾਬ ਅਧੀਨ ਸੇਵਾਵਾਂ ਚੋਣ ਬੋਰਡ (PSSSB)",
  "ਮਾਲ ਅਤੇ ਮੁੜ-ਵਸੇਬਾ ਵਿਭਾਗ (Department of Revenue)",
  "ਵਿੱਤ ਵਿਭਾਗ, ਪੰਜਾਬ ਸਰਕਾਰ (Department of Finance)",
  "ਗ੍ਰਹਿ ਮਾਮਲੇ ਅਤੇ ਨਿਆਂ ਵਿਭਾਗ (Home Affairs & Justice)",
  "ਸਕੂਲ ਸਿੱਖਿਆ ਵਿਭਾਗ (Department of School Education)",
  "ਸਥਾਨਕ ਸਰਕਾਰਾਂ ਵਿਭਾਗ (Local Government)",
  "ਕਰ ਅਤੇ ਆਬਕਾਰੀ ਵਿਭਾਗ (Excise & Taxation)",
  "ਪੰਜਾਬ ਮੰਡੀ ਬੋਰਡ (Punjab Mandi Board)",
  "ਪੰਜਾਬ ਰਾਜ ਪਾਵਰ ਕਾਰਪੋਰੇਸ਼ਨ (PSPCL)",
];

const CP014_F04_EASY_TEMPLATES = [
  (dept: string, term: string) =>
    `${dept} ਵੱਲੋਂ ਜਾਰੀ ਸਰਲ ਨੋਟੀਫਿਕੇਸ਼ਨ ਵਿੱਚ ਵਰਤੇ ਗਏ ਸ਼ਬਦ ‘${term}’ ਦਾ ਸਹੀ ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਕੀ ਹੈ?`,
  (dept: string, term: string) =>
    `ਸਰਕਾਰੀ ਦਫ਼ਤਰੀ ਕਾਰਵਾਈ (${dept}) ਦੌਰਾਨ ਦਰਜ ਪਦ ‘${term}’ ਦਾ ਮਿਆਰੀ ਪੰਜਾਬੀ ਬਦਲ ਚੁਣੋ:`,
  (dept: string, term: string) =>
    `${dept} ਦੇ ਪੱਤਰ-ਵਿਹਾਰ ਵਿੱਚ ਆਏ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ‘${term}’ ਲਈ ਢੁਕਵਾਂ ਪੰਜਾਬੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
];

const CP014_F04_MED_TEMPLATES = [
  (dept: string, term: string) =>
    `${dept} ਵੱਲੋਂ ਜਾਰੀ ਅਧਿਕਾਰਤ ਨੋਟੀਫਿਕੇਸ਼ਨ ਵਿੱਚ ਵਰਤੇ ਗਏ ਸ਼ਬਦ ‘${term}’ ਦਾ ਸਹੀ ਪ੍ਰਬੰਧਕੀ ਅਰਥ ਜਾਂ ਅਨੁਵਾਦ ਕੀ ਹੈ?`,
  (dept: string, term: string) =>
    `${dept} ਦੇ ਸਰਕਾਰੀ ਪੱਤਰ-ਵਿਹਾਰ ਵਿੱਚ ਆਏ ਅੰਗਰੇਜ਼ੀ ਪ੍ਰਬੰਧਕੀ ਪਦ ‘${term}’ ਲਈ ਢੁਕਵਾਂ ਪੰਜਾਬੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
  (dept: string, term: string) =>
    `ਪ੍ਰਬੰਧਕੀ ਨਿਯਮਾਵਲੀ (${dept}) ਅਨੁਸਾਰ ਹੇਠ ਲਿਖੇ ਸ਼ਬਦ ‘${term}’ ਦੀ ਸਹੀ ਵਰਤੋਂ ਅਤੇ ਅਨੁਵਾਦ ਦੱਸੋ:`,
];

const CP014_F04_HARD_TEMPLATES = [
  (dept: string, term: string) =>
    `${dept} ਦੇ ਵਿਸ਼ੇਸ਼ ਗਜ਼ਟ ਅਤੇ ਅਧਿਕਾਰਤ ਨਿਯਮਾਵਲੀ ਵਿੱਚ ਪ੍ਰਯੋਗ ਕੀਤੇ ਅੰਗਰੇਜ਼ੀ ਪ੍ਰਬੰਧਕੀ ਪਦ ‘${term}’ ਦਾ ਵਿਧਾਨਕ ਪੰਜਾਬੀ ਰੂਪ ਚੁਣੋ:`,
  (dept: string, term: string) =>
    `ਸਰਕਾਰੀ ਦਫ਼ਤਰੀ ਹੁਕਮਾਂ (${dept}) ਵਿੱਚ ਦਰਜ ਤਕਨੀਕੀ ਪਦ ‘${term}’ ਦਾ ਸਰਕਾਰੀ ਕੋਸ਼ ਅਨੁਸਾਰ ਸ਼ੁੱਧ ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
  (dept: string, term: string) =>
    `ਰਾਜ ਸਰਕਾਰ ਦੀ ਉੱਚ-ਪੱਧਰੀ ਕਾਰਜ-ਵਿਧੀ (${dept}) ਤਹਿਤ ਪਦ ‘${term}’ ਦਾ ਮਾਨਤਾ-ਪ੍ਰਾਪਤ ਪੰਜਾਬੀ ਬਦਲ ਕਿਹੜਾ ਹੈ?`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Passage Factual Retrieval (ਤੱਥ ਆਧਾਰਿਤ ਪ੍ਰਸ਼ਨ)
// -------------------------------------------------------------------------

export function generateCP014_F01(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium"
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const passage: ReadingPassageItem = rng.pickOne(CP014_PASSAGES);

  const factualQuestions = passage.questions.filter((q) => q.type === "factual");
  const selectedQuestion = rng.pickOne(factualQuestions);

  const templatePool =
    difficulty === "Easy"
      ? CP014_F01_EASY_TEMPLATES
      : difficulty === "Hard"
      ? CP014_F01_HARD_TEMPLATES
      : CP014_F01_MED_TEMPLATES;

  const stemTemplate = rng.pickOne(templatePool);
  const stem = stemTemplate(passage.textPa, selectedQuestion.questionStem);

  return assembleCP014Question({
    familyId: "F01",
    seed,
    difficulty,
    stem,
    correctAnswer: selectedQuestion.correctAnswer,
    distractors: selectedQuestion.distractors,
    explanation: selectedQuestion.explanationPa,
    authorityIds: [passage.id, selectedQuestion.qId],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: Passage Inferential & Title (ਭਾਵ-ਅਰਥ ਅਤੇ ਸਿਰਲੇਖ)
// -------------------------------------------------------------------------

export function generateCP014_F02(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium"
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const passage: ReadingPassageItem = rng.pickOne(CP014_PASSAGES);

  const inferentialOrTitleQuestions = passage.questions.filter(
    (q) => q.type === "inferential" || q.type === "title"
  );
  const selectedQuestion = rng.pickOne(inferentialOrTitleQuestions);

  const templatePool =
    difficulty === "Easy"
      ? CP014_F02_EASY_TEMPLATES
      : difficulty === "Hard"
      ? CP014_F02_HARD_TEMPLATES
      : CP014_F02_MED_TEMPLATES;

  const stemTemplate = rng.pickOne(templatePool);
  const stem = stemTemplate(passage.textPa, selectedQuestion.questionStem);

  return assembleCP014Question({
    familyId: "F02",
    seed,
    difficulty,
    stem,
    correctAnswer: selectedQuestion.correctAnswer,
    distractors: selectedQuestion.distractors,
    explanation: selectedQuestion.explanationPa,
    authorityIds: [passage.id, selectedQuestion.qId],
  });
}

// -------------------------------------------------------------------------
// FAMILY 3: Official Administrative Translation (ਪ੍ਰਬੰਧਕੀ ਸ਼ਬਦਾਵਲੀ)
// -------------------------------------------------------------------------

export function generateCP014_F03(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium"
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const item: AdministrativeTranslationItem = rng.pickOne(CP014_ADMIN_TERMS);

  const isEnglishToPunjabi = rng.next() > 0.3;

  if (isEnglishToPunjabi) {
    const templatePool =
      difficulty === "Easy"
        ? CP014_EN_TO_PA_EASY_TEMPLATES
        : difficulty === "Hard"
        ? CP014_EN_TO_PA_HARD_TEMPLATES
        : CP014_EN_TO_PA_MED_TEMPLATES;

    const stemTemplate = rng.pickOne(templatePool);

    return assembleCP014Question({
      familyId: "F03",
      seed,
      difficulty,
      stem: stemTemplate(item.englishTerm),
      correctAnswer: item.punjabiTerm,
      distractors: item.distractors,
      explanation: `${item.explanationPa} ਇਸ ਲਈ '${item.englishTerm}' ਦਾ ਸਹੀ ਰੂਪ '${item.punjabiTerm}' ਹੈ।`,
      authorityIds: [item.id, "PUN-ADMIN-EN-PA-01"],
    });
  } else {
    // Punjabi to English
    const otherEnglishTerms = CP014_ADMIN_TERMS.filter(
      (t) => t.id !== item.id && t.englishTerm !== item.englishTerm
    ).map((t) => t.englishTerm);

    const templatePool =
      difficulty === "Easy"
        ? CP014_PA_TO_EN_EASY_TEMPLATES
        : difficulty === "Hard"
        ? CP014_PA_TO_EN_HARD_TEMPLATES
        : CP014_PA_TO_EN_MED_TEMPLATES;

    const stemTemplate = rng.pickOne(templatePool);

    return assembleCP014Question({
      familyId: "F03",
      seed,
      difficulty,
      stem: stemTemplate(item.punjabiTerm),
      correctAnswer: item.englishTerm,
      distractors: otherEnglishTerms,
      explanation: `${item.explanationPa} ਇਸ ਲਈ '${item.punjabiTerm}' ਲਈ ਮਿਆਰੀ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ '${item.englishTerm}' ਹੈ।`,
      authorityIds: [item.id, "PUN-ADMIN-PA-EN-01"],
    });
  }
}

// -------------------------------------------------------------------------
// FAMILY 4: Contextual In-Sentence Administrative Usage (ਪ੍ਰਬੰਧਕੀ ਪ੍ਰਸੰਗ)
// -------------------------------------------------------------------------

export function generateCP014_F04(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium"
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const item: AdministrativeTranslationItem = rng.pickOne(CP014_ADMIN_TERMS);
  const dept = rng.pickOne(OFFICIAL_DEPARTMENTS);

  const templatePool =
    difficulty === "Easy"
      ? CP014_F04_EASY_TEMPLATES
      : difficulty === "Hard"
      ? CP014_F04_HARD_TEMPLATES
      : CP014_F04_MED_TEMPLATES;

  const stemTemplate = rng.pickOne(templatePool);

  return assembleCP014Question({
    familyId: "F04",
    seed,
    difficulty,
    stem: stemTemplate(dept, item.englishTerm),
    correctAnswer: item.punjabiTerm,
    distractors: item.distractors,
    explanation: `${item.explanationPa} ਇਸ ਲਈ '${item.englishTerm}' ਦਾ ਅਧਿਕਾਰਤ ਪੰਜਾਬੀ ਅਨੁਵਾਦ '${item.punjabiTerm}' ਹੈ।`,
    authorityIds: [item.id, "PUN-ADMIN-CTX-01"],
  });
}

// -------------------------------------------------------------------------
// FAMILY 5: Summary & Heading Matching (ਸਿਰਲੇਖ ਅਤੇ ਸੰਖੇਪ ਸਾਰ ਚੋਣ)
// -------------------------------------------------------------------------

const CP014_F05_EASY_TEMPLATES = [
  (txt: string) => `ਹੇਠ ਲਿਖੇ ਪੈਰੇ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹ ਕੇ ਇਸ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਸਿਰਲੇਖ (Heading/Title) ਚੁਣੋ:

"${txt}"`,
  (txt: string) => `ਦਿੱਤੇ ਗਏ ਪੈਰੇ ਦੀ ਕੇਂਦਰੀ ਭਾਵਨਾ ਨੂੰ ਦਰਸਾਉਂਦਾ ਢੁਕਵਾਂ ਸਿਰਲੇਖ ਕਿਹੜਾ ਹੈ?

"${txt}"`,
];

const CP014_F05_MED_TEMPLATES = [
  (txt: string) => `ਪਾਠ-ਬੋਧ ਵਿਸ਼ਲੇਸ਼ਣ: ਹੇਠਾਂ ਦਿੱਤੇ ਪੈਰੇ ਲਈ ਸਭ ਤੋਂ ਸਟੀਕ ਅਤੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਸਿਰਲੇਖ ਕਿਹੜਾ ਹੋਵੇਗਾ?

"${txt}"`,
  (txt: string) => `ਹੇਠ ਲਿਖੇ ਪੈਰੇ ਦਾ ਮੁੱਖ ਵਿਸ਼ਾ-ਵਸਤੂ ਦੱਸਦਾ ਉੱਤਮ ਸਿਰਲੇਖ ਚੁਣੋ:

"${txt}"`,
];

const CP014_F05_HARD_TEMPLATES = [
  (txt: string) => `ਪ੍ਰੀਖਿਆ ਪੱਧਰ 'ਤੇ ਗੰਭੀਰ ਮੁਲਾਂਕਣ ਕਰੋ: ਦਿੱਤੇ ਗਏ ਪੈਰੇ ਦੇ ਸਮੁੱਚੇ ਸੰਦੇਸ਼ ਨੂੰ ਸੰਖੇਪ ਰੂਪ ਵਿੱਚ ਪ੍ਰਗਟਾਉਂਦਾ ਸਿਰਲੇਖ ਕਿਹੜਾ ਹੈ?

"${txt}"`,
  (txt: string) => `ਹੇਠਾਂ ਦਰਜ ਵਿਸਤ੍ਰਿਤ ਪੈਰੇ ਦੇ ਕੇਂਦਰੀ ਧੁਰੇ ਅਤੇ ਵਿਸ਼ੇ ਦੀ ਪ੍ਰਤੀਨਿਧਤਾ ਕਰਦਾ ਸਿਰਲੇਖ ਚੁਣੋ:

"${txt}"`,
];

export function generateCP014_F05(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium"
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);
  const passage: ReadingPassageItem = rng.pickOne(CP014_PASSAGES);

  const titleQuestions = passage.questions.filter((q) => q.type === "title" || q.type === "summary");

  if (titleQuestions.length > 0 && rng.next() > 0.4) {
    const qItem = rng.pickOne(titleQuestions);
    const stem = `ਹੇਠ ਦਿੱਤੇ ਪੈਰੇ ਨੂੰ ਪੜ੍ਹ ਕੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ:\n\n"${passage.textPa}"\n\nਪ੍ਰਸ਼ਨ: ${qItem.questionStem}`;
    return assembleCP014Question({
      familyId: "F05",
      seed,
      difficulty,
      stem,
      correctAnswer: qItem.correctAnswer,
      distractors: qItem.distractors,
      explanation: qItem.explanationPa,
      authorityIds: [passage.id, qItem.qId],
    });
  }

  const templatePool =
    difficulty === "Easy"
      ? CP014_F05_EASY_TEMPLATES
      : difficulty === "Hard"
      ? CP014_F05_HARD_TEMPLATES
      : CP014_F05_MED_TEMPLATES;

  const stemTemplate = rng.pickOne(templatePool);
  const stem = stemTemplate(passage.textPa);

  const otherTitles = CP014_PASSAGES.filter((p) => p.id !== passage.id).map((p) => p.title);

  return assembleCP014Question({
    familyId: "F05",
    seed,
    difficulty,
    stem,
    correctAnswer: passage.title,
    distractors: otherTitles,
    explanation: `ਇਸ ਪੈਰੇ ਦਾ ਸਮੁੱਚਾ ਕੇਂਦਰੀ ਭਾਵ ‘${passage.title}’ ਦੇ ਦੁਆਲੇ ਘੁੰਮਦਾ ਹੈ, ਇਸ ਲਈ ਇਹੋ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਸਿਰਲੇਖ ਹੈ।`,
    authorityIds: [passage.id],
  });
}

