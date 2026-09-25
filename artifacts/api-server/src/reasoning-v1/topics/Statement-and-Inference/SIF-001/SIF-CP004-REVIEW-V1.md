# SIF-CP004 — Comparison and Relationship Inference — Review V1

**Status:** Human review candidate; not frozen
**Chapter:** SIF-001 — Statement & Inference
**Runtime:** Structured comparison fact → supported/unsupported inference → answer → language
**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked

## Review focus

- more/less, higher/lower, order, age, change, size, frequency and explicitly measured quality;
- no invented difference size, converse ranking, cause, absolute age or unreported measure;
- temporal order stays separate from cause and effect;
- natural exam-grade situations with clear comparison scope;
- Easy/Medium separation, clear explanations and English/Hindi/Punjabi answer parity.

**Authority pool:** 48 distinct comparison scenarios
**Review coverage:** 24 distinct scenarios shown; no repeats
**Difficulty balance:** 10 Easy / 14 Medium
**Answer positions:** I 12 / II 12
**Automated gates:** PASS

## Comparison-family coverage

| Family | Authorities | Review questions |
|---|---:|---:|
| MORE_LESS | 6 | 3 |
| RANKING | 6 | 3 |
| TIME_ORDER | 6 | 3 |
| AGE | 6 | 3 |
| CHANGE | 6 | 3 |
| SIZE | 6 | 3 |
| MEASURED_QUALITY | 6 | 3 |
| FREQUENCY | 6 | 3 |

## Context coverage

| Context domain | Authorities |
|---|---:|
| BANKING | 5 |
| BUSINESS | 8 |
| EDUCATION | 7 |
| EVERYDAY | 7 |
| HEALTHCARE | 3 |
| PUBLIC_ADMINISTRATION | 5 |
| TRANSPORT | 6 |
| WORKPLACE | 7 |

## Q1 · SIF-CP004-MORE_LESS-BRANCH-APPLICATIONS

**Difficulty:** EASY
**Context:** BANKING
**Comparison family:** MORE_LESS
**Controlled trap:** UNSTATED_MAGNITUDE
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** The central branch processed more loan applications on Monday than the market branch did.

**Inference I:** The market branch did not process more loan applications than the central branch on Monday.
**Inference II:** The central branch processed at least twice as many applications as the market branch.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The statement establishes which branch processed more applications, but gives no counts. It supports I; the claimed two-to-one ratio is not stated.

**Validation:** 10/10 gates passed

---

## Q2 · SIF-CP004-MORE_LESS-BOOK-ISSUES

**Difficulty:** EASY
**Context:** EDUCATION
**Comparison family:** MORE_LESS
**Controlled trap:** UNSTATED_MAGNITUDE
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The science library issued fewer reference books in April than it issued in March.

**Inference I:** More reference books were issued in March than in April.
**Inference II:** The library issued exactly 20 fewer books in April.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Fewer in April means more were issued in March. The statement gives no numerical difference, so the figure of 20 cannot be inferred.

**Validation:** 10/10 gates passed

---

## Q3 · SIF-CP004-MORE_LESS-DELIVERY-VOLUME

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Comparison family:** MORE_LESS
**Controlled trap:** UNSTATED_MAGNITUDE
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Supplier A delivered more sealed cartons to the warehouse than Supplier B during the first quarter.

**Inference I:** Supplier B delivered fewer sealed cartons than Supplier A in the first quarter.
**Inference II:** Supplier A delivered more cartons in every month of the quarter.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The total for the quarter is higher for A. The statement does not compare each individual month, so II goes beyond the evidence.

**Validation:** 10/10 gates passed

---

## Q4 · SIF-CP004-RANKING-EXAM-RANK

**Difficulty:** EASY
**Context:** EDUCATION
**Comparison family:** RANKING
**Controlled trap:** METRIC_SWITCH
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Among the five candidates, Nisha ranked above Farah in the final examination.

**Inference I:** Nisha scored at least 10 marks more than Farah.
**Inference II:** Farah did not rank above Nisha in the final examination.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** A better rank places Nisha above Farah in the result order. It does not reveal the marks gap.

**Validation:** 10/10 gates passed

---

## Q5 · SIF-CP004-RANKING-INTERVIEW-PANEL

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Comparison family:** RANKING
**Controlled trap:** METRIC_SWITCH
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The selection panel placed Dev above Mohan on the shortlist, although Mohan had more years of service.

**Inference I:** The panel considered years of service irrelevant to the decision.
**Inference II:** Mohan was not placed above Dev on the shortlist.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The shortlist order is explicit. The reason for that order is not stated, so no conclusion about the panel's reasoning follows.

**Validation:** 10/10 gates passed

---

## Q6 · SIF-CP004-RANKING-TOURNAMENT-TABLE

**Difficulty:** MEDIUM
**Context:** EVERYDAY
**Comparison family:** RANKING
**Controlled trap:** METRIC_SWITCH
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Team North finished ahead of Team South in the league table, but the two teams had the same number of wins.

**Inference I:** Team North won more matches than Team South.
**Inference II:** Team South did not finish above Team North in the league table.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The table position supports II. Since the wins were equal, the higher position came from another factor; it cannot mean more wins.

**Validation:** 10/10 gates passed

---

## Q7 · SIF-CP004-TIME_ORDER-TRAIN-DEPARTURE

**Difficulty:** EASY
**Context:** TRANSPORT
**Comparison family:** TIME_ORDER
**Controlled trap:** ORDER_TO_CAUSE
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Train 18 departed before Train 24 from the same platform.

**Inference I:** Train 24 did not depart before Train 18.
**Inference II:** Train 18's earlier departure caused Train 24 to be delayed.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The order of departure is clear. The statement gives no reason for any delay, so it cannot support a cause-and-effect claim.

**Validation:** 10/10 gates passed

---

## Q8 · SIF-CP004-TIME_ORDER-SHIFT-START

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Comparison family:** TIME_ORDER
**Controlled trap:** ORDER_TO_CAUSE
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** The packing shift began after the equipment inspection had ended.

**Inference I:** The inspection had ended before the packing shift began.
**Inference II:** The inspection delayed the start of the packing shift.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The sequence is stated, but no scheduled start time or delay is given. The inspection's ending before the shift does not establish that it caused a delay.

**Validation:** 10/10 gates passed

---

## Q9 · SIF-CP004-TIME_ORDER-MEDICINE-LOG

**Difficulty:** MEDIUM
**Context:** HEALTHCARE
**Comparison family:** TIME_ORDER
**Controlled trap:** ORDER_TO_CAUSE
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The nurse recorded the first dose before recording the second dose in the patient's chart.

**Inference I:** The first dose was entered in the chart earlier than the second dose.
**Inference II:** The patient received the first dose before receiving the second dose.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Only the recording order is stated. A record can be entered after an event, so the actual order of doses cannot be inferred from this statement alone.

**Validation:** 10/10 gates passed

---

## Q10 · SIF-CP004-AGE-SIBLINGS

**Difficulty:** EASY
**Context:** EVERYDAY
**Comparison family:** AGE
**Controlled trap:** RELATIVE_TO_ABSOLUTE
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** Arun is older than Karan.

**Inference I:** Arun is at least five years older than Karan.
**Inference II:** Karan is younger than Arun.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The statement gives their relative ages, so Karan is younger. It does not state how many years separate them.

**Validation:** 10/10 gates passed

---

## Q11 · SIF-CP004-AGE-JOINING-AGE

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Comparison family:** AGE
**Controlled trap:** RELATIVE_TO_ABSOLUTE
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Leela joined the department at a younger age than Farida did.

**Inference I:** Leela is younger than Farida now.
**Inference II:** Farida was older than Leela when each joined the department.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Their ages at the time of joining are compared. Different joining dates mean the statement does not establish their ages today.

**Validation:** 10/10 gates passed

---

## Q12 · SIF-CP004-AGE-SERVICE-RETIREMENT

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Comparison family:** AGE
**Controlled trap:** RELATIVE_TO_ABSOLUTE
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** At retirement, Officer A was older than Officer B had been at B's retirement.

**Inference I:** Officer A served for more years than Officer B.
**Inference II:** Officer B retired at a younger age than Officer A did.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The retirement ages are compared, which supports II. Their service lengths depend on when they began work, and those dates are not given.

**Validation:** 10/10 gates passed

---

## Q13 · SIF-CP004-CHANGE-RESPONSE-TIME

**Difficulty:** EASY
**Context:** HEALTHCARE
**Comparison family:** CHANGE
**Controlled trap:** CHANGE_TO_CAUSE
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** The clinic reduced its average registration time from 12 minutes in May to 9 minutes in June.

**Inference I:** Average registration time was lower in June than in May.
**Inference II:** The new token system caused the reduction.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The recorded average fell from 12 to 9 minutes. That establishes the change, but the statement does not identify its cause.

**Validation:** 10/10 gates passed

---

## Q14 · SIF-CP004-CHANGE-WASTE-REDUCTION

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Comparison family:** CHANGE
**Controlled trap:** CHANGE_TO_CAUSE
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** The plant's packaging waste was lower in July than in June, while production volume stayed the same.

**Inference I:** The plant generated less packaging waste in July than in June.
**Inference II:** The plant introduced recyclable packaging in July.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The amount of waste decreased while production was unchanged. The statement gives no information about what process or material change, if any, caused it.

**Validation:** 10/10 gates passed

---

## Q15 · SIF-CP004-CHANGE-FUEL-CONSUMPTION

**Difficulty:** MEDIUM
**Context:** TRANSPORT
**Comparison family:** CHANGE
**Controlled trap:** CHANGE_TO_CAUSE
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A bus used less fuel per 100 kilometres after its engine was serviced than before the service.

**Inference I:** Fuel use per 100 kilometres was lower after the service.
**Inference II:** The service alone caused the improvement in fuel use.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The before-and-after comparison supports the lower fuel-use figure. It does not rule out other changes, so it cannot prove the service was the sole cause.

**Validation:** 10/10 gates passed

---

## Q16 · SIF-CP004-SIZE-PACKAGE-WEIGHT

**Difficulty:** EASY
**Context:** BUSINESS
**Comparison family:** SIZE
**Controlled trap:** ONE_DIMENSION_TO_TOTAL
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Parcel A weighs less than Parcel B.

**Inference I:** Parcel A is smaller in volume than Parcel B.
**Inference II:** Parcel B is heavier than Parcel A.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The statement compares weight only. A lighter parcel can still be larger in volume, so the size claim does not follow.

**Validation:** 10/10 gates passed

---

## Q17 · SIF-CP004-SIZE-TANK-CAPACITY

**Difficulty:** MEDIUM
**Context:** EVERYDAY
**Comparison family:** SIZE
**Controlled trap:** ONE_DIMENSION_TO_TOTAL
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** Tank X has a greater storage capacity than Tank Y, although Tank Y is taller.

**Inference I:** Tank X is taller than Tank Y.
**Inference II:** Tank Y has less storage capacity than Tank X.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Capacity is stated to be greater for X, so II follows. The statement explicitly says Y is taller, showing that capacity and height are different measures.

**Validation:** 10/10 gates passed

---

## Q18 · SIF-CP004-SIZE-CABLE-LENGTH

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Comparison family:** SIZE
**Controlled trap:** ONE_DIMENSION_TO_TOTAL
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Cable A is shorter than Cable B, but A is thicker.

**Inference I:** Cable B contains more material overall.
**Inference II:** Cable B is longer than Cable A.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The lengths establish II. Total material depends on both length and thickness; the statement does not provide enough information to compare it.

**Validation:** 10/10 gates passed

---

## Q19 · SIF-CP004-MEASURED_QUALITY-READING-SPEED

**Difficulty:** EASY
**Context:** EDUCATION
**Comparison family:** MEASURED_QUALITY
**Controlled trap:** MEASURE_TO_GENERAL_QUALITY
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** In the reading test, Asha read more words per minute than Nitin.

**Inference I:** Nitin's reading speed was lower than Asha's in that test.
**Inference II:** Asha understood the passage better than Nitin.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The test compares reading speed. It gives no result about comprehension, so the broader claim about understanding is not established.

**Validation:** 10/10 gates passed

---

## Q20 · SIF-CP004-MEASURED_QUALITY-CALL-RESOLUTION

**Difficulty:** MEDIUM
**Context:** BANKING
**Comparison family:** MEASURED_QUALITY
**Controlled trap:** MEASURE_TO_GENERAL_QUALITY
**Answer state:** ONLY_I

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The help centre resolved more calls within five minutes in the morning than in the evening.

**Inference I:** More calls met the five-minute resolution mark in the morning than in the evening.
**Inference II:** The morning team provided better service overall.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The comparison covers one measure: calls resolved within five minutes. It does not compare accuracy, customer satisfaction or overall service quality.

**Validation:** 10/10 gates passed

---

## Q21 · SIF-CP004-MEASURED_QUALITY-PRODUCT-DEFECTS

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Comparison family:** MEASURED_QUALITY
**Controlled trap:** MEASURE_TO_GENERAL_QUALITY
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Batch A had fewer units fail the leakage test than Batch B.

**Inference I:** Fewer units in Batch A failed the leakage test than in Batch B.
**Inference II:** Batch A had a lower overall defect rate.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The number failing this test was lower. Overall defect rates also depend on batch size and other tests, neither of which is given.

**Validation:** 10/10 gates passed

---

## Q22 · SIF-CP004-FREQUENCY-BUS-ON-TIME

**Difficulty:** EASY
**Context:** TRANSPORT
**Comparison family:** FREQUENCY
**Controlled trap:** FREQUENCY_TO_ALWAYS
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Route 6 buses arrived on time more often than Route 8 buses during the survey week.

**Inference I:** Route 6 buses were always on time.
**Inference II:** Route 8 buses arrived on time less often than Route 6 buses during that week.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Route 6 was on time more often, but not necessarily on every trip. ‘More often’ does not mean ‘always’.

**Validation:** 10/10 gates passed

---

## Q23 · SIF-CP004-FREQUENCY-WEEKLY-ATTENDANCE

**Difficulty:** EASY
**Context:** WORKPLACE
**Comparison family:** FREQUENCY
**Controlled trap:** FREQUENCY_TO_ALWAYS
**Answer state:** ONLY_II

**Instruction:** Which inference is supported by the information given?

**Statement:** During the month, Kavita attended the morning briefing on more days than Jaspreet did.

**Inference I:** Kavita attended every morning briefing that month.
**Inference II:** Jaspreet attended the morning briefing on fewer days than Kavita did that month.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Kavita attended more days than Jaspreet, but the statement does not say she attended all days.

**Validation:** 10/10 gates passed

---

## Q24 · SIF-CP004-FREQUENCY-REPAIR-RETURNS

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Comparison family:** FREQUENCY
**Controlled trap:** FREQUENCY_TO_ALWAYS
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Machine A required fewer repair visits than Machine B over the last six months.

**Inference I:** Machine A never broke down.
**Inference II:** Machine B required more repair visits than Machine A over that period.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** A needed fewer visits, but it still may have needed some repairs. A lower frequency is not the same as none.

**Validation:** 10/10 gates passed

---

# Multilingual parity spot-check

## SIF-CP004-MORE_LESS-DELIVERY-VOLUME · en-IN

**Statement:** Supplier A delivered more sealed cartons to the warehouse than Supplier B during the first quarter.

**Inference I:** Supplier B delivered fewer sealed cartons than Supplier A in the first quarter.
**Inference II:** Supplier A delivered more cartons in every month of the quarter.

**Answer state:** ONLY_I

**Explanation:** The total for the quarter is higher for A. The statement does not compare each individual month, so II goes beyond the evidence.

---

## SIF-CP004-MORE_LESS-DELIVERY-VOLUME · hi-IN

**Statement:** पहली तिमाही में आपूर्तिकर्ता A ने आपूर्तिकर्ता B से अधिक सीलबंद कार्टन गोदाम में पहुंचाए।

**Inference I:** पहली तिमाही में आपूर्तिकर्ता B ने A से कम सीलबंद कार्टन पहुंचाए।
**Inference II:** आपूर्तिकर्ता A ने तिमाही के हर महीने अधिक कार्टन पहुंचाए।

**Answer state:** ONLY_I

**Explanation:** तिमाही का कुल A के लिए अधिक है। कथन हर महीने की अलग तुलना नहीं करता, इसलिए II दी गई जानकारी से आगे जाता है।

---

## SIF-CP004-MORE_LESS-DELIVERY-VOLUME · pa-IN

**Statement:** ਪਹਿਲੀ ਤਿਮਾਹੀ ਵਿੱਚ ਸਪਲਾਇਰ A ਨੇ ਸਪਲਾਇਰ B ਨਾਲੋਂ ਵੱਧ ਸੀਲਬੰਦ ਡੱਬੇ ਗੋਦਾਮ ਵਿੱਚ ਪਹੁੰਚਾਏ।

**Inference I:** ਪਹਿਲੀ ਤਿਮਾਹੀ ਵਿੱਚ ਸਪਲਾਇਰ B ਨੇ A ਨਾਲੋਂ ਘੱਟ ਸੀਲਬੰਦ ਡੱਬੇ ਪਹੁੰਚਾਏ।
**Inference II:** ਸਪਲਾਇਰ A ਨੇ ਤਿਮਾਹੀ ਦੇ ਹਰ ਮਹੀਨੇ ਵੱਧ ਡੱਬੇ ਪਹੁੰਚਾਏ।

**Answer state:** ONLY_I

**Explanation:** ਤਿਮਾਹੀ ਦਾ ਕੁੱਲ A ਲਈ ਵੱਧ ਹੈ। ਕਥਨ ਹਰ ਮਹੀਨੇ ਦੀ ਵੱਖਰੀ ਤੁਲਨਾ ਨਹੀਂ ਕਰਦਾ, ਇਸ ਲਈ II ਸਬੂਤ ਤੋਂ ਅੱਗੇ ਜਾਂਦਾ ਹੈ।

---

## SIF-CP004-RANKING-INTERVIEW-PANEL · en-IN

**Statement:** The selection panel placed Dev above Mohan on the shortlist, although Mohan had more years of service.

**Inference I:** The panel considered years of service irrelevant to the decision.
**Inference II:** Mohan was not placed above Dev on the shortlist.

**Answer state:** ONLY_II

**Explanation:** The shortlist order is explicit. The reason for that order is not stated, so no conclusion about the panel's reasoning follows.

---

## SIF-CP004-RANKING-INTERVIEW-PANEL · hi-IN

**Statement:** चयन पैनल ने सूची में देव को मोहन से ऊपर रखा, हालांकि मोहन की सेवा अवधि अधिक थी।

**Inference I:** पैनल ने निर्णय में सेवा अवधि को अप्रासंगिक माना।
**Inference II:** चयन सूची में मोहन को देव से ऊपर नहीं रखा गया।

**Answer state:** ONLY_II

**Explanation:** सूची का क्रम स्पष्ट है। यह क्रम क्यों रखा गया, यह नहीं बताया गया; इसलिए पैनल की सोच पर निष्कर्ष नहीं निकलता।

---

## SIF-CP004-RANKING-INTERVIEW-PANEL · pa-IN

**Statement:** ਚੋਣ ਪੈਨਲ ਨੇ ਸੂਚੀ ਵਿੱਚ ਦੇਵ ਨੂੰ ਮੋਹਨ ਤੋਂ ਉੱਪਰ ਰੱਖਿਆ, ਭਾਵੇਂ ਮੋਹਨ ਦੀ ਸੇਵਾ ਮਿਆਦ ਵੱਧ ਸੀ।

**Inference I:** ਪੈਨਲ ਨੇ ਫ਼ੈਸਲੇ ਵਿੱਚ ਸੇਵਾ ਮਿਆਦ ਨੂੰ ਗ਼ੈਰ-ਸੰਬੰਧਿਤ ਮੰਨਿਆ।
**Inference II:** ਚੋਣ ਸੂਚੀ ਵਿੱਚ ਮੋਹਨ ਨੂੰ ਦੇਵ ਤੋਂ ਉੱਪਰ ਨਹੀਂ ਰੱਖਿਆ ਗਿਆ।

**Answer state:** ONLY_II

**Explanation:** ਸੂਚੀ ਦਾ ਕ੍ਰਮ ਸਪਸ਼ਟ ਹੈ। ਇਹ ਕ੍ਰਮ ਕਿਉਂ ਰੱਖਿਆ, ਇਹ ਨਹੀਂ ਦੱਸਿਆ; ਇਸ ਲਈ ਪੈਨਲ ਦੀ ਸੋਚ ਬਾਰੇ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ।

---

## SIF-CP004-TIME_ORDER-SHIFT-START · en-IN

**Statement:** The packing shift began after the equipment inspection had ended.

**Inference I:** The inspection had ended before the packing shift began.
**Inference II:** The inspection delayed the start of the packing shift.

**Answer state:** ONLY_I

**Explanation:** The sequence is stated, but no scheduled start time or delay is given. The inspection's ending before the shift does not establish that it caused a delay.

---

## SIF-CP004-TIME_ORDER-SHIFT-START · hi-IN

**Statement:** उपकरण निरीक्षण समाप्त होने के बाद पैकिंग पाली शुरू हुई।

**Inference I:** पैकिंग पाली शुरू होने से पहले निरीक्षण समाप्त हो चुका था।
**Inference II:** निरीक्षण के कारण पैकिंग पाली शुरू होने में देरी हुई।

**Answer state:** ONLY_I

**Explanation:** क्रम दिया है, पर निर्धारित समय या देरी नहीं बताई। पाली से पहले निरीक्षण समाप्त होना देरी का कारण सिद्ध नहीं करता।

---

## SIF-CP004-TIME_ORDER-SHIFT-START · pa-IN

**Statement:** ਸਾਜ਼ੋ-ਸਾਮਾਨ ਦੀ ਜਾਂਚ ਮੁੱਕਣ ਤੋਂ ਬਾਅਦ ਪੈਕਿੰਗ ਸ਼ਿਫਟ ਸ਼ੁਰੂ ਹੋਈ।

**Inference I:** ਪੈਕਿੰਗ ਸ਼ਿਫਟ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ ਮੁੱਕ ਚੁੱਕੀ ਸੀ।
**Inference II:** ਜਾਂਚ ਕਾਰਨ ਪੈਕਿੰਗ ਸ਼ਿਫਟ ਸ਼ੁਰੂ ਹੋਣ ਵਿੱਚ ਦੇਰੀ ਹੋਈ।

**Answer state:** ONLY_I

**Explanation:** ਕ੍ਰਮ ਦਿੱਤਾ ਹੈ, ਪਰ ਨਿਰਧਾਰਤ ਸਮਾਂ ਜਾਂ ਦੇਰੀ ਨਹੀਂ ਦੱਸੀ। ਸ਼ਿਫਟ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ ਮੁੱਕਣਾ ਦੇਰੀ ਦਾ ਕਾਰਨ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।

---

## SIF-CP004-FREQUENCY-REPAIR-RETURNS · en-IN

**Statement:** Machine A required fewer repair visits than Machine B over the last six months.

**Inference I:** Machine A never broke down.
**Inference II:** Machine B required more repair visits than Machine A over that period.

**Answer state:** ONLY_II

**Explanation:** A needed fewer visits, but it still may have needed some repairs. A lower frequency is not the same as none.

---

## SIF-CP004-FREQUENCY-REPAIR-RETURNS · hi-IN

**Statement:** पिछले छह महीनों में मशीन A को मशीन B से कम मरम्मत यात्राओं की जरूरत पड़ी।

**Inference I:** मशीन A कभी खराब नहीं हुई।
**Inference II:** उस अवधि में मशीन B को A से अधिक मरम्मत यात्राओं की जरूरत पड़ी।

**Answer state:** ONLY_II

**Explanation:** A को कम यात्राओं की जरूरत पड़ी, पर मरम्मत हुई हो सकती है। कम बार होना, कभी न होना नहीं है।

---

## SIF-CP004-FREQUENCY-REPAIR-RETURNS · pa-IN

**Statement:** ਪਿਛਲੇ ਛੇ ਮਹੀਨਿਆਂ ਵਿੱਚ ਮਸ਼ੀਨ A ਨੂੰ ਮਸ਼ੀਨ B ਨਾਲੋਂ ਘੱਟ ਮੁਰੰਮਤ ਦੌਰੇ ਚਾਹੀਦੇ ਸਨ।

**Inference I:** ਮਸ਼ੀਨ A ਕਦੇ ਖ਼ਰਾਬ ਨਹੀਂ ਹੋਈ।
**Inference II:** ਉਸ ਮਿਆਦ ਵਿੱਚ ਮਸ਼ੀਨ B ਨੂੰ A ਨਾਲੋਂ ਵੱਧ ਮੁਰੰਮਤ ਦੌਰਿਆਂ ਦੀ ਲੋੜ ਪਈ।

**Answer state:** ONLY_II

**Explanation:** A ਨੂੰ ਘੱਟ ਦੌਰਿਆਂ ਦੀ ਲੋੜ ਪਈ, ਪਰ ਮੁਰੰਮਤ ਹੋਈ ਹੋ ਸਕਦੀ ਹੈ। ਘੱਟ ਵਾਰ ਹੋਣਾ, ਕਦੇ ਨਾ ਹੋਣਾ ਨਹੀਂ।

---

## SIF-CP004-MORE_LESS-SERVICE-COMPLAINTS · en-IN

**Statement:** The help desk received fewer written complaints in the second week than in the first week.

**Inference I:** The first week had more written complaints than the second week.
**Inference II:** The number of complaints fell because the new help desk opened.

**Answer state:** ONLY_I

**Explanation:** The comparison supports the lower count in week two. It says nothing about why the count changed, so the causal claim does not follow.

---

## SIF-CP004-MORE_LESS-SERVICE-COMPLAINTS · hi-IN

**Statement:** सहायता डेस्क को दूसरे सप्ताह में पहले सप्ताह से कम लिखित शिकायतें मिलीं।

**Inference I:** पहले सप्ताह में दूसरे सप्ताह से अधिक लिखित शिकायतें थीं।
**Inference II:** नई सहायता डेस्क खुलने के कारण शिकायतों की संख्या घटी।

**Answer state:** ONLY_I

**Explanation:** तुलना दूसरे सप्ताह की कम संख्या बताती है। संख्या क्यों बदली, यह नहीं बताती; इसलिए कारण का दावा सही नहीं है।

---

## SIF-CP004-MORE_LESS-SERVICE-COMPLAINTS · pa-IN

**Statement:** ਮਦਦ ਡੈਸਕ ਨੂੰ ਦੂਜੇ ਹਫ਼ਤੇ ਪਹਿਲੇ ਹਫ਼ਤੇ ਨਾਲੋਂ ਘੱਟ ਲਿਖਤੀ ਸ਼ਿਕਾਇਤਾਂ ਮਿਲੀਆਂ।

**Inference I:** ਪਹਿਲੇ ਹਫ਼ਤੇ ਵਿੱਚ ਦੂਜੇ ਹਫ਼ਤੇ ਨਾਲੋਂ ਵੱਧ ਲਿਖਤੀ ਸ਼ਿਕਾਇਤਾਂ ਸਨ।
**Inference II:** ਨਵਾਂ ਮਦਦ ਡੈਸਕ ਖੁੱਲ੍ਹਣ ਕਾਰਨ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਗਿਣਤੀ ਘਟੀ।

**Answer state:** ONLY_I

**Explanation:** ਤੁਲਨਾ ਦੂਜੇ ਹਫ਼ਤੇ ਦੀ ਘੱਟ ਗਿਣਤੀ ਦੱਸਦੀ ਹੈ। ਗਿਣਤੀ ਕਿਉਂ ਬਦਲੀ, ਇਹ ਨਹੀਂ ਦੱਸਦੀ; ਇਸ ਲਈ ਕਾਰਨ ਵਾਲਾ ਦਾਅਵਾ ਸਹੀ ਨਹੀਂ ਹੈ।

---

## SIF-CP004-RANKING-TOURNAMENT-TABLE · en-IN

**Statement:** Team North finished ahead of Team South in the league table, but the two teams had the same number of wins.

**Inference I:** Team North won more matches than Team South.
**Inference II:** Team South did not finish above Team North in the league table.

**Answer state:** ONLY_II

**Explanation:** The table position supports II. Since the wins were equal, the higher position came from another factor; it cannot mean more wins.

---

## SIF-CP004-RANKING-TOURNAMENT-TABLE · hi-IN

**Statement:** लीग तालिका में टीम नॉर्थ, टीम साउथ से ऊपर रही, लेकिन दोनों की जीत की संख्या समान थी।

**Inference I:** टीम नॉर्थ ने टीम साउथ से अधिक मैच जीते।
**Inference II:** लीग तालिका में टीम साउथ, टीम नॉर्थ से ऊपर नहीं रही।

**Answer state:** ONLY_II

**Explanation:** तालिका का स्थान II का समर्थन करता है। जीत समान थीं, इसलिए ऊंचा स्थान किसी और आधार पर था; अधिक जीत का निष्कर्ष नहीं निकलता।

---

## SIF-CP004-RANKING-TOURNAMENT-TABLE · pa-IN

**Statement:** ਲੀਗ ਸਾਰਣੀ ਵਿੱਚ ਟੀਮ ਨੌਰਥ, ਟੀਮ ਸਾਊਥ ਤੋਂ ਉੱਪਰ ਰਹੀ, ਪਰ ਦੋਵਾਂ ਦੀਆਂ ਜਿੱਤਾਂ ਦੀ ਗਿਣਤੀ ਇੱਕੋ ਸੀ।

**Inference I:** ਟੀਮ ਨੌਰਥ ਨੇ ਟੀਮ ਸਾਊਥ ਨਾਲੋਂ ਵੱਧ ਮੈਚ ਜਿੱਤੇ।
**Inference II:** ਲੀਗ ਸਾਰਣੀ ਵਿੱਚ ਟੀਮ ਸਾਊਥ, ਟੀਮ ਨੌਰਥ ਤੋਂ ਉੱਪਰ ਨਹੀਂ ਰਹੀ।

**Answer state:** ONLY_II

**Explanation:** ਸਾਰਣੀ ਦਾ ਸਥਾਨ II ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ। ਜਿੱਤਾਂ ਬਰਾਬਰ ਸਨ, ਇਸ ਲਈ ਉੱਚਾ ਸਥਾਨ ਕਿਸੇ ਹੋਰ ਆਧਾਰ ਉੱਤੇ ਸੀ; ਵੱਧ ਜਿੱਤਾਂ ਦਾ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ।

---
