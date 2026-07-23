import ranges from "../variable-ranges.cp003.library.json";
import { getAvg001QuestionEntry, renderTemplate } from "./library";
import {
  add,
  divide,
  equals,
  formatRational,
  multiply,
  rational,
  subtract,
  toNumber,
} from "./math";
import {
  AVG_001_PACKAGE_ID,
  type Avg001DisplayPolicy,
  type Avg001Language,
  type Avg001Parameters,
  type Avg001QuestionPackage,
  type Avg001ReasoningEvidence,
  type Avg001SolverResult,
  type Avg001ValidationCheck,
  type Rational,
} from "./types";

type Cp003Profile = {
  counts: number[];
  averages: number[];
  deltas: number[];
  years?: number[];
  memberMinimum?: number;
  memberMaximum?: number;
};

function hash(value: string) {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
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
  if (!items.length) throw new Error("Cannot pick from an empty CP-003 range");
  return items[Math.floor(next() * items.length)]!;
}

function natural(value: Rational) {
  if (value.denominator === 1) return String(value.numerator);
  const numeric = toNumber(value);
  if (Number.isInteger(numeric * 10)) return numeric.toFixed(1);
  return `${value.numerator}/${value.denominator}`;
}

function groupIndianDigits(value: string) {
  const match = value.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) return value;
  const [, sign, integer, decimal = ""] = match;
  if (integer.length <= 3) return `${sign}${integer}${decimal}`;
  const lastThree = integer.slice(-3);
  const leading = integer.slice(0, -3);
  const groupedLeading = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${groupedLeading},${lastThree}${decimal}`;
}

function isMoneyVariant(variant: string) {
  return /Salary|Sales|Price|salary|sales|price/.test(variant);
}

function isAgeVariant(variant: string) {
  return /Age|age|Family|family|Teacher|teacher|Worker|worker|StudentAge|PlayerAge|Retiring|retiring|newborn|Newborn|Child|child/.test(
    variant,
  );
}

function isAgeShiftVariant(variant: string) {
  return /AfterYears|ElapsedYears/.test(variant);
}

function profileKey(variant: string, contextDomain: string) {
  if (/cricket|Cricket/.test(variant)) return "cricket";
  if (/Salary|salary/.test(variant)) return "salary";
  if (/Sales|sales/.test(variant)) return "sales";
  if (/Price|price/.test(variant)) return "price";
  if (/Parcel|parcel/.test(variant)) return "parcel";
  if (/Weight|weight/.test(variant)) return "weight";
  if (/Output|output|Machine|machine/.test(variant)) return "output";
  if (/Score|score|Test|test|Reading|reading/.test(variant)) return "marks";
  if (/Child|child/.test(variant)) return "childAge";
  if (/teacherJoinsClass|findTeacherAge/i.test(variant)) {
    return "teacherStudentAge";
  }
  if (isAgeShiftVariant(variant)) {
    if (/Student|student|Class|class/.test(variant)) return "studentAge";
    return "age";
  }
  if (isAgeVariant(variant)) {
    return contextDomain === "Sports" ? "sportsAge" : "age";
  }
  return "abstract";
}

function profileFor(variant: string, contextDomain: string): Cp003Profile {
  const key = profileKey(variant, contextDomain);
  const profile = (ranges as any).profiles?.[key] as Cp003Profile | undefined;
  if (!profile) throw new Error(`Missing CP-003 profile ${key} for ${variant}`);
  return profile;
}

function memberWithinContext(
  variant: string,
  value: Rational,
  contextDomain: string,
) {
  const numeric = toNumber(value);
  if (!Number.isFinite(numeric)) return false;
  const profile = profileFor(variant, contextDomain);
  const minimum = profile.memberMinimum ?? 1;
  const maximum = profile.memberMaximum ?? 500;
  return numeric >= minimum && numeric <= maximum;
}

function preferredDirection(variant: string, fallback: number) {
  if (/Child|child|addLow/.test(variant)) return -1;
  if (/Teacher|teacher|Worker|worker|employeeJoins|EmployeeJoins/.test(variant)) {
    return 1;
  }
  if (/Retires|retires|Retiring|retiring/.test(variant)) return -1;
  return fallback;
}

function qlNumber(qlId: string) {
  return Number(qlId.split("-").at(-1));
}

function formatStemValue(value: Rational, variant: string) {
  const rendered = natural(value);
  return isMoneyVariant(variant) ? groupIndianDigits(rendered) : rendered;
}

function constructState(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001Parameters {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  if (entry.cpId !== "AVG-CP-003") {
    throw new Error(`CP-003 runtime received ${entry.cpId}`);
  }
  if (input.language !== "en") {
    throw new Error(
      `AVG-001 CP-003 supports English only; received ${input.language}`,
    );
  }

  const next = prng(`${input.seed}:${entry.qlId}:cp003`);
  const variant = entry.scenarioVariant;
  const profile = profileFor(variant, entry.contextDomain);
  const oldCount =
    entry.solveMode === "findInningsValueOrNewCricketAverage"
      ? pick(profile.counts, next)
      : pick(profile.counts, next);
  const yearsElapsed = isAgeShiftVariant(variant)
    ? pick(profile.years ?? [2, 3, 4], next)
    : 0;

  let oldAverage = rational(pick(profile.averages, next));
  let currentAverage = add(oldAverage, rational(yearsElapsed));
  let delta = rational(pick(profile.deltas, next));
  let direction = preferredDirection(
    variant,
    (qlNumber(entry.qlId) + Math.floor(next() * 2)) % 2 === 0 ? 1 : -1,
  );

  let newAverage: Rational;
  let addedValue: Rational | undefined;
  let removedValue: Rational | undefined;
  let oldValue: Rational | undefined;
  let newValue: Rational | undefined;
  let replacementTarget: "old" | "new" | undefined;
  let inningsCount: number | undefined;
  let nextScore: Rational | undefined;

  if (variant === "newbornAfterElapsedYears") {
    const newbornCount = pick([4, 5, 7], next);
    const years = pick([2, 3, 4], next);
    const factor = pick([5, 6, 7], next);
    const current = rational((newbornCount + 1) * factor);
    oldAverage = subtract(current, rational(years));
    currentAverage = current;
    newAverage = rational(newbornCount * factor);
    addedValue = rational(0);
    return buildParameters({
      entry,
      seed: input.seed,
      language: input.language,
      oldCount: newbornCount,
      oldAverage,
      currentAverage,
      newAverage,
      yearsElapsed: years,
      addedValue,
    });
  }

  const chooseDirection = (
    build: (candidateDirection: number) => Rational,
  ) => {
    for (const candidate of [direction, -direction]) {
      const value = build(candidate);
      if (memberWithinContext(variant, value, entry.contextDomain)) {
        direction = candidate;
        return value;
      }
    }
    for (const candidateDelta of profile.deltas.slice().sort((a, b) => a - b)) {
      delta = rational(candidateDelta);
      for (const candidate of [1, -1]) {
        const value = build(candidate);
        if (memberWithinContext(variant, value, entry.contextDomain)) {
          direction = candidate;
          return value;
        }
      }
    }
    throw new Error(`Unable to construct realistic CP-003 state for ${entry.qlId}`);
  };

  switch (entry.solveMode) {
    case "findNewAverageAfterAddition":
    case "findAddedMemberValueFromShift":
      addedValue = chooseDirection((candidate) => {
        const target = add(
          currentAverage,
          multiply(delta, rational(candidate)),
        );
        return subtract(
          multiply(target, rational(oldCount + 1)),
          multiply(currentAverage, rational(oldCount)),
        );
      });
      newAverage = add(
        currentAverage,
        multiply(delta, rational(direction)),
      );
      break;

    case "findNewAverageAfterRemoval":
    case "findRemovedMemberValueFromShift":
      if (oldCount <= 1) throw new Error("Removal requires at least two members");
      removedValue = chooseDirection((candidate) => {
        const target = add(
          currentAverage,
          multiply(delta, rational(candidate)),
        );
        return subtract(
          multiply(currentAverage, rational(oldCount)),
          multiply(target, rational(oldCount - 1)),
        );
      });
      newAverage = add(
        currentAverage,
        multiply(delta, rational(direction)),
      );
      break;

    case "findNewAverageAfterReplacement":
    case "findReplacementValueFromShift": {
      replacementTarget = variant.startsWith("findOld") ? "old" : "new";
      const baseOffset = multiply(delta, rational(direction * -2));
      oldValue = add(currentAverage, baseOffset);
      newAverage = add(
        currentAverage,
        multiply(delta, rational(direction)),
      );
      newValue = add(
        oldValue,
        multiply(
          subtract(newAverage, currentAverage),
          rational(oldCount),
        ),
      );
      if (
        !memberWithinContext(variant, oldValue, entry.contextDomain) ||
        !memberWithinContext(variant, newValue, entry.contextDomain)
      ) {
        direction *= -1;
        oldValue = add(
          currentAverage,
          multiply(delta, rational(direction * -2)),
        );
        newAverage = add(
          currentAverage,
          multiply(delta, rational(direction)),
        );
        newValue = add(
          oldValue,
          multiply(
            subtract(newAverage, currentAverage),
            rational(oldCount),
          ),
        );
      }
      if (
        !memberWithinContext(variant, oldValue, entry.contextDomain) ||
        !memberWithinContext(variant, newValue, entry.contextDomain)
      ) {
        throw new Error(`Unrealistic replacement state for ${entry.qlId}`);
      }
      break;
    }

    case "findInningsValueOrNewCricketAverage":
      inningsCount = oldCount;
      direction = 1;
      newAverage = add(oldAverage, delta);
      nextScore = subtract(
        multiply(newAverage, rational(inningsCount + 1)),
        multiply(oldAverage, rational(inningsCount)),
      );
      addedValue = nextScore;
      currentAverage = oldAverage;
      break;

    default:
      throw new Error(`Unsupported CP-003 solve mode ${entry.solveMode}`);
  }

  return buildParameters({
    entry,
    seed: input.seed,
    language: input.language,
    oldCount,
    oldAverage,
    currentAverage,
    newAverage,
    yearsElapsed,
    addedValue,
    removedValue,
    oldValue,
    newValue,
    replacementTarget,
    inningsCount,
    nextScore,
  });
}

function buildParameters(input: {
  entry: ReturnType<typeof getAvg001QuestionEntry>;
  seed: string;
  language: Avg001Language;
  oldCount: number;
  oldAverage: Rational;
  currentAverage: Rational;
  newAverage: Rational;
  yearsElapsed: number;
  addedValue?: Rational;
  removedValue?: Rational;
  oldValue?: Rational;
  newValue?: Rational;
  replacementTarget?: "old" | "new";
  inningsCount?: number;
  nextScore?: Rational;
}): Avg001Parameters {
  const oldTotal = multiply(input.oldAverage, rational(input.oldCount));
  const currentTotal = multiply(
    input.currentAverage,
    rational(input.oldCount),
  );
  const newCount =
    input.entry.solveMode === "findNewAverageAfterAddition" ||
    input.entry.solveMode === "findAddedMemberValueFromShift" ||
    input.entry.solveMode === "findInningsValueOrNewCricketAverage"
      ? input.oldCount + 1
      : input.entry.solveMode === "findNewAverageAfterRemoval" ||
          input.entry.solveMode === "findRemovedMemberValueFromShift"
        ? input.oldCount - 1
        : input.oldCount;
  const newTotal = multiply(input.newAverage, rational(newCount));
  const variant = input.entry.scenarioVariant;

  const renderVariables: Record<string, string | number> = {
    oldCount: input.oldCount,
    newCount,
    inningsCount: input.inningsCount ?? input.oldCount,
    oldAverage: formatStemValue(input.oldAverage, variant),
    currentAverage: formatStemValue(input.currentAverage, variant),
    newAverage: formatStemValue(input.newAverage, variant),
    yearsElapsed: input.yearsElapsed,
  };
  if (input.addedValue) {
    renderVariables.addedValue = formatStemValue(input.addedValue, variant);
  }
  if (input.removedValue) {
    renderVariables.removedValue = formatStemValue(input.removedValue, variant);
  }
  if (input.oldValue) {
    renderVariables.oldValue = formatStemValue(input.oldValue, variant);
  }
  if (input.newValue) {
    renderVariables.newValue = formatStemValue(input.newValue, variant);
  }
  if (input.nextScore) {
    renderVariables.nextScore = formatStemValue(input.nextScore, variant);
  }

  return {
    packageId: AVG_001_PACKAGE_ID,
    canonicalProblemId: "AVG-CP-003",
    questionLanguageId: input.entry.qlId,
    seed: input.seed,
    language: input.language,
    difficulty: input.entry.difficulty,
    taskKind: input.entry.taskKind,
    solveMode: input.entry.solveMode,
    answerType: input.entry.answerType,
    displayPolicy: input.entry.displayPolicy,
    contextDomain: input.entry.contextDomain,
    scenarioVariant: variant,
    values: {
      count: input.oldCount,
      average: input.oldAverage,
      total: oldTotal,
      oldCount: input.oldCount,
      newCount,
      oldAverage: input.oldAverage,
      currentAverage: input.currentAverage,
      newAverage: input.newAverage,
      oldTotal,
      currentTotal,
      newTotal,
      yearsElapsed: input.yearsElapsed,
      addedValue: input.addedValue,
      removedValue: input.removedValue,
      oldValue: input.oldValue,
      newValue: input.newValue,
      replacementTarget: input.replacementTarget,
      inningsCount: input.inningsCount,
      nextScore: input.nextScore,
    },
    renderVariables,
  };
}

function solveCp003(parameters: Avg001Parameters): Avg001SolverResult {
  const values = parameters.values;
  let exactAnswer: Rational;
  let equation: string;

  switch (parameters.solveMode) {
    case "findNewAverageAfterAddition":
    case "findNewAverageAfterRemoval":
    case "findNewAverageAfterReplacement":
      if (!values.newAverage) throw new Error("Missing new average");
      exactAnswer = values.newAverage;
      equation = `New average = ${natural(exactAnswer)}`;
      break;
    case "findAddedMemberValueFromShift":
      if (!values.addedValue) throw new Error("Missing added value");
      exactAnswer = values.addedValue;
      equation = `Added value = ${natural(exactAnswer)}`;
      break;
    case "findRemovedMemberValueFromShift":
      if (!values.removedValue) throw new Error("Missing removed value");
      exactAnswer = values.removedValue;
      equation = `Removed value = ${natural(exactAnswer)}`;
      break;
    case "findReplacementValueFromShift":
      exactAnswer =
        values.replacementTarget === "old"
          ? values.oldValue!
          : values.newValue!;
      if (!exactAnswer) throw new Error("Missing replacement answer");
      equation = `Replacement value = ${natural(exactAnswer)}`;
      break;
    case "findInningsValueOrNewCricketAverage":
      if (parameters.answerType === "AVERAGE") {
        exactAnswer = values.newAverage!;
        equation = `New batting average = ${natural(exactAnswer)}`;
      } else {
        exactAnswer = values.nextScore!;
        equation = `Required innings score = ${natural(exactAnswer)}`;
      }
      if (!exactAnswer) throw new Error("Missing cricket answer");
      break;
    default:
      throw new Error(`Unsupported CP-003 solve mode ${parameters.solveMode}`);
  }

  return {
    exactAnswer,
    answer: formatRational(exactAnswer, parameters.displayPolicy),
    equation,
    workingValues: {
      oldCount: values.oldCount ?? values.count,
      newCount: values.newCount ?? values.count,
      oldAverage: natural(values.oldAverage ?? values.average),
      currentAverage: natural(values.currentAverage ?? values.average),
      newAverage: natural(values.newAverage ?? values.average),
      oldTotal: natural(values.oldTotal ?? values.total),
      newTotal: natural(values.newTotal ?? values.total),
    },
  };
}

function independentlyVerifyCp003(parameters: Avg001Parameters) {
  const values = parameters.values;
  const oldCount = values.oldCount ?? values.count;
  const newCount = values.newCount ?? oldCount;
  const currentAverage = values.currentAverage ?? values.average;
  const oldStateTotal = multiply(currentAverage, rational(oldCount));
  const targetTotal = multiply(values.newAverage!, rational(newCount));
  let exactAnswer: Rational;
  let method: string;

  switch (parameters.solveMode) {
    case "findNewAverageAfterAddition":
      exactAnswer = divide(add(oldStateTotal, values.addedValue!), rational(newCount));
      method = "Rebuilt the shifted total, added the new member and divided by the new count";
      break;
    case "findNewAverageAfterRemoval":
      exactAnswer = divide(
        subtract(oldStateTotal, values.removedValue!),
        rational(newCount),
      );
      method = "Rebuilt the shifted total, removed the leaving member and divided by the reduced count";
      break;
    case "findNewAverageAfterReplacement":
      exactAnswer = divide(
        add(subtract(oldStateTotal, values.oldValue!), values.newValue!),
        rational(newCount),
      );
      method = "Rebuilt the total by removing the old value and adding the replacement";
      break;
    case "findAddedMemberValueFromShift":
      exactAnswer = subtract(targetTotal, oldStateTotal);
      method = "Compared the required new total with the shifted old total";
      break;
    case "findRemovedMemberValueFromShift":
      exactAnswer = subtract(oldStateTotal, targetTotal);
      method = "Compared the shifted old total with the remaining-group total";
      break;
    case "findReplacementValueFromShift": {
      const totalChange = subtract(targetTotal, oldStateTotal);
      exactAnswer =
        values.replacementTarget === "old"
          ? subtract(values.newValue!, totalChange)
          : add(values.oldValue!, totalChange);
      method = "Recovered the replacement from the exact change in total";
      break;
    }
    case "findInningsValueOrNewCricketAverage":
      if (parameters.answerType === "AVERAGE") {
        exactAnswer = divide(
          add(oldStateTotal, values.nextScore!),
          rational(newCount),
        );
        method = "Added the next innings to the previous run total and divided by innings played";
      } else {
        exactAnswer = subtract(targetTotal, oldStateTotal);
        method = "Subtracted the previous run total from the target run total";
      }
      break;
    default:
      throw new Error(`Independent CP-003 verifier unsupported mode`);
  }

  return {
    supported: true,
    exactAnswer,
    displayAnswer: formatRational(exactAnswer, parameters.displayPolicy),
    method,
  };
}

function buildCp003ReasoningEvidence(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
): Avg001ReasoningEvidence {
  const v = parameters.values;
  const oldCount = v.oldCount ?? v.count;
  const newCount = v.newCount ?? oldCount;
  const currentAverage = v.currentAverage ?? v.average;
  const currentTotal = multiply(currentAverage, rational(oldCount));
  const newTotal = multiply(v.newAverage!, rational(newCount));
  return {
    conceptId: isAgeShiftVariant(parameters.scenarioVariant)
      ? "average-change-after-time-shift"
      : parameters.solveMode === "findInningsValueOrNewCricketAverage"
        ? "cricket-average-total-shift"
        : "average-change-total-count",
    givens: {
      oldCount,
      newCount,
      oldAverage: natural(v.oldAverage ?? v.average),
      currentAverage: natural(currentAverage),
      newAverage: natural(v.newAverage!),
      yearsElapsed: v.yearsElapsed ?? 0,
      addedValue: v.addedValue ? natural(v.addedValue) : "",
      removedValue: v.removedValue ? natural(v.removedValue) : "",
      oldValue: v.oldValue ? natural(v.oldValue) : "",
      newValue: v.newValue ? natural(v.newValue) : "",
      inningsCount: v.inningsCount ?? "",
      nextScore: v.nextScore ? natural(v.nextScore) : "",
    },
    equations: [
      "Total = Average × Count",
      "New average = New total ÷ New count",
    ],
    intermediateValues: {
      currentTotal: natural(currentTotal),
      targetTotal: natural(newTotal),
      totalChange: natural(subtract(newTotal, currentTotal)),
    },
    decisiveCalculation: solver.equation,
    verification: `Independent total check gives ${solver.answer}`,
    finalContext: getAvg001QuestionEntry(parameters.questionLanguageId).finalContext,
  };
}

function unitLabel(parameters: Avg001Parameters) {
  const variant = parameters.scenarioVariant;
  if (isAgeShiftVariant(variant)) return " years";
  if (/Salary|salary|Sales|sales|Price|price/.test(variant)) return "₹";
  if (/Weight|weight/.test(variant)) return " kg";
  if (/Age|age|Family|family|Teacher|teacher|Worker|worker/.test(variant)) return " years";
  if (/Output|output|Machine|machine/.test(variant)) return " units";
  if (/Cricket|cricket|Runs|runs/.test(variant)) return " runs";
  if (/Score|score|Test|test/.test(variant)) return " marks";
  return "";
}

function groupLabel(parameters: Avg001Parameters) {
  const variant = parameters.scenarioVariant;
  if (/Cricket|cricket/.test(variant)) return "innings";
  if (/Test|test/.test(variant)) return "tests";
  if (/Score|score/.test(variant)) return "scores";
  if (/Salary|salary/.test(variant)) return "employees";
  if (/Machine|machine|Output|output/.test(variant)) return "machines";
  if (/Parcel|parcel/.test(variant)) return "parcels";
  if (/Sales|sales/.test(variant)) return "days";
  if (/Price|price/.test(variant)) return "prices";
  if (/Player|player/.test(variant)) return "players";
  if (/Student|student/.test(variant)) return "students";
  if (/Family|family/.test(variant)) return "family members";
  if (/Worker|worker/.test(variant)) return "workers";
  if (/Employee|employee|Retir/.test(variant)) return "employees";
  if (/Weight|weight/.test(variant)) return "people";
  if (/Reading|reading/.test(variant)) return "readings";
  return "values";
}

function ageMemberRole(parameters: Avg001Parameters) {
  const variant = parameters.scenarioVariant;
  if (/teacher/i.test(variant)) return "teacher";
  if (/student/i.test(variant)) return "student";
  if (/employee|retir/i.test(variant)) return "employee";
  if (/worker/i.test(variant)) return "worker";
  if (/player/i.test(variant)) return "player";
  if (/child|newborn/i.test(variant)) return "child";
  return "member";
}

function shown(parameters: Avg001Parameters, value: string | number) {
  const unit = unitLabel(parameters);
  const rendered = isMoneyVariant(parameters.scenarioVariant)
    ? groupIndianDigits(String(value))
    : String(value);
  return unit === "₹" ? `₹${rendered}` : `${rendered}${unit}`;
}

function renderCp003Explanation(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
  evidence: Avg001ReasoningEvidence,
) {
  const entry = getAvg001QuestionEntry(parameters.questionLanguageId);
  const g = evidence.givens;
  const currentTotal = String(evidence.intermediateValues.currentTotal);
  const targetTotal = String(evidence.intermediateValues.targetTotal);
  const oldCount = Number(g.oldCount);
  const newCount = Number(g.newCount);
  const currentAverage = String(g.currentAverage);
  const newAverage = String(g.newAverage);
  const group = groupLabel(parameters);
  const ageLine =
    Number(g.yearsElapsed) > 0
      ? `After ${g.yearsElapsed} ${Number(g.yearsElapsed) === 1 ? "year" : "years"}, the old average becomes ${shown(parameters, currentAverage)}.`
      : null;

  const withAge = (lines: string[]) => (ageLine ? [ageLine, ...lines] : lines);

  switch (entry.explanationStrategyId) {
    case "add-new-total":
      return { lines: withAge([
        `The old total is ${currentAverage} × ${oldCount} = ${shown(parameters, currentTotal)}.`,
        `Add ${shown(parameters, String(g.addedValue))} to this total.`,
        `The new count is ${newCount}.`,
        `$$\\text{New average}=(${currentTotal}+${g.addedValue})\\div${newCount}=${solver.answer}$$`,
        `So the new average is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "add-new-balance":
      return { lines: withAge([
        `The ${oldCount} ${group} have total ${shown(parameters, currentTotal)}.`,
        `After adding ${shown(parameters, String(g.addedValue))}, the total becomes ${shown(parameters, targetTotal)}.`,
        `Divide by ${newCount}, the new number of ${group}.`,
        `$$${targetTotal}\\div${newCount}=${solver.answer}$$`,
        `Hence, the new average is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "add-new-shortcut":
      return { lines: withAge([
        "First convert the old average into a total.",
        `$$${currentAverage}\\times${oldCount}=${currentTotal}$$`,
        `Add the new value and divide by ${newCount}.`,
        `$$(${currentTotal}+${g.addedValue})\\div${newCount}=${solver.answer}$$`,
        `This gives a new average of ${shown(parameters, solver.answer)}.`,
      ]) };
    case "add-age-shift":
      return { lines: withAge([
        `The present total age is ${currentAverage} × ${oldCount} = ${currentTotal} years.`,
        `Add the joining member's age, ${shown(parameters, String(g.addedValue))}.`,
        `There are now ${newCount} people.`,
        `$$\\text{New average}=(${currentTotal}+${g.addedValue})\\div${newCount}=${solver.answer}$$`,
        `So the new average age is ${solver.answer} years.`,
      ]) };
    case "add-age-newborn":
      return { lines: withAge([
        `The family's total age is now ${currentAverage} × ${oldCount} = ${currentTotal} years.`,
        "A newborn adds 0 years to this total.",
        `The family now has ${newCount} members.`,
        `$$\\text{New average}=(${currentTotal}+0)\\div${newCount}=${solver.answer}$$`,
        `So the new average age is ${solver.answer} years.`,
      ]) };

    case "remove-new-total":
      return { lines: withAge([
        `The total before removal is ${currentAverage} × ${oldCount} = ${shown(parameters, currentTotal)}.`,
        `Subtract ${shown(parameters, String(g.removedValue))}.`,
        `The remaining count is ${newCount}.`,
        `$$(${currentTotal}-${g.removedValue})\\div${newCount}=${solver.answer}$$`,
        `So the new average is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "remove-new-balance":
      return { lines: withAge([
        `The ${oldCount} ${group} have total ${shown(parameters, currentTotal)}.`,
        `Removing ${shown(parameters, String(g.removedValue))} leaves ${shown(parameters, targetTotal)}.`,
        `Share this among the remaining ${newCount} ${group}.`,
        `$$${targetTotal}\\div${newCount}=${solver.answer}$$`,
        `Hence, the new average is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "remove-new-shortcut":
      return { lines: withAge([
        "Use total = average × count.",
        `Old total: ${currentAverage} × ${oldCount} = ${shown(parameters, currentTotal)}.`,
        `After removal, the total is ${shown(parameters, targetTotal)} and the count is ${newCount}.`,
        `$$\\text{New average}=${targetTotal}\\div${newCount}=${solver.answer}$$`,
        `The new average is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "remove-age-shift":
      return { lines: withAge([
        `The present total age is ${currentTotal} years.`,
        `Subtract the leaving person's age, ${shown(parameters, String(g.removedValue))}.`,
        `Divide the remaining total ${targetTotal} by ${newCount}.`,
        `$$${targetTotal}\\div${newCount}=${solver.answer}$$`,
        `So the new average age is ${solver.answer} years.`,
      ]) };

    case "replace-new-delta":
      return { lines: withAge([
        `The replacement changes the total by ${g.newValue} - ${g.oldValue}.`,
        `Apply this change to the old total ${shown(parameters, currentTotal)}.`,
        `The count stays ${oldCount}.`,
        `$$\\text{New average}=${targetTotal}\\div${oldCount}=${solver.answer}$$`,
        `So the new average is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "replace-new-total":
      return { lines: withAge([
        `Old total = ${currentAverage} × ${oldCount} = ${shown(parameters, currentTotal)}.`,
        `Remove ${shown(parameters, String(g.oldValue))} and add ${shown(parameters, String(g.newValue))}.`,
        `The corrected total is ${shown(parameters, targetTotal)}.`,
        `$$${targetTotal}\\div${oldCount}=${solver.answer}$$`,
        `Hence, the new average is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "replace-new-shortcut":
      return { lines: withAge([
        "The number of values does not change.",
        `Net change in total = ${g.newValue} - ${g.oldValue}.`,
        `Apply this change to ${shown(parameters, currentTotal)}, then divide by ${oldCount}.`,
        `$$${targetTotal}\\div${oldCount}=${solver.answer}$$`,
        `The corrected average is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "replace-age-shift":
      return { lines: withAge([
        `The present total age is ${currentTotal} years.`,
        `Replace age ${g.oldValue} by ${g.newValue}.`,
        `The new total is ${shown(parameters, targetTotal)}; the count remains ${oldCount}.`,
        `$$${targetTotal}\\div${oldCount}=${solver.answer}$$`,
        `So the new average age is ${solver.answer} years.`,
      ]) };

    case "added-value-total-gap":
      return { lines: withAge([
        `Old total = ${currentAverage} × ${oldCount} = ${shown(parameters, currentTotal)}.`,
        `The new total required is ${newAverage} × ${newCount} = ${targetTotal}.`,
        "The added value is the gap between these totals.",
        `$$${targetTotal}-${currentTotal}=${solver.answer}$$`,
        `So the added value is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "added-value-equation":
      return { lines: withAge([
        `Let the added value be x.`,
        `The old total is ${shown(parameters, currentTotal)} and the new total is ${shown(parameters, targetTotal)}.`,
        `So ${currentTotal}+x=${targetTotal}.`,
        `$$x=${targetTotal}-${currentTotal}=${solver.answer}$$`,
        `Hence, the added value is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "added-value-shift":
      return { lines: withAge([
        `The total must rise from ${shown(parameters, currentTotal)} to ${shown(parameters, targetTotal)}.`,
        `That entire increase comes from the new member.`,
        `$$\\text{Added value}=${targetTotal}-${currentTotal}=${solver.answer}$$`,
        `So the added value is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "added-age-shift":
      return { lines: withAge([
        `The present total age is ${currentTotal} years.`,
        `The required total after joining is ${targetTotal} years.`,
        `The joining ${ageMemberRole(parameters)}'s age is the difference.`,
        `$$${targetTotal}-${currentTotal}=${solver.answer}$$`,
        `So the ${ageMemberRole(parameters)}'s age is ${solver.answer} years.`,
      ]) };

    case "removed-value-total-gap":
      return { lines: withAge([
        `Old total = ${currentAverage} × ${oldCount} = ${shown(parameters, currentTotal)}.`,
        `The remaining total is ${newAverage} × ${newCount} = ${targetTotal}.`,
        "The removed value is the difference.",
        `$$${currentTotal}-${targetTotal}=${solver.answer}$$`,
        `So the removed value is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "removed-value-equation":
      return { lines: withAge([
        `Let the removed value be x.`,
        `After removal, ${currentTotal}-x=${targetTotal}.`,
        `$$x=${currentTotal}-${targetTotal}=${solver.answer}$$`,
        `Hence, the removed value is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "removed-value-shift":
      return { lines: withAge([
        `The total falls from ${shown(parameters, currentTotal)} to ${shown(parameters, targetTotal)}.`,
        `The fall equals the value that was removed.`,
        `$$\\text{Removed value}=${currentTotal}-${targetTotal}=${solver.answer}$$`,
        `So the removed value is ${shown(parameters, solver.answer)}.`,
      ]) };
    case "removed-age-shift":
      return { lines: withAge([
        `The present total age is ${currentTotal} years.`,
        `The remaining people's total age is ${targetTotal} years.`,
        `The leaving ${ageMemberRole(parameters)}'s age is the difference.`,
        `$$${currentTotal}-${targetTotal}=${solver.answer}$$`,
        `So the ${ageMemberRole(parameters)}'s age is ${solver.answer} years.`,
      ]) };

    case "replacement-value-delta":
    case "replacement-value-equation":
    case "replacement-value-total":
    case "replacement-old-value":
    case "replacement-age-shift": {
      const totalChangeValue = subtract(
        parameters.values.newTotal!,
        parameters.values.currentTotal!,
      );
      const changeIsNegative = totalChangeValue.numerator < 0;
      const changeMagnitude = rational(
        Math.abs(totalChangeValue.numerator),
        totalChangeValue.denominator,
      );
      const changeText = natural(changeMagnitude);
      const asksOld = parameters.values.replacementTarget === "old";
      const relationLine = asksOld
        ? changeIsNegative
          ? `Old value = new value + ${changeText}.`
          : `Old value = new value - ${changeText}.`
        : changeIsNegative
          ? `New value = old value - ${changeText}.`
          : `New value = old value + ${changeText}.`;
      const formulaLine = asksOld
        ? changeIsNegative
          ? `$$${g.newValue}+${changeText}=${solver.answer}$$`
          : `$$${g.newValue}-${changeText}=${solver.answer}$$`
        : changeIsNegative
          ? `$$${g.oldValue}-${changeText}=${solver.answer}$$`
          : `$$${g.oldValue}+${changeText}=${solver.answer}$$`;
      return { lines: withAge([
        `The total ${changeIsNegative ? "falls" : "rises"} by ${shown(parameters, changeText)}.`,
        asksOld
          ? `The new value is ${shown(parameters, String(g.newValue))}.`
          : `The old value is ${shown(parameters, String(g.oldValue))}.`,
        relationLine,
        formulaLine,
        `So the required value is ${shown(parameters, solver.answer)}.`,
      ]) };
    }

    case "cricket-required-total":
      return { lines: [
        `Runs scored so far = ${g.oldAverage} × ${g.inningsCount} = ${currentTotal}.`,
        `To average ${g.newAverage} after ${newCount} innings, the total must be ${targetTotal}.`,
        "The next score is the difference between the target total and the current total.",
        `$$${targetTotal}-${currentTotal}=${solver.answer}$$`,
        `So the batter must score ${solver.answer} runs.`,
      ] };
    case "cricket-required-equation":
      return { lines: [
        `Let the next innings score be x.`,
        `The current run total is ${currentTotal} runs.`,
        `For an average of ${g.newAverage} after ${newCount} innings, ${currentTotal}+x=${targetTotal}.`,
        `$$x=${targetTotal}-${currentTotal}=${solver.answer}$$`,
        `Hence, the required score is ${solver.answer} runs.`,
      ] };
    case "cricket-required-shift":
      return { lines: [
        `The average must rise from ${g.oldAverage} to ${g.newAverage}.`,
        `That means the total must rise from ${currentTotal} to ${targetTotal}.`,
        `The whole increase comes from the next innings.`,
        `$$\\text{Required score}=${targetTotal}-${currentTotal}=${solver.answer}$$`,
        `Therefore, the batter needs ${solver.answer} runs.`,
      ] };
    case "cricket-new-total":
      return { lines: [
        `Runs scored so far = ${g.oldAverage} × ${g.inningsCount} = ${currentTotal}.`,
        `Add the next score of ${g.nextScore} runs to get ${targetTotal}.`,
        `There are now ${newCount} innings.`,
        `$$\\text{New average}=${targetTotal}\\div${newCount}=${solver.answer}$$`,
        `So the new batting average is ${solver.answer}.`,
      ] };
    case "cricket-new-balance":
      return { lines: [
        `The batter has ${currentTotal} runs before the next innings.`,
        `After scoring ${g.nextScore}, the total becomes ${targetTotal}.`,
        `Share this total over ${newCount} innings.`,
        `$$${targetTotal}\\div${newCount}=${solver.answer}$$`,
        `Hence, the updated average is ${solver.answer}.`,
      ] };
    case "cricket-new-shortcut":
      return { lines: [
        `First convert the old average into a run total: ${g.oldAverage} × ${g.inningsCount} = ${currentTotal}.`,
        `Add ${g.nextScore} runs.`,
        `Divide the new total ${targetTotal} by ${newCount}.`,
        `$$\\text{Average}=${targetTotal}\\div${newCount}=${solver.answer}$$`,
        `Therefore, the new batting average is ${solver.answer}.`,
      ] };
    default:
      throw new Error(
        `No CP-003 explanation renderer for ${entry.explanationStrategyId}`,
      );
  }
}

function formatOption(
  value: Rational,
  policy: Avg001DisplayPolicy,
  canonical = false,
) {
  if (canonical) return formatRational(value, policy);
  if (policy === "EXACT_INTEGER") return String(Math.max(0, Math.round(toNumber(value))));
  if (policy === "EXACT_DECIMAL_1") return toNumber(value).toFixed(1);
  if (policy === "EXACT_DECIMAL_2") return toNumber(value).toFixed(2);
  return natural(value);
}

function generateCp003Options(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
) {
  const v = parameters.values;
  const profile = profileFor(parameters.scenarioVariant, parameters.contextDomain);
  const step = rational(Math.min(...profile.deltas));
  const candidates: Rational[] = [
    v.oldAverage ?? v.average,
    v.currentAverage ?? v.average,
    v.newAverage ?? v.average,
    subtract(solver.exactAnswer, step),
    add(solver.exactAnswer, step),
    subtract(solver.exactAnswer, multiply(step, rational(2))),
    add(solver.exactAnswer, multiply(step, rational(2))),
  ];
  if (v.addedValue) candidates.push(v.addedValue);
  if (v.removedValue) candidates.push(v.removedValue);
  if (v.oldValue) candidates.push(v.oldValue);
  if (v.newValue) candidates.push(v.newValue);

  const canonical = formatOption(
    solver.exactAnswer,
    parameters.displayPolicy,
    true,
  );
  const unique = [canonical];
  for (const candidate of candidates) {
    const rendered = formatOption(candidate, parameters.displayPolicy);
    if (!unique.includes(rendered)) unique.push(rendered);
    if (unique.length === 4) break;
  }
  if (unique.length !== 4) {
    throw new Error(
      `Insufficient unique CP-003 distractors for ${parameters.questionLanguageId}`,
    );
  }

  const shift = hash(`${parameters.seed}:cp003-options`) % 4;
  const options = [...unique];
  for (let index = 0; index < shift; index += 1) {
    options.push(options.shift()!);
  }
  const correctIndex = options.indexOf(canonical);
  if (correctIndex < 0) throw new Error("CP-003 answer missing from options");
  return { options, correctIndex };
}

function buildCp003Fingerprint(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
) {
  const v = parameters.values;
  return JSON.stringify({
    cpId: parameters.canonicalProblemId,
    solveMode: parameters.solveMode,
    scenarioVariant: parameters.scenarioVariant,
    oldCount: v.oldCount,
    newCount: v.newCount,
    oldAverage: v.oldAverage,
    currentAverage: v.currentAverage,
    newAverage: v.newAverage,
    addedValue: v.addedValue,
    removedValue: v.removedValue,
    oldValue: v.oldValue,
    newValue: v.newValue,
    yearsElapsed: v.yearsElapsed,
    exactAnswer: solver.exactAnswer,
  });
}

function validateCp003(
  pkg: Omit<Avg001QuestionPackage, "validation">,
) {
  const checks: Avg001ValidationCheck[] = [];
  const addCheck = (name: string, passed: boolean, message: string) =>
    checks.push({ name, passed, message });
  const v = pkg.parameters.values;
  const oldCount = v.oldCount ?? v.count;
  const newCount = v.newCount ?? oldCount;
  const currentAverage = v.currentAverage ?? v.average;
  const currentTotal = multiply(currentAverage, rational(oldCount));

  addCheck("language", pkg.language === "en", "CP-003 is English only");
  addCheck(
    "cp-contract",
    pkg.canonicalProblemId === "AVG-CP-003",
    "Package belongs to CP-003",
  );
  addCheck(
    "resolved-stem",
    !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem),
    "Stem is fully resolved",
  );
  addCheck(
    "independent-verifier",
    pkg.independentVerification.supported &&
      equals(
        pkg.solver.exactAnswer,
        pkg.independentVerification.exactAnswer,
      ) &&
      pkg.answer === pkg.independentVerification.displayAnswer,
    "Independent verifier agrees exactly",
  );
  addCheck(
    "options",
    pkg.options.length === 4 &&
      new Set(pkg.options).size === 4 &&
      pkg.options[pkg.correctIndex] === pkg.answer,
    "Four unique options contain the answer once",
  );
  addCheck(
    "explanation",
    pkg.explanation.lines.length >= 4 &&
      pkg.explanation.lines.length <= 7 &&
      pkg.explanation.lines.some((line) => line.includes(pkg.answer)),
    "Explanation is concise and contains the answer",
  );
  addCheck(
    "maturity",
    pkg.maturity === "RUNTIME_PROOF" && !pkg.publiclyPublishable,
    "CP-003 is not publicly publishable",
  );

  if (isAgeShiftVariant(pkg.parameters.scenarioVariant)) {
    addCheck(
      "age-shift",
      equals(
        currentAverage,
        add(v.oldAverage ?? v.average, rational(v.yearsElapsed ?? 0)),
      ),
      "Elapsed years are applied before membership change",
    );
  }

  if (
    pkg.solveMode === "findNewAverageAfterAddition" ||
    pkg.solveMode === "findAddedMemberValueFromShift" ||
    pkg.solveMode === "findInningsValueOrNewCricketAverage"
  ) {
    addCheck(
      "addition-count",
      newCount === oldCount + 1,
      "Addition increases count by one",
    );
    addCheck(
      "addition-total",
      equals(
        multiply(v.newAverage!, rational(newCount)),
        add(currentTotal, v.addedValue ?? v.nextScore!),
      ),
      "New total equals old total plus added value",
    );
  }
  if (
    pkg.solveMode === "findNewAverageAfterRemoval" ||
    pkg.solveMode === "findRemovedMemberValueFromShift"
  ) {
    addCheck(
      "removal-count",
      newCount === oldCount - 1,
      "Removal decreases count by one",
    );
    addCheck(
      "removal-total",
      equals(
        multiply(v.newAverage!, rational(newCount)),
        subtract(currentTotal, v.removedValue!),
      ),
      "Remaining total equals old total minus removed value",
    );
  }
  if (
    pkg.solveMode === "findNewAverageAfterReplacement" ||
    pkg.solveMode === "findReplacementValueFromShift"
  ) {
    addCheck(
      "replacement-count",
      newCount === oldCount,
      "Replacement keeps count unchanged",
    );
    addCheck(
      "replacement-total",
      equals(
        multiply(v.newAverage!, rational(newCount)),
        add(subtract(currentTotal, v.oldValue!), v.newValue!),
      ),
      "Replacement total is exact",
    );
  }

  return {
    valid: checks.every((check) => check.passed),
    checks,
  };
}

export function runAvg001Cp003Pipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001QuestionPackage {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  const parameters = constructState(input);
  const solver = solveCp003(parameters);
  const independentVerification = independentlyVerifyCp003(parameters);
  const reasoningEvidence = buildCp003ReasoningEvidence(parameters, solver);
  const explanation = renderCp003Explanation(
    parameters,
    solver,
    reasoningEvidence,
  );
  const stem = renderTemplate(entry.template, parameters.renderVariables).replace(/\b1 years\b/g, "1 year");
  const { options, correctIndex } = generateCp003Options(parameters, solver);
  const mathematicalFingerprint = buildCp003Fingerprint(parameters, solver);

  const base = {
    packageId: AVG_001_PACKAGE_ID,
    archetypeId: AVG_001_PACKAGE_ID,
    canonicalProblemId: "AVG-CP-003" as const,
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
    traceability: {
      packageId: AVG_001_PACKAGE_ID,
      canonicalProblemId: "AVG-CP-003",
      questionLanguageId: entry.qlId,
      taskKind: entry.taskKind,
      solveMode: entry.solveMode,
      answerType: entry.answerType,
      contextDomain: entry.contextDomain,
      scenarioVariant: entry.scenarioVariant,
      ageShift: isAgeShiftVariant(entry.scenarioVariant),
    },
  };

  const validation = validateCp003(base);
  if (!validation.valid) {
    throw new Error(
      validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join("\n"),
    );
  }
  return { ...base, validation };
}
