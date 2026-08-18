import {
  diagramSemanticFingerprint,
  getTheoremDefinition,
  renderGeometrySvg,
  toNumber,
  type GeoDiagramModel,
  type Rational,
  type TheoremId,
} from "../../../../../../shared/geometry";
import type {
  ClueMinimalityProof,
  IndependentVerifierResult,
  MisconceptionOptionAnalysis,
  Phase1CheckpointId,
  Phase1Difficulty,
  Phase1PrototypeQuestion,
} from "./phase1-types";

export interface WrongOptionCandidate {
  readonly text: string;
  readonly misconceptionId: string;
  readonly rationale: string;
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededShuffle<T>(values: readonly T[], seed: string): readonly T[] {
  const output = [...values];
  let state = hashText(seed) || 1;
  for (let index = output.length - 1; index > 0; index -= 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const swapIndex = (state >>> 0) % (index + 1);
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return Object.freeze(output);
}

export function formatExact(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const numeric = toNumber(value);
  return Number.isInteger(numeric) ? String(numeric) : String(Number(numeric.toFixed(6)));
}

export function formatAngle(value: Rational): string {
  return `${formatExact(value)}°`;
}

export function buildOptions(
  correctText: string,
  wrongCandidates: readonly WrongOptionCandidate[],
  seed: string,
): Readonly<{
  options: readonly string[];
  correctIndex: number;
  optionAnalysis: readonly MisconceptionOptionAnalysis[];
}> {
  const records: MisconceptionOptionAnalysis[] = [{
    text: correctText,
    misconceptionId: null,
    rationale: "Correct theorem application.",
    correct: true,
  }];
  for (const candidate of wrongCandidates) {
    if (records.some((record) => record.text === candidate.text)) continue;
    records.push({ ...candidate, correct: false });
  }
  if (records.length < 4) throw new Error(`Prototype has fewer than four unique semantic options: ${correctText}`);
  const shuffled = seededShuffle(records.slice(0, 4), `${seed}:options`);
  const correctIndex = shuffled.findIndex((record) => record.correct);
  if (correctIndex < 0) throw new Error("Correct option disappeared during deterministic shuffle");
  return Object.freeze({
    options: Object.freeze(shuffled.map((record) => record.text)),
    correctIndex,
    optionAnalysis: Object.freeze(shuffled),
  });
}

export function proveClueMinimality(
  clueIds: readonly string[],
  solveFromClues: (activeClueIds: ReadonlySet<string>) => string | null,
  expectedOutcome: string,
): ClueMinimalityProof {
  const fullSet = new Set(clueIds);
  const fullOutcome = solveFromClues(fullSet);
  if (fullOutcome !== expectedOutcome) {
    throw new Error(`Full clue set does not solve to expected outcome: ${fullOutcome} vs ${expectedOutcome}`);
  }
  const attempts = clueIds.map((removedClueId) => {
    const active = new Set(clueIds.filter((clueId) => clueId !== removedClueId));
    const outcome = solveFromClues(active);
    return Object.freeze({
      removedClueId,
      outcome,
      changedSolutionPolicy: outcome !== expectedOutcome,
    });
  });
  return Object.freeze({
    fullOutcome,
    clueIds: Object.freeze([...clueIds]),
    attempts: Object.freeze(attempts),
    passed: attempts.every((attempt) => attempt.changedSolutionPolicy),
  });
}

function fingerprint(parts: readonly string[]): string {
  const normalized = parts.join("|");
  return `GEO-DISC-${hashText(normalized).toString(16).padStart(8, "0")}`;
}

export function buildExplanation(
  theoremTrace: readonly TheoremId[],
  lines: readonly string[],
): Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }> {
  return Object.freeze({
    lines: Object.freeze([...lines]),
    theoremNames: Object.freeze(theoremTrace.map((id) => getTheoremDefinition(id).learnerName)),
  });
}

export function passedVerifier(
  oracle: IndependentVerifierResult["oracle"],
  checks: readonly string[],
): IndependentVerifierResult {
  return Object.freeze({ passed: true, oracle, checks: Object.freeze([...checks]) });
}

export function finalizeQuestion(input: Readonly<{
  cpId: Phase1CheckpointId;
  temporaryPrototypeId: string;
  solveMode: string;
  difficulty: Phase1Difficulty;
  seed: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  optionAnalysis: readonly MisconceptionOptionAnalysis[];
  explanation: Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }>;
  theoremTrace: readonly TheoremId[];
  proofEvents: Phase1PrototypeQuestion["proofEvents"];
  displayedClueIds: readonly string[];
  minimalityProof: ClueMinimalityProof;
  independentVerifierResult: IndependentVerifierResult;
  diagramModel?: GeoDiagramModel;
}>): Phase1PrototypeQuestion {
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
    packageId: "GEO-001",
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
