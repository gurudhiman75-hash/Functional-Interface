import { strict as assert } from "node:assert";
import { resolve } from "node:path";

import { renderEng001Cp007ReviewV1, writeEng001Cp007ReviewV1 } from "../chapters/error-spotting/ENG-001/CP007/eng-001-cp007-review-v1-export";

const rendered = renderEng001Cp007ReviewV1();
assert.match(rendered, /^# ENG-001 CP007 — Conjunctions & Parallelism — Human Review V1/m);
assert.match(rendered, /^## Easy$/m);
assert.match(rendered, /^## Medium$/m);
assert.match(rendered, /^## Hard$/m);
assert.equal((rendered.match(/^### CON-/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Answer:\*\*/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Explanation:\*\*/gm) ?? []).length, 60);
assert.equal(rendered.includes("· ENG-001-QL007"), false);
assert.equal(rendered.includes("**Answer:** No error"), false);
assert.doesNotMatch(rendered, /\b(?:trap|shortcut|eliminate options|test-taker|distractor logic)\b/i);

const outputPath = resolve(process.cwd(), "dist/english-v1/ENG-001-CP007-REVIEW-V1.md");
writeEng001Cp007ReviewV1(outputPath);
console.log("[ENG-001-CP007-REVIEW-V1] PASS 60-question deterministic human-review artifact");
