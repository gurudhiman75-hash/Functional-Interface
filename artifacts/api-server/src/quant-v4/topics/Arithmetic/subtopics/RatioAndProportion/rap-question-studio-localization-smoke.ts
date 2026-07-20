import { strict as assert } from "node:assert";
import { generateQuestion, listQuantV4Packages } from "../../../../generation-engine";
import { getQuestionLanguageIds as getRap001QuestionLanguageIds } from "./RAP-001/library";
import { RAP_001_CP_IDS } from "./RAP-001/types";
import { getRap002QuestionLanguageIds } from "./RAP-002/library";
import { RAP_002_CP_IDS } from "./RAP-002/types";
import { getRap003QuestionLanguageIds } from "./RAP-003/library";
import { RAP_003_CP_IDS } from "./RAP-003/types";

const packages = [
  {
    packageId: "RAP-001" as const,
    cpId: RAP_001_CP_IDS[0]!,
    qlId: getRap001QuestionLanguageIds(RAP_001_CP_IDS[0]!, "en")[0]!,
  },
  {
    packageId: "RAP-002" as const,
    cpId: RAP_002_CP_IDS[0]!,
    qlId: getRap002QuestionLanguageIds(RAP_002_CP_IDS[0]!)[0]!,
  },
  {
    packageId: "RAP-003" as const,
    cpId: RAP_003_CP_IDS[0]!,
    qlId: getRap003QuestionLanguageIds(RAP_003_CP_IDS[0]!)[0]!,
  },
];

const listed = listQuantV4Packages();
for (const config of packages) {
  const entry = listed.find((item) => item.packageId === config.packageId);
  assert(entry, `${config.packageId} must be listed`);
  assert.deepEqual(entry.supportedLanguages, ["en", "hi", "pa"]);
}

for (const config of packages) {
  for (const language of ["hi", "pa"] as const) {
    const result = await generateQuestion({
      packageId: config.packageId,
      canonicalProblemId: config.cpId,
      questionLanguageId: config.qlId,
      language,
      seed: `rap-freeze-smoke:${config.packageId}:${language}`,
      count: 1,
    });
    assert.equal(result.questions.length, 1);
    assert.equal(result.questionPackages.length, 1);
    const question = result.questions[0]!;
    const pkg = result.questionPackages[0]!;
    assert.equal(question.language, language);
    assert.equal(question.packageId, config.packageId);
    assert.equal(pkg.language, language);
    assert.equal(pkg.validation?.valid, true);
    assert.equal(pkg.questionLanguageId, config.qlId);
    if (language === "hi") {
      assert(/[\u0900-\u097F]/.test(question.text), `${config.packageId} Hindi stem must use Devanagari`);
    } else {
      assert(/[\u0A00-\u0A7F]/.test(question.text), `${config.packageId} Punjabi stem must use Gurmukhi`);
    }
  }
}

console.log(JSON.stringify({ packages: packages.length, languages: 2, generated: packages.length * 2, status: "PASS" }, null, 2));
