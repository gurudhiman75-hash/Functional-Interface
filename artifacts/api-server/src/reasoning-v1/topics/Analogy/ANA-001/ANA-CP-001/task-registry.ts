import { ANA_CP001_FACTS } from "./semantic-facts";
import { ANA_CP001_QLS } from "./question-language.en";
import type { SemanticFact } from "../foundation/types";
import { SemanticFactRegistry } from "../foundation/semantic";

export const ANA_CP001_REGISTRY = new SemanticFactRegistry(ANA_CP001_FACTS);

export function factsForRule(ruleId: string): readonly SemanticFact[] {
  return ANA_CP001_FACTS.filter(
    (fact) => fact.relation === ruleId && fact.status === "CURATED",
  );
}

export function qlById(qlId: string) {
  const ql = ANA_CP001_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-001 QL: ${qlId}`);
  return ql;
}

export { ANA_CP001_FACTS, ANA_CP001_QLS };
