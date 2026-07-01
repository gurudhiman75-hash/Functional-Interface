import type {
  CsvPilotV2GenerationResult,
  CsvPilotV2Record,
} from "./csv-pilot-v2";

export interface CsvPilotV2Report {
  reportId: "CSV-002";
  target: "PCT-001/percentOfKnownNumber";
  questionCount: number;
  candidateCount: number;
  rejectedCandidateCount: number;
  qlDistribution: readonly { qlId: string; count: number }[];
  difficultyDistribution: readonly { difficulty: string; count: number }[];
  contextDistribution: readonly { context: string; count: number }[];
  approvedProvenanceCount: number;
  partialProvenanceCount: number;
  fallbackCount: number;
  unknownCount: number;
  mostUsedStemFamilies: readonly { stemFamilyId: string; count: number }[];
  mostUsedStemIds: readonly { stemId: string; count: number }[];
  disconnectedAssets: readonly string[];
  unusedLanguageAssets: readonly string[];
  rejectionReasons: readonly { code: string; count: number }[];
  verification: {
    parity: boolean;
    determinism: boolean;
    validators: boolean;
    shadow: boolean;
    realismPolicies: boolean;
    presentationPolicies: boolean;
    entityPolicies: boolean;
    moneyPolicies: boolean;
    contextPolicies: boolean;
  };
  successTarget: {
    exactlyTwoHundred: boolean;
    approvedAboveNinetyFivePercent: boolean;
    fallbackBelowFivePercent: boolean;
    unknownZero: boolean;
    deterministicReproduction: boolean;
    noInlineTemplateUsage: boolean;
    passed: boolean;
  };
}

function counts<T>(
  values: readonly T[],
  selector: (value: T) => string,
): readonly { value: string; count: number }[] {
  const result = new Map<string, number>();
  for (const value of values) {
    const key = selector(value);
    result.set(key, (result.get(key) ?? 0) + 1);
  }
  return [...result.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => ({ value, count }));
}

function allPass(
  records: readonly CsvPilotV2Record[],
  selector: (record: CsvPilotV2Record) => string,
): boolean {
  return records.length > 0 && records.every((record) => selector(record) === "PASS");
}

export function buildCsvPilotV2Report(
  result: CsvPilotV2GenerationResult,
): CsvPilotV2Report {
  const records = result.accepted;
  const approved = records.filter(
    (record) => record.provenanceStatus === "APPROVED",
  ).length;
  const partial = records.filter(
    (record) => record.provenanceStatus === "PARTIAL",
  ).length;
  const fallback = records.filter(
    (record) => record.provenanceStatus === "FALLBACK",
  ).length;
  const unknown = records.filter(
    (record) => record.provenanceStatus === "UNKNOWN",
  ).length;
  const verification = {
    parity: allPass(records, (record) => record.parityStatus),
    determinism: allPass(records, (record) => record.determinismStatus),
    validators: allPass(records, (record) => record.validatorsStatus),
    shadow: allPass(records, (record) => record.shadowStatus),
    realismPolicies: allPass(records, (record) => record.realismStatus),
    presentationPolicies: allPass(
      records,
      (record) => record.presentationStatus,
    ),
    entityPolicies: allPass(records, (record) => record.entityPolicyStatus),
    moneyPolicies: allPass(records, (record) => record.moneyPolicyStatus),
    contextPolicies: allPass(records, (record) => record.contextPolicyStatus),
  };
  const exactlyTwoHundred = records.length === 200;
  const approvedAboveNinetyFivePercent =
    records.length > 0 && approved / records.length > 0.95;
  const fallbackBelowFivePercent =
    records.length > 0 && fallback / records.length < 0.05;
  const unknownZero = unknown === 0;
  const deterministicReproduction = verification.determinism;
  const noInlineTemplateUsage = records.every(
    (record) =>
      record.fallbackUsage === "NO" &&
      record.selectionPath.includes("question-language.en.json") &&
      !record.selectionPath.includes("questionFor"),
  );

  return {
    reportId: "CSV-002",
    target: "PCT-001/percentOfKnownNumber",
    questionCount: records.length,
    candidateCount: result.candidateCount,
    rejectedCandidateCount: result.rejected.length,
    qlDistribution: counts(records, (record) => record.qlId).map(
      ({ value, count }) => ({ qlId: value, count }),
    ),
    difficultyDistribution: counts(
      records,
      (record) => record.difficulty,
    ).map(({ value, count }) => ({ difficulty: value, count })),
    contextDistribution: counts(records, (record) => record.context).map(
      ({ value, count }) => ({ context: value, count }),
    ),
    approvedProvenanceCount: approved,
    partialProvenanceCount: partial,
    fallbackCount: fallback,
    unknownCount: unknown,
    mostUsedStemFamilies: counts(
      records,
      (record) => record.stemFamilyId,
    ).map(({ value, count }) => ({ stemFamilyId: value, count })),
    mostUsedStemIds: counts(records, (record) => record.stemId).map(
      ({ value, count }) => ({ stemId: value, count }),
    ),
    disconnectedAssets: [
      "PCT-001 has no separate stem-families-expanded.library.json layer.",
      "Semantic context selected by the parameter generator is not referenced by the human QL templates for percentOfKnownNumber.",
      "The current QL and variable libraries do not provide 200 unique rendered stems for this task kind under fail-closed validation; CSV-002 measures provenance and may contain deterministic repeated instances.",
    ],
    unusedLanguageAssets: [
      "question-language.hi.json",
      "question-language.pa.json",
      "All PCT-001 English QL entries outside PCT-QL-017/117/217/317/417",
    ],
    rejectionReasons: counts(result.rejected, (item) => item.code).map(
      ({ value, count }) => ({ code: value, count }),
    ),
    verification,
    successTarget: {
      exactlyTwoHundred,
      approvedAboveNinetyFivePercent,
      fallbackBelowFivePercent,
      unknownZero,
      deterministicReproduction,
      noInlineTemplateUsage,
      passed:
        exactlyTwoHundred &&
        approvedAboveNinetyFivePercent &&
        fallbackBelowFivePercent &&
        unknownZero &&
        deterministicReproduction &&
        noInlineTemplateUsage &&
        Object.values(verification).every(Boolean),
    },
  };
}
