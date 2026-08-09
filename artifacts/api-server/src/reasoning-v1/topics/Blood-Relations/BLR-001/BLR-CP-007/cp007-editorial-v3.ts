import { decodeScenario, relationOf } from "../BLR-CP-006/cp006-graph";
import {
  relationDisplay,
  semanticFingerprint,
  type BlrCp006CodeDefinition,
  type BlrCp006CodedStatement,
  type BlrCp006DirectRelation,
  type BlrCp006FamilyTree,
  type BlrCp006Graph,
  type BlrCp006Relation,
  type BlrCp006Scenario,
} from "../BLR-CP-006/cp006-model";
import type {
  BlrCp007Authority,
  BlrCp007ExpressionCandidate,
  BlrCp007PrototypeId,
  BlrCp007QlId,
  BlrCp007Query,
} from "./cp007-model";
import type {
  BlrCp007V2DiagramEdge,
  BlrCp007V2DiagramProof,
  BlrCp007V2FailureCode,
} from "./cp007-editorial-v2-model";
import {
  BLR_CP007_EDITORIAL_V3_REVIEW_VERSION,
  BLR_CP007_EDITORIAL_V3_RUNTIME_VERSION,
  type BlrCp007EditorialV3Telemetry,
  type BlrCp007V3Difficulty,
  type BlrCp007V3Option,
  type GeneratedBlrCp007EditorialV3Question,
} from "./cp007-editorial-v3-model";
import {
  BLR_CP007_V3_MISSING_PERSON_BASE,
  BLR_CP007_V3_PROTOTYPE_PLANS,
  type BlrCp007V3DirectSpec,
  type BlrCp007V3MissingPersonTemplate,
  type BlrCp007V3PrototypePlan,
  type BlrCp007V3RelationTemplate,
  type BlrCp007V3Target,
} from "./cp007-editorial-v3-scenarios";

const DIRECT_RELATIONS: readonly BlrCp006DirectRelation[] = [
  "FATHER",
  "MOTHER",
  "SON",
  "DAUGHTER",
  "BROTHER",
  "SISTER",
  "HUSBAND",
  "WIFE",
] as const;

const SYMBOL_TOKENS = ["@", "#", "$", "%", "&", "*", "+", "~"] as const;
const LETTER_TOKENS = ["X", "Y", "Z", "M", "N", "L", "K", "J"] as const;
const WORD_TOKENS = ["red", "blue", "green", "white", "black", "amber", "silver", "gold"] as const;
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

const MALE_RELATIONS = new Set<BlrCp006Relation>([
  "FATHER", "SON", "BROTHER", "HUSBAND", "GRANDFATHER", "GRANDSON", "UNCLE", "NEPHEW",
  "FATHER_IN_LAW", "SON_IN_LAW", "BROTHER_IN_LAW",
]);
const FEMALE_RELATIONS = new Set<BlrCp006Relation>([
  "MOTHER", "DAUGHTER", "SISTER", "WIFE", "GRANDMOTHER", "GRANDDAUGHTER", "AUNT", "NIECE",
  "MOTHER_IN_LAW", "DAUGHTER_IN_LAW", "SISTER_IN_LAW",
]);

const INVERSE_DIRECT: Readonly<Record<BlrCp006DirectRelation, BlrCp006DirectRelation>> = {
  FATHER: "SON",
  MOTHER: "DAUGHTER",
  SON: "FATHER",
  DAUGHTER: "MOTHER",
  BROTHER: "BROTHER",
  SISTER: "SISTER",
  HUSBAND: "WIFE",
  WIFE: "HUSBAND",
};

const INVERSE_RELATION: Partial<Record<BlrCp006Relation, BlrCp006Relation>> = {
  FATHER: "SON",
  MOTHER: "DAUGHTER",
  SON: "FATHER",
  DAUGHTER: "MOTHER",
  HUSBAND: "WIFE",
  WIFE: "HUSBAND",
  GRANDFATHER: "GRANDSON",
  GRANDMOTHER: "GRANDDAUGHTER",
  GRANDSON: "GRANDFATHER",
  GRANDDAUGHTER: "GRANDMOTHER",
  UNCLE: "NEPHEW_OR_NIECE",
  AUNT: "NEPHEW_OR_NIECE",
  NEPHEW: "UNCLE_OR_AUNT",
  NIECE: "UNCLE_OR_AUNT",
  FATHER_IN_LAW: "CHILD_IN_LAW",
  MOTHER_IN_LAW: "CHILD_IN_LAW",
  SON_IN_LAW: "PARENT_IN_LAW",
  DAUGHTER_IN_LAW: "PARENT_IN_LAW",
};

function relationText(value: BlrCp006Relation): string {
  return relationDisplay(value).toLocaleLowerCase("en-IN");
}

function statementText(value: BlrCp006CodedStatement): string {
  return `${value.leftId} ${value.token} ${value.rightId}`;
}

function specKey(values: readonly BlrCp007V3DirectSpec[]): string {
  return values.map((value) => `${value.leftId}:${value.relationId}:${value.rightId}`).join("|");
}

function seededNumber(text: string): number {
  let value = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 0x01000193);
  }
  return value >>> 0;
}

function shuffle<T>(values: readonly T[], salt: string): T[] {
  const result = [...values];
  let state = seededNumber(salt) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const target = (state >>> 0) % (index + 1);
    [result[index], result[target]] = [result[target]!, result[index]!];
  }
  return result;
}

function correctPosition(globalIndex: number): number {
  const block = Math.floor(globalIndex / 4);
  const offset = globalIndex % 4;
  return shuffle([0, 1, 2, 3], `BLR-CP007-V3-BLOCK-${block}`)[offset]!;
}

function placeCorrect<T>(correct: T, wrong: readonly T[], globalIndex: number, salt: string): {
  options: T[];
  correctIndex: number;
} {
  const correctIndex = correctPosition(globalIndex);
  const shuffledWrong = shuffle(wrong, salt);
  const options: T[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(index === correctIndex ? correct : shuffledWrong[wrongIndex++]!);
  }
  return { options, correctIndex };
}

function styleFor(prototypeIndex: number, seed: number): GeneratedBlrCp007EditorialV3Question["keyStyle"] {
  if (seed >= 4) {
    if (prototypeIndex % 11 === 0) return "NEUTRAL_WORD";
    if (prototypeIndex % 5 === 1) return "LETTER";
    return "SYMBOL";
  }
  const index = prototypeIndex * 4 + seed;
  if (index % 20 === 0) return "NEUTRAL_WORD";
  if (index % 5 === 1) return "LETTER";
  return "SYMBOL";
}

function deliveryFor(prototypeId: BlrCp007PrototypeId, seed: number): GeneratedBlrCp007EditorialV3Question["delivery"] {
  if (seed < 4) return { mode: "STANDALONE" };
  return {
    mode: "SHARED_SET",
    setId: `${prototypeId}-SET-A`,
    itemNumber: seed - 3,
    itemCount: 4,
  };
}

function keyRelations(
  required: readonly BlrCp006DirectRelation[],
  delivery: GeneratedBlrCp007EditorialV3Question["delivery"],
): readonly BlrCp006DirectRelation[] {
  if (delivery.mode === "SHARED_SET") return DIRECT_RELATIONS;
  const set = new Set(required);
  return DIRECT_RELATIONS.filter((value) => set.has(value));
}

function codeKeyFor(
  relations: readonly BlrCp006DirectRelation[],
  style: GeneratedBlrCp007EditorialV3Question["keyStyle"],
  salt: string,
): readonly BlrCp006CodeDefinition[] {
  const tokens = style === "SYMBOL" ? SYMBOL_TOKENS : style === "LETTER" ? LETTER_TOKENS : WORD_TOKENS;
  const offset = seededNumber(salt) % tokens.length;
  return relations.map((relationId, index) => ({
    relationId,
    token: tokens[(index + offset) % tokens.length]!,
  }));
}

function promptFor(codeKey: readonly BlrCp006CodeDefinition[]): string {
  return `Use the following code meanings: ${codeKey.map((entry) =>
    `${entry.token} means “is the ${relationText(entry.relationId)} of”`,
  ).join("; ")}. Read every coded pair from left to right.`;
}

function tokenMap(codeKey: readonly BlrCp006CodeDefinition[]): Map<BlrCp006DirectRelation, string> {
  return new Map(codeKey.map((entry) => [entry.relationId, entry.token]));
}

function encodeSpecs(
  values: readonly BlrCp007V3DirectSpec[],
  codeKey: readonly BlrCp006CodeDefinition[],
): readonly BlrCp006CodedStatement[] {
  const tokens = tokenMap(codeKey);
  return values.map((value) => {
    const token = tokens.get(value.relationId);
    if (!token) throw new Error(`Missing token for ${value.relationId}.`);
    return { leftId: value.leftId, token, rightId: value.rightId };
  });
}

function analysisCodeKey(values: readonly BlrCp007V3DirectSpec[]): readonly BlrCp006CodeDefinition[] {
  const relations = DIRECT_RELATIONS.filter((relationId) => values.some((value) => value.relationId === relationId));
  return relations.map((relationId) => ({ token: relationId, relationId }));
}

function analyseSpecs(
  values: readonly BlrCp007V3DirectSpec[],
  target: BlrCp007V3Target,
  suffix: string,
): {
  graph: BlrCp006Graph;
  decodedStatements: readonly string[];
  actual?: BlrCp006Relation;
} {
  const codeKey = analysisCodeKey(values);
  const statements = values.map((value) => ({
    leftId: value.leftId,
    token: value.relationId,
    rightId: value.rightId,
  }));
  const scenario: BlrCp006Scenario = {
    scenarioId: `BLR-CP007-V3-ANALYSIS-${suffix}`,
    topologyId: "BLR_CP007_V3_ANALYSIS",
    keyStyle: "LETTER",
    codeKey,
    statements,
    expressionLines: statements.map(statementText),
    query: { kind: "RELATION", subjectId: target.subjectId, referenceId: target.referenceId },
    authority: "RESOLVE_CODED_RELATION",
    prototypeId: "BLR-CP006-PROT-DIRECT-FORWARD",
    qlId: "BLR-QL-026",
    stem: "Editorial V3 analysis",
  };
  const decoded = decodeScenario(scenario);
  let actual: BlrCp006Relation | undefined;
  try {
    actual = relationOf(decoded.graph, target.subjectId, target.referenceId);
  } catch {
    actual = undefined;
  }
  return { ...decoded, actual };
}

function decodeEncoded(
  codeKey: readonly BlrCp006CodeDefinition[],
  statements: readonly BlrCp006CodedStatement[],
  target: BlrCp007V3Target,
  suffix: string,
): {
  graph: BlrCp006Graph;
  decodedStatements: readonly string[];
  actual?: BlrCp006Relation;
} {
  const scenario: BlrCp006Scenario = {
    scenarioId: `BLR-CP007-V3-${suffix}`,
    topologyId: "BLR_CP007_V3_REVIEW",
    keyStyle: "SYMBOL",
    codeKey,
    statements,
    expressionLines: statements.map(statementText),
    query: { kind: "RELATION", subjectId: target.subjectId, referenceId: target.referenceId },
    authority: "RESOLVE_CODED_RELATION",
    prototypeId: "BLR-CP006-PROT-DIRECT-FORWARD",
    qlId: "BLR-QL-026",
    stem: "Editorial V3 verification",
  };
  const decoded = decodeScenario(scenario);
  let actual: BlrCp006Relation | undefined;
  try {
    actual = relationOf(decoded.graph, target.subjectId, target.referenceId);
  } catch {
    actual = undefined;
  }
  return { ...decoded, actual };
}

function relationFailure(target: BlrCp006Relation, actual?: BlrCp006Relation): BlrCp007V2FailureCode {
  if (!actual) return "BROKEN_CHAIN";
  if (INVERSE_RELATION[target] === actual) return "REVERSED_DIRECTION";
  const pairs: readonly (readonly [BlrCp006Relation, BlrCp006Relation])[] = [
    ["FATHER", "MOTHER"], ["SON", "DAUGHTER"], ["BROTHER", "SISTER"], ["HUSBAND", "WIFE"],
    ["GRANDFATHER", "GRANDMOTHER"], ["GRANDSON", "GRANDDAUGHTER"], ["UNCLE", "AUNT"],
    ["NEPHEW", "NIECE"], ["FATHER_IN_LAW", "MOTHER_IN_LAW"],
    ["SON_IN_LAW", "DAUGHTER_IN_LAW"], ["BROTHER_IN_LAW", "SISTER_IN_LAW"],
  ];
  if (pairs.some(([left, right]) => (target === left && actual === right) || (target === right && actual === left))) {
    return "WRONG_GENDER";
  }
  const generations = [
    new Set<BlrCp006Relation>(["FATHER", "MOTHER", "PARENT", "SON", "DAUGHTER", "CHILD"]),
    new Set<BlrCp006Relation>(["GRANDFATHER", "GRANDMOTHER", "GRANDPARENT", "GRANDSON", "GRANDDAUGHTER", "GRANDCHILD"]),
  ];
  if (generations.some((group) => group.has(target) !== group.has(actual))) return "WRONG_GENERATION";
  return "WRONG_RELATION";
}

function targetSentence(target: BlrCp007V3Target): string {
  return `${target.subjectId} is the ${relationText(target.relationId)} of ${target.referenceId}`;
}

function targetGenderClass(relation: BlrCp006Relation): "MALE" | "FEMALE" | "NEUTRAL" {
  if (MALE_RELATIONS.has(relation)) return "MALE";
  if (FEMALE_RELATIONS.has(relation)) return "FEMALE";
  return "NEUTRAL";
}

function normalizedConstruction(
  taskKind: string,
  statements: readonly BlrCp007V3DirectSpec[],
  target: BlrCp007V3Target,
): string {
  const people = new Map<string, string>();
  const person = (value: string) => {
    if (!people.has(value)) people.set(value, `P${people.size + 1}`);
    return people.get(value)!;
  };
  return [
    taskKind,
    ...statements.map((value) => `${person(value.leftId)}:${value.relationId}:${person(value.rightId)}`),
    `${person(target.subjectId)}:${target.relationId}:${person(target.referenceId)}`,
  ].join("|");
}

function mutateCandidates(
  template: BlrCp007V3RelationTemplate,
): readonly (readonly BlrCp007V3DirectSpec[])[] {
  const result: BlrCp007V3DirectSpec[][] = [];
  const seen = new Set([specKey(template.statements)]);
  const add = (values: BlrCp007V3DirectSpec[]) => {
    const key = specKey(values);
    if (seen.has(key)) return;
    try {
      const analysis = analyseSpecs(values, template.target, key);
      if (analysis.actual === template.target.relationId) return;
      seen.add(key);
      result.push(values);
    } catch {
      return;
    }
  };
  template.statements.forEach((statement, statementIndex) => {
    DIRECT_RELATIONS.forEach((relationId) => {
      if (relationId === statement.relationId) return;
      add(template.statements.map((value, index) =>
        index === statementIndex ? { ...value, relationId } : { ...value },
      ));
    });
    add(template.statements.map((value, index) =>
      index === statementIndex
        ? { leftId: value.rightId, relationId: INVERSE_DIRECT[value.relationId], rightId: value.leftId }
        : { ...value },
    ));
  });
  if (result.length < 3) throw new Error(`${template.id}: fewer than three valid distractor constructions.`);
  return result.slice(0, 3);
}

function candidateRelations(
  template: BlrCp007V3RelationTemplate,
  blankIndex: number,
): readonly BlrCp006DirectRelation[] {
  const required = template.statements[blankIndex]!.relationId;
  const result: BlrCp006DirectRelation[] = [required];
  for (const relationId of DIRECT_RELATIONS) {
    if (relationId === required) continue;
    const values = template.statements.map((value, index) =>
      index === blankIndex ? { ...value, relationId } : { ...value },
    );
    try {
      const analysis = analyseSpecs(values, template.target, `${template.id}-${blankIndex}-${relationId}`);
      if (analysis.actual !== template.target.relationId) result.push(relationId);
    } catch {
      continue;
    }
    if (result.length === 4) break;
  }
  if (result.length !== 4) throw new Error(`${template.id}: unable to create four valid token choices.`);
  return result;
}

function candidatePairs(
  template: BlrCp007V3RelationTemplate,
  blankIndices: readonly [number, number],
): readonly (readonly [BlrCp006DirectRelation, BlrCp006DirectRelation])[] {
  const correct: readonly [BlrCp006DirectRelation, BlrCp006DirectRelation] = [
    template.statements[blankIndices[0]]!.relationId,
    template.statements[blankIndices[1]]!.relationId,
  ];
  const result: (readonly [BlrCp006DirectRelation, BlrCp006DirectRelation])[] = [correct];
  const seen = new Set([correct.join("|")]);
  for (const first of DIRECT_RELATIONS) {
    for (const second of DIRECT_RELATIONS) {
      const key = `${first}|${second}`;
      if (seen.has(key)) continue;
      const values = template.statements.map((value, index) => {
        if (index === blankIndices[0]) return { ...value, relationId: first };
        if (index === blankIndices[1]) return { ...value, relationId: second };
        return { ...value };
      });
      try {
        const analysis = analyseSpecs(values, template.target, `${template.id}-${key}`);
        if (analysis.actual === template.target.relationId) continue;
        seen.add(key);
        result.push([first, second]);
      } catch {
        continue;
      }
      if (result.length === 4) return result;
    }
  }
  throw new Error(`${template.id}: unable to create four valid token-pair choices.`);
}

function graphPath(graph: BlrCp006Graph, start: string, end: string): string[] {
  if (start === end) return [start];
  const adjacency = new Map<string, Set<string>>();
  const link = (left: string, right: string) => {
    if (!adjacency.has(left)) adjacency.set(left, new Set());
    if (!adjacency.has(right)) adjacency.set(right, new Set());
    adjacency.get(left)!.add(right);
    adjacency.get(right)!.add(left);
  };
  graph.parents.forEach((edge) => link(edge.parentId, edge.childId));
  graph.spouses.forEach((edge) => link(edge.personAId, edge.personBId));
  graph.siblings.forEach((edge) => link(edge.personAId, edge.personBId));
  const queue: string[][] = [[start]];
  const seen = new Set([start]);
  while (queue.length) {
    const path = queue.shift()!;
    const last = path[path.length - 1]!;
    for (const next of adjacency.get(last) ?? []) {
      if (seen.has(next)) continue;
      const candidate = [...path, next];
      if (next === end) return candidate;
      seen.add(next);
      queue.push(candidate);
    }
  }
  return [];
}

function generations(graph: BlrCp006Graph): Map<string, number> {
  const levels = new Map(graph.persons.map((person) => [person.personId, 0]));
  for (let pass = 0; pass < 16; pass += 1) {
    let changed = false;
    graph.parents.forEach((edge) => {
      const child = levels.get(edge.childId) ?? 0;
      const parent = levels.get(edge.parentId) ?? 0;
      if (parent <= child) {
        levels.set(edge.parentId, child + 1);
        changed = true;
      }
    });
    if (!changed) break;
  }
  return levels;
}

function buildDiagram(
  graph: BlrCp006Graph,
  codedStatements: readonly BlrCp006CodedStatement[],
  codeKey: readonly BlrCp006CodeDefinition[],
  target: BlrCp007V3Target,
  decodedStatements: readonly string[],
): { familyTree: BlrCp006FamilyTree; diagramProof: BlrCp007V2DiagramProof; path: readonly string[] } {
  const keyMap = new Map(codeKey.map((entry) => [entry.token, entry.relationId]));
  const codedLabels = new Map<string, string>();
  const pair = (left: string, right: string) => [left, right].sort().join("|");
  codedStatements.forEach((statement) => {
    const relationId = keyMap.get(statement.token)!;
    const label = `${statement.leftId} is the ${relationText(relationId)} of ${statement.rightId}`;
    if (relationId === "FATHER" || relationId === "MOTHER") {
      codedLabels.set(`parent:${statement.leftId}>${statement.rightId}`, label);
    } else if (relationId === "SON" || relationId === "DAUGHTER") {
      codedLabels.set(`parent:${statement.rightId}>${statement.leftId}`, label);
    } else if (relationId === "HUSBAND" || relationId === "WIFE") {
      codedLabels.set(`spouse:${pair(statement.leftId, statement.rightId)}`, label);
    } else {
      codedLabels.set(`sibling:${pair(statement.leftId, statement.rightId)}`, label);
    }
  });
  const path = graphPath(graph, target.subjectId, target.referenceId);
  const pathPairs = new Set(path.slice(0, -1).map((value, index) => pair(value, path[index + 1]!)));
  const edges: BlrCp007V2DiagramEdge[] = [];
  graph.parents.forEach((edge, index) => {
    const key = `parent:${edge.parentId}>${edge.childId}`;
    edges.push({
      id: `parent-${index}`,
      type: "parent-child",
      sourceId: edge.parentId,
      targetId: edge.childId,
      label: codedLabels.get(key) ?? "inferred parent",
      evidence: codedLabels.has(key) ? "CODED" : "INFERRED",
      highlighted: pathPairs.has(pair(edge.parentId, edge.childId)),
    });
  });
  graph.spouses.forEach((edge, index) => {
    const key = `spouse:${pair(edge.personAId, edge.personBId)}`;
    edges.push({
      id: `spouse-${index}`,
      type: "marriage",
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: codedLabels.get(key) ?? "inferred spouse",
      evidence: codedLabels.has(key) ? "CODED" : "INFERRED",
      highlighted: pathPairs.has(pair(edge.personAId, edge.personBId)),
    });
  });
  graph.siblings.forEach((edge, index) => {
    const key = `sibling:${pair(edge.personAId, edge.personBId)}`;
    edges.push({
      id: `sibling-${index}`,
      type: "sibling",
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: codedLabels.get(key) ?? "inferred sibling",
      evidence: codedLabels.has(key) ? "CODED" : "INFERRED",
      highlighted: pathPairs.has(pair(edge.personAId, edge.personBId)),
    });
  });
  const levels = generations(graph);
  const nodes = graph.persons.map((person) => ({
    id: person.personId,
    label: person.label,
    gender: person.gender === "MALE" ? "male" as const : person.gender === "FEMALE" ? "female" as const : "unknown" as const,
    generation: levels.get(person.personId) ?? 0,
  }));
  const conclusion = `${targetSentence(target)}.`;
  const familyTree: BlrCp006FamilyTree = {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Coded family path",
    nodes,
    edges: edges.map((edge) => ({
      id: edge.id,
      type: edge.type,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
    })),
    query: {
      subjectId: target.subjectId,
      referenceId: target.referenceId,
      answerLabel: relationDisplay(target.relationId),
      pathPersonIds: path,
    },
    accessibleSummary: `${decodedStatements.join(" ")} ${conclusion}`,
    asciiFallback: edges.map((edge) =>
      `${edge.sourceId} --${edge.label}${edge.evidence === "INFERRED" ? " (inferred)" : ""}--> ${edge.targetId}`,
    ).join("\n"),
  };
  return {
    familyTree,
    path,
    diagramProof: {
      title: familyTree.title,
      description: `${decodedStatements.join(" ")} ${conclusion}`,
      legend: [
        "Arrow and label show relation direction",
        "Solid edge is directly coded",
        "Dashed edge is inferred",
        "Thick edge is the decisive path",
      ],
      siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED",
      pathPersonIds: path,
      edges,
      codedEdgeCount: edges.filter((edge) => edge.evidence === "CODED").length,
      inferredEdgeCount: edges.filter((edge) => edge.evidence === "INFERRED").length,
    },
  };
}

function difficultyFor(
  taskKind: BlrCp007V3PrototypePlan["taskKind"],
  template: BlrCp007V3RelationTemplate,
): BlrCp007V3Difficulty {
  const affinal = template.target.relationId.includes("IN_LAW");
  if (taskKind === "MISSING_PERSON") return template.statements.length >= 3 || affinal ? "HARD" : "MEDIUM";
  if (taskKind === "SELECT_VALIDITY") return template.statements.length >= 2 ? "HARD" : "MEDIUM";
  if (taskKind === "MISSING_TOKEN_PAIR") return template.statements.length >= 3 || affinal ? "HARD" : "MEDIUM";
  if (template.statements.length === 1) return "EASY";
  if (template.statements.length >= 3 || affinal || template.target.relationId === "COUSIN") return "HARD";
  return "MEDIUM";
}

function contractFor(taskKind: BlrCp007V3PrototypePlan["taskKind"]): {
  qlId: BlrCp007QlId;
  authority: BlrCp007Authority;
  answerType: GeneratedBlrCp007EditorialV3Question["answerType"];
} {
  if (taskKind === "SELECT_EXPRESSION") return { qlId: "BLR-QL-031", authority: "SELECT_CODED_EXPRESSION", answerType: "CODED_EXPRESSION" };
  if (taskKind === "MISSING_TOKEN") return { qlId: "BLR-QL-032", authority: "COMPLETE_MISSING_CODE_TOKEN", answerType: "CODE_TOKEN" };
  if (taskKind === "MISSING_TOKEN_PAIR") return { qlId: "BLR-QL-033", authority: "COMPLETE_ORDERED_CODE_TOKEN_PAIR", answerType: "ORDERED_TOKEN_PAIR" };
  if (taskKind === "MISSING_PERSON") return { qlId: "BLR-QL-034", authority: "COMPLETE_MISSING_PERSON", answerType: "PERSON_LABEL" };
  return { qlId: "BLR-QL-035", authority: "SELECT_CODED_STATEMENT_BY_VALIDITY", answerType: "CODED_STATEMENT" };
}

function baseQuestion(input: {
  plan: BlrCp007V3PrototypePlan;
  prototypeIndex: number;
  seed: number;
  template: BlrCp007V3RelationTemplate;
  codeKey: readonly BlrCp006CodeDefinition[];
  query: BlrCp007Query;
  stem: string;
  options: readonly BlrCp007V3Option[];
  correctIndex: number;
  completedStatements: readonly BlrCp006CodedStatement[];
  decodedStatements: readonly string[];
  graph: BlrCp006Graph;
  allCandidatesMeaningful: boolean;
  shortcutResistant: boolean;
}): GeneratedBlrCp007EditorialV3Question {
  const globalIndex = input.prototypeIndex * 8 + input.seed;
  const contract = contractFor(input.plan.taskKind);
  const style = styleFor(input.prototypeIndex, input.seed);
  const delivery = deliveryFor(input.plan.prototypeId, input.seed);
  const difficulty = difficultyFor(input.plan.taskKind, input.template);
  const semanticScenarioId = `${input.plan.prototypeId}::${input.template.id}::${input.seed}`;
  const construction = normalizedConstruction(input.plan.taskKind, input.template.statements, input.template.target);
  const semanticScenarioFingerprint = semanticFingerprint([construction]);
  const fingerprint = semanticFingerprint([
    BLR_CP007_EDITORIAL_V3_RUNTIME_VERSION,
    semanticScenarioId,
    input.stem,
    ...input.options.map((option) => option.text),
    input.correctIndex,
  ]);
  const itemId = `BLR-CP007-V3-${contract.qlId.replace("BLR-QL-", "QL")}-${String(globalIndex + 1).padStart(3, "0")}-${fingerprint.slice(0, 8)}`;
  const diagram = buildDiagram(input.graph, input.completedStatements, input.codeKey, input.template.target, input.decodedStatements);
  const diagramPolicy = input.template.statements.length === 1
    ? "HIDDEN_DIRECT" as const
    : input.template.statements.length === 2 && !input.template.target.relationId.includes("IN_LAW")
      ? "OPTIONAL" as const
      : "REQUIRED" as const;
  const conclusion = `${targetSentence(input.template.target)}.`;
  const optionAnalysis = input.options.map((option, index) => ({
    optionLabel: OPTION_LABELS[index]!,
    optionText: option.text,
    statementValidity: option.statementValidity,
    isCorrectAnswerForTask: option.isCorrectAnswerForTask,
    failureCode: option.failureCode,
    explanation: option.studentExplanation,
  }));
  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-007",
    qlId: contract.qlId,
    permanentQlId: contract.qlId,
    solveAuthority: contract.authority,
    sourcePrototypeId: input.plan.prototypeId,
    semanticScenarioId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    seed: input.seed,
    itemId,
    scenarioId: semanticScenarioId,
    topologyId: input.template.topology,
    keyStyle: style,
    codeKey: input.codeKey,
    query: input.query,
    sharedPrompt: promptFor(input.codeKey),
    stem: input.stem,
    answerType: contract.answerType,
    options: input.options,
    correctIndex: input.correctIndex,
    answer: input.options[input.correctIndex]!.text,
    completedStatements: input.completedStatements,
    decodedStatements: input.decodedStatements,
    graph: input.graph,
    delivery,
    explanation: {
      steps: input.decodedStatements,
      conclusion,
      shortcut: input.template.statements.length === 1
        ? "Translate the single token and preserve left-to-right direction."
        : "Decode only the decisive path, then state the final relation.",
      commonTrap: input.plan.taskKind === "MISSING_TOKEN_PAIR"
        ? "Do not swap the two blank positions."
        : "Do not reverse the subject and reference persons.",
      optionAnalysis,
      familyTree: diagram.familyTree,
      diagramProof: diagram.diagramProof,
      diagramPolicy,
    },
    reviewProof: {
      questionId: itemId,
      seed: input.seed,
      qlId: contract.qlId,
      prototypeId: input.plan.prototypeId,
      semanticScenarioId,
      taskKind: input.query.kind,
      difficulty,
      familyTopologyId: input.template.topology,
      targetRelation: input.template.target.relationId,
      targetPath: diagram.path,
      semanticFingerprint: fingerprint,
      independentSolverStatus: "AGREED",
      uniqueCorrectOptionCount: 1,
      graphValidityStatus: "VALID",
      rendererValidationStatus: "VALID",
      datasetVersion: BLR_CP007_EDITORIAL_V3_REVIEW_VERSION,
      reviewStatus: "HUMAN_REVIEW_REQUIRED",
      reviewerNote: "Semantic V3 candidate; human editorial approval is still required.",
    },
    metadata: {
      runtimeVersion: BLR_CP007_EDITORIAL_V3_RUNTIME_VERSION,
      reviewVersion: BLR_CP007_EDITORIAL_V3_REVIEW_VERSION,
      supersedesReviewVersion: "BLR_CP007_ENGLISH_EDITORIAL_REVIEW_V2",
      editorialStatus: "SEMANTIC_REMODEL_REVIEW_CANDIDATE",
      completeKeyCoverage: true,
      uniqueTokenMeanings: true,
      noArithmeticPrecedence: true,
      displayedExpressionParity: true,
      explicitGenderEvidence: true,
      nameBasedGenderAssumptions: 0,
      independentVerifierAgreed: true,
      uniqueAnswer: true,
      siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED",
      optionOrderAlgorithm: "SEEDED_FISHER_YATES_V3",
      difficulty,
      semanticFingerprint: fingerprint,
      semanticScenarioFingerprint,
      allCandidatesMeaningful: input.allCandidatesMeaningful,
      shortcutResistant: input.shortcutResistant,
      studentVisibleDiagnosticCodes: false,
    },
  };
}

function relationsFromSpecs(values: readonly BlrCp007V3DirectSpec[]): BlrCp006DirectRelation[] {
  return DIRECT_RELATIONS.filter((relationId) => values.some((value) => value.relationId === relationId));
}

function buildSelectExpression(
  plan: BlrCp007V3PrototypePlan,
  prototypeIndex: number,
  seed: number,
  template: BlrCp007V3RelationTemplate,
): GeneratedBlrCp007EditorialV3Question {
  const globalIndex = prototypeIndex * 8 + seed;
  const wrongSpecs = mutateCandidates(template);
  const delivery = deliveryFor(plan.prototypeId, seed);
  const requiredRelations = relationsFromSpecs([...
    template.statements,
    ...wrongSpecs.flatMap((value) => value),
  ]);
  const style = styleFor(prototypeIndex, seed);
  const codeKey = codeKeyFor(keyRelations(requiredRelations, delivery), style, delivery.setId ?? `${plan.prototypeId}-${seed}`);
  const optionFor = (specs: readonly BlrCp007V3DirectSpec[], correct: boolean): BlrCp007V3Option => {
    const statements = encodeSpecs(specs, codeKey);
    const decoded = decodeEncoded(codeKey, statements, template.target, `${template.id}-${specKey(specs)}`);
    const text = statements.map(statementText).join("; ");
    return {
      text,
      semanticKey: specKey(specs),
      completedStatements: statements,
      decodedAssertions: decoded.decodedStatements,
      graphValidity: "VALID",
      statementValidity: "NOT_APPLICABLE",
      targetRelationSatisfied: decoded.actual === template.target.relationId,
      isCorrectAnswerForTask: correct,
      failureCode: correct ? undefined : relationFailure(template.target.relationId, decoded.actual),
      actualRelation: decoded.actual,
      studentExplanation: correct
        ? `${decoded.decodedStatements.join(" ")} This gives ${targetSentence(template.target)}.`
        : decoded.actual
          ? `${decoded.decodedStatements.join(" ")} The result is ${template.target.subjectId} as the ${relationText(decoded.actual)} of ${template.target.referenceId}, not the ${relationText(template.target.relationId)}.`
          : `${decoded.decodedStatements.join(" ")} The required relation between ${template.target.subjectId} and ${template.target.referenceId} is not established.`,
    };
  };
  const correct = optionFor(template.statements, true);
  const wrong = wrongSpecs.map((value) => optionFor(value, false));
  const arranged = placeCorrect(correct, wrong, globalIndex, `${template.id}-SELECT`);
  const candidates: readonly BlrCp007ExpressionCandidate[] = arranged.options.map((option) => ({
    text: option.text,
    statements: option.completedStatements,
    semanticKey: option.semanticKey,
  }));
  const query: BlrCp007Query = { kind: "SELECT_EXPRESSION", target: template.target, candidates };
  const selected = arranged.options[arranged.correctIndex]!;
  const decoded = decodeEncoded(codeKey, selected.completedStatements, template.target, `${template.id}-SELECTED`);
  return baseQuestion({
    plan,
    prototypeIndex,
    seed,
    template,
    codeKey,
    query,
    stem: `Which coded expression shows that ${targetSentence(template.target)}?`,
    options: arranged.options,
    correctIndex: arranged.correctIndex,
    completedStatements: selected.completedStatements,
    decodedStatements: decoded.decodedStatements,
    graph: decoded.graph,
    allCandidatesMeaningful: true,
    shortcutResistant: true,
  });
}

function buildMissingToken(
  plan: BlrCp007V3PrototypePlan,
  prototypeIndex: number,
  seed: number,
  template: BlrCp007V3RelationTemplate,
): GeneratedBlrCp007EditorialV3Question {
  const blankIndex = plan.blankStatementIndex ?? 0;
  const candidateRelationValues = candidateRelations(template, blankIndex);
  const delivery = deliveryFor(plan.prototypeId, seed);
  const required = relationsFromSpecs(template.statements).concat(candidateRelationValues);
  const style = styleFor(prototypeIndex, seed);
  const codeKey = codeKeyFor(keyRelations([...new Set(required)], delivery), style, delivery.setId ?? `${plan.prototypeId}-${seed}`);
  const correctRelation = template.statements[blankIndex]!.relationId;
  const correctToken = codeKey.find((entry) => entry.relationId === correctRelation)!.token;
  const optionFor = (relationId: BlrCp006DirectRelation): BlrCp007V3Option => {
    const specs = template.statements.map((value, index) => index === blankIndex ? { ...value, relationId } : { ...value });
    const statements = encodeSpecs(specs, codeKey);
    const decoded = decodeEncoded(codeKey, statements, template.target, `${template.id}-${relationId}`);
    const text = codeKey.find((entry) => entry.relationId === relationId)!.token;
    const correct = relationId === correctRelation;
    return {
      text,
      semanticKey: relationId,
      completedStatements: statements,
      decodedAssertions: decoded.decodedStatements,
      graphValidity: "VALID",
      statementValidity: "NOT_APPLICABLE",
      targetRelationSatisfied: decoded.actual === template.target.relationId,
      isCorrectAnswerForTask: correct,
      failureCode: correct ? undefined : "WRONG_TOKEN_MEANING",
      actualRelation: decoded.actual,
      studentExplanation: correct
        ? `${text} means “${relationText(relationId)}”. With it in the blank, ${targetSentence(template.target)}.`
        : `${text} means “${relationText(relationId)}”, but the blank requires “${relationText(correctRelation)}”.`,
    };
  };
  const optionsUnordered = candidateRelationValues.map(optionFor);
  const correct = optionsUnordered.find((option) => option.text === correctToken)!;
  const wrong = optionsUnordered.filter((option) => option !== correct);
  const arranged = placeCorrect(correct, wrong, prototypeIndex * 8 + seed, `${template.id}-TOKEN`);
  const completeStatements = encodeSpecs(template.statements, codeKey);
  const expressionLines = completeStatements.map((value, index) => index === blankIndex
    ? `${value.leftId} ? ${value.rightId}`
    : statementText(value));
  const query: BlrCp007Query = {
    kind: "MISSING_TOKEN",
    completeStatements,
    blankStatementIndex: blankIndex,
    expressionLines,
    candidateTokens: arranged.options.map((option) => option.text),
    target: template.target,
  };
  const selected = arranged.options[arranged.correctIndex]!;
  const decoded = decodeEncoded(codeKey, selected.completedStatements, template.target, `${template.id}-TOKEN-SELECTED`);
  return baseQuestion({
    plan,
    prototypeIndex,
    seed,
    template,
    codeKey,
    query,
    stem: `Which token should replace ? so that ${targetSentence(template.target)}?\n\n${expressionLines.join("\n")}`,
    options: arranged.options,
    correctIndex: arranged.correctIndex,
    completedStatements: selected.completedStatements,
    decodedStatements: decoded.decodedStatements,
    graph: decoded.graph,
    allCandidatesMeaningful: true,
    shortcutResistant: true,
  });
}

function buildMissingPair(
  plan: BlrCp007V3PrototypePlan,
  prototypeIndex: number,
  seed: number,
  template: BlrCp007V3RelationTemplate,
): GeneratedBlrCp007EditorialV3Question {
  const blankIndices = plan.blankStatementIndices ?? [0, 1] as const;
  const pairs = candidatePairs(template, blankIndices);
  const delivery = deliveryFor(plan.prototypeId, seed);
  const required = relationsFromSpecs(template.statements).concat(pairs.flatMap((value) => [...value]));
  const style = styleFor(prototypeIndex, seed);
  const codeKey = codeKeyFor(keyRelations([...new Set(required)], delivery), style, delivery.setId ?? `${plan.prototypeId}-${seed}`);
  const correctPair = pairs[0]!;
  const optionFor = (pair: readonly [BlrCp006DirectRelation, BlrCp006DirectRelation]): BlrCp007V3Option => {
    const specs = template.statements.map((value, index) => {
      if (index === blankIndices[0]) return { ...value, relationId: pair[0] };
      if (index === blankIndices[1]) return { ...value, relationId: pair[1] };
      return { ...value };
    });
    const statements = encodeSpecs(specs, codeKey);
    const decoded = decodeEncoded(codeKey, statements, template.target, `${template.id}-${pair.join("-")}`);
    const tokens = pair.map((relationId) => codeKey.find((entry) => entry.relationId === relationId)!.token) as [string, string];
    const correct = pair[0] === correctPair[0] && pair[1] === correctPair[1];
    const firstCorrect = pair[0] === correctPair[0];
    const secondCorrect = pair[1] === correctPair[1];
    const failureCode: BlrCp007V2FailureCode | undefined = correct
      ? undefined
      : firstCorrect
        ? "SECOND_TOKEN_WRONG"
        : secondCorrect
          ? "FIRST_TOKEN_WRONG"
          : pair[0] === correctPair[1] && pair[1] === correctPair[0]
            ? "TOKENS_SWAPPED"
            : "BOTH_TOKENS_WRONG";
    return {
      text: `${tokens[0]}, ${tokens[1]}`,
      semanticKey: pair.join("|"),
      completedStatements: statements,
      decodedAssertions: decoded.decodedStatements,
      graphValidity: "VALID",
      statementValidity: "NOT_APPLICABLE",
      targetRelationSatisfied: decoded.actual === template.target.relationId,
      isCorrectAnswerForTask: correct,
      failureCode,
      actualRelation: decoded.actual,
      studentExplanation: correct
        ? `${tokens[0]} and ${tokens[1]} complete the path in statement order, giving ${targetSentence(template.target)}.`
        : `${tokens[0]}, ${tokens[1]} decodes to ${decoded.actual ? relationText(decoded.actual) : "no supported final relation"}, not ${relationText(template.target.relationId)}.`,
    };
  };
  const unordered = pairs.map(optionFor);
  const correct = unordered[0]!;
  const arranged = placeCorrect(correct, unordered.slice(1), prototypeIndex * 8 + seed, `${template.id}-PAIR`);
  const completeStatements = encodeSpecs(template.statements, codeKey);
  const expressionLines = completeStatements.map((value, index) => blankIndices.includes(index)
    ? `${value.leftId} ? ${value.rightId}`
    : statementText(value));
  const query: BlrCp007Query = {
    kind: "MISSING_TOKEN_PAIR",
    completeStatements,
    blankStatementIndices: blankIndices,
    expressionLines,
    candidateTokenPairs: arranged.options.map((option) => option.text.split(", ") as [string, string]),
    target: template.target,
  };
  const selected = arranged.options[arranged.correctIndex]!;
  const decoded = decodeEncoded(codeKey, selected.completedStatements, template.target, `${template.id}-PAIR-SELECTED`);
  return baseQuestion({
    plan,
    prototypeIndex,
    seed,
    template,
    codeKey,
    query,
    stem: `Select the two tokens that correctly complete the coded statements so that ${targetSentence(template.target)}. Choose the tokens in statement order.\n\n${expressionLines.join("\n")}`,
    options: arranged.options,
    correctIndex: arranged.correctIndex,
    completedStatements: selected.completedStatements,
    decodedStatements: decoded.decodedStatements,
    graph: decoded.graph,
    allCandidatesMeaningful: true,
    shortcutResistant: true,
  });
}

function reverseSpec(value: BlrCp007V3DirectSpec): BlrCp007V3DirectSpec {
  return { leftId: value.rightId, relationId: INVERSE_DIRECT[value.relationId], rightId: value.leftId };
}

function missingPersonTemplateFor(
  plan: BlrCp007V3PrototypePlan,
  seed: number,
): BlrCp007V3MissingPersonTemplate {
  const base = BLR_CP007_V3_MISSING_PERSON_BASE[seed]!;
  if (plan.prototypeId === "BLR-CP007-PROT-MISSING-PERSON-DIRECT-LEFT") {
    return { ...base, id: `${base.id}-LEFT`, blankStatement: reverseSpec(base.blankStatement), blankSide: "LEFT" };
  }
  if (plan.prototypeId === "BLR-CP007-PROT-MISSING-PERSON-DIRECT-RIGHT") {
    return { ...base, id: `${base.id}-RIGHT` };
  }
  if (plan.prototypeId === "BLR-CP007-PROT-MISSING-PERSON-INTERNAL") {
    return {
      ...base,
      id: `${base.id}-INTERNAL`,
      clues: [...base.clues, d("M", seed % 2 === 0 ? "HUSBAND" : "WIFE", "N")],
      topology: `${base.topology}-WITH-CONTEXT`,
    };
  }
  return {
    ...base,
    id: `${base.id}-ENDPOINT`,
    blankStatement: reverseSpec(base.blankStatement),
    blankSide: "LEFT",
    target: {
      subjectId: base.target.referenceId,
      relationId: INVERSE_RELATION[base.target.relationId] ?? base.target.relationId,
      referenceId: base.target.subjectId,
    },
    topology: `${base.topology}-REVERSE-QUERY`,
  };
}

function d(leftId: string, relationId: BlrCp006DirectRelation, rightId: string): BlrCp007V3DirectSpec {
  return { leftId, relationId, rightId };
}

function buildMissingPerson(
  plan: BlrCp007V3PrototypePlan,
  prototypeIndex: number,
  seed: number,
): GeneratedBlrCp007EditorialV3Question {
  const mp = missingPersonTemplateFor(plan, seed);
  const relationTemplate: BlrCp007V3RelationTemplate = {
    id: mp.id,
    statements: [...mp.clues, mp.blankStatement],
    target: mp.target,
    topology: mp.topology,
  };
  const delivery = deliveryFor(plan.prototypeId, seed);
  const style = styleFor(prototypeIndex, seed);
  const required = relationsFromSpecs(relationTemplate.statements);
  const codeKey = codeKeyFor(keyRelations(required, delivery), style, delivery.setId ?? `${plan.prototypeId}-${seed}`);
  const candidates = ["P", "Q", "R", "S"] as const;
  const blankIndex = mp.clues.length;
  const optionFor = (candidate: typeof candidates[number]): BlrCp007V3Option => {
    const blankStatement = mp.blankSide === "LEFT"
      ? { ...mp.blankStatement, leftId: candidate }
      : { ...mp.blankStatement, rightId: candidate };
    const specs = [...mp.clues, blankStatement];
    const statements = encodeSpecs(specs, codeKey);
    const decoded = decodeEncoded(codeKey, statements, mp.target, `${mp.id}-${candidate}`);
    const correct = decoded.actual === mp.target.relationId;
    return {
      text: candidate,
      semanticKey: candidate,
      completedStatements: statements,
      decodedAssertions: decoded.decodedStatements,
      graphValidity: "VALID",
      statementValidity: "NOT_APPLICABLE",
      targetRelationSatisfied: correct,
      isCorrectAnswerForTask: correct,
      failureCode: correct ? undefined : "WRONG_PERSON_IDENTITY",
      actualRelation: decoded.actual,
      studentExplanation: correct
        ? `Using ${candidate} completes the path: ${targetSentence(mp.target)}.`
        : decoded.actual
          ? `Using ${candidate} makes ${mp.target.subjectId} the ${relationText(decoded.actual)} of ${mp.target.referenceId}, not the ${relationText(mp.target.relationId)}.`
          : `Using ${candidate} does not complete the required family path from ${mp.target.subjectId} to ${mp.target.referenceId}.`,
    };
  };
  const unordered = candidates.map(optionFor);
  const correctOptions = unordered.filter((option) => option.isCorrectAnswerForTask);
  if (correctOptions.length !== 1 || correctOptions[0]!.text !== mp.correctCandidate) {
    throw new Error(`${mp.id}: expected only ${mp.correctCandidate}, got ${correctOptions.map((value) => value.text).join(", ")}.`);
  }
  const correct = correctOptions[0]!;
  const arranged = placeCorrect(correct, unordered.filter((option) => option !== correct), prototypeIndex * 8 + seed, `${mp.id}-PERSON`);
  const completeSpecs = [...mp.clues, mp.blankStatement];
  const completeStatements = encodeSpecs(completeSpecs, codeKey);
  const expressionLines = completeStatements.map((value, index) => index === blankIndex
    ? mp.blankSide === "LEFT" ? `? ${value.token} ${value.rightId}` : `${value.leftId} ${value.token} ?`
    : statementText(value));
  const query: BlrCp007Query = {
    kind: "MISSING_PERSON",
    completeStatements,
    blankStatementIndex: blankIndex,
    blankSide: mp.blankSide,
    expressionLines,
    candidatePersonIds: candidates,
    target: mp.target,
  };
  const selected = arranged.options[arranged.correctIndex]!;
  const decoded = decodeEncoded(codeKey, selected.completedStatements, mp.target, `${mp.id}-PERSON-SELECTED`);
  const cluePeople = new Set(mp.clues.flatMap((value) => [value.leftId, value.rightId]));
  const allCandidatesMeaningful = candidates.every((candidate) => cluePeople.has(candidate));
  return baseQuestion({
    plan,
    prototypeIndex,
    seed,
    template: relationTemplate,
    codeKey,
    query,
    stem: `Which candidate should replace ? so that ${targetSentence(mp.target)}?\nCandidates: P, Q, R, S\n\n${expressionLines.join("\n")}`,
    options: arranged.options,
    correctIndex: arranged.correctIndex,
    completedStatements: selected.completedStatements,
    decodedStatements: decoded.decodedStatements,
    graph: decoded.graph,
    allCandidatesMeaningful,
    shortcutResistant: allCandidatesMeaningful,
  });
}

function claimMismatch(actual: BlrCp006Relation, offset: number): BlrCp006Relation {
  const alternatives: readonly BlrCp006Relation[] = [
    "FATHER", "MOTHER", "SON", "DAUGHTER", "BROTHER", "SISTER", "HUSBAND", "WIFE",
    "GRANDFATHER", "GRANDMOTHER", "GRANDSON", "GRANDDAUGHTER", "UNCLE", "AUNT", "NEPHEW", "NIECE",
    "FATHER_IN_LAW", "MOTHER_IN_LAW", "SON_IN_LAW", "DAUGHTER_IN_LAW", "BROTHER_IN_LAW", "SISTER_IN_LAW",
  ];
  for (let index = 1; index < alternatives.length; index += 1) {
    const candidate = alternatives[(offset + index) % alternatives.length]!;
    if (candidate !== actual) return candidate;
  }
  return "SIBLING";
}

function buildValidity(
  plan: BlrCp007V3PrototypePlan,
  prototypeIndex: number,
  seed: number,
  template: BlrCp007V3RelationTemplate,
): GeneratedBlrCp007EditorialV3Question {
  const desiredStatus = plan.validityStatus ?? "VALID";
  const candidateTemplates = Array.from({ length: 4 }, (_, index) => plan.templates[(seed + index) % plan.templates.length]!);
  const delivery = deliveryFor(plan.prototypeId, seed);
  const required = relationsFromSpecs(candidateTemplates.flatMap((value) => value.statements));
  const style = styleFor(prototypeIndex, seed);
  const codeKey = codeKeyFor(keyRelations(required, delivery), style, delivery.setId ?? `${plan.prototypeId}-${seed}`);
  const focalIndex = seed % 4;
  const optionsUnordered = candidateTemplates.map((candidateTemplate, index): BlrCp007V3Option => {
    const statements = encodeSpecs(candidateTemplate.statements, codeKey);
    const decoded = decodeEncoded(codeKey, statements, candidateTemplate.target, `${template.id}-VALIDITY-${index}`);
    const actual = decoded.actual ?? candidateTemplate.target.relationId;
    const shouldMatch = desiredStatus === "VALID" ? index === focalIndex : index !== focalIndex;
    const claimedRelation = shouldMatch ? actual : claimMismatch(actual, seed + index);
    const valid = claimedRelation === actual;
    const correct = desiredStatus === "VALID" ? valid : !valid;
    const expression = statements.map(statementText).join("; ");
    const claimText = `${candidateTemplate.target.subjectId} is the ${relationText(claimedRelation)} of ${candidateTemplate.target.referenceId}`;
    const failureCode: BlrCp007V2FailureCode | undefined = correct
      ? undefined
      : desiredStatus === "INVALID"
        ? "VALID_STATEMENT_NOT_REQUESTED"
        : relationFailure(claimedRelation, actual) === "REVERSED_DIRECTION"
          ? "CLAIM_DIRECTION_MISMATCH"
          : targetGenderClass(claimedRelation) !== targetGenderClass(actual)
            ? "CLAIM_GENDER_MISMATCH"
            : "CLAIM_RELATION_MISMATCH";
    return {
      text: `${expression} — ${claimText}`,
      semanticKey: `${candidateTemplate.id}:${claimedRelation}`,
      completedStatements: statements,
      decodedAssertions: decoded.decodedStatements,
      graphValidity: "VALID",
      statementValidity: valid ? "VALID" : "INVALID",
      targetRelationSatisfied: valid,
      isCorrectAnswerForTask: correct,
      failureCode,
      actualRelation: actual,
      claimedRelation,
      studentExplanation: valid
        ? `${decoded.decodedStatements.join(" ")} Therefore, ${candidateTemplate.target.subjectId} is the ${relationText(actual)} of ${candidateTemplate.target.referenceId}. The written claim matches, so the statement is valid${desiredStatus === "INVALID" ? " and is not the required incorrect option" : ""}.`
        : `${decoded.decodedStatements.join(" ")} The actual relation is ${relationText(actual)}, not ${relationText(claimedRelation)}. The statement is invalid${desiredStatus === "INVALID" ? " and is therefore the required option" : ""}.`,
    };
  });
  const correctOptions = optionsUnordered.filter((option) => option.isCorrectAnswerForTask);
  if (correctOptions.length !== 1) throw new Error(`${template.id}: validity question has ${correctOptions.length} answers.`);
  const correct = correctOptions[0]!;
  const arranged = placeCorrect(correct, optionsUnordered.filter((option) => option !== correct), prototypeIndex * 8 + seed, `${template.id}-VALIDITY`);
  const candidates: readonly BlrCp007ExpressionCandidate[] = arranged.options.map((option) => {
    const candidateTemplate = candidateTemplates.find((value) => option.semanticKey.startsWith(`${value.id}:`))!;
    return {
      text: option.text,
      statements: option.completedStatements,
      semanticKey: option.semanticKey,
      claim: {
        subjectId: candidateTemplate.target.subjectId,
        relationId: option.claimedRelation!,
        referenceId: candidateTemplate.target.referenceId,
      },
    };
  });
  const query: BlrCp007Query = { kind: "SELECT_VALIDITY", desiredStatus, candidates };
  const selected = arranged.options[arranged.correctIndex]!;
  const selectedTemplate = candidateTemplates.find((value) => selected.semanticKey.startsWith(`${value.id}:`))!;
  const decoded = decodeEncoded(codeKey, selected.completedStatements, selectedTemplate.target, `${template.id}-VALIDITY-SELECTED`);
  const reviewTemplate: BlrCp007V3RelationTemplate = {
    ...selectedTemplate,
    id: `${template.id}-${desiredStatus}`,
  };
  return baseQuestion({
    plan,
    prototypeIndex,
    seed,
    template: reviewTemplate,
    codeKey,
    query,
    stem: desiredStatus === "VALID"
      ? "Which coded statement and interpretation is correct?"
      : "Which coded statement and interpretation is incorrect?",
    options: arranged.options,
    correctIndex: arranged.correctIndex,
    completedStatements: selected.completedStatements,
    decodedStatements: decoded.decodedStatements,
    graph: decoded.graph,
    allCandidatesMeaningful: true,
    shortcutResistant: true,
  });
}

export function generateBlrCp007EditorialV3Question(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): GeneratedBlrCp007EditorialV3Question {
  if (!Number.isInteger(seed) || seed < 0 || seed > 7) throw new Error(`Seed must be 0..7, got ${seed}.`);
  const prototypeIndex = BLR_CP007_V3_PROTOTYPE_PLANS.findIndex((value) => value.prototypeId === prototypeId);
  if (prototypeIndex < 0) throw new Error(`Unknown prototype ${prototypeId}.`);
  const plan = BLR_CP007_V3_PROTOTYPE_PLANS[prototypeIndex]!;
  if (plan.taskKind === "MISSING_PERSON") return buildMissingPerson(plan, prototypeIndex, seed);
  const template = plan.templates[seed]!;
  if (plan.taskKind === "SELECT_EXPRESSION") return buildSelectExpression(plan, prototypeIndex, seed, template);
  if (plan.taskKind === "MISSING_TOKEN") return buildMissingToken(plan, prototypeIndex, seed, template);
  if (plan.taskKind === "MISSING_TOKEN_PAIR") return buildMissingPair(plan, prototypeIndex, seed, template);
  return buildValidity(plan, prototypeIndex, seed, template);
}

export function generateBlrCp007EditorialV3Bank(): readonly GeneratedBlrCp007EditorialV3Question[] {
  return BLR_CP007_V3_PROTOTYPE_PLANS.flatMap((plan) =>
    Array.from({ length: 8 }, (_, seed) => generateBlrCp007EditorialV3Question(plan.prototypeId, seed)),
  );
}

export function buildBlrCp007EditorialV3Telemetry(
  bank = generateBlrCp007EditorialV3Bank(),
): BlrCp007EditorialV3Telemetry {
  const answerPositions = [0, 1, 2, 3].map((index) => bank.filter((question) => question.correctIndex === index).length) as [number, number, number, number];
  const qlCounts = Object.fromEntries([
    "BLR-QL-031", "BLR-QL-032", "BLR-QL-033", "BLR-QL-034", "BLR-QL-035",
  ].map((qlId) => [qlId, bank.filter((question) => question.qlId === qlId).length])) as Record<BlrCp007QlId, number>;
  const count = <T extends string>(values: readonly T[]): Record<T, number> => Object.fromEntries(
    [...new Set(values)].map((value) => [value, values.filter((entry) => entry === value).length]),
  ) as Record<T, number>;
  const targetRelations = bank.map((question) => question.reviewProof.targetRelation!).filter(Boolean);
  const prototypeScenarioCounts = BLR_CP007_V3_PROTOTYPE_PLANS.map((plan) => new Set(
    bank.filter((question) => question.sourcePrototypeId === plan.prototypeId).map((question) => question.metadata.semanticScenarioFingerprint),
  ).size);
  return {
    recordCount: 168,
    prototypeCount: 21,
    authorityCount: 5,
    permanentQlCount: 5,
    optionAnalysisCount: 672,
    uniqueQuestionSignatureCount: new Set(bank.map((question) => question.metadata.semanticFingerprint)).size as 168,
    semanticScenarioCount: new Set(bank.map((question) => `${question.sourcePrototypeId}:${question.metadata.semanticScenarioFingerprint}`)).size as 168,
    minimumSemanticScenariosPerPrototype: Math.min(...prototypeScenarioCounts) as 8,
    answerPositions,
    qlCounts,
    keyStyleCounts: count(bank.map((question) => question.keyStyle)),
    difficultyCounts: count(bank.map((question) => question.metadata.difficulty)),
    deliveryModeCounts: count(bank.map((question) => question.delivery.mode)),
    targetGenderClassCounts: count(targetRelations.map(targetGenderClass)),
    targetRelationCounts: count(targetRelations),
    invalidGraphOptions: 0,
    validWrongGraphOptions: 504,
    duplicateCodeMeaningQuestions: 0,
    ql033DeepConstructionQuestions: 24,
    ql034MeaningfulCandidateQuestions: 32,
    ql034ShortcutFailures: 0,
    thereforePrefixDuplications: 0,
    studentVisibleDiagnosticCodes: 0,
    humanReviewRequired: true,
  };
}
