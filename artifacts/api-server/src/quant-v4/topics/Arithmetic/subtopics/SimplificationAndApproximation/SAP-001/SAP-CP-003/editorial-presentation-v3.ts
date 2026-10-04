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

function distinguishDiagnosisSurface(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP") return pkg;
  const prefixByAnswer: Readonly<Record<string, string>> = Object.freeze({
    "Step 1": "Review this three-step solution for",
    "Step 2": "A student records the following working for",
    "Step 3": "Consider the displayed calculation for",
    "No error": "Examine the following solution for",
  });
  const prefix = prefixByAnswer[pkg.canonicalAnswer];
  if (!prefix) return pkg;
  const stem = pkg.stem.replace(/^A student evaluates /, `${prefix} `);
  return stem === pkg.stem ? pkg : Object.freeze({ ...pkg, stem });
}


function diversifyPowerOfTenDivisionStem(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN") return pkg;
  const match = pkg.stem.match(/^Evaluate (.+) ÷ (10|100|1000)\.$/);
  if (!match) return pkg;
  const expression = `${match[1]} ÷ ${match[2]}`;
  const frames = [
    `Evaluate ${expression}.`,
    `What is the value of ${expression}?`,
    `Find the value of ${expression}.`,
    `Which of the following is equal to ${expression}?`,
  ] as const;
  return Object.freeze({ ...pkg, stem: frames[(pkg.seed - 1) % frames.length]! });
}

function diversifyDecimalPlacementStem(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT") return pkg;

  const visible = pkg.stem.match(
    /^Ignoring decimal points, (\d+) × (\d+) = (\d+)\. Which option places the decimal point correctly for (.+)\?$/,
  );
  if (visible) {
    const [, leftDigits, rightDigits, wholeProduct, expression] = visible;
    const prefix = `Ignoring decimal points, ${leftDigits} × ${rightDigits} = ${wholeProduct}.`;
    const frames = [
      `${prefix} Which option places the decimal point correctly for ${expression}?`,
      `${prefix} What is the correctly placed value of ${expression}?`,
      `${prefix} Select the correct product for ${expression}.`,
      `${prefix} Which of the following is equal to ${expression}?`,
    ] as const;
    return Object.freeze({ ...pkg, stem: frames[(pkg.seed - 1) % frames.length]! });
  }

  const legacy = pkg.stem.match(/^Which option is the correct value of (.+)\?$/);
  if (!legacy) return pkg;
  const expression = legacy[1]!;
  const frames = [
    `Which option is the correct value of ${expression}?`,
    `What is the value of ${expression}?`,
    `Find the correct product: ${expression}.`,
    `Which of the following is equal to ${expression}?`,
  ] as const;
  return Object.freeze({ ...pkg, stem: frames[(pkg.seed - 1) % frames.length]! });
}

function bindFinalAnswer(pkg: SapCp003Package): SapCp003Package {
  if (pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer)) return pkg;
  return Object.freeze({
    ...pkg,
    explanation: Object.freeze({
      ...pkg.explanation,
      finalAnswer: ensureSentence(`Therefore, the correct answer is ${pkg.canonicalAnswer}`),
    }),
  });
}

export function applySapCp003EditorialPresentationV3(pkg: SapCp003Package): SapCp003Package {
  const recurringReady = makeRecurringConversionExplicit(pkg);
  const inverseReady = addInverseVerification(recurringReady);
  const diagnosisReady = distinguishDiagnosisSurface(inverseReady);
  const powerOfTenReady = diversifyPowerOfTenDivisionStem(diagnosisReady);
  const placementReady = diversifyDecimalPlacementStem(powerOfTenReady);
  return bindFinalAnswer(placementReady);
}
