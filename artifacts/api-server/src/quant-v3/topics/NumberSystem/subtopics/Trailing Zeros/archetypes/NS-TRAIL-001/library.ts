import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import { NS_TRAIL_001_MATHJAX_KEYS } from "./math";
import type {
  NsTrail001CanonicalProblemId,
  NsTrail001QuestionPackage,
  NsTrail001Topology,
} from "./types";

const ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005"] as const;
const QL_IDS = Array.from({ length: 39 }, (_value, index) => `QL-${String(index + 1).padStart(3, "0")}`);
const ES_IDS = ["ES-001", "ES-002", "ES-003", "ES-004", "ES-005"] as const;

export const NS_TRAIL_001_LIBRARY_REGISTRY = {
  variableRanges: variableRangesLibrary,
  coverageTargets: coverageTargetsLibrary,
  questionLanguage: questionLanguageLibrary,
  explanation: explanationLibrary,
  distributionTargets: distributionTargetsLibrary,
} as const;

export function getNsTrail001ActiveCanonicalProblemIds() {
  return [...ACTIVE_CP_IDS] as NsTrail001CanonicalProblemId[];
}

export function validateNsTrail001Libraries() {
  const failures: string[] = [];
  for (const library of [variableRangesLibrary, coverageTargetsLibrary, questionLanguageLibrary, explanationLibrary, distributionTargetsLibrary]) {
    if (library.archetypeId !== "NS-TRAIL-001") failures.push(`${library.libraryId} archetype ID mismatch.`);
  }

  const cpIds = questionLanguageLibrary.canonicalProblems.map((entry) => entry.cpId);
  if (JSON.stringify(cpIds) !== JSON.stringify(ACTIVE_CP_IDS)) failures.push("Question language CP IDs must be CP-001 through CP-005.");

  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  if (qlIds.length !== 39) failures.push("Question language library must contain exactly 39 stems.");
  if (new Set(qlIds).size !== qlIds.length) failures.push("Question language IDs must be unique.");
  for (const id of QL_IDS) {
    if (!qlIds.includes(id)) failures.push(`Missing approved question language ID ${id}.`);
  }

  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  if (JSON.stringify(esIds) !== JSON.stringify(ES_IDS)) failures.push("Explanation IDs must be ES-001 through ES-005.");

  const allowedQuestionPlaceholders = new Set(["n", "expression", "zeroCount", "base", "exponent", "numberA", "numberB"]);
  for (const cp of questionLanguageLibrary.canonicalProblems) {
    for (const entry of cp.entries) {
      for (const placeholder of extractPlaceholders(entry.text)) {
        if (!allowedQuestionPlaceholders.has(placeholder)) failures.push(`${entry.id} uses unapproved placeholder {${placeholder}}.`);
      }
      for (const required of requiredQuestionPlaceholders(cp.cpId as NsTrail001CanonicalProblemId)) {
        if (!entry.text.includes(`{${required}}`)) failures.push(`${entry.id} is missing required placeholder {${required}}.`);
      }
    }
  }

  const supportedMathJax = new Set(explanationLibrary.mathJaxSupport.supportedPlaceholders);
  for (const key of NS_TRAIL_001_MATHJAX_KEYS) {
    if (!supportedMathJax.has(key)) failures.push(`Missing MathJax object ${key}.`);
  }
  for (const family of explanationLibrary.families) {
    if (family.entries.length !== 1) failures.push(`${family.familyId} must have exactly one approved explanation.`);
    for (const entry of family.entries) {
      for (const placeholder of extractPlaceholders(entry.text)) {
        if (placeholder !== "answer" && placeholder !== "n" && placeholder !== "zeroCount" && !supportedMathJax.has(placeholder)) {
          failures.push(`${entry.id} uses unapproved explanation placeholder {${placeholder}}.`);
        }
      }
      for (const required of requiredExplanationPlaceholders(family.appliesTo[0] as NsTrail001CanonicalProblemId)) {
        if (!entry.text.includes(`{${required}}`)) failures.push(`${entry.id} missing {${required}}.`);
      }
    }
  }

  if (JSON.stringify(coverageTargetsLibrary).includes("nearestBelow")) failures.push("nearestBelow must not remain in CP-003 coverage.");
  if (JSON.stringify(coverageTargetsLibrary).includes("nearestAbove")) failures.push("nearestAbove must not remain in CP-003 coverage.");
  for (const bucket of ["crosses25", "crosses125", "crosses625"]) {
    if (!coverageTargetsLibrary.targets.cp001FactorialSizeCoverage.buckets.includes(bucket)) failures.push(`CP-001 coverage missing ${bucket}.`);
  }
  for (const bucket of ["solutionExists", "smallZeroCount", "mediumZeroCount", "largeZeroCount"]) {
    if (!coverageTargetsLibrary.targets.cp003SearchCoverage.buckets.includes(bucket)) failures.push(`CP-003 coverage missing ${bucket}.`);
  }

  return { valid: failures.length === 0, failures };
}

export function getTopology(canonicalProblemId: NsTrail001CanonicalProblemId): NsTrail001Topology {
  switch (canonicalProblemId) {
    case "CP-001":
      return "Count Trailing Zeros In n!";
    case "CP-002":
      return "Count Trailing Zeros In Factorial Expressions";
    case "CP-003":
      return "Smallest Number Whose Factorial Has Given Trailing Zeros";
    case "CP-004":
      return "Count Trailing Zeros In Powers";
    case "CP-005":
      return "Determine Change In Trailing Zeros After Multiplication";
  }
}

export function getQuestionLanguageEntries(canonicalProblemId: NsTrail001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!cp) throw new Error(`NS-TRAIL-001 question language is missing for ${canonicalProblemId}.`);
  return cp.entries;
}

export function getQuestionLanguageEntry(canonicalProblemId: NsTrail001CanonicalProblemId, questionLanguageId: string) {
  const entry = getQuestionLanguageEntries(canonicalProblemId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Question language ID ${questionLanguageId} is not approved for ${canonicalProblemId}.`);
  return entry;
}

export function getExplanationFamily(canonicalProblemId: NsTrail001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(canonicalProblemId));
  if (!family) throw new Error(`NS-TRAIL-001 explanation family is missing for ${canonicalProblemId}.`);
  return family;
}

export function getExplanationEntries(canonicalProblemId: NsTrail001CanonicalProblemId) {
  return getExplanationFamily(canonicalProblemId).entries;
}

export function renderQuestionLanguage(input: {
  canonicalProblemId: NsTrail001CanonicalProblemId;
  questionLanguageId: string;
  values: Record<string, number | string | undefined>;
}) {
  const entry = getQuestionLanguageEntry(input.canonicalProblemId, input.questionLanguageId);
  return replacePlaceholders(entry.text, input.values);
}

export function renderExplanationLanguage(input: {
  canonicalProblemId: NsTrail001CanonicalProblemId;
  styleId: string;
  answer: number;
  values: Record<string, number | string | undefined>;
}) {
  const family = getExplanationFamily(input.canonicalProblemId);
  const entry = family.entries.find((item) => item.id === input.styleId);
  if (!entry) throw new Error(`Explanation ID ${input.styleId} is not approved for ${input.canonicalProblemId}.`);
  return {
    familyId: family.familyId,
    lines: replacePlaceholders(entry.text, { ...input.values, answer: input.answer }).split("\n"),
  };
}

export function auditNsTrail001Batch(questionPackages: readonly NsTrail001QuestionPackage[], generationFailures = 0) {
  const canonicalProblemId = questionPackages[0]?.canonicalProblemId;
  const allQlIds = canonicalProblemId ? getQuestionLanguageEntries(canonicalProblemId).map((entry) => entry.id) : [];
  const allEsIds = canonicalProblemId ? getExplanationEntries(canonicalProblemId).map((entry) => entry.id) : [];
  const qlDistribution = countBy(questionPackages.map((item) => item.questionLanguageId));
  const esDistribution = countBy(questionPackages.map((item) => item.explanationStyleId));
  const stemDistribution = countBy(questionPackages.map((item) => item.stem));
  const repeated = Object.entries(stemDistribution).filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]);
  return {
    questionCount: questionPackages.length,
    generationFailures,
    validationFailures: questionPackages.filter((item) => !item.validation.valid).length,
    traceabilityFailures: questionPackages.filter((item) => traceabilityMissing(item)).length,
    mathJaxFailures: questionPackages.filter((item) => !mathJaxPresent(item)).length,
    unusedQuestionLanguageIds: allQlIds.filter((id) => !qlDistribution[id]),
    unusedExplanationIds: allEsIds.filter((id) => !esDistribution[id]),
    maximumExactQuestionRepetition: repeated[0]?.[1] ?? 1,
    repeatedQuestionExamples: repeated.slice(0, 5).map(([stem, count]) => `${count}x ${stem}`),
    difficultyDistribution: countBy(questionPackages.map((item) => item.difficultyBand)),
    canonicalProblemDistribution: countBy(questionPackages.map((item) => item.canonicalProblemId)),
    questionLanguageDistribution: qlDistribution,
    explanationDistribution: esDistribution,
    nBucketCoverage: countBy(questionPackages.map((item) => item.solver.nBucket)),
    largestPowerOfFiveReachedCoverage: countBy(questionPackages.map((item) => item.solver.largestPowerOfFiveReached)),
    expressionTypeCoverage: countBy(questionPackages.map((item) => item.solver.expressionType ?? "not-applicable")),
    factorialTermCountCoverage: countBy(questionPackages.map((item) => item.solver.factorialTermCount ?? "not-applicable")),
    targetZeroBucketCoverage: countBy(questionPackages.map((item) => item.solver.targetZeroBucket ?? "not-applicable")),
    searchIterationsCoverage: countBy(questionPackages.map((item) => searchIterationBucket(item.solver.searchIterations))),
    baseFactorizationTypeCoverage: countBy(questionPackages.map((item) => item.solver.baseFactorizationType ?? "not-applicable")),
    powerMagnitudeCoverage: countBy(questionPackages.map((item) => item.solver.powerMagnitude ?? "not-applicable")),
    productTypeCoverage: countBy(questionPackages.map((item) => item.solver.productType ?? "not-applicable")),
    twoCountCoverage: countBy(questionPackages.map((item) => factorBucket(item.solver.twoCount))),
    fiveCountCoverage: countBy(questionPackages.map((item) => factorBucket(item.solver.fiveCount))),
    pairCountCoverage: countBy(questionPackages.map((item) => factorBucket(item.solver.pairCount))),
    mathJaxUsage: Object.fromEntries(NS_TRAIL_001_MATHJAX_KEYS.map((key) => [key, questionPackages.filter((item) => Boolean(item[key])).length])),
  };
}

export function extractPlaceholders(text: string) {
  return [...text.matchAll(/\{([A-Za-z]+)\}/g)].map((match) => match[1]);
}

export function replacePlaceholders(text: string, values: Record<string, number | string | undefined>) {
  return text.replaceAll(/\{([A-Za-z]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "number" && typeof value !== "string") throw new Error(`Missing value for placeholder: ${key}`);
    return String(value);
  });
}

function requiredQuestionPlaceholders(canonicalProblemId: NsTrail001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
      return ["n"];
    case "CP-002":
      return ["expression"];
    case "CP-003":
      return ["zeroCount"];
    case "CP-004":
      return ["base", "exponent"];
    case "CP-005":
      return ["numberA", "numberB"];
  }
}

function requiredExplanationPlaceholders(canonicalProblemId: NsTrail001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
      return ["factorFiveCountLatex", "n", "answer"];
    case "CP-002":
      return ["factorialExpressionLatex", "answer"];
    case "CP-003":
      return ["searchProcessLatex", "zeroCount", "answer"];
    case "CP-004":
      return ["powerFactorizationLatex", "answer"];
    case "CP-005":
      return ["productFactorizationLatex", "answer"];
  }
}

function countBy(values: readonly (number | string | boolean)[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function traceabilityMissing(item: NsTrail001QuestionPackage) {
  return (
    !item.traceability.questionId ||
    !item.traceability.questionLanguageId ||
    !item.traceability.explanationStyleId ||
    !item.traceability.difficulty ||
    item.traceability.answer !== item.answer ||
    item.traceability.graphId !== item.reasoningGraph.graphId ||
    !mathJaxPresent(item)
  );
}

function mathJaxPresent(item: Record<string, unknown>) {
  return NS_TRAIL_001_MATHJAX_KEYS.every((key) => typeof item[key] === "string" && String(item[key]).length > 0);
}

function searchIterationBucket(value: number | undefined) {
  if (typeof value !== "number") return "not-applicable";
  if (value <= 25) return "smallSearch";
  if (value <= 150) return "mediumSearch";
  return "largeSearch";
}

function factorBucket(value: number | undefined) {
  if (typeof value !== "number") return "not-applicable";
  if (value === 0) return "zero";
  if (value <= 3) return "small";
  if (value <= 10) return "medium";
  return "large";
}
