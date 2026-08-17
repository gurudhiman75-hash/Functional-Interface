import type { SapCp004Option, SapCp004Package } from "./final-runtime";
import { sapE1Math } from "../../SAP-E1-CANDIDATE-TYPES";

function formatScaled(value: number, scale: number): string {
  const digits = String(Math.abs(value)).padStart(scale + 1, "0");
  const sign = value < 0 ? "-" : "";
  if (scale === 0) return `${sign}${digits}`;
  return `${sign}${digits.slice(0, -scale)}.${digits.slice(-scale)}`;
}

function rootTex(body: string): string { return `\\sqrt{${body}}`; }

function buildOptions(answer: string, wrongValues: readonly string[], correctIndex: number): readonly SapCp004Option[] {
  const seen = new Set<string>([answer]);
  const wrong = wrongValues.filter((value) => {
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
  let bump = 1;
  while (wrong.length < 3) {
    const numeric = Number(answer);
    const candidate = Number.isFinite(numeric) ? String(numeric + bump) : `Alternative ${bump}`;
    if (!seen.has(candidate)) { seen.add(candidate); wrong.push(candidate); }
    bump += 1;
  }
  const analyses = [
    ["ROOT_ONE_LOW", "The square root is taken one step too low."],
    ["ROOT_ONE_HIGH", "The square root is taken one step too high."],
    ["PLACE_VALUE_SLIP", "The root size is close, but the final place value is wrong."],
  ] as const;
  const options: SapCp004Option[] = [];
  let wi = 0;
  for (let position = 0; position < 4; position += 1) {
    if (position === correctIndex) options.push(Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct." }));
    else {
      const value = wrong[wi]!;
      const [misconceptionId, analysis] = analyses[wi]!;
      wi += 1;
      options.push(Object.freeze({ value, isCorrect: false, misconceptionId, analysis }));
    }
  }
  return Object.freeze(options);
}

export function expandPerfectSquareRoot(base: SapCp004Package): SapCp004Package {
  const seed = base.seed;
  const decimal = seed % 4 === 0;
  const rootHundredths = 120 + seed;
  const integerRoot = 10 + seed;
  const answer = decimal ? formatScaled(rootHundredths, 2) : String(integerRoot);
  const radicand = decimal
    ? formatScaled(rootHundredths * rootHundredths, 4)
    : String(integerRoot * integerRoot);
  const wrongs = decimal
    ? [formatScaled(rootHundredths - 1, 2), formatScaled(rootHundredths + 1, 2), formatScaled(rootHundredths + 10, 2)]
    : [String(integerRoot - 1), String(integerRoot + 1), String(integerRoot + 2)];
  const options = buildOptions(answer, wrongs, base.correctIndex);
  const stem = `Find the exact value of ${sapE1Math(rootTex(radicand))}.`;
  const decimalData = decimal ? { decimalRootScaled: rootHundredths, scale: 2, radicandScaled: rootHundredths * rootHundredths } : {};
  const oracle = Object.freeze({ kind: "SQUARE_ROOT" as const, data: Object.freeze({ integerRoot, radicandInteger: integerRoot * integerRoot, ...decimalData }) });
  const explanation = Object.freeze({
    coreConcept: "Recognise the displayed number as an exact perfect square and take its principal square root.",
    steps: Object.freeze([`${answer} × ${answer} = ${radicand}.`, `Therefore ${sapE1Math(rootTex(radicand))} = ${answer}.`]),
    finalAnswer: `Therefore, the exact value is ${answer}.`,
  });
  return Object.freeze({
    ...base,
    difficulty: decimal ? "MEDIUM" : "EASY",
    answerSemantic: decimal ? "EXACT_RATIONAL" : "EXACT_INTEGER",
    frameId: decimal ? "SAP-CP004-E1-DECIMAL-SQRT" : "SAP-CP004-E1-INTEGER-SQRT",
    stem,
    canonicalAnswer: answer,
    options,
    explanation,
    oracle,
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, seed, stem, answer, oracle, e1: "ROOT-100-MATERIAL" }),
    generationIdentity: `${base.prototypeId}:E1:ROOT-100:${seed}:${radicand}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
  });
}

export function expandRootMixedArithmetic(base: SapCp004Package): SapCp004Package {
  const seed = base.seed;
  const decimal = seed % 4 === 1;
  const add = 2 + (seed % 9);
  const rootHundredths = 150 + seed;
  const integerRoot = 8 + seed;
  const rootValue = decimal ? formatScaled(rootHundredths, 2) : String(integerRoot);
  const radicand = decimal
    ? formatScaled(rootHundredths * rootHundredths, 4)
    : String(integerRoot * integerRoot);
  const answer = decimal ? formatScaled(rootHundredths + add * 100, 2) : String(integerRoot + add);
  const wrongs = decimal
    ? [formatScaled(rootHundredths + (add - 1) * 100, 2), formatScaled(rootHundredths + (add + 1) * 100, 2), formatScaled(rootHundredths + add * 100 + 10, 2)]
    : [String(integerRoot + add - 1), String(integerRoot + add + 1), String(integerRoot + add + 2)];
  const options = buildOptions(answer, wrongs, base.correctIndex);
  const stem = `Evaluate ${sapE1Math(`${rootTex(radicand)} + ${add}`)}.`;
  const decimalData = decimal ? { decimalRootScaled: rootHundredths, scale: 2, radicandScaled: rootHundredths * rootHundredths } : {};
  const oracle = Object.freeze({ kind: "ROOT_ARITHMETIC" as const, data: Object.freeze({ integerRoot, radicandInteger: integerRoot * integerRoot, add, ...decimalData }) });
  const explanation = Object.freeze({
    coreConcept: "Take the exact square root first, then complete the ordinary addition.",
    steps: Object.freeze([`${sapE1Math(rootTex(radicand))} = ${rootValue}.`, `${rootValue} + ${add} = ${answer}.`]),
    finalAnswer: `Therefore, the exact value is ${answer}.`,
  });
  return Object.freeze({
    ...base,
    difficulty: decimal ? "MEDIUM" : "EASY",
    answerSemantic: decimal ? "EXACT_RATIONAL" : "EXACT_INTEGER",
    frameId: decimal ? "SAP-CP004-E1-DECIMAL-ROOT-ARITH" : "SAP-CP004-E1-INTEGER-ROOT-ARITH",
    stem,
    canonicalAnswer: answer,
    options,
    explanation,
    oracle,
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, seed, stem, answer, oracle, e1: "ROOT-ARITH-100-MATERIAL" }),
    generationIdentity: `${base.prototypeId}:E1:ROOT-ARITH-100:${seed}:${radicand}:${add}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
  });
}
