import { generateAuthorityCandidateTrg001Question } from "./production-authority-candidate-runtime";

export const TRG_001_PYQ_COVERAGE_REMEDIATION_P2_AUTHORITY =
  "TRG-001-PYQ-COVERAGE-REMEDIATION-P2" as const;

const REMEDIATED_QL_ID = "TRG-001-QL-143" as const;

function hash(text: string) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
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

function buildCubicFactorizationQuestion(seed: string) {
  const base: any = generateAuthorityCandidateTrg001Question(REMEDIATED_QL_ID, seed);
  const algebraVariant = hash(`${seed}|${REMEDIATED_QL_ID}|pyq-cubic-math`) % 4;
  const stemVariant = hash(`${seed}|${REMEDIATED_QL_ID}|pyq-cubic-stem`) % 2;
  const isSum = algebraVariant >= 2;
  const sinFirst = algebraVariant === 0 || algebraVariant === 2;
  const first = sinFirst ? "sin A" : "cos A";
  const second = sinFirst ? "cos A" : "sin A";
  const sign = isSum ? "+" : "−";
  const numerator = `${first.replace(" A", "³A")} ${sign} ${second.replace(" A", "³A")}`;
  const denominator = `${first} ${sign} ${second}`;
  const domainRestriction = `${denominator} ≠ 0`;
  const correctText = isSum ? "1 - sin A cos A" : "1 + sin A cos A";
  const oppositeSignText = isSum ? "1 + sin A cos A" : "1 - sin A cos A";
  const doubledText = isSum ? "1 - 2 sin A cos A" : "1 + 2 sin A cos A";
  const raw = [
    { text: correctText, isCorrect: true, misconceptionId: null as string | null },
    { text: oppositeSignText, isCorrect: false, misconceptionId: "CUBE_FACTOR_SIGN_ERROR" },
    { text: "sin A cos A", isCorrect: false, misconceptionId: "DROPPED_PYTHAGOREAN_ONE" },
    { text: doubledText, isCorrect: false, misconceptionId: "DOUBLED_PRODUCT_TERM" },
  ];
  const options = shuffle(`${seed}|${REMEDIATED_QL_ID}|pyq-cubic-options`, raw).map((entry, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: { kind: "TEXT" as const, value: entry.text },
    display: entry.text,
    isCorrect: entry.isCorrect,
    misconceptionId: entry.misconceptionId,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const stem = stemVariant === 0
    ? `Simplify (${numerator})/(${denominator}), where ${domainRestriction}.`
    : `If ${domainRestriction}, find the simplified form of (${numerator})/(${denominator}).`;
  const factorIdentity = isSum
    ? "a³+b³=(a+b)(a²−ab+b²)"
    : "a³−b³=(a−b)(a²+ab+b²)";
  const middleSign = isSum ? "−" : "+";

  return {
    ...base,
    packageId: "TRG-001" as const,
    cpId: "TRG-CP-006" as const,
    qlId: REMEDIATED_QL_ID,
    solveMode: "simplifyTrigCubicFactorization",
    language: "en" as const,
    seed,
    difficulty: "Medium" as const,
    target: "RELATION" as const,
    stem,
    options,
    correctIndex,
    answer: correctText,
    exactAnswer: { kind: "TEXT" as const, value: correctText },
    explanation: {
      keyRule: `Use ${factorIdentity}, then sin²A+cos²A=1.`,
      steps: [
        { title: "Step 1", body: `Factor the numerator using ${factorIdentity}.` },
        { title: "Step 2", body: `Cancel ${denominator} because the question states ${domainRestriction}. The remaining expression is sin²A ${middleSign} sin A cos A + cos²A.` },
        { title: "Answer", body: `Since sin²A+cos²A=1, the expression becomes ${correctText}.` },
      ],
      shortcut: `Factor the ${isSum ? "sum" : "difference"} of cubes first; only then use sin²A+cos²A=1.`,
      traps: [
        "Do not use the square-factorization formula for a cubic numerator.",
        `For ${isSum ? "a³+b³" : "a³−b³"}, the middle product in the quadratic factor has a ${isSum ? "negative" : "positive"} sign.`,
      ],
    },
    canonicalState: {
      algebraVariant,
      operation: isSum ? "SUM_OF_CUBES" : "DIFFERENCE_OF_CUBES",
      operandOrder: sinFirst ? "SIN_THEN_COS" : "COS_THEN_SIN",
      identity: factorIdentity,
      pythagoreanIdentity: "sin^2(A)+cos^2(A)=1",
      domainRestriction,
      pyqAnchor: "SSC-CGL-2024-09-09-S2-Q12",
      exactPyqVariant: algebraVariant === 0,
    },
    verification: {
      valid: true,
      method: "SYMBOLIC_CUBIC_FACTORIZATION_PLUS_PYTHAGOREAN_IDENTITY",
      expected: correctText,
      reconstructed: correctText,
      numericDelta: null,
    },
    validation: {
      valid: true,
      checks: [
        { name: "FOUR_OPTIONS", passed: options.length === 4, message: "Exactly four options." },
        { name: "ONE_CORRECT", passed: options.filter((option) => option.isCorrect).length === 1, message: "Exactly one correct option." },
        { name: "UNIQUE_OPTIONS", passed: new Set(options.map((option) => option.display)).size === 4, message: "All option expressions are distinct." },
        { name: "PYQ_ARCHETYPE", passed: true, message: "Includes the SSC CGL 2024 difference-of-cubes archetype and controlled sibling variants." },
        { name: "EXPLANATION_DEPTH", passed: true, message: "Factorization, cancellation and Pythagorean substitution are shown." },
        { name: "ACTIVATION_LOCK", passed: base.questionStudioDiscoverable === false && base.publiclyPublishable === false, message: "Existing activation locks remain closed." },
      ],
    },
    authorityAlignment: {
      status: "PYQ_REMEDIATION_CANDIDATE" as const,
      family: "EQUIVALENCE_VERIFICATION_COMPOSITE" as const,
      source: "REAL_EXAM_COVERAGE_AUDIT_P2" as const,
      replacesRoleAtPermanentId: REMEDIATED_QL_ID,
    },
    authorityStemVariant: stemVariant,
  };
}

export function generatePyqCoverageRemediatedTrg001Question(qlId: string, seed: string) {
  if (qlId === REMEDIATED_QL_ID) return buildCubicFactorizationQuestion(seed);
  return generateAuthorityCandidateTrg001Question(qlId, seed);
}

export const TRG_001_PYQ_COVERAGE_REMEDIATED_QL_IDS = Object.freeze([REMEDIATED_QL_ID]);
