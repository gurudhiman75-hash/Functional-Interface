import {
  diagramSemanticFingerprint,
  renderGeometrySvg,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import { buildExplanation, buildOptions, proveClueMinimality, seededShuffle } from "./wave1-utils";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave6DiagramDisposition, GapWave6Question, GapWave6VerifierResult } from "./wave6-types";
import type { GapWave6SourceEvidenceId } from "./wave6-source-evidence";

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
  return `GEO-GAP-W6-${hashText(parts.join("|")).toString(16).padStart(8, "0")}`;
}

export function approximate(value: number, expected: number, tolerance = 1e-8): boolean {
  return Math.abs(value - expected) <= tolerance;
}

export function pointDistance(a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function collinear(
  a: Readonly<{ x: number; y: number }>,
  b: Readonly<{ x: number; y: number }>,
  c: Readonly<{ x: number; y: number }>,
): boolean {
  return approximate((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x), 0);
}

export function parallel(
  a: Readonly<{ x: number; y: number }>,
  b: Readonly<{ x: number; y: number }>,
  c: Readonly<{ x: number; y: number }>,
  d: Readonly<{ x: number; y: number }>,
): boolean {
  return approximate((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x), 0);
}

export function perpendicular(
  a: Readonly<{ x: number; y: number }>,
  b: Readonly<{ x: number; y: number }>,
  c: Readonly<{ x: number; y: number }>,
  d: Readonly<{ x: number; y: number }>,
): boolean {
  return approximate((b.x - a.x) * (d.x - c.x) + (b.y - a.y) * (d.y - c.y), 0);
}

export function extractSvgLabelCollisionScores(svg: string): readonly number[] {
  return Object.freeze([...svg.matchAll(/data-label-collision-score="([0-9.]+)"/g)].map((match) => Number(match[1])));
}

export function wave6Verifier(
  oracle: GapWave6VerifierResult["oracle"],
  passed: boolean,
  checks: readonly string[],
): GapWave6VerifierResult {
  return Object.freeze({ oracle, passed, checks: Object.freeze([...checks]) });
}

export function finalizeGapWave6Question(input: Readonly<{
  temporaryPrototypeId: string;
  sourceGapId: string;
  sourceEvidenceIds: readonly GapWave6SourceEvidenceId[];
  solveMode: string;
  seed: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  optionAnalysis: readonly MisconceptionOptionAnalysis[];
  explanation: Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }>;
  theoremTrace: readonly TheoremId[];
  displayedClueIds: readonly string[];
  minimalityProof: ClueMinimalityProof;
  independentVerifierResult: GapWave6VerifierResult;
  diagramDisposition: GapWave6DiagramDisposition;
  diagramModel?: GeoDiagramModel;
  solutionDiagramModel: GeoDiagramModel;
}>): GapWave6Question {
  const answer = input.options[input.correctIndex];
  const errors: string[] = [];
  if (input.options.length !== 4) errors.push("OPTION_COUNT_NOT_FOUR");
  if (new Set(input.options).size !== input.options.length) errors.push("DUPLICATE_OPTIONS");
  if (input.optionAnalysis.filter((option) => option.correct).length !== 1) errors.push("CORRECT_OPTION_NOT_UNIQUE");
  if (!input.minimalityProof.passed) errors.push("CLUE_MINIMALITY_FAILED");
  if (!input.independentVerifierResult.passed) errors.push("INDEPENDENT_VERIFIER_FAILED");
  if (input.sourceEvidenceIds.length === 0) errors.push("SOURCE_EVIDENCE_MISSING");

  const requiresStem = input.diagramDisposition === "REQUIRED_BOTH";
  const forbidsStem = input.diagramDisposition === "REQUIRED_SOLUTION_DIAGRAM";
  if (requiresStem && !input.diagramModel) errors.push("REQUIRED_STEM_DIAGRAM_MISSING");
  if (forbidsStem && input.diagramModel) errors.push("STEM_DIAGRAM_FORBIDDEN_BY_DISPOSITION");
  if (input.diagramModel && input.diagramModel.disclosure !== "STEM") errors.push("STEM_DIAGRAM_DISCLOSURE_INVALID");
  if (input.solutionDiagramModel.disclosure !== "SOLUTION") errors.push("SOLUTION_DIAGRAM_DISCLOSURE_INVALID");
  if (input.diagramModel && !input.diagramModel.notToScale) errors.push("STEM_NOT_TO_SCALE_REQUIRED");
  if (!input.solutionDiagramModel.notToScale) errors.push("SOLUTION_NOT_TO_SCALE_REQUIRED");

  const stemSvg = input.diagramModel ? renderGeometrySvg(input.diagramModel) : undefined;
  const solutionSvg = renderGeometrySvg(input.solutionDiagramModel);
  if (stemSvg && !stemSvg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"')) errors.push("STEM_RENDERER_V2_REQUIRED");
  if (!solutionSvg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"')) errors.push("SOLUTION_RENDERER_V2_REQUIRED");
  if (stemSvg && extractSvgLabelCollisionScores(stemSvg).some((score) => score > 0)) errors.push("STEM_DIAGRAM_LABEL_COLLISION");
  if (extractSvgLabelCollisionScores(solutionSvg).some((score) => score > 0)) errors.push("SOLUTION_DIAGRAM_LABEL_COLLISION");

  const diagramFingerprint = input.diagramModel ? diagramSemanticFingerprint(input.diagramModel) : null;
  const solutionDiagramFingerprint = diagramSemanticFingerprint(input.solutionDiagramModel);

  return Object.freeze({
    packageId: "GEO-001",
    cpId: "GEO-CP-006",
    temporaryPrototypeId: input.temporaryPrototypeId,
    sourceGapId: input.sourceGapId,
    sourceEvidenceIds: Object.freeze([...input.sourceEvidenceIds]),
    permanentQlId: null,
    solveMode: input.solveMode,
    sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE6__GAP_REMEDIATION",
    difficulty: "Medium",
    language: "en-IN",
    seed: input.seed,
    stem: input.stem,
    options: Object.freeze([...input.options]),
    correctIndex: input.correctIndex,
    answer,
    optionAnalysis: Object.freeze([...input.optionAnalysis]),
    explanation: input.explanation,
    theoremTrace: Object.freeze([...input.theoremTrace]),
    proofEvents: Object.freeze([]),
    displayedClueIds: Object.freeze([...input.displayedClueIds]),
    minimalityProof: input.minimalityProof,
    independentVerifierResult: input.independentVerifierResult,
    diagramDisposition: input.diagramDisposition,
    diagramModel: input.diagramModel,
    stemSvg,
    solutionDiagramModel: input.solutionDiagramModel,
    solutionSvg,
    canonicalGeometryFingerprint: fingerprint([
      "GEO-CP-006",
      input.temporaryPrototypeId,
      input.sourceGapId,
      input.solveMode,
      input.seed,
      answer,
      input.theoremTrace.join(","),
      input.diagramDisposition,
      diagramFingerprint ?? "NO_STEM_DIAGRAM",
      solutionDiagramFingerprint,
    ]),
    diagramFingerprint,
    solutionDiagramFingerprint,
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
