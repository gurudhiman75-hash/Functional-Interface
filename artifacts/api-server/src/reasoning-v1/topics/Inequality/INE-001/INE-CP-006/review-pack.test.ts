import assert from "node:assert/strict";
import {
  buildIneCp006ReviewPack,
  renderIneCp006ReviewMarkdown,
} from "./review-pack";

const rows = buildIneCp006ReviewPack(12);
assert.equal(rows.length, 48);
assert.equal(new Set(rows.map((entry) => entry.authorityId)).size, 4);
assert.equal(new Set(rows.map((entry) => entry.symbolSetId)).size, 4);
for (const row of rows) {
  assert.equal(row.codeKey.length, 5);
  assert.equal(row.options.length, 4);
  assert.equal(new Set(row.options).size, 4);
  assert.equal(row.correctOption, row.options[row.correctIndex]);
  assert.ok(row.mockSolution.length > 80);
  assert.ok(row.learningSolution.length > 160);
  assert.equal(row.permanentQlId, null);
  assert.equal(row.questionStudioVisible, false);
}
const markdown = renderIneCp006ReviewMarkdown(rows);
assert.match(markdown, /# INE-CP-006 English Prototype Review Pack/);
assert.match(markdown, /### Code key/);
assert.match(markdown, /### Learning solution/);
assert.ok(!/\b(?:undefined|null|NaN)\b/i.test(markdown));
assert.ok(!/Ã¢â‚¬Å“|Ã¢â‚¬Â|Ã¢â€°|Ãƒ|Ã¯Â¿Â½|ï¿½/.test(markdown));

console.log("INE-CP-006 review-pack audit passed.", {
  rowCount: rows.length,
  authorityCount: new Set(rows.map((entry) => entry.authorityId)).size,
  symbolSetCount: new Set(rows.map((entry) => entry.symbolSetId)).size,
});
