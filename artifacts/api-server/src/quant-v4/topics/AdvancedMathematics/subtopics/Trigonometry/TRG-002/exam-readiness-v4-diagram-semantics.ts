type AnyRecord = Record<string, any>;

type SemanticCorrectionResult = {
  diagram: AnyRecord;
  audit: {
    status: "PASS";
    removedFalseDimensions: number;
    removedDuplicateDimensions: number;
    removedDuplicateSupportSegments: number;
    structuralCorrections: string[];
    remainingDimensions: number;
  };
};

const FALSE_OBJECT_HEIGHT_QLS = new Set([
  "TRG-002-QL-035",
  "TRG-002-QL-067",
  "TRG-002-QL-069",
  "TRG-002-QL-095",
]);

const FALSE_HORIZONTAL_SEPARATION_QLS = new Set([
  "TRG-002-QL-042",
  "TRG-002-QL-070",
  "TRG-002-QL-071",
  "TRG-002-QL-072",
  "TRG-002-QL-088",
]);

function pointMap(diagram: AnyRecord) {
  return new Map<string, AnyRecord>((diagram.points ?? []).map((point: AnyRecord) => [point.id, point]));
}

function coordinateKey(point: AnyRecord | undefined) {
  if (!point) return "missing";
  return `${Number(point.x).toFixed(4)},${Number(point.y).toFixed(4)}`;
}

function geometricEndpointKey(fromPointId: string, toPointId: string, points: Map<string, AnyRecord>) {
  return [coordinateKey(points.get(fromPointId)), coordinateKey(points.get(toPointId))].sort().join("::");
}

function explicitSlopedLength(stem: string, label: string) {
  const number = label.replace(/\s*m\s*$/u, "").trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`line of sight[^.]{0,60}${number}\\s*m`, "iu"),
    new RegExp(`${number}\\s*m(?:\\s+long)?\\s+(?:ladder|guy\\s+wire|supporting\\s+wire|wire)`, "iu"),
    new RegExp(`(?:ladder|guy\\s+wire|supporting\\s+wire|wire)[^.]{0,45}${number}\\s*m`, "iu"),
  ];
  return patterns.some((pattern) => pattern.test(stem));
}

function filterSemanticallyFalseDimensions(qlId: string, stem: string, arrows: AnyRecord[]) {
  const kept: AnyRecord[] = [];
  let removed = 0;
  for (const arrow of arrows) {
    const kind = String(arrow.kind ?? "");
    if (kind === "REVIEW_GIVEN_SIGHT_LINE" && !explicitSlopedLength(stem, String(arrow.label ?? ""))) {
      removed += 1;
      continue;
    }
    if (kind === "REVIEW_GIVEN_OBJECT_HEIGHT" && FALSE_OBJECT_HEIGHT_QLS.has(qlId)) {
      removed += 1;
      continue;
    }
    if (kind === "REVIEW_GIVEN_HORIZONTAL_SEPARATION" && FALSE_HORIZONTAL_SEPARATION_QLS.has(qlId)) {
      removed += 1;
      continue;
    }
    if (qlId === "TRG-002-QL-079" && kind === "REVIEW_DERIVED_HELPER_OBJECT_HEIGHT") {
      removed += 1;
      continue;
    }
    kept.push({ ...arrow });
  }
  return { kept, removed };
}

function dimensionPriority(kind: string) {
  if (kind === "REVIEW_REQUESTED_UNKNOWN") return 100;
  if (kind === "REVIEW_GIVEN_WIRE" || kind === "REVIEW_GIVEN_LADDER") return 90;
  if (kind === "REVIEW_GIVEN_SIGHT_LINE") return 70;
  if (kind.startsWith("REVIEW_GIVEN_")) return 80;
  if (kind.startsWith("REVIEW_RELATIONAL_")) return 85;
  return 60;
}

function dedupeDimensionsByPhysicalGeometry(diagram: AnyRecord) {
  const points = pointMap(diagram);
  const arrows: AnyRecord[] = diagram.measurementArrows ?? [];
  const selected = new Map<string, AnyRecord>();
  const order: string[] = [];
  for (const arrow of arrows) {
    const key = `${geometricEndpointKey(arrow.fromPointId, arrow.toPointId, points)}::${String(arrow.label ?? "")}`;
    const current = selected.get(key);
    if (!current) {
      selected.set(key, arrow);
      order.push(key);
      continue;
    }
    if (dimensionPriority(String(arrow.kind)) > dimensionPriority(String(current.kind))) selected.set(key, arrow);
  }
  const deduped = order.map((key) => ({ ...selected.get(key)! }));
  return { arrows: deduped, removed: arrows.length - deduped.length };
}

function dedupeAndStrengthenSupportSegments(diagram: AnyRecord) {
  const points = pointMap(diagram);
  const original: AnyRecord[] = Array.isArray(diagram.segments) ? diagram.segments : [];
  const supportKinds = new Set(["SIGHT_LINE", "LADDER", "WIRE"]);
  const groups = new Map<string, AnyRecord[]>();
  for (const segment of original) {
    if (!supportKinds.has(String(segment.kind))) continue;
    const key = geometricEndpointKey(segment.fromPointId, segment.toPointId, points);
    const group = groups.get(key) ?? [];
    group.push(segment);
    groups.set(key, group);
  }

  const selectedByKey = new Map<string, AnyRecord>();
  for (const [key, group] of groups) {
    const semantic = group.find((segment) => ["LADDER", "WIRE"].includes(String(segment.kind))) ?? group[0]!;
    const originalKind = String(semantic.kind);
    selectedByKey.set(key, {
      ...semantic,
      kind: "SIGHT_LINE",
      ...(originalKind === "LADDER" || originalKind === "WIRE" ? { semanticKind: originalKind } : {}),
    });
  }

  const emittedSupport = new Set<string>();
  const segments: AnyRecord[] = [];
  for (const segment of original) {
    if (!supportKinds.has(String(segment.kind))) {
      segments.push({ ...segment });
      continue;
    }
    const key = geometricEndpointKey(segment.fromPointId, segment.toPointId, points);
    if (emittedSupport.has(key)) continue;
    emittedSupport.add(key);
    segments.push(selectedByKey.get(key)!);
  }

  const removedDuplicates = original.filter((segment) => supportKinds.has(String(segment.kind))).length - selectedByKey.size;
  return { segments, removedDuplicates };
}

function addGroundAngle(diagram: AnyRecord, qlId: string, label: string) {
  const angles: AnyRecord[] = Array.isArray(diagram.angles) ? diagram.angles.map((angle: AnyRecord) => ({ ...angle })) : [];
  if (angles.some((angle) => String(angle.label) === label)) return angles;
  angles.push({
    id: `semantic-ladder-ground-angle-${qlId}`,
    vertexPointId: "ladder-base",
    rayPointId: "wall-contact",
    referenceDirection: "LEFT",
    classification: "ELEVATION",
    label,
    arcLane: 0,
    semanticReviewAdded: true,
  });
  return angles;
}

function repairQl034(diagram: AnyRecord, stem: string, structuralCorrections: string[]) {
  const points: AnyRecord[] = (diagram.points ?? []).map((point: AnyRecord) => ({ ...point }));
  const base = points.find((point) => point.id === "object-base");
  const top = points.find((point) => point.id === "object-top");
  const newTip = points.find((point) => point.id === "shadow-tip");
  if (!base || !top || !newTip) throw new Error("TRG-002-QL-034: semantic shadow repair requires base, top and new shadow tip.");

  newTip.label = "S₃₀";
  const oldTip = {
    id: "shadow-tip-old",
    x: Number(base.x) + (Number(newTip.x) - Number(base.x)) / 3,
    y: Number(base.y),
    role: "SHADOW_TIP",
    label: "S₆₀",
    semanticReviewAdded: true,
  };
  if (!points.some((point) => point.id === oldTip.id)) points.push(oldTip);

  const segments: AnyRecord[] = (diagram.segments ?? []).map((segment: AnyRecord) => ({ ...segment }));
  if (!segments.some((segment) => segment.id === "semantic-shadow-old-ray")) {
    segments.push({ id: "semantic-shadow-old-ray", fromPointId: "shadow-tip-old", toPointId: "object-top", kind: "SIGHT_LINE", semanticReviewAdded: true });
  }

  const angles: AnyRecord[] = (diagram.angles ?? []).map((angle: AnyRecord) => ({ ...angle }));
  if (!angles.some((angle) => String(angle.label) === "60°")) {
    angles.push({
      id: "semantic-shadow-old-angle",
      vertexPointId: "shadow-tip-old",
      rayPointId: "object-top",
      referenceDirection: "LEFT",
      classification: "ELEVATION",
      label: "60°",
      arcLane: 0,
      semanticReviewAdded: true,
    });
  }

  let arrows: AnyRecord[] = (diagram.measurementArrows ?? [])
    .filter((arrow: AnyRecord) => String(arrow.kind) !== "REVIEW_DERIVED_HELPER_OBJECT_HEIGHT")
    .map((arrow: AnyRecord) => ({ ...arrow }));
  const oldShadow = stem.match(/(?:casts?\s+(?:a\s+)?)(\d+(?:\.\d+)?)\s*m\s+shadow/iu)?.[1]
    ?? stem.match(/shadow\s+(?:of\s+)?(?:a\s+)?(?:vertical\s+)?\w*\s*(?:is\s+)?(\d+(?:\.\d+)?)\s*m/iu)?.[1]
    ?? "5";
  if (!arrows.some((arrow) => arrow.fromPointId === "object-base" && arrow.toPointId === "shadow-tip-old")) {
    arrows.push({
      id: "semantic-review-dim-TRG-002-QL-034-old-shadow",
      fromPointId: "object-base",
      toPointId: "shadow-tip-old",
      label: `${oldShadow} m`,
      side: "LEFT",
      lane: 1,
      kind: "REVIEW_GIVEN_OLD_SHADOW",
      semanticReviewAdded: true,
    });
  }

  structuralCorrections.push("QL034_TWO_SHADOW_STATES_60_TO_30");
  return { ...diagram, points, segments, angles, measurementArrows: arrows };
}

export function applyTrg002V4DiagramSemanticCorrections(args: {
  qlId: string;
  diagram: AnyRecord;
  englishStem: string;
}): SemanticCorrectionResult {
  const { qlId, englishStem } = args;
  let diagram: AnyRecord = {
    ...args.diagram,
    points: (args.diagram.points ?? []).map((point: AnyRecord) => ({ ...point })),
    segments: (args.diagram.segments ?? []).map((segment: AnyRecord) => ({ ...segment })),
    angles: (args.diagram.angles ?? []).map((angle: AnyRecord) => ({ ...angle })),
    measurementArrows: (args.diagram.measurementArrows ?? []).map((arrow: AnyRecord) => ({ ...arrow })),
  };
  const structuralCorrections: string[] = [];

  const filtered = filterSemanticallyFalseDimensions(qlId, englishStem, diagram.measurementArrows);
  diagram.measurementArrows = filtered.kept;

  if (qlId === "TRG-002-QL-034") diagram = repairQl034(diagram, englishStem, structuralCorrections);

  if (qlId === "TRG-002-QL-037") {
    diagram.angles = addGroundAngle(diagram, qlId, "60°");
    structuralCorrections.push("QL037_WALL_30_COMPLEMENT_GROUND_60");
  }
  if (qlId === "TRG-002-QL-039") {
    diagram.angles = addGroundAngle(diagram, qlId, "45°");
    structuralCorrections.push("QL039_LADDER_GROUND_45");
  }
  if (qlId === "TRG-002-QL-040") {
    diagram.angles = addGroundAngle(diagram, qlId, "30°");
    structuralCorrections.push("QL040_LADDER_GROUND_30");
  }

  const support = dedupeAndStrengthenSupportSegments(diagram);
  diagram.segments = support.segments;
  if (support.removedDuplicates > 0) structuralCorrections.push(`DEDUPED_SUPPORT_SEGMENTS_${support.removedDuplicates}`);

  const dedupedDimensions = dedupeDimensionsByPhysicalGeometry(diagram);
  diagram.measurementArrows = dedupedDimensions.arrows;
  if (dedupedDimensions.removed > 0) structuralCorrections.push(`DEDUPED_DIMENSIONS_${dedupedDimensions.removed}`);

  const arrows = diagram.measurementArrows ?? [];
  if (arrows.length < 2) throw new Error(`${qlId}: semantic diagram repair left fewer than two meaningful dimensions (${arrows.length}).`);
  const requestedPresent = arrows.some((arrow: AnyRecord) => String(arrow.kind) === "REVIEW_REQUESTED_UNKNOWN")
    || !String(englishStem).match(/\b(?:find|what is|determine|how far|how high|what will be)\b/iu);
  const priorAudit = diagram.reviewDimensionAudit ?? {};
  diagram.reviewDimensionAudit = {
    ...priorAudit,
    autoDimensions: arrows.length,
    totalDimensions: arrows.length,
    requestedDimensionPresent: priorAudit.requestedDimensionPresent ?? requestedPresent,
    answerHiddenOnRequestedDimension: true,
    semanticFidelityChecked: true,
  };
  diagram.semanticDiagramAudit = {
    status: "PASS",
    removedFalseDimensions: filtered.removed,
    removedDuplicateDimensions: dedupedDimensions.removed,
    removedDuplicateSupportSegments: support.removedDuplicates,
    structuralCorrections,
    remainingDimensions: arrows.length,
  };

  return { diagram, audit: diagram.semanticDiagramAudit };
}
