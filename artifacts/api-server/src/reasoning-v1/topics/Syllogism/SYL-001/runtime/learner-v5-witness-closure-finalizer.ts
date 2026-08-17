import type {
  SurfacePremise,
  TermId,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type { ExactVennResultV5 } from "./learner-v5-exact-venn";
import {
  expectedCompleteExistentialWitnessesV5,
} from "./learner-v5-existential-completeness";
import type { SylLearnerPresentationV5 } from "./learner-v5-types";
import type { ProofWitnessRequirementV5 } from "./learner-v5-witness-proof";

interface Shape {
  cx: number;
  cy: number;
  r: number;
}

interface Point {
  x: number;
  y: number;
}

interface Authority {
  subset: ReadonlySet<string>;
  disjoint: ReadonlySet<string>;
}

function relationKey(subject: TermId, predicate: TermId): string {
  return `${subject}>${predicate}`;
}

function pairKey(left: TermId, right: TermId): string {
  return [left, right].sort().join("|");
}

function termsFor(question: GeneratedSylQuestionV4): readonly TermId[] {
  return [...new Set(question.structuredPrompt.premises.flatMap((premise) => [
    premise.subject,
    premise.predicate,
  ]))] as TermId[];
}

function authorityFor(
  terms: readonly TermId[],
  premises: readonly SurfacePremise[],
): Authority {
  const subset = new Set<string>();
  const disjoint = new Set<string>();
  terms.forEach((term) => subset.add(relationKey(term, term)));

  for (const premise of premises) {
    if (premise.form === "ALL" || premise.form === "ARE_ONLY") {
      subset.add(relationKey(premise.subject, premise.predicate));
    } else if (premise.form === "ONLY") {
      subset.add(relationKey(premise.predicate, premise.subject));
    } else if (premise.form === "IDENTITY") {
      subset.add(relationKey(premise.subject, premise.predicate));
      subset.add(relationKey(premise.predicate, premise.subject));
    } else if (premise.form === "NO") {
      disjoint.add(pairKey(premise.subject, premise.predicate));
    }
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
    for (const pair of [...disjoint]) {
      const [left, right] = pair.split("|") as [TermId, TermId];
      const leftSubsets = terms.filter((term) => subset.has(relationKey(term, left)));
      const rightSubsets = terms.filter((term) => subset.has(relationKey(term, right)));
      for (const a of leftSubsets) {
        for (const b of rightSubsets) {
          if (a === b) continue;
          const derived = pairKey(a, b);
          if (!disjoint.has(derived)) {
            disjoint.add(derived);
            changed = true;
          }
        }
      }
    }
  }

  return { subset, disjoint };
}

function complete(
  requirement: ProofWitnessRequirementV5,
  terms: readonly TermId[],
  authority: Authority,
): ProofWitnessRequirementV5 | null {
  const inside = new Set(requirement.inside);
  const outside = new Set(requirement.outside);
  let changed = true;

  while (changed) {
    changed = false;
    for (const memberOf of [...inside]) {
      for (const term of terms) {
        if (authority.subset.has(relationKey(memberOf, term)) && !inside.has(term)) {
          inside.add(term);
          changed = true;
        }
        if (authority.disjoint.has(pairKey(memberOf, term)) && !outside.has(term)) {
          outside.add(term);
          changed = true;
        }
      }
    }
    for (const excludedFrom of [...outside]) {
      for (const term of terms) {
        if (authority.subset.has(relationKey(term, excludedFrom)) && !outside.has(term)) {
          outside.add(term);
          changed = true;
        }
      }
    }
  }

  if ([...inside].some((term) => outside.has(term))) return null;
  return {
    inside: terms.filter((term) => inside.has(term)),
    outside: terms.filter((term) => outside.has(term)),
    source: requirement.source,
  };
}

export function expectedClosureCompleteWitnessesV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
): readonly ProofWitnessRequirementV5[] | null {
  const initial = expectedCompleteExistentialWitnessesV5(question, presentation);
  if (!initial) return null;
  const terms = termsFor(question);
  const authority = authorityFor(terms, question.structuredPrompt.premises);
  const completed = initial.map((requirement) => complete(requirement, terms, authority));
  if (completed.some((requirement) => requirement === null)) return null;
  return completed as readonly ProofWitnessRequirementV5[];
}

function parseShapes(svg: string): ReadonlyMap<TermId, Shape> {
  const result = new Map<TermId, Shape>();
  for (const match of svg.matchAll(
    /<g data-set="([^"]+)" data-cx="([\d.]+)" data-cy="([\d.]+)" data-r="([\d.]+)">/gu,
  )) {
    result.set(match[1], {
      cx: Number(match[2]),
      cy: Number(match[3]),
      r: Number(match[4]),
    });
  }
  return result;
}

function pointInside(point: Point, shape: Shape): boolean {
  return Math.hypot(point.x - shape.cx, point.y - shape.cy) <= shape.r - 5;
}

function choosePoint(
  requirement: ProofWitnessRequirementV5,
  shapes: ReadonlyMap<TermId, Shape>,
  occupied: readonly Point[],
): Point | null {
  let best: { point: Point; score: number } | null = null;
  for (let y = 34; y <= 186; y += 2) {
    for (let x = 20; x <= 320; x += 2) {
      const point = { x, y };
      if (occupied.some((other) => Math.hypot(x - other.x, y - other.y) < 28)) continue;
      if (!requirement.inside.every((term) => {
        const shape = shapes.get(term);
        return Boolean(shape && pointInside(point, shape));
      })) continue;
      if (!requirement.outside.every((term) => {
        const shape = shapes.get(term);
        return Boolean(shape && !pointInside(point, shape));
      })) continue;

      const margins = [
        ...requirement.inside.map((term) => {
          const shape = shapes.get(term)!;
          return shape.r - Math.hypot(x - shape.cx, y - shape.cy);
        }),
        ...requirement.outside.map((term) => {
          const shape = shapes.get(term)!;
          return Math.hypot(x - shape.cx, y - shape.cy) - shape.r;
        }),
      ];
      const score = margins.length > 0 ? Math.min(...margins) : 0;
      if (!best || score > best.score) best = { point, score };
    }
  }
  return best?.point ?? null;
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function markup(requirement: ProofWitnessRequirementV5, point: Point): string {
  return `<g data-witness="decisive" data-source="${requirement.source}" data-x="${point.x}" data-y="${point.y}" data-inside="${esc(requirement.inside.join(","))}" data-outside="${esc(requirement.outside.join(","))}"><circle cx="${point.x}" cy="${point.y}" r="11" class="witness-halo"/><text x="${point.x}" y="${point.y + 7}" text-anchor="middle" class="witness">×</text></g>`;
}

function omit(
  question: GeneratedSylQuestionV4,
  rendered: ExactVennResultV5,
): ExactVennResultV5 {
  return {
    ...rendered,
    enabled: false,
    omissionReason: "NO_STABLE_SIMPLE_VENN",
    svg: null,
    caption: null,
    accessibleDescription: null,
    semanticSignature: `syl-v5:exact-venn:omitted:closure-complete-witness-not-placeable:${question.qlId}:${question.seed}:${question.locale}`,
  };
}

export function finalizeWitnessClosureV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  rendered: ExactVennResultV5,
): ExactVennResultV5 {
  if (!rendered.enabled || !rendered.svg) return rendered;
  const requirements = expectedClosureCompleteWitnessesV5(question, presentation);
  if (!requirements) return omit(question, rendered);

  const shapes = parseShapes(rendered.svg);
  const points: Point[] = [];
  for (const requirement of requirements) {
    const point = choosePoint(requirement, shapes, points);
    if (!point) return omit(question, rendered);
    points.push(point);
  }

  const withoutWitnesses = rendered.svg.replace(
    /\s*<g data-witness="decisive"[\s\S]*?<\/g>/gu,
    "",
  );
  const marks = requirements.map((requirement, index) => markup(requirement, points[index]));
  const svg = withoutWitnesses.replace(
    /\s*<\/svg>/u,
    `${marks.length > 0 ? `\n  ${marks.join("\n  ")}` : ""}\n</svg>`,
  );

  return {
    ...rendered,
    svg,
    accessibleDescription: rendered.accessibleDescription
      ? `${rendered.accessibleDescription} Witness memberships include the complete universal and negative closure of the statements.`
      : null,
    semanticSignature: `${rendered.semanticSignature}:closure-complete-v4`,
  };
}
