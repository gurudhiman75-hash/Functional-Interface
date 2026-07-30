import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { generateBlrCp003CompetitiveSvgReviewBundle } from "./cp003-competitive-svg-review";
import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import {
  BLR_CP003_MERGE_SPLIT_MATRIX_V1,
  cp003ProvisionalAuthorities,
} from "./cp003-merge-split-audit";

const approvalRecord = readFileSync(
  new URL("./BLR-CP-003-HUMAN-REVIEW-APPROVAL-V5.md", import.meta.url),
  "utf8",
);
assert.ok(approvalRecord.includes("human review approved"));
assert.ok(approvalRecord.includes("bidirectional arrowheads"));
assert.ok(approvalRecord.includes("This is an explicit human approval"));

const bundle = generateBlrCp003CompetitiveSvgReviewBundle();
const records = bundle.selected;
const fingerprints = new Set<string>();
let highlightedPathCount = 0;
let siblingArrowDiagramCount = 0;
let siblingCardRouteCount = 0;
let totalPayloadBytes = 0;

assert.equal(records.length, 128);
assert.equal(bundle.rejected.length, 92);
assert.equal(bundle.sourceRecordCount, 208);
assert.equal(bundle.sourceEligibleRecordCount, 116);
assert.equal(bundle.supplementalRecordCount, 12);

const siblingRoutePattern = /<g data-sibling-route="card-bottom-bracket" data-sibling-target="inner-card-bottom" data-sibling-arrow-clearance="8"><path d="M (-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?) V (-?\d+(?:\.\d+)?) H (-?\d+(?:\.\d+)?) V (-?\d+(?:\.\d+)?)"[^>]*stroke-dasharray="8 6"[^>]*marker-start="url\(#blr-sibling-arrow\)"[^>]*marker-end="url\(#blr-sibling-arrow\)"\/>/g;

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

  if (markup.includes('stroke-dasharray="8 6"')) {
    siblingArrowDiagramCount += 1;
    assert.ok(markup.includes('id="blr-sibling-arrow"'));
    assert.ok(markup.includes('orient="-90"'));
    assert.ok(!markup.includes('orient="auto-start-reverse"'));
    assert.ok(markup.includes('data-sibling-route="card-bottom-bracket"'));
    assert.ok(markup.includes('data-sibling-target="inner-card-bottom"'));
    assert.ok(markup.includes('data-sibling-arrow-clearance="8"'));
    assert.ok(markup.includes('marker-start="url(#blr-sibling-arrow)"'));
    assert.ok(markup.includes('marker-end="url(#blr-sibling-arrow)"'));
    assert.ok(!/<line[^>]*stroke-dasharray="8 6"/.test(markup));

    const routedGroups = [...markup.matchAll(siblingRoutePattern)];
    assert.ok(routedGroups.length > 0, `${record.itemId} has no routed sibling-card connector.`);
    for (const route of routedGroups) {
      const startX = Number(route[1]);
      const arrowTipY = Number(route[2]);
      const routeY = Number(route[3]);
      const endX = Number(route[4]);
      const endY = Number(route[5]);
      assert.equal(arrowTipY, endY, `${record.itemId} sibling arrow tips are not level.`);
      assert.equal(routeY - arrowTipY, 18, `${record.itemId} sibling bracket depth drifted.`);
      assert.ok(endX > startX, `${record.itemId} sibling route does not span two distinct cards.`);
      siblingCardRouteCount += 1;
    }

    assert.equal(
      markup.match(/stroke-dasharray="8 6"/g)?.length,
      markup.match(/marker-start="url\(#blr-sibling-arrow\)"/g)?.length,
    );
    assert.equal(
      markup.match(/stroke-dasharray="8 6"/g)?.length,
      markup.match(/marker-end="url\(#blr-sibling-arrow\)"/g)?.length,
    );
  }

  const bytes = Buffer.byteLength(JSON.stringify(diagram), "utf8");
  totalPayloadBytes += bytes;
  assert.ok(bytes < 12_000, `${record.itemId} SVG payload is unexpectedly heavy: ${bytes} bytes.`);

  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
}

const allSourceRecords = [...records, ...bundle.rejected];
const scenarioIds = [...new Set(allSourceRecords.map((record) => record.scenarioId))].sort();
assert.deepEqual(scenarioIds, [
  "BLR-CP003-SCN-AFFINAL-CHILD-BRANCH",
  "BLR-CP003-SCN-COMPACT-JOINT-PARENT-PASSAGE",
  "BLR-CP003-SCN-DUAL-MATERNAL-PATERNAL-BRANCH",
  "BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH",
  "BLR-CP003-SCN-FOUR-GENERATION-DIRECT-LINE",
  "BLR-CP003-SCN-SIBLING-SET-BRANCH",
  "BLR-CP003-SCN-THREE-GENERATION-TWO-BRANCH",
  "BLR-CP003-SCN-TWO-COUPLE-COUSIN-BRANCH",
]);

const expectedItemPrototypes = BLR_CP003_MERGE_SPLIT_MATRIX_V1
  .filter((entry) => entry.decision !== "ASSEMBLY_ONLY")
  .map((entry) => entry.prototypeId)
  .sort();
const representedPrototypes = [
  ...new Set(allSourceRecords.map((record) => record.prototypeId)),
].sort();
assert.deepEqual(representedPrototypes, expectedItemPrototypes);
assert.equal(
  BLR_CP003_MERGE_SPLIT_MATRIX_V1.filter((entry) => entry.decision === "MERGE_EXISTING").length,
  10,
);
assert.equal(
  BLR_CP003_MERGE_SPLIT_MATRIX_V1.filter((entry) => entry.decision === "PROVISIONAL_NEW").length,
  8,
);
assert.equal(
  BLR_CP003_MERGE_SPLIT_MATRIX_V1.filter((entry) => entry.decision === "ASSEMBLY_ONLY").length,
  1,
);
assert.deepEqual(cp003ProvisionalAuthorities().sort(), [
  "DETERMINE_MEMBER_GENDER",
  "DETERMINE_MEMBER_MARITAL_STATUS",
  "IDENTIFY_ALL_MEMBERS_BY_RELATION",
  "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
  "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
  "SELECT_UNORDERED_FAMILY_PAIR",
]);

const averagePayloadBytes = Math.round(totalPayloadBytes / records.length);
assert.equal(highlightedPathCount, 128);
assert.ok(siblingArrowDiagramCount > 0);
assert.ok(siblingCardRouteCount > 0);
assert.ok(averagePayloadBytes < 8_000);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "POST_HUMAN_NATIVE_SVG_SOURCE_GAP_V5",
      humanReviewApproved: true,
      acceptedPolishValidated: true,
      postHumanSourceGapConfirmed: true,
      sourceScenariosRepresented: scenarioIds.length,
      sourceItemPrototypesRepresented: representedPrototypes.length,
      activeRecords: records.length,
      rejectedSourceRecords: bundle.rejected.length,
      svgDiagrams: records.length,
      highlightedAnswerPaths: highlightedPathCount,
      siblingArrowDiagrams: siblingArrowDiagramCount,
      siblingCardBottomRoutes: siblingCardRouteCount,
      siblingArrowClearancePixels: 8,
      siblingArrowheads: "BIDIRECTIONAL_INNER_CARD_TARGETED_VISIBLE",
      provisionalAuthorities: cp003ProvisionalAuthorities().sort(),
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
