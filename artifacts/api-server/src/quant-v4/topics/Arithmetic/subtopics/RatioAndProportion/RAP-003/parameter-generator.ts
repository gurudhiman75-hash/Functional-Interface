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
    { personA: "father", personB: "son", ratioA: 5, ratioB: 2, shiftYears: 8, futureRatioA: 2, futureRatioB: 1 },
    { personA: "mother", personB: "daughter", ratioA: 7, ratioB: 3, shiftYears: 5, futureRatioA: 2, futureRatioB: 1 },
    { personA: "A", personB: "B", ratioA: 4, ratioB: 3, shiftYears: 6, futureRatioA: 6, futureRatioB: 5 },
    { personA: "elder brother", personB: "younger brother", ratioA: 9, ratioB: 5, shiftYears: 8, futureRatioA: 13, futureRatioB: 9 },
  ],
  past: [
    { personA: "father", personB: "son", ratioA: 3, ratioB: 1, shiftYears: 7, pastRatioA: 5, pastRatioB: 1 },
    { personA: "mother", personB: "daughter", ratioA: 4, ratioB: 1, shiftYears: 6, pastRatioA: 10, pastRatioB: 1 },
    { personA: "A", personB: "B", ratioA: 9, ratioB: 7, shiftYears: 5, pastRatioA: 2, pastRatioB: 1 },
  ],
  years: [
    { personA: "A", personB: "B", presentAgeA: 30, presentAgeB: 18, futureRatioA: 7, futureRatioB: 5 },
    { personA: "father", personB: "son", presentAgeA: 40, presentAgeB: 16, futureRatioA: 2, futureRatioB: 1 },
    { personA: "mother", personB: "daughter", presentAgeA: 42, presentAgeB: 18, futureRatioA: 5, futureRatioB: 3 },
    { personA: "elder brother", personB: "younger brother", presentAgeA: 27, presentAgeB: 15, futureRatioA: 3, futureRatioB: 2 },
  ],
  difference: [
    { personA: "father", personB: "son", ratioA: 5, ratioB: 2, ageDifference: 24 },
    { personA: "mother", personB: "daughter", ratioA: 7, ratioB: 3, ageDifference: 24 },
    { personA: "A", personB: "B", ratioA: 9, ratioB: 5, ageDifference: 20 },
  ],
  sum: [
    { personA: "Aman", personB: "Bhavna", ratioA: 5, ratioB: 4, ageSum: 45 },
    { personA: "father", personB: "son", ratioA: 7, ratioB: 3, ageSum: 60 },
    { personA: "mother", personB: "daughter", ratioA: 5, ratioB: 2, ageSum: 49 },
  ],
  presentRatio: [
    { personA: "Aman", personB: "Bhavna", presentAgeA: 24, presentAgeB: 18, shiftYears: 6 },
    { personA: "father", personB: "son", presentAgeA: 42, presentAgeB: 14, shiftYears: 7 },
    { personA: "elder sister", personB: "younger sister", presentAgeA: 27, presentAgeB: 15, shiftYears: 3 },
  ],
  threePerson: [
    { personA: "A", personB: "B", personC: "C", ratioA: 2, ratioB: 3, ratioC: 4, ageSum: 54 },
    { personA: "Ravi", personB: "Sunita", personC: "Aman", ratioA: 5, ratioB: 4, ratioC: 3, ageSum: 72 },
    { personA: "elder brother", personB: "middle brother", personC: "younger brother", ratioA: 7, ratioB: 5, ratioC: 4, ageSum: 64 },
  ],
} as const;

const AGE_NAME_PAIRS = [
  ["Aman", "Bhavna"],
  ["Ravi", "Sunita"],
  ["Karan", "Meena"],
  ["Dev", "Nisha"],
  ["Arjun", "Kavita"],
  ["Rohan", "Pooja"],
  ["Vikas", "Neha"],
  ["Sahil", "Ritika"],
  ["Mohit", "Anita"],
  ["Nitin", "Seema"],
  ["Gaurav", "Priya"],
  ["Varun", "Isha"],
  ["Deepak", "Renu"],
  ["Suresh", "Lata"],
  ["Manoj", "Geeta"],
  ["Akash", "Tanya"],
  ["Harsh", "Komal"],
  ["Vivek", "Shreya"],
  ["Rahul", "Maya"],
  ["Anil", "Preeti"],
  ["Tarun", "Sonia"],
  ["Naveen", "Rekha"],
  ["Ajay", "Kirti"],
  ["Mohan", "Divya"],
] as const;

const AGE_NAME_TRIPLES = [
  ["Aman", "Bhavna", "Charu"],
  ["Ravi", "Sunita", "Karan"],
  ["Arjun", "Meena", "Dev"],
  ["Rohan", "Nisha", "Kavita"],
  ["Vikas", "Neha", "Sahil"],
  ["Mohit", "Anita", "Nitin"],
  ["Gaurav", "Priya", "Varun"],
  ["Deepak", "Renu", "Suresh"],
  ["Manoj", "Geeta", "Akash"],
  ["Harsh", "Komal", "Vivek"],
  ["Rahul", "Maya", "Anil"],
  ["Tarun", "Sonia", "Naveen"],
  ["Ajay", "Kirti", "Mohan"],
  ["Vikas", "Isha", "Gaurav"],
  ["Sahil", "Ritika", "Manoj"],
  ["Nitin", "Seema", "Akash"],
  ["Varun", "Preeti", "Deepak"],
  ["Mohit", "Divya", "Rahul"],
  ["Anil", "Tanya", "Suresh"],
  ["Naveen", "Rekha", "Harsh"],
  ["Dev", "Pooja", "Vivek"],
  ["Arjun", "Neha", "Tarun"],
  ["Rohan", "Maya", "Ajay"],
  ["Karan", "Sonia", "Mohan"],
] as const;

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

function seedSerialOffset(seed: string, modulo: number) {
  const matches = [...seed.matchAll(/:(\d+)/g)];
  const value = matches.length ? Number(matches[matches.length - 1]![1]) : stableBucket(`${seed}:serial`, modulo);
  return Number.isFinite(value) ? value % modulo : 0;
}

function scaleKeys(variables: Rap003Variables, factor: number, keys: readonly string[]) {
  const scaled = { ...variables };
  for (const key of keys) {
    if (typeof scaled[key] === "number") {
      scaled[key] = Number(scaled[key]) * factor;
    }
  }
  return scaled;
}

function addKeys(variables: Rap003Variables, offset: number, keys: readonly string[]) {
  const adjusted = { ...variables };
  for (const key of keys) {
    if (typeof adjusted[key] === "number") {
      adjusted[key] = Number(adjusted[key]) + offset;
    }
  }
  return adjusted;
}

function diversifyVariables(qlId: string, seed: string, variables: Rap003Variables): Rap003Variables {
  const serial = seedSerialOffset(seed, 997);
  const scale = 1 + serial;
  const smallScale = 1 + serial;
  const ratioOffset = serial;
  const percentOffset = serial % 13;

  if (qlId.startsWith("RAP-QL-8")) {
    const partnershipQlNumber = Number(qlId.replace("RAP-QL-", ""));
    if (partnershipQlNumber >= 806 && partnershipQlNumber <= 816) {
      return variables;
    }
    return scaleKeys(variables, scale, [
      "investmentA",
      "investmentB",
      "investmentC",
      "initialInvestmentA",
      "initialInvestmentB",
      "changedInvestmentA",
      "changedInvestmentB",
      "totalProfit",
      "totalLoss",
      "salaryAmount",
      "commission",
      "knownShare",
    ]);
  }

  const qlNumber = Number(qlId.replace("RAP-QL-", ""));
  if (qlNumber >= 901 && qlNumber <= 930) {
    if (qlId === "RAP-QL-927" || qlId === "RAP-QL-928" || qlId === "RAP-QL-929" || qlId === "RAP-QL-930") {
      return variables;
    }
    const ageScale = 1 + (serial % 2);
    const ageScaled = scaleKeys(variables, ageScale, [
      "presentAgeA",
      "presentAgeB",
      "shiftYears",
      "ageDifference",
      "ageSum",
      "knownAge",
      "averageAge",
      "futureSum",
      "pastSum",
    ]);
    const relationSpecific =
      /father|mother|son|daughter/.test(String(ageScaled.personA ?? "")) ||
      /father|mother|son|daughter/.test(String(ageScaled.personB ?? ""));
    const genericPair = /^(A|B|Person A|Person B)$/i.test(String(ageScaled.personA ?? "")) || /^(A|B|Person A|Person B)$/i.test(String(ageScaled.personB ?? ""));
    if (qlId === "RAP-QL-910" || qlId === "RAP-QL-919" || qlId === "RAP-QL-920" || qlId === "RAP-QL-922") {
      const [personA, personB, personC] = AGE_NAME_TRIPLES[serial % AGE_NAME_TRIPLES.length]!;
      return {
        ...ageScaled,
        personA,
        personB,
        personC,
        ...(ageScaled.targetPerson === variables.personA ? { targetPerson: personA } : {}),
        ...(ageScaled.targetPerson === variables.personB ? { targetPerson: personB } : {}),
        ...(ageScaled.targetPerson === variables.personC ? { targetPerson: personC } : {}),
        ...(ageScaled.knownPerson === variables.personA ? { knownPerson: personA } : {}),
        ...(ageScaled.knownPerson === variables.personB ? { knownPerson: personB } : {}),
        ...(ageScaled.knownPerson === variables.personC ? { knownPerson: personC } : {}),
      };
    }
    if ((relationSpecific && ageScale > 1) || genericPair || !relationSpecific) {
      const [personA, personB] = AGE_NAME_PAIRS[serial % AGE_NAME_PAIRS.length]!;
      return {
        ...ageScaled,
        personA,
        personB,
        ...(ageScaled.targetPerson === variables.personA ? { targetPerson: personA } : {}),
        ...(ageScaled.targetPerson === variables.personB ? { targetPerson: personB } : {}),
      };
    }
    return ageScaled;
  }

  if (qlId.startsWith("RAP-QL-95")) {
    const incomeQlNumber = Number(qlId.replace("RAP-QL-", ""));
    if (incomeQlNumber >= 956 && incomeQlNumber <= 974) {
      return variables;
    }
    return scaleKeys(variables, scale, [
      "incomeUnit",
      "expenditureUnit",
      "givenIncomeA",
      "givenExpenditureB",
    ]);
  }

  if (qlId === "RAP-QL-1001" || qlId === "RAP-QL-1004") {
    return {
      ...addKeys(variables, percentOffset, ["percentA", "percentB", "targetPercent"]),
      mixtureA: `${variables.mixtureA} sample ${serial + 1}`,
      mixtureB: `${variables.mixtureB} sample ${serial + 1}`,
    };
  }
  if (qlId === "RAP-QL-1002" || qlId === "RAP-QL-1005") {
    return {
      ...addKeys(variables, percentOffset, ["percentA", "percentB"]),
      mixtureA: `${variables.mixtureA} sample ${serial + 1}`,
      mixtureB: `${variables.mixtureB} sample ${serial + 1}`,
      quantityA: Number(variables.quantityA) + serial % 11,
      quantityB: Number(variables.quantityB) + serial % 13,
    };
  }
  if (qlId === "RAP-QL-1003") {
    return {
      ...addKeys(variables, ratioOffset, [
        "ratioAComponent",
        "ratioAOther",
        "ratioBComponent",
        "ratioBOther",
        "ratioCComponent",
        "ratioCOther",
      ]),
      mixtureA: `${variables.mixtureA} sample ${serial + 1}`,
      mixtureB: `${variables.mixtureB} sample ${serial + 1}`,
      mixtureC: `${variables.mixtureC} sample ${serial + 1}`,
    };
  }

  if (qlId.startsWith("RAP-QL-11")) {
    const replacementQlNumber = Number(qlId.replace("RAP-QL-", ""));
    if (replacementQlNumber >= 1106 && replacementQlNumber <= 1119) {
      return variables;
    }
    return scaleKeys(variables, smallScale, ["initialVolume", "removedVolume"]);
  }

  if (qlId.startsWith("RAP-QL-12")) {
    const denominationQlNumber = Number(qlId.replace("RAP-QL-", ""));
    if (denominationQlNumber >= 1208 && denominationQlNumber <= 1218) {
      return variables;
    }
    return scaleKeys(variables, scale, ["commonUnit", "totalValue", "swapCount"]);
  }

  if (qlId === "RAP-QL-1301") {
    return addKeys(variables, ratioOffset, ["speedRatioA", "speedRatioB", "distanceRatioA", "distanceRatioB"]);
  }
  if (qlId === "RAP-QL-1302") {
    return addKeys(variables, ratioOffset, ["speedRatioA", "speedRatioB", "timeRatioA", "timeRatioB"]);
  }
  if (qlId === "RAP-QL-1303") {
    return addKeys(variables, ratioOffset, ["distanceRatioA", "distanceRatioB", "timeRatioA", "timeRatioB"]);
  }
  if (qlId === "RAP-QL-1304") {
    return {
      ...addKeys(variables, ratioOffset, ["speedRatioA", "speedRatioB"]),
      trackDistance: Number(variables.trackDistance) + (serial % 9) * 20,
    };
  }
  if (qlId === "RAP-QL-1305" || qlId === "RAP-QL-1306") {
    return {
      ...variables,
      leadDistance: Number(variables.leadDistance) + serial * 5,
    };
  }
  if (qlId.startsWith("RAP-QL-13")) {
    const sdtQlNumber = Number(qlId.replace("RAP-QL-", ""));
    if (sdtQlNumber >= 1307 && sdtQlNumber <= 1325) {
      return variables;
    }
  }

  if (qlId.startsWith("RAP-QL-14")) {
    const populationQlNumber = Number(qlId.replace("RAP-QL-", ""));
    if (populationQlNumber >= 1407 && populationQlNumber <= 1420) {
      return variables;
    }
    return scaleKeys(variables, scale, ["totalPopulation"]);
  }

  if (qlId.startsWith("RAP-QL-15")) {
    const electionQlNumber = Number(qlId.replace("RAP-QL-", ""));
    if (electionQlNumber >= 1507 && electionQlNumber <= 1525) {
      return variables;
    }
    return scaleKeys(variables, scale, ["totalValidVotes", "totalVoters", "winningMargin"]);
  }

  if (qlId.startsWith("RAP-QL-16")) {
    const geometricQlNumber = Number(qlId.replace("RAP-QL-", ""));
    if (geometricQlNumber >= 1607 && geometricQlNumber <= 1617) {
      return variables;
    }
    if (qlId === "RAP-QL-1603" || qlId === "RAP-QL-1606") {
      const sideA = Math.sqrt(Number(variables.areaRatioA)) + ratioOffset;
      const sideB = Math.sqrt(Number(variables.areaRatioB)) + ratioOffset;
      return { ...variables, areaRatioA: sideA ** 2, areaRatioB: sideB ** 2 };
    }
    if (qlId === "RAP-QL-1604") {
      const sideA = Math.cbrt(Number(variables.volumeRatioA)) + ratioOffset;
      const sideB = Math.cbrt(Number(variables.volumeRatioB)) + ratioOffset;
      return { ...variables, volumeRatioA: sideA ** 3, volumeRatioB: sideB ** 3 };
    }
    return addKeys(variables, ratioOffset, [
      "sideRatioA",
      "sideRatioB",
      "radiusRatioA",
      "radiusRatioB",
    ]);
  }

  return variables;
}

function variablesForQl(qlId: string, seed: string): Rap003Variables {
  const targetPerson = stableBucket(`${seed}:target`, 2) === 0 ? "personA" : "personB";
  if (qlId === "RAP-QL-801" || qlId === "RAP-QL-804") {
    const selected = pick(PARTNERSHIP_CASES.standard, `${seed}:partnership`);
    return { ...selected, targetPartner: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-802" || qlId === "RAP-QL-805") {
    const selected = pick(PARTNERSHIP_CASES.joining, `${seed}:partnershipJoining`);
    return { ...selected, targetPartner: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-803") {
    const selected = pick(PARTNERSHIP_CASES.midChange, `${seed}:partnershipMid`);
    return { ...selected, targetPartner: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-806") {
    return { personA: "Aman", personB: "Bhavna", investmentA: 50000, investmentB: 70000, timeA: 12, timeB: 8, totalProfit: 29000, targetPartner: "Bhavna" };
  }
  if (qlId === "RAP-QL-807") {
    return { personA: "Ravi", personB: "Sunita", initialInvestmentA: 30000, changedInvestmentA: 50000, initialInvestmentB: 60000, changedInvestmentB: 40000, firstPeriod: 6, secondPeriod: 6, totalProfit: 27000, targetPartner: "Sunita" };
  }
  if (qlId === "RAP-QL-808") {
    return { personA: "Aman", personB: "Bhavna", investmentA: 40000, investmentB: 60000, timeA: 10, timeB: 10, totalProfit: 41000, salaryPartner: "Aman", salaryAmount: 5000, targetPartner: "Aman" };
  }
  if (qlId === "RAP-QL-809") {
    return { personA: "Aman", personB: "Bhavna", investmentA: 40000, investmentB: 60000, timeA: 12, timeB: 8, knownPartner: "Aman", knownShare: 15000 };
  }
  if (qlId === "RAP-QL-810") {
    return { personA: "Aman", personB: "Bhavna", capitalRatioA: 3, capitalRatioB: 4, timeRatioA: 5, timeRatioB: 3 };
  }
  if (qlId === "RAP-QL-811") {
    return { personA: "Aman", personB: "Bhavna", investmentA: 30000, investmentB: 45000, timeA: 12, timeB: 8, totalLoss: 18000, targetPartner: "Bhavna" };
  }
  if (qlId === "RAP-QL-812") {
    return { personA: "Worker A", personB: "Worker B", efficiencyRatioA: 4, efficiencyRatioB: 5, daysA: 6, daysB: 4 };
  }
  if (qlId === "RAP-QL-813") {
    return { personA: "Aman", personB: "Bhavna", investmentA: 60000, timeA: 12, timeB: 8, profitRatioA: 3, profitRatioB: 2 };
  }
  if (qlId === "RAP-QL-814") {
    return { personA: "Aman", personB: "Bhavna", investmentA: 40000, investmentB: 60000, timeA: 12, profitRatioA: 4, profitRatioB: 3 };
  }
  if (qlId === "RAP-QL-815") {
    return { personA: "Aman", personB: "Bhavna", effectiveRatioA: 5, effectiveRatioB: 7, totalProfit: 36000, targetPartner: "Bhavna" };
  }
  if (qlId === "RAP-QL-816") {
    return { personA: "Aman", personB: "Bhavna", investmentA: 50000, investmentB: 30000, timeA: 9, timeB: 15, totalProfit: 50000, commission: 5000, targetPartner: "Aman" };
  }
  if (qlId === "RAP-QL-951" || qlId === "RAP-QL-955") {
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
  if (qlId === "RAP-QL-956") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 3, incomeRatioB: 4, expenditureRatioA: 2, expenditureRatioB: 3, givenIncomeA: 30000, targetPerson: "Bhavna" };
  }
  if (qlId === "RAP-QL-957") {
    return { personA: "Ravi", personB: "Sunita", incomeRatioA: 4, incomeRatioB: 5, expenditureRatioA: 3, expenditureRatioB: 4, givenExpenditureB: 24000, targetPerson: "Ravi" };
  }
  if (qlId === "RAP-QL-958") {
    return { personA: "Aman", personB: "Bhavna", expenditureRatioA: 3, expenditureRatioB: 4, savingsRatioA: 2, savingsRatioB: 3, expenditureUnit: 5000, savingsUnit: 4000 };
  }
  if (qlId === "RAP-QL-959") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 5, incomeRatioB: 7, savingsRatioA: 2, savingsRatioB: 3, incomeUnit: 6000, savingsUnit: 5000 };
  }
  if (qlId === "RAP-QL-960") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 9, incomeRatioB: 7, expenditureRatioA: 5, expenditureRatioB: 2, savingsDifference: 4000, targetPerson: "Aman" };
  }
  if (qlId === "RAP-QL-961") {
    return { personA: "Ravi", personB: "Sunita", incomeRatioA: 8, incomeRatioB: 7, expenditureRatioA: 5, expenditureRatioB: 3, savingsSum: 28000, targetPerson: "Sunita" };
  }
  if (qlId === "RAP-QL-962") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 4, incomeRatioB: 5, savePercentA: 25, savePercentB: 20 };
  }
  if (qlId === "RAP-QL-963") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 5, incomeRatioB: 6, expenditureRatioA: 3, expenditureRatioB: 4, incomeUnit: 10000, expenditureUnit: 9000, targetPerson: "Aman" };
  }
  if (qlId === "RAP-QL-964") {
    return { personA: "Family A", personB: "Family B", incomeRatioA: 5, incomeRatioB: 7, expenditureRatioA: 3, expenditureRatioB: 5, incomeUnit: 12000, expenditureUnit: 10000 };
  }
  if (qlId === "RAP-QL-965") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 6, incomeRatioB: 5, expenditureRatioA: 4, expenditureRatioB: 2, incomeUnit: 8000 };
  }
  if (qlId === "RAP-QL-966") {
    return { personA: "Shop A", personB: "Shop B", revenueRatioA: 7, revenueRatioB: 8, costRatioA: 5, costRatioB: 6, revenueUnit: 10000, costUnit: 9000 };
  }
  if (qlId === "RAP-QL-967") {
    return { personA: "Aman", personB: "Bhavna", incomeValue: 50000, expenditureRatioA: 3, expenditureRatioB: 4, expenditureUnit: 8000 };
  }
  if (qlId === "RAP-QL-968") {
    return { personA: "Aman", personB: "Bhavna", expenseValue: 24000, incomeRatioA: 5, incomeRatioB: 6, incomeUnit: 8000 };
  }
  if (qlId === "RAP-QL-969") {
    return { personA: "Student A", personB: "Student B", incomeRatioA: 5, incomeRatioB: 4, expenditureRatioA: 3, expenditureRatioB: 2, incomeUnit: 1000, expenditureUnit: 1000 };
  }
  if (qlId === "RAP-QL-970") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 9, incomeRatioB: 7, expenditureRatioA: 5, expenditureRatioB: 2, savingsDifference: 4000, targetPerson: "Bhavna" };
  }
  if (qlId === "RAP-QL-971") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 8, incomeRatioB: 7, expenditureRatioA: 3, expenditureRatioB: 5, expenseDifference: 6000, targetPerson: "Aman" };
  }
  if (qlId === "RAP-QL-972") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 5, incomeRatioB: 7, expenditureRatioA: 3, expenditureRatioB: 4, totalIncome: 72000, expenditureUnit: 6000 };
  }
  if (qlId === "RAP-QL-973") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 5, incomeRatioB: 6, expenditureRatioA: 3, expenditureRatioB: 4, totalExpense: 42000, incomeUnit: 10000 };
  }
  if (qlId === "RAP-QL-974") {
    return { personA: "Aman", personB: "Bhavna", incomeRatioA: 7, incomeRatioB: 6, expenditureRatioA: 4, expenditureRatioB: 3, incomeUnit: 10000, expenditureUnit: 9000 };
  }
  if (qlId === "RAP-QL-1001" || qlId === "RAP-QL-1004") {
    return { ...pick(ALLOY_CASES.mixingRatio, `${seed}:alloyMix`) };
  }
  if (qlId === "RAP-QL-1002" || qlId === "RAP-QL-1005") {
    return { ...pick(ALLOY_CASES.targetPercent, `${seed}:alloyTarget`) };
  }
  if (qlId === "RAP-QL-1003") {
    return { ...pick(ALLOY_CASES.threeSource, `${seed}:alloyThree`) };
  }
  if (qlId === "RAP-QL-1006") return { mixtureA: "Acid solution A", mixtureB: "Acid solution B", component: "acid", percentA: 70, percentB: 40, targetPercent: 50 };
  if (qlId === "RAP-QL-1007") return { mixtureA: "Milk mixture A", mixtureB: "Milk mixture B", component: "milk", percentA: 80, percentB: 50, targetPercent: 60 };
  if (qlId === "RAP-QL-1008") return { mixtureA: "Solution A", mixtureB: "Solution B", component: "acid", quantityA: 20, quantityB: 40, percentA: 60, percentB: 30 };
  if (qlId === "RAP-QL-1009") return { itemName: "rice", quantityA: 30, quantityB: 20, averageA: 40, averageB: 60 };
  if (qlId === "RAP-QL-1010") return { groupA: "Section A", groupB: "Section B", quantityA: 30, quantityB: 20, averageA: 70, averageB: 80 };
  if (qlId === "RAP-QL-1011") return { groupA: "Department A", groupB: "Department B", quantityA: 40, quantityB: 60, averageA: 30000, averageB: 40000 };
  if (qlId === "RAP-QL-1012") return { mixtureA: "Solution A", mixtureB: "Solution B", component: "acid", quantityA: 20, percentA: 70, percentB: 40, targetPercent: 50 };
  if (qlId === "RAP-QL-1013") return { mixtureA: "Mixture A", mixtureB: "Mixture B", component: "milk", mixRatioA: 2, mixRatioB: 3, percentA: 80, targetPercent: 50 };
  if (qlId === "RAP-QL-1014") return { mixtureA: "Solution A", mixtureB: "Solution B", mixtureC: "Solution C", component: "acid", quantityA: 10, quantityB: 20, quantityC: 30, percentA: 40, percentB: 50, percentC: 70 };
  if (qlId === "RAP-QL-1015") return { mixtureA: "Alloy A", mixtureB: "Alloy B", mixtureC: "Alloy C", component: "silver", ratioAComponent: 1, ratioAOther: 1, ratioBComponent: 3, ratioBOther: 2, ratioCComponent: 2, ratioCOther: 3 };
  if (qlId === "RAP-QL-1016") return { mixtureA: "pure spirit", mixtureB: "spirit solution", component: "spirit", percentA: 100, percentB: 40, targetPercent: 70 };
  if (qlId === "RAP-QL-1017") return { mixtureA: "very dilute solution", mixtureB: "sugar solution", component: "sugar", percentA: 10, percentB: 80, targetPercent: 50 };
  if (qlId === "RAP-QL-1018") return { itemName: "two products", quantityA: 3000, quantityB: 2000, averageA: 20, averageB: 10 };
  if (qlId === "RAP-QL-1019") return { itemName: "two product groups", quantityA: 4000, quantityB: 6000, averageA: 10, averageB: 20 };
  if (qlId === "RAP-QL-1020") return { mixtureA: "Sugar solution A", mixtureB: "Sugar solution B", component: "sugar", quantityA: 25, quantityB: 15, percentA: 20, percentB: 60 };
  if (qlId === "RAP-QL-1021") return { itemName: "tea", ratioA: 3, ratioB: 2, priceA: 200, priceB: 300 };
  if (qlId === "RAP-QL-1022") return { itemName: "wheat", percentA: 30, percentB: 50, targetPercent: 42 };
  if (qlId === "RAP-QL-1023") return { groupA: "Batch A", groupB: "Batch B", quantityA: 40, quantityB: 60, averageA: 65, averageB: 75 };
  if (qlId === "RAP-QL-1024") return { groupA: "Group A", groupB: "Group B", quantityA: 30, averageA: 70, averageB: 50, combinedAverage: 62 };
  if (qlId === "RAP-QL-1025") return { groupA: "Group A", groupB: "Group B", quantityA: 20, quantityB: 30, averageA: 80, combinedAverage: 68 };
  if (qlId === "RAP-QL-1026") return { mixtureA: "Solution A", mixtureB: "Solution B", component: "acid", percentA: 40, percentB: 60, targetPercent: 50 };
  if (qlId === "RAP-QL-1027") return { mixtureA: "Alloy A", mixtureB: "Alloy B", component: "copper", percentA: 20, percentB: 80, targetPercent: 65 };
  if (qlId === "RAP-QL-1028") return { vesselName: "a tank", component: "acid", totalQuantity: 100, initialPercent: 40, addPercent: 80, targetPercent: 50 };
  if (qlId === "RAP-QL-1029") return { mixtureA: "Solution A", mixtureB: "Solution B", component: "salt", mixRatioA: 3, mixRatioB: 2, percentA: 20, percentB: 45 };
  if (qlId === "RAP-QL-1101" || qlId === "RAP-QL-1104") {
    return { ...pick(REPLACEMENT_CASES.forward, `${seed}:replacementForward`) };
  }
  if (qlId === "RAP-QL-1102" || qlId === "RAP-QL-1105") {
    return { ...pick(REPLACEMENT_CASES.quantity, `${seed}:replacementQuantity`) };
  }
  if (qlId === "RAP-QL-1103") {
    return { ...pick(REPLACEMENT_CASES.reverse, `${seed}:replacementReverse`) };
  }
  if (qlId === "RAP-QL-1106") {
    return { vesselName: "A vessel", liquidA: "milk", liquidB: "water", initialVolume: 64, removedVolume: 16, replacementCount: 3 };
  }
  if (qlId === "RAP-QL-1107") {
    return { vesselName: "A container", liquidA: "wine", liquidB: "water", initialVolume: 80, removedVolume: 8, replacementCount: 3 };
  }
  if (qlId === "RAP-QL-1108") {
    return { vesselName: "A tank", liquidA: "milk", liquidB: "water", initialVolume: 100, removedVolume: 20, replacementCount: 2 };
  }
  if (qlId === "RAP-QL-1109") {
    return { vesselName: "A vessel", liquidA: "acid", liquidB: "water", initialVolume: 50, removedVolume: 10, replacementCount: 2 };
  }
  if (qlId === "RAP-QL-1110") {
    return { vesselName: "A container", liquidA: "milk", liquidB: "water", initialVolume: 80, removedVolume: 20, finalRatioA: 27, finalRatioB: 37 };
  }
  if (qlId === "RAP-QL-1111") {
    return { vesselName: "A vessel", liquidA: "milk", liquidB: "water", initialVolume: 100, replacementCount: 2, finalRatioA: 16, finalRatioB: 9 };
  }
  if (qlId === "RAP-QL-1112") {
    return { vesselName: "A tank", liquidA: "solution", liquidB: "water", initialVolume: 60, removedVolumeA: 12, removedVolumeB: 15 };
  }
  if (qlId === "RAP-QL-1113") {
    return { vesselName: "An acid tank", liquidA: "acid", liquidB: "water", initialVolume: 72, removedVolume: 12, replacementCount: 2 };
  }
  if (qlId === "RAP-QL-1114") {
    return { vesselName: "A wine cask", liquidA: "wine", liquidB: "water", initialVolume: 90, removedVolume: 9, replacementCount: 2 };
  }
  if (qlId === "RAP-QL-1115") {
    return { vesselName: "A chemical tank", liquidA: "acid", liquidB: "weak solution", initialVolume: 100, removedVolume: 20, replacementCount: 2, initialPercent: 60, addLiquidPercent: 10 };
  }
  if (qlId === "RAP-QL-1116") {
    return { vesselName: "A warehouse", liquidA: "original stock", liquidB: "new stock", initialStock: 1000, soldEachRound: 100, replacementCount: 3 };
  }
  if (qlId === "RAP-QL-1117") {
    return { vesselName: "A vessel", liquidA: "milk", liquidB: "water", finalQuantity: 54, removedFractionNumerator: 1, removedFractionDenominator: 4, replacementCount: 2 };
  }
  if (qlId === "RAP-QL-1118") {
    return { vesselName: "A container", liquidA: "milk", liquidB: "water", removedFractionNumerator: 1, removedFractionDenominator: 3, replacementCount: 2 };
  }
  if (qlId === "RAP-QL-1119") {
    return { vesselName: "A solution tank", liquidA: "acid", liquidB: "weak solution", initialVolume: 80, removedVolume: 20, replacementCount: 2, initialPercent: 64, addLiquidPercent: 10 };
  }
  if (qlId === "RAP-QL-1201") {
    return { ...pick(DENOMINATION_CASES.value, `${seed}:denominationValue`) };
  }
  if (qlId === "RAP-QL-1202" || qlId === "RAP-QL-1207") {
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
  if (qlId === "RAP-QL-1208") {
    return { itemName: "notes", denominationA: 10, denominationB: 20, denominationC: 50, ratioA: 5, ratioB: 3, ratioC: 2, totalValue: 1680, targetDenomination: 50 };
  }
  if (qlId === "RAP-QL-1209") {
    return { itemName: "stamps", denominationA: 2, denominationB: 5, denominationC: 10, ratioA: 4, ratioB: 5, ratioC: 3, commonUnit: 6, targetDenomination: 5 };
  }
  if (qlId === "RAP-QL-1210") {
    return { itemName: "coins", denominationA: 1, denominationB: 2, denominationC: 5, ratioA: 3, ratioB: 4, ratioC: 5, totalValue: 360 };
  }
  if (qlId === "RAP-QL-1211") {
    return { itemName: "notes", denominationA: 5, denominationB: 10, denominationC: 20, ratioA: 2, ratioB: 3, ratioC: 4, totalCount: 90 };
  }
  if (qlId === "RAP-QL-1212") {
    return { itemName: "coins", denominationA: 1, denominationB: 2, denominationC: 5, ratioA: 3, ratioB: 4, ratioC: 5, commonUnit: 10 };
  }
  if (qlId === "RAP-QL-1213") {
    return { itemName: "notes", denominationA: 10, denominationB: 20, denominationC: 50, ratioA: 5, ratioB: 3, ratioC: 2, commonUnit: 8, fromDenomination: 20, toDenomination: 50, swapCount: 5 };
  }
  if (qlId === "RAP-QL-1214") {
    return { itemName: "tickets", denominationA: 10, denominationB: 20, denominationC: 40, ratioA: 3, ratioB: 4, ratioC: 3, commonUnit: 5 };
  }
  if (qlId === "RAP-QL-1215") {
    return { itemName: "notes", denominationA: 5, denominationB: 10, denominationC: 20, denominationD: 50, ratioA: 2, ratioB: 3, ratioC: 4, ratioD: 1, totalValue: 1020 };
  }
  if (qlId === "RAP-QL-1216") {
    return { itemName: "coupons", denominationA: 2, denominationB: 5, denominationC: 10, ratioA: 5, ratioB: 4, commonUnit: 7, totalValue: 700 };
  }
  if (qlId === "RAP-QL-1217") {
    return { itemName: "tickets", denominationA: 50, denominationB: 80, denominationC: 120, ratioA: 3, ratioB: 2, ratioC: 1, commonUnit: 10 };
  }
  if (qlId === "RAP-QL-1218") {
    return { itemName: "questions", denominationA: 1, denominationB: 2, denominationC: 5, ratioA: 10, ratioB: 6, ratioC: 4, commonUnit: 3 };
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
  if (qlId === "RAP-QL-1305" || qlId === "RAP-QL-1306") {
    return { ...pick(SDT_CASES.overtake, `${seed}:sdtOvertake`) };
  }
  if (qlId === "RAP-QL-1307") return { personA: "Bus A", personB: "Bus B", speedRatioA: 3, speedRatioB: 4, timeRatioA: 5, timeRatioB: 2 };
  if (qlId === "RAP-QL-1308") return { personA: "Train A", personB: "Train B", distanceRatioA: 6, distanceRatioB: 5, timeRatioA: 3, timeRatioB: 4 };
  if (qlId === "RAP-QL-1309") return { personA: "Car A", personB: "Car B", speedRatioA: 5, speedRatioB: 8 };
  if (qlId === "RAP-QL-1310") return { personA: "Runner A", personB: "Runner B", speedRatioA: 7, speedRatioB: 5 };
  if (qlId === "RAP-QL-1311") return { personA: "Runner A", personB: "Runner B", raceLength: 400, leadDistance: 80 };
  if (qlId === "RAP-QL-1312") return { personA: "Runner A", personB: "Runner B", timeA: 45, timeB: 60 };
  if (qlId === "RAP-QL-1313") return { personA: "Car A", personB: "Car B", speedA: 72, speedB: 54, leadDistance: 150 };
  if (qlId === "RAP-QL-1314") return { personA: "Car A", personB: "Car B", speedA: 40, speedB: 50, distance: 180 };
  if (qlId === "RAP-QL-1315") return { personA: "Train A", personB: "Train B", lengthRatioA: 5, lengthRatioB: 6, speedRatioA: 4, speedRatioB: 3 };
  if (qlId === "RAP-QL-1316") return { personA: "Team A", personB: "Team B", workerRatioA: 1, workerRatioB: 1, efficiencyRatioA: 3, efficiencyRatioB: 5, workRatioA: 2, workRatioB: 3 };
  if (qlId === "RAP-QL-1317") return { personA: "Factory A", personB: "Factory B", machineRatioA: 3, machineRatioB: 4, timeRatioA: 5, timeRatioB: 2, efficiencyRatioA: 1, efficiencyRatioB: 1 };
  if (qlId === "RAP-QL-1318") return { personA: "Pipe A", personB: "Pipe B", speedRatioA: 4, speedRatioB: 7 };
  if (qlId === "RAP-QL-1319") return { personA: "Group A", personB: "Group B", machineRatioA: 2, machineRatioB: 3, timeRatioA: 4, timeRatioB: 5, efficiencyRatioA: 3, efficiencyRatioB: 2 };
  if (qlId === "RAP-QL-1320") return { personA: "Machine A", personB: "Machine B", outputRatioA: 9, outputRatioB: 10, timeRatioA: 3, timeRatioB: 5 };
  if (qlId === "RAP-QL-1321") return { personA: "Old speed", personB: "New speed", speedRatioA: 5, speedRatioB: 6, oldTime: 12 };
  if (qlId === "RAP-QL-1322") return { personA: "Runner A", personB: "Runner B", trackDistance: 500, speedRatioA: 5, speedRatioB: 4 };
  if (qlId === "RAP-QL-1323") return { personA: "Team A", personB: "Team B", workerRatioA: 3, workerRatioB: 4, efficiencyRatioA: 2, efficiencyRatioB: 3, workRatioA: 1, workRatioB: 1 };
  if (qlId === "RAP-QL-1324") return { personA: "Unit A", personB: "Unit B", rateRatioA: 3, rateRatioB: 4, timeRatioA: 5, timeRatioB: 6, unitRatioA: 2, unitRatioB: 3, outputA: 300 };
  if (qlId === "RAP-QL-1325") return { personA: "Car A", personB: "Car B", leadDistance: 250, overtakeTime: 50 };
  if (qlId === "RAP-QL-1401") {
    const selected = pick(POPULATION_CASES, `${seed}:populationCell`);
    const targetGroup = stableBucket(`${seed}:targetGroup`, 2) === 0 ? "male" : "female";
    const targetLiteracy = stableBucket(`${seed}:targetLiteracy`, 2) === 0 ? "literate" : "illiterate";
    const targetCellLabel = `${targetLiteracy} ${targetGroup}s`;
    return { ...selected, targetGroup, targetLiteracy, targetCellLabel };
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
  if (qlId === "RAP-QL-1402" || qlId === "RAP-QL-1403" || qlId === "RAP-QL-1405" || qlId === "RAP-QL-1406") {
    return { ...pick(POPULATION_CASES, `${seed}:populationTotal`) };
  }
  if (qlId === "RAP-QL-1407") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1, targetGroup: "male", targetLiteracy: "illiterate", targetCellLabel: "illiterate males" };
  if (qlId === "RAP-QL-1408") return { totalPopulation: 1800, maleRatio: 4, femaleRatio: 5, maleLiterateRatio: 3, maleIlliterateRatio: 1, femaleLiterateRatio: 2, femaleIlliterateRatio: 3 };
  if (qlId === "RAP-QL-1409") return { totalPopulation: 1800, maleRatio: 4, femaleRatio: 5, maleLiterateRatio: 3, maleIlliterateRatio: 1, femaleLiterateRatio: 2, femaleIlliterateRatio: 3 };
  if (qlId === "RAP-QL-1410") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1, ratioCellA: "literate males", ratioCellB: "literate females" };
  if (qlId === "RAP-QL-1411") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1, targetCellLabel: "illiterate males" };
  if (qlId === "RAP-QL-1412") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1, knownCellLabel: "literate females", knownCellValue: 500 };
  if (qlId === "RAP-QL-1413") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1 };
  if (qlId === "RAP-QL-1414") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1, ratioCellA: "literate males", ratioCellB: "illiterate females" };
  if (qlId === "RAP-QL-1415") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1, ratioCellA: "illiterate males", ratioCellB: "illiterate females" };
  if (qlId === "RAP-QL-1416") return { totalPopulation: 2700, ratioA: 4, ratioB: 3, ratioC: 2, passRatioA: 5, failRatioA: 1 };
  if (qlId === "RAP-QL-1417") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1, ratioCellA: "literate males", ratioCellB: "literate females" };
  if (qlId === "RAP-QL-1418") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1, ratioCellA: "illiterate males", ratioCellB: "illiterate females" };
  if (qlId === "RAP-QL-1419") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1, ratioCellA: "literate males", ratioCellB: "illiterate males" };
  if (qlId === "RAP-QL-1420") return { totalPopulation: 2400, maleRatio: 5, femaleRatio: 3, maleLiterateRatio: 7, maleIlliterateRatio: 3, femaleLiterateRatio: 5, femaleIlliterateRatio: 1, ratioCellA: "literate females", ratioCellB: "illiterate females" };
  if (qlId === "RAP-QL-1501") {
    return { ...pick(ELECTION_CASES.validSplit, `${seed}:electionValidSplit`) };
  }
  if (qlId === "RAP-QL-1502" || qlId === "RAP-QL-1504") {
    return { ...pick(ELECTION_CASES.staged, `${seed}:electionStaged`) };
  }
  if (qlId === "RAP-QL-1503") {
    return { ...pick(ELECTION_CASES.reverse, `${seed}:electionReverse`) };
  }
  if (qlId === "RAP-QL-1505" || qlId === "RAP-QL-1506") {
    return { ...pick(ELECTION_CASES.invalid, `${seed}:electionInvalid`) };
  }
  if (qlId === "RAP-QL-1507") return { constituencyName: "a ward", candidateA: "Ravi", candidateB: "Sunita", totalVoters: 50000, turnoutPercent: 60, validPercent: 80, candidateRatioA: 7, candidateRatioB: 5 };
  if (qlId === "RAP-QL-1508") return { constituencyName: "a seat", candidateA: "Aman", candidateB: "Bhavna", totalVoters: 30000, turnoutPercent: 70, validPercent: 90, candidateRatioA: 4, candidateRatioB: 3 };
  if (qlId === "RAP-QL-1509") return { constituencyName: "a constituency", candidateA: "Aman", candidateB: "Bhavna", turnoutPercent: 75, validPercent: 96, candidateRatioA: 7, candidateRatioB: 5, winningMargin: 1200 };
  if (qlId === "RAP-QL-1510") return { constituencyName: "a polling area", totalVoters: 25000, turnoutPercent: 80, invalidPercent: 10 };
  if (qlId === "RAP-QL-1511") return { constituencyName: "a constituency", totalVoters: 40000, turnoutPercent: 75 };
  if (qlId === "RAP-QL-1512") return { constituencyName: "a ward", polledVotes: 24000, invalidPercent: 10 };
  if (qlId === "RAP-QL-1513") return { constituencyName: "a seat", totalValidVotes: 18000, winningMargin: 2000 };
  if (qlId === "RAP-QL-1514") return { constituencyName: "a seat", totalValidVotes: 18000, winningMargin: 2000 };
  if (qlId === "RAP-QL-1515") return { constituencyName: "a constituency", candidateA: "Aman", candidateB: "Bhavna", candidateC: "Charu", totalValidVotes: 30000, candidateRatioA: 5, candidateRatioB: 3, candidateRatioC: 2 };
  if (qlId === "RAP-QL-1516") return { constituencyName: "a ward", candidateA: "Ravi", candidateB: "Sunita", candidateRatioA: 7, candidateRatioB: 5 };
  if (qlId === "RAP-QL-1517") return { candidateA: "Aman", candidateB: "Bhavna", percentA: 55, percentB: 45 };
  if (qlId === "RAP-QL-1518") return { candidateA: "Aman", candidateB: "Bhavna", totalValidVotes: 21000, morePercent: 10 };
  if (qlId === "RAP-QL-1519") return { candidateA: "Aman", candidateB: "Bhavna", candidateRatioA: 5, candidateRatioB: 3 };
  if (qlId === "RAP-QL-1520") return { constituencyName: "a constituency", candidateA: "Aman", candidateB: "Bhavna", candidateVotes: 14000, candidateRatioA: 7, candidateRatioB: 5, turnoutPercent: 80, validPercent: 75 };
  if (qlId === "RAP-QL-1521") return { candidateA: "Company A", candidateB: "Company B", totalMarket: 120000, candidateRatioA: 5, candidateRatioB: 3 };
  if (qlId === "RAP-QL-1522") return { candidateA: "yes responses", candidateB: "no responses", totalResponses: 18000, candidateRatioA: 5, candidateRatioB: 4 };
  if (qlId === "RAP-QL-1523") return { constituencyName: "a constituency", totalVoters: 50000, turnoutPercent: 60, notaPercent: 4 };
  if (qlId === "RAP-QL-1524") return { constituencyName: "a ward", totalVoters: 50000, totalValidVotes: 36000, validPercent: 90 };
  if (qlId === "RAP-QL-1525") return { constituencyName: "a constituency", candidateA: "Aman", candidateB: "Bhavna", winningMargin: 1800, candidateRatioA: 7, candidateRatioB: 5, turnoutPercent: 75, invalidPercent: 10 };
  if (qlId === "RAP-QL-1601") {
    return { ...pick(GEOMETRIC_CASES.sideArea, `${seed}:geometricSideArea`) };
  }
  if (qlId === "RAP-QL-1602") {
    return { ...pick(GEOMETRIC_CASES.sideVolume, `${seed}:geometricSideVolume`) };
  }
  if (qlId === "RAP-QL-1603" || qlId === "RAP-QL-1606") {
    return { ...pick(GEOMETRIC_CASES.areaSide, `${seed}:geometricAreaSide`) };
  }
  if (qlId === "RAP-QL-1604") {
    return { ...pick(GEOMETRIC_CASES.volumeSurface, `${seed}:geometricVolumeSurface`) };
  }
  if (qlId === "RAP-QL-1605") {
    return { ...pick(GEOMETRIC_CASES.radiusArea, `${seed}:geometricRadiusArea`) };
  }
  if (qlId === "RAP-QL-1607") return { shapeName: "similar triangles", sideRatioA: 3, sideRatioB: 4 };
  if (qlId === "RAP-QL-1608") return { shapeName: "cubes", sideRatioA: 2, sideRatioB: 5 };
  if (qlId === "RAP-QL-1609") return { shapeName: "spheres", sideRatioA: 3, sideRatioB: 5 };
  if (qlId === "RAP-QL-1610") return { shapeName: "similar triangles", areaRatioA: 49, areaRatioB: 64 };
  if (qlId === "RAP-QL-1611") return { shapeName: "circles", areaRatioA: 25, areaRatioB: 36 };
  if (qlId === "RAP-QL-1612") return { shapeName: "cubes", volumeRatioA: 8, volumeRatioB: 27 };
  if (qlId === "RAP-QL-1613") return { shapeName: "spheres", volumeRatioA: 27, volumeRatioB: 64 };
  if (qlId === "RAP-QL-1614") return { mapName: "map", scaleRatioA: 2, scaleRatioB: 5 };
  if (qlId === "RAP-QL-1615") return { mapName: "map", areaRatioA: 36, areaRatioB: 49 };
  if (qlId === "RAP-QL-1616") return { shapeName: "similar solids", surfaceAreaRatioA: 4, surfaceAreaRatioB: 9 };
  if (qlId === "RAP-QL-1617") return { shapeName: "similar solids", sideRatioA: 2, sideRatioB: 3 };

  if (qlId === "RAP-QL-901" || qlId === "RAP-QL-902") {
    const selected = pick(AGE_CASES.future, `${seed}:future`);
    return { ...selected, targetPerson: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-911" || qlId === "RAP-QL-912") {
    const selected = pick(AGE_CASES.future, `${seed}:futureTarget`);
    return { ...selected, targetPerson: qlId === "RAP-QL-911" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-903") {
    const selected = pick(AGE_CASES.past, `${seed}:past`);
    return { ...selected, targetPerson: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-913" || qlId === "RAP-QL-914") {
    const selected = pick(AGE_CASES.past, `${seed}:pastTarget`);
    return { ...selected, targetPerson: qlId === "RAP-QL-913" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-904" || qlId === "RAP-QL-906") {
    return { ...pick(AGE_CASES.years, `${seed}:years`) };
  }
  if (qlId === "RAP-QL-915") {
    return { personA: "father", personB: "son", presentAgeA: 40, presentAgeB: 16, pastRatioA: 3, pastRatioB: 1 };
  }
  if (qlId === "RAP-QL-905") {
    const selected = pick(AGE_CASES.difference, `${seed}:difference`);
    return { ...selected, targetPerson: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-916" || qlId === "RAP-QL-917") {
    const selected = pick(AGE_CASES.difference, `${seed}:differenceTarget`);
    return { ...selected, targetPerson: qlId === "RAP-QL-916" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-907") {
    const selected = pick(AGE_CASES.sum, `${seed}:sum`);
    return { ...selected, targetPerson: targetPerson === "personA" ? selected.personA : selected.personB };
  }
  if (qlId === "RAP-QL-918") {
    const selected = pick(AGE_CASES.sum, `${seed}:sumTarget`);
    return { ...selected, targetPerson: selected.personA };
  }
  if (qlId === "RAP-QL-908" || qlId === "RAP-QL-909") {
    return { ...pick(AGE_CASES.presentRatio, `${seed}:presentRatio`) };
  }
  if (qlId === "RAP-QL-925" || qlId === "RAP-QL-926") {
    return { ...pick(AGE_CASES.presentRatio, `${seed}:presentRatioMore`) };
  }
  if (qlId === "RAP-QL-919") {
    const selected = pick(AGE_CASES.threePerson, `${seed}:threeMiddle`);
    return { ...selected, targetPerson: selected.personB };
  }
  if (qlId === "RAP-QL-920") {
    return { personA: "Aman", personB: "Bhavna", personC: "Charu", ratioA: 3, ratioB: 4, ratioC: 5, knownPerson: "Charu", knownAge: 40, targetPerson: "Bhavna" };
  }
  if (qlId === "RAP-QL-921") {
    return { personA: "Aman", personB: "Bhavna", ratioA: 5, ratioB: 4, averageAge: 27, targetPerson: "Aman" };
  }
  if (qlId === "RAP-QL-922") {
    return { personA: "Aman", personB: "Bhavna", personC: "Charu", ratioA: 2, ratioB: 3, ratioC: 4, averageAge: 24, targetPerson: "Charu" };
  }
  if (qlId === "RAP-QL-923") {
    return { personA: "Aman", personB: "Bhavna", ratioA: 5, ratioB: 4, shiftYears: 6, futureSum: 66, targetPerson: "Aman" };
  }
  if (qlId === "RAP-QL-924") {
    return { personA: "Ravi", personB: "Sunita", ratioA: 7, ratioB: 5, shiftYears: 4, pastSum: 52, targetPerson: "Sunita" };
  }
  if (qlId === "RAP-QL-927") {
    return { personA: "father", personB: "son", ratioA: 7, ratioB: 2, shiftYears: 15, relationFactor: 2, targetPerson: "son" };
  }
  if (qlId === "RAP-QL-928") {
    return { personA: "father", personB: "son", ratioA: 7, ratioB: 2, shiftYears: 5, futureRatioA: 8, futureRatioB: 3, targetPerson: "son" };
  }
  if (qlId === "RAP-QL-929") {
    return { personA: "mother", personB: "daughter", ratioA: 4, ratioB: 1, shiftYears: 6, pastRatioA: 10, pastRatioB: 1, targetPerson: "daughter" };
  }
  if (qlId === "RAP-QL-930") {
    return { personA: "elder sister", personB: "younger brother", ratioA: 5, ratioB: 3, shiftYears: 8, futureRatioA: 7, futureRatioB: 5, targetPerson: "elder sister" };
  }
  const selected = pick(AGE_CASES.threePerson, `${seed}:threePerson`);
  const targetIndex = stableBucket(`${seed}:targetThree`, 3);
  const targetThreePerson = targetIndex === 0 ? selected.personA : targetIndex === 1 ? selected.personB : selected.personC;
  return { ...selected, targetPerson: targetThreePerson };
}

export function generateRap003Parameters(input: Rap003ParameterInput = {}): Rap003Parameters {
  const cpId = input.canonicalProblemId ?? "RAP-CP-014";
  if (cpId !== "RAP-CP-013" && cpId !== "RAP-CP-014" && cpId !== "RAP-CP-015" && cpId !== "RAP-CP-016" && cpId !== "RAP-CP-017" && cpId !== "RAP-CP-018" && cpId !== "RAP-CP-019" && cpId !== "RAP-CP-020" && cpId !== "RAP-CP-021" && cpId !== "RAP-CP-022") throw new Error(`RAP-003 MVP currently supports RAP-CP-013 through RAP-CP-022. Received ${cpId}.`);

  const seed = input.seed ?? `RAP-003:${cpId}`;
  const language = input.language ?? "en";
  const qlId = pickQl(cpId, seed, input.questionLanguageId);
  const registry = getRap003RegistryEntry(qlId);
  const difficulty: Rap003DifficultyBand = input.difficultyBand ?? registry.difficulty;
  const variables = diversifyVariables(qlId, seed, variablesForQl(qlId, seed));

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
