import {
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004Package as generateFrozenCandidate,
  type SapCp004Option,
  type SapCp004Package,
  type SapCp004PrototypeId,
} from "./final-runtime";
import {
  SAP_E1_INACTIVE_LIFECYCLE,
  sapE1BaseValidation,
  sapE1Math,
  sapE1Options,
  type SapE1CandidatePackage,
} from "../../SAP-E1-CANDIDATE-TYPES";

export { SAP_CP004_PROTOTYPE_IDS };
export type { SapCp004Package, SapCp004PrototypeId };

function formatScaled(value: number, scale: number): string {
  const sign = value < 0 ? "-" : "";
  const digits = String(Math.abs(value)).padStart(scale + 1, "0");
  if (scale === 0) return `${sign}${digits}`;
  return `${sign}${digits.slice(0, -scale)}.${digits.slice(-scale)}`;
}

function rootTex(index: number, body: string): string {
  return index === 2 ? `\\sqrt{${body}}` : `\\sqrt[${index}]{${body}}`;
}

export function latexifyCp004LearnerText(text: string): string {
  let out = text;
  out = out.replace(/√\((∛|∜|√)(\d+)\)/g, (_m, inner, n) => {
    const innerIndex = inner === "∛" ? 3 : inner === "∜" ? 4 : 2;
    return sapE1Math(rootTex(2, rootTex(innerIndex, n)));
  });
  out = out.replace(/([√∛∜])\(([^()]*)\)/g, (_m, symbol, body) => {
    const index = symbol === "∛" ? 3 : symbol === "∜" ? 4 : 2;
    return sapE1Math(rootTex(index, String(body).replace(/\^(\d+)/g, "^{$1}")));
  });
  out = out.replace(/([√∛∜])(\d+)/g, (_m, symbol, n) => {
    const index = symbol === "∛" ? 3 : symbol === "∜" ? 4 : 2;
    return sapE1Math(rootTex(index, n));
  });
  return out;
}

function decimalOptions(answerScaled: number, correctIndex: number): readonly SapCp004Option[] {
  const answer = formatScaled(answerScaled, 2);
  const values = [formatScaled(answerScaled - 1, 2), formatScaled(answerScaled + 1, 2), formatScaled(answerScaled + 10, 2)];
  const specs = [
    { value: values[0]!, misconceptionId: "ROOT_ONE_HUNDREDTH_LOW", analysis: "The exact decimal root is taken one hundredth too low." },
    { value: values[1]!, misconceptionId: "ROOT_ONE_HUNDREDTH_HIGH", analysis: "The exact decimal root is taken one hundredth too high." },
    { value: values[2]!, misconceptionId: "DECIMAL_PLACE_SLIP", analysis: "The root magnitude is close, but the final decimal place is shifted." },
  ];
  const options: SapCp004Option[] = [];
  let wi = 0;
  for (let pos = 0; pos < 4; pos += 1) {
    if (pos === correctIndex) options.push(Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct." }));
    else {
      const item = specs[wi++]!;
      options.push(Object.freeze({ value: item.value, isCorrect: false, misconceptionId: item.misconceptionId, analysis: item.analysis }));
    }
  }
  return Object.freeze(options);
}

function decimalSquareRoot(base: SapCp004Package): SapCp004Package {
  const rootScaled = 120 + base.seed;
  const radicandScaled = rootScaled * rootScaled;
  const radicand = formatScaled(radicandScaled, 4);
  const answer = formatScaled(rootScaled, 2);
  const options = decimalOptions(rootScaled, base.correctIndex);
  const stem = `Find the exact value of ${sapE1Math(rootTex(2, radicand))}.`;
  const oracle = Object.freeze({ kind: "SQUARE_ROOT" as const, data: Object.freeze({ decimalRootScaled: rootScaled, scale: 2, radicandScaled }) });
  const explanation = Object.freeze({
    coreConcept: "Treat a terminating decimal perfect square exactly; do not estimate it.",
    steps: Object.freeze([`${answer} × ${answer} = ${radicand}.`, `Therefore ${sapE1Math(rootTex(2, radicand))} = ${answer}.`]),
    finalAnswer: `Therefore, the exact value is ${answer}.`,
  });
  const errors = [...base.validation.errors].filter((e) => !/numeric-answer option/i.test(e));
  if (new Set(options.map((o) => o.value)).size !== 4) errors.push("Decimal-root options are not distinct.");
  return Object.freeze({
    ...base,
    answerSemantic: "EXACT_RATIONAL",
    frameId: "SAP-CP004-E1-DECIMAL-SQRT",
    stem,
    canonicalAnswer: answer,
    options,
    explanation,
    oracle,
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, stem, answer, oracle, e1: "DECIMAL_EXACT_ROOT" }),
    generationIdentity: `${base.prototypeId}:E1:DECIMAL-EXACT-ROOT:${base.seed}:${radicandScaled}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function decimalRootArithmetic(base: SapCp004Package): SapCp004Package {
  const rootScaled = 150 + base.seed;
  const radicandScaled = rootScaled * rootScaled;
  const add = 2 + (base.seed % 9);
  const answerScaled = rootScaled + add * 100;
  const radicand = formatScaled(radicandScaled, 4);
  const root = formatScaled(rootScaled, 2);
  const answer = formatScaled(answerScaled, 2);
  const options = decimalOptions(answerScaled, base.correctIndex);
  const stem = `Evaluate ${sapE1Math(`${rootTex(2, radicand)} + ${add}`)}.`;
  const oracle = Object.freeze({ kind: "ROOT_ARITHMETIC" as const, data: Object.freeze({ decimalRootScaled: rootScaled, scale: 2, radicandScaled, add }) });
  const explanation = Object.freeze({
    coreConcept: "Evaluate the terminating-decimal perfect root exactly, then complete the ordinary arithmetic.",
    steps: Object.freeze([`${sapE1Math(rootTex(2, radicand))} = ${root}.`, `${root} + ${add} = ${answer}.`]),
    finalAnswer: `Therefore, the exact value is ${answer}.`,
  });
  return Object.freeze({
    ...base,
    answerSemantic: "EXACT_RATIONAL",
    frameId: "SAP-CP004-E1-DECIMAL-ROOT-ARITH",
    stem,
    canonicalAnswer: answer,
    options,
    explanation,
    oracle,
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, stem, answer, oracle, e1: "DECIMAL_ROOT_ARITHMETIC" }),
    generationIdentity: `${base.prototypeId}:E1:DECIMAL-ROOT-ARITH:${base.seed}:${radicandScaled}:${add}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
  });
}

function presentationRemediation(base: SapCp004Package): SapCp004Package {
  const stem = latexifyCp004LearnerText(base.stem);
  const options = Object.freeze(base.options.map((o) => Object.freeze({ ...o, value: latexifyCp004LearnerText(o.value), analysis: latexifyCp004LearnerText(o.analysis) })));
  const explanation = Object.freeze({
    coreConcept: latexifyCp004LearnerText(base.explanation.coreConcept),
    steps: Object.freeze(base.explanation.steps.map(latexifyCp004LearnerText)),
    finalAnswer: latexifyCp004LearnerText(base.explanation.finalAnswer),
  });
  const visible = `${stem} ${options.map((o) => o.value).join(" ")} ${explanation.steps.join(" ")}`;
  const errors = [...base.validation.errors];
  if (/[√∛∜]/.test(visible)) errors.push("Raw Unicode radical remains after E1 presentation remediation.");
  return Object.freeze({
    ...base,
    stem,
    options,
    explanation,
    canonicalPayloadKey: JSON.stringify({ original: base.canonicalPayloadKey, stem, e1: "SCOPED_LATEX_ROOTS" }),
    generationIdentity: `${base.generationIdentity}:E1:SCOPED-LATEX-ROOTS`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp004E1Existing(prototypeId: SapCp004PrototypeId, seed: number): SapCp004Package {
  const base = generateFrozenCandidate(prototypeId, seed);
  if (prototypeId === "SAP-CP004-PROT-PERFECT-SQUARE-ROOT" && seed % 4 === 0) return decimalSquareRoot(base);
  if (prototypeId === "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC" && seed % 4 === 1) return decimalRootArithmetic(base);
  return presentationRemediation(base);
}

export const SAP_CP004_E1_NESTED_ADDITIVE_CANDIDATE_ID = "SAP-CP004-E1-CAND-NESTED-ADDITIVE-EXACT-RADICAL" as const;

export function generateSapCp004E1NestedAdditive(seed: number): SapE1CandidatePackage {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const i = seed - 1;
  const outer = 15 + (i % 25);
  const group = Math.floor(i / 25) % 4;
  const middle = 5 + group + (i % 3);
  const inner = 2 + ((i * 3 + group) % 4);
  const c = inner * inner;
  const b = middle * middle - inner;
  const a = outer * outer - middle;
  const expression = rootTex(2, `${a} + ${rootTex(2, `${b} + ${rootTex(2, String(c))}`)}`);
  const stem = `Evaluate ${sapE1Math(expression)}.`;
  const answer = String(outer);
  const correctIndex = i % 4;
  const options = sapE1Options(answer, [
    { value: String(middle), misconceptionId: "STOPPED_AT_MIDDLE_ROOT", analysis: "This evaluates the inner two layers but stops before taking the outer square root." },
    { value: String(outer - 1), misconceptionId: "OUTER_ROOT_ONE_LOW", analysis: "The inner layers are simplified, but the final square root is taken one integer too low." },
    { value: String(outer + 1), misconceptionId: "OUTER_ROOT_ONE_HIGH", analysis: "The inner layers are simplified, but the final square root is taken one integer too high." },
  ], correctIndex);
  const steps = Object.freeze([
    `${sapE1Math(rootTex(2, String(c)))} = ${inner}, so ${b} + ${inner} = ${middle * middle}.`,
    `${sapE1Math(rootTex(2, String(middle * middle)))} = ${middle}, so ${a} + ${middle} = ${outer * outer}.`,
    `${sapE1Math(rootTex(2, String(outer * outer)))} = ${outer}.`,
  ]);
  const verification = Object.freeze([`Direct check: ${inner}² = ${c}, ${middle}² = ${b} + ${inner}, and ${outer}² = ${a} + ${middle}.`]);
  const errors = [...sapE1BaseValidation({ stem, answer, options, correctIndex, steps })];
  if (a <= 0 || b <= 0) errors.push("Nested additive construction must remain positive.");
  const data = Object.freeze({ a, b, c, inner, middle, outer });
  return Object.freeze({
    packageId: "SAP-001",
    checkpointId: "SAP-CP-004",
    candidateId: SAP_CP004_E1_NESTED_ADDITIVE_CANDIDATE_ID,
    candidateStatus: "E1_PROVISIONAL_UNALLOCATED",
    sourceDisposition: "E1_ADD_NESTED_ADDITIVE_EXACT_RADICAL",
    seed,
    locale: "en-IN",
    difficulty: "HARD",
    stem,
    canonicalAnswer: answer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Work from the innermost exact root outward, completing the addition at each layer before taking the next root.",
      steps,
      finalAnswer: `Therefore, the exact value is ${answer}.`,
      verification,
    }),
    oracle: Object.freeze({ kind: "NESTED_ADDITIVE_EXACT_RADICAL", data }),
    canonicalPayloadKey: JSON.stringify({ candidateId: SAP_CP004_E1_NESTED_ADDITIVE_CANDIDATE_ID, seed, data, answer }),
    generationIdentity: `${SAP_CP004_E1_NESTED_ADDITIVE_CANDIDATE_ID}:${seed}:${JSON.stringify(data)}`,
    lifecycle: SAP_E1_INACTIVE_LIFECYCLE,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}
