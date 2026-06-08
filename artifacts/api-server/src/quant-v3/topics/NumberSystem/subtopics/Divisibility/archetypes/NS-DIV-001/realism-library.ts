import stemFamiliesLibrary from "./realism-library/stem-families-expanded.library.json";
import explanationVariantsLibrary from "./realism-library/explanation-variants.library.json";
import numberPatternsLibrary from "./realism-library/number-patterns.library.json";
import distributionRulesLibrary from "./realism-library/distribution-rules.library.json";
import divisorCapabilitiesLibrary from "./realism-library/divisor-capabilities.library.json";
import distributionStrategyLibrary from "./realism-library/distribution-strategy.library.json";
import difficultyBandsLibrary from "./realism-library/difficulty-bands.library.json";
import cpCapabilityMatrixLibrary from "./realism-library/cp-capability-matrix.library.json";
import auditContractLibrary from "./realism-library/audit-contract.library.json";
import questionLanguageLibrary from "./realism-library/question-language.library.json";
import explanationStylesLibrary from "./realism-library/explanation-styles.library.json";
import validDigitSetQuestionLanguageLibrary from "./realism-library/valid-digit-set-question-language.library.json";
import validDigitSetExplanationLibrary from "./realism-library/valid-digit-set-explanation.library.json";
import type { Cp001QuestionPackage, Cp002QuestionPackage, ValidDigitSetQuestionPackage, NsDiv001ValidDigitSetCanonicalProblemId } from "./types";

export type NsDiv001StemFamilyId = `SF-${string}`;
export type NsDiv001ExplanationVariantId = `Variant ${"A" | "B" | "C" | "D" | "E"}`;
export type NsDiv001ExplanationStyleId = "ES-001" | "ES-002" | "ES-003";
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
  "x724",
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
  "x2849",
  "2x849",
  "28x49",
  "284x9",
  "2849x",
  "x72849",
  "7x2849",
  "72x849",
  "728x49",
  "7284x9",
  "72849x",
] as const;

const ACTIVE_CP001_STEM_FAMILIES = ["SF-001", "SF-002", "SF-003", "SF-004", "SF-006", "SF-007"] as const;
const ACTIVE_CP001_EXPLANATION_VARIANTS = ["Variant A", "Variant B", "Variant C", "Variant D", "Variant E"] as const;

const EXPECTED_EXPLANATION_STYLES = [
  {
    id: "ES-001",
    name: "Teacher Style",
    defaultUsageTarget: "70%",
    renderingRules: [
      "Explain the concept.",
      "Apply the concept.",
      "Show the key calculation.",
      "Give the answer.",
      "Normally 4-8 lines.",
    ],
  },
  {
    id: "ES-002",
    name: "Short Exam Style",
    defaultUsageTarget: "20%",
    renderingRules: [
      "Skip unnecessary narration.",
      "Show only essential calculation.",
      "Give answer quickly.",
      "Normally 2-5 lines.",
    ],
  },
  {
    id: "ES-003",
    name: "Detailed Teaching Style",
    defaultUsageTarget: "10%",
    renderingRules: [
      "Explain the concept.",
      "Explain why the concept applies.",
      "Show the calculation.",
      "Show intermediate reasoning.",
      "Give answer.",
      "Normally 6-12 lines.",
    ],
  },
] as const;

const EXPECTED_DIVISOR_CAPABILITIES = [
  {
    id: "DIV-002",
    divisor: 2,
    reasoningPattern: { id: "RP-003", name: "Last Digit Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    allowedMissingPositions: ["Last Digit", "Middle Digit", "First Digit"],
    difficulty: "Easy",
    status: "Approved",
  },
  {
    id: "DIV-003",
    divisor: 3,
    reasoningPattern: { id: "RP-001", name: "Digit Sum Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Easy",
    status: "Approved",
  },
  {
    id: "DIV-004",
    divisor: 4,
    reasoningPattern: { id: "RP-004", name: "Last Two Digits Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Easy-Medium",
    status: "Approved",
  },
  {
    id: "DIV-005",
    divisor: 5,
    reasoningPattern: { id: "RP-003", name: "Last Digit Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Easy",
    status: "Approved",
  },
  {
    id: "DIV-006",
    divisor: 6,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [2, 3],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Medium",
    status: "Approved",
  },
  {
    id: "DIV-008",
    divisor: 8,
    reasoningPattern: { id: "RP-005", name: "Last Three Digits Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Medium",
    status: "Approved",
  },
  {
    id: "DIV-009",
    divisor: 9,
    reasoningPattern: { id: "RP-001", name: "Digit Sum Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Easy",
    status: "Approved",
  },
  {
    id: "DIV-010",
    divisor: 10,
    reasoningPattern: { id: "RP-003", name: "Last Digit Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Easy",
    status: "Approved",
  },
  {
    id: "DIV-011",
    divisor: 11,
    reasoningPattern: { id: "RP-002", name: "Alternating Sum Rule" },
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Medium",
    status: "Approved",
  },
  {
    id: "DIV-012",
    divisor: 12,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [3, 4],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Medium",
    status: "Approved",
  },
  {
    id: "DIV-015",
    divisor: 15,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [3, 5],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Medium",
    status: "Approved",
  },
  {
    id: "DIV-018",
    divisor: 18,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [2, 9],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Medium-Hard",
    status: "Approved",
  },
  {
    id: "DIV-024",
    divisor: 24,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [3, 8],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Hard",
    status: "Approved",
  },
  {
    id: "DIV-036",
    divisor: 36,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [4, 9],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Hard",
    status: "Approved",
  },
  {
    id: "DIV-072",
    divisor: 72,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [8, 9],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
    difficulty: "Hard",
    status: "Approved",
  },
  {
    id: "DIV-099",
    divisor: 99,
    reasoningPattern: { id: "RP-006", name: "Combined Divisibility Rule" },
    components: [9, 11],
    allowedCanonicalProblems: ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"],
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
  { id: "CP-002", name: "Find Largest Valid Digit", status: "IMPLEMENTED" },
  { id: "CP-003", name: "Find Smallest Valid Digit", status: "IMPLEMENTED" },
  { id: "CP-004", name: "Count Valid Digits", status: "IMPLEMENTED" },
  { id: "CP-005", name: "Sum Of Valid Digits", status: "IMPLEMENTED" },
  { id: "CP-006", name: "Form Greatest Valid Number", status: "IMPLEMENTED" },
  { id: "CP-007", name: "Form Smallest Valid Number", status: "IMPLEMENTED" },
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

const EXPECTED_QUESTION_LANGUAGE = [
  {
    id: "SF-001",
    name: "Direct Missing Digit",
    entries: [
      { id: "QL-001", text: "The digit x in {number} is such that the number is divisible by {divisor}. Find x." },
      { id: "QL-002", text: "In the number {number}, x is a digit. If the number is divisible by {divisor}, find x." },
      { id: "QL-003", text: "The number {number} is divisible by {divisor}. Determine the value of x." },
      { id: "QL-004", text: "Find the value of x if {number} is divisible by {divisor}." },
      { id: "QL-005", text: "What should be the value of x so that {number} is divisible by {divisor}?" },
    ],
  },
  {
    id: "SF-002",
    name: "Which Digit",
    entries: [
      { id: "QL-006", text: "Which digit should replace x so that {number} is divisible by {divisor}?" },
      { id: "QL-007", text: "The number {number} is divisible by {divisor}. Which digit can replace x?" },
      { id: "QL-008", text: "Choose the digit that makes {number} divisible by {divisor}." },
      { id: "QL-009", text: "Which of the following digits can replace x so that {number} is divisible by {divisor}?" },
      { id: "QL-010", text: "Find the digit that should replace x in {number} to make it divisible by {divisor}." },
    ],
  },
  {
    id: "SF-003",
    name: "Value Of x",
    entries: [
      { id: "QL-011", text: "If {number} is divisible by {divisor}, the value of x is:" },
      { id: "QL-012", text: "The value of x for which {number} becomes divisible by {divisor} is:" },
      { id: "QL-013", text: "For divisibility by {divisor}, x must be:" },
      { id: "QL-014", text: "If {number} is exactly divisible by {divisor}, then x equals:" },
      { id: "QL-015", text: "What is the value of x when {number} is divisible by {divisor}?" },
    ],
  },
  {
    id: "SF-004",
    name: "Number Becomes Divisible",
    entries: [
      { id: "QL-016", text: "{number} becomes divisible by {divisor} when x is:" },
      { id: "QL-017", text: "For what value of x does {number} become divisible by {divisor}?" },
      { id: "QL-018", text: "Find x so that {number} is divisible by {divisor}." },
      { id: "QL-019", text: "Determine x such that divisibility by {divisor} is satisfied." },
      { id: "QL-020", text: "The number {number} is divisible by {divisor} only when x is:" },
    ],
  },
  {
    id: "SF-006",
    name: "Statement Style",
    entries: [
      { id: "QL-021", text: "A digit x is inserted in {number} to make the number divisible by {divisor}. Find x." },
      { id: "QL-022", text: "The blank in {number} is represented by x. Find x if the number is divisible by {divisor}." },
      { id: "QL-023", text: "A missing digit x appears in {number}. Find x so that the number is divisible by {divisor}." },
      { id: "QL-024", text: "The digit x replaces a blank in {number}. If the resulting number is divisible by {divisor}, find x." },
      { id: "QL-025", text: "A digit has been replaced by x in {number}. Find x if divisibility by {divisor} holds." },
    ],
  },
  {
    id: "SF-007",
    name: "Fill Blank Style",
    entries: [
      { id: "QL-026", text: "{number} is divisible by {divisor}. The missing digit is:" },
      { id: "QL-027", text: "Fill in the missing digit so that {number} becomes divisible by {divisor}." },
      { id: "QL-028", text: "The blank in {number} should be filled with which digit to make it divisible by {divisor}?" },
      { id: "QL-029", text: "Choose the missing digit that makes {number} divisible by {divisor}." },
      { id: "QL-030", text: "Find the digit required in {number} for divisibility by {divisor}." },
    ],
  },
] as const;

const EXPECTED_FORBIDDEN_QUESTION_LANGUAGE = [
  "For the number",
  "What value is obtained",
  "By tracking",
  "Candidate value",
  "Constraint satisfaction",
  "Valid assignment",
  "Resolve the unknown digit",
  "Evaluate the digit",
  "Internal identifier",
  "Reasoning graph",
  "Pipeline",
  "Contract",
  "Node",
  "Source trace",
  "Ownership metadata",
  "System output",
  "Implementation detail",
] as const;

const EXPECTED_VALID_DIGIT_SET_QUESTION_LANGUAGE = [
  {
    id: "CP-003",
    name: "Smallest Valid Digit",
    stemFamilies: [
      { id: "SF-001", text: "Find the smallest digit that can replace x so that the number {numberExpression} is divisible by {divisor}." },
      { id: "SF-002", text: "What is the least value of x for which {numberExpression} becomes divisible by {divisor}?" },
      { id: "SF-003", text: "Determine the minimum digit that can replace x in {numberExpression} so that the resulting number is divisible by {divisor}." },
    ],
  },
  {
    id: "CP-004",
    name: "Count Valid Digits",
    stemFamilies: [
      { id: "SF-001", text: "How many digits can replace x so that the number {numberExpression} is divisible by {divisor}?" },
      { id: "SF-002", text: "How many possible values of x make {numberExpression} divisible by {divisor}?" },
      { id: "SF-003", text: "Find the number of digits that satisfy the divisibility condition." },
    ],
  },
  {
    id: "CP-005",
    name: "Sum of Valid Digits",
    stemFamilies: [
      { id: "SF-001", text: "Find the sum of all digits that can replace x so that the number {numberExpression} is divisible by {divisor}." },
      {
        id: "SF-002",
        text: "The digit x is replaced so that {numberExpression} becomes divisible by {divisor}. Find the sum of all possible values of x.",
      },
      { id: "SF-003", text: "Determine the sum of all valid digits." },
    ],
  },
  {
    id: "CP-006",
    name: "Greatest Valid Number",
    stemFamilies: [
      { id: "SF-001", text: "Replace x with a suitable digit so that the resulting number is divisible by {divisor}. Find the greatest such number." },
      { id: "SF-002", text: "What is the greatest number that can be formed from {numberExpression} while remaining divisible by {divisor}?" },
      { id: "SF-003", text: "Find the largest divisible number obtainable by replacing x." },
    ],
  },
  {
    id: "CP-007",
    name: "Smallest Valid Number",
    stemFamilies: [
      { id: "SF-001", text: "Replace x with a suitable digit so that the resulting number is divisible by {divisor}. Find the smallest such number." },
      { id: "SF-002", text: "What is the smallest number that can be formed from {numberExpression} while remaining divisible by {divisor}?" },
      { id: "SF-003", text: "Find the least divisible number obtainable by replacing x." },
    ],
  },
] as const;

const EXPECTED_VALID_DIGIT_SET_EXPLANATION_STYLES = [
  {
    id: "EX-001",
    template: [
      "For divisibility by {divisor}, {ruleText}.",
      "The valid digits are:",
      "{validDigitList}",
      "Therefore, {conclusion}.",
    ],
  },
  {
    id: "EX-002",
    template: [
      "Applying the divisibility rule for {divisor}, we obtain the valid digits:",
      "{validDigitList}",
      "Hence, {conclusion}.",
    ],
  },
  {
    id: "EX-003",
    template: [
      "The digits satisfying the divisibility condition are:",
      "{validDigitList}",
      "So, {conclusion}.",
    ],
  },
] as const;

const EXPECTED_VALID_DIGIT_SET_CONCLUSIONS = [
  { canonicalProblemId: "CP-003", text: "The smallest valid digit is {answer}." },
  { canonicalProblemId: "CP-004", text: "The number of valid digits is {answer}." },
  { canonicalProblemId: "CP-005", text: "The sum of the valid digits is {answer}." },
  { canonicalProblemId: "CP-006", text: "The greatest valid number is {answer}." },
  { canonicalProblemId: "CP-007", text: "The smallest valid number is {answer}." },
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
  questionLanguage: questionLanguageLibrary,
  explanationStyles: explanationStylesLibrary,
  validDigitSetQuestionLanguage: validDigitSetQuestionLanguageLibrary,
  validDigitSetExplanation: validDigitSetExplanationLibrary,
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
  assertDeepEqual("question language", questionLanguageLibrary.stemFamilies, EXPECTED_QUESTION_LANGUAGE, failures);
  assertDeepEqual("forbidden question language", questionLanguageLibrary.forbiddenQuestionLanguage, EXPECTED_FORBIDDEN_QUESTION_LANGUAGE, failures);
  assertDeepEqual("explanation styles", explanationStylesLibrary.styles, EXPECTED_EXPLANATION_STYLES, failures);
  assertDeepEqual(
    "valid digit set question language",
    validDigitSetQuestionLanguageLibrary.canonicalProblems,
    EXPECTED_VALID_DIGIT_SET_QUESTION_LANGUAGE,
    failures,
  );
  assertDeepEqual("valid digit set explanation styles", validDigitSetExplanationLibrary.styles, EXPECTED_VALID_DIGIT_SET_EXPLANATION_STYLES, failures);
  assertDeepEqual("valid digit set conclusions", validDigitSetExplanationLibrary.conclusions, EXPECTED_VALID_DIGIT_SET_CONCLUSIONS, failures);

  return {
    valid: failures.length === 0,
    failures,
  };
}

export function getNsDiv001QuestionLanguageFamilies() {
  return questionLanguageLibrary.stemFamilies;
}

export function getNsDiv001ValidDigitSetQuestionLanguageFamilies(canonicalProblemId: NsDiv001ValidDigitSetCanonicalProblemId) {
  return validDigitSetQuestionLanguageLibrary.canonicalProblems.find((item) => item.id === canonicalProblemId)?.stemFamilies ?? [];
}

export function getNsDiv001ForbiddenQuestionLanguage() {
  return questionLanguageLibrary.forbiddenQuestionLanguage;
}

export function renderNsDiv001QuestionLanguage(input: {
  familyId: string;
  entryIndex: number;
  number: string;
  divisor: number;
}) {
  const family = questionLanguageLibrary.stemFamilies.find((item) => item.id === input.familyId);
  if (!family) {
    throw new Error(`Question language family is not registered: ${input.familyId}`);
  }
  const entry = family.entries[input.entryIndex % family.entries.length];
  return {
    familyId: family.id,
    questionLanguageId: entry.id,
    stem: entry.text.replace("{number}", input.number).replace("{divisor}", String(input.divisor)),
  };
}

export function isNsDiv001RenderedQuestionLanguage(input: {
  familyId: string;
  questionLanguageId: string;
  stem: string;
  number: string;
  divisor: number;
}) {
  const family = questionLanguageLibrary.stemFamilies.find((item) => item.id === input.familyId);
  const entry = family?.entries.find((item) => item.id === input.questionLanguageId);
  if (!entry) return false;
  const rendered = entry.text.replace("{number}", input.number).replace("{divisor}", String(input.divisor));
  return rendered === input.stem;
}

export function renderNsDiv001ValidDigitSetQuestionLanguage(input: {
  canonicalProblemId: NsDiv001ValidDigitSetCanonicalProblemId;
  familyId: string;
  numberExpression: string;
  divisor: number;
}) {
  const family = getNsDiv001ValidDigitSetQuestionLanguageFamilies(input.canonicalProblemId).find((item) => item.id === input.familyId);
  if (!family) {
    throw new Error(`${input.canonicalProblemId} question language family is not registered: ${input.familyId}`);
  }
  return {
    familyId: family.id,
    questionLanguageId: family.id,
    stem: family.text.replace("{numberExpression}", input.numberExpression).replace("{divisor}", String(input.divisor)),
  };
}

export function isNsDiv001RenderedValidDigitSetQuestionLanguage(input: {
  canonicalProblemId: NsDiv001ValidDigitSetCanonicalProblemId;
  familyId: string;
  questionLanguageId: string;
  stem: string;
  numberExpression: string;
  divisor: number;
}) {
  const family = getNsDiv001ValidDigitSetQuestionLanguageFamilies(input.canonicalProblemId).find((item) => item.id === input.familyId);
  if (!family || family.id !== input.questionLanguageId) return false;
  const rendered = family.text.replace("{numberExpression}", input.numberExpression).replace("{divisor}", String(input.divisor));
  return rendered === input.stem;
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

export function getNsDiv001ExplanationStyles() {
  return explanationStylesLibrary.styles;
}

export function assertNsDiv001ExplanationStyleAllowed(styleId: string) {
  const style = explanationStylesLibrary.styles.find((entry) => entry.id === styleId);
  if (!style) {
    throw new Error(`Explanation style is not registered for NS-DIV-001: ${styleId}`);
  }
  return style;
}

export function assertNsDiv001ValidDigitSetExplanationStyleAllowed(styleId: string) {
  const style = validDigitSetExplanationLibrary.styles.find((entry) => entry.id === styleId);
  if (!style) {
    throw new Error(`Valid digit set explanation style is not registered for NS-DIV-001: ${styleId}`);
  }
  return style;
}

export function getNsDiv001ValidDigitSetConclusion(canonicalProblemId: NsDiv001ValidDigitSetCanonicalProblemId) {
  const conclusion = validDigitSetExplanationLibrary.conclusions.find((entry) => entry.canonicalProblemId === canonicalProblemId);
  if (!conclusion) {
    throw new Error(`Valid digit set conclusion is not registered for ${canonicalProblemId}.`);
  }
  return conclusion;
}

function stableBucket(value: string) {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) % 10000;
  }
  return hash % 100;
}

function usageTargetPercent(value: string) {
  return Number(value.replace("%", ""));
}

export function selectNsDiv001ExplanationStyle(input: {
  numberExpression: string;
  divisor: number;
  answerDigit: number;
  knownDigitSum: number;
}) {
  const bucket = stableBucket(`${input.numberExpression}|${input.divisor}|${input.answerDigit}|${input.knownDigitSum}`);
  let cumulativeTarget = 0;
  for (const style of explanationStylesLibrary.styles) {
    cumulativeTarget += usageTargetPercent(style.defaultUsageTarget);
    if (bucket < cumulativeTarget) {
      return style;
    }
  }
  return explanationStylesLibrary.styles[0];
}

export function selectNsDiv001ValidDigitSetStemFamily(input: {
  canonicalProblemId: NsDiv001ValidDigitSetCanonicalProblemId;
  questionId: string;
  numberExpression: string;
  divisor: number;
}) {
  const bucket = stableBucket(`${input.questionId}|${input.numberExpression}|${input.divisor}`);
  const families = getNsDiv001ValidDigitSetQuestionLanguageFamilies(input.canonicalProblemId);
  return families[bucket % families.length];
}

export function selectNsDiv001ValidDigitSetExplanationStyle(input: {
  questionId: string;
  numberExpression: string;
  divisor: number;
  answer: number;
}) {
  const bucket = stableBucket(`${input.questionId}|${input.numberExpression}|${input.divisor}|${input.answer}`);
  return validDigitSetExplanationLibrary.styles[bucket % validDigitSetExplanationLibrary.styles.length];
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
  const questionLanguageDistribution = countBy(questionPackages.map((item) => item.questionLanguageId));
  const explanationVariantDistribution = countBy(questionPackages.map((item) => item.explanation.variantId));
  const styleUsageDistribution = countBy(questionPackages.map((item) => item.explanation.styleId));

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
    "structural pattern library valid",
    "structural pattern approved",
    "instance validation",
    "traceability validation",
    "divisor capability approved",
    "stem family registered",
    "question language registered",
    "explanation variant registered",
    "explanation style registered",
  ]);
  const distributionFailureCount = Object.values(violations).reduce((sum, items) => sum + items.length, 0);

  return {
    batchSize: questionPackages.length,
    auditContract: {
      questionCount: questionPackages.length,
      stemFamilyDistribution,
      questionLanguageDistribution,
      explanationVariantDistribution,
      styleUsageDistribution,
      es001Count: styleUsageDistribution["ES-001"] ?? 0,
      es002Count: styleUsageDistribution["ES-002"] ?? 0,
      es003Count: styleUsageDistribution["ES-003"] ?? 0,
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
      styleUsageDistribution,
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

export function auditNsDiv001Cp002Batch(questionPackages: readonly Cp002QuestionPackage[]) {
  const largestDigitDistribution = countBy(questionPackages.map((item) => item.answer));
  const validSetSizeDistribution = countBy(questionPackages.map((item) => item.solver.validDigitSet.length));
  const divisorDistribution = countBy(questionPackages.map((item) => item.parameters.divisor));
  const patternDistribution = countBy(questionPackages.map((item) => item.parameters.patternId));
  const instanceDistribution = countBy(questionPackages.map((item) => item.parameters.numberExpression));
  const questionDistribution = countBy(questionPackages.map((item) => item.questionId));
  const explanationStyleDistribution = countBy(questionPackages.map((item) => item.explanation.styleId));
  const validationFailureCount = questionPackages.filter((item) => !item.validation.valid).length;
  const failureReporting = {
    candidateSetFailureCount: questionPackages.reduce((sum, item) => {
      return sum + item.validation.checks.filter((check) => !check.passed && check.name.includes("candidate")).length;
    }, 0),
    validDigitSetFailureCount: questionPackages.reduce((sum, item) => {
      return sum + item.validation.checks.filter((check) => !check.passed && check.name.includes("valid digit set")).length;
    }, 0),
    largestDigitFailureCount: questionPackages.reduce((sum, item) => {
      return sum + item.validation.checks.filter((check) => !check.passed && check.name.includes("largest")).length;
    }, 0),
    graphFailureCount: questionPackages.reduce((sum, item) => {
      return sum + item.validation.checks.filter((check) => !check.passed && check.name.includes("graph")).length;
    }, 0),
    explanationFailureCount: questionPackages.reduce((sum, item) => {
      return sum + item.validation.checks.filter((check) => !check.passed && check.name.includes("explanation")).length;
    }, 0),
  };

  return {
    questionCount: questionPackages.length,
    largestDigitDistribution,
    validSetSizeDistribution,
    divisorDistribution,
    patternDistribution,
    instanceDistribution,
    questionDistribution,
    explanationStyleDistribution,
    failureReporting: {
      validationFailureCount,
      ...failureReporting,
    },
  };
}

export function auditNsDiv001ValidDigitSetBatch(questionPackages: readonly ValidDigitSetQuestionPackage[]) {
  return {
    questionCount: questionPackages.length,
    divisorDistribution: countBy(questionPackages.map((item) => item.parameters.divisor)),
    patternDistribution: countBy(questionPackages.map((item) => item.patternId)),
    structuralPatternDistribution: countBy(questionPackages.map((item) => item.patternId)),
    instanceDistribution: countBy(questionPackages.map((item) => item.parameters.numberExpression)),
    stemFamilyDistribution: countBy(questionPackages.map((item) => item.stemFamilyId)),
    explanationStyleDistribution: countBy(questionPackages.map((item) => item.explanation.styleId)),
    answerDistribution: countBy(questionPackages.map((item) => item.answer)),
    validDigitSetDistribution: countBy(questionPackages.map((item) => item.solver.validDigitSet.join(","))),
    validationFailureCount: questionPackages.filter((item) => !item.validation.valid).length,
    traceabilityFailureCount: questionPackages.filter((item) => !item.questionId || !item.patternId || !item.instanceId).length,
  };
}

export function auditNsDiv001Cp003Batch(questionPackages: readonly ValidDigitSetQuestionPackage[]) {
  return auditNsDiv001ValidDigitSetBatch(questionPackages);
}

export function auditNsDiv001PatternSystemV2Batch(questionPackages: readonly (Cp001QuestionPackage | Cp002QuestionPackage | ValidDigitSetQuestionPackage)[]) {
  return {
    questionCount: questionPackages.length,
    patternDistribution: countBy(questionPackages.map((item) => item.patternId)),
    instanceDistribution: countBy(questionPackages.map((item) => item.parameters.numberExpression)),
    questionDistribution: countBy(questionPackages.map((item) => item.canonicalProblemId)),
    validationFailureCount: questionPackages.filter((item) => !item.validation.valid).length,
    traceabilityFailureCount: questionPackages.filter((item) => !item.questionId || !item.patternId || !item.instanceId).length,
  };
}
