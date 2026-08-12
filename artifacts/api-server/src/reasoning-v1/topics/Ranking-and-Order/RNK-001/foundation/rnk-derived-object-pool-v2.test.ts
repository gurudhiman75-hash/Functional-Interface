import assert from "node:assert/strict";

import {
  RNK_DERIVED_OPERATION_SURFACES_V2,
  RNK_DERIVED_QUANTITY_DOMAINS_V2,
  RNK_PARTITION_SCHEMES_V2,
  RNK_SYMBOLIC_OBJECT_POOL_V2,
  rnkDerivedOperationSurface,
  selectRnkDerivedQuantityDomain,
  selectRnkPartitionScheme,
  selectRnkSymbolicObjects,
  type RnkDerivedOperationKind,
} from "./rnk-derived-object-pool-v2";
import type { RnkObjectLocale } from "./rnk-object-pool-v2";

const locales: readonly RnkObjectLocale[] = ["en", "hi", "pa"];
const operationKinds: readonly RnkDerivedOperationKind[] = [
  "TRANSFER",
  "MULTIPLIER",
  "FRACTION_OF",
  "EXACT_DIFFERENCE",
  "SUM_COMPARISON",
  "CATEGORY_RATIO",
  "CATEGORY_AHEAD_COUNT",
  "BOUNDED_CONSECUTIVE_VALUES",
];

assert.equal(RNK_SYMBOLIC_OBJECT_POOL_V2.length, 52);
assert.equal(new Set(RNK_SYMBOLIC_OBJECT_POOL_V2.map((entry) => entry.id)).size, 52);
assert.equal(new Set(RNK_SYMBOLIC_OBJECT_POOL_V2.map((entry) => entry.symbol)).size, 52);
for (const object of RNK_SYMBOLIC_OBJECT_POOL_V2) {
  assert.ok(object.learnerFacingModes.includes("SYMBOL_ONLY"));
  assert.ok(object.learnerFacingModes.includes("OBJECT_LABEL"));
  for (const locale of locales) {
    assert.ok(object.labels[locale].includes(object.symbol));
    assert.equal(object.labels[locale], object.labels[locale].normalize("NFC"));
  }
}

assert.equal(RNK_DERIVED_QUANTITY_DOMAINS_V2.length, 8);
assert.equal(new Set(RNK_DERIVED_QUANTITY_DOMAINS_V2.map((entry) => entry.id)).size, 8);
for (const domain of RNK_DERIVED_QUANTITY_DOMAINS_V2) {
  assert.ok(domain.supportedOperations.length >= 2, `${domain.id}: too few supported operations`);
  for (const operation of domain.supportedOperations) {
    assert.ok(operationKinds.includes(operation), `${domain.id}: unknown operation ${operation}`);
  }
  for (const locale of locales) {
    assert.ok(domain.labels[locale].trim().length > 0);
    assert.ok(domain.higherMeaning[locale].trim().length > 0);
    assert.ok(domain.lowerMeaning[locale].trim().length > 0);
    assert.equal(domain.labels[locale], domain.labels[locale].normalize("NFC"));
  }
}
assert.ok(RNK_DERIVED_QUANTITY_DOMAINS_V2.some((entry) => entry.id === "WEIGHT"));
assert.ok(RNK_DERIVED_QUANTITY_DOMAINS_V2.some((entry) => entry.id === "MONEY_BALANCE"));
assert.ok(RNK_DERIVED_QUANTITY_DOMAINS_V2.some((entry) => entry.id === "AGE"));
assert.ok(RNK_DERIVED_QUANTITY_DOMAINS_V2.some((entry) => entry.id === "POPULATION_COUNT"));

assert.equal(RNK_PARTITION_SCHEMES_V2.length, 12);
assert.equal(new Set(RNK_PARTITION_SCHEMES_V2.map((entry) => entry.id)).size, 12);
assert.equal(RNK_PARTITION_SCHEMES_V2.filter((entry) => entry.examAuthenticity === "SOURCE_BACKED").length, 1);
assert.ok(RNK_PARTITION_SCHEMES_V2.some((entry) => entry.id === "boys-girls"));
for (const scheme of RNK_PARTITION_SCHEMES_V2) {
  for (const locale of locales) {
    assert.ok(scheme.wholeLabels[locale].trim().length > 0);
    assert.ok(scheme.categories[0][locale].trim().length > 0);
    assert.ok(scheme.categories[1][locale].trim().length > 0);
    assert.notEqual(scheme.categories[0][locale], scheme.categories[1][locale]);
    assert.equal(scheme.wholeLabels[locale], scheme.wholeLabels[locale].normalize("NFC"));
  }
}

assert.deepEqual(RNK_DERIVED_OPERATION_SURFACES_V2.map((entry) => entry.kind), operationKinds);
for (const kind of operationKinds) {
  const surface = rnkDerivedOperationSurface(kind);
  assert.equal(surface.kind, kind);
  for (const locale of locales) {
    assert.ok(surface.templates[locale].length >= 2, `${kind}/${locale}: too few templates`);
    for (const template of surface.templates[locale]) {
      assert.equal(template, template.normalize("NFC"));
      assert.equal(/[\u0000-\u001f\u007f]/u.test(template), false);
    }
  }
}

for (const count of [4, 5, 6, 7, 8, 10, 12, 16]) {
  for (let seed = 0; seed < 1000; seed += 1) {
    const first = selectRnkSymbolicObjects(seed, count);
    const second = selectRnkSymbolicObjects(seed, count);
    assert.deepEqual(first.map((entry) => entry.id), second.map((entry) => entry.id));
    assert.equal(new Set(first.map((entry) => entry.id)).size, count);
    assert.equal(new Set(first.map((entry) => entry.symbol)).size, count);
  }
}

for (let seed = 0; seed < 2000; seed += 1) {
  assert.equal(selectRnkDerivedQuantityDomain(seed).id, selectRnkDerivedQuantityDomain(seed).id);
  assert.equal(selectRnkPartitionScheme(seed).id, selectRnkPartitionScheme(seed).id);
}

console.log(JSON.stringify({
  status: "PASS",
  poolVersion: "RNK_DERIVED_OBJECT_POOL_V2",
  symbolicObjects: RNK_SYMBOLIC_OBJECT_POOL_V2.length,
  quantityDomains: RNK_DERIVED_QUANTITY_DOMAINS_V2.length,
  partitionSchemes: RNK_PARTITION_SCHEMES_V2.length,
  operationKinds: RNK_DERIVED_OPERATION_SURFACES_V2.length,
  localizedOperationTemplateCount: RNK_DERIVED_OPERATION_SURFACES_V2.reduce(
    (sum, entry) => sum + locales.reduce((localeSum, locale) => localeSum + entry.templates[locale].length, 0),
    0,
  ),
  deterministicSymbolicDrawsChecked: 1000 * 8,
  deterministicDomainAndPartitionChecks: 2000,
  frozenRuntimeAdoption: false,
}, null, 2));
