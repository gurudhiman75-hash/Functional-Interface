import type { SpatialNode, SpatialScene } from "./types";

const QUANTUM = 2;

function q(value: number): number {
  return Math.round(value / QUANTUM) * QUANTUM;
}

function fillState(node: SpatialNode): string {
  const fill = node.style?.fill?.trim().toLowerCase();
  return fill && fill !== "none" && fill !== "transparent" ? "filled" : "outline";
}

function nodeSignature(node: SpatialNode): string {
  const style = `${fillState(node)}:${q(node.style?.strokeWidth ?? 1)}`;
  switch (node.kind) {
    case "line":
      return `line:${q(node.start.x)},${q(node.start.y)}>${q(node.end.x)},${q(node.end.y)}:${style}`;
    case "circle":
      return `circle:${q(node.center.x)},${q(node.center.y)}:r${q(node.radius)}:${style}`;
    case "polygon":
    case "polyline":
      return `${node.kind}:${node.points.map((point) => `${q(point.x)},${q(point.y)}`).join(";")}:${style}`;
    case "arc":
      return `arc:${q(node.center.x)},${q(node.center.y)}:r${q(node.radius)}:${q(node.startAngleDeg)}>${q(node.endAngleDeg)}:${node.sweep}:${style}`;
  }
}

export function spatialPerceptualSignatureV2(scene: SpatialScene): string {
  return scene.nodes
    .filter((node) => node.style?.opacity !== 0)
    .map(nodeSignature)
    .sort()
    .join("|");
}

export function validateSpatialPerceptualOptionUniquenessV2(scenes: readonly SpatialScene[]): {
  ok: boolean;
  signatures: string[];
  duplicatePairs: Array<[number, number]>;
} {
  const signatures = scenes.map(spatialPerceptualSignatureV2);
  const duplicatePairs: Array<[number, number]> = [];
  for (let left = 0; left < signatures.length; left += 1) {
    for (let right = left + 1; right < signatures.length; right += 1) {
      if (signatures[left] === signatures[right]) duplicatePairs.push([left, right]);
    }
  }
  return { ok: duplicatePairs.length === 0, signatures, duplicatePairs };
}

export function validateLearnerVisibleExplanationV2(parts: readonly string[]): {
  ok: boolean;
  errors: string[];
} {
  const text = parts.join(" ");
  const errors: string[] = [];
  if (/\bcomponent\s+[a-d]\b/i.test(text) || /\bcomp-[a-z0-9-]+\b/i.test(text)) {
    errors.push("INTERNAL_COMPONENT_LABEL_VISIBLE_TO_LEARNER");
  }
  if (/\b(?:in\s+)?the\s+first\s+three\s+(?:figures|options)\b/i.test(text)) {
    errors.push("DELIVERY_ORDER_ASSUMPTION_IN_EXPLANATION");
  }
  if (!/(hook|line|triangle|circle|square|diamond|pentagon|dot|arrow|shape|figure|pair|box|symbol|marker)/i.test(text)) {
    errors.push("NO_VISIBLE_FEATURE_NAMED");
  }
  if (!/(option|select|choose|correct|odd|next|figure)/i.test(text)) {
    errors.push("NO_LEARNER_DECISION_LANGUAGE");
  }
  return { ok: errors.length === 0, errors };
}

function isThreeToOne(values: readonly string[]): boolean {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.values()].sort((a, b) => a - b).join(",") === "1,3";
}

export interface SpatialFclCueAuditV2 {
  decisiveCue: string;
  cues: Record<string, readonly [string, string, string, string]>;
}

export function validateSpatialFclCueAuditV2(audit: SpatialFclCueAuditV2): {
  ok: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const decisive = audit.cues[audit.decisiveCue];
  if (!decisive) {
    errors.push("DECISIVE_CUE_MISSING");
    return { ok: false, errors };
  }
  if (!(decisive[0] === decisive[1] && decisive[1] === decisive[2] && decisive[3] !== decisive[0])) {
    errors.push("DECISIVE_CUE_NOT_CANONICAL_3_TO_1");
  }
  for (const [cue, values] of Object.entries(audit.cues)) {
    if (cue === audit.decisiveCue) continue;
    if (isThreeToOne(values)) errors.push(`COMPETING_3_TO_1_CUE:${cue}`);
  }
  return { ok: errors.length === 0, errors };
}
