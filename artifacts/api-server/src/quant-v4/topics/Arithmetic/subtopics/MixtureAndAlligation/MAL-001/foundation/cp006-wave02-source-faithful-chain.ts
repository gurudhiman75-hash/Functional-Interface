import { getMalCp006Vessel, malCp006ComponentB, solveMalCp006Ledger } from "./cp006-solver";
import { rational, reduceRationalRatio } from "./rational";
import { MAL_CP006_WAVE02_RUNTIME_ID } from "./cp006-source-fixtures-wave02";
import type { MalCp006Wave02LearnerQuestion } from "./cp006-wave02-inverse-learner";

export const MAL_CP006_WAVE02_SOURCE_FAITHFUL_CHAIN_ID =
  "MAL-CP006-PROT-CHANGED-SOURCE-CHAIN-REMAINING-COMPONENT" as const;

type State = readonly [number, number, number, number];
// water initially in B, first-transfer multiplier, second-transfer multiplier, x
const STATES: readonly State[] = [
  [220,4,3,20],[110,3,2,30],[210,4,3,15],[150,4,3,30],
  [140,5,3,20],[140,3,2,35],[140,3,2,20],[120,4,2,15],
  [120,4,2,10],[100,3,2,20],[90,3,2,20],[80,4,3,30],
  [70,4,3,20],[60,5,2,20],[60,5,3,15],[60,4,2,35],
] as const;

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function rotate<T>(items: readonly T[], by: number): T[] {
  const k = by % items.length;
  return [...items.slice(k), ...items.slice(0, k)];
}

export function generateMalCp006Wave02SourceFaithfulChain(seed: string): MalCp006Wave02LearnerQuestion {
  const h = hashSeed(seed);
  const [waterB, firstFactor, secondFactor, x] = STATES[h % STATES.length];
  const firstTransfer = firstFactor * x;
  const secondTransfer = secondFactor * x;
  const totalB = waterB + firstTransfer;
  const milkMovedToC = (secondTransfer * firstTransfer) / totalB;
  const milkLeft = firstTransfer - milkMovedToC;
  const [waterRatioR, milkRatioR] = reduceRationalRatio(rational(waterB), rational(firstTransfer));
  const waterRatio = Number(waterRatioR.numerator);
  const milkRatio = Number(milkRatioR.numerator);
  const shape = (h >>> 5) % 4;

  const stems = [
    `Vessel A contains pure milk, vessel B contains ${waterB} litres of pure water, and vessel C is empty. ${firstFactor}x litres of milk are transferred from A to B. After mixing B well, ${secondFactor}x litres of the mixture are transferred from B to C. If the water-to-milk ratio in C is ${waterRatio}:${milkRatio}, how many litres of milk remain in B?`,
    `B initially contains ${waterB} litres of pure water and C is empty. From A, ${firstFactor}x litres of pure milk are added to B. After B is mixed, ${secondFactor}x litres of the mixture are transferred to C. The water-to-milk ratio in C is ${waterRatio}:${milkRatio}. How much milk is left in B?`,
    `${firstFactor}x litres of pure milk are transferred from A into B containing ${waterB} litres of water. The mixture is stirred well and ${secondFactor}x litres are then transferred from B to empty vessel C. If C has water and milk in the ratio ${waterRatio}:${milkRatio}, what quantity of milk remains in B?`,
    `A contains pure milk, B contains ${waterB} litres of pure water, and C is empty. First, ${firstFactor}x litres are transferred from A to B. Then ${secondFactor}x litres of the mixed liquid in B are transferred to C. If C finally has a water-to-milk ratio of ${waterRatio}:${milkRatio}, how much milk is still in B?`,
  ] as const;

  const rawOptions = [
    { value: milkLeft, id: "CORRECT" },
    { value: firstTransfer, id: "IGNORES_SECOND_TRANSFER" },
    { value: milkMovedToC, id: "REPORTS_MILK_MOVED_TO_C" },
    { value: firstTransfer - secondTransfer, id: "TREATS_SECOND_TRANSFER_AS_PURE_MILK" },
  ];
  const ordered = rotate(rawOptions, (h >>> 9) % 4);
  const options = ordered.map((item) => `${item.value} litres`);
  const correctIndex = ordered.findIndex((item) => item.id === "CORRECT");

  const ledger = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(firstTransfer + 100), componentA: rational(firstTransfer + 100) },
      { id: "B", volume: rational(waterB), componentA: rational(0) },
      { id: "C", volume: rational(0), componentA: rational(0) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(firstTransfer) },
      { kind: "TRANSFER", from: "B", to: "C", amount: rational(secondTransfer) },
    ],
  );
  const finalB = getMalCp006Vessel(ledger, "B");
  const finalC = getMalCp006Vessel(ledger, "C");
  const [provedWaterR, provedMilkR] = reduceRationalRatio(malCp006ComponentB(finalC), finalC.componentA);
  const errors: string[] = [];
  if (finalB.componentA.numerator !== BigInt(milkLeft) || finalB.componentA.denominator !== 1n) errors.push("remaining-milk ledger mismatch");
  if (`${provedWaterR.numerator}:${provedMilkR.numerator}` !== `${waterRatio}:${milkRatio}`) errors.push("C ratio ledger mismatch");
  if (![firstTransfer, secondTransfer, milkMovedToC, milkLeft].every(Number.isInteger)) errors.push("visible arithmetic is not whole-number friendly");
  if (new Set(options).size !== 4 || options.some((option) => Number(option.split(" ")[0]) <= 0)) errors.push("options are not four unique positive quantities");

  return {
    prototypeId: MAL_CP006_WAVE02_SOURCE_FAITHFUL_CHAIN_ID,
    runtimeId: MAL_CP006_WAVE02_RUNTIME_ID,
    seed,
    stemShape: shape,
    stateKey: `${waterB}:${firstFactor}:${secondFactor}:${x}`,
    stem: stems[shape],
    options,
    correctIndex,
    answer: `${milkLeft} litres`,
    explanation: [
      `The mixture transferred to C has the same composition as B. Therefore water : milk in B = ${waterB} : ${firstFactor}x = ${waterRatio}:${milkRatio}.`,
      `${waterB}:${firstFactor}x = ${waterRatio}:${milkRatio}, so x = ${x}. Hence milk added to B = ${firstFactor} × ${x} = ${firstTransfer} litres.`,
      `B now has ${firstTransfer} litres of milk in ${totalB} litres. Mixture sent to C = ${secondFactor} × ${x} = ${secondTransfer} litres, so milk sent to C = ${secondTransfer} × ${firstTransfer}/${totalB} = ${milkMovedToC} litres.`,
      `Milk remaining in B = ${firstTransfer} − ${milkMovedToC} = ${milkLeft} litres.`,
    ],
    commonMistake: `Do not treat the ${secondFactor}x litres sent to C as pure milk. It has B's composition after the first transfer.`,
    sourceEvidenceIds: ["IBPS-RRB-CLERK-2019-MAINS-CHAIN"],
    validation: { ok: errors.length === 0, errors },
    permanentQlId: null,
    permanentSolveModeId: null,
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
  };
}
