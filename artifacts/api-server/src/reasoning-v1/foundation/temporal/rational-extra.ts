import {
  asExactRational,
  compareRationals,
  divideRationals,
  exactRational,
  floorRational,
  multiplyRationals,
  negateRational,
  rationalToMixedParts,
  subtractRationals,
  type ExactRational,
  type ExactRationalInput,
} from "./rational";

export interface SerializedExactRational {
  numerator: string;
  denominator: string;
}

export function ceilRational(value: ExactRationalInput): bigint {
  return -floorRational(negateRational(value));
}

export function roundRationalToInteger(
  value: ExactRationalInput,
  mode: "NEAREST" | "FLOOR" | "CEIL" = "NEAREST",
): bigint {
  if (mode === "FLOOR") {
    return floorRational(value);
  }
  if (mode === "CEIL") {
    return ceilRational(value);
  }

  const normalized = asExactRational(value);
  const floor = floorRational(normalized);
  const fractional = subtractRationals(normalized, floor);
  return compareRationals(fractional, exactRational(1, 2)) >= 0
    ? floor + 1n
    : floor;
}

export function serializeExactRational(
  value: ExactRationalInput,
): SerializedExactRational {
  const normalized = asExactRational(value);
  return {
    numerator: normalized.numerator.toString(),
    denominator: normalized.denominator.toString(),
  };
}

export function deserializeExactRational(
  value: SerializedExactRational,
): ExactRational {
  return exactRational(BigInt(value.numerator), BigInt(value.denominator));
}

export function formatExactRational(
  value: ExactRationalInput,
  options: {
    mixed?: boolean;
    unicodeMinus?: boolean;
  } = {},
): string {
  const normalized = asExactRational(value);
  const minus = options.unicodeMinus === false ? "-" : "−";

  if (!options.mixed) {
    if (normalized.denominator === 1n) {
      return normalized.numerator < 0n
        ? `${minus}${-normalized.numerator}`
        : normalized.numerator.toString();
    }
    const numerator = normalized.numerator < 0n
      ? `${minus}${-normalized.numerator}`
      : normalized.numerator.toString();
    return `${numerator}/${normalized.denominator}`;
  }

  const parts = rationalToMixedParts(normalized);
  const sign = parts.sign < 0 ? minus : "";
  if (parts.remainder === 0n) {
    return `${sign}${parts.whole}`;
  }
  if (parts.whole === 0n) {
    return `${sign}${parts.remainder}/${parts.denominator}`;
  }
  return `${sign}${parts.whole} ${parts.remainder}/${parts.denominator}`;
}

export function rationalPercent(value: ExactRationalInput): ExactRational {
  return multiplyRationals(value, 100);
}

export function ratioFromPercent(percent: ExactRationalInput): ExactRational {
  return divideRationals(percent, 100);
}
