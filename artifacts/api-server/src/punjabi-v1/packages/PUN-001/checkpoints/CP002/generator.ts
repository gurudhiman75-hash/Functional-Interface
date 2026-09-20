import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import {
  CP002_ACTIVE_AUTHORITIES,
  CP002_CONTEXT_AUTHORITIES,
  getCP002CategoryCounts,
  type ActiveSpellingAuthority,
} from "./CP002-authority-pool";

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
  if (!Number.isSafeInteger(capacity) || capacity <= 0) throw new Error(`Invalid CP002 semantic capacity: ${capacity}`);
  const value = Math.trunc(seed) - 1;
  return ((value % capacity) + capacity) % capacity;
}

function combinationAt<T>(items: readonly T[], k: number, index: number): T[] {
  const total = choose(items.length, k);
  let rank = ordinal(index + 1, total);
  const result: T[] = [];
  let start = 0;

  for (let position = 0; position < k; position++) {
    const remaining = k - position - 1;
    for (let candidate = start; candidate <= items.length - (k - position); candidate++) {
      const block = choose(items.length - candidate - 1, remaining);
      if (rank < block) {
        result.push(items[candidate]!);
        start = candidate + 1;
        break;
      }
      rank -= block;
    }
  }

  if (result.length !== k) throw new Error(`Unable to unrank CP002 combination k=${k}, index=${index}`);
  return result;
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
  const rng = createRng(`${input.familyId}:${input.seed}`);
  const correct = norm(input.correctAnswer);
  const distractors = [...new Set(input.distractors.map(norm))].filter((x) => x && x !== correct);
  if (distractors.length < 3) throw new Error(`CP002 ${input.familyId}: fewer than three valid distractors`);
  const selectedDistractors = rng.pickDistinct(distractors, 3);
  const options = rng.shuffle([correct, ...selectedDistractors]);
  const fingerprint = `CP002-${semanticHash([
    input.familyId,
    input.subtype,
    input.difficulty,
    norm(input.stem),
    correct,
    [...selectedDistractors].sort().join("|"),
    [...input.authorityIds].sort().join(","),
  ])}`;

  return {
    id: `PUN-001-CP002-${input.familyId}-${fingerprint}`,
    stem: norm(input.stem),
    options,
    correctIndex: options.indexOf(correct),
    explanation: norm(input.explanation),
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP002",
      familyId: input.familyId,
      subtype: input.subtype,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "3.0.0-forward-port",
      fingerprint,
      lifecycle: "REVIEW_ONLY",
    },
  };
}

function item(seed: number, pool: readonly ActiveSpellingAuthority[] = CP002_ACTIVE_AUTHORITIES): ActiveSpellingAuthority {
  return pool[ordinal(seed, pool.length)]!;
}

function pairBySeed(seed: number, pool: readonly ActiveSpellingAuthority[]): readonly [ActiveSpellingAuthority, ActiveSpellingAuthority] {
  const pair = combinationAt(pool, 2, ordinal(seed, choose(pool.length, 2)));
  return [pair[0]!, pair[1]!] as const;
}

export function generateCP002F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP002 F01 supports Easy only");
  const target = item(seed);
  return assemble({
    seed,
    difficulty,
    familyId: "F01",
    subtype: "CORRECT_FORM_RECOGNITION",
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸ਼ੁੱਧ ਸ਼ਬਦ ਚੁਣੋ।",
    correctAnswer: target.correct,
    distractors: target.incorrect,
    explanation: target.explanationPa,
    authorityIds: [target.id],
  });
}

export function generateCP002F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP002 F02 supports Medium only");
  const target = item(seed, CP002_CONTEXT_AUTHORITIES);
  const variant = ordinal(Math.floor((seed - 1) / CP002_CONTEXT_AUTHORITIES.length) + 1, 3);
  const wrong = target.incorrect[variant]!;
  const sentence = target.contextPa!.replace(target.correct, wrong);
  return assemble({
    seed,
    difficulty,
    familyId: "F02",
    subtype: "SENTENCE_ERROR_CORRECTION",
    stem: `ਵਾਕ ਵਿੱਚ ਗਲਤ ਲਿਖੇ ਸ਼ਬਦ ਦਾ ਸਹੀ ਰੂਪ ਚੁਣੋ।\n\n“${sentence}”`,
    correctAnswer: target.correct,
    distractors: target.incorrect,
    explanation: `ਵਾਕ ਵਿੱਚ ‘${wrong}’ ਦੀ ਥਾਂ ‘${target.correct}’ ਲਿਖਿਆ ਜਾਵੇਗਾ। ${target.explanationPa}`,
    authorityIds: [target.id],
  });
}

export function generateCP002F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP002 F03 supports Medium only");
  const target = item(seed, CP002_CONTEXT_AUTHORITIES);
  const blanked = target.contextPa!.replace(target.correct, "____");
  return assemble({
    seed,
    difficulty,
    familyId: "F03",
    subtype: "CONTEXTUAL_COMPLETION",
    stem: `ਖਾਲੀ ਥਾਂ ਲਈ ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ਚੁਣੋ।\n\n“${blanked}”`,
    correctAnswer: target.correct,
    distractors: target.incorrect,
    explanation: `ਖਾਲੀ ਥਾਂ ਵਿੱਚ ‘${target.correct}’ ਆਵੇਗਾ। ${target.explanationPa}`,
    authorityIds: [target.id],
  });
}

export function generateCP002F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP002 F04 supports Hard only");
  const pairCount = choose(CP002_CONTEXT_AUTHORITIES.length, 2);
  const space = pairCount * 9;
  const rank = ordinal(seed, space);
  const [a, b] = pairBySeed(Math.floor(rank / 9) + 1, CP002_CONTEXT_AUTHORITIES);
  const variation = rank % 9;
  const variantA = Math.floor(variation / 3);
  const variantB = variation % 3;
  const wrongA = a.incorrect[variantA]!;
  const wrongB = b.incorrect[variantB]!;
  const broken = `${a.contextPa!.replace(a.correct, wrongA)} ${b.contextPa!.replace(b.correct, wrongB)}`;
  const correct = `${a.contextPa} ${b.contextPa}`;
  const d1 = `${a.contextPa!.replace(a.correct, wrongA)} ${b.contextPa}`;
  const d2 = `${a.contextPa} ${b.contextPa!.replace(b.correct, wrongB)}`;
  const d3 = `${a.contextPa!.replace(a.correct, a.incorrect[(variantA + 1) % 3]!)} ${b.contextPa!.replace(b.correct, b.incorrect[(variantB + 1) % 3]!)}`;
  return assemble({
    seed,
    difficulty,
    familyId: "F04",
    subtype: "MULTI_ERROR_SENTENCE_REPAIR",
    stem: `ਦੋਵੇਂ ਸ਼ਬਦ-ਜੋੜ ਠੀਕ ਕਰਕੇ ਸਹੀ ਵਾਕ-ਰੂਪ ਚੁਣੋ।\n\n“${broken}”`,
    correctAnswer: correct,
    distractors: [d1, d2, d3],
    explanation: `ਪਹਿਲੇ ਵਾਕ ਵਿੱਚ ‘${wrongA}’ ਦੀ ਥਾਂ ‘${a.correct}’ ਅਤੇ ਦੂਜੇ ਵਾਕ ਵਿੱਚ ‘${wrongB}’ ਦੀ ਥਾਂ ‘${b.correct}’ ਲਿਖਿਆ ਜਾਵੇਗਾ।`,
    authorityIds: [a.id, b.id],
  });
}

export function generateCP002F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP002 F05 supports Hard only");
  const pairCount = choose(CP002_ACTIVE_AUTHORITIES.length, 2);
  const space = pairCount * 9;
  const rank = ordinal(seed, space);
  const [a, b] = pairBySeed(Math.floor(rank / 9) + 1, CP002_ACTIVE_AUTHORITIES);
  const variation = rank % 9;
  const variantA = Math.floor(variation / 3);
  const variantB = variation % 3;
  const correct = `${a.correct} — ${b.correct}`;
  const d1 = `${a.incorrect[variantA]} — ${b.correct}`;
  const d2 = `${a.correct} — ${b.incorrect[variantB]}`;
  const d3 = `${a.incorrect[(variantA + 1) % 3]} — ${b.incorrect[(variantB + 1) % 3]}`;
  return assemble({
    seed,
    difficulty,
    familyId: "F05",
    subtype: "TWO_WORD_PRECISION",
    stem: "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਦੋਵੇਂ ਸ਼ਬਦ ਸ਼ੁੱਧ ਲਿਖੇ ਹੋਏ ਹਨ।",
    correctAnswer: correct,
    distractors: [d1, d2, d3],
    explanation: `ਸਹੀ ਜੋੜ ‘${correct}’ ਹੈ।`,
    authorityIds: [a.id, b.id],
  });
}

export function generateCP002F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP002 F06 supports Medium only");
  const quartetCount = choose(CP002_ACTIVE_AUTHORITIES.length, 4);
  const space = quartetCount * 12;
  const rank = ordinal(seed, space);
  const quartet = combinationAt(CP002_ACTIVE_AUTHORITIES, 4, Math.floor(rank / 12));
  const local = rank % 12;
  const targetSlot = Math.floor(local / 3);
  const variant = local % 3;
  const target = quartet[targetSlot]!;
  const wrong = target.incorrect[variant]!;
  const displayed = quartet.map((authority, index) => (index === targetSlot ? wrong : authority.correct));
  const distractors = displayed.filter((_, index) => index !== targetSlot);
  return assemble({
    seed,
    difficulty,
    familyId: "F06",
    subtype: "INCORRECT_FORM_DETECTION",
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਅਸ਼ੁੱਧ ਸ਼ਬਦ ਚੁਣੋ।",
    correctAnswer: wrong,
    distractors,
    explanation: `‘${wrong}’ ਅਸ਼ੁੱਧ ਹੈ। ਸਹੀ ਰੂਪ ‘${target.correct}’ ਹੈ।`,
    authorityIds: quartet.map((x) => x.id),
  });
}

export function generateCP002F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP002 F07 supports Hard only");
  const pairCount = choose(CP002_CONTEXT_AUTHORITIES.length, 2);
  const space = pairCount * 16;
  const rank = ordinal(seed, space);
  const [a, b] = pairBySeed(Math.floor(rank / 16) + 1, CP002_CONTEXT_AUTHORITIES);
  const state = rank % 16;
  let sentenceA = a.contextPa!;
  let sentenceB = b.contextPa!;
  let correctAnswer = "ਦੋਵੇਂ ਵਾਕ ਸ਼ੁੱਧ ਹਨ।";
  let explanation = "ਦੋਵੇਂ ਵਾਕਾਂ ਵਿੱਚ ਸ਼ਬਦ-ਜੋੜ ਸ਼ੁੱਧ ਹਨ।";

  if (state >= 1 && state <= 3) {
    const wrongA = a.incorrect[state - 1]!;
    sentenceA = sentenceA.replace(a.correct, wrongA);
    correctAnswer = "ਕੇਵਲ ਵਾਕ 2 ਸ਼ੁੱਧ ਹੈ।";
    explanation = `ਵਾਕ 1 ਵਿੱਚ ‘${wrongA}’ ਦੀ ਥਾਂ ‘${a.correct}’ ਲਿਖਿਆ ਜਾਵੇਗਾ; ਵਾਕ 2 ਸ਼ੁੱਧ ਹੈ।`;
  } else if (state >= 4 && state <= 6) {
    const wrongB = b.incorrect[state - 4]!;
    sentenceB = sentenceB.replace(b.correct, wrongB);
    correctAnswer = "ਕੇਵਲ ਵਾਕ 1 ਸ਼ੁੱਧ ਹੈ।";
    explanation = `ਵਾਕ 1 ਸ਼ੁੱਧ ਹੈ; ਵਾਕ 2 ਵਿੱਚ ‘${wrongB}’ ਦੀ ਥਾਂ ‘${b.correct}’ ਲਿਖਿਆ ਜਾਵੇਗਾ।`;
  } else if (state >= 7) {
    const both = state - 7;
    const variantA = Math.floor(both / 3);
    const variantB = both % 3;
    const wrongA = a.incorrect[variantA]!;
    const wrongB = b.incorrect[variantB]!;
    sentenceA = sentenceA.replace(a.correct, wrongA);
    sentenceB = sentenceB.replace(b.correct, wrongB);
    correctAnswer = "ਦੋਵੇਂ ਵਾਕ ਅਸ਼ੁੱਧ ਹਨ।";
    explanation = `ਵਾਕ 1 ਵਿੱਚ ‘${wrongA}’ ਦੀ ਥਾਂ ‘${a.correct}’ ਅਤੇ ਵਾਕ 2 ਵਿੱਚ ‘${wrongB}’ ਦੀ ਥਾਂ ‘${b.correct}’ ਲਿਖਿਆ ਜਾਵੇਗਾ।`;
  }

  return assemble({
    seed,
    difficulty,
    familyId: "F07",
    subtype: "TWO_SENTENCE_SPELLING_DIAGNOSIS",
    stem: `ਦੋਵੇਂ ਵਾਕ ਪੜ੍ਹ ਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।\n\n1. ${sentenceA}\n2. ${sentenceB}`,
    correctAnswer,
    distractors: [
      "ਕੇਵਲ ਵਾਕ 1 ਸ਼ੁੱਧ ਹੈ।",
      "ਕੇਵਲ ਵਾਕ 2 ਸ਼ੁੱਧ ਹੈ।",
      "ਦੋਵੇਂ ਵਾਕ ਸ਼ੁੱਧ ਹਨ।",
      "ਦੋਵੇਂ ਵਾਕ ਅਸ਼ੁੱਧ ਹਨ।",
    ],
    explanation,
    authorityIds: [a.id, b.id],
  });
}

export function getCP002BreadthReport() {
  const categoryCounts = getCP002CategoryCounts();
  const capacities = {
    F01: CP002_ACTIVE_AUTHORITIES.length,
    F02: CP002_CONTEXT_AUTHORITIES.length * 3,
    F03: CP002_CONTEXT_AUTHORITIES.length,
    F04: choose(CP002_CONTEXT_AUTHORITIES.length, 2) * 9,
    F05: choose(CP002_ACTIVE_AUTHORITIES.length, 2) * 9,
    F06: choose(CP002_ACTIVE_AUTHORITIES.length, 4) * 12,
    F07: choose(CP002_CONTEXT_AUTHORITIES.length, 2) * 16,
  } as const;
  return {
    authorityCount: CP002_ACTIVE_AUTHORITIES.length,
    contextualAuthorityCount: CP002_CONTEXT_AUTHORITIES.length,
    categoryCount: Object.keys(categoryCounts).length,
    categoryCounts,
    capacities,
    totalSemanticCapacity: Object.values(capacities).reduce((sum, value) => sum + value, 0),
    quarantinedDonorCategory: "TATSAM_TADBHAV",
  } as const;
}

export const CP002_FAMILIES: readonly PunjabiQuestionFamilyDefinition[] = [
  { familyId: "F01", subtype: "CORRECT_FORM_RECOGNITION", name: "ਸ਼ੁੱਧ ਸ਼ਬਦ ਦੀ ਪਛਾਣ", targetDifficulties: ["Easy"], generate: generateCP002F01 },
  { familyId: "F02", subtype: "SENTENCE_ERROR_CORRECTION", name: "ਵਾਕ ਵਿੱਚ ਸ਼ਬਦ-ਜੋੜ ਸੁਧਾਰ", targetDifficulties: ["Medium"], generate: generateCP002F02 },
  { familyId: "F03", subtype: "CONTEXTUAL_COMPLETION", name: "ਸੰਦਰਭ ਅਨੁਸਾਰ ਸ਼ਬਦ-ਜੋੜ", targetDifficulties: ["Medium"], generate: generateCP002F03 },
  { familyId: "F04", subtype: "MULTI_ERROR_SENTENCE_REPAIR", name: "ਦੋਹਰਾ ਸ਼ਬਦ-ਜੋੜ ਸੁਧਾਰ", targetDifficulties: ["Hard"], generate: generateCP002F04 },
  { familyId: "F05", subtype: "TWO_WORD_PRECISION", name: "ਦੋ ਸ਼ਬਦਾਂ ਦੀ ਸ਼ੁੱਧਤਾ", targetDifficulties: ["Hard"], generate: generateCP002F05 },
  { familyId: "F06", subtype: "INCORRECT_FORM_DETECTION", name: "ਅਸ਼ੁੱਧ ਸ਼ਬਦ ਦੀ ਪਛਾਣ", targetDifficulties: ["Medium"], generate: generateCP002F06 },
  { familyId: "F07", subtype: "TWO_SENTENCE_SPELLING_DIAGNOSIS", name: "ਦੋ ਵਾਕਾਂ ਦੀ ਸ਼ਬਦ-ਜੋੜ ਜਾਂਚ", targetDifficulties: ["Hard"], generate: generateCP002F07 },
] as const;
