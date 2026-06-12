import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import { NS_DIGIT_001_MATHJAX_KEYS } from "./math";
import type { NsDigit001CanonicalProblemId, NsDigit001QuestionPackage } from "./types";

export const NS_DIGIT_001_ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005"] as const;

export function getNsDigit001ActiveCanonicalProblemIds() {
  return [...NS_DIGIT_001_ACTIVE_CP_IDS] as NsDigit001CanonicalProblemId[];
}

export function validateNsDigit001Libraries() {
  const failures: string[] = [];
  for (const lib of [questionLanguageLibrary, explanationLibrary, variableRangesLibrary, coverageTargetsLibrary, distributionTargetsLibrary]) {
    if (lib.archetypeId !== "NS-DIGIT-001") failures.push(`${lib.libraryId} archetype mismatch.`);
  }
  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  if (qlIds.length !== 82) failures.push("QL count must be 82.");
  for (let i = 1; i <= 82; i += 1) {
    const id = `QL-${String(i).padStart(3, "0")}`;
    if (!qlIds.includes(id)) failures.push(`Missing ${id}.`);
  }
  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  if (JSON.stringify(esIds) !== JSON.stringify(["ES-001", "ES-002", "ES-003", "ES-004", "ES-005"])) failures.push("ES IDs must be ES-001 through ES-005.");
  for (const key of NS_DIGIT_001_MATHJAX_KEYS) {
    if (!explanationLibrary.mathJaxSupport.supportedPlaceholders.includes(key)) failures.push(`Missing MathJax placeholder ${key}.`);
  }
  return { valid: failures.length === 0, failures };
}

export function getQuestionLanguageEntries(cpId: NsDigit001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === cpId);
  if (!cp) throw new Error(`Missing question language for ${cpId}.`);
  return cp.entries;
}

export function getExplanationFamily(cpId: NsDigit001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(cpId));
  if (!family) throw new Error(`Missing explanation family for ${cpId}.`);
  return family;
}

export function renderQuestion(cpId: NsDigit001CanonicalProblemId, questionLanguageId: string, values: Record<string, string | number | undefined>) {
  const entry = getQuestionLanguageEntries(cpId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Question language ${questionLanguageId} not approved for ${cpId}.`);
  return replacePlaceholders(entry.text, values);
}

export function renderExplanation(cpId: NsDigit001CanonicalProblemId, explanationId: string, values: Record<string, string | number | undefined>) {
  const family = getExplanationFamily(cpId);
  const entry = family.entries.find((item) => item.id === explanationId);
  if (!entry) throw new Error(`Explanation ${explanationId} not approved for ${cpId}.`);
  return { familyId: family.familyId, lines: replacePlaceholders(entry.text, values).split("\n") };
}

export function auditNsDigit001Batch(packages: readonly NsDigit001QuestionPackage[]) {
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
    mathJaxFailures: packages.filter((item) => !NS_DIGIT_001_MATHJAX_KEYS.every((key) => item[key].length > 0)).length,
    unusedQuestionLanguageIds: qlIds.filter((id) => !ql[id]),
    unusedExplanationIds: esIds.filter((id) => !es[id]),
    difficultyDistribution: countBy(packages.map((item) => item.difficultyBand)),
    canonicalProblemDistribution: countBy(packages.map((item) => item.canonicalProblemId)),
    questionLanguageDistribution: ql,
    explanationDistribution: es,
    numberMagnitude: countBy(packages.map((item) => item.parameters.numberMagnitude ?? "not-applicable")),
    boundaryStatus: countBy(packages.map((item) => item.parameters.boundaryStatus ?? "not-applicable")),
    baseBand: countBy(packages.map((item) => item.parameters.baseBand ?? "not-applicable")),
    exponentBand: countBy(packages.map((item) => item.parameters.exponentBand ?? "not-applicable")),
    factorCount: countBy(packages.map((item) => item.parameters.factorCount ?? "not-applicable")),
    productMagnitude: countBy(packages.map((item) => item.parameters.productMagnitude ?? "not-applicable")),
    boundType: countBy(packages.map((item) => item.parameters.boundType ?? "not-applicable")),
    digitCountBand: countBy(packages.map((item) => item.parameters.digitCountBand ?? "not-applicable")),
    uniquenessStatus: countBy(packages.map((item) => item.parameters.uniquenessStatus ?? "not-applicable")),
    mathJaxUsage: Object.fromEntries(NS_DIGIT_001_MATHJAX_KEYS.map((key) => [key, packages.filter((item) => item[key].length > 0).length])),
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
