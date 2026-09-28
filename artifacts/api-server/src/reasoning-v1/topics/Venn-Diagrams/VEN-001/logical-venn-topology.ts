export type VennSetId = "A" | "B" | "C";

export type VennPairRelation =
  | "DISJOINT"
  | "PARTIAL_OVERLAP"
  | "LEFT_SUBSET_RIGHT"
  | "RIGHT_SUBSET_LEFT"
  | "EQUAL";

export type VennThreeWayIntersection = "UNSPECIFIED" | "REQUIRED" | "FORBIDDEN";

export type VennRelationAssertion = Readonly<{
  left: VennSetId;
  right: VennSetId;
  relation: VennPairRelation;
}>;

export type VennTopologyWitness = Readonly<{
  setIds: readonly VennSetId[];
  membershipAtoms: readonly (readonly VennSetId[])[];
}>;

const SET_ORDER: readonly VennSetId[] = ["A", "B", "C"];

function validateSetIds(setIds: readonly VennSetId[]): void {
  if (setIds.length < 2 || setIds.length > 3) {
    throw new Error("VEN-001 topologies require two or three labeled sets");
  }
  if (new Set(setIds).size !== setIds.length) {
    throw new Error("VEN-001 set labels must be unique");
  }
  if (setIds.some((setId) => !SET_ORDER.includes(setId))) {
    throw new Error("VEN-001 supports set labels A, B and C");
  }
}

function atomMasks(setCount: number): number[] {
  return Array.from({ length: (1 << setCount) - 1 }, (_, index) => index + 1);
}

function decodeOccupancy(
  occupancy: number,
  setIds: readonly VennSetId[],
): VennTopologyWitness["membershipAtoms"] {
  return atomMasks(setIds.length)
    .filter((_, atomIndex) => (occupancy & (1 << atomIndex)) !== 0)
    .map((atomMask) =>
      setIds.filter((_, setIndex) => (atomMask & (1 << setIndex)) !== 0),
    );
}

function relationFromAtoms(
  atoms: readonly (readonly VennSetId[])[],
  left: VennSetId,
  right: VennSetId,
): VennPairRelation {
  let leftOnly = false;
  let rightOnly = false;
  let intersection = false;

  for (const atom of atoms) {
    const hasLeft = atom.includes(left);
    const hasRight = atom.includes(right);
    if (hasLeft && hasRight) intersection = true;
    else if (hasLeft) leftOnly = true;
    else if (hasRight) rightOnly = true;
  }

  if (!intersection) return "DISJOINT";
  if (!leftOnly && !rightOnly) return "EQUAL";
  if (!leftOnly) return "LEFT_SUBSET_RIGHT";
  if (!rightOnly) return "RIGHT_SUBSET_LEFT";
  return "PARTIAL_OVERLAP";
}

function requiredPairs(setIds: readonly VennSetId[]): Set<string> {
  const pairs = new Set<string>();
  for (let left = 0; left < setIds.length; left += 1) {
    for (let right = left + 1; right < setIds.length; right += 1) {
      pairs.add([setIds[left], setIds[right]].sort().join(":"));
    }
  }
  return pairs;
}

function validateAssertions(
  setIds: readonly VennSetId[],
  relations: readonly VennRelationAssertion[],
): void {
  const expected = requiredPairs(setIds);
  const seen = new Set<string>();

  for (const assertion of relations) {
    if (assertion.left === assertion.right) {
      throw new Error("VEN-001 relation assertions must compare different sets");
    }
    if (!setIds.includes(assertion.left) || !setIds.includes(assertion.right)) {
      throw new Error("VEN-001 relation assertion refers to an unknown set");
    }
    const pair = [assertion.left, assertion.right].sort().join(":");
    if (seen.has(pair)) throw new Error(`VEN-001 relation for ${pair} is repeated`);
    seen.add(pair);
  }

  if (seen.size !== expected.size || [...expected].some((pair) => !seen.has(pair))) {
    throw new Error("VEN-001 requires exactly one relation for every pair of sets");
  }
}

export function findVennTopologyWitness(
  setIds: readonly VennSetId[],
  relations: readonly VennRelationAssertion[],
  threeWayIntersection: VennThreeWayIntersection = "UNSPECIFIED",
): VennTopologyWitness | null {
  validateSetIds(setIds);
  validateAssertions(setIds, relations);
  if (setIds.length === 2 && threeWayIntersection !== "UNSPECIFIED") {
    throw new Error("VEN-001 three-way intersection constraints require three sets");
  }

  const candidateCount = 1 << atomMasks(setIds.length).length;
  for (let occupancy = 1; occupancy < candidateCount; occupancy += 1) {
    const membershipAtoms = decodeOccupancy(occupancy, setIds);
    if (setIds.some((setId) => !membershipAtoms.some((atom) => atom.includes(setId)))) {
      continue;
    }

    const matchesRelations = relations.every((assertion) =>
      relationFromAtoms(membershipAtoms, assertion.left, assertion.right) === assertion.relation,
    );
    const hasThreeWayIntersection = setIds.length === 3 && membershipAtoms.some((atom) =>
      setIds.every((setId) => atom.includes(setId)),
    );
    const matchesIntersection = threeWayIntersection === "UNSPECIFIED"
      || (threeWayIntersection === "REQUIRED" && hasThreeWayIntersection)
      || (threeWayIntersection === "FORBIDDEN" && !hasThreeWayIntersection);
    if (matchesRelations && matchesIntersection) return { setIds: [...setIds], membershipAtoms };
  }
  return null;
}

export function validateVennTopology(
  setIds: readonly VennSetId[],
  relations: readonly VennRelationAssertion[],
  threeWayIntersection: VennThreeWayIntersection = "UNSPECIFIED",
): VennTopologyWitness {
  const witness = findVennTopologyWitness(setIds, relations, threeWayIntersection);
  if (!witness) {
    throw new Error("VEN-001 relation signature or three-way intersection constraint is inconsistent, or a set is empty");
  }
  return witness;
}

export function relationForPair(
  witness: VennTopologyWitness,
  left: VennSetId,
  right: VennSetId,
): VennPairRelation {
  if (!witness.setIds.includes(left) || !witness.setIds.includes(right) || left === right) {
    throw new Error("VEN-001 pair lookup must use two different labels in the witness");
  }
  return relationFromAtoms(witness.membershipAtoms, left, right);
}
