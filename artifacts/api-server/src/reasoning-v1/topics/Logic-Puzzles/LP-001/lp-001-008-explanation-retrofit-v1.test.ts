import assert from "node:assert/strict";
import { generateCaseletBatch } from "./index.ts";
import { generateLp002Batch } from "./lp-002.ts";
import { generateLp003Batch } from "./lp-003.ts";
import { generateLp004Batch } from "./lp-004.ts";
import { generateLp005Batch } from "./lp-005.ts";
import { generateLp006Batch } from "./lp-006.ts";
import { generateLp007Batch } from "./lp-007.ts";
import { generateLp008Batch } from "./lp-008.ts";
import {
  LP_001_008_EXPLANATION_RETROFIT_V1,
  generateLp001BatchRetrofitV1,
  generateLp002BatchRetrofitV1,
  generateLp003BatchRetrofitV1,
  generateLp004BatchRetrofitV1,
  generateLp005BatchRetrofitV1,
  generateLp006BatchRetrofitV1,
  generateLp007BatchRetrofitV1,
  generateLp008BatchRetrofitV1,
} from "./lp-001-008-explanation-retrofit-v1.ts";

type AnyCaselet = {
  caseletId: string;
  clues: readonly { text: string }[];
  children: readonly {
    questionId: string;
    qlId: string;
    stem: string;
    options: string[];
    correctIndex: number;
    answer: string;
    difficultyBand: string;
    misconceptionFamily: string;
    explanation: { summary: string; lines: string[] };
  }[];
  [key: string]: unknown;
};

type Generator = (seed: string, count: number) => AnyCaselet[];

const packages: readonly [string, Generator, Generator][] = [
  ["LP-001", generateCaseletBatch as Generator, generateLp001BatchRetrofitV1 as Generator],
  ["LP-002", generateLp002Batch as Generator, generateLp002BatchRetrofitV1 as Generator],
  ["LP-003", generateLp003Batch as Generator, generateLp003BatchRetrofitV1 as Generator],
  ["LP-004", generateLp004Batch as Generator, generateLp004BatchRetrofitV1 as Generator],
  ["LP-005", generateLp005Batch as Generator, generateLp005BatchRetrofitV1 as Generator],
  ["LP-006", generateLp006Batch as Generator, generateLp006BatchRetrofitV1 as Generator],
  ["LP-007", generateLp007Batch as Generator, generateLp007BatchRetrofitV1 as Generator],
  ["LP-008", generateLp008Batch as Generator, generateLp008BatchRetrofitV1 as Generator],
];

function withoutExplanations(caselet: AnyCaselet) {
  const { children, ...rest } = caselet;
  return {
    ...rest,
    children: children.map(({ explanation: _explanation, ...child }) => child),
  };
}

assert.equal(LP_001_008_EXPLANATION_RETROFIT_V1.changesPuzzleSemantics, false);
assert.equal(LP_001_008_EXPLANATION_RETROFIT_V1.changesStems, false);
assert.equal(LP_001_008_EXPLANATION_RETROFIT_V1.changesAnswers, false);

for (const [packageId, baseGenerator, retrofitGenerator] of packages) {
  const seed = `explanation-retrofit-parity:${packageId}`;
  const base = baseGenerator(seed, 24);
  const retrofit = retrofitGenerator(seed, 24);
  assert.equal(retrofit.length, base.length, `${packageId} caselet count changed`);

  for (let index = 0; index < base.length; index += 1) {
    const source = base[index]!;
    const revised = retrofit[index]!;
    assert.deepEqual(withoutExplanations(revised), withoutExplanations(source), `${packageId} changed puzzle semantics at ${source.caseletId}`);

    for (const child of revised.children) {
      assert.equal(child.explanation.lines.length, revised.clues.length + 2, `${child.questionId} explanation does not have clue steps + final table + answer step`);
      for (let clueIndex = 0; clueIndex < revised.clues.length; clueIndex += 1) {
        const line = child.explanation.lines[clueIndex]!;
        assert.match(line, new RegExp(`^\\*\\*Step ${clueIndex + 1}: Use the clue`, "u"), `${child.questionId} lost ordered clue step ${clueIndex + 1}`);
        assert.ok(line.includes(revised.clues[clueIndex]!.text), `${child.questionId} does not quote clue ${clueIndex + 1}`);
        assert.match(line, /\|---(?:\|---)+\|/u, `${child.questionId} clue step ${clueIndex + 1} has no candidate table`);
      }
      const finalArrangement = child.explanation.lines[revised.clues.length]!;
      assert.match(finalArrangement, /Read the completed arrangement/u, `${child.questionId} lost final arrangement step`);
      assert.match(finalArrangement, /\|---(?:\|---)+\|/u, `${child.questionId} final arrangement has no table`);
      const finalAnswer = child.explanation.lines.at(-1)!;
      assert.match(finalAnswer, /Answer the question/u, `${child.questionId} lost child-answer step`);
      assert.ok(finalAnswer.includes(child.answer), `${child.questionId} final step does not state the answer`);
      assert.doesNotMatch(child.explanation.lines.join("\n"), /associated|solver found|solution count|use all the clues|apply all the clues/iu);
    }
  }

  console.log(`${packageId} explanation retrofit parity passed for ${retrofit.length} caselets / ${retrofit.flatMap((caselet) => caselet.children).length} questions.`);
}
