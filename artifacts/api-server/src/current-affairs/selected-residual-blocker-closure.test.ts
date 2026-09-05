import assert from "node:assert/strict";

import {
  recoverSelectedResidualFactsForTest,
  SELECTED_RESIDUAL_BLOCKER_CLOSURE_VERSION,
} from "./selected-residual-blocker-closure-runtime";

function values(title: string, text: string, sourceKey: string) {
  return recoverSelectedResidualFactsForTest({ title, text, sourceKey });
}

{
  const facts = values(
    "Money Market Operations as on August 31, 2026",
    "Money Markets Volume (One Leg) Weighted Average Rate Range A. Overnight Segment (I+II+III+IV) 6,65,977.81 4.98 1.00-5.60 I. Call Money 12,984.27 5.18 4.55-5.25",
    "rbi",
  );
  assert.equal(facts.length, 3);
  assert.equal(facts.find((item) => item.key === "acting_entity")?.value, "Reserve Bank of India");
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /₹6,65,977\.81 crore/);
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /4\.98% weighted average rate/);
}

{
  const facts = values(
    "Developments in India’s Balance of Payments during the First Quarter (April-June) of 2026-27",
    "Key Features of India’s BoP in Q1:2026-27 India’s current account recorded a deficit (CAD) of US$ 4.2 billion (0.5 per cent of GDP) in Q1:2026-27 as compared to US$ 3.4 billion a year ago.",
    "rbi",
  );
  assert.equal(facts.length, 3);
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /US\$ 4\.2 billion \(0\.5% of GDP\)/);
}

{
  const facts = values(
    "India’s GDP Performance",
    "India’s economy began 2026-27 on a strong note, with real GDP growth accelerating to 7.8% in Q1, riding on manufacturing and services, while real GVA rose 8.2%.",
    "pib",
  );
  assert.equal(facts.length, 3);
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /7\.8% real GDP growth in Q1 2026-27/);
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /8\.2%/);
}

{
  const facts = values(
    "Union Minister for Education graces NCERT’s 66th Foundation Day celebrations in New Delhi",
    "Union Minister for Education, Shri Pralhad Joshi today noted that NCERT has played an important role. Highlighting the launch of the Robotics Learning Centre, Translation Lab, and the upgraded Television Studio, he said that these facilities would support technology-enabled learning.",
    "pib",
  );
  assert.equal(facts.length, 3);
  assert.equal(facts.find((item) => item.key === "acting_entity")?.value, "Union Minister for Education, Shri Pralhad Joshi");
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /Robotics Learning Centre/);
}

{
  const facts = values(
    "“Recognise Persons with Disabilities by Their Abilities, Not Their Disability”: Dr. Virendra Kumar; Government and Social Institutions Join Hands to Take DISSSA to the Last Mile",
    "A Memorandum of Understanding (MoU) between the Department of Empowerment of Persons with Disabilities (DEPwD) and the Rajyoga Education Research Foundation (RERF) was signed for the launch of the Divyang Samanata, Sanrakshan evam Sashaktikaran Abhiyan (DISSSA).",
    "pib",
  );
  assert.equal(facts.length, 3);
  assert.equal(facts.find((item) => item.key === "official_action")?.value, "signed an MoU to launch");
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /DISSSA/);
}

assert.equal(SELECTED_RESIDUAL_BLOCKER_CLOSURE_VERSION, "ca-cp064-selected-residual-closure-v1");
console.log("CP064 selected residual blocker closure contract passed");
