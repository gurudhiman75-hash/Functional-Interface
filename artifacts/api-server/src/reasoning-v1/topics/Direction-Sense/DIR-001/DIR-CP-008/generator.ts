import { addCoordinates } from "../foundation/coordinates";
import type { Direction, PositionRelation } from "../foundation/types";
import { buildAbsoluteMovementSolutionDiagram, buildHybridExplanationDiagram, buildMixedGraphMovementDiagram, buildRelationDiagram, buildRelativeMovementSolutionDiagram } from "./diagram";
import { DIRECTION_LABELS, TURN_LABELS, cardinalVector, relationVector, statementText, turnFacing } from "./geometry";
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
        "Use the three stated relations to place the four points.",
        "Start with the three given relations and locate the points one by one.",
        "Follow the stated relations in order before comparing the two required points.",
        "Use the given relations to fix the positions of all four points.",
        "The three given relations are enough to determine the relative positions of the four points.",
      ]),
      steps: [
        ...scenario.visibleRelations.map((relation) => statementText(relation)),
        `These relations place ${scenario.missingTo} ${scenario.missingDistance} metres ${DIRECTION_LABELS[solved]} of ${scenario.missingFrom}.`,
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
        ...scenario.anchorRelations.map((relation) => `Anchor: ${statementText(relation)}`),
        ...scenario.relations.map((relation, index) => `${scenario.statementLabels[index]}: ${statementText(relation)}`),
        `${scenario.statementLabels[solved]} conflicts with the position fixed by the other relations.`,
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

function relativeWalkthrough(
  initialFacing: Direction,
  operations: readonly { readonly kind: "MOVE"; readonly distance: number }[] | readonly any[],
): { readonly lines: string[]; readonly endpoint: { readonly x: number; readonly y: number }; readonly finalFacing: Direction } {
  let facing = initialFacing;
  let endpoint = { x: 0, y: 0 };
  const lines: string[] = [];
  for (const operation of operations as readonly any[]) {
    if (operation.kind === "TURN") {
      const before = facing;
      facing = turnFacing(facing, operation.turn);
      lines.push(`${TURN_LABELS[operation.turn as keyof typeof TURN_LABELS]} changes the facing from ${DIRECTION_LABELS[before]} to ${DIRECTION_LABELS[facing]}.`);
      continue;
    }
    endpoint = addCoordinates(endpoint, cardinalVector(facing, operation.distance));
    lines.push(`Walk ${operation.distance} metres ${DIRECTION_LABELS[facing]}; the point is now ${componentDescription(endpoint)} of the start.`);
  }
  return { lines, endpoint, finalFacing: facing };
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
      steps: (() => {
        let knownEndpoint = { x: 0, y: 0 };
        const lines: string[] = [];
        scenario.legs.forEach((leg, index) => {
          if (index === scenario.unknownIndex || leg.direction === "UNKNOWN") {
            lines.push(`Leg ${index + 1}: ${leg.distance} metres in an unknown direction.`);
            return;
          }
          knownEndpoint = addCoordinates(knownEndpoint, cardinalVector(leg.direction, leg.distance));
          lines.push(`Leg ${index + 1}: ${leg.distance} metres ${DIRECTION_LABELS[leg.direction]}; known movements now place the point ${componentDescription(knownEndpoint)} of the start.`);
        });
        const restored = addCoordinates(
          knownEndpoint,
          cardinalVector(solved, scenario.legs[scenario.unknownIndex].distance),
        );
        lines.push(`The required final point is ${componentDescription(scenario.target)} of the start.`);
        lines.push(`Adding the missing ${scenario.legs[scenario.unknownIndex].distance}-metre movement towards ${DIRECTION_LABELS[solved]} gives ${componentDescription(restored)}, exactly the required final point.`);
        return lines;
      })(),
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
      steps: (() => {
        const secondFacing = turnFacing(scenario.initialFacing, solved);
        const thirdFacing = turnFacing(secondFacing, scenario.knownTurn);
        let endpoint = cardinalVector(scenario.initialFacing, scenario.firstDistance);
        const lines = [
          `First move: ${scenario.firstDistance} metres ${DIRECTION_LABELS[scenario.initialFacing]}.`,
          `${TURN_LABELS[solved]} changes the facing to ${DIRECTION_LABELS[secondFacing]}, so the second move is ${scenario.secondDistance} metres ${DIRECTION_LABELS[secondFacing]}.`,
        ];
        endpoint = addCoordinates(endpoint, cardinalVector(secondFacing, scenario.secondDistance));
        lines.push(`After the first two moves, the point is ${componentDescription(endpoint)} of the start.`);
        endpoint = addCoordinates(endpoint, cardinalVector(thirdFacing, scenario.thirdDistance));
        lines.push(`${TURN_LABELS[scenario.knownTurn]} changes the facing to ${DIRECTION_LABELS[thirdFacing]}; the last move is ${scenario.thirdDistance} metres in that direction.`);
        lines.push(`The route ends ${componentDescription(endpoint)} of the start, matching the supplied final point ${componentDescription(scenario.target)}.`);
        return lines;
      })(),
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
      given: `${scenario.subject}'s final position in ${scenario.place} is known, but the starting direction is not given.`,
      steps: [
        `Use the candidate that actually reaches the supplied endpoint: start facing ${DIRECTION_LABELS[solved]}.`,
        ...relativeWalkthrough(solved, scenario.operations).lines,
        `This route ends ${componentDescription(scenario.target)} of the start, exactly as stated.`,
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
  const stem = `${scenario.relations.map(statementText).join(" ")} A person starts from ${scenario.startEntity} and walks ${scenario.movements.map((movement) => `${movement.distance} metres ${DIRECTION_LABELS[movement.direction]}`).join(", then ")}. In which direction, and at what shortest distance, is the final position from ${scenario.referenceEntity}?`;
  return base({
    qlId: "DIR-QL-041", seed, scenario, answer, options: directionDistanceOptions(solved.direction, solved.distance, seed), difficulty: "HARD", stem,
    explanation: {
      given: variant(seed, [
        `First locate ${scenario.startEntity} and ${scenario.referenceEntity} from the static relations.`,
        `Resolve the fixed positions of ${scenario.startEntity} and ${scenario.referenceEntity} before moving the person.`,
        `The landmark relations must be solved first because the person starts at ${scenario.startEntity}.`,
        `Use the static layout to place both named points, then apply the person's movement.`,
        `Separate the problem into the landmark layout and the later movement from ${scenario.startEntity}.`,
      ]),
      steps: [
        ...scenario.relations.map((relation) => statementText(relation)),
        ...scenario.movements.map((movement) => `From ${scenario.startEntity}, move ${movement.distance} metres ${DIRECTION_LABELS[movement.direction]}.`),
        `Compared with ${scenario.referenceEntity}, the final point differs by ${horizontal} metres horizontally and ${vertical} metres vertically.`,
        `Shortest distance = √(${horizontal}² + ${vertical}²) = ${solved.distance} metres, and the direction is ${DIRECTION_LABELS[solved.direction]}.`,
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
        `Start facing ${DIRECTION_LABELS[scenario.initialFacing]} at ${scenario.checkpoint}.`,
        ...relativeWalkthrough(scenario.initialFacing, scenario.operations).lines,
        `The final point is ${componentDescription(solved.endpoint)} of the checkpoint, so its direction is ${DIRECTION_LABELS[solved.direction]}.`,
        "The final facing is a separate fact and is not the answer to this location question.",
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
    difficulty: "HARD", caseletId: scenario.caseletId,
    stem: `${stimulus} What is the shortest distance between the final position and the checkpoint?`,
    explanation: {
      given: `Use ${scenario.subject}'s shared patrol route from ${scenario.checkpoint} in ${scenario.place} and derive its net horizontal and vertical components.`,
      steps: [
        `Start facing ${DIRECTION_LABELS[scenario.initialFacing]} at ${scenario.checkpoint}.`,
        ...relativeWalkthrough(scenario.initialFacing, scenario.operations).lines,
        `The endpoint components have magnitudes ${Math.abs(solved.endpoint.x)} metres and ${Math.abs(solved.endpoint.y)} metres.`,
        `Shortest distance = √(${Math.abs(solved.endpoint.x)}² + ${Math.abs(solved.endpoint.y)}²) = ${solved.distance} metres.`,
        `The full route length is ${totalDistance} metres, but the question asks for the straight-line separation.`,
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
  const writtenRelation = statementText(scenario.textRelation);
  const stem = variant(seed, [
    `The diagram shows two position relations. It is also given that ${writtenRelation} Using all the information, in which direction is ${scenario.queryTo} from ${scenario.queryFrom}?`,
    `Study the two position relations shown in the diagram. In addition, ${writtenRelation} In which direction is ${scenario.queryTo} from ${scenario.queryFrom}?`,
    `Two position relations are shown in the diagram. Also, ${writtenRelation} Using the diagram and this statement, find the direction of ${scenario.queryTo} from ${scenario.queryFrom}.`,
    `Use the two relations in the diagram along with this fact: ${writtenRelation} What is the direction of ${scenario.queryTo} from ${scenario.queryFrom}?`,
    `The diagram provides two position relations, and ${writtenRelation} Considering both sources, where is ${scenario.queryTo} with respect to ${scenario.queryFrom}?`,
  ]);
  return base({
    qlId: "DIR-QL-044", seed, scenario, answer, options: directionOptions(solved, seed + 401), difficulty: "HARD", stem,
    questionDiagram: buildHybridQuestionDiagram(scenario),
    explanation: {
      given: variant(seed, [
        "Use the two relations in the diagram together with the written relation.",
        "The diagram and the written fact are both needed to answer the question.",
        "Read the two diagram relations first, then add the written relation.",
        "Combine the information shown in the diagram with the extra sentence.",
        "Start with the diagram and then use the additional written relation.",
      ]),
      steps: (() => {
        const allRelations = [...scenario.diagramRelations, scenario.textRelation];
        const combined = allRelations.reduce(
          (position, relation) => addCoordinates(position, relation.vector),
          { x: 0, y: 0 },
        );
        return [
          ...scenario.diagramRelations.map((relation, index) => `Diagram relation ${index + 1}: ${statementText(relation)}`),
          `Written relation: ${statementText(scenario.textRelation)}`,
          `Together these place ${scenario.queryTo} ${componentDescription(combined)} of ${scenario.queryFrom}.`,
          `Therefore, ${scenario.queryTo} lies ${DIRECTION_LABELS[solved]} of ${scenario.queryFrom}.`,
        ];
      })(),
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
