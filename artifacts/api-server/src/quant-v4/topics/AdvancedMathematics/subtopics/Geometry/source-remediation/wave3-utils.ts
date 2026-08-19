import {
  diagramSemanticFingerprint,
  renderGeometrySvg,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions,
  proveClueMinimality,
  seededShuffle,
} from "./wave1-utils";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type {
  DiagramDisposition,
  GapWave3Question,
  GapWave3VerifierResult,
} from "./wave3-types";
import type { GapWave3SourceEvidenceId } from "./wave3-source-evidence";

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
  return `GEO-GAP-W3-${hashText(parts.join("|")).toString(16).padStart(8, "0")}`;
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

export function approximate(value: number, expected: number, tolerance = 1e-7): boolean {
  return Math.abs(value - expected) <= tolerance;
}

export function remediationVerifier(
  oracle: GapWave3VerifierResult["oracle"],
  passed: boolean,
  checks: readonly string[],
): GapWave3VerifierResult {
  return Object.freeze({ passed, oracle, checks: Object.freeze([...checks]) });
}

export function extractSvgLabelCollisionScores(svg: string): readonly number[] {
  return Object.freeze([...svg.matchAll(/data-label-collision-score="([0-9.]+)"/g)].map((match) => Number(match[1])));
}

function expandAngleLabelRadii(model: GeoDiagramModel, expansion: number): GeoDiagramModel {
  if (expansion === 0 || model.angleMarks.length === 0) return model;
  return {
    ...model,
    angleMarks: model.angleMarks.map((mark) => ({
      ...mark,
      labelRadius: (mark.labelRadius ?? mark.radius ?? 18) + expansion,
    })),
  };
}

function resolveDiagramLabelCollisions(model: GeoDiagramModel): Readonly<{ model: GeoDiagramModel; svg: string }> {
  const expansions = [0, 8, 16, 24, 32, 40] as const;
  let lastModel = model;
  let lastSvg = renderGeometrySvg(model);

  for (const expansion of expansions) {
    const candidate = expandAngleLabelRadii(model, expansion);
    const svg = expansion === 0 ? lastSvg : renderGeometrySvg(candidate);
    lastModel = candidate;
    lastSvg = svg;
    if (!extractSvgLabelCollisionScores(svg).some((score) => score > 0)) {
      return Object.freeze({ model: candidate, svg });
    }
  }

  return Object.freeze({ model: lastModel, svg: lastSvg });
}

export function finalizeGapWave3Question(input: Readonly<{
  temporaryPrototypeId: string;
  sourceGapId: string;
  sourceEvidenceIds: readonly GapWave3SourceEvidenceId[];
  solveMode: string;
  difficulty: "Easy" | "Medium";
  seed: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  optionAnalysis: readonly MisconceptionOptionAnalysis[];
  explanation: Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }>;
  theoremTrace: readonly TheoremId[];
  proofEvents: GapWave3Question["proofEvents"];
  displayedClueIds: readonly string[];
  minimalityProof: ClueMinimalityProof;
  independentVerifierResult: GapWave3VerifierResult;
  diagramDisposition: DiagramDisposition;
  diagramModel?: GeoDiagramModel;
}>): GapWave3Question {
  const answer = input.options[input.correctIndex];
  const errors: string[] = [];
  if (new Set(input.options).size !== input.options.length) errors.push("DUPLICATE_OPTIONS");
  if (input.options.length !== 4) errors.push("OPTION_COUNT_NOT_FOUR");
  if (!input.minimalityProof.passed) errors.push("CLUE_MINIMALITY_FAILED");
  if (!input.independentVerifierResult.passed) errors.push("INDEPENDENT_VERIFIER_FAILED");
  if (input.optionAnalysis.filter((option) => option.correct).length !== 1) errors.push("CORRECT_OPTION_NOT_UNIQUE");
  if (input.sourceEvidenceIds.length === 0) errors.push("SOURCE_EVIDENCE_MISSING");

  const stemRequiresDiagram = input.diagramDisposition === "REQUIRED_STEM_DIAGRAM" || input.diagramDisposition === "REQUIRED_BOTH";
  const stemForbidsDiagram = input.diagramDisposition === "NO_DIAGRAM" || input.diagramDisposition === "REQUIRED_SOLUTION_DIAGRAM";
  if (stemRequiresDiagram && !input.diagramModel) errors.push("REQUIRED_STEM_DIAGRAM_MISSING");
  if (stemForbidsDiagram && input.diagramModel) errors.push("STEM_DIAGRAM_FORBIDDEN_BY_DISPOSITION");
  if (input.diagramModel && input.diagramModel.disclosure !== "STEM") errors.push("STEM_DIAGRAM_DISCLOSURE_INVALID");
  if (input.diagramModel && !input.diagramModel.notToScale) errors.push("GEOMETRY_V1_NOT_TO_SCALE_REQUIRED");

  const resolvedDiagram = input.diagramModel ? resolveDiagramLabelCollisions(input.diagramModel) : undefined;
  const diagramModel = resolvedDiagram?.model;
  const stemSvg = resolvedDiagram?.svg;
  if (stemSvg) {
    if (!stemSvg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"')) errors.push("RENDERER_V2_REQUIRED");
    if (extractSvgLabelCollisionScores(stemSvg).some((score) => score > 0)) errors.push("DIAGRAM_LABEL_COLLISION");
  }
  const diagramFingerprint = diagramModel ? diagramSemanticFingerprint(diagramModel) : null;

  return Object.freeze({
    packageId: "GEO-001" as const,
    cpId: "GEO-CP-006" as const,
    temporaryPrototypeId: input.temporaryPrototypeId,
    sourceGapId: input.sourceGapId,
    sourceEvidenceIds: Object.freeze([...input.sourceEvidenceIds]),
    permanentQlId: null,
    solveMode: input.solveMode,
    sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE3__GAP_REMEDIATION" as const,
    difficulty: input.difficulty,
    language: "en-IN" as const,
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
    diagramModel,
    stemSvg,
    canonicalGeometryFingerprint: fingerprint([
      "GEO-CP-006",
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
      stage: "DISCOVERY" as const,
      permanentQlAllocated: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
  });
}
