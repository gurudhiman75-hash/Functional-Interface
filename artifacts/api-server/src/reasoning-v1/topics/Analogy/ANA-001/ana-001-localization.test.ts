import assert from "node:assert/strict";
import { ANA_LOCALIZED_FACTS, localizedFactsFor } from "./localization";

assert.equal(ANA_LOCALIZED_FACTS.length, 248);
assert.equal(new Set(ANA_LOCALIZED_FACTS.map((fact) => fact.id)).size, 248);
assert.equal(new Set(ANA_LOCALIZED_FACTS.map((fact) => `${fact.locale}:${fact.canonicalFactId}`)).size, 248);

for (const fact of ANA_LOCALIZED_FACTS) {
  assert.ok(fact.left.trim());
  assert.ok(fact.right.trim());
  assert.ok(fact.predicate.trim());
  assert.match(fact.version, /^\d+\.\d+\.\d+$/);
  assert.ok(fact.locale === "hi-IN" || fact.locale === "pa-IN");
  assert.equal(fact.reviewedByNativeSpeaker, false);
}

const semanticRelations = [
  "SEM_COUNTRY_CAPITAL", "SEM_STATE_CAPITAL", "SEM_COUNTRY_CURRENCY", "SEM_ANIMAL_YOUNG",
  "SEM_MALE_FEMALE", "SEM_ANIMAL_SOUND", "SEM_ANIMAL_MOVEMENT", "SEM_WORKER_WORKPLACE",
  "SEM_WORKER_TOOL", "SEM_WORKER_PRODUCT", "SEM_INSTRUMENT_MEASUREMENT", "SEM_QUANTITY_UNIT",
  "SEM_OBJECT_FUNCTION", "SEM_PART_WHOLE", "SEM_MEMBER_CLASS", "SEM_INDIVIDUAL_GROUP",
  "SEM_PRODUCT_MATERIAL", "SEM_PLACE_PURPOSE",
] as const;

const lexicalRelations = [
  "LEX_SYNONYM", "LEX_ANTONYM", "LEX_INTENSITY_UP", "LEX_INTENSITY_DOWN", "LEX_CAUSE_EFFECT",
  "LEX_EFFECT_CAUSE", "LEX_CONDITION_SYMPTOM", "LEX_ACTION_RESULT", "LEX_OBJECT_CHARACTERISTIC",
  "LEX_WORD_DEFINITION", "LEX_DEFICIENCY_MISSING_QUALITY", "LEX_STUDY_SUBJECT",
] as const;

for (const locale of ["hi-IN", "pa-IN"] as const) {
  assert.equal(ANA_LOCALIZED_FACTS.filter((fact) => fact.locale === locale).length, 124);
  for (const relation of semanticRelations) {
    assert.ok(localizedFactsFor(locale, relation).length >= 4, `${locale}:${relation} needs at least four localized facts`);
  }
  for (const relation of lexicalRelations) {
    assert.ok(localizedFactsFor(locale, relation).length >= 4, `${locale}:${relation} needs at least four localized facts`);
  }
}

for (const fact of ANA_LOCALIZED_FACTS.filter((entry) => entry.relation.startsWith("LEX_"))) {
  assert.equal(fact.mode, "LANGUAGE_SPECIFIC");
}

assert.equal(new Set(ANA_LOCALIZED_FACTS.map((fact) => fact.relation)).size, 30);
console.log("ANA-001 expanded localization contract test passed.");