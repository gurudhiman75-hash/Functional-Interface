import { ANA_CP003_QLS } from "./question-language.en";
import { ANA_CP003_RULES, numericRuleById } from "./rule-definitions";

export { ANA_CP003_QLS, ANA_CP003_RULES, numericRuleById };

export function anaCp003QlById(qlId: string) {
  const ql = ANA_CP003_QLS.find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA-CP-003 QL: ${qlId}`);
  return ql;
}
