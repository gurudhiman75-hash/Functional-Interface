import type {
  EEV2DetailMode,
  StructuredExplanationBlock,
} from "../../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../../common/eev2/compatibility-projector";
import {
  routeExplanationExecution,
  type ExplanationEngineExecutors,
} from "../../../../../../../../common/eev2/routing";
import {
  createTaskKindActivationPolicy,
  executeControlledActivation,
  transitionTaskKindActivation,
} from "../../../../../../../../common/eev2/activation-policy";
import type {
  ActivationQualification,
  TaskKindActivationPolicy,
} from "../../../../../../../../common/eev2/activation-metadata";
import { applyTaskKindRollback } from "../../../../../../../../common/eev2/rollback-policy";
import {
  formatExplanationSteps,
  validateExplanationPipeline,
  type ExplanationEvidence,
} from "../../../../../../../../common/explanation-engine";
import { TaskKindTeacherRenderer } from "../../../../../../../../common/teacher-renderer";
import { solvePct001 } from "../../../solver";
import type {
  Pct001Language,
  Pct001Parameters,
  Pct001SolverResult,
} from "../../../types";
import {
  PERCENT_OF_KNOWN_NUMBER_BLOCK_SCHEMA_VERSION,
  renderPercentOfKnownNumberBlocks,
} from "../block-renderer";
import { validatePercentOfKnownNumberBlocks } from "../block-validator";
import { validatePercentOfKnownNumberCompatibility } from "../compatibility-validator";
import { validatePercentOfKnownNumberEducation } from "../educational-validator";
import { buildPercentOfKnownNumberGraph } from "../graph-builder";
import { validatePercentOfKnownNumberGraph } from "../graph-validator";
import {
  PERCENT_OF_KNOWN_NUMBER_HINDI_FAMILY_VERSION,
  renderPercentOfKnownNumberHindi,
} from "../hindi-language-family";
import {
  checkPercentOfKnownNumberLanguageParity,
} from "../language-parity";
import {
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION,
} from "../english-language-family";
import {
  renderPercentOfKnownNumberEnglish,
  type RenderedEnglishRoleSet,
} from "../language-renderer";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "../planner";
import { validatePercentOfKnownNumberPlan } from "../plan-validator";
import {
  PERCENT_OF_KNOWN_NUMBER_PUNJABI_FAMILY_VERSION,
  renderPercentOfKnownNumberPunjabi,
} from "../punjabi-language-family";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "../trace-builder";
import { validatePercentOfKnownNumberTrace } from "../trace-validator";
import type {
  EEV2FailureSeverity,
  EEV2ValidationFailure,
  EEV2ValidationResult,
} from "../validation-types";

export const QUAL_001_INSTANCE_COUNT = 1_000 as const;
export const QUAL_001_SEED = 0x51a7e001 as const;
export const QUAL_001_TIMESTAMP = "2026-06-19T20:00:00.000Z" as const;

export type QualificationSuite =
  | "MATHEMATICAL_PARITY"
  | "DETERMINISM"
  | "VALIDATOR_SWEEP"
  | "SHADOW_STABILITY"
  | "LOCALE_STABILITY"
  | "ACTIVATION_STABILITY";

export interface QualificationFailure {
  suite: QualificationSuite;
  instanceId: string;
  code: string;
  severity: EEV2FailureSeverity;
  message: string;
}

export interface QualificationStatus {
  passed: boolean;
  checkedInstances: number;
}

export interface QualificationReport {
  reportId: "QUAL-001:PHASE-A";
  target: "PCT-001/percentOfKnownNumber";
  methodFamily: "UNIT_VALUE";
  totalInstances: number;
  passedInstances: number;
  failedInstances: number;
  mathematicalParityStatus: QualificationStatus;
  determinismStatus: QualificationStatus;
  validatorStatus: QualificationStatus;
  shadowStatus: QualificationStatus;
  localeParityStatus: QualificationStatus;
  activationStatus: QualificationStatus;
  failureClassificationSummary: {
    critical: number;
    major: number;
    minor: number;
  };
  failures: readonly QualificationFailure[];
}

export class QualificationFailureError extends Error {
  readonly failure: QualificationFailure;

  constructor(failure: QualificationFailure) {
    super(
      `${failure.suite}:${failure.instanceId}:${failure.code}: ${failure.message}`,
    );
    this.name = "QualificationFailureError";
    this.failure = failure;
  }
}

interface QualificationCase {
  instanceId: string;
  questionLanguageId:
    | "PCT-QL-017"
    | "PCT-QL-117"
    | "PCT-QL-217"
    | "PCT-QL-317"
    | "PCT-QL-417";
  knownRate: number;
  knownValue: number;
  targetRate: number;
  unitValue: number;
  targetValue: number;
  context: "abstract" | "count" | "currency";
}

type RenderedRoleSet =
  | ReturnType<typeof renderPercentOfKnownNumberEnglish>
  | ReturnType<typeof renderPercentOfKnownNumberHindi>
  | ReturnType<typeof renderPercentOfKnownNumberPunjabi>;

interface QualifiedArtifacts {
  parameters: Pct001Parameters;
  solver: Pct001SolverResult;
  trace: ReturnType<typeof buildPercentOfKnownNumberTrace>;
  graph: ReturnType<typeof buildPercentOfKnownNumberGraph>;
  plan: ReturnType<typeof planPercentOfKnownNumberExplanation>;
  rendered: RenderedRoleSet;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
  validations: readonly EEV2ValidationResult[];
}

interface QualificationEngineInput {
  parameters: Pct001Parameters;
  detailMode: EEV2DetailMode;
  locale: Pct001Language;
}

interface V1QualificationOutput {
  answer: number;
  lines: readonly string[];
}

interface V2QualificationOutput {
  answer: number;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
}

const DETAIL_MODES: readonly EEV2DetailMode[] = [
  "short",
  "standard",
  "detailed",
];
const LOCALES: readonly Pct001Language[] = ["en", "hi", "pa"];
const RATES = [5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 80] as const;
const QUESTION_LANGUAGE_IDS = [
  "PCT-QL-017",
  "PCT-QL-117",
  "PCT-QL-217",
  "PCT-QL-317",
  "PCT-QL-417",
] as const;

function fail(
  suite: QualificationSuite,
  instanceId: string,
  code: string,
  severity: EEV2FailureSeverity,
  message: string,
): never {
  throw new QualificationFailureError({
    suite,
    instanceId,
    code,
    severity,
    message,
  });
}

function assertQualification(
  condition: unknown,
  suite: QualificationSuite,
  instanceId: string,
  code: string,
  severity: EEV2FailureSeverity,
  message: string,
): asserts condition {
  if (!condition) fail(suite, instanceId, code, severity, message);
}

function seededCases(): readonly QualificationCase[] {
  let state = QUAL_001_SEED >>> 0;
  const next = (): number => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state;
  };
  const cases: QualificationCase[] = [];
  for (let index = 0; index < QUAL_001_INSTANCE_COUNT; index += 1) {
    const knownRate = RATES[next() % RATES.length]!;
    const targetRate = RATES[next() % RATES.length]!;
    const unitValue = 1 + (next() % 5_000);
    const context = (["abstract", "count", "currency"] as const)[index % 3]!;
    cases.push({
      instanceId: `QUAL-001:${String(index + 1).padStart(4, "0")}`,
      questionLanguageId:
        QUESTION_LANGUAGE_IDS[index % QUESTION_LANGUAGE_IDS.length]!,
      knownRate,
      knownValue: knownRate * unitValue,
      targetRate,
      unitValue,
      targetValue: targetRate * unitValue,
      context,
    });
  }
  return cases;
}

export const QUAL_001_CASES = seededCases();

function parametersFor(
  testCase: QualificationCase,
  language: Pct001Language = "en",
): Pct001Parameters {
  const entity =
    testCase.context === "abstract"
      ? undefined
      : testCase.context === "count"
        ? {
            id: "students",
            en: "students",
            hi: "विद्यार्थी",
            pa: "ਵਿਦਿਆਰਥੀ",
            numberType: "countable",
          }
        : {
            id: "rupees",
            en: "rupees",
            hi: "रुपये",
            pa: "ਰੁਪਏ",
            numberType: "uncountable",
          };
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: testCase.instanceId,
    questionLanguageId: testCase.questionLanguageId,
    explanationId: "PCT-ES-002",
    language,
    difficultyBand: "Easy",
    taskKind: "percentOfKnownNumber",
    answerType: testCase.context === "count" ? "COUNT" : "ABSOLUTE",
    requiredVariables: ["rate1", "value1", "rate2"],
    variables: {
      rate1: testCase.knownRate,
      value1: testCase.knownValue,
      rate2: testCase.targetRate,
    },
    semanticContext: entity
      ? {
          scenario: "qual-001",
          entities: { quantity: entity },
        }
      : undefined,
    sourceTrace: {
      questionLanguageSource: "QUAL-001",
      explanationSource: "QUAL-001",
      variableRangeSource: "QUAL-001",
      semanticSource: entity ? "QUAL-001" : undefined,
    },
  };
}

function numericAnswerFromFormatted(answer: string): number {
  return Number(answer.replace(/\$\$|\\%/g, "").trim());
}

function renderLocale(
  locale: Pct001Language,
  plan: ReturnType<typeof planPercentOfKnownNumberExplanation>,
  trace: ReturnType<typeof buildPercentOfKnownNumberTrace>,
): RenderedRoleSet {
  if (locale === "hi") return renderPercentOfKnownNumberHindi(plan, trace);
  if (locale === "pa") return renderPercentOfKnownNumberPunjabi(plan, trace);
  return renderPercentOfKnownNumberEnglish(plan, trace);
}

function languageVersion(rendered: RenderedRoleSet): string {
  if (rendered.locale === "hi") {
    return PERCENT_OF_KNOWN_NUMBER_HINDI_FAMILY_VERSION;
  }
  if (rendered.locale === "pa") {
    return PERCENT_OF_KNOWN_NUMBER_PUNJABI_FAMILY_VERSION;
  }
  return PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION;
}

function buildArtifacts(
  parameters: Pct001Parameters,
  detailMode: EEV2DetailMode,
  locale: Pct001Language,
): QualifiedArtifacts {
  const localizedParameters = {
    ...parameters,
    language: locale,
  };
  const solver = solvePct001(localizedParameters);
  const evidence = solver.educationalEvidence;
  if (!evidence) throw new Error(`${parameters.questionId}: missing evidence`);
  const trace = buildPercentOfKnownNumberTrace(evidence);
  const graph = buildPercentOfKnownNumberGraph(trace);
  const plan = planPercentOfKnownNumberExplanation(graph, detailMode);
  const rendered = renderLocale(locale, plan, trace);

  // The frozen block renderer is runtime language-neutral but its ENG-007
  // parameter type is still named for English. Qualification adapts that
  // existing boundary without modifying production blocks.
  const blocks = renderPercentOfKnownNumberBlocks(
    plan,
    rendered as unknown as RenderedEnglishRoleSet,
    graph,
    {
      solverVersion: "PCT-001-solver-v1",
      traceVersion: PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
      graphVersion: graph.graphVersion,
      plannerVersion: PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
      languageFamilyVersion: languageVersion(rendered),
    },
  );
  const lines = projectCompatibilityLines(blocks);
  const validations = [
    validatePercentOfKnownNumberTrace(trace),
    validatePercentOfKnownNumberGraph(graph, trace),
    validatePercentOfKnownNumberPlan(plan, graph),
    validatePercentOfKnownNumberBlocks(blocks, plan, graph, trace),
    validatePercentOfKnownNumberEducation(blocks, plan),
    validatePercentOfKnownNumberCompatibility(blocks, lines),
  ];
  return {
    parameters: localizedParameters,
    solver,
    trace,
    graph,
    plan,
    rendered,
    blocks,
    lines,
    validations,
  };
}

function v1Output(
  parameters: Pct001Parameters,
  solver: Pct001SolverResult,
): V1QualificationOutput {
  const evidence: ExplanationEvidence = {
    variables: parameters.variables,
    derivedValues: solver.evidence,
    entities: {},
    answer: solver.answer,
  };
  const renderer = new TaskKindTeacherRenderer(
    parameters.taskKind,
    solver.mathJax,
  );
  const steps = validateExplanationPipeline(evidence, renderer);
  return {
    answer: numericAnswerFromFormatted(solver.answer),
    lines: formatExplanationSteps(steps),
  };
}

function qualificationExecutors(): ExplanationEngineExecutors<
  QualificationEngineInput,
  V1QualificationOutput,
  V2QualificationOutput
> {
  return {
    executeV1(input) {
      const solver = solvePct001(input.parameters);
      const output = v1Output(input.parameters, solver);
      return {
        engine: "v1",
        authoritativeRepresentation: "lines",
        output,
        answer: String(output.answer),
        explanationLines: output.lines,
        deterministicIdentity: `${input.parameters.questionId}:v1`,
        engineVersion: "teacher-renderer-v1",
        locale: input.locale,
        detailMode: input.detailMode,
        validation: {
          status: "passed",
          failureCodes: [],
        },
      };
    },
    executeV2(input) {
      const artifacts = buildArtifacts(
        input.parameters,
        input.detailMode,
        input.locale,
      );
      const failures = artifacts.validations.flatMap(
        (validation) => validation.failures,
      );
      const answer =
        artifacts.solver.educationalEvidence!.derivedValues.targetQuantity;
      const output: V2QualificationOutput = {
        answer,
        blocks: artifacts.blocks,
        lines: artifacts.lines,
      };
      return {
        engine: "v2",
        authoritativeRepresentation: "blocks",
        output,
        answer: String(answer),
        explanationLines: output.lines,
        blocks: output.blocks,
        deterministicIdentity: `${input.parameters.questionId}:v2:${input.locale}:${input.detailMode}`,
        engineVersion: "eev2-v1",
        locale: input.locale,
        detailMode: input.detailMode,
        validation: {
          status: failures.length === 0 ? "passed" : "failed",
          failureCodes: failures.map((failure) => failure.code),
        },
      };
    },
  };
}

function assertNoValidationFailures(
  suite: QualificationSuite,
  instanceId: string,
  results: readonly EEV2ValidationResult[],
): void {
  const failure = results.flatMap((result) => result.failures)[0];
  if (failure) {
    fail(
      suite,
      instanceId,
      failure.code,
      failure.severity,
      failure.message,
    );
  }
}

export function runMathematicalParityQualification(): QualificationStatus {
  for (const testCase of QUAL_001_CASES) {
    const parameters = parametersFor(testCase);
    const solver = solvePct001(parameters);
    const evidence = solver.educationalEvidence;
    assertQualification(
      evidence,
      "MATHEMATICAL_PARITY",
      testCase.instanceId,
      "MISSING_EDUCATIONAL_EVIDENCE",
      "CRITICAL",
      "Solver did not expose UNIT_VALUE evidence.",
    );
    const solverAnswer = solver.numericAnswer;
    const v1Answer = numericAnswerFromFormatted(solver.answer);
    const v2Answer = evidence.derivedValues.targetQuantity;
    assertQualification(
      solverAnswer === testCase.targetValue &&
        v1Answer === solverAnswer &&
        v2Answer === solverAnswer,
      "MATHEMATICAL_PARITY",
      testCase.instanceId,
      "WRONG_ANSWER",
      "CRITICAL",
      `Answer mismatch: solver=${solverAnswer}, V1=${v1Answer}, V2=${v2Answer}.`,
    );
    assertQualification(
      evidence.derivedValues.singleUnitValue *
        evidence.sourceValues.knownUnitCount ===
        evidence.sourceValues.knownQuantity,
      "MATHEMATICAL_PARITY",
      testCase.instanceId,
      "KNOWN_RELATION_MISMATCH",
      "CRITICAL",
      "Single-unit value does not reconstruct the known quantity.",
    );
    assertQualification(
      evidence.derivedValues.singleUnitValue *
        evidence.sourceValues.targetUnitCount ===
        evidence.derivedValues.targetQuantity,
      "MATHEMATICAL_PARITY",
      testCase.instanceId,
      "TARGET_RELATION_MISMATCH",
      "CRITICAL",
      "Single-unit value does not reconstruct the target quantity.",
    );
  }
  return { passed: true, checkedInstances: QUAL_001_CASES.length };
}

export function runDeterminismQualification(): QualificationStatus {
  for (const testCase of QUAL_001_CASES) {
    const parameters = parametersFor(testCase);
    for (const detailMode of DETAIL_MODES) {
      const first = buildArtifacts(parameters, detailMode, "en");
      const second = buildArtifacts(parameters, detailMode, "en");
      const firstComparable = {
        trace: first.trace,
        graph: first.graph,
        plan: first.plan,
        rendered: first.rendered,
        blocks: first.blocks,
        lines: first.lines,
        validations: first.validations,
      };
      const secondComparable = {
        trace: second.trace,
        graph: second.graph,
        plan: second.plan,
        rendered: second.rendered,
        blocks: second.blocks,
        lines: second.lines,
        validations: second.validations,
      };
      assertQualification(
        JSON.stringify(firstComparable) === JSON.stringify(secondComparable),
        "DETERMINISM",
        testCase.instanceId,
        "NONDETERMINISM",
        "CRITICAL",
        `${detailMode} execution produced different artifacts.`,
      );
    }
  }
  return { passed: true, checkedInstances: QUAL_001_CASES.length };
}

export function runValidatorSweepQualification(): QualificationStatus {
  for (const testCase of QUAL_001_CASES) {
    const parameters = parametersFor(testCase);
    for (const detailMode of DETAIL_MODES) {
      const before = JSON.stringify(parameters);
      const artifacts = buildArtifacts(parameters, detailMode, "en");
      assertNoValidationFailures(
        "VALIDATOR_SWEEP",
        testCase.instanceId,
        artifacts.validations,
      );
      assertQualification(
        JSON.stringify(parameters) === before,
        "VALIDATOR_SWEEP",
        testCase.instanceId,
        "HIDDEN_REPAIR",
        "CRITICAL",
        "Validation or construction mutated the source instance.",
      );
    }
  }
  return { passed: true, checkedInstances: QUAL_001_CASES.length };
}

export async function runShadowStabilityQualification():
  Promise<QualificationStatus> {
  const executors = qualificationExecutors();
  for (const testCase of QUAL_001_CASES) {
    const parameters = parametersFor(testCase);
    const input: QualificationEngineInput = {
      parameters,
      detailMode: "standard",
      locale: "en",
    };
    const before = JSON.stringify(input);
    const first = await routeExplanationExecution(
      {
        mode: "shadow",
        input,
        comparisonTimestamp: QUAL_001_TIMESTAMP,
      },
      executors,
    );
    const second = await routeExplanationExecution(
      {
        mode: "shadow",
        input,
        comparisonTimestamp: QUAL_001_TIMESTAMP,
      },
      executors,
    );
    assertQualification(
      first.mode === "shadow" &&
        first.publicEngine === "v1" &&
        first.shadow.v2Output !== null,
      "SHADOW_STABILITY",
      testCase.instanceId,
      "SHADOW_FALLBACK",
      "CRITICAL",
      "Shadow execution did not preserve independent V1/V2 outputs.",
    );
    assertQualification(
      first.publicOutput.lines !== first.shadow.v2Output!.lines &&
        !("blocks" in first.publicOutput) &&
        first.shadow.v2Output!.blocks.length > 0,
      "SHADOW_STABILITY",
      testCase.instanceId,
      "OUTPUT_MIXING",
      "CRITICAL",
      "Shadow execution mixed V1 and V2 representations.",
    );
    assertQualification(
      first.shadow.comparison.mathematicalParity === true &&
        first.shadow.comparison.failureStatus.v2 === "none" &&
        first.shadow.comparison.validationStatus.v2?.status === "passed",
      "SHADOW_STABILITY",
      testCase.instanceId,
      "COMPARISON_CORRUPTION",
      "CRITICAL",
      "Shadow comparison metadata is incomplete or incorrect.",
    );
    assertQualification(
      JSON.stringify(first) === JSON.stringify(second),
      "SHADOW_STABILITY",
      testCase.instanceId,
      "NONDETERMINISM",
      "CRITICAL",
      "Repeated shadow executions differ.",
    );
    assertQualification(
      JSON.stringify(input) === before,
      "SHADOW_STABILITY",
      testCase.instanceId,
      "SHARED_STATE_MUTATION",
      "CRITICAL",
      "Shadow execution mutated its source input.",
    );
  }
  return { passed: true, checkedInstances: QUAL_001_CASES.length };
}

export function runLocaleStabilityQualification(): QualificationStatus {
  for (const testCase of QUAL_001_CASES) {
    const parameters = parametersFor(testCase);
    for (const detailMode of DETAIL_MODES) {
      const english = buildArtifacts(parameters, detailMode, "en");
      const hindi = buildArtifacts(parameters, detailMode, "hi");
      const punjabi = buildArtifacts(parameters, detailMode, "pa");
      for (const artifacts of [english, hindi, punjabi]) {
        assertNoValidationFailures(
          "LOCALE_STABILITY",
          testCase.instanceId,
          artifacts.validations,
        );
      }
      const answers = [english, hindi, punjabi].map(
        (artifacts) =>
          artifacts.solver.educationalEvidence!.derivedValues.targetQuantity,
      );
      assertQualification(
        new Set(answers).size === 1,
        "LOCALE_STABILITY",
        testCase.instanceId,
        "PARITY_BREAK",
        "CRITICAL",
        "Locales produced different answers.",
      );
      const blockRoles = [english, hindi, punjabi].map((artifacts) =>
        artifacts.blocks.map((block) => ({
          semanticRole: block.semanticRole,
          visibility: block.visibility,
          parentId: block.parentId,
        })),
      );
      assertQualification(
        JSON.stringify(blockRoles[0]) === JSON.stringify(blockRoles[1]) &&
          JSON.stringify(blockRoles[0]) === JSON.stringify(blockRoles[2]),
        "LOCALE_STABILITY",
        testCase.instanceId,
        "BLOCK_CORRUPTION",
        "CRITICAL",
        "Locale block hierarchy, roles, or visibility diverged.",
      );
      const parity = checkPercentOfKnownNumberLanguageParity(
        english.rendered,
        hindi.rendered,
        punjabi.rendered,
      );
      assertQualification(
        parity.passed,
        "LOCALE_STABILITY",
        testCase.instanceId,
        "PARITY_BREAK",
        "CRITICAL",
        parity.failures.join("; "),
      );
    }
  }
  return { passed: true, checkedInstances: QUAL_001_CASES.length };
}

const COMPLETE_QUALIFICATION: ActivationQualification = {
  mathematicalParity: true,
  validatorSuccess: true,
  shadowStability: true,
  deterministicExecution: true,
  localeParity: {
    en: true,
    hi: true,
    pa: true,
  },
  noCriticalFailures: true,
  blindReviewApproval: true,
  noEducationalRegressions: true,
};

function activationPolicy(
  taskKind = "percentOfKnownNumber",
): TaskKindActivationPolicy {
  return createTaskKindActivationPolicy({
    policyId: `QUAL-001:${taskKind}:activation`,
    packageId: "PCT-001",
    taskKind,
    methodFamily: "UNIT_VALUE",
    activatedLocales: LOCALES,
    versions: {
      engineVersion: "eev2-v1",
      blockSchemaVersion: PERCENT_OF_KNOWN_NUMBER_BLOCK_SCHEMA_VERSION,
      validatorVersion: "1.0.0",
    },
    qualification: COMPLETE_QUALIFICATION,
    audit: {
      qualificationId: "QUAL-001:PHASE-A",
    },
  });
}

function promote(
  policy: TaskKindActivationPolicy,
  nextState: "SHADOW" | "LIMITED" | "ACTIVE",
): TaskKindActivationPolicy {
  const timestamp = {
    SHADOW: "2026-06-19T20:01:00.000Z",
    LIMITED: "2026-06-19T20:02:00.000Z",
    ACTIVE: "2026-06-19T20:03:00.000Z",
  }[nextState];
  return transitionTaskKindActivation(policy, {
    nextState,
    transitionTimestamp: timestamp,
    qualification: COMPLETE_QUALIFICATION,
  });
}

export async function runActivationStabilityQualification():
  Promise<QualificationStatus> {
  const testCase = QUAL_001_CASES[0]!;
  const parameters = parametersFor(testCase);
  const input: QualificationEngineInput = {
    parameters,
    detailMode: "standard",
    locale: "en",
  };
  const executors = qualificationExecutors();
  const disabled = activationPolicy();
  const shadow = promote(disabled, "SHADOW");
  const limited = promote(shadow, "LIMITED");
  const active = promote(limited, "ACTIVE");
  const states = [
    [disabled, "v1"],
    [shadow, "shadow"],
    [limited, "v2"],
    [active, "v2"],
  ] as const;
  for (const [policy, expectedMode] of states) {
    const first = await executeControlledActivation(
      policy,
      {
        taskKind: "percentOfKnownNumber",
        locale: "en",
        detailMode: "standard",
        input,
        comparisonTimestamp: QUAL_001_TIMESTAMP,
      },
      executors,
    );
    const second = await executeControlledActivation(
      policy,
      {
        taskKind: "percentOfKnownNumber",
        locale: "en",
        detailMode: "standard",
        input,
        comparisonTimestamp: QUAL_001_TIMESTAMP,
      },
      executors,
    );
    assertQualification(
      first.routing.mode === expectedMode &&
        JSON.stringify(first) === JSON.stringify(second),
      "ACTIVATION_STABILITY",
      testCase.instanceId,
      "ACTIVATION_BEHAVIOR",
      "CRITICAL",
      `${policy.state} routing is incorrect or nondeterministic.`,
    );
  }

  const unrelated = promote(activationPolicy("reversePercent"), "SHADOW");
  const rollback = applyTaskKindRollback(
    [active, unrelated],
    {
      taskKind: "percentOfKnownNumber",
      methodFamily: "UNIT_VALUE",
      code: "MISSING_ONE_UNIT_DERIVATION",
      message: "Qualification rollback isolation check.",
      timestamp: "2026-06-19T20:04:00.000Z",
      audit: {
        qualificationId: "QUAL-001:PHASE-A",
      },
    },
  );
  assertQualification(
    rollback.policies[0]!.state === "DISABLED" &&
      JSON.stringify(rollback.policies[1]) === JSON.stringify(unrelated),
    "ACTIVATION_STABILITY",
    testCase.instanceId,
    "ROLLBACK_ISOLATION",
    "CRITICAL",
    "Task-kind rollback affected an unrelated activation policy.",
  );
  return { passed: true, checkedInstances: 1 };
}

function failedStatus(): QualificationStatus {
  return { passed: false, checkedInstances: 0 };
}

export async function produceTechnicalQualificationReport():
  Promise<QualificationReport> {
  const failures: QualificationFailure[] = [];
  let mathematicalParityStatus = failedStatus();
  let determinismStatus = failedStatus();
  let validatorStatus = failedStatus();
  let shadowStatus = failedStatus();
  let localeParityStatus = failedStatus();
  let activationStatus = failedStatus();

  const capture = async (
    run: () => QualificationStatus | Promise<QualificationStatus>,
    assign: (status: QualificationStatus) => void,
  ): Promise<void> => {
    try {
      assign(await run());
    } catch (error) {
      if (error instanceof QualificationFailureError) {
        failures.push(error.failure);
        return;
      }
      throw error;
    }
  };

  await capture(runMathematicalParityQualification, (status) => {
    mathematicalParityStatus = status;
  });
  await capture(runDeterminismQualification, (status) => {
    determinismStatus = status;
  });
  await capture(runValidatorSweepQualification, (status) => {
    validatorStatus = status;
  });
  await capture(runShadowStabilityQualification, (status) => {
    shadowStatus = status;
  });
  await capture(runLocaleStabilityQualification, (status) => {
    localeParityStatus = status;
  });
  await capture(runActivationStabilityQualification, (status) => {
    activationStatus = status;
  });

  const failedInstanceIds = new Set(
    failures.map((failure) => failure.instanceId),
  );
  return {
    reportId: "QUAL-001:PHASE-A",
    target: "PCT-001/percentOfKnownNumber",
    methodFamily: "UNIT_VALUE",
    totalInstances: QUAL_001_CASES.length,
    passedInstances: QUAL_001_CASES.length - failedInstanceIds.size,
    failedInstances: failedInstanceIds.size,
    mathematicalParityStatus,
    determinismStatus,
    validatorStatus,
    shadowStatus,
    localeParityStatus,
    activationStatus,
    failureClassificationSummary: {
      critical: failures.filter((failure) => failure.severity === "CRITICAL")
        .length,
      major: failures.filter((failure) => failure.severity === "MAJOR").length,
      minor: failures.filter((failure) => failure.severity === "MINOR").length,
    },
    failures,
  };
}

export function validationFailures(
  results: readonly EEV2ValidationResult[],
): readonly EEV2ValidationFailure[] {
  return results.flatMap((result) => result.failures);
}
