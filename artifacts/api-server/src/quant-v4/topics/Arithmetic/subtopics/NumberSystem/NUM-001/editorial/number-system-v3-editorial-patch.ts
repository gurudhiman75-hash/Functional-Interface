// @ts-nocheck
import {
  cleanText,
  mathNumber,
  studentOptionDisplay,
} from "./simple-teacher-voice-core";
import { stripStudentOptionLeaks } from "./number-system-generator-contract";

function inlineDisplayMath(value: unknown): string {
  return String(value ?? "")
    .replace(/\$\$\s*([\s\S]*?)\s*\$\$/gu, (_match, expression) => `$${String(expression).trim()}$`)
    .replace(
      /\$(\d[\d,]*)\$\s*[×x]\s*\$(\d[\d,]*)\$\s*=\s*\$(\d[\d,]*)\$/gu,
      (_match, left, right, result) => `$${left} \\times ${right} = ${result}$`,
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

function wrapArithmeticOutsideMath(value: string): string {
  return value.split(/(\$[^$]+\$)/gu).map((part) => {
    if (/^\$[^$]+\$$/u.test(part)) return part;
    return part.replace(/\b(\d[\d,]*)\s*([+\-])\s*(\d[\d,]*)\b/gu,
      (_match, left, operator, right) => `$${left} ${operator} ${right}$`);
  }).join("");
}

export function patchNumberSystemV3Text(value: unknown): string {
  const grammarFixed = inlineDisplayMath(cleanText(value))
    .replace(
      /Choose the option that co-prime statements about ([^?]+) is correct\?/giu,
      "Which of the following co-prime statements about $1 is correct?",
    )
    .replace(
      /Choose the option that prime numbers divides ([^?]+) exactly\?/giu,
      "Which of the following prime numbers divides $1 exactly?",
    )
    .replace(
      /Choose the option that prime number divides ([^?]+) exactly\?/giu,
      "Which of the following prime numbers divides $1 exactly?",
    );
  return wrapArithmeticOutsideMath(grammarFixed).replace(/\s{2,}/g, " ").trim();
}

function unwrapWholeProseMath(value: string): string {
  const trimmed = value.trim();
  if (!/^\$[^$]+\$$/u.test(trimmed)) return trimmed;
  const body = trimmed.slice(1, -1);
  return /[A-Za-z]{2,}\s+[A-Za-z]{2,}/u.test(body) ? body : trimmed;
}

function proseMath(value: string): string {
  return value
    .split(/(\$[^$]+\$)/gu)
    .map((part) => {
      if (/^\$[^$]+\$$/u.test(part)) return part;
      return part
        .replace(/\b(\d[\d,]*)\^(\d+)\b/gu, (_match, base, exponent) => `$${base}^{${exponent}}$`)
        .split(/(\$[^$]+\$)/gu)
        .map((piece) => {
          if (/^\$[^$]+\$$/u.test(piece)) return piece;
          return piece.replace(/\b(\d[\d,]*)\b/gu, (match) => mathNumber(match.replaceAll(",", "")));
        })
        .join("");
    })
    .join("")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function renderNumberSystemV3Option(value: unknown): string {
  const clean = unwrapWholeProseMath(stripStudentOptionLeaks(value));
  const looksLikeProse = /[A-Za-z]{2,}\s+[A-Za-z]{2,}/u.test(clean);
  if (looksLikeProse) return proseMath(clean);
  return studentOptionDisplay(clean);
}

export function patchNumberSystemV3Teacher(teacher: any): any {
  return Object.freeze({
    ...teacher,
    mainRule: teacher.mainRule.map(patchNumberSystemV3Text),
    stepByStepSolution: teacher.stepByStepSolution.map(patchNumberSystemV3Text),
    examSpeedTrick: teacher.examSpeedTrick.map(patchNumberSystemV3Text),
    commonTraps: teacher.commonTraps.map((trap) => Object.freeze({
      ...trap,
      optionValue: renderNumberSystemV3Option(trap.optionValue),
      message: patchNumberSystemV3Text(trap.message),
    })),
  });
}
