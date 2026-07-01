import type {
  CsvPilotAcceptedRecord,
  CsvPilotGenerationResult,
  CsvPilotRejection,
} from "./csv-pilot";

export interface CsvPilotReport {
  reportId: "CSV-001";
  target: "PCT-001/percentOfKnownNumber";
  methodFamily: "UNIT_VALUE";
  requestedQuestions: 200;
  questionCount: number;
  acceptedQuestions: number;
  rejectedQuestions: number;
  qlDistribution: readonly { qlId: string; count: number }[];
  difficultyDistribution: readonly { difficulty: string; count: number }[];
  contextDistribution: readonly {
    contextKind: string;
    context: string;
    count: number;
  }[];
  directionDistribution: readonly { direction: string; count: number }[];
  numericDistribution: readonly { profile: string; count: number }[];
  detailModeDistribution: readonly { detailMode: string; count: number }[];
  policyRejectionReasons: readonly { code: string; count: number }[];
  rejected: readonly CsvPilotRejection[];
  verification: {
    parityPassed: boolean;
    determinismPassed: boolean;
    validatorsPassed: boolean;
    shadowPassed: boolean;
    realismPoliciesPassed: boolean;
    presentationPoliciesPassed: boolean;
    entityPoliciesPassed: boolean;
    moneyPoliciesPassed: boolean;
    contextPoliciesPassed: boolean;
  };
  successTarget: {
    exactlyTwoHundred: boolean;
    zeroInvalidExports: boolean;
    zeroPolicyViolations: boolean;
    allFiveQlIdsCovered: boolean;
    allDifficultiesCovered: boolean;
    allRequestedContextsCovered: boolean;
    balancedCoverage: boolean;
    passed: boolean;
  };
}

function distribution<T>(
  values: readonly T[],
  key: (value: T) => string,
): readonly { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    const name = key(value);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([value, count]) => ({ value, count }));
}

function allAccepted(
  records: readonly CsvPilotAcceptedRecord[],
  predicate: (record: CsvPilotAcceptedRecord) => boolean,
): boolean {
  return records.length > 0 && records.every(predicate);
}

export function buildCsvPilotReport(
  result: CsvPilotGenerationResult,
): CsvPilotReport {
  const records = result.accepted;
  const qlDistribution = distribution(records, (record) => record.qlId).map(
    ({ value, count }) => ({ qlId: value, count }),
  );
  const difficultyDistribution = distribution(
    records,
    (record) => record.difficulty,
  ).map(({ value, count }) => ({ difficulty: value, count }));
  const contextDistribution = distribution(
    records,
    (record) => `${record.contextKind}|${record.context}`,
  ).map(({ value, count }) => {
    const [contextKind, context] = value.split("|");
    return { contextKind: contextKind!, context: context!, count };
  });
  const directionDistribution = distribution(
    records,
    (record) => record.direction,
  ).map(({ value, count }) => ({ direction: value, count }));
  const numericDistribution = distribution(
    records,
    (record) => record.numericProfile,
  ).map(({ value, count }) => ({ profile: value, count }));
  const detailModeDistribution = distribution(
    records,
    (record) => record.detailMode,
  ).map(({ value, count }) => ({ detailMode: value, count }));
  const policyRejectionReasons = distribution(
    result.rejected,
    (rejection) => rejection.code,
  ).map(({ value, count }) => ({ code: value, count }));

  const verification = {
    parityPassed: allAccepted(records, (record) => record.parityStatus === "PASS"),
    determinismPassed: allAccepted(
      records,
      (record) => record.determinismStatus === "PASS",
    ),
    validatorsPassed: allAccepted(
      records,
      (record) => record.validatorsStatus === "PASS",
    ),
    shadowPassed: allAccepted(records, (record) => record.shadowStatus === "PASS"),
    realismPoliciesPassed: allAccepted(
      records,
      (record) => record.realismStatus === "PASS",
    ),
    presentationPoliciesPassed: allAccepted(
      records,
      (record) => record.presentationStatus === "PASS",
    ),
    entityPoliciesPassed: allAccepted(
      records,
      (record) => record.entityPolicyStatus === "PASS",
    ),
    moneyPoliciesPassed: allAccepted(
      records,
      (record) => record.moneyPolicyStatus === "PASS",
    ),
    contextPoliciesPassed: allAccepted(
      records,
      (record) => record.contextPolicyStatus === "PASS",
    ),
  };
  const allFiveQlIdsCovered =
    qlDistribution.length === 5 &&
    qlDistribution.every((entry) => entry.count === 40);
  const allDifficultiesCovered =
    new Set(records.map((record) => record.difficulty)).size === 3;
  const requestedContexts = new Set([
    "monthly salary",
    "annual income",
    "annual profit",
    "expenses",
    "bonus",
    "commission",
    "savings",
    "revenue",
    "students",
    "workers",
    "employees",
    "books",
    "trees",
    "families",
    "animals",
    "inventory",
    "distance",
    "area",
    "weight",
    "volume",
    "production",
    "population",
    "marks",
  ]);
  const allRequestedContextsCovered = [...requestedContexts].every((context) =>
    records.some((record) => record.context === context),
  );
  const balancedCoverage =
    directionDistribution.length === 3 &&
    numericDistribution.length === 2 &&
    contextDistribution.every((entry) => entry.count >= 8) &&
    difficultyDistribution.every((entry) => entry.count >= 60);
  const exactlyTwoHundred = records.length === 200;
  const zeroInvalidExports = records.every(
    (record) =>
      record.questionText.length > 0 &&
      record.explanationText.length > 0 &&
      !/[�]|undefined|NaN/.test(
        `${record.questionText}\n${record.explanationText}`,
      ),
  );
  const zeroPolicyViolations =
    result.rejected.length === 0 &&
    Object.values(verification).every(Boolean);

  return {
    reportId: "CSV-001",
    target: "PCT-001/percentOfKnownNumber",
    methodFamily: "UNIT_VALUE",
    requestedQuestions: 200,
    questionCount: records.length,
    acceptedQuestions: records.length,
    rejectedQuestions: result.rejected.length,
    qlDistribution,
    difficultyDistribution,
    contextDistribution,
    directionDistribution,
    numericDistribution,
    detailModeDistribution,
    policyRejectionReasons,
    rejected: result.rejected,
    verification,
    successTarget: {
      exactlyTwoHundred,
      zeroInvalidExports,
      zeroPolicyViolations,
      allFiveQlIdsCovered,
      allDifficultiesCovered,
      allRequestedContextsCovered,
      balancedCoverage,
      passed:
        exactlyTwoHundred &&
        zeroInvalidExports &&
        zeroPolicyViolations &&
        allFiveQlIdsCovered &&
        allDifficultiesCovered &&
        allRequestedContextsCovered &&
        balancedCoverage,
    },
  };
}

