import { ANA_CP002_FACTS, type LexicalFact } from "./lexical-facts.en";
import { ANA_CP002_QLS } from "./question-language.en";

export function lexicalFactsForRule(ruleId: string): readonly LexicalFact[] {
  return ANA_CP002_FACTS.filter((fact) => fact.relation === ruleId && fact.status === "CURATED");
}

export function lexicalQlById(qlId: string) {
  const ql = ANA_CP002_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-002 QL: ${qlId}`);
  return ql;
}

export { ANA_CP002_FACTS, ANA_CP002_QLS };
