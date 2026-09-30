# ENG-010 / ENG-011 / ENG-012 — Final Regression Audit V2

Status: `REVIEW_READY__TARGETED_DEFECTS_REMEDIATED`

Audit date: **2026-09-30**

## Scope

This pass audits the three large English ordering/swap banks after their volume expansions:

- ENG-010 Para Jumbles — **450 active sets**
- ENG-011 Sentence Rearrangement — **990 active sets**
- ENG-012 Word Swap — **450 authorities / 1,350 controlled surfaces**

The objective is not further volume. The objective is to detect ambiguity, repeated constructions, defective “natural” variants, and misleading authority inflation.

---

## ENG-010 — Para Jumbles

### Result

No material structural defect requiring a content rewrite was found in this pass.

The active bank retains:

- SSC Standard: 120
- SSC Advanced: 120
- Banking Prelims: 100
- Banking Mains: 110
- **450 total active sets**

Existing guards already require:

- 450 unique active IDs;
- **450 unique paragraph signatures**;
- SSC active sets use four complete sentences;
- Banking sets use five or six sentences;
- deterministic presentation shuffle;
- four unique answer options;
- no identity-order leakage;
- sufficiently detailed explanations;
- 10,000-seed soak coverage.

### Decision

ENG-010 remains content-stable.

Do not add more volume unless new exam evidence shows a missing para-jumble family. Future changes should be one-for-one editorial replacements only.

---

## ENG-011 — Sentence Rearrangement

### Material defect found

The bank reported **990 active authorities**, but the regression test itself only expected **450 unique fragment signatures**.

The cause was the V3 saturation layer:

- 540 saturation authorities were created from the same production-theme fragments;
- the constructor mainly rearranged or recombined those existing fragments;
- new IDs therefore overstated the amount of genuinely new sentence surface;
- several authorities could share the same underlying fragment signature even though their IDs differed.

This is a real breadth/ambiguity issue because sentence-rearrangement value comes from the actual fragment surface, not authority IDs alone.

### Remediation

The 540 saturation IDs are retained, but every saturation variant now receives its own lexical subject cue.

Examples of the controlled cue family include:

- in routine practice;
- under the revised approach;
- during regular review;
- for day-to-day use;
- in ordinary conditions;
- as part of routine planning;
- during periodic checks;
- under normal operating conditions;
- in practical terms.

The cue is integrated into the subject fragment rather than added as a separate fragment, so profile fragment-count contracts remain unchanged.

### New guards

The ENG-011 regression source now requires:

- **990 unique active fragment signatures**, not 450;
- exactly 540 saturation authorities;
- zero exact saturation-signature overlap with the pre-saturation bank;
- zero duplicate logical fragments within a set;
- valid fragment counts by profile;
- deterministic presentation and answer remapping;
- 20,000-seed soak coverage.

### Count

The active count remains **990**.

This is a quality repair, not a volume increase.

---

## ENG-012 — Word Swap

### Material defects found

The overall architecture is sound:

- 450 active authorities;
- 1,350 controlled lexical surfaces;
- 45 no-correction authorities;
- deterministic surface selection and answer remapping.

However, several alternate surfaces marked as “natural” were not actually natural English.

Demonstrated examples included:

- students being required to **“restore”** library books;
- students **“issue”** books from a library;
- the phrase **“term investment”** where the intended banking term is term deposit;
- an ATM transaction appearing in a linked **“balance”** rather than an account;
- a transaction being described as having **“updated correctly”**.

Because V2 can select any controlled variant before applying the swap, these defects could create a bad base sentence before the actual word-swap task began.

### Remediation

The affected variants were replaced one-for-one with natural surfaces.

Examples:

- library variants now retain natural borrow/return/date language;
- term-deposit variants keep “deposit” as the product noun;
- ATM variants now refer to the linked account / mobile app and use natural posting/appearing language.

No authority IDs, counts, swap ownership, no-correction distribution or learner lifecycle state changed.

### New guards

The ENG-012 regression source now explicitly rejects the demonstrated defective natural phrases before generator soak.

Existing guards remain for:

- 450 authorities;
- 1,350 surfaces;
- exactly 45 no-correction authorities;
- profile counts 120 / 120 / 100 / 110;
- four answer options;
- deterministic replay;
- corrected-sentence consistency;
- no-correction sentence identity;
- 20,000-seed soak coverage.

---

## Final decision

After this targeted pass:

- **ENG-010** — no material regression found;
- **ENG-011** — saturation breadth defect remediated;
- **ENG-012** — defective natural variants remediated.

No additional volume is justified for ENG-010, ENG-011 or ENG-012.

All three remain:

`QUESTION_STUDIO_REVIEW_ONLY`

No Question Bank, scored-test, mock-test, public, learner or production release is authorised by this audit.
