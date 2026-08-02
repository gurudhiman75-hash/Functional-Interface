// @ts-nocheck
import {
  correctAnswerDisplay,
  studentOptionDisplay,
} from "./simple-teacher-voice";
import {
  stripStudentOptionLeaks,
} from "./number-system-generator-contract";

function rawOptions(row): string[] {
  return row.checkpoint === "NUM-CP-003"
    ? row.question.options.map(String)
    : row.question.options.map((option) => String(option.value));
}

function splitMathSegments(value: string): string[] {
  return value.split(/(\$[^$]*\$)/gu);
}

export function wrapMathInProse(value: string): string {
  return splitMathSegments(value).map((segment) => {
    if (/^\$[^$]*\$$/u.test(segment)) return segment;
    return segment
      .replace(/\b(\d[\d,]*)\s*([+\-×÷])\s*(\d[\d,]*)\b/gu,
        (_match, left, operator, right) =>
          `$${left} ${operator === "×" ? "\\times" : operator === "÷" ? "\\div" : operator} ${right}$`)
      .replace(/\b(\d[\d,]*\^\d+)\b/gu,
        (_match, expression) => `$${expression}$`)
      .replace(/\b(\d[\d,]*)\b/gu,
        (_match, number) => `$${number}$`);
  }).join("");
}

function unwrapProseFromMath(value: string): string {
  const trimmed = value.trim();
  if (/^\$[^$]*[A-Za-z][^$]*\$$/u.test(trimmed) && /\s/u.test(trimmed)) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function flattenMathDelimiters(value: string): string {
  let text = value;
  let previous = "";
  while (text !== previous) {
    previous = text;
    text = text
      .replace(/\$\$([\s\S]*?)\$\$/gu, (_match, expression) => {
        const inner = String(expression)
          .trim()
          .replace(/^\$+/u, "")
          .replace(/\$+$/u, "")
          .trim();
        return inner ? `$${inner}$` : "";
      })
      .replace(/\$([^$\n]+)\$\s*(×|÷|\\times|\\div)\s*\$([^$\n]+)\$/gu,
        (_match, left, operator, right) => {
          const latexOperator = operator === "×" || operator === "\\times"
            ? "\\times"
            : "\\div";
          return `$${String(left).trim()} ${latexOperator} ${String(right).trim()}$`;
        })
      .replace(/\$([^$\n]+)\$\s*\$([^$\n]+)\$/gu,
        (_match, left, right) =>
          `$${String(left).trim()} ${String(right).trim()}$`);
  }

  // Display math is not allowed on the Question Studio learner surface. Any
  // residual repeated delimiter is therefore a malformed nested boundary.
  return text.replace(/\${2,}/gu, "$");
}

export function normaliseInlineMath(value: unknown): string {
  const text = String(value ?? "")
    .replace(/\$(\d[\d,]*)\$\s*×\s*\$(\d[\d,]*)\$\s*=\s*\$(\d[\d,]*)\$/gu,
      (_match, left, right, result) => `$${left} \\times ${right} = ${result}$`)
    .replace(/\$(\d[\d,]*)\$\s*÷\s*\$(\d[\d,]*)\$/gu,
      (_match, left, right) => `$${left} \\div ${right}$`);
  return flattenMathDelimiters(text);
}

export function formatStudentValue(value: unknown): string {
  const clean = normaliseInlineMath(stripStudentOptionLeaks(value));
  const proseSafe = unwrapProseFromMath(clean);
  if (/[A-Za-z]{2,}/u.test(proseSafe)) {
    return normaliseInlineMath(wrapMathInProse(proseSafe));
  }
  return normaliseInlineMath(studentOptionDisplay(proseSafe));
}

export function safeOptions(row): string[] {
  return rawOptions(row).map(formatStudentValue);
}

export function safeCorrectAnswer(row) {
  const answer = correctAnswerDisplay(row);
  return Object.freeze({
    label: answer.label,
    value: formatStudentValue(answer.value),
  });
}

export function fixStemGrammar(value: string): string {
  return normaliseInlineMath(wrapMathInProse(value))
    .replace(/Choose the option that co-prime statements about/giu,
      "Which of the following co-prime statements about")
    .replace(/Choose the option that prime numbers divides/giu,
      "Which of the following prime numbers divides")
    .replace(/Choose the option that prime number divides/giu,
      "Which of the following prime numbers divides");
}

export function normaliseTeacherExplanation(teacher) {
  return Object.freeze({
    ...teacher,
    mainRule: teacher.mainRule.map(normaliseInlineMath),
    stepByStepSolution: teacher.stepByStepSolution.map(normaliseInlineMath),
    examSpeedTrick: teacher.examSpeedTrick.map(normaliseInlineMath),
    commonTraps: teacher.commonTraps.map((trap) => Object.freeze({
      ...trap,
      optionValue: formatStudentValue(trap.optionValue),
      message: normaliseInlineMath(trap.message),
    })),
  });
}
