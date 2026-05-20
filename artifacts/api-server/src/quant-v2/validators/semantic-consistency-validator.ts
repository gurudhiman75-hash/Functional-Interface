import type { FormulaQuestion } from "../../lib/core/generator-engine";
import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import type { LocalizedRealization } from "../localization/contracts/language-contracts";
import {
  anchorEntry,
  detectAnchorKeys,
  type SemanticAnchorDomain,
} from "../semantic/anchorLexicon";
import { deriveCanonicalScenario } from "../semantic/canonical-scenario";
import { untranslatedReasoningFragments } from "../semantic/reasoningLexicon";
import type { ValidationResult } from "./problem-validator";

export type SemanticConsistencyMetrics = {
  semanticAnchorConsistencyScore: number;
  domainIntegrityScore: number;
  localizationCompletenessScore: number;
  explanationLocalizationScore: number;
  distractorRealismScore: number;
};

export type SemanticConsistencyReport = ValidationResult & {
  metrics: SemanticConsistencyMetrics;
  canonicalScenario: ReturnType<typeof deriveCanonicalScenario>;
};

type SemanticConsistencyInput = {
  problem: CanonicalPercentageProblem;
  editorial: EditorialRealization;
  localized: Record<string, LocalizedRealization>;
  optionSets?: Record<string, readonly string[]>;
};

function score(issueCount: number, maxPenalty = 18) {
  return Math.max(0, 100 - issueCount * maxPenalty);
}

function quantV2Payload(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 ?? {}) as Record<string, any>;
}

function inputFromQuestion(
  question: FormulaQuestion,
): SemanticConsistencyInput | undefined {
  const quantV2 = quantV2Payload(question);
  if (!quantV2.canonicalProblem || !quantV2.editorial || !quantV2.localized) {
    return undefined;
  }
  return {
    problem: quantV2.canonicalProblem,
    editorial: quantV2.editorial,
    localized: quantV2.localized,
    optionSets: {
      en: question.options ?? [],
      hi: question.optionsHi ?? [],
      pa: question.optionsPa ?? [],
    },
  };
}

function domainLeakageIssues(input: {
  domain: SemanticAnchorDomain;
  allowedAnchorKeys: readonly string[];
  anchorsByLanguage: Record<string, string[]>;
}) {
  const issues: string[] = [];
  const allowed = new Set(input.allowedAnchorKeys);

  for (const [language, anchors] of Object.entries(input.anchorsByLanguage)) {
    for (const key of anchors) {
      const entry = anchorEntry(key);
      if (!entry) continue;
      if (input.domain === "general") continue;
      if (!allowed.has(key) && entry.domain !== input.domain) {
        issues.push(
          `${language} leaked ${entry.domain} anchor ${key} into ${input.domain} domain.`,
        );
      }
    }
  }

  return issues;
}

function anchorConsistencyIssues(input: {
  canonicalObject: string;
  anchorsByLanguage: Record<string, string[]>;
}) {
  const issues: string[] = [];
  const canonical = input.canonicalObject;
  const canonicalEntry = anchorEntry(canonical);

  if (canonicalEntry?.domain === "commercial") {
    for (const language of ["hi", "pa"] as const) {
      const anchors = input.anchorsByLanguage[language] ?? [];
      const commercialAnchors = anchors.filter(
        (key) => anchorEntry(key)?.domain === "commercial",
      );
      if (commercialAnchors.length > 0 && !commercialAnchors.includes(canonical)) {
        issues.push(
          `${language} uses ${commercialAnchors.join(",")} while English locked ${canonical}.`,
        );
      }
    }
  }

  return issues;
}

function optionNumbers(options: readonly string[] | undefined) {
  return (options ?? [])
    .map((option) => Number(String(option).replace(/[^\d.-]/gu, "")))
    .filter((value) => Number.isFinite(value));
}

function distractorRealismIssues(input: {
  problem: CanonicalPercentageProblem;
  optionSets?: Record<string, readonly string[]>;
}) {
  const issues: string[] = [];
  const answer = Math.abs(input.problem.answer);
  if (answer < 100) return issues;

  const displayedDistractors = optionNumbers(input.optionSets?.en).filter(
    (value) => Math.abs(value - input.problem.answer) > 0.01,
  );
  const numericDistractors =
    displayedDistractors.length > 0
      ? displayedDistractors
      : input.problem.distractors;

  for (const distractor of numericDistractors) {
    const magnitude = Math.abs(distractor);
    if (magnitude > answer * 3 && magnitude - answer > 50000) {
      issues.push(
        `Distractor ${distractor} is too far from answer ${input.problem.answer}.`,
      );
    }
  }

  return issues;
}

export function validateSemanticConsistency(
  input: SemanticConsistencyInput | FormulaQuestion,
): SemanticConsistencyReport {
  const normalized =
    "problem" in input ? input : inputFromQuestion(input as FormulaQuestion);

  if (!normalized) {
    const fallbackScenario = {
      object: "unknown",
      domain: "general" as const,
      allowedAnchorKeys: [],
      realismProfile: "unknown",
    };
    return {
      valid: false,
      issues: ["Question is missing quant-v2 semantic payload."],
      metrics: {
        semanticAnchorConsistencyScore: 0,
        domainIntegrityScore: 0,
        localizationCompletenessScore: 0,
        explanationLocalizationScore: 0,
        distractorRealismScore: 0,
      },
      canonicalScenario: fallbackScenario,
    };
  }

  const canonicalScenario = deriveCanonicalScenario({
    problem: normalized.problem,
    editorial: normalized.editorial,
  });
  const anchorsByLanguage = {
    en: detectAnchorKeys(normalized.editorial.stem, "en"),
    hi: detectAnchorKeys(normalized.localized.hi?.stem, "hi"),
    pa: detectAnchorKeys(normalized.localized.pa?.stem, "pa"),
  };

  const anchorIssues = anchorConsistencyIssues({
    canonicalObject: canonicalScenario.object,
    anchorsByLanguage,
  });
  const domainIssues = domainLeakageIssues({
    domain: canonicalScenario.domain,
    allowedAnchorKeys: canonicalScenario.allowedAnchorKeys,
    anchorsByLanguage,
  });
  const localizationIssues: string[] = [];
  if (!normalized.localized.hi?.stem || !normalized.localized.pa?.stem) {
    localizationIssues.push("Missing Hindi or Punjabi stem realization.");
  }
  if (!normalized.localized.hi?.explanation || !normalized.localized.pa?.explanation) {
    localizationIssues.push("Missing Hindi or Punjabi explanation realization.");
  }

  const explanationIssues = [
    ...untranslatedReasoningFragments(normalized.localized.hi?.explanation, "hi")
      .map((fragment) => `Hindi explanation leaked English fragment: ${fragment}.`),
    ...untranslatedReasoningFragments(normalized.localized.pa?.explanation, "pa")
      .map((fragment) => `Punjabi explanation leaked English fragment: ${fragment}.`),
  ];
  const distractorIssues = distractorRealismIssues(normalized);
  const issues = [
    ...anchorIssues,
    ...domainIssues,
    ...localizationIssues,
    ...explanationIssues,
    ...distractorIssues,
  ];

  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      semanticAnchorConsistencyScore: score(anchorIssues.length),
      domainIntegrityScore: score(domainIssues.length),
      localizationCompletenessScore: score(localizationIssues.length, 25),
      explanationLocalizationScore: score(explanationIssues.length),
      distractorRealismScore: score(distractorIssues.length, 12),
    },
    canonicalScenario,
  };
}
