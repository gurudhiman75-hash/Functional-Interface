import {
  diagramSemanticFingerprint,
  renderGeometrySvg,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  buildExplanation,
  buildOptions as baseBuildOptions,
  proveClueMinimality,
  seededShuffle,
} from "./wave1-utils";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave7CheckpointId, GapWave7Question, GapWave7VerifierResult } from "./wave7-types";
import type { GapWave7SourceEvidenceId } from "./wave7-source-evidence";

export { buildExplanation, proveClueMinimality, seededShuffle };

type WrongCandidate = Readonly<{ text: string; misconceptionId: string; rationale: string }>;

export function buildOptions(correctText: string, wrongCandidates: readonly WrongCandidate[], seed: string) {
  const candidates = [...wrongCandidates];
  const uniqueTexts = new Set([correctText, ...candidates.map((candidate) => candidate.text)]);
  const match = correctText.match(/^(-?\d+(?:\.\d+)?)(°| cm)$/);
  if (uniqueTexts.size < 4 && match) {
    const value = Number(match[1]);
    const unit = match[2];
    for (const offset of [13, 17, 23]) {
      const text = `${value + offset}${unit}`;
      if (uniqueTexts.has(text)) continue;
      candidates.push({
        text,
        misconceptionId: "ADDED_OFFSET_INSTEAD_OF_USING_EQUALITY",
        rationale: "Adds an unrelated offset instead of applying the required equality relation.",
      });
      uniqueTexts.add(text);
      if (uniqueTexts.size >= 4) break;
    }
  }
  return baseBuildOptions(correctText, candidates, seed);
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function fingerprint(parts: readonly string[]): string {
  return `GEO-GAP-W7-${hashText(parts.join("|")).toString(16).padStart(8, "0")}`;
}

export function approximate(value: number, expected: number, tolerance = 1e-7): boolean {
  return Math.abs(value - expected) <= tolerance;
}

export function extractSvgLabelCollisionScores(svg: string): readonly number[] {
  return Object.freeze([...svg.matchAll(/data-label-collision-score="([0-9.]+)"/g)].map((match) => Number(match[1])));
}

export function wave7Verifier(
  oracle: GapWave7VerifierResult["oracle"],
  passed: boolean,
  checks: readonly string[],
): GapWave7VerifierResult {
  return Object.freeze({ oracle, passed, checks: Object.freeze([...checks]) });
}

export function finalizeGapWave7Question(input: Readonly<{
  cpId: GapWave7CheckpointId;
  temporaryPrototypeId: string;
  sourceGapId: string;
  sourceEvidenceIds: readonly GapWave7SourceEvidenceId[];
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
  independentVerifierResult: GapWave7VerifierResult;
  diagramModel: GeoDiagramModel;
  solutionDiagramModel: GeoDiagramModel;
}>): GapWave7Question {
  const answer = input.options[input.correctIndex];
  const errors: string[] = [];
  if (input.options.length !== 4) errors.push("OPTION_COUNT_NOT_FOUR");
  if (new Set(input.options).size !== input.options.length) errors.push("DUPLICATE_OPTIONS");
  if (input.optionAnalysis.filter((option) => option.correct).length !== 1) errors.push("CORRECT_OPTION_NOT_UNIQUE");
  if (!input.minimalityProof.passed) errors.push("CLUE_MINIMALITY_FAILED");
  if (!input.independentVerifierResult.passed) errors.push("INDEPENDENT_VERIFIER_FAILED");
  if (input.sourceEvidenceIds.length === 0) errors.push("SOURCE_EVIDENCE_MISSING");
  if (input.diagramModel.disclosure !== "STEM") errors.push("STEM_DIAGRAM_DISCLOSURE_INVALID");
  if (input.solutionDiagramModel.disclosure !== "SOLUTION") errors.push("SOLUTION_DIAGRAM_DISCLOSURE_INVALID");
  if (!input.diagramModel.notToScale) errors.push("STEM_NOT_TO_SCALE_REQUIRED");
  if (!input.solutionDiagramModel.notToScale) errors.push("SOLUTION_NOT_TO_SCALE_REQUIRED");

  const stemSvg = renderGeometrySvg(input.diagramModel);
  const solutionSvg = renderGeometrySvg(input.solutionDiagramModel);
  if (!stemSvg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"')) errors.push("STEM_RENDERER_V2_REQUIRED");
  if (!solutionSvg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"')) errors.push("SOLUTION_RENDERER_V2_REQUIRED");
  if (extractSvgLabelCollisionScores(stemSvg).some((score) => score > 0)) errors.push("STEM_DIAGRAM_LABEL_COLLISION");
  if (extractSvgLabelCollisionScores(solutionSvg).some((score) => score > 0)) errors.push("SOLUTION_DIAGRAM_LABEL_COLLISION");

  const diagramFingerprint = diagramSemanticFingerprint(input.diagramModel);
  const solutionDiagramFingerprint = diagramSemanticFingerprint(input.solutionDiagramModel);
  if (diagramFingerprint === solutionDiagramFingerprint) errors.push("STEM_SOLUTION_FINGERPRINTS_MUST_DIFFER");

  return Object.freeze({
    packageId: "GEO-002",
    cpId: input.cpId,
    temporaryPrototypeId: input.temporaryPrototypeId,
    sourceGapId: input.sourceGapId,
    sourceEvidenceIds: Object.freeze([...input.sourceEvidenceIds]),
    permanentQlId: null,
    solveMode: input.solveMode,
    sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE7__GAP_REMEDIATION",
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
    diagramDisposition: "REQUIRED_BOTH",
    diagramModel: input.diagramModel,
    stemSvg,
    solutionDiagramModel: input.solutionDiagramModel,
    solutionSvg,
    canonicalGeometryFingerprint: fingerprint([
      input.cpId, input.temporaryPrototypeId, input.sourceGapId, input.solveMode, input.seed,
      answer, input.theoremTrace.join(","), diagramFingerprint, solutionDiagramFingerprint,
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
