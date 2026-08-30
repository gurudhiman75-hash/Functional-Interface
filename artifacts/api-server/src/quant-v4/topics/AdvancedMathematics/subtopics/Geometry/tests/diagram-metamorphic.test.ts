import { diagramSemanticFingerprint, transformDiagramLayout, type GeoDiagramModel } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const model: GeoDiagramModel = {
  points: [
    { id: "A", label: "A", x: 0, y: 0 },
    { id: "B", label: "B", x: 80, y: 0 },
    { id: "C", label: "C", x: 30, y: 50 },
  ],
  segments: [
    { id: "AB", fromPointId: "A", toPointId: "B" },
    { id: "BC", fromPointId: "B", toPointId: "C" },
    { id: "CA", fromPointId: "C", toPointId: "A" },
  ],
  circles: [], angleMarks: [], rightAngleMarks: [], equalLengthMarks: [], parallelMarks: [], arcs: [], labels: [],
  disclosure: "STEM", notToScale: true,
};
const rotated = transformDiagramLayout(model, { rotateDegrees: 90, translateX: 100, scale: 1.5 });
assert(diagramSemanticFingerprint(rotated) === diagramSemanticFingerprint(model), "Layout rotation/scale changed diagram semantics");
pass("diagram-metamorphic");
