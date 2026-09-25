# SIF-CP005 — Cause/Reason Suggestive Inference — Review V1

**Status:** Human review candidate; not frozen
**Chapter:** SIF-001 — Statement & Inference
**Runtime:** Structured evidence → degree of support → answer → language
**Difficulty contract:** Medium only, per approved blueprint
**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked

## Review focus

- judge whether surrounding evidence supports a likely contributing reason;
- do not treat sequence alone as proof of cause; look for corroborating, localized, comparative or operational evidence;
- use cautious inference language and reject sole-cause, certainty, motive and scope overclaims;
- keep purpose/intention questions in CP006 and formal cause/effect pairs in CAE-001;
- natural situations, concise statements and evidence-led explanations in English, Hindi and Punjabi.

**Authority pool:** 48 distinct scenarios
**Review coverage:** 24 distinct scenarios; three from each evidence pattern
**Difficulty balance:** 0 Easy / 24 Medium / 0 Hard
**Answer positions:** I 12 / II 12
**Automated gates:** PASS

## Evidence-pattern coverage

| Evidence pattern | Authorities | Review questions |
|---|---:|---:|
| DEMAND_SIGNAL | 6 | 3 |
| CONVERGING_CLUES | 6 | 3 |
| LOCALIZED_PATTERN | 6 | 3 |
| CONTROLLED_CHANGE | 6 | 3 |
| OPERATIONAL_EVIDENCE | 6 | 3 |
| RESOURCE_PRESSURE | 6 | 3 |
| SERVICE_PATTERN | 6 | 3 |
| ALTERNATIVE_CAUSE_LIMIT | 6 | 3 |

## Context coverage

| Context domain | Authorities |
|---|---:|
| BANKING | 5 |
| BUSINESS | 10 |
| EDUCATION | 7 |
| EVERYDAY | 4 |
| HEALTHCARE | 4 |
| PUBLIC_ADMINISTRATION | 8 |
| TRANSPORT | 5 |
| WORKPLACE | 5 |

## Q1 · SIF-CP005-DEMAND_SIGNAL-WINTER-SOUP

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Evidence pattern:** DEMAND_SIGNAL
**Controlled overreach:** SOLE_CAUSE
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** A restaurant's soup orders rose as evening temperatures fell. On colder evenings, both hot-soup orders and total dinner orders were higher.

**Inference I:** Colder weather may have contributed to the rise in hot-soup orders.
**Inference II:** The temperature drop was the only reason for the restaurant's higher total dinner sales.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Soup orders rose alongside colder evenings, which supports a possible contribution from the weather. The statement does not show that weather alone raised all dinner sales.

**Validation:** 10/10 gates passed

---

## Q2 · SIF-CP005-DEMAND_SIGNAL-SEED-REQUESTS

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Evidence pattern:** DEMAND_SIGNAL
**Controlled overreach:** SOLE_CAUSE
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** After a dry spell, farmers in the district submitted more requests for drought-resistant seeds. Requests for ordinary seed varieties remained near their earlier level.

**Inference I:** The dry conditions likely increased farmers' interest in drought-resistant seeds.
**Inference II:** The dry spell destroyed every farmer's crop in the district.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Requests for drought-resistant varieties rose after the dry spell, which supports increased interest. The statement does not report crop losses for every farmer.

**Validation:** 10/10 gates passed

---

## Q3 · SIF-CP005-DEMAND_SIGNAL-LOW-SALT-MEALS

**Difficulty:** MEDIUM
**Context:** HEALTHCARE
**Evidence pattern:** DEMAND_SIGNAL
**Controlled overreach:** SOLE_CAUSE
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** When the hospital added a low-salt meal option, more patients selected it. The number choosing the regular meal stayed close to its previous level.

**Inference I:** The new low-salt option likely met a preference among some patients.
**Inference II:** Most patients were medically required to avoid salt.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** More patients chose the added option, so it likely appealed to some of them. Their medical needs are not reported, so the stronger claim is unsupported.

**Validation:** 10/10 gates passed

---

## Q4 · SIF-CP005-CONVERGING_CLUES-COOLER-STORE

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Evidence pattern:** CONVERGING_CLUES
**Controlled overreach:** CERTAINTY_OVERREACH
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A grocery's dairy section recorded repeated temperature alarms, and several milk packets from that section spoiled. Products kept in the store's other refrigerators remained usable.

**Inference I:** A supplier deliberately delivered spoiled milk to the shop.
**Inference II:** A temperature-control problem in the dairy refrigerator likely contributed to the spoiled milk.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Alarms and spoilage occurred in the same refrigerator while other units were unaffected. That points to a local cooling issue, but says nothing about a supplier's intent.

**Validation:** 10/10 gates passed

---

## Q5 · SIF-CP005-CONVERGING_CLUES-ROAD-CRACKS

**Difficulty:** MEDIUM
**Context:** TRANSPORT
**Evidence pattern:** CONVERGING_CLUES
**Controlled overreach:** CERTAINTY_OVERREACH
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** A road section developed cracks after water pooled there for several weeks. Nearby sections with clear drainage showed no comparable cracking during the same period.

**Inference I:** Poor drainage is the only possible reason for every crack on the road.
**Inference II:** Prolonged water pooling may have contributed to the cracking in that section.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The damaged section had standing water unlike nearby sections, making water exposure a reasonable contributor. The evidence does not establish the sole cause of all road cracks.

**Validation:** 10/10 gates passed

---

## Q6 · SIF-CP005-CONVERGING_CLUES-COLD-ROOM-VEGETABLES

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Evidence pattern:** CONVERGING_CLUES
**Controlled overreach:** CERTAINTY_OVERREACH
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** Vegetables stored in one cold room wilted sooner than usual. The room's temperature log showed repeated warm periods, while vegetables stored in a separate room stayed fresh longer.

**Inference I:** The supplier sent low-quality vegetables to that room only.
**Inference II:** Repeated warm periods in the cold room may have shortened the vegetables' freshness.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The temperature record and difference between storage rooms support a storage-related contribution. Nothing here compares supplier quality by room.

**Validation:** 10/10 gates passed

---

## Q7 · SIF-CP005-LOCALIZED_PATTERN-NIGHT-SHIFT-DEFECTS

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Evidence pattern:** LOCALIZED_PATTERN
**Controlled overreach:** SCOPE_EXPANSION
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** A factory logged more packaging defects on night shifts than day shifts. The night-shift notes repeatedly mention a misaligned sealing guide; the day-shift guide was checked and aligned.

**Inference I:** The misaligned guide may have contributed to the night-shift defects.
**Inference II:** Night-shift workers were less careful than day-shift workers.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The defect pattern coincides with a documented equipment alignment issue. The notes do not compare worker care, so the equipment explanation is better supported.

**Validation:** 10/10 gates passed

---

## Q8 · SIF-CP005-LOCALIZED_PATTERN-RURAL-DELIVERY-DELAYS

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Evidence pattern:** LOCALIZED_PATTERN
**Controlled overreach:** SCOPE_EXPANSION
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** Postal deliveries were late in two blocks where a bridge was closed for repairs. Routes in other blocks did not cross the bridge and remained on schedule.

**Inference I:** The bridge closure likely contributed to delays on routes that used it.
**Inference II:** All postal delays in the district were caused by the bridge closure.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Only routes crossing the closed bridge were reported late; unaffected routes stayed on schedule. The closure is a reasonable contributor for those routes, not every district delay.

**Validation:** 10/10 gates passed

---

## Q9 · SIF-CP005-LOCALIZED_PATTERN-PARKING-LIGHTS

**Difficulty:** MEDIUM
**Context:** EVERYDAY
**Evidence pattern:** LOCALIZED_PATTERN
**Controlled overreach:** SCOPE_EXPANSION
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Complaints about a dark parking area came from the sections where two lamps had failed. Sections with working lamps received few such complaints.

**Inference I:** The failed lamps likely contributed to poor lighting in those sections.
**Inference II:** The entire parking area was unsafe for every visitor.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Complaints align with the sections whose lamps failed, so those lamps plausibly contributed to the darkness there. The report does not describe the whole area or establish a general safety conclusion.

**Validation:** 10/10 gates passed

---

## Q10 · SIF-CP005-CONTROLLED_CHANGE-FILTER-REPLACEMENT

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Evidence pattern:** CONTROLLED_CHANGE
**Controlled overreach:** SOLE_CAUSE
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** A bottling line's output slowed while its filter was clogged. After a replacement filter was fitted, output returned close to its usual rate; the line's staffing level was unchanged.

**Inference I:** The replacement filter permanently eliminated every possible cause of slow output.
**Inference II:** The clogged filter likely contributed to the slowdown.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Output recovered after the clogged filter was replaced, with staffing unchanged. This supports the filter as a contributor, but does not rule out other causes in future.

**Validation:** 10/10 gates passed

---

## Q11 · SIF-CP005-CONTROLLED_CHANGE-LEAK-CHECK

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Evidence pattern:** CONTROLLED_CHANGE
**Controlled overreach:** SOLE_CAUSE
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A municipal crew repaired a leaking joint on a water main. The next day's readings showed lower water loss in that section, while readings elsewhere were similar.

**Inference I:** The repair reduced water loss throughout the entire municipal network.
**Inference II:** Repairing the leaking joint likely contributed to the lower water loss in that section.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The drop was measured in the repaired section, not the whole network. The timing and location make the repair a plausible contributor to that local improvement.

**Validation:** 10/10 gates passed

---

## Q12 · SIF-CP005-CONTROLLED_CHANGE-VENTILATION-ROOM

**Difficulty:** MEDIUM
**Context:** HEALTHCARE
**Evidence pattern:** CONTROLLED_CHANGE
**Controlled overreach:** SOLE_CAUSE
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** A clinic began using an additional ventilated room for patients with respiratory symptoms. Reports of crowded waiting areas fell on busy days, although patient arrivals remained similar.

**Inference I:** The clinic's total patient demand declined.
**Inference II:** Using the additional room may have eased crowding in the waiting area.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Arrival numbers stayed similar while crowding complaints fell after the room was used. This supports a capacity-related contribution, not a decline in patient demand.

**Validation:** 10/10 gates passed

---

## Q13 · SIF-CP005-OPERATIONAL_EVIDENCE-MACHINE-VIBRATION

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Evidence pattern:** OPERATIONAL_EVIDENCE
**Controlled overreach:** UNSUPPORTED_MECHANISM
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A cutting machine began producing uneven edges. Its vibration readings were above the normal range, and the maintenance sheet noted a loose mounting bolt.

**Inference I:** The loose mounting may have contributed to the excessive vibration and uneven cuts.
**Inference II:** The operator used the wrong cutting settings.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** High vibration and a loose bolt were observed on the affected machine, making the mounting a plausible contributor. The settings used by the operator are not reported.

**Validation:** 10/10 gates passed

---

## Q14 · SIF-CP005-OPERATIONAL_EVIDENCE-WATER-QUALITY-ODOR

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Evidence pattern:** OPERATIONAL_EVIDENCE
**Controlled overreach:** UNSUPPORTED_MECHANISM
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Residents reported an unusual odour in water from one supply zone. Inspection found a damaged cover on that zone's storage tank; samples from other zones had no unusual odour.

**Inference I:** The damaged tank cover may have allowed contamination that contributed to the odour.
**Inference II:** The entire municipal water supply was unsafe.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The report was limited to one zone and found a damaged tank cover there. It supports a local contamination concern, not a conclusion about every supply zone.

**Validation:** 10/10 gates passed

---

## Q15 · SIF-CP005-OPERATIONAL_EVIDENCE-RECEIPT-FADE

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Evidence pattern:** OPERATIONAL_EVIDENCE
**Controlled overreach:** UNSUPPORTED_MECHANISM
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** Receipts from one printer faded within days. The printer's maintenance record showed a nearly empty toner cartridge, while receipts printed by another unit remained legible.

**Inference I:** The low toner level may have contributed to the faint printing.
**Inference II:** The receipt paper supplied to every printer was defective.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Only one printer's receipts faded, and that unit had very little toner. The comparison makes its toner a plausible factor, not a shared-paper fault.

**Validation:** 10/10 gates passed

---

## Q16 · SIF-CP005-RESOURCE_PRESSURE-PAPER-SHORTAGE

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Evidence pattern:** RESOURCE_PRESSURE
**Controlled overreach:** MOTIVE_WITHOUT_EVIDENCE
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** A district office ran short of application forms after weekly applications rose. The office's delivery records showed that its usual paper allotment had not increased.

**Inference I:** Office staff deliberately withheld forms from applicants.
**Inference II:** The higher application volume may have contributed to the shortage of forms.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Applications rose while the paper allotment stayed unchanged, making demand pressure a reasonable explanation. There is no evidence of deliberate withholding.

**Validation:** 10/10 gates passed

---

## Q17 · SIF-CP005-RESOURCE_PRESSURE-CLASSROOM-SEATS

**Difficulty:** MEDIUM
**Context:** EDUCATION
**Evidence pattern:** RESOURCE_PRESSURE
**Controlled overreach:** MOTIVE_WITHOUT_EVIDENCE
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** More students enrolled in an evening course than the classroom's listed seating capacity. Several students had to attend from an adjoining room with a video link.

**Inference I:** The college intentionally overcrowded the classroom to reduce expenses.
**Inference II:** Enrolment above the room's capacity likely contributed to the need for an adjoining room.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The enrolment exceeded the listed capacity and students were moved next door. This supports a capacity mismatch, but does not establish the college's motive.

**Validation:** 10/10 gates passed

---

## Q18 · SIF-CP005-RESOURCE_PRESSURE-WHEAT-TRUCKS

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Evidence pattern:** RESOURCE_PRESSURE
**Controlled overreach:** MOTIVE_WITHOUT_EVIDENCE
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A grain warehouse received more wheat deliveries than its unloading bay could handle each morning. Trucks waited outside, although the warehouse's evening shift had spare capacity.

**Inference I:** The warehouse lacked enough unloading capacity at every time of day.
**Inference II:** The concentration of deliveries in the morning likely contributed to the truck queue.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Morning arrivals exceeded the bay's capacity, while the evening shift had spare capacity. This points to a timing mismatch, not a constant shortage all day.

**Validation:** 10/10 gates passed

---

## Q19 · SIF-CP005-SERVICE_PATTERN-BUS-SERVICE

**Difficulty:** MEDIUM
**Context:** TRANSPORT
**Evidence pattern:** SERVICE_PATTERN
**Controlled overreach:** SEQUENCE_ONLY
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** A bus route had more late arrivals on days when roadworks narrowed its main corridor. Routes using other roads stayed close to their usual arrival times.

**Inference I:** The roadworks may have contributed to late arrivals on the affected route.
**Inference II:** The bus operator intentionally reduced service on every route.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Late arrivals were concentrated on the route using the narrowed corridor, while other routes stayed normal. This supports a local traffic contribution, not a general service cut.

**Validation:** 10/10 gates passed

---

## Q20 · SIF-CP005-SERVICE_PATTERN-ONLINE-APPOINTMENTS

**Difficulty:** MEDIUM
**Context:** HEALTHCARE
**Evidence pattern:** SERVICE_PATTERN
**Controlled overreach:** SEQUENCE_ONLY
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A clinic's missed appointments fell after it began sending appointment reminders. The number of appointments booked each week stayed about the same.

**Inference I:** The reminders may have helped some patients remember their appointments.
**Inference II:** The clinic reduced the number of appointments it offered.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Missed visits fell while bookings stayed similar, so reminders could have improved attendance. The figures do not show that fewer appointments were offered.

**Validation:** 10/10 gates passed

---

## Q21 · SIF-CP005-SERVICE_PATTERN-LIBRARY-RETURNS

**Difficulty:** MEDIUM
**Context:** EDUCATION
**Evidence pattern:** SERVICE_PATTERN
**Controlled overreach:** SEQUENCE_ONLY
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** A public library recorded more overdue books during a month when its return slot was inaccessible because of renovation. Returns at a nearby branch with an open slot stayed near normal.

**Inference I:** The inaccessible return slot may have made timely returns less convenient for some borrowers.
**Inference II:** Borrowers at both branches ignored all return rules.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Late returns rose where the slot was inaccessible but not at the comparison branch. This supports an access-related contribution and does not establish borrowers' general behaviour.

**Validation:** 10/10 gates passed

---

## Q22 · SIF-CP005-ALTERNATIVE_CAUSE_LIMIT-CROP-LEAF-SPOTS

**Difficulty:** MEDIUM
**Context:** EVERYDAY
**Evidence pattern:** ALTERNATIVE_CAUSE_LIMIT
**Controlled overreach:** CERTAINTY_OVERREACH
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Leaf spots appeared on plants in a greenhouse after several humid days. The vents were kept closed during that period, and the grower has not yet tested the plants for infection.

**Inference I:** The closed vents definitely caused a fungal infection in every plant.
**Inference II:** Limited ventilation may have contributed to conditions in which the leaf spots appeared.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Closed vents during humid weather could have contributed to the conditions, but testing is pending. The evidence does not identify a definite infection or show that every plant was affected.

**Validation:** 10/10 gates passed

---

## Q23 · SIF-CP005-ALTERNATIVE_CAUSE_LIMIT-RAIN-ATTENDANCE

**Difficulty:** MEDIUM
**Context:** EDUCATION
**Evidence pattern:** ALTERNATIVE_CAUSE_LIMIT
**Controlled overreach:** CERTAINTY_OVERREACH
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Attendance at an outdoor training session was low on a day of heavy rain. Several participants had also reported travel difficulties the previous evening; the organiser collected no reasons from absentees.

**Inference I:** Every absent participant stayed away because of the rain.
**Inference II:** Rain and travel difficulties may have contributed to the low attendance.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Heavy rain and reported travel problems make weather-related disruption a reasonable possibility. Since absence reasons were not collected, it cannot be assigned to every participant.

**Validation:** 10/10 gates passed

---

## Q24 · SIF-CP005-ALTERNATIVE_CAUSE_LIMIT-COUNTER-ERRORS

**Difficulty:** MEDIUM
**Context:** BANKING
**Evidence pattern:** ALTERNATIVE_CAUSE_LIMIT
**Controlled overreach:** CERTAINTY_OVERREACH
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** Cash-counting errors fell after a branch introduced a second-person verification step. During that month, the branch also had fewer new tellers than before.

**Inference I:** The verification step alone caused the entire decline in errors.
**Inference II:** The verification step may have contributed to the decline in cash-counting errors.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Errors fell after verification began, which supports a contribution. The change in teller experience is another possible influence, so sole attribution is not justified.

**Validation:** 10/10 gates passed

---

# Multilingual parity spot-check

## SIF-CP005-DEMAND_SIGNAL-LOW-SALT-MEALS · en-IN

**Statement:** When the hospital added a low-salt meal option, more patients selected it. The number choosing the regular meal stayed close to its previous level.

**Inference I:** The new low-salt option likely met a preference among some patients.
**Inference II:** Most patients were medically required to avoid salt.

**Answer state:** ONLY_I

**Explanation:** More patients chose the added option, so it likely appealed to some of them. Their medical needs are not reported, so the stronger claim is unsupported.

---

## SIF-CP005-DEMAND_SIGNAL-LOW-SALT-MEALS · hi-IN

**Statement:** अस्पताल में कम नमक वाले भोजन का विकल्प जुड़ने पर अधिक मरीजों ने उसे चुना। सामान्य भोजन चुनने वालों की संख्या पहले के करीब रही।

**Inference I:** कम नमक वाले नए विकल्प ने कुछ मरीजों की पसंद पूरी की होगी।
**Inference II:** अधिकांश मरीजों के लिए नमक से परहेज चिकित्सकीय रूप से आवश्यक था।

**Answer state:** ONLY_I

**Explanation:** अधिक मरीजों ने नया विकल्प चुना, इसलिए वह कुछ मरीजों को पसंद आया होगा। उनकी चिकित्सकीय जरूरतें नहीं बताई गईं, इसलिए बड़ा दावा सही नहीं है।

---

## SIF-CP005-DEMAND_SIGNAL-LOW-SALT-MEALS · pa-IN

**Statement:** ਹਸਪਤਾਲ ਵਿੱਚ ਘੱਟ ਲੂਣ ਵਾਲਾ ਭੋਜਨ ਸ਼ਾਮਲ ਹੋਣ 'ਤੇ ਵੱਧ ਮਰੀਜ਼ਾਂ ਨੇ ਇਹ ਚੁਣਿਆ। ਆਮ ਭੋਜਨ ਚੁਣਨ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਪਹਿਲਾਂ ਦੇ ਨੇੜੇ ਰਹੀ।

**Inference I:** ਘੱਟ ਲੂਣ ਵਾਲੇ ਨਵੇਂ ਵਿਕਲਪ ਨੇ ਕੁਝ ਮਰੀਜ਼ਾਂ ਦੀ ਪਸੰਦ ਪੂਰੀ ਕੀਤੀ ਹੋਵੇਗੀ।
**Inference II:** ਜ਼ਿਆਦਾਤਰ ਮਰੀਜ਼ਾਂ ਲਈ ਲੂਣ ਤੋਂ ਪਰਹੇਜ਼ ਡਾਕਟਰੀ ਤੌਰ 'ਤੇ ਲਾਜ਼ਮੀ ਸੀ।

**Answer state:** ONLY_I

**Explanation:** ਵੱਧ ਮਰੀਜ਼ਾਂ ਨੇ ਨਵਾਂ ਵਿਕਲਪ ਚੁਣਿਆ, ਇਸ ਲਈ ਉਹ ਕੁਝ ਮਰੀਜ਼ਾਂ ਨੂੰ ਪਸੰਦ ਆਇਆ ਹੋਵੇਗਾ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਡਾਕਟਰੀ ਲੋੜਾਂ ਨਹੀਂ ਦੱਸੀਆਂ, ਇਸ ਲਈ ਵੱਡਾ ਦਾਅਵਾ ਬਿਨਾਂ ਸਬੂਤ ਹੈ।

---

## SIF-CP005-CONVERGING_CLUES-COLD-ROOM-VEGETABLES · en-IN

**Statement:** Vegetables stored in one cold room wilted sooner than usual. The room's temperature log showed repeated warm periods, while vegetables stored in a separate room stayed fresh longer.

**Inference I:** The supplier sent low-quality vegetables to that room only.
**Inference II:** Repeated warm periods in the cold room may have shortened the vegetables' freshness.

**Answer state:** ONLY_II

**Explanation:** The temperature record and difference between storage rooms support a storage-related contribution. Nothing here compares supplier quality by room.

---

## SIF-CP005-CONVERGING_CLUES-COLD-ROOM-VEGETABLES · hi-IN

**Statement:** एक शीत-कक्ष में रखी सब्जियां सामान्य से जल्दी मुरझाईं। तापमान रिकॉर्ड में बार-बार गर्म अवधि दर्ज थी, जबकि दूसरे कक्ष की सब्जियां अधिक समय तक ताजी रहीं।

**Inference I:** आपूर्तिकर्ता ने केवल उसी कक्ष के लिए घटिया सब्जियां भेजीं।
**Inference II:** शीत-कक्ष की बार-बार की गर्म अवधि से सब्जियों की ताजगी कम हुई हो सकती है।

**Answer state:** ONLY_II

**Explanation:** तापमान रिकॉर्ड और दोनों कक्षों के अंतर से भंडारण का योगदान उचित लगता है। यहां कक्ष के अनुसार आपूर्तिकर्ता की गुणवत्ता की तुलना नहीं है।

---

## SIF-CP005-CONVERGING_CLUES-COLD-ROOM-VEGETABLES · pa-IN

**Statement:** ਇੱਕ ਠੰਢੇ ਕਮਰੇ ਵਿੱਚ ਰੱਖੀਆਂ ਸਬਜ਼ੀਆਂ ਆਮ ਨਾਲੋਂ ਜਲਦੀ ਮੁਰਝਾ ਗਈਆਂ। ਤਾਪਮਾਨ ਰਿਕਾਰਡ ਵਿੱਚ ਵਾਰ-ਵਾਰ ਗਰਮ ਸਮੇਂ ਦਰਜ ਸਨ, ਜਦਕਿ ਦੂਜੇ ਕਮਰੇ ਦੀਆਂ ਸਬਜ਼ੀਆਂ ਵੱਧ ਸਮੇਂ ਤੱਕ ਤਾਜ਼ੀਆਂ ਰਹੀਆਂ।

**Inference I:** ਸਪਲਾਇਰ ਨੇ ਸਿਰਫ਼ ਉਸ ਕਮਰੇ ਲਈ ਘਟੀਆ ਸਬਜ਼ੀਆਂ ਭੇਜੀਆਂ।
**Inference II:** ਠੰਢੇ ਕਮਰੇ ਦੇ ਵਾਰ-ਵਾਰ ਗਰਮ ਹੋਣ ਨਾਲ ਸਬਜ਼ੀਆਂ ਦੀ ਤਾਜ਼ਗੀ ਘਟੀ ਹੋ ਸਕਦੀ ਹੈ।

**Answer state:** ONLY_II

**Explanation:** ਤਾਪਮਾਨ ਰਿਕਾਰਡ ਅਤੇ ਦੋਵਾਂ ਕਮਰਿਆਂ ਦੇ ਫ਼ਰਕ ਨਾਲ ਭੰਡਾਰਨ ਦਾ ਯੋਗਦਾਨ ਵਾਜਬ ਲੱਗਦਾ ਹੈ। ਇੱਥੇ ਕਮਰੇ ਅਨੁਸਾਰ ਸਪਲਾਇਰ ਦੀ ਗੁਣਵੱਤਾ ਦੀ ਤੁਲਨਾ ਨਹੀਂ ਕੀਤੀ ਗਈ।

---

## SIF-CP005-LOCALIZED_PATTERN-PARKING-LIGHTS · en-IN

**Statement:** Complaints about a dark parking area came from the sections where two lamps had failed. Sections with working lamps received few such complaints.

**Inference I:** The failed lamps likely contributed to poor lighting in those sections.
**Inference II:** The entire parking area was unsafe for every visitor.

**Answer state:** ONLY_I

**Explanation:** Complaints align with the sections whose lamps failed, so those lamps plausibly contributed to the darkness there. The report does not describe the whole area or establish a general safety conclusion.

---

## SIF-CP005-LOCALIZED_PATTERN-PARKING-LIGHTS · hi-IN

**Statement:** अंधेरे पार्किंग क्षेत्र की शिकायतें उन्हीं हिस्सों से आईं जहां दो लैंप खराब थे। चालू लैंप वाले हिस्सों से ऐसी शिकायतें कम आईं।

**Inference I:** खराब लैंपों ने उन हिस्सों में कम रोशनी में योगदान दिया होगा।
**Inference II:** पूरा पार्किंग क्षेत्र हर आगंतुक के लिए असुरक्षित था।

**Answer state:** ONLY_I

**Explanation:** शिकायतें उन्हीं हिस्सों से जुड़ी थीं जहां लैंप खराब थे, इसलिए वहां अंधेरे में उनका योगदान संभव है। पूरे क्षेत्र या सामान्य सुरक्षा का निष्कर्ष नहीं दिया गया।

---

## SIF-CP005-LOCALIZED_PATTERN-PARKING-LIGHTS · pa-IN

**Statement:** ਹਨੇਰੀ ਪਾਰਕਿੰਗ ਥਾਂ ਬਾਰੇ ਸ਼ਿਕਾਇਤਾਂ ਉਨ੍ਹਾਂ ਹਿੱਸਿਆਂ ਤੋਂ ਆਈਆਂ ਜਿੱਥੇ ਦੋ ਲੈਂਪ ਖ਼ਰਾਬ ਸਨ। ਚੱਲਦੇ ਲੈਂਪਾਂ ਵਾਲੇ ਹਿੱਸਿਆਂ ਤੋਂ ਅਜਿਹੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਘੱਟ ਆਈਆਂ।

**Inference I:** ਖ਼ਰਾਬ ਲੈਂਪਾਂ ਨੇ ਉਨ੍ਹਾਂ ਹਿੱਸਿਆਂ ਵਿੱਚ ਘੱਟ ਰੌਸ਼ਨੀ ਲਈ ਯੋਗਦਾਨ ਪਾਇਆ ਹੋਵੇਗਾ।
**Inference II:** ਪੂਰੀ ਪਾਰਕਿੰਗ ਥਾਂ ਹਰ ਆਉਣ ਵਾਲੇ ਲਈ ਅਸੁਰੱਖਿਅਤ ਸੀ।

**Answer state:** ONLY_I

**Explanation:** ਸ਼ਿਕਾਇਤਾਂ ਉਨ੍ਹਾਂ ਹਿੱਸਿਆਂ ਨਾਲ ਜੁੜੀਆਂ ਸਨ ਜਿੱਥੇ ਲੈਂਪ ਖ਼ਰਾਬ ਸਨ, ਇਸ ਲਈ ਉੱਥੇ ਹਨੇਰੇ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਾ ਯੋਗਦਾਨ ਸੰਭਵ ਹੈ। ਪੂਰੀ ਥਾਂ ਜਾਂ ਆਮ ਸੁਰੱਖਿਆ ਬਾਰੇ ਨਤੀਜਾ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।

---

## SIF-CP005-ALTERNATIVE_CAUSE_LIMIT-COUNTER-ERRORS · en-IN

**Statement:** Cash-counting errors fell after a branch introduced a second-person verification step. During that month, the branch also had fewer new tellers than before.

**Inference I:** The verification step alone caused the entire decline in errors.
**Inference II:** The verification step may have contributed to the decline in cash-counting errors.

**Answer state:** ONLY_II

**Explanation:** Errors fell after verification began, which supports a contribution. The change in teller experience is another possible influence, so sole attribution is not justified.

---

## SIF-CP005-ALTERNATIVE_CAUSE_LIMIT-COUNTER-ERRORS · hi-IN

**Statement:** शाखा में दूसरी व्यक्ति द्वारा जांच शुरू होने के बाद नकदी गिनने की गलतियां घटीं। उस महीने नए कैशियर भी पहले से कम थे।

**Inference I:** गलतियों में पूरी कमी केवल जांच प्रक्रिया से आई।
**Inference II:** दूसरे व्यक्ति की जांच से नकदी गिनती की गलतियां घटने में योगदान मिला हो सकता है।

**Answer state:** ONLY_II

**Explanation:** जांच शुरू होने के बाद गलतियां घटीं, जिससे उसका योगदान संभव है। कैशियर के अनुभव में बदलाव भी प्रभाव डाल सकता था, इसलिए अकेला कारण नहीं कह सकते।

---

## SIF-CP005-ALTERNATIVE_CAUSE_LIMIT-COUNTER-ERRORS · pa-IN

**Statement:** ਸ਼ਾਖਾ ਵਿੱਚ ਦੂਜੇ ਵਿਅਕਤੀ ਵੱਲੋਂ ਜਾਂਚ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਨਕਦੀ ਗਿਣਤੀ ਦੀਆਂ ਗ਼ਲਤੀਆਂ ਘਟੀਆਂ। ਉਸ ਮਹੀਨੇ ਨਵੇਂ ਕੈਸ਼ੀਅਰ ਵੀ ਪਹਿਲਾਂ ਨਾਲੋਂ ਘੱਟ ਸਨ।

**Inference I:** ਗ਼ਲਤੀਆਂ ਵਿੱਚ ਪੂਰੀ ਕਮੀ ਸਿਰਫ਼ ਜਾਂਚ ਪ੍ਰਕਿਰਿਆ ਕਾਰਨ ਆਈ।
**Inference II:** ਦੂਜੇ ਵਿਅਕਤੀ ਦੀ ਜਾਂਚ ਨੇ ਨਕਦੀ ਗਿਣਤੀ ਦੀਆਂ ਗ਼ਲਤੀਆਂ ਘਟਣ ਵਿੱਚ ਯੋਗਦਾਨ ਪਾਇਆ ਹੋ ਸਕਦਾ ਹੈ।

**Answer state:** ONLY_II

**Explanation:** ਜਾਂਚ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਗ਼ਲਤੀਆਂ ਘਟੀਆਂ, ਜਿਸ ਨਾਲ ਇਸ ਦਾ ਯੋਗਦਾਨ ਸੰਭਵ ਹੈ। ਕੈਸ਼ੀਅਰਾਂ ਦੇ ਤਜਰਬੇ ਵਿੱਚ ਤਬਦੀਲੀ ਵੀ ਅਸਰ ਕਰ ਸਕਦੀ ਸੀ, ਇਸ ਲਈ ਇਕੱਲਾ ਕਾਰਨ ਨਹੀਂ ਕਹਿ ਸਕਦੇ।

---

## SIF-CP005-DEMAND_SIGNAL-MOBILE-RECHARGE · en-IN

**Statement:** A bank's small-value mobile recharges increased after it introduced an app-based recharge service. Branch counter transactions in other categories remained broadly stable.

**Inference I:** The app-based service likely made mobile recharges more convenient for some customers.
**Inference II:** Customers stopped visiting the bank for all other services.

**Answer state:** ONLY_I

**Explanation:** Recharge use rose after the app service began, while other counter activity stayed broadly stable. This supports added convenience for that task, not a complete shift away from branches.

---

## SIF-CP005-DEMAND_SIGNAL-MOBILE-RECHARGE · hi-IN

**Statement:** ऐप से रिचार्ज सेवा शुरू होने के बाद बैंक में छोटी राशि के मोबाइल रिचार्ज बढ़े। अन्य श्रेणियों के शाखा-काउंटर लेन-देन लगभग स्थिर रहे।

**Inference I:** ऐप-आधारित सेवा से कुछ ग्राहकों के लिए मोबाइल रिचार्ज अधिक सुविधाजनक हुए होंगे।
**Inference II:** ग्राहकों ने अन्य सभी सेवाओं के लिए बैंक आना बंद कर दिया।

**Answer state:** ONLY_I

**Explanation:** ऐप सेवा शुरू होने के बाद रिचार्ज बढ़े और अन्य काउंटर काम लगभग स्थिर रहे। इससे रिचार्ज की सुविधा बढ़ने का अनुमान उचित है, शाखाओं से पूरी तरह दूर जाने का नहीं।

---

## SIF-CP005-DEMAND_SIGNAL-MOBILE-RECHARGE · pa-IN

**Statement:** ਐਪ ਰਾਹੀਂ ਰੀਚਾਰਜ ਸੇਵਾ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਬੈਂਕ ਵਿੱਚ ਛੋਟੀ ਰਕਮ ਦੇ ਮੋਬਾਈਲ ਰੀਚਾਰਜ ਵਧੇ। ਹੋਰ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਸ਼ਾਖਾ ਕਾਊਂਟਰ ਲੈਣ-ਦੇਣ ਲਗਭਗ ਸਥਿਰ ਰਹੇ।

**Inference I:** ਐਪ-ਆਧਾਰਿਤ ਸੇਵਾ ਨਾਲ ਕੁਝ ਗਾਹਕਾਂ ਲਈ ਮੋਬਾਈਲ ਰੀਚਾਰਜ ਹੋਰ ਸੁਖਾਲੇ ਹੋਏ ਹੋਣਗੇ।
**Inference II:** ਗਾਹਕਾਂ ਨੇ ਹੋਰ ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ ਲਈ ਬੈਂਕ ਆਉਣਾ ਬੰਦ ਕਰ ਦਿੱਤਾ।

**Answer state:** ONLY_I

**Explanation:** ਐਪ ਸੇਵਾ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਰੀਚਾਰਜ ਵਧੇ ਅਤੇ ਹੋਰ ਕਾਊਂਟਰ ਕੰਮ ਲਗਭਗ ਸਥਿਰ ਰਹੇ। ਇਸ ਨਾਲ ਰੀਚਾਰਜ ਦੀ ਸਹੂਲਤ ਵਧਣ ਦਾ ਅਨੁਮਾਨ ਵਾਜਬ ਹੈ, ਸ਼ਾਖਾਵਾਂ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਦੂਰ ਹੋਣ ਦਾ ਨਹੀਂ।

---

## SIF-CP005-CONVERGING_CLUES-QUEUE-SLOWDOWN · en-IN

**Statement:** At a bank branch, queues lengthened on days when two counters were closed, and transaction records showed no unusual rise in customer arrivals on those days.

**Inference I:** A sudden surge in customer visits caused the queues.
**Inference II:** Reduced counter capacity likely contributed to longer queues.

**Answer state:** ONLY_II

**Explanation:** Fewer counters were operating while arrivals stayed ordinary, so reduced service capacity is a reasonable explanation for the queues. The records do not show a visit surge.

---

## SIF-CP005-CONVERGING_CLUES-QUEUE-SLOWDOWN · hi-IN

**Statement:** बैंक शाखा में दो काउंटर बंद रहने वाले दिनों कतारें लंबी हुईं। लेन-देन रिकॉर्ड में उन दिनों ग्राहकों के आने में असामान्य वृद्धि नहीं दिखी।

**Inference I:** ग्राहकों की अचानक बढ़ी हुई आमद से कतारें लगीं।
**Inference II:** काउंटरों की कम उपलब्धता से लंबी कतारों में योगदान मिला होगा।

**Answer state:** ONLY_II

**Explanation:** कम काउंटर चल रहे थे और ग्राहक आम संख्या में आए, इसलिए सेवा-क्षमता घटना कतारों का उचित कारण है। रिकॉर्ड में ग्राहकों की अचानक वृद्धि नहीं है।

---

## SIF-CP005-CONVERGING_CLUES-QUEUE-SLOWDOWN · pa-IN

**Statement:** ਬੈਂਕ ਸ਼ਾਖਾ ਵਿੱਚ ਦੋ ਕਾਊਂਟਰ ਬੰਦ ਰਹਿਣ ਵਾਲੇ ਦਿਨਾਂ ਕਤਾਰਾਂ ਲੰਮੀਆਂ ਹੋਈਆਂ। ਲੈਣ-ਦੇਣ ਰਿਕਾਰਡ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਿਨਾਂ ਗਾਹਕਾਂ ਦੇ ਆਉਣ ਵਿੱਚ ਕੋਈ ਅਸਧਾਰਨ ਵਾਧਾ ਨਹੀਂ ਸੀ।

**Inference I:** ਗਾਹਕਾਂ ਦੀ ਅਚਾਨਕ ਵਧੀ ਗਿਣਤੀ ਕਾਰਨ ਕਤਾਰਾਂ ਲੱਗੀਆਂ।
**Inference II:** ਕਾਊਂਟਰਾਂ ਦੀ ਘੱਟ ਸਮਰੱਥਾ ਨੇ ਲੰਮੀਆਂ ਕਤਾਰਾਂ ਵਿੱਚ ਯੋਗਦਾਨ ਪਾਇਆ ਹੋਵੇਗਾ।

**Answer state:** ONLY_II

**Explanation:** ਘੱਟ ਕਾਊਂਟਰ ਚੱਲ ਰਹੇ ਸਨ ਅਤੇ ਗਾਹਕ ਆਮ ਗਿਣਤੀ ਵਿੱਚ ਆਏ, ਇਸ ਲਈ ਸੇਵਾ ਸਮਰੱਥਾ ਘਟਣਾ ਕਤਾਰਾਂ ਦੀ ਵਾਜਬ ਵਜ੍ਹਾ ਹੈ। ਰਿਕਾਰਡ ਵਿੱਚ ਗਾਹਕਾਂ ਦਾ ਅਚਾਨਕ ਵਾਧਾ ਨਹੀਂ।

---
