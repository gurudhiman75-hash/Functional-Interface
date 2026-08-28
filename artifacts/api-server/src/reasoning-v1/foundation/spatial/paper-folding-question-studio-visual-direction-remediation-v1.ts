import {
  PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  generatePfcTpfStudioBatchV1,
  generatePfcTpfStudioQuestionV1,
  type PfcTpfStudioLanguageV1,
  type PfcTpfStudioQlIdV1,
  type PfcTpfStudioQuestionV1,
} from "./paper-folding-question-studio-seeded-runtime-v1";

export const PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-TPF-QUESTION-STUDIO-VISUAL-DIRECTION-REMEDIATION-V1" as const,
  seededRuntimeAuthorityId: PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.authorityId,
  affectedQlIds: ["SPA-QL-040"] as const,
  defect: "TRANSPARENT_FOLD_STIMULUS_OMITTED_MOVING_SIDE_DIRECTION_CUE" as const,
  remediation: "RESTORE_EXPLICIT_FOLD_DIRECTION_ARROW_WITHOUT_CHANGING_SOLVER_OPTIONS_OR_ANSWER" as const,
  canonicalFrozenContentChanged: false,
  exactSolverChanged: false,
  optionGeometryChanged: false,
  answerChanged: false,
  localizationTextChanged: false,
  stimulusPresentationChanged: true,
  contentFingerprintMustChangeForAffectedItems: true,
  questionStudioDiscoverable: false,
  persistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticPublication: false,
  nextGate: "PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_V1_3_HUMAN_DECISION" as const,
  status: "VISUAL_REMEDIATION_IMPLEMENTED_REVIEW_REQUIRED" as const,
} as const);

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shortHash(value: string): string {
  return hash32(value).toString(16).padStart(8, "0");
}

function transparentFoldDirectionCue(mode: string, markerId: string): string {
  if (mode === "TRANSPARENT_VERTICAL_SUPERPOSITION") {
    return `<defs><marker id="${markerId}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#111"/></marker></defs><line data-fold-direction-cue="true" data-fold-direction="LEFT_TO_RIGHT" x1="32" y1="50" x2="68" y2="50" stroke="#111" stroke-width="1.8" marker-end="url(#${markerId})"/>`;
  }
  if (mode === "TRANSPARENT_HORIZONTAL_SUPERPOSITION") {
    return `<defs><marker id="${markerId}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#111"/></marker></defs><line data-fold-direction-cue="true" data-fold-direction="BOTTOM_TO_TOP" x1="50" y1="68" x2="50" y2="32" stroke="#111" stroke-width="1.8" marker-end="url(#${markerId})"/>`;
  }
  throw new Error(`Unsupported transparent fold mode ${mode}.`);
}

function addTransparentFoldDirectionCue(svg: string, mode: string, markerKey: string): string {
  if (svg.includes('data-fold-direction-cue="true"')) return svg;
  if (!svg.includes("</svg>")) throw new Error("TPF stimulus is not a complete SVG document.");
  const markerId = `tpf-dir-${shortHash(markerKey)}`;
  return svg.replace("</svg>", `${transparentFoldDirectionCue(mode, markerId)}</svg>`);
}

export function remediatePfcTpfStudioQuestionDirectionV1(
  question: PfcTpfStudioQuestionV1,
): PfcTpfStudioQuestionV1 {
  if (question.qlId !== "SPA-QL-040") return question;
  if (question.stimulusSvgs.length !== 1) {
    throw new Error(`${question.questionId}: transparent folding expects exactly one stimulus SVG.`);
  }
  const stimulusSvgs = question.stimulusSvgs.map((svg, index) =>
    addTransparentFoldDirectionCue(svg, question.mode, `${question.contentFingerprint}:${index}`),
  );
  const contentFingerprint = `pfc-tpf-${shortHash(JSON.stringify({
    sourceContentFingerprint: question.contentFingerprint,
    mode: question.mode,
    stimulusSvgs,
    optionSvgs: question.optionSvgs,
    correctIndex: question.correctIndex,
  }))}`;
  return {
    ...question,
    stimulusSvgs,
    contentFingerprint,
    questionId: `${question.qlId}:${contentFingerprint}`,
    canonicalItemId: `${question.qlId}:${contentFingerprint}`,
    questionLanguageId: `${question.qlId}:${question.language.toUpperCase()}:${contentFingerprint}`,
  };
}

export function generatePfcTpfStudioQuestionDirectionRemediatedV1(input: {
  qlId: PfcTpfStudioQlIdV1;
  seed: string;
  language?: PfcTpfStudioLanguageV1;
}): PfcTpfStudioQuestionV1 {
  return remediatePfcTpfStudioQuestionDirectionV1(generatePfcTpfStudioQuestionV1(input));
}

export function generatePfcTpfStudioBatchDirectionRemediatedV1(request: {
  seed: string;
  count?: number;
  qlId?: PfcTpfStudioQlIdV1;
  language?: PfcTpfStudioLanguageV1;
}) {
  const batch = generatePfcTpfStudioBatchV1(request);
  const questions = batch.questions.map(remediatePfcTpfStudioQuestionDirectionV1);
  return {
    ...batch,
    generationContext: {
      ...batch.generationContext,
      runtimeAuthority: PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.authorityId,
    },
    questions,
  } as const;
}
