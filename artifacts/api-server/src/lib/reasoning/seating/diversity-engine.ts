const structureRegistry =
  new Map<string, number>();

export function getStructuralDiversityScore(
  signature: string,
) {
  const seenCount =
    structureRegistry.get(signature) ??
    0;

  return Number(
    Math.max(
      0.1,
      1 / (1 + seenCount * 0.4),
    ).toFixed(3),
  );
}

export function recordStructuralSignature(
  signature: string,
) {
  structureRegistry.set(
    signature,
    (structureRegistry.get(signature) ??
      0) + 1,
  );
}

export function getRepeatedStructureWarnings(
  signature: string,
  repeatedAdjacencySerialization: boolean,
) {
  const warnings: string[] = [];
  const seenCount =
    structureRegistry.get(signature) ??
    0;

  if (seenCount >= 2) {
    warnings.push(
      `Structural signature repeated ${seenCount} times in this process.`,
    );
  }

  if (repeatedAdjacencySerialization) {
    warnings.push(
      "Adjacency serialization pattern detected and penalized.",
    );
  }

  return warnings;
}
