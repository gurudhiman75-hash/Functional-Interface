import assert from "node:assert/strict";
import { generateCircularCaselet, SEA_CP003_BLUEPRINTS } from "../cp003/generator.ts";
import { projectCircularCaseletToQuestionStudio } from "./question-studio-schema.ts";

const bands = new Set<string>();
let bundles = 0;

for (const blueprint of SEA_CP003_BLUEPRINTS) {
  for (let seed = 0; seed < 24; seed += 1) {
    const caselet = generateCircularCaselet(
      `SEA-QS-SCHEMA-${blueprint}-${seed}`,
      blueprint,
    );
    const bundle = projectCircularCaseletToQuestionStudio(caselet);
    bundles += 1;

    assert.equal(bundle.parent.queryMixFreezeStatus, "FROZEN");
    assert.equal(bundle.parent.diagramPolicy, "EXPLANATION_ONLY");
    assert.ok(bundle.parent.explanationDiagramScene);
    assert.equal(Object.prototype.hasOwnProperty.call(bundle.parent, "diagramScene"), false);

    for (const child of bundle.children) {
      assert.equal(child.difficulty.status, "STRUCTURAL_AUDITED_V1");
      assert.ok(["Easy", "Medium", "Hard"].includes(child.difficulty.band));
      assert.ok(Number.isInteger(child.difficulty.score));
      assert.ok(child.difficulty.reasons.length > 0);
      assert.equal(Object.prototype.hasOwnProperty.call(child, "diagram"), false);
      assert.equal(Object.prototype.hasOwnProperty.call(child, "diagramScene"), false);
      bands.add(child.difficulty.band);
    }
  }
}

assert.ok(bands.has("Medium"));
assert.ok(bands.size >= 1);

console.log(JSON.stringify({
  status: "PASS_SEA_001_QUESTION_STUDIO_SCHEMA_AUDIT",
  bundles,
  observedBands: [...bands].sort(),
  questionLevelDiagramLeak: false,
  diagramPolicy: "EXPLANATION_ONLY",
}, null, 2));
