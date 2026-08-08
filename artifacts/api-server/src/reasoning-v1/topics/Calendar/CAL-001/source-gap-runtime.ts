import type { GregorianDate, Month, Weekday } from "./types.ts";
import {
  countLeapYearsInclusive,
  isValidGregorianDate,
  mod7,
  ordinalDaysInMonth,
  ordinalDifference,
  ordinalLeapYear,
  ordinalWeekday,
} from "./foundation.ts";

export type CalendarSourceGapPrototypeId =
  | "CAL-GAP-PROT-001"
  | "CAL-GAP-PROT-002"
  | "CAL-GAP-PROT-003";

export type CalendarSourceGapAnswer = number | number[];

export type CalendarSourceGapExplanation = {
  observation: string;
  rule: string;
  working: string[];
  conclusion: string;
  closestTrap: string;
};

export type CalendarSourceGapQuestion = {
  chapter: "CAL-001";
  checkpoint: "CAL-CP-005" | "CAL-CP-006" | "CAL-CP-010";
  prototypeAuthority: CalendarSourceGapPrototypeId;
  proposedPermanentQlId: "CAL-QL-016" | "CAL-QL-020" | "CAL-QL-036";
  seed: number;
  stem: string;
  options: string[];
  optionValues: CalendarSourceGapAnswer[];
  answerIndex: 0 | 1 | 2 | 3;
  canonicalAnswer: CalendarSourceGapAnswer;
  facts: Record<string, unknown>;
  explanation: CalendarSourceGapExplanation;
  mathematicalFingerprint: string;
  lifecycle: {
    englishIdentityFrozen: true;
    reviewOnly: true;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    mockTestEligible: false;
    publiclyPublishable: false;
  };
};

export const CALENDAR_SOURCE_GAP_PROTOTYPES: readonly CalendarSourceGapPrototypeId[] = [
  "CAL-GAP-PROT-001",
  "CAL-GAP-PROT-002",
  "CAL-GAP-PROT-003",
] as const;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;

class SeededRandom {
  private state: number;

  constructor(key: string) {
    let hash = 2166136261;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    this.state = hash >>> 0;
  }

  next(): number {
    this.state = (Math.imul(this.state, 1664525) + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }

  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(values: readonly T[]): T {
    return values[this.int(0, values.length - 1)]!;
  }
}

function formatDate(date: GregorianDate): string {
  return `${date.day} ${MONTHS[date.month - 1]} ${date.year}`;
}

function formatDayNumbers(days: readonly number[]): string {
  if (days.length === 0) return "None";
  if (days.length === 1) return String(days[0]);
  return `${days.slice(0, -1).join(", ")} and ${days.at(-1)}`;
}

function answerKey(value: CalendarSourceGapAnswer): string {
  return Array.isArray(value) ? `set:${[...value].sort((a, b) => a - b).join(",")}` : `number:${value}`;
}

function fingerprint(id: CalendarSourceGapPrototypeId, seed: number, facts: Record<string, unknown>, answer: CalendarSourceGapAnswer): string {
  const text = JSON.stringify({ id, seed, facts, answer });
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function shuffledOptions(
  rng: SeededRandom,
  answer: CalendarSourceGapAnswer,
  wrongs: CalendarSourceGapAnswer[],
  display: (value: CalendarSourceGapAnswer) => string,
): { options: string[]; optionValues: CalendarSourceGapAnswer[]; answerIndex: 0 | 1 | 2 | 3 } {
  const seen = new Set<string>([answerKey(answer)]);
  const accepted: CalendarSourceGapAnswer[] = [];
  for (const wrong of wrongs) {
    const key = answerKey(wrong);
    if (!seen.has(key)) {
      accepted.push(wrong);
      seen.add(key);
    }
    if (accepted.length === 3) break;
  }
  if (accepted.length !== 3) throw new Error("SOURCE_GAP_DISTRACTOR_COLLISION");

  const values = [answer, ...accepted];
  for (let i = values.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [values[i], values[j]] = [values[j]!, values[i]!];
  }
  const answerIndex = values.findIndex((value) => answerKey(value) === answerKey(answer));
  if (answerIndex < 0 || answerIndex > 3) throw new Error("SOURCE_GAP_ANSWER_INDEX");
  return {
    options: values.map(display),
    optionValues: values,
    answerIndex: answerIndex as 0 | 1 | 2 | 3,
  };
}

function nextSameDateWeekdayYear(date: GregorianDate): { year: number; checked: Array<{ year: number; remainder: Weekday }> } {
  const targetWeekday = ordinalWeekday(date);
  const checked: Array<{ year: number; remainder: Weekday }> = [];
  for (let year = date.year + 1; year <= date.year + 60; year++) {
    const candidate: GregorianDate = { year, month: date.month, day: date.day };
    if (!isValidGregorianDate(candidate)) continue;
    const remainder = mod7(ordinalDifference(date, candidate));
    checked.push({ year, remainder });
    if (ordinalWeekday(candidate) === targetWeekday) return { year, checked };
  }
  throw new Error(`No same-date weekday recurrence found for ${formatDate(date)}.`);
}

function recurrenceQuestion(seed: number): CalendarSourceGapQuestion {
  const id = "CAL-GAP-PROT-001" as const;
  const rng = new SeededRandom(`${id}:${seed}`);
  let year = rng.int(1900, 2080);
  let month: Month;
  let day: number;
  if (seed % 7 === 0) {
    while (!ordinalLeapYear(year)) year++;
    month = 2;
    day = 29;
  } else {
    month = rng.int(1, 12) as Month;
    day = rng.int(1, Math.min(28, ordinalDaysInMonth(year, month)));
  }
  const date: GregorianDate = { year, month, day };
  const startWeekday = ordinalWeekday(date);
  const recurrence = nextSameDateWeekdayYear(date);
  const answer = recurrence.year;
  const candidatePool = [
    year + 4,
    year + 5,
    year + 6,
    answer - 1,
    answer + 1,
    answer + 6,
    year + 11,
  ].filter((candidate) => candidate > year && candidate !== answer);
  const built = shuffledOptions(rng, answer, candidatePool, (value) => String(value));
  const validChecks = recurrence.checked.slice(0, -1);
  const checkedText = validChecks.length === 0
    ? "No earlier valid occurrence exists."
    : validChecks.map((entry) => `${entry.year}: shift ${entry.remainder}`).join("; ");
  const facts = {
    date,
    weekday: startWeekday,
    nextRecurrenceYear: answer,
    checkedYears: recurrence.checked,
  };
  return {
    chapter: "CAL-001",
    checkpoint: "CAL-CP-005",
    prototypeAuthority: id,
    proposedPermanentQlId: "CAL-QL-016",
    seed,
    stem: `${formatDate(date)} falls on ${WEEKDAYS[startWeekday]}. In which subsequent year will the same date next fall on ${WEEKDAYS[startWeekday]}?`,
    ...built,
    canonicalAnswer: answer,
    facts,
    explanation: {
      observation: `The weekday of ${date.day} ${MONTHS[date.month - 1]} must return to ${WEEKDAYS[startWeekday]}.`,
      rule: "Move through valid occurrences of the same date and reduce each exact day gap modulo 7. The first zero remainder is the required year.",
      working: [checkedText, `${answer}: shift 0, so the weekday matches.`],
      conclusion: String(answer),
      closestTrap: "Matching only leap status or adding a fixed 4, 5 or 6 years does not guarantee that this particular date has the same weekday.",
    },
    mathematicalFingerprint: fingerprint(id, seed, facts, answer),
    lifecycle: {
      englishIdentityFrozen: true,
      reviewOnly: true,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    },
  };
}

function datesForWeekday(year: number, month: Month, weekday: Weekday): number[] {
  const length = ordinalDaysInMonth(year, month);
  const first = ordinalWeekday({ year, month, day: 1 });
  const firstDay = 1 + mod7(weekday - first);
  const dates: number[] = [];
  for (let day = firstDay; day <= length; day += 7) dates.push(day);
  return dates;
}

function shiftedDaySet(days: readonly number[], delta: number, length: number): number[] {
  return days.map((day) => day + delta).filter((day) => day >= 1 && day <= length);
}

function dateSetQuestion(seed: number): CalendarSourceGapQuestion {
  const id = "CAL-GAP-PROT-002" as const;
  const rng = new SeededRandom(`${id}:${seed}`);
  const year = rng.int(1900, 2099);
  const month = rng.int(1, 12) as Month;
  const namedWeekday = rng.int(0, 6) as Weekday;
  const length = ordinalDaysInMonth(year, month);
  const answer = datesForWeekday(year, month, namedWeekday);
  const wrongs: CalendarSourceGapAnswer[] = [
    shiftedDaySet(answer, 1, length),
    shiftedDaySet(answer, -1, length),
    answer.slice(0, -1),
    [...answer, answer.at(-1)! + 7].filter((date) => date <= length),
    shiftedDaySet(answer, 2, length),
  ];
  const built = shuffledOptions(rng, answer, wrongs, (value) => formatDayNumbers(value as number[]));
  const firstWeekday = ordinalWeekday({ year, month, day: 1 });
  const firstOccurrence = answer[0]!;
  const facts = { year, month, namedWeekday, monthLength: length, firstWeekday, dates: answer };
  return {
    chapter: "CAL-001",
    checkpoint: "CAL-CP-010",
    prototypeAuthority: id,
    proposedPermanentQlId: "CAL-QL-036",
    seed,
    stem: `On which dates does ${WEEKDAYS[namedWeekday]} occur in ${MONTHS[month - 1]} ${year}?`,
    ...built,
    canonicalAnswer: answer,
    facts,
    explanation: {
      observation: `${MONTHS[month - 1]} ${year} begins on ${WEEKDAYS[firstWeekday]} and has ${length} days.`,
      rule: "Find the first required weekday, then keep adding 7 while the date remains inside the month.",
      working: [
        `First ${WEEKDAYS[namedWeekday]} = date ${firstOccurrence}.`,
        `Dates: ${answer.join(" + 7 → ")}.`,
      ],
      conclusion: formatDayNumbers(answer),
      closestTrap: "Shifting every date by one day means the first-weekday offset was counted incorrectly; adding one more week can also produce a date outside the month.",
    },
    mathematicalFingerprint: fingerprint(id, seed, facts, answer),
    lifecycle: {
      englishIdentityFrozen: true,
      reviewOnly: true,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    },
  };
}

function dateValidityQuestion(seed: number): CalendarSourceGapQuestion {
  const id = "CAL-GAP-PROT-003" as const;
  const rng = new SeededRandom(`${id}:${seed}`);
  const start = rng.int(1601, 2050);
  const end = start + rng.int(80, 350);
  const answer = countLeapYearsInclusive(start, end);
  const totalYears = end - start + 1;
  const naiveEveryFour = Math.floor(end / 4) - Math.floor((start - 1) / 4);
  const omittedFourHundred = naiveEveryFour - (Math.floor(end / 100) - Math.floor((start - 1) / 100));
  const wrongs: CalendarSourceGapAnswer[] = [
    naiveEveryFour,
    omittedFourHundred,
    answer - 1,
    answer + 1,
    Math.floor(totalYears / 4),
    answer + 2,
  ];
  const built = shuffledOptions(rng, answer, wrongs, (value) => String(value));
  const through = (year: number) => Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
  const facts = { month: 2, day: 29, yearRange: { start, end, inclusive: true }, answer };
  return {
    chapter: "CAL-001",
    checkpoint: "CAL-CP-006",
    prototypeAuthority: id,
    proposedPermanentQlId: "CAL-QL-020",
    seed,
    stem: `How many times does 29 February occur from ${start} through ${end}, including both years?`,
    ...built,
    canonicalAnswer: answer,
    facts,
    explanation: {
      observation: "29 February exists only in Gregorian leap years.",
      rule: "Count multiples of 4, subtract multiples of 100, and add multiples of 400 within the inclusive range.",
      working: [
        `Leap years through ${end} = ${through(end)}.`,
        `Leap years through ${start - 1} = ${through(start - 1)}.`,
        `Required count = ${through(end)} − ${through(start - 1)} = ${answer}.`,
      ],
      conclusion: String(answer),
      closestTrap: "Dividing the number of years by 4 ignores the exact endpoints and the century exception.",
    },
    mathematicalFingerprint: fingerprint(id, seed, facts, answer),
    lifecycle: {
      englishIdentityFrozen: true,
      reviewOnly: true,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    },
  };
}

export function generateCalendarSourceGapQuestion(id: CalendarSourceGapPrototypeId, seed: number): CalendarSourceGapQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("Seed must be a non-negative integer.");
  if (id === "CAL-GAP-PROT-001") return recurrenceQuestion(seed);
  if (id === "CAL-GAP-PROT-002") return dateSetQuestion(seed);
  return dateValidityQuestion(seed);
}

export function selectCalendarSourceGapReviewQuestions(id: CalendarSourceGapPrototypeId): CalendarSourceGapQuestion[] {
  const pool = Array.from({ length: 256 }, (_, seed) => generateCalendarSourceGapQuestion(id, seed));
  const selected: CalendarSourceGapQuestion[] = [];
  const answerPositions = new Set<number>();
  for (const candidate of pool) {
    if (selected.some((entry) => entry.mathematicalFingerprint === candidate.mathematicalFingerprint)) continue;
    if (selected.length < 4 && answerPositions.has(candidate.answerIndex) && answerPositions.size < 4) continue;
    selected.push(candidate);
    answerPositions.add(candidate.answerIndex);
    if (selected.length === 5) break;
  }
  if (selected.length !== 5 || answerPositions.size < 3) throw new Error(`${id}: unable to select five balanced source-gap questions.`);
  return selected;
}
