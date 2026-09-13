import { createRng } from "../../../../core/deterministic-rng";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionOption } from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import { CP014_ADMIN_TERMS, CP014_PASSAGES, type AdministrativeTranslationItem, type PassageQuestion, type ReadingPassageItem } from "./CP014-authorities";

function norm(v: string): string { return v.normalize("NFC").trim(); }
function uniq(values: readonly string[]): string[] { return Array.from(new Set(values.map(norm).filter(Boolean))); }
function hashText(value: string): string { let h = 2166136261; for (const ch of value.normalize("NFC")) { h ^= ch.codePointAt(0) ?? 0; h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, "0"); }

function assemble(input: { familyId: string; seed: number; difficulty: PunjabiDifficulty; stem: string; correctAnswer: string; distractors: readonly string[]; explanation: string; authorityIds: readonly string[] }): PunjabiGeneratedQuestion {
  const rng = createRng(input.seed + Number.parseInt(input.familyId.slice(1), 10) * 14009);
  const correct = norm(input.correctAnswer);
  const pool = uniq(input.distractors).filter((d) => d !== correct);
  if (pool.length < 3) throw new Error(`CP014 V2 ${input.familyId} needs three unique distractors; got ${pool.length}`);
  const chosen = pool.length === 3 ? pool : rng.pickDistinct(pool, 3);
  const raw: PunjabiQuestionOption[] = [
    { id: "c", text: correct, isCorrect: true },
    { id: "d1", text: chosen[0]!, isCorrect: false },
    { id: "d2", text: chosen[1]!, isCorrect: false },
    { id: "d3", text: chosen[2]!, isCorrect: false },
  ];
  const options = rng.shuffle(raw);
  const canonical = ["PUN-001-CP014-V2", input.familyId, input.difficulty, input.stem, correct, [...input.authorityIds].sort().join(",")].join("|");
  const q: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP014-V2-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: options.map((o) => o.text),
    correctIndex: options.findIndex((o) => o.isCorrect),
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: { engine: "punjabi-v1", packageId: "PUN-001", cpId: "PUN-001-CP014", familyId: input.familyId, difficulty: input.difficulty, language: "pa-Guru", seed: input.seed, authorityIds: input.authorityIds, generatorRevision: "2.0.0", fingerprint: `CP014-V2-${hashText(canonical)}` },
  };
  assertValidPunjabiQuestion(q);
  return q;
}

function passageWith(seed: number, allowed: readonly PassageQuestion["type"][]): { passage: ReadingPassageItem; q: PassageQuestion } {
  const candidates = CP014_PASSAGES.flatMap((passage) => passage.questions.filter((q) => allowed.includes(q.type)).map((q) => ({ passage, q })));
  if (!candidates.length) throw new Error(`CP014 V2 has no passage questions for ${allowed.join(",")}`);
  return createRng(seed).pickOne(candidates);
}
function admin(seed: number): AdministrativeTranslationItem { return createRng(seed).pickOne(CP014_ADMIN_TERMS); }
function adminPeers(item: AdministrativeTranslationItem, count: number, seed: number): AdministrativeTranslationItem[] {
  const out: AdministrativeTranslationItem[] = []; const en = new Set([norm(item.englishTerm)]); const pa = new Set([norm(item.punjabiTerm)]);
  for (const p of createRng(seed).shuffle(CP014_ADMIN_TERMS.filter((x) => x.id !== item.id))) {
    const e = norm(p.englishTerm), v = norm(p.punjabiTerm); if (en.has(e) || pa.has(v)) continue; en.add(e); pa.add(v); out.push(p); if (out.length === count) break;
  }
  if (out.length < count) throw new Error(`CP014 V2 ${item.id} lacks terminology peers`); return out;
}
function passageStem(p: ReadingPassageItem, q: PassageQuestion): string { return `ਹੇਠਾਂ ਦਿੱਤਾ ਪੈਰਾ ਪੜ੍ਹੋ ਅਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ:\n\n“${p.textPa}”\n\n${q.questionStem}`; }

export function generateCP014V2F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const { passage, q } = passageWith(seed + 101, ["factual"]);
  return assemble({ familyId: "F01", seed, difficulty, stem: passageStem(passage, q), correctAnswer: q.correctAnswer, distractors: q.distractors, explanation: q.explanationPa, authorityIds: [passage.id, q.qId] });
}
export function generateCP014V2F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const { passage, q } = passageWith(seed + 203, ["inferential"]);
  return assemble({ familyId: "F02", seed, difficulty, stem: passageStem(passage, q), correctAnswer: q.correctAnswer, distractors: q.distractors, explanation: q.explanationPa, authorityIds: [passage.id, q.qId] });
}
export function generateCP014V2F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const { passage, q } = passageWith(seed + 307, ["title", "summary"]);
  return assemble({ familyId: "F03", seed, difficulty, stem: passageStem(passage, q), correctAnswer: q.correctAnswer, distractors: q.distractors, explanation: q.explanationPa, authorityIds: [passage.id, q.qId] });
}
export function generateCP014V2F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = admin(seed + 401); const peers = adminPeers(item, 3, seed + 409);
  return assemble({ familyId: "F04", seed, difficulty, stem: `ਅੰਗਰੇਜ਼ੀ ਪ੍ਰਬੰਧਕੀ ਸ਼ਬਦ ‘${item.englishTerm}’ ਦਾ ਮਿਆਰੀ ਪੰਜਾਬੀ ਰੂਪ ਕਿਹੜਾ ਹੈ?`, correctAnswer: item.punjabiTerm, distractors: uniq([...item.distractors, ...peers.map((p) => p.punjabiTerm)]), explanation: item.explanationPa, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}
export function generateCP014V2F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = admin(seed + 503); const peers = adminPeers(item, 3, seed + 509);
  return assemble({ familyId: "F05", seed, difficulty, stem: `ਪੰਜਾਬੀ ਪ੍ਰਬੰਧਕੀ ਪਦ ‘${item.punjabiTerm}’ ਲਈ ਸਹੀ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`, correctAnswer: item.englishTerm, distractors: peers.map((p) => p.englishTerm), explanation: item.explanationPa, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}
export function generateCP014V2F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = admin(seed + 601); const peers = adminPeers(item, 3, seed + 607);
  const wrongPairs = peers.map((p, i) => `${p.englishTerm} — ${peers[(i + 1) % peers.length]!.punjabiTerm}`);
  return assemble({ familyId: "F06", seed, difficulty, stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਪੰਜਾਬੀ ਪ੍ਰਬੰਧਕੀ ਸ਼ਬਦ ਦਾ ਸਹੀ ਮੇਲ ਕਿਹੜਾ ਹੈ?", correctAnswer: `${item.englishTerm} — ${item.punjabiTerm}`, distractors: wrongPairs, explanation: item.explanationPa, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}
export function generateCP014V2F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const eligible = CP014_PASSAGES.filter((p) => p.questions.length >= 2);
  const passage = createRng(seed + 701).pickOne(eligible);
  const [q1, q2] = createRng(seed + 709).pickDistinct(passage.questions, 2);
  const correct = `${q1!.correctAnswer} — ${q2!.correctAnswer}`;
  const d1 = `${q2!.correctAnswer} — ${q1!.correctAnswer}`;
  const d2 = `${q1!.distractors[0] ?? q2!.correctAnswer} — ${q2!.correctAnswer}`;
  const d3 = `${q1!.correctAnswer} — ${q2!.distractors[0] ?? q1!.correctAnswer}`;
  const d4 = `${q1!.distractors[1] ?? q2!.correctAnswer} — ${q2!.distractors[1] ?? q1!.correctAnswer}`;
  return assemble({ familyId: "F07", seed, difficulty, stem: `ਹੇਠਾਂ ਦਿੱਤਾ ਪੈਰਾ ਪੜ੍ਹੋ। ਦੋਵੇਂ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਕ੍ਰਮਵਾਰ ਚੁਣੋ:\n\n“${passage.textPa}”\n\n1. ${q1!.questionStem}\n2. ${q2!.questionStem}`, correctAnswer: correct, distractors: [d1, d2, d3, d4], explanation: `ਪਹਿਲੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ‘${q1!.correctAnswer}’ ਅਤੇ ਦੂਜੇ ਦਾ ‘${q2!.correctAnswer}’ ਹੈ।`, authorityIds: [passage.id, q1!.qId, q2!.qId] });
}
export function generateCP014V2F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const item = admin(seed + 809); const peers = adminPeers(item, 3, seed + 811);
  return assemble({ familyId: "F08", seed, difficulty, stem: `‘${item.englishTerm}’ ਦਾ ਅਨੁਵਾਦ ‘${item.punjabiTerm}’ ਦਿੱਤਾ ਗਿਆ ਹੈ। ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਹੋਰ ਜੋੜ ਵੀ ਸਹੀ ਹੈ?`, correctAnswer: `${peers[0]!.englishTerm} — ${peers[0]!.punjabiTerm}`, distractors: [ `${peers[1]!.englishTerm} — ${peers[2]!.punjabiTerm}`, `${peers[2]!.englishTerm} — ${peers[1]!.punjabiTerm}`, `${item.englishTerm} — ${peers[1]!.punjabiTerm}`, `${peers[1]!.englishTerm} — ${item.punjabiTerm}` ], explanation: `‘${peers[0]!.englishTerm}’ ਦਾ ਮਿਆਰੀ ਪੰਜਾਬੀ ਰੂਪ ‘${peers[0]!.punjabiTerm}’ ਹੈ।`, authorityIds: [item.id, ...peers.map((p) => p.id)] });
}
