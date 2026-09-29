import assert from "node:assert/strict";
import { knowledgeV1GeoAgr001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-agr-001-adapter-v1";
import { knowledgeV1GeoCli001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-cli-001-adapter-v1";
import { knowledgeV1GeoHaz001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-haz-001-adapter-v1";
import { knowledgeV1GeoInd001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-ind-001-adapter-v1";
import { knowledgeV1GeoLnd001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-lnd-001-adapter-v1";
import { knowledgeV1GeoMin001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-min-001-adapter-v1";
import { knowledgeV1GeoLoc001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-loc-001-adapter-v1";
import { knowledgeV1GeoPhy001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-phy-001-adapter-v1";
import { knowledgeV1GeoPln001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-pln-001-adapter-v1";
import { knowledgeV1GeoPop001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-pop-001-adapter-v1";
import { knowledgeV1GeoRiv001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-riv-001-adapter-v1";
import { knowledgeV1GeoSoi001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-soi-001-adapter-v1";
import { knowledgeV1GeoTrn001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-trn-001-adapter-v1";
import { knowledgeV1GeoVeg001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-veg-001-adapter-v1";
import { knowledgeV1GeoWat001QuestionStudioAdapterV1 } from "./knowledge-v1-geo-wat-001-adapter-v1";

const cases = [
  ["GEO-AGR-001", knowledgeV1GeoAgr001QuestionStudioAdapterV1],
  ["GEO-CLI-001", knowledgeV1GeoCli001QuestionStudioAdapterV1],
  ["GEO-HAZ-001", knowledgeV1GeoHaz001QuestionStudioAdapterV1],
  ["GEO-IND-001", knowledgeV1GeoInd001QuestionStudioAdapterV1],
  ["GEO-LND-001", knowledgeV1GeoLnd001QuestionStudioAdapterV1],
  ["GEO-MIN-001", knowledgeV1GeoMin001QuestionStudioAdapterV1],
  ["GEO-LOC-001", knowledgeV1GeoLoc001QuestionStudioAdapterV1],
  ["GEO-PHY-001", knowledgeV1GeoPhy001QuestionStudioAdapterV1],
  ["GEO-PLN-001", knowledgeV1GeoPln001QuestionStudioAdapterV1],
  ["GEO-POP-001", knowledgeV1GeoPop001QuestionStudioAdapterV1],
  ["GEO-RIV-001", knowledgeV1GeoRiv001QuestionStudioAdapterV1],
  ["GEO-SOI-001", knowledgeV1GeoSoi001QuestionStudioAdapterV1],
  ["GEO-TRN-001", knowledgeV1GeoTrn001QuestionStudioAdapterV1],
  ["GEO-VEG-001", knowledgeV1GeoVeg001QuestionStudioAdapterV1],
  ["GEO-WAT-001", knowledgeV1GeoWat001QuestionStudioAdapterV1],
] as const;

for (const [packageId, adapter] of cases) {
  const pkg = adapter.listPackages()[0]!;
  assert.deepEqual(pkg.supportedLanguages, ["en","hi","pa"], packageId);
  for (const language of ["hi","pa"] as const) {
    const result = await adapter.generate({
      packageId,
      language,
      count: 1,
      seed: "indian-geo-localization-smoke-v1:" + packageId + ":" + language,
    });
    assert.equal(result.questions.length, 1, packageId + ":" + language);
    const q = result.questions[0]!;
    assert.equal(q.language, language);
    assert.equal(q.locale, language === "hi" ? "hi-IN" : "pa-IN");
    assert.equal(q.options.length, 4);
    assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
    assert.equal(q.productionReleased, false);
    assert.equal(q.testEligible, false);
    assert.equal(q.mockTestEligible, false);
    if (language === "hi") assert.match(String(q.stem), /[\u0900-\u097F]/);
    else assert.match(String(q.stem), /[\u0A00-\u0A7F]/);
  }
}
