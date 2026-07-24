import assert from "node:assert/strict";
import { ANA_LOCALIZED_FACTS, localizedFactsFor } from "./localization";

assert.equal(ANA_LOCALIZED_FACTS.length, 48);
assert.equal(new Set(ANA_LOCALIZED_FACTS.map((fact) => fact.id)).size, 48);

for (const fact of ANA_LOCALIZED_FACTS) {
  assert.ok(fact.left.trim());
  assert.ok(fact.right.trim());
  assert.ok(fact.predicate.trim());
  assert.match(fact.version, /^\d+\.\d+\.\d+$/);
  assert.ok(fact.locale === "hi-IN" || fact.locale === "pa-IN");
}

assert.equal(localizedFactsFor("hi-IN", "SEM_COUNTRY_CAPITAL").length, 4);
assert.equal(localizedFactsFor("pa-IN", "SEM_COUNTRY_CAPITAL").length, 4);
assert.equal(localizedFactsFor("hi-IN", "LEX_SYNONYM").length, 6);
assert.equal(localizedFactsFor("pa-IN", "LEX_SYNONYM").length, 6);
assert.equal(localizedFactsFor("hi-IN", "LEX_ANTONYM").length, 6);
assert.equal(localizedFactsFor("pa-IN", "LEX_ANTONYM").length, 6);

for (const fact of ANA_LOCALIZED_FACTS.filter((entry) => entry.relation.startsWith("LEX_"))) {
  assert.equal(fact.mode, "LANGUAGE_SPECIFIC");
}

console.log("ANA-001 localization contract test passed.");
