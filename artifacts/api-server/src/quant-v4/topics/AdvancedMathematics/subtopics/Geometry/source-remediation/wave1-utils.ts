import {
  diagramSemanticFingerprint,
  renderGeometrySvg,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import { buildExplanation, buildOptions, proveClueMinimality, seededShuffle } from "../GEO-001/discovery/phase1-utils";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import { remediateWave1Diagram } from "./wave1-diagram-remediation";
import type {
  DiagramDisposition,
  GapWave1CheckpointId,
  GapWave1Question,
  GapWave1VerifierResult,
} from "./wave1-types";

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
  return `GEO-GAP-W1-${hashText(parts.join("|")).toString(16).padStart(8, "0")}`;
}

export function numericAngleDegrees(
  first: Readonly<{ x: number; y: number }>,
  vertex: Readonly<{ x: number; y: number }>,
  second: Readonly<{ x: number; y: number }>,
): number {
  const ax = first.x - vertex.x;
  const ay = first.y - vertex.y;
  const bx = second.x - vertex.x;
  const by = second.y - vertex.y;
  const denominator = Math.hypot(ax, ay) * Math.hypot(bx, by);
  if (denominator === 0) throw new Error("Cannot measure an angle with a zero-length ray");
  const cosine = Math.max(-1, Math.min(1, (ax * bx + ay * by) / denominator));
  return Math.acos(cosine) * 180 / Math.PI;
}

export function approximate(value: number, expected: number, tolerance = 1e-8): boolean {
  return Math.abs(value - expected) <= tolerance;
}

export function remediationVerifier(
  oracle: GapWave1VerifierResult["oracle"],
  passed: boolean,
  checks: readonly string[],
): GapWave1VerifierResult {
  return Object.freeze({ passed, oracle, checks: Object.freeze([...checks]) });
}

export function finalizeGapWave1Question(input: Readonly<{
  cpId: GapWave1CheckpointId;
  temporaryPrototypeId: string;
  sourceGapId: string;
  sourceEvidenceIds: readonly string[];
  solveMode: string;
  difficulty: "Easy" | "Medium";
  seed: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  optionAnalysis: readonly MisconceptionOptionAnalysis[];
  explanation: Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }>;
  theoremTrace: readonly TheoremId[];
  proofEvents: GapWave1Question["proofEvents"];
  displayedClueIds: readonly string[];
  minimalityProof: ClueMinimalityProof;
  independentVerifierResult: GapWave1VerifierResult;
  diagramDisposition: DiagramDisposition;
  diagramModel?: GeoDiagramModel;
}>): GapWave1Question {
  const answer = input.options[input.correctIndex];
  const errors: string[] = [];
  if (new Set(input.options).size !== input.options.length) errors.push("DUPLICATE_OPTIONS");
  if (input.options.length !== 4) errors.push("OPTION_COUNT_NOT_FOUR");
  if (!input.minimalityProof.passed) errors.push("CLUE_MINIMALITY_FAILED");
  if (!input.independentVerifierResult.passed) errors.push("INDEPENDENT_VERIFIER_FAILED");
  if (input.optionAnalysis.filter((option) => option.correct).length !== 1) errors.push("CORRECT_OPTION_NOT_UNIQUE");
  if (input.sourceEvidenceIds.length === 0) errors.push("SOURCE_EVIDENCE_MISSING");

  const remediatedDiagramModel = input.diagramModel
    ? remediateWave1Diagram(input.temporaryPrototypeId, input.diagramModel)
    : undefined;
  const stemRequiresDiagram = input.diagramDisposition === "REQUIRED_STEM_DIAGRAM" || input.diagramDisposition === "REQUIRED_BOTH";
  const stemForbidsDiagram = input.diagramDisposition === "NO_DIAGRAM" || input.diagramDisposition === "REQUIRED_SOLUTION_DIAGRAM";
  if (stemRequiresDiagram && !remediatedDiagramModel) errors.push("REQUIRED_STEM_DIAGRAM_MISSING");
  if (stemForbidsDiagram && remediatedDiagramModel) errors.push("STEM_DIAGRAM_FORBIDDEN_BY_DISPOSITION");
  if (remediatedDiagramModel && remediatedDiagramModel.disclosure !== "STEM") errors.push("STEM_DIAGRAM_DISCLOSURE_INVALID");
  if (remediatedDiagramModel && !remediatedDiagramModel.notToScale) errors.push("GEOMETRY_V1_NOT_TO_SCALE_REQUIRED");

  const stemSvg = remediatedDiagramModel ? renderGeometrySvg(remediatedDiagramModel) : undefined;
  const diagramFingerprint = remediatedDiagramModel ? diagramSemanticFingerprint(remediatedDiagramModel) : null;
  const packageId = input.cpId === "GEO-CP-006" ? "GEO-001" : "GEO-002";

  return Object.freeze({
    packageId,
    cpId: input.cpId,
    temporaryPrototypeId: input.temporaryPrototypeId,
    sourceGapId: input.sourceGapId,
    sourceEvidenceIds: Object.freeze([...input.sourceEvidenceIds]),
    permanentQlId: null,
    solveMode: input.solveMode,
    sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE1__GAP_REMEDIATION",
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
    proofEvents: Object.freeze([...input.proofEvents]),
    displayedClueIds: Object.freeze([...input.displayedClueIds]),
    minimalityProof: input.minimalityProof,
    independentVerifierResult: input.independentVerifierResult,
    diagramDisposition: input.diagramDisposition,
    diagramModel: remediatedDiagramModel,
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
