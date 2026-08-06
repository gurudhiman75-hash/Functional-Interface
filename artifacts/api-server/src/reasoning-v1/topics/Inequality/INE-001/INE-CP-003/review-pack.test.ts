import assert from "node:assert/strict";

import {
  buildIneCp003ReviewPack,
  renderIneCp003ReviewMarkdown,
} from "./review-pack";

const rows = buildIneCp003ReviewPack();
assert.equal(rows.length, 72);
assert.equal(new Set(rows.map((row) => row.authorityId)).size, 6);
assert.ok(rows.every((row) => row.statements.length >= 2));
assert.ok(rows.every((row) => row.options.length === 4));
assert.ok(rows.every((row) => new Set(row.options).size === 4));
assert.ok(
  rows.every((row) => row.options[row.correctIndex] === row.correctOption),
);
assert.ok(rows.every((row) => row.mockSolution.length > 100));
assert.ok(rows.every((row) => row.learningSolution.length > 200));
assert.ok(rows.every((row) => row.permanentQlId === null));
assert.ok(rows.every((row) => row.questionStudioVisible === false));
assert.equal(new Set(rows.map((row) => row.recordId)).size, rows.length);
assert.deepEqual(buildIneCp003ReviewPack(), rows);

const answerPositions = [0, 0, 0, 0];
rows.forEach((row) => (answerPositions[row.correctIndex] += 1));
assert.deepEqual(answerPositions, [18, 18, 18, 18]);

const markdown = renderIneCp003ReviewMarkdown(rows);
assert.ok(markdown.startsWith("# INE-CP-003 English Prototype Review Pack"));
assert.equal((markdown.match(/^## /gm) ?? []).length, 72);
assert.equal((markdown.match(/^### Options$/gm) ?? []).length, 72);
assert.equal((markdown.match(/^### Mock solution$/gm) ?? []).length, 72);
assert.equal((markdown.match(/^### Learning solution$/gm) ?? []).length, 72);
assert.ok(!/\bE\d+\b/.test(markdown));
assert.ok(!/\b(?:undefined|null|NaN)\b/.test(markdown));

console.log("INE-CP-003 review-pack audit passed.", {
  rowCount: rows.length,
  authorityCount: new Set(rows.map((row) => row.authorityId)).size,
  answerPositions,
});
