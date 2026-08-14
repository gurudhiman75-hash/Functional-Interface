import { TRG_002_DIAGRAM_STRATEGIES } from "./spatial";
import { generateLabelledTrg002Mvp48Question } from "./mvp-runtime-48-labelled";
import { TRG_002_MVP_VISUAL_REVIEW_14 } from "./mvp-visual-review-14";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

assert(TRG_002_MVP_VISUAL_REVIEW_14.length === 14, "MVP visual review must contain 14 representative strategies.");
const strategies = new Set(TRG_002_MVP_VISUAL_REVIEW_14.map((item) => item.strategy));
assert(strategies.size === 14, "MVP visual-review strategies must be unique.");
for (const strategy of TRG_002_DIAGRAM_STRATEGIES) assert(strategies.has(strategy), `MVP visual review is missing ${strategy}.`);

for (const item of TRG_002_MVP_VISUAL_REVIEW_14) {
  const question: any = generateLabelledTrg002Mvp48Question(item.qlId, item.seed);
  assert(question.validation.valid, `${item.qlId}: representative question is invalid.`);
  assert(question.solutionDiagram.strategy === item.strategy, `${item.qlId}: expected ${item.strategy}, got ${question.solutionDiagram.strategy}.`);
  assert(Array.isArray(question.solutionDiagram.rightAngles), `${item.qlId}: diagram contract must expose right-angle markers.`);
  assert(question.stemDiagram === undefined, `${item.qlId}: representative must remain solution-only by default.`);
  assert(question.solutionAnnotations.length >= 1, `${item.qlId}: representative solution diagram has no exact labels.`);
  assert(item.mustShow.length >= 3 && item.mustAvoid.length >= 2, `${item.qlId}: visual checklist is too weak.`);
}

const single: any = generateLabelledTrg002Mvp48Question("TRG-002-QL-001", "mvp-visual-right-angle-gate");
assert(single.solutionDiagram.angles.length >= 1, "SINGLE_ELEVATION representative must retain its elevation angle marker.");
assert(single.solutionDiagram.rightAngles.some((marker: any) => marker.vertexPointId === "object-base"), "SINGLE_ELEVATION representative must mark the tower-ground right angle.");

const ladder: any = generateLabelledTrg002Mvp48Question("TRG-002-QL-038", "mvp-visual-ladder-right-angle-gate");
assert(ladder.solutionDiagram.rightAngles.some((marker: any) => marker.vertexPointId === "wall-base"), "LADDER representative must mark the wall-ground right angle.");

const broken: any = generateLabelledTrg002Mvp48Question("TRG-002-QL-041", "mvp-visual-broken-gate");
assert(broken.canonicalSpatialState.points.some((point: any) => point.role === "BREAK_POINT"), "BROKEN_TREE representative lacks a canonical break point.");
assert(broken.canonicalSpatialState.points.some((point: any) => point.role === "TOUCH_POINT"), "BROKEN_TREE representative lacks a ground touch point.");
assert(broken.solutionDiagram.rightAngles.some((marker: any) => marker.vertexPointId === "tree-base"), "BROKEN_TREE representative must mark the stump-ground right angle.");

console.log("TRG-002 MVP visual-review gate targets all 14 strategies plus explicit angle/right-angle geometry markers.");
