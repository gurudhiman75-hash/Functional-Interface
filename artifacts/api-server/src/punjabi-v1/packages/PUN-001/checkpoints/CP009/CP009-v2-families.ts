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
  NEAR_SYNONYMS,
  type AntonymPair,
  type SynonymSet,
  type NearSynonymItem,
} from "./CP009-authorities";

function hashText(value: string): string {
  let hash = 2166136261;
  for (const ch of value.normalize("NFC")) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.normalize("NFC").trim()).filter(Boolean)));
}

function assemble(input: {
  familyId: string;
  seed: number;
  difficulty: PunjabiDifficulty;
  stem: string;
  correctAnswer: string;
  distractors: readonly string[];
  explanation: string;
  authorityIds: readonly string[];
}): PunjabiGeneratedQuestion {
  const rng = createRng(input.seed + Number.parseInt(input.familyId.slice(1), 10) * 9001);
  const correct = input.correctAnswer.normalize("NFC").trim();
  const distractors = unique(input.distractors).filter((value) => value !== correct);
  if (distractors.length < 3) {
    throw new Error(`CP009 V2 ${input.familyId} needs three unique distractors; got ${distractors.length}`);
  }
  const chosen = distractors.length === 3 ? distractors : rng.pickDistinct(distractors, 3);
  const raw: PunjabiQuestionOption[] = [
    { id: "c", text: correct, isCorrect: true },
    { id: "d1", text: chosen[0]!, isCorrect: false },
    { id: "d2", text: chosen[1]!, isCorrect: false },
    { id: "d3", text: chosen[2]!, isCorrect: false },
  ];
  const options = rng.shuffle(raw);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const canonical = [
    "PUN-001-CP009-V2",
    input.familyId,
    input.difficulty,
    input.stem,
    correct,
    [...input.authorityIds].sort().join(","),
  ].join("|");

  const question: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP009-V2-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: options.map((option) => option.text),
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
      generatorRevision: "2.0.0",
      fingerprint: `CP009-V2-${hashText(canonical)}`,
    },
  };
  assertValidPunjabiQuestion(question);
  return question;
}

function pickSynonym(seed: number): SynonymSet {
  return createRng(seed).pickOne(SYNONYM_SETS);
}

function pickAntonym(seed: number): AntonymPair {
  return createRng(seed).pickOne(ANTONYM_PAIRS);
}

function pickNear(seed: number): NearSynonymItem {
  return createRng(seed).pickOne(NEAR_SYNONYMS);
}

function synonymTruths(item: SynonymSet): string[] {
  return unique([item.primarySynonym, ...item.otherSynonyms]);
}

// F01 — direct synonym is deliberately an Easy family. The donor distractor
// pool is often the opposite semantic pole, which is acceptable for a basic
// recognition item but is not used to simulate Medium/Hard difficulty.
export function generateCP009V2F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 101);
  const item = pickSynonym(seed + 103);
  const reverse = rng.next() > 0.5;
  const source = reverse ? item.primarySynonym : item.headword;
  const target = reverse ? item.headword : item.primarySynonym;
  const templates = [
    `‘${source}’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${source}’ ਦੇ ਸਮਾਨ ਅਰਥ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।`,
    `‘${source}’ ਲਈ ਢੁਕਵਾਂ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਚੁਣੋ।`,
  ];
  return assemble({
    familyId: "F01", seed, difficulty, stem: rng.pickOne(templates), correctAnswer: target,
    distractors: item.distractors,
    explanation: `‘${source}’ ਅਤੇ ‘${target}’ ਇੱਕੋ ਜਾਂ ਬਹੁਤ ਨੇੜਲਾ ਅਰਥ ਪ੍ਰਗਟ ਕਰਦੇ ਹਨ।`,
    authorityIds: [item.id],
  });
}

// F02 — antonym donor records already carry source-side synonyms as traps,
// which makes the alternatives coherent and non-random.
export function generateCP009V2F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 201);
  const item = pickAntonym(seed + 211);
  const reverse = rng.next() > 0.5;
  const source = reverse ? item.antonym : item.word;
  const target = reverse ? item.word : item.antonym;
  const templates = [
    `‘${source}’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${source}’ ਦੇ ਉਲਟ ਅਰਥ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।`,
    `‘${source}’ ਦਾ ਸਹੀ ਵਿਰੋਧੀ ਸ਼ਬਦ ਦੱਸੋ।`,
  ];
  return assemble({
    familyId: "F02", seed, difficulty, stem: rng.pickOne(templates), correctAnswer: target,
    distractors: item.distractors,
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

// F03 — relationship classification avoids synthetic sentence insertion.
export function generateCP009V2F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 301);
  const useSynonym = rng.next() > 0.5;
  const relationOptions = ["ਸਮਾਨਾਰਥਕ", "ਵਿਰੋਧੀ", "ਕੇਵਲ ਉਚਾਰਨ-ਸਮਾਨ", "ਕੋਈ ਨਿਸ਼ਚਿਤ ਅਰਥ-ਸੰਬੰਧ ਨਹੀਂ"];
  if (useSynonym) {
    const item = pickSynonym(seed + 307);
    const target = rng.pickOne(synonymTruths(item));
    return assemble({
      familyId: "F03", seed, difficulty,
      stem: `‘${item.headword}’ ਅਤੇ ‘${target}’ ਵਿਚਲਾ ਅਰਥ-ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?`,
      correctAnswer: "ਸਮਾਨਾਰਥਕ",
      distractors: relationOptions.filter((value) => value !== "ਸਮਾਨਾਰਥਕ"),
      explanation: `‘${item.headword}’ ਅਤੇ ‘${target}’ ਸਮਾਨ ਜਾਂ ਨੇੜਲਾ ਅਰਥ ਪ੍ਰਗਟ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਇਹ ਸਮਾਨਾਰਥਕ ਹਨ।`,
      authorityIds: [item.id],
    });
  }
  const item = pickAntonym(seed + 313);
  return assemble({
    familyId: "F03", seed, difficulty,
    stem: `‘${item.word}’ ਅਤੇ ‘${item.antonym}’ ਵਿਚਲਾ ਅਰਥ-ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: "ਵਿਰੋਧੀ",
    distractors: relationOptions.filter((value) => value !== "ਵਿਰੋਧੀ"),
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

// F04 — uses only the donor's authored context sentence and explicit semantic
// contrast. No arbitrary word is injected into a generic sentence skeleton.
export function generateCP009V2F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 401);
  const item = pickNear(seed + 409);
  const templates = [
    `${item.contextSentence}\nਇਸ ਪ੍ਰਸੰਗ ਵਿੱਚ ‘${item.termA}’ ਅਤੇ ‘${item.termB}’ ਵਿੱਚੋਂ ਢੁਕਵਾਂ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    `${item.contextSentence}\nਵਾਕ ਦੇ ਭਾਵ ਅਨੁਸਾਰ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।`,
    `${item.contextSentence}\nਪ੍ਰਸੰਗ ਨੂੰ ਸਭ ਤੋਂ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਦਰਸਾਉਣ ਵਾਲਾ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
  ];
  const distractors = unique([
    ...item.distractors,
    item.correctTerm === item.termA ? item.termB : item.termA,
  ]);
  return assemble({
    familyId: "F04", seed, difficulty, stem: rng.pickOne(templates), correctAnswer: item.correctTerm,
    distractors, explanation: item.explanationPa, authorityIds: [item.id],
  });
}

// F05 — negative recognition: three genuine synonyms and one semantic outsider.
export function generateCP009V2F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 501);
  const item = pickSynonym(seed + 503);
  const truths = synonymTruths(item);
  if (truths.length < 3) throw new Error(`CP009 V2 ${item.id} needs at least three reviewed synonyms for F05`);
  const outsider = rng.pickOne(unique(item.distractors));
  return assemble({
    familyId: "F05", seed, difficulty,
    stem: `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ‘${item.headword}’ ਦਾ ਸਮਾਨਾਰਥਕ ਨਹੀਂ ਹੈ?`,
    correctAnswer: outsider,
    distractors: rng.pickDistinct(truths, 3),
    explanation: `‘${item.primarySynonym}’ ਸਮੇਤ ਦਿੱਤੇ ਹੋਰ ਸਮਾਨਾਰਥਕ ‘${item.headword}’ ਦੇ ਅਰਥ-ਖੇਤਰ ਵਿੱਚ ਹਨ, ਪਰ ‘${outsider}’ ਨਹੀਂ ਹੈ।`,
    authorityIds: [item.id],
  });
}

// F06 — synonym-set completion: only one option remains inside the same sense.
export function generateCP009V2F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 601);
  const item = pickSynonym(seed + 607);
  const truths = synonymTruths(item);
  if (truths.length < 3) throw new Error(`CP009 V2 ${item.id} needs at least three reviewed synonyms for F06`);
  const shown = rng.pickDistinct(truths, 2);
  const remaining = truths.filter((value) => !shown.includes(value));
  const correct = rng.pickOne(remaining.length ? remaining : truths);
  return assemble({
    familyId: "F06", seed, difficulty,
    stem: `‘${item.headword}’ ਦੇ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦਾਂ ਦੀ ਲੜੀ ਪੂਰੀ ਕਰੋ: ${shown.join(", ")}, ____`,
    correctAnswer: correct,
    distractors: item.distractors,
    explanation: `‘${correct}’ ਵੀ ‘${item.headword}’ ਦੇ ਸਮਾਨ ਅਰਥ ਵਾਲਾ ਸ਼ਬਦ ਹੈ।`,
    authorityIds: [item.id],
  });
}

// F07 — identify the one genuine synonym pair among three false same-format pairs.
export function generateCP009V2F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 701);
  const correctItem = pickSynonym(seed + 709);
  const falseItems = rng.pickDistinct(SYNONYM_SETS.filter((item) => item.id !== correctItem.id), 3);
  const correctPair = `${correctItem.headword} — ${correctItem.primarySynonym}`;
  const falsePairs = falseItems.map((item) => `${item.headword} — ${rng.pickOne(item.distractors)}`);
  return assemble({
    familyId: "F07", seed, difficulty,
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦਾਂ ਦੀ ਸਹੀ ਜੋੜੀ ਕਿਹੜੀ ਹੈ?",
    correctAnswer: correctPair,
    distractors: falsePairs,
    explanation: `‘${correctItem.headword}’ ਅਤੇ ‘${correctItem.primarySynonym}’ ਸਮਾਨ ਅਰਥ ਪ੍ਰਗਟ ਕਰਦੇ ਹਨ।`,
    authorityIds: [correctItem.id, ...falseItems.map((item) => item.id)],
  });
}

// F08 — identify the one genuine antonym pair; false pairs deliberately use a
// source word with one of its own synonyms so every option looks linguistically coherent.
export function generateCP009V2F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 801);
  const correctItem = pickAntonym(seed + 809);
  const falseItems = rng.pickDistinct(ANTONYM_PAIRS.filter((item) => item.id !== correctItem.id), 3);
  const correctPair = `${correctItem.word} — ${correctItem.antonym}`;
  const falsePairs = falseItems.map((item) => `${item.word} — ${rng.pickOne(item.distractors)}`);
  return assemble({
    familyId: "F08", seed, difficulty,
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਵਿਰੋਧੀ ਸ਼ਬਦਾਂ ਦੀ ਸਹੀ ਜੋੜੀ ਕਿਹੜੀ ਹੈ?",
    correctAnswer: correctPair,
    distractors: falsePairs,
    explanation: correctItem.explanationPa,
    authorityIds: [correctItem.id, ...falseItems.map((item) => item.id)],
  });
}

export const CP009_V2_FAMILY_GENERATORS = {
  F01: generateCP009V2F01,
  F02: generateCP009V2F02,
  F03: generateCP009V2F03,
  F04: generateCP009V2F04,
  F05: generateCP009V2F05,
  F06: generateCP009V2F06,
  F07: generateCP009V2F07,
  F08: generateCP009V2F08,
} as const;

export type CP009V2FamilyId = keyof typeof CP009_V2_FAMILY_GENERATORS;
