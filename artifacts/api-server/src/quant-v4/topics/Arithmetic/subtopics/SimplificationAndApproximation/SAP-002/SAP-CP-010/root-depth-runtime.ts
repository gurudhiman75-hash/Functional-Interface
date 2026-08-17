import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  type SapCp010Package,
  type SapCp010PrototypeId,
} from "./student-runtime";
import {
  generateRootDepthFoundation,
  intervalRadicand,
  math,
  rebuild,
  rootTex,
  wrong,
} from "./root-depth-foundation-runtime";

export { SAP_CP010_CATALOGUE, SAP_CP010_POLICY, SAP_CP010_PROTOTYPE_IDS };
export type { SapCp010Package, SapCp010PrototypeId };

const CENTERED = [-0.42, -0.18, 0.18, 0.42] as const;

function latexify(text: string): string {
  return text
    .replace(/∜(\d+)/g, (_m, n) => math(`\\sqrt[4]{${n}}`))
    .replace(/∛(\d+)/g, (_m, n) => math(`\\sqrt[3]{${n}}`))
    .replace(/√(\d+)/g, (_m, n) => math(`\\sqrt{${n}}`));
}

function polish(base: SapCp010Package): SapCp010Package {
  const stem = latexify(base.stem), answer = latexify(base.canonicalAnswer);
  const options = Object.freeze(base.options.map((o) => Object.freeze({ ...o, value: latexify(o.value), analysis: latexify(o.analysis) })));
  const concept = latexify(base.explanation.coreConcept);
  const steps = Object.freeze(base.explanation.steps.map(latexify));
  const verification = Object.freeze(base.explanation.verification.map(latexify));
  const errors = [...base.validation.errors];
  if (/[√∛∜]/.test(`${stem} ${answer} ${options.map((o) => o.value).join(" ")} ${steps.join(" ")}`)) errors.push("Raw Unicode radical leaked.");
  const data = Object.freeze({ ...base.oracle.data, rootDepthPresentationVersion: 1 });
  const payload = JSON.stringify({ p: base.prototypeId, stem, answer, data, tag: "latex-radical-presentation" });
  return Object.freeze({ ...base, stem, canonicalAnswer: answer, options,
    explanation: Object.freeze({ coreConcept: concept, steps, finalAnswer: latexify(base.explanation.finalAnswer), verification }),
    oracle: Object.freeze({ kind: base.prototypeId, data }), canonicalPayloadKey: payload,
    generationIdentity: `${base.generationIdentity}:root-depth-presentation-v1:${payload}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

function centeredSquare(root: number, band: number): number {
  const d = CENTERED[band % 4]!, lo = (root - 0.5) ** 2, hi = (root + 0.5) ** 2;
  return Math.max(Math.floor(lo) + 1, Math.min(Math.ceil(hi) - 1, Math.round((root + d) ** 2)));
}

function rootProduct(seed: number): SapCp010Package {
  const id = SAP_CP010_PROTOTYPE_IDS[9]!, base = generateRootDepthFoundation(id, seed), i = seed - 1;
  const r1 = 6 + (i % 20), r2 = 3 + Math.floor(i / 20);
  const n1 = centeredSquare(r1, i % 4), n2 = centeredSquare(r2, (i + 2) % 4), ans = r1 * r2;
  const expr = `${rootTex(2, n1)} \\times ${rootTex(2, n2)}`;
  return rebuild(base, { stem: `Estimate ${math(expr)} by taking each square root to the nearest integer.`, answer: String(ans),
    wrongs: [wrong(String((r1 - 1) * r2), "FIRST_LOW", "The first root was estimated one integer too low."), wrong(String(r1 * (r2 + 1)), "SECOND_HIGH", "The second root was estimated one integer too high."), wrong(String((r1 + 1) * (r2 + 1)), "BOTH_HIGH", "Both root estimates were taken one integer too high.")],
    data: { n1, n2, r1, r2, answer: ans, band1: i % 4, band2: (i + 2) % 4 }, concept: "Estimate each root to its nearest integer before multiplying.",
    steps: [`${math(rootTex(2, n1))} ≈ ${r1} and ${math(rootTex(2, n2))} ≈ ${r2}.`, math(`${r1} \\times ${r2} = ${ans}`)],
    verification: ["The two radicands sample both sides of their nearest-integer ranges."], tag: "root-product-depth" });
}

function rootQuotient(seed: number): SapCp010Package {
  const id = SAP_CP010_PROTOTYPE_IDS[10]!, base = generateRootDepthFoundation(id, seed), i = seed - 1;
  const group = Math.floor(i / 25), dr = 3 + (i % 25), q = 2 + group, nr = dr * q;
  const n = centeredSquare(nr, i % 4), d = centeredSquare(dr, (i + 2) % 4);
  const expr = `${rootTex(2, n)} \\div ${rootTex(2, d)}`;
  return rebuild(base, { stem: `Estimate ${math(expr)} by taking each square root to the nearest integer.`, answer: String(q),
    wrongs: [wrong(String(q - 1), "ONE_LOW", "The quotient is one unit too low."), wrong(String(q + 1), "ONE_HIGH", "The quotient is one unit too high."), wrong(String(q + 2), "TWO_HIGH", "The quotient is two units too high.")],
    data: { n, d, numeratorRoot: nr, divisorRoot: dr, quotient: q, group, numeratorBand: i % 4, divisorBand: (i + 2) % 4 }, concept: "Estimate the numerator and denominator roots separately, then divide.",
    steps: [`${math(rootTex(2, n))} ≈ ${nr} and ${math(rootTex(2, d))} ≈ ${dr}.`, math(`${nr} \\div ${dr} = ${q}`)],
    verification: ["The 100 states use 25 divisor roots across four quotient levels; both roots remain inside their nearest-integer ranges."], tag: "root-quotient-depth" });
}

function missingRadicand(seed: number): SapCp010Package {
  const id = SAP_CP010_PROTOTYPE_IDS[12]!, base = generateRootDepthFoundation(id, seed), i = seed - 1;
  const k = 8 + (i % 25), group = Math.floor(i / 25), below = group >= 2, far = group % 2 === 1;
  const square = k * k, lowBoundary = (k - 0.5) ** 2, highBoundary = (k + 0.5) ** 2;
  const span = below ? square - lowBoundary : highBoundary - square;
  const distance = Math.max(1, Math.floor(span * (far ? 0.82 : 0.38)));
  const n = below ? square - distance : square + distance, answer = String(n), side = below ? "below" : "above";
  const outside = below ? Math.floor(lowBoundary) : Math.ceil(highBoundary);
  return rebuild(base, { stem: `Which value ${side} ${square} has a square root nearest to ${k}?`, answer,
    wrongs: below ? [wrong(String(outside), "OUTSIDE_BAND", "Just outside the required nearest-integer range."), wrong(String((k - 1) ** 2 + 1), "PREVIOUS_ROOT", "Nearer to the previous integer root."), wrong(String((k - 1) ** 2 - 2), "BELOW_PREVIOUS", "Below the previous perfect square.")] : [wrong(String(outside), "OUTSIDE_BAND", "Just outside the required nearest-integer range."), wrong(String((k + 1) ** 2 - 1), "NEXT_ROOT", "Nearer to the next integer root."), wrong(String((k + 1) ** 2 + 2), "ABOVE_NEXT", "Above the next perfect square.")],
    data: { k, square, correctN: n, side: below ? "BELOW" : "ABOVE", depth: far ? "FAR" : "MID" }, concept: "Use the range of numbers whose square roots round to the required integer.",
    steps: [`${math(`${k}^{2} = ${square}`)}, and ${n} is ${Math.abs(n - square)} ${side} it.`, `${math(rootTex(2, n))} remains on ${k}'s side of the nearest-integer boundary, so it is nearest to ${k}.`],
    verification: ["The correct values are sampled from materially different positions inside the allowed range."], tag: "missing-radicand-depth" });
}

function nearestOption(seed: number): SapCp010Package {
  const id = SAP_CP010_PROTOTYPE_IDS[14]!, base = generateRootDepthFoundation(id, seed);
  if (String(base.oracle.data.kind) !== "ROOT") return polish(base);
  const local = Math.floor((seed - 1) / 2), k = 10 + (local % 10), band = Math.floor(local / 10) % 5;
  const n = intervalRadicand(k, 2, band), scaled = 4 * n, midpoint = (2 * k + 1) ** 2;
  const answer = scaled < midpoint ? k : k + 1, r = rootTex(2, n);
  return rebuild(base, { stem: `Which option is nearest to ${math(r)}?`, answer: String(answer),
    wrongs: [wrong(String(answer - 1), "ONE_LOW", "One integer too low."), wrong(String(answer + 1), "ONE_HIGH", "One integer too high."), wrong(String(answer + (answer === k ? 2 : -2)), "TWO_AWAY", "Two integers away.")],
    data: { kind: "ROOT", n, k, band, answer, scaled, midpoint }, concept: "Bracket the root and use the half-way point to choose the nearest option.",
    steps: [math(`${k}^{2} = ${k ** 2} < ${n} < ${(k + 1) ** 2} = ${k + 1}^{2}`), `${scaled < midpoint ? `${math(r)} < ${k}.5` : `${math(r)} > ${k}.5`}, so ${answer} is nearest.`],
    verification: ["The sample covers several positions across the interval, including both sides of the half-way point."], tag: "nearest-option-root-depth" });
}

function diagnosis(seed: number): SapCp010Package {
  const id = SAP_CP010_PROTOTYPE_IDS[16]!, base = generateRootDepthFoundation(id, seed), i = seed - 1;
  const k = 9 + (i % 20), band = Math.floor(i / 20) % 5, n = intervalRadicand(k, 2, band);
  const scaled = 4 * n, midpoint = (2 * k + 1) ** 2, correct = scaled < midpoint ? k : k + 1, wrongRoot = correct === k ? k + 1 : k;
  const r = rootTex(2, n), answer = `Use ${correct}; ${math(`${correct}^{2} = ${correct ** 2}`)} gives the nearer integer root estimate.`;
  return rebuild(base, { stem: `For estimating ${math(r)} to the nearest integer, a student uses ${wrongRoot}. Which correction is appropriate?`, answer,
    wrongs: [wrong(`Keep ${wrongRoot}; it is already nearer.`, "KEEP_WRONG", "The half-way check rejects this estimate."), wrong(`Use ${Math.max(1, correct - 1)} instead.`, "TOO_LOW", "This moves one integer too low."), wrong(`Use ${correct + 1} instead.`, "TOO_HIGH", "This moves one integer too high.")],
    data: { n, k, band, correctRoot: correct, wrongRoot, scaled, midpoint }, concept: "Use nearby perfect squares and the half-way point to decide which integer is nearer.",
    steps: [math(`${k}^{2} = ${k ** 2} < ${n} < ${(k + 1) ** 2} = ${k + 1}^{2}`), `${scaled < midpoint ? `${math(r)} < ${k}.5` : `${math(r)} > ${k}.5`}, so ${correct} is nearer than ${wrongRoot}.`],
    verification: ["Diagnosis states span the full interval instead of only perfect-square + 1 cases."], tag: "diagnosis-root-depth" });
}

export function generateSapCp010(id: SapCp010PrototypeId, seed: number): SapCp010Package {
  const mode = SAP_CP010_PROTOTYPE_IDS.indexOf(id);
  if (mode === 9) return rootProduct(seed);
  if (mode === 10) return rootQuotient(seed);
  if (mode === 12) return missingRadicand(seed);
  if (mode === 14) return nearestOption(seed);
  if (mode === 16) return diagnosis(seed);
  return polish(generateRootDepthFoundation(id, seed));
}

export function generateSapCp010Sweep(seedsPerMode = 100): readonly SapCp010Package[] {
  return Object.freeze(SAP_CP010_PROTOTYPE_IDS.flatMap((id) => Array.from({ length: seedsPerMode }, (_, i) => generateSapCp010(id, i + 1))));
}
