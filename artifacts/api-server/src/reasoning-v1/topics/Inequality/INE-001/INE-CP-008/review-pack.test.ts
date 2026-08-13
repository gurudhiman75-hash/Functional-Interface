import assert from "node:assert/strict";
import {
  buildIneCp008ReviewPack,
  renderIneCp008ReviewMarkdown,
} from "./review-pack";

const rows = buildIneCp008ReviewPack();
assert.equal(rows.length, 32);
assert.equal(
  rows.filter((entry) => entry.deliveryProfile === "EXAM_PRACTICE_PROTOTYPE")
    .length,
  24,
);
assert.equal(
  rows.filter(
    (entry) => entry.deliveryProfile === "GUIDED_ADVANCED_PROTOTYPE",
  ).length,
  8,
);
assert.ok(rows.every((entry) => entry.options.length === 4));
assert.ok(rows.every((entry) => new Set(entry.options).size === 4));
assert.ok(
  rows.every(
    (entry) => entry.correctOption === entry.options[entry.correctIndex],
  ),
);
assert.ok(rows.every((entry) => entry.explanation.length >= 70));
assert.ok(rows.every((entry) => entry.explanation.length <= 300));
assert.ok(
  rows.every(
    (entry) =>
      !/\b(?:endpoint|model|formally|solver|strict parts|strongest definite relation|carry|carries)\b/i.test(
        entry.explanation,
      ),
  ),
);
const reconstructionRows = rows.filter(
  (entry) => entry.authorityId === "RECONSTRUCT_MISSING_RELATION",
);
assert.equal(
  new Set(
    reconstructionRows.map((entry) => [...entry.options].sort().join("|")),
  ).size,
  5,
);
const markdown = renderIneCp008ReviewMarkdown(rows);
assert.match(markdown, /# INE-CP-008 English Prototype Review Pack/);
assert.match(markdown, /possible but is not definitely true/i);
assert.match(markdown, /^\d+\. `[><=]`$/m);
assert.doesNotMatch(markdown, /^\d+\. [#*+_-]\s*$/m);
assert.doesNotMatch(markdown, /\b(?:undefined|null|NaN)\b/i);
console.log("INE-CP-008 review-pack audit passed.", { rowCount: rows.length });
