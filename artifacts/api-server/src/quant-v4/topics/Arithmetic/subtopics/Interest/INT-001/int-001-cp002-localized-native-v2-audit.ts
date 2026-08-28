import assert from "node:assert/strict";
import { rationalKey } from "./foundation/rational";
import { INT_CP002_FINAL_QL_IDS } from "./cp002-final-registry";
import { generateIntCp002EnglishFrozenQuestion } from "./cp002-english-frozen-runtime";
import {
  INT_CP002_LOCALIZED_NATIVE_V2,
  generateIntCp002LocalizedNativeV2,
} from "./cp002-localized-native-v2";
import type { IntCp002NativeLocale } from "./cp002-localized-native-v1";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly IntCp002NativeLocale[];
const SAMPLES_PER_QL_PER_LOCALE = 50;
const DEVANAGARI_LETTER_OR_MARK = /[\u0900-\u0963\u0966-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const ENGLISH_PROSE = /\b(simple|interest|principal|rate|year|years|deposit|deposits|borrow|borrowing|lend|lending|days|find|amount|total|plan|bank|unknown|first|second|period|duration)\b/iu;
const INTERNAL_ID = /INT-CP|INT-QL|PROT-|WAVE0|CLOSE-|prototype|authority|freeze id|review candidate/iu;

let packages = 0;
let deterministicChecks = 0;
let sourceParityChecks = 0;
let optionParityChecks = 0;
let languageChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
const answerPositions = [0, 0, 0, 0];
const frames = new Map<string, Set<string>>();
const topologies = new Set<string>();
const semantics = new Set<string>();

assert.equal(INT_CP002_LOCALIZED_NATIVE_V2.approved, false);
assert.equal(INT_CP002_LOCALIZED_NATIVE_V2.frozen, false);
assert.equal(INT_CP002_LOCALIZED_NATIVE_V2.permanentIdentityChanges, false);
assert.equal(INT_CP002_LOCALIZED_NATIVE_V2.questionStudioActivationAuthorized, false);
assert.equal(INT_CP002_LOCALIZED_NATIVE_V2.formulaFirst, true);
assert.equal(INT_CP002_LOCALIZED_NATIVE_V2.dayCountNativeSymbols, true);

for (const locale of LOCALES) {
  for (const qlId of INT_CP002_FINAL_QL_IDS) {
    const frameKey = `${locale}:${qlId}`;
    frames.set(frameKey, new Set());
    for (let index = 0; index < SAMPLES_PER_QL_PER_LOCALE; index += 1) {
      const seed = `int-cp002-native-v2:${locale}:${qlId}:${index}`;
      const first = generateIntCp002LocalizedNativeV2(qlId, seed, locale);
      const replay = generateIntCp002LocalizedNativeV2(qlId, seed, locale);
      const english = generateIntCp002EnglishFrozenQuestion(qlId, seed);
      packages += 1;

      assert.equal(stable(first), stable(replay), `${locale}/${qlId}/${index}: deterministic replay drift`);
      deterministicChecks += 1;

      assert.equal(english.validation.ok, true, `${qlId}/${index}: English authority failed validation`);
      assert.equal(first.qlId, english.qlId);
      assert.equal(first.permanentQlId, english.permanentQlId);
      assert.equal(first.solveContract, english.solveContract);
      assert.equal(first.topology, english.topology);
      assert.equal(first.taskDirection, english.taskDirection);
      assert.equal(first.answerSemantic, english.answerSemantic);
      assert.equal(first.difficulty, english.difficulty);
      assert.equal(stable(first.solution), stable(english.solution));
      assert.equal(first.mathematicalFingerprint, english.mathematicalFingerprint);
      assert.equal(first.sourceEnglishFreezeId, english.freezeId);
      sourceParityChecks += 10;

      assert.equal(first.options.length, 4, `${locale}/${qlId}/${index}: expected four localized options`);
      assert.equal(new Set(first.options).size, 4, `${locale}/${qlId}/${index}: duplicate localized option text`);
      assert.equal(first.correctIndex, english.correctIndex, `${locale}/${qlId}/${index}: correct index drift`);
      assert.equal(first.correctAnswer, first.options[first.correctIndex], `${locale}/${qlId}/${index}: correct answer text drift`);
      assert.deepEqual(
        first.optionAudit.map((option) => rationalKey(option.value)),
        english.optionAudit.map((option) => rationalKey(option.value)),
        `${locale}/${qlId}/${index}: canonical option values drifted`,
      );
      assert.equal(first.optionAudit[first.correctIndex]?.misconceptionId, "CORRECT", `${locale}/${qlId}/${index}: correct ownership drift`);
      optionParityChecks += 6;
      answerPositions[first.correctIndex] += 1;

      const formulaPrefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
      assert.ok(first.explanation.mainRule.startsWith(formulaPrefix), `${locale}/${qlId}/${index}: explanation is not formula-first`);
      assert.ok(first.explanation.workedSteps.length >= 2, `${locale}/${qlId}/${index}: worked solution too thin`);
      assert.ok(first.explanation.workedSteps.some((step) => /[=×÷+−/:]/u.test(step)), `${locale}/${qlId}/${index}: worked calculation missing`);
      assert.ok(first.explanation.conclusion.includes(first.correctAnswer), `${locale}/${qlId}/${index}: conclusion omits answer`);
      assert.equal(first.explanation.trapAnalysis.length, 3, `${locale}/${qlId}/${index}: wrong-option analysis incomplete`);
      explanationChecks += 5;

      const learnerText = [
        first.stem,
        ...first.options,
        first.explanation.mainRule,
        ...first.explanation.workedSteps,
        first.explanation.examShortcut,
        first.explanation.verification,
        first.explanation.conclusion,
        ...first.explanation.trapAnalysis.map((trap) => trap.explanation),
      ].join("\n");
      assert.equal(INTERNAL_ID.test(learnerText), false, `${locale}/${qlId}/${index}: internal identity leaked`);
      assert.equal(ENGLISH_PROSE.test(learnerText), false, `${locale}/${qlId}/${index}: English prose leaked\n${learnerText}`);
      if (locale === "hi-IN") {
        assert.equal(DEVANAGARI_LETTER_OR_MARK.test(learnerText), true, `${qlId}/${index}: Hindi script missing`);
        assert.equal(GURMUKHI.test(learnerText), false, `${qlId}/${index}: Gurmukhi leaked into Hindi`);
        assert.ok(learnerText.includes("साधारण ब्याज"), `${qlId}/${index}: Hindi simple-interest terminology missing`);
      } else {
        assert.equal(GURMUKHI.test(learnerText), true, `${qlId}/${index}: Punjabi script missing`);
        assert.equal(DEVANAGARI_LETTER_OR_MARK.test(learnerText), false, `${qlId}/${index}: Devanagari letters or marks leaked into Punjabi`);
        assert.ok(learnerText.includes("ਸਧਾਰਨ ਵਿਆਜ"), `${qlId}/${index}: Punjabi simple-interest terminology missing`);
      }
      languageChecks += 5;

      assert.equal(first.localizationStatus, "MULTILINGUAL_REVIEW_CANDIDATE");
      assert.equal(first.approvalStatus, "NOT_APPROVED");
      assert.equal(first.learnerContentFrozen, false);
      assert.equal(first.manualApprovalRequired, true);
      assert.equal(first.enabled, false);
      assert.equal(first.stagingStatus, "NOT_STAGED");
      assert.equal(first.registrationStatus, "NOT_REGISTERED");
      assert.equal(first.questionStudioDiscoverable, false);
      assert.equal(first.questionBankStatus, "NOT_STORED");
      assert.equal(first.testEligibility, "INELIGIBLE");
      assert.equal(first.testEligible, false);
      assert.equal(first.mockTestEligible, false);
      assert.equal(first.publiclyPublishable, false);
      assert.equal(first.automaticStudentPublication, false);
      assert.equal(first.v2Remediation.mathematicalStateChanged, false);
      assert.equal(first.v2Remediation.optionValuesChanged, false);
      assert.equal(first.v2Remediation.approvalGranted, false);
      lifecycleChecks += 17;

      frames.get(frameKey)!.add(first.stemFamilyId);
      topologies.add(first.topology);
      semantics.add(first.answerSemantic);
    }
  }
}

for (const [key, reached] of frames) {
  assert.ok(reached.size >= 3, `${key}: all three authored context frames were not reached`);
}
assert.ok(topologies.size >= 8, `CP002 topology coverage too thin: ${[...topologies].join(", ")}`);
assert.deepEqual([...semantics].sort(), ["DAYS", "MONEY", "PRINCIPAL", "RATE_PERCENT", "RATIO", "TIME_YEARS"]);
assert.ok(answerPositions.every((count) => count >= 650), `answer-position imbalance: ${answerPositions.join(" / ")}`);

console.log("PASS_INT_CP002_LOCALIZED_NATIVE_V2_AUDIT");
console.log(JSON.stringify({
  qlCount: INT_CP002_FINAL_QL_IDS.length,
  locales: LOCALES,
  samplesPerQlPerLocale: SAMPLES_PER_QL_PER_LOCALE,
  packages,
  deterministicChecks,
  sourceParityChecks,
  optionParityChecks,
  languageChecks,
  explanationChecks,
  lifecycleChecks,
  answerPositions,
  topologyCount: topologies.size,
  answerSemantics: [...semantics].sort(),
  approvalStatus: "NOT_APPROVED",
  questionStudioActivationAuthorized: false,
}, null, 2));
