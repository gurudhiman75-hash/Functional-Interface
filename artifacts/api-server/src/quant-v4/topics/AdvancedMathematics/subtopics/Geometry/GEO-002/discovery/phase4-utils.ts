import {
  diagramSemanticFingerprint,
  renderGeometrySvg,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../../shared/geometry";
import { buildExplanation, buildOptions, proveClueMinimality, seededShuffle } from "../../GEO-001/discovery/phase1-utils";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../../GEO-001/discovery/phase1-types";
import type { Phase4CheckpointId, Phase4Difficulty, Phase4PrototypeQuestion, Phase4VerifierResult } from "./phase4-types";

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
  return `GEO-DISC-P4-${hashText(parts.join("|")).toString(16).padStart(8, "0")}`;
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
  const dot = ax * bx + ay * by;
  const denominator = Math.hypot(ax, ay) * Math.hypot(bx, by);
  if (denominator === 0) throw new Error("Cannot measure angle with a zero-length ray");
  const cosine = Math.max(-1, Math.min(1, dot / denominator));
  return Math.acos(cosine) * 180 / Math.PI;
}

export function approximate(value: number, expected: number, tolerance = 1e-8): boolean {
  return Math.abs(value - expected) <= tolerance;
}

export function verifier(
  oracle: Phase4VerifierResult["oracle"],
  passed: boolean,
  checks: readonly string[],
): Phase4VerifierResult {
  return Object.freeze({ passed, oracle, checks: Object.freeze([...checks]) });
}

export function finalizePhase4Question(input: Readonly<{
  cpId: Phase4CheckpointId;
  temporaryPrototypeId: string;
  solveMode: string;
  difficulty: Phase4Difficulty;
  seed: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  optionAnalysis: readonly MisconceptionOptionAnalysis[];
  explanation: Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }>;
  theoremTrace: readonly TheoremId[];
  proofEvents: Phase4PrototypeQuestion["proofEvents"];
  displayedClueIds: readonly string[];
  minimalityProof: ClueMinimalityProof;
  independentVerifierResult: Phase4VerifierResult;
  diagramModel?: GeoDiagramModel;
}>): Phase4PrototypeQuestion {
  const answer = input.options[input.correctIndex];
  const errors: string[] = [];
  if (new Set(input.options).size !== input.options.length) errors.push("DUPLICATE_OPTIONS");
  if (input.options.length !== 4) errors.push("OPTION_COUNT_NOT_FOUR");
  if (!input.minimalityProof.passed) errors.push("CLUE_MINIMALITY_FAILED");
  if (!input.independentVerifierResult.passed) errors.push("INDEPENDENT_VERIFIER_FAILED");
  if (input.optionAnalysis.filter((option) => option.correct).length !== 1) errors.push("CORRECT_OPTION_NOT_UNIQUE");
  const stemSvg = input.diagramModel ? renderGeometrySvg(input.diagramModel) : undefined;
  const diagramFingerprint = input.diagramModel ? diagramSemanticFingerprint(input.diagramModel) : null;
  return Object.freeze({
    packageId: "GEO-002",
    cpId: input.cpId,
    temporaryPrototypeId: input.temporaryPrototypeId,
    permanentQlId: null,
    solveMode: input.solveMode,
    sourceStatus: "AUTHORITY_SEEDED__EXTERNAL_SOURCE_AUDIT_OPEN",
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
    diagramModel: input.diagramModel,
    stemSvg,
    canonicalGeometryFingerprint: fingerprint([
      input.cpId,
      input.temporaryPrototypeId,
      input.solveMode,
      input.seed,
      answer,
      input.theoremTrace.join(","),
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
