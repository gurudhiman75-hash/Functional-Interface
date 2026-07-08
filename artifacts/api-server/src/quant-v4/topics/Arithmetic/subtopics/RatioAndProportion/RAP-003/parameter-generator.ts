import { pick, stableBucket } from "./math";
import { getRap003QuestionLanguageIds, getRap003RegistryEntry } from "./library";
import {
  RAP_003_ARCHETYPE_ID,
  type Rap003CanonicalProblemId,
  type Rap003DifficultyBand,
  type Rap003ParameterInput,
  type Rap003Parameters,
  type Rap003Variables,
} from "./types";

const AGE_CASES = {
  future: [
    { personA: "father", personB: "son", ratioA: 5, ratioB: 2, shiftYears: 10, futureRatioA: 2, futureRatioB: 1 },
    { personA: "mother", personB: "daughter", ratioA: 7, ratioB: 3, shiftYears: 5, futureRatioA: 2, futureRatioB: 1 },
    { personA: "A", personB: "B", ratioA: 4, ratioB: 3, shiftYears: 6, futureRatioA: 6, futureRatioB: 5 },
    { personA: "elder brother", personB: "younger brother", ratioA: 9, ratioB: 5, shiftYears: 8, futureRatioA: 13, futureRatioB: 9 },
  ],
  past: [
    { personA: "father", personB: "son", ratioA: 7, ratioB: 3, shiftYears: 6, pastRatioA: 5, pastRatioB: 1 },
    { personA: "mother", personB: "daughter", ratioA: 5, ratioB: 2, shiftYears: 4, pastRatioA: 7, pastRatioB: 2 },
    { personA: "A", personB: "B", ratioA: 9, ratioB: 7, shiftYears: 5, pastRatioA: 2, pastRatioB: 1 },
  ],
  years: [
    { personA: "A", personB: "B", presentAgeA: 30, presentAgeB: 18, futureRatioA: 7, futureRatioB: 5 },
    { personA: "father", personB: "son", presentAgeA: 40, presentAgeB: 16, futureRatioA: 2, futureRatioB: 1 },
    { personA: "mother", personB: "daughter", presentAgeA: 42, presentAgeB: 18, futureRatioA: 5, futureRatioB: 3 },
    { personA: "elder brother", personB: "younger brother", presentAgeA: 27, presentAgeB: 15, futureRatioA: 3, futureRatioB: 2 },
  ],
  difference: [
    { personA: "father", personB: "son", ratioA: 5, ratioB: 2, ageDifference: 30 },
    { personA: "mother", personB: "daughter", ratioA: 7, ratioB: 3, ageDifference: 24 },
    { personA: "A", personB: "B", ratioA: 9, ratioB: 5, ageDifference: 20 },
  ],
} as const;

const PARTNERSHIP_CASES = {
  standard: [
    { personA: "Aman", personB: "Bhavna", investmentA: 40000, investmentB: 60000, timeA: 12, timeB: 12, totalProfit: 15000 },
    { personA: "Ravi", personB: "Sunita", investmentA: 30000, investmentB: 45000, timeA: 10, timeB: 10, totalProfit: 25000 },
    { personA: "Partner A", personB: "Partner B", investmentA: 50000, investmentB: 75000, timeA: 8, timeB: 8, totalProfit: 20000 },
  ],
  joining: [
    { personA: "Aman", personB: "Bhavna", investmentA: 50000, investmentB: 70000, timeA: 12, timeB: 8, totalProfit: 29000 },
    { personA: "Ravi", personB: "Sunita", investmentA: 60000, investmentB: 90000, timeA: 12, timeB: 6, totalProfit: 28000 },
    { personA: "Partner A", personB: "Partner B", investmentA: 40000, investmentB: 60000, timeA: 12, timeB: 9, totalProfit: 23000 },
  ],
  midChange: [
    { personA: "Aman", personB: "Bhavna", initialInvestmentA: 30000, changedInvestmentA: 20000, investmentB: 40000, firstPeriod: 6, secondPeriod: 6, timeB: 12, totalProfit: 26000 },
    { personA: "Ravi", personB: "Sunita", initialInvestmentA: 50000, changedInvestmentA: 70000, investmentB: 60000, firstPeriod: 4, secondPeriod: 8, timeB: 12, totalProfit: 42000 },
    { personA: "Partner A", personB: "Partner B", initialInvestmentA: 80000, changedInvestmentA: 50000, investmentB: 70000, firstPeriod: 5, secondPeriod: 7, timeB: 12, totalProfit: 37500 },
  ],
} as const;

const INCOME_EXPENDITURE_CASES = {
  savingsRatio: [
    { personA: "Aman", personB: "Bhavna", incomeRatioA: 5, incomeRatioB: 4, expenditureRatioA: 3, expenditureRatioB: 2, incomeUnit: 6000, expenditureUnit: 7000 },
    { personA: "Ravi", personB: "Sunita", incomeRatioA: 7, incomeRatioB: 5, expenditureRatioA: 4, expenditureRatioB: 3, incomeUnit: 5000, expenditureUnit: 6000 },
    { personA: "Person A", personB: "Person B", incomeRatioA: 9, incomeRatioB: 8, expenditureRatioA: 5, expenditureRatioB: 4, incomeUnit: 4000, expenditureUnit: 7000 },
  ],
  equalSavings: [
    { personA: "Aman", personB: "Bhavna", incomeRatioA: 3, incomeRatioB: 4, expenditureRatioA: 2, expenditureRatioB: 3, givenIncomeA: 30000 },
    { personA: "Ravi", personB: "Sunita", incomeRatioA: 5, incomeRatioB: 6, expenditureRatioA: 3, expenditureRatioB: 4, givenIncomeA: 50000 },
    { personA: "Person A", personB: "Person B", incomeRatioA: 7, incomeRatioB: 9, expenditureRatioA: 4, expenditureRatioB: 6, givenIncomeA: 42000 },
  ],
  savingsConstraint: [
    { personA: "Aman", personB: "Bhavna", incomeRatioA: 5, incomeRatioB: 7, expenditureRatioA: 3, expenditureRatioB: 4, savingsRatioA: 2, savingsRatioB: 3, givenExpenditureB: 20000, givenIncomeA: 25000 },
    { personA: "Ravi", personB: "Sunita", incomeRatioA: 4, incomeRatioB: 5, expenditureRatioA: 2, expenditureRatioB: 3, savingsRatioA: 2, savingsRatioB: 2, givenExpenditureB: 18000, givenIncomeA: 24000 },
    { personA: "Person A", personB: "Person B", incomeRatioA: 7, incomeRatioB: 8, expenditureRatioA: 4, expenditureRatioB: 5, savingsRatioA: 3, savingsRatioB: 3, givenExpenditureB: 25000, givenIncomeA: 35000 },
  ],
} as const;

const ALLOY_CASES = {
  mixingRatio: [
    { mixtureA: "Alloy A", mixtureB: "Alloy B", component: "gold", percentA: 40, percentB: 20, targetPercent: 30 },
    { mixtureA: "Solution A", mixtureB: "Solution B", component: "acid", percentA: 70, percentB: 40, targetPercent: 50 },
    { mixtureA: "Milk mixture A", mixtureB: "Milk mixture B", component: "milk", percentA: 80, percentB: 50, targetPercent: 60 },
  ],
  targetPercent: [
    { mixtureA: "Alloy A", mixtureB: "Alloy B", component: "gold", percentA: 40, percentB: 20, quantityA: 30, quantityB: 20 },
    { mixtureA: "Solution A", mixtureB: "Solution B", component: "acid", percentA: 60, percentB: 30, quantityA: 20, quantityB: 40 },
    { mixtureA: "Milk mixture A", mixtureB: "Milk mixture B", component: "milk", percentA: 75, percentB: 50, quantityA: 24, quantityB: 36 },
  ],
  threeSource: [
    { mixtureA: "Alloy A", mixtureB: "Alloy B", mixtureC: "Alloy C", component: "gold", ratioAComponent: 2, ratioAOther: 3, ratioBComponent: 3, ratioBOther: 7, ratioCComponent: 1, ratioCOther: 4 },
    { mixtureA: "Solution A", mixtureB: "Solution B", mixtureC: "Solution C", component: "acid", ratioAComponent: 1, ratioAOther: 1, ratioBComponent: 2, ratioBOther: 3, ratioCComponent: 3, ratioCOther: 7 },
    { mixtureA: "Milk mix A", mixtureB: "Milk mix B", mixtureC: "Milk mix C", component: "milk", ratioAComponent: 3, ratioAOther: 2, ratioBComponent: 4, ratioBOther: 1, ratioCComponent: 1, ratioCOther: 1 },
  ],
} as const;

const REPLACEMENT_CASES = {
  forward: [
    { vesselName: "A vessel", liquidA: "milk", liquidB: "water", initialVolume: 40, removedVolume: 4, replacementCount: 2 },
    { vesselName: "A container", liquidA: "wine", liquidB: "water", initialVolume: 80, removedVolume: 8, replacementCount: 3 },
    { vesselName: "A tank", liquidA: "acid", liquidB: "water", initialVolume: 50, removedVolume: 10, replacementCount: 2 },
  ],
  quantity: [
    { vesselName: "A vessel", liquidA: "milk", liquidB: "water", initialVolume: 50, removedVolume: 5, replacementCount: 2 },
    { vesselName: "A container", liquidA: "wine", liquidB: "water", initialVolume: 80, removedVolume: 8, replacementCount: 3 },
    { vesselName: "A tank", liquidA: "solution", liquidB: "water", initialVolume: 100, removedVolume: 20, replacementCount: 2 },
  ],
  reverse: [
    { vesselName: "A vessel", liquidA: "milk", liquidB: "water", initialVolume: 40, removedVolume: 4, finalRatioA: 81, finalRatioB: 19 },
    { vesselName: "A container", liquidA: "wine", liquidB: "water", initialVolume: 80, removedVolume: 8, finalRatioA: 729, finalRatioB: 271 },
    { vesselName: "A tank", liquidA: "acid", liquidB: "water", initialVolume: 50, removedVolume: 10, finalRatioA: 16, finalRatioB: 9 },
  ],
} as const;

const DENOMINATION_CASES = {
  value: [
    { itemName: "coins", denominationA: 1, denominationB: 2, denominationC: 5, ratioA: 3, ratioB: 4, ratioC: 5, commonUnit: 10 },
    { itemName: "notes", denominationA: 10, denominationB: 20, denominationC: 50, ratioA: 5, ratioB: 3, ratioC: 2, commonUnit: 8 },
    { itemName: "stamps", denominationA: 2, denominationB: 5, denominationC: 10, ratioA: 4, ratioB: 5, ratioC: 3, commonUnit: 6 },
  ],
  total: [
    { itemName: "coins", denominationA: 1, denominationB: 2, denominationC: 5, ratioA: 3, ratioB: 4, ratioC: 5, totalValue: 360 },
    { itemName: "notes", denominationA: 10, denominationB: 20, denominationC: 50, ratioA: 5, ratioB: 3, ratioC: 2, totalValue: 1680 },
    { itemName: "stamps", denominationA: 2, denominationB: 5, denominationC: 10, ratioA: 4, ratioB: 5, ratioC: 3, totalValue: 378 },
  ],
  swap: [
    { itemName: "coins", denominationA: 1, denominationB: 2, denominationC: 5, ratioA: 3, ratioB: 4, ratioC: 5, commonUnit: 10, fromDenomination: 1, toDenomination: 5, swapCount: 6 },
    { itemName: "notes", denominationA: 10, denominationB: 20, denominationC: 50, ratioA: 5, ratioB: 3, ratioC: 2, commonUnit: 8, fromDenomination: 20, toDenomination: 50, swapCount: 5 },
    { itemName: "stamps", denominationA: 2, denominationB: 5, denominationC: 10, ratioA: 4, ratioB: 5, ratioC: 3, commonUnit: 6, fromDenomination: 2, toDenomination: 10, swapCount: 4 },
  ],
  fourValue: [
    { itemName: "notes", denominationA: 5, denominationB: 10, denominationC: 20, denominationD: 50, ratioA: 2, ratioB: 3, ratioC: 4, ratioD: 1, commonUnit: 6 },
    { itemName: "coupons", denominationA: 2, denominationB: 5, denominationC: 10, denominationD: 20, ratioA: 5, ratioB: 4, ratioC: 3, ratioD: 2, commonUnit: 7 },
  ],
  fourTotal: [
    { itemName: "notes", denominationA: 5, denominationB: 10, denominationC: 20, denominationD: 50, ratioA: 2, ratioB: 3, ratioC: 4, ratioD: 1, totalValue: 1020 },
    { itemName: "coupons", denominationA: 2, denominationB: 5, denominationC: 10, denominationD: 20, ratioA: 5, ratioB: 4, ratioC: 3, ratioD: 2, totalValue: 700 },
  ],
} as const;

const SDT_CASES = {
  timeRatio: [
    { objectA: "Train A", objectB: "Train B", speedRatioA: 3, speedRatioB: 4, distanceRatioA: 2, distanceRatioB: 3 },
    { objectA: "Runner A", objectB: "Runner B", speedRatioA: 5, speedRatioB: 6, distanceRatioA: 4, distanceRatioB: 5 },
    { objectA: "Car A", objectB: "Car B", speedRatioA: 7, speedRatioB: 5, distanceRatioA: 3, distanceRatioB: 2 },
  ],
  distanceRatio: [
    { objectA: "Train A", objectB: "Train B", speedRatioA: 5, speedRatioB: 4, timeRatioA: 3, timeRatioB: 2 },
    { objectA: "Runner A", objectB: "Runner B", speedRatioA: 6, speedRatioB: 5, timeRatioA: 4, timeRatioB: 3 },
    { objectA: "Car A", objectB: "Car B", speedRatioA: 7, speedRatioB: 6, timeRatioA: 5, timeRatioB: 4 },
  ],
  speedRatio: [
    { objectA: "Train A", objectB: "Train B", distanceRatioA: 9, distanceRatioB: 8, timeRatioA: 3, timeRatioB: 4 },
    { objectA: "Runner A", objectB: "Runner B", distanceRatioA: 10, distanceRatioB: 9, timeRatioA: 5, timeRatioB: 6 },
    { objectA: "Car A", objectB: "Car B", distanceRatioA: 15, distanceRatioB: 14, timeRatioA: 3, timeRatioB: 4 },
  ],
  raceLead: [
    { objectA: "Aman", objectB: "Bhavna", trackDistance: 400, speedRatioA: 5, speedRatioB: 4 },
    { objectA: "Runner A", objectB: "Runner B", trackDistance: 300, speedRatioA: 6, speedRatioB: 5 },
    { objectA: "Horse A", objectB: "Horse B", trackDistance: 600, speedRatioA: 4, speedRatioB: 3 },
  ],
  overtake: [
    { objectA: "Runner A", objectB: "Runner B", speedA: 54, speedB: 36, leadDistance: 100 },
    { objectA: "Cyclist A", objectB: "Cyclist B", speedA: 45, speedB: 30, leadDistance: 125 },
    { objectA: "Car A", objectB: "Car B", speedA: 72, speedB: 54, leadDistance: 150 },
  ],
} as const;

const POPULATION_CASES = [
  { regionName: "a village", totalPopulation: 18000, maleRatio: 5, femaleRatio: 4, maleLiterateRatio: 3, maleIlliterateRatio: 2, femaleLiterateRatio: 5, femaleIlliterateRatio: 3 },
  { regionName: "a town", totalPopulation: 24000, maleRatio: 7, femaleRatio: 5, maleLiterateRatio: 4, maleIlliterateRatio: 3, femaleLiterateRatio: 3, femaleIlliterateRatio: 2 },
  { regionName: "a block", totalPopulation: 30000, maleRatio: 3, femaleRatio: 2, maleLiterateRatio: 5, maleIlliterateRatio: 4, femaleLiterateRatio: 7, femaleIlliterateRatio: 5 },
] as const;

const ELECTION_CASES = {
  validSplit: [
    { constituencyName: "a constituency", candidateA: "Aman", candidateB: "Bhavna", totalValidVotes: 10000, candidateRatioA: 3, candidateRatioB: 2 },
    { constituencyName: "a ward", candidateA: "Ravi", candidateB: "Sunita", totalValidVotes: 18000, candidateRatioA: 5, candidateRatioB: 4 },
    { constituencyName: "a seat", candidateA: "Candidate A", candidateB: "Candidate B", totalValidVotes: 24000, candidateRatioA: 7, candidateRatioB: 5 },
  ],
  staged: [
    { constituencyName: "a constituency", candidateA: "Aman", candidateB: "Bhavna", totalVoters: 20000, turnoutPercent: 80, validPercent: 90, candidateRatioA: 5, candidateRatioB: 4 },
    { constituencyName: "a ward", candidateA: "Ravi", candidateB: "Sunita", totalVoters: 50000, turnoutPercent: 60, validPercent: 80, candidateRatioA: 7, candidateRatioB: 5 },
    { constituencyName: "a seat", candidateA: "Candidate A", candidateB: "Candidate B", totalVoters: 30000, turnoutPercent: 70, validPercent: 90, candidateRatioA: 4, candidateRatioB: 3 },
  ],
  reverse: [
    { constituencyName: "a constituency", candidateA: "Aman", candidateB: "Bhavna", turnoutPercent: 75, validPercent: 96, candidateRatioA: 7, candidateRatioB: 5, winningMargin: 1200 },
    { constituencyName: "a ward", candidateA: "Ravi", candidateB: "Sunita", turnoutPercent: 80, validPercent: 90, candidateRatioA: 5, candidateRatioB: 4, winningMargin: 1600 },
    { constituencyName: "a seat", candidateA: "Candidate A", candidateB: "Candidate B", turnoutPercent: 60, validPercent: 80, candidateRatioA: 7, candidateRatioB: 5, winningMargin: 4000 },
  ],
  invalid: [
    { constituencyName: "a constituency", totalVoters: 25000, turnoutPercent: 80, invalidPercent: 10 },
    { constituencyName: "a ward", totalVoters: 30000, turnoutPercent: 70, invalidPercent: 8 },
    { constituencyName: "a seat", totalVoters: 50000, turnoutPercent: 60, invalidPercent: 5 },
  ],
} as const;

const GEOMETRIC_CASES = {
  sideArea: [
    { shapeName: "squares", sideRatioA: 3, sideRatioB: 4 },
    { shapeName: "similar triangles", sideRatioA: 2, sideRatioB: 5 },
    { shapeName: "similar rectangles", sideRatioA: 5, sideRatioB: 6 },
  ],
  sideVolume: [
    { solidName: "cubes", sideRatioA: 2, sideRatioB: 3 },
    { solidName: "spheres", sideRatioA: 3, sideRatioB: 4 },
    { solidName: "similar cones", sideRatioA: 4, sideRatioB: 5 },
  ],
  areaSide: [
    { shapeName: "squares", areaRatioA: 9, areaRatioB: 16 },
    { shapeName: "similar triangles", areaRatioA: 25, areaRatioB: 36 },
    { shapeName: "similar rectangles", areaRatioA: 4, areaRatioB: 9 },
  ],
  volumeSurface: [
    { solidName: "cubes", volumeRatioA: 27, volumeRatioB: 64 },
    { solidName: "spheres", volumeRatioA: 8, volumeRatioB: 27 },
    { solidName: "similar cylinders", volumeRatioA: 125, volumeRatioB: 216 },
  ],
  radiusArea: [
    { shapeName: "circles", radiusRatioA: 2, radiusRatioB: 3 },
    { shapeName: "spheres", radiusRatioA: 3, radiusRatioB: 5 },
    { shapeName: "circular fields", radiusRatioA: 4, radiusRatioB: 7 },
  ],
} as const;

function pickQl(cpId: Rap003CanonicalProblemId, seed: string, requested?: string) {
  if (requested) return requested;
  const ids = getRap003QuestionLanguageIds(cpId);
  return ids[stableBucket(`${seed}:ql`, ids.length)]!;
}

function variablesForQl(qlId: string, seed: string): Rap003Variables {
  const targetPerson = stableBucket(`${seed}:target`, 2) === 0 ? "personA" : "personB";
  if (qlId === "RAP-QL-801" || qlId === "RAP-QL-804") {
    const selected = pick(PARTNERSHIP_CASES.standard, `${seed}:partnership`);
    return { ...selected, targetPartner: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-802") {
    const selected = pick(PARTNERSHIP_CASES.joining, `${seed}:partnershipJoining`);
    return { ...selected, targetPartner: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-803") {
    const selected = pick(PARTNERSHIP_CASES.midChange, `${seed}:partnershipMid`);
    return { ...selected, targetPartner: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-951") {
    return { ...pick(INCOME_EXPENDITURE_CASES.savingsRatio, `${seed}:incomeSavingsRatio`) };
  }
  if (qlId === "RAP-QL-952") {
    const selected = pick(INCOME_EXPENDITURE_CASES.equalSavings, `${seed}:incomeEqualSavings`);
    return { ...selected, targetPerson: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-953") {
    const selected = pick(INCOME_EXPENDITURE_CASES.savingsConstraint, `${seed}:incomeFromSavings`);
    return { ...selected, targetPerson: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-954") {
    const selected = pick(INCOME_EXPENDITURE_CASES.savingsConstraint, `${seed}:expenditureFromSavings`);
    return { ...selected, targetPerson: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-1001" || qlId === "RAP-QL-1004") {
    return { ...pick(ALLOY_CASES.mixingRatio, `${seed}:alloyMix`) };
  }
  if (qlId === "RAP-QL-1002") {
    return { ...pick(ALLOY_CASES.targetPercent, `${seed}:alloyTarget`) };
  }
  if (qlId === "RAP-QL-1003") {
    return { ...pick(ALLOY_CASES.threeSource, `${seed}:alloyThree`) };
  }
  if (qlId === "RAP-QL-1101" || qlId === "RAP-QL-1104") {
    return { ...pick(REPLACEMENT_CASES.forward, `${seed}:replacementForward`) };
  }
  if (qlId === "RAP-QL-1102") {
    return { ...pick(REPLACEMENT_CASES.quantity, `${seed}:replacementQuantity`) };
  }
  if (qlId === "RAP-QL-1103") {
    return { ...pick(REPLACEMENT_CASES.reverse, `${seed}:replacementReverse`) };
  }
  if (qlId === "RAP-QL-1201") {
    return { ...pick(DENOMINATION_CASES.value, `${seed}:denominationValue`) };
  }
  if (qlId === "RAP-QL-1202") {
    const selected = pick(DENOMINATION_CASES.total, `${seed}:denominationTotal`);
    const denominations = [selected.denominationA, selected.denominationB, selected.denominationC] as const;
    return { ...selected, targetDenomination: denominations[stableBucket(`${seed}:targetDenomination`, denominations.length)] };
  }
  if (qlId === "RAP-QL-1203") {
    const selected = pick(DENOMINATION_CASES.value, `${seed}:denominationCount`);
    const denominations = [selected.denominationA, selected.denominationB, selected.denominationC] as const;
    return { ...selected, targetDenomination: denominations[stableBucket(`${seed}:targetDenomination`, denominations.length)] };
  }
  if (qlId === "RAP-QL-1204") {
    return { ...pick(DENOMINATION_CASES.swap, `${seed}:denominationSwap`) };
  }
  if (qlId === "RAP-QL-1205") {
    return { ...pick(DENOMINATION_CASES.fourValue, `${seed}:denominationFourValue`) };
  }
  if (qlId === "RAP-QL-1206") {
    const selected = pick(DENOMINATION_CASES.fourTotal, `${seed}:denominationFourTotal`);
    const denominations = [selected.denominationA, selected.denominationB, selected.denominationC, selected.denominationD] as const;
    return { ...selected, targetDenomination: denominations[stableBucket(`${seed}:targetDenomination`, denominations.length)] };
  }
  if (qlId === "RAP-QL-1301") {
    return { ...pick(SDT_CASES.timeRatio, `${seed}:sdtTimeRatio`) };
  }
  if (qlId === "RAP-QL-1302") {
    return { ...pick(SDT_CASES.distanceRatio, `${seed}:sdtDistanceRatio`) };
  }
  if (qlId === "RAP-QL-1303") {
    return { ...pick(SDT_CASES.speedRatio, `${seed}:sdtSpeedRatio`) };
  }
  if (qlId === "RAP-QL-1304") {
    return { ...pick(SDT_CASES.raceLead, `${seed}:sdtRaceLead`) };
  }
  if (qlId === "RAP-QL-1305") {
    return { ...pick(SDT_CASES.overtake, `${seed}:sdtOvertake`) };
  }
  if (qlId === "RAP-QL-1401") {
    const selected = pick(POPULATION_CASES, `${seed}:populationCell`);
    const targetGroup = stableBucket(`${seed}:targetGroup`, 2) === 0 ? "male" : "female";
    const targetLiteracy = stableBucket(`${seed}:targetLiteracy`, 2) === 0 ? "literate" : "illiterate";
    return { ...selected, targetGroup, targetLiteracy };
  }
  if (qlId === "RAP-QL-1404") {
    const selected = pick(POPULATION_CASES, `${seed}:populationRatio`);
    const options = [
      { ratioCellA: "literate males", ratioCellB: "literate females" },
      { ratioCellA: "illiterate males", ratioCellB: "illiterate females" },
      { ratioCellA: "literate males", ratioCellB: "illiterate males" },
    ] as const;
    return { ...selected, ...pick(options, `${seed}:populationRatioCells`) };
  }
  if (qlId === "RAP-QL-1402" || qlId === "RAP-QL-1403" || qlId === "RAP-QL-1405") {
    return { ...pick(POPULATION_CASES, `${seed}:populationTotal`) };
  }
  if (qlId === "RAP-QL-1501") {
    return { ...pick(ELECTION_CASES.validSplit, `${seed}:electionValidSplit`) };
  }
  if (qlId === "RAP-QL-1502" || qlId === "RAP-QL-1504") {
    return { ...pick(ELECTION_CASES.staged, `${seed}:electionStaged`) };
  }
  if (qlId === "RAP-QL-1503") {
    return { ...pick(ELECTION_CASES.reverse, `${seed}:electionReverse`) };
  }
  if (qlId === "RAP-QL-1505") {
    return { ...pick(ELECTION_CASES.invalid, `${seed}:electionInvalid`) };
  }
  if (qlId === "RAP-QL-1601") {
    return { ...pick(GEOMETRIC_CASES.sideArea, `${seed}:geometricSideArea`) };
  }
  if (qlId === "RAP-QL-1602") {
    return { ...pick(GEOMETRIC_CASES.sideVolume, `${seed}:geometricSideVolume`) };
  }
  if (qlId === "RAP-QL-1603") {
    return { ...pick(GEOMETRIC_CASES.areaSide, `${seed}:geometricAreaSide`) };
  }
  if (qlId === "RAP-QL-1604") {
    return { ...pick(GEOMETRIC_CASES.volumeSurface, `${seed}:geometricVolumeSurface`) };
  }
  if (qlId === "RAP-QL-1605") {
    return { ...pick(GEOMETRIC_CASES.radiusArea, `${seed}:geometricRadiusArea`) };
  }

  if (qlId === "RAP-QL-901" || qlId === "RAP-QL-902") {
    const selected = pick(AGE_CASES.future, `${seed}:future`);
    return { ...selected, targetPerson: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-903") {
    const selected = pick(AGE_CASES.past, `${seed}:past`);
    return { ...selected, targetPerson: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-904" || qlId === "RAP-QL-906") {
    return { ...pick(AGE_CASES.years, `${seed}:years`) };
  }
  const selected = pick(AGE_CASES.difference, `${seed}:difference`);
  return { ...selected, targetPerson: targetPerson === "personA" ? selected.personA : selected.personB };
}

export function generateRap003Parameters(input: Rap003ParameterInput = {}): Rap003Parameters {
  const cpId = input.canonicalProblemId ?? "RAP-CP-014";
  if (cpId !== "RAP-CP-013" && cpId !== "RAP-CP-014" && cpId !== "RAP-CP-015" && cpId !== "RAP-CP-016" && cpId !== "RAP-CP-017" && cpId !== "RAP-CP-018" && cpId !== "RAP-CP-019" && cpId !== "RAP-CP-020" && cpId !== "RAP-CP-021" && cpId !== "RAP-CP-022") throw new Error(`RAP-003 MVP currently supports RAP-CP-013 through RAP-CP-022. Received ${cpId}.`);

  const seed = input.seed ?? `RAP-003:${cpId}`;
  const language = input.language ?? "en";
  const qlId = pickQl(cpId, seed, input.questionLanguageId);
  const registry = getRap003RegistryEntry(qlId);
  const difficulty: Rap003DifficultyBand = input.difficultyBand ?? registry.difficulty;
  const variables = variablesForQl(qlId, seed);

  return {
    archetypeId: RAP_003_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${qlId}:${seed}`,
    questionLanguageId: qlId,
    explanationId: registry.explanationId,
    language,
    difficultyBand: difficulty,
    taskKind: registry.taskKind,
    answerType: registry.answerType,
    requiredVariables: registry.requiredVariables,
    variables,
    sourceTrace: {
      questionLanguageSource: `question-language.${language}.json`,
      explanationSource: `explanation.${language}.json`,
      variableRangeSource: "parameter-generator.ts curated advanced application cases",
    },
  };
}
