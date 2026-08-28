import {
  TRG_002_DIAGRAM_REVIEW_REPRESENTATIVES,
  buildTrg002DiagramReviewCases,
  proofDiagramStrategies,
  renderTrg002DiagramReviewHtml,
} from "./runtime-proof-diagram-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seed = "trg002-diagram-review-gate-01";
const representedStrategies = new Set(TRG_002_DIAGRAM_REVIEW_REPRESENTATIVES.map((item) => item.strategy));
const representedQlIds = new Set(TRG_002_DIAGRAM_REVIEW_REPRESENTATIVES.map((item) => item.qlId));
const activeProofStrategies = proofDiagramStrategies(seed);

assert(TRG_002_DIAGRAM_REVIEW_REPRESENTATIVES.length === 13, "TRG-002 proof visual review must currently contain 13 representative strategy cards.");
assert(representedStrategies.size === 13, "Each visual-review representative must cover a distinct diagram strategy.");
assert(representedQlIds.size === 13, "Each visual-review representative must use a distinct permanent QL anchor.");
assert(activeProofStrategies.size === representedStrategies.size, "Visual-review strategy count must equal active proof strategy count.");
for (const strategy of activeProofStrategies) {
  assert(representedStrategies.has(strategy), `Active proof strategy ${strategy} is missing from the visual-review gallery.`);
}
for (const strategy of representedStrategies) {
  assert(activeProofStrategies.has(strategy), `Visual-review strategy ${strategy} is not represented by the active proof.`);
}

const cases = buildTrg002DiagramReviewCases(seed);
assert(cases.length === 13, "Expected 13 rendered visual-review cases.");
for (const item of cases) {
  assert(item.validation.valid, `${item.qlId} active question validation failed before visual rendering.`);
  assert(item.canonicalTargetVerification.valid, `${item.qlId} canonical requested-target verification failed before visual rendering.`);
  assert(item.diagramPolicyVerification.valid, `${item.qlId} diagram policy validation failed before visual rendering.`);
  assert(item.solutionAnnotationVerification.valid, `${item.qlId} solution annotation validation failed before visual rendering.`);
  assert(item.solutionAnnotations.length >= 1, `${item.qlId} visual review case must contain at least one exact solution annotation.`);
  assert(item.exactDiagram.strategy === item.strategy, `${item.qlId} rendered the wrong diagram strategy.`);
  assert(item.svg.includes("<svg"), `${item.qlId} SVG review output is missing the root element.`);
  assert(item.svg.includes(`data-diagram-strategy=\"${item.strategy}\"`), `${item.qlId} SVG strategy metadata is missing.`);
  assert(!/NaN|undefined|Infinity/.test(item.svg), `${item.qlId} SVG contains a non-finite or unresolved value.`);
  assert(!item.svg.includes("<script"), `${item.qlId} SVG review output must be script-free.`);

  for (const angle of item.exactDiagram.angles) {
    assert(item.svg.includes(angle.label), `${item.qlId} SVG is missing angle label ${angle.label}.`);
    assert(item.svg.includes(`data-angle-id=\"${angle.id}\"`), `${item.qlId} SVG is missing angle marker ${angle.id}.`);
  }
  for (const segment of item.exactDiagram.segments) {
    assert(item.svg.includes(`data-segment-id=\"${segment.id}\"`), `${item.qlId} SVG is missing segment ${segment.id}.`);
  }
  for (const annotation of item.solutionAnnotations) {
    assert(item.svg.includes(`data-annotation-id=\"${annotation.id}\"`), `${item.qlId} SVG is missing solution annotation ${annotation.id}.`);
    assert(item.svg.includes(annotation.label), `${item.qlId} SVG is missing exact annotation label ${annotation.label}.`);
  }
}

const html = renderTrg002DiagramReviewHtml(seed);
const cardCount = (html.match(/data-review-card=/g) ?? []).length;
assert(cardCount === 13, `Review gallery should contain 13 cards, found ${cardCount}.`);
assert(!/NaN|undefined|Infinity/.test(html), "Review gallery contains a non-finite or unresolved value.");
assert(!html.includes("<script"), "Review gallery must remain script-free and static.");
assert(html.includes("solution-diagram visual review"), "Review gallery heading is missing.");
assert(html.includes("does not emit stem diagrams"), "Review gallery must explicitly state that stem diagrams are not automatically emitted.");
assert(html.includes("SVG renderer does not infer mathematical values"), "Review gallery must state that measurement values are not inferred by the renderer.");

console.log("TRG-002 diagram review gate target: 13 active proof strategies rendered with exact solution-only measurement annotations.");
