import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import { NS_LCM_001_MATHJAX_KEYS, lcmSizeBucket, rangeWidthBucket } from "./math";
import type {
  NsLcm001Answer,
  NsLcm001CanonicalProblemId,
  NsLcm001QuestionPackage,
  NsLcm001Topology,
} from "./types";

const ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005"] as const;
const QL_IDS = [
  "QL-001",
  "QL-002",
  "QL-003",
  "QL-004",
  "QL-005",
  "QL-006",
  "QL-007",
  "QL-008",
  "QL-009",
  "QL-010",
  "QL-024",
  "QL-025",
  "QL-026",
  "QL-027",
  "QL-028",
  "QL-011",
  "QL-012",
  "QL-013",
  "QL-014",
  "QL-016",
  "QL-017",
  "QL-018",
  "QL-019",
  "QL-020",
  "QL-021",
  "QL-022",
  "QL-023",
  "QL-029",
] as const;

export const NS_LCM_001_LIBRARY_REGISTRY = {
  variableRanges: variableRangesLibrary,
  coverageTargets: coverageTargetsLibrary,
  questionLanguage: questionLanguageLibrary,
  explanation: explanationLibrary,
  distributionTargets: distributionTargetsLibrary,
} as const;

export function getNsLcm001ActiveCanonicalProblemIds() {
  return [...ACTIVE_CP_IDS] as NsLcm001CanonicalProblemId[];
}

export function validateNsLcm001Libraries() {
  const failures: string[] = [];
  for (const library of [variableRangesLibrary, coverageTargetsLibrary, questionLanguageLibrary, explanationLibrary, distributionTargetsLibrary]) {
    if (library.archetypeId !== "NS-LCM-001") failures.push(`${library.libraryId} archetype ID mismatch.`);
  }
  const cpIds = questionLanguageLibrary.canonicalProblems.map((entry) => entry.cpId);
  if (JSON.stringify(cpIds) !== JSON.stringify(ACTIVE_CP_IDS)) failures.push("Question language CP IDs must be CP-001 through CP-005.");

  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  if (JSON.stringify(qlIds) !== JSON.stringify(QL_IDS)) failures.push("Question language IDs must match the approved repaired set.");
  if (qlIds.includes("QL-015")) failures.push("QL-015 must not exist.");
  if (new Set(qlIds).size !== qlIds.length) failures.push("Question language IDs must be unique.");

  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  if (JSON.stringify(esIds) !== JSON.stringify(["ES-001", "ES-002", "ES-003", "ES-004", "ES-005"])) failures.push("Explanation IDs must be ES-001 through ES-005.");

  const variableNames = new Set(["numbers", "cycleLengths", "knownNumbers", "targetLcm", "candidateSet", "lowerBound", "upperBound", "divisor", "threshold"]);
  for (const cp of questionLanguageLibrary.canonicalProblems) {
    for (const entry of cp.entries) {
      for (const placeholder of extractPlaceholders(entry.text)) {
        if (!variableNames.has(placeholder)) failures.push(`${entry.id} uses placeholder {${placeholder}} not approved by variable ranges.`);
      }
      for (const required of requiredQuestionPlaceholders(entry.id, cp.cpId as NsLcm001CanonicalProblemId)) {
        if (!entry.text.includes(`{${required}}`)) failures.push(`${entry.id} is missing required placeholder {${required}}.`);
      }
    }
  }

  const mathJaxNames = new Set(explanationLibrary.mathJaxSupport.supportedPlaceholders);
  for (const key of NS_LCM_001_MATHJAX_KEYS) {
    if (!mathJaxNames.has(key)) failures.push(`Missing MathJax object ${key}.`);
  }
  for (const family of explanationLibrary.families) {
    if (family.entries.length === 0) failures.push(`${family.familyId} has no explanation entries.`);
    for (const entry of family.entries) {
      for (const placeholder of extractPlaceholders(entry.text)) {
        if (placeholder !== "answer" && placeholder !== "targetLcm" && placeholder !== "threshold" && !mathJaxNames.has(placeholder)) {
          failures.push(`${entry.id} uses unapproved explanation placeholder {${placeholder}}.`);
        }
      }
      for (const required of requiredExplanationPlaceholders(family.appliesTo[0] as NsLcm001CanonicalProblemId)) {
        if (!entry.text.includes(`{${required}}`)) failures.push(`${entry.id} missing {${required}}.`);
      }
    }
  }

  if (!coverageTargetsLibrary.targets.exactLcmMatch?.required) failures.push("exactLcmMatch must be required.");
  for (const target of Object.values(coverageTargetsLibrary.targets)) {
    if (!target || typeof target !== "object") failures.push("Every coverage target must be auditable.");
  }
  const forbidden = JSON.stringify({ questionLanguageLibrary, explanationLibrary }).toLowerCase();
  for (const phrase of ["fallback", "generic fallback", "invent stems", "invent explanations"]) {
    if (forbidden.includes(phrase)) failures.push(`Generic fallback wording is not allowed in educational libraries: ${phrase}`);
  }
  return { valid: failures.length === 0, failures };
}

export function getTopology(canonicalProblemId: NsLcm001CanonicalProblemId): NsLcm001Topology {
  switch (canonicalProblemId) {
    case "CP-001":
      return "Direct LCM Computation";
    case "CP-002":
      return "Common Cycle Synchronization";
    case "CP-003":
      return "Missing Number Using LCM";
    case "CP-004":
      return "Count Common Multiples In A Range";
    case "CP-005":
      return "Smallest Common Multiple Greater Than A Threshold";
  }
}

export function getQuestionLanguageEntries(canonicalProblemId: NsLcm001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!cp) throw new Error(`NS-LCM-001 question language is missing for ${canonicalProblemId}.`);
  return cp.entries;
}

export function getQuestionLanguageEntry(canonicalProblemId: NsLcm001CanonicalProblemId, questionLanguageId: string) {
  const entry = getQuestionLanguageEntries(canonicalProblemId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Question language ID ${questionLanguageId} is not approved for ${canonicalProblemId}.`);
  return entry;
}

export function getExplanationEntries(canonicalProblemId: NsLcm001CanonicalProblemId) {
  return getExplanationFamily(canonicalProblemId).entries;
}

export function getExplanationFamily(canonicalProblemId: NsLcm001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(canonicalProblemId));
  if (!family) throw new Error(`NS-LCM-001 explanation family is missing for ${canonicalProblemId}.`);
  return family;
}

export function renderQuestionLanguage(input: {
  canonicalProblemId: NsLcm001CanonicalProblemId;
  questionLanguageId: string;
  values: Record<string, number | string | undefined>;
}) {
  const entry = getQuestionLanguageEntry(input.canonicalProblemId, input.questionLanguageId);
  return replacePlaceholders(entry.text, input.values);
}

export function renderExplanationLanguage(input: {
  canonicalProblemId: NsLcm001CanonicalProblemId;
  styleId: string;
  answer: NsLcm001Answer;
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

export function auditNsLcm001Batch(questionPackages: readonly NsLcm001QuestionPackage[], generationFailures = 0) {
  const allQlIds = questionPackages.length > 0 ? getQuestionLanguageEntries(questionPackages[0].canonicalProblemId).map((entry) => entry.id) : [];
  const allEsIds = questionPackages.length > 0 ? getExplanationEntries(questionPackages[0].canonicalProblemId).map((entry) => entry.id) : [];
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
    questionLanguageDistribution: qlDistribution,
    explanationDistribution: esDistribution,
    operandCountCoverage: countBy(questionPackages.map((item) => item.solver.operandCount)),
    pairwiseCoprimeCoverage: countBy(questionPackages.map((item) => item.solver.pairwiseCoprime)),
    nonCoprimeCoverage: countBy(questionPackages.map((item) => item.solver.nonCoprime)),
    lcmSizeCoverage: countBy(questionPackages.map((item) => lcmSizeBucket(item.solver.lcm))),
    distinctPrimeBaseCountCoverage: countBy(questionPackages.map((item) => item.solver.distinctPrimeBaseCount)),
    maximumExponentCoverage: countBy(questionPackages.map((item) => item.solver.maximumExponent)),
    cycleContextCoverage: countBy(questionPackages.map((item) => item.cycleContext ?? "not-applicable")),
    cp003FamilyCoverage: countBy(questionPackages.map((item) => item.cp003Family ?? "not-applicable")),
    rangeWidthCoverage: countBy(questionPackages.map((item) => rangeWidthBucket(item.solver.rangeWidth))),
    zeroCountCaseCoverage: countBy(questionPackages.map((item) => item.solver.zeroCountCase ?? "not-applicable")),
    positiveCountCaseCoverage: countBy(questionPackages.map((item) => item.solver.positiveCountCase ?? "not-applicable")),
    thresholdIsMultipleCoverage: countBy(questionPackages.map((item) => item.solver.thresholdIsMultiple ?? "not-applicable")),
    thresholdNotMultipleCoverage: countBy(questionPackages.map((item) => item.solver.thresholdNotMultiple ?? "not-applicable")),
    exactLcmMatchCoverage: countBy(questionPackages.map((item) => item.solver.exactLcmMatch ?? "not-applicable")),
    mathJaxObjectCoverage: Object.fromEntries(NS_LCM_001_MATHJAX_KEYS.map((key) => [key, questionPackages.filter((item) => Boolean(item[key])).length])),
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

function requiredQuestionPlaceholders(questionLanguageId: string, canonicalProblemId: NsLcm001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
      return ["numbers"];
    case "CP-002":
      return ["cycleLengths"];
    case "CP-003":
      if (questionLanguageId === "QL-011") return ["knownNumbers", "targetLcm", "candidateSet"];
      if (questionLanguageId === "QL-012") return ["knownNumbers", "targetLcm", "lowerBound", "upperBound"];
      if (questionLanguageId === "QL-013") return ["knownNumbers", "targetLcm", "divisor"];
      return ["knownNumbers", "targetLcm", "upperBound"];
    case "CP-004":
      return ["numbers", "lowerBound", "upperBound"];
    case "CP-005":
      return ["numbers", "threshold"];
  }
}

function requiredExplanationPlaceholders(canonicalProblemId: NsLcm001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
      return ["operandFactorizationLatex", "primeUnionLatex", "maximumExponentSelectionLatex", "lcmLatex"];
    case "CP-002":
      return ["synchronizationInterpretationLatex", "lcmLatex"];
    case "CP-003":
      return ["targetLcm", "candidateEvaluationLatex"];
    case "CP-004":
      return ["lcmLatex", "rangeCountFormulaLatex"];
    case "CP-005":
      return ["lcmLatex", "threshold", "thresholdSelectionFormulaLatex"];
  }
}

function countBy(values: readonly (number | string | boolean)[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function traceabilityMissing(item: NsLcm001QuestionPackage) {
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
  return NS_LCM_001_MATHJAX_KEYS.every((key) => typeof item[key] === "string" && String(item[key]).length > 0);
}
