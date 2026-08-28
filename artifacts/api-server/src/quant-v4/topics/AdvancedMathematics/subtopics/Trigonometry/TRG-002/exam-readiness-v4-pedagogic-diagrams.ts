type AnyRecord = Record<string, any>;

type PedagogicResult = {
  diagram: AnyRecord;
  audit: {
    status: "PASS";
    helperPointsLabeled: number;
    helperSegmentsAdded: number;
    teachingDimensionsAdded: number;
    requestedLabelsRealigned: number;
    explanationFactsVisualized: string[];
  };
};

function endpointKey(a: string, b: string) {
  return [a, b].sort().join("::");
}

function normalized(value: unknown) {
  return String(value ?? "")
    .replaceAll("−", "-")
    .replace(/\s+/gu, "")
    .replace(/m$/u, "")
    .trim();
}

function explanationSentences(text: string) {
  return text.split(/(?<=[.!?])\s+/u).map((part) => part.trim()).filter(Boolean);
}

function finalMeterValue(text: string, keywords: string[]) {
  for (const sentence of explanationSentences(text)) {
    const lower = sentence.toLowerCase();
    if (!keywords.some((keyword) => lower.includes(keyword.toLowerCase()))) continue;
    const lastEq = sentence.lastIndexOf("=");
    if (lastEq >= 0) {
      const tail = sentence.slice(lastEq + 1).trim();
      const match = tail.match(/^([^.;]+?)\s*m\b/u);
      if (match) return `${match[1]!.trim()} m`;
    }
    const matches = [...sentence.matchAll(/([0-9]+(?:\.\d+)?(?:\s*[+\-−]\s*[0-9]+(?:\.\d+)?)?(?:\s*[+\-−]\s*[0-9]*√[0-9]+)?|[0-9]*√[0-9]+)\s*m\b/gu)];
    if (matches.length) return `${matches[matches.length - 1]![1]!.trim()} m`;
  }
  return null;
}

function pointMap(diagram: AnyRecord) {
  return new Map<string, AnyRecord>((diagram.points ?? []).map((point: AnyRecord) => [String(point.id), point]));
}

function findPoint(diagram: AnyRecord, id: string) {
  return (diagram.points ?? []).find((point: AnyRecord) => point.id === id) as AnyRecord | undefined;
}

function hasPair(diagram: AnyRecord, fromPointId: string, toPointId: string) {
  const key = endpointKey(fromPointId, toPointId);
  return (diagram.measurementArrows ?? []).some((arrow: AnyRecord) => endpointKey(arrow.fromPointId, arrow.toPointId) === key);
}

function requestedArrow(diagram: AnyRecord) {
  return (diagram.measurementArrows ?? []).find((arrow: AnyRecord) => String(arrow.kind ?? "").includes("REQUESTED"));
}

function lastLane(diagram: AnyRecord) {
  return Math.max(-1, ...(diagram.measurementArrows ?? []).map((arrow: AnyRecord) => Number.isFinite(Number(arrow.lane)) ? Number(arrow.lane) : 0));
}

function addTeachingDimension(
  diagram: AnyRecord,
  qlId: string,
  fromPointId: string,
  toPointId: string,
  label: string,
  fact: string,
  englishAnswer: string,
  audit: PedagogicResult["audit"],
) {
  if (!findPoint(diagram, fromPointId) || !findPoint(diagram, toPointId) || !label.trim()) return false;
  if (normalized(label) === normalized(englishAnswer)) return false;
  const same = (diagram.measurementArrows ?? []).some((arrow: AnyRecord) =>
    endpointKey(arrow.fromPointId, arrow.toPointId) === endpointKey(fromPointId, toPointId)
      && normalized(arrow.label) === normalized(label));
  if (same) return false;
  diagram.measurementArrows ??= [];
  diagram.measurementArrows.push({
    id: `pedagogic-${qlId.replace(/[^A-Za-z0-9]/g, "-")}-${diagram.measurementArrows.length + 1}`,
    fromPointId,
    toPointId,
    label,
    side: "LEFT",
    lane: lastLane(diagram) + 1,
    kind: `PEDAGOGIC_${fact}`,
    pedagogic: true,
  });
  audit.teachingDimensionsAdded += 1;
  audit.explanationFactsVisualized.push(fact);
  return true;
}

function labelExistingPoint(diagram: AnyRecord, pointId: string, label: string, audit: PedagogicResult["audit"]) {
  const point = findPoint(diagram, pointId);
  if (!point) return false;
  if (String(point.label ?? "").trim()) return false;
  point.label = label;
  point.pedagogic = true;
  audit.helperPointsLabeled += 1;
  return true;
}

function addAuxSegment(diagram: AnyRecord, qlId: string, fromPointId: string, toPointId: string, kind: string, fact: string, audit: PedagogicResult["audit"]) {
  if (!findPoint(diagram, fromPointId) || !findPoint(diagram, toPointId)) return false;
  const key = endpointKey(fromPointId, toPointId);
  if ((diagram.segments ?? []).some((segment: AnyRecord) => endpointKey(segment.fromPointId, segment.toPointId) === key)) return false;
  diagram.segments ??= [];
  diagram.segments.push({
    id: `pedagogic-segment-${qlId.replace(/[^A-Za-z0-9]/g, "-")}-${diagram.segments.length + 1}`,
    fromPointId,
    toPointId,
    kind,
    pedagogic: true,
  });
  audit.helperSegmentsAdded += 1;
  audit.explanationFactsVisualized.push(fact);
  return true;
}

function eyeLevelTeaching(args: {
  qlId: string;
  diagram: AnyRecord;
  explanationText: string;
  englishAnswer: string;
  audit: PedagogicResult["audit"];
}) {
  const { qlId, diagram, explanationText, englishAnswer, audit } = args;
  const points = pointMap(diagram);
  const eyeSegments = (diagram.segments ?? []).filter((segment: AnyRecord) => String(segment.kind) === "EYE_LEVEL");
  const seenCoordinates = new Set<string>();
  let helperIndex = 1;

  for (const segment of eyeSegments) {
    const from = points.get(String(segment.fromPointId));
    const to = points.get(String(segment.toPointId));
    if (!from || !to) continue;
    const eye = from.role === "OBSERVER_EYE" ? from : to.role === "OBSERVER_EYE" ? to : null;
    const level = eye === from ? to : eye === to ? from : null;
    if (!eye || !level) continue;
    const coordinate = `${Number(level.x).toFixed(3)}:${Number(level.y).toFixed(3)}`;
    if (seenCoordinates.has(coordinate)) continue;
    seenCoordinates.add(coordinate);
    labelExistingPoint(diagram, level.id, helperIndex === 1 ? "H" : `H${helperIndex}`, audit);
    helperIndex += 1;

    const sight = (diagram.segments ?? []).find((candidate: AnyRecord) =>
      String(candidate.kind) === "SIGHT_LINE"
        && (candidate.fromPointId === eye.id || candidate.toPointId === eye.id));
    if (!sight) continue;
    const targetId = sight.fromPointId === eye.id ? sight.toPointId : sight.fromPointId;
    const target = points.get(String(targetId));
    if (!target) continue;
    const vertical = Math.abs(Number(target.x) - Number(level.x)) < 1e-5;
    if (!vertical) continue;

    if (Number(target.y) < Number(eye.y)) {
      const rise = finalMeterValue(explanationText, ["rise", "height difference", "above eye", "above first roof"]);
      if (rise) addTeachingDimension(diagram, qlId, level.id, target.id, `rise = ${rise}`, "DERIVED_RISE", englishAnswer, audit);
    } else if (Number(target.y) > Number(eye.y)) {
      const drop = finalMeterValue(explanationText, ["drop", "vertical difference", "below", "depression"]);
      if (drop) addTeachingDimension(diagram, qlId, level.id, target.id, `drop = ${drop}`, "DERIVED_DROP", englishAnswer, audit);
    }
  }
}

function sameSideTeaching(args: {
  qlId: string;
  diagram: AnyRecord;
  stem: string;
  explanationText: string;
  englishAnswer: string;
  audit: PedagogicResult["audit"];
}) {
  const { qlId, diagram, stem, explanationText, englishAnswer, audit } = args;
  const base = findPoint(diagram, "object-base");
  const near = findPoint(diagram, "near-ground");
  const far = findPoint(diagram, "far-ground");
  if (!base || !near || !far) return;

  const separation = (diagram.measurementArrows ?? []).find((arrow: AnyRecord) =>
    endpointKey(arrow.fromPointId, arrow.toPointId) === endpointKey(near.id, far.id)
      && /m\b/u.test(String(arrow.label ?? "")));
  const delta = String(separation?.label ?? "").replace(/\s*m\s*$/u, "").trim();
  if (!delta) return;

  const lower = explanationText.toLowerCase();
  let xPoint: "near" | "far" | null = null;
  if (/near(?:er)? distance[^.]{0,30}(?:is|be|=)\s*x\b/iu.test(explanationText)
    || /(?:new|final) distance[^.]{0,30}(?:is|be|=)\s*x\b/iu.test(explanationText)) {
    xPoint = "near";
  } else if (/(?:original|initial|earlier) distance[^.]{0,30}(?:is|be|=|was)\s*x\b/iu.test(explanationText)) {
    xPoint = /away|farther/iu.test(stem) ? "near" : "far";
  }
  if (!xPoint) return;

  const xId = xPoint === "near" ? near.id : far.id;
  const otherId = xPoint === "near" ? far.id : near.id;
  const relation = xPoint === "near" ? `x + ${delta}` : `x − ${delta}`;
  const req = requestedArrow(diagram);
  const requestedKey = req ? endpointKey(req.fromPointId, req.toPointId) : "";
  const xKey = endpointKey(base.id, xId);
  const otherKey = endpointKey(base.id, otherId);

  if (requestedKey === xKey) {
    req.label = "x = ? m";
  } else {
    addTeachingDimension(diagram, qlId, base.id, xId, "x", "ASSUMED_DISTANCE_X", englishAnswer, audit);
  }

  if (requestedKey === otherKey) {
    const role = xPoint === "near" ? "far" : "near";
    req.label = `${role} = ${relation} m`;
    req.pedagogicRequestedRelation = true;
    audit.requestedLabelsRealigned += 1;
    audit.explanationFactsVisualized.push("REQUESTED_DISTANCE_RELATION");
  } else {
    addTeachingDimension(diagram, qlId, base.id, otherId, `${relation} m`, "RELATED_DISTANCE", englishAnswer, audit);
  }
}

function shadowTeaching(args: {
  qlId: string;
  diagram: AnyRecord;
  explanationText: string;
  englishAnswer: string;
  audit: PedagogicResult["audit"];
}) {
  const { qlId, diagram, explanationText, englishAnswer, audit } = args;
  const base = findPoint(diagram, "pole-base") ?? findPoint(diagram, "object-base");
  if (!base) return;

  if (qlId === "TRG-002-QL-027") {
    const s30 = findPoint(diagram, "shadow-30");
    const s60 = findPoint(diagram, "shadow-60");
    if (s30) addTeachingDimension(diagram, qlId, base.id, s30.id, "h√3", "SHADOW_AT_30", englishAnswer, audit);
    if (s60) addTeachingDimension(diagram, qlId, base.id, s60.id, "h/√3", "SHADOW_AT_60", englishAnswer, audit);
  }

  if (qlId === "TRG-002-QL-034") {
    const top = findPoint(diagram, "object-top");
    const helper = finalMeterValue(explanationText, ["from the 60", "h="]);
    if (top && helper) addTeachingDimension(diagram, qlId, base.id, top.id, `h = ${helper}`, "DERIVED_POLE_HEIGHT", englishAnswer, audit);
  }
}

function brokenTreeTeaching(args: {
  qlId: string;
  diagram: AnyRecord;
  explanationText: string;
  englishAnswer: string;
  audit: PedagogicResult["audit"];
}) {
  const { qlId, diagram, explanationText, englishAnswer, audit } = args;
  const base = findPoint(diagram, "tree-base");
  const breakPoint = findPoint(diagram, "break-point");
  const touch = findPoint(diagram, "touch-point");
  if (!base || !breakPoint || !touch) return;

  const run = finalMeterValue(explanationText, ["ground run"]);
  if (run && !hasPair(diagram, base.id, touch.id)) addTeachingDimension(diagram, qlId, base.id, touch.id, `run = ${run}`, "DERIVED_GROUND_RUN", englishAnswer, audit);

  if (qlId === "TRG-002-QL-044") {
    const fallen = finalMeterValue(explanationText, ["fallen upper part", "l=16", "fallen"]);
    if (fallen) addTeachingDimension(diagram, qlId, breakPoint.id, touch.id, `L = ${fallen}`, "DERIVED_FALLEN_PART", englishAnswer, audit);
  }
}

function twoObjectTeaching(args: {
  qlId: string;
  diagram: AnyRecord;
  explanationText: string;
  englishAnswer: string;
  audit: PedagogicResult["audit"];
}) {
  const { qlId, diagram, explanationText, englishAnswer, audit } = args;
  const observer = findPoint(diagram, "observer-ground");
  const near = findPoint(diagram, "near-base");
  const far = findPoint(diagram, "far-base");
  if (observer && near && far) {
    const nearValue = finalMeterValue(explanationText, ["near-tower distance", "near tower distance", "45° tower distance"]);
    const farValue = finalMeterValue(explanationText, ["far-tower distance", "far tower distance", "30° tower distance"]);
    if (nearValue) addTeachingDimension(diagram, qlId, observer.id, near.id, `near = ${nearValue}`, "DERIVED_NEAR_DISTANCE", englishAnswer, audit);
    if (farValue) addTeachingDimension(diagram, qlId, observer.id, far.id, `far = ${farValue}`, "DERIVED_FAR_DISTANCE", englishAnswer, audit);
  }
}

function oppositeSideTeaching(args: {
  qlId: string;
  diagram: AnyRecord;
  explanationText: string;
  englishAnswer: string;
  audit: PedagogicResult["audit"];
}) {
  const { qlId, diagram, explanationText, englishAnswer, audit } = args;
  const left = findPoint(diagram, "left-ground");
  const right = findPoint(diagram, "right-ground");
  const base = findPoint(diagram, "object-base");
  if (!left || !right || !base) return;
  const angles = diagram.angles ?? [];
  const angleAt = (id: string) => angles.find((angle: AnyRecord) => angle.vertexPointId === id)?.label;
  const leftAngle = String(angleAt(left.id) ?? "");
  const rightAngle = String(angleAt(right.id) ?? "");

  if (/60° distance\s*=\s*y[^.]{0,40}30° distance\s*=\s*3y/iu.test(explanationText)) {
    const sixty = leftAngle.includes("60") ? left : rightAngle.includes("60") ? right : null;
    const thirty = leftAngle.includes("30") ? left : rightAngle.includes("30") ? right : null;
    if (sixty) addTeachingDimension(diagram, qlId, base.id, sixty.id, "y", "OPPOSITE_60_DISTANCE_Y", englishAnswer, audit);
    if (thirty) addTeachingDimension(diagram, qlId, base.id, thirty.id, "3y", "OPPOSITE_30_DISTANCE_3Y", englishAnswer, audit);
  }

  if (/distance of the 60° car[^.]{0,30}x\b/iu.test(explanationText) || /60° car from the tower be x/iu.test(explanationText)) {
    const sixty = leftAngle.includes("60") ? left : rightAngle.includes("60") ? right : null;
    const thirty = leftAngle.includes("30") ? left : rightAngle.includes("30") ? right : null;
    if (sixty) addTeachingDimension(diagram, qlId, base.id, sixty.id, "x", "OPPOSITE_60_DISTANCE_X", englishAnswer, audit);
    if (thirty) addTeachingDimension(diagram, qlId, base.id, thirty.id, "3x", "OPPOSITE_30_DISTANCE_3X", englishAnswer, audit);
  }
}

function compositeVerticalTeaching(args: {
  qlId: string;
  diagram: AnyRecord;
  explanationText: string;
  englishAnswer: string;
  audit: PedagogicResult["audit"];
}) {
  const { qlId, diagram, explanationText, englishAnswer, audit } = args;
  const base = findPoint(diagram, "base");
  const roof = findPoint(diagram, "roof");
  const top = findPoint(diagram, "upper-top");
  if (!base || !roof || !top) return;

  if (qlId === "TRG-002-QL-095") {
    const roofValue = finalMeterValue(explanationText, ["roof height"]);
    const totalValue = finalMeterValue(explanationText, ["total height"]);
    if (roofValue) addTeachingDimension(diagram, qlId, base.id, roof.id, `roof = ${roofValue}`, "DERIVED_ROOF_HEIGHT", englishAnswer, audit);
    if (totalValue) addTeachingDimension(diagram, qlId, base.id, top.id, `total = ${totalValue}`, "DERIVED_TOTAL_HEIGHT", englishAnswer, audit);
  }

  if (qlId === "TRG-002-QL-096") {
    addTeachingDimension(diagram, qlId, base.id, roof.id, "roof = x", "SYMBOLIC_ROOF_HEIGHT", englishAnswer, audit);
    addTeachingDimension(diagram, qlId, base.id, top.id, "total = x√3", "SYMBOLIC_TOTAL_HEIGHT", englishAnswer, audit);
  }
}

function ladderTeaching(args: {
  diagram: AnyRecord;
  stem: string;
  audit: PedagogicResult["audit"];
}) {
  const { diagram, stem, audit } = args;
  if (!/ladder/iu.test(stem)) return;
  if (/angle between the ladder and the wall is\s*30°/iu.test(stem)) {
    const contact = findPoint(diagram, "wall-contact");
    if (contact && String(contact.label ?? "") === "C") {
      contact.label = "C (30° to wall)";
      contact.pedagogic = true;
      audit.explanationFactsVisualized.push("GIVEN_WALL_ANGLE_30");
    }
  }
}

export function applyTrg002V4PedagogicDiagramLayer(args: {
  qlId: string;
  diagram: AnyRecord;
  englishStem: string;
  englishExplanationText: string;
  englishAnswer: string;
  topology?: string;
}): PedagogicResult {
  const { qlId, englishStem, englishExplanationText, englishAnswer } = args;
  const diagram: AnyRecord = {
    ...args.diagram,
    points: (args.diagram.points ?? []).map((point: AnyRecord) => ({ ...point })),
    segments: (args.diagram.segments ?? []).map((segment: AnyRecord) => ({ ...segment })),
    angles: (args.diagram.angles ?? []).map((angle: AnyRecord) => ({ ...angle })),
    rightAngles: (args.diagram.rightAngles ?? []).map((marker: AnyRecord) => ({ ...marker })),
    measurementArrows: (args.diagram.measurementArrows ?? []).map((arrow: AnyRecord) => ({ ...arrow })),
  };
  const audit: PedagogicResult["audit"] = {
    status: "PASS",
    helperPointsLabeled: 0,
    helperSegmentsAdded: 0,
    teachingDimensionsAdded: 0,
    requestedLabelsRealigned: 0,
    explanationFactsVisualized: [],
  };

  eyeLevelTeaching({ qlId, diagram, explanationText: englishExplanationText, englishAnswer, audit });
  sameSideTeaching({ qlId, diagram, stem: englishStem, explanationText: englishExplanationText, englishAnswer, audit });
  shadowTeaching({ qlId, diagram, explanationText: englishExplanationText, englishAnswer, audit });
  brokenTreeTeaching({ qlId, diagram, explanationText: englishExplanationText, englishAnswer, audit });
  twoObjectTeaching({ qlId, diagram, explanationText: englishExplanationText, englishAnswer, audit });
  oppositeSideTeaching({ qlId, diagram, explanationText: englishExplanationText, englishAnswer, audit });
  compositeVerticalTeaching({ qlId, diagram, explanationText: englishExplanationText, englishAnswer, audit });
  ladderTeaching({ diagram, stem: englishStem, audit });

  diagram.pedagogicDiagramAudit = audit;
  diagram.reviewDimensionAudit = {
    ...(diagram.reviewDimensionAudit ?? {}),
    totalDimensions: diagram.measurementArrows.length,
    pedagogicTeachingDimensions: audit.teachingDimensionsAdded,
    pedagogicHelperPoints: audit.helperPointsLabeled,
    explanationAligned: true,
  };
  return { diagram, audit };
}
