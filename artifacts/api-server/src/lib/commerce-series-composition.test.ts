import assert from "node:assert/strict";
import test from "node:test";
import { composePackageTestIds, snapshotSeriesComposition } from "./commerce-series-composition";

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
