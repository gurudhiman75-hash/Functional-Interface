import assert from "node:assert/strict";
import { generateIntCp008EnglishFrozenQuestion } from "./cp008-instalment-english-v6-frozen";
import { generateIntCp008LocalizedReviewQuestion as generateV1 } from "./cp008-instalment-localized-v1";
import {
  INT_CP008_LOCALIZED_VERSION,
  generateIntCp008LocalizedReviewQuestion as generateV2,
  type IntCp008LocalizedLocale,
} from "./cp008-instalment-localized-v2";
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
function v1PreservedPayload(q: any) {
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
    presentation: q.presentation,
    options: q.options,
    correctIndex: q.correctIndex,
    correctAnswer: q.correctAnswer,
    sourceEnglishFreezeId: q.sourceEnglishFreezeId,
    sourceEnglishContentFrozen: q.sourceEnglishContentFrozen,
  };
}

const coverage = new Map<string, Set<string>>();
const promptSets = new Map<string, Set<string>>();
let questions = 0, deterministicChecks = 0, preservationChecks = 0, v1PayloadChecks = 0;
let mathChecks = 0, scriptChecks = 0, editorialChecks = 0, lifecycleChecks = 0, deepFreezeChecks = 0, roundingParityChecks = 0;
let changedQuestions = 0, ql120MathRepairs = 0;

for (const locale of LOCALES) {
  for (const qlId of INT_CP008_QL_IDS) {
    const key = `${locale}:${qlId}`;
    coverage.set(key, new Set()); promptSets.set(key, new Set());
    for (let index = 0; index < 200; index += 1) {
      const seed = `int-cp008-localized-v1:${qlId}:${index}`;
      const english = generateIntCp008EnglishFrozenQuestion(qlId, seed) as any;
      const v1 = generateV1(qlId, seed, locale) as any;
      const localized = generateV2(qlId, seed, locale) as any;
      const replay = generateV2(qlId, seed, locale) as any;
      questions += 1;

      assert.equal(stable(localized), stable(replay), `${key}/${seed}: nondeterministic V2 replay`); deterministicChecks += 1;
      assert.equal(stable(protectedPayload(localized)), stable(protectedPayload(english)), `${key}/${seed}: frozen-English protected payload drift`);
      assert.equal(stable(v1PreservedPayload(localized)), stable(v1PreservedPayload(v1)), `${key}/${seed}: V1 non-explanation payload drift`);
      assert.equal(localized.localizedVersion, INT_CP008_LOCALIZED_VERSION);
      assert.equal(localized.sourceEnglishFreezeId, "INT-CP-008-EN-v6-frozen");
      assert.equal(localized.sourceEnglishContentFrozen, true);
      preservationChecks += 4; v1PayloadChecks += 1;

      const englishMath = mathSegments([english.explanation.keyIdea, ...english.explanation.steps, english.explanation.commonMistake].join("\n"));
      const localizedMath = mathSegments([localized.explanation.keyIdea, ...localized.explanation.steps, localized.explanation.commonMistake].join("\n"));
      assert.equal(stable(localizedMath), stable(englishMath), `${key}/${seed}: MathJax segments drifted from frozen English`);
      for (const segment of localizedMath) assert.ok(!segment.includes("₹"), `${key}/${seed}: rupee symbol inside MathJax`);
      mathChecks += 1 + localizedMath.length;

      const v1Explanation = stable(v1.explanation);
      const v2Explanation = stable(localized.explanation);
      if (v1Explanation !== v2Explanation) {
        changedQuestions += 1;
        assert.equal(qlId, "INT-QL-120", `${key}/${seed}: V2 explanation changed outside QL120`);
        ql120MathRepairs += 1;
      } else if (qlId === "INT-QL-120") {
        throw new Error(`${key}/${seed}: QL120 V2 repair did not change failed V1 explanation`);
      }

      const text = learnerText(localized), prose = proseWithoutMath(text);
      assert.ok(localized.presentation.prompt.length >= 45, `${key}/${seed}: prompt too short`);
      assert.ok(localized.explanation.keyIdea.length >= 45, `${key}/${seed}: key idea too short`);
      assert.ok(localized.explanation.steps.length >= 4, `${key}/${seed}: explanation too shallow`);
      assert.equal(localized.explanation.finalAnswer, localized.correctAnswer, `${key}/${seed}: final answer drift`);
      assert.ok(!/(?:undefined|null|NaN)/u.test(text), `${key}/${seed}: invalid placeholder text`);
      assert.ok(!/₹\d+\/\d+/u.test(text), `${key}/${seed}: raw fractional rupees`);
      assert.ok(!/₹[\d,]+\.\d{3,}/u.test(text), `${key}/${seed}: over-precision rupees`);
      editorialChecks += 7;

      const englishRounds = String(english.presentation.prompt).includes("nearest paise");
      const localizedRounds = locale === "hi-IN" ? localized.presentation.prompt.includes("निकटतम पैसे") : localized.presentation.prompt.includes("ਨੇੜਲੇ ਪੈਸੇ");
      assert.equal(localizedRounds, englishRounds, `${key}/${seed}: nearest-paise instruction parity drift`); roundingParityChecks += 1;

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
assert.equal(questions, 3600); assert.equal(changedQuestions, 400); assert.equal(ql120MathRepairs, 400);

console.log(JSON.stringify({ localizedVersion: INT_CP008_LOCALIZED_VERSION, questions, deterministicChecks, preservationChecks, v1PayloadChecks, mathChecks, scriptChecks, editorialChecks, lifecycleChecks, deepFreezeChecks, roundingParityChecks, changedQuestions, ql120MathRepairs, stemFamilyCoverage: Object.fromEntries([...coverage].map(([k,v]) => [k,v.size])), uniquePromptCounts: Object.fromEntries([...promptSets].map(([k,v]) => [k,v.size])), permanentIdentityFrozen: true, sourceEnglishContentFrozen: true, learnerContentFrozen: false, learnerDeliveryAuthorized: false }, null, 2));
console.log("PASS_INT_CP008_LOCALIZED_V2_AUDIT");
