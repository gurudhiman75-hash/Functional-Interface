/**
 * PNC-CP-011 executable discovery prototype.
 *
 * No permanent QL IDs are allocated here. The module proves provisional
 * grouping/distribution authorities against independent small-state enumeration.
 */
import {
  countLabelledPrescribedGroupsExact,
  countSpecifiedPairDifferentLabelledEqualGroupsExact,
  countSpecifiedPairDifferentUnlabelledEqualGroupsExact,
  countSpecifiedPairSameLabelledEqualGroupsExact,
  countSpecifiedPairSameUnlabelledEqualGroupsExact,
  countUnlabelledPrescribedGroupsExact,
  countUnnamedEqualGroupsExact,
  recoverUniqueIntegerParameter,
} from "./cp011-discovery-core";
import {
  bellNumberExact,
  countDistinctExactOccupanciesExact,
  countDistinctSpecifiedBoxExactExact,
  countDistinctSpecifiedBoxExactOthersNonEmptyExact,
  countDistinctToAtMostIdenticalBoxesExact,
  countDistinctToIdenticalBoxesExact,
  countDistinctToLabelledBoxesAtLeastOneEmptyExact,
  countDistinctToLabelledBoxesExactlyKNonEmptyExact,
  countDistinctToLabelledBoxesExact,
  countDistinctToLabelledBoxesNonEmptyExact,
  countIdenticalAllNonEmptySpecifiedRecipientAtLeastExact,
  countIdenticalSpecifiedRecipientAtLeastExact,
  countIdenticalToAtMostIdenticalBoxesExact,
  countIdenticalToIdenticalBoxesExact,
  countIdenticalToLabelledBoxesAtLeastOneEmptyExact,
  countIdenticalToLabelledBoxesExactlyKNonEmptyExact,
  countIdenticalToLabelledBoxesExact,
  countIdenticalToLabelledBoxesNonEmptyExact,
  countIdenticalToLabelledBoxesWithMinimumExact,
  countIdenticalToLabelledBoxesWithUniformCapacityExact,
} from "./cp011-discovery-distribution";
import {
  enumerateIdenticalAllocations,
  enumerateIdenticalPartitionsExact,
  enumerateLabelledAssignments,
  enumerateUnlabelledSetPartitions,
} from "./cp011-discovery-enumerators";

export type Cp011DiscoveryFamily =
  | "DISTINCT_TO_PRESCRIBED_GROUPS"
  | "DISTINCT_TO_LABELLED_BOXES"
  | "DISTINCT_TO_IDENTICAL_BOXES"
  | "IDENTICAL_TO_LABELLED_BOXES"
  | "IDENTICAL_TO_IDENTICAL_BOXES"
  | "GROUP_RELATION_RESTRICTION"
  | "BOUNDED_INVERSE";

export interface Cp011PrototypeCheck {
  readonly id: string;
  readonly family: Cp011DiscoveryFamily;
  readonly formula: bigint;
  readonly independent: bigint;
}

export function buildCp011PrototypeChecks(): readonly Cp011PrototypeCheck[] {
  const checks: Cp011PrototypeCheck[] = [];
  const add = (id: string, family: Cp011DiscoveryFamily, formula: bigint, independent: bigint): void => {
    checks.push({ id, family, formula, independent });
  };

  const prescribedCases: readonly (readonly number[])[] = [[4, 3], [3, 3], [2, 2, 2], [3, 3, 2, 2]];
  for (const sizes of prescribedCases) {
    const total = sizes.reduce((sum, size) => sum + size, 0);
    add(
      `labelled-${sizes.join("-")}`,
      "DISTINCT_TO_PRESCRIBED_GROUPS",
      countLabelledPrescribedGroupsExact(sizes),
      enumerateLabelledAssignments(total, sizes.length, (occupancies) => occupancies.every((value, index) => value === sizes[index])),
    );
    const targetSizes = [...sizes].sort((left, right) => left - right).join(",");
    add(
      `unlabelled-${sizes.join("-")}`,
      "DISTINCT_TO_PRESCRIBED_GROUPS",
      countUnlabelledPrescribedGroupsExact(sizes),
      enumerateUnlabelledSetPartitions(total, (groups) => (
        groups.map((group) => group.length).sort((left, right) => left - right).join(",") === targetSizes
      )),
    );
  }

  add("distinct-labelled-unrestricted-4-3", "DISTINCT_TO_LABELLED_BOXES",
    countDistinctToLabelledBoxesExact(4, 3), enumerateLabelledAssignments(4, 3, () => true));
  add("distinct-labelled-nonempty-5-3", "DISTINCT_TO_LABELLED_BOXES",
    countDistinctToLabelledBoxesNonEmptyExact(5, 3),
    enumerateLabelledAssignments(5, 3, (occupancies) => occupancies.every((value) => value > 0)));
  add("distinct-labelled-exactly-two-nonempty-5-3", "DISTINCT_TO_LABELLED_BOXES",
    countDistinctToLabelledBoxesExactlyKNonEmptyExact(5, 3, 2),
    enumerateLabelledAssignments(5, 3, (occupancies) => occupancies.filter((value) => value > 0).length === 2));
  add("distinct-labelled-at-least-one-empty-5-3", "DISTINCT_TO_LABELLED_BOXES",
    countDistinctToLabelledBoxesAtLeastOneEmptyExact(5, 3),
    enumerateLabelledAssignments(5, 3, (occupancies) => occupancies.some((value) => value === 0)));
  add("distinct-labelled-occupancy-2-1-1", "DISTINCT_TO_LABELLED_BOXES",
    countDistinctExactOccupanciesExact([2, 1, 1]),
    enumerateLabelledAssignments(4, 3, (occupancies) => occupancies.join(",") === "2,1,1"));
  add("distinct-specified-box-exact-2", "DISTINCT_TO_LABELLED_BOXES",
    countDistinctSpecifiedBoxExactExact(5, 3, 2),
    enumerateLabelledAssignments(5, 3, (occupancies) => occupancies[0] === 2));
  add("distinct-specified-box-exact-2-others-nonempty", "DISTINCT_TO_LABELLED_BOXES",
    countDistinctSpecifiedBoxExactOthersNonEmptyExact(5, 3, 2),
    enumerateLabelledAssignments(5, 3, (occupancies) => (
      occupancies[0] === 2 && occupancies.slice(1).every((value) => value > 0)
    )));

  add("distinct-identical-exact-5-3", "DISTINCT_TO_IDENTICAL_BOXES",
    countDistinctToIdenticalBoxesExact(5, 3),
    enumerateUnlabelledSetPartitions(5, (groups) => groups.length === 3));
  add("distinct-identical-at-most-5-3", "DISTINCT_TO_IDENTICAL_BOXES",
    countDistinctToAtMostIdenticalBoxesExact(5, 3),
    enumerateUnlabelledSetPartitions(5, (groups) => groups.length <= 3));
  add("distinct-identical-any-5", "DISTINCT_TO_IDENTICAL_BOXES",
    bellNumberExact(5), enumerateUnlabelledSetPartitions(5, () => true));

  add("identical-labelled-unrestricted-6-3", "IDENTICAL_TO_LABELLED_BOXES",
    countIdenticalToLabelledBoxesExact(6, 3), enumerateIdenticalAllocations(6, 3, () => true));
  add("identical-labelled-nonempty-6-3", "IDENTICAL_TO_LABELLED_BOXES",
    countIdenticalToLabelledBoxesNonEmptyExact(6, 3),
    enumerateIdenticalAllocations(6, 3, (occupancies) => occupancies.every((value) => value > 0)));
  add("identical-labelled-exactly-two-nonempty-6-3", "IDENTICAL_TO_LABELLED_BOXES",
    countIdenticalToLabelledBoxesExactlyKNonEmptyExact(6, 3, 2),
    enumerateIdenticalAllocations(6, 3, (occupancies) => occupancies.filter((value) => value > 0).length === 2));
  add("identical-labelled-at-least-one-empty-6-3", "IDENTICAL_TO_LABELLED_BOXES",
    countIdenticalToLabelledBoxesAtLeastOneEmptyExact(6, 3),
    enumerateIdenticalAllocations(6, 3, (occupancies) => occupancies.some((value) => value === 0)));
  add("identical-labelled-minimum-8-3-2", "IDENTICAL_TO_LABELLED_BOXES",
    countIdenticalToLabelledBoxesWithMinimumExact(8, 3, 2),
    enumerateIdenticalAllocations(8, 3, (occupancies) => occupancies.every((value) => value >= 2)));
  add("identical-specified-at-least-7-3-3", "IDENTICAL_TO_LABELLED_BOXES",
    countIdenticalSpecifiedRecipientAtLeastExact(7, 3, 3),
    enumerateIdenticalAllocations(7, 3, (occupancies) => occupancies[0]! >= 3));
  add("identical-all-nonempty-specified-at-least-7-3-3", "IDENTICAL_TO_LABELLED_BOXES",
    countIdenticalAllNonEmptySpecifiedRecipientAtLeastExact(7, 3, 3),
    enumerateIdenticalAllocations(7, 3, (occupancies) => (
      occupancies[0]! >= 3 && occupancies.every((value) => value > 0)
    )));
  add("identical-labelled-capacity-6-3-3", "IDENTICAL_TO_LABELLED_BOXES",
    countIdenticalToLabelledBoxesWithUniformCapacityExact(6, 3, 3),
    enumerateIdenticalAllocations(6, 3, (occupancies) => occupancies.every((value) => value <= 3)));

  add("identical-identical-exact-7-3", "IDENTICAL_TO_IDENTICAL_BOXES",
    countIdenticalToIdenticalBoxesExact(7, 3), enumerateIdenticalPartitionsExact(7, 3));
  add("identical-identical-at-most-7-3", "IDENTICAL_TO_IDENTICAL_BOXES",
    countIdenticalToAtMostIdenticalBoxesExact(7, 3),
    [1, 2, 3].reduce((sum, parts) => sum + enumerateIdenticalPartitionsExact(7, parts), 0n));

  add("specified-pair-same-labelled-8-2", "GROUP_RELATION_RESTRICTION",
    countSpecifiedPairSameLabelledEqualGroupsExact(8, 2),
    enumerateLabelledAssignments(8, 2, (occupancies, assignment) => (
      occupancies[0] === 4 && occupancies[1] === 4 && assignment[0] === assignment[1]
    )));
  add("specified-pair-different-labelled-8-2", "GROUP_RELATION_RESTRICTION",
    countSpecifiedPairDifferentLabelledEqualGroupsExact(8, 2),
    enumerateLabelledAssignments(8, 2, (occupancies, assignment) => (
      occupancies[0] === 4 && occupancies[1] === 4 && assignment[0] !== assignment[1]
    )));
  add("specified-pair-same-unlabelled-8-2", "GROUP_RELATION_RESTRICTION",
    countSpecifiedPairSameUnlabelledEqualGroupsExact(8, 2),
    enumerateUnlabelledSetPartitions(8, (groups) => (
      groups.length === 2 && groups.every((group) => group.length === 4)
      && groups.some((group) => group.includes(0) && group.includes(1))
    )));
  add("specified-pair-different-unlabelled-8-2", "GROUP_RELATION_RESTRICTION",
    countSpecifiedPairDifferentUnlabelledEqualGroupsExact(8, 2),
    enumerateUnlabelledSetPartitions(8, (groups) => (
      groups.length === 2 && groups.every((group) => group.length === 4)
      && !groups.some((group) => group.includes(0) && group.includes(1))
    )));

  const inverseGroupTarget = countUnnamedEqualGroupsExact(3, 2);
  add("inverse-equal-group-count", "BOUNDED_INVERSE",
    BigInt(recoverUniqueIntegerParameter(2, 4, inverseGroupTarget, (candidate) => countUnnamedEqualGroupsExact(3, candidate))), 2n);
  const inverseLabelledBoxTarget = countDistinctToLabelledBoxesExact(4, 3);
  add("inverse-labelled-box-count", "BOUNDED_INVERSE",
    BigInt(recoverUniqueIntegerParameter(2, 5, inverseLabelledBoxTarget, (candidate) => countDistinctToLabelledBoxesExact(4, candidate))), 3n);
  const inverseRecipientTarget = countIdenticalToLabelledBoxesExact(6, 3);
  add("inverse-recipient-count", "BOUNDED_INVERSE",
    BigInt(recoverUniqueIntegerParameter(2, 6, inverseRecipientTarget, (candidate) => countIdenticalToLabelledBoxesExact(6, candidate))), 3n);

  return checks;
}
