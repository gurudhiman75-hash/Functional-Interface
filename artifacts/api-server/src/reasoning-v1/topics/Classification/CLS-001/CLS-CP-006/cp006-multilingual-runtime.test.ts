import assert from "node:assert/strict";

import "./cp006-english-runtime.test";
import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
  type ClsCp006EnglishQlId,
} from "./cp006-english-contracts";
import { generateClsCp006EnglishQuestion } from "./cp006-english-runtime";
import { generateClsCp006Question } from "./cp006-multilingual-runtime";
import {
  localizeClsCp006Question,
  type GeneratedClsCp006LocalizedQuestion,
} from "./localization/cp006-localizer";
import {
  CLS_CP006_RULE_LANGUAGE_PACK,
  type ClsCp006TranslatedLocale,
} from "./localization/cp006-language-pack";

const locales: readonly ClsCp006TranslatedLocale[] = ["hi-IN", "pa-IN"];
const qlIds: readonly ClsCp006EnglishQlId[] = [
  CLS_CP006_ODD_LETTER_QL_ID,
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
];

assert.equal(Object.keys(CLS_CP006_RULE_LANGUAGE_PACK).length, 8);

const representedRules = new Map<string, Set<string>>();
const localizedFingerprints = new Set<string>();
let localizedQuestions = 0;

function assertCanonicalParity(
  english: ReturnType<typeof generateClsCp006EnglishQuestion>,
  localized: GeneratedClsCp006LocalizedQuestion,
): void {
  assert.equal(localized.checkpointId, english.checkpointId);
  assert.equal(localized.prototypeId, english.prototypeId);
  assert.equal(localized.qlId, english.qlId);
  assert.equal(localized.permanentQlId, english.permanentQlId);
  assert.equal(localized.seed, english.seed);
  assert.equal(localized.task, english.task);
  assert.equal(localized.optionKind, english.optionKind);
  assert.deepEqual(localized.items, english.items);
  assert.deepEqual(localized.options, english.options);
  assert.equal(localized.correctIndex, english.correctIndex);
  assert.equal(localized.answer, english.answer);
  assert.equal(localized.intendedRuleId, english.intendedRuleId);
  assert.equal(localized.intendedRuleValue, english.intendedRuleValue);
  assert.deepEqual(localized.ambiguityAudit, english.ambiguityAudit);
  assert.equal(localized.difficulty, english.difficulty);
  assert.deepEqual(localized.difficultyFeatures, english.difficultyFeatures);
  assert.equal(localized.reviewOnly, true);
  assert.equal(localized.questionStudioVisible, false);
  assert.equal(localized.metadata.sourceRuntimeVersion, english.metadata.sourceRuntimeVersion);
  assert.equal(localized.metadata.sourcePrototypeId, english.metadata.sourcePrototypeId);
  assert.equal(localized.metadata.sourcePrototypeSeed, english.metadata.sourcePrototypeSeed);
  assert.equal(localized.metadata.solveContractId, english.metadata.solveContractId);
  assert.equal(localized.metadata.completeRuleCount, 8);
  assert.equal(localized.metadata.canonicalLocale, "en-IN");
  assert.equal(
    localized.metadata.canonicalRuntimeVersion,
    "cls-cp006-english-runtime-v1",
  );
  assert.equal(
    localized.metadata.runtimeVersion,
    "cls-cp006-multilingual-runtime-v1",
  );
  assert.equal(
    localized.metadata.localizationVersion,
    "cls-cp006-hi-pa-localization-v1",
  );
  assert.equal(
    localized.metadata.localizationStatus,
    "EXECUTABLE_REVIEW_REQUIRED",
  );
  assert.equal(localized.lifecycle.permanentQlId, english.lifecycle.permanentQlId);
  assert.equal(localized.lifecycle.reviewStatus, "LOCALIZED_REVIEW_REQUIRED");
  assert.equal(localized.lifecycle.questionBankStatus, "NOT_STORED");
  assert.equal(localized.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(localized.lifecycle.publiclyPublishable, false);
  assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
}

for (const locale of locales) {
  for (const qlId of qlIds) {
    const key = `${locale}/${qlId}`;
    const rules = new Set<string>();
    representedRules.set(key, rules);

    for (let seed = 0; seed < 720; seed += 1) {
      const english = generateClsCp006EnglishQuestion(qlId, seed);
      const localized = localizeClsCp006Question(english, locale);
      const wrapped = generateClsCp006Question(qlId, locale, seed);

      assert.deepEqual(wrapped, localized);
      if (seed % 37 === 0) {
        assert.deepEqual(localized, localizeClsCp006Question(english, locale));
      }
      assertCanonicalParity(english, localized);
      assert.equal(localized.metadata.locale, locale);
      assert.notEqual(localized.stem, english.stem);
      assert.equal(localized.evidenceByOption.length, localized.options.length);
      assert.ok(localized.explanation.coreConcept.length >= 1);
      assert.ok(
        localized.explanation.stepByStep.length
          >= localized.options.length + 2,
      );
      assert.ok(localized.explanation.examSpeedShortcut.length >= 1);
      assert.ok(localized.explanation.commonTrapWarning.length >= 1);
      assert.ok(
        localized.explanation.stepByStep.at(-1)?.includes(localized.answer),
      );
      assert.equal(
        localized.evidenceByOption.filter((line) => line.includes("❌")).length,
        1,
      );
      assert.equal(
        localized.evidenceByOption.filter((line) => line.includes("✅")).length,
        localized.options.length - 1,
      );

      const intendedSupport = localized.ambiguityAudit.candidateSupports.find(
        (support) =>
          support.ruleId === localized.intendedRuleId
          && support.answerIndex === localized.correctIndex,
      );
      assert.ok(intendedSupport);
      const coreConcept = localized.explanation.coreConcept.join(" ");
      switch (localized.intendedRuleId) {
        case "LETTER_ALPHABET_HALF": {
          const commonFirstHalf = intendedSupport.commonValue === "FIRST_HALF";
          const expected = locale === "hi-IN"
            ? `अधिकतर अक्षर वर्णमाला के ${commonFirstHalf ? "पहले" : "दूसरे"} आधे भाग में हैं; केवल एक अक्षर ${commonFirstHalf ? "दूसरे" : "पहले"} आधे भाग में है।`
            : `ਜ਼ਿਆਦਾਤਰ ਅੱਖਰ ਵਰਣਮਾਲਾ ਦੇ ${commonFirstHalf ? "ਪਹਿਲੇ" : "ਦੂਜੇ"} ਅੱਧ ਵਿੱਚ ਹਨ; ਸਿਰਫ਼ ਇੱਕ ਅੱਖਰ ${commonFirstHalf ? "ਦੂਜੇ" : "ਪਹਿਲੇ"} ਅੱਧ ਵਿੱਚ ਹੈ।`;
          assert.equal(coreConcept, expected);
          break;
        }
        case "PAIR_ABSOLUTE_POSITION_GAP":
        case "PAIR_POSITION_SUM":
          assert.ok(coreConcept.includes(intendedSupport.commonValue));
          break;
        case "PAIR_SIGNED_POSITION_GAP":
          assert.ok(
            coreConcept.includes(String(Math.abs(Number(intendedSupport.commonValue)))),
          );
          break;
        case "PAIR_OPPOSITE_STATUS":
          assert.ok(coreConcept.includes("27"));
          break;
        default:
          break;
      }

      const learnerText = [
        localized.stem,
        ...localized.evidenceByOption,
        ...localized.explanation.coreConcept,
        ...localized.explanation.stepByStep,
        ...localized.explanation.examSpeedShortcut,
        ...localized.explanation.commonTrapWarning,
      ].join("\n");
      if (locale === "hi-IN") {
        assert.match(learnerText, /[\u0905-\u0939]/u);
      } else {
        assert.match(learnerText, /[\u0A05-\u0A39]/u);
      }
      assert.doesNotMatch(
        learnerText,
        /CLS-|PROT-|runtimeVersion|prototype|registry|metadata|localizationStatus/i,
      );
      assert.doesNotMatch(
        learnerText,
        /Which of the following|odd one out|Select the different|Identify the ordered/i,
      );
      assert.doesNotMatch(
        learnerText,
        /(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/,
      );
      assert.doesNotMatch(
        learnerText,
        /स्वर\s*\(S\)|व्यंजन\s*\(V\)|ਸਵਰ\s*\(S\)|ਵਿਅੰਜਨ\s*\(V\)/u,
      );
      assert.doesNotMatch(learnerText, /\b(?:VV|VC|CV|CC)\b/u);

      rules.add(localized.intendedRuleId);
      localizedFingerprints.add(JSON.stringify({
        locale,
        qlId,
        stem: localized.stem,
        options: localized.options,
        explanation: localized.explanation,
      }));
      localizedQuestions += 1;
    }
  }
}

for (const locale of locales) {
  assert.deepEqual(
    representedRules.get(`${locale}/${CLS_CP006_ODD_LETTER_QL_ID}`),
    new Set([
      "LETTER_VOWEL_CONSONANT_CLASS",
      "LETTER_POSITION_PARITY",
      "LETTER_ALPHABET_HALF",
    ]),
  );
  assert.deepEqual(
    representedRules.get(`${locale}/${CLS_CP006_ODD_LETTER_PAIR_QL_ID}`),
    new Set([
      "PAIR_ABSOLUTE_POSITION_GAP",
      "PAIR_SIGNED_POSITION_GAP",
      "PAIR_POSITION_SUM",
      "PAIR_OPPOSITE_STATUS",
      "PAIR_VOWEL_CONSONANT_COMPOSITION",
    ]),
  );
}

assert.equal(localizedQuestions, 2880);
assert.ok(localizedFingerprints.size >= 2300);
assert.throws(() =>
  generateClsCp006Question(
    CLS_CP006_ODD_LETTER_QL_ID,
    "fr-FR" as never,
    0,
  ),
);

console.log("CLS-CP-006 Hindi/Punjabi localisation audit passed.", {
  localizedQuestions,
  locales,
  permanentQls: qlIds,
  rules: Object.keys(CLS_CP006_RULE_LANGUAGE_PACK).length,
  localizedFingerprints: localizedFingerprints.size,
  questionStudio: false,
  questionBank: false,
  testEligible: false,
  publiclyPublishable: false,
});
