import { authorMen001ExplanationLines } from "./natural-explanation-authorship";
import { getFinalMen001NaturalExplanationProfile } from "./natural-explanation-profile-final";
import type { Men001Parameters, Men001SolverResult } from "./types";

const REDUNDANT_NARRATIVE_ENDING = /^(Therefore|Hence|Thus|So|Accordingly|The required|The final|The answer|A square unit|A linear unit|The numerical rate)/i;
const GENERIC_UNIT_LINE = /(square unit is used|linear unit is used|area is two-dimensional|length is one-dimensional|expressed in rupees|reported in revolutions)/i;
const ROBOTIC_PREFIX = /^(Therefore,|Hence,|Thus,|So,|So |Therefore |Hence |Thus )/i;

const SHORT_CASE_BRIDGES: Record<string, string> = {
  "MEN-001-QL-013":
    "The exact √3 form is kept because replacing it with a decimal would only introduce approximation.",
  "MEN-001-QL-014":
    "There is no need to approximate √3, since the question asks for an exact area.",
  "MEN-001-QL-016":
    "This equal division works because all three sides of an equilateral frame are identical.",
  "MEN-001-QL-110":
    "Only the positive square root is relevant, because a physical side length cannot be negative.",
  "MEN-001-QL-332":
    "Dividing the full charge by the covered area gives the cost of one square metre.",
  "MEN-001-QL-333":
    "The total fencing cost is spread over every metre of the boundary.",
};

function isRedundantEnding(line: string) {
  return (!line.includes("=") && REDUNDANT_NARRATIVE_ENDING.test(line)) ||
    GENERIC_UNIT_LINE.test(line);
}

function finishSentence(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function capitalizeFirst(value: string) {
  if (!value) return value;
  return value[0]!.toUpperCase() + value.slice(1);
}

function lowerProseFirst(value: string) {
  if (!value || /^[A-Za-z][A-Za-z0-9_ ]*\s*=/.test(value)) return value;
  return value[0]!.toLowerCase() + value.slice(1);
}

function softenWorkingLine(line: string) {
  let text = line.trim();
  text = text.replace(/^Substitution gives\s*/i, "With the values inserted, ");
  text = text.replace(/^Substitution:\s*/i, "Putting in the given values, ");
  text = text.replace(/^Calculation:\s*/i, "");
  text = text.replace(/^This gives\s+/i, "");
  text = text.replace(/^By Pythagoras,\s*/i, "Pythagoras gives ");
  text = text.replace(/^From (.+?), isolate ([^:]+):\s*/i, "Rearranging $1 gives ");
  text = text.replace(/^Semiperimeter:\s*/i, "The semiperimeter is ");
  text = text.replace(/^Area of a triangle\s*=\s*/i, "For a triangle, A = ");
  text = text.replace(/^Area\s*=\s*/i, "Here, A = ");
  text = text.replace(/^Use\s+/i, "Here, ");
  text = text.replace(/^Full area\s*=\s*/i, "The full circle has area ");
  text = text.replace(/^Semicircle area\s*=\s*/i, "Half of that is ");
  text = text.replace(/^Outer area\s*=\s*/i, "The outer figure has area ");
  text = text.replace(/^Inner area\s*=\s*/i, "The inner figure has area ");
  text = text.replace(/^Path area\s*=\s*/i, "Their difference is ");
  text = text.replace(/^Remaining area\s*=\s*/i, "Subtracting the road area leaves ");
  text = text.replace(ROBOTIC_PREFIX, "");
  return finishSentence(capitalizeFirst(text));
}

function isShortResult(line: string) {
  const plain = line.replace(/^[A-Z][a-z]+,\s*/i, "").trim();
  return plain.length <= 52 && /^[A-Za-z][A-Za-z0-9_ ]*\s*=/.test(plain);
}

function mergeCalculationWithResult(calculation: string, result: string) {
  const left = calculation.replace(/[.]$/, "");
  const right = result
    .replace(/[.]$/, "")
    .replace(/^This gives\s+/i, "")
    .replace(/^which gives\s+/i, "");
  return finishSentence(`${left}, giving ${right}`);
}

function mergeFormulaWithSubstitution(formula: string, substitution: string) {
  const left = formula.replace(/[.]$/, "");
  const right = substitution.replace(/[.]$/, "");
  return finishSentence(`${left}; ${lowerProseFirst(right)}`);
}

function mergeSingleResultPass(lines: readonly string[]) {
  const merged: string[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index]!;
    const next = lines[index + 1];
    if (
      next &&
      isShortResult(next) &&
      current.includes("=") &&
      !/\b(giving|which gives)\b/i.test(current) &&
      current.length + next.length < 205
    ) {
      merged.push(mergeCalculationWithResult(current, next));
      index += 1;
    } else {
      merged.push(current);
    }
  }
  return merged;
}

function compactNaturalWorking(
  lines: readonly string[],
  questionLanguageId: string,
) {
  let working = lines
    .filter((line) => !isRedundantEnding(line))
    .map(softenWorkingLine)
    .filter((line, index, values) => index === 0 || line !== values[index - 1]);

  working = mergeSingleResultPass(working);

  const qlNumber = Number(questionLanguageId.split("-").at(-1) ?? 0);
  if (
    working.length >= 2 &&
    working.length <= 4 &&
    Number.isFinite(qlNumber) &&
    qlNumber % 2 === 0
  ) {
    const first = working[0]!;
    const second = working[1]!;
    const firstHasFormula = first.includes("=") && !/\d/.test(first);
    const secondHasValues = second.includes("=") && /\d/.test(second);
    if (
      firstHasFormula &&
      secondHasValues &&
      !/\b(giving|which gives)\b/i.test(second) &&
      first.length + second.length < 215
    ) {
      working.splice(0, 2, mergeFormulaWithSubstitution(first, second));
    }
  }

  return working;
}

function naturalConclusion(value: string, answer: string) {
  const text = value
    .replace("{answer}", answer)
    .replace(/^\s*(Therefore|Hence|Thus|So),?\s+/i, "")
    .replace(/\s+therefore\s+/i, " ")
    .replace(/\s+hence\s+/i, " ")
    .replace(/\s+thus\s+/i, " ");
  return finishSentence(capitalizeFirst(text.trim()));
}

export function authorFinalMen001ExplanationLines(
  originalLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  const authored = authorMen001ExplanationLines(
    originalLines,
    parameters,
    solver,
  );
  const profile = getFinalMen001NaturalExplanationProfile(
    parameters.questionLanguageId,
  );
  if (!profile) {
    throw new Error(
      `MEN-001 requires a final natural explanation profile for ${parameters.questionLanguageId}.`,
    );
  }

  const opening = finishSentence(profile.opening);
  const working = compactNaturalWorking(
    authored.slice(1, -1),
    parameters.questionLanguageId,
  );
  const bridge = SHORT_CASE_BRIDGES[parameters.questionLanguageId];
  const conclusion = naturalConclusion(profile.conclusion, solver.answer);

  return [
    opening,
    ...(bridge ? [bridge] : []),
    ...working,
    conclusion,
  ];
}
