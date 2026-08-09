import { CALENDAR_PROTOTYPES } from "./registry.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import { selectExamReadyReviewQuestions } from "./review-selection.ts";
import { assertCalendarPackageIntegrity } from "./verifier.ts";
import { CAL_001_ENGLISH_EDITORIAL_FREEZE_V2 } from "./english-editorial-freeze-v2.ts";
import type { CalendarQuestionPackage } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertFrozenEnglishPackage(pkg: CalendarQuestionPackage): void {
  assertCalendarPackageIntegrity(pkg);
  assert(pkg.locale === "en-IN", `${pkg.prototypeAuthority} seed ${pkg.seed}: expected English package.`);
  assert(pkg.stem.trim().endsWith("?"), `${pkg.prototypeAuthority} seed ${pkg.seed}: stem is not a direct question.`);
  assert(pkg.stem.split(/\s+/).length <= 30, `${pkg.prototypeAuthority} seed ${pkg.seed}: stem is too long.`);
  assert(pkg.options.length === 4, `${pkg.prototypeAuthority} seed ${pkg.seed}: expected four options.`);
  assert(new Set(pkg.options.map((option) => option.display)).size === 4, `${pkg.prototypeAuthority} seed ${pkg.seed}: duplicate option text.`);
  assert(pkg.options.filter((option) => option.isCorrect).length === 1, `${pkg.prototypeAuthority} seed ${pkg.seed}: expected exactly one correct option.`);
  assert(pkg.options[pkg.answerIndex]?.isCorrect, `${pkg.prototypeAuthority} seed ${pkg.seed}: answer index mismatch.`);

  const explanationText = JSON.stringify(pkg.explanation);
  for (const banned of ["proleptic", "weekday(s)", "day(s)", "INCLUSIVE_BOTH", "EXCLUSIVE_BOTH", "ABSOLUTE_GAP", "SIGNED_DIFFERENCE"]) {
    assert(!explanationText.includes(banned), `${pkg.prototypeAuthority} seed ${pkg.seed}: banned learner-facing phrase '${banned}' remains.`);
  }
  assert(!/first 0 weekdays/i.test(explanationText), `${pkg.prototypeAuthority} seed ${pkg.seed}: zero-extra-day explanation is mechanical.`);
  assert(pkg.explanation.observation.trim().length > 0, `${pkg.prototypeAuthority} seed ${pkg.seed}: observation is empty.`);
  assert(pkg.explanation.rule.trim().length > 0, `${pkg.prototypeAuthority} seed ${pkg.seed}: rule is empty.`);
  assert(pkg.explanation.working.length > 0, `${pkg.prototypeAuthority} seed ${pkg.seed}: working is empty.`);
  assert(pkg.explanation.conclusion.trim().length > 0, `${pkg.prototypeAuthority} seed ${pkg.seed}: conclusion is empty.`);

  if (pkg.prototypeAuthority === "CAL-PQL-002") {
    assert(/^If today is .+, what day was it \d+ days ago\?$/.test(pkg.stem), `${pkg.prototypeAuthority} seed ${pkg.seed}: backward-day stem is not natural exam English.`);
  } else {
    assert(!/\bwas\b/i.test(pkg.stem), `${pkg.prototypeAuthority} seed ${pkg.seed}: past tense appears outside a genuine past reference.`);
  }

  if (pkg.prototypeAuthority === "CAL-PQL-025" || pkg.prototypeAuthority === "CAL-PQL-026") {
    assert(!/proleptic/i.test(explanationText), `${pkg.prototypeAuthority} seed ${pkg.seed}: technical calendar term remains.`);
    assert(/century year is leap only when it is divisible by 400/i.test(pkg.explanation.closestTrap ?? ""), `${pkg.prototypeAuthority} seed ${pkg.seed}: century exception is not stated clearly.`);
  }

  if (pkg.prototypeAuthority === "CAL-PQL-033") {
    assert(/has the same calendar as .+ in which year\?$/.test(pkg.stem), `${pkg.prototypeAuthority} seed ${pkg.seed}: month-match stem is awkward.`);
    assert(/same calendar when they start on the same weekday and have the same number of days/i.test(pkg.explanation.rule), `${pkg.prototypeAuthority} seed ${pkg.seed}: month-match rule is incorrect.`);
    assert(!/1 January|leap status/i.test(explanationText), `${pkg.prototypeAuthority} seed ${pkg.seed}: full-year criteria leaked into a month-match explanation.`);
    assert(/full-year calendars do not match/i.test(pkg.explanation.closestTrap ?? ""), `${pkg.prototypeAuthority} seed ${pkg.seed}: month-versus-year distinction is missing.`);
  }

  if (pkg.prototypeAuthority === "CAL-PQL-040") {
    assert(!/first 0|0 weekdays/i.test(explanationText), `${pkg.prototypeAuthority} seed ${pkg.seed}: zero-remainder wording is confusing.`);
  }

  if (pkg.prototypeAuthority === "CAL-PQL-041") {
    assert(/^Which weekdays occur five times in .+ \d{4}\?$/.test(pkg.stem), `${pkg.prototypeAuthority} seed ${pkg.seed}: five-times stem is unclear.`);
  }

  if (pkg.prototypeAuthority === "CAL-PQL-043") {
    assert(/^Which weekdays occur 53 times in \d{4}\?$/.test(pkg.stem), `${pkg.prototypeAuthority} seed ${pkg.seed}: 53-times stem is unclear.`);
  }
}

let runtimePackagesChecked = 0;
for (const definition of CALENDAR_PROTOTYPES) {
  for (let seed = 0; seed < 128; seed++) {
    assertFrozenEnglishPackage(generateCalendarQuestion(definition.id, seed, "en-IN"));
    runtimePackagesChecked++;
  }
}

let curatedQuestionsChecked = 0;
for (const definition of CALENDAR_PROTOTYPES) {
  const selected = selectExamReadyReviewQuestions(definition.id, "en-IN");
  assert(selected.length === 5, `${definition.id}: expected five curated review questions.`);
  selected.forEach(assertFrozenEnglishPackage);
  curatedQuestionsChecked += selected.length;
}

for (let seed = 0; seed < 32; seed++) {
  const hindi = generateCalendarQuestion("CAL-PQL-002", seed, "hi-IN");
  const punjabi = generateCalendarQuestion("CAL-PQL-002", seed, "pa-IN");
  assert(!/^If today is /.test(hindi.stem), `CAL-PQL-002 seed ${seed}: Hindi draft was changed by the English freeze.`);
  assert(!/^If today is /.test(punjabi.stem), `CAL-PQL-002 seed ${seed}: Punjabi draft was changed by the English freeze.`);
}

assert(CAL_001_ENGLISH_EDITORIAL_FREEZE_V2.status === "APPROVED_AND_FROZEN", "English editorial freeze status is not approved.");
assert(CAL_001_ENGLISH_EDITORIAL_FREEZE_V2.frozenSourcePrototypes === 47, "Frozen source-prototype count changed.");
assert(CAL_001_ENGLISH_EDITORIAL_FREEZE_V2.permanentQlRange === "CAL-QL-001..036", "Permanent QL range changed.");
assert(Object.values(CAL_001_ENGLISH_EDITORIAL_FREEZE_V2.releaseLocks).every((value) => value === false), "A release or localisation gate opened during editorial freeze.");

console.log(JSON.stringify({
  status: "PASS_CAL_001_ENGLISH_EDITORIAL_FREEZE_V2",
  version: CAL_001_ENGLISH_EDITORIAL_FREEZE_V2.version,
  runtimePackagesChecked,
  curatedQuestionsChecked,
  sourceGapReviewQuestionsRetained: CAL_001_ENGLISH_EDITORIAL_FREEZE_V2.evidence.sourceGapReviewQuestions,
  frozenSourcePrototypes: CAL_001_ENGLISH_EDITORIAL_FREEZE_V2.frozenSourcePrototypes,
  permanentQlRange: CAL_001_ENGLISH_EDITORIAL_FREEZE_V2.permanentQlRange,
  releaseLocksClosed: true,
}, null, 2));
