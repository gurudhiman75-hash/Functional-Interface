import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import {
  CP004_AGREEMENT_CONTEXTS,
  CP004_DIRECT_NUMBER_PAIRS,
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
function variant(values: readonly string[], selector: number): string {
  if (values.length === 0) throw new Error("CP004 stem variant pool is empty");
  return values[((selector % values.length) + values.length) % values.length]!;
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
      generatorRevision: "2.0.0-retrofit-exhaustive",
      fingerprint,
      lifecycle: "REVIEW_ONLY",
    },
  };
}

function requireDifficulty(actual: PunjabiDifficulty, expected: PunjabiDifficulty, familyId: string): void {
  if (actual !== expected) throw new Error(`CP004 ${familyId} supports ${expected} only`);
}

function sameDomainGenderPairs(pair: (typeof CP004_GENDER_PAIRS)[number]) {
  return CP004_GENDER_PAIRS.filter((x) => x.id !== pair.id && x.domain === pair.domain);
}

/** Direct gender distractors are attested words from the same semantic domain. */
function genderDistractors(
  pair: (typeof CP004_GENDER_PAIRS)[number],
  target: "masculine" | "feminine",
): string[] {
  const sameDomain = sameDomainGenderPairs(pair);
  if (sameDomain.length < 3) throw new Error(`CP004 ${pair.id}: insufficient same-domain gender distractors`);
  return unique(sameDomain.map((x) => x[target]));
}

function sameRuleNumberPairs(pair: (typeof CP004_NUMBER_PAIRS)[number]) {
  const sameRule = CP004_NUMBER_PAIRS.filter((x) => x.id !== pair.id && x.rule === pair.rule);
  if (sameRule.length >= 3) return sameRule;
  if (pair.rule === "IRREGULAR" || pair.rule === "VOWEL_TO_VAAN") {
    return CP004_NUMBER_PAIRS.filter((x) =>
      x.id !== pair.id && (x.rule === "IRREGULAR" || x.rule === "VOWEL_TO_VAAN"),
    );
  }
  return sameRule;
}

/** Direct number distractors are canonical forms following the same rule group. */
function numberDistractors(
  pair: (typeof CP004_NUMBER_PAIRS)[number],
  target: "singular" | "plural",
): string[] {
  const peers = sameRuleNumberPairs(pair).filter((x) => x.directSafe);
  const fallback = peers.length >= 3
    ? peers
    : CP004_DIRECT_NUMBER_PAIRS.filter((x) =>
        x.id !== pair.id && (x.rule === pair.rule || (
          (pair.rule === "IRREGULAR" || pair.rule === "VOWEL_TO_VAAN") &&
          (x.rule === "IRREGULAR" || x.rule === "VOWEL_TO_VAAN")
        )),
      );
  if (fallback.length < 3) throw new Error(`CP004 ${pair.id}: insufficient rule-neighbour number distractors`);
  return unique(fallback.map((x) => x[target]));
}

function genderMismatchCases() {
  return CP004_GENDER_PAIRS.flatMap((pair) =>
    sameDomainGenderPairs(pair).map((wrongFeminine) => ({ pair, wrongFeminine })),
  );
}

function directGenderStem(word: string, target: "ਪੁਲਿੰਗ" | "ਇਸਤਰੀ ਲਿੰਗ", selector: number): string {
  return variant([
    `‘${word}’ ਦਾ ${target} ਕਿਹੜਾ ਹੈ?`,
    `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${word}’ ਦਾ ${target} ਚੁਣੋ।`,
    `‘${word}’ ਸ਼ਬਦ ਦਾ ${target} ਕੀ ਹੈ?`,
    `‘${word}’ ਦਾ ਸਹੀ ${target} ਦੱਸੋ।`,
    `ਹੇਠ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${word}’ ਦਾ ${target} ਪਛਾਣੋ।`,
  ], selector);
}

function directNumberStem(word: string, target: "ਇਕਵਚਨ" | "ਬਹੁਵਚਨ", selector: number): string {
  return variant([
    `‘${word}’ ਦਾ ${target} ਕਿਹੜਾ ਹੈ?`,
    `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${word}’ ਦਾ ${target} ਚੁਣੋ।`,
    `‘${word}’ ਸ਼ਬਦ ਦਾ ${target} ਕੀ ਹੈ?`,
    `‘${word}’ ਦਾ ਸਹੀ ${target} ਦੱਸੋ।`,
    `ਹੇਠ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ‘${word}’ ਦਾ ${target} ਪਛਾਣੋ।`,
  ], selector);
}

export function generateCP004F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F01");
  const rank = ordinal(seed, CP004_TRANSFORM_SAFE_GENDER_PAIRS.length * 2);
  const pair = CP004_TRANSFORM_SAFE_GENDER_PAIRS[Math.floor(rank / 2)]!;
  const toFeminine = rank % 2 === 0;
  return assemble({
    seed, difficulty, familyId: "F01", subtype: "GENDER_CHANGE",
    stem: directGenderStem(pair[toFeminine ? "masculine" : "feminine"], toFeminine ? "ਇਸਤਰੀ ਲਿੰਗ" : "ਪੁਲਿੰਗ", rank),
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
  const distractors = sameDomainGenderPairs(pair).map((other) => `${pair.masculine} — ${other.feminine}`);
  const stem = variant([
    "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸਹੀ ਲਿੰਗ-ਜੋੜਾ ਚੁਣੋ।",
    "ਕਿਹੜਾ ਲਿੰਗ-ਜੋੜਾ ਸਹੀ ਹੈ?",
    "ਹੇਠ ਦਿੱਤੇ ਲਿੰਗ-ਜੋੜਿਆਂ ਵਿੱਚੋਂ ਸਹੀ ਜੋੜਾ ਪਛਾਣੋ।",
    "ਸਹੀ ਪੁਲਿੰਗ-ਇਸਤਰੀ ਲਿੰਗ ਜੋੜਾ ਚੁਣੋ।",
  ], index);
  return assemble({
    seed, difficulty, familyId: "F02", subtype: "CORRECT_GENDER_PAIR",
    stem,
    correctAnswer: `${pair.masculine} — ${pair.feminine}`,
    distractors,
    explanation: `‘${pair.masculine}’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘${pair.feminine}’ ਹੈ।`,
    authorityIds: [pair.id],
  });
}

export function generateCP004F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Medium", "F03");
  const cases = genderMismatchCases();
  const caseIndex = ordinal(seed, cases.length);
  const current = cases[caseIndex]!;
  const masculinePair = current.pair;
  const wrongFeminine = current.wrongFeminine;
  const distractors = CP004_GENDER_PAIRS
    .filter((x) => x.domain === masculinePair.domain)
    .map((x) => `${x.masculine} — ${x.feminine}`);
  const stem = variant([
    "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਗਲਤ ਲਿੰਗ-ਜੋੜਾ ਚੁਣੋ।",
    "ਕਿਹੜਾ ਲਿੰਗ-ਜੋੜਾ ਗਲਤ ਹੈ?",
    "ਹੇਠ ਦਿੱਤੇ ਜੋੜਿਆਂ ਵਿੱਚੋਂ ਗਲਤ ਪੁਲਿੰਗ-ਇਸਤਰੀ ਲਿੰਗ ਜੋੜਾ ਪਛਾਣੋ।",
    "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਲਿੰਗ-ਜੋੜਾ ਠੀਕ ਨਹੀਂ ਹੈ?",
  ], caseIndex);
  return assemble({
    seed, difficulty, familyId: "F03", subtype: "MISMATCHED_GENDER_PAIR",
    stem,
    correctAnswer: `${masculinePair.masculine} — ${wrongFeminine.feminine}`,
    distractors,
    explanation: `‘${masculinePair.masculine}’ ਦਾ ਸਹੀ ਇਸਤਰੀ ਲਿੰਗ ‘${masculinePair.feminine}’ ਹੈ।`,
    authorityIds: [masculinePair.id, wrongFeminine.id],
  });
}

export function generateCP004F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F04");
  const index = ordinal(seed, CP004_DIRECT_NUMBER_PAIRS.length);
  const pair = CP004_DIRECT_NUMBER_PAIRS[index]!;
  return assemble({
    seed, difficulty, familyId: "F04", subtype: "SINGULAR_TO_PLURAL",
    stem: directNumberStem(pair.singular, "ਬਹੁਵਚਨ", index),
    correctAnswer: pair.plural,
    distractors: numberDistractors(pair, "plural"),
    explanation: `‘${pair.singular}’ ਦਾ ਬਹੁਵਚਨ ‘${pair.plural}’ ਹੈ।`,
    authorityIds: [pair.id],
  });
}

export function generateCP004F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F05");
  const index = ordinal(seed, CP004_DIRECT_NUMBER_PAIRS.length);
  const pair = CP004_DIRECT_NUMBER_PAIRS[index]!;
  return assemble({
    seed, difficulty, familyId: "F05", subtype: "PLURAL_TO_SINGULAR",
    stem: directNumberStem(pair.plural, "ਇਕਵਚਨ", index + 2),
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
  const distractors = sameRuleNumberPairs(pair).map((other) => `${pair.singular} — ${other.plural}`);
  const stem = variant([
    "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸਹੀ ਇਕਵਚਨ-ਬਹੁਵਚਨ ਜੋੜਾ ਚੁਣੋ।",
    "ਕਿਹੜਾ ਇਕਵਚਨ-ਬਹੁਵਚਨ ਜੋੜਾ ਸਹੀ ਹੈ?",
    "ਹੇਠ ਦਿੱਤੇ ਵਚਨ-ਜੋੜਿਆਂ ਵਿੱਚੋਂ ਸਹੀ ਜੋੜਾ ਪਛਾਣੋ।",
    "ਸਹੀ ਇਕਵਚਨ ਅਤੇ ਬਹੁਵਚਨ ਵਾਲਾ ਜੋੜਾ ਚੁਣੋ।",
  ], index);
  return assemble({
    seed, difficulty, familyId: "F06", subtype: "CORRECT_NUMBER_PAIR",
    stem,
    correctAnswer: `${pair.singular} — ${pair.plural}`,
    distractors,
    explanation: `‘${pair.singular}’ ਦਾ ਬਹੁਵਚਨ ‘${pair.plural}’ ਹੈ।`,
    authorityIds: [pair.id],
  });
}

export function generateCP004F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Medium", "F07");
  const index = ordinal(seed, CP004_AGREEMENT_CONTEXTS.length);
  const context = CP004_AGREEMENT_CONTEXTS[index]!;
  const stem = variant([
    `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ${context.targetPa} ਵਾਲਾ ਸਹੀ ਵਾਕ ਚੁਣੋ।`,
    `${context.targetPa} ਦਾ ਸਹੀ ਮਿਲਾਪ ਕਿਸ ਵਾਕ ਵਿੱਚ ਹੈ?`,
    `ਕਿਹੜੇ ਵਾਕ ਵਿੱਚ ${context.targetPa} ਦਾ ਮਿਲਾਪ ਸਹੀ ਹੈ?`,
    `ਹੇਠ ਦਿੱਤੇ ਵਾਕਾਂ ਵਿੱਚੋਂ ${context.targetPa} ਅਨੁਸਾਰ ਸਹੀ ਵਾਕ ਪਛਾਣੋ।`,
  ], index);
  return assemble({
    seed, difficulty, familyId: "F07", subtype: "CONTEXTUAL_GENDER_NUMBER_USAGE",
    stem,
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
  const stem = variant([
    `ਹੇਠਲੇ ਵਾਕ ਦਾ ਸਹੀ ਰੂਪ ਚੁਣੋ:\n‘${wrong}’`,
    `ਦਿੱਤੇ ਵਾਕ ਨੂੰ ਠੀਕ ਕਰਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:\n‘${wrong}’`,
    `ਹੇਠ ਦਿੱਤੇ ਵਾਕ ਦਾ ਸਹੀ ਰੂਪ ਕਿਹੜਾ ਹੈ?\n‘${wrong}’`,
    `ਇਸ ਵਾਕ ਵਿੱਚ ਲਿੰਗ-ਵਚਨ ਦਾ ਮਿਲਾਪ ਠੀਕ ਕਰਕੇ ਸਹੀ ਰੂਪ ਚੁਣੋ:\n‘${wrong}’`,
  ], rank);
  return assemble({
    seed, difficulty, familyId: "F08", subtype: "AGREEMENT_ERROR_CORRECTION",
    stem,
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
  const instruction = variant([
    "ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।",
    "ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਠੀਕ ਵਿਕਲਪ ਚੁਣੋ।",
    "ਕਥਨਾਂ ਦੀ ਸਹੀਤਾ ਅਨੁਸਾਰ ਜਵਾਬ ਚੁਣੋ।",
  ], rank);
  return assemble({
    seed, difficulty, familyId: "F09", subtype: "STATEMENT_PAIR_CORRECTNESS",
    stem: `ਕਥਨ 1: ${firstStatement}\nਕਥਨ 2: ${secondStatement}\n\n${instruction}`,
    correctAnswer: STATEMENT_ANSWERS[correctIndex]!,
    distractors: STATEMENT_ANSWERS.filter((_, i) => i !== correctIndex),
    explanation,
    authorityIds: [first.id, second.id],
  });
}

export function getCP004BreadthReport() {
  const nGender = CP004_GENDER_PAIRS.length;
  const nContext = CP004_AGREEMENT_CONTEXTS.length;
  const f03Capacity = genderMismatchCases().length;
  const capacities = {
    F01: CP004_TRANSFORM_SAFE_GENDER_PAIRS.length * 2,
    F02: nGender,
    F03: f03Capacity,
    F04: CP004_DIRECT_NUMBER_PAIRS.length,
    F05: CP004_DIRECT_NUMBER_PAIRS.length,
    F06: CP004_NUMBER_PAIRS.length,
    F07: nContext,
    F08: nContext * 4,
    F09: nContext * (nContext - 1) * 4,
  } as const;
  return {
    genderAuthorityCount: CP004_GENDER_PAIRS.length,
    transformSafeGenderCount: CP004_TRANSFORM_SAFE_GENDER_PAIRS.length,
    numberAuthorityCount: CP004_NUMBER_PAIRS.length,
    directNumberAuthorityCount: CP004_DIRECT_NUMBER_PAIRS.length,
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
