import type {
  CanonicalConclusion,
  SurfacePremise,
  TermId,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import { resolveModelTargetV5 } from "./learner-v5-model-target-remediation";
import type {
  SylLearnerExplanationModeV5,
  SylLearnerPresentationV5,
} from "./learner-v5-types";

interface Shape {
  cx: number;
  cy: number;
  r: number;
}

interface AuthorityRelation {
  form: "ALL" | "NO" | "SOME" | "SOME_NOT";
  subject: TermId;
  predicate: TermId;
}

interface Authority {
  subset: ReadonlySet<string>;
  disjoint: ReadonlySet<string>;
}

const EPSILON = 2;

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

function parseShapes(svg: string): ReadonlyMap<TermId, Shape> {
  const result = new Map<TermId, Shape>();
  for (const match of svg.matchAll(/<g data-set="([^"]+)" data-cx="([\d.]+)" data-cy="([\d.]+)" data-r="([\d.]+)">/gu)) {
    result.set(match[1], {
      cx: Number(match[2]),
      cy: Number(match[3]),
      r: Number(match[4]),
    });
  }
  return result;
}

function targetRelation(
  conclusion: CanonicalConclusion,
  mode: SylLearnerExplanationModeV5,
): AuthorityRelation {
  const negate = mode === "COUNTEREXAMPLE" || mode === "DIRECT_CONTRADICTION";
  if (!negate) return conclusion;
  switch (conclusion.form) {
    case "ALL":
      return { form: "SOME_NOT", subject: conclusion.subject, predicate: conclusion.predicate };
    case "NO":
      return { form: "SOME", subject: conclusion.subject, predicate: conclusion.predicate };
    case "SOME":
      return { form: "NO", subject: conclusion.subject, predicate: conclusion.predicate };
    case "SOME_NOT":
      return { form: "ALL", subject: conclusion.subject, predicate: conclusion.predicate };
  }
}

function usesTargetAuthority(mode: SylLearnerExplanationModeV5): boolean {
  return new Set([
    "DIRECT_CHAIN",
    "WITNESS_TRANSFER",
    "DIRECT_CONTRADICTION",
    "COUNTEREXAMPLE",
    "POSSIBILITY_MODEL",
    "POSSIBLE_NOT_DEFINITE",
    "DUAL_MODEL",
  ]).has(mode);
}

function buildAuthority(
  premises: readonly SurfacePremise[],
  target: AuthorityRelation | null,
  terms: readonly TermId[],
): Authority {
  const subset = new Set<string>();
  const disjointPairs = new Set<string>();
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
      disjointPairs.add(pairKey(premise.subject, premise.predicate));
    }
  }
  if (target?.form === "ALL") subset.add(relationKey(target.subject, target.predicate));
  if (target?.form === "NO") disjointPairs.add(pairKey(target.subject, target.predicate));

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

export function exactVennAddsUnstatedStrongRelationV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  svg: string,
): boolean {
  const shapes = parseShapes(svg);
  const terms = [...new Set(question.structuredPrompt.premises.flatMap((premise) => [
    premise.subject,
    premise.predicate,
  ]))] as TermId[];
  if (shapes.size !== terms.length) return true;

  for (const premise of question.structuredPrompt.premises) {
    if (premise.form !== "ONLY_A_FEW") continue;
    const subject = shapes.get(premise.subject);
    const predicate = shapes.get(premise.predicate);
    if (!subject || !predicate || !properOverlap(subject, predicate)) return true;
  }

  const target = usesTargetAuthority(presentation.learnerExplanation.mode)
    ? targetRelation(resolveModelTargetV5(question).canonical, presentation.learnerExplanation.mode)
    : null;
  const authority = buildAuthority(question.structuredPrompt.premises, target, terms);
  const mentionedPairs = new Set(question.structuredPrompt.premises.map((premise) =>
    pairKey(premise.subject, premise.predicate)));
  if (target) mentionedPairs.add(pairKey(target.subject, target.predicate));

  for (let left = 0; left < terms.length; left += 1) {
    for (let right = left + 1; right < terms.length; right += 1) {
      const a = terms[left];
      const b = terms[right];
      if (mentionedPairs.has(pairKey(a, b))) continue;
      if (
        authority.subset.has(relationKey(a, b))
        || authority.subset.has(relationKey(b, a))
        || authority.disjoint.has(pairKey(a, b))
      ) continue;
      const shapeA = shapes.get(a);
      const shapeB = shapes.get(b);
      if (!shapeA || !shapeB) return true;
      if (contains(shapeA, shapeB) || contains(shapeB, shapeA) || disjoint(shapeA, shapeB)) {
        return true;
      }
    }
  }
  return false;
}
