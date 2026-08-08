import assert from "node:assert/strict";
import type {
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import {
  expectedClosureCompleteWitnessesV5,
} from "./learner-v5-witness-closure-finalizer";
import {
  selectedDiagramTargetV5,
  type ProofWitnessRequirementV5,
} from "./learner-v5-witness-proof";
import { SYL_QL_REGISTRY } from "./ql-registry";

interface Shape {
  cx: number;
  cy: number;
  r: number;
}

interface Witness extends ProofWitnessRequirementV5 {
  x: number;
  y: number;
}

interface Authority {
  subset: ReadonlySet<string>;
  disjoint: ReadonlySet<string>;
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const EPSILON = 2;
let records = 0;
let enabled = 0;
let omitted = 0;
let existentialPremises = 0;
let existentialPremiseFailures = 0;
let targetFailures = 0;
let closureFailures = 0;
let pointFailures = 0;
let witnessSetMismatches = 0;
let twoWitnessDiagrams = 0;
let oneWitnessDiagrams = 0;

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

function attribute(markup: string, name: string): string {
  return markup.match(new RegExp(`${name}="([^"]*)"`, "u"))?.[1] ?? "";
}

function parseWitnesses(svg: string): readonly Witness[] {
  return [...svg.matchAll(/<g data-witness="decisive"[^>]*>/gu)].map((match) => {
    const markup = match[0];
    const source = attribute(markup, "data-source");
    assert.ok(source === "PREMISE" || source === "TARGET", `invalid witness source ${source}`);
    return {
      x: Number(attribute(markup, "data-x")),
      y: Number(attribute(markup, "data-y")),
      inside: attribute(markup, "data-inside").split(",").filter(Boolean) as TermId[],
      outside: attribute(markup, "data-outside").split(",").filter(Boolean) as TermId[],
      source,
    };
  });
}

function witnessKey(witness: Pick<Witness, "inside" | "outside" | "source">): string {
  return `${witness.source}:${witness.inside.join(",")}|${witness.outside.join(",")}`;
}

function pointInside(witness: Witness, shape: Shape): boolean {
  return Math.hypot(witness.x - shape.cx, witness.y - shape.cy) <= shape.r - 5;
}

function pointMatches(witness: Witness, shapes: ReadonlyMap<TermId, Shape>): boolean {
  return witness.inside.every((term) => {
    const shape = shapes.get(term);
    return Boolean(shape && pointInside(witness, shape));
  }) && witness.outside.every((term) => {
    const shape = shapes.get(term);
    return Boolean(shape && !pointInside(witness, shape));
  });
}

function buildAuthority(
  terms: readonly TermId[],
  premises: readonly SurfacePremise[],
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

function closureComplete(
  witness: Witness,
  terms: readonly TermId[],
  authority: Authority,
): boolean {
  const inside = new Set(witness.inside);
  const outside = new Set(witness.outside);
  if ([...inside].some((term) => outside.has(term))) return false;

  for (const memberOf of inside) {
    for (const term of terms) {
      if (authority.subset.has(relationKey(memberOf, term)) && !inside.has(term)) return false;
      if (authority.disjoint.has(pairKey(memberOf, term)) && !outside.has(term)) return false;
    }
  }
  for (const excludedFrom of outside) {
    for (const term of terms) {
      if (authority.subset.has(relationKey(term, excludedFrom)) && !outside.has(term)) return false;
    }
  }
  return true;
}

function premiseRequirements(premise: SurfacePremise): readonly Omit<Witness, "x" | "y">[] {
  switch (premise.form) {
    case "SOME":
    case "A_FEW":
      return [{ inside: [premise.subject, premise.predicate], outside: [], source: "PREMISE" }];
    case "SOME_NOT":
    case "NOT_ALL":
      return [{ inside: [premise.subject], outside: [premise.predicate], source: "PREMISE" }];
    case "ONLY_A_FEW":
      return [
        { inside: [premise.subject, premise.predicate], outside: [], source: "PREMISE" },
        { inside: [premise.subject], outside: [premise.predicate], source: "PREMISE" },
      ];
    default:
      return [];
  }
}

function satisfies(
  witness: Pick<Witness, "inside" | "outside">,
  requirement: Pick<Witness, "inside" | "outside">,
): boolean {
  return requirement.inside.every((term) => witness.inside.includes(term))
    && requirement.outside.every((term) => witness.outside.includes(term));
}

function targetIsEstablished(
  target: { form: string; subject: TermId; predicate: TermId },
  shapes: ReadonlyMap<TermId, Shape>,
  witnesses: readonly Witness[],
): boolean {
  const subject = shapes.get(target.subject);
  const predicate = shapes.get(target.predicate);
  if (!subject || !predicate) return false;

  switch (target.form) {
    case "ALL":
      return contains(predicate, subject);
    case "IDENTITY":
      return contains(subject, predicate) && contains(predicate, subject);
    case "NO":
      return disjoint(subject, predicate);
    case "SOME":
      return witnesses.some((witness) =>
        witness.inside.includes(target.subject)
        && witness.inside.includes(target.predicate));
    case "SOME_NOT":
      return witnesses.some((witness) =>
        witness.inside.includes(target.subject)
        && witness.outside.includes(target.predicate));
    default:
      return false;
  }
}

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      const presentation = question.learnerPresentationV5;
      records += 1;

      if (!presentation.diagram.enabled) {
        omitted += 1;
        assert.equal(presentation.diagram.svg, null);
        assert.equal(presentation.learnerExplanation.showDiagram, false);
        continue;
      }

      enabled += 1;
      const svg = presentation.diagram.svg ?? "";
      const shapes = parseShapes(svg);
      const witnesses = parseWitnesses(svg);
      const terms = [...shapes.keys()];
      const authority = buildAuthority(terms, question.structuredPrompt.premises);
      if (witnesses.length === 1) oneWitnessDiagrams += 1;
      if (witnesses.length === 2) twoWitnessDiagrams += 1;
      assert.ok(witnesses.length <= 2, `${definition.qlId}/${seed}/${locale}: more than two witnesses`);

      for (const witness of witnesses) {
        const validPoint = pointMatches(witness, shapes);
        if (!validPoint) pointFailures += 1;
        assert.ok(validPoint, `${definition.qlId}/${seed}/${locale}: witness point mismatch`);

        const validClosure = closureComplete(witness, terms, authority);
        if (!validClosure) closureFailures += 1;
        assert.ok(validClosure, `${definition.qlId}/${seed}/${locale}: incomplete witness closure`);
      }

      const expected = expectedClosureCompleteWitnessesV5(question, presentation);
      assert.ok(expected, `${definition.qlId}/${seed}/${locale}: enabled despite unsafe witness set`);
      const actualKeys = witnesses.map(witnessKey).sort();
      const expectedKeys = expected.map(witnessKey).sort();
      if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) witnessSetMismatches += 1;
      assert.deepEqual(actualKeys, expectedKeys, `${definition.qlId}/${seed}/${locale}: wrong final witness set`);

      for (const premise of question.structuredPrompt.premises) {
        for (const requirement of premiseRequirements(premise)) {
          existentialPremises += 1;
          const represented = witnesses.some((witness) =>
            witness.source === "PREMISE" && satisfies(witness, requirement));
          if (!represented) existentialPremiseFailures += 1;
          assert.ok(
            represented,
            `${definition.qlId}/${seed}/${locale}: existential premise ${premise.form} is not represented`,
          );
        }
      }

      const target = selectedDiagramTargetV5(question, presentation) as {
        form: string;
        subject: TermId;
        predicate: TermId;
      } | null;
      if (target) {
        const established = targetIsEstablished(target, shapes, witnesses);
        if (!established) targetFailures += 1;
        assert.ok(established, `${definition.qlId}/${seed}/${locale}: selected target is not established`);
      }

      if (definition.qlId === "SYL-QL-001" && seed === 0) {
        const some = question.structuredPrompt.premises.find((premise) => premise.form === "SOME");
        const no = question.structuredPrompt.premises.find((premise) => premise.form === "NO");
        assert.ok(some && no);
        const excluded = no.subject === some.predicate ? no.predicate : no.subject;
        assert.equal(witnesses.length, 1);
        assert.equal(witnesses[0].source, "PREMISE");
        assert.ok(witnesses[0].inside.includes(some.subject));
        assert.ok(witnesses[0].inside.includes(some.predicate));
        assert.ok(witnesses[0].outside.includes(excluded));
      }

      if (definition.qlId === "SYL-QL-002" && seed === 0) {
        assert.equal(witnesses.length, 2, `${locale}: premise and counterexample witnesses must both be shown`);
        assert.ok(witnesses.some((witness) => witness.source === "PREMISE"));
        assert.ok(witnesses.some((witness) => witness.source === "TARGET"));
      }
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.ok(enabled > 0);
assert.ok(omitted > 0);
assert.ok(existentialPremises > 0);
assert.ok(oneWitnessDiagrams > 0);
assert.ok(twoWitnessDiagrams > 0);
assert.equal(existentialPremiseFailures, 0);
assert.equal(targetFailures, 0);
assert.equal(closureFailures, 0);
assert.equal(pointFailures, 0);
assert.equal(witnessSetMismatches, 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_EVERY_FINAL_DIAGRAM_CORRECT",
  records,
  enabled,
  omitted,
  existentialPremises,
  existentialPremiseFailures,
  targetFailures,
  closureFailures,
  pointFailures,
  witnessSetMismatches,
  oneWitnessDiagrams,
  twoWitnessDiagrams,
  namedRegressions: [
    "SYL-QL-001 seed 0: SOME witness carries NO-derived exclusion",
    "SYL-QL-002 seed 0: premise witness and counterexample witness both retained",
  ],
}, null, 2));
