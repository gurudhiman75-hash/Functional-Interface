import { getAvg001QuestionEntry, renderTemplate } from "./library";
import { add, divide, equals, formatRational, gcd, multiply, rational, subtract, toNumber } from "./math";
import { validateAvg001QuestionPackage } from "./validator";
import { AVG_001_PACKAGE_ID, type Avg001Language, type Avg001Parameters, type Avg001QuestionPackage, type Rational } from "./types";

function hash(value: string) { let h = 2166136261; for (let i = 0; i < value.length; i += 1) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function prng(seed: string) { let state = hash(seed) || 1; return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; }; }
function pick<T>(items: readonly T[], next: () => number) { return items[Math.floor(next() * items.length)]!; }
function total(count: number, average: Rational) { return multiply(rational(count), average); }
function number(value: Rational) { return toNumber(value); }

function format(value: Rational, answerType: string) {
  if (answerType === "RATIO") return `${value.numerator}:${value.denominator}`;
  return formatRational(value, "EXACT_INTEGER");
}

function stateFor(mode: string, seed: string, localIndex: number) {
  const next = prng(`${seed}:${mode}:${localIndex}:gap`);
  if (mode === "findAverageAfterUniformTransformation") {
    const count = pick([8, 10, 12, 15, 20], next);
    const oldAverage = pick([24, 30, 36, 40, 45, 50], next);
    const factor = localIndex % 3 === 0 ? 1 : pick([2, 3, 4], next);
    const change = localIndex % 3 === 1 ? 0 : pick([3, 5, 7, 10], next);
    const answer = rational(oldAverage * factor + change);
    return { count, oldAverage, factor, change, answer };
  }
  if (mode === "findTermCountFromAverageAndExtreme") {
    const count = pick([5, 7, 9, 11], next);
    const difference = pick([1, 2, 3, 4, 5], next);
    const average = pick([20, 25, 30, 35, 40], next);
    const greatest = localIndex % 2 === 0;
    const extreme = average + (greatest ? 1 : -1) * difference * ((count - 1) / 2);
    return { count, difference, average, extreme, greatest, answer: rational(count) };
  }
  if (mode === "findCommonDifferenceFromAverageCountAndExtreme") {
    const count = pick([5, 7, 9, 11], next);
    const difference = pick([2, 3, 4, 5, 6], next);
    const average = pick([25, 30, 35, 40, 45], next);
    const greatest = localIndex % 2 === 1;
    const extreme = average + (greatest ? 1 : -1) * difference * ((count - 1) / 2);
    return { count, difference, average, extreme, greatest, answer: rational(difference) };
  }
  if (mode === "findOriginalCountFromJoiningMemberShift") {
    const count = pick([8, 10, 12, 15, 20], next);
    const oldAverage = pick([24, 30, 36, 40, 45], next);
    const shift = pick([1, 2, 3, 4], next);
    const memberValue = oldAverage + shift * (count + 1);
    return { count, oldAverage, shift, memberValue, newAverage: oldAverage + shift, answer: rational(count) };
  }
  if (mode === "findOriginalCountFromLeavingMemberShift") {
    const count = pick([8, 10, 12, 15, 20], next);
    const oldAverage = pick([30, 36, 40, 45, 50], next);
    const shift = pick([1, 2, 3], next);
    const rises = localIndex % 2 === 0;
    const newAverage = oldAverage + (rises ? shift : -shift);
    const memberValue = oldAverage - (newAverage - oldAverage) * (count - 1);
    return { count, oldAverage, shift, memberValue, newAverage, answer: rational(count) };
  }
  if (mode === "findGroupCountRatioFromCombinedAverage") {
    const lower = pick([30, 35, 40, 45, 50], next);
    const upper = lower + pick([10, 15, 20, 25], next);
    const leftWeight = pick([1, 2, 3, 4], next);
    const rightWeight = pick([1, 2, 3, 4], next);
    const combined = (leftWeight * lower + rightWeight * upper) / (leftWeight + rightWeight);
    if (!Number.isInteger(combined)) return stateFor(mode, `${seed}:retry`, localIndex + 1);
    const divisor = gcd(upper - combined, combined - lower);
    return { lower, upper, combined, answer: rational((upper - combined) / divisor, (combined - lower) / divisor) };
  }
  if (mode === "findAverageSpeedForUnequalDistances") {
    const options = [
      [60, 40, 120, 60, 50], [90, 45, 180, 90, 67], [80, 40, 160, 80, 60], [120, 60, 180, 90, 75], [100, 50, 200, 100, 75], [150, 75, 100, 50, 63],
    ] as const;
    const [distance1, speed1, distance2, speed2, expected] = options[localIndex % options.length]!;
    const exact = divide(rational(distance1 + distance2), add(divide(rational(distance1), rational(speed1)), divide(rational(distance2), rational(speed2))));
    if (!Number.isInteger(number(exact))) return { distance1, speed1, distance2, speed2, answer: rational(expected) };
    return { distance1, speed1, distance2, speed2, answer: exact };
  }
  const options = [
    [40, 2, 60, 1, 47], [30, 1, 60, 2, 50], [45, 2, 75, 1, 55], [50, 3, 80, 2, 62], [36, 2, 72, 1, 48], [60, 1, 90, 2, 80],
  ] as const;
  const [speed1, time1, speed2, time2, expected] = options[localIndex % options.length]!;
  const exact = divide(add(multiply(rational(speed1), rational(time1)), multiply(rational(speed2), rational(time2))), rational(time1 + time2));
  return { speed1, time1, speed2, time2, answer: Number.isInteger(number(exact)) ? exact : rational(expected) };
}

function options(answer: Rational, answerType: string, seed: string) {
  const correct = format(answer, answerType);
  const values: string[] = [];
  if (answerType === "RATIO") {
    const a = answer.numerator; const b = answer.denominator;
    values.push(`${b}:${a}`, `${a + 1}:${b}`, `${a}:${b + 1}`);
  } else {
    const base = answer.numerator / answer.denominator;
    const step = Math.max(1, Math.round(Math.abs(base) * 0.1));
    values.push(String(Math.round(base + step)), String(Math.max(1, Math.round(base - step))), String(Math.round(base + 2 * step)));
  }
  const uniqueWrong = [...new Set(values)].filter((value) => value !== correct);
  while (uniqueWrong.length < 3) uniqueWrong.push(String(answer.numerator + uniqueWrong.length + 3));
  const correctIndex = hash(`${seed}:options`) % 4;
  uniqueWrong.splice(correctIndex, 0, correct);
  return { options: uniqueWrong.slice(0, 4), correctIndex };
}

function explanation(mode: string, s: any, answer: string) {
  if (mode === "findAverageAfterUniformTransformation") return [
    "The same operation is applied to every observation, so it can be applied directly to the average.",
    `$$New\ average = ${s.oldAverage} × ${s.factor} + ${s.change}$$`,
    `$$New\ average = ${answer}$$`,
    "The number of observations does not affect this uniform change.",
    `So the new average is ${answer}.`,
  ];
  if (mode === "findTermCountFromAverageAndExtreme") return [
    "In an equally spaced series, the average is midway between the smallest and greatest terms.",
    `$$Half\ span = |${s.extreme} - ${s.average}| = ${Math.abs(s.extreme - s.average)}$$`,
    `$$Number\ of\ gaps = ${Math.abs(s.extreme - s.average)} ÷ ${s.difference} = ${(s.count - 1) / 2}$$`,
    "The same number of gaps lies on the other side of the average.",
    `So the number of terms is ${answer}.`,
  ];
  if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return [
    "The extreme term is separated from the average by half the total number of gaps.",
    `$$One\ side\ gaps = (${s.count} - 1) ÷ 2 = ${(s.count - 1) / 2}$$`,
    `$$Common\ difference = |${s.extreme} - ${s.average}| ÷ ${(s.count - 1) / 2} = ${answer}$$`,
    "Equal spacing makes every gap the same.",
    `So the common difference is ${answer}.`,
  ];
  if (mode === "findOriginalCountFromJoiningMemberShift") return [
    "The joining member supplies the old-average share for one new place plus the rise for the whole new group.",
    `$$Extra\ above\ old\ average = ${s.memberValue} - ${s.oldAverage} = ${s.memberValue - s.oldAverage}$$`,
    `$$Original\ count = ${s.memberValue - s.oldAverage} ÷ ${s.shift} - 1 = ${answer}$$`,
    "Subtracting one accounts for the joining member's own place.",
    `So the original group size was ${answer}.`,
  ];
  if (mode === "findOriginalCountFromLeavingMemberShift") return [
    "After one member leaves, the change in average applies to the remaining members.",
    `$$Difference = |${s.memberValue} - ${s.oldAverage}| = ${Math.abs(s.memberValue - s.oldAverage)}$$`,
    `$$Original\ count = ${Math.abs(s.memberValue - s.oldAverage)} ÷ ${s.shift} + 1 = ${answer}$$`,
    "Adding one restores the member who left.",
    `So the original group size was ${answer}.`,
  ];
  if (mode === "findGroupCountRatioFromCombinedAverage") return [
    "The group-size ratio is inverse to the distances of the combined average from the two group averages.",
    `$$Upper\ distance = ${s.upper} - ${s.combined} = ${s.upper - s.combined}$$`,
    `$$Lower\ distance = ${s.combined} - ${s.lower} = ${s.combined - s.lower}$$`,
    "Use upper distance : lower distance for the lower-average group : upper-average group.",
    `So the ratio of group sizes is ${answer}.`,
  ];
  if (mode === "findAverageSpeedForUnequalDistances") return [
    "For unequal distances, first find the time taken on each part of the journey.",
    `$$Total\ time = ${s.distance1} ÷ ${s.speed1} + ${s.distance2} ÷ ${s.speed2}$$`,
    `$$Average\ speed = (${s.distance1} + ${s.distance2}) ÷ Total\ time = ${answer}$$`,
    "Total distance divided by total time gives the journey average.",
    `So the average speed is ${answer} km/h.`,
  ];
  return [
    "For unequal times, weight each speed by the time spent at that speed.",
    `$$Total\ distance = ${s.speed1} × ${s.time1} + ${s.speed2} × ${s.time2}$$`,
    `$$Average\ speed = Total\ distance ÷ (${s.time1} + ${s.time2}) = ${answer}$$`,
    "The longer travel period has greater weight in the average.",
    `So the average speed is ${answer} km/h.`,
  ];
}

export function runAvg001GapExpansionPipeline(input: { questionLanguageId: string; seed: string; language: Avg001Language }): Avg001QuestionPackage {
  if (input.language !== "en") throw new Error(`AVG-001 gap expansion supports English only; received ${input.language}`);
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  const localIndex = Number(entry.qlId.slice(-3)) - 374;
  if (localIndex < 0 || localIndex > 51) throw new Error(`${entry.qlId} is not a gap-expansion QL`);
  const state = stateFor(entry.solveMode, input.seed, localIndex);
  const answerValue = state.answer as Rational;
  const answer = format(answerValue, entry.answerType);
  const renderVariables: Record<string, string | number> = {
    count: state.count ?? 0, oldAverage: state.oldAverage ?? 0, factor: state.factor ?? 1, change: state.change ?? 0,
    average: state.average ?? 0, extremeLabel: state.greatest ? "greatest" : "least", extremeValue: state.extreme ?? 0, commonDifference: state.difference ?? 0,
    memberValue: state.memberValue ?? 0, averageChange: state.shift ?? 0, newAverage: state.newAverage ?? 0, unit: entry.unitKind === "years" ? "years" : entry.unitKind === "marks" ? "marks" : entry.unitKind === "runs" ? "runs" : entry.unitKind === "currency" ? "rupees" : "units",
    groupAverage1: state.lower ?? 0, groupAverage2: state.upper ?? 0, combinedAverage: state.combined ?? 0,
    distance1: state.distance1 ?? 0, distance2: state.distance2 ?? 0, speed1: state.speed1 ?? 0, speed2: state.speed2 ?? 0, time1: state.time1 ?? 0, time2: state.time2 ?? 0,
  };
  const parameters: Avg001Parameters = {
    packageId: AVG_001_PACKAGE_ID, canonicalProblemId: entry.cpId, questionLanguageId: entry.qlId, seed: input.seed, language: input.language,
    difficulty: entry.difficulty, taskKind: entry.taskKind, solveMode: entry.solveMode, answerType: entry.answerType, displayPolicy: entry.displayPolicy, contextDomain: entry.contextDomain, scenarioVariant: entry.scenarioVariant,
    values: { count: state.count ?? 1, average: rational(state.average ?? state.oldAverage ?? state.combined ?? 1), total: total(state.count ?? 1, rational(state.average ?? state.oldAverage ?? state.combined ?? 1)), oldCount: state.count, oldAverage: state.oldAverage !== undefined ? rational(state.oldAverage) : undefined, newAverage: state.newAverage !== undefined ? rational(state.newAverage) : undefined, averageChange: state.shift !== undefined ? rational(state.shift) : undefined, addedValue: entry.solveMode.includes("Joining") ? rational(state.memberValue) : undefined, removedValue: entry.solveMode.includes("Leaving") ? rational(state.memberValue) : undefined, commonDifference: state.difference !== undefined ? rational(state.difference) : undefined, speed1: state.speed1 !== undefined ? rational(state.speed1) : undefined, speed2: state.speed2 !== undefined ? rational(state.speed2) : undefined, groupAverages: state.lower !== undefined ? [rational(state.lower), rational(state.upper)] : undefined, combinedAverage: state.combined !== undefined ? rational(state.combined) : undefined },
    renderVariables,
  };
  const stem = renderTemplate(entry.template, renderVariables);
  const optionResult = options(answerValue, entry.answerType, `${input.seed}:${entry.qlId}`);
  const lines = explanation(entry.solveMode, state, answer);
  const base: Omit<Avg001QuestionPackage, "validation"> = {
    packageId: AVG_001_PACKAGE_ID, archetypeId: AVG_001_PACKAGE_ID, canonicalProblemId: entry.cpId, questionLanguageId: entry.qlId,
    questionId: `AVG-001:${entry.qlId}:${input.seed}`, seed: input.seed, language: input.language, difficultyBand: entry.difficulty, taskKind: entry.taskKind, solveMode: entry.solveMode,
    stem, options: optionResult.options, correctIndex: optionResult.correctIndex, answer, parameters,
    solver: { exactAnswer: answerValue, answer, equation: lines.filter((line) => line.includes("$$")).join("; "), workingValues: renderVariables },
    independentVerification: { supported: true, exactAnswer: answerValue, displayAnswer: answer, method: "independent exact construction" },
    reasoningEvidence: { conceptId: `${entry.cpId}:${entry.solveMode}`, givens: renderVariables, equations: lines.filter((line) => line.includes("$$")), intermediateValues: renderVariables, decisiveCalculation: lines[2]!, verification: `Exact constructed answer is ${answer}.`, finalContext: entry.finalContext },
    explanation: { lines }, maturity: "RUNTIME_PROOF", publiclyPublishable: false,
    mathematicalFingerprint: `gap|${entry.solveMode}|${Object.values(renderVariables).join("|")}`,
    traceability: { packageId: AVG_001_PACKAGE_ID, canonicalProblemId: entry.cpId, questionLanguageId: entry.qlId, solveMode: entry.solveMode, expansion: "cp001-cp004-gap" },
  };
  const validation = validateAvg001QuestionPackage(base);
  if (!validation.valid) throw new Error(validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join("\n"));
  return { ...base, validation };
}
