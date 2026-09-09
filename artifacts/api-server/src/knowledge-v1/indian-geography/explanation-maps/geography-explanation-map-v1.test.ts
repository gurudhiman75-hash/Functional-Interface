import { strict as assert } from "node:assert";

import {
  auditGeographyExplanationMapSpecV1,
  renderGeographyExplanationMapSvgV1,
  type GeographyExplanationMapSpecV1,
} from "./geography-explanation-map-v1";

const spec: GeographyExplanationMapSpecV1 = {
  schemaVersion: "GEO_EXPLANATION_MAP_V1",
  mapId: "test-confluence",
  kind: "CONFLUENCE",
  title: "Test confluence",
  viewportLabel: "Test river system",
  caption: "Two rivers meet and continue as one river.",
  geometryMode: "SCHEMATIC",
  geometryAuthorityId: "GEO-SCHEMATIC-V1",
  notToScale: true,
  sourceFactIds: ["fact-a", "fact-b"],
  nodes: [
    { id: "a", label: "River A", x: 18, y: 28, role: "river" },
    { id: "b", label: "River B", x: 18, y: 74, role: "river" },
    { id: "c", label: "Confluence", x: 50, y: 50, role: "confluence" },
    { id: "d", label: "River C", x: 84, y: 50, role: "river" },
  ],
  links: [
    { id: "a-c", from: "a", to: "c" },
    { id: "b-c", from: "b", to: "c" },
    { id: "c-d", from: "c", to: "d" },
  ],
};

const audit = auditGeographyExplanationMapSpecV1(spec);
assert.equal(audit.valid, true, audit.issues.join("\n"));

const render = renderGeographyExplanationMapSvgV1(spec);
assert.equal(render.width, 320);
assert.equal(render.height, 180);
assert.match(render.svg, /<svg/);
assert.match(render.svg, /Schematic · not to scale/);
assert.match(render.svg, /River A/);
assert.match(render.svg, /Confluence/);
assert.equal(render.altText, "Test confluence. Two rivers meet and continue as one river.");

const bad = auditGeographyExplanationMapSpecV1({
  ...spec,
  notToScale: false,
  nodes: [
    { id: "a", label: "River A", x: 0, y: 28, role: "river" },
    { id: "a", label: "Duplicate", x: 20, y: 50, role: "river" },
  ],
});
assert.equal(bad.valid, false);
assert.ok(bad.issues.includes("SCHEMATIC_MUST_BE_NOT_TO_SCALE"));
assert.ok(bad.issues.some((issue) => issue.startsWith("DUPLICATE_NODE:")));
assert.ok(bad.issues.some((issue) => issue.startsWith("NODE_X:")));
