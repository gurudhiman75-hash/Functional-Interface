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
    assert.ok(question.stem.length >= 90, `${ql.qlId} short stem: ${question.stem}`);
    assert.ok(!/[{}]|\bundefined\b|\bnull\b/.test(question.stem));
    const learnerText = [question.stem, question.explanation.given, ...question.explanation.steps, question.explanation.resultLine, question.explanation.conclusion].join("\n");
    assert.ok(!/\bcoordinate\b/i.test(learnerText), `learner-facing coordinate jargon: ${learnerText}`);
    assert.ok(!/\bunreported\b/i.test(learnerText), `unnatural unreported wording: ${learnerText}`);
    if (ql.qlId === "DIR-QL-039") assert.ok(!/change of direction/i.test(question.stem), `missing-turn stem reveals that a turn occurred: ${question.stem}`);
    assert.ok(question.explanation.steps.length >= 2);
    assert.ok(question.explanation.conclusion.startsWith("Therefore,"));
    const scenario = question.structuredPrompt as AdvancedScenario;

    switch (scenario.kind) {
      case "MISSING_GRAPH_RELATION": {
        const direction = solveMissingGraphDirectionIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction });
        directionCoverage.get(ql.qlId)!.add(direction);
        break;
      }
      case "CONTRADICTION": {
        const statementIndex = solveContradictionIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "STATEMENT", statementIndex });
        contradictionIndexes.add(statementIndex);
        break;
      }
      case "MISSING_MOVEMENT": {
        const direction = solveMissingMovementIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction });
        directionCoverage.get(ql.qlId)!.add(direction);
        break;
      }
      case "MISSING_TURN": {
        const turn = solveMissingTurnIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "TURN", turn });
        turnCoverage.add(turn);
        break;
      }
      case "INITIAL_FACING_FROM_ENDPOINT": {
        const direction = solveInitialFacingIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction });
        directionCoverage.get(ql.qlId)!.add(direction);
        break;
      }
      case "GRAPH_AND_MOVEMENT": {
        const solved = solveMixedGraphMovementIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "DIRECTION_DISTANCE", direction: solved.direction, distance: solved.distance });
        directionCoverage.get(ql.qlId)!.add(solved.direction);
        assert.ok(question.explanation.diagram?.svg.includes('data-role="movement-segment"'));
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
        break;
      }
      case "DIAGRAM_TEXT_HYBRID": {
        const direction = solveHybridIndependent(scenario);
        assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction });
        directionCoverage.get(ql.qlId)!.add(direction);
        assert.ok(question.questionDiagram?.svg.includes('data-role="diagram-premise"'));
        assert.ok(question.explanation.diagram?.svg.includes('data-role="text-premise"'));
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
}

for (const id of ["DIR-QL-036", "DIR-QL-038", "DIR-QL-040", "DIR-QL-041", "DIR-QL-042", "DIR-QL-044"]) {
  assert.ok(directionCoverage.get(id)!.size >= 4, `${id} direction coverage ${directionCoverage.get(id)!.size}`);
}
assert.deepEqual([...contradictionIndexes].sort(), [0, 1, 2, 3]);
assert.deepEqual([...turnCoverage].sort(), ["ABOUT", "LEFT", "NO_TURN", "RIGHT"]);
for (const [id, values] of stems) assert.ok(values.size >= 100, `${id} stem diversity ${values.size}`);
for (const [id, values] of explanations) assert.ok(values.size >= 100, `${id} explanation diversity ${values.size}`);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.35, `answer positions ${positions}`);
console.log("DIR-CP-008 advanced synthesis proof passed", { qls: DIR_CP008_QLS.length, generatedCases: 1080, positions, stemDiversity: Object.fromEntries([...stems].map(([id, values]) => [id, values.size])), explanationDiversity: Object.fromEntries([...explanations].map(([id, values]) => [id, values.size])) });
