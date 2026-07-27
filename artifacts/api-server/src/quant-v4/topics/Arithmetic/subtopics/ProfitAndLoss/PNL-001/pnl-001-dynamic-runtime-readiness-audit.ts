import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  listPnl001CanonicalReviewEntries,
  PNL_001_CP_IDS,
} from "./question-studio-review-runtime";

type RegistryEntry = Readonly<{
  solveMode: string;
  answerSemantic: string;
  requiredVariables?: readonly string[];
  difficulty: "Easy" | "Medium" | "Hard";
  representation?: string;
}>;

type RegistryFile = Readonly<{
  archetypeId: "PNL-001";
  cpId: string;
  entries: Readonly<Record<string, RegistryEntry>>;
}>;

type ParameterStatus = "PARTIAL_FOUNDATION_ONLY" | "MISSING_QL_DISPATCH";

type CpReadiness = Readonly<{
  cpId: string;
  qlCount: number;
  uniqueSolveModes: number;
  uniqueAnswerSemantics: number;
  structuredQlCount: number;
  averageRequiredVariables: number;
  maximumRequiredVariables: number;
  solverProof: "PROVEN";
  canonicalReviewPackage: "READY";
  seededParameterGeneration: ParameterStatus;
  qlSpecificParameterDispatcher: "MISSING";
  dynamicStemBinding: "MISSING";
  dynamicDistractorDispatcher: "MISSING";
  dynamicIndependentVerificationBridge: "MISSING";
  dynamicQuestionPackage: "MISSING";
  fullyDynamicQlCount: 0;
  recommendedWave: number;
  recommendedStrategy: string;
}>;

const bundledRoot = dirname(fileURLToPath(import.meta.url));
const pnlRoot = join(bundledRoot, "..");
const quantV4Root = join(pnlRoot, "../../../../../");

function readText(path: string) {
  return readFileSync(path, "utf8");
}

function readRegistry(cpNumber: number): RegistryFile {
  const cp = `CP-${String(cpNumber).padStart(3, "0")}`;
  return JSON.parse(
    readText(join(pnlRoot, cp, "task-registry.library.json")),
  ) as RegistryFile;
}

const registries = Array.from({ length: 6 }, (_, index) => readRegistry(index + 1));
const allEntries = registries.flatMap((registry) =>
  Object.entries(registry.entries).map(([qlId, entry]) => ({
    qlId,
    cpId: registry.cpId,
    ...entry,
    requiredVariables: entry.requiredVariables ?? [],
  })),
);
const canonicalEntries = listPnl001CanonicalReviewEntries();

assert.equal(allEntries.length, 186, "Expected 186 registry entries.");
assert.equal(canonicalEntries.length, 186, "Expected 186 canonical review entries.");
assert.deepEqual(
  allEntries.map((entry) => entry.qlId),
  Array.from({ length: 186 }, (_, index) =>
    `PNL-QL-${String(index + 1).padStart(3, "0")}`,
  ),
  "Registry QLs must remain contiguous.",
);
assert.deepEqual(
  canonicalEntries.map((entry) => entry.qlId),
  allEntries.map((entry) => entry.qlId),
  "Canonical review and registry inventories must match exactly.",
);

const parameterGeneratorSource = readText(
  join(pnlRoot, "foundation", "parameter-generator.ts"),
);
const foundationPipelineSource = readText(
  join(pnlRoot, "foundation", "pipeline.ts"),
);
const distractorSource = readText(
  join(pnlRoot, "foundation", "distractor-builder.ts"),
);
const reviewRuntimeSource = readText(
  join(pnlRoot, "question-studio-review-runtime.ts"),
);
const sharedGenerationSource = readText(join(quantV4Root, "generation-engine.ts"));

assert.match(parameterGeneratorSource, /generateFundamentalParameters/);
assert.match(parameterGeneratorSource, /costPrice/);
assert.match(parameterGeneratorSource, /ratePercent/);
assert.match(parameterGeneratorSource, /direction/);
assert.doesNotMatch(parameterGeneratorSource, /questionLanguageId|qlId|solveMode/,
  "The current seeded generator must not be mistaken for a QL dispatcher.");
assert.match(foundationPipelineSource, /runFundamentalPipeline/);
assert.doesNotMatch(foundationPipelineSource, /questionLanguageId|qlId/,
  "The current fundamental pipeline is not QL-addressable.");
assert.match(distractorSource, /buildMoneyDistractors/);
assert.match(distractorSource, /buildRateDistractors/);
assert.doesNotMatch(distractorSource, /answerSemantic|questionLanguageId|solveMode/,
  "The current distractor helpers are not a chapter-wide misconception dispatcher.");
assert.match(reviewRuntimeSource, /CANONICAL_REVIEW/);
assert.match(sharedGenerationSource, /runtimeMode:\s*"CANONICAL_REVIEW"/);
assert.doesNotMatch(sharedGenerationSource, /PNL_DYNAMIC|runPnl001DynamicPipeline/,
  "No dynamic PNL package should be claimed before implementation.");

const expectedCpCounts = new Map<string, number>([
  ["PNL-CP-001", 36],
  ["PNL-CP-002", 34],
  ["PNL-CP-003", 24],
  ["PNL-CP-004", 26],
  ["PNL-CP-005", 29],
  ["PNL-CP-006", 37],
]);

const implementationPlan = new Map<string, {
  wave: number;
  parameterStatus: ParameterStatus;
  strategy: string;
}>([
  ["PNL-CP-001", {
    wave: 1,
    parameterStatus: "PARTIAL_FOUNDATION_ONLY",
    strategy: "Expand the existing seeded fundamental generator into a QL-addressable dispatcher; add derived-input construction, answer-semantic formatting, misconception routing and package emission for all 36 QLs.",
  }],
  ["PNL-CP-002", {
    wave: 2,
    parameterStatus: "MISSING_QL_DISPATCH",
    strategy: "Build exact marked-price, discount, promotion, coupon, cashback and eligibility parameter families around the existing solver modules, with conditional-domain and offer-comparison guards.",
  }],
  ["PNL-CP-004", {
    wave: 3,
    parameterStatus: "MISSING_QL_DISPATCH",
    strategy: "Add transaction-chain and fee/commission generators with exact forward/reverse construction, missing-stage recovery and ledger/table bindings.",
  }],
  ["PNL-CP-005", {
    wave: 4,
    parameterStatus: "MISSING_QL_DISPATCH",
    strategy: "Add dishonest-trade generators for billed versus delivered quantity, buying/selling measure combinations and consumer-impact answer semantics, using explicit misconception contracts.",
  }],
  ["PNL-CP-003", {
    wave: 5,
    parameterStatus: "MISSING_QL_DISPATCH",
    strategy: "Add aggregate inventory, damaged/remaining-stock, equal-price, lot/table and data-sufficiency generators with weighted-total and uniqueness constraints.",
  }],
  ["PNL-CP-006", {
    wave: 6,
    parameterStatus: "MISSING_QL_DISPATCH",
    strategy: "Add effective-cost, manufacturing, contribution, break-even and recovery generators last because they combine the widest parameter domains, representations and eligibility constraints.",
  }],
]);

const cpReadiness: CpReadiness[] = PNL_001_CP_IDS.map((cpId) => {
  const cpEntries = allEntries.filter((entry) => entry.cpId === cpId);
  const plan = implementationPlan.get(cpId);
  assert.ok(plan, `Missing implementation plan for ${cpId}.`);
  assert.equal(cpEntries.length, expectedCpCounts.get(cpId), `${cpId} count mismatch.`);

  const variableCounts = cpEntries.map((entry) => entry.requiredVariables.length);
  return {
    cpId,
    qlCount: cpEntries.length,
    uniqueSolveModes: new Set(cpEntries.map((entry) => entry.solveMode)).size,
    uniqueAnswerSemantics: new Set(cpEntries.map((entry) => entry.answerSemantic)).size,
    structuredQlCount: cpEntries.filter((entry) => Boolean(entry.representation)).length,
    averageRequiredVariables:
      Math.round((variableCounts.reduce((sum, count) => sum + count, 0) / cpEntries.length) * 100) / 100,
    maximumRequiredVariables: Math.max(...variableCounts),
    solverProof: "PROVEN",
    canonicalReviewPackage: "READY",
    seededParameterGeneration: plan.parameterStatus,
    qlSpecificParameterDispatcher: "MISSING",
    dynamicStemBinding: "MISSING",
    dynamicDistractorDispatcher: "MISSING",
    dynamicIndependentVerificationBridge: "MISSING",
    dynamicQuestionPackage: "MISSING",
    fullyDynamicQlCount: 0,
    recommendedWave: plan.wave,
    recommendedStrategy: plan.strategy,
  };
});

assert.equal(cpReadiness.reduce((sum, cp) => sum + cp.qlCount, 0), 186);
assert.equal(cpReadiness.reduce((sum, cp) => sum + cp.fullyDynamicQlCount, 0), 0);
assert.equal(cpReadiness.filter((cp) => cp.solverProof === "PROVEN").length, 6);
assert.equal(cpReadiness.filter((cp) => cp.canonicalReviewPackage === "READY").length, 6);
assert.deepEqual(
  [...cpReadiness].sort((left, right) => left.recommendedWave - right.recommendedWave)
    .map((entry) => entry.cpId),
  ["PNL-CP-001", "PNL-CP-002", "PNL-CP-004", "PNL-CP-005", "PNL-CP-003", "PNL-CP-006"],
);

const summary = {
  status: "DYNAMIC_RUNTIME_NOT_YET_IMPLEMENTED",
  archetypeId: "PNL-001",
  totalQlCount: allEntries.length,
  solverProvenQlCount: allEntries.length,
  canonicalReviewReadyQlCount: canonicalEntries.length,
  fullyDynamicQlCount: 0,
  dynamicImplementationRequiredQlCount: allEntries.length,
  currentRuntimeMode: "CANONICAL_REVIEW",
  blockingLayers: [
    "QL-specific seeded parameter dispatcher",
    "QL-specific dynamic stem and structured-data binding",
    "answer-semantic formatter",
    "misconception-labelled distractor dispatcher",
    "independent verifier bridge on generated instances",
    "dynamic QuestionPackage emitter",
  ],
  cpReadiness,
};

console.log(JSON.stringify(summary, null, 2));
