import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import {
  assertMixedCircularCaseletIntegrity,
  generateMixedCircularCaselet,
  SEA_CP005_BLUEPRINTS,
} from "./cp005/generator.ts";
import { enumerateMixedCircularProduction } from "./cp005/solvers.ts";

const casesPerBlueprint = Number(process.env.SEA_CP005_PROOF_CASES ?? 100);
const answerPositions = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
const observedSeatCounts = new Set<number>();
let generatedCaselets = 0;
let generatedQuestions = 0;
let oddGuardedCaselets = 0;
let facingSensitiveQuestions = 0;
let displayedClueNecessityAudits = 0;
let conditionalCaselets = 0;
const startedAt = performance.now();

for (const blueprint of SEA_CP005_BLUEPRINTS) {
  for (let index = 0; index < casesPerBlueprint; index += 1) {
    const seed = `SEA-CP005-PROOF-${blueprint}-${String(index).padStart(4, "0")}`;
    const caselet = generateMixedCircularCaselet(seed, blueprint);
    const replay = generateMixedCircularCaselet(seed, blueprint);
    assert.deepEqual(replay, caselet, `${blueprint}/${seed} was not deterministic`);
    assertMixedCircularCaseletIntegrity(caselet);

    generatedCaselets += 1;
    generatedQuestions += caselet.children.length;
    observedSeatCounts.add(caselet.topologySnapshot.seatCount);
    assert.match(caselet.setupText, /Some face the centre and the others face outward/i);
    assert.match(caselet.sharedExplanation, /centre-facing left = clockwise/i);
    assert.match(caselet.sharedExplanation, /outward-facing left = anticlockwise/i);

    const modelKey = caselet.solverOracleAgreement.productionKeys[0];
    assert.ok(modelKey);
    const persons = modelKey.split("|").map((part) => part.split(":")[0]!).filter(Boolean);
    const facingMarkers = modelKey.split("|").map((part) => part.split(":")[1]);
    assert.ok(facingMarkers.includes("C") && facingMarkers.includes("O"), "mixed circle became uniform-facing");

    const relativeChildren = caselet.children.slice(0, 2);
    assert.ok(relativeChildren.every((child) => child.referenceFacing));
    assert.ok(relativeChildren.every((child) => child.oppositeFacingCounterfactual !== undefined));
    assert.ok(relativeChildren.every((child) => JSON.stringify(child.answer) !== JSON.stringify(child.oppositeFacingCounterfactual)));
    facingSensitiveQuestions += relativeChildren.length;

    if (caselet.topologySnapshot.seatCount % 2 !== 0) {
      oddGuardedCaselets += 1;
      assert.ok(!caselet.constraints.some((constraint) => constraint.kind === "OPPOSITE"));
      assert.ok(!caselet.children.some((child) => child.queryContractId === "SEA-QC-010"));
    }

    if (blueprint === "SEA-PBA-017") {
      assert.equal(caselet.constraints.filter((constraint) => constraint.kind === "FACING").length, caselet.topologySnapshot.seatCount);
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "RELATIVE_POSITION"));
    }
    if (blueprint === "SEA-PBA-018") {
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "FACING"));
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "SAME_FACING" || constraint.kind === "OPPOSITE_FACING"));
    }
    if (blueprint === "SEA-PBA-019") {
      assert.equal(caselet.topologySnapshot.seatCount % 2, 0);
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "OPPOSITE"));
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "DIRECTIONAL_COUNT_BETWEEN"));
    }
    if (blueprint === "SEA-PBA-020") {
      conditionalCaselets += 1;
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "FACING_CONDITIONAL_RELATION"));
      assert.ok(caselet.clueTexts.some((clue) => /^If .* faces the centre, .*; if .* faces outward,/i.test(clue)));
    }

    for (const clue of caselet.constraints) {
      const trial = caselet.constraints.filter((candidate) => candidate.id !== clue.id);
      const models = enumerateMixedCircularProduction({ persons, constraints: trial, maxModels: 2 });
      assert.notEqual(models.length, 1, `${blueprint}/${seed}/${clue.id} was redundant`);
      displayedClueNecessityAudits += 1;
    }

    for (const child of caselet.children) {
      answerPositions[child.questionOrder - 1]![child.answerIndex] += 1;
      assert.equal(child.options.length, 4);
      assert.equal(child.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(new Set(child.options.map((option) => option.semanticFingerprint)).size, 4);
    }
  }
}

assert.equal(generatedCaselets, SEA_CP005_BLUEPRINTS.length * casesPerBlueprint);
assert.equal(generatedQuestions, generatedCaselets * 4);
assert.equal(conditionalCaselets, casesPerBlueprint);
assert.equal(facingSensitiveQuestions, generatedCaselets * 2);
assert.ok(oddGuardedCaselets > 0);
assert.ok(observedSeatCounts.has(6) && observedSeatCounts.has(7) && observedSeatCounts.has(8));
for (const counts of answerPositions) {
  assert.ok(counts.every((count) => count > 0), `Missing answer position: ${counts.join(",")}`);
}

console.log("PASS_SEA_001_CP005_MIXED_CIRCULAR");
console.log(`named blueprint authorities ${SEA_CP005_BLUEPRINTS.length}`);
console.log(`generated deterministic caselets ${generatedCaselets}`);
console.log(`generated child questions ${generatedQuestions}`);
console.log(`facing-sensitive child questions ${facingSensitiveQuestions}`);
console.log(`odd-seat guarded caselets ${oddGuardedCaselets}`);
console.log(`conditional-orientation caselets ${conditionalCaselets}`);
console.log(`displayed-clue necessity audits ${displayedClueNecessityAudits}`);
console.log(`elapsed milliseconds ${Math.round(performance.now() - startedAt)}`);
console.log("permanent QLs 0");
