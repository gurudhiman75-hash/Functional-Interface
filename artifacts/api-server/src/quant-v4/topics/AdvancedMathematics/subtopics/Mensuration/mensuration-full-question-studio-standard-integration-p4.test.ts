import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../generation-engine";

function normalizeStemSignature(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/₹|\brs\.?\b|\binr\b/giu, "<money>")
    .replace(/-?\d+(?:\.\d+)?/gu, "<n>")
    .replace(/\b[a-e]\b/giu, "<option>")
    .replace(/[^a-z<>%+*/=\-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

const packages = listQuantV4Packages();
const full = packages.filter((pkg) => pkg.packageId === "MENSURATION");
assert.equal(full.length, 1, "Question Studio must expose exactly one full MENSURATION package.");
const pkg = full[0] as any;
assert.equal(pkg.enabled, true);
assert.equal(pkg.topic, "Advanced Mathematics");
assert.equal(pkg.subtopic, "Mensuration");
assert.equal(pkg.cpIds.length, 13, "Full Mensuration package must expose all 13 canonical problems.");
assert.deepEqual(pkg.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.publiclyPublishable, false);

const records:any[] = [];
for (let index = 0; index < 40; index += 1) {
  const result = await generateQuestion({
    packageId: "MENSURATION" as any,
    language: "en",
    examProfile: "SSC_CGL_TIER_I" as any,
    seed: `MENSURATION-CGL-SINGLE-SEED-P4:${index}`,
    count: 1,
  } as any);
  assert.equal(result.questions.length, 1);
  const question:any = result.questions[0];
  assert.equal(question.packageId, "MENSURATION");
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  records.push(question);
}

const patterns = new Set(records.map((question) => String(question.patternId)));
const cps = new Set(records.map((question) => String(question.canonicalProblemId)));
const signatures = records.map((question) => normalizeStemSignature(question.stem));
const uniqueSignatures = new Set(signatures);
const duplicateItems = signatures.length - uniqueSignatures.size;
const duplicateRate = duplicateItems / signatures.length;

assert.ok(patterns.size >= 24, `Expected at least 24 distinct patterns across 40 CGL-style seeds; got ${patterns.size}.`);
assert.ok(cps.size >= 7, `Expected at least 7 Mensuration CPs across 40 CGL-style seeds; got ${cps.size}.`);
assert.ok(duplicateRate <= 0.10, `Full Mensuration structural reuse must be <=10% across CGL-style seeds; got ${duplicateRate}.`);

for (const language of ["hi", "pa"] as const) {
  const result = await generateQuestion({
    packageId: "MENSURATION" as any,
    language,
    examProfile: "SSC_CGL_TIER_I" as any,
    seed: `MENSURATION-LOCALIZATION-P4:${language}`,
    count: 4,
  } as any);
  assert.equal(result.questions.length, 4);
  for (const question of result.questions as any[]) {
    assert.equal(question.language, language);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.publiclyPublishable, false);
    if (language === "hi") assert.match(question.stem, /[\u0900-\u097F]/u);
    if (language === "pa") assert.match(question.stem, /[\u0A00-\u0A7F]/u);
  }
}

console.log(JSON.stringify({
  status: "PASS_MENSURATION_FULL_QUESTION_STUDIO_STANDARD_INTEGRATION_P4",
  samples: records.length,
  distinctPatterns: patterns.size,
  distinctCanonicalProblems: cps.size,
  structuralDuplicateItems: duplicateItems,
  structuralDuplicateRate: duplicateRate,
}));
