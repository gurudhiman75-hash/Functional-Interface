import { getAvg001QuestionEntry } from "./library";
import { toNumber } from "./math";
import { formatIndianNumber } from "./presentation-quality-v2";
import { applyAvg001Cp005EditorialV2FinalCandidate } from "./cp005-editorial-v2-final";
import type {
  Avg001QuestionPackage,
  Avg001ValidationCheck,
  Rational,
} from "./types";

export const AVG_001_CP005_EDITORIAL_V2_APPROVED =
  "AVG-CP-005 editorial v2 MathJax-unit and numerical-shortcut review fixes v2";

const COUNT_LABELS: Record<string, string> = {
  examMarksCorrection: "students",
  salaryRegisterCorrection: "employees",
  ageRegisterCorrection: "people",
  factoryOutputCorrection: "machines",
  shopSalesCorrection: "shops",
  inningsRunsCorrection: "innings",
  parcelWeightCorrection: "parcels",
  recordCountCorrection: "values",
};

function scenarioKey(pkg: Avg001QuestionPackage) {
  const variant = String(pkg.parameters.scenarioVariant);
  return Object.keys(COUNT_LABELS).find((key) => variant.startsWith(key)) ?? "recordCountCorrection";
}

function countLabel(pkg: Avg001QuestionPackage) {
  return COUNT_LABELS[scenarioKey(pkg)]!;
}

function numberFrom(value: unknown) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "numerator" in value) {
    return toNumber(value as Rational);
  }
  return undefined;
}

function shown(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined && rendered !== "") {
    const parsed = Number(String(rendered).replace(/[₹,\s]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return numberFrom(pkg.parameters.values[key as keyof typeof pkg.parameters.values]);
}

function displayRaw(pkg: Avg001QuestionPackage, value: number) {
  const policy = pkg.parameters.displayPolicy;
  if (policy === "EXACT_DECIMAL_1") return value.toFixed(1);
  if (policy === "EXACT_DECIMAL_2") return value.toFixed(2);
  if (policy === "EXACT_INTEGER") return String(Math.round(value));
  return String(Number(value.toFixed(3)));
}

function mathNumber(pkg: Avg001QuestionPackage, value: number) {
  return formatIndianNumber(displayRaw(pkg, value)).replaceAll(",", "{,}");
}

function unitWord(pkg: Avg001QuestionPackage, value: number) {
  const unit = getAvg001QuestionEntry(pkg.questionLanguageId).unitKind ?? "none";
  const singular = Math.abs(value) === 1;
  if (unit === "marks") return singular ? "mark" : "marks";
  if (unit === "years") return singular ? "year" : "years";
  if (unit === "runs") return singular ? "run" : "runs";
  if (unit === "units") return singular ? "unit" : "units";
  if (unit === "kg") return "kg";
  return "";
}

function measuredLatex(pkg: Avg001QuestionPackage, value: number, bold = false) {
  const unit = getAvg001QuestionEntry(pkg.questionLanguageId).unitKind ?? "none";
  const number = mathNumber(pkg, value);
  let body = number;
  if (unit === "currency") body = `\\text{₹}${number}`;
  else {
    const word = unitWord(pkg, value);
    if (word) body = `${number}\\text{ ${word}}`;
  }
  return bold ? `\\mathbf{${body}}` : body;
}

function answerLatex(pkg: Avg001QuestionPackage, value: number) {
  if (pkg.parameters.answerType === "COUNT") {
    return `\\mathbf{${Math.round(value)}\\text{ ${countLabel(pkg)}}}`;
  }
  return measuredLatex(pkg, value, true);
}

function addExpression(pkg: Avg001QuestionPackage, base: number, delta: number) {
  return `${mathNumber(pkg, base)}${delta < 0 ? "-" : "+"}${mathNumber(pkg, Math.abs(delta))}`;
}

function subtractExpression(pkg: Avg001QuestionPackage, base: number, delta: number) {
  return `${mathNumber(pkg, base)}${delta < 0 ? "+" : "-"}${mathNumber(pkg, Math.abs(delta))}`;
}

function fixArticles(text: string) {
  return text.replace(
    /\b([Aa]) (inspection|average|organisation|employee|inning|age|audit|error)\b/g,
    (_, article: string, noun: string) => `${article === "A" ? "An" : "an"} ${noun}`,
  );
}

function singularize(text: string) {
  return fixArticles(text)
    .replace(/\b(1(?:\.0+)?) marks\b/g, "$1 mark")
    .replace(/\b(1(?:\.0+)?) years\b/g, "$1 year")
    .replace(/\b(1(?:\.0+)?) runs\b/g, "$1 run")
    .replace(/\b(1(?:\.0+)?) units\b/g, "$1 unit")
    .replace(/\b(1(?:\.0+)?)\\text\{ marks\}/g, "$1\\text{ mark}")
    .replace(/\b(1(?:\.0+)?)\\text\{ years\}/g, "$1\\text{ year}")
    .replace(/\b(1(?:\.0+)?)\\text\{ runs\}/g, "$1\\text{ run}")
    .replace(/\b(1(?:\.0+)?)\\text\{ units\}/g, "$1\\text{ unit}");
}

function numericalWorking(pkg: Avg001QuestionPackage) {
  const count = shown(pkg, "count") ?? 1;
  const reported = shown(pkg, "reportedAverage") ?? 0;
  const corrected = shown(pkg, "correctedAverage") ?? 0;
  const wrong = shown(pkg, "incorrectValue") ?? 0;
  const correct = shown(pkg, "correctValue") ?? 0;
  const wrong2 = shown(pkg, "incorrectValue2") ?? 0;
  const correct2 = shown(pkg, "correctValue2") ?? 0;
  const change = shown(pkg, "averageChange") ?? Math.abs(corrected - reported);
  const delta = correct - wrong;
  const averageShift = corrected - reported;
  const totalShift = averageShift * count;
  const difference = Math.abs(correct - wrong);
  const delta2 = correct2 - wrong2;
  const net = delta + delta2;

  switch (pkg.solveMode) {
    case "findCorrectedAverageFromMistake":
      return {
        step: `The signed correction is ${measuredLatex(pkg, correct)}-${measuredLatex(pkg, wrong)}=${measuredLatex(pkg, delta)}. $$\\Delta A=\\frac{${measuredLatex(pkg, delta)}}{${count}}=${measuredLatex(pkg, averageShift)},\\quad A_{\\text{correct}}=${addExpression(pkg, reported, averageShift)}=${answerLatex(pkg, corrected)}$$`,
        shortcut: `$$A_{\\text{correct}}=${mathNumber(pkg, reported)}+\\frac{${mathNumber(pkg, correct)}-${mathNumber(pkg, wrong)}}{${count}}=${addExpression(pkg, reported, averageShift)}=${answerLatex(pkg, corrected)}$$`,
      };
    case "findReportedAverageBeforeCorrection":
      return {
        step: `The correction changed the average by ${measuredLatex(pkg, averageShift)}. $$A_{\\text{reported}}=A_{\\text{correct}}-\\frac{${measuredLatex(pkg, delta)}}{${count}}=${subtractExpression(pkg, corrected, averageShift)}=${answerLatex(pkg, reported)}$$`,
        shortcut: `$$A_{\\text{reported}}=${mathNumber(pkg, corrected)}-\\frac{${mathNumber(pkg, correct)}-${mathNumber(pkg, wrong)}}{${count}}=${answerLatex(pkg, reported)}$$`,
      };
    case "findCorrectValueFromAverageShift":
      return {
        step: `The total correction is the average shift multiplied by the count. $$\\Delta T=(${measuredLatex(pkg, corrected)}-${measuredLatex(pkg, reported)})\\times${count}=${measuredLatex(pkg, totalShift)},\\quad V_{\\text{correct}}=${addExpression(pkg, wrong, totalShift)}=${answerLatex(pkg, correct)}$$`,
        shortcut: `$$V_{\\text{correct}}=${mathNumber(pkg, wrong)}+(${mathNumber(pkg, corrected)}-${mathNumber(pkg, reported)})\\times${count}=${answerLatex(pkg, correct)}$$`,
      };
    case "findIncorrectValueFromCorrection":
      return {
        step: `The total correction equals the average shift multiplied by the count. $$\\Delta T=(${measuredLatex(pkg, corrected)}-${measuredLatex(pkg, reported)})\\times${count}=${measuredLatex(pkg, totalShift)},\\quad V_{\\text{wrong}}=${subtractExpression(pkg, correct, totalShift)}=${answerLatex(pkg, wrong)}$$`,
        shortcut: `$$V_{\\text{wrong}}=${mathNumber(pkg, correct)}-(${mathNumber(pkg, corrected)}-${mathNumber(pkg, reported)})\\times${count}=${answerLatex(pkg, wrong)}$$`,
      };
    case "findEntryDifferenceFromAverageCorrection": {
      const averageGap = Math.abs(corrected - reported);
      return {
        step: `The recording error alone caused the average shift. $$|V_{\\text{correct}}-V_{\\text{wrong}}|=${measuredLatex(pkg, averageGap)}\\times${count}=${answerLatex(pkg, difference)}$$`,
        shortcut: `$$|${mathNumber(pkg, corrected)}-${mathNumber(pkg, reported)}|\\times${count}=${answerLatex(pkg, difference)}$$`,
      };
    }
    case "findAverageChangeFromEntryCorrection":
      return {
        step: `The two recorded values differ by ${measuredLatex(pkg, difference)}. $$|\\Delta A|=\\frac{${measuredLatex(pkg, difference)}}{${count}}=${answerLatex(pkg, change)}$$`,
        shortcut: `$$|\\Delta A|=\\frac{|${mathNumber(pkg, correct)}-${mathNumber(pkg, wrong)}|}{${count}}=${answerLatex(pkg, change)}$$`,
      };
    case "findNumberOfItemsFromTotalCorrection":
      return {
        step: `The full recording error is ${measuredLatex(pkg, difference)}, and it changes the average by ${measuredLatex(pkg, change)}. $$N=\\frac{${measuredLatex(pkg, difference)}}{${measuredLatex(pkg, change)}}=${answerLatex(pkg, count)}$$`,
        shortcut: `$$N=\\frac{|${mathNumber(pkg, correct)}-${mathNumber(pkg, wrong)}|}{${mathNumber(pkg, change)}}=${answerLatex(pkg, count)}$$`,
      };
    case "findCorrectedAverageFromMultipleMistakes": {
      const netShift = net / count;
      return {
        step: `The two signed corrections are ${measuredLatex(pkg, delta)} and ${measuredLatex(pkg, delta2)}, giving a net correction of ${measuredLatex(pkg, net)}. $$\\Delta A=\\frac{${measuredLatex(pkg, net)}}{${count}}=${measuredLatex(pkg, netShift)},\\quad A_{\\text{correct}}=${addExpression(pkg, reported, netShift)}=${answerLatex(pkg, corrected)}$$`,
        shortcut: `$$(${mathNumber(pkg, correct)}-${mathNumber(pkg, wrong)})+(${mathNumber(pkg, correct2)}-${mathNumber(pkg, wrong2)})=${mathNumber(pkg, net)},\\quad ${mathNumber(pkg, reported)}+\\frac{${mathNumber(pkg, net)}}{${count}}=${answerLatex(pkg, corrected)}$$`,
      };
    }
    default:
      return {
        step: pkg.explanation.lines[1]?.replace(/^📝 Step-by-step solution:\s*/, "") ?? "",
        shortcut: pkg.explanation.lines[2]?.replace(/^⚡ Exam speed shortcut:\s*/, "") ?? "",
      };
  }
}

function displayBlocks(text: string) {
  return [...text.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((match) => match[1]!);
}

function mathJaxUnitsAreSafe(text: string) {
  return displayBlocks(text).every((block) => {
    const withoutText = block.replace(/\\text\{[^}]*\}/g, "");
    return !/₹|\b(?:marks?|years?|runs?|units?|kg)\b/.test(withoutText);
  });
}

function refreshValidation(pkg: Avg001QuestionPackage) {
  const replaced = new Set([
    "cp005-v2-unit-grammar",
    "cp005-v2-mathjax-units",
    "cp005-v2-numerical-shortcut",
    "cp005-v2-article-grammar",
  ]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !replaced.has(check.name));
  const text = `${pkg.stem}\n${pkg.options.join("\n")}\n${pkg.explanation.lines.join("\n")}`;
  const shortcut = pkg.explanation.lines[2] ?? "";
  checks.push(
    {
      name: "cp005-v2-unit-grammar",
      passed: !/\b1(?:\.0+)? (?:marks|years|runs|units)\b/.test(text) && !/\b1(?:\.0+)?\\text\{ (?:marks|years|runs|units)\}/.test(text),
      message: "Singular CP-005 quantities use singular unit nouns",
    },
    {
      name: "cp005-v2-mathjax-units",
      passed: mathJaxUnitsAreSafe(pkg.explanation.lines.join("\n")),
      message: "Units inside CP-005 display equations are wrapped in MathJax text blocks",
    },
    {
      name: "cp005-v2-numerical-shortcut",
      passed: shortcut.includes("$$") && (shortcut.match(/-?\d+(?:\.\d+)?/g)?.length ?? 0) >= 3 && !/Do not rebuild the full total|Combine positive and negative corrections before dividing|Average shift × count/.test(shortcut),
      message: "CP-005 shortcut uses the generated numerical values rather than repeated boilerplate",
    },
    {
      name: "cp005-v2-article-grammar",
      passed: !/\bA (?:inspection|average|organisation|employee|inning|age|audit|error)\b/.test(pkg.stem),
      message: "CP-005 stem uses the correct indefinite article",
    },
  );
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001Cp005EditorialV2ApprovedCandidate(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const candidate = applyAvg001Cp005EditorialV2FinalCandidate(pkg);
  if (candidate.canonicalProblemId !== "AVG-CP-005" || candidate.language !== "en") return candidate;

  const options = candidate.options.map(singularize);
  const answer = options[candidate.correctIndex]!;
  const working = numericalWorking(candidate);
  const revised: Avg001QuestionPackage = {
    ...candidate,
    stem: singularize(candidate.stem),
    options,
    answer,
    solver: { ...candidate.solver, answer },
    independentVerification: { ...candidate.independentVerification, displayAnswer: answer },
    explanation: {
      lines: [
        singularize(candidate.explanation.lines[0]!),
        `📝 Step-by-step solution: ${singularize(working.step)}`,
        `⚡ Exam speed shortcut: ${singularize(working.shortcut)}`,
        singularize(candidate.explanation.lines[3]!),
      ],
    },
    traceability: {
      ...candidate.traceability,
      cp005EditorialV2Approved: AVG_001_CP005_EDITORIAL_V2_APPROVED,
      cp005MathJaxUnitReview: true,
      cp005NumericalShortcutReview: true,
    },
  };
  return { ...revised, validation: refreshValidation(revised) };
}
