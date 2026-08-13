import { selectRnkPeople } from "../foundation/rnk-object-pool-v2";
import { selectRnkSymbolicObjects } from "../foundation/rnk-derived-object-pool-v2";

export const RNK_CP007_DERIVED_QUANTITY_VERSION =
  "RNK_CP007_DERIVED_QUANTITY_DISCOVERY_V1" as const;

export type RnkCp007DerivedQuantitySourceForm =
  | "TRANSFER_BALANCE_ORDER"
  | "SCALED_OBJECT_ORDER";

export type RnkCp007TransferMode =
  | "HIGHEST_BALANCE"
  | "LOWEST_BALANCE"
  | "SECOND_HIGHEST_BALANCE"
  | "TRUE_FINAL_RELATION";

export type RnkCp007ScaledMode =
  | "HEAVIEST_OBJECT"
  | "LIGHTEST_OBJECT"
  | "SECOND_FROM_BOTTOM"
  | "FOURTH_FROM_TOP";

export type RnkCp007DerivedQuantityMode = RnkCp007TransferMode | RnkCp007ScaledMode;

export const RNK_CP007_TRANSFER_MODES: readonly RnkCp007TransferMode[] = [
  "HIGHEST_BALANCE",
  "LOWEST_BALANCE",
  "SECOND_HIGHEST_BALANCE",
  "TRUE_FINAL_RELATION",
] as const;

export const RNK_CP007_SCALED_MODES: readonly RnkCp007ScaledMode[] = [
  "HEAVIEST_OBJECT",
  "LIGHTEST_OBJECT",
  "SECOND_FROM_BOTTOM",
  "FOURTH_FROM_TOP",
] as const;

export interface RnkCp007TransferOperation {
  readonly from: number;
  readonly to: number;
  readonly amount: number;
}

export interface RnkCp007TransferState {
  readonly initialBalance: number;
  readonly operations: readonly RnkCp007TransferOperation[];
  readonly finalBalances: readonly number[];
}

export interface RnkCp007ScaledState {
  readonly m: number;
  readonly q: number;
  readonly d: number;
  readonly fixedCoefficients: readonly [number, number, number, number];
  readonly eLowerBound: number;
  readonly roleSymbols: readonly [string, string, string, string, string, string];
  readonly witnessOrders: readonly string[][];
}

export interface RnkCp007DerivedQuantityQuestion {
  readonly discoveryVersion: typeof RNK_CP007_DERIVED_QUANTITY_VERSION;
  readonly prototypeId: "DERIVED_QUANTITY_ORDER";
  readonly sourceForm: RnkCp007DerivedQuantitySourceForm;
  readonly mode: RnkCp007DerivedQuantityMode;
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly string[];
  readonly answerIndex: 0 | 1 | 2 | 3;
  readonly answer: string;
  readonly explanation: string;
  readonly mathematicalFingerprint: string;
  readonly transferState?: RnkCp007TransferState;
  readonly scaledState?: RnkCp007ScaledState;
  readonly reviewMetadata: {
    readonly sourceBacked: true;
    readonly permanentQlAllocated: false;
    readonly arithmeticOperationCount: number;
    readonly arithmeticBurden: "LIGHT";
    readonly finalTask: "ORDER_OR_RANK";
    readonly quantDominant: false;
    readonly stateUniqueness: "UNIQUE_VALUES" | "PARTIAL_ORDER_WITH_QUERY_INVARIANT";
  };
}

function mix32(value: number): number {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function pickInt(seed: number, salt: number, min: number, max: number): number {
  return min + (mix32(seed ^ salt) % (max - min + 1));
}

function rotate<T>(values: readonly T[], amount: number): T[] {
  const n = values.length;
  const r = ((amount % n) + n) % n;
  return [...values.slice(r), ...values.slice(0, r)];
}

function placeOptions(answer: string, distractors: readonly string[], answerIndex: 0 | 1 | 2 | 3): readonly string[] {
  const uniqueDistractors = [...new Set(distractors)].filter((value) => value !== answer);
  if (uniqueDistractors.length < 3) throw new Error("Insufficient derived-quantity distractors");
  const output: string[] = [];
  let cursor = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === answerIndex) output.push(answer);
    else output.push(uniqueDistractors[cursor++]!);
  }
  if (new Set(output).size !== 4) throw new Error("Duplicate derived-quantity options");
  return output;
}

export function solveRnkCp007TransferState(
  initialBalance: number,
  operations: readonly RnkCp007TransferOperation[],
  entityCount = 4,
): readonly number[] {
  const balances = Array.from({ length: entityCount }, () => initialBalance);
  for (const operation of operations) {
    if (operation.from === operation.to) throw new Error("Transfer must change owner");
    balances[operation.from] -= operation.amount;
    balances[operation.to] += operation.amount;
    if (balances[operation.from]! < 0) throw new Error("Transfer creates a negative balance");
  }
  return balances;
}

function constructTransferState(seed: number): RnkCp007TransferState {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const localSeed = mix32(seed ^ Math.imul(attempt + 1, 0x9e3779b1));
    const initialBalance = pickInt(localSeed, 0x494e4954, 80, 180);
    const operations: RnkCp007TransferOperation[] = [];
    for (let index = 0; index < 3; index += 1) {
      const from = mix32(localSeed ^ Math.imul(index + 1, 0x46524f4d)) % 4;
      let to = mix32(localSeed ^ Math.imul(index + 1, 0x544f544f)) % 4;
      if (to === from) to = (to + 1 + index) % 4;
      const amount = 5 * pickInt(localSeed, 0x414d5400 + index, 1, 7);
      operations.push({ from, to, amount });
    }
    let finalBalances: readonly number[];
    try {
      finalBalances = solveRnkCp007TransferState(initialBalance, operations);
    } catch {
      continue;
    }
    if (new Set(finalBalances).size !== 4) continue;
    const spread = Math.max(...finalBalances) - Math.min(...finalBalances);
    if (spread < 25) continue;
    return { initialBalance, operations, finalBalances };
  }
  throw new Error(`Unable to construct transfer state for seed ${seed}`);
}

function orderIndicesDescending(values: readonly number[]): number[] {
  return values.map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value || a.index - b.index)
    .map((entry) => entry.index);
}

function generateTransferQuestion(
  mode: RnkCp007TransferMode,
  seed: number,
  answerIndex: 0 | 1 | 2 | 3,
): RnkCp007DerivedQuantityQuestion {
  const state = constructTransferState(seed);
  const people = selectRnkPeople(seed ^ 0x5452414e, 4, { genderMode: "BALANCED" });
  const names = people.map((person) => person.names.en);
  const operationText = state.operations.map((operation) =>
    `${names[operation.from]} transfers ₹${operation.amount} to ${names[operation.to]}.`,
  ).join(" ");
  const order = orderIndicesDescending(state.finalBalances);
  let stemQuestion: string;
  let answer: string;
  let distractors: string[];

  if (mode === "HIGHEST_BALANCE") {
    stemQuestion = "Who has the highest final balance?";
    answer = names[order[0]!]!;
    distractors = order.slice(1).map((index) => names[index]!);
  } else if (mode === "LOWEST_BALANCE") {
    stemQuestion = "Who has the lowest final balance?";
    answer = names[order.at(-1)!]!;
    distractors = order.slice(0, 3).map((index) => names[index]!);
  } else if (mode === "SECOND_HIGHEST_BALANCE") {
    stemQuestion = "Who has the second-highest final balance?";
    answer = names[order[1]!]!;
    distractors = [order[0]!, order[2]!, order[3]!].map((index) => names[index]!);
  } else {
    stemQuestion = "Which statement about the final balances is true?";
    const [first, second, third, fourth] = order.map((index) => names[index]!);
    answer = `${first} has more money than ${second}.`;
    distractors = [
      `${fourth} has more money than ${first}.`,
      `${third} has more money than ${second}.`,
      `${second} has less money than ${fourth}.`,
    ];
  }

  const options = placeOptions(answer, distractors, answerIndex);
  const ledger = names.map((name, index) => `${name}: ₹${state.finalBalances[index]}`).join(", ");
  const explanation = `All four start with ₹${state.initialBalance}. Apply the three transfers in order. Final balances are ${ledger}. Therefore ${answer}`;

  return {
    discoveryVersion: RNK_CP007_DERIVED_QUANTITY_VERSION,
    prototypeId: "DERIVED_QUANTITY_ORDER",
    sourceForm: "TRANSFER_BALANCE_ORDER",
    mode,
    seed,
    stem: `Four people initially have ₹${state.initialBalance} each. ${operationText} ${stemQuestion}`,
    options,
    answerIndex,
    answer,
    explanation,
    mathematicalFingerprint: `TRANSFER:${mode}:${state.initialBalance}:${state.operations.map((op) => `${op.from}>${op.to}:${op.amount}`).join("|")}`,
    transferState: state,
    reviewMetadata: {
      sourceBacked: true,
      permanentQlAllocated: false,
      arithmeticOperationCount: 3,
      arithmeticBurden: "LIGHT",
      finalTask: "ORDER_OR_RANK",
      quantDominant: false,
      stateUniqueness: "UNIQUE_VALUES",
    },
  };
}

function scaledCoefficients(seed: number): { m: number; q: number; d: number } {
  const mValues = [1.5, 1.75, 2] as const;
  const qValues = [0.25, 1 / 3, 0.4] as const;
  const dValues = [0.25, 0.5, 0.75] as const;
  for (let offset = 0; offset < 20; offset += 1) {
    const local = mix32(seed ^ offset);
    const m = mValues[local % mValues.length]!;
    const q = qValues[mix32(local ^ 0x51) % qValues.length]!;
    const d = dValues[mix32(local ^ 0x44) % dValues.length]!;
    const c = m * q;
    if (c >= 1 || d >= 1 || Math.abs(c - d) < 0.05) continue;
    return { m, q, d };
  }
  throw new Error(`Unable to choose scaled coefficients for seed ${seed}`);
}

function scaledOrder(
  symbols: readonly [string, string, string, string, string, string],
  m: number,
  q: number,
  d: number,
  eCoefficient: number,
): string[] {
  const [a, b, c, dSymbol, e, h] = symbols;
  const values: Record<string, number> = {
    [a]: 1,
    [b]: m,
    [c]: m * q,
    [dSymbol]: d,
    [e]: eCoefficient,
    [h]: 2 * eCoefficient,
  };
  return Object.entries(values).sort((x, y) => y[1] - x[1]).map(([symbol]) => symbol);
}

function constructScaledState(seed: number): RnkCp007ScaledState {
  const { m, q, d } = scaledCoefficients(seed);
  const selected = selectRnkSymbolicObjects(seed ^ 0x5343414c, 6).map((entry) => entry.symbol);
  const roleSymbols = rotate(selected, mix32(seed ^ 0x524f4c45) % selected.length) as [string, string, string, string, string, string];
  const eLowerBound = (1 + m) / 2;
  const sampleMultipliers = [1.03, 1.08, 1.16, 1.35, 1.8, 2.5];
  const candidateE = sampleMultipliers.map((factor) => eLowerBound * factor)
    .filter((value) => Math.abs(value - m) > 0.03);
  const witnessOrders = candidateE.map((e) => scaledOrder(roleSymbols, m, q, d, e));
  if (new Set(witnessOrders.map((order) => order.join(">"))).size < 2) {
    throw new Error(`Scaled state lacks genuine B/E order uncertainty for seed ${seed}`);
  }
  return {
    m,
    q,
    d,
    fixedCoefficients: [1, m, m * q, d],
    eLowerBound,
    roleSymbols,
    witnessOrders,
  };
}

export function invariantScaledRankEntity(
  state: RnkCp007ScaledState,
  rankFromTop: number,
): string | undefined {
  const entities = state.witnessOrders.map((order) => order[rankFromTop - 1]);
  return entities.every((entity) => entity === entities[0]) ? entities[0] : undefined;
}

function generateScaledQuestion(
  mode: RnkCp007ScaledMode,
  seed: number,
  answerIndex: 0 | 1 | 2 | 3,
): RnkCp007DerivedQuantityQuestion {
  const state = constructScaledState(seed);
  const [a, b, c, d, e, h] = state.roleSymbols;
  const cCoefficient = state.m * state.q;
  const rankFromTop = mode === "HEAVIEST_OBJECT" ? 1
    : mode === "FOURTH_FROM_TOP" ? 4
    : mode === "SECOND_FROM_BOTTOM" ? 5
    : 6;
  const answer = invariantScaledRankEntity(state, rankFromTop);
  if (!answer) throw new Error(`Requested scaled rank ${rankFromTop} is not invariant`);

  const allSymbols = state.roleSymbols;
  const distractorOrder = rotate(allSymbols.filter((symbol) => symbol !== answer), seed % 5);
  const options = placeOptions(answer, distractorOrder.slice(0, 3), answerIndex);
  const positionText = mode === "HEAVIEST_OBJECT" ? "heaviest"
    : mode === "LIGHTEST_OBJECT" ? "lightest"
    : mode === "SECOND_FROM_BOTTOM" ? "second from the bottom"
    : "fourth from the top";

  const stem = [
    `Six objects ${allSymbols.join(", ")} are compared by weight.`,
    `${b} weighs ${state.m} times ${a}.`,
    `${c} weighs ${state.q === 1 / 3 ? "one-third" : state.q === 0.25 ? "one-fourth" : "two-fifths"} of ${b}.`,
    `The weight of ${b} plus the weight of ${d} equals ${state.m + state.d} times the weight of ${a}.`,
    `${h} weighs twice ${e}.`,
    `The combined weight of ${a} and ${b} is less than ${h}.`,
    `Which object is ${positionText}?`,
  ].join(" ");

  const lowPair = cCoefficient > state.d ? `${c} > ${d}` : `${d} > ${c}`;
  const explanation = `Let ${a}=1 unit. Then ${b}=${state.m}, ${c}=${Number(cCoefficient.toFixed(4))}, and ${d}=${state.d}. Since ${h}=2${e} and ${a}+${b}<${h}, ${e}>${Number(state.eLowerBound.toFixed(4))}; thus ${h} is always highest, while ${b} and ${e} may swap. The fixed lower order is ${a} > ${lowPair}. Across every valid witness order, ${answer} remains ${positionText}.`;

  return {
    discoveryVersion: RNK_CP007_DERIVED_QUANTITY_VERSION,
    prototypeId: "DERIVED_QUANTITY_ORDER",
    sourceForm: "SCALED_OBJECT_ORDER",
    mode,
    seed,
    stem,
    options,
    answerIndex,
    answer,
    explanation,
    mathematicalFingerprint: `SCALED:${mode}:${state.m}:${state.q}:${state.d}:${state.roleSymbols.join(",")}`,
    scaledState: state,
    reviewMetadata: {
      sourceBacked: true,
      permanentQlAllocated: false,
      arithmeticOperationCount: 5,
      arithmeticBurden: "LIGHT",
      finalTask: "ORDER_OR_RANK",
      quantDominant: false,
      stateUniqueness: "PARTIAL_ORDER_WITH_QUERY_INVARIANT",
    },
  };
}

export function generateRnkCp007DerivedQuantityQuestion(
  mode: RnkCp007DerivedQuantityMode,
  seed: number,
  answerIndex: 0 | 1 | 2 | 3 = (seed % 4) as 0 | 1 | 2 | 3,
): RnkCp007DerivedQuantityQuestion {
  if ((RNK_CP007_TRANSFER_MODES as readonly string[]).includes(mode)) {
    return generateTransferQuestion(mode as RnkCp007TransferMode, seed, answerIndex);
  }
  return generateScaledQuestion(mode as RnkCp007ScaledMode, seed, answerIndex);
}
