import { readFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
const jsonPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json");
const htmlPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.html");
const pack = JSON.parse(readFileSync(jsonPath, "utf8"));
const html = readFileSync(htmlPath, "utf8");

type AnyRecord = Record<string, any>;

if (pack.records.length !== 96) throw new Error(`Expected 96 pedagogic records, got ${pack.records.length}.`);

let cueCount = 0;
let geometryCues = 0;
let ruleOrCalculationCues = 0;
for (const row of pack.records as AnyRecord[]) {
  const diagram = row.solutionDiagram;
  const cues = diagram?.pedagogicTeachingCues ?? [];
  if (diagram?.pedagogicDiagramAudit?.status !== "PASS") throw new Error(`${row.qlId}: pedagogic diagram audit missing.`);
  if (diagram?.pedagogicDiagramAudit?.teachingPanelPresent !== true) throw new Error(`${row.qlId}: teaching panel flag missing.`);
  if (diagram?.pedagogicDiagramAudit?.teachingCues !== cues.length) throw new Error(`${row.qlId}: teaching cue audit count mismatch.`);
  if (cues.length < 2) throw new Error(`${row.qlId}: expected at least two teaching cues, got ${cues.length}.`);
  if (!cues.some((cue: AnyRecord) => cue.kind === "GEOMETRY")) throw new Error(`${row.qlId}: geometry-reading cue missing.`);
  if (!cues.some((cue: AnyRecord) => ["RULE", "CALCULATION"].includes(String(cue.kind)))) throw new Error(`${row.qlId}: solution-rule/calculation cue missing.`);
  if (cues.some((cue: AnyRecord) => !String(cue.text ?? "").trim() || /\b(?:undefined|null|NaN|Infinity)\b/u.test(String(cue.text)))) {
    throw new Error(`${row.qlId}: malformed pedagogic cue text.`);
  }
  cueCount += cues.length;
  geometryCues += cues.filter((cue: AnyRecord) => cue.kind === "GEOMETRY").length;
  ruleOrCalculationCues += cues.filter((cue: AnyRecord) => ["RULE", "CALCULATION"].includes(String(cue.kind))).length;
}

const panels = html.match(/data-pedagogic-panel="true"/g) ?? [];
const panelIds = [...html.matchAll(/data-pedagogic-ql="([^"]+)"/g)].map((match) => match[1]);
if (panels.length !== 96) throw new Error(`Expected 96 rendered teaching panels, got ${panels.length}.`);
if (new Set(panelIds).size !== 96) throw new Error(`Expected 96 unique teaching-panel QL ids, got ${new Set(panelIds).size}.`);
if (cueCount < 192) throw new Error(`Expected at least 192 teaching cues chapter-wide, got ${cueCount}.`);
if (geometryCues !== 96) throw new Error(`Expected exactly one geometry cue per diagram, got ${geometryCues}.`);
if (ruleOrCalculationCues < 96) throw new Error(`Expected rule/calculation guidance for every diagram, got ${ruleOrCalculationCues}.`);

const row = (id: string) => pack.records.find((record: AnyRecord) => record.qlId === id) as AnyRecord;
const cueText = (id: string) => (row(id).solutionDiagram.pedagogicTeachingCues ?? []).map((cue: AnyRecord) => String(cue.text)).join(" ");

if (!/shadow|sun ray|sun-angle/iu.test(cueText("TRG-002-QL-027"))) throw new Error("QL027: changed-shadow teaching cue missing.");
if (!/ladder|hypotenuse|perpendicular/iu.test(cueText("TRG-002-QL-037"))) throw new Error("QL037: ladder teaching cue missing.");
if (!/eye level|helper intersection|rise/iu.test(cueText("TRG-002-QL-076"))) throw new Error("QL076: eye-level teaching cue missing.");
if (!/shared height|ground relation|separate observation|road/iu.test(cueText("TRG-002-QL-079"))) throw new Error("QL079: two-target teaching cue missing.");
if (!/eye level|horizontal|rise|drop/iu.test(cueText("TRG-002-QL-088"))) throw new Error("QL088: elevation/depression split teaching cue missing.");
if (!/roof|total|mast|difference/iu.test(cueText("TRG-002-QL-095"))) throw new Error("QL095: composite-height teaching cue missing.");

console.log(`TRG002_V4_PEDAGOGIC_CUES_PASS qls=96 teachingPanels=96 teachingCues=${cueCount} geometryCues=${geometryCues} ruleOrCalculationCues=${ruleOrCalculationCues} explanationTeachingCoverage=96/96`);