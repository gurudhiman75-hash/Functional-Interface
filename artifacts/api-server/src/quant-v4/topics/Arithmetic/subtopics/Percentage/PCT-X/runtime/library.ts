import questionLanguageEn from "./question-language.en.json" assert { type: "json" };
import questionLanguageHi from "./question-language.hi.json" assert { type: "json" };
import questionLanguagePa from "./question-language.pa.json" assert { type: "json" };
import explanationEn from "./explanation.en.json" assert { type: "json" };
import explanationHi from "./explanation.hi.json" assert { type: "json" };
import explanationPa from "./explanation.pa.json" assert { type: "json" };
import variableRanges from "./variable-ranges.library.json" assert { type: "json" };
import coverageTargets from "./coverage-targets.library.json" assert { type: "json" };
import distributionTargets from "./distribution-targets.library.json" assert { type: "json" };
import taskRegistry from "./task-registry.library.json" assert { type: "json" };
import semanticLibrary from "./semantic/advanced-percentage-semantic-library.json" assert { type: "json" };
import scenarioMap from "./semantic/scenario-map.json" assert { type: "json" };
import compatibilityMap from "./semantic/compatibility-map.json" assert { type: "json" };
import frequencyModel from "./semantic/frequency-model.json" assert { type: "json" };
import grammarRules from "./semantic/grammar-rules.json" assert { type: "json" };
import {
  PCT_002_ARCHETYPE_ID,
  PCT_002_CP_IDS,
  PCT_002_LANGUAGES,
  type Pct002AnswerType,
  type Pct002CanonicalProblemId,
  type Pct002ExplanationLibrary,
  type Pct002Language,
  type Pct002QuestionLanguageLibrary,
  type Pct002TaskRegistryLibrary,
  type Pct002Variables,
  type Pct002SemanticContext,
} from "./types";

export const PCT_002_LIBRARY_REGISTRY = {
  questionLanguage: {
    en: questionLanguageEn as Pct002QuestionLanguageLibrary,
    hi: questionLanguageHi as Pct002QuestionLanguageLibrary,
    pa: questionLanguagePa as Pct002QuestionLanguageLibrary,
  },
  explanation: {
    en: explanationEn as Pct002ExplanationLibrary,
    hi: explanationHi as Pct002ExplanationLibrary,
    pa: explanationPa as Pct002ExplanationLibrary,
  },
  variableRanges,
  coverageTargets,
  distributionTargets,
  taskRegistry: taskRegistry as Pct002TaskRegistryLibrary,
  semantic: {
    library: semanticLibrary,
    scenarioMap: scenarioMap as Record<string, string>,
    compatibilityMap,
    frequencyModel,
    grammarRules,
  },
} as const;

export function extractPlaceholders(template: string) {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

export function renderTemplate(template: string, values: Pct002Variables) {
  const rendered = template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(`Missing placeholder ${key}`);
    }
    return String(value);
  });
  return rendered.replace(/\b(\w+s)'s\b/gi, "$1'");
}

export function buildPct002SemanticTrace(context?: Pct002SemanticContext) {
  if (!context) {
    return {
      scenarioId: "none",
      semanticDomain: "none",
      entityIds: {},
      frequencyMetadata: {},
      grammarMetadata: {},
    };
  }
  const entityEntries = Object.entries(context.entities);
  return {
    scenarioId: context.scenario,
    semanticDomain: context.scenario,
    entityIds: Object.fromEntries(entityEntries.map(([role, entity]) => [`${role}Id`, entity.id])),
    frequencyMetadata: Object.fromEntries(
      entityEntries.map(([role, entity]) => [
        role,
        PCT_002_LIBRARY_REGISTRY.semantic.frequencyModel.assignments[entity.id] ?? entity.frequency ?? "common",
      ]),
    ),
    grammarMetadata: Object.fromEntries(
      entityEntries.map(([role, entity]) => [
        role,
        {
          gender: entity.gender ?? "neutral",
          numberType: entity.numberType ?? "unknown",
        },
      ]),
    ),
  };
}

export function getQuestionLanguageIds(cpId: Pct002CanonicalProblemId, language: Pct002Language) {
  return Object.keys(PCT_002_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families ?? {});
}

export function getCommonQuestionLanguageIds(cpId: Pct002CanonicalProblemId) {
  const [first, ...rest] = PCT_002_LANGUAGES.map((language) => new Set(getQuestionLanguageIds(cpId, language)));
  return [...(first ?? new Set<string>())].filter((id) => rest.every((set) => set.has(id)));
}

export function getActiveQuestionLanguageIds() {
  return PCT_002_CP_IDS.flatMap((cpId) => getCommonQuestionLanguageIds(cpId));
}

export function getQuestionEntry(cpId: Pct002CanonicalProblemId, questionLanguageId: string, language: Pct002Language) {
  const entry = PCT_002_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families[questionLanguageId];
  if (!entry) throw new Error(`Missing question language ${language}:${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskRegistryEntry(cpId: Pct002CanonicalProblemId, questionLanguageId: string) {
  const entry = PCT_002_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
  if (!entry) throw new Error(`Missing task registry entry ${questionLanguageId}`);
  if (entry.cpId !== cpId) throw new Error(`Task registry CP mismatch ${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskKind(cpId: Pct002CanonicalProblemId, questionLanguageId: string) {
  return getTaskRegistryEntry(cpId, questionLanguageId).taskKind;
}

export function getAnswerType(cpId: Pct002CanonicalProblemId, questionLanguageId: string): Pct002AnswerType {
  return getTaskRegistryEntry(cpId, questionLanguageId).answerType;
}

export function getRequiredVariables(cpId: Pct002CanonicalProblemId, questionLanguageId: string) {
  return [...getTaskRegistryEntry(cpId, questionLanguageId).requiredVariables];
}

export function getExplanationEntry(cpId: Pct002CanonicalProblemId, language: Pct002Language) {
  const entry = PCT_002_LIBRARY_REGISTRY.explanation[language][cpId];
  if (!entry) throw new Error(`Missing explanation ${language}:${cpId}`);
  return entry;
}

export function getExplanationSteps(cpId: Pct002CanonicalProblemId, taskKind: string, language: Pct002Language, variantKey = 0) {
  const entry = getExplanationEntry(cpId, language);
  const family = entry.taskExplanations?.[taskKind];
  if (!family) throw new Error(`Missing task explanation ${language}:${cpId}:${taskKind}`);
  const resolved = family.aliasOf ? entry.taskExplanations?.[family.aliasOf] : family;
  const variants = resolved?.variants?.filter((variant) => variant.length > 0) ?? [];
  if (variants.length > 0) return [...variants[Math.abs(variantKey) % variants.length]!];
  if (!resolved?.steps?.length) throw new Error(`Missing task explanation steps ${language}:${cpId}:${taskKind}`);
  return [...resolved.steps];
}

export function getExplanationVariantCount(cpId: Pct002CanonicalProblemId, taskKind: string, language: Pct002Language) {
  const entry = getExplanationEntry(cpId, language);
  const family = entry.taskExplanations?.[taskKind];
  const resolved = family?.aliasOf ? entry.taskExplanations?.[family.aliasOf] : family;
  return resolved?.variants?.length ?? (resolved?.steps?.length ? 1 : 0);
}

export function getExplanationId(cpId: Pct002CanonicalProblemId, language: Pct002Language = "en") {
  return getExplanationEntry(cpId, language).explanationId;
}

function sameSet(left: Set<string>, right: Set<string>) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

export function validatePct002Libraries() {
  const failures: string[] = [];
  if (PCT_002_LIBRARY_REGISTRY.taskRegistry.archetypeId !== PCT_002_ARCHETYPE_ID) failures.push("Task registry archetype mismatch.");
  for (const cpId of PCT_002_CP_IDS) {
    for (const language of PCT_002_LANGUAGES) {
      if (!PCT_002_LIBRARY_REGISTRY.questionLanguage[language][cpId]) failures.push(`Missing QL ${language}:${cpId}`);
      if (!PCT_002_LIBRARY_REGISTRY.explanation[language][cpId]) failures.push(`Missing ES ${language}:${cpId}`);
    }
    const commonIds = getCommonQuestionLanguageIds(cpId);
    if (commonIds.length === 0) failures.push(`No active multilingual QLs for ${cpId}`);
    for (const questionLanguageId of commonIds) {
      const registryEntry = PCT_002_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
      if (!registryEntry) {
        failures.push(`Missing task registry ${questionLanguageId}`);
        continue;
      }
      if (registryEntry.cpId !== cpId) failures.push(`Task registry CP mismatch ${questionLanguageId}`);
      const placeholderSets = PCT_002_LANGUAGES.map(
        (language) => new Set(extractPlaceholders(getQuestionEntry(cpId, questionLanguageId, language).template)),
      );
      const [first, ...rest] = placeholderSets;
      if (first && rest.some((set) => !sameSet(first, set))) {
        failures.push(`Cross-language placeholder mismatch ${questionLanguageId}`);
      }
      for (const variable of registryEntry.requiredVariables) {
        if (!placeholderSets.every((set) => set.has(variable))) {
          failures.push(`Required placeholder missing ${questionLanguageId}:${variable}`);
        }
      }
    }
  }
  return { valid: failures.length === 0, failures };
}
