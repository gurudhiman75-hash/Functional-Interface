import { strict as assert } from "node:assert";
import { generateQuestion, listQuantV4Packages } from "../../../../../generation-engine";

const rap002Discovery = listQuantV4Packages().find((pkg) => pkg.packageId === "RAP-002");

assert.ok(rap002Discovery, "RAP-002 must be discoverable through Quant V4 package discovery.");
assert.equal(rap002Discovery.enabled, true, "RAP-002 should be enabled for English Question Studio discovery.");
assert.deepEqual(rap002Discovery.supportedLanguages, ["en"], "RAP-002 must remain English-only.");
assert.equal(rap002Discovery.topic, "Arithmetic");
assert.equal(rap002Discovery.subtopic, "Ratio & Proportion");
assert.equal(rap002Discovery.canonicalProblems.length, 6);

const generated = await generateQuestion({
  packageId: "RAP-002",
  language: "en",
  count: 12,
  seed: "rap-002-question-studio-smoke",
});

assert.equal(generated.questions.length, 12);
assert.equal(generated.questionPackages.length, 12);

const coveredCpIds = new Set<string>();
for (const [index, question] of generated.questions.entries()) {
  const pkg = generated.questionPackages[index]!;
  const renderedStem = question.stem ?? question.text;
  assert.equal(pkg.archetypeId, "RAP-002");
  assert.equal(pkg.language, "en");
  assert.equal(question.metadata?.language, "en");
  assert.equal(question.packageId, "RAP-002");
  assert.equal(question.patternId, "RAP-002");
  assert.ok(renderedStem.trim().length > 0);
  assert.ok(question.answer.trim().length > 0);
  assert.ok(Array.isArray(question.options), "Question Studio preview should include options.");
  assert.equal(question.options.length, 4, "Question Studio preview should include four options.");
  assert.equal(/\{[^}]+\}/.test(renderedStem), false, `Unresolved placeholder in stem: ${renderedStem}`);
  assert.equal(pkg.validation.valid, true);
  coveredCpIds.add(pkg.canonicalProblemId);
}

assert.deepEqual(
  [...coveredCpIds].sort(),
  ["RAP-CP-007", "RAP-CP-008", "RAP-CP-009", "RAP-CP-010", "RAP-CP-011", "RAP-CP-012"],
);

await assert.rejects(
  () =>
    generateQuestion({
      packageId: "RAP-002",
      language: "hi",
      count: 1,
      seed: "rap-002-question-studio-smoke-hi-block",
    }),
  /English generation only|English only/i,
);

console.log("RAP-002 Question Studio English-only smoke passed.");
console.log("Discovery: enabled=true, supportedLanguages=en");
console.log("Generated questions: 12");
console.log(`Covered CPs: ${[...coveredCpIds].sort().join(", ")}`);
console.log("Hindi/Punjabi exposure: blocked by runtime");
