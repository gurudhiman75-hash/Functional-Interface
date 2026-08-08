import { CALENDAR_PROTOTYPES } from "./registry.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import { assertCalendarPackageIntegrity } from "./verifier.ts";
import type { GregorianDate, Locale, Month, Weekday } from "./types.ts";
import {
  DeterministicRandom,
  PROOF_YEAR_MAX,
  PROOF_YEAR_MIN,
  addDays,
  classifyLeapYear,
  countLeapYearsInclusive,
  enumerateWeekdayFrequency,
  fromOrdinal,
  fullYearCalendarsMatch,
  inclusiveDateCount,
  isValidGregorianDate,
  mod7,
  monthCalendarsMatch,
  nextMatchingFullYear,
  oddDayLeapYear,
  oddDayWeekday,
  oddDaysInCompleteYears,
  ordinalDaysInMonth,
  ordinalLeapYear,
  ordinalWeekday,
  previousMatchingFullYear,
  semanticKey,
  spanContainsFeb29,
  toOrdinal,
  weekdayFrequencyInInclusiveRange,
  weekdayFrequencyInMonth,
  weekdayFrequencyInYear,
} from "./foundation.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

/** Test-only third oracle: Sakamoto's Gregorian weekday algorithm. */
function testOracleWeekday(date: GregorianDate): Weekday {
  const offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4] as const;
  let year = date.year;
  if (date.month < 3) year -= 1;
  return mod7(year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) + offsets[date.month - 1] + date.day);
}

const fixedVectors: Array<[GregorianDate, Weekday]> = [
  [{ year: 1900, month: 1, day: 1 }, 1],
  [{ year: 2000, month: 1, day: 1 }, 6],
  [{ year: 2000, month: 2, day: 29 }, 2],
  [{ year: 1900, month: 3, day: 1 }, 4],
  [{ year: 2100, month: 3, day: 1 }, 1],
  [{ year: 1947, month: 8, day: 15 }, 5],
  [{ year: 1950, month: 1, day: 26 }, 4],
  [{ year: 2024, month: 2, day: 29 }, 4],
  [{ year: 2099, month: 12, day: 31 }, 4],
];

let fixedVectorChecks = 0;
for (const [date, expected] of fixedVectors) {
  assert(ordinalWeekday(date) === expected, `Fixed vector ordinal mismatch for ${JSON.stringify(date)}.`);
  assert(oddDayWeekday(date).weekday === expected, `Fixed vector odd-day mismatch for ${JSON.stringify(date)}.`);
  assert(testOracleWeekday(date) === expected, `Fixed vector oracle mismatch for ${JSON.stringify(date)}.`);
  fixedVectorChecks += 3;
}

const invalidDates: GregorianDate[] = [
  { year: 1900, month: 2, day: 29 },
  { year: 2100, month: 2, day: 29 },
  { year: 2024, month: 2, day: 30 },
  { year: 2025, month: 4, day: 31 },
  { year: 2025, month: 6, day: 31 },
  { year: 2025, month: 9, day: 31 },
  { year: 2025, month: 11, day: 31 },
];
for (const date of invalidDates) assert(!isValidGregorianDate(date), `Invalid date accepted: ${JSON.stringify(date)}.`);

let exhaustiveDateChecks = 0;
let previousDate: GregorianDate | null = null;
for (let year = PROOF_YEAR_MIN; year <= PROOF_YEAR_MAX; year++) {
  const leapA = ordinalLeapYear(year);
  const leapB = oddDayLeapYear(year);
  const leapC = classifyLeapYear(year);
  assert(leapA === leapB && leapB === leapC, `Leap implementations disagree for ${year}.`);

  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= ordinalDaysInMonth(year, month as Month); day++) {
      const date = { year, month: month as Month, day };
      const ordinal = toOrdinal(date);
      assert(JSON.stringify(fromOrdinal(ordinal)) === JSON.stringify(date), `Ordinal round-trip failed for ${JSON.stringify(date)}.`);
      const weekday = ordinalWeekday(date);
      assert(weekday === oddDayWeekday(date).weekday, `Ordinal/odd-day disagreement for ${JSON.stringify(date)}.`);
      assert(weekday === testOracleWeekday(date), `Third-oracle disagreement for ${JSON.stringify(date)}.`);
      if (previousDate) assert(weekday === mod7(ordinalWeekday(previousDate) + 1), `Weekday continuity failed at ${JSON.stringify(date)}.`);
      previousDate = date;
      exhaustiveDateChecks += 4;
    }
  }
}

const centuryExpectations: Record<number, boolean> = {
  1600: true, 1700: false, 1800: false, 1900: false,
  2000: true, 2100: false, 2200: false, 2300: false,
};
for (const [yearText, expected] of Object.entries(centuryExpectations)) {
  const year = Number(yearText);
  assert(ordinalLeapYear(year) === expected, `Century rule mismatch for ${year}.`);
}
assert(oddDaysInCompleteYears(100) === 5, "100-year odd-day invariant failed.");
assert(oddDaysInCompleteYears(200) === 3, "200-year odd-day invariant failed.");
assert(oddDaysInCompleteYears(300) === 1, "300-year odd-day invariant failed.");
assert(oddDaysInCompleteYears(400) === 0, "400-year odd-day invariant failed.");
assert((toOrdinal({ year: 2000, month: 1, day: 1 }) - toOrdinal({ year: 1600, month: 1, day: 1 })) % 7 === 0, "400-year block is not a whole number of weeks.");

let cycleChecks = 0;
for (let year = 1600; year <= 1999; year++) {
  for (let month = 1; month <= 12; month++) {
    const maxDay = ordinalDaysInMonth(year, month as Month);
    for (const day of [1, Math.ceil(maxDay / 2), maxDay]) {
      const a = { year, month: month as Month, day };
      const b = { year: year + 400, month: month as Month, day };
      assert(ordinalWeekday(a) === ordinalWeekday(b), `400-year weekday cycle failed for ${JSON.stringify(a)}.`);
      cycleChecks++;
    }
  }
}

const spanCases: Array<[GregorianDate, GregorianDate, boolean]> = [
  [{ year: 2024, month: 2, day: 28 }, { year: 2024, month: 3, day: 1 }, true],
  [{ year: 2024, month: 2, day: 29 }, { year: 2024, month: 2, day: 29 }, true],
  [{ year: 2023, month: 2, day: 28 }, { year: 2023, month: 3, day: 1 }, false],
  [{ year: 1900, month: 2, day: 1 }, { year: 1900, month: 3, day: 1 }, false],
  [{ year: 2000, month: 2, day: 1 }, { year: 2000, month: 3, day: 1 }, true],
  [{ year: 2100, month: 3, day: 1 }, { year: 2099, month: 12, day: 31 }, false],
];
for (const [a, b, expected] of spanCases) assert(spanContainsFeb29(a, b) === expected, `Feb-29 span mismatch for ${JSON.stringify([a, b])}.`);

const spanRng = new DeterministicRandom("CAL-001-SPAN-PROOF");
let spanProofChecks = 0;
for (let index = 0; index < 20_000; index++) {
  const year = spanRng.int(PROOF_YEAR_MIN, PROOF_YEAR_MAX);
  const month = spanRng.int(1, 12) as Month;
  const day = spanRng.int(1, ordinalDaysInMonth(year, month));
  const start = { year, month, day };
  const signed = spanRng.int(-800, 800);
  const end = addDays(start, signed);
  const formula = weekdayFrequencyInInclusiveRange(start, end);
  const enumerated = enumerateWeekdayFrequency(start, end);
  assert(JSON.stringify(formula) === JSON.stringify(enumerated), `Arbitrary-range frequency mismatch for ${JSON.stringify([start, end])}.`);
  assert(inclusiveDateCount(start, end) === Math.abs(toOrdinal(end) - toOrdinal(start)) + 1, "Inclusive count invariant failed.");
  spanProofChecks += 2;
}

let frequencyChecks = 0;
for (let year = PROOF_YEAR_MIN; year <= PROOF_YEAR_MAX; year++) {
  const yearStart = { year, month: 1 as Month, day: 1 };
  const yearEnd = { year, month: 12 as Month, day: 31 };
  const yearFormula = weekdayFrequencyInYear(year);
  const yearEnumerated = enumerateWeekdayFrequency(yearStart, yearEnd);
  assert(JSON.stringify(yearFormula) === JSON.stringify(yearEnumerated), `Year frequency mismatch for ${year}.`);
  assert(Object.values(yearFormula).reduce((sum, count) => sum + count, 0) === (ordinalLeapYear(year) ? 366 : 365), `Year frequency total mismatch for ${year}.`);
  const count53 = Object.values(yearFormula).filter((count) => count === 53).length;
  assert(count53 === (ordinalLeapYear(year) ? 2 : 1), `53-weekday invariant failed for ${year}.`);
  frequencyChecks += 3;

  for (let month = 1; month <= 12; month++) {
    const first = { year, month: month as Month, day: 1 };
    const last = { year, month: month as Month, day: ordinalDaysInMonth(year, month as Month) };
    const formula = weekdayFrequencyInMonth(year, month as Month);
    const enumerated = enumerateWeekdayFrequency(first, last);
    assert(JSON.stringify(formula) === JSON.stringify(enumerated), `Month frequency mismatch for ${year}-${month}.`);
    assert(Object.values(formula).reduce((sum, count) => sum + count, 0) === last.day, `Month frequency total mismatch for ${year}-${month}.`);
    frequencyChecks += 2;
  }
}

let repetitionChecks = 0;
for (let year = PROOF_YEAR_MIN; year <= PROOF_YEAR_MAX; year++) {
  const next = nextMatchingFullYear(year);
  const previous = previousMatchingFullYear(year);
  assert(next > year && previous < year, `Repetition direction failed for ${year}.`);
  assert(fullYearCalendarsMatch(year, next), `Next matching year failed for ${year}.`);
  assert(fullYearCalendarsMatch(year, previous), `Previous matching year failed for ${year}.`);
  for (let candidate = year + 1; candidate < next; candidate++) assert(!fullYearCalendarsMatch(year, candidate), `Next match is not nearest for ${year}.`);
  for (let candidate = year - 1; candidate > previous; candidate--) assert(!fullYearCalendarsMatch(year, candidate), `Previous match is not nearest for ${year}.`);
  const length = ordinalLeapYear(year) ? 366 : 365;
  for (let offset = 0; offset < length; offset++) {
    assert(ordinalWeekday(addDays({ year, month: 1, day: 1 }, offset)) === ordinalWeekday(addDays({ year: next, month: 1, day: 1 }, offset)), `Matching-year sequence failed for ${year}/${next}.`);
  }
  repetitionChecks += 5 + length;

  for (let month = 1; month <= 12; month++) {
    assert(monthCalendarsMatch(year, month as Month, year + 400, month as Month), `400-year month match failed for ${year}-${month}.`);
    repetitionChecks++;
  }
}

assert(countLeapYearsInclusive(1600, 1999) === 97, "First proof-cycle leap count failed.");
assert(countLeapYearsInclusive(2000, 2399) === 97, "Second proof-cycle leap count failed.");

const locales: Locale[] = ["en-IN", "hi-IN", "pa-IN"];
const seedsPerPrototype = 1_000;
const localeParitySeeds = 50;
let generatedPackages = 0;
let deterministicReplayChecks = 0;
let verifierChecks = 0;
let localeParityChecks = 0;
let lifecycleViolations = 0;
const answerPositionsByPrototype: Record<string, number[]> = {};
const distinctFingerprintsByPrototype: Record<string, number> = {};
const generationAttemptsByPrototype: Record<string, number> = {};

for (const definition of CALENDAR_PROTOTYPES) {
  const positions = new Set<number>();
  const fingerprints = new Set<string>();
  let maxAttempt = 0;

  for (let seed = 0; seed < seedsPerPrototype; seed++) {
    const pkg = generateCalendarQuestion(definition.id, seed, "en-IN");
    const replay = generateCalendarQuestion(definition.id, seed, "en-IN");
    assert(JSON.stringify(pkg) === JSON.stringify(replay), `${definition.id} seed ${seed}: deterministic replay failed.`);
    deterministicReplayChecks++;
    assertCalendarPackageIntegrity(pkg);
    verifierChecks++;
    assert(pkg.options.every((option) => option.isCorrect || (option.misconceptionId && option.derivation)), `${definition.id} seed ${seed}: distractor evidence missing.`);
    assert(!pkg.options.some((option) => "fallbackMethodOffset" in (option.derivation ?? {})), `${definition.id} seed ${seed}: prohibited fallback detected.`);
    assert(pkg.explanation.working.length > 0 && pkg.explanation.conclusion.length > 0, `${definition.id} seed ${seed}: explanation is value-free.`);
    const lifecycle = pkg.lifecycle;
    if (pkg.permanentQlId !== null || lifecycle.permanentQlId !== null || lifecycle.active || lifecycle.questionStudioDiscoverable || lifecycle.questionBankStored || lifecycle.questionBankWritable || lifecycle.testEligible || lifecycle.publiclyPublishable) lifecycleViolations++;
    positions.add(pkg.answerIndex);
    fingerprints.add(pkg.mathematicalFingerprint);
    maxAttempt = Math.max(maxAttempt, Number(pkg.facts.generationAttempt ?? 0));
    generatedPackages++;
  }

  assert(positions.size === 4, `${definition.id}: all answer positions were not reached.`);
  const minimumDistinctStates = definition.id === "CAL-PQL-026" ? 12 : definition.id === "CAL-PQL-004" ? 40 : 150;
  assert(fingerprints.size >= minimumDistinctStates, `${definition.id}: mathematical diversity below ${minimumDistinctStates} states.`);
  answerPositionsByPrototype[definition.id] = [...positions].sort();
  distinctFingerprintsByPrototype[definition.id] = fingerprints.size;
  generationAttemptsByPrototype[definition.id] = maxAttempt;

  for (let seed = 0; seed < localeParitySeeds; seed++) {
    const packages = locales.map((locale) => generateCalendarQuestion(definition.id, seed, locale));
    const base = packages[0]!;
    for (const localized of packages.slice(1)) {
      assert(semanticKey(localized.canonicalAnswer) === semanticKey(base.canonicalAnswer), `${definition.id} seed ${seed}: locale answer drift.`);
      assert(JSON.stringify(localized.options.map((option) => semanticKey(option.semanticValue)).sort()) === JSON.stringify(base.options.map((option) => semanticKey(option.semanticValue)).sort()), `${definition.id} seed ${seed}: locale option drift.`);
      assert(localized.facts.signedDayShift === base.facts.signedDayShift, `${definition.id} seed ${seed}: locale direction drift.`);
      assert(localized.facts.countSemantics === base.facts.countSemantics, `${definition.id} seed ${seed}: locale counting drift.`);
      localeParityChecks++;
    }
  }
}

assert(lifecycleViolations === 0, `Lifecycle violations: ${lifecycleViolations}.`);

console.log(JSON.stringify({
  status: "PASS_CAL_001_END_TO_END_FOUNDATION",
  proofRange: `${PROOF_YEAR_MIN}-${PROOF_YEAR_MAX}`,
  fixedVectorChecks,
  exhaustiveDateChecks,
  cycleChecks,
  spanProofChecks,
  frequencyChecks,
  repetitionChecks,
  prototypeCount: CALENDAR_PROTOTYPES.length,
  seedsPerPrototype,
  generatedPackages,
  deterministicReplayChecks,
  verifierChecks,
  localeParityChecks,
  lifecycleViolations,
  permanentQlCount: 0,
  answerPositionsByPrototype,
  distinctFingerprintsByPrototype,
  generationAttemptsByPrototype,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
}, null, 2));
