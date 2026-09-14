import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CP011_SCENES_V1 } from "../chapters/error-spotting/ENG-001/CP011/cp011-catalog-v1";
import { renderEng001Cp011ReviewV1, writeEng001Cp011ReviewV1 } from "../chapters/error-spotting/ENG-001/CP011/eng-001-cp011-review-v1-export";

const outputPath = resolve(process.cwd(), "dist/english-v1/ENG-001-CP011-REVIEW-V1.md");
const rendered = renderEng001Cp011ReviewV1();
assert.match(rendered, /REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED/);
assert.equal((rendered.match(/^### CND-/gm) ?? []).length, 60);
for (const scene of CP011_SCENES_V1) {
  assert.equal(rendered.includes(`### ${scene.id} · ${scene.ruleId} · ENG-001-QL001`), true, `${scene.id} missing from review`);
  assert.equal(rendered.includes(scene.reason), true, `${scene.id} explanation reason missing`);
}
writeEng001Cp011ReviewV1(outputPath);
assert.equal(readFileSync(outputPath, "utf8"), rendered);
console.log(JSON.stringify({ status: "PASS_ENG_001_CP011_REVIEW_V1", questions: 60, outputPath }, null, 2));
