import { createHash } from "node:crypto";

import {
  ARG_CP014_AUTHORITY,
  ARG_CP014_CHECKPOINT_ID,
  ARG_CP014_LEARNER_RELEASE,
  ARG_CP014_QUESTION_STUDIO_AUTHORITY,
  ARG_CP014_QUESTION_STUDIO_PACKAGE,
  generateArgCp014QuestionStudioBatch,
  isArgCp014CurrentRequest,
  type ArgCp014QuestionStudioInput,
} from "./cp014-manual-editorial-approval.ts";

export const ARG_CP015_CHECKPOINT_ID = "ARG-CP-015" as const;
export const ARG_CP015_AUTHORITY = "ARG_CP015_PERCEIVED_DIVERSITY_EXPANSION_V1" as const;
export const ARG_CP015_QUESTION_STUDIO_AUTHORITY = "ARG_CP015_QUESTION_STUDIO_DIVERSITY_V1" as const;
export const ARG_CP015_RUNTIME_MODE = "CP014_APPROVED_CONTENT_WITH_DIVERSITY_SCHEDULING" as const;
export const ARG_CP015_REVIEW_STATUS = "QUESTION_STUDIO_CP015_DIVERSITY_EXPANSION_REVIEW" as const;
export const ARG_CP015_LEARNER_RELEASE = ARG_CP014_LEARNER_RELEASE;

export type ArgCp015QuestionStudioInput = ArgCp014QuestionStudioInput;
type Question = Readonly<Record<string, any>>;

const TWO_ARGUMENT_PROFILES = new Set(["SSC_RECENT_2X4", "BANKING_CLASSIC_2X5"]);

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function countOf(value: unknown): number {
  const parsed = Math.floor(Number(value ?? 1));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 50) : 1;
}

function words(value: unknown): number {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean).length;
}

function profileOf(input: ArgCp015QuestionStudioInput): string {
  return text(input.examProfile ?? input.paperProfile ?? input.deliveryProfile).toUpperCase();
}

function fullSignature(question: Question): string {
  return createHash("sha256").update(JSON.stringify([
    question.statement,
    question.arguments,
    question.options,
    question.correctIndex,
    question.explanation,
  ])).digest("hex");
}

function localizedEither(question: Question): string {
  if (question.locale === "hi-IN" || question.language === "hi") return "या तो तर्क I या II मजबूत है";
  if (question.locale === "pa-IN" || question.language === "pa") return "ਜਾਂ ਦਲੀਲ I ਜਾਂ II ਮਜ਼ਬੂਤ ਹੈ";
  return "Either argument I or II is strong";
}

function clearExplicitProfile(input: ArgCp015QuestionStudioInput): ArgCp014QuestionStudioInput {
  return {
    ...input,
    cpId: undefined,
    examProfile: undefined,
    paperProfile: undefined,
    deliveryProfile: undefined,
    profileMode: "core",
  };
}

function sourceInput(input: ArgCp015QuestionStudioInput): ArgCp014QuestionStudioInput {
  return text(input.cpId).toUpperCase() === ARG_CP015_CHECKPOINT_ID
    ? { ...input, cpId: undefined }
    : input;
}

function reshapeTwoArgumentProfile(source: Question, profile: string): Question {
  const sourceOptions = [...(source.options as readonly string[])];
  if (sourceOptions.length !== 4 || source.arguments?.length !== 2) {
    throw new Error("ARG-001 CP015 two-argument diversity source must be a two-argument four-option core question.");
  }

  let options: readonly string[];
  let correctIndex: number;
  if (profile === "BANKING_CLASSIC_2X5") {
    options = Object.freeze([sourceOptions[0]!, sourceOptions[1]!, localizedEither(source), sourceOptions[3]!, sourceOptions[2]!]);
    const map = [0, 1, 4, 3] as const;
    correctIndex = map[source.correctIndex as 0 | 1 | 2 | 3];
  } else {
    options = Object.freeze(sourceOptions);
    correctIndex = Number(source.correctIndex);
  }

  const answer = options[correctIndex]!;
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_AUTHORITY,
    profile,
    source.statement,
    source.arguments,
    options,
    correctIndex,
    source.explanation,
  ])).digest("hex");

  return Object.freeze({
    ...source,
    checkpointId: ARG_CP015_CHECKPOINT_ID,
    sourceCheckpointId: ARG_CP014_CHECKPOINT_ID,
    sourceApprovalAuthority: ARG_CP014_AUTHORITY,
    currentQuestionStudioAuthority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
    supersedesQuestionStudioAuthority: ARG_CP014_QUESTION_STUDIO_AUTHORITY,
    runtimeMode: ARG_CP015_RUNTIME_MODE,
    reviewStatus: ARG_CP015_REVIEW_STATUS,
    profileMode: "real-paper" as const,
    examProfile: profile,
    diversitySourceMode: "APPROVED_CORE_SURFACE_RESHAPED_FOR_TWO_ARGUMENT_PROFILE" as const,
    options,
    correct: correctIndex,
    correctIndex,
    answer,
    canonicalAnswer: answer,
    scenarioId: `${source.scenarioId}-CP015-${profile}`,
    canonicalItemId: `${source.canonicalItemId}:CP015:${profile}`,
    questionId: `ARG-001:${source.qlId}:${profile}:CP015:${contentFingerprint.slice(0, 20)}`,
    contentFingerprint,
    manualApprovalRequired: false as const,
    persistenceAllowed: true as const,
    questionBankStatus: "WRITABLE" as const,
    questionBankWritable: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    mockTestEligible: true as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    studentDeliveryAuthorized: false as const,
    automaticStudentPublication: false as const,
    learnerRelease: ARG_CP015_LEARNER_RELEASE,
  });
}

function promoteUnchanged(source: Question): Question {
  return Object.freeze({
    ...source,
    checkpointId: ARG_CP015_CHECKPOINT_ID,
    sourceCheckpointId: source.checkpointId,
    sourceApprovalAuthority: ARG_CP014_AUTHORITY,
    currentQuestionStudioAuthority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
    supersedesQuestionStudioAuthority: ARG_CP014_QUESTION_STUDIO_AUTHORITY,
    runtimeMode: ARG_CP015_RUNTIME_MODE,
    reviewStatus: ARG_CP015_REVIEW_STATUS,
    diversitySourceMode: "CP014_APPROVED_SURFACE_UNCHANGED_WITH_NO_REPEAT_BATCH_SCHEDULER" as const,
    manualApprovalRequired: false as const,
    persistenceAllowed: true as const,
    questionBankStatus: "WRITABLE" as const,
    questionBankWritable: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    mockTestEligible: true as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    studentDeliveryAuthorized: false as const,
    automaticStudentPublication: false as const,
    learnerRelease: ARG_CP015_LEARNER_RELEASE,
  });
}

function profileSurfaceAccepted(question: Question, profile: string): boolean {
  if (profile !== "SSC_RECENT_2X4") return true;
  if (words(question.statement) > 24) return false;
  const args = Array.isArray(question.arguments) ? question.arguments : [];
  return args.length === 2 && args.every((argument) => words(argument) <= 34);
}

function oneCandidate(input: ArgCp015QuestionStudioInput, profile: string, seed: string): { question: Question; context: Question } {
  if (TWO_ARGUMENT_PROFILES.has(profile)) {
    const request = clearExplicitProfile({ ...input, count: 1, seed });
    const source = generateArgCp014QuestionStudioBatch(request);
    const question = reshapeTwoArgumentProfile(source.questions[0] as Question, profile);
    return { question, context: source.generationContext as Question };
  }
  const request = sourceInput({ ...input, count: 1, seed });
  const source = generateArgCp014QuestionStudioBatch(request);
  return { question: promoteUnchanged(source.questions[0] as Question), context: source.generationContext as Question };
}

export function isArgCp015CurrentRequest(input: Readonly<Record<string, unknown>>): boolean {
  return text(input.cpId).toUpperCase() === ARG_CP015_CHECKPOINT_ID || isArgCp014CurrentRequest(input);
}

export function isArgCp015RealPaperRequest(input: ArgCp015QuestionStudioInput): boolean {
  return Boolean(profileOf(input)) || text(input.profileMode).toLowerCase() === "real-paper";
}

export function generateArgCp015QuestionStudioBatch(input: ArgCp015QuestionStudioInput) {
  const count = countOf(input.count);
  const profile = profileOf(input);
  const baseSeed = text(input.seed) || "ARG-CP015-DEFAULT";
  const questions: Question[] = [];
  const seen = new Set<string>();
  let sourceContext: Question | undefined;

  for (let index = 0; index < count; index += 1) {
    let accepted: Question | undefined;
    for (let attempt = 0; attempt < 512; attempt += 1) {
      const candidateSeed = `${baseSeed}:CP015:${profile || "CORE"}:${index}:${attempt}`;
      const candidate = oneCandidate(input, profile, candidateSeed);
      sourceContext ??= candidate.context;
      if (!profileSurfaceAccepted(candidate.question, profile)) continue;
      const signature = fullSignature(candidate.question);
      if (!seen.has(signature)) {
        seen.add(signature);
        accepted = candidate.question;
        break;
      }
    }
    if (!accepted) throw new Error(`ARG-001 CP015 could not resolve a unique question at batch index ${index}.`);
    questions.push(accepted);
  }

  return Object.freeze({
    packageId: "ARG-001" as const,
    checkpointId: ARG_CP015_CHECKPOINT_ID,
    authority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
    questions: Object.freeze(questions),
    generationContext: Object.freeze({
      ...(sourceContext ?? {}),
      chapterId: "ARG-001" as const,
      checkpointId: ARG_CP015_CHECKPOINT_ID,
      sourceCheckpointId: ARG_CP014_CHECKPOINT_ID,
      authority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
      sourceQuestionStudioAuthority: ARG_CP014_QUESTION_STUDIO_AUTHORITY,
      approvalAuthority: ARG_CP014_AUTHORITY,
      diversityAuthority: ARG_CP015_AUTHORITY,
      runtimeMode: ARG_CP015_RUNTIME_MODE,
      reviewStatus: ARG_CP015_REVIEW_STATUS,
      profileMode: isArgCp015RealPaperRequest(input) ? "real-paper" as const : "core" as const,
      examProfile: profile || undefined,
      noRepeatWithinBatch: true as const,
      twoArgumentProfileSource: TWO_ARGUMENT_PROFILES.has(profile) ? "APPROVED_CORE_SURFACE" as const : undefined,
      reviewOnly: false as const,
      manualApprovalRequired: false as const,
      persistenceAllowed: true as const,
      questionBankStatus: "WRITABLE" as const,
      questionBankWritable: true as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      mockTestEligible: true as const,
      publiclyPublishable: false as const,
      publicReleaseAuthorized: false as const,
      studentDeliveryAuthorized: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: ARG_CP015_LEARNER_RELEASE,
    }),
  });
}

export const ARG_CP015_QUESTION_STUDIO_PACKAGE = Object.freeze({
  ...ARG_CP014_QUESTION_STUDIO_PACKAGE,
  cpIds: Object.freeze([...ARG_CP014_QUESTION_STUDIO_PACKAGE.cpIds, ARG_CP015_CHECKPOINT_ID] as const),
  currentCoreCheckpointId: ARG_CP015_CHECKPOINT_ID,
  currentRealPaperCheckpointId: ARG_CP015_CHECKPOINT_ID,
  currentReleaseCheckpointId: ARG_CP015_CHECKPOINT_ID,
  sourceApprovalCheckpointId: ARG_CP014_CHECKPOINT_ID,
  currentQuestionStudioAuthority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
  sourceQuestionStudioAuthority: ARG_CP014_QUESTION_STUDIO_AUTHORITY,
  approvalAuthority: ARG_CP014_AUTHORITY,
  diversityAuthority: ARG_CP015_AUTHORITY,
  runtimeMode: ARG_CP015_RUNTIME_MODE,
  reviewStatus: ARG_CP015_REVIEW_STATUS,
  noRepeatWithinBatch: true as const,
  twoArgumentProfilesUseApprovedCoreSurface: true as const,
  reviewOnly: false as const,
  manualApprovalRequired: false as const,
  persistenceAllowed: true as const,
  questionBankStatus: "WRITABLE" as const,
  questionBankWritable: true as const,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true as const,
  mockTestEligible: true as const,
  publiclyPublishable: false as const,
  publicReleaseAuthorized: false as const,
  studentDeliveryAuthorized: false as const,
  automaticStudentPublication: false as const,
  learnerRelease: ARG_CP015_LEARNER_RELEASE,
});