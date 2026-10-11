import { multiply, subtract, toMixedString } from "../../TSD-001/foundation/rational";
import { calculationWriter, EDITORIAL_REVIEW_LOCK, type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { TSD_CP012_NATIVE_HINDI_REVIEW_FINAL, TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL } from "./native-review-editorial-final";

const sources = [TSD_CP012_ENGLISH_REVIEW_FINAL, TSD_CP012_NATIVE_HINDI_REVIEW_FINAL, TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL] as const;
const locales: readonly ReviewLocale[] = ["en-IN", "hi-IN", "pa-IN"];
export const TSD_CP012_TWO_ENGINE_WORKED_REVIEW_V1 = Object.freeze(sources.flatMap((rows, index) => rows.filter(row => row.input.authorityKey === "twoEngineInverseState").map(source => {
  const input = source.input;
  if (input.authorityKey !== "twoEngineInverseState" || source.solution.kind !== "SCALAR") throw new Error("Invalid two-engine source");
  const writer = calculationWriter(locales[index]);
  const determinant = writer.put(["Elimination coefficient", "विलोपन गुणांक", "ਖਾਤਮਾ ਗੁਣਾਂਕ"], `(${input.a1.numerator}/${input.a1.denominator}) × (${input.b2.numerator}/${input.b2.denominator}) − (${input.a2.numerator}/${input.a2.denominator}) × (${input.b1.numerator}/${input.b1.denominator})`, subtract(multiply(input.a1,input.b2),multiply(input.a2,input.b1)), "");
  const xNumerator = writer.put(["First speed numerator", "पहली चाल का अंश", "ਪਹਿਲੀ ਚਾਲ ਦਾ ਅੰਸ਼"], `(${toMixedString(input.c1)}) × (${toMixedString(input.b2)}) − (${toMixedString(input.c2)}) × (${toMixedString(input.b1)})`, subtract(multiply(input.c1,input.b2),multiply(input.c2,input.b1)), "");
  const x = writer.binary(["First speed", "पहली चाल", "ਪਹਿਲੀ ਚਾਲ"], xNumerator, "÷", determinant, "m/s");
  const yNumerator = writer.put(["Second speed numerator", "दूसरी चाल का अंश", "ਦੂਜੀ ਚਾਲ ਦਾ ਅੰਸ਼"], `(${toMixedString(input.a1)}) × (${toMixedString(input.c2)}) − (${toMixedString(input.a2)}) × (${toMixedString(input.c1)})`, subtract(multiply(input.a1,input.c2),multiply(input.a2,input.c1)), "");
  const y = writer.binary(["Second speed", "दूसरी चाल", "ਦੂਜੀ ਚਾਲ"], yNumerator, "÷", determinant, "m/s");
  const answer = input.target === "X" ? x : y;
  if (answer.numerator * source.solution.answer.denominator !== source.solution.answer.numerator * answer.denominator) throw new Error("Source answer mismatch");
  return Object.freeze({ ...source, locale: locales[index], ...EDITORIAL_REVIEW_LOCK, version: "TSD-CP012-TWO-ENGINE-WORKED-V1", speeds: Object.freeze({x,y}), calculations: Object.freeze(writer.steps), explanation: Object.freeze({steps: Object.freeze(writer.steps.map(step=>step.text)), conclusion: source.explanation.conclusion}) });
})));
