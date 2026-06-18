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
import semanticLibrary from "./semantic/percentage-semantic-library.json" assert { type: "json" };
import scenarioMap from "./semantic/scenario-map.json" assert { type: "json" };
import compatibilityMap from "./semantic/compatibility-map.json" assert { type: "json" };
import frequencyModel from "./semantic/frequency-model.json" assert { type: "json" };
import grammarRules from "./semantic/grammar-rules.json" assert { type: "json" };
import {
  PCT_001_CP_IDS,
  PCT_001_LANGUAGES,
  PCT_001_ARCHETYPE_ID,
  type Pct001CanonicalProblemId,
  type Pct001ExplanationLibrary,
  type Pct001Language,
  type Pct001QuestionLanguageLibrary,
  type Pct001AnswerType,
  type Pct001TaskRegistryLibrary,
  type Pct001Variables,
  type Pct001SemanticContext,
} from "./types";

export const PCT_001_LIBRARY_REGISTRY = {
  questionLanguage: {
    en: questionLanguageEn as Pct001QuestionLanguageLibrary,
    hi: questionLanguageHi as Pct001QuestionLanguageLibrary,
    pa: questionLanguagePa as Pct001QuestionLanguageLibrary,
  },
  explanation: {
    en: explanationEn as Pct001ExplanationLibrary,
    hi: explanationHi as Pct001ExplanationLibrary,
    pa: explanationPa as Pct001ExplanationLibrary,
  },
  variableRanges,
  coverageTargets,
  distributionTargets,
  taskRegistry: taskRegistry as Pct001TaskRegistryLibrary,
  semantic: {
    library: semanticLibrary,
    scenarioMap: scenarioMap as Record<string, string>,
    compatibilityMap,
    frequencyModel,
    grammarRules,
  },
} as const;

export function getQuestionLanguageIds(cpId: Pct001CanonicalProblemId, language: Pct001Language) {
  return Object.keys(PCT_001_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families ?? {});
}

export function getCommonQuestionLanguageIds(cpId: Pct001CanonicalProblemId) {
  const [first, ...rest] = PCT_001_LANGUAGES.map((language) => new Set(getQuestionLanguageIds(cpId, language)));
  return [...(first ?? new Set<string>())].filter((id) => rest.every((set) => set.has(id)));
}

export function getQuestionEntry(cpId: Pct001CanonicalProblemId, questionLanguageId: string, language: Pct001Language) {
  const entry = PCT_001_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families[questionLanguageId];
  if (!entry) throw new Error(`Missing question language ${language}:${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskRegistryEntry(cpId: Pct001CanonicalProblemId, questionLanguageId: string) {
  const entry = PCT_001_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
  if (!entry) throw new Error(`Missing task registry entry ${questionLanguageId}`);
  if (entry.cpId !== cpId) throw new Error(`Task registry CP mismatch ${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskKind(cpId: Pct001CanonicalProblemId, questionLanguageId: string) {
  return getTaskRegistryEntry(cpId, questionLanguageId).taskKind;
}

export function getAnswerType(cpId: Pct001CanonicalProblemId, questionLanguageId: string): Pct001AnswerType {
  return getTaskRegistryEntry(cpId, questionLanguageId).answerType;
}

export function getRequiredVariables(cpId: Pct001CanonicalProblemId, questionLanguageId: string) {
  return [...getTaskRegistryEntry(cpId, questionLanguageId).requiredVariables];
}

export function getExplanationSteps(cpId: Pct001CanonicalProblemId, taskKind: string, language: Pct001Language, variantKey = 0) {
  const entry = PCT_001_LIBRARY_REGISTRY.explanation[language][cpId];
  if (!entry) throw new Error(`Missing explanation ${language}:${cpId}`);
  const family = entry.taskExplanations?.[taskKind];
  if (!family) throw new Error(`Missing task explanation ${language}:${cpId}:${taskKind}`);
  const resolved = family.aliasOf ? entry.taskExplanations?.[family.aliasOf] : family;
  const variants = resolved?.variants?.filter((variant) => variant.length > 0) ?? [];
  if (variants.length > 0) return [...variants[Math.abs(variantKey) % variants.length]!];
  if (!resolved?.steps?.length) throw new Error(`Missing task explanation steps ${language}:${cpId}:${taskKind}`);
  return [...resolved.steps];
}

export function getExplanationVariantCount(cpId: Pct001CanonicalProblemId, taskKind: string, language: Pct001Language) {
  const entry = PCT_001_LIBRARY_REGISTRY.explanation[language][cpId];
  const family = entry?.taskExplanations?.[taskKind];
  const resolved = family?.aliasOf ? entry?.taskExplanations?.[family.aliasOf] : family;
  return resolved?.variants?.length ?? (resolved?.steps?.length ? 1 : 0);
}

export function getExplanationId(cpId: Pct001CanonicalProblemId) {
  const ordinal = PCT_001_CP_IDS.indexOf(cpId) + 1;
  return `PCT-ES-${String(ordinal).padStart(3, "0")}`;
}

export function extractPlaceholders(template: string) {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

export function renderTemplate(template: string, values: Pct001Variables) {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(`Missing placeholder ${key}`);
    }
    return String(value);
  });
}

export function buildPct001SemanticTrace(context?: Pct001SemanticContext) {
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
        PCT_001_LIBRARY_REGISTRY.semantic.frequencyModel.assignments[entity.id] ?? entity.frequency ?? "common",
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

export function validatePct001Libraries() {
  const failures: string[] = [];
  if (PCT_001_LIBRARY_REGISTRY.taskRegistry.archetypeId !== PCT_001_ARCHETYPE_ID) failures.push("Task registry archetype mismatch.");
  for (const cpId of PCT_001_CP_IDS) {
    for (const language of PCT_001_LANGUAGES) {
      if (!PCT_001_LIBRARY_REGISTRY.questionLanguage[language][cpId]) failures.push(`Missing QL ${language}:${cpId}`);
      if (!PCT_001_LIBRARY_REGISTRY.explanation[language][cpId]) failures.push(`Missing ES ${language}:${cpId}`);
      for (const questionLanguageId of getQuestionLanguageIds(cpId, language)) {
        const registryEntry = PCT_001_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
        if (!registryEntry) failures.push(`Missing task registry ${questionLanguageId}`);
        else if (registryEntry.cpId !== cpId) failures.push(`Task registry CP mismatch ${questionLanguageId}`);
      }
    }
    for (const questionLanguageId of getCommonQuestionLanguageIds(cpId)) {
      const required = new Set(getRequiredVariables(cpId, questionLanguageId));
      const placeholderSets = PCT_001_LANGUAGES.map((language) => new Set(extractPlaceholders(getQuestionEntry(cpId, questionLanguageId, language).template)));
      for (const variable of required) {
        if (!placeholderSets.every((set) => set.has(variable))) failures.push(`Required placeholder missing ${questionLanguageId}:${variable}`);
      }
      const [first, ...rest] = placeholderSets;
      if (first && rest.some((set) => first.size !== set.size || [...first].some((value) => !set.has(value)))) {
        failures.push(`Cross-language placeholder mismatch ${questionLanguageId}`);
      }
    }
  }
  return { valid: failures.length === 0, failures };
}
