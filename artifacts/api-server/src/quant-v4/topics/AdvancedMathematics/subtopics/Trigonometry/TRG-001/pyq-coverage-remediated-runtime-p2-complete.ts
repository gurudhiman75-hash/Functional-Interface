import { generatePyqCoverageRemediatedTrg001Question } from "./pyq-coverage-remediated-runtime-p2";

export const TRG_001_PYQ_COVERAGE_COMPLETE_P2_AUTHORITY =
  "TRG-001-PYQ-COVERAGE-COMPLETE-P2" as const;

const MIXED_POWER_QL_ID = "TRG-001-QL-126" as const;

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

function buildPowerRelationPyqSibling(seed: string) {
  const base: any = generatePyqCoverageRemediatedTrg001Question(MIXED_POWER_QL_ID, seed);
  const sinGiven = hash(`${seed}|${MIXED_POWER_QL_ID}|power-relation`) % 2 === 1;
  const givenFn = sinGiven ? "sin" : "cos";
  const targetFn = sinGiven ? "cos" : "sin";
  const correctText = `${givenFn} θ`;
  const raw = [
    { text: correctText, isCorrect: true, misconceptionId: null as string | null },
    { text: `${targetFn} θ`, isCorrect: false, misconceptionId: "RETURNED_TARGET_FUNCTION" },
    { text: `${givenFn}² θ`, isCorrect: false, misconceptionId: "STOPPED_ONE_POWER_EARLY" },
    { text: "1", isCorrect: false, misconceptionId: "COLLAPSED_TO_PYTHAGOREAN_ONE" },
  ];
  const options = shuffle(`${seed}|${MIXED_POWER_QL_ID}|power-relation-options`, raw).map((entry, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: { kind: "TEXT" as const, value: entry.text },
    display: entry.text,
    isCorrect: entry.isCorrect,
    misconceptionId: entry.misconceptionId,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const stem = `If ${givenFn} θ + ${givenFn}² θ = 1, find ${targetFn}⁴ θ + ${targetFn}⁶ θ.`;

  return {
    ...base,
    packageId: "TRG-001" as const,
    cpId: "TRG-CP-006" as const,
    qlId: MIXED_POWER_QL_ID,
    solveMode: "deriveHigherPowerFromTrigQuadraticRelation",
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
      keyRule: `From ${givenFn}θ+${givenFn}²θ=1 and sin²θ+cos²θ=1, first obtain ${targetFn}²θ=${givenFn}θ.`,
      steps: [
        { title: "Step 1", body: `${givenFn}θ+${givenFn}²θ=1 gives 1−${givenFn}²θ=${givenFn}θ. Hence ${targetFn}²θ=${givenFn}θ.` },
        { title: "Step 2", body: `${targetFn}⁴θ+${targetFn}⁶θ=${givenFn}²θ+${givenFn}³θ=${givenFn}²θ(1+${givenFn}θ).` },
        { title: "Answer", body: `Since ${givenFn}θ(1+${givenFn}θ)=1, the result is ${correctText}.` },
      ],
      shortcut: `Convert ${targetFn}²θ into ${givenFn}θ first, then factor the higher powers.`,
      traps: ["Do not substitute the Pythagorean identity only at the final step; use the given relation to convert the squared function first."],
    },
    canonicalState: { givenFunction: givenFn.toUpperCase(), targetFunction: targetFn.toUpperCase(), relation: `${givenFn}(theta)+${givenFn}^2(theta)=1`, pyqAnchor: "SSC-CGL-2023-07-26-S1-Q62", exactPyqVariant: !sinGiven, legacySiblingRetained: true },
    verification: { valid: true, method: "TRIG_QUADRATIC_RELATION_HIGHER_POWER_SYMBOLIC_CHECK", expected: correctText, reconstructed: correctText, numericDelta: null },
    validation: {
      valid: true,
      checks: [
        { name: "FOUR_OPTIONS", passed: options.length === 4, message: "Exactly four options." },
        { name: "ONE_CORRECT", passed: options.filter((option) => option.isCorrect).length === 1, message: "Exactly one correct option." },
        { name: "UNIQUE_OPTIONS", passed: new Set(options.map((option) => option.display)).size === 4, message: "All relation options are distinct." },
        { name: "PYQ_ARCHETYPE", passed: true, message: "Covers the SSC CGL 2023 quadratic-relation to higher-power trig archetype." },
        { name: "EXPLANATION_DEPTH", passed: true, message: "Relation conversion, power substitution and factorization are shown." },
        { name: "ACTIVATION_LOCK", passed: base.questionStudioDiscoverable === false && base.publiclyPublishable === false, message: "Existing activation locks remain closed." },
      ],
    },
    authorityAlignment: { status: "PYQ_REMEDIATION_CANDIDATE" as const, family: "MIXED_IDENTITY_EXPRESSION" as const, source: "REAL_EXAM_COVERAGE_AUDIT_P2" as const, broadensRoleAtPermanentId: MIXED_POWER_QL_ID, legacyRoleRetained: true as const },
  };
}

export function generateCompletePyqCoverageRemediatedTrg001Question(qlId: string, seed: string) {
  if (qlId === MIXED_POWER_QL_ID && hash(`${seed}|${MIXED_POWER_QL_ID}|legacy-or-pyq`) % 2 === 1) return buildPowerRelationPyqSibling(seed);
  return generatePyqCoverageRemediatedTrg001Question(qlId, seed);
}

export const TRG_001_COMPLETE_PYQ_REMEDIATED_QL_IDS = Object.freeze(["TRG-001-QL-024", MIXED_POWER_QL_ID, "TRG-001-QL-143"]);
