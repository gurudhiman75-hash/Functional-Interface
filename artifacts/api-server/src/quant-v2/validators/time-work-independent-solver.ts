import type { CanonicalTimeWorkProblem } from "../canonical/time-work-types";
import { evaluateTimeWorkSolverModel } from "../canonical/time-work-motif-factories";

export type TimeWorkSolverReport = {
  valid: boolean;
  issues: string[];
  metrics: {
    solverAnswer: string;
    answerText: string;
    explanationFinalAnswer?: string;
  };
};

function clean(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/u, "");
}

function fractionDisplay(value: number) {
  if (!Number.isFinite(value)) return "0";
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  const whole = Math.floor(absolute);
  const decimal = absolute - whole;
  const fractions: Array<[number, number]> = [
    [1, 2],
    [1, 3],
    [2, 3],
    [1, 4],
    [3, 4],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
  ];
  const match = fractions.find(([numerator, denominator]) =>
    Math.abs(decimal - numerator / denominator) < 0.006,
  );
  if (!match) return clean(value);
  const [numerator, denominator] = match;
  if (whole === 0) return `${sign}${numerator}/${denominator}`;
  return `${sign}${whole} ${numerator}/${denominator}`;
}

function money(value: number) {
  return `₹${clean(value)}`;
}

function answerText(value: number | string, unit: CanonicalTimeWorkProblem["answerUnit"]) {
  if (typeof value === "string") return value;
  if (unit === "rupees") return money(value);
  if (unit === "percent") return `${clean(value)}%`;
  if (unit === "days") return `${fractionDisplay(value)} ${value === 1 ? "day" : "days"}`;
  if (unit === "hours") return `${fractionDisplay(value)} ${value === 1 ? "hour" : "hours"}`;
  if (unit === "minutes") return `${fractionDisplay(value)} ${value === 1 ? "minute" : "minutes"}`;
  if (unit === "workers") return `${clean(value)} ${value === 1 ? "worker" : "workers"}`;
  if (unit === "litres") return `${clean(value)} litres`;
  if (unit === "pages") return `${clean(value)} pages`;
  if (unit === "metres") return `${clean(value)} m`;
  if (unit === "units") return `${clean(value)} units`;
  if (unit === "items") return `${clean(value)} items`;
  if (unit === "sheets") return `${clean(value)} answer sheets`;
  if (unit === "work") return `${clean(value)} work units`;
  return clean(value);
}

function normalized(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[₹,\s]/gu, "")
    .trim();
}

function closeText(left: string, right: string) {
  return normalized(left) === normalized(right);
}

function closeNumber(left: unknown, right: unknown) {
  const a = Number(left);
  const b = Number(right);
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 0.01;
}

function numericValueFromText(value: string) {
  const mixed = value.match(/(-?\d+)\s+(\d+)\/(\d+)/u);
  if (mixed) {
    const sign = Number(mixed[1]) < 0 ? -1 : 1;
    return Number(mixed[1]) + sign * Number(mixed[2]) / Number(mixed[3]);
  }
  const fraction = value.match(/(-?\d+)\/(\d+)/u);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  return Number(value.match(/-?\d+(?:\.\d+)?/u)?.[0]);
}

function finalAnswerFromExplanation(explanation?: string) {
  const lines = String(explanation ?? "")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  const finalLine = [...lines].reverse().find((line) => /answer|उत्तर|ਉੱਤਰ/iu.test(line));
  if (finalLine) return finalLine.replace(/^.*?(?:answer|उत्तर|ਉੱਤਰ)\s*[:=]\s*/iu, "").trim();
  return undefined;
}

function malformedMathJax(text: string) {
  const inlineOpen = (text.match(/\\\(/gu) ?? []).length;
  const inlineClose = (text.match(/\\\)/gu) ?? []).length;
  const displayOpen = (text.match(/\\\[/gu) ?? []).length;
  const displayClose = (text.match(/\\\]/gu) ?? []).length;
  return inlineOpen !== inlineClose || displayOpen !== displayClose;
}

function hasBareEquationFragment(text: string) {
  return /(?:^|\n)\s*=\s*-?\d/u.test(text);
}

function arrays(input: unknown) {
  return Array.isArray(input) ? input.map(Number) : [];
}

export function solveTimeWorkIndependently(problem: CanonicalTimeWorkProblem) {
  return answerText(evaluateTimeWorkSolverModel(problem.solverModel), problem.answerUnit);
}

export function timeWorkDegenerateReasons(problem: CanonicalTimeWorkProblem) {
  const issues: string[] = [];
  for (const [key, value] of Object.entries(problem.variables)) {
    if (typeof value === "number" && (!Number.isFinite(value) || Number.isNaN(value))) {
      issues.push(`${key} is not finite`);
    }
  }
  if (!problem.answerText || /\b(?:undefined|null|NaN)\b/u.test(problem.answerText)) {
    issues.push("answer text is invalid");
  }
  if (new Set(problem.options).size !== problem.options.length) {
    issues.push("duplicate options");
  }
  if (!problem.options[problem.correct] || problem.options[problem.correct] !== problem.answerText) {
    issues.push("correct option does not match answer");
  }
  if (typeof problem.answer === "number" && (!Number.isFinite(problem.answer) || problem.answer <= 0)) {
    issues.push("negative or zero answer time/value");
  }
  const inputs = problem.solverModel.inputs;
  if (problem.family.startsWith("pc_")) {
    if (problem.solverModel.kind === "pipe_net_time") {
      const fillRate = arrays(inputs.fillTimes).reduce((sum, time) => sum + 1 / time, 0);
      const emptyRate = arrays(inputs.emptyTimes).reduce((sum, time) => sum + 1 / time, 0);
      if (fillRate <= emptyRate) {
        issues.push("leak sign error: emptying rate is not below filling rate");
      }
    }
  }
  if (problem.solverModel.kind === "linear_remaining_time" || problem.solverModel.kind === "linear_total_time") {
    const total = Number(inputs.totalWork);
    const done = Number(inputs.doneRate) * Number(inputs.doneTime) + Number(inputs.fixedDone);
    if (done >= total) {
      issues.push("impossible remaining work");
    }
  }
  if (problem.solverModel.kind === "cycle_time") {
    const rates = arrays(inputs.rates);
    const durations = arrays(inputs.durations);
    const cycleWork = rates.reduce((sum, rate, index) => sum + rate * (durations[index] ?? 1), 0);
    if (cycleWork <= 0) {
      issues.push("alternating cycle has non-positive cycle gain");
    }
  }
  return issues;
}

export function validateTimeWorkTopology(problem: CanonicalTimeWorkProblem) {
  const issues: string[] = [];
  const stem = `${problem.localizationData.stem.en} ${problem.localizationData.explanation.en}`;
  if (problem.category !== "time_work" || problem.topology.family !== "time_work") {
    issues.push("time-work topology metadata missing");
  }
  const dynamicFamily = /tw_(?:delayed_join|forward_leave|backward_leave|multi_phase_join_leave|partial_completion_then_team|interrupted_work|replacement_worker)|pc_(?:drain_after_partial_fill|multiple_pipes_timing|leak_starts_after_fill|pipe_closed_before_completion)/u.test(problem.family);
  if (dynamicFamily && !/phase|join|joins|after|leave|leaves|replace|replaced|pause|complete|remaining|पहले|बाद|शेष|पूरा|जुड़|छोड़|ਬਾਅਦ|ਬਾਕੀ|ਪੂਰਾ|ਜੁੜ|ਛੱਡ/iu.test(stem)) {
    issues.push("dynamic topology has no phase event");
  }
  if (/alternating|cycle|rest|conditional/u.test(problem.family) && problem.solverModel.kind !== "cycle_time") {
    issues.push("cycle topology does not use cycle solver");
  }
  if (problem.family.startsWith("pc_") && !/pipe|tank|leak|fill|empty|पाइप|टंकी|रिसाव|ਪਾਈਪ|ਟੈਂਕੀ|ਰਿਸਾਅ/iu.test(stem)) {
    issues.push("pipe topology lacks pipe/tank wording");
  }
  const wageFamily = /^tw_(?:wage_|contract_penalty_bonus|work_quality_rejection)/u.test(problem.family);
  if (wageFamily && !/wage|earn|contract|share|reject|accepted|defect|output|₹|मजदूरी|कमाई|ਸਵੀਕਾਰ|ਰੱਦ|ਮਜ਼ਦੂਰੀ|ਕਮਾਈ/iu.test(stem)) {
    issues.push("wage topology lacks wage/contract condition");
  }
  if (/food|resource/u.test(problem.family) && !/food|stock|consume|भोजन|भंडार|ਭੋਜਨ|ਭੰਡਾਰ/iu.test(stem)) {
    issues.push("resource topology lacks resource condition");
  }
  if (/efficiency|equivalence|team_a_vs_team_b/u.test(problem.family) && !/efficien|equivalent|ratio|capacit|men|women|children|दक्षता|क्षमता|समतुल्य|पुरुष|महिला|ਕੁਸ਼ਲਤਾ|ਸਮਰੱਥਾ|ਸਮਕੱਖ|ਆਦਮੀ|ਔਰਤ/iu.test(stem)) {
    issues.push("efficiency topology lacks efficiency/equivalence condition");
  }
  return issues;
}

export function validateTimeWorkIndependentSolver(input: {
  problem: CanonicalTimeWorkProblem;
  explanation?: string;
  options?: readonly string[];
  correct?: number;
}): TimeWorkSolverReport {
  const solverAnswer = solveTimeWorkIndependently(input.problem);
  const issues = [
    ...timeWorkDegenerateReasons(input.problem),
    ...validateTimeWorkTopology(input.problem),
  ];
  if (!closeText(solverAnswer, input.problem.answerText)) {
    issues.push(`answer mismatch: canonical=${input.problem.answerText}, solver=${solverAnswer}`);
  }
  if (typeof input.problem.answer === "number") {
    const solverNumeric = numericValueFromText(String(solverAnswer));
    if (!closeNumber(input.problem.answer, solverNumeric)) {
      issues.push(`numeric answer mismatch: canonical=${input.problem.answer}, solver=${solverAnswer}`);
    }
  }
  const explanationFinalAnswer = finalAnswerFromExplanation(input.explanation);
  if (explanationFinalAnswer && !closeText(explanationFinalAnswer, input.problem.answerText)) {
    issues.push(`explanation final answer mismatch: explanation=${explanationFinalAnswer}, solver=${solverAnswer}`);
  }
  const allExplanation = `${input.problem.localizationData.explanation.en}\n${input.problem.localizationData.explanation.hi}\n${input.problem.localizationData.explanation.pa}`;
  if (malformedMathJax(allExplanation)) {
    issues.push("malformed MathJax delimiters");
  }
  if (hasBareEquationFragment(allExplanation)) {
    issues.push("bare equation fragment in explanation");
  }
  if (!/Shortcut \/ Exam Method/u.test(input.problem.localizationData.explanation.en)) {
    issues.push("missing English shortcut block");
  }
  if (!/शॉर्टकट \/ परीक्षा विधि/u.test(input.problem.localizationData.explanation.hi)) {
    issues.push("missing Hindi shortcut block");
  }
  if (!/ਸ਼ਾਰਟਕਟ \/ ਇਮਤਿਹਾਨੀ ਤਰੀਕਾ/u.test(input.problem.localizationData.explanation.pa)) {
    issues.push("missing Punjabi shortcut block");
  }
  if (input.options) {
    if (!input.options[input.correct ?? 0]) issues.push("answer missing from options");
    if (new Set(input.options).size !== input.options.length) issues.push("duplicate options");
  }
  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      solverAnswer,
      answerText: input.problem.answerText,
      explanationFinalAnswer,
    },
  };
}
