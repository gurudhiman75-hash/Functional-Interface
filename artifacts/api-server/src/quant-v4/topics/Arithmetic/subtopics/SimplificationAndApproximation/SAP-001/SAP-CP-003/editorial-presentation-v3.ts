import { ensureSentence } from "./exact";
import type { SapCp003Package } from "./types";

function makeRecurringConversionExplicit(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION") return pkg;
  const firstStep = pkg.explanation.steps[0] ?? "";
  if (/exact fraction/i.test(firstStep)) return pkg;
  const steps = Object.freeze([
    ensureSentence(`Convert the recurring decimal to its exact fraction: ${firstStep.replace(/[.]$/, "")}`),
    ...pkg.explanation.steps.slice(1),
  ]);
  return Object.freeze({
    ...pkg,
    explanation: Object.freeze({
      ...pkg.explanation,
      steps,
    }),
  });
}

function addInverseVerification(pkg: SapCp003Package): SapCp003Package {
  if (pkg.taskDirection !== "INVERSE") return pkg;
  if (pkg.explanation.steps.some((step) => /check/i.test(step))) return pkg;
  const steps = Object.freeze([
    ...pkg.explanation.steps,
    ensureSentence(`Check: substituting ${pkg.canonicalAnswer} for the missing value in the original question reproduces the displayed equality`),
  ]);
  return Object.freeze({
    ...pkg,
    explanation: Object.freeze({
      ...pkg.explanation,
      steps,
    }),
  });
}

export function applySapCp003EditorialPresentationV3(pkg: SapCp003Package): SapCp003Package {
  return addInverseVerification(makeRecurringConversionExplicit(pkg));
}
