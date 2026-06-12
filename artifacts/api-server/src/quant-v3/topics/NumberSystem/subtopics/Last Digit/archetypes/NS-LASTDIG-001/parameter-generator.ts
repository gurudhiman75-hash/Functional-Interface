import { cycleForBase, cycleLengthBucket, exponentMagnitude, formatPower, formatTower, lastDigit, lastDigitOfPower } from "./math";
import { getQuestionLanguageEntries } from "./library";
import {
  NS_LASTDIG_001_ARCHETYPE_ID,
  type NsLastdig001CanonicalProblemId,
  type NsLastdig001DifficultyBand,
  type NsLastdig001Parameters,
  type NsLastdig001PowerTerm,
} from "./types";

export interface NsLastdig001ParameterInput {
  seed?: string;
  difficultyBand?: NsLastdig001DifficultyBand;
  questionLanguageId?: string;
  base?: number;
  exponent?: number;
  powerTerms?: NsLastdig001PowerTerm[];
  towerBases?: number[];
  targetLastDigit?: number;
  options?: number[];
}

export function hashSeed(seed: string) {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function stableBucket(seed: string, modulo: number) {
  return modulo <= 0 ? 0 : hashSeed(seed) % modulo;
}

export function generateNsLastdig001Parameters(cpId: NsLastdig001CanonicalProblemId, input: NsLastdig001ParameterInput = {}): NsLastdig001Parameters {
  const seed = input.seed ?? `NS-LASTDIG-001:${cpId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficulty(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQl(cpId, seed);
  const base = {
    archetypeId: NS_LASTDIG_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `NS-LASTDIG-001:${cpId}:${seed}`,
    difficultyBand,
    questionLanguageId,
    explanationId: `ES-${cpId.slice(-3)}`,
  };
  if (cpId === "CP-001") return { ...base, ...cp001(seed, difficultyBand, input) };
  if (cpId === "CP-002") return { ...base, ...cp002(seed, input) };
  if (cpId === "CP-003") return { ...base, ...cp003(seed, input) };
  if (cpId === "CP-004") return { ...base, ...cp004(seed, questionLanguageId, input) };
  return { ...base, ...cp005(seed, input) };
}

function selectDifficulty(seed: string): NsLastdig001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQl(cpId: NsLastdig001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(cpId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function cp001(seed: string, difficulty: NsLastdig001DifficultyBand, input: NsLastdig001ParameterInput) {
  const digit = stableBucket(`${seed}:digit`, 10);
  const base = input.base ?? digit + 10 * (1 + stableBucket(`${seed}:base`, difficulty === "Hard" ? 10000 : 200));
  const exponent = input.exponent ?? exponentFor(seed, difficulty);
  return {
    base,
    exponent,
    cycleLengthBucket: cycleLengthBucket(base),
    exponentMagnitude: exponentMagnitude(exponent),
  };
}

function cp002(seed: string, input: NsLastdig001ParameterInput) {
  const count = stableBucket(`${seed}:terms`, 2) === 0 ? 2 : 3;
  const same = stableBucket(`${seed}:same`, 2) === 0;
  const firstDigit = 2 + stableBucket(`${seed}:first-digit`, 8);
  const terms = input.powerTerms ?? Array.from({ length: count }, (_value, index) => {
    const digit = same ? firstDigit : (firstDigit + index * 3) % 10 || 7;
    return { base: digit + 10 * (1 + stableBucket(`${seed}:term-base:${index}`, 50)), exponent: exponentFor(`${seed}:term:${index}`, "Medium") };
  });
  return {
    powerTerms: terms,
    powerProduct: terms.map((term) => formatPower(term.base, term.exponent)).join(" x "),
    termCountBucket: count === 2 ? "twoPowers" : "threePowers",
    cycleMixBucket: same ? "sameCycleFamily" : "mixedCycles",
  };
}

function cp003(seed: string, input: NsLastdig001ParameterInput) {
  const height = 2 + stableBucket(`${seed}:height`, 3);
  const towerBases = input.towerBases ?? Array.from({ length: height }, (_value, index) => 2 + stableBucket(`${seed}:tower:${index}`, 8));
  return {
    towerBases,
    towerExpression: formatTower(towerBases),
    towerHeightBucket: height === 2 ? "smallTower" : height === 3 ? "mediumTower" : "largeTower",
    towerReductionBucket: height > 2 ? "towerReductionRequired" : "directTower",
  };
}

function cp004(seed: string, questionLanguageId: string, input: NsLastdig001ParameterInput) {
  const digitPool = [0, 1, 5, 6, 4, 9, 2, 3, 7, 8];
  const digit = digitPool[stableBucket(`${seed}:cycle-digit`, digitPool.length)];
  const base = input.base ?? digit + 10 * (1 + stableBucket(`${seed}:cycle-base`, 100));
  const cycleLength = cycleForBase(base).length;
  return {
    base,
    cycleTypeBucket: `cycle${cycleLength}`,
    questionStyleBucket: ["QL-053", "QL-055"].includes(questionLanguageId) ? "cycleRecognitionMCQ" : "cycleGeneration",
  };
}

function cp005(seed: string, input: NsLastdig001ParameterInput) {
  const base = input.base ?? 2 + stableBucket(`${seed}:missing-base`, 98);
  const cycle = cycleForBase(base);
  const answer = 1 + stableBucket(`${seed}:answer-exp`, 80);
  const targetLastDigit = input.targetLastDigit ?? lastDigitOfPower(base, answer);
  const options = input.options ?? uniqueOptions(base, targetLastDigit, answer, seed);
  return {
    base,
    targetLastDigit,
    options,
    optionCountBucket: `${options.length}Options`,
    distractorBucket: "multipleDistractors",
    cycleLengthBucket: `cycleLength${cycle.length}`,
  };
}

function exponentFor(seed: string, difficulty: NsLastdig001DifficultyBand) {
  if (difficulty === "Easy") return 2 + stableBucket(`${seed}:exp`, 19);
  if (difficulty === "Medium") return 21 + stableBucket(`${seed}:exp`, 480);
  return stableBucket(`${seed}:huge`, 2) === 0 ? 501 + stableBucket(`${seed}:exp`, 99500) : 1000000 + stableBucket(`${seed}:exp`, 999000000);
}

function uniqueOptions(base: number, target: number, answer: number, seed: string) {
  const options = new Set<number>([answer]);
  for (let attempt = 1; options.size < 4 && attempt < 200; attempt += 1) {
    const option = 1 + stableBucket(`${seed}:option:${attempt}`, 100);
    if (lastDigitOfPower(base, option) !== target) options.add(option);
  }
  return [...options].sort((a, b) => a - b);
}
