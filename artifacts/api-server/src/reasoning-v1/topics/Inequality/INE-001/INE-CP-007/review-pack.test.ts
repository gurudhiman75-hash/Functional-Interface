import assert from "node:assert/strict";
import { buildIneCp007ReviewPack, renderIneCp007ReviewMarkdown } from "./review-pack";

const rows = buildIneCp007ReviewPack();
assert.equal(rows.length, 32);
assert.equal(rows.filter((entry) => entry.deliveryProfile === "EXAM_PRACTICE_PROTOTYPE").length, 24);
assert.equal(rows.filter((entry) => entry.deliveryProfile === "GUIDED_DISCOVERY").length, 8);
assert.ok(rows.every((entry) => entry.options.length === 4));
assert.ok(rows.every((entry) => new Set(entry.options).size === 4));
assert.ok(rows.every((entry) => entry.correctOption === entry.options[entry.correctIndex]));
const recoveryRows = rows.filter(
  (entry) => entry.authorityId === "RECOVER_MISSING_MAP_ENTRY",
);
assert.equal(recoveryRows.length, 4);
assert.ok(recoveryRows.every((entry) => entry.codeKey.length === 3));
assert.ok(recoveryRows.every((entry) => entry.evidence.length === 4));
assert.ok(recoveryRows.every((entry) => entry.explanation.length >= 140));
assert.ok(
  recoveryRows.every(
    (entry) => !entry.explanation.includes("The only meaning left"),
  ),
);
const markdown = renderIneCp007ReviewMarkdown(rows);
assert.match(markdown, /# INE-CP-007 English Prototype Review Pack/);
assert.match(markdown, /### Explanation/);
assert.doesNotMatch(markdown, /\b(?:undefined|null|NaN)\b/i);
console.log("INE-CP-007 review-pack audit passed.", { rowCount: rows.length });
