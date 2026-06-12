import type {
  ReasoningPatternRegistryEntry,
  SurdReasoningPatternId,
} from "./types";

export const REASONING_PATTERN_REGISTRY = [
  {
    patternId: "Pattern 1",
    packageId: "NS-SURD-001",
    supportedCpIds: ["CP01", "CP02", "CP04"],
  },
  {
    patternId: "Pattern 2",
    packageId: "NS-SURD-001",
    supportedCpIds: ["CP02", "CP04"],
  },
  {
    patternId: "Pattern 3",
    packageId: "NS-SURD-001",
    supportedCpIds: ["CP03", "CP04"],
  },
  {
    patternId: "Pattern 4",
    packageId: "NS-SURD-001",
    supportedCpIds: ["CP05"],
  },
  {
    patternId: "Pattern 5",
    packageId: "NS-SURD-001",
    supportedCpIds: ["CP06"],
  },
  {
    patternId: "Pattern 6",
    packageId: "NS-SURD-001",
    supportedCpIds: ["CP07"],
  },
  {
    patternId: "Pattern 7",
    packageId: "NS-SURD-001",
    supportedCpIds: ["CP04"],
  },
  {
    patternId: "Pattern 8",
    packageId: "NS-SURD-001",
    supportedCpIds: ["CP08"],
  },
] as const satisfies readonly ReasoningPatternRegistryEntry[];

export function getReasoningPatternRegistryEntry(
  patternId: SurdReasoningPatternId,
): ReasoningPatternRegistryEntry {
  const entry = REASONING_PATTERN_REGISTRY.find(
    (pattern) => pattern.patternId === patternId,
  );
  if (!entry) {
    throw new Error(`Unknown NS-SURD-001 reasoning pattern id: ${patternId}`);
  }
  return entry;
}
