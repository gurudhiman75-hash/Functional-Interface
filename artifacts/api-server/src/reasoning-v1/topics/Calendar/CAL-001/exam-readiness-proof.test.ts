import { CALENDAR_PROTOTYPES } from "./registry.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import { selectExamReadyReviewQuestions } from "./review-selection.ts";
import { assertCalendarPackageIntegrity } from "./verifier.ts";
import { ordinalDaysInMonth, ordinalDifference, spanContainsFeb29 } from "./foundation.ts";
import { primaryYearsForReview } from "./exam-readiness-remediation.ts";
import type { CalendarPrototypeId, CalendarQuestionPackage } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertSetContains<T>(actual: Set<T>, expected: readonly T[], label: string): void {
  for (const value of expected) assert(actual.has(value), `${label}: missing ${String(value)}.`);
}

function assertGeneralPackageReadiness(pkg: CalendarQuestionPackage): void {
  assertCalendarPackageIntegrity(pkg);
  assert(!/\bwas\b/i.test(pkg.stem), `${pkg.prototypeAuthority} seed ${pkg.seed}: past-tense “was” remains in English stem.`);
  assert(new Set(pkg.options.map((option) => option.display)).size === 4, `${pkg.prototypeAuthority} seed ${pkg.seed}: option labels are not unique.`);
  const explanationText = JSON.stringify(pkg.explanation);
  for (const internalLabel of ["INCLUSIVE_BOTH", "EXCLUSIVE_BOTH", "ABSOLUTE_GAP", "SIGNED_DIFFERENCE"]) {
    assert(!explanationText.includes(internalLabel), `${pkg.prototypeAuthority} seed ${pkg.seed}: internal label ${internalLabel} leaked into explanation.`);
  }
  assert(!explanationText.includes("independent Gregorian calculation"), `${pkg.prototypeAuthority} seed ${pkg.seed}: QA verification text leaked into student explanation.`);
  assert(pkg.explanation.verification === undefined, `${pkg.prototypeAuthority} seed ${pkg.seed}: verification metadata remains student-visible.`);

  if (pkg.prototypeAuthority === "CAL-PQL-007" && pkg.facts.anchorDate && pkg.facts.targetDate) {
    assert(!spanContainsFeb29(pkg.facts.anchorDate, pkg.facts.targetDate), `${pkg.prototypeAuthority} seed ${pkg.seed}: ordinary checkpoint crosses 29 February.`);
  }

  if (pkg.prototypeAuthority === "CAL-PQL-020") {
    assert(pkg.facts.anchorDate && pkg.facts.targetDate, `${pkg.prototypeAuthority} seed ${pkg.seed}: inverse dates missing.`);
    assert(ordinalDifference(pkg.facts.anchorDate, pkg.facts.targetDate) > 0, `${pkg.prototypeAuthority} seed ${pkg.seed}: required earlier date is not earlier than known date.`);
    assert(pkg.coverageFlags.usesBackwardMovement, `${pkg.prototypeAuthority} seed ${pkg.seed}: inverse reasoning flag missing.`);
  }

  if (pkg.prototypeAuthority === "CAL-PQL-021") {
    const displays = new Set(pkg.options.map((option) => option.display));
    assertSetContains(displays, [
      "Leap non-century year",
      "Ordinary non-century year",
      "Leap century year",
      "Ordinary century year",
    ], `${pkg.prototypeAuthority} exclusive classifications`);
  }

  if (pkg.prototypeAuthority === "CAL-PQL-025") {
    assert(pkg.stem.includes("from year 1 through year"), `${pkg.prototypeAuthority} seed ${pkg.seed}: complete-year block is not anchored.`);
    assert(pkg.facts.yearRange?.start === 1 && pkg.facts.yearRange.end === pkg.facts.year, `${pkg.prototypeAuthority} seed ${pkg.seed}: anchored range facts missing.`);
  }

  const years = primaryYearsForReview(pkg);
  if (!["CAL-PQL-014", "CAL-PQL-021", "CAL-PQL-022", "CAL-PQL-023", "CAL-PQL-024", "CAL-PQL-025", "CAL-PQL-026", "CAL-PQL-027", "CAL-PQL-028"].includes(pkg.prototypeAuthority) && pkg.seed % 5 !== 4) {
    assert(years.every((year) => year >= 1900 && year <= 2099), `${pkg.prototypeAuthority} seed ${pkg.seed}: ordinary exam example escaped the 1900–2099 preferred range.`);
  }
}

function assertCuratedCoverage(id: CalendarPrototypeId, selected: CalendarQuestionPackage[]): void {
  assert(selected.length === 5, `${id}: expected 5 curated questions.`);
  assert(new Set(selected.map((pkg) => JSON.stringify([pkg.stem, pkg.options.map((option) => option.display)]))).size === 5, `${id}: curated rendered questions are duplicated.`);
  assert(new Set(selected.map((pkg) => pkg.mathematicalFingerprint)).size === 5, `${id}: curated mathematical states are duplicated.`);
  assert(new Set(selected.map((pkg) => pkg.answerIndex)).size >= 3, `${id}: fewer than three answer positions are represented.`);

  if (id === "CAL-PQL-012") assertSetContains(new Set(selected.map((pkg) => pkg.facts.countSemantics)), ["INCLUSIVE_BOTH", "EXCLUSIVE_BOTH"], `${id} count semantics`);
  if (id === "CAL-PQL-013") assertSetContains(new Set(selected.map((pkg) => pkg.canonicalAnswer)), ["YES_CONTAINS_LEAP_DAY", "NO_LEAP_DAY_IN_SPAN"], `${id} leap-day outcomes`);
  if (id === "CAL-PQL-017") assertSetContains(new Set(selected.map((pkg) => pkg.coverageFlags.usesBackwardMovement)), [true, false], `${id} movement directions`);
  if (id === "CAL-PQL-021") assertSetContains(new Set(selected.map((pkg) => pkg.canonicalAnswer)), ["ORDINARY_YEAR", "LEAP_YEAR", "ORDINARY_CENTURY_YEAR", "LEAP_CENTURY_YEAR"], `${id} classification categories`);
  if (id === "CAL-PQL-026") assertSetContains(new Set(selected.map((pkg) => pkg.facts.year)), [100, 200, 300, 400, 700], `${id} century blocks`);
  if (id === "CAL-PQL-027") assertSetContains(new Set(selected.map((pkg) => pkg.coverageFlags.usesDivisibleBy400Year)), [true, false], `${id} century exception cases`);
  if (["CAL-PQL-037", "CAL-PQL-038", "CAL-PQL-040", "CAL-PQL-041"].includes(id)) {
    const lengths = new Set(selected.map((pkg) => ordinalDaysInMonth(Number(pkg.facts.year), Number(pkg.facts.month) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)));
    assertSetContains(lengths, [28, 29, 30, 31], `${id} month lengths`);
  }
}

let packagesChecked = 0;
for (const definition of CALENDAR_PROTOTYPES) {
  for (let seed = 0; seed < 80; seed++) {
    const pkg = generateCalendarQuestion(definition.id, seed, "en-IN");
    assertGeneralPackageReadiness(pkg);
    packagesChecked++;
  }
}

for (const seed of [0, 1, 2, 3, 4]) {
  const pkg = generateCalendarQuestion("CAL-PQL-026", seed, "en-IN");
  assert(pkg.facts.year === [100, 200, 300, 400, 700][seed], `CAL-PQL-026 seed ${seed}: deterministic review cycle failed.`);
}

let curatedChecked = 0;
for (const definition of CALENDAR_PROTOTYPES) {
  const selected = selectExamReadyReviewQuestions(definition.id, "en-IN");
  selected.forEach(assertGeneralPackageReadiness);
  assertCuratedCoverage(definition.id, selected);
  curatedChecked += selected.length;
}

console.log(JSON.stringify({
  status: "PASS_CAL_001_EXAM_READINESS_REMEDIATION",
  prototypes: CALENDAR_PROTOTYPES.length,
  runtimePackagesChecked: packagesChecked,
  curatedQuestionsChecked: curatedChecked,
  futureTenseDefects: 0,
  internalExplanationLabels: 0,
  permanentQlCount: 0,
  lifecycle: "DISCOVERY_NOT_FROZEN",
}, null, 2));
