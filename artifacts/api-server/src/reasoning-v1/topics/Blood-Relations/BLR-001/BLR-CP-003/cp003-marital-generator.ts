import { clueToNormalizedText, solveRelationFromGraph } from "../foundation/graph-closure";
import { assignNamesForClues } from "../foundation/name-registry";
import { SeededRandom, stableHash } from "../foundation/prng";
import {
  defaultDistractorPool,
  relationLabel,
} from "../foundation/relation-ontology";
import type { BlrRelationId, FamilyGraph } from "../foundation/types";
import { BLR_CP003_MARITAL_SCENARIO } from "./cp003-marital-scenario";
import {
  blrCp003MaritalSemanticKey,
  materializeBlrCp003MaritalHiddenGraph,
  proveBlrCp003MaritalHiddenAgreement,
  proveEveryBlrCp003MaritalInputContributes,
  resolveBlrCp003MaritalStatus,
  solveBlrCp003MaritalFromClues,
  validateBlrCp003MaritalFacts,
} from "./cp003-marital-solver";
import type {
  BlrCp003MaritalAnswer,
  BlrCp003MaritalFact,
  BlrCp003MaritalOption,
  BlrCp003MaritalQuestionSpec,
  BlrCp003MaritalStatus,
  GeneratedBlrCp003MaritalGroup,
  GeneratedBlrCp003MaritalQuestion,
} from "./cp003-marital-types";

function lowerRelation(relationId: string): string {
  return relationId.toLocaleLowerCase("en-IN").replaceAll("_", "-");
}

function statusLabel(status: BlrCp003MaritalStatus): string {
  return status === "MARRIED" ? "Married" : "Unmarried";
}

function pairKey(personAId: string, personBId: string): string {
  return [personAId, personBId].sort().join("::");
}

function positionOptions(
  random: SeededRandom,
  entries: readonly Omit<BlrCp003MaritalOption, "isCorrect">[],
  correctSemanticKey: string,
  correctIndex: number,
): { options: BlrCp003MaritalOption[]; correctIndex: number } {
  const unique = new Map(entries.map((entry) => [entry.semanticKey, entry]));
  if (unique.size !== 4) {
    throw new Error(`CP-003 marital options require four unique semantics, got ${unique.size}.`);
  }
  const correct = unique.get(correctSemanticKey);
  if (!correct) throw new Error("CP-003 marital options are missing the correct answer.");
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

function relationOptions(
  relationId: BlrRelationId,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003MaritalOption[]; correctIndex: number } {
  const relationIds = [
    relationId,
    ...defaultDistractorPool(relationId).filter((entry) => entry !== relationId),
  ]
    .filter((entry, index, values) => values.indexOf(entry) === index)
    .slice(0, 4);
  if (relationIds.length !== 4) {
    throw new Error(`Unable to build CP-003 marital relation options for ${relationId}.`);
  }
  return positionOptions(
    random,
    relationIds.map((entry) => ({
      text: relationLabel(entry),
      semanticKey: `RELATION:${entry}`,
      errorLabel: entry === relationId ? undefined : "NEARBY_KINSHIP_RELATION",
    })),
    `RELATION:${relationId}`,
    correctIndex,
  );
}

function maritalStatusOptions(
  status: BlrCp003MaritalStatus,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003MaritalOption[]; correctIndex: number } {
  return positionOptions(
    random,
    [
      {
        text: "Married",
        semanticKey: "MARITAL_STATUS:MARRIED",
        errorLabel: status === "MARRIED" ? undefined : "IGNORED_EXPLICIT_UNMARRIED_FACT",
      },
      {
        text: "Unmarried",
        semanticKey: "MARITAL_STATUS:UNMARRIED",
        errorLabel: status === "UNMARRIED" ? undefined : "IGNORED_SPOUSE_EDGE",
      },
      {
        text: "Cannot be determined",
        semanticKey: "MARITAL_STATUS:UNKNOWN",
        errorLabel: "IGNORED_DECISIVE_MARITAL_EVIDENCE",
      },
      {
        text: "The person is not in the family",
        semanticKey: "MARITAL_STATUS:OUTSIDE",
        errorLabel: "IGNORED_NAMED_MEMBER",
      },
    ],
    `MARITAL_STATUS:${status}`,
    correctIndex,
  );
}

function identifyStatusOptions(
  graph: FamilyGraph,
  facts: readonly BlrCp003MaritalFact[],
  status: BlrCp003MaritalStatus,
  correctPersonId: string,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003MaritalOption[]; correctIndex: number } {
  const distractors = graph.persons
    .map((person) => person.personId)
    .filter((personId) => personId !== correctPersonId)
    .filter((personId) => {
      try {
        return resolveBlrCp003MaritalStatus(graph, facts, personId) !== status;
      } catch {
        return false;
      }
    });
  const selected = random.shuffle(distractors).slice(0, 3);
  if (selected.length !== 3) {
    throw new Error("CP-003 marital identify-person item needs three entailed opposite-status distractors.");
  }
  const personIds = [correctPersonId, ...selected];
  return positionOptions(
    random,
    personIds.map((personId) => ({
      text: names[personId] ?? personId,
      semanticKey: `PERSON:${personId}`,
      errorLabel:
        personId === correctPersonId
          ? undefined
          : status === "UNMARRIED"
            ? "SELECTED_MARRIED_MEMBER"
            : "SELECTED_UNMARRIED_MEMBER",
    })),
    `PERSON:${correctPersonId}`,
    correctIndex,
  );
}

function pairIsSibling(graph: FamilyGraph, personAId: string, personBId: string): boolean {
  try {
    const first = solveRelationFromGraph(graph, personAId, personBId).relationId;
    const second = solveRelationFromGraph(graph, personBId, personAId).relationId;
    return (
      ["BROTHER", "SISTER"].includes(first) &&
      ["BROTHER", "SISTER"].includes(second)
    );
  } catch {
    return false;
  }
}

function pairIsParentChild(graph: FamilyGraph, personAId: string, personBId: string): boolean {
  return graph.parentEdges.some(
    (edge) =>
      (edge.parentId === personAId && edge.childId === personBId) ||
      (edge.parentId === personBId && edge.childId === personAId),
  );
}

function pairOptions(
  answer: Extract<BlrCp003MaritalAnswer, { kind: "PAIR" }>,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
  correctIndex: number,
  pairKind: "SIBLING_PAIR" | "PARENT_CHILD_PAIR",
): { options: BlrCp003MaritalOption[]; correctIndex: number } {
  const correctKey = pairKey(answer.personIds[0], answer.personIds[1]);
  const people = graph.persons.map((person) => person.personId);
  const candidates: [string, string][] = [];
  for (let first = 0; first < people.length; first += 1) {
    for (let second = first + 1; second < people.length; second += 1) {
      const personAId = people[first]!;
      const personBId = people[second]!;
      const key = pairKey(personAId, personBId);
      if (key === correctKey) continue;
      const isTarget =
        pairKind === "SIBLING_PAIR"
          ? pairIsSibling(graph, personAId, personBId)
          : pairIsParentChild(graph, personAId, personBId);
      if (!isTarget) candidates.push([personAId, personBId]);
    }
  }
  const selected = random.shuffle(candidates).slice(0, 3);
  if (selected.length !== 3) throw new Error("Unable to build CP-003 marital pair distractors.");
  const allPairs: readonly [string, string][] = [
    [answer.personIds[0], answer.personIds[1]],
    ...selected,
  ];
  return positionOptions(
    random,
    allPairs.map(([personAId, personBId]) => ({
      text: `${names[personAId]} and ${names[personBId]}`,
      semanticKey: `PAIR:${pairKey(personAId, personBId)}`,
      errorLabel:
        pairKey(personAId, personBId) === correctKey
          ? undefined
          : pairKind === "SIBLING_PAIR"
            ? "NON_SIBLING_PAIR"
            : "NON_PARENT_CHILD_PAIR",
    })),
    `PAIR:${correctKey}`,
    correctIndex,
  );
}

function normalizedFacts(
  names: Readonly<Record<string, string>>,
  facts: readonly BlrCp003MaritalFact[],
): string[] {
  return facts.map(
    (fact) =>
      `${names[fact.personId] ?? fact.personId} is explicitly stated to be ${statusLabel(fact.status).toLocaleLowerCase("en-IN")}.`,
  );
}

function renderSharedPrompt(
  names: Readonly<Record<string, string>>,
  facts: readonly BlrCp003MaritalFact[],
): string {
  const relationStatements = BLR_CP003_MARITAL_SCENARIO.clues.map(
    (clue) =>
      `${names[clue.subjectId]} is the ${lowerRelation(clue.relationId)} of ${names[clue.referenceId]}.`,
  );
  const statusStatements = facts.map(
    (fact) => `${names[fact.personId]} is ${statusLabel(fact.status).toLocaleLowerCase("en-IN")}.`,
  );
  return [
    "Read the following family information carefully and answer the questions that follow.",
    [...relationStatements, ...statusStatements].join(" "),
  ].join("\n\n");
}

function generateQuestion(
  spec: BlrCp003MaritalQuestionSpec,
  answer: BlrCp003MaritalAnswer,
  itemIndex: number,
  seed: number,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  facts: readonly BlrCp003MaritalFact[],
  normalized: readonly string[],
): GeneratedBlrCp003MaritalQuestion {
  const random = new SeededRandom(seed * 97 + itemIndex * 131 + 17);
  const correctIndex = (seed + itemIndex) % 4;
  let stem: string;
  let built: { options: BlrCp003MaritalOption[]; correctIndex: number };
  let decisiveTrace: string[];
  let conclusion: string;
  let closestTrapRejection: string;
  let explicitStatusRequired = false;

  switch (spec.kind) {
    case "MARITAL_STATUS": {
      if (answer.kind !== "MARITAL_STATUS") throw new Error("CP-003 marital answer mismatch.");
      stem = `What is the marital status of ${names[spec.personId]}?`;
      built = maritalStatusOptions(answer.status, random, correctIndex);
      const explicit = facts.some((fact) => fact.personId === spec.personId);
      explicitStatusRequired = explicit;
      decisiveTrace = explicit
        ? [`Use the direct statement about ${names[spec.personId]}'s marital status.`]
        : [`${names[spec.personId]} is connected to a named spouse in the family graph.`];
      conclusion = `${names[spec.personId]} is ${statusLabel(answer.status).toLocaleLowerCase("en-IN")}.`;
      closestTrapRejection =
        answer.status === "UNMARRIED"
          ? "Do not infer unmarried status merely because a spouse is not otherwise named; use the explicit statement."
          : "A displayed spouse edge is sufficient to establish married status.";
      break;
    }
    case "IDENTIFY_BY_MARITAL_STATUS": {
      if (answer.kind !== "PERSON") throw new Error("CP-003 marital person answer mismatch.");
      stem = `Who among the following is ${statusLabel(spec.status).toLocaleLowerCase("en-IN")}?`;
      built = identifyStatusOptions(
        graph,
        facts,
        spec.status,
        answer.personId,
        names,
        random,
        correctIndex,
      );
      explicitStatusRequired = spec.status === "UNMARRIED";
      decisiveTrace = [
        `The passage explicitly states that ${names[answer.personId]} is ${statusLabel(spec.status).toLocaleLowerCase("en-IN")}.`,
      ];
      conclusion = `${names[answer.personId]} is the required ${statusLabel(spec.status).toLocaleLowerCase("en-IN")} member.`;
      closestTrapRejection = "Do not classify a member as unmarried only because no spouse clue is shown.";
      break;
    }
    case "RELATION": {
      if (answer.kind !== "RELATION") throw new Error("CP-003 marital relation answer mismatch.");
      stem = `How is ${names[spec.subjectId]} related to ${names[spec.referenceId]}?`;
      built = relationOptions(answer.relationId, random, correctIndex);
      const solved = solveRelationFromGraph(graph, spec.subjectId, spec.referenceId);
      decisiveTrace = [
        `Trace ${solved.path.personIds.map((personId) => names[personId]).join(" → ")}.`,
      ];
      conclusion = `${names[spec.subjectId]} is the ${lowerRelation(answer.relationId)} of ${names[spec.referenceId]}.`;
      closestTrapRejection = "Read the relation in the exact direction asked.";
      break;
    }
    case "SIBLING_PAIR": {
      if (answer.kind !== "PAIR") throw new Error("CP-003 marital sibling-pair answer mismatch.");
      stem = "Which of the following pairs consists of siblings?";
      built = pairOptions(answer, graph, names, random, correctIndex, "SIBLING_PAIR");
      decisiveTrace = [
        `${names[answer.personIds[0]]} and ${names[answer.personIds[1]]} share a modelled parent.`,
      ];
      conclusion = `${names[answer.personIds[0]]} and ${names[answer.personIds[1]]} are siblings.`;
      closestTrapRejection = "A same-generation pair is not automatically a sibling pair.";
      break;
    }
    case "PARENT_CHILD_PAIR": {
      if (answer.kind !== "PAIR") throw new Error("CP-003 marital parent-child answer mismatch.");
      stem = "Which of the following pairs consists of a parent and child?";
      built = pairOptions(answer, graph, names, random, correctIndex, "PARENT_CHILD_PAIR");
      decisiveTrace = [
        `${names[spec.parentId]} is directly placed as the parent of ${names[spec.childId]}.`,
      ];
      conclusion = `${names[spec.parentId]} and ${names[spec.childId]} form the required parent-child pair.`;
      closestTrapRejection = "Do not choose a grandparent-grandchild or sibling pair.";
      break;
    }
  }

  return {
    itemId: `${BLR_CP003_MARITAL_SCENARIO.scenarioId}-Q${String(itemIndex + 1).padStart(2, "0")}`,
    prototypeId: spec.prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    stem,
    options: built.options,
    correctIndex: built.correctIndex,
    answer,
    explanation: {
      normalizedFacts: normalized,
      decisiveTrace,
      conclusion,
      closestTrapRejection,
    },
    metadata: {
      hiddenGraphAnswerAgreed: true,
      explicitStatusRequired,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
    },
  };
}

export function generateBlrCp003MaritalGroup(
  seed: number,
): GeneratedBlrCp003MaritalGroup {
  const nameRandom = new SeededRandom(seed);
  const names = assignNamesForClues(BLR_CP003_MARITAL_SCENARIO.clues, nameRandom);
  if (!proveBlrCp003MaritalHiddenAgreement(BLR_CP003_MARITAL_SCENARIO, names)) {
    throw new Error("CP-003 marital hidden graph disagrees with displayed clues.");
  }
  if (!proveEveryBlrCp003MaritalInputContributes(BLR_CP003_MARITAL_SCENARIO, names)) {
    throw new Error("CP-003 marital scenario contains a decorative clue or status fact.");
  }

  const { graph, answers } = solveBlrCp003MaritalFromClues(
    BLR_CP003_MARITAL_SCENARIO,
    names,
  );
  const normalized = [
    ...BLR_CP003_MARITAL_SCENARIO.clues.map((clue) =>
      clueToNormalizedText(clue, names),
    ),
    ...normalizedFacts(names, BLR_CP003_MARITAL_SCENARIO.maritalFacts),
  ];

  let unsupportedStatusInferenceRejected = false;
  try {
    resolveBlrCp003MaritalStatus(
      graph,
      BLR_CP003_MARITAL_SCENARIO.maritalFacts,
      "D",
    );
  } catch {
    unsupportedStatusInferenceRejected = true;
  }
  if (!unsupportedStatusInferenceRejected) {
    throw new Error("CP-003 marital runtime inferred unmarried status from a missing spouse edge.");
  }

  let contradictoryStatusRejected = false;
  try {
    const contradictionGraph: FamilyGraph = {
      ...materializeBlrCp003MaritalHiddenGraph(BLR_CP003_MARITAL_SCENARIO, names),
      spouseEdges: [
        ...BLR_CP003_MARITAL_SCENARIO.hiddenGraph.spouseEdges,
        { personAId: "E", personBId: "H" },
      ],
    };
    validateBlrCp003MaritalFacts(
      contradictionGraph,
      BLR_CP003_MARITAL_SCENARIO.maritalFacts,
    );
  } catch {
    contradictoryStatusRejected = true;
  }
  if (!contradictoryStatusRejected) {
    throw new Error("CP-003 marital runtime accepted a spouse edge for an explicitly unmarried member.");
  }

  const questions = BLR_CP003_MARITAL_SCENARIO.questions.map((spec, index) =>
    generateQuestion(
      spec,
      answers[index]!,
      index,
      seed,
      graph,
      names,
      BLR_CP003_MARITAL_SCENARIO.maritalFacts,
      normalized,
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
    scenarioId: BLR_CP003_MARITAL_SCENARIO.scenarioId,
    topologyId: BLR_CP003_MARITAL_SCENARIO.topologyId,
    sharedPrompt: renderSharedPrompt(
      names,
      BLR_CP003_MARITAL_SCENARIO.maritalFacts,
    ),
    personNames: names,
    reconstructedFamily: graph,
    maritalFacts: BLR_CP003_MARITAL_SCENARIO.maritalFacts,
    questions,
    metadata: {
      runtimeVersion: "blr-cp003-marital-prototype-v1",
      hiddenGraphAgreedWithClueGraph: true,
      unsupportedStatusInferenceRejected: true,
      contradictoryStatusRejected: true,
      everyClueAndStatusFactContributes: true,
      clueCount: 7,
      maritalFactCount: 1,
      itemCount: 6,
      semanticFingerprint: stableHash([
        BLR_CP003_MARITAL_SCENARIO.topologyId,
        ...BLR_CP003_MARITAL_SCENARIO.clues.map(
          (clue) => `${clue.subjectId}:${clue.relationId}:${clue.referenceId}`,
        ),
        ...BLR_CP003_MARITAL_SCENARIO.maritalFacts.map(
          (fact) => `${fact.personId}:${fact.status}:${fact.evidence}`,
        ),
        ...questions.map((question) => blrCp003MaritalSemanticKey(question.answer)),
      ]),
    },
  };
}
