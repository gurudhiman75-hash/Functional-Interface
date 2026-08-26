import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { solveMalCp001 } from "../../../../../quant-v4/topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/foundation/solver.ts";
import {
  compareRational,
  formatRational,
  rational,
  rationalKey,
  type Rational,
} from "../../../../../quant-v4/topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/foundation/rational.ts";
import type { BlendComponent, MalCp001SolveResult } from "../../../../../quant-v4/topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/foundation/types.ts";

export const DSF_CP011_MIXTURE_RUNTIME_VERSION = "DSF_CP011_MIXTURE_RUNTIME_V1" as const;
export const DSF_CP011_MIXTURE_SOLVE_MODES = [
  "DSF-SM-MAL-MEAN-FROM-COMPONENTS",
  "DSF-SM-MAL-RATIO-FROM-TARGET",
  "DSF-SM-MAL-UNKNOWN-SOURCE-VALUE",
  "DSF-SM-MAL-UNKNOWN-COMPONENT-QUANTITY",
  "DSF-SM-MAL-ADD-QUANTITY-TO-TARGET",
  "DSF-SM-MAL-TWO-QUANTITIES-FROM-TOTAL",
] as const;

export type DsfCp011MixtureSolveMode = (typeof DSF_CP011_MIXTURE_SOLVE_MODES)[number];
export type DsfCp011MixtureDifficulty = "Easy" | "Medium" | "Hard";
export type DsfCp011MixtureTargetKind = "MEAN_VALUE" | "COMPONENT_RATIO" | "SOURCE_VALUE" | "COMPONENT_QUANTITY" | "ADDED_QUANTITY" | "QUANTITY_PAIR";

type ContextId = "RICE_GRADES" | "TEA_GRADES" | "COFFEE_BEANS" | "COOKING_OIL" | "SPICE_BLEND" | "DRY_FRUIT_BLEND";

type StatementFamily =
  | "LOWER_VALUE_EXACT"
  | "HIGHER_VALUE_EXACT"
  | "LOWER_QUANTITY_EXACT"
  | "HIGHER_QUANTITY_EXACT"
  | "MEAN_EXACT"
  | "TOTAL_QUANTITY_EXACT"
  | "RATIO_EXACT"
  | "VALUE_PAIR"
  | "QUANTITY_PAIR"
  | "LOWER_MEAN_PAIR"
  | "LOWER_QUANTITY_MEAN_PAIR"
  | "TOTAL_MEAN_PAIR"
  | "FULL_BLEND_DATA"
  | "UNKNOWN_VALUE_DATA"
  | "UNKNOWN_QUANTITY_DATA"
  | "RECONSTRUCTION_DATA"
  | "BLEND_BOUND"
  | "BASE_VALUE_EXACT"
  | "BASE_QUANTITY_EXACT"
  | "ADDED_VALUE_EXACT"
  | "TARGET_MEAN_EXACT"
  | "ADDED_QUANTITY_EXACT"
  | "BASE_STATE_PAIR"
  | "ADDED_TARGET_PAIR"
  | "FULL_ADDITION_DATA"
  | "ADDITION_BOUND";

interface Context {
  readonly id: ContextId;
  readonly material: string;
  readonly unit: "kg" | "litres";
  readonly priceUnit: "₹/kg" | "₹/litre";
  readonly intro: readonly string[];
}

interface BlendWorld {
  readonly kind: "BLEND";
  readonly lowerValue: Rational;
  readonly higherValue: Rational;
  readonly lowerQuantity: Rational;
  readonly higherQuantity: Rational;
  readonly meanValue: Rational;
  readonly totalQuantity: Rational;
  readonly ratioFirst: Rational;
  readonly ratioSecond: Rational;
}

interface AdditionWorld {
  readonly kind: "ADDITION";
  readonly baseValue: Rational;
  readonly baseQuantity: Rational;
  readonly addedValue: Rational;
  readonly addedQuantity: Rational;
  readonly targetMean: Rational;
}

type MixtureWorld = BlendWorld | AdditionWorld;

interface MixtureProblem {
  readonly solveMode: DsfCp011MixtureSolveMode;
  readonly targetKind: DsfCp011MixtureTargetKind;
  readonly anchor: MixtureWorld;
  readonly context: Context;
  readonly intro: string;
}

interface MixtureStatement {
  readonly id: string;
  readonly family: StatementFamily;
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: MixtureWorld) => boolean;
}

interface SynthesizedPair {
  readonly statementI: MixtureStatement;
  readonly statementII: MixtureStatement;
  readonly evaluation: TwoStatementSufficiencyEvaluation<string>;
  readonly qualityScore: number;
}

const CONTEXTS: readonly Context[] = [
  { id: "RICE_GRADES", material: "rice", unit: "kg", priceUnit: "₹/kg", intro: ["Two grades of rice are mixed.", "A merchant prepares a blend using two rice grades.", "Consider a mixture made from two grades of rice.", "The composition of a two-grade rice mixture is being examined."] },
  { id: "TEA_GRADES", material: "tea", unit: "kg", priceUnit: "₹/kg", intro: ["Two grades of tea are blended.", "A shopkeeper prepares a blend using two tea grades.", "Consider a mixture made from two grades of tea.", "The composition of a two-grade tea blend is being examined."] },
  { id: "COFFEE_BEANS", material: "coffee beans", unit: "kg", priceUnit: "₹/kg", intro: ["Two grades of coffee beans are blended.", "A seller prepares a blend using two grades of coffee beans.", "Consider a mixture made from two coffee-bean grades.", "The composition of a coffee-bean blend is being reviewed."] },
  { id: "COOKING_OIL", material: "cooking oil", unit: "litres", priceUnit: "₹/litre", intro: ["Two grades of cooking oil are mixed.", "A dealer prepares a blend using two grades of cooking oil.", "Consider a mixture made from two grades of cooking oil.", "The composition of a cooking-oil blend is being checked."] },
  { id: "SPICE_BLEND", material: "spice mix", unit: "kg", priceUnit: "₹/kg", intro: ["Two grades of spice mix are blended.", "A merchant prepares a blend using two spice grades.", "Consider a mixture made from two grades of spice mix.", "The composition of a spice blend is being examined."] },
  { id: "DRY_FRUIT_BLEND", material: "dry fruit", unit: "kg", priceUnit: "₹/kg", intro: ["Two grades of dry fruit are blended.", "A seller prepares a blend using two dry-fruit grades.", "Consider a mixture made from two grades of dry fruit.", "The composition of a dry-fruit blend is being reviewed."] },
] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  const text = `${DSF_CP011_MIXTURE_RUNTIME_VERSION}:${seed}:${salt}`;
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

function component(id: string, label: string, quantity: Rational, value: Rational): BlendComponent {
  return { id, label, quantity, value };
}

function expectMean(result: MalCp001SolveResult): Extract<MalCp001SolveResult, { kind: "MEAN_VALUE" }> {
  if (result.kind !== "MEAN_VALUE") throw new Error(`Expected mean result, received ${result.kind}`);
  return result;
}

function enumerateBlendWorlds(): readonly BlendWorld[] {
  const worlds: BlendWorld[] = [];
  const lowerValues = [20, 30, 40, 50] as const;
  const higherValues = [60, 70, 80, 90] as const;
  const quantities = [2, 3, 4, 5, 6] as const;
  for (const lowerValue of lowerValues) {
    for (const higherValue of higherValues) {
      for (const lowerQuantity of quantities) {
        for (const higherQuantity of quantities) {
          const lower = rational(lowerValue), higher = rational(higherValue), lq = rational(lowerQuantity), hq = rational(higherQuantity);
          const meanResult = expectMean(solveMalCp001({
            mode: "MEAN_FROM_COMPONENTS",
            components: [component("L", "lower grade", lq, lower), component("H", "higher grade", hq, higher)],
          }));
          const ratioResult = solveMalCp001({ mode: "TWO_COMPONENT_RATIO_FROM_TARGET", lowerValue: lower, higherValue: higher, targetValue: meanResult.value });
          if (ratioResult.kind !== "COMPONENT_RATIO") throw new Error("Canonical alligation solver did not return a ratio.");
          worlds.push({
            kind: "BLEND",
            lowerValue: lower,
            higherValue: higher,
            lowerQuantity: lq,
            higherQuantity: hq,
            meanValue: meanResult.value,
            totalQuantity: meanResult.state.totalQuantity,
            ratioFirst: ratioResult.firstPart,
            ratioSecond: ratioResult.secondPart,
          });
        }
      }
    }
  }
  return worlds;
}

function enumerateAdditionWorlds(): readonly AdditionWorld[] {
  const worlds: AdditionWorld[] = [];
  const baseValues = [20, 30, 40, 50] as const;
  const addedValues = [60, 70, 80, 90] as const;
  const quantities = [2, 3, 4, 5, 6] as const;
  for (const baseValue of baseValues) {
    for (const addedValue of addedValues) {
      for (const baseQuantity of quantities) {
        for (const addedQuantity of quantities) {
          const base = rational(baseValue), added = rational(addedValue), bq = rational(baseQuantity), aq = rational(addedQuantity);
          const mean = expectMean(solveMalCp001({
            mode: "MEAN_FROM_COMPONENTS",
            components: [component("B", "base grade", bq, base), component("A", "added grade", aq, added)],
          })).value;
          worlds.push({ kind: "ADDITION", baseValue: base, baseQuantity: bq, addedValue: added, addedQuantity: aq, targetMean: mean });
        }
      }
    }
  }
  return worlds;
}

const BLEND_WORLDS = enumerateBlendWorlds();
const ADDITION_WORLDS = enumerateAdditionWorlds();
const SOURCE_ANSWER_CACHE = new Map<string, string>();

function eq(a: Rational, b: Rational): boolean {
  return compareRational(a, b) === 0;
}

function num(value: Rational): number {
  return Number(value.numerator) / Number(value.denominator);
}

function ratioKey(a: Rational, b: Rational): string {
  return `${rationalKey(a)}:${rationalKey(b)}`;
}

function sourceAnswer(problem: MixtureProblem, world: MixtureWorld): string {
  const cacheKey = world.kind === "BLEND"
    ? `${problem.solveMode}|B|${rationalKey(world.lowerValue)}|${rationalKey(world.higherValue)}|${rationalKey(world.lowerQuantity)}|${rationalKey(world.higherQuantity)}`
    : `${problem.solveMode}|A|${rationalKey(world.baseValue)}|${rationalKey(world.addedValue)}|${rationalKey(world.baseQuantity)}|${rationalKey(world.addedQuantity)}`;
  const cached = SOURCE_ANSWER_CACHE.get(cacheKey);
  if (cached) return cached;
  let answer: string;
  if (problem.solveMode === "DSF-SM-MAL-ADD-QUANTITY-TO-TARGET") {
    if (world.kind !== "ADDITION") throw new Error("Addition mode received blend world.");
    const result = solveMalCp001({
      mode: "ADD_SOURCE_TO_REACH_TARGET",
      initialComponents: [component("B", "base grade", world.baseQuantity, world.baseValue)],
      addedComponentId: "A",
      addedComponentLabel: "added grade",
      addedValue: world.addedValue,
      targetValue: world.targetMean,
    });
    if (result.kind !== "COMPONENT_QUANTITY") throw new Error("Canonical addition solver returned an unexpected result.");
    answer = `${rationalKey(result.quantity)} quantity`;
  } else {
    if (world.kind !== "BLEND") throw new Error("Blend mode received addition world.");
    switch (problem.solveMode) {
      case "DSF-SM-MAL-MEAN-FROM-COMPONENTS": {
        const result = solveMalCp001({
          mode: "MEAN_FROM_COMPONENTS",
          components: [component("L", "lower grade", world.lowerQuantity, world.lowerValue), component("H", "higher grade", world.higherQuantity, world.higherValue)],
        });
        if (result.kind !== "MEAN_VALUE") throw new Error("Canonical mean solver returned an unexpected result.");
        answer = `${rationalKey(result.value)} mean-value`;
        break;
      }
      case "DSF-SM-MAL-RATIO-FROM-TARGET": {
        const result = solveMalCp001({ mode: "TWO_COMPONENT_RATIO_FROM_TARGET", lowerValue: world.lowerValue, higherValue: world.higherValue, targetValue: world.meanValue });
        if (result.kind !== "COMPONENT_RATIO") throw new Error("Canonical alligation solver returned an unexpected result.");
        answer = `${ratioKey(result.firstPart, result.secondPart)} ratio`;
        break;
      }
      case "DSF-SM-MAL-UNKNOWN-SOURCE-VALUE": {
        const result = solveMalCp001({
          mode: "UNKNOWN_COMPONENT_VALUE",
          knownComponents: [component("L", "lower grade", world.lowerQuantity, world.lowerValue)],
          unknownComponentId: "H",
          unknownComponentLabel: "higher grade",
          unknownQuantity: world.higherQuantity,
          targetValue: world.meanValue,
        });
        if (result.kind !== "SOURCE_VALUE") throw new Error("Canonical unknown-value solver returned an unexpected result.");
        answer = `${rationalKey(result.value)} source-value`;
        break;
      }
      case "DSF-SM-MAL-UNKNOWN-COMPONENT-QUANTITY": {
        const result = solveMalCp001({
          mode: "UNKNOWN_COMPONENT_QUANTITY",
          knownComponents: [component("L", "lower grade", world.lowerQuantity, world.lowerValue)],
          unknownComponentId: "H",
          unknownComponentLabel: "higher grade",
          unknownValue: world.higherValue,
          targetValue: world.meanValue,
        });
        if (result.kind !== "COMPONENT_QUANTITY") throw new Error("Canonical unknown-quantity solver returned an unexpected result.");
        answer = `${rationalKey(result.quantity)} quantity`;
        break;
      }
      case "DSF-SM-MAL-TWO-QUANTITIES-FROM-TOTAL": {
        const result = solveMalCp001({
          mode: "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET",
          lowerComponentId: "L",
          lowerComponentLabel: "lower grade",
          lowerValue: world.lowerValue,
          higherComponentId: "H",
          higherComponentLabel: "higher grade",
          higherValue: world.higherValue,
          totalQuantity: world.totalQuantity,
          targetValue: world.meanValue,
        });
        if (result.kind !== "COMPONENT_QUANTITY_PAIR") throw new Error("Canonical reconstruction solver returned an unexpected result.");
        answer = `${ratioKey(result.firstQuantity, result.secondQuantity)} quantity-pair`;
        break;
      }
    }
  }
  SOURCE_ANSWER_CACHE.set(cacheKey, answer);
  return answer;
}

function baseWorlds(problem: MixtureProblem): readonly MixtureWorld[] {
  return problem.solveMode === "DSF-SM-MAL-ADD-QUANTITY-TO-TARGET" ? ADDITION_WORLDS : BLEND_WORLDS;
}

const adapter = {
  adapterId: "DSF-CP011-MAL-001-SOURCE-BOUND",
  domainFamily: "QUANT" as const,
  sourceChapterId: "MAL-001",
  enumerateBaseWorlds: baseWorlds,
  statementHolds: (_problem: MixtureProblem, world: MixtureWorld, statement: MixtureStatement) => statement.test(world),
  evaluateTarget: (problem: MixtureProblem, world: MixtureWorld) => sourceAnswer(problem, world),
  normalizeAnswer: (answer: string) => answer,
};

function statement(id: string, family: StatementFamily, complexity: 1 | 2 | 3, text: string, test: (world: MixtureWorld) => boolean): MixtureStatement {
  return { id, family, complexity, text, test };
}

function buildBlendStatements(anchor: BlendWorld, context: Context): readonly MixtureStatement[] {
  const lv = num(anchor.lowerValue), hv = num(anchor.higherValue), lq = num(anchor.lowerQuantity), hq = num(anchor.higherQuantity), mean = formatRational(anchor.meanValue), total = num(anchor.totalQuantity);
  const ratio = `${formatRational(anchor.ratioFirst)}:${formatRational(anchor.ratioSecond)}`;
  return [
    statement(`LV_${lv}`, "LOWER_VALUE_EXACT", 1, `The cheaper grade costs ₹${lv} per ${context.unit === "kg" ? "kg" : "litre"}.`, (w) => w.kind === "BLEND" && eq(w.lowerValue, anchor.lowerValue)),
    statement(`HV_${hv}`, "HIGHER_VALUE_EXACT", 1, `The costlier grade costs ₹${hv} per ${context.unit === "kg" ? "kg" : "litre"}.`, (w) => w.kind === "BLEND" && eq(w.higherValue, anchor.higherValue)),
    statement(`LQ_${lq}`, "LOWER_QUANTITY_EXACT", 1, `The cheaper grade contributes ${lq} ${context.unit}.`, (w) => w.kind === "BLEND" && eq(w.lowerQuantity, anchor.lowerQuantity)),
    statement(`HQ_${hq}`, "HIGHER_QUANTITY_EXACT", 1, `The costlier grade contributes ${hq} ${context.unit}.`, (w) => w.kind === "BLEND" && eq(w.higherQuantity, anchor.higherQuantity)),
    statement(`MEAN_${rationalKey(anchor.meanValue)}`, "MEAN_EXACT", 1, `The mixture's mean cost is ₹${mean} per ${context.unit === "kg" ? "kg" : "litre"}.`, (w) => w.kind === "BLEND" && eq(w.meanValue, anchor.meanValue)),
    statement(`TOTAL_${total}`, "TOTAL_QUANTITY_EXACT", 1, `The total mixture quantity is ${total} ${context.unit}.`, (w) => w.kind === "BLEND" && eq(w.totalQuantity, anchor.totalQuantity)),
    statement(`RATIO_${ratioKey(anchor.ratioFirst, anchor.ratioSecond)}`, "RATIO_EXACT", 1, `The cheaper and costlier grades are mixed in the ratio ${ratio}.`, (w) => w.kind === "BLEND" && eq(w.ratioFirst, anchor.ratioFirst) && eq(w.ratioSecond, anchor.ratioSecond)),
    statement(`VP_${lv}_${hv}`, "VALUE_PAIR", 2, `The two grades cost ₹${lv} and ₹${hv} per ${context.unit === "kg" ? "kg" : "litre"}.`, (w) => w.kind === "BLEND" && eq(w.lowerValue, anchor.lowerValue) && eq(w.higherValue, anchor.higherValue)),
    statement(`QP_${lq}_${hq}`, "QUANTITY_PAIR", 2, `The two quantities are ${lq} ${context.unit} and ${hq} ${context.unit}.`, (w) => w.kind === "BLEND" && eq(w.lowerQuantity, anchor.lowerQuantity) && eq(w.higherQuantity, anchor.higherQuantity)),
    statement(`LM_${lv}_${rationalKey(anchor.meanValue)}`, "LOWER_MEAN_PAIR", 2, `The cheaper grade costs ₹${lv} per unit and the final mean cost is ₹${mean} per unit.`, (w) => w.kind === "BLEND" && eq(w.lowerValue, anchor.lowerValue) && eq(w.meanValue, anchor.meanValue)),
    statement(`LQM_${lq}_${rationalKey(anchor.meanValue)}`, "LOWER_QUANTITY_MEAN_PAIR", 2, `The cheaper-grade quantity is ${lq} ${context.unit} and the final mean cost is ₹${mean} per unit.`, (w) => w.kind === "BLEND" && eq(w.lowerQuantity, anchor.lowerQuantity) && eq(w.meanValue, anchor.meanValue)),
    statement(`TM_${total}_${rationalKey(anchor.meanValue)}`, "TOTAL_MEAN_PAIR", 2, `The mixture totals ${total} ${context.unit} and its mean cost is ₹${mean} per unit.`, (w) => w.kind === "BLEND" && eq(w.totalQuantity, anchor.totalQuantity) && eq(w.meanValue, anchor.meanValue)),
    statement(`FULL_${lv}_${hv}_${lq}_${hq}`, "FULL_BLEND_DATA", 3, `The grades cost ₹${lv} and ₹${hv} per unit, and their quantities are ${lq} and ${hq} ${context.unit}.`, (w) => w.kind === "BLEND" && eq(w.lowerValue, anchor.lowerValue) && eq(w.higherValue, anchor.higherValue) && eq(w.lowerQuantity, anchor.lowerQuantity) && eq(w.higherQuantity, anchor.higherQuantity)),
    statement(`UV_${lv}_${lq}_${hq}_${rationalKey(anchor.meanValue)}`, "UNKNOWN_VALUE_DATA", 3, `The cheaper grade costs ₹${lv} per unit; the quantities are ${lq} and ${hq} ${context.unit}; the final mean is ₹${mean} per unit.`, (w) => w.kind === "BLEND" && eq(w.lowerValue, anchor.lowerValue) && eq(w.lowerQuantity, anchor.lowerQuantity) && eq(w.higherQuantity, anchor.higherQuantity) && eq(w.meanValue, anchor.meanValue)),
    statement(`UQ_${lv}_${hv}_${lq}_${rationalKey(anchor.meanValue)}`, "UNKNOWN_QUANTITY_DATA", 3, `The grades cost ₹${lv} and ₹${hv} per unit; the cheaper-grade quantity is ${lq} ${context.unit}; the final mean is ₹${mean} per unit.`, (w) => w.kind === "BLEND" && eq(w.lowerValue, anchor.lowerValue) && eq(w.higherValue, anchor.higherValue) && eq(w.lowerQuantity, anchor.lowerQuantity) && eq(w.meanValue, anchor.meanValue)),
    statement(`REC_${lv}_${hv}_${total}_${rationalKey(anchor.meanValue)}`, "RECONSTRUCTION_DATA", 3, `The grades cost ₹${lv} and ₹${hv} per unit; total quantity is ${total} ${context.unit}; mean cost is ₹${mean} per unit.`, (w) => w.kind === "BLEND" && eq(w.lowerValue, anchor.lowerValue) && eq(w.higherValue, anchor.higherValue) && eq(w.totalQuantity, anchor.totalQuantity) && eq(w.meanValue, anchor.meanValue)),
    statement(`LV_LE_${lv}`, "BLEND_BOUND", 2, `The cheaper grade costs at most ₹${lv} per unit.`, (w) => w.kind === "BLEND" && compareRational(w.lowerValue, anchor.lowerValue) <= 0),
    statement(`HQ_GE_${hq}`, "BLEND_BOUND", 2, `The costlier-grade quantity is at least ${hq} ${context.unit}.`, (w) => w.kind === "BLEND" && compareRational(w.higherQuantity, anchor.higherQuantity) >= 0),
  ];
}

function buildAdditionStatements(anchor: AdditionWorld, context: Context): readonly MixtureStatement[] {
  const bv = num(anchor.baseValue), bq = num(anchor.baseQuantity), av = num(anchor.addedValue), aq = num(anchor.addedQuantity), target = formatRational(anchor.targetMean);
  return [
    statement(`BV_${bv}`, "BASE_VALUE_EXACT", 1, `The existing ${context.material} costs ₹${bv} per unit.`, (w) => w.kind === "ADDITION" && eq(w.baseValue, anchor.baseValue)),
    statement(`BQ_${bq}`, "BASE_QUANTITY_EXACT", 1, `The existing quantity is ${bq} ${context.unit}.`, (w) => w.kind === "ADDITION" && eq(w.baseQuantity, anchor.baseQuantity)),
    statement(`AV_${av}`, "ADDED_VALUE_EXACT", 1, `The grade to be added costs ₹${av} per unit.`, (w) => w.kind === "ADDITION" && eq(w.addedValue, anchor.addedValue)),
    statement(`TM_${rationalKey(anchor.targetMean)}`, "TARGET_MEAN_EXACT", 1, `The required final mean cost is ₹${target} per unit.`, (w) => w.kind === "ADDITION" && eq(w.targetMean, anchor.targetMean)),
    statement(`AQ_${aq}`, "ADDED_QUANTITY_EXACT", 1, `The required added quantity is ${aq} ${context.unit}.`, (w) => w.kind === "ADDITION" && eq(w.addedQuantity, anchor.addedQuantity)),
    statement(`BASE_${bv}_${bq}`, "BASE_STATE_PAIR", 2, `The existing mixture is ${bq} ${context.unit} at ₹${bv} per unit.`, (w) => w.kind === "ADDITION" && eq(w.baseValue, anchor.baseValue) && eq(w.baseQuantity, anchor.baseQuantity)),
    statement(`AT_${av}_${rationalKey(anchor.targetMean)}`, "ADDED_TARGET_PAIR", 2, `The added grade costs ₹${av} per unit and the required final mean is ₹${target} per unit.`, (w) => w.kind === "ADDITION" && eq(w.addedValue, anchor.addedValue) && eq(w.targetMean, anchor.targetMean)),
    statement(`FULL_${bv}_${bq}_${av}_${rationalKey(anchor.targetMean)}`, "FULL_ADDITION_DATA", 3, `The existing mixture is ${bq} ${context.unit} at ₹${bv} per unit; the added grade costs ₹${av} per unit; target mean is ₹${target} per unit.`, (w) => w.kind === "ADDITION" && eq(w.baseValue, anchor.baseValue) && eq(w.baseQuantity, anchor.baseQuantity) && eq(w.addedValue, anchor.addedValue) && eq(w.targetMean, anchor.targetMean)),
    statement(`BQ_LE_${bq}`, "ADDITION_BOUND", 2, `The existing quantity is at most ${bq} ${context.unit}.`, (w) => w.kind === "ADDITION" && compareRational(w.baseQuantity, anchor.baseQuantity) <= 0),
    statement(`AV_GE_${av}`, "ADDITION_BOUND", 2, `The added grade costs at least ₹${av} per unit.`, (w) => w.kind === "ADDITION" && compareRational(w.addedValue, anchor.addedValue) >= 0),
  ];
}

function buildStatementPool(problem: MixtureProblem): readonly MixtureStatement[] {
  return problem.anchor.kind === "BLEND" ? buildBlendStatements(problem.anchor, problem.context) : buildAdditionStatements(problem.anchor, problem.context);
}

function pairQuality(first: MixtureStatement, second: MixtureStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  const familyBonus = first.family === second.family ? -5 : 5;
  const classBonus = evaluation.classification === "BOTH_TOGETHER_ONLY" ? 8 : evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER" ? 3 : 0;
  const breadth = Math.min(evaluation.statementI.worldCount, 80) + Math.min(evaluation.statementII.worldCount, 80);
  return familyBonus + classBonus + Math.floor(breadth / 30) - first.complexity - second.complexity;
}

function synthesizePair(problem: MixtureProblem, seed: number, targetClass: SufficiencyClass): SynthesizedPair {
  const statements = buildStatementPool(problem);
  const candidates: SynthesizedPair[] = [];
  for (const statementI of statements) {
    for (const statementII of statements) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification !== targetClass) continue;
        candidates.push({ statementI, statementII, evaluation, qualityScore: pairQuality(statementI, statementII, evaluation) });
      } catch {
        // Empty conjunctions are generation rejects.
      }
    }
  }
  if (candidates.length === 0) throw new Error(`No MAL-001 pair for ${problem.solveMode}/${targetClass}`);
  const best = Math.max(...candidates.map((candidate) => candidate.qualityScore));
  const shortlist = candidates.filter((candidate) => candidate.qualityScore >= best - 2);
  return pick(createRng(seed, `pair:${problem.solveMode}:${targetClass}`), shortlist);
}

function buildProblem(seed: number, attempt: number): MixtureProblem {
  const solveMode = DSF_CP011_MIXTURE_SOLVE_MODES[Math.abs(seed) % DSF_CP011_MIXTURE_SOLVE_MODES.length]!;
  const random = createRng(seed + attempt * 65537, `problem:${solveMode}`);
  const context = pick(random, CONTEXTS);
  const intro = pick(random, context.intro);
  if (solveMode === "DSF-SM-MAL-ADD-QUANTITY-TO-TARGET") {
    return { solveMode, targetKind: "ADDED_QUANTITY", anchor: pick(random, ADDITION_WORLDS), context, intro };
  }
  const targetKind: DsfCp011MixtureTargetKind = solveMode === "DSF-SM-MAL-MEAN-FROM-COMPONENTS" ? "MEAN_VALUE"
    : solveMode === "DSF-SM-MAL-RATIO-FROM-TARGET" ? "COMPONENT_RATIO"
      : solveMode === "DSF-SM-MAL-UNKNOWN-SOURCE-VALUE" ? "SOURCE_VALUE"
        : solveMode === "DSF-SM-MAL-UNKNOWN-COMPONENT-QUANTITY" ? "COMPONENT_QUANTITY"
          : "QUANTITY_PAIR";
  return { solveMode, targetKind, anchor: pick(random, BLEND_WORLDS), context, intro };
}

function targetPrompt(problem: MixtureProblem): string {
  switch (problem.solveMode) {
    case "DSF-SM-MAL-MEAN-FROM-COMPONENTS": return "What is the mean cost of the final mixture?";
    case "DSF-SM-MAL-RATIO-FROM-TARGET": return "In what ratio are the cheaper and costlier grades mixed?";
    case "DSF-SM-MAL-UNKNOWN-SOURCE-VALUE": return "What is the cost per unit of the costlier grade?";
    case "DSF-SM-MAL-UNKNOWN-COMPONENT-QUANTITY": return `What quantity of the costlier grade is present?`;
    case "DSF-SM-MAL-ADD-QUANTITY-TO-TARGET": return `What quantity of the costlier grade must be added?`;
    case "DSF-SM-MAL-TWO-QUANTITIES-FROM-TOTAL": return "What are the two component quantities?";
  }
}

function explanationForStatement(label: string, answers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the asked value at ${answers[0]}. Therefore, ${label} alone is sufficient.`;
  const examples = answers.slice(0, 2);
  if (examples.length >= 2) return `${label} permits at least two different answers, ${examples[0]} and ${examples[1]}. Therefore, ${label} alone is not sufficient.`;
  return `${label} does not fix a unique answer. Therefore, ${label} alone is not sufficient.`;
}

function difficultyFor(pair: SynthesizedPair): DsfCp011MixtureDifficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.statementI.complexity === 1 && pair.statementII.complexity === 1) return "Easy";
  return "Medium";
}

function generationIdentity(seed: number, problem: MixtureProblem, pair: SynthesizedPair): string {
  return createHash("sha256")
    .update(`${DSF_CP011_MIXTURE_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.context.id}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex")
    .slice(0, 24);
}

export function normalizeDsfCp011MixtureSurface(text: string): string {
  return text.toLowerCase().replace(/\d+(?:\.\d+)?(?:\/\d+)?/g, "#").replace(/[^a-z#]+/g, " ").trim().replace(/\s+/g, " ");
}

export function generateDsfCp011MixtureQuestion(seed: number) {
  const targetClass = desiredClass(seed);
  let problem: MixtureProblem | undefined;
  let pair: SynthesizedPair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const candidate = buildProblem(seed, attempt);
    try {
      const candidatePair = synthesizePair(candidate, seed + attempt * 104729, targetClass);
      problem = candidate;
      pair = candidatePair;
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize MAL-001 DS question for seed ${seed}`);

  const evaluation = pair.evaluation;
  const prompt = targetPrompt(problem);
  const stem = `${problem.intro} ${prompt}`;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const togetherExplanation = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? (evaluation.together.sufficient
      ? `Using both statements together fixes the asked value at ${evaluation.together.normalizedTargetAnswers[0]}. So the two statements together are sufficient.`
      : `Even together, the statements allow different answers such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" and ")}. So they are still insufficient.`)
    : undefined;

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-011" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP011_MIXTURE_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "QUANT" as const,
    sourceChapterId: "MAL-001" as const,
    sourceCapability: "MAL-001/foundation/solver::solveMalCp001" as const,
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
    options: DS_STANDARD_5_EN.options.map((option) => ({ key: option.key, value: option.text, semanticClass: option.semanticClass, isCorrect: option.semanticClass === evaluation.classification })),
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
      sourceSolver: "solveMalCp001" as const,
      canonicalArithmeticOwnedByDsf: false as const,
    },
    sourceAncestry: ["MAL-001", "MAL-001/foundation/solver::solveMalCp001"] as const,
    generationIdentity: generationIdentity(seed, problem, pair),
    studentSurfaceFingerprint: `${normalizeDsfCp011MixtureSurface(stem)}|${problem.solveMode}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: {
      contentStatus: "CP011_EXPANSION_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

export function generateDsfCp011MixtureBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp011MixtureQuestion);
}
