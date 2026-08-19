import type { Rational, TheoremId } from "../../../../../shared/geometry";
import { buildExplanation, buildOptions, proveClueMinimality, seededShuffle } from "./wave1-utils";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave4Question, GapWave4VerifierResult } from "./wave4-types";
import type { GapWave4SourceEvidenceId } from "./wave4-source-evidence";

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
  return `GEO-GAP-W4-${hashText(parts.join("|")).toString(16).padStart(8, "0")}`;
}

export function rationalNumber(value: Rational): number {
  return Number(value.numerator) / Number(value.denominator);
}

export function wholeNumberText(value: Rational, unit = "cm"): string {
  if (value.denominator !== 1n) throw new Error("Wave 4 review fixtures require whole-number answers");
  return `${value.numerator.toString()} ${unit}`;
}

export function wave4Verifier(passed: boolean, checks: readonly string[]): GapWave4VerifierResult {
  return Object.freeze({ oracle: "INDEPENDENT_DEFINITION_CHECK", passed, checks: Object.freeze([...checks]) });
}

export function finalizeGapWave4Question(input: Readonly<{
  temporaryPrototypeId: string;
  sourceGapId: string;
  sourceEvidenceIds: readonly GapWave4SourceEvidenceId[];
  solveMode: string;
  difficulty: "Easy" | "Medium";
  seed: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  optionAnalysis: readonly MisconceptionOptionAnalysis[];
  explanation: Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }>;
  theoremTrace: readonly TheoremId[];
  displayedClueIds: readonly string[];
  minimalityProof: ClueMinimalityProof;
  independentVerifierResult: GapWave4VerifierResult;
}>): GapWave4Question {
  const answer = input.options[input.correctIndex];
  const errors: string[] = [];
  if (input.options.length !== 4) errors.push("OPTION_COUNT_NOT_FOUR");
  if (new Set(input.options).size !== input.options.length) errors.push("DUPLICATE_OPTIONS");
  if (input.optionAnalysis.filter((option) => option.correct).length !== 1) errors.push("CORRECT_OPTION_NOT_UNIQUE");
  if (!input.minimalityProof.passed) errors.push("CLUE_MINIMALITY_FAILED");
  if (!input.independentVerifierResult.passed) errors.push("INDEPENDENT_VERIFIER_FAILED");
  if (input.sourceEvidenceIds.length === 0) errors.push("SOURCE_EVIDENCE_MISSING");

  return Object.freeze({
    packageId: "GEO-001",
    cpId: "GEO-CP-005",
    temporaryPrototypeId: input.temporaryPrototypeId,
    sourceGapId: input.sourceGapId,
    sourceEvidenceIds: Object.freeze([...input.sourceEvidenceIds]),
    permanentQlId: null,
    solveMode: input.solveMode,
    sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE4__GAP_REMEDIATION",
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
    proofEvents: Object.freeze([]),
    displayedClueIds: Object.freeze([...input.displayedClueIds]),
    minimalityProof: input.minimalityProof,
    independentVerifierResult: input.independentVerifierResult,
    diagramDisposition: "NO_DIAGRAM",
    canonicalGeometryFingerprint: fingerprint([
      "GEO-CP-005",
      input.temporaryPrototypeId,
      input.sourceGapId,
      input.solveMode,
      input.seed,
      answer,
      input.theoremTrace.join(","),
      "NO_DIAGRAM",
    ]),
    diagramFingerprint: null,
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
