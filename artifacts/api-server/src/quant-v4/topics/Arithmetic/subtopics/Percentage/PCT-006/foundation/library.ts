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
  PCT_006_ARCHETYPE_ID,
  PCT_006_CP_IDS,
  PCT_006_LANGUAGES,
  type Pct006AnswerType,
  type Pct006CanonicalProblemId,
  type Pct006ExplanationLibrary,
  type Pct006Language,
  type Pct006QuestionLanguageLibrary,
  type Pct006SolveMode,
  type Pct006TaskKind,
  type Pct006TaskRegistryLibrary,
  type Pct006Variables,
} from "./types";

export const PCT_006_LIBRARY_REGISTRY = {
  questionLanguage: {
    en: questionLanguageEn as Pct006QuestionLanguageLibrary,
    hi: questionLanguageHi as Pct006QuestionLanguageLibrary,
    pa: questionLanguagePa as Pct006QuestionLanguageLibrary,
  },
  explanation: {
    en: explanationEn as Pct006ExplanationLibrary,
    hi: explanationHi as Pct006ExplanationLibrary,
    pa: explanationPa as Pct006ExplanationLibrary,
  },
  variableRanges,
  coverageTargets,
  distributionTargets,
  taskRegistry: taskRegistry as Pct006TaskRegistryLibrary,
} as const;

export function extractPlaceholders(template: string) {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

export function renderTemplate(template: string, values: Pct006Variables) {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(`Missing placeholder ${key}`);
    }
    return String(value);
  });
}

export function getQuestionLanguageIds(cpId: Pct006CanonicalProblemId, language: Pct006Language) {
  return Object.keys(PCT_006_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families ?? {});
}

export function getCommonQuestionLanguageIds(cpId: Pct006CanonicalProblemId) {
  const [first, ...rest] = PCT_006_LANGUAGES.map((language) => new Set(getQuestionLanguageIds(cpId, language)));
  return [...(first ?? new Set<string>())].filter((id) => rest.every((set) => set.has(id)));
}

export function getQuestionEntry(cpId: Pct006CanonicalProblemId, questionLanguageId: string, language: Pct006Language) {
  const entry = PCT_006_LIBRARY_REGISTRY.questionLanguage[language][cpId]?.families[questionLanguageId];
  if (!entry) throw new Error(`Missing question language ${language}:${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskRegistryEntry(cpId: Pct006CanonicalProblemId, questionLanguageId: string) {
  const entry = PCT_006_LIBRARY_REGISTRY.taskRegistry.entries[questionLanguageId];
  if (!entry) throw new Error(`Missing task registry entry ${questionLanguageId}`);
  if (entry.cpId !== cpId) throw new Error(`Task registry CP mismatch ${cpId}:${questionLanguageId}`);
  return entry;
}

export function getTaskKind(cpId: Pct006CanonicalProblemId, questionLanguageId: string): Pct006TaskKind {
  return getTaskRegistryEntry(cpId, questionLanguageId).taskKind;
}

export function getSolveMode(cpId: Pct006CanonicalProblemId, questionLanguageId: string): Pct006SolveMode {
  return getTaskRegistryEntry(cpId, questionLanguageId).solveMode;
}

export function getAnswerType(cpId: Pct006CanonicalProblemId, questionLanguageId: string): Pct006AnswerType {
  return getTaskRegistryEntry(cpId, questionLanguageId).answerType;
}

export function getRequiredVariables(cpId: Pct006CanonicalProblemId, questionLanguageId: string) {
  return [...getTaskRegistryEntry(cpId, questionLanguageId).requiredVariables];
}

export function getScenarioFamily(cpId: Pct006CanonicalProblemId, questionLanguageId: string) {
  return getTaskRegistryEntry(cpId, questionLanguageId).scenarioFamily;
}

export function getContextTag(cpId: Pct006CanonicalProblemId, questionLanguageId: string) {
  return getTaskRegistryEntry(cpId, questionLanguageId).contextTag;
}

export function getExplanationId(cpId: Pct006CanonicalProblemId) {
  const ordinal = PCT_006_CP_IDS.indexOf(cpId) + 1;
  return `PCT-ES-${String(ordinal).padStart(3, "0")}`;
}

export function validatePct006Libraries() {
  const failures: string[] = [];
  if (PCT_006_LIBRARY_REGISTRY.taskRegistry.archetypeId !== PCT_006_ARCHETYPE_ID) {
    failures.push("Task registry archetype mismatch.");
  }

  for (const cpId of PCT_006_CP_IDS) {
    for (const language of PCT_006_LANGUAGES) {
      if (!PCT_006_LIBRARY_REGISTRY.questionLanguage[language][cpId]) {
        failures.push(`Missing QL ${language}:${cpId}`);
      }
      if (!PCT_006_LIBRARY_REGISTRY.explanation[language][cpId]) {
        failures.push(`Missing ES ${language}:${cpId}`);
      }
    }

    for (const questionLanguageId of getCommonQuestionLanguageIds(cpId)) {
      const registryEntry = getTaskRegistryEntry(cpId, questionLanguageId);
      const placeholderSets = PCT_006_LANGUAGES.map((language) =>
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
