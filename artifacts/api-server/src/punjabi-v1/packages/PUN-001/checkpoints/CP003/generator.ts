import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import {
  CP003_NOUN_AUTHORITIES,
  CP003_NOUN_CATEGORY_NAMES,
  type CP003NounAuthority,
  type CP003NounCategory,
} from "./CP003-noun-corpus";
import {
  CP003_PRONOUN_CONTEXTS,
  CP003_PRONOUN_CATEGORY_NAMES,
  type CP003PronounCategory,
} from "./CP003-pronoun-corpus";
import {
  CP003_PRONOUN_PARADIGMS,
  CP003_PRONOUN_RELATION_NAMES,
  CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT,
  type CP003PronounRelation,
} from "./CP003-authorities";

function norm(value: string): string {
  return value.normalize("NFC").trim();
}

function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const r = Math.min(k, n - k);
  let result = 1;
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
  const out: T[] = [];
  let start = 0;
  for (let position = 0; position < k; position++) {
    const remaining = k - position - 1;
    for (let candidate = start; candidate <= items.length - (k - position); candidate++) {
      const block = choose(items.length - candidate - 1, remaining);
      if (rank < block) {
        out.push(items[candidate]!);
        start = candidate + 1;
        break;
      }
      rank -= block;
    }
  }
  if (out.length !== k) throw new Error(`Unable to unrank CP003 combination k=${k}, index=${index}`);
  return out;
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
  const rng = createRng(`CP003:${input.familyId}:${input.seed}`);
  const correct = norm(input.correctAnswer);
  const distractors = [...new Set(input.distractors.map(norm))].filter((x) => x && x !== correct);
  if (distractors.length < 3) throw new Error(`CP003 ${input.familyId}: fewer than three distinct distractors`);
  const selected = rng.pickDistinct(distractors, 3);
  const options = rng.shuffle([correct, ...selected]);
  const fingerprint = `CP003-${semanticHash([
    input.familyId,
    input.subtype,
    input.difficulty,
    norm(input.stem),
    correct,
    [...selected].sort().join("|"),
    [...input.authorityIds].sort().join(","),
  ])}`;
  return {
    id: `PUN-001-CP003-${input.familyId}-${fingerprint}`,
    stem: norm(input.stem),
    options,
    correctIndex: options.indexOf(correct),
    explanation: norm(input.explanation),
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP003",
      familyId: input.familyId,
      subtype: input.subtype,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "2.0.0-forward-port",
      fingerprint,
      lifecycle: "REVIEW_ONLY",
    },
  };
}

const NOUN_CATEGORIES = Object.keys(CP003_NOUN_CATEGORY_NAMES) as CP003NounCategory[];
const PRONOUN_CATEGORIES = Object.keys(CP003_PRONOUN_CATEGORY_NAMES) as CP003PronounCategory[];
const NOUN_CATEGORY_LABELS = NOUN_CATEGORIES.map((x) => CP003_NOUN_CATEGORY_NAMES[x]);
const PRONOUN_CATEGORY_LABELS = PRONOUN_CATEGORIES.map((x) => CP003_PRONOUN_CATEGORY_NAMES[x]);
const nounsByCategory = new Map<CP003NounCategory, CP003NounAuthority[]>(
  NOUN_CATEGORIES.map((category) => [category, CP003_NOUN_AUTHORITIES.filter((x) => x.category === category)]),
);
const pronounsByCategory = new Map(
  PRONOUN_CATEGORIES.map((category) => [category, CP003_PRONOUN_CONTEXTS.filter((x) => x.category === category)]),
);

const RELATIONS = Object.keys(CP003_PRONOUN_RELATION_NAMES) as CP003PronounRelation[];
const NON_KARTA_RELATIONS = RELATIONS.filter((x) => x !== "KARTA");
const INFLECTIONS = CP003_PRONOUN_PARADIGMS.flatMap((paradigm) => RELATIONS.map((relation) => ({
  id: `${paradigm.id}-${relation}`,
  paradigm,
  relation,
  relationNamePa: CP003_PRONOUN_RELATION_NAMES[relation],
  form: paradigm.forms[relation],
})));
const REVERSE_INFLECTIONS = CP003_PRONOUN_PARADIGMS.flatMap((paradigm) => NON_KARTA_RELATIONS.map((relation) => ({
  id: `${paradigm.id}-${relation}`,
  paradigm,
  relation,
  relationNamePa: CP003_PRONOUN_RELATION_NAMES[relation],
  form: paradigm.forms[relation],
})));

function paradigmLabel(index: number): string {
  const p = CP003_PRONOUN_PARADIGMS[index]!;
  return `${p.labelPa} — ${p.personPa} — ${p.numberPa}`;
}

export function generateCP003F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP003 F01 supports Easy only");
  const target = CP003_NOUN_AUTHORITIES[ordinal(seed, CP003_NOUN_AUTHORITIES.length)]!;
  return assemble({
    seed, difficulty, familyId: "F01", subtype: "NOUN_CATEGORY_RECOGNITION",
    stem: `‘${target.word}’ ਕਿਸ ਕਿਸਮ ਦਾ ਨਾਂਵ ਹੈ?`,
    correctAnswer: target.categoryNamePa,
    distractors: NOUN_CATEGORY_LABELS.filter((x) => x !== target.categoryNamePa),
    explanation: `‘${target.word}’ ${target.categoryNamePa} ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP003F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP003 F02 supports Easy only");
  const target = CP003_PRONOUN_CONTEXTS[ordinal(seed, CP003_PRONOUN_CONTEXTS.length)]!;
  return assemble({
    seed, difficulty, familyId: "F02", subtype: "PRONOUN_CATEGORY_IN_CONTEXT",
    stem: `${target.sentence}\n\nਇਸ ਵਾਕ ਵਿੱਚ ‘${target.target}’ ਕਿਸ ਕਿਸਮ ਦਾ ਪੜਨਾਂਵ ਹੈ?`,
    correctAnswer: target.categoryNamePa,
    distractors: PRONOUN_CATEGORY_LABELS.filter((x) => x !== target.categoryNamePa),
    explanation: `ਇੱਥੇ ‘${target.target}’ ${target.categoryNamePa} ਵਜੋਂ ਵਰਤਿਆ ਗਿਆ ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP003F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP003 F03 supports Easy only");
  const index = ordinal(seed, CP003_PRONOUN_PARADIGMS.length);
  const target = CP003_PRONOUN_PARADIGMS[index]!;
  return assemble({
    seed, difficulty, familyId: "F03", subtype: "PRONOUN_PERSON_NUMBER",
    stem: `ਪੜਨਾਂਵ ‘${target.labelPa}’ ਦਾ ਪੁਰਖ ਅਤੇ ਵਚਨ ਚੁਣੋ।`,
    correctAnswer: `${target.personPa} — ${target.numberPa}`,
    distractors: CP003_PRONOUN_PARADIGMS.map((x) => `${x.personPa} — ${x.numberPa}`).filter((x) => x !== `${target.personPa} — ${target.numberPa}`),
    explanation: `‘${target.labelPa}’ ${target.personPa} ਦਾ ${target.numberPa} ਰੂਪ ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP003F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP003 F04 supports Medium only");
  const target = CP003_NOUN_AUTHORITIES[ordinal(seed, CP003_NOUN_AUTHORITIES.length)]!;
  const otherCategories = NOUN_CATEGORIES.filter((x) => x !== target.category);
  const distractors = otherCategories.map((category, index) => {
    const pool = nounsByCategory.get(category)!;
    return pool[ordinal(seed + index * 11, pool.length)]!.word;
  });
  return assemble({
    seed, difficulty, familyId: "F04", subtype: "NOUN_CATEGORY_MEMBERSHIP",
    stem: `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ${target.categoryNamePa} ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: target.word,
    distractors,
    explanation: `‘${target.word}’ ${target.categoryNamePa} ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP003F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP003 F05 supports Medium only");
  const trioCount = choose(45, 3);
  const capacityPerCategory = trioCount * 180;
  const rank = ordinal(seed, NOUN_CATEGORIES.length * capacityPerCategory);
  const categoryIndex = Math.floor(rank / capacityPerCategory);
  const local = rank % capacityPerCategory;
  const trioRank = Math.floor(local / 180);
  const outlierRank = local % 180;
  const category = NOUN_CATEGORIES[categoryIndex]!;
  const samePool = nounsByCategory.get(category)!;
  const trio = combinationAt(samePool, 3, trioRank);
  const otherPool = CP003_NOUN_AUTHORITIES.filter((x) => x.category !== category);
  const outlier = otherPool[outlierRank]!;
  return assemble({
    seed, difficulty, familyId: "F05", subtype: "NOUN_ODD_ONE_OUT",
    stem: "ਕਿਹੜਾ ਸ਼ਬਦ ਬਾਕੀ ਤਿੰਨਾਂ ਤੋਂ ਵੱਖਰੀ ਕਿਸਮ ਦਾ ਨਾਂਵ ਹੈ?",
    correctAnswer: outlier.word,
    distractors: trio.map((x) => x.word),
    explanation: `ਬਾਕੀ ਤਿੰਨੇ ${CP003_NOUN_CATEGORY_NAMES[category]} ਹਨ, ਜਦਕਿ ‘${outlier.word}’ ${outlier.categoryNamePa} ਹੈ।`,
    authorityIds: [...trio.map((x) => x.id), outlier.id],
  });
}

export function generateCP003F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP003 F06 supports Medium only");
  const target = CP003_PRONOUN_CONTEXTS[ordinal(seed, CP003_PRONOUN_CONTEXTS.length)]!;
  const otherCategories = PRONOUN_CATEGORIES.filter((x) => x !== target.category);
  const distractors = otherCategories.map((category, index) => {
    const pool = pronounsByCategory.get(category)!;
    return pool[ordinal(seed + index * 7, pool.length)]!.sentence;
  });
  return assemble({
    seed, difficulty, familyId: "F06", subtype: "PRONOUN_CATEGORY_SENTENCE_SELECTION",
    stem: `ਕਿਹੜੇ ਵਾਕ ਵਿੱਚ ${target.categoryNamePa} ਵਰਤਿਆ ਗਿਆ ਹੈ?`,
    correctAnswer: target.sentence,
    distractors,
    explanation: `‘${target.sentence}’ ਵਿੱਚ ‘${target.target}’ ${target.categoryNamePa} ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP003F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP003 F07 supports Medium only");
  const target = INFLECTIONS[ordinal(seed, INFLECTIONS.length)]!;
  const distractors = CP003_PRONOUN_PARADIGMS
    .filter((x) => x.id !== target.paradigm.id)
    .map((x) => x.forms[target.relation]);
  return assemble({
    seed, difficulty, familyId: "F07", subtype: "PRONOUN_INFLECTION_FORWARD",
    stem: `‘${target.paradigm.labelPa}’ ਦਾ ${target.relationNamePa} ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: target.form,
    distractors,
    explanation: `‘${target.paradigm.labelPa}’ ਦਾ ${target.relationNamePa} ‘${target.form}’ ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP003F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP003 F08 supports Medium only");
  const target = REVERSE_INFLECTIONS[ordinal(seed, REVERSE_INFLECTIONS.length)]!;
  const correct = paradigmLabel(CP003_PRONOUN_PARADIGMS.findIndex((x) => x.id === target.paradigm.id));
  return assemble({
    seed, difficulty, familyId: "F08", subtype: "PRONOUN_INFLECTION_REVERSE",
    stem: `‘${target.form}’ ਰੂਪ ਕਿਸ ਪੜਨਾਂਵ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?`,
    correctAnswer: correct,
    distractors: CP003_PRONOUN_PARADIGMS.filter((x) => x.id !== target.paradigm.id).map((x) => `${x.labelPa} — ${x.personPa} — ${x.numberPa}`),
    explanation: `‘${target.form}’ ‘${target.paradigm.labelPa}’ ਦਾ ${target.relationNamePa} ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP003F09(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP003 F09 supports Hard only");
  const pairCount = choose(45, 2);
  const rank = ordinal(seed, NOUN_CATEGORIES.length * pairCount);
  const categoryIndex = Math.floor(rank / pairCount);
  const pairRank = rank % pairCount;
  const category = NOUN_CATEGORIES[categoryIndex]!;
  const pair = combinationAt(nounsByCategory.get(category)!, 2, pairRank);
  const otherCategories = NOUN_CATEGORIES.filter((x) => x !== category);
  const pick = (cat: CP003NounCategory, offset: number) => nounsByCategory.get(cat)![ordinal(seed + offset, 45)]!.word;
  const distractors = [
    `${pick(otherCategories[0]!, 3)} — ${pick(otherCategories[1]!, 9)}`,
    `${pair[0]!.word} — ${pick(otherCategories[2]!, 15)}`,
    `${pick(otherCategories[3]!, 21)} — ${pair[1]!.word}`,
  ];
  return assemble({
    seed, difficulty, familyId: "F09", subtype: "NOUN_SAME_CATEGORY_PAIR",
    stem: `ਕਿਹੜੇ ਜੋੜੇ ਦੇ ਦੋਵੇਂ ਸ਼ਬਦ ${CP003_NOUN_CATEGORY_NAMES[category]} ਹਨ?`,
    correctAnswer: `${pair[0]!.word} — ${pair[1]!.word}`,
    distractors,
    explanation: `‘${pair[0]!.word}’ ਅਤੇ ‘${pair[1]!.word’} ਦੋਵੇਂ ${CP003_NOUN_CATEGORY_NAMES[category]} ਹਨ।`,
    authorityIds: pair.map((x) => x.id),
  });
}

export function generateCP003F10(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP003 F10 supports Hard only");
  const categoryPairs = combinationAt(PRONOUN_CATEGORIES, 2, Math.floor(ordinal(seed, 1500) / 100));
  const local = ordinal(seed, 1500) % 100;
  const first = pronounsByCategory.get(categoryPairs[0]!)![Math.floor(local / 10)]!;
  const second = pronounsByCategory.get(categoryPairs[1]!)![local % 10]!;
  const correct = `${first.categoryNamePa} — ${second.categoryNamePa}`;
  const pairLabels = PRONOUN_CATEGORIES.flatMap((a) => PRONOUN_CATEGORIES.filter((b) => b !== a).map((b) => `${CP003_PRONOUN_CATEGORY_NAMES[a]} — ${CP003_PRONOUN_CATEGORY_NAMES[b]}`));
  return assemble({
    seed, difficulty, familyId: "F10", subtype: "TWO_SENTENCE_PRONOUN_CLASSIFICATION",
    stem: `ਦੋਵੇਂ ਵਾਕ ਪੜ੍ਹੋ।\n\n1. ${first.sentence}\n2. ${second.sentence}\n\nਕ੍ਰਮਵਾਰ ਪੜਨਾਂਵ ਦੀਆਂ ਕਿਸਮਾਂ ਚੁਣੋ।`,
    correctAnswer: correct,
    distractors: pairLabels.filter((x) => x !== correct),
    explanation: `ਵਾਕ 1 ਵਿੱਚ ‘${first.target}’ ${first.categoryNamePa} ਹੈ ਅਤੇ ਵਾਕ 2 ਵਿੱਚ ‘${second.target}’ ${second.categoryNamePa} ਹੈ।`,
    authorityIds: [first.id, second.id],
  });
}

export function generateCP003F11(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP003 F11 supports Hard only");
  const rank = ordinal(seed, CP003_NOUN_AUTHORITIES.length * CP003_PRONOUN_CONTEXTS.length);
  const noun = CP003_NOUN_AUTHORITIES[Math.floor(rank / CP003_PRONOUN_CONTEXTS.length)]!;
  const pronoun = CP003_PRONOUN_CONTEXTS[rank % CP003_PRONOUN_CONTEXTS.length]!;
  const correct = `${noun.categoryNamePa} — ${pronoun.categoryNamePa}`;
  const labels = NOUN_CATEGORIES.flatMap((n) => PRONOUN_CATEGORIES.map((p) => `${CP003_NOUN_CATEGORY_NAMES[n]} — ${CP003_PRONOUN_CATEGORY_NAMES[p]}`));
  return assemble({
    seed, difficulty, familyId: "F11", subtype: "MIXED_NOUN_PRONOUN_CLASSIFICATION",
    stem: `ਪਹਿਲਾਂ ‘${noun.word}’ ਦੇ ਨਾਂਵ-ਭੇਦ ਅਤੇ ਫਿਰ ਇਸ ਵਾਕ ਵਿੱਚ ‘${pronoun.target}’ ਦੇ ਪੜਨਾਂਵ-ਭੇਦ ਦੀ ਪਛਾਣ ਕਰੋ:\n\n${pronoun.sentence}`,
    correctAnswer: correct,
    distractors: labels.filter((x) => x !== correct),
    explanation: `‘${noun.word}’ ${noun.categoryNamePa} ਹੈ; ਵਾਕ ਵਿੱਚ ‘${pronoun.target}’ ${pronoun.categoryNamePa} ਹੈ।`,
    authorityIds: [noun.id, pronoun.id],
  });
}

export function generateCP003F12(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP003 F12 supports Hard only");
  const tripleCategories = combinationAt(NOUN_CATEGORIES, 3, Math.floor(ordinal(seed, 911250) / (45 * 45 * 45)));
  const local = ordinal(seed, 911250) % (45 * 45 * 45);
  const indices = [Math.floor(local / (45 * 45)), Math.floor(local / 45) % 45, local % 45];
  const rawItems = tripleCategories.map((category, index) => nounsByCategory.get(category)![indices[index]!]!);
  const rng = createRng(`CP003:F12:ORDER:${seed}`);
  const items = rng.shuffle(rawItems);
  const correct = items.map((x) => x.categoryNamePa).join(" — ");
  const labels = NOUN_CATEGORIES.flatMap((a) => NOUN_CATEGORIES.filter((b) => b !== a).flatMap((b) => NOUN_CATEGORIES.filter((c) => c !== a && c !== b).map((c) => `${CP003_NOUN_CATEGORY_NAMES[a]} — ${CP003_NOUN_CATEGORY_NAMES[b]} — ${CP003_NOUN_CATEGORY_NAMES[c]}`)));
  return assemble({
    seed, difficulty, familyId: "F12", subtype: "THREE_NOUN_CLASSIFICATION",
    stem: `ਕ੍ਰਮਵਾਰ ਤਿੰਨਾਂ ਨਾਂਵਾਂ ਦੀ ਕਿਸਮ ਚੁਣੋ:\n\n${items.map((x, index) => `${index + 1}. ${x.word}`).join("\n")}`,
    correctAnswer: correct,
    distractors: labels.filter((x) => x !== correct),
    explanation: items.map((x) => `‘${x.word}’ ${x.categoryNamePa} ਹੈ`).join("; ") + "।",
    authorityIds: items.map((x) => x.id),
  });
}

export function getCP003BreadthReport() {
  const capacities = {
    F01: 225,
    F02: 60,
    F03: 8,
    F04: 225,
    F05: 5 * choose(45, 3) * 180,
    F06: 60,
    F07: CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT,
    F08: REVERSE_INFLECTIONS.length,
    F09: 5 * choose(45, 2),
    F10: 15 * 10 * 10,
    F11: 225 * 60,
    F12: choose(5, 3) * 45 * 45 * 45,
  } as const;
  return {
    nounAuthorityCount: CP003_NOUN_AUTHORITIES.length,
    pronounContextAuthorityCount: CP003_PRONOUN_CONTEXTS.length,
    pronounInflectionAuthorityCount: CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT,
    totalAtomicAuthorities: CP003_NOUN_AUTHORITIES.length + CP003_PRONOUN_CONTEXTS.length + CP003_PRONOUN_INFLECTION_AUTHORITY_COUNT,
    nounCategoryCount: NOUN_CATEGORIES.length,
    pronounCategoryCount: PRONOUN_CATEGORIES.length,
    familyCount: 12,
    capacities,
    totalSemanticCapacity: Object.values(capacities).reduce((sum, value) => sum + value, 0),
  } as const;
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
