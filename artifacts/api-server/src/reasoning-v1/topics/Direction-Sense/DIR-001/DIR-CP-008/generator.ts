import { addCoordinates } from "../foundation/coordinates";
import type { Direction, PositionRelation } from "../foundation/types";
import { buildHybridExplanationDiagram, buildHybridQuestionDiagram, buildMixedGraphMovementDiagram, buildRelationDiagram } from "./diagram";
import { DIRECTION_LABELS, TURN_LABELS, cardinalVector, relationVector, statementText } from "./geometry";
import {
  solveCaseletIndependent,
  solveContradictionIndependent,
  solveHybridIndependent,
  solveInitialFacingIndependent,
  solveMissingGraphDirectionIndependent,
  solveMissingMovementIndependent,
  solveMissingTurnIndependent,
  solveMixedGraphMovementIndependent,
} from "./independent-solver";
import { answerKey, directionDistanceOptions, directionOptions, distanceOptions, statementOptions, turnOptions } from "./options";
import {
  caseletScenario,
  contradictionScenario,
  hybridScenario,
  initialFacingScenario,
  missingGraphRelationScenario,
  missingMovementScenario,
  missingTurnScenario,
  mixedGraphMovementScenario,
} from "./scenario-builders";
import { dirCp008Ql } from "./task-registry";
import {
  componentDescription,
  pathSentence,
  renderCaseletStimulus,
  renderContradictionStem,
  renderInitialFacingStem,
  renderMissingGraphStem,
  renderMissingMovementStem,
  renderMissingTurnStem,
} from "./question-language.en";
import type { AdvancedAnswer, AdvancedExplanation, AdvancedOption, GeneratedAdvancedQuestion } from "./types";

function correctIndex(options: readonly AdvancedOption[], answer: AdvancedAnswer): number {
  if (options.length !== 4 || new Set(options.map((option) => option.label.toLowerCase())).size !== 4) throw new Error("DIR-CP-008 requires four unique options");
  const matches = options.flatMap((option, index) => answerKey(option.value) === answerKey(answer) ? [index] : []);
  if (matches.length !== 1 || options[matches[0]].errorLabel !== null) throw new Error("DIR-CP-008 correct-option contract failed");
  return matches[0];
}

function variant(seed: number, values: readonly string[]): string {
  return values[seed % values.length];
}

function base(input: {
  readonly qlId: string;
  readonly seed: number;
  readonly stem: string;
  readonly scenario: GeneratedAdvancedQuestion["structuredPrompt"];
  readonly options: readonly AdvancedOption[];
  readonly answer: AdvancedAnswer;
  readonly explanation: AdvancedExplanation;
  readonly questionDiagram?: GeneratedAdvancedQuestion["questionDiagram"];
  readonly difficulty: "MEDIUM" | "HARD";
  readonly caseletId?: string | null;
}): GeneratedAdvancedQuestion {
  const ql = dirCp008Ql(input.qlId);
  return {
    qlId: ql.qlId,
    checkpointId: "DIR-CP-008",
    ruleId: ql.ruleId,
    seed: input.seed,
    difficulty: input.difficulty,
    stem: input.stem,
    structuredPrompt: input.scenario,
    questionDiagram: input.questionDiagram,
    options: input.options,
    correctIndex: correctIndex(input.options, input.answer),
    correctAnswer: input.answer,
    explanation: input.explanation,
    metadata: { answerDemand: ql.answerDemand, solverVerified: true, caseletId: input.caseletId ?? null, solveMode: null },
  };
}

function generateMissingGraph(seed: number): GeneratedAdvancedQuestion {
  const scenario = missingGraphRelationScenario(seed);
  const solved = solveMissingGraphDirectionIndependent(scenario);
  if (solved !== scenario.answerDirection) throw new Error("Missing-graph solver mismatch");
  const answer = { kind: "DIRECTION", direction: solved } as const;
  const complete: PositionRelation[] = [...scenario.visibleRelations, {
    fromEntity: scenario.missingFrom,
    toEntity: scenario.missingTo,
    vector: relationVector(solved, scenario.missingDistance),
  }];
  return base({
    qlId: "DIR-QL-036", seed, scenario, answer, options: directionOptions(solved, seed), difficulty: "HARD",
    stem: renderMissingGraphStem(scenario.visibleRelations, scenario.missingFrom, scenario.missingTo, scenario.missingDistance),
    explanation: {
      given: variant(seed, [
        "Treat the stated relations as one spatial cycle and leave the missing edge unresolved initially.",
        "Build the three known sides first; the final side must complete the same layout.",
        "Follow the stated chain point by point before testing the missing relation.",
        "Use the three visible relations to fix all four points, then close the remaining gap.",
        "The missing relation must agree with the single layout already forced by the three statements.",
      ]),
      steps: [
        `Place ${scenario.entities[1]} from ${scenario.entities[0]}, then ${scenario.entities[2]} from ${scenario.entities[1]}.`,
        `The third relation fixes ${scenario.entities[3]} from ${scenario.entities[2]}.`,
        `Only a relation placing ${scenario.missingTo} ${DIRECTION_LABELS[solved]} of ${scenario.missingFrom} closes the layout without assigning two positions to any point.`,
      ],
      resultLine: `${scenario.missingTo} must be ${DIRECTION_LABELS[solved]} of ${scenario.missingFrom}.`,
      conclusion: `Therefore, the missing direction is ${DIRECTION_LABELS[solved]}.`,
      diagram: buildRelationDiagram(complete, "Completed relation cycle"),
    },
  });
}

function generateContradiction(seed: number): GeneratedAdvancedQuestion {
  const scenario = contradictionScenario(seed);
  const solved = solveContradictionIndependent(scenario);
  if (solved !== scenario.inconsistentIndex) throw new Error("Contradiction solver mismatch");
  const answer = { kind: "STATEMENT", statementIndex: solved } as const;
  const consistentRelations = [...scenario.anchorRelations, ...scenario.relations.filter((_, index) => index !== solved)];
  return base({
    qlId: "DIR-QL-037", seed, scenario, answer, options: statementOptions(scenario.statementLabels, solved, seed), difficulty: "HARD",
    stem: renderContradictionStem(scenario.anchorRelations, scenario.relations),
    explanation: {
      given: `Begin with the anchor facts about ${scenario.anchorRelations[0].fromEntity}, ${scenario.anchorRelations[0].toEntity} and ${scenario.anchorRelations[1].toEntity}.`,
      steps: [
        variant(seed, [
          "The two anchor statements establish the first three points in one fixed frame.",
          "First use the anchor facts to fix the positions of the first three points.",
          "The anchor pair creates a reliable reference layout for the remaining statements.",
          "Begin with the two facts that do not depend on the fourth point.",
          "Plot the first three points from the anchor statements before checking the numbered claims.",
        ]),
        "The consistent additional statements place the fourth point through independent routes that agree.",
        `${scenario.statementLabels[solved]} places ${scenario.relations[solved].toEntity} from ${scenario.relations[solved].fromEntity} in a direction that conflicts with those routes.`,
      ],
      resultLine: `${scenario.statementLabels[solved]} is the inconsistent statement.`,
      conclusion: `Therefore, the answer is ${scenario.statementLabels[solved]}.`,
      diagram: buildRelationDiagram(consistentRelations, "Layout after removing the inconsistent statement"),
    },
  });
}

function knownLegSummary(legs: readonly { readonly direction: Direction | "UNKNOWN"; readonly distance: number }[]): string {
  return legs.map((leg, index) => leg.direction === "UNKNOWN" ? `leg ${index + 1}: unknown ${leg.distance}-metre movement` : `leg ${index + 1}: ${leg.distance} metres ${DIRECTION_LABELS[leg.direction]}`).join("; ");
}

function generateMissingMovement(seed: number): GeneratedAdvancedQuestion {
  const scenario = missingMovementScenario(seed);
  const solved = solveMissingMovementIndependent(scenario);
  if (solved !== scenario.answerDirection) throw new Error("Missing-movement solver mismatch");
  const answer = { kind: "DIRECTION", direction: solved } as const;
  return base({
    qlId: "DIR-QL-038", seed, scenario, answer, options: directionOptions(solved, seed + 101), difficulty: "HARD",
    stem: renderMissingMovementStem(scenario),
    explanation: {
      given: `${scenario.subject} follows this route in ${scenario.place}: ${knownLegSummary(scenario.legs)}.`,
      steps: [
        variant(seed, [
          "Combine the known east-west and north-south movements first.",
          "Find the net effect of the three stated legs before restoring the missing one.",
          "Separate the known horizontal and vertical movements and simplify them.",
          "Work out where the stated movements alone would finish.",
          "Add the known legs first so the remaining vector can be read directly.",
        ]),
        `Compare that partial endpoint with the supplied final position, ${componentDescription(scenario.target)} of the start.`,
        `The remaining ${scenario.legs[scenario.unknownIndex].distance}-metre vector must point ${DIRECTION_LABELS[solved]}.`,
      ],
      resultLine: `${scenario.subject}'s missing leg is towards ${DIRECTION_LABELS[solved]}.`,
      conclusion: `Therefore, ${scenario.subject} used the ${DIRECTION_LABELS[solved]} direction for the missing movement.`,
    },
  });
}

function generateMissingTurn(seed: number): GeneratedAdvancedQuestion {
  const scenario = missingTurnScenario(seed);
  const solved = solveMissingTurnIndependent(scenario);
  if (solved !== scenario.answerTurn) throw new Error("Missing-turn solver mismatch");
  const answer = { kind: "TURN", turn: solved } as const;
  return base({
    qlId: "DIR-QL-039", seed, scenario, answer, options: turnOptions(solved, seed), difficulty: "HARD",
    stem: renderMissingTurnStem(scenario),
    explanation: {
      given: `${scenario.subject} starts in ${scenario.place} facing ${DIRECTION_LABELS[scenario.initialFacing]}, and the final point is fixed by the stem.`,
      steps: [
        `Replay the first ${scenario.firstDistance}-metre movement from the stated facing.`,
        variant(seed, [
          "Test left, right, about-turn and no-turn as the missing change, then replay both later movements.",
          "Try each permitted instruction and carry the route through to the final point.",
          "Replay the two later legs under all four possible direction instructions.",
          "Check the endpoint produced by turning left, turning right, turning around or continuing straight.",
          "Insert each candidate instruction in turn; only one must reproduce the stated endpoint.",
        ]),
        `Only the instruction “${TURN_LABELS[solved]}” reaches the supplied endpoint.`,
      ],
      resultLine: `The missing step is “${TURN_LABELS[solved]}”.`,
      conclusion: `Therefore, “${TURN_LABELS[solved]}” is the correct instruction for ${scenario.subject}.`,
    },
  });
}

function generateInitialFacing(seed: number): GeneratedAdvancedQuestion {
  const scenario = initialFacingScenario(seed);
  const solved = solveInitialFacingIndependent(scenario);
  if (solved !== scenario.answerFacing) throw new Error("Initial-facing solver mismatch");
  const answer = { kind: "DIRECTION", direction: solved } as const;
  return base({
    qlId: "DIR-QL-040", seed, scenario, answer, options: directionOptions(solved, seed + 211), difficulty: "HARD",
    stem: renderInitialFacingStem(scenario),
    explanation: {
      given: `${scenario.subject}'s endpoint in ${scenario.place} is known, but the starting compass frame is hidden.`,
      steps: [
        variant(seed, [
          "Replay the complete relative path once from each possible cardinal initial facing.",
          "Test North, East, South and West as the starting frame for the same route.",
          "Keep the turn sequence fixed and rotate only the unknown starting direction.",
          "Work backwards by comparing the endpoint produced from each cardinal start.",
          "Run the route under all four initial facings and retain the one matching the stated finish.",
        ]),
        `The path reaches ${componentDescription(scenario.target)} only when it begins facing ${DIRECTION_LABELS[solved]}.`,
        "The other starting frames rotate the whole endpoint vector into different quadrants.",
      ],
      resultLine: `${scenario.subject}'s initial facing is ${DIRECTION_LABELS[solved]}.`,
      conclusion: `Therefore, ${scenario.subject} initially faced ${DIRECTION_LABELS[solved]}.`,
    },
  });
}

function generateMixed(seed: number): GeneratedAdvancedQuestion {
  const scenario = mixedGraphMovementScenario(seed);
  const solved = solveMixedGraphMovementIndependent(scenario);
  if (solved.direction !== scenario.answerDirection || solved.distance !== scenario.answerDistance) throw new Error("Mixed solver mismatch");
  const answer = { kind: "DIRECTION_DISTANCE", direction: solved.direction, distance: solved.distance } as const;
  const start = scenario.relations.find((relation) => relation.toEntity === scenario.startEntity)?.vector;
  const reference = scenario.relations.find((relation) => relation.toEntity === scenario.referenceEntity)?.vector;
  if (!start || !reference) throw new Error("Mixed explanation is missing a graph vector");
  const endpoint = scenario.movements.reduce((position, movement) => addCoordinates(position, cardinalVector(movement.direction, movement.distance)), start);
  const horizontal = Math.abs(endpoint.x - reference.x), vertical = Math.abs(endpoint.y - reference.y);
  const stem = `${scenario.relations.map(statementText).join(" ")} A courier starts from ${scenario.startEntity} and then walks ${scenario.movements.map((movement) => `${movement.distance} metres ${DIRECTION_LABELS[movement.direction]}`).join(", then ")}. In which direction, and at what shortest distance, is the courier's final position from ${scenario.referenceEntity}?`;
  return base({
    qlId: "DIR-QL-041", seed, scenario, answer, options: directionDistanceOptions(solved.direction, solved.distance, seed), difficulty: "HARD", stem,
    explanation: {
      given: variant(seed, [
        `First locate ${scenario.startEntity} and ${scenario.referenceEntity} from the static relations.`,
        `Resolve the fixed positions of ${scenario.startEntity} and ${scenario.referenceEntity} before moving the courier.`,
        `The landmark relations must be solved first because the courier starts at ${scenario.startEntity}.`,
        `Use the static layout to place both named points, then apply the courier's movement.`,
        `Separate the problem into the landmark layout and the later movement from ${scenario.startEntity}.`,
      ]),
      steps: [
        `Apply the later movement only from ${scenario.startEntity}; the fixed landmarks do not move.`,
        `From ${scenario.referenceEntity}, the final point has component magnitudes ${horizontal} metres and ${vertical} metres.`,
        `Its shortest distance is √(${horizontal}² + ${vertical}²) = ${solved.distance} metres, and its compass quadrant is ${DIRECTION_LABELS[solved.direction]}.`,
      ],
      resultLine: `The final position is ${DIRECTION_LABELS[solved.direction]} of ${scenario.referenceEntity}, ${solved.distance} metres away.`,
      conclusion: `Therefore, the answer is ${DIRECTION_LABELS[solved.direction]}, ${solved.distance} metres.`,
      diagram: buildMixedGraphMovementDiagram(scenario),
    },
  });
}

function generateCaseletDirection(seed: number): GeneratedAdvancedQuestion {
  const scenario = caseletScenario(seed);
  const solved = solveCaseletIndependent(scenario);
  if (solved.direction !== scenario.answerDirection || solved.distance !== scenario.answerDistance) throw new Error("Caselet solver mismatch");
  const answer = { kind: "DIRECTION", direction: solved.direction } as const;
  const stimulus = renderCaseletStimulus(scenario);
  return base({
    qlId: "DIR-QL-042", seed, scenario, answer, options: directionOptions(solved.direction, seed + 307), difficulty: "MEDIUM", caseletId: scenario.caseletId,
    stem: `${stimulus} In which direction is the final position from the checkpoint?`,
    explanation: {
      given: `Use ${scenario.subject}'s shared patrol route from ${scenario.checkpoint} in ${scenario.place}.`,
      steps: [
        `Replay the route from the initial facing ${DIRECTION_LABELS[scenario.initialFacing]}.`,
        `The net endpoint lies in the ${DIRECTION_LABELS[solved.direction]} quadrant from the checkpoint.`,
        variant(seed, [
          "Only the final position determines this relation; the final facing is a separate fact.",
          "The question compares locations, so the direction faced at the end is not used.",
          "Classify the net displacement from the checkpoint rather than the last walking direction.",
          "Use the straight relation from the checkpoint to the finishing point.",
          "The endpoint quadrant, not the officer's final orientation, gives the answer.",
        ]),
      ],
      resultLine: `${scenario.subject}'s final position is ${DIRECTION_LABELS[solved.direction]} of ${scenario.checkpoint}.`,
      conclusion: `Therefore, the required direction from ${scenario.checkpoint} is ${DIRECTION_LABELS[solved.direction]}.`,
    },
  });
}

function generateCaseletDistance(seed: number): GeneratedAdvancedQuestion {
  const scenario = caseletScenario(seed);
  const solved = solveCaseletIndependent(scenario);
  if (solved.direction !== scenario.answerDirection || solved.distance !== scenario.answerDistance) throw new Error("Caselet solver mismatch");
  const answer = { kind: "DISTANCE", distance: solved.distance } as const;
  const stimulus = renderCaseletStimulus(scenario);
  const totalDistance = scenario.operations.reduce((total, operation) => total + (operation.kind === "MOVE" ? operation.distance : 0), 0);
  return base({
    qlId: "DIR-QL-043", seed, scenario, answer,
    options: distanceOptions(solved.distance, totalDistance, solved.endpoint.x, solved.endpoint.y, seed),
    difficulty: "MEDIUM", caseletId: scenario.caseletId,
    stem: `${stimulus} What is the shortest distance between the final position and the checkpoint?`,
    explanation: {
      given: `Use ${scenario.subject}'s shared patrol route from ${scenario.checkpoint} in ${scenario.place} and derive its net horizontal and vertical components.`,
      steps: [
        `The endpoint components have magnitudes ${Math.abs(solved.endpoint.x)} metres and ${Math.abs(solved.endpoint.y)} metres.`,
        `Shortest distance = √(${Math.abs(solved.endpoint.x)}² + ${Math.abs(solved.endpoint.y)}²) = ${solved.distance} metres.`,
        variant(seed, [
          `The travelled distance is ${totalDistance} metres, but that is not the straight-line answer.`,
          `${totalDistance} metres is the full route length; the question asks for displacement.`,
          `Do not add the walking legs: their total is ${totalDistance} metres, not the shortest separation.`,
          `The route covers ${totalDistance} metres, whereas the direct checkpoint-to-finish distance is shorter.`,
          `Total travel and shortest distance are different here; ${totalDistance} metres is only the former.`,
        ]),
      ],
      resultLine: `The displacement from ${scenario.checkpoint} is ${solved.distance} metres.`,
      conclusion: `Therefore, ${scenario.subject}'s shortest distance from ${scenario.checkpoint} is ${solved.distance} metres.`,
    },
  });
}

function generateHybrid(seed: number): GeneratedAdvancedQuestion {
  const scenario = hybridScenario(seed);
  const solved = solveHybridIndependent(scenario);
  if (solved !== scenario.answerDirection) throw new Error("Hybrid solver mismatch");
  const answer = { kind: "DIRECTION", direction: solved } as const;
  const stem = `The diagram gives two position relations. In addition, ${statementText(scenario.textRelation)} Using both sources, in which direction is ${scenario.queryTo} from ${scenario.queryFrom}?`;
  return base({
    qlId: "DIR-QL-044", seed, scenario, answer, options: directionOptions(solved, seed + 401), difficulty: "HARD", stem,
    questionDiagram: buildHybridQuestionDiagram(scenario),
    explanation: {
      given: variant(seed, [
        "The diagram and the sentence are two parts of one position graph.",
        "Neither source should be read alone; combine the drawn relations with the written fact.",
        "Treat the two arrows in the diagram and the extra sentence as one continuous chain.",
        "The final relation appears only after the diagram is extended by the textual statement.",
        "Start with the diagram, then attach the additional written relation at its matching point.",
      ]),
      steps: [
        "Read the two directed relations shown in the diagram in their displayed order.",
        `Use the written fact: ${statementText(scenario.textRelation)}`,
        `The combined vector from ${scenario.queryFrom} to ${scenario.queryTo} lies ${DIRECTION_LABELS[solved]}.`,
      ],
      resultLine: `${scenario.queryTo} is ${DIRECTION_LABELS[solved]} of ${scenario.queryFrom}.`,
      conclusion: `Therefore, the required direction is ${DIRECTION_LABELS[solved]}.`,
      diagram: buildHybridExplanationDiagram(scenario),
    },
  });
}

export function generateDirCp008Question(qlId: string, seed = 0): GeneratedAdvancedQuestion {
  if (!Number.isInteger(seed)) throw new Error("DIR-CP-008 seed must be an integer");
  switch (qlId) {
    case "DIR-QL-036": return generateMissingGraph(seed);
    case "DIR-QL-037": return generateContradiction(seed);
    case "DIR-QL-038": return generateMissingMovement(seed);
    case "DIR-QL-039": return generateMissingTurn(seed);
    case "DIR-QL-040": return generateInitialFacing(seed);
    case "DIR-QL-041": return generateMixed(seed);
    case "DIR-QL-042": return generateCaseletDirection(seed);
    case "DIR-QL-043": return generateCaseletDistance(seed);
    case "DIR-QL-044": return generateHybrid(seed);
    default: throw new Error(`Unknown DIR-CP-008 QL: ${qlId}`);
  }
}
