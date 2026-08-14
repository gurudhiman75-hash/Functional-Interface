import {
  MAL_CP001_PERMANENT_QL_IDS,
  type MalCp001PermanentQlId,
} from "./cp001-permanent-allocation";
import {
  runMalCp001PermanentPipeline,
  type MalCp001PermanentQuestion,
  type MalCp001PermanentRuntimeInput,
} from "./cp001-permanent-runtime";
import {
  buildMalCp001ReleaseEditorialV2,
  MAL_CP001_ALLIGATION_VISUAL_ID,
  MAL_CP001_RELEASE_LAYOUT_ID,
  serializeMalCp001AlligationVisual,
  type MalCp001AlligationVisual,
  type MalCp001ReleaseExplanationV2,
} from "./cp001-release-editorial-v2";

export const MAL_CP001_ENGLISH_RELEASE = Object.freeze({
  releaseId: "MAL-CP001-EN-v1",
  presentationRevisionId: "MAL-CP001-EN-SVG-v2",
  packageId: "MAL-001",
  canonicalProblemId: "MAL-CP-001",
  language: "en" as const,
  locale: "en-IN" as const,
  status: "FROZEN" as const,
  editorialStatus: "APPROVED" as const,
  qlCount: MAL_CP001_PERMANENT_QL_IDS.length,
  reviewQuestionCount: 44,
  explanationAuthority: "MAL-CP001-EN-SIMPLE-TEACHER-V1",
  releaseLayoutId: MAL_CP001_RELEASE_LAYOUT_ID,
  alligationVisualId: MAL_CP001_ALLIGATION_VISUAL_ID,
  approvedBy: "ExamTree product-owner directive",
  approvedAt: "2026-07-29",
  presentationRevisionDirectedAt: "2026-07-30",
  reviewMethod: "GROUPED_MANUAL_AND_EXECUTABLE_AUDIT_UNDER_PRODUCT_OWNER_DIRECTIVE",
  approvalScope:
    "English stems, options, formula-first explanations, structured SVG alligation shortcuts, permanent runtime generation and controlled delivery routing",
  publiclyPublishable: true,
  questionStudioDiscoverable: true,
  questionBankWritable: true,
  testEligible: true,
  excludedLanguages: ["hi", "pa"] as const,
});

export const MAL_CP001_ENGLISH_REVIEW_APPROVAL = Object.freeze({
  status: "APPROVED_FOR_ENGLISH_RELEASE" as const,
  reviewQuestionCount: MAL_CP001_ENGLISH_RELEASE.reviewQuestionCount,
  reviewMethod: MAL_CP001_ENGLISH_RELEASE.reviewMethod,
  reviewerAuthority: MAL_CP001_ENGLISH_RELEASE.approvedBy,
  reviewedAt: MAL_CP001_ENGLISH_RELEASE.approvedAt,
  presentationRevisionId: MAL_CP001_ENGLISH_RELEASE.presentationRevisionId,
  presentationRevisionDirectedAt:
    MAL_CP001_ENGLISH_RELEASE.presentationRevisionDirectedAt,
  note:
    "Approval records the grouped manual and executable English review plus the product-owner-directed formula-first and lightweight-SVG presentation correction. It does not claim a separate product-owner row-by-row review of all 44 rows.",
});

type ReleaseValidationCheck = {
  name: string;
  passed: boolean;
  message: string;
};

type ReleasedExplanation = MalCp001ReleaseExplanationV2 & {
  lines: string[];
};

type ReleasedTraceability = MalCp001PermanentQuestion["traceability"] & {
  releaseId: typeof MAL_CP001_ENGLISH_RELEASE.releaseId;
  presentationRevisionId:
    typeof MAL_CP001_ENGLISH_RELEASE.presentationRevisionId;
  releaseLayoutId: typeof MAL_CP001_RELEASE_LAYOUT_ID;
  alligationVisualId: typeof MAL_CP001_ALLIGATION_VISUAL_ID;
  releaseStatus: typeof MAL_CP001_ENGLISH_RELEASE.status;
  editorialStatus: typeof MAL_CP001_ENGLISH_RELEASE.editorialStatus;
  approvedLanguage: typeof MAL_CP001_ENGLISH_RELEASE.language;
  approvedBy: typeof MAL_CP001_ENGLISH_RELEASE.approvedBy;
  approvedAt: typeof MAL_CP001_ENGLISH_RELEASE.approvedAt;
  reviewMethod: typeof MAL_CP001_ENGLISH_RELEASE.reviewMethod;
  runtimeMode: "RELEASED";
  reviewStatus: "APPROVED_EDITORIAL_ENGLISH";
  questionBankStatus: "WRITABLE";
  testEligibility: "ELIGIBLE";
  publiclyPublishable: true;
};

export type MalCp001ReleasedQuestion = Omit<
  MalCp001PermanentQuestion,
  | "explanation"
  | "maturity"
  | "allocationStatus"
  | "active"
  | "publiclyPublishable"
  | "questionStudioDiscoverable"
  | "questionBankWritable"
  | "testEligible"
  | "traceability"
  | "validation"
  | "parameters"
> & {
  packageId: "MAL-001";
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-001";
  permanentQlId: MalCp001PermanentQlId;
  questionLanguageId: MalCp001PermanentQlId;
  answer: string;
  difficultyBand: MalCp001PermanentQuestion["difficulty"];
  explanationId: string;
  explanation: ReleasedExplanation;
  maturity: "FROZEN";
  allocationStatus: "RELEASED_ENGLISH_V1";
  releaseStatus: "APPROVED";
  runtimeMode: "RELEASED";
  reviewStatus: "APPROVED_EDITORIAL_ENGLISH";
  questionBankStatus: "WRITABLE";
  testEligibility: "ELIGIBLE";
  permanentIdentityFrozen: true;
  active: true;
  publiclyPublishable: true;
  questionStudioDiscoverable: true;
  questionBankWritable: true;
  testEligible: true;
  parameters: MalCp001PermanentQuestion["parameters"] & {
    runtimeMode: "RELEASED";
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH";
    questionBankStatus: "WRITABLE";
    testEligibility: "ELIGIBLE";
    publiclyPublishable: true;
  };
  validation: {
    ok: true;
    errors: [];
    valid: true;
    checks: ReleaseValidationCheck[];
  };
  traceability: ReleasedTraceability;
};

function normaliseReleaseText(value: string): string {
  return value
    .replace(/\b1 ratio parts\b/giu, "1 ratio part")
    .replace(/\b1 parts\b/giu, "1 part")
    .replace(
      /\b(\d+(?: \d+\/\d+)?) litre\b/giu,
      (_match, amount: string) => `${amount} ${amount === "1" ? "litre" : "litres"}`,
    );
}

function sentenceCaseStem(value: string): string {
  return value.replace(/^([a-z])/u, (_match, letter: string) => letter.toUpperCase());
}

function normaliseAlligationVisual(
  visual: MalCp001AlligationVisual,
): MalCp001AlligationVisual {
  return JSON.parse(
    JSON.stringify(visual),
    (_key, value) =>
      typeof value === "string" ? normaliseReleaseText(value) : value,
  ) as MalCp001AlligationVisual;
}

function withReleaseEditorialLabels(
  question: MalCp001PermanentQuestion,
): MalCp001PermanentQuestion {
  if (question.permanentQlId !== "MAL-QL-001") return question;
  const request = question.parameters.request as Record<string, unknown>;
  if (request.lowerComponentLabel && request.higherComponentLabel) return question;
  return {
    ...question,
    parameters: {
      ...question.parameters,
      request: {
        ...request,
        lowerComponentLabel: question.parameters.context.lowerLabel,
        higherComponentLabel: question.parameters.context.higherLabel,
      },
    },
  } as MalCp001PermanentQuestion;
}

function normaliseReleaseExplanation(
  explanation: MalCp001ReleaseExplanationV2,
): MalCp001ReleaseExplanationV2 {
  const normalise = (value: string) => normaliseReleaseText(value);
  return {
    ...explanation,
    opening: normalise(explanation.opening),
    coreConcept: normalise(explanation.coreConcept),
    formula: normalise(explanation.formula),
    steps: explanation.steps.map(normalise),
    examShortcut: normalise(explanation.examShortcut),
    verification: normalise(explanation.verification).replace(/^Check:\s*/iu, ""),
    conclusion: normalise(explanation.conclusion),
    commonTrap: normalise(explanation.commonTrap),
    alligationVisual: normaliseAlligationVisual(explanation.alligationVisual),
  };
}

function explanationLines(explanation: MalCp001ReleaseExplanationV2): string[] {
  return [
    explanation.sectionTitles.coreConcept,
    explanation.coreConcept,
    `Formula: ${explanation.formula}`,
    explanation.sectionTitles.steps,
    ...explanation.steps,
    `Quick check: ${explanation.verification}`,
    `Final answer: ${explanation.conclusion}`,
    explanation.sectionTitles.shortcut,
    serializeMalCp001AlligationVisual(explanation.alligationVisual),
    explanation.examShortcut,
    explanation.sectionTitles.trap,
    explanation.commonTrap.replace(/^Common trap:\s*/u, ""),
  ];
}

function releaseChecks(
  question: MalCp001PermanentQuestion,
  editorial: ReturnType<typeof buildMalCp001ReleaseEditorialV2>,
): ReleaseValidationCheck[] {
  const answer = question.options[question.correctIndex];
  return [
    {
      name: "foundation-validation",
      passed:
        question.validation.ok && question.validation.errors.length === 0,
      message: "The frozen exact-arithmetic foundation validation passes.",
    },
    {
      name: "permanent-identity",
      passed:
        question.permanentIdentityFrozen === true &&
        MAL_CP001_PERMANENT_QL_IDS.includes(question.questionLanguageId),
      message: "The question uses one frozen MAL-CP-001 permanent QL identity.",
    },
    {
      name: "english-editorial-approval",
      passed:
        question.language === MAL_CP001_ENGLISH_RELEASE.language &&
        question.explanation.layoutId ===
          MAL_CP001_ENGLISH_RELEASE.explanationAuthority,
      message: "The approved simple-English teacher foundation is present.",
    },
    {
      name: "formula-svg-presentation",
      passed:
        editorial.explanation.releaseLayoutId ===
          MAL_CP001_ENGLISH_RELEASE.releaseLayoutId &&
        editorial.explanation.alligationVisualId ===
          MAL_CP001_ENGLISH_RELEASE.alligationVisualId,
      message:
        "The formula-first release layout and structured alligation visual are present.",
    },
    {
      name: "answer-option-contract",
      passed:
        typeof answer === "string" &&
        answer.length > 0 &&
        question.options.length === 4 &&
        new Set(question.options).size === 4,
      message: "The canonical answer is present in four unique learner options.",
    },
    {
      name: "release-approval",
      passed:
        MAL_CP001_ENGLISH_RELEASE.editorialStatus === "APPROVED" &&
        MAL_CP001_ENGLISH_REVIEW_APPROVAL.status ===
          "APPROVED_FOR_ENGLISH_RELEASE",
      message: `${MAL_CP001_ENGLISH_RELEASE.releaseId} approves the validated English package for controlled delivery.`,
    },
  ];
}

export function applyMalCp001EnglishRelease(
  question: MalCp001PermanentQuestion,
): MalCp001ReleasedQuestion {
  if (question.language !== MAL_CP001_ENGLISH_RELEASE.language) {
    throw new Error(
      `${MAL_CP001_ENGLISH_RELEASE.releaseId} approves English only; received ${question.language}.`,
    );
  }

  const editorialQuestion = withReleaseEditorialLabels(question);
  const rawEditorial = buildMalCp001ReleaseEditorialV2(editorialQuestion);
  const editorial = {
    ...rawEditorial,
    stem: sentenceCaseStem(normaliseReleaseText(rawEditorial.stem)),
    explanation: normaliseReleaseExplanation(rawEditorial.explanation),
  };
  const checks = releaseChecks(question, editorial);
  const failures = checks.filter((check) => !check.passed);
  if (failures.length > 0) {
    throw new Error(
      `${question.questionLanguageId}: cannot apply ${MAL_CP001_ENGLISH_RELEASE.releaseId}: ${failures
        .map((check) => `${check.name}: ${check.message}`)
        .join("; ")}`,
    );
  }

  const answer = question.options[question.correctIndex]!;
  return {
    ...question,
    stem: editorial.stem,
    packageId: "MAL-001",
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-001",
    answer,
    difficultyBand: question.difficulty,
    explanationId: `${question.questionLanguageId}-EN-FORMULA-ALLIGATION-SVG-V2`,
    explanation: {
      ...editorial.explanation,
      lines: explanationLines(editorial.explanation),
    },
    maturity: "FROZEN",
    allocationStatus: "RELEASED_ENGLISH_V1",
    releaseStatus: "APPROVED",
    runtimeMode: "RELEASED",
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    active: true,
    publiclyPublishable: true,
    questionStudioDiscoverable: true,
    questionBankWritable: true,
    testEligible: true,
    parameters: {
      ...question.parameters,
      runtimeMode: "RELEASED",
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
    },
    validation: {
      ok: true,
      errors: [],
      valid: true,
      checks,
    },
    traceability: {
      ...question.traceability,
      releaseId: MAL_CP001_ENGLISH_RELEASE.releaseId,
      presentationRevisionId:
        MAL_CP001_ENGLISH_RELEASE.presentationRevisionId,
      releaseLayoutId: MAL_CP001_RELEASE_LAYOUT_ID,
      alligationVisualId: MAL_CP001_ALLIGATION_VISUAL_ID,
      releaseStatus: MAL_CP001_ENGLISH_RELEASE.status,
      editorialStatus: MAL_CP001_ENGLISH_RELEASE.editorialStatus,
      approvedLanguage: MAL_CP001_ENGLISH_RELEASE.language,
      approvedBy: MAL_CP001_ENGLISH_RELEASE.approvedBy,
      approvedAt: MAL_CP001_ENGLISH_RELEASE.approvedAt,
      reviewMethod: MAL_CP001_ENGLISH_RELEASE.reviewMethod,
      runtimeMode: "RELEASED",
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
    },
  };
}

export function runMalCp001EnglishReleasePipeline(
  input: MalCp001PermanentRuntimeInput = {},
): MalCp001ReleasedQuestion {
  return applyMalCp001EnglishRelease(runMalCp001PermanentPipeline(input));
}
