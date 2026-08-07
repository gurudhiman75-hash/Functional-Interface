import type { SapCp002PrototypeId } from "../SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";
import { generateSapCp002ExamReadinessV3Package } from "../exam-readiness-v3/runtime";
import { buildExplanationV4, difficultyV4, normalizeMathDisplay, validateV4 } from "./pedagogy";
import { buildOptionDraftsV4, normalizedAnswerV4, normalizedStemV4, orderOptionsV4 } from "./options";
import type { SapCp002ExamReadinessV4Package } from "./types";

export function generateSapCp002ExamReadinessV4Package(
  prototypeId: SapCp002PrototypeId,
  seed: number,
): SapCp002ExamReadinessV4Package {
  if (!Number.isSafeInteger(seed) || seed <= 0) {
    throw new Error("SAP-CP-002 V4 seed must be a positive safe integer.");
  }
  const v3 = generateSapCp002ExamReadinessV3Package(prototypeId, seed);
  const stem = normalizedStemV4(v3);
  const answer = normalizedAnswerV4(v3);
  const drafts = buildOptionDraftsV4(v3, stem, answer);
  const options = orderOptionsV4(v3, drafts);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0) throw new Error(`${prototypeId}/${seed}: V4 has no correct option.`);
  const explanation = buildExplanationV4(v3, stem, answer, options);
  const difficulty = difficultyV4(v3, stem);
  const canonicalPayloadKey = v3.canonicalPayloadKey
    .replace(/^SAP_CP002_CANONICAL_V3\|/, "SAP_CP002_CANONICAL_V4|")
    .replace(/[−–—]/g, "-");
  const generationIdentity = [
    "SAP_CP002_V4",
    v3.permanentQlId,
    prototypeId,
    v3.solveModeSubtype,
    String(seed),
    "EN_IN",
  ].join("|");
  const payloadFingerprint = [
    "SAP_CP002_PAYLOAD_V4",
    canonicalPayloadKey,
    normalizeMathDisplay(v3.answerSemanticValue).replace(/\s+/g, ""),
  ].join("|");
  const validation = validateV4(
    v3,
    stem,
    answer,
    options,
    correctIndex,
    explanation,
    canonicalPayloadKey,
    generationIdentity,
  );
  const lifecycle = Object.freeze({
    permanentQlId: v3.permanentQlId,
    identityStatus: "PERMANENT_ID_RETAINED" as const,
    contentStatus: "EDITORIALLY_UNFROZEN_V4_HUMAN_REVIEW_PENDING" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
  return Object.freeze({
    ...v3,
    stem,
    canonicalAnswer: answer,
    verifierAnswer: answer,
    answerSemanticValue: normalizeMathDisplay(v3.answerSemanticValue),
    options,
    correctIndex,
    explanation,
    difficulty: difficulty.difficulty,
    difficultyScore: difficulty.score,
    difficultyEvidence: difficulty.evidence,
    editorialStatus: "EDITORIALLY_UNFROZEN_REMODELED_V4",
    reviewDecision: "AUTO_VALIDATED_HUMAN_REVIEW_PENDING",
    humanReviewStatus: "PENDING",
    reviewVersion: "SAP_CP002_EXAM_READINESS_V4",
    canonicalPayloadKey,
    payloadFingerprint,
    generationIdentity,
    optionOrderVersion: "SAP_CP002_OPTION_ORDER_V4",
    difficultyModelVersion: "SAP_CP002_SEMANTIC_DIFFICULTY_V4",
    validation,
    lifecycle,
  });
}

export function generateSapCp002ExamReadinessV4Sweep(
  seedsPerPrototype: number,
): readonly SapCp002ExamReadinessV4Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("SAP-CP-002 V4 sweep size must be a positive integer.");
  }
  const prototypeIds: readonly SapCp002PrototypeId[] = Object.freeze([
    "SAP-CP002-PROT-FRACTION-SUM-DIFFERENCE",
    "SAP-CP002-PROT-FRACTION-PRODUCT-CANCELLATION",
    "SAP-CP002-PROT-FRACTION-DIVISION-RECIPROCAL",
    "SAP-CP002-PROT-MIXED-FRACTION-OPERATION-CHAIN",
    "SAP-CP002-PROT-MIXED-NUMBERS-CONVERT-EVALUATE",
    "SAP-CP002-PROT-FRACTION-OF-FRACTION",
    "SAP-CP002-PROT-NESTED-COMPLEX-FRACTION",
    "SAP-CP002-PROT-SIGNED-FRACTION-BRACKETS",
    "SAP-CP002-PROT-FRACTION-EXPRESSION-INTEGER-PART",
    "SAP-CP002-PROT-PRODUCT-SUM-DIFFERENCE",
    "SAP-CP002-PROT-RECIPROCAL-EXPRESSION",
    "SAP-CP002-PROT-FRACTION-COMPLEMENT",
    "SAP-CP002-PROT-BOUNDED-CONTINUED-FRACTION",
    "SAP-CP002-PROT-MISSING-NUMERATOR",
    "SAP-CP002-PROT-MISSING-DENOMINATOR",
    "SAP-CP002-PROT-MISSING-FRACTION-OPERAND",
    "SAP-CP002-PROT-COMPARE-EVALUATED-FRACTIONS",
    "SAP-CP002-PROT-SELECT-EQUIVALENT-REDUCED-FRACTION",
    "SAP-CP002-PROT-IDENTIFY-INCORRECT-FRACTION-STEP",
  ]);
  const packages: SapCp002ExamReadinessV4Package[] = [];
  for (const prototypeId of prototypeIds) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp002ExamReadinessV4Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}

export const SAP_CP002_EXAM_READINESS_V4_STATE = Object.freeze({
  sourceReview: "SAP-CP-002-300-QUESTIONS-AND-EXPLANATIONS-REVIEW-V3.md",
  permanentIdentityPolicy: "RETAIN_SAP_QL_017_TO_033" as const,
  editorialState: "UNFROZEN_REMODELED_V4_HUMAN_REVIEW_PENDING" as const,
  reviewVersion: "SAP_CP002_EXAM_READINESS_V4" as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});
