import assert from "node:assert/strict";
import { venNumericalSourceSupport } from "./ven-001-numerical.ts";

assert.equal(
  venNumericalSourceSupport("VEN-CP005", "both").status,
  "STRONG_LIBRARY_SUPPORT",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP006", "exactTwo").status,
  "STRONG_LIBRARY_SUPPORT",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP007", "percentage-count").status,
  "STRONG_LIBRARY_SUPPORT",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP007", "percentage-three-count").status,
  "STRONG_LIBRARY_SUPPORT",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP007", "percentage-total").status,
  "DIRECT_OPERATION_SUPPORT",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP007", "ratio-two").status,
  "DERIVED_EXTENSION",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP008", "missing-pair").status,
  "STRONG_LIBRARY_SUPPORT",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP008", "missing-triple").status,
  "DIRECT_OPERATION_SUPPORT",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP008", "missing-total").status,
  "DERIVED_EXTENSION",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP010", "minimum-intersection-2").status,
  "STRONG_LIBRARY_SUPPORT",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP010", "maximum-intersection-2").status,
  "SOURCE_GAP_OPEN",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP010", "minimum-intersection-3").status,
  "SOURCE_GAP_OPEN",
);
assert.equal(
  venNumericalSourceSupport("VEN-CP010", "maximum-union-3").status,
  "SOURCE_GAP_OPEN",
);

console.log("PASS_VEN_001_NUMERICAL_LIBRARY_SOURCE_SUPPORT_MAPPING");
