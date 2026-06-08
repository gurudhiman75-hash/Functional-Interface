import targetRemainderLibrary from "./target-remainder.library.json";
import structuralPatternLibrary from "./structural-pattern-library.json";
import difficultyBandsLibrary from "./difficulty-bands.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import type { NsRem001CanonicalProblemId, NsRem001QuestionPackage } from "./types";

export const NS_REM_001_LIBRARY_REGISTRY = {
  targetRemainder: targetRemainderLibrary,
  structuralPatterns: structuralPatternLibrary,
  difficultyBands: difficultyBandsLibrary,
  distributionTargets: distributionTargetsLibrary,
  questionLanguage: questionLanguageLibrary,
  explanation: explanationLibrary,
} as const;

export function validateNsRem001Libraries() {
  const failures: string[] = [];
  const divisors = targetRemainderLibrary.divisors.map((entry) => entry.divisor);
  const expectedDivisors = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 25, 27, 30, 36, 40, 45, 50, 60, 72, 75,
    90, 99, 100,
  ];

  if (JSON.stringify(divisors) !== JSON.stringify(expectedDivisors)) {
    failures.push("Target remainder divisor universe does not match the approved list.");
  }

  for (const entry of targetRemainderLibrary.divisors) {
    if (entry.allowedTargetRemainders.min !== 0 || entry.allowedTargetRemainders.maxInclusive !== entry.divisor - 1) {
      failures.push(`Target remainder range is invalid for divisor ${entry.divisor}.`);
    }
  }

  const patternKeys = new Set<string>();
  for (const pattern of structuralPatternLibrary.patterns) {
    if (patternKeys.has(pattern.patternId)) failures.push(`Duplicate structural pattern ID: ${pattern.patternId}.`);
    patternKeys.add(pattern.patternId);
    if (pattern.missingPosition < 1 || pattern.missingPosition > pattern.length) {
      failures.push(`Invalid missing position for ${pattern.patternId}.`);
    }
  }

  for (const length of [3, 4, 5, 6]) {
    for (let position = 1; position <= length; position += 1) {
      if (!structuralPatternLibrary.patterns.some((pattern) => pattern.length === length && pattern.missingPosition === position)) {
        failures.push(`Missing structural pattern coverage for length ${length}, position ${position}.`);
      }
    }
  }

  const expectedQuestionIds = Array.from({ length: 21 }, (_, index) => `QL-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(questionLanguageLibrary.entries.map((entry) => entry.id)) !== JSON.stringify(expectedQuestionIds)) {
    failures.push("Question language IDs do not match approved QL-001 through QL-021.");
  }

  const expectedExplanationIds = ["ES-001", "ES-002", "ES-003", "ES-004", "ES-005"];
  if (JSON.stringify(explanationLibrary.entries.map((entry) => entry.id)) !== JSON.stringify(expectedExplanationIds)) {
    failures.push("Explanation style IDs do not match approved ES-001 through ES-005.");
  }

  for (const cpId of ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"]) {
    const mapped = questionLanguageLibrary.cpToLanguageMapping[cpId as keyof typeof questionLanguageLibrary.cpToLanguageMapping];
    if (!mapped?.length) failures.push(`Missing question language mapping for ${cpId}.`);
  }

  return { valid: failures.length === 0, failures };
}

export function getApprovedDivisors() {
  return targetRemainderLibrary.divisors.map((entry) => entry.divisor);
}

export function assertTargetRemainderAllowed(divisor: number, targetRemainder: number) {
  const entry = targetRemainderLibrary.divisors.find((item) => item.divisor === divisor);
  if (!entry) throw new Error(`Divisor is not approved for NS-REM-001: ${divisor}`);
  if (targetRemainder < entry.allowedTargetRemainders.min || targetRemainder > entry.allowedTargetRemainders.maxInclusive) {
    throw new Error(`Target remainder ${targetRemainder} is not approved for divisor ${divisor}.`);
  }
  return entry;
}

export function getStructuralPatterns() {
  return structuralPatternLibrary.patterns;
}

export function assertStructuralPatternAllowed(patternId: string) {
  const pattern = structuralPatternLibrary.patterns.find((entry) => entry.patternId === patternId);
  if (!pattern) throw new Error(`Structural pattern is not approved for NS-REM-001: ${patternId}`);
  return pattern;
}

export function validateStructuralInstance(input: { patternId: string; instance: string }) {
  const failures: string[] = [];
  const pattern = structuralPatternLibrary.patterns.find((entry) => entry.patternId === input.patternId);
  if (!pattern) {
    failures.push(`Unknown structural pattern: ${input.patternId}.`);
    return { valid: false, failures };
  }
  if (input.instance.length !== pattern.length) failures.push("Instance length does not match structural pattern length.");
  if ((input.instance.match(/x/g) ?? []).length !== 1) failures.push("Instance must contain exactly one missing digit symbol.");
  if (input.instance.indexOf("x") + 1 !== pattern.missingPosition) failures.push("Instance missing position does not match structural pattern.");
  for (const constraint of pattern.fixedPositionConstraints) {
    if (constraint.operator === "!=" && input.instance[constraint.position - 1] === String(constraint.value)) {
      failures.push(`Instance violates fixed position constraint at position ${constraint.position}.`);
    }
  }
  return { valid: failures.length === 0, failures };
}

export function getDifficultyBand(length: number, divisor: number) {
  if ((length === 3 || length === 4) && divisor >= 2 && divisor <= 10) return "Easy" as const;
  if ((length === 4 || length === 5) && divisor >= 11 && divisor <= 25) return "Medium" as const;
  return "Hard" as const;
}

export function getQuestionLanguageIds(canonicalProblemId: NsRem001CanonicalProblemId) {
  return questionLanguageLibrary.cpToLanguageMapping[canonicalProblemId] ?? [];
}

export function renderQuestionLanguage(input: {
  canonicalProblemId: NsRem001CanonicalProblemId;
  questionLanguageId: string;
  numberExpression: string;
  divisor: number;
  targetRemainder: number;
}) {
  const allowed = getQuestionLanguageIds(input.canonicalProblemId);
  if (!allowed.includes(input.questionLanguageId)) {
    throw new Error(`Question language ID ${input.questionLanguageId} is not approved for ${input.canonicalProblemId}.`);
  }
  const entry = questionLanguageLibrary.entries.find((item) => item.id === input.questionLanguageId);
  if (!entry) throw new Error(`Question language entry is missing: ${input.questionLanguageId}`);
  return entry.text
    .replaceAll("{number}", input.numberExpression)
    .replaceAll("{remainder}", String(input.targetRemainder))
    .replaceAll("{divisor}", String(input.divisor));
}

export function isRenderedQuestionLanguage(input: {
  canonicalProblemId: NsRem001CanonicalProblemId;
  questionLanguageId: string;
  stem: string;
  numberExpression: string;
  divisor: number;
  targetRemainder: number;
}) {
  return (
    renderQuestionLanguage({
      canonicalProblemId: input.canonicalProblemId,
      questionLanguageId: input.questionLanguageId,
      numberExpression: input.numberExpression,
      divisor: input.divisor,
      targetRemainder: input.targetRemainder,
    }) === input.stem
  );
}

export function getExplanationEntries() {
  return explanationLibrary.entries;
}

export function renderExplanationLanguage(input: { styleId: string; validSet: readonly number[]; answer: number; targetRemainder: number }) {
  const entry = explanationLibrary.entries.find((item) => item.id === input.styleId);
  if (!entry) throw new Error(`Explanation style entry is missing: ${input.styleId}`);
  return entry.text
    .replaceAll("{validSet}", input.validSet.join(", "))
    .replaceAll("{answer}", String(input.answer))
    .replaceAll("{remainder}", String(input.targetRemainder))
    .split("\n");
}

export function countBy(values: readonly (number | string)[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

export function auditNsRem001Batch(questionPackages: readonly NsRem001QuestionPackage[], generationFailures = 0) {
  return {
    questionCount: questionPackages.length,
    patternDistribution: countBy(questionPackages.map((item) => item.patternId)),
    divisorDistribution: countBy(questionPackages.map((item) => item.parameters.divisor)),
    targetRemainderDistribution: countBy(questionPackages.map((item) => item.parameters.targetRemainder)),
    difficultyDistribution: countBy(questionPackages.map((item) => item.difficultyBand)),
    questionLanguageDistribution: countBy(questionPackages.map((item) => item.questionLanguageId)),
    explanationDistribution: countBy(questionPackages.map((item) => item.explanationStyleId)),
    generationFailures,
    validationFailures: questionPackages.filter((item) => !item.validation.valid).length,
    traceabilityFailures: questionPackages.filter((item) => !item.questionId || !item.patternId || !item.instanceId).length,
  };
}
