import type {
  CanonicalConclusion,
  CanonicalModel,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import type {
  SylDiagramSpecV3,
  SylIntegratedDiagramModeV3,
} from "./structured-proof-v3-types";

interface IntegratedDiagramInputV3 {
  locale: SylLocale;
  premises: readonly SurfacePremise[];
  relevantPremiseIds: readonly string[];
  termLabels: Readonly<Record<TermId, string>>;
  correctOptionDisplayIndex: number;
  correctOptionText: string;
  conclusions: readonly CanonicalConclusion[];
  mode: SylIntegratedDiagramModeV3;
  model: CanonicalModel | null;
  alternateModel: CanonicalModel | null;
  titleId: string;
  descriptionId: string;
  textAlternative: string;
}

interface Point {
  x: number;
  y: number;
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function copy(locale: SylLocale): {
  title: string;
  premise: string;
  answer: string;
  model: string;
  alternate: string;
  inside: string;
  separate: string;
  overlap: string;
  outside: string;
  same: string;
  witness: string;
  memberOf: string;
  outsideOf: string;
} {
  if (locale === "hi-IN") return {
    title: "सही विकल्प का संयुक्त संबंध-चित्र",
    premise: "कथन",
    answer: "सही विकल्प",
    model: "मान्य मॉडल",
    alternate: "दूसरा मान्य मॉडल",
    inside: "पूरा अंदर",
    separate: "पूरी तरह अलग",
    overlap: "कुछ साझा",
    outside: "कुछ बाहर",
    same: "एक ही समूह",
    witness: "साक्षी",
    memberOf: "में है",
    outsideOf: "से बाहर",
  };
  if (locale === "pa-IN") return {
    title: "ਸਹੀ ਵਿਕਲਪ ਦਾ ਇਕੱਠਾ ਸੰਬੰਧ-ਚਿੱਤਰ",
    premise: "ਕਥਨ",
    answer: "ਸਹੀ ਵਿਕਲਪ",
    model: "ਠੀਕ ਮਾਡਲ",
    alternate: "ਦੂਜਾ ਠੀਕ ਮਾਡਲ",
    inside: "ਪੂਰਾ ਅੰਦਰ",
    separate: "ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ",
    overlap: "ਕੁਝ ਸਾਂਝਾ",
    outside: "ਕੁਝ ਬਾਹਰ",
    same: "ਇੱਕੋ ਸਮੂਹ",
    witness: "ਮੈਂਬਰ",
    memberOf: "ਵਿੱਚ ਹੈ",
    outsideOf: "ਤੋਂ ਬਾਹਰ",
  };
  return {
    title: "Combined relation diagram for the correct option",
    premise: "Statement",
    answer: "Correct option",
    model: "Valid model",
    alternate: "Another valid model",
    inside: "all inside",
    separate: "fully separate",
    overlap: "some common",
    outside: "some outside",
    same: "same group",
    witness: "witness",
    memberOf: "in",
    outsideOf: "outside",
  };
}

function relationFor(premise: SurfacePremise): {
  from: TermId;
  to: TermId;
  kind: "ALL" | "NO" | "SOME" | "SOME_NOT" | "ONLY_A_FEW" | "IDENTITY";
} {
  switch (premise.form) {
    case "ONLY": return { from: premise.predicate, to: premise.subject, kind: "ALL" };
    case "ARE_ONLY":
    case "ALL": return { from: premise.subject, to: premise.predicate, kind: "ALL" };
    case "NO": return { from: premise.subject, to: premise.predicate, kind: "NO" };
    case "SOME":
    case "A_FEW": return { from: premise.subject, to: premise.predicate, kind: "SOME" };
    case "SOME_NOT":
    case "NOT_ALL": return { from: premise.subject, to: premise.predicate, kind: "SOME_NOT" };
    case "ONLY_A_FEW": return { from: premise.subject, to: premise.predicate, kind: "ONLY_A_FEW" };
    case "IDENTITY": return { from: premise.subject, to: premise.predicate, kind: "IDENTITY" };
    case "FEW": throw new Error("Plain FEW cannot be rendered in SYL-001 V3.");
  }
}

function termPoints(terms: readonly TermId[]): Readonly<Record<TermId, Point>> {
  const centerX = 360;
  const centerY = 157;
  const radiusX = terms.length <= 3 ? 230 : 260;
  const radiusY = terms.length <= 3 ? 82 : 105;
  const entries = terms.map((term, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / Math.max(terms.length, 1);
    return [term, {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY,
    }] as const;
  });
  return Object.fromEntries(entries);
}

function lineEndpoints(a: Point, b: Point): { x1: number; y1: number; x2: number; y2: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
  const ux = dx / length;
  const uy = dy / length;
  return {
    x1: a.x + ux * 48,
    y1: a.y + uy * 34,
    x2: b.x - ux * 48,
    y2: b.y - uy * 34,
  };
}

function relationLabel(kind: ReturnType<typeof relationFor>["kind"], locale: SylLocale): string {
  const c = copy(locale);
  if (kind === "ALL") return c.inside;
  if (kind === "NO") return c.separate;
  if (kind === "SOME") return c.overlap;
  if (kind === "SOME_NOT") return c.outside;
  if (kind === "ONLY_A_FEW") return `${c.overlap} + ${c.outside}`;
  return c.same;
}

function relationSvg(
  premise: SurfacePremise,
  index: number,
  points: Readonly<Record<TermId, Point>>,
  locale: SylLocale,
): string {
  const relation = relationFor(premise);
  const a = points[relation.from];
  const b = points[relation.to];
  const { x1, y1, x2, y2 } = lineEndpoints(a, b);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const label = `${copy(locale).premise} ${index + 1}: ${relationLabel(relation.kind, locale)}`;

  if (relation.kind === "ALL") {
    return `<g data-premise-id="${esc(premise.premiseId)}" data-relation="ALL"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="rel inclusion" marker-end="url(#arrow)"/><rect x="${midX - 54}" y="${midY - 18}" width="108" height="20" rx="10" class="edge-label-bg"/><text x="${midX}" y="${midY - 4}" text-anchor="middle" class="edge-label">${esc(label)}</text></g>`;
  }
  if (relation.kind === "NO") {
    return `<g data-premise-id="${esc(premise.premiseId)}" data-relation="NO"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="rel exclusion"/><line x1="${midX - 9}" y1="${midY - 9}" x2="${midX + 9}" y2="${midY + 9}" class="cross"/><line x1="${midX + 9}" y1="${midY - 9}" x2="${midX - 9}" y2="${midY + 9}" class="cross"/><rect x="${midX - 58}" y="${midY + 12}" width="116" height="20" rx="10" class="edge-label-bg"/><text x="${midX}" y="${midY + 26}" text-anchor="middle" class="edge-label">${esc(label)}</text></g>`;
  }
  if (relation.kind === "IDENTITY") {
    return `<g data-premise-id="${esc(premise.premiseId)}" data-relation="IDENTITY"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="rel identity" marker-start="url(#arrow-back)" marker-end="url(#arrow)"/><rect x="${midX - 54}" y="${midY - 18}" width="108" height="20" rx="10" class="edge-label-bg"/><text x="${midX}" y="${midY - 4}" text-anchor="middle" class="edge-label">${esc(label)}</text></g>`;
  }

  const witnessX = relation.kind === "SOME_NOT" ? x1 + (x2 - x1) * 0.26 : midX;
  const witnessY = relation.kind === "SOME_NOT" ? y1 + (y2 - y1) * 0.26 : midY;
  const secondWitness = relation.kind === "ONLY_A_FEW"
    ? `<text x="${x1 + (x2 - x1) * 0.22}" y="${y1 + (y2 - y1) * 0.22 - 9}" class="witness">×₂</text>`
    : "";
  return `<g data-premise-id="${esc(premise.premiseId)}" data-relation="${relation.kind}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="rel overlap"/><text x="${witnessX}" y="${witnessY - 8}" text-anchor="middle" class="witness">×₁</text>${secondWitness}<rect x="${midX - 66}" y="${midY + 12}" width="132" height="20" rx="10" class="edge-label-bg"/><text x="${midX}" y="${midY + 26}" text-anchor="middle" class="edge-label">${esc(label)}</text></g>`;
}

function nodeSvg(term: TermId, point: Point, label: string): string {
  return `<g data-term="${esc(term)}"><ellipse cx="${point.x}" cy="${point.y}" rx="65" ry="38" class="set-node"/><text x="${point.x}" y="${point.y + 5}" text-anchor="middle" class="set-label">${esc(label)}</text></g>`;
}

function modelRows(
  model: CanonicalModel,
  locale: SylLocale,
  labels: Readonly<Record<TermId, string>>,
  x: number,
  y: number,
  width: number,
  heading: string,
): string {
  const c = copy(locale);
  const rows = model.occupiedRegions.slice(0, 4).map((region, index) => {
    const inside = region.memberTerms.map((term) => labels[term] ?? term);
    const outside = model.termOrder.filter((term) => !region.memberTerms.includes(term)).map((term) => labels[term] ?? term);
    const text = `${c.witness} x${index + 1}: ${c.memberOf} ${inside.join(", ") || "—"}${outside.length ? `; ${c.outsideOf} ${outside.join(", ")}` : ""}`;
    return `<text x="${x + 14}" y="${y + 42 + index * 21}" class="model-row">${esc(text)}</text>`;
  }).join("");
  return `<g><rect x="${x}" y="${y}" width="${width}" height="${Math.max(76, 58 + Math.min(model.occupiedRegions.length, 4) * 21)}" rx="12" class="model-box"/><text x="${x + 14}" y="${y + 23}" class="model-heading">${esc(heading)}</text>${rows}</g>`;
}

function modeNeedsTwoModels(mode: SylIntegratedDiagramModeV3): boolean {
  return mode === "DUAL_TRUE_FALSE_MODEL" || mode === "EITHER_OR_EXACT_ONE_PROOF";
}

export function renderIntegratedDiagramV3(input: IntegratedDiagramInputV3): {
  spec: SylDiagramSpecV3;
  svg: string;
} {
  const c = copy(input.locale);
  const premises = input.premises.filter((premise) => input.relevantPremiseIds.includes(premise.premiseId));
  const terms = [...new Set(premises.flatMap((premise) => [premise.subject, premise.predicate]))].sort();
  const points = termPoints(terms);
  const relations = premises.map((premise, index) => relationSvg(premise, index, points, input.locale)).join("");
  const nodes = terms.map((term) => nodeSvg(term, points[term], input.termLabels[term] ?? term)).join("");
  const modelStartY = 292;
  const hasModel = input.model !== null;
  const hasAlternate = input.alternateModel !== null && modeNeedsTwoModels(input.mode);
  const totalHeight = hasModel || hasAlternate ? 500 : 390;
  let modelSvg = "";
  if (hasModel && hasAlternate) {
    modelSvg = `${modelRows(input.model!, input.locale, input.termLabels, 24, modelStartY, 328, c.model)}${modelRows(input.alternateModel!, input.locale, input.termLabels, 368, modelStartY, 328, c.alternate)}`;
  } else if (hasModel) {
    modelSvg = modelRows(input.model!, input.locale, input.termLabels, 84, modelStartY, 552, c.model);
  }

  const answerY = hasModel || hasAlternate ? totalHeight - 54 : 330;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 ${totalHeight}" width="100%" role="img" lang="${input.locale}" aria-labelledby="${esc(input.titleId)} ${esc(input.descriptionId)}" data-diagram-count="1" data-correct-option-only="true" data-diagram-mode="${input.mode}" data-diagram-version="syl-integrated-diagram-v3" class="examtree-syl-integrated-v3">
<title id="${esc(input.titleId)}">${esc(c.title)}</title>
<desc id="${esc(input.descriptionId)}">${esc(input.textAlternative)}</desc>
<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#2563eb"/></marker><marker id="arrow-back" markerWidth="8" markerHeight="8" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#7c3aed"/></marker></defs>
<style>.examtree-syl-integrated-v3{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.frame{fill:#fff;stroke:#cbd5e1;stroke-width:1.5}.heading{font-size:15px;font-weight:800;fill:#0f172a}.subheading{font-size:11px;font-weight:700;fill:#475569}.set-node{fill:#eff6ff;stroke:#2563eb;stroke-width:2}.set-label{font-size:12px;font-weight:800;fill:#0f172a}.rel{stroke-width:2.5;fill:none}.inclusion{stroke:#2563eb}.exclusion{stroke:#dc2626;stroke-dasharray:6 5}.overlap{stroke:#0f766e}.identity{stroke:#7c3aed}.cross{stroke:#dc2626;stroke-width:3;stroke-linecap:round}.witness{font-size:16px;font-weight:900;fill:#0f766e}.edge-label-bg{fill:#fff;stroke:#e2e8f0}.edge-label{font-size:9.5px;font-weight:700;fill:#334155}.answer-box{fill:#f0fdf4;stroke:#16a34a;stroke-width:2}.answer-text{font-size:13px;font-weight:800;fill:#166534}.model-box{fill:#f8fafc;stroke:#cbd5e1}.model-heading{font-size:12px;font-weight:800;fill:#0f172a}.model-row{font-size:10px;font-weight:600;fill:#334155}</style>
<rect x="2" y="2" width="716" height="${totalHeight - 4}" rx="16" class="frame"/>
<text x="24" y="30" class="heading">${esc(c.title)}</text>
<text x="24" y="49" class="subheading">${esc(input.textAlternative)}</text>
${relations}${nodes}${modelSvg}
<rect x="24" y="${answerY}" width="672" height="38" rx="11" class="answer-box"/>
<text x="38" y="${answerY + 24}" class="answer-text">${esc(`${c.answer} ${input.correctOptionDisplayIndex}: ${input.correctOptionText}`)}</text>
</svg>`;

  return {
    spec: {
      diagramCount: 1,
      mode: input.mode,
      correctOptionOnly: true,
      allRelevantPremisesIncluded: premises.length === input.relevantPremiseIds.length,
      relevantPremiseIds: input.relevantPremiseIds,
      correctOptionDisplayIndex: input.correctOptionDisplayIndex,
      correctOptionText: input.correctOptionText,
      conclusionIds: input.conclusions.map((conclusion) => conclusion.conclusionId),
      witnessIds: ["x1", "x2", "x3"].slice(0, Math.max(input.model?.occupiedRegions.length ?? 0, input.alternateModel?.occupiedRegions.length ?? 0, 1)),
      model: input.model,
      alternateModel: input.alternateModel,
      titleId: input.titleId,
      descriptionId: input.descriptionId,
      locale: input.locale,
      diagramVersion: "syl-integrated-diagram-v3",
      textAlternative: input.textAlternative,
    },
    svg,
  };
}
