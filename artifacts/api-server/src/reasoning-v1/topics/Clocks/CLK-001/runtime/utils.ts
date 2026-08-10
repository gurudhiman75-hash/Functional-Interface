import {
  addRationals,
  clockTimeToTotalSecondsExact,
  compareRationals,
  divideRationals,
  deserializeExactRational,
  exactRational,
  formatExactRational,
  moduloRational,
  multiplyRationals,
  rationalToNumber,
  serializeExactRational,
  subtractRationals,
  totalSecondsToClockTimeExact,
  type ClockTime12Input,
  type ExactRational,
  type ExactRationalInput,
} from "../../../../foundation/temporal";
import type {
  ClockAnswerKind,
  ClockLocale,
  ClockQuestionOption,
  ClockSemanticAnswer,
} from "./types";

export class ClockSeededRandom {
  private state: number;

  constructor(seed: string) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < seed.length; index += 1) {
      hash ^= seed.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    this.state = hash >>> 0 || 0x6d2b79f5;
  }

  nextUint32(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  int(minInclusive: number, maxInclusive: number): number {
    if (!Number.isInteger(minInclusive) || !Number.isInteger(maxInclusive) || minInclusive > maxInclusive) {
      throw new Error("Seeded integer bounds must be ordered integers.");
    }
    const width = maxInclusive - minInclusive + 1;
    return minInclusive + Math.floor((this.nextUint32() / 0x1_0000_0000) * width);
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error("Cannot pick from an empty clock value pool.");
    }
    return items[this.int(0, items.length - 1)] as T;
  }

  shuffle<T>(items: readonly T[]): T[] {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = this.int(0, index);
      [result[index], result[swapIndex]] = [result[swapIndex] as T, result[index] as T];
    }
    return result;
  }
}

export function localized(
  locale: ClockLocale,
  values: { en: string; hi: string; pa: string },
): string {
  return locale === "hi-IN" ? values.hi : locale === "pa-IN" ? values.pa : values.en;
}

export function formatOrdinal(value: number): string {
  if (!Number.isInteger(value)) {
    throw new Error("Ordinal formatting requires an integer.");
  }
  const absolute = Math.abs(value);
  const lastTwo = absolute % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${value}th`;
  switch (absolute % 10) {
    case 1: return `${value}st`;
    case 2: return `${value}nd`;
    case 3: return `${value}rd`;
    default: return `${value}th`;
  }
}

function padClockSecondText(secondText: string): string {
  const match = secondText.match(/^(\d+)(.*)$/);
  if (!match) return secondText;
  return `${match[1]!.padStart(2, "0")}${match[2] ?? ""}`;
}

function absoluteDayQualifier(dayOffset: bigint): string {
  if (dayOffset === 0n) return "";
  const magnitude = dayOffset < 0n ? -dayOffset : dayOffset;
  const unit = magnitude === 1n ? "day" : "days";
  return dayOffset > 0n
    ? ` (${magnitude} ${unit} later)`
    : ` (${magnitude} ${unit} earlier)`;
}

export function formatClockTimeFromSeconds(
  totalSeconds: ExactRationalInput,
  options: { includeSeconds?: boolean; includeDayOffset?: boolean } = {},
): string {
  const buildTime = (value: ExactRationalInput) => {
    const normalized = totalSecondsToClockTimeExact(value);
    const secondText = padClockSecondText(formatExactRational(normalized.second, { mixed: true }));
    const hasSecond = compareRationals(normalized.second, 0) !== 0;
    const base = `${normalized.hour}:${normalized.minute.toString().padStart(2, "0")}`;
    return options.includeSeconds || hasSecond ? `${base}:${secondText}` : base;
  };
  if (!options.includeDayOffset) return buildTime(totalSeconds);
  const absolute = totalSecondsToClockTimeDayOffset(totalSeconds);
  const isPm = compareRationals(absolute.dialSeconds, 43_200) >= 0;
  const timeWithinHalfDay = moduloRational(absolute.dialSeconds, 43_200);
  return `${buildTime(timeWithinHalfDay)} ${isPm ? "p.m." : "a.m."}${absoluteDayQualifier(absolute.dayOffset)}`;
}

export function totalSecondsToClockTimeDayOffset(
  totalSeconds: ExactRationalInput,
): { dayOffset: bigint; dialSeconds: ExactRational } {
  const daySeconds = exactRational(86_400);
  const value = typeof totalSeconds === "object"
    ? exactRational(totalSeconds.numerator, totalSeconds.denominator)
    : exactRational(totalSeconds);
  const approximateDays = Math.floor(rationalToNumber(divideRationals(value, daySeconds)));
  let dayOffset = BigInt(approximateDays);
  let dial = subtractRationals(value, multiplyRationals(daySeconds, dayOffset));
  while (compareRationals(dial, 0) < 0) {
    dayOffset -= 1n;
    dial = addRationals(dial, daySeconds);
  }
  while (compareRationals(dial, daySeconds) >= 0) {
    dayOffset += 1n;
    dial = subtractRationals(dial, daySeconds);
  }
  return { dayOffset, dialSeconds: dial };
}

export function formatDurationSeconds(
  seconds: ExactRationalInput,
): string {
  const value = typeof seconds === "object"
    ? exactRational(seconds.numerator, seconds.denominator)
    : exactRational(seconds);
  if (compareRationals(value, 3_600) >= 0 &&
      compareRationals(moduloRational(value, 3_600), 0) === 0) {
    const hours = divideRationals(value, 3_600);
    const unit = compareRationals(hours, 1) === 0 ? "hour" : "hours";
    return `${formatExactRational(hours, { mixed: true })} ${unit}`;
  }
  if (compareRationals(value, 60) >= 0) {
    const minutes = divideRationals(value, 60);
    const unit = compareRationals(minutes, 1) === 0 ? "minute" : "minutes";
    return `${formatExactRational(minutes, { mixed: true })} ${unit}`;
  }
  const unit = compareRationals(value, 1) === 0 ? "second" : "seconds";
  return `${formatExactRational(value, { mixed: true })} ${unit}`;
}

export function formatAngle(value: ExactRationalInput): string {
  return `${formatExactRational(value, { mixed: true })}°`;
}

export function rationalAnswer(
  kind: ClockAnswerKind,
  value: ExactRationalInput,
  display: string,
  semanticPrefix: string = kind,
): ClockSemanticAnswer {
  const exact = typeof value === "object"
    ? exactRational(value.numerator, value.denominator)
    : exactRational(value);
  return {
    kind,
    semanticKey: `${kind}:${exact.numerator}/${exact.denominator}`,
    display,
    exactValue: serializeExactRational(exact),
    metadata: semanticPrefix === kind ? undefined : { semanticAuthority: semanticPrefix },
  };
}

export function textAnswer(
  kind: ClockAnswerKind,
  key: string,
  display: string,
  metadata?: Readonly<Record<string, string | number | boolean>>,
): ClockSemanticAnswer {
  return {
    kind,
    semanticKey: `${kind}:${key}`,
    display,
    metadata,
  };
}

export function timeAnswer(
  seconds: ExactRationalInput,
  options: { absolute?: boolean; includeDayOffset?: boolean; includeSeconds?: boolean } = {},
): ClockSemanticAnswer {
  const exact = typeof seconds === "object"
    ? exactRational(seconds.numerator, seconds.denominator)
    : exactRational(seconds);
  return rationalAnswer(
    options.absolute ? "ABSOLUTE_TIME" : "TIME",
    exact,
    formatClockTimeFromSeconds(exact, {
      includeDayOffset: options.includeDayOffset,
      includeSeconds: options.includeSeconds,
    }),
    options.absolute ? "ABS_TIME_SECONDS" : "DIAL_TIME_SECONDS",
  );
}

export function timeSetAnswer(
  seconds: readonly ExactRational[],
): ClockSemanticAnswer {
  const sorted = [...seconds].sort((left, right) => compareRationals(left, right));
  return {
    kind: "TIME_SET",
    semanticKey: `TIME_SET:${sorted.map((value) => `${value.numerator}/${value.denominator}`).join("|")}`,
    display: sorted.map((value) => formatClockTimeFromSeconds(value, { includeSeconds: true })).join(", "),
    values: sorted.map(serializeExactRational),
  };
}

export function pairAnswer(
  left: ExactRationalInput,
  right: ExactRationalInput,
): ClockSemanticAnswer {
  const leftExact = typeof left === "object"
    ? exactRational(left.numerator, left.denominator)
    : exactRational(left);
  const rightExact = typeof right === "object"
    ? exactRational(right.numerator, right.denominator)
    : exactRational(right);
  return {
    kind: "TIME_PAIR",
    semanticKey: `TIME_PAIR:${leftExact.numerator}/${leftExact.denominator}|${rightExact.numerator}/${rightExact.denominator}`,
    display: `${formatClockTimeFromSeconds(leftExact, { includeSeconds: true })} and ${formatClockTimeFromSeconds(rightExact, { includeSeconds: true })}`,
    values: [serializeExactRational(leftExact), serializeExactRational(rightExact)],
  };
}

function fallbackDistractors(correct: ClockSemanticAnswer): {
  answer: ClockSemanticAnswer;
  reasonCode: string;
  reason: string;
}[] {
  const output: { answer: ClockSemanticAnswer; reasonCode: string; reason: string }[] = [];
  if (correct.exactValue) {
    const value = exactRational(BigInt(correct.exactValue.numerator), BigInt(correct.exactValue.denominator));
    const candidates = correct.kind === "TIME" || correct.kind === "ABSOLUTE_TIME"
      ? [addRationals(value, 60), subtractRationals(value, 60), addRationals(value, 300), subtractRationals(value, 300), addRationals(value, 3_600), subtractRationals(value, 3_600)]
      : correct.kind === "RATE" || correct.kind === "RATIO"
        ? [divideRationals(1, value), multiplyRationals(value, 2), divideRationals(value, 2), addRationals(value, 1), addRationals(value, 2), multiplyRationals(value, 3)]
        : [multiplyRationals(value, 2), divideRationals(value, 2), addRationals(value, 1), addRationals(value, 2), addRationals(value, 3), multiplyRationals(value, 3)];
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index]!;
      let display = formatExactRational(candidate, { mixed: true });
      if (correct.kind === "TIME" || correct.kind === "ABSOLUTE_TIME") {
        display = formatClockTimeFromSeconds(candidate, { includeSeconds: true, includeDayOffset: correct.kind === "ABSOLUTE_TIME" });
      } else if (correct.kind === "ANGLE") {
        display = formatAngle(candidate);
      } else if (correct.kind === "DURATION") {
        display = formatDurationSeconds(candidate);
      } else if (correct.kind === "DISTANCE_PI") {
        display = `${formatExactRational(candidate, { mixed: true })}π`;
      } else if (correct.kind === "RATE" || correct.kind === "RATIO") {
        display = `${candidate.numerator}:${candidate.denominator}`;
      }
      output.push({
        answer: rationalAnswer(correct.kind, candidate, display, `METHOD_FALLBACK_${correct.kind}`),
        reasonCode: ["RECIPROCAL_OR_DOUBLE_ROUTE", "RESULT_HALVED_OR_DOUBLED", "RESULT_HALVED", "ONE_UNIT_BOUNDARY_ERROR"][index % 4]!,
        reason: [
          "This uses a reciprocal or repeated-operation route instead of the requested exact operation.",
          "This repeats or reverses a scaling step and changes the exact result.",
          "This omits one of the required equal contributions and halves the result.",
          "This introduces an endpoint or conversion-unit error.",
        ][index % 4]!,
      });
    }
  }
  if (correct.values && correct.values.length > 0) {
    const values = correct.values.map(deserializeExactRational);
    if (correct.kind === "TIME_SET") {
      if (values.length > 1) {
        output.push({ answer: timeSetAnswer(values.slice(1)), reasonCode: "FIRST_VALID_ROOT_OMITTED", reason: "This omits one exact valid branch from the requested complete time set." });
        output.push({ answer: timeSetAnswer(values.slice(0, -1)), reasonCode: "LAST_VALID_ROOT_OMITTED", reason: "This omits the final exact valid branch from the requested complete time set." });
      }
      output.push({ answer: timeSetAnswer(values.map((value) => addRationals(value, 60))), reasonCode: "EVERY_ROOT_SHIFTED_ONE_MINUTE", reason: "This shifts every exact root by one minute instead of solving the event equation." });
      output.push({ answer: timeSetAnswer([...values, addRationals(values[values.length - 1]!, 300)]), reasonCode: "EXTRA_OUT_OF_SET_ROOT", reason: "This includes an additional value that fails the exact event condition." });
    } else if (correct.kind === "TIME_PAIR" && values.length >= 2) {
      output.push({ answer: pairAnswer(values[0]!, addRationals(values[1]!, 60)), reasonCode: "SECOND_TIME_SHIFTED", reason: "The second time is shifted and no longer satisfies the paired exact condition." });
      output.push({ answer: pairAnswer(addRationals(values[0]!, 60), values[1]!), reasonCode: "FIRST_TIME_SHIFTED", reason: "The first time is shifted and no longer satisfies the paired exact condition." });
      output.push({ answer: pairAnswer(values[0]!, values[0]!), reasonCode: "PAIR_COLLAPSED_TO_ONE_TIME", reason: "This repeats one time instead of giving the two required related times." });
    }
  }
  if (output.length < 3 && correct.kind !== "DIAGRAM") {
    const generic = [
      ["NONE", "None of these", "QUERY_CONDITION_REJECTED", "This rejects the exact result even though the supplied conditions determine it."],
      ["CANNOT_DETERMINE", "Cannot be determined", "SUFFICIENT_DATA_IGNORED", "This treats complete clock data as insufficient."],
      ["NO_EVENT", "No such event", "VALID_EVENT_OMITTED", "This overlooks the exact valid event established by the clock model."],
      ["BOTH", "Both A and B", "SINGLE_CORRECT_CONTRACT_IGNORED", "This combines alternatives even though only one semantic answer satisfies the task."],
    ] as const;
    for (const [key, display, reasonCode, reason] of generic) {
      output.push({ answer: textAnswer(correct.kind, `FALLBACK_${key}`, display), reasonCode, reason });
    }
  }
  return output;
}

export function makeOptions(input: {
  correct: ClockSemanticAnswer;
  distractors: readonly {
    answer: ClockSemanticAnswer;
    reasonCode: string;
    reason: string;
  }[];
  correctOptionIndex: number;
}): ClockQuestionOption[] {
  if (!Number.isInteger(input.correctOptionIndex) || input.correctOptionIndex < 0 || input.correctOptionIndex > 3) {
    throw new Error("Correct option index must be 0..3.");
  }
  const uniqueDistractors = new Map<string, {
    answer: ClockSemanticAnswer;
    reasonCode: string;
    reason: string;
  }>();
  const usedDisplays = new Set<string>([input.correct.display]);
  for (const distractor of [...input.distractors, ...fallbackDistractors(input.correct)]) {
    if (distractor.answer.semanticKey !== input.correct.semanticKey && !uniqueDistractors.has(distractor.answer.semanticKey) && !usedDisplays.has(distractor.answer.display)) {
      uniqueDistractors.set(distractor.answer.semanticKey, distractor);
      usedDisplays.add(distractor.answer.display);
    }
  }
  const selected = [...uniqueDistractors.values()].slice(0, 3);
  if (selected.length !== 3) {
    throw new Error(`Clock question requires three unique wrong options; found ${selected.length}.`);
  }
  const options: ClockQuestionOption[] = selected.map((distractor) => ({
    display: distractor.answer.display,
    semanticKey: distractor.answer.semanticKey,
    isCorrect: false,
    reasonCode: distractor.reasonCode,
    reason: distractor.reason,
    answer: distractor.answer,
  }));
  options.splice(input.correctOptionIndex, 0, {
    display: input.correct.display,
    semanticKey: input.correct.semanticKey,
    isCorrect: true,
    reasonCode: "CORRECT",
    reason: "This option matches the exact canonical and independent clock solution.",
    answer: input.correct,
  });
  if (new Set(options.map((option) => option.semanticKey)).size !== 4) {
    throw new Error("Clock option semantic uniqueness failed.");
  }
  if (new Set(options.map((option) => option.display)).size !== 4) {
    throw new Error("Clock option visible-display uniqueness failed.");
  }
  return options;
}

export function timeInput(hour: number, minute: number, second = 0): ClockTime12Input {
  return { hour, minute, second };
}

export function clockSeconds(hour: number, minute: number, second = 0): ExactRational {
  return clockTimeToTotalSecondsExact(timeInput(hour, minute, second));
}

export function stableFingerprint(parts: readonly (string | number | boolean)[]): string {
  let hash = 0x811c9dc5;
  const source = parts.join("|");
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `CLK-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
