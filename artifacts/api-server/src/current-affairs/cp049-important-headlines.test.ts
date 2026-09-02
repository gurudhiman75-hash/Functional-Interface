import assert from "node:assert/strict";

import { extractHeadlineFactClaims } from "./intelligence";
import { evaluateCurrentAffairsEditorialPriority } from "./editorial-priority";

function claims(title: string) {
  return new Map(extractHeadlineFactClaims(title).map((claim) => [claim.factKey, claim.factValue]));
}

const scoTitle = "Prime Minister participates in the 26th SCO Summit in Bishkek, Kyrgyz Republic";
const sco = claims(scoTitle);
assert.equal(sco.get("acting_entity"), "Prime Minister");
assert.equal(sco.get("official_action"), "participates");
assert.match(sco.get("action_subject") ?? "", /26th SCO Summit/i);
assert.equal(evaluateCurrentAffairsEditorialPriority({ title: scoTitle, category: "international" }).tier, "critical");

const shaktiTitle = "AVM SHAKTI SHARMA SCRIPTS HISTORY AS FIRST (NON-MEDICAL) WOMAN TWO-STAR OFFICER IN THE DEFENCE SERVICES";
const shakti = claims(shaktiTitle);
assert.equal(shakti.get("appointee"), "AVM SHAKTI SHARMA");
assert.match(shakti.get("position") ?? "", /FIRST.*WOMAN TWO-STAR OFFICER/i);
assert.equal(evaluateCurrentAffairsEditorialPriority({ title: shaktiTitle, category: "defence" }).tier, "critical");

const takeover = claims("Air Marshal Sandeep Thareja takes over as DGAFMS");
assert.equal(takeover.get("appointee"), "Air Marshal Sandeep Thareja");
assert.equal(takeover.get("position"), "DGAFMS");

const assumedAppointment = claims("SURGEON VICE ADMIRAL MANISH HONWAD, VSM ASSUMED THE APPOINTMENT OF DIRECTOR & COMMANDANT OF THE ARMED FORCES MEDICAL COLLEGE, PUNE");
assert.match(assumedAppointment.get("appointee") ?? "", /MANISH HONWAD/i);
assert.match(assumedAppointment.get("position") ?? "", /DIRECTOR & COMMANDANT/i);

const foodConference = claims("States/UTs Food Secretaries Conference reviews various issues pertaining to Department of Food and Public Distribution");
assert.equal(foodConference.get("acting_entity"), "States/UTs Food Secretaries Conference");
assert.equal(foodConference.get("official_action"), "reviews");
assert.match(foodConference.get("action_subject") ?? "", /various issues pertaining/i);

const ippb = claims("India Post Payments Bank Celebrates 9th Foundation Day (IPPB Day 2026); launched DakPay Sound Box for Merchants and New Digital Platforms for Customers");
assert.equal(ippb.get("launching_entity"), "India Post Payments Bank");
assert.match(ippb.get("initiative") ?? "", /DakPay Sound Box/i);

const indiaDenmark = claims("India–Denmark Strengthen Bilateral Cooperation in MSME Development, Innovation & Intellectual Property");
assert.match(indiaDenmark.get("acting_entity") ?? "", /India–Denmark/);
assert.equal(indiaDenmark.get("official_action"), "strengthen");
assert.match(indiaDenmark.get("action_subject") ?? "", /Bilateral Cooperation/i);

const bhashini = claims("Digital India BHASHINI Division Organises BHASHINI SANGAM Workshop in Nepal; Strengthens India–Nepal Collaboration on Multilingual AI");
assert.match(bhashini.get("acting_entity") ?? "", /Digital India BHASHINI Division/i);
assert.equal(bhashini.get("official_action"), "organises");
assert.match(bhashini.get("action_subject") ?? "", /BHASHINI SANGAM Workshop/i);

assert.equal(
  evaluateCurrentAffairsEditorialPriority({ title: "Ministry of Coal holds Preparatory Meeting for Special Campaign 6.0", category: "national" }).tier,
  "routine",
);
assert.equal(
  evaluateCurrentAffairsEditorialPriority({ title: "Ministry of Earth Sciences launches Online National Quiz with MyGov to celebrate 20 years", category: "science_technology" }).tier,
  "routine",
);

console.log("CP-049 important-headline recovery contracts passed");
