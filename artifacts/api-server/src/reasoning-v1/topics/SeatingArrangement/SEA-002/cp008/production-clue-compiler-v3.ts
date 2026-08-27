import { squareSeat } from "./topology-v1.ts";
import { variableSide6Seat } from "./variable-side6-topology-v1.ts";

export type Sea002Cp008ProductionDifficultyV3 = "Easy" | "Medium" | "Hard";
export type Sea002Cp008ProductionFacingV3 = "IN" | "OUT";
export type Sea002Cp008ProductionTopologyV3 =
  | "ALT8_ROLE_DERIVED"
  | "ALT12_ROLE_DERIVED"
  | "SIDEPAIR8_UNIFORM"
  | "SIDEPAIR8_MIXED"
  | "ALT8_UNIFORM"
  | "ALT8_MIXED"
  | "VARIABLE_SIDE6"
  | "ALT12_METRIC";

export type Sea002Cp008ProductionClueV3 =
  | Readonly<{ kind: "ROLE"; person: string; role: "CORNER" | "SIDE" }>
  | Readonly<{ kind: "FACING_ANCHOR"; person: string; facing: Sea002Cp008ProductionFacingV3 }>
  | Readonly<{ kind: "FACING_RELATION"; a: string; b: string; relation: "SAME" | "OPPOSITE" }>
  | Readonly<{ kind: "RELATIVE"; subject: string; reference: string; steps: number; direction: "LEFT" | "RIGHT" }>
  | Readonly<{ kind: "OPPOSITE"; a: string; b: string }>
  | Readonly<{ kind: "SAME_SIDE"; a: string; b: string }>
  | Readonly<{ kind: "OCCUPANCY_CLASS"; person: string; occupancyKind: "SINGLE" | "PAIRED" }>
  | Readonly<{ kind: "RELATIVE_METRIC"; subject: string; reference: string; direction: "LEFT" | "RIGHT"; metres: number }>;

export type Sea002Cp008ProductionQueryV3 = Readonly<{
  kind: "OPPOSITE" | "RELATIVE" | "RELATIVE_METRIC";
  reference: string;
  steps?: number;
  direction?: "LEFT" | "RIGHT";
  metres?: number;
  answer: string;
}>;

export type Sea002Cp008ProductionParticipantV3 = Readonly<{
  id: string;
  seatIndex: number;
  facing: Sea002Cp008ProductionFacingV3;
}>;

type Edge = readonly [number, number];

const EIGHT_SPATIAL_TREES: Readonly<Record<Sea002Cp008ProductionDifficultyV3, readonly Edge[]>> = Object.freeze({
  Easy: Object.freeze([[0, 2], [0, 5], [0, 7], [2, 4], [2, 3], [5, 1], [5, 6]] as const),
  Medium: Object.freeze([[0, 3], [0, 6], [3, 1], [3, 5], [6, 2], [2, 7], [5, 4]] as const),
  Hard: Object.freeze([[0, 3], [3, 6], [6, 1], [1, 5], [5, 2], [2, 7], [2, 4]] as const),
});

const SIX_SPATIAL_TREES: Readonly<Record<Sea002Cp008ProductionDifficultyV3, readonly Edge[]>> = Object.freeze({
  Easy: Object.freeze([[0, 2], [0, 5], [0, 3], [2, 1], [5, 4]] as const),
  Medium: Object.freeze([[0, 2], [0, 4], [2, 5], [2, 3], [4, 1]] as const),
  Hard: Object.freeze([[0, 2], [2, 5], [5, 1], [1, 4], [1, 3]] as const),
});

const TWELVE_SPATIAL_TREES: Readonly<Record<Sea002Cp008ProductionDifficultyV3, readonly Edge[]>> = Object.freeze({
  Easy: Object.freeze([[0, 2], [0, 5], [0, 9], [2, 3], [2, 7], [5, 4], [5, 6], [9, 8], [9, 10], [7, 1], [7, 11]] as const),
  Medium: Object.freeze([[0, 4], [0, 9], [4, 1], [4, 7], [9, 2], [9, 11], [1, 5], [1, 3], [7, 6], [7, 10], [2, 8]] as const),
  Hard: Object.freeze([[0, 4], [4, 9], [9, 2], [2, 7], [7, 1], [1, 5], [5, 10], [10, 3], [3, 8], [8, 6], [8, 11]] as const),
});

const EIGHT_FACING_TREES: Readonly<Record<Sea002Cp008ProductionDifficultyV3, Readonly<{ anchors: readonly number[]; edges: readonly Edge[] }>>> = Object.freeze({
  Easy: Object.freeze({
    anchors: Object.freeze([0, 4] as const),
    edges: Object.freeze([[0, 1], [0, 2], [1, 3], [4, 5], [4, 6], [5, 7]] as const),
  }),
  Medium: Object.freeze({
    anchors: Object.freeze([0] as const),
    edges: Object.freeze([[0, 2], [0, 5], [0, 7], [2, 4], [2, 3], [5, 1], [5, 6]] as const),
  }),
  Hard: Object.freeze({
    anchors: Object.freeze([0] as const),
    edges: Object.freeze([[0, 3], [3, 6], [6, 1], [1, 5], [5, 2], [2, 7], [2, 4]] as const),
  }),
});

function seatCount(topology: Sea002Cp008ProductionTopologyV3): 6 | 8 | 12 {
  if (topology === "VARIABLE_SIDE6") return 6;
  if (topology === "ALT12_ROLE_DERIVED" || topology === "ALT12_METRIC") return 12;
  return 8;
}

function squareSchema(topology: Sea002Cp008ProductionTopologyV3): "ALT8_CORNERS_MIDDLES" | "SIDEPAIR8" | "ALT12_CORNER_PLUS_TWO_SIDE" {
  if (topology === "ALT12_ROLE_DERIVED" || topology === "ALT12_METRIC") return "ALT12_CORNER_PLUS_TWO_SIDE";
  if (topology === "SIDEPAIR8_UNIFORM" || topology === "SIDEPAIR8_MIXED") return "SIDEPAIR8";
  return "ALT8_CORNERS_MIDDLES";
}

function spatialTree(topology: Sea002Cp008ProductionTopologyV3, difficulty: Sea002Cp008ProductionDifficultyV3): readonly Edge[] {
  const count = seatCount(topology);
  return count === 6 ? SIX_SPATIAL_TREES[difficulty] : count === 12 ? TWELVE_SPATIAL_TREES[difficulty] : EIGHT_SPATIAL_TREES[difficulty];
}

function clockwiseDirectionForFacing(facing: Sea002Cp008ProductionFacingV3): "LEFT" | "RIGHT" {
  return facing === "IN" ? "LEFT" : "RIGHT";
}

function anticlockwiseDirectionForFacing(facing: Sea002Cp008ProductionFacingV3): "LEFT" | "RIGHT" {
  return facing === "IN" ? "RIGHT" : "LEFT";
}

function relationClue(
  topology: Sea002Cp008ProductionTopologyV3,
  participants: readonly Sea002Cp008ProductionParticipantV3[],
  subjectIndex: number,
  referenceIndex: number,
): Sea002Cp008ProductionClueV3 {
  const count = seatCount(topology);
  const subject = participants[subjectIndex]!;
  const reference = participants[referenceIndex]!;
  const clockwise = (subject.seatIndex - reference.seatIndex + count) % count;
  const anticlockwise = (reference.seatIndex - subject.seatIndex + count) % count;
  if (clockwise === count / 2) {
    return Object.freeze({ kind: "OPPOSITE" as const, a: subject.id, b: reference.id });
  }
  const useClockwise = clockwise < anticlockwise;
  const steps = useClockwise ? clockwise : anticlockwise;
  const direction = useClockwise
    ? clockwiseDirectionForFacing(reference.facing)
    : anticlockwiseDirectionForFacing(reference.facing);
  if (topology === "ALT12_METRIC") {
    return Object.freeze({
      kind: "RELATIVE_METRIC" as const,
      subject: subject.id,
      reference: reference.id,
      direction,
      metres: steps * 5,
    });
  }
  return Object.freeze({ kind: "RELATIVE" as const, subject: subject.id, reference: reference.id, steps, direction });
}

function buildSpatialClues(
  topology: Sea002Cp008ProductionTopologyV3,
  difficulty: Sea002Cp008ProductionDifficultyV3,
  participants: readonly Sea002Cp008ProductionParticipantV3[],
): readonly Sea002Cp008ProductionClueV3[] {
  return Object.freeze(spatialTree(topology, difficulty).map(([referenceIndex, subjectIndex]) =>
    relationClue(topology, participants, subjectIndex, referenceIndex),
  ));
}

function buildTopologyAnchors(
  topology: Sea002Cp008ProductionTopologyV3,
  difficulty: Sea002Cp008ProductionDifficultyV3,
  participants: readonly Sea002Cp008ProductionParticipantV3[],
): readonly Sea002Cp008ProductionClueV3[] {
  if (topology === "VARIABLE_SIDE6") {
    const single = participants.find((participant) => variableSide6Seat(participant.seatIndex).occupancyKind === "SINGLE")!;
    const paired = participants.find((participant) => variableSide6Seat(participant.seatIndex).occupancyKind === "PAIRED")!;
    return difficulty === "Easy"
      ? Object.freeze([
        Object.freeze({ kind: "OCCUPANCY_CLASS" as const, person: single.id, occupancyKind: "SINGLE" as const }),
        Object.freeze({ kind: "OCCUPANCY_CLASS" as const, person: paired.id, occupancyKind: "PAIRED" as const }),
      ])
      : Object.freeze([Object.freeze({ kind: "OCCUPANCY_CLASS" as const, person: single.id, occupancyKind: "SINGLE" as const })]);
  }

  const schema = squareSchema(topology);
  if (schema === "SIDEPAIR8") {
    const sideZero = participants.filter((participant) => squareSeat(schema, participant.seatIndex).side === 0);
    return Object.freeze([Object.freeze({ kind: "SAME_SIDE" as const, a: sideZero[0]!.id, b: sideZero[1]!.id })]);
  }

  const corner = participants.find((participant) => squareSeat(schema, participant.seatIndex).role === "CORNER")!;
  const anchors: Sea002Cp008ProductionClueV3[] = [Object.freeze({ kind: "ROLE" as const, person: corner.id, role: "CORNER" as const })];
  if (difficulty === "Easy") {
    const side = participants.find((participant) => squareSeat(schema, participant.seatIndex).role === "SIDE")!;
    anchors.push(Object.freeze({ kind: "ROLE" as const, person: side.id, role: "SIDE" as const }));
  }
  return Object.freeze(anchors);
}

function buildFacingClues(
  topology: Sea002Cp008ProductionTopologyV3,
  difficulty: Sea002Cp008ProductionDifficultyV3,
  participants: readonly Sea002Cp008ProductionParticipantV3[],
): readonly Sea002Cp008ProductionClueV3[] {
  if (topology !== "ALT8_MIXED" && topology !== "SIDEPAIR8_MIXED") return Object.freeze([]);
  const plan = EIGHT_FACING_TREES[difficulty];
  const clues: Sea002Cp008ProductionClueV3[] = [];
  for (const index of plan.anchors) {
    clues.push(Object.freeze({ kind: "FACING_ANCHOR" as const, person: participants[index]!.id, facing: participants[index]!.facing }));
  }
  for (const [aIndex, bIndex] of plan.edges) {
    const a = participants[aIndex]!;
    const b = participants[bIndex]!;
    clues.push(Object.freeze({
      kind: "FACING_RELATION" as const,
      a: a.id,
      b: b.id,
      relation: a.facing === b.facing ? "SAME" as const : "OPPOSITE" as const,
    }));
  }
  return Object.freeze(clues);
}

function graphDistance(edges: readonly Edge[], start: number, target: number, count: number): number {
  const adjacency = Array.from({ length: count }, () => [] as number[]);
  for (const [a, b] of edges) {
    adjacency[a]!.push(b);
    adjacency[b]!.push(a);
  }
  const queue: readonly [number, number][] = [[start, 0]];
  const mutable = [...queue];
  const seen = new Set([start]);
  while (mutable.length > 0) {
    const [node, depth] = mutable.shift()!;
    if (node === target) return depth;
    for (const next of adjacency[node]!) {
      if (seen.has(next)) continue;
      seen.add(next);
      mutable.push([next, depth + 1]);
    }
  }
  throw new Error("CP008 production graph is disconnected.");
}

function farthestNonEdgePair(edges: readonly Edge[], count: number): Readonly<{ a: number; b: number; depth: number }> {
  const direct = new Set(edges.flatMap(([a, b]) => [`${a}:${b}`, `${b}:${a}`]));
  let best = { a: 0, b: 1, depth: -1 };
  for (let a = 0; a < count; a += 1) {
    for (let b = a + 1; b < count; b += 1) {
      if (direct.has(`${a}:${b}`)) continue;
      const depth = graphDistance(edges, a, b, count);
      if (depth > best.depth || (depth === best.depth && `${a}:${b}` < `${best.a}:${best.b}`)) best = { a, b, depth };
    }
  }
  return Object.freeze(best);
}

function buildQuery(
  topology: Sea002Cp008ProductionTopologyV3,
  difficulty: Sea002Cp008ProductionDifficultyV3,
  participants: readonly Sea002Cp008ProductionParticipantV3[],
): Readonly<{ query: Sea002Cp008ProductionQueryV3; graphDepth: number }> {
  const count = seatCount(topology);
  const edges = spatialTree(topology, difficulty);
  const pair = farthestNonEdgePair(edges, count);
  const clue = relationClue(topology, participants, pair.b, pair.a);
  if (clue.kind === "OPPOSITE") {
    return Object.freeze({
      query: Object.freeze({ kind: "OPPOSITE" as const, reference: participants[pair.a]!.id, answer: participants[pair.b]!.id }),
      graphDepth: pair.depth,
    });
  }
  if (clue.kind === "RELATIVE_METRIC") {
    return Object.freeze({
      query: Object.freeze({
        kind: "RELATIVE_METRIC" as const,
        reference: clue.reference,
        direction: clue.direction,
        metres: clue.metres,
        answer: clue.subject,
      }),
      graphDepth: pair.depth,
    });
  }
  if (clue.kind !== "RELATIVE") throw new Error("Unexpected CP008 production query relation.");
  return Object.freeze({
    query: Object.freeze({
      kind: "RELATIVE" as const,
      reference: clue.reference,
      direction: clue.direction,
      steps: clue.steps,
      answer: clue.subject,
    }),
    graphDepth: pair.depth,
  });
}

function maxDegree(edges: readonly Edge[], count: number): number {
  const degree = Array.from({ length: count }, () => 0);
  for (const [a, b] of edges) {
    degree[a] += 1;
    degree[b] += 1;
  }
  return Math.max(...degree);
}

function immediateSpatialClueCount(clues: readonly Sea002Cp008ProductionClueV3[]): number {
  return clues.filter((clue) =>
    (clue.kind === "RELATIVE" && clue.steps === 1)
    || (clue.kind === "RELATIVE_METRIC" && clue.metres === 5),
  ).length;
}

function facingInferenceDepth(
  topology: Sea002Cp008ProductionTopologyV3,
  difficulty: Sea002Cp008ProductionDifficultyV3,
): number {
  if (topology !== "ALT8_MIXED" && topology !== "SIDEPAIR8_MIXED") return 0;
  const plan = EIGHT_FACING_TREES[difficulty];
  const adjacency = Array.from({ length: 8 }, () => [] as number[]);
  for (const [a, b] of plan.edges) {
    adjacency[a]!.push(b);
    adjacency[b]!.push(a);
  }
  const queue = plan.anchors.map((index) => [index, 0] as const);
  const seen = new Set(plan.anchors);
  let maximum = 0;
  while (queue.length > 0) {
    const [node, depth] = queue.shift()!;
    maximum = Math.max(maximum, depth);
    for (const next of adjacency[node]!) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push([next, depth + 1]);
    }
  }
  if (seen.size !== 8) throw new Error("CP008 facing inference plan is disconnected.");
  return maximum;
}

export function compileSea002Cp008ProductionLearnerGraphV3(input: Readonly<{
  topology: Sea002Cp008ProductionTopologyV3;
  facingMode: string;
  difficulty: Sea002Cp008ProductionDifficultyV3;
  participants: readonly Sea002Cp008ProductionParticipantV3[];
  seed: string;
}>) {
  const count = seatCount(input.topology);
  if (input.participants.length !== count) throw new Error(`${input.topology}: expected ${count} participants.`);
  const spatial = buildSpatialClues(input.topology, input.difficulty, input.participants);
  const topologyAnchors = buildTopologyAnchors(input.topology, input.difficulty, input.participants);
  const facing = buildFacingClues(input.topology, input.difficulty, input.participants);
  const queryBuild = buildQuery(input.topology, input.difficulty, input.participants);
  const clues = Object.freeze([...topologyAnchors, ...facing, ...spatial]);
  const edges = spatialTree(input.topology, input.difficulty);
  const immediateCount = immediateSpatialClueCount(spatial);
  const proof = Object.freeze({
    compilerVersion: "EXAM_REAL_PRODUCTION_GRAPH_V3" as const,
    source: "PRODUCTION_ONLY_NOT_DISCOVERY_SPINE" as const,
    spatialTreeEdgeCount: edges.length,
    spatialGraphMaxDegree: maxDegree(edges, count),
    askedRelationGraphDepth: queryBuild.graphDepth,
    immediateSpatialClueCount: immediateCount,
    immediateSpatialClueRatio: immediateCount / edges.length,
    facingInferenceDepth: facingInferenceDepth(input.topology, input.difficulty),
    queryCopiedDirectlyFromClue: false as const,
    usesDiscoveryConstraintSpine: false as const,
  });
  return Object.freeze({ clues, query: queryBuild.query, proof });
}
