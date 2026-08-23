import { spatialSceneSemanticFingerprint } from "./normalize";
import type { SpatialNode, SpatialPoint, SpatialScene } from "./types";
import {
  figureGraphFingerprintV1,
  findFigureGraphEmbeddingsV1,
  spatialSceneToFigureGraphV1,
  type FigureGraphMatchPolicyV1,
} from "./figure-graph-v1";

export const EMB_001_DIRECTIONAL_PROTOTYPES_V2 = [
  "EMB-PROT-07-OPTION-IN-QUESTION-POSITIVE",
  "EMB-PROT-08-OPTION-NOT-IN-QUESTION",
] as const;

export type EmbeddedDirectionalPrototypeV2 = (typeof EMB_001_DIRECTIONAL_PROTOTYPES_V2)[number];
export type EmbeddedDirectionalPolarityV2 = "SELECT_EMBEDDED" | "SELECT_NOT_EMBEDDED";

export interface EmbeddedDirectionalQuestionV2 {
  version: "EMB-001-DIRECTIONAL-DISCOVERY-QUESTION-V2";
  packageId: "SPA-001";
  chapterCode: "EMB-001";
  prototypeId: EmbeddedDirectionalPrototypeV2;
  permanentQlId: null;
  seed: string;
  provenance: "SOURCE_BACKED_CORE";
  sourceAnchor: "RSC-EMB-CH33-DIR-41-49";
  taskDirection: "ANSWER_FIGURE_INSIDE_QUESTION_FIGURE";
  polarity: EmbeddedDirectionalPolarityV2;
  difficulty: "L2_STANDARD" | "L3_ADVANCED";
  stem: string;
  questionScene: SpatialScene;
  options: Array<{
    scene: SpatialScene;
    embeddingCount: number;
    misconception: "CORRECT_PRESENT" | "CORRECT_ABSENT" | "PRESENT_DECOY" | "ABSENT_DECOY";
  }>;
  correctOptionIndex: 0 | 1 | 2 | 3;
  answer: "A" | "B" | "C" | "D";
  matchPolicy: FigureGraphMatchPolicyV1;
  solverEvidence: {
    questionGraphFingerprint: string;
    optionGraphFingerprints: string[];
    optionEmbeddingCounts: number[];
    satisfyingOptionIndexes: number[];
  };
  explanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
  contentFingerprint: string;
  deliveryFingerprint: string;
  renderer: {
    recommendedQuestionPixels: 300;
    recommendedOptionPixels: 160;
    mobileMinimumOptionPixels: 108;
  };
  lifecycle: {
    maturity: "EXECUTABLE_DISCOVERY_PROOF";
    questionStudioDiscoverable: false;
    questionStudioRegistration: "NOT_REGISTERED";
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticPublication: false;
  };
}

export const EMB_001_SOURCE_DIRECTION_AUTHORITY_V2 = Object.freeze({
  authorityId: "EMB-001-SOURCE-DIRECTION-AUTHORITY-V2" as const,
  source: "Reasoning for Competitions, Embedded Figures, Chapter 33" as const,
  sourceEvidence: {
    directQuestions: "Directions 1-40: question figure hidden in one answer figure" as const,
    reversePositiveQuestions: "Directions 41-48: one answer figure hidden/embedded in question figure" as const,
    reverseNegativeQuestion: "Question 49: select answer not hidden/embedded in question figure" as const,
    labelledExamFamilies: ["SSC_GD_2021", "SSC_CHSL_2020", "SSC_CPO_2019_2020", "DELHI_POLICE_2017_2020", "RRB_ALP_2018", "RRB_GROUP_D_2018", "DSSSB_2018_2019"] as const,
  },
  learnerArchetypeProposal: {
    forwardContainment: "ONE_LEARNER_METHOD_WITH_GEOMETRY_COMPLEXITY_PARAMETERS" as const,
    reverseContainment: "ONE_LEARNER_METHOD_WITH_POSITIVE_NEGATIVE_POLARITY_PARAMETER" as const,
    proposedLearnerArchetypeCount: 2,
  },
  permanentQlAllocationAllowed: false,
  questionStudioRegistrationAllowed: false,
} as const);

const LETTERS = ["A", "B", "C", "D"] as const;
const STYLE = Object.freeze({ stroke: "#111", strokeWidth: 2.5, fill: "none" as const, lineCap: "round" as const, lineJoin: "round" as const });

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function fraction(seed: string, key: string, min: number, max: number): number {
  const unit = hash32(`${seed}:${key}`) / 0xffffffff;
  return min + (max - min) * unit;
}

function line(id: string, a: SpatialPoint, b: SpatialPoint, role = "figure"): SpatialNode {
  return { kind: "line", id, role, start: { ...a }, end: { ...b }, style: { ...STYLE } };
}

function scene(id: string, nodes: SpatialNode[], width: number, height: number): SpatialScene {
  return {
    version: "1.0",
    id,
    viewBox: { minX: 0, minY: 0, width, height },
    nodes,
    metadata: { chapterCode: "EMB-001" },
  };
}

function motif(seed: string, variant: number): SpatialNode[] {
  const dx = fraction(seed, `m${variant}-dx`, -2, 2);
  const dy = fraction(seed, `m${variant}-dy`, -2, 2);
  switch (variant % 4) {
    case 0: {
      const a = { x: 20 + dx, y: 24 + dy };
      const b = { x: 53 + dx, y: 24 + dy };
      const c = { x: 67 + dx, y: 43 + dy };
      const d = { x: 49 + dx, y: 62 + dy };
      const e = { x: 58 + dx, y: 76 + dy };
      return [line("m0-1", a, b), line("m0-2", b, c), line("m0-3", c, d), line("m0-4", d, e)];
    }
    case 1: {
      const a = { x: 28 + dx, y: 62 + dy };
      const b = { x: 49 + dx, y: 24 + dy };
      const c = { x: 71 + dx, y: 62 + dy };
      const d = { x: 28 + dx, y: 62 + dy };
      const e = { x: 49 + dx, y: 77 + dy };
      return [line("m1-1", a, b), line("m1-2", b, c), line("m1-3", c, d), line("m1-4", b, e)];
    }
    case 2: {
      const a = { x: 22 + dx, y: 28 + dy };
      const b = { x: 44 + dx, y: 44 + dy };
      const c = { x: 62 + dx, y: 29 + dy };
      const d = { x: 75 + dx, y: 52 + dy };
      const e = { x: 53 + dx, y: 70 + dy };
      return [line("m2-1", a, b), line("m2-2", b, c), line("m2-3", c, d), line("m2-4", d, e), line("m2-5", b, e)];
    }
    default: {
      const a = { x: 25 + dx, y: 27 + dy };
      const b = { x: 66 + dx, y: 27 + dy };
      const c = { x: 66 + dx, y: 58 + dy };
      const d = { x: 45 + dx, y: 71 + dy };
      const e = { x: 33 + dx, y: 55 + dy };
      return [line("m3-1", a, b), line("m3-2", b, c), line("m3-3", c, d), line("m3-4", d, e), line("m3-5", e, a)];
    }
  }
}

function centroid(nodes: readonly SpatialNode[]): SpatialPoint {
  const points: SpatialPoint[] = [];
  for (const node of nodes) {
    if (node.kind !== "line") continue;
    points.push(node.start, node.end);
  }
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function transformPoint(point: SpatialPoint, origin: SpatialPoint, destination: SpatialPoint, rotationDeg: number): SpatialPoint {
  const x = point.x - origin.x;
  const y = point.y - origin.y;
  const angle = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: destination.x + x * cos - y * sin, y: destination.y + x * sin + y * cos };
}

function place(nodes: readonly SpatialNode[], destination: SpatialPoint, rotationDeg: number, prefix: string): SpatialNode[] {
  const origin = centroid(nodes);
  return nodes.map((node) => {
    if (node.kind !== "line") throw new Error("EMB directional V2 motifs must contain lines only.");
    return {
      ...node,
      id: `${prefix}${node.id}`,
      start: transformPoint(node.start, origin, destination, rotationDeg),
      end: transformPoint(node.end, origin, destination, rotationDeg),
      role: "embedded",
    };
  });
}

function clutter(seed: string, count = 9): SpatialNode[] {
  const raw = [
    [7, 16, 113, 83], [8, 101, 108, 20], [5, 55, 115, 55], [58, 6, 58, 114],
    [14, 24, 106, 102], [17, 109, 100, 31], [6, 76, 114, 35], [27, 6, 94, 113],
    [8, 38, 112, 75], [20, 113, 91, 10], [13, 88, 110, 48], [37, 8, 83, 111],
  ] as const;
  const start = hash32(`${seed}:clutter-start`) % raw.length;
  const dx = fraction(seed, "clutter-dx", -2.2, 2.2);
  const dy = fraction(seed, "clutter-dy", -2.2, 2.2);
  return Array.from({ length: count }, (_, index) => {
    const item = raw[(start + index) % raw.length]!;
    return line(
      `clutter-${index}`,
      { x: item[0] + dx, y: item[1] + dy },
      { x: item[2] + dx, y: item[3] + dy },
      "clutter",
    );
  });
}

function policy(): FigureGraphMatchPolicyV1 {
  return { allowRotation: true, allowReflection: false, allowScale: false, tolerance: 1e-4 };
}

function mutateAbsent(nodes: readonly SpatialNode[], seed: string): SpatialNode[] {
  return nodes.map((node, index) => {
    if (node.kind !== "line") return { ...node };
    if (index !== 1) return { ...node, id: `absent-${node.id}` };
    const shift = fraction(seed, "absent-shift", 6, 10);
    return {
      ...node,
      id: `absent-${node.id}`,
      end: { x: node.end.x + shift, y: node.end.y - shift * 0.7 },
    };
  });
}

function optionScene(seed: string, slot: number, nodes: readonly SpatialNode[]): SpatialScene {
  const graph = spatialSceneToFigureGraphV1(scene(`tmp-option:${seed}:${slot}`, [...nodes], 96, 96));
  const points = graph.segments.flatMap((segment) => [segment.a, segment.b]);
  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const shifted = nodes.map((node) => {
    if (node.kind !== "line") return node;
    return {
      ...node,
      id: `option-${slot}-${node.id}`,
      start: { x: node.start.x - minX + 12, y: node.start.y - minY + 12 },
      end: { x: node.end.x - minX + 12, y: node.end.y - minY + 12 },
      role: "candidate",
    };
  });
  return scene(`emb-directional-option:${seed}:${slot}`, shifted, 96, 96);
}

function solveOptions(questionScene: SpatialScene, optionScenes: readonly SpatialScene[]): { counts: number[]; optionFingerprints: string[] } {
  const hostGraph = spatialSceneToFigureGraphV1(questionScene);
  const counts = optionScenes.map((option) => findFigureGraphEmbeddingsV1(spatialSceneToFigureGraphV1(option), hostGraph, policy()).length);
  const optionFingerprints = optionScenes.map((option) => figureGraphFingerprintV1(spatialSceneToFigureGraphV1(option)));
  return { counts, optionFingerprints };
}

function buildPositive(seed: string, desiredCorrectOptionIndex: 0 | 1 | 2 | 3): EmbeddedDirectionalQuestionV2 {
  const base = motif(seed, hash32(`${seed}:motif`) % 4);
  const destination = { x: fraction(seed, "dest-x", 48, 70), y: fraction(seed, "dest-y", 46, 72) };
  const rotation = [0, 45, 90, 135, 180, 225, 270, 315][hash32(`${seed}:rotation`) % 8]!;
  const questionScene = scene(`emb-directional-positive-host:${seed}`, [...clutter(seed, 10), ...place(base, destination, rotation, "present-")], 120, 120);
  const correct = optionScene(seed, 0, base);
  const wrong1 = optionScene(seed, 1, mutateAbsent(base, `${seed}:w1`));
  const wrong2Base = motif(`${seed}:w2`, (hash32(`${seed}:motif`) + 1) % 4);
  const wrong2 = optionScene(seed, 2, mutateAbsent(wrong2Base, `${seed}:w2m`));
  const wrong3Base = motif(`${seed}:w3`, (hash32(`${seed}:motif`) + 2) % 4);
  const wrong3 = optionScene(seed, 3, mutateAbsent(wrong3Base, `${seed}:w3m`));
  const distractors = [wrong1, wrong2, wrong3];
  const ordered = [...distractors];
  ordered.splice(desiredCorrectOptionIndex, 0, correct);
  const solved = solveOptions(questionScene, ordered);
  const satisfyingOptionIndexes = solved.counts.map((count, index) => ({ count, index })).filter(({ count }) => count > 0).map(({ index }) => index);
  if (satisfyingOptionIndexes.length !== 1 || satisfyingOptionIndexes[0] !== desiredCorrectOptionIndex) {
    throw new Error(`EMB-PROT-07/${seed}: reverse-positive solver did not preserve one unique embedded option.`);
  }
  const answer = LETTERS[desiredCorrectOptionIndex];
  const questionFingerprint = spatialSceneSemanticFingerprint(questionScene);
  const optionSceneFingerprints = ordered.map((option) => spatialSceneSemanticFingerprint(option));
  const contentFingerprint = JSON.stringify({ prototypeId: "EMB-PROT-07-OPTION-IN-QUESTION-POSITIVE", questionFingerprint, optionSet: [...optionSceneFingerprints].sort(), correct: optionSceneFingerprints[desiredCorrectOptionIndex] });
  return {
    version: "EMB-001-DIRECTIONAL-DISCOVERY-QUESTION-V2",
    packageId: "SPA-001",
    chapterCode: "EMB-001",
    prototypeId: "EMB-PROT-07-OPTION-IN-QUESTION-POSITIVE",
    permanentQlId: null,
    seed,
    provenance: "SOURCE_BACKED_CORE",
    sourceAnchor: "RSC-EMB-CH33-DIR-41-49",
    taskDirection: "ANSWER_FIGURE_INSIDE_QUESTION_FIGURE",
    polarity: "SELECT_EMBEDDED",
    difficulty: "L2_STANDARD",
    stem: "Which one of the answer figures is hidden or embedded in the question figure?",
    questionScene,
    options: ordered.map((option, index) => ({ scene: option, embeddingCount: solved.counts[index]!, misconception: index === desiredCorrectOptionIndex ? "CORRECT_PRESENT" : "ABSENT_DECOY" })),
    correctOptionIndex: desiredCorrectOptionIndex,
    answer,
    matchPolicy: policy(),
    solverEvidence: { questionGraphFingerprint: figureGraphFingerprintV1(spatialSceneToFigureGraphV1(questionScene)), optionGraphFingerprints: solved.optionFingerprints, optionEmbeddingCounts: solved.counts, satisfyingOptionIndexes },
    explanation: {
      observation: "Treat each answer figure as a small candidate and trace it inside the larger question figure.",
      rule: "The candidate may be rotated, but every segment and junction must be present exactly; reflection and scaling are not allowed.",
      application: `Only option ${answer} can be traced completely inside the question figure without changing its structure.`,
      check: `Option ${answer} is the only candidate with a complete graph embedding in the question figure.`,
    },
    contentFingerprint,
    deliveryFingerprint: JSON.stringify({ contentFingerprint, ordered: optionSceneFingerprints, correctOptionIndex: desiredCorrectOptionIndex }),
    renderer: { recommendedQuestionPixels: 300, recommendedOptionPixels: 160, mobileMinimumOptionPixels: 108 },
    lifecycle: { maturity: "EXECUTABLE_DISCOVERY_PROOF", questionStudioDiscoverable: false, questionStudioRegistration: "NOT_REGISTERED", questionBankWritable: false, testEligible: false, publiclyPublishable: false, automaticPublication: false },
  };
}

function buildNegative(seed: string, desiredCorrectOptionIndex: 0 | 1 | 2 | 3): EmbeddedDirectionalQuestionV2 {
  const presentMotifs = [0, 1, 2].map((offset) => motif(`${seed}:present:${offset}`, (hash32(`${seed}:base`) + offset) % 4));
  const absentBase = motif(`${seed}:absent`, (hash32(`${seed}:base`) + 3) % 4);
  const absent = mutateAbsent(absentBase, `${seed}:absent-mutate`);
  const placements = presentMotifs.flatMap((nodes, index) => place(
    nodes,
    { x: 33 + index * 27 + fraction(seed, `px-${index}`, -2, 2), y: 37 + (index % 2) * 37 + fraction(seed, `py-${index}`, -2, 2) },
    [0, 45, 90, 135, 180, 225, 270, 315][hash32(`${seed}:rot:${index}`) % 8]!,
    `present-${index}-`,
  ));
  const questionScene = scene(`emb-directional-negative-host:${seed}`, [...clutter(`${seed}:negative`, 8), ...placements], 120, 120);
  const presentOptions = presentMotifs.map((nodes, index) => optionScene(seed, index, nodes));
  const absentOption = optionScene(seed, 3, absent);
  const ordered = [...presentOptions];
  ordered.splice(desiredCorrectOptionIndex, 0, absentOption);
  ordered.splice(desiredCorrectOptionIndex === 3 ? 3 : 4, 1);
  const solved = solveOptions(questionScene, ordered);
  const satisfyingOptionIndexes = solved.counts.map((count, index) => ({ count, index })).filter(({ count }) => count === 0).map(({ index }) => index);
  if (satisfyingOptionIndexes.length !== 1 || satisfyingOptionIndexes[0] !== desiredCorrectOptionIndex) {
    throw new Error(`EMB-PROT-08/${seed}: reverse-negative solver did not preserve one unique absent option.`);
  }
  const answer = LETTERS[desiredCorrectOptionIndex];
  const questionFingerprint = spatialSceneSemanticFingerprint(questionScene);
  const optionSceneFingerprints = ordered.map((option) => spatialSceneSemanticFingerprint(option));
  const contentFingerprint = JSON.stringify({ prototypeId: "EMB-PROT-08-OPTION-NOT-IN-QUESTION", questionFingerprint, optionSet: [...optionSceneFingerprints].sort(), absent: optionSceneFingerprints[desiredCorrectOptionIndex] });
  return {
    version: "EMB-001-DIRECTIONAL-DISCOVERY-QUESTION-V2",
    packageId: "SPA-001",
    chapterCode: "EMB-001",
    prototypeId: "EMB-PROT-08-OPTION-NOT-IN-QUESTION",
    permanentQlId: null,
    seed,
    provenance: "SOURCE_BACKED_CORE",
    sourceAnchor: "RSC-EMB-CH33-DIR-41-49",
    taskDirection: "ANSWER_FIGURE_INSIDE_QUESTION_FIGURE",
    polarity: "SELECT_NOT_EMBEDDED",
    difficulty: "L3_ADVANCED",
    stem: "Which one of the answer figures is NOT hidden or embedded in the question figure?",
    questionScene,
    options: ordered.map((option, index) => ({ scene: option, embeddingCount: solved.counts[index]!, misconception: index === desiredCorrectOptionIndex ? "CORRECT_ABSENT" : "PRESENT_DECOY" })),
    correctOptionIndex: desiredCorrectOptionIndex,
    answer,
    matchPolicy: policy(),
    solverEvidence: { questionGraphFingerprint: figureGraphFingerprintV1(spatialSceneToFigureGraphV1(questionScene)), optionGraphFingerprints: solved.optionFingerprints, optionEmbeddingCounts: solved.counts, satisfyingOptionIndexes },
    explanation: {
      observation: "Check the four small answer figures one by one against the larger question figure.",
      rule: "For this negative form, three candidates must be traceable exactly inside the question figure and the correct answer is the single candidate that is not present.",
      application: `Options other than ${answer} can each be traced completely in the question figure, while option ${answer} cannot.`,
      check: `Option ${answer} is the only candidate with zero valid graph embeddings in the question figure.`,
    },
    contentFingerprint,
    deliveryFingerprint: JSON.stringify({ contentFingerprint, ordered: optionSceneFingerprints, correctOptionIndex: desiredCorrectOptionIndex }),
    renderer: { recommendedQuestionPixels: 300, recommendedOptionPixels: 160, mobileMinimumOptionPixels: 108 },
    lifecycle: { maturity: "EXECUTABLE_DISCOVERY_PROOF", questionStudioDiscoverable: false, questionStudioRegistration: "NOT_REGISTERED", questionBankWritable: false, testEligible: false, publiclyPublishable: false, automaticPublication: false },
  };
}

export function generateEmbeddedDirectionalQuestionV2(request: {
  prototypeId: EmbeddedDirectionalPrototypeV2;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): EmbeddedDirectionalQuestionV2 {
  const seed = request.seed.trim();
  if (!seed) throw new Error("EMB directional V2 requires a non-empty deterministic seed.");
  const desiredCorrectOptionIndex = request.desiredCorrectOptionIndex ?? ((hash32(`${seed}:answer-slot`) % 4) as 0 | 1 | 2 | 3);
  return request.prototypeId === "EMB-PROT-07-OPTION-IN-QUESTION-POSITIVE"
    ? buildPositive(seed, desiredCorrectOptionIndex)
    : buildNegative(seed, desiredCorrectOptionIndex);
}
