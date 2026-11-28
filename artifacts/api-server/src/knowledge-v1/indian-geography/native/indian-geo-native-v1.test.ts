import assert from "node:assert/strict";
import { GEO_IND_001_QUESTION_STUDIO_CORPUS_V1 } from "../../../question-studio/engines/knowledge-v1-geo-ind-001-adapter-v1";
import { auditIndianGeoLocalizationV1, localizeIndianGeoQuestionV1 } from "../indian-geo-localization-v1";
import { hasIndianGeoNativeRecordV1 } from "./indian-geo-native-v1";

const CORPORA = { "GEO-IND-001": GEO_IND_001_QUESTION_STUDIO_CORPUS_V1 } as const;

const OTHER_SCRIPT = { hi: /[਀-੿]/u, pa: /[ऀ-ॣ०-ॿ]/u } as const;
const NATIVE_SCRIPT = { hi: /[ऀ-ॿ]/u, pa: /[਀-੿]/u } as const;
// English words left in a translation. Acronyms (SAIL, RINL), Roman numerals and single letters are fine.
const ENGLISH_WORD = /\b(?![IVX]+\b)[A-Za-z]*[a-z][A-Za-z]{2,}\b/;

let covered = 0;
for (const [packageId, corpus] of Object.entries(CORPORA)) {
  const nativeQuestions = corpus.filter((question) => hasIndianGeoNativeRecordV1(question.questionId));
  covered += nativeQuestions.length;
  for (const question of nativeQuestions) {
    for (const language of ["hi", "pa"] as const) {
      // Throws if the English changed since translation.
      const localized = localizeIndianGeoQuestionV1(question, language, packageId);
      const all = [localized.stem, ...localized.options, localized.explanation].join(" ");
      const where = `${question.questionId}:${language}`;
      assert.ok(NATIVE_SCRIPT[language].test(localized.stem), `${where} stem has no native script`);
      assert.ok(!OTHER_SCRIPT[language].test(all), `${where} contains the other Indic script`);
      assert.ok(!ENGLISH_WORD.test(all), `${where} contains an English word: ${all.match(ENGLISH_WORD)?.[0]}`);
      assert.equal(new Set(localized.options).size, localized.options.length, `${where} duplicate options`);
      assert.equal(localized.canonicalAnswer, localized.options[question.correctIndex], `${where} answer`);
    }
  }
  const audit = auditIndianGeoLocalizationV1(nativeQuestions, packageId);
  assert.equal(audit.structuralValid, true, `${packageId} native subset audit: ${audit.issues.slice(0, 5).join(", ")}`);
  assert.equal(audit.mixedScriptCount, 0);
}

assert.ok(covered >= 690, `expected at least 690 native GEO questions, found ${covered}`);
console.log(`indian geography native HI/PA: ${covered} questions verified`);
