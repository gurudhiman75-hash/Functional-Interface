import {
  relationDisplay,
  type BlrCp006CodeDefinition,
  type BlrCp006CodedStatement,
  type BlrCp006DirectRelation,
  type BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import type {
  BlrCp007PrototypeId,
  BlrCp007Scenario,
} from "./cp007-model";
import { prototypeCase } from "./cp007-prototypes";
import { positiveModulo } from "./cp007-v2-model";

const DIRECT_RELATIONS: readonly BlrCp006DirectRelation[] = [
  "FATHER",
  "MOTHER",
  "SON",
  "DAUGHTER",
  "BROTHER",
  "SISTER",
  "HUSBAND",
  "WIFE",
];

const TOKEN_PALETTES = [
  { style: "SYMBOL" as const, values: ["×", "−", "+", "÷", "@", "#", "%", "&"] },
  { style: "LETTER" as const, values: ["ka", "mi", "ru", "ta", "lo", "se", "vi", "no"] },
  {
    style: "NEUTRAL_WORD" as const,
    values: ["star", "leaf", "river", "cloud", "stone", "flame", "moon", "seed"],
  },
] as const;

function rotate<T>(values: readonly T[], amount: number): T[] {
  if (!values.length) return [];
  const offset = positiveModulo(amount, values.length);
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function completeCodeKey(seed: number): {
  keyStyle: BlrCp007Scenario["keyStyle"];
  codeKey: readonly BlrCp006CodeDefinition[];
} {
  const palette = TOKEN_PALETTES[positiveModulo(seed, TOKEN_PALETTES.length)]!;
  const tokens = rotate(palette.values, seed * 3 + 1);
  const relations = rotate(DIRECT_RELATIONS, seed * 5 + 2);
  return {
    keyStyle: palette.style,
    codeKey: relations.map((relationId, index) => ({
      token: tokens[index]!,
      relationId,
    })),
  };
}

function tokenFor(
  key: readonly BlrCp006CodeDefinition[],
  relationId: BlrCp006DirectRelation,
): string {
  const found = key.find((entry) => entry.relationId === relationId);
  if (!found) throw new Error(`Missing token for ${relationId}.`);
  return found.token;
}

function statement(
  key: readonly BlrCp006CodeDefinition[],
  leftId: string,
  relationId: BlrCp006DirectRelation,
  rightId: string,
): BlrCp006CodedStatement {
  return { leftId, token: tokenFor(key, relationId), rightId };
}

function line(value: BlrCp006CodedStatement): string {
  return `${value.leftId} ${value.token} ${value.rightId}`;
}

function selectCodeKey(
  key: readonly BlrCp006CodeDefinition[],
  statements: readonly BlrCp006CodedStatement[],
): readonly BlrCp006CodeDefinition[] {
  const used = new Set(statements.map((entry) => entry.token));
  const required = key.filter((entry) => used.has(entry.token));
  const fillers = key.filter((entry) => !used.has(entry.token));
  return [...required, ...fillers].slice(0, Math.max(4, required.length));
}

function promptFor(key: readonly BlrCp006CodeDefinition[]): string {
  return `Use the following code meanings: ${key
    .map(
      (entry) =>
        `${entry.token} means “is the ${relationDisplay(
          entry.relationId,
        ).toLocaleLowerCase("en-IN")} of”`,
    )
    .join("; ")}. Read every coded pair from left to right.`;
}

function relabel(
  value: string,
  mapping: ReadonlyMap<string, string>,
): string {
  return mapping.get(value) ?? value;
}

function buildMissingPersonScenario(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): BlrCp007Scenario {
  const ids = [
    "BLR-CP007-PROT-MISSING-PERSON-DIRECT-LEFT",
    "BLR-CP007-PROT-MISSING-PERSON-DIRECT-RIGHT",
    "BLR-CP007-PROT-MISSING-PERSON-INTERNAL",
    "BLR-CP007-PROT-MISSING-PERSON-ENDPOINT",
  ] as const;
  const prototypeOrdinal = ids.indexOf(prototypeId as (typeof ids)[number]);
  if (prototypeOrdinal < 0) {
    throw new Error(`Not a V2 missing-person prototype: ${prototypeId}.`);
  }

  const generated = completeCodeKey(seed);
  const candidateIds = ["A", "B", "C", "D"] as const;
  const rotated = rotate(candidateIds, seed + prototypeOrdinal);
  const mapping = new Map(
    candidateIds.map((candidateId, index) => [candidateId, rotated[index]!]),
  );

  let base: {
    topologyId: string;
    statements: readonly BlrCp006CodedStatement[];
    blankStatementIndex: number;
    blankSide: "LEFT" | "RIGHT";
    target: {
      subjectId: string;
      relationId: BlrCp006Relation;
      referenceId: string;
    };
    stem: string;
  };

  if (prototypeId === "BLR-CP007-PROT-MISSING-PERSON-DIRECT-LEFT") {
    base = {
      topologyId: "V2_UNCLE_FROM_MISSING_PARENT",
      statements: [
        statement(generated.codeKey, "A", "FATHER", "X"),
        statement(generated.codeKey, "P", "BROTHER", "A"),
        statement(generated.codeKey, "B", "FATHER", "Y"),
        statement(generated.codeKey, "C", "FATHER", "Z"),
        statement(generated.codeKey, "D", "FATHER", "W"),
      ],
      blankStatementIndex: 0,
      blankSide: "LEFT",
      target: { subjectId: "P", relationId: "UNCLE", referenceId: "X" },
      stem: "Which person must be X's father so that P is X's uncle?",
    };
  } else if (
    prototypeId === "BLR-CP007-PROT-MISSING-PERSON-DIRECT-RIGHT"
  ) {
    base = {
      topologyId: "V2_GRANDFATHER_FROM_MISSING_CHILD",
      statements: [
        statement(generated.codeKey, "P", "FATHER", "A"),
        statement(generated.codeKey, "A", "MOTHER", "X"),
        statement(generated.codeKey, "B", "MOTHER", "Y"),
        statement(generated.codeKey, "C", "MOTHER", "Z"),
        statement(generated.codeKey, "D", "MOTHER", "W"),
      ],
      blankStatementIndex: 0,
      blankSide: "RIGHT",
      target: { subjectId: "P", relationId: "GRANDFATHER", referenceId: "X" },
      stem: "Which person must be P's child so that P is X's grandfather?",
    };
  } else if (prototypeId === "BLR-CP007-PROT-MISSING-PERSON-INTERNAL") {
    base = {
      topologyId: "V2_GRANDFATHER_FROM_INTERNAL_PARENT",
      statements: [
        statement(generated.codeKey, "P", "FATHER", "A"),
        statement(generated.codeKey, "A", "MOTHER", "X"),
        statement(generated.codeKey, "B", "MOTHER", "Y"),
        statement(generated.codeKey, "C", "MOTHER", "Z"),
        statement(generated.codeKey, "D", "MOTHER", "W"),
      ],
      blankStatementIndex: 1,
      blankSide: "LEFT",
      target: { subjectId: "P", relationId: "GRANDFATHER", referenceId: "X" },
      stem: "Which person must be X's mother so that P is X's grandfather?",
    };
  } else {
    base = {
      topologyId: "V2_UNCLE_FROM_MISSING_ENDPOINT",
      statements: [
        statement(generated.codeKey, "P", "BROTHER", "Q"),
        statement(generated.codeKey, "Q", "FATHER", "A"),
        statement(generated.codeKey, "A", "BROTHER", "W"),
        statement(generated.codeKey, "B", "BROTHER", "X"),
        statement(generated.codeKey, "C", "BROTHER", "Y"),
        statement(generated.codeKey, "D", "BROTHER", "Z"),
      ],
      blankStatementIndex: 1,
      blankSide: "RIGHT",
      target: { subjectId: "P", relationId: "UNCLE", referenceId: "A" },
      stem: "Which person must be Q's child so that P is that person's uncle?",
    };
  }

  const statements = base.statements.map((entry) => ({
    ...entry,
    leftId: relabel(entry.leftId, mapping),
    rightId: relabel(entry.rightId, mapping),
  }));
  const target = {
    ...base.target,
    subjectId: relabel(base.target.subjectId, mapping),
    referenceId: relabel(base.target.referenceId, mapping),
  };
  const displayStatements = statements.map((entry, index) => {
    if (index !== base.blankStatementIndex) return entry;
    return {
      ...entry,
      leftId: base.blankSide === "LEFT" ? "?" : entry.leftId,
      rightId: base.blankSide === "RIGHT" ? "?" : entry.rightId,
    };
  });
  const selectedKey = selectCodeKey(generated.codeKey, statements);

  return {
    scenarioId: `${prototypeId.replace(
      "BLR-CP007-PROT-",
      "BLR-CP007-V2-SCN-",
    )}::${seed}`,
    topologyId: base.topologyId,
    keyStyle: generated.keyStyle,
    codeKey: selectedKey,
    authority: "COMPLETE_MISSING_PERSON",
    prototypeId,
    qlId: "BLR-QL-034",
    sharedPrompt: promptFor(selectedKey),
    stem: `${base.stem} Replace ? in the displayed statements.`,
    query: {
      kind: "MISSING_PERSON",
      completeStatements: statements,
      blankStatementIndex: base.blankStatementIndex,
      blankSide: base.blankSide,
      expressionLines: displayStatements.map(line),
      candidatePersonIds: candidateIds,
      target,
    },
  };
}

export function blrCp007V2Scenario(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): BlrCp007Scenario {
  if (prototypeId.includes("MISSING-PERSON")) {
    return buildMissingPersonScenario(prototypeId, seed);
  }
  return prototypeCase(prototypeId).build(seed);
}
