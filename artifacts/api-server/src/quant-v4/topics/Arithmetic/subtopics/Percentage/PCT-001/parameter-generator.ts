import variableRanges from "./variable-ranges.library.json" assert { type: "json" };
import { getAnswerType, getCommonQuestionLanguageIds, getQuestionLanguageIds, getExplanationId, getQuestionEntry, getRequiredVariables, getTaskKind, getTaskRegistryEntry, PCT_001_LIBRARY_REGISTRY } from "./library";
import { getLocalizedQuestionLanguageIds, isQlLocalized } from "../../../../../common/language-coverage";
import { stableBucket } from "./math";
import { PCT_001_ARCHETYPE_ID, PCT_001_CP_IDS, type Pct001CanonicalProblemId, type Pct001DifficultyBand, type Pct001Language, type Pct001Parameters, type Pct001TaskKind, type Pct001Variables, type Pct001SemanticContext } from "./types";

type RangeKey = keyof typeof variableRanges.variables;

export interface Pct001ParameterInput {
  seed?: string;
  language?: Pct001Language;
  questionLanguageId?: string;
  difficultyBand?: Pct001DifficultyBand;
}

function pick<T>(items: readonly T[], seed: string): T {
  return items[stableBucket(seed, items.length)]!;
}

function pickWeighted<T>(items: readonly T[], getWeight: (item: T) => number, seed: string): T {
  const weights = items.map(getWeight);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let threshold = (stableBucket(seed, 10000) / 10000) * totalWeight;
  for (let i = 0; i < items.length; i++) {
    threshold -= weights[i]!;
    if (threshold <= 0) return items[i]!;
  }
  return items[0]!;
}

function rangeValue(name: RangeKey, difficulty: Pct001DifficultyBand, seed: string) {
  const entry = variableRanges.variables[name] as Record<string, number[]>;
  const values = entry[difficulty.toLowerCase()] ?? entry.medium ?? entry.easy ?? entry.hard ?? [10];
  return pick(values, seed);
}

function variableDomain(name: string, difficulty: Pct001DifficultyBand, seed: string) {
  if (name in variableRanges.variables) return rangeValue(name as RangeKey, difficulty, seed);
  const domains: Record<string, readonly number[]> = {
    value: [120, 200, 300, 450, 600, 800, 1200, 2400, 6000],
    value1: [100, 150, 200, 250, 300, 400, 500, 600],
    rate1: [10, 15, 20, 25, 30, 40, 45, 50, 60, 80],
    rate2: [10, 15, 20, 25, 30, 40, 50, 60],
    rate3: [10, 15, 20, 25],
    newRate: [10, 20, 25, 40, 50, 60, 75],
    passRate: [30, 33, 35, 40, 50],
    marksObtained: [120, 135, 150, 180, 210, 240],
    failMargin: [5, 10, 15, 20, 25],
    marks: [120, 150, 180, 240, 300],
    totalPopulation: [1000, 2000, 5000, 8000, 12000],
    totalWeight: [40, 50, 80, 100, 120],
    totalQuantity: [50, 80, 100, 120, 150],
    waterRate: [75, 80, 85, 90],
    dryWaterRate: [10, 15, 20, 25],
  };
  return pick(domains[name] ?? [10, 20, 25, 40, 50, 100], seed);
}

function buildRequiredVariables(requiredVariables: readonly string[], difficulty: Pct001DifficultyBand, seed: string): Pct001Variables {
  return Object.fromEntries(requiredVariables.map((name) => [name, variableDomain(name, difficulty, `${seed}:${name}`)]));
}

function chooseGreaterThan(name: string, threshold: number, difficulty: Pct001DifficultyBand, seed: string) {
  const values = Array.from({ length: 80 }, (_value, index) => variableDomain(name, difficulty, `${seed}:${index}`)).filter((value) => Number(value) > threshold && Number(value) < 100);
  return Number(pick(values.length ? values : [threshold + 10], `${seed}:gt`));
}

function chooseLessThan(name: string, threshold: number, difficulty: Pct001DifficultyBand, seed: string) {
  const values = Array.from({ length: 80 }, (_value, index) => variableDomain(name, difficulty, `${seed}:${index}`)).filter((value) => Number(value) > 0 && Number(value) < threshold);
  return Number(pick(values.length ? values : [Math.max(5, threshold / 2)], `${seed}:lt`));
}

function gcd(a: number, b: number): number {
  a = Math.round(Math.abs(a) * 10000);
  b = Math.round(Math.abs(b) * 10000);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return (a || 1) / 10000;
}

function getDivisors(num: number): number[] {
  const divisors: number[] = [];
  for (let i = 1; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      divisors.push(i);
      if (num / i !== i) divisors.push(num / i);
    }
  }
  return divisors.sort((a, b) => a - b);
}

function isCountLikeTemplate(template: string) {
  return /\b(population|residents?|students?|passengers?|employees?|workers?|applicants?|voters?|items?|cartons?|boxes?|bags?|books?|accounts?|users?|inventory)\b/i.test(template);
}

function isWholeNumber(value: number) {
  return Math.abs(value - Math.round(value)) < 1e-9;
}

function chooseCompoundFriendlyInitialValue(taskKind: Pct001TaskKind, percentageRate: number, seed: string) {
  const candidatePool = [
    100, 120, 125, 150, 160, 180, 200, 240, 250, 300, 320, 400, 480, 500, 600, 625, 640,
    720, 750, 800, 900, 960, 1000, 1200, 1250, 1500, 1600, 1800, 2000, 2400, 2500, 3000,
    3125, 3200, 4000, 5000, 6250, 7500, 8000, 10000, 12000, 12500, 15000, 20000,
  ];
  const factor =
    taskKind === "compoundGrowth"
      ? ((100 + percentageRate) / 100) ** 2
      : ((100 - percentageRate) / 100) ** 2;
  const compatible = candidatePool.filter((initialValue) => isWholeNumber(initialValue * factor));
  return pick((compatible.length ? compatible : candidatePool) as readonly number[], `${seed}:compound-friendly`);
}

function choosePartBelowBase(baseValue: number, seed: string) {
  const ratePool = [10, 15, 20, 25, 30, 40, 50, 60, 75] as const;
  const candidates = ratePool
    .map((rate) => ({ rate, value: (baseValue * rate) / 100 }))
    .filter((candidate) => candidate.value > 0 && candidate.value < baseValue && isWholeNumber(candidate.value));
  return pick((candidates.length ? candidates : [{ rate: 50, value: Math.max(1, Math.floor(baseValue / 2)) }]) as readonly { rate: number; value: number }[], `${seed}:part-below-base`).value;
}

function constrainVariables(
  taskKind: Pct001TaskKind,
  variables: Pct001Variables,
  difficulty: Pct001DifficultyBand,
  seed: string,
  template = "",
): Pct001Variables {
  const output = { ...variables };
  if (taskKind === "winnerVotes") {
    const percentageRate = chooseGreaterThan("percentageRate", 50, difficulty, `${seed}:winner`);
    output.percentageRate = percentageRate;
    const totalVotes = pick([1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000], `${seed}:totVotes`);
    output.voteDifference = Math.round(totalVotes * (2 * percentageRate - 100) / 100);
  }
  if (taskKind === "cancelledVotes") {
    const rate1 = chooseLessThan("rate1", 50, difficulty, `${seed}:cancelledRate1`);
    const rate2 = chooseGreaterThan("rate2", 50, difficulty, `${seed}:cancelledRate2`);
    output.rate1 = rate1;
    output.rate2 = rate2;
    const totalVotes = pick([5000, 10000, 12000, 15000, 20000, 25000, 30000], `${seed}:totVotes`);
    output.voteDifference = Math.round(totalVotes * (1 - rate1 / 100) * (2 * rate2 - 100) / 100);
  }
  if (taskKind === "loserVotes") {
    const rate1 = chooseLessThan("rate1", 50, difficulty, `${seed}:loser`);
    output.rate1 = rate1;
    const totalVotes = pick([1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000], `${seed}:totVotes`);
    output.voteDifference = Math.round(totalVotes * (100 - 2 * rate1) / 100);
  }
  if (taskKind === "incomePartition") {
    const rate1 = chooseLessThan("rate1", 40, difficulty, `${seed}:income1`);
    const rate2 = chooseLessThan("rate2", 35, difficulty, `${seed}:income2`);
    const rate3 = chooseLessThan("rate3", 25, difficulty, `${seed}:income3`);
    output.rate1 = rate1;
    output.rate2 = rate2;
    output.rate3 = rate3;
    const totalIncome = pick([2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000, 24000, 30000], `${seed}:totIncome`);
    output.value = Math.round(totalIncome * (100 - rate1 - rate2 - rate3) / 100);
  }
  if (taskKind === "twoShareRemainder") {
    const rate1 = chooseLessThan("rate1", 45, difficulty, `${seed}:share1`);
    const rate2 = chooseLessThan("rate2", 40, difficulty, `${seed}:share2`);
    output.rate1 = rate1;
    output.rate2 = rate2;
    const totalAmount = pick([1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 16000, 20000, 24000], `${seed}:totAmount`);
    output.value = Math.round(totalAmount * (100 - rate1 - rate2) / 100);
  }
  if (taskKind === "successiveExpense") {
    const rate1 = chooseLessThan("rate1", 50, difficulty, `${seed}:expense1`);
    const rate2 = chooseLessThan("rate2", 50, difficulty, `${seed}:expense2`);
    output.rate1 = rate1;
    output.rate2 = rate2;
    const totalIncome = pick([4000, 6000, 8000, 10000, 12000, 15000, 20000, 24000, 30000, 40000], `${seed}:totIncome`);
    output.value = Math.round(totalIncome * (1 - rate1 / 100) * (1 - rate2 / 100));
  }
  if (taskKind === "reverseIncrease") {
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    output.percentageRate = percentageRate;
    const originalValue = pick([100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 10000], `${seed}:orig`);
    output.finalValue = Math.round(originalValue * (100 + percentageRate) / 100);
  }
  if (taskKind === "reverseDecrease") {
    const percentageRate = chooseLessThan("percentageRate", 80, difficulty, `${seed}:rate`);
    output.percentageRate = percentageRate;
    const originalValue = pick([100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 10000], `${seed}:orig`);
    output.finalValue = Math.round(originalValue * (100 - percentageRate) / 100);
  }
  if (taskKind === "increaseByAmount") {
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    output.percentageRate = percentageRate;
    const originalValue = pick([100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 10000], `${seed}:orig`);
    output.value = Math.round(originalValue * percentageRate / 100);
  }
  if (taskKind === "passMarks") {
    const passRate = variableDomain("passRate", difficulty, `${seed}:rate`);
    output.passRate = passRate;
    const maxMarks = pick([200, 300, 400, 500, 600, 800, 1000], `${seed}:max`);
    const passing = maxMarks * passRate / 100;
    const failMargin = pick([5, 10, 15, 20], `${seed}:fail`);
    output.failMargin = failMargin;
    output.marksObtained = Math.max(10, passing - failMargin);
  }
  if (taskKind === "partToTotal") {
    const rate1 = chooseLessThan("rate1", 80, difficulty, `${seed}:rate`);
    output.rate1 = rate1;
    const total = pick([100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000], `${seed}:total`);
    output.value = Math.round(total * (100 - rate1) / 100);
  }
  if (taskKind === "moreMarksBase") {
    const rate1 = variableDomain("rate1", difficulty, `${seed}:rate`);
    output.rate1 = rate1;
    const baseMarks = pick([100, 120, 150, 180, 200, 240, 300, 400, 500], `${seed}:base`);
    output.marks = Math.round(baseMarks * (100 + rate1) / 100);
  }
  if (taskKind === "dryFromFresh") {
    const waterRate = chooseGreaterThan("waterRate", 50, difficulty, `${seed}:fresh`);
    const dryWaterRate = chooseLessThan("dryWaterRate", Number(waterRate), difficulty, `${seed}:dry`);
    output.waterRate = waterRate;
    output.dryWaterRate = dryWaterRate;
    const solidFresh = 100 - Number(waterRate);
    const solidDry = 100 - Number(dryWaterRate);
    const denom = solidDry / gcd(solidFresh, solidDry);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    output.totalQuantity = denom * multiplier * 10;
  }
  if (taskKind === "freshFromDry") {
    const rate1 = chooseGreaterThan("rate1", 50, difficulty, `${seed}:fresh`);
    const rate2 = chooseLessThan("rate2", Number(rate1), difficulty, `${seed}:dry`);
    output.rate1 = rate1;
    output.rate2 = rate2;
    const solidFresh = 100 - Number(rate1);
    const solidDry = 100 - Number(rate2);
    const denom = solidFresh / gcd(solidDry, solidFresh);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    output.value = denom * multiplier * 10;
  }
  if (taskKind === "dilutionAddWater") {
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    const newRate = chooseLessThan("newRate", Number(percentageRate), difficulty, `${seed}:dilute`);
    output.percentageRate = percentageRate;
    output.newRate = newRate;
    const denom = newRate / gcd(percentageRate, newRate);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    output.totalMixture = denom * multiplier * 10;
  }
  if (taskKind === "addSolute" || taskKind === "addPureComponent") {
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    const newRate = chooseGreaterThan("newRate", Number(percentageRate), difficulty, `${seed}:strengthen`);
    output.percentageRate = percentageRate;
    output.newRate = newRate;
    const diff = newRate - percentageRate;
    const denom = (100 - newRate) / gcd(diff, 100 - newRate);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    output.totalMixture = denom * multiplier * 10;
  }
  if (taskKind === "evaporationOriginal") {
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    const newRate = chooseGreaterThan("newRate", Number(percentageRate), difficulty, `${seed}:strengthen`);
    output.percentageRate = percentageRate;
    output.newRate = newRate;
    const diff = newRate - percentageRate;
    const denom = diff / gcd(newRate, diff);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    output.value = denom * multiplier * 10;
  }
  if (taskKind === "dilutedPercent") {
    const totalMixture = pick([100, 200, 300, 400, 500], `${seed}:mixture`);
    const percentageRate = variableDomain("percentageRate", difficulty, `${seed}:rate`);
    output.totalMixture = totalMixture;
    output.percentageRate = percentageRate;
    const prod = totalMixture * percentageRate;
    const divs = getDivisors(prod).filter((d) => d > totalMixture && d <= totalMixture * 3);
    const div = pick(divs.length ? divs : [totalMixture * 1.5], `${seed}:div`);
    output.value = div - totalMixture;
  }
  if ((taskKind === "compoundGrowth" || taskKind === "compoundDecay") && isCountLikeTemplate(template)) {
    const percentageRate = Number(output.percentageRate ?? 0);
    if (Number.isFinite(percentageRate) && percentageRate > 0) {
      output.initialValue = chooseCompoundFriendlyInitialValue(taskKind, percentageRate, `${seed}:count-compound`);
    }
  }
  if (taskKind === "valueAsPercent") {
    const baseValue = Number(output.baseValue ?? 0);
    const partValue = Number(output.value ?? 0);
    if (Number.isFinite(baseValue) && baseValue > 0 && (!Number.isFinite(partValue) || partValue >= baseValue)) {
      output.value = choosePartBelowBase(baseValue, `${seed}:part-below-base`);
    }
  }
  return output;
}

export function getSelectableQuestionLanguageIds(cpId: Pct001CanonicalProblemId, language: Pct001Language) {
  const englishIds =
    language === "en" ? getQuestionLanguageIds(cpId, "en") : getCommonQuestionLanguageIds(cpId);
  return getLocalizedQuestionLanguageIds("PCT-001", language, englishIds);
}

export function selectQuestionLanguageId(
  cpId: Pct001CanonicalProblemId,
  language: Pct001Language,
  seed: string,
  difficultyBand?: Pct001DifficultyBand,
) {
  const ids = getSelectableQuestionLanguageIds(cpId, language);
  if (ids.length === 0) {
    throw new Error(`No localized question languages available for ${language}:${cpId} in PCT-001.`);
  }
  const filtered = difficultyBand
    ? ids.filter((questionLanguageId) => getQuestionEntry(cpId, questionLanguageId, language).difficulty === difficultyBand)
    : ids;
  const source = filtered.length > 0 ? filtered : ids;
  return source[stableBucket(seed, source.length)]!;
}

function arraysEqual(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function selectCompatibleQuestionLanguageId(
  cpId: Pct001CanonicalProblemId,
  language: Pct001Language,
  requestedQuestionLanguageId: string,
  seed: string,
) {
  if (language === "en") {
    return getQuestionLanguageIds(cpId, "en").includes(requestedQuestionLanguageId) ? requestedQuestionLanguageId : null;
  }

  if (!isQlLocalized("PCT-001", requestedQuestionLanguageId, language)) {
    return null;
  }

  const requestedRegistryEntry = getTaskRegistryEntry(cpId, requestedQuestionLanguageId);
  const requestedDifficulty = getQuestionEntry(cpId, requestedQuestionLanguageId, "en").difficulty;
  const compatibleIds = getCommonQuestionLanguageIds(cpId).filter((questionLanguageId) => {
    const sharedRegistryEntry = getTaskRegistryEntry(cpId, questionLanguageId);
    return (
      sharedRegistryEntry.taskKind === requestedRegistryEntry.taskKind &&
      sharedRegistryEntry.answerType === requestedRegistryEntry.answerType &&
      arraysEqual(sharedRegistryEntry.requiredVariables, requestedRegistryEntry.requiredVariables) &&
      getQuestionEntry(cpId, questionLanguageId, language).difficulty === requestedDifficulty
    );
  });

  if (compatibleIds.length === 0) return null;
  return compatibleIds[stableBucket(`${seed}:compatible`, compatibleIds.length)]!;
}

function selectSemanticContext(cpId: Pct001CanonicalProblemId, seed: string): Pct001SemanticContext {
  const scenario = PCT_001_LIBRARY_REGISTRY.semantic.scenarioMap[cpId] || "school";
  const domain = PCT_001_LIBRARY_REGISTRY.semantic.library.domains[scenario];
  const freqModel = PCT_001_LIBRARY_REGISTRY.semantic.frequencyModel;

  const getWeight = (entity: any) => {
    const freq = freqModel.assignments[entity.id] || entity.frequency || "common";
    return freqModel.probabilities[freq] || 0.1;
  };

  const entities: Record<string, any> = {};
  const availableEntities = domain.entities;

  // Pick primary entity
  const primary = pickWeighted(availableEntities, getWeight, `${seed}:primary`);
  entities.primary = primary;

  // Pick secondary based on compatibility if available
  const allowed = PCT_001_LIBRARY_REGISTRY.semantic.compatibilityMap.allowed_pairings[primary.id];
  if (allowed && allowed.length > 0) {
    const secondaryList = availableEntities.filter((e: any) => allowed.includes(e.id));
    if (secondaryList.length > 0) {
      entities.secondary = pickWeighted(secondaryList, getWeight, `${seed}:secondary`);
    }
  }

  // Fallback if secondary not picked or need more
  if (!entities.secondary && availableEntities.length > 1) {
    const others = availableEntities.filter((e: any) => e.id !== primary.id);
    entities.secondary = pickWeighted(others, getWeight, `${seed}:fallback_secondary`);
  }

  return { scenario, entities };
}

export function generatePct001Parameters(cpId: Pct001CanonicalProblemId, input: Pct001ParameterInput = {}): Pct001Parameters {
  const language = input.language ?? "en";
  const seed = input.seed ?? `PCT-001:${cpId}`;
  const selectableQuestionLanguageIds = getSelectableQuestionLanguageIds(cpId, language);
  if (selectableQuestionLanguageIds.length === 0) {
    throw new Error(`No localized question languages available for ${language}:${cpId} in PCT-001.`);
  }
  if (input.questionLanguageId && !isQlLocalized("PCT-001", input.questionLanguageId, language)) {
    throw new Error(`Question language ${input.questionLanguageId} is not localized for ${language} in PCT-001.`);
  }
  const questionLanguageId =
    input.questionLanguageId && selectableQuestionLanguageIds.includes(input.questionLanguageId)
      ? input.questionLanguageId
      : input.questionLanguageId
        ? (selectCompatibleQuestionLanguageId(cpId, language, input.questionLanguageId, seed) ??
          selectQuestionLanguageId(cpId, language, `${seed}:ql`, input.difficultyBand))
        : selectQuestionLanguageId(cpId, language, `${seed}:ql`, input.difficultyBand);
  const questionEntry = getQuestionEntry(cpId, questionLanguageId, language);
  const difficultyBand = questionEntry.difficulty;
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const semanticContext = selectSemanticContext(cpId, seed);
  const variables = constrainVariables(
    taskKind,
    buildRequiredVariables(requiredVariables, difficultyBand, seed),
    difficultyBand,
    seed,
    questionEntry.template,
  );

  return {
    archetypeId: PCT_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${questionLanguageId}:${stableBucket(seed, 100000)}`,
    questionLanguageId,
    explanationId: getExplanationId(cpId),
    language,
    difficultyBand,
    taskKind,
    answerType,
    requiredVariables,
    variables,
    semanticContext,
    sourceTrace: {
      questionLanguageSource: `question-language.${language}.json`,
      explanationSource: `explanation.${language}.json`,
      variableRangeSource: "variable-ranges.library.json",
      semanticSource: "percentage-semantic-library.json",
    },
  };
}

export function getPct001ActiveCanonicalProblemIds() {
  return [...PCT_001_CP_IDS] as Pct001CanonicalProblemId[];
}
