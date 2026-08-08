import assert from "node:assert/strict";
import type {
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import { SYL_QL_REGISTRY } from "./ql-registry";

interface Shape {
  cx: number;
  cy: number;
  r: number;
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
let maximumWitnesses = 0;

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

function validatePremise(premise: SurfacePremise, shapes: ReadonlyMap<TermId, Shape>): boolean {
  const subject = shapes.get(premise.subject);
  const predicate = shapes.get(premise.predicate);
  if (!subject || !predicate) return false;
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
      return overlaps(subject, predicate);
    case "SOME_NOT":
    case "NOT_ALL":
      return !contains(predicate, subject);
    case "ONLY_A_FEW":
      return overlaps(subject, predicate) && !contains(predicate, subject);
    case "FEW":
      return false;
  }
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
      const premiseTerms = new Set(question.structuredPrompt.premises.flatMap((premise) => [
        premise.subject,
        premise.predicate,
      ]));
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
          assert.ok(premiseTerms.size > 3);
        } else {
          omittedUnstable += 1;
        }
        continue;
      }

      diagrams += 1;
      assert.ok(premiseTerms.size <= 3, `${definition.qlId}/${seed}/${locale}: complex diagram was forced`);
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
      assert.equal(shapes.size, premiseTerms.size);
      for (const premise of question.structuredPrompt.premises) {
        const valid = validatePremise(premise, shapes);
        if (!valid) geometryFailures += 1;
        assert.ok(valid, `${definition.qlId}/${seed}/${locale}: SVG geometry contradicts ${premise.form} ${premise.subject}/${premise.predicate}`);
      }

      const witnessCount = [...svg.matchAll(/data-witness="decisive"/gu)].length;
      maximumWitnesses = Math.max(maximumWitnesses, witnessCount);
      assert.ok(witnessCount <= 2, `${definition.qlId}/${seed}/${locale}: too many witnesses`);
      const validWitnesses = validateWitnesses(svg, shapes);
      if (!validWitnesses) witnessFailures += 1;
      assert.ok(validWitnesses, `${definition.qlId}/${seed}/${locale}: witness membership does not match its plotted point`);
      assert.ok(presentation.diagram.caption?.trim());
      assert.ok(presentation.diagram.accessibleDescription?.trim());
      assert.ok(presentation.diagram.semanticSignature.startsWith("syl-v5:learner-safe-venn:enabled:"));
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.ok(diagrams > 0);
assert.ok(omitted > 0);
assert.ok(omittedMoreThanThree > 0);
assert.equal(geometryFailures, 0);
assert.equal(witnessFailures, 0);
assert.ok(maximumWitnesses <= 2);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_LEARNER_SAFE_VENN",
  records,
  diagrams,
  omitted,
  omittedMoreThanThree,
  omittedUnstable,
  geometryFailures,
  witnessFailures,
  maximumWitnesses,
  contract: {
    maximumTermsPerDiagram: 3,
    maximumWitnessesPerDiagram: 2,
    separationCrosses: 0,
    numberedWitnesses: 0,
    mobileViewBox: "340 x 210",
    unstableLayoutsAreOmitted: true,
  },
}, null, 2));
