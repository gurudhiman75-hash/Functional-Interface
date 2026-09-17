# COA-001 / COA-CP-006 — English Review Pack

Status: **HUMAN REVIEW REQUIRED**  
Scope: 12 new CP006 questions for `COA-QL-008` — Multi-step / Ordered Response.  
Baseline: earlier semantic authorities remain unchanged; CP005 paired-presentation architecture is already approved/frozen.  
Lifecycle: review only; Question Studio, Question Bank, tests, mocks and student delivery remain closed.

## Answer codes

A. Only Course of Action I follows  
B. Only Course of Action II follows  
C. Both Courses of Action I and II follow  
D. Neither Course of Action I nor II follows

---

## Q1 — COA-QL-008 — Hard

**Statement:** A company detects suspicious access to one employee account. The security team can temporarily block the account, preserve login records and contact the employee, but it does not yet know whether the access was unauthorised.

**Courses of Action:**  
I. The security team should first block further sensitive access, preserve the relevant logs and verify the activity with the employee before resetting credentials or taking disciplinary action.  
II. The security team should first erase the account's recent login history and reset all access records, then try to determine from the remaining information whether the suspicious login was genuine.

**Answer: A — Only I follows.**

**Explanation:** Course I follows because it first contains the risk, keeps the evidence and then verifies what happened before any irreversible step. Course II puts cleanup before investigation and destroys useful evidence needed for the later check.

## Q2 — COA-QL-008 — Hard

**Statement:** A clinic refrigerator gives a temperature alarm overnight. The medicines can be isolated from use while staff check the temperature log and maintenance record, but the alarm alone does not show that every stored item was damaged.

**Courses of Action:**  
I. The clinic should first dispose of every medicine from the refrigerator and only afterwards review the temperature records to see whether the stock had actually been exposed outside the permitted range.  
II. The clinic should first isolate the refrigerator stock from use, review the temperature and maintenance records, and then release or discard items according to the verified exposure.

**Answer: B — Only II follows.**

**Explanation:** Course I makes an irreversible disposal decision before checking the available evidence. Course II first protects patients, then checks the records and only after that decides what stock can be used or must be discarded.

## Q3 — COA-QL-008 — Hard

**Statement:** Minutes before an online examination paper is released, the examination body discovers that the uploaded file may be an outdated draft. A verified final file is available in the controlled repository.

**Courses of Action:**  
I. The examination body should pause release, verify the final file from the controlled repository, replace the doubtful upload and only then reopen distribution.  
II. The examination body should secure the correct final file first, update the distribution package, run a final file check and then notify centres that the release is ready.

**Answer: C — Both I and II follow.**

**Explanation:** Both courses use a safe sequence. Each keeps distribution closed until the correct file is obtained and checked, and only then allows release or confirms readiness.

## Q4 — COA-QL-008 — Medium

**Statement:** A billing portal starts issuing duplicate payment confirmations after a software update. Transaction logs are available and customers are still able to make payments successfully.

**Courses of Action:**  
I. The utility should first credit every account that received two confirmation messages, then compare the payment records and recover any credit where the logs show that only one payment was taken.  
II. The utility should first roll back the software update even if that overwrites the current deployment state, and then investigate the duplicate confirmations from customer reports and the records that remain.

**Answer: D — Neither I nor II follows.**

**Explanation:** Course I changes customer balances before checking whether any duplicate charge actually occurred. Course II changes the system before preserving the technical evidence needed to understand the failure. In both cases, a potentially useful later step is performed too early.

## Q5 — COA-QL-008 — Hard

**Statement:** A bank's fraud system flags a transfer that has not yet been completed. The customer can be contacted immediately, and the alert by itself does not establish whether the transfer is genuine or fraudulent.

**Courses of Action:**  
I. The bank should first place a temporary hold on the flagged transfer, verify it with the customer through an approved channel, and then either release or stop the transfer based on that verification.  
II. The bank should first reverse the flagged transfer as fraudulent, then contact the customer and restore the transfer later if the customer proves that it was authorised.

**Answer: A — Only I follows.**

**Explanation:** Course I uses a temporary safeguard and verifies the facts before the final decision. Course II treats the alert as proven fraud first and seeks verification only afterwards, reversing the correct order.

## Q6 — COA-QL-008 — Easy

**Statement:** A passenger bus develops a brake-system warning while in service. A roadworthy replacement bus is nearby, and the warned vehicle can be inspected once passengers are transferred safely.

**Courses of Action:**  
I. The operator should first complete the remaining passenger route with the warned bus and inspect the brake system after the final stop so that the schedule is not disturbed.  
II. The operator should first stop the warned bus safely, transfer passengers to the available replacement, inspect and repair the affected vehicle, and return it to service only after it passes the required check.

**Answer: B — Only II follows.**

**Explanation:** A brake warning requires the safety step first. Course II stops the risk, keeps the service running through the replacement bus and allows the warned bus back only after inspection. Course I puts schedule completion before safety.

## Q7 — COA-QL-008 — Hard

**Statement:** A warehouse finds destination mismatches in parcels from one dispatch lane after a scanner fault. Parcels already processed by the lane can be separated before trucks leave, and unaffected lanes are working normally.

**Courses of Action:**  
I. The warehouse should first stop the affected lane, separate parcels processed during the fault, repair or replace the scanner, verify the held parcels and then resume that lane.  
II. The warehouse should first hold the affected parcels from loading, compare their labels with the dispatch records, correct confirmed mismatches and release only verified parcels to the trucks.

**Answer: C — Both I and II follow.**

**Explanation:** Both courses prevent further wrong dispatches before releasing parcels. Course I contains and repairs the faulty process before resuming it; Course II verifies the affected parcels before correction and release.

## Q8 — COA-QL-008 — Hard

**Statement:** A college discovers that marks from one assessment may have been imported into the wrong subject column. The original marked scripts and import file are available, and admission forms close in two days.

**Courses of Action:**  
I. The college should first publish revised marks based on an estimate of the likely error and only later compare the original scripts and import file to confirm the correct scores.  
II. The college should keep the normal result-processing schedule unchanged and examine the suspected import error in the next weekly records audit, even though the admission form deadline falls before that audit.

**Answer: D — Neither I nor II follows.**

**Explanation:** Course I changes results before checking the source records. Course II uses a normal audit step but schedules it too late to protect students before the known admission deadline. One is too early; the other is too late.

## Q9 — COA-QL-008 — Medium

**Statement:** After maintenance, one floor of a public office has very low water pressure. Valve positions and pressure readings can be checked quickly, and there is no evidence that the building's pumps have failed.

**Courses of Action:**  
I. The maintenance team should first check the relevant valve positions and pressure readings, correct any confirmed setting error and then test the floor again before considering larger equipment replacement.  
II. The office should first replace the building's main pumps and only afterwards check whether a maintenance valve had simply been left partly closed.

**Answer: A — Only I follows.**

**Explanation:** Course I checks the quick local cause, makes a confirmed correction and tests the result before escalating. Course II starts with a large replacement before checking the available simpler explanation.

## Q10 — COA-QL-008 — Hard

**Statement:** A payroll system shows two salary entries for the same employee in the upcoming payment batch. One entry may be a corrected replacement for the other, and payment can be paused for that employee without delaying the rest of the payroll.

**Courses of Action:**  
I. The payroll team should first delete one of the two entries based on its timestamp and only afterwards compare the approval history to see which entry was valid.  
II. The payroll team should first pause the disputed employee payment, compare both entries with the approval history, keep the valid record, remove the confirmed duplicate and then release the payment.

**Answer: B — Only II follows.**

**Explanation:** Course I deletes a record before establishing which entry is valid. Course II first contains the payment risk, then verifies the records, corrects the confirmed duplication and only after that releases the payment.

## Q11 — COA-QL-008 — Hard

**Statement:** Collection crews miss several streets after a route update because some handheld devices still contain the old route file. The approved master route is correct and can be redistributed before the next round.

**Courses of Action:**  
I. The service should first confirm the approved master route, distribute it to the affected devices, verify that the new file opened correctly and then send crews on the next collection round.  
II. The service should first identify the devices still using the old file, update only those devices, test one route lookup on each and then confirm the revised assignment with the affected crews.

**Answer: C — Both I and II follow.**

**Explanation:** Both sequences make verification a prerequisite for sending crews back out. One starts from the approved master route; the other starts by locating the affected devices. Both end with a check before operational use.

## Q12 — COA-QL-008 — Hard

**Statement:** A service centre receives several reports that one model of charger may overheat. The reports are credible enough to investigate, but the centre has not yet confirmed whether the fault affects all chargers or only one production batch.

**Courses of Action:**  
I. The centre should first require replacement of all chargers of the model as a precaution, then inspect returned samples to decide whether the overheating fault was actually limited to one production batch.  
II. The centre should record the complaints and wait for the next scheduled quality-test slot before isolating suspect chargers or issuing any temporary caution, even though the reported fault involves overheating during normal use.

**Answer: D — Neither I nor II follows.**

**Explanation:** Course I imposes the widest remedy before finding the scope of the defect. Course II waits too long before taking any temporary step against a credible overheating risk. The correct response needs prompt containment and investigation before the final scope of action is decided.

---

## Human review checklist

Review CP006 for:

- whether order or dependency is genuinely decisive in every question;
- whether a wrong course often contains sensible steps in the wrong order rather than an obviously foolish action;
- whether Easy/Medium/Hard differ by reasoning depth, not English difficulty;
- whether explanations clearly state the required order in simple language;
- whether `Both` questions contain two independently valid ordered plans rather than duplicated wording;
- whether `Neither` questions fail for meaningful timing/order reasons;
- whether any question would belong better in verification, constraint or proportionality without the sequence relation;
- whether Course I / Course II positions remain non-predictive.

**No CP006 learner-facing authority is frozen until explicit human approval.**
