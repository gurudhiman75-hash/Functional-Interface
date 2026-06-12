import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import { NS_FRACDEC_001_MATHJAX_KEYS } from "./math";
import type { NsFracdec001CanonicalProblemId, NsFracdec001QuestionPackage } from "./types";

export const NS_FRACDEC_001_ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007", "CP-008", "CP-009"] as const;

export function getNsFracdec001ActiveCanonicalProblemIds() {
  return [...NS_FRACDEC_001_ACTIVE_CP_IDS] as NsFracdec001CanonicalProblemId[];
}

export function validateNsFracdec001Libraries() {
  const failures: string[] = [];
  for (const lib of [questionLanguageLibrary, explanationLibrary, variableRangesLibrary, coverageTargetsLibrary, distributionTargetsLibrary]) {
    if (lib.archetypeId !== "NS-FRACDEC-001") failures.push(`${lib.libraryId} archetype mismatch.`);
  }
  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  if (qlIds.length !== 160) failures.push("QL count must be 160.");
  for (let i = 1; i <= 160; i += 1) {
    const id = `QL-${String(i).padStart(3, "0")}`;
    if (!qlIds.includes(id)) failures.push(`Missing ${id}.`);
  }
  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  if (JSON.stringify(esIds) !== JSON.stringify(["ES-001", "ES-002", "ES-003", "ES-004", "ES-005", "ES-006", "ES-007", "ES-008", "ES-009"])) failures.push("ES IDs must be ES-001 through ES-009.");
  return { valid: failures.length === 0, failures };
}

export function getQuestionLanguageEntries(cpId: NsFracdec001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === cpId);
  if (!cp) throw new Error(`Missing question language for ${cpId}.`);
  return cp.entries;
}

export function getExplanationFamily(cpId: NsFracdec001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(cpId));
  if (!family) throw new Error(`Missing explanation family for ${cpId}.`);
  return family;
}

export function renderQuestion(cpId: NsFracdec001CanonicalProblemId, questionLanguageId: string, values: Record<string, string | number | undefined>) {
  const entry = getQuestionLanguageEntries(cpId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Question language ${questionLanguageId} not approved for ${cpId}.`);
  return replacePlaceholders(entry.text, values);
}

export function renderExplanation(cpId: NsFracdec001CanonicalProblemId, explanationId: string, values: Record<string, string | number | undefined>) {
  const family = getExplanationFamily(cpId);
  const entry = family.entries.find((item) => item.id === explanationId);
  if (!entry) throw new Error(`Explanation ${explanationId} not approved for ${cpId}.`);
  return { familyId: family.familyId, lines: replacePlaceholders(entry.text, values).split("\n") };
}

export function auditNsFracdec001Batch(packages: readonly NsFracdec001QuestionPackage[]) {
  const cpId = packages[0]?.canonicalProblemId;
  const qlIds = cpId ? getQuestionLanguageEntries(cpId).map((entry) => entry.id) : [];
  const esIds = cpId ? getExplanationFamily(cpId).entries.map((entry) => entry.id) : [];
  const ql = countBy(packages.map((item) => item.questionLanguageId));
  const es = countBy(packages.map((item) => item.explanationId));
  return {
    questionCount: packages.length,
    generationFailures: 0,
    validationFailures: packages.filter((item) => !item.validation.valid).length,
    traceabilityFailures: packages.filter((item) => item.traceability.questionId !== item.questionId || item.traceability.answer !== item.answer).length,
    mathJaxFailures: packages.filter((item) => !NS_FRACDEC_001_MATHJAX_KEYS.some((key) => item[key].length > 0)).length,
    unusedQuestionLanguageIds: qlIds.filter((id) => !ql[id]),
    unusedExplanationIds: esIds.filter((id) => !es[id]),
    difficultyDistribution: countBy(packages.map((item) => item.difficultyBand)),
    canonicalProblemDistribution: countBy(packages.map((item) => item.canonicalProblemId)),
    questionLanguageDistribution: ql,
    explanationDistribution: es,
    fractionType: countBy(packages.map((item) => item.parameters.fractionType ?? "not-applicable")),
    reductionStatus: countBy(packages.map((item) => item.parameters.reductionStatus ?? "not-applicable")),
    conversionType: countBy(packages.map((item) => item.parameters.conversionType ?? "not-applicable")),
    denominatorBand: countBy(packages.map((item) => item.parameters.denominatorBand ?? "not-applicable")),
    operationType: countBy(packages.map((item) => item.parameters.operationType ?? "not-applicable")),
    operandCount: countBy(packages.map((item) => item.parameters.operandCount ?? "not-applicable")),
    expressionType: countBy(packages.map((item) => item.parameters.expressionType ?? "not-applicable")),
    comparisonMode: countBy(packages.map((item) => item.parameters.comparisonMode ?? "not-applicable")),
    valueCount: countBy(packages.map((item) => item.parameters.valueCount ?? "not-applicable")),
    decimalType: countBy(packages.map((item) => item.parameters.decimalType ?? "not-applicable")),
    denominatorClass: countBy(packages.map((item) => item.parameters.denominatorClass ?? "not-applicable")),
    decimalPlaces: countBy(packages.map((item) => item.parameters.decimalPlaces ?? "not-applicable")),
    repeatBlockLength: countBy(packages.map((item) => item.parameters.repeatBlockLength ?? "not-applicable")),
    decimalPattern: countBy(packages.map((item) => item.parameters.decimalPattern ?? "not-applicable")),
    denominatorPrimeProfile: countBy(packages.map((item) => item.parameters.denominatorPrimeProfile ?? "not-applicable")),
    classification: countBy(packages.map((item) => item.parameters.classification ?? "not-applicable")),
    targetType: countBy(packages.map((item) => item.parameters.targetType ?? "not-applicable")),
    fractionCount: countBy(packages.map((item) => item.parameters.fractionCount ?? "not-applicable")),
    mathJaxUsage: Object.fromEntries(NS_FRACDEC_001_MATHJAX_KEYS.map((key) => [key, packages.filter((item) => item[key].length > 0).length])),
  };
}

export function replacePlaceholders(text: string, values: Record<string, string | number | undefined>) {
  return text.replaceAll(/\{([A-Za-z]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") throw new Error(`Missing placeholder ${key}.`);
    return String(value);
  });
}

function countBy(values: readonly (string | number | boolean)[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    const key = String(value);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
