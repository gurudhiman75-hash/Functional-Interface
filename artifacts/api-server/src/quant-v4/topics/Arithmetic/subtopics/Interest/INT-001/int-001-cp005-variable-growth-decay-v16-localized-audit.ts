import { INT_CP005_V16_QL_IDS, generateIntCp005QuestionV16EditorialFinal } from "./cp005-variable-growth-decay-runtime-v16-editorial-final";
import {
  INT_CP005_V16_LOCALIZED_LOCALES,
  INT_CP005_V16_LOCALIZED_RUNTIME_VERSION,
  generateIntCp005QuestionV16Localized,
} from "./cp005-variable-growth-decay-runtime-v16-localized";
import { verifyIntCp005Answer } from "./cp005-variable-growth-decay-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function rationalKey(value: { numerator: bigint; denominator: bigint }): string { return `${value.numerator}/${value.denominator}`; }

let questions = 0;
let stateParityChecks = 0;
let optionParityChecks = 0;
let verifierChecks = 0;
let lifecycleChecks = 0;
let languageChecks = 0;
const localizedStems = new Map<string, Set<string>>();
const answerPositions = new Map<string, Set<number>>();
for (const locale of INT_CP005_V16_LOCALIZED_LOCALES) {
  localizedStems.set(locale, new Set());
  for (const qlId of INT_CP005_V16_QL_IDS) answerPositions.set(`${locale}:${qlId}`, new Set());

  for (const qlId of INT_CP005_V16_QL_IDS) {
    for (let index = 0; index < 120; index += 1) {
      const seed = `int-cp005-v16-localized-audit-${qlId}-${index}`;
      const english = generateIntCp005QuestionV16EditorialFinal(qlId, seed, "en-IN");
      const localized = generateIntCp005QuestionV16Localized(qlId, seed, locale);
      const replay = generateIntCp005QuestionV16Localized(qlId, seed, locale);
      assert(stable(localized) === stable(replay), `${locale}/${qlId}/${seed}: localized replay changed`);
      questions += 1;

      assert(localized.locale === locale, `${locale}/${qlId}/${seed}: locale changed`);
      assert(stable(localized.mathematicalState) === stable(english.mathematicalState), `${locale}/${qlId}/${seed}: mathematical state drift`);
      assert(rationalKey(localized.solution) === rationalKey(english.solution), `${locale}/${qlId}/${seed}: solution drift`);
      assert(localized.correctIndex === english.correctIndex, `${locale}/${qlId}/${seed}: correct index drift`);
      assert(localized.answerSemantic === english.answerSemantic, `${locale}/${qlId}/${seed}: answer semantic drift`);
      assert(localized.representation === english.representation, `${locale}/${qlId}/${seed}: representation drift`);
      stateParityChecks += 5;

      assert(localized.options.length === english.options.length, `${locale}/${qlId}/${seed}: option count drift`);
      for (let optionIndex = 0; optionIndex < english.options.length; optionIndex += 1) {
        const enOption = english.options[optionIndex]!;
        const locOption = localized.options[optionIndex]!;
        assert(rationalKey(locOption.value) === rationalKey(enOption.value), `${locale}/${qlId}/${seed}/option${optionIndex}: value drift`);
        assert(locOption.misconceptionId === enOption.misconceptionId, `${locale}/${qlId}/${seed}/option${optionIndex}: misconception drift`);
        assert(locOption.isCorrect === enOption.isCorrect, `${locale}/${qlId}/${seed}/option${optionIndex}: ownership drift`);
        optionParityChecks += 3;
      }
      assert(localized.correctAnswer === localized.options[localized.correctIndex]!.text, `${locale}/${qlId}/${seed}: localized answer/index mismatch`);
      assert(new Set(localized.options.map((option) => option.text)).size === 4, `${locale}/${qlId}/${seed}: duplicate localized options`);
      assert(verifyIntCp005Answer(localized.mathematicalState, localized.solution), `${locale}/${qlId}/${seed}: independent verifier failed`);
      verifierChecks += 1;
      answerPositions.get(`${locale}:${qlId}`)!.add(localized.correctIndex);

      assert(!localized.enabled && localized.stagingStatus === "NOT_STAGED" && localized.registrationStatus === "NOT_REGISTERED", `${locale}/${qlId}/${seed}: lifecycle opened`);
      assert(!localized.questionStudioDiscoverable && localized.questionBankStatus === "NOT_STORED" && localized.testEligibility === "INELIGIBLE" && !localized.publiclyPublishable, `${locale}/${qlId}/${seed}: delivery opened`);
      lifecycleChecks += 7;

      const learner = [localized.presentation.markdown, ...localized.options.map((option) => `${option.text}\n${option.studentFeedback}`), localized.explanation.keyIdea, ...localized.explanation.steps, localized.explanation.commonMistake].join("\n");
      assert(!/production|capacity|salary|employee|executive/iu.test(learner), `${locale}/${qlId}/${seed}: rejected context leaked`);
      assert(!/\$[^\n]*\$/u.test(learner), `${locale}/${qlId}/${seed}: legacy dollar MathJax delimiter`);
      assert(!/\\begin\{|\\end\{/u.test(learner), `${locale}/${qlId}/${seed}: unsupported MathJax environment`);
      assert(!/The deposit does not|Successive annual rates|observed final value|different yearly rates/iu.test(learner), `${locale}/${qlId}/${seed}: English boilerplate leaked`);
      assert(localized.presentation.markdown.length <= 330, `${locale}/${qlId}/${seed}: localized stem too long (${localized.presentation.markdown.length})`);
      languageChecks += 5;

      if (locale === "pa-IN") {
        assert(!learner.includes("ਚੱਕਰਵੱਧੀ ਵਿਆਜ"), `${qlId}/${seed}: rejected Punjabi CI term returned`);
        if (["INT-QL-086", "INT-QL-087", "INT-QL-088", "INT-QL-089", "INT-QL-095"].includes(qlId)) {
          assert(learner.includes("ਮਿਸ਼ਰਤ"), `${qlId}/${seed}: approved Punjabi compound terminology missing`);
        }
        languageChecks += 1;
      }
      if (locale === "hi-IN" && ["INT-QL-086", "INT-QL-087", "INT-QL-088", "INT-QL-089", "INT-QL-095"].includes(qlId)) {
        assert(learner.includes("चक्रवृद्धि"), `${qlId}/${seed}: Hindi compound terminology missing`);
        languageChecks += 1;
      }
      localizedStems.get(locale)!.add(localized.presentation.markdown);
    }
  }
}

for (const [key, positions] of answerPositions) assert(positions.size === 4, `${key}: not all A/B/C/D positions reached`);
for (const locale of INT_CP005_V16_LOCALIZED_LOCALES) assert(localizedStems.get(locale)!.size >= 300, `${locale}: localized stem diversity too low`);

for (const locale of INT_CP005_V16_LOCALIZED_LOCALES) {
  let rejected = false;
  try { generateIntCp005QuestionV16Localized("INT-QL-094", "must-reject", locale); } catch { rejected = true; }
  assert(rejected, `${locale}: QL094 did not remain rejected`);
}

console.log(JSON.stringify({
  runtimeVersion: INT_CP005_V16_LOCALIZED_RUNTIME_VERSION,
  locales: INT_CP005_V16_LOCALIZED_LOCALES,
  qls: INT_CP005_V16_QL_IDS.length,
  questions,
  stateParityChecks,
  optionParityChecks,
  verifierChecks,
  lifecycleChecks,
  languageChecks,
  uniqueStems: Object.fromEntries([...localizedStems].map(([locale, stems]) => [locale, stems.size])),
  answerPositions: Object.fromEntries([...answerPositions].map(([key, positions]) => [key, [...positions].sort()])),
  ql094Rejected: true,
}, null, 2));
console.log("PASS_INT_CP005_V16_HI_PA_LOCALIZATION");
