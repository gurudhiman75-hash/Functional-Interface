import type { Avg001QuestionPackage } from "./types";

const countShareStrategies = new Set([
  "total-gap-over-average-gap",
]);

function contextWords(stem: string) {
  if (/\bstudents?\b/i.test(stem)) return { singular: "student", plural: "students" };
  if (/\bemployees?\b/i.test(stem)) return { singular: "employee", plural: "employees" };
  if (/\bpeople\b|\bperson\b/i.test(stem)) return { singular: "person", plural: "people" };
  if (/\bmachines?\b/i.test(stem)) return { singular: "machine", plural: "machines" };
  if (/\bshops?\b/i.test(stem)) return { singular: "shop", plural: "shops" };
  if (/\binnings?\b/i.test(stem)) return { singular: "inning", plural: "innings" };
  if (/\bparcels?\b/i.test(stem)) return { singular: "parcel", plural: "parcels" };
  return { singular: "record", plural: "records" };
}

function normalizeUnits(text: string) {
  return text
    .replace(/\b1 marks\b/g, "1 mark")
    .replace(/\b1 years\b/g, "1 year")
    .replace(/\b1 runs\b/g, "1 run")
    .replace(/\b1 units\b/g, "1 unit");
}

function contextualize(text: string, singular: string, plural: string) {
  return normalizeUnits(text)
    .replace(/\bentry correction\b/gi, "correction")
    .replace(/\bmistaken entry\b/gi, "wrong value")
    .replace(/\bwrong entry\b/gi, "wrong value")
    .replace(/\bcorrect entry\b/gi, "correct value")
    .replace(/\bentries\b/gi, "values")
    .replace(/\bentry\b/gi, "value")
    .replace(/\bEach record\b/g, `Each ${singular}`)
    .replace(/\bone record\b/gi, `one ${singular}`)
    .replace(/\brecord count\b/gi, `${singular} count`)
    .replace(/\bper record\b/gi, `per ${singular}`)
    .replace(/\ball records\b/gi, `all ${plural}`)
    .replace(/\brecords\b/g, plural)
    .replace(/average-change shares/gi, "equal parts of the average change")
    .replace(/scale that change up to the total/gi, "multiply that change by the number of values")
    .replace(/scale the average change/gi, "multiply the average change");
}

export function applyAvg001Cp005ExplanationPolish(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-005") return pkg;

  const { singular, plural } = contextWords(pkg.stem);
  const strategy = String(pkg.traceability.explanationStrategyId ?? "");
  let lines = pkg.explanation.lines;

  if (
    pkg.solveMode === "findNumberOfItemsFromTotalCorrection" &&
    countShareStrategies.has(strategy)
  ) {
    const variables = pkg.parameters.renderVariables;
    const wrong = String(variables.incorrectValue);
    const correct = String(variables.correctValue);
    const difference = String(variables.entryDifference);
    const averageChange = String(variables.averageChange);
    const count = String(variables.count);
    lines = [
      `Each ${singular} accounts for ${averageChange} of the total change, while the wrong value changed the total by ${difference}.`,
      `$$Total change = |${correct} - ${wrong}| = ${difference}$$`,
      `$$Number of ${plural} = total change ÷ change per ${singular} = ${difference} ÷ ${averageChange} = ${count}$$`,
      `So ${pkg.answer} ${plural} were included.`,
    ];
  }

  const polishedAnswer = normalizeUnits(pkg.answer);
  return {
    ...pkg,
    stem: normalizeUnits(pkg.stem),
    answer: polishedAnswer,
    options: pkg.options.map(normalizeUnits),
    solver: {
      ...pkg.solver,
      answer: polishedAnswer,
    },
    independentVerification: {
      ...pkg.independentVerification,
      displayAnswer: normalizeUnits(pkg.independentVerification.displayAnswer),
    },
    explanation: {
      lines: lines.map((line) => contextualize(line, singular, plural)),
    },
  };
}
