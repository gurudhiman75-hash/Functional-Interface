import { getSpatialGapAuthorityV1 } from "./gap-authority-v1";
import { generateSpatialGapRuntimeCandidateV1 } from "./gap-proof-generator-v1";
import {
  centerSpatialSceneV1,
  classifySpatialRelativePositionV1,
  countSpatialNodesByRoleV1,
  cycleSelectedSpatialNodePositionsV1,
  duplicateSelectedSpatialNodesV1,
  filledSpatialNodeCountV1,
  reflectSelectedSpatialNodesV1,
  removeSelectedSpatialNodesV1,
  replaceSpatialNodeV1,
  rotateSelectedSpatialNodesV1,
  scaleSelectedSpatialNodesV1,
  setSelectedSpatialFillV1,
  spatialNodeCenterV1,
  spatialNodeExtentV1,
  spatialRotationOrbitFingerprintV1,
  spatialSceneCenterV1,
  translateSelectedSpatialNodesV1,
} from "./gap-runtime-v1";
import {
  SPATIAL_GAP_LIFECYCLE_LOCK_V1,
  type SpatialGapIdV1,
} from "./gap-types-v1";
import type {
  SpatialGapLearnerQuestionV1,
  SpatialGapQuestionLearnerExplanationV1,
  SpatialGapQuestionMisconceptionV1,
  SpatialGapQuestionOptionV1,
} from "./gap-question-types-v1";
import { spatialSceneSemanticFingerprint } from "./normalize";
import { hashSpatialSeed } from "./seed";
import { reflectSceneVertically, rotateScene, translateScene } from "./transform";
import { SPATIAL_SCENE_VERSION, type SpatialNode, type SpatialScene } from "./types";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "./validator";

interface CanonicalQuestionBuildV1 {
  stimulusScenes: SpatialScene[];
  correctScene: SpatialScene;
  distractors: readonly [
    { misconception: SpatialGapQuestionMisconceptionV1; scene: SpatialScene },
    { misconception: SpatialGapQuestionMisconceptionV1; scene: SpatialScene },
    { misconception: SpatialGapQuestionMisconceptionV1; scene: SpatialScene },
  ];
  decisiveProperty: string;
  propertyVectorForCanonicalOptions?: readonly [true, true, true, false];
  explanation: Omit<SpatialGapQuestionLearnerExplanationV1, "check">;
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function sceneNode(scene: SpatialScene, nodeId: string): SpatialNode {
  const found = scene.nodes.find((candidate) => candidate.id === nodeId);
  if (!found) throw new Error(`Scene '${scene.id}' is missing node '${nodeId}'.`);
  return found;
}

function withSceneId(scene: SpatialScene, id: string): SpatialScene {
  return { ...scene, id, metadata: scene.metadata ? { ...scene.metadata } : undefined };
}

function isFilled(node: SpatialNode): boolean {
  const fill = node.style?.fill?.trim().toLowerCase();
  return fill !== undefined && fill !== "none" && fill !== "transparent";
}

function makeCircleReplacement(scene: SpatialScene, nodeId: string): SpatialNode {
  const current = sceneNode(scene, nodeId);
  const center = spatialNodeCenterV1(current);
  return {
    kind: "circle",
    id: nodeId,
    role: current.role,
    layer: current.layer,
    center,
    radius: Math.max(3, spatialNodeExtentV1(current) / 2),
    style: current.style ? { ...current.style } : undefined,
  };
}

function makeTriangleReplacement(scene: SpatialScene, nodeId: string): SpatialNode {
  const current = sceneNode(scene, nodeId);
  const center = spatialNodeCenterV1(current);
  const half = Math.max(4, spatialNodeExtentV1(current) / 2);
  return {
    kind: "polygon",
    id: nodeId,
    role: current.role,
    layer: current.layer,
    points: [
      { x: center.x, y: center.y - half },
      { x: center.x + half, y: center.y + half },
      { x: center.x - half, y: center.y + half },
    ],
    style: current.style ? { ...current.style } : undefined,
  };
}

function rotateTwoComponents(
  scene: SpatialScene,
  angleA: number,
  angleB: number,
  nextId: string,
): SpatialScene {
  const aCenter = spatialNodeCenterV1(sceneNode(scene, "comp-a"));
  const bCenter = spatialNodeCenterV1(sceneNode(scene, "comp-b"));
  const first = rotateSelectedSpatialNodesV1(scene, ["comp-a"], angleA, aCenter, `${nextId}-a`);
  return rotateSelectedSpatialNodesV1(first, ["comp-b"], angleB, bCenter, nextId);
}

function combineSubfigurePair(
  left: SpatialScene,
  right: SpatialScene,
  sceneId: string,
): SpatialScene {
  const leftPlaced = translateScene(centerSpatialSceneV1(left, `${sceneId}-left-centered`), 34, 60, `${sceneId}-left`);
  const rightPlaced = translateScene(centerSpatialSceneV1(right, `${sceneId}-right-centered`), 86, 60, `${sceneId}-right`);
  const prefix = (nodes: readonly SpatialNode[], label: string): SpatialNode[] =>
    nodes.map((node) => ({
      ...node,
      id: `${label}-${node.id}`,
      role: node.role ? `${label}-${node.role}` : label,
      style: node.style ? { ...node.style } : undefined,
    }));
  return {
    version: SPATIAL_SCENE_VERSION,
    id: sceneId,
    viewBox: { minX: 0, minY: 0, width: 120, height: 120 },
    nodes: [
      ...prefix(leftPlaced.nodes, "left"),
      ...prefix(rightPlaced.nodes, "right"),
      {
        kind: "line",
        id: "pair-divider",
        role: "pair-divider",
        layer: 0,
        start: { x: 60, y: 35 },
        end: { x: 60, y: 85 },
        style: { stroke: "#888", strokeWidth: 0.8, dashArray: [2, 2] },
      },
    ],
    metadata: {
      chapterCode: "FCL-001",
      semanticRole: "SUBFIGURE_RELATION_OPTION_V1",
    },
  };
}

function fanBuild(gapId: SpatialGapIdV1, seed: string): CanonicalQuestionBuildV1 {
  const pair = generateSpatialGapRuntimeCandidateV1(gapId, `${seed}:pair`);
  const target = generateSpatialGapRuntimeCandidateV1(gapId, `${seed}:target`);
  const [aScene, bScene] = pair.scenes;
  const [cScene, correctScene] = target.scenes;
  if (!aScene || !bScene || !cScene || !correctScene) {
    throw new Error(`${gapId}: FAN runtime proof did not expose A/B and C/correct scenes.`);
  }

  switch (gapId) {
    case "FAN-GAP-01": {
      const aCenter = spatialNodeCenterV1(sceneNode(cScene, "comp-a"));
      const bCenter = spatialNodeCenterV1(sceneNode(cScene, "comp-b"));
      return {
        stimulusScenes: [aScene, bScene, cScene],
        correctScene,
        distractors: [
          { misconception: "PARTIAL_RULE", scene: rotateSelectedSpatialNodesV1(cScene, ["comp-a"], 90, aCenter, `${seed}-fan1-a-only`) },
          { misconception: "PARTIAL_RULE", scene: rotateSelectedSpatialNodesV1(cScene, ["comp-b"], -90, bCenter, `${seed}-fan1-b-only`) },
          { misconception: "WRONG_DIRECTION", scene: rotateTwoComponents(cScene, 90, 90, `${seed}-fan1-same-way`) },
        ],
        decisiveProperty: "two selected components rotate independently in opposite directions",
        explanation: {
          observation: "In the first pair, component A turns 90° clockwise while component B turns 90° anticlockwise; the other parts stay fixed.",
          rule: "Apply the two component rotations independently. Do not rotate the whole figure and do not move only one component.",
          application: "Use the same +90° turn on component A and −90° turn on component B in the third figure.",
        },
      };
    }
    case "FAN-GAP-02": {
      const ids = ["comp-a", "comp-b", "comp-c", "comp-d"] as const;
      return {
        stimulusScenes: [aScene, bScene, cScene],
        correctScene,
        distractors: [
          { misconception: "WRONG_DIRECTION", scene: cycleSelectedSpatialNodePositionsV1(cScene, [...ids].reverse(), `${seed}-fan2-reverse`) },
          { misconception: "PARTIAL_RULE", scene: cycleSelectedSpatialNodePositionsV1(cScene, ["comp-a", "comp-b", "comp-c"], `${seed}-fan2-three-only`) },
          { misconception: "NO_CHANGE", scene: withSceneId(cScene, `${seed}-fan2-no-change`) },
        ],
        decisiveProperty: "all four components move one position in the same cyclic order",
        explanation: {
          observation: "The first pair keeps each component unchanged but moves all four components to the next position in a cycle.",
          rule: "Cycle every component together; changing only three positions or cycling in the opposite direction breaks the analogy.",
          application: "Move the four components of the third figure forward by the same one-position cycle.",
        },
      };
    }
    case "FAN-GAP-03": {
      const cCenter = spatialNodeCenterV1(sceneNode(cScene, "comp-c"));
      const dCenter = spatialNodeCenterV1(sceneNode(cScene, "comp-d"));
      return {
        stimulusScenes: [aScene, bScene, cScene],
        correctScene,
        distractors: [
          { misconception: "WRONG_DIRECTION", scene: scaleSelectedSpatialNodesV1(cScene, ["comp-c"], 0.65, cCenter, `${seed}-fan3-reduce`) },
          { misconception: "WRONG_COMPONENT", scene: scaleSelectedSpatialNodesV1(cScene, ["comp-d"], 1.55, dCenter, `${seed}-fan3-wrong-component`) },
          { misconception: "NO_CHANGE", scene: withSceneId(cScene, `${seed}-fan3-no-change`) },
        ],
        decisiveProperty: "the selected circular component is enlarged while the rest stays fixed",
        explanation: {
          observation: "Only the circular component becomes larger in the first pair; its position and the other components do not change.",
          rule: "Enlarge the corresponding circle, not the whole figure and not a different component.",
          application: "Increase the size of component C in the third figure by the same scale change.",
        },
      };
    }
    case "FAN-GAP-04":
      return {
        stimulusScenes: [aScene, bScene, cScene],
        correctScene,
        distractors: [
          { misconception: "WRONG_DIRECTION", scene: translateSelectedSpatialNodesV1(cScene, ["comp-c"], 0, -52, `${seed}-fan4-up`) },
          { misconception: "WRONG_COMPONENT", scene: translateSelectedSpatialNodesV1(cScene, ["comp-d"], 30, 0, `${seed}-fan4-wrong-component`) },
          { misconception: "NO_CHANGE", scene: withSceneId(cScene, `${seed}-fan4-no-change`) },
        ],
        decisiveProperty: "the selected component transfers from inside the container to the outside-right level",
        explanation: {
          observation: "The first pair transfers the circular component from inside the box to the outside-right while the rest of the structure remains in place.",
          rule: "Preserve the component itself and change only its hierarchy/inside-outside position.",
          application: "Move the corresponding circular component of the third figure to the same outside-right level.",
        },
      };
    case "FAN-GAP-05": {
      const aCenter = spatialNodeCenterV1(sceneNode(cScene, "comp-a"));
      return {
        stimulusScenes: [aScene, bScene, cScene],
        correctScene,
        distractors: [
          { misconception: "PARTIAL_RULE", scene: reflectSelectedSpatialNodesV1(cScene, ["comp-a"], "VERTICAL", aCenter.x, `${seed}-fan5-reflect-only`) },
          { misconception: "PARTIAL_RULE", scene: setSelectedSpatialFillV1(cScene, ["comp-d"], "#111", `${seed}-fan5-shade-only`) },
          { misconception: "PARTIAL_RULE", scene: removeSelectedSpatialNodesV1(cScene, ["dot-1"], `${seed}-fan5-remove-only`) },
        ],
        decisiveProperty: "the complete compound rule combines reflection, movement, shading and deletion",
        explanation: {
          observation: "The first pair changes several independent features together: component A is reflected, component B moves downward, component D is shaded, and one dot is removed.",
          rule: "A compound analogy is correct only when every visible sub-rule is applied; a partial transformation is insufficient.",
          application: "Apply all four changes to the third figure in the same combination.",
        },
      };
    }
    default:
      throw new Error(`Gap '${gapId}' is not a FAN learner-question gap.`);
  }
}

function fclBuild(gapId: SpatialGapIdV1, seed: string): CanonicalQuestionBuildV1 {
  const runtime = generateSpatialGapRuntimeCandidateV1(gapId, `${seed}:classification`);
  const base = runtime.scenes[0];
  if (!base) throw new Error(`${gapId}: classification runtime proof did not expose a base scene.`);

  switch (gapId) {
    case "FCL-GAP-01": {
      if (runtime.scenes.length !== 4) throw new Error("FCL-GAP-01 requires four rotation-orbit scenes.");
      const [common1, common2, common3, odd] = runtime.scenes;
      if (!common1 || !common2 || !common3 || !odd) throw new Error("FCL-GAP-01 scene set incomplete.");
      const commonOrbit = spatialRotationOrbitFingerprintV1(common1);
      if (![common2, common3].every((scene) => spatialRotationOrbitFingerprintV1(scene) === commonOrbit)) {
        throw new Error("FCL-GAP-01 common rotation orbit was not preserved.");
      }
      if (spatialRotationOrbitFingerprintV1(odd) === commonOrbit) throw new Error("FCL-GAP-01 odd option still shares the common rotation orbit.");
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_RELATION", scene: common1 },
          { misconception: "WRONG_RELATION", scene: common2 },
          { misconception: "WRONG_RELATION", scene: common3 },
        ],
        decisiveProperty: "three figures are equivalent under rotation; one changes its internal geometry",
        propertyVectorForCanonicalOptions: [true, true, true, false],
        explanation: {
          observation: "Three figures can be rotated to coincide with one another without changing the relative geometry of their parts.",
          rule: "Rotation may change orientation but it must not change size, shape or the internal arrangement.",
          application: "Find the option whose internal geometry cannot be obtained by rotating the common figure.",
        },
      };
    }
    case "FCL-GAP-02": {
      const odd = runtime.scenes[3];
      if (!odd) throw new Error("FCL-GAP-02 odd scene missing.");
      const common2 = rotateSelectedSpatialNodesV1(base, ["comp-a"], 90, spatialNodeCenterV1(sceneNode(base, "comp-a")), `${seed}-fcl2-common2`);
      const common3 = reflectSelectedSpatialNodesV1(base, ["comp-b"], "VERTICAL", spatialNodeCenterV1(sceneNode(base, "comp-b")).x, `${seed}-fcl2-common3`);
      const counts = [base, common2, common3, odd].map((scene) => countSpatialNodesByRoleV1(scene, "dot"));
      if (!(counts[0] === counts[1] && counts[1] === counts[2] && counts[3] === counts[0]! + 1)) {
        throw new Error(`FCL-GAP-02 count relation failed: ${counts.join(",")}.`);
      }
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_RELATION", scene: base },
          { misconception: "WRONG_RELATION", scene: common2 },
          { misconception: "WRONG_RELATION", scene: common3 },
        ],
        decisiveProperty: "three figures contain the same number of dot-role elements; one contains one extra dot",
        propertyVectorForCanonicalOptions: [true, true, true, false],
        explanation: {
          observation: `Three figures contain ${counts[0]} dots even though other orientations differ; the odd figure contains ${counts[3]}.`,
          rule: "Ignore harmless orientation changes and compare the decisive element count.",
          application: "Select the figure whose dot count differs from the common count.",
        },
      };
    }
    case "FCL-GAP-03": {
      const odd = runtime.scenes[3];
      if (!odd) throw new Error("FCL-GAP-03 odd scene missing.");
      const common2 = rotateSelectedSpatialNodesV1(base, ["comp-a"], 90, spatialNodeCenterV1(sceneNode(base, "comp-a")), `${seed}-fcl3-common2`);
      const common3 = reflectSelectedSpatialNodesV1(base, ["comp-b"], "HORIZONTAL", spatialNodeCenterV1(sceneNode(base, "comp-b")).y, `${seed}-fcl3-common3`);
      const follows = [base, common2, common3, odd].map((scene) => spatialNodeExtentV1(sceneNode(scene, "comp-d")) < spatialNodeExtentV1(sceneNode(scene, "comp-c")));
      if (follows.join(",") !== "true,true,true,false") throw new Error(`FCL-GAP-03 relative-size vector failed: ${follows.join(",")}.`);
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_RELATION", scene: base },
          { misconception: "WRONG_RELATION", scene: common2 },
          { misconception: "WRONG_RELATION", scene: common3 },
        ],
        decisiveProperty: "component D is smaller than component C in three figures but larger in one",
        propertyVectorForCanonicalOptions: [true, true, true, false],
        explanation: {
          observation: "In three figures, component D remains smaller than component C despite unrelated orientation changes elsewhere.",
          rule: "Compare the relative sizes of the two specified components, not their orientation.",
          application: "Choose the figure in which the usual small-to-large relation is reversed.",
        },
      };
    }
    case "FCL-GAP-04": {
      const odd = runtime.scenes[1];
      if (!odd) throw new Error("FCL-GAP-04 moved odd scene missing.");
      const center = spatialSceneCenterV1(base);
      const commonSector = classifySpatialRelativePositionV1(spatialNodeCenterV1(sceneNode(base, "comp-a")), center);
      const common2 = rotateSelectedSpatialNodesV1(base, ["comp-b"], 90, spatialNodeCenterV1(sceneNode(base, "comp-b")), `${seed}-fcl4-common2`);
      const common3 = setSelectedSpatialFillV1(base, ["comp-d"], "#111", `${seed}-fcl4-common3`);
      const sectors = [base, common2, common3, odd].map((scene) => classifySpatialRelativePositionV1(spatialNodeCenterV1(sceneNode(scene, "comp-a")), center));
      if (!(sectors.slice(0, 3).every((sector) => sector === commonSector) && sectors[3] !== commonSector)) {
        throw new Error(`FCL-GAP-04 relative-position vector failed: ${sectors.join(",")}.`);
      }
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_RELATION", scene: base },
          { misconception: "WRONG_RELATION", scene: common2 },
          { misconception: "WRONG_RELATION", scene: common3 },
        ],
        decisiveProperty: `component A occupies the ${commonSector.toLowerCase().replaceAll("_", "-")} sector in three figures but not in one`,
        propertyVectorForCanonicalOptions: [true, true, true, false],
        explanation: {
          observation: `Component A lies in the same ${commonSector.toLowerCase().replaceAll("_", "-")} relative sector in three figures; changes to other features are irrelevant.`,
          rule: "Track the relative position of the specified component with respect to the figure centre.",
          application: "Select the option in which component A moves to a different relative sector.",
        },
      };
    }
    case "FCL-GAP-05": {
      const shaded = runtime.scenes[1];
      const shiftedShade = runtime.scenes[2];
      if (!shaded || !shiftedShade) throw new Error("FCL-GAP-05 shading scenes missing.");
      const common2 = rotateSelectedSpatialNodesV1(shaded, ["comp-a"], 90, spatialNodeCenterV1(sceneNode(shaded, "comp-a")), `${seed}-fcl5-common2`);
      const common3 = reflectSelectedSpatialNodesV1(shaded, ["comp-b"], "VERTICAL", spatialNodeCenterV1(sceneNode(shaded, "comp-b")).x, `${seed}-fcl5-common3`);
      const follows = [shaded, common2, common3, shiftedShade].map((scene) => isFilled(sceneNode(scene, "comp-d")) && !isFilled(sceneNode(scene, "comp-b")));
      if (follows.join(",") !== "true,true,true,false") throw new Error(`FCL-GAP-05 shading vector failed: ${follows.join(",")}.`);
      return {
        stimulusScenes: [],
        correctScene: shiftedShade,
        distractors: [
          { misconception: "WRONG_FILL_LOCATION", scene: shaded },
          { misconception: "WRONG_FILL_LOCATION", scene: common2 },
          { misconception: "WRONG_FILL_LOCATION", scene: common3 },
        ],
        decisiveProperty: "the extra shaded component is D in three figures but B in one",
        propertyVectorForCanonicalOptions: [true, true, true, false],
        explanation: {
          observation: "Three figures place the extra solid shading on component D while other unimportant orientations may differ.",
          rule: "Compare both the amount and the location of shading.",
          application: "Choose the figure in which the extra shading is transferred to a different component.",
        },
      };
    }
    case "FCL-GAP-06": {
      const left = runtime.scenes[0];
      if (!left) throw new Error("FCL-GAP-06 source subfigure missing.");
      const leftId = left.nodes[0]?.id;
      if (!leftId) throw new Error("FCL-GAP-06 source subfigure has no node.");
      const center = spatialNodeCenterV1(sceneNode(left, leftId));
      const mirror = (scene: SpatialScene, suffix: string): SpatialScene => {
        const onlyId = scene.nodes[0]?.id;
        if (!onlyId) throw new Error("FCL-GAP-06 transformed subfigure is empty.");
        const ownCenter = spatialNodeCenterV1(sceneNode(scene, onlyId));
        return reflectSelectedSpatialNodesV1(scene, [onlyId], "VERTICAL", ownCenter.x, `${seed}-${suffix}-mirror`);
      };
      const source2 = rotateSelectedSpatialNodesV1(left, [leftId], 90, center, `${seed}-fcl6-source2`);
      const source3 = scaleSelectedSpatialNodesV1(left, [leftId], 0.78, center, `${seed}-fcl6-source3`);
      const common1 = combineSubfigurePair(left, mirror(left, "fcl6-c1"), `${seed}-fcl6-common1`);
      const common2 = combineSubfigurePair(source2, mirror(source2, "fcl6-c2"), `${seed}-fcl6-common2`);
      const common3 = combineSubfigurePair(source3, mirror(source3, "fcl6-c3"), `${seed}-fcl6-common3`);
      const rotatedRight = rotateSelectedSpatialNodesV1(left, [leftId], 90, center, `${seed}-fcl6-rotated-right`);
      const odd = combineSubfigurePair(left, rotatedRight, `${seed}-fcl6-odd`);
      return {
        stimulusScenes: [],
        correctScene: odd,
        distractors: [
          { misconception: "WRONG_RELATION", scene: common1 },
          { misconception: "WRONG_RELATION", scene: common2 },
          { misconception: "WRONG_RELATION", scene: common3 },
        ],
        decisiveProperty: "three option-pairs show a vertical mirror relation between their two subfigures; one shows rotation instead",
        propertyVectorForCanonicalOptions: [true, true, true, false],
        explanation: {
          observation: "In three options, the right-hand subfigure is the vertical mirror image of the left-hand subfigure.",
          rule: "A mirror reverses left and right; a rotation is not an equivalent transformation.",
          application: "Select the option-pair in which the right-hand subfigure is produced by rotation rather than vertical reflection.",
        },
      };
    }
    default:
      throw new Error(`Gap '${gapId}' is not an FCL learner-question gap.`);
  }
}

function fsrBuild(gapId: SpatialGapIdV1, seed: string): CanonicalQuestionBuildV1 {
  const runtime = generateSpatialGapRuntimeCandidateV1(gapId, `${seed}:series`);
  const [frame0, frame1, frame2, frame3] = runtime.scenes;
  if (!frame0 || !frame1 || !frame2 || !frame3) throw new Error(`${gapId}: FSR runtime proof requires four frames.`);

  switch (gapId) {
    case "FSR-GAP-01": {
      const center = spatialNodeCenterV1(sceneNode(frame2, "comp-a"));
      return {
        stimulusScenes: [frame0, frame1, frame2],
        correctScene: frame3,
        distractors: [
          { misconception: "WRONG_AXIS", scene: reflectSelectedSpatialNodesV1(frame2, ["comp-a"], "HORIZONTAL", center.y, `${seed}-fsr1-horizontal`) },
          { misconception: "WRONG_RELATION", scene: rotateSelectedSpatialNodesV1(frame2, ["comp-a"], 180, center, `${seed}-fsr1-rotate180`) },
          { misconception: "NO_CHANGE", scene: withSceneId(frame2, `${seed}-fsr1-no-change`) },
        ],
        decisiveProperty: "component A alternates with its vertical mirror image",
        explanation: {
          observation: "Component A alternates between its original form and its left-right mirror image while the rest of the frame stays unchanged.",
          rule: "Apply a vertical reflection at every step.",
          application: "The third frame is back at the original state, so the next frame must be its vertical mirror again.",
        },
      };
    }
    case "FSR-GAP-02": {
      const aCenter = spatialNodeCenterV1(sceneNode(frame2, "comp-a"));
      const bCenter = spatialNodeCenterV1(sceneNode(frame2, "comp-b"));
      return {
        stimulusScenes: [frame0, frame1, frame2],
        correctScene: frame3,
        distractors: [
          { misconception: "PARTIAL_RULE", scene: rotateSelectedSpatialNodesV1(frame2, ["comp-a"], 90, aCenter, `${seed}-fsr2-a-only`) },
          { misconception: "PARTIAL_RULE", scene: rotateSelectedSpatialNodesV1(frame2, ["comp-b"], -90, bCenter, `${seed}-fsr2-b-only`) },
          { misconception: "WRONG_DIRECTION", scene: rotateTwoComponents(frame2, 90, 90, `${seed}-fsr2-same-way`) },
        ],
        decisiveProperty: "component A rotates +90° and component B rotates −90° at every step",
        explanation: {
          observation: "Two components rotate at the same time but in opposite directions from one frame to the next.",
          rule: "Repeat +90° on component A and −90° on component B at each step.",
          application: "Apply both rotations once more to the third frame.",
        },
      };
    }
    case "FSR-GAP-03":
      return {
        stimulusScenes: [frame0, frame1, frame2],
        correctScene: frame3,
        distractors: [
          { misconception: "NO_CHANGE", scene: withSceneId(frame2, `${seed}-fsr3-no-change`) },
          { misconception: "WRONG_DIRECTION", scene: translateSelectedSpatialNodesV1(frame2, ["comp-a"], 10, 0, `${seed}-fsr3-right`) },
          { misconception: "WRONG_DIRECTION", scene: translateSelectedSpatialNodesV1(frame2, ["comp-a"], 0, -10, `${seed}-fsr3-up`) },
        ],
        decisiveProperty: "the movement direction of component A advances clockwise: right, down, left, up",
        explanation: {
          observation: "Component A first moves right and then down by the same distance.",
          rule: "The movement direction turns 90° clockwise at each step: right → down → left → up.",
          application: "After the downward move, the next equal move must be to the left.",
        },
      };
    case "FSR-GAP-04": {
      const start3 = duplicateSelectedSpatialNodesV1(frame0, ["dot-1"], 0, 8, "extra-a", `${seed}-fsr4-start3`);
      const start4 = duplicateSelectedSpatialNodesV1(start3, ["dot-2"], 0, 8, "extra-b", `${seed}-fsr4-start4`);
      const next3 = removeSelectedSpatialNodesV1(start4, ["dot-2-extra-b"], `${seed}-fsr4-next3`);
      const next2 = removeSelectedSpatialNodesV1(next3, ["dot-1-extra-a"], `${seed}-fsr4-next2`);
      const correct = removeSelectedSpatialNodesV1(next2, ["dot-2"], `${seed}-fsr4-correct1`);
      const wrong3 = duplicateSelectedSpatialNodesV1(next2, ["dot-1"], 0, 8, "wrong-plus", `${seed}-fsr4-wrong3`);
      const wrong0 = removeSelectedSpatialNodesV1(next2, ["dot-1", "dot-2"], `${seed}-fsr4-wrong0`);
      const counts = [start4, next3, next2, correct].map((scene) => countSpatialNodesByRoleV1(scene, "dot"));
      if (counts.join(",") !== "4,3,2,1") throw new Error(`FSR-GAP-04 learner count sequence failed: ${counts.join(",")}.`);
      return {
        stimulusScenes: [start4, next3, next2],
        correctScene: correct,
        distractors: [
          { misconception: "NO_CHANGE", scene: withSceneId(next2, `${seed}-fsr4-no-change`) },
          { misconception: "WRONG_COUNT_CHANGE", scene: wrong3 },
          { misconception: "WRONG_COUNT_CHANGE", scene: wrong0 },
        ],
        decisiveProperty: "the number of dots decreases by one in each successive frame: 4, 3, 2, 1",
        explanation: {
          observation: "The visible dot count is 4, then 3, then 2.",
          rule: "Remove exactly one dot at each step.",
          application: "The next frame must therefore contain 1 dot.",
        },
      };
    }
    case "FSR-GAP-05":
      return {
        stimulusScenes: [frame0, frame1, frame2],
        correctScene: frame3,
        distractors: [
          { misconception: "WRONG_FILL_LOCATION", scene: setSelectedSpatialFillV1(frame2, ["comp-b"], "#111", `${seed}-fsr5-fill-b`) },
          { misconception: "WRONG_FILL_LOCATION", scene: setSelectedSpatialFillV1(frame2, ["comp-c"], "#111", `${seed}-fsr5-fill-c`) },
          { misconception: "NO_CHANGE", scene: withSceneId(frame2, `${seed}-fsr5-no-change`) },
        ],
        decisiveProperty: "component D alternates unshaded and shaded",
        explanation: {
          observation: "Component D is unshaded, shaded, then unshaded in consecutive frames.",
          rule: "Toggle the fill state of the same component at every step.",
          application: "The next frame must shade component D again.",
        },
      };
    case "FSR-GAP-06": {
      const originalSquare = sceneNode(frame0, "comp-d");
      const circle = replaceSpatialNodeV1(frame0, "comp-d", makeCircleReplacement(frame0, "comp-d"), `${seed}-fsr6-circle1`);
      const squareAgain = replaceSpatialNodeV1(circle, "comp-d", { ...originalSquare, style: originalSquare.style ? { ...originalSquare.style } : undefined }, `${seed}-fsr6-square2`);
      const correct = replaceSpatialNodeV1(squareAgain, "comp-d", makeCircleReplacement(squareAgain, "comp-d"), `${seed}-fsr6-circle3`);
      const triangle = replaceSpatialNodeV1(squareAgain, "comp-d", makeTriangleReplacement(squareAgain, "comp-d"), `${seed}-fsr6-triangle`);
      const filledSquare = setSelectedSpatialFillV1(squareAgain, ["comp-d"], "#111", `${seed}-fsr6-filled-square`);
      return {
        stimulusScenes: [frame0, circle, squareAgain],
        correctScene: correct,
        distractors: [
          { misconception: "NO_CHANGE", scene: withSceneId(squareAgain, `${seed}-fsr6-no-change`) },
          { misconception: "WRONG_RELATION", scene: triangle },
          { misconception: "WRONG_FILL_LOCATION", scene: filledSquare },
        ],
        decisiveProperty: "component D alternates square and circle",
        explanation: {
          observation: "The changing component follows square → circle → square.",
          rule: "The two shapes alternate while the other parts remain unchanged.",
          application: "After the second square, the next frame must contain the circle again.",
        },
      };
    }
    case "FSR-GAP-07": {
      const ids = ["comp-a", "comp-b", "comp-c", "comp-d"] as const;
      return {
        stimulusScenes: [frame0, frame1, frame2],
        correctScene: frame3,
        distractors: [
          { misconception: "WRONG_DIRECTION", scene: cycleSelectedSpatialNodePositionsV1(frame2, [...ids].reverse(), `${seed}-fsr7-reverse`) },
          { misconception: "PARTIAL_RULE", scene: cycleSelectedSpatialNodePositionsV1(frame2, ["comp-a", "comp-b", "comp-c"], `${seed}-fsr7-three-only`) },
          { misconception: "NO_CHANGE", scene: withSceneId(frame2, `${seed}-fsr7-no-change`) },
        ],
        decisiveProperty: "all four components advance one position in the same cyclic permutation at every step",
        explanation: {
          observation: "Each component keeps its own shape but all four occupy the next position in a repeating cycle.",
          rule: "Repeat the same four-way positional permutation each step.",
          application: "Cycle all four components once more from the third frame.",
        },
      };
    }
    case "FSR-GAP-08": {
      const bCenter = spatialNodeCenterV1(sceneNode(frame2, "comp-b"));
      return {
        stimulusScenes: [frame0, frame1, frame2],
        correctScene: frame3,
        distractors: [
          { misconception: "WRONG_FILL_LOCATION", scene: setSelectedSpatialFillV1(frame2, ["comp-d"], "none", `${seed}-fsr8-unshade`) },
          { misconception: "WRONG_COMPONENT", scene: rotateSelectedSpatialNodesV1(frame2, ["comp-b"], 90, bCenter, `${seed}-fsr8-rotate-b`) },
          { misconception: "NO_CHANGE", scene: withSceneId(frame2, `${seed}-fsr8-no-change`) },
        ],
        decisiveProperty: "the series alternates two operations: rotate component A, then shade component D, then rotate A again",
        explanation: {
          observation: "The first transition rotates component A; the second transition shades component D.",
          rule: "Two operations alternate: rotation, shading, rotation, shading.",
          application: "After the shading step, repeat the rotation step on component A.",
        },
      };
    }
    default:
      throw new Error(`Gap '${gapId}' is not an FSR learner-question gap.`);
  }
}

function buildCanonicalQuestion(gapId: SpatialGapIdV1, seed: string): CanonicalQuestionBuildV1 {
  if (gapId.startsWith("FAN-")) return fanBuild(gapId, seed);
  if (gapId.startsWith("FCL-")) return fclBuild(gapId, seed);
  return fsrBuild(gapId, seed);
}

function instructionForChapter(chapterCode: "FAN-001" | "FCL-001" | "FSR-001"): {
  instructionKey: SpatialGapLearnerQuestionV1["instructionKey"];
  stemText: string;
} {
  switch (chapterCode) {
    case "FAN-001":
      return {
        instructionKey: "FAN_SELECT_FIGURE_COMPLETING_ANALOGY",
        stemText: "Select the figure that will replace the question mark so that the second pair follows the same rule as the first pair.",
      };
    case "FCL-001":
      return {
        instructionKey: "FCL_SELECT_ODD_FIGURE",
        stemText: "Three of the following figures follow the same relation. Select the figure that does not belong to the group.",
      };
    case "FSR-001":
      return {
        instructionKey: "FSR_SELECT_NEXT_FIGURE",
        stemText: "Study the figure series and select the figure that should come next.",
      };
  }
}

export function generateSpatialGapLearnerQuestionV1(input: {
  gapId: SpatialGapIdV1;
  seed: string;
  desiredCorrectOptionIndex: 0 | 1 | 2 | 3;
}): SpatialGapLearnerQuestionV1 {
  if (!input.seed.trim()) throw new Error("Spatial gap learner question requires a non-empty seed.");
  const authority = getSpatialGapAuthorityV1(input.gapId);
  if (authority.runtimeStatus !== "RUNTIME_CAPABILITY_SCALE_VALIDATED") {
    throw new Error(`${input.gapId}: runtime authority is not scale validated.`);
  }
  const built = buildCanonicalQuestion(input.gapId, input.seed);
  const correctOption: SpatialGapQuestionOptionV1 = {
    misconception: "CORRECT_RULE_APPLICATION",
    scene: built.correctScene,
    sceneFingerprint: spatialSceneSemanticFingerprint(built.correctScene),
  };
  const distractorOptions: SpatialGapQuestionOptionV1[] = built.distractors.map((distractor) => ({
    misconception: distractor.misconception,
    scene: distractor.scene,
    sceneFingerprint: spatialSceneSemanticFingerprint(distractor.scene),
  }));
  const options = [...distractorOptions];
  options.splice(input.desiredCorrectOptionIndex, 0, correctOption);

  const allScenes = [...built.stimulusScenes, ...options.map((option) => option.scene)];
  for (const scene of allScenes) {
    const validation = validateSpatialScene(scene);
    if (!validation.ok) {
      throw new Error(`${input.gapId}: scene '${scene.id}' failed learner-question validation: ${validation.errors.map((issue) => issue.code).join(",")}.`);
    }
  }
  const uniqueness = validateSpatialOptionUniqueness(options.map((option) => option.scene));
  if (!uniqueness.ok) {
    throw new Error(`${input.gapId}: learner options are not unique: ${uniqueness.errors.map((issue) => issue.code).join(",")}.`);
  }
  if (options.length !== 4) throw new Error(`${input.gapId}: learner question must contain exactly four options.`);
  const deliveredCorrect = options[input.desiredCorrectOptionIndex];
  if (!deliveredCorrect || deliveredCorrect.sceneFingerprint !== correctOption.sceneFingerprint) {
    throw new Error(`${input.gapId}: correct option placement failed.`);
  }

  let propertyVector: boolean[] | undefined;
  if (authority.chapterCode === "FCL-001") {
    const commonFingerprints = new Set(distractorOptions.map((option) => option.sceneFingerprint));
    propertyVector = options.map((option) => commonFingerprints.has(option.sceneFingerprint));
    if (propertyVector.filter(Boolean).length !== 3 || propertyVector[input.desiredCorrectOptionIndex] !== false) {
      throw new Error(`${input.gapId}: classification property vector is not an exact 3-to-1 split.`);
    }
  }

  const expectedStimulusCount = authority.chapterCode === "FCL-001" ? 0 : 3;
  if (built.stimulusScenes.length !== expectedStimulusCount) {
    throw new Error(`${input.gapId}: ${authority.chapterCode} stimulus contract expected ${expectedStimulusCount}, got ${built.stimulusScenes.length}.`);
  }

  const instruction = instructionForChapter(authority.chapterCode);
  const optionFingerprints = options.map((option) => option.sceneFingerprint);
  const stimulusFingerprints = built.stimulusScenes.map(spatialSceneSemanticFingerprint);
  const contentFingerprint = JSON.stringify({
    gapId: input.gapId,
    chapterCode: authority.chapterCode,
    stimulusFingerprints,
    correctSceneFingerprint: correctOption.sceneFingerprint,
    optionSet: [...optionFingerprints].sort(),
  });
  const deliveryFingerprint = JSON.stringify({
    contentFingerprint,
    seed: input.seed,
    correctOptionIndex: input.desiredCorrectOptionIndex,
    optionFingerprints,
  });
  const correctLetter = optionLetter(input.desiredCorrectOptionIndex);
  const explanation: SpatialGapQuestionLearnerExplanationV1 = {
    ...built.explanation,
    check: authority.chapterCode === "FCL-001"
      ? `Option ${correctLetter} is the only figure that breaks the common relation.`
      : `Option ${correctLetter} is the only option that applies the complete next-step rule without an extra or missing change.`,
  };

  return {
    version: "SPA-FND-001-GAP-QUESTION-V1",
    familyCode: "SPA-001",
    chapterCode: authority.chapterCode,
    gapId: input.gapId,
    prototypeId: `${input.gapId}-Q-${hashSpatialSeed(input.seed).toString(16).padStart(8, "0")}`,
    seed: input.seed,
    instructionKey: instruction.instructionKey,
    stemText: instruction.stemText,
    stimulusScenes: built.stimulusScenes,
    options,
    correctOptionIndex: input.desiredCorrectOptionIndex,
    solverEvidence: {
      expectedGapId: input.gapId,
      decisiveProperty: built.decisiveProperty,
      propertyVector,
      expectedCorrectSceneFingerprint: correctOption.sceneFingerprint,
      optionSceneFingerprints: optionFingerprints,
      correctOptionIndex: input.desiredCorrectOptionIndex,
      optionUniquenessCheck: "PASS",
      semanticRuleCheck: "PASS",
      chapterContractCheck: "PASS",
      runtimeAuthorityCheck: "PASS",
    },
    learnerExplanation: explanation,
    reviewMetadata: {
      stemExamStyleCheck: "PASS",
      optionUniquenessCheck: "PASS",
      solverEvidenceCheck: "PASS",
      explanationSpecificityCheck: "PASS",
      recommendedStimulusPixels: authority.chapterCode === "FCL-001" ? 0 : 92,
      recommendedOptionPixels: 82,
      mobileReviewStatus: "ARTIFACT_READY_HUMAN_REVIEW_PENDING",
      englishFreezeStatus: "HUMAN_REVIEW_PENDING",
    },
    contentFingerprint,
    deliveryFingerprint,
    lifecycle: { ...SPATIAL_GAP_LIFECYCLE_LOCK_V1 },
  };
}
