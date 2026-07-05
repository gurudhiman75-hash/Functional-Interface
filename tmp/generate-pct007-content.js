const fs = require("fs");
const path = require("path");

const root = path.join(
  "artifacts",
  "api-server",
  "src",
  "quant-v4",
  "topics",
  "Arithmetic",
  "subtopics",
  "Percentage",
  "PCT-007",
);

function writeJson(relPath, value) {
  fs.writeFileSync(path.join(root, relPath), `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(relPath, value) {
  fs.writeFileSync(path.join(root, relPath), `${value.trimEnd()}\n`);
}

function qlIdFor(index) {
  return `PCT-QL-${String(index).padStart(3, "0")}`;
}

function cpIdFor(index) {
  return `PCT-CP-${String(index).padStart(3, "0")}`;
}

function explanationIdFor(index) {
  return `PCT-ES-${String(index).padStart(3, "0")}`;
}

function makeContextTag(unit, wholeLabel, valuePrefix = "") {
  return [unit, wholeLabel, valuePrefix === "Rs. " ? "money" : "plain"].join("|");
}

const cpIds = Array.from({ length: 10 }, (_value, index) => cpIdFor(index + 1));

const incomeContexts = [
  "A clerk",
  "A teacher",
  "A tailor",
  "A driver",
  "A shopkeeper",
  "A nurse",
  "An electrician",
  "A school employee",
  "A farmer",
  "A tutor",
];

const marksContexts = [
  "a school examination",
  "a board examination",
  "a recruitment test",
  "a scholarship test",
  "a qualifying examination",
  "an entrance test",
  "a written examination",
  "a class test",
  "a competitive examination",
  "a screening test",
];

const electionContexts = [
  "In a municipal election",
  "In a ward election",
  "In a panchayat election",
  "In a cooperative election",
  "In a union election",
  "In a colony election",
  "In a market committee election",
  "In a resident welfare election",
  "In a college union election",
  "In a block-level election",
];

const applicationContexts = [
  { subject: "The population of a town", unit: "people", wholeLabel: "population", contextTag: makeContextTag("people", "population") },
  { subject: "The production of a factory", unit: "units", wholeLabel: "production", contextTag: makeContextTag("units", "production") },
  { subject: "The electricity consumption of a block", unit: "units", wholeLabel: "consumption", contextTag: makeContextTag("units", "consumption") },
  { subject: "The stock of a warehouse", unit: "items", wholeLabel: "stock", contextTag: makeContextTag("items", "stock") },
  { subject: "The daily water supply of a village", unit: "litres", wholeLabel: "supply", contextTag: makeContextTag("litres", "supply") },
  { subject: "The strength of a school", unit: "students", wholeLabel: "strength", contextTag: makeContextTag("students", "strength") },
  { subject: "The crop output of a farm", unit: "quintals", wholeLabel: "output", contextTag: makeContextTag("quintals", "output") },
  { subject: "The milk supply of a booth", unit: "litres", wholeLabel: "supply", contextTag: makeContextTag("litres", "supply") },
  { subject: "The passenger count on a route", unit: "passengers", wholeLabel: "passenger count", contextTag: makeContextTag("passengers", "passenger count") },
  { subject: "The grain stock of a depot", unit: "bags", wholeLabel: "stock", contextTag: makeContextTag("bags", "stock") },
];

const mixtureContexts = [
  { subject: "A salt solution", component: "salt", other: "water", unit: "litres", contextTag: makeContextTag("litres", "mixture") },
  { subject: "A sugar solution", component: "sugar", other: "water", unit: "litres", contextTag: makeContextTag("litres", "mixture") },
  { subject: "A milk-water mixture", component: "milk", other: "water", unit: "litres", contextTag: makeContextTag("litres", "mixture") },
  { subject: "An acid solution", component: "acid", other: "water", unit: "litres", contextTag: makeContextTag("litres", "mixture") },
  { subject: "An alcohol solution", component: "alcohol", other: "water", unit: "litres", contextTag: makeContextTag("litres", "mixture") },
  { subject: "A paint mixture", component: "paint", other: "thinner", unit: "litres", contextTag: makeContextTag("litres", "mixture") },
  { subject: "A syrup mixture", component: "syrup", other: "water", unit: "litres", contextTag: makeContextTag("litres", "mixture") },
  { subject: "A fertilizer mix", component: "fertilizer", other: "base material", unit: "kg", contextTag: makeContextTag("kg", "mixture") },
  { subject: "A metal blend", component: "copper", other: "other metal", unit: "kg", contextTag: makeContextTag("kg", "mixture") },
  { subject: "A chemical solution", component: "solute", other: "solvent", unit: "litres", contextTag: makeContextTag("litres", "mixture") },
];

const dryingContexts = [
  "Fresh grapes",
  "Fresh apples",
  "Fresh tomatoes",
  "Fresh plums",
  "Fresh apricots",
  "Fresh berries",
  "Wet grain",
  "Fresh dates",
  "Fresh figs",
  "Fresh chillies",
];

const evaporationContexts = [
  "A sugar solution",
  "A salt solution",
  "An acid solution",
  "An ink solution",
  "A medicine solution",
  "A chemical solution",
  "A laboratory sample",
  "A syrup solution",
  "A dye solution",
  "A glucose solution",
];

const discountContexts = [
  "An article in a shop",
  "A showroom bill",
  "A garment purchase",
  "An appliance bill",
  "A book purchase",
  "A furniture bill",
  "A mobile accessory bill",
  "A grocery bill",
  "A sports goods bill",
  "A stationery purchase",
];

const taxContexts = [
  "A hotel bill",
  "A restaurant bill",
  "An electricity bill",
  "A service bill",
  "A maintenance bill",
  "A utility bill",
  "A cinema booking bill",
  "A courier bill",
  "A repair bill",
  "A club bill",
];

const commissionContexts = [
  "A sales agent",
  "An insurance agent",
  "A property broker",
  "A commission agent",
  "A booking agent",
  "A tour agent",
  "A vehicle salesperson",
  "A wholesale representative",
  "A ticketing agent",
  "A product promoter",
];

const errorContexts = [
  "A value",
  "A bill amount",
  "A weight entry",
  "A population figure",
  "A measurement",
  "A marks entry",
  "A stock figure",
  "A salary entry",
  "A fee amount",
  "A production figure",
];

const repeatedContexts = [
  { subject: "A water tank", unit: "litres", contextTag: makeContextTag("litres", "quantity") },
  { subject: "A warehouse stock", unit: "items", contextTag: makeContextTag("items", "quantity") },
  { subject: "A grain store", unit: "bags", contextTag: makeContextTag("bags", "quantity") },
  { subject: "A battery pack", unit: "units", contextTag: makeContextTag("units", "quantity") },
  { subject: "A fuel reserve", unit: "litres", contextTag: makeContextTag("litres", "quantity") },
  { subject: "A paper stock", unit: "reams", contextTag: makeContextTag("reams", "quantity") },
  { subject: "A ration stock", unit: "kg", contextTag: makeContextTag("kg", "quantity") },
  { subject: "A medicine stock", unit: "boxes", contextTag: makeContextTag("boxes", "quantity") },
  { subject: "A fruit stock", unit: "crates", contextTag: makeContextTag("crates", "quantity") },
  { subject: "A library stock", unit: "books", contextTag: makeContextTag("books", "quantity") },
];

const caseletSavingsContexts = [
  "A clerk earns Rs. {baseValue} per month and spends {percentageRate}% of it. Find the monthly savings.",
  "A teacher has monthly income of Rs. {baseValue}. If {percentageRate}% is spent, find the amount saved.",
  "A tailor earns Rs. {baseValue} in a month and spends {percentageRate}% on expenses. Find the savings.",
  "A driver receives Rs. {baseValue} per month. If {percentageRate}% goes towards expenses, find the savings.",
  "A shopkeeper earns Rs. {baseValue} in a month and uses {percentageRate}% for expenditure. Find the savings.",
  "A nurse gets Rs. {baseValue} as monthly salary. If {percentageRate}% is spent, find the amount left as savings.",
  "An electrician earns Rs. {baseValue} per month. If {percentageRate}% is used for expenses, find the savings.",
  "A school employee earns Rs. {baseValue} monthly. If expenditure is {percentageRate}% of income, find the savings.",
  "A farmer has monthly income of Rs. {baseValue}. If {percentageRate}% is spent, find the amount saved.",
  "A tutor earns Rs. {baseValue} in a month and spends {percentageRate}% of it. Find the monthly savings.",
];

const caseletVotesContexts = [
  "In a ward election, {turnoutRate}% of {totalVoters} voters cast their votes. If {invalidRate}% of the polled votes are invalid and a candidate gets {candidateRate}% of the valid votes, find the candidate's votes.",
  "In a panchayat election, {turnoutRate}% of {totalVoters} voters cast votes. If {invalidRate}% of the polled votes are invalid and one candidate secures {candidateRate}% of the valid votes, find that candidate's votes.",
  "In a municipal election, {turnoutRate}% of {totalVoters} voters cast votes. If {invalidRate}% of the polled votes are invalid and Candidate A receives {candidateRate}% of the valid votes, find Candidate A's votes.",
  "In a cooperative election, {turnoutRate}% of {totalVoters} voters cast votes. If {invalidRate}% of these votes are invalid and a candidate gets {candidateRate}% of the valid votes, find the candidate's votes.",
  "In a college union election, {turnoutRate}% of {totalVoters} voters cast votes. If {invalidRate}% of the polled votes are invalid and one candidate gets {candidateRate}% of the valid votes, find the votes obtained by that candidate.",
  "In a colony election, {turnoutRate}% of {totalVoters} voters cast votes. If {invalidRate}% of the votes are invalid and Candidate B secures {candidateRate}% of the valid votes, find Candidate B's votes.",
  "In a resident welfare election, {turnoutRate}% of {totalVoters} voters cast votes. If {invalidRate}% are invalid and a candidate obtains {candidateRate}% of the valid votes, find the candidate's votes.",
  "In a market committee election, {turnoutRate}% of {totalVoters} voters cast votes. If {invalidRate}% of the polled votes are invalid and one candidate gets {candidateRate}% of the valid votes, find that candidate's votes.",
  "In a block-level election, {turnoutRate}% of {totalVoters} voters cast votes. If {invalidRate}% are invalid and Candidate C receives {candidateRate}% of the valid votes, find Candidate C's votes.",
  "In a union election, {turnoutRate}% of {totalVoters} voters cast votes. If {invalidRate}% of the polled votes are invalid and a candidate gets {candidateRate}% of the valid votes, find the candidate's votes.",
];

const caseletBillContexts = [
  "A bill of Rs. {baseValue} gets {rate1}% discount and then {rate2}% tax is added. Find the final bill amount.",
  "An article marked at Rs. {baseValue} is sold after {rate1}% discount and then {rate2}% tax is charged. Find the final amount payable.",
  "A hotel bill of Rs. {baseValue} is reduced by {rate1}% discount and then increased by {rate2}% tax. Find the final bill.",
  "A restaurant bill of Rs. {baseValue} gets {rate1}% discount, after which {rate2}% tax is added. Find the final amount payable.",
  "A showroom bill of Rs. {baseValue} receives {rate1}% discount and then {rate2}% tax. Find the final amount.",
  "A furniture bill of Rs. {baseValue} is billed after {rate1}% discount and {rate2}% tax. Find the final amount.",
  "A garment purchase of Rs. {baseValue} gets {rate1}% discount and then attracts {rate2}% tax. Find the final bill.",
  "A grocery bill of Rs. {baseValue} receives {rate1}% discount before {rate2}% tax is added. Find the final bill.",
  "A cinema booking bill of Rs. {baseValue} gets {rate1}% discount and then {rate2}% tax. Find the final amount payable.",
  "A service bill of Rs. {baseValue} is reduced by {rate1}% and then taxed at {rate2}%. Find the final bill.",
];

const caseletGoodUnitContexts = [
  "A factory produces {totalValue} units. If {percentageRate}% are defective and {rate1}% of the good units are sold, find the good units left.",
  "A plant makes {totalValue} units. If {percentageRate}% are defective and {rate1}% of the good units are dispatched, find the good units left.",
  "A workshop produces {totalValue} pieces. If {percentageRate}% are rejected and {rate1}% of the good pieces are supplied, find the good pieces left.",
  "A unit manufactures {totalValue} items. If {percentageRate}% are defective and {rate1}% of the good items are sold, find the good items left.",
  "A packaging unit prepares {totalValue} boxes. If {percentageRate}% are damaged and {rate1}% of the good boxes are issued, find the good boxes left.",
  "A printer produces {totalValue} copies. If {percentageRate}% are spoiled and {rate1}% of the usable copies are sent out, find the usable copies left.",
  "A dairy packs {totalValue} pouches. If {percentageRate}% are rejected and {rate1}% of the good pouches are sold, find the good pouches left.",
  "A bottling unit fills {totalValue} bottles. If {percentageRate}% are defective and {rate1}% of the good bottles are dispatched, find the good bottles left.",
  "A bakery prepares {totalValue} packets. If {percentageRate}% are damaged and {rate1}% of the good packets are sold, find the good packets left.",
  "A warehouse processes {totalValue} cartons. If {percentageRate}% are defective and {rate1}% of the good cartons are shipped, find the good cartons left.",
];

const compareCaseletContexts = [
  {
    contextTag: makeContextTag("marks", "marks"),
    template: "{subjectA} scores {rate1}% of {baseValue1} marks, while {subjectB} scores {rate2}% of {baseValue2} marks. Who scores more in actual marks, and by how much?",
  },
  {
    contextTag: makeContextTag("students", "attendance"),
    template: "{subjectA} records {rate1}% attendance out of {baseValue1} students, while {subjectB} records {rate2}% attendance out of {baseValue2} students. Which section has higher actual attendance, and by how much?",
  },
  {
    contextTag: makeContextTag("people", "population"),
    template: "{subjectA} has {rate1}% literate people out of {baseValue1}, while {subjectB} has {rate2}% literate people out of {baseValue2}. Which place has more literate people, and by how much?",
  },
  {
    contextTag: makeContextTag("units", "sales"),
    template: "{subjectA} sells {rate1}% of {baseValue1} units, while {subjectB} sells {rate2}% of {baseValue2} units. Which unit sells more actual units, and by how much?",
  },
  {
    contextTag: makeContextTag("", "sales", "Rs. "),
    template: "{subjectA} records sales equal to {rate1}% of Rs. {baseValue1}, while {subjectB} records sales equal to {rate2}% of Rs. {baseValue2}. Which store records higher actual sales, and by how much?",
  },
  {
    contextTag: makeContextTag("passengers", "passenger count"),
    template: "{subjectA} carries {rate1}% of {baseValue1} passengers, while {subjectB} carries {rate2}% of {baseValue2} passengers. Which route carries more passengers, and by how many?",
  },
  {
    contextTag: makeContextTag("votes", "votes"),
    template: "{subjectA} secures {rate1}% of {baseValue1} valid votes, while {subjectB} secures {rate2}% of {baseValue2} valid votes. Who gets more votes, and by how many?",
  },
  {
    contextTag: makeContextTag("items", "stock"),
    template: "{subjectA} sells {rate1}% of {baseValue1} items, while {subjectB} sells {rate2}% of {baseValue2} items. Which warehouse sells more items, and by how many?",
  },
  {
    contextTag: makeContextTag("units", "usage"),
    template: "{subjectA} uses {rate1}% of {baseValue1} units, while {subjectB} uses {rate2}% of {baseValue2} units. Which block uses more units, and by how many?",
  },
  {
    contextTag: makeContextTag("units", "output"),
    template: "{subjectA} reports {rate1}% good output out of {baseValue1} units, while {subjectB} reports {rate2}% good output out of {baseValue2} units. Which factory has higher good output, and by how many units?",
  },
];

const definitions = [
  {
    cpId: cpIds[0],
    taskKind: "incomeExpenditureSavingsApplication",
    families: [
      {
        solveMode: "findSavingsFromSpendRate",
        answerType: "AMOUNT",
        difficulty: "Easy",
        requiredVariables: ["percentageRate", "baseValue"],
        scenarioFamily: "spend_rate_to_savings",
        contextTag: makeContextTag("", "income", "Rs. "),
        templates: incomeContexts.map((subject) => `${subject} spends {percentageRate}% of monthly income of Rs. {baseValue}. Find the savings.`),
      },
      {
        solveMode: "findExpenditureFromSavingsRate",
        answerType: "AMOUNT",
        difficulty: "Easy",
        requiredVariables: ["percentageRate", "baseValue"],
        scenarioFamily: "save_rate_to_expenditure",
        contextTag: makeContextTag("", "income", "Rs. "),
        templates: incomeContexts.map((subject) => `${subject} saves {percentageRate}% of monthly income of Rs. {baseValue}. Find the expenditure.`),
      },
      {
        solveMode: "findIncomeFromSavingsAmount",
        answerType: "AMOUNT",
        difficulty: "Medium",
        requiredVariables: ["percentageRate", "value1"],
        scenarioFamily: "savings_amount_to_income",
        contextTag: makeContextTag("", "income", "Rs. "),
        templates: incomeContexts.map((subject) => `${subject} saves {percentageRate}% of monthly income. If the savings are Rs. {value1}, find the income.`),
      },
      {
        solveMode: "findIncomeFromExpenditureAmount",
        answerType: "AMOUNT",
        difficulty: "Medium",
        requiredVariables: ["percentageRate", "value1"],
        scenarioFamily: "expenditure_amount_to_income",
        contextTag: makeContextTag("", "income", "Rs. "),
        templates: incomeContexts.map((subject) => `${subject} spends {percentageRate}% of monthly income. If the expenditure is Rs. {value1}, find the income.`),
      },
      {
        solveMode: "findExpenditureFromSavingsAmount",
        answerType: "AMOUNT",
        difficulty: "Medium",
        requiredVariables: ["percentageRate", "value1"],
        scenarioFamily: "savings_amount_to_expenditure",
        contextTag: makeContextTag("", "income", "Rs. "),
        templates: incomeContexts.map((subject) => `${subject} saves {percentageRate}% of monthly income. If the savings are Rs. {value1}, find the expenditure.`),
      },
    ],
  },
  {
    cpId: cpIds[1],
    taskKind: "marksPassFailApplication",
    families: [
      {
        solveMode: "findMarksFromTotalMarks",
        answerType: "COUNT",
        difficulty: "Easy",
        requiredVariables: ["percentageRate", "totalMarks"],
        scenarioFamily: "marks_from_total",
        contextTag: makeContextTag("marks", "marks"),
        templates: marksContexts.map((exam) => `A candidate scores {percentageRate}% of {totalMarks} marks in ${exam}. Find the marks obtained.`),
      },
      {
        solveMode: "findTotalFromMarksPercent",
        answerType: "COUNT",
        difficulty: "Medium",
        requiredVariables: ["percentageRate", "marksObtained"],
        scenarioFamily: "total_from_marks_percent",
        contextTag: makeContextTag("marks", "marks"),
        templates: marksContexts.map((exam) => `A candidate obtains {marksObtained} marks, which is {percentageRate}% of the total, in ${exam}. Find the total marks.`),
      },
      {
        solveMode: "findPassMarksFromTotalMarks",
        answerType: "COUNT",
        difficulty: "Easy",
        requiredVariables: ["passRate", "totalMarks"],
        scenarioFamily: "pass_marks_from_total",
        contextTag: makeContextTag("marks", "marks"),
        templates: marksContexts.map((exam) => `In ${exam}, pass marks are {passRate}% of {totalMarks}. Find the pass marks.`),
      },
      {
        solveMode: "findTotalFromFailMargin",
        answerType: "COUNT",
        difficulty: "Hard",
        requiredVariables: ["percentageRate", "passRate", "value1"],
        scenarioFamily: "total_from_fail_margin",
        contextTag: makeContextTag("marks", "marks"),
        templates: marksContexts.map((exam) => `A candidate secures {percentageRate}% of the total marks in ${exam} and fails by {value1} marks. If pass marks are {passRate}% of the total, find the total marks.`),
      },
      {
        solveMode: "findTotalFromPassMargin",
        answerType: "COUNT",
        difficulty: "Hard",
        requiredVariables: ["percentageRate", "passRate", "value1"],
        scenarioFamily: "total_from_pass_margin",
        contextTag: makeContextTag("marks", "marks"),
        templates: marksContexts.map((exam) => `A candidate secures {percentageRate}% of the total marks in ${exam} and passes by {value1} marks. If pass marks are {passRate}% of the total, find the total marks.`),
      },
    ],
  },
  {
    cpId: cpIds[2],
    taskKind: "electionVotesApplication",
    families: [
      {
        solveMode: "findVotesPolledFromTurnout",
        answerType: "COUNT",
        difficulty: "Easy",
        requiredVariables: ["turnoutRate", "totalVoters"],
        scenarioFamily: "votes_polled",
        contextTag: makeContextTag("votes", "votes"),
        templates: electionContexts.map((label) => `${label}, {turnoutRate}% of {totalVoters} registered voters cast their votes. Find the number of votes polled.`),
      },
      {
        solveMode: "findValidVotesFromInvalidRate",
        answerType: "COUNT",
        difficulty: "Medium",
        requiredVariables: ["turnoutRate", "totalVoters", "invalidRate"],
        scenarioFamily: "valid_votes",
        contextTag: makeContextTag("votes", "votes"),
        templates: electionContexts.map((label) => `${label}, {turnoutRate}% of {totalVoters} voters cast their votes and {invalidRate}% of the polled votes were invalid. Find the number of valid votes.`),
      },
      {
        solveMode: "findCandidateVotesFromValidVotes",
        answerType: "COUNT",
        difficulty: "Medium",
        requiredVariables: ["turnoutRate", "totalVoters", "invalidRate", "candidateRate"],
        scenarioFamily: "candidate_votes",
        contextTag: makeContextTag("votes", "votes"),
        templates: electionContexts.map((label) => `${label}, {turnoutRate}% of {totalVoters} voters cast votes. If {invalidRate}% of the polled votes were invalid and a candidate got {candidateRate}% of the valid votes, find the candidate's votes.`),
      },
      {
        solveMode: "findWinningMarginFromVoteShare",
        answerType: "COUNT",
        difficulty: "Hard",
        requiredVariables: ["turnoutRate", "totalVoters", "invalidRate", "rate1", "rate2"],
        scenarioFamily: "winning_margin",
        contextTag: makeContextTag("votes", "votes"),
        templates: electionContexts.map((label) => `${label}, {turnoutRate}% of {totalVoters} voters cast votes and {invalidRate}% of the polled votes were invalid. If Candidate A gets {rate1}% of the valid votes and Candidate B gets {rate2}% of the valid votes, find the winning margin.`),
      },
      {
        solveMode: "findTotalVotersFromVotesPolled",
        answerType: "COUNT",
        difficulty: "Medium",
        requiredVariables: ["turnoutRate", "value1"],
        scenarioFamily: "total_voters",
        contextTag: makeContextTag("votes", "votes"),
        templates: electionContexts.map((label) => `${label}, {turnoutRate}% of the registered voters cast their votes. If {value1} votes were polled, find the total number of registered voters.`),
      },
    ],
  },
  {
    cpId: cpIds[3],
    taskKind: "populationProductionConsumptionApplication",
    families: [
      {
        solveMode: "findRevisedValueAfterIncrease",
        answerType: "ABSOLUTE",
        difficulty: "Easy",
        requiredVariables: ["percentageRate", "totalValue"],
        scenarioFamily: "revised_after_increase",
        templates: applicationContexts.map((ctx) => ({
          template: `${ctx.subject} is {totalValue} ${ctx.unit}. If it increases by {percentageRate}%, find the new ${ctx.wholeLabel}.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findOriginalValueBeforeIncrease",
        answerType: "ABSOLUTE",
        difficulty: "Medium",
        requiredVariables: ["percentageRate", "value1"],
        scenarioFamily: "original_before_increase",
        templates: applicationContexts.map((ctx) => ({
          template: `${ctx.subject} becomes {value1} ${ctx.unit} after an increase of {percentageRate}%. Find the original ${ctx.wholeLabel}.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findRevisedValueAfterDecrease",
        answerType: "ABSOLUTE",
        difficulty: "Easy",
        requiredVariables: ["percentageRate", "totalValue"],
        scenarioFamily: "revised_after_decrease",
        templates: applicationContexts.map((ctx) => ({
          template: `${ctx.subject} is {totalValue} ${ctx.unit}. If it decreases by {percentageRate}%, find the new ${ctx.wholeLabel}.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findUsedQuantityFromPercent",
        answerType: "ABSOLUTE",
        difficulty: "Easy",
        requiredVariables: ["percentageRate", "totalValue"],
        scenarioFamily: "used_quantity",
        templates: applicationContexts.map((ctx) => ({
          template: `${ctx.subject} is {totalValue} ${ctx.unit}. If {percentageRate}% of it is used or consumed, find the quantity used.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findRemainingQuantityFromPercent",
        answerType: "ABSOLUTE",
        difficulty: "Easy",
        requiredVariables: ["percentageRate", "totalValue"],
        scenarioFamily: "remaining_quantity",
        templates: applicationContexts.map((ctx) => ({
          template: `${ctx.subject} is {totalValue} ${ctx.unit}. If {percentageRate}% of it is used or consumed, find the quantity remaining.`,
          contextTag: ctx.contextTag,
        })),
      },
    ],
  },
  {
    cpId: cpIds[4],
    taskKind: "mixtureConcentrationBasicApplication",
    families: [
      {
        solveMode: "findComponentFromTotalAndRate",
        answerType: "ABSOLUTE",
        difficulty: "Easy",
        requiredVariables: ["componentRate", "totalValue"],
        scenarioFamily: "component_from_total",
        templates: mixtureContexts.map((ctx) => ({
          template: `${ctx.subject} contains {componentRate}% ${ctx.component}. Find the quantity of ${ctx.component} in {totalValue} ${ctx.unit} of the mixture.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findOtherComponentFromTotalAndRate",
        answerType: "ABSOLUTE",
        difficulty: "Easy",
        requiredVariables: ["componentRate", "totalValue"],
        scenarioFamily: "other_component_from_total",
        templates: mixtureContexts.map((ctx) => ({
          template: `${ctx.subject} contains {componentRate}% ${ctx.component}. Find the quantity of ${ctx.other} in {totalValue} ${ctx.unit} of the mixture.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findTotalFromComponentAndRate",
        answerType: "ABSOLUTE",
        difficulty: "Medium",
        requiredVariables: ["componentRate", "value1"],
        scenarioFamily: "total_from_component",
        templates: mixtureContexts.map((ctx) => ({
          template: `${ctx.subject} contains {componentRate}% ${ctx.component}. If the ${ctx.component} present is {value1} ${ctx.unit}, find the total quantity of the mixture.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findRateFromComponentAndTotal",
        answerType: "PERCENT",
        difficulty: "Medium",
        requiredVariables: ["value1", "totalValue"],
        scenarioFamily: "rate_from_component",
        templates: mixtureContexts.map((ctx) => ({
          template: `In ${ctx.subject.toLowerCase()}, {value1} ${ctx.unit} is ${ctx.component} out of {totalValue} ${ctx.unit}. Find the percentage of ${ctx.component}.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findTotalFromOtherComponentAndRate",
        answerType: "ABSOLUTE",
        difficulty: "Medium",
        requiredVariables: ["componentRate", "value1"],
        scenarioFamily: "total_from_other_component",
        templates: mixtureContexts.map((ctx) => ({
          template: `${ctx.subject} contains {componentRate}% ${ctx.component}. If the ${ctx.other} present is {value1} ${ctx.unit}, find the total quantity of the mixture.`,
          contextTag: ctx.contextTag,
        })),
      },
    ],
  },
  {
    cpId: cpIds[5],
    taskKind: "evaporationDryingCompositionApplication",
    families: [
      {
        solveMode: "findFinalDryWeight",
        answerType: "WEIGHT",
        difficulty: "Hard",
        requiredVariables: ["waterRate", "dryWaterRate", "baseValue"],
        scenarioFamily: "final_dry_weight",
        contextTag: makeContextTag("kg", "weight"),
        templates: dryingContexts.map((ctx) => `${ctx} contain {waterRate}% water. After drying, water becomes {dryWaterRate}% of the final weight. If the fresh weight is {baseValue} kg, find the final dry weight.`),
      },
      {
        solveMode: "findWaterLostAfterDrying",
        answerType: "WEIGHT",
        difficulty: "Hard",
        requiredVariables: ["waterRate", "dryWaterRate", "baseValue"],
        scenarioFamily: "water_lost_after_drying",
        contextTag: makeContextTag("kg", "weight"),
        templates: dryingContexts.map((ctx) => `${ctx} contain {waterRate}% water. After drying, water becomes {dryWaterRate}% of the final weight. If the fresh weight is {baseValue} kg, find the water lost.`),
      },
      {
        solveMode: "findFinalVolumeAfterEvaporation",
        answerType: "VOLUME",
        difficulty: "Hard",
        requiredVariables: ["oldRate", "newRate", "baseValue"],
        scenarioFamily: "final_volume_after_evaporation",
        contextTag: makeContextTag("litres", "solution"),
        templates: evaporationContexts.map((ctx) => `${ctx} is {oldRate}% solute. After some water evaporates, it becomes {newRate}% solute. If the initial solution is {baseValue} litres, find the final quantity of the solution.`),
      },
      {
        solveMode: "findEvaporatedAmount",
        answerType: "VOLUME",
        difficulty: "Hard",
        requiredVariables: ["oldRate", "newRate", "baseValue"],
        scenarioFamily: "evaporated_amount",
        contextTag: makeContextTag("litres", "solution"),
        templates: evaporationContexts.map((ctx) => `${ctx} is {oldRate}% solute. After evaporation, it becomes {newRate}% solute. If the initial solution is {baseValue} litres, find the quantity evaporated.`),
      },
      {
        solveMode: "findInitialWeightFromFinalDryWeight",
        answerType: "WEIGHT",
        difficulty: "Hard",
        requiredVariables: ["waterRate", "dryWaterRate", "value1"],
        scenarioFamily: "initial_weight_from_final",
        contextTag: makeContextTag("kg", "weight"),
        templates: dryingContexts.map((ctx) => `After drying, ${ctx.toLowerCase()} weigh {value1} kg and contain {dryWaterRate}% water. If the fresh produce had {waterRate}% water, find the original weight.`),
      },
    ],
  },
  {
    cpId: cpIds[6],
    taskKind: "taxDiscountCommissionChargesApplication",
    families: [
      {
        solveMode: "findDiscountAmount",
        answerType: "AMOUNT",
        difficulty: "Easy",
        requiredVariables: ["discountRate", "baseValue"],
        scenarioFamily: "discount_amount",
        contextTag: makeContextTag("", "amount", "Rs. "),
        templates: discountContexts.map((ctx) => `${ctx} is priced at Rs. {baseValue} and carries {discountRate}% discount. Find the discount amount.`),
      },
      {
        solveMode: "findBillAfterDiscount",
        answerType: "BILL_VALUE",
        difficulty: "Easy",
        requiredVariables: ["discountRate", "baseValue"],
        scenarioFamily: "bill_after_discount",
        contextTag: makeContextTag("", "bill", "Rs. "),
        templates: discountContexts.map((ctx) => `${ctx} is priced at Rs. {baseValue} and gets {discountRate}% discount. Find the amount payable after discount.`),
      },
      {
        solveMode: "findTaxOrChargeAmount",
        answerType: "AMOUNT",
        difficulty: "Easy",
        requiredVariables: ["percentageRate", "baseValue"],
        scenarioFamily: "tax_or_charge_amount",
        contextTag: makeContextTag("", "bill", "Rs. "),
        templates: taxContexts.map((ctx) => `${ctx} is Rs. {baseValue} and attracts a {percentageRate}% tax or charge. Find the tax or charge amount.`),
      },
      {
        solveMode: "findFinalBillAfterDiscountAndTax",
        answerType: "BILL_VALUE",
        difficulty: "Medium",
        requiredVariables: ["rate1", "rate2", "baseValue"],
        scenarioFamily: "final_bill_after_discount_tax",
        contextTag: makeContextTag("", "bill", "Rs. "),
        templates: taxContexts.map((ctx) => `${ctx} is Rs. {baseValue}. After a {rate1}% discount, a {rate2}% tax is added. Find the final bill amount.`),
      },
      {
        solveMode: "findCommissionAmount",
        answerType: "AMOUNT",
        difficulty: "Easy",
        requiredVariables: ["commissionRate", "baseValue"],
        scenarioFamily: "commission_amount",
        contextTag: makeContextTag("", "sales", "Rs. "),
        templates: commissionContexts.map((ctx) => `${ctx} earns {commissionRate}% commission on sales of Rs. {baseValue}. Find the commission amount.`),
      },
    ],
  },
  {
    cpId: cpIds[7],
    taskKind: "errorMiscalculationPercentageErrorApplication",
    families: [
      {
        solveMode: "findPercentageErrorFromWrongAndCorrect",
        answerType: "PERCENT",
        difficulty: "Medium",
        requiredVariables: ["wrongValue", "correctValue"],
        scenarioFamily: "percentage_error_from_values",
        contextTag: makeContextTag("", "value"),
        templates: errorContexts.map((ctx) => `${ctx} is wrongly taken as {wrongValue} instead of {correctValue}. Find the percentage error.`),
      },
      {
        solveMode: "findCorrectValueFromOverstatement",
        answerType: "ABSOLUTE",
        difficulty: "Medium",
        requiredVariables: ["wrongValue", "percentageRate"],
        scenarioFamily: "correct_from_overstatement",
        contextTag: makeContextTag("", "value"),
        templates: errorContexts.map((ctx) => `${ctx} is recorded as {wrongValue}, which is {percentageRate}% more than the correct value. Find the correct value.`),
      },
      {
        solveMode: "findCorrectValueFromUnderstatement",
        answerType: "ABSOLUTE",
        difficulty: "Medium",
        requiredVariables: ["wrongValue", "percentageRate"],
        scenarioFamily: "correct_from_understatement",
        contextTag: makeContextTag("", "value"),
        templates: errorContexts.map((ctx) => `${ctx} is recorded as {wrongValue}, which is {percentageRate}% less than the correct value. Find the correct value.`),
      },
      {
        solveMode: "findPercentageErrorOnBill",
        answerType: "PERCENT",
        difficulty: "Medium",
        requiredVariables: ["wrongValue", "correctValue"],
        scenarioFamily: "percentage_error_on_bill",
        contextTag: makeContextTag("", "bill", "Rs. "),
        templates: errorContexts.map((ctx) => `A bill based on ${ctx.toLowerCase()} is prepared as Rs. {wrongValue} instead of Rs. {correctValue}. Find the percentage error.`),
      },
      {
        solveMode: "findActualValueFromMeasuredError",
        answerType: "ABSOLUTE",
        difficulty: "Medium",
        requiredVariables: ["wrongValue", "percentageRate"],
        scenarioFamily: "actual_from_measured_error",
        contextTag: makeContextTag("", "value"),
        templates: errorContexts.map((ctx) => `${ctx} is measured as {wrongValue}, which is {percentageRate}% above the actual value. Find the actual value.`),
      },
    ],
  },
  {
    cpId: cpIds[8],
    taskKind: "replacementRepeatedPercentageApplication",
    families: [
      {
        solveMode: "findRemainingAfterOneRemoval",
        answerType: "ABSOLUTE",
        difficulty: "Easy",
        requiredVariables: ["totalValue", "percentageRate"],
        scenarioFamily: "remaining_after_one_removal",
        templates: repeatedContexts.map((ctx) => ({
          template: `${ctx.subject} contains {totalValue} ${ctx.unit}. If {percentageRate}% of it is used, find the quantity left.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findRemainingAfterTwoSameRemovals",
        answerType: "ABSOLUTE",
        difficulty: "Medium",
        requiredVariables: ["totalValue", "percentageRate"],
        scenarioFamily: "remaining_after_two_same_removals",
        templates: repeatedContexts.map((ctx) => ({
          template: `${ctx.subject} contains {totalValue} ${ctx.unit}. If it is reduced by {percentageRate}% and again by the same percentage, find the quantity left.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findRemainingAfterThreeSameRemovals",
        answerType: "ABSOLUTE",
        difficulty: "Hard",
        requiredVariables: ["totalValue", "percentageRate"],
        scenarioFamily: "remaining_after_three_same_removals",
        templates: repeatedContexts.map((ctx) => ({
          template: `${ctx.subject} contains {totalValue} ${ctx.unit}. If it is reduced by {percentageRate}% three times in succession, find the remaining quantity.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findRemainingAfterTwoDifferentRemovals",
        answerType: "ABSOLUTE",
        difficulty: "Hard",
        requiredVariables: ["totalValue", "rate1", "rate2"],
        scenarioFamily: "remaining_after_two_different_removals",
        templates: repeatedContexts.map((ctx) => ({
          template: `${ctx.subject} contains {totalValue} ${ctx.unit}. If it is reduced by {rate1}% and then by {rate2}%, find the quantity left.`,
          contextTag: ctx.contextTag,
        })),
      },
      {
        solveMode: "findTotalRemovedAfterTwoDifferentRemovals",
        answerType: "ABSOLUTE",
        difficulty: "Hard",
        requiredVariables: ["totalValue", "rate1", "rate2"],
        scenarioFamily: "total_removed_after_two_different_removals",
        templates: repeatedContexts.map((ctx) => ({
          template: `${ctx.subject} contains {totalValue} ${ctx.unit}. If {rate1}% is used first and {rate2}% of the remainder is used next, find the total quantity used.`,
          contextTag: ctx.contextTag,
        })),
      },
    ],
  },
  {
    cpId: cpIds[9],
    taskKind: "miniDiMixedPercentageCaselet",
    families: [
      {
        solveMode: "findCaseletSavings",
        answerType: "AMOUNT",
        difficulty: "Easy",
        requiredVariables: ["percentageRate", "baseValue"],
        scenarioFamily: "caselet_savings",
        contextTag: makeContextTag("", "income", "Rs. "),
        templates: caseletSavingsContexts,
      },
      {
        solveMode: "findCaseletCandidateVotes",
        answerType: "COUNT",
        difficulty: "Medium",
        requiredVariables: ["turnoutRate", "totalVoters", "invalidRate", "candidateRate"],
        scenarioFamily: "caselet_candidate_votes",
        contextTag: makeContextTag("votes", "votes"),
        templates: caseletVotesContexts,
      },
      {
        solveMode: "findCaseletFinalBill",
        answerType: "BILL_VALUE",
        difficulty: "Medium",
        requiredVariables: ["rate1", "rate2", "baseValue"],
        scenarioFamily: "caselet_final_bill",
        contextTag: makeContextTag("", "bill", "Rs. "),
        templates: caseletBillContexts,
      },
      {
        solveMode: "findCaseletRemainingGoodUnits",
        answerType: "COUNT",
        difficulty: "Hard",
        requiredVariables: ["totalValue", "percentageRate", "rate1"],
        scenarioFamily: "caselet_remaining_good_units",
        contextTag: makeContextTag("units", "good units"),
        templates: caseletGoodUnitContexts,
      },
      {
        solveMode: "findCaseletComparison",
        answerType: "COMPARISON",
        difficulty: "Hard",
        requiredVariables: ["subjectA", "subjectB", "rate1", "baseValue1", "rate2", "baseValue2"],
        scenarioFamily: "caselet_comparison",
        templates: compareCaseletContexts,
      },
    ],
  },
];

const questionLanguage = {};
const taskRegistryEntries = {};
const explanationMap = {};
let qlCounter = 1;

for (let cpIndex = 0; cpIndex < definitions.length; cpIndex += 1) {
  const definition = definitions[cpIndex];
  const families = {};

  for (const family of definition.families) {
    for (const templateEntry of family.templates) {
      const qlId = qlIdFor(qlCounter);
      qlCounter += 1;

      const template = typeof templateEntry === "string" ? templateEntry : templateEntry.template;
      const contextTag = typeof templateEntry === "string" ? family.contextTag : templateEntry.contextTag;

      families[qlId] = {
        template,
        difficulty: family.difficulty,
      };

      taskRegistryEntries[qlId] = {
        cpId: definition.cpId,
        taskKind: definition.taskKind,
        solveMode: family.solveMode,
        answerType: family.answerType,
        requiredVariables: family.requiredVariables,
        scenarioFamily: family.scenarioFamily,
        contextTag,
      };
    }
  }

  questionLanguage[definition.cpId] = { families };
  explanationMap[definition.cpId] = { explanationId: explanationIdFor(cpIndex + 1) };
}

if (qlCounter !== 501) {
  throw new Error(`Expected 500 QLs but found ${qlCounter - 1}`);
}

const questionLanguageHi = JSON.parse(JSON.stringify(questionLanguage));
const questionLanguagePa = JSON.parse(JSON.stringify(questionLanguage));
const explanationHi = JSON.parse(JSON.stringify(explanationMap));
const explanationPa = JSON.parse(JSON.stringify(explanationMap));

const taskRegistry = {
  archetypeId: "PCT-007",
  ownership: "HUMAN_OWNED",
  authority: "ExamTree Quant V4 Percentage PCT-007",
  usage: "Runtime Consumption Only",
  entries: taskRegistryEntries,
};

const variableRanges = {
  archetypeId: "PCT-007",
  amounts: [100, 120, 150, 200, 240, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 5000, 10000],
  percentages: [5, 10, 12.5, 15, 20, 25, 30, 33.33, 40, 50, 60, 75, 80],
  marksTotals: [100, 150, 200, 300, 400, 500, 600],
  voterCounts: [1000, 2000, 5000, 10000, 25000, 50000],
  weightsOrVolumes: [10, 20, 25, 40, 50, 80, 100, 120, 200],
  waterRates: [60, 70, 75, 80, 90],
  dryWaterRates: [10, 15, 20, 25, 30],
};

const coverageTargets = {
  archetypeId: "PCT-007",
  canonicalProblemCount: 10,
  questionLanguageCount: 500,
  explanationCount: 10,
  languageCount: 3,
};

const distributionTargets = {
  archetypeId: "PCT-007",
  canonicalProblemDistribution: Object.fromEntries(cpIds.map((cpId) => [cpId, 0.1])),
  difficultyDistribution: {
    Easy: 0.32,
    Medium: 0.34,
    Hard: 0.34,
  },
};

const cpDescriptions = [
  "Income, Expenditure, and Savings",
  "Marks, Pass-Fail, and Exam Scores",
  "Election, Votes, and Valid-Invalid Votes",
  "Population, Production, and Consumption Applications",
  "Mixture and Concentration Basics",
  "Evaporation, Drying, and Composition Change",
  "Tax, Discount, Commission, and Charges",
  "Error, Miscalculation, and Percentage Error",
  "Replacement and Repeated Percentage Application in Context",
  "Mini DI / Mixed Percentage Caselets",
];

writeJson("question-language.en.json", questionLanguage);
writeJson("question-language.hi.json", questionLanguageHi);
writeJson("question-language.pa.json", questionLanguagePa);
writeJson("explanation.en.json", explanationMap);
writeJson("explanation.hi.json", explanationHi);
writeJson("explanation.pa.json", explanationPa);
writeJson("task-registry.library.json", taskRegistry);
writeJson("variable-ranges.library.json", variableRanges);
writeJson("coverage-targets.library.json", coverageTargets);
writeJson("distribution-targets.library.json", distributionTargets);

writeText(
  "archetype.md",
  `
# PCT-007 Archetype

\`PCT-007 - Mixed Applications of Percentage\`

This chapter covers exam-style percentage applications across income and savings, marks, election votes, population or production changes, mixture basics, drying or evaporation, billing, percentage error, repeated depletion, and short standalone caselets.
`,
);

writeText(
  "canonical-problems.md",
  [
    "# PCT-007 Canonical Problems",
    "",
    ...cpIds.map((cpId, index) => `${index + 1}. \`${cpId}\` - ${cpDescriptions[index]}`),
  ].join("\n"),
);

writeText(
  "difficulty-framework.md",
  `
# PCT-007 Difficulty Framework

Easy:

- direct percentage application
- simple remainder or part finding
- straightforward discount, tax, votes, or savings calculation

Medium:

- reverse-base recovery
- valid and invalid vote split
- total from known part
- direct concentration recovery
- direct percentage-error recovery

Hard:

- pass or fail margin total recovery
- drying and evaporation with unchanged solid or solute
- repeated percentage depletion
- compact caselet comparison across different bases
`,
);

writeText(
  "implementation-plan.md",
  `
# PCT-007 Implementation Plan

1. Mirror the PCT-006 package shape.
2. Replace copied comparison logic with PCT-007 chapter logic.
3. Generate the task registry and 500 English QLs from deterministic family definitions.
4. Implement chapter-specific generator, solver, validator, and explanation behavior.
5. Run JSON, duplicate, placeholder, render, finite-answer, and bundled test checks.
6. Produce implementation and content-audit reports.
`,
);

writeText(
  "library-authority-map.md",
  `
# PCT-007 Library Authority Map

- \`task-registry.library.json\` maps each QL id to CP, task kind, solve mode, answer type, and required variables.
- \`question-language.en.json\` is the English stem source of truth.
- \`question-language.hi.json\` and \`question-language.pa.json\` preserve placeholder parity for runtime checks.
- \`explanation.en.json\` maps CP ids to explanation ids.
- \`variable-ranges.library.json\` documents curated numeric pools used by the parameter generator.
- \`coverage-targets.library.json\` and \`distribution-targets.library.json\` document expected coverage counts and balance targets.
`,
);

writeText(
  "reasoning-patterns.md",
  `
# PCT-007 Reasoning Patterns

- part and remainder of a base quantity
- reverse recovery of the base from a known percentage part
- turnout, valid-vote, and candidate-vote chaining
- pass-mark threshold and pass-fail margin recovery
- direct component share inside a mixture
- unchanged solid or solute reasoning after drying or evaporation
- discount followed by tax or charge
- percentage error on the correct value
- repeated removal or reduction on the current remainder
- compact single-question caselets with 2 to 4 facts
`,
);
