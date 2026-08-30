import {
  diagramSemanticFingerprint,
  renderGeometrySvg,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import { buildExplanation, buildOptions, proveClueMinimality, seededShuffle } from "./wave1-utils";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type {
  GapWave9CheckpointId,
  GapWave9DiagramDisposition,
  GapWave9Question,
  GapWave9VerifierResult,
} from "./wave9-types";
import type { GapWave9SourceEvidenceId } from "./wave9-source-evidence";

export { buildExplanation, buildOptions, proveClueMinimality, seededShuffle };

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function fingerprint(parts: readonly string[]): string {
  return `GEO-GAP-W9-${hashText(parts.join("|")).toString(16).padStart(8, "0")}`;
}

export function wave9Verifier(
  oracle: GapWave9VerifierResult["oracle"],
  passed: boolean,
  checks: readonly string[],
): GapWave9VerifierResult {
  return Object.freeze({ oracle, passed, checks: Object.freeze([...checks]) });
}

export function finalizeGapWave9Question(input: Readonly<{
  cpId: GapWave9CheckpointId;
  temporaryPrototypeId: string;
  sourceGapId: string;
  sourceEvidenceIds: readonly GapWave9SourceEvidenceId[];
  solveMode: string;
  difficulty: "Easy" | "Medium";
  seed: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  optionAnalysis: readonly MisconceptionOptionAnalysis[];
  explanation: Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }>;
  theoremTrace: readonly TheoremId[];
  proofEvents?: GapWave9Question["proofEvents"];
  displayedClueIds: readonly string[];
  minimalityProof: ClueMinimalityProof;
  independentVerifierResult: GapWave9VerifierResult;
  diagramDisposition: GapWave9DiagramDisposition;
  diagramModel?: GeoDiagramModel;
}>): GapWave9Question {
  const answer = input.options[input.correctIndex];
  const errors: string[] = [];
  if (input.options.length !== 4) errors.push("OPTION_COUNT_NOT_FOUR");
  if (new Set(input.options).size !== input.options.length) errors.push("DUPLICATE_OPTIONS");
  if (input.optionAnalysis.filter((option) => option.correct).length !== 1) errors.push("CORRECT_OPTION_NOT_UNIQUE");
  if (!input.minimalityProof.passed) errors.push("CLUE_MINIMALITY_FAILED");
  if (!input.independentVerifierResult.passed) errors.push("INDEPENDENT_VERIFIER_FAILED");
  if (input.sourceEvidenceIds.length === 0) errors.push("SOURCE_EVIDENCE_MISSING");

  const requiresStem = input.diagramDisposition === "REQUIRED_STEM_DIAGRAM";
  if (requiresStem && !input.diagramModel) errors.push("REQUIRED_STEM_DIAGRAM_MISSING");
  if (!requiresStem && input.diagramModel) errors.push("STEM_DIAGRAM_FORBIDDEN_BY_DISPOSITION");
  if (input.diagramModel && input.diagramModel.disclosure !== "STEM") errors.push("STEM_DIAGRAM_DISCLOSURE_INVALID");
  if (input.diagramModel && !input.diagramModel.notToScale) errors.push("GEOMETRY_NOT_TO_SCALE_REQUIRED");

  const stemSvg = input.diagramModel ? renderGeometrySvg(input.diagramModel) : undefined;
  const diagramFingerprint = input.diagramModel ? diagramSemanticFingerprint(input.diagramModel) : null;

  return Object.freeze({
    packageId: "GEO-001",
    cpId: input.cpId,
    temporaryPrototypeId: input.temporaryPrototypeId,
    sourceGapId: input.sourceGapId,
    sourceEvidenceIds: Object.freeze([...input.sourceEvidenceIds]),
    permanentQlId: null,
    solveMode: input.solveMode,
    sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE9__GAP_REMEDIATION",
    difficulty: input.difficulty,
    language: "en-IN",
    seed: input.seed,
    stem: input.stem,
    options: Object.freeze([...input.options]),
    correctIndex: input.correctIndex,
    answer,
    optionAnalysis: Object.freeze([...input.optionAnalysis]),
    explanation: input.explanation,
    theoremTrace: Object.freeze([...input.theoremTrace]),
    proofEvents: Object.freeze([...(input.proofEvents ?? [])]),
    displayedClueIds: Object.freeze([...input.displayedClueIds]),
    minimalityProof: input.minimalityProof,
    independentVerifierResult: input.independentVerifierResult,
    diagramDisposition: input.diagramDisposition,
    diagramModel: input.diagramModel,
    stemSvg,
    canonicalGeometryFingerprint: fingerprint([
      input.cpId,
      input.temporaryPrototypeId,
      input.sourceGapId,
      input.solveMode,
      input.seed,
      answer,
      input.theoremTrace.join(","),
      input.diagramDisposition,
      diagramFingerprint ?? "NO_DIAGRAM",
    ]),
    diagramFingerprint,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
    lifecycle: Object.freeze({
      stage: "DISCOVERY",
      permanentQlAllocated: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
  });
}
