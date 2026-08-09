import type {
  BlrCp006CodedStatement,
  BlrCp006FamilyTree,
  BlrCp006Graph,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007V2DiagramEdge, BlrCp007V2DiagramProof } from "./cp007-editorial-v2-model";
import type { BlrCp007V3Option } from "./cp007-editorial-v3-model";
import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";
import { remodelQl034 as remodelQl034Base } from "./cp007-editorial-v4-wave3-ql034";
import {
  CANDIDATES,
  OPTION_LABELS,
  evaluate,
  fingerprint,
  relationText,
  statementText,
  targetSentence,
  tokenFor,
  type DirectSpec,
  type Target,
} from "./cp007-editorial-v4-wave3-core";

const OLD_CONTEXT_PEOPLE = new Set(["U", "V", "W", "T"]);

function codedContext(
  codeKey: GeneratedBlrCp007EditorialV4Question["codeKey"],
  correct: "P" | "Q" | "R" | "S",
  gender: "MALE" | "FEMALE",
): readonly BlrCp006CodedStatement[] {
  const [x, y, z] = CANDIDATES.filter((candidate) => candidate !== correct) as [
    "P" | "Q" | "R" | "S",
    "P" | "Q" | "R" | "S",
    "P" | "Q" | "R" | "S",
  ];
  const specs: readonly DirectSpec[] = gender === "MALE"
    ? [
      { leftId: correct, relationId: "SON", rightId: "U" },
      { leftId: x, relationId: "HUSBAND", rightId: "U" },
      { leftId: y, relationId: "BROTHER", rightId: x },
      { leftId: z, relationId: "SON", rightId: y },
    ]
    : [
      { leftId: correct, relationId: "DAUGHTER", rightId: "U" },
      { leftId: x, relationId: "WIFE", rightId: "U" },
      { leftId: y, relationId: "SISTER", rightId: x },
      { leftId: z, relationId: "DAUGHTER", rightId: y },
    ];
  return specs.map((spec) => ({
    leftId: spec.leftId,
    token: tokenFor(codeKey, spec.relationId),
    rightId: spec.rightId,
  }));
}

function familyTreeFromGraph(
  graph: BlrCp006Graph,
  target: Target,
  answerLabel: string,
  decoded: readonly string[],
): BlrCp006FamilyTree {
  const generation = new Map<string, number>([[target.referenceId, 0]]);
  const queue = [target.referenceId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentGeneration = generation.get(current)!;
    for (const edge of graph.parents) {
      if (edge.parentId === current && !generation.has(edge.childId)) {
        generation.set(edge.childId, currentGeneration + 1);
        queue.push(edge.childId);
      } else if (edge.childId === current && !generation.has(edge.parentId)) {
        generation.set(edge.parentId, currentGeneration - 1);
        queue.push(edge.parentId);
      }
    }
    for (const edge of [...graph.spouses, ...graph.siblings]) {
      const left = edge.personAId;
      const right = edge.personBId;
      if (left === current && !generation.has(right)) {
        generation.set(right, currentGeneration);
        queue.push(right);
      } else if (right === current && !generation.has(left)) {
        generation.set(left, currentGeneration);
        queue.push(left);
      }
    }
  }
  return {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Compact connected family network",
    nodes: graph.persons.map((person) => ({
      id: person.personId,
      label: person.label,
      gender: person.gender === "MALE" ? "male" : person.gender === "FEMALE" ? "female" : "unknown",
      generation: generation.get(person.personId) ?? 0,
    })),
    edges: [
      ...graph.parents.map((edge, index) => ({
        id: `parent-${index}-${edge.parentId}-${edge.childId}`,
        type: "parent-child" as const,
        sourceId: edge.parentId,
        targetId: edge.childId,
      })),
      ...graph.spouses.map((edge, index) => ({
        id: `spouse-${index}-${edge.personAId}-${edge.personBId}`,
        type: "marriage" as const,
        sourceId: edge.personAId,
        targetId: edge.personBId,
      })),
      ...graph.siblings.map((edge, index) => ({
        id: `sibling-${index}-${edge.personAId}-${edge.personBId}`,
        type: "sibling" as const,
        sourceId: edge.personAId,
        targetId: edge.personBId,
      })),
    ],
    query: {
      subjectId: target.subjectId,
      referenceId: target.referenceId,
      answerLabel,
      pathPersonIds: [target.subjectId, target.referenceId],
    },
    accessibleSummary: `${targetSentence(target)}.`,
    asciiFallback: decoded.join("\n"),
  };
}

function diagramProofFromGraph(graph: BlrCp006Graph, target: Target): BlrCp007V2DiagramProof {
  const highlighted = (left: string, right: string) =>
    [target.subjectId, target.referenceId].includes(left) || [target.subjectId, target.referenceId].includes(right);
  const edges: BlrCp007V2DiagramEdge[] = [
    ...graph.parents.map((edge, index) => ({
      id: `parent-${index}-${edge.parentId}-${edge.childId}`,
      type: "parent-child" as const,
      sourceId: edge.parentId,
      targetId: edge.childId,
      label: `${edge.parentId} is a parent of ${edge.childId}`,
      evidence: "CODED" as const,
      highlighted: highlighted(edge.parentId, edge.childId),
    })),
    ...graph.spouses.map((edge, index) => ({
      id: `spouse-${index}-${edge.personAId}-${edge.personBId}`,
      type: "marriage" as const,
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: `${edge.personAId} and ${edge.personBId} are spouses`,
      evidence: "CODED" as const,
      highlighted: highlighted(edge.personAId, edge.personBId),
    })),
    ...graph.siblings.map((edge, index) => ({
      id: `sibling-${index}-${edge.personAId}-${edge.personBId}`,
      type: "sibling" as const,
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: `${edge.personAId} and ${edge.personBId} are siblings`,
      evidence: "CODED" as const,
      highlighted: highlighted(edge.personAId, edge.personBId),
    })),
  ];
  return {
    title: "Compact connected candidate network",
    description: `The selected candidate completes the decisive path showing that ${targetSentence(target)}.`,
    legend: ["Parent-child", "Marriage", "Sibling"],
    siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED",
    pathPersonIds: [target.subjectId, target.referenceId],
    edges,
    codedEdgeCount: edges.length,
    inferredEdgeCount: 0,
  };
}

function specificWrongExplanation(
  candidate: string,
  target: Target,
  actual?: string,
): string {
  if (actual) {
    return `With ${candidate} in the blank, ${target.subjectId} becomes the ${relationText(actual as never)} of ${target.referenceId}, not the ${relationText(target.relationId)}.`;
  }
  return `With ${candidate} in the blank, the decisive path ends on a different branch, so ${targetSentence(target)} is not established.`;
}

export function remodelQl034(
  source: GeneratedBlrCp007EditorialV4Question,
  index: number,
): GeneratedBlrCp007EditorialV4Question {
  const question = remodelQl034Base(source, index);
  if (question.query.kind !== "MISSING_PERSON") throw new Error(`${question.itemId}: expected MISSING_PERSON.`);
  const correctCandidate = question.answer as "P" | "Q" | "R" | "S";
  const gender = question.graph.persons.find((person) => person.personId === correctCandidate)?.gender;
  if (gender !== "MALE" && gender !== "FEMALE") {
    throw new Error(`${question.itemId}: correct candidate gender is not explicit.`);
  }
  const sourceStatements = question.query.completeStatements;
  const retained = sourceStatements
    .map((statement, originalIndex) => ({ statement, originalIndex }))
    .filter(({ statement }) =>
      !OLD_CONTEXT_PEOPLE.has(statement.leftId) && !OLD_CONTEXT_PEOPLE.has(statement.rightId),
    );
  const blankIndex = retained.findIndex(({ originalIndex }) => originalIndex === question.query.blankStatementIndex);
  if (blankIndex < 0) throw new Error(`${question.itemId}: compact network lost the blank statement.`);
  const compactContext = codedContext(question.codeKey, correctCandidate, gender);
  const target = question.query.target;

  const optionFor = (sourceOption: BlrCp007V3Option): BlrCp007V3Option => {
    const candidate = sourceOption.text as "P" | "Q" | "R" | "S";
    const core = retained.map(({ statement }) => ({ ...statement }));
    const blank = core[blankIndex]!;
    core[blankIndex] = question.query.blankSide === "LEFT"
      ? { ...blank, leftId: candidate }
      : { ...blank, rightId: candidate };
    const statements = [...core, ...compactContext];
    const evaluated = evaluate(question.codeKey, statements, target, `${question.itemId}-COMPACT-${candidate}`);
    const correct = candidate === correctCandidate;
    return {
      ...sourceOption,
      completedStatements: statements,
      decodedAssertions: evaluated.decodedStatements,
      graphValidity: "VALID",
      targetRelationSatisfied: evaluated.actual === target.relationId,
      isCorrectAnswerForTask: correct,
      actualRelation: evaluated.actual,
      studentExplanation: correct
        ? `With ${candidate} in the blank, ${targetSentence(target)}.`
        : specificWrongExplanation(candidate, target, evaluated.actual),
    };
  };

  const options = question.options.map(optionFor);
  const correctOptions = options.filter((option) => option.targetRelationSatisfied);
  if (correctOptions.length !== 1 || correctOptions[0]!.text !== correctCandidate) {
    throw new Error(`${question.itemId}: compact network has ${correctOptions.length} target-satisfying candidates.`);
  }
  const correct = options[question.correctIndex]!;
  const evaluated = evaluate(question.codeKey, correct.completedStatements, target, `${question.itemId}-COMPACT-FINAL`);
  const expressionLines = correct.completedStatements.map((statement, statementIndex) => {
    if (statementIndex !== blankIndex) return statementText(statement);
    return question.query.blankSide === "LEFT"
      ? `? ${statement.token} ${statement.rightId}`
      : `${statement.leftId} ${statement.token} ?`;
  });
  const firstLine = question.stem.split("\n")[0]!;
  const familyTree = familyTreeFromGraph(evaluated.graph, target, correctCandidate, evaluated.decodedStatements);
  const diagramProof = diagramProofFromGraph(evaluated.graph, target);
  return {
    ...question,
    semanticScenarioId: `${question.semanticScenarioId}::COMPACT`,
    scenarioId: `${question.scenarioId}::COMPACT`,
    topologyId: `${question.topologyId}-COMPACT`,
    query: {
      ...question.query,
      completeStatements: correct.completedStatements,
      blankStatementIndex: blankIndex,
      expressionLines,
    },
    stem: `${firstLine}\nCandidates: P, Q, R, S\n\n${expressionLines.join("\n")}`,
    options,
    completedStatements: correct.completedStatements,
    decodedStatements: evaluated.decodedStatements,
    graph: evaluated.graph,
    explanation: {
      ...question.explanation,
      shortcut: index % 2 === 0
        ? "Use the short decisive path first; the compact side branch only distinguishes the four candidates."
        : "Locate the candidate attached to the decisive D-link, then verify the remaining connected branch.",
      commonTrap: index % 2 === 0
        ? "Do not choose a candidate from the side branch merely because the letter appears more than once."
        : "Every candidate is connected, but only one lies on the relation path asked in the question.",
      optionAnalysis: options.map((option, optionIndex) => ({
        optionLabel: OPTION_LABELS[optionIndex]!,
        optionText: option.text,
        statementValidity: option.statementValidity,
        isCorrectAnswerForTask: option.isCorrectAnswerForTask,
        failureCode: option.failureCode,
        explanation: option.studentExplanation,
      })),
      familyTree,
      diagramProof,
    },
    reviewProof: {
      ...question.reviewProof,
      semanticScenarioId: `${question.semanticScenarioId}::COMPACT`,
      familyTopologyId: `${question.topologyId}-COMPACT`,
      reviewerNote: "Wave 3 compact candidate network: exact target, four connected meaningful candidates, solver-verified unique answer and reduced statement load.",
    },
    metadata: {
      ...question.metadata,
      semanticScenarioFingerprint: fingerprint({
        topologyId: `${question.topologyId}-COMPACT`,
        target,
        statements: correct.completedStatements,
      }),
      candidateNetworkComponentCount: 1,
      allCandidatesMeaningful: true,
      shortcutResistant: true,
    },
    v4ReviewProof: {
      ...question.v4ReviewProof,
      candidateNetworkComponentCount: 1,
    },
  };
}