import type { Avg001QuestionLanguageEntry, Avg001SolveMode } from "./types";

type ExpansionRow = readonly [scenarioVariant: string, contextDomain: string, template: string];

const DIFFICULTIES = ["Easy", "Easy", "Medium", "Medium", "Hard", "Hard"] as const;

const FINAL_CONTEXT: Record<string, string> = {
  marksTotal: "total marks",
  dailyOutputTotal: "total production",
  weeklySalesTotal: "total sales",
  salaryGroupTotal: "total monthly salary",
  passengerTotal: "total passengers",
  expenseTotal: "total expenditure",
  marksAverage: "average score per test",
  outputAverage: "average output per hour",
  salesAverage: "average sale per day",
  expenseAverage: "average expenditure per day",
  distanceAverage: "average distance per day",
  observationAverage: "average",
  dayCount: "number of days",
  studentCount: "number of students",
  transactionCount: "number of transactions",
  employeeCount: "number of employees",
  tripCount: "number of trips",
  dayCountFromExpense: "number of days",
  missingMark: "score in the remaining test",
  missingOutput: "output in the remaining shift",
  missingSale: "sale on the remaining day",
  missingExpense: "expenditure on the remaining day",
  missingDistance: "distance on the remaining day",
  missingObservation: "remaining value",
};

const DECIMAL_VARIANTS = new Set(["distanceAverage", "missingDistance"]);

function buildMode(input: {
  startId: number;
  solveMode: Avg001SolveMode;
  requiredVariables: string[];
  answerType: Avg001QuestionLanguageEntry["answerType"];
  explanationStrategies: string[];
  distractorStrategyIds: string[];
  rows: ExpansionRow[];
}): Avg001QuestionLanguageEntry[] {
  return input.rows.map(([scenarioVariant, contextDomain, template], index) => ({
    cpId: "AVG-CP-001",
    qlId: `AVG-QL-${String(input.startId + index).padStart(3, "0")}`,
    taskKind: "sumCountMappingApplication",
    solveMode: input.solveMode,
    difficulty: DIFFICULTIES[index % DIFFICULTIES.length],
    answerType: input.answerType,
    contextDomain,
    scenarioVariant,
    template,
    requiredVariables: [...input.requiredVariables],
    explanationStrategyId: input.explanationStrategies[index % input.explanationStrategies.length]!,
    distractorStrategyIds: [...input.distractorStrategyIds],
    displayPolicy: DECIMAL_VARIANTS.has(scenarioVariant) ? "EXACT_DECIMAL_1" : "EXACT_INTEGER",
    active: true,
    finalContext: FINAL_CONTEXT[scenarioVariant]!,
  }));
}

const sumRows: ExpansionRow[] = [
  ["marksTotal", "Classroom", "The average marks of {count} students in a test are {average}. Find the total marks scored by the class."],
  ["dailyOutputTotal", "Factory", "A packaging unit produces an average of {average} boxes per day for {count} days. Find its total production."],
  ["weeklySalesTotal", "Commerce", "A retail counter records average sales of ₹{average} per day for {count} days. Find the total sales."],
  ["salaryGroupTotal", "Workplace", "The average monthly salary of {count} contract employees is ₹{average}. Find their combined monthly salary."],
  ["passengerTotal", "Transport", "A shuttle carries an average of {average} passengers per trip for {count} trips. Find the total passengers carried."],
  ["expenseTotal", "Household", "A hostel spends an average of ₹{average} per day on meals for {count} days. Find the total expenditure."],
  ["marksTotal", "Classroom", "In a coaching batch, {count} students have an average score of {average}. What is their combined score?"],
  ["dailyOutputTotal", "Factory", "A printing press completes an average of {average} units per day for {count} days. Find its total production."],
  ["weeklySalesTotal", "Commerce", "An online store receives an average of ₹{average} in orders each day for {count} days. Find the total order value."],
  ["salaryGroupTotal", "Workplace", "A department has {count} employees with an average salary of ₹{average}. What is the total salary paid to them?"],
  ["passengerTotal", "Transport", "A ferry transports an average of {average} passengers on each of {count} trips. Find the total passenger count."],
  ["expenseTotal", "Household", "A family spends an average of ₹{average} per day on groceries for {count} days. Find the total amount spent."],
];

const averageRows: ExpansionRow[] = [
  ["marksAverage", "Classroom", "A candidate scores a total of {total} marks in {count} mock tests. Find the average score per test."],
  ["outputAverage", "Factory", "A machine produces {total} components in {count} hours. Find its average hourly output."],
  ["salesAverage", "Commerce", "A kiosk records total sales of ₹{total} over {count} days. Find the average sale per day."],
  ["expenseAverage", "Household", "A family spends ₹{total} on travel during {count} days. Find the average expenditure per day."],
  ["distanceAverage", "Transport", "A survey vehicle covers {total} km in {count} days. Find the average distance covered per day."],
  ["observationAverage", "Abstract", "The sum of {count} recorded values is {total}. Find their average."],
  ["marksAverage", "Classroom", "The combined score in {count} practice tests is {total}. What is the average score per test?"],
  ["outputAverage", "Factory", "An assembly line completes {total} units in {count} hours. What is the average output per hour?"],
  ["salesAverage", "Commerce", "An online seller receives orders worth ₹{total} in {count} days. What is the average daily order value?"],
  ["expenseAverage", "Household", "A hostel spends ₹{total} on supplies over {count} days. What is the average daily expenditure?"],
  ["distanceAverage", "Transport", "A cyclist travels a total of {total} km over {count} days. What is the average daily distance?"],
  ["observationAverage", "Abstract", "A data set contains {count} numbers with a total of {total}. What is their arithmetic average?"],
];

const countRows: ExpansionRow[] = [
  ["dayCount", "Factory", "A unit produces {total} items at an average of {average} items per day. Find the number of production days."],
  ["studentCount", "Classroom", "A class has total marks of {total} and an average of {average} marks per student. Find the number of students."],
  ["transactionCount", "Commerce", "Transactions worth ₹{total} have an average value of ₹{average}. Find the number of transactions."],
  ["employeeCount", "Workplace", "A team receives a total monthly salary of ₹{total}. If the average salary is ₹{average}, find the number of employees."],
  ["tripCount", "Transport", "A shuttle carries {total} passengers in total, averaging {average} passengers per trip. Find the number of trips."],
  ["dayCountFromExpense", "Household", "A family spends ₹{total} at an average of ₹{average} per day. Find the number of days covered by this expenditure."],
  ["dayCount", "Factory", "A workshop completes {total} components at an average of {average} per day. For how many days did it operate?"],
  ["studentCount", "Classroom", "The combined score of a batch is {total}. If the average score is {average}, how many students are in the batch?"],
  ["transactionCount", "Commerce", "A payment system processes transactions totalling ₹{total}, with an average of ₹{average} per transaction. Find the transaction count."],
  ["employeeCount", "Workplace", "The monthly payroll is ₹{total}, and the average salary per employee is ₹{average}. How many employees are on the payroll?"],
  ["tripCount", "Transport", "A ferry transports {total} passengers at an average of {average} passengers per trip. How many trips were made?"],
  ["dayCountFromExpense", "Household", "A hostel uses ₹{total} at an average daily expense of ₹{average}. For how many days will the amount last?"],
];

const missingRows: ExpansionRow[] = [
  ["missingMark", "Classroom", "The average score in {count} tests is {average}. The first {knownCount} tests total {knownTotal}. Find the score in the remaining test."],
  ["missingOutput", "Factory", "The average production over {count} shifts is {average} units. The first {knownCount} shifts produce {knownTotal} units. Find the final shift's output."],
  ["missingSale", "Commerce", "Average daily sales for {count} days are ₹{average}. Sales in the first {knownCount} days total ₹{knownTotal}. Find the remaining day's sales."],
  ["missingExpense", "Household", "A family's average daily expense for {count} days is ₹{average}. It spends ₹{knownTotal} in {knownCount} days. Find the remaining day's expense."],
  ["missingDistance", "Transport", "A vehicle averages {average} km per day over {count} days. It covers {knownTotal} km in {knownCount} days. Find the remaining day's distance."],
  ["missingObservation", "Abstract", "The average of {count} values is {average}. The sum of {knownCount} values is {knownTotal}. Find the remaining value."],
  ["missingMark", "Classroom", "A candidate averages {average} marks across {count} tests. The total for {knownCount} tests is {knownTotal}. Find the last test score."],
  ["missingOutput", "Factory", "A plant averages {average} units per shift for {count} shifts. Output in {knownCount} shifts totals {knownTotal}. Find the remaining shift's output."],
  ["missingSale", "Commerce", "A shop averages ₹{average} in sales over {count} days. The first {knownCount} days bring ₹{knownTotal}. Find sales on the last day."],
  ["missingExpense", "Household", "A hostel spends an average of ₹{average} per day for {count} days. The first {knownCount} days cost ₹{knownTotal}. Find the final day's expense."],
  ["missingDistance", "Transport", "A cyclist travels an average of {average} km daily for {count} days. The first {knownCount} days total {knownTotal} km. Find the last day's distance."],
  ["missingObservation", "Abstract", "A set of {count} observations has average {average}. If {knownCount} observations total {knownTotal}, find the last observation."],
];

export const cp001ExpansionEntries: Avg001QuestionLanguageEntry[] = [
  ...buildMode({
    startId: 25,
    solveMode: "findSumFromAverageAndCount",
    requiredVariables: ["average", "count"],
    answerType: "ABSOLUTE",
    explanationStrategies: ["total-direct-multiply", "total-equal-groups", "total-use-formula"],
    distractorStrategyIds: ["useOneFewerObservation", "useOneMoreObservation", "arithmeticOffsetHigh"],
    rows: sumRows,
  }),
  ...buildMode({
    startId: 37,
    solveMode: "findAverageFromSumAndCount",
    requiredVariables: ["total", "count"],
    answerType: "AVERAGE",
    explanationStrategies: ["average-share-equally", "average-per-unit", "average-formula-check"],
    distractorStrategyIds: ["divideByOneFewer", "divideByOneMore", "arithmeticOffsetHigh"],
    rows: averageRows,
  }),
  ...buildMode({
    startId: 49,
    solveMode: "findCountFromSumAndAverage",
    requiredVariables: ["total", "average"],
    answerType: "COUNT",
    explanationStrategies: ["count-equal-groups", "count-reverse-product", "count-direct-division"],
    distractorStrategyIds: ["countOffByOneLow", "countOffByOneHigh", "countOffByTwoHigh"],
    rows: countRows,
  }),
  ...buildMode({
    startId: 61,
    solveMode: "findMissingValueFromAverage",
    requiredVariables: ["average", "count", "knownCount", "knownTotal"],
    answerType: "MEMBER_VALUE",
    explanationStrategies: ["missing-required-total", "missing-balance-gap", "missing-equation"],
    distractorStrategyIds: ["assumeMissingEqualsAverage", "arithmeticOffsetLow", "arithmeticOffsetHigh"],
    rows: missingRows,
  }),
];
