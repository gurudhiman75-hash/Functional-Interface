import {
  INT_CP005_V16_1_QL_IDS,
  generateIntCp005QuestionV16_1Final,
} from "./cp005-variable-growth-decay-runtime-v16-1-final-v2";
import {
  INT_CP005_V16_1_LOCALES,
  INT_CP005_V16_1_LOCALIZED_VERSION,
  generateIntCp005QuestionV16_1Localized,
} from "./cp005-variable-growth-decay-runtime-v16-1-localized-v3";
import { verifyIntCp005Answer } from "./cp005-variable-growth-decay-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function stable(value: unknown): string { return JSON.stringify(value, (_k, v) => typeof v === "bigint" ? `${v}n` : v); }
function r(value: { numerator: bigint; denominator: bigint }): string { return `${value.numerator}/${value.denominator}`; }
function normalizedStem(text: string): string {
  return text
    .replace(/₹[0-9,]+/gu, "₹N")
    .replace(/[0-9][0-9,]*(?:\.[0-9]+)?%/gu, "R%")
    .replace(/\b[0-9][0-9,]*(?:\.[0-9]+)?\b/gu, "N")
    .replace(/\s+/gu, " ")
    .trim();
}
const DEVANAGARI_LETTER_OR_SIGN = /[\u0900-\u0963\u0970-\u097F]/u;
const GURMUKHI_LETTER_OR_SIGN = /[\u0A00-\u0A7F]/u;

let questions = 0;
let parityChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let languageChecks = 0;
let selfContainedChecks = 0;
const skeletons = new Map<string, Set<string>>();
const positions = new Map<string, Set<number>>();
const contexts = new Map<string, Set<string>>();
for (const locale of INT_CP005_V16_1_LOCALES) {
  for (const qlId of INT_CP005_V16_1_QL_IDS) {
    skeletons.set(`${locale}:${qlId}`, new Set());
    positions.set(`${locale}:${qlId}`, new Set());
    contexts.set(`${locale}:${qlId}`, new Set());
  }
}

for (const locale of INT_CP005_V16_1_LOCALES) {
  for (const qlId of INT_CP005_V16_1_QL_IDS) {
    for (let index = 0; index < 320; index += 1) {
      const seed = `int-cp005-v16.1-localized-audit-${qlId}-${index}`;
      const en = generateIntCp005QuestionV16_1Final(qlId, seed);
      const loc = generateIntCp005QuestionV16_1Localized(qlId, seed, locale);
      const replay = generateIntCp005QuestionV16_1Localized(qlId, seed, locale);
      assert(stable(loc) === stable(replay), `${locale}/${qlId}/${seed}: replay drift`);
      questions += 1;
      assert(stable(loc.mathematicalState) === stable(en.mathematicalState), `${locale}/${qlId}/${seed}: mathematical state drift`);
      assert(r(loc.solution) === r(en.solution), `${locale}/${qlId}/${seed}: solution drift`);
      assert(loc.correctIndex === en.correctIndex, `${locale}/${qlId}/${seed}: correct index drift`);
      assert(loc.answerSemantic === en.answerSemantic && loc.representation === en.representation, `${locale}/${qlId}/${seed}: semantic/representation drift`);
      assert(verifyIntCp005Answer(loc.mathematicalState, loc.solution), `${locale}/${qlId}/${seed}: verifier failed`);
      parityChecks += 6;
      assert(loc.options.length === 4 && new Set(loc.options.map((o) => o.text)).size === 4, `${locale}/${qlId}/${seed}: option surface invalid`);
      for (let i = 0; i < 4; i += 1) {
        const a = loc.options[i]!; const b = en.options[i]!;
        assert(r(a.value) === r(b.value), `${locale}/${qlId}/${seed}/option${i}: value drift`);
        assert(a.misconceptionId === b.misconceptionId, `${locale}/${qlId}/${seed}/option${i}: misconception drift`);
        assert(a.isCorrect === b.isCorrect, `${locale}/${qlId}/${seed}/option${i}: ownership drift`);
        optionChecks += 3;
      }
      assert(loc.correctAnswer === loc.options[loc.correctIndex]!.text, `${locale}/${qlId}/${seed}: answer/index mismatch`);
      assert(!loc.enabled && loc.stagingStatus === "NOT_STAGED" && loc.registrationStatus === "NOT_REGISTERED", `${locale}/${qlId}/${seed}: lifecycle opened`);
      assert(!loc.questionStudioDiscoverable && loc.questionBankStatus === "NOT_STORED" && loc.testEligibility === "INELIGIBLE" && !loc.publiclyPublishable, `${locale}/${qlId}/${seed}: delivery opened`);
      lifecycleChecks += 7;
      positions.get(`${locale}:${qlId}`)!.add(loc.correctIndex);
      contexts.get(`${locale}:${qlId}`)!.add(loc.mathematicalState.context);
      skeletons.get(`${locale}:${qlId}`)!.add(normalizedStem(loc.presentation.markdown));

      const learner = [loc.presentation.markdown, ...loc.options.map((o) => `${o.text}\n${o.studentFeedback}`), loc.explanation.keyIdea, ...loc.explanation.steps, loc.explanation.commonMistake].join("\n");
      assert(!/production|capacity|salary|employee|executive/iu.test(learner), `${locale}/${qlId}/${seed}: rejected context leaked`);
      assert(!/\$[^\n]*\$/u.test(learner), `${locale}/${qlId}/${seed}: legacy MathJax leaked`);
      assert(!/₹[0-9]+,[0-9]{2},[0-9]{2},[0-9]{3}/u.test(learner), `${locale}/${qlId}/${seed}: crore-scale money leaked`);
      assert(loc.presentation.markdown.length <= 460, `${locale}/${qlId}/${seed}: localized stem too long`);

      if (loc.mathematicalState.qlId === "INT-QL-086" || loc.mathematicalState.qlId === "INT-QL-088") {
        const context = loc.mathematicalState.context;
        if (locale === "hi-IN") {
          if (context === "INVESTMENT") assert(loc.presentation.markdown.includes("चक्रवृद्धि"), `${qlId}/${seed}: Hindi investment mechanism missing`);
          if (context === "POPULATION") assert(loc.presentation.markdown.includes("वृद्धि"), `${qlId}/${seed}: Hindi population growth missing`);
          if (context === "ASSET") assert(loc.presentation.markdown.includes("वृद्धि"), `${qlId}/${seed}: Hindi asset appreciation missing`);
        } else {
          if (context === "INVESTMENT") assert(loc.presentation.markdown.includes("ਮਿਸ਼ਰਤ"), `${qlId}/${seed}: Punjabi investment mechanism missing`);
          if (context === "POPULATION") assert(/ਵਾਧ/u.test(loc.presentation.markdown), `${qlId}/${seed}: Punjabi population growth missing`);
          if (context === "ASSET") assert(/ਵਾਧ/u.test(loc.presentation.markdown), `${qlId}/${seed}: Punjabi asset appreciation missing`);
        }
        selfContainedChecks += 1;
      }
      if (loc.mathematicalState.qlId === "INT-QL-095") {
        if (locale === "hi-IN") assert(loc.presentation.markdown.includes("चक्रवृद्धि"), `${qlId}/${seed}: Hindi plan stem missing compound-interest mechanism`);
        else assert(loc.presentation.markdown.includes("ਮਿਸ਼ਰਤ"), `${qlId}/${seed}: Punjabi plan stem missing compound-interest mechanism`);
        selfContainedChecks += 1;
      }
      if (loc.mathematicalState.qlId === "INT-QL-092" && locale === "hi-IN") {
        assert(!loc.presentation.markdown.includes(" होता है।"), `${qlId}/${seed}: Hindi feminine asset grammar regressed`);
      }
      if (loc.mathematicalState.qlId === "INT-QL-088" && loc.mathematicalState.context === "POPULATION") {
        if (locale === "hi-IN") {
          assert(!/प्रारंभिक जनसंख्या कितना था/u.test(loc.presentation.markdown), `${qlId}/${seed}: Hindi population gender/case regression`);
          assert(!/का प्रारंभिक जनसंख्या/u.test(loc.presentation.markdown), `${qlId}/${seed}: Hindi population case regression`);
        } else {
          assert(!/ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ਕਿੰਨਾ ਸੀ/u.test(loc.presentation.markdown), `${qlId}/${seed}: Punjabi population gender regression`);
          assert(!/ਦਾ ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ/u.test(loc.presentation.markdown), `${qlId}/${seed}: Punjabi population case regression`);
        }
      }

      if (locale === "pa-IN") {
        assert(!DEVANAGARI_LETTER_OR_SIGN.test(learner), `${qlId}/${seed}: Devanagari letter/sign leaked into Punjabi`);
        assert(!learner.includes("ਚੱਕਰਵੱਧੀ ਵਿਆਜ"), `${qlId}/${seed}: rejected Punjabi CI term returned`);
        if (["INT-QL-087", "INT-QL-089", "INT-QL-095"].includes(qlId)) assert(learner.includes("ਮਿਸ਼ਰਤ"), `${qlId}/${seed}: approved Punjabi CI terminology missing`);
        languageChecks += 3;
      } else {
        assert(!GURMUKHI_LETTER_OR_SIGN.test(learner), `${qlId}/${seed}: Gurmukhi leaked into Hindi`);
        if (["INT-QL-087", "INT-QL-089", "INT-QL-095"].includes(qlId)) assert(learner.includes("चक्रवृद्धि"), `${qlId}/${seed}: Hindi CI terminology missing`);
        languageChecks += 2;
      }
    }
  }
}

for (const locale of INT_CP005_V16_1_LOCALES) {
  for (const qlId of INT_CP005_V16_1_QL_IDS) {
    assert(skeletons.get(`${locale}:${qlId}`)!.size >= 3, `${locale}/${qlId}: fewer than three normalized stem frames (${skeletons.get(`${locale}:${qlId}`)!.size})`);
    assert(positions.get(`${locale}:${qlId}`)!.size === 4, `${locale}/${qlId}: all answer positions not reached`);
  }
  for (const qlId of ["INT-QL-086", "INT-QL-088"] as const) {
    const set = contexts.get(`${locale}:${qlId}`)!;
    assert(set.has("INVESTMENT") && set.has("POPULATION") && set.has("ASSET"), `${locale}/${qlId}: context coverage incomplete`);
  }
}
let rejected = 0;
for (const locale of INT_CP005_V16_1_LOCALES) {
  try { generateIntCp005QuestionV16_1Localized("INT-QL-094", `reject-${locale}`, locale); } catch { rejected += 1; }
}
assert(rejected === 2, "QL094 did not remain rejected in both locales");

console.log(JSON.stringify({
  localizedVersion: INT_CP005_V16_1_LOCALIZED_VERSION,
  qls: INT_CP005_V16_1_QL_IDS.length,
  locales: INT_CP005_V16_1_LOCALES,
  questions,
  parityChecks,
  optionChecks,
  lifecycleChecks,
  languageChecks,
  selfContainedChecks,
  normalizedStemFrames: Object.fromEntries([...skeletons].map(([key, value]) => [key, value.size])),
  contextCoverage: Object.fromEntries([...contexts].map(([key, value]) => [key, [...value].sort()])),
  ql094RejectedLocales: rejected,
}, null, 2));
console.log("PASS_INT_CP005_V16_1_MULTILINGUAL_HARDENING");
