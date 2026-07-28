/** Exact occupancy and distribution authorities for CP-011 discovery. */
import {
  assertNonNegativeInteger,
  assertPositiveInteger,
  combinationExact,
  combinationOrZeroExact,
  exactDivide,
  factorialExact,
  powerExact,
} from "./cp011-discovery-core";

export function countDistinctToLabelledBoxesExact(objectCount: number, boxCount: number): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  return powerExact(boxCount, objectCount);
}

export function stirlingSecondKindExact(objectCount: number, boxCount: number): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertNonNegativeInteger(boxCount, "box count");
  if (objectCount === 0) return boxCount === 0 ? 1n : 0n;
  if (boxCount === 0 || boxCount > objectCount) return 0n;
  const table: bigint[][] = Array.from({ length: objectCount + 1 }, () => Array(boxCount + 1).fill(0n));
  table[0]![0] = 1n;
  for (let n = 1; n <= objectCount; n += 1) {
    for (let k = 1; k <= Math.min(n, boxCount); k += 1) {
      table[n]![k] = table[n - 1]![k - 1]! + BigInt(k) * table[n - 1]![k]!;
    }
  }
  return table[objectCount]![boxCount]!;
}

export function countDistinctToLabelledBoxesNonEmptyExact(objectCount: number, boxCount: number): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  return objectCount < boxCount ? 0n : factorialExact(boxCount) * stirlingSecondKindExact(objectCount, boxCount);
}

export function countDistinctToLabelledBoxesExactlyKNonEmptyExact(
  objectCount: number,
  boxCount: number,
  nonEmptyBoxCount: number,
): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  assertNonNegativeInteger(nonEmptyBoxCount, "non-empty box count");
  if (nonEmptyBoxCount > boxCount || nonEmptyBoxCount > objectCount) return 0n;
  if (objectCount === 0) return nonEmptyBoxCount === 0 ? 1n : 0n;
  return combinationExact(boxCount, nonEmptyBoxCount)
    * factorialExact(nonEmptyBoxCount)
    * stirlingSecondKindExact(objectCount, nonEmptyBoxCount);
}

export function countDistinctToLabelledBoxesAtLeastOneEmptyExact(objectCount: number, boxCount: number): bigint {
  return countDistinctToLabelledBoxesExact(objectCount, boxCount)
    - countDistinctToLabelledBoxesNonEmptyExact(objectCount, boxCount);
}

export function countDistinctToIdenticalBoxesExact(objectCount: number, nonEmptyBoxCount: number): bigint {
  return stirlingSecondKindExact(objectCount, nonEmptyBoxCount);
}

export function countDistinctToAtMostIdenticalBoxesExact(objectCount: number, maximumNonEmptyBoxes: number): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertNonNegativeInteger(maximumNonEmptyBoxes, "maximum non-empty boxes");
  let total = 0n;
  for (let used = 0; used <= Math.min(objectCount, maximumNonEmptyBoxes); used += 1) total += stirlingSecondKindExact(objectCount, used);
  return total;
}

export function bellNumberExact(objectCount: number): bigint {
  return countDistinctToAtMostIdenticalBoxesExact(objectCount, objectCount);
}

export function countDistinctExactOccupanciesExact(occupancies: readonly number[]): bigint {
  if (occupancies.length === 0) throw new Error("at least one occupancy is required");
  for (const occupancy of occupancies) assertNonNegativeInteger(occupancy, "occupancy");
  const total = occupancies.reduce((sum, value) => sum + value, 0);
  const denominator = occupancies.reduce((product, value) => product * factorialExact(value), 1n);
  return exactDivide(factorialExact(total), denominator, "exact occupancies");
}

export function countDistinctSpecifiedBoxExactExact(objectCount: number, boxCount: number, specifiedOccupancy: number): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  assertNonNegativeInteger(specifiedOccupancy, "specified occupancy");
  if (specifiedOccupancy > objectCount) return 0n;
  if (boxCount === 1) return specifiedOccupancy === objectCount ? 1n : 0n;
  return combinationExact(objectCount, specifiedOccupancy) * powerExact(boxCount - 1, objectCount - specifiedOccupancy);
}

export function countDistinctSpecifiedBoxExactOthersNonEmptyExact(
  objectCount: number,
  boxCount: number,
  specifiedOccupancy: number,
): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  assertNonNegativeInteger(specifiedOccupancy, "specified occupancy");
  if (specifiedOccupancy === 0 || specifiedOccupancy > objectCount) return 0n;
  const remainingObjects = objectCount - specifiedOccupancy;
  const remainingBoxes = boxCount - 1;
  if (remainingBoxes === 0) return remainingObjects === 0 ? 1n : 0n;
  return combinationExact(objectCount, specifiedOccupancy)
    * countDistinctToLabelledBoxesNonEmptyExact(remainingObjects, remainingBoxes);
}

export function countIdenticalToLabelledBoxesExact(objectCount: number, boxCount: number): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  return combinationExact(objectCount + boxCount - 1, boxCount - 1);
}

export function countIdenticalToLabelledBoxesNonEmptyExact(objectCount: number, boxCount: number): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  return objectCount < boxCount ? 0n : combinationExact(objectCount - 1, boxCount - 1);
}

export function countIdenticalToLabelledBoxesExactlyKNonEmptyExact(
  objectCount: number,
  boxCount: number,
  nonEmptyBoxCount: number,
): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  assertNonNegativeInteger(nonEmptyBoxCount, "non-empty box count");
  if (nonEmptyBoxCount > boxCount || nonEmptyBoxCount > objectCount) return 0n;
  if (objectCount === 0) return nonEmptyBoxCount === 0 ? 1n : 0n;
  if (nonEmptyBoxCount === 0) return 0n;
  return combinationExact(boxCount, nonEmptyBoxCount) * combinationExact(objectCount - 1, nonEmptyBoxCount - 1);
}

export function countIdenticalToLabelledBoxesAtLeastOneEmptyExact(objectCount: number, boxCount: number): bigint {
  return countIdenticalToLabelledBoxesExact(objectCount, boxCount)
    - countIdenticalToLabelledBoxesNonEmptyExact(objectCount, boxCount);
}

export function countIdenticalToLabelledBoxesWithMinimumExact(
  objectCount: number,
  boxCount: number,
  minimumPerBox: number,
): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  assertNonNegativeInteger(minimumPerBox, "minimum per box");
  const residual = objectCount - boxCount * minimumPerBox;
  return residual < 0 ? 0n : combinationExact(residual + boxCount - 1, boxCount - 1);
}

export function countIdenticalSpecifiedRecipientAtLeastExact(
  objectCount: number,
  recipientCount: number,
  specifiedMinimum: number,
): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(recipientCount, "recipient count");
  assertNonNegativeInteger(specifiedMinimum, "specified minimum");
  return objectCount < specifiedMinimum
    ? 0n
    : combinationExact(objectCount - specifiedMinimum + recipientCount - 1, recipientCount - 1);
}

export function countIdenticalAllNonEmptySpecifiedRecipientAtLeastExact(
  objectCount: number,
  recipientCount: number,
  specifiedMinimum: number,
): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(recipientCount, "recipient count");
  assertPositiveInteger(specifiedMinimum, "specified minimum");
  return objectCount < specifiedMinimum + recipientCount - 1
    ? 0n
    : combinationExact(objectCount - specifiedMinimum, recipientCount - 1);
}

export function countIdenticalToLabelledBoxesWithUniformCapacityExact(
  objectCount: number,
  boxCount: number,
  capacity: number,
): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  assertNonNegativeInteger(capacity, "capacity");
  let total = 0n;
  for (let excluded = 0; excluded <= boxCount; excluded += 1) {
    const residual = objectCount - excluded * (capacity + 1);
    const term = combinationExact(boxCount, excluded)
      * combinationOrZeroExact(residual + boxCount - 1, boxCount - 1);
    total += excluded % 2 === 0 ? term : -term;
  }
  return total;
}

const partitionMemo = new Map<string, bigint>();
export function countIdenticalToIdenticalBoxesExact(objectCount: number, nonEmptyBoxCount: number): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertNonNegativeInteger(nonEmptyBoxCount, "non-empty box count");
  const key = `${objectCount}|${nonEmptyBoxCount}`;
  const cached = partitionMemo.get(key);
  if (cached !== undefined) return cached;
  let result: bigint;
  if (objectCount === 0 && nonEmptyBoxCount === 0) result = 1n;
  else if (objectCount <= 0 || nonEmptyBoxCount <= 0 || nonEmptyBoxCount > objectCount) result = 0n;
  else result = countIdenticalToIdenticalBoxesExact(objectCount - 1, nonEmptyBoxCount - 1)
    + countIdenticalToIdenticalBoxesExact(objectCount - nonEmptyBoxCount, nonEmptyBoxCount);
  partitionMemo.set(key, result);
  return result;
}

export function countIdenticalToAtMostIdenticalBoxesExact(objectCount: number, maximumNonEmptyBoxes: number): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertNonNegativeInteger(maximumNonEmptyBoxes, "maximum non-empty boxes");
  let total = 0n;
  for (let used = 0; used <= Math.min(objectCount, maximumNonEmptyBoxes); used += 1) total += countIdenticalToIdenticalBoxesExact(objectCount, used);
  return total;
}
