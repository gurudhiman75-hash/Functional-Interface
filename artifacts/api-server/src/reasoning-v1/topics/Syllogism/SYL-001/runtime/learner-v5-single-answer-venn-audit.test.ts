import assert from "node:assert/strict";
import type {
  CanonicalConclusion,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import { resolveModelTargetV5 } from "./learner-v5-model-target-remediation";
import type { SylLearnerExplanationModeV5 } from "./learner-v5-types";
import { SYL_QL_REGISTRY } from "./ql-registry";

interface Shape {
  cx: number;
  cy: number;
  r: number;
}

interface Authority {
  subset: ReadonlySet<string>;
  disjoint: ReadonlySet<string>;
}

interface AuthorityRelation {
  form: "ALL" | "NO" | "SOME" | "SOME_NOT";
  subject: TermId;
  predicate: TermId;
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const EPSILON = 2;
let records = 0;
let diagrams = 0;
let omitted = 0;
let omittedMoreThanThree = 0;
let omittedUnstable = 0;
let geometryFailures = 0;
let witnessFailures = 0;
let strongerUnstatedRelations = 0;
let maximumWitnesses = 0;

function relationKey(subject: TermId, predicate: TermId): string {
  return `${subject}>${predicate}`;
}

function pairKey(left: TermId, right: TermId): string {
  return [left, right].sort().join("|");
}

function pairDistance(left: Shape, right: Shape): number {
  return Math.hypot(left.cx - right.cx, left.cy - right.cy);
}

function contains(outer: Shape, inner: Shape): boolean {
  return pairDistance(outer, inner) + inner.r <= outer.r + EPSILON;
}

function disjoint(left: Shape, right: Shape): boolean {
  return pairDistance(left, right) >= left.r + right.r + 3;
}

function overlaps(left: Shape, right: Shape): boolean {
  return pairDistance(left, right) < left.r + right.r - 5;
}

function properOverlap(left: Shape, right: Shape): boolean {
  return overlaps(left, right) && !contains(left, right) && !contains(right, left);
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

function validatePremise(
  premise: SurfacePremise,
  shapes: ReadonlyMap<TermId, Shape>,
  authority: Authority,
): boolean {
  const subject = shapes.get(premise.subject);
  const predicate = shapes.get(premise.predicate);
  if (!subject || !predicate) return false;
  const subjectInPredicate = authority.subset.has(relationKey(premise.subject, premise.predicate));
  const predicateInSubject = authority.subset.has(relationKey(premise.predicate, premise.subject));
  const forcedDisjoint = authority.disjoint.has(pairKey(premise.subject, premise.predicate));

  switch (premise.form) {
    case "ALL":
    case "ARE_ONLY":
      return contains(predicate, subject);
    case "ONLY":
      return contains(subject, predicate);
    case "IDENTITY":
      return contains(subject, predicate) && contains(predicate, subject);
    case "NO":
      return disjoint(subject, predicate);
    case "SOME":
    case "A_FEW":
      return overlaps(subject, predicate)
        && (subjectInPredicate || predicateInSubject || properOverlap(subject, predicate));
    case "SOME_NOT":
    case "NOT_ALL":
      if (contains(predicate, subject)) return false;
      if (forcedDisjoint) return disjoint(subject, predicate);
      if (predicateInSubject) return contains(subject, predicate);
      return properOverlap(subject, predicate);
    case "ONLY_A_FEW":
      return properOverlap(subject, predicate);
    case "FEW":
      return false;
  }
}

function hasUnforcedStrongRelation(
  terms: readonly TermId[],
  shapes: ReadonlyMap<TermId, Shape>,
  authority: Authority,
  premises: readonly SurfacePremise[],
  target: AuthorityRelation | null,
): boolean {
  const mentionedPairs = new Set(premises.map((premise) => pairKey(premise.subject, premise.predicate)));
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
      const shapeA = shapes.get(a)!;
      const shapeB = shapes.get(b)!;
      if (contains(shapeA, shapeB) || contains(shapeB, shapeA) || disjoint(shapeA, shapeB)) return true;
    }
  }
  return false;
}

function inside(point: { x: number; y: number }, shape: Shape): boolean {
  return Math.hypot(point.x - shape.cx, point.y - shape.cy) <= shape.r - 4;
}

function validateWitnesses(svg: string, shapes: ReadonlyMap<TermId, Shape>): boolean {
  for (const match of svg.matchAll(/<g data-witness="decisive" data-x="([\d.]+)" data-y="([\d.]+)" data-inside="([^"]*)" data-outside="([^"]*)">/gu)) {
    const point = { x: Number(match[1]), y: Number(match[2]) };
    const insideTerms = match[3] ? match[3].split(",") : [];
    const outsideTerms = match[4] ? match[4].split(",") : [];
    for (const term of insideTerms) {
      const shape = shapes.get(term);
      if (!shape || !inside(point, shape)) return false;
    }
    for (const term of outsideTerms) {
      const shape = shapes.get(term);
      if (!shape || inside(point, shape)) return false;
    }
  }
  return true;
}

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      const presentation = question.learnerPresentationV5;
      const svg = presentation.diagram.svg ?? "";
      const terms = [...new Set(question.structuredPrompt.premises.flatMap((premise) => [
        premise.subject,
        premise.predicate,
      ]))] as TermId[];
      const target = usesTargetAuthority(presentation.learnerExplanation.mode)
        ? targetRelation(resolveModelTargetV5(question).canonical, presentation.learnerExplanation.mode)
        : null;
      const authority = buildAuthority(question.structuredPrompt.premises, target, terms);
      records += 1;

      if (!presentation.diagram.enabled) {
        omitted += 1;
        assert.equal(presentation.learnerExplanation.showDiagram, false);
        assert.equal(presentation.diagram.diagramCount, 0);
        assert.equal(presentation.diagram.mode, "OMITTED_NOT_USEFUL");
        assert.equal(presentation.diagram.svg, null);
        assert.equal(presentation.diagram.caption, null);
        assert.ok(
          presentation.diagram.omissionReason === "MORE_THAN_THREE_TERMS"
          || presentation.diagram.omissionReason === "NO_STABLE_SIMPLE_VENN",
        );
        if (presentation.diagram.omissionReason === "MORE_THAN_THREE_TERMS") {
          omittedMoreThanThree += 1;
          assert.ok(terms.length > 3);
        } else {
          omittedUnstable += 1;
        }
        continue;
      }

      diagrams += 1;
      assert.ok(terms.length <= 3, `${definition.qlId}/${seed}/${locale}: complex diagram was forced`);
      assert.equal(presentation.learnerExplanation.showDiagram, true);
      assert.equal(presentation.diagram.diagramCount, 1);
      assert.equal(presentation.diagram.omissionReason, null);
      assert.equal(presentation.diagram.mobileViewBoxWidth, 340);
      assert.match(svg, /viewBox="0 0 340 210"/u);
      assert.match(svg, /data-learner-safe-venn="true"/u);
      assert.equal([...svg.matchAll(/<svg\b/gu)].length, 1);
      assert.doesNotMatch(svg, /separation-mark|data-no-pair|×[1-9]|textLength=|lengthAdjust=/u);
      assert.doesNotMatch(svg, /Correct answer|one combined Venn arrangement/iu);
      assert.doesNotMatch(svg, /#f59e0b|#ef4444|#10b981|#8b5cf6/iu);
      assert.match(svg, /font-size:13px/u);
      assert.match(svg, /font-size:22px/u);

      const shapes = parseShapes(svg);
      assert.equal(shapes.size, terms.length);
      for (const premise of question.structuredPrompt.premises) {
        const valid = validatePremise(premise, shapes, authority);
        if (!valid) geometryFailures += 1;
        assert.ok(valid, `${definition.qlId}/${seed}/${locale}: SVG topology contradicts or overstates ${premise.form} ${premise.subject}/${premise.predicate}`);
      }

      const unforcedStrongRelation = hasUnforcedStrongRelation(
        terms,
        shapes,
        authority,
        question.structuredPrompt.premises,
        target,
      );
      if (unforcedStrongRelation) strongerUnstatedRelations += 1;
      assert.equal(
        unforcedStrongRelation,
        false,
        `${definition.qlId}/${seed}/${locale}: diagram adds unstated containment or separation`,
      );

      const witnessCount = [...svg.matchAll(/data-witness="decisive"/gu)].length;
      maximumWitnesses = Math.max(maximumWitnesses, witnessCount);
      assert.ok(witnessCount <= 2, `${definition.qlId}/${seed}/${locale}: too many witnesses`);
      const validWitnesses = validateWitnesses(svg, shapes);
      if (!validWitnesses) witnessFailures += 1;
      assert.ok(validWitnesses, `${definition.qlId}/${seed}/${locale}: witness membership does not match its plotted point`);
      assert.ok(presentation.diagram.caption?.trim());
      assert.ok(presentation.diagram.accessibleDescription?.trim());
      assert.ok(presentation.diagram.semanticSignature.startsWith("syl-v5:exact-venn:enabled:"));
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.ok(diagrams > 0);
assert.ok(omitted > 0);
assert.ok(omittedMoreThanThree > 0);
assert.equal(geometryFailures, 0);
assert.equal(witnessFailures, 0);
assert.equal(strongerUnstatedRelations, 0);
assert.ok(maximumWitnesses <= 2);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_EXACT_LEARNER_VENN",
  records,
  diagrams,
  omitted,
  omittedMoreThanThree,
  omittedUnstable,
  geometryFailures,
  witnessFailures,
  strongerUnstatedRelations,
  maximumWitnesses,
  contract: {
    maximumTermsPerDiagram: 3,
    maximumWitnessesPerDiagram: 2,
    separationCrosses: 0,
    numberedWitnesses: 0,
    strongerUnstatedRelations: 0,
    mobileViewBox: "340 x 210",
    unstableLayoutsAreOmitted: true,
  },
}, null, 2));
