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

function bounded(value: number) {
  return Math.max(1, Math.min(12, Math.round(value)));
}

export function isAvg001BoundedChildAgeQuestion(pkg: Avg001QuestionPackage) {
  return pkg.parameters.scenarioVariant === "findChildAgeAfterYears";
}

export function applyAvg001BoundedAgeDistractorRealism(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const answer = Number(pkg.answer);
  const yearsElapsed = numericVariable(pkg, "yearsElapsed");
  const averageChange = Math.abs(
    numericVariable(pkg, "newAverage") -
      (numericVariable(pkg, "oldAverage") + yearsElapsed),
  );

  const candidates = [
    {
      strategyId: "misconception:used-years-elapsed-as-child-age",
      value: bounded(yearsElapsed),
    },
    {
      strategyId: "misconception:missed-one-year-of-ageing",
      value: bounded(answer - 1),
    },
    {
      strategyId: "misconception:added-one-extra-year-of-ageing",
      value: bounded(answer + 1),
    },
    {
      strategyId: "misconception:subtracted-elapsed-years-twice",
      value: bounded(answer - yearsElapsed),
    },
    {
      strategyId: "misconception:added-elapsed-years-twice",
      value: bounded(answer + yearsElapsed),
    },
    {
      strategyId: "misconception:used-average-change-as-child-age",
      value: bounded(averageChange),
    },
    {
      strategyId: "misconception:used-new-member-count-as-age",
      value: bounded((pkg.parameters.values.newCount ?? pkg.parameters.values.count) + 1),
    },
  ];

  const selected: Array<{ strategyId: string; rendered: string }> = [];
  for (const candidate of candidates) {
    const rendered = String(candidate.value);
    if (rendered === pkg.answer || selected.some((item) => item.rendered === rendered)) continue;
    selected.push({ strategyId: candidate.strategyId, rendered });
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) {
    throw new Error(`${pkg.questionLanguageId}: unable to build three bounded child-age distractors`);
  }

  const correctIndex = hash(`${pkg.seed}:${pkg.questionLanguageId}:bounded-age-options-v1`) % 4;
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
          message: "Child-age distractors are misconception-based and remain within 1–12 years",
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
