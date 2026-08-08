import type {
  CalendarPrototypeId,
  Locale,
  Weekday,
} from "./types.ts";
import {
  DeterministicRandom,
  mod7,
  weekdayShift,
} from "./foundation.ts";
import {
  makeExplanation,
  t,
  walkWeekday,
  weekdayName,
  type Problem,
} from "./runtime-shared.ts";

export function shiftProblem(id: CalendarPrototypeId, _seed: number, locale: Locale, rng: DeterministicRandom): Problem | null {
  if (!["CAL-PQL-001", "CAL-PQL-002", "CAL-PQL-003", "CAL-PQL-004"].includes(id)) return null;
  const start = rng.int(0, 6) as Weekday;
  const n = rng.int(8, 240);
  if (id === "CAL-PQL-001") {
    const answer = walkWeekday(start, n);
    return {
      queryType: "WEEKDAY_AFTER_DAYS", facts: { anchorWeekday: start, signedDayShift: n }, answer,
      groundTruth: { method: "MOD7_SHIFT", segments: [{ repeatedMovement: n }], answer },
      teachingTrace: { method: "MOD7_SHIFT", segments: [{ division: `${n} = 7 × ${Math.floor(n / 7)} + ${n % 7}` }, { remainder: n % 7 }], answer: weekdayShift(start, n) },
      stem: t(locale, `If today is ${weekdayName(start, locale)}, what day will it be after ${n} days?`, `यदि आज ${weekdayName(start, locale)} है, तो ${n} दिन बाद कौन-सा वार होगा?`, `ਜੇ ਅੱਜ ${weekdayName(start, locale)} ਹੈ, ਤਾਂ ${n} ਦਿਨਾਂ ਬਾਅਦ ਕਿਹੜਾ ਵਾਰ ਹੋਵੇਗਾ?`),
      wrongs: [
        { value: weekdayShift(start, n - 1), misconceptionId: "SHIFT_BY_N_MINUS_ONE", derivation: { usedShift: n - 1 } },
        { value: weekdayShift(start, -n), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { usedShift: -n } },
        { value: weekdayShift(start, n + 1), misconceptionId: "SHIFT_BY_N_PLUS_ONE", derivation: { usedShift: n + 1 } },
      ],
      explanation: makeExplanation(locale, t(locale, `Known day: ${weekdayName(start, locale)}.`, `ज्ञात वार: ${weekdayName(start, locale)}।`, `ਜਾਣਿਆ ਵਾਰ: ${weekdayName(start, locale)}।`), t(locale, "Only the remainder after division by 7 changes the weekday.", "7 से भाग देने पर बचा शेष ही वार बदलता है।", "7 ਨਾਲ ਭਾਗ ਦੇਣ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਸ਼ੇਸ਼ ਹੀ ਵਾਰ ਬਦਲਦਾ ਹੈ।"), [`${n} mod 7 = ${n % 7}`, `${weekdayName(start, locale)} + ${n % 7} = ${weekdayName(answer, locale)}`], weekdayName(answer, locale), "Do not count today as day one."),
    };
  }
  if (id === "CAL-PQL-002") {
    const answer = walkWeekday(start, -n);
    return {
      queryType: "WEEKDAY_BEFORE_DAYS", facts: { anchorWeekday: start, signedDayShift: -n }, answer,
      groundTruth: { method: "MOD7_SHIFT", segments: [{ repeatedMovement: -n }], answer },
      teachingTrace: { method: "MOD7_SHIFT", segments: [{ remainder: n % 7 }, { direction: "BACKWARD" }], answer: weekdayShift(start, -n) },
      stem: t(locale, `If today is ${weekdayName(start, locale)}, what day was it ${n} days ago?`, `यदि आज ${weekdayName(start, locale)} है, तो ${n} दिन पहले कौन-सा वार था?`, `ਜੇ ਅੱਜ ${weekdayName(start, locale)} ਹੈ, ਤਾਂ ${n} ਦਿਨ ਪਹਿਲਾਂ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
      wrongs: [
        { value: weekdayShift(start, n), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { usedShift: n } },
        { value: weekdayShift(start, -(n - 1)), misconceptionId: "SHIFT_BY_N_MINUS_ONE", derivation: { usedShift: -(n - 1) } },
        { value: weekdayShift(start, -(n + 1)), misconceptionId: "SHIFT_BY_N_PLUS_ONE", derivation: { usedShift: -(n + 1) } },
      ],
      explanation: makeExplanation(locale, weekdayName(start, locale), "Reduce by complete weeks, then move backward.", [`${n} mod 7 = ${n % 7}`, `${weekdayName(start, locale)} - ${n % 7} = ${weekdayName(answer, locale)}`], weekdayName(answer, locale), "Moving forward reverses the required direction."),
      difficultyDimensions: { D2ReverseReasoning: true }, coverage: { usesBackwardMovement: true },
    };
  }
  if (id === "CAL-PQL-003") {
    const end = weekdayShift(start, n);
    const answer = start;
    return {
      queryType: "RECOVER_START_WEEKDAY", facts: { anchorWeekday: start, targetWeekday: end, signedDayShift: n }, answer,
      groundTruth: { method: "MOD7_SHIFT", segments: [{ reverseWalk: -n }], answer: walkWeekday(end, -n) },
      teachingTrace: { method: "MOD7_SHIFT", segments: [{ remainder: n % 7 }, { operation: "END_MINUS_REMAINDER" }], answer: weekdayShift(end, -n) },
      stem: t(locale, `${n} days after a certain day is ${weekdayName(end, locale)}. What was the starting day?`, `किसी वार के ${n} दिन बाद ${weekdayName(end, locale)} है। आरंभिक वार क्या था?`, `ਕਿਸੇ ਵਾਰ ਤੋਂ ${n} ਦਿਨ ਬਾਅਦ ${weekdayName(end, locale)} ਹੈ। ਸ਼ੁਰੂਆਤੀ ਵਾਰ ਕਿਹੜਾ ਸੀ?`),
      wrongs: [
        { value: weekdayShift(end, n), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { operation: "END_PLUS_SHIFT" } },
        { value: weekdayShift(end, -(n - 1)), misconceptionId: "SHIFT_BY_N_MINUS_ONE", derivation: { usedShift: n - 1 } },
        { value: weekdayShift(end, -(n + 1)), misconceptionId: "SHIFT_BY_N_PLUS_ONE", derivation: { usedShift: n + 1 } },
      ],
      explanation: makeExplanation(locale, weekdayName(end, locale), "Undo the given forward movement by moving backward.", [`${n} mod 7 = ${n % 7}`, `${weekdayName(end, locale)} - ${n % 7} = ${weekdayName(answer, locale)}`], weekdayName(answer, locale)),
      difficultyDimensions: { D2ReverseReasoning: true, D8InverseReasoning: true }, coverage: { usesBackwardMovement: true },
    };
  }
  const target = rng.int(0, 6) as Weekday;
  const positive = mod7(target - start);
  const answer = positive === 0 ? 7 : positive;
  return {
    queryType: "LEAST_POSITIVE_DAY_COUNT", facts: { anchorWeekday: start, targetWeekday: target }, answer,
    groundTruth: { method: "MOD7_SHIFT", segments: [{ searched: Array.from({ length: answer }, (_, i) => walkWeekday(start, i + 1)) }], answer },
    teachingTrace: { method: "MOD7_SHIFT", segments: [{ congruence: `${answer} ≡ ${mod7(target - start)} (mod 7)` }], answer },
    stem: t(locale, `Today is ${weekdayName(start, locale)}. After how many days at the earliest will it be ${weekdayName(target, locale)}?`, `आज ${weekdayName(start, locale)} है। कम-से-कम कितने दिन बाद ${weekdayName(target, locale)} होगा?`, `ਅੱਜ ${weekdayName(start, locale)} ਹੈ। ਘੱਟੋ-ਘੱਟ ਕਿੰਨੇ ਦਿਨਾਂ ਬਾਅਦ ${weekdayName(target, locale)} ਹੋਵੇਗਾ?`),
    wrongs: [
      { value: answer === 7 ? 0 : answer + 7, misconceptionId: "FAILED_MOD7_REDUCTION", derivation: { usedNonLeastEquivalent: true } },
      { value: Math.max(0, answer - 1), misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { countedToday: true } },
      { value: answer + 1, misconceptionId: "SHIFT_BY_N_PLUS_ONE", derivation: { usedShift: answer + 1 } },
    ],
    explanation: makeExplanation(locale, `${weekdayName(start, locale)} → ${weekdayName(target, locale)}`, "Find the least positive shift modulo 7.", [`Required remainder = ${mod7(target - start)}`, `Least positive count = ${answer}`], String(answer), "When the weekdays match, the least positive answer is 7, not 0."),
  };
}
