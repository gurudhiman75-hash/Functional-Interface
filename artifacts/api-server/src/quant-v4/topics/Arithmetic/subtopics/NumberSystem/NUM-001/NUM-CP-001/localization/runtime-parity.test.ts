import assert from "node:assert/strict";
import { NUM_CP001_PERMANENT_QL_IDS } from "../permanent/allocation";
import { runNumCp001PermanentPipeline } from "../permanent/runtime";
import { runNumCp001LocalizedPipeline } from "./runtime";
import type { NumCp001TranslatedLocale } from "./types";

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp001TranslatedLocale[];
const SEEDS_PER_QL = 120;
let localizedQuestions = 0;
let deterministicReplays = 0;
let mathematicalParityChecks = 0;
const qlsByLocale = new Map<string, Set<string>>();
const prototypesByLocale = new Map<string, Set<string>>();
const positionsByLocale = new Map<string, Set<number>>();
const difficultiesByLocale = new Map<string, Set<string>>();

for (const locale of LOCALES) {
  qlsByLocale.set(locale, new Set());
  prototypesByLocale.set(locale, new Set());
  positionsByLocale.set(locale, new Set());
  difficultiesByLocale.set(locale, new Set());

  for (const qlId of NUM_CP001_PERMANENT_QL_IDS) {
    const qlPositions = new Set<number>();
    const qlDifficulties = new Set<string>();

    for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
      const canonical = runNumCp001PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" });
      const localized = runNumCp001LocalizedPipeline({ questionLanguageId: qlId, seed, locale });
      const replay = runNumCp001LocalizedPipeline({ questionLanguageId: qlId, seed, locale });

      localizedQuestions += 1;
      deterministicReplays += 1;
      assert.deepEqual(replay, localized);

      assert.equal(localized.permanentQlId, canonical.permanentQlId);
      assert.equal(localized.questionLanguageId, canonical.questionLanguageId);
      assert.equal(localized.questionId, canonical.questionId);
      assert.equal(localized.qlTemplateId, canonical.qlTemplateId);
      assert.equal(localized.solveModeId, canonical.solveModeId);
      assert.equal(localized.proposalId, canonical.proposalId);
      assert.equal(localized.temporaryPrototypeId, canonical.temporaryPrototypeId);
      assert.deepEqual(localized.authorityPrototypeIds, canonical.authorityPrototypeIds);
      assert.equal(localized.seed, canonical.seed);
      assert.equal(localized.sourceSeed, canonical.sourceSeed);
      assert.equal(localized.difficulty, canonical.difficulty);
      assert.equal(localized.answerSemantic, canonical.answerSemantic);
      assert.equal(localized.correctIndex, canonical.correctIndex);
      assert.deepEqual(localized.hiddenState, canonical.hiddenState);
      assert.equal(localized.mathematicalFingerprint, canonical.mathematicalFingerprint);
      assert.deepEqual(localized.sourceAncestry, canonical.sourceAncestry);
      assert.deepEqual(localized.prototypeAncestry, canonical.prototypeAncestry);
      assert.deepEqual(localized.lifecycle, canonical.lifecycle);
      assert.equal(localized.allocationStatus, canonical.allocationStatus);
      assert.equal(localized.permanentIdentityFrozen, true);
      assert.equal(localized.solveModeFrozen, true);
      assert.equal(localized.englishImplementationFrozen, true);
      assert.equal(localized.options.length, 4);
      assert.equal(localized.options.filter((o) => o.isCorrect).length, 1);
      assert.equal(localized.options[localized.correctIndex]!.isCorrect, true);
      assert.equal(localized.options[localized.correctIndex]!.value, localized.canonicalAnswer);
      assert.equal(localized.canonicalAnswer, localized.verifierAnswer);
      assert.equal(localized.locale, locale);
      assert.equal(localized.language, locale === "hi-IN" ? "hi" : "pa");
      assert.equal(localized.traceability.language, localized.language);
      assert.equal(localized.localization.canonicalQuestionId, canonical.questionId);
      assert.equal(localized.localization.canonicalAnswer, canonical.canonicalAnswer);
      assert.equal(localized.localization.canonicalVerifierAnswer, canonical.verifierAnswer);
      assert.equal(localized.localization.mathematicalStatePreserved, true);
      assert.equal(localized.localization.optionOrderPreserved, true);
      assert.equal(localized.localization.correctIndexPreserved, true);
      assert.equal(localized.localization.misconceptionMappingPreserved, true);
      assert.equal(localized.localization.lifecycleLocked, true);

      for (let index = 0; index < 4; index += 1) {
        assert.equal(localized.options[index]!.isCorrect, canonical.options[index]!.isCorrect);
        assert.equal(localized.options[index]!.misconceptionId, canonical.options[index]!.misconceptionId);
      }

      assert.equal(localized.lifecycle.active, false);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);

      mathematicalParityChecks += 1;
      qlsByLocale.get(locale)!.add(qlId);
      prototypesByLocale.get(locale)!.add(canonical.traceability.runtimePrototypeId);
      positionsByLocale.get(locale)!.add(localized.correctIndex);
      difficultiesByLocale.get(locale)!.add(localized.difficulty);
      qlPositions.add(localized.correctIndex);
      qlDifficulties.add(localized.difficulty);
    }

    assert.deepEqual([...qlPositions].sort(), [0, 1, 2, 3], `${locale}/${qlId}: all answer positions must be reachable`);
    assert.ok(qlDifficulties.size >= 2, `${locale}/${qlId}: at least two difficulty bands must be reachable`);
  }
}

for (const locale of LOCALES) {
  assert.equal(qlsByLocale.get(locale)!.size, 21);
  assert.equal(prototypesByLocale.get(locale)!.size, 26);
  assert.deepEqual([...positionsByLocale.get(locale)!].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...difficultiesByLocale.get(locale)!].sort(), ["EASY", "HARD", "MEDIUM"]);
}

assert.throws(
  () => runNumCp001PermanentPipeline({ language: "hi" as never }),
  /only supports English/,
);
assert.throws(
  () => runNumCp001PermanentPipeline({ language: "pa" as never }),
  /only supports English/,
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_HI_PA_MATHEMATICAL_PARITY",
  locales: LOCALES,
  permanentQlCount: NUM_CP001_PERMANENT_QL_IDS.length,
  representedPrototypeCountPerLocale: 26,
  seedsPerQlPerLocale: SEEDS_PER_QL,
  localizedQuestions,
  deterministicReplays,
  mathematicalParityChecks,
  questionStudioExposure: 0,
  questionBankWrites: 0,
  testEligibility: 0,
  publicPublication: 0,
}, null, 2));
