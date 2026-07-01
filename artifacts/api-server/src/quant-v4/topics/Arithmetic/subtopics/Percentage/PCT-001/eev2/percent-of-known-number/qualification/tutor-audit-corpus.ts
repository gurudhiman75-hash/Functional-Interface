import type { EEV2DetailMode } from "../../../../../../../../common/eev2/contracts";

export type TutorAuditContextKind = "abstract" | "count" | "money";
export type TutorAuditDirection = "greater" | "smaller" | "equal";

export interface TutorAuditCorpusItem {
  auditId: string;
  knownRate: number;
  knownValue: number;
  targetRate: number;
  detailMode: EEV2DetailMode;
  contextKind: TutorAuditContextKind;
  contextLabel: string;
  semanticUnit: string;
  weakStudent: boolean;
  size: "small" | "medium" | "large";
  direction: TutorAuditDirection;
}

type CorpusInput = Omit<TutorAuditCorpusItem, "auditId" | "direction">;

function item(index: number, input: CorpusInput): TutorAuditCorpusItem {
  return {
    auditId: `QUAL-001-B:${String(index).padStart(2, "0")}`,
    ...input,
    direction:
      input.targetRate > input.knownRate
        ? "greater"
        : input.targetRate < input.knownRate
          ? "smaller"
          : "equal",
  };
}

const inputs: readonly CorpusInput[] = [
  { knownRate: 20, knownValue: 600, targetRate: 25, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "medium" },
  { knownRate: 25, knownValue: 750, targetRate: 20, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "medium" },
  { knownRate: 30, knownValue: 90, targetRate: 30, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "small" },
  { knownRate: 10, knownValue: 50, targetRate: 20, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "small" },
  { knownRate: 50, knownValue: 40, targetRate: 25, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "small" },
  { knownRate: 20, knownValue: 100, targetRate: 60, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "small" },
  { knownRate: 40, knownValue: 200, targetRate: 10, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "small" },
  { knownRate: 75, knownValue: 300, targetRate: 50, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "medium" },
  { knownRate: 5, knownValue: 25, targetRate: 15, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "small" },
  { knownRate: 80, knownValue: 400, targetRate: 20, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "medium" },

  { knownRate: 20, knownValue: 120, targetRate: 30, detailMode: "standard", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: true, size: "small" },
  { knownRate: 25, knownValue: 200, targetRate: 40, detailMode: "standard", contextKind: "count", contextLabel: "employees", semanticUnit: "employees", weakStudent: false, size: "small" },
  { knownRate: 10, knownValue: 80, targetRate: 35, detailMode: "detailed", contextKind: "count", contextLabel: "books", semanticUnit: "books", weakStudent: false, size: "small" },
  { knownRate: 20, knownValue: 300, targetRate: 60, detailMode: "short", contextKind: "count", contextLabel: "trees", semanticUnit: "trees", weakStudent: false, size: "medium" },
  { knownRate: 40, knownValue: 240, targetRate: 15, detailMode: "standard", contextKind: "count", contextLabel: "animals", semanticUnit: "animals", weakStudent: false, size: "medium" },
  { knownRate: 25, knownValue: 500, targetRate: 10, detailMode: "detailed", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: false, size: "medium" },
  { knownRate: 50, knownValue: 450, targetRate: 30, detailMode: "standard", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: false, size: "medium" },

  { knownRate: 20, knownValue: 1_200, targetRate: 25, detailMode: "standard", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: false, size: "medium" },
  { knownRate: 25, knownValue: 5_000, targetRate: 40, detailMode: "detailed", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: false, size: "large" },
  { knownRate: 10, knownValue: 600, targetRate: 15, detailMode: "short", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: true, size: "medium" },
  { knownRate: 40, knownValue: 8_000, targetRate: 25, detailMode: "standard", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false, size: "large" },
  { knownRate: 30, knownValue: 3_600, targetRate: 50, detailMode: "detailed", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false, size: "large" },
  { knownRate: 20, knownValue: 2_400, targetRate: 10, detailMode: "standard", contextKind: "money", contextLabel: "expenses", semanticUnit: "rupees", weakStudent: false, size: "medium" },

  { knownRate: 15, knownValue: 200, targetRate: 10, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false, size: "small" },
  { knownRate: 12, knownValue: 50, targetRate: 18, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false, size: "small" },
  { knownRate: 8, knownValue: 10, targetRate: 12, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "small" },
  { knownRate: 16, knownValue: 120, targetRate: 8, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false, size: "small" },
  { knownRate: 24, knownValue: 300, targetRate: 18, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false, size: "medium" },

  { knownRate: 5, knownValue: 45, targetRate: 80, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false, size: "small" },
  { knownRate: 10, knownValue: 700, targetRate: 75, detailMode: "short", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false, size: "medium" },
  { knownRate: 15, knownValue: 180, targetRate: 60, detailMode: "detailed", contextKind: "count", contextLabel: "books", semanticUnit: "books", weakStudent: false, size: "small" },
  { knownRate: 20, knownValue: 2_000, targetRate: 90, detailMode: "standard", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false, size: "large" },
  { knownRate: 25, knownValue: 125, targetRate: 75, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "small" },
  { knownRate: 30, knownValue: 900, targetRate: 80, detailMode: "standard", contextKind: "count", contextLabel: "trees", semanticUnit: "trees", weakStudent: false, size: "medium" },
  { knownRate: 40, knownValue: 4_000, targetRate: 85, detailMode: "detailed", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: false, size: "large" },

  { knownRate: 90, knownValue: 900, targetRate: 10, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "medium" },
  { knownRate: 80, knownValue: 1_600, targetRate: 20, detailMode: "short", contextKind: "count", contextLabel: "employees", semanticUnit: "employees", weakStudent: false, size: "medium" },
  { knownRate: 75, knownValue: 7_500, targetRate: 15, detailMode: "detailed", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: false, size: "large" },
  { knownRate: 60, knownValue: 360, targetRate: 5, detailMode: "standard", contextKind: "count", contextLabel: "animals", semanticUnit: "animals", weakStudent: false, size: "small" },
  { knownRate: 50, knownValue: 2_500, targetRate: 10, detailMode: "short", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: true, size: "medium" },
  { knownRate: 40, knownValue: 160, targetRate: 5, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false, size: "small" },
  { knownRate: 30, knownValue: 1_200, targetRate: 12, detailMode: "standard", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: false, size: "medium" },

  { knownRate: 10, knownValue: 70, targetRate: 10, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true, size: "small" },
  { knownRate: 20, knownValue: 500, targetRate: 20, detailMode: "standard", contextKind: "money", contextLabel: "expenses", semanticUnit: "rupees", weakStudent: false, size: "medium" },
  { knownRate: 25, knownValue: 250, targetRate: 25, detailMode: "detailed", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: false, size: "small" },
  { knownRate: 50, knownValue: 5_000, targetRate: 50, detailMode: "standard", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false, size: "large" },

  { knownRate: 5, knownValue: 5_000, targetRate: 25, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false, size: "large" },
  { knownRate: 20, knownValue: 200_000, targetRate: 35, detailMode: "standard", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false, size: "large" },
  { knownRate: 25, knownValue: 250_000, targetRate: 75, detailMode: "short", contextKind: "count", contextLabel: "trees", semanticUnit: "trees", weakStudent: false, size: "large" },
  { knownRate: 80, knownValue: 800_000, targetRate: 15, detailMode: "detailed", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: false, size: "large" },
] as const;

export const TUTOR_AUDIT_CORPUS: readonly TutorAuditCorpusItem[] =
  inputs.map((input, index) => item(index + 1, input));

