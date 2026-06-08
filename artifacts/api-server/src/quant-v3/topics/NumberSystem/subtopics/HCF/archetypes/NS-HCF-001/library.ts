import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import { NS_HCF_001_MATHJAX_KEYS } from "./math";
import type {
  NsHcf001Answer,
  NsHcf001CanonicalProblemId,
  NsHcf001DifficultyBand,
  NsHcf001QuestionPackage,
  NsHcf001Topology,
} from "./types";

const ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004"] as const;

export const NS_HCF_001_LIBRARY_REGISTRY = {
  variableRanges: variableRangesLibrary,
  coverageTargets: coverageTargetsLibrary,
  questionLanguage: questionLanguageLibrary,
  explanation: explanationLibrary,
  distributionTargets: distributionTargetsLibrary,
} as const;

export function getNsHcf001ActiveCanonicalProblemIds() {
  return [...ACTIVE_CP_IDS] as NsHcf001CanonicalProblemId[];
}

export function validateNsHcf001Libraries() {
  const failures: string[] = [];
  for (const library of [variableRangesLibrary, coverageTargetsLibrary, questionLanguageLibrary, explanationLibrary, distributionTargetsLibrary]) {
    if (library.archetypeId !== "NS-HCF-001") failures.push(`${library.libraryId} archetype ID mismatch.`);
  }

  const qlCpIds = questionLanguageLibrary.canonicalProblems.map((entry) => entry.cpId);
  if (JSON.stringify(qlCpIds) !== JSON.stringify(ACTIVE_CP_IDS)) failures.push("Question language CP IDs must be CP-001 through CP-004.");

  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  const expectedQlIds = Array.from({ length: 65 }, (_value, index) => `QL-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(qlIds) !== JSON.stringify(expectedQlIds)) failures.push("Question language IDs must be QL-001 through QL-065.");
  if (new Set(qlIds).size !== qlIds.length) failures.push("Question language IDs must be unique.");

  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  const expectedEsIds = Array.from({ length: 10 }, (_value, index) => `ES-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(esIds) !== JSON.stringify(expectedEsIds)) failures.push("Explanation IDs must be ES-001 through ES-010.");

  const qlText = JSON.stringify(questionLanguageLibrary);
  if (qlText.includes("uniquenessConstraint")) failures.push("Question language must not include uniquenessConstraint.");

  for (const cp of questionLanguageLibrary.canonicalProblems) {
    for (const entry of cp.entries) {
      const placeholders = extractPlaceholders(entry.text);
      for (const placeholder of placeholders) {
        if (!approvedQuestionPlaceholders(cp.cpId as NsHcf001CanonicalProblemId).includes(placeholder)) {
          failures.push(`${entry.id} has unapproved placeholder {${placeholder}}.`);
        }
      }
      for (const required of requiredQuestionPlaceholders(entry.id, cp.cpId as NsHcf001CanonicalProblemId)) {
        if (!placeholders.includes(required)) failures.push(`${entry.id} is missing required placeholder {${required}}.`);
      }
    }
  }

  for (const family of explanationLibrary.families) {
    for (const entry of family.entries) {
      const placeholders = extractPlaceholders(entry.text);
      if (!placeholders.includes("answer")) failures.push(`${entry.id} must include {answer}.`);
      for (const required of requiredExplanationPlaceholders(family.appliesTo[0] as NsHcf001CanonicalProblemId)) {
        if (!placeholders.includes(required)) failures.push(`${entry.id} is missing evidence placeholder {${required}}.`);
      }
    }
  }

  const mathJaxObjects = explanationLibrary.mathJaxSupport.supportedPlaceholders;
  for (const key of NS_HCF_001_MATHJAX_KEYS) {
    if (!mathJaxObjects.includes(key)) failures.push(`Explanation library must support ${key}.`);
  }

  return { valid: failures.length === 0, failures };
}

export function getTopology(canonicalProblemId: NsHcf001CanonicalProblemId): NsHcf001Topology {
  switch (canonicalProblemId) {
    case "CP-001":
      return "Direct HCF";
    case "CP-002":
      return "Common Divisor Count";
    case "CP-003":
      return "Missing Number Using HCF";
    case "CP-004":
      return "Equal Grouping Application";
  }
}

export function getQuestionLanguageEntries(canonicalProblemId: NsHcf001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!cp) throw new Error(`NS-HCF-001 question language is missing for ${canonicalProblemId}.`);
  return cp.entries;
}

export function getQuestionLanguageEntry(canonicalProblemId: NsHcf001CanonicalProblemId, questionLanguageId: string) {
  const entry = getQuestionLanguageEntries(canonicalProblemId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Question language ID ${questionLanguageId} is not approved for ${canonicalProblemId}.`);
  return entry;
}

export function getExplanationEntries(canonicalProblemId: NsHcf001CanonicalProblemId) {
  const family = getExplanationFamily(canonicalProblemId);
  return family.entries;
}

export function getExplanationFamily(canonicalProblemId: NsHcf001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(canonicalProblemId));
  if (!family) throw new Error(`NS-HCF-001 explanation family is missing for ${canonicalProblemId}.`);
  return family;
}

export function renderQuestionLanguage(input: {
  canonicalProblemId: NsHcf001CanonicalProblemId;
  questionLanguageId: string;
  values: Record<string, number | string | undefined>;
}) {
  const entry = getQuestionLanguageEntry(input.canonicalProblemId, input.questionLanguageId);
  return replacePlaceholders(entry.text, input.values);
}

export function renderExplanationLanguage(input: {
  canonicalProblemId: NsHcf001CanonicalProblemId;
  styleId: string;
  answer: NsHcf001Answer;
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

export function auditNsHcf001Batch(questionPackages: readonly NsHcf001QuestionPackage[], generationFailures = 0) {
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
    cpFamilyDistribution: countBy(questionPackages.map((item) => item.cp003Family ?? "not-applicable")),
    contextFamilyDistribution: countBy(questionPackages.map((item) => String(getQuestionLanguageEntry(item.canonicalProblemId, item.questionLanguageId).family ?? "not-applicable"))),
    operandCountDistribution: countBy(questionPackages.map((item) => item.numbers.length)),
    hcfValueDistribution: countBy(questionPackages.map((item) => (item.solver.hcf === 1 ? "hcf_equals_1" : "hcf_greater_than_1"))),
    mathJaxObjectCoverage: Object.fromEntries(NS_HCF_001_MATHJAX_KEYS.map((key) => [key, questionPackages.filter((item) => Boolean(item[key])).length])),
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

function requiredQuestionPlaceholders(questionLanguageId: string, canonicalProblemId: NsHcf001CanonicalProblemId) {
  if (canonicalProblemId === "CP-001" || canonicalProblemId === "CP-002") return ["numbers"];
  if (canonicalProblemId === "CP-004") return [];
  const idNumber = Number(questionLanguageId.slice(3));
  if (idNumber >= 16 && idNumber <= 20) return ["knownOperands", "targetHcf", "rangeStart", "rangeEnd"];
  if (idNumber >= 21 && idNumber <= 25) return ["knownOperands", "targetHcf", "numberList"];
  if (idNumber >= 26 && idNumber <= 30) return ["knownOperands", "targetHcf", "divisibleBy", "notDivisibleBy"];
  if (idNumber === 32 || idNumber === 34) return ["knownOperands", "targetHcf", "baseNumber", "decrease"];
  if (idNumber >= 31 && idNumber <= 35) return ["knownOperands", "targetHcf", "baseNumber", "increase"];
  if (idNumber === 36 || idNumber === 39) return ["knownOperands", "targetHcf", "rangeStart", "rangeEnd"];
  if (idNumber === 37 || idNumber === 40) return ["knownOperands", "targetHcf", "numberList"];
  if (idNumber === 38) return ["knownOperands", "targetHcf", "divisibleBy", "notDivisibleBy"];
  return ["knownOperands", "targetHcf"];
}

function approvedQuestionPlaceholders(canonicalProblemId: NsHcf001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
    case "CP-002":
      return ["numbers"];
    case "CP-003":
      return ["knownOperands", "targetHcf", "rangeStart", "rangeEnd", "numberList", "divisibleBy", "notDivisibleBy", "baseNumber", "increase", "decrease"];
    case "CP-004":
      return [];
  }
}

function requiredExplanationPlaceholders(canonicalProblemId: NsHcf001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
      return ["operandFactorizationLatex", "commonPrimeIntersectionLatex", "minimumExponentSelectionLatex", "hcfLatex"];
    case "CP-002":
      return ["hcfLatex", "hcfFactorCountFormulaLatex"];
    case "CP-003":
      return ["candidateEvaluationLatex"];
    case "CP-004":
      return ["groupingInterpretationLatex", "hcfLatex"];
  }
}

function countBy(values: readonly (number | string | boolean)[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function traceabilityMissing(item: NsHcf001QuestionPackage) {
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
  return NS_HCF_001_MATHJAX_KEYS.every((key) => typeof item[key] === "string" && String(item[key]).length > 0);
}
