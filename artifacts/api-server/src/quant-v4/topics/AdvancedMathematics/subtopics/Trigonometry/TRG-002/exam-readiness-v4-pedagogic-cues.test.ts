import { readFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
const jsonPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json");
const htmlPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.html");
const pack = JSON.parse(readFileSync(jsonPath, "utf8"));
const html = readFileSync(htmlPath, "utf8");

type AnyRecord = Record<string, any>;

function hasRaisedEyeLevel(points: AnyRecord[], segments: AnyRecord[]) {
  const byId = new Map(points.map((point: AnyRecord) => [String(point?.id ?? ""), point]));
  const groundLikeRoles = new Set(["OBSERVER_GROUND", "OBJECT_BASE", "GROUND"]);
  for (const segment of segments.filter((entry: AnyRecord) => String(entry?.kind ?? "") === "EYE_LEVEL")) {
    const from = byId.get(String(segment?.fromPointId ?? ""));
    const to = byId.get(String(segment?.toPointId ?? ""));
    const eye = String(from?.role ?? "") === "OBSERVER_EYE" ? from : String(to?.role ?? "") === "OBSERVER_EYE" ? to : null;
    if (!eye) continue;
    if (points.some((point: AnyRecord) =>
      groundLikeRoles.has(String(point?.role ?? ""))
      && Math.abs(Number(point?.x) - Number(eye?.x)) < 1e-5
      && Number(point?.y) > Number(eye?.y) + 1e-5)) return true;
  }
  return false;
}

if (pack.records.length !== 96) throw new Error(`Expected 96 pedagogic records, got ${pack.records.length}.`);

let cueCount = 0;
let geometryCues = 0;
let ruleCues = 0;
let calculationCues = 0;
let topologyCueViolations = 0;
for (const row of pack.records as AnyRecord[]) {
  const diagram = row.solutionDiagram;
  const cues = diagram?.pedagogicTeachingCues ?? [];
  if (diagram?.pedagogicDiagramAudit?.status !== "PASS") throw new Error(`${row.qlId}: pedagogic diagram audit missing.`);
  if (diagram?.pedagogicDiagramAudit?.teachingPanelPresent !== true) throw new Error(`${row.qlId}: teaching panel flag missing.`);
  if (diagram?.pedagogicDiagramAudit?.teachingCues !== cues.length) throw new Error(`${row.qlId}: teaching cue audit count mismatch.`);
  if (cues.length !== 3) throw new Error(`${row.qlId}: expected exactly three See/Rule/Use cues, got ${cues.length}.`);
  if (cues.filter((cue: AnyRecord) => cue.kind === "GEOMETRY").length !== 1) throw new Error(`${row.qlId}: expected exactly one geometry-reading cue.`);
  if (cues.filter((cue: AnyRecord) => cue.kind === "RULE").length !== 1) throw new Error(`${row.qlId}: expected exactly one rule cue.`);
  if (cues.filter((cue: AnyRecord) => cue.kind === "CALCULATION").length !== 1) throw new Error(`${row.qlId}: expected exactly one worked calculation cue.`);
  if (cues.some((cue: AnyRecord) => !String(cue.text ?? "").trim() || /\b(?:undefined|null|NaN|Infinity)\b/u.test(String(cue.text)))) {
    throw new Error(`${row.qlId}: malformed pedagogic cue text.`);
  }

  const geometryText = String(cues.find((cue: AnyRecord) => cue.kind === "GEOMETRY")?.text ?? "");
  const segments = diagram?.segments ?? [];
  const points = diagram?.points ?? [];
  const raisedEyeLevel = hasRaisedEyeLevel(points, segments);
  const shadowSegments = segments.filter((segment: AnyRecord) => String(segment?.kind ?? "").includes("SHADOW")).length;
  const shadowEndpoints = points.filter((point: AnyRecord) => /shadow/i.test(String(point?.id ?? ""))).length;
  const changedShadow = shadowSegments >= 2 || shadowEndpoints >= 2;

  if (/eye[- ]level|helper intersection|dashed horizontal through the observer|raised observer/iu.test(geometryText) && !raisedEyeLevel) {
    topologyCueViolations += 1;
    throw new Error(`${row.qlId}: eye-level teaching cue is not backed by a genuinely raised observer-eye construction.`);
  }
  if (/two shadow endpoints|separate sun angle|separate sun-angle|two right-triangle states/iu.test(geometryText) && !changedShadow) {
    topologyCueViolations += 1;
    throw new Error(`${row.qlId}: changed-shadow teaching cue is not backed by two shadow states.`);
  }

  cueCount += cues.length;
  geometryCues += cues.filter((cue: AnyRecord) => cue.kind === "GEOMETRY").length;
  ruleCues += cues.filter((cue: AnyRecord) => cue.kind === "RULE").length;
  calculationCues += cues.filter((cue: AnyRecord) => cue.kind === "CALCULATION").length;
}

const panels = html.match(/data-pedagogic-panel="true"/g) ?? [];
const panelIds = [...html.matchAll(/data-pedagogic-ql="([^"]+)"/g)].map((match) => match[1]);
if (panels.length !== 96) throw new Error(`Expected 96 rendered teaching panels, got ${panels.length}.`);
if (new Set(panelIds).size !== 96) throw new Error(`Expected 96 unique teaching-panel QL ids, got ${new Set(panelIds).size}.`);
if (cueCount !== 288) throw new Error(`Expected exactly 288 teaching cues chapter-wide, got ${cueCount}.`);
if (geometryCues !== 96) throw new Error(`Expected exactly one geometry cue per diagram, got ${geometryCues}.`);
if (ruleCues !== 96) throw new Error(`Expected exactly one rule cue per diagram, got ${ruleCues}.`);
if (calculationCues !== 96) throw new Error(`Expected exactly one calculation cue per diagram, got ${calculationCues}.`);
if (topologyCueViolations !== 0) throw new Error(`Expected zero cue/topology violations, got ${topologyCueViolations}.`);

const row = (id: string) => pack.records.find((record: AnyRecord) => record.qlId === id) as AnyRecord;
const cueText = (id: string) => (row(id).solutionDiagram.pedagogicTeachingCues ?? []).map((cue: AnyRecord) => String(cue.text)).join(" ");
const geometryCue = (id: string) => String((row(id).solutionDiagram.pedagogicTeachingCues ?? []).find((cue: AnyRecord) => cue.kind === "GEOMETRY")?.text ?? "");
const calculationCue = (id: string) => String((row(id).solutionDiagram.pedagogicTeachingCues ?? []).find((cue: AnyRecord) => cue.kind === "CALCULATION")?.text ?? "");

if (!/shadow|sun ray|sun angle|sun-angle/iu.test(cueText("TRG-002-QL-027"))) throw new Error("QL027: changed-shadow teaching cue missing.");
if (!/two shadow endpoints|two right-triangle states/iu.test(geometryCue("TRG-002-QL-027"))) throw new Error("QL027: geometry cue must explicitly describe the two shadow states.");
if (/two shadow endpoints|separate sun angle|separate sun-angle|two right-triangle states/iu.test(geometryCue("TRG-002-QL-025"))) throw new Error("QL025: single-shadow diagram must not claim multiple shadow states.");
if (/eye[- ]level|helper intersection|raised observer/iu.test(geometryCue("TRG-002-QL-001"))) throw new Error("QL001: ground-coincident observer must not be described as a raised eye-level construction.");
if (!/(?:1\s*\/\s*√3\s*=\s*h\s*\/\s*15|tan\s*30)/iu.test(calculationCue("TRG-002-QL-029"))) throw new Error(`QL029: worked trigonometric equation missing from calculation cue: ${calculationCue("TRG-002-QL-029")}`);
if (/^\s*let\b/iu.test(calculationCue("TRG-002-QL-060"))) throw new Error(`QL060: variable setup incorrectly selected as worked equation: ${calculationCue("TRG-002-QL-060")}`);
if (!/(?:h\s*=\s*x√3|x\s*\+\s*y\s*=\s*32|tan\s*60)/iu.test(calculationCue("TRG-002-QL-060"))) throw new Error(`QL060: worked boat-distance equation missing from calculation cue: ${calculationCue("TRG-002-QL-060")}`);
if (!/(?:tan\s*45[^=]*=\s*1|h\s*=\s*x.*h\s*=\s*y)/iu.test(calculationCue("TRG-002-QL-078"))) throw new Error(`QL078: worked opposite-side equation missing from calculation cue: ${calculationCue("TRG-002-QL-078")}`);
if (!/ladder|hypotenuse|perpendicular/iu.test(cueText("TRG-002-QL-037"))) throw new Error("QL037: ladder teaching cue missing.");
if (!/eye level|eye-level|helper intersection|rise/iu.test(cueText("TRG-002-QL-076"))) throw new Error("QL076: eye-level teaching cue missing.");
if (!/shared height|ground relation|separate observation|road/iu.test(cueText("TRG-002-QL-079"))) throw new Error("QL079: two-target teaching cue missing.");
if (!/eye level|eye-level|horizontal|rise|drop/iu.test(cueText("TRG-002-QL-088"))) throw new Error("QL088: elevation/depression split teaching cue missing.");
if (!/roof|total|mast|difference/iu.test(cueText("TRG-002-QL-095"))) throw new Error("QL095: composite-height teaching cue missing.");

console.log(`TRG002_V4_PEDAGOGIC_CUES_PASS qls=96 teachingPanels=96 teachingCues=288 geometryCues=96 ruleCues=96 calculationCues=96 topologyCueViolations=0 workedEquationCues=green explanationTeachingCoverage=96/96`);
