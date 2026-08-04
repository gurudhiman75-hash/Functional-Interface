import type {
  CanonicalModel,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { SylStructuredProofV3 } from "./structured-proof-v3-types";

interface MobileDiagramInput {
  locale: SylLocale;
  displayedPremises: readonly SurfacePremise[];
  termLabels: Readonly<Record<TermId, string>>;
  correctIndex: number;
  correctOptionText: string;
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

function copy(locale: SylLocale) {
  if (locale === "hi-IN") return {
    title: "सही विकल्प का संयुक्त संबंध-चित्र",
    correct: "सही विकल्प",
    all: "पूरा अंदर",
    no: "पूरी तरह अलग",
    some: "कम-से-कम एक साझा",
    someNot: "कम-से-कम एक बाहर",
    onlyFew: "एक अंदर + एक बाहर",
    identity: "एक ही समूह",
    model: "मान्य मॉडल",
    alternate: "दूसरा मान्य मॉडल",
    witness: "साक्षी",
    in: "में",
    out: "से बाहर",
  };
  if (locale === "pa-IN") return {
    title: "ਸਹੀ ਵਿਕਲਪ ਦਾ ਇਕੱਠਾ ਸੰਬੰਧ-ਚਿੱਤਰ",
    correct: "ਸਹੀ ਵਿਕਲਪ",
    all: "ਪੂਰਾ ਅੰਦਰ",
    no: "ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ",
    some: "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਾਂਝਾ",
    someNot: "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਬਾਹਰ",
    onlyFew: "ਇੱਕ ਅੰਦਰ + ਇੱਕ ਬਾਹਰ",
    identity: "ਇੱਕੋ ਸਮੂਹ",
    model: "ਠੀਕ ਮਾਡਲ",
    alternate: "ਦੂਜਾ ਠੀਕ ਮਾਡਲ",
    witness: "ਮੈਂਬਰ",
    in: "ਵਿੱਚ",
    out: "ਤੋਂ ਬਾਹਰ",
  };
  return {
    title: "Combined relation diagram for the correct option",
    correct: "Correct option",
    all: "all inside",
    no: "fully separate",
    some: "at least one common",
    someNot: "at least one outside",
    onlyFew: "one inside + one outside",
    identity: "same group",
    model: "Valid model",
    alternate: "Another valid model",
    witness: "witness",
    in: "in",
    out: "outside",
  };
}

function relation(premise: SurfacePremise): {
  from: TermId;
  to: TermId;
  kind: "ALL" | "NO" | "SOME" | "SOME_NOT" | "ONLY_A_FEW" | "IDENTITY";
} {
  switch (premise.form) {
    case "ONLY": return { from: premise.predicate, to: premise.subject, kind: "ALL" };
    case "ALL":
    case "ARE_ONLY": return { from: premise.subject, to: premise.predicate, kind: "ALL" };
    case "NO": return { from: premise.subject, to: premise.predicate, kind: "NO" };
    case "SOME":
    case "A_FEW": return { from: premise.subject, to: premise.predicate, kind: "SOME" };
    case "SOME_NOT":
    case "NOT_ALL": return { from: premise.subject, to: premise.predicate, kind: "SOME_NOT" };
    case "ONLY_A_FEW": return { from: premise.subject, to: premise.predicate, kind: "ONLY_A_FEW" };
    case "IDENTITY": return { from: premise.subject, to: premise.predicate, kind: "IDENTITY" };
    case "FEW": throw new Error("Plain FEW is not supported by the V3 diagram.");
  }
}

function positions(terms: readonly TermId[]): Readonly<Record<TermId, Point>> {
  const layouts: readonly Point[][] = [
    [],
    [{ x: 180, y: 100 }],
    [{ x: 90, y: 118 }, { x: 270, y: 118 }],
    [{ x: 180, y: 78 }, { x: 82, y: 202 }, { x: 278, y: 202 }],
    [{ x: 92, y: 86 }, { x: 268, y: 86 }, { x: 92, y: 214 }, { x: 268, y: 214 }],
    [{ x: 180, y: 62 }, { x: 76, y: 146 }, { x: 284, y: 146 }, { x: 112, y: 246 }, { x: 248, y: 246 }],
  ];
  const selected = layouts[Math.min(Math.max(terms.length, 1), 5)];
  return Object.fromEntries(terms.map((term, index) => [term, selected[index]]));
}

function endpoints(a: Point, b: Point): { x1: number; y1: number; x2: number; y2: number; mx: number; my: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.max(Math.hypot(dx, dy), 1);
  const ux = dx / length;
  const uy = dy / length;
  const x1 = a.x + ux * 43;
  const y1 = a.y + uy * 26;
  const x2 = b.x - ux * 43;
  const y2 = b.y - uy * 26;
  return { x1, y1, x2, y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
}

function relationLabel(kind: ReturnType<typeof relation>["kind"], locale: SylLocale): string {
  const c = copy(locale);
  if (kind === "ALL") return c.all;
  if (kind === "NO") return c.no;
  if (kind === "SOME") return c.some;
  if (kind === "SOME_NOT") return c.someNot;
  if (kind === "ONLY_A_FEW") return c.onlyFew;
  return c.identity;
}

function edgeSvg(
  premise: SurfacePremise,
  index: number,
  points: Readonly<Record<TermId, Point>>,
  locale: SylLocale,
  markerSuffix: string,
): string {
  const r = relation(premise);
  const a = points[r.from];
  const b = points[r.to];
  const p = endpoints(a, b);
  const offset = index % 2 === 0 ? -11 : 15;
  const labelY = p.my + offset;
  const labelText = relationLabel(r.kind, locale);
  const labelWidth = Math.min(128, Math.max(66, labelText.length * 5.2));
  const label = `<rect x="${p.mx - labelWidth / 2}" y="${labelY - 11}" width="${labelWidth}" height="18" rx="9" class="edge-bg"/><text x="${p.mx}" y="${labelY + 2}" text-anchor="middle" class="edge-label">${esc(labelText)}</text>`;

  if (r.kind === "ALL") {
    return `<g data-premise-id="${esc(premise.premiseId)}" data-relation="ALL"><line x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}" class="edge all" marker-end="url(#arrow-${markerSuffix})"/>${label}</g>`;
  }
  if (r.kind === "NO") {
    return `<g data-premise-id="${esc(premise.premiseId)}" data-relation="NO"><line x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}" class="edge no"/><line x1="${p.mx - 7}" y1="${p.my - 7}" x2="${p.mx + 7}" y2="${p.my + 7}" class="cross"/><line x1="${p.mx + 7}" y1="${p.my - 7}" x2="${p.mx - 7}" y2="${p.my + 7}" class="cross"/>${label}</g>`;
  }
  if (r.kind === "IDENTITY") {
    return `<g data-premise-id="${esc(premise.premiseId)}" data-relation="IDENTITY"><line x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}" class="edge identity" marker-start="url(#arrow-back-${markerSuffix})" marker-end="url(#arrow-${markerSuffix})"/>${label}</g>`;
  }

  const witness = r.kind === "ONLY_A_FEW"
    ? `<text x="${p.mx - 12}" y="${p.my - 5}" class="witness">×₁</text><text x="${p.x1 + (p.x2 - p.x1) * .24}" y="${p.y1 + (p.y2 - p.y1) * .24 - 5}" class="witness">×₂</text>`
    : `<text x="${p.mx}" y="${p.my - 5}" text-anchor="middle" class="witness">×</text>`;
  return `<g data-premise-id="${esc(premise.premiseId)}" data-relation="${r.kind}"><line x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}" class="edge some"/>${witness}${label}</g>`;
}

function wrap(value: string, max = 42): readonly string[] {
  const words = value.trim().split(/\s+/u);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else current = next;
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function textLines(lines: readonly string[], x: number, y: number, className: string, gap = 13): string {
  return `<text x="${x}" y="${y}" class="${className}">${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : gap}">${esc(line)}</tspan>`).join("")}</text>`;
}

function nodeSvg(term: TermId, point: Point, termLabels: Readonly<Record<TermId, string>>): string {
  const lines = wrap(termLabels[term] ?? term, 13);
  const startY = point.y - ((lines.length - 1) * 6);
  return `<g data-term="${esc(term)}"><ellipse cx="${point.x}" cy="${point.y}" rx="48" ry="29" class="node"/>${textLines(lines, point.x, startY + 4, "node-label", 12).replaceAll(`x="${point.x}"`, `x="${point.x}" text-anchor="middle"`)}</g>`;
}

function modelText(
  model: CanonicalModel,
  locale: SylLocale,
  termLabels: Readonly<Record<TermId, string>>,
): readonly string[] {
  const c = copy(locale);
  return model.occupiedRegions.slice(0, 4).map((region, index) => {
    const inside = region.memberTerms.map((term) => termLabels[term] ?? term);
    const outside = model.termOrder.filter((term) => !region.memberTerms.includes(term)).map((term) => termLabels[term] ?? term);
    return `${c.witness} x${index + 1}: ${c.in} ${inside.join(", ") || "—"}${outside.length ? `; ${c.out} ${outside.join(", ")}` : ""}`;
  });
}

function modelBox(
  model: CanonicalModel,
  heading: string,
  locale: SylLocale,
  termLabels: Readonly<Record<TermId, string>>,
  y: number,
): { svg: string; height: number } {
  const rows = modelText(model, locale, termLabels).flatMap((row) => wrap(row, 52));
  const height = 42 + Math.max(1, rows.length) * 13;
  return {
    height,
    svg: `<g><rect x="18" y="${y}" width="324" height="${height}" rx="10" class="model-box"/><text x="30" y="${y + 20}" class="model-heading">${esc(heading)}</text>${textLines(rows, 30, y + 39, "model-row", 13)}</g>`,
  };
}

export function renderMobileFirstIntegratedDiagramV3(
  proof: SylStructuredProofV3,
  input: MobileDiagramInput,
): SylStructuredProofV3 {
  const c = copy(input.locale);
  const premises = input.displayedPremises.filter((premise) => proof.diagramSpec.relevantPremiseIds.includes(premise.premiseId));
  const terms = [...new Set(premises.flatMap((premise) => [premise.subject, premise.predicate]))].sort();
  const points = positions(terms);
  const graphHeight = terms.length >= 4 ? 290 : 250;
  const suffix = proof.diagramSpec.titleId.replace(/^syl-diagram-title-/u, "");
  const edges = premises.map((premise, index) => edgeSvg(premise, index, points, input.locale, suffix)).join("");
  const nodes = terms.map((term) => nodeSvg(term, points[term], input.termLabels)).join("");

  let cursorY = graphHeight + 26;
  let models = "";
  if (proof.diagramSpec.model) {
    const box = modelBox(proof.diagramSpec.model, c.model, input.locale, input.termLabels, cursorY);
    models += box.svg;
    cursorY += box.height + 10;
  }
  if (proof.diagramSpec.alternateModel) {
    const box = modelBox(proof.diagramSpec.alternateModel, c.alternate, input.locale, input.termLabels, cursorY);
    models += box.svg;
    cursorY += box.height + 10;
  }

  const answerLines = wrap(`${c.correct} ${input.correctIndex + 1}: ${input.correctOptionText}`, 49);
  const answerHeight = 26 + answerLines.length * 14;
  const answerY = cursorY;
  const totalHeight = answerY + answerHeight + 16;
  const titleLines = wrap(c.title, 48);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${totalHeight}" width="100%" role="img" lang="${input.locale}" aria-labelledby="${esc(proof.diagramSpec.titleId)} ${esc(proof.diagramSpec.descriptionId)}" data-diagram-count="1" data-correct-option-only="true" data-diagram-mode="${proof.diagramSpec.mode}" data-diagram-version="syl-integrated-diagram-v3-mobile" class="examtree-syl-integrated-v3-mobile">
<title id="${esc(proof.diagramSpec.titleId)}">${esc(c.title)}</title>
<desc id="${esc(proof.diagramSpec.descriptionId)}">${esc(proof.diagramSpec.textAlternative)}</desc>
<defs><marker id="arrow-${suffix}" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#2563eb"/></marker><marker id="arrow-back-${suffix}" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto-start-reverse"><path d="M7,0 L7,6 L0,3 z" fill="#7c3aed"/></marker></defs>
<style>.examtree-syl-integrated-v3-mobile{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.frame{fill:#fff;stroke:#cbd5e1;stroke-width:1.3}.title{font-size:12px;font-weight:850;fill:#0f172a}.node{fill:#eff6ff;stroke:#2563eb;stroke-width:1.8}.node-label{font-size:10.5px;font-weight:800;fill:#0f172a}.edge{stroke-width:2.2;fill:none}.all{stroke:#2563eb}.no{stroke:#dc2626;stroke-dasharray:5 4}.some{stroke:#0f766e}.identity{stroke:#7c3aed}.cross{stroke:#dc2626;stroke-width:2.8;stroke-linecap:round}.witness{font-size:14px;font-weight:900;fill:#0f766e}.edge-bg{fill:#fff;stroke:#dbe3ed}.edge-label{font-size:8.5px;font-weight:800;fill:#334155}.model-box{fill:#f8fafc;stroke:#cbd5e1}.model-heading{font-size:10.5px;font-weight:850;fill:#0f172a}.model-row{font-size:9px;font-weight:650;fill:#334155}.answer-box{fill:#f0fdf4;stroke:#16a34a;stroke-width:1.5}.answer-text{font-size:10px;font-weight:850;fill:#166534}</style>
<rect x="1" y="1" width="358" height="${totalHeight - 2}" rx="13" class="frame"/>
${textLines(titleLines, 16, 21, "title", 14)}
<g transform="translate(0,${titleLines.length > 1 ? 16 : 4})">${edges}${nodes}</g>
${models}
<rect x="18" y="${answerY}" width="324" height="${answerHeight}" rx="9" class="answer-box"/>
${textLines(answerLines, 30, answerY + 21, "answer-text", 14)}
</svg>`;

  return {
    ...proof,
    diagramSpec: {
      ...proof.diagramSpec,
      diagramVersion: "syl-integrated-diagram-v3",
    },
    integratedDiagramSvg: svg,
  };
}
