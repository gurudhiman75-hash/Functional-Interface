import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import {
  CP004_AGREEMENT_CONTEXTS,
  CP004_GENDER_PAIRS,
  CP004_NUMBER_PAIRS,
  CP004_TRANSFORM_SAFE_GENDER_PAIRS,
} from "./CP004-authorities";

function norm(value: string): string { return value.normalize("NFC").trim(); }
function ordinal(seed: number, capacity: number): number {
  if (!Number.isSafeInteger(capacity) || capacity <= 0) throw new Error(`Invalid CP004 capacity ${capacity}`);
  const value = Math.trunc(seed) - 1;
  return ((value % capacity) + capacity) % capacity;
}
function unique(values: readonly string[]): string[] {
  return [...new Set(values.map(norm).filter(Boolean))];
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
  const rng = createRng(`CP004:${input.familyId}:${input.seed}`);
  const correct = norm(input.correctAnswer);
  const distractors = unique(input.distractors).filter((x) => x !== correct);
  if (distractors.length < 3) throw new Error(`CP004 ${input.familyId}: fewer than three distinct distractors`);
  const selected = rng.pickDistinct(distractors, 3);
  const options = rng.shuffle([correct, ...selected]);
  const fingerprint = `CP004-${semanticHash([
    input.familyId,
    input.subtype,
    input.difficulty,
    norm(input.stem),
    correct,
    [...selected].sort().join("|"),
    [...input.authorityIds].sort().join(","),
  ])}`;
  return {
    id: `PUN-001-CP004-${input.familyId}-${fingerprint}`,
    stem: norm(input.stem),
    options,
    correctIndex: options.indexOf(correct),
    explanation: norm(input.explanation),
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP004",
      familyId: input.familyId,
      subtype: input.subtype,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.1.0-forward-port",
      fingerprint,
      lifecycle: "REVIEW_ONLY",
    },
  };
}

function requireDifficulty(actual: PunjabiDifficulty, expected: PunjabiDifficulty, familyId: string): void {
  if (actual !== expected) throw new Error(`CP004 ${familyId} supports ${expected} only`);
}

/**
 * Direct-form distractors must themselves be attested canonical words from the
 * CP004 authority layer. Prefer the same semantic domain/rule, then broaden.
 * This prevents fabricated pseudo-forms from appearing as easy throwaway options.
 */
function genderDistractors(
  pair: (typeof CP004_GENDER_PAIRS)[number],
  target: "masculine" | "feminine",
): string[] {
  const others = CP004_GENDER_PAIRS.filter((x) => x.id !== pair.id);
  const ordered = [
    ...others.filter((x) => x.domain === pair.domain && x.rule === pair.rule),
    ...others.filter((x) => x.domain === pair.domain && x.rule !== pair.rule),
    ...others.filter((x) => x.domain !== pair.domain && x.rule === pair.rule),
    ...others.filter((x) => x.domain !== pair.domain && x.rule !== pair.rule),
  ];
  return unique(ordered.map((x) => x[target]));
}

/**
 * Number distractors are other canonical singular/plural authorities, never an
 * oblique form or a made-up suffix variant of the same noun. That keeps the
 * direct question single-truth even where Punjabi case inflection has other
 * legitimate surface forms.
 */
function numberDistractors(
  pair: (typeof CP004_NUMBER_PAIRS)[number],
  target: "singular" | "plural",
): string[] {
  const others = CP004_NUMBER_PAIRS.filter((x) => x.id !== pair.id);
  const ordered = [
    ...others.filter((x) => x.rule === pair.rule),
    ...others.filter((x) => x.rule !== pair.rule),
  ];
  return unique(ordered.map((x) => x[target]));
}

export function generateCP004F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F01");
  const rank = ordinal(seed, CP004_TRANSFORM_SAFE_GENDER_PAIRS.length * 2);
  const pair = CP004_TRANSFORM_SAFE_GENDER_PAIRS[Math.floor(rank / 2)]!;
  const toFeminine = rank % 2 === 0;
  return assemble({
    seed, difficulty, familyId: "F01", subtype: "GENDER_CHANGE",
    stem: toFeminine
      ? `‘${pair.masculine}’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਕਿਹੜਾ ਹੈ?`
      : `‘${pair.feminine}’ ਦਾ ਪੁਲਿੰਗ ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: toFeminine ? pair.feminine : pair.masculine,
    distractors: genderDistractors(pair, toFeminine ? "feminine" : "masculine"),
    explanation: toFeminine
      ? `‘${pair.masculine}’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘${pair.feminine}’ ਹੈ।`
      : `‘${pair.feminine}’ ਦਾ ਪੁਲਿੰਗ ‘${pair.masculine}’ ਹੈ।`,
    authorityIds: [pair.id],
  });
}

export function generateCP004F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F02");
  const index = ordinal(seed, CP004_GENDER_PAIRS.length);
  const pair = CP004_GENDER_PAIRS[index]!;
  const distractors = [1, 2, 3].map((offset) => `${pair.masculine} — ${CP004_GENDER_PAIRS[(index + offset) % CP004_GENDER_PAIRS.length]!.feminine}`);
  return assemble({
    seed, difficulty, familyId: "F02", subtype: "CORRECT_GENDER_PAIR",
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸਹੀ ਲਿੰਗ-ਜੋੜਾ ਚੁਣੋ।",
    correctAnswer: `${pair.masculine} — ${pair.feminine}`,
    distractors,
    explanation: `‘${pair.masculine}’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘${pair.feminine}’ ਹੈ।`,
    authorityIds: [pair.id],
  });
}

export function generateCP004F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Medium", "F03");
  const n = CP004_GENDER_PAIRS.length;
  const rank = ordinal(seed, n * (n - 1));
  const masculineIndex = Math.floor(rank / (n - 1));
  const local = rank % (n - 1);
  const feminineIndex = local >= masculineIndex ? local + 1 : local;
  const masculinePair = CP004_GENDER_PAIRS[masculineIndex]!;
  const wrongFeminine = CP004_GENDER_PAIRS[feminineIndex]!;
  const truePairIndices = [masculineIndex, (masculineIndex + 1) % n, (masculineIndex + 2) % n];
  const distractors = truePairIndices.map((i) => `${CP004_GENDER_PAIRS[i]!.masculine} — ${CP004_GENDER_PAIRS[i]!.feminine}`);
  return assemble({
    seed, difficulty, familyId: "F03", subtype: "MISMATCHED_GENDER_PAIR",
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਗਲਤ ਲਿੰਗ-ਜੋੜਾ ਚੁਣੋ।",
    correctAnswer: `${masculinePair.masculine} — ${wrongFeminine.feminine}`,
    distractors,
    explanation: `‘${masculinePair.masculine}’ ਦਾ ਸਹੀ ਇਸਤਰੀ ਲਿੰਗ ‘${masculinePair.feminine}’ ਹੈ।`,
    authorityIds: [masculinePair.id, wrongFeminine.id],
  });
}

export function generateCP004F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F04");
  const pair = CP004_NUMBER_PAIRS[ordinal(seed, CP004_NUMBER_PAIRS.length)]!;
  return assemble({
    seed, difficulty, familyId: "F04", subtype: "SINGULAR_TO_PLURAL",
    stem: `‘${pair.singular}’ ਦਾ ਬਹੁਵਚਨ ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: pair.plural,
    distractors: numberDistractors(pair, "plural"),
    explanation: `‘${pair.singular}’ ਦਾ ਬਹੁਵਚਨ ‘${pair.plural}’ ਹੈ।`,
    authorityIds: [pair.id],
  });
}

export function generateCP004F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F05");
  const pair = CP004_NUMBER_PAIRS[ordinal(seed, CP004_NUMBER_PAIRS.length)]!;
  return assemble({
    seed, difficulty, familyId: "F05", subtype: "PLURAL_TO_SINGULAR",
    stem: `‘${pair.plural}’ ਦਾ ਇਕਵਚਨ ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: pair.singular,
    distractors: numberDistractors(pair, "singular"),
    explanation: `‘${pair.plural}’ ਦਾ ਇਕਵਚਨ ‘${pair.singular}’ ਹੈ।`,
    authorityIds: [pair.id],
  });
}

export function generateCP004F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Medium", "F06");
  const index = ordinal(seed, CP004_NUMBER_PAIRS.length);
  const pair = CP004_NUMBER_PAIRS[index]!;
  const distractors = [1, 2, 3].map((offset) => `${pair.singular} — ${CP004_NUMBER_PAIRS[(index + offset) % CP004_NUMBER_PAIRS.length]!.plural}`);
  return assemble({
    seed, difficulty, familyId: "F06", subtype: "CORRECT_NUMBER_PAIR",
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸਹੀ ਇਕਵਚਨ-ਬਹੁਵਚਨ ਜੋੜਾ ਚੁਣੋ।",
    correctAnswer: `${pair.singular} — ${pair.plural}`,
    distractors,
    explanation: `‘${pair.singular}’ ਦਾ ਬਹੁਵਚਨ ‘${pair.plural}’ ਹੈ।`,
    authorityIds: [pair.id],
  });
}

export function generateCP004F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Medium", "F07");
  const context = CP004_AGREEMENT_CONTEXTS[ordinal(seed, CP004_AGREEMENT_CONTEXTS.length)]!;
  return assemble({
    seed, difficulty, familyId: "F07", subtype: "CONTEXTUAL_GENDER_NUMBER_USAGE",
    stem: `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ${context.targetPa} ਦਾ ਸਹੀ ਮਿਲਾਪ ਵਾਲਾ ਵਾਕ ਚੁਣੋ।`,
    correctAnswer: context.correct,
    distractors: context.incorrect,
    explanation: context.principlePa,
    authorityIds: [context.id],
  });
}

export function generateCP004F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Hard", "F08");
  const rank = ordinal(seed, CP004_AGREEMENT_CONTEXTS.length * 4);
  const context = CP004_AGREEMENT_CONTEXTS[Math.floor(rank / 4)]!;
  const wrongIndex = rank % 4;
  const wrong = context.incorrect[wrongIndex]!;
  return assemble({
    seed, difficulty, familyId: "F08", subtype: "AGREEMENT_ERROR_CORRECTION",
    stem: `ਹੇਠਲੇ ਵਾਕ ਦਾ ਸਹੀ ਰੂਪ ਚੁਣੋ:\n‘${wrong}’`,
    correctAnswer: context.correct,
    distractors: context.incorrect.filter((_, i) => i !== wrongIndex),
    explanation: context.principlePa,
    authorityIds: [context.id],
  });
}

const STATEMENT_ANSWERS = [
  "ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ।",
  "ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ।",
  "ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ।",
  "ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ।",
] as const;

export function generateCP004F09(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Hard", "F09");
  const n = CP004_AGREEMENT_CONTEXTS.length;
  const rank = ordinal(seed, n * (n - 1) * 4);
  const truthMode = rank % 4;
  const pairRank = Math.floor(rank / 4);
  const firstIndex = Math.floor(pairRank / (n - 1));
  const local = pairRank % (n - 1);
  const secondIndex = local >= firstIndex ? local + 1 : local;
  const first = CP004_AGREEMENT_CONTEXTS[firstIndex]!;
  const second = CP004_AGREEMENT_CONTEXTS[secondIndex]!;
  const firstTrue = truthMode === 0 || truthMode === 1;
  const secondTrue = truthMode === 0 || truthMode === 2;
  const firstStatement = firstTrue ? first.correct : first.incorrect[ordinal(seed + firstIndex, 4)]!;
  const secondStatement = secondTrue ? second.correct : second.incorrect[ordinal(seed + secondIndex + 7, 4)]!;
  const correctIndex = truthMode === 0 ? 0 : truthMode === 1 ? 1 : truthMode === 2 ? 2 : 3;
  const explanation = firstTrue && secondTrue
    ? "ਦੋਵੇਂ ਕਥਨਾਂ ਵਿੱਚ ਲਿੰਗ ਅਤੇ ਵਚਨ ਦਾ ਮਿਲਾਪ ਸਹੀ ਹੈ।"
    : firstTrue
      ? "ਪਹਿਲੇ ਕਥਨ ਵਿੱਚ ਮਿਲਾਪ ਸਹੀ ਹੈ, ਪਰ ਦੂਜੇ ਵਿੱਚ ਲਿੰਗ ਜਾਂ ਵਚਨ ਦਾ ਮਿਲਾਪ ਗਲਤ ਹੈ।"
      : secondTrue
        ? "ਦੂਜੇ ਕਥਨ ਵਿੱਚ ਮਿਲਾਪ ਸਹੀ ਹੈ, ਪਰ ਪਹਿਲੇ ਵਿੱਚ ਲਿੰਗ ਜਾਂ ਵਚਨ ਦਾ ਮਿਲਾਪ ਗਲਤ ਹੈ।"
        : "ਦੋਵੇਂ ਕਥਨਾਂ ਵਿੱਚ ਲਿੰਗ ਜਾਂ ਵਚਨ ਦੇ ਮਿਲਾਪ ਦੀ ਗਲਤੀ ਹੈ।";
  return assemble({
    seed, difficulty, familyId: "F09", subtype: "STATEMENT_PAIR_CORRECTNESS",
    stem: `ਕਥਨ 1: ${firstStatement}\nਕਥਨ 2: ${secondStatement}\n\nਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।`,
    correctAnswer: STATEMENT_ANSWERS[correctIndex]!,
    distractors: STATEMENT_ANSWERS.filter((_, i) => i !== correctIndex),
    explanation,
    authorityIds: [first.id, second.id],
  });
}

export function getCP004BreadthReport() {
  const nGender = CP004_GENDER_PAIRS.length;
  const nContext = CP004_AGREEMENT_CONTEXTS.length;
  const capacities = {
    F01: CP004_TRANSFORM_SAFE_GENDER_PAIRS.length * 2,
    F02: nGender,
    F03: nGender * (nGender - 1),
    F04: CP004_NUMBER_PAIRS.length,
    F05: CP004_NUMBER_PAIRS.length,
    F06: CP004_NUMBER_PAIRS.length,
    F07: nContext,
    F08: nContext * 4,
    F09: nContext * (nContext - 1) * 4,
  } as const;
  return {
    genderAuthorityCount: CP004_GENDER_PAIRS.length,
    transformSafeGenderCount: CP004_TRANSFORM_SAFE_GENDER_PAIRS.length,
    numberAuthorityCount: CP004_NUMBER_PAIRS.length,
    agreementContextCount: CP004_AGREEMENT_CONTEXTS.length,
    totalAtomicAuthorities: CP004_GENDER_PAIRS.length + CP004_NUMBER_PAIRS.length + CP004_AGREEMENT_CONTEXTS.length,
    familyCount: 9,
    capacities,
    totalSemanticCapacity: Object.values(capacities).reduce((sum, value) => sum + value, 0),
  } as const;
}

export const CP004_FAMILIES: readonly PunjabiQuestionFamilyDefinition[] = [
  { familyId: "F01", subtype: "GENDER_CHANGE", name: "ਲਿੰਗ ਬਦਲੋ", targetDifficulties: ["Easy"], generate: generateCP004F01 },
  { familyId: "F02", subtype: "CORRECT_GENDER_PAIR", name: "ਸਹੀ ਲਿੰਗ-ਜੋੜਾ", targetDifficulties: ["Easy"], generate: generateCP004F02 },
  { familyId: "F03", subtype: "MISMATCHED_GENDER_PAIR", name: "ਗਲਤ ਲਿੰਗ-ਜੋੜਾ", targetDifficulties: ["Medium"], generate: generateCP004F03 },
  { familyId: "F04", subtype: "SINGULAR_TO_PLURAL", name: "ਇਕਵਚਨ ਤੋਂ ਬਹੁਵਚਨ", targetDifficulties: ["Easy"], generate: generateCP004F04 },
  { familyId: "F05", subtype: "PLURAL_TO_SINGULAR", name: "ਬਹੁਵਚਨ ਤੋਂ ਇਕਵਚਨ", targetDifficulties: ["Easy"], generate: generateCP004F05 },
  { familyId: "F06", subtype: "CORRECT_NUMBER_PAIR", name: "ਸਹੀ ਵਚਨ-ਜੋੜਾ", targetDifficulties: ["Medium"], generate: generateCP004F06 },
  { familyId: "F07", subtype: "CONTEXTUAL_GENDER_NUMBER_USAGE", name: "ਸੰਦਰਭ ਵਿੱਚ ਲਿੰਗ-ਵਚਨ", targetDifficulties: ["Medium"], generate: generateCP004F07 },
  { familyId: "F08", subtype: "AGREEMENT_ERROR_CORRECTION", name: "ਲਿੰਗ-ਵਚਨ ਗਲਤੀ ਸੁਧਾਰ", targetDifficulties: ["Hard"], generate: generateCP004F08 },
  { familyId: "F09", subtype: "STATEMENT_PAIR_CORRECTNESS", name: "ਕਥਨ-ਜੋੜਾ ਸਹੀਤਾ", targetDifficulties: ["Hard"], generate: generateCP004F09 },
];
