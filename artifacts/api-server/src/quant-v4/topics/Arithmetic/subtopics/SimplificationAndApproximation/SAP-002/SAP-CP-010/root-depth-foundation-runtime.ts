import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateStudent,
  type SapCp010Option,
  type SapCp010Package,
  type SapCp010PrototypeId,
} from "./student-runtime";

export { SAP_CP010_CATALOGUE, SAP_CP010_POLICY, SAP_CP010_PROTOTYPE_IDS };
export type { SapCp010Package, SapCp010PrototypeId };

const INTERVAL_RATIOS = [0.12, 0.30, 0.48, 0.70, 0.88] as const;
const NEAREST_OFFSETS = [0.18, 0.42, 0.58, 0.82] as const;

function rootTex(degree: number, n: number): string {
  return degree === 2 ? `\\sqrt{${n}}` : `\\sqrt[${degree}]{${n}}`;
}

function math(expr: string): string { return `\\( ${expr} \\)`; }
function wrong(value: string, misconceptionId: string, analysis: string): SapCp010Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function rebuild(base: SapCp010Package, args: {
  stem: string; answer: string; wrongs: readonly SapCp010Option[];
  data: Readonly<Record<string, number | string>>; concept: string;
  steps: readonly string[]; verification: readonly string[]; tag: string;
  difficulty?: SapCp010Package["difficulty"];
}): SapCp010Package {
  const unique = args.wrongs.filter((item, index, all) => item.value !== args.answer && all.findIndex((other) => other.value === item.value) === index);
  if (unique.length < 3) throw new Error(`${base.prototypeId}:${base.seed}: root-depth distractors collapsed.`);
  const correct: SapCp010Option = Object.freeze({ value: args.answer, isCorrect: true, misconceptionId: null, analysis: "Correct." });
  const options = [...unique.slice(0, 3)]; options.splice(base.correctIndex, 0, correct);
  const frozenOptions = Object.freeze(options);
  const data = Object.freeze({ ...args.data, rootDepthFoundationVersion: 1 });
  const visible = `${args.stem} ${args.answer} ${frozenOptions.map((o) => o.value).join(" ")} ${args.steps.join(" ")}`;
  const errors: string[] = [];
  if (new Set(frozenOptions.map((o) => o.value)).size !== 4) errors.push("Four distinct options required.");
  if (frozenOptions[base.correctIndex]?.value !== args.answer) errors.push("Correct option mismatch.");
  if (/[√∛∜]/.test(visible)) errors.push("Raw Unicode radical leaked.");
  return Object.freeze({ ...base, difficulty: args.difficulty ?? base.difficulty, stem: args.stem,
    canonicalAnswer: args.answer, options: frozenOptions,
    explanation: Object.freeze({ coreConcept: args.concept, steps: Object.freeze([...args.steps]), finalAnswer: `Answer: ${args.answer}.`, verification: Object.freeze([...args.verification]) }),
    oracle: Object.freeze({ kind: base.prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, stem: args.stem, answer: args.answer, data, tag: args.tag }),
    generationIdentity: `${base.prototypeId}:root-depth-foundation-v1:${args.tag}:${base.seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

function intervalRadicand(k: number, degree: number, band: number): number {
  const lower = k ** degree, upper = (k + 1) ** degree, gap = upper - lower;
  const offset = Math.max(1, Math.min(gap - 1, Math.round(gap * INTERVAL_RATIOS[band % 5]!)));
  return lower + offset;
}

function intervalQuestion(prototypeId: SapCp010PrototypeId, seed: number, degree: number, start: number): SapCp010Package {
  const base = generateStudent(prototypeId, seed), index = seed - 1;
  const k = start + (index % 20), band = Math.floor(index / 20) % 5;
  const n = intervalRadicand(k, degree, band), radical = rootTex(degree, n);
  const answer = math(`${k} < ${radical} < ${k + 1}`);
  return rebuild(base, { stem: `Between which two consecutive integers does ${math(radical)} lie?`, answer,
    wrongs: [wrong(math(`${k - 1} < ${radical} < ${k}`), "ONE_LOW", "This interval is one integer too low."), wrong(math(`${k + 1} < ${radical} < ${k + 2}`), "ONE_HIGH", "This interval is one integer too high."), wrong(math(`${k + 2} < ${radical} < ${k + 3}`), "TWO_HIGH", "This interval is two integers too high.")],
    data: { n, degree, lower: k, upper: k + 1, band, intervalRatio: String(INTERVAL_RATIOS[band]!) },
    concept: `Compare ${n} with the consecutive perfect ${degree === 2 ? "squares" : degree === 3 ? "cubes" : "fourth powers"} around it.`,
    steps: [math(`${k}^{${degree}} = ${k ** degree} \\text{ and } ${k + 1}^{${degree}} = ${(k + 1) ** degree}`), `${math(`${k ** degree} < ${n} < ${(k + 1) ** degree}`)}, so ${answer}.`],
    verification: ["The generated numbers are spread across the interval instead of clustering beside one perfect power."], tag: `interval-depth-${degree}`, difficulty: band === 2 ? "MEDIUM" : base.difficulty });
}

function nearestQuestion(prototypeId: SapCp010PrototypeId, seed: number, degree: number, start: number): SapCp010Package {
  const base = generateStudent(prototypeId, seed), index = seed - 1;
  const k = start + (index % 25), band = Math.floor(index / 25) % 4, offset = NEAREST_OFFSETS[band]!;
  const lower = k ** degree, upper = (k + 1) ** degree;
  const n = Math.max(lower + 1, Math.min(upper - 1, Math.round((k + offset) ** degree)));
  const nScaled = (2 ** degree) * n, midpointScaled = (2 * k + 1) ** degree;
  const answerNumber = nScaled < midpointScaled ? k : k + 1, radical = rootTex(degree, n);
  return rebuild(base, { stem: `${math(radical)} is nearest to which integer?`, answer: String(answerNumber),
    wrongs: [wrong(String(answerNumber - 1), "ONE_LOW", "This is one integer below the nearest value."), wrong(String(answerNumber + 1), "ONE_HIGH", "This is one integer above the nearest value."), wrong(String(answerNumber + (answerNumber === k ? 2 : -2)), "TWO_AWAY", "This is two integers away from the nearest value.")],
    data: { n, degree, lower: k, upper: k + 1, answer: answerNumber, band, nScaled, midpointScaled },
    concept: "Locate the root between consecutive integers and compare it with their half-way point.",
    steps: [math(`${k}^{${degree}} = ${k ** degree} < ${n} < ${(k + 1) ** degree} = ${k + 1}^{${degree}}`), `${nScaled < midpointScaled ? `${math(radical)} < ${k}.5` : `${math(radical)} > ${k}.5`}, so the nearest integer is ${answerNumber}.`],
    verification: [`The exact half-way comparison is ${nScaled} versus ${midpointScaled}.`], tag: `nearest-depth-${degree}`, difficulty: band === 1 || band === 2 ? "MEDIUM" : base.difficulty });
}

function integerBound(seed: number): SapCp010Package {
  const prototypeId = SAP_CP010_PROTOTYPE_IDS[5]!, base = generateStudent(prototypeId, seed), index = seed - 1;
  const degree = seed % 2 === 0 ? 2 : 3, local = Math.floor(index / 2);
  const k = (degree === 2 ? 10 : 4) + (local % 25), band = Math.floor(local / 25) === 0 ? 1 : 3;
  const n = intervalRadicand(k, degree, band), lowerQuestion = index % 4 < 2;
  const answerNumber = lowerQuestion ? k : k + 1, radical = rootTex(degree, n);
  return rebuild(base, { stem: `What is the ${lowerQuestion ? "greatest integer less than" : "least integer greater than"} ${math(radical)}?`, answer: String(answerNumber),
    wrongs: [wrong(String(answerNumber - 1), "BOUND_LOW", "This is not the tight integer bound."), wrong(String(answerNumber + 1), "BOUND_HIGH", "This is not the tight integer bound."), wrong(String(answerNumber + (lowerQuestion ? 2 : -2)), "BOUND_WIDE", "This is a loose bound, not the required tight bound.")],
    data: { n, degree, lower: k, upper: k + 1, answer: answerNumber, kind: lowerQuestion ? "LOWER" : "UPPER", band }, concept: "Use consecutive exact powers to obtain the tight integer bound.",
    steps: [math(`${k}^{${degree}} = ${k ** degree} < ${n} < ${(k + 1) ** degree} = ${k + 1}^{${degree}}`), `Thus ${math(`${k} < ${radical} < ${k + 1}`)}, giving the required bound ${answerNumber}.`],
    verification: ["The result is the greatest lower or least upper integer, not merely any valid bound."], tag: "integer-bound-depth" });
}

export function generateSapCp010(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  const mode = SAP_CP010_PROTOTYPE_IDS.indexOf(prototypeId);
  if (mode === 0) return intervalQuestion(prototypeId, seed, 2, 10);
  if (mode === 1) return intervalQuestion(prototypeId, seed, 3, 4);
  if (mode === 2) return intervalQuestion(prototypeId, seed, 4, 2);
  if (mode === 3) return nearestQuestion(prototypeId, seed, 2, 10);
  if (mode === 4) return nearestQuestion(prototypeId, seed, 3, 4);
  if (mode === 5) return integerBound(seed);
  return generateStudent(prototypeId, seed);
}
