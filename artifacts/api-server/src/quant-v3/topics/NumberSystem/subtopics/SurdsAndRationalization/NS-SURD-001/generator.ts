import questionLanguageLibrary from "./question-language.library.json" assert { type: "json" };
import variableRangesLibrary from "./variable-ranges.library.json" assert { type: "json" };

type Variables = Record<string, number | string>;

type StemItem = (typeof questionLanguageLibrary.items)[number];

function getStemItem(cpId: string, qlId: string): StemItem {
  const item = questionLanguageLibrary.items.find((entry) => entry.id === qlId);
  if (!item) {
    throw new Error(`Unknown question language id: ${qlId}`);
  }
  if (item.cpId !== cpId) {
    throw new Error(`Question language id ${qlId} belongs to ${item.cpId}, not ${cpId}`);
  }
  return item;
}

function extractPlaceholders(stem: string): string[] {
  const matches = stem.match(/\{\{\{([^}]+)\}\}\}/g) ?? [];
  return matches.map((match) => match.slice(3, -3));
}

function normalizePlaceholderName(name: string): string {
  return name.replace(/^\{+/, "");
}

function addRenderAliases(stem: string, values: Variables): Variables {
  for (const placeholder of extractPlaceholders(stem)) {
    const normalized = normalizePlaceholderName(placeholder);
    if (placeholder !== normalized && values[placeholder] === undefined && values[normalized] !== undefined) {
      values[placeholder] = values[normalized];
    }
  }
  return values;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne<T>(values: readonly T[]): T {
  return values[randInt(0, values.length - 1)]!;
}

function parseDomain(domain: string): number[] | string[] {
  const inner = domain.trim().replace(/^\[/, "").replace(/\]$/, "");
  if (!inner) {
    return [];
  }
  return inner.split(",").map((part) => {
    const trimmed = part.trim();
    if (/^['"].*['"]$/.test(trimmed)) {
      return trimmed.slice(1, -1);
    }
    return Number(trimmed);
  });
}

function getDomainValues(cpId: string, variableName: string): number[] | string[] {
  const cp = variableRangesLibrary.cps[cpId as keyof typeof variableRangesLibrary.cps];
  if (!cp) {
    throw new Error(`Unknown CP in variable ranges: ${cpId}`);
  }
  const variable = cp.variables[variableName as keyof typeof cp.variables];
  if (!variable) {
    throw new Error(`Unknown variable ${variableName} for ${cpId}`);
  }
  return parseDomain(variable.domain);
}

function sampleNumber(cpId: string, variableName: string): number {
  const values = getDomainValues(cpId, variableName);
  if (!values.length || typeof values[0] !== "number") {
    throw new Error(`Numeric domain expected for ${cpId}.${variableName}`);
  }
  const numericValues = values as number[];
  if (numericValues.length === 2 && numericValues[0] < numericValues[1]) {
    return randInt(numericValues[0], numericValues[1]);
  }
  return pickOne(numericValues);
}

function getNumericBounds(cpId: string, variableName: string): [number, number] {
  const values = getDomainValues(cpId, variableName);
  if (!values.length || typeof values[0] !== "number") {
    throw new Error(`Numeric domain expected for ${cpId}.${variableName}`);
  }
  const numericValues = values as number[];
  if (numericValues.length === 2 && numericValues[0] < numericValues[1]) {
    return [numericValues[0], numericValues[1]];
  }
  return [Math.min(...numericValues), Math.max(...numericValues)];
}

function sampleString(cpId: string, variableName: string, allowed?: readonly string[]): string {
  const values = getDomainValues(cpId, variableName);
  if (!values.length || typeof values[0] !== "string") {
    throw new Error(`String domain expected for ${cpId}.${variableName}`);
  }
  const stringValues = (values as string[]).filter((value) => !allowed || allowed.includes(value));
  return pickOne(stringValues);
}

function isPerfectPower(value: number, index: number): boolean {
  if (index === 3) {
    const root = Math.round(Math.cbrt(value));
    return root ** 3 === value;
  }
  const root = Math.round(Math.sqrt(value));
  return root ** 2 === value;
}

function sampleResidual(index: number): number {
  const candidates = index === 3 ? [2, 3, 4, 5, 6, 7, 9, 10] : [2, 3, 5, 6, 7, 8, 10, 11];
  return pickOne(candidates.filter((value) => !isPerfectPower(value, index)));
}

function sampleNonPerfectNumber(cpId: string, variableName: string, index: number): number {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const value = sampleNumber(cpId, variableName);
    if (!isPerfectPower(value, index)) {
      return value;
    }
  }
  throw new Error(`Failed to sample non-perfect value for ${cpId}.${variableName}`);
}

function buildExtractableRadicand(cpId: string, variableName: string, index: number): number {
  const domain = getDomainValues(cpId, variableName) as number[];
  const [min, max] = domain.length === 2 ? domain : [Math.min(...domain), Math.max(...domain)];
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const factor = randInt(2, index === 3 ? 4 : 6);
    const residual = sampleResidual(index);
    const value = factor ** index * residual;
    if (value >= min && value <= max && !isPerfectPower(value, index)) {
      return value;
    }
  }
  throw new Error(`Failed to generate extractable radicand for ${cpId}.${variableName}`);
}

function inferRootIndex(stem: string): number {
  return stem.includes("\\sqrt[3]") ? 3 : 2;
}

function isDivisionStem(stem: string): boolean {
  return stem.includes("\\div") || stem.includes("\\frac") || stem.toLowerCase().includes("quotient");
}

function getDivisionRadicandPair(cpId: string, rootIndex: number): { numeratorRadicand: number; denominatorRadicand: number } {
  const [minNumerator, maxNumerator] = getNumericBounds(cpId, "numeratorRadicand");
  const [minDenominator, maxDenominator] = getNumericBounds(cpId, "denominatorRadicand");
  const pairs: Array<{ numeratorRadicand: number; denominatorRadicand: number }> = [];

  for (let denominator = minDenominator; denominator <= maxDenominator; denominator += 1) {
    if (isPerfectPower(denominator, rootIndex)) {
      continue;
    }
    for (let quotient = 2; denominator * quotient <= maxNumerator; quotient += 1) {
      if (isPerfectPower(quotient, rootIndex)) {
        continue;
      }
      const numerator = denominator * quotient;
      if (
        numerator >= minNumerator &&
        numerator <= maxNumerator &&
        !isPerfectPower(numerator, rootIndex)
      ) {
        pairs.push({ numeratorRadicand: numerator, denominatorRadicand: denominator });
      }
    }
  }

  if (!pairs.length) {
    throw new Error(`Failed to find bounded division radicand pair for ${cpId}`);
  }
  return pickOne(pairs);
}

function generateCp01(stem: string): Variables {
  const rootIndex = inferRootIndex(stem);
  return { radicand: buildExtractableRadicand("CP01", "radicand", rootIndex) };
}

function generateCp02(stem: string, placeholders: Set<string>): Variables {
  const rootIndex = inferRootIndex(stem);
  const values: Variables = {};
  const base = placeholders.has("commonRadicand")
    ? sampleNumber("CP02", "commonRadicand")
    : sampleResidual(rootIndex);

  if (placeholders.has("commonRadicand")) {
    values.commonRadicand = base;
  }
  if (placeholders.has("leftCoefficient")) {
    values.leftCoefficient = sampleNumber("CP02", "leftCoefficient");
  }
  if (placeholders.has("rightCoefficient")) {
    values.rightCoefficient = sampleNumber("CP02", "rightCoefficient");
  }
  if (placeholders.has("subtrahendCoefficient")) {
    values.subtrahendCoefficient = sampleNumber("CP02", "subtrahendCoefficient");
  }

  const termVariables = ["leftRadicand", "rightRadicand", "subtrahendRadicand"] as const;
  for (const variableName of termVariables) {
    if (placeholders.has(variableName)) {
      const factor = randInt(2, rootIndex === 3 ? 4 : 6);
      values[variableName] = base * factor ** rootIndex;
    }
  }
  return values;
}

function generateCp03(stem: string, placeholders: Set<string>): Variables {
  const rootIndex = inferRootIndex(stem);
  const values: Variables = {};

  if (isDivisionStem(stem)) {
    const pair = getDivisionRadicandPair("CP03", rootIndex);
    values.denominatorRadicand = pair.denominatorRadicand;
    values.numeratorRadicand = pair.numeratorRadicand;
    return values;
  }

  const leftBase = sampleResidual(rootIndex);
  const rightBase = sampleResidual(rootIndex);
  values.leftRadicand = leftBase * randInt(2, rootIndex === 3 ? 3 : 4) ** rootIndex;
  values.rightRadicand = rightBase * randInt(2, rootIndex === 3 ? 3 : 4) ** rootIndex;
  if (placeholders.has("leftCoefficient")) {
    values.leftCoefficient = sampleNumber("CP03", "leftCoefficient");
  }
  if (placeholders.has("rightCoefficient")) {
    values.rightCoefficient = sampleNumber("CP03", "rightCoefficient");
  }
  return values;
}

function generateCp04(placeholders: Set<string>): Variables {
  const values: Variables = {};
  const base = sampleResidual(2);
  const radicandVariables = ["commonRadicand", "minuendRadicand", "subtrahendRadicand", "additionalRadicand"] as const;
  for (const variableName of radicandVariables) {
    if (placeholders.has(variableName)) {
      values[variableName] = base * randInt(2, 5) ** 2;
    }
  }
  const coefficientVariables = ["commonCoefficient", "leftCoefficient", "rightCoefficient", "additionalCoefficient"] as const;
  for (const variableName of coefficientVariables) {
    if (placeholders.has(variableName)) {
      values[variableName] = sampleNumber("CP04", variableName);
    }
  }
  return values;
}

function generateCp05(stem: string, placeholders: Set<string>): Variables {
  const values: Variables = {};
  const usesCoefficients =
    placeholders.has("leftCoefficient") ||
    placeholders.has("middleCoefficient") ||
    placeholders.has("rightCoefficient");
  const needThreeValues = placeholders.has("middleRadicand");

  if (placeholders.has("comparisonDirection")) {
    const allowed = needThreeValues ? ["largest", "smallest"] : ["greater", "smaller"];
    values.comparisonDirection = sampleString("CP05", "comparisonDirection", allowed);
  }
  if (placeholders.has("orderingDirection")) {
    values.orderingDirection = sampleString("CP05", "orderingDirection", ["ascending", "descending"]);
  }

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const leftRadicand = sampleNonPerfectNumber("CP05", "leftRadicand", 2);
    const rightRadicand = sampleNonPerfectNumber("CP05", "rightRadicand", 2);
    const middleRadicand = needThreeValues
      ? sampleNonPerfectNumber("CP05", "middleRadicand", 2)
      : undefined;
    const leftCoefficient = usesCoefficients ? sampleNumber("CP05", "leftCoefficient") : 1;
    const rightCoefficient = usesCoefficients ? sampleNumber("CP05", "rightCoefficient") : 1;
    const middleCoefficient = usesCoefficients && needThreeValues ? sampleNumber("CP05", "middleCoefficient") : 1;

    const valuesToCompare = [
      leftCoefficient * Math.sqrt(leftRadicand),
      rightCoefficient * Math.sqrt(rightRadicand),
    ];
    if (needThreeValues && middleRadicand !== undefined) {
      valuesToCompare.push(middleCoefficient * Math.sqrt(middleRadicand));
    }
    const unique = new Set(valuesToCompare.map((value) => value.toFixed(12)));
    if (unique.size !== valuesToCompare.length) {
      continue;
    }

    values.leftRadicand = leftRadicand;
    values.rightRadicand = rightRadicand;
    if (needThreeValues && middleRadicand !== undefined) {
      values.middleRadicand = middleRadicand;
    }
    if (usesCoefficients) {
      values.leftCoefficient = leftCoefficient;
      values.rightCoefficient = rightCoefficient;
      if (needThreeValues) {
        values.middleCoefficient = middleCoefficient;
      }
    }
    return values;
  }

  throw new Error("Failed to generate distinct comparison values for CP05");
}

function generateCp06(stem: string, placeholders: Set<string>): Variables {
  const values: Variables = {};
  const rootIndex = inferRootIndex(stem);
  values.denominatorRadicand = sampleResidual(rootIndex);
  if (placeholders.has("numerator")) {
    values.numerator = sampleNumber("CP06", "numerator");
  }
  if (placeholders.has("denominatorCoefficient")) {
    values.denominatorCoefficient = sampleNumber("CP06", "denominatorCoefficient");
  }
  return values;
}

function generateCp07(stem: string, placeholders: Set<string>): Variables {
  const values: Variables = {};
  if (placeholders.has("numerator")) {
    values.numerator = sampleNumber("CP07", "numerator");
  }
  if (placeholders.has("constantTerm")) {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const constantTerm = sampleNumber("CP07", "constantTerm");
      const denominatorRadicand = sampleNonPerfectNumber("CP07", "denominatorRadicand", 2);
      if (constantTerm * constantTerm !== denominatorRadicand) {
        values.constantTerm = constantTerm;
        values.denominatorRadicand = denominatorRadicand;
        return values;
      }
    }
    throw new Error("Failed to generate valid constant/surd denominator for CP07");
  }

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const leftRadicand = sampleNonPerfectNumber("CP07", "leftRadicand", 2);
    const rightRadicand = sampleNonPerfectNumber("CP07", "rightRadicand", 2);
    if (leftRadicand !== rightRadicand) {
      values.leftRadicand = leftRadicand;
      values.rightRadicand = rightRadicand;
      return values;
    }
  }
  throw new Error("Failed to generate distinct surd denominator terms for CP07");
}

function generateCp08(stem: string, placeholders: Set<string>): Variables {
  const values: Variables = {};
  if (placeholders.has("constantTerm")) {
    values.constantTerm = sampleNumber("CP08", "constantTerm");
  }
  if (placeholders.has("radicand")) {
    values.radicand = sampleNonPerfectNumber("CP08", "radicand", 2);
  }
  if (placeholders.has("leftRadicand")) {
    values.leftRadicand = sampleNonPerfectNumber("CP08", "leftRadicand", 2);
  }
  if (placeholders.has("rightRadicand")) {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const rightRadicand = sampleNonPerfectNumber("CP08", "rightRadicand", 2);
      if (!placeholders.has("leftRadicand") || rightRadicand !== values.leftRadicand) {
        values.rightRadicand = rightRadicand;
        break;
      }
    }
  }
  if (placeholders.has("leftCoefficient")) {
    values.leftCoefficient = sampleNumber("CP08", "leftCoefficient");
  }
  if (placeholders.has("rightCoefficient")) {
    values.rightCoefficient = sampleNumber("CP08", "rightCoefficient");
  }
  return values;
}

export function generate(cpId: string, qlId: string): Variables {
  const stemItem = getStemItem(cpId, qlId);
  const stem = stemItem.stem;
  const placeholders = new Set(extractPlaceholders(stem).map(normalizePlaceholderName));
  let values: Variables;

  if (cpId === "CP01") {
    values = generateCp01(stem);
    return addRenderAliases(stem, values);
  }
  if (cpId === "CP02") {
    values = generateCp02(stem, placeholders);
    return addRenderAliases(stem, values);
  }
  if (cpId === "CP03") {
    values = generateCp03(stem, placeholders);
    return addRenderAliases(stem, values);
  }
  if (cpId === "CP04") {
    values = generateCp04(placeholders);
    return addRenderAliases(stem, values);
  }
  if (cpId === "CP05") {
    values = generateCp05(stem, placeholders);
    return addRenderAliases(stem, values);
  }
  if (cpId === "CP06") {
    values = generateCp06(stem, placeholders);
    return addRenderAliases(stem, values);
  }
  if (cpId === "CP07") {
    values = generateCp07(stem, placeholders);
    return addRenderAliases(stem, values);
  }
  if (cpId === "CP08") {
    values = generateCp08(stem, placeholders);
    return addRenderAliases(stem, values);
  }

  return {};
}
