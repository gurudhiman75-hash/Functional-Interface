# AVG-001 English Freeze Record

Release ID: `AVG-001-EN-v1`  
Approval date: `2026-07-24`  
Approval authority: `ExamTree product owner`

## Candidate status

**English freeze candidate — automated freeze and production verification pending.**

## Locked scope

- Package: `AVG-001`
- Canonical problems: 6
- Active English QLs: 425
- Solve modes: 45
- Difficulty distribution: 109 Easy / 187 Medium / 129 Hard
- Approved language: English (`en`)
- Excluded languages: Hindi (`hi`) and Punjabi (`pa`)
- Runtime exposure: Question Studio
- Intended maturity after verification: `FROZEN`
- Intended publication state after verification: `publiclyPublishable: true`

## Required freeze gates

- all 425 QLs active, unique and consecutively numbered;
- exact CP and difficulty distribution locked;
- deterministic generation across multiple seeds;
- exact solver and independent-verifier agreement;
- no unresolved placeholders or internal tokens;
- four unique options with misconception-based distractors;
- explanation depth, arithmetic and final-answer evidence;
- no cross-QL exact rendered stem duplicates;
- English packages carry the approved release ID and `FROZEN` maturity;
- Hindi and Punjabi remain rejected;
- all review exports regenerate with `APPROVED` status;
- API, Question Studio, Render, admin and student production builds pass.

## Change control

After the candidate passes and this record is finalized, any change to English QLs, templates, solve modes, parameter construction, answers, options, explanations, difficulty labels or release metadata requires a new review cycle and a new release ID.
