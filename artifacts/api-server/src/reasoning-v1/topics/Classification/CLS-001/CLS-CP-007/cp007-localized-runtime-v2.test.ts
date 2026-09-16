import assert from "node:assert/strict";
import {
  generateClsCp007LocalizedClusterQuestion,
  generateClsCp007LocalizedPairQuestion,
  type ClsCp007LocalizedLocale,
} from "./cp007-localized-runtime";
import {
  generateClsCp007LocalizedClusterQuestionV2,
  generateClsCp007LocalizedPairQuestionV2,
} from "./cp007-localized-runtime-v2";
import type { ClsCp007PrototypeId } from "./types";

const PROTOTYPES: readonly ClsCp007PrototypeId[] = [
  "CLS-CP007-PROT-001", "CLS-CP007-PROT-002", "CLS-CP007-PROT-003",
  "CLS-CP007-PROT-004", "CLS-CP007-PROT-005", "CLS-CP007-PROT-006",
  "CLS-CP007-PROT-007", "CLS-CP007-PROT-008", "CLS-CP007-PROT-009",
  "CLS-CP007-PROT-010", "CLS-CP007-PROT-011", "CLS-CP007-PROT-012",
  "CLS-CP007-PROT-013",
];
const LOCALES: readonly ClsCp007LocalizedLocale[] = ["hi-IN", "pa-IN"];
const FORBIDDEN = /परिमाण|घटाया हुआ अंतर-अनुपात|घटाया अनुपात|आंतरिक वर्णक्रम|अंतर-समानता क्रम|समानता क्रम|समान वर्णमाला संबंध|ਪਰਿਮਾਣ|ਘਟਾਇਆ ਹੋਇਆ ਅੰਤਰ-ਅਨੁਪਾਤ|ਘਟਾਇਆ ਅਨੁਪਾਤ|ਅੰਦਰੂਨੀ ਵਰਣ-ਕ੍ਰਮ|ਅੰਤਰ-ਸਮਾਨਤਾ ਕ੍ਰਮ|ਸਮਾਨਤਾ ਕ੍ਰਮ|ਸਾਂਝੇ ਵਰਣਮਾਲਾ ਸੰਬੰਧ|ਵਿਰੋਧੀ/;

let checked = 0;
let simplifiedAbsoluteGap = 0;
let simplifiedRatio = 0;
let simplifiedPunjabiOpposite = 0;
let clarifiedPairOutlier = 0;
let simplifiedPatternLanguage = 0;

function learnerText(question: {
  readonly stem: string;
  readonly evidenceByOption: readonly string[];
  readonly explanation: {
    readonly coreConcept: readonly string[];
    readonly stepByStep: readonly string[];
    readonly examSpeedShortcut: readonly string[];
    readonly commonTrapWarning: readonly string[];
  };
}): string {
  return [
    question.stem,
    ...question.evidenceByOption,
    ...question.explanation.coreConcept,
    ...question.explanation.stepByStep,
  ].join("\n");
}

for (const locale of LOCALES) {
  for (const prototypeId of PROTOTYPES) {
    for (let seed = 0; seed < 10; seed += 1) {
      const optionCount = seed % 3 === 0 ? 5 : 4;
      const v1 = generateClsCp007LocalizedClusterQuestion(locale, prototypeId, seed, optionCount);
      const v2 = generateClsCp007LocalizedClusterQuestionV2(locale, prototypeId, seed, optionCount);

      assert.deepEqual(v2.items, v1.items);
      assert.deepEqual(v2.options, v1.options);
      assert.equal(v2.correctIndex, v1.correctIndex);
      assert.equal(v2.answer, v1.answer);
      assert.equal(v2.intendedRuleId, v1.intendedRuleId);
      assert.equal(v2.intendedRuleValue, v1.intendedRuleValue);
      assert.deepEqual(v2.ambiguityAudit, v1.ambiguityAudit);
      assert.equal(v2.difficulty, v1.difficulty);
      assert.equal(v2.permanentQlId, v1.permanentQlId);
      assert.equal(v2.metadata.runtimeVersion, "cls-cp007-multilingual-review-v2");
      assert.equal(v2.metadata.editorialVersion, "simple-native-language-v2");
      assert.equal(v2.explanation.examSpeedShortcut.length, 0);
      assert.equal(v2.explanation.commonTrapWarning.length, 0);

      const text = learnerText(v2);
      assert.ok(!FORBIDDEN.test(text), `${locale}/${prototypeId}/${seed}: technical native wording leaked`);
      if (v2.intendedRuleId === "CLUSTER_ABSOLUTE_GAP_VECTOR") {
        simplifiedAbsoluteGap += 1;
        assert.ok(locale === "hi-IN" ? text.includes("+/− चिह्न हटाने पर") : text.includes("+/− ਨਿਸ਼ਾਨ ਹਟਾਉਣ ਤੇ"));
      }
      if (v2.intendedRuleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO") {
        simplifiedRatio += 1;
        assert.ok(locale === "hi-IN" ? text.includes("सरल अनुपात") : text.includes("ਸਰਲ ਅਨੁਪਾਤ"));
      }
      if (v2.intendedRuleId === "CLUSTER_GAP_EQUALITY_PATTERN") {
        simplifiedPatternLanguage += 1;
        assert.ok(locale === "hi-IN" ? text.includes("अंतर की बनावट") : text.includes("ਅੰਤਰਾਂ ਦੀ ਬਣਤਰ"));
      }
      if (v2.intendedRuleId === "CLUSTER_REPEAT_PATTERN") {
        assert.ok(locale === "hi-IN" ? text.includes("अक्षरों के दोहराव का क्रम") : text.includes("ਅੱਖਰਾਂ ਦੀ ਦੁਹਰਾਈ ਦਾ ਕ੍ਰਮ"));
      }
      if (locale === "pa-IN" && (
        v2.intendedRuleId === "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS" ||
        v2.intendedRuleId === "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS"
      )) {
        simplifiedPunjabiOpposite += 1;
        assert.ok(text.includes("ਉਲਟ"));
      }
      checked += 1;
    }
  }

  for (let seed = 0; seed < 100; seed += 1) {
    const optionCount = seed % 4 === 0 ? 5 : 4;
    const v1 = generateClsCp007LocalizedPairQuestion(locale, seed, optionCount);
    const v2 = generateClsCp007LocalizedPairQuestionV2(locale, seed, optionCount);

    assert.deepEqual(v2.items, v1.items);
    assert.deepEqual(v2.options, v1.options);
    assert.equal(v2.correctIndex, v1.correctIndex);
    assert.equal(v2.answer, v1.answer);
    assert.deepEqual(v2.ambiguityAudit, v1.ambiguityAudit);
    assert.equal(v2.difficulty, v1.difficulty);
    assert.equal(v2.permanentQlId, "CLS-QL-013");
    assert.equal(v2.metadata.runtimeVersion, "cls-cp007-multilingual-review-v2");
    assert.equal(v2.metadata.editorialVersion, "simple-native-language-v2");

    const text = learnerText(v2);
    assert.ok(!FORBIDDEN.test(text), `${locale}/PAIR/${seed}: technical native wording leaked`);
    if (locale === "pa-IN") assert.ok(text.includes("ਉਲਟ"));
    assert.ok(locale === "hi-IN"
      ? text.includes("कम-से-कम एक संबंधित जोड़ी का योग 27 नहीं है।")
      : text.includes("ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸੰਬੰਧਿਤ ਜੋੜੀ ਦਾ ਜੋੜ 27 ਨਹੀਂ ਹੈ।"));
    clarifiedPairOutlier += 1;
    checked += 1;
  }
}

assert.equal(checked, LOCALES.length * (PROTOTYPES.length * 10 + 100));
assert.ok(simplifiedAbsoluteGap > 0);
assert.ok(simplifiedRatio > 0);
assert.ok(simplifiedPatternLanguage > 0);
assert.ok(simplifiedPunjabiOpposite > 0);
assert.ok(clarifiedPairOutlier > 0);

console.log("CLS-CP-007 simple native-language V2 audit passed.", {
  checked,
  simplifiedAbsoluteGap,
  simplifiedRatio,
  simplifiedPatternLanguage,
  simplifiedPunjabiOpposite,
  clarifiedPairOutlier,
  mathematicalStateChanges: 0,
});
