import {
  addRational,
  compareRational,
  divideRational,
  equalRational,
  formatRational,
  multiplyRational,
  rational,
  reciprocalRational,
  subtractRational,
  type Rational,
} from "../../../shared/exact-rational";
import { evaluateExact } from "../../../shared/exact-evaluator";
import {
  compileFractionExpression,
  evaluateFractionExpressionIndependent,
  fractionBinaryNode,
  fractionExpressionFingerprint,
  fractionGroupNode,
  fractionValueNode,
  rationalValueNode,
  renderFractionExpression,
  type SapFractionExpressionNode,
} from "../wave01/display-expression";
import {
  SAP_CP002_COMPLETION_PROTOTYPE_IDS,
  type SapCp002AllDifficulty,
  type SapCp002CompletionAnswerSemantic,
  type SapCp002CompletionDirection,
  type SapCp002CompletionExplanation,
  type SapCp002CompletionOption,
  type SapCp002CompletionPackage,
  type SapCp002CompletionPrototypeId,
} from "./types";

const SOURCE_ANCESTRY = Object.freeze([
  "SAP-001-SAP-002-END-TO-END-DESIGN.md",
  "SAP-SOURCE-AND-OWNERSHIP-AUDIT.md",
  "SAP-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md",
  "uploaded simplification and decimal-fractions source fixtures",
]);

const LIFECYCLE = Object.freeze({
  permanentQlId: null,
  maturity: "EXECUTABLE_DISCOVERY_PROOF" as const,
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

class Rng {
  private state: number;
  constructor(text: string) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      value ^= text.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    this.state = value >>> 0 || 0x9e3779b9;
  }
  next(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state;
  }
  int(min: number, max: number): number {
    return min + (this.next() % (max - min + 1));
  }
  pick<T>(values: readonly T[]): T {
    return values[this.next() % values.length]!;
  }
}

interface State {
  readonly expression: SapFractionExpressionNode | null;
  readonly renderedExpression: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly canonicalValue: Rational | null;
  readonly options: readonly SapCp002CompletionOption[];
  readonly correctIndex: number;
  readonly taskDirection: SapCp002CompletionDirection;
  readonly answerSemantic: SapCp002CompletionAnswerSemantic;
  readonly concept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly speedMethod: string;
  readonly traps: readonly string[];
  readonly independentTrace: readonly string[];
  readonly hiddenState: Readonly<Record<string, string | number | boolean>>;
  readonly fingerprint: string;
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${label} must be a positive integer.`);
}

function difficultyForSeed(seed: number): SapCp002AllDifficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

function frac(n: number, d: number): SapFractionExpressionNode {
  return fractionValueNode(BigInt(n), BigInt(d), "FRACTION");
}

function integer(n: number): SapFractionExpressionNode {
  return fractionValueNode(BigInt(n), 1n, "INTEGER");
}

function format(value: Rational): string {
  return formatRational(value);
}

function numericOptions(
  correct: Rational,
  candidates: readonly { value: Rational; id: string; analysis: string }[],
  seed: number,
  prototypeIndex: number,
): { options: readonly SapCp002CompletionOption[]; correctIndex: number } {
  const selected: { value: Rational; id: string; analysis: string }[] = [];
  const seen = new Set([format(correct)]);
  for (const candidate of candidates) {
    const key = format(candidate.value);
    if (!seen.has(key)) {
      seen.add(key);
      selected.push(candidate);
    }
    if (selected.length === 3) break;
  }
  let offset = 1n;
  while (selected.length < 3) {
    const value = rational(correct.numerator + offset * correct.denominator, correct.denominator);
    const key = format(value);
    if (!seen.has(key)) {
      seen.add(key);
      selected.push({
        value,
        id: "FINAL_ARITHMETIC_SLIP",
        analysis: "This option follows the main method but contains a final arithmetic slip in the reduced result.",
      });
    }
    offset += 1n;
  }
  const correctIndex = (seed + prototypeIndex) % 4;
  const options: SapCp002CompletionOption[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(Object.freeze({ value: format(correct), isCorrect: true, misconceptionId: null, analysis: "This is the exact verified result." }));
    } else {
      const candidate = selected[wrong++]!;
      options.push(Object.freeze({ value: format(candidate.value), isCorrect: false, misconceptionId: candidate.id, analysis: candidate.analysis }));
    }
  }
  return { options: Object.freeze(options), correctIndex };
}

function textOptions(
  correct: string,
  wrong: readonly { value: string; id: string; analysis: string }[],
  seed: number,
  prototypeIndex: number,
): { options: readonly SapCp002CompletionOption[]; correctIndex: number } {
  const correctIndex = (seed + prototypeIndex) % 4;
  const options: SapCp002CompletionOption[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(Object.freeze({ value: correct, isCorrect: true, misconceptionId: null, analysis: "This choice is verified by exact rational evaluation." }));
    } else {
      const item = wrong[wrongIndex++]!;
      options.push(Object.freeze({ value: item.value, isCorrect: false, misconceptionId: item.id, analysis: item.analysis }));
    }
  }
  return { options: Object.freeze(options), correctIndex };
}

function evaluateForward(expression: SapFractionExpressionNode): {
  value: Rational;
  rendered: string;
  independentTrace: readonly string[];
  fingerprint: string;
} {
  const canonical = evaluateExact(compileFractionExpression(expression));
  const independent = evaluateFractionExpressionIndependent(expression);
  if (!equalRational(canonical.value, independent.value)) throw new Error("Canonical and independent fraction evaluators disagree.");
  return {
    value: canonical.value,
    rendered: renderFractionExpression(expression),
    independentTrace: independent.trace,
    fingerprint: fractionExpressionFingerprint(expression),
  };
}

function forwardState(
  expression: SapFractionExpressionNode,
  seed: number,
  prototypeIndex: number,
  concept: string,
  strategy: string,
  steps: readonly string[],
  speedMethod: string,
  candidates: readonly { value: Rational; id: string; analysis: string }[],
  hiddenState: Readonly<Record<string, string | number | boolean>>,
): State {
  const evaluated = evaluateForward(expression);
  const optionSet = numericOptions(evaluated.value, candidates, seed, prototypeIndex);
  return {
    expression,
    renderedExpression: evaluated.rendered,
    canonicalAnswer: format(evaluated.value),
    verifierAnswer: format(evaluated.value),
    canonicalValue: evaluated.value,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    taskDirection: "FORWARD",
    answerSemantic: "SIMPLIFIED_RATIONAL",
    concept,
    strategy,
    steps,
    speedMethod,
    traps: Object.freeze(optionSet.options.filter((option) => !option.isCorrect).map((option) => option.analysis)),
    independentTrace: evaluated.independentTrace,
    hiddenState,
    fingerprint: evaluated.fingerprint,
  };
}

function stateIntegerPart(rng: Rng, difficulty: SapCp002AllDifficulty, seed: number, index: number): State {
  const whole = rng.int(2, difficulty === "HARD" ? 12 : 7);
  const d1 = rng.int(3, 9);
  const d2 = rng.int(3, 10);
  const n1 = rng.int(1, d1 - 1);
  const n2 = rng.int(1, d2 - 1);
  const product = fractionBinaryNode("MULTIPLY", frac(n1, d1), frac(n2, d2));
  const expression = fractionBinaryNode(seed % 2 === 0 ? "ADD" : "SUBTRACT", integer(whole), product);
  const productValue = multiplyRational(rational(BigInt(n1), BigInt(d1)), rational(BigInt(n2), BigInt(d2)));
  return forwardState(
    expression,
    seed,
    index,
    "An integer and a fractional product belong to one exact rational expression; multiplication is completed before the final addition or subtraction.",
    "Evaluate the fractional product first, then combine it with the integer using a common denominator.",
    Object.freeze([
      `Multiply ${n1}/${d1} by ${n2}/${d2} and reduce the product.`,
      `Write ${whole} with the denominator of the reduced product.`,
      "Combine the numerators and reduce the final fraction.",
    ]),
    "Do not convert the integer too early; first reduce the fractional product, then use its smaller denominator.",
    Object.freeze([
      { value: addRational(rational(BigInt(whole)), rational(BigInt(n1 + n2), BigInt(d1 + d2))), id: "COMBINED_FRACTIONS_COMPONENTWISE", analysis: "This combines fraction components directly instead of evaluating the product exactly." },
      { value: seed % 2 === 0 ? addRational(rational(BigInt(whole)), addRational(rational(BigInt(n1), BigInt(d1)), rational(BigInt(n2), BigInt(d2)))) : subtractRational(rational(BigInt(whole)), addRational(rational(BigInt(n1), BigInt(d1)), rational(BigInt(n2), BigInt(d2)))), id: "ADDED_BEFORE_MULTIPLYING", analysis: "This changes the fractional multiplication into an addition before combining with the integer." },
      { value: productValue, id: "DROPPED_INTEGER_PART", analysis: "This evaluates only the fractional product and omits the visible integer part." },
    ]),
    Object.freeze({ whole, n1, d1, n2, d2, operation: seed % 2 === 0 ? "ADD" : "SUBTRACT" }),
  );
}

function stateSumDifferenceProduct(rng: Rng, difficulty: SapCp002AllDifficulty, seed: number, index: number): State {
  const b = rng.int(4, difficulty === "HARD" ? 12 : 8);
  const d = rng.int(4, difficulty === "HARD" ? 13 : 9);
  const a = rng.int(2, b - 1);
  const c = rng.int(1, Math.min(d - 1, a));
  const x = rational(BigInt(a), BigInt(b));
  const y = rational(BigInt(c), BigInt(d));
  const sum = fractionGroupNode(fractionBinaryNode("ADD", frac(a, b), frac(c, d)));
  const difference = fractionGroupNode(fractionBinaryNode("SUBTRACT", frac(a, b), frac(c, d)));
  const expression = fractionBinaryNode("MULTIPLY", sum, difference);
  return forwardState(
    expression,
    seed,
    index,
    "Each bracket is an exact fraction expression; both brackets must be simplified before their results are multiplied.",
    "Find the sum and difference separately, reduce them, and cross-cancel before the final multiplication.",
    Object.freeze(["Simplify the first bracket using a common denominator.", "Simplify the second bracket using the same denominator.", "Multiply the two reduced results and cancel common factors."]),
    "Because the two brackets use the same fractions, reuse the common-denominator work instead of starting again.",
    Object.freeze([
      { value: subtractRational(multiplyRational(x, x), multiplyRational(y, y)), id: "UNVERIFIED_IDENTITY_ROUTE", analysis: "This route is valid only if both squares are computed exactly; this option contains the common square-arithmetic slip." },
      { value: multiplyRational(addRational(x, y), addRational(x, y)), id: "USED_SUM_TWICE", analysis: "This replaces the second bracket by another sum and therefore ignores the subtraction sign." },
      { value: addRational(addRational(x, y), subtractRational(x, y)), id: "ADDED_BRACKET_RESULTS", analysis: "This adds the two bracket values instead of multiplying them." },
    ]),
    Object.freeze({ a, b, c, d }),
  );
}

function stateReciprocal(rng: Rng, difficulty: SapCp002AllDifficulty, seed: number, index: number): State {
  const b = rng.int(3, difficulty === "HARD" ? 12 : 8);
  const d = rng.int(3, difficulty === "HARD" ? 13 : 9);
  const a = rng.int(1, b - 1);
  const c = rng.int(1, d - 1);
  const inner = fractionGroupNode(fractionBinaryNode("ADD", frac(a, b), frac(c, d)));
  const expression = fractionBinaryNode("COMPLEX_FRACTION", integer(1), inner);
  const innerValue = addRational(rational(BigInt(a), BigInt(b)), rational(BigInt(c), BigInt(d)));
  return forwardState(
    expression,
    seed,
    index,
    "The reciprocal applies to the value of the complete grouped denominator, not to one visible fraction at a time.",
    "Simplify the denominator block first, then invert that single non-zero result.",
    Object.freeze(["Add the fractions inside the denominator block.", "Reduce the denominator result.", "Take the reciprocal of that complete result."]),
    "Treat the large fraction bar as an instruction to finish the denominator before division.",
    Object.freeze([
      { value: innerValue, id: "FAILED_TO_TAKE_RECIPROCAL", analysis: "This stops after simplifying the denominator and never takes its reciprocal." },
      { value: addRational(reciprocalRational(rational(BigInt(a), BigInt(b))), reciprocalRational(rational(BigInt(c), BigInt(d)))), id: "RECIPROCATED_TERMS_SEPARATELY", analysis: "The reciprocal of a sum is not the sum of the reciprocals." },
      { value: divideRational(rational(BigInt(a), BigInt(b)), rational(BigInt(c), BigInt(d))), id: "CHANGED_SUM_TO_DIVISION", analysis: "This changes the addition inside the denominator into division." },
    ]),
    Object.freeze({ a, b, c, d }),
  );
}

function stateComplement(rng: Rng, difficulty: SapCp002AllDifficulty, seed: number, index: number): State {
  const denominator = rng.pick([6, 8, 10, 12, 15] as const);
  const n1 = rng.int(1, Math.floor(denominator / 3));
  const n2 = rng.int(1, Math.floor(denominator / 3));
  const inside = fractionGroupNode(fractionBinaryNode("ADD", frac(n1, denominator), frac(n2, denominator)));
  const expression = fractionBinaryNode("SUBTRACT", integer(1), inside);
  const sum = rational(BigInt(n1 + n2), BigInt(denominator));
  return forwardState(
    expression,
    seed,
    index,
    "A fraction complement is the exact amount needed to make one whole.",
    "Add the grouped fractions, write 1 with the same denominator, and subtract.",
    Object.freeze([`Add ${n1}/${denominator} and ${n2}/${denominator}.`, `Write 1 as ${denominator}/${denominator}.`, "Subtract the grouped total and reduce."]),
    "With a shared denominator, subtract the combined numerator directly from the denominator.",
    Object.freeze([
      { value: addRational(rational(1n), sum), id: "ADDED_INSTEAD_OF_COMPLEMENT", analysis: "This adds the grouped fraction to one instead of finding the amount left from one." },
      { value: rational(BigInt(denominator - n1), BigInt(denominator - n2)), id: "SUBTRACTED_COMPONENTWISE", analysis: "This subtracts numerators and denominators componentwise, which is not valid fraction subtraction." },
      { value: subtractRational(rational(1n), rational(BigInt(n1), BigInt(denominator))), id: "IGNORED_SECOND_FRACTION", analysis: "This forms the complement of only the first fraction and drops the second term inside the group." },
    ]),
    Object.freeze({ denominator, n1, n2 }),
  );
}

function stateContinuedFraction(rng: Rng, difficulty: SapCp002AllDifficulty, seed: number, index: number): State {
  const a = rng.int(1, difficulty === "HARD" ? 5 : 3);
  const b = rng.int(1, difficulty === "HARD" ? 6 : 4);
  const c = rng.int(1, 4);
  const d = rng.int(c + 1, difficulty === "HARD" ? 9 : 7);
  const deepest = fractionBinaryNode("ADD", integer(b), frac(c, d));
  const innerReciprocal = fractionBinaryNode("COMPLEX_FRACTION", integer(1), fractionGroupNode(deepest));
  const denominator = fractionBinaryNode("ADD", integer(a), innerReciprocal);
  const expression = fractionBinaryNode("COMPLEX_FRACTION", integer(1), fractionGroupNode(denominator));
  const deepValue = addRational(rational(BigInt(b)), rational(BigInt(c), BigInt(d)));
  const innerValue = reciprocalRational(deepValue);
  return forwardState(
    expression,
    seed,
    index,
    "A bounded continued fraction is evaluated from the deepest visible fraction outward.",
    "Simplify the innermost sum, take its reciprocal, add the outer integer, and finally take the outer reciprocal.",
    Object.freeze(["Evaluate the deepest integer-plus-fraction block.", "Invert that result for the inner reciprocal.", "Add the outer integer and invert once more."]),
    "Work strictly from the bottom upward and write each completed layer as one reduced fraction.",
    Object.freeze([
      { value: addRational(rational(BigInt(a)), innerValue), id: "OMITTED_OUTER_RECIPROCAL", analysis: "This finishes the outer denominator but omits the final reciprocal." },
      { value: reciprocalRational(addRational(rational(BigInt(a + b)), rational(BigInt(c), BigInt(d)))), id: "FLATTENED_NESTED_RECIPROCAL", analysis: "This flattens the nested reciprocal and changes the continued-fraction structure." },
      { value: addRational(reciprocalRational(rational(BigInt(a))), innerValue), id: "RECIPROCATED_OUTER_INTEGER_SEPARATELY", analysis: "The reciprocal applies to the complete outer denominator, not separately to its terms." },
    ]),
    Object.freeze({ a, b, c, d }),
  );
}

function stateMissingNumerator(rng: Rng, seed: number, index: number): State {
  const denominator = rng.int(5, 14);
  const missing = rng.int(1, denominator - 1);
  const otherDenominator = rng.int(3, 10);
  const otherNumerator = rng.int(1, otherDenominator - 1);
  const other = rational(BigInt(otherNumerator), BigInt(otherDenominator));
  const target = addRational(rational(BigInt(missing), BigInt(denominator)), other);
  const rendered = `□/${denominator} + ${otherNumerator}/${otherDenominator} = ${format(target)}`;
  const optionSet = numericOptions(rational(BigInt(missing)), Object.freeze([
    { value: rational(BigInt(denominator - missing)), id: "USED_COMPLEMENT_NUMERATOR", analysis: "This uses the complement numerator instead of isolating the missing fraction." },
    { value: rational(BigInt(missing + 1)), id: "FAILED_TO_SCALE_NUMERATOR", analysis: "This reflects a common-denominator scaling error while isolating the missing numerator." },
    { value: rational(BigInt(otherNumerator)), id: "COPIED_KNOWN_NUMERATOR", analysis: "This copies the numerator of the known fraction rather than solving the equality." },
  ]), seed, index);
  const verified = subtractRational(target, other);
  return {
    expression: null,
    renderedExpression: rendered,
    canonicalAnswer: missing.toString(),
    verifierAnswer: verified.denominator === BigInt(denominator) ? verified.numerator.toString() : (verified.numerator * BigInt(denominator) / verified.denominator).toString(),
    canonicalValue: rational(BigInt(missing)),
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    taskDirection: "INVERSE",
    answerSemantic: "MISSING_INTEGER",
    concept: "A missing numerator is recovered by isolating the missing fraction and then scaling it to the displayed denominator.",
    strategy: "Subtract the known fraction from the target, then express the result with the fixed denominator.",
    steps: Object.freeze(["Subtract the known fraction from both sides.", `Write the isolated fraction with denominator ${denominator}.`, "Read the required numerator and verify by substitution."]),
    speedMethod: "After isolating the fraction, cross-multiply once instead of converting the whole equality to a large common denominator.",
    traps: Object.freeze(optionSet.options.filter((option) => !option.isCorrect).map((option) => option.analysis)),
    independentTrace: Object.freeze([`Target minus known fraction = ${format(verified)}.`, `Scaling to denominator ${denominator} gives numerator ${missing}.`]),
    hiddenState: Object.freeze({ missing, denominator, otherNumerator, otherDenominator, target: format(target) }),
    fingerprint: `MISSING_NUM(${missing}/${denominator};${otherNumerator}/${otherDenominator};${format(target)})`,
  };
}

function stateMissingDenominator(rng: Rng, seed: number, index: number): State {
  const missing = rng.int(4, 15);
  const numerator = rng.int(1, missing - 1);
  const otherDenominator = rng.int(3, 10);
  const otherNumerator = rng.int(1, otherDenominator - 1);
  const other = rational(BigInt(otherNumerator), BigInt(otherDenominator));
  const target = addRational(rational(BigInt(numerator), BigInt(missing)), other);
  const rendered = `${numerator}/□ + ${otherNumerator}/${otherDenominator} = ${format(target)}`;
  const optionSet = numericOptions(rational(BigInt(missing)), Object.freeze([
    { value: rational(BigInt(numerator)), id: "COPIED_NUMERATOR_AS_DENOMINATOR", analysis: "This copies the visible numerator instead of solving for the denominator." },
    { value: rational(BigInt(missing + numerator)), id: "ADDED_NUMERATOR_TO_DENOMINATOR", analysis: "This introduces an unsupported numerator–denominator addition during cross multiplication." },
    { value: rational(BigInt(Math.max(1, missing - numerator))), id: "USED_DENOMINATOR_DIFFERENCE", analysis: "This uses a difference of components rather than the reciprocal relation of the isolated fraction." },
  ]), seed, index);
  const isolated = subtractRational(target, other);
  const verified = isolated.numerator === BigInt(numerator)
    ? isolated.denominator
    : BigInt(numerator) * isolated.denominator / isolated.numerator;
  return {
    expression: null,
    renderedExpression: rendered,
    canonicalAnswer: missing.toString(),
    verifierAnswer: verified.toString(),
    canonicalValue: rational(BigInt(missing)),
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    taskDirection: "INVERSE",
    answerSemantic: "MISSING_INTEGER",
    concept: "A missing denominator is found only after the unknown fraction has been isolated as an exact rational value.",
    strategy: "Subtract the known fraction, then use numerator ÷ isolated value to recover the denominator.",
    steps: Object.freeze(["Isolate the fraction containing the blank.", `Set ${numerator}/□ equal to the isolated reduced fraction.`, "Cross-multiply, solve the positive denominator, and substitute it back."]),
    speedMethod: "Once isolated, denominator = visible numerator ÷ fraction value; keep the calculation exact.",
    traps: Object.freeze(optionSet.options.filter((option) => !option.isCorrect).map((option) => option.analysis)),
    independentTrace: Object.freeze([`Target minus known fraction = ${format(isolated)}.`, `${numerator} divided by ${format(isolated)} gives denominator ${missing}.`]),
    hiddenState: Object.freeze({ missing, numerator, otherNumerator, otherDenominator, target: format(target) }),
    fingerprint: `MISSING_DEN(${numerator}/${missing};${otherNumerator}/${otherDenominator};${format(target)})`,
  };
}

function stateMissingOperand(rng: Rng, seed: number, index: number): State {
  const d1 = rng.int(3, 10);
  const n1 = rng.int(1, d1 - 1);
  const d2 = rng.int(3, 12);
  const n2 = rng.int(1, d2 - 1);
  const left = rational(BigInt(n1), BigInt(d1));
  const missing = rational(BigInt(n2), BigInt(d2));
  const target = seed % 2 === 0 ? addRational(left, missing) : subtractRational(left, missing);
  const operation = seed % 2 === 0 ? "+" : "−";
  const rendered = `${n1}/${d1} ${operation} □ = ${format(target)}`;
  const optionSet = numericOptions(missing, Object.freeze([
    { value: addRational(target, left), id: "USED_SAME_OPERATION_TO_ISOLATE", analysis: "This repeats the displayed operation instead of applying its inverse to isolate the blank." },
    { value: subtractRational(left, target), id: "REVERSED_SUBTRACTION_ORDER", analysis: "This reverses the subtraction order while isolating the missing operand." },
    { value: reciprocalRational(missing), id: "TOOK_UNNEEDED_RECIPROCAL", analysis: "This takes a reciprocal even though the equality is additive, not divisive." },
  ]), seed, index);
  const verifier = seed % 2 === 0 ? subtractRational(target, left) : subtractRational(left, target);
  return {
    expression: null,
    renderedExpression: rendered,
    canonicalAnswer: format(missing),
    verifierAnswer: format(verifier),
    canonicalValue: missing,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    taskDirection: "INVERSE",
    answerSemantic: "MISSING_RATIONAL",
    concept: "The missing fraction is isolated with the inverse additive operation while preserving subtraction order.",
    strategy: seed % 2 === 0 ? "Subtract the known fraction from the target." : "Subtract the target from the known first fraction.",
    steps: Object.freeze(["Identify the operation joining the blank to the known fraction.", "Apply the correct inverse operation with exact common denominators.", "Reduce and verify by substitution."]),
    speedMethod: "Write the isolation step before calculating; this prevents reversal errors in subtraction questions.",
    traps: Object.freeze(optionSet.options.filter((option) => !option.isCorrect).map((option) => option.analysis)),
    independentTrace: Object.freeze([`Exact isolation gives ${format(verifier)}.`, `Substitution reproduces ${format(target)}.`]),
    hiddenState: Object.freeze({ n1, d1, n2, d2, operation, target: format(target) }),
    fingerprint: `MISSING_OPERAND(${n1}/${d1};${operation};${n2}/${d2};${format(target)})`,
  };
}

function simpleSumExpression(a: number, b: number, c: number, d: number): SapFractionExpressionNode {
  return fractionBinaryNode("ADD", frac(a, b), frac(c, d));
}

function stateComparison(rng: Rng, seed: number, index: number): State {
  const b = rng.int(4, 10);
  const d = rng.int(4, 11);
  const a = rng.int(1, b - 1);
  const c = rng.int(1, d - 1);
  const leftExpression = simpleSumExpression(a, b, c, d);
  const leftEval = evaluateForward(leftExpression);
  const relation = (["<", "=", ">"] as const)[(seed - 1) % 3]!;
  const delta = rational(1n, BigInt(rng.int(5, 15)));
  const rightValue = relation === "<" ? addRational(leftEval.value, delta) : relation === ">" ? subtractRational(leftEval.value, delta) : leftEval.value;
  const e = rng.int(3, 9);
  const rightExpression = fractionBinaryNode("SUBTRACT", fractionBinaryNode("ADD", rationalValueNode(rightValue, "FRACTION"), frac(1, e)), frac(1, e));
  const rightEval = evaluateForward(rightExpression);
  const verifier = compareRational(leftEval.value, rightEval.value) < 0 ? "<" : compareRational(leftEval.value, rightEval.value) > 0 ? ">" : "=";
  const rendered = `A = ${leftEval.rendered}; B = ${rightEval.rendered}. Choose the correct relation between A and B.`;
  const wrongValues = ["<", "=", ">", "Cannot be determined"].filter((value) => value !== verifier).slice(0, 3);
  const optionSet = textOptions(verifier, Object.freeze(wrongValues.map((value, position) => ({
    value,
    id: ["COMPARED_UNREDUCED_NUMERATORS", "ASSUMED_EQUAL_FROM_SIMILAR_FORM", "COMPARED_DENOMINATORS_ONLY"][position]!,
    analysis: [
      "This compares visible numerators before evaluating both complete expressions.",
      "This assumes equal values from a similar-looking form without exact calculation.",
      "This compares denominator size instead of the values of the evaluated fractions.",
    ][position]!,
  }))), seed, index);
  return {
    expression: null,
    renderedExpression: rendered,
    canonicalAnswer: verifier,
    verifierAnswer: verifier,
    canonicalValue: null,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    taskDirection: "COMPARISON",
    answerSemantic: "COMPARISON_CLASS",
    concept: "Two fraction expressions are compared only after each has been evaluated exactly.",
    strategy: "Reduce A and B independently, then compare by cross multiplication.",
    steps: Object.freeze([`A simplifies to ${format(leftEval.value)}.`, `B simplifies to ${format(rightEval.value)}.`, `Therefore A ${verifier} B.`]),
    speedMethod: "After reducing both values, cross-multiply rather than converting to decimals.",
    traps: Object.freeze(optionSet.options.filter((option) => !option.isCorrect).map((option) => option.analysis)),
    independentTrace: Object.freeze([...leftEval.independentTrace, ...rightEval.independentTrace, `Cross-product comparison gives ${verifier}.`]),
    hiddenState: Object.freeze({ relation, left: format(leftEval.value), right: format(rightEval.value) }),
    fingerprint: `COMPARE(${leftEval.fingerprint};${rightEval.fingerprint};${verifier})`,
  };
}

function stateEquivalentSelection(rng: Rng, seed: number, index: number): State {
  const b = rng.int(4, 12);
  const d = rng.int(4, 13);
  const a = rng.int(1, b - 1);
  const c = rng.int(1, d - 1);
  const expression = simpleSumExpression(a, b, c, d);
  const evaluated = evaluateForward(expression);
  const correct = format(evaluated.value);
  const scale = BigInt(rng.int(2, 5));
  const unreducedEquivalent = `${evaluated.value.numerator * scale}/${evaluated.value.denominator * scale}`;
  const wrong = Object.freeze([
    { value: unreducedEquivalent, id: "SELECTED_UNREDUCED_EQUIVALENT", analysis: "This fraction has the same value but is not in the requested lowest terms." },
    { value: format(rational(evaluated.value.numerator + 1n, evaluated.value.denominator)), id: "NUMERATOR_REDUCTION_SLIP", analysis: "This changes the numerator during reduction and therefore changes the value." },
    { value: format(rational(evaluated.value.numerator, evaluated.value.denominator + 1n)), id: "DENOMINATOR_REDUCTION_SLIP", analysis: "This changes only the denominator instead of dividing numerator and denominator by the same factor." },
  ]);
  const optionSet = textOptions(correct, wrong, seed, index);
  return {
    expression,
    renderedExpression: evaluated.rendered,
    canonicalAnswer: correct,
    verifierAnswer: format(evaluated.value),
    canonicalValue: evaluated.value,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    taskDirection: "SELECTION",
    answerSemantic: "EXPRESSION_SELECTION",
    concept: "The correct option must be both equivalent to the evaluated expression and reduced to lowest terms.",
    strategy: "Evaluate the source expression exactly, reduce once, then match both value and form.",
    steps: Object.freeze(["Use a common denominator in the source expression.", `The exact value is ${correct}.`, "Reject equal-looking or unreduced options that do not satisfy the requested form."]),
    speedMethod: "Reduce the source result before scanning the options; this avoids being attracted to an unreduced equivalent.",
    traps: Object.freeze(optionSet.options.filter((option) => !option.isCorrect).map((option) => option.analysis)),
    independentTrace: evaluated.independentTrace,
    hiddenState: Object.freeze({ a, b, c, d, scale: Number(scale) }),
    fingerprint: `EQUIVALENT_SELECT(${evaluated.fingerprint};${correct};${unreducedEquivalent})`,
  };
}

function stateIncorrectStep(rng: Rng, seed: number, index: number): State {
  const d1 = rng.pick([3, 4, 5, 6, 8] as const);
  let d2 = rng.pick([4, 5, 6, 8, 9] as const);
  if (d2 === d1) d2 += 1;
  const n1 = rng.int(1, d1 - 1);
  const n2 = rng.int(1, d2 - 1);
  const common = d1 * d2;
  const scaled1 = n1 * d2;
  const scaled2 = n2 * d1;
  const correctValue = rational(BigInt(scaled1 + scaled2), BigInt(common));
  const errorStep = seed % 2 === 0 ? 2 : 3;
  const step1 = `Step 1: ${n1}/${d1} + ${n2}/${d2}`;
  const step2 = errorStep === 2
    ? `Step 2: (${n1} + ${n2})/${common}`
    : `Step 2: (${scaled1} + ${scaled2})/${common}`;
  const step3 = errorStep === 3
    ? `Step 3: ${scaled1 + scaled2}/${d1 + d2}`
    : `Step 3: ${scaled1 + scaled2}/${common}`;
  const step4 = `Step 4: reduce the preceding fraction.`;
  const rendered = `${step1}\n${step2}\n${step3}\n${step4}`;
  const answer = `Step ${errorStep}`;
  const wrongSteps = ["Step 1", "Step 2", "Step 3", "Step 4"].filter((value) => value !== answer).slice(0, 3);
  const optionSet = textOptions(answer, Object.freeze(wrongSteps.map((value, position) => ({
    value,
    id: ["FLAGGED_CORRECT_GIVEN_STEP", "MISSED_FIRST_ERROR", "FLAGGED_LATER_CONSEQUENCE"][position]!,
    analysis: [
      "This step merely restates the given expression and does not introduce an error.",
      "This overlooks the earliest value-changing transition in the worked chain.",
      "This identifies a later consequence rather than the first incorrect step.",
    ][position]!,
  }))), seed, index);
  return {
    expression: null,
    renderedExpression: rendered,
    canonicalAnswer: answer,
    verifierAnswer: `Step ${errorStep}`,
    canonicalValue: correctValue,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    taskDirection: "DIAGNOSIS",
    answerSemantic: "STEP_SELECTION",
    concept: "The first incorrect step is the earliest transition that changes the exact value of the expression.",
    strategy: "Check each transition in order and stop at the first invalid common-denominator or reduction operation.",
    steps: Object.freeze(["Verify Step 1 as the original expression.", `The transition into ${answer} is the first invalid one.`, "Later lines are consequences and are not the requested answer."]),
    speedMethod: "Compare consecutive lines, not just the final answer; stop as soon as equivalence fails.",
    traps: Object.freeze(optionSet.options.filter((option) => !option.isCorrect).map((option) => option.analysis)),
    independentTrace: Object.freeze([`Exact source value is ${format(correctValue)}.`, `${answer} fails exact-value preservation.`]),
    hiddenState: Object.freeze({ n1, d1, n2, d2, common, errorStep }),
    fingerprint: `INCORRECT_STEP(${n1}/${d1}+${n2}/${d2};error=${errorStep})`,
  };
}

function stateFor(prototypeId: SapCp002CompletionPrototypeId, seed: number): State {
  const rng = new Rng(`${prototypeId}:${seed}`);
  const difficulty = difficultyForSeed(seed);
  const index = SAP_CP002_COMPLETION_PROTOTYPE_IDS.indexOf(prototypeId);
  switch (prototypeId) {
    case "SAP-CP002-PROT-FRACTION-EXPRESSION-INTEGER-PART": return stateIntegerPart(rng, difficulty, seed, index);
    case "SAP-CP002-PROT-PRODUCT-SUM-DIFFERENCE": return stateSumDifferenceProduct(rng, difficulty, seed, index);
    case "SAP-CP002-PROT-RECIPROCAL-EXPRESSION": return stateReciprocal(rng, difficulty, seed, index);
    case "SAP-CP002-PROT-FRACTION-COMPLEMENT": return stateComplement(rng, difficulty, seed, index);
    case "SAP-CP002-PROT-BOUNDED-CONTINUED-FRACTION": return stateContinuedFraction(rng, difficulty, seed, index);
    case "SAP-CP002-PROT-MISSING-NUMERATOR": return stateMissingNumerator(rng, seed, index);
    case "SAP-CP002-PROT-MISSING-DENOMINATOR": return stateMissingDenominator(rng, seed, index);
    case "SAP-CP002-PROT-MISSING-FRACTION-OPERAND": return stateMissingOperand(rng, seed, index);
    case "SAP-CP002-PROT-COMPARE-EVALUATED-FRACTIONS": return stateComparison(rng, seed, index);
    case "SAP-CP002-PROT-SELECT-EQUIVALENT-REDUCED-FRACTION": return stateEquivalentSelection(rng, seed, index);
    case "SAP-CP002-PROT-IDENTIFY-INCORRECT-FRACTION-STEP": return stateIncorrectStep(rng, seed, index);
  }
}

function buildExplanation(state: State): SapCp002CompletionExplanation {
  return Object.freeze({
    coreConcept: state.concept,
    givenDataAndStrategy: state.strategy,
    stepByStep: Object.freeze([...state.steps]),
    examSpeedMethod: state.speedMethod,
    commonTraps: Object.freeze([...state.traps].slice(0, 3)),
    finalAnswer: `Therefore, the required answer is ${state.canonicalAnswer}.`,
  });
}

function stemFor(state: State): string {
  switch (state.taskDirection) {
    case "FORWARD": return `Simplify the following expression and give the answer in lowest terms: ${state.renderedExpression}`;
    case "INVERSE": return `Find the value of the blank in the following exact fraction equality: ${state.renderedExpression}`;
    case "COMPARISON": return state.renderedExpression;
    case "SELECTION": return `Evaluate ${state.renderedExpression} and select its equivalent fraction in lowest terms.`;
    case "DIAGNOSIS": return `A student simplified a fraction expression as shown below. Identify the first incorrect step.\n${state.renderedExpression}`;
  }
}

export function generateSapCp002CompletionPackage(
  prototypeId: SapCp002CompletionPrototypeId,
  seed: number,
): SapCp002CompletionPackage {
  assertPositiveInteger(seed, "SAP-CP-002 completion seed");
  if (!SAP_CP002_COMPLETION_PROTOTYPE_IDS.includes(prototypeId as never)) throw new Error(`Unknown SAP-CP-002 completion prototype: ${prototypeId}`);
  const state = stateFor(prototypeId, seed);
  const errors: string[] = [];
  if (state.canonicalAnswer !== state.verifierAnswer) errors.push("Canonical and verifier answers differ.");
  if (state.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(state.options.map((option) => option.value)).size !== 4) errors.push("Options are not unique.");
  if (state.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (!state.options[state.correctIndex]?.isCorrect) errors.push("Correct index does not identify the correct option.");
  const difficulty = difficultyForSeed(seed);
  return Object.freeze({
    packageId: "SAP-001",
    checkpointId: "SAP-CP-002",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    locale: "en-IN",
    seed,
    difficulty,
    difficultyEvidence: Object.freeze([
      `${state.taskDirection.toLowerCase()} fraction reasoning is material`,
      difficulty === "EASY" ? "small direct values" : difficulty === "MEDIUM" ? "multiple exact transformations" : "nested, inverse or diagnostic load",
    ]),
    taskDirection: state.taskDirection,
    answerSemantic: state.answerSemantic,
    stem: stemFor(state),
    expression: state.expression,
    renderedExpression: state.renderedExpression,
    canonicalAnswer: state.canonicalAnswer,
    verifierAnswer: state.verifierAnswer,
    canonicalValue: state.canonicalValue,
    independentTrace: state.independentTrace,
    options: state.options,
    correctIndex: state.correctIndex,
    explanation: buildExplanation(state),
    hiddenState: state.hiddenState,
    mathematicalFingerprint: state.fingerprint,
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: Object.freeze([prototypeId]),
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
    lifecycle: LIFECYCLE,
  });
}

export function generateSapCp002CompletionSweep(seedsPerPrototype: number): readonly SapCp002CompletionPackage[] {
  assertPositiveInteger(seedsPerPrototype, "SAP-CP-002 completion sweep size");
  const packages: SapCp002CompletionPackage[] = [];
  for (const prototypeId of SAP_CP002_COMPLETION_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) packages.push(generateSapCp002CompletionPackage(prototypeId, seed));
  }
  return Object.freeze(packages);
}
