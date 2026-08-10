import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import {
  assertMixedCircleCaseletIntegrity,
  generateMixedCircleCaselet,
  SEA_CP005_BLUEPRINTS,
} from "./cp005/generator.ts";
import { enumerateMixedCircleProduction } from "./cp005/solvers.ts";

const casesPerBlueprint = Number(process.env.SEA_CP005_PROOF_CASES ?? 100);
let generatedCaselets = 0;
let generatedQuestions = 0;
let displayedClueNecessityAudits = 0;
let inferredFacingCases = 0;
let conditionalOrientationCases = 0;
let oppositeGapCases = 0;
let facingCounterfactualQuestions = 0;
let groupedFacingPresentationCases = 0;
const observedSeatCounts = new Set<number>();
const startedAt = performance.now();

for (const blueprint of SEA_CP005_BLUEPRINTS) {
  for (let index = 0; index < casesPerBlueprint; index += 1) {
    const seed = `SEA-CP005-PROOF-${blueprint}-${String(index).padStart(4, "0")}`;
    const caselet = generateMixedCircleCaselet(seed, blueprint);
    const replay = generateMixedCircleCaselet(seed, blueprint);
    assert.deepEqual(replay, caselet, `${blueprint}/${seed} was not deterministic`);
    assertMixedCircleCaseletIntegrity(caselet);

    generatedCaselets += 1;
    generatedQuestions += caselet.children.length;
    const orderText = caselet.solverOracleAgreement.productionKeys[0]?.split("|")[0] ?? "";
    const persons = orderText.split(">");
    observedSeatCounts.add(persons.length);
    facingCounterfactualQuestions += caselet.children.filter((child) =>
      child.oppositeFacingCounterfactual !== undefined
        && JSON.stringify(child.oppositeFacingCounterfactual) !== JSON.stringify(child.answer)).length;

    if (blueprint === "SEA-PBA-017" || blueprint === "SEA-PBA-019") {
      assert.equal(
        caselet.constraints.filter((constraint) => constraint.kind === "FACING").length,
        persons.length,
      );
      const displayedFacingClues = caselet.clueTexts.filter((clue) => /\bface(?:s)? (?:the centre|outward)\b/i.test(clue));
      assert.equal(displayedFacingClues.length, 1, `${blueprint}/${seed} did not group explicit facing facts`);
      assert.match(displayedFacingClues[0] ?? "", /;/, `${blueprint}/${seed} grouped facing clue did not show both facing groups`);
      assert.ok(caselet.clueTexts.length <= 7, `${blueprint}/${seed} has an editorially long displayed clue list: ${caselet.clueTexts.length}`);
      groupedFacingPresentationCases += 1;
    }

    if (blueprint === "SEA-PBA-018") {
      inferredFacingCases += 1;
      assert.equal(caselet.constraints.filter((constraint) => constraint.kind === "FACING").length, 0);
      assert.equal(
        caselet.constraints.filter((constraint) => constraint.kind === "RELATIVE_POSITION").length,
        persons.length,
      );
    }
    if (blueprint === "SEA-PBA-019") {
      oppositeGapCases += 1;
      assert.ok(caselet.constraints.some((constraint) => constraint.kind === "OPPOSITE"));
      assert.ok(caselet.constraints.some((constraint) =>
        constraint.kind === "DIRECTIONAL_COUNT_BETWEEN"));
    }
    if (blueprint === "SEA-PBA-020") {
      conditionalOrientationCases += 1;
      assert.ok(caselet.constraints.some((constraint) =>
        constraint.kind === "CONDITIONAL_FACING"));
    }

    for (const clue of caselet.constraints) {
      const trial = caselet.constraints.filter((candidate) => candidate.id !== clue.id);
      const models = enumerateMixedCircleProduction({
        persons,
        constraints: trial,
        maxModels: 2,
      });
      assert.notEqual(models.length, 1, `${blueprint}/${seed}/${clue.id} was redundant`);
      displayedClueNecessityAudits += 1;
    }
  }
}

assert.ok(observedSeatCounts.has(6) && observedSeatCounts.has(7));
assert.equal(inferredFacingCases, casesPerBlueprint);
assert.equal(oppositeGapCases, casesPerBlueprint);
assert.equal(conditionalOrientationCases, casesPerBlueprint);
assert.equal(groupedFacingPresentationCases, casesPerBlueprint * 2);
assert.ok(facingCounterfactualQuestions >= generatedCaselets * 2);

console.log("PASS_SEA_001_CP005_MIXED_CIRCLE");
console.log(`named blueprint authorities ${SEA_CP005_BLUEPRINTS.length}`);
console.log(`generated deterministic caselets ${generatedCaselets}`);
console.log(`generated child questions ${generatedQuestions}`);
console.log(`facing-counterfactual questions ${facingCounterfactualQuestions}`);
console.log(`grouped-facing presentation cases ${groupedFacingPresentationCases}`);
console.log(`displayed-clue necessity audits ${displayedClueNecessityAudits}`);
console.log(`elapsed milliseconds ${Math.round(performance.now() - startedAt)}`);
console.log("permanent QLs 0");