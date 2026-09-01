import assert from "node:assert/strict";

import { scoreExamRelevance, type CurrentAffairsCategory } from "./core";

function score(category: CurrentAffairsCategory) {
  const scores = scoreExamRelevance({
    title: `Verified ${category} development for examination relevance testing`,
    summary: "Source-independent test summary.",
    importanceReason: "Contract fixture",
    eventDate: "2026-08-31",
    category,
    sourceKey: "pib",
    sourceUrl: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2305000",
    sourceTrustScore: 0.95,
    isPrimarySource: true,
    facts: [
      { key: "acting_entity", value: "Government of India", type: "entity", confidence: 0.95 },
      { key: "official_action", value: "announced", confidence: 0.95 },
      { key: "action_subject", value: "fixture", confidence: 0.95 },
    ],
  });
  return Object.fromEntries(scores.map((item) => [item.examFamily, item]));
}

const economy = score("economy_banking");
assert.equal(economy.banking?.includeRecommended, true);
assert.ok((economy.banking?.score ?? 0) > (economy.punjab?.score ?? 100));
assert.equal(economy.punjab?.includeRecommended, false);

const environment = score("environment");
assert.equal(environment.ssc?.includeRecommended, true);
assert.equal(environment.banking?.includeRecommended, false);
assert.equal(environment.punjab?.includeRecommended, false);

const punjab = score("punjab");
assert.equal(punjab.punjab?.includeRecommended, true);
assert.equal(punjab.banking?.includeRecommended, false);
assert.equal(punjab.ssc?.includeRecommended, false);

const appointments = score("appointments");
assert.equal(appointments.ssc?.includeRecommended, true);
assert.equal(appointments.banking?.includeRecommended, true);
assert.equal(appointments.punjab?.includeRecommended, true);

const other = score("other");
assert.equal(other.ssc?.includeRecommended, false);
assert.equal(other.banking?.includeRecommended, false);
assert.equal(other.punjab?.includeRecommended, false);

console.log("CP-043 exam-family relevance separation contracts passed");
