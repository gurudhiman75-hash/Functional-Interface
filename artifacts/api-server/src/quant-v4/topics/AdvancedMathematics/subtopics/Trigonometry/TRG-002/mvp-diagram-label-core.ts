import { exactToNumber, formatExactPlain, subtractExact } from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";

export type MvpLabelRole = "GIVEN" | "TARGET_SOLVED" | "MOVEMENT" | "EYE_HEIGHT";
export type MvpLabelPlacement = "ABOVE" | "BELOW" | "LEFT" | "RIGHT";
export type MvpLabelSource =
  | { kind: "ANSWER" }
  | { kind: "OBJECT_HEIGHT"; objectId: string }
  | { kind: "HORIZONTAL_DISTANCE"; fromPointId: string; toPointId: string }
  | { kind: "MOVEMENT_DISTANCE"; movementId: string }
  | { kind: "EYE_HEIGHT"; observerId: string };
export interface MvpLabelPlan { id: string; role: MvpLabelRole; fromPointId: string; toPointId: string; source: MvpLabelSource; placement: MvpLabelPlacement; symbol?: string; }
export interface MvpResolvedLabel extends MvpLabelPlan { label: string; }
export type MvpLabelPlanMap = Readonly<Record<string, readonly MvpLabelPlan[]>>;

function findPoint(question: any, id: string) {
  const found = question.canonicalSpatialState.points.find((item: any) => item.id === id);
  if (!found) throw new Error(`${question.qlId}: missing diagram-label point ${id}.`);
  return found;
}
function findObject(question: any, id: string) {
  const found = question.canonicalSpatialState.verticalObjects.find((item: any) => item.id === id);
  if (!found) throw new Error(`${question.qlId}: missing diagram-label object ${id}.`);
  return found;
}
function positiveDifference(a: ExactTrigNumber, b: ExactTrigNumber) {
  return exactToNumber(a) >= exactToNumber(b) ? subtractExact(a, b) : subtractExact(b, a);
}
function lengthText(question: any, value: ExactTrigNumber) {
  return `${formatExactPlain(value)} ${question.canonicalSpatialState.metadata.units}`;
}
function resolve(question: any, source: MvpLabelSource) {
  if (source.kind === "ANSWER") return question.answer;
  if (source.kind === "OBJECT_HEIGHT") return lengthText(question, findObject(question, source.objectId).height);
  if (source.kind === "HORIZONTAL_DISTANCE") return lengthText(question, positiveDifference(findPoint(question, source.fromPointId).x, findPoint(question, source.toPointId).x));
  if (source.kind === "MOVEMENT_DISTANCE") {
    const movement = question.canonicalSpatialState.movements.find((item: any) => item.id === source.movementId);
    if (!movement) throw new Error(`${question.qlId}: missing diagram-label movement ${source.movementId}.`);
    return lengthText(question, movement.distance);
  }
  const observer = question.canonicalSpatialState.observers.find((item: any) => item.id === source.observerId);
  if (!observer) throw new Error(`${question.qlId}: missing diagram-label observer ${source.observerId}.`);
  return lengthText(question, observer.eyeHeight);
}

export function resolveMvpDiagramLabels(question: any, plans: MvpLabelPlanMap) {
  const plan = plans[question.qlId];
  if (!plan) throw new Error(`${question.qlId}: missing MVP diagram-label plan.`);
  const pointIds = new Set<string>(question.canonicalSpatialState.points.map((item: any) => item.id));
  const annotations: MvpResolvedLabel[] = plan.map((entry) => ({ ...entry, label: entry.symbol ? `${entry.symbol} = ${resolve(question, entry.source)}` : resolve(question, entry.source) }));
  const checks = [
    { name: "LABEL_IDS_UNIQUE", passed: new Set(annotations.map((item) => item.id)).size === annotations.length, message: "Diagram-label IDs are unique." },
    { name: "LABEL_ENDPOINTS", passed: annotations.every((item) => pointIds.has(item.fromPointId) && pointIds.has(item.toPointId)), message: "Diagram labels resolve canonical endpoints." },
    { name: "LABEL_TEXT", passed: annotations.every((item) => item.label.trim().length > 0), message: "Diagram labels contain exact text." },
    { name: "TARGET_FROM_ANSWER", passed: annotations.every((item) => item.role !== "TARGET_SOLVED" || item.source.kind === "ANSWER"), message: "Solved labels use exact answer authority." },
  ];
  return { annotations, validation: { valid: checks.every((check) => check.passed), checks } };
}
