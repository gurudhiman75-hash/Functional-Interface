import assert from "node:assert/strict";
import { NUM_CP010_PERMANENT_QL_IDS } from "../permanent-allocation.ts";
import { generateNumCp010Permanent } from "../permanent-runtime.ts";
import { generateNumCp010Localized } from "./runtime.ts";

const langs = ["hi", "pa"] as const;
let packages = 0;
let parityChecks = 0;
let optionChecks = 0;
let scriptChecks = 0;

for (const qlId of NUM_CP010_PERMANENT_QL_IDS) {
  for (const language of langs) {
    for (let seed = 1; seed <= 60; seed += 1) {
      const en = generateNumCp010Permanent(qlId, seed);
      const q = generateNumCp010Localized(qlId, seed, language);
      const label = `${qlId}/${language}/${seed}`;
      assert.equal(q.permanentQlId, en.permanentQlId, `${label}: QL drift`);
      assert.equal(q.authorityId, en.authorityId, `${label}: authority drift`);
      assert.equal(q.temporaryPrototypeId, en.temporaryPrototypeId, `${label}: prototype drift`);
      assert.equal(q.seed, en.seed, `${label}: seed drift`);
      assert.equal(q.sourceSeed, en.sourceSeed, `${label}: source-seed drift`);
      assert.equal(q.canonicalAnswer, en.canonicalAnswer, `${label}: answer drift`);
      assert.equal(q.verifierAnswer, en.verifierAnswer, `${label}: verifier drift`);
      assert.equal(q.correctIndex, en.correctIndex, `${label}: key drift`);
      assert.deepEqual(q.options, en.options, `${label}: option drift`);
      assert.deepEqual(q.hiddenState, en.hiddenState, `${label}: hidden-state drift`);
      assert.equal(q.mathematicalFingerprint, en.mathematicalFingerprint, `${label}: fingerprint drift`);
      parityChecks += 1;
      assert.equal(q.options.length, 4, `${label}: option count`);
      assert.equal(new Set(q.options.map((x) => x.value)).size, 4, `${label}: duplicate options`);
      assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: option binding`);
      optionChecks += 1;
      if (language === "hi") {
        assert.match(`${q.stem} ${q.explanation.coreConcept} ${q.explanation.strategy}`, /[\u0900-\u097F]/u, `${label}: Hindi script missing`);
        assert.equal(q.locale, "hi-IN");
      } else {
        assert.match(`${q.stem} ${q.explanation.coreConcept} ${q.explanation.strategy}`, /[\u0A00-\u0A7F]/u, `${label}: Punjabi script missing`);
        assert.equal(q.locale, "pa-IN");
      }
      assert.equal(q.lifecycle.reviewStatus, "HI_PA_REVIEW_CANDIDATE");
      assert.equal(q.lifecycle.active, false);
      assert.equal(q.lifecycle.questionStudioDiscoverable, false);
      assert.equal(q.lifecycle.questionBankWritable, false);
      assert.equal(q.lifecycle.testEligible, false);
      assert.equal(q.lifecycle.publiclyPublishable, false);
      scriptChecks += 1;
      packages += 1;
    }
  }
}

assert.equal(packages, 16 * 2 * 60);
console.log(JSON.stringify({
  status: "PASS_NUM_CP010_HI_PA_PARITY_CANDIDATE",
  permanentAuthorities: NUM_CP010_PERMANENT_QL_IDS.length,
  languages: langs,
  packages,
  parityChecks,
  optionChecks,
  scriptChecks,
  answerKeyChanges: 0,
  downstreamActivations: 0,
}, null, 2));
