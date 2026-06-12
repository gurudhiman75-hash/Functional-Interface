import type { DifficultyRegistryEntry } from "./types";

export const DIFFICULTY_REGISTRY = [
  {
    cpId: "CP-001",
    packageId: "SIMPL-001",
    bands: {
      Easy: ["small expression", "no or simple brackets", "two to three operations"],
      Medium: ["brackets", "three to four operations", "multiplication and division present"],
      Hard: ["nested or longer expression", "four to five operations", "mixed precedence burden"],
    },
  },
  {
    cpId: "CP-002",
    packageId: "SIMPL-001",
    bands: {
      Easy: ["same denominator", "single fraction operation"],
      Medium: ["unlike denominators", "reducible composite denominators"],
      Hard: ["fraction division", "multi-fraction LCM", "compound expression"],
    },
  },
  {
    cpId: "CP-003",
    packageId: "SIMPL-001",
    bands: {
      Easy: ["one decimal place", "addition or subtraction"],
      Medium: ["decimal multiplication or division", "one to two decimal places"],
      Hard: ["multi-step decimal BODMAS", "two to three decimal places"],
    },
  },
  {
    cpId: "CP-004",
    packageId: "SIMPL-001",
    bands: {
      Easy: ["single fraction with decimal", "one conversion"],
      Medium: ["mixed number plus decimal", "fraction-decimal conversion"],
      Hard: ["multi-step mixed format", "of-expression with decimal"],
    },
  },
  {
    cpId: "CP-005",
    packageId: "SIMPL-001",
    bands: {
      Easy: ["direct square root", "direct cube root", "small power"],
      Medium: ["root with power", "multiple root or power components"],
      Hard: ["multi-step root-power arithmetic", "operation-order burden"],
    },
  },
  {
    cpId: "CP-006",
    packageId: "SIMPL-001",
    bands: {
      Easy: ["one rounded value", "nearest ten or hundred"],
      Medium: ["two rounded values", "compatible product or quotient"],
      Hard: ["percentage approximation", "multi-rounding burden"],
    },
  },
  {
    cpId: "CP-007",
    packageId: "SIMPL-001",
    bands: {
      Easy: ["options far apart", "simple product or quotient"],
      Medium: ["moderately close options", "root or percentage estimate"],
      Hard: ["close options", "careful distance comparison required"],
    },
  },
] as const satisfies DifficultyRegistryEntry[];
