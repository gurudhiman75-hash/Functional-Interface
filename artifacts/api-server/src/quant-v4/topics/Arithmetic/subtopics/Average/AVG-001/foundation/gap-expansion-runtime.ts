import { getAvg001QuestionEntry, renderTemplate } from "./library";
import { add, divide, equals, formatRational, gcd, multiply, rational, subtract } from "./math";
import { validateAvg001QuestionPackage } from "./validator";
import { AVG_001_PACKAGE_ID, type Avg001Language, type Avg001Parameters, type Avg001QuestionPackage, type Rational } from "./types";

function hash(value: string) { let h = 2166136261; for (let i = 0; i < value.length; i += 1) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function prng(seed: string) { let state = hash(seed) || 1; return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; }; }
function pick<T>(items: readonly T[], next: () => number) { return items[Math.floor(next() * items.length)]!; }
function total(count: number, average: number) { return count * average; }
function format(value: Rational, answerType: string) { return answerType === "RATIO" ? `${value.numerator}:${value.denominator}` : formatRational(value, "EXACT_INTEGER"); }

type GapState = Record<string, number | boolean | Rational> & { answer: Rational };
function stateFor(mode: string, seed: string, localIndex: number): GapState {
  const next = prng(`${seed}:${mode}:${localIndex}:gap`);
  if (mode === "findAverageAfterUniformTransformation") {
    const count = pick([8, 10, 12, 15, 20], next);
    const oldAverage = pick([24, 30, 36, 40, 45, 50], next);
    const factor = localIndex % 3 === 0 ? 1 : pick([2, 3, 4], next);
    const change = localIndex % 3 === 1 ? 0 : pick([3, 5, 7, 10], next);
    return { count, oldAverage, factor, change, answer: rational(oldAverage * factor + change) };
  }
  if (mode === "findTermCountFromAverageAndExtreme" || mode === "findCommonDifferenceFromAverageCountAndExtreme") {
    const count = pick([5, 7, 9, 11], next);
    const difference = pick(mode.includes("TermCount") ? [1, 2, 3, 4, 5] : [2, 3, 4, 5, 6], next);
    const average = pick([25, 30, 35, 40, 45], next);
    const greatest = localIndex % 2 === 0;
    const extreme = average + (greatest ? 1 : -1) * difference * ((count - 1) / 2);
    return { count, difference, average, extreme, greatest, answer: rational(mode.includes("TermCount") ? count : difference) };
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
    const pairs = [[30, 50, 40], [35, 55, 45], [40, 70, 52], [45, 75, 60], [50, 80, 65], [30, 60, 48], [40, 60, 48], [50, 70, 62]] as const;
    const [lower, upper, combined] = pairs[localIndex % pairs.length]!;
    const divisor = gcd(upper - combined, combined - lower);
    return { lower, upper, combined, answer: rational((upper - combined) / divisor, (combined - lower) / divisor) };
  }
  if (mode === "findAverageSpeedForUnequalDistances") {
    const rows = [[60,30,120,60],[80,40,240,80],[90,45,180,60],[120,60,240,80],[100,50,200,100],[150,75,150,50]] as const;
    const [distance1, speed1, distance2, speed2] = rows[localIndex % rows.length]!;
    const answer = divide(rational(distance1 + distance2), add(divide(rational(distance1), rational(speed1)), divide(rational(distance2), rational(speed2))));
    return { distance1, speed1, distance2, speed2, answer };
  }
  const rows = [[30,2,60,1],[40,1,70,2],[45,2,75,1],[50,3,80,2],[36,2,72,1],[60,1,90,2]] as const;
  const [speed1, time1, speed2, time2] = rows[localIndex % rows.length]!;
  const answer = divide(rational(speed1 * time1 + speed2 * time2), rational(time1 + time2));
  return { speed1, time1, speed2, time2, answer };
}

function verify(mode: string, s: GapState): Rational {
  const n = (key: string) => Number(s[key]);
  if (mode === "findAverageAfterUniformTransformation") return rational(n("oldAverage") * n("factor") + n("change"));
  if (mode === "findTermCountFromAverageAndExtreme") return rational((2 * Math.abs(n("extreme") - n("average"))) / n("difference") + 1);
  if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return rational((2 * Math.abs(n("extreme") - n("average"))) / (n("count") - 1));
  if (mode === "findOriginalCountFromJoiningMemberShift") return rational((n("memberValue") - n("oldAverage")) / n("shift") - 1);
  if (mode === "findOriginalCountFromLeavingMemberShift") return rational(Math.abs(n("memberValue") - n("oldAverage")) / n("shift") + 1);
  if (mode === "findGroupCountRatioFromCombinedAverage") {
    const divisor = gcd(n("upper") - n("combined"), n("combined") - n("lower"));
    return rational((n("upper") - n("combined")) / divisor, (n("combined") - n("lower")) / divisor);
  }
  if (mode === "findAverageSpeedForUnequalDistances") return divide(rational(n("distance1") + n("distance2")), add(divide(rational(n("distance1")), rational(n("speed1"))), divide(rational(n("distance2")), rational(n("speed2")))));
  return divide(rational(n("speed1") * n("time1") + n("speed2") * n("time2")), rational(n("time1") + n("time2")));
}

function optionSet(answer: Rational, answerType: string, seed: string) {
  const correct = format(answer, answerType);
  const wrong = answerType === "RATIO"
    ? [`${answer.denominator}:${answer.numerator}`, `${answer.numerator + 1}:${answer.denominator}`, `${answer.numerator}:${answer.denominator + 1}`]
    : [String(answer.numerator + 2), String(Math.max(1, answer.numerator - 2)), String(answer.numerator + 4)];
  const unique = [...new Set(wrong)].filter((item) => item !== correct);
  while (unique.length < 3) unique.push(String(answer.numerator + unique.length + 5));
  const correctIndex = hash(`${seed}:options`) % 4;
  unique.splice(correctIndex, 0, correct);
  return { options: unique.slice(0, 4), correctIndex };
}

function explanation(mode: string, s: GapState, answer: string) {
  const n = (key: string) => Number(s[key]);
  if (mode === "findAverageAfterUniformTransformation") return ["The same operation is applied to every observation, so apply it directly to the average.", `$$New average = ${n("oldAverage")} × ${n("factor")} + ${n("change")}$$`, `$$New average = ${answer}$$`, "The number of observations does not change this uniform effect.", `So the new average is ${answer}.`];
  if (mode === "findTermCountFromAverageAndExtreme") return ["In an equally spaced series, the average lies midway between the two extreme terms.", `$$One-side gaps = |${n("extreme")} - ${n("average")}| ÷ ${n("difference")} = ${(n("count") - 1) / 2}$$`, `$$Terms = 2 × ${(n("count") - 1) / 2} + 1 = ${answer}$$`, "The same number of gaps lies on the other side of the average.", `So the number of terms is ${answer}.`];
  if (mode === "findCommonDifferenceFromAverageCountAndExtreme") return ["The extreme term is half the series span away from the average.", `$$One-side gaps = (${n("count")} - 1) ÷ 2 = ${(n("count") - 1) / 2}$$`, `$$Common difference = |${n("extreme")} - ${n("average")}| ÷ ${(n("count") - 1) / 2} = ${answer}$$`, "Equal spacing makes every gap identical.", `So the common difference is ${answer}.`];
  if (mode === "findOriginalCountFromJoiningMemberShift") return ["The joining member raises the average across the enlarged group.", `$$Excess value = ${n("memberValue")} - ${n("oldAverage")} = ${n("memberValue") - n("oldAverage")}$$`, `$$Original count = ${n("memberValue") - n("oldAverage")} ÷ ${n("shift")} - 1 = ${answer}$$`, "Subtract one for the new member's own place.", `So the original group size was ${answer}.`];
  if (mode === "findOriginalCountFromLeavingMemberShift") return ["The average change applies to all members who remain after one member leaves.", `$$Value gap = |${n("memberValue")} - ${n("oldAverage")}| = ${Math.abs(n("memberValue") - n("oldAverage"))}$$`, `$$Original count = ${Math.abs(n("memberValue") - n("oldAverage"))} ÷ ${n("shift")} + 1 = ${answer}$$`, "Add one to include the member who left.", `So the original group size was ${answer}.`];
  if (mode === "findGroupCountRatioFromCombinedAverage") return ["The group-size ratio is inverse to the distances from the combined average.", `$$Upper distance = ${n("upper")} - ${n("combined")} = ${n("upper") - n("combined")}$$`, `$$Lower distance = ${n("combined")} - ${n("lower")} = ${n("combined") - n("lower")}$$`, "Use upper distance : lower distance for lower-average group : upper-average group.", `So the ratio of group sizes is ${answer}.`];
  if (mode === "findAverageSpeedForUnequalDistances") return ["For unequal distances, calculate the time taken on each part.", `$$Total time = ${n("distance1")} ÷ ${n("speed1")} + ${n("distance2")} ÷ ${n("speed2")}$$`, `$$Average speed = (${n("distance1")} + ${n("distance2")}) ÷ Total time = ${answer}$$`, "Total distance divided by total time gives the journey average.", `So the average speed is ${answer} km/h.`];
  return ["For unequal times, weight each speed by the time spent at that speed.", `$$Total distance = ${n("speed1")} × ${n("time1")} + ${n("speed2")} × ${n("time2")}$$`, `$$Average speed = Total distance ÷ (${n("time1")} + ${n("time2")}) = ${answer}$$`, "The longer travel period has greater weight.", `So the average speed is ${answer} km/h.`];
}

export function runAvg001GapExpansionPipeline(input: { questionLanguageId: string; seed: string; language: Avg001Language }): Avg001QuestionPackage {
  if (input.language !== "en") throw new Error(`AVG-001 gap expansion supports English only; received ${input.language}`);
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  const localIndex = Number(entry.qlId.slice(-3)) - 374;
  if (localIndex < 0 || localIndex > 51) throw new Error(`${entry.qlId} is not a gap-expansion QL`);
  const state = stateFor(entry.solveMode, input.seed, localIndex);
  const verified = verify(entry.solveMode, state);
  if (!equals(state.answer, verified)) throw new Error(`${entry.qlId}: exact verification mismatch`);
  const answer = format(state.answer, entry.answerType);
  const n = (key: string) => Number(state[key] ?? 0);
  const renderVariables: Record<string, string | number> = {
    count: n("count"), oldAverage: n("oldAverage"), factor: n("factor") || 1, change: n("change"), average: n("average"),
    extremeLabel: state.greatest ? "greatest" : "least", extremeValue: n("extreme"), commonDifference: n("difference"), memberValue: n("memberValue"),
    averageChange: n("shift"), newAverage: n("newAverage"), unit: entry.unitKind === "years" ? "years" : entry.unitKind === "marks" ? "marks" : entry.unitKind === "runs" ? "runs" : entry.unitKind === "currency" ? "rupees" : "units",
    groupAverage1: n("lower"), groupAverage2: n("upper"), combinedAverage: n("combined"), distance1: n("distance1"), distance2: n("distance2"), speed1: n("speed1"), speed2: n("speed2"), time1: n("time1"), time2: n("time2"),
  };
  const baseAverage = n("average") || n("oldAverage") || n("combined") || 1;
  const parameters: Avg001Parameters = {
    packageId: AVG_001_PACKAGE_ID, canonicalProblemId: entry.cpId, questionLanguageId: entry.qlId, seed: input.seed, language: input.language, difficulty: entry.difficulty, taskKind: entry.taskKind, solveMode: entry.solveMode, answerType: entry.answerType, displayPolicy: entry.displayPolicy, contextDomain: entry.contextDomain, scenarioVariant: entry.scenarioVariant,
    values: { count: n("count") || 1, average: rational(baseAverage), total: rational(total(n("count") || 1, baseAverage)), oldCount: n("count") || undefined, oldAverage: n("oldAverage") ? rational(n("oldAverage")) : undefined, newAverage: n("newAverage") ? rational(n("newAverage")) : undefined, averageChange: n("shift") ? rational(n("shift")) : undefined, addedValue: entry.solveMode.includes("Joining") ? rational(n("memberValue")) : undefined, removedValue: entry.solveMode.includes("Leaving") ? rational(n("memberValue")) : undefined, commonDifference: n("difference") ? rational(n("difference")) : undefined, speed1: n("speed1") ? rational(n("speed1")) : undefined, speed2: n("speed2") ? rational(n("speed2")) : undefined, groupAverages: n("lower") ? [rational(n("lower")), rational(n("upper"))] : undefined, combinedAverage: n("combined") ? rational(n("combined")) : undefined },
    renderVariables,
  };
  const stem = renderTemplate(entry.template, renderVariables);
  const optionResult = optionSet(state.answer, entry.answerType, `${input.seed}:${entry.qlId}`);
  const lines = explanation(entry.solveMode, state, answer);
  const base: Omit<Avg001QuestionPackage, "validation"> = {
    packageId: AVG_001_PACKAGE_ID, archetypeId: AVG_001_PACKAGE_ID, canonicalProblemId: entry.cpId, questionLanguageId: entry.qlId, questionId: `AVG-001:${entry.qlId}:${input.seed}`, seed: input.seed, language: input.language, difficultyBand: entry.difficulty, taskKind: entry.taskKind, solveMode: entry.solveMode, stem, options: optionResult.options, correctIndex: optionResult.correctIndex, answer, parameters,
    solver: { exactAnswer: state.answer, answer, equation: lines.filter((line) => line.includes("$$")).join("; "), workingValues: renderVariables },
    independentVerification: { supported: true, exactAnswer: verified, displayAnswer: format(verified, entry.answerType), method: "independent reverse calculation" },
    reasoningEvidence: { conceptId: `${entry.cpId}:${entry.solveMode}`, givens: renderVariables, equations: lines.filter((line) => line.includes("$$")), intermediateValues: renderVariables, decisiveCalculation: lines[2]!, verification: `Exact verification gives ${answer}.`, finalContext: entry.finalContext },
    explanation: { lines }, maturity: "RUNTIME_PROOF", publiclyPublishable: false, mathematicalFingerprint: `gap|${entry.solveMode}|${Object.values(renderVariables).join("|")}`, traceability: { packageId: AVG_001_PACKAGE_ID, canonicalProblemId: entry.cpId, questionLanguageId: entry.qlId, solveMode: entry.solveMode, expansion: "cp001-cp004-gap" },
  };
  const validation = validateAvg001QuestionPackage(base);
  if (!validation.valid) throw new Error(validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join("\n"));
  return { ...base, validation };
}
