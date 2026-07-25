import { hasMen001DistractorStrategy } from "./distractor-strategies.all";
import questionLanguageBase from "./question-language.en.json";
import questionLanguageCp003 from "./question-language.cp003.en.json";
import questionLanguageCp004 from "./question-language.cp004.en.json";
import questionLanguageCp004Additional from "./question-language.cp004.additional.en.json";
import questionLanguageExhaustiveness from "./question-language.exhaustiveness.en.json";
import { getMen001SolveModeIds } from "./solve-mode-registry.all";
import taskRegistryBase from "./task-registry.library.json";
import taskRegistryCp003 from "./task-registry.cp003.library.json";
import taskRegistryCp004 from "./task-registry.cp004.library.json";
import taskRegistryCp004Additional from "./task-registry.cp004.additional.library.json";
import taskRegistryExhaustiveness from "./task-registry.exhaustiveness.library.json";
import {
  MEN_001_ACTIVE_CP_IDS,
  MEN_001_PACKAGE_ID,
  type Men001ActiveCanonicalProblemId,
  type Men001QuestionLanguageEntry,
  type Men001TaskRegistryEntry,
} from "./types";

const questionLanguageSources = [
  questionLanguageBase,
  questionLanguageCp003,
  questionLanguageCp004,
  questionLanguageCp004Additional,
  questionLanguageExhaustiveness,
] as const;
const taskRegistrySources = [
  taskRegistryBase,
  taskRegistryCp003,
  taskRegistryCp004,
  taskRegistryCp004Additional,
  taskRegistryExhaustiveness,
] as const;

const questionEntries = questionLanguageSources
  .flatMap((source) => source.entries as Men001QuestionLanguageEntry[])
  .filter((entry) => entry.active);
const registryEntries = taskRegistrySources.flatMap(
  (source) => source.entries as Men001TaskRegistryEntry[],
);
const registryByQlId = new Map(registryEntries.map((entry) => [entry.qlId, entry]));

function sorted(values: readonly string[]) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function sameStrings(left: readonly string[], right: readonly string[]) {
  return JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));
}

function normalizeTemplateIdentity(template: string) {
  return template
    .toLowerCase()
    .replace(/\{[A-Za-z0-9_]+\}/g, "{value}")
    .replace(/[^a-z0-9{}₹²√°π/=]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unitMatchesDimension(entry: Men001QuestionLanguageEntry) {
  if (entry.answerDimension === "LENGTH") {
    return entry.unitPolicy === "CENTIMETRES" || entry.unitPolicy === "METRES";
  }
  if (entry.answerDimension === "AREA") {
    return entry.unitPolicy === "SQUARE_CENTIMETRES" || entry.unitPolicy === "SQUARE_METRES";
  }
  if (entry.answerDimension === "ANGLE") return entry.unitPolicy === "DEGREES";
  if (entry.answerDimension === "COUNT") {
    return entry.unitPolicy === "TILES" || entry.unitPolicy === "REVOLUTIONS";
  }
  if (entry.answerDimension === "RATE") {
    return entry.unitPolicy === "RUPEES_PER_SQUARE_METRE" || entry.unitPolicy === "RUPEES_PER_METRE";
  }
  return entry.answerDimension === "COST" && entry.unitPolicy === "RUPEES";
}

function requiresExplicitPiPolicy(entry: Men001QuestionLanguageEntry) {
  return (
    entry.cpId === "MEN-CP-003" ||
    [
      "findOuterCircularPathArea",
      "findInnerCircularPathArea",
      "findCircularPathCost",
      "findCircularFencingCost",
      "findOuterCircularPathWidthFromArea",
      "findInnerCircularPathWidthFromArea",
    ].includes(entry.solveMode)
  );
}

export function extractMen001Placeholders(template: string) {
  return [...template.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!);
}

export function getMen001QuestionEntries() {
  return [...questionEntries];
}

export function getMen001QuestionEntry(qlId: string) {
  const entry = questionEntries.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`Unknown active MEN-001 QL: ${qlId}`);
  return entry;
}

export function getMen001RegistryEntry(qlId: string) {
  const entry = registryByQlId.get(qlId);
  if (!entry) throw new Error(`Missing MEN-001 registry entry: ${qlId}`);
  return entry;
}

export function getMen001QuestionLanguageIds() {
  return questionEntries.map((entry) => entry.qlId);
}

export function getMen001ActiveCanonicalProblemIds(): Men001ActiveCanonicalProblemId[] {
  return [...MEN_001_ACTIVE_CP_IDS];
}

export function renderMen001Template(
  template: string,
  variables: Record<string, string | number>,
) {
  const unresolved: string[] = [];
  const rendered = template.replace(/\{([A-Za-z0-9_]+)\}/g, (_, key: string) => {
    if (key in variables) return String(variables[key]);
    unresolved.push(key);
    return `{${key}}`;
  });
  if (unresolved.length > 0) {
    throw new Error(`Unresolved MEN-001 placeholders: ${unresolved.join(", ")}`);
  }
  return rendered;
}

export function validateMen001Libraries() {
  const failures: string[] = [];
  const qlIds = questionEntries.map((entry) => entry.qlId);
  const registryQlIds = registryEntries.map((entry) => entry.qlId);
  const librarySolveModes = [...new Set(questionEntries.map((entry) => entry.solveMode))];
  const runtimeSolveModes = getMen001SolveModeIds();

  for (const [index, source] of questionLanguageSources.entries()) {
    if (source.packageId !== MEN_001_PACKAGE_ID) {
      failures.push(`Question-language source ${index + 1} packageId must be ${MEN_001_PACKAGE_ID}.`);
    }
  }
  for (const [index, source] of taskRegistrySources.entries()) {
    if (source.packageId !== MEN_001_PACKAGE_ID) {
      failures.push(`Task-registry source ${index + 1} packageId must be ${MEN_001_PACKAGE_ID}.`);
    }
    if (source.ownership !== "HUMAN_OWNED") {
      failures.push(`MEN-001 task-registry source ${index + 1} ownership must remain HUMAN_OWNED.`);
    }
  }

  if (new Set(qlIds).size !== qlIds.length) failures.push("Duplicate active QL IDs detected.");
  if (new Set(registryQlIds).size !== registryQlIds.length) failures.push("Duplicate task-registry QL IDs detected.");
  if (!sameStrings(qlIds, registryQlIds)) failures.push("Question-language and task-registry QL sets differ.");
  for (const qlId of qlIds) {
    if (!/^MEN-001-QL-\d{3,}$/.test(qlId)) failures.push(`${qlId}: invalid package-local QL identity.`);
  }
  if (!sameStrings(librarySolveModes, runtimeSolveModes)) {
    failures.push("Question-language solve modes and runtime solve-mode registry are not exhaustive mirrors.");
  }

  const normalizedTemplates = questionEntries.map((entry) => normalizeTemplateIdentity(entry.template));
  if (new Set(normalizedTemplates).size !== normalizedTemplates.length) {
    failures.push("Exact normalized English template duplicates detected.");
  }

  for (const cpId of MEN_001_ACTIVE_CP_IDS) {
    const cpEntries = questionEntries.filter((entry) => entry.cpId === cpId);
    if (cpEntries.length === 0) failures.push(`${cpId}: active CP has no QLs.`);
    for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
      if (!cpEntries.some((entry) => entry.difficulty === difficulty)) {
        failures.push(`${cpId}: missing ${difficulty} QL coverage.`);
      }
    }
  }

  for (const entry of questionEntries) {
    const registry = registryByQlId.get(entry.qlId);
    if (!registry) continue;
    if (entry.cpId !== registry.cpId) failures.push(`${entry.qlId}: CP mismatch.`);
    if (entry.solveMode !== registry.solveMode) failures.push(`${entry.qlId}: solve-mode mismatch.`);
    if (entry.answerDimension !== registry.answerDimension) failures.push(`${entry.qlId}: answer-dimension mismatch.`);
    if (!sameStrings(entry.requiredVariables, registry.requiredVariables)) {
      failures.push(`${entry.qlId}: required-variable contract mismatch.`);
    }
    const placeholders = extractMen001Placeholders(entry.template);
    if (!sameStrings(placeholders, entry.requiredVariables)) {
      failures.push(`${entry.qlId}: template placeholders do not match required variables.`);
    }
    if (!MEN_001_ACTIVE_CP_IDS.includes(entry.cpId as Men001ActiveCanonicalProblemId)) {
      failures.push(`${entry.qlId}: inactive CP exposed during runtime proof.`);
    }
    if (typeof entry.template !== "string" || entry.template.trim().length < 25) {
      failures.push(`${entry.qlId}: English template is missing or too short.`);
    }
    if (!/[?.]$/.test(entry.template.trim())) {
      failures.push(`${entry.qlId}: English template must end with exam-style punctuation.`);
    }
    if (!entry.explanationStrategyId?.trim()) failures.push(`${entry.qlId}: explanation strategy is missing.`);
    if (
      !Array.isArray(entry.distractorStrategyIds) ||
      entry.distractorStrategyIds.length !== 3 ||
      new Set(entry.distractorStrategyIds).size !== 3
    ) {
      failures.push(`${entry.qlId}: exactly three unique distractor strategies are required.`);
    } else {
      for (const strategyId of entry.distractorStrategyIds) {
        if (!hasMen001DistractorStrategy(strategyId)) {
          failures.push(`${entry.qlId}: unknown distractor strategy ${strategyId}.`);
        }
      }
    }
    if (!unitMatchesDimension(entry)) failures.push(`${entry.qlId}: unit policy is incompatible with answer dimension.`);
    if (!["REQUIRED", "OPTIONAL", "NONE"].includes(entry.diagramRequirement)) {
      failures.push(`${entry.qlId}: invalid question-diagram requirement.`);
    }
    if (requiresExplicitPiPolicy(entry) && !entry.template.includes("π = 22/7")) {
      failures.push(`${entry.qlId}: circular runtime questions must state the active π = 22/7 policy.`);
    }
  }

  return { valid: failures.length === 0, failures };
}
