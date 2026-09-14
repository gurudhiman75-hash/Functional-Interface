import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import { CP003_NOUN_AUTHORITIES, CP003_NOUN_CATEGORY_NAMES, type CP003NounAuthority, type CP003NounCategory } from "./CP003-noun-corpus";
import { CP003_PRONOUN_CONTEXTS, CP003_PRONOUN_CATEGORY_NAMES, type CP003PronounCategory } from "./CP003-pronoun-corpus";
import { CP003_PRONOUN_PARADIGMS, CP003_PRONOUN_RELATION_NAMES, CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT, type CP003PronounRelation } from "./CP003-authorities";

function norm(value: string): string { return value.normalize("NFC").trim(); }
function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const r = Math.min(k, n - k); let result = 1;
  for (let i = 1; i <= r; i++) result = (result * (n - r + i)) / i;
  return Math.round(result);
}
function ordinal(seed: number, capacity: number): number {
  if (!Number.isSafeInteger(capacity) || capacity <= 0) throw new Error(`Invalid CP003 capacity ${capacity}`);
  const value = Math.trunc(seed) - 1;
  return ((value % capacity) + capacity) % capacity;
}
function combinationAt<T>(items: readonly T[], k: number, index: number): T[] {
  let rank = ordinal(index + 1, choose(items.length, k));
  const out: T[] = []; let start = 0;
  for (let position = 0; position < k; position++) {
    const remaining = k - position - 1;
    for (let candidate = start; candidate <= items.length - (k - position); candidate++) {
      const block = choose(items.length - candidate - 1, remaining);
      if (rank < block) { out.push(items[candidate]!); start = candidate + 1; break; }
      rank -= block;
    }
  }
  if (out.length !== k) throw new Error(`Unable to unrank CP003 combination k=${k}, index=${index}`);
  return out;
}
function assemble(input: { seed: number; difficulty: PunjabiDifficulty; familyId: string; subtype: string; stem: string; correctAnswer: string; distractors: readonly string[]; explanation: string; authorityIds: readonly string[] }): PunjabiGeneratedQuestion {
  const rng = createRng(`CP003:${input.familyId}:${input.seed}`);
  const correct = norm(input.correctAnswer);
  const distractors = [...new Set(input.distractors.map(norm))].filter((x) => x && x !== correct);
  if (distractors.length < 3) throw new Error(`CP003 ${input.familyId}: fewer than three distinct distractors`);
  const selected = rng.pickDistinct(distractors, 3);
  const options = rng.shuffle([correct, ...selected]);
  const fingerprint = `CP003-${semanticHash([input.familyId, input.subtype, input.difficulty, norm(input.stem), correct, [...selected].sort().join("|"), [...input.authorityIds].sort().join(",")])}`;
  return { id: `PUN-001-CP003-${input.familyId}-${fingerprint}`, stem: norm(input.stem), options, correctIndex: options.indexOf(correct), explanation: norm(input.explanation), difficulty: input.difficulty, metadata: { engine: "punjabi-v1", packageId: "PUN-001", cpId: "PUN-001-CP003", familyId: input.familyId, subtype: input.subtype, difficulty: input.difficulty, language: "pa-Guru", seed: input.seed, authorityIds: input.authorityIds, generatorRevision: "2.2.0-forward-port", fingerprint, lifecycle: "REVIEW_ONLY" } };
}

const NOUN_CATEGORIES = Object.keys(CP003_NOUN_CATEGORY_NAMES) as CP003NounCategory[];
const PRONOUN_CATEGORIES = Object.keys(CP003_PRONOUN_CATEGORY_NAMES) as CP003PronounCategory[];
const NOUN_CATEGORY_LABELS = NOUN_CATEGORIES.map((x) => CP003_NOUN_CATEGORY_NAMES[x]);
const PRONOUN_CATEGORY_LABELS = PRONOUN_CATEGORIES.map((x) => CP003_PRONOUN_CATEGORY_NAMES[x]);
const nounsByCategory = new Map<CP003NounCategory, CP003NounAuthority[]>(NOUN_CATEGORIES.map((c) => [c, CP003_NOUN_AUTHORITIES.filter((x) => x.category === c)]));
const pronounsByCategory = new Map(PRONOUN_CATEGORIES.map((c) => [c, CP003_PRONOUN_CONTEXTS.filter((x) => x.category === c)]));
const PERSON_NUMBER_PARADIGMS = CP003_PRONOUN_PARADIGMS.slice(0, 4);
const RELATIONS = Object.keys(CP003_PRONOUN_RELATION_NAMES) as CP003PronounRelation[];
const NON_KARTA_RELATIONS = RELATIONS.filter((x) => x !== "KARTA");
const INFLECTIONS = CP003_PRONOUN_PARADIGMS.flatMap((p) => RELATIONS.map((r) => ({ id: `${p.id}-${r}`, paradigm: p, relation: r, relationNamePa: CP003_PRONOUN_RELATION_NAMES[r], form: p.forms[r] })));
const REVERSE_INFLECTIONS = CP003_PRONOUN_PARADIGMS.flatMap((p) => NON_KARTA_RELATIONS.map((r) => ({ id: `${p.id}-${r}`, paradigm: p, relation: r, relationNamePa: CP003_PRONOUN_RELATION_NAMES[r], form: p.forms[r] })));

export function generateCP003F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP003 F01 supports Easy only");
  const t = CP003_NOUN_AUTHORITIES[ordinal(seed, 225)]!;
  return assemble({ seed, difficulty, familyId: "F01", subtype: "NOUN_CATEGORY_RECOGNITION", stem: `‘${t.word}’ ਕਿਸ ਕਿਸਮ ਦਾ ਨਾਂਵ ਹੈ?`, correctAnswer: t.categoryNamePa, distractors: NOUN_CATEGORY_LABELS.filter((x) => x !== t.categoryNamePa), explanation: `‘${t.word}’ ${t.categoryNamePa} ਹੈ।`, authorityIds: [t.id] });
}
export function generateCP003F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP003 F02 supports Easy only");
  const t = CP003_PRONOUN_CONTEXTS[ordinal(seed, 60)]!;
  return assemble({ seed, difficulty, familyId: "F02", subtype: "PRONOUN_CATEGORY_IN_CONTEXT", stem: `${t.sentence}\n\nਇਸ ਵਾਕ ਵਿੱਚ ‘${t.target}’ ਕਿਸ ਕਿਸਮ ਦਾ ਪੜਨਾਂਵ ਹੈ?`, correctAnswer: t.categoryNamePa, distractors: PRONOUN_CATEGORY_LABELS.filter((x) => x !== t.categoryNamePa), explanation: `ਇੱਥੇ ‘${t.target}’ ${t.categoryNamePa} ਵਜੋਂ ਵਰਤਿਆ ਗਿਆ ਹੈ।`, authorityIds: [t.id] });
}
export function generateCP003F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP003 F03 supports Easy only");
  const t = PERSON_NUMBER_PARADIGMS[ordinal(seed, PERSON_NUMBER_PARADIGMS.length)]!;
  const correct = `${t.personPa} — ${t.numberPa}`;
  return assemble({ seed, difficulty, familyId: "F03", subtype: "PRONOUN_PERSON_NUMBER", stem: `ਪੜਨਾਂਵ ‘${t.labelPa}’ ਦਾ ਪੁਰਖ ਅਤੇ ਵਚਨ ਚੁਣੋ।`, correctAnswer: correct, distractors: PERSON_NUMBER_PARADIGMS.map((x) => `${x.personPa} — ${x.numberPa}`).filter((x) => x !== correct), explanation: `‘${t.labelPa}’ ${t.personPa} ਦਾ ${t.numberPa} ਰੂਪ ਹੈ।`, authorityIds: [t.id] });
}
export function generateCP003F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP003 F04 supports Medium only");
  const t = CP003_NOUN_AUTHORITIES[ordinal(seed, 225)]!;
  const others = NOUN_CATEGORIES.filter((x) => x !== t.category).map((c, i) => nounsByCategory.get(c)![ordinal(seed + i * 11, 45)]!.word);
  return assemble({ seed, difficulty, familyId: "F04", subtype: "NOUN_CATEGORY_MEMBERSHIP", stem: `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ${t.categoryNamePa} ਕਿਹੜਾ ਹੈ?`, correctAnswer: t.word, distractors: others, explanation: `‘${t.word}’ ${t.categoryNamePa} ਹੈ।`, authorityIds: [t.id] });
}
export function generateCP003F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP003 F05 supports Medium only");
  const trioCount = choose(45, 3); const perCategory = trioCount * 180; const rank = ordinal(seed, 5 * perCategory);
  const category = NOUN_CATEGORIES[Math.floor(rank / perCategory)]!; const local = rank % perCategory;
  const trio = combinationAt(nounsByCategory.get(category)!, 3, Math.floor(local / 180));
  const outlier = CP003_NOUN_AUTHORITIES.filter((x) => x.category !== category)[local % 180]!;
  return assemble({ seed, difficulty, familyId: "F05", subtype: "NOUN_ODD_ONE_OUT", stem: "ਕਿਹੜਾ ਸ਼ਬਦ ਬਾਕੀ ਤਿੰਨਾਂ ਤੋਂ ਵੱਖਰੀ ਕਿਸਮ ਦਾ ਨਾਂਵ ਹੈ?", correctAnswer: outlier.word, distractors: trio.map((x) => x.word), explanation: `‘${outlier.word}’ ${outlier.categoryNamePa} ਹੈ।`, authorityIds: [...trio.map((x) => x.id), outlier.id] });
}
export function generateCP003F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP003 F06 supports Medium only");
  const t = CP003_PRONOUN_CONTEXTS[ordinal(seed, 60)]!;
  const distractors = PRONOUN_CATEGORIES.filter((x) => x !== t.category).map((c, i) => pronounsByCategory.get(c)![ordinal(seed + i * 7, 10)]!.sentence);
  return assemble({ seed, difficulty, familyId: "F06", subtype: "PRONOUN_CATEGORY_SENTENCE_SELECTION", stem: `ਕਿਹੜੇ ਵਾਕ ਵਿੱਚ ${t.categoryNamePa} ਵਰਤਿਆ ਗਿਆ ਹੈ?`, correctAnswer: t.sentence, distractors, explanation: `‘${t.sentence}’ ਵਿੱਚ ‘${t.target}’ ${t.categoryNamePa} ਹੈ।`, authorityIds: [t.id] });
}
export function generateCP003F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP003 F07 supports Medium only");
  const t = INFLECTIONS[ordinal(seed, INFLECTIONS.length)]!;
  const distractors = CP003_PRONOUN_PARADIGMS.filter((x) => x.id !== t.paradigm.id).map((x) => x.forms[t.relation]);
  return assemble({ seed, difficulty, familyId: "F07", subtype: "PRONOUN_INFLECTION_FORWARD", stem: `‘${t.paradigm.labelPa}’ ਦਾ ${t.relationNamePa} ਕਿਹੜਾ ਹੈ?`, correctAnswer: t.form, distractors, explanation: `‘${t.paradigm.labelPa}’ ਦਾ ${t.relationNamePa} ‘${t.form}’ ਹੈ।`, authorityIds: [t.id] });
}
export function generateCP003F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP003 F08 supports Medium only");
  const t = REVERSE_INFLECTIONS[ordinal(seed, REVERSE_INFLECTIONS.length)]!;
  return assemble({ seed, difficulty, familyId: "F08", subtype: "PRONOUN_INFLECTION_REVERSE", stem: `‘${t.form}’ ਰੂਪ ਕਿਸ ਪੜਨਾਂਵ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`, correctAnswer: t.paradigm.labelPa, distractors: CP003_PRONOUN_PARADIGMS.filter((x) => x.id !== t.paradigm.id).map((x) => x.labelPa), explanation: `‘${t.form}’ ‘${t.paradigm.labelPa}’ ਦਾ ${t.relationNamePa} ਹੈ।`, authorityIds: [t.id] });
}
export function generateCP003F09(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP003 F09 supports Hard only");
  const pairCount = choose(45, 2); const rank = ordinal(seed, 5 * pairCount); const category = NOUN_CATEGORIES[Math.floor(rank / pairCount)]!;
  const pair = combinationAt(nounsByCategory.get(category)!, 2, rank % pairCount); const others = NOUN_CATEGORIES.filter((x) => x !== category);
  const pick = (c: CP003NounCategory, offset: number) => nounsByCategory.get(c)![ordinal(seed + offset, 45)]!.word;
  const distractors = [`${pick(others[0]!, 3)} — ${pick(others[1]!, 9)}`, `${pair[0]!.word} — ${pick(others[2]!, 15)}`, `${pick(others[3]!, 21)} — ${pair[1]!.word}`];
  return assemble({ seed, difficulty, familyId: "F09", subtype: "NOUN_SAME_CATEGORY_PAIR", stem: `ਕਿਹੜੇ ਜੋੜੇ ਦੇ ਦੋਵੇਂ ਸ਼ਬਦ ${CP003_NOUN_CATEGORY_NAMES[category]} ਹਨ?`, correctAnswer: `${pair[0]!.word} — ${pair[1]!.word}`, distractors, explanation: `‘${pair[0]!.word}’ ਅਤੇ ‘${pair[1]!.word}’ ਦੋਵੇਂ ${CP003_NOUN_CATEGORY_NAMES[category]} ਹਨ।`, authorityIds: pair.map((x) => x.id) });
}
export function generateCP003F10(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP003 F10 supports Hard only");
  const rank = ordinal(seed, 1500); const cats = combinationAt(PRONOUN_CATEGORIES, 2, Math.floor(rank / 100)); const local = rank % 100;
  const first = pronounsByCategory.get(cats[0]!)![Math.floor(local / 10)]!; const second = pronounsByCategory.get(cats[1]!)![local % 10]!;
  const correct = `${first.categoryNamePa} — ${second.categoryNamePa}`;
  const labels = PRONOUN_CATEGORIES.flatMap((a) => PRONOUN_CATEGORIES.filter((b) => b !== a).map((b) => `${CP003_PRONOUN_CATEGORY_NAMES[a]} — ${CP003_PRONOUN_CATEGORY_NAMES[b]}`));
  return assemble({ seed, difficulty, familyId: "F10", subtype: "TWO_SENTENCE_PRONOUN_CLASSIFICATION", stem: `ਦੋਵੇਂ ਵਾਕ ਪੜ੍ਹੋ।\n\n1. ${first.sentence}\n2. ${second.sentence}\n\nਕ੍ਰਮਵਾਰ ਪੜਨਾਂਵ ਦੀਆਂ ਕਿਸਮਾਂ ਚੁਣੋ।`, correctAnswer: correct, distractors: labels.filter((x) => x !== correct), explanation: `ਵਾਕ 1 ਵਿੱਚ ‘${first.target}’ ${first.categoryNamePa} ਹੈ ਅਤੇ ਵਾਕ 2 ਵਿੱਚ ‘${second.target}’ ${second.categoryNamePa} ਹੈ।`, authorityIds: [first.id, second.id] });
}
export function generateCP003F11(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP003 F11 supports Hard only");
  const rank = ordinal(seed, 225 * 60); const noun = CP003_NOUN_AUTHORITIES[Math.floor(rank / 60)]!; const pronoun = CP003_PRONOUN_CONTEXTS[rank % 60]!;
  const correct = `${noun.categoryNamePa} — ${pronoun.categoryNamePa}`;
  const labels = NOUN_CATEGORIES.flatMap((n) => PRONOUN_CATEGORIES.map((p) => `${CP003_NOUN_CATEGORY_NAMES[n]} — ${CP003_PRONOUN_CATEGORY_NAMES[p]}`));
  return assemble({ seed, difficulty, familyId: "F11", subtype: "MIXED_NOUN_PRONOUN_CLASSIFICATION", stem: `ਪਹਿਲਾਂ ‘${noun.word}’ ਦੇ ਨਾਂਵ-ਭੇਦ ਅਤੇ ਫਿਰ ਇਸ ਵਾਕ ਵਿੱਚ ‘${pronoun.target}’ ਦੇ ਪੜਨਾਂਵ-ਭੇਦ ਦੀ ਪਛਾਣ ਕਰੋ:\n\n${pronoun.sentence}`, correctAnswer: correct, distractors: labels.filter((x) => x !== correct), explanation: `‘${noun.word}’ ${noun.categoryNamePa} ਹੈ; ਵਾਕ ਵਿੱਚ ‘${pronoun.target}’ ${pronoun.categoryNamePa} ਹੈ।`, authorityIds: [noun.id, pronoun.id] });
}
export function generateCP003F12(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP003 F12 supports Hard only");
  const rank = ordinal(seed, 911250); const cats = combinationAt(NOUN_CATEGORIES, 3, Math.floor(rank / (45 * 45 * 45))); const local = rank % (45 * 45 * 45);
  const indices = [Math.floor(local / (45 * 45)), Math.floor(local / 45) % 45, local % 45];
  const items = createRng(`CP003:F12:ORDER:${seed}`).shuffle(cats.map((c, i) => nounsByCategory.get(c)![indices[i]!]!));
  const correct = items.map((x) => x.categoryNamePa).join(" — ");
  const labels = NOUN_CATEGORIES.flatMap((a) => NOUN_CATEGORIES.filter((b) => b !== a).flatMap((b) => NOUN_CATEGORIES.filter((c) => c !== a && c !== b).map((c) => `${CP003_NOUN_CATEGORY_NAMES[a]} — ${CP003_NOUN_CATEGORY_NAMES[b]} — ${CP003_NOUN_CATEGORY_NAMES[c]}`)));
  return assemble({ seed, difficulty, familyId: "F12", subtype: "THREE_NOUN_CLASSIFICATION", stem: `ਕ੍ਰਮਵਾਰ ਤਿੰਨਾਂ ਨਾਂਵਾਂ ਦੀ ਕਿਸਮ ਚੁਣੋ:\n\n${items.map((x, i) => `${i + 1}. ${x.word}`).join("\n")}`, correctAnswer: correct, distractors: labels.filter((x) => x !== correct), explanation: items.map((x) => `‘${x.word}’ ${x.categoryNamePa} ਹੈ`).join("; ") + "।", authorityIds: items.map((x) => x.id) });
}

export function getCP003BreadthReport() {
  const capacities = { F01: 225, F02: 60, F03: PERSON_NUMBER_PARADIGMS.length, F04: 225, F05: 5 * choose(45, 3) * 180, F06: 60, F07: CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT, F08: REVERSE_INFLECTIONS.length, F09: 5 * choose(45, 2), F10: 1500, F11: 225 * 60, F12: choose(5, 3) * 45 * 45 * 45 } as const;
  return { nounAuthorityCount: CP003_NOUN_AUTHORITIES.length, pronounContextAuthorityCount: CP003_PRONOUN_CONTEXTS.length, pronounInflectionAuthorityCount: CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT, totalAtomicAuthorities: CP003_NOUN_AUTHORITIES.length + CP003_PRONOUN_CONTEXTS.length + CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT, nounCategoryCount: NOUN_CATEGORIES.length, pronounCategoryCount: PRONOUN_CATEGORIES.length, familyCount: 12, capacities, totalSemanticCapacity: Object.values(capacities).reduce((sum, value) => sum + value, 0) } as const;
}

export const CP003_FAMILIES: readonly PunjabiQuestionFamilyDefinition[] = [
  { familyId: "F01", subtype: "NOUN_CATEGORY_RECOGNITION", name: "ਨਾਂਵ-ਭੇਦ ਪਛਾਣ", targetDifficulties: ["Easy"], generate: generateCP003F01 },
  { familyId: "F02", subtype: "PRONOUN_CATEGORY_IN_CONTEXT", name: "ਸੰਦਰਭ ਵਿੱਚ ਪੜਨਾਂਵ-ਭੇਦ", targetDifficulties: ["Easy"], generate: generateCP003F02 },
  { familyId: "F03", subtype: "PRONOUN_PERSON_NUMBER", name: "ਪੜਨਾਂਵ ਦਾ ਪੁਰਖ ਅਤੇ ਵਚਨ", targetDifficulties: ["Easy"], generate: generateCP003F03 },
  { familyId: "F04", subtype: "NOUN_CATEGORY_MEMBERSHIP", name: "ਨਾਂਵ-ਭੇਦ ਮੈਂਬਰਸ਼ਿਪ", targetDifficulties: ["Medium"], generate: generateCP003F04 },
  { familyId: "F05", subtype: "NOUN_ODD_ONE_OUT", name: "ਵੱਖਰਾ ਨਾਂਵ ਚੁਣੋ", targetDifficulties: ["Medium"], generate: generateCP003F05 },
  { familyId: "F06", subtype: "PRONOUN_CATEGORY_SENTENCE_SELECTION", name: "ਵਾਕ ਅਧਾਰਿਤ ਪੜਨਾਂਵ ਚੋਣ", targetDifficulties: ["Medium"], generate: generateCP003F06 },
  { familyId: "F07", subtype: "PRONOUN_INFLECTION_FORWARD", name: "ਪੜਨਾਂਵ ਰੂਪਾਂਤਰਨ", targetDifficulties: ["Medium"], generate: generateCP003F07 },
  { familyId: "F08", subtype: "PRONOUN_INFLECTION_REVERSE", name: "ਰੂਪ ਤੋਂ ਪੜਨਾਂਵ ਪਛਾਣ", targetDifficulties: ["Medium"], generate: generateCP003F08 },
  { familyId: "F09", subtype: "NOUN_SAME_CATEGORY_PAIR", name: "ਇੱਕੋ ਨਾਂਵ-ਭੇਦ ਦਾ ਜੋੜਾ", targetDifficulties: ["Hard"], generate: generateCP003F09 },
  { familyId: "F10", subtype: "TWO_SENTENCE_PRONOUN_CLASSIFICATION", name: "ਦੋ ਵਾਕਾਂ ਵਿੱਚ ਪੜਨਾਂਵ ਪਛਾਣ", targetDifficulties: ["Hard"], generate: generateCP003F10 },
  { familyId: "F11", subtype: "MIXED_NOUN_PRONOUN_CLASSIFICATION", name: "ਨਾਂਵ-ਪੜਨਾਂਵ ਮਿਲੀ-ਜੁਲੀ ਪਛਾਣ", targetDifficulties: ["Hard"], generate: generateCP003F11 },
  { familyId: "F12", subtype: "THREE_NOUN_CLASSIFICATION", name: "ਤਿੰਨ ਨਾਂਵਾਂ ਦੀ ਕ੍ਰਮਵਾਰ ਪਛਾਣ", targetDifficulties: ["Hard"], generate: generateCP003F12 },
] as const;
