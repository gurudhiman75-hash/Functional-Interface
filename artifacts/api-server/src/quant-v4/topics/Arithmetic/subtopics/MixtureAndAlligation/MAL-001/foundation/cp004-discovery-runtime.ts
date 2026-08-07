import { equalsRational } from "./rational";
import {
  componentAmountQuestion,
  concentrationQuestion,
  evaporationQuestion,
  pureAdditionQuestion,
  solventAdditionQuestion,
} from "./cp004-discovery-concentration";
import { moistureQuestion } from "./cp004-discovery-moisture";
import { solveMalCp004 } from "./cp004-solver";
import type {
  MalCp004DiscoveryPrototypeId,
  MalCp004DiscoveryQuestion,
} from "./cp004-types";

export function generateMalCp004DiscoveryQuestion(
  prototypeId: MalCp004DiscoveryPrototypeId,
  seed = `mal-cp004-discovery:${prototypeId}:default`,
): MalCp004DiscoveryQuestion {
  switch (prototypeId) {
    case "MAL-CP004-PROT-COMPONENT-AMOUNT-FROM-CONCENTRATION":
      return componentAmountQuestion(seed);
    case "MAL-CP004-PROT-CONCENTRATION-FROM-COMPONENT-AMOUNT":
      return concentrationQuestion(seed);
    case "MAL-CP004-PROT-SOLVENT-ADDITION-FOR-TARGET":
      return solventAdditionQuestion(seed);
    case "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET":
      return pureAdditionQuestion(seed);
    case "MAL-CP004-PROT-SOLVENT-EVAPORATION-FOR-TARGET":
      return evaporationQuestion(seed);
    case "MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT":
      return moistureQuestion(seed, false);
    case "MAL-CP004-PROT-INITIAL-MASS-FROM-MOISTURE-SHIFT":
      return moistureQuestion(seed, true);
  }
}

export function malCp004DiscoveryStable(
  question: MalCp004DiscoveryQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}

export function verifyMalCp004DiscoveryQuestion(
  question: MalCp004DiscoveryQuestion,
): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const recomputed = solveMalCp004(question.request);
  if (
    recomputed.kind !== question.solution.kind ||
    !equalsRational(recomputed.value, question.solution.value)
  ) {
    errors.push("Independent solver result does not match the packaged solution.");
  }
  return { ok: errors.length === 0, errors };
}
