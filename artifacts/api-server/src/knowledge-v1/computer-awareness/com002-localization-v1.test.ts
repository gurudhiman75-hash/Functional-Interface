import assert from "node:assert/strict";

import { localizeCom002QuestionEditorialV1 } from "./com002-localization-editorial-v1";
import { auditCom002LocalizationLexiconCoverageV1 } from "./com002-localization-lexicon-v1";
import { generateCom002ReviewQuestionV2 } from "./com002-review-synthesis-v2";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["hi", "pa"] as const;

const lexiconAudit = auditCom002LocalizationLexiconCoverageV1();
assert.equal(lexiconAudit.valid, true, `COM-002 localization lexicon incomplete:\n${lexiconAudit.missingLexemes.join("\n")}`);
assert.equal(lexiconAudit.approvedFactCount, 85);
assert.equal(lexiconAudit.uniqueSemanticLexemeCount, 150);
assert.equal(lexiconAudit.registeredLexemeCount, 150);

let audited = 0;
for (const qlId of qlIds) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `english-freeze-v1:${qlId}:${index}`;
    const english = generateCom002ReviewQuestionV2({ qlId, seed });

    for (const language of languages) {
      const localized = localizeCom002QuestionEditorialV1({ qlId, seed, language });
      const replay = localizeCom002QuestionEditorialV1({ qlId, seed, language });

      assert.deepEqual(replay, localized, `${qlId}/${seed}/${language}: deterministic replay drift`);
      assert.equal(localized.qlId, english.qlId);
      assert.equal(localized.cpId, english.cpId);
      assert.equal(localized.surfaceMode, english.surfaceMode);
      assert.equal(localized.targetFactId, english.targetFactId);
      assert.deepEqual(localized.sourceIds, english.sourceIds);
      assert.deepEqual(localized.sourceFactIds, english.sourceFactIds);
      assert.equal(localized.solverAuthority, english.solverAuthority);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.options.length, 4);
      assert.equal(new Set(localized.options).size, 4);
      assert.equal(localized.options[localized.correctIndex], localized.canonicalAnswer);
      assert.equal(localized.localizationV1.englishQuestionId, english.questionId);
      assert.equal(localized.localizationV1.semanticStateInvariant, true);
      assert.equal(localized.localizationV1.optionOrderInvariant, true);
      assert.equal(localized.localizationV1.correctIndexInvariant, true);
      assert.equal(localized.lifecycleV1.localizationReviewOnly, true);
      assert.equal(localized.lifecycleV1.localizationFrozen, false);
      assert.equal(localized.lifecycleV1.questionStudioActive, false);
      assert.equal(localized.lifecycleV1.persistenceAllowed, false);
      assert.equal(localized.lifecycleV1.questionBankWritable, false);
      assert.equal(localized.lifecycleV1.testEligible, false);
      assert.equal(localized.lifecycleV1.mockTestEligible, false);
      assert.equal(localized.lifecycleV1.publiclyPublishable, false);
      assert.equal(localized.lifecycleV1.productionReleaseAuthorized, false);

      if (language === "hi") {
        assert.match(localized.stem, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi stem has no Devanagari learner prose`);
        assert.match(localized.explanation, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi explanation has no Devanagari learner prose`);
      } else {
        assert.match(localized.stem, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi stem has no Gurmukhi learner prose`);
        assert.match(localized.explanation, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi explanation has no Gurmukhi learner prose`);
      }

      assert.doesNotMatch(localized.stem, /^(Which|What|Identify|Select|Consider)\b/u);
      audited += 1;
    }
  }
}

assert.equal(audited, 1040);
console.log(`[com002-localization-v1] PASS questions=${audited} qls=${qlIds.length} languages=${languages.join(",")}`);
