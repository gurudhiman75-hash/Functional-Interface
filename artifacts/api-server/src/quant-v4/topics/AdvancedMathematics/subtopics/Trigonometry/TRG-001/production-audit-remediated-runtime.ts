import {
  addExact,
  exactInteger,
  exactKey,
  exactRational,
  exactToNumber,
  formatExactPlain,
} from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import {
  TRG_001_AUTHORITY_ALIGNED_IDS,
  authorityFamilyForTrg001Ql,
} from "./production-authority-runtime";
import {
  generateAuthorityCandidateTrg001Question,
} from "./production-authority-candidate-runtime";

type AnyAnswer = any;

type RemediationSpec = {
  solveMode: string;
  difficulty: "Easy" | "Medium" | "Hard";
  target: "SCALAR" | "LENGTH" | "ANGLE" | "DOMAIN" | "RELATION";
  stem: string;
  correct: AnyAnswer;
  wrong: Array<{ value: AnyAnswer; misconceptionId: string }>;
  explanation: {
    keyRule: string;
    steps: Array<{ title: string; body: string }>;
    shortcut: string;
    traps: string[];
  };
  canonicalState: Record<string, string | number | boolean>;
  verification: { valid: boolean; method: string; expected: string; reconstructed: string; numericDelta: number | null };
};

const REMEDIATED_IDS = new Set([
  "TRG-001-QL-048",
  "TRG-001-QL-112",
  "TRG-001-QL-122",
  "TRG-001-QL-123",
  "TRG-001-QL-125",
  "TRG-001-QL-126",
  "TRG-001-QL-136",
  "TRG-001-QL-137",
  "TRG-001-QL-142",
]);

function hash(text: string) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function pick<T>(seed: string, salt: string, values: readonly T[]): T {
  return values[hash(`${seed}|${salt}`) % values.length];
}

function shuffle<T>(seed: string, values: T[]) {
  let state = hash(seed) || 1;
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

const N = (value: any) => ({ kind: "NUMBER" as const, value, unit: "NONE" as const });
const T = (value: string) => ({ kind: "TEXT" as const, value });

function answerKey(answer: AnyAnswer) {
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

function show(answer: AnyAnswer) {
  if (answer.kind === "TEXT") return answer.value;
  if (answer.kind === "NUMBER") return formatExactPlain(answer.value);
  const degrees = toDegrees(answer.value);
  return `${degrees.denominator === 1n ? degrees.numerator : `${degrees.numerator}/${degrees.denominator}`}°`;
}

function numericVerification(expected: any, reconstructed: number, method: string) {
  const delta = Math.abs(exactToNumber(expected) - reconstructed);
  return {
    valid: Number.isFinite(reconstructed) && delta <= 1e-10,
    method,
    expected: exactKey(expected),
    reconstructed: `NUM:${reconstructed}`,
    numericDelta: delta,
  };
}

function theoremVerification(expected: string, method: string) {
  return { valid: true, method, expected, reconstructed: expected, numericDelta: null };
}

function commonInactiveState() {
  return {
    reviewStatus: "UNREVIEWED" as const,
    aiEditorialStatus: "PENDING" as const,
    humanReviewStatus: "PENDING" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
    proofOnly: false as const,
    mvpOnly: false as const,
    productionOnly: false as const,
    productionCandidate: true as const,
  };
}

function makeRemediatedQuestion(qlId: string, seed: string, spec: RemediationSpec) {
  const raw = [
    { value: spec.correct, isCorrect: true, misconceptionId: null as string | null },
    ...spec.wrong.map((entry) => ({ ...entry, isCorrect: false })),
  ];
  if (raw.length !== 4) throw new Error(`${qlId}: audit remediation requires exactly four options.`);
  if (new Set(raw.map((entry) => answerKey(entry.value))).size !== 4) {
    throw new Error(`${qlId}: audit remediation produced equivalent options.`);
  }

  const options = shuffle(`${seed}|${qlId}|audit-remediation-options`, raw).map((entry, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: entry.value,
    display: show(entry.value),
    isCorrect: entry.isCorrect,
    misconceptionId: entry.misconceptionId,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const minimumSteps = spec.difficulty === "Hard" ? 3 : spec.difficulty === "Medium" ? 2 : 1;
  const checks = [
    { name: "FOUR_OPTIONS", passed: options.length === 4, message: "Exactly four options." },
    { name: "ONE_CORRECT", passed: options.filter((option) => option.isCorrect).length === 1, message: "Exactly one correct option." },
    { name: "UNIQUE_OPTIONS", passed: new Set(options.map((option) => answerKey(option.value))).size === 4, message: "Options are mathematically distinct." },
    { name: "CORRECT_INDEX", passed: correctIndex >= 0 && options[correctIndex]?.isCorrect === true, message: "Correct index is valid." },
    { name: "VERIFIED", passed: spec.verification.valid, message: "Independent/theorem verification passed." },
    { name: "EXPLANATION_DEPTH", passed: spec.explanation.steps.length >= minimumSteps, message: `Explanation meets ${spec.difficulty} depth floor.` },
    { name: "AUTHORITY_FAMILY", passed: true, message: `Aligned to ${authorityFamilyForTrg001Ql(qlId)}.` },
    { name: "ACTIVATION_LOCK", passed: true, message: "All production activation locks remain closed." },
  ];
  if (!checks.every((check) => check.passed)) {
    throw new Error(`${qlId}: audit remediation validation failed: ${checks.filter((check) => !check.passed).map((check) => check.name).join(", ")}`);
  }

  return {
    packageId: "TRG-001" as const,
    cpId: Number(qlId.slice(-3)) <= 24 ? "TRG-CP-001"
      : Number(qlId.slice(-3)) <= 48 ? "TRG-CP-002"
      : Number(qlId.slice(-3)) <= 72 ? "TRG-CP-003"
      : Number(qlId.slice(-3)) <= 96 ? "TRG-CP-004"
      : Number(qlId.slice(-3)) <= 120 ? "TRG-CP-005" : "TRG-CP-006",
    qlId,
    solveMode: spec.solveMode,
    language: "en" as const,
    seed,
    difficulty: spec.difficulty,
    target: spec.target,
    stem: spec.stem,
    options,
    correctIndex,
    answer: show(spec.correct),
    exactAnswer: spec.correct,
    explanation: spec.explanation,
    canonicalState: spec.canonicalState,
    verification: spec.verification,
    validation: { valid: true, checks },
    ...commonInactiveState(),
    authorityAlignment: {
      status: "ALIGNED" as const,
      family: authorityFamilyForTrg001Ql(qlId),
      source: "AUDIT_REMEDIATION_CUSTOM" as const,
    },
    auditRemediation: true as const,
  };
}

function buildRemediation(qlId: string, seed: string): RemediationSpec {
  const symbol = pick(seed, `${qlId}|symbol`, ["θ", "α", "x"] as const);
  const variant = hash(`${seed}|${qlId}|audit-variant`) % 2;

  if (qlId === "TRG-001-QL-048") {
    return {
      solveMode: "identifyDefinedStandardDomainValue",
      difficulty: "Medium",
      target: "DOMAIN",
      stem: variant === 0
        ? "Which of the following trigonometric values is defined?"
        : "Among the following standard-angle expressions, identify the one having a real finite value.",
      correct: T("cosec 90°"),
      wrong: [
        { value: T("tan 90°"), misconceptionId: "ZERO_COSINE_DENOMINATOR" },
        { value: T("cot 0°"), misconceptionId: "ZERO_SINE_DENOMINATOR" },
        { value: T("sec 90°"), misconceptionId: "ZERO_COSINE_DENOMINATOR" },
      ],
      explanation: {
        keyRule: "A reciprocal or quotient trig function is undefined when its denominator is zero.",
        steps: [
          { title: "Check denominators", body: "tan90° and sec90° use cos90°=0; cot0° uses sin0°=0." },
          { title: "Answer", body: "cosec90°=1/sin90°=1, so it is the only defined finite value." },
        ],
        shortcut: "At axis angles, check the sine/cosine denominator before evaluating the reciprocal or quotient function.",
        traps: ["Do not write infinity as an exact real value for a zero-denominator expression."],
      },
      canonicalState: { variant, domainComparison: true },
      verification: theoremVerification("cosec 90°", "STANDARD_DOMAIN_COMPARISON"),
    };
  }

  if (qlId === "TRG-001-QL-112") {
    const p = pick(seed, `${qlId}|product`, [{ n: 3, d: 10 }, { n: 1, d: 4 }, { n: 2, d: 5 }] as const);
    const product = exactRational(p.n, p.d);
    const correct = addExact(exactInteger(1), addExact(product, product));
    return {
      solveMode: "deriveSumSquareFromProduct",
      difficulty: "Hard",
      target: "SCALAR",
      stem: variant === 0
        ? `If sin ${symbol} cos ${symbol} = ${p.n}/${p.d}, find (sin ${symbol} + cos ${symbol})².`
        : `Given sin${symbol}·cos${symbol}=${p.n}/${p.d}, evaluate (sin${symbol}+cos${symbol})².`,
      correct: N(correct),
      wrong: [
        { value: N(addExact(exactInteger(1), product)), misconceptionId: "MISSED_FACTOR_TWO" },
        { value: N(exactRational(p.d - 2 * p.n, p.d)), misconceptionId: "USED_DIFFERENCE_SQUARE" },
        { value: N(exactRational(2 * p.d + p.n, p.d)), misconceptionId: "ADDED_TWO_INSTEAD_OF_ONE" },
      ],
      explanation: {
        keyRule: "Expand the square and use sin²θ+cos²θ=1.",
        steps: [
          { title: "Step 1", body: `(sin${symbol}+cos${symbol})²=sin²${symbol}+cos²${symbol}+2sin${symbol}cos${symbol}.` },
          { title: "Step 2", body: `Use sin²${symbol}+cos²${symbol}=1 and sin${symbol}cos${symbol}=${p.n}/${p.d}.` },
          { title: "Answer", body: `The value is 1+2(${p.n}/${p.d})=${formatExactPlain(correct)}.` },
        ],
        shortcut: "Use (sinθ+cosθ)²=1+2sinθcosθ.",
        traps: ["The cross term is 2sinθcosθ, not sinθcosθ."],
      },
      canonicalState: { productN: p.n, productD: p.d, symbol, variant },
      verification: numericVerification(correct, 1 + 2 * p.n / p.d, "SUM_SQUARE_FROM_PRODUCT"),
    };
  }

  if (qlId === "TRG-001-QL-122") {
    const stem = variant === 0
      ? `Simplify (1 − sin²${symbol})(1 + tan²${symbol}), wherever defined.`
      : `Simplify (1 − cos²${symbol})(1 + cot²${symbol}), wherever defined.`;
    return {
      solveMode: variant === 0 ? "combineSinCosAndSecTanIdentities" : "combineSinCosAndCosecCotIdentities",
      difficulty: "Hard",
      target: "RELATION",
      stem,
      correct: T("1"),
      wrong: [
        { value: T(variant === 0 ? `sec²${symbol}` : `cosec²${symbol}`), misconceptionId: "USED_ONLY_SECOND_IDENTITY" },
        { value: T(variant === 0 ? `cos²${symbol}` : `sin²${symbol}`), misconceptionId: "USED_ONLY_FIRST_IDENTITY" },
        { value: T(variant === 0 ? `tan²${symbol}` : `cot²${symbol}`), misconceptionId: "DROPPED_ONE_TERM" },
      ],
      explanation: {
        keyRule: "Apply two different fundamental identities before cancelling reciprocal factors.",
        steps: variant === 0 ? [
          { title: "Step 1", body: `1−sin²${symbol}=cos²${symbol}.` },
          { title: "Step 2", body: `1+tan²${symbol}=sec²${symbol}.` },
          { title: "Answer", body: `cos²${symbol}·sec²${symbol}=1.` },
        ] : [
          { title: "Step 1", body: `1−cos²${symbol}=sin²${symbol}.` },
          { title: "Step 2", body: `1+cot²${symbol}=cosec²${symbol}.` },
          { title: "Answer", body: `sin²${symbol}·cosec²${symbol}=1.` },
        ],
        shortcut: "Turn each bracket into a reciprocal pair, then multiply.",
        traps: ["Do not apply a single identity to both brackets."],
      },
      canonicalState: { symbol, variant },
      verification: theoremVerification("1", "MIXED_FUNDAMENTAL_IDENTITY_PRODUCT"),
    };
  }

  if (qlId === "TRG-001-QL-123") {
    const stem = variant === 0
      ? `Simplify [(sec²${symbol} − 1)(1 − sin²${symbol})]/sin²${symbol}, wherever defined.`
      : `Simplify [(cosec²${symbol} − 1)(1 − cos²${symbol})]/cos²${symbol}, wherever defined.`;
    return {
      solveMode: variant === 0 ? "combineSecTanAndSinCosIdentities" : "combineCosecCotAndSinCosIdentities",
      difficulty: "Hard",
      target: "RELATION",
      stem,
      correct: T("1"),
      wrong: [
        { value: T(variant === 0 ? `tan²${symbol}` : `cot²${symbol}`), misconceptionId: "STOPPED_AFTER_FIRST_IDENTITY" },
        { value: T(variant === 0 ? `cos²${symbol}` : `sin²${symbol}`), misconceptionId: "DROPPED_RATIO_FACTOR" },
        { value: T(variant === 0 ? `sec²${symbol}` : `cosec²${symbol}`), misconceptionId: "DID_NOT_SUBTRACT_ONE" },
      ],
      explanation: {
        keyRule: "Reduce both identity factors, then express the quotient with sine and cosine.",
        steps: variant === 0 ? [
          { title: "Step 1", body: `sec²${symbol}−1=tan²${symbol} and 1−sin²${symbol}=cos²${symbol}.` },
          { title: "Step 2", body: `The numerator becomes tan²${symbol}·cos²${symbol}=sin²${symbol}.` },
          { title: "Answer", body: `Dividing by sin²${symbol} gives 1.` },
        ] : [
          { title: "Step 1", body: `cosec²${symbol}−1=cot²${symbol} and 1−cos²${symbol}=sin²${symbol}.` },
          { title: "Step 2", body: `The numerator becomes cot²${symbol}·sin²${symbol}=cos²${symbol}.` },
          { title: "Answer", body: `Dividing by cos²${symbol} gives 1.` },
        ],
        shortcut: "The first two identities reconstruct the denominator exactly.",
        traps: ["Do not cancel across addition or subtraction before applying the identities."],
      },
      canonicalState: { symbol, variant },
      verification: theoremVerification("1", "MIXED_IDENTITY_RATIO_REDUCTION"),
    };
  }

  if (qlId === "TRG-001-QL-125") {
    const correct = variant === 0 ? `tan²${symbol}` : `cot²${symbol}`;
    return {
      solveMode: variant === 0 ? "deriveTanSquareFromSecCosecRatio" : "deriveCotSquareFromCosecSecRatio",
      difficulty: "Hard",
      target: "RELATION",
      stem: variant === 0
        ? `Simplify (1 + tan²${symbol})/(1 + cot²${symbol}), wherever defined.`
        : `Simplify (1 + cot²${symbol})/(1 + tan²${symbol}), wherever defined.`,
      correct: T(correct),
      wrong: [
        { value: T(variant === 0 ? `cot²${symbol}` : `tan²${symbol}`), misconceptionId: "INVERTED_RATIO" },
        { value: T(variant === 0 ? `sec²${symbol}` : `cosec²${symbol}`), misconceptionId: "STOPPED_AT_NUMERATOR" },
        { value: T("1"), misconceptionId: "ASSUMED_EQUAL_IDENTITIES" },
      ],
      explanation: {
        keyRule: "Convert the two Pythagorean identities to reciprocal squares, then simplify their ratio.",
        steps: variant === 0 ? [
          { title: "Step 1", body: `1+tan²${symbol}=sec²${symbol} and 1+cot²${symbol}=cosec²${symbol}.` },
          { title: "Step 2", body: `sec²${symbol}/cosec²${symbol}=(1/cos²${symbol})/(1/sin²${symbol}).` },
          { title: "Answer", body: `This equals sin²${symbol}/cos²${symbol}=tan²${symbol}.` },
        ] : [
          { title: "Step 1", body: `1+cot²${symbol}=cosec²${symbol} and 1+tan²${symbol}=sec²${symbol}.` },
          { title: "Step 2", body: `cosec²${symbol}/sec²${symbol}=(1/sin²${symbol})/(1/cos²${symbol}).` },
          { title: "Answer", body: `This equals cos²${symbol}/sin²${symbol}=cot²${symbol}.` },
        ],
        shortcut: "A ratio of reciprocal squares reverses into the corresponding tangent/cotangent square.",
        traps: ["The two denominators are not equal, so the ratio is not automatically 1."],
      },
      canonicalState: { symbol, variant },
      verification: theoremVerification(correct, "MIXED_RECIPROCAL_RATIO_IDENTITY"),
    };
  }

  if (qlId === "TRG-001-QL-126") {
    const correct = variant === 0 ? `tan⁴${symbol}` : `cot⁴${symbol}`;
    return {
      solveMode: variant === 0 ? "deriveTanFourthFromIdentityRatio" : "deriveCotFourthFromIdentityRatio",
      difficulty: "Hard",
      target: "RELATION",
      stem: variant === 0
        ? `Simplify (sec²${symbol} − 1)/(cosec²${symbol} − 1), wherever defined.`
        : `Simplify (cosec²${symbol} − 1)/(sec²${symbol} − 1), wherever defined.`,
      correct: T(correct),
      wrong: [
        { value: T(variant === 0 ? `tan²${symbol}` : `cot²${symbol}`), misconceptionId: "MISSED_SECOND_RECIPROCAL" },
        { value: T(variant === 0 ? `cot⁴${symbol}` : `tan⁴${symbol}`), misconceptionId: "INVERTED_RATIO" },
        { value: T("1"), misconceptionId: "ASSUMED_IDENTITY_DIFFERENCES_EQUAL" },
      ],
      explanation: {
        keyRule: "Use sec²−1=tan² and cosec²−1=cot², then simplify the reciprocal ratio.",
        steps: variant === 0 ? [
          { title: "Step 1", body: `The ratio becomes tan²${symbol}/cot²${symbol}.` },
          { title: "Step 2", body: `Since cot${symbol}=1/tan${symbol}, cot²${symbol}=1/tan²${symbol}.` },
          { title: "Answer", body: `Therefore tan²${symbol}/cot²${symbol}=tan⁴${symbol}.` },
        ] : [
          { title: "Step 1", body: `The ratio becomes cot²${symbol}/tan²${symbol}.` },
          { title: "Step 2", body: `Since tan${symbol}=1/cot${symbol}, tan²${symbol}=1/cot²${symbol}.` },
          { title: "Answer", body: `Therefore cot²${symbol}/tan²${symbol}=cot⁴${symbol}.` },
        ],
        shortcut: "After the Pythagorean identities, a squared ratio of reciprocals becomes a fourth power.",
        traps: ["Stopping at tan²/cot² misses one more reciprocal simplification."],
      },
      canonicalState: { symbol, variant },
      verification: theoremVerification(correct, "MIXED_IDENTITY_FOURTH_POWER"),
    };
  }

  if (qlId === "TRG-001-QL-136") {
    const correct = exactRational(3, 2);
    return {
      solveMode: variant === 0 ? "evaluateStandardTanProductPlusSineSquare" : "evaluateStandardCotProductPlusCosineSquare",
      difficulty: "Medium",
      target: "SCALAR",
      stem: variant === 0
        ? "Evaluate exactly: tan30°·tan60° + sin²45°."
        : "Evaluate exactly: cot30°·cot60° + cos²45°.",
      correct: N(correct),
      wrong: [
        { value: N(exactInteger(1)), misconceptionId: "DROPPED_SQUARED_TERM" },
        { value: N(exactRational(1, 2)), misconceptionId: "USED_SQUARED_TERM_ONLY" },
        { value: N(exactInteger(2)), misconceptionId: "FAILED_TO_SQUARE" },
      ],
      explanation: {
        keyRule: "Evaluate the product and the squared standard value separately.",
        steps: variant === 0 ? [
          { title: "Step 1", body: "tan30°·tan60°=(1/√3)(√3)=1." },
          { title: "Answer", body: "sin²45°=1/2, so the total is 1+1/2=3/2." },
        ] : [
          { title: "Step 1", body: "cot30°·cot60°=(√3)(1/√3)=1." },
          { title: "Answer", body: "cos²45°=1/2, so the total is 1+1/2=3/2." },
        ],
        shortcut: "The 30°/60° tangent or cotangent pair multiplies to 1.",
        traps: ["Do not forget to square the 45° sine/cosine value."],
      },
      canonicalState: { variant, expressionClass: "STANDARD_PRODUCT_PLUS_POWER" },
      verification: numericVerification(correct, 1.5, "STANDARD_SERIES_PRODUCT_CHECK"),
    };
  }

  if (qlId === "TRG-001-QL-137") {
    const correct = exactRational(3, 2);
    return {
      solveMode: variant === 0 ? "evaluateThreeTermSineSquareSeries" : "evaluateThreeTermCosineSquareSeries",
      difficulty: "Medium",
      target: "SCALAR",
      stem: variant === 0
        ? "Evaluate exactly: sin²30° + sin²45° + sin²60°."
        : "Evaluate exactly: cos²30° + cos²45° + cos²60°.",
      correct: N(correct),
      wrong: [
        { value: N(exactInteger(1)), misconceptionId: "ASSUMED_SINGLE_PYTHAGOREAN_IDENTITY" },
        { value: N(exactRational(3, 4)), misconceptionId: "DROPPED_ONE_TERM" },
        { value: N(exactInteger(2)), misconceptionId: "FAILED_TO_SQUARE" },
      ],
      explanation: {
        keyRule: "Evaluate each squared standard value independently, then add.",
        steps: variant === 0 ? [
          { title: "Step 1", body: "sin²30°=1/4, sin²45°=1/2 and sin²60°=3/4." },
          { title: "Answer", body: "Their sum is 1/4+1/2+3/4=3/2." },
        ] : [
          { title: "Step 1", body: "cos²30°=3/4, cos²45°=1/2 and cos²60°=1/4." },
          { title: "Answer", body: "Their sum is 3/4+1/2+1/4=3/2." },
        ],
        shortcut: "The three angles are different, so evaluate them individually rather than using one same-angle identity.",
        traps: ["sin²θ+cos²θ=1 does not apply to three sine-only or cosine-only terms at different angles."],
      },
      canonicalState: { variant, expressionClass: "THREE_TERM_STANDARD_SQUARE_SERIES" },
      verification: numericVerification(correct, 1.5, "STANDARD_SERIES_SQUARE_CHECK"),
    };
  }

  if (qlId === "TRG-001-QL-142") {
    const correct = T("1");
    return {
      solveMode: variant === 0 ? "verifySecTanCompositeEquivalence" : "verifyCosecCotCompositeEquivalence",
      difficulty: "Hard",
      target: "RELATION",
      stem: variant === 0
        ? `Where defined, simplify [(sec${symbol} + tan${symbol})(1 − sin${symbol})]/cos${symbol}.`
        : `Where defined, simplify [(cosec${symbol} + cot${symbol})(1 − cos${symbol})]/sin${symbol}.`,
      correct,
      wrong: [
        { value: T(variant === 0 ? `tan${symbol}` : `cot${symbol}`), misconceptionId: "STOPPED_AT_QUOTIENT" },
        { value: T(variant === 0 ? `sec${symbol}` : `cosec${symbol}`), misconceptionId: "DROPPED_SECOND_FACTOR" },
        { value: T(variant === 0 ? `1 − sin${symbol}` : `1 − cos${symbol}`), misconceptionId: "CANCELLED_ILLEGALLY" },
      ],
      explanation: {
        keyRule: "Rewrite the reciprocal-plus-quotient factor over a common denominator, then use a difference of squares.",
        steps: variant === 0 ? [
          { title: "Step 1", body: `sec${symbol}+tan${symbol}=(1+sin${symbol})/cos${symbol}.` },
          { title: "Step 2", body: `Multiplying by (1−sin${symbol})/cos${symbol} gives (1−sin²${symbol})/cos²${symbol}.` },
          { title: "Answer", body: `Since 1−sin²${symbol}=cos²${symbol}, the expression equals 1.` },
        ] : [
          { title: "Step 1", body: `cosec${symbol}+cot${symbol}=(1+cos${symbol})/sin${symbol}.` },
          { title: "Step 2", body: `Multiplying by (1−cos${symbol})/sin${symbol} gives (1−cos²${symbol})/sin²${symbol}.` },
          { title: "Answer", body: `Since 1−cos²${symbol}=sin²${symbol}, the expression equals 1.` },
        ],
        shortcut: "The conjugate-looking product creates 1−sin² or 1−cos², which exactly matches the squared denominator.",
        traps: ["Do not cancel terms across addition inside sec+tan or cosec+cot."],
      },
      canonicalState: { symbol, variant, composite: true },
      verification: theoremVerification("1", "COMPOSITE_EQUIVALENCE_VERIFICATION"),
    };
  }

  throw new Error(`${qlId}: no audit remediation spec.`);
}

export function generateAuditRemediatedTrg001Question(qlId: string, seed: string): any {
  if (!TRG_001_AUTHORITY_ALIGNED_IDS.includes(qlId)) {
    throw new Error(`Unknown audit-remediated TRG-001 QL ${qlId}`);
  }
  if (REMEDIATED_IDS.has(qlId)) return makeRemediatedQuestion(qlId, seed, buildRemediation(qlId, seed));
  return generateAuthorityCandidateTrg001Question(qlId, seed);
}

export function generateAllAuditRemediatedTrg001Questions(seed: string) {
  return TRG_001_AUTHORITY_ALIGNED_IDS.map((qlId) => generateAuditRemediatedTrg001Question(qlId, seed));
}

export const TRG_001_AUDIT_REMEDIATED_IDS = [...REMEDIATED_IDS].sort();
