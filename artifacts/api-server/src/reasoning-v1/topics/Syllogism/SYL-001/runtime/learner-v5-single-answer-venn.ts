import { solveConstraintSatisfiability } from "../foundation/primary-solver";
import type {
  CanonicalModel,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type { TermAssignment } from "./localization";
import type { SylLearnerPresentationV5 } from "./learner-v5-types";

interface Point {
  x: number;
  y: number;
}

interface SetShape extends Point {
  term: TermId;
  radius: number;
  depth: number;
}

type PairGeometry = "IDENTITY" | "CONTAINMENT" | "OVERLAP" | "SEPARATE";

interface PairDecision {
  left: TermId;
  right: TermId;
  geometry: PairGeometry;
  inner: TermId | null;
  outer: TermId | null;
  directNo: boolean;
}

interface RelationAuthority {
  subset: Set<string>;
  disjoint: Set<string>;
  directNo: Set<string>;
  directOverlap: Set<string>;
}

export interface SingleAnswerVennResultV5 {
  svg: string;
  caption: string;
  accessibleDescription: string;
  semanticSignature: string;
  modelSignature: string | null;
}

const WIDTH = 720;
const DIAGRAM_TOP = 24;
const DIAGRAM_BOTTOM = 246;
const HEIGHT = 270;

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function relationKey(subject: TermId, predicate: TermId): string {
  return `${subject}>${predicate}`;
}

function pairKey(left: TermId, right: TermId): string {
  return [left, right].sort().join("|");
}

function hash(value: string): number {
  let result = 0;
  for (const character of value) {
    result = (result * 31 + (character.codePointAt(0) ?? 0)) >>> 0;
  }
  return result;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function labelsFor(
  term: TermId,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  return assignment[term]?.labels[locale] ?? term;
}

function firstAppearanceTerms(question: GeneratedSylQuestionV4): readonly TermId[] {
  const terms: TermId[] = [];
  const add = (term: TermId) => {
    if (!terms.includes(term)) terms.push(term);
  };
  question.structuredPrompt.premises.forEach((premise) => {
    add(premise.subject);
    add(premise.predicate);
  });
  question.structuredPrompt.conclusions.forEach((conclusion) => {
    add(conclusion.subject);
    add(conclusion.predicate);
  });
  return terms;
}

function addPremiseAuthority(
  premise: SurfacePremise,
  authority: RelationAuthority,
): void {
  switch (premise.form) {
    case "ALL":
    case "ARE_ONLY":
      authority.subset.add(relationKey(premise.subject, premise.predicate));
      return;
    case "ONLY":
      authority.subset.add(relationKey(premise.predicate, premise.subject));
      return;
    case "IDENTITY":
      authority.subset.add(relationKey(premise.subject, premise.predicate));
      authority.subset.add(relationKey(premise.predicate, premise.subject));
      return;
    case "NO": {
      const key = pairKey(premise.subject, premise.predicate);
      authority.disjoint.add(key);
      authority.directNo.add(key);
      return;
    }
    case "SOME":
    case "A_FEW":
    case "ONLY_A_FEW":
      authority.directOverlap.add(pairKey(premise.subject, premise.predicate));
      return;
    case "SOME_NOT":
    case "NOT_ALL":
    case "FEW":
      return;
  }
}

function buildAuthority(
  premises: readonly SurfacePremise[],
  terms: readonly TermId[],
): RelationAuthority {
  const authority: RelationAuthority = {
    subset: new Set<string>(),
    disjoint: new Set<string>(),
    directNo: new Set<string>(),
    directOverlap: new Set<string>(),
  };
  terms.forEach((term) => authority.subset.add(relationKey(term, term)));
  premises.forEach((premise) => addPremiseAuthority(premise, authority));

  let changed = true;
  while (changed) {
    changed = false;
    for (const left of terms) {
      for (const middle of terms) {
        if (!authority.subset.has(relationKey(left, middle))) continue;
        for (const right of terms) {
          if (
            authority.subset.has(relationKey(middle, right))
            && !authority.subset.has(relationKey(left, right))
          ) {
            authority.subset.add(relationKey(left, right));
            changed = true;
          }
        }
      }
    }
  }

  changed = true;
  while (changed) {
    changed = false;
    for (const key of [...authority.disjoint]) {
      const [left, right] = key.split("|") as [TermId, TermId];
      const leftSubsets = terms.filter((term) => authority.subset.has(relationKey(term, left)));
      const rightSubsets = terms.filter((term) => authority.subset.has(relationKey(term, right)));
      for (const a of leftSubsets) {
        for (const b of rightSubsets) {
          if (a === b) continue;
          const derived = pairKey(a, b);
          if (!authority.disjoint.has(derived)) {
            authority.disjoint.add(derived);
            changed = true;
          }
        }
      }
    }
  }
  return authority;
}

function modelSignature(model: CanonicalModel | null): string | null {
  if (!model) return null;
  const masks = model.occupiedRegions.map((region) => region.mask).sort((a, b) => a - b);
  return `${model.termOrder.join(",")}|${masks.join(",")}`;
}

function selectSingleModel(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  terms: readonly TermId[],
): CanonicalModel | null {
  const proof = presentation.administratorProof;
  const mode = presentation.learnerExplanation.mode;
  const preferred = mode === "COUNTEREXAMPLE" || mode === "DIRECT_CONTRADICTION"
    ? proof.counterModel
    : proof.proofModel;
  const stored = preferred
    ?? proof.diagramSpecification.v3.model
    ?? proof.proofModel
    ?? proof.counterModel
    ?? proof.alternateModel
    ?? proof.diagramSpecification.v3.alternateModel;
  if (stored) return stored;

  const solverTerms = Object.keys(question.structuredPrompt.termKeysById).sort() as TermId[];
  const solved = solveConstraintSatisfiability(
    question.structuredPrompt.normalizedConstraints,
    solverTerms.length > 0 ? solverTerms : terms,
  );
  return solved.model;
}

function modelHasJointMember(model: CanonicalModel | null, left: TermId, right: TermId): boolean {
  return Boolean(model?.occupiedRegions.some((region) =>
    region.memberTerms.includes(left) && region.memberTerms.includes(right)));
}

function pairDecision(
  left: TermId,
  right: TermId,
  authority: RelationAuthority,
  model: CanonicalModel | null,
): PairDecision {
  const leftInRight = authority.subset.has(relationKey(left, right));
  const rightInLeft = authority.subset.has(relationKey(right, left));
  const key = pairKey(left, right);
  if (leftInRight && rightInLeft) {
    return { left, right, geometry: "IDENTITY", inner: null, outer: null, directNo: false };
  }
  if (leftInRight) {
    return { left, right, geometry: "CONTAINMENT", inner: left, outer: right, directNo: false };
  }
  if (rightInLeft) {
    return { left, right, geometry: "CONTAINMENT", inner: right, outer: left, directNo: false };
  }
  if (authority.disjoint.has(key)) {
    return {
      left,
      right,
      geometry: "SEPARATE",
      inner: null,
      outer: null,
      directNo: authority.directNo.has(key),
    };
  }
  if (authority.directOverlap.has(key) || modelHasJointMember(model, left, right)) {
    return { left, right, geometry: "OVERLAP", inner: null, outer: null, directNo: false };
  }
  return { left, right, geometry: "SEPARATE", inner: null, outer: null, directNo: false };
}

function strictSupersetCount(
  term: TermId,
  terms: readonly TermId[],
  authority: RelationAuthority,
): number {
  return terms.filter((candidate) =>
    candidate !== term
    && authority.subset.has(relationKey(term, candidate))
    && !authority.subset.has(relationKey(candidate, term))).length;
}

function smallestParents(
  term: TermId,
  terms: readonly TermId[],
  authority: RelationAuthority,
): readonly TermId[] {
  const supersets = terms.filter((candidate) =>
    candidate !== term
    && authority.subset.has(relationKey(term, candidate))
    && !authority.subset.has(relationKey(candidate, term)));
  return supersets.filter((candidate) => !supersets.some((other) =>
    other !== candidate
    && authority.subset.has(relationKey(other, candidate))
    && !authority.subset.has(relationKey(candidate, other))));
}

function initialShapes(
  terms: readonly TermId[],
  authority: RelationAuthority,
): Map<TermId, SetShape> {
  const shapes = new Map<TermId, SetShape>();
  const roots = terms.filter((term) => smallestParents(term, terms, authority).length === 0);
  const rootOrder = roots.length > 0 ? roots : terms;
  const gap = rootOrder.length <= 1 ? 0 : 520 / (rootOrder.length - 1);
  rootOrder.forEach((term, index) => {
    shapes.set(term, {
      term,
      x: rootOrder.length === 1 ? WIDTH / 2 : 100 + index * gap,
      y: 128 + (index % 2 === 0 ? -8 : 8),
      radius: 82,
      depth: 0,
    });
  });

  const unresolved = terms.filter((term) => !shapes.has(term));
  for (let pass = 0; pass < terms.length + 2 && unresolved.length > 0; pass += 1) {
    for (let index = unresolved.length - 1; index >= 0; index -= 1) {
      const term = unresolved[index];
      const parents = smallestParents(term, terms, authority);
      const available = parents.map((parent) => shapes.get(parent)).filter((shape): shape is SetShape => Boolean(shape));
      if (available.length === 0) continue;
      const depth = strictSupersetCount(term, terms, authority);
      const averageX = available.reduce((sum, shape) => sum + shape.x, 0) / available.length;
      const averageY = available.reduce((sum, shape) => sum + shape.y, 0) / available.length;
      const jitter = (hash(term) % 3 - 1) * 8;
      shapes.set(term, {
        term,
        x: averageX + jitter,
        y: averageY + Math.min(22, depth * 8),
        radius: clamp(82 - depth * 16, 32, 64),
        depth,
      });
      unresolved.splice(index, 1);
    }
  }

  unresolved.forEach((term, index) => {
    shapes.set(term, {
      term,
      x: 100 + index * 110,
      y: 128,
      radius: 52,
      depth: 0,
    });
  });
  return shapes;
}

function moveApart(left: SetShape, right: SetShape, minimumDistance: number, strength: number): void {
  let dx = right.x - left.x;
  let dy = right.y - left.y;
  let distance = Math.hypot(dx, dy);
  if (distance >= minimumDistance) return;
  if (distance < 0.1) {
    dx = (hash(`${left.term}:${right.term}`) % 2 === 0 ? 1 : -1) * 0.5;
    dy = 0.25;
    distance = Math.hypot(dx, dy);
  }
  const amount = (minimumDistance - distance) * strength;
  const ux = dx / distance;
  const uy = dy / distance;
  left.x -= ux * amount;
  left.y -= uy * amount * 0.55;
  right.x += ux * amount;
  right.y += uy * amount * 0.55;
}

function moveTowardDistance(left: SetShape, right: SetShape, target: number, strength: number): void {
  let dx = right.x - left.x;
  let dy = right.y - left.y;
  let distance = Math.hypot(dx, dy);
  if (distance < 0.1) {
    dx = 1;
    dy = 0;
    distance = 1;
  }
  const amount = (distance - target) * strength;
  const ux = dx / distance;
  const uy = dy / distance;
  left.x += ux * amount;
  left.y += uy * amount * 0.55;
  right.x -= ux * amount;
  right.y -= uy * amount * 0.55;
}

function enforceContainment(inner: SetShape, outer: SetShape, iteration: number): void {
  inner.radius = Math.min(inner.radius, Math.max(28, outer.radius - 19));
  const offset = ((hash(inner.term) % 3) - 1) * Math.min(9, outer.radius - inner.radius - 4);
  const targetX = outer.x + offset;
  const targetY = outer.y + Math.min(18, 7 + inner.depth * 4);
  const strength = iteration < 80 ? 0.24 : 0.38;
  inner.x += (targetX - inner.x) * strength;
  inner.y += (targetY - inner.y) * strength;
  const dx = inner.x - outer.x;
  const dy = inner.y - outer.y;
  const distance = Math.hypot(dx, dy);
  const maximum = Math.max(1, outer.radius - inner.radius - 5);
  if (distance > maximum) {
    inner.x = outer.x + dx / distance * maximum;
    inner.y = outer.y + dy / distance * maximum;
  }
}

function resolveLayout(
  terms: readonly TermId[],
  authority: RelationAuthority,
  model: CanonicalModel | null,
): { shapes: readonly SetShape[]; decisions: readonly PairDecision[] } {
  const map = initialShapes(terms, authority);
  const decisions: PairDecision[] = [];
  for (let left = 0; left < terms.length; left += 1) {
    for (let right = left + 1; right < terms.length; right += 1) {
      decisions.push(pairDecision(terms[left], terms[right], authority, model));
    }
  }

  for (let iteration = 0; iteration < 220; iteration += 1) {
    for (const decision of decisions) {
      const left = map.get(decision.left)!;
      const right = map.get(decision.right)!;
      if (decision.geometry === "IDENTITY") {
        const centerX = (left.x + right.x) / 2;
        const centerY = (left.y + right.y) / 2;
        left.x += (centerX - left.x) * 0.35;
        left.y += (centerY - left.y) * 0.35;
        right.x += (centerX - right.x) * 0.35;
        right.y += (centerY - right.y) * 0.35;
        const radius = Math.min(left.radius, right.radius);
        left.radius = radius;
        right.radius = radius;
      } else if (decision.geometry === "OVERLAP") {
        const minimum = Math.abs(left.radius - right.radius) + 16;
        const maximum = left.radius + right.radius - 16;
        const target = clamp((left.radius + right.radius) * 0.62, minimum, maximum);
        moveTowardDistance(left, right, target, 0.035);
      } else if (decision.geometry === "SEPARATE") {
        moveApart(left, right, left.radius + right.radius + 16, decision.directNo ? 0.08 : 0.035);
      }
    }

    for (const decision of decisions) {
      if (decision.geometry !== "CONTAINMENT" || !decision.inner || !decision.outer) continue;
      enforceContainment(map.get(decision.inner)!, map.get(decision.outer)!, iteration);
    }

    for (const shape of map.values()) {
      shape.x = clamp(shape.x, shape.radius + 24, WIDTH - shape.radius - 24);
      shape.y = clamp(shape.y, DIAGRAM_TOP + shape.radius, DIAGRAM_BOTTOM - shape.radius);
    }
  }

  return { shapes: terms.map((term) => map.get(term)!), decisions };
}

function pointInside(shape: SetShape, x: number, y: number, margin: number): boolean {
  return Math.hypot(x - shape.x, y - shape.y) <= shape.radius - margin;
}

function pointOutside(shape: SetShape, x: number, y: number, margin: number): boolean {
  return Math.hypot(x - shape.x, y - shape.y) >= shape.radius + margin;
}

function witnessPoints(
  model: CanonicalModel | null,
  shapes: readonly SetShape[],
): readonly { x: number; y: number; region: string; index: number }[] {
  if (!model) return [];
  const selected: Array<{ x: number; y: number; region: string; index: number }> = [];
  for (let regionIndex = 0; regionIndex < Math.min(model.occupiedRegions.length, 5); regionIndex += 1) {
    const region = model.occupiedRegions[regionIndex];
    const candidates: Array<{ x: number; y: number; score: number }> = [];
    for (let y = 42; y <= 224; y += 6) {
      for (let x = 28; x <= 692; x += 6) {
        const valid = shapes.every((shape) => region.memberTerms.includes(shape.term)
          ? pointInside(shape, x, y, 7)
          : pointOutside(shape, x, y, 7));
        if (!valid) continue;
        const boundary = Math.min(...shapes.map((shape) => {
          const distance = Math.hypot(x - shape.x, y - shape.y);
          return region.memberTerms.includes(shape.term)
            ? shape.radius - distance
            : distance - shape.radius;
        }));
        const spacing = selected.length === 0
          ? 48
          : Math.min(...selected.map((point) => Math.hypot(x - point.x, y - point.y)));
        candidates.push({ x, y, score: boundary + Math.min(spacing, 60) * 0.45 });
      }
    }
    const best = candidates.sort((a, b) => b.score - a.score)[0];
    if (!best) continue;
    selected.push({
      x: best.x,
      y: best.y,
      region: region.memberTerms.length > 0 ? region.memberTerms.join("&") : "outside-all",
      index: regionIndex + 1,
    });
  }
  return selected;
}

function fittedLabel(shape: SetShape, text: string, nested: boolean): string {
  const labelY = nested ? shape.y + 5 : shape.y - shape.radius + 18;
  const maxWidth = Math.max(42, shape.radius * 1.45);
  const fit = [...text].length > 9
    ? ` textLength="${maxWidth}" lengthAdjust="spacingAndGlyphs"`
    : "";
  return `<text x="${shape.x.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" class="set-label"${fit}>${esc(text)}</text>`;
}

function separationMarks(
  decisions: readonly PairDecision[],
  shapeMap: ReadonlyMap<TermId, SetShape>,
): string {
  return decisions.filter((decision) => decision.directNo).map((decision) => {
    const left = shapeMap.get(decision.left)!;
    const right = shapeMap.get(decision.right)!;
    const dx = right.x - left.x;
    const dy = right.y - left.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / distance;
    const uy = dy / distance;
    const leftEdge = { x: left.x + ux * left.radius, y: left.y + uy * left.radius };
    const rightEdge = { x: right.x - ux * right.radius, y: right.y - uy * right.radius };
    const x = (leftEdge.x + rightEdge.x) / 2;
    const y = (leftEdge.y + rightEdge.y) / 2;
    return `<text x="${x.toFixed(1)}" y="${(y + 7).toFixed(1)}" text-anchor="middle" class="separation-mark" data-no-pair="${esc(pairKey(decision.left, decision.right))}">×</text>`;
  }).join("");
}

function localizedCaption(
  locale: SylLocale,
  presentation: SylLearnerPresentationV5,
): string {
  const answer = `${presentation.answer.label}: ${presentation.answer.text}`;
  if (locale === "hi-IN") return `सही विकल्प के लिए एक संयुक्त वेन व्यवस्था — ${answer}`;
  if (locale === "pa-IN") return `ਸਹੀ ਵਿਕਲਪ ਲਈ ਇੱਕੋ ਇਕੱਠੀ ਵੇਨ ਬਣਤਰ — ${answer}`;
  return `One combined Venn arrangement for the marked answer — ${answer}`;
}

export function renderSingleAnswerVennV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  assignment: TermAssignment,
): SingleAnswerVennResultV5 {
  const terms = firstAppearanceTerms(question);
  const authority = buildAuthority(question.structuredPrompt.premises, terms);
  const model = selectSingleModel(question, presentation, terms);
  const { shapes, decisions } = resolveLayout(terms, authority, model);
  const shapeMap = new Map(shapes.map((shape) => [shape.term, shape] as const));
  const witnesses = witnessPoints(model, shapes);
  const caption = localizedCaption(question.locale, presentation);
  const titleId = `${question.qlId}-${question.seed}-${question.locale}-single-answer-title`.replace(/[^a-zA-Z0-9_-]/gu, "-");
  const descId = `${question.qlId}-${question.seed}-${question.locale}-single-answer-desc`.replace(/[^a-zA-Z0-9_-]/gu, "-");

  const circles = [...shapes]
    .sort((left, right) => right.radius - left.radius || left.depth - right.depth)
    .map((shape, index) => {
      const nested = shape.depth > 0;
      const colourClass = `set-${String.fromCharCode(97 + index % 5)}`;
      return `<g data-set="${esc(shape.term)}" data-depth="${shape.depth}"><circle cx="${shape.x.toFixed(1)}" cy="${shape.y.toFixed(1)}" r="${shape.radius.toFixed(1)}" class="set-circle ${colourClass}"/>${fittedLabel(shape, labelsFor(shape.term, question.locale, assignment), nested)}</g>`;
    }).join("");
  const witnessSvg = witnesses.map((point) =>
    `<text x="${point.x}" y="${point.y}" text-anchor="middle" class="witness" data-witness-region="${esc(point.region)}">×${point.index}</text>`).join("");
  const noMarks = separationMarks(decisions, shapeMap);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="100%" role="img" lang="${question.locale}" aria-labelledby="${titleId} ${descId}" data-diagram-count="1" data-single-answer-venn="true" data-correct-option-only="true" data-comparison-panels="0" class="examtree-venn-svg examtree-single-answer-venn">
<title id="${titleId}">${esc(caption)}</title>
<desc id="${descId}">${esc(caption)}. All relevant sets appear in one arrangement.</desc>
<style>
  .set-circle{stroke-width:2.4;fill-opacity:.34}
  .set-a{fill:#dbeafe;stroke:#2563eb}.set-b{fill:#fef3c7;stroke:#d97706}.set-c{fill:#dcfce7;stroke:#16a34a}.set-d{fill:#fce7f3;stroke:#db2777}.set-e{fill:#ede9fe;stroke:#7c3aed}
  .set-label{font:750 14px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round}
  .witness{font:900 22px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#111827;paint-order:stroke;stroke:#fff;stroke-width:2px}
  .separation-mark{font:800 23px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#475569;paint-order:stroke;stroke:#fff;stroke-width:2px}
</style>
${circles}${noMarks}${witnessSvg}
</svg>`;

  const classificationSignature = presentation.learnerExplanation.conclusionResults
    .map((entry) => entry.status)
    .join(",") || "ANSWER_ONLY";
  return {
    svg,
    caption,
    accessibleDescription: `${caption}. All relevant sets are shown together in a single Venn arrangement.`,
    semanticSignature: `syl-v5:focused-venn:single-answer:${classificationSignature}:${question.qlId}:${question.seed}:${question.locale}`,
    modelSignature: modelSignature(model),
  };
}
