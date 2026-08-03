import {
  addRational,
  equalRational,
  formatRational,
  rational,
  subtractRational,
  type Rational,
} from "../../../shared/exact-rational";
import {
  binaryNode,
  expressionFingerprint,
  fractionBarNode,
  groupNode,
  implicitMultiplyNode,
  negateNode,
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
  SAP_CP001_WAVE03_PROTOTYPE_IDS,
  type SapCp001Wave03Explanation,
  type SapCp001Wave03MisconceptionId,
  type SapCp001Wave03Option,
  type SapCp001Wave03Package,
  type SapCp001Wave03PrototypeId,
  type SapDifficulty,
  type SapRepresentationKind,
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
  "uploaded simplification source fixtures and standard exam-expression conventions",
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
}

interface TrapCandidate {
  readonly value: Rational;
  readonly misconceptionId: SapCp001Wave03MisconceptionId;
  readonly analysis: string;
}

interface PrototypeState {
  readonly expression: ExpressionNode;
  readonly representationKind: SapRepresentationKind;
  readonly trapCandidates: readonly TrapCandidate[];
  readonly hiddenState: Readonly<Record<string, string | number | boolean>>;
  readonly concept: string;
  readonly strategy: string;
  readonly speedMethod: string;
  readonly difficultyEvidence: readonly string[];
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function integerNode(value: number): ExpressionNode {
  return valueNode(BigInt(value));
}

function difficultyForSeed(seed: number): SapDifficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

function prototypeIndex(prototypeId: SapCp001Wave03PrototypeId): number {
  return SAP_CP001_WAVE03_PROTOTYPE_IDS.indexOf(prototypeId);
}

function style(seed: number, offset: number): BracketStyle {
  return (["ROUND", "SQUARE", "CURLY"] as const)[(seed + offset) % 3]!;
}

function valueOf(expression: ExpressionNode): Rational {
  return evaluateExact(expression).value;
}

function trap(
  expression: ExpressionNode,
  misconceptionId: SapCp001Wave03MisconceptionId,
  analysis: string,
): TrapCandidate {
  return Object.freeze({ value: valueOf(expression), misconceptionId, analysis });
}

function fractionBarState(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
  seed: number,
): PrototypeState {
  const denominatorValue = rng.int(2, difficulty === "HARD" ? 12 : 8);
  const quotient = rng.int(2, difficulty === "HARD" ? 14 : 9);
  const numeratorValue = denominatorValue * quotient;
  const numeratorLeft = rng.int(1, numeratorValue - 1);
  const numeratorRight = numeratorValue - numeratorLeft;
  const denominatorRight = rng.int(1, difficulty === "HARD" ? 12 : 7);
  const denominatorLeft = denominatorValue + denominatorRight;
  const tail = rng.int(1, difficulty === "EASY" ? 7 : 14);

  const numerator = groupNode(
    binaryNode("ADD", integerNode(numeratorLeft), integerNode(numeratorRight)),
    style(seed, 0),
  );
  const denominator = groupNode(
    binaryNode("SUBTRACT", integerNode(denominatorLeft), integerNode(denominatorRight)),
    style(seed, 1),
  );
  const expression = binaryNode("ADD", fractionBarNode(numerator, denominator), integerNode(tail));

  const adjacentOnly = binaryNode(
    "ADD",
    integerNode(numeratorLeft),
    binaryNode(
      "ADD",
      fractionBarNode(integerNode(numeratorRight), denominator),
      integerNode(tail),
    ),
  );
  const denominatorDropped = binaryNode(
    "ADD",
    binaryNode(
      "SUBTRACT",
      fractionBarNode(numerator, integerNode(denominatorLeft)),
      integerNode(denominatorRight),
    ),
    integerNode(tail),
  );
  const numeratorDropped = binaryNode(
    "ADD",
    binaryNode(
      "ADD",
      integerNode(numeratorLeft),
      fractionBarNode(integerNode(numeratorRight), denominator),
    ),
    integerNode(tail),
  );

  return {
    expression,
    representationKind: "FRACTION_BAR",
    trapCandidates: Object.freeze([
      trap(
        adjacentOnly,
        "FRACTION_BAR_SCOPED_ONLY_ADJACENT_TERMS",
        "This lets the fraction bar govern only the nearest numerator term instead of the complete numerator and denominator.",
      ),
      trap(
        denominatorDropped,
        "DENOMINATOR_GROUPING_DROPPED",
        "This divides by the first denominator term and subtracts the second term outside the bar.",
      ),
      trap(
        numeratorDropped,
        "NUMERATOR_GROUPING_DROPPED",
        "This leaves the first numerator term outside the bar and divides only the second term.",
      ),
    ]),
    hiddenState: Object.freeze({
      numeratorValue,
      denominatorValue,
      quotient,
      tail,
      numeratorStyle: style(seed, 0),
      denominatorStyle: style(seed, 1),
      scopeAuthority: "COMPLETE_NUMERATOR_AND_DENOMINATOR",
    }),
    concept: "A fraction or vinculum bar groups the complete numerator and complete denominator before division.",
    strategy: "Simplify the numerator block and denominator block independently, divide those results, then apply the outside term.",
    speedMethod: "Treat the bar as two strong brackets: finish everything above and below it before dividing.",
    difficultyEvidence: Object.freeze([
      "the fraction bar changes visible scope",
      difficulty === "HARD" ? "larger grouped values and less familiar quotient" : "clean integer quotient",
    ]),
  };
}

function implicitMultiplicationState(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
  seed: number,
): PrototypeState {
  const coefficient = rng.int(2, difficulty === "HARD" ? 12 : 8);
  const left = rng.int(2, difficulty === "EASY" ? 9 : 16);
  const right = rng.int(2, difficulty === "EASY" ? 9 : 16);
  const tail = rng.int(1, difficulty === "HARD" ? 20 : 12);
  const grouped = groupNode(binaryNode("ADD", integerNode(left), integerNode(right)), style(seed, 0));
  const expression = binaryNode(
    "SUBTRACT",
    implicitMultiplyNode(integerNode(coefficient), grouped),
    integerNode(tail),
  );

  const groupingDropped = binaryNode(
    "SUBTRACT",
    binaryNode(
      "ADD",
      binaryNode("MULTIPLY", integerNode(coefficient), integerNode(left)),
      integerNode(right),
    ),
    integerNode(tail),
  );
  const readAsAddition = binaryNode(
    "SUBTRACT",
    binaryNode(
      "ADD",
      binaryNode("ADD", integerNode(coefficient), integerNode(left)),
      integerNode(right),
    ),
    integerNode(tail),
  );
  const tailPulledInside = implicitMultiplyNode(
    integerNode(coefficient),
    groupNode(
      binaryNode(
        "SUBTRACT",
        binaryNode("ADD", integerNode(left), integerNode(right)),
        integerNode(tail),
      ),
      style(seed, 1),
    ),
  );

  return {
    expression,
    representationKind: "IMPLICIT_MULTIPLICATION",
    trapCandidates: Object.freeze([
      trap(
        groupingDropped,
        "IMPLICIT_PRODUCT_GROUPING_DROPPED",
        "This multiplies only the first term inside the visible group instead of the whole grouped factor.",
      ),
      trap(
        readAsAddition,
        "IMPLICIT_PRODUCT_READ_AS_ADDITION",
        "This reads the adjacent coefficient and bracket as addition rather than multiplication.",
      ),
      trap(
        tailPulledInside,
        "COEFFICIENT_APPLIED_TO_PARTIAL_GROUP",
        "This moves the outside subtraction into the implicit product and changes its scope.",
      ),
    ]),
    hiddenState: Object.freeze({
      coefficient,
      left,
      right,
      tail,
      bracketStyle: style(seed, 0),
      ambiguityGuard: "COEFFICIENT_FOLLOWED_BY_EXPLICIT_GROUP_ONLY",
    }),
    concept: "A number written immediately before an explicit bracket multiplies the complete grouped expression.",
    strategy: "Evaluate the bracket first, multiply its result by the coefficient, then complete the outside subtraction.",
    speedMethod: "Mentally insert a multiplication sign only between the coefficient and the complete visible bracket.",
    difficultyEvidence: Object.freeze([
      "implicit multiplication is structurally unambiguous",
      difficulty === "HARD" ? "larger grouped sum and outside adjustment" : "compact coefficient-bracket product",
    ]),
  };
}

function repeatedGroupingState(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
  seed: number,
): PrototypeState {
  const left = rng.int(difficulty === "HARD" ? 18 : 12, difficulty === "HARD" ? 40 : 28);
  const middle = rng.int(2, difficulty === "EASY" ? 7 : 12);
  const right = rng.int(2, difficulty === "EASY" ? 7 : 12);
  const multiplier = rng.int(2, difficulty === "HARD" ? 8 : 5);
  const tail = rng.int(1, difficulty === "HARD" ? 12 : 7);
  const core = binaryNode(
    "SUBTRACT",
    integerNode(left),
    groupNode(binaryNode("ADD", integerNode(middle), integerNode(right)), style(seed, 0)),
  );
  const repeated = groupNode(
    groupNode(groupNode(core, style(seed, 1)), style(seed, 2)),
    style(seed, 3),
  );
  const expression = binaryNode(
    "ADD",
    binaryNode("MULTIPLY", repeated, integerNode(multiplier)),
    integerNode(tail),
  );

  const innerIgnored = binaryNode(
    "ADD",
    binaryNode(
      "MULTIPLY",
      binaryNode(
        "ADD",
        binaryNode("SUBTRACT", integerNode(left), integerNode(middle)),
        integerNode(right),
      ),
      integerNode(multiplier),
    ),
    integerNode(tail),
  );
  const shapePriority = binaryNode(
    "ADD",
    binaryNode(
      "SUBTRACT",
      integerNode(left),
      binaryNode("MULTIPLY", integerNode(middle), integerNode(right)),
    ),
    binaryNode("MULTIPLY", integerNode(multiplier), integerNode(tail)),
  );
  const changedByRedundancy = binaryNode(
    "ADD",
    binaryNode("MULTIPLY", negateNode(core), integerNode(multiplier)),
    integerNode(tail),
  );

  return {
    expression,
    representationKind: "REPEATED_GROUPING",
    trapCandidates: Object.freeze([
      trap(
        innerIgnored,
        "INNER_GROUPING_IGNORED",
        "This removes the inner bracket around the sum and changes subtraction into a left-to-right chain.",
      ),
      trap(
        shapePriority,
        "BRACKET_SHAPE_TREATED_AS_PRECEDENCE",
        "This invents a precedence difference from bracket shape instead of following actual nesting.",
      ),
      trap(
        changedByRedundancy,
        "REDUNDANT_GROUP_CHANGED_VALUE",
        "This incorrectly changes the sign merely because the same expression is enclosed by several brackets.",
      ),
    ]),
    hiddenState: Object.freeze({
      left,
      middle,
      right,
      multiplier,
      tail,
      groupingDepth: 4,
      outerStyle: style(seed, 3),
      nestingAuthority: "DEPTH_NOT_GLYPH_TYPE",
    }),
    concept: "Repeated brackets preserve value; only their nesting and the operations inside them determine scope.",
    strategy: "Work from the innermost meaningful bracket outward and ignore redundant outer wrappers after confirming their scope.",
    speedMethod: "Collapse repeated outer brackets mentally, but retain the inner bracket that changes the subtraction.",
    difficultyEvidence: Object.freeze([
      "four visible grouping levels with one material inner scope",
      difficulty === "HARD" ? "larger signed grouped result" : "compact nested arithmetic",
    ]),
  };
}

function negativeIntermediateState(
  rng: DeterministicRng,
  difficulty: SapDifficulty,
  seed: number,
): PrototypeState {
  const left = rng.int(2, difficulty === "EASY" ? 9 : 14);
  const gap = rng.int(2, difficulty === "HARD" ? 14 : 9);
  const right = left + gap;
  const multiplier = rng.int(2, difficulty === "HARD" ? 9 : 6);
  const magnitude = gap * multiplier;
  let tail = rng.int(1, magnitude + (difficulty === "HARD" ? 8 : 4));
  if (tail === magnitude) tail += 1;
  const negativeGroup = groupNode(
    binaryNode("SUBTRACT", integerNode(left), integerNode(right)),
    style(seed, 0),
  );
  const expression = binaryNode(
    "ADD",
    binaryNode("MULTIPLY", negativeGroup, integerNode(multiplier)),
    integerNode(tail),
  );

  const absoluteValueRoute = binaryNode(
    "ADD",
    binaryNode(
      "MULTIPLY",
      groupNode(binaryNode("SUBTRACT", integerNode(right), integerNode(left)), style(seed, 1)),
      integerNode(multiplier),
    ),
    integerNode(tail),
  );
  const finalSignReversed = binaryNode(
    "SUBTRACT",
    binaryNode(
      "MULTIPLY",
      groupNode(binaryNode("SUBTRACT", integerNode(right), integerNode(left)), style(seed, 1)),
      integerNode(multiplier),
    ),
    integerNode(tail),
  );
  const tailInsideProduct = binaryNode(
    "MULTIPLY",
    negativeGroup,
    binaryNode("ADD", integerNode(multiplier), integerNode(tail)),
  );

  return {
    expression,
    representationKind: "NEGATIVE_INTERMEDIATE",
    trapCandidates: Object.freeze([
      trap(
        absoluteValueRoute,
        "NEGATIVE_INTERMEDIATE_REPLACED_BY_ABSOLUTE_VALUE",
        "This replaces the negative bracket result by its absolute value before multiplication.",
      ),
      trap(
        finalSignReversed,
        "FINAL_SIGN_REVERSED",
        "This reverses the final signed result after correctly finding the intermediate magnitude.",
      ),
      trap(
        tailInsideProduct,
        "NEGATIVE_SIGN_DROPPED_AFTER_GROUPING",
        "This moves the outside addition into the multiplication and mishandles the negative grouped value.",
      ),
    ]),
    hiddenState: Object.freeze({
      left,
      right,
      gap,
      multiplier,
      tail,
      negativeIntermediate: -gap,
      finalSign: tail - magnitude < 0 ? "NEGATIVE" : "POSITIVE",
    }),
    concept: "A negative intermediate value keeps its sign through multiplication and later addition.",
    strategy: "Evaluate the bracket first, carry the negative sign into the product, and only then combine the outside term.",
    speedMethod: "Write the bracket result with its sign before multiplying; do not replace a negative difference by its magnitude.",
    difficultyEvidence: Object.freeze([
      "a forced negative intermediate must be propagated",
      difficulty === "HARD" ? "the final sign may differ from the intermediate sign" : "direct signed product and adjustment",
    ]),
  };
}

function stateFor(
  prototypeId: SapCp001Wave03PrototypeId,
  rng: DeterministicRng,
  difficulty: SapDifficulty,
  seed: number,
): PrototypeState {
  switch (prototypeId) {
    case "SAP-CP001-PROT-VINCULUM-FRACTION-BAR-SCOPE":
      return fractionBarState(rng, difficulty, seed);
    case "SAP-CP001-PROT-UNAMBIGUOUS-IMPLICIT-MULTIPLICATION":
      return implicitMultiplicationState(rng, difficulty, seed);
    case "SAP-CP001-PROT-REPEATED-GROUPING":
      return repeatedGroupingState(rng, difficulty, seed);
    case "SAP-CP001-PROT-NEGATIVE-INTERMEDIATE":
      return negativeIntermediateState(rng, difficulty, seed);
  }
}

function fallbackTrap(answer: Rational, offset: number): TrapCandidate {
  const delta = rational(BigInt(offset));
  const value = offset % 2 === 0
    ? addRational(answer, delta)
    : subtractRational(answer, delta);
  return Object.freeze({
    value,
    misconceptionId: offset % 2 === 0 ? "FINAL_ARITHMETIC_PLUS_ONE" : "FINAL_ARITHMETIC_MINUS_ONE",
    analysis: "This reflects a small final arithmetic slip after the governing scope decision.",
  });
}

function buildOptions(
  answer: Rational,
  trapCandidates: readonly TrapCandidate[],
  correctIndex: number,
): readonly SapCp001Wave03Option[] {
  const uniqueWrong: TrapCandidate[] = [];
  for (const candidate of trapCandidates) {
    if (equalRational(candidate.value, answer)) continue;
    if (uniqueWrong.some((entry) => equalRational(entry.value, candidate.value))) continue;
    uniqueWrong.push(candidate);
  }
  let offset = 1;
  while (uniqueWrong.length < 3) {
    const candidate = fallbackTrap(answer, offset);
    offset += 1;
    if (equalRational(candidate.value, answer)) continue;
    if (uniqueWrong.some((entry) => equalRational(entry.value, candidate.value))) continue;
    uniqueWrong.push(candidate);
  }

  const options: SapCp001Wave03Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(Object.freeze({
        value: formatRational(answer),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This matches the exact AST evaluation and the independent verifier.",
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
  canonicalAnswer: string,
  canonicalTrace: readonly { operation: string; input: string; output: string }[],
  options: readonly SapCp001Wave03Option[],
): SapCp001Wave03Explanation {
  return Object.freeze({
    coreConcept: state.concept,
    givenDataAndStrategy: `For ${renderedExpression}, ${state.strategy}`,
    stepByStep: Object.freeze(canonicalTrace.map((step, index) => (
      `Step ${index + 1}: apply ${step.operation} to ${step.input}; the exact result is ${step.output}.`
    ))),
    examSpeedMethod: state.speedMethod,
    commonTraps: Object.freeze(options.filter((option) => !option.isCorrect).map((option) => option.analysis)),
    finalAnswer: `Therefore, the exact value is ${canonicalAnswer}.`,
  });
}

export function generateSapCp001Wave03Package(
  prototypeId: SapCp001Wave03PrototypeId,
  seed: number,
): SapCp001Wave03Package {
  assertPositiveInteger(seed, "SAP-CP-001 Wave 03 seed");
  if (!SAP_CP001_WAVE03_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown SAP-CP-001 Wave 03 prototype: ${prototypeId}`);
  }
  const difficulty = difficultyForSeed(seed);
  const rng = new DeterministicRng(`${prototypeId}:${seed}`);
  const state = stateFor(prototypeId, rng, difficulty, seed);
  const canonical = evaluateExact(state.expression);
  const independent = evaluateIndependent(state.expression);
  const canonicalAnswer = formatRational(canonical.value);
  const verifierAnswer = formatRational(independent);
  const renderedExpression = renderExpression(state.expression);
  const correctIndex = (seed + prototypeIndex(prototypeId)) % 4;
  const options = buildOptions(canonical.value, state.trapCandidates, correctIndex);
  const validationErrors: string[] = [];

  if (canonicalAnswer !== verifierAnswer) validationErrors.push("Canonical and independent answers differ.");
  if (new Set(options.map((option) => option.value)).size !== 4) validationErrors.push("Options are not unique.");
  if (options.filter((option) => option.isCorrect).length !== 1) validationErrors.push("Exactly one option must be correct.");
  if (!options[correctIndex]?.isCorrect) validationErrors.push("Correct index does not identify the correct option.");
  if (state.representationKind === "FRACTION_BAR" && !renderedExpression.includes("⁄")) {
    validationErrors.push("Fraction-bar state was not rendered with explicit bar scope.");
  }
  if (state.representationKind === "IMPLICIT_MULTIPLICATION" && renderedExpression.includes("× (")) {
    validationErrors.push("Implicit multiplication was rendered as an explicit multiplication token.");
  }

  return Object.freeze({
    packageId: SAP_001_PACKAGE_ID,
    checkpointId: SAP_CP_001_ID,
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    locale: "en-IN",
    seed,
    difficulty,
    difficultyEvidence: state.difficultyEvidence,
    taskDirection: "FORWARD",
    answerSemantic: "EXACT_VALUE",
    representationKind: state.representationKind,
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
    mathematicalFingerprint: `${prototypeId}|${expressionFingerprint(state.expression)}`,
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: Object.freeze([prototypeId]),
    validation: Object.freeze({ ok: validationErrors.length === 0, errors: Object.freeze(validationErrors) }),
    lifecycle: LIFECYCLE,
  });
}

export function generateSapCp001Wave03Sweep(
  seedsPerPrototype: number,
): readonly SapCp001Wave03Package[] {
  assertPositiveInteger(seedsPerPrototype, "SAP-CP-001 Wave 03 seeds per prototype");
  const packages: SapCp001Wave03Package[] = [];
  for (const prototypeId of SAP_CP001_WAVE03_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp001Wave03Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}
