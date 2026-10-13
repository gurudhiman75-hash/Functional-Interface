import type { Qcp001AdditionalState } from "./types";
const f = (n: bigint, d = 1n) => {
  if (d === 0n) throw Error("Zero denominator");
  return { n, d };
};
const mul = (a: ReturnType<typeof f>, b: ReturnType<typeof f>) =>
  f(a.n * b.n, a.d * b.d);
const num = (r: ReturnType<typeof f>) => Number(r.n) / Number(r.d);
const positive = (values: readonly number[]) =>
  values.every((v) => Number.isSafeInteger(v) && v > 0 && v <= 1e9);
export function independentlySolveAdditional(s: Qcp001AdditionalState): number {
  switch (s.kind) {
    case "COMPOUND_INTEREST": {
      if (
        !positive([s.amount, s.rate, s.years]) ||
        s.years > 10 ||
        s.rate > 100 ||
        !["AMOUNT", "INTEREST", "PRINCIPAL"].includes(s.task)
      )
        throw Error("Invalid compound domain");
      let factor = f(1n);
      for (let i = 0; i < s.years; i++)
        factor = mul(factor, f(BigInt(100 + s.rate), 100n));
      return num(
        s.task === "PRINCIPAL"
          ? f(BigInt(s.amount) * factor.d, factor.n)
          : s.task === "AMOUNT"
            ? f(BigInt(s.amount) * factor.n, factor.d)
            : f(BigInt(s.amount) * (factor.n - factor.d), factor.d),
      );
    }
    case "WORK": {
      if (
        !positive([
          s.firstTime,
          s.secondTime,
          s.combinedNumerator,
          s.combinedDenominator,
        ]) ||
        !["COMBINED", "MISSING"].includes(s.task)
      )
        throw Error("Invalid work domain");
      const value =
        s.task === "COMBINED"
          ? num(
              f(
                BigInt(s.firstTime) * BigInt(s.secondTime),
                BigInt(s.firstTime + s.secondTime),
              ),
            )
          : num(
              f(
                BigInt(s.combinedNumerator) * BigInt(s.firstTime),
                BigInt(
                  s.combinedDenominator * s.firstTime - s.combinedNumerator,
                ),
              ),
            );
      if (value <= 0 || (s.task === "MISSING" && value !== s.secondTime))
        throw Error("Inconsistent work state");
      return value;
    }
    case "BOATS": {
      if (
        !positive([s.bodySpeed, s.streamSpeed, s.distance * 2]) ||
        s.bodySpeed <= s.streamSpeed ||
        !["UPSTREAM", "DOWNSTREAM", "ROUND_TRIP"].includes(s.task)
      )
        throw Error("Invalid boat domain");
      return s.task === "ROUND_TRIP"
        ? num(
            f(
              BigInt(s.distance * 2) * BigInt(s.bodySpeed),
              BigInt(s.bodySpeed * s.bodySpeed - s.streamSpeed * s.streamSpeed),
            ),
          )
        : num(
            f(
              BigInt(s.distance * 2),
              2n *
                BigInt(
                  s.bodySpeed +
                    (s.task === "UPSTREAM" ? -s.streamSpeed : s.streamSpeed),
                ),
            ),
          );
    }
    case "TRAINS": {
      if (
        !positive([s.lengthA, s.lengthB, s.speedA, s.speedB]) ||
        !["SAME", "OPPOSITE"].includes(s.task) ||
        (s.task === "SAME" && s.speedA <= s.speedB)
      )
        throw Error("Invalid train domain");
      return num(
        f(
          BigInt(s.lengthA + s.lengthB),
          BigInt(s.speedA + (s.task === "SAME" ? -s.speedB : s.speedB)),
        ),
      );
    }
    case "AGES": {
      if (
        !positive([s.difference, s.shift]) ||
        !["FUTURE", "PAST"].includes(s.task)
      )
        throw Error("Invalid age domain");
      const age = s.difference + (s.task === "FUTURE" ? -s.shift : s.shift);
      if (age <= 0 || (s.task === "PAST" && age <= s.shift))
        throw Error("Impossible age domain");
      return age;
    }
    case "PROBABILITY": {
      if (
        !positive([s.red, s.blue]) ||
        s.red < 2 ||
        s.red + s.blue > 100 ||
        ![
          "SINGLE",
          "WITH_REPLACEMENT",
          "WITHOUT_REPLACEMENT",
          "CONDITIONAL",
        ].includes(s.task)
      )
        throw Error("Invalid urn domain");
      const n = s.red + s.blue;
      return num(
        s.task === "SINGLE"
          ? f(BigInt(s.red), BigInt(n))
          : s.task === "CONDITIONAL"
            ? f(BigInt(s.red - 1), BigInt(n - 1))
            : s.task === "WITH_REPLACEMENT"
              ? f(BigInt(s.red * s.red), BigInt(n * n))
              : f(BigInt(s.red * (s.red - 1)), BigInt(n * (n - 1))),
      );
    }
    case "MENSURATION": {
      if (
        !positive([s.base, s.height, s.area]) ||
        s.area !== (s.base * s.height) / 2 ||
        !["TRIANGLE_AREA", "TRIANGLE_HEIGHT"].includes(s.task)
      )
        throw Error("Invalid perpendicular triangle domain");
      return s.task === "TRIANGLE_AREA"
        ? (s.base * s.height) / 2
        : (2 * s.area) / s.base;
    }
    case "REPLACEMENT": {
      if (
        !positive([s.milk, s.water, s.removed, s.cycles]) ||
        s.removed >= s.milk + s.water ||
        s.cycles > 6 ||
        s.task !== "REMOVE_REFILL"
      )
        throw Error("Invalid replacement domain");
      let milk = f(BigInt(s.milk)),
        factor = f(
          BigInt(s.milk + s.water - s.removed),
          BigInt(s.milk + s.water),
        );
      for (let i = 0; i < s.cycles; i++) milk = mul(milk, factor);
      return num(milk);
    }
    case "PRICE_RECOVERY": {
      if (
        !positive([s.difference, s.firstRate, s.secondRate]) ||
        !["PROFIT", "LOSS"].includes(s.firstDirection) ||
        !["PROFIT", "LOSS"].includes(s.secondDirection) ||
        s.task !== "COST_PRICE" ||
        (s.firstDirection === "LOSS" && s.firstRate >= 100) ||
        (s.secondDirection === "LOSS" && s.secondRate >= 100)
      )
        throw Error("Invalid selling conditions");
      const gap =
        (s.firstDirection === "PROFIT" ? s.firstRate : -s.firstRate) -
        (s.secondDirection === "PROFIT" ? s.secondRate : -s.secondRate);
      if (gap <= 0) throw Error("Invalid selling-price order");
      return num(f(BigInt(s.difference) * 100n, BigInt(gap)));
    }
  }
}
