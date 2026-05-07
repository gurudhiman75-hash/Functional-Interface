import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import {
  ReasoningEngineError,
  buildReasoningErrorMetadata,
} from "./reasoning-engine-error";

export type RNGService = {
  next(): number;
  nextInt(
    min: number,
    max: number,
  ): number;
  fork(label: string): RNGService;
  getSeed(): string;
};

export type GenerationContext = {
  seed: string;
  rng: RNGService;
  generationId: string;
  timestamp: number;
};

const generationContextStore =
  new AsyncLocalStorage<GenerationContext>();

function hashSeed(
  value: string,
) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function mulberry32(
  seed: number,
) {
  let state = seed >>> 0;

  return () => {
    state =
      (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(
      state ^ (state >>> 15),
      1 | state,
    );
    value ^= value + Math.imul(
      value ^ (value >>> 7),
      61 | value,
    );
    return (
      ((value ^ (value >>> 14)) >>>
        0) /
      4294967296
    );
  };
}

function normalizeSeed(
  seed?: string,
) {
  return seed?.length
    ? seed
    : `auto-seed:${randomUUID()}`;
}

export function createRNGService(
  seed: string,
) {
  const normalizedSeed =
    normalizeSeed(seed);
  const nextValue = mulberry32(
    hashSeed(normalizedSeed),
  );

  return {
    next() {
      return nextValue();
    },
    nextInt(
      min: number,
      max: number,
    ) {
      return (
        Math.floor(
          nextValue() *
            (max - min + 1),
        ) + min
      );
    },
    fork(label: string) {
      return createRNGService(
        `${normalizedSeed}:${label}`,
      );
    },
    getSeed() {
      return normalizedSeed;
    },
  };
}

const fallbackRng =
  createRNGService(
    `fallback:${Date.now()}`,
  );

export function createGenerationContext(
  seed?: string,
) : GenerationContext {
  const normalizedSeed =
    normalizeSeed(seed);

  return {
    seed: normalizedSeed,
    rng: createRNGService(
      normalizedSeed,
    ),
    generationId: `gen_${hashSeed(normalizedSeed).toString(16)}`,
    timestamp: Date.now(),
  };
}

export function runWithGenerationContext<T>(
  context: GenerationContext,
  fn: () => T,
) {
  return generationContextStore.run(
    context,
    fn,
  );
}

export function getGenerationContext() {
  return generationContextStore.getStore();
}

export function random() {
  return (
    getGenerationContext()?.rng.next() ??
    fallbackRng.next()
  );
}

export function randomInt(
  min: number,
  max: number,
) {
  const rng =
    getGenerationContext()?.rng;

  return rng
    ? rng.nextInt(min, max)
    : fallbackRng.nextInt(min, max);
}

export function pickRandomTemplate(
  templateVariants: string[],
) : string {
  if (!templateVariants?.length) {
    throw new ReasoningEngineError({
      code:
        "REALIZATION_NO_TEMPLATE_VARIANTS",
      phase: "realization",
      message:
        "No template variants provided.",
      metadata:
        buildReasoningErrorMetadata(),
    });
  }

  const idx = randomInt(
    0,
    templateVariants.length - 1,
  );

  return templateVariants[idx]!;
}

export function pickRandomItem<T>(
  items: T[],
) : T {
  if (!items.length) {
    throw new ReasoningEngineError({
      code: "RNG_EMPTY_ITEM_SET",
      phase: "realization",
      message:
        "Expected at least one item.",
      metadata:
        buildReasoningErrorMetadata(),
    });
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
) : T {
  if (!items.length) {
    throw new ReasoningEngineError({
      code:
        "RNG_EMPTY_WEIGHTED_SET",
      phase: "optimization",
      message:
        "Expected at least one weighted item.",
      metadata:
        buildReasoningErrorMetadata(),
    });
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
  let roll = random() * totalWeight;

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
) : T[] {
  const copy = [...arr];

  for (
    let index = copy.length - 1;
    index > 0;
    index -= 1
  ) {
    const swapIndex = randomInt(
      0,
      index,
    );
    const value = copy[index]!;
    copy[index] = copy[swapIndex]!;
    copy[swapIndex] = value;
  }

  return copy;
}
