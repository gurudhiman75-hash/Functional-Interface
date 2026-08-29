import type {
  IopAdvancedOperation,
  IopAdvancedProgram,
  IopAdvancedPrototypeAuthority,
  IopAdvancedTokenKind,
} from "./advanced-types.ts";

const SOURCE = "DISCOVERY_HYPOTHESIS_PENDING_SOURCE_SATURATION" as const;

function program(
  id: string,
  checkpointId: IopAdvancedProgram["checkpointId"],
  layout: IopAdvancedProgram["layout"],
  operations: readonly IopAdvancedOperation[],
): IopAdvancedProgram {
  return { id, checkpointId, layout, operations };
}

function move(
  id: string,
  eligibleKind: IopAdvancedTokenKind,
  selectionKey: Extract<IopAdvancedOperation, { kind: "ITERATIVE_MOVE" }>["selectionKey"],
  direction: "ASC" | "DESC",
  placement: "LEFT_FIXED" | "RIGHT_FIXED",
): IopAdvancedOperation {
  return { id, kind: "ITERATIVE_MOVE", eligibleKind, selectionKey, direction, placement };
}

function transform(
  id: string,
  eligibleKind: IopAdvancedTokenKind,
  value: Extract<IopAdvancedOperation, { kind: "TRANSFORM_ALL" }>["transform"],
): IopAdvancedOperation {
  return { id, kind: "TRANSFORM_ALL", eligibleKind, transform: value };
}

function sort(
  id: string,
  eligibleKind: IopAdvancedTokenKind,
  selectionKey: Extract<IopAdvancedOperation, { kind: "SORT_ALL" }>["selectionKey"],
  direction: "ASC" | "DESC",
): IopAdvancedOperation {
  return { id, kind: "SORT_ALL", eligibleKind, selectionKey, direction };
}

const pairRewrite = (id: string): IopAdvancedOperation => ({ id, kind: "PAIR_REWRITE", rewrite: "SUM_AND_ABS_DIFF" });
const swapPairs = (id: string): IopAdvancedOperation => ({ id, kind: "SWAP_ADJACENT_PAIRS" });
const reverseOrder = (id: string): IopAdvancedOperation => ({ id, kind: "REVERSE_ORDER" });

export const IOP_CP005_PROTOTYPES: readonly IopAdvancedPrototypeAuthority[] = [
  {
    prototypeId: "IOP-CP005-PROT-001",
    checkpointId: "IOP-CP-005",
    title: "Arrange words by increasing length, one at a time from the left",
    program: program("IOP-ADV-RULE-CP005-001", "IOP-CP-005", "LINEAR", [move("P1", "WORD", "WORD_LENGTH", "ASC", "LEFT_FIXED")]),
    tokenKind: "WORD", tokenCount: 6, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP005-PROT-002",
    checkpointId: "IOP-CP-005",
    title: "Arrange numbers by increasing digit sum, one at a time from the left",
    program: program("IOP-ADV-RULE-CP005-002", "IOP-CP-005", "LINEAR", [move("P1", "NUMBER", "DIGIT_SUM", "ASC", "LEFT_FIXED")]),
    tokenKind: "NUMBER", tokenCount: 7, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP005-PROT-003",
    checkpointId: "IOP-CP-005",
    title: "Arrange words by decreasing length, one at a time from the right",
    program: program("IOP-ADV-RULE-CP005-003", "IOP-CP-005", "LINEAR", [move("P1", "WORD", "WORD_LENGTH", "DESC", "RIGHT_FIXED")]),
    tokenKind: "WORD", tokenCount: 6, sourceStatus: SOURCE,
  },
] as const;

export const IOP_CP006_PROTOTYPES: readonly IopAdvancedPrototypeAuthority[] = [
  {
    prototypeId: "IOP-CP006-PROT-001",
    checkpointId: "IOP-CP-006",
    title: "Reverse each number, arrange ascending, add digit sum, then arrange descending",
    program: program("IOP-ADV-RULE-CP006-001", "IOP-CP-006", "LINEAR", [
      transform("P1", "NUMBER", "REVERSE_DIGITS"), sort("P2", "NUMBER", "NUMERIC_VALUE", "ASC"),
      transform("P3", "NUMBER", "ADD_DIGIT_SUM"), sort("P4", "NUMBER", "NUMERIC_VALUE", "DESC"),
    ]),
    tokenKind: "NUMBER", tokenCount: 6, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP006-PROT-002",
    checkpointId: "IOP-CP-006",
    title: "Add digit sum, arrange by digit sum, reverse digits, then arrange ascending",
    program: program("IOP-ADV-RULE-CP006-002", "IOP-CP-006", "LINEAR", [
      transform("P1", "NUMBER", "ADD_DIGIT_SUM"), sort("P2", "NUMBER", "DIGIT_SUM", "ASC"),
      transform("P3", "NUMBER", "REVERSE_DIGITS"), sort("P4", "NUMBER", "NUMERIC_VALUE", "ASC"),
    ]),
    tokenKind: "NUMBER", tokenCount: 6, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP006-PROT-003",
    checkpointId: "IOP-CP-006",
    title: "Reverse digits, add digit sum, arrange by last digit, then reverse the row",
    program: program("IOP-ADV-RULE-CP006-003", "IOP-CP-006", "LINEAR", [
      transform("P1", "NUMBER", "REVERSE_DIGITS"), transform("P2", "NUMBER", "ADD_DIGIT_SUM"),
      sort("P3", "NUMBER", "LAST_DIGIT", "ASC"), reverseOrder("P4"),
    ]),
    tokenKind: "NUMBER", tokenCount: 6, sourceStatus: SOURCE,
  },
] as const;

export const IOP_CP007_PROTOTYPES: readonly IopAdvancedPrototypeAuthority[] = [
  {
    prototypeId: "IOP-CP007-PROT-001",
    checkpointId: "IOP-CP-007",
    title: "Reverse each word, arrange alphabetically, swap end letters, then arrange descending",
    program: program("IOP-ADV-RULE-CP007-001", "IOP-CP-007", "LINEAR", [
      transform("P1", "WORD", "REVERSE_WORD"), sort("P2", "WORD", "ALPHABETICAL", "ASC"),
      transform("P3", "WORD", "SWAP_WORD_ENDS"), sort("P4", "WORD", "ALPHABETICAL", "DESC"),
    ]),
    tokenKind: "WORD", tokenCount: 6, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP007-PROT-002",
    checkpointId: "IOP-CP-007",
    title: "Rotate each word left, arrange by word length, reverse each word, then reverse the row",
    program: program("IOP-ADV-RULE-CP007-002", "IOP-CP-007", "LINEAR", [
      transform("P1", "WORD", "ROTATE_WORD_LEFT"), sort("P2", "WORD", "WORD_LENGTH", "ASC"),
      transform("P3", "WORD", "REVERSE_WORD"), reverseOrder("P4"),
    ]),
    tokenKind: "WORD", tokenCount: 6, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP007-PROT-003",
    checkpointId: "IOP-CP-007",
    title: "Reverse alphanumeric groups, arrange alphabetically, rotate left, then arrange descending",
    program: program("IOP-ADV-RULE-CP007-003", "IOP-CP-007", "LINEAR", [
      transform("P1", "ALPHANUMERIC", "REVERSE_ALPHANUMERIC"), sort("P2", "ALPHANUMERIC", "ALPHABETICAL", "ASC"),
      transform("P3", "ALPHANUMERIC", "ROTATE_ALPHANUMERIC_LEFT"), sort("P4", "ALPHANUMERIC", "ALPHABETICAL", "DESC"),
    ]),
    tokenKind: "ALPHANUMERIC", tokenCount: 6, sourceStatus: SOURCE,
  },
] as const;

export const IOP_CP008_PROTOTYPES: readonly IopAdvancedPrototypeAuthority[] = [
  {
    prototypeId: "IOP-CP008-PROT-001",
    checkpointId: "IOP-CP-008",
    title: "Numeric multi-stage transform followed by iterative final placement",
    program: program("IOP-ADV-RULE-CP008-001", "IOP-CP-008", "LINEAR", [
      transform("P1", "NUMBER", "REVERSE_DIGITS"), sort("P2", "NUMBER", "DIGIT_SUM", "ASC"),
      transform("P3", "NUMBER", "ADD_DIGIT_SUM"), move("P4", "NUMBER", "NUMERIC_VALUE", "ASC", "LEFT_FIXED"),
    ]),
    tokenKind: "NUMBER", tokenCount: 7, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP008-PROT-002",
    checkpointId: "IOP-CP-008",
    title: "Word multi-stage transform followed by length-based iterative placement",
    program: program("IOP-ADV-RULE-CP008-002", "IOP-CP-008", "LINEAR", [
      transform("P1", "WORD", "ROTATE_WORD_LEFT"), sort("P2", "WORD", "ALPHABETICAL", "DESC"),
      transform("P3", "WORD", "SWAP_WORD_ENDS"), move("P4", "WORD", "WORD_LENGTH", "ASC", "RIGHT_FIXED"),
    ]),
    tokenKind: "WORD", tokenCount: 6, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP008-PROT-003",
    checkpointId: "IOP-CP-008",
    title: "Alphanumeric transform-sort-transform-reversal pipeline",
    program: program("IOP-ADV-RULE-CP008-003", "IOP-CP-008", "LINEAR", [
      transform("P1", "ALPHANUMERIC", "REVERSE_ALPHANUMERIC"), sort("P2", "ALPHANUMERIC", "ALPHABETICAL", "ASC"),
      transform("P3", "ALPHANUMERIC", "ROTATE_ALPHANUMERIC_LEFT"), reverseOrder("P4"),
    ]),
    tokenKind: "ALPHANUMERIC", tokenCount: 7, sourceStatus: SOURCE,
  },
] as const;

export const IOP_CP009_PROTOTYPES: readonly IopAdvancedPrototypeAuthority[] = [
  {
    prototypeId: "IOP-CP009-PROT-001",
    checkpointId: "IOP-CP-009",
    title: "Box-row pair swap, sum/difference rewrite, ascending arrangement and reversal",
    program: program("IOP-ADV-RULE-CP009-001", "IOP-CP-009", "BOX_ROW", [
      swapPairs("P1"), pairRewrite("P2"), sort("P3", "NUMBER", "NUMERIC_VALUE", "ASC"), reverseOrder("P4"),
    ]),
    tokenKind: "NUMBER", tokenCount: 6, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP009-PROT-002",
    checkpointId: "IOP-CP-009",
    title: "Two-row table sum/difference rewrite, pair swap, last-digit arrangement and reversal",
    program: program("IOP-ADV-RULE-CP009-002", "IOP-CP-009", "TABLE_2XN", [
      pairRewrite("P1"), swapPairs("P2"), sort("P3", "NUMBER", "LAST_DIGIT", "ASC"), reverseOrder("P4"),
    ]),
    tokenKind: "NUMBER", tokenCount: 6, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP009-PROT-003",
    checkpointId: "IOP-CP-009",
    title: "Box-row reversal, pair swap, sum/difference rewrite and digit-sum arrangement",
    program: program("IOP-ADV-RULE-CP009-003", "IOP-CP-009", "BOX_ROW", [
      reverseOrder("P1"), swapPairs("P2"), pairRewrite("P3"), sort("P4", "NUMBER", "DIGIT_SUM", "ASC"),
    ]),
    tokenKind: "NUMBER", tokenCount: 6, sourceStatus: SOURCE,
  },
] as const;

export const IOP_CP010_PROTOTYPES: readonly IopAdvancedPrototypeAuthority[] = [
  {
    prototypeId: "IOP-CP010-PROT-001",
    checkpointId: "IOP-CP-010",
    title: "Reverse and missing-state synthesis over a numeric multi-stage machine",
    program: program("IOP-ADV-RULE-CP010-001", "IOP-CP-010", "LINEAR", [
      transform("P1", "NUMBER", "REVERSE_DIGITS"), sort("P2", "NUMBER", "NUMERIC_VALUE", "ASC"),
      transform("P3", "NUMBER", "ADD_DIGIT_SUM"), reverseOrder("P4"), sort("P5", "NUMBER", "DIGIT_SUM", "ASC"),
    ]),
    tokenKind: "NUMBER", tokenCount: 6, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP010-PROT-002",
    checkpointId: "IOP-CP-010",
    title: "Reverse and missing-state synthesis over a word transformation machine",
    program: program("IOP-ADV-RULE-CP010-002", "IOP-CP-010", "LINEAR", [
      transform("P1", "WORD", "ROTATE_WORD_LEFT"), sort("P2", "WORD", "ALPHABETICAL", "ASC"),
      transform("P3", "WORD", "SWAP_WORD_ENDS"), reverseOrder("P4"), sort("P5", "WORD", "WORD_LENGTH", "ASC"),
    ]),
    tokenKind: "WORD", tokenCount: 6, sourceStatus: SOURCE,
  },
  {
    prototypeId: "IOP-CP010-PROT-003",
    checkpointId: "IOP-CP-010",
    title: "Reverse and missing-state synthesis over a box machine",
    program: program("IOP-ADV-RULE-CP010-003", "IOP-CP-010", "BOX_ROW", [
      swapPairs("P1"), pairRewrite("P2"), reverseOrder("P3"), sort("P4", "NUMBER", "LAST_DIGIT", "ASC"), swapPairs("P5"),
    ]),
    tokenKind: "NUMBER", tokenCount: 6, sourceStatus: SOURCE,
  },
] as const;

export const IOP_ADVANCED_PROTOTYPES = [
  ...IOP_CP005_PROTOTYPES,
  ...IOP_CP006_PROTOTYPES,
  ...IOP_CP007_PROTOTYPES,
  ...IOP_CP008_PROTOTYPES,
  ...IOP_CP009_PROTOTYPES,
  ...IOP_CP010_PROTOTYPES,
] as const;
