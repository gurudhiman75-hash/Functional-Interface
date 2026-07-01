import distributionTargets from "./distribution-targets.library.json" assert { type: "json" };
import variableRanges from "./variable-ranges.library.json" assert { type: "json" };
import {
  getAnswerType,
  getCommonQuestionLanguageIds,
  getExplanationId,
  getQuestionEntry,
  getRequiredVariables,
  getTaskKind,
  PCT_002_LIBRARY_REGISTRY,
} from "./library";
import { stableBucket } from "./math";
import {
  PCT_002_ARCHETYPE_ID,
  PCT_002_CP_IDS,
  type Pct002CanonicalProblemId,
  type Pct002DifficultyBand,
  type Pct002Language,
  type Pct002Parameters,
  type Pct002TaskKind,
  type Pct002Variables,
  type Pct002SemanticContext,
} from "./types";

type VariableRangeLibrary = typeof variableRanges;
type RangeKey = keyof VariableRangeLibrary["variables"];

export interface Pct002ParameterInput {
  seed?: string;
  language?: Pct002Language;
  questionLanguageId?: string;
  difficultyBand?: Pct002DifficultyBand;
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

function uniqueSorted(values: readonly number[]) {
  return [...new Set(values)].sort((left, right) => left - right);
}

function variableEntry(name: string) {
  return variableRanges.variables[name as RangeKey];
}

function allowedValues(name: string) {
  const entry = variableEntry(name);
  if (!entry) return [5, 10, 20, 25, 40, 50];
  return uniqueSorted(entry.allowedValues ?? entry.preferredValues ?? [entry.minValue, entry.maxValue]);
}

function preferredValues(name: string) {
  const entry = variableEntry(name);
  if (!entry) return allowedValues(name);
  return uniqueSorted(entry.preferredValues?.length ? entry.preferredValues : entry.allowedValues ?? [entry.minValue, entry.maxValue]);
}

function pickFromVariable(name: string, difficulty: Pct002DifficultyBand, seed: string) {
  const pool = difficulty === "Easy" ? preferredValues(name) : allowedValues(name);
  return pick(pool, `${seed}:${name}:${difficulty}`);
}

function positivePercentPool() {
  return [5, 10, 20, 25, 40, 50, 60, 75];
}

function mediumPercentPool() {
  return [10, 20, 25, 40, 50, 60];
}

function chooseDifficulty(cpId: Pct002CanonicalProblemId, seed: string): Pct002DifficultyBand {
  const target = distributionTargets.canonicalProblemDistribution?.[cpId];
  const commonIds = getCommonQuestionLanguageIds(cpId);
  const difficulties = [...new Set(commonIds.map((id) => getQuestionEntry(cpId, id, "en").difficulty))];
  if (target && difficulties.length === 1) return difficulties[0]!;
  const weighted = (Object.entries(distributionTargets.difficultyDistribution) as [Pct002DifficultyBand, number][])
    .flatMap(([difficulty, weight]) => Array.from({ length: Math.max(1, Math.round(weight * 10)) }, () => difficulty))
    .filter((difficulty) => difficulties.includes(difficulty));
  return pick(weighted.length ? weighted : difficulties, `${seed}:difficulty`);
}

function selectActiveCpId(seed: string): Pct002CanonicalProblemId {
  const weighted = (Object.entries(distributionTargets.canonicalProblemDistribution) as [Pct002CanonicalProblemId, number][])
    .flatMap(([cpId, weight]) => Array.from({ length: Math.max(1, Math.round(weight * 100)) }, () => cpId))
    .filter((cpId) => PCT_002_CP_IDS.includes(cpId));
  return pick(weighted.length ? weighted : PCT_002_CP_IDS, `${seed}:cp`);
}

function selectQuestionLanguageIdForDifficulty(cpId: Pct002CanonicalProblemId, difficultyBand: Pct002DifficultyBand, seed: string) {
  const ids = getCommonQuestionLanguageIds(cpId).filter((id) => getQuestionEntry(cpId, id, "en").difficulty === difficultyBand);
  return pick(ids.length ? ids : getCommonQuestionLanguageIds(cpId), `${seed}:ql`);
}

function buildBaseVariables(requiredVariables: readonly string[], difficulty: Pct002DifficultyBand, seed: string): Pct002Variables {
  return Object.fromEntries(requiredVariables.map((name) => [name, pickFromVariable(name, difficulty, seed)]));
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

function chooseTotalCompatibleForRate(rateSumBasis: number, seed: string) {
  const totals = [4000, 8000, 12000, 16000, 20000].filter((total) => (total * rateSumBasis) % 10000 === 0);
  return pick(totals.length ? totals : [4000, 8000, 12000], `${seed}:total`);
}

function constrainVariables(taskKind: Pct002TaskKind, variables: Pct002Variables, difficulty: Pct002DifficultyBand, seed: string): Pct002Variables {
  const output = { ...variables };
  const percentPool = difficulty === "Hard" ? positivePercentPool() : mediumPercentPool();

  if (taskKind === "inclusionExclusion") {
    const tuples: Array<[number, number, number]> = [];
    for (const a of [40, 50, 60, 75]) {
      for (const b of [40, 50, 60, 75]) {
        for (const neither of [5, 10, 15, 20, 25]) {
          const both = a + b + neither - 100;
          if (both >= 0 && both <= Math.min(a, b)) tuples.push([a, b, neither]);
        }
      }
    }
    const [groupAPercentage, groupBPercentage, neitherPercentage] = pick(tuples, `${seed}:inclusion`);
    output.groupAPercentage = groupAPercentage;
    output.groupBPercentage = groupBPercentage;
    output.neitherPercentage = neitherPercentage;
  }

  if (taskKind === "tripleInclusionExclusion") {
    const tuples: Array<[number, number, number, number, number, number, number]> = [];
    for (const a of [40, 50, 60]) {
      for (const b of [40, 50, 60]) {
        for (const c of [40, 50, 60]) {
          for (const ab of [15, 20, 25]) {
            for (const bc of [15, 20, 25]) {
              for (const ac of [15, 20, 25]) {
                for (const abc of [5, 8, 10]) {
                  const union = a + b + c - ab - bc - ac + abc;
                  if (union <= 100 && abc <= Math.min(ab, bc, ac) && ab <= Math.min(a, b) && bc <= Math.min(b, c) && ac <= Math.min(a, c)) {
                    tuples.push([a, b, c, ab, bc, ac, abc]);
                  }
                }
              }
            }
          }
        }
      }
    }
    const [a, b, c, ab, bc, ac, abc] = pick(tuples, `${seed}:tripleInclusion`);
    output.groupAPercentage = a;
    output.groupBPercentage = b;
    output.groupCPercentage = c;
    output.groupABPercentage = ab;
    output.groupBCPercentage = bc;
    output.groupACPercentage = ac;
    output.groupABCPercentage = abc;
  }

  if (taskKind === "multiTierPiecewiseRate") {
    const tier1Limit = pick([5000, 10000], `${seed}:tier1Limit`);
    const tier2Limit = tier1Limit + pick([5000, 10000], `${seed}:tier2Limit`);
    const totalBase = tier2Limit + pick([5000, 10000, 15000], `${seed}:totalBase`);
    output.tier1Limit = tier1Limit;
    output.tier2Limit = tier2Limit;
    output.totalBase = totalBase;
    output.tier1Rate = pick([5, 8], `${seed}:tier1Rate`);
    output.tier2Rate = pick([10, 12], `${seed}:tier2Rate`);
    output.tier3Rate = pick([15, 20], `${seed}:tier3Rate`);
  }

  if (taskKind === "reversePiecewiseRate") {
    const tier1Limit = pick([5000, 10000], `${seed}:tier1Limit`);
    const tier1Rate = pick([5, 8], `${seed}:tier1Rate`);
    const tier2Rate = pick([10, 12, 15], `${seed}:tier2Rate`);
    const slab1 = (tier1Limit * tier1Rate) / 100;
    const denom = tier2Rate / gcd(100, tier2Rate);
    const multiplier = pick([1, 2, 3, 4, 5], `${seed}:mult`);
    const extraResult = denom * multiplier * 50;
    const totalResult = slab1 + extraResult;
    output.tier1Limit = tier1Limit;
    output.tier1Rate = tier1Rate;
    output.tier2Rate = tier2Rate;
    output.totalResult = totalResult;
  }

  if (taskKind === "variableReplacement") {
    output.initialVolume = pick([100, 200, 500], `${seed}:initialVolume`);
    output.replacementRate1 = pick([10, 20], `${seed}:rate1`);
    output.replacementRate2 = pick([10, 20, 25], `${seed}:rate2`);
    output.replacementRate3 = pick([10, 25], `${seed}:rate3`);
  }

  if (taskKind === "fractionalError") {
    const tuples: Array<[number, number, number, number]> = [];
    const denominators = [200, 500, 1000];
    const numerators = [100, 200, 300, 400, 500];
    for (const correctDenominator of denominators) {
      for (const wrongDenominator of denominators) {
        for (const correctNumerator of numerators.filter((value) => value < correctDenominator)) {
          for (const wrongNumerator of numerators.filter((value) => value < wrongDenominator && value !== correctNumerator)) {
            const correctValue = correctNumerator / correctDenominator;
            const wrongValue = wrongNumerator / wrongDenominator;
            const error = Math.abs((wrongValue - correctValue) / correctValue) * 100;
            if (Number.isFinite(error) && error > 0 && Math.abs(error - Math.round(error)) < 1e-9) {
              tuples.push([correctNumerator, correctDenominator, wrongNumerator, wrongDenominator]);
            }
          }
        }
      }
    }
    const choice = pick(tuples, `${seed}:fractionalError`);
    output.correctNumerator = choice[0];
    output.correctDenominator = choice[1];
    output.wrongNumerator = choice[2];
    output.wrongDenominator = choice[3];
  }

  if (taskKind === "wrongMultiplier") {
    const tuples: Array<[number, number]> = [];
    for (const correctMultiplier of [100, 200, 500, 1000]) {
      for (const wrongMultiplier of [150, 250, 300, 400, 600, 750, 1200]) {
        const error = Math.abs((wrongMultiplier - correctMultiplier) / correctMultiplier) * 100;
        if (error > 0 && Math.abs(error - Math.round(error)) < 1e-9) tuples.push([correctMultiplier, wrongMultiplier]);
      }
    }
    const [correctMultiplier, wrongMultiplier] = pick(tuples, `${seed}:wrongMultiplier`);
    output.correctMultiplier = correctMultiplier;
    output.wrongMultiplier = wrongMultiplier;
  }

  if (taskKind === "wrongDivisor") {
    const tuples: Array<[number, number]> = [];
    for (const correctDivisor of [100, 200, 250, 500, 1000]) {
      for (const wrongDivisor of [50, 100, 125, 200, 250, 400, 500, 1000]) {
        if (wrongDivisor === correctDivisor) continue;
        const error = Math.abs(correctDivisor / wrongDivisor - 1) * 100;
        if (error > 0 && Math.abs(error - Math.round(error)) < 1e-9) tuples.push([correctDivisor, wrongDivisor]);
      }
    }
    const [correctDivisor, wrongDivisor] = pick(tuples, `${seed}:wrongDivisor`);
    output.correctDivisor = correctDivisor;
    output.wrongDivisor = wrongDivisor;
  }

  if (taskKind === "tieredCommission") {
    const thresholdAmount = pick([500, 1000, 2000, 5000], `${seed}:threshold`);
    const salesAmount = thresholdAmount + pick([500, 1000, 1500, 2000, 5000], `${seed}:sales`);
    output.thresholdAmount = thresholdAmount;
    output.salesAmount = salesAmount;
    output.baseCommissionRate = pick([5, 10, 15], `${seed}:baseCommissionRate`);
    output.bonusCommissionRate = pick([10, 15, 20, 25], `${seed}:bonusCommissionRate`);
  }

  if (taskKind === "tieredTax") {
    const exemptionAmount = pick([500, 1000, 2000, 5000], `${seed}:exemption`);
    const grossIncome = exemptionAmount + pick([500, 1000, 2000, 5000], `${seed}:gross`);
    output.exemptionAmount = exemptionAmount;
    output.grossIncome = grossIncome;
    output.taxPercentage = pick([5, 10, 20], `${seed}:tax`);
  }

  if (taskKind === "piecewiseRate") {
    const thresholdAmount = pick([100, 200, 500, 1000], `${seed}:piecewiseThreshold`);
    const usageAmount = thresholdAmount + pick([100, 200, 500, 1000], `${seed}:usage`);
    output.thresholdAmount = thresholdAmount;
    output.usageAmount = usageAmount;
    output.baseChargeRate = pick([5, 10, 15], `${seed}:baseRate`);
    output.extraChargeRate = pick([10, 15, 20, 25], `${seed}:extraRate`);
  }

  if (taskKind === "weightedSubgroup") {
    const tuples: Array<[number, number, number]> = [];
    for (const malePercentage of [40, 50, 60, 75]) {
      for (const maleTraitPercentage of percentPool) {
        for (const femaleTraitPercentage of percentPool) {
          const answer = malePercentage * maleTraitPercentage + (100 - malePercentage) * femaleTraitPercentage;
          if (answer % 100 === 0) tuples.push([malePercentage, maleTraitPercentage, femaleTraitPercentage]);
        }
      }
    }
    const [malePercentage, maleTraitPercentage, femaleTraitPercentage] = pick(tuples, `${seed}:weightedSubgroup`);
    output.malePercentage = malePercentage;
    output.maleTraitPercentage = maleTraitPercentage;
    output.femaleTraitPercentage = femaleTraitPercentage;
  }

  if (taskKind === "hierarchicalPopulation") {
    const tuples: Array<[number, number, number, number]> = [];
    for (const malePercentage of [40, 50, 60]) {
      for (const maleTraitPercentage of [25, 40, 50, 60]) {
        for (const femaleTraitPercentage of [20, 25, 40, 50]) {
          const basis = malePercentage * maleTraitPercentage + (100 - malePercentage) * femaleTraitPercentage;
          const totalPopulation = chooseTotalCompatibleForRate(basis, `${seed}:${malePercentage}:${maleTraitPercentage}:${femaleTraitPercentage}`);
          if ((totalPopulation * basis) % 10000 === 0) tuples.push([totalPopulation, malePercentage, maleTraitPercentage, femaleTraitPercentage]);
        }
      }
    }
    const [totalPopulation, malePercentage, maleTraitPercentage, femaleTraitPercentage] = pick(tuples, `${seed}:hierarchicalPopulation`);
    output.totalPopulation = totalPopulation;
    output.malePercentage = malePercentage;
    output.maleTraitPercentage = maleTraitPercentage;
    output.femaleTraitPercentage = femaleTraitPercentage;
  }

  if (taskKind === "branchAggregation") {
    const tuples: Array<[number, number, number]> = [];
    for (const groupAPercentage of [25, 40, 50, 60]) {
      for (const groupATraitPercentage of percentPool) {
        for (const groupBTraitPercentage of percentPool) {
          const answer = groupAPercentage * groupATraitPercentage + (100 - groupAPercentage) * groupBTraitPercentage;
          if (answer % 100 === 0) tuples.push([groupAPercentage, groupATraitPercentage, groupBTraitPercentage]);
        }
      }
    }
    const [groupAPercentage, groupATraitPercentage, groupBTraitPercentage] = pick(tuples, `${seed}:branchAggregation`);
    output.groupAPercentage = groupAPercentage;
    output.groupATraitPercentage = groupATraitPercentage;
    output.groupBTraitPercentage = groupBTraitPercentage;
  }

  if (taskKind === "repeatedReplacement" || taskKind === "iterativeDilution") {
    const tuples: Array<[number, number, number]> = [];
    const initialPool = taskKind === "iterativeDilution" ? [100] : [100, 200, 400, 500];
    const replacementPool = taskKind === "iterativeDilution" ? [10, 20, 25, 40, 50] : [10, 20, 25, 40, 50, 100];
    for (const initialVolume of initialPool) {
      for (const replacementVolume of replacementPool.filter((value) => value > 0 && value < initialVolume)) {
        for (const numberOfOperations of [2, 3, 4, 5, 6]) {
          const remainder = ((initialVolume - replacementVolume) / initialVolume) ** numberOfOperations * 100;
          if (remainder > 0) tuples.push([initialVolume, replacementVolume, numberOfOperations]);
        }
      }
    }
    const [initialVolume, replacementVolume, numberOfOperations] = pick(tuples, `${seed}:${taskKind}`);
    output.initialVolume = initialVolume;
    output.replacementVolume = replacementVolume;
    output.numberOfOperations = numberOfOperations;
  }

  if (taskKind === "electionMargin") {
    const tuples: Array<[number, number, number, number]> = [];
    for (const polledPercentage of [60, 70, 80]) {
      for (const invalidPercentage of [5, 10, 20]) {
        for (const winnerPercentage of [55, 60, 65, 70]) {
          const gapFactor = (polledPercentage / 100) * ((100 - invalidPercentage) / 100) * ((2 * winnerPercentage - 100) / 100);
          for (const totalVoters of [1000, 2000, 4000, 5000, 8000, 10000]) {
            const voteMargin = totalVoters * gapFactor;
            if (voteMargin > 0 && Math.abs(voteMargin - Math.round(voteMargin)) < 1e-9) {
              tuples.push([polledPercentage, invalidPercentage, winnerPercentage, Math.round(voteMargin)]);
            }
          }
        }
      }
    }
    const [polledPercentage, invalidPercentage, winnerPercentage, voteMargin] = pick(tuples, `${seed}:electionMargin`);
    output.polledPercentage = polledPercentage;
    output.invalidPercentage = invalidPercentage;
    output.winnerPercentage = winnerPercentage;
    output.voteMargin = voteMargin;
  }

  if (taskKind === "multiStageAttrition") {
    const tuples: Array<[number, number, number, number]> = [];
    for (const initialCount of [1000, 2000, 5000, 10000]) {
      for (const firstDropPercentage of [10, 20, 25]) {
        for (const secondDropPercentage of [10, 20, 25]) {
          for (const thirdDropPercentage of [10, 20, 25]) {
            const factors = [firstDropPercentage, secondDropPercentage, thirdDropPercentage];
            const value = factors.reduce((current, rate) => current * (100 - rate), initialCount);
            if (value % 1000000 === 0) tuples.push([initialCount, firstDropPercentage, secondDropPercentage, thirdDropPercentage]);
          }
        }
      }
    }
    const [initialCount, firstDropPercentage, secondDropPercentage, thirdDropPercentage] = pick(tuples, `${seed}:multiStageAttrition`);
    output.initialCount = initialCount;
    output.firstDropPercentage = firstDropPercentage;
    output.secondDropPercentage = secondDropPercentage;
    output.thirdDropPercentage = thirdDropPercentage;
  }

  if (taskKind === "shiftedBaseChain") {
    const tuples: Array<[number, number, number, number]> = [];
    for (const initialCount of [1000, 2000, 5000, 10000]) {
      for (const firstPassPercentage of [40, 50, 60, 75]) {
        for (const secondPassPercentage of [20, 25, 40, 50]) {
          for (const thirdPassPercentage of [10, 20, 25, 40, 50]) {
            const value = initialCount * firstPassPercentage * secondPassPercentage * thirdPassPercentage;
            if (value % 1000000 === 0) tuples.push([initialCount, firstPassPercentage, secondPassPercentage, thirdPassPercentage]);
          }
        }
      }
    }
    const [initialCount, firstPassPercentage, secondPassPercentage, thirdPassPercentage] = pick(tuples, `${seed}:shiftedBaseChain`);
    output.initialCount = initialCount;
    output.firstPassPercentage = firstPassPercentage;
    output.secondPassPercentage = secondPassPercentage;
    output.thirdPassPercentage = thirdPassPercentage;
  }

  return output;
}

export function selectQuestionLanguageId(cpId: Pct002CanonicalProblemId, language: Pct002Language, seed: string, difficultyBand?: Pct002DifficultyBand) {
  const resolvedDifficulty = difficultyBand ?? chooseDifficulty(cpId, seed);
  return selectQuestionLanguageIdForDifficulty(cpId, resolvedDifficulty, `${seed}:${language}`);
}

function selectSemanticContext(cpId: Pct002CanonicalProblemId, seed: string): Pct002SemanticContext {
  const scenario = PCT_002_LIBRARY_REGISTRY.semantic.scenarioMap[cpId] || "setOverlap";
  const domain = PCT_002_LIBRARY_REGISTRY.semantic.library.domains[scenario];
  const freqModel = PCT_002_LIBRARY_REGISTRY.semantic.frequencyModel;
  const compatibility = PCT_002_LIBRARY_REGISTRY.semantic.compatibilityMap;

  const getWeight = (entity: any) => {
    const freq = freqModel.assignments[entity.id] || entity.frequency || "common";
    return freqModel.probabilities[freq] || 0.1;
  };

  const entities: Record<string, any> = {};
  const availableEntities = domain.entities;

  // Pick primary entity
  const primary = pickWeighted(availableEntities, getWeight, `${seed}:primary`);
  entities.primary = primary;

  // For mixtures, enforce allowed/forbidden pairings
  if (scenario === "mixtures") {
    const allowed = compatibility.allowed_mixtures[primary.id];
    const forbidden = compatibility.forbidden_mixtures[primary.id] || [];
    
    let secondaryCandidates = availableEntities.filter((e: any) => {
      const reverseForbidden = compatibility.forbidden_mixtures[e.id] || [];
      return e.id !== primary.id && !forbidden.includes(e.id) && !reverseForbidden.includes(primary.id);
    });
    if (allowed && allowed.length > 0) {
      const preferred = secondaryCandidates.filter((e: any) => allowed.includes(e.id));
      if (preferred.length > 0) secondaryCandidates = preferred;
    }
    
    if (secondaryCandidates.length > 0) {
      entities.secondary = pickWeighted(secondaryCandidates, getWeight, `${seed}:secondary`);
    }
  } else {
    // Standard pick
    const others = availableEntities.filter((e: any) => e.id !== primary.id);
    if (others.length > 0) {
      entities.secondary = pickWeighted(others, getWeight, `${seed}:secondary`);
    }
  }

  return { scenario, entities };
}

export function generatePct002Parameters(cpId: Pct002CanonicalProblemId, input: Pct002ParameterInput = {}): Pct002Parameters {
  const language = input.language ?? "en";
  const seed = input.seed ?? `PCT-002:${cpId}`;
  const difficultyBand = input.difficultyBand ?? chooseDifficulty(cpId, seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(cpId, language, `${seed}:ql`, difficultyBand);
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const baseVariables = buildBaseVariables(requiredVariables, difficultyBand, seed);
  const semanticContext = selectSemanticContext(cpId, seed);
  const variables = constrainVariables(taskKind, baseVariables, difficultyBand, seed);

  return {
    archetypeId: PCT_002_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${questionLanguageId}:${stableBucket(seed, 100000)}`,
    questionLanguageId,
    explanationId: getExplanationId(cpId, language),
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
      semanticSource: "advanced-percentage-semantic-library.json",
    },
  };
}

export function getPct002ActiveCanonicalProblemIds() {
  return [...PCT_002_CP_IDS] as Pct002CanonicalProblemId[];
}

export function pickPct002CanonicalProblemId(seed: string) {
  return selectActiveCpId(seed);
}
