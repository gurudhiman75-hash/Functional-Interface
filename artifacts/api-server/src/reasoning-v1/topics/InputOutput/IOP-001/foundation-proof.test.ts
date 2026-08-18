import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { assertIopFoundationCaseletIntegrity, generateIopFoundationCaselet, getIopRuleFingerprint } from "./generator.ts";
import { IOP_FOUNDATION_PROTOTYPES } from "./prototypes.ts";
import { assertChildAnswerOracle } from "./query-oracle.ts";

const casesPerPrototype = Number(process.env.IOP_FOUNDATION_CASES ?? 80);
const answerPositions = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
const checkpoints = new Map<string, number>();
let generated = 0;
let childQuestions = 0;
let competitorRulesTested = 0;
let alternativeMatchesRejected = 0;
const visibleCaselets = new Set<string>();
const start = performance.now();

for (const authority of IOP_FOUNDATION_PROTOTYPES) {
  const expectedRuleFingerprint = getIopRuleFingerprint(authority.prototypeId);
  for (let index = 0; index < casesPerPrototype; index += 1) {
    const seed = `IOP-FOUNDATION-${authority.prototypeId}-${String(index).padStart(4, "0")}`;
    const first = generateIopFoundationCaselet(seed, authority.prototypeId);
    const replay = generateIopFoundationCaselet(seed, authority.prototypeId);
    assert.deepEqual(first, replay, `${authority.prototypeId}/${seed} was not deterministic`);
    assertIopFoundationCaseletIntegrity(first);
    assert.equal(first.demonstration.ruleFingerprint, expectedRuleFingerprint);
    assert.equal(first.identifiability.matchingRuleFingerprints.length, 1);
    assert.equal(first.identifiability.matchingRuleFingerprints[0], expectedRuleFingerprint);
    assert.ok(first.identifiability.candidateRulesTested >= 4);

    const learnerFingerprint = [
      first.prototypeId,
      first.demonstration.input.map((token) => token.visibleValue).join(" "),
      first.target.input.map((token) => token.visibleValue).join(" "),
    ].join("|");
    assert.ok(!visibleCaselets.has(learnerFingerprint), `Visible caselet collision ${learnerFingerprint}`);
    visibleCaselets.add(learnerFingerprint);

    generated += 1;
    childQuestions += first.children.length;
    competitorRulesTested += first.identifiability.candidateRulesTested;
    alternativeMatchesRejected += first.identifiability.candidateRulesTested - first.identifiability.matchingRuleFingerprints.length;
    checkpoints.set(first.checkpointId, (checkpoints.get(first.checkpointId) ?? 0) + 1);
    for (const child of first.children) {
      assertChildAnswerOracle(first.target, child);
      answerPositions[child.questionOrder - 1]![child.answerIndex] += 1;
    }
  }
}

assert.equal(IOP_FOUNDATION_PROTOTYPES.length, 12);
for (const checkpoint of ["IOP-CP-001", "IOP-CP-002", "IOP-CP-003", "IOP-CP-004"]) {
  assert.equal(checkpoints.get(checkpoint), casesPerPrototype * 3, `Coverage missing for ${checkpoint}`);
}
for (const counts of answerPositions) assert.ok(counts.every((count) => count > 0), `Missing answer position ${counts.join("/")}`);

console.log("PASS_IOP_001_FOUNDATION_CP001_CP004");
console.log(`temporary prototype authorities ${IOP_FOUNDATION_PROTOTYPES.length}`);
console.log(`generated deterministic caselets ${generated}`);
console.log(`generated child questions ${childQuestions}`);
console.log(`competing rule executions audited ${competitorRulesTested}`);
console.log(`non-matching alternative rule candidates rejected ${alternativeMatchesRejected}`);
console.log(`unique visible caselets ${visibleCaselets.size}`);
console.log(`answer positions by child ${answerPositions.map((row) => row.join("/")).join(" | ")}`);
console.log(`elapsed milliseconds ${Math.round(performance.now() - start)}`);
console.log("permanent QLs 0");
console.log("Question Studio false");
