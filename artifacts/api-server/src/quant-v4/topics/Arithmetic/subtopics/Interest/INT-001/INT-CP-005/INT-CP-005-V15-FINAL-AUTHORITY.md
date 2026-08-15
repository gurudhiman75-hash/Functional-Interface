# INT-CP-005 V15 Final Authority

- Checkpoint: `INT-CP-005 — Variable Rates, Growth & Decay`
- Permanent QLs: `INT-QL-086..INT-QL-095`
- Final runtime: `INT-CP-005-VARIABLE-GROWTH-DECAY-v15`
- Immutable freeze: `INT-CP-005-EN-HI-PA-v15-frozen`
- Locales: `en-IN`, `hi-IN`, `pa-IN`
- Approved learner-source head: `93dad8b2455c5255ad2fdc5542710c3f63f9d69d`
- Exact runtime/freeze validation head: `2e5ddb6b5e5b0ff1cc956df20e1959cb59d6f512`
- Final V15 validation run: `31866119559` — PASS
- Final review/freeze artifact: `9242051486`
- Final artifact digest: `sha256:ac5a603842abd2ffac74ee422d2a929e7438fe578eb21aee4b2b00a7669c1a10`
- Render production build run on that validation head: `31866119604` — PASS
- Integrated admin/student run on that validation head: `31866119578` — PASS

The later authority-document commit changes documentation only; it does not modify CP005 runtime, freeze, audit, review-export, registry, delivery, or application code.

## V15 manual-review remediation

V14 was not integrated after manual artifact review found an exam-realism defect in QL093: an artificially scaled town population could exceed 195 million. V15 removes only the common artificial scale from QL093 threshold pairs while preserving direction, rate, first-crossing year, solution, option values/order, misconception ownership and independent verifier truth.

The corrected V15 artifact was then manually inspected. QL093 now contains realistic city/asset states such as `15,625 → 19,683` at 8% and `10,000 → 14,641` at 10%. A second manual finding, English `1 years`, was corrected to `1 year` and is regression-gated across the generated corpus.

## Final proof

V15 corpus audit:
- 10 QLs × 100 seeds × 3 locales = 3,000 questions
- 3,000 independent verifier checks
- 2,700 exact non-threshold V14 parity checks
- 4,800 QL093 realism/ownership checks
- 21,000 lifecycle checks
- 3,000 MathJax wrapper checks
- QL093: both growth/decay, years 2–5, 8 rates, 49 genuine direction/rate/year topologies

Final review artifact:
- 40 questions per locale / 120 total
- 4 per QL per locale
- answer positions A/B/C/D = 10/10/10/10 per locale
- 40 unique stems per locale
- no `1 years`
- no old absurd QL093 population states
- no >2-place learner decimals in retained pack
- no dollar-delimiter MathJax
- no rejected Punjabi compound-interest terminology

Immutable V15 freeze replay:
- 3,000 frozen questions
- 6,000 source/frozen identity checks
- 21,000 lifecycle checks
- 15,000 deep-freeze checks
- mutation guards 2/2

## Closed delivery boundary

V15 completion/freeze does not activate downstream product delivery:
- `enabled: false`
- `stagingStatus: NOT_STAGED`
- `registrationStatus: NOT_REGISTERED`
- `questionStudioDiscoverable: false`
- Question Bank: `NOT_STORED`
- tests: `INELIGIBLE`
- public publication: `false`

Question Studio activation remains a separate checkpoint.
