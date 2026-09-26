# PGK-001 — Punjab General Knowledge Chapter Status

## Editorial state

- English blueprint: COMPLETE
- English CPs approved/frozen: 26 / 26
- CP range: `PGK-001-CP-001` through `PGK-001-CP-026`
- Permanent QL range: `PGK-001-QL-001` through `PGK-001-QL-182`
- Frozen English question corpus: 1,092
- Payloads per permanent QL: 6
- Runtime / Question Studio registration: `REGISTERED_REVIEW_ONLY`
- Question Studio package: `PGK-001`
- Registration authority: `PGK-001-ENGLISH-26CP-FREEZE-2026-09-18`
- Question Bank storage: NOT ENABLED
- Test / mock-test eligibility: NOT ENABLED
- Public / automatic student publication: NOT ENABLED
- Localisation: IN_PROGRESS — CP001-CP022 merged; CP023-CP025 multilingual review candidate implemented

## Final closure audit

The final chapter audit revisited lifecycle records, early learner wording, late-checkpoint deterministic review artifacts and cross-district factual ambiguity before closure.

Notable remediation:
- CP004 Rivers & Doabs received final V2 cleanup and explicit human approval on 18 September 2026.
- Missing historical approval records were restored where prior human approval was already documented.
- CP025 and CP026 gained canonical fact layers plus deterministic review-batch tests.
- The CP026 Harike single-district ambiguity was removed and replaced with the stable Goindwal Sahib → Tarn Taran relation.
- Obsolete branch-marker files were removed.
- Approved/frozen status metadata was normalized across the chapter.

## Question Studio registration

The completed English chapter is exposed through the shared `knowledge-v1` Question Studio engine as package `PGK-001`.

Registration properties:
- lifecycle: `QUESTION-STUDIO-STANDARD-REVIEW-ONLY-V1`;
- runtime mode: `review-only`;
- all 26 frozen CPs available through CP selectors;
- all 182 permanent QLs available through QL selectors;
- English only until localisation is separately approved;
- Easy / Medium / Hard / Mixed review generation supported;
- deterministic selection without replacement;
- 1,092 frozen questions in the registered English corpus;
- generated wrappers are marked `REGISTERED_REVIEW_ONLY`.

Review-only registration does **not** authorize canonical Question Bank persistence, test/mock-test use, public publication, automatic student release or production release.

## Frozen editorial standard

- short, natural Punjab recruitment-exam stems;
- historical/undivided Punjab explicitly distinguished from present-day Indian Punjab;
- version mutable administrative and census facts;
- plausible same-domain distractors;
- simple, useful learner explanations;
- hard questions based on chronology, relations, matching and synthesis rather than obscure trivia;
- learner-facing text remains free of internal source-note/generator language.

## Next boundary

Localisation and any move beyond review-only Question Studio generation are separate gates. Do not enable Question Bank writes, BANK_ONLY lifecycle, tests/mocks, public publication, automatic student release or production release without explicit approval.
