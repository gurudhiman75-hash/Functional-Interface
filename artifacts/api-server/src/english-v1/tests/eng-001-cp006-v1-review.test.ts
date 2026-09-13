import { strict as assert } from "node:assert";
import { resolve } from "node:path";

import { renderEng001Cp006ReviewV1, writeEng001Cp006ReviewV1 } from "../chapters/error-spotting/ENG-001/CP006/eng-001-cp006-review-v1-export";

const rendered = renderEng001Cp006ReviewV1();
assert.match(rendered, /^# ENG-001 CP006 — Adjectives, Adverbs and Comparison — Human Review V1/m);
assert.match(rendered, /## Easy/);
assert.match(rendered, /## Medium/);
assert.match(rendered, /## Hard/);
assert.equal((rendered.match(/^### CMP-/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Answer:\*\*/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Explanation:\*\*/gm) ?? []).length, 60);
assert.doesNotMatch(rendered, /· ENG-001-QL007/);
assert.doesNotMatch(rendered, /^\*\*Answer:\*\* No error$/gm);
assert.doesNotMatch(rendered, /\b(?:gooder|goodest|badder|baddest|wellly|more good|more bad|most good|most bad)\b/i);
assert.doesNotMatch(rendered, /\blonger compared with\b/i);
assert.doesNotMatch(rendered, /\bjourney[^\n.]*than the previous week\b/i);
assert.doesNotMatch(rendered, /\bAfter the\s*\n\s*[A-D]\. latest expansion\b/i);
assert.doesNotMatch(rendered, /^A\. By several acres,/m);
assert.doesNotMatch(rendered, /examined the supporting records close\s+against/i);
assert.doesNotMatch(rendered, /appears sufficiently safely/i);

const outputPath = resolve(process.cwd(), "dist/english-v1/ENG-001-CP006-REVIEW-V1.md");
writeEng001Cp006ReviewV1(outputPath);
console.log("ENG-001 CP006 deterministic human-review export passed.");
