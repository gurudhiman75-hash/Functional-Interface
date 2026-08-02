import type { ComparisonConstraint } from "./types";

class DisjointSet {
  private readonly parent = new Map<string, string>();

  add(value: string): void {
    if (!this.parent.has(value)) this.parent.set(value, value);
  }

  find(value: string): string {
    this.add(value);
    const parent = this.parent.get(value)!;
    if (parent === value) return value;
    const root = this.find(parent);
    this.parent.set(value, root);
    return root;
  }

  union(left: string, right: string): void {
    const leftRoot = this.find(left);
    const rightRoot = this.find(right);
    if (leftRoot === rightRoot) return;
    const [canonical, alias] = [leftRoot, rightRoot].sort();
    this.parent.set(alias!, canonical!);
  }
}

export interface EqualityComponents {
  canonicalIdByEntity: ReadonlyMap<string, string>;
  components: readonly (readonly string[])[];
}

export function buildEqualityComponents(
  constraints: readonly ComparisonConstraint[],
  extraEntityIds: readonly string[] = [],
): EqualityComponents {
  const disjointSet = new DisjointSet();
  for (const entityId of extraEntityIds) disjointSet.add(entityId);
  for (const constraint of constraints) {
    disjointSet.add(constraint.leftId);
    disjointSet.add(constraint.rightId);
    if (constraint.relation === "EQUAL_TO") {
      disjointSet.union(constraint.leftId, constraint.rightId);
    }
  }

  const entities = [
    ...new Set([
      ...extraEntityIds,
      ...constraints.flatMap((constraint) => [
        constraint.leftId,
        constraint.rightId,
      ]),
    ]),
  ].sort();
  const canonicalIdByEntity = new Map<string, string>();
  const membersByRoot = new Map<string, string[]>();

  for (const entityId of entities) {
    const root = disjointSet.find(entityId);
    canonicalIdByEntity.set(entityId, root);
    const members = membersByRoot.get(root) ?? [];
    members.push(entityId);
    membersByRoot.set(root, members);
  }

  const components = [...membersByRoot.values()]
    .map((members) => members.sort())
    .sort((left, right) => left[0]!.localeCompare(right[0]!));

  return { canonicalIdByEntity, components };
}
