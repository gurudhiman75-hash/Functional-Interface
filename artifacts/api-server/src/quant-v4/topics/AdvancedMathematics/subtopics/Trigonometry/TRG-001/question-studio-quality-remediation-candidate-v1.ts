import {
  generateApprovedTrg001QuestionStudioQuestion,
  generateTrg001QuestionStudioBatch,
  type Trg001QuestionStudioLanguage,
  type Trg001QuestionStudioRequest,
} from "./question-studio-runtime";

export const TRG_001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V1 = Object.freeze({
  version: "TRG001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V1" as const,
  status: "AUDIT_CANDIDATE_NOT_ACTIVATED" as const,
  packageId: "TRG-001" as const,
  learnerExplanationPolicy: "CORE_RULE_AND_WORKED_STEPS_ONLY" as const,
  editorialMetadataPreserved: true as const,
  shortcutAndTrapDefaultLearnerRendering: false as const,
  activationAuthorized: false as const,
  publicReleaseAuthorized: false as const,
});

function learnerExplanationText(question: any) {
  const explanation = question.packageExplanation ?? {};
  const language = String(question.language ?? "en").toLowerCase();
  const labels = language === "hi"
    ? { rule: "मुख्य नियम", step: "चरण" }
    : language === "pa"
      ? { rule: "ਮੁੱਖ ਨਿਯਮ", step: "ਕਦਮ" }
      : { rule: "Core rule", step: "Step" };

  return [
    explanation.keyRule ? `${labels.rule}: ${String(explanation.keyRule)}` : "",
    ...(explanation.steps ?? []).map((step: any) =>
      `${String(step?.title ?? labels.step)}: ${String(step?.body ?? "")}`,
    ),
  ].filter(Boolean).join("\n\n");
}

function markCandidate(preview: any) {
  return Object.freeze({
    ...preview,
    explanation: learnerExplanationText(preview),
    reviewStatus: "QUALITY_REMEDIATION_CANDIDATE_V1",
    activationAuthorized: false,
    questionStudioDiscoverable: false,
    publicReleaseAuthorized: false,
    automaticStudentPublication: false,
    qualityRemediation: TRG_001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V1,
    proceduralLogic: Object.freeze({
      ...(preview.proceduralLogic ?? {}),
      reviewStatus: "QUALITY_REMEDIATION_CANDIDATE_V1",
      activationAuthorized: false,
      questionStudioEnabled: false,
      publicReleaseAuthorized: false,
      contentMutationAuthorized: false,
      learnerExplanationPolicy: "CORE_RULE_AND_WORKED_STEPS_ONLY",
    }),
    generationMetadata: Object.freeze({
      ...(preview.generationMetadata ?? {}),
      reviewStatus: "QUALITY_REMEDIATION_CANDIDATE_V1",
      activationAuthorized: false,
      questionStudioDiscoverable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      learnerExplanationPolicy: "CORE_RULE_AND_WORKED_STEPS_ONLY",
    }),
  });
}

export function generateQualityRemediatedTrg001QuestionStudioQuestion(
  qlId: string,
  seed: string,
  language: Trg001QuestionStudioLanguage = "en",
) {
  return markCandidate(generateApprovedTrg001QuestionStudioQuestion(qlId, seed, language));
}

export function generateQualityRemediatedTrg001QuestionStudioBatch(
  request: Trg001QuestionStudioRequest = {},
) {
  const base: any = generateTrg001QuestionStudioBatch(request);
  const questions = (base.questions ?? []).map(markCandidate);

  return Object.freeze({
    ...base,
    questions,
    generationContext: Object.freeze({
      ...(base.generationContext ?? {}),
      reviewStatus: "QUALITY_REMEDIATION_CANDIDATE_V1",
      activationAuthorized: false,
      questionStudioDiscoverable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      learnerExplanationPolicy: "CORE_RULE_AND_WORKED_STEPS_ONLY",
      qualityRemediationVersion: TRG_001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V1.version,
    }),
  });
}
