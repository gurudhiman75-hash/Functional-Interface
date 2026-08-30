import { strict as assert } from "node:assert";

import { COM001_ENGLISH_FREEZE_AUTHORITY_V1, auditCom001EnglishFreezeV1 } from "./com001-english-freeze-v1";
import { COM001_EDITORIALLY_APPROVED_FACTS } from "./com001-editorial-review";
import {
  COM001_LOCALIZATION_AUTHORITY_DRAFT_V1,
  COM001_LOCALIZATION_VERSION_V1,
  generateCom001LocalizedReviewQuestionV1,
} from "./com001-localization-v1";
import { generateCom001ReviewQuestion, listCom001ReviewQlIds } from "./com001-review-synthesis";

// U+0964/U+0965 danda punctuation is shared in Indic prose, including Punjabi.
// Exclude those punctuation code points so the leakage audit tests Devanagari
// script content rather than shared sentence punctuation.
const DEVANAGARI = /[\u0900-\u0963\u0966-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const FORBIDDEN_ENGLISH_PROSE = /\b(?:Which|Identify|Consider|Therefore|because|classified as|correct answer|main function|main purpose|satisfies all the given conditions|Which of the above statements|uses .* storage technology)\b/iu;

const freezeAudit = auditCom001EnglishFreezeV1();
assert.equal(freezeAudit.valid, true, freezeAudit.issues.join("\n"));

let localizedCount = 0;
for (const qlId of listCom001ReviewQlIds()) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `localization-v1:${qlId}:${index}`;
    const english = generateCom001ReviewQuestion({ qlId, seed });

    for (const language of ["hi", "pa"] as const) {
      localizedCount += 1;
      const localized = generateCom001LocalizedReviewQuestionV1({ qlId, seed, language });
      const replay = generateCom001LocalizedReviewQuestionV1({ qlId, seed, language });

      assert.deepEqual(localized, replay, `${qlId}/${seed}/${language}: deterministic replay`);
      assert.equal(localized.questionId, english.questionId);
      assert.equal(localized.qlId, english.qlId);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.options.length, english.options.length);
      assert.equal(localized.options.length, 4);
      assert.equal(localized.options[localized.correctIndex], localized.canonicalAnswer);
      assert.deepEqual(localized.sourceFactIds, english.sourceFactIds);
      assert.deepEqual(localized.sourceIds, english.sourceIds);
      assert.equal(localized.solverAuthority, english.solverAuthority);
      assert.equal(localized.reviewOnly, true);
      assert.equal(localized.runtimeRegistered, false);

      assert.equal(localized.localization.version, COM001_LOCALIZATION_VERSION_V1);
      assert.equal(localized.localization.authority, COM001_LOCALIZATION_AUTHORITY_DRAFT_V1);
      assert.equal(
        localized.localization.englishFreezeAuthorityId,
        COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      );
      assert.equal(localized.localization.englishQuestionId, english.questionId);
      assert.equal(localized.localization.semanticStateInvariant, true);
      assert.equal(localized.localization.qlInvariant, true);
      assert.equal(localized.localization.sourceFactsInvariant, true);
      assert.equal(localized.localization.sourceAuthorityInvariant, true);
      assert.equal(localized.localization.solverAuthorityInvariant, true);
      assert.equal(localized.localization.optionOrderInvariant, true);
      assert.equal(localized.localization.correctIndexInvariant, true);

      assert.equal(localized.lifecycle.localizationReviewOnly, true);
      assert.equal(localized.lifecycle.localizationFrozen, false);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionStudioRegistrationStatus, "NOT_REGISTERED");
      assert.equal(localized.lifecycle.persistenceAllowed, false);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      assert.equal(localized.lifecycle.automaticStudentPublication, false);

      assert.notEqual(localized.stem, english.stem, `${qlId}/${seed}/${language}: stem was not localized`);
      assert.notEqual(localized.explanation, english.explanation, `${qlId}/${seed}/${language}: explanation was not localized`);
      assert.equal(localized.stem.trim().length > 0, true);
      assert.equal(localized.explanation.trim().length > 0, true);
      assert.equal(FORBIDDEN_ENGLISH_PROSE.test(localized.stem), false, `${qlId}/${seed}/${language}: English prose leaked in stem: ${localized.stem}`);
      assert.equal(FORBIDDEN_ENGLISH_PROSE.test(localized.explanation), false, `${qlId}/${seed}/${language}: English prose leaked in explanation: ${localized.explanation}`);

      if (language === "hi") {
        assert.equal(DEVANAGARI.test(localized.stem), true, `${qlId}/${seed}: Hindi stem missing Devanagari`);
        assert.equal(DEVANAGARI.test(localized.explanation), true, `${qlId}/${seed}: Hindi explanation missing Devanagari`);
        assert.equal(GURMUKHI.test(localized.stem), false, `${qlId}/${seed}: Punjabi script leaked into Hindi stem`);
        assert.equal(GURMUKHI.test(localized.explanation), false, `${qlId}/${seed}: Punjabi script leaked into Hindi explanation`);
      } else {
        assert.equal(GURMUKHI.test(localized.stem), true, `${qlId}/${seed}: Punjabi stem missing Gurmukhi`);
        assert.equal(GURMUKHI.test(localized.explanation), true, `${qlId}/${seed}: Punjabi explanation missing Gurmukhi`);
        assert.equal(DEVANAGARI.test(localized.stem), false, `${qlId}/${seed}: Hindi script leaked into Punjabi stem`);
        assert.equal(DEVANAGARI.test(localized.explanation), false, `${qlId}/${seed}: Hindi script leaked into Punjabi explanation`);
      }

      assert.equal(localized.sourceFactIds.includes("com001-sram-layer"), false);
      assert.equal(
        localized.sourceFactIds.some((factId) => /windows-pagefile|windows-paging/i.test(factId)),
        false,
      );

      if (qlId === "COM-001-QL-009") {
        const targetFactId = english.sourceFactIds[0];
        const targetFact = COM001_EDITORIALLY_APPROVED_FACTS.find(
          (fact) => fact.factId === targetFactId,
        );
        assert.ok(targetFact, `${qlId}/${seed}/${language}: capacity source fact missing`);
        assert.equal(targetFact.value.kind, "number", `${qlId}/${seed}/${language}: capacity fact not numeric`);
        if (targetFact.value.kind === "number" && targetFact.value.unit !== "bits") {
          const label = targetFact.entity.label.en;
          const expectedConvention = /KiB|MiB|GiB/.test(label) ? "IEC" : "SI";
          assert.equal(
            localized.stem.includes(expectedConvention),
            true,
            `${qlId}/${seed}/${language}: ${expectedConvention} capacity convention missing`,
          );
        }
      }
    }
  }
}

assert.equal(localizedCount, 720);
