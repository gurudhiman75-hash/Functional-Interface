export const RNK_CP007_PARTIAL_ORDER_POSITION_ADAPTER_VERSION =
  "RNK_CP007_PARTIAL_ORDER_POSITION_ADAPTER_V1" as const;

/**
 * Query adapter for the inverse surface of exact-rank determinacy.
 *
 * The state may admit several valid strict total orders. A position is
 * invariant only when the same entity occupies that rank in every order.
 * This is the inverse learner surface of the same exact-rank invariance
 * proof contract already owned by RNK-QL-038.
 */
export function invariantEntityAtRank(
  validOrders: readonly (readonly string[])[],
  rankFromTop: number,
): string | undefined {
  if (validOrders.length < 2) {
    throw new Error("Partial-order position adapter requires at least two valid orders");
  }
  const entityCount = validOrders[0]?.length ?? 0;
  if (entityCount === 0 || rankFromTop < 1 || rankFromTop > entityCount) {
    throw new Error(`Invalid rank ${rankFromTop} for ${entityCount} entities`);
  }
  for (const order of validOrders) {
    if (order.length !== entityCount || new Set(order).size !== entityCount) {
      throw new Error("Every valid order must be a complete strict permutation");
    }
  }

  const occupant = validOrders[0]![rankFromTop - 1];
  return validOrders.every((order) => order[rankFromTop - 1] === occupant)
    ? occupant
    : undefined;
}

export function exactRankSet(
  validOrders: readonly (readonly string[])[],
  entity: string,
): readonly number[] {
  const ranks = new Set<number>();
  for (const order of validOrders) {
    const index = order.indexOf(entity);
    if (index < 0) throw new Error(`Entity ${entity} is missing from a valid order`);
    ranks.add(index + 1);
  }
  return [...ranks].sort((a, b) => a - b);
}

export function inverseExactRankContractHolds(
  validOrders: readonly (readonly string[])[],
  rankFromTop: number,
  entity: string,
): boolean {
  const occupant = invariantEntityAtRank(validOrders, rankFromTop);
  const ranks = exactRankSet(validOrders, entity);
  return occupant === entity && ranks.length === 1 && ranks[0] === rankFromTop;
}
