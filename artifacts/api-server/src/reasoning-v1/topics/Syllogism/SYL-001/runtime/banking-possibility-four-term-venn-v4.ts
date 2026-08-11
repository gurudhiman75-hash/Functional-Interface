import type { SylLocale, TermId } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import type { BankingPossibilityShellQuestionV1 } from "./banking-possibility-shell-v1";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

interface Shape {
  term: TermId;
  cx: number;
  cy: number;
  r: number;
  labelY: number;
}

interface Point {
  x: number;
  y: number;
}

interface Core009Roles {
  a: TermId;
  b: TermId;
  c: TermId;
  d: TermId;
}

interface LocalizedRoles {
  a: string;
  b: string;
  c: string;
  d: string;
}

export interface BankingFourTermDiagramV4 {
  schemaVersion: "banking-possibility-four-term-diagram-v4";
  renderer: "SAFETY_GATED_FOUR_TERM_EXAM_VENN";
  geometrySource: "SAFETY_GATED_FOUR_TERM_TEMPLATE";
  pipelineMode: "CONCLUSION_MASK";
  premiseOnly: true;
  enabled: true;
  omissionReason: null;
  svg: string;
  caption: string;
  accessibleDescription: string;
  semanticSignature: string;
  modelSignature: "banking-four-term-core-009-v4";
  mobileViewBoxWidth: 340;
  diagramCount: 1;
}

const WITNESS: Point = { x: 135, y: 122 };
const EPSILON = 2;

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function splitLabel(value: string): readonly string[] {
  const characters = [...value];
  if (characters.length <= 13) return [value];
  const midpoint = Math.ceil(characters.length / 2);
  return [characters.slice(0, midpoint).join(""), characters.slice(midpoint).join("")];
}

function distance(left: Shape, right: Shape): number {
  return Math.hypot(left.cx - right.cx, left.cy - right.cy);
}

function contains(outer: Shape, inner: Shape): boolean {
  return distance(outer, inner) + inner.r <= outer.r + EPSILON;
}

function disjoint(left: Shape, right: Shape): boolean {
  return distance(left, right) >= left.r + right.r + 3;
}

function properOverlap(left: Shape, right: Shape): boolean {
  const d = distance(left, right);
  return d < left.r + right.r - 5
    && !contains(left, right)
    && !contains(right, left);
}

function pointInside(point: Point, shape: Shape, margin = 5): boolean {
  return Math.hypot(point.x - shape.cx, point.y - shape.cy) <= shape.r - margin;
}

function pointOutside(point: Point, shape: Shape, margin = 5): boolean {
  return Math.hypot(point.x - shape.cx, point.y - shape.cy) >= shape.r + margin;
}

function copy(
  locale: SylLocale,
  labels: LocalizedRoles,
): { caption: string; description: string } {
  if (locale === "hi-IN") {
    return {
      caption: "चार पदों वाले कथनों का संयुक्त वेन आरेख। निष्कर्ष I और II दोनों को इसी एक व्यवस्था पर जाँचें।",
      description: `${labels.a} और ${labels.b} वाले वर्ग अलग हैं। ${labels.c} वाला वर्ग ${labels.d} के अंदर है और ${labels.a} तथा ${labels.b} दोनों से केवल संभावित रूप से काटता है। नीला × ${labels.c} और ${labels.a} के साझा भाग में है, इसलिए वह ${labels.d} के अंदर और ${labels.b} के बाहर भी है। बिना × वाला प्रतिच्छेद अपने-आप अस्तित्व सिद्ध नहीं करता।`,
    };
  }
  if (locale === "pa-IN") {
    return {
      caption: "ਚਾਰ ਪਦਾਂ ਵਾਲੇ ਕਥਨਾਂ ਦਾ ਇਕੱਠਾ ਵੇਨ ਚਿੱਤਰ। ਨਤੀਜਾ I ਅਤੇ II ਦੋਵੇਂ ਨੂੰ ਇਸੇ ਇਕ ਬਣਤਰ ਉੱਤੇ ਜਾਂਚੋ।",
      description: `${labels.a} ਅਤੇ ${labels.b} ਵਾਲੇ ਵਰਗ ਵੱਖ ਹਨ। ${labels.c} ਵਾਲਾ ਵਰਗ ${labels.d} ਦੇ ਅੰਦਰ ਹੈ ਅਤੇ ${labels.a} ਤੇ ${labels.b} ਦੋਵਾਂ ਨਾਲ ਸਿਰਫ਼ ਸੰਭਵ ਓਵਰਲੈਪ ਰੱਖਦਾ ਹੈ। ਨੀਲਾ × ${labels.c} ਅਤੇ ${labels.a} ਦੇ ਸਾਂਝੇ ਹਿੱਸੇ ਵਿੱਚ ਹੈ, ਇਸ ਲਈ ਉਹ ${labels.d} ਦੇ ਅੰਦਰ ਅਤੇ ${labels.b} ਤੋਂ ਬਾਹਰ ਵੀ ਹੈ। × ਤੋਂ ਬਿਨਾਂ ਓਵਰਲੈਪ ਆਪਣੇ ਆਪ ਅਸਤਿਤਵ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।`,
    };
  }
  return {
    caption: "Combined four-term Venn diagram of the statements. Check Conclusions I and II on this same arrangement.",
    description: `The ${labels.a} and ${labels.b} classes are disjoint. The ${labels.c} class lies inside ${labels.d} and properly overlaps both ${labels.a} and ${labels.b} so unstated relations stay open. The blue × lies in ${labels.c} and ${labels.a}, therefore also inside ${labels.d} and outside ${labels.b}. An unmarked overlap does not assert existence.`,
  };
}

function resolveRoles(question: BankingPossibilityShellQuestionV1): Core009Roles {
  if (question.scenarioId !== "SYL-SC-CORE-009") {
    throw new Error(`${question.scenarioId}: four-term V4 renderer only supports SYL-SC-CORE-009.`);
  }
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) => entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: scenario not found.`);
  const analysis = analyzeScenario(scenario);
  const no = analysis.premises.find((premise) => premise.form === "NO");
  const some = analysis.premises.find((premise) => premise.form === "SOME");
  const all = analysis.premises.find((premise) => premise.form === "ALL");
  if (!no || !some || !all) throw new Error(`${question.scenarioId}: expected NO + SOME + ALL premises.`);

  const c = some.subject;
  const a = some.predicate;
  if (all.subject !== c) throw new Error(`${question.scenarioId}: SOME subject must be ALL subject.`);
  const d = all.predicate;
  const b = no.subject === a
    ? no.predicate
    : no.predicate === a
      ? no.subject
      : null;
  if (!b) throw new Error(`${question.scenarioId}: SOME predicate must participate in NO premise.`);
  if (new Set([a, b, c, d]).size !== 4) throw new Error(`${question.scenarioId}: expected four distinct terms.`);
  return { a, b, c, d };
}

function shapesFor(roles: Core009Roles): ReadonlyMap<TermId, Shape> {
  return new Map<TermId, Shape>([
    [roles.a, { term: roles.a, cx: 95, cy: 112, r: 55, labelY: 73 }],
    [roles.b, { term: roles.b, cx: 245, cy: 112, r: 55, labelY: 73 }],
    [roles.c, { term: roles.c, cx: 170, cy: 122, r: 58, labelY: 84 }],
    [roles.d, { term: roles.d, cx: 170, cy: 104, r: 84, labelY: 40 }],
  ]);
}

function assertGeometry(roles: Core009Roles, shapes: ReadonlyMap<TermId, Shape>): void {
  const a = shapes.get(roles.a)!;
  const b = shapes.get(roles.b)!;
  const c = shapes.get(roles.c)!;
  const d = shapes.get(roles.d)!;

  if (!disjoint(a, b)) throw new Error("CORE-009 V4: A and B must be disjoint.");
  if (!contains(d, c)) throw new Error("CORE-009 V4: C must be inside D.");
  if (!properOverlap(c, a)) throw new Error("CORE-009 V4: C and A must properly overlap.");

  // These are deliberately left as possible-only geometry: no witness is placed in them.
  if (!properOverlap(c, b)) throw new Error("CORE-009 V4: unstated C-B relation must remain open.");
  if (!properOverlap(d, a)) throw new Error("CORE-009 V4: unstated D-A relation must remain open.");
  if (!properOverlap(d, b)) throw new Error("CORE-009 V4: unstated D-B relation must remain open.");

  if (!pointInside(WITNESS, a) || !pointInside(WITNESS, c) || !pointInside(WITNESS, d)) {
    throw new Error("CORE-009 V4: witness must lie in A, C and D with margin.");
  }
  if (!pointOutside(WITNESS, b)) throw new Error("CORE-009 V4: witness must lie outside B with margin.");
}

export function renderBankingFourTermPremiseVennV4(
  question: BankingPossibilityShellQuestionV1,
): BankingFourTermDiagramV4 {
  const roles = resolveRoles(question);
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) => entry.scenarioId === question.scenarioId)!;
  const analysis = analyzeScenario(scenario);
  const assignment = assignTerms("SYL-QL-005", question.seed, analysis.termOrder);
  const shapes = shapesFor(roles);
  assertGeometry(roles, shapes);

  const drawOrder: readonly TermId[] = [roles.d, roles.a, roles.b, roles.c];
  const circles: string[] = [];
  const labels: string[] = [];
  drawOrder.forEach((term, index) => {
    const shape = shapes.get(term)!;
    circles.push(`<g data-set="${esc(term)}" data-cx="${shape.cx}" data-cy="${shape.cy}" data-r="${shape.r}"><circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" class="set-circle set-${index + 1}"/></g>`);
    const label = assignment[term]?.labels[question.locale] ?? term;
    const lines = splitLabel(label);
    labels.push(`<text x="${shape.cx}" y="${shape.labelY}" text-anchor="middle" class="set-label">${lines.map((line, lineIndex) => `<tspan x="${shape.cx}" dy="${lineIndex === 0 ? 0 : 14}">${esc(line)}</tspan>`).join("")}</text>`);
  });

  const localizedRoles: LocalizedRoles = {
    a: assignment[roles.a]?.labels[question.locale] ?? roles.a,
    b: assignment[roles.b]?.labels[question.locale] ?? roles.b,
    c: assignment[roles.c]?.labels[question.locale] ?? roles.c,
    d: assignment[roles.d]?.labels[question.locale] ?? roles.d,
  };
  const text = copy(question.locale, localizedRoles);
  const id = `bank-four-v4-${question.seed}-${question.locale}`.replace(/[^a-zA-Z0-9_-]/gu, "-");
  const inside = [roles.a, roles.c, roles.d].join(",");
  const outside = roles.b;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 220" width="100%" role="img" lang="${question.locale}" aria-labelledby="${id}-title ${id}-desc" data-banking-combined-venn="true" data-premise-only="true" data-diagram-count="1" data-learner-safe-venn="true" data-supplemental-four-term="core-009" class="examtree-venn-svg">
  <title id="${id}-title">${esc(text.caption)}</title>
  <desc id="${id}-desc">${esc(text.description)}</desc>
  <style>
    .set-circle{fill:#f8fafc;fill-opacity:.34;stroke:#334155;stroke-width:2.2}
    .set-2{stroke:#475569}.set-3{stroke:#64748b}.set-4{stroke:#334155}
    .set-label{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:13px;font-weight:700;fill:#0f172a}
    .witness-halo{fill:#dbeafe;stroke:#2563eb;stroke-width:1.5}
    .witness{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:22px;font-weight:800;fill:#1d4ed8}
  </style>
  ${circles.join("\n  ")}
  ${labels.join("\n  ")}
  <g data-witness="decisive" data-source="P2" data-x="${WITNESS.x}" data-y="${WITNESS.y}" data-inside="${esc(inside)}" data-outside="${esc(outside)}"><circle cx="${WITNESS.x}" cy="${WITNESS.y}" r="11" class="witness-halo"/><text x="${WITNESS.x}" y="${WITNESS.y + 7}" text-anchor="middle" class="witness">×</text></g>
</svg>`;

  return {
    schemaVersion: "banking-possibility-four-term-diagram-v4",
    renderer: "SAFETY_GATED_FOUR_TERM_EXAM_VENN",
    geometrySource: "SAFETY_GATED_FOUR_TERM_TEMPLATE",
    pipelineMode: "CONCLUSION_MASK",
    premiseOnly: true,
    enabled: true,
    omissionReason: null,
    svg,
    caption: text.caption,
    accessibleDescription: text.description,
    semanticSignature: `syl-bank-v4:core-009-four-term:${question.seed}:${question.locale}:premise-safe`,
    modelSignature: "banking-four-term-core-009-v4",
    mobileViewBoxWidth: 340,
    diagramCount: 1,
  };
}
