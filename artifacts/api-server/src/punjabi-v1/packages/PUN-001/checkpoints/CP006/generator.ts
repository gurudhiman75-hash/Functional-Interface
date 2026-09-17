import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import {
  CP006_TENSE_LABELS,
  CP006_TENSE_TRIPLETS,
  CP006_VERB_AUTHORITIES,
  CP006_VERB_TYPE_LABELS,
  type CP006Tense,
} from "./CP006-authorities";

function norm(value: string): string { return value.normalize("NFC").trim(); }
function ordinal(seed: number, capacity: number): number {
  if (!Number.isSafeInteger(capacity) || capacity <= 0) throw new Error(`Invalid CP006 capacity ${capacity}`);
  const n = Math.trunc(seed) - 1;
  return ((n % capacity) + capacity) % capacity;
}
function unique(values: readonly string[]): string[] { return [...new Set(values.map(norm).filter(Boolean))]; }
function variant(values: readonly string[], selector: number): string { return values[ordinal(selector + 1, values.length)]!; }
function requireDifficulty(actual: PunjabiDifficulty, allowed: readonly PunjabiDifficulty[], familyId: string): void {
  if (!allowed.includes(actual)) throw new Error(`CP006 ${familyId} does not support ${actual}`);
}

function assemble(input: {
  seed: number;
  difficulty: PunjabiDifficulty;
  familyId: string;
  subtype: string;
  stem: string;
  correctAnswer: string;
  distractors: readonly string[];
  explanation: string;
  authorityIds: readonly string[];
}): PunjabiGeneratedQuestion {
  const rng = createRng(`CP006:${input.familyId}:${input.seed}`);
  const correct = norm(input.correctAnswer);
  const distractors = unique(input.distractors).filter((x) => x !== correct);
  if (distractors.length < 3) throw new Error(`CP006 ${input.familyId}: fewer than three distractors`);
  const selected = rng.pickDistinct(distractors, 3);
  const options = rng.shuffle([correct, ...selected]);
  const fingerprint = `CP006-${semanticHash([
    input.familyId,
    input.subtype,
    input.difficulty,
    norm(input.stem),
    correct,
    [...selected].sort().join("|"),
    [...input.authorityIds].sort().join(","),
  ])}`;
  return {
    id: `PUN-001-CP006-${input.familyId}-${fingerprint}`,
    stem: norm(input.stem),
    options,
    correctIndex: options.indexOf(correct),
    explanation: norm(input.explanation),
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP006",
      familyId: input.familyId,
      subtype: input.subtype,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0-forward-port",
      fingerprint,
      lifecycle: "REVIEW_ONLY",
    },
  };
}

export function generateCP006F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, ["Easy"], "F01");
  const i = ordinal(seed, CP006_VERB_AUTHORITIES.length);
  const a = CP006_VERB_AUTHORITIES[i]!;
  return assemble({
    seed, difficulty, familyId: "F01", subtype: "VERB_PHRASE_IDENTIFICATION",
    stem: variant([
      `ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਕਿਹੜੀ ਹੈ?\n${a.sentence}`,
      `ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ-ਭਾਗ ਪਛਾਣੋ।\n${a.sentence}`,
      `ਵਾਕ ਵਿੱਚ ਕੰਮ ਜਾਂ ਹਾਲਤ ਦੱਸਣ ਵਾਲਾ ਕਿਰਿਆ-ਰੂਪ ਚੁਣੋ।\n${a.sentence}`,
    ], i),
    correctAnswer: a.verbPhrase,
    distractors: a.sentenceDistractors,
    explanation: `ਵਾਕ ਵਿੱਚ ‘${a.verbPhrase}’ ਕਿਰਿਆ ਹੈ। ${a.explanationPa}`,
    authorityIds: [a.id],
  });
}

export function generateCP006F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, ["Easy"], "F02");
  const i = ordinal(seed, CP006_VERB_AUTHORITIES.length);
  const a = CP006_VERB_AUTHORITIES[i]!;
  const correct = CP006_VERB_TYPE_LABELS[a.verbType];
  return assemble({
    seed, difficulty, familyId: "F02", subtype: "TRANSITIVITY_CLASSIFICATION",
    stem: variant([
      `ਵਾਕ ਵਿੱਚ ‘${a.verbPhrase}’ ਕਿਸ ਕਿਸਮ ਦੀ ਕਿਰਿਆ ਹੈ?\n${a.sentence}`,
      `ਹੇਠਲੇ ਵਾਕ ਦੀ ਕਿਰਿਆ ਦਾ ਭੇਦ ਚੁਣੋ।\n${a.sentence}`,
      `‘${a.verbPhrase}’ ਨੂੰ ਸਕਰਮਕ ਜਾਂ ਅਕਰਮਕ ਹੋਣ ਦੇ ਆਧਾਰ ਤੇ ਪਛਾਣੋ।\n${a.sentence}`,
    ], i),
    correctAnswer: correct,
    distractors: [
      a.verbType === "SAKARMAK" ? "ਅਕਰਮਕ ਕਿਰਿਆ" : "ਸਕਰਮਕ ਕਿਰਿਆ",
      "ਸਹਾਇਕ ਕਿਰਿਆ",
      "ਸੰਯੁਕਤ ਕਿਰਿਆ",
    ],
    explanation: a.explanationPa,
    authorityIds: [a.id],
  });
}

export function generateCP006F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, ["Easy"], "F03");
  const i = ordinal(seed, CP006_VERB_AUTHORITIES.length);
  const a = CP006_VERB_AUTHORITIES[i]!;
  return assemble({
    seed, difficulty, familyId: "F03", subtype: "TENSE_IDENTIFICATION",
    stem: variant([
      `ਵਾਕ ਦਾ ਕਾਲ ਪਛਾਣੋ।\n${a.sentence}`,
      `‘${a.verbPhrase}’ ਕਿਹੜਾ ਕਾਲ ਦਰਸਾਉਂਦਾ ਹੈ?\n${a.sentence}`,
      `ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਸਮਾਂ ਦੱਸੋ।\n${a.sentence}`,
    ], i),
    correctAnswer: CP006_TENSE_LABELS[a.tense],
    distractors: ["ਵਰਤਮਾਨ ਕਾਲ", "ਭੂਤਕਾਲ", "ਭਵਿੱਖਤ ਕਾਲ", "ਕਾਲ ਸਪਸ਼ਟ ਨਹੀਂ"],
    explanation: `‘${a.verbPhrase}’ ${CP006_TENSE_LABELS[a.tense]} ਦਰਸਾਉਂਦਾ ਹੈ।`,
    authorityIds: [a.id],
  });
}

const AUX_AUTHORITIES = CP006_VERB_AUTHORITIES.filter((x) => x.auxiliaryVerb);
export function generateCP006F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, ["Medium"], "F04");
  const i = ordinal(seed, AUX_AUTHORITIES.length);
  const a = AUX_AUTHORITIES[i]!;
  const distractors = unique([a.mainVerb, ...a.sentenceDistractors]);
  return assemble({
    seed, difficulty, familyId: "F04", subtype: "AUXILIARY_IDENTIFICATION",
    stem: variant([
      `ਵਾਕ ਵਿੱਚ ਸਹਾਇਕ ਕਿਰਿਆ ਕਿਹੜੀ ਹੈ?\n${a.sentence}`,
      `‘${a.verbPhrase}’ ਵਿੱਚ ਸਹਾਇਕ ਕਿਰਿਆ ਪਛਾਣੋ।\n${a.sentence}`,
      `ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਮੁੱਖ ਕਿਰਿਆ ਨਾਲ ਆਇਆ ਸਹਾਇਕ ਰੂਪ ਚੁਣੋ।\n${a.sentence}`,
    ], i),
    correctAnswer: a.auxiliaryVerb!,
    distractors,
    explanation: `‘${a.verbPhrase}’ ਵਿੱਚ ‘${a.auxiliaryVerb}’ ਸਹਾਇਕ ਕਿਰਿਆ ਹੈ ਅਤੇ ‘${a.mainVerb}’ ਮੁੱਖ ਕਿਰਿਆ-ਭਾਗ ਹੈ।`,
    authorityIds: [a.id],
  });
}

const OBJECT_AUTHORITIES = CP006_VERB_AUTHORITIES.filter((x) => x.directObject && x.objectDistractors);
export function generateCP006F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, ["Medium"], "F05");
  const i = ordinal(seed, OBJECT_AUTHORITIES.length);
  const a = OBJECT_AUTHORITIES[i]!;
  return assemble({
    seed, difficulty, familyId: "F05", subtype: "DIRECT_OBJECT_IDENTIFICATION",
    stem: variant([
      `ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਕਰਮ ਕਿਹੜਾ ਹੈ?\n${a.sentence}`,
      `‘${a.verbPhrase}’ ਦਾ ਕਰਮ ਪਛਾਣੋ।\n${a.sentence}`,
      `ਹੇਠਲੇ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਅਸਰ ਕਿਸ ਸ਼ਬਦ ਉੱਤੇ ਪੈਂਦਾ ਹੈ?\n${a.sentence}`,
    ], i),
    correctAnswer: a.directObject!,
    distractors: a.objectDistractors!,
    explanation: `ਵਾਕ ਵਿੱਚ ‘${a.directObject}’ ਕਿਰਿਆ ‘${a.verbPhrase}’ ਦਾ ਕਰਮ ਹੈ। ਇਸ ਲਈ ਕਿਰਿਆ ਸਕਰਮਕ ਹੈ।`,
    authorityIds: [a.id],
  });
}

type TenseKey = "present" | "past" | "future";
const TENSE_NAME: Record<TenseKey, string> = { present: "ਵਰਤਮਾਨ ਕਾਲ", past: "ਭੂਤਕਾਲ", future: "ਭਵਿੱਖਤ ਕਾਲ" };
const SHIFT_DIRECTIONS: readonly [TenseKey, TenseKey][] = [
  ["present", "past"], ["present", "future"], ["past", "present"],
  ["past", "future"], ["future", "present"], ["future", "past"],
];
function shiftNearMiss(t: (typeof CP006_TENSE_TRIPLETS)[number], target: TenseKey): string {
  if (target === "past") return t.pastNearMiss;
  if (target === "future") return t.futureNearMiss;
  return t.present.replace(" ਹੈ।", " ਸੀ।");
}

export function generateCP006F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, ["Medium"], "F06");
  const rank = ordinal(seed, CP006_TENSE_TRIPLETS.length * SHIFT_DIRECTIONS.length);
  const t = CP006_TENSE_TRIPLETS[Math.floor(rank / SHIFT_DIRECTIONS.length)]!;
  const [from, to] = SHIFT_DIRECTIONS[rank % SHIFT_DIRECTIONS.length]!;
  return assemble({
    seed, difficulty, familyId: "F06", subtype: "TENSE_TRANSFORMATION",
    stem: variant([
      `ਹੇਠਲੇ ਵਾਕ ਨੂੰ ${TENSE_NAME[to]} ਵਿੱਚ ਬਦਲੋ।\n${t[from]}`,
      `ਵਾਕ ਦਾ ਅਰਥ ਕਾਇਮ ਰੱਖਦੇ ਹੋਏ ਇਸ ਨੂੰ ${TENSE_NAME[to]} ਵਿੱਚ ਲਿਖਿਆ ਰੂਪ ਚੁਣੋ।\n${t[from]}`,
      `${TENSE_NAME[from]} ਦੇ ਇਸ ਵਾਕ ਦਾ ${TENSE_NAME[to]} ਰੂਪ ਕਿਹੜਾ ਹੈ?\n${t[from]}`,
    ], rank),
    correctAnswer: t[to],
    distractors: [t[from], t[(["present","past","future"] as TenseKey[]).find((x) => x !== from && x !== to)!], shiftNearMiss(t, to)],
    explanation: `${TENSE_NAME[to]} ਦਾ ਸਹੀ ਰੂਪ ‘${t[to]}’ ਹੈ। ${t.explanationPa}`,
    authorityIds: [t.id],
  });
}

const TYPE_TENSE_OPTIONS = [
  "ਸਕਰਮਕ ਕਿਰਿਆ — ਵਰਤਮਾਨ ਕਾਲ",
  "ਸਕਰਮਕ ਕਿਰਿਆ — ਭੂਤਕਾਲ",
  "ਸਕਰਮਕ ਕਿਰਿਆ — ਭਵਿੱਖਤ ਕਾਲ",
  "ਅਕਰਮਕ ਕਿਰਿਆ — ਵਰਤਮਾਨ ਕਾਲ",
  "ਅਕਰਮਕ ਕਿਰਿਆ — ਭੂਤਕਾਲ",
  "ਅਕਰਮਕ ਕਿਰਿਆ — ਭਵਿੱਖਤ ਕਾਲ",
] as const;
export function generateCP006F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, ["Hard"], "F07");
  const i = ordinal(seed, CP006_VERB_AUTHORITIES.length);
  const a = CP006_VERB_AUTHORITIES[i]!;
  const correct = `${CP006_VERB_TYPE_LABELS[a.verbType]} — ${CP006_TENSE_LABELS[a.tense]}`;
  return assemble({
    seed, difficulty, familyId: "F07", subtype: "TYPE_TENSE_DUAL_DIAGNOSIS",
    stem: variant([
      `ਵਾਕ ਦੀ ਕਿਰਿਆ ਦਾ ਭੇਦ ਅਤੇ ਕਾਲ ਦੋਵੇਂ ਸਹੀ ਦੱਸਣ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।\n${a.sentence}`,
      `‘${a.verbPhrase}’ ਲਈ ਕਿਰਿਆ-ਭੇਦ ਅਤੇ ਕਾਲ ਦਾ ਸਹੀ ਜੋੜਾ ਕਿਹੜਾ ਹੈ?\n${a.sentence}`,
      `ਹੇਠਲੇ ਵਾਕ ਦੀ ਕਿਰਿਆ ਨੂੰ ਭੇਦ ਅਤੇ ਕਾਲ ਦੋਵੇਂ ਦੇ ਆਧਾਰ ਤੇ ਪਛਾਣੋ।\n${a.sentence}`,
    ], i),
    correctAnswer: correct,
    distractors: TYPE_TENSE_OPTIONS,
    explanation: `${a.explanationPa} ਨਾਲ ਹੀ ‘${a.verbPhrase}’ ${CP006_TENSE_LABELS[a.tense]} ਵਿੱਚ ਹੈ।`,
    authorityIds: [a.id],
  });
}

function falseClaim(t: (typeof CP006_TENSE_TRIPLETS)[number], source: TenseKey, target: TenseKey): string {
  const wrong = (["present", "past", "future"] as TenseKey[]).find((x) => x !== target && x !== source)!;
  return `‘${t[source]}’ ਦਾ ${TENSE_NAME[target]} ਰੂਪ ‘${t[wrong]}’ ਹੈ।`;
}
function trueClaim(t: (typeof CP006_TENSE_TRIPLETS)[number], source: TenseKey, target: TenseKey): string {
  return `‘${t[source]}’ ਦਾ ${TENSE_NAME[target]} ਰੂਪ ‘${t[target]}’ ਹੈ।`;
}

export function generateCP006F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, ["Hard"], "F08");
  const rank = ordinal(seed, CP006_TENSE_TRIPLETS.length * (CP006_TENSE_TRIPLETS.length - 1) * 4);
  const truthMode = rank % 4;
  const pairRank = Math.floor(rank / 4);
  const aIndex = pairRank % CP006_TENSE_TRIPLETS.length;
  const bOffset = Math.floor(pairRank / CP006_TENSE_TRIPLETS.length) % (CP006_TENSE_TRIPLETS.length - 1);
  const bIndex = bOffset >= aIndex ? bOffset + 1 : bOffset;
  const a = CP006_TENSE_TRIPLETS[aIndex]!;
  const b = CP006_TENSE_TRIPLETS[bIndex]!;
  const s1 = truthMode === 0 || truthMode === 1 ? trueClaim(a, "present", "past") : falseClaim(a, "present", "past");
  const s2 = truthMode === 0 || truthMode === 2 ? trueClaim(b, "past", "future") : falseClaim(b, "past", "future");
  const correct = ["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ", "ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ", "ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ", "ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"][truthMode]!;
  return assemble({
    seed, difficulty, familyId: "F08", subtype: "TENSE_SHIFT_STATEMENT_ANALYSIS",
    stem: variant([
      `ਕਥਨ 1: ${s1}\nਕਥਨ 2: ${s2}\nਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।`,
      `ਹੇਠਲੇ ਦੋ ਕਥਨਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।\nਕਥਨ 1: ${s1}\nਕਥਨ 2: ${s2}`,
      `ਕਾਲ-ਬਦਲਾਅ ਬਾਰੇ ਦਿੱਤੇ ਕਥਨਾਂ ਵਿੱਚੋਂ ਸਹੀ ਸਥਿਤੀ ਚੁਣੋ।\nਕਥਨ 1: ${s1}\nਕਥਨ 2: ${s2}`,
    ], pairRank),
    correctAnswer: correct,
    distractors: ["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ", "ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ", "ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ", "ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"],
    explanation: `ਕਥਨ 1 ਦਾ ਸਹੀ ਭੂਤਕਾਲੀ ਰੂਪ ‘${a.past}’ ਹੈ। ਕਥਨ 2 ਦਾ ਸਹੀ ਭਵਿੱਖਤ ਰੂਪ ‘${b.future}’ ਹੈ।`,
    authorityIds: [a.id, b.id],
  });
}

export const CP006_FAMILIES: readonly PunjabiQuestionFamilyDefinition[] = [
  { familyId: "F01", subtype: "VERB_PHRASE_IDENTIFICATION", name: "Verb phrase identification", targetDifficulties: ["Easy"], generate: generateCP006F01 },
  { familyId: "F02", subtype: "TRANSITIVITY_CLASSIFICATION", name: "Transitivity classification", targetDifficulties: ["Easy"], generate: generateCP006F02 },
  { familyId: "F03", subtype: "TENSE_IDENTIFICATION", name: "Tense identification", targetDifficulties: ["Easy"], generate: generateCP006F03 },
  { familyId: "F04", subtype: "AUXILIARY_IDENTIFICATION", name: "Auxiliary identification", targetDifficulties: ["Medium"], generate: generateCP006F04 },
  { familyId: "F05", subtype: "DIRECT_OBJECT_IDENTIFICATION", name: "Direct object identification", targetDifficulties: ["Medium"], generate: generateCP006F05 },
  { familyId: "F06", subtype: "TENSE_TRANSFORMATION", name: "Tense transformation", targetDifficulties: ["Medium"], generate: generateCP006F06 },
  { familyId: "F07", subtype: "TYPE_TENSE_DUAL_DIAGNOSIS", name: "Verb type and tense diagnosis", targetDifficulties: ["Hard"], generate: generateCP006F07 },
  { familyId: "F08", subtype: "TENSE_SHIFT_STATEMENT_ANALYSIS", name: "Tense shift statement analysis", targetDifficulties: ["Hard"], generate: generateCP006F08 },
];

export function getCP006BreadthReport() {
  const capacities = {
    F01: CP006_VERB_AUTHORITIES.length,
    F02: CP006_VERB_AUTHORITIES.length,
    F03: CP006_VERB_AUTHORITIES.length,
    F04: AUX_AUTHORITIES.length,
    F05: OBJECT_AUTHORITIES.length,
    F06: CP006_TENSE_TRIPLETS.length * SHIFT_DIRECTIONS.length,
    F07: CP006_VERB_AUTHORITIES.length,
    F08: CP006_TENSE_TRIPLETS.length * (CP006_TENSE_TRIPLETS.length - 1) * 4,
  };
  return {
    verbAuthorityCount: CP006_VERB_AUTHORITIES.length,
    tenseTripletCount: CP006_TENSE_TRIPLETS.length,
    totalAtomicAuthorities: CP006_VERB_AUTHORITIES.length + CP006_TENSE_TRIPLETS.length,
    familyCount: CP006_FAMILIES.length,
    capacities,
    totalSemanticCapacity: Object.values(capacities).reduce((a, b) => a + b, 0),
  };
}
