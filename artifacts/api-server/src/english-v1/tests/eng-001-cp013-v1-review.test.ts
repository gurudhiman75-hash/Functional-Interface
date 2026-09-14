import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CP013_SCENES_V1 } from "../chapters/error-spotting/ENG-001/CP013/cp013-catalog-v1";
import { renderEng001Cp013ReviewV1, writeEng001Cp013ReviewV1 } from "../chapters/error-spotting/ENG-001/CP013/eng-001-cp013-review-v1-export";

const outputPath = resolve(process.cwd(), "dist/english-v1/ENG-001-CP013-REVIEW-V1.md");
const rendered = renderEng001Cp013ReviewV1();
assert.match(rendered, /REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED/);
assert.equal((rendered.match(/^### USG-/gm) ?? []).length, 60);
assert.equal((rendered.match(/^\*\*Answer:\*\*/gm) ?? []).length, 60);
for (const scene of CP013_SCENES_V1) {
  assert.equal(rendered.includes(`### ${scene.id} · ${scene.ruleId} · ENG-001-QL001`), true, `${scene.id} missing from review`);
  assert.equal(rendered.includes(scene.reason), true, `${scene.id} explanation reason missing`);
}
writeEng001Cp013ReviewV1(outputPath);
assert.equal(readFileSync(outputPath, "utf8"), rendered);
console.log(JSON.stringify({ status: "PASS_ENG_001_CP013_REVIEW_V1", questions: 60, outputPath }, null, 2));
