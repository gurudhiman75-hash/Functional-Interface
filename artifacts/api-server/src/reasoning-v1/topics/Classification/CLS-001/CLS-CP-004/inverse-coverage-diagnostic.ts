import { generateClsCp004DiscoveryQuestion } from "./discovery-runtime";
import type { ClsCp004PrototypeId } from "./types";

const PROTOTYPES: readonly ClsCp004PrototypeId[] = [
  "CLS-CP004-PROT-002",
  "CLS-CP004-PROT-003",
  "CLS-CP004-PROT-004",
  "CLS-CP004-PROT-005",
  "CLS-CP004-PROT-011",
  "CLS-CP004-PROT-013",
];

const coverage: Record<string, Record<string, string[]>> = {};
for (const prototypeId of PROTOTYPES) {
  coverage[prototypeId] = {};
  for (const optionCount of [4, 5] as const) {
    const values = new Set<string>();
    for (let seed = 0; seed < 24; seed += 1) {
      values.add(generateClsCp004DiscoveryQuestion(prototypeId, seed, optionCount).intendedRuleValue);
    }
    coverage[prototypeId]![String(optionCount)] = [...values].sort();
  }
}

console.log("CLS-CP-004 inverse-value coverage diagnostic.", coverage);