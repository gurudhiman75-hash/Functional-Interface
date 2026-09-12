import assert from "node:assert/strict";
import {
  generateLp001BatchStabilizedV2,
  generateLp002BatchStabilizedV2,
  generateLp003BatchStabilizedV2,
  generateLp004BatchStabilizedV2,
  generateLp005BatchStabilizedV2,
  generateLp006BatchStabilizedV2,
  generateLp007BatchStabilizedV2,
  generateLp008BatchStabilizedV2,
} from "./lp-001-008-stabilized-english-v2.ts";
import {
  LP_001_008_STABILIZED_ENGLISH_V3,
  generateLp001BatchStabilizedV3,
  generateLp002BatchStabilizedV3,
  generateLp003BatchStabilizedV3,
  generateLp004BatchStabilizedV3,
  generateLp005BatchStabilizedV3,
  generateLp006BatchStabilizedV3,
  generateLp007BatchStabilizedV3,
  generateLp008BatchStabilizedV3,
} from "./lp-001-008-stabilized-english-v3.ts";

type AnyChild = {
  questionId: string;
  stem: string;
  options: string[];
  answer: string;
  correctIndex: number;
  explanation: { summary: string; lines: string[] };
};

type AnyCaselet = {
  caseletId: string;
  clues: readonly { text: string }[];
  children: readonly AnyChild[];
  [key: string]: unknown;
};

type Generator = (seed: string, count: number) => AnyCaselet[];

const packages: readonly [string, Generator, Generator][] = [
  ["LP-001", generateLp001BatchStabilizedV2 as Generator, generateLp001BatchStabilizedV3 as Generator],
  ["LP-002", generateLp002BatchStabilizedV2 as Generator, generateLp002BatchStabilizedV3 as Generator],
  ["LP-003", generateLp003BatchStabilizedV2 as Generator, generateLp003BatchStabilizedV3 as Generator],
  ["LP-004", generateLp004BatchStabilizedV2 as Generator, generateLp004BatchStabilizedV3 as Generator],
  ["LP-005", generateLp005BatchStabilizedV2 as Generator, generateLp005BatchStabilizedV3 as Generator],
  ["LP-006", generateLp006BatchStabilizedV2 as Generator, generateLp006BatchStabilizedV3 as Generator],
  ["LP-007", generateLp007BatchStabilizedV2 as Generator, generateLp007BatchStabilizedV3 as Generator],
  ["LP-008", generateLp008BatchStabilizedV2 as Generator, generateLp008BatchStabilizedV3 as Generator],
];

function withoutExplanations(caselet: AnyCaselet) {
  const { children, ...rest } = caselet;
  return { ...rest, children: children.map(({ explanation: _explanation, ...child }) => child) };
}

assert.equal(LP_001_008_STABILIZED_ENGLISH_V3.parentAuthority, "LP_001_008_STABILIZED_ENGLISH_V2");
assert.equal(LP_001_008_STABILIZED_ENGLISH_V3.changesPuzzleSemantics, false);
assert.equal(LP_001_008_STABILIZED_ENGLISH_V3.changesOptions, false);

for (const [packageId, generateV2, generateV3] of packages) {
  const seed = `simple-case-v3:${packageId}`;
  const v2 = generateV2(seed, 24);
  const v3 = generateV3(seed, 24);
  assert.equal(v3.length, v2.length);

  for (let index = 0; index < v2.length; index += 1) {
    const before = v2[index]!;
    const after = v3[index]!;
    assert.deepEqual(withoutExplanations(after), withoutExplanations(before), `${packageId} V3 changed non-explanation content at ${after.caseletId}`);

    for (const child of after.children) {
      const text = child.explanation.lines.join("\n\n");
      for (const clue of after.clues) assert.ok(text.includes(clue.text), `${child.questionId} does not explain clue: ${clue.text}`);
      assert.match(text, /\*\*Case 1:\*\*/u, `${child.questionId} has no Case 1`);
      assert.match(text, /\*\*Case 2:\*\*/u, `${child.questionId} has no Case 2`);
      assert.match(text, /Case 2 is rejected/u, `${child.questionId} does not reject the failing case`);
      assert.match(text, /Write the final arrangement/u, `${child.questionId} has no final arrangement step`);
      assert.match(text, /\|---(?:\|---)+\|/u, `${child.questionId} has no final table`);
      assert.ok(text.includes(`**${child.answer}**`), `${child.questionId} does not state its final answer`);
      assert.doesNotMatch(text, /solver|solution count|surviving arrangements|candidate states|enumerate/iu, `${child.questionId} exposes solver language`);
      assert.equal(new Set(child.options).size, 4, `${child.questionId} lost unique options`);
      assert.equal(child.options[child.correctIndex], child.answer, `${child.questionId} answer/index drifted`);
    }
  }

  console.log(`${packageId} V3 parity passed for ${v3.length} caselets / ${v3.flatMap((caselet) => caselet.children).length} questions.`);
}
