import { auditNsTrail001Batch, getNsTrail001ActiveCanonicalProblemIds } from "./library";
import { generateNsTrail001Batch } from "./pipeline";
import type { NsTrail001CanonicalProblemId, NsTrail001QuestionPackage } from "./types";

export function generateNsTrail001CoverageAudit(input: { canonicalProblemId: NsTrail001CanonicalProblemId; count: number; seed?: string }) {
  const seed = input.seed ?? "ns-trail-001-coverage-audit";
  const batch = generateNsTrail001Batch(input.canonicalProblemId, input.count, seed);
  return augmentNsTrail001Audit(input.canonicalProblemId, batch, auditNsTrail001Batch(batch));
}

export function generateNsTrail001FullAudit(input: { countPerCp: number; seed?: string }) {
  const seed = input.seed ?? "ns-trail-001-full-audit";
  return Object.fromEntries(
    getNsTrail001ActiveCanonicalProblemIds().map((cpId) => [
      cpId,
      generateNsTrail001CoverageAudit({ canonicalProblemId: cpId, count: input.countPerCp, seed }),
    ]),
  ) as Record<NsTrail001CanonicalProblemId, ReturnType<typeof generateNsTrail001CoverageAudit>>;
}

export function augmentNsTrail001Audit(canonicalProblemId: NsTrail001CanonicalProblemId, questionPackages: readonly NsTrail001QuestionPackage[], baseReport: ReturnType<typeof auditNsTrail001Batch>) {
  const repeated = topRepeatedQuestions(questionPackages, 10);
  return {
    ...baseReport,
    maximumExactQuestionRepetition: repeated[0]?.count ?? 1,
    repeatedQuestionExamples: repeated.map((entry) => `${entry.count}x ${entry.stem}`),
    topRepeatedQuestions: repeated,
    mathJaxUsage: relevantMathJaxUsage(canonicalProblemId, questionPackages),
    mathJaxFailures: relevantMathJaxFailures(canonicalProblemId, questionPackages),
    factorialMagnitudeCoverage: countMetadata(questionPackages, "factorialMagnitude"),
    factorialStructureCoverage: countMetadata(questionPackages, "factorialStructure"),
    targetZeroMagnitudeCoverage: countMetadata(questionPackages, "targetZeroMagnitude"),
    baseFamilyCoverage: countMetadata(questionPackages, "baseFamily"),
    exponentMagnitudeCoverage: countMetadata(questionPackages, "exponentMagnitude"),
    productStructureCoverage: countMetadata(questionPackages, "productStructure"),
  };
}

function relevantMathJaxUsage(canonicalProblemId: NsTrail001CanonicalProblemId, questionPackages: readonly NsTrail001QuestionPackage[]) {
  return Object.fromEntries(
    relevantMathJaxKeys(canonicalProblemId).map((key) => [key, questionPackages.filter((item) => typeof item[key] === "string" && item[key].length > 0).length]),
  );
}

function relevantMathJaxFailures(canonicalProblemId: NsTrail001CanonicalProblemId, questionPackages: readonly NsTrail001QuestionPackage[]) {
  const keys = relevantMathJaxKeys(canonicalProblemId);
  return questionPackages.filter((item) => keys.some((key) => typeof item[key] !== "string" || item[key].length === 0)).length;
}

function relevantMathJaxKeys(canonicalProblemId: NsTrail001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
      return ["factorFiveCountLatex"] as const;
    case "CP-002":
      return ["factorialExpressionLatex"] as const;
    case "CP-003":
      return ["searchProcessLatex"] as const;
    case "CP-004":
      return ["powerFactorizationLatex"] as const;
    case "CP-005":
      return ["productFactorizationLatex"] as const;
  }
}

function topRepeatedQuestions(questionPackages: readonly NsTrail001QuestionPackage[], limit: number) {
  const counts = questionPackages.reduce<Record<string, number>>((acc, item) => {
    acc[item.stem] = (acc[item.stem] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([stem, count]) => ({ stem, count }))
    .sort((a, b) => b.count - a.count || a.stem.localeCompare(b.stem))
    .slice(0, limit);
}

function countMetadata(questionPackages: readonly NsTrail001QuestionPackage[], key: string) {
  return questionPackages.reduce<Record<string, number>>((counts, item) => {
    const value = (item.parameters as unknown as Record<string, unknown>)[key] ?? "not-applicable";
    const bucket = String(value);
    counts[bucket] = (counts[bucket] ?? 0) + 1;
    return counts;
  }, {});
}
