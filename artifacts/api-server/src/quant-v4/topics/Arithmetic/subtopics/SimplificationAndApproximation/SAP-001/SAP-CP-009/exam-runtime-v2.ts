import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009 as generateExam,
  type SapCp009Package,
  type SapCp009PrototypeId,
} from "./exam-runtime";
import { generateSapCp009 as generateFinal } from "./final-runtime";
import type { SapCp009Option } from "./runtime";

export { SAP_CP009_CATALOGUE, SAP_CP009_POLICY, SAP_CP009_PROTOTYPE_IDS };
export type { SapCp009Package, SapCp009PrototypeId };

function correctPosition(seed: number, mode: number): number {
  return ((seed - 1) + mode) % 4;
}
function wrong(value: string, misconceptionId: string, analysis: string): SapCp009Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}
function options(answer: string, seed: number, mode: number, wrongs: readonly SapCp009Option[]): readonly SapCp009Option[] {
  const unique = wrongs.filter((item, index, all) => item.value !== answer && all.findIndex((other) => other.value === item.value) === index);
  if (unique.length < 3) throw new Error(`${answer}: exam-v2 distractors collapsed in mode ${mode}.`);
  const correct: SapCp009Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct." });
  const out = [...unique.slice(0, 3)];
  out.splice(correctPosition(seed, mode), 0, correct);
  return Object.freeze(out);
}
function repack(
  base: SapCp009Package,
  args: {
    stem: string;
    options?: readonly SapCp009Option[];
    concept?: string;
    steps?: readonly string[];
    verification?: readonly string[];
    version: string;
  },
): SapCp009Package {
  const optionList = args.options ?? base.options;
  const correctIndex = optionList.findIndex((option) => option.isCorrect);
  const data = Object.freeze({ ...base.oracle.data, examEditorialVersion: 4 });
  const errors: string[] = [];
  if (optionList.length !== 4 || new Set(optionList.map((option) => option.value)).size !== 4) errors.push("Four distinct options required.");
  if (optionList.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one correct option required.");
  if (optionList[correctIndex]?.value !== base.canonicalAnswer) errors.push("Correct option mismatch.");
  if (/for estimation, take|using cancellation|using\s+-?\d+(?:\.\d+)?\s+for\s+-?\d+(?:\.\d+)?|round the required numbers/i.test(args.stem)) {
    errors.push("Stem is not exam-standard.");
  }
  return Object.freeze({
    ...base,
    stem: args.stem,
    options: optionList,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: args.concept ?? base.explanation.coreConcept,
      steps: Object.freeze([...(args.steps ?? base.explanation.steps)]),
      finalAnswer: base.explanation.finalAnswer,
      verification: Object.freeze([...(args.verification ?? base.explanation.verification)]),
    }),
    oracle: Object.freeze({ kind: base.prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, stem: args.stem, answer: base.canonicalAnswer, data, examEditorial: args.version }),
    generationIdentity: `${base.prototypeId}:exam-v4:${args.version}:${base.seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function coordinatedRatio(seed: number): SapCp009Package {
  const mode = 7;
  const base = generateFinal(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const rp = Number(d.rp), rq = Number(d.rq);
  const answer = `${rp}:${rq}`;
  const equivalent = (ratio: string) => {
    const [a, b] = ratio.split(":").map(Number);
    return a! * rq === b! * rp;
  };
  const candidates = [
    `${rq}:${rp}`,
    `${rp + 1}:${rq}`,
    `${rp}:${rq + 1}`,
    `${rp + 1}:${rq + 1}`,
    `${Math.max(1, rp - 1)}:${rq + 1}`,
    `${rp + 2}:${rq}`,
    `${rp}:${rq + 2}`,
    "2:1",
    "1:2",
    "3:1",
    "1:3",
    "3:2",
    "2:3",
  ];
  const wrongs = candidates
    .filter((value, index, all) => value !== answer && !equivalent(value) && all.indexOf(value) === index)
    .map((value, index) => wrong(value, `RATIO_ERROR_${index + 1}`, "This does not match the simplified ratio of the rounded terms."));
  return repack(base, {
    stem: base.stem,
    options: options(answer, seed, mode, wrongs),
    version: "ratio-genuinely-distinct",
  });
}

function nearestOption(seed: number): SapCp009Package {
  const mode = 12;
  const base = generateFinal(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  if (d.kind !== "QUOTIENT") return generateExam(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const originalN = Number(d.originalN);
  const originalD = Number(d.originalD);
  return repack(base, {
    stem: `Round ${originalN} and ${originalD} to the nearest ten. Which option is nearest to ${originalN} ÷ ${originalD}?`,
    concept: "Round the numerator and denominator to the nearest ten, then divide the rounded values.",
    steps: [`${originalN} → ${d.n} and ${originalD} → ${d.d}.`, `${d.n} ÷ ${d.d} = ${base.canonicalAnswer}.`],
    verification: ["Neither rounded value is supplied in the question.", "The rounded denominator is non-zero."],
    version: "nearest-quotient-student-rounds",
  });
}

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  const mode = SAP_CP009_PROTOTYPE_IDS.indexOf(prototypeId);
  if (mode === 7) return coordinatedRatio(seed);
  if (mode === 12) return nearestOption(seed);
  return generateExam(prototypeId, seed);
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
