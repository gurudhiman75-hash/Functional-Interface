import { createRng } from "../../../../core/deterministic-rng";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionOption } from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import { CP012_PROVERB_ITEMS, type ProverbItem } from "./CP012-authorities";

function normalize(value: string): string { return value.normalize("NFC").trim(); }
function unique(values: readonly string[]): string[] { return Array.from(new Set(values.map(normalize).filter(Boolean))); }
function tokens(value: string): Set<string> {
  return new Set(normalize(value).replace(/[‘’“”"'.,;:!?()\-–—/]/g, " ").split(/\s+/).filter((t) => t.length > 1));
}
function similarity(a: string, b: string): number {
  const aa = tokens(a); const bb = tokens(b); if (!aa.size || !bb.size) return 0;
  let shared = 0; for (const t of aa) if (bb.has(t)) shared++;
  return shared / Math.max(aa.size, bb.size);
}
function hashText(value: string): string {
  let hash = 2166136261;
  for (const ch of value.normalize("NFC")) { hash ^= ch.codePointAt(0) ?? 0; hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function semanticPeers(item: ProverbItem, count: number, seed: number): ProverbItem[] {
  const ranked = CP012_PROVERB_ITEMS
    .filter((p) => p.id !== item.id)
    .map((candidate) => ({ candidate, score: similarity(item.meaningPa, candidate.meaningPa) }))
    .sort((a, b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id));
  const candidates: ProverbItem[] = [];
  const usedProverbs = new Set([normalize(item.proverbPa)]);
  const usedMeanings = new Set([normalize(item.meaningPa)]);
  const usedFirst = new Set([normalize(item.firstPartPa)]);
  const usedSecond = new Set([normalize(item.secondPartPa)]);
  for (const { candidate } of ranked) {
    const proverb = normalize(candidate.proverbPa), meaning = normalize(candidate.meaningPa);
    const first = normalize(candidate.firstPartPa), second = normalize(candidate.secondPartPa);
    if (usedProverbs.has(proverb) || usedMeanings.has(meaning) || usedFirst.has(first) || usedSecond.has(second)) continue;
    usedProverbs.add(proverb); usedMeanings.add(meaning); usedFirst.add(first); usedSecond.add(second);
    candidates.push(candidate);
    if (candidates.length >= Math.max(count * 4, 12)) break;
  }
  if (candidates.length < count) throw new Error(`CP012 V2 ${item.id} lacks enough unique semantic peers`);
  return createRng(seed).pickDistinct(candidates, count);
}

function randomPeers(item: ProverbItem, count: number, seed: number): ProverbItem[] {
  const candidates: ProverbItem[] = [];
  const usedProverbs = new Set([normalize(item.proverbPa)]);
  const usedMeanings = new Set([normalize(item.meaningPa)]);
  const usedFirst = new Set([normalize(item.firstPartPa)]);
  const usedSecond = new Set([normalize(item.secondPartPa)]);
  for (const candidate of createRng(seed).shuffle(CP012_PROVERB_ITEMS.filter((p) => p.id !== item.id))) {
    const proverb = normalize(candidate.proverbPa), meaning = normalize(candidate.meaningPa);
    const first = normalize(candidate.firstPartPa), second = normalize(candidate.secondPartPa);
    if (usedProverbs.has(proverb) || usedMeanings.has(meaning) || usedFirst.has(first) || usedSecond.has(second)) continue;
    usedProverbs.add(proverb); usedMeanings.add(meaning); usedFirst.add(first); usedSecond.add(second);
    candidates.push(candidate); if (candidates.length === count) break;
  }
  if (candidates.length < count) throw new Error(`CP012 V2 ${item.id} lacks enough unique peers`);
  return candidates;
}

function assemble(input: { familyId: string; seed: number; difficulty: PunjabiDifficulty; stem: string; correctAnswer: string; distractors: readonly string[]; explanation: string; authorityIds: readonly string[]; }): PunjabiGeneratedQuestion {
  const rng = createRng(input.seed + Number.parseInt(input.familyId.slice(1), 10) * 12007);
  const correct = normalize(input.correctAnswer);
  const distractors = unique(input.distractors).filter((v) => v !== correct);
  if (distractors.length < 3) throw new Error(`CP012 V2 ${input.familyId} needs three unique distractors; got ${distractors.length}`);
  const chosen = distractors.length === 3 ? distractors : rng.pickDistinct(distractors, 3);
  const raw: PunjabiQuestionOption[] = [
    { id: "c", text: correct, isCorrect: true },
    { id: "d1", text: chosen[0]!, isCorrect: false },
    { id: "d2", text: chosen[1]!, isCorrect: false },
    { id: "d3", text: chosen[2]!, isCorrect: false },
  ];
  const options = rng.shuffle(raw); const correctIndex = options.findIndex((o) => o.isCorrect);
  const canonical = ["PUN-001-CP012-V2", input.familyId, input.difficulty, input.stem, correct, [...input.authorityIds].sort().join(",")].join("|");
  const q: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP012-V2-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem, options: options.map((o) => o.text), correctIndex, explanation: input.explanation, difficulty: input.difficulty,
    metadata: { engine: "punjabi-v1", packageId: "PUN-001", cpId: "PUN-001-CP012", familyId: input.familyId, difficulty: input.difficulty, language: "pa-Guru", seed: input.seed, authorityIds: input.authorityIds, generatorRevision: "2.0.0", fingerprint: `CP012-V2-${hashText(canonical)}` },
  };
  assertValidPunjabiQuestion(q); return q;
}

function pickItem(seed: number): ProverbItem { return createRng(seed).pickOne(CP012_PROVERB_ITEMS); }

export function generateCP012V2F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 101); const item = pickItem(seed + 103);
  const templates = [`ਅਖਾਣ ‘${item.proverbPa}’ ਦਾ ਸਹੀ ਭਾਵ ਕੀ ਹੈ?`,`‘${item.proverbPa}’ ਕਿਹੜੀ ਗੱਲ ਦਰਸਾਉਂਦਾ ਹੈ?`,`ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${item.proverbPa}’ ਦਾ ਢੁਕਵਾਂ ਅਰਥ ਚੁਣੋ।`];
  return assemble({ familyId: "F01", seed, difficulty, stem: rng.pickOne(templates), correctAnswer: item.meaningPa, distractors: item.distractors, explanation: item.explanationPa, authorityIds: [item.id] });
}

export function generateCP012V2F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = pickItem(seed + 203); const peers = difficulty === "Medium" ? semanticPeers(item, 3, seed + 211) : randomPeers(item, 3, seed + 213);
  return assemble({ familyId: "F02", seed, difficulty, stem: `ਅਖਾਣ ਪੂਰਾ ਕਰੋ: “${item.firstPartPa} _______”`, correctAnswer: item.secondPartPa, distractors: peers.map((p) => p.secondPartPa), explanation: `ਪੂਰਾ ਅਖਾਣ ‘${item.proverbPa}’ ਹੈ।`, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}

export function generateCP012V2F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = pickItem(seed + 307); const peers = semanticPeers(item, 3, seed + 311);
  return assemble({ familyId: "F03", seed, difficulty, stem: `ਅਖਾਣ ਦਾ ਪਹਿਲਾ ਹਿੱਸਾ ਚੁਣੋ: “_______ ${item.secondPartPa}”`, correctAnswer: item.firstPartPa, distractors: peers.map((p) => p.firstPartPa), explanation: `ਪੂਰਾ ਅਖਾਣ ‘${item.proverbPa}’ ਹੈ।`, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}

export function generateCP012V2F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = pickItem(seed + 401); const peers = semanticPeers(item, 3, seed + 409);
  return assemble({ familyId: "F04", seed, difficulty, stem: `ਹੇਠਾਂ ਦਿੱਤੀ ਸਥਿਤੀ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਅਖਾਣ ਕਿਹੜਾ ਹੈ?\n“${item.situationPa}”`, correctAnswer: item.proverbPa, distractors: peers.map((p) => p.proverbPa), explanation: item.explanationPa, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}

export function generateCP012V2F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = pickItem(seed + 503); const peers = difficulty === "Medium" ? semanticPeers(item, 3, seed + 509) : randomPeers(item, 3, seed + 511);
  return assemble({ familyId: "F05", seed, difficulty, stem: `‘${item.meaningPa}’ ਭਾਵ ਲਈ ਢੁਕਵਾਂ ਅਖਾਣ ਕਿਹੜਾ ਹੈ?`, correctAnswer: item.proverbPa, distractors: peers.map((p) => p.proverbPa), explanation: item.explanationPa, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}

export function generateCP012V2F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = pickItem(seed + 601); const peers = semanticPeers(item, 3, seed + 607); const all = [item, ...peers];
  const falsePairs = peers.map((peer, i) => { const wrongs = all.filter((p) => normalize(p.meaningPa) !== normalize(peer.meaningPa)); const wrong = wrongs[(i + 1) % wrongs.length]!; return `${peer.proverbPa} — ${wrong.meaningPa}`; });
  return assemble({ familyId: "F06", seed, difficulty, stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਅਖਾਣ ਅਤੇ ਭਾਵ ਦਾ ਸਹੀ ਮੇਲ ਕਿਹੜਾ ਹੈ?", correctAnswer: `${item.proverbPa} — ${item.meaningPa}`, distractors: falsePairs, explanation: `‘${item.proverbPa}’ ਦਾ ਸਹੀ ਭਾਵ ‘${item.meaningPa}’ ਹੈ।`, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}

export function generateCP012V2F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = pickItem(seed + 701); const peers = semanticPeers(item, 3, seed + 709);
  return assemble({ familyId: "F07", seed, difficulty, stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਅਖਾਣ ਅਤੇ ਭਾਵ ਦਾ ਗ਼ਲਤ ਮੇਲ ਕਿਹੜਾ ਹੈ?", correctAnswer: `${item.proverbPa} — ${peers[0]!.meaningPa}`, distractors: peers.map((p) => `${p.proverbPa} — ${p.meaningPa}`), explanation: `‘${item.proverbPa}’ ਦਾ ਸਹੀ ਭਾਵ ‘${item.meaningPa}’ ਹੈ।`, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}

export function generateCP012V2F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const first = pickItem(seed + 801); const peers = semanticPeers(first, 3, seed + 809); const [second, altA, altB] = peers;
  return assemble({ familyId: "F08", seed, difficulty, stem: `‘${first.meaningPa}’ ਅਤੇ ‘${second!.meaningPa}’ ਲਈ ਕ੍ਰਮਵਾਰ ਸਹੀ ਅਖਾਣ ਕਿਹੜੇ ਹਨ?`, correctAnswer: `${first.proverbPa} — ${second!.proverbPa}`, distractors: unique([`${second!.proverbPa} — ${first.proverbPa}`,`${first.proverbPa} — ${altA!.proverbPa}`,`${altB!.proverbPa} — ${second!.proverbPa}`,`${altA!.proverbPa} — ${altB!.proverbPa}`]), explanation: `ਪਹਿਲੇ ਭਾਵ ਲਈ ‘${first.proverbPa}’ ਅਤੇ ਦੂਜੇ ਲਈ ‘${second!.proverbPa}’ ਢੁਕਵੇਂ ਅਖਾਣ ਹਨ।`, authorityIds: [first.id, ...peers.map((p) => p.id)] });
}
