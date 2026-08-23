import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { applyTrg002V4PedagogicDiagramLayerFinal } from "./exam-readiness-v4-pedagogic-diagrams-final";
import { renderTrg002SolutionDiagramSvg } from "./exam-readiness-v4-review-svg";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
const jsonPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json");
const htmlPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.html");
const REVIEW_PADDING = 240;

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

function collectExplanationStrings(value: unknown, out: string[] = []) {
  if (typeof value === "string") {
    const text = value.trim();
    if (text) out.push(text);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectExplanationStrings(item, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (key === "title") continue;
      collectExplanationStrings(item, out);
    }
  }
  return out;
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

function isWorkedEquation(sentence: string) {
  // Match actual trig tokens such as tan30°, sin45° or cos(θ). A bare
  // substring check is unsafe because words such as "distance" contain "tan".
  const trigToken = /\b(?:tan|sin|cos|cot)(?=\s*(?:\d|°|θ|\())/iu;
  return trigToken.test(sentence)
    || /⇒/u.test(sentence)
    || (/=/u.test(sentence) && !/^\s*let\b/iu.test(sentence));
}

function teachingCues(row: any, diagram: any) {
  const explanation = row?.english?.explanation ?? {};
  // Prefer the worked solution steps over rule/shortcut text. This prevents a
  // key rule containing "tan...=" from masking the actual equation the learner
  // should use in the worked solution.
  const stepSentences = explanationSentences(collectExplanationStrings(explanation.steps ?? []));
  const supplementalSentences = explanationSentences(collectExplanationStrings({
    shortcut: explanation.shortcut,
    traps: explanation.traps,
    keyRule: explanation.keyRule,
  }));
  const workedEquation = stepSentences.find(isWorkedEquation)
    ?? supplementalSentences.find(isWorkedEquation);
  const variableSetup = stepSentences.find((sentence: string) => /\blet\s/iu.test(sentence));
  const calculation = workedEquation
    ?? variableSetup
    ?? stepSentences[0]
    ?? supplementalSentences[0]
    ?? "";
  const candidates = [
    { kind: "GEOMETRY", text: geometryTeachingCue(diagram, String(row?.english?.stem ?? "")) },
    { kind: "RULE", text: compactSentence(explanation.keyRule) },
    { kind: "CALCULATION", text: compactSentence(calculation) },
  ];
  const seen = new Set<string>();
  return candidates.filter((cue) => {
    const text = String(cue.text ?? "").trim();
    const identity = `${cue.kind}\u0000${text}`;
    if (!text || seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

function renderTeachingPanel(row: any, cues: Array<{ kind: string; text: string }>) {
  const items = cues.map((cue) => `<li style="margin:6px 0;line-height:1.45"><b>${esc(cue.kind === "GEOMETRY" ? "See" : cue.kind === "RULE" ? "Rule" : "Use")}:</b> ${esc(cue.text)}</li>`).join("");
  return `<div class="diagram-teaching-panel" data-pedagogic-panel="true" data-pedagogic-ql="${esc(row.qlId)}" style="margin:8px 0 14px;padding:10px 14px;border:1px solid #dbe3ec;border-radius:8px;background:#f8fafc;color:#1f2937"><div style="font-weight:700;margin-bottom:4px">Teaching cues</div><ul style="margin:0;padding-left:20px">${items}</ul></div>`;
}

function normalizeRadians(value: number) {
  while (value > Math.PI) value -= 2 * Math.PI;
  while (value < -Math.PI) value += 2 * Math.PI;
  return value;
}

function preparePedagogicAngleDetails(qlId: string, diagram: any) {
  if (qlId !== "TRG-002-QL-037") return;
  const contact = (diagram.points ?? []).find((point: any) => point.id === "wall-contact");
  const wallBase = (diagram.points ?? []).find((point: any) => point.id === "wall-base");
  const ladderBase = (diagram.points ?? []).find((point: any) => point.id === "ladder-base");
  if (!contact || !wallBase || !ladderBase) throw new Error("TRG-002-QL-037: given wall-angle teaching overlay requires wall-contact, wall-base and ladder-base points.");
  contact.label = "C";
  const wallDirection = Math.atan2(Number(wallBase.y) - Number(contact.y), Number(wallBase.x) - Number(contact.x));
  const ladderDirection = Math.atan2(Number(ladderBase.y) - Number(contact.y), Number(ladderBase.x) - Number(contact.x));
  const actualDegrees = Math.abs(normalizeRadians(ladderDirection - wallDirection)) * 180 / Math.PI;
  if (Math.abs(actualDegrees - 30) > 0.75) throw new Error(`TRG-002-QL-037: wall/ladder geometry is ${actualDegrees.toFixed(2)}°, not the stated 30°.`);
  diagram.pedagogicAngleOverlays = [{
    id: "ql037-given-wall-angle",
    vertexPointId: "wall-contact",
    referencePointId: "wall-base",
    rayPointId: "ladder-base",
    label: "30°",
    semanticRole: "GIVEN_LADDER_TO_WALL_ANGLE",
    actualDegrees,
  }];
  diagram.pedagogicDiagramAudit.ql037GivenWallAngleArc = true;
}

function renderPedagogicAngleOverlays(diagram: any) {
  const points = new Map<string, any>((diagram.points ?? []).map((point: any) => [String(point.id), point]));
  return (diagram.pedagogicAngleOverlays ?? []).map((overlay: any) => {
    const vertex = points.get(String(overlay.vertexPointId));
    const reference = points.get(String(overlay.referencePointId));
    const ray = points.get(String(overlay.rayPointId));
    if (!vertex || !reference || !ray) throw new Error(`${overlay.id}: pedagogic angle overlay references a missing point.`);
    const start = Math.atan2(Number(reference.y) - Number(vertex.y), Number(reference.x) - Number(vertex.x));
    const target = Math.atan2(Number(ray.y) - Number(vertex.y), Number(ray.x) - Number(vertex.x));
    const delta = normalizeRadians(target - start);
    const actualDegrees = Math.abs(delta) * 180 / Math.PI;
    const expected = Number(String(overlay.label).replace("°", ""));
    if (!Number.isFinite(expected) || Math.abs(actualDegrees - expected) > 0.75) {
      throw new Error(`${overlay.id}: overlay label ${overlay.label} disagrees with geometry (${actualDegrees.toFixed(2)}°).`);
    }
    // renderTrg002SolutionDiagramSvg translates every logical point by the
    // review padding before drawing. Custom overlays injected afterwards must
    // use that same rendered coordinate space or they detach from the geometry.
    const vx = Number(vertex.x) + REVIEW_PADDING;
    const vy = Number(vertex.y) + REVIEW_PADDING;
    const radius = 52;
    const sx = vx + radius * Math.cos(start);
    const sy = vy + radius * Math.sin(start);
    const ex = vx + radius * Math.cos(target);
    const ey = vy + radius * Math.sin(target);
    const sweep = delta >= 0 ? 1 : 0;
    const mid = start + delta / 2;
    const labelRadius = 92;
    const lx = vx + labelRadius * Math.cos(mid);
    const ly = vy + labelRadius * Math.sin(mid);
    return `<g class="pedagogic-angle-overlay" data-pedagogic-angle-id="${esc(overlay.id)}" data-pedagogic-angle-role="${esc(overlay.semanticRole)}" data-rendered-vertex-x="${vx.toFixed(2)}" data-rendered-vertex-y="${vy.toFixed(2)}"><path d="M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${radius} ${radius} 0 0 ${sweep} ${ex.toFixed(2)} ${ey.toFixed(2)}" fill="none" stroke="#6d28d9" stroke-width="3.2"/><rect x="${(lx - 26).toFixed(2)}" y="${(ly - 17).toFixed(2)}" width="52" height="34" rx="7" fill="#ffffff" fill-opacity="0.98" stroke="#ddd6fe" stroke-width="1"/><text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" font-size="20" fill="#6d28d9">${esc(overlay.label)}</text></g>`;
  }).join("");
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
let pedagogicAngleOverlays = 0;

for (const row of pack.records as any[]) {
  const result = applyTrg002V4PedagogicDiagramLayerFinal({
    qlId: row.qlId,
    diagram: row.solutionDiagram,
    englishStem: row.english.stem,
    englishExplanationText: explanationText(row.english.explanation),
    englishAnswer: row.english.answer,
    topology: row.hindi?.v4ExamReadiness?.spatialTopology,
  });

  preparePedagogicAngleDetails(row.qlId, result.diagram);
  const cues = teachingCues(row, result.diagram);
  if (cues.length !== 3) throw new Error(`${row.qlId}: expected See/Rule/Use teaching cues, got ${cues.length}.`);
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
  let svg = figure.match(/<svg class="solution-diagram"[\s\S]*?<\/svg>/)?.[0];
  if (!svg) throw new Error(`${row.qlId}: pedagogic renderer did not emit a solution SVG.`);
  const overlays = renderPedagogicAngleOverlays(result.diagram);
  if (overlays) {
    svg = svg.replace("</svg>", `${overlays}</svg>`);
    pedagogicAngleOverlays += result.diagram.pedagogicAngleOverlays.length;
  }
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
if (teachingCueCount !== 288) throw new Error(`Expected exactly 288 See/Rule/Use teaching cues, got ${teachingCueCount}.`);
if (pedagogicAngleOverlays !== 1) throw new Error(`Expected exactly one explicit pedagogic angle overlay, got ${pedagogicAngleOverlays}.`);

html = html.replace(
  "bold semantically-audited solution geometry with explicit dimensions outside the protected core diagram, canonical spatial state and diagram evidence. Numeric values are attached only to their intended geometric relationships; changed-shadow and support-triangle states are explicitly represented; answer-equivalent derived helpers are suppressed; sloped callout leaders are ordered without crossings.",
  "bold semantically-audited pedagogic solution geometry aligned to the worked explanation. Given data, assumed variables, helper points, eye-level intersections, derived rises/drops, changed-state relations and multi-position distance relations are visualized when they are load-bearing to the solution, while each diagram also carries a compact teaching strip explaining how to read the geometry and which solution relation to use.",
);

writeFileSync(jsonPath, stringify(pack), "utf8");
writeFileSync(htmlPath, html, "utf8");
console.log(`TRG002_V4_PEDAGOGIC_DIAGRAM_PASS qls=96 explanationAligned=${explanationAligned} helperPoints=${helperPoints} helperSegments=${helperSegments} teachingDimensions=${teachingDimensions} requestedRealignments=${requestedRealignments} explanationFactsVisualized=${explanationFacts} teachingCuePanels=${teachingCuePanels} teachingCues=${teachingCueCount} pedagogicAngleOverlays=${pedagogicAngleOverlays}`);