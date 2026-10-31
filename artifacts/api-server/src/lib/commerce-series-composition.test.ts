import assert from "node:assert/strict";
import test from "node:test";
import { composePackageTestIds, snapshotSeriesComposition, seriesSelectionBlockers } from "./commerce-series-composition";

test("retains direct-test order and series order without duplicates", () => {
  assert.deepEqual(composePackageTestIds(["A", "B"], [["B", "C"], ["C", "D"]]), ["A", "B", "C", "D"]);
});

test("accepts a series-only package and empty groups deterministically", () => {
  assert.deepEqual(composePackageTestIds([], [["A", "B"]]), ["A", "B"]);
  assert.deepEqual(composePackageTestIds(["A"], []), ["A"]);
});

test("stores immutable series references separately from granted test membership", () => {
  const direct = ["A"], versions = ["series-v1"];
  const snapshot = snapshotSeriesComposition(direct, versions);
  direct.push("B");
  versions.push("series-v2");
  assert.deepEqual(snapshot, { directTestIds: ["A"], seriesVersionIds: ["series-v1"] });
});

test("a later series revision does not alter previously resolved package tests", () => {
  const first = composePackageTestIds([], [["A", "B"]]);
  const next = composePackageTestIds([], [["A", "B", "C"]]);
  assert.deepEqual(first, ["A", "B"]);
  assert.deepEqual(next, ["A", "B", "C"]);
});

const now = new Date("2026-10-30T12:00:00.000Z");

test("rejects archived and hidden series during new package composition", () => {
  const blockers = seriesSelectionBlockers({
    archived: true, learnerVisibility: "hidden", availabilityEndAt: null,
    memberStatuses: ["live"], missingOrArchivedMembers: 0,
  }, now);
  assert.match(blockers.join(" "), /archived/i);
  assert.match(blockers.join(" "), /learner-visible/i);
});

test("rejects expired and empty series versions", () => {
  const blockers = seriesSelectionBlockers({
    archived: false, learnerVisibility: "live", availabilityEndAt: "2026-10-01T00:00:00Z",
    memberStatuses: [], missingOrArchivedMembers: 0,
  }, now);
  assert.match(blockers.join(" "), /ended/i);
  assert.match(blockers.join(" "), /no tests/i);
});

test("rejects unready or archived test members", () => {
  const blockers = seriesSelectionBlockers({
    archived: false, learnerVisibility: "live", availabilityEndAt: "2027-12-01T00:00:00Z",
    memberStatuses: ["live", "needs_fix"], missingOrArchivedMembers: 1,
  }, now);
  assert.match(blockers.join(" "), /archived tests/i);
  assert.match(blockers.join(" "), /not release-ready/i);
});

test("permits a future-start scheduled series without assuming the series is already open", () => {
  assert.deepEqual(seriesSelectionBlockers({
    archived: false, learnerVisibility: "live", availabilityEndAt: "2027-12-01T00:00:00Z",
    memberStatuses: ["scheduled", "live"], missingOrArchivedMembers: 0,
  }, now), []);
});

test("preserves unchanged prior purchased test IDs even after a series becomes archived", () => {
  const purchasedSnapshot = composePackageTestIds(["A"], [["B"]]);
  const blockers = seriesSelectionBlockers({
    archived: true, learnerVisibility: "live", availabilityEndAt: null,
    memberStatuses: ["live"], missingOrArchivedMembers: 0,
  }, now);
  assert.ok(blockers.length > 0);
  assert.deepEqual(purchasedSnapshot, ["A", "B"]);
});
