import questionLanguageLibrary from "./question-language.library.json" assert { type: "json" };
import { simplifySurd, formatSurd, formatFraction, formatSum, gcd } from "./formatter";

type Variables = Record<string, number | string>;

function getStem(cpId: string, qlId: string): string {
  const item = questionLanguageLibrary.items.find((entry) => entry.id === qlId);
  if (!item) {
    throw new Error(`Unknown question language id: ${qlId}`);
  }
  if (item.cpId !== cpId) {
    throw new Error(`Question language id ${qlId} belongs to ${item.cpId}, not ${cpId}`);
  }
  return item.stem;
}

function extractPlaceholders(stem: string): Set<string> {
  return new Set((stem.match(/\{\{\{([^}]+)\}\}\}/g) ?? []).map((match) => match.slice(3, -3)));
}

function inferRootIndex(stem: string): number {
  return stem.includes("\\sqrt[3]") ? 3 : 2;
}

function parseSigns(stem: string, termCount: number): number[] {
  if (termCount <= 0) {
    return [];
  }
  if (stem.includes("Subtract")) {
    return [1, -1];
  }
  const operators = stem.match(/[+-]/g) ?? [];
  const signs = [1];
  for (let index = 0; index < termCount - 1; index += 1) {
    signs.push(operators[index] === "-" ? -1 : 1);
  }
  return signs;
}

function renderOrderedTerms(
  values: Array<{ value: number; text: string }>,
  orderingDirection: string,
): string {
  const sorted = [...values].sort((left, right) => left.value - right.value);
  if (orderingDirection === "descending") {
    sorted.reverse();
  }
  return sorted.map((entry) => entry.text).join(", ");
}

function renderFractionWithNumeratorExpression(numerator: string, denominator: number): string {
  if (denominator === 1) {
    return numerator;
  }
  if (denominator === -1) {
    return numerator.startsWith("-") ? numerator.slice(1) : `-${numerator}`;
  }
  return `\\frac{${numerator}}{${denominator}}`;
}

function renderConstantAndSurd(constantTerm: number, surdCoefficient: number, surdRadicand: number): string {
  const terms: string[] = [];
  if (constantTerm !== 0) {
    terms.push(constantTerm.toString());
  }
  if (surdCoefficient !== 0) {
    terms.push(formatSurd(surdCoefficient, surdRadicand));
  }
  return formatSum(terms);
}

function solveCp02OrCp04(stem: string, variables: Variables): string {
  const placeholders = extractPlaceholders(stem);
  const rootIndex = inferRootIndex(stem);
  const terms: Array<{ coefficient: number; radicand: number }> = [];

  if (placeholders.has("commonRadicand")) {
    if (placeholders.has("leftCoefficient")) {
      terms.push({
        coefficient: Number(variables.leftCoefficient ?? 1),
        radicand: Number(variables.commonRadicand),
      });
    } else {
      terms.push({ coefficient: 1, radicand: Number(variables.commonRadicand) });
    }
  } else if (placeholders.has("minuendRadicand")) {
    terms.push({
      coefficient: Number(variables.leftCoefficient ?? 1),
      radicand: Number(variables.minuendRadicand),
    });
  } else if (placeholders.has("leftRadicand")) {
    terms.push({
      coefficient: Number(variables.leftCoefficient ?? 1),
      radicand: Number(variables.leftRadicand),
    });
  }

  if (placeholders.has("subtrahendRadicand")) {
    const secondCoefficient = Number(
      variables.commonCoefficient ?? variables.rightCoefficient ?? 1,
    );
    terms.push({
      coefficient: secondCoefficient,
      radicand: Number(variables.subtrahendRadicand),
    });
  } else if (placeholders.has("rightRadicand")) {
    terms.push({
      coefficient: Number(variables.rightCoefficient ?? 1),
      radicand: Number(variables.rightRadicand),
    });
  } else if (placeholders.has("rightCoefficient")) {
    terms.push({
      coefficient: Number(variables.rightCoefficient),
      radicand: Number(variables.commonRadicand),
    });
  }

  if (placeholders.has("additionalRadicand")) {
    terms.push({
      coefficient: Number(variables.additionalCoefficient ?? 1),
      radicand: Number(variables.additionalRadicand),
    });
  } else if (placeholders.has("subtrahendCoefficient")) {
    terms.push({
      coefficient: Number(variables.subtrahendCoefficient),
      radicand: Number(variables.commonRadicand),
    });
  } else if (placeholders.has("subtrahendRadicand") && stem.includes(" + \\sqrt")) {
    terms.push({ coefficient: 1, radicand: Number(variables.subtrahendRadicand) });
  }

  const signs = parseSigns(stem, terms.length);
  const collected = new Map<number, number>();
  let rational = 0;

  for (let index = 0; index < terms.length; index += 1) {
    const sign = signs[index] ?? 1;
    const simplified = simplifySurd(terms[index]!.radicand, rootIndex);
    const coefficient = sign * terms[index]!.coefficient * simplified.coeff;
    if (simplified.radicand === 1) {
      rational += coefficient;
    } else {
      collected.set(
        simplified.radicand,
        (collected.get(simplified.radicand) ?? 0) + coefficient,
      );
    }
  }

  const parts: string[] = [];
  if (rational !== 0) {
    parts.push(rational.toString());
  }
  for (const [radicand, coefficient] of [...collected.entries()].sort((left, right) => left[0] - right[0])) {
    if (coefficient !== 0) {
      parts.push(formatSurd(coefficient, radicand, rootIndex));
    }
  }
  return parts.length ? formatSum(parts) : "0";
}

function solveCp03(stem: string, variables: Variables): string {
  const rootIndex = inferRootIndex(stem);
  if (stem.includes("\\div") || stem.includes("\\frac") || stem.toLowerCase().includes("quotient")) {
    const numeratorRadicand = Number(variables.numeratorRadicand);
    const denominatorRadicand = Number(variables.denominatorRadicand);
    const quotient = numeratorRadicand / denominatorRadicand;
    const simplified = simplifySurd(quotient, rootIndex);
    return formatSurd(simplified.coeff, simplified.radicand, rootIndex);
  }

  const coefficient =
    Number(variables.leftCoefficient ?? 1) * Number(variables.rightCoefficient ?? 1);
  const radicand = Number(variables.leftRadicand) * Number(variables.rightRadicand);
  const simplified = simplifySurd(radicand, rootIndex);
  return formatSurd(coefficient * simplified.coeff, simplified.radicand, rootIndex);
}

function solveCp05(stem: string, variables: Variables): string {
  const placeholders = extractPlaceholders(stem);
  const values: Array<{ value: number; text: string }> = [];

  const pushValue = (coefficientKey: string | null, radicandKey: string) => {
    const coefficient = coefficientKey ? Number(variables[coefficientKey]) : 1;
    const radicand = Number(variables[radicandKey]);
    values.push({
      value: coefficient * Math.sqrt(radicand),
      text: coefficientKey ? formatSurd(coefficient, radicand) : formatSurd(1, radicand),
    });
  };

  pushValue(placeholders.has("leftCoefficient") ? "leftCoefficient" : null, "leftRadicand");
  pushValue(placeholders.has("rightCoefficient") ? "rightCoefficient" : null, "rightRadicand");
  if (placeholders.has("middleRadicand")) {
    pushValue(placeholders.has("middleCoefficient") ? "middleCoefficient" : null, "middleRadicand");
  }

  if (placeholders.has("orderingDirection")) {
    return renderOrderedTerms(values, String(variables.orderingDirection));
  }

  const sorted = [...values].sort((left, right) => left.value - right.value);
  const comparisonDirection = String(variables.comparisonDirection);
  if (comparisonDirection === "greater" || comparisonDirection === "largest") {
    return sorted[sorted.length - 1]!.text;
  }
  return sorted[0]!.text;
}

function solveCp06(stem: string, variables: Variables): string {
  const rootIndex = inferRootIndex(stem);
  const numerator = Number(variables.numerator ?? 1);
  const denominatorCoefficient = Number(variables.denominatorCoefficient ?? 1);
  const denominatorRadicand = Number(variables.denominatorRadicand);

  if (rootIndex === 3) {
    const simplified = simplifySurd(denominatorRadicand * denominatorRadicand, 3);
    return formatFraction(
      numerator * simplified.coeff,
      simplified.radicand,
      denominatorCoefficient * denominatorRadicand,
      3,
    );
  }

  return formatFraction(
    numerator,
    denominatorRadicand,
    denominatorCoefficient * denominatorRadicand,
  );
}

function solveCp07(stem: string, variables: Variables): string {
  const numerator = Number(variables.numerator ?? 1);

  if (stem.includes("constantTerm") || stem.includes("\\pm")) {
    const constantTerm = Number(variables.constantTerm);
    const denominatorRadicand = Number(variables.denominatorRadicand);
    const denominator = constantTerm * constantTerm - denominatorRadicand;
    const divisor = gcd(numerator, Math.abs(denominator));
    const scaledNumerator = numerator / divisor;
    const scaledDenominator = denominator / divisor;

    if (stem.includes("\\pm")) {
      const numeratorText =
        scaledNumerator === 1
          ? `${constantTerm} \\mp \\sqrt{${denominatorRadicand}}`
          : `${scaledNumerator}(${constantTerm} \\mp \\sqrt{${denominatorRadicand}})`;
      return renderFractionWithNumeratorExpression(numeratorText, scaledDenominator);
    }

    const conjugateSign = stem.includes(" - \\sqrt") ? "+" : "-";
    const numeratorText =
      scaledNumerator === 1
        ? `${constantTerm} ${conjugateSign} \\sqrt{${denominatorRadicand}}`
        : `${scaledNumerator}(${constantTerm} ${conjugateSign} \\sqrt{${denominatorRadicand}})`;
    return renderFractionWithNumeratorExpression(numeratorText, scaledDenominator);
  }

  const leftRadicand = Number(variables.leftRadicand);
  const rightRadicand = Number(variables.rightRadicand);
  const productSimplified = simplifySurd(leftRadicand * rightRadicand, 2);
  const denominator = leftRadicand - rightRadicand;

  if (stem.includes("\\frac{\\sqrt")) {
    if (stem.includes("+ \\sqrt") && stem.includes("}{\\sqrt") && stem.includes(" - \\sqrt")) {
      const numeratorText = renderConstantAndSurd(
        leftRadicand + rightRadicand,
        2 * productSimplified.coeff,
        productSimplified.radicand,
      );
      return renderFractionWithNumeratorExpression(numeratorText, denominator);
    }

    const numeratorText = renderConstantAndSurd(
      leftRadicand,
      -productSimplified.coeff,
      productSimplified.radicand,
    );
    return renderFractionWithNumeratorExpression(numeratorText, denominator);
  }

  const conjugateSign = stem.includes(" - \\sqrt") ? "+" : "-";
  const divisor = gcd(numerator, Math.abs(denominator));
  const scaledNumerator = numerator / divisor;
  const scaledDenominator = denominator / divisor;
  const numeratorText =
    scaledNumerator === 1
      ? `\\sqrt{${leftRadicand}} ${conjugateSign} \\sqrt{${rightRadicand}}`
      : `${scaledNumerator}(\\sqrt{${leftRadicand}} ${conjugateSign} \\sqrt{${rightRadicand}})`;
  return renderFractionWithNumeratorExpression(numeratorText, scaledDenominator);
}

function solveCp08(stem: string, variables: Variables): string {
  if (stem.includes("({{{constantTerm}}} + \\sqrt{{{radicand}}})^2")) {
    const constantTerm = Number(variables.constantTerm);
    const radicand = Number(variables.radicand);
    return renderConstantAndSurd(constantTerm * constantTerm + radicand, 2 * constantTerm, radicand);
  }

  if (stem.includes("(1 + \\sqrt")) {
    const radicand = Number(variables.radicand);
    return renderConstantAndSurd(1 + radicand, 2, radicand);
  }

  if (stem.includes("({{{constantTerm}}} + \\sqrt{{{radicand}}})({{{constantTerm}}} - \\sqrt{{{radicand}}})")) {
    const constantTerm = Number(variables.constantTerm);
    const radicand = Number(variables.radicand);
    return (constantTerm * constantTerm - radicand).toString();
  }

  if (stem.includes("({{{leftCoefficient}}}\\sqrt")) {
    const leftCoefficient = Number(variables.leftCoefficient);
    const rightCoefficient = Number(variables.rightCoefficient);
    const leftRadicand = Number(variables.leftRadicand);
    const rightRadicand = Number(variables.rightRadicand);
    const productSimplified = simplifySurd(leftRadicand * rightRadicand, 2);
    return renderConstantAndSurd(
      leftCoefficient * leftCoefficient * leftRadicand + rightCoefficient * rightCoefficient * rightRadicand,
      2 * leftCoefficient * rightCoefficient * productSimplified.coeff,
      productSimplified.radicand,
    );
  }

  if (stem.includes("(\\sqrt{{{leftRadicand}}} + \\sqrt{{{rightRadicand}}})^2")) {
    const leftRadicand = Number(variables.leftRadicand);
    const rightRadicand = Number(variables.rightRadicand);
    const productSimplified = simplifySurd(leftRadicand * rightRadicand, 2);
    return renderConstantAndSurd(
      leftRadicand + rightRadicand,
      2 * productSimplified.coeff,
      productSimplified.radicand,
    );
  }

  if (stem.includes("(\\sqrt{{{leftRadicand}}} - \\sqrt{{{rightRadicand}}})^2")) {
    const leftRadicand = Number(variables.leftRadicand);
    const rightRadicand = Number(variables.rightRadicand);
    const productSimplified = simplifySurd(leftRadicand * rightRadicand, 2);
    return renderConstantAndSurd(
      leftRadicand + rightRadicand,
      -2 * productSimplified.coeff,
      productSimplified.radicand,
    );
  }

  if (stem.includes("(\\sqrt{{{leftRadicand}}} + \\sqrt{{{rightRadicand}}})(\\sqrt{{{leftRadicand}}} - \\sqrt{{{rightRadicand}}})")) {
    return (Number(variables.leftRadicand) - Number(variables.rightRadicand)).toString();
  }

  return "0";
}

export function solve(question: { cpId: string; qlId: string; variables: Variables }): { answer: string } {
  const { cpId, qlId, variables } = question;
  const stem = getStem(cpId, qlId);

  if (cpId === "CP01") {
    const rootIndex = inferRootIndex(stem);
    const simplified = simplifySurd(Number(variables.radicand), rootIndex);
    return { answer: formatSurd(simplified.coeff, simplified.radicand, rootIndex) };
  }

  if (cpId === "CP02" || cpId === "CP04") {
    return { answer: solveCp02OrCp04(stem, variables) };
  }

  if (cpId === "CP03") {
    return { answer: solveCp03(stem, variables) };
  }

  if (cpId === "CP05") {
    return { answer: solveCp05(stem, variables) };
  }

  if (cpId === "CP06") {
    return { answer: solveCp06(stem, variables) };
  }

  if (cpId === "CP07") {
    return { answer: solveCp07(stem, variables) };
  }

  if (cpId === "CP08") {
    return { answer: solveCp08(stem, variables) };
  }

  return { answer: "0" };
}
