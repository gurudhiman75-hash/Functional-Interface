import questionLanguageEn from "../question-language.en.json" assert { type: "json" };
import questionLanguageHi from "../question-language.hi.json" assert { type: "json" };
import questionLanguagePa from "../question-language.pa.json" assert { type: "json" };
import explanationEn from "../explanation.en.json" assert { type: "json" };
import explanationHi from "../explanation.hi.json" assert { type: "json" };
import explanationPa from "../explanation.pa.json" assert { type: "json" };
import variableRanges from "../variable-ranges.library.json" assert { type: "json" };
import coverageTargets from "../coverage-targets.library.json" assert { type: "json" };
import distributionTargets from "../distribution-targets.library.json" assert { type: "json" };
import taskRegistry from "../task-registry.library.json" assert { type: "json" };
import {
  PCT_004_ARCHETYPE_ID,
  PCT_004_CP_IDS,
  PCT_004_LANGUAGES,
  type Pct004AnswerType,
  type Pct004CanonicalProblemId,
  type Pct004ExplanationLibrary,
  type Pct004Language,
  type Pct004QuestionLanguageLibrary,
  type Pct004TaskRegistryLibrary,
  type Pct004Variables,
} from "./types";

export const PCT_004_LIBRARY_REGISTRY = {
  questionLanguage: {
    en: questionLanguageEn as Pct004QuestionLanguageLibrary,
    hi: questionLanguageHi as Pct004QuestionLanguageLibrary,
    pa: questionLanguagePa as Pct004QuestionLanguageLibrary,
  },
  explanation: {
    en: explanationEn as Pct004ExplanationLibrary,
    hi: explanationHi as Pct004ExplanationLibrary,
    pa: explanationPa as Pct004ExplanationLibrary,
  },
  variableRanges,
  coverageTargets,
  distributionTargets,
  taskRegistry: taskRegistry as Pct004TaskRegistryLibrary,
} as const;

export function extractPlaceholders(template: string) {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

export function renderTemplate(template: string, values: Pct004Variables) {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(`Missing placeholder ${key}`);
    }
    return String(value);
  });
}

export function getQuestionLanguageIds(cpId: Pct004CanonicalProblemId, language: Pct004Language) {
  return Object.keys(PCT_004_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families ?? {});
}

export function getCommonQuestionLanguageIds(cpId: Pct004CanonicalProblemId) {
  const [first, ...rest] = PCT_004_LANGUAGES.map((language) => new Set(getQuestionLanguageIds(cpId, language)));
  return [...(first ?? new Set<string>())].filter((id) => rest.every((set) => set.has(id)));
}

export function getQuestionEntry(cpId: Pct004CanonicalProblemId, questionLanguageId: string, language: Pct004Language) {
  const entry = PCT_004_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families[questionLanguageId];
  if (!entry) throw new Error(`Missing question language ${language}:${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskRegistryEntry(cpId: Pct004CanonicalProblemId, questionLanguageId: string) {
  const entry = PCT_004_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
  if (!entry) throw new Error(`Missing task registry entry ${questionLanguageId}`);
  if (entry.cpId !== cpId) throw new Error(`Task registry CP mismatch ${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskKind(cpId: Pct004CanonicalProblemId, questionLanguageId: string) {
  return getTaskRegistryEntry(cpId, questionLanguageId).taskKind;
}

export function getAnswerType(cpId: Pct004CanonicalProblemId, questionLanguageId: string): Pct004AnswerType {
  return getTaskRegistryEntry(cpId, questionLanguageId).answerType;
}

export function getRequiredVariables(cpId: Pct004CanonicalProblemId, questionLanguageId: string) {
  return [...getTaskRegistryEntry(cpId, questionLanguageId).requiredVariables];
}

export function getExplanationId(cpId: Pct004CanonicalProblemId) {
  const ordinal = PCT_004_CP_IDS.indexOf(cpId) + 1;
  return `PCT-ES-${String(ordinal).padStart(3, "0")}`;
}

export function validatePct004Libraries() {
  const failures: string[] = [];
  if (PCT_004_LIBRARY_REGISTRY.taskRegistry.archetypeId !== PCT_004_ARCHETYPE_ID) {
    failures.push("Task registry archetype mismatch.");
  }

  for (const cpId of PCT_004_CP_IDS) {
    for (const language of PCT_004_LANGUAGES) {
      if (!PCT_004_LIBRARY_REGISTRY.questionLanguage[language][cpId]) {
        failures.push(`Missing QL ${language}:${cpId}`);
      }
      if (!PCT_004_LIBRARY_REGISTRY.explanation[language][cpId]) {
        failures.push(`Missing ES ${language}:${cpId}`);
      }
    }

    for (const questionLanguageId of getCommonQuestionLanguageIds(cpId)) {
      const registryEntry = getTaskRegistryEntry(cpId, questionLanguageId);
      const placeholderSets = PCT_004_LANGUAGES.map((language) =>
        new Set(extractPlaceholders(getQuestionEntry(cpId, questionLanguageId, language).template)),
      );
      for (const variable of registryEntry.requiredVariables) {
        if (!placeholderSets.every((set) => set.has(variable))) {
          failures.push(`Required placeholder missing ${questionLanguageId}:${variable}`);
        }
      }
    }
  }

  return { valid: failures.length === 0, failures };
}
