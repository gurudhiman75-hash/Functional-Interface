import { modifierScene, type ModifierSceneV1 } from "./cp010-scene-types";

export const CP010_HARD_SCENES_V1: readonly ModifierSceneV1[] = [
  modifierScene({
    id: "MOD-H01", difficulty: "hard", ruleId: "GR-MOD-001", domain: "inquiry", errorIndex: 0,
    correctSegments: ["Examining the sequence of entries across three registers, the inquiry officer traced the mismatch to one late correction", "made after the monthly closing", "but before the external review", "began the following week."],
    errorSegments: ["Examining the sequence of entries across three registers, one late correction was traced by the inquiry officer as the source of the mismatch", "made after the monthly closing", "but before the external review", "began the following week."],
    reason: "The inquiry officer is the one examining the registers, so the opening participial phrase must attach to that officer rather than to 'one late correction'.",
  }),
  modifierScene({
    id: "MOD-H02", difficulty: "hard", ruleId: "GR-MOD-001", domain: "engineering", errorIndex: 1,
    correctSegments: ["Inspecting the support beams from the upper platform,", "the structural engineer noticed a fine crack near the eastern joint", "that was not visible", "from ground level."],
    errorSegments: ["Inspecting the support beams from the upper platform,", "a fine crack near the eastern joint was noticed by the structural engineer", "that was not visible", "from ground level."],
    reason: "The structural engineer performed the inspection, so the subject immediately controlled by the opening participial phrase must be the engineer.",
  }),
  modifierScene({
    id: "MOD-H03", difficulty: "hard", ruleId: "GR-MOD-002", domain: "committee", errorIndex: 2,
    correctSegments: ["Having reviewed the objections raised during the consultation,", "and compared them with the revised draft,", "the committee approved the final wording", "without reopening the earlier clauses."],
    errorSegments: ["Having reviewed the objections raised during the consultation,", "and compared them with the revised draft,", "the final wording was approved by the committee", "without reopening the earlier clauses."],
    reason: "The committee performed both introductory actions, so it must remain the subject of the main clause instead of 'the final wording'.",
  }),
  modifierScene({
    id: "MOD-H04", difficulty: "hard", ruleId: "GR-MOD-002", domain: "laboratory", errorIndex: 3,
    correctSegments: ["Having been calibrated twice that morning,", "and checked against the reference sample,", "before the second run began,", "the testing instrument produced stable readings throughout the trial."],
    errorSegments: ["Having been calibrated twice that morning,", "and checked against the reference sample,", "before the second run began,", "the technicians obtained stable readings from the testing instrument throughout the trial."],
    reason: "The opening passive participial phrases describe the testing instrument, so the main clause must keep the instrument as its subject.",
  }),
  modifierScene({
    id: "MOD-H05", difficulty: "hard", ruleId: "GR-MOD-003", domain: "policy", errorIndex: 0,
    correctSegments: ["Concerned about the sharp rise in pending cases, the regional manager asked each unit for a weekly disposal plan", "before the next review meeting", "scheduled for Friday", "at the zonal office."],
    errorSegments: ["Concerned about the sharp rise in pending cases, a weekly disposal plan was requested by the regional manager from each unit", "before the next review meeting", "scheduled for Friday", "at the zonal office."],
    reason: "The concern belongs to the regional manager, so the manager must be the subject following the opening adjective phrase.",
  }),
  modifierScene({
    id: "MOD-H06", difficulty: "hard", ruleId: "GR-MOD-003", domain: "fieldwork", errorIndex: 1,
    correctSegments: ["Aware that the bridge would close before sunset,", "the survey team completed the measurements on the far bank first", "under the revised field schedule", "before the final traffic block."],
    errorSegments: ["Aware that the bridge would close before sunset,", "the measurements on the far bank were completed first by the survey team", "under the revised field schedule", "before the final traffic block."],
    reason: "The survey team is aware of the closure, so the modifier must attach to 'the survey team', not to 'the measurements'.",
  }),
  modifierScene({
    id: "MOD-H07", difficulty: "hard", ruleId: "GR-MOD-004", domain: "legal-file", errorIndex: 2,
    correctSegments: ["The reviewing officer retained", "the annexure", "that contained the disputed signatures with the original file", "until the handwriting report arrived."],
    errorSegments: ["The reviewing officer retained", "the annexure", "with the original file that contained the disputed signatures", "until the handwriting report arrived."],
    reason: "The disputed signatures are in the annexure, so the relative clause must stay with 'annexure', not 'original file'.",
  }),
  modifierScene({
    id: "MOD-H08", difficulty: "hard", ruleId: "GR-MOD-004", domain: "procurement-records", errorIndex: 3,
    correctSegments: ["During the audit,", "the team requested", "a replacement copy", "of the invoice that showed the revised tax amount on a separate line, supplied by the vendor."],
    errorSegments: ["During the audit,", "the team requested", "a replacement copy", "of the invoice supplied by the vendor that showed the revised tax amount on a separate line."],
    reason: "The clause about showing the revised tax amount belongs to the invoice; placing 'that' next to 'vendor' wrongly changes the antecedent.",
  }),
  modifierScene({
    id: "MOD-H09", difficulty: "hard", ruleId: "GR-MOD-005", domain: "evaluation", errorIndex: 0,
    correctSegments: ["The board reconsidered only the applications challenged on procedural grounds, not the entire merit list,", "after receiving legal advice", "from the department", "late in the afternoon."],
    errorSegments: ["Only the board reconsidered the applications challenged on procedural grounds, not the entire merit list,", "after receiving legal advice", "from the department", "late in the afternoon."],
    reason: "The contrast limits what the board reconsidered, so 'only' must modify the applications, not the subject 'the board'.",
  }),
  modifierScene({
    id: "MOD-H10", difficulty: "hard", ruleId: "GR-MOD-005", domain: "inspection-scope", errorIndex: 1,
    correctSegments: ["Under the revised order,", "the inspection team may examine only the records created after 1 April, not earlier files", "unless a separate direction", "is issued by headquarters."],
    errorSegments: ["Under the revised order,", "only the inspection team may examine the records created after 1 April, not earlier files", "unless a separate direction", "is issued by headquarters."],
    reason: "The date contrast limits the records that may be examined, so 'only' should stand before the record phrase rather than before the inspection team.",
  }),
  modifierScene({
    id: "MOD-H11", difficulty: "hard", ruleId: "GR-MOD-006", domain: "performance", errorIndex: 2,
    correctSegments: ["After the software update,", "the average processing time fell", "by nearly one-third", "without any change in staffing levels."],
    errorSegments: ["After the software update,", "the average processing time fell", "nearly by one-third", "without any change in staffing levels."],
    reason: "'Nearly' modifies the fraction 'one-third', so it should directly precede that quantity.",
  }),
  modifierScene({
    id: "MOD-H12", difficulty: "hard", ruleId: "GR-MOD-006", domain: "capacity", errorIndex: 3,
    correctSegments: ["By the end of the second session,", "the storage area was", "almost completely full,", "with space remaining for only three more pallets."],
    errorSegments: ["By the end of the second session,", "the storage area was", "almost completely full,", "with space almost remaining for only three more pallets."],
    reason: "'Almost' belongs with the degree expression being approached; placing it before 'remaining' creates an awkward and unintended modifier scope.",
  }),
  modifierScene({
    id: "MOD-H13", difficulty: "hard", ruleId: "GR-MOD-007", domain: "deadline", errorIndex: 0,
    correctSegments: ["The supplier had not even acknowledged the final reminder", "when the purchase section began", "preparing the cancellation note", "for approval by the competent authority."],
    errorSegments: ["The supplier had even not acknowledged the final reminder", "when the purchase section began", "preparing the cancellation note", "for approval by the competent authority."],
    reason: "In the negative perfect construction, the natural focus order is 'had not even acknowledged', with 'even' after 'not'.",
  }),
  modifierScene({
    id: "MOD-H14", difficulty: "hard", ruleId: "GR-MOD-007", domain: "verification", errorIndex: 1,
    correctSegments: ["Although three reminders had been sent,", "the applicant had not even uploaded the identity document required for preliminary verification", "by the time the portal", "closed for the day."],
    errorSegments: ["Although three reminders had been sent,", "the applicant had even not uploaded the identity document required for preliminary verification", "by the time the portal", "closed for the day."],
    reason: "The focus adverb should follow the negative marker: 'had not even uploaded' is the standard and unambiguous order.",
  }),
  modifierScene({
    id: "MOD-H15", difficulty: "hard", ruleId: "GR-MOD-008", domain: "monitoring", errorIndex: 2,
    correctSegments: ["During the peak season,", "the control room", "normally reviews the overnight alerts before the morning shift begins", "unless an emergency requires immediate action."],
    errorSegments: ["During the peak season,", "the control room", "reviews normally the overnight alerts before the morning shift begins", "unless an emergency requires immediate action."],
    reason: "The frequency adverb 'normally' should precede the main verb 'reviews' rather than separate the verb from its object.",
  }),
  modifierScene({
    id: "MOD-H16", difficulty: "hard", ruleId: "GR-MOD-008", domain: "records-compliance", errorIndex: 3,
    correctSegments: ["Sensitive registers", "are never removed", "from the secured record room", "without written authorization from the section head."],
    errorSegments: ["Sensitive registers", "are never removed", "from the secured record room", "without never written authorization from the section head."],
    reason: "'Never' belongs with the verb phrase 'are never removed'; placing another 'never' inside the noun phrase 'written authorization' is incorrect.",
  }),
  modifierScene({
    id: "MOD-H17", difficulty: "hard", ruleId: "GR-MOD-009", domain: "technical-brief", errorIndex: 0,
    correctSegments: ["The specialist explained the revised calibration sequence carefully", "so that the technicians could distinguish", "the mandatory steps", "from the optional checks."],
    errorSegments: ["The specialist explained carefully the revised calibration sequence", "so that the technicians could distinguish", "the mandatory steps", "from the optional checks."],
    reason: "The manner adverb should not interrupt the close verb-object unit; 'explained the revised calibration sequence carefully' is the natural order.",
  }),
  modifierScene({
    id: "MOD-H18", difficulty: "hard", ruleId: "GR-MOD-009", domain: "case-review", errorIndex: 1,
    correctSegments: ["After comparing both versions,", "the reviewing officer recorded the differences clearly", "in the note sheet", "before sending the file onward."],
    errorSegments: ["After comparing both versions,", "the reviewing officer recorded clearly the differences", "in the note sheet", "before sending the file onward."],
    reason: "The object 'the differences' should remain next to 'recorded'; the manner adverb naturally follows the object in this structure.",
  }),
  modifierScene({
    id: "MOD-H19", difficulty: "hard", ruleId: "GR-MOD-010", domain: "evidence", errorIndex: 2,
    correctSegments: ["Before preparing the seizure memo,", "the investigation team sealed", "the envelope containing the original memory card inside the evidence locker", "under the witness seal."],
    errorSegments: ["Before preparing the seizure memo,", "the investigation team sealed", "the envelope inside the evidence locker containing the original memory card", "under the witness seal."],
    reason: "The participial phrase 'containing the original memory card' describes the envelope, so it must remain adjacent to 'envelope', not 'evidence locker'.",
  }),
  modifierScene({
    id: "MOD-H20", difficulty: "hard", ruleId: "GR-MOD-010", domain: "construction", errorIndex: 3,
    correctSegments: ["Before workers entered the area,", "after the overnight storm,", "as part of the damage record,", "the site engineer photographed the retaining wall damaged during the storm from several angles."],
    errorSegments: ["Before workers entered the area,", "after the overnight storm,", "as part of the damage record,", "the site engineer photographed the retaining wall from several angles damaged during the storm."],
    reason: "The past-participial phrase 'damaged during the storm' modifies the retaining wall and should stay next to that noun.",
  }),
];
