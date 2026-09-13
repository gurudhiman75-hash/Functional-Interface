import { strict as assert } from "node:assert";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { renderEng001Cp008ReviewV1, writeEng001Cp008ReviewV1 } from "../chapters/error-spotting/ENG-001/CP008/eng-001-cp008-review-v1-export";

const rendered = renderEng001Cp008ReviewV1();
assert.equal((rendered.match(/^### NQN-/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Answer:\*\*/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Explanation:\*\*/gm) ?? []).length, 60);
assert.equal(/trap|shortcut|test-taker|distractor logic/i.test(rendered), false);
assert.equal(/\binformations\b|\bequipments\b|\bfurnitures\b|\bluggages\b|\bchilds\b|\btooths\b|\bmouses\b|\bwomans\b/i.test(rendered), true, "Review artifact must expose realistic invalid mutations for human review.");
const output = resolve(process.cwd(), "dist/english-v1/ENG-001-CP008-REVIEW-V1.md");
mkdirSync(resolve(process.cwd(), "dist/english-v1"), { recursive: true });
writeEng001Cp008ReviewV1(output);
console.log("[ENG-001-CP008-REVIEW-V1] PASS 60-question deterministic human-review artifact");
