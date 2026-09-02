import {
  buildIntCp009DiscoveryPackage as buildV1,
  type IntCp009PrototypeId,
} from "./cp009-dated-cash-flow-discovery-v1";

export * from "./cp009-dated-cash-flow-discovery-v1";

export const INT_CP009_DISCOVERY_PACKAGING_VERSION = "INT-CP-009-WAVE01-PACKAGING-v2-balanced" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

function targetCorrectIndex(seed: string): number {
  const trailing = seed.match(/:(\d+)$/u);
  if (trailing) return Number(trailing[1]) % 4;
  let total = 0;
  for (const character of seed) total = (total + character.codePointAt(0)!) % 4;
  return total;
}

export function buildIntCp009BalancedDiscoveryPackage(prototypeId: IntCp009PrototypeId, seed: string) {
  const source = buildV1(prototypeId, seed);
  const correctOption = source.options[source.correctIndex]!;
  const distractors = source.options.filter((_option, index) => index !== source.correctIndex);
  const desired = targetCorrectIndex(seed);
  const options = [...distractors];
  options.splice(desired, 0, correctOption);
  const frozenOptions = Object.freeze(options);

  return deepFreeze({
    ...source,
    packagingVersion: INT_CP009_DISCOVERY_PACKAGING_VERSION,
    options: frozenOptions,
    correctIndex: desired,
    correctAnswer: frozenOptions[desired]!.text,
  });
}
