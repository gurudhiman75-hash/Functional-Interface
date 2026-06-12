import { baseBand, digitCountBand, digitCountOfPower, exponentBand, numberBoundaryStatus, numberMagnitude } from "./math";
import { getQuestionLanguageEntries } from "./library";
import { NS_DIGIT_001_ARCHETYPE_ID, type NsDigit001BoundType, type NsDigit001CanonicalProblemId, type NsDigit001DifficultyBand, type NsDigit001Parameters } from "./types";

export interface NsDigit001ParameterInput {
  seed?: string;
  difficultyBand?: NsDigit001DifficultyBand;
  questionLanguageId?: string;
  number?: number | string;
  base?: number;
  exponent?: number;
  factors?: number[];
  digitCount?: number;
  boundType?: NsDigit001BoundType;
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

export function generateNsDigit001Parameters(cpId: NsDigit001CanonicalProblemId, input: NsDigit001ParameterInput = {}): NsDigit001Parameters {
  const seed = input.seed ?? `NS-DIGIT-001:${cpId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficulty(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQl(cpId, seed);
  const base = {
    archetypeId: NS_DIGIT_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `NS-DIGIT-001:${cpId}:${seed}`,
    difficultyBand,
    questionLanguageId,
    explanationId: `ES-${cpId.slice(-3)}`,
  };
  if (cpId === "CP-001") return { ...base, ...cp001(seed, input) };
  if (cpId === "CP-002") return { ...base, ...cp002(seed, difficultyBand, input) };
  if (cpId === "CP-003") return { ...base, ...cp003(seed, input) };
  if (cpId === "CP-004") return { ...base, ...cp004(seed, questionLanguageId, input) };
  return { ...base, ...cp005(seed, input) };
}

function selectDifficulty(seed: string): NsDigit001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQl(cpId: NsDigit001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(cpId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function cp001(seed: string, input: NsDigit001ParameterInput) {
  const fixtures = ["7", "42", "123456", "1000000003", "1000", "999", "1001", "100000", "99999", "100001"];
  const number = input.number ?? fixtures[stableBucket(`${seed}:number`, fixtures.length)];
  return { number, numberMagnitude: numberMagnitude(number), boundaryStatus: numberBoundaryStatus(number) };
}

function cp002(seed: string, difficulty: NsDigit001DifficultyBand, input: NsDigit001ParameterInput) {
  const basePool = [2, 5, 10, 3, 7, 12, 99];
  const base = input.base ?? basePool[stableBucket(`${seed}:base`, basePool.length)];
  const exponent = input.exponent ?? (difficulty === "Easy" ? 2 + stableBucket(`${seed}:exp`, 9) : difficulty === "Medium" ? 11 + stableBucket(`${seed}:exp`, 90) : 101 + stableBucket(`${seed}:exp`, 10000));
  const boundaryStatus = base === 10 ? "boundaryFloorCase" : "nonBoundaryCase";
  return { base, exponent, baseBand: baseBand(base), exponentBand: exponentBand(exponent), boundaryStatus };
}

function cp003(seed: string, input: NsDigit001ParameterInput) {
  const count = 2 + stableBucket(`${seed}:count`, 4);
  const factors = input.factors ?? Array.from({ length: count }, (_value, index) => 2 + stableBucket(`${seed}:factor:${index}`, 997));
  return {
    factors,
    expression: factors.join(" x "),
    factorCount: count === 2 ? "twoFactors" : count === 3 ? "threeFactors" : "manyFactors",
    productMagnitude: factors.reduce((sum, factor) => sum + Math.log10(factor), 0) > 8 ? "largeProduct" : "smallProduct",
  };
}

function cp004(seed: string, questionLanguageId: string, input: NsDigit001ParameterInput) {
  const digitCount = input.digitCount ?? 1 + stableBucket(`${seed}:digits`, 40);
  const boundType = input.boundType ?? boundTypeFromQl(questionLanguageId);
  return { digitCount, boundType, digitCountBand: digitCountBand(digitCount) };
}

function cp005(seed: string, input: NsDigit001ParameterInput) {
  const basePool = [2, 5, 3, 7, 12];
  const base = input.base ?? basePool[stableBucket(`${seed}:base`, basePool.length)];
  const answer = input.exponent ?? 1 + stableBucket(`${seed}:answer`, 120);
  const digitCount = input.digitCount ?? digitCountOfPower(base, answer);
  const options = input.options ?? uniqueOptions(base, digitCount, answer, seed);
  return { base, digitCount, options, baseBand: baseBand(base), exponentBand: exponentBand(answer), uniquenessStatus: "uniqueExponentVerified" };
}

function boundTypeFromQl(questionLanguageId: string): NsDigit001BoundType {
  const largest = new Set(["QL-041", "QL-043", "QL-045", "QL-047", "QL-049", "QL-066", "QL-068", "QL-070", "QL-072", "QL-074"]);
  return largest.has(questionLanguageId) ? "largest" : "smallest";
}

function uniqueOptions(base: number, digitCount: number, answer: number, seed: string) {
  const options = new Set<number>([answer]);
  for (let attempt = 0; options.size < 4 && attempt < 400; attempt += 1) {
    const option = 1 + stableBucket(`${seed}:option:${attempt}`, 200);
    if (digitCountOfPower(base, option) !== digitCount) options.add(option);
  }
  return [...options].sort((a, b) => a - b);
}
