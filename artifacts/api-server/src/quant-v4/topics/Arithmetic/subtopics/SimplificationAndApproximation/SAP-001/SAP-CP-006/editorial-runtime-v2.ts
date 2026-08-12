import type { SapCp006Option, SapCp006Package, SapCp006PrototypeId } from "./runtime";
import { generateSapCp006Editorial as generateV1 } from "./editorial-runtime";

function integerOptions(answer: number, correctIndex: number): readonly SapCp006Option[] {
  const candidates = [Math.max(1, answer - 1), answer + 1, answer + 2, answer * 2].filter((value, index, values) => value !== answer && values.indexOf(value) === index).slice(0, 3);
  while (candidates.length < 3) candidates.push(answer + candidates.length + 3);
  const options: SapCp006Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({
        value: String(answer),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This integer restores the complete displayed equality exactly when substituted.",
      });
    } else {
      const value = candidates[wrongIndex++]!;
      options.push({
        value: String(value),
        isCorrect: false,
        misconceptionId: value < answer ? "INVERSE_UNDERCOUNT" : value === answer * 2 ? "INVERSE_SCALE_ERROR" : "INVERSE_NEAR_MISS",
        analysis: value < answer
          ? "This value is one step too small and makes the reconstructed left side fall short of the target."
          : value === answer * 2
            ? "This carries an extra scale factor into the unknown instead of reversing the known operations completely."
            : "This nearby integer fails exact substitution into the complete displayed expression.",
      });
    }
  }
  return Object.freeze(options);
}

function withOptions(pkg: SapCp006Package, options: readonly SapCp006Option[], steps = pkg.explanation.steps): SapCp006Package {
  const errors: string[] = [];
  if (new Set(options.map((option) => option.value)).size !== 4) errors.push("Refined options are not distinct.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Refined options do not contain exactly one correct answer.");
  if (options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Refined correct option is not answer-bound.");
  return Object.freeze({
    ...pkg,
    options,
    explanation: Object.freeze({ ...pkg.explanation, steps: Object.freeze([...steps]) }),
    generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V2`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp006Editorial(prototypeId: SapCp006PrototypeId, seed: number): SapCp006Package {
  const pkg = generateV1(prototypeId, seed);

  if ([
    "SAP-CP006-PROT-MISSING-MIXED-ADDEND",
    "SAP-CP006-PROT-MISSING-MIXED-FACTOR",
    "SAP-CP006-PROT-MISSING-MIXED-DIVISOR",
    "SAP-CP006-PROT-MISSING-BRACKET-VALUE",
  ].includes(prototypeId)) {
    const answer = Number(pkg.canonicalAnswer);
    if (!Number.isInteger(answer) || answer <= 0) throw new Error(`${prototypeId}: expected positive integer editorial answer.`);
    const options = integerOptions(answer, pkg.correctIndex);
    if (prototypeId === "SAP-CP006-PROT-MISSING-MIXED-DIVISOR") {
      const d = pkg.oracle.data;
      const steps = [
        `${d.a}/${d.b} of ${d.fractionBase} = ${d.fractionValue}, and ${d.p}% of ${d.percentBase} = ${d.percentValue}.`,
        `So ${d.fractionValue} ÷ ? = ${d.target! - d.percentValue!}. Divide ${d.fractionValue} by ${d.quotientValue}; this gives ? = ${pkg.canonicalAnswer}.`,
      ];
      return withOptions(pkg, options, steps);
    }
    return withOptions(pkg, options);
  }

  return pkg;
}
