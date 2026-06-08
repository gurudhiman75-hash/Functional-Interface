import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import { NS_HL_001_MATHJAX_KEYS, operandSizeBucket, quotientSizeBucket } from "./math";
import type { NsHl001Answer, NsHl001CanonicalProblemId, NsHl001QuestionPackage, NsHl001Topology } from "./types";

const ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"] as const;
const QL_IDS = Array.from({ length: 33 }, (_item, index) => `QL-${String(index + 1).padStart(3, "0")}`);
const ES_IDS = ["ES-001", "ES-002", "ES-003", "ES-004", "ES-005", "ES-006", "ES-007"];

export const NS_HL_001_LIBRARY_REGISTRY = {
  variableRanges: variableRangesLibrary,
  coverageTargets: coverageTargetsLibrary,
  questionLanguage: questionLanguageLibrary,
  explanation: explanationLibrary,
  distributionTargets: distributionTargetsLibrary,
} as const;

export function getNsHl001ActiveCanonicalProblemIds() {
  return [...ACTIVE_CP_IDS] as NsHl001CanonicalProblemId[];
}

export function validateNsHl001Libraries() {
  const failures: string[] = [];
  for (const library of [variableRangesLibrary, coverageTargetsLibrary, questionLanguageLibrary, explanationLibrary, distributionTargetsLibrary]) {
    if (library.archetypeId !== "NS-HL-001") failures.push(`${library.libraryId} archetype ID mismatch.`);
  }
  const cpIds = questionLanguageLibrary.canonicalProblems.map((entry) => entry.cpId);
  if (JSON.stringify(cpIds) !== JSON.stringify(ACTIVE_CP_IDS)) failures.push("Question language CP IDs must be CP-001 through CP-006.");
  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  if (JSON.stringify(qlIds) !== JSON.stringify(QL_IDS)) failures.push("Question language IDs must be exactly QL-001 through QL-033.");
  if (new Set(qlIds).size !== qlIds.length) failures.push("Question language IDs must be unique.");
  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  if (JSON.stringify(esIds) !== JSON.stringify(ES_IDS)) failures.push("Explanation IDs must be ES-001 through ES-007.");
  const variableNames = new Set(["hcf", "lcm", "product", "a", "b", "knownNumber", "sum", "difference", "lowerBound", "upperBound", "ratio"]);
  for (const cp of questionLanguageLibrary.canonicalProblems) {
    for (const entry of cp.entries) {
      for (const placeholder of extractPlaceholders(entry.text)) {
        if (!variableNames.has(placeholder)) failures.push(`${entry.id} uses unapproved placeholder {${placeholder}}.`);
      }
      for (const required of requiredQuestionPlaceholders(entry.id, cp.cpId as NsHl001CanonicalProblemId)) {
        if (!entry.text.includes(`{${required}}`)) failures.push(`${entry.id} is missing required placeholder {${required}}.`);
      }
    }
  }
  const mathJaxNames = new Set(explanationLibrary.mathJaxSupport.supportedPlaceholders);
  for (const key of NS_HL_001_MATHJAX_KEYS) {
    if (!mathJaxNames.has(key)) failures.push(`Missing MathJax object ${key}.`);
  }
  for (const family of explanationLibrary.families) {
    for (const entry of family.entries) {
      for (const placeholder of extractPlaceholders(entry.text)) {
        if (placeholder !== "answer" && !mathJaxNames.has(placeholder)) failures.push(`${entry.id} uses unapproved explanation placeholder {${placeholder}}.`);
      }
      for (const required of requiredExplanationPlaceholders(family.appliesTo[0] as NsHl001CanonicalProblemId, entry.id)) {
        if (!entry.text.includes(`{${required}}`)) failures.push(`${entry.id} missing {${required}}.`);
      }
    }
  }
  return { valid: failures.length === 0, failures };
}

export function getTopology(canonicalProblemId: NsHl001CanonicalProblemId): NsHl001Topology {
  switch (canonicalProblemId) {
    case "CP-001":
      return "Product Relation Applications";
    case "CP-002":
      return "HCF-LCM Validity Check";
    case "CP-003":
      return "Missing Number From HCF, LCM And One Number";
    case "CP-004":
      return "Number Pair Reconstruction";
    case "CP-005":
      return "Count Possible Number Pairs";
    case "CP-006":
      return "Ratio-Based Number Reconstruction";
  }
}

export function getQuestionLanguageEntries(canonicalProblemId: NsHl001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!cp) throw new Error(`NS-HL-001 question language missing for ${canonicalProblemId}.`);
  return cp.entries;
}

export function getQuestionLanguageEntry(canonicalProblemId: NsHl001CanonicalProblemId, questionLanguageId: string) {
  const entry = getQuestionLanguageEntries(canonicalProblemId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Question language ID ${questionLanguageId} is not approved for ${canonicalProblemId}.`);
  return entry;
}

export function getExplanationEntries(canonicalProblemId: NsHl001CanonicalProblemId, validityCase?: "valid" | "invalid") {
  const entries = getExplanationFamily(canonicalProblemId).entries;
  if (canonicalProblemId !== "CP-002" || !validityCase) return entries;
  return entries.filter((entry) => entry.validityCase === validityCase);
}

export function getExplanationFamily(canonicalProblemId: NsHl001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(canonicalProblemId));
  if (!family) throw new Error(`NS-HL-001 explanation family missing for ${canonicalProblemId}.`);
  return family;
}

export function renderQuestionLanguage(input: {
  canonicalProblemId: NsHl001CanonicalProblemId;
  questionLanguageId: string;
  values: Record<string, number | string | undefined>;
}) {
  return replacePlaceholders(getQuestionLanguageEntry(input.canonicalProblemId, input.questionLanguageId).text, input.values);
}

export function renderExplanationLanguage(input: {
  canonicalProblemId: NsHl001CanonicalProblemId;
  styleId: string;
  answer: NsHl001Answer;
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

export function auditNsHl001Batch(questionPackages: readonly NsHl001QuestionPackage[], generationFailures = 0) {
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
    canonicalProblemDistribution: countBy(questionPackages.map((item) => item.canonicalProblemId)),
    cpFamilyDistribution: countBy(questionPackages.map((item) => item.solver.cp001Family ?? item.solver.conditionType ?? item.solver.pairPolicy ?? item.solver.ratioType ?? "not-applicable")),
    operandSizeCoverage: countBy(questionPackages.map((item) => item.solver.operandSize)),
    quotientSizeCoverage: countBy(questionPackages.map((item) => item.solver.quotientSize)),
    coprimeMultiplierCountCoverage: countBy(questionPackages.map((item) => String(item.solver.coprimeMultiplierCount))),
    validityTypeCoverage: countBy(questionPackages.map((item) => item.solver.validityType ?? "not-applicable")),
    ratioTypeCoverage: countBy(questionPackages.map((item) => item.solver.ratioType ?? "not-applicable")),
    ratioReductionCoverage: countBy(questionPackages.map((item) => item.solver.ratioReductionType ?? "not-applicable")),
    pairPolicyCoverage: countBy(questionPackages.map((item) => item.solver.pairPolicy ?? "not-applicable")),
    pairCountCaseCoverage: countBy(questionPackages.map((item) => item.solver.pairCountCase ?? "not-applicable")),
    conditionTypeCoverage: countBy(questionPackages.map((item) => item.solver.conditionType ?? "not-applicable")),
    questionLanguageDistribution: qlDistribution,
    explanationDistribution: esDistribution,
    mathJaxUsage: Object.fromEntries(NS_HL_001_MATHJAX_KEYS.map((key) => [key, questionPackages.filter((item) => Boolean(item[key])).length])),
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

function requiredQuestionPlaceholders(questionLanguageId: string, canonicalProblemId: NsHl001CanonicalProblemId) {
  if (canonicalProblemId === "CP-001") return questionLanguageId === "QL-004" ? ["product", "hcf"] : questionLanguageId === "QL-005" ? ["product", "lcm"] : ["hcf", "lcm"];
  if (canonicalProblemId === "CP-002") return questionLanguageId === "QL-010" ? ["a", "b", "hcf", "lcm"] : ["hcf", "lcm"];
  if (canonicalProblemId === "CP-003") return ["hcf", "lcm", "knownNumber"];
  if (canonicalProblemId === "CP-004") {
    if (questionLanguageId === "QL-015" || questionLanguageId === "QL-016") return ["hcf", "lcm", "sum"];
    if (questionLanguageId === "QL-017" || questionLanguageId === "QL-018") return ["hcf", "lcm", "difference"];
    if (questionLanguageId === "QL-021" || questionLanguageId === "QL-022") return ["hcf", "lcm", "lowerBound", "upperBound"];
    return ["hcf", "lcm"];
  }
  if (canonicalProblemId === "CP-005") return ["hcf", "lcm"];
  if (questionLanguageId === "QL-028" || questionLanguageId === "QL-029") return ["ratio", "hcf"];
  if (questionLanguageId === "QL-030" || questionLanguageId === "QL-031") return ["ratio", "lcm"];
  return ["ratio", "hcf", "lcm"];
}

function requiredExplanationPlaceholders(canonicalProblemId: NsHl001CanonicalProblemId, explanationId: string) {
  switch (canonicalProblemId) {
    case "CP-001":
      return ["productRelationLatex", "answer"];
    case "CP-002":
      return ["divisibilityCheckLatex", "productRelationCheckLatex"];
    case "CP-003":
      return ["productRelationLatex", "missingNumberFormulaLatex", "hcfVerificationLatex", "lcmVerificationLatex", "answer"];
    case "CP-004":
      return ["quotientLatex", "factorPairListLatex", "coprimePairFilterLatex", "conditionFilterLatex", "reconstructedPairLatex", "answer"];
    case "CP-005":
      return ["quotientLatex", "factorPairCountLatex", "coprimePairFilterLatex", "orderedPairPolicyLatex", "unorderedPairPolicyLatex", "answer"];
    case "CP-006":
      return ["ratioReductionLatex", "ratioMultiplierLatex", "hcfMultiplierLatex", "lcmMultiplierLatex", "consistencyCheckLatex", "reconstructedPairLatex", "answer"];
  }
}

function countBy(values: readonly unknown[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function traceabilityMissing(questionPackage: NsHl001QuestionPackage) {
  return questionPackage.traceability.questionId !== questionPackage.questionId || questionPackage.traceability.answer !== questionPackage.answer || questionPackage.traceability.graphId !== questionPackage.reasoningGraph.graphId;
}

function mathJaxPresent(questionPackage: NsHl001QuestionPackage) {
  return NS_HL_001_MATHJAX_KEYS.every((key) => typeof questionPackage[key] === "string" && questionPackage[key].length > 0);
}
