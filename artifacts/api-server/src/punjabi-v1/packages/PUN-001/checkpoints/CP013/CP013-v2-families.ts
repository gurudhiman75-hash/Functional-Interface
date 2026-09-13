import { createRng } from "../../../../core/deterministic-rng";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionOption } from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  CP013_CLASSIFICATION_ITEMS,
  CP013_CORRECTION_ITEMS,
  CP013_TRANSFORMATION_ITEMS,
  type SentenceClassificationItem,
  type SentenceCorrectionItem,
  type SentenceTransformationItem,
} from "./CP013-authorities";

function norm(value: string): string { return value.normalize("NFC").trim(); }
function uniq(values: readonly string[]): string[] { return Array.from(new Set(values.map(norm).filter(Boolean))); }
function hashText(value: string): string {
  let hash = 2166136261;
  for (const ch of value.normalize("NFC")) { hash ^= ch.codePointAt(0) ?? 0; hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function assemble(input: { familyId: string; seed: number; difficulty: PunjabiDifficulty; stem: string; correctAnswer: string; distractors: readonly string[]; explanation: string; authorityIds: readonly string[] }): PunjabiGeneratedQuestion {
  const rng = createRng(input.seed + Number.parseInt(input.familyId.slice(1), 10) * 13007);
  const correct = norm(input.correctAnswer);
  const pool = uniq(input.distractors).filter((d) => d !== correct);
  if (pool.length < 3) throw new Error(`CP013 V2 ${input.familyId} needs three unique distractors; got ${pool.length}`);
  const chosen = pool.length === 3 ? pool : rng.pickDistinct(pool, 3);
  const raw: PunjabiQuestionOption[] = [
    { id: "c", text: correct, isCorrect: true },
    { id: "d1", text: chosen[0]!, isCorrect: false },
    { id: "d2", text: chosen[1]!, isCorrect: false },
    { id: "d3", text: chosen[2]!, isCorrect: false },
  ];
  const options = rng.shuffle(raw);
  const canonical = ["PUN-001-CP013-V2", input.familyId, input.difficulty, input.stem, correct, [...input.authorityIds].sort().join(",")].join("|");
  const q: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP013-V2-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: options.map((o) => o.text),
    correctIndex: options.findIndex((o) => o.isCorrect),
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: { engine: "punjabi-v1", packageId: "PUN-001", cpId: "PUN-001-CP013", familyId: input.familyId, difficulty: input.difficulty, language: "pa-Guru", seed: input.seed, authorityIds: input.authorityIds, generatorRevision: "2.0.0", fingerprint: `CP013-V2-${hashText(canonical)}` },
  };
  assertValidPunjabiQuestion(q);
  return q;
}

function cls(seed: number): SentenceClassificationItem { return createRng(seed).pickOne(CP013_CLASSIFICATION_ITEMS); }
function trn(seed: number): SentenceTransformationItem { return createRng(seed).pickOne(CP013_TRANSFORMATION_ITEMS); }
function cor(seed: number): SentenceCorrectionItem { return createRng(seed).pickOne(CP013_CORRECTION_ITEMS); }

function distinctClassificationPeers(item: SentenceClassificationItem, count: number, seed: number): SentenceClassificationItem[] {
  const out: SentenceClassificationItem[] = []; const seen = new Set([norm(item.sentencePa)]);
  for (const p of createRng(seed).shuffle(CP013_CLASSIFICATION_ITEMS.filter((x) => x.id !== item.id))) {
    const key = norm(p.sentencePa); if (seen.has(key)) continue; seen.add(key); out.push(p); if (out.length === count) break;
  }
  if (out.length < count) throw new Error(`CP013 V2 ${item.id} lacks classification peers`); return out;
}
function distinctTransformationPeers(item: SentenceTransformationItem, count: number, seed: number): SentenceTransformationItem[] {
  const out: SentenceTransformationItem[] = []; const seen = new Set([norm(item.correctSentence), norm(item.originalSentence)]);
  for (const p of createRng(seed).shuffle(CP013_TRANSFORMATION_ITEMS.filter((x) => x.id !== item.id))) {
    const a = norm(p.correctSentence), b = norm(p.originalSentence); if (seen.has(a) || seen.has(b)) continue; seen.add(a); seen.add(b); out.push(p); if (out.length === count) break;
  }
  if (out.length < count) throw new Error(`CP013 V2 ${item.id} lacks transformation peers`); return out;
}
function distinctCorrectionPeers(item: SentenceCorrectionItem, count: number, seed: number): SentenceCorrectionItem[] {
  const out: SentenceCorrectionItem[] = []; const seen = new Set([norm(item.incorrectSentence), norm(item.correctSentence)]);
  for (const p of createRng(seed).shuffle(CP013_CORRECTION_ITEMS.filter((x) => x.id !== item.id))) {
    const a = norm(p.incorrectSentence), b = norm(p.correctSentence); if (seen.has(a) || seen.has(b)) continue; seen.add(a); seen.add(b); out.push(p); if (out.length === count) break;
  }
  if (out.length < count) throw new Error(`CP013 V2 ${item.id} lacks correction peers`); return out;
}

export function generateCP013V2F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = cls(seed + 101); const peers = distinctClassificationPeers(item, 3, seed + 109);
  const answer = `${item.structureType} — ${item.functionType}`;
  const distractors = uniq([
    `${item.structureType} — ${peers[0]!.functionType}`,
    `${peers[1]!.structureType} — ${item.functionType}`,
    `${peers[2]!.structureType} — ${peers[1]!.functionType}`,
    ...peers.map((p) => `${p.structureType} — ${p.functionType}`),
  ]);
  return assemble({ familyId: "F01", seed, difficulty, stem: `ਵਾਕ “${item.sentencePa}” ਦਾ ਬਣਤਰ ਅਤੇ ਕਾਰਜ ਪੱਖੋਂ ਸਹੀ ਵਰਗੀਕਰਨ ਕਿਹੜਾ ਹੈ?`, correctAnswer: answer, distractors, explanation: item.explanationPa, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}

export function generateCP013V2F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = cls(seed + 203);
  const pool = ["ਹਾਂ-ਵਾਚਕ ਵਾਕ", "ਨਾਂਹ-ਵਾਚਕ ਵਾਕ", "ਪ੍ਰਸ਼ਨ-ਵਾਚਕ ਵਾਕ", "ਹੁਕਮੀ ਵਾਕ", "ਵਿਸਮਈ ਵਾਕ"].filter((x) => x !== item.functionType);
  return assemble({ familyId: "F02", seed, difficulty, stem: `ਕਾਰਜ ਪੱਖੋਂ ਵਾਕ “${item.sentencePa}” ਦੀ ਕਿਸਮ ਕਿਹੜੀ ਹੈ?`, correctAnswer: item.functionType, distractors: pool, explanation: item.explanationPa, authorityIds: [item.id] });
}

export function generateCP013V2F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = trn(seed + 307);
  return assemble({ familyId: "F03", seed, difficulty, stem: `ਵਾਕ “${item.originalSentence}” ਨੂੰ ਬਿਨਾਂ ਭਾਵ ਬਦਲੇ ‘${item.targetCategory}’ ਵਿੱਚ ਬਦਲੋ।`, correctAnswer: item.correctSentence, distractors: item.distractors, explanation: item.explanationPa, authorityIds: [item.id] });
}

export function generateCP013V2F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = trn(seed + 401); const peers = distinctTransformationPeers(item, 3, seed + 409);
  return assemble({ familyId: "F04", seed, difficulty, stem: `ਵਾਕ “${item.correctSentence}” ਦਾ ਮੂਲ ‘${item.originalCategory}’ ਰੂਪ ਕਿਹੜਾ ਹੈ?`, correctAnswer: item.originalSentence, distractors: peers.map((p) => p.originalSentence), explanation: `ਇਸ ਰੂਪਾਂਤਰਣ ਦਾ ਮੂਲ ਵਾਕ “${item.originalSentence}” ਹੈ। ${item.explanationPa}`, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}

export function generateCP013V2F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = cor(seed + 503);
  return assemble({ familyId: "F05", seed, difficulty, stem: `ਅਸ਼ੁੱਧ ਵਾਕ “${item.incorrectSentence}” ਦਾ ਸ਼ੁੱਧ ਰੂਪ ਕਿਹੜਾ ਹੈ?`, correctAnswer: item.correctSentence, distractors: item.distractors, explanation: item.explanationPa, authorityIds: [item.id] });
}

export function generateCP013V2F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = cor(seed + 601);
  const peerTypes = uniq(CP013_CORRECTION_ITEMS.filter((x) => x.id !== item.id).map((x) => x.errorType)).filter((x) => x !== norm(item.errorType));
  return assemble({ familyId: "F06", seed, difficulty, stem: `ਵਾਕ “${item.incorrectSentence}” ਵਿੱਚ ਮੁੱਖ ਵਿਆਕਰਨਕ ਗਲਤੀ ਕਿਸ ਕਿਸਮ ਦੀ ਹੈ?`, correctAnswer: item.errorType, distractors: peerTypes, explanation: item.explanationPa, authorityIds: [item.id] });
}

export function generateCP013V2F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = trn(seed + 701); const peers = distinctTransformationPeers(item, 3, seed + 709);
  const correct = `${item.originalSentence} → ${item.correctSentence}`;
  const distractors = peers.map((p, i) => `${p.originalSentence} → ${peers[(i + 1) % peers.length]!.correctSentence}`);
  return assemble({ familyId: "F07", seed, difficulty, stem: `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਾਕ-ਵਟਾਂਦਰਾ ਮੂਲ ਭਾਵ ਨੂੰ ਬਿਨਾਂ ਬਦਲੇ ਸਹੀ ਕੀਤਾ ਗਿਆ ਹੈ?`, correctAnswer: correct, distractors, explanation: `“${item.originalSentence}” ਦਾ ਦਿੱਤੀ ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਸਹੀ ਰੂਪ “${item.correctSentence}” ਹੈ।`, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}

export function generateCP013V2F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const first = cls(seed + 809); const peers = distinctClassificationPeers(first, 3, seed + 811); const [second, altA, altB] = peers;
  const correct = `${first.structureType} — ${second!.structureType}`;
  const distractors = uniq([
    `${second!.structureType} — ${first.structureType}`,
    `${first.structureType} — ${altA!.structureType}`,
    `${altB!.structureType} — ${second!.structureType}`,
    `${altA!.structureType} — ${altB!.structureType}`,
  ]);
  return assemble({ familyId: "F08", seed, difficulty, stem: `ਹੇਠਲੇ ਦੋ ਵਾਕਾਂ ਦੀ ਬਣਤਰ ਕ੍ਰਮਵਾਰ ਪਛਾਣੋ:\n1. “${first.sentencePa}”\n2. “${second!.sentencePa}”`, correctAnswer: correct, distractors, explanation: `ਪਹਿਲਾ ਵਾਕ ‘${first.structureType}’ ਅਤੇ ਦੂਜਾ ‘${second!.structureType}’ ਹੈ।`, authorityIds: [first.id, ...peers.map((p) => p.id)] });
}
