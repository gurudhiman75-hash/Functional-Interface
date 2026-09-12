import { strict as assert } from "node:assert";
import { generateQuestion, listQuantV4Packages } from "../../../../../generation-engine";

const EXPECTED_CP_IDS = [
  "RAP-CP-014",
  "RAP-CP-015",
  "RAP-CP-016",
  "RAP-CP-017",
  "RAP-CP-018",
  "RAP-CP-019",
  "RAP-CP-020",
  "RAP-CP-021",
  "RAP-CP-022",
];
const EXPECTED_LANGUAGES = ["en", "hi", "pa"];

function hasUnresolvedPlaceholder(value: string) {
  const withoutLatexCommandArgs = value.replace(/\\[A-Za-z]+\{[^}]*\}/g, "");
  return /\{[A-Za-z][A-Za-z0-9_]*\}/.test(withoutLatexCommandArgs);
}

const rap003Discovery = listQuantV4Packages().find((pkg) => pkg.packageId === "RAP-003");

assert.ok(rap003Discovery, "RAP-003 must be discoverable through Quant V4 package discovery.");
assert.equal(rap003Discovery.enabled, true, "RAP-003 should remain enabled in Question Studio.");
assert.deepEqual(rap003Discovery.supportedLanguages, EXPECTED_LANGUAGES, "RAP-003 must preserve its current multilingual Question Studio surface.");
assert.equal(rap003Discovery.topic, "Arithmetic");
assert.equal(rap003Discovery.subtopic, "Ratio & Proportion");
assert.equal(rap003Discovery.canonicalProblems.length, 9);
assert.deepEqual(
  rap003Discovery.canonicalProblems.map((cp) => cp.id).sort(),
  EXPECTED_CP_IDS,
);
assert.equal(
  rap003Discovery.canonicalProblems.some((cp) => cp.id === "RAP-CP-013"),
  false,
  "Legacy Partnership CP013 must not be exposed by RAP-003 discovery.",
);

await assert.rejects(
  () =>
    generateQuestion({
      packageId: "RAP-003",
      cpId: "RAP-CP-013",
      language: "en",
      count: 1,
      seed: "rap-003-retired-partnership-block",
    }),
  /Unknown canonical problem|RAP-CP-013/i,
  "Question Studio must reject retired RAP-CP-013 product generation.",
);

const generated = await generateQuestion({
  packageId: "RAP-003",
  language: "en",
  count: 20,
  seed: "rap-003-question-studio-smoke",
});

assert.equal(generated.questions.length, 20);
assert.equal(generated.questionPackages.length, 20);

const coveredCpIds = new Set<string>();
for (const [index, question] of generated.questions.entries()) {
  const pkg = generated.questionPackages[index]!;
  const renderedStem = String((question as any).stem ?? (question as any).text ?? "");
  const answer = String((question as any).answer ?? "");
  const explanation = String((question as any).explanation ?? "");
  const combinedText = `${renderedStem}\n${answer}\n${explanation}`;

  assert.equal(pkg.archetypeId, "RAP-003");
  assert.equal(pkg.language, "en");
  assert.equal((question as any).metadata?.language, "en");
  assert.equal((question as any).packageId, "RAP-003");
  assert.equal((question as any).patternId, "RAP-003");
  assert.ok(renderedStem.trim().length > 0);
  assert.ok(answer.trim().length > 0);
  assert.ok(Array.isArray((question as any).options), "Question Studio preview should include options.");
  assert.equal((question as any).options.length, 4, "Question Studio preview should include four options.");
  assert.ok(Number.isInteger((question as any).correctIndex), "Question Studio preview should include integer correctIndex.");
  assert.ok((question as any).correctIndex >= 0 && (question as any).correctIndex < (question as any).options.length, "correctIndex must point to one of the options.");
  assert.equal(hasUnresolvedPlaceholder(combinedText), false, `Unresolved placeholder in generated text: ${combinedText}`);
  assert.equal(/\b(undefined|null|NaN|Infinity)\b/i.test(combinedText), false, `Internal value leaked: ${combinedText}`);
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check: any) => !check.passed).map((check: any) => check.message).join("; "));
  assert.notEqual(pkg.canonicalProblemId, "RAP-CP-013", "Random RAP-003 generation must not emit legacy Partnership CP013.");
  coveredCpIds.add(pkg.canonicalProblemId);
}

assert.deepEqual([...coveredCpIds].sort(), EXPECTED_CP_IDS);

for (const language of ["hi", "pa"] as const) {
  const localized = await generateQuestion({
    packageId: "RAP-003",
    language,
    count: 2,
    seed: `rap-003-question-studio-smoke-${language}`,
  });
  assert.equal(localized.questionPackages.length, 2);
  for (const pkg of localized.questionPackages) {
    assert.equal(pkg.language, language);
    assert.notEqual(pkg.canonicalProblemId, "RAP-CP-013");
    assert.equal(pkg.validation.valid, true);
  }
}

console.log("RAP-003 Question Studio multilingual smoke passed after CP013 retirement.");
console.log("Discovery: enabled=true, supportedLanguages=en/hi/pa, activeCPs=9");
console.log("Legacy RAP-CP-013 product exposure: blocked");
console.log("Generated English questions: 20");
console.log(`Covered CPs: ${[...coveredCpIds].sort().join(", ")}`);
console.log("Hindi/Punjabi generation: preserved");
