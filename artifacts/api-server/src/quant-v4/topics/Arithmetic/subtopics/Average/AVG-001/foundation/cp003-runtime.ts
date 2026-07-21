import { getAvg001QuestionEntry, renderTemplate } from "./library";
import { add, divide, equals, formatRational, multiply, rational, subtract, toNumber } from "./math";
import {
  AVG_001_PACKAGE_ID,
  type Avg001Language,
  type Avg001Parameters,
  type Avg001QuestionPackage,
  type Avg001ReasoningEvidence,
  type Avg001SolverResult,
  type Avg001ValidationCheck,
  type Rational,
} from "./types";

function hash(value: string) {
  let h = 2166136261;
  for (const ch of value) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function prng(seed: string) {
  let state = hash(seed) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pick<T>(items: readonly T[], next: () => number) {
  return items[Math.floor(next() * items.length)]!;
}

function natural(value: Rational) {
  return formatRational(value, "EXACT_INTEGER");
}

function generateCp003Parameters(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001Parameters {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  if (entry.cpId !== "AVG-CP-003") throw new Error(`CP-003 runtime received ${entry.cpId}`);
  if (input.language !== "en") throw new Error(`AVG-001 CP-003 supports English only; received ${input.language}`);

  const next = prng(`${input.seed}:${entry.qlId}:cp003`);
  const n = pick([5, 6, 8, 10, 12], next);
  const base = pick(entry.contextDomain === "Workplace" ? [24000, 28000, 32000, 36000] : entry.contextDomain === "Family" ? [28, 32, 36, 40] : [20, 25, 30, 35, 40, 50, 60], next);
  const shift = pick([2, 3, 4, 5], next);
  const elapsedYears = pick([2, 3, 4], next);
  const oldCount = n;
  const oldAverage = rational(base);
  let newCount = n;
  let newAverage = oldAverage;
  let addedValue: Rational | undefined;
  let removedValue: Rational | undefined;
  let outgoingValue: Rational | undefined;
  let incomingValue: Rational | undefined;
  let targetKind: "newAverage" | "memberValue" = entry.answerType === "AVERAGE" ? "newAverage" : "memberValue";

  if (entry.scenarioVariant === "familyAgeElapsedTime") {
    const agedAverage = add(oldAverage, rational(elapsedYears));
    newCount = n + 1;
    newAverage = subtract(agedAverage, rational(3));
    addedValue = subtract(multiply(newAverage, rational(newCount)), multiply(agedAverage, rational(n)));
  } else if (entry.scenarioVariant === "newbornAfterElapsedYears") {
    const agedAverage = add(oldAverage, rational(elapsedYears));
    newCount = n + 1;
    newAverage = subtract(agedAverage, rational(3));
    addedValue = subtract(multiply(newAverage, rational(newCount)), multiply(agedAverage, rational(n)));
  } else if (entry.scenarioVariant === "memberLeavesAfterYears") {
    const agedAverage = add(oldAverage, rational(elapsedYears));
    newCount = n - 1;
    newAverage = add(agedAverage, rational(shift));
    removedValue = subtract(multiply(agedAverage, rational(n)), multiply(newAverage, rational(newCount)));
  } else if (entry.solveMode === "findNewAverageAfterAddition" || entry.solveMode === "findAddedMemberValueFromShift") {
    newCount = n + 1;
    newAverage = add(oldAverage, rational(shift));
    addedValue = subtract(multiply(newAverage, rational(newCount)), multiply(oldAverage, rational(n)));
  } else if (entry.solveMode === "findNewAverageAfterRemoval" || entry.solveMode === "findRemovedMemberValueFromShift") {
    newCount = n - 1;
    newAverage = add(oldAverage, rational(shift));
    removedValue = subtract(multiply(oldAverage, rational(n)), multiply(newAverage, rational(newCount)));
  } else if (entry.solveMode === "findNewAverageAfterReplacement" || entry.solveMode === "findReplacementValueFromShift") {
    newCount = n;
    newAverage = add(oldAverage, rational(shift));
    outgoingValue = subtract(oldAverage, rational(5));
    incomingValue = add(outgoingValue, multiply(rational(n), rational(shift)));
  } else if (entry.solveMode === "findInningsValueOrNewCricketAverage") {
    newCount = n + 1;
    newAverage = add(oldAverage, rational(shift));
    addedValue = subtract(multiply(newAverage, rational(newCount)), multiply(oldAverage, rational(n)));
    targetKind = entry.scenarioVariant === "cricketNewAverage" ? "newAverage" : "memberValue";
  }

  for (const [name, value] of Object.entries({ addedValue, removedValue, outgoingValue, incomingValue })) {
    if (value && value.numerator <= 0) throw new Error(`Constructed non-positive ${name} for ${entry.qlId}`);
  }

  const oldTotal = multiply(oldAverage, rational(n));
  const newTotal = multiply(newAverage, rational(newCount));
  const renderVariables: Record<string, string | number> = {
    oldCount: n,
    newCount,
    oldAverage: natural(oldAverage),
    newAverage: natural(newAverage),
    oldTotal: natural(oldTotal),
    newTotal: natural(newTotal),
    elapsedYears,
    inningsCount: n,
  };
  if (addedValue) renderVariables.addedValue = natural(addedValue);
  if (removedValue) renderVariables.removedValue = natural(removedValue);
  if (outgoingValue) renderVariables.outgoingValue = natural(outgoingValue);
  if (incomingValue) renderVariables.incomingValue = natural(incomingValue);

  return {
    packageId: AVG_001_PACKAGE_ID,
    canonicalProblemId: "AVG-CP-003",
    questionLanguageId: entry.qlId,
    seed: input.seed,
    language: input.language,
    difficulty: entry.difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    displayPolicy: entry.displayPolicy,
    contextDomain: entry.contextDomain,
    scenarioVariant: entry.scenarioVariant,
    values: {
      count: n,
      average: oldAverage,
      total: oldTotal,
      oldCount: n,
      newCount,
      oldAverage,
      newAverage,
      oldTotal,
      newTotal,
      addedValue,
      removedValue,
      outgoingValue,
      incomingValue,
      elapsedYears,
      inningsCount: n,
      targetKind,
    },
    renderVariables,
  };
}

function solveCp003(parameters: Avg001Parameters): Avg001SolverResult {
  const v = parameters.values;
  const oldCount = v.oldCount!;
  const newCount = v.newCount!;
  const oldAverage = v.oldAverage!;
  const oldTotal = multiply(oldAverage, rational(oldCount));
  let exactAnswer: Rational;
  let equation: string;

  switch (parameters.solveMode) {
    case "findNewAverageAfterAddition": {
      const currentAverage = parameters.scenarioVariant === "familyAgeElapsedTime"
        ? add(oldAverage, rational(v.elapsedYears!))
        : oldAverage;
      exactAnswer = divide(add(multiply(currentAverage, rational(oldCount)), v.addedValue!), rational(newCount));
      equation = `(${natural(currentAverage)}×${oldCount}+${natural(v.addedValue!)})÷${newCount}=${natural(exactAnswer)}`;
      break;
    }
    case "findNewAverageAfterRemoval":
      exactAnswer = divide(subtract(oldTotal, v.removedValue!), rational(newCount));
      equation = `(${natural(oldTotal)}-${natural(v.removedValue!)})÷${newCount}=${natural(exactAnswer)}`;
      break;
    case "findNewAverageAfterReplacement":
      exactAnswer = divide(add(subtract(oldTotal, v.outgoingValue!), v.incomingValue!), rational(oldCount));
      equation = `(${natural(oldTotal)}-${natural(v.outgoingValue!)}+${natural(v.incomingValue!)})÷${oldCount}=${natural(exactAnswer)}`;
      break;
    case "findAddedMemberValueFromShift": {
      const currentAverage = parameters.scenarioVariant === "newbornAfterElapsedYears"
        ? add(oldAverage, rational(v.elapsedYears!))
        : oldAverage;
      exactAnswer = subtract(multiply(v.newAverage!, rational(newCount)), multiply(currentAverage, rational(oldCount)));
      equation = `${natural(v.newAverage!)}×${newCount}-${natural(currentAverage)}×${oldCount}=${natural(exactAnswer)}`;
      break;
    }
    case "findRemovedMemberValueFromShift": {
      const currentAverage = parameters.scenarioVariant === "memberLeavesAfterYears"
        ? add(oldAverage, rational(v.elapsedYears!))
        : oldAverage;
      exactAnswer = subtract(multiply(currentAverage, rational(oldCount)), multiply(v.newAverage!, rational(newCount)));
      equation = `${natural(currentAverage)}×${oldCount}-${natural(v.newAverage!)}×${newCount}=${natural(exactAnswer)}`;
      break;
    }
    case "findReplacementValueFromShift":
      exactAnswer = add(v.outgoingValue!, multiply(subtract(v.newAverage!, oldAverage), rational(oldCount)));
      equation = `${natural(v.outgoingValue!)}+(${natural(v.newAverage!)}-${natural(oldAverage)})×${oldCount}=${natural(exactAnswer)}`;
      break;
    case "findInningsValueOrNewCricketAverage":
      if (v.targetKind === "newAverage") {
        exactAnswer = divide(add(oldTotal, v.addedValue!), rational(newCount));
        equation = `(${natural(oldTotal)}+${natural(v.addedValue!)})÷${newCount}=${natural(exactAnswer)}`;
      } else {
        exactAnswer = subtract(multiply(v.newAverage!, rational(newCount)), oldTotal);
        equation = `${natural(v.newAverage!)}×${newCount}-${natural(oldTotal)}=${natural(exactAnswer)}`;
      }
      break;
    default:
      throw new Error(`Unsupported CP-003 solve mode: ${parameters.solveMode}`);
  }

  return { exactAnswer, answer: natural(exactAnswer), equation, workingValues: { oldCount, newCount } };
}

function verifyCp003(parameters: Avg001Parameters) {
  const v = parameters.values;
  const oldCount = v.oldCount!;
  const newCount = v.newCount!;
  const oldAverageAtChange = parameters.scenarioVariant.includes("Years") || parameters.scenarioVariant.includes("Elapsed")
    ? add(v.oldAverage!, rational(v.elapsedYears ?? 0))
    : v.oldAverage!;
  const oldTotalAtChange = multiply(oldAverageAtChange, rational(oldCount));
  let exactAnswer: Rational;

  switch (parameters.solveMode) {
    case "findNewAverageAfterAddition":
      exactAnswer = divide(add(oldTotalAtChange, v.addedValue!), rational(newCount));
      break;
    case "findNewAverageAfterRemoval":
      exactAnswer = divide(subtract(oldTotalAtChange, v.removedValue!), rational(newCount));
      break;
    case "findNewAverageAfterReplacement":
      exactAnswer = divide(add(subtract(oldTotalAtChange, v.outgoingValue!), v.incomingValue!), rational(newCount));
      break;
    case "findAddedMemberValueFromShift":
      exactAnswer = subtract(multiply(v.newAverage!, rational(newCount)), oldTotalAtChange);
      break;
    case "findRemovedMemberValueFromShift":
      exactAnswer = subtract(oldTotalAtChange, multiply(v.newAverage!, rational(newCount)));
      break;
    case "findReplacementValueFromShift":
      exactAnswer = add(v.outgoingValue!, subtract(multiply(v.newAverage!, rational(newCount)), oldTotalAtChange));
      break;
    case "findInningsValueOrNewCricketAverage":
      exactAnswer = v.targetKind === "newAverage"
        ? divide(add(oldTotalAtChange, v.addedValue!), rational(newCount))
        : subtract(multiply(v.newAverage!, rational(newCount)), oldTotalAtChange);
      break;
    default:
      throw new Error(`Verifier unsupported CP-003 mode: ${parameters.solveMode}`);
  }

  return { supported: true, exactAnswer, displayAnswer: natural(exactAnswer), method: "Independent old-total/new-total reconstruction" };
}

function evidenceCp003(parameters: Avg001Parameters, solver: Avg001SolverResult): Avg001ReasoningEvidence {
  const v = parameters.values;
  return {
    conceptId: `cp003-${parameters.solveMode}`,
    givens: {
      oldCount: v.oldCount!, newCount: v.newCount!, oldAverage: natural(v.oldAverage!),
      newAverage: natural(v.newAverage!), elapsedYears: v.elapsedYears ?? 0,
      addedValue: v.addedValue ? natural(v.addedValue) : "",
      removedValue: v.removedValue ? natural(v.removedValue) : "",
      outgoingValue: v.outgoingValue ? natural(v.outgoingValue) : "",
      incomingValue: v.incomingValue ? natural(v.incomingValue) : "",
    },
    equations: ["Total = Average × Count", "Changed value = New total − Adjusted old total"],
    intermediateValues: { oldTotal: natural(v.oldTotal!), newTotal: natural(v.newTotal!) },
    decisiveCalculation: solver.equation,
    verification: `Independent verifier returns ${solver.answer}`,
    finalContext: getAvg001QuestionEntry(parameters.questionLanguageId).finalContext,
  };
}

function explainCp003(parameters: Avg001Parameters, solver: Avg001SolverResult, evidence: Avg001ReasoningEvidence) {
  const g = evidence.givens;
  const strategy = getAvg001QuestionEntry(parameters.questionLanguageId).explanationStrategyId;
  const ageShift = Number(g.elapsedYears) > 0 ? `After ${g.elapsedYears} years, the original average becomes ${toNumber(parameters.values.oldAverage!) + Number(g.elapsedYears)}.` : "";
  const linesByStrategy: Record<string, string[]> = {
    "addition-rebuild-total": [`The old total is ${g.oldAverage}×${g.oldCount}.`, `Add the new student's ${g.addedValue} marks.`, `Now divide by ${g.newCount} students.`, `$$${solver.equation}$$`, `So the new average is ${solver.answer}.`],
    "addition-age-shift": [ageShift, `The aged family total is spread across ${g.oldCount} members.`, `Add the child's age ${g.addedValue}, then divide by ${g.newCount}.`, `$$${solver.equation}$$`, `The new average age is ${solver.answer} years.`],
    "removal-subtract-total": [`First find the old salary total: ${g.oldAverage}×${g.oldCount}.`, `Subtract the leaving salary ${g.removedValue}.`, `Divide the balance by ${g.newCount}.`, `$$${solver.equation}$$`, `So the new average salary is ₹${solver.answer}.`],
    "removal-balance-change": [`Removing ${g.removedValue} changes both the total and the count.`, `The remaining total is old total minus the removed score.`, `Share it among ${g.newCount} scores.`, `$$${solver.equation}$$`, `Hence, the new average is ${solver.answer}.`],
    "replacement-delta": [`The count stays ${g.oldCount}; only one score changes.`, `Replace ${g.outgoingValue} by ${g.incomingValue}.`, `The total changes by their difference.`, `$$${solver.equation}$$`, `So the new average is ${solver.answer}.`],
    "replacement-total-rebuild": [`Reconstruct the old total from average × count.`, `Remove ${g.outgoingValue} units and add ${g.incomingValue} units.`, `The worker count is unchanged.`, `$$${solver.equation}$$`, `The new average output is ${solver.answer} units.`],
    "added-value-two-totals": [`Old total = ${g.oldAverage}×${g.oldCount}.`, `New total = ${g.newAverage}×${g.newCount}.`, `The joining student's marks are the difference.`, `$$${solver.equation}$$`, `So the new student scored ${solver.answer} marks.`],
    "added-value-age-shift": [ageShift, `Find the aged total for ${g.oldCount} members.`, `Compare it with the new total ${g.newAverage}×${g.newCount}.`, `$$${solver.equation}$$`, `The child's age is ${solver.answer} years.`],
    "removed-value-two-totals": [`Find the original salary total.`, `Find the remaining total from ${g.newAverage}×${g.newCount}.`, `Their difference is the leaving salary.`, `$$${solver.equation}$$`, `So the employee earned ₹${solver.answer}.`],
    "removed-value-age-shift": [ageShift, `Use the aged total before the person leaves.`, `Subtract the remaining group's total.`, `$$${solver.equation}$$`, `The person who left was ${solver.answer} years old.`],
    "replacement-value-delta": [`The average changes by ${toNumber(parameters.values.newAverage!) - toNumber(parameters.values.oldAverage!)} across ${g.oldCount} scores.`, `This gives the required rise in total.`, `Add that rise to the outgoing score ${g.outgoingValue}.`, `$$${solver.equation}$$`, `The new score is ${solver.answer}.`],
    "replacement-value-total": [`Find the old and new totals for the same ${g.oldCount} workers.`, `Their difference is the increase caused by replacement.`, `Add it to the outgoing output ${g.outgoingValue}.`, `$$${solver.equation}$$`, `The new worker produces ${solver.answer} units.`],
    "cricket-required-score": [`Runs before the next innings = ${g.oldAverage}×${g.oldCount}.`, `Runs needed for the target average = ${g.newAverage}×${g.newCount}.`, `The next score is the difference.`, `$$${solver.equation}$$`, `The batter must score ${solver.answer} runs.`],
    "cricket-new-average": [`Current runs = ${g.oldAverage}×${g.oldCount}.`, `Add the next-innings score ${g.addedValue}.`, `There are now ${g.newCount} innings.`, `$$${solver.equation}$$`, `The new batting average is ${solver.answer}.`],
  };
  const lines = linesByStrategy[strategy];
  if (!lines) throw new Error(`No CP-003 explanation strategy ${strategy}`);
  return { lines: lines.filter(Boolean) };
}

function optionsCp003(parameters: Avg001Parameters, solver: Avg001SolverResult) {
  const answer = Number(solver.answer);
  const step = parameters.contextDomain === "Workplace" ? 1000 : 1;
  const candidates = [answer, answer - step, answer + step, answer + 2 * step].map(String);
  const unique = [...new Set(candidates)];
  if (unique.length !== 4 || Number(unique[0]) <= 0) throw new Error(`Invalid CP-003 options for ${parameters.questionLanguageId}`);
  const shift = hash(`${parameters.seed}:options`) % 4;
  const options = [...unique];
  for (let i = 0; i < shift; i += 1) options.push(options.shift()!);
  return { options, correctIndex: options.indexOf(solver.answer) };
}

function validateCp003(pkg: Omit<Avg001QuestionPackage, "validation">) {
  const checks: Avg001ValidationCheck[] = [];
  const addCheck = (name: string, passed: boolean, message: string) => checks.push({ name, passed, message });
  addCheck("cp", pkg.canonicalProblemId === "AVG-CP-003", "Package belongs to CP-003");
  addCheck("language", pkg.language === "en", "English-only runtime");
  addCheck("stem", !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem), "Stem fully resolved");
  addCheck("verifier", equals(pkg.solver.exactAnswer, pkg.independentVerification.exactAnswer), "Independent verifier agrees");
  addCheck("options", pkg.options.length === 4 && new Set(pkg.options).size === 4, "Four unique options");
  addCheck("correct", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index resolves answer");
  addCheck("explanation", pkg.explanation.lines.length >= 4 && pkg.explanation.lines.some((line) => line.includes(pkg.answer)), "Explanation is substantive");
  addCheck("publication", !pkg.publiclyPublishable, "Not publicly publishable");
  return { valid: checks.every((check) => check.passed), checks };
}

export function runAvg001Cp003Pipeline(input: { questionLanguageId: string; seed: string; language: Avg001Language }): Avg001QuestionPackage {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  const parameters = generateCp003Parameters(input);
  const solver = solveCp003(parameters);
  const independentVerification = verifyCp003(parameters);
  const reasoningEvidence = evidenceCp003(parameters, solver);
  const explanation = explainCp003(parameters, solver, reasoningEvidence);
  const stem = renderTemplate(entry.template, parameters.renderVariables);
  const { options, correctIndex } = optionsCp003(parameters, solver);
  const mathematicalFingerprint = JSON.stringify({ cpId: entry.cpId, solveMode: entry.solveMode, values: parameters.values, answer: solver.exactAnswer });
  const base = {
    packageId: AVG_001_PACKAGE_ID,
    archetypeId: AVG_001_PACKAGE_ID,
    canonicalProblemId: entry.cpId,
    questionLanguageId: entry.qlId,
    questionId: `AVG-001:${entry.qlId}:${input.seed}`,
    seed: input.seed,
    language: input.language,
    difficultyBand: entry.difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    stem,
    options,
    correctIndex,
    answer: solver.answer,
    parameters,
    solver,
    independentVerification,
    reasoningEvidence,
    explanation,
    maturity: "RUNTIME_PROOF" as const,
    publiclyPublishable: false,
    mathematicalFingerprint,
    traceability: { packageId: AVG_001_PACKAGE_ID, canonicalProblemId: entry.cpId, questionLanguageId: entry.qlId, solveMode: entry.solveMode, scenarioVariant: entry.scenarioVariant },
  };
  const validation = validateCp003(base);
  if (!validation.valid) throw new Error(validation.checks.filter((c) => !c.passed).map((c) => `${c.name}: ${c.message}`).join("\n"));
  return { ...base, validation };
}
