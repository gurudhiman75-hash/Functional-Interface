import type { CanonicalModel, SurfacePremise, SylLocale, TermId } from "../foundation/types";
import { generateSylQuestionV4 } from "./generator-v4";
import { SYL_QL_REGISTRY } from "./ql-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function pairKey(left: TermId, right: TermId): string {
  return [left, right].sort().join("|");
}

function relationKey(subject: TermId, predicate: TermId): string {
  return `${subject}>${predicate}`;
}

function relationAuthority(premises: readonly SurfacePremise[], terms: readonly TermId[]) {
  const subset = new Set<string>(terms.map((term) => relationKey(term, term)));
  const directNo = new Set<string>();
  const disjoint = new Set<string>();
  const directOverlap = new Set<string>();

  for (const premise of premises) {
    if (!terms.includes(premise.subject) || !terms.includes(premise.predicate)) continue;
    if (premise.form === "ALL" || premise.form === "ARE_ONLY") {
      subset.add(relationKey(premise.subject, premise.predicate));
    } else if (premise.form === "ONLY") {
      subset.add(relationKey(premise.predicate, premise.subject));
    } else if (premise.form === "IDENTITY") {
      subset.add(relationKey(premise.subject, premise.predicate));
      subset.add(relationKey(premise.predicate, premise.subject));
    } else if (premise.form === "NO") {
      const key = pairKey(premise.subject, premise.predicate);
      directNo.add(key);
      disjoint.add(key);
    } else if (["SOME", "A_FEW", "ONLY_A_FEW"].includes(premise.form)) {
      directOverlap.add(pairKey(premise.subject, premise.predicate));
    }
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const a of terms) {
      for (const b of terms) {
        if (!subset.has(relationKey(a, b))) continue;
        for (const c of terms) {
          if (subset.has(relationKey(b, c)) && !subset.has(relationKey(a, c))) {
            subset.add(relationKey(a, c));
            changed = true;
          }
        }
      }
    }
  }

  changed = true;
  while (changed) {
    changed = false;
    for (const key of [...disjoint]) {
      const [left, right] = key.split("|") as [TermId, TermId];
      const leftSubsets = terms.filter((term) => subset.has(relationKey(term, left)));
      const rightSubsets = terms.filter((term) => subset.has(relationKey(term, right)));
      for (const a of leftSubsets) {
        for (const b of rightSubsets) {
          const derived = pairKey(a, b);
          if (a !== b && !disjoint.has(derived)) {
            disjoint.add(derived);
            changed = true;
          }
        }
      }
    }
  }

  return { subset, directNo, disjoint, directOverlap };
}

function jointWitness(model: CanonicalModel, left: TermId, right: TermId): boolean {
  return model.occupiedRegions.some((region) =>
    region.memberTerms.includes(left) && region.memberTerms.includes(right));
}

interface ExpectedPair {
  geometry: "identity" | "containment" | "overlap" | "separate";
  basis: "IDENTITY" | "ALL" | "NO" | "DERIVED_NO" | "SOME" | "MODEL_WITNESS" | "NO_RELATION";
  inner: TermId | null;
  outer: TermId | null;
}

function expectedPair(
  model: CanonicalModel,
  premises: readonly SurfacePremise[],
  left: TermId,
  right: TermId,
): ExpectedPair {
  const terms = model.termOrder.slice(0, 3);
  const authority = relationAuthority(premises, terms);
  const leftInRight = authority.subset.has(relationKey(left, right));
  const rightInLeft = authority.subset.has(relationKey(right, left));
  const key = pairKey(left, right);
  if (leftInRight && rightInLeft) return { geometry: "identity", basis: "IDENTITY", inner: null, outer: null };
  if (leftInRight) return { geometry: "containment", basis: "ALL", inner: left, outer: right };
  if (rightInLeft) return { geometry: "containment", basis: "ALL", inner: right, outer: left };
  if (authority.disjoint.has(key)) {
    return { geometry: "separate", basis: authority.directNo.has(key) ? "NO" : "DERIVED_NO", inner: null, outer: null };
  }
  if (jointWitness(model, left, right)) {
    return { geometry: "overlap", basis: authority.directOverlap.has(key) ? "SOME" : "MODEL_WITNESS", inner: null, outer: null };
  }
  return { geometry: "separate", basis: "NO_RELATION", inner: null, outer: null };
}

interface ParsedCircle {
  panel: string;
  terms: readonly TermId[];
  cx: number;
  cy: number;
  r: number;
}

function circles(svg: string): readonly ParsedCircle[] {
  return [...svg.matchAll(/<circle data-panel="([^"]+)" data-terms="([^"]+)" data-cx="([\d.]+)" data-cy="([\d.]+)" data-r="([\d.]+)"/gu)]
    .map((match) => ({
      panel: match[1],
      terms: match[2].split(","),
      cx: Number(match[3]),
      cy: Number(match[4]),
      r: Number(match[5]),
    }));
}

function circleFor(parsed: readonly ParsedCircle[], panel: string, term: TermId): ParsedCircle | null {
  return parsed.find((circle) => circle.panel === panel && circle.terms.includes(term)) ?? null;
}

function actualGeometry(left: ParsedCircle, right: ParsedCircle): "identity" | "containment" | "overlap" | "separate" {
  if (left === right) return "identity";
  const distance = Math.hypot(left.cx - right.cx, left.cy - right.cy);
  if (distance + left.r <= right.r - 1 || distance + right.r <= left.r - 1) return "containment";
  if (distance >= left.r + right.r + 1) return "separate";
  return "overlap";
}

function modelPanels(question: ReturnType<typeof generateSylQuestionV4>): readonly { panel: string; model: CanonicalModel }[] {
  const diagram = question.learnerPresentationV4.diagram;
  const admin = question.learnerPresentationV4.administratorProof;
  if (diagram.mode === "VENN_COUNTEREXAMPLE") {
    const model = admin.counterModel ?? admin.diagramSpecification.v3.model;
    return model ? [{ panel: "VENN_COUNTEREXAMPLE", model }] : [];
  }
  if (diagram.mode === "VENN_POSSIBILITY") {
    const model = admin.proofModel ?? admin.diagramSpecification.v3.model;
    return model ? [{ panel: "VENN_POSSIBILITY", model }] : [];
  }
  if (diagram.mode === "VENN_DUAL_MODEL") {
    const primary = admin.proofModel ?? admin.diagramSpecification.v3.model;
    const alternate = admin.counterModel ?? admin.alternateModel ?? admin.diagramSpecification.v3.alternateModel;
    return primary && alternate
      ? [{ panel: "TRUE", model: primary }, { panel: "FALSE", model: alternate }]
      : [];
  }
  return [];
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let identityNoRecords = 0;
let modelRecords = 0;
let dualRecords = 0;
let explicitNoPairsSeparated = 0;
let relationlessPairsSeparated = 0;
let modelWitnessOverlapPairs = 0;
let pairGeometryChecks = 0;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV4(definition.qlId, seed, locale);
      const diagram = question.learnerPresentationV4.diagram;
      const key = `${definition.qlId}/${seed}/${locale}`;
      const identity = question.structuredPrompt.premises.find((premise) => premise.form === "IDENTITY");
      const no = question.structuredPrompt.premises.find((premise) =>
        premise.form === "NO"
        && identity
        && [identity.subject, identity.predicate].some((term) =>
          premise.subject === term || premise.predicate === term));

      if (identity && no && diagram.mode === "VENN_SEPARATION") {
        assert(Boolean(diagram.svg), `${key} identity-separation diagram is missing.`);
        assert(diagram.svg!.includes('data-relation="IDENTITY_AND_NO"'), `${key} omits the identity relation from the separation diagram.`);
        assert(diagram.svg!.includes(`data-equivalent="${identity.subject},${identity.predicate}"`), `${key} does not preserve both equivalent classes.`);
        assert(diagram.caption?.includes(locale === "en-IN" ? "same set" : locale === "hi-IN" ? "एक ही वर्ग" : "ਇੱਕੋ ਵਰਗ"), `${key} identity caption is not explicit.`);
        identityNoRecords += 1;
      }

      if (diagram.modelSignature !== null) {
        assert(diagram.enabled, `${key} relation-aware model diagram was omitted.`);
        assert(Boolean(diagram.svg), `${key} relation-aware model diagram is missing.`);
        assert(diagram.svg!.includes('data-relation-aware-model="true"'), `${key} retained generic all-overlap model geometry.`);
        const legend = locale === "en-IN"
          ? "Classes with neither a premise relation nor a shared model member are shown separately"
          : locale === "hi-IN"
            ? "जिन वर्गों के बीच न कथन-संबंध है और न साझा मॉडल-सदस्य, उनके वृत्त अलग हैं"
            : "ਜਿਨ੍ਹਾਂ ਵਰਗਾਂ ਵਿਚ ਨਾ ਕਥਨ-ਸੰਬੰਧ ਹੈ ਅਤੇ ਨਾ ਸਾਂਝਾ ਮਾਡਲ-ਮੈਂਬਰ, ਉਨ੍ਹਾਂ ਦੇ ਘੇਰੇ ਵੱਖ ਹਨ";
        assert(diagram.caption?.includes(legend), `${key} model caption does not explain separation of unrelated classes.`);
        assert(diagram.accessibleDescription?.includes(legend), `${key} accessible description does not explain separation of unrelated classes.`);

        const parsed = circles(diagram.svg!);
        const panels = modelPanels(question);
        assert(panels.length > 0, `${key} has model evidence but no resolved model panel.`);
        for (const { panel, model } of panels) {
          const terms = model.termOrder.slice(0, 3);
          for (let i = 0; i < terms.length; i += 1) {
            for (let j = i + 1; j < terms.length; j += 1) {
              const left = terms[i];
              const right = terms[j];
              const expected = expectedPair(model, question.structuredPrompt.premises, left, right);
              const marker = `data-panel="${panel}" data-pair="${left}|${right}" data-geometry="${expected.geometry}" data-basis="${expected.basis}"`;
              assert(diagram.svg!.includes(marker), `${key}/${panel}/${left}-${right} lacks truthful pair geometry metadata.`);
              const leftCircle = circleFor(parsed, panel, left);
              const rightCircle = circleFor(parsed, panel, right);
              assert(leftCircle && rightCircle, `${key}/${panel}/${left}-${right} lacks a rendered circle.`);
              assert(actualGeometry(leftCircle, rightCircle) === expected.geometry, `${key}/${panel}/${left}-${right} visual geometry contradicts ${expected.geometry}.`);
              if (expected.geometry === "containment" && expected.inner && expected.outer) {
                const innerCircle = circleFor(parsed, panel, expected.inner)!;
                const outerCircle = circleFor(parsed, panel, expected.outer)!;
                const distance = Math.hypot(innerCircle.cx - outerCircle.cx, innerCircle.cy - outerCircle.cy);
                assert(distance + innerCircle.r <= outerCircle.r - 1, `${key}/${panel}/${left}-${right} containment direction is reversed.`);
              }
              if (expected.basis === "NO") explicitNoPairsSeparated += 1;
              if (expected.basis === "NO_RELATION") relationlessPairsSeparated += 1;
              if (expected.basis === "MODEL_WITNESS") modelWitnessOverlapPairs += 1;
              pairGeometryChecks += 1;
            }
          }
        }
        modelRecords += 1;
      }

      if (diagram.mode === "VENN_DUAL_MODEL") {
        assert(Boolean(diagram.svg), `${key} dual diagram is missing.`);
        assert(diagram.svg!.includes(".mini-model-label{font:750 12px"), `${key} dual model labels are below the mobile readability floor.`);
        assert(diagram.svg!.includes(".mini-witness{font:900 17px"), `${key} dual witnesses are below the mobile readability floor.`);
        dualRecords += 1;
      }
    }
  }
}

assert(identityNoRecords > 0, "No identity-plus-separation record was validated.");
assert(modelRecords > 0, "No relation-aware model diagram was validated.");
assert(dualRecords > 0, "No dual-model readability record was validated.");
assert(explicitNoPairsSeparated > 0, "No explicit NO pair was proved visually separate.");
assert(relationlessPairsSeparated > 0, "No relationless pair was proved visually separate.");
assert(modelWitnessOverlapPairs > 0, "No model-only overlap was identified and justified by a shared witness.");
assert(pairGeometryChecks > modelRecords, "Pair-level geometry audit coverage is unexpectedly low.");

console.log(JSON.stringify({
  status: "SYL-001 V4 relation-aware visual remediation audit passed",
  identityNoRecords,
  modelRecords,
  dualRecords,
  pairGeometryChecks,
  explicitNoPairsSeparated,
  relationlessPairsSeparated,
  modelWitnessOverlapPairs,
}, null, 2));
