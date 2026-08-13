import assert from "node:assert/strict";
import {
  buildIneCp005ReviewPack,
  renderIneCp005ReviewMarkdown,
} from "./review-pack";

const rows = buildIneCp005ReviewPack();
assert.equal(rows.length, 48);
assert.equal(new Set(rows.map((entry) => entry.authorityId)).size, 4);
assert.equal(new Set(rows.map((entry) => entry.context)).size, 8);
assert.ok(
  rows.every(
    (entry) => entry.options.length === 4 && new Set(entry.options).size === 4,
  ),
);
assert.ok(
  rows.every(
    (entry) => entry.options[entry.correctIndex] === entry.correctOption,
  ),
);
assert.ok(rows.every((entry) => entry.mockSolution.length > 60));
assert.ok(rows.every((entry) => entry.mockSolution.length <= 500));
assert.ok(rows.every((entry) => entry.learningSolution.length > 100));
assert.ok(rows.every((entry) => entry.sourceLedgerIds.length > 0));
assert.equal(new Set(rows.map((entry) => entry.recordId)).size, 48);
assert.deepEqual(buildIneCp005ReviewPack(), rows);
for (const authority of new Set(rows.map((entry) => entry.authorityId))) {
  const positions = [0, 0, 0, 0];
  rows
    .filter((entry) => entry.authorityId === authority)
    .forEach((entry) => positions[entry.correctIndex]++);
  assert.deepEqual(positions, [3, 3, 3, 3]);
}
const markdown = renderIneCp005ReviewMarkdown(rows);
assert.equal((markdown.match(/^### Explanation$/gm) ?? []).length, 48);
assert.equal((markdown.match(/^### Learning solution$/gm) ?? []).length, 0);
assert.equal((markdown.match(/^## /gm) ?? []).length, 48);
assert.equal((markdown.match(/^### Options$/gm) ?? []).length, 48);
assert.ok(!/\bE[1-9]\b/.test(markdown));
assert.ok(!/\b(?:undefined|null|NaN)\b/.test(markdown));
assert.ok(!/Ã¢â‚¬Å“|Ã¢â‚¬Â|Ã¢â€°|Ãƒ|Ã¯Â¿Â½|ï¿½/.test(markdown));
console.log("INE-CP-005 review-pack audit passed.", {
  rowCount: rows.length,
  authorityCount: 4,
  contextCount: 8,
});
