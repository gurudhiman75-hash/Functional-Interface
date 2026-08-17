import type { SapCp004Package } from "./runtime";
import { applySapCp004ExplanationRemediationV3 } from "./explanation-remediation-v3";

function polishLine(line: string): string {
  return line.replace(/There are 1 factors of (\d+), so x = 1\./gu, "There is 1 factor of $1, so x = 1.");
}

export function applySapCp004ExplanationRemediationV4(pkg: SapCp004Package): SapCp004Package {
  const base = applySapCp004ExplanationRemediationV3(pkg);
  const explanation = Object.freeze({
    ...base.explanation,
    coreConcept: polishLine(base.explanation.coreConcept),
    steps: Object.freeze(base.explanation.steps.map(polishLine)),
    finalAnswer: polishLine(base.explanation.finalAnswer),
  });
  return Object.freeze({
    ...base,
    explanation,
    generationIdentity: `${base.generationIdentity}:EXPLANATION-V4`,
  });
}
