import { strict as assert } from "node:assert";
import { resolve } from "node:path";

import { renderEng001Cp005ReviewV1, writeEng001Cp005ReviewV1 } from "../chapters/error-spotting/ENG-001/CP005/eng-001-cp005-review-v1-export";

const first = renderEng001Cp005ReviewV1();
const second = renderEng001Cp005ReviewV1();
assert.equal(first, second, "CP005 review export must be byte-for-byte deterministic");
assert.equal((first.match(/^### PRP-/gm) ?? []).length, 60, "CP005 review must contain exactly 60 questions");
assert.equal((first.match(/^## Easy$/gm) ?? []).length, 1);
assert.equal((first.match(/^## Medium$/gm) ?? []).length, 1);
assert.equal((first.match(/^## Hard$/gm) ?? []).length, 1);
assert.match(first, /HUMAN_REVIEW_PENDING/);

const outputPath = resolve(process.cwd(), "dist/english-v1/ENG-001-CP005-REVIEW-V1.md");
writeEng001Cp005ReviewV1(outputPath);
console.log("ENG-001 CP005 deterministic human-review export passed.");
