import {
  generationLabel,
  generationRelationForDelta,
  type GenerationRelationId,
} from "../foundation/family-analysis";
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
import { BLR_CP003_SCENARIOS, getBlrCp003Scenario } from "./cp003-scenario-library";
import {
  blrCp003SemanticKey,
  proveEveryBlrCp003ClueContributes,
  solveBlrCp003ScenarioFromClues,
} from "./cp003-solver";
import type {
  BlrCp003Explanation,
  BlrCp003Option,
  BlrCp003QuestionSpec,
  BlrCp003ScenarioTemplate,
  BlrCp003SemanticAnswer,
  GeneratedBlrCp003Question,
  GeneratedBlrCp003QuestionGroup,
} from "./cp003-types";

function lowerRelation(relationId: string): string {
  return relationId.toLocaleLowerCase("en-IN").replaceAll("_", "-");
}

function renderSharedPrompt(
  scenario: BlrCp003ScenarioTemplate,
  names: Readonly<Record<string, string>>,
): string {
  const statements = scenario.clues.map(
    (clue) =>
      `${names[clue.subjectId]} is the ${lowerRelation(clue.relationId)} of ${names[clue.referenceId]}.`,
  );
  return [
    "Read the following information carefully and answer the questions that follow.",
    statements.join(" "),
  ].join("\n\n");
}

function shuffledOptions(
  random: SeededRandom,
  entries: readonly Omit<BlrCp003Option, "isCorrect">[],
  correctSemanticKey: string,
): { options: BlrCp003Option[]; correctIndex: number } {
  const unique = new Map(entries.map((entry) => [entry.semanticKey, entry]));
  if (unique.size !== 4) {
    throw new Error(`CP-003 option construction expected four unique semantics, got ${unique.size}.`);
  }
  const options = random.shuffle([...unique.values()]).map((entry) => ({
    ...entry,
    isCorrect: entry.semanticKey === correctSemanticKey,
  }));
  const correctIndex = options.findIndex((entry) => entry.isCorrect);
  if (correctIndex < 0 || options.filter((entry) => entry.isCorrect).length !== 1) {
    throw new Error("CP-003 options do not contain exactly one correct answer.");
  }
  return { options, correctIndex };
}

function relationOptions(
  relationId: BlrRelationId,
  random: SeededRandom,
): { options: BlrCp003Option[]; correctIndex: number } {
  const ids = [
    relationId,
    ...defaultDistractorPool(relationId).filter((entry) => entry !== relationId),
  ].filter((entry, index, values) => values.indexOf(entry) === index).slice(0, 4);
  if (ids.length !== 4) throw new Error(`Unable to build relation options for ${relationId}.`);
  return shuffledOptions(
    random,
    ids.map((entry) => ({
      text: relationLabel(entry),
      semanticKey: `RELATION:${entry}`,
      errorLabel: entry === relationId ? undefined : "NEARBY_KINSHIP_RELATION",
    })),
    `RELATION:${relationId}`,
  );
}

function claimOptions(
  answer: Extract<BlrCp003SemanticAnswer, { kind: "CLAIM" }>,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
): { options: BlrCp003Option[]; correctIndex: number } {
  const relationIds = [
    answer.relationId,
    ...defaultDistractorPool(answer.relationId).filter(
      (entry) => entry !== answer.relationId,
    ),
  ]
    .filter((entry, index, values) => values.indexOf(entry) === index)
    .slice(0, 4);
  const entries = relationIds.map((relationId) => ({
    text: `${names[answer.subjectId]} is the ${lowerRelation(relationId)} of ${names[answer.referenceId]}.`,
    semanticKey: `CLAIM:${answer.subjectId}:${relationId}:${answer.referenceId}`,
    errorLabel: relationId === answer.relationId ? undefined : "FALSE_RELATION_CLAIM",
  }));
  return shuffledOptions(random, entries, blrCp003SemanticKey(answer));
}

function pairOptions(
  answer: Extract<BlrCp003SemanticAnswer, { kind: "PAIR" }>,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
): { options: BlrCp003Option[]; correctIndex: number } {
  const pairKey = (personAId: string, personBId: string): string =>
    [personAId, personBId].sort().join("::");
  const spouseKeys = new Set(
    graph.spouseEdges.map((edge) => pairKey(edge.personAId, edge.personBId)),
  );
  const correctPairKey = pairKey(answer.personIds[0], answer.personIds[1]);
  const people = graph.persons.map((person) => person.personId);
  const distractors: readonly [string, string][] = [];
  const candidates: [string, string][] = [];
  for (let first = 0; first < people.length; first += 1) {
    for (let second = first + 1; second < people.length; second += 1) {
      const candidate: [string, string] = [people[first]!, people[second]!];
      const key = pairKey(candidate[0], candidate[1]);
      if (key !== correctPairKey && !spouseKeys.has(key)) candidates.push(candidate);
    }
  }
  const selected = random.shuffle(candidates).slice(0, 3);
  if (selected.length !== 3) throw new Error("CP-003 could not build three non-spouse pair distractors.");
  const allPairs: readonly [string, string][] = [
    [answer.personIds[0], answer.personIds[1]],
    ...selected,
  ];
  void distractors;
  return shuffledOptions(
    random,
    allPairs.map(([personAId, personBId]) => ({
      text: `${names[personAId]} and ${names[personBId]}`,
      semanticKey: `PAIR:${pairKey(personAId, personBId)}`,
      errorLabel:
        pairKey(personAId, personBId) === correctPairKey
          ? undefined
          : "NON_SPOUSE_PAIR",
    })),
    `PAIR:${correctPairKey}`,
  );
}

function genderOptions(
  answer: Extract<BlrCp003SemanticAnswer, { kind: "GENDER" }>,
  random: SeededRandom,
): { options: BlrCp003Option[]; correctIndex: number } {
  return shuffledOptions(
    random,
    [
      { text: "Male", semanticKey: "GENDER:MALE", errorLabel: answer.gender === "MALE" ? undefined : "WRONG_GENDER" },
      { text: "Female", semanticKey: "GENDER:FEMALE", errorLabel: answer.gender === "FEMALE" ? undefined : "WRONG_GENDER" },
      { text: "Cannot be determined", semanticKey: "GENDER:UNKNOWN", errorLabel: "IGNORED_GENDER_EVIDENCE" },
      { text: "The person is not in the family", semanticKey: "GENDER:OUTSIDE", errorLabel: "IGNORED_NAMED_MEMBER" },
    ],
    `GENDER:${answer.gender}`,
  );
}

const GENERATION_IDS: readonly GenerationRelationId[] = [
  "SAME_GENERATION",
  "ONE_GENERATION_ABOVE",
  "ONE_GENERATION_BELOW",
  "TWO_GENERATIONS_ABOVE",
  "TWO_GENERATIONS_BELOW",
];

function generationOptions(
  answer: Extract<BlrCp003SemanticAnswer, { kind: "GENERATION" }>,
  random: SeededRandom,
): { options: BlrCp003Option[]; correctIndex: number } {
  const ordered = [
    answer.generationRelationId,
    ...GENERATION_IDS.filter((entry) => entry !== answer.generationRelationId),
  ].slice(0, 4);
  return shuffledOptions(
    random,
    ordered.map((entry) => ({
      text: generationLabel(entry),
      semanticKey: `GENERATION:${entry}`,
      errorLabel:
        entry === answer.generationRelationId ? undefined : "WRONG_GENERATION_LEVEL",
    })),
    `GENERATION:${answer.generationRelationId}`,
  );
}

function explanationFor(
  spec: BlrCp003QuestionSpec,
  answer: BlrCp003SemanticAnswer,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  normalizedClues: readonly string[],
): BlrCp003Explanation {
  if (spec.kind === "RELATION") {
    const solved = solveRelationFromGraph(graph, spec.subjectId, spec.referenceId);
    const pathNames = solved.path.personIds.map((personId) => names[personId]);
    return {
      strategy: "SHARED_GRAPH_EXACT_CLOSURE",
      familyPlacements: normalizedClues,
      queryTrace: [
        `Trace the relation from ${names[spec.subjectId]} to ${names[spec.referenceId]}.`,
        `The supported family path is ${pathNames.join(" → ")}.`,
      ],
      conclusion: `${names[spec.subjectId]} is the ${lowerRelation(solved.relationId)} of ${names[spec.referenceId]}.`,
      closestTrapRejection: "Do not reverse the two people named in the question.",
    };
  }
  if (spec.kind === "MARRIED_PAIR" && answer.kind === "PAIR") {
    return {
      strategy: "SHARED_GRAPH_EXACT_CLOSURE",
      familyPlacements: normalizedClues,
      queryTrace: [
        `${names[answer.personIds[0]]} and ${names[answer.personIds[1]]} are joined by a spouse clue.`,
      ],
      conclusion: `${names[answer.personIds[0]]} and ${names[answer.personIds[1]]} form the required married pair.`,
      closestTrapRejection: "A same-generation or blood relation pair is not automatically a married couple.",
    };
  }
  if (spec.kind === "GENDER" && answer.kind === "GENDER") {
    return {
      strategy: "SHARED_GRAPH_EXACT_CLOSURE",
      familyPlacements: normalizedClues,
      queryTrace: [`The relation wording directly fixes ${names[spec.personId]}'s gender.`],
      conclusion: `${names[spec.personId]} is ${answer.gender.toLocaleLowerCase("en-IN")}.`,
      closestTrapRejection: "Do not ignore a gendered relation such as husband, wife, son or daughter.",
    };
  }
  if (spec.kind === "GENERATION" && answer.kind === "GENERATION") {
    return {
      strategy: "SHARED_GRAPH_EXACT_CLOSURE",
      familyPlacements: normalizedClues,
      queryTrace: [
        `Place ${names[spec.subjectId]} and ${names[spec.referenceId]} on the family generation rows.`,
      ],
      conclusion: `${names[spec.subjectId]} is ${generationLabel(answer.generationRelationId).toLocaleLowerCase("en-IN")} relative to ${names[spec.referenceId]}.`,
      closestTrapRejection: "Spouses and siblings remain in the same generation.",
    };
  }
  if (spec.kind === "TRUE_CLAIM" && answer.kind === "CLAIM") {
    return {
      strategy: "SHARED_GRAPH_EXACT_CLOSURE",
      familyPlacements: normalizedClues,
      queryTrace: [
        `Solve the relation of ${names[answer.subjectId]} to ${names[answer.referenceId]} before checking the statements.`,
      ],
      conclusion: `${names[answer.subjectId]} is the ${lowerRelation(answer.relationId)} of ${names[answer.referenceId]}.`,
      closestTrapRejection: "A statement with the correct people but the reverse relation is still false.",
    };
  }
  throw new Error(`Unsupported CP-003 explanation combination for ${spec.kind}/${answer.kind}.`);
}

function generateQuestion(
  scenario: BlrCp003ScenarioTemplate,
  spec: BlrCp003QuestionSpec,
  answer: BlrCp003SemanticAnswer,
  itemIndex: number,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  normalizedClues: readonly string[],
  random: SeededRandom,
): GeneratedBlrCp003Question {
  let stem: string;
  let built: { options: BlrCp003Option[]; correctIndex: number };

  switch (spec.kind) {
    case "RELATION":
      if (answer.kind !== "RELATION") throw new Error("CP-003 relation answer mismatch.");
      stem = `How is ${names[spec.subjectId]} related to ${names[spec.referenceId]}?`;
      built = relationOptions(answer.relationId, random);
      break;
    case "MARRIED_PAIR":
      if (answer.kind !== "PAIR") throw new Error("CP-003 pair answer mismatch.");
      stem = "Which of the following pairs is married to each other?";
      built = pairOptions(answer, graph, names, random);
      break;
    case "GENDER":
      if (answer.kind !== "GENDER") throw new Error("CP-003 gender answer mismatch.");
      stem = `What is the gender of ${names[spec.personId]}?`;
      built = genderOptions(answer, random);
      break;
    case "GENERATION":
      if (answer.kind !== "GENERATION") throw new Error("CP-003 generation answer mismatch.");
      stem = `How is ${names[spec.subjectId]} placed relative to ${names[spec.referenceId]} by generation?`;
      built = generationOptions(answer, random);
      break;
    case "TRUE_CLAIM":
      if (answer.kind !== "CLAIM") throw new Error("CP-003 claim answer mismatch.");
      stem = "Which of the following statements is definitely true?";
      built = claimOptions(answer, names, random);
      break;
  }

  return {
    itemId: `${scenario.scenarioId}-Q${String(itemIndex + 1).padStart(2, "0")}`,
    checkpointId: "BLR-CP-003",
    prototypeId: spec.prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    questionKind: spec.kind,
    stem,
    options: built.options,
    correctIndex: built.correctIndex,
    answer,
    explanation: explanationFor(spec, answer, graph, names, normalizedClues),
    metadata: {
      independentSolverAgreed: true,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
    },
  };
}

function difficultyFor(scenario: BlrCp003ScenarioTemplate): "EASY" | "MEDIUM" | "HARD" {
  if (scenario.clues.length <= 4) return "EASY";
  if (scenario.clues.length <= 6) return "MEDIUM";
  return "HARD";
}

export function generateBlrCp003ScenarioGroup(
  scenarioId: string,
  seed: number,
): GeneratedBlrCp003QuestionGroup {
  const scenario = getBlrCp003Scenario(scenarioId);
  const random = new SeededRandom(seed);
  const names = assignNamesForClues(scenario.clues, random);
  const { graph, answers } = solveBlrCp003ScenarioFromClues(scenario, names);
  if (!proveEveryBlrCp003ClueContributes(scenario, names)) {
    throw new Error(`Scenario ${scenario.scenarioId} contains a decorative clue.`);
  }
  const normalizedClues = scenario.clues.map((clue) => clueToNormalizedText(clue, names));
  const questions = scenario.questions.map((spec, index) =>
    generateQuestion(
      scenario,
      spec,
      answers[index]!,
      index,
      graph,
      names,
      normalizedClues,
      random,
    ),
  );
  const semanticFingerprint = stableHash([
    scenario.topologyId,
    ...scenario.clues.map(
      (clue) => `${clue.subjectId}:${clue.relationId}:${clue.referenceId}`,
    ),
    ...scenario.questions.map((spec) => JSON.stringify(spec)),
  ]);

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-003",
    groupPrototypeId: "BLR-CP003-PROT-MULTI-ITEM-GROUP",
    permanentQlIds: [],
    prototypeOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    seed,
    scenarioId: scenario.scenarioId,
    topologyId: scenario.topologyId,
    difficulty: difficultyFor(scenario),
    sharedPrompt: renderSharedPrompt(scenario, names),
    structuredClues: scenario.clues,
    personNames: names,
    reconstructedFamily: graph,
    questions,
    metadata: {
      runtimeVersion: "blr-cp003-prototype-v1",
      familyGraphValid: true,
      sharedPromptSolvedOnce: true,
      allItemsIndependentlySolved: true,
      everyClueContributes: true,
      clueCount: scenario.clues.length,
      itemCount: questions.length,
      semanticFingerprint,
    },
  };
}

export function generateBlrCp003PrototypeGroup(seed: number): GeneratedBlrCp003QuestionGroup {
  const scenario = BLR_CP003_SCENARIOS[Math.abs(Math.trunc(seed)) % BLR_CP003_SCENARIOS.length]!;
  return generateBlrCp003ScenarioGroup(scenario.scenarioId, seed);
}

void generationRelationForDelta;
