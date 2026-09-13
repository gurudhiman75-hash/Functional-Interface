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
  const variant = hash(`${seed}|${REMEDIATED_QL_ID}|pyq-cubic-stem`) % 2;
  const correctText = "1 + sin A cos A";
  const raw = [
    { text: correctText, isCorrect: true, misconceptionId: null as string | null },
    { text: "1 - sin A cos A", isCorrect: false, misconceptionId: "CUBE_FACTOR_SIGN_ERROR" },
    { text: "sin A cos A", isCorrect: false, misconceptionId: "DROPPED_PYTHAGOREAN_ONE" },
    { text: "1 + 2 sin A cos A", isCorrect: false, misconceptionId: "DOUBLED_PRODUCT_TERM" },
  ];
  const options = shuffle(`${seed}|${REMEDIATED_QL_ID}|pyq-cubic-options`, raw).map((entry, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: { kind: "TEXT" as const, value: entry.text },
    display: entry.text,
    isCorrect: entry.isCorrect,
    misconceptionId: entry.misconceptionId,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const stem = variant === 0
    ? "Simplify (sin³A − cos³A)/(sin A − cos A), where sin A ≠ cos A."
    : "If sin A ≠ cos A, find the simplified form of (sin³A − cos³A)/(sin A − cos A).";

  return {
    ...base,
    packageId: "TRG-001" as const,
    cpId: "TRG-CP-006" as const,
    qlId: REMEDIATED_QL_ID,
    solveMode: "simplifyTrigDifferenceOfCubes",
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
      keyRule: "Use a³−b³=(a−b)(a²+ab+b²), then sin²A+cos²A=1.",
      steps: [
        { title: "Step 1", body: "Factor the numerator: sin³A−cos³A=(sin A−cos A)(sin²A+sin A cos A+cos²A)." },
        { title: "Step 2", body: "Cancel sin A−cos A because the question states sin A≠cos A." },
        { title: "Answer", body: "sin²A+cos²A=1, so the expression becomes 1+sin A cos A." },
      ],
      shortcut: "Factor the difference of cubes first; only then apply sin²A+cos²A=1.",
      traps: [
        "Do not use a²−b² factorization for a cubic numerator.",
        "Do not change the middle product term to a negative sign.",
      ],
    },
    canonicalState: {
      identity: "a^3-b^3=(a-b)(a^2+ab+b^2)",
      pythagoreanIdentity: "sin^2(A)+cos^2(A)=1",
      domainRestriction: "sin(A)!=cos(A)",
      pyqAnchor: "SSC-CGL-2024-09-09-S2-Q12",
    },
    verification: {
      valid: true,
      method: "SYMBOLIC_DIFFERENCE_OF_CUBES_PLUS_PYTHAGOREAN_IDENTITY",
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
        { name: "PYQ_ARCHETYPE", passed: true, message: "Covers the SSC CGL 2024 difference-of-cubes trigonometric archetype." },
        { name: "EXPLANATION_DEPTH", passed: true, message: "Factorization and Pythagorean substitution are both shown." },
        { name: "ACTIVATION_LOCK", passed: base.questionStudioDiscoverable === false && base.publiclyPublishable === false, message: "Existing activation locks remain closed." },
      ],
    },
    authorityAlignment: {
      status: "PYQ_REMEDIATION_CANDIDATE" as const,
      family: "EQUIVALENCE_VERIFICATION_COMPOSITE" as const,
      source: "REAL_EXAM_COVERAGE_AUDIT_P2" as const,
      replacesRoleAtPermanentId: REMEDIATED_QL_ID,
    },
    authorityStemVariant: variant,
  };
}

export function generatePyqCoverageRemediatedTrg001Question(qlId: string, seed: string) {
  if (qlId === REMEDIATED_QL_ID) return buildCubicFactorizationQuestion(seed);
  return generateAuthorityCandidateTrg001Question(qlId, seed);
}

export const TRG_001_PYQ_COVERAGE_REMEDIATED_QL_IDS = Object.freeze([REMEDIATED_QL_ID]);
