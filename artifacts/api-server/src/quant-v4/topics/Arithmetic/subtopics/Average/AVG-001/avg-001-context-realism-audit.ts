import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { toNumber } from "./foundation/math";
import { runAvg001Pipeline } from "./foundation/pipeline";

type Bounds = {
  count?: [number, number];
  average?: [number, number];
  missingValue?: [number, number];
};

const bounds: Record<string, Bounds> = {
  marksTotal: { count: [20, 45], average: [40, 100] },
  marksAverage: { count: [5, 12], average: [40, 85] },
  salaryGroupTotal: { count: [10, 30], average: [20000, 60000] },
  weeklySalesTotal: { count: [7, 20], average: [1500, 5000] },
  passengerTotal: { count: [12, 28], average: [25, 60] },
  expenseTotal: { count: [7, 21], average: [400, 1000] },
  salesAverage: { count: [7, 20], average: [1500, 5000] },
  expenseAverage: { count: [7, 20], average: [300, 700] },
  studentCount: { count: [20, 45], average: [40, 100] },
  tripCount: { count: [12, 28], average: [25, 60] },
  transactionCount: { count: [8, 20], average: [1000, 3000] },
  employeeCount: { count: [10, 30], average: [20000, 60000] },
  dayCountFromExpense: { count: [7, 18], average: [200, 500] },
  missingMark: {
    count: [5, 12],
    average: [40, 85],
    missingValue: [20, 100],
  },
  missingSale: {
    count: [7, 20],
    average: [2000, 5500],
    missingValue: [1000, 8000],
  },
  missingExpense: {
    count: [7, 18],
    average: [300, 750],
    missingValue: [150, 1100],
  },
};

function within(value: number, range: [number, number]) {
  return value >= range[0] && value <= range[1];
}

const failures: string[] = [];
let cases = 0;

for (const entry of getAvg001QuestionEntries()) {
  const profile = bounds[entry.scenarioVariant];
  for (let index = 0; index < 12; index += 1) {
    const pkg = runAvg001Pipeline({
      questionLanguageId: entry.qlId,
      seed: `avg-realism:${entry.qlId}:${index}`,
    });
    cases += 1;
    const { count, average, missingValue } = pkg.parameters.values;
    const averageNumber = toNumber(average);

    if (count < 2 || count > 100) {
      failures.push(`${entry.qlId}:${index}: count ${count} is implausible`);
    }
    if (profile?.count && !within(count, profile.count)) {
      failures.push(
        `${entry.qlId}:${index}: count ${count} outside ${profile.count.join("–")}`,
      );
    }
    if (profile?.average && !within(averageNumber, profile.average)) {
      failures.push(
        `${entry.qlId}:${index}: average ${averageNumber} outside ${profile.average.join("–")}`,
      );
    }
    if (profile?.missingValue && missingValue) {
      const missingNumber = toNumber(missingValue);
      if (!within(missingNumber, profile.missingValue)) {
        failures.push(
          `${entry.qlId}:${index}: missing value ${missingNumber} outside ${profile.missingValue.join("–")}`,
        );
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      cases,
      profiledScenarioCount: Object.keys(bounds).length,
      failureCount: failures.length,
      failures: failures.slice(0, 100),
    },
    null,
    2,
  ),
);
assert.equal(cases, 288);
assert.equal(failures.length, 0, failures.join("\n"));
