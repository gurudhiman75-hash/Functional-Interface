import type { Avg001QuestionPackage, Rational } from "./types";

type Language = "en" | "hi" | "pa";

function raw(value: unknown) {
  if (typeof value === "number" || typeof value === "string") return String(value);
  if (value && typeof value === "object" && "numerator" in value && "denominator" in value) {
    const rational = value as Rational;
    if (rational.denominator === 1) return String(rational.numerator);
    const decimal = rational.numerator / rational.denominator;
    return Number.isInteger(decimal * 10)
      ? decimal.toFixed(1)
      : `${rational.numerator}/${rational.denominator}`;
  }
  return "";
}

function shown(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  return rendered !== undefined && rendered !== ""
    ? String(rendered).replaceAll(",", "")
    : raw(pkg.parameters.values[key]);
}

function answerToken(pkg: Avg001QuestionPackage) {
  const match = String(pkg.answer)
    .replaceAll(",", "")
    .match(/-?\d+(?:\.\d+)?(?::-?\d+(?:\.\d+)?)?/);
  return match?.[0] ?? String(pkg.answer).replaceAll(",", "").trim();
}

function lineCalculatesAnswer(pkg: Avg001QuestionPackage, line: string) {
  const answer = answerToken(pkg);
  const compact = line.replaceAll(",", "").replaceAll(" ", "").replaceAll("₹", "");
  const marker = `=${answer}`;
  let index = compact.indexOf(marker);
  while (index >= 0) {
    const next = compact[index + marker.length] ?? "";
    if (!/[0-9.:]/.test(next)) return true;
    index = compact.indexOf(marker, index + 1);
  }
  return false;
}

function labels(language: Language) {
  if (language === "hi") {
    return {
      newAverage: "नया औसत",
      addedValue: "जोड़ा गया मान",
      removedValue: "हटाया गया मान",
      oldValue: "पुराना मान",
      newValue: "नया मान",
      requiredScore: "आवश्यक स्कोर",
    };
  }
  if (language === "pa") {
    return {
      newAverage: "ਨਵੀਂ ਔਸਤ",
      addedValue: "ਜੋੜਿਆ ਮੁੱਲ",
      removedValue: "ਹਟਾਇਆ ਮੁੱਲ",
      oldValue: "ਪੁਰਾਣਾ ਮੁੱਲ",
      newValue: "ਨਵਾਂ ਮੁੱਲ",
      requiredScore: "ਲੋੜੀਂਦਾ ਸਕੋਰ",
    };
  }
  return {
    newAverage: "New average",
    addedValue: "Added value",
    removedValue: "Removed value",
    oldValue: "Old value",
    newValue: "New value",
    requiredScore: "Required score",
  };
}

function decisiveLine(pkg: Avg001QuestionPackage) {
  const language: Language = pkg.language === "hi" || pkg.language === "pa" ? pkg.language : "en";
  const label = labels(language);
  const values = pkg.parameters.values;
  const currentTotal = raw(values.currentTotal ?? values.oldTotal ?? values.total);
  const newTotal = raw(values.newTotal);
  const oldCount = shown(pkg, "oldCount") || String(values.oldCount ?? values.count);
  const newCount = shown(pkg, "newCount") || String(values.newCount ?? values.count);
  const added = shown(pkg, "addedValue") || raw(values.addedValue);
  const removed = shown(pkg, "removedValue") || raw(values.removedValue);
  const oldValue = shown(pkg, "oldValue") || raw(values.oldValue);
  const newValue = shown(pkg, "newValue") || raw(values.newValue);
  const nextScore = shown(pkg, "nextScore") || raw(values.nextScore ?? values.addedValue);
  const answer = answerToken(pkg);

  switch (pkg.solveMode) {
    case "findNewAverageAfterAddition":
      return currentTotal && added && newCount
        ? `$$${label.newAverage}=(${currentTotal}+${added})\\div${newCount}=${answer}$$`
        : undefined;
    case "findNewAverageAfterRemoval":
      return currentTotal && removed && newCount
        ? `$$${label.newAverage}=(${currentTotal}-${removed})\\div${newCount}=${answer}$$`
        : undefined;
    case "findNewAverageAfterReplacement":
      return currentTotal && oldValue && newValue && oldCount
        ? `$$${label.newAverage}=(${currentTotal}-${oldValue}+${newValue})\\div${oldCount}=${answer}$$`
        : undefined;
    case "findAddedMemberValueFromShift":
      return currentTotal && newTotal
        ? `$$${label.addedValue}=${newTotal}-${currentTotal}=${answer}$$`
        : undefined;
    case "findRemovedMemberValueFromShift":
      return currentTotal && newTotal
        ? `$$${label.removedValue}=${currentTotal}-${newTotal}=${answer}$$`
        : undefined;
    case "findReplacementValueFromShift":
      if (!currentTotal || !newTotal) return undefined;
      return values.replacementTarget === "old"
        ? newValue
          ? `$$${label.oldValue}=${newValue}-(${newTotal}-${currentTotal})=${answer}$$`
          : undefined
        : oldValue
          ? `$$${label.newValue}=${oldValue}+(${newTotal}-${currentTotal})=${answer}$$`
          : undefined;
    case "findInningsValueOrNewCricketAverage":
      if (pkg.parameters.answerType === "AVERAGE") {
        return currentTotal && nextScore && newCount
          ? `$$${label.newAverage}=(${currentTotal}+${nextScore})\\div${newCount}=${answer}$$`
          : undefined;
      }
      return currentTotal && newTotal
        ? `$$${label.requiredScore}=${newTotal}-${currentTotal}=${answer}$$`
        : undefined;
    default:
      return undefined;
  }
}

export function applyAvg001Cp003ExplanationAnswerEvidence(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-003") return pkg;
  if (pkg.explanation.lines.some((line) => lineCalculatesAnswer(pkg, line))) return pkg;

  const evidence = decisiveLine(pkg);
  if (!evidence) return pkg;
  const lines = [...pkg.explanation.lines];
  lines.splice(Math.max(2, lines.length - 1), 0, evidence);
  while (lines.length > 8) {
    const removable = lines.findIndex((line, index) => index > 1 && index < lines.length - 2 && !/\$\$/.test(line));
    if (removable < 0) break;
    lines.splice(removable, 1);
  }

  return {
    ...pkg,
    explanation: { lines: lines.slice(0, 8) },
    traceability: {
      ...pkg.traceability,
      cp003DecisiveAnswerEvidence: "AVG-CP-003 exact displayed-answer equation v1",
    },
  };
}
