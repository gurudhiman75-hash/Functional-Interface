import { Buffer } from "node:buffer";
import { TRG_002_MVP_48_IDS } from "./mvp-48-registry";
import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";
import {
  buildTrg002ExamTreeExplanation,
  serializeTrg002ExamTreeSolutionDiagram,
  TRG_002_EXAMTREE_DIRECTIVE_PREFIX,
  TRG_002_EXAMTREE_MAX_ENCODED_LENGTH,
} from "./examtree-solution-directive";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function decodeDirective(directive: string) {
  assert(directive.startsWith(TRG_002_EXAMTREE_DIRECTIVE_PREFIX), "Unexpected TRG-002 ExamTree directive prefix.");
  assert(directive.endsWith("]]"), "TRG-002 ExamTree directive must close with ]].");
  const encoded = directive.slice(TRG_002_EXAMTREE_DIRECTIVE_PREFIX.length, -2);
  assert(encoded.length <= TRG_002_EXAMTREE_MAX_ENCODED_LENGTH, "TRG-002 ExamTree directive exceeds the student parser limit.");
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
  return JSON.parse(Buffer.from(base64, "base64").toString("utf8")) as any;
}

for (const [index, qlId] of TRG_002_MVP_48_IDS.entries()) {
  const question: any = generateFinalEditorialTrg002Mvp48Question(
    qlId,
    `trg002-examtree-wrapper-${String(index + 1).padStart(2, "0")}`,
  );
  assert(question.validation.valid, `${qlId}: final question is invalid before ExamTree serialization.`);
  assert(question.solutionDiagram, `${qlId}: solution diagram is required before ExamTree serialization.`);

  const directive = serializeTrg002ExamTreeSolutionDiagram(question);
  const payload = decodeDirective(directive);
  assert(payload.version === 1, `${qlId}: wrapper payload version mismatch.`);
  assert(payload.qlId === qlId, `${qlId}: wrapper payload QL binding mismatch.`);
  assert(JSON.stringify(payload.diagram) === JSON.stringify(question.solutionDiagram), `${qlId}: serialized diagram changed during the ExamTree bridge.`);
  assert(JSON.stringify(payload.annotations ?? []) === JSON.stringify(question.solutionAnnotations ?? []), `${qlId}: serialized solution annotations changed during the ExamTree bridge.`);

  const explanation = buildTrg002ExamTreeExplanation(question);
  assert(explanation.includes(directive), `${qlId}: student explanation must carry its solution directive.`);
  assert(!question.stem.includes("EXAMTREE_TRIG_HEIGHTS_SVG_V1"), `${qlId}: solution directive leaked into the question stem.`);
}

const ql015: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-015", "trg002-examtree-wrapper-ql015");
const ql015Payload = decodeDirective(serializeTrg002ExamTreeSolutionDiagram(ql015));
assert(
  !ql015Payload.diagram.segments.some((segment: any) => segment.id.startsWith("depression-height-transfer-")),
  "QL-015: redundant lower height-transfer segment must stay absent in ExamTree.",
);
assert(
  ql015Payload.diagram.segments.some((segment: any) => segment.id.startsWith("depression-drop-")),
  "QL-015: useful vertical depression drop must reach ExamTree.",
);
assert(
  ql015Payload.diagram.measurementArrows.length === 2,
  "QL-015: two double-headed height spans must reach ExamTree (four visible arrowheads in the renderer).",
);
assert(
  ql015Payload.diagram.measurementArrows.every((arrow: any) => arrow.side === ql015Payload.diagram.measurementArrows[0]?.side),
  "QL-015: split height spans must remain on one external side of the taller vertical.",
);

console.log(`TRG-002 ExamTree solution bridge locked for ${TRG_002_MVP_48_IDS.length} QLs.`);
