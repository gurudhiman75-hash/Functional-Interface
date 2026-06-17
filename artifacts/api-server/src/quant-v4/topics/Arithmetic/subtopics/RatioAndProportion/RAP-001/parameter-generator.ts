import distributionTargets from "./distribution-targets.library.json" assert { type: "json" };
import variableRanges from "./variable-ranges.library.json" assert { type: "json" };
import { getAnswerType, getCommonQuestionLanguageIds, getExplanationId, getQuestionEntry, getRequiredVariables, getTaskKind, RAP_001_LIBRARY_REGISTRY } from "./library";
import { gcdMany, ratioFromDecimals, ratioFromFractions, simplifyRatio, stableBucket } from "./math";
import {
  RAP_001_ARCHETYPE_ID,
  RAP_001_CP_IDS,
  type Rap001CanonicalProblemId,
  type Rap001DifficultyBand,
  type Rap001Language,
  type Rap001Parameters,
  type Rap001TaskKind,
  type Rap001Variables,
  type Rap001SemanticContext,
  type Rap001SemanticEntity,
} from "./types";

type VariableRangeMap = typeof variableRanges.variables;
type RangeEntry = VariableRangeMap[string];

const VARIABLE_SYMBOLS = ["x", "y", "z", "p", "q"];

export interface Rap001ParameterInput {
  seed?: string;
  language?: Rap001Language;
  questionLanguageId?: string;
  difficultyBand?: Rap001DifficultyBand;
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

function pickInt(minValue: number, maxValue: number, seed: string, step = 1) {
  const slots = Math.floor((maxValue - minValue) / step) + 1;
  return minValue + stableBucket(seed, slots) * step;
}

function rangeFor(name: string): RangeEntry | undefined {
  return (variableRanges.variables as Record<string, RangeEntry | undefined>)[name];
}

function pickRangeValue(name: string, seed: string) {
  const entry = rangeFor(name);
  if (!entry) return undefined;
  if ((entry as { type?: string }).type === "entity-placeholder") return undefined;
  const minValue = Number((entry as { minValue?: number }).minValue ?? 1);
  const maxValue = Number((entry as { maxValue?: number }).maxValue ?? minValue);
  const step = Number((entry as { step?: number }).step ?? 1);
  if (step >= 1) return pickInt(minValue, maxValue, seed, step);
  const slots = Math.floor((maxValue - minValue) / step) + 1;
  return Number((minValue + stableBucket(seed, slots) * step).toFixed(1));
}

function semanticDomainForVariable(name: string, scenario = "family") {
  if (name.startsWith("liquid") || name === "liquidA" || name === "liquidB" || name === "mixtureType") return "mixtures";
  if (name.startsWith("sub")) return "marks";
  if (name.startsWith("group") || name === "contextName") return scenario === "mixtures" ? "mixtures" : scenario === "family" ? "school" : scenario;
  if (name.startsWith("item")) return "coins";
  if (name.startsWith("person") || name === "targetPerson") return scenario === "family" ? "family" : "school";
  return scenario;
}

function semanticEntities(domainName: string): Rap001SemanticEntity[] {
  const domain = RAP_001_LIBRARY_REGISTRY.semantic.library.domains[domainName as keyof typeof RAP_001_LIBRARY_REGISTRY.semantic.library.domains] as
    | { entities: Rap001SemanticEntity[] }
    | undefined;
  return domain?.entities ?? [];
}

function findSemanticEntity(id: string): Rap001SemanticEntity | undefined {
  for (const domainName of Object.keys(RAP_001_LIBRARY_REGISTRY.semantic.library.domains)) {
    const found = semanticEntities(domainName).find((entity) => entity.id === id);
    if (found) return found;
  }
  return undefined;
}

function attachVariableEntities(context: Rap001SemanticContext, variables: Rap001Variables): Rap001SemanticContext {
  const entities: Record<string, Rap001SemanticEntity> = {};
  for (const [name, value] of Object.entries(variables)) {
    if (name === "targetPerson") continue;
    if (typeof value !== "string") continue;
    const entity = findSemanticEntity(value);
    if (entity) entities[name] = entity;
  }
  return { ...context, entities: Object.keys(entities).length ? entities : context.entities };
}

function entityWeight(entity: Rap001SemanticEntity) {
  const freq = RAP_001_LIBRARY_REGISTRY.semantic.frequencyModel.assignments[entity.id] ?? entity.frequency ?? "common";
  return RAP_001_LIBRARY_REGISTRY.semantic.frequencyModel.probabilities[freq as keyof typeof RAP_001_LIBRARY_REGISTRY.semantic.frequencyModel.probabilities] ?? 0.1;
}

function compatibleEntities(domainName: string, primaryId: string, exclusions: readonly string[]) {
  const candidates = semanticEntities(domainName).filter((entity) => entity.id !== primaryId && !exclusions.includes(entity.id));
  const allowed = RAP_001_LIBRARY_REGISTRY.semantic.compatibilityMap.allowed_pairings[primaryId as keyof typeof RAP_001_LIBRARY_REGISTRY.semantic.compatibilityMap.allowed_pairings];
  if (!allowed?.length) return candidates;
  const preferred = candidates.filter((entity) => (allowed as readonly string[]).includes(entity.id));
  return preferred.length ? preferred : candidates;
}

function semanticEntityValue(name: string, seed: string, scenario = "family", exclusions: readonly string[] = []): string {
  const domainName = semanticDomainForVariable(name, scenario);
  const entities = semanticEntities(domainName).filter((entity) => !exclusions.includes(entity.id));
  if (entities.length) return pickWeighted(entities, entityWeight, `${seed}:${name}:${domainName}`).id;
  if (name === "mixtureType") return "mixture";
  if (name === "varX" || name === "varY") return pick(VARIABLE_SYMBOLS, `${seed}:${name}`);
  return name;
}

function uniqueEntityIds(variableName: string, count: number, seed: string, scenario = "family") {
  const chosen: string[] = [];
  for (let index = 0; index < count; index += 1) {
    chosen.push(semanticEntityValue(variableName, `${seed}:${index}`, scenario, chosen));
  }
  return chosen;
}

function uniqueIdsForVariables(variableNames: readonly string[], seed: string, scenario = "family", initialExclusions: readonly string[] = []) {
  const exclusionsByDomain = new Map<string, string[]>();
  return variableNames.map((variableName, index) => {
    const domain = semanticDomainForVariable(variableName, scenario);
    const exclusions = exclusionsByDomain.get(domain) ?? [...initialExclusions];
    let id = semanticEntityValue(variableName, `${seed}:${variableName}:${index}`, scenario, exclusions);
    if (index > 0) {
      const last = exclusions[exclusions.length - 1];
      if (last) {
        const compatible = compatibleEntities(domain, last, exclusions);
        if (compatible.length) id = pickWeighted(compatible, entityWeight, `${seed}:${variableName}:compatible:${index}`).id;
      }
    }
    exclusions.push(id);
    exclusionsByDomain.set(domain, exclusions);
    return id;
  });
}

function buildBaseVariables(requiredVariables: readonly string[], seed: string, scenario = "family"): Rap001Variables {
  return Object.fromEntries(
    requiredVariables.map((name, index) => {
      const rangeValue = pickRangeValue(name, `${seed}:${index}:${name}`);
      if (rangeValue !== undefined) return [name, rangeValue];
      return [name, semanticEntityValue(name, `${seed}:${index}`, scenario)];
    }),
  );
}

function simplifyWithTarget(values: readonly number[], targetIndex: number) {
  const simplified = simplifyRatio(values);
  return simplified[targetIndex]!;
}

function chooseDifficulty(cpId: Rap001CanonicalProblemId, seed: string): Rap001DifficultyBand {
  const available = [...new Set(getCommonQuestionLanguageIds(cpId).map((id) => getQuestionEntry(cpId, id, "en").difficulty))];
  const weighted = (Object.entries(distributionTargets.difficultyDistribution) as [Rap001DifficultyBand, number][])
    .flatMap(([difficulty, weight]) => Array.from({ length: Math.max(1, Math.round(weight * 10)) }, () => difficulty))
    .filter((difficulty) => available.includes(difficulty));
  return pick(weighted.length ? weighted : available, `${seed}:difficulty`);
}

function pickActiveCpId(seed: string): Rap001CanonicalProblemId {
  const weighted = (Object.entries(distributionTargets.canonicalProblemDistribution) as [Rap001CanonicalProblemId, number][])
    .flatMap(([cpId, weight]) => Array.from({ length: Math.max(1, Math.round(weight * 100)) }, () => cpId))
    .filter((cpId) => RAP_001_CP_IDS.includes(cpId));
  return pick(weighted.length ? weighted : RAP_001_CP_IDS, `${seed}:cp`);
}

function selectQuestionLanguageIdForDifficulty(cpId: Rap001CanonicalProblemId, difficultyBand: Rap001DifficultyBand, seed: string) {
  const matching = getCommonQuestionLanguageIds(cpId).filter((id) => getQuestionEntry(cpId, id, "en").difficulty === difficultyBand);
  return pick(matching.length ? matching : getCommonQuestionLanguageIds(cpId), `${seed}:ql`);
}

function ratioUnits(seed: string, count: number, maxValue = 8) {
  return Array.from({ length: count }, (_value, index) => pickInt(1, maxValue, `${seed}:${index}`));
}

function constrainVariables(taskKind: Rap001TaskKind, variables: Rap001Variables, seed: string, scenario = "family"): Rap001Variables {
  const output = { ...variables };

  if (taskKind === "simpleLinkage") {
    const [a, b, c] = ratioUnits(`${seed}:simpleLinkage`, 3);
    output.ratioA1 = simplifyRatio([a, b])[0];
    output.ratioB1 = simplifyRatio([a, b])[1];
    output.ratioB2 = simplifyRatio([b, c])[0];
    output.ratioC2 = simplifyRatio([b, c])[1];
    const [personA, personB, personC] = uniqueEntityIds("personA", 3, `${seed}:people`, scenario);
    output.personA = personA;
    output.personB = personB;
    output.personC = personC;
  }

  if (taskKind === "ratioNormalization") {
    const p = pickInt(1, 3, `${seed}:p`);
    const q = pickInt(1, 3, `${seed}:q`);
    const d1 = pickInt(2, 3, `${seed}:d1`);
    const d2 = pickInt(2, 3, `${seed}:d2`);
    output.numerator1 = p * d1;
    output.denominator1 = d1;
    output.numerator2 = q * d2;
    output.denominator2 = d2;
  }

  if (taskKind === "ratioTreeLinkage") {
    const [a, b, c, d] = ratioUnits(`${seed}:tree`, 4);
    const [personA, personB, personC, personD] = uniqueEntityIds("personA", 4, `${seed}:people`, scenario);
    const ab = simplifyRatio([a, b]);
    const bc = simplifyRatio([b, c]);
    const cd = simplifyRatio([c, d]);
    output.personA = personA;
    output.personB = personB;
    output.personC = personC;
    output.personD = personD;
    output.ratioA = ab[0];
    output.ratioB = ab[1];
    output.ratioB_prime = bc[0];
    output.ratioC = bc[1];
    output.ratioC_prime = cd[0];
    output.ratioD = cd[1];
  }

  if (taskKind === "scalingByComponent") {
    const [ratioA, ratioB] = ratioUnits(`${seed}:scaling`, 2);
    const unit = pickInt(2, 20, `${seed}:unit`);
    output.ratioA = ratioA;
    output.ratioB = ratioB;
    output.valueA = ratioA * unit;
    output.groupName = semanticEntityValue("groupName", `${seed}:groupName`, scenario);
    const [personA, personB] = uniqueIdsForVariables(["personA", "personB"], `${seed}:pair`, scenario, [String(output.groupName)]);
    output.personA = personA;
    output.personB = personB;
  }

  if (taskKind === "decimalNormalization") {
    const left = pickInt(1, 30, `${seed}:left`) / 10;
    const right = pickInt(1, 30, `${seed}:right`) / 10;
    output.decimalA = Number(left.toFixed(1));
    output.decimalB = Number(right.toFixed(1));
  }

  if (taskKind === "basicPartition") {
    const [ratioA, ratioB, ratioC] = ratioUnits(`${seed}:partition`, 3);
    const sum = ratioA + ratioB + ratioC;
    const unit = pickInt(20, 200, `${seed}:unit`, 10);
    const [personA, personB, personC] = uniqueEntityIds("personA", 3, `${seed}:people`, scenario);
    output.ratioA = ratioA;
    output.ratioB = ratioB;
    output.ratioC = ratioC;
    output.totalAmount = sum * unit;
    output.personA = personA;
    output.personB = personB;
    output.personC = personC;
    output.targetPerson = pick([personA, personB, personC], `${seed}:targetPerson`);
  }

  if (taskKind === "shareDifference") {
    const ratioA = pickInt(4, 9, `${seed}:ratioA`);
    const ratioB = pickInt(2, 7, `${seed}:ratioB`);
    const ratioC = pickInt(1, ratioA - 1, `${seed}:ratioC`);
    const unit = pickInt(20, 200, `${seed}:unit`, 10);
    const [personA, personB, personC] = uniqueEntityIds("personA", 3, `${seed}:people`, scenario);
    output.ratioA = ratioA;
    output.ratioB = ratioB;
    output.ratioC = ratioC;
    output.totalAmount = (ratioA + ratioB + ratioC) * unit;
    output.personA = personA;
    output.personB = personB;
    output.personC = personC;
  }

  if (taskKind === "reversePartition") {
    const ratioA = pickInt(4, 9, `${seed}:ratioA`);
    const ratioB = pickInt(2, 7, `${seed}:ratioB`);
    const ratioC = pickInt(1, ratioA - 1, `${seed}:ratioC`);
    const unit = pickInt(20, 200, `${seed}:unit`, 10);
    const [personA, personB, personC] = uniqueEntityIds("personA", 3, `${seed}:people`, scenario);
    output.ratioA = ratioA;
    output.ratioB = ratioB;
    output.ratioC = ratioC;
    output.shareDifference = (ratioA - ratioC) * unit;
    output.personA = personA;
    output.personB = personB;
    output.personC = personC;
  }

  if (taskKind === "salaryDistribution") {
    const ratioExp = pickInt(2, 8, `${seed}:ratioExp`);
    const ratioSav = pickInt(1, 5, `${seed}:ratioSav`);
    const unit = pickInt(1000, 5000, `${seed}:unit`, 100);
    output.ratioExp = ratioExp;
    output.ratioSav = ratioSav;
    output.totalSalary = (ratioExp + ratioSav) * unit;
    output.personA = semanticEntityValue("personA", `${seed}:personA`, scenario);
  }

  if (taskKind === "twoStateAddition") {
    const ratioA = pickInt(1, 6, `${seed}:ratioA`);
    const ratioB = pickInt(2, 7, `${seed}:ratioB`);
    const unit = pickInt(2, 10, `${seed}:unit`);
    const addedCount = pickInt(2, 20, `${seed}:addedCount`);
    const initialA = ratioA * unit;
    const initialB = ratioB * unit;
    const finalRatio = simplifyRatio([initialA + addedCount, initialB]);
    output.contextName = semanticEntityValue("contextName", `${seed}:contextName`, scenario);
    [output.groupA, output.groupB] = uniqueIdsForVariables(["groupA", "groupB"], `${seed}:groups`, scenario, [String(output.contextName)]);
    output.ratioA = ratioA;
    output.ratioB = ratioB;
    output.addedCount = addedCount;
    output.finalRatioA = finalRatio[0];
    output.finalRatioB = finalRatio[1];
  }

  if (taskKind === "twoStateSubtraction") {
    const ratioA = pickInt(4, 9, `${seed}:ratioA`);
    const ratioB = pickInt(2, 7, `${seed}:ratioB`);
    const unit = pickInt(3, 12, `${seed}:unit`);
    const maxRemoved = ratioA * unit - 1;
    const removedCount = pickInt(2, Math.max(2, Math.min(20, maxRemoved)), `${seed}:removedCount`);
    const finalRatio = simplifyRatio([ratioA * unit - removedCount, ratioB * unit]);
    output.contextName = semanticEntityValue("contextName", `${seed}:contextName`, scenario);
    [output.groupA, output.groupB] = uniqueIdsForVariables(["groupA", "groupB"], `${seed}:groups`, scenario, [String(output.contextName)]);
    output.ratioA = ratioA;
    output.ratioB = ratioB;
    output.removedCount = removedCount;
    output.finalRatioA = finalRatio[0];
    output.finalRatioB = finalRatio[1];
  }

  if (taskKind === "twoStateTransfer") {
    const ratioA = pickInt(2, 8, `${seed}:ratioA`);
    const ratioB = pickInt(ratioA + 1, 10, `${seed}:ratioB`);
    const unit = pickInt(2, 10, `${seed}:unit`);
    const transferredCount = pickInt(2, 20, `${seed}:transferredCount`);
    const finalRatio = simplifyRatio([ratioA * unit + transferredCount, ratioB * unit + transferredCount]);
    output.ratioA = ratioA;
    output.ratioB = ratioB;
    output.transferredCount = transferredCount;
    output.finalRatioA = finalRatio[0];
    output.finalRatioB = finalRatio[1];
  }

  if (taskKind === "incomeExpenditureSystem") {
    const incomeRatioA = pickInt(3, 8, `${seed}:incomeRatioA`);
    const incomeRatioB = pickInt(2, incomeRatioA - 1, `${seed}:incomeRatioB`);
    const expRatioA = pickInt(1, 4, `${seed}:expRatioA`);
    const expRatioB = pickInt(expRatioA + 1, 6, `${seed}:expRatioB`);
    const pxMinusQx = incomeRatioA * expRatioB - incomeRatioB * expRatioA;
    const savingsUnit = pickInt(100, 500, `${seed}:savingsUnit`, 100);
    [output.personA, output.personB] = uniqueIdsForVariables(["personA", "personB"], `${seed}:people`, scenario);
    output.incomeRatioA = incomeRatioA;
    output.incomeRatioB = incomeRatioB;
    output.expRatioA = expRatioA;
    output.expRatioB = expRatioB;
    output.savingsAmount = pxMinusQx * savingsUnit;
  }

  if (taskKind === "multiStageTransformation") {
    const ratioA = pickInt(2, 7, `${seed}:ratioA`);
    const ratioB = pickInt(2, 7, `${seed}:ratioB`);
    const unit = pickInt(2, 10, `${seed}:unit`);
    const addedCount = pickInt(2, 15, `${seed}:addedCount`);
    const removedCount = pickInt(2, Math.max(2, ratioB * unit - 1), `${seed}:removedCount`);
    const finalRatio = simplifyRatio([ratioA * unit + addedCount, ratioB * unit - removedCount]);
    output.ratioA = ratioA;
    output.ratioB = ratioB;
    output.addedCount = addedCount;
    output.removedCount = removedCount;
    output.finalRatioA = finalRatio[0];
    output.finalRatioB = finalRatio[1];
  }

  if (taskKind === "meanProportional") {
    const left = pickInt(1, 12, `${seed}:left`);
    const right = pickInt(1, 12, `${seed}:right`);
    output.numA = left * left;
    output.numB = right * right;
  }

  if (taskKind === "thirdProportional") {
    const u = pickInt(1, 6, `${seed}:u`);
    const v = pickInt(1, 6, `${seed}:v`);
    output.numA = u * u;
    output.numB = u * v;
  }

  if (taskKind === "fourthProportional") {
    const r = pickInt(1, 6, `${seed}:r`);
    const s = pickInt(1, 6, `${seed}:s`);
    const t = pickInt(1, 10, `${seed}:t`);
    output.numA = r;
    output.numB = s;
    output.numC = r * t;
  }

  if (taskKind === "directVariation") {
    const varX1 = pickInt(1, 20, `${seed}:varX1`);
    const multiplier = pickInt(2, 10, `${seed}:multiplier`);
    const varY1 = varX1 * multiplier;
    const varX2 = pickInt(1, 20, `${seed}:varX2`);
    output.varX = "x";
    output.varY = "y";
    output.varX1 = varX1;
    output.varY1 = varY1;
    output.varX2 = varX2;
  }

  if (taskKind === "inverseVariation") {
    const varX1 = pickInt(1, 20, `${seed}:varX1`);
    const factor = pickInt(2, 12, `${seed}:factor`);
    const varY1 = factor * varX1;
    const divisors = [1, 2, 4, 5, 10].filter((value) => factor * varX1 % value === 0);
    const varX2 = pick(divisors.length ? divisors : [1], `${seed}:varX2`);
    output.varX = "x";
    output.varY = "y";
    output.varX1 = varX1;
    output.varY1 = varY1;
    output.varX2 = varX2;
  }

  if (taskKind === "coinCounting") {
    const denoms = [1, 2, 5];
    const [ratio1, ratio2, ratio3] = ratioUnits(`${seed}:coinRatios`, 3, 6);
    const unit = pickInt(1, 10, `${seed}:unit`);
    const counts = [ratio1 * unit, ratio2 * unit, ratio3 * unit];
    output.denom1 = denoms[0];
    output.denom2 = denoms[1];
    output.denom3 = denoms[2];
    output.ratio1 = ratio1;
    output.ratio2 = ratio2;
    output.ratio3 = ratio3;
    output.totalValue = counts[0] * denoms[0] + counts[1] * denoms[1] + counts[2] * denoms[2];
    output.targetDenom = pick(denoms, `${seed}:targetDenom`);
  }

  if (taskKind === "multiDenominationMapping") {
    const denoms = [1, 2, 5, 10];
    const counts = ratioUnits(`${seed}:counts`, 4, 8);
    const totalCoins = counts.reduce((sum, value) => sum + value, 0);
    const valueRatios = simplifyRatio(counts.map((count, index) => count * denoms[index]!));
    output.totalCoins = totalCoins;
    output.denom1 = denoms[0];
    output.denom2 = denoms[1];
    output.denom3 = denoms[2];
    output.denom4 = denoms[3];
    output.valRatio1 = valueRatios[0];
    output.valRatio2 = valueRatios[1];
    output.valRatio3 = valueRatios[2];
    output.valRatio4 = valueRatios[3];
    output.targetDenom = pick(denoms, `${seed}:targetDenom`);
  }

  if (taskKind === "weightedMapping") {
    const [ratioA, ratioB, ratioC] = ratioUnits(`${seed}:weights`, 3);
    const countA = pickInt(1, 5, `${seed}:countA`);
    const countB = pickInt(1, 5, `${seed}:countB`);
    const countC = pickInt(1, 5, `${seed}:countC`);
    const unit = pickInt(1, 10, `${seed}:unit`);
    [output.itemA, output.itemB, output.itemC] = uniqueIdsForVariables(["itemA", "itemB", "itemC"], `${seed}:items`, scenario);
    output.ratioA = ratioA;
    output.ratioB = ratioB;
    output.ratioC = ratioC;
    output.countA = countA;
    output.countB = countB;
    output.countC = countC;
    output.totalWeight = unit * (countA * ratioA + countB * ratioB + countC * ratioC);
  }

  if (taskKind === "weightedMarks") {
    const [ratio1, ratio2, ratio3] = ratioUnits(`${seed}:marksRatios`, 3);
    const w1 = pickInt(1, 4, `${seed}:w1`);
    const w2 = pickInt(1, 4, `${seed}:w2`);
    const w3 = pickInt(1, 4, `${seed}:w3`);
    const unit = pickInt(2, 12, `${seed}:unit`);
    [output.sub1, output.sub2, output.sub3] = uniqueIdsForVariables(["sub1", "sub2", "sub3"], `${seed}:subjects`, scenario);
    output.ratio1 = ratio1;
    output.ratio2 = ratio2;
    output.ratio3 = ratio3;
    output.w1 = w1;
    output.w2 = w2;
    output.w3 = w3;
    output.totalScore = unit * (ratio1 * w1 + ratio2 * w2 + ratio3 * w3);
  }

  if (taskKind === "binaryMixture") {
    const [ratio1, ratio2] = ratioUnits(`${seed}:binary`, 2);
    const unit = pickInt(2, 10, `${seed}:unit`);
    const addedAmount = pickInt(1, 20, `${seed}:addedAmount`);
    const finalRatio = simplifyRatio([ratio1 * unit + addedAmount, ratio2 * unit]);
    [output.liquid1, output.liquid2] = uniqueIdsForVariables(["liquid1", "liquid2"], `${seed}:liquids`, scenario);
    output.ratio1 = ratio1;
    output.ratio2 = ratio2;
    output.addedAmount = addedAmount;
    output.finalRatio1 = finalRatio[0];
    output.finalRatio2 = finalRatio[1];
  }

  if (taskKind === "mixtureComponentFinding") {
    const [ratio1, ratio2] = ratioUnits(`${seed}:mixtureFinding`, 2);
    const unit = pickInt(2, 10, `${seed}:unit`);
    const totalVolume = (ratio1 + ratio2) * unit;
    const extra = pickInt(1, 20, `${seed}:extra`);
    const initial1 = ratio1 * unit;
    const initial2 = ratio2 * unit;
    const finalRatio = simplifyRatio([initial1, initial2 + extra]);
    output.totalVolume = totalVolume;
    [output.liquid1, output.liquid2] = uniqueIdsForVariables(["liquid1", "liquid2"], `${seed}:liquids`, scenario);
    output.ratio1 = ratio1;
    output.ratio2 = ratio2;
    output.finalRatio1 = finalRatio[0];
    output.finalRatio2 = finalRatio[1];
  }

  if (taskKind === "threeComponentMixture") {
    const [ratio1, ratio2, ratio3] = ratioUnits(`${seed}:threeComponent`, 3);
    const unit = pickInt(2, 8, `${seed}:unit`);
    const addedAmount = pickInt(1, 20, `${seed}:addedAmount`);
    const finalRatio = simplifyRatio([ratio1 * unit, ratio2 * unit + addedAmount, ratio3 * unit]);
    output.mixtureType = "solution";
    [output.liquid1, output.liquid2, output.liquid3] = uniqueIdsForVariables(["liquid1", "liquid2", "liquid3"], `${seed}:liquids`, scenario);
    output.ratio1 = ratio1;
    output.ratio2 = ratio2;
    output.ratio3 = ratio3;
    output.addedAmount = addedAmount;
    output.finalRatio1 = finalRatio[0];
    output.finalRatio2 = finalRatio[1];
    output.finalRatio3 = finalRatio[2];
  }

  if (taskKind === "variableReplacementRatio") {
    const initialVolume = pickInt(50, 200, `${seed}:initialVolume`, 10);
    const removedVolume1 = pickInt(5, Math.floor(initialVolume / 3), `${seed}:removed1`, 5);
    const removedVolume2 = pickInt(5, Math.floor(initialVolume / 3), `${seed}:removed2`, 5);
    output.initialVolume = initialVolume;
    [output.liquidA, output.liquidB] = uniqueIdsForVariables(["liquidA", "liquidB"], `${seed}:liquids`, scenario);
    output.removedVolume1 = removedVolume1;
    output.removedVolume2 = removedVolume2;
  }

  if (taskKind === "acidConcentration") {
    output.acidVolume = pickInt(5, 50, `${seed}:acidVolume`, 5);
    output.waterVolume = pickInt(5, 100, `${seed}:waterVolume`, 5);
  }

  return output;
}

export function selectQuestionLanguageId(cpId: Rap001CanonicalProblemId, language: Rap001Language, seed: string, difficultyBand?: Rap001DifficultyBand) {
  const resolvedDifficulty = difficultyBand ?? chooseDifficulty(cpId, seed);
  return selectQuestionLanguageIdForDifficulty(cpId, resolvedDifficulty, `${seed}:${language}`);
}

function selectSemanticContext(cpId: Rap001CanonicalProblemId, seed: string): Rap001SemanticContext {
  const scenario = RAP_001_LIBRARY_REGISTRY.semantic.scenarioMap[cpId] || "family";
  const domain = RAP_001_LIBRARY_REGISTRY.semantic.library.domains[scenario];
  const freqModel = RAP_001_LIBRARY_REGISTRY.semantic.frequencyModel;

  const getWeight = (entity: any) => {
    const freq = freqModel.assignments[entity.id] || entity.frequency || "common";
    return freqModel.probabilities[freq] || 0.1;
  };

  const entities: Record<string, any> = {};
  const availableEntities = domain.entities;

  // Pick primary entity
  const primary = pickWeighted(availableEntities, getWeight, `${seed}:primary`);
  entities.primary = primary;

  // Pick secondary based on compatibility
  const allowed = RAP_001_LIBRARY_REGISTRY.semantic.compatibilityMap.allowed_pairings[primary.id];
  let secondaryCandidates = availableEntities.filter((e: any) => e.id !== primary.id);
  if (allowed && allowed.length > 0) {
    const preferred = secondaryCandidates.filter((e: any) => allowed.includes(e.id));
    if (preferred.length > 0) secondaryCandidates = preferred;
  }

  if (secondaryCandidates.length > 0) {
    entities.secondary = pickWeighted(secondaryCandidates, getWeight, `${seed}:secondary`);
  }

  // Pick third if needed (e.g. for three component mixtures or partition)
  const others = availableEntities.filter((e: any) => e.id !== primary.id && e.id !== entities.secondary?.id);
  if (others.length > 0) {
    entities.third = pickWeighted(others, getWeight, `${seed}:third`);
  }

  return { scenario, entities };
}

export function generateRap001Parameters(cpId: Rap001CanonicalProblemId, input: Rap001ParameterInput = {}): Rap001Parameters {
  const language = input.language ?? "en";
  const seed = input.seed ?? `RAP-001:${cpId}`;
  const difficultyBand = input.difficultyBand ?? chooseDifficulty(cpId, seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(cpId, language, `${seed}:ql`, difficultyBand);
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const semanticContext = selectSemanticContext(cpId, seed);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const baseVariables = buildBaseVariables(requiredVariables, seed, semanticContext.scenario);
  const variables = constrainVariables(taskKind, baseVariables, seed, semanticContext.scenario);
  const enrichedSemanticContext = attachVariableEntities(semanticContext, variables);

  return {
    archetypeId: RAP_001_ARCHETYPE_ID,
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
    semanticContext: enrichedSemanticContext,
    sourceTrace: {
      questionLanguageSource: `question-language.${language}.json`,
      explanationSource: `explanation.${language}.json`,
      variableRangeSource: "variable-ranges.library.json",
      semanticSource: "ratio-semantic-library.json",
    },
  };
}

export function getRap001ActiveCanonicalProblemIds() {
  return [...RAP_001_CP_IDS] as Rap001CanonicalProblemId[];
}

export function pickRap001CanonicalProblemId(seed: string) {
  return pickActiveCpId(seed);
}
