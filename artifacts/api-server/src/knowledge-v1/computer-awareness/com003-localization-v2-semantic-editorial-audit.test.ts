import { strict as assert } from "node:assert";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import {
  COM003_HINDI_LOCALIZATION_V2_CHAPTER,
  COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_CHAPTER,
} from "./com003-localization-v2-chapter";
import { COM003_LOCALIZATION_V2_EXPLANATION_DIVERSITY_AUTHORITY } from "./com003-localization-v2-explanation-diversity";

type Language = "hi" | "pa";
type SemanticRule = Readonly<{
  qlId: string;
  hi: readonly RegExp[];
  pa: readonly RegExp[];
}>;

const RULES: Readonly<Record<string, SemanticRule>> = Object.freeze({
  "com003-excel-absolute-reference": {
    qlId: "COM-003-QL-011",
    hi: [/absolute reference/i, /स्थिर|fixed|lock|नहीं बदल|जस का तस/i],
    pa: [/absolute reference/i, /ਸਥਿਰ|fixed|lock|ਨਹੀਂ ਬਦਲ|ਜਿਉਂ ਦਾ ਤਿਉਂ/i],
  },
  "com003-excel-absolute-reference-notation": {
    qlId: "COM-003-QL-011",
    hi: [/\$A\$1/i, /dollar sign|lock|absolute/i],
    pa: [/\$A\$1/i, /dollar sign|lock|absolute/i],
  },
  "com003-excel-relative-reference": {
    qlId: "COM-003-QL-011",
    hi: [/relative reference/i, /बदल|adjust|shift/i],
    pa: [/relative reference/i, /ਬਦਲ|adjust|shift/i],
  },
  "com003-excel-line-chart": {
    qlId: "COM-003-QL-014",
    hi: [/line chart/i, /trend|बदलाव/i],
    pa: [/line chart/i, /trend|ਬਦਲਾਅ/i],
  },
  "com003-excel-bar-chart": {
    qlId: "COM-003-QL-014",
    hi: [/bar chart/i, /तुलना|compare|comparison/i],
    pa: [/bar chart/i, /ਤੁਲਨਾ|compare|comparison/i],
  },
  "com003-excel-pie-chart": {
    qlId: "COM-003-QL-014",
    hi: [/pie chart/i, /total|share|whole|हिस्स|अनुपात/i],
    pa: [/pie chart/i, /total|share|whole|ਹਿੱਸ|ਅਨੁਪਾਤ/i],
  },
  "com003-powerpoint-insert-chart": {
    qlId: "COM-003-QL-017",
    hi: [/chart/i, /graph|data|visual/i],
    pa: [/chart/i, /graph|data|visual/i],
  },
  "com003-powerpoint-insert-picture": {
    qlId: "COM-003-QL-017",
    hi: [/picture/i, /image|photo|photograph/i],
    pa: [/picture/i, /image|photo|photograph/i],
  },
  "com003-powerpoint-insert-table": {
    qlId: "COM-003-QL-017",
    hi: [/table/i, /rows?|columns?|row-column/i],
    pa: [/table/i, /rows?|columns?|row-column/i],
  },
  "com003-powerpoint-shortcut-f5": {
    qlId: "COM-003-QL-019",
    hi: [/(^|[^+])F5/i, /first|beginning|शुरू|शुरुआत/i],
    pa: [/(^|[^+])F5/i, /first|beginning|ਸ਼ੁਰੂ/i],
  },
  "com003-powerpoint-shortcut-shift-f5": {
    qlId: "COM-003-QL-019",
    hi: [/shift\+F5/i, /current|वर्तमान/i],
    pa: [/shift\+F5/i, /current|ਮੌਜੂਦਾ/i],
  },
});

const HIGH_DIVERSITY_QLS = new Set(COM003_LOCALIZATION_V2_EXPLANATION_DIVERSITY_AUTHORITY.qlIds);
const enById = new Map(COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((question) => [question.questionId, question]));
const suspiciousEditorialPatterns = [
  /\uFFFD/,
  /\bTODO\b/i,
  /\bFIXME\b/i,
  /placeholder/i,
  /lorem ipsum/i,
  /सही उत्तर है/i,
  /ਸਹੀ ਉੱਤਰ ਹੈ/i,
  /दिए गए तथ्य के अनुसार/i,
  /ਦਿੱਤੇ ਤੱਥ ਅਨੁਸਾਰ/i,
  /canonical fact/i,
];

assert.equal(COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.authorityId, "COM-003-LOCALIZATION-V2-CHAPTER-CANDIDATE-2");
assert.equal(COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.sourceEnglishAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(
  COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.explanationDiversityAuthorityId,
  "COM-003-LOCALIZATION-V2-EXPLANATION-DIVERSITY-1",
);
assert.equal(Object.keys(RULES).length, 11);

const summary: Record<Language, { checked: number; semanticHighDiversity: number; qls: Record<string, number> }> = {
  hi: { checked: 0, semanticHighDiversity: 0, qls: {} },
  pa: { checked: 0, semanticHighDiversity: 0, qls: {} },
};

for (const [language, items] of [
  ["hi", COM003_HINDI_LOCALIZATION_V2_CHAPTER],
  ["pa", COM003_PUNJABI_LOCALIZATION_V2_CHAPTER],
] as const) {
  assert.equal(items.length, 228, `${language}:chapter-count`);

  for (const item of items) {
    const english = enById.get(item.sourceQuestionId);
    assert.ok(english, `${item.localizationId}:missing-English-source`);
    assert.equal(item.qlId, english.qlId, `${item.localizationId}:ql-semantic-drift`);
    assert.equal(item.targetFactId, english.targetFactId, `${item.localizationId}:fact-semantic-drift`);
    assert.equal(item.correctIndex, english.correctIndex, `${item.localizationId}:answer-index-drift`);
    assert.equal(item.canonicalAnswer, item.options[item.correctIndex], `${item.localizationId}:canonical-answer-drift`);
    assert.notEqual(
      item.explanation.trim().toLowerCase(),
      english.explanation.trim().toLowerCase(),
      `${item.localizationId}:unlocalized-English-explanation`,
    );

    for (const pattern of suspiciousEditorialPatterns) {
      assert.doesNotMatch(item.stem, pattern, `${item.localizationId}:editorial-stem:${pattern}`);
      assert.doesNotMatch(item.explanation, pattern, `${item.localizationId}:editorial-explanation:${pattern}`);
    }

    if (language === "hi") {
      assert.match(item.stem, /[ऀ-ॿ]/, `${item.localizationId}:Hindi-stem-script`);
      assert.match(item.explanation, /[ऀ-ॿ]/, `${item.localizationId}:Hindi-explanation-script`);
    } else {
      assert.match(item.stem, /[਀-੿]/, `${item.localizationId}:Punjabi-stem-script`);
      assert.match(item.explanation, /[਀-੿]/, `${item.localizationId}:Punjabi-explanation-script`);
    }

    if (HIGH_DIVERSITY_QLS.has(item.qlId)) {
      const rule = RULES[item.targetFactId];
      assert.ok(rule, `${item.localizationId}:missing-semantic-rule:${item.targetFactId}`);
      assert.equal(rule.qlId, item.qlId, `${item.localizationId}:semantic-rule-ql-mismatch`);
      for (const pattern of rule[language]) {
        assert.match(item.explanation, pattern, `${item.localizationId}:semantic-explanation-mismatch:${pattern}`);
      }
      summary[language].semanticHighDiversity += 1;
      summary[language].qls[item.qlId] = (summary[language].qls[item.qlId] ?? 0) + 1;
    }

    summary[language].checked += 1;
  }

  for (const qlId of HIGH_DIVERSITY_QLS) {
    const qlItems = items.filter((item) => item.qlId === qlId);
    assert.equal(qlItems.length, 12, `${language}:${qlId}:high-diversity-count`);
    assert.equal(
      new Set(qlItems.map((item) => item.explanation.trim().toLowerCase())).size,
      12,
      `${language}:${qlId}:semantic-editorial-explanation-uniqueness`,
    );
  }
}

assert.equal(summary.hi.semanticHighDiversity, 48);
assert.equal(summary.pa.semanticHighDiversity, 48);
assert.equal(summary.hi.checked, 228);
assert.equal(summary.pa.checked, 228);

const governance = COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.governance;
assert.equal(governance.localizationFrozen, false);
assert.equal(governance.chapterFreezeAuthorized, false);
assert.equal(governance.questionStudioRuntimeAuthorized, false);
assert.equal(governance.questionBankWritesAuthorized, false);
assert.equal(governance.testEligibilityAuthorized, false);
assert.equal(governance.mockTestEligibilityAuthorized, false);
assert.equal(governance.automaticPublicationAuthorized, false);
assert.equal(governance.publiclyPublishable, false);
assert.equal(governance.productionReleased, false);

console.log("[COM003-LOCALIZATION-V2-SEMANTIC-EDITORIAL-AUDIT]", {
  authority: COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.authorityId,
  explanationDiversityAuthority: COM003_LOCALIZATION_V2_EXPLANATION_DIVERSITY_AUTHORITY.authorityId,
  semanticRules: Object.keys(RULES).length,
  summary,
  governance,
});
