import { Buffer } from "node:buffer";

import {
  SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID,
  SEA002_CP006_QUESTION_STUDIO_LANGUAGES,
  SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID,
  SEA002_CP006_QUESTION_STUDIO_QL_IDS,
  SEA002_CP006_QUESTION_STUDIO_RELEASE_ID,
} from "./question-studio-integration.ts";
import {
  SEA002_CP006_ENGLISH_FREEZE,
  SEA002_CP006_LOCALIZATION_FREEZE,
  SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE,
} from "./permanent/freeze.ts";

export const SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY =
  "SEA002_CP006_QUESTION_BANK_READINESS_V1" as const;

export const SEA002_CP006_QUESTION_BANK_READINESS = Object.freeze({
  authorityId: SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
  packageId: SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID,
  checkpointId: SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID,
  status: "QUESTION_BANK_CONVERSION_READY_NOT_ACTIVE" as const,
  sourceQuestionStudioReleaseId: SEA002_CP006_QUESTION_STUDIO_RELEASE_ID,
  permanentQlIds: SEA002_CP006_QUESTION_STUDIO_QL_IDS,
  supportedLanguages: SEA002_CP006_QUESTION_STUDIO_LANGUAGES,
  englishFreezeFingerprint: SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint,
  localizedFreezeFingerprint: SEA002_CP006_LOCALIZATION_FREEZE.approvedLocalizedReviewFingerprint,
  sourceLifecycle: SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE,
  currentLifecycle: Object.freeze({
    sourceQuestionBankWritable: false as const,
    studioPayloadQuestionBankWritable: false as const,
    questionBankAcceptanceActive: false as const,
  }),
  candidateLifecycle: Object.freeze({
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "BANK_ONLY" as const,
    manualGenerationApprovalRequired: true as const,
    acceptedQuestionStatus: "approved" as const,
    idempotentByGenerationItem: true as const,
  }),
  downstreamLifecycle: Object.freeze({
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    productionStaging: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  }),
  preservation: Object.freeze({
    canonicalAnswer: true as const,
    optionIdentity: true as const,
    permanentQlIdentity: true as const,
    frozenQueryIdentity: true as const,
    multilingualSurface: true as const,
    solvedArrangementDiagram: true as const,
  }),
  nextGate: "QUESTION_BANK_ACCEPTANCE_ACTIVATION_REQUIRES_SEPARATE_CHECKPOINT" as const,
});

type RecordLike = Record<string, unknown>;

function asRecord(value: unknown): RecordLike {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as RecordLike
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function valueFrom(payload: RecordLike, context: RecordLike, key: string): unknown {
  return payload[key] ?? context[key];
}

function assertReviewOnlySource(payload: RecordLike): void {
  const context = asRecord(payload.generationContext);
  const traceability = asRecord(payload.traceability);
  const packageId = asText(payload.packageId);
  const checkpointId = asText(payload.canonicalProblemId);
  const qlId = asText(payload.qlId || payload.questionLanguageId);
  const sourceBankStatus = asText(valueFrom(payload, context, "questionBankStatus")).toUpperCase();
  const sourceBankWritable = valueFrom(payload, context, "questionBankWritable");

  if (packageId !== SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID) {
    throw new Error(`Question Bank readiness accepts only ${SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID}.`);
  }
  if (checkpointId !== SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID) {
    throw new Error(`Question Bank readiness accepts only ${SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID}.`);
  }
  if (!SEA002_CP006_QUESTION_STUDIO_QL_IDS.includes(qlId as (typeof SEA002_CP006_QUESTION_STUDIO_QL_IDS)[number])) {
    throw new Error(`${qlId || "MISSING_QL"} is not a frozen SEA-CP-006 permanent QL.`);
  }
  if (sourceBankStatus !== "NOT_STORED" || sourceBankWritable !== false) {
    throw new Error("SEA-CP-006 readiness adapter requires the proven review-only Studio lifecycle as input.");
  }
  if (traceability.englishFreezeFingerprint !== SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint) {
    throw new Error("SEA-CP-006 English freeze fingerprint drifted before Question Bank conversion.");
  }
  if (traceability.localizedFreezeFingerprint !== SEA002_CP006_LOCALIZATION_FREEZE.approvedLocalizedReviewFingerprint) {
    throw new Error("SEA-CP-006 localization freeze fingerprint drifted before Question Bank conversion.");
  }
  if (
    SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.mockTestEligible
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.productionStaging
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable
  ) {
    throw new Error("SEA-CP-006 source lifecycle must remain inactive at the Question Bank readiness checkpoint.");
  }
}

function safeSolvedArrangementImage(payload: RecordLike): string {
  const diagram = asRecord(payload.solutionDiagram);
  const svg = asText(diagram.svg);
  if (
    diagram.kind !== "PARALLEL_ROWS_SVG"
    || diagram.solutionOnly !== true
    || diagram.background !== "white"
    || !svg.startsWith("<svg")
    || !svg.endsWith("</svg>")
    || !/fill="white"/u.test(svg)
  ) {
    throw new Error("SEA-CP-006 Question Bank conversion requires the proven white solved-arrangement diagram.");
  }
  if (
    /<\s*(?:script|foreignObject|iframe|object|embed|image|use|style|a)\b/iu.test(svg)
    || /\bon[a-z]+\s*=|\b(?:href|xlink:href)\s*=|javascript:|data:/iu.test(svg)
  ) {
    throw new Error("SEA-CP-006 solved-arrangement SVG contains disallowed active content.");
  }
  const language = asText(payload.language).toLowerCase();
  const alt = language === "hi"
    ? "हल की गई बैठने की व्यवस्था"
    : language === "pa"
      ? "ਹੱਲ ਕੀਤੀ ਬੈਠਕ ਵਿਵਸਥਾ"
      : "Solved seating arrangement";
  const encoded = Buffer.from(svg, "utf8").toString("base64");
  return `<img src="data:image/svg+xml;base64,${encoded}" alt="${alt}" loading="lazy" />`;
}

export function prepareSea002Cp006QuestionBankCandidate(value: unknown): Readonly<RecordLike> {
  const payload = asRecord(value);
  assertReviewOnlySource(payload);
  const context = asRecord(payload.generationContext);
  const explanation = asText(payload.explanation);
  if (!explanation) throw new Error("SEA-CP-006 Question Bank conversion requires the approved explanation.");
  const solvedArrangement = safeSolvedArrangementImage(payload);

  const bankLifecycle = Object.freeze({
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "BANK_ONLY" as const,
    questionBankAcceptanceAuthority: SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
    manualApprovalRequired: true as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    productionStaging: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  });

  return Object.freeze({
    ...payload,
    explanation: `${explanation}\n\n${solvedArrangement}`,
    ...bankLifecycle,
    generationContext: Object.freeze({
      ...context,
      lifecycleStatus: "QUESTION_BANK_CONVERSION_CANDIDATE",
      questionBankReadinessAuthority: SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
      ...bankLifecycle,
    }),
  });
}
