import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CP012_SCENES_V1 } from "../chapters/error-spotting/ENG-001/CP012/cp012-catalog-v1";
import { renderEng001Cp012ReviewV1, writeEng001Cp012ReviewV1 } from "../chapters/error-spotting/ENG-001/CP012/eng-001-cp012-review-v1-export";

// Keep the review artifact at repository-root dist/ so CI and the human-review handoff consume the same bytes.
const outputPath = resolve(process.cwd(), "dist/english-v1/ENG-001-CP012-REVIEW-V1.md");
const rendered = renderEng001Cp012ReviewV1();
assert.match(rendered, /REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED/);
assert.equal((rendered.match(/^### VNR-/gm) ?? []).length, 68);
for (const scene of CP012_SCENES_V1) {
  assert.equal(rendered.includes(`### ${scene.id} · ${scene.ruleId} · ENG-001-QL001`), true, `${scene.id} missing from review`);
  assert.equal(rendered.includes(scene.reason), true, `${scene.id} explanation reason missing`);
}
writeEng001Cp012ReviewV1(outputPath);
assert.equal(readFileSync(outputPath, "utf8"), rendered);
console.log(JSON.stringify({ status: "PASS_ENG_001_CP012_REVIEW_V1", questions: 68, outputPath }, null, 2));
