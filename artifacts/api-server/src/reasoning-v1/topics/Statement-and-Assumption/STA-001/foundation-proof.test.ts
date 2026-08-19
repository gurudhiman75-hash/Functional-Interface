import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { assertStaDiscoveryQuestionIntegrity, generateStaDiscoveryQuestion } from "./generator.ts";
import { assertNegationPairs } from "./negation.ts";
import { answerSetForSelectedCandidates, assertScenarioOracleParity, evaluateAssumptionOracle } from "./oracle.ts";
import { STA_EXECUTABLE_SCENARIOS, STA_SCENARIOS_BY_QL } from "./prototype-authorities.ts";
import { assertStaScenarioOwnership, routeStaScenarioBySemantics } from "./router.ts";
import type { StaCandidateAuthority, StaProposedQlId, StaScenarioAuthority } from "./types.ts";

const qlIds: readonly StaProposedQlId[] = ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"];
const casesPerQl = Number(process.env.STA_DISCOVERY_CASES_PER_QL ?? 120);
const start = performance.now();
let editorialOracleChecks = 0;
let dependencyRemovalChecks = 0;
let explicitnessMutationChecks = 0;
let expectedFlagIndependenceChecks = 0;

for (const scenario of STA_EXECUTABLE_SCENARIOS) {
  assertStaScenarioOwnership(scenario);
  assert.equal(routeStaScenarioBySemantics(scenario), scenario.proposedQlId);
  assertNegationPairs(scenario.propositions);
  assertScenarioOracleParity(scenario);

  const propositionIds = new Set(scenario.propositions.map((item) => item.propositionId));
  assert.equal(propositionIds.size, scenario.propositions.length, `${scenario.scenarioId}: duplicate proposition IDs`);
  assert.equal(new Set(scenario.candidates.map((item) => item.candidateId)).size, scenario.candidates.length, `${scenario.scenarioId}: duplicate candidate IDs`);
  for (const dependency of scenario.hiddenDependencies) assert.ok(propositionIds.has(dependency.propositionId), `${scenario.scenarioId}: orphan dependency`);

  for (const candidate of scenario.candidates) {
    assert.ok(propositionIds.has(candidate.propositionId), `${scenario.scenarioId}/${candidate.candidateId}: orphan candidate`);
    const original = evaluateAssumptionOracle(scenario, candidate);
    editorialOracleChecks += 1;

    const flippedCandidate: StaCandidateAuthority = {
      ...candidate,
      expectedClassification: candidate.expectedClassification === "IMPLICIT" ? "NOT_IMPLICIT" : "IMPLICIT",
    };
    const withFlippedEditorialFlag = evaluateAssumptionOracle(scenario, flippedCandidate);
    assert.deepEqual(withFlippedEditorialFlag, original, `${scenario.scenarioId}/${candidate.candidateId}: oracle read editorial answer flag`);
    expectedFlagIndependenceChecks += 1;

    if (original.classification === "IMPLICIT") {
      const dependencyRemoved: StaScenarioAuthority = {
        ...scenario,
        hiddenDependencies: scenario.hiddenDependencies.filter((item) => item.propositionId !== candidate.propositionId),
      };
      assert.equal(evaluateAssumptionOracle(dependencyRemoved, candidate).classification, "NOT_IMPLICIT", `${scenario.scenarioId}/${candidate.candidateId}: survived dependency removal`);
      dependencyRemovalChecks += 1;

      const madeExplicit: StaScenarioAuthority = {
        ...scenario,
        explicitPropositionIds: [...scenario.explicitPropositionIds, candidate.propositionId],
      };
      const explicitResult = evaluateAssumptionOracle(madeExplicit, candidate);
      assert.equal(explicitResult.classification, "NOT_IMPLICIT", `${scenario.scenarioId}/${candidate.candidateId}: explicit proposition remained implicit`);
      assert.equal(explicitResult.evidenceCode, "EXPLICIT_RESTATEMENT");
      explicitnessMutationChecks += 1;
    }
  }
}

assert.equal(STA_EXECUTABLE_SCENARIOS.length, 13, "Expected 13 reviewed STA executable scenario authorities");
assert.equal(STA_SCENARIOS_BY_QL["STA-QL-001"].length, 3);
assert.equal(STA_SCENARIOS_BY_QL["STA-QL-002"].length, 4);
assert.equal(STA_SCENARIOS_BY_QL["STA-QL-003"].length, 3);
assert.equal(STA_SCENARIOS_BY_QL["STA-QL-004"].length, 3);

const answerPositions = new Map<StaProposedQlId, number[]>();
const candidateCounts = new Map<StaProposedQlId, Set<number>>();
const visibleFingerprints = new Map<StaProposedQlId, Set<string>>();
let generated = 0;
let generatedCandidates = 0;
let generatedImplicit = 0;
let generatedNotImplicit = 0;
let generatedAllThreeImplicit = 0;

for (const qlId of qlIds) {
  answerPositions.set(qlId, [0, 0, 0, 0]);
  candidateCounts.set(qlId, new Set<number>());
  visibleFingerprints.set(qlId, new Set<string>());
  for (let index = 0; index < casesPerQl; index += 1) {
    const seed = `STA-DISCOVERY-${qlId}-${String(index).padStart(4, "0")}`;
    const first = generateStaDiscoveryQuestion(seed, qlId);
    const replay = generateStaDiscoveryQuestion(seed, qlId);
    assert.deepEqual(first, replay, `${qlId}/${seed}: generation is not deterministic`);
    assertStaDiscoveryQuestionIntegrity(first);
    assert.equal(first.qlId, qlId);
    assert.equal(first.proposedQlId, qlId);
    assert.equal(first.oracleParity, true);
    assert.equal(first.lifecycle.maturity, "PERMANENT_QL_SEMANTIC_FREEZE");
    assert.equal(first.lifecycle.permanentQlCount, 4);
    assert.equal(first.lifecycle.questionStudioDiscoverable, false);
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.testEligible, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);

    const positionCounts = answerPositions.get(qlId)!;
    positionCounts[first.answerIndex] += 1;
    candidateCounts.get(qlId)!.add(first.candidates.length);
    visibleFingerprints.get(qlId)!.add([
      first.statement,
      ...first.candidates.map((item) => `${item.label}:${item.text}`),
      ...first.options.map((item) => item.display),
    ].join("|"));

    const selectedScenario = STA_EXECUTABLE_SCENARIOS.find((scenario) => scenario.scenarioId === first.scenarioId)!;
    const selectedAuthorities = first.candidates.map((rendered) => selectedScenario.candidates.find((candidate) => candidate.candidateId === rendered.candidateId)!);
    assert.deepEqual(answerSetForSelectedCandidates(selectedScenario, selectedAuthorities), first.answerSet);

    if (first.candidates.length === 3 && first.answerSet.length === 3) generatedAllThreeImplicit += 1;
    generated += 1;
    generatedCandidates += first.candidates.length;
    for (const candidate of first.candidates) {
      if (candidate.oracle.classification === "IMPLICIT") generatedImplicit += 1;
      else generatedNotImplicit += 1;
    }
  }
}

for (const qlId of qlIds) {
  assert.ok(answerPositions.get(qlId)!.every((count) => count > 0), `${qlId}: some answer positions were never used`);
  assert.deepEqual([...candidateCounts.get(qlId)!].sort(), [2, 3], `${qlId}: both two- and three-assumption forms must execute`);
  assert.ok(visibleFingerprints.get(qlId)!.size >= Math.min(40, Math.floor(casesPerQl / 2)), `${qlId}: insufficient visible diversity`);
}

assert.ok(generatedImplicit > 0 && generatedNotImplicit > 0, "Both implicit and non-implicit candidates must be generated");
assert.ok(generatedAllThreeImplicit > 0, "SSC-style all-three-implicit answer outcome must be generated");

console.log("PASS_STA_001_EXECUTABLE_DISCOVERY_QL001_QL004");
console.log(`frozen semantic QLs ${qlIds.length}`);
console.log(`curated scenario authorities ${STA_EXECUTABLE_SCENARIOS.length}`);
console.log(`generated deterministic questions ${generated}`);
console.log(`generated candidate assumptions ${generatedCandidates}`);
console.log(`implicit candidates ${generatedImplicit}`);
console.log(`not-implicit candidates ${generatedNotImplicit}`);
console.log(`all-three-implicit questions ${generatedAllThreeImplicit}`);
console.log(`editorial/oracle parity checks ${editorialOracleChecks}`);
console.log(`expected-answer flag independence checks ${expectedFlagIndependenceChecks}`);
console.log(`dependency-removal mutation checks ${dependencyRemovalChecks}`);
console.log(`explicitness mutation checks ${explicitnessMutationChecks}`);
console.log(`answer positions ${qlIds.map((qlId) => `${qlId}:${answerPositions.get(qlId)!.join("/")}`).join(" | ")}`);
console.log(`elapsed milliseconds ${Math.round(performance.now() - start)}`);
console.log("permanent QLs 4");
console.log("Question Studio false");
