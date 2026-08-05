import { decodeScenario, relationOf } from "../BLR-CP-006/cp006-graph";
import {
  relationDisplay,
  type BlrCp006CodedStatement,
  type BlrCp006DirectRelation,
  type BlrCp006FamilyTree,
  type BlrCp006Graph,
  type BlrCp006Relation,
  type BlrCp006Scenario,
} from "../BLR-CP-006/cp006-model";
import {
  semanticFingerprint,
  type BlrCp007PrototypeId,
} from "./cp007-model";
import {
  buildBlrCp007EditorialV2ReviewTelemetry,
  generateBlrCp007EditorialV2ReviewQuestion,
} from "./cp007-editorial-v2-review";
import type {
  BlrCp007EditorialV2Telemetry,
  BlrCp007V2DiagramEdge,
  BlrCp007V2DiagramProof,
  GeneratedBlrCp007EditorialV2Question,
} from "./cp007-editorial-v2-model";
import { BLR_CP007_PROTOTYPES } from "./cp007-prototypes";

const CANDIDATE_LABELS = ["P", "Q", "R", "S"] as const;

function relationText(value: BlrCp006Relation | undefined): string {
  return value
    ? relationDisplay(value).toLocaleLowerCase("en-IN")
    : "relation not established";
}

function statementLine(value: BlrCp006CodedStatement): string {
  return `${value.leftId} ${value.token} ${value.rightId}`;
}

function pairKey(left: string, right: string): string {
  return [left, right].sort((a, b) => a.localeCompare(b, "en-IN")).join("|");
}

function decode(
  question: GeneratedBlrCp007EditorialV2Question,
  statements: readonly BlrCp006CodedStatement[],
  suffix: string,
): { graph: BlrCp006Graph; decodedStatements: readonly string[] } {
  const first = statements[0]!;
  const scenario: BlrCp006Scenario = {
    scenarioId: `${question.scenarioId}::FINAL-REVIEW::${suffix}`,
    topologyId: "CP007_EDITORIAL_V2_FINAL_REVIEW",
    keyStyle: question.keyStyle,
    codeKey: question.codeKey,
    statements,
    expressionLines: statements.map(statementLine),
    query: { kind: "RELATION", subjectId: first.leftId, referenceId: first.rightId },
    authority: "RESOLVE_CODED_RELATION",
    prototypeId: "BLR-CP006-PROT-DIRECT-FORWARD",
    qlId: "BLR-QL-026",
    stem: "Final review verification",
  };
  return decodeScenario(scenario);
}

function actualRelation(
  graph: BlrCp006Graph,
  subjectId: string,
  referenceId: string,
): BlrCp006Relation | undefined {
  try {
    return relationOf(graph, subjectId, referenceId);
  } catch {
    return undefined;
  }
}

function generations(graph: BlrCp006Graph): Map<string, number> {
  const result = new Map(graph.persons.map((person) => [person.personId, 0]));
  for (let pass = 0; pass < 24; pass += 1) {
    let changed = false;
    for (const edge of graph.parents) {
      const child = result.get(edge.childId) ?? 0;
      const parent = result.get(edge.parentId) ?? 0;
      if (parent <= child) {
        result.set(edge.parentId, child + 1);
        changed = true;
      }
    }
    for (const edge of [...graph.spouses, ...graph.siblings]) {
      const level = Math.max(result.get(edge.personAId) ?? 0, result.get(edge.personBId) ?? 0);
      if ((result.get(edge.personAId) ?? 0) !== level) {
        result.set(edge.personAId, level);
        changed = true;
      }
      if ((result.get(edge.personBId) ?? 0) !== level) {
        result.set(edge.personBId, level);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return result;
}

function graphPath(graph: BlrCp006Graph, start?: string, end?: string): string[] {
  if (!start || !end || start === end) return start ? [start] : [];
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

function directPrimitive(input: {
  statement: BlrCp006CodedStatement;
  relationId: BlrCp006DirectRelation;
}): { key: string; label: string } {
  const { statement, relationId } = input;
  const label = `${statement.leftId} is the ${relationText(relationId)} of ${statement.rightId}`;
  if (relationId === "FATHER" || relationId === "MOTHER") {
    return { key: `parent:${statement.leftId}>${statement.rightId}`, label };
  }
  if (relationId === "SON" || relationId === "DAUGHTER") {
    return { key: `parent:${statement.rightId}>${statement.leftId}`, label };
  }
  if (relationId === "BROTHER" || relationId === "SISTER") {
    return { key: `sibling:${pairKey(statement.leftId, statement.rightId)}`, label };
  }
  return { key: `spouse:${pairKey(statement.leftId, statement.rightId)}`, label };
}

function buildDiagram(input: {
  question: GeneratedBlrCp007EditorialV2Question;
  graph: BlrCp006Graph;
  decodedStatements: readonly string[];
  completedStatements: readonly BlrCp006CodedStatement[];
}): { familyTree: BlrCp006FamilyTree; proof: BlrCp007V2DiagramProof } {
  if (input.question.query.kind !== "MISSING_PERSON") {
    throw new Error(`${input.question.itemId}: diagram rebuild requires QL-034.`);
  }
  const target = input.question.query.target;
  const path = graphPath(input.graph, target.subjectId, target.referenceId);
  const pathPairs = new Set(path.slice(0, -1).map((value, index) => pairKey(value, path[index + 1]!)));
  const direct = new Map<string, string>();
  input.completedStatements.forEach((statement) => {
    const relationId = input.question.codeKey.find((entry) => entry.token === statement.token)?.relationId;
    if (!relationId) return;
    const primitive = directPrimitive({ statement, relationId });
    direct.set(primitive.key, primitive.label);
  });
  const edges: BlrCp007V2DiagramEdge[] = [];
  input.graph.parents.forEach((edge, index) => {
    const key = `parent:${edge.parentId}>${edge.childId}`;
    edges.push({
      id: `parent-${index}`,
      type: "parent-child",
      sourceId: edge.parentId,
      targetId: edge.childId,
      label: direct.get(key) ?? "inferred parent",
      evidence: direct.has(key) ? "CODED" : "INFERRED",
      highlighted: pathPairs.has(pairKey(edge.parentId, edge.childId)),
    });
  });
  input.graph.spouses.forEach((edge, index) => {
    const key = `spouse:${pairKey(edge.personAId, edge.personBId)}`;
    edges.push({
      id: `marriage-${index}`,
      type: "marriage",
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: direct.get(key) ?? "inferred spouse",
      evidence: direct.has(key) ? "CODED" : "INFERRED",
      highlighted: pathPairs.has(pairKey(edge.personAId, edge.personBId)),
    });
  });
  input.graph.siblings.forEach((edge, index) => {
    const key = `sibling:${pairKey(edge.personAId, edge.personBId)}`;
    edges.push({
      id: `sibling-${index}`,
      type: "sibling",
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: direct.get(key) ?? "inferred sibling",
      evidence: direct.has(key) ? "CODED" : "INFERRED",
      highlighted: pathPairs.has(pairKey(edge.personAId, edge.personBId)),
    });
  });
  const levels = generations(input.graph);
  const nodes = input.graph.persons.map((person) => ({
    id: person.personId,
    label: person.label,
    gender: person.gender === "MALE"
      ? "male" as const
      : person.gender === "FEMALE"
        ? "female" as const
        : "unknown" as const,
    generation: levels.get(person.personId) ?? 0,
  }));
  const actual = actualRelation(input.graph, target.subjectId, target.referenceId);
  const conclusion = `${target.subjectId} is the ${relationText(actual)} of ${target.referenceId}.`;
  const description = input.decodedStatements.length === 1
    ? input.decodedStatements[0]!
    : `${input.decodedStatements.join(" ")} Therefore ${conclusion}`;
  const familyTree: BlrCp006FamilyTree = {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Completed coded family graph",
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
      answerLabel: actual ? relationDisplay(actual) : "Relation not established",
      pathPersonIds: path,
    },
    accessibleSummary: `${description} The graph contains ${nodes.length} people and ${edges.length} family ${edges.length === 1 ? "link" : "links"}.`,
    asciiFallback: edges.map((edge) =>
      `${edge.sourceId} --${edge.label}${edge.evidence === "INFERRED" ? " (inferred)" : ""}--> ${edge.targetId}`,
    ).join("\n"),
  };
  return {
    familyTree,
    proof: {
      title: familyTree.title,
      description,
      legend: [
        "Arrow/label: relation direction",
        "Solid edge: directly coded",
        "Dashed edge: inferred from the coded family graph",
        "Thick edge: decisive query path",
        "M/F/?: male, female or gender not established",
      ],
      siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED",
      pathPersonIds: path,
      edges,
      codedEdgeCount: edges.filter((edge) => edge.evidence === "CODED").length,
      inferredEdgeCount: edges.filter((edge) => edge.evidence === "INFERRED").length,
    },
  };
}

function dedupeSentences(value: string): string {
  const sentences = value.match(/[^.!?]+[.!?]?/g)?.map((entry) => entry.trim()).filter(Boolean) ?? [];
  const seen = new Set<string>();
  return sentences.filter((sentence) => {
    const key = sentence.replace(/[.!?]+$/, "").trim().toLocaleLowerCase("en-IN");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).join(" ");
}

function cleanDescription(
  question: GeneratedBlrCp007EditorialV2Question,
): GeneratedBlrCp007EditorialV2Question {
  const description = dedupeSentences(question.explanation.diagramProof.description);
  const familyTree = {
    ...question.explanation.familyTree,
    accessibleSummary: dedupeSentences(question.explanation.familyTree.accessibleSummary),
  };
  return {
    ...question,
    explanation: {
      ...question.explanation,
      familyTree,
      diagramProof: {
        ...question.explanation.diagramProof,
        description,
      },
    },
  };
}

function naturalizeMissingPerson(
  question: GeneratedBlrCp007EditorialV2Question,
): GeneratedBlrCp007EditorialV2Question {
  if (question.query.kind !== "MISSING_PERSON") return cleanDescription(question);
  const fixedStatementCount = question.query.completeStatements.length - CANDIDATE_LABELS.length;
  const completeStatements = question.query.completeStatements.slice(0, fixedStatementCount);
  const expressionLines = completeStatements.map((entry, index) => ({
    ...entry,
    leftId: index === question.query.blankStatementIndex && question.query.blankSide === "LEFT" ? "?" : entry.leftId,
    rightId: index === question.query.blankStatementIndex && question.query.blankSide === "RIGHT" ? "?" : entry.rightId,
  })).map(statementLine);
  const questionLine = question.stem.split("\n\n")[0]!;
  const stem = `${questionLine}\nCandidates: ${CANDIDATE_LABELS.join(", ")}\n\n${expressionLines.join("\n")}`;
  const query = { ...question.query, completeStatements, expressionLines };
  const options = question.options.map((option) => {
    const completedStatements = option.completedStatements.slice(0, fixedStatementCount);
    const decoded = decode(question, completedStatements, option.semanticKey);
    const actual = actualRelation(decoded.graph, query.target.subjectId, query.target.referenceId);
    const correct = actual === query.target.relationId;
    return {
      ...option,
      completedStatements,
      decodedAssertions: decoded.decodedStatements,
      graphValidity: "VALID" as const,
      targetRelationSatisfied: correct,
      isCorrectAnswerForTask: correct,
      actualRelation: actual,
      failureCode: correct ? undefined : "WRONG_PERSON_IDENTITY" as const,
      studentExplanation: correct
        ? `With ${option.text} in the blank, the coded path makes ${query.target.subjectId} the ${relationText(query.target.relationId)} of ${query.target.referenceId}.`
        : actual
          ? `With ${option.text} in the blank, ${query.target.subjectId} becomes the ${relationText(actual)} of ${query.target.referenceId}, not the ${relationText(query.target.relationId)}.`
          : `With ${option.text} in the blank, the required path from ${query.target.subjectId} to ${query.target.referenceId} is not completed.`,
    };
  });
  const correctIndex = options.findIndex((option) => option.isCorrectAnswerForTask);
  if (correctIndex < 0 || options.filter((option) => option.isCorrectAnswerForTask).length !== 1) {
    throw new Error(`${question.itemId}: naturalized QL-034 lost uniqueness.`);
  }
  const selected = options[correctIndex]!;
  const decoded = decode(question, selected.completedStatements, "NATURALIZED-SELECTED");
  const rebuilt = buildDiagram({
    question: { ...question, query },
    graph: decoded.graph,
    decodedStatements: decoded.decodedStatements,
    completedStatements: selected.completedStatements,
  });
  const fingerprint = semanticFingerprint([
    question.metadata.runtimeVersion,
    "FINAL-HUMAN-REVIEW",
    question.sourcePrototypeId,
    question.seed,
    stem,
    ...options.map((option) => option.text),
    correctIndex,
    ...selected.completedStatements.flatMap((entry) => [entry.leftId, entry.token, entry.rightId]),
  ]);
  const itemId = `${question.itemId.split("-H")[0]}-F${fingerprint.slice(0, 8)}`;
  return {
    ...question,
    itemId,
    query,
    stem,
    options,
    correctIndex,
    answer: selected.text,
    completedStatements: selected.completedStatements,
    decodedStatements: selected.decodedAssertions,
    graph: decoded.graph,
    explanation: {
      ...question.explanation,
      steps: [
        `Substitute ${selected.text} for the question mark.`,
        ...selected.decodedAssertions,
      ],
      commonTrap: "Test each of P, Q, R and S in the same blank; do not change any fixed coded link.",
      optionAnalysis: options.map((option, index) => ({
        optionLabel: ["A", "B", "C", "D"][index] as "A" | "B" | "C" | "D",
        optionText: option.text,
        statementValidity: option.statementValidity,
        isCorrectAnswerForTask: option.isCorrectAnswerForTask,
        failureCode: option.failureCode,
        explanation: option.studentExplanation,
      })),
      familyTree: rebuilt.familyTree,
      diagramProof: rebuilt.proof,
    },
    reviewProof: {
      ...question.reviewProof,
      questionId: itemId,
      targetPath: rebuilt.proof.pathPersonIds,
      semanticFingerprint: fingerprint,
    },
    metadata: {
      ...question.metadata,
      semanticFingerprint: fingerprint,
    },
  };
}

export function generateBlrCp007EditorialV2FinalReviewQuestion(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): GeneratedBlrCp007EditorialV2Question {
  return naturalizeMissingPerson(
    generateBlrCp007EditorialV2ReviewQuestion(prototypeId, seed),
  );
}

export function generateBlrCp007EditorialV2FinalReviewBank(): readonly GeneratedBlrCp007EditorialV2Question[] {
  return BLR_CP007_PROTOTYPES.flatMap((prototype) =>
    Array.from({ length: 8 }, (_, seed) =>
      generateBlrCp007EditorialV2FinalReviewQuestion(prototype.prototypeId, seed),
    ),
  );
}

export function buildBlrCp007EditorialV2FinalReviewTelemetry(
  bank = generateBlrCp007EditorialV2FinalReviewBank(),
): BlrCp007EditorialV2Telemetry {
  return buildBlrCp007EditorialV2ReviewTelemetry(bank);
}
