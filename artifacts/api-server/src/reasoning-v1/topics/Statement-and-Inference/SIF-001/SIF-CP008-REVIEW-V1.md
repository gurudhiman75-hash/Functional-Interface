# SIF-CP008 — Multi-Sentence Contextual Inference — Review V1

**Status:** Human review candidate; not frozen
**Chapter:** SIF-001 — Statement & Inference
**Difficulty scope:** Medium to Hard
**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked

## Review focus

- connect details stated in separate sentences of a short passage;
- keep administrative, service, survey, capacity, schedule and outcome claims within the stated scope;
- distinguish a recorded change or status from an unreported cause, result or future prediction;
- use only passage information and do not turn the item into assumption, conclusion, advice or cause/effect reasoning.

**Authority pool:** 32 trilingual scenarios across 8 synthesis families
**Review sample:** 24 distinct scenarios; three from each family
**Difficulty mix:** 12 Medium / 12 Hard
**Answer positions:** I 12 / II 12
**Automated gates:** PASS

## Synthesis-family coverage

| Family | Authorities | Review questions |
|---|---:|---:|
| PROCESS_RECORDS | 4 | 3 |
| RESOURCE_STATUS | 4 | 3 |
| SURVEY_SCOPE | 4 | 3 |
| SERVICE_COVERAGE | 4 | 3 |
| CAPACITY_RESULTS | 4 | 3 |
| SCHEDULED_WORK | 4 | 3 |
| DECISION_STATUS | 4 | 3 |
| COMPARATIVE_OUTCOMES | 4 | 3 |

## Q1 · SIF-CP008-PROCESS_RECORDS-PERMIT-FILES

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Synthesis family:** PROCESS_RECORDS
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The permit office stamped every form when it arrived. A clerk later checked each file for proof of residence and an income certificate. The weekly review list includes only files containing both documents.

**Inference I:** Every file on the weekly review list contained proof of residence and an income certificate.
**Inference II:** Every form stamped on arrival was complete.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The receipt stamp was given before document checking, but the review list was made only after both required papers were found. Thus, the listed files had both papers; the stamp alone did not show that every received form was complete. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q2 · SIF-CP008-PROCESS_RECORDS-CLINIC-REFERRALS

**Difficulty:** HARD
**Context:** HEALTHCARE
**Synthesis family:** PROCESS_RECORDS
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** The clinic logged each referral when it arrived. A nurse checked whether the referral included the required test report. Files with a report were sent to the specialist desk, while incomplete files were returned to the referring unit. The specialist desk scheduled only the files it received.

**Inference I:** A referral scheduled by the specialist desk had included the required test report.
**Inference II:** Every referral logged by the clinic was scheduled for a specialist appointment.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** A scheduled file had reached the specialist desk, and only files with the report were sent there. The clinic's receipt log also included files later returned as incomplete, so logging alone did not mean a specialist appointment was set. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q3 · SIF-CP008-PROCESS_RECORDS-TRAINING-CERTIFICATES

**Difficulty:** HARD
**Context:** WORKPLACE
**Synthesis family:** PROCESS_RECORDS
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Employees registered for the safety course through their departments. The training office recorded attendance at each session. A certificate was issued only after an employee attended all three sessions and passed the final check. The monthly attendance sheet also includes employees who missed a session.

**Inference I:** An employee who received a certificate attended all three sessions and passed the final check.
**Inference II:** Everyone listed on the monthly attendance sheet completed the course and received a certificate.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The certificate rule required all three sessions and a pass, so a certificate holder met both conditions. The attendance sheet was broader: it also recorded people who missed a session, so it did not show course completion for everyone listed. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q4 · SIF-CP008-RESOURCE_STATUS-LIBRARY-COPIES

**Difficulty:** MEDIUM
**Context:** EDUCATION
**Synthesis family:** RESOURCE_STATUS
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** The library received 40 extra copies of a science guide before the term examinations. The issue desk records a copy only when a student borrows it. By Friday, the issue register showed 27 copies issued.

**Inference I:** Every student who wanted the guide received a copy.
**Inference II:** At least 27 of the extra copies had been borrowed by Friday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The register recorded 27 issued copies, and each entry required a student loan. That supports at least 27 loans; nothing reports whether the remaining demand was met. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q5 · SIF-CP008-RESOURCE_STATUS-ROAD-MATERIALS

**Difficulty:** HARD
**Context:** PUBLIC_ADMINISTRATION
**Synthesis family:** RESOURCE_STATUS
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The road unit received material for repairs on four village roads. Work began on the two roads where the surface had already been cleared. The other two roads still required drainage work. The store ledger records material issued to each work site separately.

**Inference I:** All four village roads had been fully repaired.
**Inference II:** Repair work had begun on the two roads whose surfaces had been cleared.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The passage separates delivery, work started, and drainage still pending. It therefore supports work beginning on the two cleared roads, but does not report completion of all four repairs. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q6 · SIF-CP008-RESOURCE_STATUS-EXAM-PAPERS

**Difficulty:** HARD
**Context:** EDUCATION
**Synthesis family:** RESOURCE_STATUS
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** The examination office printed papers for 18 rooms and sealed each room's packet separately. A count found two extra packets after the room packets were prepared. Those packets were placed in the reserve cabinet. The dispatch sheet lists only packets sent to rooms.

**Inference I:** Every printed packet was sent to an examination room.
**Inference II:** The two extra packets were not included in the dispatch sheet for room deliveries.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The room packets were sealed first, and the two later-counted extras went into the reserve cabinet. Since the dispatch sheet covers room deliveries only, those extras were not part of it; printing did not mean every packet was dispatched. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q7 · SIF-CP008-SURVEY_SCOPE-BUS-QUEUE-SURVEY

**Difficulty:** MEDIUM
**Context:** SURVEY
**Synthesis family:** SURVEY_SCOPE
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A survey was conducted among customers who visited three branches during one week. Of those who responded, 64% preferred a separate queue for pension services. The report describes the responses from those branches only.

**Inference I:** A majority of the survey respondents preferred a separate pension-services queue.
**Inference II:** Most bank customers across the country prefer separate pension queues.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The 64% figure is a majority of the people who responded. The report is limited to visitors at three branches in one week, so it cannot establish the preference of bank customers nationwide. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q8 · SIF-CP008-SURVEY_SCOPE-COLLEGE-LECTURES

**Difficulty:** MEDIUM
**Context:** EDUCATION
**Synthesis family:** SURVEY_SCOPE
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** A college asked students in its evening courses how they used recorded lectures. Most respondents said they replayed a lecture before an examination. The questionnaire was not sent to day-course students.

**Inference I:** Most respondents from the evening courses said they replayed recorded lectures before an examination.
**Inference II:** Most students at the college replay recorded lectures before examinations.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The reported majority is from respondents in evening courses. Day-course students were not surveyed, so the result cannot be extended to all students at the college. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q9 · SIF-CP008-SURVEY_SCOPE-BUS-ROUTE-FEEDBACK

**Difficulty:** HARD
**Context:** TRANSPORT
**Synthesis family:** SURVEY_SCOPE
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** The transport office asked passengers using two routes about the new timetable. Respondents on Route A reported shorter waits, while Route B respondents reported no clear change. The survey included only weekday passengers. Weekend services were not part of the review.

**Inference I:** The feedback did not show the same reported change on both surveyed routes.
**Inference II:** The new timetable reduced waiting time on every route, including weekends.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Route A respondents reported shorter waits, but Route B respondents did not report a clear change. The poll also excluded weekends, so it cannot support a claim covering every route and day. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q10 · SIF-CP008-SERVICE_COVERAGE-EVENING-LIBRARY

**Difficulty:** MEDIUM
**Context:** EDUCATION
**Synthesis family:** SERVICE_COVERAGE
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** Day-course students said they could not reach the library before its old closing time. The college extended opening hours on Monday and Wednesday. The notice lists no other late-opening days.

**Inference I:** The library now stays open late every weekday.
**Inference II:** The library stays open later on Mondays and Wednesdays than under its old schedule.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The notice changes the hours on Monday and Wednesday only. It does not extend the late schedule to the other weekdays. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q11 · SIF-CP008-SERVICE_COVERAGE-RURAL-HEALTH-VISITS

**Difficulty:** HARD
**Context:** HEALTHCARE
**Synthesis family:** SERVICE_COVERAGE
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A health team reviewed requests from five villages for routine check-ups. It scheduled a monthly visit to the two villages with the highest number of requests. The first visit covered both selected villages. The remaining villages are still served at the district clinic.

**Inference I:** Residents of all five villages can now receive routine check-ups in their own village.
**Inference II:** The new monthly visit covers two villages, while residents of the other three still use the district clinic.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The first visit covered the two selected villages, but the passage says residents of the remaining villages still use the district clinic. Together, these facts show that the new visiting service has not replaced the clinic for all five villages. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q12 · SIF-CP008-SERVICE_COVERAGE-BUS-ACCESS-ROUTES

**Difficulty:** HARD
**Context:** TRANSPORT
**Synthesis family:** SERVICE_COVERAGE
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The operator added a low-floor bus to Route 6 after passengers reported difficulty boarding the older buses. The low-floor bus runs on two morning trips and one evening trip. Other departures on Route 6 still use the regular fleet. The operator has not announced changes to other routes.

**Inference I:** Every departure on every route now uses a low-floor bus.
**Inference II:** The low-floor bus is used for three listed trips on Route 6.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The schedule names three Route 6 trips for the low-floor bus. Other trips still use regular buses, and the operator has announced no other route changes; the claim about all departures goes beyond the information. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q13 · SIF-CP008-CAPACITY_RESULTS-COUNTER-REALLOCATION

**Difficulty:** MEDIUM
**Context:** BANKING
**Synthesis family:** CAPACITY_RESULTS
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** A branch moved one employee from the back-office team to the service desk during lunch hours. The back-office team continued to clear its daily file target. The change applied only to the lunch period.

**Inference I:** The back-office team met its daily file target even with one employee reassigned at lunch.
**Inference II:** The back-office team had more employees than it needed.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** One employee was reassigned only during lunch, and the team still met its file target. Those facts establish the result after the transfer, not that the team had excess staff beforehand. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q14 · SIF-CP008-CAPACITY_RESULTS-SCHOOL-HELP-DESK

**Difficulty:** MEDIUM
**Context:** EDUCATION
**Synthesis family:** CAPACITY_RESULTS
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Admission queries increased in the week before the deadline. The school assigned two staff members to answer calls in the morning. The admissions team continued to process submitted forms in the afternoon.

**Inference I:** The school handled phone queries in the morning while continuing form processing in the afternoon.
**Inference II:** Every admission query was answered before the deadline.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The passage gives the hours assigned to calls and says form processing continued later. It does not state that every call was answered or that no query remained. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q15 · SIF-CP008-CAPACITY_RESULTS-CALL-CENTRE-STAFFING

**Difficulty:** HARD
**Context:** WORKPLACE
**Synthesis family:** CAPACITY_RESULTS
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** A benefits helpline received more calls on the final two enrolment days than earlier in the month. The department added temporary call handlers for those days. The existing staff continued to handle written queries. The report records shorter average phone waits, but gives no result for written replies.

**Inference I:** Average waiting time for callers was shorter on the two final enrolment days.
**Inference II:** Every phone and written query was answered without delay.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The report specifically says the average phone wait was shorter. It gives no outcome for written queries and does not say every caller was answered immediately, so the broader claim is unsupported. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q16 · SIF-CP008-SCHEDULED_WORK-EXAM-HALL-ALLOCATION

**Difficulty:** MEDIUM
**Context:** EDUCATION
**Synthesis family:** SCHEDULED_WORK
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The examination centre prepared separate halls for candidates with approved access arrangements. The seating list placed those candidates on the ground floor. Other candidates were assigned rooms by subject group.

**Inference I:** All candidates at the centre were seated according to access arrangements.
**Inference II:** Candidates with approved access arrangements were seated in ground-floor halls.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The seating list connects approved arrangements with ground-floor placement. The passage says other candidates were assigned by subject group, so it does not describe all seating as access-based. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q17 · SIF-CP008-SCHEDULED_WORK-VACCINATION-CLINIC

**Difficulty:** HARD
**Context:** HEALTHCARE
**Synthesis family:** SCHEDULED_WORK
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** The clinic reserved Wednesday mornings for childhood vaccinations. Families were asked to register before arriving, and the nurse prepared doses from the confirmed list. Walk-in patients were directed to book another session. The notice does not state how many registered families attended.

**Inference I:** Every family on the list attended and every child received a dose on Wednesday.
**Inference II:** The clinic prepared vaccination doses based on the confirmed registration list.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The nurse prepared doses from confirmed registrations, but the notice gives no attendance count and says walk-ins had to book again. Preparation therefore does not establish that everyone attended or received a dose. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q18 · SIF-CP008-SCHEDULED_WORK-FREIGHT-SLOT

**Difficulty:** HARD
**Context:** BUSINESS
**Synthesis family:** SCHEDULED_WORK
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A depot allotted loading slots to carriers that submitted vehicle details by noon. The evening roster lists three carriers with confirmed slots. One other carrier submitted its details after the deadline. The depot said late submissions would be considered for the next day's roster.

**Inference I:** The late carrier was permanently barred from using the depot.
**Inference II:** The late carrier was not listed with a confirmed slot on the evening roster.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The evening roster names only the three confirmed carriers, while the late submission is being considered for the next day. It was not confirmed for that evening, but the passage does not impose a permanent ban. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q19 · SIF-CP008-DECISION_STATUS-BUS-ROUTE-REQUEST

**Difficulty:** MEDIUM
**Context:** TRANSPORT
**Synthesis family:** DECISION_STATUS
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Residents asked for an earlier bus on Route 12. The transport office added the request to its monthly review agenda. The published timetable remains unchanged for now.

**Inference I:** The earlier bus request has been placed for review, but the timetable has not yet changed.
**Inference II:** The transport office has approved and scheduled an earlier bus.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Adding a request to the review agenda shows that it will be considered. The unchanged timetable shows that no earlier service has been announced yet. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q20 · SIF-CP008-DECISION_STATUS-GRANT-EXTENSION

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Synthesis family:** DECISION_STATUS
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** A grant committee received requests to extend the reporting deadline. It asked applicants for updated progress notes before making a decision. The current deadline remains in force until a revised notice is issued.

**Inference I:** The committee had not yet changed the reporting deadline when it requested progress notes.
**Inference II:** Every applicant who sent a progress note received an extension.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The notes were requested before a decision, and the current deadline remains in force until a new notice. Sending information therefore did not itself grant an extension. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q21 · SIF-CP008-DECISION_STATUS-SCHOOL-CLUB-FUNDING

**Difficulty:** HARD
**Context:** EDUCATION
**Synthesis family:** DECISION_STATUS
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** The school received funding requests from four clubs. The committee asked each club to submit a revised budget and a list of planned activities. It approved the debate club's revised budget at its first meeting. The other requests remain on the agenda for the next meeting.

**Inference I:** The debate club's revised budget was approved, while the other three requests were still pending.
**Inference II:** All four clubs received the amount they requested.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The first meeting approved one revised budget. The other requests were deferred to the next meeting, so they had not yet been approved or paid at this stage. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q22 · SIF-CP008-COMPARATIVE_OUTCOMES-SERVICE-WAIT-COMPARISON

**Difficulty:** MEDIUM
**Context:** BANKING
**Synthesis family:** COMPARATIVE_OUTCOMES
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** A branch compared customer waits before and after opening a second service desk. Average waits fell in the afternoon, while morning waits changed very little. The report covers one branch for one month.

**Inference I:** Opening the second desk reduced waits at every branch and at every time.
**Inference II:** The reported wait-time change differed between the afternoon and morning periods.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Afternoon averages fell but morning averages changed little. The report covers only one branch, so it neither shows a uniform change across periods nor a result for every branch. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q23 · SIF-CP008-COMPARATIVE_OUTCOMES-TRAINING-OUTPUT

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Synthesis family:** COMPARATIVE_OUTCOMES
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A factory team tested a revised shift handover at one production line. Fewer items were waiting for inspection at the end of that shift. Output on the other lines was not measured in the trial.

**Inference I:** The revised handover increased total factory output on every line.
**Inference II:** At that production line, fewer items were awaiting inspection at the end of the tested shift.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The trial records a smaller inspection queue on one line. Since other lines were not measured and total output was not reported, the wider production claim is unsupported. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q24 · SIF-CP008-COMPARATIVE_OUTCOMES-READING-PROGRAMME

**Difficulty:** HARD
**Context:** EDUCATION
**Synthesis family:** COMPARATIVE_OUTCOMES
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** A school introduced a reading period in four classes. Teachers recorded how many students borrowed a book during the first month. Borrowing rose in three classes and stayed at the earlier level in the fourth. The school has not compared reading scores yet.

**Inference I:** Reading scores improved in every class because of the reading period.
**Inference II:** Book borrowing rose in three of the four classes during the first month.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The records show increased borrowing in three classes and no increase in the fourth. Scores were not compared, so neither universal improvement nor its cause has been established. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

# Multilingual parity spot-check

## SIF-CP008-PROCESS_RECORDS-PERMIT-FILES · en-IN

**Statement:** The permit office stamped every form when it arrived. A clerk later checked each file for proof of residence and an income certificate. The weekly review list includes only files containing both documents.

**Inference I:** Every file on the weekly review list contained proof of residence and an income certificate.
**Inference II:** Every form stamped on arrival was complete.

**Answer state:** ONLY_I

**Explanation:** The receipt stamp was given before document checking, but the review list was made only after both required papers were found. Thus, the listed files had both papers; the stamp alone did not show that every received form was complete. Therefore, only Inference I follows.

---

## SIF-CP008-PROCESS_RECORDS-PERMIT-FILES · hi-IN

**Statement:** परमिट कार्यालय ने हर फॉर्म मिलने पर उसकी प्राप्ति दर्ज की। बाद में एक कर्मचारी ने हर फाइल में निवास प्रमाण और आय प्रमाणपत्र जाँचा। साप्ताहिक समीक्षा-सूची में केवल वे फाइलें हैं जिनमें दोनों दस्तावेज़ मौजूद हैं।

**Inference I:** साप्ताहिक समीक्षा-सूची की हर फाइल में निवास प्रमाण और आय प्रमाणपत्र था।
**Inference II:** प्राप्ति दर्ज किए गए हर फॉर्म में सभी दस्तावेज़ पूरे थे।

**Answer state:** ONLY_I

**Explanation:** प्राप्ति की मुहर दस्तावेज़ जाँचने से पहले लगती थी, जबकि समीक्षा-सूची दोनों ज़रूरी कागज़ मिलने के बाद बनी। इसलिए सूची वाली फाइलों में दोनों कागज़ थे; केवल मुहर से हर प्राप्त फॉर्म के पूरा होने का पता नहीं चलता। इसलिए केवल अनुमान I सही है।

---

## SIF-CP008-PROCESS_RECORDS-PERMIT-FILES · pa-IN

**Statement:** ਪਰਮਿਟ ਦਫ਼ਤਰ ਨੇ ਹਰ ਫਾਰਮ ਮਿਲਣ 'ਤੇ ਉਸ ਦੀ ਪ੍ਰਾਪਤੀ ਦਰਜ ਕੀਤੀ। ਬਾਅਦ ਵਿੱਚ ਇੱਕ ਕਰਮਚਾਰੀ ਨੇ ਹਰ ਫਾਈਲ ਵਿੱਚ ਰਿਹਾਇਸ਼ ਦਾ ਸਬੂਤ ਅਤੇ ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ ਜਾਂਚਿਆ। ਹਫ਼ਤਾਵਾਰੀ ਸਮੀਖਿਆ-ਸੂਚੀ ਵਿੱਚ ਸਿਰਫ਼ ਉਹ ਫਾਈਲਾਂ ਹਨ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਦੋਵੇਂ ਦਸਤਾਵੇਜ਼ ਮੌਜੂਦ ਹਨ।

**Inference I:** ਹਫ਼ਤਾਵਾਰੀ ਸਮੀਖਿਆ-ਸੂਚੀ ਦੀ ਹਰ ਫਾਈਲ ਵਿੱਚ ਰਿਹਾਇਸ਼ ਦਾ ਸਬੂਤ ਅਤੇ ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ ਸੀ।
**Inference II:** ਪ੍ਰਾਪਤੀ ਦਰਜ ਹੋਏ ਹਰ ਫਾਰਮ ਵਿੱਚ ਸਾਰੇ ਦਸਤਾਵੇਜ਼ ਪੂਰੇ ਸਨ।

**Answer state:** ONLY_I

**Explanation:** ਪ੍ਰਾਪਤੀ ਦੀ ਮੋਹਰ ਦਸਤਾਵੇਜ਼ ਜਾਂਚਣ ਤੋਂ ਪਹਿਲਾਂ ਲੱਗਦੀ ਸੀ, ਜਦਕਿ ਸਮੀਖਿਆ-ਸੂਚੀ ਦੋਵੇਂ ਲੋੜੀਂਦੇ ਕਾਗਜ਼ ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਬਣੀ। ਇਸ ਲਈ ਸੂਚੀ ਵਾਲੀਆਂ ਫਾਈਲਾਂ ਵਿੱਚ ਦੋਵੇਂ ਕਾਗਜ਼ ਸਨ; ਸਿਰਫ਼ ਮੋਹਰ ਨਾਲ ਹਰ ਮਿਲੇ ਫਾਰਮ ਦੇ ਪੂਰੇ ਹੋਣ ਦਾ ਪਤਾ ਨਹੀਂ ਲੱਗਦਾ। ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ I ਸਹੀ ਹੈ।

---

## SIF-CP008-PROCESS_RECORDS-SCHOLARSHIP-SHORTLIST · en-IN

**Statement:** The college received scholarship applications from students in several courses. The panel checked each file for a marksheet and a fee receipt. Only files with both records were placed on the shortlist.

**Inference I:** Each shortlisted application had both a marksheet and a fee receipt.
**Inference II:** Every applicant whose form was received was awarded a scholarship.

**Answer state:** ONLY_I

**Explanation:** The shortlist rule required both records, so every file on that list had them. Receiving an application did not itself mean that it was shortlisted or funded. Therefore, only Inference I follows.

---

## SIF-CP008-PROCESS_RECORDS-SCHOLARSHIP-SHORTLIST · hi-IN

**Statement:** कॉलेज को कई पाठ्यक्रमों के विद्यार्थियों से छात्रवृत्ति आवेदन मिले। समिति ने हर फाइल में अंकपत्र और शुल्क-रसीद जाँची। केवल दोनों रिकॉर्ड वाली फाइलें संक्षिप्त सूची में रखी गईं।

**Inference I:** संक्षिप्त सूची के हर आवेदन में अंकपत्र और शुल्क-रसीद दोनों थे।
**Inference II:** जिसका भी फॉर्म मिला, उस हर विद्यार्थी को छात्रवृत्ति मिल गई।

**Answer state:** ONLY_I

**Explanation:** संक्षिप्त सूची के नियम में दोनों रिकॉर्ड ज़रूरी थे, इसलिए सूची की हर फाइल में वे मौजूद थे। आवेदन मिलना अपने-आप सूची में आने या छात्रवृत्ति मिलने का प्रमाण नहीं है। इसलिए केवल अनुमान I सही है।

---

## SIF-CP008-PROCESS_RECORDS-SCHOLARSHIP-SHORTLIST · pa-IN

**Statement:** ਕਾਲਜ ਨੂੰ ਕਈ ਕੋਰਸਾਂ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਤੋਂ ਵਜ਼ੀਫ਼ੇ ਦੀਆਂ ਅਰਜ਼ੀਆਂ ਮਿਲੀਆਂ। ਕਮੇਟੀ ਨੇ ਹਰ ਫਾਈਲ ਵਿੱਚ ਅੰਕ-ਪੱਤਰ ਅਤੇ ਫੀਸ ਦੀ ਰਸੀਦ ਜਾਂਚੀ। ਸਿਰਫ਼ ਦੋਵੇਂ ਰਿਕਾਰਡ ਵਾਲੀਆਂ ਫਾਈਲਾਂ ਸੰਖੇਪ ਸੂਚੀ ਵਿੱਚ ਰੱਖੀਆਂ ਗਈਆਂ।

**Inference I:** ਸੰਖੇਪ ਸੂਚੀ ਦੀ ਹਰ ਅਰਜ਼ੀ ਵਿੱਚ ਅੰਕ-ਪੱਤਰ ਅਤੇ ਫੀਸ ਦੀ ਰਸੀਦ ਦੋਵੇਂ ਸਨ।
**Inference II:** ਜਿਸ ਵਿਦਿਆਰਥੀ ਦਾ ਵੀ ਫਾਰਮ ਮਿਲਿਆ, ਉਸ ਹਰ ਵਿਦਿਆਰਥੀ ਨੂੰ ਵਜ਼ੀਫ਼ਾ ਮਿਲ ਗਿਆ।

**Answer state:** ONLY_I

**Explanation:** ਸੰਖੇਪ ਸੂਚੀ ਦੇ ਨਿਯਮ ਵਿੱਚ ਦੋਵੇਂ ਰਿਕਾਰਡ ਲਾਜ਼ਮੀ ਸਨ, ਇਸ ਲਈ ਸੂਚੀ ਦੀ ਹਰ ਫਾਈਲ ਵਿੱਚ ਉਹ ਮੌਜੂਦ ਸਨ। ਅਰਜ਼ੀ ਮਿਲਣਾ ਆਪਣੇ ਆਪ ਸੂਚੀ ਵਿੱਚ ਆਉਣ ਜਾਂ ਵਜ਼ੀਫ਼ਾ ਮਿਲਣ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ I ਸਹੀ ਹੈ।

---

## SIF-CP008-RESOURCE_STATUS-CLINIC-KITS · en-IN

**Statement:** A clinic received 60 screening kits for a two-week drive. Nurses entered each kit in a daily use log after using it. At the end of the first week, 38 kits were recorded as used.

**Inference I:** All 60 kits had been used during the first week.
**Inference II:** The clinic had used 38 screening kits by the end of the first week.

**Answer state:** ONLY_II

**Explanation:** The log was filled only after use and listed 38 kits, so 38 had been used by that point. The delivery total was 60, which does not mean all 60 were used in the first week. Therefore, only Inference II follows.

---

## SIF-CP008-RESOURCE_STATUS-CLINIC-KITS · hi-IN

**Statement:** दो सप्ताह की जाँच मुहिम के लिए क्लिनिक को 60 किटें मिलीं। नर्स हर किट इस्तेमाल करने के बाद दैनिक रजिस्टर में दर्ज करती थीं। पहले सप्ताह के अंत तक 38 किटें इस्तेमाल हुई दर्ज थीं।

**Inference I:** पहले सप्ताह में सभी 60 किट इस्तेमाल हो चुकी थीं।
**Inference II:** पहले सप्ताह के अंत तक क्लिनिक ने 38 जाँच किट इस्तेमाल की थीं।

**Answer state:** ONLY_II

**Explanation:** उपयोग के बाद ही रजिस्टर में प्रविष्टि होती थी और उसमें 38 किट थीं, इसलिए तब तक 38 इस्तेमाल हुई थीं। कुल 60 किट मिली थीं, इसका अर्थ यह नहीं कि पहले सप्ताह में सभी इस्तेमाल हो गईं। इसलिए केवल अनुमान II सही है।

---

## SIF-CP008-RESOURCE_STATUS-CLINIC-KITS · pa-IN

**Statement:** ਦੋ ਹਫ਼ਤਿਆਂ ਦੀ ਜਾਂਚ ਮੁਹਿੰਮ ਲਈ ਕਲੀਨਿਕ ਨੂੰ 60 ਕਿੱਟਾਂ ਮਿਲੀਆਂ। ਨਰਸਾਂ ਹਰ ਕਿੱਟ ਵਰਤਣ ਤੋਂ ਬਾਅਦ ਰੋਜ਼ਾਨਾ ਵਰਤੋਂ-ਰਜਿਸਟਰ ਵਿੱਚ ਦਰਜ ਕਰਦੀਆਂ ਸਨ। ਪਹਿਲੇ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਤੱਕ 38 ਕਿੱਟਾਂ ਵਰਤੀਆਂ ਦਰਜ ਸਨ।

**Inference I:** ਪਹਿਲੇ ਹਫ਼ਤੇ ਵਿੱਚ ਸਾਰੀਆਂ 60 ਕਿੱਟਾਂ ਵਰਤੀਆਂ ਜਾ ਚੁੱਕੀਆਂ ਸਨ।
**Inference II:** ਪਹਿਲੇ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਤੱਕ ਕਲੀਨਿਕ ਨੇ 38 ਜਾਂਚ ਕਿੱਟਾਂ ਵਰਤੀਆਂ ਸਨ।

**Answer state:** ONLY_II

**Explanation:** ਵਰਤੋਂ ਤੋਂ ਬਾਅਦ ਹੀ ਰਜਿਸਟਰ ਵਿੱਚ ਦਰਜ ਹੁੰਦਾ ਸੀ ਅਤੇ ਉਸ ਵਿੱਚ 38 ਕਿੱਟਾਂ ਸਨ, ਇਸ ਲਈ ਉਸ ਵੇਲੇ ਤੱਕ 38 ਵਰਤੀਆਂ ਗਈਆਂ ਸਨ। ਕੁੱਲ 60 ਕਿੱਟਾਂ ਮਿਲੀਆਂ ਸਨ, ਇਸ ਦਾ ਮਤਲਬ ਨਹੀਂ ਕਿ ਪਹਿਲੇ ਹਫ਼ਤੇ ਵਿੱਚ ਸਾਰੀਆਂ ਵਰਤੀਆਂ ਗਈਆਂ। ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ II ਸਹੀ ਹੈ।

---

## SIF-CP008-SURVEY_SCOPE-BUS-ROUTE-FEEDBACK · en-IN

**Statement:** The transport office asked passengers using two routes about the new timetable. Respondents on Route A reported shorter waits, while Route B respondents reported no clear change. The survey included only weekday passengers. Weekend services were not part of the review.

**Inference I:** The feedback did not show the same reported change on both surveyed routes.
**Inference II:** The new timetable reduced waiting time on every route, including weekends.

**Answer state:** ONLY_I

**Explanation:** Route A respondents reported shorter waits, but Route B respondents did not report a clear change. The poll also excluded weekends, so it cannot support a claim covering every route and day. Therefore, only Inference I follows.

---

## SIF-CP008-SURVEY_SCOPE-BUS-ROUTE-FEEDBACK · hi-IN

**Statement:** आवाजाही कार्यालय ने दो मार्गों के यात्रियों से नई समय-सारणी के बारे में पूछा। मार्ग A के यात्रियों ने कम प्रतीक्षा बताई, जबकि मार्ग B के यात्रियों ने कोई स्पष्ट बदलाव नहीं बताया। सर्वेक्षण में केवल कार्यदिवस के यात्री शामिल थे। सप्ताहांत की सेवाओं की समीक्षा नहीं हुई।

**Inference I:** जवाबों में दोनों सर्वेक्षित मार्गों पर एक जैसी बदलाव की सूचना नहीं मिली।
**Inference II:** नई समय-सारणी ने सप्ताहांत सहित हर मार्ग पर प्रतीक्षा कम कर दी।

**Answer state:** ONLY_I

**Explanation:** रूट A के जवाब देने वालों ने कम प्रतीक्षा बताई, लेकिन रूट B वालों ने स्पष्ट बदलाव नहीं बताया। सर्वेक्षण में सप्ताहांत भी शामिल नहीं था, इसलिए हर मार्ग और दिन का दावा नहीं किया जा सकता। इसलिए केवल अनुमान I सही है।

---

## SIF-CP008-SURVEY_SCOPE-BUS-ROUTE-FEEDBACK · pa-IN

**Statement:** ਆਵਾਜਾਈ ਦਫ਼ਤਰ ਨੇ ਦੋ ਰੂਟਾਂ ਦੇ ਯਾਤਰੀਆਂ ਤੋਂ ਨਵੀਂ ਸਮਾਂ-ਸਾਰਣੀ ਬਾਰੇ ਪੁੱਛਿਆ। ਰੂਟ A ਦੇ ਜਵਾਬ ਦੇਣ ਵਾਲਿਆਂ ਨੇ ਘੱਟ ਉਡੀਕ ਦੱਸੀ, ਜਦਕਿ ਰੂਟ B ਵਾਲਿਆਂ ਨੇ ਕੋਈ ਸਾਫ਼ ਤਬਦੀਲੀ ਨਹੀਂ ਦੱਸੀ। ਸਰਵੇਖਣ ਵਿੱਚ ਸਿਰਫ਼ ਹਫ਼ਤੇ ਦੇ ਦਿਨਾਂ ਦੇ ਯਾਤਰੀ ਸ਼ਾਮਲ ਸਨ। ਹਫ਼ਤੇ-ਅੰਤ ਦੀਆਂ ਸੇਵਾਵਾਂ ਸਮੀਖਿਆ ਵਿੱਚ ਨਹੀਂ ਸਨ।

**Inference I:** ਜਵਾਬਾਂ ਵਿੱਚ ਦੋਵੇਂ ਸਰਵੇਖਣ ਕੀਤੇ ਰੂਟਾਂ 'ਤੇ ਇੱਕੋ ਜਿਹੀ ਤਬਦੀਲੀ ਨਹੀਂ ਦੱਸੀ ਗਈ।
**Inference II:** ਨਵੀਂ ਸਮਾਂ-ਸਾਰਣੀ ਨੇ ਹਫ਼ਤੇ-ਅੰਤ ਸਮੇਤ ਹਰ ਰੂਟ 'ਤੇ ਉਡੀਕ ਘਟਾ ਦਿੱਤੀ।

**Answer state:** ONLY_I

**Explanation:** ਰੂਟ A ਦੇ ਜਵਾਬ ਦੇਣ ਵਾਲਿਆਂ ਨੇ ਘੱਟ ਉਡੀਕ ਦੱਸੀ, ਪਰ ਰੂਟ B ਵਾਲਿਆਂ ਨੇ ਸਾਫ਼ ਤਬਦੀਲੀ ਨਹੀਂ ਦੱਸੀ। ਸਰਵੇਖਣ ਵਿੱਚ ਹਫ਼ਤੇ-ਅੰਤ ਵੀ ਸ਼ਾਮਲ ਨਹੀਂ ਸੀ, ਇਸ ਲਈ ਹਰ ਰੂਟ ਅਤੇ ਦਿਨ ਬਾਰੇ ਦਾਅਵਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ। ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ I ਸਹੀ ਹੈ।

---
