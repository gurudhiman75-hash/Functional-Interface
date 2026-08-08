import assert from "node:assert/strict";
import type { SylLocale, TermId } from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import {
  exactVennHasUnauthorisedContainmentDirectionV5,
} from "./learner-v5-directional-containment-safety";
import { SYL_QL_REGISTRY } from "./ql-registry";

interface Shape {
  cx: number;
  cy: number;
  r: number;
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const EPSILON = 2;
let records = 0;
let enabled = 0;
let omitted = 0;
let displayedContainmentDirections = 0;
let coincidentPairs = 0;
let unauthorisedDirections = 0;

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

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      const presentation = question.learnerPresentationV5;
      records += 1;

      if (!presentation.diagram.enabled) {
        omitted += 1;
        continue;
      }

      enabled += 1;
      const svg = presentation.diagram.svg ?? "";
      const unsafe = exactVennHasUnauthorisedContainmentDirectionV5(
        question,
        presentation,
        svg,
      );
      if (unsafe) unauthorisedDirections += 1;
      assert.equal(
        unsafe,
        false,
        `${definition.qlId}/${seed}/${locale}: displayed circle containment implies an unauthorised converse`,
      );

      const shapes = [...parseShapes(svg).entries()];
      for (let left = 0; left < shapes.length; left += 1) {
        for (let right = left + 1; right < shapes.length; right += 1) {
          const shapeA = shapes[left][1];
          const shapeB = shapes[right][1];
          const aInB = contains(shapeB, shapeA);
          const bInA = contains(shapeA, shapeB);
          if (aInB) displayedContainmentDirections += 1;
          if (bInA) displayedContainmentDirections += 1;
          if (aInB && bInA) coincidentPairs += 1;
        }
      }
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.ok(enabled > 0);
assert.ok(omitted > 0);
assert.ok(displayedContainmentDirections > 0);
assert.equal(unauthorisedDirections, 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_EVERY_CONTAINMENT_DIRECTION_AUTHORISED",
  records,
  enabled,
  omitted,
  displayedContainmentDirections,
  coincidentPairs,
  unauthorisedDirections,
  policy: "A displayed A-inside-B relation is allowed only when A subset B is forced by premises or the selected model; coincident circles require both directions.",
}, null, 2));
