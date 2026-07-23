import { getAvg001QuestionEntry, renderTemplate } from "./library";
import { add, divide, equals, formatRational, multiply, rational, subtract, toNumber } from "./math";
import { validateAvg001QuestionPackage } from "./validator";
import { AVG_001_PACKAGE_ID, type Avg001Language, type Avg001Parameters, type Avg001QuestionPackage, type Rational } from "./types";

function hash(value: string) { let h = 2166136261; for (let i = 0; i < value.length; i += 1) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function prng(seed: string) { let state = hash(seed) || 1; return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; }; }
function pick<T>(items: readonly T[], next: () => number) { return items[Math.floor(next() * items.length)]!; }
function total(count: number, average: Rational) { return multiply(rational(count), average); }

function display(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) {
  const raw = formatRational(value, entry.displayPolicy);
  if (entry.unitKind === "currency") return `₹${raw}`;
  if (entry.unitKind === "marks") return `${raw} marks`;
  if (entry.unitKind === "years") return `${raw} years`;
  if (entry.unitKind === "units") return `${raw} units`;
  if (entry.unitKind === "runs") return `${raw} runs`;
  return raw;
}
function plain(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) { return formatRational(value, entry.displayPolicy); }

function stateFor(entry: ReturnType<typeof getAvg001QuestionEntry>, seed: string) {
  const next = prng(`${seed}:${entry.qlId}:cp006-exact`);
  const scale = entry.unitKind === "currency" ? 1000 : 1;
  const n = pick(entry.difficulty === "Easy" ? [15, 20, 25] : entry.difficulty === "Medium" ? [24, 30, 36] : [40, 45, 50], next);
  const bases = entry.unitKind === "years" ? [28, 32, 36, 40] : entry.unitKind === "marks" || entry.unitKind === "runs" ? [45, 50, 55, 60] : [30, 40, 50, 60];
  const base = pick(bases, next) * scale;
  const step = pick(entry.unitKind === "currency" ? [2000, 3000, 4000] : [2, 4, 6], next);
  const counts = [n, 2 * n, n];
  const averages = [rational(base - step), rational(base), rational(base + step)];
  const totals = counts.map((count, index) => total(count, averages[index]!));
  const overallCount = 4 * n;
  const overallAverage = rational(base);
  const overallTotal = total(overallCount, overallAverage);
  return { counts, averages, totals, overallCount, overallAverage, overallTotal, missingIndex: 2, unknownCount: n, hierarchyDepth: entry.solveMode === "findSuperGroupAverageFromSubgroups" || entry.solveMode === "findOverallTotalFromHierarchy" || entry.solveMode === "findMissingLowerLevelAverage" ? 2 as const : 1 as const };
}
type State = ReturnType<typeof stateFor>;

function answerFor(mode: string, s: State) {
  if (mode === "findClassAverageFromSectionAverages" || mode === "findSuperGroupAverageFromSubgroups") return s.overallAverage;
  if (mode === "findMissingSectionAverage" || mode === "findMissingLowerLevelAverage") return s.averages[2]!;
  if (mode === "findSectionCountFromOverallAverage" || mode === "findMissingSubgroupCount") return rational(s.unknownCount);
  if (mode === "findSubgroupTotalFromAverageAndCount") return s.totals[0]!;
  if (mode === "findOverallTotalFromHierarchy") return s.overallTotal;
  throw new Error(`Unsupported CP-006 solve mode: ${mode}`);
}
function verify(mode: string, s: State) {
  if (mode === "findClassAverageFromSectionAverages" || mode === "findSuperGroupAverageFromSubgroups") return divide(s.totals.reduce((sum, value) => add(sum, value), rational(0)), rational(s.overallCount));
  if (mode === "findMissingSectionAverage" || mode === "findMissingLowerLevelAverage") return divide(subtract(s.overallTotal, add(s.totals[0]!, s.totals[1]!)), rational(s.counts[2]!));
  if (mode === "findSectionCountFromOverallAverage") return divide(multiply(rational(s.counts[0]!), subtract(s.overallAverage, s.averages[0]!)), subtract(s.averages[2]!, s.overallAverage));
  if (mode === "findMissingSubgroupCount") {
    const knownCount = s.counts[0]! + s.counts[1]!;
    const knownTotal = add(s.totals[0]!, s.totals[1]!);
    return divide(subtract(multiply(rational(knownCount), s.overallAverage), knownTotal), subtract(s.averages[2]!, s.overallAverage));
  }
  if (mode === "findSubgroupTotalFromAverageAndCount") return total(s.counts[0]!, s.averages[0]!);
  if (mode === "findOverallTotalFromHierarchy") return s.totals.reduce((sum, value) => add(sum, value), rational(0));
  throw new Error(`Unsupported CP-006 verification mode: ${mode}`);
}

function formatAnswer(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) { return entry.answerType === "COUNT" ? formatRational(value, "EXACT_INTEGER") : display(value, entry); }
function optionsFor(answer: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>, seed: string) {
  const numeric = toNumber(answer);
  const step = entry.answerType === "COUNT" ? 5 : entry.unitKind === "currency" ? 1000 : Math.max(1, Math.round(Math.abs(numeric) * 0.05));
  const values = [numeric, numeric + step, Math.max(step, numeric - step), numeric + 2 * step].map(Math.round);
  const correct = formatAnswer(answer, entry);
  const wrong = [...new Set(values)].map((value) => formatAnswer(rational(value), entry)).filter((value) => value !== correct).slice(0, 3);
  while (wrong.length < 3) wrong.push(formatAnswer(rational(Math.round(numeric + step * (wrong.length + 3))), entry));
  const correctIndex = hash(`${seed}:${entry.qlId}:options`) % 4;
  wrong.splice(correctIndex, 0, correct);
  return { options: wrong, correctIndex };
}

function finalLine(mode: string, answer: string) {
  switch (mode) {
    case "findClassAverageFromSectionAverages":
    case "findSuperGroupAverageFromSubgroups": return `So the combined average is ${answer}.`;
    case "findMissingSectionAverage":
    case "findMissingLowerLevelAverage": return `So the missing average is ${answer}.`;
    case "findSectionCountFromOverallAverage":
    case "findMissingSubgroupCount": return `So the required count is ${answer}.`;
    case "findSubgroupTotalFromAverageAndCount": return `So the group total is ${answer}.`;
    case "findOverallTotalFromHierarchy": return `So the combined total is ${answer}.`;
    default: return `So the answer is ${answer}.`;
  }
}
function explanation(entry: ReturnType<typeof getAvg001QuestionEntry>, s: State, answer: string) {
  const c = s.counts;
  const a = s.averages.map((value) => plain(value, entry));
  const t = s.totals.map((value) => plain(value, entry));
  const oa = plain(s.overallAverage, entry);
  const ot = plain(s.overallTotal, entry);
  const end = finalLine(entry.solveMode, answer);
  if (entry.solveMode === "findClassAverageFromSectionAverages" || entry.solveMode === "findSuperGroupAverageFromSubgroups") return [
    "Find each group total first because the group sizes are different.",
    `$$Group totals = ${c[0]} × ${a[0]} = ${t[0]},\; ${c[1]} × ${a[1]} = ${t[1]},\; ${c[2]} × ${a[2]} = ${t[2]}$$`,
    `$$Combined total = ${t[0]} + ${t[1]} + ${t[2]} = ${ot}$$`,
    `$$Combined average = ${ot} ÷ ${s.overallCount} = ${oa}$$`,
    end,
  ];
  if (entry.solveMode === "findMissingSectionAverage" || entry.solveMode === "findMissingLowerLevelAverage") return [
    "Find the full total, then subtract the totals of the two known groups.",
    `$$Full total = ${s.overallCount} × ${oa} = ${ot}$$`,
    `$$Known total = ${c[0]} × ${a[0]} + ${c[1]} × ${a[1]} = ${plain(add(s.totals[0]!, s.totals[1]!), entry)}$$`,
    `$$Missing average = (${ot} - ${plain(add(s.totals[0]!, s.totals[1]!), entry)}) ÷ ${c[2]} = ${a[2]}$$`,
    end,
  ];
  if (entry.solveMode === "findSectionCountFromOverallAverage") return [
    "The two group averages lie equally far from the combined average.",
    `$$Lower difference = ${oa} - ${a[0]} = ${plain(subtract(s.overallAverage, s.averages[0]!), entry)}$$`,
    `$$Upper difference = ${a[2]} - ${oa} = ${plain(subtract(s.averages[2]!, s.overallAverage), entry)}$$`,
    `$$Required count = ${c[0]} × ${plain(subtract(s.overallAverage, s.averages[0]!), entry)} ÷ ${plain(subtract(s.averages[2]!, s.overallAverage), entry)} = ${c[2]}$$`,
    end,
  ];
  if (entry.solveMode === "findMissingSubgroupCount") return [
    "Use the known group totals and let the missing count be n.",
    `$$Known total = ${c[0]} × ${a[0]} + ${c[1]} × ${a[1]} = ${plain(add(s.totals[0]!, s.totals[1]!), entry)}$$`,
    `$$${plain(add(s.totals[0]!, s.totals[1]!), entry)} + ${a[2]} × n = ${oa} × (${c[0]! + c[1]!} + n)$$`,
    `$$n = ${c[2]}$$`,
    end,
  ];
  if (entry.solveMode === "findSubgroupTotalFromAverageAndCount") return [
    "Multiply the group average by its member count.",
    `$$Average = ${a[0]}$$`,
    `$$Count = ${c[0]}$$`,
    `$$Group total = ${a[0]} × ${c[0]} = ${t[0]}$$`,
    end,
  ];
  if (entry.solveMode === "findOverallTotalFromHierarchy") return [
    "Find the total of each group and add them.",
    `$$First total = ${c[0]} × ${a[0]} = ${t[0]}$$`,
    `$$Other totals = ${c[1]} × ${a[1]} = ${t[1]},\; ${c[2]} × ${a[2]} = ${t[2]}$$`,
    `$$Combined total = ${t[0]} + ${t[1]} + ${t[2]} = ${ot}$$`,
    end,
  ];
  throw new Error(`Unsupported CP-006 explanation mode: ${entry.solveMode}`);
}

export function runAvg001Cp006ExactPipeline(input: { questionLanguageId: string; seed: string; language: Avg001Language }): Avg001QuestionPackage {
  if (input.language !== "en") throw new Error(`AVG-CP-006 supports English only; received ${input.language}`);
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  if (entry.cpId !== "AVG-CP-006") throw new Error(`${entry.qlId} is not a CP-006 question`);
  const state = stateFor(entry, input.seed);
  const answerValue = answerFor(entry.solveMode, state);
  const verified = verify(entry.solveMode, state);
  if (!equals(answerValue, verified)) throw new Error(`${entry.qlId} verification mismatch`);
  const answer = formatAnswer(answerValue, entry);
  const renderVariables: Record<string, string | number> = {
    subgroupCount1: state.counts[0]!, subgroupCount2: state.counts[1]!, subgroupCount3: state.counts[2]!,
    subgroupAverage1: plain(state.averages[0]!, entry), subgroupAverage2: plain(state.averages[1]!, entry), subgroupAverage3: plain(state.averages[2]!, entry),
    overallAverage: plain(state.overallAverage, entry), overallCount: state.overallCount, overallTotal: plain(state.overallTotal, entry),
    parentCount: state.overallCount, parentAverage: plain(state.overallAverage, entry),
  };
  const parameters: Avg001Parameters = {
    packageId: AVG_001_PACKAGE_ID, canonicalProblemId: "AVG-CP-006", questionLanguageId: entry.qlId, seed: input.seed, language: input.language,
    difficulty: entry.difficulty, taskKind: entry.taskKind, solveMode: entry.solveMode, answerType: entry.answerType, displayPolicy: entry.displayPolicy,
    contextDomain: entry.contextDomain, scenarioVariant: entry.scenarioVariant,
    values: { count: state.overallCount, average: state.overallAverage, total: state.overallTotal, subgroupCounts: state.counts, subgroupAverages: state.averages, subgroupTotals: state.totals, parentCount: state.overallCount, parentAverage: state.overallAverage, parentTotal: state.overallTotal, overallCount: state.overallCount, overallAverage: state.overallAverage, overallTotal: state.overallTotal, missingSubgroupIndex: 2, missingSubgroupCount: state.unknownCount, missingSubgroupAverage: state.averages[2], missingSubgroupTotal: state.totals[2], hierarchyDepth: state.hierarchyDepth },
    renderVariables,
  };
  const stem = renderTemplate(entry.template, renderVariables);
  const { options, correctIndex } = optionsFor(answerValue, entry, input.seed);
  const lines = explanation(entry, state, answer);
  const base: Omit<Avg001QuestionPackage, "validation"> = {
    packageId: AVG_001_PACKAGE_ID, archetypeId: AVG_001_PACKAGE_ID, canonicalProblemId: "AVG-CP-006", questionLanguageId: entry.qlId,
    questionId: `AVG-001:${entry.qlId}:${input.seed}`, seed: input.seed, language: input.language, difficultyBand: entry.difficulty,
    taskKind: entry.taskKind, solveMode: entry.solveMode, stem, options, correctIndex, answer, parameters,
    solver: { exactAnswer: answerValue, answer, equation: "group total = count × average; combined average = total ÷ count", workingValues: renderVariables },
    independentVerification: { supported: true, exactAnswer: verified, displayAnswer: formatAnswer(verified, entry), method: "independent weighted-total calculation" },
    reasoningEvidence: { conceptId: "AVG-CP-006:group-totals", givens: renderVariables, equations: ["group total = count × average", "combined average = total ÷ count"], intermediateValues: { overallTotal: plain(state.overallTotal, entry), overallCount: String(state.overallCount) }, decisiveCalculation: lines[3]!, verification: `The group totals add to ${plain(state.overallTotal, entry)}.`, finalContext: entry.finalContext },
    explanation: { lines }, maturity: "RUNTIME_PROOF", publiclyPublishable: false,
    mathematicalFingerprint: `cp006|${entry.solveMode}|${state.counts.join("-")}|${state.averages.map((value) => value.numerator).join("-")}`,
    traceability: { packageId: AVG_001_PACKAGE_ID, canonicalProblemId: "AVG-CP-006", questionLanguageId: entry.qlId, solveMode: entry.solveMode, explanationStrategyId: entry.explanationStrategyId, contextDomain: entry.contextDomain },
  };
  const validation = validateAvg001QuestionPackage(base);
  if (!validation.valid) throw new Error(validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join("\n"));
  return { ...base, validation };
}
