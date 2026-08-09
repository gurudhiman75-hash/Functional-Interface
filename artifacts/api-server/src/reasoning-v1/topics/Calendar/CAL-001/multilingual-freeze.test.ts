import { CALENDAR_PROTOTYPES } from "./registry.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import { selectExamReadyReviewQuestions } from "./review-selection.ts";
import { semanticKey } from "./foundation.ts";
import {
  CAL_001_MULTILINGUAL_EDITORIAL_FREEZE_VERSION,
} from "./multilingual-editorial-freeze.ts";
import {
  CAL_001_MULTILINGUAL_SOURCE_GAP_PROTOTYPES,
  CAL_001_MULTILINGUAL_SOURCE_GAP_VERSION,
  generateLocalizedCalendarSourceGapQuestion,
  selectLocalizedCalendarSourceGapReviewQuestions,
} from "./source-gap-multilingual.ts";
import { CAL_001_RELEASE_LOCK } from "./final-discovery-freeze.ts";
import type { CalendarQuestionPackage, Locale } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const localizedLocales = ["hi-IN", "pa-IN"] as const satisfies readonly Locale[];
const englishWord = /[A-Za-z]{2,}/;
const bannedMechanical = /प्रोलेप्टिक|ਪ੍ਰੋਲੇਪਟਿਕ|कौन-सा\/से|ਕਿਹੜਾ\/ਕਿਹੜੇ|weekday\(s\)|day\(s\)|、/i;

function allStudentText(pkg: CalendarQuestionPackage): string[] {
  return [
    pkg.stem,
    ...pkg.options.flatMap((option) => [option.display, option.explanation]),
    pkg.explanation.observation,
    pkg.explanation.rule,
    ...pkg.explanation.working,
    pkg.explanation.conclusion,
    pkg.explanation.closestTrap ?? "",
  ];
}

function assertLocalizedPackage(pkg: CalendarQuestionPackage): void {
  assert(pkg.locale !== "en-IN", `${pkg.prototypeAuthority}: localized assertion received English package.`);
  assert(pkg.stemTemplateId.endsWith("-MULTILINGUAL-FREEZE-V1"), `${pkg.prototypeAuthority} seed ${pkg.seed}: multilingual stem version missing.`);
  assert(pkg.explanationTemplateId.endsWith("-MULTILINGUAL-FREEZE-V1"), `${pkg.prototypeAuthority} seed ${pkg.seed}: multilingual explanation version missing.`);
  assert(pkg.stem.trim().endsWith("?"), `${pkg.prototypeAuthority} seed ${pkg.seed}: stem is not a direct question.`);
  assert(pkg.options.length === 4, `${pkg.prototypeAuthority} seed ${pkg.seed}: option count changed.`);
  assert(new Set(pkg.options.map((option) => semanticKey(option.semanticValue))).size === 4, `${pkg.prototypeAuthority} seed ${pkg.seed}: semantic options are not unique.`);
  assert(new Set(pkg.options.map((option) => option.display)).size === 4, `${pkg.prototypeAuthority} seed ${pkg.seed}: localized option displays are not unique.`);
  assert(pkg.options.filter((option) => option.isCorrect).length === 1, `${pkg.prototypeAuthority} seed ${pkg.seed}: correct option count changed.`);
  assert(pkg.options[pkg.answerIndex]?.isCorrect, `${pkg.prototypeAuthority} seed ${pkg.seed}: answer index changed.`);

  for (const text of allStudentText(pkg)) {
    assert(text.trim().length > 0, `${pkg.prototypeAuthority} seed ${pkg.seed}: empty localized student text.`);
    assert(!englishWord.test(text), `${pkg.prototypeAuthority} seed ${pkg.seed}: English leakage remains in '${text}'.`);
    assert(!bannedMechanical.test(text), `${pkg.prototypeAuthority} seed ${pkg.seed}: mechanical wording remains in '${text}'.`);
  }

  assert(pkg.lifecycle.questionStudioDiscoverable === false, `${pkg.prototypeAuthority}: Question Studio opened.`);
  assert(pkg.lifecycle.questionBankWritable === false, `${pkg.prototypeAuthority}: Question Bank writes opened.`);
  assert(pkg.lifecycle.testEligible === false, `${pkg.prototypeAuthority}: test eligibility opened.`);
  assert(pkg.lifecycle.publiclyPublishable === false, `${pkg.prototypeAuthority}: publication opened.`);

  if (pkg.prototypeAuthority === "CAL-PQL-003") {
    assert(/पीछे|ਪਿੱਛੇ/.test(pkg.explanation.rule + pkg.explanation.working.join(" ")), `${pkg.prototypeAuthority}: inverse direction is not taught.`);
  }
  if (pkg.prototypeAuthority === "CAL-PQL-004") {
    assert(/न्यूनतम धनात्मक|ਘੱਟੋ-ਘੱਟ ਧਨਾਤਮਕ/.test(pkg.explanation.rule), `${pkg.prototypeAuthority}: least-positive contract is missing.`);
  }
  if (pkg.prototypeAuthority === "CAL-PQL-027") {
    assert(/400/.test(pkg.explanation.rule), `${pkg.prototypeAuthority}: century exception is missing.`);
  }
  if (pkg.prototypeAuthority === "CAL-PQL-033") {
    const explanation = JSON.stringify(pkg.explanation);
    assert(/पहला वार|ਪਹਿਲਾ ਵਾਰ/.test(explanation), `${pkg.prototypeAuthority}: month start criterion is missing.`);
    assert(/दिनों की संख्या|ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ/.test(explanation), `${pkg.prototypeAuthority}: month length criterion is missing.`);
    assert(!/1 जनवरी|1 ਜਨਵਰੀ/.test(explanation), `${pkg.prototypeAuthority}: full-year criterion leaked into month explanation.`);
  }
}

let localizedPackagesChecked = 0;
let parityChecks = 0;
for (const definition of CALENDAR_PROTOTYPES) {
  for (let seed = 0; seed < 128; seed++) {
    const english = generateCalendarQuestion(definition.id, seed, "en-IN");
    assert(!english.stemTemplateId.endsWith("-MULTILINGUAL-FREEZE-V1"), `${definition.id} seed ${seed}: English stem was changed by multilingual layer.`);
    for (const locale of localizedLocales) {
      const localized = generateCalendarQuestion(definition.id, seed, locale);
      assertLocalizedPackage(localized);
      assert(semanticKey(localized.canonicalAnswer) === semanticKey(english.canonicalAnswer), `${definition.id} seed ${seed} ${locale}: canonical answer parity failed.`);
      assert(localized.answerIndex === english.answerIndex, `${definition.id} seed ${seed} ${locale}: answer-index parity failed.`);
      assert(localized.mathematicalFingerprint === english.mathematicalFingerprint, `${definition.id} seed ${seed} ${locale}: mathematical fingerprint parity failed.`);
      assert(JSON.stringify(localized.facts) === JSON.stringify(english.facts), `${definition.id} seed ${seed} ${locale}: semantic facts changed.`);
      assert(localized.options.every((option, index) => semanticKey(option.semanticValue) === semanticKey(english.options[index]!.semanticValue)), `${definition.id} seed ${seed} ${locale}: option semantic order changed.`);
      localizedPackagesChecked++;
      parityChecks += 5;
    }
  }
}

let curatedQuestionsChecked = 0;
for (const definition of CALENDAR_PROTOTYPES) {
  for (const locale of localizedLocales) {
    const selected = selectExamReadyReviewQuestions(definition.id, locale);
    assert(selected.length === 5, `${definition.id} ${locale}: expected five curated questions.`);
    selected.forEach(assertLocalizedPackage);
    curatedQuestionsChecked += selected.length;
  }
}

let sourceGapPackagesChecked = 0;
let sourceGapCuratedChecked = 0;
for (const id of CAL_001_MULTILINGUAL_SOURCE_GAP_PROTOTYPES) {
  for (let seed = 0; seed < 128; seed++) {
    const english = generateLocalizedCalendarSourceGapQuestion(id, seed, "en-IN");
    for (const locale of localizedLocales) {
      const localized = generateLocalizedCalendarSourceGapQuestion(id, seed, locale);
      const texts = [
        localized.stem,
        ...localized.options,
        localized.explanation.observation,
        localized.explanation.rule,
        ...localized.explanation.working,
        localized.explanation.conclusion,
        localized.explanation.closestTrap,
      ];
      texts.forEach((text) => {
        assert(text.trim().length > 0, `${id} seed ${seed} ${locale}: empty source-gap text.`);
        assert(!englishWord.test(text), `${id} seed ${seed} ${locale}: English leakage remains in '${text}'.`);
        assert(!bannedMechanical.test(text), `${id} seed ${seed} ${locale}: mechanical source-gap wording remains.`);
      });
      assert(semanticKey(localized.canonicalAnswer) === semanticKey(english.canonicalAnswer), `${id} seed ${seed} ${locale}: source-gap answer parity failed.`);
      assert(localized.answerIndex === english.answerIndex, `${id} seed ${seed} ${locale}: source-gap answer-index parity failed.`);
      assert(localized.mathematicalFingerprint === english.mathematicalFingerprint, `${id} seed ${seed} ${locale}: source-gap fingerprint parity failed.`);
      assert(localized.optionValues.every((option, index) => semanticKey(option) === semanticKey(english.optionValues[index]!)), `${id} seed ${seed} ${locale}: source-gap option parity failed.`);
      assert(localized.lifecycle.questionStudioDiscoverable === false, `${id}: Question Studio opened.`);
      assert(localized.lifecycle.questionBankWritable === false, `${id}: Question Bank writes opened.`);
      assert(localized.lifecycle.mockTestEligible === false, `${id}: mock-test gate opened.`);
      assert(localized.lifecycle.publiclyPublishable === false, `${id}: publication opened.`);
      sourceGapPackagesChecked++;
    }
  }
  for (const locale of localizedLocales) {
    const selected = selectLocalizedCalendarSourceGapReviewQuestions(id, locale);
    assert(selected.length === 5, `${id} ${locale}: expected five curated source-gap questions.`);
    sourceGapCuratedChecked += selected.length;
  }
}

assert(CAL_001_RELEASE_LOCK.permanentQlCount === 36, "Permanent identity count changed.");
assert(CAL_001_RELEASE_LOCK.permanentQlRange === "CAL-QL-001..036", "Permanent identity range changed.");
assert(CAL_001_RELEASE_LOCK.nextAvailableChapterQlId === "CAL-QL-037", "Next permanent identity changed.");
assert(CAL_001_RELEASE_LOCK.questionStudioAllowed === false, "Question Studio gate opened.");
assert(CAL_001_RELEASE_LOCK.questionBankWriteAllowed === false, "Question Bank write gate opened.");
assert(CAL_001_RELEASE_LOCK.mockTestAllowed === false, "Mock-test gate opened.");
assert(CAL_001_RELEASE_LOCK.publicPublicationAllowed === false, "Publication gate opened.");

console.log(JSON.stringify({
  status: "PASS_CAL_001_MULTILINGUAL_HUMAN_FREEZE",
  editorialVersion: CAL_001_MULTILINGUAL_EDITORIAL_FREEZE_VERSION,
  sourceGapVersion: CAL_001_MULTILINGUAL_SOURCE_GAP_VERSION,
  locales: localizedLocales,
  discoveryAuthorities: CALENDAR_PROTOTYPES.length,
  sourceGapAuthorities: CAL_001_MULTILINGUAL_SOURCE_GAP_PROTOTYPES.length,
  localizedPackagesChecked,
  curatedQuestionsChecked,
  sourceGapPackagesChecked,
  sourceGapCuratedChecked,
  parityChecks,
  permanentQlCount: CAL_001_RELEASE_LOCK.permanentQlCount,
  releaseGatesOpened: 0,
}, null, 2));
