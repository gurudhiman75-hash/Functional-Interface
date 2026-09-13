# POL-CP-003 — Preamble, Union & Citizenship Status

**Branch:** `feature/polity-cp003-preamble-union-citizenship`  
**Lifecycle:** REVIEW CANDIDATE — LANGUAGE V3  
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
- 58-question review batch
- structural/provenance QA
- generic date-wrapper ban carried forward from CP-002
- current citizenship-policy/current-affairs leakage blocked

## Language V3 pass

The review generator and canonical fact explanations were simplified after editorial feedback.

Rules now enforced:
- short, direct exam-style stems;
- plain explanations suitable for beginners;
- no artificial difficulty through legalistic wording;
- constitutional terms such as `domicile`, `ordinary residence`, `registration` and `President's recommendation` are retained only where they affect legal meaning;
- ordinary direct stems must remain at or below 30 words;
- banned stem wording includes `principal subject`, `most directly governs`, `For the purposes of Article 368`, and `supplemental, incidental and consequential provisions`;
- the rejected `On which date did the following occur...` wrapper remains blocked.

## Mechanical review QA

- 58 questions
- 18/18 QLs represented
- 14 Easy / 35 Medium / 9 Hard
- exactly four unique options per question
- canonical answer matches the recorded correct option in every question
- all four answer positions used
- no exact semantic duplicate signatures
- Static constitutional scope preserved

The repository-side V2 generator is now the simplified-language authority for this CP. Full repository CI is not claimed here.

## Deliberately gated

- merge to `New-main`
- Question Studio exposure
- Hindi/Punjabi localization
- chapter-wide production registration

These remain gated until the simplified English V3 review is approved.
