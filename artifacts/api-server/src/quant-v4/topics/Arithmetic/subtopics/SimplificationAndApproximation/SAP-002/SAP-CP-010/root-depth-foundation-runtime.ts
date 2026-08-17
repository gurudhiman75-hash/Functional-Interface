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

const RATIOS = [0.12, 0.30, 0.48, 0.70, 0.88] as const;
const OFFSETS = [0.18, 0.42, 0.58, 0.82] as const;

export function rootTex(degree: number, n: number): string {
  return degree === 2 ? `\\sqrt{${n}}` : `\\sqrt[${degree}]{${n}}`;
}
export function math(expr: string): string { return `\\( ${expr} \\)`; }
export function wrong(value: string, misconceptionId: string, analysis: string): SapCp010Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

export function rebuild(base: SapCp010Package, args: {
  stem: string; answer: string; wrongs: readonly SapCp010Option[];
  data: Readonly<Record<string, number | string>>; concept: string;
  steps: readonly string[]; verification: readonly string[]; tag: string;
  difficulty?: SapCp010Package["difficulty"];
}): SapCp010Package {
  const unique = args.wrongs.filter((x, i, all) => x.value !== args.answer && all.findIndex((y) => y.value === x.value) === i);
  if (unique.length < 3) throw new Error(`${base.prototypeId}:${base.seed}: distractors collapsed.`);
  const correct: SapCp010Option = Object.freeze({ value: args.answer, isCorrect: true, misconceptionId: null, analysis: "Correct." });
  const options = [...unique.slice(0, 3)]; options.splice(base.correctIndex, 0, correct);
  const frozen = Object.freeze(options), data = Object.freeze({ ...args.data, rootDepthVersion: 1 });
  const visible = `${args.stem} ${args.answer} ${frozen.map((o) => o.value).join(" ")} ${args.steps.join(" ")}`;
  const errors: string[] = [];
  if (new Set(frozen.map((o) => o.value)).size !== 4) errors.push("Four distinct options required.");
  if (frozen[base.correctIndex]?.value !== args.answer) errors.push("Correct option mismatch.");
  if (/[√∛∜]/.test(visible)) errors.push("Raw Unicode radical leaked.");
  return Object.freeze({ ...base, difficulty: args.difficulty ?? base.difficulty, stem: args.stem, canonicalAnswer: args.answer, options: frozen,
    explanation: Object.freeze({ coreConcept: args.concept, steps: Object.freeze([...args.steps]), finalAnswer: `Answer: ${args.answer}.`, verification: Object.freeze([...args.verification]) }),
    oracle: Object.freeze({ kind: base.prototypeId, data }), canonicalPayloadKey: JSON.stringify({ p: base.prototypeId, stem: args.stem, answer: args.answer, data, tag: args.tag }),
    generationIdentity: `${base.prototypeId}:root-depth-v1:${args.tag}:${base.seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

export function intervalRadicand(k: number, degree: number, band: number): number {
  const lo = k ** degree, hi = (k + 1) ** degree, gap = hi - lo;
  return lo + Math.max(1, Math.min(gap - 1, Math.round(gap * RATIOS[band % 5]!)));
}

function interval(id: SapCp010PrototypeId, seed: number, degree: number, start: number): SapCp010Package {
  const base = generateStudent(id, seed), i = seed - 1, k = start + (i % 20), band = Math.floor(i / 20) % 5;
  const n = intervalRadicand(k, degree, band), r = rootTex(degree, n), answer = math(`${k} < ${r} < ${k + 1}`);
  return rebuild(base, { stem: `Between which two consecutive integers does ${math(r)} lie?`, answer,
    wrongs: [wrong(math(`${k - 1} < ${r} < ${k}`), "ONE_LOW", "One interval too low."), wrong(math(`${k + 1} < ${r} < ${k + 2}`), "ONE_HIGH", "One interval too high."), wrong(math(`${k + 2} < ${r} < ${k + 3}`), "TWO_HIGH", "Two intervals too high.")],
    data: { n, degree, lower: k, upper: k + 1, band }, concept: `Compare ${n} with the consecutive perfect ${degree === 2 ? "squares" : degree === 3 ? "cubes" : "fourth powers"} around it.`,
    steps: [math(`${k}^{${degree}} = ${k ** degree} \\text{ and } ${k + 1}^{${degree}} = ${(k + 1) ** degree}`), `${math(`${k ** degree} < ${n} < ${(k + 1) ** degree}`)}, so ${answer}.`],
    verification: ["Numbers are distributed across the interval rather than concentrated beside a perfect power."], tag: `interval-${degree}`, difficulty: band === 2 ? "MEDIUM" : base.difficulty });
}

function nearest(id: SapCp010PrototypeId, seed: number, degree: number, start: number): SapCp010Package {
  const base = generateStudent(id, seed), i = seed - 1, k = start + (i % 25), band = Math.floor(i / 25) % 4;
  const lo = k ** degree, hi = (k + 1) ** degree, n = Math.max(lo + 1, Math.min(hi - 1, Math.round((k + OFFSETS[band]!) ** degree)));
  const scaled = (2 ** degree) * n, midpoint = (2 * k + 1) ** degree, answer = scaled < midpoint ? k : k + 1, r = rootTex(degree, n);
  return rebuild(base, { stem: `${math(r)} is nearest to which integer?`, answer: String(answer),
    wrongs: [wrong(String(answer - 1), "ONE_LOW", "One integer too low."), wrong(String(answer + 1), "ONE_HIGH", "One integer too high."), wrong(String(answer + (answer === k ? 2 : -2)), "TWO_AWAY", "Two integers away.")],
    data: { n, degree, lower: k, upper: k + 1, answer, band, scaled, midpoint }, concept: "Bracket the root, then compare it with the half-way point.",
    steps: [math(`${k}^{${degree}} = ${lo} < ${n} < ${hi} = ${k + 1}^{${degree}}`), `${scaled < midpoint ? `${math(r)} < ${k}.5` : `${math(r)} > ${k}.5`}, so the nearest integer is ${answer}.`],
    verification: [`Exact half-way check: compare ${scaled} with ${midpoint}.`], tag: `nearest-${degree}`, difficulty: band === 1 || band === 2 ? "MEDIUM" : base.difficulty });
}

function bound(seed: number): SapCp010Package {
  const id = SAP_CP010_PROTOTYPE_IDS[5]!, base = generateStudent(id, seed), i = seed - 1, degree = seed % 2 === 0 ? 2 : 3, local = Math.floor(i / 2);
  const k = (degree === 2 ? 10 : 4) + (local % 25), band = Math.floor(local / 25) === 0 ? 1 : 3, n = intervalRadicand(k, degree, band), lowerQ = i % 4 < 2;
  const answer = lowerQ ? k : k + 1, r = rootTex(degree, n);
  return rebuild(base, { stem: `What is the ${lowerQ ? "greatest integer less than" : "least integer greater than"} ${math(r)}?`, answer: String(answer),
    wrongs: [wrong(String(answer - 1), "BOUND_LOW", "Not the tight bound."), wrong(String(answer + 1), "BOUND_HIGH", "Not the tight bound."), wrong(String(answer + (lowerQ ? 2 : -2)), "BOUND_WIDE", "A loose rather than tight bound.")],
    data: { n, degree, lower: k, upper: k + 1, answer, kind: lowerQ ? "LOWER" : "UPPER", band }, concept: "Use consecutive exact powers to obtain the tight integer bound.",
    steps: [math(`${k}^{${degree}} = ${k ** degree} < ${n} < ${(k + 1) ** degree} = ${k + 1}^{${degree}}`), `Thus ${math(`${k} < ${r} < ${k + 1}`)}, so the required bound is ${answer}.`],
    verification: ["The result is the greatest lower or least upper integer."], tag: "integer-bound" });
}

export function generateRootDepthFoundation(id: SapCp010PrototypeId, seed: number): SapCp010Package {
  const mode = SAP_CP010_PROTOTYPE_IDS.indexOf(id);
  if (mode === 0) return interval(id, seed, 2, 10);
  if (mode === 1) return interval(id, seed, 3, 4);
  if (mode === 2) return interval(id, seed, 4, 2);
  if (mode === 3) return nearest(id, seed, 2, 10);
  if (mode === 4) return nearest(id, seed, 3, 4);
  if (mode === 5) return bound(seed);
  return generateStudent(id, seed);
}
