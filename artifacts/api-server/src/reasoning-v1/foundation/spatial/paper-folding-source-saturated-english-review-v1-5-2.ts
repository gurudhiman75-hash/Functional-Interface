import {
  generatePfcTpfSourceSaturatedEnglishReviewV1_4_1,
} from "./paper-folding-source-saturated-english-review-v1-4-1";
import {
  PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5,
  minimumPatternOptionDistanceV1_5,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5,
} from "./paper-folding-source-saturated-english-review-v1-5";
import type { PfcTpfEnglishReviewQuestionV1 } from "./paper-folding-source-saturated-english-review-v1";

export const PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_2 = Object.freeze({
  ...PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5,
  authorityId: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.5.2" as const,
  supersedesReviewCandidate: "PFC-TPF-SOURCE-SATURATED-ENGLISH-REVIEW-V1.4.1" as const,
  remediationV1_5_2: [
    "PACKET_FITTED_VIEWBOX_PER_FOLD_STAGE",
    "FIXED_PIXEL_STAGE_CARDS_WITH_HORIZONTAL_SCROLL",
    "MINIMUM_PATTERN_OPTION_DISTANCE_0_16",
    "CONCEPTUAL_LAYER_COUNT_DISTRACTORS",
    "CONCEPTUAL_WRONG_AXIS_DISTRACTORS",
    "CONCEPTUAL_CUT_TYPE_DISTRACTORS",
    "CONCEPTUAL_TRANSPARENT_SUPERPOSITION_DISTRACTORS",
    "NO_RANDOM_EXTRA_MARKS",
    "NO_MARK_DELETION_FALLBACK",
    "CORRECT_OPTION_IMMUTABLE",
  ] as const,
  status: "LEARNER_REVIEW_CANDIDATE_V1_5_2_NOT_FROZEN" as const,
} as const);

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const SVG_RE = /<svg\b[\s\S]*?<\/svg>/g;
const q = (value: number) => Math.round(value * 1000) / 1000;

function attrNumber(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}
function attrString(tag: string, name: string): string | null {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? null;
}

function boundaryEnd(svg: string, question: PfcTpfEnglishReviewQuestionV1): number | null {
  const openEnd = svg.indexOf(">");
  const close = svg.lastIndexOf("</svg>");
  if (openEnd < 0 || close < 0) return null;
  const body = svg.slice(openEnd + 1, close);
  if (question.taskKind === "LEGACY_FORWARD") {
    const rects = [...body.matchAll(/<rect\b[^>]*\/?\s*>/g)];
    if (rects.length >= 2 && rects[1].index !== undefined) return openEnd + 1 + rects[1].index + rects[1][0].length;
  }
  if (question.sourceShape === "CIRCLE") {
    const circles = [...body.matchAll(/<circle\b[^>]*\/?\s*>/g)];
    const boundary = circles.find((m) => Number(attrString(m[0], "r") ?? 0) > 10 && /\bfill="white"/.test(m[0]));
    if (boundary?.index !== undefined) return openEnd + 1 + boundary.index + boundary[0].length;
  }
  const rect = body.match(/<rect\b[^>]*\/?\s*>/);
  return rect?.index === undefined ? null : openEnd + 1 + rect.index + rect[0].length;
}

function paperSpec(question: PfcTpfEnglishReviewQuestionV1) {
  if (question.sourceShape === "CIRCLE") {
    return { width: 100, height: 100, pad: 8, boundary: `<circle cx="50" cy="50" r="50" fill="white" stroke="#111" stroke-width="1.4"/>` };
  }
  if (question.sourceShape === "RECTANGLE") {
    return { width: 120, height: 80, pad: 9.6, boundary: `<rect x="0" y="0" width="120" height="80" fill="white" stroke="#111" stroke-width="1.4"/>` };
  }
  return { width: 100, height: 100, pad: 8, boundary: `<rect x="0" y="0" width="100" height="100" fill="white" stroke="#111" stroke-width="1.4"/>` };
}
function answerSvg(question: PfcTpfEnglishReviewQuestionV1, marks: string): string {
  const p = paperSpec(question);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${q(-p.pad)} ${q(-p.pad)} ${q(p.width + 2 * p.pad)} ${q(p.height + 2 * p.pad)}" width="150" height="150" style="background:#fff" role="img">${p.boundary}${marks}</svg>`;
}
function transparentSvg(marks: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 116 116" width="150" height="150" style="background:#fff" role="img"><rect x="0" y="0" width="100" height="100" fill="white" stroke="#111" stroke-width="1.5"/>${marks}</svg>`;
}
function hole(cx: number, cy: number, radius = 2.2, filled = false): string {
  return `<circle cx="${q(cx)}" cy="${q(cy)}" r="${q(radius)}" fill="${filled ? "#111" : "none"}"${filled ? "" : " data-cutout=\"transparent\""} stroke="${filled ? "none" : "#111"}" stroke-width="${filled ? 0 : 1.6}"/>`;
}
function circleOutline(cx: number, cy: number, radius = 5): string {
  return `<circle cx="${q(cx)}" cy="${q(cy)}" r="${q(radius)}" fill="none" stroke="#111" stroke-width="1.7"/>`;
}
function line(x1: number, y1: number, x2: number, y2: number): string {
  return `<line x1="${q(x1)}" y1="${q(y1)}" x2="${q(x2)}" y2="${q(y2)}" stroke="#111" stroke-width="1.7" stroke-linecap="round"/>`;
}
function polygon(points: readonly (readonly [number, number])[]): string {
  return `<polygon points="${points.map(([x, y]) => `${q(x)},${q(y)}`).join(" ")}" fill="none" stroke="#111" stroke-width="1.7" stroke-linejoin="round"/>`;
}
function polyline(points: readonly (readonly [number, number])[]): string {
  return `<polyline points="${points.map(([x, y]) => `${q(x)},${q(y)}`).join(" ")}" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function cutTriangle(cx: number, cy: number, direction: "UP" | "DOWN" | "LEFT" | "RIGHT", size = 4.5): string {
  let pts: readonly (readonly [number, number])[];
  if (direction === "UP") pts = [[cx, cy - size], [cx + size, cy + size], [cx - size, cy + size]];
  else if (direction === "DOWN") pts = [[cx, cy + size], [cx + size, cy - size], [cx - size, cy - size]];
  else if (direction === "LEFT") pts = [[cx - size, cy], [cx + size, cy - size], [cx + size, cy + size]];
  else pts = [[cx + size, cy], [cx - size, cy - size], [cx - size, cy + size]];
  return `<polygon points="${pts.map(([x, y]) => `${q(x)},${q(y)}`).join(" ")}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/>`;
}
function diamond(cx: number, cy: number, size = 4): string {
  return `<polygon points="${q(cx)},${q(cy - size)} ${q(cx + size)},${q(cy)} ${q(cx)},${q(cy + size)} ${q(cx - size)},${q(cy)}" fill="none" data-cutout="transparent" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/>`;
}

function replaceWrongOptions(
  question: PfcTpfEnglishReviewQuestionV1,
  wrongSvgs: readonly string[],
): PfcTpfEnglishReviewQuestionV1 {
  let wrong = 0;
  const options = question.options.map((option) => option.optionId === question.correctOptionId
    ? option
    : { ...option, svg: wrongSvgs[wrong++] });
  const candidate = { ...question, options };
  const distance = minimumPatternOptionDistanceV1_5(candidate);
  if (distance + 1e-9 < PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE) {
    throw new Error(`${question.reviewQuestionId} semantic choices remain too similar at ${distance.toFixed(3)}.`);
  }
  return candidate;
}

function semanticDoubleTriangle(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 | null {
  if (!question.sourceId.includes("DOUBLE-TRIANGLE")) return null;
  const circle = question.sourceShape === "CIRCLE";
  const x = circle ? 70 : 88;
  const oneFold = answerSvg(question, `${cutTriangle(x, circle ? 32 : 22, "UP")}${cutTriangle(x, circle ? 68 : 58, "DOWN")}`);
  const wrongAxes = answerSvg(question, circle
    ? `${cutTriangle(50, 9, "UP")}${cutTriangle(91, 50, "RIGHT")}${cutTriangle(50, 91, "DOWN")}${cutTriangle(9, 50, "LEFT")}`
    : `${cutTriangle(15, 10, "UP")}${cutTriangle(105, 10, "UP")}${cutTriangle(15, 70, "DOWN")}${cutTriangle(105, 70, "DOWN")}`);
  const foldedOnly = answerSvg(question, cutTriangle(circle ? 69 : 87, circle ? 34 : 25, "UP", 5));
  return replaceWrongOptions(question, [oneFold, wrongAxes, foldedOnly]);
}

function semanticThreeFold(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 | null {
  const simple = question.sourceId.includes("THREE-FOLD-HOLE") || question.sourceId.includes("THREE-FOLD-DIAMOND");
  const mixed = question.sourceId.includes("THREE-FOLD-MIXED-CUTS");
  if (!simple && !mixed) return null;
  if (mixed) {
    const holes = [[101,15],[79,15],[101,65],[79,65],[19,15],[41,15],[19,65],[41,65]].map(([x,y]) => hole(x,y,2)).join("");
    const diamonds = [[110,25],[70,25],[110,55],[70,55],[10,25],[50,25],[10,55],[50,55]].map(([x,y]) => diamond(x,y,3)).join("");
    const ys = [5,15,25,35,45,55,65,75];
    const wrongAxis = ys.map((y) => hole(60,y,2)).join("") + ys.map((y) => diamond(20,y,3)).join("");
    return replaceWrongOptions(question, [answerSvg(question, holes), answerSvg(question, diamonds), answerSvg(question, wrongAxis)]);
  }
  const square = question.sourceShape === "SQUARE";
  const make = (x: number, y: number) => question.sourceId.includes("DIAMOND") ? diamond(x,y,3.5) : hole(x,y,2.2);
  const four = square
    ? [[72,24],[28,24],[72,76],[28,76]].map(([x,y]) => make(x,y)).join("")
    : [[92,18],[28,18],[92,62],[28,62]].map(([x,y]) => make(x,y)).join("");
  const two = square ? `${make(72,24)}${make(72,76)}` : `${make(92,18)}${make(92,62)}`;
  const wrongAxis = square
    ? [10,21.5,33,44.5,55.5,67,78.5,90].map((x) => make(x,50)).join("")
    : [5,15,25,35,45,55,65,75].map((y) => make(60,y)).join("");
  return replaceWrongOptions(question, [answerSvg(question,four), answerSvg(question,two), answerSvg(question,wrongAxis)]);
}

function semanticMixedCut(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 | null {
  if (question.sourceId !== "PFC-W1-RECT-MIXED") return null;
  const holes = [[82,21],[82,59],[38,21],[38,59]].map(([x,y]) => hole(x,y)).join("");
  const diamonds = [[101,31],[101,49],[19,31],[19,49]].map(([x,y]) => diamond(x,y,3)).join("");
  const ys = [10,30,50,70];
  const wrongAxis = ys.map((y) => hole(55,y)).join("") + ys.map((y) => diamond(70,y,3)).join("");
  return replaceWrongOptions(question, [answerSvg(question,holes), answerSvg(question,diamonds), answerSvg(question,wrongAxis)]);
}

function notch(edge: "TOP" | "BOTTOM" | "LEFT" | "RIGHT", position: number, width: number, height: number): string {
  const mouth = 5, depth = 7;
  if (edge === "TOP") return `<line x1="${q(position-mouth)}" y1="0" x2="${q(position+mouth)}" y2="0" stroke="white" stroke-width="5.2" stroke-linecap="round"/><path d="M ${q(position-mouth+1)} 0 L ${q(position)} ${depth} L ${q(position+mouth-1)} 0" fill="none" stroke="black" stroke-width="1.8" stroke-linejoin="round"/>`;
  if (edge === "BOTTOM") return `<line x1="${q(position-mouth)}" y1="${height}" x2="${q(position+mouth)}" y2="${height}" stroke="white" stroke-width="5.2" stroke-linecap="round"/><path d="M ${q(position-mouth+1)} ${height} L ${q(position)} ${q(height-depth)} L ${q(position+mouth-1)} ${height}" fill="none" stroke="black" stroke-width="1.8" stroke-linejoin="round"/>`;
  if (edge === "LEFT") return `<line x1="0" y1="${q(position-mouth)}" x2="0" y2="${q(position+mouth)}" stroke="white" stroke-width="5.2" stroke-linecap="round"/><path d="M 0 ${q(position-mouth+1)} L ${depth} ${q(position)} L 0 ${q(position+mouth-1)}" fill="none" stroke="black" stroke-width="1.8" stroke-linejoin="round"/>`;
  return `<line x1="${width}" y1="${q(position-mouth)}" x2="${width}" y2="${q(position+mouth)}" stroke="white" stroke-width="5.2" stroke-linecap="round"/><path d="M ${width} ${q(position-mouth+1)} L ${q(width-depth)} ${q(position)} L ${width} ${q(position+mouth-1)}" fill="none" stroke="black" stroke-width="1.8" stroke-linejoin="round"/>`;
}
function semanticOuterNotch(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 | null {
  if (question.sourceId !== "PFC-DISC-0081" && !question.sourceId.includes("OUTER-V-NOTCH")) return null;
  const p = paperSpec(question), w = p.width, h = p.height;
  if (question.sourceId === "PFC-DISC-0081") {
    return replaceWrongOptions(question, [
      answerSvg(question, notch("TOP",20,w,h)),
      answerSvg(question, notch("BOTTOM",18,w,h)+notch("BOTTOM",82,w,h)),
      answerSvg(question, notch("LEFT",28,w,h)+notch("RIGHT",72,w,h)),
    ]);
  }
  return replaceWrongOptions(question, [
    answerSvg(question, notch("RIGHT",30,w,h)),
    answerSvg(question, notch("TOP",28,w,h)+notch("TOP",92,w,h)),
    answerSvg(question, notch("BOTTOM",25,w,h)+notch("BOTTOM",95,w,h)),
  ]);
}

function semanticTransparent(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 | null {
  if (question.chapterCode !== "TPF-001") return null;
  let wrong: string[];
  switch (question.sourceId) {
    case "TPF-W1-VERTICAL-POINT-PAIR":
      wrong = [
        transparentSvg(hole(80,70,2.1,true)),
        transparentSvg(hole(25,30,2.1,true)+hole(80,70,2.1,true)),
        transparentSvg(hole(25,70,2.1,true)+hole(80,30,2.1,true)),
      ]; break;
    case "TPF-W1-HORIZONTAL-POINT-PAIR":
      wrong = [
        transparentSvg(hole(72,76,2.1,true)),
        transparentSvg(hole(28,22,2.1,true)+hole(72,76,2.1,true)),
        transparentSvg(hole(72,22,2.1,true)+hole(28,76,2.1,true)),
      ]; break;
    case "TPF-W2-VERTICAL-TRIANGLE-CIRCLE":
      wrong = [
        transparentSvg(circleOutline(74,68,6)),
        transparentSvg(polygon([[16,22],[36,34],[16,46]])+circleOutline(74,68,6)),
        transparentSvg(polygon([[16,78],[36,66],[16,54]])+circleOutline(74,32,6)),
      ]; break;
    case "TPF-W2-HORIZONTAL-TRIANGLE-CIRCLE":
      wrong = [
        transparentSvg(circleOutline(70,72,5)),
        transparentSvg(polygon([[22,18],[40,30],[22,42]])+circleOutline(70,72,5)),
        transparentSvg(polygon([[78,18],[60,30],[78,42]])+circleOutline(30,72,5)),
      ]; break;
    case "TPF-W2-VERTICAL-CROSSING-POLYLINE":
      wrong = [
        transparentSvg(line(50,40.875,52,42)+line(52,42,82,24)+line(50,72,76,72)),
        transparentSvg(polyline([[20,24],[52,42],[82,24]])+line(28,72,76,72)),
        transparentSvg(polyline([[20,76],[52,58],[82,76]])+line(28,28,76,28)),
      ]; break;
    case "TPF-W2-HORIZONTAL-CROSSING-POLYGON":
      wrong = [
        transparentSvg(line(16,50,30,78)+line(30,78,44,50)+hole(74,70,2.1,true)),
        transparentSvg(polygon([[30,24],[44,50],[30,78],[16,50]])+hole(74,70,2.1,true)),
        transparentSvg(polygon([[70,24],[84,50],[70,78],[56,50]])+hole(26,30,2.1,true)),
      ]; break;
    case "TPF-W2-VERTICAL-MULTI-SHAPE-LINE-ART":
      wrong = [
        transparentSvg(polygon([[62,18],[84,18],[84,40],[62,40]])+circleOutline(74,72,5)),
        transparentSvg(polygon([[62,18],[84,18],[84,40],[62,40]])+polyline([[18,62],[30,78],[42,62]])+circleOutline(74,72,5)),
        transparentSvg(polygon([[62,60],[84,60],[84,82],[62,82]])+polyline([[18,38],[30,22],[42,38]])+circleOutline(74,28,5)),
      ]; break;
    case "TPF-W2-HORIZONTAL-MULTI-SHAPE-LINE-ART":
      wrong = [
        transparentSvg(polygon([[18,62],[40,62],[40,82],[18,82]])+circleOutline(70,72,5)),
        transparentSvg(polygon([[18,62],[40,62],[40,82],[18,82]])+line(58,22,82,38)+circleOutline(70,72,5)),
        transparentSvg(polygon([[60,62],[82,62],[82,82],[60,82]])+line(42,22,18,38)+circleOutline(30,72,5)),
      ]; break;
    default: return null;
  }
  return replaceWrongOptions(question, wrong);
}

function affine(value: number, center: number, factor: number, shift: number): number { return q(center + (value-center)*factor + shift); }
function affinePairs(raw: string, cx: number, cy: number, factor: number, dx: number, dy: number): string {
  const values = raw.match(NUMBER_RE)?.map(Number) ?? []; if (values.length < 2) return raw;
  const mapped = values.map((v,i) => i%2===0 ? affine(v,cx,factor,dx) : affine(v,cy,factor,dy)); let i=0;
  return raw.replace(NUMBER_RE, () => String(mapped[i++]));
}
function affineMarkup(markup: string, cx: number, cy: number, factor: number, dx: number, dy: number): string {
  return markup
    .replace(/\b(cx|x1|x2)="(-?\d+(?:\.\d+)?)"/g,(_m,k:string,r:string)=>`${k}="${affine(Number(r),cx,factor,dx)}"`)
    .replace(/\b(cy|y1|y2)="(-?\d+(?:\.\d+)?)"/g,(_m,k:string,r:string)=>`${k}="${affine(Number(r),cy,factor,dy)}"`)
    .replace(/\bpoints="([^"]+)"/g,(_m,r:string)=>`points="${affinePairs(r,cx,cy,factor,dx,dy)}"`)
    .replace(/\bd="([^"]+)"/g,(_m,r:string)=>`d="${affinePairs(r,cx,cy,factor,dx,dy)}"`);
}
const SPREAD = [
  {factor:.42,dx:-14,dy:11},{factor:.54,dx:15,dy:-13},{factor:.68,dx:-15,dy:-11},
  {factor:.36,dx:13,dy:13},{factor:.60,dx:-16,dy:8},{factor:.48,dx:16,dy:11},
  {factor:.40,dx:-9,dy:-15},{factor:.56,dx:11,dy:15},{factor:.32,dx:-15,dy:0},
  {factor:.64,dx:0,dy:-15},{factor:.46,dx:15,dy:5},{factor:.58,dx:-11,dy:15},
] as const;
function transformWrong(svg: string, question: PfcTpfEnglishReviewQuestionV1, variantIndex: number): string {
  const start = boundaryEnd(svg,question), close=svg.lastIndexOf("</svg>"); if(start===null||close<start)return svg;
  const cx=question.sourceShape==="RECTANGLE"?60:50, cy=question.sourceShape==="RECTANGLE"?40:50, v=SPREAD[variantIndex%SPREAD.length];
  return `${svg.slice(0,start)}${affineMarkup(svg.slice(start,close),cx,cy,v.factor,v.dx,v.dy)}${svg.slice(close)}`;
}
function strengthenGeneric(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  if(question.taskKind==="REVERSE_INFERENCE")return question;
  if(minimumPatternOptionDistanceV1_5(question)+1e-9>=PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE)return question;
  const correctIndex=question.options.findIndex((o)=>o.optionId===question.correctOptionId); if(correctIndex<0)throw new Error(`${question.reviewQuestionId} has no correct option.`);
  const bases=question.options.map((o)=>({...o}));
  for(let pass=0;pass<SPREAD.length;pass++){
    let rank=0;const options=bases.map((o,i)=>i===correctIndex?o:{...o,svg:transformWrong(o.svg,question,(pass+rank++*3)%SPREAD.length)});
    const candidate={...question,options}; if(minimumPatternOptionDistanceV1_5(candidate)+1e-9>=PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE)return candidate;
  }
  throw new Error(`${question.reviewQuestionId} cannot satisfy V1.5.2 separation without non-semantic marks.`);
}

function semanticFirst(question: PfcTpfEnglishReviewQuestionV1): PfcTpfEnglishReviewQuestionV1 {
  return semanticTransparent(question)
    ?? semanticDoubleTriangle(question)
    ?? semanticThreeFold(question)
    ?? semanticMixedCut(question)
    ?? semanticOuterNotch(question)
    ?? strengthenGeneric(question);
}

interface Bounds { minX:number; minY:number; maxX:number; maxY:number }
function addBounds(b:Bounds|null,x:number,y:number):Bounds{return b?{minX:Math.min(b.minX,x),minY:Math.min(b.minY,y),maxX:Math.max(b.maxX,x),maxY:Math.max(b.maxY,y)}:{minX:x,minY:y,maxX:x,maxY:y};}
function paperBounds(svg:string):Bounds|null{
  let b:Bounds|null=null;
  for(const tag of svg.match(/<polygon\b[^>]*\/?\s*>/g)??[]){if(!/\bfill="white"/i.test(tag)||!/\bstroke="(?:#111|black)"/i.test(tag))continue;const pts=attrString(tag,"points")?.match(NUMBER_RE)?.map(Number)??[];for(let i=0;i+1<pts.length;i+=2)b=addBounds(b,pts[i],pts[i+1]);}
  for(const tag of svg.match(/<rect\b[^>]*\/?\s*>/g)??[]){if(!/\bfill="white"/i.test(tag)||!/\bstroke="(?:#111|black)"/i.test(tag))continue;const x=attrNumber(tag,"x")??0,y=attrNumber(tag,"y")??0,w=attrNumber(tag,"width"),h=attrNumber(tag,"height");if(w===null||h===null)continue;b=addBounds(b,x,y);b=addBounds(b,x+w,y+h);}
  for(const tag of svg.match(/<circle\b[^>]*\/?\s*>/g)??[]){if(!/\bfill="white"/i.test(tag)||!/\bstroke="(?:#111|black)"/i.test(tag))continue;const cx=attrNumber(tag,"cx"),cy=attrNumber(tag,"cy"),r=attrNumber(tag,"r");if(cx===null||cy===null||r===null||r<10)continue;b=addBounds(b,cx-r,cy-r);b=addBounds(b,cx+r,cy+r);}
  return b;
}
function normalizeStageSvg(svg:string):string{
  const b=paperBounds(svg);if(!b)return svg;const span=Math.max(1,b.maxX-b.minX,b.maxY-b.minY),side=span*1.30,cx=(b.minX+b.maxX)/2,cy=(b.minY+b.maxY)/2,vb=`${q(cx-side/2)} ${q(cy-side/2)} ${q(side)} ${q(side)}`;
  let next=svg.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g,"");next=/\bviewBox="[^"]+"/i.test(next)?next.replace(/\bviewBox="[^"]+"/i,`viewBox="${vb}"`):next.replace("<svg",`<svg viewBox="${vb}"`);return next.replace("<svg",'<svg data-stage-normalized="true"');
}
function normalizeSequence(markup:string):string{return markup.replace(SVG_RE,(svg)=>{const label=(attrString(svg.slice(0,svg.indexOf(">")+1),"aria-label")??"Stage").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");return `<div class="fixed-stage"><div class="fixed-stage-label">${label}</div>${normalizeStageSvg(svg)}</div>`;});}
function normalizeStages(question:PfcTpfEnglishReviewQuestionV1):PfcTpfEnglishReviewQuestionV1{
  if(question.taskKind==="MULTISHAPE_FORWARD"&&(question.stimulusSvg.match(/<svg\b/g)??[]).length>=3)return{...question,stimulusSvg:normalizeSequence(question.stimulusSvg)};
  if(question.taskKind==="REVERSE_INFERENCE")return{...question,options:question.options.map((o)=>({...o,svg:normalizeSequence(o.svg)}))};
  return question;
}

export function generatePfcTpfSourceSaturatedEnglishReviewV1_5_2():PfcTpfEnglishReviewQuestionV1[]{
  return generatePfcTpfSourceSaturatedEnglishReviewV1_4_1().map((q)=>normalizeStages(semanticFirst(q)));
}
export function renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_2(questions:readonly PfcTpfEnglishReviewQuestionV1[]):string{
  return renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5(questions)
    .replaceAll("PFC / TPF Source-Saturated English Learner Review V1.5","PFC / TPF Source-Saturated English Learner Review V1.5.2")
    .replaceAll(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5.authorityId,PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_2.authorityId);
}
export function countNormalizedStagesV1_5_2(questions:readonly PfcTpfEnglishReviewQuestionV1[]):number{return questions.reduce((n,q)=>n+([q.stimulusSvg,...q.options.map((o)=>o.svg)].join("\n").match(/data-stage-normalized="true"/g)??[]).length,0);}
