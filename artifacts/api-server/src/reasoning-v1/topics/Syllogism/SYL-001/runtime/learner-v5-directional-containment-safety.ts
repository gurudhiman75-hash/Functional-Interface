import type {
  SurfacePremise,
  TermId,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type { SylLearnerPresentationV5 } from "./learner-v5-types";
import { selectedDiagramTargetV5 } from "./learner-v5-witness-proof";

interface Shape {
  cx: number;
  cy: number;
  r: number;
}

const EPSILON = 2;

function relationKey(subject: TermId, predicate: TermId): string {
  return `${subject}>${predicate}`;
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

function distance(left: Shape, right: Shape): number {
  return Math.hypot(left.cx - right.cx, left.cy - right.cy);
}

function contains(outer: Shape, inner: Shape): boolean {
  return distance(outer, inner) + inner.r <= outer.r + EPSILON;
}

function addPremiseSubset(
  subset: Set<string>,
  premise: SurfacePremise,
): void {
  if (premise.form === "ALL" || premise.form === "ARE_ONLY") {
    subset.add(relationKey(premise.subject, premise.predicate));
  } else if (premise.form === "ONLY") {
    subset.add(relationKey(premise.predicate, premise.subject));
  } else if (premise.form === "IDENTITY") {
    subset.add(relationKey(premise.subject, premise.predicate));
    subset.add(relationKey(premise.predicate, premise.subject));
  }
}

function authorisedSubsetDirections(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  terms: readonly TermId[],
): ReadonlySet<string> {
  const subset = new Set<string>();
  terms.forEach((term) => subset.add(relationKey(term, term)));
  question.structuredPrompt.premises.forEach((premise) => addPremiseSubset(subset, premise));

  const target = selectedDiagramTargetV5(question, presentation);
  if (target?.form === "ALL") {
    subset.add(relationKey(target.subject, target.predicate));
  } else if (target?.form === "IDENTITY") {
    subset.add(relationKey(target.subject, target.predicate));
    subset.add(relationKey(target.predicate, target.subject));
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

  return subset;
}

export function exactVennHasUnauthorisedContainmentDirectionV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  svg: string,
): boolean {
  const shapes = parseShapes(svg);
  const terms = [...shapes.keys()];
  const authorised = authorisedSubsetDirections(question, presentation, terms);

  for (let left = 0; left < terms.length; left += 1) {
    for (let right = left + 1; right < terms.length; right += 1) {
      const a = terms[left];
      const b = terms[right];
      const shapeA = shapes.get(a);
      const shapeB = shapes.get(b);
      if (!shapeA || !shapeB) return true;

      if (contains(shapeB, shapeA) && !authorised.has(relationKey(a, b))) return true;
      if (contains(shapeA, shapeB) && !authorised.has(relationKey(b, a))) return true;
    }
  }

  return false;
}
