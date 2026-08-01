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

function assertParity(
  qlId: typeof CLS_CP005_ODD_TUPLE_QL_ID | typeof CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  seed: number,
  locale: ClsCp005TranslatedLocale,
) {
  const english = generateClsCp005EnglishQuestion(qlId, seed);
  const localized = localizeClsCp005Question(english, locale);

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

  const script = locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
  assert.ok(script.test(localized.stem), `${locale} stem lacks expected script: ${localized.stem}`);
  assert.ok(localized.explanation.coreConcept.every((line) => script.test(line)));
  assert.ok(localized.explanation.stepByStep.every((line) => script.test(line)));
  assert.ok(localized.explanation.examSpeedShortcut.every((line) => script.test(line)));
  assert.ok(localized.explanation.commonTrapWarning.every((line) => script.test(line)));

  assert.equal(localized.evidenceByOption.length, english.evidenceByOption.length);
  localized.evidenceByOption.forEach((line, index) => {
    const mathStart = line.indexOf("\\(");
    assert.ok(mathStart > line.indexOf(": "), `Math-only or malformed evidence: ${line}`);
    const prose = line.slice(line.indexOf(": ") + 2, mathStart).trim();
    assert.ok(script.test(prose), `${locale} evidence lacks localized prose: ${line}`);
    assert.deepEqual(inlineMath(line), inlineMath(english.evidenceByOption[index]!));
  });

  const successLabel = qlId === CLS_CP005_ODD_TUPLE_QL_ID
    ? locale === "hi-IN" ? "✅ समान नियम।" : "✅ ਇੱਕੋ ਨਿਯਮ।"
    : locale === "hi-IN" ? "✅ दिए गए नियम से मेल खाता है।" : "✅ ਦਿੱਤੇ ਨਿਯਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।";
  const failureLabel = qlId === CLS_CP005_ODD_TUPLE_QL_ID
    ? locale === "hi-IN" ? "❌ अलग नियम।" : "❌ ਵੱਖਰਾ ਨਿਯਮ।"
    : locale === "hi-IN" ? "❌ दिए गए नियम से मेल नहीं खाता।" : "❌ ਦਿੱਤੇ ਨਿਯਮ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ।";
  const successCount = localized.evidenceByOption.filter((line) => line.includes(successLabel)).length;
  const failureCount = localized.evidenceByOption.filter((line) => line.includes(failureLabel)).length;
  if (qlId === CLS_CP005_ODD_TUPLE_QL_ID) {
    assert.equal(successCount, localized.options.length - 1);
    assert.equal(failureCount, 1);
  } else {
    assert.equal(successCount, 1);
    assert.equal(failureCount, localized.options.length - 1);
  }

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

  if (seed % 47 === 0) {
    assert.deepEqual(localized, localizeClsCp005Question(english, locale));
    assert.deepEqual(
      generateClsCp005Question(qlId, locale, seed),
      localized,
    );
    assert.deepEqual(
      generateClsCp005Question(qlId, "en-IN", seed),
      english,
    );
  }

  return localized;
}

type LocaleSummary = {
  readonly rules: Set<string>;
  readonly arities: Set<number>;
  readonly optionCounts: Set<number>;
  readonly difficulties: Set<string>;
  readonly stems: Set<string>;
};

const summaries = new Map<string, LocaleSummary>();
for (const locale of LOCALES) {
  for (const [qlId, generatedCount] of [
    [CLS_CP005_ODD_TUPLE_QL_ID, 420],
    [CLS_CP005_EQUIVALENT_TUPLE_QL_ID, 960],
  ] as const) {
    const summary: LocaleSummary = {
      rules: new Set<string>(),
      arities: new Set<number>(),
      optionCounts: new Set<number>(),
      difficulties: new Set<string>(),
      stems: new Set<string>(),
    };
    for (let seed = 0; seed < generatedCount; seed += 1) {
      const question = assertParity(qlId, seed, locale);
      summary.rules.add(question.intendedRuleId);
      summary.arities.add(question.arity);
      summary.optionCounts.add(question.options.length);
      summary.difficulties.add(question.difficulty);
      summary.stems.add(question.stem.replace(/\([^)]*\)/g, "(…)"));
    }
    assert.deepEqual(summary.rules, EXPECTED_RULE_IDS);
    assert.deepEqual(summary.arities, new Set([2, 3, 4]));
    assert.deepEqual(summary.optionCounts, new Set([4, 5]));
    assert.deepEqual(summary.difficulties, new Set(["EASY", "MEDIUM", "HARD"]));
    assert.ok(summary.stems.size >= 5, `${locale}/${qlId} has too little stem variation`);
    summaries.set(`${locale}:${qlId}`, summary);
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
