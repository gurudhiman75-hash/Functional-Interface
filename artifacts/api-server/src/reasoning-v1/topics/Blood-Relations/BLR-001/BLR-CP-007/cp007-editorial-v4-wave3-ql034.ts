import type {
  BlrCp006FamilyTree,
  BlrCp006Graph,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007Query } from "./cp007-model";
import type { BlrCp007V2DiagramEdge, BlrCp007V2DiagramProof } from "./cp007-editorial-v2-model";
import type { BlrCp007V3Difficulty, BlrCp007V3Option } from "./cp007-editorial-v3-model";
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

interface MissingPersonTemplate {
  id: string;
  clues: readonly DirectSpec[];
  blankStatement: DirectSpec;
  blankSide: "LEFT" | "RIGHT";
  target: Target;
  correctCandidate: "P" | "Q" | "R" | "S";
  teachingSteps: readonly string[];
  decisiveSignature: string;
  difficulty: BlrCp007V3Difficulty;
}

function candidateContext(
  correct: string,
  x: string,
  y: string,
  z: string,
  gender: "MALE" | "FEMALE",
): readonly DirectSpec[] {
  if (gender === "MALE") {
    return [
      { leftId: correct, relationId: "SON", rightId: "U" },
      { leftId: x, relationId: "SON", rightId: "V" },
      { leftId: y, relationId: "SON", rightId: "W" },
      { leftId: z, relationId: "SON", rightId: "T" },
      { leftId: "U", relationId: "BROTHER", rightId: "V" },
      { leftId: "V", relationId: "BROTHER", rightId: "W" },
      { leftId: "W", relationId: "BROTHER", rightId: "T" },
    ];
  }
  return [
    { leftId: correct, relationId: "DAUGHTER", rightId: "U" },
    { leftId: x, relationId: "DAUGHTER", rightId: "V" },
    { leftId: y, relationId: "DAUGHTER", rightId: "W" },
    { leftId: z, relationId: "DAUGHTER", rightId: "T" },
    { leftId: "U", relationId: "SISTER", rightId: "V" },
    { leftId: "V", relationId: "SISTER", rightId: "W" },
    { leftId: "W", relationId: "SISTER", rightId: "T" },
  ];
}

function ql034Template(index: number): MissingPersonTemplate {
  const variant = index % 2;
  const structure = Math.floor(index / 2);
  const labels = rotate(CANDIDATES, index);
  const [correct, x, y, z] = labels as ["P" | "Q" | "R" | "S", "P" | "Q" | "R" | "S", "P" | "Q" | "R" | "S", "P" | "Q" | "R" | "S"];
  const male = variant === 0;
  const make = (
    id: string,
    gender: "MALE" | "FEMALE",
    decisiveClues: readonly DirectSpec[],
    blankStatement: DirectSpec,
    blankSide: "LEFT" | "RIGHT",
    target: Target,
    teachingSteps: readonly string[],
    decisiveSignature: string,
    difficulty: BlrCp007V3Difficulty = "MEDIUM",
    extraClues: readonly DirectSpec[] = [],
  ): MissingPersonTemplate => ({
    id: `${id}-${male ? "M" : "F"}-${correct}`,
    clues: [...decisiveClues, ...extraClues, ...candidateContext(correct, x, y, z, gender)],
    blankStatement,
    blankSide,
    target,
    correctCandidate: correct,
    teachingSteps,
    decisiveSignature,
    difficulty,
  });

  switch (structure) {
    case 0:
      return make(
        "SIBLING-OF-PARENT",
        "MALE",
        [{ leftId: correct, relationId: "FATHER", rightId: "D" }],
        { leftId: "A", relationId: male ? "BROTHER" : "SISTER", rightId: correct },
        "RIGHT",
        { subjectId: "A", relationId: male ? "UNCLE" : "AUNT", referenceId: "D" },
        [
          `${correct} is D’s father.`,
          `A is ${correct}’s ${male ? "brother" : "sister"}.`,
          `Therefore, A is D’s ${male ? "uncle" : "aunt"}.`,
        ],
        `PARENT>${male ? "BROTHER" : "SISTER"}>${male ? "UNCLE" : "AUNT"}`,
      );
    case 1:
      return make(
        "PARENT-OF-PARENT",
        "MALE",
        [{ leftId: correct, relationId: "FATHER", rightId: "D" }],
        { leftId: "A", relationId: male ? "FATHER" : "MOTHER", rightId: correct },
        "RIGHT",
        { subjectId: "A", relationId: male ? "GRANDFATHER" : "GRANDMOTHER", referenceId: "D" },
        [
          `${correct} is D’s father.`,
          `A is ${correct}’s ${male ? "father" : "mother"}.`,
          `Therefore, A is D’s ${male ? "grandfather" : "grandmother"}.`,
        ],
        `PARENT>${male ? "FATHER" : "MOTHER"}>${male ? "GRANDFATHER" : "GRANDMOTHER"}`,
      );
    case 2:
      return make(
        "CHILD-OF-SIBLING",
        "FEMALE",
        [{ leftId: correct, relationId: "SISTER", rightId: "D" }],
        { leftId: "A", relationId: male ? "SON" : "DAUGHTER", rightId: correct },
        "RIGHT",
        { subjectId: "A", relationId: male ? "NEPHEW" : "NIECE", referenceId: "D" },
        [
          `${correct} is D’s sister.`,
          `A is ${correct}’s ${male ? "son" : "daughter"}.`,
          `Therefore, A is D’s ${male ? "nephew" : "niece"}.`,
        ],
        `SISTER>${male ? "SON" : "DAUGHTER"}>${male ? "NEPHEW" : "NIECE"}`,
      );
    case 3:
      return make(
        "PARENT-OF-SPOUSE",
        "FEMALE",
        [{ leftId: correct, relationId: "WIFE", rightId: "D" }],
        { leftId: "A", relationId: male ? "FATHER" : "MOTHER", rightId: correct },
        "RIGHT",
        { subjectId: "A", relationId: male ? "FATHER_IN_LAW" : "MOTHER_IN_LAW", referenceId: "D" },
        [
          `${correct} is D’s wife.`,
          `A is ${correct}’s ${male ? "father" : "mother"}.`,
          `Therefore, A is D’s ${male ? "father-in-law" : "mother-in-law"}.`,
        ],
        `WIFE>${male ? "FATHER" : "MOTHER"}>${male ? "FATHER_IN_LAW" : "MOTHER_IN_LAW"}`,
      );
    case 4:
      return male
        ? make(
          "SPOUSE-OF-DAUGHTER",
          "FEMALE",
          [{ leftId: correct, relationId: "DAUGHTER", rightId: "D" }],
          { leftId: "A", relationId: "HUSBAND", rightId: correct },
          "RIGHT",
          { subjectId: "A", relationId: "SON_IN_LAW", referenceId: "D" },
          [`${correct} is D’s daughter.`, `A is ${correct}’s husband.`, "Therefore, A is D’s son-in-law."],
          "DAUGHTER>HUSBAND>SON_IN_LAW",
        )
        : make(
          "SPOUSE-OF-SON",
          "MALE",
          [{ leftId: correct, relationId: "SON", rightId: "D" }],
          { leftId: "A", relationId: "WIFE", rightId: correct },
          "RIGHT",
          { subjectId: "A", relationId: "DAUGHTER_IN_LAW", referenceId: "D" },
          [`${correct} is D’s son.`, `A is ${correct}’s wife.`, "Therefore, A is D’s daughter-in-law."],
          "SON>WIFE>DAUGHTER_IN_LAW",
        );
    case 5:
      return make(
        "SIBLING-OF-SPOUSE",
        "FEMALE",
        [{ leftId: correct, relationId: "WIFE", rightId: "D" }],
        { leftId: "A", relationId: male ? "BROTHER" : "SISTER", rightId: correct },
        "RIGHT",
        { subjectId: "A", relationId: male ? "BROTHER_IN_LAW" : "SISTER_IN_LAW", referenceId: "D" },
        [
          `${correct} is D’s wife.`,
          `A is ${correct}’s ${male ? "brother" : "sister"}.`,
          `Therefore, A is D’s ${male ? "brother-in-law" : "sister-in-law"}.`,
        ],
        `WIFE>${male ? "BROTHER" : "SISTER"}>${male ? "BROTHER_IN_LAW" : "SISTER_IN_LAW"}`,
      );
    case 6:
      return male
        ? make(
          "SPOUSE-OF-SISTER",
          "FEMALE",
          [{ leftId: correct, relationId: "SISTER", rightId: "D" }],
          { leftId: "A", relationId: "HUSBAND", rightId: correct },
          "RIGHT",
          { subjectId: "A", relationId: "BROTHER_IN_LAW", referenceId: "D" },
          [`${correct} is D’s sister.`, `A is ${correct}’s husband.`, "Therefore, A is D’s brother-in-law."],
          "SISTER>HUSBAND>BROTHER_IN_LAW",
        )
        : make(
          "SPOUSE-OF-BROTHER",
          "MALE",
          [{ leftId: correct, relationId: "BROTHER", rightId: "D" }],
          { leftId: "A", relationId: "WIFE", rightId: correct },
          "RIGHT",
          { subjectId: "A", relationId: "SISTER_IN_LAW", referenceId: "D" },
          [`${correct} is D’s brother.`, `A is ${correct}’s wife.`, "Therefore, A is D’s sister-in-law."],
          "BROTHER>WIFE>SISTER_IN_LAW",
        );
    case 7:
      return make(
        "COUSIN-FORWARD",
        "MALE",
        [
          { leftId: correct, relationId: "BROTHER", rightId: "E" },
          { leftId: "D", relationId: "DAUGHTER", rightId: "E" },
        ],
        { leftId: "A", relationId: male ? "SON" : "DAUGHTER", rightId: correct },
        "RIGHT",
        { subjectId: "A", relationId: "COUSIN", referenceId: "D" },
        [
          `${correct} and E are siblings.`,
          `A is ${correct}’s ${male ? "son" : "daughter"}, while D is E’s daughter.`,
          "Therefore, A and D are cousins.",
        ],
        `SIBLING-PARENTS>${male ? "SON" : "DAUGHTER"}>COUSIN`,
        "HARD",
      );
    case 8:
      return make(
        "GRANDCHILD-FORWARD",
        "MALE",
        [{ leftId: correct, relationId: "SON", rightId: "D" }],
        { leftId: "A", relationId: male ? "SON" : "DAUGHTER", rightId: correct },
        "RIGHT",
        { subjectId: "A", relationId: male ? "GRANDSON" : "GRANDDAUGHTER", referenceId: "D" },
        [
          `${correct} is D’s son.`,
          `A is ${correct}’s ${male ? "son" : "daughter"}.`,
          `Therefore, A is D’s ${male ? "grandson" : "granddaughter"}.`,
        ],
        `SON>${male ? "SON" : "DAUGHTER"}>${male ? "GRANDSON" : "GRANDDAUGHTER"}`,
      );
    case 9:
      return male
        ? make(
          "DIRECT-PARENT-REVERSE",
          "MALE",
          [],
          { leftId: correct, relationId: "SON", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "FATHER", referenceId: correct },
          [`${correct} is A’s son.`, "A is male, so A is the father."],
          "REVERSE-SON>FATHER",
          "MEDIUM",
          [{ leftId: "A", relationId: "HUSBAND", rightId: "G" }],
        )
        : make(
          "DIRECT-PARENT-REVERSE",
          "FEMALE",
          [],
          { leftId: correct, relationId: "DAUGHTER", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "MOTHER", referenceId: correct },
          [`${correct} is A’s daughter.`, "A is female, so A is the mother."],
          "REVERSE-DAUGHTER>MOTHER",
          "MEDIUM",
          [{ leftId: "A", relationId: "WIFE", rightId: "G" }],
        );
    case 10:
      return male
        ? make(
          "DIRECT-CHILD-REVERSE",
          "MALE",
          [],
          { leftId: correct, relationId: "FATHER", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "SON", referenceId: correct },
          [`${correct} is A’s father.`, "A is male, so A is the son."],
          "REVERSE-FATHER>SON",
          "MEDIUM",
          [{ leftId: "A", relationId: "HUSBAND", rightId: "G" }],
        )
        : make(
          "DIRECT-CHILD-REVERSE",
          "FEMALE",
          [],
          { leftId: correct, relationId: "MOTHER", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "DAUGHTER", referenceId: correct },
          [`${correct} is A’s mother.`, "A is female, so A is the daughter."],
          "REVERSE-MOTHER>DAUGHTER",
          "MEDIUM",
          [{ leftId: "A", relationId: "WIFE", rightId: "G" }],
        );
    case 11:
      return male
        ? make(
          "DIRECT-SIBLING-REVERSE",
          "FEMALE",
          [],
          { leftId: correct, relationId: "SISTER", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "BROTHER", referenceId: correct },
          [`${correct} is A’s sister.`, "A is male, so A is her brother."],
          "REVERSE-SISTER>BROTHER",
          "MEDIUM",
          [{ leftId: "A", relationId: "HUSBAND", rightId: "G" }],
        )
        : make(
          "DIRECT-SIBLING-REVERSE",
          "MALE",
          [],
          { leftId: correct, relationId: "BROTHER", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "SISTER", referenceId: correct },
          [`${correct} is A’s brother.`, "A is female, so A is his sister."],
          "REVERSE-BROTHER>SISTER",
          "MEDIUM",
          [{ leftId: "A", relationId: "WIFE", rightId: "G" }],
        );
    case 12:
      return male
        ? make(
          "DIRECT-SPOUSE-REVERSE",
          "FEMALE",
          [],
          { leftId: correct, relationId: "WIFE", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "HUSBAND", referenceId: correct },
          [`${correct} is A’s wife.`, "Therefore, A is her husband."],
          "REVERSE-WIFE>HUSBAND",
        )
        : make(
          "DIRECT-SPOUSE-REVERSE",
          "MALE",
          [],
          { leftId: correct, relationId: "HUSBAND", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "WIFE", referenceId: correct },
          [`${correct} is A’s husband.`, "Therefore, A is his wife."],
          "REVERSE-HUSBAND>WIFE",
        );
    case 13:
      return make(
        "PARENT-COMPLETION-SIBLING",
        "MALE",
        [{ leftId: correct, relationId: "BROTHER", rightId: "D" }],
        { leftId: "A", relationId: male ? "FATHER" : "MOTHER", rightId: correct },
        "RIGHT",
        { subjectId: "A", relationId: male ? "FATHER" : "MOTHER", referenceId: "D" },
        [
          `${correct} and D are siblings.`,
          `A is ${correct}’s ${male ? "father" : "mother"}.`,
          `Under the full-sibling convention, A is also D’s ${male ? "father" : "mother"}.`,
        ],
        `SIBLING-COMPLETION>${male ? "FATHER" : "MOTHER"}`,
      );
    case 14:
      return male
        ? make(
          "COUSIN-REVERSE",
          "MALE",
          [
            { leftId: correct, relationId: "BROTHER", rightId: "E" },
            { leftId: "D", relationId: "SON", rightId: "E" },
          ],
          { leftId: correct, relationId: "FATHER", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "COUSIN", referenceId: "D" },
          [`${correct} is A’s father and E’s brother.`, "D is E’s son.", "Therefore, A and D are cousins."],
          "REVERSE-PARENT>SIBLING-PARENTS>COUSIN",
          "HARD",
        )
        : make(
          "COUSIN-REVERSE",
          "FEMALE",
          [
            { leftId: correct, relationId: "SISTER", rightId: "E" },
            { leftId: "D", relationId: "DAUGHTER", rightId: "E" },
          ],
          { leftId: correct, relationId: "MOTHER", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "COUSIN", referenceId: "D" },
          [`${correct} is A’s mother and E’s sister.`, "D is E’s daughter.", "Therefore, A and D are cousins."],
          "REVERSE-PARENT>SIBLING-PARENTS>COUSIN",
          "HARD",
        );
    default:
      return male
        ? make(
          "GRANDCHILD-REVERSE",
          "MALE",
          [{ leftId: "D", relationId: "FATHER", rightId: correct }],
          { leftId: correct, relationId: "FATHER", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "GRANDSON", referenceId: "D" },
          [`D is ${correct}’s father.`, `${correct} is A’s father.`, "A is male, so A is D’s grandson."],
          "REVERSE-FATHER>FATHER>GRANDSON",
          "MEDIUM",
          [{ leftId: "A", relationId: "HUSBAND", rightId: "G" }],
        )
        : make(
          "GRANDCHILD-REVERSE",
          "FEMALE",
          [{ leftId: "D", relationId: "MOTHER", rightId: correct }],
          { leftId: correct, relationId: "MOTHER", rightId: "A" },
          "LEFT",
          { subjectId: "A", relationId: "GRANDDAUGHTER", referenceId: "D" },
          [`D is ${correct}’s mother.`, `${correct} is A’s mother.`, "A is female, so A is D’s granddaughter."],
          "REVERSE-MOTHER>MOTHER>GRANDDAUGHTER",
          "MEDIUM",
          [{ leftId: "A", relationId: "WIFE", rightId: "G" }],
        );
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
      const left = "personAId" in edge ? edge.personAId : "";
      const right = "personBId" in edge ? edge.personBId : "";
      if (left === current && !generation.has(right)) {
        generation.set(right, currentGeneration);
        queue.push(right);
      } else if (right === current && !generation.has(left)) {
        generation.set(left, currentGeneration);
        queue.push(left);
      }
    }
  }
  const nodes = graph.persons.map((person) => ({
    id: person.personId,
    label: person.label,
    gender: person.gender === "MALE" ? "male" as const : person.gender === "FEMALE" ? "female" as const : "unknown" as const,
    generation: generation.get(person.personId) ?? 0,
  }));
  const edges: BlrCp006FamilyTree["edges"] = [
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
  ];
  return {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Connected family network",
    nodes,
    edges,
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

function diagramProofFromGraph(
  graph: BlrCp006Graph,
  target: Target,
): BlrCp007V2DiagramProof {
  const edges: BlrCp007V2DiagramEdge[] = [
    ...graph.parents.map((edge, index) => ({
      id: `parent-${index}-${edge.parentId}-${edge.childId}`,
      type: "parent-child" as const,
      sourceId: edge.parentId,
      targetId: edge.childId,
      label: `${edge.parentId} is a parent of ${edge.childId}`,
      evidence: "CODED" as const,
      highlighted: [target.subjectId, target.referenceId].includes(edge.parentId) || [target.subjectId, target.referenceId].includes(edge.childId),
    })),
    ...graph.spouses.map((edge, index) => ({
      id: `spouse-${index}-${edge.personAId}-${edge.personBId}`,
      type: "marriage" as const,
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: `${edge.personAId} and ${edge.personBId} are spouses`,
      evidence: "CODED" as const,
      highlighted: [target.subjectId, target.referenceId].includes(edge.personAId) || [target.subjectId, target.referenceId].includes(edge.personBId),
    })),
    ...graph.siblings.map((edge, index) => ({
      id: `sibling-${index}-${edge.personAId}-${edge.personBId}`,
      type: "sibling" as const,
      sourceId: edge.personAId,
      targetId: edge.personBId,
      label: `${edge.personAId} and ${edge.personBId} are siblings`,
      evidence: "CODED" as const,
      highlighted: [target.subjectId, target.referenceId].includes(edge.personAId) || [target.subjectId, target.referenceId].includes(edge.personBId),
    })),
  ];
  return {
    title: "Connected candidate network",
    description: `The selected candidate completes one connected family network and establishes that ${targetSentence(target)}.`,
    legend: ["Parent-child", "Marriage", "Sibling"],
    siblingPolicy: "FULL_SIBLING_UNLESS_EXPLICITLY_QUALIFIED",
    pathPersonIds: [target.subjectId, target.referenceId],
    edges,
    codedEdgeCount: edges.length,
    inferredEdgeCount: 0,
  };
}

export function remodelQl034(
  question: GeneratedBlrCp007EditorialV4Question,
  index: number,
): GeneratedBlrCp007EditorialV4Question {
  const template = ql034Template(index);
  const groupKey = question.delivery.mode === "SHARED_SET" ? question.delivery.setId! : question.itemId;
  const codeKey = fullCodeKey(`${groupKey}-WAVE3-QL034`);
  const blankIndex = index % (template.clues.length + 1);
  const optionFor = (candidate: "P" | "Q" | "R" | "S"): BlrCp007V3Option => {
    const blankSpec: DirectSpec = template.blankSide === "LEFT"
      ? { ...template.blankStatement, leftId: candidate }
      : { ...template.blankStatement, rightId: candidate };
    const specs = [...template.clues];
    specs.splice(blankIndex, 0, blankSpec);
    const statements = encodeSpecs(specs, codeKey);
    const evaluated = evaluate(codeKey, statements, template.target, `${question.itemId}-PERSON-${candidate}`);
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
  const correctOption = unordered.find((option) => option.text === template.correctCandidate)!;
  if (!correctOption.targetRelationSatisfied) {
    throw new Error(`${question.itemId}: template ${template.id} does not establish its target.`);
  }
  const incorrectMatching = unordered.filter((option) => !option.isCorrectAnswerForTask && option.targetRelationSatisfied);
  if (incorrectMatching.length > 0) {
    throw new Error(`${question.itemId}: template ${template.id} has multiple correct candidates.`);
  }
  const wrong = unordered.filter((option) => !option.isCorrectAnswerForTask);
  let wrongIndex = 0;
  const options = Array.from({ length: 4 }, (_, optionIndex) =>
    optionIndex === question.correctIndex ? correctOption : wrong[wrongIndex++]!,
  );
  const correct = options[question.correctIndex]!;
  const correctSpecs = correct.completedStatements;
  const expressionLines = correctSpecs.map((statement, statementIndex) => {
    if (statementIndex !== blankIndex) return statementText(statement);
    return template.blankSide === "LEFT"
      ? `? ${statement.token} ${statement.rightId}`
      : `${statement.leftId} ${statement.token} ?`;
  });
  const evaluated = evaluate(codeKey, correct.completedStatements, template.target, `${question.itemId}-PERSON-FINAL`);
  const completeStatements = correct.completedStatements;
  const query: BlrCp007Query = {
    kind: "MISSING_PERSON",
    completeStatements,
    blankStatementIndex: blankIndex,
    blankSide: template.blankSide,
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
  return {
    ...question,
    semanticScenarioId: `${question.sourcePrototypeId}::V4-WAVE3::${template.id}`,
    scenarioId: `${question.sourcePrototypeId}::V4-WAVE3::${template.id}`,
    topologyId: `V4-WAVE3-${template.id}`,
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
      ...question.explanation,
      steps: template.teachingSteps,
      conclusion: `${template.correctCandidate} must replace ?; then ${targetSentence(template.target)}.`,
      shortcut: "Locate the candidate on the decisive path; the remaining clues confirm identity and prevent shortcuts.",
      commonTrap: "Do not choose a candidate merely because the letter appears near the blank; test the completed family path.",
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
      ...question.reviewProof,
      semanticScenarioId: `${question.sourcePrototypeId}::V4-WAVE3::${template.id}`,
      difficulty: template.difficulty,
      familyTopologyId: `V4-WAVE3-${template.id}`,
      targetRelation: template.target.relationId,
      targetPath: template.teachingSteps,
      reviewerNote: "Wave 3 self-review remediation: one of sixteen distinct family structures, exact target relation, connected candidate network and solver-verified unique answer.",
    },
    metadata: {
      ...question.metadata,
      difficulty: template.difficulty,
      semanticScenarioFingerprint: fingerprint({ structure: template.decisiveSignature, target: template.target }),
      candidateNetworkComponentCount: 1,
      allCandidatesMeaningful: true,
      shortcutResistant: true,
    },
    v4ReviewProof: {
      ...question.v4ReviewProof,
      reasoningDepth: template.teachingSteps.length,
      decisiveLinkCount: template.teachingSteps.length,
      candidateNetworkComponentCount: 1,
    },
  };
}
