import assert from "node:assert/strict";
import { generateIntCp008EnglishFrozenQuestion } from "./cp008-instalment-english-v6-frozen";
import { generateIntCp008LocalizedReviewQuestion as generateV3 } from "./cp008-instalment-localized-v3";
import {
  INT_CP008_LOCALIZED_VERSION,
  INT_CP008_LOCALIZED_V4_SUPERSEDES,
  generateIntCp008LocalizedReviewQuestion as generateV4,
  type IntCp008LocalizedLocale,
} from "./cp008-instalment-localized-v4";
import { INT_CP008_QL_IDS } from "./cp008-instalment-runtime-v1-final";

const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const satisfies readonly IntCp008LocalizedLocale[]);
function stable(value: unknown): string { return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item); }
function mathSegments(text: string): readonly string[] { return Object.freeze(text.match(/\$[^$]+\$/gu) ?? []); }
function learnerText(q: any): string { return [q.presentation.prompt, q.presentation.markdown, q.explanation.keyIdea, ...q.explanation.steps, q.explanation.finalAnswer, q.explanation.commonMistake, ...q.options.map((o: any) => o.text)].join("\n"); }
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
function v3NonProsePayload(q: any) {
  return {
    id: q.id,
    runtimeVersion: q.runtimeVersion,
    englishVersion: q.englishVersion,
    checkpointId: q.checkpointId,
    qlId: q.qlId,
    locale: q.locale,
    seed: q.seed,
    mathematicalState: q.mathematicalState,
    answerSemantic: q.answerSemantic,
    presentationMeta: {
      representation: q.presentation.representation,
      contextClass: q.presentation.contextClass,
      stemFamilyId: q.presentation.stemFamilyId,
    },
    options: q.options,
    correctIndex: q.correctIndex,
    correctAnswer: q.correctAnswer,
    finalAnswer: q.explanation.finalAnswer,
    sourceEnglishFreezeId: q.sourceEnglishFreezeId,
    sourceEnglishContentFrozen: q.sourceEnglishContentFrozen,
    permanentIdentityFrozen: q.permanentIdentityFrozen,
    learnerContentFrozen: q.learnerContentFrozen,
    enabled: q.enabled,
    stagingStatus: q.stagingStatus,
    registrationStatus: q.registrationStatus,
    questionStudioDiscoverable: q.questionStudioDiscoverable,
    questionBankStatus: q.questionBankStatus,
    questionBankWritable: q.questionBankWritable,
    testEligibility: q.testEligibility,
    publiclyPublishable: q.publiclyPublishable,
  };
}

const coverage = new Map<string, Set<string>>();
const promptSets = new Map<string, Set<string>>();
const changedByQl = new Map<string, number>();
let questions = 0, deterministicChecks = 0, preservationChecks = 0, v3PayloadChecks = 0;
let mathChecks = 0, scriptChecks = 0, editorialChecks = 0, lifecycleChecks = 0, deepFreezeChecks = 0, roundingParityChecks = 0;
let changedQuestions = 0, targetedRepairChecks = 0, ql119SingularRepairs = 0;

for (const locale of LOCALES) {
  for (const qlId of INT_CP008_QL_IDS) {
    const key = `${locale}:${qlId}`;
    coverage.set(key, new Set()); promptSets.set(key, new Set());
    for (let index = 0; index < 200; index += 1) {
      const seed = `int-cp008-localized-v4:${qlId}:${index}`;
      const english = generateIntCp008EnglishFrozenQuestion(qlId, seed) as any;
      const v3 = generateV3(qlId, seed, locale) as any;
      const localized = generateV4(qlId, seed, locale) as any;
      const replay = generateV4(qlId, seed, locale) as any;
      questions += 1;

      assert.equal(stable(localized), stable(replay), `${key}/${seed}: nondeterministic V4 replay`); deterministicChecks += 1;
      assert.equal(stable(protectedPayload(localized)), stable(protectedPayload(english)), `${key}/${seed}: frozen-English protected payload drift`);
      assert.equal(stable(v3NonProsePayload(localized)), stable(v3NonProsePayload(v3)), `${key}/${seed}: V3 non-prose payload drift`);
      assert.equal(localized.localizedVersion, INT_CP008_LOCALIZED_VERSION);
      assert.equal(INT_CP008_LOCALIZED_V4_SUPERSEDES, "INT-CP-008-HI-PA-v3-editorial-review");
      assert.equal(localized.sourceEnglishFreezeId, "INT-CP-008-EN-v6-frozen");
      assert.equal(localized.sourceEnglishContentFrozen, true);
      preservationChecks += 5; v3PayloadChecks += 1;

      const englishMath = mathSegments([english.explanation.keyIdea, ...english.explanation.steps, english.explanation.commonMistake].join("\n"));
      const localizedMath = mathSegments([localized.explanation.keyIdea, ...localized.explanation.steps, localized.explanation.commonMistake].join("\n"));
      assert.equal(stable(localizedMath), stable(englishMath), `${key}/${seed}: MathJax segments drifted from frozen English`);
      for (const segment of localizedMath) assert.ok(!segment.includes("₹"), `${key}/${seed}: rupee symbol inside MathJax`);
      mathChecks += 1 + localizedMath.length;

      const v3Learner = learnerText(v3), v4Learner = learnerText(localized);
      if (v3Learner !== v4Learner) {
        changedQuestions += 1;
        changedByQl.set(qlId, (changedByQl.get(qlId) ?? 0) + 1);
        assert.equal(qlId, "INT-QL-119", `${key}/${seed}: V4 learner prose changed outside QL119`);
        assert.equal(v3.mathematicalState.contractState.periods - 1, 1, `${key}/${seed}: V4 QL119 changed outside singular state`);
        ql119SingularRepairs += 1;
      }

      const text = learnerText(localized), prose = proseWithoutMath(text);
      assert.ok(localized.presentation.prompt.length >= 45, `${key}/${seed}: prompt too short`);
      assert.ok(localized.explanation.keyIdea.length >= 45, `${key}/${seed}: key idea too short`);
      assert.ok(localized.explanation.steps.length >= 4, `${key}/${seed}: explanation too shallow`);
      assert.equal(localized.explanation.finalAnswer, localized.correctAnswer, `${key}/${seed}: final answer drift`);
      assert.ok(!/(?:undefined|null|NaN)/u.test(text), `${key}/${seed}: invalid placeholder text`);
      assert.ok(!/₹\d+\/\d+/u.test(text), `${key}/${seed}: raw fractional rupees`);
      assert.ok(!/₹[\d,]+\.\d{3,}/u.test(text), `${key}/${seed}: over-precision rupees`);
      assert.ok(!/₹[\d,]+(?:\.\d+)?,\s+(?:होता|होती|होते|ਹੁੰਦਾ|ਹੁੰਦੀ|ਹੁੰਦੇ)/u.test(text), `${key}/${seed}: comma remains between money and copula`);
      editorialChecks += 8;

      const englishRounds = String(english.presentation.prompt).includes("nearest paise");
      const localizedRounds = locale === "hi-IN" ? localized.presentation.prompt.includes("निकटतम पैसे") : localized.presentation.prompt.includes("ਨੇੜਲੇ ਪੈਸੇ");
      assert.equal(localizedRounds, englishRounds, `${key}/${seed}: nearest-paise instruction parity drift`); roundingParityChecks += 1;
      assert.ok(!localized.presentation.prompt.includes("मौद्रिक उत्तर निकटतम पैसे तक दें।"), `${key}/${seed}: old Hindi paise instruction remains`);
      assert.ok(!localized.presentation.prompt.includes("ਰਕਮ ਵਾਲਾ ਉੱਤਰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੈਸੇ ਤੱਕ ਦਿਓ।"), `${key}/${seed}: old Punjabi paise instruction remains`);
      targetedRepairChecks += 2;

      if (qlId === "INT-QL-119") {
        assert.ok(!/पहले 1 (?:अवधि-अंत )?भुगतान/u.test(text), `${key}/${seed}: Hindi singular QL119 'पहले 1' form remains`);
        assert.ok(!/₹[\d,]+(?:\.\d+)? की 1 (?:नियमित|तय) किस्तों/u.test(text), `${key}/${seed}: Hindi singular QL119 plural noun remains`);
        assert.ok(!/ਪਹਿਲੀਆਂ 1 (?:ਮਿਆਦ-ਅੰਤ )?ਅਦਾਇਗੀਆਂ/u.test(text), `${key}/${seed}: Punjabi singular QL119 'ਪਹਿਲੀਆਂ 1' form remains`);
        assert.ok(!/₹[\d,]+(?:\.\d+)? ਦੀਆਂ 1 (?:ਨਿਯਮਿਤ ਕਿਸ਼ਤਾਂ|ਅਦਾਇਗੀਆਂ|ਨਿਯਤ ਕਿਸ਼ਤਾਂ)/u.test(text), `${key}/${seed}: Punjabi singular QL119 plural noun remains`);
        assert.ok(!/बकाया राशि पर \d+(?:\.\d+)?% प्रति (?:वर्ष|छमाही) लगता है/u.test(text), `${key}/${seed}: Hindi QL119 missing ब्याज`);
        assert.ok(!/ਬਕਾਇਆ ਰਕਮ ਤੇ \d+(?:\.\d+)?% ਪ੍ਰਤੀ (?:ਸਾਲ|ਛਿਮਾਹੀ) ਲੱਗਦਾ ਹੈ/u.test(text), `${key}/${seed}: Punjabi QL119 missing ਵਿਆਜ`);
        targetedRepairChecks += 6;
      }
      if (qlId === "INT-QL-123" && localized.presentation.stemFamilyId === "INT-QL-123-T6") {
        assert.ok(!/^उधारकर्ता ₹[\d,]+(?:\.\d+)? की भुगतान संख्या/u.test(localized.presentation.prompt), `${key}/${seed}: awkward Hindi QL123-T6 form remains`);
        assert.ok(!/^ਕਰਜ਼ਦਾਰ ₹[\d,]+(?:\.\d+)? ਦੀ ਅਦਾਇਗੀ ਨੰਬਰ/u.test(localized.presentation.prompt), `${key}/${seed}: awkward Punjabi QL123-T6 form remains`);
        targetedRepairChecks += 2;
      }
      if (qlId === "INT-QL-124") {
        assert.ok(!localized.presentation.prompt.includes("दो वित्त योजनाएँ समान"), `${key}/${seed}: Hindi literal finance-offer wording remains`);
        assert.ok(!localized.presentation.prompt.includes("ਕਵਰ ਕਰਦੀਆਂ ਹਨ"), `${key}/${seed}: Punjabi cover calque remains`);
        if (localized.presentation.stemFamilyId === "INT-QL-124-T4") {
          assert.ok(!/अवधि-अंत भुगतान दोनों स्थितियों में समान रहते हैं/u.test(localized.presentation.prompt), `${key}/${seed}: ambiguous Hindi QL124-T4 wording remains`);
          assert.ok(!/ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ ਦੋਵਾਂ ਹਾਲਤਾਂ ਵਿੱਚ ਇੱਕੋ ਹਨ/u.test(localized.presentation.prompt), `${key}/${seed}: ambiguous Punjabi QL124-T4 wording remains`);
        }
        targetedRepairChecks += 4;
      }

      if (locale === "hi-IN") {
        assert.ok(/[\u0900-\u097F]/u.test(prose), `${key}/${seed}: Hindi script missing`);
        assert.ok(!/[\u0A00-\u0A7F]/u.test(prose), `${key}/${seed}: Gurmukhi leaked into Hindi`);
        assert.ok(!/\b(?:loan|payment|fund|balance|interest|period|installment|instalment|customer|borrower|schedule|opening|closing|rate)\b/iu.test(prose), `${key}/${seed}: English learner prose leaked into Hindi`);
      } else {
        assert.ok(/[\u0A00-\u0A7F]/u.test(prose), `${key}/${seed}: Punjabi script missing`);
        assert.ok(!/[\u0900-\u097F]/u.test(prose.replace(/[।॥]/gu, "")), `${key}/${seed}: Devanagari leaked into Punjabi`);
        assert.ok(!prose.includes("ਚੱਕਰਵੱਧੀ"), `${key}/${seed}: deprecated Punjabi compound-interest term leaked`);
        assert.ok(!/\b(?:loan|payment|fund|balance|interest|period|installment|instalment|customer|borrower|schedule|opening|closing|rate)\b/iu.test(prose), `${key}/${seed}: English learner prose leaked into Punjabi`);
      }
      scriptChecks += 4;

      assert.equal(localized.permanentIdentityFrozen, true); assert.equal(localized.learnerContentFrozen, false);
      assert.equal(localized.enabled, false); assert.equal(localized.stagingStatus, "NOT_STAGED"); assert.equal(localized.registrationStatus, "NOT_REGISTERED");
      assert.equal(localized.questionStudioDiscoverable, false); assert.equal(localized.questionBankStatus, "NOT_STORED"); assert.equal(localized.questionBankWritable, false);
      assert.equal(localized.testEligibility, "INELIGIBLE"); assert.equal(localized.publiclyPublishable, false); lifecycleChecks += 10;
      assert.ok(Object.isFrozen(localized)); assert.ok(Object.isFrozen(localized.presentation)); assert.ok(Object.isFrozen(localized.options));
      assert.ok(Object.isFrozen(localized.explanation)); assert.ok(Object.isFrozen(localized.explanation.steps)); deepFreezeChecks += 5;

      coverage.get(key)!.add(localized.presentation.stemFamilyId); promptSets.get(key)!.add(localized.presentation.prompt);
    }
  }
}

for (const locale of LOCALES) for (const qlId of INT_CP008_QL_IDS) {
  const key = `${locale}:${qlId}`;
  assert.equal(coverage.get(key)!.size, 6, `${key}: expected all six stem families`);
  assert.ok(promptSets.get(key)!.size >= 50, `${key}: prompt pool too thin (${promptSets.get(key)!.size})`);
}
assert.equal(questions, 3600);
assert.ok(changedQuestions > 0, "V4 did not repair any QL119 singular surfaces");
assert.deepEqual([...changedByQl.keys()], ["INT-QL-119"], "V4 learner changes must be confined to QL119");

console.log(JSON.stringify({
  localizedVersion: INT_CP008_LOCALIZED_VERSION,
  supersedes: INT_CP008_LOCALIZED_V4_SUPERSEDES,
  questions, deterministicChecks, preservationChecks, v3PayloadChecks, mathChecks, scriptChecks,
  editorialChecks, lifecycleChecks, deepFreezeChecks, roundingParityChecks, targetedRepairChecks,
  changedQuestions, ql119SingularRepairs, changedByQl: Object.fromEntries(changedByQl),
  stemFamilyCoverage: Object.fromEntries([...coverage].map(([k,v]) => [k,v.size])),
  uniquePromptCounts: Object.fromEntries([...promptSets].map(([k,v]) => [k,v.size])),
  permanentIdentityFrozen: true, sourceEnglishContentFrozen: true, learnerContentFrozen: false, learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP008_LOCALIZED_V4_AUDIT");
