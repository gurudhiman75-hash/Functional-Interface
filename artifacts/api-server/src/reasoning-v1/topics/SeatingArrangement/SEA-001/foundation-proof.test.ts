import assert from "node:assert/strict";
import { SEA_001_AUTHORITY_DISCREPANCIES, SEA_001_BLUEPRINTS } from "./manifest.ts";
import { assertSea001ActivationAllowed } from "./lifecycle.ts";
import { LinearTopology } from "./topology/linear.ts";
import { enumerateLinearOracle } from "./solver/independent-oracle.ts";
import { solveLinear } from "./solver/production-solver.ts";
import { generateSeaCp001Caselet } from "./generation/caselet-assembler.ts";
import type { LinearConstraint } from "./types.ts";

function topologyProof(): void {
  const topology = new LinearTopology(6);
  assert.equal(topology.moveRelative({ seatId: "S3", facing: "NORTH", direction: "LEFT", steps: 2 }), "S1");
  assert.equal(topology.moveRelative({ seatId: "S3", facing: "NORTH", direction: "RIGHT", steps: 2 }), "S5");
  assert.equal(topology.moveRelative({ seatId: "S3", facing: "SOUTH", direction: "LEFT", steps: 2 }), "S5");
  assert.equal(topology.moveRelative({ seatId: "S3", facing: "SOUTH", direction: "RIGHT", steps: 2 }), "S1");
  assert.equal(topology.moveRelative({ seatId: "S1", facing: "NORTH", direction: "LEFT", steps: 1 }), null);
  assert.deepEqual(topology.adjacentSeats("S1"), ["S2"]);
  assert.deepEqual(topology.adjacentSeats("S3"), ["S2", "S4"]);
  assert.equal(topology.countBetween("S1", "S6"), 4);
  assert.equal(topology.isMiddle("S3"), true);
  assert.equal(topology.isMiddle("S4"), true);
}

function solverFixtureProof(): void {
  const personIds = ["A", "B", "C", "D", "E"];
  const constraints: LinearConstraint[] = [
    { id: "F1", kind: "ABSOLUTE_SEAT", personId: "A", seatIndex: 0 },
    { id: "F2", kind: "RELATIVE_POSITION", subjectId: "B", referenceId: "A", direction: "RIGHT", steps: 1 },
    { id: "F3", kind: "RELATIVE_POSITION", subjectId: "C", referenceId: "B", direction: "RIGHT", steps: 1 },
    { id: "F4", kind: "RELATIVE_POSITION", subjectId: "D", referenceId: "C", direction: "RIGHT", steps: 1 },
    { id: "F5", kind: "RELATIVE_POSITION", subjectId: "E", referenceId: "D", direction: "RIGHT", steps: 1 },
  ];
  const production = solveLinear({ personIds, facing: "NORTH", constraints });
  const oracle = enumerateLinearOracle({ personIds, facing: "NORTH", constraints });
  assert.deepEqual(production.models.map((model) => model.canonicalKey), ["NORTH|A>B>C>D>E"]);
  assert.deepEqual(oracle.map((model) => model.canonicalKey), ["NORTH|A>B>C>D>E"]);

  const southConstraints: LinearConstraint[] = [
    { id: "S1", kind: "ABSOLUTE_SEAT", personId: "A", seatIndex: 4 },
    { id: "S2", kind: "RELATIVE_POSITION", subjectId: "B", referenceId: "A", direction: "RIGHT", steps: 1 },
    { id: "S3", kind: "RELATIVE_POSITION", subjectId: "C", referenceId: "B", direction: "RIGHT", steps: 1 },
    { id: "S4", kind: "RELATIVE_POSITION", subjectId: "D", referenceId: "C", direction: "RIGHT", steps: 1 },
    { id: "S5", kind: "RELATIVE_POSITION", subjectId: "E", referenceId: "D", direction: "RIGHT", steps: 1 },
  ];
  assert.deepEqual(solveLinear({ personIds, facing: "SOUTH", constraints: southConstraints }).models.map((model) => model.canonicalKey), ["SOUTH|E>D>C>B>A"]);
}

function generatedCaseletProof(): void {
  let generated = 0;
  for (const blueprintId of SEA_001_BLUEPRINTS) {
    for (let seedIndex = 0; seedIndex < 125; seedIndex += 1) {
      const seed = `sea-foundation-${seedIndex}`;
      const first = generateSeaCp001Caselet({ blueprintId, seed });
      const replay = generateSeaCp001Caselet({ blueprintId, seed });
      assert.deepEqual(first, replay, `${blueprintId}/${seed} was not deterministic`);
      assert.equal(first.solutionClassCount, 1);
      assert.equal(first.solverOracleAgreement.passed, true);
      assert.equal(first.children.length, 3);
      assert.equal(new Set(first.children.map((child) => child.queryContractId)).size, 3);
      assert.equal(new Set(first.queryFactFingerprints).size, first.children.length);
      assert.equal(first.crossQuestionLeakagePassed, true);
      assert.equal(first.lifecycle.permanentQlCount, 0);
      assert.equal(first.lifecycle.questionBankWritable, false);
      for (const child of first.children) {
        assert.equal(child.options.length, 4);
        assert.equal(new Set(child.options.map((option) => option.semanticFingerprint)).size, 4);
        assert.equal(child.options.filter((option) => option.isCorrect).length, 1);
        assert.equal(child.options[child.answerIndex]?.isCorrect, true);
      }
      generated += 1;
    }
  }
  assert.equal(generated, 500);
}

function lifecycleProof(): void {
  assert.equal(SEA_001_AUTHORITY_DISCREPANCIES.length, 1);
  assert.throws(() => assertSea001ActivationAllowed(), /discovery foundation only/);
}

topologyProof();
solverFixtureProof();
generatedCaseletProof();
lifecycleProof();
console.log("PASS_SEA_001_CP001_FOUNDATION");
console.log("named blueprint authorities", SEA_001_BLUEPRINTS.length);
console.log("generated deterministic caselets", SEA_001_BLUEPRINTS.length * 125);
console.log("generated child questions", SEA_001_BLUEPRINTS.length * 125 * 3);
console.log("permanent QLs", 0);
