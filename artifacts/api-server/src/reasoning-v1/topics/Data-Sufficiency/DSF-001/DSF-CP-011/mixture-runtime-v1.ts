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
import { compareRational, formatRational, rational, rationalKey } from "../../../../../quant-v4/topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/foundation/rational.ts";
import type { BlendComponent, MalCp001SolveResult, Rational } from "../../../../../quant-v4/topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/foundation/types.ts";

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
  | "LOWER_VALUE_EXACT" | "HIGHER_VALUE_EXACT" | "LOWER_QUANTITY_EXACT" | "HIGHER_QUANTITY_EXACT"
  | "MEAN_EXACT" | "TOTAL_QUANTITY_EXACT" | "RATIO_EXACT" | "VALUE_PAIR" | "QUANTITY_PAIR"
  | "LOWER_MEAN_PAIR" | "LOWER_QUANTITY_MEAN_PAIR" | "TOTAL_MEAN_PAIR" | "FULL_BLEND_DATA"
  | "UNKNOWN_VALUE_DATA" | "UNKNOWN_QUANTITY_DATA" | "RECONSTRUCTION_DATA" | "BLEND_BOUND"
  | "BASE_VALUE_EXACT" | "BASE_QUANTITY_EXACT" | "ADDED_VALUE_EXACT" | "TARGET_MEAN_EXACT"
  | "ADDED_QUANTITY_EXACT" | "BASE_STATE_PAIR" | "ADDED_TARGET_PAIR" | "FULL_ADDITION_DATA" | "ADDITION_BOUND";

interface Context {
  readonly id: ContextId;
  readonly material: string;
  readonly unit: "kg" | "litres";
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
  { id: "RICE_GRADES", material: "rice", unit: "kg", intro: ["Two grades of rice are mixed.", "A merchant prepares a blend using two rice grades.", "Consider a mixture made from two grades of rice.", "The composition of a rice mixture is being examined."] },
  { id: "TEA_GRADES", material: "tea", unit: "kg", intro: ["Two grades of tea are blended.", "A shopkeeper prepares a blend using two tea grades.", "Consider a mixture made from two grades of tea.", "The composition of a tea blend is being examined."] },
  { id: "COFFEE_BEANS", material: "coffee beans", unit: "kg", intro: ["Two grades of coffee beans are blended.", "A seller prepares a blend using two coffee-bean grades.", "Consider a mixture made from two grades of coffee beans.", "The composition of a coffee-bean blend is being reviewed."] },
  { id: "COOKING_OIL", material: "cooking oil", unit: "litres", intro: ["Two grades of cooking oil are mixed.", "A dealer prepares a blend using two grades of cooking oil.", "Consider a mixture made from two grades of cooking oil.", "The composition of a cooking-oil blend is being checked."] },
  { id: "SPICE_BLEND", material: "spice mix", unit: "kg", intro: ["Two grades of spice mix are blended.", "A merchant prepares a blend using two spice grades.", "Consider a mixture made from two grades of spice mix.", "The composition of a spice blend is being examined."] },
  { id: "DRY_FRUIT_BLEND", material: "dry fruit", unit: "kg", intro: ["Two grades of dry fruit are blended.", "A seller prepares a blend using two dry-fruit grades.", "Consider a mixture made from two grades of dry fruit.", "The composition of a dry-fruit blend is being reviewed."] },
] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  for (const ch of `${DSF_CP011_MIXTURE_RUNTIME_VERSION}:${seed}:${salt}`) {
    hash ^= ch.charCodeAt(0);
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

function component(id: string, quantity: Rational, value: Rational): BlendComponent {
  return { id, label: id, quantity, value };
}

function expectMean(result: MalCp001SolveResult) {
  if (result.kind !== "MEAN_VALUE") throw new Error(`Expected MEAN_VALUE, received ${result.kind}`);
  return result;
}

function enumerateBlendWorlds(): readonly BlendWorld[] {
  const worlds: BlendWorld[] = [];
  for (const lowerValue of [20, 30, 40, 50] as const) {
    for (const higherValue of [60, 70, 80, 90] as const) {
      for (const lowerQuantity of [2, 3, 4, 5, 6] as const) {
        for (const higherQuantity of [2, 3, 4, 5, 6] as const) {
          const lv = rational(lowerValue), hv = rational(higherValue), lq = rational(lowerQuantity), hq = rational(higherQuantity);
          const mean = expectMean(solveMalCp001({
            mode: "MEAN_FROM_COMPONENTS",
            components: [component("L", lq, lv), component("H", hq, hv)],
          }));
          const ratio = solveMalCp001({ mode: "TWO_COMPONENT_RATIO_FROM_TARGET", lowerValue: lv, higherValue: hv, targetValue: mean.value });
          if (ratio.kind !== "COMPONENT_RATIO") throw new Error("Expected canonical component ratio.");
          worlds.push({
            kind: "BLEND",
            lowerValue: lv,
            higherValue: hv,
            lowerQuantity: lq,
            higherQuantity: hq,
            meanValue: mean.value,
            totalQuantity: mean.state.totalQuantity,
            ratioFirst: ratio.firstPart,
            ratioSecond: ratio.secondPart,
          });
        }
      }
    }
  }
  return worlds;
}

function enumerateAdditionWorlds(): readonly AdditionWorld[] {
  const worlds: AdditionWorld[] = [];
  for (const baseValue of [20, 30, 40, 50] as const) {
    for (const addedValue of [60, 70, 80, 90] as const) {
      for (const baseQuantity of [2, 3, 4, 5, 6] as const) {
        for (const addedQuantity of [2, 3, 4, 5, 6] as const) {
          const bv = rational(baseValue), av = rational(addedValue), bq = rational(baseQuantity), aq = rational(addedQuantity);
          const mean = expectMean(solveMalCp001({
            mode: "MEAN_FROM_COMPONENTS",
            components: [component("B", bq, bv), component("A", aq, av)],
          }));
          worlds.push({ kind: "ADDITION", baseValue: bv, baseQuantity: bq, addedValue: av, addedQuantity: aq, targetMean: mean.value });
        }
      }
    }
  }
  return worlds;
}

const BLEND_WORLDS = enumerateBlendWorlds();
const ADDITION_WORLDS = enumerateAdditionWorlds();
const SOURCE_ANSWER_CACHE = new Map<string, string>();

const eq = (a: Rational, b: Rational) => compareRational(a, b) === 0;
const num = (value: Rational) => Number(value.numerator) / Number(value.denominator);
const pairKey = (a: Rational, b: Rational) => `${rationalKey(a)}:${rationalKey(b)}`;

function sourceAnswer(problem: MixtureProblem, world: MixtureWorld): string {
  const cacheKey = `${problem.solveMode}|${world.kind}|${JSON.stringify(Object.fromEntries(Object.entries(world).filter(([key]) => key !== "kind").map(([key, value]) => [key, typeof value === "object" && value && "numerator" in value ? rationalKey(value as Rational) : value])))}`;
  const cached = SOURCE_ANSWER_CACHE.get(cacheKey);
  if (cached) return cached;

  let answer: string;
  if (problem.solveMode === "DSF-SM-MAL-ADD-QUANTITY-TO-TARGET") {
    if (world.kind !== "ADDITION") throw new Error("Addition mode received blend world.");
    const result = solveMalCp001({
      mode: "ADD_SOURCE_TO_REACH_TARGET",
      initialComponents: [component("B", world.baseQuantity, world.baseValue)],
      addedComponentId: "A",
      addedComponentLabel: "A",
      addedValue: world.addedValue,
      targetValue: world.targetMean,
    });
    if (result.kind !== "COMPONENT_QUANTITY") throw new Error("Expected canonical added quantity.");
    answer = `${rationalKey(result.quantity)} quantity`;
  } else {
    if (world.kind !== "BLEND") throw new Error("Blend mode received addition world.");
    switch (problem.solveMode) {
      case "DSF-SM-MAL-MEAN-FROM-COMPONENTS": {
        const result = solveMalCp001({ mode: "MEAN_FROM_COMPONENTS", components: [component("L", world.lowerQuantity, world.lowerValue), component("H", world.higherQuantity, world.higherValue)] });
        if (result.kind !== "MEAN_VALUE") throw new Error("Expected canonical mean.");
        answer = `${rationalKey(result.value)} mean`;
        break;
      }
      case "DSF-SM-MAL-RATIO-FROM-TARGET": {
        const result = solveMalCp001({ mode: "TWO_COMPONENT_RATIO_FROM_TARGET", lowerValue: world.lowerValue, higherValue: world.higherValue, targetValue: world.meanValue });
        if (result.kind !== "COMPONENT_RATIO") throw new Error("Expected canonical ratio.");
        answer = `${pairKey(result.firstPart, result.secondPart)} ratio`;
        break;
      }
      case "DSF-SM-MAL-UNKNOWN-SOURCE-VALUE": {
        const result = solveMalCp001({ mode: "UNKNOWN_COMPONENT_VALUE", knownComponents: [component("L", world.lowerQuantity, world.lowerValue)], unknownComponentId: "H", unknownComponentLabel: "H", unknownQuantity: world.higherQuantity, targetValue: world.meanValue });
        if (result.kind !== "SOURCE_VALUE") throw new Error("Expected canonical source value.");
        answer = `${rationalKey(result.value)} source-value`;
        break;
      }
      case "DSF-SM-MAL-UNKNOWN-COMPONENT-QUANTITY": {
        const result = solveMalCp001({ mode: "UNKNOWN_COMPONENT_QUANTITY", knownComponents: [component("L", world.lowerQuantity, world.lowerValue)], unknownComponentId: "H", unknownComponentLabel: "H", unknownValue: world.higherValue, targetValue: world.meanValue });
        if (result.kind !== "COMPONENT_QUANTITY") throw new Error("Expected canonical component quantity.");
        answer = `${rationalKey(result.quantity)} quantity`;
        break;
      }
      case "DSF-SM-MAL-TWO-QUANTITIES-FROM-TOTAL": {
        const result = solveMalCp001({ mode: "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET", lowerComponentId: "L", lowerComponentLabel: "L", lowerValue: world.lowerValue, higherComponentId: "H", higherComponentLabel: "H", higherValue: world.higherValue, totalQuantity: world.totalQuantity, targetValue: world.meanValue });
        if (result.kind !== "COMPONENT_QUANTITY_PAIR") throw new Error("Expected canonical quantity pair.");
        answer = `${pairKey(result.firstQuantity, result.secondQuantity)} quantity-pair`;
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

function st(id: string, family: StatementFamily, complexity: 1 | 2 | 3, text: string, test: (world: MixtureWorld) => boolean): MixtureStatement {
  return { id, family, complexity, text, test };
}

function blendStatements(a: BlendWorld, c: Context): readonly MixtureStatement[] {
  const lv = num(a.lowerValue), hv = num(a.higherValue), lq = num(a.lowerQuantity), hq = num(a.higherQuantity), total = num(a.totalQuantity);
  const mean = formatRational(a.meanValue), ratio = `${formatRational(a.ratioFirst)}:${formatRational(a.ratioSecond)}`;
  return [
    st(`LV_${lv}`, "LOWER_VALUE_EXACT", 1, `The cheaper grade costs ₹${lv} per unit.`, w => w.kind === "BLEND" && eq(w.lowerValue, a.lowerValue)),
    st(`HV_${hv}`, "HIGHER_VALUE_EXACT", 1, `The costlier grade costs ₹${hv} per unit.`, w => w.kind === "BLEND" && eq(w.higherValue, a.higherValue)),
    st(`LQ_${lq}`, "LOWER_QUANTITY_EXACT", 1, `The cheaper grade contributes ${lq} ${c.unit}.`, w => w.kind === "BLEND" && eq(w.lowerQuantity, a.lowerQuantity)),
    st(`HQ_${hq}`, "HIGHER_QUANTITY_EXACT", 1, `The costlier grade contributes ${hq} ${c.unit}.`, w => w.kind === "BLEND" && eq(w.higherQuantity, a.higherQuantity)),
    st(`M_${rationalKey(a.meanValue)}`, "MEAN_EXACT", 1, `The final mean cost is ₹${mean} per unit.`, w => w.kind === "BLEND" && eq(w.meanValue, a.meanValue)),
    st(`T_${total}`, "TOTAL_QUANTITY_EXACT", 1, `The total mixture quantity is ${total} ${c.unit}.`, w => w.kind === "BLEND" && eq(w.totalQuantity, a.totalQuantity)),
    st(`R_${pairKey(a.ratioFirst, a.ratioSecond)}`, "RATIO_EXACT", 1, `The cheaper and costlier grades are mixed in the ratio ${ratio}.`, w => w.kind === "BLEND" && eq(w.ratioFirst, a.ratioFirst) && eq(w.ratioSecond, a.ratioSecond)),
    st(`VP_${lv}_${hv}`, "VALUE_PAIR", 2, `The two grades cost ₹${lv} and ₹${hv} per unit.`, w => w.kind === "BLEND" && eq(w.lowerValue, a.lowerValue) && eq(w.higherValue, a.higherValue)),
    st(`QP_${lq}_${hq}`, "QUANTITY_PAIR", 2, `The two quantities are ${lq} ${c.unit} and ${hq} ${c.unit}.`, w => w.kind === "BLEND" && eq(w.lowerQuantity, a.lowerQuantity) && eq(w.higherQuantity, a.higherQuantity)),
    st(`LM_${lv}_${rationalKey(a.meanValue)}`, "LOWER_MEAN_PAIR", 2, `The cheaper grade costs ₹${lv} per unit and the final mean is ₹${mean} per unit.`, w => w.kind === "BLEND" && eq(w.lowerValue, a.lowerValue) && eq(w.meanValue, a.meanValue)),
    st(`LQM_${lq}_${rationalKey(a.meanValue)}`, "LOWER_QUANTITY_MEAN_PAIR", 2, `The cheaper-grade quantity is ${lq} ${c.unit} and the final mean is ₹${mean} per unit.`, w => w.kind === "BLEND" && eq(w.lowerQuantity, a.lowerQuantity) && eq(w.meanValue, a.meanValue)),
    st(`TM_${total}_${rationalKey(a.meanValue)}`, "TOTAL_MEAN_PAIR", 2, `The total quantity is ${total} ${c.unit} and the final mean is ₹${mean} per unit.`, w => w.kind === "BLEND" && eq(w.totalQuantity, a.totalQuantity) && eq(w.meanValue, a.meanValue)),
    st(`FULL_${lv}_${hv}_${lq}_${hq}`, "FULL_BLEND_DATA", 3, `The grades cost ₹${lv} and ₹${hv} per unit, with quantities ${lq} and ${hq} ${c.unit}.`, w => w.kind === "BLEND" && eq(w.lowerValue, a.lowerValue) && eq(w.higherValue, a.higherValue) && eq(w.lowerQuantity, a.lowerQuantity) && eq(w.higherQuantity, a.higherQuantity)),
    st(`UV_${lv}_${lq}_${hq}_${rationalKey(a.meanValue)}`, "UNKNOWN_VALUE_DATA", 3, `The cheaper grade costs ₹${lv} per unit; quantities are ${lq} and ${hq} ${c.unit}; final mean is ₹${mean} per unit.`, w => w.kind === "BLEND" && eq(w.lowerValue, a.lowerValue) && eq(w.lowerQuantity, a.lowerQuantity) && eq(w.higherQuantity, a.higherQuantity) && eq(w.meanValue, a.meanValue)),
    st(`UQ_${lv}_${hv}_${lq}_${rationalKey(a.meanValue)}`, "UNKNOWN_QUANTITY_DATA", 3, `The grades cost ₹${lv} and ₹${hv} per unit; cheaper-grade quantity is ${lq} ${c.unit}; final mean is ₹${mean} per unit.`, w => w.kind === "BLEND" && eq(w.lowerValue, a.lowerValue) && eq(w.higherValue, a.higherValue) && eq(w.lowerQuantity, a.lowerQuantity) && eq(w.meanValue, a.meanValue)),
    st(`REC_${lv}_${hv}_${total}_${rationalKey(a.meanValue)}`, "RECONSTRUCTION_DATA", 3, `The grades cost ₹${lv} and ₹${hv} per unit; total quantity is ${total} ${c.unit}; final mean is ₹${mean} per unit.`, w => w.kind === "BLEND" && eq(w.lowerValue, a.lowerValue) && eq(w.higherValue, a.higherValue) && eq(w.totalQuantity, a.totalQuantity) && eq(w.meanValue, a.meanValue)),
    st(`LVLE_${lv}`, "BLEND_BOUND", 2, `The cheaper grade costs at most ₹${lv} per unit.`, w => w.kind === "BLEND" && compareRational(w.lowerValue, a.lowerValue) <= 0),
    st(`HQGE_${hq}`, "BLEND_BOUND", 2, `The costlier-grade quantity is at least ${hq} ${c.unit}.`, w => w.kind === "BLEND" && compareRational(w.higherQuantity, a.higherQuantity) >= 0),
  ];
}

function additionStatements(a: AdditionWorld, c: Context): readonly MixtureStatement[] {
  const bv = num(a.baseValue), bq = num(a.baseQuantity), av = num(a.addedValue), aq = num(a.addedQuantity), target = formatRational(a.targetMean);
  return [
    st(`BV_${bv}`, "BASE_VALUE_EXACT", 1, `The existing ${c.material} costs ₹${bv} per unit.`, w => w.kind === "ADDITION" && eq(w.baseValue, a.baseValue)),
    st(`BQ_${bq}`, "BASE_QUANTITY_EXACT", 1, `The existing quantity is ${bq} ${c.unit}.`, w => w.kind === "ADDITION" && eq(w.baseQuantity, a.baseQuantity)),
    st(`AV_${av}`, "ADDED_VALUE_EXACT", 1, `The grade to be added costs ₹${av} per unit.`, w => w.kind === "ADDITION" && eq(w.addedValue, a.addedValue)),
    st(`TM_${rationalKey(a.targetMean)}`, "TARGET_MEAN_EXACT", 1, `The required final mean cost is ₹${target} per unit.`, w => w.kind === "ADDITION" && eq(w.targetMean, a.targetMean)),
    st(`AQ_${aq}`, "ADDED_QUANTITY_EXACT", 1, `The required added quantity is ${aq} ${c.unit}.`, w => w.kind === "ADDITION" && eq(w.addedQuantity, a.addedQuantity)),
    st(`BASE_${bv}_${bq}`, "BASE_STATE_PAIR", 2, `The existing mixture is ${bq} ${c.unit} at ₹${bv} per unit.`, w => w.kind === "ADDITION" && eq(w.baseValue, a.baseValue) && eq(w.baseQuantity, a.baseQuantity)),
    st(`AT_${av}_${rationalKey(a.targetMean)}`, "ADDED_TARGET_PAIR", 2, `The added grade costs ₹${av} per unit and the required final mean is ₹${target} per unit.`, w => w.kind === "ADDITION" && eq(w.addedValue, a.addedValue) && eq(w.targetMean, a.targetMean)),
    st(`FULL_${bv}_${bq}_${av}_${rationalKey(a.targetMean)}`, "FULL_ADDITION_DATA", 3, `The existing mixture is ${bq} ${c.unit} at ₹${bv} per unit; the added grade costs ₹${av} per unit; target mean is ₹${target} per unit.`, w => w.kind === "ADDITION" && eq(w.baseValue, a.baseValue) && eq(w.baseQuantity, a.baseQuantity) && eq(w.addedValue, a.addedValue) && eq(w.targetMean, a.targetMean)),
    st(`BQLE_${bq}`, "ADDITION_BOUND", 2, `The existing quantity is at most ${bq} ${c.unit}.`, w => w.kind === "ADDITION" && compareRational(w.baseQuantity, a.baseQuantity) <= 0),
    st(`AVGE_${av}`, "ADDITION_BOUND", 2, `The added grade costs at least ₹${av} per unit.`, w => w.kind === "ADDITION" && compareRational(w.addedValue, a.addedValue) >= 0),
  ];
}

function statementPool(problem: MixtureProblem): readonly MixtureStatement[] {
  return problem.anchor.kind === "BLEND" ? blendStatements(problem.anchor, problem.context) : additionStatements(problem.anchor, problem.context);
}

function pairQuality(first: MixtureStatement, second: MixtureStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  return (first.family === second.family ? -5 : 5)
    + (evaluation.classification === "BOTH_TOGETHER_ONLY" ? 8 : evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER" ? 3 : 0)
    + Math.floor((Math.min(evaluation.statementI.worldCount, 80) + Math.min(evaluation.statementII.worldCount, 80)) / 30)
    - first.complexity - second.complexity;
}

function synthesizePair(problem: MixtureProblem, seed: number, targetClass: SufficiencyClass): SynthesizedPair {
  const candidates: SynthesizedPair[] = [];
  const statements = statementPool(problem);
  for (const statementI of statements) {
    for (const statementII of statements) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification === targetClass) candidates.push({ statementI, statementII, evaluation, qualityScore: pairQuality(statementI, statementII, evaluation) });
      } catch {
        // Inconsistent conjunctions are rejected.
      }
    }
  }
  if (!candidates.length) throw new Error(`No MAL-001 pair for ${problem.solveMode}/${targetClass}`);
  const best = Math.max(...candidates.map(candidate => candidate.qualityScore));
  return pick(createRng(seed, `pair:${problem.solveMode}:${targetClass}`), candidates.filter(candidate => candidate.qualityScore >= best - 2));
}

function buildProblem(seed: number, attempt: number): MixtureProblem {
  const solveMode = DSF_CP011_MIXTURE_SOLVE_MODES[Math.abs(seed) % DSF_CP011_MIXTURE_SOLVE_MODES.length]!;
  const random = createRng(seed + attempt * 65537, `problem:${solveMode}`);
  const context = pick(random, CONTEXTS);
  const intro = pick(random, context.intro);
  if (solveMode === "DSF-SM-MAL-ADD-QUANTITY-TO-TARGET") return { solveMode, targetKind: "ADDED_QUANTITY", anchor: pick(random, ADDITION_WORLDS), context, intro };
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
    case "DSF-SM-MAL-UNKNOWN-COMPONENT-QUANTITY": return "What quantity of the costlier grade is present?";
    case "DSF-SM-MAL-ADD-QUANTITY-TO-TARGET": return "What quantity of the costlier grade must be added?";
    case "DSF-SM-MAL-TWO-QUANTITIES-FROM-TOTAL": return "What are the two component quantities?";
  }
}

function explanation(label: string, answers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the asked value at ${answers[0]}. Therefore, ${label} alone is sufficient.`;
  const examples = answers.slice(0, 2);
  return examples.length >= 2
    ? `${label} permits at least two different answers, ${examples[0]} and ${examples[1]}. Therefore, ${label} alone is not sufficient.`
    : `${label} does not fix a unique answer. Therefore, ${label} alone is not sufficient.`;
}

function difficultyFor(pair: SynthesizedPair): DsfCp011MixtureDifficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  return pair.statementI.complexity === 1 && pair.statementII.complexity === 1 ? "Easy" : "Medium";
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
      pair = synthesizePair(candidate, seed + attempt * 104729, targetClass);
      problem = candidate;
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
  const together = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
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
    options: DS_STANDARD_5_EN.options.map(option => ({ key: option.key, value: option.text, semanticClass: option.semanticClass, isCorrect: option.semanticClass === evaluation.classification })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex(option => option.semanticClass === evaluation.classification),
    canonicalAnswer: evaluation.classification,
    explanation: {
      askedTarget: `We need to determine ${prompt.charAt(0).toLowerCase()}${prompt.slice(1)}`,
      statementI: explanation("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explanation("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      ...(together ? { together } : {}),
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
    generationIdentity: createHash("sha256").update(`${DSF_CP011_MIXTURE_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.context.id}|${pair.statementI.id}|${pair.statementII.id}`).digest("hex").slice(0, 24),
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
