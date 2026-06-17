import questionLanguageEn from "./question-language.en.json" assert { type: "json" };
import questionLanguageHi from "./question-language.hi.json" assert { type: "json" };
import questionLanguagePa from "./question-language.pa.json" assert { type: "json" };
import explanationEn from "./explanation.en.json" assert { type: "json" };
import explanationHi from "./explanation.hi.json" assert { type: "json" };
import explanationPa from "./explanation.pa.json" assert { type: "json" };
import taskRegistry from "./task-registry.library.json" assert { type: "json" };
import variableRanges from "./variable-ranges.library.json" assert { type: "json" };
import coverageTargets from "./coverage-targets.library.json" assert { type: "json" };
import distributionTargets from "./distribution-targets.library.json" assert { type: "json" };
import semanticLibrary from "./semantic/ratio-semantic-library.json" assert { type: "json" };
import scenarioMap from "./semantic/scenario-map.json" assert { type: "json" };
import compatibilityMap from "./semantic/compatibility-map.json" assert { type: "json" };
import frequencyModel from "./semantic/frequency-model.json" assert { type: "json" };
import grammarRules from "./semantic/grammar-rules.json" assert { type: "json" };
import {
  RAP_001_ARCHETYPE_ID,
  RAP_001_CP_IDS,
  RAP_001_LANGUAGES,
  type Rap001AnswerType,
  type Rap001CanonicalProblemId,
  type Rap001ExplanationLibrary,
  type Rap001Language,
  type Rap001QuestionLanguageLibrary,
  type Rap001TaskRegistryLibrary,
  type Rap001Variables,
  type Rap001SemanticContext,
  type Rap001SemanticEntity,
} from "./types";

export const RAP_001_LIBRARY_REGISTRY = {
  questionLanguage: {
    en: questionLanguageEn as Rap001QuestionLanguageLibrary,
    hi: questionLanguageHi as Rap001QuestionLanguageLibrary,
    pa: questionLanguagePa as Rap001QuestionLanguageLibrary,
  },
  explanation: {
    en: explanationEn as Rap001ExplanationLibrary,
    hi: explanationHi as Rap001ExplanationLibrary,
    pa: explanationPa as Rap001ExplanationLibrary,
  },
  taskRegistry: taskRegistry as Rap001TaskRegistryLibrary,
  variableRanges,
  coverageTargets,
  distributionTargets,
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

export function renderTemplate(template: string, values: Rap001Variables) {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(`Missing placeholder ${key}`);
    }
    return String(value);
  });
}

function semanticEntitiesById() {
  const records = new Map<string, Rap001SemanticEntity>();
  for (const domain of Object.values(RAP_001_LIBRARY_REGISTRY.semantic.library.domains)) {
    for (const entity of (domain as { entities: Rap001SemanticEntity[] }).entities) {
      records.set(entity.id, entity);
    }
  }
  return records;
}

export function resolveRap001EntityVariables(values: Rap001Variables, language: Rap001Language): Rap001Variables {
  const records = semanticEntitiesById();
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      if (typeof value !== "string") return [key, value];
      const entity = records.get(value);
      return [key, entity ? entity[language] : value];
    }),
  );
}

export function buildRap001SemanticTrace(context?: Rap001SemanticContext) {
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
        RAP_001_LIBRARY_REGISTRY.semantic.frequencyModel.assignments[entity.id] ?? entity.frequency ?? "common",
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

export function getQuestionLanguageIds(cpId: Rap001CanonicalProblemId, language: Rap001Language) {
  return Object.keys(RAP_001_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families ?? {});
}

export function getCommonQuestionLanguageIds(cpId: Rap001CanonicalProblemId) {
  const [first, ...rest] = RAP_001_LANGUAGES.map((language) => new Set(getQuestionLanguageIds(cpId, language)));
  return [...(first ?? new Set<string>())].filter((id) => rest.every((set) => set.has(id)));
}

export function getActiveQuestionLanguageIds() {
  return RAP_001_CP_IDS.flatMap((cpId) => getCommonQuestionLanguageIds(cpId));
}

export function getQuestionEntry(cpId: Rap001CanonicalProblemId, questionLanguageId: string, language: Rap001Language) {
  const entry = RAP_001_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families[questionLanguageId];
  if (!entry) throw new Error(`Missing question language ${language}:${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskRegistryEntry(cpId: Rap001CanonicalProblemId, questionLanguageId: string) {
  const entry = RAP_001_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
  if (!entry) throw new Error(`Missing task registry entry ${questionLanguageId}`);
  if (entry.cpId !== cpId) throw new Error(`Task registry CP mismatch ${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskKind(cpId: Rap001CanonicalProblemId, questionLanguageId: string) {
  return getTaskRegistryEntry(cpId, questionLanguageId).taskKind;
}

export function getAnswerType(cpId: Rap001CanonicalProblemId, questionLanguageId: string): Rap001AnswerType {
  return getTaskRegistryEntry(cpId, questionLanguageId).answerType;
}

export function getRequiredVariables(cpId: Rap001CanonicalProblemId, questionLanguageId: string) {
  return [...getTaskRegistryEntry(cpId, questionLanguageId).requiredVariables];
}

export function getExplanationEntry(cpId: Rap001CanonicalProblemId, language: Rap001Language) {
  const entry = RAP_001_LIBRARY_REGISTRY.explanation[language][cpId];
  if (!entry) throw new Error(`Missing explanation ${language}:${cpId}`);
  return entry;
}

export function getExplanationId(cpId: Rap001CanonicalProblemId, language: Rap001Language = "en") {
  return getExplanationEntry(cpId, language).explanationId;
}

export function getExplanationSteps(cpId: Rap001CanonicalProblemId, language: Rap001Language) {
  return [...getExplanationEntry(cpId, language).steps];
}

function sameSet(left: Set<string>, right: Set<string>) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

export function validateRap001Libraries() {
  const failures: string[] = [];
  if (RAP_001_LIBRARY_REGISTRY.taskRegistry.archetypeId !== RAP_001_ARCHETYPE_ID) failures.push("Task registry archetype mismatch.");
  for (const cpId of RAP_001_CP_IDS) {
    for (const language of RAP_001_LANGUAGES) {
      if (!RAP_001_LIBRARY_REGISTRY.questionLanguage[language][cpId]) failures.push(`Missing QL ${language}:${cpId}`);
      if (!RAP_001_LIBRARY_REGISTRY.explanation[language][cpId]) failures.push(`Missing ES ${language}:${cpId}`);
    }
    const commonIds = getCommonQuestionLanguageIds(cpId);
    if (commonIds.length === 0) failures.push(`No active multilingual QLs for ${cpId}`);
    for (const questionLanguageId of commonIds) {
      const registryEntry = getTaskRegistryEntry(cpId, questionLanguageId);
      const placeholderSets = RAP_001_LANGUAGES.map(
        (language) => new Set(extractPlaceholders(getQuestionEntry(cpId, questionLanguageId, language).template)),
      );
      const [first, ...rest] = placeholderSets;
      if (first && rest.some((set) => !sameSet(first, set))) failures.push(`Cross-language placeholder mismatch ${questionLanguageId}`);
      for (const variable of registryEntry.requiredVariables) {
        if (!placeholderSets.every((set) => set.has(variable))) failures.push(`Required placeholder missing ${questionLanguageId}:${variable}`);
      }
    }
  }
  return { valid: failures.length === 0, failures };
}
