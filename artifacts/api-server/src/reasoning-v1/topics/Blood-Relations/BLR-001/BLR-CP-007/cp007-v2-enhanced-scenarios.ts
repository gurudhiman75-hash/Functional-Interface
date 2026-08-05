import type {
  BlrCp006CodedStatement,
  BlrCp006DirectRelation,
  BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import type {
  BlrCp007PrototypeId,
  BlrCp007Scenario,
} from "./cp007-model";
import {
  blrCp007V2KeyPrompt,
  completeBlrCp007V2Key,
} from "./cp007-v2-key";
import { positiveModulo } from "./cp007-v2-model";
import { blrCp007V2Scenario } from "./cp007-v2-scenarios";

function rotate<T>(values: readonly T[], amount: number): T[] {
  const offset = positiveModulo(amount, values.length);
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function tokenFor(
  scenario: ReturnType<typeof completeBlrCp007V2Key>,
  relationId: BlrCp006DirectRelation,
): string {
  const entry = scenario.codeKey.find((value) => value.relationId === relationId);
  if (!entry) throw new Error(`Missing V2 code token for ${relationId}.`);
  return entry.token;
}

function statement(
  key: ReturnType<typeof completeBlrCp007V2Key>,
  leftId: string,
  relationId: BlrCp006DirectRelation,
  rightId: string,
): BlrCp006CodedStatement {
  return { leftId, token: tokenFor(key, relationId), rightId };
}

function line(value: BlrCp006CodedStatement): string {
  return `${value.leftId} ${value.token} ${value.rightId}`;
}

function relabel(
  value: string,
  mapping: ReadonlyMap<string, string>,
): string {
  return mapping.get(value) ?? value;
}

function targetDerivedPairScenario(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): BlrCp007Scenario | undefined {
  const key = completeBlrCp007V2Key(seed);
  let topologyId: string;
  let completeStatements: readonly BlrCp006CodedStatement[];
  let blankStatementIndices: readonly [number, number];
  let target: {
    subjectId: string;
    relationId: BlrCp006Relation;
    referenceId: string;
  };
  let stem: string;

  if (prototypeId === "BLR-CP007-PROT-MISSING-PAIR-TWO-LINK") {
    topologyId = "V2_TARGET_DERIVED_MATERNAL_GRANDFATHER_PAIR";
    completeStatements = [
      statement(key, "B", "SISTER", "E"),
      statement(key, "A", "FATHER", "B"),
      statement(key, "B", "MOTHER", "C"),
    ];
    blankStatementIndices = [1, 2];
    target = { subjectId: "A", relationId: "GRANDFATHER", referenceId: "C" };
    stem =
      "B is a woman, as shown by the fixed first statement. Complete the two blanks so that A becomes C's maternal grandfather.";
  } else if (prototypeId === "BLR-CP007-PROT-MISSING-PAIR-THREE-LINK") {
    topologyId = "V2_TARGET_DERIVED_THREE_LINK_GRANDFATHER_PAIR";
    completeStatements = [
      statement(key, "C", "BROTHER", "E"),
      statement(key, "A", "FATHER", "B"),
      statement(key, "B", "FATHER", "C"),
      statement(key, "C", "BROTHER", "D"),
    ];
    blankStatementIndices = [1, 3];
    target = { subjectId: "A", relationId: "GRANDFATHER", referenceId: "D" };
    stem =
      "C is a man, and the fixed middle statement makes B the father of C. Complete the outer blanks so that A becomes D's grandfather.";
  } else if (prototypeId === "BLR-CP007-PROT-MISSING-PAIR-AFFINAL") {
    topologyId = "V2_TARGET_DERIVED_BROTHER_IN_LAW_PAIR";
    completeStatements = [
      statement(key, "A", "BROTHER", "X"),
      statement(key, "B", "SISTER", "Y"),
      statement(key, "C", "SISTER", "Z"),
      statement(key, "A", "HUSBAND", "B"),
      statement(key, "B", "SISTER", "C"),
    ];
    blankStatementIndices = [3, 4];
    target = {
      subjectId: "A",
      relationId: "BROTHER_IN_LAW",
      referenceId: "C",
    };
    stem =
      "The first three fixed statements establish that A is male and B and C are female. Complete the last two blanks so that A becomes C's brother-in-law.";
  } else {
    return undefined;
  }

  const expressionLines = completeStatements.map((entry, index) =>
    blankStatementIndices.includes(index)
      ? `${entry.leftId} ? ${entry.rightId}`
      : line(entry),
  );
  return {
    scenarioId: `${prototypeId.replace("BLR-CP007-PROT-", "BLR-CP007-V2-SCN-")}::${seed}`,
    topologyId,
    keyStyle: key.keyStyle,
    codeKey: key.codeKey,
    authority: "COMPLETE_ORDERED_CODE_TOKEN_PAIR",
    prototypeId,
    qlId: "BLR-QL-033",
    sharedPrompt: blrCp007V2KeyPrompt(key.codeKey),
    stem: `${stem} Choose the first and second missing tokens in that order.`,
    query: {
      kind: "MISSING_TOKEN_PAIR",
      completeStatements,
      blankStatementIndices,
      expressionLines,
      candidateTokenPairs: [],
      target,
    },
  };
}

function connectedMissingPersonScenario(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): BlrCp007Scenario | undefined {
  const ids = [
    "BLR-CP007-PROT-MISSING-PERSON-DIRECT-LEFT",
    "BLR-CP007-PROT-MISSING-PERSON-DIRECT-RIGHT",
    "BLR-CP007-PROT-MISSING-PERSON-INTERNAL",
    "BLR-CP007-PROT-MISSING-PERSON-ENDPOINT",
  ] as const;
  const ordinal = ids.indexOf(prototypeId as (typeof ids)[number]);
  if (ordinal < 0) return undefined;

  const key = completeBlrCp007V2Key(seed);
  const candidateIds = ["A", "B", "C", "D"] as const;
  const rotated = rotate(candidateIds, seed + ordinal);
  const mapping = new Map(
    candidateIds.map((candidateId, index) => [candidateId, rotated[index]!]),
  );

  let topologyId: string;
  let completeStatements: readonly BlrCp006CodedStatement[];
  let blankStatementIndex: number;
  let blankSide: "LEFT" | "RIGHT";
  let target: {
    subjectId: string;
    relationId: BlrCp006Relation;
    referenceId: string;
  };
  let stem: string;

  if (prototypeId === "BLR-CP007-PROT-MISSING-PERSON-DIRECT-LEFT") {
    topologyId = "V2_CONNECTED_UNCLE_FROM_MISSING_MOTHER";
    completeStatements = [
      statement(key, "A", "MOTHER", "X"),
      statement(key, "P", "BROTHER", "A"),
      statement(key, "B", "DAUGHTER", "P"),
      statement(key, "C", "MOTHER", "P"),
      statement(key, "D", "DAUGHTER", "P"),
    ];
    blankStatementIndex = 0;
    blankSide = "LEFT";
    target = { subjectId: "P", relationId: "UNCLE", referenceId: "X" };
    stem = "Which woman must be X's mother so that P is X's uncle?";
  } else if (prototypeId === "BLR-CP007-PROT-MISSING-PERSON-DIRECT-RIGHT") {
    topologyId = "V2_CONNECTED_GRANDFATHER_FROM_MISSING_CHILD";
    completeStatements = [
      statement(key, "P", "FATHER", "A"),
      statement(key, "A", "MOTHER", "X"),
      statement(key, "B", "SISTER", "X"),
      statement(key, "C", "HUSBAND", "X"),
      statement(key, "D", "BROTHER", "X"),
    ];
    blankStatementIndex = 0;
    blankSide = "RIGHT";
    target = { subjectId: "P", relationId: "GRANDFATHER", referenceId: "X" };
    stem = "Which person must be P's child so that P is X's grandfather?";
  } else if (prototypeId === "BLR-CP007-PROT-MISSING-PERSON-INTERNAL") {
    topologyId = "V2_CONNECTED_GRANDFATHER_FROM_INTERNAL_MOTHER";
    completeStatements = [
      statement(key, "P", "FATHER", "A"),
      statement(key, "A", "MOTHER", "X"),
      statement(key, "P", "BROTHER", "B"),
      statement(key, "C", "MOTHER", "P"),
      statement(key, "D", "SISTER", "P"),
    ];
    blankStatementIndex = 1;
    blankSide = "LEFT";
    target = { subjectId: "P", relationId: "GRANDFATHER", referenceId: "X" };
    stem = "Which woman must be X's mother so that P is X's grandfather?";
  } else {
    topologyId = "V2_CONNECTED_UNCLE_FROM_MISSING_RELATIVE";
    completeStatements = [
      statement(key, "P", "BROTHER", "A"),
      statement(key, "A", "FATHER", "X"),
      statement(key, "B", "SON", "X"),
      statement(key, "C", "HUSBAND", "X"),
      statement(key, "D", "DAUGHTER", "X"),
    ];
    blankStatementIndex = 0;
    blankSide = "RIGHT";
    target = { subjectId: "P", relationId: "UNCLE", referenceId: "X" };
    stem = "Which person must be P's sibling so that P is X's uncle?";
  }

  const statements = completeStatements.map((entry) => ({
    ...entry,
    leftId: relabel(entry.leftId, mapping),
    rightId: relabel(entry.rightId, mapping),
  }));
  const mappedTarget = {
    ...target,
    subjectId: relabel(target.subjectId, mapping),
    referenceId: relabel(target.referenceId, mapping),
  };
  const expressionLines = statements.map((entry, index) => {
    if (index !== blankStatementIndex) return line(entry);
    return line({
      ...entry,
      leftId: blankSide === "LEFT" ? "?" : entry.leftId,
      rightId: blankSide === "RIGHT" ? "?" : entry.rightId,
    });
  });
  return {
    scenarioId: `${prototypeId.replace("BLR-CP007-PROT-", "BLR-CP007-V2-SCN-")}::${seed}`,
    topologyId,
    keyStyle: key.keyStyle,
    codeKey: key.codeKey,
    authority: "COMPLETE_MISSING_PERSON",
    prototypeId,
    qlId: "BLR-QL-034",
    sharedPrompt: blrCp007V2KeyPrompt(key.codeKey),
    stem: `${stem} Replace ? in the displayed statements.`,
    query: {
      kind: "MISSING_PERSON",
      completeStatements: statements,
      blankStatementIndex,
      blankSide,
      expressionLines,
      candidatePersonIds: candidateIds,
      target: mappedTarget,
    },
  };
}

export function blrCp007V2EnhancedScenario(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): BlrCp007Scenario {
  return (
    targetDerivedPairScenario(prototypeId, seed) ??
    connectedMissingPersonScenario(prototypeId, seed) ??
    blrCp007V2Scenario(prototypeId, seed)
  );
}
