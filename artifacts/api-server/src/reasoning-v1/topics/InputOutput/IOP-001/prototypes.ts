import type { IopMachineRule, IopPhaseRule, IopPrototypeAuthority } from "./types.ts";

function phase(
  id: string,
  eligibleKind: IopPhaseRule["eligibleKind"],
  direction: IopPhaseRule["direction"],
  placement: IopPhaseRule["placement"],
): IopPhaseRule {
  return {
    id,
    eligibleKind,
    selectionKey: eligibleKind === "WORD" ? "ALPHABETICAL" : "NUMERIC_VALUE",
    direction,
    placement,
  };
}

function rule(
  id: string,
  checkpointId: IopMachineRule["checkpointId"],
  schedule: IopMachineRule["schedule"],
  phases: readonly IopPhaseRule[],
): IopMachineRule {
  return { id, checkpointId, schedule, phases };
}

const SOURCE = "DISCOVERY_HYPOTHESIS_PENDING_SOURCE_SATURATION" as const;

export const IOP_CP001_PROTOTYPES: readonly IopPrototypeAuthority[] = [
  {
    prototypeId: "IOP-CP001-PROT-001",
    checkpointId: "IOP-CP-001",
    title: "Alphabetical ascending, one word fixed at the left per step",
    rule: rule("IOP-RULE-CP001-001", "IOP-CP-001", "SINGLE_PHASE", [phase("P1", "WORD", "ASC", "LEFT_FIXED")]),
    wordCount: 7,
    numberCount: 0,
    sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP001-PROT-002",
    checkpointId: "IOP-CP-001",
    title: "Alphabetical descending, one word fixed at the right per step",
    rule: rule("IOP-RULE-CP001-002", "IOP-CP-001", "SINGLE_PHASE", [phase("P1", "WORD", "DESC", "RIGHT_FIXED")]),
    wordCount: 7,
    numberCount: 0,
    sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP001-PROT-003",
    checkpointId: "IOP-CP-001",
    title: "Numeric ascending, one number fixed at the left per step",
    rule: rule("IOP-RULE-CP001-003", "IOP-CP-001", "SINGLE_PHASE", [phase("P1", "NUMBER", "ASC", "LEFT_FIXED")]),
    wordCount: 0,
    numberCount: 7,
    sourceStatus: SOURCE,
  },
] as const;

export const IOP_CP002_PROTOTYPES: readonly IopPrototypeAuthority[] = [
  {
    prototypeId: "IOP-CP002-PROT-001",
    checkpointId: "IOP-CP-002",
    title: "Complete ascending numbers at the left, then alphabetical words at the left",
    rule: rule("IOP-RULE-CP002-001", "IOP-CP-002", "BLOCKED_PHASES", [
      phase("P1", "NUMBER", "ASC", "LEFT_FIXED"),
      phase("P2", "WORD", "ASC", "LEFT_FIXED"),
    ]),
    wordCount: 4,
    numberCount: 4,
    sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP002-PROT-002",
    checkpointId: "IOP-CP-002",
    title: "Complete descending words at the right, then ascending numbers at the left",
    rule: rule("IOP-RULE-CP002-002", "IOP-CP-002", "BLOCKED_PHASES", [
      phase("P1", "WORD", "DESC", "RIGHT_FIXED"),
      phase("P2", "NUMBER", "ASC", "LEFT_FIXED"),
    ]),
    wordCount: 4,
    numberCount: 4,
    sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP002-PROT-003",
    checkpointId: "IOP-CP-002",
    title: "Complete descending numbers at the right, then ascending words at the left",
    rule: rule("IOP-RULE-CP002-003", "IOP-CP-002", "BLOCKED_PHASES", [
      phase("P1", "NUMBER", "DESC", "RIGHT_FIXED"),
      phase("P2", "WORD", "ASC", "LEFT_FIXED"),
    ]),
    wordCount: 4,
    numberCount: 4,
    sourceStatus: SOURCE,
  },
] as const;

export const IOP_CP003_PROTOTYPES: readonly IopPrototypeAuthority[] = [
  {
    prototypeId: "IOP-CP003-PROT-001",
    checkpointId: "IOP-CP-003",
    title: "Smallest number to left and largest number to right in the same step",
    rule: rule("IOP-RULE-CP003-001", "IOP-CP-003", "SIMULTANEOUS_PHASES", [
      phase("P1", "NUMBER", "ASC", "LEFT_FIXED"),
      phase("P2", "NUMBER", "DESC", "RIGHT_FIXED"),
    ]),
    wordCount: 0,
    numberCount: 8,
    sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP003-PROT-002",
    checkpointId: "IOP-CP-003",
    title: "Smallest number to left and alphabetically last word to right in the same step",
    rule: rule("IOP-RULE-CP003-002", "IOP-CP-003", "SIMULTANEOUS_PHASES", [
      phase("P1", "NUMBER", "ASC", "LEFT_FIXED"),
      phase("P2", "WORD", "DESC", "RIGHT_FIXED"),
    ]),
    wordCount: 4,
    numberCount: 4,
    sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP003-PROT-003",
    checkpointId: "IOP-CP-003",
    title: "Alphabetically first word to left and largest number to right in the same step",
    rule: rule("IOP-RULE-CP003-003", "IOP-CP-003", "SIMULTANEOUS_PHASES", [
      phase("P1", "WORD", "ASC", "LEFT_FIXED"),
      phase("P2", "NUMBER", "DESC", "RIGHT_FIXED"),
    ]),
    wordCount: 4,
    numberCount: 4,
    sourceStatus: SOURCE,
  },
] as const;

export const IOP_CP004_PROTOTYPES: readonly IopPrototypeAuthority[] = [
  {
    prototypeId: "IOP-CP004-PROT-001",
    checkpointId: "IOP-CP-004",
    title: "Alternate smallest-number left and largest-number right placement",
    rule: rule("IOP-RULE-CP004-001", "IOP-CP-004", "ALTERNATING_PHASES", [
      phase("P1", "NUMBER", "ASC", "LEFT_FIXED"),
      phase("P2", "NUMBER", "DESC", "RIGHT_FIXED"),
    ]),
    wordCount: 0,
    numberCount: 8,
    sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP004-PROT-002",
    checkpointId: "IOP-CP-004",
    title: "Alternate smallest number to left and alphabetically last word to right",
    rule: rule("IOP-RULE-CP004-002", "IOP-CP-004", "ALTERNATING_PHASES", [
      phase("P1", "NUMBER", "ASC", "LEFT_FIXED"),
      phase("P2", "WORD", "DESC", "RIGHT_FIXED"),
    ]),
    wordCount: 4,
    numberCount: 4,
    sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP004-PROT-003",
    checkpointId: "IOP-CP-004",
    title: "Alternate alphabetically first word to left and largest number to right",
    rule: rule("IOP-RULE-CP004-003", "IOP-CP-004", "ALTERNATING_PHASES", [
      phase("P1", "WORD", "ASC", "LEFT_FIXED"),
      phase("P2", "NUMBER", "DESC", "RIGHT_FIXED"),
    ]),
    wordCount: 4,
    numberCount: 4,
    sourceStatus: SOURCE,
  },
] as const;

export const IOP_FOUNDATION_PROTOTYPES = [
  ...IOP_CP001_PROTOTYPES,
  ...IOP_CP002_PROTOTYPES,
  ...IOP_CP003_PROTOTYPES,
  ...IOP_CP004_PROTOTYPES,
] as const;
