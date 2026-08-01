import assert from "node:assert/strict";
import {
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
} from "./cp005-english-contracts";
import { generateClsCp005EnglishQuestion } from "./cp005-english-runtime";
import { generateClsCp005Question } from "./cp005-multilingual-runtime";
import {
  CLS_CP005_LOCALIZED_RULE_IDS,
  CLS_CP005_RULE_LANGUAGE_PACK,
  type ClsCp005TranslatedLocale,
} from "./localization/cp005-language-pack";
import { localizeClsCp005Question } from "./localization/cp005-localizer";
import { CLS_CP005_RULE_IDS } from "./relation-registry";
import { CLS_CP005_SOURCE_GAP_RULE_IDS } from "./source-gap-registry";
import { CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID } from "./wave2-digit-product-rule";

const EXPECTED_RULE_IDS = new Set<string>([
  ...CLS_CP005_RULE_IDS,
  ...CLS_CP005_SOURCE_GAP_RULE_IDS,
  CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID,
]);
assert.equal(EXPECTED_RULE_IDS.size, 35);
assert.equal(CLS_CP005_LOCALIZED_RULE_IDS.length, 35);
assert.deepEqual(new Set(CLS_CP005_LOCALIZED_RULE_IDS), EXPECTED_RULE_IDS);
assert.equal(Object.keys(CLS_CP005_RULE_LANGUAGE_PACK).length, 35);

const LOCALES: readonly ClsCp005TranslatedLocale[] = ["hi-IN", "pa-IN"];
const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;

function inlineMath(text: string): readonly string[] {
  const segments: string[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const start = text.indexOf("\\(", cursor);
    if (start < 0) break;
    const end = text.indexOf("\\)", start + 2);
    assert.ok(end > start, `Unbalanced MathJax: ${text}`);
    segments.push(text.slice(start, end + 2));
    cursor = end + 2;
  }
  return segments;
}

for (const locale of LOCALES) {
  for (const [qlId, generatedCount] of [
    [CLS_CP005_ODD_TUPLE_QL_ID, 420],
    [CLS_CP005_EQUIVALENT_TUPLE_QL_ID, 960],
  ] as const) {
    const rules = new Set<string>();
    const arities = new Set<number>();
    const optionCounts = new Set<number>();
    const difficulties = new Set<string>();
    const stems = new Set<string>();

    for (let seed = 0; seed < generatedCount; seed += 1) {
      const english = generateClsCp005EnglishQuestion(qlId, seed);
      const localized = localizeClsCp005Question(english, locale);
      const script = locale === "hi-IN" ? DEVANAGARI : GURMUKHI;

      assert.deepEqual(localized.options, english.options);
      assert.deepEqual(localized.tuples, english.tuples);
      assert.deepEqual(localized.referenceTuple, english.referenceTuple);
      assert.equal(localized.answer, english.answer);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.intendedRuleId, english.intendedRuleId);
      assert.equal(localized.intendedRuleValue, english.intendedRuleValue);
      assert.equal(localized.qlId, english.qlId);
      assert.equal(localized.permanentQlId, english.permanentQlId);
      assert.equal(localized.task, english.task);
      assert.equal(localized.arity, english.arity);
      assert.equal(localized.difficulty, english.difficulty);
      assert.deepEqual(localized.expandedAmbiguityAudit, english.expandedAmbiguityAudit);
      assert.equal(localized.metadata.locale, locale);
      assert.equal(localized.metadata.runtimeVersion, "cls-cp005-multilingual-runtime-v1");
      assert.equal(localized.metadata.canonicalRuntimeVersion, "cls-cp005-english-runtime-v1");
      assert.equal(localized.metadata.canonicalLocale, "en-IN");
      assert.equal(localized.metadata.localizationVersion, "cls-cp005-hi-pa-localization-v1");
      assert.equal(localized.metadata.localizationStatus, "EXECUTABLE_REVIEW_REQUIRED");
      assert.equal(localized.lifecycle.reviewStatus, "LOCALIZED_REVIEW_REQUIRED");
      assert.equal(localized.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(localized.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.questionStudioVisible, false);
      assert.equal(localized.reviewOnly, true);

      assert.ok(script.test(localized.stem), `${locale} stem lacks expected script`);
      assert.ok(localized.explanation.coreConcept.every((line) => script.test(line)));
      assert.ok(localized.explanation.stepByStep.every((line) => script.test(line)));
      assert.ok(localized.explanation.examSpeedShortcut.every((line) => script.test(line)));
      assert.ok(localized.explanation.commonTrapWarning.every((line) => script.test(line)));

      localized.evidenceByOption.forEach((line, index) => {
        const mathStart = line.indexOf("\\(");
        assert.ok(mathStart > line.indexOf(": "), `Math-only evidence: ${line}`);
        assert.ok(script.test(line.slice(line.indexOf(": ") + 2, mathStart)));
        assert.deepEqual(inlineMath(line), inlineMath(english.evidenceByOption[index]!));
      });

      const successLabel = qlId === CLS_CP005_ODD_TUPLE_QL_ID
        ? locale === "hi-IN" ? "✅ यही नियम लागू होता है।" : "✅ ਇਹੀ ਨਿਯਮ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।"
        : locale === "hi-IN" ? "✅ दिए गए नियम से मेल खाता है।" : "✅ ਦਿੱਤੇ ਨਿਯਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।";
      const failureLabel = qlId === CLS_CP005_ODD_TUPLE_QL_ID
        ? locale === "hi-IN" ? "❌ नियम अलग है।" : "❌ ਨਿਯਮ ਵੱਖਰਾ ਹੈ।"
        : locale === "hi-IN" ? "❌ दिए गए नियम से मेल नहीं खाता।" : "❌ ਦਿੱਤੇ ਨਿਯਮ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ।";
      const successCount = localized.evidenceByOption.filter((line) => line.includes(successLabel)).length;
      const failureCount = localized.evidenceByOption.filter((line) => line.includes(failureLabel)).length;
      assert.equal(
        successCount,
        qlId === CLS_CP005_ODD_TUPLE_QL_ID ? localized.options.length - 1 : 1,
      );
      assert.equal(
        failureCount,
        qlId === CLS_CP005_ODD_TUPLE_QL_ID ? 1 : localized.options.length - 1,
      );

      const learnerText = [
        localized.stem,
        ...localized.evidenceByOption,
        ...localized.explanation.coreConcept,
        ...localized.explanation.stepByStep,
        ...localized.explanation.examSpeedShortcut,
        ...localized.explanation.commonTrapWarning,
      ].join("\n");
      assert.ok(!/Matches rule|Fails rule|Matches reference rule|Does not match reference rule/i.test(learnerText));
      assert.ok(!/CLS-|prototype|source-gap|registry|solveContract|runtimeVersion/i.test(learnerText));
      assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));
      assert.ok(!/किस संख्या-जोड़ा|किस तीन संख्याओं का समूह|ਕਿਸ ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜਾ|ਕਿਸ ਤਿੰਨ ਸੰਖਿਆਵਾਂ ਦਾ ਸਮੂਹ/.test(localized.stem));
      assert.ok(!/दोनों क्रमिक अंतर समान हों और उनका मान \+1 या -1 हो।|ਦੋਵੇਂ ਲਗਾਤਾਰ ਫਰਕ ਬਰਾਬਰ ਹੋਣ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਮੁੱਲ \+1 ਜਾਂ -1 ਹੋਵੇ।/.test(learnerText));
      assert.ok(!/एक ही दो स्थानों की संख्याएँ|ਇੱਕੋ ਦੋ ਥਾਵਾਂ ਵਾਲੀਆਂ ਸੰਖਿਆਵਾਂ/.test(learnerText));
      assert.ok(!/धनात्मक अंतर|ਧਨਾਤਮਕ ਫਰਕ/.test(learnerText));
      assert.ok(!/ਸਿਰਫ਼ ਟਾਂਕ ਦਿਖਣ ਨਾਲ|ਦਿੱਤੇ ਖਿਲਰੇ ਕ੍ਰਮ|ਲਗਾਤਾਰ ਦੋ ਮੂਲ ਸੰਖਿਆਵਾਂ|ਲਗਾਤਾਰ ਮੂਲਾਂ ਦੇ ਘਣ|ਉਨ੍ਹਾਂ ਦੇ ਮੂਲਾਂ ਦੀ ਤੁਲਨਾ/.test(learnerText));

      if (localized.intendedRuleId === "PAIR_BOTH_PRIME" && locale === "pa-IN") {
        assert.ok(learnerText.includes("ਸਿਰਫ਼ ਟਾਂਕ ਹੋਣ ਨਾਲ ਕੋਈ ਸੰਖਿਆ ਅਭਾਜ ਨਹੀਂ ਹੋ ਜਾਂਦੀ।"));
      }
      if (localized.intendedRuleId === "TRIPLE_CONSECUTIVE_DIRECTION") {
        const expectedShortcut = locale === "hi-IN"
          ? "दोनों क्रमिक अंतर निकालिए; वे बराबर और +1 या -1 होने चाहिए।"
          : "ਦੋਵੇਂ ਲਗਾਤਾਰ ਫਰਕ ਕੱਢੋ; ਉਹ ਬਰਾਬਰ ਅਤੇ +1 ਜਾਂ -1 ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।";
        assert.ok(localized.explanation.examSpeedShortcut.includes(expectedShortcut));
      }
      if (localized.intendedRuleId === "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD") {
        const expectedConcept = locale === "hi-IN"
          ? "हर समूह में तय दो स्थानों की संख्याओं को गुणा करने पर तीसरे स्थान की संख्या मिलती है।"
          : "ਹਰ ਸਮੂਹ ਵਿੱਚ ਤੈਅ ਦੋ ਸਥਾਨਾਂ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਨ ਨਾਲ ਤੀਜੇ ਸਥਾਨ ਦੀ ਸੰਖਿਆ ਮਿਲਦੀ ਹੈ।";
        assert.ok(localized.explanation.coreConcept.includes(expectedConcept));
      }
      if (localized.intendedRuleId === "TRIPLE_SUM_OF_TWO_EQUALS_THIRD") {
        const expectedConcept = locale === "hi-IN"
          ? "हर समूह में तय दो स्थानों की संख्याओं को जोड़ने पर तीसरे स्थान की संख्या मिलती है।"
          : "ਹਰ ਸਮੂਹ ਵਿੱਚ ਤੈਅ ਦੋ ਸਥਾਨਾਂ ਦੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਜੋੜਨ ਨਾਲ ਤੀਜੇ ਸਥਾਨ ਦੀ ਸੰਖਿਆ ਮਿਲਦੀ ਹੈ।";
        assert.ok(localized.explanation.coreConcept.includes(expectedConcept));
      }
      if (localized.intendedRuleId === "PAIR_PRIME_ABSOLUTE_DIFFERENCE") {
        const expectedConcept = locale === "hi-IN"
          ? "हर जोड़े में बड़ी और छोटी संख्या का अंतर अभाज्य है।"
          : "ਹਰ ਜੋੜੇ ਵਿੱਚ ਵੱਡੀ ਅਤੇ ਛੋਟੀ ਸੰਖਿਆ ਦਾ ਫਰਕ ਅਭਾਜ ਹੈ।";
        assert.ok(localized.explanation.coreConcept.includes(expectedConcept));
      }
      if (localized.intendedRuleId === "PAIR_CONSECUTIVE_CUBES_DIRECTION" && locale === "pa-IN") {
        assert.ok(localized.explanation.coreConcept.includes("ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਲਗਾਤਾਰ ਦੋ ਆਧਾਰ ਸੰਖਿਆਵਾਂ ਦੇ ਘਣ ਹਨ।"));
      }
      if (localized.intendedRuleId === "TRIPLE_UNORDERED_ARITHMETIC_SET" && locale === "pa-IN") {
        assert.ok(localized.explanation.commonTrapWarning.includes(
          "ਦਿੱਤੇ ਬੇਤਰਤੀਬ ਕ੍ਰਮ ਦੀ ਥਾਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਛੋਟੇ ਤੋਂ ਵੱਡੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖ ਕੇ ਜਾਂਚੋ।",
        ));
      }

      if (seed % 47 === 0) {
        assert.deepEqual(localized, localizeClsCp005Question(english, locale));
        assert.deepEqual(generateClsCp005Question(qlId, locale, seed), localized);
        assert.deepEqual(generateClsCp005Question(qlId, "en-IN", seed), english);
      }

      rules.add(localized.intendedRuleId);
      arities.add(localized.arity);
      optionCounts.add(localized.options.length);
      difficulties.add(localized.difficulty);
      stems.add(localized.stem.replace(/\([^)]*\)/g, "(…)"));
    }

    assert.deepEqual(rules, EXPECTED_RULE_IDS);
    assert.deepEqual(arities, new Set([2, 3, 4]));
    assert.deepEqual(optionCounts, new Set([4, 5]));
    assert.deepEqual(difficulties, new Set(["EASY", "MEDIUM", "HARD"]));
    assert.ok(stems.size >= 5, `${locale}/${qlId} has too little stem variation`);
  }
}

console.log("CLS-CP-005 Hindi/Punjabi localisation parity audit passed.", {
  locales: LOCALES,
  qls: [CLS_CP005_ODD_TUPLE_QL_ID, CLS_CP005_EQUIVALENT_TUPLE_QL_ID],
  rulesPerQl: EXPECTED_RULE_IDS.size,
  generatedPerLocale: 1380,
  representedArities: [2, 3, 4],
  optionCounts: [4, 5],
  status: "EXECUTABLE_REVIEW_REQUIRED",
});
