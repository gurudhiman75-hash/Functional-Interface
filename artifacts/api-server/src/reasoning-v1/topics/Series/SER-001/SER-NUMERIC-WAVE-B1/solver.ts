import type {
  SerNumericWaveB1CanonicalAuthorityId,
  SerNumericWaveB1IndependentSolution,
  SerNumericWaveB1TaskKind,
} from "./inventory";

interface Candidate {
  readonly canonicalAuthorityId: SerNumericWaveB1CanonicalAuthorityId;
  readonly projected: readonly number[];
  readonly mismatches: readonly number[];
  readonly parameterKeys: readonly string[];
}

interface MutableCandidate {
  readonly canonicalAuthorityId: SerNumericWaveB1CanonicalAuthorityId;
  readonly projected: readonly number[];
  readonly mismatches: readonly number[];
  readonly parameterKeys: Set<string>;
}

export function createPrng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export function integer(next: () => number, minimum: number, maximum: number): number {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

export function nonZeroInteger(next: () => number, minimum: number, maximum: number): number {
  let value = 0;
  while (value === 0) value = integer(next, minimum, maximum);
  return value;
}

export function shuffled<T>(values: readonly T[], next: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = integer(next, 0, index);
    const current = result[index]!;
    result[index] = result[swapIndex]!;
    result[swapIndex] = current;
  }
  return result;
}

function choose(value: number, rank: number): number {
  if (rank === 0) return 1;
  if (rank < 0 || rank > value) return 0;
  let numerator = 1;
  let denominator = 1;
  for (let index = 0; index < rank; index += 1) {
    numerator *= value - index;
    denominator *= index + 1;
  }
  return numerator / denominator;
}

export function projectFiniteDifference(
  coefficients: readonly number[],
  length: number,
): number[] {
  return Array.from({ length }, (_, index) =>
    coefficients.reduce(
      (sum, coefficient, rank) => sum + coefficient * choose(index, rank),
      0,
    ),
  );
}

export function projectPreviousTwo(
  start0: number,
  start1: number,
  coefficient1: number,
  coefficient2: number,
  constant: number,
  length: number,
): number[] {
  const sequence = [start0, start1];
  while (sequence.length < length) {
    const last = sequence[sequence.length - 1]!;
    const previous = sequence[sequence.length - 2]!;
    sequence.push(coefficient1 * last + coefficient2 * previous + constant);
  }
  return sequence;
}

export function projectPreviousThree(
  start0: number,
  start1: number,
  start2: number,
  coefficient1: number,
  coefficient2: number,
  coefficient3: number,
  length: number,
): number[] {
  const sequence = [start0, start1, start2];
  while (sequence.length < length) {
    const last = sequence[sequence.length - 1]!;
    const previous = sequence[sequence.length - 2]!;
    const third = sequence[sequence.length - 3]!;
    sequence.push(
      coefficient1 * last + coefficient2 * previous + coefficient3 * third,
    );
  }
  return sequence;
}

export function isSafeSequence(sequence: readonly number[]): boolean {
  return sequence.every(
    (value) => Number.isSafeInteger(value) && Math.abs(value) <= 1_000_000,
  );
}

function combinations(values: readonly number[], size: number): number[][] {
  const result: number[][] = [];
  function visit(start: number, selected: number[]): void {
    if (selected.length === size) {
      result.push([...selected]);
      return;
    }
    for (
      let index = start;
      index <= values.length - (size - selected.length);
      index += 1
    ) {
      selected.push(values[index]!);
      visit(index + 1, selected);
      selected.pop();
    }
  }
  visit(0, []);
  return result;
}

function solveLinearSystem(
  matrix: readonly (readonly number[])[],
  values: readonly number[],
): number[] | null {
  const size = matrix.length;
  const augmented = matrix.map((row, index) => [...row, values[index]!]);
  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row]![column]!) > Math.abs(augmented[pivot]![column]!)) {
        pivot = row;
      }
    }
    if (Math.abs(augmented[pivot]![column]!) < 1e-10) return null;
    const pivotRow = augmented[pivot]!;
    augmented[pivot] = augmented[column]!;
    augmented[column] = pivotRow;
    const divisor = augmented[column]![column]!;
    for (let entry = column; entry <= size; entry += 1) {
      augmented[column]![entry] = augmented[column]![entry]! / divisor;
    }
    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row]![column]!;
      for (let entry = column; entry <= size; entry += 1) {
        augmented[row]![entry] =
          augmented[row]![entry]! - factor * augmented[column]![entry]!;
      }
    }
  }
  return augmented.map((row) => row[size]!);
}

function integerCoefficients(values: readonly number[]): number[] | null {
  const rounded = values.map((value) => Math.round(value));
  if (
    values.some(
      (value, index) =>
        !Number.isFinite(value) || Math.abs(value - rounded[index]!) > 1e-7,
    )
  ) {
    return null;
  }
  return rounded;
}

function mismatchIndexes(
  displayed: readonly (number | null)[],
  projected: readonly number[],
): number[] {
  const mismatches: number[] = [];
  for (let index = 0; index < displayed.length; index += 1) {
    const value = displayed[index];
    if (value != null && value !== projected[index]) mismatches.push(index);
  }
  return mismatches;
}

function addCandidate(
  candidates: Map<string, MutableCandidate>,
  displayed: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
  canonicalAuthorityId: SerNumericWaveB1CanonicalAuthorityId,
  parameterKey: string,
  projected: readonly number[],
): void {
  if (!isSafeSequence(projected)) return;
  const mismatches = mismatchIndexes(displayed, projected);
  if (mismatches.length !== allowedMismatchCount) return;
  const key = `${canonicalAuthorityId}|${projected.join(",")}`;
  const existing = candidates.get(key);
  if (existing) {
    existing.parameterKeys.add(parameterKey);
    return;
  }
  candidates.set(key, {
    canonicalAuthorityId,
    projected,
    mismatches,
    parameterKeys: new Set([parameterKey]),
  });
}

function addFiniteDifferenceCandidates(
  candidates: Map<string, MutableCandidate>,
  displayed: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): void {
  const visibleIndexes = displayed
    .map((value, index) => (value == null ? -1 : index))
    .filter((index) => index >= 0);
  for (const order of [4, 5] as const) {
    for (const selected of combinations(visibleIndexes, order + 1)) {
      const matrix = selected.map((index) =>
        Array.from({ length: order + 1 }, (_, rank) => choose(index, rank)),
      );
      const values = selected.map((index) => displayed[index]! as number);
      const solved = solveLinearSystem(matrix, values);
      if (!solved) continue;
      const coefficients = integerCoefficients(solved);
      if (!coefficients || coefficients[order] === 0) continue;
      if (coefficients.some((value) => Math.abs(value) > 100_000)) continue;
      const projected = projectFiniteDifference(coefficients, displayed.length);
      addCandidate(
        candidates,
        displayed,
        allowedMismatchCount,
        "CONSTANT_HIGHER_ORDER_FINITE_DIFFERENCE",
        `order=${order};coefficients=${coefficients.join(":")}`,
        projected,
      );
    }
  }
}

function derivePreviousTwoStart0(
  displayed: readonly (number | null)[],
  coefficient1: number,
  coefficient2: number,
  constant: number,
): number | null {
  const first = displayed[0];
  if (first != null) return first;
  const second = displayed[1];
  const third = displayed[2];
  if (second == null || third == null || coefficient2 === 0) return null;
  const numerator = third - coefficient1 * second - constant;
  if (numerator % coefficient2 !== 0) return null;
  return numerator / coefficient2;
}

function addPreviousTwoCandidates(
  candidates: Map<string, MutableCandidate>,
  displayed: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): void {
  const secondStart = displayed[1];
  if (secondStart == null) return;
  for (let coefficient1 = -3; coefficient1 <= 3; coefficient1 += 1) {
    for (let coefficient2 = -3; coefficient2 <= 3; coefficient2 += 1) {
      if (coefficient2 === 0) continue;
      for (let constant = -8; constant <= 8; constant += 1) {
        const firstStart = derivePreviousTwoStart0(
          displayed,
          coefficient1,
          coefficient2,
          constant,
        );
        if (firstStart == null || !Number.isSafeInteger(firstStart)) continue;
        const projected = projectPreviousTwo(
          firstStart,
          secondStart,
          coefficient1,
          coefficient2,
          constant,
          displayed.length,
        );
        addCandidate(
          candidates,
          displayed,
          allowedMismatchCount,
          "LINEAR_STATEFUL_RECURRENCE",
          `start0=${firstStart};start1=${secondStart};a=${coefficient1};b=${coefficient2};c=${constant}`,
          projected,
        );
      }
    }
  }
}

function derivePreviousThreeStart0(
  displayed: readonly (number | null)[],
  coefficient1: number,
  coefficient2: number,
  coefficient3: number,
): number | null {
  const first = displayed[0];
  if (first != null) return first;
  const second = displayed[1];
  const third = displayed[2];
  const fourth = displayed[3];
  if (second == null || third == null || fourth == null || coefficient3 === 0) {
    return null;
  }
  const numerator = fourth - coefficient1 * third - coefficient2 * second;
  if (numerator % coefficient3 !== 0) return null;
  return numerator / coefficient3;
}

function addPreviousThreeCandidates(
  candidates: Map<string, MutableCandidate>,
  displayed: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): void {
  const secondStart = displayed[1];
  const thirdStart = displayed[2];
  if (secondStart == null || thirdStart == null) return;
  for (let coefficient1 = -2; coefficient1 <= 2; coefficient1 += 1) {
    for (let coefficient2 = -2; coefficient2 <= 2; coefficient2 += 1) {
      for (let coefficient3 = -2; coefficient3 <= 2; coefficient3 += 1) {
        if (coefficient3 === 0) continue;
        const firstStart = derivePreviousThreeStart0(
          displayed,
          coefficient1,
          coefficient2,
          coefficient3,
        );
        if (firstStart == null || !Number.isSafeInteger(firstStart)) continue;
        const projected = projectPreviousThree(
          firstStart,
          secondStart,
          thirdStart,
          coefficient1,
          coefficient2,
          coefficient3,
          displayed.length,
        );
        addCandidate(
          candidates,
          displayed,
          allowedMismatchCount,
          "LINEAR_STATEFUL_RECURRENCE",
          `start0=${firstStart};start1=${secondStart};start2=${thirdStart};a=${coefficient1};b=${coefficient2};c=${coefficient3}`,
          projected,
        );
      }
    }
  }
}

function inferCandidates(
  displayed: readonly (number | null)[],
  allowedMismatchCount: 0 | 1,
): Candidate[] {
  const candidates = new Map<string, MutableCandidate>();
  addFiniteDifferenceCandidates(candidates, displayed, allowedMismatchCount);
  addPreviousTwoCandidates(candidates, displayed, allowedMismatchCount);
  addPreviousThreeCandidates(candidates, displayed, allowedMismatchCount);
  return [...candidates.values()].map((candidate) => ({
    canonicalAuthorityId: candidate.canonicalAuthorityId,
    projected: candidate.projected,
    mismatches: candidate.mismatches,
    parameterKeys: [...candidate.parameterKeys].sort(),
  }));
}

export function solveSerNumericWaveB1Sequence(
  taskKind: SerNumericWaveB1TaskKind,
  sequence: readonly (number | null)[],
): SerNumericWaveB1IndependentSolution {
  if (sequence.length < 8) {
    throw new Error("Wave B1 requires at least eight displayed positions");
  }
  const missingIndexes = sequence
    .map((value, index) => (value == null ? index : -1))
    .filter((index) => index >= 0);
  if (taskKind === "WRONG_TERM" && missingIndexes.length !== 0) {
    throw new Error("Wave B1 wrong-term sequences cannot contain a blank");
  }
  if (taskKind !== "WRONG_TERM" && missingIndexes.length !== 1) {
    throw new Error("Wave B1 completion sequences require exactly one blank");
  }

  const candidates = inferCandidates(
    sequence,
    taskKind === "WRONG_TERM" ? 1 : 0,
  );
  if (candidates.length !== 1) {
    throw new Error(
      `Wave B1 ambiguity rejection: expected one canonical authority, found ${candidates.length}: ${candidates.map((candidate) => candidate.canonicalAuthorityId + ":" + candidate.parameterKeys[0]).join(" || ")}`,
    );
  }
  const candidate = candidates[0]!;
  const targetIndex =
    taskKind === "WRONG_TERM" ? candidate.mismatches[0]! : missingIndexes[0]!;
  const correctReplacement = candidate.projected[targetIndex]!;
  const displayedAnswer = sequence[targetIndex];
  const answer = taskKind === "WRONG_TERM" ? displayedAnswer : correctReplacement;
  if (answer == null) throw new Error("Wave B1 independent solver found no answer");
  return {
    answer,
    canonicalAuthorityId: candidate.canonicalAuthorityId,
    parameterKeys: candidate.parameterKeys,
    targetIndex,
    correctReplacement,
    candidateCount: candidates.length,
  };
}
