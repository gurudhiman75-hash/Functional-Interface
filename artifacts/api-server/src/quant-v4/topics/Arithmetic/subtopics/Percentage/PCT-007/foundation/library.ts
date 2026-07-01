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
  PCT_007_ARCHETYPE_ID,
  PCT_007_CP_IDS,
  PCT_007_LANGUAGES,
  type Pct007AnswerType,
  type Pct007CanonicalProblemId,
  type Pct007ExplanationLibrary,
  type Pct007Language,
  type Pct007QuestionLanguageLibrary,
  type Pct007SolveMode,
  type Pct007TaskKind,
  type Pct007TaskRegistryLibrary,
  type Pct007Variables,
} from "./types";

export const PCT_007_LIBRARY_REGISTRY = {
  questionLanguage: {
    en: questionLanguageEn as Pct007QuestionLanguageLibrary,
    hi: questionLanguageHi as Pct007QuestionLanguageLibrary,
    pa: questionLanguagePa as Pct007QuestionLanguageLibrary,
  },
  explanation: {
    en: explanationEn as Pct007ExplanationLibrary,
    hi: explanationHi as Pct007ExplanationLibrary,
    pa: explanationPa as Pct007ExplanationLibrary,
  },
  variableRanges,
  coverageTargets,
  distributionTargets,
  taskRegistry: taskRegistry as Pct007TaskRegistryLibrary,
} as const;

export function extractPlaceholders(template: string) {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

export function renderTemplate(template: string, values: Pct007Variables) {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(`Missing placeholder ${key}`);
    }
    return String(value);
  });
}

export function getQuestionLanguageIds(cpId: Pct007CanonicalProblemId, language: Pct007Language) {
  return Object.keys(PCT_007_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families ?? {});
}

export function getCommonQuestionLanguageIds(cpId: Pct007CanonicalProblemId) {
  const [first, ...rest] = PCT_007_LANGUAGES.map((language) => new Set(getQuestionLanguageIds(cpId, language)));
  return [...(first ?? new Set<string>())].filter((id) => rest.every((set) => set.has(id)));
}

export function getQuestionEntry(cpId: Pct007CanonicalProblemId, questionLanguageId: string, language: Pct007Language) {
  const entry = PCT_007_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families[questionLanguageId];
  if (!entry) throw new Error(`Missing question language ${language}:${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskRegistryEntry(cpId: Pct007CanonicalProblemId, questionLanguageId: string) {
  const entry = PCT_007_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
  if (!entry) throw new Error(`Missing task registry entry ${questionLanguageId}`);
  if (entry.cpId !== cpId) throw new Error(`Task registry CP mismatch ${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskKind(cpId: Pct007CanonicalProblemId, questionLanguageId: string): Pct007TaskKind {
  return getTaskRegistryEntry(cpId, questionLanguageId).taskKind;
}

export function getSolveMode(cpId: Pct007CanonicalProblemId, questionLanguageId: string): Pct007SolveMode {
  return getTaskRegistryEntry(cpId, questionLanguageId).solveMode;
}

export function getAnswerType(cpId: Pct007CanonicalProblemId, questionLanguageId: string): Pct007AnswerType {
  return getTaskRegistryEntry(cpId, questionLanguageId).answerType;
}

export function getRequiredVariables(cpId: Pct007CanonicalProblemId, questionLanguageId: string) {
  return [...getTaskRegistryEntry(cpId, questionLanguageId).requiredVariables];
}

export function getScenarioFamily(cpId: Pct007CanonicalProblemId, questionLanguageId: string) {
  return getTaskRegistryEntry(cpId, questionLanguageId).scenarioFamily;
}

export function getContextTag(cpId: Pct007CanonicalProblemId, questionLanguageId: string) {
  return getTaskRegistryEntry(cpId, questionLanguageId).contextTag;
}

export function getExplanationId(cpId: Pct007CanonicalProblemId) {
  const ordinal = PCT_007_CP_IDS.indexOf(cpId) + 1;
  return `PCT-ES-${String(ordinal).padStart(3, "0")}`;
}

export function validatePct007Libraries() {
  const failures: string[] = [];
  if (PCT_007_LIBRARY_REGISTRY.taskRegistry.archetypeId !== PCT_007_ARCHETYPE_ID) {
    failures.push("Task registry archetype mismatch.");
  }

  for (const cpId of PCT_007_CP_IDS) {
    for (const language of PCT_007_LANGUAGES) {
      if (!PCT_007_LIBRARY_REGISTRY.questionLanguage[language][cpId]) {
        failures.push(`Missing QL ${language}:${cpId}`);
      }
      if (!PCT_007_LIBRARY_REGISTRY.explanation[language][cpId]) {
        failures.push(`Missing ES ${language}:${cpId}`);
      }
    }

    for (const questionLanguageId of getCommonQuestionLanguageIds(cpId)) {
      const registryEntry = getTaskRegistryEntry(cpId, questionLanguageId);
      const placeholderSets = PCT_007_LANGUAGES.map((language) =>
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
