import {
  exactLineageRelationLabel,
  solveExactLineageRelationFromGraph,
  swapExactLineageFamily,
  swapExactLineageGender,
  swapExactLineageSide,
} from "../BLR-CP-001/lineage-prototype-solver";
import type { BlrExactLineageRelationId } from "../BLR-CP-001/lineage-prototype-types";
import { generationDelta } from "../foundation/family-analysis";
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
import {
  BLR_CP003_LINEAGE_SCENARIOS,
  getBlrCp003LineageScenario,
} from "./cp003-lineage-scenarios";
import {
  blrCp003GenerationDistanceLabel,
  blrCp003LineageSemanticKey,
  proveBlrCp003LineageHiddenAgreement,
  proveEveryBlrCp003LineageClueContributes,
  renderBlrCp003GenerationRows,
  solveBlrCp003LineageFromClues,
} from "./cp003-lineage-solver";
import type {
  BlrCp003GenerationDistanceId,
  BlrCp003LineageAnswer,
  BlrCp003LineageOption,
  BlrCp003LineageQuestionSpec,
  BlrCp003LineageScenario,
  GeneratedBlrCp003LineageGroup,
  GeneratedBlrCp003LineageQuestion,
} from "./cp003-lineage-types";

function lowerRelation(relationId: string): string {
  return relationId.toLocaleLowerCase("en-IN").replaceAll("_", "-");
}

function positionOptions(
  random: SeededRandom,
  entries: readonly Omit<BlrCp003LineageOption, "isCorrect">[],
  correctSemanticKey: string,
  correctIndex: number,
): { options: BlrCp003LineageOption[]; correctIndex: number } {
  const unique = new Map(entries.map((entry) => [entry.semanticKey, entry]));
  if (unique.size !== 4) {
    throw new Error(`CP-003 lineage options require four unique semantics, got ${unique.size}.`);
  }
  const correct = unique.get(correctSemanticKey);
  if (!correct) throw new Error("CP-003 lineage options are missing the correct answer.");
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

function exactLineageOptions(
  relationId: BlrExactLineageRelationId,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003LineageOption[]; correctIndex: number } {
  const ids = [
    relationId,
    swapExactLineageSide(relationId),
    swapExactLineageGender(relationId),
    swapExactLineageFamily(relationId),
  ];
  return positionOptions(
    random,
    ids.map((entry) => ({
      text: exactLineageRelationLabel(entry),
      semanticKey: `EXACT_LINEAGE:${entry}`,
      errorLabel:
        entry === relationId
          ? undefined
          : entry === swapExactLineageSide(relationId)
            ? "MATERNAL_PATERNAL_SWAP"
            : entry === swapExactLineageGender(relationId)
              ? "WRONG_GENDER"
              : "GRANDPARENT_UNCLE_AUNT_CONFUSION",
    })),
    `EXACT_LINEAGE:${relationId}`,
    correctIndex,
  );
}

function relationOptions(
  relationId: BlrRelationId,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003LineageOption[]; correctIndex: number } {
  const ids = [
    relationId,
    ...defaultDistractorPool(relationId).filter((entry) => entry !== relationId),
  ]
    .filter((entry, index, values) => values.indexOf(entry) === index)
    .slice(0, 4);
  if (ids.length !== 4) {
    throw new Error(`Unable to build CP-003 lineage relation options for ${relationId}.`);
  }
  return positionOptions(
    random,
    ids.map((entry) => ({
      text: relationLabel(entry),
      semanticKey: `RELATION:${entry}`,
      errorLabel: entry === relationId ? undefined : "WRONG_RELATION_DEPTH_OR_DIRECTION",
    })),
    `RELATION:${relationId}`,
    correctIndex,
  );
}

function personOptions(
  correctPersonId: string,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003LineageOption[]; correctIndex: number } {
  const distractors = random
    .shuffle(
      graph.persons
        .map((person) => person.personId)
        .filter((personId) => personId !== correctPersonId),
    )
    .slice(0, 3);
  if (distractors.length !== 3) {
    throw new Error("CP-003 lineage person item needs three distractors.");
  }
  return positionOptions(
    random,
    [correctPersonId, ...distractors].map((personId) => ({
      text: names[personId] ?? personId,
      semanticKey: `PERSON:${personId}`,
      errorLabel: personId === correctPersonId ? undefined : "WRONG_FAMILY_BRANCH",
    })),
    `PERSON:${correctPersonId}`,
    correctIndex,
  );
}

const GENERATION_DISTANCE_IDS: readonly BlrCp003GenerationDistanceId[] = [
  "SAME_GENERATION",
  "ONE_GENERATION_ABOVE",
  "TWO_GENERATIONS_ABOVE",
  "THREE_GENERATIONS_ABOVE",
  "ONE_GENERATION_BELOW",
  "TWO_GENERATIONS_BELOW",
  "THREE_GENERATIONS_BELOW",
];

function generationOptions(
  relationId: BlrCp003GenerationDistanceId,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003LineageOption[]; correctIndex: number } {
  const selected = [
    relationId,
    ...GENERATION_DISTANCE_IDS.filter((entry) => entry !== relationId),
  ].slice(0, 4);
  return positionOptions(
    random,
    selected.map((entry) => ({
      text: blrCp003GenerationDistanceLabel(entry),
      semanticKey: `GENERATION_DISTANCE:${entry}`,
      errorLabel: entry === relationId ? undefined : "WRONG_GENERATION_DISTANCE",
    })),
    `GENERATION_DISTANCE:${relationId}`,
    correctIndex,
  );
}

function claimOptions(
  answer: Extract<BlrCp003LineageAnswer, { kind: "CLAIM" }>,
  names: Readonly<Record<string, string>>,
  random: SeededRandom,
  correctIndex: number,
): { options: BlrCp003LineageOption[]; correctIndex: number } {
  const ids = [
    answer.relationId,
    ...defaultDistractorPool(answer.relationId).filter(
      (entry) => entry !== answer.relationId,
    ),
  ]
    .filter((entry, index, values) => values.indexOf(entry) === index)
    .slice(0, 4);
  if (ids.length !== 4) throw new Error("Unable to build CP-003 lineage claim options.");
  return positionOptions(
    random,
    ids.map((relationId) => ({
      text: `${names[answer.subjectId]} is the ${lowerRelation(relationId)} of ${names[answer.referenceId]}.`,
      semanticKey: `CLAIM:${answer.subjectId}:${relationId}:${answer.referenceId}`,
      errorLabel: relationId === answer.relationId ? undefined : "FALSE_RELATION_CLAIM",
    })),
    `CLAIM:${answer.subjectId}:${answer.relationId}:${answer.referenceId}`,
    correctIndex,
  );
}

function renderSharedPrompt(
  scenario: BlrCp003LineageScenario,
  names: Readonly<Record<string, string>>,
): string {
  const statements = scenario.clues.map(
    (clue) =>
      `${names[clue.subjectId]} is the ${lowerRelation(clue.relationId)} of ${names[clue.referenceId]}.`,
  );
  return [
    "Read the following family information carefully and answer the questions that follow.",
    statements.join(" "),
  ].join("\n\n");
}

function maxGenerationSpan(
  graph: FamilyGraph,
  rootId: string,
): 2 | 3 {
  const maximum = Math.max(
    ...graph.persons.map((person) =>
      Math.abs(generationDelta(graph, person.personId, rootId)),
    ),
  );
  if (maximum === 2 || maximum === 3) return maximum;
  throw new Error(`CP-003 lineage scenario has unsupported generation span ${maximum}.`);
}

function generateQuestion(
  scenario: BlrCp003LineageScenario,
  spec: BlrCp003LineageQuestionSpec,
  answer: BlrCp003LineageAnswer,
  itemIndex: number,
  seed: number,
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  normalizedClues: readonly string[],
  generationRows: readonly string[],
): GeneratedBlrCp003LineageQuestion {
  const random = new SeededRandom(seed * 149 + itemIndex * 211 + 31);
  const correctIndex = (seed + itemIndex) % 4;
  let stem: string;
  let built: { options: BlrCp003LineageOption[]; correctIndex: number };
  let pathTrace: string[];
  let conclusion: string;
  let closestTrapRejection: string;
  let exactLineageSolverReused = false;

  switch (spec.kind) {
    case "EXACT_LINEAGE": {
      if (answer.kind !== "EXACT_LINEAGE") throw new Error("CP-003 exact-lineage answer mismatch.");
      stem = `What is the exact relation of ${names[spec.subjectId]} to ${names[spec.referenceId]}?`;
      built = exactLineageOptions(answer.relationId, random, correctIndex);
      const solved = solveExactLineageRelationFromGraph(
        graph,
        spec.subjectId,
        spec.referenceId,
      );
      exactLineageSolverReused = true;
      pathTrace = [
        `Trace ${solved.path.personIds.map((personId) => names[personId]).join(" → ")}.`,
        `The middle parent ${names[solved.lineageParentId]} fixes the ${solved.lineageSide.toLocaleLowerCase("en-IN")} side.`,
      ];
      conclusion = `${names[spec.subjectId]} is the ${exactLineageRelationLabel(answer.relationId).toLocaleLowerCase("en-IN")} of ${names[spec.referenceId]}.`;
      closestTrapRejection = "Do not swap the maternal and paternal branches after finding the broad relation.";
      break;
    }
    case "IDENTIFY_BY_EXACT_LINEAGE": {
      if (answer.kind !== "PERSON") throw new Error("CP-003 exact-lineage person answer mismatch.");
      stem = `Who is the ${exactLineageRelationLabel(spec.exactRelationId).toLocaleLowerCase("en-IN")} of ${names[spec.referenceId]}?`;
      built = personOptions(answer.personId, graph, names, random, correctIndex);
      const solved = solveExactLineageRelationFromGraph(
        graph,
        answer.personId,
        spec.referenceId,
      );
      exactLineageSolverReused = true;
      pathTrace = [
        `Trace ${solved.path.personIds.map((personId) => names[personId]).join(" → ")}.`,
      ];
      conclusion = `${names[answer.personId]} is the ${exactLineageRelationLabel(spec.exactRelationId).toLocaleLowerCase("en-IN")} of ${names[spec.referenceId]}.`;
      closestTrapRejection = "A person on the opposite parental branch has the same broad title but the wrong exact lineage.";
      break;
    }
    case "RELATION": {
      if (answer.kind !== "RELATION") throw new Error("CP-003 great-relation answer mismatch.");
      stem = `How is ${names[spec.subjectId]} related to ${names[spec.referenceId]}?`;
      built = relationOptions(answer.relationId, random, correctIndex);
      const solved = solveRelationFromGraph(graph, spec.subjectId, spec.referenceId);
      pathTrace = [
        `Trace ${solved.path.personIds.map((personId) => names[personId]).join(" → ")}.`,
      ];
      conclusion = `${names[spec.subjectId]} is the ${lowerRelation(answer.relationId)} of ${names[spec.referenceId]}.`;
      closestTrapRejection = "Count every parent-child step before choosing grand or great-grand terminology.";
      break;
    }
    case "IDENTIFY_BY_RELATION": {
      if (answer.kind !== "PERSON") throw new Error("CP-003 great-relation person answer mismatch.");
      stem = `Who is the ${lowerRelation(spec.relationId)} of ${names[spec.referenceId]}?`;
      built = personOptions(answer.personId, graph, names, random, correctIndex);
      const solved = solveRelationFromGraph(graph, answer.personId, spec.referenceId);
      pathTrace = [
        `Trace ${solved.path.personIds.map((personId) => names[personId]).join(" → ")}.`,
      ];
      conclusion = `${names[answer.personId]} is the ${lowerRelation(spec.relationId)} of ${names[spec.referenceId]}.`;
      closestTrapRejection = "Do not stop one generation early at grandchild.";
      break;
    }
    case "GENERATION_DISTANCE": {
      if (answer.kind !== "GENERATION_DISTANCE") throw new Error("CP-003 generation answer mismatch.");
      stem = `How is ${names[spec.subjectId]} placed relative to ${names[spec.referenceId]} by generation?`;
      built = generationOptions(answer.relationId, random, correctIndex);
      pathTrace = [
        `${names[spec.subjectId]} and ${names[spec.referenceId]} are separated by ${Math.abs(generationDelta(graph, spec.subjectId, spec.referenceId))} parent-child levels.`,
      ];
      conclusion = `${names[spec.subjectId]} is ${blrCp003GenerationDistanceLabel(answer.relationId).toLocaleLowerCase("en-IN")} relative to ${names[spec.referenceId]}.`;
      closestTrapRejection = "Direction matters: above and below reverse when the two people are swapped.";
      break;
    }
    case "TRUE_CLAIM": {
      if (answer.kind !== "CLAIM") throw new Error("CP-003 lineage claim answer mismatch.");
      stem = "Which of the following statements is definitely true?";
      built = claimOptions(answer, names, random, correctIndex);
      const solved = solveRelationFromGraph(graph, answer.subjectId, answer.referenceId);
      pathTrace = [
        `Trace ${solved.path.personIds.map((personId) => names[personId]).join(" → ")}.`,
      ];
      conclusion = `${names[answer.subjectId]} is the ${lowerRelation(answer.relationId)} of ${names[answer.referenceId]}.`;
      closestTrapRejection = "A statement with the correct people but wrong direction or gender remains false.";
      break;
    }
  }

  return {
    itemId: `${scenario.scenarioId}-Q${String(itemIndex + 1).padStart(2, "0")}`,
    prototypeId: spec.prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    stem,
    options: built.options,
    correctIndex: built.correctIndex,
    answer,
    explanation: {
      normalizedClues,
      pathTrace,
      generationRows,
      conclusion,
      closestTrapRejection,
    },
    metadata: {
      hiddenGraphAnswerAgreed: true,
      exactLineageSolverReused,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
    },
  };
}

export function generateBlrCp003LineageGroup(
  scenarioId: string,
  seed: number,
): GeneratedBlrCp003LineageGroup {
  const scenario = getBlrCp003LineageScenario(scenarioId);
  const names = assignNamesForClues(scenario.clues, new SeededRandom(seed));
  if (!proveBlrCp003LineageHiddenAgreement(scenario, names)) {
    throw new Error(`CP-003 lineage hidden graph disagrees for ${scenario.scenarioId}.`);
  }
  if (!proveEveryBlrCp003LineageClueContributes(scenario, names)) {
    throw new Error(`CP-003 lineage scenario ${scenario.scenarioId} contains a decorative clue.`);
  }
  const { graph, answers } = solveBlrCp003LineageFromClues(scenario, names);
  const normalizedClues = scenario.clues.map((clue) =>
    clueToNormalizedText(clue, names),
  );
  const generationRows = renderBlrCp003GenerationRows(
    graph,
    scenario.displayRootId,
    names,
  );
  const questions = scenario.questions.map((spec, index) =>
    generateQuestion(
      scenario,
      spec,
      answers[index]!,
      index,
      seed,
      graph,
      names,
      normalizedClues,
      generationRows,
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
    scenarioId: scenario.scenarioId,
    topologyId: scenario.topologyId,
    sharedPrompt: renderSharedPrompt(scenario, names),
    personNames: names,
    reconstructedFamily: graph,
    generationRows,
    questions,
    metadata: {
      runtimeVersion: "blr-cp003-lineage-saturation-v1",
      hiddenGraphAgreedWithClueGraph: true,
      everyClueContributes: true,
      exactLineageSolverReused: true,
      clueCount: scenario.clues.length,
      itemCount: 6,
      maxGenerationSpan: maxGenerationSpan(graph, scenario.displayRootId),
      semanticFingerprint: stableHash([
        scenario.topologyId,
        ...scenario.clues.map(
          (clue) => `${clue.subjectId}:${clue.relationId}:${clue.referenceId}`,
        ),
        ...questions.map((question) => blrCp003LineageSemanticKey(question.answer)),
      ]),
    },
  };
}

export function generateBlrCp003LineagePrototypeGroup(
  seed: number,
): GeneratedBlrCp003LineageGroup {
  const scenario =
    BLR_CP003_LINEAGE_SCENARIOS[
      Math.abs(Math.trunc(seed)) % BLR_CP003_LINEAGE_SCENARIOS.length
    ]!;
  return generateBlrCp003LineageGroup(scenario.scenarioId, seed);
}
