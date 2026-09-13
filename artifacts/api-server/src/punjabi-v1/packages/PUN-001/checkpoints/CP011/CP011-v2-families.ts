import { createRng } from "../../../../core/deterministic-rng";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionOption } from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import { CP011_IDIOM_ITEMS, LITERAL_VS_FIGURATIVE_ITEMS, type IdiomItem } from "./CP011-authorities";

function normalize(value: string): string {
  return value.normalize("NFC").trim();
}

function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values.map(normalize).filter(Boolean)));
}

function tokens(value: string): Set<string> {
  return new Set(
    normalize(value)
      .replace(/[‘’“”"'.,;:!?()\-–—/]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1)
  );
}

function similarity(a: string, b: string): number {
  const aa = tokens(a);
  const bb = tokens(b);
  if (!aa.size || !bb.size) return 0;
  let shared = 0;
  for (const t of aa) if (bb.has(t)) shared++;
  return shared / Math.max(aa.size, bb.size);
}

function nearestByMeaning(item: IdiomItem, count: number, seed: number): IdiomItem[] {
  const ranked = CP011_IDIOM_ITEMS
    .filter((candidate) => candidate.id !== item.id && candidate.idiomPa !== item.idiomPa && candidate.meaningPa !== item.meaningPa)
    .map((candidate) => ({ candidate, score: similarity(item.meaningPa, candidate.meaningPa) }))
    .sort((a, b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id));
  const head = ranked.slice(0, Math.max(count * 4, 12)).map((entry) => entry.candidate);
  if (head.length < count) throw new Error(`CP011 V2 ${item.id} lacks enough semantic peers`);
  return createRng(seed).pickDistinct(head, count);
}

function hashText(value: string): string {
  let hash = 2166136261;
  for (const ch of value.normalize("NFC")) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
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
  const rng = createRng(input.seed + Number.parseInt(input.familyId.slice(1), 10) * 11003);
  const correct = normalize(input.correctAnswer);
  const distractors = unique(input.distractors).filter((value) => value !== correct);
  if (distractors.length < 3) {
    throw new Error(`CP011 V2 ${input.familyId} needs three unique distractors; got ${distractors.length}`);
  }
  const chosen = distractors.length === 3 ? distractors : rng.pickDistinct(distractors, 3);
  const raw: PunjabiQuestionOption[] = [
    { id: "c", text: correct, isCorrect: true },
    { id: "d1", text: chosen[0]!, isCorrect: false },
    { id: "d2", text: chosen[1]!, isCorrect: false },
    { id: "d3", text: chosen[2]!, isCorrect: false },
  ];
  const options = rng.shuffle(raw);
  const correctIndex = options.findIndex((o) => o.isCorrect);
  const canonical = [
    "PUN-001-CP011-V2",
    input.familyId,
    input.difficulty,
    input.stem,
    correct,
    [...input.authorityIds].sort().join(","),
  ].join("|");

  const question: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP011-V2-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: options.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP011",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "2.0.0",
      fingerprint: `CP011-V2-${hashText(canonical)}`,
    },
  };
  assertValidPunjabiQuestion(question);
  return question;
}

function pickItem(seed: number): IdiomItem {
  return createRng(seed).pickOne(CP011_IDIOM_ITEMS);
}

// F01 — direct idiom meaning recognition. Easy only.
export function generateCP011V2F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 101);
  const item = pickItem(seed + 103);
  const templates = [
    `ਮੁਹਾਵਰੇ ‘${item.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ਕਿਹੜਾ ਹੈ?`,
    `‘${item.idiomPa}’ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਭਾਵ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ?`,
    `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${item.idiomPa}’ ਦਾ ਢੁਕਵਾਂ ਅਰਥ ਚੁਣੋ।`,
  ];
  return assemble({
    familyId: "F01", seed, difficulty, stem: rng.pickOne(templates), correctAnswer: item.meaningPa,
    distractors: item.distractors, explanation: item.explanationPa, authorityIds: [item.id],
  });
}

// F02 — authored sentence context -> idiom. Medium/Hard.
export function generateCP011V2F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = pickItem(seed + 203);
  const peers = nearestByMeaning(item, 3, seed + 211);
  return assemble({
    familyId: "F02", seed, difficulty,
    stem: `ਵਾਕ ਦੇ ਪ੍ਰਸੰਗ ਅਨੁਸਾਰ ਖ਼ਾਲੀ ਥਾਂ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਚੁਣੋ:\n“${item.contextSentence}”`,
    correctAnswer: item.idiomPa,
    distractors: peers.map((p) => p.idiomPa),
    explanation: `${item.explanationPa} ਇਸ ਪ੍ਰਸੰਗ ਵਿੱਚ ‘${item.idiomPa}’ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਹੈ।`,
    authorityIds: [item.id, ...peers.map((p) => p.id)],
  });
}

// F03 — meaning -> idiom. Easy/Medium; Medium uses nearest semantic peers.
export function generateCP011V2F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 301);
  const item = pickItem(seed + 307);
  const peers = difficulty === "Medium"
    ? nearestByMeaning(item, 3, seed + 311)
    : rng.pickDistinct(CP011_IDIOM_ITEMS.filter((p) => p.id !== item.id && p.idiomPa !== item.idiomPa), 3);
  return assemble({
    familyId: "F03", seed, difficulty,
    stem: `‘${item.meaningPa}’ ਭਾਵ ਲਈ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: item.idiomPa,
    distractors: peers.map((p) => p.idiomPa),
    explanation: item.explanationPa,
    authorityIds: [item.id, ...peers.map((p) => p.id)],
  });
}

// F04 — literal/figurative discrimination, but learner-facing copy stays Punjabi-only.
export function generateCP011V2F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 401);
  const item = rng.pickOne(LITERAL_VS_FIGURATIVE_ITEMS);
  const others = rng.pickDistinct(LITERAL_VS_FIGURATIVE_ITEMS.filter((p) => p.id !== item.id), 2);
  if (difficulty === "Hard") {
    return assemble({
      familyId: "F04", seed, difficulty,
      stem: `ਮੁਹਾਵਰੇ ‘${item.idiomPa}’ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਕਿਹੜਾ ਅਰਥ ਕੇਵਲ ਸ਼ਾਬਦਿਕ ਭੁਲੇਖਾ ਹੈ?`,
      correctAnswer: item.literalMeaning,
      distractors: [item.figurativeMeaning, ...others.map((p) => p.figurativeMeaning)],
      explanation: `‘${item.idiomPa}’ ਦਾ ਮੁਹਾਵਰੇਦਾਰ ਅਰਥ ‘${item.figurativeMeaning}’ ਹੈ; ‘${item.literalMeaning}’ ਕੇਵਲ ਸ਼ਾਬਦਿਕ ਪੜ੍ਹਤ ਹੈ।`,
      authorityIds: [item.id, ...others.map((p) => p.id)],
    });
  }
  return assemble({
    familyId: "F04", seed, difficulty,
    stem: `ਮੁਹਾਵਰੇ ‘${item.idiomPa}’ ਦਾ ਸਹੀ ਮੁਹਾਵਰੇਦਾਰ ਅਰਥ ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: item.figurativeMeaning,
    distractors: [item.literalMeaning, ...others.map((p) => p.figurativeMeaning)],
    explanation: item.explanationPa,
    authorityIds: [item.id, ...others.map((p) => p.id)],
  });
}

// F05 — identify the one correct idiom/meaning pair. Medium/Hard.
export function generateCP011V2F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = pickItem(seed + 503);
  const peers = nearestByMeaning(item, 3, seed + 509);
  const correct = `${item.idiomPa} — ${item.meaningPa}`;
  const falsePairs = peers.map((peer, i) => {
    const wrong = [item, ...peers].filter((p) => p.meaningPa !== peer.meaningPa)[(i + 1) % 3]!;
    return `${peer.idiomPa} — ${wrong.meaningPa}`;
  });
  return assemble({
    familyId: "F05", seed, difficulty,
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਮੁਹਾਵਰੇ ਅਤੇ ਅਰਥ ਦਾ ਸਹੀ ਮੇਲ ਕਿਹੜਾ ਹੈ?",
    correctAnswer: correct,
    distractors: falsePairs,
    explanation: `‘${item.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ‘${item.meaningPa}’ ਹੈ।`,
    authorityIds: [item.id, ...peers.map((p) => p.id)],
  });
}

// F06 — identify the one incorrect idiom/meaning pair. Medium/Hard.
export function generateCP011V2F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = pickItem(seed + 601);
  const peers = nearestByMeaning(item, 3, seed + 607);
  const wrongMeaning = peers[0]!.meaningPa;
  const wrongPair = `${item.idiomPa} — ${wrongMeaning}`;
  const validPairs = peers.map((p) => `${p.idiomPa} — ${p.meaningPa}`);
  return assemble({
    familyId: "F06", seed, difficulty,
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਮੁਹਾਵਰੇ ਅਤੇ ਅਰਥ ਦਾ ਗ਼ਲਤ ਮੇਲ ਕਿਹੜਾ ਹੈ?",
    correctAnswer: wrongPair,
    distractors: validPairs,
    explanation: `‘${item.idiomPa}’ ਦਾ ਸਹੀ ਅਰਥ ‘${item.meaningPa}’ ਹੈ।`,
    authorityIds: [item.id, ...peers.map((p) => p.id)],
  });
}

// F07 — two meanings -> idioms in order. Hard only.
export function generateCP011V2F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const first = pickItem(seed + 701);
  const peers = nearestByMeaning(first, 3, seed + 709);
  const second = peers[0]!;
  const altA = peers[1]!;
  const altB = peers[2]!;
  return assemble({
    familyId: "F07", seed, difficulty,
    stem: `‘${first.meaningPa}’ ਅਤੇ ‘${second.meaningPa}’ ਲਈ ਕ੍ਰਮਵਾਰ ਸਹੀ ਮੁਹਾਵਰੇ ਕਿਹੜੇ ਹਨ?`,
    correctAnswer: `${first.idiomPa} — ${second.idiomPa}`,
    distractors: unique([
      `${second.idiomPa} — ${first.idiomPa}`,
      `${first.idiomPa} — ${altA.idiomPa}`,
      `${altB.idiomPa} — ${second.idiomPa}`,
      `${altA.idiomPa} — ${altB.idiomPa}`,
    ]),
    explanation: `ਪਹਿਲੇ ਭਾਵ ਲਈ ‘${first.idiomPa}’ ਅਤੇ ਦੂਜੇ ਲਈ ‘${second.idiomPa}’ ਢੁਕਵੇਂ ਮੁਹਾਵਰੇ ਹਨ।`,
    authorityIds: [first.id, ...peers.map((p) => p.id)],
  });
}

// F08 — two idioms -> meanings in order. Hard only.
export function generateCP011V2F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const first = pickItem(seed + 801);
  const peers = nearestByMeaning(first, 3, seed + 809);
  const second = peers[0]!;
  const altA = peers[1]!;
  const altB = peers[2]!;
  return assemble({
    familyId: "F08", seed, difficulty,
    stem: `‘${first.idiomPa}’ ਅਤੇ ‘${second.idiomPa}’ ਦੇ ਅਰਥ ਕ੍ਰਮਵਾਰ ਕਿਹੜੇ ਹਨ?`,
    correctAnswer: `${first.meaningPa} — ${second.meaningPa}`,
    distractors: unique([
      `${second.meaningPa} — ${first.meaningPa}`,
      `${first.meaningPa} — ${altA.meaningPa}`,
      `${altB.meaningPa} — ${second.meaningPa}`,
      `${altA.meaningPa} — ${altB.meaningPa}`,
    ]),
    explanation: `‘${first.idiomPa}’ ਦਾ ਅਰਥ ‘${first.meaningPa}’ ਅਤੇ ‘${second.idiomPa}’ ਦਾ ਅਰਥ ‘${second.meaningPa}’ ਹੈ।`,
    authorityIds: [first.id, ...peers.map((p) => p.id)],
  });
}

export const CP011_V2_FAMILY_GENERATORS = {
  F01: generateCP011V2F01,
  F02: generateCP011V2F02,
  F03: generateCP011V2F03,
  F04: generateCP011V2F04,
  F05: generateCP011V2F05,
  F06: generateCP011V2F06,
  F07: generateCP011V2F07,
  F08: generateCP011V2F08,
} as const;

export type CP011V2FamilyId = keyof typeof CP011_V2_FAMILY_GENERATORS;
