export type Sea002Cp007Facing = "N" | "S";
export type Sea002Cp007Row = "TOP" | "BOTTOM";

export type Sea002Cp007Seat = Readonly<{
  row: Sea002Cp007Row;
  position: number;
}>;

export type Sea002Cp007Participant = Readonly<{
  id: string;
  seat: Sea002Cp007Seat;
  facing: Sea002Cp007Facing;
}>;

export type Sea002Cp007PrototypeId =
  | "SEA-CP007-PROT-001"
  | "SEA-CP007-PROT-002"
  | "SEA-CP007-PROT-003";

export type Sea002Cp007Question = Readonly<{
  prototypeId: Sea002Cp007PrototypeId;
  seed: string;
  width: number;
  participants: readonly Sea002Cp007Participant[];
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: string;
  mathematicalFingerprint: string;
  lifecycle: Readonly<{
    permanentQlAllocated: false;
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    questionBankWritable: false;
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;

export const SEA002_CP007_DISCOVERY_LIFECYCLE = Object.freeze({
  permanentQlAllocated: false as const,
  questionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});
