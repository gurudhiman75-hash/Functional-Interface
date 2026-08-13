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
  assert(question.stemDiagram === undefined, `${item.qlId}: representative must remain solution-only by default.`);
  assert(question.solutionAnnotations.length >= 1, `${item.qlId}: representative solution diagram has no exact labels.`);
  assert(item.mustShow.length >= 3 && item.mustAvoid.length >= 2, `${item.qlId}: visual checklist is too weak.`);
}

const broken: any = generateLabelledTrg002Mvp48Question("TRG-002-QL-041", "mvp-visual-broken-gate");
assert(broken.canonicalSpatialState.points.some((point: any) => point.role === "BREAK_POINT"), "BROKEN_TREE representative lacks a canonical break point.");
assert(broken.canonicalSpatialState.points.some((point: any) => point.role === "TOUCH_POINT"), "BROKEN_TREE representative lacks a ground touch point.");

console.log("TRG-002 MVP visual-review gate targets one labelled solution diagram for every one of the 14 locked spatial strategies.");
