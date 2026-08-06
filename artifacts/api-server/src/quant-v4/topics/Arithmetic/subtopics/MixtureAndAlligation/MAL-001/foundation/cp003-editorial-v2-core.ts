export type Rational = { numerator: bigint; denominator: bigint };

export type MisconceptionId =
  | "correct"
  | "linear_subtraction_error"
  | "one_stage_short"
  | "one_stage_extra"
  | "ratio_reversal"
  | "removed_fraction_error"
  | "ignored_mixture_change"
  | "stage_skipped"
  | "component_order_swapped"
  | "initial_state_reported"
  | "total_removed_reported"
  | "retained_fraction_reported_as_removed"
  | "average_loss_divided_by_rounds"
  | "replacement_component_reported"
  | "applied_retention_forward"
  | "initial_component_complement"
  | "stops_before_strict_crossing"
  | "one_extra_operation"
  | "two_extra_operations"
  | "one_stage_retained_volume"
  | "removal_reported_as_capacity"
  | "total_removed_reported_as_capacity";

export function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x === 0n ? 1n : x;
}

export function rational(numerator: bigint | number, denominator: bigint | number = 1): Rational {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) throw new Error("Rational denominator cannot be zero.");
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcd(n, d);
  return { numerator: n / divisor, denominator: d / divisor };
}

export function add(a: Rational, b: Rational): Rational {
  return rational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function subtract(a: Rational, b: Rational): Rational {
  return rational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function multiply(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function divide(a: Rational, b: Rational): Rational {
  if (b.numerator === 0n) throw new Error("Cannot divide by zero.");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function power(value: Rational, exponent: number): Rational {
  if (!Number.isInteger(exponent) || exponent < 0) {
    throw new Error(`Invalid rational exponent ${exponent}.`);
  }
  return rational(
    value.numerator ** BigInt(exponent),
    value.denominator ** BigInt(exponent),
  );
}

export function compare(a: Rational, b: Rational): number {
  const left = a.numerator * b.denominator;
  const right = b.numerator * a.denominator;
  return left < right ? -1 : left > right ? 1 : 0;
}

export function absolute(value: Rational): Rational {
  return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value;
}

export function ratioText(first: Rational, second: Rational): string {
  const left = first.numerator * second.denominator;
  const right = second.numerator * first.denominator;
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
}

export function parseNumber(value: string): Rational {
  const cleaned = value
    .replace(/\\[,!]/gu, "")
    .replace(/,/gu, "")
    .trim();
  const mixed = cleaned.match(/(-?\d+)\s+(\d+)\/(\d+)/u);
  if (mixed) {
    const whole = BigInt(mixed[1]!);
    const numerator = BigInt(mixed[2]!);
    const denominator = BigInt(mixed[3]!);
    const sign = whole < 0n ? -1n : 1n;
    return rational(whole * denominator + sign * numerator, denominator);
  }
  const fraction = cleaned.match(/(-?\d+)\/(\d+)/u);
  if (fraction) return rational(BigInt(fraction[1]!), BigInt(fraction[2]!));
  const decimal = cleaned.match(/-?\d+(?:\.\d+)?/u)?.[0];
  if (!decimal) throw new Error(`Cannot parse a number from '${value}'.`);
  if (!decimal.includes(".")) return rational(BigInt(decimal));
  const [whole, fractionPart] = decimal.split(".");
  const denominator = 10n ** BigInt(fractionPart!.length);
  const sign = whole!.startsWith("-") ? -1n : 1n;
  const absoluteWhole = BigInt(whole!);
  return rational(absoluteWhole * denominator + sign * BigInt(fractionPart!), denominator);
}

export function formatNumber(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const negative = value.numerator < 0n;
  const absolute = negative ? -value.numerator : value.numerator;
  const whole = absolute / value.denominator;
  const remainder = absolute % value.denominator;
  const sign = negative ? "-" : "";
  if (whole === 0n) return `${sign}${remainder}/${value.denominator}`;
  if (remainder === 0n) return `${sign}${whole}`;
  return `${sign}${whole} ${remainder}/${value.denominator}`;
}

export function quantity(value: Rational): string {
  return `${formatNumber(value)} litres`;
}

export function canonicalOption(value: string): string {
  const compact = value.toLowerCase().replace(/\s+/gu, " ").trim();
  const ratio = compact.match(/(-?\d+)\s*:\s*(-?\d+)/u);
  if (ratio) {
    const first = BigInt(ratio[1]!);
    const second = BigInt(ratio[2]!);
    const divisor = gcd(first, second);
    return `ratio:${first / divisor}:${second / divisor}`;
  }
  try {
    const number = parseNumber(compact);
    const semantic = /operation/u.test(compact)
      ? "operations"
      : /litre/u.test(compact)
        ? "litres"
        : "number";
    return `${semantic}:${number.numerator}/${number.denominator}`;
  } catch {
    return compact;
  }
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const result = [...values];
  let state = hash(seed) || 0x9e3779b9;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = next() % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

export function buildOptions(
  answer: string,
  candidates: readonly { text: string; misconceptionId: MisconceptionId }[],
  seed: string,
) {
  const unique = new Map<string, { text: string; misconceptionId: MisconceptionId }>();
  unique.set(canonicalOption(answer), { text: answer, misconceptionId: "correct" });
  for (const candidate of candidates) {
    const key = canonicalOption(candidate.text);
    if (!unique.has(key)) unique.set(key, candidate);
  }
  if (unique.size < 4) {
    throw new Error(`Insufficient conceptual options for ${seed}: ${[...unique.keys()].join(", ")}.`);
  }
  const selected = shuffle([...unique.values()].slice(0, 4), seed);
  const correctIndex = selected.findIndex((option) => option.misconceptionId === "correct");
  return {
    answer,
    options: selected.map((option) => option.text),
    optionAudit: selected.map((option) => ({
      text: option.text,
      misconceptionId: option.misconceptionId,
      isCorrect: option.misconceptionId === "correct",
    })),
    correctIndex,
  };
}

export function mapMisconception(value: string): MisconceptionId {
  const direct = new Set<MisconceptionId>([
    "correct", "linear_subtraction_error", "one_stage_short", "one_stage_extra",
    "ratio_reversal", "removed_fraction_error", "ignored_mixture_change",
    "stage_skipped", "component_order_swapped", "initial_state_reported",
    "total_removed_reported", "retained_fraction_reported_as_removed",
    "average_loss_divided_by_rounds", "replacement_component_reported",
    "applied_retention_forward", "initial_component_complement",
    "stops_before_strict_crossing", "one_extra_operation", "two_extra_operations",
    "one_stage_retained_volume", "removal_reported_as_capacity",
    "total_removed_reported_as_capacity",
  ]);
  if (direct.has(value as MisconceptionId)) return value as MisconceptionId;
  const mapping: Record<string, MisconceptionId> = {
    CORRECT: "correct",
    ONE_STAGE_TOO_FEW: "one_stage_short",
    TOO_FEW_OPERATIONS: "one_stage_short",
    ONE_STAGE_TOO_MANY: "one_stage_extra",
    TOO_MANY_OPERATIONS: "one_stage_extra",
    ONE_EXTRA_OPERATION: "one_extra_operation",
    TWO_EXTRA_OPERATIONS: "two_extra_operations",
    STOPS_BEFORE_STRICT_CROSSING: "stops_before_strict_crossing",
    LINEAR_STAGE_COUNT: "linear_subtraction_error",
    LINEAR_SUBTRACTION_INSTEAD_OF_GEOMETRIC_RETENTION: "linear_subtraction_error",
    RATIO_REVERSED: "ratio_reversal",
    REFILL_COMPONENTS_SWAPPED: "component_order_swapped",
    INITIAL_STATE_REPORTED: "initial_state_reported",
    SECOND_STAGE_IGNORED: "stage_skipped",
    TOTAL_DRAWN_REPORTED_PER_OPERATION: "total_removed_reported",
    RETAINED_VOLUME_REPORTED_AS_REMOVAL: "retained_fraction_reported_as_removed",
    AVERAGE_ORIGINAL_LOSS_TREATED_AS_DRAWN_QUANTITY: "average_loss_divided_by_rounds",
    ONE_STAGE_RETAINED_VOLUME_REPORTED: "one_stage_retained_volume",
    REMOVAL_QUANTITY_REPORTED_AS_CAPACITY: "removal_reported_as_capacity",
    TOTAL_DRAWN_REPORTED_AS_CAPACITY: "total_removed_reported_as_capacity",
    REMOVED_QUANTITY_ADDED_TO_CAPACITY: "one_stage_extra",
    COMPLEMENT_REPORTED: "replacement_component_reported",
    REMOVED_QUANTITY_REPORTED: "total_removed_reported",
    ONE_STAGE_ONLY: "one_stage_short",
    REMOVED_FRACTION_REPORTED: "removed_fraction_error",
    REFILL_FRACTION_REPORTED: "replacement_component_reported",
  };
  const mapped = mapping[value];
  if (!mapped) throw new Error(`Unapproved distractor authority '${value}'.`);
  return mapped;
}
