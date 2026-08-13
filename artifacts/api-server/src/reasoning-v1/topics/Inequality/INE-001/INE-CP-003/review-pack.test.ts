import assert from "node:assert/strict";

import {
  buildIneCp003ReviewPack,
  renderIneCp003ReviewMarkdown,
} from "./review-pack";

const rows = buildIneCp003ReviewPack();
assert.equal(rows.length, 84);
assert.equal(new Set(rows.map((row) => row.authorityId)).size, 7);
assert.ok(rows.every((row) => row.statements.length >= 2));
assert.ok(
  rows.every((row) =>
    row.taskKind === "CLASSIFY_CONCLUSION"
      ? row.options.length === 3
      : row.options.length === 4,
  ),
);
assert.ok(
  rows.every((row) => new Set(row.options).size === row.options.length),
);
assert.ok(
  rows.every((row) => row.options[row.correctIndex] === row.correctOption),
);
assert.ok(rows.every((row) => row.mockSolution.length > 60));
assert.ok(rows.every((row) => row.learningSolution.length > 100));
assert.ok(rows.every((row) => !/contradict/i.test(row.options.join(" "))));
assert.ok(rows.every((row) => row.sourceLedgerIds.length > 0));
assert.ok(rows.every((row) => row.permanentQlId === null));
assert.ok(rows.every((row) => row.questionStudioVisible === false));
assert.equal(new Set(rows.map((row) => row.recordId)).size, rows.length);
assert.deepEqual(buildIneCp003ReviewPack(), rows);

const threeChoicePositions = [0, 0, 0];
const fourChoicePositions = [0, 0, 0, 0];
for (const row of rows) {
  if (row.options.length === 3) threeChoicePositions[row.correctIndex] += 1;
  else fourChoicePositions[row.correctIndex] += 1;
}
assert.deepEqual(threeChoicePositions, [8, 8, 8]);
assert.deepEqual(fourChoicePositions, [15, 15, 15, 15]);

const conclusionSetRows = rows.filter(
  (row) => row.taskKind === "EVALUATE_CONCLUSION_SET",
);
assert.equal(conclusionSetRows.length, 12);
assert.ok(conclusionSetRows.every((row) => row.conclusions?.length === 2));

const markdown = renderIneCp003ReviewMarkdown(rows);
assert.ok(
  markdown.startsWith("# INE-CP-003 Revised English Prototype Review Pack"),
);
assert.equal((markdown.match(/^## /gm) ?? []).length, 84);
assert.equal((markdown.match(/^### Options$/gm) ?? []).length, 84);
assert.equal((markdown.match(/^### Explanation$/gm) ?? []).length, 84);
assert.equal((markdown.match(/^### Learning solution$/gm) ?? []).length, 0);
assert.equal((markdown.match(/^### Conclusions$/gm) ?? []).length, 12);
assert.ok(!/\bE[1-9]\b/.test(markdown));
assert.ok(!/\b(?:undefined|null|NaN)\b/.test(markdown));
assert.ok(!/â€œ|â€|â‰|Ã|ï¿½|�/.test(markdown));

console.log("INE-CP-003 review-pack audit passed.", {
  rowCount: rows.length,
  authorityCount: new Set(rows.map((row) => row.authorityId)).size,
  threeChoicePositions,
  fourChoicePositions,
});
