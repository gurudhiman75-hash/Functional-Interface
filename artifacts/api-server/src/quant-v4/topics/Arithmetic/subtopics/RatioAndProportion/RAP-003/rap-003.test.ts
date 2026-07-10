import { strict as assert } from "node:assert";
import { getRap003QuestionLanguageIds, validateRap003Libraries } from "./library";
import { generateRap003Parameters } from "./parameter-generator";
import { runRap003Cp013ForLanguages, runRap003Cp013Pipeline, runRap003Cp014ForLanguages, runRap003Cp014Pipeline, runRap003Cp015ForLanguages, runRap003Cp015Pipeline, runRap003Cp016ForLanguages, runRap003Cp016Pipeline, runRap003Cp017ForLanguages, runRap003Cp017Pipeline, runRap003Cp018ForLanguages, runRap003Cp018Pipeline, runRap003Cp019ForLanguages, runRap003Cp019Pipeline, runRap003Cp020ForLanguages, runRap003Cp020Pipeline, runRap003Cp021ForLanguages, runRap003Cp021Pipeline, runRap003Cp022ForLanguages, runRap003Cp022Pipeline } from "./pipeline";
import { solveRap003 } from "./solver";

const libraryValidation = validateRap003Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

const fixedPartnership = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-013",
  seed: "rap-003-fixed-partnership",
  questionLanguageId: "RAP-QL-801",
  difficultyBand: "Easy",
});
fixedPartnership.variables = {
  personA: "Aman",
  personB: "Bhavna",
  investmentA: 40000,
  investmentB: 60000,
  timeA: 12,
  timeB: 12,
  totalProfit: 15000,
  targetPartner: "Aman",
};
assert.equal(solveRap003(fixedPartnership).answer, "$$6000$$");

const fixedJoining = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-013",
  seed: "rap-003-fixed-joining",
  questionLanguageId: "RAP-QL-802",
  difficultyBand: "Medium",
});
fixedJoining.variables = {
  personA: "Aman",
  personB: "Bhavna",
  investmentA: 50000,
  investmentB: 70000,
  timeA: 12,
  timeB: 8,
  totalProfit: 29000,
  targetPartner: "Bhavna",
};
assert.equal(solveRap003(fixedJoining).answer, "$$14000$$");

const fixedMidChange = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-013",
  seed: "rap-003-fixed-mid-change",
  questionLanguageId: "RAP-QL-803",
  difficultyBand: "Hard",
});
fixedMidChange.variables = {
  personA: "Aman",
  personB: "Bhavna",
  initialInvestmentA: 30000,
  changedInvestmentA: 20000,
  investmentB: 40000,
  firstPeriod: 6,
  secondPeriod: 6,
  timeB: 12,
  totalProfit: 26000,
  targetPartner: "Aman",
};
assert.equal(solveRap003(fixedMidChange).answer, "$$10000$$");

const fixedFuture = generateRap003Parameters({
  seed: "rap-003-fixed-future",
  questionLanguageId: "RAP-QL-901",
  difficultyBand: "Medium",
});
fixedFuture.variables = {
  personA: "father",
  personB: "son",
  ratioA: 5,
  ratioB: 2,
  shiftYears: 10,
  futureRatioA: 2,
  futureRatioB: 1,
  targetPerson: "father",
};
assert.equal(solveRap003(fixedFuture).answer, "$$50$$");

const fixedPast = generateRap003Parameters({
  seed: "rap-003-fixed-past",
  questionLanguageId: "RAP-QL-903",
  difficultyBand: "Hard",
});
fixedPast.variables = {
  personA: "father",
  personB: "son",
  ratioA: 3,
  ratioB: 1,
  shiftYears: 8,
  pastRatioA: 5,
  pastRatioB: 1,
  targetPerson: "son",
};
assert.equal(solveRap003(fixedPast).answer, "$$16$$");

const fixedYears = generateRap003Parameters({
  seed: "rap-003-fixed-years",
  questionLanguageId: "RAP-QL-904",
  difficultyBand: "Medium",
});
fixedYears.variables = {
  personA: "A",
  personB: "B",
  presentAgeA: 30,
  presentAgeB: 18,
  futureRatioA: 7,
  futureRatioB: 5,
};
assert.equal(solveRap003(fixedYears).answer, "$$12$$");

const fixedDifference = generateRap003Parameters({
  seed: "rap-003-fixed-difference",
  questionLanguageId: "RAP-QL-905",
  difficultyBand: "Easy",
});
fixedDifference.variables = {
  personA: "father",
  personB: "son",
  ratioA: 5,
  ratioB: 2,
  ageDifference: 30,
  targetPerson: "father",
};
assert.equal(solveRap003(fixedDifference).answer, "$$50$$");

const fixedAgeSum = generateRap003Parameters({
  seed: "rap-003-fixed-age-sum",
  questionLanguageId: "RAP-QL-907",
  difficultyBand: "Easy",
});
fixedAgeSum.variables = {
  personA: "Aman",
  personB: "Bhavna",
  ratioA: 5,
  ratioB: 4,
  ageSum: 45,
  targetPerson: "Aman",
};
assert.equal(solveRap003(fixedAgeSum).answer, "$$25$$");

const fixedFutureRatio = generateRap003Parameters({
  seed: "rap-003-fixed-age-future-ratio",
  questionLanguageId: "RAP-QL-908",
  difficultyBand: "Easy",
});
fixedFutureRatio.variables = {
  personA: "Aman",
  personB: "Bhavna",
  presentAgeA: 24,
  presentAgeB: 18,
  shiftYears: 6,
};
assert.equal(solveRap003(fixedFutureRatio).answer, "$$5 : 4$$");

const fixedPastRatio = generateRap003Parameters({
  seed: "rap-003-fixed-age-past-ratio",
  questionLanguageId: "RAP-QL-909",
  difficultyBand: "Medium",
});
fixedPastRatio.variables = {
  personA: "Aman",
  personB: "Bhavna",
  presentAgeA: 24,
  presentAgeB: 18,
  shiftYears: 6,
};
assert.equal(solveRap003(fixedPastRatio).answer, "$$3 : 2$$");

const fixedThreePersonAge = generateRap003Parameters({
  seed: "rap-003-fixed-age-three-person",
  questionLanguageId: "RAP-QL-910",
  difficultyBand: "Medium",
});
fixedThreePersonAge.variables = {
  personA: "A",
  personB: "B",
  personC: "C",
  ratioA: 2,
  ratioB: 3,
  ratioC: 4,
  ageSum: 54,
  targetPerson: "C",
};
assert.equal(solveRap003(fixedThreePersonAge).answer, "$$24$$");

const fixedSavingsRatio = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-015",
  seed: "rap-003-fixed-savings-ratio",
  questionLanguageId: "RAP-QL-951",
  difficultyBand: "Medium",
});
fixedSavingsRatio.variables = {
  personA: "Aman",
  personB: "Bhavna",
  incomeRatioA: 5,
  incomeRatioB: 4,
  expenditureRatioA: 3,
  expenditureRatioB: 2,
  incomeUnit: 6000,
  expenditureUnit: 7000,
};
assert.equal(solveRap003(fixedSavingsRatio).answer, "$$9 : 10$$");

const fixedEqualSavings = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-015",
  seed: "rap-003-fixed-equal-savings",
  questionLanguageId: "RAP-QL-952",
  difficultyBand: "Medium",
});
fixedEqualSavings.variables = {
  personA: "Aman",
  personB: "Bhavna",
  incomeRatioA: 3,
  incomeRatioB: 4,
  expenditureRatioA: 2,
  expenditureRatioB: 3,
  givenIncomeA: 30000,
  targetPerson: "Bhavna",
};
assert.equal(solveRap003(fixedEqualSavings).answer, "$$10000$$");

const fixedIncomeFromSavings = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-015",
  seed: "rap-003-fixed-income-from-savings",
  questionLanguageId: "RAP-QL-953",
  difficultyBand: "Hard",
});
fixedIncomeFromSavings.variables = {
  personA: "Aman",
  personB: "Bhavna",
  incomeRatioA: 5,
  incomeRatioB: 7,
  expenditureRatioA: 3,
  expenditureRatioB: 4,
  savingsRatioA: 2,
  savingsRatioB: 3,
  givenExpenditureB: 20000,
  targetPerson: "Bhavna",
};
assert.equal(solveRap003(fixedIncomeFromSavings).answer, "$$35000$$");

const fixedExpenditureFromSavings = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-015",
  seed: "rap-003-fixed-expenditure-from-savings",
  questionLanguageId: "RAP-QL-954",
  difficultyBand: "Hard",
});
fixedExpenditureFromSavings.variables = {
  personA: "Aman",
  personB: "Bhavna",
  incomeRatioA: 5,
  incomeRatioB: 7,
  expenditureRatioA: 3,
  expenditureRatioB: 4,
  savingsRatioA: 2,
  savingsRatioB: 3,
  givenIncomeA: 25000,
  targetPerson: "Aman",
};
assert.equal(solveRap003(fixedExpenditureFromSavings).answer, "$$15000$$");

const fixedAlligation = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-016",
  seed: "rap-003-fixed-alligation",
  questionLanguageId: "RAP-QL-1001",
  difficultyBand: "Medium",
});
fixedAlligation.variables = {
  mixtureA: "Alloy A",
  mixtureB: "Alloy B",
  component: "gold",
  percentA: 40,
  percentB: 20,
  targetPercent: 30,
};
assert.equal(solveRap003(fixedAlligation).answer, "$$1 : 1$$");

const fixedWeightedBlend = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-016",
  seed: "rap-003-fixed-weighted-blend",
  questionLanguageId: "RAP-QL-1002",
  difficultyBand: "Medium",
});
fixedWeightedBlend.variables = {
  mixtureA: "Alloy A",
  mixtureB: "Alloy B",
  component: "gold",
  percentA: 40,
  percentB: 20,
  quantityA: 30,
  quantityB: 20,
};
assert.equal(solveRap003(fixedWeightedBlend).answer, "$$32%$$");

const fixedThreeSource = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-016",
  seed: "rap-003-fixed-three-source",
  questionLanguageId: "RAP-QL-1003",
  difficultyBand: "Hard",
});
fixedThreeSource.variables = {
  mixtureA: "Alloy A",
  mixtureB: "Alloy B",
  mixtureC: "Alloy C",
  component: "gold",
  ratioAComponent: 2,
  ratioAOther: 3,
  ratioBComponent: 3,
  ratioBOther: 7,
  ratioCComponent: 1,
  ratioCOther: 4,
};
assert.equal(solveRap003(fixedThreeSource).answer, "$$3 : 7$$");

const fixedReplacementRatio = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-017",
  seed: "rap-003-fixed-replacement-ratio",
  questionLanguageId: "RAP-QL-1101",
  difficultyBand: "Medium",
});
fixedReplacementRatio.variables = {
  vesselName: "A vessel",
  liquidA: "milk",
  liquidB: "water",
  initialVolume: 40,
  removedVolume: 4,
  replacementCount: 2,
};
assert.equal(solveRap003(fixedReplacementRatio).answer, "$$81 : 19$$");

const fixedReplacementQuantity = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-017",
  seed: "rap-003-fixed-replacement-quantity",
  questionLanguageId: "RAP-QL-1102",
  difficultyBand: "Medium",
});
fixedReplacementQuantity.variables = {
  vesselName: "A vessel",
  liquidA: "milk",
  liquidB: "water",
  initialVolume: 50,
  removedVolume: 5,
  replacementCount: 2,
};
assert.equal(solveRap003(fixedReplacementQuantity).answer, "$$40.5$$");

const fixedReplacementIterations = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-017",
  seed: "rap-003-fixed-replacement-iterations",
  questionLanguageId: "RAP-QL-1103",
  difficultyBand: "Hard",
});
fixedReplacementIterations.variables = {
  vesselName: "A container",
  liquidA: "wine",
  liquidB: "water",
  initialVolume: 80,
  removedVolume: 8,
  finalRatioA: 729,
  finalRatioB: 271,
};
assert.equal(solveRap003(fixedReplacementIterations).answer, "$$3$$");

const fixedDenominationTotal = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-018",
  seed: "rap-003-fixed-denomination-total",
  questionLanguageId: "RAP-QL-1201",
  difficultyBand: "Easy",
});
fixedDenominationTotal.variables = {
  itemName: "coins",
  denominationA: 1,
  denominationB: 2,
  denominationC: 5,
  ratioA: 3,
  ratioB: 4,
  ratioC: 5,
  commonUnit: 10,
};
assert.equal(solveRap003(fixedDenominationTotal).answer, "$$360$$");

const fixedDenominationCounts = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-018",
  seed: "rap-003-fixed-denomination-counts",
  questionLanguageId: "RAP-QL-1202",
  difficultyBand: "Medium",
});
fixedDenominationCounts.variables = {
  itemName: "coins",
  denominationA: 1,
  denominationB: 2,
  denominationC: 5,
  ratioA: 3,
  ratioB: 4,
  ratioC: 5,
  totalValue: 360,
  targetDenomination: 5,
};
assert.equal(solveRap003(fixedDenominationCounts).answer, "$$50$$");

const fixedDenominationTargetCount = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-018",
  seed: "rap-003-fixed-denomination-target-count",
  questionLanguageId: "RAP-QL-1203",
  difficultyBand: "Medium",
});
fixedDenominationTargetCount.variables = {
  itemName: "coins",
  denominationA: 1,
  denominationB: 2,
  denominationC: 5,
  ratioA: 3,
  ratioB: 4,
  ratioC: 5,
  commonUnit: 10,
  targetDenomination: 2,
};
assert.equal(solveRap003(fixedDenominationTargetCount).answer, "$$40$$");

const fixedDenominationSwap = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-018",
  seed: "rap-003-fixed-denomination-swap",
  questionLanguageId: "RAP-QL-1204",
  difficultyBand: "Hard",
});
fixedDenominationSwap.variables = {
  itemName: "coins",
  denominationA: 1,
  denominationB: 2,
  denominationC: 5,
  ratioA: 3,
  ratioB: 4,
  ratioC: 5,
  commonUnit: 10,
  fromDenomination: 1,
  toDenomination: 5,
  swapCount: 6,
};
assert.equal(solveRap003(fixedDenominationSwap).answer, "$$384$$");

const fixedFourDenominationTotal = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-018",
  seed: "rap-003-fixed-four-denomination-total",
  questionLanguageId: "RAP-QL-1205",
  difficultyBand: "Hard",
});
fixedFourDenominationTotal.variables = {
  itemName: "notes",
  denominationA: 5,
  denominationB: 10,
  denominationC: 20,
  denominationD: 50,
  ratioA: 2,
  ratioB: 3,
  ratioC: 4,
  ratioD: 1,
  commonUnit: 6,
};
assert.equal(solveRap003(fixedFourDenominationTotal).answer, "$$1020$$");

const fixedFourDenominationCount = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-018",
  seed: "rap-003-fixed-four-denomination-count",
  questionLanguageId: "RAP-QL-1206",
  difficultyBand: "Hard",
});
fixedFourDenominationCount.variables = {
  itemName: "notes",
  denominationA: 5,
  denominationB: 10,
  denominationC: 20,
  denominationD: 50,
  ratioA: 2,
  ratioB: 3,
  ratioC: 4,
  ratioD: 1,
  totalValue: 1020,
  targetDenomination: 20,
};
assert.equal(solveRap003(fixedFourDenominationCount).answer, "$$24$$");

const fixedSdtTimeRatio = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-019",
  seed: "rap-003-fixed-sdt-time-ratio",
  questionLanguageId: "RAP-QL-1301",
  difficultyBand: "Medium",
});
fixedSdtTimeRatio.variables = {
  objectA: "Train A",
  objectB: "Train B",
  speedRatioA: 3,
  speedRatioB: 4,
  distanceRatioA: 2,
  distanceRatioB: 3,
};
assert.equal(solveRap003(fixedSdtTimeRatio).answer, "$$8 : 9$$");

const fixedSdtDistanceRatio = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-019",
  seed: "rap-003-fixed-sdt-distance-ratio",
  questionLanguageId: "RAP-QL-1302",
  difficultyBand: "Easy",
});
fixedSdtDistanceRatio.variables = {
  objectA: "Train A",
  objectB: "Train B",
  speedRatioA: 5,
  speedRatioB: 4,
  timeRatioA: 3,
  timeRatioB: 2,
};
assert.equal(solveRap003(fixedSdtDistanceRatio).answer, "$$15 : 8$$");

const fixedSdtSpeedRatio = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-019",
  seed: "rap-003-fixed-sdt-speed-ratio",
  questionLanguageId: "RAP-QL-1303",
  difficultyBand: "Medium",
});
fixedSdtSpeedRatio.variables = {
  objectA: "Train A",
  objectB: "Train B",
  distanceRatioA: 9,
  distanceRatioB: 8,
  timeRatioA: 3,
  timeRatioB: 4,
};
assert.equal(solveRap003(fixedSdtSpeedRatio).answer, "$$3 : 2$$");

const fixedSdtRaceLead = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-019",
  seed: "rap-003-fixed-sdt-race-lead",
  questionLanguageId: "RAP-QL-1304",
  difficultyBand: "Medium",
});
fixedSdtRaceLead.variables = {
  objectA: "Aman",
  objectB: "Bhavna",
  trackDistance: 400,
  speedRatioA: 5,
  speedRatioB: 4,
};
assert.equal(solveRap003(fixedSdtRaceLead).answer, "$$80$$");

const fixedSdtOvertake = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-019",
  seed: "rap-003-fixed-sdt-overtake",
  questionLanguageId: "RAP-QL-1305",
  difficultyBand: "Hard",
});
fixedSdtOvertake.variables = {
  objectA: "Runner A",
  objectB: "Runner B",
  speedA: 54,
  speedB: 36,
  leadDistance: 100,
};
assert.equal(solveRap003(fixedSdtOvertake).answer, "$$20$$");

const fixedPopulationCell = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-020",
  seed: "rap-003-fixed-population-cell",
  questionLanguageId: "RAP-QL-1401",
  difficultyBand: "Medium",
});
fixedPopulationCell.variables = {
  regionName: "a village",
  totalPopulation: 18000,
  maleRatio: 5,
  femaleRatio: 4,
  maleLiterateRatio: 3,
  maleIlliterateRatio: 2,
  femaleLiterateRatio: 5,
  femaleIlliterateRatio: 3,
  targetGroup: "male",
  targetLiteracy: "literate",
  targetCellLabel: "literate males",
};
assert.equal(solveRap003(fixedPopulationCell).answer, "$$6000$$");

const fixedPopulationTotalLiterate = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-020",
  seed: "rap-003-fixed-population-total-literate",
  questionLanguageId: "RAP-QL-1402",
  difficultyBand: "Easy",
});
fixedPopulationTotalLiterate.variables = {
  regionName: "a village",
  totalPopulation: 18000,
  maleRatio: 5,
  femaleRatio: 4,
  maleLiterateRatio: 3,
  maleIlliterateRatio: 2,
  femaleLiterateRatio: 5,
  femaleIlliterateRatio: 3,
};
assert.equal(solveRap003(fixedPopulationTotalLiterate).answer, "$$11000$$");

const fixedPopulationPercent = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-020",
  seed: "rap-003-fixed-population-percent",
  questionLanguageId: "RAP-QL-1403",
  difficultyBand: "Medium",
});
fixedPopulationPercent.variables = {
  regionName: "a village",
  totalPopulation: 18000,
  maleRatio: 5,
  femaleRatio: 4,
  maleLiterateRatio: 3,
  maleIlliterateRatio: 2,
  femaleLiterateRatio: 5,
  femaleIlliterateRatio: 3,
};
assert.equal(solveRap003(fixedPopulationPercent).answer, "$$61.1111%$$");

const fixedPopulationRatio = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-020",
  seed: "rap-003-fixed-population-ratio",
  questionLanguageId: "RAP-QL-1404",
  difficultyBand: "Hard",
});
fixedPopulationRatio.variables = {
  regionName: "a village",
  totalPopulation: 18000,
  maleRatio: 5,
  femaleRatio: 4,
  maleLiterateRatio: 3,
  maleIlliterateRatio: 2,
  femaleLiterateRatio: 5,
  femaleIlliterateRatio: 3,
  ratioCellA: "literate males",
  ratioCellB: "literate females",
};
assert.equal(solveRap003(fixedPopulationRatio).answer, "$$6 : 5$$");

const fixedPopulationTotalIlliterate = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-020",
  seed: "rap-003-fixed-population-total-illiterate",
  questionLanguageId: "RAP-QL-1405",
  difficultyBand: "Easy",
});
fixedPopulationTotalIlliterate.variables = {
  regionName: "a village",
  totalPopulation: 18000,
  maleRatio: 5,
  femaleRatio: 4,
  maleLiterateRatio: 3,
  maleIlliterateRatio: 2,
  femaleLiterateRatio: 5,
  femaleIlliterateRatio: 3,
};
assert.equal(solveRap003(fixedPopulationTotalIlliterate).answer, "$$7000$$");

const fixedElectionWinnerVotes = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-021",
  seed: "rap-003-fixed-election-winner",
  questionLanguageId: "RAP-QL-1501",
  difficultyBand: "Easy",
});
fixedElectionWinnerVotes.variables = {
  constituencyName: "a constituency",
  candidateA: "Aman",
  candidateB: "Bhavna",
  totalValidVotes: 10000,
  candidateRatioA: 3,
  candidateRatioB: 2,
};
assert.equal(solveRap003(fixedElectionWinnerVotes).answer, "$$6000$$");

const fixedElectionMargin = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-021",
  seed: "rap-003-fixed-election-margin",
  questionLanguageId: "RAP-QL-1502",
  difficultyBand: "Medium",
});
fixedElectionMargin.variables = {
  constituencyName: "a constituency",
  candidateA: "Aman",
  candidateB: "Bhavna",
  totalVoters: 20000,
  turnoutPercent: 80,
  validPercent: 90,
  candidateRatioA: 5,
  candidateRatioB: 4,
};
assert.equal(solveRap003(fixedElectionMargin).answer, "$$1600$$");

const fixedElectionTotalVoters = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-021",
  seed: "rap-003-fixed-election-total-voters",
  questionLanguageId: "RAP-QL-1503",
  difficultyBand: "Hard",
});
fixedElectionTotalVoters.variables = {
  constituencyName: "a constituency",
  candidateA: "Aman",
  candidateB: "Bhavna",
  turnoutPercent: 75,
  validPercent: 96,
  candidateRatioA: 7,
  candidateRatioB: 5,
  winningMargin: 1200,
};
assert.equal(solveRap003(fixedElectionTotalVoters).answer, "$$10000$$");

const fixedElectionLoserVotes = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-021",
  seed: "rap-003-fixed-election-loser",
  questionLanguageId: "RAP-QL-1504",
  difficultyBand: "Medium",
});
fixedElectionLoserVotes.variables = {
  constituencyName: "a ward",
  candidateA: "Ravi",
  candidateB: "Sunita",
  totalVoters: 50000,
  turnoutPercent: 60,
  validPercent: 80,
  candidateRatioA: 7,
  candidateRatioB: 5,
};
assert.equal(solveRap003(fixedElectionLoserVotes).answer, "$$10000$$");

const fixedElectionInvalidVotes = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-021",
  seed: "rap-003-fixed-election-invalid",
  questionLanguageId: "RAP-QL-1505",
  difficultyBand: "Easy",
});
fixedElectionInvalidVotes.variables = {
  constituencyName: "a constituency",
  totalVoters: 25000,
  turnoutPercent: 80,
  invalidPercent: 10,
};
assert.equal(solveRap003(fixedElectionInvalidVotes).answer, "$$2000$$");

const fixedGeometricArea = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-022",
  seed: "rap-003-fixed-geometric-area",
  questionLanguageId: "RAP-QL-1601",
  difficultyBand: "Easy",
});
fixedGeometricArea.variables = { shapeName: "squares", sideRatioA: 3, sideRatioB: 4 };
assert.equal(solveRap003(fixedGeometricArea).answer, "$$9 : 16$$");

const fixedGeometricVolume = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-022",
  seed: "rap-003-fixed-geometric-volume",
  questionLanguageId: "RAP-QL-1602",
  difficultyBand: "Medium",
});
fixedGeometricVolume.variables = { solidName: "spheres", sideRatioA: 2, sideRatioB: 3 };
assert.equal(solveRap003(fixedGeometricVolume).answer, "$$8 : 27$$");

const fixedGeometricSide = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-022",
  seed: "rap-003-fixed-geometric-side",
  questionLanguageId: "RAP-QL-1603",
  difficultyBand: "Medium",
});
fixedGeometricSide.variables = { shapeName: "squares", areaRatioA: 9, areaRatioB: 16 };
assert.equal(solveRap003(fixedGeometricSide).answer, "$$3 : 4$$");

const fixedGeometricSurface = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-022",
  seed: "rap-003-fixed-geometric-surface",
  questionLanguageId: "RAP-QL-1604",
  difficultyBand: "Hard",
});
fixedGeometricSurface.variables = { solidName: "cubes", volumeRatioA: 27, volumeRatioB: 64 };
assert.equal(solveRap003(fixedGeometricSurface).answer, "$$9 : 16$$");

const fixedGeometricRadius = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-022",
  seed: "rap-003-fixed-geometric-radius",
  questionLanguageId: "RAP-QL-1605",
  difficultyBand: "Easy",
});
fixedGeometricRadius.variables = { shapeName: "circles", radiusRatioA: 2, radiusRatioB: 3 };
assert.equal(solveRap003(fixedGeometricRadius).answer, "$$4 : 9$$");

const seenQlIds = new Set<string>();
for (let index = 0; index < 120; index += 1) {
  const pkg = runRap003Cp014Pipeline({ seed: `rap-003-cp014-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-014");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-901","RAP-QL-902","RAP-QL-903","RAP-QL-904","RAP-QL-905","RAP-QL-906","RAP-QL-907","RAP-QL-908","RAP-QL-909","RAP-QL-910","RAP-QL-911","RAP-QL-912","RAP-QL-913","RAP-QL-914","RAP-QL-915","RAP-QL-916","RAP-QL-917","RAP-QL-918","RAP-QL-919","RAP-QL-920","RAP-QL-921","RAP-QL-922","RAP-QL-923","RAP-QL-924","RAP-QL-925","RAP-QL-926","RAP-QL-927","RAP-QL-928","RAP-QL-929","RAP-QL-930"]) {
  const pkg = runRap003Cp014Pipeline({ seed: `rap-003-cp014-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenQlIds.size, 30, `Expected all 30 CP-014 QLs, got ${seenQlIds.size}`);

const seenPartnershipQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp013Pipeline({ seed: `rap-003-cp013-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-013");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenPartnershipQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-801","RAP-QL-802","RAP-QL-803","RAP-QL-804","RAP-QL-805","RAP-QL-806","RAP-QL-807","RAP-QL-808","RAP-QL-809","RAP-QL-810","RAP-QL-811","RAP-QL-812","RAP-QL-813","RAP-QL-814","RAP-QL-815","RAP-QL-816"]) {
  const pkg = runRap003Cp013Pipeline({ seed: `rap-003-cp013-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenPartnershipQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenPartnershipQlIds.size, 16, `Expected all 16 CP-013 QLs, got ${seenPartnershipQlIds.size}`);

const seenIncomeQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp015Pipeline({ seed: `rap-003-cp015-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-015");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenIncomeQlIds.add(pkg.questionLanguageId);
}

const cp015QlIds = getRap003QuestionLanguageIds("RAP-CP-015");
for (const qlId of cp015QlIds) {
  const pkg = runRap003Cp015Pipeline({ seed: `rap-003-cp015-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenIncomeQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenIncomeQlIds.size, cp015QlIds.length, `Expected all active CP-015 QLs, got ${seenIncomeQlIds.size}`);

const seenAlloyQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp016Pipeline({ seed: `rap-003-cp016-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-016");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenAlloyQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-1001","RAP-QL-1002","RAP-QL-1003","RAP-QL-1004","RAP-QL-1005","RAP-QL-1006","RAP-QL-1007","RAP-QL-1008","RAP-QL-1009","RAP-QL-1010","RAP-QL-1011","RAP-QL-1012","RAP-QL-1013","RAP-QL-1014","RAP-QL-1015","RAP-QL-1016","RAP-QL-1017","RAP-QL-1018","RAP-QL-1019","RAP-QL-1020","RAP-QL-1021","RAP-QL-1022","RAP-QL-1023","RAP-QL-1024","RAP-QL-1025","RAP-QL-1026","RAP-QL-1027","RAP-QL-1028","RAP-QL-1029"]) {
  const pkg = runRap003Cp016Pipeline({ seed: `rap-003-cp016-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenAlloyQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenAlloyQlIds.size, 29, `Expected all 29 CP-016 QLs, got ${seenAlloyQlIds.size}`);

const seenReplacementQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp017Pipeline({ seed: `rap-003-cp017-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-017");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenReplacementQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-1101","RAP-QL-1102","RAP-QL-1103","RAP-QL-1104","RAP-QL-1105","RAP-QL-1106","RAP-QL-1107","RAP-QL-1108","RAP-QL-1109","RAP-QL-1110","RAP-QL-1111","RAP-QL-1112","RAP-QL-1113","RAP-QL-1114","RAP-QL-1115","RAP-QL-1116","RAP-QL-1117","RAP-QL-1118","RAP-QL-1119"]) {
  const pkg = runRap003Cp017Pipeline({ seed: `rap-003-cp017-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenReplacementQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenReplacementQlIds.size, 19, `Expected all 19 CP-017 QLs, got ${seenReplacementQlIds.size}`);

const seenDenominationQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp018Pipeline({ seed: `rap-003-cp018-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-018");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenDenominationQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-1201","RAP-QL-1202","RAP-QL-1203","RAP-QL-1204","RAP-QL-1205","RAP-QL-1206","RAP-QL-1207","RAP-QL-1208","RAP-QL-1209","RAP-QL-1210","RAP-QL-1211","RAP-QL-1212","RAP-QL-1213","RAP-QL-1214","RAP-QL-1215","RAP-QL-1216","RAP-QL-1217","RAP-QL-1218"]) {
  const pkg = runRap003Cp018Pipeline({ seed: `rap-003-cp018-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenDenominationQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenDenominationQlIds.size, 18, `Expected all 18 CP-018 QLs, got ${seenDenominationQlIds.size}`);

const seenSdtQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp019Pipeline({ seed: `rap-003-cp019-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-019");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenSdtQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-1301","RAP-QL-1302","RAP-QL-1303","RAP-QL-1304","RAP-QL-1305","RAP-QL-1306","RAP-QL-1307","RAP-QL-1308","RAP-QL-1309","RAP-QL-1310","RAP-QL-1311","RAP-QL-1312","RAP-QL-1313","RAP-QL-1314","RAP-QL-1315","RAP-QL-1316","RAP-QL-1317","RAP-QL-1318","RAP-QL-1319","RAP-QL-1320","RAP-QL-1321","RAP-QL-1322","RAP-QL-1323","RAP-QL-1324","RAP-QL-1325"]) {
  const pkg = runRap003Cp019Pipeline({ seed: `rap-003-cp019-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true, `${qlId}: ${pkg.answer}; ${JSON.stringify(pkg.parameters.variables)}; ${pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; ")}`);
  seenSdtQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenSdtQlIds.size, 25, `Expected all 25 CP-019 QLs, got ${seenSdtQlIds.size}`);

const seenPopulationQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp020Pipeline({ seed: `rap-003-cp020-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-020");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenPopulationQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-1401","RAP-QL-1402","RAP-QL-1403","RAP-QL-1404","RAP-QL-1405","RAP-QL-1406","RAP-QL-1407","RAP-QL-1408","RAP-QL-1409","RAP-QL-1410","RAP-QL-1411","RAP-QL-1412","RAP-QL-1413","RAP-QL-1414","RAP-QL-1415","RAP-QL-1416","RAP-QL-1417","RAP-QL-1418","RAP-QL-1419","RAP-QL-1420"]) {
  const pkg = runRap003Cp020Pipeline({ seed: `rap-003-cp020-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenPopulationQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenPopulationQlIds.size, 20, `Expected all 20 CP-020 QLs, got ${seenPopulationQlIds.size}`);

const seenElectionQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp021Pipeline({ seed: `rap-003-cp021-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-021");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenElectionQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-1501","RAP-QL-1502","RAP-QL-1503","RAP-QL-1504","RAP-QL-1505","RAP-QL-1506","RAP-QL-1507","RAP-QL-1508","RAP-QL-1509","RAP-QL-1510","RAP-QL-1511","RAP-QL-1512","RAP-QL-1513","RAP-QL-1514","RAP-QL-1515","RAP-QL-1516","RAP-QL-1517","RAP-QL-1518","RAP-QL-1519","RAP-QL-1520","RAP-QL-1521","RAP-QL-1522","RAP-QL-1523","RAP-QL-1524","RAP-QL-1525"]) {
  const pkg = runRap003Cp021Pipeline({ seed: `rap-003-cp021-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true, `${qlId}: ${pkg.answer}; ${JSON.stringify(pkg.parameters.variables)}; ${pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; ")}`);
  seenElectionQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenElectionQlIds.size, 25, `Expected all 25 CP-021 QLs, got ${seenElectionQlIds.size}`);

const seenGeometricQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp022Pipeline({ seed: `rap-003-cp022-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-022");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenGeometricQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-1601", "RAP-QL-1602", "RAP-QL-1603", "RAP-QL-1604", "RAP-QL-1605", "RAP-QL-1606", "RAP-QL-1607", "RAP-QL-1608", "RAP-QL-1609", "RAP-QL-1610", "RAP-QL-1611", "RAP-QL-1612", "RAP-QL-1613", "RAP-QL-1614", "RAP-QL-1615", "RAP-QL-1616", "RAP-QL-1617"]) {
  const pkg = runRap003Cp022Pipeline({ seed: `rap-003-cp022-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenGeometricQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenGeometricQlIds.size, 17, `Expected all 17 CP-022 QLs, got ${seenGeometricQlIds.size}`);

for (const qlId of ["RAP-QL-901","RAP-QL-902","RAP-QL-903","RAP-QL-904","RAP-QL-905","RAP-QL-906","RAP-QL-907","RAP-QL-908","RAP-QL-909","RAP-QL-910","RAP-QL-911","RAP-QL-912","RAP-QL-913","RAP-QL-914","RAP-QL-915","RAP-QL-916","RAP-QL-917","RAP-QL-918","RAP-QL-919","RAP-QL-920","RAP-QL-921","RAP-QL-922","RAP-QL-923","RAP-QL-924","RAP-QL-925","RAP-QL-926","RAP-QL-927","RAP-QL-928","RAP-QL-929","RAP-QL-930"]) {
  const packages = runRap003Cp014ForLanguages({ seed: `rap-003-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-801","RAP-QL-802","RAP-QL-803","RAP-QL-804","RAP-QL-805","RAP-QL-806","RAP-QL-807","RAP-QL-808","RAP-QL-809","RAP-QL-810","RAP-QL-811","RAP-QL-812","RAP-QL-813","RAP-QL-814","RAP-QL-815","RAP-QL-816"]) {
  const packages = runRap003Cp013ForLanguages({ seed: `rap-003-partnership-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of cp015QlIds) {
  const packages = runRap003Cp015ForLanguages({ seed: `rap-003-income-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-1001","RAP-QL-1002","RAP-QL-1003","RAP-QL-1004","RAP-QL-1005","RAP-QL-1006","RAP-QL-1007","RAP-QL-1008","RAP-QL-1009","RAP-QL-1010","RAP-QL-1011","RAP-QL-1012","RAP-QL-1013","RAP-QL-1014","RAP-QL-1015","RAP-QL-1016","RAP-QL-1017","RAP-QL-1018","RAP-QL-1019","RAP-QL-1020","RAP-QL-1021","RAP-QL-1022","RAP-QL-1023","RAP-QL-1024","RAP-QL-1025","RAP-QL-1026","RAP-QL-1027","RAP-QL-1028","RAP-QL-1029"]) {
  const packages = runRap003Cp016ForLanguages({ seed: `rap-003-alloy-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-1101","RAP-QL-1102","RAP-QL-1103","RAP-QL-1104","RAP-QL-1105","RAP-QL-1106","RAP-QL-1107","RAP-QL-1108","RAP-QL-1109","RAP-QL-1110","RAP-QL-1111","RAP-QL-1112","RAP-QL-1113","RAP-QL-1114","RAP-QL-1115","RAP-QL-1116","RAP-QL-1117","RAP-QL-1118","RAP-QL-1119"]) {
  const packages = runRap003Cp017ForLanguages({ seed: `rap-003-replacement-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-1201","RAP-QL-1202","RAP-QL-1203","RAP-QL-1204","RAP-QL-1205","RAP-QL-1206","RAP-QL-1207","RAP-QL-1208","RAP-QL-1209","RAP-QL-1210","RAP-QL-1211","RAP-QL-1212","RAP-QL-1213","RAP-QL-1214","RAP-QL-1215","RAP-QL-1216","RAP-QL-1217","RAP-QL-1218"]) {
  const packages = runRap003Cp018ForLanguages({ seed: `rap-003-denomination-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-1301","RAP-QL-1302","RAP-QL-1303","RAP-QL-1304","RAP-QL-1305","RAP-QL-1306","RAP-QL-1307","RAP-QL-1308","RAP-QL-1309","RAP-QL-1310","RAP-QL-1311","RAP-QL-1312","RAP-QL-1313","RAP-QL-1314","RAP-QL-1315","RAP-QL-1316","RAP-QL-1317","RAP-QL-1318","RAP-QL-1319","RAP-QL-1320","RAP-QL-1321","RAP-QL-1322","RAP-QL-1323","RAP-QL-1324","RAP-QL-1325"]) {
  const packages = runRap003Cp019ForLanguages({ seed: `rap-003-sdt-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-1401","RAP-QL-1402","RAP-QL-1403","RAP-QL-1404","RAP-QL-1405","RAP-QL-1406","RAP-QL-1407","RAP-QL-1408","RAP-QL-1409","RAP-QL-1410","RAP-QL-1411","RAP-QL-1412","RAP-QL-1413","RAP-QL-1414","RAP-QL-1415","RAP-QL-1416","RAP-QL-1417","RAP-QL-1418","RAP-QL-1419","RAP-QL-1420"]) {
  const packages = runRap003Cp020ForLanguages({ seed: `rap-003-population-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-1501","RAP-QL-1502","RAP-QL-1503","RAP-QL-1504","RAP-QL-1505","RAP-QL-1506","RAP-QL-1507","RAP-QL-1508","RAP-QL-1509","RAP-QL-1510","RAP-QL-1511","RAP-QL-1512","RAP-QL-1513","RAP-QL-1514","RAP-QL-1515","RAP-QL-1516","RAP-QL-1517","RAP-QL-1518","RAP-QL-1519","RAP-QL-1520","RAP-QL-1521","RAP-QL-1522","RAP-QL-1523","RAP-QL-1524","RAP-QL-1525"]) {
  const packages = runRap003Cp021ForLanguages({ seed: `rap-003-election-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-1601", "RAP-QL-1602", "RAP-QL-1603", "RAP-QL-1604", "RAP-QL-1605", "RAP-QL-1606", "RAP-QL-1607", "RAP-QL-1608", "RAP-QL-1609", "RAP-QL-1610", "RAP-QL-1611", "RAP-QL-1612", "RAP-QL-1613", "RAP-QL-1614", "RAP-QL-1615", "RAP-QL-1616", "RAP-QL-1617"]) {
  const packages = runRap003Cp022ForLanguages({ seed: `rap-003-geometric-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

console.log(`RAP-003 multilingual test passed. CP-013 QLs covered: ${seenPartnershipQlIds.size}. CP-014 QLs covered: ${seenQlIds.size}. CP-015 QLs covered: ${seenIncomeQlIds.size}. CP-016 QLs covered: ${seenAlloyQlIds.size}. CP-017 QLs covered: ${seenReplacementQlIds.size}. CP-018 QLs covered: ${seenDenominationQlIds.size}. CP-019 QLs covered: ${seenSdtQlIds.size}. CP-020 QLs covered: ${seenPopulationQlIds.size}. CP-021 QLs covered: ${seenElectionQlIds.size}. CP-022 QLs covered: ${seenGeometricQlIds.size}.`);
