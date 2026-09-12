/**
 * CP007 Question Families:
 * CP007-F01: Karak Identification (ਕਾਰਕ ਸ਼ਨਾਖ਼ਤ)
 * CP007-F02: Connectors & Interjections (ਸੰਬੰਧਕ, ਯੋਜਕ, ਵਿਸਮਿਕ)
 * CP007-F03: Case Marker Blank Fill (ਕਾਰਕੀ ਸੰਬੰਧਕ ਖ਼ਾਲੀ ਥਾਂ ਪੂਰਤੀ)
 * CP007-F04: Conjunction Classification & Clause Structure (ਯੋਜਕ ਸ਼੍ਰੇਣੀ ਵੰਡ ਅਤੇ ਉਪਵਾਕ ਸੰਯੋਜਨ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  CONNECTOR_ITEMS,
  CONJUNCTION_TYPE_ITEMS,
  KARAK_ITEMS,
  type KarakItem,
  type ConjunctionTypeItem,
} from "./CP007-authorities";

function assembleCP007Question(input: {
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
      `Insufficient distinct distractors for CP007 ${input.familyId}. Got ${filteredDistractors.length}`
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
    id: `PUN-001-CP007-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP007",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP007-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

// -------------------------------------------------------------------------
// TEMPLATES
// -------------------------------------------------------------------------
const CP007_F01_STEM_TEMPLATES = [
  (s: string, t: string) => `ਵਾਕ “${s}” ਵਿੱਚ ਰੇਖਾਂਕਿਤ ਪਦ ‘${t}’ ਕਿਹੜਾ ਕਾਰਕ ਹੈ?`,
  (s: string, t: string) => `ਹੇਠ ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ‘${t}’ ਕਿਸ ਕਾਰਕ ਵਜੋਂ ਕਾਰਜ ਕਰ ਰਿਹਾ ਹੈ?\n\n“${s}”`,
  (s: string, t: string) => `“${s}” — ਇਸ ਵਾਕ ਵਿੱਚ ‘${t}’ ਦਾ ਸਹੀ ਕਾਰਕੀ ਰੂਪ ਚੁਣੋ:`,
  (s: string, t: string) => `ਦਿੱਤੇ ਗਏ ਕਥਨ ਵਿੱਚ ‘${t}’ ਵਿਆਕਰਣਕ ਪੱਖੋਂ ਕਿਹੜਾ ਕਾਰਕ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ?\n\n“${s}”`,
  (s: string, t: string) => `ਵਾਕ “${s}” ਵਿੱਚ ਵਰਤਿਆ ਗਿਆ ਪਦ ‘${t}’ ਕਿਹੜੇ ਕਾਰਕ ਦਾ ਪ੍ਰਤੀਕ ਹੈ?`,
  (s: string, t: string) => `“${s}” — ਇਸ ਵਾਕ ਵਿਚਲੇ ਪਦ ‘${t}’ ਦਾ ਵਿਆਕਰਣਕ ਕਾਰਕ ਪਛਾਣੋ:`,
];

const CP007_EASY_MARKER_TEMPLATES = [
  (m: string) => `ਵਿਆਕਰਣਕ ਨੇਮਾਂ ਅਨੁਸਾਰ ਸੰਬੰਧਕੀ ਚਿੰਨ੍ਹ ‘${m}’ ਕਿਸ ਕਾਰਕ ਦੀ ਪਛਾਣ ਹੈ?`,
  (m: string) => `ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਵਿੱਚ ਚਿੰਨ੍ਹ ‘${m}’ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਸ ਕਾਰਕ ਨਾਲ ਜੁੜਿਆ ਹੋਇਆ ਹੈ?`,
  (m: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${m}’ ਕਿਹੜੇ ਕਾਰਕ ਦਾ ਸੂਚਕ ਹੈ?`,
  (m: string) => `ਕਾਰਕੀ ਚਿੰਨ੍ਹ ‘${m}’ ਦਾ ਸੰਬੰਧ ਕਿਸ ਕਾਰਕ ਸ਼੍ਰੇਣੀ ਨਾਲ ਹੈ?`,
];

const CP007_EASY_SENTENCE_TEMPLATES = [
  (s: string, t: string) => `ਸਧਾਰਨ ਵਾਕ “${s}” ਵਿੱਚ ਰੇਖਾਂਕਿਤ ਪਦ ‘${t}’ ਕਿਹੜਾ ਕਾਰਕ ਦਰਸਾਉਂਦਾ ਹੈ?`,
  (s: string, t: string) => `“${s}” — ਇਸ ਵਾਕ ਵਿੱਚ ‘${t}’ ਦਾ ਕਾਰਕ ਦੱਸੋ:`,
  (s: string, t: string) => `ਦਿੱਤੇ ਗਏ ਵਾਕ ਵਿੱਚ ‘${t}’ ਕਿਹੜੇ ਕਾਰਕ ਦਾ ਰੂਪ ਹੈ?\n“${s}”`,
  (s: string, t: string) => `ਵਾਕ “${s}” ਵਿੱਚ ਪਦ ‘${t}’ ਕਿਸ ਕਾਰਕ ਵਜੋਂ ਆਇਆ ਹੈ?`,
];

const CP007_F02_STEM_TEMPLATES = [
  (m: string) => `ਸ਼ਬਦ ‘${m}’ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਕਿਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
  (m: string) => `ਵਿਆਕਰਣਕ ਦ੍ਰਿਸ਼ਟੀ ਤੋਂ ਸ਼ਬਦ ‘${m}’ ਕਿਸ ਵਰਗ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
  (m: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸ਼ਬਦ ‘${m}’ ਦਾ ਸਹੀ ਵਿਆਕਰਣਕ ਵਰਗ ਦੱਸੋ:`,
  (m: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਵਿੱਚ ‘${m}’ ਨੂੰ ਕਿਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਗਿਣਿਆ ਜਾਂਦਾ ਹੈ?`,
  (m: string) => `ਦਿੱਤਾ ਗਿਆ ਸ਼ਬਦ ‘${m}’ ਕਿਹੜਾ ਵਿਆਕਰਣਕ ਰੂਪ ਹੈ?`,
  (m: string) => `ਭਾਸ਼ਾ ਵਿਗਿਆਨ ਅਨੁਸਾਰ ‘${m}’ ਕਿਸ ਕਿਸਮ ਦਾ ਸ਼ਬਦ ਹੈ?`,
];

const CP007_F02_HARD_TEMPLATES = [
  (sub: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ‘${sub}’ ਦੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
  (sub: string) => `ਦਿੱਤੇ ਗਏ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${sub}’ ਦੀ ਉਦਾਹਰਨ ਚੁਣੋ:`,
  (sub: string) => `‘${sub}’ ਦਾ ਸਹੀ ਪ੍ਰਤੀਨਿਧ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  (sub: string) => `ਹੇਠ ਲਿਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ‘${sub}’ ਵਜੋਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
];

const CP007_F03_TEMPLATES = [
  (s: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਵਾਕ ਵਿੱਚ ਢੁਕਵਾਂ ਕਾਰਕੀ ਸੰਬੰਧਕ ਚੁਣ ਕੇ ਖ਼ਾਲੀ ਥਾਂ ਭਰੋ:\n\n“${s}”`,
  (s: string) => `ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਢੁਕਵਾਂ ਸੰਬੰਧਕੀ ਚਿੰਨ੍ਹ ਚੁਣੋ:\n\n“${s}”`,
  (s: string) => `ਵਾਕ ਪੂਰਾ ਕਰਨ ਲਈ ਸਹੀ ਕਾਰਕੀ ਪਦ ਚੁਣੋ:\n\n“${s}”`,
  (s: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ 'ਤੇ ਕਿਹੜਾ ਸੰਬੰਧਕ ਆਵੇਗਾ?\n\n“${s}”`,
  (s: string) => `ਸਾਰਥਕ ਵਾਕ ਬਣਾਉਣ ਲਈ ਖ਼ਾਲੀ ਥਾਂ ਭਰੋ:\n\n“${s}”`,
  (s: string) => `“${s}” — ਇਸ ਵਾਕ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਕਾਰਕੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
];

interface ConnectorSentenceItem {
  readonly sentence: string;
  readonly connector: string;
  readonly typePa: string;
}

const CONNECTOR_SENTENCES: readonly ConnectorSentenceItem[] = [
  { sentence: "ਉਸ ਨੇ ਬਹੁਤ ਮਿਹਨਤ ਕੀਤੀ ਪਰ ਸਫ਼ਲ ਨਾ ਹੋ ਸਕਿਆ।", connector: "ਪਰ", typePa: "ਸਮਾਨ ਯੋਜਕ" },
  { sentence: "ਅਸੀਂ ਸਕੂਲ ਨਹੀਂ ਗਏ ਕਿਉਂਕਿ ਮੀਂਹ ਪੈ ਰਿਹਾ ਸੀ।", connector: "ਕਿਉਂਕਿ", typePa: "ਅਧੀਨ ਯੋਜਕ" },
  { sentence: "ਵਾਹ-ਵਾਹ! ਤੁਸੀਂ ਤਾਂ ਕਮਾਲ ਕਰ ਦਿੱਤੀ।", connector: "ਵਾਹ-ਵਾਹ!", typePa: "ਪ੍ਰਸ਼ੰਸਾ-ਵਾਚਕ ਵਿਸਮਿਕ" },
  { sentence: "ਸ਼ਾਬਾਸ਼! ਤੂੰ ਸਾਡਾ ਨਾਂ ਰੌਸ਼ਨ ਕਰ ਦਿੱਤਾ।", connector: "ਸ਼ਾਬਾਸ਼!", typePa: "ਪ੍ਰਸ਼ੰਸਾ-ਵਾਚਕ ਵਿਸਮਿਕ" },
  { sentence: "ਹਾਏ! ਵਿਚਾਰੇ ਗ਼ਰੀਬ ਦਾ ਸਭ ਕੁਝ ਲੁੱਟਿਆ ਗਿਆ।", connector: "ਹਾਏ!", typePa: "ਸ਼ੋਕ-ਵਾਚਕ ਵਿਸਮਿਕ" },
  { sentence: "ਘਰ ਦੇ ਸਾਹਮਣੇ ਇੱਕ ਵੱਡਾ ਪਾਰਕ ਹੈ।", connector: "ਦੇ ਸਾਹਮਣੇ", typePa: "ਅਪੂਰਨ ਸੰਬੰਧਕ" },
  { sentence: "ਮੇਜ਼ ਦੇ ਉੱਪਰ ਕਿਤਾਬ ਪਈ ਹੈ।", connector: "ਦੇ ਉੱਪਰ", typePa: "ਅਪੂਰਨ ਸੰਬੰਧਕ" },
  { sentence: "ਤੂੰ ਆਵੇਂਗਾ ਜਾਂ ਮੈਂ ਆਵਾਂ?", connector: "ਜਾਂ", typePa: "ਸਮਾਨ ਯੋਜਕ" },
  { sentence: "ਜੇਕਰ ਮਿਹਨਤ ਕਰੋਗੇ ਤਾਂ ਸਫ਼ਲ ਹੋਵੋਗੇ।", connector: "ਜੇਕਰ", typePa: "ਅਧੀਨ ਯੋਜਕ" },
  { sentence: "ਸੂਰਜ ਚੜ੍ਹਿਆ ਅਤੇ ਚਾਰੇ ਪਾਸੇ ਰੌਸ਼ਨੀ ਫੈਲ ਗਈ।", connector: "ਅਤੇ", typePa: "ਸਮਾਨ ਯੋਜਕ" },
  { sentence: "ਖ਼ਬਰਦਾਰ! ਅੱਗੇ ਰਸਤਾ ਖ਼ਰਾਬ ਹੈ।", connector: "ਖ਼ਬਰਦਾਰ!", typePa: "ਸੂਚਨਾ-ਵਾਚਕ ਵਿਸਮਿਕ" },
  { sentence: "ਲੱਖ ਲਾਹਣਤ! ਅਜਿਹੇ ਧੋਖੇਬਾਜ਼ ਵਿਹਾਰ 'ਤੇ।", connector: "ਲੱਖ ਲਾਹਣਤ!", typePa: "ਫਿਟਕਾਰ-ਵਾਚਕ ਵਿਸਮਿਕ" },
  { sentence: "ਜੀ ਆਇਆਂ ਨੂੰ! ਸਾਡੇ ਘਰ ਪਧਾਰਨ 'ਤੇ।", connector: "ਜੀ ਆਇਆਂ ਨੂੰ!", typePa: "ਸਤਿਕਾਰ-ਵਾਚਕ ਵਿਸਮਿਕ" },
  { sentence: "ਹੈਂ! ਇਹ ਕਿਵੇਂ ਹੋ ਸਕਦਾ ਹੈ?", connector: "ਹੈਂ!", typePa: "ਹੈਰਾਨੀ-ਵਾਚਕ ਵਿਸਮਿਕ" },
  { sentence: "ਉਹ ਕਮਜ਼ੋਰ ਹੈ ਇਸ ਲਈ ਤੇਜ਼ ਨਹੀਂ ਦੌੜ ਸਕਦਾ।", connector: "ਇਸ ਲਈ", typePa: "ਕਾਰਨ-ਵਾਚਕ ਯੋਜਕ" },
  { sentence: "ਤੂੰ ਚਾਹ ਪੀਵੇਂਗਾ ਕਿ ਕੌਫ਼ੀ?", connector: "ਕਿ", typePa: "ਸਮਾਨ ਯੋਜਕ" },
  { sentence: "ਭਾਵੇਂ ਉਹ ਗ਼ਰੀਬ ਹੈ ਪਰ ਇਮਾਨਦਾਰ ਹੈ।", connector: "ਭਾਵੇਂ", typePa: "ਅਧੀਨ ਯੋਜਕ" },
  { sentence: "ਨਦੀ ਦੇ ਕੰਢੇ ਰੁੱਖ ਲੱਗੇ ਹੋਏ ਹਨ।", connector: "ਦੇ ਕੰਢੇ", typePa: "ਅਪੂਰਨ ਸੰਬੰਧਕ" },
  { sentence: "ਮਾਂ ਨੇ ਬੱਚੇ ਨੂੰ ਪਿਆਰ ਕੀਤਾ।", connector: "ਨੂੰ", typePa: "ਪੂਰਨ ਸੰਬੰਧਕ" },
  { sentence: "ਰੁੱਖ ਤੋਂ ਪੱਤੇ ਡਿੱਗਦੇ ਹਨ।", connector: "ਤੋਂ", typePa: "ਪੂਰਨ ਸੰਬੰਧਕ" },
];

// -------------------------------------------------------------------------
// FAMILY 1: Karak Identification (ਕਾਰਕ ਸ਼ਨਾਖ਼ਤ)
// -------------------------------------------------------------------------
export function generateCP007F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  if (difficulty === "Easy") {
    const subType = rng.pickOne(["DIRECT_MARKER", "SENTENCE_MARKER_IDENTIFY"]);

    if (subType === "DIRECT_MARKER") {
      const markerPairs = [
        { marker: "ਨੇ", karak: "ਕਰਤਾ ਕਾਰਕ" },
        { marker: "ਨੂੰ", karak: "ਕਰਮ ਕਾਰਕ" },
        { marker: "ਨਾਲ", karak: "ਕਰਨ ਕਾਰਕ" },
        { marker: "ਰਾਹੀਂ", karak: "ਕਰਨ ਕਾਰਕ" },
        { marker: "ਲਈ", karak: "ਸੰਪ੍ਰਦਾਨ ਕਾਰਕ" },
        { marker: "ਵਾਸਤੇ", karak: "ਸੰਪ੍ਰਦਾਨ ਕਾਰਕ" },
        { marker: "ਤੋਂ", karak: "ਅਪਾਦਾਨ ਕਾਰਕ" },
        { marker: "ਕੋਲੋਂ", karak: "ਅਪਾਦਾਨ ਕਾਰਕ" },
        { marker: "ਦਾ / ਦੀ", karak: "ਸੰਬੰਧ ਕਾਰਕ" },
        { marker: "ਦੇ", karak: "ਸੰਬੰਧ ਕਾਰਕ" },
        { marker: "ਉੱਤੇ / ਵਿੱਚ", karak: "ਅਧਿਕਰਨ ਕਾਰਕ" },
        { marker: "ਅੰਦਰ", karak: "ਅਧਿਕਰਨ ਕਾਰਕ" },
      ];
      const chosen = rng.pickOne(markerPairs);
      const otherKaraks = markerPairs.filter((m) => m.karak !== chosen.karak).map((m) => m.karak);
      const stemTemplate = rng.pickOne(CP007_EASY_MARKER_TEMPLATES);

      return assembleCP007Question({
        familyId: "F01",
        seed,
        difficulty,
        stem: stemTemplate(chosen.marker),
        correctAnswer: chosen.karak,
        distractors: otherKaraks,
        explanation: `‘${chosen.marker}’ ${chosen.karak} ਦਾ ਪ੍ਰਮੁੱਖ ਕਾਰਕੀ ਚਿੰਨ੍ਹ ਹੈ।`,
        authorityIds: ["PUN-AUTH-KARAK-MARKER"],
      });
    }

    const karak = rng.pickOne(KARAK_ITEMS);
    const rawOtherKaraks = KARAK_ITEMS.filter((k) => k.karakNamePa !== karak.karakNamePa).map(
      (k) => k.karakNamePa
    );
    const otherKaraks = Array.from(new Set(rawOtherKaraks));
    const stemTemplate = rng.pickOne(CP007_EASY_SENTENCE_TEMPLATES);

    return assembleCP007Question({
      familyId: "F01",
      seed,
      difficulty,
      stem: stemTemplate(karak.sampleSentence, karak.targetToken),
      correctAnswer: karak.karakNamePa,
      distractors: otherKaraks,
      explanation: `${karak.explanationPa} (${karak.definitionPa})`,
      authorityIds: [karak.id],
    });
  }

  const karak = rng.pickOne(KARAK_ITEMS);
  const rawOtherKaraks = KARAK_ITEMS.filter((k) => k.karakNamePa !== karak.karakNamePa).map(
    (k) => k.karakNamePa
  );
  const otherKaraks = Array.from(new Set(rawOtherKaraks));
  const stemTemplate = rng.pickOne(CP007_F01_STEM_TEMPLATES);

  return assembleCP007Question({
    familyId: "F01",
    seed,
    difficulty,
    stem: stemTemplate(karak.sampleSentence, karak.targetToken),
    correctAnswer: karak.karakNamePa,
    distractors: otherKaraks,
    explanation: `${karak.explanationPa} (${karak.definitionPa})`,
    authorityIds: [karak.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: Connectors & Interjections (ਸੰਬੰਧਕ, ਯੋਜਕ, ਵਿਸਮਿਕ)
// -------------------------------------------------------------------------
export function generateCP007F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  if (difficulty === "Hard") {
    // Reverse inquiry: Which of the following is an example of <subtype>?
    const item = rng.pickOne(CONNECTOR_ITEMS);
    const sampleMarker = rng.pickOne(item.markers);
    const correctMarker = sampleMarker;
    const otherMarkers: string[] = [];
    for (const other of CONNECTOR_ITEMS) {
      if (other.subtypePa !== item.subtypePa) {
        otherMarkers.push(...other.markers);
      }
    }
    const distractors = rng.pickDistinct(Array.from(new Set(otherMarkers)), 3);
    const stemTemplate = rng.pickOne(CP007_F02_HARD_TEMPLATES);

    return assembleCP007Question({
      familyId: "F02",
      seed,
      difficulty,
      stem: stemTemplate(item.subtypePa),
      correctAnswer: correctMarker,
      distractors,
      explanation: `‘${correctMarker}’ ${item.subtypePa} ਹੈ। (${item.definitionPa})`,
      authorityIds: [item.id],
    });
  }

  if (difficulty === "Medium") {
    const useSentence = rng.pickOne([true, false]);
    if (useSentence) {
      const cs = rng.pickOne(CONNECTOR_SENTENCES);
      const otherSubtypes = CONNECTOR_ITEMS.filter((c) => c.subtypePa !== cs.typePa).map(
        (c) => c.subtypePa
      );

      return assembleCP007Question({
        familyId: "F02",
        seed,
        difficulty,
        stem: `ਵਾਕ “${cs.sentence}” ਵਿੱਚ ਵਰਤਿਆ ਸ਼ਬਦ ‘${cs.connector}’ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਕੀ ਹੈ?`,
        correctAnswer: cs.typePa,
        distractors: otherSubtypes,
        explanation: `ਵਾਕ ਵਿੱਚ ‘${cs.connector}’ ${cs.typePa} ਵਜੋਂ ਕਾਰਜ ਕਰ ਰਿਹਾ ਹੈ।`,
        authorityIds: ["PUN-AUTH-CONNECTOR-SENTENCE"],
      });
    }
  }

  const item = rng.pickOne(CONNECTOR_ITEMS);
  const sampleMarker = rng.pickOne(item.markers);
  const stemTemplate = rng.pickOne(CP007_F02_STEM_TEMPLATES);

  const otherSubtypes = CONNECTOR_ITEMS.filter((c) => c.subtypePa !== item.subtypePa).map(
    (c) => c.subtypePa
  );

  return assembleCP007Question({
    familyId: "F02",
    seed,
    difficulty,
    stem: stemTemplate(sampleMarker),
    correctAnswer: item.subtypePa,
    distractors: otherSubtypes,
    explanation: `‘${sampleMarker}’ ${item.subtypePa} ਹੈ। (${item.definitionPa})`,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 3: Case Marker In-Sentence Blank Fill (ਕਾਰਕੀ ਸੰਬੰਧਕ ਖ਼ਾਲੀ ਥਾਂ ਪੂਰਤੀ)
// -------------------------------------------------------------------------
export function generateCP007F03(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const karak = rng.pickOne(KARAK_ITEMS);

  // Derive pure postposition / case marker from targetToken
  const tokens = karak.targetToken.replace(/[!]/g, "").trim().split(/\s+/);
  const correctMarker = tokens.length > 1 ? tokens[tokens.length - 1]! : tokens[0]!;

  const blankSentence = karak.sampleSentence.replace(correctMarker, "_____");

  const allMarkers = ["ਨੇ", "ਨੂੰ", "ਨਾਲ", "ਲਈ", "ਤੋਂ", "ਵਿੱਚ", "ਉੱਤੇ", "ਦਾ", "ਦੀ", "ਦੇ"];
  const distractors = allMarkers.filter((m) => m !== correctMarker);
  const stemTemplate = rng.pickOne(CP007_F03_TEMPLATES);

  return assembleCP007Question({
    familyId: "F03",
    seed,
    difficulty,
    stem: stemTemplate(blankSentence),
    correctAnswer: correctMarker,
    distractors,
    explanation: `ਇਸ ਵਾਕ ਵਿੱਚ ‘${correctMarker}’ (${karak.karakNamePa}) ਦੀ ਵਰਤੋਂ ਸ਼ੁੱਧ ਅਰਥ ਪ੍ਰਦਾਨ ਕਰਦੀ ਹੈ: “${karak.sampleSentence}”`,
    authorityIds: [karak.id],
  });
}


// -------------------------------------------------------------------------
// FAMILY 4: Conjunction Classification & Clause Structure (ਯੋਜਕ ਸ਼੍ਰੇਣੀ ਵੰਡ ਅਤੇ ਉਪਵਾਕ ਸੰਯੋਜਨ)
// -------------------------------------------------------------------------

const CP007_F04_EASY_TEMPLATES = [
  (marker: string) => `ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਯੋਜਕ ‘${marker}’ ਕਿਸ ਮੁੱਖ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
  (marker: string) => `ਕੀ ਯੋਜਕ ‘${marker}’ ਸਮਾਨ ਯੋਜਕ ਹੈ ਜਾਂ ਅਧੀਨ ਯੋਜਕ?`,
  (marker: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${marker}’ ਦੀ ਸਹੀ ਯੋਜਕ ਸ਼੍ਰੇਣੀ ਚੁਣੋ:`,
];

const CP007_F04_MED_TEMPLATES = [
  (marker: string) => `ਯੋਜਕ ‘${marker}’ ਦਾ ਸਹੀ ਉਪ-ਵਰਗੀਕਰਨ (Subtype) ਕਿਹੜਾ ਹੈ?`,
  (marker: string) => `ਵਿਆਕਰਣਕ ਕਾਰਜ ਅਨੁਸਾਰ ‘${marker}’ ਕਿਸ ਕਿਸਮ ਦਾ ਯੋਜਕ ਹੈ?`,
  (sub: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ‘${sub}’ ਦੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
];

const CP007_F04_HARD_TEMPLATES = [
  (s: string, conn: string) => `ਵਾਕ “${s}” ਵਿੱਚ ਵਰਤਿਆ ਗਿਆ ਯੋਜਕ ‘${conn}’ ਕਿਸ ਸ਼੍ਰੇਣੀ ਦਾ ਹੈ?`,
  (s: string, conn: string) => `ਦਿੱਤੇ ਗਏ ਮਿਸ਼ਰਤ/ਸੰਯੁਕਤ ਵਾਕ ਵਿੱਚ ‘${conn}’ ਦਾ ਵਿਆਕਰਣਕ ਵਰਗ ਦੱਸੋ:\n“${s}”`,
];

export function generateCP007F04(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const mainCategories = [
    "ਸਮਾਨ ਯੋਜਕ (Coordinating Conjunction)",
    "ਅਧੀਨ ਯੋਜਕ (Subordinating Conjunction)",
    "ਪੂਰਨ ਸੰਬੰਧਕ",
    "ਅਪੂਰਨ ਸੰਬੰਧਕ",
  ];

  if (difficulty === "Easy") {
    const item = rng.pickOne(CONJUNCTION_TYPE_ITEMS);
    const marker = rng.pickOne(item.connectors);
    const correctAnswer = item.mainType === "SAMAN"
      ? "ਸਮਾਨ ਯੋਜਕ (Coordinating Conjunction)"
      : "ਅਧੀਨ ਯੋਜਕ (Subordinating Conjunction)";

    const distractors = mainCategories.filter((c) => c !== correctAnswer);
    const stem = rng.pickOne(CP007_F04_EASY_TEMPLATES)(marker);

    return assembleCP007Question({
      familyId: "F04",
      seed,
      difficulty,
      stem,
      correctAnswer,
      distractors,
      explanation: `‘${marker}’ ${correctAnswer} ਹੈ। ਇਹ ${item.mainType === "SAMAN" ? "ਸੁਤੰਤਰ ਸਮਾਨ ਪੱਧਰ ਦੇ ਵਾਕਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ" : "ਅਧੀਨ ਉਪਵਾਕ ਨੂੰ ਮੁੱਖ ਵਾਕ ਨਾਲ ਜੋੜਦਾ ਹੈ"}।`,
      authorityIds: [item.id],
    });
  }

  if (difficulty === "Medium") {
    const mode = rng.pickOne(["identifySubtype", "pickMarkerForSubtype"] as const);
    const item = rng.pickOne(CONJUNCTION_TYPE_ITEMS);

    if (mode === "identifySubtype") {
      const marker = rng.pickOne(item.connectors);
      const correctAnswer = item.subTypePa;
      const otherSubtypes = CONJUNCTION_TYPE_ITEMS.filter((c) => c.id !== item.id).map(
        (c) => c.subTypePa
      );
      const distractors = rng.pickDistinct(otherSubtypes, 3);
      const stem = rng.pickOne(CP007_F04_MED_TEMPLATES)(marker);

      return assembleCP007Question({
        familyId: "F04",
        seed,
        difficulty,
        stem,
        correctAnswer,
        distractors,
        explanation: `‘${marker}’ ${item.subTypePa} ਹੈ। (${item.explanationPa})`,
        authorityIds: [item.id],
      });
    } else {
      const correctAnswer = rng.pickOne(item.connectors);
      const otherMarkers: string[] = [];
      for (const other of CONJUNCTION_TYPE_ITEMS) {
        if (other.id !== item.id) {
          otherMarkers.push(...other.connectors);
        }
      }
      const distractors = rng.pickDistinct(Array.from(new Set(otherMarkers)), 3);
      const stem = `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਯੋਜਕ ‘${item.subTypePa}’ ਦੀ ਉਦਾਹਰਨ ਹੈ?`;

      return assembleCP007Question({
        familyId: "F04",
        seed,
        difficulty,
        stem,
        correctAnswer,
        distractors,
        explanation: `‘${correctAnswer}’ ${item.subTypePa} ਹੈ। (${item.explanationPa})`,
        authorityIds: [item.id],
      });
    }
  }

  // Hard Difficulty: In-Sentence Conjunction Clause Analysis
  const item = rng.pickOne(CONJUNCTION_TYPE_ITEMS);
  const connector = rng.pickOne(item.connectors);
  const stem = rng.pickOne(CP007_F04_HARD_TEMPLATES)(item.sampleSentence, connector);
  const otherSubtypes = CONJUNCTION_TYPE_ITEMS.filter((c) => c.id !== item.id).map(
    (c) => c.subTypePa
  );
  const distractors = rng.pickDistinct(otherSubtypes, 3);

  return assembleCP007Question({
    familyId: "F04",
    seed,
    difficulty,
    stem,
    correctAnswer: item.subTypePa,
    distractors,
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}
