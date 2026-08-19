import assert from "node:assert/strict";
import { getStaEnglishCorpusCoverage, STA_ENGLISH_CORPUS_BY_QL, STA_ENGLISH_CORPUS_V1 } from "./english-corpus/index.ts";
import { generateStaQuestionFromPool } from "./generator.ts";
import { assertNegationPairs } from "./negation.ts";
import { assertScenarioOracleParity, evaluateAssumptionOracle } from "./oracle.ts";
import { assertStaScenarioOwnership } from "./router.ts";
import type { StaQlId } from "./types.ts";

const qlIds: readonly StaQlId[] = ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"];
const coverage = getStaEnglishCorpusCoverage();

assert.equal(coverage.totalScenarios, 40, "STA English corpus V1 must contain exactly 40 audited scenario authorities");
for (const qlId of qlIds) assert.equal(coverage.byQl[qlId], 10, `${qlId}: expected exactly 10 corpus scenarios`);
assert.equal(coverage.domains.length, 10, "Expected all ten approved neutral corpus domains");
assert.ok(coverage.familyCount >= 35, `Semantic family diversity too low: ${coverage.familyCount}`);
assert.ok(coverage.misconceptionClasses.length >= 6, `Misconception diversity too low: ${coverage.misconceptionClasses.length}`);
assert.ok(coverage.dependencyRelations.length >= 7, `Dependency relation diversity too low: ${coverage.dependencyRelations.length}`);

const scenarioIds = new Set<string>();
const statementTexts = new Set<string>();
const firstCandidateTexts = new Set<string>();
const sourceProfilesByQl = new Map<StaQlId, Set<string>>();
const domainsByQl = new Map<StaQlId, Set<string>>();
const candidateCountModesByQl = new Map<StaQlId, Set<number>>();

for (const qlId of qlIds) {
  sourceProfilesByQl.set(qlId, new Set());
  domainsByQl.set(qlId, new Set());
  candidateCountModesByQl.set(qlId, new Set());
}

for (const scenario of STA_ENGLISH_CORPUS_V1) {
  assert.equal(scenario.corpusStatus, "ENGLISH_CORPUS_CANDIDATE");
  assert.ok(!scenarioIds.has(scenario.scenarioId), `Duplicate scenario ID ${scenario.scenarioId}`);
  scenarioIds.add(scenario.scenarioId);
  assertStaScenarioOwnership(scenario);
  assertNegationPairs(scenario.propositions);
  assertScenarioOracleParity(scenario);

  sourceProfilesByQl.get(scenario.proposedQlId)!.add(scenario.sourceProfile);
  domainsByQl.get(scenario.proposedQlId)!.add(scenario.domain);
  for (const count of scenario.allowedCandidateCounts) candidateCountModesByQl.get(scenario.proposedQlId)!.add(count);

  const propositionIds = new Set(scenario.propositions.map((proposition) => proposition.propositionId));
  assert.equal(propositionIds.size, scenario.propositions.length, `${scenario.scenarioId}: duplicate proposition IDs`);
  assert.equal(new Set(scenario.candidates.map((candidate) => candidate.candidateId)).size, scenario.candidates.length, `${scenario.scenarioId}: duplicate candidate IDs`);

  for (const variant of scenario.statementVariants) {
    const normalized = variant.trim().toLowerCase();
    assert.ok(!statementTexts.has(normalized), `${scenario.scenarioId}: duplicate statement wording across corpus`);
    statementTexts.add(normalized);
  }
  for (const candidate of scenario.candidates) {
    assert.ok(propositionIds.has(candidate.propositionId), `${scenario.scenarioId}/${candidate.candidateId}: candidate proposition missing`);
    const normalized = candidate.textVariants[0].trim().toLowerCase();
    assert.ok(!firstCandidateTexts.has(normalized), `${scenario.scenarioId}/${candidate.candidateId}: duplicate primary candidate wording`);
    firstCandidateTexts.add(normalized);
    const oracle = evaluateAssumptionOracle(scenario, candidate);
    assert.equal(oracle.classification, candidate.expectedClassification, `${scenario.scenarioId}/${candidate.candidateId}: oracle/editorial mismatch`);
  }

  if (scenario.proposedQlId === "STA-QL-003") {
    assert.equal(scenario.discourseAct, "NOTICE", `${scenario.scenarioId}: QL003 corpus exceeded frozen notice/rule/institutional boundary`);
  }
  if (scenario.proposedQlId === "STA-QL-004") {
    assert.ok(scenario.explicitPropositionIds.length > 0, `${scenario.scenarioId}: QL004 requires an explicit premise`);
    const explicitIds = new Set(scenario.explicitPropositionIds);
    for (const dependency of scenario.hiddenDependencies) {
      assert.equal(dependency.relation, "EFFICACY", `${scenario.scenarioId}: QL004 hidden dependency must be efficacy bridge`);
      assert.equal(explicitIds.has(dependency.propositionId), false, `${scenario.scenarioId}: QL004 hidden bridge became explicit`);
    }
  }
}

for (const qlId of qlIds) {
  assert.ok(sourceProfilesByQl.get(qlId)!.size >= 3, `${qlId}: source-profile diversity below three`);
  assert.ok(domainsByQl.get(qlId)!.size >= 5, `${qlId}: domain diversity below five`);
  assert.deepEqual([...candidateCountModesByQl.get(qlId)!].sort(), [2, 3], `${qlId}: both two- and three-assumption modes must be represented`);
}

const casesPerQl = Number(process.env.STA_ENGLISH_CORPUS_CASES_PER_QL ?? 200);
const answerPositions = new Map<StaQlId, number[]>();
const scenarioHits = new Map<string, number>();
const answerSetShapes = new Map<StaQlId, Set<string>>();
let generated = 0;
let implicit = 0;
let notImplicit = 0;
let threeAssumptionQuestions = 0;
let allThreeImplicit = 0;

for (const qlId of qlIds) {
  answerPositions.set(qlId, [0, 0, 0, 0]);
  answerSetShapes.set(qlId, new Set());
  for (let index = 0; index < casesPerQl; index += 1) {
    const seed = `STA-EN-CORPUS-${qlId}-${String(index).padStart(5, "0")}`;
    const question = generateStaQuestionFromPool(seed, qlId, STA_ENGLISH_CORPUS_BY_QL);
    const replay = generateStaQuestionFromPool(seed, qlId, STA_ENGLISH_CORPUS_BY_QL);
    assert.deepEqual(question, replay, `${qlId}/${seed}: corpus generation replay mismatch`);
    assert.equal(question.qlId, qlId);
    assert.equal(question.lifecycle.permanentQlCount, 4);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    answerPositions.get(qlId)![question.answerIndex] += 1;
    scenarioHits.set(question.scenarioId, (scenarioHits.get(question.scenarioId) ?? 0) + 1);
    answerSetShapes.get(qlId)!.add(`${question.candidates.length}:${question.answerSet.join(",")}`);
    if (question.candidates.length === 3) threeAssumptionQuestions += 1;
    if (question.candidates.length === 3 && question.answerSet.length === 3) allThreeImplicit += 1;
    for (const candidate of question.candidates) {
      if (candidate.oracle.classification === "IMPLICIT") implicit += 1;
      else notImplicit += 1;
    }
    generated += 1;
  }
}

for (const qlId of qlIds) {
  assert.ok(answerPositions.get(qlId)!.every((count) => count > 0), `${qlId}: one or more answer positions were never generated`);
  assert.ok(answerSetShapes.get(qlId)!.size >= 5, `${qlId}: insufficient answer-set shape diversity`);
}
for (const scenario of STA_ENGLISH_CORPUS_V1) {
  assert.ok((scenarioHits.get(scenario.scenarioId) ?? 0) > 0, `${scenario.scenarioId}: scenario never reached by seeded corpus proof`);
}
assert.ok(implicit > 0 && notImplicit > 0, "Corpus generation must contain both implicit and non-implicit assumptions");
assert.ok(threeAssumptionQuestions > 0, "Corpus generation must exercise three-assumption questions");
assert.ok(allThreeImplicit > 0, "Corpus generation must exercise genuine All I, II and III outcome");

console.log("PASS_STA_001_ENGLISH_CORPUS_V1");
console.log(`scenario authorities ${coverage.totalScenarios}`);
console.log(`scenarios per QL ${qlIds.map((qlId) => `${qlId}:${coverage.byQl[qlId]}`).join(" | ")}`);
console.log(`semantic families ${coverage.familyCount}`);
console.log(`domains ${coverage.domains.length}: ${coverage.domains.join(", ")}`);
console.log(`misconception classes ${coverage.misconceptionClasses.length}: ${coverage.misconceptionClasses.join(", ")}`);
console.log(`dependency relations ${coverage.dependencyRelations.length}: ${coverage.dependencyRelations.join(", ")}`);
console.log(`generated questions ${generated}`);
console.log(`implicit / not implicit ${implicit} / ${notImplicit}`);
console.log(`three-assumption questions ${threeAssumptionQuestions}`);
console.log(`all-three-implicit questions ${allThreeImplicit}`);
console.log(`answer positions ${qlIds.map((qlId) => `${qlId}:${answerPositions.get(qlId)!.join("/")}`).join(" | ")}`);
console.log("English corpus status CANDIDATE_NOT_FROZEN");
console.log("Question Studio false");
