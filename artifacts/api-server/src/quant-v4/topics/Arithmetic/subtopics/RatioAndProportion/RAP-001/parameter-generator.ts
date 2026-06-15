import distributionTargets from "./distribution-targets.library.json" assert { type: "json" };
import variableRanges from "./variable-ranges.library.json" assert { type: "json" };
import { getAnswerType, getCommonQuestionLanguageIds, getExplanationId, getQuestionEntry, getRequiredVariables, getTaskKind } from "./library";
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
} from "./types";

type VariableRangeMap = typeof variableRanges.variables;
type RangeEntry = VariableRangeMap[string];

const PERSON_NAMES = ["Aman", "Bina", "Charu", "Deepak", "Esha", "Farhan", "Gita", "Harsh"];
const GROUP_NAMES = ["class", "team", "hostel", "batch", "club", "group"];
const CONTEXT_NAMES = ["class", "hostel", "team", "society", "section"];
const SUBJECT_NAMES = ["Maths", "Science", "English", "History", "Physics", "Biology"];
const ITEM_NAMES = ["apples", "oranges", "bananas", "bags", "boxes", "packets"];
const LIQUID_NAMES = ["milk", "water", "juice", "oil", "acid", "syrup"];
const MIXTURE_TYPES = ["mixture", "solution", "blend", "alloy"];
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

function entityValue(name: string, seed: string): string {
  if (name.startsWith("person")) return pick(PERSON_NAMES, `${seed}:${name}`);
  if (name === "groupName") return pick(GROUP_NAMES, `${seed}:${name}`);
  if (name === "contextName") return pick(CONTEXT_NAMES, `${seed}:${name}`);
  if (name.startsWith("sub")) return pick(SUBJECT_NAMES, `${seed}:${name}`);
  if (name.startsWith("item")) return pick(ITEM_NAMES, `${seed}:${name}`);
  if (name.startsWith("liquid")) return pick(LIQUID_NAMES, `${seed}:${name}`);
  if (name === "mixtureType") return pick(MIXTURE_TYPES, `${seed}:${name}`);
  if (name === "varX" || name === "varY") return pick(VARIABLE_SYMBOLS, `${seed}:${name}`);
  return name;
}

function uniquePeople(count: number, seed: string) {
  const names = [...PERSON_NAMES];
  const chosen: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const pickIndex = stableBucket(`${seed}:${index}`, names.length);
    chosen.push(names.splice(pickIndex, 1)[0]!);
  }
  return chosen;
}

function buildBaseVariables(requiredVariables: readonly string[], seed: string): Rap001Variables {
  return Object.fromEntries(
    requiredVariables.map((name, index) => {
      const rangeValue = pickRangeValue(name, `${seed}:${index}:${name}`);
      if (rangeValue !== undefined) return [name, rangeValue];
      return [name, entityValue(name, `${seed}:${index}`)];
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

function constrainVariables(taskKind: Rap001TaskKind, variables: Rap001Variables, seed: string): Rap001Variables {
  const output = { ...variables };

  if (taskKind === "simpleLinkage") {
    const [a, b, c] = ratioUnits(`${seed}:simpleLinkage`, 3);
    output.ratioA1 = simplifyRatio([a, b])[0];
    output.ratioB1 = simplifyRatio([a, b])[1];
    output.ratioB2 = simplifyRatio([b, c])[0];
    output.ratioC2 = simplifyRatio([b, c])[1];
    const [personA, personB, personC] = uniquePeople(3, `${seed}:people`);
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
    const [personA, personB, personC, personD] = uniquePeople(4, `${seed}:people`);
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
    output.groupName = pick(GROUP_NAMES, `${seed}:groupName`);
    const [personA, personB] = pick([["boys", "girls"], ["cats", "dogs"], ["pens", "pencils"]], `${seed}:pair`);
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
    const [personA, personB, personC] = uniquePeople(3, `${seed}:people`);
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
    const [personA, personB, personC] = uniquePeople(3, `${seed}:people`);
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
    const [personA, personB, personC] = uniquePeople(3, `${seed}:people`);
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
    output.personA = pick(PERSON_NAMES, `${seed}:personA`);
  }

  if (taskKind === "twoStateAddition") {
    const ratioA = pickInt(1, 6, `${seed}:ratioA`);
    const ratioB = pickInt(2, 7, `${seed}:ratioB`);
    const unit = pickInt(2, 10, `${seed}:unit`);
    const addedCount = pickInt(1, 20, `${seed}:addedCount`);
    const initialA = ratioA * unit;
    const initialB = ratioB * unit;
    const finalRatio = simplifyRatio([initialA + addedCount, initialB]);
    output.contextName = pick(CONTEXT_NAMES, `${seed}:contextName`);
    output.groupA = pick(["boys", "girls", "students", "workers"], `${seed}:groupA`);
    output.groupB = pick(["girls", "boys", "teachers", "employees"], `${seed}:groupB`);
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
    const removedCount = pickInt(1, Math.max(1, Math.min(20, maxRemoved)), `${seed}:removedCount`);
    const finalRatio = simplifyRatio([ratioA * unit - removedCount, ratioB * unit]);
    output.contextName = pick(CONTEXT_NAMES, `${seed}:contextName`);
    output.groupA = pick(["boys", "girls", "players", "workers"], `${seed}:groupA`);
    output.groupB = pick(["girls", "boys", "coaches", "staff"], `${seed}:groupB`);
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
    const transferredCount = pickInt(1, 20, `${seed}:transferredCount`);
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
    output.personA = pick(PERSON_NAMES, `${seed}:personA`);
    output.personB = pick(PERSON_NAMES.filter((name) => name !== output.personA), `${seed}:personB`);
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
    const addedCount = pickInt(1, 15, `${seed}:addedCount`);
    const removedCount = pickInt(1, Math.max(1, ratioB * unit - 1), `${seed}:removedCount`);
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
    output.itemA = pick(ITEM_NAMES, `${seed}:itemA`);
    output.itemB = pick(ITEM_NAMES.filter((item) => item !== output.itemA), `${seed}:itemB`);
    output.itemC = pick(ITEM_NAMES.filter((item) => item !== output.itemA && item !== output.itemB), `${seed}:itemC`);
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
    output.sub1 = "Maths";
    output.sub2 = "Science";
    output.sub3 = "English";
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
    output.liquid1 = "milk";
    output.liquid2 = "water";
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
    output.liquid1 = "acid";
    output.liquid2 = "water";
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
    output.liquid1 = "acid";
    output.liquid2 = "water";
    output.liquid3 = "syrup";
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
    output.liquidA = "milk";
    output.liquidB = "water";
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

export function generateRap001Parameters(cpId: Rap001CanonicalProblemId, input: Rap001ParameterInput = {}): Rap001Parameters {
  const language = input.language ?? "en";
  const seed = input.seed ?? `RAP-001:${cpId}`;
  const difficultyBand = input.difficultyBand ?? chooseDifficulty(cpId, seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(cpId, language, `${seed}:ql`, difficultyBand);
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const baseVariables = buildBaseVariables(requiredVariables, seed);
  const variables = constrainVariables(taskKind, baseVariables, seed);

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
    sourceTrace: {
      questionLanguageSource: `question-language.${language}.json`,
      explanationSource: `explanation.${language}.json`,
      variableRangeSource: "variable-ranges.library.json",
    },
  };
}

export function getRap001ActiveCanonicalProblemIds() {
  return [...RAP_001_CP_IDS] as Rap001CanonicalProblemId[];
}

export function pickRap001CanonicalProblemId(seed: string) {
  return pickActiveCpId(seed);
}
