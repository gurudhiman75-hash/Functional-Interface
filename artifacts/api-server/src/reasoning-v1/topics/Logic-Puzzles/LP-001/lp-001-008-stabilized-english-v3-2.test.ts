import assert from "node:assert/strict";
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
import {
  LP_001_008_STABILIZED_ENGLISH_V3_2,
  generateLp001BatchStabilizedV3_2,
  generateLp002BatchStabilizedV3_2,
  generateLp003BatchStabilizedV3_2,
  generateLp004BatchStabilizedV3_2,
  generateLp005BatchStabilizedV3_2,
  generateLp006BatchStabilizedV3_2,
  generateLp007BatchStabilizedV3_2,
  generateLp008BatchStabilizedV3_2,
} from "./lp-001-008-stabilized-english-v3-2.ts";

type AnyCaselet = {
  children: readonly {
    explanation: { lines: string[] };
    [key: string]: unknown;
  }[];
  [key: string]: unknown;
};
type Generator = (seed: string, count: number) => AnyCaselet[];

const packages: readonly [string, Generator, Generator][] = [
  ["LP-001", generateLp001BatchStabilizedV3_1 as Generator, generateLp001BatchStabilizedV3_2 as Generator],
  ["LP-002", generateLp002BatchStabilizedV3_1 as Generator, generateLp002BatchStabilizedV3_2 as Generator],
  ["LP-003", generateLp003BatchStabilizedV3_1 as Generator, generateLp003BatchStabilizedV3_2 as Generator],
  ["LP-004", generateLp004BatchStabilizedV3_1 as Generator, generateLp004BatchStabilizedV3_2 as Generator],
  ["LP-005", generateLp005BatchStabilizedV3_1 as Generator, generateLp005BatchStabilizedV3_2 as Generator],
  ["LP-006", generateLp006BatchStabilizedV3_1 as Generator, generateLp006BatchStabilizedV3_2 as Generator],
  ["LP-007", generateLp007BatchStabilizedV3_1 as Generator, generateLp007BatchStabilizedV3_2 as Generator],
  ["LP-008", generateLp008BatchStabilizedV3_1 as Generator, generateLp008BatchStabilizedV3_2 as Generator],
];

function stripExplanations(caselet: AnyCaselet) {
  const { children, ...rest } = caselet;
  return { ...rest, children: children.map(({ explanation: _explanation, ...child }) => child) };
}

assert.equal(LP_001_008_STABILIZED_ENGLISH_V3_2.changesPuzzleSemantics, false);
assert.equal(LP_001_008_STABILIZED_ENGLISH_V3_2.caseDisplay, "MARKDOWN_TABLE");

const stepPhrases = new Set<string>();
const resolutionPhrases = new Set<string>();
const transitionPhrases = new Set<string>();

for (const [packageId, generateV31, generateV32] of packages) {
  const seed = `v3-2-case-table:${packageId}`;
  const before = generateV31(seed, 20);
  const after = generateV32(seed, 20);
  assert.equal(after.length, before.length, `${packageId} caselet count changed`);

  for (let index = 0; index < before.length; index += 1) {
    assert.deepEqual(stripExplanations(after[index]!), stripExplanations(before[index]!), `${packageId} V3.2 changed non-explanation content`);

    for (const child of after[index]!.children) {
      const text = child.explanation.lines.join("\n");
      assert.match(text, /\| Case \| Possibility \|/u, `${packageId} missing case table`);
      assert.match(text, /\| Case 1 \| .+ \|/u, `${packageId} missing Case 1 row`);
      assert.match(text, /\| Case 2 \| .+ \|/u, `${packageId} missing Case 2 row`);
      assert.match(text, /\|---\|---\|/u, `${packageId} malformed case table`);
      assert.match(text, /Case 2/u, `${packageId} missing case resolution`);
      assert.doesNotMatch(text, /\*\*Case 1:\*\*|\*\*Case 2:\*\*/u, `${packageId} retained paragraph cases`);
      assert.doesNotMatch(text, /Now check two cases for/u, `${packageId} retained old repeated case intro`);

      for (const line of child.explanation.lines) {
        const step = line.match(/\*\*Step \d+: ([^—]+) —/u)?.[1]?.trim();
        if (step) stepPhrases.add(step);
        const resolution = line.match(/(Apply this clue to both cases\.[^\n]+|Now check both cases\.[^\n]+|This clue removes Case 2\.[^\n]+|Compare the two cases with this clue\.[^\n]+)/u)?.[1];
        if (resolution) resolutionPhrases.add(resolution);
        const transition = line.match(/(So we can fix:|From this, we get:|This gives us:|Therefore, we can place:)/u)?.[1];
        if (transition) transitionPhrases.add(transition);
      }
    }
  }

  console.log(`${packageId} V3.2 case-table parity passed.`);
}

assert.ok(stepPhrases.size >= 3, `Expected varied step wording, saw ${[...stepPhrases].join(", ")}`);
assert.ok(resolutionPhrases.size >= 3, `Expected varied case-resolution wording, saw ${resolutionPhrases.size}`);
assert.ok(transitionPhrases.size >= 3, `Expected varied simple transition wording, saw ${[...transitionPhrases].join(", ")}`);

console.log("LP-001–LP-008 English V3.2 passed: explanation-only parity, table-based cases and simple language variation.");
