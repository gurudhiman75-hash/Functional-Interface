import assert from "node:assert/strict";
import { generateIntCp008EnglishFrozenQuestion } from "./cp008-instalment-english-v6-frozen";
import {
  INT_CP008_LOCALIZED_LOCALES,
  INT_CP008_LOCALIZED_VERSION,
  generateIntCp008LocalizedReviewQuestion,
} from "./cp008-instalment-localized-v1";
import { INT_CP008_QL_IDS } from "./cp008-instalment-runtime-v1-final";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function mathSegments(text: string): readonly string[] { return Object.freeze(text.match(/\$[^$]+\$/gu) ?? []); }
function learnerText(q: any): string {
  return [q.presentation.prompt, q.presentation.markdown, q.explanation.keyIdea, ...q.explanation.steps, q.explanation.finalAnswer, q.explanation.commonMistake, ...q.options.map((o: any) => o.text)].join("\n");
}
function proseWithoutMath(text: string): string { return text.replace(/\$[^$]+\$/gu, ""); }
function protectedPayload(q: any) {
  return {
    runtimeVersion: q.runtimeVersion,
    checkpointId: q.checkpointId,
    qlId: q.qlId,
    seed: q.seed,
    mathematicalState: q.mathematicalState,
    answerSemantic: q.answerSemantic,
    options: q.options,
    correctIndex: q.correctIndex,
    correctAnswer: q.correctAnswer,
    presentationMeta: {
      representation: q.presentation.representation,
      contextClass: q.presentation.contextClass,
      stemFamilyId: q.presentation.stemFamilyId,
    },
  };
}

const coverage = new Map<string, Set<string>>();
const promptSets = new Map<string, Set<string>>();
let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let mathChecks = 0;
let scriptChecks = 0;
let editorialChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let roundingParityChecks = 0;

for (const locale of INT_CP008_LOCALIZED_LOCALES) {
  for (const qlId of INT_CP008_QL_IDS) {
    const key = `${locale}:${qlId}`;
    coverage.set(key, new Set());
    promptSets.set(key, new Set());
    for (let index = 0; index < 200; index += 1) {
      const seed = `int-cp008-localized-v1:${qlId}:${index}`;
      const english = generateIntCp008EnglishFrozenQuestion(qlId, seed) as any;
      const localized = generateIntCp008LocalizedReviewQuestion(qlId, seed, locale) as any;
      const replay = generateIntCp008LocalizedReviewQuestion(qlId, seed, locale) as any;
      questions += 1;

      assert.equal(stable(localized), stable(replay), `${key}/${seed}: nondeterministic localized replay`);
      deterministicChecks += 1;

      assert.equal(stable(protectedPayload(localized)), stable(protectedPayload(english)), `${key}/${seed}: protected payload drift`);
      assert.equal(localized.sourceEnglishFreezeId, "INT-CP-008-EN-v6-frozen");
      assert.equal(localized.sourceEnglishContentFrozen, true);
      assert.equal(localized.localizedVersion, INT_CP008_LOCALIZED_VERSION);
      assert.equal(localized.locale, locale);
      assert.equal(localized.options.length, 4);
      preservationChecks += 6;

      const englishMath = mathSegments([english.explanation.keyIdea, ...english.explanation.steps, english.explanation.commonMistake].join("\n"));
      const localizedMath = mathSegments([localized.explanation.keyIdea, ...localized.explanation.steps, localized.explanation.commonMistake].join("\n"));
      assert.equal(stable(localizedMath), stable(englishMath), `${key}/${seed}: MathJax segments drifted from frozen English`);
      for (const segment of localizedMath) assert.ok(!segment.includes("₹"), `${key}/${seed}: rupee symbol inside MathJax`);
      mathChecks += 1 + localizedMath.length;

      const text = learnerText(localized);
      const prose = proseWithoutMath(text);
      assert.ok(localized.presentation.prompt.length >= 45, `${key}/${seed}: prompt too short`);
      assert.ok(localized.explanation.keyIdea.length >= 45, `${key}/${seed}: key idea too short`);
      assert.ok(localized.explanation.steps.length >= 4, `${key}/${seed}: explanation too shallow`);
      assert.equal(localized.explanation.finalAnswer, localized.correctAnswer, `${key}/${seed}: final answer drift`);
      assert.ok(!/(?:undefined|null|NaN)/u.test(text), `${key}/${seed}: invalid placeholder text`);
      assert.ok(!/₹\d+\/\d+/u.test(text), `${key}/${seed}: raw fractional rupees`);
      assert.ok(!/₹[\d,]+\.\d{3,}/u.test(text), `${key}/${seed}: over-precision rupees`);
      assert.ok(!/\b(?:first 1|1 scheduled instalments|3th payment)\b/iu.test(text), `${key}/${seed}: deprecated English grammar leaked`);
      editorialChecks += 8;

      const englishRounds = String(english.presentation.prompt).includes("nearest paise");
      const localizedRounds = locale === "hi-IN" ? localized.presentation.prompt.includes("निकटतम पैसे") : localized.presentation.prompt.includes("ਨੇੜਲੇ ਪੈਸੇ");
      assert.equal(localizedRounds, englishRounds, `${key}/${seed}: nearest-paise instruction parity drift`);
      roundingParityChecks += 1;

      if (locale === "hi-IN") {
        assert.ok(/[\u0900-\u097F]/u.test(prose), `${key}/${seed}: Hindi script missing`);
        assert.ok(!/[\u0A00-\u0A7F]/u.test(prose), `${key}/${seed}: Gurmukhi leaked into Hindi`);
        assert.ok(!/\b(?:loan|payment|fund|balance|interest|period|installment|instalment|customer|borrower|schedule|opening|closing|rate)\b/iu.test(prose), `${key}/${seed}: English learner prose leaked into Hindi`);
      } else {
        assert.ok(/[\u0A00-\u0A7F]/u.test(prose), `${key}/${seed}: Punjabi script missing`);
        const punjabiLettersOnly = prose.replace(/[।॥]/gu, "");
        assert.ok(!/[\u0900-\u097F]/u.test(punjabiLettersOnly), `${key}/${seed}: Devanagari leaked into Punjabi`);
        assert.ok(!prose.includes("ਚੱਕਰਵੱਧੀ"), `${key}/${seed}: deprecated Punjabi compound-interest term leaked`);
        assert.ok(!/\b(?:loan|payment|fund|balance|interest|period|installment|instalment|customer|borrower|schedule|opening|closing|rate)\b/iu.test(prose), `${key}/${seed}: English learner prose leaked into Punjabi`);
      }
      scriptChecks += 4;

      assert.equal(localized.permanentIdentityFrozen, true);
      assert.equal(localized.learnerContentFrozen, false);
      assert.equal(localized.enabled, false);
      assert.equal(localized.stagingStatus, "NOT_STAGED");
      assert.equal(localized.registrationStatus, "NOT_REGISTERED");
      assert.equal(localized.questionStudioDiscoverable, false);
      assert.equal(localized.questionBankStatus, "NOT_STORED");
      assert.equal(localized.questionBankWritable, false);
      assert.equal(localized.testEligibility, "INELIGIBLE");
      assert.equal(localized.publiclyPublishable, false);
      lifecycleChecks += 10;

      assert.ok(Object.isFrozen(localized));
      assert.ok(Object.isFrozen(localized.presentation));
      assert.ok(Object.isFrozen(localized.options));
      assert.ok(Object.isFrozen(localized.explanation));
      assert.ok(Object.isFrozen(localized.explanation.steps));
      deepFreezeChecks += 5;

      coverage.get(key)!.add(localized.presentation.stemFamilyId);
      promptSets.get(key)!.add(localized.presentation.prompt);
    }
  }
}

for (const locale of INT_CP008_LOCALIZED_LOCALES) {
  for (const qlId of INT_CP008_QL_IDS) {
    const key = `${locale}:${qlId}`;
    assert.equal(coverage.get(key)!.size, 6, `${key}: expected all six stem families`);
    assert.ok(promptSets.get(key)!.size >= 50, `${key}: prompt pool too thin (${promptSets.get(key)!.size})`);
  }
}

assert.equal(questions, 3600);
console.log(JSON.stringify({
  localizedVersion: INT_CP008_LOCALIZED_VERSION,
  locales: INT_CP008_LOCALIZED_LOCALES,
  qls: INT_CP008_QL_IDS.length,
  questions,
  deterministicChecks,
  preservationChecks,
  mathChecks,
  scriptChecks,
  editorialChecks,
  lifecycleChecks,
  deepFreezeChecks,
  roundingParityChecks,
  stemFamilyCoverage: Object.fromEntries([...coverage.entries()].map(([k, v]) => [k, v.size])),
  uniquePromptCounts: Object.fromEntries([...promptSets.entries()].map(([k, v]) => [k, v.size])),
  permanentIdentityFrozen: true,
  sourceEnglishContentFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP008_LOCALIZED_V1_AUDIT");
