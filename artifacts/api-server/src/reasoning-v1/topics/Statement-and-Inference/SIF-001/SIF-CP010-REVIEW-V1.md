# SIF-CP010 — Conditional Inference — Review V1

**Status:** Human-review candidate; not frozen
**Chapter:** SIF-001 — Statement & Inference
**Difficulty:** Medium to Hard
**Delivery:** Review only; Question Bank, tests, mocks and public delivery remain locked

## Review focus

- interpret explicitly stated conditions without reversing the logical direction;
- distinguish a necessary condition from a sufficient one, including “only if”;
- track “unless”, “provided that”, “whenever” and conditional chains;
- avoid claiming a cause, outcome or reverse condition that the rule does not establish.

**Authority pool:** 24 trilingual scenarios across 8 conditional-inference families
**Review sample:** 24 distinct scenarios; three from each family
**Difficulty mix:** 12 Medium / 12 Hard
**Answer positions:** I 12 / II 12
**Automated gates:** PASS

## Conditional-family coverage

| Family | Authorities | Review questions |
|---|---:|---:|
| IF_THEN | 3 | 3 |
| ONLY_IF | 3 | 3 |
| UNLESS | 3 | 3 |
| PROVIDED_THAT | 3 | 3 |
| WHENEVER | 3 | 3 |
| NEGATIVE_CONDITION | 3 | 3 |
| CONDITIONAL_CHAIN | 3 | 3 |
| SCOPE_CONDITION | 3 | 3 |

## Q1 · SIF-CP010-IF_THEN-COMPLETE-FORM

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Conditional family:** IF_THEN
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** If an application contains the required proof of address, the clerk assigns it a tracking number. Asha's application contained the required proof. The office follows this rule for every application.

**Inference I:** Asha's application receives a tracking number.
**Inference II:** Every application with a tracking number contained proof of address.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Asha's application meets the stated condition, so the clerk assigns it a tracking number. The rule does not say that proof of address is the only possible route to a tracking number. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q2 · SIF-CP010-IF_THEN-COOLING-ALERT

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Conditional family:** IF_THEN
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** If the server room temperature rises above the set limit, an alert is sent to the facilities team. The alert log shows an alert at 14:00. The log does not state what triggered it.

**Inference I:** The alert was caused by a temperature rise.
**Inference II:** An alert was recorded at 2 p.m.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The log directly records an alert at 2 p.m. It does not identify the trigger, so a temperature rise cannot be inferred. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q3 · SIF-CP010-IF_THEN-LIBRARY-HOLD

**Difficulty:** HARD
**Context:** EDUCATION
**Conditional family:** IF_THEN
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** If a reserved book is not collected within two working days, the reservation is cancelled. Neel's book remained uncollected for three working days. The library applies the rule from the end of the second working day.

**Inference I:** Neel chose not to collect the book because he no longer needed it.
**Inference II:** Neel's reservation has been cancelled.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The book remained uncollected beyond the two-working-day limit, so the stated rule cancels the reservation. The passage gives no reason why Neel did not collect it. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q4 · SIF-CP010-ONLY_IF-DESIGNATED-ZONE

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Conditional family:** ONLY_IF
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** Employees receive the field allowance only if they are assigned to a designated zone. Rina received the allowance for March. The rule states a requirement, not an automatic payment for every eligible employee.

**Inference I:** Rina was assigned to a designated zone.
**Inference II:** Every employee assigned to a designated zone received the field allowance.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** “Only if” makes designated-zone assignment necessary for receiving the allowance. Rina received it, so she met that requirement; the rule does not guarantee payment to every person assigned there. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q5 · SIF-CP010-ONLY_IF-SIGNED-RECEIPT

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Conditional family:** ONLY_IF
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A supplier releases a consignment only if the buyer signs the delivery receipt. The consignment was released to a buyer on Tuesday. The receipt rule applies to all releases.

**Inference I:** The signed receipt was the reason the supplier released the consignment.
**Inference II:** The buyer signed the delivery receipt.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** A signed receipt is required for every release, so the buyer must have signed it. The rule does not establish that the signature was the reason for release or the only relevant step. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q6 · SIF-CP010-ONLY_IF-EXAM-ELIGIBILITY

**Difficulty:** HARD
**Context:** EDUCATION
**Conditional family:** ONLY_IF
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** A candidate may sit the practical examination only if the attendance requirement has been met. The candidate's attendance record meets that requirement. The notice does not say that meeting it alone completes all examination formalities.

**Inference I:** The candidate is guaranteed a seat in the practical examination.
**Inference II:** The candidate has met the attendance requirement stated for the practical examination.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The attendance condition is met, but “only if” makes it necessary rather than sufficient. This establishes that condition alone, not a guaranteed examination seat. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q7 · SIF-CP010-UNLESS-PAYMENT-DISPATCH

**Difficulty:** MEDIUM
**Context:** BUSINESS
**Conditional family:** UNLESS
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** Unless the invoice is paid by Friday, the order will remain on hold. The buyer has not paid it by Friday. The dispatch note records no separate exception to this rule.

**Inference I:** The order remains on hold.
**Inference II:** The order will be dispatched immediately once payment is made.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The unpaid-by-Friday condition activates the stated hold rule, so the order remains on hold. The statement gives no guarantee about how soon it will be dispatched after payment. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q8 · SIF-CP010-UNLESS-STAFF-COVER

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Conditional family:** UNLESS
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Unless a replacement officer is appointed, the counter will close at 16:00. No replacement has been appointed for Thursday. The roster gives no alternative arrangement for that day.

**Inference I:** The counter will remain closed for the entire day on Thursday.
**Inference II:** The counter is scheduled to close at 4 p.m. on Thursday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** With no replacement appointed, the rule schedules closing at 4 p.m. It says nothing about the counter's opening or service before that time. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q9 · SIF-CP010-UNLESS-DOCUMENT-REVIEW

**Difficulty:** HARD
**Context:** BANKING
**Conditional family:** UNLESS
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Unless both identity proof and the signed form are submitted, an account-change request is not sent for review. The file contains the signed form but no identity proof. The checklist applies to every request in this batch.

**Inference I:** The request will be rejected permanently.
**Inference II:** The request is not sent for review.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** One required document is missing, so the request does not meet the condition for review and is not sent. The rule says nothing about permanent rejection. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q10 · SIF-CP010-PROVIDED_THAT-VISITOR-REGISTER

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Conditional family:** PROVIDED_THAT
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** Visitors may enter the archive provided that they sign the register at reception. Dev signs the register before going to the archive. Reception staff follow the same entry rule throughout the day.

**Inference I:** Dev is permitted to enter the archive.
**Inference II:** Every visitor who signs the register actually enters the archive.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Signing meets the stated condition that permits entry, so Dev may enter. Permission does not show that every signer actually chooses to enter. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q11 · SIF-CP010-PROVIDED_THAT-BUS-RESERVATION

**Difficulty:** HARD
**Context:** TRANSPORT
**Conditional family:** PROVIDED_THAT
**Answer state:** ONLY_II

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A passenger can reserve a seat on the airport bus provided that the booking is made at least one day ahead. Meena booked her seat two days before travel. The service accepts reservations under this rule.

**Inference I:** Meena is guaranteed a window seat.
**Inference II:** Meena's booking meets the stated timing condition for a reservation.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The booking was made more than one day ahead, so it meets the stated timing condition. The rule does not specify the seat position or guarantee a window seat. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q12 · SIF-CP010-PROVIDED_THAT-LAB-ACCESS

**Difficulty:** HARD
**Context:** HEALTHCARE
**Conditional family:** PROVIDED_THAT
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** A technician may use the evening laboratory provided that a supervisor is present. On Tuesday evening a supervisor was present while the laboratory was in use. The rule concerns permission to use the room, not who operated each instrument.

**Inference I:** The supervisor personally operated every instrument used that evening.
**Inference II:** A technician was permitted to use the evening laboratory on Tuesday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The supervisor's presence satisfies the stated condition for technician access. It does not establish who operated any instrument. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q13 · SIF-CP010-WHENEVER-OVERHEAT-ALARM

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Conditional family:** WHENEVER
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** Whenever the packaging machine overheats, its control panel sends an alert to the shift lead. An alert appeared at 11:00. The panel record lists the alert but not its trigger.

**Inference I:** The machine overheated at 11 a.m.
**Inference II:** The alert may have been sent for a different reason.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Overheating is one stated trigger for an alert, not the only possible trigger. Because the log does not identify the trigger, the machine's temperature cannot be inferred. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q14 · SIF-CP010-WHENEVER-WATER-SAMPLE

**Difficulty:** MEDIUM
**Context:** HEALTHCARE
**Conditional family:** WHENEVER
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Whenever a water sample fails the safety test, the laboratory marks it for a second test. Sample 18 was marked for a second test. The record does not say why it was marked.

**Inference I:** Sample 18 was marked for a second test.
**Inference II:** Sample 18 failed the safety test.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The record directly says that Sample 18 was marked for a second test. It gives no reason for the mark, so failure cannot be inferred. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q15 · SIF-CP010-WHENEVER-LATE-DELIVERY

**Difficulty:** HARD
**Context:** BUSINESS
**Conditional family:** WHENEVER
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Whenever a consignment misses its delivery window, the logistics desk opens a service case. A service case was opened for consignment 452. The desk can also open cases for damaged goods or missing paperwork.

**Inference I:** Consignment 452 missed its delivery window.
**Inference II:** A service case was opened for consignment 452.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The passage states that a service case was opened. It lists late delivery as one possible reason, alongside other reasons, so lateness is not established. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q16 · SIF-CP010-NEGATIVE_CONDITION-PAYMENT-RELEASE

**Difficulty:** MEDIUM
**Context:** BANKING
**Conditional family:** NEGATIVE_CONDITION
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** If a reimbursement claim is not approved, it is not sent for payment. Claim 76 was sent for payment. The rule is applied to every reimbursement claim.

**Inference I:** Claim 76 was approved.
**Inference II:** Claim 76 was paid in full.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The rule excludes unapproved claims from payment processing. Since claim 76 was sent for payment, it cannot be unapproved. Being sent does not establish that payment was completed or made in full. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q17 · SIF-CP010-NEGATIVE_CONDITION-ENTRY-RECORD

**Difficulty:** HARD
**Context:** PUBLIC_ADMINISTRATION
**Conditional family:** NEGATIVE_CONDITION
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** If a visitor has not registered at the gate, the security desk does not issue a visitor badge. Omar was issued a badge. The register and badge records refer to the same visit.

**Inference I:** Omar registered at the gate.
**Inference II:** Omar was allowed into every restricted area.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Under the rule, an unregistered visitor would not receive a badge. Omar received one, so he must have registered. A badge does not grant access to every restricted area. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q18 · SIF-CP010-NEGATIVE_CONDITION-CREDIT-ELIGIBILITY

**Difficulty:** HARD
**Context:** BANKING
**Conditional family:** NEGATIVE_CONDITION
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** If an application lacks either of the two required references, it is not considered for the credit line. The review file contains both references for Dev's application. The policy does not promise approval after the file is considered.

**Inference I:** Dev's credit line has been approved.
**Inference II:** Dev's application meets the stated reference requirement for consideration.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Both references are present, so the stated reason for excluding the file does not apply. The rule only concerns consideration and does not guarantee approval. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q19 · SIF-CP010-CONDITIONAL_CHAIN-TRAINING-CERTIFICATE

**Difficulty:** HARD
**Context:** WORKPLACE
**Conditional family:** CONDITIONAL_CHAIN
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** If a technician completes both safety modules, the training unit records the technician as certified. If a technician is certified, the technician may operate the new press. Iqbal completed both modules, and the unit follows these rules for all technicians.

**Inference I:** Iqbal may operate the new press.
**Inference II:** Every technician who operates the press must have completed both safety modules.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Completing both modules makes Iqbal certified, and certification permits operation. The rules do not say that certification is the only route to operate the press. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q20 · SIF-CP010-CONDITIONAL_CHAIN-CLAIM-REVIEW

**Difficulty:** HARD
**Context:** BANKING
**Conditional family:** CONDITIONAL_CHAIN
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** If a claim includes the original invoice, it is sent to the verification desk. If the verification desk confirms the invoice, the claim moves to payment review. Claim 88 moved to payment review, but the file does not state whether it included the original invoice.

**Inference I:** Claim 88 moved to payment review.
**Inference II:** Claim 88 included the original invoice.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The file directly says that Claim 88 moved to payment review. Although confirmation can lead to that step, the rule does not establish that it is the only route. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q21 · SIF-CP010-CONDITIONAL_CHAIN-PERMIT-INSPECTION

**Difficulty:** MEDIUM
**Context:** PUBLIC_ADMINISTRATION
**Conditional family:** CONDITIONAL_CHAIN
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** If a building passes the electrical inspection, the permit office issues a completion note. If the completion note is issued, the file is closed. The office closed Building K's file, but the record does not identify which inspection, if any, it passed.

**Inference I:** Building K passed the electrical inspection.
**Inference II:** Building K's file is closed.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The record directly states that the file was closed. The rules say a passed inspection can lead to closure, but do not say it is the only way a file can close. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

## Q22 · SIF-CP010-SCOPE_CONDITION-NIGHT-ALLOWANCE

**Difficulty:** MEDIUM
**Context:** WORKPLACE
**Conditional family:** SCOPE_CONDITION
**Answer state:** ONLY_I

**Instruction:** Which inference is supported by the information given?

**Statement:** Only staff assigned to the night shift may claim the night-meal allowance. Arjun is assigned to the night shift. The payroll note says shift assignment is one condition for claiming it.

**Inference I:** Arjun meets the shift-assignment condition needed to make a claim.
**Inference II:** Arjun has received the night-meal allowance.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The night-shift assignment meets the stated necessary condition for a claim. It does not show that Arjun filed a claim or received payment. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q23 · SIF-CP010-SCOPE_CONDITION-SENIOR-COUNTER

**Difficulty:** HARD
**Context:** PUBLIC_ADMINISTRATION
**Conditional family:** SCOPE_CONDITION
**Answer state:** ONLY_I

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** Only applicants aged 60 or above may use the priority counter. Rao is 63 and used that counter on Monday. The notice sets an age restriction but gives no information about waiting time.

**Inference I:** Mr Rao met the stated age condition for using the priority counter.
**Inference II:** Mr Rao was served before every other applicant on Monday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** At 63, Mr Rao meets the stated age limit. The notice does not report the order in which applicants were served. Therefore, only Inference I follows.

**Validation:** 10/10 gates passed

---

## Q24 · SIF-CP010-SCOPE_CONDITION-COLD-STORE

**Difficulty:** HARD
**Context:** BUSINESS
**Conditional family:** SCOPE_CONDITION
**Answer state:** ONLY_II

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** Only sealed produce cartons may be placed in the cold store. The evening inventory lists 40 sealed cartons inside. The list does not record the condition of cartons kept elsewhere.

**Inference I:** Every sealed carton at the site was placed in the cold store.
**Inference II:** Every carton listed inside the cold store was sealed.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** “Only sealed cartons may be placed there” makes sealing necessary for storage inside. The rule does not require every sealed carton to be stored there. Therefore, only Inference II follows.

**Validation:** 10/10 gates passed

---

# Multilingual parity spot-check

## SIF-CP010-IF_THEN-COMPLETE-FORM · en-IN

**Statement:** If an application contains the required proof of address, the clerk assigns it a tracking number. Asha's application contained the required proof. The office follows this rule for every application.

**Instruction:** Which inference is supported by the information given?

**Inference I:** Asha's application receives a tracking number.
**Inference II:** Every application with a tracking number contained proof of address.

**Answer state:** ONLY_I

**Explanation:** Asha's application meets the stated condition, so the clerk assigns it a tracking number. The rule does not say that proof of address is the only possible route to a tracking number. Therefore, only Inference I follows.

---

## SIF-CP010-IF_THEN-COMPLETE-FORM · hi-IN

**Statement:** यदि किसी आवेदन में पते का आवश्यक प्रमाण हो, तो लिपिक उसे ट्रैकिंग नंबर देता है। आशा के आवेदन में यह प्रमाण था। कार्यालय हर आवेदन पर यही नियम लागू करता है।

**Instruction:** दी गई जानकारी से कौन-सा अनुमान समर्थित है?

**Inference I:** आशा के आवेदन को ट्रैकिंग नंबर मिलता है।
**Inference II:** ट्रैकिंग नंबर वाले हर आवेदन में पते का प्रमाण था।

**Answer state:** ONLY_I

**Explanation:** आशा का आवेदन बताई गई शर्त पूरी करता है, इसलिए लिपिक उसे ट्रैकिंग नंबर देगा। नियम यह नहीं कहता कि ट्रैकिंग नंबर पाने का यही एक तरीका है। इसलिए केवल अनुमान I सही है।

---

## SIF-CP010-IF_THEN-COMPLETE-FORM · pa-IN

**Statement:** ਜੇ ਕਿਸੇ ਅਰਜ਼ੀ ਨਾਲ ਪਤੇ ਦਾ ਲੋੜੀਂਦਾ ਸਬੂਤ ਹੋਵੇ, ਤਾਂ ਕਲਰਕ ਉਸ ਨੂੰ ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ ਦਿੰਦਾ ਹੈ। ਆਸ਼ਾ ਦੀ ਅਰਜ਼ੀ ਨਾਲ ਇਹ ਸਬੂਤ ਸੀ। ਦਫ਼ਤਰ ਹਰ ਅਰਜ਼ੀ ਲਈ ਇਹ ਨਿਯਮ ਲਾਗੂ ਕਰਦਾ ਹੈ।

**Instruction:** ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਕਿਹੜਾ ਅਨੁਮਾਨ ਸਮਰਥਿਤ ਹੈ?

**Inference I:** ਆਸ਼ਾ ਦੀ ਅਰਜ਼ੀ ਨੂੰ ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ ਮਿਲਦਾ ਹੈ।
**Inference II:** ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ ਵਾਲੀ ਹਰ ਅਰਜ਼ੀ ਨਾਲ ਪਤੇ ਦਾ ਸਬੂਤ ਸੀ।

**Answer state:** ONLY_I

**Explanation:** ਆਸ਼ਾ ਦੀ ਅਰਜ਼ੀ ਦੱਸੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਕਲਰਕ ਉਸ ਨੂੰ ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ ਦੇਵੇਗਾ। ਨਿਯਮ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ ਲੈਣ ਦਾ ਇਹੀ ਇੱਕ ਤਰੀਕਾ ਹੈ। ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ I ਸਹੀ ਹੈ।

---

## SIF-CP010-IF_THEN-COOLING-ALERT · en-IN

**Statement:** If the server room temperature rises above the set limit, an alert is sent to the facilities team. The alert log shows an alert at 14:00. The log does not state what triggered it.

**Instruction:** Which inference is supported by the information given?

**Inference I:** The alert was caused by a temperature rise.
**Inference II:** An alert was recorded at 2 p.m.

**Answer state:** ONLY_II

**Explanation:** The log directly records an alert at 2 p.m. It does not identify the trigger, so a temperature rise cannot be inferred. Therefore, only Inference II follows.

---

## SIF-CP010-IF_THEN-COOLING-ALERT · hi-IN

**Statement:** यदि सर्वर कक्ष का तापमान तय सीमा से ऊपर जाता है, तो सुविधाओं की टीम को चेतावनी भेजी जाती है। लॉग में दोपहर 2 बजे एक चेतावनी दर्ज है। लॉग यह नहीं बताता कि चेतावनी किस कारण आई।

**Instruction:** दी गई जानकारी से कौन-सा अनुमान समर्थित है?

**Inference I:** तापमान बढ़ने के कारण चेतावनी आई।
**Inference II:** दोपहर 2 बजे चेतावनी दर्ज हुई।

**Answer state:** ONLY_II

**Explanation:** लॉग में 14:00 बजे चेतावनी दर्ज है। चेतावनी किस कारण आई, यह नहीं बताया गया; इसलिए तापमान बढ़ने का अनुमान नहीं लगाया जा सकता। इसलिए केवल अनुमान II सही है।

---

## SIF-CP010-IF_THEN-COOLING-ALERT · pa-IN

**Statement:** ਜੇ ਸਰਵਰ ਕਮਰੇ ਦਾ ਤਾਪਮਾਨ ਨਿਰਧਾਰਤ ਹੱਦ ਤੋਂ ਵੱਧ ਹੋਵੇ, ਤਾਂ ਸਹੂਲਤਾਂ ਵਾਲੀ ਟੀਮ ਨੂੰ ਚੇਤਾਵਨੀ ਭੇਜੀ ਜਾਂਦੀ ਹੈ। ਲੌਗ ਵਿੱਚ ਦੁਪਹਿਰ 2 ਵਜੇ ਚੇਤਾਵਨੀ ਦਰਜ ਹੈ। ਲੌਗ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਚੇਤਾਵਨੀ ਕਿਸ ਕਾਰਨ ਆਈ।

**Instruction:** ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਕਿਹੜਾ ਅਨੁਮਾਨ ਸਮਰਥਿਤ ਹੈ?

**Inference I:** ਤਾਪਮਾਨ ਵਧਣ ਕਾਰਨ ਚੇਤਾਵਨੀ ਆਈ।
**Inference II:** ਦੁਪਹਿਰ 2 ਵਜੇ ਚੇਤਾਵਨੀ ਦਰਜ ਹੋਈ।

**Answer state:** ONLY_II

**Explanation:** ਲੌਗ ਵਿੱਚ 14:00 ਵਜੇ ਚੇਤਾਵਨੀ ਦਰਜ ਹੈ। ਚੇਤਾਵਨੀ ਕਿਸ ਕਾਰਨ ਆਈ, ਇਹ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ; ਇਸ ਲਈ ਤਾਪਮਾਨ ਵਧਣ ਦਾ ਅਨੁਮਾਨ ਨਹੀਂ ਲਾਇਆ ਜਾ ਸਕਦਾ। ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ II ਸਹੀ ਹੈ।

---

## SIF-CP010-ONLY_IF-EXAM-ELIGIBILITY · en-IN

**Statement:** A candidate may sit the practical examination only if the attendance requirement has been met. The candidate's attendance record meets that requirement. The notice does not say that meeting it alone completes all examination formalities.

**Instruction:** Which inference is supported by the information given?

**Inference I:** The candidate is guaranteed a seat in the practical examination.
**Inference II:** The candidate has met the attendance requirement stated for the practical examination.

**Answer state:** ONLY_II

**Explanation:** The attendance condition is met, but “only if” makes it necessary rather than sufficient. This establishes that condition alone, not a guaranteed examination seat. Therefore, only Inference II follows.

---

## SIF-CP010-ONLY_IF-EXAM-ELIGIBILITY · hi-IN

**Statement:** उम्मीदवार प्रायोगिक परीक्षा में तभी बैठ सकता है जब उपस्थिति की शर्त पूरी हो। उम्मीदवार का उपस्थिति रिकॉर्ड इस शर्त को पूरा करता है। सूचना यह नहीं कहती कि केवल यह शर्त पूरी करना ही सारी औपचारिकताओं के लिए पर्याप्त है।

**Instruction:** दी गई जानकारी से कौन-सा अनुमान समर्थित है?

**Inference I:** उम्मीदवार की प्रायोगिक परीक्षा में सीट पक्की है।
**Inference II:** उम्मीदवार ने प्रायोगिक परीक्षा के लिए बताई गई उपस्थिति की शर्त पूरी की है।

**Answer state:** ONLY_II

**Explanation:** उपस्थिति की शर्त पूरी है, लेकिन “तभी” इसे आवश्यक शर्त बनाता है, अपने-आप पर्याप्त नहीं। इससे परीक्षा में सीट पक्की होना सिद्ध नहीं होता। इसलिए केवल अनुमान II सही है।

---

## SIF-CP010-ONLY_IF-EXAM-ELIGIBILITY · pa-IN

**Statement:** ਉਮੀਦਵਾਰ ਪ੍ਰੈਕਟੀਕਲ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਤਾਂ ਹੀ ਬੈਠ ਸਕਦਾ ਹੈ ਜੇ ਹਾਜ਼ਰੀ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਹੋਵੇ। ਉਮੀਦਵਾਰ ਦਾ ਹਾਜ਼ਰੀ ਰਿਕਾਰਡ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ। ਨੋਟਿਸ ਇਹ ਨਹੀਂ ਕਹਿੰਦਾ ਕਿ ਸਿਰਫ਼ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨਾ ਸਾਰੀਆਂ ਰਸਮਾਂ ਲਈ ਕਾਫ਼ੀ ਹੈ।

**Instruction:** ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਕਿਹੜਾ ਅਨੁਮਾਨ ਸਮਰਥਿਤ ਹੈ?

**Inference I:** ਉਮੀਦਵਾਰ ਦੀ ਪ੍ਰੈਕਟੀਕਲ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਸੀਟ ਪੱਕੀ ਹੈ।
**Inference II:** ਉਮੀਦਵਾਰ ਨੇ ਪ੍ਰੈਕਟੀਕਲ ਪ੍ਰੀਖਿਆ ਲਈ ਦੱਸੀ ਹਾਜ਼ਰੀ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕੀਤੀ ਹੈ।

**Answer state:** ONLY_II

**Explanation:** ਹਾਜ਼ਰੀ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਹੈ, ਪਰ “ਤਾਂ ਹੀ” ਇਸ ਨੂੰ ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਬਣਾਉਂਦਾ ਹੈ, ਆਪਣੇ-ਆਪ ਕਾਫ਼ੀ ਨਹੀਂ। ਇਸ ਤੋਂ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਸੀਟ ਪੱਕੀ ਹੋਣਾ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ। ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ II ਸਹੀ ਹੈ।

---

## SIF-CP010-PROVIDED_THAT-LAB-ACCESS · en-IN

**Statement:** A technician may use the evening laboratory provided that a supervisor is present. On Tuesday evening a supervisor was present while the laboratory was in use. The rule concerns permission to use the room, not who operated each instrument.

**Instruction:** Which inference is supported by the information given?

**Inference I:** The supervisor personally operated every instrument used that evening.
**Inference II:** A technician was permitted to use the evening laboratory on Tuesday.

**Answer state:** ONLY_II

**Explanation:** The supervisor's presence satisfies the stated condition for technician access. It does not establish who operated any instrument. Therefore, only Inference II follows.

---

## SIF-CP010-PROVIDED_THAT-LAB-ACCESS · hi-IN

**Statement:** तकनीशियन शाम की प्रयोगशाला का उपयोग तभी कर सकता है जब पर्यवेक्षक मौजूद हो। मंगलवार शाम प्रयोगशाला के उपयोग के दौरान एक पर्यवेक्षक मौजूद था। यह नियम कमरे के उपयोग की अनुमति से जुड़ा है, हर उपकरण किसने चलाया इससे नहीं।

**Instruction:** दी गई जानकारी से कौन-सा अनुमान समर्थित है?

**Inference I:** पर्यवेक्षक ने उस शाम इस्तेमाल हुए हर उपकरण को स्वयं चलाया।
**Inference II:** ਮੰਗਲਵਾਰ ਨੂੰ ਟੈਕਨੀਸ਼ੀਅਨ ਨੂੰ ਸ਼ਾਮ ਦੀ ਲੈਬ ਵਰਤਣ ਦੀ ਇਜਾਜ਼ਤ ਸੀ।

**Answer state:** ONLY_II

**Explanation:** ਮੰਗਲਵਾਰ ਸ਼ਾਮ ਨਿਗਰਾਨ ਮੌਜੂਦ ਸੀ, ਇਸ ਲਈ ਟੈਕਨੀਸ਼ੀਅਨ ਨੂੰ ਲੈਬ ਵਰਤਣ ਦੀ ਇਜਾਜ਼ਤ ਸੀ। ਇਸ ਨਾਲ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਕਿਸ ਨੇ ਕੋਈ ਯੰਤਰ ਚਲਾਇਆ। इसलिए केवल अनुमान II सही है।

---

## SIF-CP010-PROVIDED_THAT-LAB-ACCESS · pa-IN

**Statement:** ਟੈਕਨੀਸ਼ੀਅਨ ਸ਼ਾਮ ਦੀ ਲੈਬ ਵਰਤ ਸਕਦਾ ਹੈ ਜੇ ਨਿਗਰਾਨ ਮੌਜੂਦ ਹੋਵੇ। ਮੰਗਲਵਾਰ ਸ਼ਾਮ ਲੈਬ ਵਰਤਣ ਸਮੇਂ ਇੱਕ ਨਿਗਰਾਨ ਮੌਜੂਦ ਸੀ। ਇਹ ਨਿਯਮ ਕਮਰੇ ਦੀ ਵਰਤੋਂ ਦੀ ਇਜਾਜ਼ਤ ਬਾਰੇ ਹੈ, ਹਰ ਯੰਤਰ ਕਿਸ ਨੇ ਚਲਾਇਆ ਇਸ ਬਾਰੇ ਨਹੀਂ।

**Instruction:** ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ ਕਿਹੜਾ ਅਨੁਮਾਨ ਸਮਰਥਿਤ ਹੈ?

**Inference I:** ਨਿਗਰਾਨ ਨੇ ਉਸ ਸ਼ਾਮ ਵਰਤੇ ਹਰ ਯੰਤਰ ਨੂੰ ਖੁਦ ਚਲਾਇਆ।
**Inference II:** ਮੰਗਲਵਾਰ ਸ਼ਾਮ ਲੈਬ ਵਰਤਣ ਲਈ ਟੈਕਨੀਸ਼ੀਅਨ ਨੂੰ ਇਜਾਜ਼ਤ ਸੀ।

**Answer state:** ONLY_II

**Explanation:** ਮੰਗਲਵਾਰ ਸ਼ਾਮ ਨਿਗਰਾਨ ਮੌਜੂਦ ਸੀ, ਇਸ ਲਈ ਟੈਕਨੀਸ਼ੀਅਨ ਨੂੰ ਲੈਬ ਵਰਤਣ ਦੀ ਇਜਾਜ਼ਤ ਸੀ। ਇਸ ਨਾਲ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਕੋਈ ਯੰਤਰ ਕਿਸ ਨੇ ਚਲਾਇਆ। ਇਸ ਲਈ ਕੇਵਲ ਅਨੁਮਾਨ II ਸਹੀ ਹੈ।

---
