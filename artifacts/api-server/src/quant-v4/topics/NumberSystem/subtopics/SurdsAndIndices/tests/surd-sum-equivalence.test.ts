import { strict as assert } from "node:assert";
import { equivalentSurdSum, rational, surdSum } from "../../../../../shared/surds-indices";

const expanded = surdSum([
  { coefficient: rational(1), radicand: 8n },
  { coefficient: rational(1), radicand: 18n },
]);
const canonical = surdSum([{ coefficient: rational(5), radicand: 2n }]);
assert.equal(equivalentSurdSum(expanded, canonical), true);
