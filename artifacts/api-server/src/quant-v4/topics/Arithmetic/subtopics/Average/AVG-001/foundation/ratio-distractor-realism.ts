import { gcd, rational } from "./math";
import type { Avg001QuestionPackage } from "./types";

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function numericVariable(pkg: Avg001QuestionPackage, key: string) {
  const value = pkg.parameters.renderVariables[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  throw new Error(`${pkg.questionLanguageId}: missing numeric ${key}`);
}

function ratioText(numerator: number, denominator: number) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}:${denominator / divisor}`;
}

export function applyAvg001RatioDistractorRealism(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const lower = numericVariable(pkg, "groupAverage1");
  const upper = numericVariable(pkg, "groupAverage2");
  const combined = numericVariable(pkg, "combinedAverage");
  const upperDistance = Math.abs(upper - combined);
  const lowerDistance = Math.abs(combined - lower);

  const candidates = [
    { strategyId: "misconception:inverted-alligation-ratio", rendered: ratioText(lowerDistance, upperDistance) },
    { strategyId: "misconception:used-full-spread-as-first-weight", rendered: ratioText(Math.abs(upper - lower), lowerDistance) },
    { strategyId: "misconception:used-full-spread-as-second-weight", rendered: ratioText(upperDistance, Math.abs(upper - lower)) },
    { strategyId: "misconception:used-group-averages-as-count-ratio", rendered: ratioText(Math.abs(lower), Math.abs(upper)) },
    { strategyId: "misconception:added-alligation-distances", rendered: ratioText(upperDistance + lowerDistance, lowerDistance) },
  ];

  const selected: Array<{ strategyId: string; rendered: string }> = [];
  for (const candidate of candidates) {
    if (candidate.rendered === pkg.answer || selected.some((item) => item.rendered === candidate.rendered)) continue;
    selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) {
    throw new Error(`${pkg.questionLanguageId}: unable to build three alligation misconception distractors`);
  }

  const correctIndex = hash(`${pkg.seed}:${pkg.questionLanguageId}:alligation-options-v1`) % 4;
  const options = selected.map((item) => item.rendered);
  options.splice(correctIndex, 0, pkg.answer);

  return {
    ...pkg,
    options,
    correctIndex,
    validation: {
      ...pkg.validation,
      checks: [
        ...pkg.validation.checks,
        {
          name: "distractor-realism",
          passed: true,
          message: "All three wrong options come from alligation misconception strategies",
        },
      ],
    },
    traceability: {
      ...pkg.traceability,
      distractorPolicy: "MISCONCEPTION_V1",
      distractorStrategyIds: selected.map((item) => item.strategyId),
    },
  };
}
