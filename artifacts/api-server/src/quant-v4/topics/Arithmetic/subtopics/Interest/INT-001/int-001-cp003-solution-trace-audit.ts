import {
  INT_CP003_EXAM_GENERATOR_VERSION,
  INT_CP003_QL_IDS,
  generateIntCp003ExamQuestion,
} from "./cp003-exam-runtime";
import {
  INT_CP003_SOLUTION_TRACE_VERSION,
  validateCp003SolutionTrace,
  type Cp003SolutionMethodId,
  type Cp003SolutionOperationId,
  type Cp003SolutionTrace,
} from "./cp003-solution-trace";

const EXPECTED_METHOD_BY_QL: Readonly<Record<(typeof INT_CP003_QL_IDS)[number], Cp003SolutionMethodId>> = Object.freeze({
  "INT-QL-053": "DIRECT_ANNUAL_FACTOR",
  "INT-QL-054": "AMOUNT_MINUS_PRINCIPAL",
  "INT-QL-055": "REVERSE_COMPOUND_FACTOR",
  "INT-QL-056": "REVERSE_COMPOUND_INTEREST_FACTOR",
  "INT-QL-057": "AMOUNT_RATIO_FACTOR_MATCH",
  "INT-QL-058": "FACTOR_POWER_TIME_MATCH",
  "INT-QL-059": "NTH_YEAR_OPENING_BALANCE",
  "INT-QL-060": "REVERSE_NTH_YEAR_INTEREST_FACTOR",
  "INT-QL-061": "NTH_YEAR_RATE_SUBSTITUTION",
  "INT-QL-062": "REVERSE_ONE_YEAR_FACTOR",
  "INT-QL-063": "CONSECUTIVE_BALANCE_RATE",
  "INT-QL-064": "CONSECUTIVE_BALANCE_PRINCIPAL",
  "INT-QL-065": "ANNUAL_AMOUNT_DIFFERENCE",
  "INT-QL-066": "YEARLY_INTEREST_GEOMETRIC_GROWTH",
});

const operationCounts = new Map<Cp003SolutionOperationId, number>();
const methodCounts = new Map<Cp003SolutionMethodId, number>();
let questionCount = 0;
let traceValidationChecks = 0;
let explanationLineageChecks = 0;
let sourceStepChecks = 0;
let languageNeutralityChecks = 0;
let frozenTraceChecks = 0;
let relationVerificationChecks = 0;
let editorialTraceChecks = 0;
let totalCoreSteps = 0;
let totalFoundationSteps = 0;
let totalVerificationSteps = 0;

function assertFrozenTrace(trace: Cp003SolutionTrace, prefix: string): void {
  if (!Object.isFrozen(trace) || !Object.isFrozen(trace.coreSteps) || !Object.isFrozen(trace.foundationSteps) || !Object.isFrozen(trace.verificationSteps)) {
    throw new Error(`${prefix}: trace container is not frozen`);
  }
  for (const step of [...trace.coreSteps, ...trace.foundationSteps, ...trace.verificationSteps]) {
    if (!Object.isFrozen(step) || !Object.isFrozen(step.data) || step.data.some((entry) => !Object.isFrozen(entry))) {
      throw new Error(`${prefix}: trace step is not deeply frozen`);
    }
    frozenTraceChecks += 2 + step.data.length;
  }
}

function assertLanguageNeutralTrace(trace: Cp003SolutionTrace, prefix: string): void {
  const serialized = JSON.stringify(trace, (_key, value) => typeof value === "bigint" ? value.toString() : value);
  if (/₹|\\%|\bTherefore\b|\bAnnual factor\b|\binterest earned\b|\bprincipal is\b/iu.test(serialized)) {
    throw new Error(`${prefix}: learner-facing prose leaked into semantic trace`);
  }
  for (const step of [...trace.coreSteps, ...trace.foundationSteps, ...trace.verificationSteps]) {
    if (!/^[A-Z0-9_]+$/u.test(step.teachingKey)) throw new Error(`${prefix}: non-key teaching text in trace`);
    if (!/^[A-Z0-9_]+$/u.test(step.operationId)) throw new Error(`${prefix}: non-key operation text in trace`);
    languageNeutralityChecks += 2;
  }
}

function assertSourceIds(
  sourceIds: readonly string[],
  allowedIds: ReadonlySet<string>,
  prefix: string,
  surface: string,
): void {
  if (sourceIds.length === 0) throw new Error(`${prefix}: ${surface} has no source-step lineage`);
  for (const sourceId of sourceIds) {
    if (!allowedIds.has(sourceId)) throw new Error(`${prefix}: ${surface} references unknown trace step ${sourceId}`);
    sourceStepChecks += 1;
  }
}

function normalizedText(value: string): string {
  return value.replace(/\s+/gu, " ").trim().toLowerCase();
}

for (const qlId of INT_CP003_QL_IDS) {
  for (let index = 0; index < 100; index += 1) {
    const question = generateIntCp003ExamQuestion(qlId, `int-cp003-solution-trace:${qlId}:${index}`);
    const prefix = `${qlId}/${index}`;
    const trace = question.solutionTrace;
    questionCount += 1;

    if (question.generatorVersion !== INT_CP003_EXAM_GENERATOR_VERSION) throw new Error(`${prefix}: stale generator version`);
    if (trace.version !== INT_CP003_SOLUTION_TRACE_VERSION) throw new Error(`${prefix}: trace version mismatch`);
    if (trace.qlId !== question.qlId) throw new Error(`${prefix}: trace QL mismatch`);
    if (trace.methodId !== EXPECTED_METHOD_BY_QL[qlId]) throw new Error(`${prefix}: unexpected method ${trace.methodId}`);
    if (trace.answerSemantic !== question.answerSemantic) throw new Error(`${prefix}: trace semantic mismatch`);
    if (trace.finalAnswer.numerator !== question.solution.numerator || trace.finalAnswer.denominator !== question.solution.denominator) throw new Error(`${prefix}: trace final answer mismatch`);
    if (!trace.relationVerified) throw new Error(`${prefix}: trace is not relation-verified`);
    relationVerificationChecks += 3;

    const validation = validateCp003SolutionTrace(trace, question.mathematicalState);
    if (!validation.ok) throw new Error(`${prefix}: ${validation.errors.join(" | ")}`);
    traceValidationChecks += 1;

    assertFrozenTrace(trace, prefix);
    assertLanguageNeutralTrace(trace, prefix);

    methodCounts.set(trace.methodId, (methodCounts.get(trace.methodId) ?? 0) + 1);
    for (const step of [...trace.coreSteps, ...trace.foundationSteps, ...trace.verificationSteps]) {
      operationCounts.set(step.operationId, (operationCounts.get(step.operationId) ?? 0) + 1);
    }
    totalCoreSteps += trace.coreSteps.length;
    totalFoundationSteps += trace.foundationSteps.length;
    totalVerificationSteps += trace.verificationSteps.length;

    if (question.explanation.traceVersion !== trace.version) throw new Error(`${prefix}: explanation trace-version drift`);
    if (question.explanation.methodId !== trace.methodId) throw new Error(`${prefix}: explanation method drift`);
    const coreIds = new Set(trace.coreSteps.map((step) => step.id));
    const foundationIds = new Set(trace.foundationSteps.map((step) => step.id));
    const verificationIds = new Set(trace.verificationSteps.map((step) => step.id));
    assertSourceIds(question.explanation.sourceStepIds, coreIds, prefix, "main explanation");
    assertSourceIds(question.explanation.depths.exam.sourceStepIds, coreIds, prefix, "exam explanation");
    assertSourceIds(question.explanation.depths.student.sourceStepIds, coreIds, prefix, "student explanation");
    assertSourceIds(question.explanation.depths.foundation.sourceStepIds, foundationIds.size > 0 ? foundationIds : coreIds, prefix, "foundation explanation");
    if (question.explanation.steps.length !== question.explanation.sourceStepIds.length) throw new Error(`${prefix}: main rendered-step/source-step count mismatch`);
    if (question.explanation.depths.exam.steps.length !== question.explanation.depths.exam.sourceStepIds.length) throw new Error(`${prefix}: exam rendered-step/source-step count mismatch`);
    if (question.explanation.depths.foundation.steps.length !== question.explanation.depths.foundation.sourceStepIds.length) throw new Error(`${prefix}: foundation rendered-step/source-step count mismatch`);
    if (question.explanation.shortcut) {
      if (!trace.shortcut) throw new Error(`${prefix}: rendered shortcut lacks trace authority`);
      if (question.explanation.shortcut.sourceStepIds.join("|") !== trace.shortcut.sourceStepIds.join("|")) throw new Error(`${prefix}: shortcut lineage drift`);
      assertSourceIds(question.explanation.shortcut.sourceStepIds, coreIds, prefix, "shortcut");
      const mainSteps = new Set(question.explanation.steps.map(normalizedText));
      if (question.explanation.shortcut.steps.every((step) => mainSteps.has(normalizedText(step)))) {
        throw new Error(`${prefix}: shortcut only repeats the main calculation`);
      }
      editorialTraceChecks += question.explanation.shortcut.steps.length;
    } else if (trace.shortcut) throw new Error(`${prefix}: trace shortcut was not rendered`);
    if (question.explanation.verification) {
      if (verificationIds.size === 0) throw new Error(`${prefix}: rendered verification lacks trace authority`);
      assertSourceIds(question.explanation.verification.sourceStepIds, verificationIds, prefix, "verification");
    } else if (verificationIds.size > 0) throw new Error(`${prefix}: trace verification was not rendered`);

    const learnerText = [
      question.explanation.keyIdea,
      ...question.explanation.steps,
      ...question.explanation.depths.exam.steps,
      ...question.explanation.depths.student.steps,
      ...question.explanation.depths.foundation.steps,
      ...(question.explanation.shortcut?.steps ?? []),
      ...(question.explanation.verification?.steps ?? []),
    ].join("\n");
    if (/\$1\$ (?:completed )?years\b/gu.test(learnerText)) throw new Error(`${prefix}: singular-year grammar regression`);
    if (/\b1 years\b/iu.test(learnerText)) throw new Error(`${prefix}: plain singular-year grammar regression`);
    editorialTraceChecks += 2;
    explanationLineageChecks += 10;
  }
}

if (methodCounts.size !== INT_CP003_QL_IDS.length) throw new Error(`method coverage ${methodCounts.size}/${INT_CP003_QL_IDS.length}`);
const requiredOperations: readonly Cp003SolutionOperationId[] = [
  "ANNUAL_FACTOR", "POWER", "MULTIPLY", "SUBTRACT", "DIVIDE", "RATE_FROM_FACTOR", "MATCH_POWER",
  "YEAR_BALANCE", "YEAR_INTEREST", "RATE_PERCENT_OF_AMOUNT", "RATE_FROM_INCREASE", "VERIFY_NTH_YEAR_RATE",
];
for (const operationId of requiredOperations) {
  if (!operationCounts.has(operationId)) throw new Error(`missing solution-trace operation ${operationId}`);
}
if (totalCoreSteps < questionCount * 2) throw new Error("semantic core traces are underdeveloped");
if (totalFoundationSteps < questionCount * 2) throw new Error("semantic foundation traces are underdeveloped");

const summary = {
  status: "SEMANTIC_SOLUTION_TRACE_REVIEW_CANDIDATE",
  traceVersion: INT_CP003_SOLUTION_TRACE_VERSION,
  generatorVersion: INT_CP003_EXAM_GENERATOR_VERSION,
  questionCount,
  traceValidationChecks,
  relationVerificationChecks,
  explanationLineageChecks,
  sourceStepChecks,
  languageNeutralityChecks,
  frozenTraceChecks,
  editorialTraceChecks,
  totalCoreSteps,
  totalFoundationSteps,
  totalVerificationSteps,
  methodCounts: Object.fromEntries(methodCounts),
  operationCounts: Object.fromEntries(operationCounts),
  lifecycle: {
    enabled: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_SEMANTIC_SOLUTION_TRACE");
