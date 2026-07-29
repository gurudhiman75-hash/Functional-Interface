import assert from "node:assert/strict";

import { generateBlrCp003CompetitiveSvgReviewBundle } from "./cp003-competitive-svg-review";
import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";

const bundle = generateBlrCp003CompetitiveSvgReviewBundle();
const records = bundle.selected;
const fingerprints = new Set<string>();
let highlightedPathCount = 0;
let totalPayloadBytes = 0;

assert.equal(records.length, 128);
assert.equal(bundle.rejected.length, 92);
assert.equal(bundle.sourceRecordCount, 208);
assert.equal(bundle.sourceEligibleRecordCount, 116);
assert.equal(bundle.supplementalRecordCount, 12);

for (const record of records) {
  const diagram = record.proceduralLogic;
  assert.equal(record.metadata.runtimeVersion, "blr-cp003-competitive-svg-review-v5");
  assert.equal(record.metadata.hasSvgFamilyTree, true);
  assert.equal(record.metadata.svgRenderer, "native-inline-svg-v1");
  assert.equal(diagram.kind, "blood-relation-family-tree");
  assert.equal(diagram.version, 1);
  assert.ok(diagram.nodes.length >= 4);
  assert.ok(diagram.edges.length >= 3);
  assert.equal(new Set(diagram.nodes.map((node) => node.id)).size, diagram.nodes.length);
  assert.ok(diagram.nodes.every((node) => Number.isInteger(node.generation)));
  assert.ok(diagram.nodes.every((node) => node.label.trim().length > 0));
  assert.ok(diagram.edges.every((edge) =>
    diagram.nodes.some((node) => node.id === edge.sourceId) &&
    diagram.nodes.some((node) => node.id === edge.targetId),
  ));
  assert.ok(diagram.asciiFallback.includes("VISUAL FAMILY TREE GRID"));
  assert.ok(diagram.accessibleSummary.includes("Family tree with"));
  assert.ok(diagram.query?.answerLabel?.trim());
  assert.ok(diagram.query?.subjectId);
  assert.ok(diagram.query?.referenceId);
  assert.ok(diagram.query?.pathPersonIds?.length);
  assert.ok(diagram.query!.pathPersonIds!.length >= 3);
  assert.equal(diagram.query!.pathPersonIds![0], diagram.query!.subjectId);
  assert.equal(
    diagram.query!.pathPersonIds!.at(-1),
    diagram.query!.referenceId,
  );
  highlightedPathCount += 1;

  const markup = renderBlrCp003SvgFamilyTreeMarkup(diagram);
  assert.ok(markup.startsWith('<div class="svg-family-tree">'));
  assert.ok(markup.includes("<svg"));
  assert.ok(markup.includes('role="img"'));
  assert.ok(markup.includes("Answer:"));
  assert.ok(markup.includes("Parent–child"));
  assert.ok(!markup.includes("undefined"));
  assert.ok(!markup.includes("[object Object]"));

  const bytes = Buffer.byteLength(JSON.stringify(diagram), "utf8");
  totalPayloadBytes += bytes;
  assert.ok(bytes < 12_000, `${record.itemId} SVG payload is unexpectedly heavy: ${bytes} bytes.`);

  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
}

const averagePayloadBytes = Math.round(totalPayloadBytes / records.length);
assert.equal(highlightedPathCount, 128);
assert.ok(averagePayloadBytes < 8_000);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "NATIVE_INLINE_SVG_FAMILY_TREE_V5",
      activeRecords: records.length,
      svgDiagrams: records.length,
      highlightedAnswerPaths: highlightedPathCount,
      averageStructuredPayloadBytes: averagePayloadBytes,
      maximumPayloadBytes: 12_000,
      externalGraphLibrary: false,
      databaseMigrationRequired: false,
      lazyClientChunk: true,
      asciiFallbackRetained: true,
      permanentQlCount: 0,
      publicDeliveryEnabled: false,
    },
    null,
    2,
  ),
);
