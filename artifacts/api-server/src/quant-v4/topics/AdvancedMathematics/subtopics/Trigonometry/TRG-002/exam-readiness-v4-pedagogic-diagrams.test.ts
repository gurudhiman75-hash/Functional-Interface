import { readFileSync } from "node:fs";
import { join } from "node:path";

type AnyRecord = Record<string, any>;

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
const pack = JSON.parse(readFileSync(join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json"), "utf8"));

function row(id: string) {
  const value = pack.records.find((record: AnyRecord) => record.qlId === id);
  if (!value) throw new Error(`Missing ${id}.`);
  return value as AnyRecord;
}

function dimensions(id: string) {
  return row(id).solutionDiagram.measurementArrows as AnyRecord[];
}

function hasDimension(id: string, label: string, from?: string, to?: string) {
  return dimensions(id).some((arrow) => {
    if (String(arrow.label) !== label) return false;
    if (!from || !to) return true;
    return new Set([arrow.fromPointId, arrow.toPointId]).size === 2
      && [arrow.fromPointId, arrow.toPointId].includes(from)
      && [arrow.fromPointId, arrow.toPointId].includes(to);
  });
}

function hasDimensionMatching(id: string, pattern: RegExp, from?: string, to?: string) {
  return dimensions(id).some((arrow) => {
    if (!pattern.test(String(arrow.label))) return false;
    if (!from || !to) return true;
    return [arrow.fromPointId, arrow.toPointId].includes(from) && [arrow.fromPointId, arrow.toPointId].includes(to);
  });
}

if (pack.records.length !== 96) throw new Error(`Expected 96 records, got ${pack.records.length}.`);
let helperPoints = 0;
let teachingDimensions = 0;
let requestedRealignments = 0;
let diagramsWithTeachingFacts = 0;

for (const record of pack.records as AnyRecord[]) {
  const diagram = record.solutionDiagram;
  const audit = diagram.pedagogicDiagramAudit;
  if (!audit || audit.status !== "PASS") throw new Error(`${record.qlId}: pedagogic audit missing.`);
  if (diagram.reviewDimensionAudit?.explanationAligned !== true) throw new Error(`${record.qlId}: explanation-aligned flag missing.`);
  if (audit.finalAnswerLeakCount !== 0) throw new Error(`${record.qlId}: pedagogic final-answer leak detected.`);
  helperPoints += Number(audit.helperPointsLabeled ?? 0);
  teachingDimensions += Number(audit.teachingDimensionsAdded ?? 0);
  requestedRealignments += Number(audit.requestedLabelsRealigned ?? 0);
  if ((audit.explanationFactsVisualized ?? []).length > 0) diagramsWithTeachingFacts += 1;

  const requested = (diagram.measurementArrows ?? []).find((arrow: AnyRecord) => String(arrow.kind ?? "").includes("REQUESTED"));
  if (requested && !/[?]|x\s*[+−-]|far\s*=|near\s*=/u.test(String(requested.label))) {
    throw new Error(`${record.qlId}: requested dimension lost its unsolved/relation form (${requested.label}).`);
  }
}

if (helperPoints < 12) throw new Error(`Expected broad helper-point labeling, got ${helperPoints}.`);
if (teachingDimensions < 24) throw new Error(`Expected broad teaching-dimension coverage, got ${teachingDimensions}.`);
if (diagramsWithTeachingFacts < 22) throw new Error(`Expected at least 22 diagrams with explicit explanation facts, got ${diagramsWithTeachingFacts}.`);

// Changed-shadow reasoning must be visible, not only the final geometry.
if (!hasDimension("TRG-002-QL-027", "h√3", "pole-base", "shadow-30")) throw new Error("QL027: 30° shadow h√3 missing.");
if (!hasDimension("TRG-002-QL-027", "h/√3", "pole-base", "shadow-60")) throw new Error("QL027: 60° shadow h/√3 missing.");
if (!hasDimension("TRG-002-QL-034", "h = 5√3 m", "object-base", "object-top")) throw new Error("QL034: derived pole height from the first shadow state is missing.");

// A ladder angle stated with the wall and then complemented in the solution must show both ideas.
const q37 = row("TRG-002-QL-037").solutionDiagram;
if (!q37.points.some((point: AnyRecord) => String(point.label) === "C (30° to wall)")) throw new Error("QL037: given 30° wall angle is not visible at the contact point.");
if (!q37.angles.some((angle: AnyRecord) => angle.label === "60°" && angle.vertexPointId === "ladder-base")) throw new Error("QL037: derived 60° ground angle missing.");

// Same-side two-position algebra must map solved helper x and x+d to the actual ground segments.
if (!hasDimensionMatching("TRG-002-QL-049", /^x = 10 m$/, "object-base", "near-ground")) throw new Error("QL049: solved near helper x=10 m missing.");
if (!hasDimension("TRG-002-QL-049", "x + 20 m", "object-base", "far-ground")) throw new Error("QL049: far distance x+20 missing.");
const q51Requested = dimensions("TRG-002-QL-051").find((arrow) => String(arrow.kind).includes("REQUESTED"));
if (q51Requested?.label !== "far = x + 8 m") throw new Error(`QL051: requested far distance must be related to the assumed near x, got ${q51Requested?.label}.`);
if (!hasDimensionMatching("TRG-002-QL-051", /^x = 4 \+ 4√3 m$/, "object-base", "near-ground")) throw new Error("QL051: solved nearer helper x missing.");
if (!hasDimensionMatching("TRG-002-QL-061", /^x = 10 m$/, "object-base", "near-ground")) throw new Error("QL061: solved original distance x=10 m missing.");
if (!hasDimension("TRG-002-QL-061", "x + 20 m", "object-base", "far-ground")) throw new Error("QL061: walked-away distance x+20 missing.");
if (!hasDimension("TRG-002-QL-066", "x + 40 m", "object-base", "far-ground")) throw new Error("QL066: speed/time-derived x+40 initial distance missing.");

// Eye-level corrections must expose the helper intersection and the rise/drop used by tangent.
for (const [id, expected] of [["TRG-002-QL-073", "rise = 20 m"], ["TRG-002-QL-076", "rise = 15 m"], ["TRG-002-QL-077", "rise = 7√3 m"], ["TRG-002-QL-087", "rise = 24 m"]] as const) {
  const diagram = row(id).solutionDiagram;
  if (!diagram.points.some((point: AnyRecord) => String(point.label).startsWith("H"))) throw new Error(`${id}: eye-level helper point H missing.`);
  if (!diagram.measurementArrows.some((arrow: AnyRecord) => arrow.label === expected)) throw new Error(`${id}: explanation-critical ${expected} missing.`);
}

// Dual elevation/depression must visibly split the target around the eye-level helper and expose derived horizontal distance.
const q88 = row("TRG-002-QL-088").solutionDiagram;
if (!q88.points.some((point: AnyRecord) => String(point.label).startsWith("H"))) throw new Error("QL088: common eye-level helper H missing.");
if (!q88.measurementArrows.some((arrow: AnyRecord) => arrow.label === "rise = 10 m")) throw new Error("QL088: 10 m rise above eye level missing.");
if (!q88.measurementArrows.some((arrow: AnyRecord) => arrow.label === "drop = 10 m")) throw new Error("QL088: 10 m depression drop missing.");
if (!q88.measurementArrows.some((arrow: AnyRecord) => arrow.label === "d = 10 m")) throw new Error("QL088: derived 10 m horizontal distance missing.");

// Observer-between-targets and opposite-side systems must show the split used in the equations.
if (!hasDimensionMatching("TRG-002-QL-079", /^x = 8 m$/)) throw new Error("QL079: solved 60° distance x=8 m missing.");
if (!hasDimension("TRG-002-QL-079", "32 − x")) throw new Error("QL079: complementary road distance 32−x missing.");
if (!hasDimensionMatching("TRG-002-QL-082", /^y = 10 m$/)) throw new Error("QL082: solved 60° distance y=10 m missing.");
if (!hasDimension("TRG-002-QL-082", "3y")) throw new Error("QL082: 30° distance 3y missing.");
if (!hasDimension("TRG-002-QL-078", "x") || !hasDimension("TRG-002-QL-078", "y")) throw new Error("QL078: opposite-side x/y split missing.");

// Composite vertical problems must show the two vertical quantities that are subtracted.
if (!hasDimension("TRG-002-QL-095", "roof = 8 m", "base", "roof")) throw new Error("QL095: derived roof height 8 m missing.");
if (!hasDimension("TRG-002-QL-095", "total = 8√3 m", "base", "upper-top")) throw new Error("QL095: derived total height 8√3 m missing.");
if (!hasDimension("TRG-002-QL-096", "roof = x", "base", "roof")) throw new Error("QL096: symbolic roof=x missing.");
if (!hasDimension("TRG-002-QL-096", "total = x√3", "base", "upper-top")) throw new Error("QL096: symbolic total=x√3 missing.");

console.log(`TRG002_V4_PEDAGOGIC_ALIGNMENT_PASS qls=96 helperPoints=${helperPoints} teachingDimensions=${teachingDimensions} requestedRealignments=${requestedRealignments} diagramsWithTeachingFacts=${diagramsWithTeachingFacts} dualStateHelpers=green variableConsistency=green`);
