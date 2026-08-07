import type { SapCp002PrototypeId } from "../SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";
import { generateSapCp002FinalExamReadinessV2Package } from "../exam-readiness-v2/final-runtime";
import type { SapCp002ExamReadinessV3Package } from "./types";
import { extractExpression, normalizeFingerprint, parseExpression, visibleOperands } from "./exact";
import { recoverProductAstFromFingerprint } from "./fingerprint";
import { canonicalPayloadKey, makeOption, ownedOptions, shuffled, splitMode } from "./options";
import { explanationFor, semanticDifficulty, validateV3 } from "./pedagogy";

export function generateSapCp002ExamReadinessV3Package(
  prototypeId: SapCp002PrototypeId,
  seed: number,
): SapCp002ExamReadinessV3Package {
  if (!Number.isSafeInteger(seed) || seed <= 0) throw new Error("SAP-CP-002 V3 seed must be a positive safe integer.");
  const v2 = generateSapCp002FinalExamReadinessV2Package(prototypeId, seed);
  const expression = extractExpression(v2.stem);
  const ast = parseExpression(expression)
    ?? (v2.permanentQlId === "SAP-QL-018" ? recoverProductAstFromFingerprint(v2.mathematicalFingerprint) : null);
  const mode = splitMode(v2);
  const visible = visibleOperands(v2.stem);
  const owned = ownedOptions(v2, ast, visible);
  const baseCanonicalKey = canonicalPayloadKey(v2, mode.subtype, ast);
  const canonicalKey = v2.taskDirection === "INVERSE"
    ? `${baseCanonicalKey}|EQUALITY:${normalizeFingerprint(owned.stem)}`
    : baseCanonicalKey;
  const answerBoundOptions = Object.freeze(owned.options.map((option) => option.isCorrect
    ? Object.freeze({
      ...option,
      value: owned.canonicalAnswer,
      semanticValue: owned.answerSemanticValue,
      numericEquivalenceToCorrect: true,
      satisfiesRequiredForm: true,
    })
    : option));
  const optionDrafts = shuffled(answerBoundOptions, `${canonicalKey}|${seed}|SAP_CP002_OPTION_ORDER_V3`);
  const options = Object.freeze(optionDrafts.map((option, index) => makeOption(option, index + 1)));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0) throw new Error(`${prototypeId}/${seed} V3 has no correct option.`);
  const generatedExplanation = explanationFor(
    v2,
    owned.stem,
    owned.canonicalAnswer,
    owned.answerSemanticValue,
    options,
    ast,
    visibleOperands(owned.stem),
  );
  const explanation = v2.permanentQlId === "SAP-QL-031"
    ? Object.freeze({
      ...generatedExplanation,
      commonTraps: Object.freeze(options
        .filter((option) => !option.isCorrect)
        .map((option) => `Option ${option.displayIndex} (${option.semanticValue}): ${option.analysis}`)),
    })
    : generatedExplanation;
  const difficulty = semanticDifficulty(v2, mode.subtype, ast, owned.stem);
  const generationIdentity = [
    "SAP_CP002_V3",
    v2.permanentQlId,
    prototypeId,
    mode.subtype,
    String(seed),
    "EN_IN",
  ].join("|");
  const validation = validateV3(
    v2,
    mode.subtype,
    owned.stem,
    owned.canonicalAnswer,
    owned.answerSemanticValue,
    options,
    correctIndex,
    explanation,
    canonicalKey,
    generationIdentity,
  );
  const payloadFingerprint = [
    "SAP_CP002_PAYLOAD_V3",
    canonicalKey,
    owned.answerSemanticValue.replace(/\s+/g, ""),
  ].join("|");
  const lifecycle = Object.freeze({
    permanentQlId: v2.permanentQlId,
    identityStatus: "PERMANENT_ID_RETAINED" as const,
    contentStatus: "EDITORIALLY_UNFROZEN_V3_HUMAN_REVIEW_PENDING" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
  return Object.freeze({
    ...v2,
    solveModeLabel: mode.label,
    solveModeSubtype: mode.subtype,
    stem: owned.stem,
    canonicalAnswer: owned.canonicalAnswer,
    verifierAnswer: owned.verifierAnswer,
    sourceCanonicalAnswer: v2.canonicalAnswer,
    answerSemanticValue: owned.answerSemanticValue,
    options,
    correctIndex,
    explanation,
    difficulty: difficulty.difficulty,
    difficultyScore: difficulty.score,
    difficultyEvidence: difficulty.evidence,
    editorialStatus: "EDITORIALLY_UNFROZEN_REMODELED_V3",
    reviewDecision: "AUTO_VALIDATED_HUMAN_REVIEW_PENDING",
    humanReviewStatus: "PENDING",
    reviewVersion: "SAP_CP002_EXAM_READINESS_V3",
    canonicalPayloadKey: canonicalKey,
    payloadFingerprint,
    generationIdentity,
    optionOrderVersion: "SAP_CP002_OPTION_ORDER_V3",
    difficultyModelVersion: "SAP_CP002_SEMANTIC_DIFFICULTY_V3",
    validation,
    lifecycle,
  });
}

export function generateSapCp002ExamReadinessV3Sweep(
  seedsPerPrototype: number,
): readonly SapCp002ExamReadinessV3Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("SAP-CP-002 V3 sweep size must be a positive integer.");
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
  const packages: SapCp002ExamReadinessV3Package[] = [];
  for (const prototypeId of prototypeIds) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp002ExamReadinessV3Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}

export const SAP_CP002_EXAM_READINESS_V3_STATE = Object.freeze({
  sourceAudits: Object.freeze([
    "SAP-CP002-300Q-EXAM-READINESS-CRITICAL-REVIEW.md",
    "SAP-CP002-V2-EXAM-READINESS-CRITICAL-REVIEW.md",
  ]),
  permanentIdentityPolicy: "RETAIN_SAP_QL_017_TO_033" as const,
  editorialState: "UNFROZEN_REMODELED_V3_HUMAN_REVIEW_PENDING" as const,
  reviewVersion: "SAP_CP002_EXAM_READINESS_V3" as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});
