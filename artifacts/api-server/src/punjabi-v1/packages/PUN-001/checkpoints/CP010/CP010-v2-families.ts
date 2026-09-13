import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import { ONE_WORD_ITEMS, type OneWordItem } from "./CP010-authorities";

function normalize(value: string): string {
  return value.normalize("NFC").trim();
}

function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values.map(normalize).filter(Boolean)));
}

function hashText(value: string): string {
  let hash = 2166136261;
  for (const ch of value.normalize("NFC")) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function sameCategory(item: OneWordItem): OneWordItem[] {
  return ONE_WORD_ITEMS.filter((candidate) => candidate.category === item.category && candidate.id !== item.id);
}

const RICH_ITEMS = ONE_WORD_ITEMS.filter((item) => sameCategory(item).length >= 3);

if (RICH_ITEMS.length < 8) {
  throw new Error(`CP010 V2 requires a usable same-domain authority pool; found only ${RICH_ITEMS.length} rich items`);
}

function pickRichItem(seed: number): OneWordItem {
  return createRng(seed).pickOne(RICH_ITEMS);
}

function pickDistinctSameCategory(item: OneWordItem, count: number, seed: number): OneWordItem[] {
  const candidates = sameCategory(item);
  if (candidates.length < count) {
    throw new Error(`CP010 V2 ${item.id}/${item.category} needs ${count} same-domain records; found ${candidates.length}`);
  }
  return createRng(seed).pickDistinct(candidates, count);
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
  const rng = createRng(input.seed + Number.parseInt(input.familyId.slice(1), 10) * 10007);
  const correct = normalize(input.correctAnswer);
  const distractors = unique(input.distractors).filter((value) => value !== correct);
  if (distractors.length < 3) {
    throw new Error(`CP010 V2 ${input.familyId} needs three unique distractors; got ${distractors.length}`);
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
    "PUN-001-CP010-V2",
    input.familyId,
    input.difficulty,
    input.stem,
    correct,
    [...input.authorityIds].sort().join(","),
  ].join("|");

  const question: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP010-V2-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: options.map((option) => option.text),
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
      generatorRevision: "2.0.0",
      fingerprint: `CP010-V2-${hashText(canonical)}`,
    },
  };
  assertValidPunjabiQuestion(question);
  return question;
}

// F01 — basic phrase -> one-word recognition. Easy only.
export function generateCP010V2F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 101);
  const item = rng.pickOne(ONE_WORD_ITEMS);
  const templates = [
    `‘${item.phrasePa}’ ਲਈ ਢੁਕਵਾਂ ਇੱਕ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${item.phrasePa}’ ਦਾ ਭਾਵ ਇੱਕ ਸ਼ਬਦ ਵਿੱਚ ਕਿਹੜਾ ਹੈ?`,
    `‘${item.phrasePa}’ ਦੀ ਥਾਂ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।`,
  ];
  return assemble({
    familyId: "F01", seed, difficulty, stem: rng.pickOne(templates), correctAnswer: item.wordPa,
    distractors: item.distractors,
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

// F02 — reverse recognition: word -> exact reviewed phrase.
export function generateCP010V2F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 201);
  const item = difficulty === "Medium" ? pickRichItem(seed + 211) : rng.pickOne(ONE_WORD_ITEMS);
  const phraseDistractors = difficulty === "Medium"
    ? pickDistinctSameCategory(item, 3, seed + 223).map((candidate) => candidate.phrasePa)
    : rng.pickDistinct(ONE_WORD_ITEMS.filter((candidate) => candidate.id !== item.id), 3).map((candidate) => candidate.phrasePa);
  const templates = [
    `‘${item.wordPa}’ ਸ਼ਬਦ ਦਾ ਸਹੀ ਅਰਥ ਕਿਹੜਾ ਹੈ?`,
    `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਾਕੰਸ਼ ‘${item.wordPa}’ ਦਾ ਭਾਵ ਦੱਸਦਾ ਹੈ?`,
    `‘${item.wordPa}’ ਕਿਸ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
  ];
  return assemble({
    familyId: "F02", seed, difficulty, stem: rng.pickOne(templates), correctAnswer: item.phrasePa,
    distractors: phraseDistractors,
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

// F03 — same-domain phrase -> word discrimination. Difficulty comes from semantic proximity,
// not from a harder-sounding instruction.
export function generateCP010V2F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 301);
  const item = pickRichItem(seed + 307);
  const peers = pickDistinctSameCategory(item, 3, seed + 311);
  const templates = [
    `‘${item.phrasePa}’ ਲਈ ਸਭ ਤੋਂ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।`,
    `ਇੱਕੋ ਅਰਥ-ਖੇਤਰ ਦੇ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ‘${item.phrasePa}’ ਲਈ ਢੁਕਵਾਂ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    `ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${item.phrasePa}’ ਦਾ ਸਹੀ ਇੱਕ-ਸ਼ਬਦੀ ਰੂਪ ਚੁਣੋ।`,
  ];
  return assemble({
    familyId: "F03", seed, difficulty, stem: rng.pickOne(templates), correctAnswer: item.wordPa,
    distractors: peers.map((peer) => peer.wordPa),
    explanation: item.explanationPa,
    authorityIds: [item.id, ...peers.map((peer) => peer.id)],
  });
}

// F04 — identify the one incorrect mapping among same-domain records.
export function generateCP010V2F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const target = pickRichItem(seed + 401);
  const peers = pickDistinctSameCategory(target, 3, seed + 409);
  const wrongWord = peers[0]!.wordPa;
  const incorrectPair = `${target.phrasePa} — ${wrongWord}`;
  const validPairs = peers.map((peer) => `${peer.phrasePa} — ${peer.wordPa}`);
  return assemble({
    familyId: "F04", seed, difficulty,
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਾਕੰਸ਼–ਸ਼ਬਦ ਮੇਲ ਗ਼ਲਤ ਹੈ?",
    correctAnswer: incorrectPair,
    distractors: validPairs,
    explanation: `‘${target.phrasePa}’ ਲਈ ਸਹੀ ਸ਼ਬਦ ‘${target.wordPa}’ ਹੈ।`,
    authorityIds: [target.id, ...peers.map((peer) => peer.id)],
  });
}

// F05 — identify the one correct mapping; false pairs stay within the same semantic domain.
export function generateCP010V2F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const target = pickRichItem(seed + 501);
  const peers = pickDistinctSameCategory(target, 3, seed + 509);
  const correctPair = `${target.phrasePa} — ${target.wordPa}`;
  const falsePairs = peers.map((peer, index) => {
    const wrongCandidates = [target, ...peers].filter((candidate) => candidate.wordPa !== peer.wordPa);
    const wrong = wrongCandidates[(index + 1) % wrongCandidates.length]!;
    return `${peer.phrasePa} — ${wrong.wordPa}`;
  });
  return assemble({
    familyId: "F05", seed, difficulty,
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਵਾਕੰਸ਼ ਅਤੇ ਇੱਕ ਸ਼ਬਦ ਦਾ ਸਹੀ ਮੇਲ ਕਿਹੜਾ ਹੈ?",
    correctAnswer: correctPair,
    distractors: falsePairs,
    explanation: `‘${target.phrasePa}’ ਲਈ ‘${target.wordPa}’ ਸਹੀ ਇੱਕ-ਸ਼ਬਦੀ ਰੂਪ ਹੈ।`,
    authorityIds: [target.id, ...peers.map((peer) => peer.id)],
  });
}

// F06 — two phrase mappings in order. Hard only.
export function generateCP010V2F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const first = pickRichItem(seed + 601);
  const peers = pickDistinctSameCategory(first, 3, seed + 607);
  const second = peers[0]!;
  const altA = peers[1]!;
  const altB = peers[2]!;
  const correct = `${first.wordPa} — ${second.wordPa}`;
  const distractors = unique([
    `${second.wordPa} — ${first.wordPa}`,
    `${first.wordPa} — ${altA.wordPa}`,
    `${altB.wordPa} — ${second.wordPa}`,
    `${altA.wordPa} — ${altB.wordPa}`,
  ]);
  return assemble({
    familyId: "F06", seed, difficulty,
    stem: `‘${first.phrasePa}’ ਅਤੇ ‘${second.phrasePa}’ ਲਈ ਕ੍ਰਮਵਾਰ ਸਹੀ ਸ਼ਬਦ ਕਿਹੜੇ ਹਨ?`,
    correctAnswer: correct,
    distractors,
    explanation: `ਪਹਿਲੇ ਵਾਕੰਸ਼ ਲਈ ‘${first.wordPa}’ ਅਤੇ ਦੂਜੇ ਲਈ ‘${second.wordPa}’ ਸਹੀ ਸ਼ਬਦ ਹੈ।`,
    authorityIds: [first.id, ...peers.map((peer) => peer.id)],
  });
}

// F07 — reverse two-item mapping: two words -> their phrases in order. Hard only.
export function generateCP010V2F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const first = pickRichItem(seed + 701);
  const peers = pickDistinctSameCategory(first, 3, seed + 709);
  const second = peers[0]!;
  const altA = peers[1]!;
  const altB = peers[2]!;
  const correct = `${first.phrasePa} — ${second.phrasePa}`;
  const distractors = unique([
    `${second.phrasePa} — ${first.phrasePa}`,
    `${first.phrasePa} — ${altA.phrasePa}`,
    `${altB.phrasePa} — ${second.phrasePa}`,
    `${altA.phrasePa} — ${altB.phrasePa}`,
  ]);
  return assemble({
    familyId: "F07", seed, difficulty,
    stem: `‘${first.wordPa}’ ਅਤੇ ‘${second.wordPa}’ ਦੇ ਅਰਥ ਕ੍ਰਮਵਾਰ ਕਿਹੜੇ ਹਨ?`,
    correctAnswer: correct,
    distractors,
    explanation: `‘${first.wordPa}’ ਦਾ ਭਾਵ ‘${first.phrasePa}’ ਅਤੇ ‘${second.wordPa}’ ਦਾ ਭਾਵ ‘${second.phrasePa}’ ਹੈ।`,
    authorityIds: [first.id, ...peers.map((peer) => peer.id)],
  });
}

// F08 — same-domain definition precision. Hard only.
export function generateCP010V2F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = pickRichItem(seed + 801);
  const peers = pickDistinctSameCategory(item, 3, seed + 809);
  return assemble({
    familyId: "F08", seed, difficulty,
    stem: `‘${item.wordPa}’ ਦੀ ਸਭ ਤੋਂ ਸਹੀ ਪਰਿਭਾਸ਼ਾ ਚੁਣੋ।`,
    correctAnswer: item.phrasePa,
    distractors: peers.map((peer) => peer.phrasePa),
    explanation: item.explanationPa,
    authorityIds: [item.id, ...peers.map((peer) => peer.id)],
  });
}

export const CP010_V2_FAMILY_GENERATORS = {
  F01: generateCP010V2F01,
  F02: generateCP010V2F02,
  F03: generateCP010V2F03,
  F04: generateCP010V2F04,
  F05: generateCP010V2F05,
  F06: generateCP010V2F06,
  F07: generateCP010V2F07,
  F08: generateCP010V2F08,
} as const;

export type CP010V2FamilyId = keyof typeof CP010_V2_FAMILY_GENERATORS;
