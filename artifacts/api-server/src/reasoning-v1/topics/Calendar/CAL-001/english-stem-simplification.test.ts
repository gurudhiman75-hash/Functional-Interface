import { generateCalendarQuestion } from "./runtime.ts";
import {
  CAL_001_ENGLISH_STEM_SIMPLIFICATION_VERSION,
  CAL_001_SIMPLIFIED_ENGLISH_STEM_AUTHORITIES,
} from "./english-stem-simplification.ts";
import type { CalendarPrototypeId } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const BANNED_HEAVY_PHRASES = [
  /proleptic/i,
  /inclusive span/i,
  /full-year calendar identical/i,
  /calendar identical to/i,
  /at the earliest/i,
  /How should the year/i,
  /weekday\(s\)/i,
  /starting day/i,
  /Find the weekday on/i,
  /Which weekday does its (?:first|last) day fall on/i,
] as const;

const REQUIRED_PATTERNS: Partial<Record<CalendarPrototypeId, RegExp>> = {
  "CAL-PQL-003": /^If it is .+ after \d+ days, what day is it today\?$/,
  "CAL-PQL-004": /^Today is .+\. After how many days will it next be .+\?$/,
  "CAL-PQL-006": /^If .+ is .+, what day is .+\?$/,
  "CAL-PQL-010": /^If .+ is .+, what day is .+\?$/,
  "CAL-PQL-011": /^How many days after .+ is .+\?$/,
  "CAL-PQL-012": /^(Counting|Excluding) both dates, how many days are there (from|between) .+\?$/,
  "CAL-PQL-013": /^Does the period from .+, including both dates, include 29 February\?$/,
  "CAL-PQL-015": /^What day of the week is the \d+(?:st|nd|rd|th) day of \d{4}\?$/,
  "CAL-PQL-016": /^Which numbered day of the year is .+\?$/,
  "CAL-PQL-019": /^From .+ to .+, by how many days does the weekday move forward\?$/,
  "CAL-PQL-021": /^What type of year is \d{4} under the Gregorian calendar\?$/,
  "CAL-PQL-025": /^How many odd days are there from year 1 through year \d+ in the Gregorian calendar\?$/,
  "CAL-PQL-026": /^How many odd days are there in the first \d+ years of the Gregorian calendar\?$/,
  "CAL-PQL-029": /^Which next year has the same calendar as \d{4}\?$/,
  "CAL-PQL-030": /^Which previous year has the same calendar as \d{4}\?$/,
  "CAL-PQL-031": /^Which year has the same calendar as \d{4}\?$/,
  "CAL-PQL-032": /^Which option correctly explains whether \d{4} and \d{4} have the same calendar\?$/,
  "CAL-PQL-033": /^.+ \d{4} has the same calendar as .+ in which year\?$/,
  "CAL-PQL-034": /^From \d{4} to \d{4}, how many years other than \d{4} have the same calendar as \d{4}\?$/,
  "CAL-PQL-037": /^.+ \d{4} begins on .+\. On which day does the month end\?$/,
  "CAL-PQL-038": /^.+ \d{4} ends on .+\. On which day does the month begin\?$/,
  "CAL-PQL-041": /^Which weekdays occur five times in .+ \d{4}\?$/,
  "CAL-PQL-043": /^Which weekdays occur 53 times in \d{4}\?$/,
  "CAL-PQL-044": /^How many .+s are there from .+ to .+, including both dates\?$/,
};

let checked = 0;
for (const authority of CAL_001_SIMPLIFIED_ENGLISH_STEM_AUTHORITIES) {
  const requiredPattern = REQUIRED_PATTERNS[authority];
  assert(requiredPattern, `${authority}: no required simplified-stem pattern is registered.`);

  for (let seed = 0; seed < 128; seed++) {
    const english = generateCalendarQuestion(authority, seed, "en-IN");
    assert(english.stemTemplateId.endsWith("-SIMPLE-V1"), `${authority} seed ${seed}: simplified template version is missing.`);
    assert(requiredPattern.test(english.stem), `${authority} seed ${seed}: unexpected simplified stem '${english.stem}'.`);
    assert(english.stem.trim().endsWith("?"), `${authority} seed ${seed}: stem must end as a direct question.`);
    assert(english.stem.split(/\s+/).length <= 30, `${authority} seed ${seed}: stem is still too long (${english.stem}).`);
    assert(!/\bwas\b/i.test(english.stem), `${authority} seed ${seed}: future-date past tense leaked into stem.`);
    for (const banned of BANNED_HEAVY_PHRASES) {
      assert(!banned.test(english.stem), `${authority} seed ${seed}: heavy phrase '${banned}' remains in '${english.stem}'.`);
    }
    assert(english.options.length === 4, `${authority} seed ${seed}: option count changed.`);
    assert(english.options.filter((option) => option.isCorrect).length === 1, `${authority} seed ${seed}: correct-option integrity changed.`);
    assert(english.options[english.answerIndex]?.isCorrect, `${authority} seed ${seed}: answer index changed.`);

    const hindi = generateCalendarQuestion(authority, seed, "hi-IN");
    const punjabi = generateCalendarQuestion(authority, seed, "pa-IN");
    assert(!hindi.stemTemplateId.endsWith("-SIMPLE-V1"), `${authority} seed ${seed}: Hindi draft was changed by the English-only layer.`);
    assert(!punjabi.stemTemplateId.endsWith("-SIMPLE-V1"), `${authority} seed ${seed}: Punjabi draft was changed by the English-only layer.`);
    checked++;
  }
}

console.log(JSON.stringify({
  status: "PASS_CAL_001_ENGLISH_STEM_SIMPLIFICATION",
  version: CAL_001_ENGLISH_STEM_SIMPLIFICATION_VERSION,
  authorities: CAL_001_SIMPLIFIED_ENGLISH_STEM_AUTHORITIES.length,
  englishPackagesChecked: checked,
  nonEnglishIsolationChecks: checked * 2,
}, null, 2));