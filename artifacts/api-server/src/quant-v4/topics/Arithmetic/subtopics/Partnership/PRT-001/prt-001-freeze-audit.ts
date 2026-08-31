import { strict as assert } from "node:assert";
import { generateQuestion, listQuantV4Packages } from "../../../../../generation-engine-core";
import {
  auditPrt001ContextRealism,
  auditPrt001Coverage,
  auditPrt001E1MathDiversity,
  auditPrt001E2MathDiversity,
  auditPrt001E3MathDiversity,
  auditPrt001E4MathDiversity,
  auditPrt001E5MathDiversity,
  auditPrt001Multilingual,
  auditPrt001OptionQuality,
} from "./foundation/coverage-auditor";
import {
  auditPrt001AdvancedStemSkeletonDiversity,
  auditPrt001BaselineAdvancedMathDiversity,
  auditPrt001ObjectPoolDepth,
} from "./foundation/e6-production-diversity-auditor";
import {
  auditPrt001ChapterStemSkeletonDepth,
  auditPrt001CrossQlStemStructure,
} from "./foundation/e7-stem-structure-auditor";
import { auditPrt001E8SourceRealness } from "./foundation/e8-source-realness-auditor";
import { auditPrt001E10EnglishEditorial } from "./foundation/e10-english-editorial-auditor";
import { auditPrt001E11LocalizedEditorial } from "./foundation/e11-localized-editorial-auditor";
import { PRT_001_CP_IDS } from "./foundation/types";

const reports = [
  auditPrt001Coverage(),
  auditPrt001ContextRealism(),
  auditPrt001E8SourceRealness(),
  auditPrt001E10EnglishEditorial(),
  auditPrt001E11LocalizedEditorial(),
  auditPrt001ChapterStemSkeletonDepth(),
  auditPrt001CrossQlStemStructure(),
  auditPrt001BaselineAdvancedMathDiversity(),
  auditPrt001AdvancedStemSkeletonDiversity(),
  auditPrt001ObjectPoolDepth(),
  auditPrt001E1MathDiversity(),
  auditPrt001E2MathDiversity(),
  auditPrt001E3MathDiversity(),
  auditPrt001E4MathDiversity(),
  auditPrt001E5MathDiversity(),
  auditPrt001Multilingual(),
  auditPrt001OptionQuality(),
];

const definition = listQuantV4Packages().find((item) => item.packageId === "PRT-001");
assert.ok(definition, "Question Studio package discovery is missing PRT-001");
assert.deepEqual(definition.canonicalProblems.map((item) => item.id), [...PRT_001_CP_IDS]);

let studioCases = 0;
for (const cpId of PRT_001_CP_IDS) {
  for (const language of ["en", "hi", "pa"] as const) {
    const result = await generateQuestion({ packageId: "PRT-001", cpId, language, count: 2, seed: `prt-001:studio:${cpId}:${language}` });
    assert.equal(result.questionPackages.length, 2);
    assert.equal(result.questions.length, 2);
    for (const pkg of result.questionPackages) {
      assert.equal(pkg.packageId, "PRT-001");
      assert.equal(pkg.canonicalProblemId, cpId);
      assert.equal(pkg.language, language);
      assert.equal(pkg.validation.valid, true);
    }
    studioCases += 2;
  }
}

reports.push({ audit: "question-studio-integration", cases: studioCases, metrics: { canonicalProblems: 7, languages: 3, productionWave: "E11" } });
console.log(JSON.stringify({ packageId: "PRT-001", status: "PASS", productionWave: "E11", reports }, null, 2));
