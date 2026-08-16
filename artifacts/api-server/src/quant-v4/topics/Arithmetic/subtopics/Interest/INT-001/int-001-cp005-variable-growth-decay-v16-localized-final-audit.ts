import { INT_CP005_V16_QL_IDS, generateIntCp005QuestionV16EditorialFinal } from "./cp005-variable-growth-decay-runtime-v16-editorial-final";
import {
  INT_CP005_V16_LOCALIZED_LOCALES,
  INT_CP005_V16_LOCALIZED_RUNTIME_VERSION,
  generateIntCp005QuestionV16LocalizedFinal,
} from "./cp005-variable-growth-decay-runtime-v16-localized-final";
import { verifyIntCp005Answer } from "./cp005-variable-growth-decay-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function r(value: { numerator: bigint; denominator: bigint }): string { return `${value.numerator}/${value.denominator}`; }

let questions = 0;
let parityChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let languageChecks = 0;
const uniqueStems = new Map<string, Set<string>>();
const positions = new Map<string, Set<number>>();

for (const locale of INT_CP005_V16_LOCALIZED_LOCALES) {
  uniqueStems.set(locale, new Set());
  for (const qlId of INT_CP005_V16_QL_IDS) positions.set(`${locale}:${qlId}`, new Set());

  for (const qlId of INT_CP005_V16_QL_IDS) {
    for (let index = 0; index < 160; index += 1) {
      const seed = `int-cp005-v16-hi-pa-final-audit-${qlId}-${index}`;
      const en = generateIntCp005QuestionV16EditorialFinal(qlId, seed, "en-IN");
      const loc = generateIntCp005QuestionV16LocalizedFinal(qlId, seed, locale);
      const replay = generateIntCp005QuestionV16LocalizedFinal(qlId, seed, locale);
      assert(stable(loc) === stable(replay), `${locale}/${qlId}/${seed}: replay drift`);
      questions += 1;

      assert(stable(loc.mathematicalState) === stable(en.mathematicalState), `${locale}/${qlId}/${seed}: state drift`);
      assert(r(loc.solution) === r(en.solution), `${locale}/${qlId}/${seed}: solution drift`);
      assert(loc.correctIndex === en.correctIndex, `${locale}/${qlId}/${seed}: correct-index drift`);
      assert(loc.answerSemantic === en.answerSemantic, `${locale}/${qlId}/${seed}: semantic drift`);
      assert(loc.representation === en.representation, `${locale}/${qlId}/${seed}: representation drift`);
      assert(verifyIntCp005Answer(loc.mathematicalState, loc.solution), `${locale}/${qlId}/${seed}: verifier failed`);
      parityChecks += 6;

      assert(loc.options.length === 4 && en.options.length === 4, `${locale}/${qlId}/${seed}: option count`);
      for (let i = 0; i < 4; i += 1) {
        const a = loc.options[i]!;
        const b = en.options[i]!;
        assert(r(a.value) === r(b.value), `${locale}/${qlId}/${seed}/option${i}: value drift`);
        assert(a.misconceptionId === b.misconceptionId, `${locale}/${qlId}/${seed}/option${i}: misconception drift`);
        assert(a.isCorrect === b.isCorrect, `${locale}/${qlId}/${seed}/option${i}: ownership drift`);
        optionChecks += 3;
      }
      assert(loc.correctAnswer === loc.options[loc.correctIndex]!.text, `${locale}/${qlId}/${seed}: answer/index mismatch`);
      assert(new Set(loc.options.map((option) => option.text)).size === 4, `${locale}/${qlId}/${seed}: duplicate option text`);
      positions.get(`${locale}:${qlId}`)!.add(loc.correctIndex);

      assert(!loc.enabled && loc.stagingStatus === "NOT_STAGED" && loc.registrationStatus === "NOT_REGISTERED", `${locale}/${qlId}/${seed}: lifecycle opened`);
      assert(!loc.questionStudioDiscoverable && loc.questionBankStatus === "NOT_STORED" && loc.testEligibility === "INELIGIBLE" && !loc.publiclyPublishable, `${locale}/${qlId}/${seed}: delivery opened`);
      lifecycleChecks += 7;

      const learner = [loc.presentation.markdown, ...loc.options.map((option) => `${option.text}\n${option.studentFeedback}`), loc.explanation.keyIdea, ...loc.explanation.steps, loc.explanation.commonMistake].join("\n");
      assert(!/production|capacity|salary|employee|executive/iu.test(learner), `${locale}/${qlId}/${seed}: rejected context leaked`);
      assert(!/\$[^\n]*\$/u.test(learner), `${locale}/${qlId}/${seed}: dollar MathJax leaked`);
      assert(!/\\begin\{|\\end\{/u.test(learner), `${locale}/${qlId}/${seed}: unsupported MathJax leaked`);
      assert(loc.presentation.markdown.length <= 340, `${locale}/${qlId}/${seed}: stem too long (${loc.presentation.markdown.length})`);
      assert(!/₹\d{2,},\d{2},\d{3}/u.test(learner), `${locale}/${qlId}/${seed}: crore-scale money leaked`);
      languageChecks += 5;

      if (locale === "pa-IN") {
        assert(!/[\u0900-\u097F]/u.test(learner), `${qlId}/${seed}: Devanagari leaked into Punjabi learner text`);
        assert(!learner.includes("ਚੱਕਰਵੱਧੀ ਵਿਆਜ"), `${qlId}/${seed}: rejected Punjabi CI term returned`);
        if (["INT-QL-086", "INT-QL-087", "INT-QL-088", "INT-QL-089", "INT-QL-095"].includes(qlId)) assert(learner.includes("ਮਿਸ਼ਰਤ"), `${qlId}/${seed}: approved Punjabi CI terminology missing`);
        languageChecks += 2;
      } else {
        assert(!/[\u0A00-\u0A7F]/u.test(learner), `${qlId}/${seed}: Gurmukhi leaked into Hindi learner text`);
        if (["INT-QL-086", "INT-QL-087", "INT-QL-088", "INT-QL-089", "INT-QL-095"].includes(qlId)) assert(learner.includes("चक्रवृद्धि"), `${qlId}/${seed}: Hindi CI terminology missing`);
        languageChecks += 1;
      }
      uniqueStems.get(locale)!.add(loc.presentation.markdown);
    }
  }
}

for (const [key, set] of positions) assert(set.size === 4, `${key}: all answer positions not reached`);
for (const locale of INT_CP005_V16_LOCALIZED_LOCALES) assert(uniqueStems.get(locale)!.size >= 400, `${locale}: stem diversity too low`);
for (const locale of INT_CP005_V16_LOCALIZED_LOCALES) {
  let rejected = false;
  try { generateIntCp005QuestionV16LocalizedFinal("INT-QL-094", "must-reject", locale); } catch { rejected = true; }
  assert(rejected, `${locale}: QL094 did not remain rejected`);
}

console.log(JSON.stringify({
  localizedRuntime: INT_CP005_V16_LOCALIZED_RUNTIME_VERSION,
  qls: INT_CP005_V16_QL_IDS.length,
  locales: INT_CP005_V16_LOCALIZED_LOCALES,
  questions,
  parityChecks,
  optionChecks,
  lifecycleChecks,
  languageChecks,
  uniqueStems: Object.fromEntries([...uniqueStems].map(([locale, stems]) => [locale, stems.size])),
  ql094Rejected: true,
}, null, 2));
console.log("PASS_INT_CP005_V16_HI_PA_FINAL_LOCALIZATION");
