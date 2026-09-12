/**
 * CP008 Question Families:
 * CP008-F01: Prefix Identification (ਅਗੇਤਰ ਪਛਾਣ)
 * CP008-F02: Suffix Identification (ਪਿਛੇਤਰ ਪਛਾਣ)
 * CP008-F03: Pseudo-Affix Discrimination (ਅਗੇਤਰ/ਪਿਛੇਤਰ ਰਹਿਤ ਮੂਲ ਸ਼ਬਦ ਪਛਾਣ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  PREFIX_ITEMS,
  SUFFIX_ITEMS,
  type AffixItem,
} from "./CP008-authorities";

function assembleCP008Question(input: {
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
      `Insufficient distinct distractors for CP008 ${input.familyId}. Got ${filteredDistractors.length}`
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
    id: `PUN-001-CP008-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP008",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP008-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

const CP008_F01_EASY_TEMPLATES = [
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਵਿੱਚ ਕਿਹੜਾ ਅਗੇਤਰ ਵਰਤਿਆ ਗਿਆ ਹੈ?`,
  (w: string) => `‘${w}’ ਸ਼ਬਦ ਵਿੱਚ ਲੱਗੇ ਅਗੇਤਰ ਦੀ ਪਛਾਣ ਕਰੋ:`,
  (w: string) => `ਟਕਸਾਲੀ ਸ਼ਬਦ-ਜੋੜ ਅਨੁਸਾਰ ‘${w}’ ਵਿੱਚ ਕਿਹੜਾ ਅਗੇਤਰ ਮੌਜੂਦ ਹੈ?`,
];

const CP008_F01_COMPLEX_TEMPLATES = [
  (af: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ‘${af}’ ਅਗੇਤਰ ਲਗਾ ਕੇ ਬਣਿਆ ਹੈ?`,
  (af: string) => `ਕਿਹੜੇ ਸ਼ਬਦ ਦੀ ਰਚਨਾ ਵਿੱਚ ‘${af}’ ਅਗੇਤਰ ਵਜੋਂ ਵਰਤਿਆ ਗਿਆ ਹੈ?`,
  (af: string) => `ਦਿੱਤੇ ਗਏ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${af}’ ਅਗੇਤਰ ਵਾਲਾ ਸ਼ੁੱਧ ਸ਼ਬਦ ਚੁਣੋ:`,
  (af: string) => `ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘${af}’ ਅਗੇਤਰ ਨਾਲ ਬਣਿਆ ਸਹੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
];

const CP008_F02_EASY_TEMPLATES = [
  (w: string) => `ਸ਼ਬਦ ‘${w}’ ਵਿੱਚ ਕਿਹੜਾ ਪਿਛੇਤਰ ਵਰਤਿਆ ਗਿਆ ਹੈ?`,
  (w: string) => `‘${w}’ ਸ਼ਬਦ ਦੇ ਅੰਤ ਵਿੱਚ ਜੁੜੇ ਪਿਛੇਤਰ ਦੀ ਸ਼ਨਾਖ਼ਤ ਕਰੋ:`,
  (w: string) => `ਦਿੱਤੇ ਗਏ ਸ਼ਬਦ ‘${w}’ ਵਿੱਚ ਮੂਲ ਪਿਛੇਤਰ ਕਿਹੜਾ ਹੈ?`,
];

const CP008_F02_COMPLEX_TEMPLATES = [
  (af: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ‘${af}’ ਪਿਛੇਤਰ ਲਗਾ ਕੇ ਬਣਿਆ ਹੈ?`,
  (af: string) => `ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ‘${af}’ ਪਿਛੇਤਰ ਦੀ ਸਹੀ ਵਰਤੋਂ ਹੋਈ ਹੈ?`,
  (af: string) => `ਦਿੱਤੇ ਗਏ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${af}’ ਪਿਛੇਤਰ ਯੁਕਤ ਸ਼ਬਦ ਚੁਣੋ:`,
  (af: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${af}’ ਪਿਛੇਤਰ ਨਾਲ ਬਣਿਆ ਢੁਕਵਾਂ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
];

const CP008_F03_TEMPLATES = [
  (af: string, type: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਸ਼ਬਦ ਵਿੱਚ ‘${af}’ ${type} ਵਜੋਂ ਨਹੀਂ ਲੱਗਿਆ ਹੋਇਆ?`,
  (af: string, type: string) => `ਕਿਹੜਾ ਸ਼ਬਦ ‘${af}’ ${type} ਤੋਂ ਰਹਿਤ (ਅਖੰਡ ਮੂਲ ਸ਼ਬਦ) ਹੈ?`,
  (af: string, type: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ਉਹ ਸ਼ਬਦ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ‘${af}’ ${type} ਨਹੀਂ ਹੈ:`,
  (af: string, type: string) => `ਕਿਹੜਾ ਸ਼ਬਦ ‘${af}’ ${type} ਲਗਾ ਕੇ ਨਹੀਂ ਬਣਿਆ?`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Prefix Identification (ਅਗੇਤਰ ਪਛਾਣ)
// -------------------------------------------------------------------------
export function generateCP008F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const item = rng.pickOne(PREFIX_ITEMS);
  const word = rng.pickOne(item.validWords);

  if (difficulty === "Easy") {
    // Find the prefix used in a given word
    const otherPrefixes = PREFIX_ITEMS.filter((p) => p.affix !== item.affix).map((p) => p.affix);
    const stem = rng.pickOne(CP008_F01_EASY_TEMPLATES)(word);

    return assembleCP008Question({
      familyId: "F01",
      seed,
      difficulty,
      stem,
      correctAnswer: item.affix,
      distractors: otherPrefixes,
      explanation: `‘${word}’ ਵਿੱਚ ਮੂਲ ਸ਼ਬਦ ਦੇ ਅੱਗੇ ‘${item.affix}’ ਅਗੇਤਰ ਲੱਗਿਆ ਹੈ। (${item.meaningPa})`,
      authorityIds: [item.id],
    });
  }

  // Medium / Hard: Choose which word is formed using the given prefix
  const otherItemWords: string[] = [];
  for (const other of PREFIX_ITEMS) {
    if (other.affix !== item.affix) {
      otherItemWords.push(...other.validWords);
    }
  }
  const medTemplates = [
    (af: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ‘${af}’ ਅਗੇਤਰ ਲਗਾ ਕੇ ਬਣਿਆ ਹੈ?`,
    (af: string) => `ਕਿਹੜੇ ਸ਼ਬਦ ਦੀ ਰਚਨਾ ਵਿੱਚ ‘${af}’ ਅਗੇਤਰ ਵਜੋਂ ਵਰਤਿਆ ਗਿਆ ਹੈ?`,
  ];
  const hardTemplates = [
    (af: string) => `ਦਿੱਤੇ ਗਏ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${af}’ ਅਗੇਤਰ ਵਾਲਾ ਸ਼ੁੱਧ ਸ਼ਬਦ ਚੁਣੋ:`,
    (af: string) => `ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘${af}’ ਅਗੇਤਰ ਨਾਲ ਬਣਿਆ ਸਹੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  ];
  const templates = difficulty === "Hard" ? hardTemplates : medTemplates;
  const stem = rng.pickOne(templates)(item.affix);

  return assembleCP008Question({
    familyId: "F01",
    seed,
    difficulty,
    stem,
    correctAnswer: word,
    distractors: otherItemWords,
    explanation: `ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ‘${item.affix}’ ਅਗੇਤਰ ਦੀ ਸਹੀ ਵਰਤੋਂ ਹੋਈ ਹੈ। (${item.meaningPa})`,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: Suffix Identification (ਪਿਛੇਤਰ ਪਛਾਣ)
// -------------------------------------------------------------------------
export function generateCP008F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const item = rng.pickOne(SUFFIX_ITEMS);
  const word = rng.pickOne(item.validWords);

  if (difficulty === "Easy") {
    const otherSuffixes = SUFFIX_ITEMS.filter((s) => s.affix !== item.affix).map((s) => s.affix);
    const stem = rng.pickOne(CP008_F02_EASY_TEMPLATES)(word);

    return assembleCP008Question({
      familyId: "F02",
      seed,
      difficulty,
      stem,
      correctAnswer: item.affix,
      distractors: otherSuffixes,
      explanation: `‘${word}’ ਦੇ ਅੰਤ ਵਿੱਚ ‘${item.affix}’ ਪਿਛੇਤਰ ਲੱਗਾ ਹੈ। (${item.meaningPa})`,
      authorityIds: [item.id],
    });
  }

  const otherItemWords: string[] = [];
  for (const other of SUFFIX_ITEMS) {
    if (other.affix !== item.affix) {
      otherItemWords.push(...other.validWords);
    }
  }
  const medTemplates = [
    (af: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ‘${af}’ ਪਿਛੇਤਰ ਲਗਾ ਕੇ ਬਣਿਆ ਹੈ?`,
    (af: string) => `ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ‘${af}’ ਪਿਛੇਤਰ ਦੀ ਸਹੀ ਵਰਤੋਂ ਹੋਈ ਹੈ?`,
  ];
  const hardTemplates = [
    (af: string) => `ਦਿੱਤੇ ਗਏ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${af}’ ਪਿਛੇਤਰ ਯੁਕਤ ਸ਼ਬਦ ਚੁਣੋ:`,
    (af: string) => `ਟਕਸਾਲੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ‘${af}’ ਪਿਛੇਤਰ ਨਾਲ ਬਣਿਆ ਢੁਕਵਾਂ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  ];
  const templates = difficulty === "Hard" ? hardTemplates : medTemplates;
  const stem = rng.pickOne(templates)(item.affix);

  return assembleCP008Question({
    familyId: "F02",
    seed,
    difficulty,
    stem,
    correctAnswer: word,
    distractors: otherItemWords,
    explanation: `ਸ਼ਬਦ ‘${word}’ ਵਿੱਚ ‘${item.affix}’ ਪਿਛੇਤਰ ਦੀ ਸ਼ੁੱਧ ਵਰਤੋਂ ਹੋਈ ਹੈ। (${item.meaningPa})`,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 3: Pseudo-Affix Discrimination (ਅਗੇਤਰ/ਪਿਛੇਤਰ ਰਹਿਤ ਸ਼ਬਦ)
// -------------------------------------------------------------------------
export function generateCP008F03(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const isPrefixTest = rng.next() > 0.5;
  const item = isPrefixTest ? rng.pickOne(PREFIX_ITEMS) : rng.pickOne(SUFFIX_ITEMS);

  const spuriousWord = rng.pickOne(item.spuriousWords);
  const validWords = rng.pickDistinct(item.validWords, 3);

  const affixTypeLabel = isPrefixTest ? "ਅਗੇਤਰ" : "ਪਿਛੇਤਰ";
  const easyTemplates = [
    (af: string, type: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਸ਼ਬਦ ਵਿੱਚ ‘${af}’ ${type} ਵਜੋਂ ਨਹੀਂ ਲੱਗਿਆ ਹੋਇਆ?`,
  ];
  const medTemplates = [
    (af: string, type: string) => `ਕਿਹੜਾ ਸ਼ਬਦ ‘${af}’ ${type} ਤੋਂ ਰਹਿਤ (ਅਖੰਡ ਮੂਲ ਸ਼ਬਦ) ਹੈ?`,
    (af: string, type: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ਉਹ ਸ਼ਬਦ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ‘${af}’ ${type} ਨਹੀਂ ਹੈ:`,
  ];
  const hardTemplates = [
    (af: string, type: string) => `ਕਿਹੜਾ ਸ਼ਬਦ ‘${af}’ ${type} ਲਗਾ ਕੇ ਨਹੀਂ ਬਣਿਆ?`,
    (af: string, type: string) => `ਪ੍ਰੀਖਿਆ ਪੱਧਰ 'ਤੇ ਸ਼ਨਾਖ਼ਤ ਕਰੋ: ‘${af}’ ${type} ਰਹਿਤ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  ];
  const templates = difficulty === "Easy" ? easyTemplates : difficulty === "Hard" ? hardTemplates : medTemplates;
  const stem = rng.pickOne(templates)(item.affix, affixTypeLabel);

  return assembleCP008Question({
    familyId: "F03",
    seed,
    difficulty,
    stem,
    correctAnswer: spuriousWord,
    distractors: validWords,
    explanation: `ਸ਼ਬਦ ‘${spuriousWord}’ ਇੱਕ ਅਖੰਡ ਮੂਲ ਸ਼ਬਦ (Root word) ਹੈ, ਇਸ ਵਿੱਚ ‘${item.affix}’ ਕੋਈ ${affixTypeLabel} ਨਹੀਂ ਹੈ। ਬਾਕੀ ਤਿੰਨੋਂ ਸ਼ਬਦ [${validWords.join(", ")}] ‘${item.affix}’ ${affixTypeLabel} ਨਾਲ ਬਣੇ ਹਨ।`,
    authorityIds: [item.id],
  });
}
