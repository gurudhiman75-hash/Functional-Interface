/** Exact grouping authorities shared by the CP-011 executable discovery. */

export function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`);
}

export function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${label} must be a positive integer`);
}

export function factorialExact(value: number): bigint {
  assertNonNegativeInteger(value, "factorial argument");
  let result = 1n;
  for (let factor = 2; factor <= value; factor += 1) result *= BigInt(factor);
  return result;
}

export function powerExact(base: number, exponent: number): bigint {
  assertNonNegativeInteger(base, "power base");
  assertNonNegativeInteger(exponent, "power exponent");
  return BigInt(base) ** BigInt(exponent);
}

export function combinationOrZeroExact(total: number, selected: number): bigint {
  if (!Number.isInteger(total) || !Number.isInteger(selected) || total < 0 || selected < 0 || selected > total) return 0n;
  const reduced = Math.min(selected, total - selected);
  let numerator = 1n;
  let denominator = 1n;
  for (let index = 1; index <= reduced; index += 1) {
    numerator *= BigInt(total - reduced + index);
    denominator *= BigInt(index);
  }
  if (numerator % denominator !== 0n) throw new Error("combination division was not exact");
  return numerator / denominator;
}

export function combinationExact(total: number, selected: number): bigint {
  assertNonNegativeInteger(total, "combination total");
  assertNonNegativeInteger(selected, "combination selected");
  if (selected > total) throw new Error("combination selected cannot exceed total");
  return combinationOrZeroExact(total, selected);
}

export function exactDivide(numerator: bigint, denominator: bigint, label: string): bigint {
  if (denominator <= 0n || numerator % denominator !== 0n) throw new Error(`${label} division was not exact`);
  return numerator / denominator;
}

function validateGroupSizes(groupSizes: readonly number[]): number {
  if (groupSizes.length === 0) throw new Error("at least one group size is required");
  for (const size of groupSizes) assertPositiveInteger(size, "group size");
  return groupSizes.reduce((sum, size) => sum + size, 0);
}

export function countLabelledPrescribedGroupsExact(groupSizes: readonly number[]): bigint {
  const total = validateGroupSizes(groupSizes);
  const denominator = groupSizes.reduce((product, size) => product * factorialExact(size), 1n);
  return exactDivide(factorialExact(total), denominator, "labelled prescribed groups");
}

export function countUnlabelledPrescribedGroupsExact(groupSizes: readonly number[]): bigint {
  const labelled = countLabelledPrescribedGroupsExact(groupSizes);
  const multiplicities = new Map<number, number>();
  for (const size of groupSizes) multiplicities.set(size, (multiplicities.get(size) ?? 0) + 1);
  const divisor = [...multiplicities.values()].reduce((product, value) => product * factorialExact(value), 1n);
  return exactDivide(labelled, divisor, "unlabelled prescribed groups");
}

export function countUnnamedEqualGroupsExact(groupSize: number, groupCount: number): bigint {
  assertPositiveInteger(groupSize, "group size");
  assertPositiveInteger(groupCount, "group count");
  return countUnlabelledPrescribedGroupsExact(Array.from({ length: groupCount }, () => groupSize));
}

export function countUnnamedPairsExact(pairCount: number): bigint {
  assertPositiveInteger(pairCount, "pair count");
  return countUnnamedEqualGroupsExact(2, pairCount);
}

function equalGroupProfile(totalObjects: number, groupCount: number): { groupSize: number; sizes: number[] } {
  assertPositiveInteger(totalObjects, "total objects");
  assertPositiveInteger(groupCount, "group count");
  if (totalObjects < 2 || totalObjects % groupCount !== 0) throw new Error("equal groups require a divisible total of at least two");
  const groupSize = totalObjects / groupCount;
  return { groupSize, sizes: Array.from({ length: groupCount }, () => groupSize) };
}

export function countSpecifiedPairSameLabelledEqualGroupsExact(totalObjects: number, groupCount: number): bigint {
  const { groupSize, sizes } = equalGroupProfile(totalObjects, groupCount);
  const total = countLabelledPrescribedGroupsExact(sizes);
  return exactDivide(total * BigInt(groupSize - 1), BigInt(totalObjects - 1), "specified pair same labelled group");
}

export function countSpecifiedPairDifferentLabelledEqualGroupsExact(totalObjects: number, groupCount: number): bigint {
  const { sizes } = equalGroupProfile(totalObjects, groupCount);
  return countLabelledPrescribedGroupsExact(sizes) - countSpecifiedPairSameLabelledEqualGroupsExact(totalObjects, groupCount);
}

export function countSpecifiedPairSameUnlabelledEqualGroupsExact(totalObjects: number, groupCount: number): bigint {
  const { groupSize } = equalGroupProfile(totalObjects, groupCount);
  const total = countUnnamedEqualGroupsExact(groupSize, groupCount);
  return exactDivide(total * BigInt(groupSize - 1), BigInt(totalObjects - 1), "specified pair same unlabelled group");
}

export function countSpecifiedPairDifferentUnlabelledEqualGroupsExact(totalObjects: number, groupCount: number): bigint {
  const { groupSize } = equalGroupProfile(totalObjects, groupCount);
  return countUnnamedEqualGroupsExact(groupSize, groupCount) - countSpecifiedPairSameUnlabelledEqualGroupsExact(totalObjects, groupCount);
}

export function recoverUniqueIntegerParameter(
  minimum: number,
  maximum: number,
  target: bigint,
  evaluator: (candidate: number) => bigint,
): number {
  assertNonNegativeInteger(minimum, "minimum");
  assertNonNegativeInteger(maximum, "maximum");
  if (minimum > maximum) throw new Error("minimum cannot exceed maximum");
  const matches: number[] = [];
  for (let candidate = minimum; candidate <= maximum; candidate += 1) {
    if (evaluator(candidate) === target) matches.push(candidate);
  }
  if (matches.length !== 1) throw new Error(`expected one inverse match, found ${matches.length}`);
  return matches[0]!;
}
