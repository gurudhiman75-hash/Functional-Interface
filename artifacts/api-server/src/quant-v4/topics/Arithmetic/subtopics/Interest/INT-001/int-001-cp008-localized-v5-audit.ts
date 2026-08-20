import assert from "node:assert/strict";
import { generateIntCp008EnglishFrozenQuestion } from "./cp008-instalment-english-v6-frozen";
import { generateIntCp008LocalizedReviewQuestion as generateV4 } from "./cp008-instalment-localized-v4";
import {
  INT_CP008_LOCALIZED_VERSION,
  INT_CP008_LOCALIZED_V5_SUPERSEDES,
  generateIntCp008LocalizedReviewQuestion as generateV5,
  type IntCp008LocalizedLocale,
} from "./cp008-instalment-localized-v5";
import { INT_CP008_QL_IDS } from "./cp008-instalment-runtime-v1-final";

const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const satisfies readonly IntCp008LocalizedLocale[]);
function stable(value: unknown): string { return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item); }
function mathSegments(text: string): readonly string[] { return Object.freeze(text.match(/\$[^$]+\$/gu) ?? []); }
function learnerText(q: any): string { return [q.presentation.prompt, q.presentation.markdown, q.explanation.keyIdea, ...q.explanation.steps, q.explanation.finalAnswer, q.explanation.commonMistake, ...q.options.map((o: any) => o.text)].join("\n"); }
function proseWithoutMath(text: string): string { return text.replace(/\$[^$]+\$/gu, ""); }
function protectedPayload(q: any) {
  return {
    runtimeVersion: q.runtimeVersion, checkpointId: q.checkpointId, qlId: q.qlId, seed: q.seed,
    mathematicalState: q.mathematicalState, answerSemantic: q.answerSemantic,
    options: q.options, correctIndex: q.correctIndex, correctAnswer: q.correctAnswer,
    presentationMeta: { representation: q.presentation.representation, contextClass: q.presentation.contextClass, stemFamilyId: q.presentation.stemFamilyId },
  };
}
function v4NonProsePayload(q: any) {
  return {
    id: q.id, runtimeVersion: q.runtimeVersion, englishVersion: q.englishVersion, checkpointId: q.checkpointId,
    qlId: q.qlId, locale: q.locale, seed: q.seed, mathematicalState: q.mathematicalState, answerSemantic: q.answerSemantic,
    presentationMeta: { representation: q.presentation.representation, contextClass: q.presentation.contextClass, stemFamilyId: q.presentation.stemFamilyId },
    options: q.options, correctIndex: q.correctIndex, correctAnswer: q.correctAnswer, finalAnswer: q.explanation.finalAnswer,
    sourceEnglishFreezeId: q.sourceEnglishFreezeId, sourceEnglishContentFrozen: q.sourceEnglishContentFrozen,
    permanentIdentityFrozen: q.permanentIdentityFrozen, learnerContentFrozen: q.learnerContentFrozen,
    enabled: q.enabled, stagingStatus: q.stagingStatus, registrationStatus: q.registrationStatus,
    questionStudioDiscoverable: q.questionStudioDiscoverable, questionBankStatus: q.questionBankStatus,
    questionBankWritable: q.questionBankWritable, testEligibility: q.testEligibility, publiclyPublishable: q.publiclyPublishable,
  };
}

const coverage = new Map<string, Set<string>>();
const promptSets = new Map<string, Set<string>>();
const changedByQl = new Map<string, number>();
let questions = 0, deterministicChecks = 0, preservationChecks = 0, v4PayloadChecks = 0;
let mathChecks = 0, scriptChecks = 0, editorialChecks = 0, lifecycleChecks = 0, deepFreezeChecks = 0, roundingParityChecks = 0;
let changedQuestions = 0, targetedRepairChecks = 0;

for (const locale of LOCALES) {
  for (const qlId of INT_CP008_QL_IDS) {
    const key = `${locale}:${qlId}`;
    coverage.set(key, new Set()); promptSets.set(key, new Set());
    for (let index = 0; index < 200; index += 1) {
      const seed = `int-cp008-localized-v5:${qlId}:${index}`;
      const english = generateIntCp008EnglishFrozenQuestion(qlId, seed) as any;
      const v4 = generateV4(qlId, seed, locale) as any;
      const localized = generateV5(qlId, seed, locale) as any;
      const replay = generateV5(qlId, seed, locale) as any;
      questions += 1;

      assert.equal(stable(localized), stable(replay), `${key}/${seed}: nondeterministic V5 replay`); deterministicChecks += 1;
      assert.equal(stable(protectedPayload(localized)), stable(protectedPayload(english)), `${key}/${seed}: frozen-English protected payload drift`);
      assert.equal(stable(v4NonProsePayload(localized)), stable(v4NonProsePayload(v4)), `${key}/${seed}: V4 non-prose payload drift`);
      assert.equal(localized.localizedVersion, INT_CP008_LOCALIZED_VERSION);
      assert.equal(INT_CP008_LOCALIZED_V5_SUPERSEDES, "INT-CP-008-HI-PA-v4-final-language-review");
      assert.equal(localized.sourceEnglishFreezeId, "INT-CP-008-EN-v6-frozen");
      assert.equal(localized.sourceEnglishContentFrozen, true);
      preservationChecks += 5; v4PayloadChecks += 1;

      const englishMath = mathSegments([english.explanation.keyIdea, ...english.explanation.steps, english.explanation.commonMistake].join("\n"));
      const localizedMath = mathSegments([localized.explanation.keyIdea, ...localized.explanation.steps, localized.explanation.commonMistake].join("\n"));
      assert.equal(stable(localizedMath), stable(englishMath), `${key}/${seed}: MathJax segments drifted from frozen English`);
      for (const segment of localizedMath) assert.ok(!segment.includes("₹"), `${key}/${seed}: rupee symbol inside MathJax`);
      mathChecks += 1 + localizedMath.length;

      const v4Learner = learnerText(v4), v5Learner = learnerText(localized);
      if (v4Learner !== v5Learner) {
        changedQuestions += 1;
        changedByQl.set(qlId, (changedByQl.get(qlId) ?? 0) + 1);
      }

      const text = learnerText(localized), prose = proseWithoutMath(text);
      assert.ok(localized.presentation.prompt.length >= 45, `${key}/${seed}: prompt too short`);
      assert.ok(localized.explanation.keyIdea.length >= 40, `${key}/${seed}: key idea too short`);
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
      assert.ok(!localized.presentation.prompt.includes("मौद्रिक उत्तर निकटतम पैसे तक दें।"));
      assert.ok(!localized.presentation.prompt.includes("ਰਕਮ ਵਾਲਾ ਉੱਤਰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੈਸੇ ਤੱਕ ਦਿਓ।"));
      targetedRepairChecks += 2;

      assert.ok(!text.includes("बकाया अपडेट करें"), `${key}/${seed}: Hindi update calque remains`);
      assert.ok(!text.includes("ਬਕਾਇਆ ਅਪਡੇਟ ਕਰੋ"), `${key}/${seed}: Punjabi update calque remains`);
      assert.ok(!text.includes("एकल शुरुआती राशि"), `${key}/${seed}: stiff Hindi QL117 wording remains`);
      assert.ok(!text.includes("ਇਕੱਲੀ ਸ਼ੁਰੂਆਤੀ ਰਕਮ"), `${key}/${seed}: stiff Punjabi QL117 wording remains`);
      assert.ok(!text.includes("सटीक पुनर्भुगतान पुनरावृत्ति"), `${key}/${seed}: stiff Hindi QL121 wording remains`);
      assert.ok(!text.includes("ਸਹੀ ਵਾਪਸੀ ਪੁਨਰਾਵਰਤੀ"), `${key}/${seed}: stiff Punjabi QL121 wording remains`);
      assert.ok(!text.includes("पुनर्भुगतान कार्यक्रम"), `${key}/${seed}: Hindi program calque remains`);
      assert.ok(!text.includes("ਵਾਪਸੀ ਕਾਰਜਕ੍ਰਮ"), `${key}/${seed}: Punjabi program calque remains`);
      assert.ok(!/\b1 ਅਦਾਇਗੀਆਂ\b/u.test(text), `${key}/${seed}: Punjabi singular/plural defect remains`);
      targetedRepairChecks += 9;

      if (qlId === "INT-QL-119") {
        assert.ok(!/पहले 1 (?:अवधि-अंत )?भुगतान/u.test(text));
        assert.ok(!/₹[\d,]+(?:\.\d+)? की 1 (?:नियमित|तय) किस्तों/u.test(text));
        assert.ok(!/ਪਹਿਲੀਆਂ 1 (?:ਮਿਆਦ-ਅੰਤ )?ਅਦਾਇਗੀਆਂ/u.test(text));
        assert.ok(!/₹[\d,]+(?:\.\d+)? ਦੀਆਂ 1 (?:ਨਿਯਮਿਤ ਕਿਸ਼ਤਾਂ|ਅਦਾਇਗੀਆਂ|ਨਿਯਤ ਕਿਸ਼ਤਾਂ)/u.test(text));
        assert.ok(!/बकाया राशि पर \d+(?:\.\d+)?% प्रति (?:वर्ष|छमाही) लगता है/u.test(text));
        assert.ok(!/ਬਕਾਇਆ ਰਕਮ ਤੇ \d+(?:\.\d+)?% ਪ੍ਰਤੀ (?:ਸਾਲ|ਛਿਮਾਹੀ) ਲੱਗਦਾ ਹੈ/u.test(text));
        targetedRepairChecks += 6;
      }
      if (qlId === "INT-QL-121" && localized.presentation.stemFamilyId === "INT-QL-121-T6") {
        assert.ok(!/बकाया राशि \d+ अवधियों के लिए है/u.test(localized.presentation.prompt));
        assert.ok(!/ਬਕਾਇਆ ਰਕਮ \d+ ਮਿਆਦਾਂ ਲਈ ਹੈ/u.test(localized.presentation.prompt));
        targetedRepairChecks += 2;
      }
      if (qlId === "INT-QL-122" && localized.presentation.stemFamilyId === "INT-QL-122-T4") {
        assert.ok(!/कोष शून्य से शुरू होता है, .* कमाता है/u.test(localized.presentation.prompt));
        assert.ok(!/ਫੰਡ ਸਿਫ਼ਰ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ, .* ਕਮਾਉਂਦਾ ਹੈ/u.test(localized.presentation.prompt));
        targetedRepairChecks += 2;
      }
      if (qlId === "INT-QL-123" && localized.presentation.stemFamilyId === "INT-QL-123-T6") {
        assert.ok(!/^उधारकर्ता ₹[\d,]+(?:\.\d+)? की भुगतान संख्या/u.test(localized.presentation.prompt));
        assert.ok(!/^ਕਰਜ਼ਦਾਰ ₹[\d,]+(?:\.\d+)? ਦੀ ਅਦਾਇਗੀ ਨੰਬਰ/u.test(localized.presentation.prompt));
        targetedRepairChecks += 2;
      }
      if (qlId === "INT-QL-124") {
        assert.ok(!localized.presentation.prompt.includes("दो वित्त योजनाएँ समान"));
        assert.ok(!localized.presentation.prompt.includes("ਕਵਰ ਕਰਦੀਆਂ ਹਨ"));
        assert.ok(!text.includes("अवधि संख्या"), `${key}/${seed}: Hindi अवधि संख्या wording remains`);
        targetedRepairChecks += 3;
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
assert.ok(changedQuestions > 0, "V5 did not change learner prose");
for (const qlId of ["INT-QL-116", "INT-QL-117", "INT-QL-118", "INT-QL-121", "INT-QL-122", "INT-QL-124"] as const) {
  assert.ok((changedByQl.get(qlId) ?? 0) > 0, `${qlId}: expected V5 editorial polish was not exercised`);
}
assert.ok(!changedByQl.has("INT-QL-119"), "V5 should not modify already-fixed QL119 learner prose");
assert.ok(!changedByQl.has("INT-QL-120"), "V5 should not modify QL120 learner prose");
assert.ok(!changedByQl.has("INT-QL-123"), "V5 should not modify QL123 learner prose");

console.log(JSON.stringify({
  localizedVersion: INT_CP008_LOCALIZED_VERSION, supersedes: INT_CP008_LOCALIZED_V5_SUPERSEDES,
  questions, deterministicChecks, preservationChecks, v4PayloadChecks, mathChecks, scriptChecks,
  editorialChecks, lifecycleChecks, deepFreezeChecks, roundingParityChecks, targetedRepairChecks,
  changedQuestions, changedByQl: Object.fromEntries(changedByQl),
  stemFamilyCoverage: Object.fromEntries([...coverage].map(([k,v]) => [k,v.size])),
  uniquePromptCounts: Object.fromEntries([...promptSets].map(([k,v]) => [k,v.size])),
  permanentIdentityFrozen: true, sourceEnglishContentFrozen: true, learnerContentFrozen: false, learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP008_LOCALIZED_V5_AUDIT");
