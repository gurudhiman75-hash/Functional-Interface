import type { EEV2DetailMode } from "../../../../../../../../common/eev2/contracts";

export type IndependentAuditContext = "abstract" | "count" | "money";

export interface IndependentAuditCorpusItem {
  auditId: string;
  knownRate: number;
  knownValue: number;
  targetRate: number;
  detailMode: EEV2DetailMode;
  contextKind: IndependentAuditContext;
  contextLabel: string;
  semanticUnit: string;
  weakStudent: boolean;
}

type Input = Omit<IndependentAuditCorpusItem, "auditId">;

const inputs: readonly Input[] = [
  { knownRate: 20, knownValue: 67, targetRate: 35, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 30, knownValue: 41, targetRate: 55, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 12, knownValue: 17, targetRate: 28, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 18, knownValue: 29, targetRate: 45, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 35, knownValue: 83, targetRate: 60, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },

  { knownRate: 15, knownValue: 45, targetRate: 40, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 25, knownValue: 75, targetRate: 50, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 40, knownValue: 120, targetRate: 80, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 60, knownValue: 180, targetRate: 20, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 45, knownValue: 135, targetRate: 45, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },

  { knownRate: 20, knownValue: 67, targetRate: 35, detailMode: "standard", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: false },
  { knownRate: 15, knownValue: 53, targetRate: 40, detailMode: "detailed", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: false },
  { knownRate: 30, knownValue: 91, targetRate: 20, detailMode: "short", contextKind: "count", contextLabel: "books", semanticUnit: "books", weakStudent: false },
  { knownRate: 25, knownValue: 77, targetRate: 60, detailMode: "standard", contextKind: "count", contextLabel: "trees", semanticUnit: "trees", weakStudent: false },
  { knownRate: 40, knownValue: 101, targetRate: 15, detailMode: "detailed", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: false },
  { knownRate: 12, knownValue: 37, targetRate: 24, detailMode: "short", contextKind: "count", contextLabel: "animals", semanticUnit: "animals", weakStudent: false },
  { knownRate: 10, knownValue: 30, targetRate: 70, detailMode: "standard", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: true },
  { knownRate: 50, knownValue: 150, targetRate: 10, detailMode: "detailed", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: true },
  { knownRate: 25, knownValue: 100, targetRate: 25, detailMode: "short", contextKind: "count", contextLabel: "books", semanticUnit: "books", weakStudent: true },
  { knownRate: 75, knownValue: 225, targetRate: 30, detailMode: "standard", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: true },

  { knownRate: 20, knownValue: 67, targetRate: 35, detailMode: "standard", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 25, knownValue: 83, targetRate: 60, detailMode: "detailed", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 15, knownValue: 49, targetRate: 30, detailMode: "short", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 40, knownValue: 137, targetRate: 25, detailMode: "standard", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 30, knownValue: 97, targetRate: 50, detailMode: "detailed", contextKind: "money", contextLabel: "expenses", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 10, knownValue: 500, targetRate: 80, detailMode: "short", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 50, knownValue: 2_500, targetRate: 20, detailMode: "standard", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 25, knownValue: 1_000, targetRate: 75, detailMode: "detailed", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 60, knownValue: 6_000, targetRate: 10, detailMode: "short", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 20, knownValue: 800, targetRate: 20, detailMode: "standard", contextKind: "money", contextLabel: "expenses", semanticUnit: "rupees", weakStudent: true },

  { knownRate: 5, knownValue: 0.5, targetRate: 15, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 20, knownValue: 1.4, targetRate: 50, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 25, knownValue: 2.5, targetRate: 10, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 50, knownValue: 0.75, targetRate: 25, detailMode: "short", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 10, knownValue: 0.3, targetRate: 60, detailMode: "standard", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false },

  { knownRate: 8, knownValue: 800_000, targetRate: 72, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 15, knownValue: 1_500_000, targetRate: 45, detailMode: "standard", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 25, knownValue: 2_750_000, targetRate: 5, detailMode: "short", contextKind: "count", contextLabel: "trees", semanticUnit: "trees", weakStudent: false },
  { knownRate: 80, knownValue: 8_000_000, targetRate: 20, detailMode: "detailed", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 40, knownValue: 4_400_000, targetRate: 40, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },

  { knownRate: 7, knownValue: 21, targetRate: 91, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 90, knownValue: 270, targetRate: 5, detailMode: "short", contextKind: "count", contextLabel: "animals", semanticUnit: "animals", weakStudent: false },
  { knownRate: 11, knownValue: 33, targetRate: 77, detailMode: "standard", contextKind: "money", contextLabel: "expenses", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 85, knownValue: 255, targetRate: 15, detailMode: "detailed", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: false },
  { knownRate: 13, knownValue: 39, targetRate: 13, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },

  { knownRate: 22, knownValue: 66, targetRate: 44, detailMode: "standard", contextKind: "count", contextLabel: "books", semanticUnit: "books", weakStudent: true },
  { knownRate: 33, knownValue: 99, targetRate: 66, detailMode: "detailed", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 16, knownValue: 48, targetRate: 32, detailMode: "short", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: true },
  { knownRate: 28, knownValue: 84, targetRate: 14, detailMode: "standard", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 18, knownValue: 54, targetRate: 18, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
] as const;

export const INDEPENDENT_AUDIT_CORPUS:
  readonly IndependentAuditCorpusItem[] = inputs.map((input, index) => ({
    auditId: `QUAL-001-B1:${String(index + 1).padStart(2, "0")}`,
    ...input,
  }));

