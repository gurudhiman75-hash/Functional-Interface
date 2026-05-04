export function randomInt(
  min: number,
  max: number,
) {
  return Math.floor(
    Math.random() * (max - min + 1),
  ) + min;
}

export function pickRandomTemplate(
  templateVariants: string[],
): string {
  if (!templateVariants?.length) {
    throw new Error(
      "No template variants provided",
    );
  }

  const idx = Math.floor(
    Math.random() * templateVariants.length,
  );

  return templateVariants[idx]!;
}

export function pickRandomItem<T>(
  items: T[],
): T {
  if (!items.length) {
    throw new Error(
      "Expected at least one item",
    );
  }

  return items[
    randomInt(0, items.length - 1)
  ]!;
}

export function pickWeightedItem<T>(
  items: T[],
  getWeight: (
    item: T,
  ) => number | undefined,
): T {
  if (!items.length) {
    throw new Error(
      "Expected at least one item",
    );
  }

  const weighted = items.map((item) => ({
    item,
    weight: Math.max(
      0.1,
      getWeight(item) ?? 1,
    ),
  }));
  const totalWeight = weighted.reduce(
    (sum, entry) => sum + entry.weight,
    0,
  );
  let roll = Math.random() * totalWeight;

  for (const entry of weighted) {
    roll -= entry.weight;

    if (roll <= 0) {
      return entry.item;
    }
  }

  return weighted[
    weighted.length - 1
  ]!.item;
}

export function shuffle<T>(
  arr: T[],
): T[] {
  return [...arr].sort(
    () => Math.random() - 0.5,
  );
}
