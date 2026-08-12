import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { mixedConstraintFingerprint } from "./cp002/constraints.ts";
import { assertMixedFacingCaseletIntegrity, generateMixedFacingCaselet, SEA_CP002_BLUEPRINTS } from "./cp002/generator.ts";
import { enumerateMixedFacingProduction } from "./cp002/solvers.ts";
import { compileSea001TeachingExplanationFromUnknown } from "./explanation/checkpoint-teaching.ts";

const casesPerBlueprint = Number(process.env.SEA_CP002_PROOF_CASES ?? 100);
let generated = 0;
let childQuestions = 0;
let statedFacingCases = 0;
let inferredFacingCases = 0;
let blockCases = 0;
let exactGapCases = 0;
let necessityAudits = 0;
let inferredEndFacingExplanations = 0;
const seatCounts = new Set<number>();
const observedContracts = new Set<string>();
const answerPositions = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
const start = performance.now();

for (const blueprint of SEA_CP002_BLUEPRINTS) {
  for (let index = 0; index < casesPerBlueprint; index += 1) {
    const seed = `SEA-CP002-PROOF-${blueprint}-${String(index).padStart(4, "0")}`;
    const first = generateMixedFacingCaselet(seed, blueprint);
    const replay = generateMixedFacingCaselet(seed, blueprint);
    assert.deepEqual(first, replay, `${blueprint}/${seed} was not deterministic`);
    assertMixedFacingCaseletIntegrity(first);
    generated += 1;
    childQuestions += first.children.length;
    seatCounts.add(first.diagramText.split(" | ").length);
    for (const child of first.children) observedContracts.add(child.queryContractId);

    const facingClues = first.constraints.filter((constraint) => constraint.kind === "FACING");
    if (blueprint === "SEA-PBA-005") {
      statedFacingCases += 1;
      assert.ok(facingClues.length >= 2);
      assert.ok(first.constraints.filter((constraint) => constraint.kind === "RELATIVE_POSITION").length >= first.diagramText.split(" | ").length - 1);
    }
    if (blueprint === "SEA-PBA-006") {
      inferredFacingCases += 1;
      assert.equal(facingClues.length, 0);
      assert.ok(first.checkpointSkillCoverage.includes("INFERRED_FACING"));
    }
    if (blueprint === "SEA-PBA-007") {
      blockCases += 1;
      assert.ok(first.constraints.some((constraint) => constraint.kind === "ADJACENT"));
      const teaching = compileSea001TeachingExplanationFromUnknown(first);
      if (/we do not yet know which way .* faces, so try both/i.test(teaching)
        && /would fall outside the row/i.test(teaching)
        && /so .* must face (?:north|south)/i.test(teaching)) {
        inferredEndFacingExplanations += 1;
      }
    }
    if (blueprint === "SEA-PBA-008") {
      exactGapCases += 1;
      assert.ok(first.constraints.some((constraint) => constraint.kind === "EXACT_COUNT_BETWEEN"));
    }

    assert.equal(new Set(first.constraints.map(mixedConstraintFingerprint)).size, first.constraints.length);
    const modelKey = first.solverOracleAgreement.productionKeys[0] as string;
    const [orderPart] = modelKey.split("|");
    const persons = orderPart?.split(">") ?? [];
    for (const clue of first.constraints) {
      const trial = first.constraints.filter((candidate) => candidate.id !== clue.id);
      const models = enumerateMixedFacingProduction({ persons, constraints: trial, maxModels: 2 });
      assert.notEqual(models.length, 1, `${blueprint}/${seed}/${clue.id} was redundant`);
      necessityAudits += 1;
    }

    for (const child of first.children) answerPositions[child.questionOrder - 1]![child.answerIndex] += 1;
  }
}

assert.ok(seatCounts.has(6) && seatCounts.has(7) && seatCounts.has(8), `Missing seat-count coverage: ${[...seatCounts].join(",")}`);
assert.equal(statedFacingCases, casesPerBlueprint);
assert.equal(inferredFacingCases, casesPerBlueprint);
assert.equal(blockCases, casesPerBlueprint);
assert.equal(exactGapCases, casesPerBlueprint);
assert.ok(observedContracts.has("SEA-QC-008"), "CP002 count-between query family became unreachable");
assert.ok(observedContracts.has("SEA-QC-015"), "CP002 relative-position query family became unreachable");
assert.ok(observedContracts.size >= 5, `CP002 still has insufficient query-family diversity: ${[...observedContracts].join(",")}`);
assert.ok(
  inferredEndFacingExplanations >= Math.max(1, Math.floor(casesPerBlueprint * 0.4)),
  `Too few PBA007 inferred-facing teaching cases: ${inferredEndFacingExplanations}/${casesPerBlueprint}`,
);
for (const counts of answerPositions) assert.ok(counts.every((count) => count > 0), `Missing answer position: ${counts.join(",")}`);

console.log("PASS_SEA_001_CP002_MIXED_FACING");
console.log(`named blueprint authorities ${SEA_CP002_BLUEPRINTS.length}`);
console.log(`generated deterministic caselets ${generated}`);
console.log(`generated child questions ${childQuestions}`);
console.log(`displayed-clue necessity audits ${necessityAudits}`);
console.log(`query contract families ${observedContracts.size}`);
console.log(`PBA007 inferred-facing teaching cases ${inferredEndFacingExplanations}`);
console.log(`elapsed milliseconds ${Math.round(performance.now() - start)}`);
console.log("permanent QLs 0");
