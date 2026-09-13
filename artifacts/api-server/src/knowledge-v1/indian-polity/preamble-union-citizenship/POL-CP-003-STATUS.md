# POL-CP-003 — Preamble, Union & Citizenship Status

**Branch:** `feature/polity-cp003-preamble-union-citizenship`  
**Lifecycle:** REVIEW CANDIDATE  
**Runtime registration:** BLOCKED pending human approval

## Implemented

- official Legislative Department source registry
- Preamble objective/wording registry
- original/current Preamble status-term distinction
- Forty-second Amendment Preamble changes
- complete Part I Article 1–4 subject/rule map
- complete Part II Article 5–11 subject/rule map
- Article 5 commencement-citizenship conditions
- Article 6 pre/post-19 July 1948 migration distinction
- Article 7 resettlement/permanent-return exception
- Article 8 overseas Indian-origin registration path
- 4 scenario rows for Articles 5–8
- 18 genuine QLs
- 58-question V2 review batch
- structural/provenance QA
- generic date-wrapper ban carried forward from CP-002
- current citizenship-policy/current-affairs leakage blocked

## Mechanical review QA

Independent review-batch construction passed:
- 58 questions
- 18/18 QLs represented
- 14 Easy / 35 Medium / 9 Hard
- exactly four unique options per question
- canonical answer matches the recorded correct option in every question
- all four answer positions used
- no exact semantic duplicate signatures
- no rejected `On which date did the following occur...` wrapper
- Static constitutional scope preserved

The repository-side V2 QA test checks the same structural, source-resolution and Article-map invariants. This is not a claim that the full repository CI suite has run.

## Deliberately gated

- merge to `New-main`
- Question Studio exposure
- Hindi/Punjabi localization
- chapter-wide production registration

These remain gated until the English V2 review file is approved.
