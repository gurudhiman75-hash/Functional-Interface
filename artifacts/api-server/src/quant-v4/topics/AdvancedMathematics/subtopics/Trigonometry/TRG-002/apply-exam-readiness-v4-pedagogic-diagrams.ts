import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { applyTrg002V4PedagogicDiagramLayerFinal } from "./exam-readiness-v4-pedagogic-diagrams-final";
import { renderTrg002SolutionDiagramSvg } from "./exam-readiness-v4-review-svg";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
const jsonPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json");
const htmlPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.html");

function stringify(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current, 2);
}

function esc(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function explanationText(explanation: any) {
  return [
    explanation?.keyRule ?? "",
    ...(explanation?.steps ?? []).map((step: any) => step?.body ?? ""),
    explanation?.shortcut ?? "",
    ...(explanation?.traps ?? []),
  ].join(" ");
}

function compactSentence(value: unknown, max = 190) {
  const text = String(value ?? "").replace(/\s+/gu, " ").trim();
  if (!text) return "";
  const sentence = text.match(/^(.+?[.!?])(?:\s|$)/u)?.[1] ?? text;
  if (sentence.length <= max) return sentence;
  const clipped = sentence.slice(0, max - 1);
  const boundary = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, boundary > max * 0.65 ? boundary : clipped.length).trim()}…`;
}

function explanationSentences(values: unknown[]) {
  return values.flatMap((value) => String(value ?? "")
    .replace(/\s+/gu, " ")
    .trim()
    .split(/(?<=[.!?])\s*/u)
    .map((part) => part.trim())
    .filter(Boolean));
}

function hasRaisedEyeLevel(points: any[], segments: any[]) {
  const byId = new Map(points.map((point: any) => [String(point?.id ?? ""), point]));
  const groundLikeRoles = new Set(["OBSERVER_GROUND", "OBJECT_BASE", "GROUND"]);
  for (const segment of segments.filter((entry: any) => String(entry?.kind ?? "") === "EYE_LEVEL")) {
    const from = byId.get(String(segment?.fromPointId ?? ""));
    const to = byId.get(String(segment?.toPointId ?? ""));
    const eye = String(from?.role ?? "") === "OBSERVER_EYE" ? from : String(to?.role ?? "") === "OBSERVER_EYE" ? to : null;
    if (!eye) continue;
    const base = points.find((point: any) =>
      groundLikeRoles.has(String(point?.role ?? ""))
      && Math.abs(Number(point?.x) - Number(eye?.x)) < 1e-5
      && Number(point?.y) > Number(eye?.y) + 1e-5);
    if (base) return true;
  }
  return false;
}

function geometryTeachingCue(diagram: any, stem: string) {
  const segments = Array.isArray(diagram?.segments) ? diagram.segments : [];
  const points = Array.isArray(diagram?.points) ? diagram.points : [];
  const helperH = points.some((point: any) => /^H\d*$/u.test(String(point?.label ?? "")));
  const support = segments.some((segment: any) => ["LADDER", "WIRE"].includes(String(segment?.semanticKind ?? segment?.kind ?? "")));
  const sightLines = segments.filter((segment: any) => String(segment?.kind) === "SIGHT_LINE").length;
  const eyeLevel = hasRaisedEyeLevel(points, segments);
  const shadowSegments = segments.filter((segment: any) => String(segment?.kind ?? "").includes("SHADOW")).length;
  const shadowEndpoints = points.filter((point: any) => /shadow/i.test(String(point?.id ?? ""))).length;
  const changedShadow = shadowSegments >= 2 || shadowEndpoints >= 2;

  if (/shadow/iu.test(stem)) {
    if (changedShadow) {
      return "The vertical object and the two shadow endpoints form two right-triangle states; each sun angle belongs to its own shadow length.";
    }
    return "The vertical object and its shadow are the perpendicular legs of one right triangle; read the sun angle at the shadow tip.";
  }
  if (support) return "The wall/object is perpendicular to level ground and the ladder/wire is the hypotenuse of the working right triangle.";
  if (/depression/iu.test(stem) && eyeLevel) {
    return "Measure the depression angle from the dashed horizontal through the observer; its matching vertical drop and horizontal run are the triangle legs.";
  }
  if (eyeLevel) {
    return helperH
      ? "H is the true raised eye-level intersection made by the dashed horizontal through the observer; use the rise/drop measured from H in the tangent triangle."
      : "The dashed horizontal through the raised observer is the eye-level helper; use the rise/drop from that level rather than an unrelated full height.";
  }
  if (sightLines >= 2) return "Each blue sight line is a separate observation/state; the solution links those triangles through their shared height, level or ground relation.";
  return "Use the bold vertical and horizontal segments as the perpendicular legs of the working right triangle; the blue line is the line of sight.";
}

function teachingCues(row: any, diagram: any) {
  const explanation = row?.english?.explanation ?? {};
  const stepBodies = (explanation.steps ?? []).map((step: any) => String(step?.body ?? "").trim()).filter(Boolean);
  const sentences = explanationSentences(stepBodies);
  const workedEquation = sentences.find((sentence: string) =>
    /(?:tan|sin|cos|cot|⇒)/iu.test(sentence)
      || (/=/u.test(sentence) && !/^\s*let\b/iu.test(sentence)));
  const variableSetup = sentences.find((sentence: string) => /\blet\s/iu.test(sentence));
  const calculation = workedEquation ?? variableSetup ?? sentences[0] ?? explanation.shortcut ?? "";
  const candidates = [
    { kind: "GEOMETRY", text: geometryTeachingCue(diagram, String(row?.english?.stem ?? "")) },
    { kind: "RULE", text: compactSentence(explanation.keyRule) },
    { kind: "CALCULATION", text: compactSentence(calculation) },
  ];
  const seen = new Set<string>();
  return candidates.filter((cue) => {
    const text = String(cue.text ?? "").trim();
    if (!text || seen.has(text)) return false;
    seen.add(text);
    return true;
  });
}

function renderTeachingPanel(row: any, cues: Array<{ kind: string; text: string }>) {
  const items = cues.map((cue) => `<li style="margin:6px 0;line-height:1.45"><b>${esc(cue.kind === "GEOMETRY" ? "See" : cue.kind === "RULE" ? "Rule" : "Use")}:</b> ${esc(cue.text)}</li>`).join("");
  return `<div class="diagram-teaching-panel" data-pedagogic-panel="true" data-pedagogic-ql="${esc(row.qlId)}" style="margin:8px 0 14px;padding:10px 14px;border:1px solid #dbe3ec;border-radius:8px;background:#f8fafc;color:#1f2937"><div style="font-weight:700;margin-bottom:4px">Teaching cues</div><ul style="margin:0;padding-left:20px">${items}</ul></div>`;
}

const pack = JSON.parse(readFileSync(jsonPath, "utf8"));
let html = readFileSync(htmlPath, "utf8");
const rendered: string[] = [];
let helperPoints = 0;
let helperSegments = 0;
let teachingDimensions = 0;
let requestedRealignments = 0;
let explanationFacts = 0;
let explanationAligned = 0;
let teachingCuePanels = 0;
let teachingCueCount = 0;

for (const row of pack.records as any[]) {
  const result = applyTrg002V4PedagogicDiagramLayerFinal({
    qlId: row.qlId,
    diagram: row.solutionDiagram,
    englishStem: row.english.stem,
    englishExplanationText: explanationText(row.english.explanation),
    englishAnswer: row.english.answer,
    topology: row.hindi?.v4ExamReadiness?.spatialTopology,
  });

  const cues = teachingCues(row, result.diagram);
  if (cues.length < 2) throw new Error(`${row.qlId}: expected at least two explanation-derived teaching cues, got ${cues.length}.`);
  result.diagram.pedagogicTeachingCues = cues;
  result.diagram.pedagogicDiagramAudit.teachingCues = cues.length;
  result.diagram.pedagogicDiagramAudit.teachingPanelPresent = true;

  row.solutionDiagram = result.diagram;
  if (row.diagramEvidence?.solutionDiagram) row.diagramEvidence.solutionDiagram = result.diagram;
  helperPoints += result.audit.helperPointsLabeled;
  helperSegments += result.audit.helperSegmentsAdded;
  teachingDimensions += result.audit.teachingDimensionsAdded;
  requestedRealignments += result.audit.requestedLabelsRealigned;
  explanationFacts += result.audit.explanationFactsVisualized.length;
  if (result.diagram.reviewDimensionAudit?.explanationAligned === true) explanationAligned += 1;

  const figure = renderTrg002SolutionDiagramSvg({ ...result.diagram, qlId: row.qlId });
  const svg = figure.match(/<svg class="solution-diagram"[\s\S]*?<\/svg>/)?.[0];
  if (!svg) throw new Error(`${row.qlId}: pedagogic renderer did not emit a solution SVG.`);
  if (/\b(?:NaN|Infinity|-Infinity)\b/.test(svg)) throw new Error(`${row.qlId}: pedagogic diagram contains non-finite geometry.`);
  rendered.push(`${svg}${renderTeachingPanel(row, cues)}`);
  teachingCuePanels += 1;
  teachingCueCount += cues.length;
}

let index = 0;
html = html.replace(/<svg class="solution-diagram"[\s\S]*?<\/svg>/g, () => {
  const replacement = rendered[index++];
  if (!replacement) throw new Error(`Pedagogic SVG replacement underflow at ${index}.`);
  return replacement;
});
if (index !== 96 || rendered.length !== 96) throw new Error(`Expected 96 pedagogic SVG replacements, got replaced=${index} rendered=${rendered.length}.`);
if (teachingCuePanels !== 96) throw new Error(`Expected 96 pedagogic teaching panels, got ${teachingCuePanels}.`);

html = html.replace(
  "bold semantically-audited solution geometry with explicit dimensions outside the protected core diagram, canonical spatial state and diagram evidence. Numeric values are attached only to their intended geometric relationships; changed-shadow and support-triangle states are explicitly represented; answer-equivalent derived helpers are suppressed; sloped callout leaders are ordered without crossings.",
  "bold semantically-audited pedagogic solution geometry aligned to the worked explanation. Given data, assumed variables, helper points, eye-level intersections, derived rises/drops, changed-state relations and multi-position distance relations are visualized when they are load-bearing to the solution, while each diagram also carries a compact teaching strip explaining how to read the geometry and which solution relation to use.",
);

writeFileSync(jsonPath, stringify(pack), "utf8");
writeFileSync(htmlPath, html, "utf8");
console.log(`TRG002_V4_PEDAGOGIC_DIAGRAM_PASS qls=96 explanationAligned=${explanationAligned} helperPoints=${helperPoints} helperSegments=${helperSegments} teachingDimensions=${teachingDimensions} requestedRealignments=${requestedRealignments} explanationFactsVisualized=${explanationFacts} teachingCuePanels=${teachingCuePanels} teachingCues=${teachingCueCount}`);
