import {
  type Rat,
  add,
  divide,
  equalRat,
  formatPercentLiteral,
  formatRat,
  formatTerminatingDecimal,
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

function exact(text: string | undefined): Rat | null {
  return text ? parseNumericLiteral(text) : null;
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
  const answerRat = exact(pkg.canonicalAnswer);
  const unique: WrongDisplay[] = [];
  const used = new Set<string>([pkg.canonicalAnswer]);
  for (const candidate of candidates) {
    if (used.has(candidate.value)) continue;
    const candidateRat = exact(candidate.value);
    if (candidateRat && answerRat && equalRat(candidateRat, answerRat)) continue;
    used.add(candidate.value);
    unique.push(candidate);
    if (unique.length === 3) break;
  }
  if (unique.length !== 3) return pkg.options;
  const output: SapCp003Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === pkg.correctIndex) {
      output.push(Object.freeze({ ...pkg.options[index]!, displayIndex: index + 1 }));
    } else {
      const candidate = unique[wrongIndex++]!;
      output.push(Object.freeze({
        displayIndex: index + 1,
        value: candidate.value,
        isCorrect: false,
        misconceptionId: candidate.misconceptionId,
        analysis: candidate.analysis,
      }));
    }
  }
  return Object.freeze(output);
}

function percentageFactorOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+(\d+(?:\.\d+)?%)\s+×\s+(\d+)/);
  const percent = exact(match?.[1]);
  const quantity = match?.[2] ? rat(BigInt(match[2])) : null;
  const correct = exact(pkg.canonicalAnswer);
  if (!percent || !quantity || !correct) return pkg.options;
  return orderedOptions(pkg, [
    wrongDisplay(multiply(absRat(subtract(rat(1n), percent)), quantity), pkg.answerSemantic, "COMPLEMENTARY_PERCENT_USED", "The complementary percentage was applied instead of the displayed percentage."),
    wrongDisplay(add(quantity, correct), pkg.answerSemantic, "PERCENT_FACTOR_READ_AS_INCREASE", "The percentage result was added to the original quantity as though an increase had been requested."),
    wrongDisplay(multiply(correct, rat(10n)), pkg.answerSemantic, "PERCENT_DECIMAL_SHIFT_ONE_PLACE", "The percentage factor was divided by 10 instead of by 100."),
  ]);
}

function mixedRepresentationOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+(\d+(?:\.\d+)?%) of (\d+) ([+−]) (\d+\/\d+) × (\d+(?:\.\d+)?)/);
  const percent = exact(match?.[1]);
  const quantity = match?.[2] ? rat(BigInt(match[2])) : null;
  const fraction = exact(match?.[4]);
  const decimal = exact(match?.[5]);
  if (!match || !percent || !quantity || !fraction || !decimal) return pkg.options;
  const first = multiply(percent, quantity);
  const combine = (second: Rat): Rat => match[3] === "+" ? add(first, second) : subtract(first, second);
  return orderedOptions(pkg, [
    wrongDisplay(combine(add(fraction, decimal)), pkg.answerSemantic, "FRACTION_AND_DECIMAL_ADDED", "The fraction and decimal were added instead of multiplied."),
    wrongDisplay(combine(fraction), pkg.answerSemantic, "DECIMAL_FACTOR_OMITTED", "The decimal factor was omitted from the second term."),
    wrongDisplay(combine(decimal), pkg.answerSemantic, "FRACTION_FACTOR_OMITTED", "The fractional factor was omitted from the second term."),
  ]);
}

function decimalConversionOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+(\d+\/\d+) \+ (\d+(?:\.\d+)?%) \+ (\d+(?:\.\d+)?)/);
  const fraction = exact(match?.[1]);
  const percent = exact(match?.[2]);
  const decimal = exact(match?.[3]);
  if (!fraction || !percent || !decimal) return pkg.options;
  return orderedOptions(pkg, [
    wrongDisplay(add(fraction, decimal), pkg.answerSemantic, "PERCENTAGE_TERM_OMITTED", "The percentage term was omitted after conversion."),
    wrongDisplay(add(percent, decimal), pkg.answerSemantic, "FRACTION_TERM_OMITTED", "The fraction term was omitted after conversion."),
    wrongDisplay(add(fraction, percent), pkg.answerSemantic, "DECIMAL_TERM_OMITTED", "The final decimal term was omitted."),
  ]);
}

function benchmarkOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+(\d+(?:\.\d+)?) × (\d+) \+ (\d+\/\d+) × (\d+)/);
  const firstFactor = exact(match?.[1]);
  const firstMultiplier = match?.[2] ? rat(BigInt(match[2])) : null;
  const secondFactor = exact(match?.[3]);
  const secondMultiplier = match?.[4] ? rat(BigInt(match[4])) : null;
  if (!firstFactor || !firstMultiplier || !secondFactor || !secondMultiplier) return pkg.options;
  const firstProduct = multiply(firstFactor, firstMultiplier);
  const secondProduct = multiply(secondFactor, secondMultiplier);
  return orderedOptions(pkg, [
    wrongDisplay(add(firstMultiplier, secondMultiplier), pkg.answerSemantic, "EQUIVALENCE_FACTORS_IGNORED", "The integer multipliers were added without applying their fraction-decimal factors."),
    wrongDisplay(add(firstProduct, secondMultiplier), pkg.answerSemantic, "SECOND_EQUIVALENCE_FACTOR_OMITTED", "The second multiplier was used without its fractional factor."),
    wrongDisplay(add(firstMultiplier, secondProduct), pkg.answerSemantic, "FIRST_EQUIVALENCE_FACTOR_OMITTED", "The first multiplier was used without its decimal factor."),
  ]);
}

function recurringOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+(\d+\.\d*\(\d+\)) ([+−]) (\d+\/\d+)/);
  const recurring = match?.[1] ? parseRecurringDecimal(match[1]) : null;
  const finiteReading = exact(match?.[1]?.replace(/[()]/g, ""));
  const fraction = exact(match?.[3]);
  const answer = exact(pkg.canonicalAnswer);
  if (!match || !recurring || !finiteReading || !fraction || !answer) return pkg.options;
  const combine = (left: Rat): Rat => match[2] === "+" ? add(left, fraction) : subtract(left, fraction);
  const opposite = match[2] === "+" ? subtract(recurring, fraction) : add(recurring, fraction);
  return orderedOptions(pkg, [
    wrongDisplay(combine(finiteReading), pkg.answerSemantic, "RECURRING_BLOCK_READ_AS_FINITE", "The recurring block was read once as an ordinary finite decimal."),
    wrongDisplay(combine(divide(rat(1n), recurring)), pkg.answerSemantic, "RECURRING_VALUE_REPLACED_BY_RECIPROCAL", "The reciprocal of the recurring decimal's exact fraction was used."),
    wrongDisplay(opposite, pkg.answerSemantic, "VISIBLE_OPERATION_REVERSED", "The visible addition or subtraction sign was reversed."),
    wrongDisplay(rat(-answer.n, answer.d), pkg.answerSemantic, "FINAL_SIGN_REVERSED", "The exact magnitude was retained with the opposite sign."),
  ]);
}

function complementaryOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+(\d+(?:\.\d+)?%) of (\d+) \+ (\d+(?:\.\d+)?%) of \2/);
  const first = exact(match?.[1]);
  const quantity = match?.[2] ? rat(BigInt(match[2])) : null;
  const second = exact(match?.[3]);
  if (!first || !second || !quantity) return pkg.options;
  return orderedOptions(pkg, [
    wrongDisplay(multiply(first, quantity), pkg.answerSemantic, "SECOND_COMPLEMENTARY_TERM_OMITTED", "Only the first percentage contribution was used."),
    wrongDisplay(multiply(absRat(subtract(first, second)), quantity), pkg.answerSemantic, "COMPLEMENTARY_PERCENTAGES_SUBTRACTED", "The complementary percentage contributions were subtracted instead of added."),
    wrongDisplay(multiply(quantity, rat(2n)), pkg.answerSemantic, "COMMON_QUANTITY_COUNTED_TWICE", "The shared quantity was counted twice after the percentage factors had already been combined."),
  ]);
}

function successiveOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const match = pkg.stem.match(/Evaluate\s+(\d+(?:\.\d+)?%) × (\d+(?:\.\d+)?%) × (\d+)/);
  const first = exact(match?.[1]);
  const second = exact(match?.[2]);
  const quantity = match?.[3] ? rat(BigInt(match[3])) : null;
  const answer = exact(pkg.canonicalAnswer);
  if (!first || !second || !quantity || !answer) return pkg.options;
  return orderedOptions(pkg, [
    wrongDisplay(multiply(add(first, second), quantity), pkg.answerSemantic, "PERCENT_FACTORS_ADDED", "The percentage factors were added instead of multiplied."),
    wrongDisplay(multiply(subtract(add(first, second), rat(1n)), quantity), pkg.answerSemantic, "PERCENT_CHANGES_COMBINED_ADDITIVELY", "The factors were treated as additive percentage changes rather than successive multipliers."),
    wrongDisplay(multiply(answer, rat(10n)), pkg.answerSemantic, "FINAL_DECIMAL_SHIFT_ONE_PLACE", "The final decimal point was placed one position too far to the right."),
  ]);
}

function missingPercentageOptions(pkg: SapCp003Package): readonly SapCp003Option[] {
  const correct = exact(pkg.canonicalAnswer);
  if (!correct) return pkg.options;
  return orderedOptions(pkg, [
    wrongDisplay(divide(correct, rat(10n)), pkg.answerSemantic, "PERCENT_DECIMAL_SHIFT_LEFT", "The percentage was made ten times too small."),
    wrongDisplay(absRat(subtract(rat(1n), correct)), pkg.answerSemantic, "COMPLEMENTARY_PERCENTAGE_SELECTED", "The complement to 100% was selected instead of the isolated percentage."),
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
