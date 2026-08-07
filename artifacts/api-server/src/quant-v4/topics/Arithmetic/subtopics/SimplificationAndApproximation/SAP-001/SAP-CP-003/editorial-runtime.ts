import {
  type Rat,
  add,
  divide,
  equalRat,
  formatPercentLiteral,
  formatRat,
  formatTerminatingDecimal,
  isTerminating,
  multiply,
  parseNumericLiteral,
  parseRecurringDecimal,
  rat,
  subtract,
} from "./exact";
import { generateSapCp003Package as generateBasePackage, SAP_CP003_RUNTIME_STATE } from "./runtime";
import { SAP_CP003_PROTOTYPE_IDS, type SapCp003AnswerSemantic, type SapCp003Option, type SapCp003Package, type SapCp003PrototypeId } from "./types";

interface WrongDisplay {
  readonly value: string;
  readonly misconceptionId: string;
  readonly analysis: string;
}

function absRat(value: Rat): Rat {
  return rat(value.n < 0n ? -value.n : value.n, value.d);
}

function display(value: Rat, semantic: SapCp003AnswerSemantic): string {
  switch (semantic) {
    case "TERMINATING_DECIMAL":
    case "MISSING_DECIMAL":
    case "OPTION_VALUE":
      return formatTerminatingDecimal(value);
    case "SIMPLIFIED_RATIONAL":
      return formatRat(value);
    case "INTEGER":
      return value.d === 1n ? formatRat(value) : formatTerminatingDecimal(value);
    case "PERCENTAGE_LITERAL":
    case "MISSING_PERCENTAGE":
      return formatPercentLiteral(value);
    default:
      throw new Error(`Cannot format non-numeric semantic ${semantic}.`);
  }
}

function wrongDisplay(value: Rat, semantic: SapCp003AnswerSemantic, misconceptionId: string, analysis: string): WrongDisplay {
  return Object.freeze({ value: display(value, semantic), misconceptionId, analysis });
}

function orderedOptions(pkg: SapCp003Package, candidates: readonly WrongDisplay[]): readonly SapCp003Option[] {
  const correct = pkg.options[pkg.correctIndex]!;
  const unique: WrongDisplay[] = [];
  const used = new Set<string>([pkg.canonicalAnswer]);
  for (const candidate of candidates) {
    if (used.has(candidate.value)) continue;
    const candidateRat = parseNumericLiteral(candidate.value);
    const answerRat = parseNumericLiteral(pkg.canonicalAnswer);
    if (candidateRat && answerRat && equalRat(candidateRat, answerRat)) continue;
    used.add(candidate.value);
    unique.push(candidate);
    if (unique.length === 3) break;
  }
  if (unique.length !== 3) return pkg.options;
  const options: SapCp003Option[] = [];
  let cursor = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === pkg.correctIndex) {
      options.push(Object.freeze({ ...correct, displayIndex: index + 1 }));
    } else {
      const candidate = unique[cursor++]!;
      options.push(Object.freeze({
        displayIndex: index + 1,
        value: candidate.value,
        isCorrect: false,
        misconceptionId: candidate.misconceptionId,
        analysis: candidate.analysis,
      }));
    }
  }
  return Object.freeze(options);
}

function percentageFactorOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+([\d.]+%)\s+×\s+(\d+)/);
  if (!match) return pkg.options;
  const percent = parseNumericLiteral(match[1]!)!;
  const quantity = rat(BigInt(match[2]!));
  const correct = parseNumericLiteral(pkg.canonicalAnswer)!;
  const complement = multiply(absRat(subtract(rat(1n), percent)), quantity);
  const increaseInterpretation = add(quantity, correct);
  return orderedOptions(pkg, [
    wrongDisplay(complement, pkg.answerSemantic, "COMPLEMENTARY_PERCENT_USED", "The complementary percentage was applied instead of the displayed percentage."),
    wrongDisplay(increaseInterpretation, pkg.answerSemantic, "PERCENT_FACTOR_READ_AS_INCREASE", "The percentage product was added to the original quantity as though the question asked for an increase."),
    wrongDisplay(multiply(correct, rat(10n)), pkg.answerSemantic, "PERCENT_DECIMAL_SHIFT_ONE_PLACE", "The percentage factor was divided by 10 instead of by 100."),
  ]);
}

function mixedRepresentationOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+([\d.]+%) of (\d+) ([+−]) (\d+\/\d+) × ([\d.]+)/);
  if (!match) return pkg.options;
  const first = multiply(parseNumericLiteral(match[1]!)!, rat(BigInt(match[2]!)));
  const sign = match[3]!;
  const fraction = parseNumericLiteral(match[4]!)!;
  const decimal = parseNumericLiteral(match[5]!)!;
  const combine = (second: Rat): Rat => sign === "+" ? add(first, second) : subtract(first, second);
  return orderedOptions(pkg, [
    wrongDisplay(combine(add(fraction, decimal)), pkg.answerSemantic, "FRACTION_AND_DECIMAL_ADDED", "The fraction and decimal were added instead of multiplied."),
    wrongDisplay(combine(fraction), pkg.answerSemantic, "DECIMAL_FACTOR_OMITTED", "The decimal factor was omitted from the second term."),
    wrongDisplay(combine(decimal), pkg.answerSemantic, "FRACTION_FACTOR_OMITTED", "The fractional factor was omitted from the second term."),
  ]);
}

function decimalConversionOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+(\d+\/\d+) \+ ([\d.]+%) \+ ([\d.]+)/);
  if (!match) return pkg.options;
  const fraction = parseNumericLiteral(match[1]!)!;
  const percent = parseNumericLiteral(match[2]!)!;
  const decimal = parseNumericLiteral(match[3]!)!;
  return orderedOptions(pkg, [
    wrongDisplay(add(fraction, decimal), pkg.answerSemantic, "PERCENTAGE_TERM_OMITTED", "The percentage term was omitted after the representation switch."),
    wrongDisplay(add(percent, decimal), pkg.answerSemantic, "FRACTION_TERM_OMITTED", "The fraction term was omitted after the representation switch."),
    wrongDisplay(add(fraction, percent), pkg.answerSemantic, "DECIMAL_TERM_OMITTED", "The final decimal term was omitted."),
  ]);
}

function benchmarkOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+([\d.]+) × (\d+) \+ (\d+\/\d+) × (\d+)/);
  if (!match) return pkg.options;
  const firstFactor = parseNumericLiteral(match[1]!)!;
  const firstMultiplier = rat(BigInt(match[2]!));
  const secondFactor = parseNumericLiteral(match[3]!)!;
  const secondMultiplier = rat(BigInt(match[4]!));
  const firstProduct = multiply(firstFactor, firstMultiplier);
  const secondProduct = multiply(secondFactor, secondMultiplier);
  return orderedOptions(pkg, [
    wrongDisplay(add(firstMultiplier, secondMultiplier), pkg.answerSemantic, "EQUIVALENCE_FACTORS_IGNORED", "The two integer multipliers were added without applying their fraction-decimal factors."),
    wrongDisplay(add(firstProduct, secondMultiplier), pkg.answerSemantic, "SECOND_EQUIVALENCE_FACTOR_OMITTED", "The second multiplier was used without its fractional factor."),
    wrongDisplay(add(firstMultiplier, secondProduct), pkg.answerSemantic, "FIRST_EQUIVALENCE_FACTOR_OMITTED", "The first multiplier was used without its decimal factor."),
  ]);
}

function recurringOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+(\d+\.\d*\(\d+\)) ([+−]) (\d+\/\d+)/);
  if (!match) return pkg.options;
  const recurring = parseRecurringDecimal(match[1]!)!;
  const finiteReading = parseNumericLiteral(match[1]!.replace(/[()]/g, ""))!;
  const fraction = parseNumericLiteral(match[3]!)!;
  const combine = (left: Rat): Rat => match[2] === "+" ? add(left, fraction) : subtract(left, fraction);
  const reciprocal = divide(rat(1n), recurring);
  return orderedOptions(pkg, [
    wrongDisplay(combine(finiteReading), pkg.answerSemantic, "RECURRING_BLOCK_READ_AS_FINITE", "The recurring block was read once as an ordinary finite decimal."),
    wrongDisplay(combine(reciprocal), pkg.answerSemantic, "RECURRING_VALUE_REPLACED_BY_RECIPROCAL", "The reciprocal of the recurring decimal's exact fraction was used."),
    wrongDisplay(rat(-parseNumericLiteral(pkg.canonicalAnswer)!.n, parseNumericLiteral(pkg.canonicalAnswer)!.d), pkg.answerSemantic, "FINAL_SIGN_REVERSED", "The exact magnitude was retained with the opposite sign."),
  ]);
}

function complementaryOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+([\d.]+%) of (\d+) \+ ([\d.]+%) of \2/);
  if (!match) return pkg.options;
  const first = parseNumericLiteral(match[1]!)!;
  const second = parseNumericLiteral(match[3]!)!;
  const quantity = rat(BigInt(match[2]!));
  return orderedOptions(pkg, [
    wrongDisplay(multiply(first, quantity), pkg.answerSemantic, "SECOND_COMPLEMENTARY_TERM_OMITTED", "Only the first percentage contribution was used."),
    wrongDisplay(multiply(absRat(subtract(first, second)), quantity), pkg.answerSemantic, "COMPLEMENTARY_PERCENTAGES_SUBTRACTED", "The complementary percentage contributions were subtracted instead of added."),
    wrongDisplay(multiply(quantity, rat(2n)), pkg.answerSemantic, "COMMON_QUANTITY_COUNTED_TWICE", "The shared quantity was counted once for each percentage after the factors had already been combined."),
  ]);
}

function successiveOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+([\d.]+%) × ([\d.]+%) × (\d+)/);
  if (!match) return pkg.options;
  const first = parseNumericLiteral(match[1]!)!;
  const second = parseNumericLiteral(match[2]!)!;
  const quantity = rat(BigInt(match[3]!));
  return orderedOptions(pkg, [
    wrongDisplay(multiply(add(first, second), quantity), pkg.answerSemantic, "PERCENT_FACTORS_ADDED", "The percentage factors were added instead of multiplied."),
    wrongDisplay(multiply(subtract(add(first, second), rat(1n)), quantity), pkg.answerSemantic, "PERCENT_CHANGES_COMBINED_ADDITIVELY", "The factors were treated as additive percentage changes rather than successive multipliers."),
    wrongDisplay(multiply(parseNumericLiteral(pkg.canonicalAnswer)!, rat(10n)), pkg.answerSemantic, "FINAL_DECIMAL_SHIFT_ONE_PLACE", "The final decimal point was placed one position too far to the right."),
  ]);
}

function missingPercentageOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const correct = parseNumericLiteral(pkg.canonicalAnswer)!;
  const complement = absRat(subtract(rat(1n), correct));
  return orderedOptions(pkg, [
    wrongDisplay(divide(correct, rat(10n)), pkg.answerSemantic, "PERCENT_DECIMAL_SHIFT_LEFT", "The percentage was made ten times too small."),
    wrongDisplay(complement, pkg.answerSemantic, "COMPLEMENTARY_PERCENTAGE_SELECTED", "The complement to 100% was selected instead of the isolated percentage."),
    wrongDisplay(add(correct, rat(1n, 10n)), pkg.answerSemantic, "TEN_PERCENTAGE_POINTS_ADDED", "Ten percentage points were added to the isolated result."),
  ]);
}

function remediate(pkg: SapCp003Package): SapCp003Package {
  let options = pkg.options;
  switch (pkg.prototypeId) {
    case "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR": options = percentageFactorOptions(pkg); break;
    case "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL": options = mixedRepresentationOptions(pkg); break;
    case "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS": options = decimalConversionOptions(pkg); break;
    case "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE": options = benchmarkOptions(pkg); break;
    case "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION": options = recurringOptions(pkg); break;
    case "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION": options = complementaryOptions(pkg); break;
    case "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS": options = successiveOptions(pkg); break;
    case "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL": options = missingPercentageOptions(pkg); break;
  }
  const stem = pkg.prototypeId === "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP"
    ? pkg.stem.replace(/ (Which is the first incorrect step\?)/, "\n$1")
    : pkg.stem;
  const optionUniquenessPassed = new Set(options.map((option) => option.value)).size === 4;
  const singleCorrectOptionPassed = options.filter((option) => option.isCorrect).length === 1;
  const answerBindingPassed = options[pkg.correctIndex]?.isCorrect === true && options[pkg.correctIndex]?.value === pkg.canonicalAnswer;
  const surfaceSyntaxPassed = !/undefined|NaN|Evaluate\s+\*|\?\s*\./i.test([stem, ...options.map((option) => option.value)].join(" "));
  const errors = pkg.validation.errors.filter((error) => !/option|surface/i.test(error));
  if (!optionUniquenessPassed) errors.push("The four visible options are not unique.");
  if (!singleCorrectOptionPassed) errors.push("Exactly one option must be marked correct.");
  if (!answerBindingPassed) errors.push("The answer is not bound to the correct visible option.");
  if (!surfaceSyntaxPassed) errors.push("Student-facing text contains a malformed token.");
  return Object.freeze({
    ...pkg,
    stem,
    options,
    validation: Object.freeze({
      ...pkg.validation,
      ok: errors.length === 0,
      errors: Object.freeze(errors),
      optionUniquenessPassed,
      singleCorrectOptionPassed,
      answerBindingPassed,
      surfaceSyntaxPassed,
    }),
  });
}

export function generateSapCp003Package(prototypeId: SapCp003PrototypeId, seed: number): SapCp003Package {
  return remediate(generateBasePackage(prototypeId, seed));
}

export function generateSapCp003Sweep(seedsPerPrototype: number): readonly SapCp003Package[] {
  const packages: SapCp003Package[] = [];
  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp003Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}

export { SAP_CP003_RUNTIME_STATE };
