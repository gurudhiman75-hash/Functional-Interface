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
} as const;

export function extractPlaceholders(template: string) {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

export function renderTemplate(template: string, values: Pct002Variables) {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(`Missing placeholder ${key}`);
    }
    return String(value);
  });
}

export function getQuestionLanguageIds(cpId: Pct002CanonicalProblemId, language: Pct002Language) {
  return Object.keys(PCT_002_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families ?? {});
}

export function getCommonQuestionLanguageIds(cpId: Pct002CanonicalProblemId) {
  const [first, ...rest] = PCT_002_LANGUAGES.map((language) => new Set(getQuestionLanguageIds(cpId, language)));
  return [...(first ?? new Set<string>())].filter((id) => rest.every((set) => set.has(id)));
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

export function getExplanationId(cpId: Pct002CanonicalProblemId) {
  const ordinal = PCT_002_CP_IDS.indexOf(cpId) + 1;
  return `PCT-ES-${String(ordinal).padStart(3, "0")}`;
}

export function validatePct002Libraries() {
  const failures: string[] = [];
  if (PCT_002_LIBRARY_REGISTRY.taskRegistry.archetypeId !== PCT_002_ARCHETYPE_ID) {
    failures.push("Task registry archetype mismatch.");
  }

  for (const cpId of PCT_002_CP_IDS) {
    for (const language of PCT_002_LANGUAGES) {
      if (!PCT_002_LIBRARY_REGISTRY.questionLanguage[language][cpId]) {
        failures.push(`Missing QL ${language}:${cpId}`);
      }
      if (!PCT_002_LIBRARY_REGISTRY.explanation[language][cpId]) {
        failures.push(`Missing ES ${language}:${cpId}`);
      }
    }

    for (const questionLanguageId of getCommonQuestionLanguageIds(cpId)) {
      const registryEntry = getTaskRegistryEntry(cpId, questionLanguageId);
      const placeholderSets = PCT_002_LANGUAGES.map((language) =>
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
