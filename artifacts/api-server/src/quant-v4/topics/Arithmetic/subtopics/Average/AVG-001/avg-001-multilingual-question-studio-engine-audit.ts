import { strict as assert } from "node:assert";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../question-studio-generation-engine";
import { AVG_001_ENGLISH_RELEASE_V2 } from "./foundation/editorial-v2-release";
import { AVG_001_LOCALIZED_RELEASE } from "./foundation/localized-release";

const avg = listQuantV4Packages().find((pkg: any) => pkg.packageId === "AVG-001") as any;
assert.ok(avg, "AVG-001 package card is missing");
assert.deepEqual(avg.supportedLanguages, ["en", "hi", "pa"]);

const expectedRelease = {
  en: AVG_001_ENGLISH_RELEASE_V2.releaseId,
  hi: AVG_001_LOCALIZED_RELEASE.releases.hi.releaseId,
  pa: AVG_001_LOCALIZED_RELEASE.releases.pa.releaseId,
} as const;

let generated = 0;
for (const language of ["en", "hi", "pa"] as const) {
  const result = await generateQuestion({
    packageId: "AVG-001",
    language,
    difficulty: "Medium",
    count: 6,
    seed: `avg-001-engine-release:${language}`,
  });
  assert.equal(result.questionPackages.length, 6);
  assert.equal(result.questions.length, 6);
  assert.equal(result.generationContext.releaseId, expectedRelease[language]);
  assert.equal(result.generationContext.language, language);
  assert.equal(result.generationContext.runtimeMode, "RELEASED");
  assert.equal(result.generationContext.publiclyPublishable, true);

  for (let index = 0; index < result.questionPackages.length; index += 1) {
    const pkg = result.questionPackages[index] as any;
    const preview = result.questions[index] as any;
    generated += 1;
    assert.equal(pkg.language, language);
    assert.equal(pkg.traceability.releaseId, expectedRelease[language]);
    assert.equal(pkg.maturity, "FROZEN");
    assert.equal(pkg.publiclyPublishable, true);
    assert.equal(pkg.validation.valid, true);
    assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
    assert.equal(preview.language, language);
    assert.equal(preview.metadata.language, language);
    assert.equal(preview.metadata.releaseId, expectedRelease[language]);
    assert.equal(preview.text, pkg.stem);
    assert.deepEqual(preview.options, pkg.options);
    assert.equal(preview.correctIndex, pkg.correctIndex);
    if (language === "hi") assert.match(pkg.stem, /[\u0900-\u097F]/);
    if (language === "pa") assert.match(pkg.stem, /[\u0A00-\u0A7F]/);
  }
}

console.log(JSON.stringify({
  packageId: "AVG-001",
  supportedLanguages: avg.supportedLanguages,
  releaseIds: expectedRelease,
  generated,
  status: "PASS",
}, null, 2));
assert.equal(generated, 18);
