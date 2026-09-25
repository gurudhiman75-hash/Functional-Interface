import assert from "node:assert/strict";
import type { Direction } from "../foundation/types";
import { answerKey } from "./options";
import { generateDirCp008Question } from "./generator";
import {
  solveCaseletIndependent,
  solveContradictionIndependent,
  solveHybridIndependent,
  solveInitialFacingIndependent,
  solveMissingGraphDirectionIndependent,
  solveMissingMovementIndependent,
  solveMissingTurnIndependent,
  solveMixedGraphMovementIndependent,
} from "./independent-solver";
import { DIR_CP008_QLS } from "./task-registry";
import type { AdvancedScenario, CaseletScenario } from "./types";

assert.deepEqual(DIR_CP008_QLS.map((ql) => ql.qlId), Array.from({ length: 9 }, (_, index) => `DIR-QL-${String(index + 36).padStart(3, "0")}`));
const positions = [0, 0, 0, 0];
const stems = new Map<string, Set<string>>();
const directionCoverage = new Map<string, Set<Direction>>();
const explanations = new Map<string, Set<string>>();
const contradictionIndexes = new Set<number>();
const turnCoverage = new Set<string>();
const mixedDistanceCoverage = new Set<number>();
const caseletDistanceCoverage = new Set<number>();
const caseletTurnCoverage = new Set<string>();
const hybridStructureCoverage = new Set<string>();

for (const ql of DIR_CP008_QLS) {
  stems.set(ql.qlId, new Set());
  directionCoverage.set(ql.qlId, new Set());
  explanations.set(ql.qlId, new Set());
  for (let seed = 0; seed < 120; seed += 1) {
    const question = generateDirCp008Question(ql.qlId, seed);
    assert.deepEqual(question, generateDirCp008Question(ql.qlId, seed));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.label.toLowerCase())).size, 4);
    assert.equal(question.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(answerKey(question.options[question.correctIndex].value), answerKey(question.correctAnswer));
    assert.equal(question.questionDiagram, undefined, `${ql.qlId} must not render a diagram with the question`);
    assert.ok(question.stem.length >= 90, `${ql.qlId} short stem: ${question.stem}`);
    assert.ok(!/[{}]|\bundefined\b|\bnull\b/.test(question.stem));
    assert.doesNotMatch(question.stem, /near the main gate|beside the central lawn|along a marked track|close to the entrance|near the boundary wall|patrol officer|marked point|direction that is not stated|\bA courier\b/i, `machine-like CP008 stem padding: ${question.stem}`);
    const learnerText = [question.stem, question.explanation.given, ...question.explanation.steps, question.explanation.resultLine, question.explanation.conclusion].join("\n");
    assert.ok(!/\bcoordinates?\b/i.test(learnerText), `learner-facing coordinate jargon: ${learnerText}`);
    assert.ok(!/\bunreported\b/i.test(learnerText), `unnatural unreported wording: ${learnerText}`);
    assert.ok(
      !/closed layout|complete layout|hidden compass frame|reference layout|endpoint quadrant/i.test(learnerText),
      `machine-like construction jargon leaked into learner text: ${learnerText}`,
    );
    if (ql.qlId === "DIR-QL-039") assert.ok(!/change of direction/i.test(question.stem), `missing-turn stem reveals that a turn occurred: ${question.stem}`);
    assert.ok(question.explanation.steps.length >= 2);
    assert.ok(question.explanation.conclusion.startsWith("Therefore,"));
    const scenario = question.structuredPrompt as AdvancedScenario;

    switch (scenario.kind) {
      case "MISSING_GRAPH_RELATION": {
        const direction = solveMissingGraphDirectionIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction });
        directionCoverage.get(ql.qlId)!.add(direction);
        assert.ok(learnerText.includes(`${scenario.missingDistance} metres`));
        assert.ok(learnerText.includes(scenario.visibleRelations[0].fromEntity));
        assert.ok(learnerText.includes(scenario.visibleRelations[0].toEntity));
        break;
      }
      case "CONTRADICTION": {
        const statementIndex = solveContradictionIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "STATEMENT", statementIndex });
        contradictionIndexes.add(statementIndex);
        assert.ok(learnerText.includes("Statement 1:"));
        assert.ok((question.explanation.diagram?.svg.match(/data-role="relation-distance"/g) ?? []).length >= 3);
        assert.doesNotMatch(
          question.explanation.diagram?.svg ?? "",
          />\d+ m (?:North|South|East|West|North-East|North-West|South-East|South-West)</,
          "CP008 relation diagrams should keep edge labels compact and unambiguous",
        );
        assert.ok(learnerText.includes(scenario.anchorRelations[0].fromEntity));
        assert.ok(learnerText.includes(scenario.anchorRelations[0].toEntity));
        break;
      }
      case "MISSING_MOVEMENT": {
        const direction = solveMissingMovementIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction });
        directionCoverage.get(ql.qlId)!.add(direction);
        assert.ok(learnerText.includes(`${scenario.legs[0].distance} metres`));
        assert.ok(learnerText.includes(`${Math.abs(scenario.target.x)} metres`) || learnerText.includes(`${Math.abs(scenario.target.y)} metres`));
        assert.equal(question.explanation.diagram?.kind, "PATH_SOLUTION");
        assert.equal((question.explanation.diagram?.svg.match(/data-role="movement-leg"/g) ?? []).length, scenario.legs.length);
        break;
      }
      case "MISSING_TURN": {
        const turn = solveMissingTurnIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "TURN", turn });
        turnCoverage.add(turn);
        assert.ok(learnerText.includes(`${scenario.secondDistance} metres`));
        assert.ok(learnerText.includes(`${scenario.thirdDistance} metres`));
        assert.equal(question.explanation.diagram?.kind, "PATH_SOLUTION");
        assert.equal((question.explanation.diagram?.svg.match(/data-role="movement-leg"/g) ?? []).length, 3);
        break;
      }
      case "INITIAL_FACING_FROM_ENDPOINT": {
        const direction = solveInitialFacingIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction });
        directionCoverage.get(ql.qlId)!.add(direction);
        const firstMove = scenario.operations.find((operation) => operation.kind === "MOVE");
        assert.ok(firstMove && learnerText.includes(`${firstMove.distance} metres`));
        assert.equal(question.explanation.diagram?.kind, "PATH_SOLUTION");
        assert.equal((question.explanation.diagram?.svg.match(/data-role="movement-leg"/g) ?? []).length, scenario.operations.filter((operation) => operation.kind === "MOVE").length);
        break;
      }
      case "GRAPH_AND_MOVEMENT": {
        const solved = solveMixedGraphMovementIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "DIRECTION_DISTANCE", direction: solved.direction, distance: solved.distance });
        directionCoverage.get(ql.qlId)!.add(solved.direction);
        mixedDistanceCoverage.add(solved.distance);
        assert.equal(
          (question.explanation.diagram?.svg.match(/data-role="movement-segment"/g) ?? []).length,
          scenario.movements.length,
          "QL041 must render every movement leg instead of collapsing the route to one line",
        );
        assert.equal(
          (question.explanation.diagram?.svg.match(/data-role="movement-distance"/g) ?? []).length,
          scenario.movements.length,
        );
        assert.match(learnerText, /√/);
        assert.ok(learnerText.includes(`${solved.distance} metres`));
        assert.ok(learnerText.includes(scenario.relations[0].fromEntity));
        assert.ok(learnerText.includes(scenario.relations[0].toEntity));
        break;
      }
      case "SHARED_PATH_CASELET": {
        const solved = solveCaseletIndependent(scenario);
        if (ql.qlId === "DIR-QL-042") {
          assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction: solved.direction });
          directionCoverage.get(ql.qlId)!.add(solved.direction);
        } else {
          assert.deepEqual(question.correctAnswer, { kind: "DISTANCE", distance: solved.distance });
        }
        assert.equal(question.metadata.caseletId, scenario.caseletId);
        caseletDistanceCoverage.add(solved.distance);
        for (const operation of scenario.operations) if (operation.kind === "TURN") caseletTurnCoverage.add(operation.turn);
        const firstMove = scenario.operations.find((operation) => operation.kind === "MOVE");
        assert.ok(firstMove && learnerText.includes(`${firstMove.distance} metres`));
        if (ql.qlId === "DIR-QL-043") assert.match(learnerText, /√/);
        assert.equal(question.explanation.diagram?.kind, "PATH_SOLUTION");
        assert.equal((question.explanation.diagram?.svg.match(/data-role="movement-leg"/g) ?? []).length, scenario.operations.filter((operation) => operation.kind === "MOVE").length);
        if (ql.qlId === "DIR-QL-043") assert.ok(question.explanation.diagram?.svg.includes('data-role="shortest-distance-key"'));
        break;
      }
      case "SPLIT_TEXT_RELATION_SYNTHESIS": {
        const direction = solveHybridIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction });
        directionCoverage.get(ql.qlId)!.add(direction);
        assert.ok(question.explanation.diagram?.svg.includes('data-role="diagram-premise"'));
        assert.ok(question.explanation.diagram?.svg.includes('data-role="text-premise"'));
        assert.match(question.stem, /\d+ metres/);
        for (const relation of [...scenario.diagramRelations, scenario.textRelation]) {
          const distance = Math.max(Math.abs(relation.vector.x), Math.abs(relation.vector.y));
          assert.ok(question.stem.includes(`${distance} metres`));
          assert.ok(question.stem.includes(relation.fromEntity));
          assert.ok(question.stem.includes(relation.toEntity));
        }
        hybridStructureCoverage.add(JSON.stringify([scenario.diagramRelations.map((relation) => relation.vector), scenario.textRelation.vector]));
        break;
      }
    }

    stems.get(ql.qlId)!.add(question.stem);
    explanations.get(ql.qlId)!.add([question.explanation.given, ...question.explanation.steps, question.explanation.resultLine, question.explanation.conclusion].join(" | "));
    positions[question.correctIndex] += 1;
  }
}

for (const seed of Array.from({ length: 120 }, (_, index) => index)) {
  const directionQuestion = generateDirCp008Question("DIR-QL-042", seed);
  const distanceQuestion = generateDirCp008Question("DIR-QL-043", seed);
  assert.equal(directionQuestion.metadata.caseletId, distanceQuestion.metadata.caseletId);
  assert.deepEqual(directionQuestion.structuredPrompt as CaseletScenario, distanceQuestion.structuredPrompt as CaseletScenario);
  assert.equal(directionQuestion.difficulty, "MEDIUM");
  assert.equal(distanceQuestion.difficulty, "HARD");
}

for (const id of ["DIR-QL-036", "DIR-QL-038", "DIR-QL-040", "DIR-QL-041", "DIR-QL-042", "DIR-QL-044"]) {
  assert.ok(directionCoverage.get(id)!.size >= 4, `${id} direction coverage ${directionCoverage.get(id)!.size}`);
}
assert.deepEqual([...contradictionIndexes].sort(), [0, 1, 2, 3]);
assert.deepEqual([...turnCoverage].sort(), ["ABOUT", "LEFT", "NO_TURN", "RIGHT"]);
assert.deepEqual([...mixedDistanceCoverage].sort((left, right) => left - right), [5, 13, 17, 25]);
assert.deepEqual([...caseletDistanceCoverage].sort((left, right) => left - right), [13, 17, 25, 37, 41]);
assert.deepEqual([...caseletTurnCoverage].sort(), ["LEFT", "RIGHT"]);
assert.ok(hybridStructureCoverage.size >= 16, `hybrid structure coverage ${hybridStructureCoverage.size}`);
for (const [id, values] of stems) assert.ok(values.size >= 80, `${id} stem diversity ${values.size}`);
for (const [id, values] of explanations) assert.ok(values.size >= 80, `${id} explanation diversity ${values.size}`);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.35, `answer positions ${positions}`);
console.log("DIR-CP-008 advanced synthesis proof passed", { qls: DIR_CP008_QLS.length, generatedCases: 1080, positions, stemDiversity: Object.fromEntries([...stems].map(([id, values]) => [id, values.size])), explanationDiversity: Object.fromEntries([...explanations].map(([id, values]) => [id, values.size])) });
