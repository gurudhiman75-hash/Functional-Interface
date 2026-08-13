import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009 as generateV3,
  type SapCp009Package,
  type SapCp009PrototypeId,
} from "./runtime-v3";
import type { SapCp009Option } from "./runtime";

export { SAP_CP009_CATALOGUE, SAP_CP009_POLICY, SAP_CP009_PROTOTYPE_IDS };
export type { SapCp009Package, SapCp009PrototypeId };

const LIFECYCLE: SapCp009Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

function position(seed: number, modeIndex: number): number {
  return ((seed - 1) + modeIndex) % 4;
}
function wrong(value: string, misconceptionId: string, analysis: string): SapCp009Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}
function makeOptions(answer: string, seed: number, modeIndex: number, candidates: readonly SapCp009Option[]): readonly SapCp009Option[] {
  const unique = candidates.filter((item, index, all) => item.value !== answer && all.findIndex((other) => other.value === item.value) === index);
  if (unique.length < 3) throw new Error(`${answer}: v4 ratio distractors collapsed.`);
  const correct: SapCp009Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct estimate." });
  const result = [...unique.slice(0, 3)];
  result.splice(position(seed, modeIndex), 0, correct);
  return Object.freeze(result);
}
function gcdNumber(a: number, b: number): number {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

function coordinatedRatio(seed: number): SapCp009Package {
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[7]!;
  const modeIndex = 7;
  const pairs = [
    [1, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 5], [3, 5], [3, 2],
  ] as const;
  const [p, q] = pairs[(seed - 1) % pairs.length]!;
  const block = Math.floor((seed - 1) / pairs.length);
  const scale = 200 + block * 100;
  const aRounded = scale * p;
  const bRounded = scale * q;
  const offsets = [-41, -23, 17, 39] as const;
  const a = aRounded + offsets[seed % 4]!;
  const b = bRounded + offsets[(seed + 1) % 4]!;
  const g = gcdNumber(p, q);
  const rp = p / g, rq = q / g;
  const answer = `${rp}:${rq}`;
  const candidates = [
    wrong(`${rq}:${rp}`, "REVERSED_RATIO", "The order of the ratio was reversed."),
    wrong(`${rp + 1}:${rq}`, "FIRST_PART_HIGH", "The first part was increased after simplifying."),
    wrong(`${rp}:${rq + 1}`, "SECOND_PART_HIGH", "The second part was increased after simplifying."),
    wrong(`${rp + 1}:${rq + 1}`, "BOTH_PARTS_HIGH", "Both parts were increased instead of keeping the simplified ratio."),
    wrong(`${Math.max(1, rp - 1)}:${rq + 1}`, "UNBALANCED_CHANGE", "The two ratio parts were changed unequally."),
  ];
  const opts = makeOptions(answer, seed, modeIndex, candidates);
  const data = Object.freeze({ a, b, aRounded, bRounded, rp, rq, scale, block });
  const stem = `Round both terms to the nearest hundred and estimate the ratio ${a}:${b} in simplest form.`;
  const correctIndex = opts.findIndex((item) => item.isCorrect);
  return Object.freeze({
    checkpointId: "SAP-CP-009",
    prototypeId,
    proposedPermanentQlId: SAP_CP009_CATALOGUE[modeIndex]!.proposedPermanentQlId,
    seed,
    difficulty: SAP_CP009_CATALOGUE[modeIndex]!.difficulty,
    taskDirection: SAP_CP009_CATALOGUE[modeIndex]!.taskDirection,
    policy: SAP_CP009_POLICY,
    stem,
    canonicalAnswer: answer,
    options: opts,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Round both terms to the same place, then simplify the resulting ratio.",
      steps: Object.freeze([
        `${a}:${b} ≈ ${aRounded}:${bRounded}.`,
        `${aRounded}:${bRounded} = ${answer}.`,
      ]),
      finalAnswer: `Answer: ${answer}.`,
      verification: Object.freeze([
        "Both terms are rounded to the nearest hundred.",
        "The final ratio is reduced to simplest form.",
      ]),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer, data, runtime: "v4" }),
    generationIdentity: `${prototypeId}:v4:${seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
    lifecycle: LIFECYCLE,
  });
}

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[7]) return coordinatedRatio(seed);
  return generateV3(prototypeId, seed);
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
