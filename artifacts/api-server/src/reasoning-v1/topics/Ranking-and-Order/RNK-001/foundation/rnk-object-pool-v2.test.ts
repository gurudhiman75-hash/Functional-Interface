import assert from "node:assert/strict";

import {
  RNK_DOMAIN_LEXICON_V2,
  RNK_GROUP_OBJECTS_V2,
  RNK_PERSON_POOL_V2,
  RNK_SETTING_OBJECTS_V2,
  rnkDomainLexicon,
  selectCompatibleRnkGroup,
  selectRnkPeople,
  selectRnkSetting,
  type RnkObjectLocale,
  type RnkRankingDomain,
} from "./rnk-object-pool-v2";
import {
  RNK_RELATION_TEMPLATES_V2,
  buildRnkPresentationBundle,
  renderRnkRelation,
  rnkRelationTemplates,
} from "./rnk-presentation-object-pool-v2";

const locales: readonly RnkObjectLocale[] = ["en", "hi", "pa"];
const ids = new Set<string>();
const visibleByLocale: Record<RnkObjectLocale, Set<string>> = {
  en: new Set(),
  hi: new Set(),
  pa: new Set(),
};
const genderCounts = { M: 0, F: 0 };

assert.ok(RNK_PERSON_POOL_V2.length >= 96, `Expected >=96 RNK people, found ${RNK_PERSON_POOL_V2.length}`);

for (const entry of RNK_PERSON_POOL_V2) {
  assert.equal(ids.has(entry.id), false, `Duplicate RNK person id: ${entry.id}`);
  ids.add(entry.id);
  genderCounts[entry.gender] += 1;
  assert.ok(entry.regionTags.includes("PAN_INDIA"));
  assert.ok(entry.regionTags.includes("PUNJAB_COMPATIBLE"));

  for (const locale of locales) {
    const label = entry.names[locale];
    assert.ok(label.length >= 2, `${entry.id}/${locale}: empty or too-short person name`);
    assert.equal(label, label.normalize("NFC"), `${entry.id}/${locale}: non-NFC name`);
    assert.equal(/[\u0000-\u001f\u007f]/u.test(label), false, `${entry.id}/${locale}: control character`);
    const normalized = label.toLocaleLowerCase(locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "pa-IN");
    assert.equal(visibleByLocale[locale].has(normalized), false, `${entry.id}/${locale}: duplicate visible name ${label}`);
    visibleByLocale[locale].add(normalized);
  }
}

assert.ok(genderCounts.M >= 48, `Expected >=48 male names, found ${genderCounts.M}`);
assert.ok(genderCounts.F >= 48, `Expected >=48 female names, found ${genderCounts.F}`);
assert.ok(Math.abs(genderCounts.M - genderCounts.F) <= 2, `Gender pool imbalance: ${JSON.stringify(genderCounts)}`);

assert.ok(RNK_GROUP_OBJECTS_V2.length >= 20, `Expected >=20 group objects, found ${RNK_GROUP_OBJECTS_V2.length}`);
assert.ok(RNK_SETTING_OBJECTS_V2.length >= 18, `Expected >=18 setting objects, found ${RNK_SETTING_OBJECTS_V2.length}`);
assert.equal(RNK_DOMAIN_LEXICON_V2.length, 6);
assert.equal(RNK_RELATION_TEMPLATES_V2.length, 6);

const groupIds = new Set(RNK_GROUP_OBJECTS_V2.map((entry) => entry.id));
assert.equal(groupIds.size, RNK_GROUP_OBJECTS_V2.length, "Duplicate RNK group object id");
const settingIds = new Set(RNK_SETTING_OBJECTS_V2.map((entry) => entry.id));
assert.equal(settingIds.size, RNK_SETTING_OBJECTS_V2.length, "Duplicate RNK setting object id");
const domains = new Set<RnkRankingDomain>();

for (const group of RNK_GROUP_OBJECTS_V2) {
  for (const locale of locales) {
    assert.ok(group.labels[locale].trim().length > 0, `${group.id}/${locale}: missing group label`);
    assert.equal(group.labels[locale], group.labels[locale].normalize("NFC"));
  }
}

for (const setting of RNK_SETTING_OBJECTS_V2) {
  domains.add(setting.domain);
  assert.ok(setting.compatibleGroupIds.length >= 2, `${setting.id}: too few compatible group objects`);
  for (const groupId of setting.compatibleGroupIds) {
    assert.ok(groupIds.has(groupId), `${setting.id}: unknown compatible group ${groupId}`);
  }
  for (const locale of locales) {
    assert.ok(setting.labels[locale].trim().length > 0, `${setting.id}/${locale}: missing setting label`);
    assert.equal(setting.labels[locale], setting.labels[locale].normalize("NFC"));
  }
}
assert.equal(domains.size, 6, `Expected all 6 ranking domains, found ${domains.size}`);

const bannedSeating = /\b(facing|seat|seating|immediate left|immediate right|clockwise|anticlockwise|adjacent)\b/i;
for (const setting of RNK_SETTING_OBJECTS_V2) {
  assert.equal(bannedSeating.test(setting.labels.en), false, `${setting.id}: Seating Arrangement leakage`);
}
for (const lexicon of RNK_DOMAIN_LEXICON_V2) {
  for (const locale of locales) {
    for (const value of [lexicon.higher[locale], lexicon.lower[locale], lexicon.equal[locale], lexicon.highest[locale], lexicon.lowest[locale], lexicon.orderHighToLow[locale]]) {
      assert.ok(value.trim().length > 0, `${lexicon.domain}/${locale}: empty lexicon value`);
      assert.equal(value, value.normalize("NFC"));
    }
  }
  assert.equal(bannedSeating.test([
    lexicon.higher.en,
    lexicon.lower.en,
    lexicon.equal.en,
    lexicon.highest.en,
    lexicon.lowest.en,
    lexicon.orderHighToLow.en,
  ].join(" ")), false, `${lexicon.domain}: Seating Arrangement vocabulary leakage`);
  assert.equal(rnkDomainLexicon(lexicon.domain).domain, lexicon.domain);
}

for (const templateSet of RNK_RELATION_TEMPLATES_V2) {
  assert.equal(rnkRelationTemplates(templateSet.domain).domain, templateSet.domain);
  for (const locale of locales) {
    for (const relation of ["higher", "lower", "equal"] as const) {
      const template = templateSet[relation][locale];
      assert.equal(template, template.normalize("NFC"));
      assert.ok(template.includes("{A}"), `${templateSet.domain}/${relation}/${locale}: missing {A}`);
      assert.ok(template.includes("{B}"), `${templateSet.domain}/${relation}/${locale}: missing {B}`);
      assert.equal(/\b(?:he|she|his|her)\b/i.test(template), false, `${templateSet.domain}/${relation}/${locale}: gendered pronoun leakage`);
      assert.equal(template.includes("/"), false, `${templateSet.domain}/${relation}/${locale}: slash-gender placeholder leakage`);
      const rendered = renderRnkRelation(templateSet.domain, relation, locale, "Aman", "Riya");
      assert.equal(rendered.includes("{A}"), false);
      assert.equal(rendered.includes("{B}"), false);
      assert.ok(rendered.includes("Aman"));
      assert.ok(rendered.includes("Riya"));
      assert.equal(rendered, rendered.normalize("NFC"));
    }
  }
}

for (const count of [5, 6, 7, 8, 10, 12]) {
  for (let seed = 0; seed < 1000; seed += 1) {
    const first = selectRnkPeople(seed, count, { genderMode: "BALANCED" });
    const second = selectRnkPeople(seed, count, { genderMode: "BALANCED" });
    assert.deepEqual(first.map((entry) => entry.id), second.map((entry) => entry.id), `${seed}/${count}: selector is not deterministic`);
    assert.equal(new Set(first.map((entry) => entry.id)).size, count, `${seed}/${count}: duplicate entity id in draw`);
    for (const locale of locales) {
      assert.equal(new Set(first.map((entry) => entry.names[locale])).size, count, `${seed}/${count}/${locale}: duplicate visible name in draw`);
    }
    const male = first.filter((entry) => entry.gender === "M").length;
    const female = first.length - male;
    assert.ok(Math.abs(male - female) <= 1, `${seed}/${count}: balanced selector drift ${male}/${female}`);
  }
}

for (let seed = 0; seed < 1000; seed += 1) {
  const first = selectRnkSetting(seed);
  const second = selectRnkSetting(seed);
  assert.equal(first.id, second.id, `${seed}: setting selector is not deterministic`);
  const groupFirst = selectCompatibleRnkGroup(seed, first);
  const groupSecond = selectCompatibleRnkGroup(seed, first);
  assert.equal(groupFirst.id, groupSecond.id, `${seed}: group selector is not deterministic`);
  assert.ok(first.compatibleGroupIds.includes(groupFirst.id), `${seed}: incompatible group ${groupFirst.id}/${first.id}`);
}

for (const domain of domains) {
  for (let seed = 0; seed < 50; seed += 1) {
    const setting = selectRnkSetting(seed, domain);
    assert.equal(setting.domain, domain);
  }
}

let presentationBundlesChecked = 0;
for (const locale of locales) {
  for (const domain of domains) {
    for (let seed = 0; seed < 100; seed += 1) {
      const first = buildRnkPresentationBundle(seed, 7, { locale, domain });
      const second = buildRnkPresentationBundle(seed, 7, { locale, domain });
      assert.equal(first.domain, domain);
      assert.equal(first.locale, locale);
      assert.equal(first.setting.domain, domain);
      assert.ok(first.setting.compatibleGroupIds.includes(first.group.id));
      assert.deepEqual(first.people.map((entry) => entry.id), second.people.map((entry) => entry.id));
      assert.equal(first.setting.id, second.setting.id);
      assert.equal(first.group.id, second.group.id);
      assert.equal(new Set(first.people.map((entry) => entry.names[locale])).size, 7);
      presentationBundlesChecked += 1;
    }
  }
}

console.log(JSON.stringify({
  status: "PASS",
  poolVersion: "RNK_OBJECT_POOL_V2",
  people: RNK_PERSON_POOL_V2.length,
  genderCounts,
  localizedPersonLabels: RNK_PERSON_POOL_V2.length * locales.length,
  groupObjects: RNK_GROUP_OBJECTS_V2.length,
  settingObjects: RNK_SETTING_OBJECTS_V2.length,
  domains: [...domains].sort(),
  relationTemplateSets: RNK_RELATION_TEMPLATES_V2.length,
  deterministicBalancedDrawsChecked: 1000 * 6,
  deterministicSettingDrawsChecked: 1000,
  presentationBundlesChecked,
  frozenRuntimeAdoption: false,
  nextAvailableQlUnaffected: "RNK-QL-042",
}, null, 2));
