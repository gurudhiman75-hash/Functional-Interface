import type { BlrCp001PrototypeId } from "../foundation/types";

export interface BlrCp001PrototypeContract {
  prototypeId: BlrCp001PrototypeId;
  taskKind: "DIRECT_RELATION" | "REVERSE_RELATION" | "COMPOSED_RELATION";
  minimumPathLength: 1 | 2 | 3;
  maximumPathLength: 1 | 2 | 3;
  status: "PROTOTYPE";
  permanentQlId: null;
}

export const BLR_CP001_PROTOTYPE_CONTRACTS: readonly BlrCp001PrototypeContract[] = [
  {
    prototypeId: "BLR-CP001-PROT-DIRECT-FORWARD",
    taskKind: "DIRECT_RELATION",
    minimumPathLength: 1,
    maximumPathLength: 1,
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP001-PROT-DIRECT-REVERSE",
    taskKind: "REVERSE_RELATION",
    minimumPathLength: 1,
    maximumPathLength: 1,
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP001-PROT-COMPOSED-TWO-EDGE",
    taskKind: "COMPOSED_RELATION",
    minimumPathLength: 2,
    maximumPathLength: 2,
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP001-PROT-COMPOSED-THREE-EDGE",
    taskKind: "COMPOSED_RELATION",
    minimumPathLength: 3,
    maximumPathLength: 3,
    status: "PROTOTYPE",
    permanentQlId: null,
  },
] as const;

export function getBlrCp001PrototypeContract(
  prototypeId: BlrCp001PrototypeId,
): BlrCp001PrototypeContract {
  const contract = BLR_CP001_PROTOTYPE_CONTRACTS.find((entry) => entry.prototypeId === prototypeId);
  if (!contract) throw new Error(`Unknown BLR-CP-001 prototype: ${prototypeId}.`);
  return contract;
}
