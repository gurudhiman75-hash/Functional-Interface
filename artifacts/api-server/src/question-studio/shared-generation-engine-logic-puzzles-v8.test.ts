import assert from "node:assert/strict";
import { generateQuestion, listQuestionStudioPackages } from "./shared-generation-engine.ts";

const packages = listQuestionStudioPackages();
const cp04 = packages.find((pkg: any) => String(pkg.packageId ?? pkg.id) === "LP-CP04-COUNTERFACTUAL");
assert.ok(cp04, "Global Question Studio must discover LP-CP04-COUNTERFACTUAL");
assert.deepEqual((cp04 as any).permanentQlIds, ["LP-QL-047"]);
assert.deepEqual((cp04 as any).supportedLanguages, ["en", "hi", "pa"]);
assert.equal((cp04 as any).runtimeMode, "REVIEW_ONLY");
assert.equal((cp04 as any).questionBankWritable, false);
assert.equal((cp04 as any).testEligible, false);
assert.equal((cp04 as any).publiclyPublishable, false);


const packageOnly: any = await generateQuestion({
  packageId: "LP-CP04-COUNTERFACTUAL",
  language: "en",
  seed: "LP-GLOBAL-V8-PACKAGE-ONLY",
  count: 3,
});
assert.equal(packageOnly.questions.length, 3);
assert.equal(packageOnly.generationContext.packageId, "LP-CP04-COUNTERFACTUAL");
assert.ok(packageOnly.questions.every((question: any) => question.patternId === "LP-QL-047"));

for (const language of ["en", "hi", "pa"] as const) {
  const result: any = await generateQuestion({
    packageId: "LP-CP04-COUNTERFACTUAL",
    canonicalProblemId: "LP-QL-047",
    language,
    seed: "LP-GLOBAL-V8-PARITY",
    count: 9,
  });

  assert.equal(result.questions.length, 9);
  assert.equal(result.generationContext.packageId, "LP-CP04-COUNTERFACTUAL");
  assert.equal(result.generationContext.runtimeMode, "REVIEW_ONLY");
  assert.equal(result.generationContext.questionBankWritable, false);
  assert.equal(result.generationContext.testEligible, false);
  assert.equal(result.generationContext.publiclyPublishable, false);

  for (const question of result.questions) {
    assert.equal(question.patternId, "LP-QL-047");
    assert.equal(question.canonicalProblemId, "LP-QL-047");
    assert.equal(question.language, language);
    assert.equal(question.runtimeMode, "REVIEW_ONLY");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.publiclyPublishable, false);
    const heading = language === "en" ? "Clues:" : language === "hi" ? "शर्तें:" : "ਸ਼ਰਤਾਂ:";
    assert.ok(String(question.text).includes(heading));
    assert.ok(String(question.text).split("\n").filter((line) => line.startsWith("- ")).length >= 3);
    assert.ok(String(question.text).trim().endsWith(String(question.text).trim().split("\n").at(-1) ?? ""));
  }
}

const en: any = await generateQuestion({
  canonicalProblemId: "LP-QL-047",
  language: "en",
  seed: "LP-GLOBAL-V8-SAME-ITEM",
  count: 9,
});
const hi: any = await generateQuestion({
  canonicalProblemId: "LP-QL-047",
  language: "hi",
  seed: "LP-GLOBAL-V8-SAME-ITEM",
  count: 9,
});
const pa: any = await generateQuestion({
  canonicalProblemId: "LP-QL-047",
  language: "pa",
  seed: "LP-GLOBAL-V8-SAME-ITEM",
  count: 9,
});

for (let i = 0; i < 9; i += 1) {
  assert.equal(en.questions[i].correctIndex, hi.questions[i].correctIndex);
  assert.equal(en.questions[i].correctIndex, pa.questions[i].correctIndex);
  assert.equal(en.questions[i].difficulty, hi.questions[i].difficulty);
  assert.equal(en.questions[i].difficulty, pa.questions[i].difficulty);
  assert.equal(en.questions[i].patternId, hi.questions[i].patternId);
  assert.equal(en.questions[i].patternId, pa.questions[i].patternId);
}

console.log("PASS_GLOBAL_LOGIC_PUZZLES_V8_ROUTING");
console.log("LP-QL-047 en/hi/pa global shared-generation-engine routing active");
