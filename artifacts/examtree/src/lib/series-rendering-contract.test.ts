import assert from "node:assert/strict";
import { detectSeriesRenderingContract } from "./series-rendering-contract";

const marker = detectSeriesRenderingContract(
  "Find the next group.\nABcD, ABCd, aBCD, ?",
);
assert.equal(marker?.kind, "CASE_MARKER");
if (marker?.kind === "CASE_MARKER") {
  assert.deepEqual(marker.markerDescriptions, [
    "lowercase c at position 3 of group 1",
    "lowercase d at position 4 of group 2",
    "lowercase a at position 1 of group 3",
  ]);
}

const periodic = detectSeriesRenderingContract(
  "Fill the blanks.\nW _ _ I W A E I W A E I W A E _",
);
assert.equal(periodic?.kind, "PERIODIC_GAP_LINE");
assert.equal(periodic?.seriesLine, "W _ _ I W A E I W A E I W A E _");

assert.equal(
  detectSeriesRenderingContract("Choose the synonym of the word given below."),
  null,
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SERIES_ACCESSIBLE_RENDERING_CONTRACT",
      markerDetection: marker?.kind,
      periodicGapDetection: periodic?.kind,
      ordinaryTextUnaffected: true,
    },
    null,
    2,
  ),
);
