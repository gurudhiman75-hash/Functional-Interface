import assert from "node:assert/strict";

import {
  RNK_DERIVED_OPERATION_REQUIRED_VARIABLES,
  renderRnkDerivedOperation,
} from "./rnk-derived-operation-render-v2";
import type { RnkDerivedOperationKind } from "./rnk-derived-object-pool-v2";
import type { RnkObjectLocale } from "./rnk-object-pool-v2";

const locales: readonly RnkObjectLocale[] = ["en", "hi", "pa"];
const kinds = Object.keys(RNK_DERIVED_OPERATION_REQUIRED_VARIABLES) as RnkDerivedOperationKind[];
const variables = {
  A: "Aman",
  B: "Riya",
  C: "Karan",
  P: "Mehak",
  X: "₹20",
  K: "2",
  F: "1/2",
  D: "5",
  R: "2:1",
  N: "10",
  L: "17",
  H: "22",
};

let rendersChecked = 0;
for (const kind of kinds) {
  assert.ok(RNK_DERIVED_OPERATION_REQUIRED_VARIABLES[kind].length >= 2);
  for (const locale of locales) {
    for (let seed = 0; seed < 100; seed += 1) {
      const first = renderRnkDerivedOperation(kind, locale, seed, variables);
      const second = renderRnkDerivedOperation(kind, locale, seed, variables);
      assert.equal(first, second, `${kind}/${locale}/${seed}: non-deterministic render`);
      assert.equal(first, first.normalize("NFC"));
      assert.equal(/\{[A-Z][A-Z0-9_]*\}/.test(first), false, `${kind}/${locale}/${seed}: unresolved placeholder`);
      assert.equal(/[\u0000-\u001f\u007f]/u.test(first), false);
      assert.ok(first.length >= 8);
      rendersChecked += 1;
    }
  }
}

for (let seed = 0; seed < 100; seed += 1) {
  const hi = renderRnkDerivedOperation("TRANSFER", "hi", seed, variables);
  const pa = renderRnkDerivedOperation("TRANSFER", "pa", seed, variables);
  assert.equal(/देता|देती|करता|करती/u.test(hi), false, `TRANSFER/hi/${seed}: gendered verb leaked`);
  assert.equal(/ਦਿੰਦਾ|ਦਿੰਦੀ|ਕਰਦਾ|ਕਰਦੀ/u.test(pa), false, `TRANSFER/pa/${seed}: gendered verb leaked`);
  assert.ok(hi.includes("Aman") && hi.includes("Riya") && hi.includes("₹20"));
  assert.ok(pa.includes("Aman") && pa.includes("Riya") && pa.includes("₹20"));
}

assert.throws(
  () => renderRnkDerivedOperation("TRANSFER", "en", 1, { A: "Aman", B: "Riya" }),
  /Unresolved RNK derived-operation variable/,
);

console.log(JSON.stringify({
  status: "PASS",
  rendererVersion: "RNK_DERIVED_OPERATION_RENDER_V2",
  kinds: kinds.length,
  locales: locales.length,
  deterministicRendersChecked: rendersChecked,
  transferGenderNeutralityChecks: 200,
}, null, 2));
