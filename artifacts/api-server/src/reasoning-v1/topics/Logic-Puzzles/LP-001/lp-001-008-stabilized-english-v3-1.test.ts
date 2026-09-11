import assert from "node:assert/strict";
import {
  generateLp001BatchStabilizedV3,
  generateLp002BatchStabilizedV3,
  generateLp003BatchStabilizedV3,
  generateLp004BatchStabilizedV3,
  generateLp005BatchStabilizedV3,
  generateLp006BatchStabilizedV3,
  generateLp007BatchStabilizedV3,
  generateLp008BatchStabilizedV3,
} from "./lp-001-008-stabilized-english-v3.ts";
import {
  generateLp001BatchStabilizedV3_1,
  generateLp002BatchStabilizedV3_1,
  generateLp003BatchStabilizedV3_1,
  generateLp004BatchStabilizedV3_1,
  generateLp005BatchStabilizedV3_1,
  generateLp006BatchStabilizedV3_1,
  generateLp007BatchStabilizedV3_1,
  generateLp008BatchStabilizedV3_1,
} from "./lp-001-008-stabilized-english-v3-1.ts";

type AnyCaselet = {
  children: readonly {
    explanation: { lines: string[] };
    [key: string]: unknown;
  }[];
  [key: string]: unknown;
};
type Generator = (seed: string, count: number) => AnyCaselet[];

const packages: readonly [string, Generator, Generator][] = [
  ["LP-001", generateLp001BatchStabilizedV3 as Generator, generateLp001BatchStabilizedV3_1 as Generator],
  ["LP-002", generateLp002BatchStabilizedV3 as Generator, generateLp002BatchStabilizedV3_1 as Generator],
  ["LP-003", generateLp003BatchStabilizedV3 as Generator, generateLp003BatchStabilizedV3_1 as Generator],
  ["LP-004", generateLp004BatchStabilizedV3 as Generator, generateLp004BatchStabilizedV3_1 as Generator],
  ["LP-005", generateLp005BatchStabilizedV3 as Generator, generateLp005BatchStabilizedV3_1 as Generator],
  ["LP-006", generateLp006BatchStabilizedV3 as Generator, generateLp006BatchStabilizedV3_1 as Generator],
  ["LP-007", generateLp007BatchStabilizedV3 as Generator, generateLp007BatchStabilizedV3_1 as Generator],
  ["LP-008", generateLp008BatchStabilizedV3 as Generator, generateLp008BatchStabilizedV3_1 as Generator],
];

function stripExplanations(caselet: AnyCaselet) {
  const { children, ...rest } = caselet;
  return { ...rest, children: children.map(({ explanation: _explanation, ...child }) => child) };
}

for (const [packageId, generateV3, generateV31] of packages) {
  const seed = `v3-1-wording:${packageId}`;
  const before = generateV3(seed, 12);
  const after = generateV31(seed, 12);
  assert.equal(after.length, before.length);
  for (let index = 0; index < before.length; index += 1) {
    assert.deepEqual(stripExplanations(after[index]!), stripExplanations(before[index]!), `${packageId} V3.1 changed non-explanation content`);
    for (const child of after[index]!.children) {
      const text = child.explanation.lines.join("\n");
      assert.match(text, /\*\*Case 1:\*\*/u);
      assert.match(text, /\*\*Case 2:\*\*/u);
      assert.match(text, /Case 2 breaks the clue, so reject it/u);
      assert.match(text, /Keep Case 1/u);
      assert.match(text, /Write the final arrangement/u);
      assert.doesNotMatch(text, /does not satisfy it|does not fix a complete entry by itself|Combining this with the earlier clues, we can now fix|solver|solution count|candidate states/iu);
      if (packageId === "LP-003") assert.doesNotMatch(text, /\*\*Case [12]:\*\* .+? is at position \d+ from the bottom/u);
    }
  }
  console.log(`${packageId} V3.1 wording parity passed.`);
}
