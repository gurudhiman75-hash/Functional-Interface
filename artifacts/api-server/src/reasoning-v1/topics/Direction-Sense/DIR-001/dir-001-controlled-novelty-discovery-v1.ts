import { createHash } from "node:crypto";

import { addCoordinates } from "./foundation/coordinates";
import type { Coordinate, Direction, PositionRelation } from "./foundation/types";
import {
  DIRECTION_LABELS,
  cardinalVector,
  directionFromVector,
  distanceFromVector,
  relationVector,
  replayRelative,
  statementText,
  turnFacing,
} from "./DIR-CP-008/geometry";
import { directionDistanceOptions } from "./DIR-CP-008/options";
import type { AdvancedTurn, RelativePathOperation } from "./DIR-CP-008/types";
import {
  validateReasoningNoveltyCandidateV1,
  type ReasoningNoveltyAxisV1,
} from "../../shared/reasoning-novelty-governance-v1";

export const DIR_001_CONTROLLED_NOVELTY_DISCOVERY_V1 =
  "DIR_001_CONTROLLED_NOVELTY_DISCOVERY_V1" as const;

const PATTERNS = [
  { startEast: 6, referenceNorth: 5, firstMove: 9, secondMove: 3, distance: 5 },
  { startEast: 10, referenceNorth: 6, firstMove: 18, secondMove: 5, distance: 13 },
  { startEast: 12, referenceNorth: 8, firstMove: 23, secondMove: 4, distance: 17 },
  { startEast: 15, referenceNorth: 10, firstMove: 34, secondMove: 8, distance: 25 },
] as const;

function rotate(direction: Direction, quarterTurns: number): Direction {
  const cycle: readonly Direction[] = ["NORTH", "EAST", "SOUTH", "WEST"];
  const index = cycle.indexOf(direction);
  if (index < 0) throw new Error("DIR controlled novelty currently rotates cardinal directions only.");
  return cycle[(index + quarterTurns + 4) % 4]!;
}

function independentReplay(
  initialFacing: Direction,
  operations: readonly RelativePathOperation[],
): { readonly position: Coordinate; readonly facing: Direction } {
  let position: Coordinate = { x: 0, y: 0 };
  let facing = initialFacing;

  for (const operation of operations) {
    if (operation.kind === "TURN") {
      facing = turnFacing(facing, operation.turn);
      continue;
    }
    position = addCoordinates(position, cardinalVector(facing, operation.distance));
  }
  return { position, facing };
}

function optionKey(option: { readonly value: unknown }): string {
  return JSON.stringify(option.value);
}

export interface DirControlledNovelGraphRelativePathCandidateV1 {
  readonly candidateId: string;
  readonly provenance: "CONTROLLED_NOVEL";
  readonly noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  readonly parentQlIds: readonly ["DIR-QL-004", "DIR-QL-041"];
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly semanticFingerprint: string;
  readonly solverAgreement: true;
  readonly permanentQlAllocated: false;
  readonly questionStudioNoveltyMixActivated: false;
  readonly humanReviewRequired: true;
  readonly falsePyqAttribution: false;
  readonly structuredState: {
    readonly relations: readonly PositionRelation[];
    readonly initialFacing: Direction;
    readonly operations: readonly RelativePathOperation[];
    readonly startEntity: string;
    readonly referenceEntity: string;
    readonly finalPosition: Coordinate;
    readonly answerDirection: Direction;
    readonly answerDistance: number;
  };
}

export function generateDirControlledNovelGraphRelativePathCandidateV1(
  seed: number,
): DirControlledNovelGraphRelativePathCandidateV1 {
  if (!Number.isSafeInteger(seed)) {
    throw new Error("DIR controlled-novel seed must be a safe integer.");
  }

  const pattern = PATTERNS[Math.abs(seed) % PATTERNS.length]!;
  const quarterTurns = Math.floor(Math.abs(seed) / PATTERNS.length) % 4;
  const turn: Exclude<AdvancedTurn, "NO_TURN" | "ABOUT"> =
    Math.floor(Math.abs(seed) / (PATTERNS.length * 4)) % 2 === 0 ? "LEFT" : "RIGHT";

  const anchor = "P";
  const startEntity = "Q";
  const referenceEntity = "R";

  const east = rotate("EAST", quarterTurns);
  const north = rotate("NORTH", quarterTurns);
  const initialFacing = turn === "LEFT" ? north : rotate("SOUTH", quarterTurns);

  const relations: readonly PositionRelation[] = [
    {
      fromEntity: anchor,
      toEntity: startEntity,
      vector: relationVector(east, pattern.startEast),
    },
    {
      fromEntity: anchor,
      toEntity: referenceEntity,
      vector: relationVector(north, pattern.referenceNorth),
    },
  ];

  const operations: readonly RelativePathOperation[] = [
    { kind: "MOVE", distance: pattern.firstMove },
    { kind: "TURN", turn },
    { kind: "MOVE", distance: pattern.secondMove },
  ];

  const relativePrimary = replayRelative(initialFacing, operations);
  const relativeIndependent = independentReplay(initialFacing, operations);
  if (
    relativePrimary.position.x !== relativeIndependent.position.x ||
    relativePrimary.position.y !== relativeIndependent.position.y ||
    relativePrimary.facing !== relativeIndependent.facing
  ) {
    throw new Error("DIR controlled-novel relative-path solvers disagree.");
  }

  const startCoordinate = relations[0]!.vector;
  const referenceCoordinate = relations[1]!.vector;
  const finalPosition = addCoordinates(startCoordinate, relativePrimary.position);
  const answerVector = {
    x: finalPosition.x - referenceCoordinate.x,
    y: finalPosition.y - referenceCoordinate.y,
  };
  const answerDirection = directionFromVector(answerVector);
  const answerDistance = distanceFromVector(answerVector);

  if (answerDistance !== pattern.distance) {
    throw new Error(
      "DIR controlled-novel exact-distance pattern failed: expected " +
      pattern.distance +
      ", received " +
      answerDistance +
      ".",
    );
  }

  const optionRecords = directionDistanceOptions(answerDirection, answerDistance, seed + 911);
  const answerValue = {
    kind: "DIRECTION_DISTANCE",
    direction: answerDirection,
    distance: answerDistance,
  } as const;
  const answerKey = JSON.stringify(answerValue);
  const matches = optionRecords.flatMap((option, index) =>
    optionKey(option) === answerKey ? [index] : [],
  );
  if (matches.length !== 1) {
    throw new Error("DIR controlled-novel options must contain exactly one correct answer.");
  }
  const correctIndex = matches[0]!;
  const options = optionRecords.map((option) => option.label);

  const turnText = turn === "LEFT" ? "turns left" : "turns right";
  const stem = [
    statementText(relations[0]!),
    statementText(relations[1]!),
    `A person starts from ${startEntity}, facing ${DIRECTION_LABELS[initialFacing]}, walks ${pattern.firstMove} metres, ${turnText}, and walks ${pattern.secondMove} metres.`,
    `In which direction and at what shortest distance is the final position from ${referenceEntity}?`,
  ].join(" ");

  const noveltyAxes = [
    "MULTI_STAGE_COMPOSITION",
    "VALID_CROSS_FAMILY_COMPOSITION",
    "REPRESENTATION_LOGIC",
    "INFORMATION_DISTRIBUTION",
  ] as const satisfies readonly ReasoningNoveltyAxisV1[];

  validateReasoningNoveltyCandidateV1({
    candidateId: "DIR-NOVEL-GRAPH-RELATIVE-" + seed,
    chapterId: "DIR-001",
    qlId: "DIR-QL-004+DIR-QL-041",
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors:
      options.length === 4 &&
      new Set(options.map((option) => option.toLocaleLowerCase("en-IN"))).size === 4,
    examNatural: true,
    falseHistoricalAttribution: false,
    humanReviewRequired: true,
  });

  const semanticFingerprint = createHash("sha256")
    .update(JSON.stringify({
      authority: DIR_001_CONTROLLED_NOVELTY_DISCOVERY_V1,
      relations,
      initialFacing,
      operations,
      referenceEntity,
      answerDirection,
      answerDistance,
    }))
    .digest("hex");

  return {
    candidateId: "DIR-NOVEL-GRAPH-RELATIVE-" + seed,
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    parentQlIds: ["DIR-QL-004", "DIR-QL-041"],
    seed,
    stem,
    options,
    correctIndex,
    answer: options[correctIndex]!,
    semanticFingerprint,
    solverAgreement: true,
    permanentQlAllocated: false,
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    falsePyqAttribution: false,
    structuredState: {
      relations,
      initialFacing,
      operations,
      startEntity,
      referenceEntity,
      finalPosition,
      answerDirection,
      answerDistance,
    },
  };
}
