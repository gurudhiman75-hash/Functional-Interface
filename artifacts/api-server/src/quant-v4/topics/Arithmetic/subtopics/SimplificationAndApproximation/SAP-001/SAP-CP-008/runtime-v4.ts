import {
  SAP_CP008_CATALOGUE,
  SAP_CP008_INTERNAL,
  SAP_CP008_POLICY,
  SAP_CP008_PROTOTYPE_IDS,
  generateSapCp008 as generateV3,
  type SapCp008Difficulty,
  type SapCp008Option,
  type SapCp008Package,
  type SapCp008PrototypeId,
  type SapCp008TaskDirection,
} from "./runtime-v3";

export {
  SAP_CP008_CATALOGUE,
  SAP_CP008_INTERNAL,
  SAP_CP008_POLICY,
  SAP_CP008_PROTOTYPE_IDS,
};
export type {
  SapCp008Difficulty,
  SapCp008Option,
  SapCp008Package,
  SapCp008PrototypeId,
  SapCp008TaskDirection,
};

const CONCEPTS: Record<SapCp008PrototypeId, string> = {
  "SAP-CP008-PROT-APPROX-INTEGER-SUM": "Round each addend to the place named in the question and then add the rounded numbers. Adding the exact numbers first and rounding only at the end would be a different method.",
  "SAP-CP008-PROT-APPROX-INTEGER-DIFFERENCE": "Round both numbers to the stated place before subtracting. Keep the subtraction sign unchanged and use the two rounded values exactly as they stand.",
  "SAP-CP008-PROT-SIGNED-ADDITIVE-CHAIN": "Keep every plus and minus sign attached to its term. Round the numbers first, then evaluate the resulting addition and subtraction in the usual order.",
  "SAP-CP008-PROT-BRACKETED-ADDITIVE-CHAIN": "Rounding changes the numbers, not the brackets. Round the displayed terms first, keep the grouping exactly as printed, and then simplify inside the bracket before finishing the sum.",
  "SAP-CP008-PROT-DECIMAL-SUM": "Round each decimal to the nearest integer first and then add those integers. The final estimate should therefore be written as an integer, not with an unnecessary trailing .0.",
  "SAP-CP008-PROT-DECIMAL-DIFFERENCE": "Round both decimals to the nearest integer first and then subtract. Do not subtract the exact decimals first, because the question specifically asks for a terms-first estimate.",
  "SAP-CP008-PROT-COMPATIBLE-ADDENDS": "Each number has a definite nearest ten or hundred under the stated rule. Use those two rounded numbers as the convenient pair for estimating the sum.",
  "SAP-CP008-PROT-ADD-MULTIPLY-ADDITIVE-DOMINANT": "Round the displayed numbers first but keep the small multiplier exact. After rounding, do the multiplication before the final addition.",
  "SAP-CP008-PROT-DIVIDE-ADD-ADDITIVE-DOMINANT": "Use the stated convenient multiple for the first number and the stated rounded value for the second. Divide the first rounded number by the fixed divisor, then add the second rounded number.",
  "SAP-CP008-PROT-BOUNDED-BODMAS-ADDITIVE": "Round the displayed numbers first, then keep the brackets and order of operations unchanged. Multiplication is completed before the final addition or subtraction outside the bracket.",
  "SAP-CP008-PROT-MISSING-ADDEND-APPROX-EQUALITY": "First round the known term. Then use the estimated total to recover the missing rounded addend by subtraction.",
  "SAP-CP008-PROT-MISSING-SUBTRAHEND-APPROX-EQUALITY": "First round the known first term. Then recover the missing rounded subtrahend from: rounded first term minus estimated difference.",
  "SAP-CP008-PROT-NEAREST-OPTION-ADDITIVE": "Compute the required rounded estimate first. Once that estimate is known, compare it with the options and choose the closest one.",
  "SAP-CP008-PROT-SUM-ROUNDING-BOUNDS": "A rounded number represents a whole interval of possible original values. For a sum, add the two lower endpoints to get the smallest possible sum and add the two upper endpoints to get the upper limit.",
  "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS": "For first number minus second number, the smallest possible difference comes from the first number being as small as possible and the second as large as possible. Reverse those choices for the upper limit.",
  "SAP-CP008-PROT-OVER-UNDER-CLASS": "Find the rounded estimate and the exact sum, then compare them. If the estimate is larger it is an overestimate; if it is smaller it is an underestimate.",
  "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES": "Apply the same rounding rule to both sums, evaluate both estimates, and compare the two resulting numbers. Do not compare the unrounded sums instead.",
  "SAP-CP008-PROT-DIAGNOSE-INVALID-ROUNDING-DIRECTION": "Check the rounding step before checking the final addition. A student can add the rounded numbers correctly and still get the wrong estimate if one number was rounded in the wrong direction.",
};

function cleanAnalysis(text: string): string {
  return text
    .replace(/declared terms-first approximation policy/gi, "stated rounding rule")
    .replace(/declared policy/gi, "stated rounding rule")
    .replace(/approved transformed difference/gi, "required rounded difference")
    .replace(/approved estimate/gi, "required estimate")
    .replace(/approved rounded values/gi, "required rounded values")
    .replace(/transformed expression/gi, "rounded expression")
    .replace(/transformed estimates/gi, "rounded estimates")
    .replace(/transformed difference/gi, "rounded difference")
    .replace(/transformed equality/gi, "rounded equality")
    .replace(/transformed division/gi, "rounded-number division")
    .replace(/exact oracle/gi, "exact value")
    .replace(/oracle/gi, "exact value")
    .replace(/learner route/gi, "required method")
    .replace(/CP-008/gi, "this question")
    .replace(/additive inverse/gi, "direct subtraction check")
    .replace(/displayed benchmark/gi, "rounded value")
    .replace(/benchmark/gi, "rounded value");
}

function studentVerification(pkg: SapCp008Package): readonly string[] {
  const d = pkg.oracle.data;
  switch (pkg.prototypeId) {
    case "SAP-CP008-PROT-APPROX-INTEGER-SUM":
      return Object.freeze([`Exact sum = ${Number(d.a) + Number(d.b) + Number(d.c)}.`, `Rounding the three addends as instructed gives ${pkg.canonicalAnswer}.`]);
    case "SAP-CP008-PROT-APPROX-INTEGER-DIFFERENCE":
      return Object.freeze([`Exact difference = ${Number(d.a) - Number(d.b)}.`, `Rounding both terms first gives the required estimate ${pkg.canonicalAnswer}.`]);
    case "SAP-CP008-PROT-SIGNED-ADDITIVE-CHAIN":
      return Object.freeze([`Exact value before rounding = ${Number(d.a) - Number(d.b) + Number(d.c)}.`, "The plus and minus signs stay unchanged when the terms are rounded."]);
    case "SAP-CP008-PROT-BRACKETED-ADDITIVE-CHAIN":
      return Object.freeze([`Exact value before rounding = ${Number(d.a) + Number(d.b) - Number(d.c)}.`, "The bracket remains in the same place after rounding."]);
    case "SAP-CP008-PROT-DECIMAL-SUM": {
      const exact = (Number(d.a) + Number(d.b) + Number(d.c)) / 10;
      return Object.freeze([`Exact sum = ${exact}.`, `The requested nearest-integer terms-first estimate is ${pkg.canonicalAnswer}.`]);
    }
    case "SAP-CP008-PROT-DECIMAL-DIFFERENCE": {
      const exact = (Number(d.a) - Number(d.b)) / 10;
      return Object.freeze([`Exact difference = ${exact}.`, `The requested nearest-integer terms-first estimate is ${pkg.canonicalAnswer}.`]);
    }
    case "SAP-CP008-PROT-COMPATIBLE-ADDENDS":
      return Object.freeze([`${d.a} rounds to ${d.targetA}.`, `${d.b} rounds to ${d.targetB}, so the required pair is ${pkg.canonicalAnswer}.`]);
    case "SAP-CP008-PROT-ADD-MULTIPLY-ADDITIVE-DOMINANT":
      return Object.freeze([`The multiplier ${d.multiplier} is exact and is not rounded.`, `Using the rounded terms in the original order gives ${pkg.canonicalAnswer}.`]);
    case "SAP-CP008-PROT-DIVIDE-ADD-ADDITIVE-DOMINANT":
      return Object.freeze([`${d.roundedA} is exactly divisible by ${d.divisor}.`, `After that division, adding ${d.roundedB} gives ${pkg.canonicalAnswer}.`]);
    case "SAP-CP008-PROT-BOUNDED-BODMAS-ADDITIVE":
      return Object.freeze(["The bracket and multiplier are unchanged by rounding.", `Applying the usual order of operations to the rounded numbers gives ${pkg.canonicalAnswer}.`]);
    case "SAP-CP008-PROT-MISSING-ADDEND-APPROX-EQUALITY":
      return Object.freeze([`Substitute ${pkg.canonicalAnswer}: ${d.roundedKnown} + ${pkg.canonicalAnswer} = ${d.target}.`, "So the missing rounded addend is uniquely determined."]);
    case "SAP-CP008-PROT-MISSING-SUBTRAHEND-APPROX-EQUALITY":
      return Object.freeze([`Substitute ${pkg.canonicalAnswer}: ${d.roundedKnown} − ${pkg.canonicalAnswer} = ${d.target}.`, "So the missing rounded subtrahend is uniquely determined."]);
    case "SAP-CP008-PROT-NEAREST-OPTION-ADDITIVE":
      return Object.freeze([`The calculated estimate is ${pkg.canonicalAnswer}.`, "Every other option is at least one full rounding unit away from this estimate."]);
    case "SAP-CP008-PROT-SUM-ROUNDING-BOUNDS": {
      const half = Number(d.unit) / 2;
      return Object.freeze([`The smallest possible sum is ${(Number(d.x) - half) + (Number(d.y) - half)}, and it is included.`, `The upper limit is ${(Number(d.x) + half) + (Number(d.y) + half)}, but that endpoint is excluded because the upper midpoints round to the next values.`]);
    }
    case "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS":
      return pkg.explanation.verification;
    case "SAP-CP008-PROT-OVER-UNDER-CLASS":
      return Object.freeze([`Estimate − exact sum = ${Number(d.estimate) - Number(d.exact)}.`, `The sign of this difference confirms ${pkg.canonicalAnswer.toLowerCase()}.`]);
    case "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES":
      return Object.freeze([`A = ${d.estimateA} and B = ${d.estimateB}.`, `Comparing these two estimates confirms ${pkg.canonicalAnswer}.`]);
    case "SAP-CP008-PROT-DIAGNOSE-INVALID-ROUNDING-DIRECTION":
      return Object.freeze([`The student's addition ${d.wrongA} + ${d.rb} = ${d.wrongEstimate} is arithmetically correct.`, `The error occurs earlier: ${d.a} should round to ${d.ra}, not ${d.wrongA}.`]);
  }
}

function editorializeExplanation(pkg: SapCp008Package): SapCp008Package {
  const options = Object.freeze(pkg.options.map((option) => Object.freeze({ ...option, analysis: cleanAnalysis(option.analysis) })));
  const explanation = Object.freeze({
    coreConcept: CONCEPTS[pkg.prototypeId],
    steps: pkg.explanation.steps,
    finalAnswer: pkg.explanation.finalAnswer,
    verification: studentVerification(pkg),
  });
  const data = Object.freeze({ ...pkg.oracle.data, explanationV4: 1 });
  const errors: string[] = [];
  const studentText = JSON.stringify({ explanation, options });
  if (/oracle|learner route|CP-008|transformed expression|declared policy|state avoids near-cancellation|scaled terms/i.test(studentText)) errors.push("Internal implementation vocabulary leaked into student-facing explanation.");
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Explanation pass disturbed option uniqueness.");
  if (options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Explanation pass disturbed answer binding.");
  return Object.freeze({
    ...pkg,
    options,
    explanation,
    oracle: Object.freeze({ kind: pkg.prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: pkg.prototypeId, stem: pkg.stem, answer: pkg.canonicalAnswer, data }),
    generationIdentity: `${pkg.prototypeId}:v4:seed:${pkg.seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp008(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  return editorializeExplanation(generateV3(prototypeId, seed));
}

export function generateSapCp008Sweep(seedsPerMode = 100): readonly SapCp008Package[] {
  if (!Number.isInteger(seedsPerMode) || seedsPerMode < 1) throw new Error("seedsPerMode must be positive.");
  return Object.freeze(SAP_CP008_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp008(prototypeId, index + 1))));
}
