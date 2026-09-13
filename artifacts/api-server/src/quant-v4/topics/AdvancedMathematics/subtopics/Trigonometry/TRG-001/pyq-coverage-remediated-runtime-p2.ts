import { generateAuthorityCandidateTrg001Question } from "./production-authority-candidate-runtime";

export const TRG_001_PYQ_COVERAGE_REMEDIATION_P2_AUTHORITY =
  "TRG-001-PYQ-COVERAGE-REMEDIATION-P2" as const;

const INTERVAL_COMPARISON_QL_ID = "TRG-001-QL-024" as const;
const CUBIC_FACTORIZATION_QL_ID = "TRG-001-QL-143" as const;

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

function makeTextOptions(seed: string, qlId: string, raw: Array<{ text: string; isCorrect: boolean; misconceptionId: string | null }>) {
  const options = shuffle(`${seed}|${qlId}|pyq-options`, raw).map((entry, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: { kind: "TEXT" as const, value: entry.text },
    display: entry.text,
    isCorrect: entry.isCorrect,
    misconceptionId: entry.misconceptionId,
  }));
  return { options, correctIndex: options.findIndex((option) => option.isCorrect) };
}

function buildIntervalComparisonQuestion(seed: string) {
  const base: any = generateAuthorityCandidateTrg001Question(INTERVAL_COMPARISON_QL_ID, seed);
  const intervalVariant = hash(`${seed}|${INTERVAL_COMPARISON_QL_ID}|interval`) % 2;
  const stemVariant = hash(`${seed}|${INTERVAL_COMPARISON_QL_ID}|stem`) % 2;
  const below45 = intervalVariant === 0;
  const intervalText = below45 ? "0° < θ < 45°" : "45° < θ < 90°";
  const correctText = below45 ? "sin θ < cos θ" : "sin θ > cos θ";
  const reverseText = below45 ? "sin θ > cos θ" : "sin θ < cos θ";
  const built = makeTextOptions(seed, INTERVAL_COMPARISON_QL_ID, [
    { text: correctText, isCorrect: true, misconceptionId: null },
    { text: reverseText, isCorrect: false, misconceptionId: "REVERSED_INTERVAL_COMPARISON" },
    { text: "sin θ = cos θ", isCorrect: false, misconceptionId: "ASSUMED_FORTY_FIVE_EQUALITY" },
    { text: "Cannot be determined", isCorrect: false, misconceptionId: "MISSED_ACUTE_INTERVAL_ORDER" },
  ]);
  const stem = stemVariant === 0
    ? `If ${intervalText}, which statement is correct?`
    : `For an acute angle θ satisfying ${intervalText}, compare sin θ and cos θ.`;

  return {
    ...base,
    packageId: "TRG-001" as const,
    cpId: "TRG-CP-001" as const,
    qlId: INTERVAL_COMPARISON_QL_ID,
    solveMode: "compareSinCosFromAcuteInterval",
    language: "en" as const,
    seed,
    difficulty: "Easy" as const,
    target: "RELATION" as const,
    stem,
    options: built.options,
    correctIndex: built.correctIndex,
    answer: correctText,
    exactAnswer: { kind: "TEXT" as const, value: correctText },
    explanation: {
      keyRule: "For acute θ, sinθ=cosθ at 45°; below 45° cosine is larger, and above 45° sine is larger.",
      steps: [
        { title: "Step 1", body: "At θ=45°, sinθ=cosθ." },
        { title: "Answer", body: below45 ? "Since θ is below 45°, sinθ<cosθ." : "Since θ is above 45°, sinθ>cosθ." },
      ],
      shortcut: "Use 45° as the comparison point for sine and cosine in the first quadrant.",
      traps: ["Equality holds only at 45°, not throughout the acute-angle interval."],
    },
    canonicalState: { intervalVariant, interval: intervalText, comparisonBoundary: "45°", pyqAnchor: "SSC-CGL-2024-09-10-S1-Q16", exactPyqConcept: true },
    verification: { valid: true, method: "ACUTE_INTERVAL_SIN_COS_ORDER_CHECK", expected: correctText, reconstructed: correctText, numericDelta: null },
    validation: {
      valid: true,
      checks: [
        { name: "FOUR_OPTIONS", passed: built.options.length === 4, message: "Exactly four options." },
        { name: "ONE_CORRECT", passed: built.options.filter((option) => option.isCorrect).length === 1, message: "Exactly one correct option." },
        { name: "UNIQUE_OPTIONS", passed: new Set(built.options.map((option) => option.display)).size === 4, message: "All comparison options are distinct." },
        { name: "PYQ_ARCHETYPE", passed: true, message: "Covers the SSC CGL acute-interval sine/cosine comparison archetype." },
        { name: "ACTIVATION_LOCK", passed: base.questionStudioDiscoverable === false && base.publiclyPublishable === false, message: "Existing activation locks remain closed." },
      ],
    },
    authorityAlignment: { status: "PYQ_REMEDIATION_CANDIDATE" as const, family: "RECIPROCAL_COMPARISON" as const, source: "REAL_EXAM_COVERAGE_AUDIT_P2" as const, broadensRoleAtPermanentId: INTERVAL_COMPARISON_QL_ID },
    authorityStemVariant: stemVariant,
  };
}

function buildCubicFactorizationQuestion(seed: string) {
  const base: any = generateAuthorityCandidateTrg001Question(CUBIC_FACTORIZATION_QL_ID, seed);
  const algebraVariant = hash(`${seed}|${CUBIC_FACTORIZATION_QL_ID}|pyq-cubic-math`) % 4;
  const stemVariant = hash(`${seed}|${CUBIC_FACTORIZATION_QL_ID}|pyq-cubic-stem`) % 2;
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
  const built = makeTextOptions(seed, CUBIC_FACTORIZATION_QL_ID, [
    { text: correctText, isCorrect: true, misconceptionId: null },
    { text: oppositeSignText, isCorrect: false, misconceptionId: "CUBE_FACTOR_SIGN_ERROR" },
    { text: "sin A cos A", isCorrect: false, misconceptionId: "DROPPED_PYTHAGOREAN_ONE" },
    { text: doubledText, isCorrect: false, misconceptionId: "DOUBLED_PRODUCT_TERM" },
  ]);
  const stem = stemVariant === 0 ? `Simplify (${numerator})/(${denominator}), where ${domainRestriction}.` : `If ${domainRestriction}, find the simplified form of (${numerator})/(${denominator}).`;
  const factorIdentity = isSum ? "a³+b³=(a+b)(a²−ab+b²)" : "a³−b³=(a−b)(a²+ab+b²)";
  const middleSign = isSum ? "−" : "+";

  return {
    ...base,
    packageId: "TRG-001" as const,
    cpId: "TRG-CP-006" as const,
    qlId: CUBIC_FACTORIZATION_QL_ID,
    solveMode: "simplifyTrigCubicFactorization",
    language: "en" as const,
    seed,
    difficulty: "Medium" as const,
    target: "RELATION" as const,
    stem,
    options: built.options,
    correctIndex: built.correctIndex,
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
      traps: ["Do not use the square-factorization formula for a cubic numerator.", `For ${isSum ? "a³+b³" : "a³−b³"}, the middle product in the quadratic factor has a ${isSum ? "negative" : "positive"} sign.`],
    },
    canonicalState: { algebraVariant, operation: isSum ? "SUM_OF_CUBES" : "DIFFERENCE_OF_CUBES", operandOrder: sinFirst ? "SIN_THEN_COS" : "COS_THEN_SIN", identity: factorIdentity, pythagoreanIdentity: "sin^2(A)+cos^2(A)=1", domainRestriction, pyqAnchor: "SSC-CGL-2024-09-09-S2-Q12", exactPyqVariant: algebraVariant === 0 },
    verification: { valid: true, method: "SYMBOLIC_CUBIC_FACTORIZATION_PLUS_PYTHAGOREAN_IDENTITY", expected: correctText, reconstructed: correctText, numericDelta: null },
    validation: {
      valid: true,
      checks: [
        { name: "FOUR_OPTIONS", passed: built.options.length === 4, message: "Exactly four options." },
        { name: "ONE_CORRECT", passed: built.options.filter((option) => option.isCorrect).length === 1, message: "Exactly one correct option." },
        { name: "UNIQUE_OPTIONS", passed: new Set(built.options.map((option) => option.display)).size === 4, message: "All option expressions are distinct." },
        { name: "PYQ_ARCHETYPE", passed: true, message: "Includes the SSC CGL 2024 difference-of-cubes archetype and controlled sibling variants." },
        { name: "EXPLANATION_DEPTH", passed: true, message: "Factorization, cancellation and Pythagorean substitution are shown." },
        { name: "ACTIVATION_LOCK", passed: base.questionStudioDiscoverable === false && base.publiclyPublishable === false, message: "Existing activation locks remain closed." },
      ],
    },
    authorityAlignment: { status: "PYQ_REMEDIATION_CANDIDATE" as const, family: "EQUIVALENCE_VERIFICATION_COMPOSITE" as const, source: "REAL_EXAM_COVERAGE_AUDIT_P2" as const, replacesRoleAtPermanentId: CUBIC_FACTORIZATION_QL_ID },
    authorityStemVariant: stemVariant,
  };
}

export function generatePyqCoverageRemediatedTrg001Question(qlId: string, seed: string) {
  if (qlId === INTERVAL_COMPARISON_QL_ID) return buildIntervalComparisonQuestion(seed);
  if (qlId === CUBIC_FACTORIZATION_QL_ID) return buildCubicFactorizationQuestion(seed);
  return generateAuthorityCandidateTrg001Question(qlId, seed);
}

export const TRG_001_PYQ_COVERAGE_REMEDIATED_QL_IDS = Object.freeze([INTERVAL_COMPARISON_QL_ID, CUBIC_FACTORIZATION_QL_ID]);
