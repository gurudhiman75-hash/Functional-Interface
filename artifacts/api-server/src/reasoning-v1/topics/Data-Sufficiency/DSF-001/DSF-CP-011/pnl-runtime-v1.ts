import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { solveFundamental } from "../../../../../quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/solver.ts";
import { solveDiscount } from "../../../../../quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/discount-solver.ts";
import { moneyFromRupees } from "../../../../../quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/money.ts";
import { rational } from "../../../../../quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/rational.ts";
import type { Money, Rational } from "../../../../../quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/types.ts";

export const DSF_CP011_PNL_RUNTIME_VERSION = "DSF_CP011_PNL_RUNTIME_V1" as const;
export const DSF_CP011_PNL_SOLVE_MODES = [
  "DSF-SM-PNL-SP-FROM-CP-RATE",
  "DSF-SM-PNL-CP-FROM-SP-RATE",
  "DSF-SM-PNL-RATE-FROM-CP-SP",
  "DSF-SM-DISCOUNT-SP-FROM-MP-RATE",
  "DSF-SM-DISCOUNT-RATE-FROM-MP-SP",
  "DSF-SM-DISCOUNT-MP-FROM-SP-RATE",
] as const;

export type DsfCp011PnlSolveMode = (typeof DSF_CP011_PNL_SOLVE_MODES)[number];
export type DsfCp011PnlDifficulty = "Easy" | "Medium" | "Hard";
export type DsfCp011PnlTargetKind =
  | "SELLING_PRICE"
  | "COST_PRICE"
  | "PROFIT_LOSS_RATE"
  | "DISCOUNT_SELLING_PRICE"
  | "DISCOUNT_PERCENT"
  | "MARKED_PRICE";

type PnlContextId =
  | "BOOKSHOP"
  | "GARMENT_STORE"
  | "ELECTRONICS_COUNTER"
  | "FURNITURE_OUTLET"
  | "SPORTS_SHOP"
  | "STATIONERY_WHOLESALER";

type FundamentalStatementFamily =
  | "COST_PRICE_EXACT"
  | "SELLING_PRICE_EXACT"
  | "RATE_EXACT"
  | "DIRECTION_ONLY"
  | "COST_RATE_PAIR"
  | "SELLING_RATE_PAIR"
  | "COST_SELLING_PAIR"
  | "COST_PRICE_BOUND"
  | "SELLING_PRICE_BOUND"
  | "RATE_BOUND"
  | "COST_PRICE_CONGRUENCE";

type DiscountStatementFamily =
  | "MARKED_PRICE_EXACT"
  | "SELLING_PRICE_EXACT"
  | "DISCOUNT_EXACT"
  | "MARKED_DISCOUNT_PAIR"
  | "SELLING_DISCOUNT_PAIR"
  | "MARKED_SELLING_PAIR"
  | "MARKED_PRICE_BOUND"
  | "SELLING_PRICE_BOUND"
  | "DISCOUNT_BOUND"
  | "DISCOUNT_CONGRUENCE";

type StatementFamily = FundamentalStatementFamily | DiscountStatementFamily;

interface PnlContext {
  readonly id: PnlContextId;
  readonly itemNoun: string;
  readonly intro: readonly string[];
}

interface FundamentalWorld {
  readonly kind: "FUNDAMENTAL";
  readonly costPriceRupees: number;
  readonly sellingPriceRupees: number;
  readonly direction: "PROFIT" | "LOSS";
  readonly ratePercent: number;
}

interface DiscountWorld {
  readonly kind: "DISCOUNT";
  readonly markedPriceRupees: number;
  readonly sellingPriceRupees: number;
  readonly discountPercent: number;
}

type PnlWorld = FundamentalWorld | DiscountWorld;

interface PnlProblem {
  readonly anchor: PnlWorld;
  readonly worldKind: PnlWorld["kind"];
  readonly solveMode: DsfCp011PnlSolveMode;
  readonly targetKind: DsfCp011PnlTargetKind;
  readonly context: PnlContext;
  readonly surfaceVariant: number;
}

interface PnlStatement {
  readonly id: string;
  readonly family: StatementFamily;
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: PnlWorld) => boolean;
}

interface SynthesizedPnlPair {
  readonly statementI: PnlStatement;
  readonly statementII: PnlStatement;
  readonly evaluation: TwoStatementSufficiencyEvaluation<string>;
  readonly qualityScore: number;
}

const CONTEXTS: readonly PnlContext[] = [
  {
    id: "BOOKSHOP",
    itemNoun: "book set",
    intro: [
      "A bookseller is reviewing the price details of a book set.",
      "The purchase and sale details of a book set are under consideration.",
      "Consider one book set handled by a bookseller.",
      "A book set has been priced for sale by a retailer.",
    ],
  },
  {
    id: "GARMENT_STORE",
    itemNoun: "garment",
    intro: [
      "A garment store is checking the price details of one garment.",
      "Consider a garment purchased and offered for sale by a retailer.",
      "The pricing record of a garment is being examined.",
      "A retailer is analysing the purchase and sale of a garment.",
    ],
  },
  {
    id: "ELECTRONICS_COUNTER",
    itemNoun: "electronic item",
    intro: [
      "An electronics counter is reviewing the pricing of an item.",
      "Consider an electronic item stocked by a retailer.",
      "The price details of one electronic item are being checked.",
      "A retailer has recorded the purchase and sale details of an electronic item.",
    ],
  },
  {
    id: "FURNITURE_OUTLET",
    itemNoun: "furniture item",
    intro: [
      "A furniture outlet is analysing the price of one item.",
      "Consider a furniture item offered for sale by a retailer.",
      "The pricing details of a furniture item are under review.",
      "A retailer is checking the purchase and sale record of a furniture item.",
    ],
  },
  {
    id: "SPORTS_SHOP",
    itemNoun: "sports item",
    intro: [
      "A sports shop is reviewing the pricing of one item.",
      "Consider a sports item purchased and sold by a retailer.",
      "The purchase and selling details of a sports item are being examined.",
      "A retailer is checking the price record of a sports item.",
    ],
  },
  {
    id: "STATIONERY_WHOLESALER",
    itemNoun: "stationery pack",
    intro: [
      "A stationery wholesaler is reviewing the pricing of a pack.",
      "Consider a stationery pack handled by a wholesaler.",
      "The purchase and sale details of a stationery pack are being checked.",
      "A wholesaler is analysing the price record of a stationery pack.",
    ],
  },
] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  const text = `${DSF_CP011_PNL_RUNTIME_VERSION}:${seed}:${salt}`;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number, salt: string): () => number {
  let state = hashSeed(seed, salt) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function pick<T>(random: () => number, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)]!;
}

function desiredClass(seed: number): SufficiencyClass {
  return SUFFICIENCY_CLASSES[Math.abs(seed) % SUFFICIENCY_CLASSES.length]!;
}

function moneyRupees(value: Money): number {
  if (value.paise % 100n !== 0n) {
    throw new Error(`CP011 PNL audit world expected whole rupees, received ${value.paise} paise.`);
  }
  return Number(value.paise / 100n);
}

function rationalKey(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

function rationalLabel(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function moneyAnswer(value: Money): string {
  const rupees = moneyRupees(value);
  return `₹${rupees}`;
}

function enumerateFundamentalWorlds(): readonly FundamentalWorld[] {
  const worlds: FundamentalWorld[] = [];
  const rates = [5, 10, 15, 20, 25, 30, 40] as const;
  for (let costPriceRupees = 200; costPriceRupees <= 1200; costPriceRupees += 100) {
    for (const direction of ["PROFIT", "LOSS"] as const) {
      for (const ratePercent of rates) {
        const solved = solveFundamental({
          mode: "CP_RATE_TO_SP",
          costPrice: moneyFromRupees(costPriceRupees),
          direction,
          ratePercent: rational(ratePercent),
        });
        worlds.push({
          kind: "FUNDAMENTAL",
          costPriceRupees,
          sellingPriceRupees: moneyRupees(solved.sellingPrice),
          direction,
          ratePercent,
        });
      }
    }
  }
  return worlds;
}

function enumerateDiscountWorlds(): readonly DiscountWorld[] {
  const worlds: DiscountWorld[] = [];
  const discounts = [5, 10, 15, 20, 25, 30, 40, 50] as const;
  for (let markedPriceRupees = 400; markedPriceRupees <= 1600; markedPriceRupees += 100) {
    for (const discountPercent of discounts) {
      const solved = solveDiscount({
        mode: "MP_DISCOUNT_TO_SP",
        markedPrice: moneyFromRupees(markedPriceRupees),
        discountPercent: rational(discountPercent),
      });
      worlds.push({
        kind: "DISCOUNT",
        markedPriceRupees,
        sellingPriceRupees: moneyRupees(solved.sellingPrice),
        discountPercent,
      });
    }
  }
  return worlds;
}

const FUNDAMENTAL_WORLDS = enumerateFundamentalWorlds();
const DISCOUNT_WORLDS = enumerateDiscountWorlds();
const SOURCE_ANSWER_CACHE = new Map<string, string>();

function sourceAnswer(problem: PnlProblem, world: PnlWorld): string {
  const cacheKey = world.kind === "FUNDAMENTAL"
    ? `${problem.solveMode}|F|${world.costPriceRupees}|${world.sellingPriceRupees}|${world.direction}|${world.ratePercent}`
    : `${problem.solveMode}|D|${world.markedPriceRupees}|${world.sellingPriceRupees}|${world.discountPercent}`;
  const cached = SOURCE_ANSWER_CACHE.get(cacheKey);
  if (cached) return cached;

  let answer: string;
  switch (problem.solveMode) {
    case "DSF-SM-PNL-SP-FROM-CP-RATE": {
      if (world.kind !== "FUNDAMENTAL") throw new Error("Fundamental PNL mode received discount world.");
      const solved = solveFundamental({
        mode: "CP_RATE_TO_SP",
        costPrice: moneyFromRupees(world.costPriceRupees),
        direction: world.direction,
        ratePercent: rational(world.ratePercent),
      });
      answer = moneyAnswer(solved.sellingPrice);
      break;
    }
    case "DSF-SM-PNL-CP-FROM-SP-RATE": {
      if (world.kind !== "FUNDAMENTAL") throw new Error("Fundamental PNL mode received discount world.");
      const solved = solveFundamental({
        mode: "SP_RATE_TO_CP",
        sellingPrice: moneyFromRupees(world.sellingPriceRupees),
        direction: world.direction,
        ratePercent: rational(world.ratePercent),
      });
      answer = moneyAnswer(solved.costPrice);
      break;
    }
    case "DSF-SM-PNL-RATE-FROM-CP-SP": {
      if (world.kind !== "FUNDAMENTAL") throw new Error("Fundamental PNL mode received discount world.");
      const solved = solveFundamental({
        mode: "CP_SP_TO_RATE",
        costPrice: moneyFromRupees(world.costPriceRupees),
        sellingPrice: moneyFromRupees(world.sellingPriceRupees),
      });
      answer = `${solved.direction}:${rationalKey(solved.ratePercent)}`;
      break;
    }
    case "DSF-SM-DISCOUNT-SP-FROM-MP-RATE": {
      if (world.kind !== "DISCOUNT") throw new Error("Discount mode received fundamental PNL world.");
      const solved = solveDiscount({
        mode: "MP_DISCOUNT_TO_SP",
        markedPrice: moneyFromRupees(world.markedPriceRupees),
        discountPercent: rational(world.discountPercent),
      });
      answer = moneyAnswer(solved.sellingPrice);
      break;
    }
    case "DSF-SM-DISCOUNT-RATE-FROM-MP-SP": {
      if (world.kind !== "DISCOUNT") throw new Error("Discount mode received fundamental PNL world.");
      const solved = solveDiscount({
        mode: "MP_SP_TO_DISCOUNT",
        markedPrice: moneyFromRupees(world.markedPriceRupees),
        sellingPrice: moneyFromRupees(world.sellingPriceRupees),
      });
      answer = `${rationalKey(solved.discountPercent)}%`;
      break;
    }
    case "DSF-SM-DISCOUNT-MP-FROM-SP-RATE": {
      if (world.kind !== "DISCOUNT") throw new Error("Discount mode received fundamental PNL world.");
      const solved = solveDiscount({
        mode: "SP_DISCOUNT_TO_MP",
        sellingPrice: moneyFromRupees(world.sellingPriceRupees),
        discountPercent: rational(world.discountPercent),
      });
      answer = moneyAnswer(solved.markedPrice);
      break;
    }
  }
  SOURCE_ANSWER_CACHE.set(cacheKey, answer);
  return answer;
}

const adapter = {
  adapterId: "DSF-ADAPTER-PNL-001-CP011-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "PNL-001",
  enumerateBaseWorlds(problem: PnlProblem): readonly PnlWorld[] {
    return problem.worldKind === "FUNDAMENTAL" ? FUNDAMENTAL_WORLDS : DISCOUNT_WORLDS;
  },
  statementHolds(_problem: PnlProblem, world: PnlWorld, statement: PnlStatement): boolean {
    return statement.test(world);
  },
  evaluateTarget(problem: PnlProblem, world: PnlWorld): string {
    return sourceAnswer(problem, world);
  },
  normalizeAnswer(answer: string): string {
    return answer;
  },
};

function modeTarget(mode: DsfCp011PnlSolveMode): { worldKind: PnlWorld["kind"]; targetKind: DsfCp011PnlTargetKind } {
  switch (mode) {
    case "DSF-SM-PNL-SP-FROM-CP-RATE": return { worldKind: "FUNDAMENTAL", targetKind: "SELLING_PRICE" };
    case "DSF-SM-PNL-CP-FROM-SP-RATE": return { worldKind: "FUNDAMENTAL", targetKind: "COST_PRICE" };
    case "DSF-SM-PNL-RATE-FROM-CP-SP": return { worldKind: "FUNDAMENTAL", targetKind: "PROFIT_LOSS_RATE" };
    case "DSF-SM-DISCOUNT-SP-FROM-MP-RATE": return { worldKind: "DISCOUNT", targetKind: "DISCOUNT_SELLING_PRICE" };
    case "DSF-SM-DISCOUNT-RATE-FROM-MP-SP": return { worldKind: "DISCOUNT", targetKind: "DISCOUNT_PERCENT" };
    case "DSF-SM-DISCOUNT-MP-FROM-SP-RATE": return { worldKind: "DISCOUNT", targetKind: "MARKED_PRICE" };
  }
}

function buildProblem(seed: number, attempt = 0): PnlProblem {
  const mode = DSF_CP011_PNL_SOLVE_MODES[Math.abs(seed + attempt * 17) % DSF_CP011_PNL_SOLVE_MODES.length]!;
  const { worldKind, targetKind } = modeTarget(mode);
  const worlds = worldKind === "FUNDAMENTAL" ? FUNDAMENTAL_WORLDS : DISCOUNT_WORLDS;
  const random = createRng(seed + attempt * 7919, `problem:${mode}`);
  const anchor = pick(random, worlds);
  const context = CONTEXTS[Math.abs(Math.floor(seed / DSF_CP011_PNL_SOLVE_MODES.length) + attempt) % CONTEXTS.length]!;
  const surfaceVariant = Math.abs(Math.floor(seed / (DSF_CP011_PNL_SOLVE_MODES.length * CONTEXTS.length)) + attempt) % context.intro.length;
  return { anchor, worldKind, solveMode: mode, targetKind, context, surfaceVariant };
}

function buildFundamentalStatementPool(problem: PnlProblem, anchor: FundamentalWorld): readonly PnlStatement[] {
  const item = problem.context.itemNoun;
  const costLow = Math.max(100, anchor.costPriceRupees - 200);
  const costHigh = anchor.costPriceRupees + 200;
  const sellingLow = Math.max(50, anchor.sellingPriceRupees - 150);
  const sellingHigh = anchor.sellingPriceRupees + 150;
  const rateLow = Math.max(0, anchor.ratePercent - 10);
  const rateHigh = Math.min(50, anchor.ratePercent + 10);
  const rateWord = anchor.direction === "PROFIT" ? "profit" : "loss";
  return [
    {
      id: `CP_EQ_${anchor.costPriceRupees}`,
      family: "COST_PRICE_EXACT",
      complexity: 1,
      text: `The cost price of the ${item} is ₹${anchor.costPriceRupees}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.costPriceRupees === anchor.costPriceRupees,
    },
    {
      id: `SP_EQ_${anchor.sellingPriceRupees}`,
      family: "SELLING_PRICE_EXACT",
      complexity: 1,
      text: `The selling price of the ${item} is ₹${anchor.sellingPriceRupees}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.sellingPriceRupees === anchor.sellingPriceRupees,
    },
    {
      id: `RATE_EQ_${anchor.direction}_${anchor.ratePercent}`,
      family: "RATE_EXACT",
      complexity: 1,
      text: `The ${item} is sold at a ${anchor.ratePercent}% ${rateWord}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.direction === anchor.direction && world.ratePercent === anchor.ratePercent,
    },
    {
      id: `DIRECTION_${anchor.direction}`,
      family: "DIRECTION_ONLY",
      complexity: 1,
      text: `The sale of the ${item} results in a ${rateWord}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.direction === anchor.direction,
    },
    {
      id: `CP_RATE_${anchor.costPriceRupees}_${anchor.direction}_${anchor.ratePercent}`,
      family: "COST_RATE_PAIR",
      complexity: 2,
      text: `The cost price is ₹${anchor.costPriceRupees}, and the ${item} is sold at a ${anchor.ratePercent}% ${rateWord}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.costPriceRupees === anchor.costPriceRupees && world.direction === anchor.direction && world.ratePercent === anchor.ratePercent,
    },
    {
      id: `SP_RATE_${anchor.sellingPriceRupees}_${anchor.direction}_${anchor.ratePercent}`,
      family: "SELLING_RATE_PAIR",
      complexity: 2,
      text: `The selling price is ₹${anchor.sellingPriceRupees}, and the transaction gives a ${anchor.ratePercent}% ${rateWord}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.sellingPriceRupees === anchor.sellingPriceRupees && world.direction === anchor.direction && world.ratePercent === anchor.ratePercent,
    },
    {
      id: `CP_SP_${anchor.costPriceRupees}_${anchor.sellingPriceRupees}`,
      family: "COST_SELLING_PAIR",
      complexity: 2,
      text: `The ${item} costs ₹${anchor.costPriceRupees} and is sold for ₹${anchor.sellingPriceRupees}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.costPriceRupees === anchor.costPriceRupees && world.sellingPriceRupees === anchor.sellingPriceRupees,
    },
    {
      id: `CP_GT_${costLow}`,
      family: "COST_PRICE_BOUND",
      complexity: 2,
      text: `The cost price of the ${item} is greater than ₹${costLow}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.costPriceRupees > costLow,
    },
    {
      id: `CP_LT_${costHigh}`,
      family: "COST_PRICE_BOUND",
      complexity: 2,
      text: `The cost price of the ${item} is less than ₹${costHigh}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.costPriceRupees < costHigh,
    },
    {
      id: `SP_GT_${sellingLow}`,
      family: "SELLING_PRICE_BOUND",
      complexity: 2,
      text: `The selling price of the ${item} is greater than ₹${sellingLow}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.sellingPriceRupees > sellingLow,
    },
    {
      id: `SP_LT_${sellingHigh}`,
      family: "SELLING_PRICE_BOUND",
      complexity: 2,
      text: `The selling price of the ${item} is less than ₹${sellingHigh}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.sellingPriceRupees < sellingHigh,
    },
    {
      id: `RATE_GT_${anchor.direction}_${rateLow}`,
      family: "RATE_BOUND",
      complexity: 2,
      text: `The transaction is a ${rateWord}, and the ${rateWord} rate is greater than ${rateLow}%.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.direction === anchor.direction && world.ratePercent > rateLow,
    },
    {
      id: `RATE_LT_${anchor.direction}_${rateHigh}`,
      family: "RATE_BOUND",
      complexity: 2,
      text: `The transaction is a ${rateWord}, and the ${rateWord} rate is less than ${rateHigh}%.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.direction === anchor.direction && world.ratePercent < rateHigh,
    },
    {
      id: `CP_MOD200_${anchor.costPriceRupees % 200}`,
      family: "COST_PRICE_CONGRUENCE",
      complexity: 3,
      text: `Among ₹200 blocks, the cost price has the same remainder as ₹${anchor.costPriceRupees}.`,
      test: (world) => world.kind === "FUNDAMENTAL" && world.costPriceRupees % 200 === anchor.costPriceRupees % 200,
    },
  ];
}

function buildDiscountStatementPool(problem: PnlProblem, anchor: DiscountWorld): readonly PnlStatement[] {
  const item = problem.context.itemNoun;
  const markedLow = Math.max(100, anchor.markedPriceRupees - 200);
  const markedHigh = anchor.markedPriceRupees + 200;
  const sellingLow = Math.max(50, anchor.sellingPriceRupees - 150);
  const sellingHigh = anchor.sellingPriceRupees + 150;
  const discountLow = Math.max(0, anchor.discountPercent - 10);
  const discountHigh = Math.min(60, anchor.discountPercent + 10);
  return [
    {
      id: `MP_EQ_${anchor.markedPriceRupees}`,
      family: "MARKED_PRICE_EXACT",
      complexity: 1,
      text: `The marked price of the ${item} is ₹${anchor.markedPriceRupees}.`,
      test: (world) => world.kind === "DISCOUNT" && world.markedPriceRupees === anchor.markedPriceRupees,
    },
    {
      id: `DSP_EQ_${anchor.sellingPriceRupees}`,
      family: "SELLING_PRICE_EXACT",
      complexity: 1,
      text: `After discount, the ${item} is sold for ₹${anchor.sellingPriceRupees}.`,
      test: (world) => world.kind === "DISCOUNT" && world.sellingPriceRupees === anchor.sellingPriceRupees,
    },
    {
      id: `DISC_EQ_${anchor.discountPercent}`,
      family: "DISCOUNT_EXACT",
      complexity: 1,
      text: `A discount of ${anchor.discountPercent}% is allowed on the marked price.`,
      test: (world) => world.kind === "DISCOUNT" && world.discountPercent === anchor.discountPercent,
    },
    {
      id: `MP_DISC_${anchor.markedPriceRupees}_${anchor.discountPercent}`,
      family: "MARKED_DISCOUNT_PAIR",
      complexity: 2,
      text: `The marked price is ₹${anchor.markedPriceRupees}, and the allowed discount is ${anchor.discountPercent}%.`,
      test: (world) => world.kind === "DISCOUNT" && world.markedPriceRupees === anchor.markedPriceRupees && world.discountPercent === anchor.discountPercent,
    },
    {
      id: `DSP_DISC_${anchor.sellingPriceRupees}_${anchor.discountPercent}`,
      family: "SELLING_DISCOUNT_PAIR",
      complexity: 2,
      text: `The ${item} sells for ₹${anchor.sellingPriceRupees} after a ${anchor.discountPercent}% discount.`,
      test: (world) => world.kind === "DISCOUNT" && world.sellingPriceRupees === anchor.sellingPriceRupees && world.discountPercent === anchor.discountPercent,
    },
    {
      id: `MP_DSP_${anchor.markedPriceRupees}_${anchor.sellingPriceRupees}`,
      family: "MARKED_SELLING_PAIR",
      complexity: 2,
      text: `The marked price is ₹${anchor.markedPriceRupees}, while the post-discount selling price is ₹${anchor.sellingPriceRupees}.`,
      test: (world) => world.kind === "DISCOUNT" && world.markedPriceRupees === anchor.markedPriceRupees && world.sellingPriceRupees === anchor.sellingPriceRupees,
    },
    {
      id: `MP_GT_${markedLow}`,
      family: "MARKED_PRICE_BOUND",
      complexity: 2,
      text: `The marked price of the ${item} is greater than ₹${markedLow}.`,
      test: (world) => world.kind === "DISCOUNT" && world.markedPriceRupees > markedLow,
    },
    {
      id: `MP_LT_${markedHigh}`,
      family: "MARKED_PRICE_BOUND",
      complexity: 2,
      text: `The marked price of the ${item} is less than ₹${markedHigh}.`,
      test: (world) => world.kind === "DISCOUNT" && world.markedPriceRupees < markedHigh,
    },
    {
      id: `DSP_GT_${sellingLow}`,
      family: "SELLING_PRICE_BOUND",
      complexity: 2,
      text: `The post-discount selling price is greater than ₹${sellingLow}.`,
      test: (world) => world.kind === "DISCOUNT" && world.sellingPriceRupees > sellingLow,
    },
    {
      id: `DSP_LT_${sellingHigh}`,
      family: "SELLING_PRICE_BOUND",
      complexity: 2,
      text: `The post-discount selling price is less than ₹${sellingHigh}.`,
      test: (world) => world.kind === "DISCOUNT" && world.sellingPriceRupees < sellingHigh,
    },
    {
      id: `DISC_GT_${discountLow}`,
      family: "DISCOUNT_BOUND",
      complexity: 2,
      text: `The discount is greater than ${discountLow}%.`,
      test: (world) => world.kind === "DISCOUNT" && world.discountPercent > discountLow,
    },
    {
      id: `DISC_LT_${discountHigh}`,
      family: "DISCOUNT_BOUND",
      complexity: 2,
      text: `The discount is less than ${discountHigh}%.`,
      test: (world) => world.kind === "DISCOUNT" && world.discountPercent < discountHigh,
    },
    {
      id: `DISC_MOD10_${anchor.discountPercent % 10}`,
      family: "DISCOUNT_CONGRUENCE",
      complexity: 3,
      text: `The discount percentage leaves remainder ${anchor.discountPercent % 10} when divided by 10.`,
      test: (world) => world.kind === "DISCOUNT" && world.discountPercent % 10 === anchor.discountPercent % 10,
    },
  ];
}

function buildStatementPool(problem: PnlProblem): readonly PnlStatement[] {
  return problem.anchor.kind === "FUNDAMENTAL"
    ? buildFundamentalStatementPool(problem, problem.anchor)
    : buildDiscountStatementPool(problem, problem.anchor);
}

function baseWorlds(problem: PnlProblem): readonly PnlWorld[] {
  return problem.worldKind === "FUNDAMENTAL" ? FUNDAMENTAL_WORLDS : DISCOUNT_WORLDS;
}

function survivors(problem: PnlProblem, statement: PnlStatement): readonly PnlWorld[] {
  return baseWorlds(problem).filter(statement.test);
}

function pairQuality(problem: PnlProblem, first: PnlStatement, second: PnlStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  const familyBonus = first.family === second.family ? -5 : 6;
  const conjunctionBonus = evaluation.classification === "BOTH_TOGETHER_ONLY" ? 9 : 0;
  const insufficientBonus = evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER" ? 4 : 0;
  const complexityVariety = first.complexity === second.complexity ? 0 : 2;
  const breadth = Math.min(survivors(problem, first).length, 45) + Math.min(survivors(problem, second).length, 45);
  return familyBonus + conjunctionBonus + insufficientBonus + complexityVariety + Math.floor(breadth / 18) - first.complexity - second.complexity;
}

function synthesizePair(problem: PnlProblem, seed: number, targetClass: SufficiencyClass): SynthesizedPnlPair {
  const statements = buildStatementPool(problem);
  const candidates: SynthesizedPnlPair[] = [];
  for (const statementI of statements) {
    for (const statementII of statements) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification !== targetClass) continue;
        candidates.push({
          statementI,
          statementII,
          evaluation,
          qualityScore: pairQuality(problem, statementI, statementII, evaluation),
        });
      } catch {
        // Empty conjunctions and invariant failures are generation rejects.
      }
    }
  }
  if (candidates.length === 0) throw new Error(`No PNL-001 pair for ${targetClass}/${problem.solveMode}`);
  const best = Math.max(...candidates.map((candidate) => candidate.qualityScore));
  const shortlist = candidates.filter((candidate) => candidate.qualityScore >= best - 3);
  return pick(createRng(seed, `pair:${targetClass}:${problem.solveMode}`), shortlist);
}

function targetPrompt(problem: PnlProblem): string {
  switch (problem.targetKind) {
    case "SELLING_PRICE": return `What is the selling price of the ${problem.context.itemNoun}?`;
    case "COST_PRICE": return `What is the cost price of the ${problem.context.itemNoun}?`;
    case "PROFIT_LOSS_RATE": return `What is the profit or loss percentage on the cost price of the ${problem.context.itemNoun}?`;
    case "DISCOUNT_SELLING_PRICE": return `What is the selling price of the ${problem.context.itemNoun} after discount?`;
    case "DISCOUNT_PERCENT": return `What discount percentage is allowed on the ${problem.context.itemNoun}?`;
    case "MARKED_PRICE": return `What is the marked price of the ${problem.context.itemNoun}?`;
  }
}

function explanationForStatement(label: string, targetAnswers: readonly string[], sufficient: boolean): string {
  if (sufficient) {
    return `${label} fixes the asked value at ${targetAnswers[0]}. Therefore, ${label} alone is sufficient.`;
  }
  const examples = targetAnswers.slice(0, 2);
  if (examples.length >= 2) {
    return `${label} permits at least two different answers, ${examples[0]} and ${examples[1]}. Therefore, ${label} alone is not sufficient.`;
  }
  return `${label} does not fix a unique answer. Therefore, ${label} alone is not sufficient.`;
}

function difficultyFor(pair: SynthesizedPnlPair): DsfCp011PnlDifficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  const minComplexity = Math.min(pair.statementI.complexity, pair.statementII.complexity);
  if (minComplexity === 1 && (pair.evaluation.classification === "STATEMENT_I_ONLY" || pair.evaluation.classification === "STATEMENT_II_ONLY")) return "Easy";
  return "Medium";
}

function generationIdentity(seed: number, problem: PnlProblem, pair: SynthesizedPnlPair): string {
  return createHash("sha256")
    .update(`${DSF_CP011_PNL_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.context.id}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex")
    .slice(0, 24);
}

export function normalizeDsfCp011PnlSurface(text: string): string {
  return text
    .toLowerCase()
    .replace(/₹\s*/g, "₹")
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/[^a-z#₹%]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function sourceSolverName(problem: PnlProblem): "solveFundamental" | "solveDiscount" {
  return problem.worldKind === "FUNDAMENTAL" ? "solveFundamental" : "solveDiscount";
}

function sourceTaskMode(problem: PnlProblem): string {
  switch (problem.solveMode) {
    case "DSF-SM-PNL-SP-FROM-CP-RATE": return "CP_RATE_TO_SP";
    case "DSF-SM-PNL-CP-FROM-SP-RATE": return "SP_RATE_TO_CP";
    case "DSF-SM-PNL-RATE-FROM-CP-SP": return "CP_SP_TO_RATE";
    case "DSF-SM-DISCOUNT-SP-FROM-MP-RATE": return "MP_DISCOUNT_TO_SP";
    case "DSF-SM-DISCOUNT-RATE-FROM-MP-SP": return "MP_SP_TO_DISCOUNT";
    case "DSF-SM-DISCOUNT-MP-FROM-SP-RATE": return "SP_DISCOUNT_TO_MP";
  }
}

export function generateDsfCp011PnlQuestion(seed: number) {
  const targetClass = desiredClass(seed);
  let problem: PnlProblem | undefined;
  let pair: SynthesizedPnlPair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 36; attempt += 1) {
    const candidateProblem = buildProblem(seed, attempt);
    try {
      const candidatePair = synthesizePair(candidateProblem, seed + attempt * 104729, targetClass);
      problem = candidateProblem;
      pair = candidatePair;
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize PNL-001 DS question for seed ${seed}`);

  const evaluation = pair.evaluation;
  const prompt = targetPrompt(problem);
  const stem = `${problem.context.intro[problem.surfaceVariant]} ${prompt}`;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const togetherExplanation = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? (evaluation.together.sufficient
      ? `Using both statements together fixes the asked value at ${evaluation.together.normalizedTargetAnswers[0]}. So the two statements together are sufficient.`
      : `Even together, the statements allow different answers such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" and ")}. So they are still insufficient.`)
    : undefined;
  const solver = sourceSolverName(problem);
  const taskMode = sourceTaskMode(problem);

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-011" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP011_PNL_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "QUANT" as const,
    sourceChapterId: "PNL-001" as const,
    sourceDomain: problem.worldKind === "FUNDAMENTAL" ? "PROFIT_LOSS" as const : "DISCOUNT" as const,
    sourceCapability: problem.worldKind === "FUNDAMENTAL"
      ? "PNL-001/foundation/solver::solveFundamental" as const
      : "PNL-001/foundation/discount-solver::solveDiscount" as const,
    solveModeId: problem.solveMode,
    targetKind: problem.targetKind,
    contextId: problem.context.id,
    answerContractId: "DS_STANDARD_5" as const,
    taskDirection: "DATA_SUFFICIENCY" as const,
    answerSemantic: "SUFFICIENCY_CLASS" as const,
    stem,
    questionPrompt: prompt,
    statements: [
      { id: "I" as const, statementRuleId: pair.statementI.id, statementFamily: pair.statementI.family, text: pair.statementI.text },
      { id: "II" as const, statementRuleId: pair.statementII.id, statementFamily: pair.statementII.family, text: pair.statementII.text },
    ] as const,
    options: DS_STANDARD_5_EN.options.map((option) => ({
      key: option.key,
      value: option.text,
      semanticClass: option.semanticClass,
      isCorrect: option.semanticClass === evaluation.classification,
    })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex((option) => option.semanticClass === evaluation.classification),
    canonicalAnswer: evaluation.classification,
    explanation: {
      askedTarget: `We need to determine ${prompt.charAt(0).toLowerCase()}${prompt.slice(1)}`,
      statementI: explanationForStatement("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explanationForStatement("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      ...(togetherExplanation ? { together: togetherExplanation } : {}),
      conclusion: correct.text,
    },
    proof: {
      baseWorldCount: baseWorlds(problem).length,
      statementIWorldCount: evaluation.statementI.worldCount,
      statementIIWorldCount: evaluation.statementII.worldCount,
      togetherWorldCount: evaluation.together.worldCount,
      statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: evaluation.minimalSufficientSets,
      sourceSolver: solver,
      sourceTaskMode: taskMode,
      canonicalArithmeticOwnedByDsf: false as const,
    },
    sourceAncestry: problem.worldKind === "FUNDAMENTAL"
      ? ["PNL-001", "PNL-001/foundation/solver::solveFundamental"] as const
      : ["PNL-001", "PNL-001/foundation/discount-solver::solveDiscount"] as const,
    generationIdentity: generationIdentity(seed, problem, pair),
    studentSurfaceFingerprint: `${normalizeDsfCp011PnlSurface(stem)}|${problem.solveMode}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: {
      contentStatus: "CP011_EXPANSION_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

export function generateDsfCp011PnlBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp011PnlQuestion);
}
