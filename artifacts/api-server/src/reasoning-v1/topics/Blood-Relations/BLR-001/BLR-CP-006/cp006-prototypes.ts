import {
  relationDisplay,
  rotate,
  type BlrCp006Authority,
  type BlrCp006CodeDefinition,
  type BlrCp006CodedStatement,
  type BlrCp006DirectRelation,
  type BlrCp006PrototypeId,
  type BlrCp006QlId,
  type BlrCp006Scenario,
} from "./cp006-model";

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
  {
    style: "SYMBOL" as const,
    values: ["×", "−", "+", "÷", "@", "#", "%", "&"],
  },
  {
    style: "LETTER" as const,
    values: ["ka", "mi", "ru", "ta", "lo", "se", "vi", "no"],
  },
  {
    style: "NEUTRAL_WORD" as const,
    values: ["star", "leaf", "river", "cloud", "stone", "flame", "moon", "seed"],
  },
] as const;

function codeKey(seed: number): {
  keyStyle: BlrCp006Scenario["keyStyle"];
  codeKey: readonly BlrCp006CodeDefinition[];
} {
  const palette = TOKEN_PALETTES[((seed % TOKEN_PALETTES.length) + TOKEN_PALETTES.length) % TOKEN_PALETTES.length]!;
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
  if (!found) throw new Error(`Missing coded token for ${relationId}.`);
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

function expressionLine(value: BlrCp006CodedStatement): string {
  return `${value.leftId} ${value.token} ${value.rightId}`;
}

function chainLine(values: readonly BlrCp006CodedStatement[]): string {
  if (!values.length) return "";
  let result = values[0]!.leftId;
  for (const value of values) result += ` ${value.token} ${value.rightId}`;
  return result;
}

export interface PrototypeSpec {
  prototypeId: BlrCp006PrototypeId;
  authority: BlrCp006Authority;
  qlId: BlrCp006QlId;
  build: (seed: number) => BlrCp006Scenario;
}

function scenario(input: Omit<BlrCp006Scenario, "keyStyle" | "codeKey"> & {
  keyStyle: BlrCp006Scenario["keyStyle"];
  codeKey: readonly BlrCp006CodeDefinition[];
}): BlrCp006Scenario {
  const usedTokens = new Set(input.statements.map((entry) => entry.token));
  const used = input.codeKey.filter((entry) => usedTokens.has(entry.token));
  const unused = input.codeKey.filter((entry) => !usedTokens.has(entry.token));
  const minimumKeySize = Math.max(4, used.length);
  return {
    ...input,
    codeKey: [...used, ...unused].slice(0, minimumKeySize),
  };
}

function relationPrototype(
  prototypeId: BlrCp006PrototypeId,
  topologyId: string,
  build: (
    seed: number,
    key: readonly BlrCp006CodeDefinition[],
  ) => {
    statements: readonly BlrCp006CodedStatement[];
    expressionLines?: readonly string[];
    subjectId: string;
    referenceId: string;
    stem?: string;
  },
  authority: BlrCp006Authority = "RESOLVE_CODED_RELATION",
  qlId: BlrCp006QlId = "BLR-QL-026",
): PrototypeSpec {
  return {
    prototypeId,
    authority,
    qlId,
    build: (seed) => {
      const coded = codeKey(seed);
      const built = build(seed, coded.codeKey);
      return scenario({
        scenarioId: `${prototypeId.replace("BLR-CP006-PROT-", "BLR-CP006-SCN-")}::${seed}`,
        topologyId,
        ...coded,
        statements: built.statements,
        expressionLines: built.expressionLines ?? [chainLine(built.statements)],
        query: {
          kind: "RELATION",
          subjectId: built.subjectId,
          referenceId: built.referenceId,
        },
        authority,
        prototypeId,
        qlId,
        stem: built.stem ?? `How is ${built.subjectId} related to ${built.referenceId}?`,
      });
    },
  };
}

export const BLR_CP006_PROTOTYPES: readonly PrototypeSpec[] = [
  relationPrototype(
    "BLR-CP006-PROT-DIRECT-FORWARD",
    "ONE_CODED_EDGE_FORWARD",
    (seed, key) => {
      const relations = ["FATHER", "MOTHER", "BROTHER", "SISTER", "HUSBAND", "WIFE"] as const;
      const relationId = relations[seed % relations.length]!;
      const statements = [statement(key, "A", relationId, "B")];
      return { statements, subjectId: "A", referenceId: "B" };
    },
  ),
  relationPrototype(
    "BLR-CP006-PROT-DIRECT-REVERSE",
    "ONE_CODED_EDGE_REVERSE",
    (seed, key) => {
      const relations = ["FATHER", "MOTHER", "SON", "DAUGHTER", "HUSBAND", "WIFE"] as const;
      const relationId = relations[seed % relations.length]!;
      const statements = [statement(key, "A", relationId, "B")];
      return { statements, subjectId: "B", referenceId: "A" };
    },
  ),
  relationPrototype(
    "BLR-CP006-PROT-TWO-LINK-FORWARD",
    "TWO_CODED_EDGES_FORWARD",
    (seed, key) => {
      const statements = seed % 2 === 0
        ? [
            statement(key, "A", "FATHER", "B"),
            statement(key, "B", "MOTHER", "C"),
          ]
        : [
            statement(key, "A", "MOTHER", "B"),
            statement(key, "B", "FATHER", "C"),
          ];
      return { statements, subjectId: "A", referenceId: "C" };
    },
  ),
  relationPrototype(
    "BLR-CP006-PROT-TWO-LINK-REVERSE",
    "TWO_CODED_EDGES_REVERSE",
    (_seed, key) => {
      const statements = [
        statement(key, "A", "FATHER", "B"),
        statement(key, "B", "MOTHER", "C"),
      ];
      return { statements, subjectId: "C", referenceId: "A" };
    },
  ),
  relationPrototype(
    "BLR-CP006-PROT-THREE-LINK-FORWARD",
    "THREE_CODED_EDGES_MIXED_FORWARD",
    (_seed, key) => {
      const statements = [
        statement(key, "A", "BROTHER", "B"),
        statement(key, "B", "FATHER", "C"),
        statement(key, "C", "SISTER", "D"),
      ];
      return { statements, subjectId: "A", referenceId: "D" };
    },
  ),
  relationPrototype(
    "BLR-CP006-PROT-THREE-LINK-REVERSE",
    "THREE_CODED_EDGES_MIXED_REVERSE",
    (_seed, key) => {
      const statements = [
        statement(key, "A", "BROTHER", "B"),
        statement(key, "B", "FATHER", "C"),
        statement(key, "C", "SISTER", "D"),
      ];
      return { statements, subjectId: "D", referenceId: "A" };
    },
  ),
  relationPrototype(
    "BLR-CP006-PROT-INTERNAL-TO-ENDPOINT",
    "INTERNAL_NODE_TO_ENDPOINT",
    (_seed, key) => {
      const statements = [
        statement(key, "A", "FATHER", "B"),
        statement(key, "B", "BROTHER", "C"),
        statement(key, "C", "MOTHER", "D"),
      ];
      return {
        statements,
        subjectId: "B",
        referenceId: "D",
        stem: "How is B related to D?",
      };
    },
  ),
  relationPrototype(
    "BLR-CP006-PROT-ENDPOINT-TO-INTERNAL",
    "ENDPOINT_TO_INTERNAL_NODE",
    (_seed, key) => {
      const statements = [
        statement(key, "A", "FATHER", "B"),
        statement(key, "B", "BROTHER", "C"),
        statement(key, "D", "DAUGHTER", "C"),
      ];
      return {
        statements,
        expressionLines: [chainLine(statements.slice(0, 2)), expressionLine(statements[2]!)],
        subjectId: "D",
        referenceId: "B",
        stem: "How is D related to B?",
      };
    },
  ),
  relationPrototype(
    "BLR-CP006-PROT-MIXED-AFFINAL-ENDPOINT",
    "MIXED_BLOOD_AFFINAL_ENDPOINT",
    (_seed, key) => {
      const statements = [
        statement(key, "A", "BROTHER", "B"),
        statement(key, "B", "HUSBAND", "C"),
      ];
      return { statements, subjectId: "A", referenceId: "C" };
    },
  ),
  {
    prototypeId: "BLR-CP006-PROT-IDENTIFY-DIRECT",
    authority: "IDENTIFY_PERSON_FROM_CODED_GRAPH",
    qlId: "BLR-QL-027",
    build: (seed) => {
      const coded = codeKey(seed);
      const statements = [
        statement(coded.codeKey, "A", "FATHER", "B"),
        statement(coded.codeKey, "C", "BROTHER", "A"),
        statement(coded.codeKey, "D", "WIFE", "A"),
      ];
      return scenario({
        scenarioId: `BLR-CP006-SCN-IDENTIFY-DIRECT::${seed}`,
        topologyId: "CODED_DIRECT_PERSON_IDENTIFICATION",
        ...coded,
        statements,
        expressionLines: statements.map(expressionLine),
        query: {
          kind: "IDENTIFY_PERSON",
          referenceId: "B",
          relationId: "FATHER",
          candidateIds: ["A", "B", "C", "D"],
        },
        authority: "IDENTIFY_PERSON_FROM_CODED_GRAPH",
        prototypeId: "BLR-CP006-PROT-IDENTIFY-DIRECT",
        qlId: "BLR-QL-027",
        stem: "Who is the father of B?",
      });
    },
  },
  {
    prototypeId: "BLR-CP006-PROT-IDENTIFY-DERIVED",
    authority: "IDENTIFY_PERSON_FROM_CODED_GRAPH",
    qlId: "BLR-QL-027",
    build: (seed) => {
      const coded = codeKey(seed);
      const statements = [
        statement(coded.codeKey, "A", "BROTHER", "B"),
        statement(coded.codeKey, "B", "FATHER", "C"),
        statement(coded.codeKey, "D", "MOTHER", "C"),
      ];
      return scenario({
        scenarioId: `BLR-CP006-SCN-IDENTIFY-DERIVED::${seed}`,
        topologyId: "CODED_DERIVED_PERSON_IDENTIFICATION",
        ...coded,
        statements,
        expressionLines: [chainLine(statements.slice(0, 2)), expressionLine(statements[2]!)],
        query: {
          kind: "IDENTIFY_PERSON",
          referenceId: "C",
          relationId: "UNCLE",
          candidateIds: ["A", "B", "C", "D"],
        },
        authority: "IDENTIFY_PERSON_FROM_CODED_GRAPH",
        prototypeId: "BLR-CP006-PROT-IDENTIFY-DERIVED",
        qlId: "BLR-QL-027",
        stem: "Who is the uncle of C?",
      });
    },
  },
  {
    prototypeId: "BLR-CP006-PROT-GENDER-DIRECT",
    authority: "DETERMINE_GENDER_FROM_CODED_GRAPH",
    qlId: "BLR-QL-028",
    build: (seed) => {
      const coded = codeKey(seed);
      const relationId = seed % 2 === 0 ? "SISTER" : "BROTHER";
      const statements = [statement(coded.codeKey, "A", relationId, "B")];
      return scenario({
        scenarioId: `BLR-CP006-SCN-GENDER-DIRECT::${seed}`,
        topologyId: "CODED_DIRECT_GENDER",
        ...coded,
        statements,
        expressionLines: statements.map(expressionLine),
        query: { kind: "GENDER", personId: "A" },
        authority: "DETERMINE_GENDER_FROM_CODED_GRAPH",
        prototypeId: "BLR-CP006-PROT-GENDER-DIRECT",
        qlId: "BLR-QL-028",
        stem: "What is the gender of A?",
      });
    },
  },
  {
    prototypeId: "BLR-CP006-PROT-GENDER-DERIVED",
    authority: "DETERMINE_GENDER_FROM_CODED_GRAPH",
    qlId: "BLR-QL-028",
    build: (seed) => {
      const coded = codeKey(seed);
      const statements = [
        statement(coded.codeKey, "A", "BROTHER", "B"),
        statement(coded.codeKey, "B", "FATHER", "C"),
      ];
      return scenario({
        scenarioId: `BLR-CP006-SCN-GENDER-DERIVED::${seed}`,
        topologyId: "CODED_RELATION_QUALIFIED_GENDER",
        ...coded,
        statements,
        expressionLines: [chainLine(statements)],
        query: { kind: "GENDER", personId: "A" },
        authority: "DETERMINE_GENDER_FROM_CODED_GRAPH",
        prototypeId: "BLR-CP006-PROT-GENDER-DERIVED",
        qlId: "BLR-QL-028",
        stem: "What is the gender of C's uncle A?",
      });
    },
  },
  ...([
    ["BLR-CP006-PROT-PAIR-SIBLING", "SIBLING", ["A", "B"]] as const,
    ["BLR-CP006-PROT-PAIR-SPOUSE", "SPOUSE", ["C", "D"]] as const,
    ["BLR-CP006-PROT-PAIR-PARENT-CHILD", "PARENT", ["E", "F"]] as const,
  ]).map(([prototypeId, relationId, correctPair]): PrototypeSpec => ({
    prototypeId,
    authority: "SELECT_CODED_RELATION_PAIR",
    qlId: "BLR-QL-029",
    build: (seed) => {
      const coded = codeKey(seed);
      const statements = [
        statement(coded.codeKey, "A", "BROTHER", "B"),
        statement(coded.codeKey, "C", "WIFE", "D"),
        statement(coded.codeKey, "E", "FATHER", "F"),
      ];
      const candidatePairs = [
        ["A", "B"],
        ["C", "D"],
        ["E", "F"],
        ["B", "F"],
      ] as const;
      return scenario({
        scenarioId: `${prototypeId.replace("BLR-CP006-PROT-", "BLR-CP006-SCN-")}::${seed}`,
        topologyId: "CODED_RELATION_PAIR_SELECTION",
        ...coded,
        statements,
        expressionLines: statements.map(expressionLine),
        query: {
          kind: "SELECT_PAIR",
          relationId,
          candidatePairs,
        },
        authority: "SELECT_CODED_RELATION_PAIR",
        prototypeId,
        qlId: "BLR-QL-029",
        stem: `Which pair has a ${relationDisplay(relationId).toLocaleLowerCase("en-IN")} relation?`,
        note: `The correct unordered pair is ${correctPair.join(" and ")}.`,
      });
    },
  })),
  relationPrototype(
    "BLR-CP006-PROT-FAMILY-SET-FORWARD",
    "MULTI_STATEMENT_FAMILY_SET_FORWARD",
    (_seed, key) => {
      const statements = [
        statement(key, "A", "HUSBAND", "B"),
        statement(key, "A", "FATHER", "C"),
        statement(key, "B", "MOTHER", "D"),
        statement(key, "C", "BROTHER", "D"),
        statement(key, "C", "HUSBAND", "E"),
        statement(key, "F", "SON", "C"),
      ];
      return {
        statements,
        expressionLines: statements.map(expressionLine),
        subjectId: "A",
        referenceId: "F",
      };
    },
    "RESOLVE_CODED_FAMILY_SET_RELATION",
    "BLR-QL-030",
  ),
  relationPrototype(
    "BLR-CP006-PROT-FAMILY-SET-REVERSE",
    "MULTI_STATEMENT_FAMILY_SET_REVERSE",
    (_seed, key) => {
      const statements = [
        statement(key, "A", "HUSBAND", "B"),
        statement(key, "A", "FATHER", "C"),
        statement(key, "B", "MOTHER", "D"),
        statement(key, "C", "BROTHER", "D"),
        statement(key, "C", "HUSBAND", "E"),
        statement(key, "F", "SON", "C"),
      ];
      return {
        statements,
        expressionLines: statements.map(expressionLine),
        subjectId: "F",
        referenceId: "A",
      };
    },
    "RESOLVE_CODED_FAMILY_SET_RELATION",
    "BLR-QL-030",
  ),
  relationPrototype(
    "BLR-CP006-PROT-FAMILY-SET-AFFINAL",
    "MULTI_STATEMENT_FAMILY_SET_AFFINAL",
    (_seed, key) => {
      const statements = [
        statement(key, "A", "HUSBAND", "B"),
        statement(key, "B", "MOTHER", "C"),
        statement(key, "C", "WIFE", "D"),
        statement(key, "E", "BROTHER", "D"),
        statement(key, "F", "SISTER", "C"),
      ];
      return {
        statements,
        expressionLines: statements.map(expressionLine),
        subjectId: "E",
        referenceId: "C",
      };
    },
    "RESOLVE_CODED_FAMILY_SET_RELATION",
    "BLR-QL-030",
  ),
] as const;
