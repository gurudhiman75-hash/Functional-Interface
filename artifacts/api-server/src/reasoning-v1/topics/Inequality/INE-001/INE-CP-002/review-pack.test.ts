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
assert.ok(rows.every((row) => row.statements.length >= 4));
assert.ok(rows.every((row) => row.options.length === 4));
assert.ok(rows.every((row) => new Set(row.options).size === 4));
assert.ok(rows.every((row) => row.options.includes(row.correctOption)));
assert.ok(rows.every((row) => row.explanation.length > 220));
assert.ok(rows.every((row) => !/\bE\d+\b/.test(row.explanation)));
assert.ok(rows.every((row) => !row.explanation.includes("A valid model has")));
assert.ok(
  rows.every((row) => !row.explanation.includes("independently verified")),
);

assert.deepEqual(buildIneCp002ReviewPack(4), rows);
const markdown = renderIneCp002ReviewMarkdown(rows);
assert.ok(markdown.startsWith("# INE-CP-002 English Prototype Review Pack"));
assert.equal((markdown.match(/^## /gm) ?? []).length, 36);
assert.equal((markdown.match(/^### Options$/gm) ?? []).length, 36);
assert.equal((markdown.match(/^\*\*Correct:\*\*/gm) ?? []).length, 36);
assert.ok(markdown.includes("Permanent QLs remain unallocated"));
assert.ok(!markdown.includes("undefined"));

console.log("INE-CP-002 review-pack audit passed.", {
  rowCount: rows.length,
  authorityCount: new Set(rows.map((row) => row.authorityId)).size,
  prototypeCount: new Set(rows.map((row) => row.prototypeId)).size,
});
