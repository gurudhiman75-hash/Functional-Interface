import {
  clueToNormalizedText,
  solveRelationFromGraph,
} from "../foundation/graph-closure";
import { assignNamesForClues } from "../foundation/name-registry";
import { SeededRandom, stableHash } from "../foundation/prng";
import {
  defaultDistractorPool,
  relationLabel,
} from "../foundation/relation-ontology";
import type { BlrRelationId, FamilyGraph } from "../foundation/types";
import { BLR_CP003_SOURCE_GAP_SCENARIO } from "./cp003-source-gap-scenario";
import {
  blrCp003SourceGapSemanticKey,
  proveBlrCp003SourceGapHiddenAgreement,
  proveEveryBlrCp003SourceGapClueContributes,
  solveBlrCp003SourceGapFromClues,
} from "./cp003-source-gap-solver";
import type {
  BlrCp003SourceGapAnswer,
  BlrCp003SourceGapOption,
  BlrCp003SourceGapQuestionSpec,
  GeneratedBlrCp003SourceGapGroup,
  GeneratedBlrCp003SourceGapQuestion,
} from "./cp003-source-gap-types";

function lowerRelation(relationId: string): string {
  return relationId.toLocaleLowerCase("en-IN").replaceAll("_", "-");
}

function pairKey(personAId: string, personBId: string): string {
  return [personAId, personBId].sort().join("::");
}

function positionOptions(
  random: SeededRandom,
  entries: readonly Omit<BlrCp003SourceGapOption, "isCorrect">[],
  correctSemanticKey: string,
  correctIndex: number,
): { options: BlrCp003SourceGapOption[]; correctIndex: number } {
  const unique = new Map(entries.map((entry) => [entry.semanticKey, entry]));
  if (unique.size !== 4) {
    throw new Error(`CP-003 source-gap options require four unique semantics, got ${unique.size}.`);
  }
  const correct = unique.get(correctSemanticKey);
  if (!correct) throw new Error("CP-003 source-gap options are missing the correct answer.");
  const distractors = random.shuffle(
    [...unique.values()].filter((entry) => entry.semanticKey !== correctSemanticKey),
  );
  const ordered = [...distractors];
  ordered.splice(correctIndex, 0, correct);
  const options = ordered.map((entry, index) => ({
    ...entry,
    isCorrect: index === correctIndex,
  }));
  return { options, correctIndex };
}

function personOptions(
  spec: Extract<BlrCp003SourceGapQuestionSpec, { kind: "IDENTIFY_PERSON_BY_GENDER" }>,
  answer: Extract<BlrCp003SourceGapAnswer, { kind: "PERSON" }>,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003SourceGapOption[]; correctIndex: number } {
  return positionOptions(
    random,
    spec.candidatePersonIds.map((personId) => ({
      text: names[personId] ?? personId,
      semanticKey: `PERSON:${personId}`,
      errorLabel:
        personId === answer.personId ? undefined : "WRONG_GENDER_CANDIDATE",
    })),
    `PERSON:${answer.personId}`,
    correctIndex,
  );
}

function relationOptions(
  relationId: BlrRelationId,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003SourceGapOption[]; correctIndex: number } {
  const relationIds = [
    relationId,
    ...defaultDistractorPool(relationId).filter((entry) => entry !== relationId),
  ]
    .filter((entry, index, values) => values.indexOf(entry) === index)
    .slice(0, 4);
  if (relationIds.length !== 4) {
    throw new Error(`Unable to build CP-003 source-gap relation options for ${relationId}.`);
  }
  return positionOptions(
    random,
    relationIds.map((entry) => ({
      text: relationLabel(entry),
      semanticKey: `RELATION:${entry}`,
      errorLabel: entry === relationId ? undefined : "WRONG_RELATION_BRANCH_OR_DEPTH",
    })),
    `RELATION:${relationId}`,
    correctIndex,
  );
}

function pairOptions(
  answer: Extract<BlrCp003SourceGapAnswer, { kind: "PAIR" }>,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003SourceGapOption[]; correctIndex: number } {
  const correctKey = pairKey(answer.personIds[0], answer.personIds[1]);
  const spouseKeys = new Set(
    graph.spouseEdges.map((edge) => pairKey(edge.personAId, edge.personBId)),
  );
  const people = graph.persons.map((person) => person.personId);
  const candidates: [string, string][] = [];
  for (let first = 0; first < people.length; first += 1) {
    for (let second = first + 1; second < people.length; second += 1) {
      const candidate: [string, string] = [people[first]!, people[second]!];
      const key = pairKey(candidate[0], candidate[1]);
      if (key !== correctKey && !spouseKeys.has(key)) candidates.push(candidate);
    }
  }
  const selected = random.shuffle(candidates).slice(0, 3);
  if (selected.length !== 3) {
    throw new Error("Unable to build CP-003 source-gap married-pair distractors.");
  }
  const pairs: readonly [string, string][] = [
    [answer.personIds[0], answer.personIds[1]],
    ...selected,
  ];
  return positionOptions(
    random,
    pairs.map(([personAId, personBId]) => ({
      text: `${names[personAId]} and ${names[personBId]}`,
      semanticKey: `PAIR:${pairKey(personAId, personBId)}`,
      errorLabel:
        pairKey(personAId, personBId) === correctKey
          ? undefined
          : "NON_SPOUSE_PAIR",
    })),
    `PAIR:${correctKey}`,
    correctIndex,
  );
}

function compactPrompt(names: Readonly<Record<string, string>>): string {
  return [
    "Read the following family information carefully and answer the questions that follow.",
    `${names.A} and ${names.B} are a married couple. ${names.C} is their son, and ${names.D} is their daughter. ${names.C} is married to ${names.E}. ${names.F} is the son of ${names.C} and ${names.E}.`,
  ].join("\n\n");
}

function generateQuestion(
  spec: BlrCp003SourceGapQuestionSpec,
  answer: BlrCp003SourceGapAnswer,
  itemIndex: number,
  seed: number,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  normalizedClues: readonly string[],
): GeneratedBlrCp003SourceGapQuestion {
  const random = new SeededRandom(seed * 173 + itemIndex * 229 + 43);
  const correctIndex = (seed + itemIndex) % 4;
  let stem: string;
  let built: { options: BlrCp003SourceGapOption[]; correctIndex: number };
  let decisiveTrace: string[];
  let conclusion: string;
  let closestTrapRejection: string;

  switch (spec.kind) {
    case "IDENTIFY_PERSON_BY_GENDER": {
      if (answer.kind !== "PERSON") throw new Error("CP-003 source-gap person answer mismatch.");
      stem = `Who among the following is a ${spec.gender.toLocaleLowerCase("en-IN")} member of the family?`;
      built = personOptions(spec, answer, names, random, correctIndex);
      decisiveTrace = [
        `${names[answer.personId]} is explicitly introduced as a son, so the passage fixes the member's gender as male.`,
      ];
      conclusion = `${names[answer.personId]} is the required male member.`;
      closestTrapRejection = "Do not infer gender from a name; use the gendered family word in the passage.";
      break;
    }
    case "RELATION": {
      if (answer.kind !== "RELATION") throw new Error("CP-003 source-gap relation answer mismatch.");
      stem = `How is ${names[spec.subjectId]} related to ${names[spec.referenceId]}?`;
      built = relationOptions(answer.relationId, random, correctIndex);
      const solved = solveRelationFromGraph(graph, spec.subjectId, spec.referenceId);
      decisiveTrace = [
        `Trace ${solved.path.personIds.map((personId) => names[personId]).join(" → ")}.`,
      ];
      conclusion = `${names[spec.subjectId]} is the ${lowerRelation(answer.relationId)} of ${names[spec.referenceId]}.`;
      closestTrapRejection = "The couple wording supplies both parent links; do not drop one parent or reverse the query.";
      break;
    }
    case "MARRIED_PAIR": {
      if (answer.kind !== "PAIR") throw new Error("CP-003 source-gap pair answer mismatch.");
      stem = "Which of the following pairs is a married couple?";
      built = pairOptions(answer, graph, names, random, correctIndex);
      decisiveTrace = [
        `${names[answer.personIds[0]]} and ${names[answer.personIds[1]]} are explicitly introduced as a married couple.`,
      ];
      conclusion = `${names[answer.personIds[0]]} and ${names[answer.personIds[1]]} form the required married pair.`;
      closestTrapRejection = "A parent-child or sibling pair is not a married couple merely because both names appear together.";
      break;
    }
  }

  return {
    itemId: `${BLR_CP003_SOURCE_GAP_SCENARIO.scenarioId}-Q${String(itemIndex + 1).padStart(2, "0")}`,
    prototypeId: spec.prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    stem,
    options: built.options,
    correctIndex: built.correctIndex,
    answer,
    explanation: {
      normalizedClues,
      decisiveTrace,
      conclusion,
      closestTrapRejection,
    },
    metadata: {
      hiddenGraphAnswerAgreed: true,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
    },
  };
}

export function generateBlrCp003SourceGapGroup(
  seed: number,
): GeneratedBlrCp003SourceGapGroup {
  const names = assignNamesForClues(
    BLR_CP003_SOURCE_GAP_SCENARIO.clues,
    new SeededRandom(seed),
  );
  if (!proveBlrCp003SourceGapHiddenAgreement(BLR_CP003_SOURCE_GAP_SCENARIO, names)) {
    throw new Error("CP-003 compact joint-parent hidden graph disagrees with displayed clues.");
  }
  if (!proveEveryBlrCp003SourceGapClueContributes(BLR_CP003_SOURCE_GAP_SCENARIO, names)) {
    throw new Error("CP-003 compact joint-parent passage contains a decorative clue.");
  }
  const { graph, answers } = solveBlrCp003SourceGapFromClues(
    BLR_CP003_SOURCE_GAP_SCENARIO,
    names,
  );
  const normalizedClues = BLR_CP003_SOURCE_GAP_SCENARIO.clues.map((clue) =>
    clueToNormalizedText(clue, names),
  );
  const questions = BLR_CP003_SOURCE_GAP_SCENARIO.questions.map((spec, index) =>
    generateQuestion(
      spec,
      answers[index]!,
      index,
      seed,
      graph,
      names,
      normalizedClues,
    ),
  );

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-003",
    permanentQlIds: [],
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    seed,
    scenarioId: BLR_CP003_SOURCE_GAP_SCENARIO.scenarioId,
    topologyId: BLR_CP003_SOURCE_GAP_SCENARIO.topologyId,
    sharedPrompt: compactPrompt(names),
    personNames: names,
    reconstructedFamily: graph,
    questions,
    metadata: {
      runtimeVersion: "blr-cp003-source-gap-v1",
      hiddenGraphAgreedWithClueGraph: true,
      everyClueContributes: true,
      compactJointParentRenderer: true,
      coParenthoodExplicitlyModelled: true,
      clueCount: 8,
      itemCount: 8,
      semanticFingerprint: stableHash([
        BLR_CP003_SOURCE_GAP_SCENARIO.topologyId,
        ...BLR_CP003_SOURCE_GAP_SCENARIO.clues.map(
          (clue) => `${clue.subjectId}:${clue.relationId}:${clue.referenceId}`,
        ),
        ...questions.map((question) =>
          blrCp003SourceGapSemanticKey(question.answer),
        ),
      ]),
    },
  };
}
