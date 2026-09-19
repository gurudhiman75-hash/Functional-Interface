# SIF-CP001 — Direct Fact-Based Inference — Review V1

**Status:** Human review candidate; not frozen
**Chapter:** SIF-001 — Statement & Inference
**Runtime:** Structured facts → support classification → answer → language
**Delivery:** Review only; Question Bank and learner delivery remain locked

## Review focus

- natural SSC/Banking/Punjab-state exam wording;
- direct fact connection without outside knowledge;
- meaningful variation across education, banking, transport, workplace, business, administration and everyday contexts;
- balanced valid-inference position;
- simple explanations that identify the supporting fact and reject the unsupported extension;
- English/Hindi/Punjabi answer parity.

**Authority pool:** 120 independently authored scenarios
**Non-numeric scenarios:** 43
**Review coverage:** 20 distinct scenarios shown; 0 repeated scenarios
**Answer classes:** ONLY_II, ONLY_I
**Automated gates:** PASS

## Authority-pool coverage

| Context domain | Authorities |
|---|---:|
| BANKING | 19 |
| BUSINESS | 21 |
| EDUCATION | 21 |
| EVERYDAY | 9 |
| PUBLIC_ADMINISTRATION | 17 |
| TRANSPORT | 15 |
| WORKPLACE | 18 |

## Q1 · SIF-CP001-CHECKOUT-COUNTERS

**Difficulty:** EASY
**Context:** BUSINESS
**Format:** TWO_INFERENCES

**Instruction:** Which inference is supported by the information given?

**Statement:** A facility had 16 checkout counters; 13 were operating and 3 were temporarily unavailable.

**Inference I:** Every unavailable unit required permanent replacement.
**Inference II:** Exactly 3 units were temporarily unavailable.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The statement gives 3 as temporarily unavailable, so II follows. Temporary unavailability does not imply permanent replacement. Therefore, I does not follow.

**Validation:** 10/10 gates passed

---

## Q2 · SIF-CP001-CONFERENCE-ROOMS

**Difficulty:** EASY
**Context:** WORKPLACE
**Format:** TWO_INFERENCES

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** A facility had 12 conference rooms; 9 were available and 3 were temporarily unavailable.

**Inference I:** Exactly 3 units were temporarily unavailable.
**Inference II:** Every unavailable unit required permanent replacement.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The statement gives 3 as temporarily unavailable, so I follows. Temporary unavailability does not imply permanent replacement. Therefore, II does not follow.

**Validation:** 10/10 gates passed

---

## Q3 · SIF-CP001-TICKET-MACHINES

**Difficulty:** EASY
**Context:** TRANSPORT
**Format:** TWO_INFERENCES

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** A facility had 20 ticket machines; 17 were operating and 3 were temporarily unavailable.

**Inference I:** Every unavailable unit required permanent replacement.
**Inference II:** Exactly 3 units were temporarily unavailable.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The statement gives 3 as temporarily unavailable, so II follows. Temporary unavailability does not imply permanent replacement. Therefore, I does not follow.

**Validation:** 10/10 gates passed

---

## Q4 · SIF-CP001-CLAIM-ACKNOWLEDGEMENT

**Difficulty:** EASY
**Context:** BANKING
**Format:** TWO_INFERENCES

**Instruction:** Which inference is supported by the information given?

**Statement:** The insurance claim was received on Monday, acknowledged the same day, and forwarded to the assessment desk on Tuesday.

**Inference I:** The insurance claim reached the assessment desk after it was received.
**Inference II:** The insurance claim was finally approved on Tuesday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The stated sequence confirms receipt followed by forwarding to the assessment desk. Forwarding is not final approval. Therefore, only I follows.

**Validation:** 10/10 gates passed

---

## Q5 · SIF-CP001-REPAIR-ACKNOWLEDGEMENT

**Difficulty:** EASY
**Context:** EVERYDAY
**Format:** TWO_INFERENCES

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** The repair request was received on Monday, acknowledged the same day, and forwarded to the technical section on Tuesday.

**Inference I:** The repair request was finally approved on Tuesday.
**Inference II:** The repair request reached the technical section after it was received.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The stated sequence confirms receipt followed by forwarding to the technical section. Forwarding is not final approval. Therefore, only II follows.

**Validation:** 10/10 gates passed

---

## Q6 · SIF-CP001-ADMISSION-ACKNOWLEDGEMENT

**Difficulty:** EASY
**Context:** EDUCATION
**Format:** TWO_INFERENCES

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The admission form was received on Monday, acknowledged the same day, and forwarded to the verification committee on Tuesday.

**Inference I:** The admission form reached the verification committee after it was received.
**Inference II:** The admission form was finally approved on Tuesday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The stated sequence confirms receipt followed by forwarding to the verification committee. Forwarding is not final approval. Therefore, only I follows.

**Validation:** 10/10 gates passed

---

## Q7 · SIF-CP001-VENDOR-ACKNOWLEDGEMENT

**Difficulty:** EASY
**Context:** BUSINESS
**Format:** TWO_INFERENCES

**Instruction:** Which inference is supported by the information given?

**Statement:** The vendor application was received on Monday, acknowledged the same day, and forwarded to the procurement team on Tuesday.

**Inference I:** The vendor application was finally approved on Tuesday.
**Inference II:** The vendor application reached the procurement team after it was received.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The stated sequence confirms receipt followed by forwarding to the procurement team. Forwarding is not final approval. Therefore, only II follows.

**Validation:** 10/10 gates passed

---

## Q8 · SIF-CP001-TRANSFER-ACKNOWLEDGEMENT

**Difficulty:** EASY
**Context:** WORKPLACE
**Format:** TWO_INFERENCES

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** The transfer request was received on Monday, acknowledged the same day, and forwarded to the personnel section on Tuesday.

**Inference I:** The transfer request reached the personnel section after it was received.
**Inference II:** The transfer request was finally approved on Tuesday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The stated sequence confirms receipt followed by forwarding to the personnel section. Forwarding is not final approval. Therefore, only I follows.

**Validation:** 10/10 gates passed

---

## Q9 · SIF-CP001-PERMIT-ACKNOWLEDGEMENT

**Difficulty:** EASY
**Context:** PUBLIC_ADMINISTRATION
**Format:** TWO_INFERENCES

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The permit application was received on Monday, acknowledged the same day, and forwarded to the scrutiny branch on Tuesday.

**Inference I:** The permit application was finally approved on Tuesday.
**Inference II:** The permit application reached the scrutiny branch after it was received.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The stated sequence confirms receipt followed by forwarding to the scrutiny branch. Forwarding is not final approval. Therefore, only II follows.

**Validation:** 10/10 gates passed

---

## Q10 · SIF-CP001-ARCHIVE-PLACEMENT

**Difficulty:** EASY
**Context:** PUBLIC_ADMINISTRATION
**Format:** TWO_INFERENCES

**Instruction:** Which inference is supported by the information given?

**Statement:** The original registers were labelled and placed in the record room. A duplicate list was kept at the main desk.

**Inference I:** The original registers were stored in the record room.
**Inference II:** The duplicate list contained the original items.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The statement directly places the original registers in the record room. A list is only a record of the items, not the items themselves. Therefore, only I follows.

**Validation:** 10/10 gates passed

---

## Q11 · SIF-CP001-KEY-PLACEMENT

**Difficulty:** EASY
**Context:** WORKPLACE
**Format:** TWO_INFERENCES

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** The spare keys were labelled and placed in the security cabinet. A duplicate list was kept at the main desk.

**Inference I:** The duplicate list contained the original items.
**Inference II:** The spare keys were stored in the security cabinet.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The statement directly places the spare keys in the security cabinet. A list is only a record of the items, not the items themselves. Therefore, only II follows.

**Validation:** 10/10 gates passed

---

## Q12 · SIF-CP001-BOOK-PLACEMENT

**Difficulty:** EASY
**Context:** EDUCATION
**Format:** TWO_INFERENCES

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The reference books were labelled and placed in the reading-room shelf. A duplicate list was kept at the main desk.

**Inference I:** The reference books were stored in the reading-room shelf.
**Inference II:** The duplicate list contained the original items.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The statement directly places the reference books in the reading-room shelf. A list is only a record of the items, not the items themselves. Therefore, only I follows.

**Validation:** 10/10 gates passed

---

## Q13 · SIF-CP001-CHEQUE-PLACEMENT

**Difficulty:** EASY
**Context:** BANKING
**Format:** TWO_INFERENCES

**Instruction:** Which inference is supported by the information given?

**Statement:** The verified cheques were labelled and placed in the processing tray. A duplicate list was kept at the main desk.

**Inference I:** The duplicate list contained the original items.
**Inference II:** The verified cheques were stored in the processing tray.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The statement directly places the verified cheques in the processing tray. A list is only a record of the items, not the items themselves. Therefore, only II follows.

**Validation:** 10/10 gates passed

---

## Q14 · SIF-CP001-PARCEL-PLACEMENT

**Difficulty:** EASY
**Context:** TRANSPORT
**Format:** TWO_INFERENCES

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** The undelivered parcels were labelled and placed in the return counter. A duplicate list was kept at the main desk.

**Inference I:** The undelivered parcels were stored in the return counter.
**Inference II:** The duplicate list contained the original items.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** The statement directly places the undelivered parcels in the return counter. A list is only a record of the items, not the items themselves. Therefore, only I follows.

**Validation:** 10/10 gates passed

---

## Q15 · SIF-CP001-TOOL-PLACEMENT

**Difficulty:** EASY
**Context:** BUSINESS
**Format:** TWO_INFERENCES

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The inspection tools were labelled and placed in the equipment cabinet. A duplicate list was kept at the main desk.

**Inference I:** The duplicate list contained the original items.
**Inference II:** The inspection tools were stored in the equipment cabinet.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** The statement directly places the inspection tools in the equipment cabinet. A list is only a record of the items, not the items themselves. Therefore, only II follows.

**Validation:** 10/10 gates passed

---

## Q16 · SIF-CP001-LIBRARY-SCHEDULE

**Difficulty:** EASY
**Context:** EDUCATION
**Format:** TWO_INFERENCES

**Instruction:** Which inference is supported by the information given?

**Statement:** The library provides book-return service from Monday to Friday. On Saturday, only enquiry service is available.

**Inference I:** book-return service is not available there on Saturday.
**Inference II:** The library remains completely closed on Saturday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Only enquiry service is available on Saturday, so book-return service is unavailable then. Enquiry service being open means the premises are not necessarily closed. Therefore, only I follows.

**Validation:** 10/10 gates passed

---

## Q17 · SIF-CP001-BANK-SCHEDULE

**Difficulty:** EASY
**Context:** BANKING
**Format:** TWO_INFERENCES

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** The branch provides cash service from Monday to Friday. On Saturday, only enquiry service is available.

**Inference I:** The branch remains completely closed on Saturday.
**Inference II:** cash service is not available there on Saturday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Only enquiry service is available on Saturday, so cash service is unavailable then. Enquiry service being open means the premises are not necessarily closed. Therefore, only II follows.

**Validation:** 10/10 gates passed

---

## Q18 · SIF-CP001-CLINIC-SCHEDULE

**Difficulty:** EASY
**Context:** EVERYDAY
**Format:** TWO_INFERENCES

**Instruction:** Consider the following inferences and determine which of them follows.

**Statement:** The clinic provides general consultation from Monday to Friday. On Saturday, only enquiry service is available.

**Inference I:** general consultation is not available there on Saturday.
**Inference II:** The clinic remains completely closed on Saturday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Only enquiry service is available on Saturday, so general consultation is unavailable then. Enquiry service being open means the premises are not necessarily closed. Therefore, only I follows.

**Validation:** 10/10 gates passed

---

## Q19 · SIF-CP001-OFFICE-SCHEDULE

**Difficulty:** EASY
**Context:** PUBLIC_ADMINISTRATION
**Format:** TWO_INFERENCES

**Instruction:** Which inference is supported by the information given?

**Statement:** The public office provides document collection from Monday to Friday. On Saturday, only enquiry service is available.

**Inference I:** The public office remains completely closed on Saturday.
**Inference II:** document collection is not available there on Saturday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** B. Only Inference II follows

**Explanation:** Only enquiry service is available on Saturday, so document collection is unavailable then. Enquiry service being open means the premises are not necessarily closed. Therefore, only II follows.

**Validation:** 10/10 gates passed

---

## Q20 · SIF-CP001-SERVICE-SCHEDULE

**Difficulty:** EASY
**Context:** BUSINESS
**Format:** TWO_INFERENCES

**Instruction:** What can reasonably be inferred from the information given?

**Statement:** The service centre provides customer support from Monday to Friday. On Saturday, only enquiry service is available.

**Inference I:** customer support is not available there on Saturday.
**Inference II:** The service centre remains completely closed on Saturday.

A. Only Inference I follows
B. Only Inference II follows
C. Either Inference I or II follows
D. Neither Inference I nor II follows
E. Both Inference I and II follow

**Answer:** A. Only Inference I follows

**Explanation:** Only enquiry service is available on Saturday, so customer support is unavailable then. Enquiry service being open means the premises are not necessarily closed. Therefore, only I follows.

**Validation:** 10/10 gates passed

---

# Multilingual parity spot-check

## SIF-CP001-CHECKOUT-COUNTERS · en-IN

**Statement:** A facility had 16 checkout counters; 13 were operating and 3 were temporarily unavailable.

**Inference I:** Every unavailable unit required permanent replacement.
**Inference II:** Exactly 3 units were temporarily unavailable.

**Answer class:** ONLY_II

**Explanation:** The statement gives 3 as temporarily unavailable, so II follows. Temporary unavailability does not imply permanent replacement. Therefore, I does not follow.

---

## SIF-CP001-CHECKOUT-COUNTERS · hi-IN

**Statement:** एक सुविधा में 16 बिलिंग काउंटर थीं; 13 चालू थीं और 3 अस्थायी रूप से अनुपलब्ध थीं।

**Inference I:** हर अनुपलब्ध इकाई को स्थायी रूप से बदलना आवश्यक था।
**Inference II:** ठीक 3 इकाइयां अस्थायी रूप से अनुपलब्ध थीं।

**Answer class:** ONLY_II

**Explanation:** कथन 3 इकाइयों को अस्थायी रूप से अनुपलब्ध बताता है, इसलिए II सही है। अस्थायी अनुपलब्धता स्थायी बदलाव सिद्ध नहीं करती। इसलिए I सही नहीं है।

---

## SIF-CP001-CHECKOUT-COUNTERS · pa-IN

**Statement:** ਇੱਕ ਸਹੂਲਤ ਵਿੱਚ 16 ਬਿਲਿੰਗ ਕਾਊਂਟਰ ਸਨ; 13 ਚਾਲੂ ਸਨ ਅਤੇ 3 ਅਸਥਾਈ ਤੌਰ ਉੱਤੇ ਉਪਲਬਧ ਨਹੀਂ ਸਨ।

**Inference I:** ਹਰ ਗੈਰ-ਉਪਲਬਧ ਇਕਾਈ ਨੂੰ ਸਥਾਈ ਤੌਰ ਉੱਤੇ ਬਦਲਣਾ ਲਾਜ਼ਮੀ ਸੀ।
**Inference II:** ਠੀਕ 3 ਇਕਾਈਆਂ ਅਸਥਾਈ ਤੌਰ ਉੱਤੇ ਉਪਲਬਧ ਨਹੀਂ ਸਨ।

**Answer class:** ONLY_II

**Explanation:** ਕਥਨ 3 ਇਕਾਈਆਂ ਨੂੰ ਅਸਥਾਈ ਤੌਰ ਉੱਤੇ ਗੈਰ-ਉਪਲਬਧ ਦੱਸਦਾ ਹੈ, ਇਸ ਲਈ II ਸਹੀ ਹੈ। ਅਸਥਾਈ ਗੈਰ-ਉਪਲਬਧਤਾ ਸਥਾਈ ਬਦਲਾਅ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ। ਇਸ ਲਈ I ਸਹੀ ਨਹੀਂ ਹੈ।

---

## SIF-CP001-CASH-RECONCILIATION · en-IN

**Statement:** A branch counted ₹3,20,000 in cash deposits and found the amount equal to the total shown in its deposit records.

**Inference I:** Every deposit had been made by an account holder at the counter.
**Inference II:** The counted cash matched the recorded deposit total.

**Answer class:** ONLY_II

**Explanation:** The statement directly says that the counted and recorded totals were equal, so II follows. It gives no depositor or payment-mode details. Therefore, I does not follow.

---

## SIF-CP001-CASH-RECONCILIATION · hi-IN

**Statement:** एक शाखा ने नकद जमा में ₹3,20,000 गिने और यह राशि जमा अभिलेखों में दिखाए कुल के बराबर थी।

**Inference I:** हर जमा राशि किसी खाताधारक ने काउंटर पर जमा की थी।
**Inference II:** गिनी गई नकदी दर्ज जमा राशि से मेल खाती थी।

**Answer class:** ONLY_II

**Explanation:** कथन सीधे बताता है कि गिना और दर्ज कुल समान था, इसलिए II सही है। जमाकर्ता या भुगतान माध्यम का विवरण नहीं है। इसलिए I सही नहीं है।

---

## SIF-CP001-CASH-RECONCILIATION · pa-IN

**Statement:** ਇੱਕ ਸ਼ਾਖਾ ਨੇ ਨਕਦ ਜਮ੍ਹਾਂ ਵਿੱਚ ₹3,20,000 ਗਿਣੇ ਅਤੇ ਇਹ ਰਕਮ ਜਮ੍ਹਾਂ ਰਿਕਾਰਡਾਂ ਵਿੱਚ ਦਰਸਾਏ ਕੁੱਲ ਦੇ ਬਰਾਬਰ ਸੀ।

**Inference I:** ਹਰ ਜਮ੍ਹਾਂ ਰਕਮ ਕਿਸੇ ਖਾਤਾਧਾਰਕ ਨੇ ਕਾਊਂਟਰ ਉੱਤੇ ਜਮ੍ਹਾਂ ਕੀਤੀ ਸੀ।
**Inference II:** ਗਿਣੀ ਗਈ ਨਕਦੀ ਦਰਜ ਜਮ੍ਹਾਂ ਰਕਮ ਨਾਲ ਮਿਲਦੀ ਸੀ।

**Answer class:** ONLY_II

**Explanation:** ਕਥਨ ਸਿੱਧਾ ਦੱਸਦਾ ਹੈ ਕਿ ਗਿਣਿਆ ਅਤੇ ਦਰਜ ਕੁੱਲ ਬਰਾਬਰ ਸੀ, ਇਸ ਲਈ II ਸਹੀ ਹੈ। ਜਮ੍ਹਾਂਕਰਤਾ ਜਾਂ ਭੁਗਤਾਨ ਢੰਗ ਦਾ ਵੇਰਵਾ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ I ਸਹੀ ਨਹੀਂ ਹੈ।

---

## SIF-CP001-REFERENCE-EXCLUSION · en-IN

**Statement:** The operating rule states that books issued for home use must not be kept in The reference section.

**Inference I:** The rule proves that such a violation has already occurred.
**Inference II:** Keeping books issued for home use in The reference section would violate the stated rule.

**Answer class:** ONLY_II

**Explanation:** The rule expressly prohibits that placement, so II follows. A prohibition does not establish that someone has already broken it. Therefore, I does not follow.

---

## SIF-CP001-REFERENCE-EXCLUSION · hi-IN

**Statement:** कार्य नियम के अनुसार घर ले जाने के लिए जारी पुस्तकें को संदर्भ अनुभाग में नहीं रखा जाना चाहिए।

**Inference I:** नियम से सिद्ध होता है कि ऐसा उल्लंघन पहले ही हो चुका है।
**Inference II:** घर ले जाने के लिए जारी पुस्तकें को संदर्भ अनुभाग में रखना दिए गए नियम का उल्लंघन होगा।

**Answer class:** ONLY_II

**Explanation:** नियम उस स्थिति को स्पष्ट रूप से रोकता है, इसलिए II सही है। प्रतिबंध से यह सिद्ध नहीं होता कि नियम पहले ही तोड़ा गया है। इसलिए I सही नहीं है।

---

## SIF-CP001-REFERENCE-EXCLUSION · pa-IN

**Statement:** ਕੰਮ ਦੇ ਨਿਯਮ ਅਨੁਸਾਰ ਘਰ ਲੈ ਜਾਣ ਲਈ ਜਾਰੀ ਕਿਤਾਬਾਂ ਨੂੰ ਹਵਾਲਾ ਸ਼ਾਖਾ ਵਿੱਚ ਨਹੀਂ ਰੱਖਿਆ ਜਾਣਾ ਚਾਹੀਦਾ।

**Inference I:** ਨਿਯਮ ਤੋਂ ਸਾਬਤ ਹੁੰਦਾ ਹੈ ਕਿ ਅਜਿਹੀ ਉਲੰਘਣਾ ਪਹਿਲਾਂ ਹੀ ਹੋ ਚੁੱਕੀ ਹੈ।
**Inference II:** ਘਰ ਲੈ ਜਾਣ ਲਈ ਜਾਰੀ ਕਿਤਾਬਾਂ ਨੂੰ ਹਵਾਲਾ ਸ਼ਾਖਾ ਵਿੱਚ ਰੱਖਣਾ ਦਿੱਤੇ ਨਿਯਮ ਦੀ ਉਲੰਘਣਾ ਹੋਵੇਗੀ।

**Answer class:** ONLY_II

**Explanation:** ਨਿਯਮ ਉਸ ਸਥਿਤੀ ਨੂੰ ਸਪਸ਼ਟ ਤੌਰ ਉੱਤੇ ਰੋਕਦਾ ਹੈ, ਇਸ ਲਈ II ਸਹੀ ਹੈ। ਪਾਬੰਦੀ ਤੋਂ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਨਿਯਮ ਪਹਿਲਾਂ ਹੀ ਤੋੜਿਆ ਗਿਆ ਹੈ। ਇਸ ਲਈ I ਸਹੀ ਨਹੀਂ ਹੈ।

---
