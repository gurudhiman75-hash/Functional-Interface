import { getSpatialGapAuthorityV1 } from "./gap-authority-v1";
import {
  applySpatialGapPipelineV1,
  classifySpatialRelativePositionV1,
  countSpatialNodesByRoleV1,
  cycleSelectedSpatialNodePositionsV1,
  duplicateSelectedSpatialNodesV1,
  extractSpatialNodeSubsetV1,
  filledSpatialNodeCountV1,
  inferCenteredSubfigureTransformRelationsV1,
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
  type SpatialGapOperationV1,
} from "./gap-runtime-v1";
import {
  SPATIAL_GAP_LIFECYCLE_LOCK_V1,
  type SpatialGapIdV1,
  type SpatialGapProofCheckV1,
  type SpatialGapRuntimeCandidateV1,
} from "./gap-types-v1";
import { spatialSceneSemanticFingerprint } from "./normalize";
import { hashSpatialSeed } from "./seed";
import { SPATIAL_SCENE_VERSION, type SpatialNode, type SpatialPoint, type SpatialScene } from "./types";

interface GapBuildResult {
  scenes: SpatialScene[];
  operationTrace: string[];
  proofChecks: SpatialGapProofCheckV1[];
}

function check(name: string, pass: boolean, detail?: string): SpatialGapProofCheckV1 {
  return detail === undefined ? { name, pass } : { name, pass, detail };
}

function node(scene: SpatialScene, nodeId: string): SpatialNode {
  const found = scene.nodes.find((candidate) => candidate.id === nodeId);
  if (!found) throw new Error(`Node '${nodeId}' is missing from '${scene.id}'.`);
  return found;
}

function baseScene(seed: string, sceneId: string): SpatialScene {
  const hash = hashSpatialSeed(seed);
  const jitterX = ((hash & 0xff) / 255) * 3 - 1.5;
  const jitterY = (((hash >>> 8) & 0xff) / 255) * 3 - 1.5;
  const radiusDelta = (((hash >>> 16) & 0xff) / 255) * 1.5;
  const strokeWidth = 1.25 + (((hash >>> 24) & 0xff) / 255) * 0.5;
  const dx = (value: number) => value + jitterX;
  const dy = (value: number) => value + jitterY;
  const outline = { stroke: "#111", strokeWidth, fill: "none" } as const;

  const nodes: SpatialNode[] = [
    {
      kind: "polygon",
      id: "container",
      role: "container",
      layer: 1,
      points: [
        { x: dx(30), y: dy(30) },
        { x: dx(90), y: dy(30) },
        { x: dx(90), y: dy(90) },
        { x: dx(30), y: dy(90) },
      ],
      style: outline,
    },
    {
      kind: "polyline",
      id: "comp-a",
      role: "component-a",
      layer: 3,
      points: [
        { x: dx(39), y: dy(39) },
        { x: dx(50), y: dy(39) },
        { x: dx(50), y: dy(48) },
      ],
      style: { stroke: "#111", strokeWidth, fill: "none", lineJoin: "round" },
    },
    {
      kind: "polygon",
      id: "comp-b",
      role: "component-b",
      layer: 3,
      points: [
        { x: dx(75), y: dy(37) },
        { x: dx(83), y: dy(49) },
        { x: dx(68), y: dy(48) },
      ],
      style: outline,
    },
    {
      kind: "circle",
      id: "comp-c",
      role: "component-c",
      layer: 3,
      center: { x: dx(44), y: dy(75) },
      radius: 6 + radiusDelta,
      style: outline,
    },
    {
      kind: "polygon",
      id: "comp-d",
      role: "component-d",
      layer: 3,
      points: [
        { x: dx(72), y: dy(71) },
        { x: dx(80), y: dy(71) },
        { x: dx(80), y: dy(79) },
        { x: dx(72), y: dy(79) },
      ],
      style: outline,
    },
    {
      kind: "circle",
      id: "dot-1",
      role: "dot",
      layer: 5,
      center: { x: dx(55), y: dy(59) },
      radius: 2.4,
      style: { stroke: "#111", strokeWidth: 1, fill: "#111" },
    },
    {
      kind: "circle",
      id: "dot-2",
      role: "dot",
      layer: 5,
      center: { x: dx(65), y: dy(59) },
      radius: 2.4,
      style: { stroke: "#111", strokeWidth: 1, fill: "#111" },
    },
    {
      kind: "line",
      id: "guide-line",
      role: "guide-line",
      layer: 2,
      start: { x: dx(51), y: dy(67) },
      end: { x: dx(69), y: dy(67) },
      style: { stroke: "#111", strokeWidth },
    },
  ];

  return {
    version: SPATIAL_SCENE_VERSION,
    id: sceneId,
    viewBox: { minX: 0, minY: 0, width: 120, height: 120 },
    nodes,
    metadata: {
      chapterCode: "SPA-FND-001",
      seed,
      semanticRole: "SPATIAL_GAP_RUNTIME_STIMULUS_V1",
    },
  };
}

function replacementCircle(scene: SpatialScene): SpatialNode {
  const current = node(scene, "comp-d");
  const center = spatialNodeCenterV1(current);
  return {
    kind: "circle",
    id: "comp-d",
    role: current.role,
    layer: current.layer,
    center,
    radius: Math.max(3, spatialNodeExtentV1(current) / 2),
    style: current.style ? { ...current.style } : undefined,
  };
}

function replacementTriangle(scene: SpatialScene): SpatialNode {
  const current = node(scene, "comp-d");
  const center = spatialNodeCenterV1(current);
  const half = Math.max(4, spatialNodeExtentV1(current) / 2);
  return {
    kind: "polygon",
    id: "comp-d",
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

function independentRotationResult(scene: SpatialScene, nextId: string): SpatialScene {
  const aCenter = spatialNodeCenterV1(node(scene, "comp-a"));
  const bCenter = spatialNodeCenterV1(node(scene, "comp-b"));
  const first = rotateSelectedSpatialNodesV1(scene, ["comp-a"], 90, aCenter, `${nextId}-a`);
  return rotateSelectedSpatialNodesV1(first, ["comp-b"], -90, bCenter, nextId);
}

function allChanged(before: SpatialScene, after: SpatialScene): boolean {
  return spatialSceneSemanticFingerprint(before) !== spatialSceneSemanticFingerprint(after);
}

function buildFanGap(gapId: SpatialGapIdV1, seed: string): GapBuildResult {
  const before = baseScene(seed, `${gapId}-${seed}-0`);
  switch (gapId) {
    case "FAN-GAP-01": {
      const after = independentRotationResult(before, `${gapId}-${seed}-1`);
      return {
        scenes: [before, after],
        operationTrace: ["rotate comp-a +90 about own center", "rotate comp-b -90 about own center"],
        proofChecks: [
          check("scene changed", allChanged(before, after)),
          check("component A moved independently", spatialSceneSemanticFingerprint(extractSpatialNodeSubsetV1(before, ["comp-a"])) !== spatialSceneSemanticFingerprint(extractSpatialNodeSubsetV1(after, ["comp-a"]))),
          check("component B moved independently", spatialSceneSemanticFingerprint(extractSpatialNodeSubsetV1(before, ["comp-b"])) !== spatialSceneSemanticFingerprint(extractSpatialNodeSubsetV1(after, ["comp-b"]))),
        ],
      };
    }
    case "FAN-GAP-02": {
      const ids = ["comp-a", "comp-b", "comp-c", "comp-d"] as const;
      const beforeCenters = ids.map((id) => spatialNodeCenterV1(node(before, id)));
      const after = cycleSelectedSpatialNodePositionsV1(before, ids, `${gapId}-${seed}-1`);
      const afterCenters = ids.map((id) => spatialNodeCenterV1(node(after, id)));
      return {
        scenes: [before, after],
        operationTrace: ["cycle four component positions"],
        proofChecks: [
          check("scene changed", allChanged(before, after)),
          check("all component centers moved", beforeCenters.every((center, index) => center.x !== afterCenters[index]!.x || center.y !== afterCenters[index]!.y)),
        ],
      };
    }
    case "FAN-GAP-03": {
      const center = spatialNodeCenterV1(node(before, "comp-c"));
      const beforeExtent = spatialNodeExtentV1(node(before, "comp-c"));
      const after = scaleSelectedSpatialNodesV1(before, ["comp-c"], 1.55, center, `${gapId}-${seed}-1`);
      const afterExtent = spatialNodeExtentV1(node(after, "comp-c"));
      return {
        scenes: [before, after],
        operationTrace: ["scale comp-c by 1.55 about own center"],
        proofChecks: [check("selected size increased", afterExtent > beforeExtent * 1.5)],
      };
    }
    case "FAN-GAP-04": {
      const beforeCenter = spatialNodeCenterV1(node(before, "comp-c"));
      const after = translateSelectedSpatialNodesV1(before, ["comp-c"], 62, 0, `${gapId}-${seed}-1`);
      const afterCenter = spatialNodeCenterV1(node(after, "comp-c"));
      return {
        scenes: [before, after],
        operationTrace: ["transfer comp-c from inside container to outside-right"],
        proofChecks: [
          check("started inside container", beforeCenter.x > 30 && beforeCenter.x < 90 && beforeCenter.y > 30 && beforeCenter.y < 90),
          check("ended outside container", afterCenter.x > 90),
        ],
      };
    }
    case "FAN-GAP-05": {
      const aCenter = spatialNodeCenterV1(node(before, "comp-a"));
      const operations: SpatialGapOperationV1[] = [
        { kind: "REFLECT_SELECTED", nodeIds: ["comp-a"], axis: "VERTICAL", axisValue: aCenter.x },
        { kind: "TRANSLATE_SELECTED", nodeIds: ["comp-b"], dx: 0, dy: 10 },
        { kind: "SET_FILL", nodeIds: ["comp-d"], fill: "#111" },
        { kind: "REMOVE_SELECTED", nodeIds: ["dot-1"] },
      ];
      const after = applySpatialGapPipelineV1(before, operations, `${gapId}-${seed}-pipeline`);
      return {
        scenes: [before, after],
        operationTrace: operations.map((operation) => operation.kind),
        proofChecks: [
          check("compound pipeline changed scene", allChanged(before, after)),
          check("fill mutation applied", filledSpatialNodeCountV1(after) > filledSpatialNodeCountV1(before) - 1),
          check("count mutation applied", countSpatialNodesByRoleV1(after, "dot") === 1),
        ],
      };
    }
    default:
      throw new Error(`Gap '${gapId}' is not a FAN gap.`);
  }
}

function buildFclGap(gapId: SpatialGapIdV1, seed: string): GapBuildResult {
  const base = baseScene(seed, `${gapId}-${seed}-base`);
  switch (gapId) {
    case "FCL-GAP-01": {
      const subject = extractSpatialNodeSubsetV1(base, ["comp-a", "comp-b", "dot-1"], `${gapId}-${seed}-subject`);
      const pivot = spatialSceneCenterV1(subject);
      const ids = subject.nodes.map((entry) => entry.id);
      const r90 = rotateSelectedSpatialNodesV1(subject, ids, 90, pivot, `${gapId}-${seed}-r90`);
      const r180 = rotateSelectedSpatialNodesV1(subject, ids, 180, pivot, `${gapId}-${seed}-r180`);
      const odd = scaleSelectedSpatialNodesV1(subject, ["comp-a"], 1.35, spatialNodeCenterV1(node(subject, "comp-a")), `${gapId}-${seed}-odd`);
      const orbits = [subject, r90, r180, odd].map(spatialRotationOrbitFingerprintV1);
      return {
        scenes: [subject, r90, r180, odd],
        operationTrace: ["build three rotation-orbit equivalents", "change one component scale for odd orbit"],
        proofChecks: [
          check("three share rotation orbit", orbits[0] === orbits[1] && orbits[1] === orbits[2]),
          check("odd breaks rotation orbit", orbits[3] !== orbits[0]),
        ],
      };
    }
    case "FCL-GAP-02": {
      const common1 = base;
      const common2 = translateSelectedSpatialNodesV1(base, ["comp-a"], 1.5, 0, `${gapId}-${seed}-common2`);
      const common3 = translateSelectedSpatialNodesV1(base, ["comp-b"], -1.5, 0, `${gapId}-${seed}-common3`);
      const odd = duplicateSelectedSpatialNodesV1(base, ["dot-1"], 0, 8, "extra", `${gapId}-${seed}-odd`);
      const counts = [common1, common2, common3, odd].map((scene) => countSpatialNodesByRoleV1(scene, "dot"));
      return {
        scenes: [common1, common2, common3, odd],
        operationTrace: ["evaluate generic role counts across option scenes"],
        proofChecks: [check("3-to-1 count relation", counts[0] === counts[1] && counts[1] === counts[2] && counts[3] === counts[0]! + 1)],
      };
    }
    case "FCL-GAP-03": {
      const common1 = base;
      const common2 = translateSelectedSpatialNodesV1(base, ["guide-line"], 0, 1, `${gapId}-${seed}-common2`);
      const common3 = translateSelectedSpatialNodesV1(base, ["guide-line"], 0, -1, `${gapId}-${seed}-common3`);
      const odd = scaleSelectedSpatialNodesV1(base, ["comp-d"], 2.1, spatialNodeCenterV1(node(base, "comp-d")), `${gapId}-${seed}-odd`);
      const ratios = [common1, common2, common3, odd].map((scene) => spatialNodeExtentV1(node(scene, "comp-d")) / spatialNodeExtentV1(node(scene, "comp-c")));
      return {
        scenes: [common1, common2, common3, odd],
        operationTrace: ["compare nested component relative-size ratio"],
        proofChecks: [check("three small-to-large relations and one reversal", ratios.slice(0, 3).every((ratio) => ratio < 1) && ratios[3]! > 1)],
      };
    }
    case "FCL-GAP-04": {
      const center = spatialSceneCenterV1(base);
      const beforePos = classifySpatialRelativePositionV1(spatialNodeCenterV1(node(base, "comp-a")), center);
      const moved = translateSelectedSpatialNodesV1(base, ["comp-a"], 36, 36, `${gapId}-${seed}-moved`);
      const afterPos = classifySpatialRelativePositionV1(spatialNodeCenterV1(node(moved, "comp-a")), center);
      return {
        scenes: [base, moved],
        operationTrace: ["move component across relative-position sectors", "classify sector before and after"],
        proofChecks: [check("relative-position relation changed", beforePos !== afterPos, `${beforePos} -> ${afterPos}`)],
      };
    }
    case "FCL-GAP-05": {
      const shaded = setSelectedSpatialFillV1(base, ["comp-d"], "#111", `${gapId}-${seed}-shaded`);
      const shiftedShade = setSelectedSpatialFillV1(base, ["comp-b"], "#111", `${gapId}-${seed}-shifted`);
      return {
        scenes: [base, shaded, shiftedShade],
        operationTrace: ["mutate fill state", "move decisive shading between components"],
        proofChecks: [
          check("fill count changes", filledSpatialNodeCountV1(shaded) === filledSpatialNodeCountV1(base) + 1),
          check("shading location produces distinct scene", spatialSceneSemanticFingerprint(shaded) !== spatialSceneSemanticFingerprint(shiftedShade)),
        ],
      };
    }
    case "FCL-GAP-06": {
      const left = extractSpatialNodeSubsetV1(base, ["comp-a"], `${gapId}-${seed}-left`);
      const leftCenter = spatialNodeCenterV1(node(left, "comp-a"));
      const right = reflectSelectedSpatialNodesV1(left, ["comp-a"], "VERTICAL", leftCenter.x, `${gapId}-${seed}-right`);
      const relations = inferCenteredSubfigureTransformRelationsV1(left, right);
      return {
        scenes: [left, right],
        operationTrace: ["extract subfigure pair", "reflect one subfigure vertically", "infer centered transform relation"],
        proofChecks: [check("mirror relation inferred", relations.includes("REFLECT_VERTICAL"), relations.join(","))],
      };
    }
    default:
      throw new Error(`Gap '${gapId}' is not an FCL gap.`);
  }
}

function buildFsrGap(gapId: SpatialGapIdV1, seed: string): GapBuildResult {
  const frame0 = baseScene(seed, `${gapId}-${seed}-f0`);
  switch (gapId) {
    case "FSR-GAP-01": {
      const pivot = spatialNodeCenterV1(node(frame0, "comp-a"));
      const frame1 = reflectSelectedSpatialNodesV1(frame0, ["comp-a"], "VERTICAL", pivot.x, `${gapId}-${seed}-f1`);
      const frame2 = reflectSelectedSpatialNodesV1(frame1, ["comp-a"], "VERTICAL", pivot.x, `${gapId}-${seed}-f2`);
      const frame3 = reflectSelectedSpatialNodesV1(frame2, ["comp-a"], "VERTICAL", pivot.x, `${gapId}-${seed}-f3`);
      const fps = [frame0, frame1, frame2, frame3].map(spatialSceneSemanticFingerprint);
      return {
        scenes: [frame0, frame1, frame2, frame3],
        operationTrace: ["vertical inversion", "vertical inversion", "vertical inversion"],
        proofChecks: [check("reflection alternates states", fps[0] === fps[2] && fps[1] === fps[3] && fps[0] !== fps[1])],
      };
    }
    case "FSR-GAP-02": {
      const frame1 = independentRotationResult(frame0, `${gapId}-${seed}-f1`);
      const frame2 = independentRotationResult(frame1, `${gapId}-${seed}-f2`);
      const frame3 = independentRotationResult(frame2, `${gapId}-${seed}-f3`);
      const fps = [frame0, frame1, frame2, frame3].map(spatialSceneSemanticFingerprint);
      return {
        scenes: [frame0, frame1, frame2, frame3],
        operationTrace: ["A +90 / B -90", "A +90 / B -90", "A +90 / B -90"],
        proofChecks: [check("independent component progression produces four visible states", new Set(fps).size === 4)],
      };
    }
    case "FSR-GAP-03": {
      const frame1 = translateSelectedSpatialNodesV1(frame0, ["comp-a"], 10, 0, `${gapId}-${seed}-f1`);
      const frame2 = translateSelectedSpatialNodesV1(frame1, ["comp-a"], 0, 10, `${gapId}-${seed}-f2`);
      const frame3 = translateSelectedSpatialNodesV1(frame2, ["comp-a"], -10, 0, `${gapId}-${seed}-f3`);
      const centers = [frame0, frame1, frame2, frame3].map((scene) => spatialNodeCenterV1(node(scene, "comp-a")));
      return {
        scenes: [frame0, frame1, frame2, frame3],
        operationTrace: ["move right", "move down", "move left"],
        proofChecks: [check("general component movement supported", new Set(centers.map((point) => `${point.x.toFixed(3)},${point.y.toFixed(3)}`)).size === 4)],
      };
    }
    case "FSR-GAP-04": {
      const frame1 = duplicateSelectedSpatialNodesV1(frame0, ["dot-1"], 0, 8, "plus-a", `${gapId}-${seed}-f1`);
      const frame2 = duplicateSelectedSpatialNodesV1(frame1, ["dot-2"], 0, 8, "plus-b", `${gapId}-${seed}-f2`);
      const frame3 = removeSelectedSpatialNodesV1(frame2, ["dot-1-plus-a"], `${gapId}-${seed}-f3`);
      const counts = [frame0, frame1, frame2, frame3].map((scene) => countSpatialNodesByRoleV1(scene, "dot"));
      return {
        scenes: [frame0, frame1, frame2, frame3],
        operationTrace: ["add element", "add another element", "remove element"],
        proofChecks: [check("addition and removal progression supported", counts.join(",") === "2,3,4,3", counts.join(","))],
      };
    }
    case "FSR-GAP-05": {
      const frame1 = setSelectedSpatialFillV1(frame0, ["comp-d"], "#111", `${gapId}-${seed}-f1`);
      const frame2 = setSelectedSpatialFillV1(frame1, ["comp-d"], "none", `${gapId}-${seed}-f2`);
      const frame3 = setSelectedSpatialFillV1(frame2, ["comp-d"], "#111", `${gapId}-${seed}-f3`);
      const states = [frame0, frame1, frame2, frame3].map((scene) => node(scene, "comp-d").style?.fill ?? "none");
      return {
        scenes: [frame0, frame1, frame2, frame3],
        operationTrace: ["shade", "unshade", "shade"],
        proofChecks: [check("fill-state progression alternates", states[0] === "none" && states[1] === "#111" && states[2] === "none" && states[3] === "#111")],
      };
    }
    case "FSR-GAP-06": {
      const frame1 = replaceSpatialNodeV1(frame0, "comp-d", replacementCircle(frame0), `${gapId}-${seed}-f1`);
      const frame2 = replaceSpatialNodeV1(frame1, "comp-d", replacementTriangle(frame1), `${gapId}-${seed}-f2`);
      const frame3 = replaceSpatialNodeV1(frame2, "comp-d", replacementCircle(frame2), `${gapId}-${seed}-f3`);
      const kinds = [frame0, frame1, frame2, frame3].map((scene) => node(scene, "comp-d").kind);
      return {
        scenes: [frame0, frame1, frame2, frame3],
        operationTrace: ["square -> circle", "circle -> triangle", "triangle -> circle"],
        proofChecks: [check("node substitution progression supported", kinds.join(",") === "polygon,circle,polygon,circle", kinds.join(","))],
      };
    }
    case "FSR-GAP-07": {
      const ids = ["comp-a", "comp-b", "comp-c", "comp-d"] as const;
      const frame1 = cycleSelectedSpatialNodePositionsV1(frame0, ids, `${gapId}-${seed}-f1`);
      const frame2 = cycleSelectedSpatialNodePositionsV1(frame1, ids, `${gapId}-${seed}-f2`);
      const frame3 = cycleSelectedSpatialNodePositionsV1(frame2, ids, `${gapId}-${seed}-f3`);
      const fps = [frame0, frame1, frame2, frame3].map(spatialSceneSemanticFingerprint);
      return {
        scenes: [frame0, frame1, frame2, frame3],
        operationTrace: ["cycle four positions", "cycle four positions", "cycle four positions"],
        proofChecks: [check("multi-element permutation yields distinct phases", new Set(fps).size === 4)],
      };
    }
    case "FSR-GAP-08": {
      const aCenter = spatialNodeCenterV1(node(frame0, "comp-a"));
      const frame1 = rotateSelectedSpatialNodesV1(frame0, ["comp-a"], 90, aCenter, `${gapId}-${seed}-f1`);
      const frame2 = setSelectedSpatialFillV1(frame1, ["comp-d"], "#111", `${gapId}-${seed}-f2`);
      const frame3 = rotateSelectedSpatialNodesV1(frame2, ["comp-a"], 90, aCenter, `${gapId}-${seed}-f3`);
      return {
        scenes: [frame0, frame1, frame2, frame3],
        operationTrace: ["phase A: rotate", "phase B: shade", "phase A: rotate"],
        proofChecks: [
          check("alternating phase A changes orientation", spatialSceneSemanticFingerprint(frame0) !== spatialSceneSemanticFingerprint(frame1)),
          check("alternating phase B changes fill", filledSpatialNodeCountV1(frame2) === filledSpatialNodeCountV1(frame1) + 1),
          check("phase A repeats after phase B", spatialSceneSemanticFingerprint(frame2) !== spatialSceneSemanticFingerprint(frame3)),
        ],
      };
    }
    default:
      throw new Error(`Gap '${gapId}' is not an FSR gap.`);
  }
}

function buildGap(gapId: SpatialGapIdV1, seed: string): GapBuildResult {
  if (gapId.startsWith("FAN-")) return buildFanGap(gapId, seed);
  if (gapId.startsWith("FCL-")) return buildFclGap(gapId, seed);
  return buildFsrGap(gapId, seed);
}

export function generateSpatialGapRuntimeCandidateV1(
  gapId: SpatialGapIdV1,
  seed: string,
): SpatialGapRuntimeCandidateV1 {
  if (!seed.trim()) throw new Error("Spatial gap runtime candidate requires a non-empty seed.");
  const authority = getSpatialGapAuthorityV1(gapId);
  const built = buildGap(gapId, seed);
  const failed = built.proofChecks.filter((entry) => !entry.pass);
  if (failed.length > 0) {
    throw new Error(`${gapId} proof checks failed: ${failed.map((entry) => entry.name).join(", ")}.`);
  }
  const sceneFingerprints = built.scenes.map(spatialSceneSemanticFingerprint);
  const contentFingerprint = [gapId, ...sceneFingerprints].join("::");
  const deliveryFingerprint = [contentFingerprint, seed, built.operationTrace.join("|")].join("::DELIVERY::");
  return {
    version: "SPA-FND-001-GAP-RUNTIME-V1",
    gapId,
    chapterCode: authority.chapterCode,
    seed,
    capabilityIds: authority.capabilityIds,
    scenes: built.scenes,
    operationTrace: built.operationTrace,
    proofChecks: built.proofChecks,
    contentFingerprint,
    deliveryFingerprint,
    lifecycle: { ...SPATIAL_GAP_LIFECYCLE_LOCK_V1 },
  };
}
