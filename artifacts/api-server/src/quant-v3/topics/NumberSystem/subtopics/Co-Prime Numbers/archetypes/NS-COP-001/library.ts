import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import { NS_COP_001_MATHJAX_KEYS } from "./math";
import type { NsCop001Answer, NsCop001CanonicalProblemId, NsCop001QuestionPackage, NsCop001Topology } from "./types";

const ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"] as const;
const QL_IDS = Array.from({ length: 41 }, (_item, index) => `QL-${String(index + 1).padStart(3, "0")}`);
const ES_IDS = ["ES-001", "ES-002", "ES-003", "ES-004", "ES-005", "ES-006"];

export const NS_COP_001_LIBRARY_REGISTRY = {
  variableRanges: variableRangesLibrary,
  coverageTargets: coverageTargetsLibrary,
  questionLanguage: questionLanguageLibrary,
  explanation: explanationLibrary,
  distributionTargets: distributionTargetsLibrary,
} as const;

export function getNsCop001ActiveCanonicalProblemIds() {
  return [...ACTIVE_CP_IDS] as NsCop001CanonicalProblemId[];
}

export function validateNsCop001Libraries() {
  const failures: string[] = [];
  for (const library of [variableRangesLibrary, coverageTargetsLibrary, questionLanguageLibrary, explanationLibrary, distributionTargetsLibrary]) {
    if (library.archetypeId !== "NS-COP-001") failures.push(`${library.libraryId} archetype ID mismatch.`);
  }
  const cpIds = questionLanguageLibrary.canonicalProblems.map((entry) => entry.cpId);
  if (JSON.stringify(cpIds) !== JSON.stringify(ACTIVE_CP_IDS)) failures.push("Question language CP IDs must be CP-001 through CP-006.");
  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id)).sort();
  if (JSON.stringify(qlIds) !== JSON.stringify(QL_IDS)) failures.push("Question language IDs must be QL-001 through QL-041.");
  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  if (JSON.stringify(esIds) !== JSON.stringify(ES_IDS)) failures.push("Explanation IDs must be ES-001 through ES-006.");
  const variableNames = new Set(["a", "b", "number", "nextNumber", "numberList", "targetNumber", "numberSet"]);
  for (const cp of questionLanguageLibrary.canonicalProblems) {
    for (const entry of cp.entries) {
      for (const placeholder of extractPlaceholders(entry.text)) {
        if (!variableNames.has(placeholder)) failures.push(`${entry.id} uses unapproved placeholder {${placeholder}}.`);
      }
      for (const required of requiredQuestionPlaceholders(cp.cpId as NsCop001CanonicalProblemId, entry.id)) {
        if (!entry.text.includes(`{${required}}`)) failures.push(`${entry.id} is missing required placeholder {${required}}.`);
      }
    }
  }
  const mathJaxNames = new Set(explanationLibrary.mathJaxSupport.supportedPlaceholders);
  for (const key of NS_COP_001_MATHJAX_KEYS) {
    if (!mathJaxNames.has(key)) failures.push(`Missing MathJax object ${key}.`);
  }
  for (const family of explanationLibrary.families) {
    for (const entry of family.entries) {
      for (const placeholder of extractPlaceholders(entry.text)) {
        if (!["a", "b", "hcf", "decisionText", "answer", "targetNumber", "number", "nextNumber"].includes(placeholder) && !mathJaxNames.has(placeholder)) {
          failures.push(`${entry.id} uses unapproved explanation placeholder {${placeholder}}.`);
        }
      }
    }
  }
  return { valid: failures.length === 0, failures };
}

export function getTopology(canonicalProblemId: NsCop001CanonicalProblemId): NsCop001Topology {
  switch (canonicalProblemId) {
    case "CP-001": return "Co-Prime Check";
    case "CP-002": return "Count Co-Primes From A List";
    case "CP-003": return "Missing Number For Co-Prime Condition";
    case "CP-004": return "Count Co-Prime Pairs";
    case "CP-005": return "Consecutive Number Co-Prime Property";
    case "CP-006": return "Ratio Reduction To Lowest Form";
  }
}

export function getQuestionLanguageEntries(canonicalProblemId: NsCop001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!cp) throw new Error(`NS-COP-001 question language missing for ${canonicalProblemId}.`);
  return cp.entries;
}

export function getQuestionLanguageEntry(canonicalProblemId: NsCop001CanonicalProblemId, questionLanguageId: string) {
  const entry = getQuestionLanguageEntries(canonicalProblemId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Question language ID ${questionLanguageId} is not approved for ${canonicalProblemId}.`);
  return entry;
}

export function getExplanationEntries(canonicalProblemId: NsCop001CanonicalProblemId) {
  return getExplanationFamily(canonicalProblemId).entries;
}

export function getExplanationFamily(canonicalProblemId: NsCop001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(canonicalProblemId));
  if (!family) throw new Error(`NS-COP-001 explanation family missing for ${canonicalProblemId}.`);
  return family;
}

export function renderQuestionLanguage(input: { canonicalProblemId: NsCop001CanonicalProblemId; questionLanguageId: string; values: Record<string, number | string | undefined> }) {
  return replacePlaceholders(getQuestionLanguageEntry(input.canonicalProblemId, input.questionLanguageId).text, input.values);
}

export function renderExplanationLanguage(input: { canonicalProblemId: NsCop001CanonicalProblemId; styleId: string; answer: NsCop001Answer; values: Record<string, number | string | undefined> }) {
  const family = getExplanationFamily(input.canonicalProblemId);
  const entry = family.entries.find((item) => item.id === input.styleId);
  if (!entry) throw new Error(`Explanation ID ${input.styleId} is not approved for ${input.canonicalProblemId}.`);
  return { familyId: family.familyId, lines: replacePlaceholders(entry.text, { ...input.values, answer: input.answer }).split("\n") };
}

export function auditNsCop001Batch(questionPackages: readonly NsCop001QuestionPackage[], generationFailures = 0) {
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
    traceabilityFailures: questionPackages.filter((item) => item.traceability.questionId !== item.questionId || item.traceability.answer !== item.answer || item.traceability.graphId !== item.reasoningGraph.graphId).length,
    mathJaxFailures: questionPackages.filter((item) => !NS_COP_001_MATHJAX_KEYS.every((key) => item[key].length > 0)).length,
    unusedQuestionLanguageIds: allQlIds.filter((id) => !qlDistribution[id]),
    unusedExplanationIds: allEsIds.filter((id) => !esDistribution[id]),
    maximumExactQuestionRepetition: repeated[0]?.[1] ?? 1,
    repeatedQuestionExamples: repeated.slice(0, 5).map(([stem, count]) => `${count}x ${stem}`),
    difficultyDistribution: countBy(questionPackages.map((item) => item.difficultyBand)),
    canonicalProblemDistribution: countBy(questionPackages.map((item) => item.canonicalProblemId)),
    cp001AnswerTypeCoverage: countBy(questionPackages.map((item) => item.solver.cp001AnswerType ?? "not-applicable")),
    coprimeStatusCoverage: countBy(questionPackages.map((item) => item.solver.coprimeStatus ?? "not-applicable")),
    hcfBucketCoverage: countBy(questionPackages.map((item) => item.solver.hcfBucket)),
    commonFactorBucketCoverage: countBy(questionPackages.map((item) => item.solver.commonFactorBucket)),
    listLengthCoverage: countBy(questionPackages.map((item) => item.solver.listLength ?? "not-applicable")),
    coprimeDensityCoverage: countBy(questionPackages.map((item) => item.solver.coprimeDensity ?? "not-applicable")),
    candidateCountCoverage: countBy(questionPackages.map((item) => item.solver.candidateCount ?? "not-applicable")),
    distractorCountCoverage: countBy(questionPackages.map((item) => item.solver.distractorCount ?? "not-applicable")),
    setSizeCoverage: countBy(questionPackages.map((item) => item.solver.setSize ?? "not-applicable")),
    pairCountCoverage: countBy(questionPackages.map((item) => item.solver.pairCount ?? "not-applicable")),
    ratioTypeCoverage: countBy(questionPackages.map((item) => item.solver.ratioType ?? "not-applicable")),
    hcfSizeCoverage: countBy(questionPackages.map((item) => item.solver.hcfSize)),
    questionLanguageDistribution: qlDistribution,
    explanationDistribution: esDistribution,
    mathJaxUsage: Object.fromEntries(NS_COP_001_MATHJAX_KEYS.map((key) => [key, questionPackages.filter((item) => Boolean(item[key])).length])),
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

function requiredQuestionPlaceholders(canonicalProblemId: NsCop001CanonicalProblemId, questionLanguageId: string) {
  switch (canonicalProblemId) {
    case "CP-001": return ["a", "b"];
    case "CP-002": return questionLanguageId === "QL-034" || questionLanguageId === "QL-035" ? ["targetNumber"] : ["numberList", "targetNumber"];
    case "CP-003": return ["number"];
    case "CP-004": return questionLanguageId === "QL-037" || questionLanguageId === "QL-038" ? [] : ["numberSet"];
    case "CP-005": return questionLanguageId === "QL-023" ? [] : ["number", "nextNumber"];
    case "CP-006": return questionLanguageId === "QL-028" ? [] : ["a", "b"];
  }
}

function countBy(values: readonly unknown[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}
