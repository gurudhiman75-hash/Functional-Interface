import assert from "node:assert/strict";
import { buildIneCp007ReviewPack, renderIneCp007ReviewMarkdown } from "./review-pack";

const rows = buildIneCp007ReviewPack();
assert.equal(rows.length, 32);
assert.equal(rows.filter((entry) => entry.deliveryProfile === "EXAM_PRACTICE_PROTOTYPE").length, 24);
assert.equal(rows.filter((entry) => entry.deliveryProfile === "GUIDED_DISCOVERY").length, 8);
assert.ok(rows.every((entry) => entry.options.length === 4));
assert.ok(rows.every((entry) => new Set(entry.options).size === 4));
assert.ok(rows.every((entry) => entry.correctOption === entry.options[entry.correctIndex]));
const markdown = renderIneCp007ReviewMarkdown(rows);
assert.match(markdown, /# INE-CP-007 English Prototype Review Pack/);
assert.match(markdown, /### Explanation/);
assert.doesNotMatch(markdown, /\b(?:undefined|null|NaN)\b/i);
console.log("INE-CP-007 review-pack audit passed.", { rowCount: rows.length });
