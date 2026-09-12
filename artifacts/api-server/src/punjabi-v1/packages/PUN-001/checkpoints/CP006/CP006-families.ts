/**
 * CP006 Question Families:
 * CP006-F01: Transitive vs Intransitive & Verb Structure (ਕਿਰਿਆ ਦੇ ਭੇਦ, ਪ੍ਰੇਰਣਾਰਥਕ, ਸੰਯੁਕਤ ਕਿਰਿਆ ਤੇ ਕਰਮ)
 * CP006-F02: Tense Identification, Shift & Aspects (ਕਾਲ ਪਰਿਵਰਤਨ, ਸ਼ਨਾਖ਼ਤ ਅਤੇ ਕਾਲ-ਪੱਖ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  ASPECT_SENTENCE_ITEMS,
  COMPOUND_VERB_ITEMS,
  DHATU_ITEMS,
  PRERANARTHAK_ITEMS,
  TENSE_SHIFT_PAIRS,
  TRANSITIVITY_CONVERSIONS,
  VERB_SENTENCE_ITEMS,
  type AspectSentenceItem,
  type CompoundVerbItem,
  type DhatuItem,
  type PreranarthakItem,
  type TenseShiftPair,
  type TransitivityConversionItem,
  type VerbSentenceItem,
} from "./CP006-authorities";

function assembleCP006Question(input: {
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
  ).filter((d) => d.length > 0 && d !== input.correctAnswer.trim());

  if (filteredDistractors.length < 3) {
    throw new Error(
      `Insufficient distinct distractors for CP006 ${input.familyId}. Got ${filteredDistractors.length} for answer '${input.correctAnswer}'`
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
    id: `PUN-001-CP006-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP006",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "2.0.0",
      fingerprint: `FINGERPRINT-CP006-${input.familyId}-${input.seed}-${input.difficulty}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

// -------------------------------------------------------------------------
// TEMPLATES
// -------------------------------------------------------------------------

const CP006_F01_MED_SENTENCE_TEMPLATES = [
  (s: string) => `ਵਾਕ “${s}” ਵਿੱਚ ਵਰਤੀ ਗਈ ਕਿਰਿਆ ਕਿਸ ਕਿਸਮ ਦੀ ਹੈ?`,
  (s: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ “${s}” ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਭੇਦ (ਸਕਰਮਕ ਜਾਂ ਅਕਰਮਕ) ਦੱਸੋ:`,
  (s: string) => `“${s}” — ਇਸ ਵਾਕ ਦੀ ਮੁੱਖ ਕਿਰਿਆ ਕਿਸ ਸ਼੍ਰੇਣੀ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
  (s: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਰੂਪ ਪਛਾਣੋ:`,
  (s: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਸਕਰਮਕ ਹੈ ਜਾਂ ਅਕਰਮਕ?\n“${s}”`,
  (s: string) => `ਕਿਰਿਆ ਦੀ ਵਰਤੋਂ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਦਾ ਸਹੀ ਵਿਆਕਰਣਕ ਵਰਗੀਕਰਨ ਕੀ ਹੈ?`,
];

const CP006_F01_HARD_SENTENCE_TEMPLATES = [
  (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚੋਂ ਕਿਰਿਆ ਦੀ ਕਿਸਮ (ਸਕਰਮਕ/ਅਕਰਮਕ) ਪਛਾਣੋ:\n“${s}”`,
  (s: string) => `ਕਰਮ ਦੀ ਮੌਜੂਦਗੀ ਦੇ ਆਧਾਰ 'ਤੇ ਵਾਕ “${s}” ਦੀ ਕਿਰਿਆ ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ:`,
  (s: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਵਿੱਚ ਆਈ ਕਿਰਿਆ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਦੀ ਹੈ?`,
  (s: string) => `ਵਾਕ “${s}” ਦੀ ਕਿਰਿਆ ਦੇ ਸੰਰਚਨਾਤਮਕ ਭੇਦ ਦੀ ਸ਼ੁੱਧ ਪਛਾਣ ਕਰੋ:`,
  (s: string) => `ਪ੍ਰੀਖਿਆ ਨਿਯਮਾਂ ਦੀ ਰੌਸ਼ਨੀ ਵਿੱਚ ਵਾਕ “${s}” ਦੀ ਕਿਰਿਆ ਦਾ ਸਹੀ ਰੂਪ ਨਿਰਧਾਰਿਤ ਕਰੋ:`,
  (s: string) => `ਡੂੰਘੇ ਵਿਆਕਰਣਕ ਵਿਸ਼ਲੇਸ਼ਣ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਕਿਸ ਕਿਰਿਆ-ਸ਼੍ਰੇਣੀ ਅਧੀਨ ਆਉਂਦਾ ਹੈ?`,
];

const CP006_F02_IDENTIFY_TEMPLATES = [
  (s: string) => `ਵਾਕ “${s}” ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਕਿਹੜਾ ‘ਕਾਲ’ ਪ੍ਰਗਟ ਹੋ ਰਿਹਾ ਹੈ?`,
  (s: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਸਮਾਂ (ਕਾਲ) ਪਛਾਣੋ:\n“${s}”`,
  (s: string) => `“${s}” — ਇਸ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਕਿਹੜੇ ਕਾਲ ਨਾਲ ਸੰਬੰਧ ਰੱਖਦੀ ਹੈ?`,
  (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚ ਕਾਲ ਦੀ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਹੈ?\n“${s}”`,
  (s: string) => `ਕਿਰਿਆ ਦੇ ਸਮੇਂ ਦੀ ਪਛਾਣ ਕਰੋ: “${s}”`,
  (s: string) => `ਵਾਕ “${s}” ਦੀ ਕਿਰਿਆ ਕਿਸ ਵਿਆਕਰਣਕ ਸਮੇਂ (ਕਾਲ) ਨੂੰ ਪ੍ਰਗਟ ਕਰ ਰਹੀ ਹੈ?`,
  (s: string) => `ਸ਼ੁੱਧ ਕਾਲ-ਬੋਧ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਕਿਸ ਕਾਲ ਵਿੱਚ ਰਚਿਆ ਗਿਆ ਹੈ?`,
];

const CP006_F02_SHIFT_TEMPLATES = [
  (t: string, s: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਵਾਕ ਨੂੰ ‘${t}’ ਵਿੱਚ ਬਦਲ ਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:\n\n“${s}”`,
  (t: string, s: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਨੂੰ ‘${t}’ ਵਿੱਚ ਰੂਪਾਂਤਰਿਤ ਕਰੋ:\n\n“${s}”`,
  (t: string, s: string) => `“${s}” — ਇਸ ਵਾਕ ਦਾ ‘${t}’ ਵਿੱਚ ਸ਼ੁੱਧ ਰੂਪ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
  (t: string, s: string) => `ਕਾਲ ਪਰਿਵਰਤਨ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਵਾਕ “${s}” ਨੂੰ ‘${t}’ ਵਿੱਚ ਬਦਲੋ:`,
  (t: string, s: string) => `ਵਾਕ “${s}” ਦਾ ‘${t}’ ਵਿੱਚ ਸਹੀ ਰੂਪਾਂਤਰਣ ਚੁਣੋ:`,
  (t: string, s: string) => `ਜੇਕਰ ਵਾਕ “${s}” ਨੂੰ ‘${t}’ ਵਿੱਚ ਲਿਖਿਆ ਜਾਵੇ, ਤਾਂ ਸ਼ੁੱਧ ਵਾਕ ਕਿਹੜਾ ਬਣੇਗਾ?`,
  (t: string, s: string) => `ਟਕਸਾਲੀ ਨਿਯਮਾਂ ਅਨੁਸਾਰ “${s}” ਨੂੰ ‘${t}’ ਵਿੱਚ ਪਰਿਵਰਤਿਤ ਕਰੋ:`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Verb Classification & Structure (ਕਿਰਿਆ ਦੇ ਭੇਦ)
// -------------------------------------------------------------------------
export function generateCP006F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);

  if (difficulty === "Easy") {
    const subType = rng.pickOne([
      "DHATU_EXTRACTION",
      "PRERANARTHAK_FORM",
      "REVERSE_CAUSATIVE",
      "MAIN_VERB_IDENTIFY",
      "GRAMMAR_DEF_EASY",
    ]);

    if (subType === "DHATU_EXTRACTION") {
      const item = rng.pickOne(DHATU_ITEMS);
      const distractorPool = new Set<string>(item.distractors);
      for (const d of DHATU_ITEMS) {
        if (d.root !== item.root) {
          distractorPool.add(d.root);
        }
      }
      distractorPool.delete(item.root);
      const distractors = Array.from(distractorPool);

      return assembleCP006Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: rng.pickOne([
          `ਕਿਰਿਆ ‘${item.verb}’ ਦਾ ਮੂਲ ਧਾਤੂ (ਧਾਤ) ਕਿਹੜਾ ਹੈ?`,
          `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਰਿਆ ‘${item.verb}’ ਦਾ ਮੂਲ ਅੰਗ ਜਾਂ ਧਾਤੂ ਚੁਣੋ:`,
          `ਕਿਰਿਆ ‘${item.verb}’ ਕਿਸ ਮੂਲ ਧਾਤੂ ਤੋਂ ਬਣੀ ਹੈ?`,
          `ਸ਼ਬਦ ‘${item.verb}’ ਦਾ ਮੂਲ ਕਿਰਿਆ ਧਾਤੂ ਕੀ ਹੈ?`,
        ]),
        correctAnswer: item.root,
        distractors,
        explanation: `ਕਿਰਿਆ ‘${item.verb}’ ਦਾ ਮੂਲ ਧਾਤੂ ‘${item.root}’ ਹੈ, ਜਿਸ ਪਿੱਛੇ ‘ਨਾ’ ਜਾਂ ‘ਣਾ’ ਲਗਾ ਕੇ ਮੂਲ ਕਿਰਿਆ ਰੂਪ ਬਣਦਾ ਹੈ।`,
        authorityIds: ["PUN-AUTH-VERB-ROOT"],
      });
    }

    if (subType === "PRERANARTHAK_FORM") {
      const item = rng.pickOne(PRERANARTHAK_ITEMS);
      const isSecond = rng.pickOne([true, false]);
      const targetLabel = isSecond ? "ਦੂਜਾ ਪ੍ਰੇਰਣਾਰਥਕ" : "ਪਹਿਲਾ ਪ੍ਰੇਰਣਾਰਥਕ";
      const correctAnswer = isSecond ? item.second : item.first;
      const distractorPool = new Set<string>();
      distractorPool.add(isSecond ? item.first : item.second);
      distractorPool.add(item.base);
      for (const other of PRERANARTHAK_ITEMS) {
        if (other.base !== item.base) {
          distractorPool.add(other.first);
          distractorPool.add(other.second);
        }
      }
      distractorPool.delete(correctAnswer);
      const distractors = Array.from(distractorPool);

      return assembleCP006Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: rng.pickOne([
          `ਕਿਰਿਆ ‘${item.base}’ ਦਾ ${targetLabel} ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
          `ਦਿੱਤੀ ਗਈ ਕਿਰਿਆ ‘${item.base}’ ਦਾ ਸਹੀ ${targetLabel} ਰੂਪ ਚੁਣੋ:`,
          `‘${item.base}’ ਦਾ ${targetLabel} ਬਣਾਉਣ 'ਤੇ ਕਿਹੜਾ ਕਿਰਿਆ ਰੂਪ ਬਣੇਗਾ?`,
          `ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${item.base}’ ਦਾ ${targetLabel} ਰੂਪ ਕੀ ਹੋਵੇਗਾ?`,
        ]),
        correctAnswer,
        distractors,
        explanation: `ਕਿਰਿਆ ‘${item.base}’ ਦਾ ${targetLabel} ਰੂਪ ‘${correctAnswer}’ ਹੁੰਦਾ ਹੈ।`,
        authorityIds: ["PUN-AUTH-VERB-CAUSATIVE"],
      });
    }

    if (subType === "REVERSE_CAUSATIVE") {
      const item = rng.pickOne(PRERANARTHAK_ITEMS);
      const isSecond = rng.pickOne([true, false]);
      const chosenForm = isSecond ? item.second : item.first;
      const distractorPool = new Set<string>();
      for (const other of PRERANARTHAK_ITEMS) {
        if (other.base !== item.base) {
          distractorPool.add(other.base);
        }
      }
      distractorPool.delete(item.base);
      const distractors = Array.from(distractorPool);

      return assembleCP006Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: rng.pickOne([
          `ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ ‘${chosenForm}’ ਦਾ ਮੂਲ ਕਿਰਿਆ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
          `‘${chosenForm}’ ਕਿਸ ਮੂਲ ਕਿਰਿਆ ਦਾ ਪ੍ਰੇਰਣਾਰਥਕ ਰੂਪ ਹੈ?`,
          `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${chosenForm}’ ਦੀ ਮੂਲ ਕਿਰਿਆ ਲੱਭੋ:`,
          `ਕਿਰਿਆ ਰੂਪ ‘${chosenForm}’ ਕਿਸ ਮੂਲ ਕਿਰਿਆ ਤੋਂ ਵਿਕਸਿਤ ਹੋਇਆ ਹੈ?`,
        ]),
        correctAnswer: item.base,
        distractors,
        explanation: `ਪ੍ਰੇਰਣਾਰਥਕ ਰੂਪ ‘${chosenForm}’ ਮੂਲ ਕਿਰਿਆ ‘${item.base}’ ਤੋਂ ਬਣਿਆ ਹੈ।`,
        authorityIds: ["PUN-AUTH-VERB-CAUSATIVE"],
      });
    }

    if (subType === "GRAMMAR_DEF_EASY") {
      const defChoices = [
        {
          stem: "ਜਿਸ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਫਲ ਕਰਤਾ ਦੇ ਨਾਲ-ਨਾਲ ‘ਕਰਮ’ (Object) ਉੱਤੇ ਵੀ ਪਵੇ, ਉਸ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
          correct: "ਸਕਰਮਕ ਕਿਰਿਆ",
          distractors: ["ਅਕਰਮਕ ਕਿਰਿਆ", "ਸਹਾਇਕ ਕਿਰਿਆ", "ਸੰਯੁਕਤ ਕਿਰਿਆ"],
          exp: "ਕਰਮ ਸਹਿਤ ਕਿਰਿਆ ਨੂੰ ‘ਸਕਰਮਕ ਕਿਰਿਆ’ (ਸ+ਕਰਮਕ = ਕਰਮ ਸਮੇਤ) ਆਖਦੇ ਹਨ।",
        },
        {
          stem: "ਜਿਸ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਫਲ ਕੇਵਲ ਕਰਤਾ (Subject) ਤੱਕ ਹੀ ਸੀਮਤ ਰਹੇ ਅਤੇ ਕੋਈ ਕਰਮ ਨਾ ਹੋਵੇ, ਉਸ ਨੂੰ ਕੀ ਆਖਦੇ ਹਨ?",
          correct: "ਅਕਰਮਕ ਕਿਰਿਆ",
          distractors: ["ਸਕਰਮਕ ਕਿਰਿਆ", "ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ", "ਮੁੱਖ ਕਿਰਿਆ"],
          exp: "ਜਿਸ ਕਿਰਿਆ ਨਾਲ ਕਰਮ ਨਾ ਹੋਵੇ, ਉਸ ਨੂੰ ‘ਅਕਰਮਕ ਕਿਰਿਆ’ (ਅ+ਕਰਮਕ = ਕਰਮ ਤੋਂ ਬਿਨਾਂ) ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",
        },
        {
          stem: "ਜਦੋਂ ਕਰਤਾ ਖ਼ੁਦ ਕੰਮ ਨਾ ਕਰਕੇ ਕਿਸੇ ਦੂਜੇ ਵਿਅਕਤੀ ਨੂੰ ਕੰਮ ਕਰਨ ਦੀ ਪ੍ਰੇਰਨਾ ਦੇਵੇ, ਤਾਂ ਉਸ ਕਿਰਿਆ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
          correct: "ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ",
          distractors: ["ਸਧਾਰਨ ਕਿਰਿਆ", "ਅਕਰਮਕ ਕਿਰਿਆ", "ਸਹਾਇਕ ਕਿਰਿਆ"],
          exp: "ਦੂਜੇ ਤੋਂ ਕੰਮ ਕਰਵਾਉਣ ਦੀ ਪ੍ਰੇਰਨਾ ਦੇਣ ਵਾਲੀ ਕਿਰਿਆ ‘ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ’ ਅਖਵਾਉਂਦੀ ਹੈ।",
        },
      ];
      const picked = rng.pickOne(defChoices);
      return assembleCP006Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: picked.stem,
        correctAnswer: picked.correct,
        distractors: picked.distractors,
        explanation: picked.exp,
        authorityIds: ["PUN-AUTH-VERB-DEF"],
      });
    }

    // MAIN_VERB_IDENTIFY
    const item = rng.pickOne(VERB_SENTENCE_ITEMS);
    const words = item.sentence
      .replace(/[।.,!?]/g, "")
      .split(/\s+/)
      .filter((w) => w !== item.mainVerb && !item.verbPhrase.includes(w));
    const fallbackWords = ["ਕਿਤਾਬ", "ਖੇਤ", "ਸਕੂਲ", "ਘਰ", "ਸਵੇਰੇ", "ਦਰਵਾਜ਼ਾ", "ਪਾਣੀ", "ਰੋਟੀ"];
    const distractors = Array.from(new Set([...words, ...fallbackWords])).filter(
      (w) => w !== item.mainVerb
    );

    return assembleCP006Question({
      familyId: "F01",
      seed,
      difficulty,
      stem: rng.pickOne([
        `ਵਾਕ “${item.sentence}” ਵਿੱਚ ਮੁੱਖ ਕਿਰਿਆ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
        `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚੋਂ ਮੁੱਖ ਕਿਰਿਆ ਦੀ ਪਛਾਣ ਕਰੋ:\n“${item.sentence}”`,
        `“${item.sentence}” — ਇਸ ਵਾਕ ਵਿੱਚ ਕਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ (ਕੰਮ) ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
        `ਵਾਕ “${item.sentence}” ਵਿੱਚ ਕਾਰਜ ਜਾਂ ਕਿਰਿਆ ਨੂੰ ਦਰਸਾਉਂਦਾ ਮੁੱਖ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
        `ਦਿੱਤੇ ਗਏ ਕਥਨ ਵਿੱਚੋਂ ਮੂਲ ਕਿਰਿਆ ਸ਼ਬਦ ਚੁਣੋ:\n“${item.sentence}”`,
        `“${item.sentence}” — ਇਸ ਵਾਕ ਦੀ ਮੁੱਖ ਕਿਰਿਆ ਕਿਹੜੀ ਹੈ?`,
      ]),
      correctAnswer: item.mainVerb,
      distractors,
      explanation: `ਵਾਕ “${item.sentence}” ਵਿੱਚ ‘${item.mainVerb}’ ਮੁੱਖ ਕੰਮ (ਕਿਰਿਆ) ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।`,
      authorityIds: ["PUN-AUTH-VERB-ROOT"],
    });
  }

  if (difficulty === "Medium") {
    const subType = rng.pickOne([
      "SAKARMAK_AKARMAK_MED",
      "TRANSITIVITY_CONVERSION_MED",
      "CAUSATIVE_DEGREE_MED",
      "DOUBLE_CAUSATIVE_MED",
      "OBJECT_IDENTIFY_MED",
    ]);

    if (subType === "DOUBLE_CAUSATIVE_MED") {
      const item = rng.pickOne(PRERANARTHAK_ITEMS);
      const distractorPool = new Set<string>();
      distractorPool.add(item.first);
      distractorPool.add(item.base);
      for (const other of PRERANARTHAK_ITEMS) {
        if (other.base !== item.base) {
          distractorPool.add(other.second);
        }
      }
      distractorPool.delete(item.second);
      const distractors = Array.from(distractorPool);

      return assembleCP006Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: rng.pickOne([
          `ਕਿਰਿਆ ‘${item.base}’ ਦਾ ਦੂਜਾ ਪ੍ਰੇਰਣਾਰਥਕ (ਦੁਹਰਾ ਪ੍ਰੇਰਣਾਰਥਕ) ਰੂਪ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
          `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਰਿਆ ‘${item.base}’ ਦਾ ਸ਼ੁੱਧ ਦੂਜਾ ਪ੍ਰੇਰਣਾਰਥਕ ਰੂਪ ਚੁਣੋ:`,
          `‘${item.base}’ ਤੋਂ ਦੂਜੀ ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ ਕਿਵੇਂ ਬਣੇਗੀ?`,
          `ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${item.base}’ ਦਾ ਦੂਜਾ ਪ੍ਰੇਰਣਾਰਥਕ ਸ਼ਬਦ ਲੱਭੋ:`,
        ]),
        correctAnswer: item.second,
        distractors,
        explanation: `ਕਿਰਿਆ ‘${item.base}’ ਦੀ ਪਹਿਲੀ ਪ੍ਰੇਰਣਾਰਥਕ ‘${item.first}’ ਅਤੇ ਦੂਜੀ ਪ੍ਰੇਰਣਾਰਥਕ ‘${item.second}’ ਹੁੰਦੀ ਹੈ।`,
        authorityIds: ["PUN-AUTH-VERB-CAUSATIVE"],
      });
    }

    if (subType === "TRANSITIVITY_CONVERSION_MED") {
      const item = rng.pickOne(TRANSITIVITY_CONVERSIONS);
      const otherTransitives = TRANSITIVITY_CONVERSIONS.filter(
        (t) => t.transitive !== item.transitive
      ).map((t) => t.transitive);
      const distractors = Array.from(
        new Set([...item.distractors, ...otherTransitives])
      ).filter((d) => d !== item.transitive);

      return assembleCP006Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: rng.pickOne([
          `ਅਕਰਮਕ ਕਿਰਿਆ ‘${item.intransitive}’ ਦਾ ਸਹੀ ਸਕਰਮਕ ਰੂਪ ਕਿਹੜਾ ਹੋਵੇਗਾ?`,
          `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${item.intransitive}’ (ਅਕਰਮਕ) ਦਾ ਸਕਰਮਕ ਰੂਪ ਚੁਣੋ:`,
          `‘${item.intransitive}’ ਕਿਰਿਆ ਨੂੰ ਸਕਰਮਕ ਵਿੱਚ ਬਦਲਣ 'ਤੇ ਕੀ ਬਣੇਗਾ?`,
          `ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਅਕਰਮਕ ਕਿਰਿਆ ‘${item.intransitive}’ ਦਾ ਸਕਰਮਕ ਰੂਪਾਂਤਰਣ ਕੀ ਹੈ?`,
        ]),
        correctAnswer: item.transitive,
        distractors,
        explanation: item.explanationPa,
        authorityIds: ["PUN-AUTH-VERB-CONVERSION"],
      });
    }

    if (subType === "CAUSATIVE_DEGREE_MED") {
      const item = rng.pickOne(PRERANARTHAK_ITEMS);
      const isSecond = rng.pickOne([true, false]);
      const targetVerb = isSecond ? item.second : item.first;
      const correctAnswer = isSecond ? "ਦੂਜੀ ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ" : "ਪਹਿਲੀ ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ";
      const distractorPool = [
        isSecond ? "ਪਹਿਲੀ ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ" : "ਦੂਜੀ ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ",
        "ਮੂਲ ਅਕਰਮਕ ਕਿਰਿਆ",
        "ਸਹਾਇਕ ਕਿਰਿਆ",
        "ਸੰਯੁਕਤ ਕਿਰਿਆ",
      ].filter((d) => d !== correctAnswer);

      return assembleCP006Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: rng.pickOne([
          `ਕਿਰਿਆ ਰੂਪ ‘${targetVerb}’ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਕਿਹੜੀ ਕਿਸਮ ਦੀ ਕਿਰਿਆ ਹੈ?`,
          `‘${targetVerb}’ ਕਿਸ ਸ਼੍ਰੇਣੀ ਦੀ ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ ਹੈ?`,
          `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${targetVerb}’ ਦਾ ਸਹੀ ਵਿਆਕਰਣਕ ਵਰਗ ਪਛਾਣੋ:`,
        ]),
        correctAnswer,
        distractors: distractorPool,
        explanation: `ਕਿਰਿਆ ‘${targetVerb}’ ਮੂਲ ਰੂਪ ‘${item.base}’ ਤੋਂ ਬਣੀ ${correctAnswer} ਹੈ।`,
        authorityIds: ["PUN-AUTH-VERB-CAUSATIVE"],
      });
    }

    if (subType === "OBJECT_IDENTIFY_MED") {
      const sakarmakItems = VERB_SENTENCE_ITEMS.filter((i) => i.directObject !== undefined);
      const item = rng.pickOne(sakarmakItems);
      const obj = item.directObject!;
      const words = item.sentence
        .replace(/[।.,!?]/g, "")
        .split(/\s+/)
        .filter((w) => w !== obj && w !== item.mainVerb && !item.verbPhrase.includes(w));
      const fallbackWords = ["ਪਾਣੀ", "ਕਿਤਾਬ", "ਖੇਤ", "ਘਰ", "ਸਕੂਲ", "ਦਰਵਾਜ਼ਾ"];
      const distractors = Array.from(new Set([...words, ...fallbackWords])).filter((w) => w !== obj);

      return assembleCP006Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: rng.pickOne([
          `ਵਾਕ “${item.sentence}” ਵਿੱਚ ‘ਕਰਮ’ (Object) ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
          `ਦਿੱਤੇ ਗਏ ਸਕਰਮਕ ਵਾਕ ਵਿੱਚੋਂ ਕਰਮ ਦੀ ਸ਼ਨਾਖ਼ਤ ਕਰੋ:\n“${item.sentence}”`,
          `“${item.sentence}” — ਇਸ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਫਲ ਕਿਸ 'ਤੇ ਪੈ ਰਿਹਾ ਹੈ (ਕਰਮ ਕੀ ਹੈ)?`,
        ]),
        correctAnswer: obj,
        distractors,
        explanation: `ਵਾਕ ਵਿੱਚ ‘${obj}’ ਉੱਤੇ ਕਿਰਿਆ ਦਾ ਪ੍ਰਭਾਵ ਪੈ ਰਿਹਾ ਹੈ, ਇਸ ਲਈ ਇਹ ‘ਕਰਮ’ (Object) ਹੈ।`,
        authorityIds: ["PUN-AUTH-VERB-OBJECT"],
      });
    }

    // SAKARMAK_AKARMAK_MED
    const item = rng.pickOne(VERB_SENTENCE_ITEMS);
    const isSakarmak = item.verbType === "SAKARMAK";
    const correctAnswer = isSakarmak ? "ਸਕਰਮਕ ਕਿਰਿਆ" : "ਅਕਰਮਕ ਕਿਰਿਆ";
    const wrongAnswer = isSakarmak ? "ਅਕਰਮਕ ਕਿਰਿਆ" : "ਸਕਰਮਕ ਕਿਰਿਆ";
    const stem = rng.pickOne(CP006_F01_MED_SENTENCE_TEMPLATES)(item.sentence);

    return assembleCP006Question({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer,
      distractors: [wrongAnswer, "ਦੁਹਰੀ ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ", "ਸਹਾਇਕ ਕਿਰਿਆ"],
      explanation: item.explanationPa,
      authorityIds: ["PUN-AUTH-VERB-TRANSITIVITY"],
    });
  }

  // Hard Difficulty:
  const subType = rng.pickOne([
    "SAKARMAK_AKARMAK_HARD",
    "COMPOUND_VERB_HARD",
    "SANCHALAK_VERB_HARD",
    "REVERSE_TRANSITIVITY_HARD",
    "OBJECT_IDENTIFY_HARD",
    "CAUSATIVE_DISCRIMINATION_HARD",
  ]);

  if (subType === "CAUSATIVE_DISCRIMINATION_HARD") {
    const item = rng.pickOne(PRERANARTHAK_ITEMS);
    const isSecond = rng.pickOne([true, false]);
    const label = isSecond ? "ਦੂਜੀ ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ" : "ਪਹਿਲੀ ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ";
    const correctAnswer = isSecond ? item.second : item.first;
    const distractorPool = new Set<string>();
    distractorPool.add(isSecond ? item.first : item.second);
    distractorPool.add(item.base);
    for (const other of PRERANARTHAK_ITEMS) {
      if (other.base !== item.base) {
        distractorPool.add(isSecond ? other.first : other.second);
        distractorPool.add(other.base);
      }
    }
    distractorPool.delete(correctAnswer);
    const distractors = Array.from(distractorPool);

    return assembleCP006Question({
      familyId: "F01",
      seed,
      difficulty,
      stem: rng.pickOne([
        `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਿਰਿਆ ਸ਼ਬਦ ‘${label}’ ਦੀ ਪ੍ਰਮਾਣਿਕ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
        `ਦਿੱਤੇ ਗਏ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${label}’ ਰੂਪ ਦੀ ਸ਼ਨਾਖ਼ਤ ਕਰੋ:`,
        `ਵਿਆਕਰਣਕ ਵਰਗੀਕਰਨ ਅਨੁਸਾਰ ਕਿਹੜਾ ਵਿਕਲਪ ‘${label}’ ਨੂੰ ਪ੍ਰਗਟਾਉਂਦਾ ਹੈ?`,
      ]),
      correctAnswer,
      distractors,
      explanation: `ਕਿਰਿਆ ‘${correctAnswer}’ ਮੂਲ ਰੂਪ ‘${item.base}’ ਦੀ ${label} ਹੈ।`,
      authorityIds: ["PUN-AUTH-VERB-CAUSATIVE"],
    });
  }

  if (subType === "COMPOUND_VERB_HARD") {
    const item = rng.pickOne(COMPOUND_VERB_ITEMS);
    const otherCompounds = COMPOUND_VERB_ITEMS.filter(
      (c) => c.compoundVerb !== item.compoundVerb
    ).map((c) => c.compoundVerb);
    const distractors = Array.from(new Set(otherCompounds)).filter(
      (c) => c !== item.compoundVerb
    );

    return assembleCP006Question({
      familyId: "F01",
      seed,
      difficulty,
      stem: rng.pickOne([
        `ਵਾਕ “${item.sentence}” ਵਿੱਚ ਵਰਤੀ ਗਈ ‘ਸੰਯੁਕਤ ਕਿਰਿਆ’ (Compound Verb) ਕਿਹੜੀ ਹੈ?`,
        `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚੋਂ ਸੰਯੁਕਤ ਕਿਰਿਆ ਰੂਪ ਦੀ ਚੋਣ ਕਰੋ:\n“${item.sentence}”`,
        `“${item.sentence}” — ਇਸ ਵਾਕ ਦੀ ਸੰਯੁਕਤ ਕਿਰਿਆ ਪਛਾਣੋ:`,
        `ਵਿਆਕਰਣਕ ਸੰਰਚਨਾ ਅਨੁਸਾਰ ਵਾਕ “${item.sentence}” ਦੀ ਸੰਯੁਕਤ ਕਿਰਿਆ ਚੁਣੋ:`,
        `ਦਿੱਤੇ ਗਏ ਵਾਕ ਵਿੱਚ ਦੋ ਕਿਰਿਆਵਾਂ ਦੇ ਸੁਮੇਲ ਵਾਲੀ ਸੰਯੁਕਤ ਕਿਰਿਆ ਕਿਹੜੀ ਹੈ?\n“${item.sentence}”`,
        `ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਅਨੁਸਾਰ ਵਾਕ “${item.sentence}” ਵਿੱਚ ਸੰਯੁਕਤ ਕਿਰਿਆ ਦੀ ਸ਼ਨਾਖ਼ਤ ਕਰੋ:`,
      ]),
      correctAnswer: item.compoundVerb,
      distractors,
      explanation: item.explanationPa,
      authorityIds: ["PUN-AUTH-VERB-COMPOUND"],
    });
  }

  if (subType === "SANCHALAK_VERB_HARD") {
    const item = rng.pickOne(COMPOUND_VERB_ITEMS);
    const otherOperators = ["ਲਿਆ", "ਦਿੱਤਾ", "ਪਿਆ", "ਗਿਆ", "ਸੁਣਾਇਆ", "ਨਿਕਲਿਆ", "ਖੜੋਤਾ", "ਲਈ", "ਦਿੱਤੀ", "ਪਏ"];
    const distractors = otherOperators.filter((o) => o !== item.sanchalakVerb);

    return assembleCP006Question({
      familyId: "F01",
      seed,
      difficulty,
      stem: rng.pickOne([
        `ਵਾਕ “${item.sentence}” ਦੀ ਸੰਯੁਕਤ ਕਿਰਿਆ ਵਿੱਚ ‘ਸੰਚਾਲਕ ਕਿਰਿਆ’ (Operator/Director Verb) ਕਿਹੜੀ ਹੈ?`,
        `ਸੰਯੁਕਤ ਕਿਰਿਆ ‘${item.compoundVerb}’ ਵਿੱਚ ਸੰਚਾਲਕ ਅੰਗ (ਸਹਾਇਕ ਕਿਰਿਆ) ਕਿਹੜਾ ਹੈ?`,
        `“${item.sentence}” — ਇਸ ਵਿੱਚ ਮੁੱਖ ਕਿਰਿਆ ਦੇ ਅਰਥਾਂ ਨੂੰ ਦਿਸ਼ਾ ਦੇਣ ਵਾਲੀ ਸੰਚਾਲਕ ਕਿਰਿਆ ਪਛਾਣੋ:`,
        `ਵਾਕ “${item.sentence}” ਵਿੱਚ ਸੰਚਾਲਕ ਸਹਾਇਕ ਕਿਰਿਆ ਕਿਹੜੀ ਹੈ?`,
        `ਦਿੱਤੇ ਗਏ ਵਾਕ ਦੀ ਸੰਯੁਕਤ ਕਿਰਿਆ ਵਿੱਚੋਂ ਸੰਚਾਲਕ ਅੰਗ ਚੁਣੋ:\n“${item.sentence}”`,
        `“${item.sentence}” — ਇਸ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਨੂੰ ਸੰਚਾਲਿਤ ਕਰਨ ਵਾਲਾ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
      ]),
      correctAnswer: item.sanchalakVerb,
      distractors,
      explanation: `ਸੰਯੁਕਤ ਕਿਰਿਆ ‘${item.compoundVerb}’ ਵਿੱਚ ਮੁੱਖ ਧਾਤੂ ਤੋਂ ਬਾਅਦ ਆਉਣ ਵਾਲੀ ‘${item.sanchalakVerb}’ ਸੰਚਾਲਕ ਕਿਰਿਆ ਹੈ।`,
      authorityIds: ["PUN-AUTH-VERB-COMPOUND"],
    });
  }

  if (subType === "REVERSE_TRANSITIVITY_HARD") {
    const item = rng.pickOne(TRANSITIVITY_CONVERSIONS);
    const otherIntransitives = TRANSITIVITY_CONVERSIONS.filter(
      (t) => t.intransitive !== item.intransitive
    ).map((t) => t.intransitive);
    const distractors = Array.from(new Set(otherIntransitives)).filter(
      (i) => i !== item.intransitive
    );

    return assembleCP006Question({
      familyId: "F01",
      seed,
      difficulty,
      stem: rng.pickOne([
        `ਸਕਰਮਕ ਕਿਰਿਆ ‘${item.transitive}’ ਦਾ ਮੂਲ ਅਕਰਮਕ ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
        `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਰਿਆ ‘${item.transitive}’ ਦੀ ਅਕਰਮਕ ਕਿਰਿਆ ਚੁਣੋ:`,
        `‘${item.transitive}’ ਸਕਰਮਕ ਕਿਰਿਆ ਕਿਸ ਅਕਰਮਕ ਕਿਰਿਆ ਤੋਂ ਬਣੀ ਹੈ?`,
        `ਕਿਰਿਆ ‘${item.transitive}’ ਕਿਸ ਮੂਲ ਅਕਰਮਕ ਕਿਰਿਆ ਦਾ ਰੂਪਾਂਤਰਣ ਹੈ?`,
        `ਸਕਰਮਕ ਸ਼ਬਦ ‘${item.transitive}’ ਦੀ ਅਕਰਮਕ ਧਾਤੂ ਜਾਂ ਮੂਲ ਰੂਪ ਕੀ ਹੋਵੇਗਾ?`,
        `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${item.transitive}’ ਦਾ ਅਕਰਮਕ ਕਿਰਿਆ ਰੂਪ ਲੱਭੋ:`,
      ]),
      correctAnswer: item.intransitive,
      distractors,
      explanation: `ਸਕਰਮਕ ਕਿਰਿਆ ‘${item.transitive}’ ਮੂਲ ਅਕਰਮਕ ਕਿਰਿਆ ‘${item.intransitive}’ ਤੋਂ ਬਣੀ ਹੈ।`,
      authorityIds: ["PUN-AUTH-VERB-CONVERSION"],
    });
  }

  if (subType === "OBJECT_IDENTIFY_HARD") {
    const sakarmakItems = VERB_SENTENCE_ITEMS.filter((i) => i.directObject !== undefined);
    const item = rng.pickOne(sakarmakItems);
    const obj = item.directObject!;
    const words = item.sentence
      .replace(/[।.,!?]/g, "")
      .split(/\s+/)
      .filter((w) => w !== obj && w !== item.mainVerb && !item.verbPhrase.includes(w));
    const fallbackWords = ["ਪਾਣੀ", "ਕਿਤਾਬ", "ਖੇਤ", "ਘਰ", "ਸਕੂਲ", "ਦਰਵਾਜ਼ਾ"];
    const distractors = Array.from(new Set([...words, ...fallbackWords])).filter((w) => w !== obj);

    return assembleCP006Question({
      familyId: "F01",
      seed,
      difficulty,
      stem: rng.pickOne([
        `ਹੇਠ ਲਿਖੇ ਜਟਿਲ ਵਾਕ ਵਿੱਚੋਂ ‘ਕਰਮ’ (Object) ਦੀ ਸ਼ੁੱਧ ਸ਼ਨਾਖ਼ਤ ਕਰੋ:\n“${item.sentence}”`,
        `ਵਾਕ “${item.sentence}” ਵਿੱਚ ਕਿਹੜਾ ਸੰਗਿਆ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ‘ਕਰਮ’ ਵਜੋਂ ਕਾਰਜ ਕਰ ਰਿਹਾ ਹੈ?`,
        `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਵਾਕ “${item.sentence}” ਦਾ ਕਰਮ ਚੁਣੋ:`,
        `ਜਿਸ ਵਾਕ “${item.sentence}” ਵਿੱਚ ਕਿਰਿਆ ਸਕਰਮਕ ਹੈ, ਉਸ ਵਿੱਚ ਕਰਮ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
        `ਦਿੱਤੇ ਗਏ ਕਥਨ ਵਿੱਚ ਕਰਮ (Object) ਦੀ ਸਹੀ ਪਛਾਣ ਕਰੋ:\n“${item.sentence}”`,
        `“${item.sentence}” — ਇਸ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਕਿਸ ਕਰਮ ਉੱਤੇ ਵਾਪਰ ਰਹੀ ਹੈ?`,
      ]),
      correctAnswer: obj,
      distractors,
      explanation: `ਵਾਕ ਵਿੱਚ ‘${obj}’ ਕਿਰਿਆ ਦਾ ਮੁੱਖ ਕਰਮ (Object) ਹੈ।`,
      authorityIds: ["PUN-AUTH-VERB-OBJECT"],
    });
  }

  // SAKARMAK_AKARMAK_HARD
  const item = rng.pickOne(VERB_SENTENCE_ITEMS);
  const isSakarmak = item.verbType === "SAKARMAK";
  const correctAnswer = isSakarmak ? "ਸਕਰਮਕ ਕਿਰਿਆ" : "ਅਕਰਮਕ ਕਿਰਿਆ";
  const wrongAnswer = isSakarmak ? "ਅਕਰਮਕ ਕਿਰਿਆ" : "ਸਕਰਮਕ ਕਿਰਿਆ";
  const stem = rng.pickOne(CP006_F01_HARD_SENTENCE_TEMPLATES)(item.sentence);

  return assembleCP006Question({
    familyId: "F01",
    seed,
    difficulty,
    stem,
    correctAnswer,
    distractors: [wrongAnswer, "ਦੁਹਰੀ ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ", "ਸੰਯੁਕਤ ਕਿਰਿਆ"],
    explanation: item.explanationPa,
    authorityIds: ["PUN-AUTH-VERB-TRANSITIVITY"],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: Tense Identification, Shift & Aspects (ਕਾਲ ਅਤੇ ਕਾਲ-ਪੱਖ)
// -------------------------------------------------------------------------
export function generateCP006F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);

  if (difficulty === "Easy") {
    const subType = rng.pickOne(["AUXILIARY_VERB", "BASIC_TENSE_IDENTIFY", "TENSE_CONCEPT"]);

    if (subType === "AUXILIARY_VERB") {
      const candidates = VERB_SENTENCE_ITEMS.filter((i) => i.auxiliaryVerb !== undefined);
      const chosen = rng.pickOne(candidates);
      const aux = chosen.auxiliaryVerb!;
      const sentenceWords = chosen.sentence.replace(/[।.,!?]/g, "").split(/\s+/).filter((w) => w !== aux);
      const fallbackDistractors = ["ਹੈ", "ਸੀ", "ਸਨ", "ਹਨ", "ਹੋਵੇਗਾ", "ਰਿਹਾ"].filter((w) => w !== aux);
      const distractors = Array.from(new Set([...sentenceWords, ...fallbackDistractors]));

      return assembleCP006Question({
        familyId: "F02",
        seed,
        difficulty,
        stem: rng.pickOne([
          `ਵਾਕ “${chosen.sentence}” ਵਿੱਚ ‘ਸਹਾਇਕ ਕਿਰਿਆ’ ਕਿਹੜੀ ਹੈ?`,
          `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚੋਂ ਸਹਾਇਕ ਕਿਰਿਆ ਦੀ ਪਛਾਣ ਕਰੋ:\n“${chosen.sentence}”`,
          `“${chosen.sentence}” — ਇਸ ਵਾਕ ਵਿੱਚ ਮੁੱਖ ਕਿਰਿਆ ਦਾ ਸਾਥ ਦੇਣ ਵਾਲੀ ਸਹਾਇਕ ਕਿਰਿਆ ਲੱਭੋ:`,
        ]),
        correctAnswer: aux,
        distractors,
        explanation: `ਇਸ ਵਾਕ ਵਿੱਚ ਮੁੱਖ ਕਿਰਿਆ ਨਾਲ ਕਾਲ ਦਾ ਬੋਧ ਕਰਵਾਉਣ ਵਾਲਾ ਸ਼ਬਦ ‘${aux}’ ਸਹਾਇਕ ਕਿਰਿਆ ਹੈ।`,
        authorityIds: ["PUN-AUTH-TENSE-AUX"],
      });
    }

    if (subType === "TENSE_CONCEPT") {
      const conceptChoices = [
        {
          stem: "ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘ਕਾਲ’ ਦੀਆਂ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿੰਨੀਆਂ ਕਿਸਮਾਂ ਹੁੰਦੀਆਂ ਹਨ?",
          correct: "ਤਿੰਨ (ਵਰਤਮਾਨ, ਭੂਤ, ਭਵਿੱਖਤ)",
          distractors: ["ਦੋ", "ਚਾਰ", "ਪੰਜ"],
          exp: "ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਵਿੱਚ ਕਾਲ ਦੀਆਂ ਤਿੰਨ ਮੁੱਖ ਸ਼੍ਰੇਣੀਆਂ ਹਨ: ਵਰਤਮਾਨ ਕਾਲ, ਭੂਤਕਾਲ ਅਤੇ ਭਵਿੱਖਤ ਕਾਲ।",
        },
        {
          stem: "ਬੀਤ ਚੁੱਕੇ ਸਮੇਂ ਨੂੰ ਵਿਆਕਰਣ ਵਿੱਚ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
          correct: "ਭੂਤਕਾਲ",
          distractors: ["ਵਰਤਮਾਨ ਕਾਲ", "ਭਵਿੱਖਤ ਕਾਲ", "ਸੰਭਾਵੀ ਕਾਲ"],
          exp: "ਬੀਤੇ ਹੋਏ ਸਮੇਂ ਦਾ ਬੋਧ ਕਰਵਾਉਣ ਵਾਲੀ ਕਿਰਿਆ ਭੂਤਕਾਲ ਅਖਵਾਉਂਦੀ ਹੈ।",
        },
        {
          stem: "ਆਉਣ ਵਾਲੇ ਸਮੇਂ ਵਿੱਚ ਹੋਣ ਵਾਲੇ ਕੰਮ ਨੂੰ ਕਿਹੜੇ ਕਾਲ ਨਾਲ ਦਰਸਾਇਆ ਜਾਂਦਾ ਹੈ?",
          correct: "ਭਵਿੱਖਤ ਕਾਲ",
          distractors: ["ਵਰਤਮਾਨ ਕਾਲ", "ਭੂਤਕਾਲ", "ਨਿੱਤਤਾਵਾਚਕ ਕਾਲ"],
          exp: "ਆਉਣ ਵਾਲੇ ਸਮੇਂ ਵਿੱਚ ਹੋਣ ਵਾਲੀ ਕਿਰਿਆ ਭਵਿੱਖਤ ਕਾਲ ਹੁੰਦੀ ਹੈ।",
        },
      ];
      const picked = rng.pickOne(conceptChoices);
      return assembleCP006Question({
        familyId: "F02",
        seed,
        difficulty,
        stem: picked.stem,
        correctAnswer: picked.correct,
        distractors: picked.distractors,
        explanation: picked.exp,
        authorityIds: ["PUN-AUTH-TENSE-DEF"],
      });
    }

    const tenseNameMap = {
      VARATMAN: "ਵਰਤਮਾਨ ਕਾਲ",
      BHOOT: "ਭੂਤਕਾਲ",
      BHAVIKHAT: "ਭਵਿੱਖਤ ਕਾਲ",
    };
    const item = rng.pickOne(VERB_SENTENCE_ITEMS);
    const correctAnswer = tenseNameMap[item.tense];
    const otherTenses = ["ਵਰਤਮਾਨ ਕਾਲ", "ਭੂਤਕਾਲ", "ਭਵਿੱਖਤ ਕਾਲ", "ਚਾਲੂ ਕਾਲ"].filter(
      (t) => t !== correctAnswer
    );

    return assembleCP006Question({
      familyId: "F02",
      seed,
      difficulty,
      stem: rng.pickOne([
        `ਹੇਠ ਲਿਖੇ ਸਧਾਰਨ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਕਿਹੜਾ ਕਾਲ (ਸਮਾਂ) ਹੈ?\n“${item.sentence}”`,
        `ਵਾਕ “${item.sentence}” ਵਿੱਚ ਸਮੇਂ (ਕਾਲ) ਦਾ ਕਿਹੜਾ ਰੂਪ ਪ੍ਰਗਟ ਹੋ ਰਿਹਾ ਹੈ?`,
        `ਕਿਰਿਆ ਦੇ ਕਾਲ ਦੀ ਪਛਾਣ ਕਰੋ: “${item.sentence}”`,
        `“${item.sentence}” — ਇਸ ਵਾਕ ਵਿੱਚ ਕਿਹੜਾ ਕਾਲ ਦਰਸਾਇਆ ਗਿਆ ਹੈ?`,
      ]),
      correctAnswer,
      distractors: otherTenses,
      explanation: `ਵਾਕ ਵਿੱਚ ‘${item.verbPhrase}’ ${correctAnswer} ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ।`,
      authorityIds: ["PUN-AUTH-TENSE-IDENTIFY"],
    });
  }

  if (difficulty === "Medium") {
    const subType = rng.pickOne([
      "TENSE_IDENTIFY_MED",
      "ASPECT_IDENTIFY_MED",
      "TENSE_SHIFT_MED",
    ]);

    if (subType === "ASPECT_IDENTIFY_MED") {
      const item = rng.pickOne(ASPECT_SENTENCE_ITEMS);
      const otherAspectTenses = ASPECT_SENTENCE_ITEMS.filter(
        (a) => a.aspectTense !== item.aspectTense
      ).map((a) => a.aspectTense);
      const distractors = Array.from(
        new Set([...item.distractors, ...otherAspectTenses])
      ).filter((d) => d !== item.aspectTense);

      return assembleCP006Question({
        familyId: "F02",
        seed,
        difficulty,
        stem: rng.pickOne([
          `ਵਾਕ “${item.sentence}” ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਕਿਹੜਾ ਕਾਲ-ਰੂਪ ਪ੍ਰਗਟ ਹੋ ਰਿਹਾ ਹੈ?`,
          `ਕਾਲ ਅਤੇ ਪੱਖ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਵਾਕ “${item.sentence}” ਦੀ ਸਹੀ ਸ਼੍ਰੇਣੀ ਚੁਣੋ:`,
          `“${item.sentence}” — ਇਸ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦੇ ਕਾਲ ਦਾ ਸ਼ੁੱਧ ਭੇਦ ਕਿਹੜਾ ਹੈ?`,
          `ਵਾਕ “${item.sentence}” ਵਿੱਚ ਕਿਰਿਆ ਦੇ ਕਾਲ-ਪੱਖ ਦੀ ਸ਼ੁੱਧ ਸ਼ਨਾਖ਼ਤ ਕਰੋ:`,
          `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚ ਕਾਲ ਦੀ ਕਿਹੜੀ ਸ਼ਾਖ਼ਾ ਜਾਂ ਪੱਖ ਪ੍ਰਗਟ ਹੋ ਰਿਹਾ ਹੈ?\n“${item.sentence}”`,
          `ਸਮੇਂ ਅਤੇ ਕਾਰਜ-ਅਵਸਥਾ ਅਨੁਸਾਰ ਵਾਕ “${item.sentence}” ਦਾ ਸਹੀ ਕਾਲ-ਰੂਪ ਕਿਹੜਾ ਹੈ?`,
        ]),
        correctAnswer: item.aspectTense,
        distractors,
        explanation: item.explanationPa,
        authorityIds: ["PUN-AUTH-TENSE-ASPECT"],
      });
    }

    if (subType === "TENSE_SHIFT_MED") {
      const shiftPair = rng.pickOne(TENSE_SHIFT_PAIRS);
      const stem = rng.pickOne(CP006_F02_SHIFT_TEMPLATES)(
        shiftPair.targetTense,
        shiftPair.baseSentence
      );

      return assembleCP006Question({
        familyId: "F02",
        seed,
        difficulty,
        stem,
        correctAnswer: shiftPair.convertedSentence,
        distractors: shiftPair.distractors,
        explanation: shiftPair.explanationPa,
        authorityIds: ["PUN-AUTH-TENSE-SHIFT"],
      });
    }

    // TENSE_IDENTIFY_MED
    const item = rng.pickOne(VERB_SENTENCE_ITEMS);
    const tenseNameMap = {
      VARATMAN: "ਵਰਤਮਾਨ ਕਾਲ",
      BHOOT: "ਭੂਤਕਾਲ",
      BHAVIKHAT: "ਭਵਿੱਖਤ ਕਾਲ",
    };
    const correctAnswer = tenseNameMap[item.tense];
    const otherTenses = ["ਵਰਤਮਾਨ ਕਾਲ", "ਭੂਤਕਾਲ", "ਭਵਿੱਖਤ ਕਾਲ", "ਸੰਭਾਵੀ ਕਾਲ"].filter(
      (t) => t !== correctAnswer
    );
    const stem = rng.pickOne(CP006_F02_IDENTIFY_TEMPLATES)(item.sentence);

    return assembleCP006Question({
      familyId: "F02",
      seed,
      difficulty,
      stem,
      correctAnswer,
      distractors: otherTenses,
      explanation: `ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ‘${item.verbPhrase}’ ${correctAnswer} ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ।`,
      authorityIds: ["PUN-AUTH-TENSE-IDENTIFY"],
    });
  }

  // Hard Difficulty
  const subType = rng.pickOne([
    "TENSE_SHIFT_HARD",
    "ASPECT_CATEGORY_HARD",
    "CONDITIONAL_SUBJUNCTIVE_HARD",
  ]);

  if (subType === "ASPECT_CATEGORY_HARD") {
    const item = rng.pickOne(ASPECT_SENTENCE_ITEMS);
    const allCategories = ["ਨਿੱਤਤਾਵਾਚਕ ਪੱਖ", "ਅਪੂਰਨ ਪੱਖ (ਚਾਲੂ)", "ਪੂਰਨ ਪੱਖ", "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ"];
    const distractors = allCategories.filter((c) => c !== item.aspectCategory);

    return assembleCP006Question({
      familyId: "F02",
      seed,
      difficulty,
      stem: rng.pickOne([
        `ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਵਾਕ “${item.sentence}” ਕਿਰਿਆ ਦੇ ਕਿਹੜੇ ਪੱਖ (Aspect) ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
        `ਵਾਕ “${item.sentence}” ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਵਿਆਕਰਣਕ ‘ਪੱਖ’ (Verbal Aspect) ਪਛਾਣੋ:`,
        `“${item.sentence}” — ਇਸ ਵਾਕ ਵਿੱਚ ਕਾਰਜ ਦੀ ਸੰਪੂਰਨਤਾ ਜਾਂ ਨਿਰੰਤਰਤਾ ਅਨੁਸਾਰ ਕਿਹੜਾ ਪੱਖ ਮੌਜੂਦ ਹੈ?`,
        `ਵਿਆਕਰਣਕ ਦ੍ਰਿਸ਼ਟੀ ਤੋਂ ਵਾਕ “${item.sentence}” ਵਿੱਚ ਕਾਲ-ਪੱਖ ਦਾ ਕਿਹੜਾ ਭੇਦ ਉਜਾਗਰ ਹੁੰਦਾ ਹੈ?`,
        `ਦਿੱਤੇ ਗਏ ਕਥਨ ਵਿੱਚ ਕਿਰਿਆ ਦੀ ਅਵਸਥਾ (ਨਿਰੰਤਰ/ਪੂਰਨ/ਨਿੱਤਤਾ) ਅਨੁਸਾਰ ਸਹੀ ਪੱਖ ਚੁਣੋ:\n“${item.sentence}”`,
        `“${item.sentence}” — ਇਸ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦੇ ‘ਪੱਖ’ (Aspect) ਦਾ ਸ਼ੁੱਧ ਵਰਗੀਕਰਨ ਕਰੋ:`,
      ]),
      correctAnswer: item.aspectCategory,
      distractors,
      explanation: item.explanationPa,
      authorityIds: ["PUN-AUTH-TENSE-ASPECT"],
    });
  }

  if (subType === "CONDITIONAL_SUBJUNCTIVE_HARD") {
    const conditionalItems = ASPECT_SENTENCE_ITEMS.filter(
      (a) => a.aspectCategory === "ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਕਾਲ"
    );
    const item = rng.pickOne(conditionalItems);
    const otherTenses = [
      "ਸਧਾਰਨ ਭੂਤਕਾਲ",
      "ਸਧਾਰਨ ਭਵਿੱਖਤ ਕਾਲ",
      "ਚਾਲੂ ਵਰਤਮਾਨ ਕਾਲ",
      "ਪੂਰਨ ਭੂਤਕਾਲ",
      "ਹੁਕਮੀ ਵਰਤਮਾਨ ਕਾਲ",
    ].filter((t) => t !== item.aspectTense);

    return assembleCP006Question({
      familyId: "F02",
      seed,
      difficulty,
      stem: rng.pickOne([
        `ਵਾਕ “${item.sentence}” ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਕਿਸ ਵਿਸ਼ੇਸ਼ ਕਾਲ-ਰੂਪ ਦੀ ਉਦਾਹਰਣ ਹੈ?`,
        `ਹੇਠ ਲਿਖੇ ਸ਼ਰਤੀ/ਸੰਭਾਵੀ ਵਾਕ ਵਿੱਚ ਕਾਲ ਦੀ ਸਹੀ ਸ਼੍ਰੇਣੀ ਪਛਾਣੋ:\n“${item.sentence}”`,
        `“${item.sentence}” — ਇਸ ਵਾਕ ਦਾ ਕਾਲ ਕਿਹੜਾ ਹੈ?`,
        `ਵਾਕ “${item.sentence}” ਵਿੱਚ ਵਿਆਕਰਣਕ ਸ਼ਰਤ ਜਾਂ ਸੰਭਾਵਨਾ ਦੇ ਆਧਾਰ 'ਤੇ ਕਿਹੜਾ ਕਾਲ ਹੈ?`,
        `ਹੇਠਾਂ ਦਿੱਤਾ ਵਾਕ ਕਾਲ ਦੀ ਕਿਹੜੀ ਉੱਨਤ ਸ਼੍ਰੇਣੀ ਨੂੰ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ?\n“${item.sentence}”`,
        `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ “${item.sentence}” ਕਿਸ ਵਿਸ਼ੇਸ਼ ਕਾਲ-ਭੇਦ ਦਾ ਪ੍ਰਤੀਕ ਹੈ?`,
      ]),
      correctAnswer: item.aspectTense,
      distractors: otherTenses.slice(0, 3),
      explanation: item.explanationPa,
      authorityIds: ["PUN-AUTH-TENSE-CONDITIONAL"],
    });
  }

  // TENSE_SHIFT_HARD
  const shiftPair = rng.pickOne(TENSE_SHIFT_PAIRS);
  const stem = rng.pickOne(CP006_F02_SHIFT_TEMPLATES)(
    shiftPair.targetTense,
    shiftPair.baseSentence
  );

  return assembleCP006Question({
    familyId: "F02",
    seed,
    difficulty,
    stem,
    correctAnswer: shiftPair.convertedSentence,
    distractors: shiftPair.distractors,
    explanation: shiftPair.explanationPa,
    authorityIds: ["PUN-AUTH-TENSE-SHIFT"],
  });
}
