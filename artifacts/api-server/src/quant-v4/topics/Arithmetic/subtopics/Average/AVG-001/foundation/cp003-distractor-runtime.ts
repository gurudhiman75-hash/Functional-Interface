import { runAvg001Cp003Pipeline as runBaseCp003Pipeline } from "./cp003-runtime";
import { toNumber } from "./math";
import type {
  Avg001Language,
  Avg001QuestionPackage,
  Rational,
} from "./types";

function numeric(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    const fraction = normalized.match(/^(-?\d+)\/(\d+)$/);
    if (fraction) {
      const denominator = Number(fraction[2]);
      if (denominator === 0) return undefined;
      return Number(fraction[1]) / denominator;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  if (
    value &&
    typeof value === "object" &&
    "numerator" in value &&
    "denominator" in value
  ) {
    return toNumber(value as Rational);
  }
  return undefined;
}

function optionRange(pkg: Avg001QuestionPackage) {
  const parameters = pkg.parameters;
  const variant = parameters.scenarioVariant;

  if (
    variant === "findChildAgeAfterYears" &&
    parameters.answerType === "MEMBER_VALUE"
  ) {
    // The outer age-hardening layer replaces these authored anchors with four
    // 1–12 year options after it finds a bounded generated answer.
    return { minimum: 0, maximum: 100 };
  }
  if (/newborn|child/i.test(variant) && parameters.answerType === "MEMBER_VALUE") {
    return { minimum: 0, maximum: 18 };
  }
  if (/age|family|teacher|worker|player|retir/i.test(variant)) {
    return { minimum: 0, maximum: 100 };
  }
  if (/salary|sales|price/i.test(variant) || parameters.contextDomain === "Workplace") {
    return { minimum: 0, maximum: 200000 };
  }
  if (parameters.contextDomain === "Classroom") {
    return { minimum: 0, maximum: 100 };
  }
  if (parameters.contextDomain === "Sports") {
    return { minimum: 0, maximum: 500 };
  }
  return { minimum: 0, maximum: 5000 };
}

function misconceptionLinkedCount(pkg: Avg001QuestionPackage) {
  const values = pkg.parameters.values as Record<string, unknown>;
  const answer = numeric(pkg.answer);
  const directAnchors = [
    values.oldAverage,
    values.currentAverage,
    values.newAverage,
    values.addedValue,
    values.removedValue,
    values.oldValue,
    values.newValue,
    values.nextScore,
  ]
    .map(numeric)
    .filter((value): value is number => value !== undefined);

  const nearStep =
    /salary|sales|price/i.test(pkg.parameters.scenarioVariant) ||
    pkg.parameters.contextDomain === "Workplace"
      ? 5000
      : 5;

  return pkg.options
    .filter((option) => option !== pkg.answer)
    .map(numeric)
    .filter((option): option is number => option !== undefined)
    .filter(
      (option) =>
        directAnchors.some((anchor) => option === anchor) ||
        (answer !== undefined && Math.abs(option - answer) <= nearStep),
    ).length;
}

export function runAvg001Cp003Pipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001QuestionPackage {
  const base = runBaseCp003Pipeline(input);
  const range = optionRange(base);
  const misconceptionCount = misconceptionLinkedCount(base);

  const retainedChecks = base.validation.checks.filter(
    (check) =>
      check.name !== "options" &&
      check.name !== "correct" &&
      check.name !== "misconception-options" &&
      check.name !== "context-realistic-options",
  );
  const replacementChecks = [
    {
      name: "options",
      passed: base.options.length === 4 && new Set(base.options).size === 4,
      message: "Four unique authored CP-003 options",
    },
    {
      name: "correct",
      passed: base.options[base.correctIndex] === base.answer,
      message: "Correct index resolves the exact answer",
    },
    {
      name: "misconception-options",
      passed: misconceptionCount >= 2,
      message: `${misconceptionCount} distractors link to old/new values or near-step arithmetic errors`,
    },
    {
      name: "context-realistic-options",
      passed: base.options.every((option) => {
        const value = numeric(option);
        return value !== undefined && value >= range.minimum && value <= range.maximum;
      }),
      message: `Every option stays within ${range.minimum}–${range.maximum} for ${base.questionLanguageId}: ${base.options.join(", ")}`,
    },
  ];
  const checks = [...retainedChecks, ...replacementChecks];
  const validation = {
    valid: checks.every((check) => check.passed),
    checks,
  };

  if (!validation.valid) {
    throw new Error(
      validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join("\n"),
    );
  }

  return {
    ...base,
    validation,
  };
}