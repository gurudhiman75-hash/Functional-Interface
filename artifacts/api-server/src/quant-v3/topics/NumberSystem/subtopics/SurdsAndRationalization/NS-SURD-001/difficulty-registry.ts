import type { DifficultyRegistryEntry, SurdCpId } from "./types";

export const DIFFICULTY_REGISTRY = [
  {
    cpId: "CP01",
    packageId: "NS-SURD-001",
    bands: {
      Easy: "One extractable perfect square or cube factor.",
      Medium: "Radicand requires splitting before extraction.",
      Hard: "Reserved for dependent use inside mixed or comparison chains.",
    },
  },
  {
    cpId: "CP02",
    packageId: "NS-SURD-001",
    bands: {
      Easy: "Like surds are already visible.",
      Medium: "Terms must be simplified before they become like surds.",
      Hard: "Reserved for dependent use inside mixed expressions.",
    },
  },
  {
    cpId: "CP03",
    packageId: "NS-SURD-001",
    bands: {
      Easy: "Compatible radicals multiply or divide directly.",
      Medium: "The product or quotient must be simplified after combining radicands.",
      Hard: "Reserved for dependent use inside mixed expressions.",
    },
  },
  {
    cpId: "CP04",
    packageId: "NS-SURD-001",
    bands: {
      Easy: "Not preferred.",
      Medium: "Two to four transformations using simplification and like-surd collection.",
      Hard: "Several operations must be sequenced before final collection.",
    },
  },
  {
    cpId: "CP05",
    packageId: "NS-SURD-001",
    bands: {
      Easy: "Expressions become directly comparable after simplification.",
      Medium: "Two expressions require squaring or cubing to compare.",
      Hard: "Three or more expressions require increasing or decreasing order after normalization.",
    },
  },
  {
    cpId: "CP06",
    packageId: "NS-SURD-001",
    bands: {
      Easy: "Single square-root denominator with simple numerator.",
      Medium: "Rational coefficient or reducible coefficient is present.",
      Hard: "Cube-root monomial denominator requiring completion of cube factors.",
    },
  },
  {
    cpId: "CP07",
    packageId: "NS-SURD-001",
    bands: {
      Easy: "Only direct, clean conjugate use.",
      Medium: "Conjugate rationalization with a simple binomial denominator.",
      Hard: "Rationalization creates a numerator or final expression that needs simplification.",
    },
  },
  {
    cpId: "CP08",
    packageId: "NS-SURD-001",
    bands: {
      Easy: "Direct product of conjugates.",
      Medium: "Square of a surd binomial.",
      Hard: "Identity recognition followed by additional simplification.",
    },
  },
] as const satisfies readonly DifficultyRegistryEntry[];

export function getDifficultyRegistryEntry(
  cpId: SurdCpId,
): DifficultyRegistryEntry {
  const entry = DIFFICULTY_REGISTRY.find((difficulty) => difficulty.cpId === cpId);
  if (!entry) {
    throw new Error(`Unknown NS-SURD-001 difficulty CP id: ${cpId}`);
  }
  return entry;
}
