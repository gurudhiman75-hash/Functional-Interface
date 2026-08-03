import {
  addRational,
  divideRational,
  equalRational,
  formatRational,
  gcdBigInt,
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
} from "./display-expression";
import {
  SAP_001_PACKAGE_ID,
  SAP_CP_002_ID,
  SAP_CP002_WAVE01_PROTOTYPE_IDS,
  type SapCp002Difficulty,
  type SapCp002TrapCandidate,
  type SapCp002Wave01Explanation,
  type SapCp002Wave01Option,
  type SapCp002Wave01Package,
  type SapCp002Wave01PrototypeId,
} from "./types";

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

const SOURCE_ANCESTRY = Object.freeze([
  "SAP-001-SAP-002-END-TO-END-DESIGN.md",
  "SAP-SOURCE-AND-OWNERSHIP-AUDIT.md",
  "SAP-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md",
  "uploaded simplification and decimal-fractions source fixtures",
]);

class DeterministicRng {
  private state: number;

  constructor(seedText: string) {
    let state = 2166136261;
    for (let index = 0; index < seedText.length; index += 1) {
      state ^= seedText.charCodeAt(index);
      state = Math.imul(state, 16777619);
    }
    this.state = state >>> 0 || 0x9e3779b9;
  }

  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  int(minimum: number, maximum: number): number {
    return minimum + (this.next() % (maximum - minimum + 1));
  }

  pick<T>(values: readonly T[]): T {
    return values[this.next() % values.length]!;
  }
}

interface PrototypeState {
  readonly expression: SapFractionExpressionNode;
  readonly trapCandidates: readonly SapCp002TrapCandidate[];
  readonly concept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly speedMethod: string;
  readonly difficultyEvidence: readonly string[];
  readonly hiddenState: Readonly<Record<string, string | number | boolean>>;
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${label} must be a positive integer.`);
}

function difficultyForSeed(seed: number): SapCp002Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

function prototypeIndex(prototypeId: SapCp002Wave01PrototypeId): number {
  return SAP_CP002_WAVE01_PROTOTYPE_IDS.indexOf(prototypeId);
}

function trap(
  value: Rational,
  misconceptionId: SapCp002TrapCandidate["misconceptionId"],
  analysis: string,
): SapCp002TrapCandidate {
  return Object.freeze({ value, misconceptionId, analysis });
}

function lcm(left: bigint, right: bigint): bigint {
  return (left / gcdBigInt(left, right)) * right;
}

function fractionNode(numerator: number, denominator: number): SapFractionExpressionNode {
  return fractionValueNode(BigInt(numerator), BigInt(denominator), "FRACTION");
}

function mixedNode(whole: number, numerator: number, denominator: number): SapFractionExpressionNode {
  return fractionValueNode(
    BigInt(whole * denominator + numerator),
    BigInt(denominator),
    "MIXED_NUMBER",
  );
}

function stateForSumDifference(
  rng: DeterministicRng,
  difficulty: SapCp002Difficulty,
  seed: number,
): PrototypeState {
  const denominators = [3, 4, 5, 6, 8, 9, 10, 12] as const;
  const d1 = rng.pick(denominators);
  let d2 = rng.pick(denominators);
  if (d2 === d1) d2 = denominators[(denominators.indexOf(d1) + 3) % denominators.length]!;
  const n1 = rng.int(1, d1 - 1);
  const n2 = rng.int(1, d2 - 1);
  const operation = seed % 2 === 0 ? "ADD" : "SUBTRACT";
  const left = fractionNode(n1, d1);
  const right = fractionNode(n2, d2);
  const expression = fractionBinaryNode(operation, left, right);
  const common = Number(lcm(BigInt(d1), BigInt(d2)));
  const scaledLeft = n1 * (common / d1);
  const scaledRight = n2 * (common / d2);
  const combined = operation === "ADD" ? scaledLeft + scaledRight : scaledLeft - scaledRight;
  const sign = operation === "ADD" ? "+" : "−";

  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        rational(BigInt(operation === "ADD" ? n1 + n2 : n1 - n2), BigInt(d1 + d2)),
        "ADDED_NUMERATORS_AND_DENOMINATORS",
        "This combines the numerators and denominators directly, which is not valid for fraction addition or subtraction.",
      ),
      trap(
        rational(BigInt(combined), BigInt(d1 + d2)),
        "CROSS_MULTIPLIED_BUT_ADDED_DENOMINATORS",
        "This scales the numerators but then adds the denominators instead of using one common denominator.",
      ),
      trap(
        rational(BigInt(operation === "ADD" ? n1 + n2 : n1 - n2), BigInt(d1 * d2)),
        "USED_PRODUCT_DENOMINATOR_WITHOUT_CROSS_SCALING",
        "This uses the product of the denominators but fails to scale each numerator to that denominator.",
      ),
    ]),
    concept: "Fractions can be added or subtracted only after they are expressed with a common denominator.",
    strategy: `Use ${common} as a common denominator, scale both numerators, then ${operation === "ADD" ? "add" : "subtract"} and reduce.`,
    steps: Object.freeze([
      `${n1}/${d1} = ${scaledLeft}/${common} and ${n2}/${d2} = ${scaledRight}/${common}.`,
      `${scaledLeft}/${common} ${sign} ${scaledRight}/${common} = ${combined}/${common}.`,
      `Reduce ${combined}/${common} to its lowest terms.`,
    ]),
    speedMethod: "Use the LCM of the denominators; when one denominator divides the other, scale only the fraction that needs changing.",
    difficultyEvidence: Object.freeze([
      "different denominators require an exact common-denominator decision",
      difficulty === "HARD" ? "larger LCM or a negative result may occur" : "small proper fractions",
    ]),
    hiddenState: Object.freeze({ n1, d1, n2, d2, operation, commonDenominator: common }),
  };
}

function stateForProductCancellation(
  rng: DeterministicRng,
  difficulty: SapCp002Difficulty,
): PrototypeState {
  const cancelA = rng.int(2, difficulty === "HARD" ? 9 : 6);
  const cancelB = rng.int(2, difficulty === "HARD" ? 8 : 5);
  const x = rng.int(1, difficulty === "EASY" ? 4 : 7);
  const y = rng.int(2, difficulty === "HARD" ? 9 : 6);
  const z = rng.int(1, difficulty === "EASY" ? 5 : 8);
  const w = rng.int(2, difficulty === "HARD" ? 10 : 7);
  const n1 = x * cancelA;
  const d1 = y * cancelB;
  const n2 = z * cancelB;
  const d2 = w * cancelA;
  const leftValue = rational(BigInt(n1), BigInt(d1));
  const rightValue = rational(BigInt(n2), BigInt(d2));
  const expression = fractionBinaryNode(
    "MULTIPLY",
    rationalValueNode(leftValue, "FRACTION"),
    rationalValueNode(rightValue, "FRACTION"),
  );

  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        rational(BigInt((n1 / cancelA) * n2), BigInt(d1 * d2)),
        "CANCELLED_ONLY_ONE_SIDE_OF_A_FACTOR",
        "This divides a numerator by a common factor without dividing the matching denominator by the same factor.",
      ),
      trap(
        divideRational(leftValue, rightValue),
        "INVERTED_SECOND_FACTOR_IN_PRODUCT",
        "This unnecessarily takes the reciprocal of the second fraction even though the displayed operation is multiplication.",
      ),
      trap(
        addRational(leftValue, rightValue),
        "ADDED_INSTEAD_OF_MULTIPLYING",
        "This treats the two factors as an addition problem rather than multiplying their numerators and denominators.",
      ),
    ]),
    concept: "In a product of fractions, common factors may be cancelled across any numerator and denominator before multiplication.",
    strategy: "Factor the four visible numbers, cancel equal factors only across numerator–denominator positions, then multiply what remains.",
    steps: Object.freeze([
      `Cancel the factor ${cancelA} between ${n1} and ${d2}.`,
      `Cancel the factor ${cancelB} between ${n2} and ${d1}.`,
      `Multiply the remaining factors and reduce the result.`,
    ]),
    speedMethod: "Cross-cancel before multiplying; this keeps intermediate numbers small and avoids unnecessary arithmetic.",
    difficultyEvidence: Object.freeze([
      "two cross-cancellation opportunities are guaranteed",
      difficulty === "HARD" ? "larger composite factors" : "small visible common factors",
    ]),
    hiddenState: Object.freeze({ n1, d1, n2, d2, cancelA, cancelB }),
  };
}

function stateForDivisionReciprocal(
  rng: DeterministicRng,
  difficulty: SapCp002Difficulty,
): PrototypeState {
  const b = rng.int(3, difficulty === "HARD" ? 12 : 8);
  const d = rng.int(3, difficulty === "HARD" ? 13 : 9);
  const a = rng.int(1, b - 1);
  const c = rng.int(1, d - 1);
  const leftValue = rational(BigInt(a), BigInt(b));
  const rightValue = rational(BigInt(c), BigInt(d));
  const expression = fractionBinaryNode("DIVIDE", fractionNode(a, b), fractionNode(c, d));

  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        multiplyRational(leftValue, rightValue),
        "MULTIPLIED_WITHOUT_RECIPROCAL",
        "This multiplies the two displayed fractions directly instead of replacing division by multiplication by the reciprocal.",
      ),
      trap(
        multiplyRational(reciprocalRational(leftValue), rightValue),
        "INVERTED_THE_DIVIDEND",
        "This takes the reciprocal of the first fraction; only the divisor should be inverted.",
      ),
      trap(
        divideRational(rightValue, leftValue),
        "REVERSED_THE_DIVISION",
        "This reverses the order of the dividend and divisor, producing the reciprocal of the required quotient.",
      ),
    ]),
    concept: "Dividing by a non-zero fraction is equivalent to multiplying by its reciprocal.",
    strategy: `Keep ${a}/${b} unchanged, replace ÷ ${c}/${d} by × ${d}/${c}, then cancel and multiply.`,
    steps: Object.freeze([
      `${a}/${b} ÷ ${c}/${d} = ${a}/${b} × ${d}/${c}.`,
      "Cancel any common numerator–denominator factors.",
      "Multiply the remaining factors and reduce.",
    ]),
    speedMethod: "Use “keep, change, flip”: keep the dividend, change division to multiplication, and flip only the divisor.",
    difficultyEvidence: Object.freeze([
      "the reciprocal must be applied to the correct operand",
      difficulty === "HARD" ? "less obvious cancellation after inversion" : "small proper fractions",
    ]),
    hiddenState: Object.freeze({ a, b, c, d, reciprocalNumerator: d, reciprocalDenominator: c }),
  };
}

function stateForMixedOperationChain(
  rng: DeterministicRng,
  difficulty: SapCp002Difficulty,
): PrototypeState {
  const b = rng.int(3, difficulty === "HARD" ? 11 : 8);
  const d = rng.int(3, difficulty === "HARD" ? 12 : 9);
  const f = rng.int(3, difficulty === "HARD" ? 13 : 9);
  const a = rng.int(1, b - 1);
  const c = rng.int(1, d - 1);
  const e = rng.int(1, f - 1);
  const left = rational(BigInt(a), BigInt(b));
  const middle = rational(BigInt(c), BigInt(d));
  const right = rational(BigInt(e), BigInt(f));
  const expression = fractionBinaryNode(
    "ADD",
    fractionNode(a, b),
    fractionBinaryNode("MULTIPLY", fractionNode(c, d), fractionNode(e, f)),
  );

  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        multiplyRational(addRational(left, middle), right),
        "EVALUATED_STRICTLY_LEFT_TO_RIGHT",
        "This adds the first two fractions before completing the displayed multiplication.",
      ),
      trap(
        addRational(left, divideRational(middle, right)),
        "CHANGED_MULTIPLICATION_TO_DIVISION",
        "This changes the multiplication between the second and third fractions into division.",
      ),
      trap(
        addRational(multiplyRational(left, middle), right),
        "ADDED_BEFORE_MULTIPLYING",
        "This multiplies the wrong adjacent pair and no longer represents the displayed expression.",
      ),
    ]),
    concept: "Fraction expressions follow the same operation order as integer expressions: multiplication is completed before addition.",
    strategy: "Evaluate and reduce the fraction product first, then add the remaining fraction using a common denominator.",
    steps: Object.freeze([
      `First calculate ${c}/${d} × ${e}/${f}.`,
      `Add the reduced product to ${a}/${b}.`,
      "Reduce the final rational value to lowest terms.",
    ]),
    speedMethod: "Cancel inside the product before forming the final common denominator.",
    difficultyEvidence: Object.freeze([
      "operation order and exact rational arithmetic both matter",
      difficulty === "HARD" ? "three unrelated denominators" : "compact three-fraction chain",
    ]),
    hiddenState: Object.freeze({ a, b, c, d, e, f, operationOrder: "MULTIPLY_THEN_ADD" }),
  };
}

function stateForMixedNumbers(
  rng: DeterministicRng,
  difficulty: SapCp002Difficulty,
  seed: number,
): PrototypeState {
  const d1 = rng.int(3, difficulty === "HARD" ? 10 : 7);
  const d2 = rng.int(3, difficulty === "HARD" ? 11 : 8);
  const w1 = rng.int(1, difficulty === "HARD" ? 7 : 4);
  const w2 = rng.int(1, difficulty === "HARD" ? 6 : 4);
  const n1 = rng.int(1, d1 - 1);
  const n2 = rng.int(1, d2 - 1);
  const operation = seed % 2 === 0 ? "ADD" : "SUBTRACT";
  const first = rational(BigInt(w1 * d1 + n1), BigInt(d1));
  const second = rational(BigInt(w2 * d2 + n2), BigInt(d2));
  const incorrectlyConvertedFirst = rational(BigInt(w1 + n1), BigInt(d1));
  const incorrectlyConvertedSecond = rational(BigInt(w2 + n2), BigInt(d2));
  const combine = (left: Rational, right: Rational): Rational => (
    operation === "ADD" ? addRational(left, right) : subtractRational(left, right)
  );
  const wholeCombination = operation === "ADD" ? w1 + w2 : w1 - w2;
  const numeratorCombination = operation === "ADD" ? n1 + n2 : n1 - n2;

  return {
    expression: fractionBinaryNode(operation, mixedNode(w1, n1, d1), mixedNode(w2, n2, d2)),
    trapCandidates: Object.freeze([
      trap(
        combine(incorrectlyConvertedFirst, incorrectlyConvertedSecond),
        "CONVERTED_MIXED_NUMBER_AS_WHOLE_PLUS_NUMERATOR_OVER_DENOMINATOR",
        "This converts a mixed number as (whole + numerator)/denominator instead of (whole × denominator + numerator)/denominator.",
      ),
      trap(
        combine(rational(BigInt(n1), BigInt(d1)), rational(BigInt(n2), BigInt(d2))),
        "IGNORED_WHOLE_NUMBER_PART",
        "This uses only the proper-fraction parts and discards both visible whole-number parts.",
      ),
      trap(
        addRational(
          rational(BigInt(wholeCombination)),
          rational(BigInt(numeratorCombination), BigInt(d1 + d2)),
        ),
        "COMBINED_WHOLE_AND_FRACTION_PARTS_INDEPENDENTLY",
        "This combines whole parts separately and then directly combines fractional numerators and denominators.",
      ),
    ]),
    concept: "A mixed number must be converted to an improper fraction before a general fraction operation is performed.",
    strategy: "Convert each mixed number using whole × denominator + numerator, evaluate the resulting fractions, then reduce.",
    steps: Object.freeze([
      `${w1} ${n1}/${d1} = ${(w1 * d1) + n1}/${d1}.`,
      `${w2} ${n2}/${d2} = ${(w2 * d2) + n2}/${d2}.`,
      `Now ${operation === "ADD" ? "add" : "subtract"} the improper fractions and reduce.`,
    ]),
    speedMethod: "Convert each mixed number in one motion: multiply the whole part by the denominator and add the numerator.",
    difficultyEvidence: Object.freeze([
      "two display conversions precede the fraction operation",
      difficulty === "HARD" ? "larger whole parts and unrelated denominators" : "small mixed numbers",
    ]),
    hiddenState: Object.freeze({ w1, n1, d1, w2, n2, d2, operation }),
  };
}

function stateForFractionOfFraction(
  rng: DeterministicRng,
  difficulty: SapCp002Difficulty,
): PrototypeState {
  const q = rng.int(3, difficulty === "HARD" ? 10 : 7);
  const s = rng.int(3, difficulty === "HARD" ? 11 : 8);
  const u = rng.int(3, difficulty === "HARD" ? 12 : 9);
  const p = rng.int(1, q - 1);
  const r = rng.int(1, s - 1);
  const t = rng.int(1, u - 1);
  const factor = rational(BigInt(p), BigInt(q));
  const first = rational(BigInt(r), BigInt(s));
  const second = rational(BigInt(t), BigInt(u));
  const groupedValue = addRational(first, second);
  const grouped = fractionGroupNode(
    fractionBinaryNode("ADD", fractionNode(r, s), fractionNode(t, u)),
    "ROUND",
  );

  return {
    expression: fractionBinaryNode("OF", fractionNode(p, q), grouped),
    trapCandidates: Object.freeze([
      trap(
        addRational(factor, groupedValue),
        "TREATED_OF_AS_ADDITION",
        "This reads ‘of’ as addition even though it represents multiplication of the displayed fraction blocks.",
      ),
      trap(
        addRational(first, multiplyRational(factor, second)),
        "APPLIED_OF_ONLY_TO_NEAREST_FRACTION",
        "This applies the factor only to the nearest fraction and leaves the first term outside the visible group.",
      ),
      trap(
        divideRational(factor, groupedValue),
        "TREATED_OF_AS_DIVISION",
        "This changes the scoped ‘of’ multiplication into division.",
      ),
    ]),
    concept: "In an explicitly scoped arithmetic expression, ‘of’ means multiplication by the complete grouped quantity.",
    strategy: "Evaluate the fraction sum inside the bracket, multiply that result by the outside fraction, and reduce.",
    steps: Object.freeze([
      `First find ${r}/${s} + ${t}/${u}.`,
      `Multiply the result by ${p}/${q}.`,
      "Cross-cancel where possible and reduce the final fraction.",
    ]),
    speedMethod: "Finish the bracket first; then treat ‘of’ exactly like a multiplication sign.",
    difficultyEvidence: Object.freeze([
      "scope and fraction multiplication are both material",
      difficulty === "HARD" ? "larger common denominator inside the group" : "one grouped fraction sum",
    ]),
    hiddenState: Object.freeze({ p, q, r, s, t, u, scopedOperator: "OF_MEANS_MULTIPLY" }),
  };
}

function stateForComplexFraction(
  rng: DeterministicRng,
  difficulty: SapCp002Difficulty,
): PrototypeState {
  const b = rng.int(3, difficulty === "HARD" ? 10 : 7);
  const d = rng.int(3, difficulty === "HARD" ? 11 : 8);
  const a = rng.int(1, b - 1);
  const c = rng.int(1, d - 1);
  const base = rng.int(3, difficulty === "HARD" ? 10 : 7);
  const e = base + 1;
  const f = base + 2;
  const g = 1;
  const h = base + 3;
  const topLeft = rational(BigInt(a), BigInt(b));
  const topRight = rational(BigInt(c), BigInt(d));
  const bottomLeft = rational(BigInt(e), BigInt(f));
  const bottomRight = rational(BigInt(g), BigInt(h));
  const top = addRational(topLeft, topRight);
  const bottom = subtractRational(bottomLeft, bottomRight);
  const topExpression = fractionBinaryNode("ADD", fractionNode(a, b), fractionNode(c, d));
  const bottomExpression = fractionBinaryNode("SUBTRACT", fractionNode(e, f), fractionNode(g, h));

  return {
    expression: fractionBinaryNode("COMPLEX_FRACTION", topExpression, bottomExpression),
    trapCandidates: Object.freeze([
      trap(
        addRational(topLeft, divideRational(topRight, bottom)),
        "COMPLEX_FRACTION_SCOPED_ONLY_ADJACENT_TERMS",
        "This lets the main fraction bar govern only the nearest top term instead of the complete numerator and denominator blocks.",
      ),
      trap(
        multiplyRational(top, bottom),
        "MULTIPLIED_NUMERATOR_AND_DENOMINATOR_BLOCKS",
        "This multiplies the evaluated numerator and denominator blocks instead of dividing the numerator by the denominator.",
      ),
      trap(
        divideRational(bottom, top),
        "INVERTED_COMPLEX_FRACTION",
        "This reverses the complete numerator and denominator blocks.",
      ),
    ]),
    concept: "In a complex fraction, the main bar groups the complete numerator expression and the complete denominator expression.",
    strategy: "Evaluate the full top block, evaluate the full bottom block, then divide the top result by the bottom result.",
    steps: Object.freeze([
      `Numerator block: ${a}/${b} + ${c}/${d}.`,
      `Denominator block: ${e}/${f} − ${g}/${h}.`,
      "Divide the reduced numerator value by the non-zero denominator value and reduce again.",
    ]),
    speedMethod: "Treat the main fraction bar as two large brackets; finish the entire top and bottom before using the reciprocal.",
    difficultyEvidence: Object.freeze([
      "two independent fraction blocks feed one final division",
      difficulty === "HARD" ? "four unrelated denominators" : "bounded two-level complex fraction",
    ]),
    hiddenState: Object.freeze({ a, b, c, d, e, f, g, h, denominatorNonZero: bottom.numerator !== 0n }),
  };
}

function stateForSignedBrackets(
  rng: DeterministicRng,
  difficulty: SapCp002Difficulty,
): PrototypeState {
  const denominator = rng.int(4, difficulty === "HARD" ? 14 : 9);
  const leftNumerator = rng.int(1, denominator - 2);
  const gap = rng.int(1, denominator - leftNumerator - 1);
  const rightNumerator = leftNumerator + gap;
  const factorDenominator = rng.int(3, difficulty === "HARD" ? 11 : 8);
  const factorNumerator = rng.int(1, factorDenominator - 1);
  const tailDenominator = rng.int(3, difficulty === "HARD" ? 12 : 8);
  const tailNumerator = rng.int(1, tailDenominator - 1);
  const left = rational(BigInt(leftNumerator), BigInt(denominator));
  const right = rational(BigInt(rightNumerator), BigInt(denominator));
  const negativeGroup = subtractRational(left, right);
  const factor = rational(BigInt(factorNumerator), BigInt(factorDenominator));
  const tail = rational(BigInt(tailNumerator), BigInt(tailDenominator));
  const groupExpression = fractionGroupNode(
    fractionBinaryNode("SUBTRACT", fractionNode(leftNumerator, denominator), fractionNode(rightNumerator, denominator)),
    "SQUARE",
  );
  const expression = fractionBinaryNode(
    "ADD",
    fractionBinaryNode("MULTIPLY", groupExpression, fractionNode(factorNumerator, factorDenominator)),
    fractionNode(tailNumerator, tailDenominator),
  );

  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        addRational(multiplyRational(rational(BigInt(gap), BigInt(denominator)), factor), tail),
        "REPLACED_NEGATIVE_BY_ABSOLUTE_VALUE",
        "This replaces the negative bracket result by its positive magnitude before multiplication.",
      ),
      trap(
        subtractRational(multiplyRational(negativeGroup, factor), tail),
        "DROPPED_NEGATIVE_SIGN",
        "This changes the final addition into subtraction after carrying the negative grouped product.",
      ),
      trap(
        addRational(
          subtractRational(left, multiplyRational(right, factor)),
          tail,
        ),
        "IGNORED_GROUPING_IN_SIGNED_EXPRESSION",
        "This multiplies only the second fraction and ignores that the entire bracket is one factor.",
      ),
    ]),
    concept: "A negative fraction obtained inside a bracket keeps its sign when the complete bracket is multiplied and later combined.",
    strategy: "Evaluate the bracket first, retain its negative sign, multiply the complete bracket value, then add the final fraction.",
    steps: Object.freeze([
      `${leftNumerator}/${denominator} − ${rightNumerator}/${denominator} = −${gap}/${denominator}.`,
      `Multiply −${gap}/${denominator} by ${factorNumerator}/${factorDenominator}.`,
      `Add ${tailNumerator}/${tailDenominator} and reduce the signed result.`,
    ]),
    speedMethod: "Write the bracket result with its sign before any cancellation; never replace a negative difference by its magnitude.",
    difficultyEvidence: Object.freeze([
      "a guaranteed negative intermediate must be propagated through fraction multiplication",
      difficulty === "HARD" ? "the final sign depends on the outside fraction" : "same-denominator signed bracket",
    ]),
    hiddenState: Object.freeze({
      leftNumerator,
      rightNumerator,
      denominator,
      gap,
      factorNumerator,
      factorDenominator,
      tailNumerator,
      tailDenominator,
      negativeIntermediate: `-${gap}/${denominator}`,
    }),
  };
}

function stateFor(
  prototypeId: SapCp002Wave01PrototypeId,
  rng: DeterministicRng,
  difficulty: SapCp002Difficulty,
  seed: number,
): PrototypeState {
  switch (prototypeId) {
    case "SAP-CP002-PROT-FRACTION-SUM-DIFFERENCE":
      return stateForSumDifference(rng, difficulty, seed);
    case "SAP-CP002-PROT-FRACTION-PRODUCT-CANCELLATION":
      return stateForProductCancellation(rng, difficulty);
    case "SAP-CP002-PROT-FRACTION-DIVISION-RECIPROCAL":
      return stateForDivisionReciprocal(rng, difficulty);
    case "SAP-CP002-PROT-MIXED-FRACTION-OPERATION-CHAIN":
      return stateForMixedOperationChain(rng, difficulty);
    case "SAP-CP002-PROT-MIXED-NUMBERS-CONVERT-EVALUATE":
      return stateForMixedNumbers(rng, difficulty, seed);
    case "SAP-CP002-PROT-FRACTION-OF-FRACTION":
      return stateForFractionOfFraction(rng, difficulty);
    case "SAP-CP002-PROT-NESTED-COMPLEX-FRACTION":
      return stateForComplexFraction(rng, difficulty);
    case "SAP-CP002-PROT-SIGNED-FRACTION-BRACKETS":
      return stateForSignedBrackets(rng, difficulty);
  }
}

function fallbackTrap(answer: Rational, offset: number): SapCp002TrapCandidate {
  const delta = rational(BigInt(offset));
  return trap(
    offset % 2 === 0 ? addRational(answer, delta) : subtractRational(answer, delta),
    offset % 2 === 0 ? "FINAL_ARITHMETIC_PLUS_ONE" : "FINAL_ARITHMETIC_MINUS_ONE",
    "This follows the main method but introduces a small final arithmetic error.",
  );
}

function buildOptions(
  answer: Rational,
  traps: readonly SapCp002TrapCandidate[],
  correctIndex: number,
): readonly SapCp002Wave01Option[] {
  const uniqueWrong: SapCp002TrapCandidate[] = [];
  for (const candidate of traps) {
    if (equalRational(candidate.value, answer)) continue;
    if (uniqueWrong.some((entry) => equalRational(entry.value, candidate.value))) continue;
    uniqueWrong.push(candidate);
  }
  let offset = 1;
  while (uniqueWrong.length < 3) {
    const candidate = fallbackTrap(answer, offset++);
    if (equalRational(candidate.value, answer)) continue;
    if (uniqueWrong.some((entry) => equalRational(entry.value, candidate.value))) continue;
    uniqueWrong.push(candidate);
  }

  const options: SapCp002Wave01Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(Object.freeze({
        value: formatRational(answer),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This is the exact reduced value of the displayed fraction expression.",
      }));
    } else {
      const candidate = uniqueWrong[wrongIndex++]!;
      options.push(Object.freeze({
        value: formatRational(candidate.value),
        isCorrect: false,
        misconceptionId: candidate.misconceptionId,
        analysis: candidate.analysis,
      }));
    }
  }
  return Object.freeze(options);
}

function explanationFor(
  state: PrototypeState,
  renderedExpression: string,
  answer: string,
  options: readonly SapCp002Wave01Option[],
): SapCp002Wave01Explanation {
  return Object.freeze({
    coreConcept: state.concept,
    givenDataAndStrategy: `For ${renderedExpression}, ${state.strategy}`,
    stepByStep: state.steps,
    examSpeedMethod: state.speedMethod,
    commonTraps: Object.freeze(options.filter((option) => !option.isCorrect).map((option) => option.analysis)),
    finalAnswer: `Therefore, the simplified value is ${answer}.`,
  });
}

function validatePackage(pkg: Omit<SapCp002Wave01Package, "validation">): readonly string[] {
  const errors: string[] = [];
  if (pkg.canonicalAnswer !== pkg.verifierAnswer) errors.push("Canonical and independent answers differ.");
  if (pkg.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(pkg.options.map((option) => option.value)).size !== 4) errors.push("Options must be unique.");
  if (pkg.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (!pkg.options[pkg.correctIndex]?.isCorrect) errors.push("correctIndex does not identify the correct option.");
  if (pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Correct option differs from the exact answer.");
  if (pkg.options.some((option) => !option.isCorrect && (!option.misconceptionId || option.analysis.length < 20))) {
    errors.push("Each wrong option requires misconception evidence.");
  }
  if (pkg.explanation.stepByStep.length < 3) errors.push("Explanation needs at least three concrete steps.");
  if (pkg.explanation.commonTraps.length !== 3) errors.push("Explanation must expose three option-linked traps.");
  if (!pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer)) errors.push("Final answer omits the canonical value.");
  if (pkg.permanentQlId !== null || pkg.lifecycle.permanentQlId !== null) errors.push("Permanent identity leaked into discovery.");
  if (pkg.lifecycle.active || pkg.lifecycle.questionStudioDiscoverable || pkg.lifecycle.questionBankWritable
    || pkg.lifecycle.testEligible || pkg.lifecycle.publiclyPublishable) {
    errors.push("Discovery content escaped lifecycle locks.");
  }
  return Object.freeze(errors);
}

export function generateSapCp002Wave01Package(
  prototypeId: SapCp002Wave01PrototypeId,
  seed: number,
): SapCp002Wave01Package {
  assertPositiveInteger(seed, "SAP-CP-002 Wave 01 seed");
  if (!SAP_CP002_WAVE01_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown SAP-CP-002 Wave 01 prototype: ${prototypeId}`);
  }
  const difficulty = difficultyForSeed(seed);
  const rng = new DeterministicRng(`${prototypeId}:${seed}`);
  const state = stateFor(prototypeId, rng, difficulty, seed);
  const compiled = compileFractionExpression(state.expression);
  const canonical = evaluateExact(compiled);
  const independent = evaluateFractionExpressionIndependent(state.expression);
  const canonicalAnswer = formatRational(canonical.value);
  const verifierAnswer = formatRational(independent.value);
  const renderedExpression = renderFractionExpression(state.expression);
  const correctIndex = (seed + prototypeIndex(prototypeId)) % 4;
  const options = buildOptions(canonical.value, state.trapCandidates, correctIndex);
  const base = {
    packageId: SAP_001_PACKAGE_ID,
    checkpointId: SAP_CP_002_ID,
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    locale: "en-IN" as const,
    seed,
    difficulty,
    difficultyEvidence: state.difficultyEvidence,
    taskDirection: "FORWARD" as const,
    answerSemantic: "SIMPLIFIED_RATIONAL" as const,
    stem: `Simplify ${renderedExpression} and give the answer in lowest terms.`,
    expression: state.expression,
    renderedExpression,
    canonicalAnswer,
    verifierAnswer,
    canonicalTrace: canonical.trace,
    independentTrace: independent.trace,
    options,
    correctIndex,
    explanation: explanationFor(state, renderedExpression, canonicalAnswer, options),
    hiddenState: state.hiddenState,
    mathematicalFingerprint: `${prototypeId}|${fractionExpressionFingerprint(state.expression)}|${canonicalAnswer}`,
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: Object.freeze([prototypeId, "SAP-CP-002-WAVE01"]),
    lifecycle: LIFECYCLE,
  } satisfies Omit<SapCp002Wave01Package, "validation">;
  const errors = validatePackage(base);
  return Object.freeze({
    ...base,
    validation: Object.freeze({ ok: errors.length === 0, errors }),
  });
}

export function generateSapCp002Wave01Sweep(
  seedsPerPrototype: number,
): readonly SapCp002Wave01Package[] {
  assertPositiveInteger(seedsPerPrototype, "SAP-CP-002 Wave 01 seeds per prototype");
  const packages: SapCp002Wave01Package[] = [];
  for (const prototypeId of SAP_CP002_WAVE01_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp002Wave01Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}
