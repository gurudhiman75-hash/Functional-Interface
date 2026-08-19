# NUM-CP-008 Hindi/Punjabi localization — review candidate

Status: **IMPLEMENTED AS REVIEW CANDIDATE; NOT FROZEN YET**

Canonical authority:
- English permanent runtime is frozen at `NUM-QL-166..NUM-QL-184`.
- Next free Number System identity remains `NUM-QL-185`.
- Localization does not allocate new QL identities and does not change any solver mathematics.

Architecture:
- `localization/runtime.ts` wraps `generateNumCp008Permanent`.
- Learner-facing Hindi/Punjabi stems and explanations are rebuilt from the frozen hidden mathematical state.
- Numeric state, mathematical fingerprints, source/prototype ancestry, option order, correctness, correct index and misconception IDs are preserved.
- Text-valued answers/options use controlled exact semantic mappings.

Proof target:
- 19 permanent QLs × 120 seeds × 2 languages = **4,560 localized packages**.
- deterministic replay;
- exact hidden-state/fingerprint parity with frozen English;
- exact option order/key/misconception parity;
- localized canonical/verifier parity;
- target-script presence;
- residual-English learner-text rejection;
- minimum explanation substance;
- at least 60 distinct localized stems per QL/locale;
- exact approved source-prototype reach for every permanent QL in each locale.

Review artifact:
- one generated Hindi and one generated Punjabi sample per permanent QL;
- JSON audit + JSON sample set + Markdown review sheet.

Lifecycle remains locked:
- `PERMANENT_AUTHORITY`
- English authority: `ENGLISH_FROZEN`
- localized review: `MULTILINGUAL_REVIEW_CANDIDATE / HI_PA_REVIEW_CANDIDATE`
- active: false
- Question Studio discoverable: false
- Question Bank writable: false
- test/mock eligible: false
- publicly publishable: false

Promotion to `MULTILINGUAL_FROZEN / HI_PA_FROZEN` requires a green executable localization gate plus human-quality review of generated evidence. No downstream activation is implied by that promotion.
