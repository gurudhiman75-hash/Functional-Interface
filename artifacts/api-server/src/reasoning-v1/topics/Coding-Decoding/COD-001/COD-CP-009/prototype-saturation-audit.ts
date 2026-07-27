import assert from "node:assert/strict";

import { COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS } from "./complete-candidate-set-contracts";
import { generateCompleteCandidateSetPrototypeQuestion } from "./complete-candidate-set-generator";
import { EXACT_SET_MISSING_PROTOTYPE_CONTRACTS } from "./exact-set-missing-contracts";
import { generateExactSetMissingPrototypeQuestion } from "./exact-set-missing-generator";
import { generateExactAtomicPrototypeQuestion } from "./exact-atomic-generator";
import { POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS } from "./possible-impossible-contracts";
import { generatePossibleImpossiblePrototypeQuestion } from "./possible-impossible-generator";
import { POSSIBLE_SET_PROTOTYPE_CONTRACTS } from "./possible-set-contracts";
import { generatePossibleSetPrototypeQuestion } from "./possible-set-generator";
import { EXACT_ATOMIC_PROTOTYPE_CONTRACTS } from "./prototype-contracts";
import { RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS } from "./resolved-composition-contracts";
import { generateResolvedCompositionPrototypeQuestion } from "./resolved-composition-generator";

const SEEDS_PER_PAIRING = 24;

const EXPECTED_PROTOTYPE_IDS = [
  "COD-CP009-PROT-EXACT-WORD-TO-TOKEN",
  "COD-CP009-PROT-EXACT-TOKEN-TO-WORD",
  "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS",
  "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE",
  "COD-CP009-PROT-MISSING-TOKEN",
  "COD-CP009-PROT-MISSING-WORD",
  "COD-CP009-PROT-POSSIBLE-WORD-TO-TOKEN",
  "COD-CP009-PROT-POSSIBLE-TOKEN-TO-WORD",
  "COD-CP009-PROT-IMPOSSIBLE-WORD-TO-TOKEN",
  "COD-CP009-PROT-IMPOSSIBLE-TOKEN-TO-WORD",
  "COD-CP009-PROT-POSSIBLE-WORD-SET-TO-TOKENS",
  "COD-CP009-PROT-POSSIBLE-TOKEN-SET-TO-WORDS",
  "COD-CP009-PROT-EXACT-RESOLVED-WORDS-TO-TOKENS",
  "COD-CP009-PROT-EXACT-RESOLVED-TOKENS-TO-WORDS",
  "COD-CP009-PROT-COMPLETE-CODE-CANDIDATE-SET",
  "COD-CP009-PROT-COMPLETE-WORD-CANDIDATE-SET",
] as const;

const EXPECTED_TOPOLOGY_KINDS = [
  "DIRECT_SINGLE_INTERSECTION",
  "CHAINED_SINGLETON_PROPAGATION",
  "SET_DIFFERENCE_ELIMINATION",
  "FORKED_EVIDENCE_JOIN",
  "GLOBAL_BIJECTION_DEDUCTION",
  "CONTROLLED_PARTIAL_INFORMATION",
  "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
  "PHRASE_SET_COMPOSITION",
  "MISSING_MEMBER_COMPLETION",
  "RESOLVED_COMPONENT_COMPOSITION",
] as const;

const INVERSE_PAIRS = [
  ["COD-CP009-PROT-EXACT-WORD-TO-TOKEN", "COD-CP009-PROT-EXACT-TOKEN-TO-WORD"],
  ["COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS", "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE"],
  ["COD-CP009-PROT-MISSING-TOKEN", "COD-CP009-PROT-MISSING-WORD"],
  ["COD-CP009-PROT-POSSIBLE-WORD-TO-TOKEN", "COD-CP009-PROT-POSSIBLE-TOKEN-TO-WORD"],
  ["COD-CP009-PROT-IMPOSSIBLE-WORD-TO-TOKEN", "COD-CP009-PROT-IMPOSSIBLE-TOKEN-TO-WORD"],
  ["COD-CP009-PROT-POSSIBLE-WORD-SET-TO-TOKENS", "COD-CP009-PROT-POSSIBLE-TOKEN-SET-TO-WORDS"],
  ["COD-CP009-PROT-EXACT-RESOLVED-WORDS-TO-TOKENS", "COD-CP009-PROT-EXACT-RESOLVED-TOKENS-TO-WORDS"],
  ["COD-CP009-PROT-COMPLETE-CODE-CANDIDATE-SET", "COD-CP009-PROT-COMPLETE-WORD-CANDIDATE-SET"],
] as const;

type FamilyName =
  | "EXACT_ATOMIC"
  | "EXACT_SET_OR_MISSING"
  | "POSSIBLE_OR_IMPOSSIBLE_ATOMIC"
  | "POSSIBLE_SET"
  | "RESOLVED_COMPOSITION"
  | "COMPLETE_CANDIDATE_SET";

interface QuestionLike {
  checkpointId: string;
  prototypeId: string;
  permanentQlId: null;
  prototypeOnly: boolean;
  publiclyPublishable: boolean;
  seed: number;
  topologyKind: string;
  answerType: string;
  stem: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  metadata: Readonly<Record<string, unknown>>;
}

interface AuditCase {
  family: FamilyName;
  prototypeId: string;
  topologyKind: string;
  solveModeFingerprint: string;
  run(seed: number): QuestionLike;
}

interface PairingResult {
  family: FamilyName;
  prototypeId: string;
  topologyKind: string;
  solveModeFingerprint: string;
  attempts: number;
  successes: number;
  distinctQuestions: number;
  distinctScenarioIds: number;
  answerPositions: number[];
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function optionSemanticValue(option: unknown): string {
  if (option === null || typeof option !== "object") return stableStringify(option);
  const record = option as Record<string, unknown>;
  for (const key of ["canonicalValue", "value", "answer", "label", "text"] as const) {
    if (key in record) return stableStringify(record[key]);
  }
  for (const key of ["tokens", "words", "members"] as const) {
    const candidate = record[key];
    if (Array.isArray(candidate)) return stableStringify([...candidate].sort());
  }
  return stableStringify(record);
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (value === null || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  const record = value as Record<string, unknown>;
  return Object.keys(record).sort().flatMap((key) => collectStrings(record[key]));
}

function normaliseTextSkeleton(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘'][^’']+[’']/g, "<quoted>")
    .replace(/\b\d+(?:\.\d+)?\b/g, "<number>")
    .replace(/\s+/g, " ")
    .trim();
}

function addCollisionCandidate(
  target: Map<string, Set<string>>,
  fingerprint: string,
  prototypeId: string,
): void {
  const owners = target.get(fingerprint) ?? new Set<string>();
  owners.add(prototypeId);
  target.set(fingerprint, owners);
}

const registryRows = [
  ...EXACT_ATOMIC_PROTOTYPE_CONTRACTS.map((contract) => ({ family: "EXACT_ATOMIC" as const, contract })),
  ...EXACT_SET_MISSING_PROTOTYPE_CONTRACTS.map((contract) => ({ family: "EXACT_SET_OR_MISSING" as const, contract })),
  ...POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS.map((contract) => ({ family: "POSSIBLE_OR_IMPOSSIBLE_ATOMIC" as const, contract })),
  ...POSSIBLE_SET_PROTOTYPE_CONTRACTS.map((contract) => ({ family: "POSSIBLE_SET" as const, contract })),
  ...RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS.map((contract) => ({ family: "RESOLVED_COMPOSITION" as const, contract })),
  ...COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS.map((contract) => ({ family: "COMPLETE_CANDIDATE_SET" as const, contract })),
];

assert.equal(registryRows.length, 16, "CP-009 must expose exactly the sixteen admitted prototype contracts");
const registeredIds = registryRows.map(({ contract }) => contract.prototypeId);
assert.equal(new Set(registeredIds).size, registeredIds.length, "Prototype IDs must be unique across all registries");
assert.deepEqual([...registeredIds].sort(), [...EXPECTED_PROTOTYPE_IDS].sort(), "Combined registry differs from the admitted sixteen-contract inventory");
for (const { contract } of registryRows) {
  assert.equal(contract.status, "PROTOTYPE", `${contract.prototypeId} must remain prototype-only before allocation`);
  assert.ok(!contract.prototypeId.startsWith("COD-QL-"), `${contract.prototypeId} must not masquerade as a permanent QL`);
}
for (const [forwardId, inverseId] of INVERSE_PAIRS) {
  assert.ok(registeredIds.includes(forwardId), `Missing forward contract ${forwardId}`);
  assert.ok(registeredIds.includes(inverseId), `Missing inverse contract ${inverseId}`);
}

const auditCases: AuditCase[] = [];

for (const contract of EXACT_ATOMIC_PROTOTYPE_CONTRACTS) {
  for (const topologyKind of contract.supportedTopologies) {
    auditCases.push({
      family: "EXACT_ATOMIC",
      prototypeId: contract.prototypeId,
      topologyKind,
      solveModeFingerprint: `${contract.prototypeId}:${topologyKind}`,
      run: (seed) => generateExactAtomicPrototypeQuestion(contract.prototypeId, seed, topologyKind) as QuestionLike,
    });
  }
}

for (const contract of EXACT_SET_MISSING_PROTOTYPE_CONTRACTS) {
  auditCases.push({
    family: "EXACT_SET_OR_MISSING",
    prototypeId: contract.prototypeId,
    topologyKind: contract.topologyKind,
    solveModeFingerprint: contract.prototypeId,
    run: (seed) => generateExactSetMissingPrototypeQuestion(contract.prototypeId, seed) as QuestionLike,
  });
}

for (const contract of POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS) {
  for (const topologyKind of contract.supportedTopologies) {
    auditCases.push({
      family: "POSSIBLE_OR_IMPOSSIBLE_ATOMIC",
      prototypeId: contract.prototypeId,
      topologyKind,
      solveModeFingerprint: contract.prototypeId,
      run: (seed) => generatePossibleImpossiblePrototypeQuestion(contract.prototypeId, seed, topologyKind) as QuestionLike,
    });
  }
}

for (const contract of POSSIBLE_SET_PROTOTYPE_CONTRACTS) {
  for (const topologyKind of contract.supportedTopologies) {
    auditCases.push({
      family: "POSSIBLE_SET",
      prototypeId: contract.prototypeId,
      topologyKind,
      solveModeFingerprint: contract.prototypeId,
      run: (seed) => generatePossibleSetPrototypeQuestion(contract.prototypeId, seed, topologyKind) as QuestionLike,
    });
  }
}

for (const contract of RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS) {
  auditCases.push({
    family: "RESOLVED_COMPOSITION",
    prototypeId: contract.prototypeId,
    topologyKind: "RESOLVED_COMPONENT_COMPOSITION",
    solveModeFingerprint: contract.prototypeId,
    run: (seed) => generateResolvedCompositionPrototypeQuestion(contract.prototypeId, seed) as QuestionLike,
  });
}

for (const contract of COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS) {
  for (const topologyKind of contract.supportedTopologies) {
    auditCases.push({
      family: "COMPLETE_CANDIDATE_SET",
      prototypeId: contract.prototypeId,
      topologyKind,
      solveModeFingerprint: contract.prototypeId,
      run: (seed) => generateCompleteCandidateSetPrototypeQuestion(contract.prototypeId, seed, topologyKind) as QuestionLike,
    });
  }
}

const topologyKinds = new Set(auditCases.map((entry) => entry.topologyKind));
assert.deepEqual([...topologyKinds].sort(), [...EXPECTED_TOPOLOGY_KINDS].sort(), "Combined audit must cover all ten proven topology families");
const solveModeFingerprints = new Set(auditCases.map((entry) => entry.solveModeFingerprint));
assert.equal(solveModeFingerprints.size, 24, "Merge/split audit must yield twenty-four provisional solve contracts");

const exactDisplayOwners = new Map<string, Set<string>>();
const normalisedStemOwners = new Map<string, Set<string>>();
const normalisedExplanationOwners = new Map<string, Set<string>>();
const pairingResults: PairingResult[] = [];
let generatedQuestions = 0;

for (const auditCase of auditCases) {
  const exactQuestionFingerprints = new Set<string>();
  const scenarioIds = new Set<string>();
  const answerPositions = new Set<number>();
  const errors: string[] = [];

  for (let seed = 1; seed <= SEEDS_PER_PAIRING; seed += 1) {
    try {
      const question = auditCase.run(seed);
      generatedQuestions += 1;

      assert.equal(question.checkpointId, "COD-CP-009");
      assert.equal(question.prototypeId, auditCase.prototypeId);
      assert.equal(question.permanentQlId, null);
      assert.equal(question.prototypeOnly, true);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.seed, seed);
      assert.equal(question.topologyKind, auditCase.topologyKind);
      assert.ok(question.stem.trim().length > 0, `${question.prototypeId}/${seed} has an empty stem`);
      assert.equal(question.options.length, 4, `${question.prototypeId}/${seed} must have four options`);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length, `${question.prototypeId}/${seed} has an invalid correct index`);

      const optionValues = question.options.map(optionSemanticValue);
      assert.equal(new Set(optionValues).size, 4, `${question.prototypeId}/${seed} has duplicate semantic options`);
      answerPositions.add(question.correctIndex);

      const scenarioId = question.metadata.scenarioId;
      if (typeof scenarioId === "string") scenarioIds.add(scenarioId);

      const displayFingerprint = stableStringify({
        stem: question.stem,
        structuredPrompt: question.structuredPrompt,
        options: optionValues,
      });
      exactQuestionFingerprints.add(displayFingerprint);
      addCollisionCandidate(exactDisplayOwners, displayFingerprint, question.prototypeId);
      addCollisionCandidate(normalisedStemOwners, normaliseTextSkeleton(question.stem), question.prototypeId);

      const explanationText = collectStrings(question.explanation).join(" | ");
      assert.ok(explanationText.trim().length > 0, `${question.prototypeId}/${seed} has no explanation text`);
      addCollisionCandidate(normalisedExplanationOwners, normaliseTextSkeleton(explanationText), question.prototypeId);
    } catch (error) {
      errors.push(`seed ${seed}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  assert.deepEqual(errors, [], `${auditCase.prototypeId}/${auditCase.topologyKind} failed bounded generation:\n${errors.join("\n")}`);
  assert.equal(exactQuestionFingerprints.size, SEEDS_PER_PAIRING, `${auditCase.prototypeId}/${auditCase.topologyKind} repeated a complete displayed question within ${SEEDS_PER_PAIRING} seeds`);
  assert.ok(scenarioIds.size >= 3, `${auditCase.prototypeId}/${auditCase.topologyKind} reached fewer than three English scenarios`);
  assert.ok(answerPositions.size >= 3, `${auditCase.prototypeId}/${auditCase.topologyKind} reached fewer than three answer positions`);

  pairingResults.push({
    family: auditCase.family,
    prototypeId: auditCase.prototypeId,
    topologyKind: auditCase.topologyKind,
    solveModeFingerprint: auditCase.solveModeFingerprint,
    attempts: SEEDS_PER_PAIRING,
    successes: SEEDS_PER_PAIRING,
    distinctQuestions: exactQuestionFingerprints.size,
    distinctScenarioIds: scenarioIds.size,
    answerPositions: [...answerPositions].sort((left, right) => left - right),
  });
}

function crossPrototypeCollisions(source: Map<string, Set<string>>): { fingerprint: string; owners: string[] }[] {
  return [...source.entries()]
    .filter(([, owners]) => owners.size > 1)
    .map(([fingerprint, owners]) => ({ fingerprint, owners: [...owners].sort() }));
}

const exactDisplayCollisions = crossPrototypeCollisions(exactDisplayOwners);
const normalisedStemCollisions = crossPrototypeCollisions(normalisedStemOwners);
const normalisedExplanationCollisions = crossPrototypeCollisions(normalisedExplanationOwners);

assert.deepEqual(exactDisplayCollisions, [], "Different prototype contracts emitted the same complete displayed question");
assert.deepEqual(normalisedStemCollisions, [], "Different prototype contracts share a normalised query-stem skeleton");
assert.deepEqual(normalisedExplanationCollisions, [], "Different prototype contracts share a normalised full-explanation skeleton");

const report = {
  checkpointId: "COD-CP-009",
  status: "COMBINED_PROTOTYPE_SATURATION_AUDIT_PASSED",
  permanentQlIdsAllocated: 0,
  registeredPrototypeContracts: registeredIds.length,
  inversePairs: INVERSE_PAIRS.length,
  topologyFamilies: topologyKinds.size,
  provisionalSolveContractsAfterMergeSplit: solveModeFingerprints.size,
  generatorPairings: auditCases.length,
  seedsPerPairing: SEEDS_PER_PAIRING,
  generatedQuestions,
  boundedGenerationFailures: 0,
  crossPrototypeExactDisplayCollisions: exactDisplayCollisions.length,
  crossPrototypeNormalisedStemCollisions: normalisedStemCollisions.length,
  crossPrototypeNormalisedExplanationCollisions: normalisedExplanationCollisions.length,
  mergeSplitDecisions: {
    exactAtomicTopologies: "SPLIT_INTO_FIVE_SOLVE_MODES_PER_DIRECTION",
    encodeVersusInverse: "SPLIT",
    exactVersusPossibleVersusImpossible: "SPLIT",
    atomicVersusSetAnswer: "SPLIT",
    ordinaryVersusMissingMember: "SPLIT",
    possibleMemberVersusCompleteCandidateDomain: "SPLIT",
    invariantAmbiguousSetVersusResolvedComposition: "SPLIT",
    twoWayVersusThreeWayUncertainty: "MERGE_AS_INSTANCE_WIDTH",
    statementCount: "MERGE_AS_INSTANCE_PARAMETER",
  },
  pairingResults,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
