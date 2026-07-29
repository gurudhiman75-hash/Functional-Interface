import {
  INT_CP001_FINAL_QL_IDS,
  type IntCp001FinalQlId,
} from "./cp001-final-registry";
import {
  generateIntCp001FinalEditorialV3Question,
  type IntCp001FinalEditorialV3Question,
} from "./cp001-final-editorial-runtime-v3";
import {
  generateIntCp001ApprovedV2LocalizedQuestion,
  type IntCp001ApprovedV2LocalizedQuestion,
} from "./cp001-localized-runtime-v2-approved";

export type IntCp001ReleaseLanguage = "en" | "hi" | "pa";
export type IntCp001ApprovedReleaseQuestion =
  | IntCp001FinalEditorialV3Question
  | IntCp001ApprovedV2LocalizedQuestion;

export const INT_CP001_INACTIVE_RELEASE_PROVIDER = Object.freeze({
  providerId: "INT-001:INT-CP-001:APPROVED-INACTIVE-V1",
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-001",
  topic: "Arithmetic",
  subtopic: "Simple Interest",
  label: "Simple Interest Fundamentals and Direct Inverses",
  qlIds: [...INT_CP001_FINAL_QL_IDS] as readonly IntCp001FinalQlId[],
  supportedLanguages: ["en", "hi", "pa"] as const,
  releaseIds: {
    en: "INT-CP-001-EN-v3",
    hi: "INT-CP-001-HI-v2",
    pa: "INT-CP-001-PA-v2",
  } as const,
  enabled: false,
  registrationStatus: "NOT_REGISTERED",
  runtimeMode: "APPROVED_INACTIVE_RELEASE_PROOF",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
});

export interface IntCp001InactiveProviderRequest {
  qlId: IntCp001FinalQlId;
  language: IntCp001ReleaseLanguage;
  seed: string;
}

export interface IntCp001InactiveProviderEnvelope {
  provider: typeof INT_CP001_INACTIVE_RELEASE_PROVIDER;
  question: IntCp001ApprovedReleaseQuestion;
  trace: {
    providerId: typeof INT_CP001_INACTIVE_RELEASE_PROVIDER.providerId;
    packageId: "INT-001";
    canonicalProblemId: "INT-CP-001";
    qlId: IntCp001FinalQlId;
    language: IntCp001ReleaseLanguage;
    releaseId: string;
    seed: string;
    runtimeMode: "APPROVED_INACTIVE_RELEASE_PROOF";
    registrationStatus: "NOT_REGISTERED";
  };
}

function assertSeed(seed: string): string {
  const normalized = String(seed ?? "").trim();
  if (!normalized) throw new Error("INT-CP-001 inactive provider requires an explicit deterministic seed.");
  return normalized;
}

function assertQlId(qlId: string): asserts qlId is IntCp001FinalQlId {
  if (!(INT_CP001_FINAL_QL_IDS as readonly string[]).includes(qlId)) {
    throw new Error(`Unknown INT-CP-001 question-language ID '${qlId}'.`);
  }
}

function assertLanguage(language: string): asserts language is IntCp001ReleaseLanguage {
  if (!(INT_CP001_INACTIVE_RELEASE_PROVIDER.supportedLanguages as readonly string[]).includes(language)) {
    throw new Error(`Unsupported INT-CP-001 release language '${language}'.`);
  }
}

export function generateIntCp001InactiveProviderEnvelope(
  request: IntCp001InactiveProviderRequest,
): IntCp001InactiveProviderEnvelope {
  const seed = assertSeed(request.seed);
  assertQlId(request.qlId);
  assertLanguage(request.language);

  const question = request.language === "en"
    ? generateIntCp001FinalEditorialV3Question(request.qlId, seed)
    : generateIntCp001ApprovedV2LocalizedQuestion(request.qlId, seed, request.language);

  if (!question.validation.ok) {
    throw new Error(`${request.qlId}/${seed}/${request.language}: ${question.validation.errors.join(" | ")}`);
  }

  const expectedRelease = INT_CP001_INACTIVE_RELEASE_PROVIDER.releaseIds[request.language];
  if (question.releaseId !== expectedRelease) {
    throw new Error(`${request.qlId}/${seed}/${request.language} emitted ${question.releaseId}; expected ${expectedRelease}.`);
  }

  return {
    provider: INT_CP001_INACTIVE_RELEASE_PROVIDER,
    question,
    trace: {
      providerId: INT_CP001_INACTIVE_RELEASE_PROVIDER.providerId,
      packageId: "INT-001",
      canonicalProblemId: "INT-CP-001",
      qlId: request.qlId,
      language: request.language,
      releaseId: question.releaseId,
      seed,
      runtimeMode: "APPROVED_INACTIVE_RELEASE_PROOF",
      registrationStatus: "NOT_REGISTERED",
    },
  };
}

function explanationText(question: IntCp001ApprovedReleaseQuestion): string {
  const explanation = question.explanation;
  return [
    `### ${explanation.coreConcept.heading}`,
    explanation.coreConcept.narrative,
    explanation.coreConcept.displayMath,
    `### ${explanation.stepByStep.heading}`,
    ...explanation.stepByStep.steps.map((step, index) => `${index + 1}. ${step}`),
    explanation.stepByStep.verification,
    explanation.stepByStep.conclusion,
    `### ${explanation.examShortcut.heading}`,
    explanation.examShortcut.narrative,
    explanation.examShortcut.displayMath ?? "",
    `### ${explanation.trapAnalysis.heading}`,
    ...explanation.trapAnalysis.items.map((trap) =>
      `Option ${trap.optionNumber} (${trap.optionText}): ${trap.explanation}`
    ),
  ].filter(Boolean).join("\n\n");
}

export function toIntCp001InactiveQuestionStudioPreview(
  envelope: IntCp001InactiveProviderEnvelope,
  context: { questionIndex?: number; questionCount?: number } = {},
) {
  const { question, trace } = envelope;
  return {
    text: question.stem,
    stem: question.stem,
    options: [...question.options],
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    explanation: explanationText(question),
    packageExplanation: question.explanation,
    difficulty: question.difficulty,
    difficultyLabel: question.difficulty,
    patternId: question.qlId,
    packageId: "INT-001",
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Simple Interest",
    generationBackend: "quant-v4-inactive-proof",
    debugSource: "int-cp001-approved-inactive-provider",
    canonicalProblemId: "INT-CP-001",
    questionLanguageId: question.questionLanguageId,
    language: question.language,
    releaseId: question.releaseId,
    seed: question.seed,
    answer: question.options[question.correctIndex],
    runtimeMode: trace.runtimeMode,
    registrationStatus: trace.registrationStatus,
    reviewStatus: question.reviewStatus,
    questionBankStatus: question.questionBankStatus,
    testEligibility: question.testEligibility,
    publiclyPublishable: question.publiclyPublishable,
    questionStudioDiscoverable: question.questionStudioDiscoverable,
    validation: question.validation,
    reasoningGraph: question.reasoningGraph,
    semanticMetadata: {
      qlId: question.qlId,
      solveContract: question.solveContract,
      answerSemantic: question.answerSemantic,
      topology: question.topology,
      taskDirection: question.taskDirection,
      mathematicalFingerprint: question.mathematicalFingerprint,
    },
    questionIndex: context.questionIndex,
    questionCount: context.questionCount,
    metadata: {
      providerId: trace.providerId,
      packageId: trace.packageId,
      canonicalProblemId: trace.canonicalProblemId,
      qlId: trace.qlId,
      language: trace.language,
      releaseId: trace.releaseId,
      seed: trace.seed,
      runtimeMode: trace.runtimeMode,
      registrationStatus: trace.registrationStatus,
      questionBankStatus: question.questionBankStatus,
      testEligibility: question.testEligibility,
      publiclyPublishable: question.publiclyPublishable,
      questionStudioDiscoverable: question.questionStudioDiscoverable,
    },
  };
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function shuffled<T>(items: readonly T[], seed: string): T[] {
  const result = [...items];
  let state = hash(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

export function generateIntCp001InactiveReleaseBatch(request: {
  language: IntCp001ReleaseLanguage;
  seed: string;
  count?: number;
  qlId?: IntCp001FinalQlId;
}) {
  const batchSeed = assertSeed(request.seed);
  assertLanguage(request.language);
  if (request.qlId) assertQlId(request.qlId);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const qlOrder = request.qlId
    ? [request.qlId]
    : shuffled(INT_CP001_FINAL_QL_IDS, `${batchSeed}:INT-001:ql-order`);

  const envelopes = Array.from({ length: count }, (_unused, index) => {
    const qlId = qlOrder[index % qlOrder.length]!;
    return generateIntCp001InactiveProviderEnvelope({
      qlId,
      language: request.language,
      seed: `${batchSeed}:${qlId}:${index}`,
    });
  });

  return {
    generationContext: {
      providerId: INT_CP001_INACTIVE_RELEASE_PROVIDER.providerId,
      packageId: "INT-001",
      canonicalProblemId: "INT-CP-001",
      seed: batchSeed,
      language: request.language,
      runtimeMode: "APPROVED_INACTIVE_RELEASE_PROOF",
      registrationStatus: "NOT_REGISTERED",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
    questionPackages: envelopes.map((item) => item.question),
    questions: envelopes.map((item, index) =>
      toIntCp001InactiveQuestionStudioPreview(item, {
        questionIndex: index + 1,
        questionCount: count,
      })
    ),
    envelopes,
  };
}
