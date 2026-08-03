import {
  formatRational,
  rational,
  type Rational,
} from "../../../shared/exact-rational";
import {
  binaryNode,
  expressionFingerprint,
  factorialNode,
  groupNode,
  negateNode,
  powerNode,
  valueNode,
  type BracketStyle,
  type ExpressionNode,
} from "../../../shared/expression-ast";
import { evaluateExact } from "../../../shared/exact-evaluator";
import { evaluateIndependent } from "../../../shared/independent-evaluator";
import { renderExpression } from "../../../shared/expression-renderer";
import {
  SAP_001_PACKAGE_ID,
  SAP_CP_001_ID,
  SAP_CP001_WAVE01_PROTOTYPE_IDS,
  type SapCp001Explanation,
  type SapCp001MisconceptionId,
  type SapCp001Option,
  type SapCp001Wave01Package,
  type SapCp001Wave01PrototypeId,
  type SapDifficulty,
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
  "uploaded simplification and quantitative-aptitude source fixtures",
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
  readonly expression: ExpressionNode;
  readonly trapCandidates: readonly TrapCandidate[];
  readonly hiddenState: Readonly<Record<string, string | number | boolean>>;
  readonly concept: string;
  readonly strategy: string;
  readonly speedMethod: string;
  readonly difficultyEvidence: readonly string[];
}

interface TrapCandidate {
  readonly value: Rational;
  readonly misconceptionId: SapCp001MisconceptionId;
  readonly analysis: string;
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function difficultyForSeed(seed: number): SapDifficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

function prototypeIndex(prototypeId: SapCp001Wave01PrototypeId): number {
  return SAP_CP001_WAVE01_PROTOTYPE_IDS.indexOf(prototypeId);
}

function bracketStyleForSeed(seed: number): BracketStyle {
  return (["ROUND", "SQUARE", "CURLY"] as const)[seed % 3]!;
}

function evaluateValue(expression: ExpressionNode): Rational {
  return evaluateExact(expression).value;
}

function trap(
  expression: ExpressionNode,
  misconceptionId: SapCp001MisconceptionId,
  analysis: string,
): TrapCandidate {
  return Object.freeze({ value: evaluateValue(expression), misconceptionId, analysis });
}

function integerNode(value: number): ExpressionNode {
  return valueNode(BigInt(value));
}

function stateForFlatMixedOperations(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
): PrototypeState {
  const a = rng.int(4, difficulty === "HARD" ? 35 : 20);
  const b = rng.int(2, difficulty === "EASY" ? 6 : 11);
  const c = rng.int(2, difficulty === "HARD" ? 12 : 8);
  const d = rng.int(1, difficulty === "EASY" ? 9 : 18);
  const expression = binaryNode(
    "SUBTRACT",
    binaryNode("ADD", integerNode(a), binaryNode("MULTIPLY", integerNode(b), integerNode(c))),
    integerNode(d),
  );
  const wrongLeftToRight = binaryNode(
    "SUBTRACT",
    binaryNode("MULTIPLY", binaryNode("ADD", integerNode(a), integerNode(b)), integerNode(c)),
    integerNode(d),
  );
  const wrongAdditionFirst = binaryNode(
    "MULTIPLY",
    binaryNode("SUBTRACT", binaryNode("ADD", integerNode(a), integerNode(b)), integerNode(d)),
    integerNode(c),
  );
  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        wrongLeftToRight,
        "EVALUATED_STRICTLY_LEFT_TO_RIGHT",
        "This performs the visible operations strictly from left to right and ignores multiplication precedence.",
      ),
      trap(
        wrongAdditionFirst,
        "ADDED_BEFORE_SUBTRACTING",
        "This combines the addition and subtraction before completing the multiplication.",
      ),
      trap(
        negateNode(expression),
        "SIGN_SLIP",
        "This keeps the magnitude but reverses the final sign.",
      ),
    ]),
    hiddenState: Object.freeze({ a, b, c, d, materialDecision: "MULTIPLICATION_BEFORE_ADDITION" }),
    concept: "Multiplication must be completed before addition or subtraction unless grouping changes the scope.",
    strategy: "Resolve the multiplication first, then complete addition and subtraction in the AST-defined order.",
    speedMethod: "Mark the multiplication block mentally before touching the surrounding plus and minus signs.",
    difficultyEvidence: Object.freeze([
      "one material precedence decision",
      difficulty === "HARD" ? "larger signed final arithmetic" : "compact integer arithmetic",
    ]),
  };
}

function stateForMultiplyDivideLeftToRight(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
): PrototypeState {
  const divisor = rng.int(2, difficulty === "EASY" ? 6 : 10);
  const quotient = rng.int(2, difficulty === "HARD" ? 14 : 9);
  const multiplier = rng.int(2, difficulty === "HARD" ? 12 : 8);
  const dividend = divisor * quotient;
  const expression = binaryNode(
    "MULTIPLY",
    binaryNode("DIVIDE", integerNode(dividend), integerNode(divisor)),
    integerNode(multiplier),
  );
  const wrongGroupedDivisor = binaryNode(
    "DIVIDE",
    integerNode(dividend),
    binaryNode("MULTIPLY", integerNode(divisor), integerNode(multiplier)),
  );
  const wrongMultiplyFirst = binaryNode(
    "DIVIDE",
    binaryNode("MULTIPLY", integerNode(dividend), integerNode(multiplier)),
    integerNode(divisor),
  );
  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        wrongGroupedDivisor,
        "MULTIPLIED_DIVISOR_BEFORE_DIVIDING",
        "This incorrectly treats division as if it had lower priority than the multiplication to its right.",
      ),
      trap(
        negateNode(expression),
        "SIGN_SLIP",
        "This introduces an unsupported negative sign after the correct magnitude is found.",
      ),
      trap(
        binaryNode("ADD", wrongMultiplyFirst, integerNode(1)),
        "FINAL_ARITHMETIC_PLUS_ONE",
        "This follows a compatible route but makes a one-unit final arithmetic slip.",
      ),
    ]),
    hiddenState: Object.freeze({ dividend, divisor, multiplier, materialDecision: "EQUAL_PRECEDENCE_LEFT_TO_RIGHT" }),
    concept: "Multiplication and division have equal precedence and are evaluated from left to right.",
    strategy: "First divide the left pair, then multiply the quotient by the final factor.",
    speedMethod: "Read the chain as two consecutive operations: dividend ÷ divisor, then × multiplier.",
    difficultyEvidence: Object.freeze([
      "associativity is the principal tested decision",
      difficulty === "HARD" ? "less familiar factor combination" : "clean exact division",
    ]),
  };
}

function stateForAddSubtractLeftToRight(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
): PrototypeState {
  const a = rng.int(difficulty === "HARD" ? 25 : 12, difficulty === "HARD" ? 60 : 35);
  const b = rng.int(3, difficulty === "EASY" ? 10 : 20);
  const c = rng.int(2, difficulty === "HARD" ? 18 : 12);
  const expression = binaryNode("ADD", binaryNode("SUBTRACT", integerNode(a), integerNode(b)), integerNode(c));
  const wrongGrouped = binaryNode("SUBTRACT", integerNode(a), binaryNode("ADD", integerNode(b), integerNode(c)));
  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        wrongGrouped,
        "ADDED_BEFORE_SUBTRACTING",
        "This wrongly groups the last two terms and computes a − (b + c).",
      ),
      trap(
        binaryNode("SUBTRACT", binaryNode("ADD", integerNode(a), integerNode(c)), integerNode(b + 1)),
        "FINAL_ARITHMETIC_MINUS_ONE",
        "This uses the right order but loses one unit in the final subtraction.",
      ),
      trap(
        negateNode(expression),
        "SIGN_SLIP",
        "This reverses the sign of the correctly evaluated chain.",
      ),
    ]),
    hiddenState: Object.freeze({ a, b, c, materialDecision: "ADD_SUBTRACT_LEFT_TO_RIGHT" }),
    concept: "Addition and subtraction have equal precedence and are evaluated from left to right.",
    strategy: "Subtract the second number from the first, then add the third number.",
    speedMethod: "Carry the running total from left to right; do not invent brackets around the last two terms.",
    difficultyEvidence: Object.freeze([
      "equal-precedence left-to-right decision",
      difficulty === "HARD" ? "negative intermediate is possible in neighbouring states" : "short signed chain",
    ]),
  };
}

function stateForNestedGrouping(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
  seed: number,
): PrototypeState {
  const a = rng.int(3, difficulty === "HARD" ? 18 : 12);
  const b = rng.int(2, difficulty === "EASY" ? 8 : 13);
  const d = rng.int(1, difficulty === "EASY" ? 5 : 9);
  const c = d + rng.int(2, difficulty === "HARD" ? 12 : 8);
  const leftStyle = bracketStyleForSeed(seed);
  const rightStyle = bracketStyleForSeed(seed + 1);
  const expression = binaryNode(
    "MULTIPLY",
    groupNode(binaryNode("ADD", integerNode(a), integerNode(b)), leftStyle),
    groupNode(binaryNode("SUBTRACT", integerNode(c), integerNode(d)), rightStyle),
  );
  const wrongIgnoreGrouping = binaryNode(
    "SUBTRACT",
    binaryNode("ADD", integerNode(a), binaryNode("MULTIPLY", integerNode(b), integerNode(c))),
    integerNode(d),
  );
  const wrongSecondGroup = binaryNode(
    "MULTIPLY",
    binaryNode("ADD", integerNode(a), integerNode(b)),
    binaryNode("ADD", integerNode(c), integerNode(d)),
  );
  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        wrongIgnoreGrouping,
        "IGNORED_EXPLICIT_GROUPING",
        "This removes the explicit groups and applies ordinary precedence to a different expression.",
      ),
      trap(
        wrongSecondGroup,
        "SIGN_SLIP",
        "This changes the subtraction inside the second group into addition.",
      ),
      trap(
        negateNode(expression),
        "SIGN_SLIP",
        "This evaluates both groups correctly but reverses the final sign.",
      ),
    ]),
    hiddenState: Object.freeze({ a, b, c, d, leftStyle, rightStyle, materialDecision: "GROUPS_BEFORE_OUTER_PRODUCT" }),
    concept: "Bracket nesting defines scope; bracket shape is only a readability choice.",
    strategy: "Evaluate each complete group independently and multiply the two group values.",
    speedMethod: "Write one small result above each bracket, then perform only the outer multiplication.",
    difficultyEvidence: Object.freeze([
      difficulty === "HARD" ? "two grouped subexpressions" : "one outer operation after grouping",
      `mixed bracket rendering: ${leftStyle}/${rightStyle}`,
    ]),
  };
}

function stateForSignedArithmetic(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
): PrototypeState {
  const a = rng.int(difficulty === "HARD" ? 12 : 5, difficulty === "HARD" ? 28 : 16);
  const b = rng.int(2, difficulty === "EASY" ? 6 : 10);
  const c = rng.int(2, difficulty === "HARD" ? 8 : 6);
  const expression = binaryNode("ADD", negateNode(integerNode(a)), binaryNode("MULTIPLY", integerNode(b), integerNode(c)));
  const wrongDroppedSign = binaryNode("ADD", integerNode(a), binaryNode("MULTIPLY", integerNode(b), integerNode(c)));
  const wrongNegatedProduct = negateNode(binaryNode("ADD", integerNode(a), binaryNode("MULTIPLY", integerNode(b), integerNode(c))));
  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        wrongDroppedSign,
        "DROPPED_UNARY_NEGATIVE",
        "This treats the negative first operand as positive.",
      ),
      trap(
        wrongNegatedProduct,
        "SIGN_SLIP",
        "This incorrectly applies the negative sign to the entire expression.",
      ),
      trap(
        binaryNode("SUBTRACT", negateNode(integerNode(a)), binaryNode("MULTIPLY", integerNode(b), integerNode(c))),
        "SIGN_SLIP",
        "This changes the visible plus sign before the product into subtraction.",
      ),
    ]),
    hiddenState: Object.freeze({ a, b, c, materialDecision: "UNARY_SIGN_BOUND_TO_OPERAND" }),
    concept: "A unary negative belongs to its operand; multiplication is still resolved before the surrounding addition.",
    strategy: "Compute the product, retain the first number's negative sign, then combine the signed values.",
    speedMethod: "Rewrite mentally as product minus a when that makes the sign combination clearer.",
    difficultyEvidence: Object.freeze([
      "unary sign and precedence interact",
      difficulty === "HARD" ? "answer may cross zero" : "single signed combination",
    ]),
  };
}

function stateForScopedOf(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
  seed: number,
): PrototypeState {
  const a = rng.int(2, difficulty === "HARD" ? 12 : 8);
  const b = rng.int(2, difficulty === "EASY" ? 7 : 10);
  const c = rng.int(2, difficulty === "HARD" ? 9 : 6);
  const d = rng.int(1, difficulty === "EASY" ? 6 : 12);
  const style = bracketStyleForSeed(seed);
  const expression = binaryNode(
    "SUBTRACT",
    binaryNode("OF", groupNode(binaryNode("ADD", integerNode(a), integerNode(b)), style), integerNode(c)),
    integerNode(d),
  );
  const wrongIncompleteScope = binaryNode(
    "SUBTRACT",
    binaryNode("ADD", integerNode(a), binaryNode("MULTIPLY", integerNode(b), integerNode(c))),
    integerNode(d),
  );
  const wrongLateOf = binaryNode(
    "MULTIPLY",
    binaryNode("SUBTRACT", binaryNode("ADD", integerNode(a), integerNode(b)), integerNode(d)),
    integerNode(c),
  );
  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        wrongIncompleteScope,
        "APPLIED_OF_TO_INCOMPLETE_SCOPE",
        "This applies ‘of’ only to the last term inside the displayed group.",
      ),
      trap(
        wrongLateOf,
        "APPLIED_OF_TO_INCOMPLETE_SCOPE",
        "This lets the final subtraction enter the ‘of’ scope even though it is outside the group.",
      ),
      trap(
        negateNode(expression),
        "SIGN_SLIP",
        "This preserves the magnitude but reverses the final sign.",
      ),
    ]),
    hiddenState: Object.freeze({ a, b, c, d, bracketStyle: style, materialDecision: "EXPLICIT_OF_SCOPE" }),
    concept: "The word ‘of’ acts as multiplication only over its explicitly rendered left and right operands.",
    strategy: "Finish the bracket, multiply that complete value by c, and only then subtract d.",
    speedMethod: "Draw a mental box around the two operands joined by ‘of’; nothing outside that box participates.",
    difficultyEvidence: Object.freeze([
      "scope of ‘of’ is materially tested",
      difficulty === "HARD" ? "outer subtraction competes with the scoped product" : "one explicit bracket scope",
    ]),
  };
}

function stateForPowerBeforeArithmetic(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
): PrototypeState {
  const a = rng.int(2, difficulty === "HARD" ? 18 : 10);
  const b = rng.int(2, difficulty === "EASY" ? 5 : 7);
  const exponent = difficulty === "HARD" && rng.int(0, 1) === 1 ? 3 : 2;
  const c = rng.int(2, difficulty === "HARD" ? 7 : 5);
  const d = rng.int(1, difficulty === "EASY" ? 8 : 15);
  const expression = binaryNode(
    "SUBTRACT",
    binaryNode("ADD", integerNode(a), binaryNode("MULTIPLY", powerNode(integerNode(b), BigInt(exponent)), integerNode(c))),
    integerNode(d),
  );
  const wrongAddBeforePower = binaryNode(
    "SUBTRACT",
    binaryNode("MULTIPLY", powerNode(binaryNode("ADD", integerNode(a), integerNode(b)), BigInt(exponent)), integerNode(c)),
    integerNode(d),
  );
  const wrongPowerAfterMultiply = binaryNode(
    "SUBTRACT",
    binaryNode("ADD", integerNode(a), powerNode(binaryNode("MULTIPLY", integerNode(b), integerNode(c)), BigInt(exponent))),
    integerNode(d),
  );
  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        wrongAddBeforePower,
        "ADDED_BEFORE_APPLYING_POWER",
        "This makes the addition part of the power's base even though it is outside the exponent scope.",
      ),
      trap(
        wrongPowerAfterMultiply,
        "ADDED_BEFORE_APPLYING_POWER",
        "This raises the product b × c to the power instead of raising only b.",
      ),
      trap(
        negateNode(expression),
        "SIGN_SLIP",
        "This reverses the sign after otherwise correct power evaluation.",
      ),
    ]),
    hiddenState: Object.freeze({ a, b, c, d, exponent, materialDecision: "POWER_BEFORE_PRODUCT_AND_SUM" }),
    concept: "A power is evaluated on its exact base before multiplication, addition or subtraction.",
    strategy: "Evaluate b^n, multiply by c, then finish the surrounding addition and subtraction.",
    speedMethod: "Replace the power with its small exact value before reading the rest of the expression.",
    difficultyEvidence: Object.freeze([
      exponent === 3 ? "cube embedded in a mixed expression" : "square embedded in a mixed expression",
      difficulty === "HARD" ? "three later arithmetic stages" : "short post-power chain",
    ]),
  };
}

function stateForFactorialBeforeArithmetic(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
): PrototypeState {
  const n = rng.int(difficulty === "EASY" ? 4 : 5, difficulty === "HARD" ? 7 : 6);
  const divisor = rng.pick(n >= 6 ? [n, n * (n - 1)] : [n, n - 1]);
  const k = rng.int(1, difficulty === "EASY" ? 7 : 14);
  const expression = binaryNode(
    "ADD",
    binaryNode("DIVIDE", factorialNode(integerNode(n)), integerNode(divisor)),
    integerNode(k),
  );
  const wrongOrdinaryMultiplication = binaryNode(
    "ADD",
    binaryNode("DIVIDE", integerNode(n * (n - 1)), integerNode(divisor)),
    integerNode(k),
  );
  const wrongFactorialAfterDivision = binaryNode(
    "ADD",
    factorialNode(integerNode(Math.floor(n / Math.max(1, divisor / n)))),
    integerNode(k),
  );
  return {
    expression,
    trapCandidates: Object.freeze([
      trap(
        wrongOrdinaryMultiplication,
        "TREATED_FACTORIAL_AS_ORDINARY_MULTIPLICATION",
        "This replaces n! with only n × (n − 1) and drops the remaining factors.",
      ),
      trap(
        wrongFactorialAfterDivision,
        "TREATED_FACTORIAL_AS_ORDINARY_MULTIPLICATION",
        "This divides the visible n before applying factorial, changing the operand's scope.",
      ),
      trap(
        binaryNode("SUBTRACT", binaryNode("DIVIDE", factorialNode(integerNode(n)), integerNode(divisor)), integerNode(k)),
        "SIGN_SLIP",
        "This changes the final addition into subtraction.",
      ),
    ]),
    hiddenState: Object.freeze({ n, divisor, k, materialDecision: "FACTORIAL_BEFORE_DIVISION_AND_ADDITION" }),
    concept: "Factorial is completed on its exact operand before division or addition.",
    strategy: "Evaluate n!, divide by the stated exact factor, then add k.",
    speedMethod: "Cancel the visible divisor against the leading factors of n! instead of expanding the whole factorial.",
    difficultyEvidence: Object.freeze([
      difficulty === "HARD" ? "factorial cancellation with a composite divisor" : "small bounded factorial",
      "factorial scope is material",
    ]),
  };
}

function buildPrototypeState(
  prototypeId: SapCp001Wave01PrototypeId,
  seed: number,
  difficulty: SapDifficulty,
  rng: DeterministicRng,
): PrototypeState {
  switch (prototypeId) {
    case "SAP-CP001-PROT-FLAT-MIXED-OPERATIONS":
      return stateForFlatMixedOperations(rng, difficulty);
    case "SAP-CP001-PROT-MULTIPLY-DIVIDE-LEFT-TO-RIGHT":
      return stateForMultiplyDivideLeftToRight(rng, difficulty);
    case "SAP-CP001-PROT-ADD-SUBTRACT-LEFT-TO-RIGHT":
      return stateForAddSubtractLeftToRight(rng, difficulty);
    case "SAP-CP001-PROT-NESTED-GROUPING":
      return stateForNestedGrouping(rng, difficulty, seed);
    case "SAP-CP001-PROT-SIGNED-ARITHMETIC":
      return stateForSignedArithmetic(rng, difficulty);
    case "SAP-CP001-PROT-SCOPED-OF-MULTIPLICATION":
      return stateForScopedOf(rng, difficulty, seed);
    case "SAP-CP001-PROT-POWER-BEFORE-ARITHMETIC":
      return stateForPowerBeforeArithmetic(rng, difficulty);
    case "SAP-CP001-PROT-FACTORIAL-BEFORE-ARITHMETIC":
      return stateForFactorialBeforeArithmetic(rng, difficulty);
  }
}

function fallbackTrapCandidates(answer: Rational): readonly TrapCandidate[] {
  const base = answer.numerator / answer.denominator;
  return Object.freeze([
    Object.freeze({
      value: rational(base + 1n),
      misconceptionId: "FINAL_ARITHMETIC_PLUS_ONE" as const,
      analysis: "This is a one-unit overcount in the final arithmetic step.",
    }),
    Object.freeze({
      value: rational(base - 1n),
      misconceptionId: "FINAL_ARITHMETIC_MINUS_ONE" as const,
      analysis: "This is a one-unit undercount in the final arithmetic step.",
    }),
    Object.freeze({
      value: rational(-answer.numerator, answer.denominator),
      misconceptionId: "SIGN_SLIP" as const,
      analysis: "This has the correct magnitude but the wrong sign.",
    }),
    Object.freeze({
      value: rational(base + 2n),
      misconceptionId: "FINAL_ARITHMETIC_PLUS_ONE" as const,
      analysis: "This carries a small final arithmetic overcount.",
    }),
    Object.freeze({
      value: rational(base - 2n),
      misconceptionId: "FINAL_ARITHMETIC_MINUS_ONE" as const,
      analysis: "This carries a small final arithmetic undercount.",
    }),
  ]);
}

function buildOptions(
  answer: Rational,
  trapCandidates: readonly TrapCandidate[],
  correctIndex: number,
): readonly SapCp001Option[] {
  const answerText = formatRational(answer);
  const uniqueWrong = new Map<string, TrapCandidate>();
  for (const candidate of [...trapCandidates, ...fallbackTrapCandidates(answer)]) {
    const value = formatRational(candidate.value);
    if (value !== answerText && !uniqueWrong.has(value)) uniqueWrong.set(value, candidate);
    if (uniqueWrong.size >= 3) break;
  }
  if (uniqueWrong.size < 3) throw new Error("Unable to construct three unique misconception options.");
  const wrong = [...uniqueWrong.entries()].slice(0, 3);
  const options: SapCp001Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(Object.freeze({
        value: answerText,
        isCorrect: true,
        misconceptionId: null,
        analysis: "This matches both the canonical AST evaluator and the independent RPN verifier.",
      }));
    } else {
      const [value, candidate] = wrong[wrongIndex]!;
      options.push(Object.freeze({
        value,
        isCorrect: false,
        misconceptionId: candidate.misconceptionId,
        analysis: candidate.analysis,
      }));
      wrongIndex += 1;
    }
  }
  return Object.freeze(options);
}

function explanationFor(
  state: PrototypeState,
  renderedExpression: string,
  answer: string,
  trace: readonly { operation: string; input: string; output: string }[],
  options: readonly SapCp001Option[],
): SapCp001Explanation {
  const operationNames: Record<string, string> = {
    ADD: "Add",
    SUBTRACT: "Subtract",
    MULTIPLY: "Multiply",
    DIVIDE: "Divide",
    OF: "Apply the scoped ‘of’ multiplication",
    NEGATE: "Apply the unary negative",
    POWER: "Evaluate the power",
    FACTORIAL: "Evaluate the factorial",
  };
  const stepByStep = trace.map((step, index) => (
    `${index + 1}. ${operationNames[step.operation] ?? step.operation}: ${step.input} → ${step.output}.`
  ));
  return Object.freeze({
    coreConcept: state.concept,
    givenDataAndStrategy: `For ${renderedExpression}, ${state.strategy}`,
    stepByStep: Object.freeze(stepByStep),
    examSpeedMethod: state.speedMethod,
    commonTraps: Object.freeze(options.filter((option) => !option.isCorrect).map((option) => option.analysis)),
    finalAnswer: `Therefore, the exact value is ${answer}.`,
  });
}

function validatePackage(pkg: Omit<SapCp001Wave01Package, "validation">): readonly string[] {
  const errors: string[] = [];
  if (pkg.canonicalAnswer !== pkg.verifierAnswer) errors.push("Canonical and verifier answers differ.");
  if (pkg.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(pkg.options.map((option) => option.value)).size !== 4) errors.push("Options are not unique.");
  if (pkg.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (!pkg.options[pkg.correctIndex]?.isCorrect) errors.push("correctIndex does not point to the correct option.");
  if (pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Correct option value differs from answer.");
  if (pkg.renderedExpression.includes("÷ ") && /÷ [^()]+\(/.test(pkg.renderedExpression)) {
    errors.push("Potentially ambiguous implicit multiplication was rendered after division.");
  }
  if (pkg.permanentQlId !== null || pkg.lifecycle.permanentQlId !== null) errors.push("Permanent QL identity leaked into discovery.");
  if (pkg.lifecycle.questionStudioDiscoverable || pkg.lifecycle.publiclyPublishable) {
    errors.push("Discovery content is incorrectly exposed.");
  }
  return Object.freeze(errors);
}

export function generateSapCp001Wave01Package(
  prototypeId: SapCp001Wave01PrototypeId,
  seed: number,
): SapCp001Wave01Package {
  assertPositiveInteger(seed, "SAP-CP-001 Wave 01 seed");
  if (!SAP_CP001_WAVE01_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown SAP-CP-001 Wave 01 prototype: ${prototypeId}`);
  }
  const difficulty = difficultyForSeed(seed);
  const rng = new DeterministicRng(`${prototypeId}:${seed}`);
  const state = buildPrototypeState(prototypeId, seed, difficulty, rng);
  const canonical = evaluateExact(state.expression);
  const verifier = evaluateIndependent(state.expression);
  const canonicalAnswer = formatRational(canonical.value);
  const verifierAnswer = formatRational(verifier);
  const correctIndex = (seed + prototypeIndex(prototypeId)) % 4;
  const options = buildOptions(canonical.value, state.trapCandidates, correctIndex);
  const renderedExpression = renderExpression(state.expression);
  const basePackage = Object.freeze({
    packageId: SAP_001_PACKAGE_ID,
    checkpointId: SAP_CP_001_ID,
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    locale: "en-IN" as const,
    seed,
    difficulty,
    difficultyEvidence: state.difficultyEvidence,
    taskDirection: "FORWARD" as const,
    answerSemantic: "EXACT_VALUE" as const,
    stem: `Find the exact value of ${renderedExpression}.`,
    expression: state.expression,
    renderedExpression,
    canonicalAnswer,
    verifierAnswer,
    canonicalTrace: canonical.trace,
    options,
    correctIndex,
    explanation: explanationFor(state, renderedExpression, canonicalAnswer, canonical.trace, options),
    hiddenState: state.hiddenState,
    mathematicalFingerprint: `${prototypeId}|${expressionFingerprint(state.expression)}|${canonicalAnswer}`,
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: Object.freeze([prototypeId, "SAP-CP-001-WAVE01"]),
    lifecycle: LIFECYCLE,
  });
  const errors = validatePackage(basePackage);
  return Object.freeze({
    ...basePackage,
    validation: Object.freeze({ ok: errors.length === 0, errors }),
  });
}

export function generateSapCp001Wave01Sweep(
  seedsPerPrototype: number,
): readonly SapCp001Wave01Package[] {
  assertPositiveInteger(seedsPerPrototype, "SAP-CP-001 Wave 01 seedsPerPrototype");
  const packages: SapCp001Wave01Package[] = [];
  for (const prototypeId of SAP_CP001_WAVE01_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp001Wave01Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}
