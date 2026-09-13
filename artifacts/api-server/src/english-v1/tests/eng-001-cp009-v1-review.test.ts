import { strict as assert } from "node:assert";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  renderEng001Cp009ReviewV1,
  writeEng001Cp009ReviewV1,
} from "../chapters/error-spotting/ENG-001/CP009/eng-001-cp009-review-v1-export";

const rendered = renderEng001Cp009ReviewV1();
assert.equal((rendered.match(/^### GIP-/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Answer:\*\*/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Explanation:\*\*/gm) ?? []).length, 60);
assert.equal(/trap|shortcut|test-taker|distractor logic/i.test(rendered), false);
assert.equal(
  /enjoy to read|used to walking|must to carry|without to check|Having finish/i.test(rendered),
  true,
  "Review artifact must expose realistic CP009 invalid mutations for human review.",
);

const output = resolve(process.cwd(), "dist/english-v1/ENG-001-CP009-REVIEW-V1.md");
mkdirSync(resolve(process.cwd(), "dist/english-v1"), { recursive: true });
writeEng001Cp009ReviewV1(output);
console.log("[ENG-001-CP009-REVIEW-V1] PASS 60-question deterministic human-review artifact");
