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
  PCT_003_ARCHETYPE_ID,
  PCT_003_CP_IDS,
  PCT_003_LANGUAGES,
  type Pct003AnswerType,
  type Pct003CanonicalProblemId,
  type Pct003ExplanationLibrary,
  type Pct003Language,
  type Pct003QuestionLanguageLibrary,
  type Pct003TaskRegistryLibrary,
  type Pct003Variables,
} from "./types";

export const PCT_003_LIBRARY_REGISTRY = {
  questionLanguage: {
    en: questionLanguageEn as Pct003QuestionLanguageLibrary,
    hi: questionLanguageHi as Pct003QuestionLanguageLibrary,
    pa: questionLanguagePa as Pct003QuestionLanguageLibrary,
  },
  explanation: {
    en: explanationEn as Pct003ExplanationLibrary,
    hi: explanationHi as Pct003ExplanationLibrary,
    pa: explanationPa as Pct003ExplanationLibrary,
  },
  variableRanges,
  coverageTargets,
  distributionTargets,
  taskRegistry: taskRegistry as Pct003TaskRegistryLibrary,
} as const;

export function extractPlaceholders(template: string) {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

export function renderTemplate(template: string, values: Pct003Variables) {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(`Missing placeholder ${key}`);
    }
    return String(value);
  });
}

export function getQuestionLanguageIds(cpId: Pct003CanonicalProblemId, language: Pct003Language) {
  return Object.keys(PCT_003_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families ?? {});
}

export function getCommonQuestionLanguageIds(cpId: Pct003CanonicalProblemId) {
  const [first, ...rest] = PCT_003_LANGUAGES.map((language) => new Set(getQuestionLanguageIds(cpId, language)));
  return [...(first ?? new Set<string>())].filter((id) => rest.every((set) => set.has(id)));
}

export function getQuestionEntry(cpId: Pct003CanonicalProblemId, questionLanguageId: string, language: Pct003Language) {
  const entry = PCT_003_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families[questionLanguageId];
  if (!entry) throw new Error(`Missing question language ${language}:${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskRegistryEntry(cpId: Pct003CanonicalProblemId, questionLanguageId: string) {
  const entry = PCT_003_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
  if (!entry) throw new Error(`Missing task registry entry ${questionLanguageId}`);
  if (entry.cpId !== cpId) throw new Error(`Task registry CP mismatch ${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskKind(cpId: Pct003CanonicalProblemId, questionLanguageId: string) {
  return getTaskRegistryEntry(cpId, questionLanguageId).taskKind;
}

export function getAnswerType(cpId: Pct003CanonicalProblemId, questionLanguageId: string): Pct003AnswerType {
  return getTaskRegistryEntry(cpId, questionLanguageId).answerType;
}

export function getRequiredVariables(cpId: Pct003CanonicalProblemId, questionLanguageId: string) {
  return [...getTaskRegistryEntry(cpId, questionLanguageId).requiredVariables];
}

export function getExplanationId(cpId: Pct003CanonicalProblemId) {
  const ordinal = PCT_003_CP_IDS.indexOf(cpId) + 1;
  return `PCT-ES-${String(ordinal).padStart(3, "0")}`;
}

export function validatePct003Libraries() {
  const failures: string[] = [];
  if (PCT_003_LIBRARY_REGISTRY.taskRegistry.archetypeId !== PCT_003_ARCHETYPE_ID) {
    failures.push("Task registry archetype mismatch.");
  }

  for (const cpId of PCT_003_CP_IDS) {
    for (const language of PCT_003_LANGUAGES) {
      if (!PCT_003_LIBRARY_REGISTRY.questionLanguage[language][cpId]) {
        failures.push(`Missing QL ${language}:${cpId}`);
      }
      if (!PCT_003_LIBRARY_REGISTRY.explanation[language][cpId]) {
        failures.push(`Missing ES ${language}:${cpId}`);
      }
    }

    for (const questionLanguageId of getCommonQuestionLanguageIds(cpId)) {
      const registryEntry = getTaskRegistryEntry(cpId, questionLanguageId);
      const placeholderSets = PCT_003_LANGUAGES.map((language) =>
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
