import { getMalCp006Vessel, malCp006ComponentB, solveMalCp006Ledger } from "./cp006-solver";
import { rational, reduceRationalRatio } from "./rational";
import { MAL_CP006_WAVE02_RUNTIME_ID } from "./cp006-source-fixtures-wave02";

export const MAL_CP006_WAVE02_INVERSE_LEARNER_ID = "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO" as const;

export interface MalCp006Wave02LearnerQuestion {
  prototypeId: string;
  runtimeId: typeof MAL_CP006_WAVE02_RUNTIME_ID;
  seed: string;
  stemShape: number;
  stateKey: string;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: string[];
  commonMistake: string;
  sourceEvidenceIds: readonly string[];
  validation: { ok: boolean; errors: string[] };
  permanentQlId: null;
  permanentSolveModeId: null;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

type State = readonly [number, number];
const STATES: readonly State[] = [
  [36,12],[40,24],[48,16],[60,12],[60,15],[60,20],[72,24],[80,48],
  [84,28],[90,60],[96,32],[108,36],[120,24],[120,30],[120,40],[120,72],
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

export function generateMalCp006Wave02InverseLearner(seed: string): MalCp006Wave02LearnerQuestion {
  const h = hashSeed(seed);
  const [volume, transfer] = STATES[h % STATES.length];
  const [r1, r2] = reduceRationalRatio(rational(volume), rational(transfer));
  const ratioA = Number(r1.numerator);
  const ratioB = Number(r2.numerator);
  const shape = (h >>> 5) % 4;

  const stems = [
    `Vessel A contains ${volume} litres of pure milk and vessel B contains ${volume} litres of pure water. Some milk is transferred from A to B. After mixing B well, the same quantity of the mixture is transferred back to A. If the final milk-to-water ratio in A is ${ratioA}:${ratioB}, how many litres were transferred each time?`,
    `Two vessels contain ${volume} litres each. A has pure milk and B has pure water. x litres are transferred from A to B and, after mixing, x litres are transferred back from B to A. The final milk-to-water ratio in A is ${ratioA}:${ratioB}. Find x.`,
    `A starts with ${volume} litres of pure milk and B with ${volume} litres of pure water. The same quantity is transferred first from A to B and then from the mixed liquid in B back to A. A finally has milk and water in the ratio ${ratioA}:${ratioB}. Find the transferred quantity.`,
    `${volume} litres of pure milk is kept in A and ${volume} litres of pure water in B. Some milk is poured into B, and after mixing B the same quantity is poured back into A. If A finally contains milk and water in the ratio ${ratioA}:${ratioB}, what quantity was transferred?`,
  ] as const;

  const d1 = volume - transfer;
  const d2 = (volume * transfer) / (volume + transfer);
  const d3 = (volume * transfer) / (volume - transfer);
  const raw = [
    { value: transfer, id: "CORRECT" },
    { value: d1, id: "USES_FIRST_LEG_REMAINDER" },
    { value: d2, id: "USES_TOTAL_AFTER_FIRST_TRANSFER_AS_RATIO_BASE" },
    { value: d3, id: "USES_REMAINING_A_AS_RATIO_BASE" },
  ];
  const ordered = rotate(raw, (h >>> 9) % 4);
  const options = ordered.map((x) => `${x.value} litres`);
  const correctIndex = ordered.findIndex((x) => x.id === "CORRECT");

  const proof = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(volume), componentA: rational(volume) },
      { id: "B", volume: rational(volume), componentA: rational(0) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(transfer) },
      { kind: "TRANSFER", from: "B", to: "A", amount: rational(transfer) },
    ],
  );
  const a = getMalCp006Vessel(proof, "A");
  const [p1, p2] = reduceRationalRatio(a.componentA, malCp006ComponentB(a));
  const errors: string[] = [];
  if (`${p1.numerator}:${p2.numerator}` !== `${ratioA}:${ratioB}`) errors.push("ledger answer mismatch");
  if (new Set(options).size !== 4) errors.push("options are not unique");
  if (correctIndex < 0) errors.push("correct option missing");

  return {
    prototypeId: MAL_CP006_WAVE02_INVERSE_LEARNER_ID,
    runtimeId: MAL_CP006_WAVE02_RUNTIME_ID,
    seed,
    stemShape: shape,
    stateKey: `${volume}:${transfer}`,
    stem: stems[shape],
    options,
    correctIndex,
    answer: `${transfer} litres`,
    explanation: [
      `Let the transferred quantity be x litres. After the first transfer, B contains x litres of milk and ${volume} litres of water.`,
      `So the x litres returned from B contains milk = x × x/(${volume} + x) and water = x × ${volume}/(${volume} + x).`,
      `After adding this returned mixture to A, the final milk-to-water ratio simplifies to ${volume}:x.`,
      `${volume}:x = ${ratioA}:${ratioB}, so x = ${transfer} litres.`,
    ],
    commonMistake: "Do not treat the liquid returned from B as pure milk. B contains milk and water after the first transfer.",
    sourceEvidenceIds: ["CAT-2025-S3-ROUND-TRIP-INVERSE", "BANK-MAINS-2021-GENERAL-INVERSE-RETURN"],
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
