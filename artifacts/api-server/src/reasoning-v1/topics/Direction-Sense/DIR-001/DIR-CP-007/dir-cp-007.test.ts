import assert from "node:assert/strict";
import type { CardinalDirection } from "../foundation/types";
import { answerKey } from "./options";
import { generateDirCp007Question } from "./generator";
import {
  solveEnvironmentalDirectionIndependent,
  solveFacingFromShadowSideIndependent,
  solveSecondFacingIndependent,
  solveShadowSideIndependent,
  solveTimePeriodIndependent,
  solveTurnsIndependent,
} from "./independent-solver";
import { DIR_CP007_QLS } from "./task-registry";
import type {
  EnvironmentalTarget,
  PersonOrientationRelation,
  RelativeShadowSide,
  SunTimePeriod,
  TurnInstruction,
} from "./types";

const count = (value: string, token: string): number => value.split(token).length - 1;
const positions = [0, 0, 0, 0];
const stems = new Map<string, Set<string>>();
const directions = new Map<string, Set<CardinalDirection>>();
const sides = new Map<string, Set<RelativeShadowSide>>();
const periods = new Map<string, Set<SunTimePeriod>>();
const targets = new Set<EnvironmentalTarget>();
const relations = new Set<PersonOrientationRelation>();
const turnCounts = new Set<number>();
const difficulties = new Set<string>();

for (const ql of DIR_CP007_QLS) {
  stems.set(ql.qlId, new Set());
  directions.set(ql.qlId, new Set());
  sides.set(ql.qlId, new Set());
  periods.set(ql.qlId, new Set());

  for (let seed = 0; seed < 120; seed += 1) {
    const question = generateDirCp007Question(ql.qlId, seed);

    assert.deepEqual(question, generateDirCp007Question(ql.qlId, seed));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.label.toLowerCase())).size, 4);
    assert.equal(question.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(
      answerKey(question.options[question.correctIndex].value),
      answerKey(question.correctAnswer),
    );
    assert.ok(question.stem.length >= 70);
    assert.ok(!/[{}]|\bundefined\b|\bnull\b/.test(question.stem));
    assert.ok(
      !/\bconvention\b/i.test(question.stem),
      `learner-facing stem must use natural exam wording instead of convention language: ${question.stem}`,
    );
    assert.ok(question.explanation.conclusion.startsWith("Therefore,"));

    for (const role of [
      'data-role="sun-marker"',
      'data-role="shadow-ray"',
      'data-role="compass"',
      'data-role="shadow-absolute-label"',
    ]) {
      assert.equal(count(question.explanation.diagram.svg, role), 1);
    }

    const prompt = question.structuredPrompt as Record<string, unknown>;
    const period = prompt.period as SunTimePeriod;
    periods.get(ql.qlId)!.add(period);

    if (ql.qlId === "DIR-QL-030") {
      const target = prompt.target as EnvironmentalTarget;
      const expected = solveEnvironmentalDirectionIndependent(period, target);
      assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction: expected });
      targets.add(target);
      directions.get(ql.qlId)!.add(expected);
      assert.equal(count(question.explanation.diagram.svg, 'data-role="vertical-pole"'), 1);
    } else if (ql.qlId === "DIR-QL-031") {
      const side = prompt.side as RelativeShadowSide;
      const expected = solveFacingFromShadowSideIndependent(period, side);
      assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction: expected });

      const name = prompt.name as string;
      const activity = prompt.activity as "walking" | "standing";
      if (activity === "walking") {
        assert.ok(
          question.stem.includes(`In which direction was ${name} walking?`),
          `walking stem must repeat the named mover: ${question.stem}`,
        );
        assert.ok(
          !question.stem.includes("the person walking"),
          `walking stem must not fall back to a generic subject: ${question.stem}`,
        );
      }

      sides.get(ql.qlId)!.add(side);
      directions.get(ql.qlId)!.add(expected);
    } else if (ql.qlId === "DIR-QL-032") {
      const facing = prompt.facing as CardinalDirection;
      const expected = solveShadowSideIndependent(period, facing);
      assert.deepEqual(question.correctAnswer, { kind: "RELATIVE_SIDE", side: expected });
      sides.get(ql.qlId)!.add(expected);
      directions.get(ql.qlId)!.add(facing);
    } else if (ql.qlId === "DIR-QL-033") {
      const facing = prompt.facing as CardinalDirection;
      const side = prompt.side as RelativeShadowSide;
      const expected = solveTimePeriodIndependent(facing, side);
      assert.deepEqual(question.correctAnswer, { kind: "TIME_PERIOD", period: expected });
      sides.get(ql.qlId)!.add(side);
      directions.get(ql.qlId)!.add(facing);
    } else if (ql.qlId === "DIR-QL-034") {
      const side = prompt.side as RelativeShadowSide;
      const turns = prompt.turns as readonly TurnInstruction[];
      const initial = solveFacingFromShadowSideIndependent(period, side);
      const expected = solveTurnsIndependent(initial, turns);
      assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction: expected });
      assert.equal(question.explanation.turnLines.length, turns.length);
      assert.equal(count(question.explanation.diagram.svg, 'data-role="final-facing"'), 1);
      turnCounts.add(turns.length);
      sides.get(ql.qlId)!.add(side);
      directions.get(ql.qlId)!.add(expected);
    } else {
      const side = prompt.side as RelativeShadowSide;
      const relation = prompt.relation as PersonOrientationRelation;
      const initial = solveFacingFromShadowSideIndependent(period, side);
      const expected = solveSecondFacingIndependent(initial, relation);
      assert.deepEqual(question.correctAnswer, { kind: "DIRECTION", direction: expected });
      relations.add(relation);
      sides.get(ql.qlId)!.add(side);
      directions.get(ql.qlId)!.add(expected);

      for (const role of [
        'data-role="first-person"',
        'data-role="second-person"',
        'data-role="person-relation"',
      ]) {
        assert.equal(count(question.explanation.diagram.svg, role), 1);
      }
    }

    stems.get(ql.qlId)!.add(question.stem);
    difficulties.add(question.difficulty);
    positions[question.correctIndex] += 1;
  }
}

assert.deepEqual([...targets].sort(), ["SHADOW", "SUN"]);
assert.deepEqual([...relations].sort(), ["OPPOSITE_DIRECTION", "SAME_DIRECTION"]);
assert.deepEqual([...turnCounts].sort(), [1, 2, 3]);

for (const id of ["DIR-QL-031", "DIR-QL-032", "DIR-QL-033", "DIR-QL-034", "DIR-QL-035"]) {
  assert.equal(sides.get(id)!.size, 4, `${id} side coverage`);
  assert.equal(directions.get(id)!.size, 4, `${id} direction coverage`);
}

for (const [id, periodSet] of periods) {
  assert.equal(periodSet.size, 2, `${id} period coverage`);
}

for (const [id, stemSet] of stems) {
  assert.ok(stemSet.size >= 110, `${id} stem diversity ${stemSet.size}`);
}

assert.ok(difficulties.has("EASY") && difficulties.has("MEDIUM") && difficulties.has("HARD"));
assert.ok(
  Math.max(...positions) / Math.min(...positions) < 1.35,
  `positions ${positions}`,
);

console.log("DIR-CP-007 sun-shadow proof passed.", {
  qlCount: DIR_CP007_QLS.length,
  generatedCases: 720,
  answerPositions: positions,
  stemDiversity: Object.fromEntries([...stems].map(([key, value]) => [key, value.size])),
});
