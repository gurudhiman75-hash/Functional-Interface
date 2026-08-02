import assert from "node:assert/strict";

import {
  buildIneCp001ReviewPack,
  renderIneCp001ReviewMarkdown,
} from "./review-pack";

const rows = buildIneCp001ReviewPack(4);
assert.equal(rows.length, 32);
assert.equal(new Set(rows.map((row) => row.authorityId)).size, 8);
assert.equal(new Set(rows.map((row) => row.prototypeId)).size, 8);
assert.ok(rows.every((row) => row.permanentQlId === null));
assert.ok(rows.every((row) => row.questionStudioVisible === false));
assert.ok(rows.every((row) => row.statements.length >= 1));
assert.ok(rows.every((row) => row.options.length === 4));
assert.ok(rows.every((row) => row.options.includes(row.correctOption)));
assert.ok(rows.every((row) => row.explanation.length > 250));

const repeat = buildIneCp001ReviewPack(4);
assert.deepEqual(repeat, rows);

const markdown = renderIneCp001ReviewMarkdown(rows);
assert.ok(markdown.startsWith("# INE-CP-001 English Prototype Review Pack"));
assert.equal((markdown.match(/^## /gm) ?? []).length, 32);
assert.ok(markdown.includes("Permanent QLs remain unallocated"));
assert.ok(!markdown.includes("undefined"));

console.log("INE-CP-001 review-pack audit passed.", {
  rowCount: rows.length,
  authorityCount: new Set(rows.map((row) => row.authorityId)).size,
  prototypeCount: new Set(rows.map((row) => row.prototypeId)).size,
});
