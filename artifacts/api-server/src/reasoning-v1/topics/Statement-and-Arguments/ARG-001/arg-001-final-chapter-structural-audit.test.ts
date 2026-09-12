import assert from "node:assert/strict";

import { ARG_CP003_TEMPLATES_BY_QL } from "./cp003-templates.ts";
import { ARG_QL_IDS } from "./types.ts";

const EXPECTED_DIFFICULTIES = new Set(["EASY", "MEDIUM", "HARD"]);
const EXPECTED_ANSWER_CLASSES = new Set(["ONLY_I", "ONLY_II", "BOTH", "NEITHER"]);

const summary: Record<string, unknown> = {};

for (const qlId of ARG_QL_IDS) {
  const templates = ARG_CP003_TEMPLATES_BY_QL[qlId];
  assert.equal(templates.length, 8, `${qlId}: final chapter contract requires exactly eight core semantic templates`);

  const ids = new Set(templates.map((template) => template.id));
  const archetypes = new Set(templates.map((template) => template.archetype));
  const difficulties = new Set(templates.map((template) => template.difficulty));
  const answerClasses = new Set(templates.map((template) => template.answerClass));

  assert.equal(ids.size, templates.length, `${qlId}: duplicate template IDs`);
  assert.equal(archetypes.size, templates.length, `${qlId}: duplicate semantic archetypes inside the permanent QL`);
  assert.deepEqual(difficulties, EXPECTED_DIFFICULTIES, `${qlId}: Easy/Medium/Hard semantic coverage drifted`);
  assert.deepEqual(answerClasses, EXPECTED_ANSWER_CLASSES, `${qlId}: all four two-argument answer classes must remain represented`);

  let minimumVariantCapacity = Number.POSITIVE_INFINITY;
  for (const template of templates) {
    assert.equal(template.dimensions.length, 4, `${template.id}: expected four semantic dimensions`);
    const dimensionSizes = template.dimensions.map((dimension) => new Set(dimension).size);
    assert.ok(dimensionSizes.every((size) => size >= 4), `${template.id}: each semantic dimension must keep at least four distinct values`);
    const capacity = dimensionSizes.reduce((product, size) => product * size, 1);
    minimumVariantCapacity = Math.min(minimumVariantCapacity, capacity);
    assert.ok(capacity >= 256, `${template.id}: semantic variation capacity fell below 256`);
  }

  summary[qlId] = {
    templateCount: templates.length,
    archetypeCount: archetypes.size,
    difficulties: [...difficulties],
    answerClasses: [...answerClasses],
    minimumVariantCapacityPerTemplate: minimumVariantCapacity,
    minimumSemanticCapacityAcrossTemplates: minimumVariantCapacity * templates.length,
  };
}

assert.equal(ARG_QL_IDS.length, 6, "ARG-001 permanent QL count drifted");
assert.equal(
  Object.values(ARG_CP003_TEMPLATES_BY_QL).reduce((sum, templates) => sum + templates.length, 0),
  48,
  "ARG-001 must retain 48 permanent core templates",
);

console.log(JSON.stringify({
  status: "PASS_ARG_001_FINAL_CHAPTER_STRUCTURAL_AUDIT",
  permanentQlCount: ARG_QL_IDS.length,
  coreTemplateCount: 48,
  perQl: summary,
}, null, 2));
