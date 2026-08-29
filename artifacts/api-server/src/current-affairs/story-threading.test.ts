import assert from "node:assert/strict";

import { storyThreadSimilarity } from "./story-threading";

const schemeLaunch = {
  id: "event-1",
  title: "Punjab Agri Support Mission approved with ₹12,500 crore outlay",
  category: "punjab",
  eventDate: "2026-08-10",
  facts: [
    { key: "scheme_outlay", value: "₹12,500 crore" },
    { key: "beneficiary_count", value: "25 lakh farmers" },
  ],
};
const schemeGuidelines = {
  id: "event-2",
  title: "Punjab Agri Support Mission guidelines notified for farmers",
  category: "punjab",
  eventDate: "2026-08-14",
  facts: [
    { key: "scheme_outlay", value: "₹12,500 crore" },
    { key: "effective_date", value: "2026-09-01" },
  ],
};
const schemeDecision = storyThreadSimilarity(schemeLaunch, schemeGuidelines);
assert.equal(schemeDecision.allowed, true);
assert.ok(schemeDecision.score >= 0.72);
assert.ok(schemeDecision.sharedTitleTokens.includes("agri"));
assert.ok(schemeDecision.sharedTitleTokens.includes("support"));
assert.ok(schemeDecision.sharedTitleTokens.includes("mission"));

const oldUpdate = storyThreadSimilarity(
  schemeLaunch,
  { ...schemeGuidelines, id: "event-old", eventDate: "2026-11-10" },
);
assert.equal(oldUpdate.allowed, false);
assert.match(oldUpdate.reason, /time window/i);

const appointmentA = {
  id: "event-3",
  title: "RBI Executive Director appointment announced",
  category: "appointments",
  eventDate: "2026-08-05",
  facts: [
    { key: "appointee", value: "Ananya Rao" },
    { key: "position", value: "Executive Director" },
  ],
};
const appointmentB = {
  id: "event-4",
  title: "RBI Executive Director appointment announced",
  category: "appointments",
  eventDate: "2026-08-20",
  facts: [
    { key: "appointee", value: "Ravi Shankar" },
    { key: "position", value: "Executive Director" },
  ],
};
const appointmentDecision = storyThreadSimilarity(appointmentA, appointmentB);
assert.equal(appointmentDecision.allowed, false);
assert.match(appointmentDecision.reason, /appointee/);

const unrelated = storyThreadSimilarity(
  schemeLaunch,
  {
    id: "event-5",
    title: "Punjab launches new cyber security training centre",
    category: "punjab",
    eventDate: "2026-08-12",
    facts: [{ key: "headquarters", value: "Mohali" }],
  },
);
assert.equal(unrelated.allowed, false);

const differentCategory = storyThreadSimilarity(
  schemeLaunch,
  { ...schemeGuidelines, id: "event-6", category: "national" },
);
assert.equal(differentCategory.allowed, false);
assert.match(differentCategory.reason, /Categories differ/);

console.log("Current Affairs Studio CP013 story threading contracts passed");
