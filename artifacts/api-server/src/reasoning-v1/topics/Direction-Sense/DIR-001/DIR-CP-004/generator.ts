import { distanceBetween } from "../foundation/coordinates";
import { classifyDirection, oppositeDirection, rotateDirection } from "../foundation/directions";
import { solveEntityPositions } from "../foundation/entity-position-graph";
import type { Coordinate, Direction, DirectionOption, PositionRelation } from "../foundation/types";
import { solveRelativeGraphIndependent, independentCollinear, independentDirection, independentDistance } from "./independent-solver";
import {
  RELATIVE_DIRECTION_LABELS,
  RELATIVE_DIRECTION_PHRASES,
  directionDistanceLabel,
  placementPhrase,
  relationOptionLabel,
  renderCoincidenceQuestion,
  renderCollinearQuestion,
  renderDirectionDistanceQuestion,
  renderDirectionQuestion,
  renderEntityLookupQuestion,
  renderGraphStem,
  renderRelationSentence,
} from "./question-language.en";
import { buildRelativePositionDiagram } from "./relative-position-diagram";
import { dirCp004Ql, type DirCp004AnswerDemand } from "./task-registry";
import type { RelativePositionDiagramSpec, RelativeRelation } from "./types";

const NAMES = ["Aman", "Beena", "Charan", "Deepa", "Farhan", "Gurpreet", "Harpreet", "Isha", "Jatin", "Kiran", "Manpreet", "Neha"] as const;
const BASE_KEYS = ["A", "B", "C", "D", "E", "F"] as const;

export type RelativeGraphAnswer =
  | { readonly kind: "DIRECTION"; readonly direction: Direction }
  | { readonly kind: "DIRECTION_DISTANCE"; readonly direction: Direction; readonly distance: number }
  | { readonly kind: "ENTITY"; readonly entity: string }
  | { readonly kind: "ENTITY_GROUP"; readonly entities: readonly string[] }
  | { readonly kind: "ENTITY_PAIR"; readonly entities: readonly [string, string] };

export interface RenderedRelativeOption extends DirectionOption<RelativeGraphAnswer> {
  readonly label: string;
}

export interface RelativeGraphExplanation {
  readonly given: string;
  readonly placementLines: readonly string[];
  readonly resultLine: string;
  readonly calculationLine: string | null;
  readonly conclusion: string;
  readonly diagram: RelativePositionDiagramSpec;
}

export interface GeneratedRelativeGraphQuestion {
  readonly qlId: string;
  readonly checkpointId: "DIR-CP-004";
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly stem: string;
  readonly structuredPrompt: Readonly<Record<string, unknown>>;
  readonly options: readonly RenderedRelativeOption[];
  readonly correctIndex: number;
  readonly correctAnswer: RelativeGraphAnswer;
  readonly explanation: RelativeGraphExplanation;
  readonly metadata: {
    readonly answerDemand: DirCp004AnswerDemand;
    readonly entityCount: number;
    readonly relationCount: number;
    readonly graphTopology: "BRANCHED_TREE";
    readonly solverVerified: true;
    readonly solveMode: null;
  };
}

interface BuiltGraph {
  readonly entities: readonly string[];
  readonly origin: string;
  readonly relations: readonly RelativeRelation[];
  readonly coordinates: Readonly<Record<string, Coordinate>>;
}

function seededRandom(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  const random = seededRandom(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function rotateQuarter(point: Coordinate, quarterTurns: number): Coordinate {
  let current = point;
  for (let index = 0; index < ((quarterTurns % 4) + 4) % 4; index += 1) {
    current = { x: current.y, y: -current.x };
  }
  return current;
}

function namesFor(seed: number, count: number): Readonly<Record<string, string>> {
  const selected = shuffle(NAMES, seed * 37 + 5).slice(0, count);
  return Object.fromEntries(BASE_KEYS.slice(0, count).map((key, index) => [key, selected[index]]));
}

function buildGraph(
  seed: number,
  baseCoordinates: Readonly<Record<string, Coordinate>>,
  baseEdges: readonly (readonly [string, string])[],
  quarterTurns: number,
): BuiltGraph {
  const keys = Object.keys(baseCoordinates);
  const nameMap = namesFor(seed, keys.length);
  const coordinates = Object.fromEntries(keys.map((key) => [nameMap[key], rotateQuarter(baseCoordinates[key], quarterTurns)]));
  const relations: RelativeRelation[] = baseEdges.map(([referenceKey, subjectKey]) => {
    const referenceEntity = nameMap[referenceKey];
    const subjectEntity = nameMap[subjectKey];
    const reference = coordinates[referenceEntity];
    const subject = coordinates[subjectEntity];
    const vector = { x: subject.x - reference.x, y: subject.y - reference.y };
    const classified = classifyDirection(vector.x, vector.y);
    if (classified === "SAME_POSITION") throw new Error("A graph relation may not directly state coincidence");
    const distance = Math.hypot(vector.x, vector.y);
    if (Math.abs(distance - Math.round(distance)) > 1e-9) throw new Error(`Relation distance must be integral, received ${distance}`);
    return {
      fromEntity: referenceEntity,
      toEntity: subjectEntity,
      referenceEntity,
      subjectEntity,
      vector,
      direction: classified,
      distance: Math.round(distance),
    };
  });
  const origin = nameMap[keys[0]];
  const foundation = solveEntityPositions(relations, origin);
  const independent = solveRelativeGraphIndependent(relations, origin);
  if (!foundation.connected || foundation.contradictions.length || !independent.connected || independent.contradictions.length) {
    throw new Error("Generated DIR-CP-004 graph must be connected and consistent");
  }
  for (const entity of Object.keys(coordinates)) {
    const left = foundation.coordinates[entity];
    const right = independent.coordinates[entity];
    if (!left || !right || Math.abs(left.x - right.x) > 1e-9 || Math.abs(left.y - right.y) > 1e-9) {
      throw new Error(`Independent graph solver disagreed for ${entity}`);
    }
  }
  return { entities: Object.values(nameMap), origin, relations, coordinates: foundation.coordinates };
}

function standardGraph(seed: number): { readonly graph: BuiltGraph; readonly keyToName: Readonly<Record<string, string>> } {
  const h = 4 + (Math.abs(seed * 7) % 5);
  const v = 5 + (Math.abs(seed * 11) % 7);
  const base = { A: { x: 0, y: 0 }, B: { x: h, y: 0 }, C: { x: 0, y: v }, D: { x: h, y: v }, E: { x: -h, y: v } };
  const q = Math.floor(Math.abs(seed) / 8) % 4;
  const graph = buildGraph(seed, base, [["A", "B"], ["A", "C"], ["B", "D"], ["C", "E"]], q);
  return { graph, keyToName: namesFor(seed, 5) };
}

function distanceGraph(seed: number): { readonly graph: BuiltGraph; readonly keyToName: Readonly<Record<string, string>>; readonly subjectKey: string; readonly referenceKey: string } {
  const profiles = [[3, 8], [6, 5], [4, 15], [12, 7], [20, 9]] as const;
  const [h, v] = profiles[Math.abs(seed) % profiles.length];
  const base = { A: { x: 0, y: 0 }, B: { x: h, y: 0 }, C: { x: 0, y: v }, D: { x: h, y: v }, E: { x: -h, y: v } };
  const diagonal = seed % 2 === 0;
  const q = Math.floor(Math.abs(seed) / 2) % 4;
  const graph = buildGraph(seed + 101, base, [["A", "B"], ["A", "C"], ["B", "D"], ["C", "E"]], q);
  const reverse = (Math.abs(seed) & 8) !== 0;
  const pair: readonly [string, string] = diagonal ? ["E", "B"] : ["D", "E"];
  return { graph, keyToName: namesFor(seed + 101, 5), subjectKey: reverse ? pair[1] : pair[0], referenceKey: reverse ? pair[0] : pair[1] };
}

function lookupGraph(seed: number): { readonly graph: BuiltGraph; readonly keyToName: Readonly<Record<string, string>>; readonly subjectKey: string; readonly referenceKey: string } {
  const h = 5 + (Math.abs(seed) % 6);
  const v = 6 + (Math.abs(seed * 3) % 7);
  const base = { A: { x: 0, y: 0 }, B: { x: h, y: 0 }, C: { x: 0, y: v }, D: { x: -h, y: 0 }, E: { x: 0, y: -v } };
  const pairs = [["C", "A"], ["E", "A"], ["B", "A"], ["D", "A"], ["C", "B"], ["C", "D"], ["E", "B"], ["E", "D"]] as const;
  const [subjectKey, referenceKey] = pairs[Math.abs(seed) % pairs.length];
  const graph = buildGraph(seed + 203, base, [["A", "B"], ["A", "C"], ["A", "D"], ["A", "E"]], Math.floor(Math.abs(seed) / 8) % 4);
  return { graph, keyToName: namesFor(seed + 203, 5), subjectKey, referenceKey };
}

function collinearGraph(seed: number): { readonly graph: BuiltGraph; readonly keyToName: Readonly<Record<string, string>>; readonly answerKeys: readonly [string, string, string] } {
  const h = 4 + (Math.abs(seed) % 5);
  const v = 5 + (Math.abs(seed * 3) % 6);
  const base = { A: { x: -h, y: 0 }, B: { x: 0, y: 0 }, C: { x: h, y: 0 }, D: { x: -h, y: v }, E: { x: 0, y: -v }, F: { x: h, y: 2 * v } };
  const graph = buildGraph(seed + 307, base, [["B", "A"], ["B", "C"], ["A", "D"], ["B", "E"], ["C", "F"]], Math.abs(seed) % 4);
  return { graph, keyToName: namesFor(seed + 307, 6), answerKeys: ["A", "B", "C"] };
}

function coincidenceGraph(seed: number): { readonly graph: BuiltGraph; readonly keyToName: Readonly<Record<string, string>>; readonly pairKeys: readonly [string, string] } {
  const h = 5 + (Math.abs(seed) % 6);
  const v = 6 + (Math.abs(seed * 5) % 7);
  const base = { A: { x: 0, y: 0 }, B: { x: h, y: 0 }, C: { x: h, y: v }, D: { x: 0, y: v }, E: { x: 0, y: v } };
  const graph = buildGraph(seed + 401, base, [["A", "B"], ["B", "C"], ["A", "D"], ["C", "E"]], Math.abs(seed) % 4);
  return { graph, keyToName: namesFor(seed + 401, 5), pairKeys: ["D", "E"] };
}

function relationSentences(relations: readonly RelativeRelation[]): readonly string[] {
  return relations.map((relation) => renderRelationSentence({
    subject: relation.subjectEntity,
    reference: relation.referenceEntity,
    direction: relation.direction,
    distance: relation.distance,
  }));
}

function placementLines(relations: readonly RelativeRelation[], origin: string): readonly string[] {
  const known = new Set<string>([origin]);
  const remaining = [...relations];
  const lines: string[] = [];

  while (remaining.length > 0) {
    const index = remaining.findIndex((relation) => known.has(relation.referenceEntity) !== known.has(relation.subjectEntity));
    if (index === -1) {
      throw new Error(`DIR-CP-004 relation order cannot be explained from origin ${origin}`);
    }
    const [relation] = remaining.splice(index, 1);
    const referenceKnown = known.has(relation.referenceEntity);
    const newEntity = referenceKnown ? relation.subjectEntity : relation.referenceEntity;
    const knownEntity = referenceKnown ? relation.referenceEntity : relation.subjectEntity;
    const direction = referenceKnown ? relation.direction : oppositeDirection(relation.direction);
    const stated = renderRelationSentence({
      subject: relation.subjectEntity,
      reference: relation.referenceEntity,
      direction: relation.direction,
      distance: relation.distance,
    });
    const derived = referenceKnown
      ? stated.slice(0, -1)
      : `${stated} This means ${newEntity} is ${relation.distance} metres ${RELATIVE_DIRECTION_PHRASES[direction]} of ${knownEntity}`;
    lines.push(`${derived}, so place ${newEntity} ${placementPhrase(direction)} ${knownEntity}.`);
    known.add(newEntity);
  }

  if (known.size !== relations.length + 1) {
    throw new Error(`DIR-CP-004 explanation placed ${known.size} entities for ${relations.length} relations`);
  }
  return lines;
}

function answerKey(answer: RelativeGraphAnswer): string {
  if (answer.kind === "DIRECTION") return `D:${answer.direction}`;
  if (answer.kind === "DIRECTION_DISTANCE") return `DD:${answer.direction}:${answer.distance}`;
  if (answer.kind === "ENTITY") return `E:${answer.entity}`;
  if (answer.kind === "ENTITY_GROUP") return `G:${[...answer.entities].sort().join("|")}`;
  return `P:${[...answer.entities].sort().join("|")}`;
}

function validateOptions(options: readonly RenderedRelativeOption[], correct: RelativeGraphAnswer): number {
  if (options.length !== 4) throw new Error(`DIR-CP-004 requires four options, received ${options.length}`);
  if (new Set(options.map((option) => option.label.toLocaleLowerCase("en-IN"))).size !== 4) throw new Error("DIR-CP-004 option labels must be unique");
  const key = answerKey(correct);
  const indexes = options.map((option, index) => answerKey(option.value) === key ? index : -1).filter((index) => index >= 0);
  if (indexes.length !== 1) throw new Error(`DIR-CP-004 expected one correct option, received ${indexes.length}`);
  return indexes[0];
}

function directionOptions(correct: Direction, seed: number): readonly RenderedRelativeOption[] {
  const values = [
    { direction: correct, errorLabel: null },
    { direction: oppositeDirection(correct), errorLabel: "QUERY_RELATION_REVERSED" },
    { direction: rotateDirection(correct, 2), errorLabel: "CLOCKWISE_QUADRANT_ERROR" },
    { direction: rotateDirection(correct, -2), errorLabel: "ANTICLOCKWISE_QUADRANT_ERROR" },
  ];
  return shuffle(values.map(({ direction, errorLabel }) => ({ value: { kind: "DIRECTION", direction } as const, label: relationOptionLabel(direction), errorLabel })), seed * 41 + 7);
}

function directionDistanceOptions(correctDirection: Direction, correctDistance: number, dx: number, dy: number, seed: number): readonly RenderedRelativeOption[] {
  const wrongDistanceCandidates = [Math.abs(dx) + Math.abs(dy), Math.max(Math.abs(dx), Math.abs(dy)), correctDistance + 2, Math.max(1, correctDistance - 2)];
  const wrongDistance = wrongDistanceCandidates.find((value) => value !== correctDistance)!;
  const opposite = oppositeDirection(correctDirection);
  const values = [
    { direction: correctDirection, distance: correctDistance, errorLabel: null },
    { direction: opposite, distance: correctDistance, errorLabel: "QUERY_RELATION_REVERSED" },
    { direction: correctDirection, distance: wrongDistance, errorLabel: "DISTANCE_COMPUTATION_ERROR" },
    { direction: opposite, distance: wrongDistance, errorLabel: "DIRECTION_AND_DISTANCE_ERROR" },
  ];
  return shuffle(values.map(({ direction, distance, errorLabel }) => ({
    value: { kind: "DIRECTION_DISTANCE", direction, distance } as const,
    label: directionDistanceLabel(direction, distance),
    errorLabel,
  })), seed * 43 + 11);
}

function entityOptions(correct: string, graph: BuiltGraph, reference: string, seed: number): readonly RenderedRelativeOption[] {
  const candidates = graph.entities.filter((entity) => entity !== reference);
  const selected = [correct, ...shuffle(candidates.filter((entity) => entity !== correct), seed * 47 + 13).slice(0, 3)];
  return shuffle(selected.map((entity) => ({
    value: { kind: "ENTITY", entity } as const,
    label: entity,
    errorLabel: entity === correct ? null : "WRONG_ENTITY_FOR_RELATION",
  })), seed * 53 + 17);
}

function groupLabel(entities: readonly string[]): string {
  return [...entities].sort().join(", ");
}

function groupOptions(correct: readonly string[], distractors: readonly (readonly string[])[], seed: number): readonly RenderedRelativeOption[] {
  const values = [correct, ...distractors].map((entities, index) => ({
    value: { kind: "ENTITY_GROUP", entities: [...entities].sort() } as const,
    label: groupLabel(entities),
    errorLabel: index === 0 ? null : "NOT_COLLINEAR",
  }));
  return shuffle(values, seed * 59 + 19);
}

function pairLabel(pair: readonly [string, string]): string {
  return [...pair].sort().join(" and ");
}

function pairOptions(correct: readonly [string, string], distractors: readonly (readonly [string, string])[], seed: number): readonly RenderedRelativeOption[] {
  const values = [correct, ...distractors].map((entities, index) => ({
    value: { kind: "ENTITY_PAIR", entities: [...entities].sort() as [string, string] } as const,
    label: pairLabel(entities),
    errorLabel: index === 0 ? null : "DIFFERENT_POSITIONS",
  }));
  return shuffle(values, seed * 61 + 23);
}

function difficulty(answerDemand: DirCp004AnswerDemand, relationCount: number): "EASY" | "MEDIUM" | "HARD" {
  if (answerDemand === "RELATION_DIRECTION" && relationCount <= 4) return "EASY";
  if (answerDemand === "COINCIDENT_ENTITY_PAIR") return "HARD";
  if (answerDemand === "RELATION_DIRECTION_AND_DISTANCE" || answerDemand === "COLLINEAR_ENTITY_GROUP") return "HARD";
  return "MEDIUM";
}

function baseQuestion(
  qlId: string,
  seed: number,
  graph: BuiltGraph,
  stem: string,
  correctAnswer: RelativeGraphAnswer,
  options: readonly RenderedRelativeOption[],
  resultLine: string,
  calculationLine: string | null,
  conclusion: string,
  diagram: RelativePositionDiagramSpec,
  query: Readonly<Record<string, unknown>>,
): GeneratedRelativeGraphQuestion {
  const ql = dirCp004Ql(qlId);
  return {
    qlId,
    checkpointId: "DIR-CP-004",
    ruleId: ql.ruleId,
    seed,
    difficulty: difficulty(ql.answerDemand, graph.relations.length),
    stem,
    structuredPrompt: {
      relations: graph.relations,
      coordinates: graph.coordinates,
      answerDemand: ql.answerDemand,
      query,
    },
    options,
    correctIndex: validateOptions(options, correctAnswer),
    correctAnswer,
    explanation: {
      given: `Take ${graph.origin} as a reference point and place the others one statement at a time.`,
      placementLines: placementLines(graph.relations, graph.origin),
      resultLine,
      calculationLine,
      conclusion,
      diagram,
    },
    metadata: {
      answerDemand: ql.answerDemand,
      entityCount: graph.entities.length,
      relationCount: graph.relations.length,
      graphTopology: "BRANCHED_TREE",
      solverVerified: true,
      solveMode: null,
    },
  };
}

export function generateDirCp004Question(qlId: string, seed = 0): GeneratedRelativeGraphQuestion {
  if (!Number.isInteger(seed)) throw new Error(`DIR-CP-004 seed must be an integer, received ${seed}`);
  const ql = dirCp004Ql(qlId);

  if (ql.answerDemand === "RELATION_DIRECTION") {
    const { graph, keyToName } = standardGraph(seed);
    const pairs = [["D", "A"], ["A", "D"], ["E", "B"], ["B", "E"], ["D", "C"], ["C", "D"], ["C", "A"], ["A", "C"]] as const;
    const [subjectKey, referenceKey] = pairs[Math.abs(seed) % pairs.length];
    const subject = keyToName[subjectKey];
    const reference = keyToName[referenceKey];
    const direction = independentDirection(graph.coordinates[reference], graph.coordinates[subject]);
    if (direction === "SAME_POSITION") throw new Error("Direction QL may not query coincident entities");
    const correct = { kind: "DIRECTION", direction } as const;
    const options = directionOptions(direction, seed);
    return baseQuestion(
      qlId, seed, graph,
      renderGraphStem(relationSentences(graph.relations), renderDirectionQuestion(subject, reference)),
      correct, options,
      `${subject} lies ${RELATIVE_DIRECTION_PHRASES[direction]} of ${reference}.`,
      null,
      `Therefore, ${subject} is ${RELATIVE_DIRECTION_LABELS[direction]} of ${reference}.`,
      buildRelativePositionDiagram(graph.coordinates, graph.relations),
      { subject, reference },
    );
  }

  if (ql.answerDemand === "RELATION_DIRECTION_AND_DISTANCE") {
    const { graph, keyToName, subjectKey, referenceKey } = distanceGraph(seed);
    const subject = keyToName[subjectKey];
    const reference = keyToName[referenceKey];
    const direction = independentDirection(graph.coordinates[reference], graph.coordinates[subject]);
    if (direction === "SAME_POSITION") throw new Error("Direction-distance QL may not query coincident entities");
    const rawDistance = independentDistance(graph.coordinates[reference], graph.coordinates[subject]);
    const distance = Math.round(rawDistance);
    if (Math.abs(rawDistance - distance) > 1e-9) throw new Error("DIR-QL-012 requires exact integer distance");
    const delta = distanceBetween(graph.coordinates[reference], graph.coordinates[subject]);
    const horizontal = Math.abs(delta.dx);
    const vertical = Math.abs(delta.dy);
    const resultParts = [
      horizontal ? `${horizontal} metres ${delta.dx > 0 ? "East" : "West"}` : null,
      vertical ? `${vertical} metres ${delta.dy > 0 ? "North" : "South"}` : null,
    ].filter((value): value is string => value !== null);
    const calculationLine = horizontal === 0 || vertical === 0
      ? `Only one net direction remains, so the straight-line distance is ${distance} metres.`
      : `The shortest distance is √(${horizontal}² + ${vertical}²) = √${delta.squaredDistance} = ${distance} metres.`;
    const correct = { kind: "DIRECTION_DISTANCE", direction, distance } as const;
    const options = directionDistanceOptions(direction, distance, delta.dx, delta.dy, seed);
    return baseQuestion(
      qlId, seed, graph,
      renderGraphStem(relationSentences(graph.relations), renderDirectionDistanceQuestion(subject, reference)),
      correct, options,
      `The net separation from ${reference} to ${subject} is ${resultParts.join(" and ")}.`,
      calculationLine,
      `Therefore, ${subject} is ${RELATIVE_DIRECTION_LABELS[direction]} of ${reference}, ${distance} metres away.`,
      buildRelativePositionDiagram(graph.coordinates, graph.relations, { queryPair: { subject, reference, shortestDistanceLabel: `${distance} metres` } }),
      { subject, reference },
    );
  }

  if (ql.answerDemand === "ENTITY_AT_RELATION") {
    const { graph, keyToName, subjectKey, referenceKey } = lookupGraph(seed);
    const subject = keyToName[subjectKey];
    const reference = keyToName[referenceKey];
    const direction = independentDirection(graph.coordinates[reference], graph.coordinates[subject]);
    if (direction === "SAME_POSITION") throw new Error("Entity lookup requires a direction");
    const matches = graph.entities.filter((entity) => entity !== reference && independentDirection(graph.coordinates[reference], graph.coordinates[entity]) === direction);
    if (matches.length !== 1 || matches[0] !== subject) throw new Error(`Entity lookup is not unique for seed ${seed}`);
    const correct = { kind: "ENTITY", entity: subject } as const;
    const options = entityOptions(subject, graph, reference, seed);
    return baseQuestion(
      qlId, seed, graph,
      renderGraphStem(relationSentences(graph.relations), renderEntityLookupQuestion(direction, reference)),
      correct, options,
      `Only ${subject} lies ${RELATIVE_DIRECTION_PHRASES[direction]} of ${reference}.`,
      null,
      `Therefore, the required person is ${subject}.`,
      buildRelativePositionDiagram(graph.coordinates, graph.relations),
      { reference, direction },
    );
  }

  if (ql.answerDemand === "COLLINEAR_ENTITY_GROUP") {
    const { graph, keyToName, answerKeys } = collinearGraph(seed);
    const correctEntities = answerKeys.map((key) => keyToName[key]) as [string, string, string];
    if (!independentCollinear(...correctEntities.map((entity) => graph.coordinates[entity]) as [Coordinate, Coordinate, Coordinate])) {
      throw new Error("Expected collinear group did not remain collinear");
    }
    const distractorKeys = [["A", "D", "E"], ["B", "D", "F"], ["C", "E", "F"]] as const;
    const distractors = distractorKeys.map((keys) => keys.map((key) => keyToName[key]));
    for (const group of distractors) {
      if (independentCollinear(...group.map((entity) => graph.coordinates[entity]) as [Coordinate, Coordinate, Coordinate])) throw new Error("Collinearity distractor is accidentally correct");
    }
    const correct = { kind: "ENTITY_GROUP", entities: [...correctEntities].sort() } as const;
    const options = groupOptions(correctEntities, distractors, seed);
    return baseQuestion(
      qlId, seed, graph,
      renderGraphStem(relationSentences(graph.relations), renderCollinearQuestion()),
      correct, options,
      `${correctEntities.join(", ")} lie on the same straight line.`,
      null,
      `Therefore, the collinear group is ${groupLabel(correctEntities)}.`,
      buildRelativePositionDiagram(graph.coordinates, graph.relations, { collinearEntities: correctEntities }),
      { relation: "COLLINEAR_GROUP" },
    );
  }

  const { graph, keyToName, pairKeys } = coincidenceGraph(seed);
  const pair = pairKeys.map((key) => keyToName[key]) as [string, string];
  const same = independentDirection(graph.coordinates[pair[0]], graph.coordinates[pair[1]]);
  if (same !== "SAME_POSITION") throw new Error("Expected coincidence pair did not coincide");
  const allPairs: [string, string][] = [];
  for (let left = 0; left < graph.entities.length; left += 1) {
    for (let right = left + 1; right < graph.entities.length; right += 1) allPairs.push([graph.entities[left], graph.entities[right]]);
  }
  const actualPairs = allPairs.filter(([left, right]) => independentDirection(graph.coordinates[left], graph.coordinates[right]) === "SAME_POSITION");
  if (actualPairs.length !== 1 || pairLabel(actualPairs[0]) !== pairLabel(pair)) throw new Error("Coincidence pair must be unique");
  const distractors = shuffle(allPairs.filter((candidate) => pairLabel(candidate) !== pairLabel(pair)), seed * 67 + 29).slice(0, 3) as [string, string][];
  const correct = { kind: "ENTITY_PAIR", entities: [...pair].sort() as [string, string] } as const;
  const options = pairOptions(pair, distractors, seed);
  return baseQuestion(
    qlId, seed, graph,
    renderGraphStem(relationSentences(graph.relations), renderCoincidenceQuestion()),
    correct, options,
    `${pair[0]} and ${pair[1]} both resolve to the same point.`,
    null,
    `Therefore, ${pairLabel(pair)} are standing at the same position.`,
    buildRelativePositionDiagram(graph.coordinates, graph.relations),
    { relation: "COINCIDENT_PAIR" },
  );
}
