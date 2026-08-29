import assert from "node:assert/strict";

import { NUM_CP013_PERMANENT_ALLOCATION, NUM_CP013_PERMANENT_QL_IDS } from "../permanent-allocation.ts";
import { generateNumCp013Permanent } from "../permanent-runtime.ts";
import { generateNumCp013Localized } from "./runtime.ts";
import type { NumCp013LocalizedLanguage } from "./types.ts";

const languages: readonly NumCp013LocalizedLanguage[] = ["hi", "pa"];
let packages = 0;
let replayChecks = 0;
let semanticChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
const sourceCoverage = new Map<string, Set<string>>();
const localizedModeCoverage = new Map<string, Set<number>>();

for (const qlId of NUM_CP013_PERMANENT_QL_IDS) sourceCoverage.set(qlId, new Set());

for (const qlId of NUM_CP013_PERMANENT_QL_IDS) {
  const allocation = NUM_CP013_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId)!;
  for (const language of languages) {
    for (let seed = 1; seed <= 50; seed += 1) {
      const en = generateNumCp013Permanent(qlId, seed);
      const localized = generateNumCp013Localized(qlId, seed, language);
      const replay = generateNumCp013Localized(qlId, seed, language);
      const label = `${qlId}/${language}/${seed}`;

      assert.deepEqual(replay, localized, `${label}: deterministic localized replay drift`);
      replayChecks += 1;

      assert.equal(localized.packageId, en.packageId, `${label}: package drift`);
      assert.equal(localized.checkpointId, en.checkpointId, `${label}: checkpoint drift`);
      assert.equal(localized.permanentQlId, en.permanentQlId, `${label}: QL drift`);
      assert.equal(localized.authorityId, en.authorityId, `${label}: authority drift`);
      assert.equal(localized.authorityLabel, en.authorityLabel, `${label}: authority-label drift`);
      assert.equal(localized.temporaryPrototypeId, en.temporaryPrototypeId, `${label}: source-prototype drift`);
      assert.equal(localized.seed, en.seed, `${label}: seed drift`);
      assert.equal(localized.sourceSeed, en.sourceSeed, `${label}: source-seed drift`);
      assert.equal(localized.difficulty, en.difficulty, `${label}: difficulty drift`);
      assert.equal(localized.taskKind, en.taskKind, `${label}: task-kind drift`);
      assert.equal(localized.answerSemantic, en.answerSemantic, `${label}: answer-semantic drift`);
      assert.equal(localized.sourceAnswerSemantic, en.sourceAnswerSemantic, `${label}: source-answer-semantic drift`);
      assert.equal(localized.representation, en.representation, `${label}: representation drift`);
      assert.deepEqual(localized.hiddenState, en.hiddenState, `${label}: hidden mathematical state drift`);
      assert.equal(localized.mathematicalFingerprint, en.mathematicalFingerprint, `${label}: mathematical fingerprint drift`);
      assert.deepEqual(localized.sourceAncestry, en.sourceAncestry, `${label}: source ancestry drift`);
      assert.deepEqual(localized.prototypeAncestry, en.prototypeAncestry, `${label}: prototype ancestry drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${label}: correct-index drift`);
      semanticChecks += 1;

      assert.equal(localized.options.length, en.options.length, `${label}: option-count drift`);
      assert.equal(new Set(localized.options.map((option) => option.value)).size, 4, `${label}: localized duplicate options`);
      for (let index = 0; index < en.options.length; index += 1) {
        assert.equal(localized.options[index]?.isCorrect, en.options[index]?.isCorrect, `${label}: correctness flag drift at option ${index}`);
        assert.equal(localized.options[index]?.misconceptionId, en.options[index]?.misconceptionId, `${label}: misconception drift at option ${index}`);
      }
      assert.equal(localized.options[localized.correctIndex]?.value, localized.canonicalAnswer, `${label}: localized correct option mismatch`);
      assert.equal(localized.canonicalAnswer, localized.verifierAnswer, `${label}: localized verifier mismatch`);
      assert.equal(localized.explanation.finalAnswer, localized.canonicalAnswer, `${label}: localized explanation answer mismatch`);
      optionChecks += 1;

      assert.equal(localized.language, language, `${label}: language drift`);
      assert.equal(localized.locale, language === "hi" ? "hi-IN" : "pa-IN", `${label}: locale drift`);
      assert.equal(localized.lifecycle.maturity, "PERMANENT_AUTHORITY", `${label}: maturity drift`);
      assert.equal(localized.lifecycle.reviewStatus, "MULTILINGUAL_FROZEN", `${label}: localization freeze drift`);
      assert.equal(localized.lifecycle.questionBankStatus, "NOT_STORED", `${label}: Question Bank state drift`);
      assert.equal(localized.lifecycle.testEligibility, "INELIGIBLE", `${label}: eligibility drift`);
      assert.equal(localized.lifecycle.active, false, `${label}: active gate opened`);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
      assert.equal(localized.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
      assert.equal(localized.lifecycle.testEligible, false, `${label}: test gate opened`);
      assert.equal(localized.lifecycle.mockTestEligible, false, `${label}: mock-test gate opened`);
      assert.equal(localized.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
      assert.equal(localized.lifecycle.automaticStudentPublication, false, `${label}: automatic publication gate opened`);
      lifecycleChecks += 1;

      sourceCoverage.get(qlId)!.add(localized.temporaryPrototypeId);
      const rawMode = (localized.hiddenState as Readonly<Record<string, unknown>>).mode;
      if (typeof rawMode === "number" && Number.isInteger(rawMode)) {
        const modeKey = `${language}/${qlId}/${localized.temporaryPrototypeId}`;
        if (!localizedModeCoverage.has(modeKey)) localizedModeCoverage.set(modeKey, new Set());
        localizedModeCoverage.get(modeKey)!.add(rawMode);
      }
      packages += 1;
    }
  }

  assert.deepEqual(
    [...sourceCoverage.get(qlId)!].sort(),
    [...allocation.sourcePrototypes].sort(),
    `${qlId}: localized merged authority did not reach every source prototype`,
  );
}

assert.equal(packages, 11 * 2 * 50);
assert.equal(replayChecks, packages);
assert.equal(semanticChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(lifecycleChecks, packages);

const requiredLocalizedInternalModes = Object.freeze([
  { qlId: "NUM-QL-237", prototypeId: "NUM-CP013-PROT-011", modes: [0, 1, 2, 3] },
  { qlId: "NUM-QL-238", prototypeId: "NUM-CP013-PROT-009", modes: [0, 1, 2, 3] },
  { qlId: "NUM-QL-239", prototypeId: "NUM-CP013-PROT-012", modes: [0, 1, 2] },
  { qlId: "NUM-QL-241", prototypeId: "NUM-CP013-PROT-021", modes: [0, 1, 2] },
  { qlId: "NUM-QL-245", prototypeId: "NUM-CP013-PROT-015", modes: [0, 1, 2] },
] as const);

for (const language of languages) {
  for (const requirement of requiredLocalizedInternalModes) {
    const key = `${language}/${requirement.qlId}/${requirement.prototypeId}`;
    assert.deepEqual(
      [...(localizedModeCoverage.get(key) ?? new Set<number>())].sort((a, b) => a - b),
      [...requirement.modes],
      `${key}: localized prototype-internal mode reachability drift`,
    );
  }
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_HI_PA_PARITY",
  authorities: NUM_CP013_PERMANENT_QL_IDS.length,
  languages,
  packages,
  replayChecks,
  semanticChecks,
  optionChecks,
  lifecycleChecks,
  sourceSeedSelectionDecoupled: true,
  sourceCoverage: Object.fromEntries([...sourceCoverage].map(([id, values]) => [id, [...values].sort()])),
  localizedModeCoverage: Object.fromEntries([...localizedModeCoverage].map(([id, values]) => [id, [...values].sort((a, b) => a - b)])),
}, null, 2));
