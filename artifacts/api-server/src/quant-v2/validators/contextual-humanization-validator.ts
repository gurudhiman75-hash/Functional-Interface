import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import { semanticAnswerText } from "../editorial/contextual-humanization";
import type { ValidationResult } from "./problem-validator";

export interface ContextualHumanizationMetrics {
  contextualRealismScore: number;
  domainNarrationScore: number;
  semanticAnswerConsistency: number;
  shortcutContextualizationScore: number;
  coachingAuthenticityScore: number;
}

const GENERIC_LABEL_PATTERN =
  /^(?:Required difference|Changed value is|Remaining value|Total value is|Required percentage is|At this stage, the value is|100% value is|Original value is|Filtered value)\s*:/imu;

const DOMAIN_TERMS = {
  election_margin: /\b(?:votes?|margin|winner|registered voters|valid votes|votes polled)\b/iu,
  pass_fail: /\b(?:marks?|pass mark|candidate|score|paper)\b/iu,
  population_growth: /\b(?:population|male|female|migration|growth|reduction)\b/iu,
  price_consumption: /\b(?:price|consumption|expenditure|spending)\b/iu,
  profit_loss: /\b(?:cost price|selling price|profit|loss)\b/iu,
  mixture_percentage: /\b(?:mixture|water|milk|pure component|quantity)\b/iu,
  salary_revision: /\b(?:salary|increase|decrease|percentage change)\b/iu,
  restore_original: /\b(?:reduction|remaining|required increase|original)\b/iu,
  reverse_percentage: /\b(?:quantity|total|100%)\b/iu,
  increase_then_decrease: /\b(?:increase|decrease|final value|change)\b/iu,
} as const;

const BARE_SHORTCUT_PATTERN = /Shortcut:\n\s*\d+(?:\.\d+)?%\s*=\s*\d/iu;
const CONTEXTUAL_SHORTCUT_PATTERN =
  /(?:\d+(?:\.\d+)?%\s+(?:votes|marks|quantity|consumption|value)\s*=|100%\s+(?:votes|marks|quantity|consumption|value)\s*=|(?:Required increase|Reduction in consumption|(?:Profit|Loss) percentage|Maximum marks|Total (?:quantity|votes|value))\s*=)/iu;

function score(hasIssue: boolean, penalty = 35) {
  return hasIssue ? Math.max(0, 100 - penalty) : 100;
}

function domainPattern(problem: CanonicalPercentageProblem) {
  return DOMAIN_TERMS[
    problem.subtype as keyof typeof DOMAIN_TERMS
  ] ?? /\b(?:value|percentage|total)\b/iu;
}

function hasGenericLabel(realization: EditorialRealization) {
  return GENERIC_LABEL_PATTERN.test(realization.explanation);
}

function hasDomainNarration(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
) {
  return domainPattern(problem).test(realization.explanation);
}

function hasSemanticAnswer(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
) {
  const semanticAnswer = semanticAnswerText(problem);
  return realization.explanation.includes(semanticAnswer);
}

function hasShortcutIssue(realization: EditorialRealization) {
  if (!realization.naturalization.shortcutSurfaced) {
    return false;
  }

  return BARE_SHORTCUT_PATTERN.test(realization.explanation) ||
    !CONTEXTUAL_SHORTCUT_PATTERN.test(realization.explanation);
}

export function createContextualHumanizationMetrics(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
): ContextualHumanizationMetrics {
  const genericLabel = hasGenericLabel(realization);
  const missingDomainNarration = !hasDomainNarration(problem, realization);
  const answerMismatch = !hasSemanticAnswer(problem, realization);
  const shortcutIssue = hasShortcutIssue(realization);
  const coachingIssue = genericLabel || missingDomainNarration;

  const contextualRealismScore = score(genericLabel);
  const domainNarrationScore = score(missingDomainNarration);
  const semanticAnswerConsistency = score(answerMismatch, 45);
  const shortcutContextualizationScore = score(shortcutIssue, 45);
  const coachingAuthenticityScore = score(coachingIssue);

  return {
    contextualRealismScore,
    domainNarrationScore,
    semanticAnswerConsistency,
    shortcutContextualizationScore,
    coachingAuthenticityScore,
  };
}

export function validateContextualHumanization(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
): ValidationResult {
  const issues: string[] = [];
  const metrics = createContextualHumanizationMetrics(problem, realization);

  if (hasGenericLabel(realization)) {
    issues.push("Explanation contains generic semantic label.");
  }
  if (!hasDomainNarration(problem, realization)) {
    issues.push("Explanation lacks context-native domain narration.");
  }
  if (!hasSemanticAnswer(problem, realization)) {
    issues.push("Final answer is not semantically normalized.");
  }
  if (hasShortcutIssue(realization)) {
    issues.push("Shortcut is not context-aware.");
  }
  if (Math.min(...Object.values(metrics)) < 90) {
    issues.push("Contextual humanization score is too low.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
