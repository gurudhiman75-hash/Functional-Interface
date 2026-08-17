import { degree } from "../../foundation/angle";
import { exactInteger } from "../../foundation/exact";
import { buildSameSideMovingState } from "./builders";
import { buildTrg002DiagramSpec } from "./diagram";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const closer = buildSameSideMovingState({
  farAngle: degree(30),
  nearAngle: degree(60),
  movementTowardObject: exactInteger(20),
  units: "m",
});
const closerDiagram = buildTrg002DiagramSpec(closer);
const closerMovement = closerDiagram.segments.find((segment) => segment.id === "movement-movement-1");
assert(closerMovement, "Closer diagram must expose canonical movement segment.");
assert(closerMovement.kind === "MOVEMENT", "Movement must be first-class diagram semantics rather than generic AUXILIARY geometry.");
assert(closerMovement.fromPointId === "far-ground" && closerMovement.toPointId === "near-ground", "Closer movement segment must point from far to near observation point.");

const farther = {
  ...closer,
  movements: closer.movements.map((movement) => ({
    ...movement,
    observerId: "observer-near",
    fromGroundPointId: "near-ground",
    toGroundPointId: "far-ground",
    direction: "FARTHER" as const,
  })),
  diagramStrategy: "OBSERVER_MOVES_FARTHER" as const,
};
const fartherDiagram = buildTrg002DiagramSpec(farther);
const fartherMovement = fartherDiagram.segments.find((segment) => segment.id === "movement-movement-1");
assert(fartherMovement, "Farther diagram must expose canonical movement segment.");
assert(fartherMovement.kind === "MOVEMENT", "Farther movement must retain first-class movement semantics.");
assert(fartherMovement.fromPointId === "near-ground" && fartherMovement.toPointId === "far-ground", "Farther movement segment must point from near to far observation point.");

console.log("TRG-002 movement diagram gate targets directional MOVEMENT segments for both closer and farther scenarios.");
