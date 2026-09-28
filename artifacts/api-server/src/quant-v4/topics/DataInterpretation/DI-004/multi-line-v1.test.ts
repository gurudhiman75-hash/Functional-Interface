import assert from "node:assert/strict";
import { DI004_MULTI_TASKS, generateDi004MultiLineSet } from "./multi-line-v1";
import { renderDi004MultiLineSvg } from "./multi-line-svg-v1";

const tasks = new Set<string>();
let questions = 0;

for (let i = 0; i < 320; i += 1) {
  const seed = `DI-004-MULTI-STRESS-${i}`;
  const set = generateDi004MultiLineSet({ seed });
  const replay = generateDi004MultiLineSet({ seed });

  assert.deepEqual(set, replay, `${seed}: deterministic replay failed`);
  assert.deepEqual(
    set.questions.map((question) => question.difficulty),
    ["Easy", "Medium", "Medium", "Hard", "Hard"],
    `${seed}: difficulty mix drifted`,
  );

  const svg = renderDi004MultiLineSvg(set.stimulus);
  assert(svg.includes('data-multi-line="true"'));
  assert(svg.includes('data-series-count="3"'));

  for (const point of set.stimulus.points) {
    assert(svg.includes(point.period));
    for (const value of [point.a, point.b, point.c]) {
      assert(svg.includes(`data-value="${value}"`), `${seed}: plotted value ${value} not visible`);
    }
  }

  for (const question of set.questions) {
    questions += 1;
    tasks.add(question.kind);
    assert.equal(question.options.length, 5);
    assert.equal(new Set(question.options).size, 5);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert(!/\d+\.\d+/u.test(question.answer));
  }
}

assert.deepEqual([...tasks].sort(), [...DI004_MULTI_TASKS].sort());
console.log(
  "DI004_MULTI_LINE_V1",
  JSON.stringify({ sets: 320, questions, tasks: [...tasks].sort() }),
);
