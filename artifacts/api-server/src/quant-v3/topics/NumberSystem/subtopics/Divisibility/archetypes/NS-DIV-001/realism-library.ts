import stemFamiliesLibrary from "./realism-library/stem-families-expanded.library.json";
import explanationVariantsLibrary from "./realism-library/explanation-variants.library.json";
import numberPatternsLibrary from "./realism-library/number-patterns.library.json";
import distributionRulesLibrary from "./realism-library/distribution-rules.library.json";
import divisorCapabilitiesLibrary from "./realism-library/divisor-capabilities.library.json";
import distributionStrategyLibrary from "./realism-library/distribution-strategy.library.json";
import difficultyBandsLibrary from "./realism-library/difficulty-bands.library.json";
import cpCapabilityMatrixLibrary from "./realism-library/cp-capability-matrix.library.json";
import auditContractLibrary from "./realism-library/audit-contract.library.json";
import type { Cp001QuestionPackage } from "./types";

export type NsDiv001StemFamilyId = `SF-${string}`;
export type NsDiv001ExplanationVariantId = `Variant ${"A" | "B" | "C" | "D" | "E"}`;
export type NsDiv001DivisorCapability = (typeof divisorCapabilitiesLibrary.divisors)[number];

const EXPECTED_STEM_FAMILIES = [
  ["SF-001", "Direct Missing Digit"],
  ["SF-002", "Which Digit"],
  ["SF-003", "Value Of x"],
  ["SF-004", "Number Becomes Divisible"],
  ["SF-005", "MCQ Style"],
  ["SF-006", "Statement Style"],
  ["SF-007", "Fill Blank Style"],
  ["SF-008", "Reverse Style"],
  ["SF-009", "Count Style"],
  ["SF-010", "Largest Digit Style"],
  ["SF-011", "Smallest Digit Style"],
  ["SF-012", "Sum Of Possible Digits"],
  ["SF-013", "Product Of Possible Digits"],
  ["SF-014", "Difference Of Digits"],
  ["SF-015", "Digit Replacement"],
  ["SF-016", "Digit Insertion"],
  ["SF-017", "Digit Completion"],
  ["SF-018", "Greatest Number Formed"],
  ["SF-019", "Smallest Number Formed"],
  ["SF-020", "Number Verification"],
  ["SF-021", "Single Statement"],
  ["SF-022", "Assertion Style"],
  ["SF-023", "Option Elimination"],
  ["SF-024", "Incomplete Number"],
  ["SF-025", "Missing First Digit"],
  ["SF-026", "Missing Middle Digit"],
  ["SF-027", "Missing Last Digit"],
  ["SF-028", "Exam MCQ"],
  ["SF-029", "Direct Question"],
  ["SF-030", "Short Question"],
] as const;

const EXPECTED_EXPLANATION_VARIANTS = [
  ["Variant A", ["Rule", "Apply Rule", "Compute", "Conclude"]],
  ["Variant B", ["Recall Rule", "Observe Digits", "Apply Condition", "Answer"]],
  ["Variant C", ["Check Divisibility Condition", "Form Expression", "Solve", "Final Result"]],
  ["Variant D", ["Required Rule", "Known Information", "Calculation", "Conclusion"]],
  ["Variant E", ["Divisibility Test", "Digit Sum", "Condition Satisfaction", "Answer"]],
] as const;

const EXPECTED_NUMBER_LENGTHS = ["3 digits", "4 digits", "5 digits", "6 digits"] as const;
const EXPECTED_MISSING_POSITIONS = ["Position 1", "Position 2", "Position 3", "Position 4", "Position 5", "Position 6"] as const;
const EXPECTED_STRUCTURES = [
  "x24",
  "2x4",
  "24x",
  "7x24",
  "72x4",
  "724x",
  "5x728",
  "57x28",
  "572x8",
  "5728x",
  "x7384",
  "8x396",
  "83x96",
  "839x6",
  "8396x",
] as const;

const ACTIVE_CP001_STEM_FAMILIES = ["SF-001", "SF-002", "SF-003", "SF-004", "SF-006", "SF-007"] as const;
const ACTIVE_CP001_EXPLANATION_VARIANTS = ["Variant A", "Variant B", "Variant C", "Variant D", "Variant E"] as const;

const EXPECTED_DIVISOR_CAPABILITIES = [
  {
    id: "DIV-002",
    divisor: 2,
    reasoningPattern: { id: "RP-003", name: "Last Digit Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    allowedMissingPositions: ["Last Digit", "Middle Digit", "First Digit"],
    difficulty: "Easy",
    status: "Approved",
  },
  {
    id: "DIV-003",
    divisor: 3,
    reasoningPattern: { id: "RP-001", name: "Digit Sum Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"],
    difficulty: "Easy",
    status: "Approved",
  },
  {
    id: "DIV-004",
    divisor: 4,
    reasoningPattern: { id: "RP-004", name: "Last Two Digits Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Easy-Medium",
    status: "Approved",
  },
  {
    id: "DIV-005",
    divisor: 5,
    reasoningPattern: { id: "RP-003", name: "Last Digit Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Easy",
    status: "Approved",
  },
  {
    id: "DIV-006",
    divisor: 6,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [2, 3],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Medium",
    status: "Approved",
  },
  {
    id: "DIV-008",
    divisor: 8,
    reasoningPattern: { id: "RP-005", name: "Last Three Digits Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Medium",
    status: "Approved",
  },
  {
    id: "DIV-009",
    divisor: 9,
    reasoningPattern: { id: "RP-001", name: "Digit Sum Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"],
    difficulty: "Easy",
    status: "Approved",
  },
  {
    id: "DIV-010",
    divisor: 10,
    reasoningPattern: { id: "RP-003", name: "Last Digit Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Easy",
    status: "Approved",
  },
  {
    id: "DIV-011",
    divisor: 11,
    reasoningPattern: { id: "RP-002", name: "Alternating Sum Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005"],
    difficulty: "Medium",
    status: "Approved",
  },
  {
    id: "DIV-012",
    divisor: 12,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [3, 4],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Medium",
    status: "Approved",
  },
  {
    id: "DIV-015",
    divisor: 15,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [3, 5],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Medium",
    status: "Approved",
  },
  {
    id: "DIV-018",
    divisor: 18,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [2, 9],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Medium-Hard",
    status: "Approved",
  },
  {
    id: "DIV-024",
    divisor: 24,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [3, 8],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Hard",
    status: "Approved",
  },
  {
    id: "DIV-036",
    divisor: 36,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [4, 9],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Hard",
    status: "Approved",
  },
  {
    id: "DIV-072",
    divisor: 72,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [8, 9],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004"],
    difficulty: "Hard",
    status: "Approved",
  },
  {
    id: "DIV-099",
    divisor: 99,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [9, 11],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005"],
    difficulty: "Hard",
    status: "Approved",
  },
] as const;

const EXPECTED_DISTRIBUTION_STRATEGIES = [
  {
    id: "DS-001",
    name: "Answer Distribution",
    target: "Digits 0-9 should be approximately balanced.",
    tolerance: "±5%",
  },
  {
    id: "DS-002",
    name: "Divisor Distribution",
    target: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 15, 18, 24, 36, 72, 99],
    targetNote: "should appear approximately evenly.",
    tolerance: "±5%",
  },
  {
    id: "DS-003",
    name: "Missing Position Distribution",
    target: "First, Middle, Last balanced exposure.",
    tolerance: "±10%",
  },
  {
    id: "DS-004",
    name: "Stem Family Distribution",
    target: "Rotate across approved stem families. No family should dominate.",
    tolerance: "20%",
  },
  {
    id: "DS-005",
    name: "Explanation Variant Distribution",
    target: "Rotate across approved explanation variants.",
    tolerance: "20%",
  },
] as const;

const EXPECTED_DIFFICULTY_BANDS = [
  {
    id: "DB-001",
    name: "Easy",
    characteristics: ["Single divisibility rule.", "Direct resolution."],
  },
  {
    id: "DB-002",
    name: "Easy-Medium",
    characteristics: ["Two-step reasoning."],
  },
  {
    id: "DB-003",
    name: "Medium",
    characteristics: ["Combined divisibility condition."],
  },
  {
    id: "DB-004",
    name: "Medium-Hard",
    characteristics: ["Multiple constraints."],
  },
  {
    id: "DB-005",
    name: "Hard",
    characteristics: ["Complex divisibility combinations."],
  },
] as const;

const EXPECTED_CP_CAPABILITY_MATRIX = [
  { id: "CP-001", name: "Find Missing Digit", status: "IMPLEMENTED" },
  { id: "CP-002", name: "Find Largest Valid Digit", status: "APPROVED" },
  { id: "CP-003", name: "Find Smallest Valid Digit", status: "APPROVED" },
  { id: "CP-004", name: "Count Valid Digits", status: "APPROVED" },
  { id: "CP-005", name: "Sum Of Valid Digits", status: "APPROVED" },
  { id: "CP-006", name: "Product Of Valid Digits", status: "APPROVED" },
  { id: "CP-007", name: "Expression Value Using Missing Digit", status: "APPROVED" },
  { id: "CP-008", name: "Sum Of All Possible Numbers", status: "APPROVED" },
  { id: "CP-009", name: "Difference Of Largest And Smallest Valid Number", status: "APPROVED" },
  { id: "CP-010", name: "Count Valid Numbers Formed", status: "APPROVED" },
] as const;

const EXPECTED_AUDIT_CONTRACT_FIELDS = [
  "Question Count",
  "Stem Family Distribution",
  "Explanation Variant Distribution",
  "Answer Distribution",
  "Divisor Distribution",
  "Missing Position Distribution",
  "Validation Failure Count",
  "Language Failure Count",
  "Realism Failure Count",
] as const;

function assertDeepEqual(name: string, actual: unknown, expected: unknown, failures: string[]) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(`${name} does not match the human-curated library.`);
  }
}

function countBy(values: readonly (number | string)[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function limitViolations(counts: Record<string, number>, maxFrequencyPercent: number, batchSize: number) {
  const limit = Math.floor((maxFrequencyPercent / 100) * batchSize);
  return Object.entries(counts)
    .filter(([, count]) => count > limit)
    .map(([value, count]) => ({ value, count, limit }));
}

export const NS_DIV_001_REALISM_LIBRARY_REGISTRY = {
  stemFamilies: stemFamiliesLibrary,
  explanationVariants: explanationVariantsLibrary,
  numberPatterns: numberPatternsLibrary,
  distributionRules: distributionRulesLibrary,
  divisorCapabilities: divisorCapabilitiesLibrary,
  distributionStrategy: distributionStrategyLibrary,
  difficultyBands: difficultyBandsLibrary,
  cpCapabilityMatrix: cpCapabilityMatrixLibrary,
  auditContract: auditContractLibrary,
} as const;

export function validateNsDiv001RealismLibraries() {
  const failures: string[] = [];
  assertDeepEqual(
    "stem families",
    stemFamiliesLibrary.stemFamilies.map((entry) => [entry.id, entry.name]),
    EXPECTED_STEM_FAMILIES,
    failures,
  );
  assertDeepEqual("explanation style id", explanationVariantsLibrary.styleId, "EA-001", failures);
  assertDeepEqual("explanation style name", explanationVariantsLibrary.styleName, "Tutor Style", failures);
  assertDeepEqual(
    "explanation variants",
    explanationVariantsLibrary.variants.map((entry) => [entry.id, entry.sections]),
    EXPECTED_EXPLANATION_VARIANTS,
    failures,
  );
  assertDeepEqual("allowed number lengths", numberPatternsLibrary.allowedNumberLengths, EXPECTED_NUMBER_LENGTHS, failures);
  assertDeepEqual("allowed missing positions", numberPatternsLibrary.allowedMissingPositions, EXPECTED_MISSING_POSITIONS, failures);
  assertDeepEqual("allowed structures", numberPatternsLibrary.allowedStructures, EXPECTED_STRUCTURES, failures);
  assertDeepEqual("divisor capabilities", divisorCapabilitiesLibrary.divisors, EXPECTED_DIVISOR_CAPABILITIES, failures);
  assertDeepEqual("distribution strategy", distributionStrategyLibrary.strategies, EXPECTED_DISTRIBUTION_STRATEGIES, failures);
  assertDeepEqual("difficulty bands", difficultyBandsLibrary.difficultyBands, EXPECTED_DIFFICULTY_BANDS, failures);
  assertDeepEqual("CP capability matrix", cpCapabilityMatrixLibrary.canonicalProblems, EXPECTED_CP_CAPABILITY_MATRIX, failures);
  assertDeepEqual("audit contract", auditContractLibrary.requiredFields, EXPECTED_AUDIT_CONTRACT_FIELDS, failures);

  return {
    valid: failures.length === 0,
    failures,
  };
}

export function getNsDiv001ApprovedDivisorCapabilities(canonicalProblemId = "CP-001") {
  return divisorCapabilitiesLibrary.divisors.filter((entry) => {
    return entry.status === "Approved" && entry.allowedCanonicalProblems.includes(canonicalProblemId);
  });
}

export function getNsDiv001DivisorCapability(divisor: number) {
  return divisorCapabilitiesLibrary.divisors.find((entry) => entry.divisor === divisor);
}

export function assertNsDiv001DivisorCapabilityAllowed(divisor: number, canonicalProblemId = "CP-001") {
  const capability = getNsDiv001DivisorCapability(divisor);
  if (!capability || capability.status !== "Approved" || !capability.allowedCanonicalProblems.includes(canonicalProblemId)) {
    throw new Error(`Divisor is not approved for ${canonicalProblemId}: ${divisor}`);
  }
  return capability;
}

export function getNsDiv001AllowedStructures() {
  return numberPatternsLibrary.allowedStructures;
}

export function getNsDiv001ActiveCp001StemFamilies() {
  return ACTIVE_CP001_STEM_FAMILIES;
}

export function getNsDiv001ActiveCp001ExplanationVariants() {
  return ACTIVE_CP001_EXPLANATION_VARIANTS;
}

export function getNsDiv001MissingPosition(numberExpression: string) {
  return numberExpression.indexOf("x") + 1;
}

export function assertNsDiv001NumberPatternAllowed(numberExpression: string) {
  if (!numberPatternsLibrary.allowedStructures.includes(numberExpression)) {
    throw new Error(`Number pattern is not present in NS-DIV-001 realism library: ${numberExpression}`);
  }
}

function failedCheckCount(questionPackages: readonly Cp001QuestionPackage[], names: readonly string[]) {
  return questionPackages.reduce((count, item) => {
    return count + item.validation.checks.filter((check) => !check.passed && names.includes(check.name)).length;
  }, 0);
}

function validationFailureCount(questionPackages: readonly Cp001QuestionPackage[]) {
  return questionPackages.filter((item) => !item.validation.valid).length;
}

export function auditNsDiv001BatchRealism(questionPackages: readonly Cp001QuestionPackage[]) {
  const rules = distributionRulesLibrary;
  const answerDistribution = countBy(questionPackages.map((item) => item.answer));
  const divisorDistribution = countBy(questionPackages.map((item) => item.parameters.divisor));
  const positionDistribution = countBy(questionPackages.map((item) => item.parameters.missingPosition));
  const stemFamilyDistribution = countBy(questionPackages.map((item) => item.stemFamilyId));
  const explanationVariantDistribution = countBy(questionPackages.map((item) => item.explanation.variantId));

  const violations = {
    answerDistribution: limitViolations(answerDistribution, rules.answerDistribution.maxFrequencyPercent, rules.answerDistribution.batchSize),
    divisorDistribution: limitViolations(divisorDistribution, rules.divisorDistribution.maxFrequencyPercent, rules.divisorDistribution.batchSize),
    positionDistribution: limitViolations(positionDistribution, rules.positionDistribution.maxFrequencyPercent, rules.positionDistribution.batchSize),
    stemFamilyDistribution: limitViolations(stemFamilyDistribution, rules.stemFamilyDistribution.maxFrequencyPercent, rules.stemFamilyDistribution.batchSize),
    explanationVariantDistribution: limitViolations(
      explanationVariantDistribution,
      rules.explanationVariantDistribution.maxFrequencyPercent,
      rules.explanationVariantDistribution.batchSize,
    ),
  };
  const languageFailureCount = failedCheckCount(questionPackages, ["approved stem language", "teacher explanation language"]);
  const realismContractFailureCount = failedCheckCount(questionPackages, [
    "realism libraries valid",
    "number pattern approved",
    "divisor capability approved",
    "stem family registered",
    "explanation variant registered",
  ]);
  const distributionFailureCount = Object.values(violations).reduce((sum, items) => sum + items.length, 0);

  return {
    batchSize: questionPackages.length,
    auditContract: {
      questionCount: questionPackages.length,
      stemFamilyDistribution,
      explanationVariantDistribution,
      answerDistribution,
      divisorDistribution,
      missingPositionDistribution: positionDistribution,
      validationFailureCount: validationFailureCount(questionPackages),
      languageFailureCount,
      realismFailureCount: realismContractFailureCount + distributionFailureCount,
    },
    distributions: {
      answerDistribution,
      divisorDistribution,
      positionDistribution,
      stemFamilyDistribution,
      explanationVariantDistribution,
    },
    violations,
    valid: Object.values(violations).every((items) => items.length === 0),
  };
}

export function assertNsDiv001BatchRealism(questionPackages: readonly Cp001QuestionPackage[]) {
  const audit = auditNsDiv001BatchRealism(questionPackages);
  if (!audit.valid) {
    throw new Error("NS-DIV-001 batch violates human-curated realism distribution rules.");
  }
  return audit;
}
