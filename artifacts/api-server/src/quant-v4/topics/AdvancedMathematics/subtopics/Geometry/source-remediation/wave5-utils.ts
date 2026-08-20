import {
  diagramSemanticFingerprint,
  renderGeometrySvg,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import { buildExplanation, buildOptions, proveClueMinimality, seededShuffle } from "./wave1-utils";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave5Question, GapWave5VerifierResult } from "./wave5-types";
import type { GapWave5SourceEvidenceId } from "./wave5-source-evidence";

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
  return `GEO-GAP-W5-${hashText(parts.join("|")).toString(16).padStart(8, "0")}`;
}

export function approximate(value: number, expected: number, tolerance = 1e-8): boolean {
  return Math.abs(value - expected) <= tolerance;
}

export function pointDistance(a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function cross(a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>, c: Readonly<{ x: number; y: number }>): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

export function parallel(
  a: Readonly<{ x: number; y: number }>,
  b: Readonly<{ x: number; y: number }>,
  c: Readonly<{ x: number; y: number }>,
  d: Readonly<{ x: number; y: number }>,
): boolean {
  return approximate((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x), 0);
}

export function extractSvgLabelCollisionScores(svg: string): readonly number[] {
  return Object.freeze([...svg.matchAll(/data-label-collision-score="([0-9.]+)"/g)].map((match) => Number(match[1])));
}

export function wave5Verifier(
  oracle: GapWave5VerifierResult["oracle"],
  passed: boolean,
  checks: readonly string[],
): GapWave5VerifierResult {
  return Object.freeze({ oracle, passed, checks: Object.freeze([...checks]) });
}

export function finalizeGapWave5Question(input: Readonly<{
  temporaryPrototypeId: string;
  sourceGapId: string;
  sourceEvidenceIds: readonly GapWave5SourceEvidenceId[];
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
  independentVerifierResult: GapWave5VerifierResult;
  diagramModel: GeoDiagramModel;
}>): GapWave5Question {
  const answer = input.options[input.correctIndex];
  const errors: string[] = [];
  if (input.options.length !== 4) errors.push("OPTION_COUNT_NOT_FOUR");
  if (new Set(input.options).size !== input.options.length) errors.push("DUPLICATE_OPTIONS");
  if (input.optionAnalysis.filter((option) => option.correct).length !== 1) errors.push("CORRECT_OPTION_NOT_UNIQUE");
  if (!input.minimalityProof.passed) errors.push("CLUE_MINIMALITY_FAILED");
  if (!input.independentVerifierResult.passed) errors.push("INDEPENDENT_VERIFIER_FAILED");
  if (input.sourceEvidenceIds.length === 0) errors.push("SOURCE_EVIDENCE_MISSING");
  if (input.diagramModel.disclosure !== "STEM") errors.push("STEM_DIAGRAM_DISCLOSURE_INVALID");
  if (!input.diagramModel.notToScale) errors.push("GEOMETRY_NOT_TO_SCALE_REQUIRED");

  const stemSvg = renderGeometrySvg(input.diagramModel);
  if (!stemSvg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"')) errors.push("RENDERER_V2_REQUIRED");
  if (extractSvgLabelCollisionScores(stemSvg).some((score) => score > 0)) errors.push("DIAGRAM_LABEL_COLLISION");
  const diagramFingerprint = diagramSemanticFingerprint(input.diagramModel);

  return Object.freeze({
    packageId: "GEO-002",
    cpId: "GEO-CP-014",
    temporaryPrototypeId: input.temporaryPrototypeId,
    sourceGapId: input.sourceGapId,
    sourceEvidenceIds: Object.freeze([...input.sourceEvidenceIds]),
    permanentQlId: null,
    solveMode: input.solveMode,
    sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE5__GAP_REMEDIATION",
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
    diagramDisposition: "REQUIRED_STEM_DIAGRAM",
    diagramModel: input.diagramModel,
    stemSvg,
    canonicalGeometryFingerprint: fingerprint([
      "GEO-CP-014",
      input.temporaryPrototypeId,
      input.sourceGapId,
      input.solveMode,
      input.seed,
      answer,
      input.theoremTrace.join(","),
      diagramFingerprint,
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
