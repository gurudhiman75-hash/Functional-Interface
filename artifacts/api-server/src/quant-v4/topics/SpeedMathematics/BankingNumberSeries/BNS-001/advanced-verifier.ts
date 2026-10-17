import type { Bns001PatternKind } from "./types";
export const ADVANCED_PATTERNS: readonly Bns001PatternKind[] = [
  "QUARTIC_POLYNOMIAL_TERMS",
  "POWER_DIFFERENCE",
  "QUADRATIC_DIFFERENCE",
  "DESCENDING_CUBE_DIFFERENCE",
  "ODD_SQUARE_DIFFERENCE",
  "CONSECUTIVE_CUBES",
  "VARIABLE_MULTIPLY_SUBTRACT",
  "VARIABLE_MULTIPLY_ADD",
  "FRACTIONAL_GEOMETRIC",
  "CONSTANT_DIVISION",
  "CONSECUTIVE_PRIME_DIFFERENCE",
  "VARIABLE_FRACTIONAL_MULTIPLIER",
  "VARIABLE_FRACTIONAL_DIVISOR",
  "ALTERNATING_MULTIPLY_DIVIDE",
  "PRIME_SECOND_DIFFERENCE",
  "INTERLEAVED_PROGRESSIVE_DIFFERENCE",
];
const close = (a: number, b: number) => Math.abs(a - b) <= 1e-7;
export const cleanNumber = (n: number) => Math.round(n * 1e8) / 1e8;
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
function polynomialAt(points: readonly [number, number][], x: number): number {
  return points.reduce(
    (s, [i, y]) =>
      s +
      y *
        points
          .filter(([j]) => j !== i)
          .reduce((v, [j]) => (v * (x - j)) / (i - j), 1),
    0,
  );
}
// Each template is an affine sequence A_i * initial + B_i * scale.
// These recurrences are verifier-owned, independent of generator states.
function* buildTemplates(
  pattern: Bns001PatternKind,
  length: number,
): Generator<[number[], number[], boolean]> {
  const additive = (d: (i: number) => number) => {
    const b = [0];
    for (let i = 0; i < length - 1; i++) b.push(b[i]! + d(i));
    return [Array(length).fill(1), b, false] as [number[], number[], boolean];
  };
  const recurrent = (m: (i: number) => number, add: (i: number) => number) => {
    const a = [1],
      b = [0];
    for (let i = 0; i < length - 1; i++) {
      a.push(a[i]! * m(i));
      b.push(b[i]! * m(i) + add(i));
    }
    return [a, b, false] as [number[], number[], boolean];
  };
  if (pattern === "POWER_DIFFERENCE")
    for (let shift = 0; shift <= 3; shift++)
      yield additive((i) => 4 ** (i + shift) - 2 ** (i + shift));
  if (pattern === "DESCENDING_CUBE_DIFFERENCE")
    for (let k = 9; k <= 25; k += 2)
      if (k - 2 * (length - 2) > 0) yield additive((i) => -((k - 2 * i) ** 3));
  if (pattern === "ODD_SQUARE_DIFFERENCE")
    for (let k = 1; k <= 15; k += 2) yield additive((i) => -((k + 2 * i) ** 2));
  if (pattern === "QUARTIC_POLYNOMIAL_TERMS")
    for (let k = 2; k <= 20; k++)
      yield [
        Array(length).fill(0),
        Array.from({ length }, (_, i) => {
          const n = k + i;
          return n * n * (n * n - n - 1);
        }),
        false,
      ];
  if (pattern === "CONSECUTIVE_CUBES")
    for (let k = 1; k <= 20; k++)
      yield [
        Array(length).fill(0),
        Array.from({ length }, (_, i) => (k + i) ** 3),
        false,
      ];
  if (pattern === "VARIABLE_MULTIPLY_SUBTRACT")
    for (let k = 1; k <= 5; k++)
      yield recurrent(
        (i) => k + i,
        (i) => -(k + i),
      );
  if (pattern === "VARIABLE_MULTIPLY_ADD")
    for (let k = 1; k <= 5; k++) {
      yield recurrent(
        (i) => k + i,
        (i) => 2 * (i + 1),
      );
      for (let b = 1; b <= 9; b++)
        yield recurrent(
          (i) => k + i,
          (i) => b - i,
        );
    }
  if (pattern === "FRACTIONAL_GEOMETRIC")
    for (const r of [0.5, 1.5, 2.5])
      yield recurrent(
        () => r,
        () => 0,
      );
  if (pattern === "CONSTANT_DIVISION")
    for (const divisor of [2, 3, 4])
      yield recurrent(() => 1 / divisor, () => 0);
  if (pattern === "CONSECUTIVE_PRIME_DIFFERENCE")
    for (let start = 0; start <= 8; start++)
      for (const sign of [-1, 1])
        yield additive((i) => sign * primes[start + i]!);
  if (pattern === "VARIABLE_FRACTIONAL_MULTIPLIER")
    for (const m of [1, 1.5, 2, 2.5, 3])
      yield recurrent(
        (i) => m + i * 0.5,
        () => 0,
      );
  if (pattern === "VARIABLE_FRACTIONAL_DIVISOR")
    for (const d of [3.5, 4, 4.5, 5, 5.5, 6, 6.5])
      if (d - (length - 2) * 0.5 > 0)
        yield recurrent(
          (i) => 1 / (d - i * 0.5),
          () => 0,
        );
  if (pattern === "ALTERNATING_MULTIPLY_DIVIDE")
    for (const m of [2, 3, 4])
      for (const d of [4, 6, 8])
        if (m !== d)
          yield recurrent(
            (i) => (i % 2 === 0 ? m : 1 / d),
            () => 0,
          );
  if (pattern === "PRIME_SECOND_DIFFERENCE")
    for (let start = 0; start < 5; start++)
      for (let first = 1; first <= 40; first++) {
        const gaps = [first];
        for (let i = 0; i < length - 2; i++)
          gaps.push(gaps[i]! + primes[start + i]!);
        const t = additive((i) => gaps[i]!);
        t[2] = true;
        yield t;
      }
}
const templateCache = new Map<
  string,
  readonly [number[], number[], boolean][]
>();
function templates(
  pattern: Bns001PatternKind,
  length: number,
): readonly [number[], number[], boolean][] {
  const key = `${pattern}:${length}`;
  let entries = templateCache.get(key);
  if (!entries) {
    entries = [...buildTemplates(pattern, length)];
    templateCache.set(key, entries);
  }
  return entries;
}
function reconstructions(
  pattern: Bns001PatternKind,
  series: readonly number[],
  gap: number | null,
): number[] {
  const known = series.map((_, i) => i).filter((i) => i !== gap),
    results: number[] = [];
  if (pattern === "QUADRATIC_DIFFERENCE") {
    if (known.length < 4) return [];
    const points = known
      .slice(0, 4)
      .map((i) => [i, series[i]!] as [number, number]);
    if (!known.every((i) => close(polynomialAt(points, i), series[i]!)))
      return [];
    const y = Array.from({ length: 4 }, (_, i) => polynomialAt(points, i));
    if (close(y[3]! - 3 * y[2]! + 3 * y[1]! - y[0]!, 0)) return [];
    return [cleanNumber(polynomialAt(points, gap ?? 0))];
  }
  if (pattern === "INTERLEAVED_PROGRESSIVE_DIFFERENCE") {
    const rows = [0, 1].map((parity) => known.filter((i) => i % 2 === parity));
    if (
      rows.some((row) => row.length < 2) ||
      rows.every((row) => row.length < 3)
    )
      return [];
    const polynomials = rows.map((row) =>
      row.slice(0, 3).map((i) => [i, series[i]!] as [number, number]),
    );
    const established = rows.findIndex((row) => row.length >= 3);
    const points = polynomials[established]!;
    const rise =
      polynomialAt(points, established + 4) -
      2 * polynomialAt(points, established + 2) +
      polynomialAt(points, established);
    for (let row = 0; row < 2; row++)
      if (polynomials[row]!.length === 2) {
        const [[x, y], [z, w]] = polynomials[row]! as [
          [number, number],
          [number, number],
        ];
        const quadratic = -rise / 8,
          linear = (w - y - quadratic * (z * z - x * x)) / (z - x);
        const extra = z + 2;
        polynomials[row]!.push([
          extra,
          y + quadratic * (extra * extra - x * x) + linear * (extra - x),
        ]);
      }
    if (
      !rows.every((row, r) =>
        row.every((i) => close(polynomialAt(polynomials[r]!, i), series[i]!)),
      )
    )
      return [];
    const rises = polynomials.map(
      (points, p) =>
        polynomialAt(points, p + 4) -
        2 * polynomialAt(points, p + 2) +
        polynomialAt(points, p),
    );
    if (close(rises[0]!, 0) || !close(rises[0]!, -rises[1]!)) return [];
    return [cleanNumber(polynomialAt(polynomials[(gap ?? 0) % 2]!, gap ?? 0))];
  }
  for (const [a, b, fixedScale] of templates(pattern, series.length)) {
    let initial = 0,
      scale = 1;
    let fitted = false;
    if (fixedScale) {
      initial = series[known[0]!]! - b[known[0]!]!;
      fitted = true;
    } else if (a.every((v) => v === 0)) {
      const i = known.find((i) => b[i] !== 0);
      if (i !== undefined) {
        scale = series[i]! / b[i]!;
        fitted = true;
      }
    } else if (b.every((v) => v === 0)) {
      const i = known.find((i) => a[i] !== 0);
      if (i !== undefined) {
        initial = series[i]! / a[i]!;
        fitted = true;
      }
    } else
      for (let i = 0; i < known.length && !fitted; i++)
        for (let j = i + 1; j < known.length && !fitted; j++) {
          const x = known[i]!,
            y = known[j]!,
            det = a[x]! * b[y]! - a[y]! * b[x]!;
          if (Math.abs(det) < 1e-9) continue;
          initial = (series[x]! * b[y]! - series[y]! * b[x]!) / det;
          scale = (a[x]! * series[y]! - a[y]! * series[x]!) / det;
          fitted = true;
        }
    if (!fitted || scale <= 0 || !Number.isFinite(initial)) continue;
    if (!known.every((i) => close(a[i]! * initial + b[i]! * scale, series[i]!)))
      continue;
    const value = cleanNumber(a[gap ?? 0]! * initial + b[gap ?? 0]! * scale);
    if (value > 0 && !results.some((r) => close(r, value))) results.push(value);
  }
  return results;
}
export function independentAdvancedMatches(
  series: readonly number[],
): Bns001PatternKind[] {
  if (series.length < 6 || series.some((n) => !Number.isFinite(n) || n <= 0))
    return [];
  return ADVANCED_PATTERNS.filter(
    (p) => reconstructions(p, series, null).length > 0,
  );
}
export function independentAdvancedCandidates(
  series: readonly number[],
  gap: number,
): number[] {
  return [
    ...new Set(
      ADVANCED_PATTERNS.flatMap((p) => reconstructions(p, series, gap)),
    ),
  ];
}
