import assert from "node:assert/strict";

import {
  buildIneCp004ReviewPack,
  renderIneCp004ReviewMarkdown,
} from "./review-pack";

const rows = buildIneCp004ReviewPack();
assert.equal(rows.length, 48);
assert.equal(new Set(rows.map((row) => row.authorityId)).size, 4);
assert.equal(new Set(rows.map((row) => row.topologyId)).size, 12);
assert.ok(rows.every((row) => row.statements.length >= 2));
assert.ok(rows.every((row) => row.options.length === 4));
assert.ok(
  rows.every((row) => new Set(row.options).size === row.options.length),
);
assert.ok(
  rows.every((row) => row.options[row.correctIndex] === row.correctOption),
);
assert.ok(rows.every((row) => row.mockSolution.length > 100));
assert.ok(rows.every((row) => row.mockSolution.length < 750));
assert.ok(rows.every((row) => row.learningSolution.length > 150));
assert.ok(rows.every((row) => row.sourceLedgerIds.length > 0));
assert.ok(rows.every((row) => row.permanentQlId === null));
assert.ok(rows.every((row) => row.questionStudioVisible === false));
assert.equal(new Set(rows.map((row) => row.recordId)).size, rows.length);
assert.deepEqual(buildIneCp004ReviewPack(), rows);

for (const authority of new Set(rows.map((row) => row.authorityId))) {
  const authorityRows = rows.filter((row) => row.authorityId === authority);
  const optionCount = authorityRows[0]!.options.length;
  const positions = Array.from({ length: optionCount }, () => 0);
  authorityRows.forEach((row) => (positions[row.correctIndex] += 1));
  assert.ok(Math.max(...positions) - Math.min(...positions) <= 1);
}

const markdown = renderIneCp004ReviewMarkdown(rows);
assert.ok(markdown.startsWith("# INE-CP-004 English Prototype Review Pack"));
assert.ok(markdown.includes("Every question has exactly four answer options."));
assert.equal((markdown.match(/^## /gm) ?? []).length, 48);
assert.equal((markdown.match(/^### Options$/gm) ?? []).length, 48);
assert.equal((markdown.match(/^### Explanation$/gm) ?? []).length, 48);
assert.equal((markdown.match(/^### Learning solution$/gm) ?? []).length, 0);
assert.ok(!/\bE[1-9]\b/.test(markdown));
assert.ok(!/\b(?:undefined|null|NaN)\b/.test(markdown));
assert.ok(!/â€œ|â€|â‰|Ã|ï¿½|�/.test(markdown));

console.log("INE-CP-004 review-pack audit passed.", {
  rowCount: rows.length,
  authorityCount: new Set(rows.map((row) => row.authorityId)).size,
  topologyCount: new Set(rows.map((row) => row.topologyId)).size,
});
