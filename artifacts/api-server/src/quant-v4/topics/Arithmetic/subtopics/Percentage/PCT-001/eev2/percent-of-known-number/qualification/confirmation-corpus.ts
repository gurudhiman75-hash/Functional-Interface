import type { EEV2DetailMode } from "../../../../../../../../common/eev2/contracts";

export type ConfirmationExpectation = "RENDER" | "REJECT";

export type ConfirmationCategory =
  | "ABSTRACT"
  | "MONEY"
  | "COUNT"
  | "CONTINUOUS"
  | "COMPOUND_CONTEXT"
  | "WEAK_STUDENT"
  | "PATHOLOGICAL_DECIMAL"
  | "EXTREME_REALISTIC"
  | "EQUAL_RATE"
  | "POLICY_REJECTION";

export interface ConfirmationCorpusItem {
  confirmationId: string;
  category: ConfirmationCategory;
  expectation: ConfirmationExpectation;
  knownRate: number;
  knownValue: number;
  targetRate: number;
  detailMode: EEV2DetailMode;
  contextKind: "abstract" | "money" | "count" | "continuous" | "event";
  contextLabel: string;
  semanticUnit: string;
  weakStudent: boolean;
}

interface CaseBlueprint {
  category: ConfirmationCategory;
  expectation: ConfirmationExpectation;
  contexts: readonly {
    contextKind: ConfirmationCorpusItem["contextKind"];
    contextLabel: string;
    semanticUnit: string;
  }[];
  values: readonly [number, number, number][];
  weakStudent: boolean;
}

const modes: readonly EEV2DetailMode[] = ["short", "standard", "detailed"];

const BLUEPRINTS: readonly CaseBlueprint[] = [
  {
    category: "ABSTRACT",
    expectation: "RENDER",
    contexts: [{ contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number" }],
    values: [
      [12, 67, 19], [19, 104, 31], [26, 141, 43], [33, 178, 58],
      [41, 215, 69], [47, 252, 82], [54, 289, 7], [61, 326, 17],
      [68, 363, 29], [75, 401, 46], [82, 437, 59], [8, 474, 71],
      [15, 511, 84], [22, 548, 6], [29, 585, 17], [36, 622, 32],
      [43, 659, 45], [50, 696, 56], [57, 733, 72], [64, 770, 85],
      [71, 807, 4], [78, 844, 20], [85, 881, 34], [11, 918, 47],
      [18, 955, 61], [25, 992, 73], [32, 1029, 86], [39, 1066, 8],
      [46, 1103, 21], [53, 1140, 35],
    ],
    weakStudent: false,
  },
  {
    category: "MONEY",
    expectation: "RENDER",
    contexts: [
      { contextKind: "money", contextLabel: "monthly salary", semanticUnit: "rupees" },
      { contextKind: "money", contextLabel: "annual income", semanticUnit: "rupees" },
      { contextKind: "money", contextLabel: "profit", semanticUnit: "rupees" },
      { contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees" },
      { contextKind: "money", contextLabel: "commission", semanticUnit: "rupees" },
      { contextKind: "money", contextLabel: "bonus", semanticUnit: "rupees" },
      { contextKind: "money", contextLabel: "expenses", semanticUnit: "rupees" },
      { contextKind: "money", contextLabel: "savings", semanticUnit: "rupees" },
    ],
    values: [
      [16, 12_800, 28], [23, 18_400, 37], [31, 24_800, 49],
      [38, 30_400, 62], [44, 35_200, 17], [52, 41_600, 73],
      [59, 47_200, 26], [67, 53_600, 81], [74, 59_200, 33],
      [81, 64_800, 57], [9, 7_200, 46], [14, 11_200, 69],
      [21, 16_800, 35], [27, 21_600, 64], [34, 27_200, 12],
      [42, 33_600, 78], [48, 38_400, 24], [56, 44_800, 83],
      [63, 50_400, 31], [69, 55_200, 72], [77, 61_600, 18],
      [84, 67_200, 53], [11, 8_800, 39], [18, 14_400, 76],
      [25, 20_000, 45], [32, 25_600, 68], [39, 31_200, 14],
      [46, 36_800, 79], [53, 42_400, 22], [61, 48_800, 66],
    ],
    weakStudent: false,
  },
  {
    category: "COUNT",
    expectation: "RENDER",
    contexts: [
      { contextKind: "count", contextLabel: "students", semanticUnit: "students" },
      { contextKind: "count", contextLabel: "workers", semanticUnit: "workers" },
      { contextKind: "count", contextLabel: "employees", semanticUnit: "employees" },
      { contextKind: "count", contextLabel: "books", semanticUnit: "books" },
      { contextKind: "count", contextLabel: "trees", semanticUnit: "trees" },
      { contextKind: "count", contextLabel: "animals", semanticUnit: "animals" },
      { contextKind: "count", contextLabel: "families", semanticUnit: "families" },
      { contextKind: "count", contextLabel: "inventory", semanticUnit: "inventory" },
    ],
    values: [
      [12, 144, 25], [18, 216, 43], [24, 288, 57], [32, 384, 71],
      [45, 540, 19], [54, 648, 83], [63, 756, 34], [72, 864, 49],
      [81, 972, 16], [9, 108, 68], [15, 180, 37], [21, 252, 59],
      [27, 324, 74], [36, 432, 13], [42, 504, 86], [48, 576, 29],
      [57, 684, 62], [66, 792, 23], [75, 900, 52], [84, 1008, 31],
      [11, 132, 47], [17, 204, 79], [23, 276, 38], [29, 348, 67],
      [35, 420, 14], [41, 492, 73], [53, 636, 26], [61, 732, 82],
      [69, 828, 44], [77, 924, 18],
    ],
    weakStudent: false,
  },
  {
    category: "CONTINUOUS",
    expectation: "RENDER",
    contexts: [
      { contextKind: "continuous", contextLabel: "distance", semanticUnit: "kilometres" },
      { contextKind: "continuous", contextLabel: "area", semanticUnit: "square metres" },
      { contextKind: "continuous", contextLabel: "weight", semanticUnit: "kilograms" },
      { contextKind: "continuous", contextLabel: "volume", semanticUnit: "litres" },
      { contextKind: "continuous", contextLabel: "production", semanticUnit: "units" },
      { contextKind: "continuous", contextLabel: "population", semanticUnit: "people" },
      { contextKind: "continuous", contextLabel: "exam marks", semanticUnit: "marks" },
    ],
    values: [
      [13, 157.5, 29], [17, 238.25, 41], [22, 319.75, 54],
      [28, 486.4, 67], [34, 572.8, 19], [39, 661.05, 73],
      [46, 744.2, 31], [51, 835.75, 62], [58, 929.4, 16],
      [64, 1017.6, 81], [71, 1106.25, 24], [79, 1264.8, 48],
      [8, 147.2, 57], [14, 226.8, 69], [19, 304.95, 36],
      [25, 412.5, 83], [31, 518.25, 22], [37, 623.45, 76],
      [43, 731.0, 28], [49, 841.75, 65], [55, 951.5, 18],
      [62, 1064.4, 72], [68, 1179.8, 33], [74, 1295.0, 59],
      [81, 1417.5, 12], [9, 168.75, 47], [16, 294.4, 78],
      [27, 502.2, 39], [44, 818.4, 71], [69, 1283.4, 26],
    ],
    weakStudent: false,
  },
  {
    category: "COMPOUND_CONTEXT",
    expectation: "RENDER",
    contexts: [
      { contextKind: "money", contextLabel: "monthly salary", semanticUnit: "rupees" },
      { contextKind: "money", contextLabel: "annual profit", semanticUnit: "rupees" },
      { contextKind: "count", contextLabel: "total books", semanticUnit: "books" },
      { contextKind: "continuous", contextLabel: "exam marks", semanticUnit: "marks" },
      { contextKind: "continuous", contextLabel: "factory production", semanticUnit: "units" },
      { contextKind: "count", contextLabel: "warehouse inventory", semanticUnit: "inventory" },
    ],
    values: [
      [12, 14_400, 36], [18, 21_600, 54], [24, 288, 72],
      [30, 450, 15], [36, 720, 63], [42, 840, 21],
      [48, 57_600, 84], [56, 67_200, 28], [64, 768, 16],
      [72, 1080, 45], [80, 1600, 20], [9, 180, 63],
      [15, 18_000, 45], [21, 25_200, 70], [27, 324, 54],
      [33, 495, 66], [39, 780, 13], [45, 900, 75],
      [51, 61_200, 17], [57, 68_400, 38], [63, 756, 84],
      [69, 1035, 23], [75, 1500, 50], [81, 1620, 27],
      [11, 13_200, 44], [17, 20_400, 68], [23, 276, 46],
      [29, 435, 58], [41, 820, 82], [53, 1060, 25],
    ],
    weakStudent: false,
  },
  {
    category: "WEAK_STUDENT",
    expectation: "RENDER",
    contexts: [
      { contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number" },
      { contextKind: "count", contextLabel: "students", semanticUnit: "students" },
      { contextKind: "money", contextLabel: "savings", semanticUnit: "rupees" },
    ],
    values: [
      [10, 30, 20], [20, 80, 50], [25, 100, 40], [30, 120, 60],
      [40, 200, 20], [50, 300, 25], [60, 360, 30], [75, 450, 50],
      [10, 50, 70], [20, 120, 30], [25, 200, 75], [30, 180, 15],
      [40, 240, 80], [50, 400, 10], [60, 480, 45], [75, 600, 25],
      [10, 70, 30], [20, 160, 60], [25, 250, 50], [30, 270, 90],
      [40, 320, 20], [50, 500, 75], [60, 600, 15], [75, 750, 40],
      [10, 90, 50], [20, 200, 80], [25, 300, 20], [30, 360, 60],
      [40, 480, 70], [50, 650, 30],
    ],
    weakStudent: true,
  },
  {
    category: "PATHOLOGICAL_DECIMAL",
    expectation: "RENDER",
    contexts: [
      { contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number" },
      { contextKind: "continuous", contextLabel: "area", semanticUnit: "square metres" },
      { contextKind: "continuous", contextLabel: "weight", semanticUnit: "kilograms" },
    ],
    values: [
      [7, 17, 9], [11, 31, 14], [13, 45, 21], [17, 59, 27],
      [19, 73, 33], [23, 87, 41], [29, 101, 47], [31, 115, 53],
      [37, 129, 61], [41, 143, 67], [43, 157, 71], [47, 171, 79],
      [53, 185, 83], [59, 199, 89], [61, 213, 97], [8, 27, 13],
      [12, 41, 19], [16, 55, 23], [18, 69, 29], [22, 83, 37],
      [26, 97, 43], [28, 111, 49], [32, 125, 57], [34, 139, 63],
      [38, 153, 69], [44, 167, 73], [46, 181, 81], [52, 195, 87],
      [56, 209, 91], [62, 223, 99],
    ],
    weakStudent: false,
  },
  {
    category: "EXTREME_REALISTIC",
    expectation: "RENDER",
    contexts: [
      { contextKind: "money", contextLabel: "annual income", semanticUnit: "rupees" },
      { contextKind: "continuous", contextLabel: "population", semanticUnit: "people" },
      { contextKind: "continuous", contextLabel: "distance", semanticUnit: "kilometres" },
    ],
    values: [
      [1, 12_000, 99], [99, 99_000, 1], [100, 80_000, 50],
      [0.5, 5_000, 5], [2.5, 25_000, 0.5], [1, 15_000, 100],
      [99, 1_980_000, 50], [100, 2_500_000, 1], [0.5, 2500, 99],
      [2.5, 12_500, 100], [1, 18_000, 50], [99, 2_970_000, 100],
      [100, 3_000_000, 99], [0.5, 3500, 1], [2.5, 17_500, 50],
      [1, 21_000, 99], [99, 3_960_000, 1], [100, 4_000_000, 50],
      [0.5, 4500, 5], [2.5, 22_500, 0.5], [1, 24_000, 100],
      [99, 4_950_000, 50], [100, 5_000_000, 1], [0.5, 5500, 99],
      [2.5, 27_500, 100], [1, 27_000, 50], [99, 5_940_000, 100],
      [100, 6_000_000, 99], [0.5, 6500, 1], [2.5, 32_500, 50],
    ],
    weakStudent: false,
  },
  {
    category: "EQUAL_RATE",
    expectation: "RENDER",
    contexts: [
      { contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number" },
      { contextKind: "money", contextLabel: "monthly salary", semanticUnit: "rupees" },
      { contextKind: "count", contextLabel: "books", semanticUnit: "books" },
      { contextKind: "continuous", contextLabel: "area", semanticUnit: "square metres" },
    ],
    values: [
      [5, 25, 5], [8, 6400, 8], [12, 120, 12], [15, 180, 15],
      [18, 216, 18], [22, 26_400, 22], [25, 300, 25], [28, 336, 28],
      [30, 450, 30], [33, 49_500, 33], [35, 525, 35], [40, 800, 40],
      [45, 900, 45], [50, 50_000, 50], [55, 1100, 55], [60, 1200, 60],
      [65, 1300, 65], [70, 70_000, 70], [75, 1500, 75], [80, 1600, 80],
      [82, 1640, 82], [84, 84_000, 84], [85, 1700, 85], [88, 1760, 88],
      [90, 1800, 90], [92, 92_000, 92], [94, 1880, 94], [95, 1900, 95],
      [98, 1960, 98], [100, 100_000, 100],
    ],
    weakStudent: false,
  },
  {
    category: "POLICY_REJECTION",
    expectation: "REJECT",
    contexts: [
      { contextKind: "event", contextLabel: "accidents", semanticUnit: "accidents" },
      { contextKind: "event", contextLabel: "marriages", semanticUnit: "marriages" },
      { contextKind: "event", contextLabel: "votes cast", semanticUnit: "votes" },
      { contextKind: "count", contextLabel: "students", semanticUnit: "students" },
      { contextKind: "count", contextLabel: "books", semanticUnit: "books" },
      { contextKind: "money", contextLabel: "monthly salary", semanticUnit: "rupees" },
    ],
    values: [
      [3, 18, 12], [4, 24, 16], [2, 20, 15], [150, 300, 200],
      [125, 500, 175], [20, 5, 40], [6, 30, 18], [7, 35, 21],
      [1, 10, 12], [140, 420, 180], [160, 640, 220], [25, 8, 50],
      [8, 48, 24], [9, 54, 27], [3, 30, 18], [175, 700, 250],
      [200, 800, 300], [30, 9, 60], [11, 66, 33], [12, 72, 36],
      [4, 40, 20], [225, 900, 275], [250, 1000, 350], [35, 7, 70],
      [13, 78, 39], [14, 84, 42], [5, 50, 25], [300, 1200, 400],
      [180, 720, 240], [40, 6, 80],
    ],
    weakStudent: false,
  },
] as const;

function materializeBlueprints(): readonly ConfirmationCorpusItem[] {
  const items: ConfirmationCorpusItem[] = [];
  for (const blueprint of BLUEPRINTS) {
    blueprint.values.forEach(([knownRate, knownValue, targetRate], index) => {
      const context = blueprint.contexts[index % blueprint.contexts.length]!;
      items.push({
        confirmationId: `QUAL-001-C1:${blueprint.category}:${String(index + 1).padStart(2, "0")}`,
        category: blueprint.category,
        expectation: blueprint.expectation,
        knownRate,
        knownValue,
        targetRate,
        detailMode: modes[(index + blueprint.contexts.length) % modes.length]!,
        ...context,
        weakStudent: blueprint.weakStudent,
      });
    });
  }
  return items;
}

export const CONFIRMATION_CORPUS = materializeBlueprints();

const fatigueContexts = [
  ["number", "abstract-number", "abstract"],
  ["monthly salary", "rupees", "money"],
  ["annual income", "rupees", "money"],
  ["students", "students", "count"],
  ["workers", "workers", "count"],
  ["total books", "books", "count"],
  ["distance", "kilometres", "continuous"],
  ["area", "square metres", "continuous"],
  ["population", "people", "continuous"],
  ["exam marks", "marks", "continuous"],
] as const;

export const CONFIRMATION_FATIGUE_CORPUS:
  readonly ConfirmationCorpusItem[] = Array.from(
    { length: 500 },
    (_, index) => {
      const context = fatigueContexts[(index * 7) % fatigueContexts.length]!;
      const knownRate = 5 + ((index * 17) % 81);
      let targetRate = 5 + ((index * 23) % 91);
      if (targetRate === knownRate) targetRate = Math.min(100, targetRate + 3);
      const money = context[2] === "money";
      const count = context[2] === "count";
      const knownValue = money
        ? 5_000 + ((index * 1_273) % 95_000)
        : count
          ? knownRate * (2 + (index % 23))
          : 50 + ((index * 137) % 50_000);
      return {
        confirmationId: `QUAL-001-C1:FATIGUE:${String(index + 1).padStart(3, "0")}`,
        category: "ABSTRACT",
        expectation: "RENDER",
        knownRate,
        knownValue,
        targetRate,
        detailMode: modes[(index * 2) % modes.length]!,
        contextKind: context[2],
        contextLabel: context[0],
        semanticUnit: context[1],
        weakStudent: index % 5 === 0,
      };
    },
  );

export function confirmationSignature(
  item: Pick<
    ConfirmationCorpusItem,
    | "knownRate"
    | "knownValue"
    | "targetRate"
    | "detailMode"
    | "contextLabel"
    | "semanticUnit"
  >,
): string {
  return [
    item.knownRate,
    item.knownValue,
    item.targetRate,
    item.detailMode,
    item.contextLabel,
    item.semanticUnit,
  ].join("|");
}
