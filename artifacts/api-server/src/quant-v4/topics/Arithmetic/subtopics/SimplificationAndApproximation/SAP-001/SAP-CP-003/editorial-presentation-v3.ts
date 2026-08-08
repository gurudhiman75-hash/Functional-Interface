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

export function applySapCp003EditorialPresentationV3(pkg: SapCp003Package): SapCp003Package {
  return makeRecurringConversionExplicit(pkg);
}
