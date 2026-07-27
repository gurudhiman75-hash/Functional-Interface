import { addCoordinates } from "../foundation/coordinates";
import type { Direction, PositionRelation } from "../foundation/types";
import { buildHybridExplanationDiagram, buildHybridQuestionDiagram, buildMixedGraphMovementDiagram, buildRelationDiagram } from "./diagram";
import { DIRECTION_LABELS, TURN_LABELS, cardinalVector, directionFromVector, relationVector, statementText } from "./geometry";
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
  directionOnlyStatement,
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
      given: "Treat the stated relations as one spatial cycle and leave the missing edge unresolved initially.",
      steps: [
        `Place ${scenario.entities[1]} from ${scenario.entities[0]}, then ${scenario.entities[2]} from ${scenario.entities[1]}.`,
        `The third relation fixes ${scenario.entities[3]} from ${scenario.entities[2]}.`,
        `Only a ${DIRECTION_LABELS[solved]} relation from ${scenario.missingFrom} to ${scenario.missingTo} closes the layout without assigning two positions to any point.`,
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
        "The two anchor statements establish the first three points in one fixed frame.",
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
        "Combine the known east-west and north-south movements first.",
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
        "Test left, right, about-turn and no-turn as the missing change, then replay both later movements.",
        `Only ${TURN_LABELS[solved].toLowerCase()} reaches the supplied endpoint.`,
      ],
      resultLine: `${scenario.subject}'s missing instruction is ${TURN_LABELS[solved].toLowerCase()}.`,
      conclusion: `Therefore, the missing instruction for ${scenario.subject} is ${TURN_LABELS[solved]}.`,
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
        "Replay the complete relative path once from each possible cardinal initial facing.",
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
  const stem = `${scenario.relations.map(statementText).join(" ")} A courier starts from ${scenario.startEntity} and then walks ${scenario.movements.map((movement) => `${movement.distance} metres ${DIRECTION_LABELS[movement.direction]}`).join(", then ")}. In which direction, and at what shortest distance, is the courier's final position from ${scenario.referenceEntity}?`;
  return base({
    qlId: "DIR-QL-041", seed, scenario, answer, options: directionDistanceOptions(solved.direction, solved.distance, seed), difficulty: "HARD", stem,
    explanation: {
      given: `First locate ${scenario.startEntity} and ${scenario.referenceEntity} from the static relations.`,
      steps: [
        `Apply the later movement only from ${scenario.startEntity}; the fixed landmarks do not move.`,
        `From ${scenario.referenceEntity}, the final point has a 4-metre horizontal component and a 3-metre vertical component.`,
        `Its shortest distance is √(4² + 3²) = 5 metres, and its compass quadrant is ${DIRECTION_LABELS[solved.direction]}.`,
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
        "Only the endpoint coordinates determine this relation; the final facing is a separate fact.",
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
        `The travelled distance is ${totalDistance} metres, but that is not the straight-line answer.`,
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
  const stem = `The diagram gives two position relations. In addition, ${directionOnlyStatement(scenario.textRelation)} Using both sources, in which direction is ${scenario.queryTo} from ${scenario.queryFrom}?`;
  return base({
    qlId: "DIR-QL-044", seed, scenario, answer, options: directionOptions(solved, seed + 401), difficulty: "HARD", stem,
    questionDiagram: buildHybridQuestionDiagram(scenario),
    explanation: {
      given: "The diagram and the sentence are two parts of one position graph.",
      steps: [
        "Read the two directed relations shown in the diagram in their displayed order.",
        `Attach the text relation that places ${scenario.textRelation.toEntity} from ${scenario.textRelation.fromEntity}.`,
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
