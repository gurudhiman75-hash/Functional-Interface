import type {
  BlrCp006FamilyTree,
  BlrCp006Graph,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007Query } from "./cp007-model";
import type { BlrCp007V2DiagramEdge, BlrCp007V2DiagramProof } from "./cp007-editorial-v2-model";
import type { BlrCp007V3Option } from "./cp007-editorial-v3-model";
import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";
import {
  CANDIDATES,
  OPTION_LABELS,
  encodeSpecs,
  evaluate,
  fingerprint,
  fullCodeKey,
  optionExplanation,
  promptFor,
  rotate,
  statementText,
  targetSentence,
  type DirectSpec,
  type Target,
} from "./cp007-editorial-v4-wave3-core";

interface SecureTemplate {
  id: string;
  clues: readonly DirectSpec[];
  blankStatement: DirectSpec;
  target: Target;
  correctCandidate: "P" | "Q" | "R" | "S";
  teachingSteps: readonly string[];
}

function cousinCandidateContext(
  correct: "P" | "Q" | "R" | "S",
  x: "P" | "Q" | "R" | "S",
  y: "P" | "Q" | "R" | "S",
  z: "P" | "Q" | "R" | "S",
  correctGender: "MALE" | "FEMALE",
): readonly DirectSpec[] {
  return [
    { leftId: correct, relationId: correctGender === "MALE" ? "SON" : "DAUGHTER", rightId: "U" },
    { leftId: x, relationId: "SON", rightId: "V" },
    { leftId: y, relationId: "DAUGHTER", rightId: "W" },
    { leftId: z, relationId: "SON", rightId: "T" },
    { leftId: "U", relationId: "BROTHER", rightId: "V" },
    { leftId: "V", relationId: "BROTHER", rightId: "W" },
    { leftId: "W", relationId: "BROTHER", rightId: "T" },
  ];
}

function secureTemplate(index: number): SecureTemplate {
  const variant = index % 2;
  const structure = Math.floor(index / 2);
  const [correct, x, y, z] = rotate(CANDIDATES, index) as [
    "P" | "Q" | "R" | "S",
    "P" | "Q" | "R" | "S",
    "P" | "Q" | "R" | "S",
    "P" | "Q" | "R" | "S",
  ];
  const male = variant === 0;
  const make = (
    id: string,
    clue: DirectSpec,
    blankStatement: DirectSpec,
    target: Target,
    correctGender: "MALE" | "FEMALE",
    teachingSteps: readonly string[],
  ): SecureTemplate => ({
    id: `${id}-${male ? "M" : "F"}-${correct}`,
    clues: [clue, ...cousinCandidateContext(correct, x, y, z, correctGender)],
    blankStatement,
    target,
    correctCandidate: correct,
    teachingSteps,
  });

  switch (structure) {
    case 9:
      return male
        ? make(
          "GRANDPARENT-REVERSE-SECURE",
          { leftId: correct, relationId: "FATHER", rightId: "D" },
          { leftId: "A", relationId: "FATHER", rightId: correct },
          { subjectId: "A", relationId: "GRANDFATHER", referenceId: "D" },
          "MALE",
          [`A is ${correct}’s father.`, `${correct} is D’s father.`, "Therefore, A is D’s grandfather."],
        )
        : make(
          "GRANDPARENT-REVERSE-SECURE",
          { leftId: correct, relationId: "MOTHER", rightId: "D" },
          { leftId: "A", relationId: "MOTHER", rightId: correct },
          { subjectId: "A", relationId: "GRANDMOTHER", referenceId: "D" },
          "FEMALE",
          [`A is ${correct}’s mother.`, `${correct} is D’s mother.`, "Therefore, A is D’s grandmother."],
        );
    case 10:
      return male
        ? make(
          "GRANDCHILD-REVERSE-SECURE",
          { leftId: "D", relationId: "FATHER", rightId: correct },
          { leftId: "A", relationId: "SON", rightId: correct },
          { subjectId: "A", relationId: "GRANDSON", referenceId: "D" },
          "MALE",
          [`D is ${correct}’s father.`, `A is ${correct}’s son.`, "Therefore, A is D’s grandson."],
        )
        : make(
          "GRANDCHILD-REVERSE-SECURE",
          { leftId: "D", relationId: "MOTHER", rightId: correct },
          { leftId: "A", relationId: "DAUGHTER", rightId: correct },
          { subjectId: "A", relationId: "GRANDDAUGHTER", referenceId: "D" },
          "FEMALE",
          [`D is ${correct}’s mother.`, `A is ${correct}’s daughter.`, "Therefore, A is D’s granddaughter."],
        );
    case 11:
      return male
        ? make(
          "UNCLE-AUNT-REVERSE-SECURE",
          { leftId: correct, relationId: "MOTHER", rightId: "D" },
          { leftId: "A", relationId: "BROTHER", rightId: correct },
          { subjectId: "A", relationId: "UNCLE", referenceId: "D" },
          "FEMALE",
          [`A is ${correct}’s brother.`, `${correct} is D’s mother.`, "Therefore, A is D’s uncle."],
        )
        : make(
          "UNCLE-AUNT-REVERSE-SECURE",
          { leftId: correct, relationId: "FATHER", rightId: "D" },
          { leftId: "A", relationId: "SISTER", rightId: correct },
          { subjectId: "A", relationId: "AUNT", referenceId: "D" },
          "MALE",
          [`A is ${correct}’s sister.`, `${correct} is D’s father.`, "Therefore, A is D’s aunt."],
        );
    case 12:
      return male
        ? make(
          "SIBLING-IN-LAW-REVERSE-SECURE",
          { leftId: correct, relationId: "WIFE", rightId: "D" },
          { leftId: "A", relationId: "BROTHER", rightId: correct },
          { subjectId: "A", relationId: "BROTHER_IN_LAW", referenceId: "D" },
          "FEMALE",
          [`A is ${correct}’s brother.`, `${correct} is D’s wife.`, "Therefore, A is D’s brother-in-law."],
        )
        : make(
          "SIBLING-IN-LAW-REVERSE-SECURE",
          { leftId: correct, relationId: "HUSBAND", rightId: "D" },
          { leftId: "A", relationId: "SISTER", rightId: correct },
          { subjectId: "A", relationId: "SISTER_IN_LAW", referenceId: "D" },
          "MALE",
          [`A is ${correct}’s sister.`, `${correct} is D’s husband.`, "Therefore, A is D’s sister-in-law."],
        );
    default:
      throw new Error(`Secure QL-034 template requested outside indices 18..25: ${index}.`);
  }
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
      if (edge.personAId === current && !generation.has(edge.personBId)) {
        generation.set(edge.personBId, currentGeneration);
        queue.push(edge.personBId);
      } else if (edge.personBId === current && !generation.has(edge.personAId)) {
        generation.set(edge.personAId, currentGeneration);
        queue.push(edge.personAId);
      }
    }
  }
  return {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Connected cousin-candidate family network",
    nodes: graph.persons.map((person) => ({
      id: person.personId,
      label: person.label,
      gender: person.gender === "MALE" ? "male" : person.gender === "FEMALE" ? "female" : "unknown",
      generation: generation.get(person.personId) ?? 0,
    })),
    edges: [
      ...graph.parents.map((edge, edgeIndex) => ({
        id: `parent-${edgeIndex}-${edge.parentId}-${edge.childId}`,
        type: "parent-child" as const,
        sourceId: edge.parentId,
        targetId: edge.childId,
      })),
      ...graph.spouses.map((edge, edgeIndex) => ({
        id: `spouse-${edgeIndex}-${edge.personAId}-${edge.personBId}`,
        type: "marriage" as const,
        sourceId: edge.personAId,
        targetId: edge.personBId,
      })),
      ...graph.siblings.map((edge, edgeIndex) => ({
        id: `sibling-${edgeIndex}-${edge.personAId}-${edge.personBId}`,
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
    ...graph.parents.map((edge, edgeIndex) => ({
      id: `parent-${edgeIndex}-${edge.parentId}-${edge.childId}`,
      type: "parent-child" as const,
      sourceId: edge.parentId,
      targetId: edge.childId,
      label: `${edge.parentId} is a parent of ${edge.childId}`,
      evidence: "CODED" as const,
      highlighted: highlighted(edge.parentId, edge.childId),
    })),
    ...graph.spouses.map((edge, edgeIndex) => ({
      id: `spouse-${edgeIndex}-${edge.personAId}-${edge.personBId}`,
      type: "marriage" as const,
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: `${edge.personAId} and ${edge.personBId} are spouses`,
      evidence: "CODED" as const,
      highlighted: highlighted(edge.personAId, edge.personBId),
    })),
    ...graph.siblings.map((edge, edgeIndex) => ({
      id: `sibling-${edgeIndex}-${edge.personAId}-${edge.personBId}`,
      type: "sibling" as const,
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: `${edge.personAId} and ${edge.personBId} are siblings`,
      evidence: "CODED" as const,
      highlighted: highlighted(edge.personAId, edge.personBId),
    })),
  ];
  return {
    title: "Connected cousin-candidate network",
    description: `The selected candidate completes the fixed A–D path showing that ${targetSentence(target)}.`,
    legend: ["Parent-child", "Marriage", "Sibling"],
    siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED",
    pathPersonIds: [target.subjectId, target.referenceId],
    edges,
    codedEdgeCount: edges.length,
    inferredEdgeCount: 0,
  };
}

export function remodelQl034(
  source: GeneratedBlrCp007EditorialV4Question,
  index: number,
): GeneratedBlrCp007EditorialV4Question {
  const template = secureTemplate(index);
  const groupKey = source.delivery.mode === "SHARED_SET" ? source.delivery.setId! : source.itemId;
  const codeKey = fullCodeKey(`${groupKey}-WAVE3-QL034`);
  const blankIndex = index % (template.clues.length + 1);
  const optionFor = (candidate: "P" | "Q" | "R" | "S"): BlrCp007V3Option => {
    const blankSpec = { ...template.blankStatement, rightId: candidate };
    const specs = [...template.clues];
    specs.splice(blankIndex, 0, blankSpec);
    const statements = encodeSpecs(specs, codeKey);
    const evaluated = evaluate(codeKey, statements, template.target, `${source.itemId}-SECURE-V2-${candidate}`);
    const correct = candidate === template.correctCandidate;
    return {
      text: candidate,
      semanticKey: candidate,
      completedStatements: statements,
      decodedAssertions: evaluated.decodedStatements,
      graphValidity: "VALID",
      statementValidity: "NOT_APPLICABLE",
      targetRelationSatisfied: evaluated.actual === template.target.relationId,
      isCorrectAnswerForTask: correct,
      failureCode: correct ? undefined : "WRONG_PERSON_IDENTITY",
      actualRelation: evaluated.actual,
      studentExplanation: correct
        ? `With ${candidate} in the blank, ${targetSentence(template.target)}.`
        : optionExplanation(template.target, evaluated.actual),
    };
  };
  const unordered = CANDIDATES.map(optionFor);
  const satisfying = unordered.filter((option) => option.targetRelationSatisfied);
  if (satisfying.length !== 1 || satisfying[0]!.text !== template.correctCandidate) {
    throw new Error(`${source.itemId}: secure V2 template ${template.id} has ${satisfying.length} satisfying candidates.`);
  }
  const correctOption = unordered.find((option) => option.text === template.correctCandidate)!;
  const wrong = unordered.filter((option) => !option.isCorrectAnswerForTask);
  let wrongIndex = 0;
  const options = Array.from({ length: 4 }, (_, optionIndex) =>
    optionIndex === source.correctIndex ? correctOption : wrong[wrongIndex++]!,
  );
  const correct = options[source.correctIndex]!;
  const expressionLines = correct.completedStatements.map((statement, statementIndex) =>
    statementIndex === blankIndex
      ? `${statement.leftId} ${statement.token} ?`
      : statementText(statement),
  );
  const evaluated = evaluate(codeKey, correct.completedStatements, template.target, `${source.itemId}-SECURE-V2-FINAL`);
  const query: BlrCp007Query = {
    kind: "MISSING_PERSON",
    completeStatements: correct.completedStatements,
    blankStatementIndex: blankIndex,
    blankSide: "RIGHT",
    expressionLines,
    candidatePersonIds: CANDIDATES,
    target: template.target,
  };
  const leads = [
    `Which candidate should replace ? so that the statements establish that ${targetSentence(template.target)}?`,
    `Who must replace ? for the coded family network to show that ${targetSentence(template.target)}?`,
    `Select the candidate that completes the network and proves that ${targetSentence(template.target)}.`,
    `Choose the person who should replace ? so that ${targetSentence(template.target)}.`,
  ] as const;
  const familyTree = familyTreeFromGraph(evaluated.graph, template.target, template.correctCandidate, evaluated.decodedStatements);
  const diagramProof = diagramProofFromGraph(evaluated.graph, template.target);
  const topologyId = `V4-WAVE3-${template.id}-COUSIN-CONTEXT`;
  return {
    ...source,
    semanticScenarioId: `${source.sourcePrototypeId}::V4-WAVE3::${template.id}::SECURE-V2`,
    scenarioId: `${source.sourcePrototypeId}::V4-WAVE3::${template.id}::SECURE-V2`,
    topologyId,
    keyStyle: "SYMBOL",
    codeKey,
    query,
    sharedPrompt: promptFor(codeKey),
    stem: `${leads[index % leads.length]}\nCandidates: P, Q, R, S\n\n${expressionLines.join("\n")}`,
    options,
    answer: correct.text,
    completedStatements: correct.completedStatements,
    decodedStatements: evaluated.decodedStatements,
    graph: evaluated.graph,
    explanation: {
      ...source.explanation,
      steps: template.teachingSteps,
      conclusion: `${template.correctCandidate} must replace ?; then ${targetSentence(template.target)}.`,
      shortcut: "Solve the fixed A–D path first; the cousin branch distinguishes P, Q, R and S without revealing the answer in the target.",
      commonTrap: "The four candidates are connected as cousins, but only one occupies the missing position on the A–D path.",
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
      diagramPolicy: "REQUIRED",
    },
    reviewProof: {
      ...source.reviewProof,
      semanticScenarioId: `${source.sourcePrototypeId}::V4-WAVE3::${template.id}::SECURE-V2`,
      difficulty: "MEDIUM",
      familyTopologyId: topologyId,
      targetRelation: template.target.relationId,
      targetPath: template.teachingSteps,
      reviewerNote: "Secure V2 reverse-path QL-034 scenario: fixed A–D target, candidate absent from target wording, cousin candidate network and solver-verified unique answer.",
    },
    metadata: {
      ...source.metadata,
      difficulty: "MEDIUM",
      semanticScenarioFingerprint: fingerprint({ topologyId, target: template.target, statements: correct.completedStatements }),
      candidateNetworkComponentCount: 1,
      allCandidatesMeaningful: true,
      shortcutResistant: true,
    },
    v4ReviewProof: {
      ...source.v4ReviewProof,
      reasoningDepth: template.teachingSteps.length,
      decisiveLinkCount: template.teachingSteps.length,
      candidateNetworkComponentCount: 1,
    },
  };
}
