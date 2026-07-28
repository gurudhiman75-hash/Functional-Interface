import type { Cp008PrototypeContract, Cp008PrototypeId } from "./cp008-prototype-types";

export const CP008_PROTOTYPE_CONTRACTS: readonly Cp008PrototypeContract[] = [
  {
    prototypeId: "COD-CP008-PROT-DIRECT-RENAMED-LABEL",
    taskKind: "DIRECT_LABEL_QUERY",
    ruleId: "DIRECT_RENAMED_LABEL",
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP008-PROT-SEMANTIC-REFERENT-RENAMING",
    taskKind: "SEMANTIC_REFERENT_QUERY",
    ruleId: "SEMANTIC_REFERENT_THEN_RENAME",
    status: "PROTOTYPE",
  },
] as const;

export function getCp008PrototypeContract(prototypeId: Cp008PrototypeId): Cp008PrototypeContract {
  const contract = CP008_PROTOTYPE_CONTRACTS.find((entry) => entry.prototypeId === prototypeId);
  if (!contract) throw new Error(`Unknown CP-008 prototype '${prototypeId}'`);
  return contract;
}
