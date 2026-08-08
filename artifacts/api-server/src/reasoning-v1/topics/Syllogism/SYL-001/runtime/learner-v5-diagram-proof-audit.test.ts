import assert from "node:assert/strict";
import type {
  CanonicalConclusion,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import { resolveModelTargetV5 } from "./learner-v5-model-target-remediation";
import type {
  SylLearnerExplanationModeV5,
  SylLearnerPresentationV5,
} from "./learner-v5-types";
import {
  expectedProofWitnessesV5,
} from "./learner-v5-witness-proof";
import { SYL_QL_REGISTRY } from "./ql-registry";

interface Shape {
  cx: number;
  cy: number;
  r: number;
}

interface Witness {
  x: number;
  y: number;
  inside: readonly TermId[];
  outside: readonly TermId[];
  source: "PREMISE" | "TARGET";
}

type RelationForm = "ALL" | "NO" | "SOME" | "SOME_NOT" | "IDENTITY";

interface Relation {
  form: RelationForm;
  subject: TermId;
  predicate: TermId;
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
let targetGeometryFailures = 0;
let targetWitnessFailures = 0;
let closureFailures = 0;
let metadataPointFailures = 0;
let expectedWitnessMismatches = 0;
let premiseAnchoredExistentialProofs = 0;

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

function overlap(left: Shape, right: Shape): boolean {
  return distance(left, right) < left.r + right.r - 5;
}

function properOverlap(left: Shape, right: Shape): boolean {
  return overlap(left, right) && !contains(left, right) && !contains(right, left);
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

function targetRelation(
  conclusion: CanonicalConclusion,
  mode: SylLearnerExplanationModeV5,
): Relation {
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

function selectedTarget(
  question: ReturnType<typeof generateSylQuestionV5>,
  presentation: SylLearnerPresentationV5,
): Relation | null {
  const modes = new Set<SylLearnerExplanationModeV5>([
    "DIRECT_CHAIN",
    "WITNESS_TRANSFER",
    "DIRECT_CONTRADICTION",
    "COUNTEREXAMPLE",
    "POSSIBILITY_MODEL",
    "POSSIBLE_NOT_DEFINITE",
    "DUAL_MODEL",
  ]);
  if (!modes.has(presentation.learnerExplanation.mode)) return null;
  return targetRelation(
    resolveModelTargetV5(question).canonical,
    presentation.learnerExplanation.mode,
  );
}

function buildAuthority(terms: readonly TermId[], premises: readonly SurfacePremise[]): Authority {
  const subset = new Set<string>();
  const disjointPairs = new Set<string>();
  terms.forEach((term) => subset.add(relationKey(term, term)));

  for (const relation of premises.flatMap(normalizePremise)) {
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
  const match = markup.match(new RegExp(`${name}="([^"]*)"`, "u"));
  return match?.[1] ?? "";
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

function pointInside(witness: Witness, shape: Shape): boolean {
  return Math.hypot(witness.x - shape.cx, witness.y - shape.cy) <= shape.r - 5;
}

function witnessKey(witness: Pick<Witness, "inside" | "outside" | "source">): string {
  return `${witness.source}:${witness.inside.join(",")}|${witness.outside.join(",")}`;
}

function witnessIsClosureComplete(
  witness: Witness,
  terms: readonly TermId[],
  authority: Authority,
): boolean {
  const insideTerms = new Set(witness.inside);
  const outsideTerms = new Set(witness.outside);
  if ([...insideTerms].some((term) => outsideTerms.has(term))) return false;

  for (const memberOf of insideTerms) {
    for (const term of terms) {
      if (authority.subset.has(relationKey(memberOf, term)) && !insideTerms.has(term)) return false;
      if (authority.disjoint.has(pairKey(memberOf, term)) && !outsideTerms.has(term)) return false;
    }
  }

  for (const excludedFrom of outsideTerms) {
    for (const term of terms) {
      if (authority.subset.has(relationKey(term, excludedFrom)) && !outsideTerms.has(term)) return false;
    }
  }

  return true;
}

function pointMatchesMetadata(
  witness: Witness,
  shapes: ReadonlyMap<TermId, Shape>,
): boolean {
  return witness.inside.every((term) => {
    const shape = shapes.get(term);
    return Boolean(shape && pointInside(witness, shape));
  }) && witness.outside.every((term) => {
    const shape = shapes.get(term);
    return Boolean(shape && !pointInside(witness, shape));
  });
}

function targetGeometryValid(
  target: Relation,
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
      return properOverlap(subject, predicate)
        || contains(subject, predicate)
        || contains(predicate, subject)
        ? witnesses.some((witness) =>
          witness.inside.includes(target.subject)
          && witness.inside.includes(target.predicate))
        : false;
    case "SOME_NOT":
      return witnesses.some((witness) =>
        witness.inside.includes(target.subject)
        && witness.outside.includes(target.predicate));
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
        continue;
      }

      enabled += 1;
      const svg = presentation.diagram.svg ?? "";
      const shapes = parseShapes(svg);
      const witnesses = parseWitnesses(svg);
      const terms = [...shapes.keys()];
      const authority = buildAuthority(terms, question.structuredPrompt.premises);
      const target = selectedTarget(question, presentation);

      for (const witness of witnesses) {
        const closureComplete = witnessIsClosureComplete(witness, terms, authority);
        if (!closureComplete) closureFailures += 1;
        assert.ok(
          closureComplete,
          `${definition.qlId}/${seed}/${locale}: witness omits a forced membership or exclusion`,
        );

        const pointValid = pointMatchesMetadata(witness, shapes);
        if (!pointValid) metadataPointFailures += 1;
        assert.ok(
          pointValid,
          `${definition.qlId}/${seed}/${locale}: witness metadata does not match the plotted point`,
        );
      }

      const expected = expectedProofWitnessesV5(question, presentation)
        .map((requirement) => witnessKey({
          inside: requirement.inside,
          outside: requirement.outside,
          source: requirement.source,
        }))
        .sort();
      const actual = witnesses.map(witnessKey).sort();
      const expectedMatches = JSON.stringify(actual) === JSON.stringify(expected);
      if (!expectedMatches) expectedWitnessMismatches += 1;
      assert.deepEqual(
        actual,
        expected,
        `${definition.qlId}/${seed}/${locale}: rendered witnesses do not match the complete proof requirements`,
      );

      if (target) {
        const targetValid = targetGeometryValid(target, shapes, witnesses);
        if (!targetValid) {
          if (target.form === "SOME" || target.form === "SOME_NOT") targetWitnessFailures += 1;
          else targetGeometryFailures += 1;
        }
        assert.ok(
          targetValid,
          `${definition.qlId}/${seed}/${locale}: diagram does not establish the selected target model`,
        );

        if (target.form === "SOME" || target.form === "SOME_NOT") {
          const provingWitness = witnesses.find((witness) =>
            target.form === "SOME"
              ? witness.inside.includes(target.subject) && witness.inside.includes(target.predicate)
              : witness.inside.includes(target.subject) && witness.outside.includes(target.predicate));
          assert.ok(provingWitness, `${definition.qlId}/${seed}/${locale}: missing target witness`);
          if (provingWitness.source === "PREMISE") premiseAnchoredExistentialProofs += 1;
        }
      }

      if (definition.qlId === "SYL-QL-001" && seed === 0) {
        const somePremise = question.structuredPrompt.premises.find((premise) => premise.form === "SOME");
        const noPremise = question.structuredPrompt.premises.find((premise) => premise.form === "NO");
        assert.ok(somePremise && noPremise, "QL-001 seed 0 regression premises missing");
        const excludedTerm = noPremise.subject === somePremise.predicate
          ? noPremise.predicate
          : noPremise.subject;
        assert.equal(witnesses.length, 1, `${locale}: expected one decisive witness`);
        assert.equal(witnesses[0].source, "PREMISE");
        assert.ok(witnesses[0].inside.includes(somePremise.subject));
        assert.ok(witnesses[0].inside.includes(somePremise.predicate));
        assert.ok(witnesses[0].outside.includes(excludedTerm));
      }
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.ok(enabled > 0);
assert.ok(omitted > 0);
assert.equal(targetGeometryFailures, 0);
assert.equal(targetWitnessFailures, 0);
assert.equal(closureFailures, 0);
assert.equal(metadataPointFailures, 0);
assert.equal(expectedWitnessMismatches, 0);
assert.ok(premiseAnchoredExistentialProofs > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_COMPLETE_DIAGRAM_PROOF_AUDIT",
  records,
  enabled,
  omitted,
  targetGeometryFailures,
  targetWitnessFailures,
  closureFailures,
  metadataPointFailures,
  expectedWitnessMismatches,
  premiseAnchoredExistentialProofs,
  regression: {
    qlId: "SYL-QL-001",
    seed: 0,
    witnessContract: "inside both SOME classes; outside the NO-linked class",
    locales,
  },
}, null, 2));
