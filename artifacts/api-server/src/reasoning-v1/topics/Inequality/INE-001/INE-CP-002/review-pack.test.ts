import assert from "node:assert/strict";

import {
  buildIneCp002ReviewPack,
  renderIneCp002ReviewMarkdown,
} from "./review-pack";

const rows = buildIneCp002ReviewPack(4);
assert.equal(rows.length, 36);
assert.equal(new Set(rows.map((row) => row.authorityId)).size, 9);
assert.equal(new Set(rows.map((row) => row.prototypeId)).size, 9);
assert.ok(rows.every((row) => row.permanentQlId === null));
assert.ok(rows.every((row) => row.questionStudioVisible === false));
assert.ok(rows.every((row) => row.statements.length >= 2));
assert.ok(rows.every((row) => row.options.length === 4));
assert.ok(rows.every((row) => new Set(row.options).size === 4));
assert.ok(rows.every((row) => row.options.includes(row.correctOption)));
assert.ok(rows.every((row) => row.explanation.length > 100));
assert.ok(rows.every((row) => row.mockExplanation.length > 60));
assert.ok(rows.every((row) => row.learningExplanation.length > 100));
assert.deepEqual([...new Set(rows.map((row) => row.releaseTier))].sort(), [
  "ADVANCED_PRACTICE",
  "BANKING_PRELIMS",
  "SSC_STANDARD_MOCK",
]);
assert.ok(rows.every((row) => !/\bE\d+\b/.test(row.explanation)));
assert.ok(rows.every((row) => !row.explanation.includes("A valid model has")));
assert.ok(
  rows.every((row) => !row.explanation.includes("independently verified")),
);
assert.equal(new Set(rows.map((row) => row.recordId)).size, rows.length);
assert.ok(rows.every((row) => /^[0-9a-f]{8}$/.test(row.contentHash)));
assert.ok(
  rows
    .filter((row) => row.authorityId === "DETERMINE_DISCONNECTED_PAIR_RELATION")
    .every(
      (row) =>
        row.explanation.includes("separate groups") &&
        !row.explanation.includes("shared upper or lower bound"),
    ),
);
const answerPositions = [0, 0, 0, 0];
for (const row of rows) {
  answerPositions[row.options.indexOf(row.correctOption)] += 1;
}
assert.ok(
  Math.max(...answerPositions) - Math.min(...answerPositions) <= 8,
  `Review-pack answer positions are too imbalanced: ${answerPositions.join(", ")}`,
);

assert.deepEqual(buildIneCp002ReviewPack(4), rows);
const markdown = renderIneCp002ReviewMarkdown(rows);
assert.ok(markdown.startsWith("# INE-CP-002 English Prototype Review Pack"));
assert.equal((markdown.match(/^## /gm) ?? []).length, 36);
assert.equal((markdown.match(/^### Options$/gm) ?? []).length, 36);
assert.equal((markdown.match(/^### Explanation$/gm) ?? []).length, 36);
assert.equal((markdown.match(/^### Learning solution$/gm) ?? []).length, 0);
assert.equal((markdown.match(/^\*\*Correct:\*\*/gm) ?? []).length, 36);
assert.ok(markdown.includes("Permanent QLs remain unallocated"));
assert.ok(!markdown.includes("undefined"));
assert.ok(!/:\s*,/.test(markdown));

console.log("INE-CP-002 review-pack audit passed.", {
  rowCount: rows.length,
  authorityCount: new Set(rows.map((row) => row.authorityId)).size,
  prototypeCount: new Set(rows.map((row) => row.prototypeId)).size,
});
