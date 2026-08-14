import { getMalCp006Vessel, solveMalCp006Ledger } from "./cp006-solver";
import { rational } from "./rational";
import { MAL_CP006_WAVE02_RUNTIME_ID } from "./cp006-source-fixtures-wave02";
import type { MalCp006Wave02LearnerQuestion } from "./cp006-wave02-inverse-learner";

export const MAL_CP006_WAVE02_CHAIN_LEARNER_ID = "MAL-CP006-PROT-CHANGED-SOURCE-CHAIN-REMAINING-COMPONENT" as const;

type State = readonly [number, number, number];
const STATES: readonly State[] = [
  [30,20,10],[30,60,30],[30,70,20],[30,70,40],
  [30,90,40],[40,60,20],[40,80,30],[50,100,30],
  [60,40,20],[60,90,30],[60,100,40],[70,80,30],
  [80,70,30],[90,60,30],[100,50,30],[100,60,40],
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

export function generateMalCp006Wave02ChainLearner(seed: string): MalCp006Wave02LearnerQuestion {
  const h = hashSeed(seed);
  const [waterB, milkMoved, secondTransfer] = STATES[h % STATES.length];
  const totalB = waterB + milkMoved;
  const movedMilk = (secondTransfer * milkMoved) / totalB;
  const milkLeft = milkMoved - movedMilk;
  const shape = (h >>> 5) % 4;

  const stems = [
    `Vessel A contains pure milk, vessel B contains ${waterB} litres of pure water, and vessel C is empty. ${milkMoved} litres of milk are transferred from A to B. After mixing B well, ${secondTransfer} litres of the mixture are transferred from B to C. How many litres of milk remain in B?`,
    `B initially contains ${waterB} litres of water and C is empty. From vessel A, ${milkMoved} litres of pure milk are added to B. After B is mixed, ${secondTransfer} litres of the mixture are transferred from B to C. Find the milk left in B.`,
    `${milkMoved} litres of pure milk are transferred from A into B containing ${waterB} litres of water. The mixture in B is stirred well and ${secondTransfer} litres are then transferred to empty vessel C. What quantity of milk remains in B?`,
    `A contains pure milk. B has ${waterB} litres of water and C is empty. First, ${milkMoved} litres are transferred from A to B. Then ${secondTransfer} litres of the mixed liquid in B are transferred to C. How much milk is still in B?`,
  ] as const;

  const raw = [
    { value: milkLeft, id: "CORRECT" },
    { value: milkMoved, id: "IGNORES_SECOND_TRANSFER" },
    { value: movedMilk, id: "REPORTS_MILK_MOVED_TO_C" },
    { value: milkMoved - secondTransfer, id: "TREATS_SECOND_TRANSFER_AS_PURE_MILK" },
  ];
  const ordered = rotate(raw, (h >>> 9) % 4);
  const options = ordered.map((x) => `${x.value} litres`);
  const correctIndex = ordered.findIndex((x) => x.id === "CORRECT");

  const proof = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(milkMoved + 100), componentA: rational(milkMoved + 100) },
      { id: "B", volume: rational(waterB), componentA: rational(0) },
      { id: "C", volume: rational(0), componentA: rational(0) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(milkMoved) },
      { kind: "TRANSFER", from: "B", to: "C", amount: rational(secondTransfer) },
    ],
  );
  const b = getMalCp006Vessel(proof, "B");
  const errors: string[] = [];
  if (b.componentA.numerator !== BigInt(milkLeft) || b.componentA.denominator !== 1n) errors.push("ledger answer mismatch");
  if (!Number.isInteger(movedMilk) || !Number.isInteger(milkLeft)) errors.push("learner arithmetic is not whole-number friendly");
  if (new Set(options).size !== 4) errors.push("options are not unique");
  if (correctIndex < 0) errors.push("correct option missing");

  return {
    prototypeId: MAL_CP006_WAVE02_CHAIN_LEARNER_ID,
    runtimeId: MAL_CP006_WAVE02_RUNTIME_ID,
    seed,
    stemShape: shape,
    stateKey: `${waterB}:${milkMoved}:${secondTransfer}`,
    stem: stems[shape],
    options,
    correctIndex,
    answer: `${milkLeft} litres`,
    explanation: [
      `After the first transfer, B has ${milkMoved} litres of milk and ${waterB} litres of water, so total mixture = ${totalB} litres.`,
      `Milk fraction in B = ${milkMoved}/${totalB}.`,
      `Milk transferred to C = ${secondTransfer} × ${milkMoved}/${totalB} = ${movedMilk} litres.`,
      `Milk left in B = ${milkMoved} − ${movedMilk} = ${milkLeft} litres.`,
    ],
    commonMistake: `The ${secondTransfer} litres sent to C are a mixture, not pure milk. Use B's composition after the first transfer.`,
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
