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
  const observedAllContracts = new Set<string>();
  const observedContractsByPosition = Array.from({ length: 4 }, () => new Set<string>());
  const answerPositions = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
  const observedPersonCounts = new Set<number>();
  for (const blueprintId of SEA_001_BLUEPRINTS) {
    for (let seedIndex = 0; seedIndex < 125; seedIndex += 1) {
      const seed = `sea-foundation-${seedIndex}`;
      const first = generateSeaCp001Caselet({ blueprintId, seed });
      const replay = generateSeaCp001Caselet({ blueprintId, seed });
      assert.deepEqual(first, replay, `${blueprintId}/${seed} was not deterministic`);
      assert.equal(first.solutionClassCount, 1);
      assert.equal(first.solverOracleAgreement.passed, true);
      assert.equal(first.children.length, 4);
      assert.equal(new Set(first.children.map((child) => child.queryContractId)).size, 4);
      assert.equal(new Set(first.queryFactFingerprints).size, first.children.length);
      assert.equal(first.crossQuestionLeakagePassed, true);
      assert.equal(first.lifecycle.permanentQlCount, 0);
      assert.equal(first.lifecycle.questionBankWritable, false);
      if (blueprintId === "SEA-PBA-004") {
        assert.ok(first.clueTexts.length <= 7, `PBA-004 clue set is too long: ${first.clueTexts.length}`);
        assert.equal(first.clueTexts.filter((clue) => /does not sit next to/i.test(clue)).length, 1);
      }
      for (const child of first.children) {
        observedAllContracts.add(child.queryContractId);
        observedContractsByPosition[child.questionOrder - 1]?.add(child.queryContractId);
        const answerBucket = answerPositions[child.questionOrder - 1];
        if (answerBucket) answerBucket[child.answerIndex] = (answerBucket[child.answerIndex] ?? 0) + 1;
      }
      const personCount = Number(first.setupText.match(/^(\d+)\s+persons/)?.[1] ?? 0);
      observedPersonCounts.add(personCount);
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
  assert.deepEqual([...observedAllContracts].sort(), [
    "SEA-QC-001",
    "SEA-QC-002",
    "SEA-QC-003",
    "SEA-QC-005",
    "SEA-QC-007",
    "SEA-QC-008",
    "SEA-QC-014",
    "SEA-QC-015",
    "SEA-QC-020",
    "SEA-QC-021",
  ]);
  for (let position = 0; position < observedContractsByPosition.length; position += 1) {
    assert.ok(
      (observedContractsByPosition[position]?.size ?? 0) >= 6,
      `CP001 visible Q${position + 1} still has insufficient query variety: ${[...(observedContractsByPosition[position] ?? [])].join(",")}`,
    );
    const counts = answerPositions[position] as number[];
    assert.ok(counts.every((count) => count > 0), `CP001 Q${position + 1} misses a correct-option position: ${counts.join(",")}`);
    assert.ok(Math.max(...counts) - Math.min(...counts) <= 30, `CP001 Q${position + 1} answer positions are imbalanced: ${counts.join(",")}`);
  }
  assert.deepEqual([...observedPersonCounts].sort((left, right) => left - right), [5, 6, 7, 8]);
}

function lifecycleProof(): void {
  assert.equal(SEA_001_AUTHORITY_DISCREPANCIES.length, 1);
  assert.equal(SEA_001_AUTHORITY_DISCREPANCIES[0]?.status, "RESOLVED_BY_NAMED_INVENTORY_PRECEDENCE");
  assert.throws(() => assertSea001ActivationAllowed(), /discovery foundation only/);
}

topologyProof();
solverFixtureProof();
generatedCaseletProof();
lifecycleProof();
console.log("PASS_SEA_001_CP001_FOUNDATION");
console.log("named blueprint authorities", SEA_001_BLUEPRINTS.length);
console.log("generated deterministic caselets", SEA_001_BLUEPRINTS.length * 125);
console.log("generated child questions", SEA_001_BLUEPRINTS.length * 125 * 4);
console.log("query contract families", 10);
console.log("visible query-order variation", "ENFORCED");
console.log("visible answer-position balance", "ENFORCED");
console.log("PBA-004 maximum clue count", 7);
console.log("PBA-004 negative clues per caselet", 1);
console.log("permanent QLs", 0);
