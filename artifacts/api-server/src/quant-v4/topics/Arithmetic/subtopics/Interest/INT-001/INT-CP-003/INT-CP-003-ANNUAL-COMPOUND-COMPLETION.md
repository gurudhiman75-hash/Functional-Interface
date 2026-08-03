# INT-CP-003 — Annual Compound Interest Fundamentals and Inverses

Status: `ARCHITECTURE_CONSOLIDATION_REVIEW_CANDIDATE — STAGING_LOCKED`

The permanent mathematical inventory remains `INT-QL-053..INT-QL-066`, with all 14 legacy CP-003 families owned and zero open mathematical gaps.

## Architecture consolidation

The architecture-consolidation candidate introduces one shared mathematical authority for:

- exact rational arithmetic;
- permanent QL identity and solve-contract metadata;
- the 16 exact exam-rate values;
- QL-specific mathematical states;
- canonical answers;
- independent recurrence/relation verification;
- relevant-only mathematical fingerprints.

The legacy completion runtime now delegates to this authority through a compatibility adapter. The exam model owns generation policy only: rate weighting, QL eligibility, maximum-year constraints, context eligibility, representation selection, stem-family selection and instance difficulty.

Every exam question now carries its permanent QL, solve contract, authority version, generator version, solver version and verifier version. The canonical answer must pass the independent relation verifier before options, explanations or review output are packaged.

Rate profiles now constrain eligible QLs, maximum years and allowed contexts. Bank-statement representations are permitted only for rates that allow a bank-deposit context. Declared prose stem families are limited to families that produce distinct rendered wording.

The learner-facing remediation still uses six rendered representations, Indian formatting, deterministic option shuffling, misconception-owned distractors, three explanation depths and MathJax guards. QL-065 continues to withhold derived endpoint amounts. Amount-ratio rate recovery remains restricted to two years, while nth-year rate recovery remains restricted to years two or three.

Draft PR #491 targets the current CP-003 remediation branch. It must pass the inherited completion proof, strengthened exam-readiness audit, review-pack export and API build before architectural review.

No English freeze, staging, registration, Question Studio discovery, Question Bank write, test eligibility or publication is permitted without fresh explicit approval.
