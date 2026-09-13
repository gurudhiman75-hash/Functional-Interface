import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { renderEng001Cp009ReviewV2, writeEng001Cp009ReviewV2 } from "../chapters/error-spotting/ENG-001/CP009/eng-001-cp009-review-v2-export";

const APPROVED_SHA256 = "6a59e8cdbc1b1b061205a55690e68fc76724ffd7b24f2cecfdce8de5368e465f";
const rendered = renderEng001Cp009ReviewV2();
assert.equal((rendered.match(/^### GIP-/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Answer:\*\*/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Explanation:\*\*/gm) ?? []).length, 60);
assert.equal(/trap|shortcut|test-taker|distractor logic/i.test(rendered), false);
assert.equal(createHash("sha256").update(rendered, "utf8").digest("hex"), APPROVED_SHA256, "CP009 V2 review artifact must remain byte-for-byte identical to the human-approved batch");
const output = resolve(process.cwd(), "dist/english-v1/ENG-001-CP009-REVIEW-V2.md");
mkdirSync(resolve(process.cwd(), "dist/english-v1"), { recursive: true });
writeEng001Cp009ReviewV2(output);
console.log(`[ENG-001-CP009-REVIEW-V2] PASS approved SHA-256 ${APPROVED_SHA256}`);
