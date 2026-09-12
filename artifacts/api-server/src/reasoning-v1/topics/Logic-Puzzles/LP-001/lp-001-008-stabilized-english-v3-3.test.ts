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
  LP_001_008_STABILIZED_ENGLISH_V3_3,
  generateLp001BatchStabilizedV3_3,
  generateLp002BatchStabilizedV3_3,
  generateLp003BatchStabilizedV3_3,
  generateLp004BatchStabilizedV3_3,
  generateLp005BatchStabilizedV3_3,
  generateLp006BatchStabilizedV3_3,
  generateLp007BatchStabilizedV3_3,
  generateLp008BatchStabilizedV3_3,
} from "./lp-001-008-stabilized-english-v3-3.ts";

type AnyCaselet = {
  caseletId: string;
  clues: readonly { text: string }[];
  children: readonly {
    answer: string;
    explanation: { lines: string[] };
    [key: string]: unknown;
  }[];
  [key: string]: unknown;
};

type Generator = (seed: string, count: number) => AnyCaselet[];

const packages: readonly [string, Generator, Generator][] = [
  ["LP-001", generateLp001BatchStabilizedV2 as Generator, generateLp001BatchStabilizedV3_3 as Generator],
  ["LP-002", generateLp002BatchStabilizedV2 as Generator, generateLp002BatchStabilizedV3_3 as Generator],
  ["LP-003", generateLp003BatchStabilizedV2 as Generator, generateLp003BatchStabilizedV3_3 as Generator],
  ["LP-004", generateLp004BatchStabilizedV2 as Generator, generateLp004BatchStabilizedV3_3 as Generator],
  ["LP-005", generateLp005BatchStabilizedV2 as Generator, generateLp005BatchStabilizedV3_3 as Generator],
  ["LP-006", generateLp006BatchStabilizedV2 as Generator, generateLp006BatchStabilizedV3_3 as Generator],
  ["LP-007", generateLp007BatchStabilizedV2 as Generator, generateLp007BatchStabilizedV3_3 as Generator],
  ["LP-008", generateLp008BatchStabilizedV2 as Generator, generateLp008BatchStabilizedV3_3 as Generator],
];

function stripExplanations(caselet: AnyCaselet) {
  const { children, ...rest } = caselet;
  return {
    ...rest,
    children: children.map(({ explanation: _explanation, ...child }) => child),
  };
}

function tableCount(text: string): number {
  return (text.match(/\|---(?:\|---)+\|/gu) ?? []).length;
}

assert.equal(LP_001_008_STABILIZED_ENGLISH_V3_3.unresolvedPlaceholder, "?");
assert.equal(LP_001_008_STABILIZED_ENGLISH_V3_3.changesPuzzleSemantics, false);
assert.equal(LP_001_008_STABILIZED_ENGLISH_V3_3.changesOptions, false);
assert.equal(LP_001_008_STABILIZED_ENGLISH_V3_3.changesAnswer, false);

for (const [packageId, generateV2, generateV33] of packages) {
  const seed = `v3-3-progressive-table-proof:${packageId}`;
  const before = generateV2(seed, 24);
  const after = generateV33(seed, 24);
  assert.equal(after.length, before.length, `${packageId} caselet count changed`);

  let questionsWithPlaceholder = 0;
  let questionsWithCaseTables = 0;
  const headings = new Set<string>();

  for (let index = 0; index < before.length; index += 1) {
    const oldCaselet = before[index]!;
    const newCaselet = after[index]!;
    assert.deepEqual(stripExplanations(newCaselet), stripExplanations(oldCaselet), `${packageId} V3.3 changed non-explanation content at ${newCaselet.caseletId}`);

    for (const child of newCaselet.children) {
      assert.equal(child.explanation.lines.length, newCaselet.clues.length + 2, `${packageId} wrong explanation step count`);

      for (let clueIndex = 0; clueIndex < newCaselet.clues.length; clueIndex += 1) {
        const line = child.explanation.lines[clueIndex]!;
        assert.ok(line.includes(newCaselet.clues[clueIndex]!.text), `${packageId} clue text missing from step ${clueIndex + 1}`);
        assert.ok(tableCount(line) >= 1, `${packageId} step ${clueIndex + 1} has no working table`);
        const heading = line.split(" — ")[0] ?? "";
        headings.add(heading.replace(/^\*\*Step \d+: /u, "").replace(/\*\*$/u, ""));
      }

      const shared = child.explanation.lines.slice(0, -1).join("\n");
      if (/\?/.test(shared)) questionsWithPlaceholder += 1;

      const caseLine = child.explanation.lines.find((line) => line.includes("**Case 1**"));
      if (caseLine) {
        questionsWithCaseTables += 1;
        assert.ok(caseLine.includes("**Case 2**"), `${packageId} Case 2 missing`);
        assert.ok(tableCount(caseLine) >= 3, `${packageId} case step must show working table plus two case tables`);
      }

      const finalArrangement = child.explanation.lines.at(-2)!;
      assert.match(finalArrangement, /Complete the arrangement/u, `${packageId} final arrangement step missing`);
      assert.ok(tableCount(finalArrangement) >= 1, `${packageId} final arrangement table missing`);
      assert.doesNotMatch(finalArrangement, /\?/u, `${packageId} final table still contains placeholders`);

      const finalAnswer = child.explanation.lines.at(-1)!;
      assert.ok(finalAnswer.includes(child.answer), `${packageId} final answer not stated`);
      assert.doesNotMatch(shared, /solver found|solution count|associated/iu);
    }
  }

  assert.ok(questionsWithPlaceholder > 0, `${packageId} never shows ? placeholders`);
  assert.ok(questionsWithCaseTables > 0, `${packageId} never shows proper Case 1 / Case 2 tables`);
  assert.ok(headings.size >= 3, `${packageId} step-heading language does not vary enough`);

  console.log(`${packageId} V3.3 progressive-table proof passed for ${after.length} caselets / ${after.flatMap((caselet) => caselet.children).length} questions.`);
}
