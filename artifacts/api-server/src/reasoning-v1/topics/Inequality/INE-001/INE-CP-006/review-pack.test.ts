import assert from "node:assert/strict";
import {
  buildIneCp006ReviewPack,
  renderIneCp006ReviewMarkdown,
} from "./review-pack";

const rows = buildIneCp006ReviewPack();
assert.equal(rows.length, 48);
assert.equal(new Set(rows.map((entry) => entry.authorityId)).size, 4);
assert.equal(new Set(rows.map((entry) => entry.symbolSetId)).size, 4);
assert.deepEqual(
  Object.fromEntries(
    [...new Set(rows.map((entry) => entry.authorityId))].map((authority) => [
      authority,
      rows.filter((entry) => entry.authorityId === authority).length,
    ]),
  ),
  {
    DECODE_FIXED_MAP_RELATION: 7,
    SOLVE_FIXED_MAP_CODED_CHAIN: 17,
    EVALUATE_FIXED_MAP_CODED_CONCLUSIONS: 17,
    ENCODE_FIXED_MAP_RELATION: 7,
  },
);
assert.equal(
  rows.filter((entry) => entry.deliveryProfile === "EXAM_PRACTICE_PROTOTYPE")
    .length,
  34,
);
assert.equal(
  rows.filter((entry) => entry.deliveryProfile === "GUIDED_CONCEPT").length,
  14,
);
assert.ok(
  rows
    .filter((entry) => entry.deliveryProfile === "EXAM_PRACTICE_PROTOTYPE")
    .every(
      (entry) =>
        entry.symbolProfile === "ASCII_EXAM_PROFILE" &&
        entry.symbolSetId.startsWith("ASCII_"),
    ),
);
assert.ok(
  rows
    .filter((entry) => entry.deliveryProfile === "GUIDED_CONCEPT")
    .every((entry) => entry.symbolProfile === "UNICODE_GUIDED_PROFILE"),
);
assert.equal(Math.max(...rows.map((entry) => entry.statementCount)), 8);
assert.ok(rows.some((entry) => entry.conclusionCount === 3));
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
assert.match(markdown, /34 questions to exam-shaped chain solving/);
assert.match(markdown, /III\./);
assert.ok(!/\b(?:undefined|null|NaN)\b/i.test(markdown));
assert.ok(!/Ã¢â‚¬Å“|Ã¢â‚¬Â|Ã¢â€°|Ãƒ|Ã¯Â¿Â½|ï¿½/.test(markdown));

console.log("INE-CP-006 review-pack audit passed.", {
  rowCount: rows.length,
  authorityCount: new Set(rows.map((entry) => entry.authorityId)).size,
  symbolSetCount: new Set(rows.map((entry) => entry.symbolSetId)).size,
});
