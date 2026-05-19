import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import { semanticAnswerText } from "../editorial/contextual-humanization";
import { semanticValueForLabel } from "../editorial/semantic-values";
import { createProblemSignature } from "../utils/problem-signature";
import type { ValidationResult } from "./problem-validator";

export interface SemanticStabilityMetrics {
  semanticStabilityScore: number;
  formatterSafetyScore: number;
  answerConsistencyScore: number;
  realizationSafetyScore: number;
  shortcutCompressionScore: number;
  signatureSemanticSafetyScore: number;
}

const OLD_ENDING_PATTERN = /Therefore, the required answer is/iu;
const SIGN_LEAKAGE_PATTERN =
  /(?:required answer|answer|result|percentage|reduction|loss|decrease)\s*(?:is|=)\s*-\d/iu;
const NEGATIVE_SIGNATURE_PATTERN = /(?:^|[|_])-\d|ans=-/u;
const AMBIGUOUS_SIGNATURE_PATTERN = /(?:^|[|_])-?1(?:_|[|]|ans=)/u;

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function countSemanticAnswerOccurrences(text: string, answer: string) {
  if (!answer) {
    return 0;
  }
  const escaped = escapeRegExp(answer);
  const matches = text.match(
    new RegExp(`(?:^|[^0-9.])${escaped}(?=$|[^0-9.%])`, "gu"),
  );
  return matches?.length ?? 0;
}

function resultLines(explanation: string) {
  const lines = explanation.split("\n").map((line) => line.trim());
  const pairs: Array<{ label: string; result: string }> = [];

  for (let index = 0; index < lines.length - 2; index += 1) {
    const labelLine = lines[index]!;
    const resultLine = lines[index + 2]!;

    if (labelLine.endsWith("=") && /^=\s*-?\d+(?:\.\d+)?%/u.test(resultLine)) {
      pairs.push({
        label: labelLine.replace(/\s*=$/u, ""),
        result: resultLine,
      });
    }
  }

  return pairs;
}

function hasFormatterLeak(realization: EditorialRealization) {
  return resultLines(realization.explanation).some(({ label }) => {
    const semantic = semanticValueForLabel(label, 1);
    return semantic.kind !== "percentage";
  });
}

function hasShortcutDuplication(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
) {
  if (!realization.naturalization.shortcutSurfaced) {
    return false;
  }

  const answer = semanticAnswerText(problem);
  const answerRepeats = countSemanticAnswerOccurrences(
    realization.explanation,
    answer,
  );
  return answerRepeats > 4;
}

export function createSemanticStabilityMetrics(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
): SemanticStabilityMetrics {
  const signature = createProblemSignature(problem);
  const formatterLeak = hasFormatterLeak(realization);
  const signLeak = SIGN_LEAKAGE_PATTERN.test(realization.explanation);
  const answerMismatch = !realization.explanation.includes(semanticAnswerText(problem));
  const oldEnding = OLD_ENDING_PATTERN.test(realization.explanation);
  const shortcutDuplication = hasShortcutDuplication(problem, realization);
  const signatureLeak = NEGATIVE_SIGNATURE_PATTERN.test(signature);
  const ambiguousSignature =
    problem.subtype === "profit_loss" &&
    AMBIGUOUS_SIGNATURE_PATTERN.test(signature);

  const formatterSafetyScore = formatterLeak ? 0 : 100;
  const answerConsistencyScore = answerMismatch || signLeak ? 55 : 100;
  const realizationSafetyScore = oldEnding || signLeak ? 70 : 100;
  const shortcutCompressionScore = shortcutDuplication ? 55 : 100;
  const signatureSemanticSafetyScore =
    signatureLeak || ambiguousSignature ? 45 : 100;
  const semanticStabilityScore = Math.round(
    (
      formatterSafetyScore +
      answerConsistencyScore +
      realizationSafetyScore +
      shortcutCompressionScore +
      signatureSemanticSafetyScore
    ) / 5,
  );

  return {
    semanticStabilityScore,
    formatterSafetyScore,
    answerConsistencyScore,
    realizationSafetyScore,
    shortcutCompressionScore,
    signatureSemanticSafetyScore,
  };
}

export function validateSemanticStability(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
): ValidationResult {
  const issues: string[] = [];
  const metrics = createSemanticStabilityMetrics(problem, realization);

  if (hasFormatterLeak(realization)) {
    issues.push("Absolute value is rendered with a percentage sign.");
  }
  if (SIGN_LEAKAGE_PATTERN.test(realization.explanation)) {
    issues.push("Signed computational value leaks into semantic rendering.");
  }
  if (!realization.explanation.includes(semanticAnswerText(problem))) {
    issues.push("Explanation does not include semantic answer text.");
  }
  if (OLD_ENDING_PATTERN.test(realization.explanation)) {
    issues.push("Explanation uses the over-repeated generic ending.");
  }
  if (hasShortcutDuplication(problem, realization)) {
    issues.push("Shortcut explanation repeats the full derivation.");
  }
  const signature = createProblemSignature(problem);
  if (NEGATIVE_SIGNATURE_PATTERN.test(signature)) {
    issues.push("Problem signature contains negative semantic leakage.");
  }
  if (
    problem.subtype === "profit_loss" &&
    AMBIGUOUS_SIGNATURE_PATTERN.test(signature)
  ) {
    issues.push("Problem signature contains ambiguous profit/loss direction.");
  }
  if (metrics.semanticStabilityScore < 90) {
    issues.push(`Semantic stability score is too low: ${metrics.semanticStabilityScore}.`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
