import assert from "node:assert/strict";

import type { DailyMasterPackEvent } from "./daily-master-pack";
import {
  applySelectedLearnerEditorialQuality,
  selectedLearnerEditorialWarnings,
  SELECTED_LEARNER_EDITORIAL_VERSION,
} from "./selected-editorial-learner-quality";

function event(overrides: Partial<DailyMasterPackEvent> = {}): DailyMasterPackEvent {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    publicCode: "CA-TEST",
    category: "defence",
    eventDate: "2026-09-01",
    title: "Government of India: test",
    summary: "Test summary.",
    oneLiner: "Test one-liner.",
    examFamilies: ["ssc"],
    facts: [],
    sources: [{ name: "Press Information Bureau", url: "https://pib.gov.in/test", primary: true }],
    ...overrides,
  };
}

assert.equal(SELECTED_LEARNER_EDITORIAL_VERSION, "ca-cp074-learner-editorial-quality-v1");

const hande = applySelectedLearnerEditorialQuality(event({
  title: "Air Marshal Vivek Hande appointed DGMS (Air)",
  facts: [
    { key: "appointee", value: "Air Marshal Vivek Hande", type: "entity", confidence: 1 },
    { key: "position", value: "DGMS (Air)", type: "string", confidence: 1 },
    { key: "official_action", value: "appointed", type: "string", confidence: 1 },
  ],
  sources: [
    { name: "Press Information Bureau", url: "https://pib.gov.in/hande", primary: true },
    { name: "Press Information Bureau", url: "https://pib.gov.in/thareja", primary: false },
  ],
}), "en");
assert.equal(hande.title, "Vivek Hande appointed DGMS (Air)");
assert.equal(hande.summary, "On 1 September 2026, Vivek Hande was appointed as DGMS (Air).");
assert.equal(hande.category, "appointments");
assert.equal(hande.sources.length, 1);
assert.equal(hande.sources[0]?.url, "https://pib.gov.in/hande");
assert.deepEqual(hande.facts.map((fact) => fact.label), ["Appointee", "Position"]);
assert.equal(hande.facts.some((fact) => fact.key === "official_action"), false);

const thareja = applySelectedLearnerEditorialQuality(event({
  facts: [
    { key: "appointee", value: "Air Marshal Sandeep Thareja", type: "entity", confidence: 1 },
    { key: "position", value: "DGAFMS", type: "string", confidence: 1 },
  ],
}), "en");
assert.equal(thareja.title, "Sandeep Thareja appointed DGAFMS");
assert.equal(thareja.oneLiner, "Sandeep Thareja — DGAFMS.");
assert.equal(thareja.category, "appointments");

const shakti = applySelectedLearnerEditorialQuality(event({
  facts: [
    { key: "appointee", value: "AVM SHAKTI SHARMA", type: "entity", confidence: 1 },
    { key: "position", value: "FIRST (NON-MEDICAL) WOMAN TWO-STAR OFFICER IN THE DEFENCE SERVICES", type: "string", confidence: 1 },
  ],
}), "en");
assert.equal(shakti.title, "Shakti Sharma becomes first non-medical woman two-star officer in the defence services");
assert.equal(shakti.category, "defence");
assert.match(shakti.summary, /became the first non-medical woman two-star officer/);

const sco = applySelectedLearnerEditorialQuality(event({
  category: "international",
  facts: [
    { key: "acting_entity", value: "Prime Minister", type: "entity", confidence: 1 },
    { key: "official_action", value: "participates", type: "string", confidence: 1 },
    { key: "action_subject", value: "the 26th SCO Summit in Bishkek, Kyrgyz Republic", type: "string", confidence: 1 },
  ],
}), "en");
assert.equal(sco.title, "PM attends 26th SCO Summit in Bishkek");
assert.equal(sco.category, "summits");
assert.match(sco.summary, /participated in the 26th SCO Summit/);

const bhashini = applySelectedLearnerEditorialQuality(event({
  category: "national",
  facts: [
    { key: "acting_entity", value: "Digital India BHASHINI Division", type: "entity", confidence: 1 },
    { key: "official_action", value: "organises", type: "string", confidence: 1 },
    { key: "action_subject", value: "BHASHINI SANGAM Workshop in Nepal", type: "string", confidence: 1 },
  ],
}), "en");
assert.equal(bhashini.title, "BHASHINI holds SANGAM workshop in Nepal");
assert.equal(bhashini.category, "international");

const dgft = applySelectedLearnerEditorialQuality(event({
  category: "other",
  facts: [
    { key: "acting_entity", value: "DGFT", type: "entity", confidence: 1 },
    { key: "official_action", value: "enabled", type: "string", confidence: 1 },
    { key: "action_subject", value: "Automated Issuance of Free Sale and Commerce Certificates to Promote Ease of Doing Business", type: "string", confidence: 1 },
  ],
}), "en");
assert.equal(dgft.title, "DGFT automates Free Sale and Commerce Certificate issuance");
assert.equal(dgft.category, "economy_banking");

const cci = applySelectedLearnerEditorialQuality(event({
  title: "CCI clears TPG Nicobar SG's acquisition of Aseem Infrastructure Finance",
  oneLiner: "TPG Nicobar SG received CCI clearance to acquire Aseem Infrastructure Finance.",
  facts: [
    { key: "acting_entity", value: "CCI", type: "entity", confidence: 1 },
    { key: "official_action", value: "approves", type: "string", confidence: 1 },
    { key: "action_subject", value: "acquisition of Aseem Infrastructure Finance Limited by TPG Nicobar SG Pte. Ltd. and related transactions", type: "string", confidence: 1 },
  ],
}), "en");
assert.equal(cci.title, "CCI clears TPG Nicobar SG's acquisition of Aseem Infrastructure Finance");
assert.match(cci.summary, /^On 1 September 2026, CCI approved the acquisition/);

const warnings = selectedLearnerEditorialWarnings([
  event({ title: "PM highlights India's 7.8% GDP growth", summary: "India's GDP grew 7.8%." }),
  event({ id: "22222222-2222-4222-8222-222222222222", title: "India's real GDP grows 7.8% in Q1 2026-27", summary: "Real GDP growth was 7.8%." }),
]);
assert.equal(warnings.some((warning) => warning.includes("Potential learner-level topic overlap")), true);

console.log("CP-074 learner editorial quality contract passed");
