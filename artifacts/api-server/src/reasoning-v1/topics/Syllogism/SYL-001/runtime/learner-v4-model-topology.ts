import type { CanonicalModel, SurfacePremise, SylLocale, TermId } from "../foundation/types";
import type { SylLearnerPresentationV4 } from "./learner-v4-types";

interface ModelTopologyInputV4 {
  locale: SylLocale;
  displayedPremises: readonly SurfacePremise[];
  termLabels: Readonly<Record<TermId, string>>;
}

type PairGeometry = "identity" | "containment" | "overlap" | "separate";
type PairBasis = "IDENTITY" | "ALL" | "NO" | "DERIVED_NO" | "SOME" | "MODEL_WITNESS" | "NO_RELATION";

interface PairDecision {
  left: TermId;
  right: TermId;
  geometry: PairGeometry;
  basis: PairBasis;
  inner: TermId | null;
  outer: TermId | null;
}

interface CircleShape {
  group: readonly TermId[];
  cx: number;
  cy: number;
  r: number;
}

interface WitnessPoint {
  x: number;
  y: number;
  region: string;
  index: number;
}

interface PanelLayout {
  shapes: readonly CircleShape[];
  witnesses: readonly WitnessPoint[];
  decisions: readonly PairDecision[];
}

interface PanelDimensions {
  width: number;
  height: number;
  top: number;
  inset: number;
  mini: boolean;
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function pairKey(left: TermId, right: TermId): string {
  return [left, right].sort().join("|");
}

function relationKey(subject: TermId, predicate: TermId): string {
  return `${subject}>${predicate}`;
}

function modelSignature(model: CanonicalModel): string {
  return `${model.termOrder.join(",")}|${model.occupiedRegions.map((region) => region.mask).sort((a, b) => a - b).join(",")}`;
}

function label(term: TermId, input: ModelTopologyInputV4): string {
  return input.termLabels[term] ?? term;
}

function joinedLabel(group: readonly TermId[], input: ModelTopologyInputV4): string {
  return group.map((term) => label(term, input)).join(" = ");
}

function buildRelationAuthority(premises: readonly SurfacePremise[], terms: readonly TermId[]) {
  const subset = new Set<string>();
  const directNo = new Set<string>();
  const disjoint = new Set<string>();
  const directOverlap = new Set<string>();

  for (const term of terms) subset.add(relationKey(term, term));

  for (const premise of premises) {
    if (!terms.includes(premise.subject) || !terms.includes(premise.predicate)) continue;
    switch (premise.form) {
      case "ALL":
      case "ARE_ONLY":
        subset.add(relationKey(premise.subject, premise.predicate));
        break;
      case "ONLY":
        subset.add(relationKey(premise.predicate, premise.subject));
        break;
      case "IDENTITY":
        subset.add(relationKey(premise.subject, premise.predicate));
        subset.add(relationKey(premise.predicate, premise.subject));
        break;
      case "NO": {
        const key = pairKey(premise.subject, premise.predicate);
        directNo.add(key);
        disjoint.add(key);
        break;
      }
      case "SOME":
      case "A_FEW":
      case "ONLY_A_FEW":
        directOverlap.add(pairKey(premise.subject, premise.predicate));
        break;
      case "SOME_NOT":
      case "NOT_ALL":
      case "FEW":
        break;
    }
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const a of terms) {
      for (const b of terms) {
        if (!subset.has(relationKey(a, b))) continue;
        for (const c of terms) {
          if (subset.has(relationKey(b, c)) && !subset.has(relationKey(a, c))) {
            subset.add(relationKey(a, c));
            changed = true;
          }
        }
      }
    }
  }

  changed = true;
  while (changed) {
    changed = false;
    const current = [...disjoint].map((key) => key.split("|") as [TermId, TermId]);
    for (const [left, right] of current) {
      const leftSubsets = terms.filter((term) => subset.has(relationKey(term, left)));
      const rightSubsets = terms.filter((term) => subset.has(relationKey(term, right)));
      for (const a of leftSubsets) {
        for (const b of rightSubsets) {
          const key = pairKey(a, b);
          if (a !== b && !disjoint.has(key)) {
            disjoint.add(key);
            changed = true;
          }
        }
      }
    }
  }

  return { subset, directNo, disjoint, directOverlap };
}

function jointWitness(model: CanonicalModel, left: TermId, right: TermId): boolean {
  return model.occupiedRegions.some((region) =>
    region.memberTerms.includes(left) && region.memberTerms.includes(right));
}

function decidePair(
  left: TermId,
  right: TermId,
  model: CanonicalModel,
  authority: ReturnType<typeof buildRelationAuthority>,
): PairDecision {
  const leftInRight = authority.subset.has(relationKey(left, right));
  const rightInLeft = authority.subset.has(relationKey(right, left));
  const key = pairKey(left, right);

  if (leftInRight && rightInLeft) {
    return { left, right, geometry: "identity", basis: "IDENTITY", inner: null, outer: null };
  }
  if (leftInRight) {
    return { left, right, geometry: "containment", basis: "ALL", inner: left, outer: right };
  }
  if (rightInLeft) {
    return { left, right, geometry: "containment", basis: "ALL", inner: right, outer: left };
  }
  if (authority.disjoint.has(key)) {
    return {
      left,
      right,
      geometry: "separate",
      basis: authority.directNo.has(key) ? "NO" : "DERIVED_NO",
      inner: null,
      outer: null,
    };
  }
  if (jointWitness(model, left, right)) {
    return {
      left,
      right,
      geometry: "overlap",
      basis: authority.directOverlap.has(key) ? "SOME" : "MODEL_WITNESS",
      inner: null,
      outer: null,
    };
  }
  return { left, right, geometry: "separate", basis: "NO_RELATION", inner: null, outer: null };
}

function identityGroups(terms: readonly TermId[], decisions: readonly PairDecision[]): readonly (readonly TermId[])[] {
  const parent = new Map<TermId, TermId>(terms.map((term) => [term, term]));
  const find = (term: TermId): TermId => {
    const current = parent.get(term) ?? term;
    if (current === term) return term;
    const root = find(current);
    parent.set(term, root);
    return root;
  };
  const union = (left: TermId, right: TermId) => {
    const a = find(left);
    const b = find(right);
    if (a !== b) parent.set(b, a);
  };
  decisions.filter((decision) => decision.geometry === "identity").forEach((decision) => union(decision.left, decision.right));
  const groups = new Map<TermId, TermId[]>();
  for (const term of terms) {
    const root = find(term);
    const group = groups.get(root) ?? [];
    group.push(term);
    groups.set(root, group);
  }
  return [...groups.values()].map((group) => Object.freeze(group));
}

function permutations(values: readonly number[]): readonly (readonly number[])[] {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) =>
    permutations([...values.slice(0, index), ...values.slice(index + 1)]).map((tail) => [value, ...tail]));
}

function actualGeometry(left: CircleShape, right: CircleShape, margin: number): PairGeometry {
  if (left === right) return "identity";
  const distance = Math.hypot(left.cx - right.cx, left.cy - right.cy);
  if (distance + left.r <= right.r - margin || distance + right.r <= left.r - margin) return "containment";
  if (distance >= left.r + right.r + margin) return "separate";
  return "overlap";
}

function containmentDirectionMatches(
  decision: PairDecision,
  leftShape: CircleShape,
  rightShape: CircleShape,
  margin: number,
): boolean {
  if (decision.geometry !== "containment" || !decision.inner || !decision.outer) return true;
  const inner = leftShape.group.includes(decision.inner) ? leftShape : rightShape;
  const outer = leftShape.group.includes(decision.outer) ? leftShape : rightShape;
  const distance = Math.hypot(inner.cx - outer.cx, inner.cy - outer.cy);
  return distance + inner.r <= outer.r - margin;
}

function candidateTemplates(dimensions: PanelDimensions, groupCount: number): readonly (readonly CircleShape[])[] {
  const { width, height, top, inset } = dimensions;
  const availableHeight = height - top - inset;
  const base = Math.min(width - inset * 2, availableHeight);
  const cx = width / 2;
  const cy = top + availableHeight / 2;
  const r = (factor: number) => Math.round(base * factor);
  const dx = (factor: number) => Math.round(base * factor);
  const group = (index: number, x: number, y: number, radius: number): CircleShape => ({ group: [String(index)], cx: x, cy: y, r: radius });

  if (groupCount === 1) return [[group(0, cx, cy, r(0.34))]];
  if (groupCount === 2) {
    return [
      [group(0, cx - dx(0.31), cy, r(0.23)), group(1, cx + dx(0.31), cy, r(0.23))],
      [group(0, cx - dx(0.17), cy, r(0.29)), group(1, cx + dx(0.17), cy, r(0.29))],
      [group(0, cx, cy, r(0.17)), group(1, cx, cy, r(0.38))],
      [group(0, cx, cy, r(0.38)), group(1, cx, cy, r(0.17))],
    ];
  }

  const templates: CircleShape[][] = [];
  const roles = [0, 1, 2] as const;
  for (const order of permutations(roles)) {
    const [a, b, c] = order;
    const assign = (role: number, x: number, y: number, radius: number): CircleShape => group(role, x, y, radius);

    templates.push([
      assign(a, cx - dx(0.38), cy, r(0.18)),
      assign(b, cx, cy, r(0.18)),
      assign(c, cx + dx(0.38), cy, r(0.18)),
    ]);
    templates.push([
      assign(a, cx - dx(0.22), cy, r(0.25)),
      assign(b, cx + dx(0.02), cy, r(0.25)),
      assign(c, cx + dx(0.41), cy, r(0.18)),
    ]);
    templates.push([
      assign(a, cx - dx(0.42), cy, r(0.27)),
      assign(b, cx, cy, r(0.27)),
      assign(c, cx + dx(0.42), cy, r(0.27)),
    ]);
    templates.push([
      assign(a, cx - dx(0.22), cy - dx(0.12), r(0.29)),
      assign(b, cx + dx(0.22), cy - dx(0.12), r(0.29)),
      assign(c, cx, cy + dx(0.23), r(0.29)),
    ]);
    templates.push([
      assign(a, cx - dx(0.27), cy, r(0.15)),
      assign(b, cx - dx(0.27), cy, r(0.34)),
      assign(c, cx + dx(0.38), cy, r(0.19)),
    ]);
    templates.push([
      assign(a, cx - dx(0.28), cy, r(0.15)),
      assign(b, cx - dx(0.18), cy, r(0.36)),
      assign(c, cx + dx(0.34), cy, r(0.25)),
    ]);
    templates.push([
      assign(a, cx - dx(0.02), cy, r(0.16)),
      assign(b, cx - dx(0.14), cy, r(0.38)),
      assign(c, cx + dx(0.22), cy, r(0.23)),
    ]);
    templates.push([
      assign(a, cx, cy, r(0.14)),
      assign(b, cx, cy, r(0.27)),
      assign(c, cx, cy, r(0.41)),
    ]);
    templates.push([
      assign(a, cx - dx(0.38), cy, r(0.28)),
      assign(b, cx + dx(0.05), cy, r(0.17)),
      assign(c, cx + dx(0.05), cy, r(0.39)),
    ]);
    templates.push([
      assign(a, cx, cy, r(0.28)),
      assign(b, cx - dx(0.38), cy, r(0.23)),
      assign(c, cx + dx(0.38), cy, r(0.23)),
    ]);
  }
  return templates;
}

function groupDecision(
  left: readonly TermId[],
  right: readonly TermId[],
  decisions: readonly PairDecision[],
): PairDecision {
  const candidates = decisions.filter((decision) =>
    (left.includes(decision.left) && right.includes(decision.right))
    || (left.includes(decision.right) && right.includes(decision.left)));
  const rank: Readonly<Record<PairGeometry, number>> = { identity: 4, containment: 3, overlap: 2, separate: 1 };
  return [...candidates].sort((a, b) => rank[b.geometry] - rank[a.geometry])[0]
    ?? { left: left[0], right: right[0], geometry: "separate", basis: "NO_RELATION", inner: null, outer: null };
}

function instantiateCandidate(
  template: readonly CircleShape[],
  groups: readonly (readonly TermId[])[],
): readonly CircleShape[] {
  return [...template]
    .sort((left, right) => Number(left.group[0]) - Number(right.group[0]))
    .map((shape) => ({ ...shape, group: groups[Number(shape.group[0])] }));
}

function candidateMatches(
  shapes: readonly CircleShape[],
  groups: readonly (readonly TermId[])[],
  decisions: readonly PairDecision[],
  margin: number,
): boolean {
  for (let i = 0; i < groups.length; i += 1) {
    for (let j = i + 1; j < groups.length; j += 1) {
      const expected = groupDecision(groups[i], groups[j], decisions);
      const actual = actualGeometry(shapes[i], shapes[j], margin);
      if (actual !== expected.geometry) return false;
      if (!containmentDirectionMatches(expected, shapes[i], shapes[j], margin)) return false;
    }
  }
  return true;
}

function regionGroupMembership(regionTerms: readonly TermId[], groups: readonly (readonly TermId[])[]): readonly boolean[] {
  return groups.map((group) => group.some((term) => regionTerms.includes(term)));
}

function pointValidForRegion(
  x: number,
  y: number,
  shapes: readonly CircleShape[],
  membership: readonly boolean[],
  margin: number,
): boolean {
  return shapes.every((shape, index) => {
    const distance = Math.hypot(x - shape.cx, y - shape.cy);
    return membership[index]
      ? distance <= shape.r - margin
      : distance >= shape.r + margin;
  });
}

function witnessPoints(
  model: CanonicalModel,
  shapes: readonly CircleShape[],
  groups: readonly (readonly TermId[])[],
  dimensions: PanelDimensions,
  margin: number,
): readonly WitnessPoint[] | null {
  const selected: WitnessPoint[] = [];
  const step = dimensions.mini ? 3 : 4;
  for (let index = 0; index < model.occupiedRegions.length; index += 1) {
    const region = model.occupiedRegions[index];
    const membership = regionGroupMembership(region.memberTerms, groups);
    const candidates: Array<{ x: number; y: number; score: number }> = [];
    for (let y = dimensions.top + 8; y <= dimensions.height - dimensions.inset; y += step) {
      for (let x = dimensions.inset; x <= dimensions.width - dimensions.inset; x += step) {
        if (!pointValidForRegion(x, y, shapes, membership, margin)) continue;
        const boundaryScore = Math.min(...shapes.map((shape, shapeIndex) => {
          const distance = Math.hypot(x - shape.cx, y - shape.cy);
          return membership[shapeIndex] ? shape.r - distance : distance - shape.r;
        }));
        const spacingScore = selected.length === 0
          ? 40
          : Math.min(...selected.map((point) => Math.hypot(x - point.x, y - point.y)));
        const centerPenalty = Math.abs(x - dimensions.width / 2) * 0.01;
        candidates.push({ x, y, score: boundaryScore + Math.min(spacingScore, 50) * 0.5 - centerPenalty });
      }
    }
    const best = candidates.sort((a, b) => b.score - a.score)[0];
    if (!best) return null;
    selected.push({
      x: best.x,
      y: best.y,
      region: region.memberTerms.length > 0 ? region.memberTerms.join("&") : "outside-all",
      index: index + 1,
    });
  }
  return selected;
}

function resolveLayout(
  model: CanonicalModel,
  premises: readonly SurfacePremise[],
  dimensions: PanelDimensions,
): PanelLayout | null {
  const terms = model.termOrder.slice(0, 3);
  if (terms.length < 2 || terms.length > 3) return null;
  const authority = buildRelationAuthority(premises, terms);
  const decisions: PairDecision[] = [];
  for (let i = 0; i < terms.length; i += 1) {
    for (let j = i + 1; j < terms.length; j += 1) {
      decisions.push(decidePair(terms[i], terms[j], model, authority));
    }
  }
  const groups = identityGroups(terms, decisions);
  const templates = candidateTemplates(dimensions, groups.length);
  const margin = dimensions.mini ? 2 : 4;
  for (const template of templates) {
    const shapes = instantiateCandidate(template, groups);
    if (!candidateMatches(shapes, groups, decisions, margin)) continue;
    const witnesses = witnessPoints(model, shapes, groups, dimensions, margin + 2)
      ?? witnessPoints(model, shapes, groups, dimensions, 1);
    if (witnesses) return { shapes, witnesses, decisions };
  }
  return null;
}

function pairMetadata(decisions: readonly PairDecision[], panelId: string): string {
  return decisions.map((decision) => {
    const direction = decision.geometry === "containment" && decision.inner && decision.outer
      ? ` data-inner="${esc(decision.inner)}" data-outer="${esc(decision.outer)}"`
      : "";
    return `<g data-panel="${esc(panelId)}" data-pair="${esc(decision.left)}|${esc(decision.right)}" data-geometry="${decision.geometry}" data-basis="${decision.basis}"${direction}></g>`;
  }).join("");
}

function fittedText(x: number, y: number, text: string, className: string, maxWidth: number): string {
  const fit = [...text].length > 7 ? ` textLength="${Math.max(30, maxWidth)}" lengthAdjust="spacingAndGlyphs"` : "";
  return `<text x="${x}" y="${y}" text-anchor="middle" class="${className}"${fit}>${esc(text)}</text>`;
}

function shapeLabelPosition(shape: CircleShape, shapes: readonly CircleShape[]): readonly [number, number] {
  const containing = shapes.filter((candidate) =>
    candidate !== shape
    && Math.hypot(shape.cx - candidate.cx, shape.cy - candidate.cy) + shape.r < candidate.r - 2);
  if (containing.length > 0) return [shape.cx, shape.cy + 4];
  return [shape.cx, shape.cy - shape.r + 17];
}

function renderPanel(
  model: CanonicalModel,
  input: ModelTopologyInputV4,
  dimensions: PanelDimensions,
  heading: string,
  panelId: string,
  xOffset = 0,
): { svg: string; layout: PanelLayout } | null {
  const layout = resolveLayout(model, input.displayedPremises, dimensions);
  if (!layout) return null;
  const classes = ["set-a", "set-b", "set-c"] as const;
  const circles = layout.shapes.map((shape, index) => {
    const [lx, ly] = shapeLabelPosition(shape, layout.shapes);
    const terms = shape.group.join(",");
    return `<g data-set-group="${esc(terms)}"><circle data-panel="${esc(panelId)}" data-terms="${esc(terms)}" data-cx="${shape.cx}" data-cy="${shape.cy}" data-r="${shape.r}" cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" class="${classes[index]}"/>${fittedText(lx, ly, joinedLabel(shape.group, input), dimensions.mini ? "mini-model-label" : "model-label", shape.r * 1.35)}</g>`;
  }).join("");
  const witnesses = layout.witnesses.map((point) =>
    `<text data-panel="${esc(panelId)}" x="${point.x}" y="${point.y}" text-anchor="middle" class="${dimensions.mini ? "mini-witness" : "model-witness"}" data-witness-region="${esc(point.region)}">×${point.index}</text>`).join("");
  const transform = xOffset === 0 ? "" : ` transform="translate(${xOffset} 0)"`;
  const panelWidth = dimensions.width;
  const panelHeight = dimensions.height;
  return {
    svg: `<!-- panel:${esc(panelId)}:start --><g data-model-panel="${esc(panelId)}"${transform}><rect x="2" y="4" width="${panelWidth - 4}" height="${panelHeight - 8}" rx="${dimensions.mini ? 11 : 14}" class="panel"/><text x="${panelWidth / 2}" y="25" text-anchor="middle" class="panel-label">${esc(heading)}</text>${pairMetadata(layout.decisions, panelId)}${circles}${witnesses}</g><!-- panel:${esc(panelId)}:end -->`,
    layout,
  };
}

function heading(locale: SylLocale, kind: "TRUE" | "FALSE" | "POSSIBILITY"): string {
  if (locale === "hi-IN") {
    if (kind === "TRUE") return "सत्य हो सकता है";
    if (kind === "FALSE") return "असत्य हो सकता है";
    return "एक सही व्यवस्था";
  }
  if (locale === "pa-IN") {
    if (kind === "TRUE") return "ਸਹੀ ਹੋ ਸਕਦਾ ਹੈ";
    if (kind === "FALSE") return "ਗਲਤ ਹੋ ਸਕਦਾ ਹੈ";
    return "ਇੱਕ ਠੀਕ ਬਣਤਰ";
  }
  if (kind === "TRUE") return "CAN BE TRUE";
  if (kind === "FALSE") return "CAN BE FALSE";
  return "ONE VALID ARRANGEMENT";
}

function modelLegend(locale: SylLocale): string {
  if (locale === "hi-IN") return "हर × एक संभावित सदस्य दिखाता है; अंक अलग सदस्यों को पहचानते हैं। जिन वर्गों के बीच न कथन-संबंध है और न साझा मॉडल-सदस्य, उनके वृत्त अलग हैं।";
  if (locale === "pa-IN") return "ਹਰ × ਇੱਕ ਸੰਭਵ ਮੈਂਬਰ ਦਿਖਾਉਂਦਾ ਹੈ; ਅੰਕ ਵੱਖਰੇ ਮੈਂਬਰਾਂ ਨੂੰ ਪਛਾਣਦੇ ਹਨ। ਜਿਨ੍ਹਾਂ ਵਰਗਾਂ ਵਿਚ ਨਾ ਕਥਨ-ਸੰਬੰਧ ਹੈ ਅਤੇ ਨਾ ਸਾਂਝਾ ਮਾਡਲ-ਮੈਂਬਰ, ਉਨ੍ਹਾਂ ਦੇ ਘੇਰੇ ਵੱਖ ਹਨ।";
  return "Each × represents one possible member; the numbers distinguish different members. Classes with neither a premise relation nor a shared model member are shown separately.";
}

function wrapSvg(
  presentation: SylLearnerPresentationV4,
  locale: SylLocale,
  body: string,
  height: number,
  caption: string,
): string {
  const suffix = presentation.administratorProof.identity.reviewVersionId.slice(0, 18);
  const titleId = `syl-v4-title-${suffix}`;
  const descId = `syl-v4-desc-${suffix}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${height}" role="img" lang="${locale}" aria-labelledby="${titleId} ${descId}" data-venn-v4="true" data-diagram-mode="${presentation.diagram.mode}" data-answer-sentence="false" data-relation-aware-model="true">
    <title id="${titleId}">${esc(caption)}</title>
    <desc id="${descId}">${esc(caption)}</desc>
    <style>
      .set-a{fill:#dbeafe;fill-opacity:.76;stroke:#2563eb;stroke-width:2.5}
      .set-b{fill:#fef3c7;fill-opacity:.70;stroke:#d97706;stroke-width:2.5}
      .set-c{fill:#e2e8f0;fill-opacity:.70;stroke:#475569;stroke-width:2.5}
      .model-label{font:750 12px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a}
      .mini-model-label{font:750 12px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a}
      .model-witness{font:900 21px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#111827}
      .mini-witness{font:900 17px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#111827}
      .panel{fill:#fff;stroke:#94a3b8;stroke-width:1.5}
      .panel-label{font:800 12px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a;letter-spacing:.02em}
    </style>
    ${body}
  </svg>`;
}

export function renderRelationAwareModelDiagramV4(
  presentation: SylLearnerPresentationV4,
  input: ModelTopologyInputV4,
): SylLearnerPresentationV4["diagram"] | null {
  const diagram = presentation.diagram;
  if (!diagram.enabled || !diagram.svg) return null;
  const legend = modelLegend(input.locale);
  const caption = `${diagram.caption ?? ""} ${legend}`.trim();

  if (diagram.mode === "VENN_COUNTEREXAMPLE" || diagram.mode === "VENN_POSSIBILITY") {
    const model = diagram.mode === "VENN_COUNTEREXAMPLE"
      ? presentation.administratorProof.counterModel ?? presentation.administratorProof.diagramSpecification.v3.model
      : presentation.administratorProof.proofModel ?? presentation.administratorProof.diagramSpecification.v3.model;
    if (!model || model.termOrder.length < 2 || model.termOrder.length > 3) return null;
    const dimensions: PanelDimensions = { width: 344, height: 300, top: 38, inset: 12, mini: false };
    const panel = renderPanel(
      model,
      input,
      dimensions,
      heading(input.locale, diagram.mode === "VENN_COUNTEREXAMPLE" ? "FALSE" : "POSSIBILITY"),
      diagram.mode,
      8,
    );
    if (!panel) return null;
    return {
      ...diagram,
      svg: wrapSvg(presentation, input.locale, panel.svg, 318, caption),
      caption,
      accessibleDescription: caption,
      modelSignature: diagram.modelSignature ?? modelSignature(model),
    };
  }

  if (diagram.mode === "VENN_DUAL_MODEL") {
    const primary = presentation.administratorProof.proofModel ?? presentation.administratorProof.diagramSpecification.v3.model;
    const alternate = presentation.administratorProof.counterModel ?? presentation.administratorProof.alternateModel ?? presentation.administratorProof.diagramSpecification.v3.alternateModel;
    if (!primary || !alternate || primary.termOrder.length < 2 || primary.termOrder.length > 3 || alternate.termOrder.length < 2 || alternate.termOrder.length > 3) return null;
    const dimensions: PanelDimensions = { width: 174, height: 206, top: 34, inset: 7, mini: true };
    const truePanel = renderPanel(primary, input, dimensions, heading(input.locale, "TRUE"), "TRUE", 0);
    const falsePanel = renderPanel(alternate, input, dimensions, heading(input.locale, "FALSE"), "FALSE", 184);
    if (!truePanel || !falsePanel) return null;
    return {
      ...diagram,
      svg: wrapSvg(presentation, input.locale, `${truePanel.svg}${falsePanel.svg}`, 214, caption),
      caption,
      accessibleDescription: caption,
      modelSignature: diagram.modelSignature ?? `${modelSignature(primary)}||${modelSignature(alternate)}`,
    };
  }

  return null;
}
