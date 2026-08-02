import {
  relationDisplay,
  type BlrCp006CodeDefinition,
  type BlrCp006CodedStatement,
  type BlrCp006DirectRelation,
  type BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import {
  rotate,
  type BlrCp007ExpressionCandidate,
  type BlrCp007PrototypeId,
  type BlrCp007Query,
  type BlrCp007Scenario,
} from "./cp007-model";

const DIRECT_RELATIONS: readonly BlrCp006DirectRelation[] = [
  "FATHER", "MOTHER", "SON", "DAUGHTER", "BROTHER", "SISTER", "HUSBAND", "WIFE",
];

const TOKEN_PALETTES = [
  { style: "SYMBOL" as const, values: ["×", "−", "+", "÷", "@", "#", "%", "&"] },
  { style: "LETTER" as const, values: ["ka", "mi", "ru", "ta", "lo", "se", "vi", "no"] },
  { style: "NEUTRAL_WORD" as const, values: ["star", "leaf", "river", "cloud", "stone", "flame", "moon", "seed"] },
] as const;

function codeKey(seed: number): {
  keyStyle: BlrCp007Scenario["keyStyle"];
  codeKey: readonly BlrCp006CodeDefinition[];
} {
  const palette = TOKEN_PALETTES[((seed % TOKEN_PALETTES.length) + TOKEN_PALETTES.length) % TOKEN_PALETTES.length]!;
  const tokens = rotate(palette.values, seed * 3 + 1);
  const relations = rotate(DIRECT_RELATIONS, seed * 5 + 2);
  return {
    keyStyle: palette.style,
    codeKey: relations.map((relationId, index) => ({ token: tokens[index]!, relationId })),
  };
}

function tokenFor(key: readonly BlrCp006CodeDefinition[], relationId: BlrCp006DirectRelation): string {
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

function chain(values: readonly BlrCp006CodedStatement[]): string {
  if (!values.length) return "";
  let text = values[0]!.leftId;
  for (const value of values) {
    if (text.endsWith(value.leftId)) text += ` ${value.token} ${value.rightId}`;
    else text += `; ${line(value)}`;
  }
  return text;
}

function candidate(
  statements: readonly BlrCp006CodedStatement[],
  semanticKey: string,
  claim?: BlrCp007ExpressionCandidate["claim"],
): BlrCp007ExpressionCandidate {
  const expression = chain(statements);
  return {
    text: claim
      ? `${expression} — ${claim.subjectId} is the ${relationDisplay(claim.relationId).toLocaleLowerCase("en-IN")} of ${claim.referenceId}`
      : expression,
    statements,
    semanticKey,
    claim,
  };
}

function usedTokens(query: BlrCp007Query): Set<string> {
  const used = new Set<string>();
  const addStatements = (values: readonly BlrCp006CodedStatement[]) =>
    values.forEach((value) => used.add(value.token));
  switch (query.kind) {
    case "SELECT_EXPRESSION":
    case "SELECT_VALIDITY":
      query.candidates.forEach((entry) => addStatements(entry.statements));
      break;
    case "MISSING_TOKEN":
      addStatements(query.completeStatements);
      query.candidateTokens.forEach((token) => used.add(token));
      break;
    case "MISSING_TOKEN_PAIR":
      addStatements(query.completeStatements);
      query.candidateTokenPairs.flat().forEach((token) => used.add(token));
      break;
    case "MISSING_PERSON":
      addStatements(query.completeStatements);
      break;
  }
  return used;
}

function makeScenario(input: {
  seed: number;
  prototypeId: BlrCp007PrototypeId;
  topologyId: string;
  qlId: BlrCp007Scenario["qlId"];
  authority: BlrCp007Scenario["authority"];
  stem: string;
  query: BlrCp007Query;
  coded: ReturnType<typeof codeKey>;
}): BlrCp007Scenario {
  const used = usedTokens(input.query);
  const included = input.coded.codeKey.filter((entry) => used.has(entry.token));
  const fillers = input.coded.codeKey.filter((entry) => !used.has(entry.token));
  const selectedKey = [...included, ...fillers].slice(0, Math.max(4, included.length));
  const sharedPrompt = `Use the following code meanings: ${selectedKey
    .map((entry) => `${entry.token} means “is the ${relationDisplay(entry.relationId).toLocaleLowerCase("en-IN")} of”`)
    .join("; ")}. Each coded pair is read from left to right.`;
  return {
    scenarioId: `${input.prototypeId.replace("BLR-CP007-PROT-", "BLR-CP007-SCN-")}::${input.seed}`,
    topologyId: input.topologyId,
    keyStyle: input.coded.keyStyle,
    codeKey: selectedKey,
    authority: input.authority,
    prototypeId: input.prototypeId,
    qlId: input.qlId,
    sharedPrompt,
    stem: input.stem,
    query: input.query,
  };
}

export interface BlrCp007PrototypeSpec {
  prototypeId: BlrCp007PrototypeId;
  qlId: BlrCp007Scenario["qlId"];
  authority: BlrCp007Scenario["authority"];
  build: (seed: number) => BlrCp007Scenario;
}

function selectExpressionPrototype(
  prototypeId: BlrCp007PrototypeId,
  topologyId: string,
  builder: (key: readonly BlrCp006CodeDefinition[]) => {
    target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string };
    candidates: readonly BlrCp007ExpressionCandidate[];
  },
): BlrCp007PrototypeSpec {
  return {
    prototypeId,
    qlId: "BLR-QL-031",
    authority: "SELECT_CODED_EXPRESSION",
    build: (seed) => {
      const coded = codeKey(seed);
      const built = builder(coded.codeKey);
      return makeScenario({
        seed, prototypeId, topologyId,
        qlId: "BLR-QL-031",
        authority: "SELECT_CODED_EXPRESSION",
        coded,
        stem: `Which coded expression shows that ${built.target.subjectId} is the ${relationDisplay(built.target.relationId).toLocaleLowerCase("en-IN")} of ${built.target.referenceId}?`,
        query: { kind: "SELECT_EXPRESSION", target: built.target, candidates: built.candidates },
      });
    },
  };
}

function missingTokenPrototype(
  prototypeId: BlrCp007PrototypeId,
  topologyId: string,
  builder: (key: readonly BlrCp006CodeDefinition[]) => {
    completeStatements: readonly BlrCp006CodedStatement[];
    blankStatementIndex: number;
    stem: string;
    target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string };
  },
): BlrCp007PrototypeSpec {
  return {
    prototypeId,
    qlId: "BLR-QL-032",
    authority: "COMPLETE_MISSING_CODE_TOKEN",
    build: (seed) => {
      const coded = codeKey(seed);
      const built = builder(coded.codeKey);
      const complete = built.completeStatements;
      const blanked = complete.map((value, index) =>
        index === built.blankStatementIndex ? `${value.leftId} ? ${value.rightId}` : line(value)
      );
      const correct = complete[built.blankStatementIndex]!.token;
      const alternatives = coded.codeKey.map((entry) => entry.token).filter((token) => token !== correct);
      const candidateTokens = [correct, ...rotate(alternatives, seed + 3).slice(0, 3)];
      return makeScenario({
        seed, prototypeId, topologyId,
        qlId: "BLR-QL-032",
        authority: "COMPLETE_MISSING_CODE_TOKEN",
        coded,
        stem: `${built.stem} Replace the question mark with the correct code token.`,
        query: {
          kind: "MISSING_TOKEN",
          completeStatements: complete,
          blankStatementIndex: built.blankStatementIndex,
          expressionLines: blanked,
          candidateTokens,
          target: built.target,
        },
      });
    },
  };
}

function missingPairPrototype(
  prototypeId: BlrCp007PrototypeId,
  topologyId: string,
  builder: (key: readonly BlrCp006CodeDefinition[]) => {
    completeStatements: readonly BlrCp006CodedStatement[];
    blankStatementIndices: readonly [number, number];
    stem: string;
    target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string };
  },
): BlrCp007PrototypeSpec {
  return {
    prototypeId,
    qlId: "BLR-QL-033",
    authority: "COMPLETE_ORDERED_CODE_TOKEN_PAIR",
    build: (seed) => {
      const coded = codeKey(seed);
      const built = builder(coded.codeKey);
      const [firstIndex, secondIndex] = built.blankStatementIndices;
      const correct: readonly [string, string] = [
        built.completeStatements[firstIndex]!.token,
        built.completeStatements[secondIndex]!.token,
      ];
      const relationTokens = coded.codeKey.map((entry) => entry.token);
      const pairs: (readonly [string, string])[] = [
        correct,
        [correct[1], correct[0]],
        [relationTokens[(seed + 2) % relationTokens.length]!, correct[1]],
        [correct[0], relationTokens[(seed + 5) % relationTokens.length]!],
      ];
      const distinct: (readonly [string, string])[] = [];
      for (const pair of pairs) {
        if (!distinct.some((seen) => seen[0] === pair[0] && seen[1] === pair[1])) distinct.push(pair);
      }
      for (const left of relationTokens) {
        for (const right of relationTokens) {
          if (distinct.length >= 4) break;
          if (!distinct.some((seen) => seen[0] === left && seen[1] === right)) distinct.push([left, right]);
        }
        if (distinct.length >= 4) break;
      }
      const blanked = built.completeStatements.map((value, index) => {
        if (index === firstIndex || index === secondIndex) return `${value.leftId} ? ${value.rightId}`;
        return line(value);
      });
      return makeScenario({
        seed, prototypeId, topologyId,
        qlId: "BLR-QL-033",
        authority: "COMPLETE_ORDERED_CODE_TOKEN_PAIR",
        coded,
        stem: `${built.stem} Choose the tokens for the first and second blanks in that order.`,
        query: {
          kind: "MISSING_TOKEN_PAIR",
          completeStatements: built.completeStatements,
          blankStatementIndices: built.blankStatementIndices,
          expressionLines: blanked,
          candidateTokenPairs: distinct.slice(0, 4),
          target: built.target,
        },
      });
    },
  };
}

function missingPersonPrototype(
  prototypeId: BlrCp007PrototypeId,
  topologyId: string,
  builder: (key: readonly BlrCp006CodeDefinition[]) => {
    completeStatements: readonly BlrCp006CodedStatement[];
    blankStatementIndex: number;
    blankSide: "LEFT" | "RIGHT";
    candidatePersonIds: readonly string[];
    target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string };
  },
): BlrCp007PrototypeSpec {
  return {
    prototypeId,
    qlId: "BLR-QL-034",
    authority: "COMPLETE_MISSING_PERSON",
    build: (seed) => {
      const coded = codeKey(seed);
      const built = builder(coded.codeKey);
      const displayStatements = built.completeStatements.map((value, index) => ({
        ...value,
        leftId: index === built.blankStatementIndex && built.blankSide === "LEFT" ? "?" : value.leftId,
        rightId: index === built.blankStatementIndex && built.blankSide === "RIGHT" ? "?" : value.rightId,
      }));
      return makeScenario({
        seed, prototypeId, topologyId,
        qlId: "BLR-QL-034",
        authority: "COMPLETE_MISSING_PERSON",
        coded,
        stem: `Which person should replace ? so that ${built.target.subjectId} is the ${relationDisplay(built.target.relationId).toLocaleLowerCase("en-IN")} of ${built.target.referenceId}?`,
        query: {
          kind: "MISSING_PERSON",
          completeStatements: built.completeStatements,
          blankStatementIndex: built.blankStatementIndex,
          blankSide: built.blankSide,
          expressionLines: displayStatements.map(line),
          candidatePersonIds: built.candidatePersonIds,
          target: built.target,
        },
      });
    },
  };
}

function validityPrototype(
  prototypeId: BlrCp007PrototypeId,
  topologyId: string,
  desiredStatus: "VALID" | "INVALID",
  builder: (key: readonly BlrCp006CodeDefinition[]) => readonly BlrCp007ExpressionCandidate[],
): BlrCp007PrototypeSpec {
  return {
    prototypeId,
    qlId: "BLR-QL-035",
    authority: "SELECT_CODED_STATEMENT_BY_VALIDITY",
    build: (seed) => {
      const coded = codeKey(seed);
      return makeScenario({
        seed, prototypeId, topologyId,
        qlId: "BLR-QL-035",
        authority: "SELECT_CODED_STATEMENT_BY_VALIDITY",
        coded,
        stem: `Which coded statement and interpretation is ${desiredStatus === "VALID" ? "correct" : "incorrect"}?`,
        query: { kind: "SELECT_VALIDITY", desiredStatus, candidates: builder(coded.codeKey) },
      });
    },
  };
}

export const BLR_CP007_PROTOTYPES: readonly BlrCp007PrototypeSpec[] = [
  selectExpressionPrototype(
    "BLR-CP007-PROT-SELECT-DIRECT-FORWARD", "DIRECT_FORWARD_EXPRESSION_SELECTION",
    (key) => ({
      target: { subjectId: "A", relationId: "FATHER", referenceId: "B" },
      candidates: [
        candidate([statement(key, "A", "FATHER", "B")], "DIRECT_CORRECT"),
        candidate([statement(key, "A", "MOTHER", "B")], "GENDER_SWAP"),
        candidate([statement(key, "B", "FATHER", "A")], "DIRECTION_SWAP"),
        candidate([statement(key, "A", "BROTHER", "B")], "RELATION_SWAP"),
      ],
    }),
  ),
  selectExpressionPrototype(
    "BLR-CP007-PROT-SELECT-DIRECT-REVERSE", "DIRECT_REVERSE_EXPRESSION_SELECTION",
    (key) => ({
      target: { subjectId: "B", relationId: "SON", referenceId: "A" },
      candidates: [
        candidate([statement(key, "A", "FATHER", "B"), statement(key, "B", "BROTHER", "C")], "REVERSE_CORRECT"),
        candidate([statement(key, "B", "FATHER", "A"), statement(key, "B", "BROTHER", "C")], "SURFACE_DIRECTION_TRAP"),
        candidate([statement(key, "A", "BROTHER", "B"), statement(key, "B", "BROTHER", "C")], "GENERATION_SWAP"),
        candidate([statement(key, "A", "FATHER", "C"), statement(key, "B", "HUSBAND", "C")], "AFFINAL_CHILD_TRAP"),
      ],
    }),
  ),
  selectExpressionPrototype(
    "BLR-CP007-PROT-SELECT-TWO-LINK-FORWARD", "TWO_LINK_FORWARD_EXPRESSION_SELECTION",
    (key) => ({
      target: { subjectId: "A", relationId: "GRANDFATHER", referenceId: "C" },
      candidates: [
        candidate([statement(key, "A", "FATHER", "B"), statement(key, "B", "MOTHER", "C")], "TWO_LINK_CORRECT"),
        candidate([statement(key, "A", "MOTHER", "B"), statement(key, "B", "FATHER", "C")], "GRANDPARENT_GENDER_SWAP"),
        candidate([statement(key, "A", "BROTHER", "B"), statement(key, "B", "FATHER", "C")], "UNCLE_PATH"),
        candidate([statement(key, "A", "FATHER", "B"), statement(key, "C", "MOTHER", "B")], "SECOND_EDGE_REVERSED"),
      ],
    }),
  ),
  selectExpressionPrototype(
    "BLR-CP007-PROT-SELECT-TWO-LINK-REVERSE", "TWO_LINK_REVERSE_EXPRESSION_SELECTION",
    (key) => ({
      target: { subjectId: "C", relationId: "GRANDCHILD", referenceId: "A" },
      candidates: [
        candidate([statement(key, "A", "FATHER", "B"), statement(key, "B", "MOTHER", "C")], "TWO_LINK_REVERSE_CORRECT"),
        candidate([statement(key, "C", "SON", "B"), statement(key, "B", "FATHER", "A")], "CHAIN_REVERSED"),
        candidate([statement(key, "A", "BROTHER", "B"), statement(key, "B", "FATHER", "C")], "NEPHEW_PATH"),
        candidate([statement(key, "A", "FATHER", "B"), statement(key, "C", "FATHER", "B")], "SECOND_EDGE_REVERSED"),
      ],
    }),
  ),
  selectExpressionPrototype(
    "BLR-CP007-PROT-SELECT-THREE-LINK", "THREE_LINK_EXPRESSION_SELECTION",
    (key) => ({
      target: { subjectId: "A", relationId: "UNCLE", referenceId: "D" },
      candidates: [
        candidate([statement(key, "A", "BROTHER", "B"), statement(key, "B", "FATHER", "C"), statement(key, "C", "SISTER", "D")], "THREE_LINK_CORRECT"),
        candidate([statement(key, "A", "SISTER", "B"), statement(key, "B", "FATHER", "C"), statement(key, "C", "SISTER", "D")], "AUNT_GENDER_SWAP"),
        candidate([statement(key, "A", "FATHER", "B"), statement(key, "B", "FATHER", "C"), statement(key, "C", "SISTER", "D")], "GRANDFATHER_PATH"),
        candidate([statement(key, "A", "BROTHER", "B"), statement(key, "C", "FATHER", "B"), statement(key, "C", "SISTER", "D")], "MIDDLE_DIRECTION_SWAP"),
      ],
    }),
  ),
  selectExpressionPrototype(
    "BLR-CP007-PROT-SELECT-AFFINAL", "AFFINAL_EXPRESSION_SELECTION",
    (key) => ({
      target: { subjectId: "A", relationId: "BROTHER_IN_LAW", referenceId: "C" },
      candidates: [
        candidate([statement(key, "A", "BROTHER", "B"), statement(key, "B", "HUSBAND", "C")], "AFFINAL_CORRECT"),
        candidate([statement(key, "A", "SISTER", "B"), statement(key, "B", "HUSBAND", "C")], "AFFINAL_GENDER_SWAP"),
        candidate([statement(key, "A", "BROTHER", "B"), statement(key, "B", "FATHER", "C")], "BLOOD_RELATION_PATH"),
        candidate([statement(key, "A", "FATHER", "B"), statement(key, "B", "HUSBAND", "C")], "PARENT_IN_LAW_PATH"),
      ],
    }),
  ),

  missingTokenPrototype(
    "BLR-CP007-PROT-MISSING-TOKEN-DIRECT", "DIRECT_TOKEN_COMPLETION",
    (key) => ({
      completeStatements: [statement(key, "A", "FATHER", "B")], blankStatementIndex: 0,
      stem: "Complete the expression so that A is the father of B.",
      target: { subjectId: "A", relationId: "FATHER", referenceId: "B" },
    }),
  ),
  missingTokenPrototype(
    "BLR-CP007-PROT-MISSING-TOKEN-REVERSE", "REVERSE_TOKEN_COMPLETION",
    (key) => ({
      completeStatements: [statement(key, "A", "SON", "B")], blankStatementIndex: 0,
      stem: "Complete the expression so that A is the son of B.",
      target: { subjectId: "A", relationId: "SON", referenceId: "B" },
    }),
  ),
  missingTokenPrototype(
    "BLR-CP007-PROT-MISSING-TOKEN-FIRST-LINK", "FIRST_LINK_TOKEN_COMPLETION",
    (key) => ({
      completeStatements: [statement(key, "A", "FATHER", "B"), statement(key, "B", "MOTHER", "C")],
      blankStatementIndex: 0,
      stem: "Complete the chain so that A is the grandfather of C.",
      target: { subjectId: "A", relationId: "GRANDFATHER", referenceId: "C" },
    }),
  ),
  missingTokenPrototype(
    "BLR-CP007-PROT-MISSING-TOKEN-SECOND-LINK", "SECOND_LINK_TOKEN_COMPLETION",
    (key) => ({
      completeStatements: [statement(key, "A", "BROTHER", "B"), statement(key, "B", "FATHER", "C")],
      blankStatementIndex: 1,
      stem: "Complete the chain so that A is the brother of B and B is the father of C.",
      target: { subjectId: "A", relationId: "UNCLE", referenceId: "C" },
    }),
  ),

  missingPairPrototype(
    "BLR-CP007-PROT-MISSING-PAIR-TWO-LINK", "TWO_LINK_ORDERED_TOKEN_PAIR",
    (key) => ({
      completeStatements: [statement(key, "A", "FATHER", "B"), statement(key, "B", "MOTHER", "C")],
      blankStatementIndices: [0, 1],
      stem: "Complete both blanks so that A is the father of B and B is the mother of C.",
      target: { subjectId: "A", relationId: "GRANDFATHER", referenceId: "C" },
    }),
  ),
  missingPairPrototype(
    "BLR-CP007-PROT-MISSING-PAIR-THREE-LINK", "THREE_LINK_ORDERED_TOKEN_PAIR",
    (key) => ({
      completeStatements: [statement(key, "A", "BROTHER", "B"), statement(key, "B", "FATHER", "C"), statement(key, "C", "SISTER", "D")],
      blankStatementIndices: [0, 2],
      stem: "Complete the first and third links so that A is the brother of B and C is the sister of D.",
      target: { subjectId: "A", relationId: "UNCLE", referenceId: "D" },
    }),
  ),
  missingPairPrototype(
    "BLR-CP007-PROT-MISSING-PAIR-AFFINAL", "AFFINAL_ORDERED_TOKEN_PAIR",
    (key) => ({
      completeStatements: [statement(key, "A", "BROTHER", "B"), statement(key, "B", "HUSBAND", "C")],
      blankStatementIndices: [0, 1],
      stem: "Complete both blanks so that A is the brother of B and B is the husband of C.",
      target: { subjectId: "A", relationId: "BROTHER_IN_LAW", referenceId: "C" },
    }),
  ),

  missingPersonPrototype(
    "BLR-CP007-PROT-MISSING-PERSON-DIRECT-LEFT", "DIRECT_LEFT_PERSON_COMPLETION",
    (key) => ({
      completeStatements: [statement(key, "A", "FATHER", "B")], blankStatementIndex: 0, blankSide: "LEFT",
      candidatePersonIds: ["A", "B", "C", "D"], target: { subjectId: "A", relationId: "FATHER", referenceId: "B" },
    }),
  ),
  missingPersonPrototype(
    "BLR-CP007-PROT-MISSING-PERSON-DIRECT-RIGHT", "DIRECT_RIGHT_PERSON_COMPLETION",
    (key) => ({
      completeStatements: [statement(key, "A", "FATHER", "B")], blankStatementIndex: 0, blankSide: "RIGHT",
      candidatePersonIds: ["A", "B", "C", "D"], target: { subjectId: "B", relationId: "CHILD", referenceId: "A" },
    }),
  ),
  missingPersonPrototype(
    "BLR-CP007-PROT-MISSING-PERSON-INTERNAL", "INTERNAL_PERSON_COMPLETION",
    (key) => ({
      completeStatements: [statement(key, "A", "FATHER", "B"), statement(key, "B", "MOTHER", "C")],
      blankStatementIndex: 1, blankSide: "LEFT", candidatePersonIds: ["A", "B", "C", "D"],
      target: { subjectId: "A", relationId: "GRANDFATHER", referenceId: "C" },
    }),
  ),
  missingPersonPrototype(
    "BLR-CP007-PROT-MISSING-PERSON-ENDPOINT", "ENDPOINT_PERSON_COMPLETION",
    (key) => ({
      completeStatements: [statement(key, "A", "BROTHER", "B"), statement(key, "B", "FATHER", "C")],
      blankStatementIndex: 1, blankSide: "RIGHT", candidatePersonIds: ["A", "B", "C", "D"],
      target: { subjectId: "A", relationId: "UNCLE", referenceId: "C" },
    }),
  ),

  validityPrototype(
    "BLR-CP007-PROT-VALIDITY-CORRECT-DIRECT", "CORRECT_DIRECT_STATEMENT_SELECTION", "VALID",
    (key) => [
      candidate([statement(key, "A", "FATHER", "B")], "VALID_DIRECT", { subjectId: "A", relationId: "FATHER", referenceId: "B" }),
      candidate([statement(key, "C", "MOTHER", "D")], "WRONG_GENDER", { subjectId: "C", relationId: "FATHER", referenceId: "D" }),
      candidate([statement(key, "E", "BROTHER", "F")], "WRONG_DIRECTION", { subjectId: "F", relationId: "BROTHER", referenceId: "E" }),
      candidate([statement(key, "G", "WIFE", "H")], "WRONG_SPOUSE_TERM", { subjectId: "G", relationId: "HUSBAND", referenceId: "H" }),
    ],
  ),
  validityPrototype(
    "BLR-CP007-PROT-VALIDITY-INCORRECT-DIRECT", "INCORRECT_DIRECT_STATEMENT_SELECTION", "INVALID",
    (key) => [
      candidate([statement(key, "A", "FATHER", "B")], "VALID_FATHER", { subjectId: "B", relationId: "CHILD", referenceId: "A" }),
      candidate([statement(key, "C", "MOTHER", "D")], "VALID_MOTHER", { subjectId: "C", relationId: "MOTHER", referenceId: "D" }),
      candidate([statement(key, "E", "BROTHER", "F")], "INVALID_SIBLING_GENDER", { subjectId: "E", relationId: "SISTER", referenceId: "F" }),
      candidate([statement(key, "G", "WIFE", "H")], "VALID_WIFE", { subjectId: "H", relationId: "HUSBAND", referenceId: "G" }),
    ],
  ),
  validityPrototype(
    "BLR-CP007-PROT-VALIDITY-CORRECT-DERIVED", "CORRECT_DERIVED_STATEMENT_SELECTION", "VALID",
    (key) => {
      const statements = [statement(key, "A", "FATHER", "B"), statement(key, "B", "MOTHER", "C")];
      return [
        candidate(statements, "VALID_GRANDFATHER", { subjectId: "A", relationId: "GRANDFATHER", referenceId: "C" }),
        candidate(statements, "INVALID_GRANDMOTHER", { subjectId: "A", relationId: "GRANDMOTHER", referenceId: "C" }),
        candidate(statements, "INVALID_UNCLE", { subjectId: "A", relationId: "UNCLE", referenceId: "C" }),
        candidate(statements, "INVALID_REVERSE", { subjectId: "C", relationId: "GRANDFATHER", referenceId: "A" }),
      ];
    },
  ),
  validityPrototype(
    "BLR-CP007-PROT-VALIDITY-INCORRECT-DERIVED", "INCORRECT_DERIVED_STATEMENT_SELECTION", "INVALID",
    (key) => [
      candidate([statement(key, "A", "FATHER", "B"), statement(key, "B", "FATHER", "C")], "VALID_GRANDFATHER", { subjectId: "A", relationId: "GRANDFATHER", referenceId: "C" }),
      candidate([statement(key, "D", "MOTHER", "E"), statement(key, "E", "FATHER", "F")], "VALID_GRANDMOTHER", { subjectId: "D", relationId: "GRANDMOTHER", referenceId: "F" }),
      candidate([statement(key, "G", "BROTHER", "H"), statement(key, "H", "FATHER", "I")], "VALID_UNCLE", { subjectId: "G", relationId: "UNCLE", referenceId: "I" }),
      candidate([statement(key, "J", "SISTER", "K"), statement(key, "K", "FATHER", "L")], "INVALID_UNCLE_GENDER", { subjectId: "J", relationId: "UNCLE", referenceId: "L" }),
    ],
  ),
];

export function prototypeCase(prototypeId: BlrCp007PrototypeId): BlrCp007PrototypeSpec {
  const found = BLR_CP007_PROTOTYPES.find((entry) => entry.prototypeId === prototypeId);
  if (!found) throw new Error(`Unknown CP-007 prototype ${prototypeId}.`);
  return found;
}
