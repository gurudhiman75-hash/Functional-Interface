import { classifyDirection } from "../foundation/directions";
import type { Coordinate, Direction } from "../foundation/types";
import { buildMultiMoverDiagram } from "./multi-mover-diagram";
import { directionIndependent, distanceIndependent } from "./independent-solver";
import {
  MULTI_DIRECTION_LABELS,
  MULTI_DIRECTION_PHRASES,
  directionDistanceQuestion,
  directionQuestion,
  distanceQuestion,
  endpointMovementLine,
  renderScenario,
} from "./question-language.en";
import { dirCp005Ql, type DirCp005AnswerDemand } from "./task-registry";
import {
  CARDINALS, NAMES, buildPath, endpointDescription, namesFor, rotate, shuffle,
  type GeneratedMultiMoverQuestion, type MultiMoverAnswer, type RenderedMultiMoverOption,
} from "./model";
import { combinedOptions, directionOptions, distanceOptions, entityOptions, pairLabel, pairOptions, validateOptions } from "./options";
import { calculationLine, comparisonComponents, fourMoverPaths, pairScenario } from "./scenarios";
import type { MoverPath, MultiMoverDiagramSpec } from "./types";

export type { GeneratedMultiMoverQuestion, MultiMoverAnswer, MultiMoverExplanation, RenderedMultiMoverOption } from "./model";

function difficulty(answerDemand: DirCp005AnswerDemand): "EASY" | "MEDIUM" | "HARD" {
  if (answerDemand === "ENDPOINT_RELATIVE_DIRECTION" || answerDemand === "MOVER_AT_RELATION" || answerDemand === "ENDPOINT_EXTREMUM") return "MEDIUM";
  return "HARD";
}

function baseQuestion(
  qlId: string,
  seed: number,
  paths: readonly MoverPath[],
  sameOrigin: boolean,
  stem: string,
  correctAnswer: MultiMoverAnswer,
  options: readonly RenderedMultiMoverOption[],
  referenceLabel: string,
  comparisonLine: string,
  calculation: string | null,
  conclusion: string,
  diagram: MultiMoverDiagramSpec,
  query: Readonly<Record<string, unknown>>,
): GeneratedMultiMoverQuestion {
  const ql = dirCp005Ql(qlId);
  return {
    qlId,
    checkpointId: "DIR-CP-005",
    ruleId: ql.ruleId,
    seed,
    difficulty: difficulty(ql.answerDemand),
    stem,
    structuredPrompt: { paths, answerDemand: ql.answerDemand, query },
    options,
    correctIndex: validateOptions(options, correctAnswer),
    correctAnswer,
    explanation: {
      given: "Track each mover separately and compare only their final positions.",
      movementLines: paths.map(endpointMovementLine),
      endpointLines: paths.map((path) => endpointDescription(path, referenceLabel)),
      comparisonLine,
      calculationLine: calculation,
      conclusion,
      diagram,
    },
    metadata: { answerDemand: ql.answerDemand, moverCount: paths.length, sameOrigin, solverVerified: true, solveMode: null },
  };
}

export function generateDirCp005Question(qlId: string, seed = 0): GeneratedMultiMoverQuestion {
  if (!Number.isInteger(seed)) throw new Error(`DIR-CP-005 seed must be an integer, received ${seed}`);
  const ql = dirCp005Ql(qlId);

  if (["ENDPOINT_RELATIVE_DIRECTION", "ENDPOINT_SEPARATION_DISTANCE", "ENDPOINT_DIRECTION_AND_DISTANCE"].includes(ql.answerDemand)) {
    const { paths, sameOrigin, originRelation, referenceLabel } = pairScenario(seed);
    const [subject, reference] = paths;
    const direction = directionIndependent(reference.endpoint, subject.endpoint);
    if (direction === "SAME_POSITION") throw new Error("Pair comparison requires distinct endpoints");
    const rawDistance = distanceIndependent(reference.endpoint, subject.endpoint);
    const distance = Math.round(rawDistance);
    if (Math.abs(rawDistance - distance) > 1e-9) throw new Error("Pair comparison requires an exact integer distance");
    const delta = { x: subject.endpoint.x - reference.endpoint.x, y: subject.endpoint.y - reference.endpoint.y };
    const components = comparisonComponents(reference.endpoint, subject.endpoint);

    if (ql.answerDemand === "ENDPOINT_RELATIVE_DIRECTION") {
      const correct = { kind: "DIRECTION", direction } as const;
      return baseQuestion(
        qlId, seed, paths, sameOrigin,
        renderScenario(paths, sameOrigin, originRelation, directionQuestion(subject.name, reference.name)),
        correct, directionOptions(direction, seed), referenceLabel,
        `From ${reference.name}'s endpoint to ${subject.name}'s endpoint, move ${components.text}.`,
        null,
        `Therefore, ${subject.name}'s final position is ${MULTI_DIRECTION_LABELS[direction]} of ${reference.name}'s final position.`,
        buildMultiMoverDiagram(paths, { queryPair: { subject: subject.name, reference: reference.name } }),
        { subject: subject.name, reference: reference.name },
      );
    }

    if (ql.answerDemand === "ENDPOINT_SEPARATION_DISTANCE") {
      const correct = { kind: "DISTANCE", distance } as const;
      return baseQuestion(
        qlId, seed, paths, sameOrigin,
        renderScenario(paths, sameOrigin, originRelation, distanceQuestion(subject.name, reference.name)),
        correct, distanceOptions(distance, delta.x, delta.y, seed), referenceLabel,
        `The final endpoints differ by ${components.text}.`,
        calculationLine(reference.endpoint, subject.endpoint, distance),
        `Therefore, the shortest distance between the two final positions is ${distance} metres.`,
        buildMultiMoverDiagram(paths, { queryPair: { subject: subject.name, reference: reference.name, distanceLabel: `${distance} metres` } }),
        { left: subject.name, right: reference.name },
      );
    }

    const correct = { kind: "DIRECTION_DISTANCE", direction, distance } as const;
    return baseQuestion(
      qlId, seed, paths, sameOrigin,
      renderScenario(paths, sameOrigin, originRelation, directionDistanceQuestion(subject.name, reference.name)),
      correct, combinedOptions(direction, distance, delta.x, delta.y, seed), referenceLabel,
      `From ${reference.name}'s endpoint to ${subject.name}'s endpoint, move ${components.text}.`,
      calculationLine(reference.endpoint, subject.endpoint, distance),
      `Therefore, ${subject.name}'s final position is ${MULTI_DIRECTION_LABELS[direction]}, ${distance} metres from ${reference.name}'s final position.`,
      buildMultiMoverDiagram(paths, { queryPair: { subject: subject.name, reference: reference.name, distanceLabel: `${distance} metres` } }),
      { subject: subject.name, reference: reference.name },
    );
  }

  if (ql.answerDemand === "MOVER_AT_RELATION") {
    const directionSets: readonly (readonly Coordinate[])[] = [
      [{ x: 0, y: 0 }, { x: 6, y: 8 }, { x: -8, y: 0 }, { x: 0, y: -9 }],
      [{ x: 0, y: 0 }, { x: -6, y: 8 }, { x: 8, y: 0 }, { x: 0, y: -9 }],
      [{ x: 0, y: 0 }, { x: 7, y: -7 }, { x: -8, y: 0 }, { x: 0, y: 10 }],
      [{ x: 0, y: 0 }, { x: -7, y: -7 }, { x: 8, y: 0 }, { x: 0, y: 10 }],
    ];
    const endpoints = directionSets[Math.abs(seed) % directionSets.length].map((point) => rotate(point, Math.floor(Math.abs(seed) / 4) % 4));
    const paths = fourMoverPaths(seed, endpoints);
    const reference = paths[0];
    const subject = paths[1];
    const direction = directionIndependent(reference.endpoint, subject.endpoint);
    if (direction === "SAME_POSITION") throw new Error("Mover lookup requires a direction");
    const matches = paths.filter((path) => path.name !== reference.name && directionIndependent(reference.endpoint, path.endpoint) === direction);
    if (matches.length !== 1 || matches[0].name !== subject.name) throw new Error("Mover lookup relation is not unique");
    const correct = { kind: "ENTITY", entity: subject.name } as const;
    return baseQuestion(
      qlId, seed, paths, true,
      renderScenario(paths, true, null, `Who finishes ${MULTI_DIRECTION_PHRASES[direction]} of ${reference.name}'s final position?`),
      correct, entityOptions(subject.name, paths.map((path) => path.name), seed), "point O",
      `Only ${subject.name}'s endpoint lies ${MULTI_DIRECTION_PHRASES[direction]} of ${reference.name}'s endpoint.`,
      null,
      `Therefore, the required mover is ${subject.name}.`,
      buildMultiMoverDiagram(paths, { queryPair: { subject: subject.name, reference: reference.name }, highlightedMovers: [subject.name] }),
      { subject: subject.name, reference: reference.name, direction },
    );
  }

  if (ql.answerDemand === "ENDPOINT_EXTREMUM") {
    const base = [{ x: -7, y: 2 }, { x: 2, y: 10 }, { x: 9, y: -3 }, { x: -2, y: -8 }];
    const quarter = Math.abs(seed) % 4;
    const endpoints = base.map((point) => rotate(point, quarter));
    const paths = fourMoverPaths(seed, endpoints);
    const demand = CARDINALS[quarter];
    const sorted = [...paths].sort((left, right) => {
      if (demand === "NORTH") return right.endpoint.y - left.endpoint.y;
      if (demand === "SOUTH") return left.endpoint.y - right.endpoint.y;
      if (demand === "EAST") return right.endpoint.x - left.endpoint.x;
      return left.endpoint.x - right.endpoint.x;
    });
    const answer = sorted[0];
    const correct = { kind: "ENTITY", entity: answer.name } as const;
    return baseQuestion(
      qlId, seed, paths, true,
      renderScenario(paths, true, null, `Who finishes farthest ${MULTI_DIRECTION_PHRASES[demand]}?`),
      correct, entityOptions(answer.name, paths.map((path) => path.name), seed), "point O",
      `${answer.name}'s endpoint has the greatest ${demand === "NORTH" || demand === "SOUTH" ? "vertical" : "horizontal"} reach towards ${MULTI_DIRECTION_LABELS[demand]}.`,
      null,
      `Therefore, ${answer.name} finishes farthest ${MULTI_DIRECTION_PHRASES[demand]}.`,
      buildMultiMoverDiagram(paths, { highlightedMovers: [answer.name], extremumDirection: demand }),
      { extremumDirection: demand, answer: answer.name },
    );
  }

  if (ql.answerDemand === "NEAREST_OR_FARTHEST_FROM_REFERENCE") {
    const base = [{ x: 3, y: 4 }, { x: -6, y: 8 }, { x: 5, y: -12 }, { x: -8, y: -15 }];
    const endpoints = base.map((point) => rotate(point, Math.floor(Math.abs(seed) / 2) % 4));
    const paths = fourMoverPaths(seed, endpoints);
    const farthest = seed % 2 !== 0;
    const ranked = [...paths].sort((left, right) => distanceIndependent({ x: 0, y: 0 }, left.endpoint) - distanceIndependent({ x: 0, y: 0 }, right.endpoint));
    const answer = farthest ? ranked[ranked.length - 1] : ranked[0];
    const answerDistance = Math.round(distanceIndependent({ x: 0, y: 0 }, answer.endpoint));
    const distanceSummary = paths.map((path) => `${path.name}: ${Math.round(distanceIndependent({ x: 0, y: 0 }, path.endpoint))} metres`).join("; ");
    const correct = { kind: "ENTITY", entity: answer.name } as const;
    return baseQuestion(
      qlId, seed, paths, true,
      renderScenario(paths, true, null, `Who finishes ${farthest ? "farthest from" : "nearest to"} point O?`),
      correct, entityOptions(answer.name, paths.map((path) => path.name), seed), "point O",
      `Endpoint distances from O are ${distanceSummary}. Thus ${answer.name}'s ${answerDistance}-metre distance is the ${farthest ? "greatest" : "smallest"}.`,
      null,
      `Therefore, ${answer.name} finishes ${farthest ? "farthest from" : "nearest to"} point O.`,
      buildMultiMoverDiagram(paths, { referencePoint: { label: "O", coordinate: { x: 0, y: 0 } }, highlightedMovers: [answer.name] }),
      { referencePoint: "O", comparison: farthest ? "FARTHEST" : "NEAREST", answer: answer.name },
    );
  }

  const base = [{ x: 6, y: 8 }, { x: 6, y: 8 }, { x: -8, y: 5 }, { x: 4, y: -9 }].map((point) => rotate(point, Math.abs(seed) % 4));
  const paths = fourMoverPaths(seed, base);
  const pair = [paths[0].name, paths[1].name] as [string, string];
  const actualPairs: [string, string][] = [];
  for (let left = 0; left < paths.length; left += 1) {
    for (let right = left + 1; right < paths.length; right += 1) {
      if (directionIndependent(paths[left].endpoint, paths[right].endpoint) === "SAME_POSITION") actualPairs.push([paths[left].name, paths[right].name]);
    }
  }
  if (actualPairs.length !== 1 || pairLabel(actualPairs[0]) !== pairLabel(pair)) throw new Error("Final coincidence pair must be unique");
  const correct = { kind: "ENTITY_PAIR", entities: [...pair].sort() as [string, string] } as const;
  return baseQuestion(
    qlId, seed, paths, true,
    renderScenario(paths, true, null, "Which pair finishes at the same position?"),
    correct, pairOptions(pair, paths.map((path) => path.name), seed), "point O",
    `${pair[0]} and ${pair[1]} have the same final displacement from point O.`,
    null,
    `Therefore, ${pairLabel(pair)} finish at the same position.`,
    buildMultiMoverDiagram(paths, { highlightedMovers: pair }),
    { relation: "FINAL_COINCIDENCE", pair },
  );
}
