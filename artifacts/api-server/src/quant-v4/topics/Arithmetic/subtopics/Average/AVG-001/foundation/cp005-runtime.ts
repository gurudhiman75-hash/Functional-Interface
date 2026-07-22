import { getAvg001QuestionEntry, renderTemplate } from "./library";
import { add, divide, formatRational, multiply, rational, subtract, toNumber } from "./math";
import { validateAvg001QuestionPackage } from "./validator";
import { AVG_001_PACKAGE_ID, type Avg001Language, type Avg001Parameters, type Avg001QuestionPackage, type Rational } from "./types";

function hash(value: string) { let h = 2166136261; for (let i = 0; i < value.length; i += 1) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function prng(seed: string) { let state = hash(seed) || 1; return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; }; }
function pick<T>(items: readonly T[], next: () => number) { return items[Math.floor(next() * items.length)]!; }
function abs(value: Rational) { return rational(Math.abs(value.numerator), value.denominator); }
function unitValue(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) {
  const raw = formatRational(value, entry.displayPolicy);
  switch (entry.unitKind) { case "currency": return `₹${raw}`; case "kg": return `${raw} kg`; case "years": return `${raw} years`; case "units": return `${raw} units`; case "marks": return `${raw} marks`; case "runs": return `${raw} runs`; default: return raw; }
}
function plain(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) { return formatRational(value, entry.displayPolicy); }

function buildState(entry: ReturnType<typeof getAvg001QuestionEntry>, seed: string) {
  const next = prng(`${seed}:${entry.qlId}:cp005`);
  const decimal = entry.displayPolicy === "EXACT_DECIMAL_1";
  const currency = entry.unitKind === "currency";
  const counts = decimal ? [10,20,30,40,50] : entry.difficulty === "Easy" ? [8,10,12,15,20] : entry.difficulty === "Medium" ? [16,20,24,25,30] : [25,30,36,40,50];
  const count = pick(counts, next);
  const scale = currency ? 1000 : 1;
  const bases = entry.unitKind === "years" ? [24,28,32,36,40] : entry.unitKind === "kg" ? [20,25,30,35,40,45] : entry.unitKind === "marks" || entry.unitKind === "runs" ? [35,40,45,50,55,60,65] : [20,30,40,50,60,70];
  const correctedAverage = rational(pick(bases, next) * scale * (decimal ? 10 : 1) + (decimal ? pick([2,4,5,6,8], next) * scale : 0), decimal ? 10 : 1);
  const averageStep = decimal ? rational(pick([2,4,5,6,8], next), 10) : rational(pick(entry.difficulty === "Hard" ? [2,3,4,5] : [1,2,3], next) * scale);
  const correctionDirection = next() < 0.5 ? "increase" as const : "decrease" as const;
  const signedAverageChange = correctionDirection === "increase" ? averageStep : rational(-averageStep.numerator, averageStep.denominator);
  const netCorrection = multiply(signedAverageChange, rational(count));
  const entryDifference = abs(netCorrection);
  const reportedAverage = subtract(correctedAverage, signedAverageChange);
  const offset = rational(currency ? pick([4,6,8,10,12], next) * 1000 : pick([8,10,12,15,18], next));
  let incorrectValue = add(correctedAverage, offset);
  let correctValue = add(incorrectValue, netCorrection);
  if (toNumber(correctValue) <= 0) { incorrectValue = add(correctedAverage, multiply(offset, rational(3))); correctValue = add(incorrectValue, netCorrection); }
  const firstCorrection = multiply(netCorrection, rational(2));
  const secondCorrection = subtract(netCorrection, firstCorrection);
  const incorrectValue2 = add(correctedAverage, multiply(offset, rational(2)));
  const correctValue1 = add(incorrectValue, firstCorrection);
  const correctValue2 = add(incorrectValue2, secondCorrection);
  return { count, reportedAverage, correctedAverage, incorrectValue, correctValue, entryDifference, averageChange: abs(signedAverageChange), correctionDirection, incorrectValues: [incorrectValue, incorrectValue2], correctValues: [correctValue1, correctValue2], netCorrection };
}

function exactAnswer(mode: string, s: ReturnType<typeof buildState>) {
  switch (mode) { case "findCorrectedAverageFromMistake": return s.correctedAverage; case "findReportedAverageBeforeCorrection": return s.reportedAverage; case "findCorrectValueFromAverageShift": return s.correctValue; case "findIncorrectValueFromCorrection": return s.incorrectValue; case "findEntryDifferenceFromAverageCorrection": return s.entryDifference; case "findAverageChangeFromEntryCorrection": return s.averageChange; case "findNumberOfItemsFromTotalCorrection": return rational(s.count); case "findCorrectedAverageFromMultipleMistakes": return s.correctedAverage; default: throw new Error(`Unsupported CP-005 solve mode: ${mode}`); }
}
function independentlyReconstruct(mode: string, s: ReturnType<typeof buildState>) {
  const count = rational(s.count);
  const averageGap = subtract(s.correctedAverage, s.reportedAverage);
  switch (mode) {
    case "findCorrectedAverageFromMistake": return add(s.reportedAverage, divide(subtract(s.correctValue, s.incorrectValue), count));
    case "findReportedAverageBeforeCorrection": return subtract(s.correctedAverage, divide(subtract(s.correctValue, s.incorrectValue), count));
    case "findCorrectValueFromAverageShift": return add(s.incorrectValue, multiply(averageGap, count));
    case "findIncorrectValueFromCorrection": return subtract(s.correctValue, multiply(averageGap, count));
    case "findEntryDifferenceFromAverageCorrection": return abs(multiply(averageGap, count));
    case "findAverageChangeFromEntryCorrection": return abs(divide(subtract(s.correctValue, s.incorrectValue), count));
    case "findNumberOfItemsFromTotalCorrection": return divide(s.entryDifference, s.averageChange);
    case "findCorrectedAverageFromMultipleMistakes": {
      const net = s.correctValues.reduce((sum, value, index) => add(sum, subtract(value, s.incorrectValues[index]!)), rational(0));
      return add(s.reportedAverage, divide(net, count));
    }
    default: throw new Error(`Unsupported CP-005 verification mode: ${mode}`);
  }
}
function formatAnswer(value: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>) { return entry.answerType === "COUNT" ? formatRational(value, "EXACT_INTEGER") : unitValue(value, entry); }
function optionsFor(answer: Rational, entry: ReturnType<typeof getAvg001QuestionEntry>, seed: string) {
  const numeric = toNumber(answer); const step = entry.answerType === "COUNT" ? 1 : entry.unitKind === "currency" ? 1000 : entry.displayPolicy === "EXACT_DECIMAL_1" ? 0.1 : 1;
  const candidates = [numeric, numeric + step, Math.max(step, numeric - step), numeric + step * 2];
  const unique = [...new Set(candidates.map((value) => Number(value.toFixed(entry.displayPolicy === "EXACT_DECIMAL_1" ? 1 : 0))))];
  while (unique.length < 4) unique.push(unique.at(-1)! + step);
  const values = unique.slice(0,4).map((value) => entry.displayPolicy === "EXACT_DECIMAL_1" ? rational(Math.round(value * 10), 10) : rational(Math.round(value)));
  const answerText = formatAnswer(answer, entry); const wrong = values.filter((value) => formatAnswer(value, entry) !== answerText).slice(0,3);
  while (wrong.length < 3) wrong.push(rational(answer.numerator + (wrong.length + 2) * answer.denominator, answer.denominator));
  const correctIndex = hash(`${seed}:${entry.qlId}:options`) % 4; const rendered = wrong.map((value) => formatAnswer(value, entry)); rendered.splice(correctIndex, 0, answerText); return { options: rendered, correctIndex };
}

function explanation(entry: ReturnType<typeof getAvg001QuestionEntry>, s: ReturnType<typeof buildState>, answer: string) {
  const count = s.count; const reported = unitValue(s.reportedAverage, entry); const corrected = unitValue(s.correctedAverage, entry); const wrong = unitValue(s.incorrectValue, entry);
  const displayedCorrect = entry.solveMode === "findCorrectedAverageFromMultipleMistakes" ? s.correctValues[0]! : s.correctValue;
  const correct = unitValue(displayedCorrect, entry); const delta = unitValue(s.entryDifference, entry); const avgChange = unitValue(s.averageChange, entry); const signWord = s.correctionDirection === "increase" ? "added to" : "subtracted from";
  if (entry.solveMode === "findCorrectedAverageFromMultipleMistakes") {
    const wrong2 = unitValue(s.incorrectValues[1]!, entry); const correct2 = unitValue(s.correctValues[1]!, entry);
    return [`The reported total is ${reported} \\times ${count}.`, `The first entry changes from ${wrong} to ${correct}.`, `The second entry changes from ${wrong2} to ${correct2}.`, `Together the two corrections change the average by ${delta} \\div ${count} = ${avgChange}.`, `Therefore, the correct average is ${answer}.`];
  }
  const strategy = entry.explanationStrategyId;
  if (/total|rebuild/.test(strategy)) return [`The reported total is ${reported} \\times ${count}.`, `Replacing ${wrong} with ${correct} changes the total by ${delta}.`, `That correction is ${signWord} the reported total.`, `Dividing the corrected total by ${count} gives ${corrected}.`, `Therefore, the required answer is ${answer}.`];
  if (/equation|scale|delta|gap|ratio/.test(strategy)) return [`The average changes from ${reported} to ${corrected}.`, `Average change = ${avgChange}.`, `Total correction = ${count} \\times ${avgChange} = ${delta}.`, `Use correct entry − wrong entry = total correction, with the sign set by the direction of change.`, `Therefore, the required answer is ${answer}.`];
  return [`One wrong entry affects the total of all ${count} records.`, `The entry changes from ${wrong} to ${correct}, a correction of ${delta}.`, `Average correction = ${delta} \\div ${count} = ${avgChange}.`, `Apply this correction to ${reported} to obtain ${corrected}.`, `Therefore, the required answer is ${answer}.`];
}

export function runAvg001Cp005Pipeline(input: { questionLanguageId: string; seed: string; language: Avg001Language }): Avg001QuestionPackage {
  if (input.language !== "en") throw new Error(`AVG-CP-005 supports English only; received ${input.language}`);
  const entry = getAvg001QuestionEntry(input.questionLanguageId); if (entry.cpId !== "AVG-CP-005") throw new Error(`${entry.qlId} is not a CP-005 question`);
  const state = buildState(entry, input.seed); const answerValue = exactAnswer(entry.solveMode, state); const verifiedAnswer = independentlyReconstruct(entry.solveMode, state); const answer = formatAnswer(answerValue, entry);
  const firstCorrect = entry.solveMode === "findCorrectedAverageFromMultipleMistakes" ? state.correctValues[0]! : state.correctValue;
  const renderVariables: Record<string, string | number> = { count: state.count, reportedAverage: plain(state.reportedAverage, entry), correctedAverage: plain(state.correctedAverage, entry), incorrectValue: plain(state.incorrectValue, entry), correctValue: plain(firstCorrect, entry), entryDifference: plain(state.entryDifference, entry), averageChange: plain(state.averageChange, entry), incorrectValue2: plain(state.incorrectValues[1]!, entry), correctValue2: plain(state.correctValues[1]!, entry) };
  const total = multiply(state.correctedAverage, rational(state.count));
  const parameters: Avg001Parameters = { packageId: AVG_001_PACKAGE_ID, canonicalProblemId: "AVG-CP-005", questionLanguageId: entry.qlId, seed: input.seed, language: input.language, difficulty: entry.difficulty, taskKind: entry.taskKind, solveMode: entry.solveMode, answerType: entry.answerType, displayPolicy: entry.displayPolicy, contextDomain: entry.contextDomain, scenarioVariant: entry.scenarioVariant, values: { count: state.count, average: state.correctedAverage, total, ...state }, renderVariables };
  const stem = renderTemplate(entry.template, renderVariables); const { options, correctIndex } = optionsFor(answerValue, entry, input.seed); const lines = explanation(entry, state, answer);
  const base: Omit<Avg001QuestionPackage, "validation"> = {
    packageId: AVG_001_PACKAGE_ID, archetypeId: AVG_001_PACKAGE_ID, canonicalProblemId: "AVG-CP-005", questionLanguageId: entry.qlId, questionId: `AVG-001:${entry.qlId}:${input.seed}`, seed: input.seed, language: input.language, difficultyBand: entry.difficulty, taskKind: entry.taskKind, solveMode: entry.solveMode, stem, options, correctIndex, answer, parameters,
    solver: { exactAnswer: answerValue, answer, equation: "corrected average = reported average + (correct value - incorrect value) / count", workingValues: renderVariables },
    independentVerification: { supported: true, exactAnswer: verifiedAnswer, displayAnswer: formatAnswer(verifiedAnswer, entry), method: "independent reverse reconstruction from the correction identity" },
    reasoningEvidence: { conceptId: "AVG-CP-005:delta-correction", givens: renderVariables, equations: ["correct total = reported total - wrong entry + correct entry", "average change = entry correction / count"], intermediateValues: { entryDifference: plain(state.entryDifference, entry), averageChange: plain(state.averageChange, entry) }, decisiveCalculation: `${plain(state.entryDifference, entry)} \\div ${state.count} = ${plain(state.averageChange, entry)}`, verification: `reported total plus net correction equals ${plain(total, entry)}`, finalContext: entry.finalContext },
    explanation: { lines }, maturity: "RUNTIME_PROOF", publiclyPublishable: false, mathematicalFingerprint: `cp005|${entry.solveMode}|${state.count}|${state.reportedAverage.numerator}/${state.reportedAverage.denominator}|${state.netCorrection.numerator}/${state.netCorrection.denominator}`, traceability: { packageId: AVG_001_PACKAGE_ID, canonicalProblemId: "AVG-CP-005", questionLanguageId: entry.qlId, solveMode: entry.solveMode, explanationStrategyId: entry.explanationStrategyId, contextDomain: entry.contextDomain },
  };
  const validation = validateAvg001QuestionPackage(base); if (!validation.valid) throw new Error(validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join("\n")); return { ...base, validation };
}
