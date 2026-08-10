import type { SurfacePremise, TermId } from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import { exactVennHasUnauthorisedContainmentDirectionV5 } from "./learner-v5-directional-containment-safety";
import type { ExactVennResultV5 } from "./learner-v5-exact-venn";
import { exactVennAddsUnstatedStrongRelationV5 } from "./learner-v5-exact-venn-safety";
import { enforceExistentialCompletenessV5 } from "./learner-v5-existential-completeness";
import type { SylLearnerPresentationV5 } from "./learner-v5-types";
import { correctExactVennWitnessProofV5 } from "./learner-v5-witness-proof";
import { finalizeWitnessClosureV5 } from "./learner-v5-witness-closure-finalizer";
import type { TermAssignment } from "./localization";

interface ShapeSpec { cx: number; cy: number; r: number }
interface Shape extends ShapeSpec { term: TermId }
type RelationForm = "ALL" | "NO" | "SOME" | "SOME_NOT" | "IDENTITY";
interface Relation { form: RelationForm; subject: TermId; predicate: TermId }
interface Authority { subset: ReadonlySet<string>; disjoint: ReadonlySet<string> }

const EPSILON = 2;

const SUPPLEMENTAL_TEMPLATES: readonly (readonly ShapeSpec[])[] = [
  // One forced containment plus a third class that properly overlaps both circles.
  [{ cx: 190, cy: 108, r: 78 }, { cx: 165, cy: 108, r: 36 }, { cx: 105, cy: 108, r: 62 }],
  [{ cx: 150, cy: 108, r: 78 }, { cx: 175, cy: 108, r: 36 }, { cx: 235, cy: 108, r: 62 }],
  [{ cx: 185, cy: 106, r: 76 }, { cx: 158, cy: 112, r: 34 }, { cx: 108, cy: 126, r: 58 }],
  [{ cx: 155, cy: 106, r: 76 }, { cx: 182, cy: 112, r: 34 }, { cx: 232, cy: 126, r: 58 }],
  // Third class overlaps the outer class but is disjoint from the nested inner class.
  [{ cx: 170, cy: 108, r: 80 }, { cx: 210, cy: 108, r: 30 }, { cx: 95, cy: 108, r: 55 }],
  [{ cx: 170, cy: 108, r: 80 }, { cx: 130, cy: 108, r: 30 }, { cx: 245, cy: 108, r: 55 }],
  // Two classes inside one outer class while their mutual relation remains an overlap.
  [{ cx: 170, cy: 108, r: 84 }, { cx: 145, cy: 108, r: 40 }, { cx: 195, cy: 108, r: 40 }],
  // Two classes inside one outer class and mutually disjoint when explicitly forced.
  [{ cx: 170, cy: 108, r: 88 }, { cx: 125, cy: 108, r: 32 }, { cx: 215, cy: 108, r: 32 }],
  // Equality/identity pair plus an undecided third class.
  [{ cx: 140, cy: 108, r: 60 }, { cx: 140, cy: 108, r: 60 }, { cx: 215, cy: 108, r: 60 }],
];

function relationKey(subject: TermId, predicate: TermId): string {
  return `${subject}>${predicate}`;
}

function pairKey(left: TermId, right: TermId): string {
  return [left, right].sort().join("|");
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

function overlaps(left: Shape, right: Shape): boolean {
  return distance(left, right) < left.r + right.r - 5;
}

function properOverlap(left: Shape, right: Shape): boolean {
  return overlaps(left, right) && !contains(left, right) && !contains(right, left);
}

function normalizePremise(premise: SurfacePremise): readonly Relation[] {
  switch (premise.form) {
    case "ALL":
    case "ARE_ONLY":
      return [{ form: "ALL", subject: premise.subject, predicate: premise.predicate }];
    case "ONLY":
      return [{ form: "ALL", subject: premise.predicate, predicate: premise.subject }];
    case "IDENTITY":
      return [{ form: "IDENTITY", subject: premise.subject, predicate: premise.predicate }];
    case "NO":
    case "SOME":
    case "SOME_NOT":
      return [{ form: premise.form, subject: premise.subject, predicate: premise.predicate }];
    case "A_FEW":
      return [{ form: "SOME", subject: premise.subject, predicate: premise.predicate }];
    case "NOT_ALL":
      return [{ form: "SOME_NOT", subject: premise.subject, predicate: premise.predicate }];
    case "ONLY_A_FEW":
      return [
        { form: "SOME", subject: premise.subject, predicate: premise.predicate },
        { form: "SOME_NOT", subject: premise.subject, predicate: premise.predicate },
      ];
    case "FEW":
      return [];
  }
}

function buildAuthority(terms: readonly TermId[], relations: readonly Relation[]): Authority {
  const subset = new Set<string>();
  const disjointPairs = new Set<string>();
  terms.forEach((term) => subset.add(relationKey(term, term)));
  for (const relation of relations) {
    if (relation.form === "ALL") subset.add(relationKey(relation.subject, relation.predicate));
    if (relation.form === "IDENTITY") {
      subset.add(relationKey(relation.subject, relation.predicate));
      subset.add(relationKey(relation.predicate, relation.subject));
    }
    if (relation.form === "NO") disjointPairs.add(pairKey(relation.subject, relation.predicate));
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const left of terms) {
      for (const middle of terms) {
        if (!subset.has(relationKey(left, middle))) continue;
        for (const right of terms) {
          if (subset.has(relationKey(middle, right)) && !subset.has(relationKey(left, right))) {
            subset.add(relationKey(left, right));
            changed = true;
          }
        }
      }
    }
  }

  changed = true;
  while (changed) {
    changed = false;
    for (const pair of [...disjointPairs]) {
      const [left, right] = pair.split("|") as [TermId, TermId];
      const leftSubsets = terms.filter((term) => subset.has(relationKey(term, left)));
      const rightSubsets = terms.filter((term) => subset.has(relationKey(term, right)));
      for (const a of leftSubsets) {
        for (const b of rightSubsets) {
          if (a === b) continue;
          const derived = pairKey(a, b);
          if (!disjointPairs.has(derived)) {
            disjointPairs.add(derived);
            changed = true;
          }
        }
      }
    }
  }
  return { subset, disjoint: disjointPairs };
}

function relationSatisfied(
  relation: Relation,
  shapes: ReadonlyMap<TermId, Shape>,
  authority: Authority,
): boolean {
  const subject = shapes.get(relation.subject);
  const predicate = shapes.get(relation.predicate);
  if (!subject || !predicate) return false;
  const subjectInPredicate = authority.subset.has(relationKey(relation.subject, relation.predicate));
  const predicateInSubject = authority.subset.has(relationKey(relation.predicate, relation.subject));
  const forcedDisjoint = authority.disjoint.has(pairKey(relation.subject, relation.predicate));

  switch (relation.form) {
    case "ALL": return contains(predicate, subject);
    case "IDENTITY": return contains(subject, predicate) && contains(predicate, subject);
    case "NO": return disjoint(subject, predicate);
    case "SOME":
      if (subjectInPredicate) return contains(predicate, subject);
      if (predicateInSubject) return contains(subject, predicate);
      return properOverlap(subject, predicate);
    case "SOME_NOT":
      if (contains(predicate, subject)) return false;
      if (forcedDisjoint) return disjoint(subject, predicate);
      if (predicateInSubject) return contains(subject, predicate);
      return properOverlap(subject, predicate);
  }
}

function unknownPairsStayOpen(
  terms: readonly TermId[],
  relations: readonly Relation[],
  shapes: ReadonlyMap<TermId, Shape>,
  authority: Authority,
): boolean {
  const mentioned = new Set(relations.map((relation) => pairKey(relation.subject, relation.predicate)));
  for (let left = 0; left < terms.length; left += 1) {
    for (let right = left + 1; right < terms.length; right += 1) {
      const a = terms[left];
      const b = terms[right];
      const shapeA = shapes.get(a)!;
      const shapeB = shapes.get(b)!;
      if (mentioned.has(pairKey(a, b))) continue;
      const forcedSubset = authority.subset.has(relationKey(a, b)) || authority.subset.has(relationKey(b, a));
      const forcedDisjoint = authority.disjoint.has(pairKey(a, b));
      if (forcedSubset || forcedDisjoint) continue;
      if (!properOverlap(shapeA, shapeB)) return false;
    }
  }
  return true;
}

function permutations<T>(values: readonly T[]): readonly (readonly T[])[] {
  if (values.length <= 1) return [values];
  const result: T[][] = [];
  values.forEach((value, index) => {
    const remaining = [...values.slice(0, index), ...values.slice(index + 1)];
    for (const tail of permutations(remaining)) result.push([value, ...tail]);
  });
  return result;
}

function chooseLayout(
  terms: readonly TermId[],
  relations: readonly Relation[],
): { shapes: ReadonlyMap<TermId, Shape>; templateIndex: number } | null {
  const authority = buildAuthority(terms, relations);
  for (let templateIndex = 0; templateIndex < SUPPLEMENTAL_TEMPLATES.length; templateIndex += 1) {
    const template = SUPPLEMENTAL_TEMPLATES[templateIndex];
    for (const order of permutations(terms)) {
      const shapes = new Map<TermId, Shape>();
      order.forEach((term, index) => shapes.set(term, { term, ...template[index] }));
      if (!relations.every((relation) => relationSatisfied(relation, shapes, authority))) continue;
      if (!unknownPairsStayOpen(terms, relations, shapes, authority)) continue;
      return { shapes, templateIndex };
    }
  }
  return null;
}

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

function renderRaw(
  question: GeneratedSylQuestionV4,
  assignment: TermAssignment,
  terms: readonly TermId[],
  layout: { shapes: ReadonlyMap<TermId, Shape>; templateIndex: number },
): ExactVennResultV5 {
  const id = `bank-v3-${question.seed}-${question.locale}`.replace(/[^a-zA-Z0-9_-]/gu, "-");
  const duplicates = new Map<string, number>();
  const circles: string[] = [];
  const labels: string[] = [];
  terms.forEach((term, index) => {
    const shape = layout.shapes.get(term)!;
    const geometryKey = `${shape.cx}:${shape.cy}:${shape.r}`;
    const duplicateIndex = duplicates.get(geometryKey) ?? 0;
    duplicates.set(geometryKey, duplicateIndex + 1);
    const dash = duplicateIndex > 0 ? ' stroke-dasharray="6 4"' : "";
    circles.push(`<g data-set="${esc(term)}" data-cx="${shape.cx}" data-cy="${shape.cy}" data-r="${shape.r}"><circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" class="set-circle set-${index + 1}"${dash}/></g>`);
    const value = assignment[term]?.labels[question.locale] ?? term;
    const lines = splitLabel(value);
    const y = Math.max(24, shape.cy - shape.r + 18 + duplicateIndex * 18);
    labels.push(`<text x="${shape.cx}" y="${y}" text-anchor="middle" class="set-label">${lines.map((line, lineIndex) => `<tspan x="${shape.cx}" dy="${lineIndex === 0 ? 0 : 14}">${esc(line)}</tspan>`).join("")}</text>`);
  });

  const caption = "Combined premise arrangement.";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 210" width="100%" role="img" lang="${question.locale}" aria-labelledby="${id}-title ${id}-desc" data-diagram-count="1" data-learner-safe-venn="true" data-supplemental-template="${layout.templateIndex}" class="examtree-venn-svg">
  <title id="${id}-title">${caption}</title>
  <desc id="${id}-desc">${caption}</desc>
  <style>
    .set-circle{fill:#f8fafc;fill-opacity:.38;stroke:#334155;stroke-width:2.2}
    .set-2{stroke:#475569}.set-3{stroke:#64748b}
    .set-label{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:13px;font-weight:700;fill:#0f172a}
    .witness-halo{fill:#dbeafe;stroke:#2563eb;stroke-width:1.5}
    .witness{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:22px;font-weight:800;fill:#1d4ed8}
  </style>
  ${circles.join("\n  ")}
  ${labels.join("\n  ")}
</svg>`;

  return {
    enabled: true,
    omissionReason: null,
    svg,
    caption,
    accessibleDescription: caption,
    semanticSignature: `syl-v5:banking-supplemental-template-v3:${layout.templateIndex}:${question.seed}:${question.locale}`,
    modelSignature: `supplemental-template-${layout.templateIndex}`,
  };
}

function omitted(question: GeneratedSylQuestionV4, detail: string): ExactVennResultV5 {
  return {
    enabled: false,
    omissionReason: "NO_STABLE_SIMPLE_VENN",
    svg: null,
    caption: null,
    accessibleDescription: null,
    semanticSignature: `syl-v5:banking-supplemental-omitted:${detail}:${question.seed}:${question.locale}`,
    modelSignature: null,
  };
}

export function renderBankingSupplementalPremiseVennV3(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  assignment: TermAssignment,
): ExactVennResultV5 {
  if (presentation.learnerExplanation.mode !== "CONCLUSION_MASK") {
    return omitted(question, "not-premise-only");
  }
  if (question.structuredPrompt.premises.some((premise) => premise.form === "FEW")) {
    return omitted(question, "plain-few");
  }
  const terms = [...new Set(question.structuredPrompt.premises.flatMap((premise) => [
    premise.subject,
    premise.predicate,
  ]))] as TermId[];
  if (terms.length !== 3) return omitted(question, "not-three-terms");

  const relations = question.structuredPrompt.premises.flatMap(normalizePremise);
  const layout = chooseLayout(terms, relations);
  if (!layout) return omitted(question, "no-supplemental-template");

  let rendered = renderRaw(question, assignment, terms, layout);
  rendered = correctExactVennWitnessProofV5(question, presentation, rendered);
  rendered = enforceExistentialCompletenessV5(question, presentation, rendered);
  rendered = finalizeWitnessClosureV5(question, presentation, rendered);
  if (!rendered.enabled || !rendered.svg) return rendered;
  if (
    exactVennAddsUnstatedStrongRelationV5(question, presentation, rendered.svg)
    || exactVennHasUnauthorisedContainmentDirectionV5(question, presentation, rendered.svg)
  ) {
    return omitted(question, "post-safety-rejected");
  }
  return {
    ...rendered,
    semanticSignature: `${rendered.semanticSignature}:post-safety-pass`,
  };
}
