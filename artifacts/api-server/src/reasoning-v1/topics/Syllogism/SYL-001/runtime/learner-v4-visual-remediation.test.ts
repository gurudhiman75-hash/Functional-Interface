import type { SylLocale, TermId } from "../foundation/types";
import { generateSylQuestionV4 } from "./generator-v4";
import { SYL_QL_REGISTRY } from "./ql-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

interface ParsedCircle {
  panel: string;
  terms: readonly TermId[];
  cx: number;
  cy: number;
  r: number;
}

interface PairMarker {
  panel: string;
  left: TermId;
  right: TermId;
  geometry: "identity" | "containment" | "overlap" | "separate";
  basis: "IDENTITY" | "ALL" | "NO" | "DERIVED_NO" | "SOME" | "MODEL_WITNESS" | "NO_RELATION";
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

function pairMarkers(svg: string): readonly PairMarker[] {
  return [...svg.matchAll(/data-panel="([^"]+)" data-pair="([^|"]+)\|([^"]+)" data-geometry="(identity|containment|overlap|separate)" data-basis="(IDENTITY|ALL|NO|DERIVED_NO|SOME|MODEL_WITNESS|NO_RELATION)"/gu)]
    .map((match) => ({
      panel: match[1],
      left: match[2],
      right: match[3],
      geometry: match[4] as PairMarker["geometry"],
      basis: match[5] as PairMarker["basis"],
    }));
}

function circleFor(parsed: readonly ParsedCircle[], panel: string, term: TermId): ParsedCircle | null {
  return parsed.find((circle) => circle.panel === panel && circle.terms.includes(term)) ?? null;
}

function actualGeometry(left: ParsedCircle, right: ParsedCircle): PairMarker["geometry"] {
  if (left === right) return "identity";
  const distance = Math.hypot(left.cx - right.cx, left.cy - right.cy);
  if (distance + left.r <= right.r - 1 || distance + right.r <= left.r - 1) return "containment";
  if (distance >= left.r + right.r + 1) return "separate";
  return "overlap";
}

function strictLegend(locale: SylLocale): string {
  if (locale === "hi-IN") return "जिन वर्गों के बीच कथनों से कोई प्रत्यक्ष या निष्कर्षित संबंध नहीं बनता, उनके वृत्त हमेशा अलग हैं";
  if (locale === "pa-IN") return "ਜਿਨ੍ਹਾਂ ਵਰਗਾਂ ਵਿਚ ਕਥਨਾਂ ਤੋਂ ਕੋਈ ਸਿੱਧਾ ਜਾਂ ਨਿਕਲਿਆ ਸੰਬੰਧ ਨਹੀਂ ਬਣਦਾ, ਉਨ੍ਹਾਂ ਦੇ ਘੇਰੇ ਹਮੇਸ਼ਾਂ ਵੱਖ ਹਨ";
  return "Classes with no stated or derived relation are always shown separately";
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let identityNoRecords = 0;
let witnessTransferRecords = 0;
let staticSomeOverlapPairs = 0;
let staticNoPairsSeparated = 0;
let staticRelationlessPairsSeparated = 0;
let renderedModelRecords = 0;
let strictModelOmissions = 0;
let pairGeometryChecks = 0;
let explicitNoPairsSeparated = 0;
let derivedNoPairsSeparated = 0;
let relationlessPairsSeparated = 0;
let premiseOverlapPairs = 0;
let modelWitnessOverlapPairs = 0;
let firstQuestionValidated = false;

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
        assert(diagram.svg!.includes('data-relation="IDENTITY_AND_NO"'), `${key} omits identity from the separation diagram.`);
        identityNoRecords += 1;
      }

      if (diagram.mode === "VENN_WITNESS_TRANSFER") {
        assert(Boolean(diagram.svg), `${key} witness-transfer diagram is missing.`);
        const svg = diagram.svg!;
        assert(svg.includes('data-static-relation-aware="true"'), `${key} retained the old unvalidated witness-transfer geometry.`);
        const parsedCircles = circles(svg);
        const markers = pairMarkers(svg);
        assert(parsedCircles.length === 3, `${key} witness-transfer diagram must contain exactly three measurable circles.`);
        assert(markers.length === 3, `${key} witness-transfer diagram must declare all three pair relations.`);

        for (const marker of markers) {
          const leftCircle = circleFor(parsedCircles, marker.panel, marker.left);
          const rightCircle = circleFor(parsedCircles, marker.panel, marker.right);
          assert(leftCircle && rightCircle, `${key}/${marker.left}-${marker.right} lacks a measurable circle.`);
          const actual = actualGeometry(leftCircle, rightCircle);
          assert(actual === marker.geometry, `${key}/${marker.left}-${marker.right} is ${actual}, expected ${marker.geometry}.`);
          if (marker.basis === "SOME") {
            assert(marker.geometry === "overlap", `${key} SOME pair is not overlapping.`);
            staticSomeOverlapPairs += 1;
          } else if (marker.basis === "NO") {
            assert(marker.geometry === "separate", `${key} NO pair still overlaps.`);
            staticNoPairsSeparated += 1;
          } else if (marker.basis === "NO_RELATION") {
            assert(marker.geometry === "separate", `${key} unrelated pair still overlaps.`);
            staticRelationlessPairsSeparated += 1;
          } else {
            throw new Error(`${key} witness-transfer diagram uses unsupported basis ${marker.basis}.`);
          }
        }

        if (definition.qlId === "SYL-QL-001" && seed === 0 && locale === "en-IN") {
          const somePair = markers.find((marker) => marker.basis === "SOME");
          const noPair = markers.find((marker) => marker.basis === "NO");
          const unrelatedPair = markers.find((marker) => marker.basis === "NO_RELATION");
          assert(somePair?.geometry === "overlap", "First question does not show Windows–Stones overlap.");
          assert(noPair?.geometry === "separate", "First question still overlaps Stones–Books.");
          assert(unrelatedPair?.geometry === "separate", "First question still overlaps Windows–Books.");
          firstQuestionValidated = true;
        }
        witnessTransferRecords += 1;
      }

      if (diagram.modelSignature === null) continue;

      if (!diagram.enabled) {
        assert(diagram.mode === "OMITTED_NOT_USEFUL", `${key} disabled model diagram has an invalid mode.`);
        assert(diagram.omissionReason === "NO_STABLE_SIMPLE_VENN", `${key} disabled model diagram has an invalid reason.`);
        assert(diagram.svg === null && diagram.diagramCount === 0, `${key} omitted model diagram retained SVG content.`);
        assert(diagram.semanticSignature.includes("STRICT_NO_UNRELATED_OVERLAP"), `${key} model omission is not governed by the strict no-unrelated-overlap rule.`);
        strictModelOmissions += 1;
        continue;
      }

      assert(Boolean(diagram.svg), `${key} enabled model diagram is missing.`);
      const svg = diagram.svg!;
      assert(svg.includes('data-relation-aware-model="true"'), `${key} retained generic model geometry.`);
      assert(!svg.includes('data-basis="MODEL_WITNESS"'), `${key} still displays a model-only overlap.`);
      assert(diagram.caption?.includes(strictLegend(locale)), `${key} caption does not state the strict no-relation rule.`);
      assert(diagram.accessibleDescription?.includes(strictLegend(locale)), `${key} accessible description does not state the strict no-relation rule.`);

      const parsedCircles = circles(svg);
      const markers = pairMarkers(svg);
      assert(markers.length > 0, `${key} relation-aware diagram has no pair metadata.`);

      for (const marker of markers) {
        const leftCircle = circleFor(parsedCircles, marker.panel, marker.left);
        const rightCircle = circleFor(parsedCircles, marker.panel, marker.right);
        assert(leftCircle && rightCircle, `${key}/${marker.panel}/${marker.left}-${marker.right} lacks a circle.`);
        const actual = actualGeometry(leftCircle, rightCircle);
        assert(actual === marker.geometry, `${key}/${marker.panel}/${marker.left}-${marker.right} geometry is ${actual}, expected ${marker.geometry}.`);

        if (marker.basis === "NO") {
          assert(marker.geometry === "separate", `${key} explicit NO pair overlaps.`);
          explicitNoPairsSeparated += 1;
        }
        if (marker.basis === "DERIVED_NO") {
          assert(marker.geometry === "separate", `${key} derived NO pair overlaps.`);
          derivedNoPairsSeparated += 1;
        }
        if (marker.basis === "NO_RELATION") {
          assert(marker.geometry === "separate", `${key} relationless pair overlaps.`);
          relationlessPairsSeparated += 1;
        }
        if (marker.geometry === "overlap") {
          assert(marker.basis === "SOME", `${key} overlap is not supported by an existential premise.`);
          premiseOverlapPairs += 1;
        }
        if (marker.basis === "MODEL_WITNESS") modelWitnessOverlapPairs += 1;
        pairGeometryChecks += 1;
      }

      renderedModelRecords += 1;
    }
  }
}

assert(identityNoRecords > 0, "No identity-plus-separation record was validated.");
assert(witnessTransferRecords > 0, "No witness-transfer diagram was validated.");
assert(staticSomeOverlapPairs > 0, "No premise-supported witness-transfer overlap was validated.");
assert(staticNoPairsSeparated > 0, "No witness-transfer NO pair was proved separate.");
assert(staticRelationlessPairsSeparated > 0, "No witness-transfer unrelated pair was proved separate.");
assert(firstQuestionValidated, "The exact first English question was not validated.");
assert(renderedModelRecords > 0, "No strict relation-aware model diagram was validated.");
assert(strictModelOmissions > 0, "No model-only-overlap diagram was safely omitted.");
assert(explicitNoPairsSeparated > 0, "No explicit NO pair was proved separate.");
assert(relationlessPairsSeparated > 0, "No relationless pair was proved separate.");
assert(modelWitnessOverlapPairs === 0, "At least one model-only overlap remains visible.");
assert(pairGeometryChecks > renderedModelRecords, "Pair-level geometry coverage is unexpectedly low.");

console.log(JSON.stringify({
  status: "SYL-001 V4 all-mode strict geometry audit passed",
  identityNoRecords,
  witnessTransferRecords,
  staticSomeOverlapPairs,
  staticNoPairsSeparated,
  staticRelationlessPairsSeparated,
  firstQuestionValidated,
  renderedModelRecords,
  strictModelOmissions,
  pairGeometryChecks,
  explicitNoPairsSeparated,
  derivedNoPairsSeparated,
  relationlessPairsSeparated,
  premiseOverlapPairs,
  modelWitnessOverlapPairs,
}, null, 2));
