import { GEO_PHASE1_TEMPORARY_PROTOTYPES } from "../GEO-001/discovery/phase1-registry";
import { GEO_PHASE2_TEMPORARY_PROTOTYPES } from "../GEO-001/discovery/phase2-registry";
import { GEO_PHASE3_TEMPORARY_PROTOTYPES } from "../GEO-001/discovery/phase3-registry";
import { GEO_PHASE4_TEMPORARY_PROTOTYPES } from "../GEO-002/discovery/phase4-registry";
import { GEO_PHASE5_TEMPORARY_PROTOTYPES } from "../GEO-002/discovery/phase5-registry";
import { GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES } from "../source-remediation/wave1-prototypes";
import { GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES } from "../source-remediation/wave2-prototypes";
import { GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES } from "../source-remediation/wave3-prototypes";
import { GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES } from "../source-remediation/wave4-prototypes";
import { GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES } from "../source-remediation/wave5-prototypes";
import { GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES } from "../source-remediation/wave6-prototypes";
import { GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES } from "../source-remediation/wave7-prototypes";
import { GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES } from "../source-remediation/wave8-prototypes";
import { GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES } from "../source-remediation/wave9-prototypes";
import { GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES } from "../source-remediation/wave10-prototypes";
import { GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES } from "../source-remediation/wave11-prototypes";
import { GEO_GAP_REMEDIATION_WAVE12_PROTOTYPES } from "../source-remediation/wave12-prototypes";
import { GEO_GAP_REMEDIATION_WAVE13_PROTOTYPES } from "../source-remediation/wave13-prototypes";
import { GEO_SOLVE_MODE_FREEZE_PROOF_V1 } from "./geometry-solve-mode-freeze-proof-v1";
import { GEO_SOLVE_MODE_FREEZE_V1 } from "./geometry-solve-mode-freeze-v1";

interface GeometryExecutableQuestionLike {
  readonly temporaryPrototypeId: string;
  readonly cpId: string;
  readonly solveMode: string;
  readonly language: string;
  readonly seed: string;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: Readonly<{
    lines: readonly string[];
    theoremNames: readonly string[];
  }>;
  readonly validation: Readonly<{
    ok: boolean;
    errors: readonly string[];
  }>;
  readonly stemSvg?: string;
  readonly diagramModel?: unknown;
  readonly canonicalGeometryFingerprint?: string;
  readonly diagramFingerprint?: string | null;
}

interface GeometryExecutablePrototypeLike {
  readonly temporaryPrototypeId: string;
  readonly cpId: string;
  readonly solveMode: string;
  readonly generate: (seed: string) => GeometryExecutableQuestionLike;
}

const EXECUTABLE_STAGES: readonly (readonly GeometryExecutablePrototypeLike[])[] = Object.freeze([
  GEO_PHASE1_TEMPORARY_PROTOTYPES,
  GEO_PHASE2_TEMPORARY_PROTOTYPES,
  GEO_PHASE3_TEMPORARY_PROTOTYPES,
  GEO_PHASE4_TEMPORARY_PROTOTYPES,
  GEO_PHASE5_TEMPORARY_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE12_PROTOTYPES,
  GEO_GAP_REMEDIATION_WAVE13_PROTOTYPES,
] as readonly (readonly GeometryExecutablePrototypeLike[])[]);

export const GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1: readonly GeometryExecutablePrototypeLike[] = Object.freeze(
  EXECUTABLE_STAGES.flatMap((stage) => stage),
);

if (GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.length !== 81) {
  throw new Error(`Geometry permanent English runtime requires 81 executable temporary prototypes; got ${GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.length}.`);
}
if (new Set(GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.map((prototype) => prototype.temporaryPrototypeId)).size !== 81) {
  throw new Error("Geometry permanent English runtime found duplicate temporary prototype IDs.");
}
if (!GEO_SOLVE_MODE_FREEZE_PROOF_V1.lifecycle.englishRuntimeImplementationAllowed) {
  throw new Error("Geometry English runtime implementation is not authorized by solve-mode freeze proof.");
}

const PROTOTYPE_BY_ID = new Map(
  GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.map((prototype) => [prototype.temporaryPrototypeId, prototype] as const),
);

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export interface GeometryPermanentEnglishRuntimeDefinitionV1 {
  readonly qlId: string;
  readonly canonicalSolveModeFamilyId: string;
  readonly cpId: string;
  readonly proposalKey: string;
  readonly learnerDecision: string;
  readonly prototypeIds: readonly string[];
  readonly prototypeSolveModes: readonly string[];
  readonly runtimeStatus: "PERMANENT_IDENTITY_ENGLISH_REVIEW_RUNTIME";
  readonly englishImplementationFrozen: false;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
}

export interface GeometryPermanentEnglishCandidateItemV1 {
  readonly qlId: string;
  readonly canonicalSolveModeFamilyId: string;
  readonly cpId: string;
  readonly proposalKey: string;
  readonly learnerDecision: string;
  readonly prototypeId: string;
  readonly prototypeSolveMode: string;
  readonly variantIndex: number;
  readonly seed: string;
  readonly language: "en-IN";
  readonly question: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly explanation: string;
  readonly explanationLines: readonly string[];
  readonly theoremNames: readonly string[];
  readonly stemSvg: string | null;
  readonly diagramModel: unknown | null;
  readonly canonicalGeometryFingerprint: string | null;
  readonly diagramFingerprint: string | null;
  readonly rawPrototypeQuestion: GeometryExecutableQuestionLike;
  readonly maturity: "PERMANENT_IDENTITY_ENGLISH_REVIEW_CANDIDATE";
  readonly reviewStatus: "AWAITING_EXPLICIT_ENGLISH_ARTIFACT_APPROVAL";
  readonly englishImplementationFrozen: false;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export const GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1: readonly GeometryPermanentEnglishRuntimeDefinitionV1[] = Object.freeze(
  GEO_SOLVE_MODE_FREEZE_V1.map((family) => {
    for (const prototypeId of family.candidateIds) {
      const prototype = PROTOTYPE_BY_ID.get(prototypeId);
      if (!prototype) throw new Error(`${family.permanentQlId}: missing executable prototype ${prototypeId}`);
      if (prototype.cpId !== family.cpId) throw new Error(`${family.permanentQlId}: prototype ${prototypeId} CP drifted`);
      if (!family.prototypeSolveModes.includes(prototype.solveMode)) {
        throw new Error(`${family.permanentQlId}: prototype ${prototypeId} solve mode ${prototype.solveMode} is outside the frozen family`);
      }
    }
    return Object.freeze({
      qlId: family.permanentQlId,
      canonicalSolveModeFamilyId: family.canonicalSolveModeFamilyId,
      cpId: family.cpId,
      proposalKey: family.proposalKey,
      learnerDecision: family.learnerDecision,
      prototypeIds: family.candidateIds,
      prototypeSolveModes: family.prototypeSolveModes,
      runtimeStatus: "PERMANENT_IDENTITY_ENGLISH_REVIEW_RUNTIME",
      englishImplementationFrozen: false,
      active: false,
      questionStudioDiscoverable: false,
    } satisfies GeometryPermanentEnglishRuntimeDefinitionV1);
  }),
);

export function getGeometryPermanentEnglishRuntimeDefinitionV1(qlId: string): GeometryPermanentEnglishRuntimeDefinitionV1 {
  const definition = GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.find((candidate) => candidate.qlId === qlId);
  if (!definition) throw new Error(`Unknown permanent Geometry QL: ${qlId}`);
  return definition;
}

export function generateGeometryPermanentEnglishCandidateV1(
  qlId: string,
  seed: string,
  requestedVariantIndex?: number,
): GeometryPermanentEnglishCandidateItemV1 {
  const definition = getGeometryPermanentEnglishRuntimeDefinitionV1(qlId);
  const variantIndex = requestedVariantIndex === undefined
    ? hashText(`${qlId}|${seed}`) % definition.prototypeIds.length
    : requestedVariantIndex;
  if (!Number.isInteger(variantIndex) || variantIndex < 0 || variantIndex >= definition.prototypeIds.length) {
    throw new Error(`Invalid Geometry permanent English variant index ${variantIndex} for ${qlId}`);
  }

  const prototypeId = definition.prototypeIds[variantIndex]!;
  const prototype = PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`${qlId}: executable prototype ${prototypeId} disappeared`);
  const raw = prototype.generate(seed);

  if (raw.temporaryPrototypeId !== prototypeId) throw new Error(`${qlId}: generated prototype identity drifted`);
  if (raw.cpId !== definition.cpId) throw new Error(`${qlId}: generated checkpoint drifted`);
  if (raw.solveMode !== prototype.solveMode) throw new Error(`${qlId}: generated prototype solve mode drifted`);
  if (raw.language !== "en-IN") throw new Error(`${qlId}: permanent English review received language ${raw.language}`);
  if (!raw.validation.ok) throw new Error(`${qlId}: prototype ${prototypeId} failed its own validation: ${raw.validation.errors.join(", ")}`);
  if (raw.options.length !== 4 || new Set(raw.options).size !== 4) throw new Error(`${qlId}: prototype ${prototypeId} must render four unique options`);
  if (raw.correctIndex < 0 || raw.correctIndex >= raw.options.length) throw new Error(`${qlId}: prototype ${prototypeId} correctIndex is invalid`);
  if (raw.options[raw.correctIndex] !== raw.answer) throw new Error(`${qlId}: prototype ${prototypeId} answer/options disagree`);
  if (!raw.stem.trim()) throw new Error(`${qlId}: prototype ${prototypeId} rendered an empty stem`);
  if (!raw.explanation.lines.length || raw.explanation.lines.some((line) => !line.trim())) {
    throw new Error(`${qlId}: prototype ${prototypeId} rendered an empty explanation line`);
  }

  return Object.freeze({
    qlId,
    canonicalSolveModeFamilyId: definition.canonicalSolveModeFamilyId,
    cpId: definition.cpId,
    proposalKey: definition.proposalKey,
    learnerDecision: definition.learnerDecision,
    prototypeId,
    prototypeSolveMode: raw.solveMode,
    variantIndex,
    seed,
    language: "en-IN",
    question: raw.stem,
    options: raw.options,
    correctIndex: raw.correctIndex,
    canonicalAnswer: raw.answer,
    explanation: raw.explanation.lines.join("\n"),
    explanationLines: raw.explanation.lines,
    theoremNames: raw.explanation.theoremNames,
    stemSvg: raw.stemSvg ?? null,
    diagramModel: raw.diagramModel ?? null,
    canonicalGeometryFingerprint: raw.canonicalGeometryFingerprint ?? null,
    diagramFingerprint: raw.diagramFingerprint ?? null,
    rawPrototypeQuestion: raw,
    maturity: "PERMANENT_IDENTITY_ENGLISH_REVIEW_CANDIDATE",
    reviewStatus: "AWAITING_EXPLICIT_ENGLISH_ARTIFACT_APPROVAL",
    englishImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  } satisfies GeometryPermanentEnglishCandidateItemV1);
}

export const GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-PERMANENT-ENGLISH-RUNTIME-V1",
  authorityRevision: 3,
  solveModeFreezeProofAuthorityId: GEO_SOLVE_MODE_FREEZE_PROOF_V1.authorityId,
  status: "PERMANENT_ENGLISH_RUNTIME_REVIEW_IMPLEMENTED__CI_PROOF_PENDING",
  language: "en",
  locale: "en-IN",
  permanentQlCount: GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length,
  executablePrototypeCount: GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.length,
  mappedVariantCount: GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.reduce((sum, definition) => sum + definition.prototypeIds.length, 0),
  lifecycle: Object.freeze({
    solveModeFreezeProven: true,
    englishRuntimeImplementationAllowed: true,
    englishRuntimeImplemented: true,
    englishRuntimeProven: false,
    englishFreezeAllowed: false,
    englishImplementationFrozen: false,
    localizationAllowed: false,
    questionStudioActivationAllowed: false,
    questionStudioDiscoverable: false,
    questionBankWriteAllowed: false,
    questionBankWritable: false,
    testEligibilityAllowed: false,
    testEligible: false,
    publicPublicationAllowed: false,
    publiclyPublishable: false,
    prMergeAuthorized: false,
  }),
  postProofNextGate: "EXPLICIT_ENGLISH_ARTIFACT_APPROVAL",
} as const);
