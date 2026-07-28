/** Independent small-state enumeration used only by CP-011 proof checks. */
import { assertNonNegativeInteger, assertPositiveInteger } from "./cp011-discovery-core";

export function enumerateLabelledAssignments(
  objectCount: number,
  boxCount: number,
  predicate: (occupancies: readonly number[], assignment: readonly number[]) => boolean,
): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  const occupancies = Array(boxCount).fill(0) as number[];
  const assignment = Array(objectCount).fill(0) as number[];
  let count = 0n;
  const visit = (index: number): void => {
    if (index === objectCount) {
      if (predicate(occupancies, assignment)) count += 1n;
      return;
    }
    for (let box = 0; box < boxCount; box += 1) {
      assignment[index] = box;
      occupancies[box]! += 1;
      visit(index + 1);
      occupancies[box]! -= 1;
    }
  };
  visit(0);
  return count;
}

export function enumerateUnlabelledSetPartitions(
  objectCount: number,
  predicate: (groups: readonly (readonly number[])[]) => boolean,
): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  if (objectCount === 0) return predicate([]) ? 1n : 0n;
  const labels = Array(objectCount).fill(0) as number[];
  let count = 0n;
  const visit = (index: number, maximumLabel: number): void => {
    if (index === objectCount) {
      const groups: number[][] = Array.from({ length: maximumLabel + 1 }, () => []);
      for (let object = 0; object < objectCount; object += 1) groups[labels[object]!]!.push(object);
      if (predicate(groups)) count += 1n;
      return;
    }
    for (let label = 0; label <= maximumLabel + 1; label += 1) {
      labels[index] = label;
      visit(index + 1, Math.max(maximumLabel, label));
    }
  };
  labels[0] = 0;
  visit(1, 0);
  return count;
}

export function enumerateIdenticalAllocations(
  objectCount: number,
  boxCount: number,
  predicate: (occupancies: readonly number[]) => boolean,
): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertPositiveInteger(boxCount, "box count");
  const occupancies = Array(boxCount).fill(0) as number[];
  let count = 0n;
  const visit = (box: number, remaining: number): void => {
    if (box === boxCount - 1) {
      occupancies[box] = remaining;
      if (predicate(occupancies)) count += 1n;
      return;
    }
    for (let value = 0; value <= remaining; value += 1) {
      occupancies[box] = value;
      visit(box + 1, remaining - value);
    }
  };
  visit(0, objectCount);
  return count;
}

export function enumerateIdenticalPartitionsExact(objectCount: number, nonEmptyBoxCount: number): bigint {
  assertNonNegativeInteger(objectCount, "object count");
  assertNonNegativeInteger(nonEmptyBoxCount, "non-empty box count");
  let count = 0n;
  const visit = (remaining: number, partsLeft: number, minimumPart: number): void => {
    if (partsLeft === 0) {
      if (remaining === 0) count += 1n;
      return;
    }
    const maximumPart = Math.floor(remaining / partsLeft);
    for (let value = minimumPart; value <= maximumPart; value += 1) visit(remaining - value, partsLeft - 1, value);
  };
  visit(objectCount, nonEmptyBoxCount, 1);
  return count;
}
