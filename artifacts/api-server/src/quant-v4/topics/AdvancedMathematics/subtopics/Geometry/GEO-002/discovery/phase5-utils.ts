import { diagramSemanticFingerprint, renderGeometrySvg, type GeoDiagramModel, type TheoremId } from "../../../../../../shared/geometry";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../../GEO-001/discovery/phase1-types";
import {
  approximate,
  buildExplanation,
  buildOptions,
  numericAngleDegrees,
  proveClueMinimality,
  seededShuffle,
  verifier,
} from "./phase4-utils";
import type { Phase5CheckpointId, Phase5Difficulty, Phase5PrototypeQuestion } from "./phase5-types";

export { approximate, buildExplanation, buildOptions, numericAngleDegrees, proveClueMinimality, seededShuffle, verifier };

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function finalizePhase5Question(input: Readonly<{
  cpId: Phase5CheckpointId;
  temporaryPrototypeId: string;
  solveMode: string;
  difficulty: Phase5Difficulty;
  seed: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  optionAnalysis: readonly MisconceptionOptionAnalysis[];
  explanation: Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }>;
  theoremTrace: readonly TheoremId[];
  proofEvents: Phase5PrototypeQuestion["proofEvents"];
  displayedClueIds: readonly string[];
  minimalityProof: ClueMinimalityProof;
  independentVerifierResult: Phase5PrototypeQuestion["independentVerifierResult"];
  diagramModel?: GeoDiagramModel;
}>): Phase5PrototypeQuestion {
  const answer = input.options[input.correctIndex];
  const errors: string[] = [];
  if (new Set(input.options).size !== input.options.length) errors.push("DUPLICATE_OPTIONS");
  if (input.options.length !== 4) errors.push("OPTION_COUNT_NOT_FOUR");
  if (!input.minimalityProof.passed) errors.push("CLUE_MINIMALITY_FAILED");
  if (!input.independentVerifierResult.passed) errors.push("INDEPENDENT_VERIFIER_FAILED");
  if (input.optionAnalysis.filter((option) => option.correct).length !== 1) errors.push("CORRECT_OPTION_NOT_UNIQUE");
  const stemSvg = input.diagramModel ? renderGeometrySvg(input.diagramModel) : undefined;
  const diagramFingerprint = input.diagramModel ? diagramSemanticFingerprint(input.diagramModel) : null;
  const normalized = [input.cpId, input.temporaryPrototypeId, input.solveMode, input.seed, answer, input.theoremTrace.join(","), diagramFingerprint ?? "NO_DIAGRAM"].join("|");
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
    canonicalGeometryFingerprint: `GEO-DISC-P5-${hashText(normalized).toString(16).padStart(8, "0")}`,
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
