import { getAvg001QuestionEntry, renderTemplate } from "./library";
import { add, divide, equals, formatRational, multiply, rational, subtract, toNumber } from "./math";
import { validateAvg001QuestionPackage } from "./validator";
import { AVG_001_PACKAGE_ID, type Avg001Language, type Avg001Parameters, type Avg001QuestionPackage, type Rational } from "./types";

function hash(value: string) { let h = 2166136261; for (let i = 0; i < value.length; i += 1) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function prng(seed: string) { let state = hash(seed) || 1; return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; }; }
function pick<T>(items: readonly T[], next: () => number) { return items[Math.floor(next() * items.length)]!; }

function unitValue(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) {
  const raw = formatRational(value, entry.displayPolicy);
  switch (entry.unitKind) {
    case "currency": return `₹${raw}`;
    case "marks": return `${raw} marks`;
    case "years": return `${raw} years`;
    case "units": return `${raw} units`;
    case "runs": return `${raw} runs`;
    default: return raw;
  }
}
function plain(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) { return formatRational(value, entry.displayPolicy); }
function totalOf(count: number, average: Rational) { return multiply(rational(count), average); }

function buildState(entry: ReturnType<typeof getAvg001QuestionEntry>, seed: string) {
  const next = prng(`${seed}:${entry.qlId}:cp006`);
  const currency = entry.unitKind === "currency";
  const scale = currency ? 1000 : 1;
  const countPools = entry.difficulty === "Easy"
    ? [[20, 30, 40], [25, 25, 50], [30, 40, 50]]
    : entry.difficulty === "Medium"
      ? [[24, 36, 40], [30, 45, 60], [32, 48, 64]]
      : [[35, 45, 70], [40, 60, 80], [45, 75, 90]];
  const basePools = entry.unitKind === "years"
    ? [24, 28, 32, 36, 40]
    : entry.unitKind === "marks" || entry.unitKind === "runs"
      ? [40, 45, 50, 55, 60]
      : [20, 30, 40, 50, 60];
  const [count1, count2, count3] = pick(countPools, next)!;
  const base = pick(basePools, next) * scale;
  const steps = currency ? [2000, 3000, 4000, 5000] : [2, 3, 4, 5, 6];
  const step = pick(steps, next);
  const averages = [rational(base - step), rational(base + step), rational(base + step * 2)];
  const counts = [count1, count2, count3];
  const totals = counts.map((count, index) => totalOf(count, averages[index]!));
  const overallCount = counts.reduce((sum, count) => sum + count, 0);
  const overallTotal = totals.reduce((sum, total) => add(sum, total), rational(0));
  const overallAverage = divide(overallTotal, rational(overallCount));

  if (entry.solveMode === "findSectionCountFromOverallAverage") {
    const unknownCount = count2;
    const knownCount = count1;
    const knownAverage = averages[0]!;
    const unknownAverage = averages[1]!;
    const combinedTotal = add(totalOf(knownCount, knownAverage), totalOf(unknownCount, unknownAverage));
    const combinedCount = knownCount + unknownCount;
    return { counts: [knownCount, unknownCount], averages: [knownAverage, unknownAverage], totals: [totalOf(knownCount, knownAverage), totalOf(unknownCount, unknownAverage)], overallCount: combinedCount, overallTotal: combinedTotal, overallAverage: divide(combinedTotal, rational(combinedCount)), unknownCount, missingIndex: 1, hierarchyDepth: 1 };
  }

  if (entry.solveMode === "findMissingSubgroupCount") {
    return { counts, averages, totals, overallCount, overallTotal, overallAverage, unknownCount: count3, missingIndex: 2, hierarchyDepth: 2 };
  }

  if (entry.solveMode === "findMissingLowerLevelAverage") {
    return { counts, averages, totals, overallCount, overallTotal, overallAverage, parentCount: overallCount, parentAverage: overallAverage, missingIndex: 2, hierarchyDepth: 2 };
  }

  return { counts, averages, totals, overallCount, overallTotal, overallAverage, missingIndex: 2, hierarchyDepth: entry.solveMode === "findSuperGroupAverageFromSubgroups" || entry.solveMode === "findOverallTotalFromHierarchy" ? 2 : 1 };
}

type State = ReturnType<typeof buildState>;
function exactAnswer(mode: string, s: State) {
  switch (mode) {
    case "findClassAverageFromSectionAverages":
    case "findSuperGroupAverageFromSubgroups": return s.overallAverage;
    case "findMissingSectionAverage":
    case "findMissingLowerLevelAverage": return s.averages[s.missingIndex]!;
    case "findSectionCountFromOverallAverage":
    case "findMissingSubgroupCount": return rational(s.unknownCount!);
    case "findSubgroupTotalFromAverageAndCount": return s.totals[0]!;
    case "findOverallTotalFromHierarchy": return s.overallTotal;
    default: throw new Error(`Unsupported CP-006 solve mode: ${mode}`);
  }
}

function independentlyVerify(mode: string, s: State) {
  const knownTotal = s.totals.reduce((sum, total, index) => index === s.missingIndex ? sum : add(sum, total), rational(0));
  switch (mode) {
    case "findClassAverageFromSectionAverages":
    case "findSuperGroupAverageFromSubgroups": return divide(s.totals.reduce((sum, total) => add(sum, total), rational(0)), rational(s.counts.reduce((sum, count) => sum + count, 0)));
    case "findMissingSectionAverage":
    case "findMissingLowerLevelAverage": return divide(subtract(s.overallTotal, knownTotal), rational(s.counts[s.missingIndex]!));
    case "findSectionCountFromOverallAverage": {
      const knownCount = s.counts[0]!;
      const knownAverage = s.averages[0]!;
      const unknownAverage = s.averages[1]!;
      return divide(multiply(rational(knownCount), subtract(s.overallAverage, knownAverage)), subtract(unknownAverage, s.overallAverage));
    }
    case "findMissingSubgroupCount": {
      const knownCount = s.counts[0]! + s.counts[1]!;
      const known = add(s.totals[0]!, s.totals[1]!);
      return divide(subtract(known, multiply(rational(knownCount), s.overallAverage)), subtract(s.overallAverage, s.averages[2]!));
    }
    case "findSubgroupTotalFromAverageAndCount": return multiply(rational(s.counts[0]!), s.averages[0]!);
    case "findOverallTotalFromHierarchy": return s.totals.reduce((sum, total) => add(sum, total), rational(0));
    default: throw new Error(`Unsupported CP-006 verification mode: ${mode}`);
  }
}

function formatAnswer(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) {
  return entry.answerType === "COUNT" ? formatRational(value, "EXACT_INTEGER") : unitValue(value, entry);
}
function optionsFor(answer: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>, seed: string) {
  const numeric = toNumber(answer);
  const step = entry.answerType === "COUNT" ? 5 : entry.unitKind === "currency" ? 1000 : Math.max(1, Math.round(Math.abs(numeric) * 0.05));
  const candidates = [numeric, numeric + step, Math.max(step, numeric - step), numeric + step * 2];
  const values = [...new Set(candidates.map((value) => Math.round(value)))].slice(0, 4);
  while (values.length < 4) values.push(values.at(-1)! + step);
  const answerText = formatAnswer(answer, entry);
  const wrong = values.map((value) => rational(value)).filter((value) => formatAnswer(value, entry) !== answerText).slice(0, 3).map((value) => formatAnswer(value, entry));
  while (wrong.length < 3) wrong.push(formatAnswer(rational(Math.round(numeric + step * (wrong.length + 3))), entry));
  const correctIndex = hash(`${seed}:${entry.qlId}:options`) % 4;
  wrong.splice(correctIndex, 0, answerText);
  return { options: wrong, correctIndex };
}

function conclusion(mode: string, answer: string) {
  switch (mode) {
    case "findClassAverageFromSectionAverages":
    case "findSuperGroupAverageFromSubgroups": return `So the combined average is ${answer}.`;
    case "findMissingSectionAverage":
    case "findMissingLowerLevelAverage": return `So the missing average is ${answer}.`;
    case "findSectionCountFromOverallAverage":
    case "findMissingSubgroupCount": return `So the missing count is ${answer}.`;
    case "findSubgroupTotalFromAverageAndCount": return `So the subgroup total is ${answer}.`;
    case "findOverallTotalFromHierarchy": return `So the overall total is ${answer}.`;
    default: return `So the answer is ${answer}.`;
  }
}

function explanation(entry: ReturnType<typeof getAvg001QuestionEntry>, s: State, answer: string) {
  const c = s.counts;
  const a = s.averages.map((value) => plain(value, entry));
  const t = s.totals.map((value) => plain(value, entry));
  const overall = plain(s.overallAverage, entry);
  const overallTotal = plain(s.overallTotal, entry);
  const finalLine = conclusion(entry.solveMode, answer);
  switch (entry.solveMode) {
    case "findClassAverageFromSectionAverages":
    case "findSuperGroupAverageFromSubgroups": return [
      `First find the total for each group because the group sizes are different.`,
      `$$Group totals = ${c[0]} × ${a[0]} = ${t[0]},\; ${c[1]} × ${a[1]} = ${t[1]},\; ${c[2]} × ${a[2]} = ${t[2]}$$`,
      `$$Combined total = ${t[0]} + ${t[1]} + ${t[2]} = ${overallTotal}$$`,
      `$$Combined average = ${overallTotal} ÷ ${s.overallCount} = ${overall}$$`,
      finalLine,
    ];
    case "findMissingSectionAverage":
    case "findMissingLowerLevelAverage": {
      const known = plain(add(s.totals[0]!, s.totals[1]!), entry);
      return [
        `Use the overall average to find the full total, then remove the two known group totals.`,
        `$$Full total = ${s.overallCount} × ${overall} = ${overallTotal}$$`,
        `$$Known total = ${c[0]} × ${a[0]} + ${c[1]} × ${a[1]} = ${known}$$`,
        `$$Missing average = (${overallTotal} - ${known}) ÷ ${c[2]} = ${a[2]}$$`,
        finalLine,
      ];
    }
    case "findSectionCountFromOverallAverage": {
      const gap1 = plain(subtract(s.overallAverage, s.averages[0]!), entry);
      const gap2 = plain(subtract(s.averages[1]!, s.overallAverage), entry);
      return [
        `The lower-average group and higher-average group balance around the combined average.`,
        `$$Difference from combined average = ${overall} - ${a[0]} = ${gap1}$$`,
        `$$Difference on the other side = ${a[1]} - ${overall} = ${gap2}$$`,
        `$$Missing count = ${c[0]} × ${gap1} ÷ ${gap2} = ${c[1]}$$`,
        finalLine,
      ];
    }
    case "findMissingSubgroupCount": {
      const known = plain(add(s.totals[0]!, s.totals[1]!), entry);
      const knownCount = c[0]! + c[1]!;
      return [
        `Write the overall total in terms of the unknown group count.`,
        `$$Known total = ${c[0]} × ${a[0]} + ${c[1]} × ${a[1]} = ${known}$$`,
        `$$${known} + ${a[2]} × n = ${overall} × (${knownCount} + n)$$`,
        `$$n = ${c[2]}$$`,
        finalLine,
      ];
    }
    case "findSubgroupTotalFromAverageAndCount": return [
      `A group's total equals its average multiplied by its number of members.`,
      `$$Average = ${a[0]}$$`,
      `$$Count = ${c[0]}$$`,
      `$$Group total = ${a[0]} × ${c[0]} = ${t[0]}$$`,
      finalLine,
    ];
    case "findOverallTotalFromHierarchy": return [
      `Find each lower-group total and then add them.`,
      `$$First two totals = ${c[0]} × ${a[0]} = ${t[0]},\; ${c[1]} × ${a[1]} = ${t[1]}$$`,
      `$$Third total = ${c[2]} × ${a[2]} = ${t[2]}$$`,
      `$$Overall total = ${t[0]} + ${t[1]} + ${t[2]} = ${overallTotal}$$`,
      finalLine,
    ];
    default: throw new Error(`Unsupported CP-006 explanation mode: ${entry.solveMode}`);
  }
}

export function runAvg001Cp006Pipeline(input: { questionLanguageId: string; seed: string; language: Avg001Language }): Avg001QuestionPackage {
  if (input.language !== "en") throw new Error(`AVG-CP-006 supports English only; received ${input.language}`);
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  if (entry.cpId !== "AVG-CP-006") throw new Error(`${entry.qlId} is not a CP-006 question`);
  const state = buildState(entry, input.seed);
  const answerValue = exactAnswer(entry.solveMode, state);
  const verifiedAnswer = independentlyVerify(entry.solveMode, state);
  if (!equals(answerValue, verifiedAnswer)) throw new Error(`${entry.qlId} independent verification mismatch`);
  const answer = formatAnswer(answerValue, entry);
  const renderVariables: Record<string, string | number> = {
    subgroupCount1: state.counts[0]!, subgroupCount2: state.counts[1]!, subgroupCount3: state.counts[2] ?? 0,
    subgroupAverage1: plain(state.averages[0]!, entry), subgroupAverage2: plain(state.averages[1]!, entry), subgroupAverage3: plain(state.averages[2] ?? rational(0), entry),
    overallAverage: plain(state.overallAverage, entry), overallCount: state.overallCount, overallTotal: plain(state.overallTotal, entry),
    parentCount: state.parentCount ?? state.overallCount, parentAverage: plain(state.parentAverage ?? state.overallAverage, entry),
  };
  const total = state.overallTotal;
  const parameters: Avg001Parameters = {
    packageId: AVG_001_PACKAGE_ID, canonicalProblemId: "AVG-CP-006", questionLanguageId: entry.qlId, seed: input.seed, language: input.language,
    difficulty: entry.difficulty, taskKind: entry.taskKind, solveMode: entry.solveMode, answerType: entry.answerType, displayPolicy: entry.displayPolicy,
    contextDomain: entry.contextDomain, scenarioVariant: entry.scenarioVariant,
    values: { count: state.overallCount, average: state.overallAverage, total, subgroupCounts: state.counts, subgroupAverages: state.averages, subgroupTotals: state.totals, parentCount: state.parentCount ?? state.overallCount, parentAverage: state.parentAverage ?? state.overallAverage, parentTotal: state.overallTotal, upperGroupCount: state.overallCount, upperGroupAverage: state.overallAverage, upperGroupTotal: state.overallTotal, overallCount: state.overallCount, overallAverage: state.overallAverage, overallTotal: state.overallTotal, missingSubgroupIndex: state.missingIndex, missingSubgroupCount: state.unknownCount, missingSubgroupAverage: state.averages[state.missingIndex], hierarchyDepth: state.hierarchyDepth as 1 | 2 | 3 },
    renderVariables,
  };
  const stem = renderTemplate(entry.template, renderVariables);
  const { options, correctIndex } = optionsFor(answerValue, entry, input.seed);
  const lines = explanation(entry, state, answer);
  const base: Omit<Avg001QuestionPackage, "validation"> = {
    packageId: AVG_001_PACKAGE_ID, archetypeId: AVG_001_PACKAGE_ID, canonicalProblemId: "AVG-CP-006", questionLanguageId: entry.qlId,
    questionId: `AVG-001:${entry.qlId}:${input.seed}`, seed: input.seed, language: input.language, difficultyBand: entry.difficulty,
    taskKind: entry.taskKind, solveMode: entry.solveMode, stem, options, correctIndex, answer, parameters,
    solver: { exactAnswer: answerValue, answer, equation: "group total = group count × group average; combined average = total ÷ combined count", workingValues: renderVariables },
    independentVerification: { supported: true, exactAnswer: verifiedAnswer, displayAnswer: formatAnswer(verifiedAnswer, entry), method: "independent weighted-total calculation" },
    reasoningEvidence: { conceptId: "AVG-CP-006:hierarchical-weighted-average", givens: renderVariables, equations: ["group total = count × average", "overall average = sum of group totals ÷ sum of group counts"], intermediateValues: { overallTotal: plain(state.overallTotal, entry), overallCount: String(state.overallCount) }, decisiveCalculation: lines[3] ?? lines[2]!, verification: `The lower-group totals add to ${plain(state.overallTotal, entry)}.`, finalContext: entry.finalContext },
    explanation: { lines }, maturity: "RUNTIME_PROOF", publiclyPublishable: false,
    mathematicalFingerprint: `cp006|${entry.solveMode}|${state.counts.join("-")}|${state.averages.map((value) => `${value.numerator}/${value.denominator}`).join("-")}`,
    traceability: { packageId: AVG_001_PACKAGE_ID, canonicalProblemId: "AVG-CP-006", questionLanguageId: entry.qlId, solveMode: entry.solveMode, explanationStrategyId: entry.explanationStrategyId, contextDomain: entry.contextDomain },
  };
  const validation = validateAvg001QuestionPackage(base);
  if (!validation.valid) throw new Error(validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join("\n"));
  return { ...base, validation };
}
