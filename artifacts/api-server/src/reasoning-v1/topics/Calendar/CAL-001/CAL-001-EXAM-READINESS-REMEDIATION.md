# CAL-001 Exam-Readiness Remediation

Status: **implemented in discovery runtime; English editorial review approved; formal discovery/identity freeze remains pending**

This remediation responds to the CP-wise and provisional-QL-wise editorial review of the 220-question review set. It improves generated English questions without allocating permanent QLs or enabling Question Bank, tests, or publication.

## English editorial approval

The project owner approved the corrected English review pack on `2026-08-08`.

Approval covers:

- all 10 checkpoints;
- all 44 provisional authorities;
- 5 curated questions per authority;
- 220 curated English questions;
- the 528-question extended English audit pool;
- question wording, option quality, misconception traps and student explanations.

The approval closes the English editorial-review gate for the current discovery runtime. It does not declare the formal English discovery/identity freeze because final source, merge/split, inverse and gap decisions remain open. See `CAL-001-ENGLISH-EDITORIAL-APPROVAL.md`.

## Implemented corrections

1. **Future-date tense**
   - English calendar stems now use tense-neutral mathematical wording such as “falls on” and “Which weekday does … fall on?”
   - The exam-readiness proof rejects every English stem containing the word `was`.

2. **CAL-PQL-020 inverse authority**
   - The known anchor is now the later date.
   - The requested answer is the weekday of the earlier date.
   - The teaching trace explicitly reverses the verified cross-year remainder.

3. **CAL-PQL-021 mutually exclusive classification**
   - Options are now:
     - Leap non-century year
     - Ordinary non-century year
     - Leap century year
     - Ordinary century year
   - The four semantic categories are generated deterministically and verified as textually unique.

4. **CAL-PQL-025 anchored complete-year block**
   - The stem explicitly states year 1 through year N of the proleptic Gregorian calendar.
   - Structured facts carry the inclusive year range.
   - The explanation derives leap years, ordinary years, total odd-day contribution, and modulo-7 reduction.

5. **CAL-PQL-026 century-block coverage**
   - The deterministic review cycle covers 100, 200, 300, 400, and 700 years.
   - Wider seeds retain at least 12 distinct century-block mathematical states for generator-diversity proof.
   - This proves the 100→5, 200→3, 300→1, 400→0 rule and composite cases.

6. **Ordinary checkpoint boundary safety**
   - CAL-PQL-007 rejects scenarios crossing 29 February.

7. **Exam-natural year distribution**
   - For ordinary non-century authorities, four out of every five seed families are constrained to 1900–2099.
   - Wide historical and century-rule authorities retain the 1600–2399 proof range.

8. **Student explanation cleanup**
   - Internal labels such as `INCLUSIVE_BOTH`, `EXCLUSIVE_BOTH`, `ABSOLUTE_GAP`, and `SIGNED_DIFFERENCE` are converted to student language.
   - QA-only text about independent verification is removed from the student explanation.
   - Detailed derivations are added for count semantics, nth-day questions, leap-year range counts, odd-day blocks, calendar matching, and weekday frequency.

9. **Authority-specific review selection**
   - Every provisional QL is sampled from a 256-seed candidate pool.
   - Five questions are selected with unique rendered questions and mathematical fingerprints, at least three correct-answer positions, and difficulty/template variation.
   - Generic stem templates may repeat only when the instantiated facts and displayed options form a different review question.
   - Mandatory review coverage includes:
     - inclusive and exclusive counts;
     - leap-day present and absent outcomes;
     - forward and backward adjacent-year movement;
     - all four exclusive year classifications;
     - 100/200/300/400/700-year odd-day blocks;
     - ordinary-century and divisible-by-400 boundary cases;
     - ordinary and leap years for year-boundary/frequency authorities;
     - 28-, 29-, 30-, and 31-day months for month-boundary/frequency authorities.

10. **Review exports**
    - Full audit pack: 12 questions × 44 provisional QLs = 528 questions.
    - Curated review pack: 5 questions × 44 provisional QLs = 220 questions.
    - JSON, CSV, and Markdown are produced in CI.

## Merge, split, and inverse audit decisions

The following discovery authorities remain separate until source coverage and the final authority audit determine the permanent QL model:

| Discovery authorities | Audit decision before permanent allocation |
|---|---|
| CAL-PQL-018 and CAL-PQL-020 | Proven forward/inverse pair. Candidate for one permanent authority with direction and known-anchor parameters. |
| CAL-PQL-023, CAL-PQL-024 and CAL-PQL-028 | Candidate for one inclusive year-range classification/count authority with requested class and century-exception exposure parameters. |
| CAL-PQL-029, CAL-PQL-030 and CAL-PQL-031 | Candidate for one full-calendar match authority with next, previous, and option-selection renderers. |
| CAL-PQL-035 and CAL-PQL-036 | Proven inverse pair. Candidate for one year-boundary authority with known boundary parameter. |
| CAL-PQL-037 and CAL-PQL-038 | Proven inverse pair. Candidate for one month-boundary authority with known boundary parameter. |

No discovery authority is deleted in this remediation because the chapter design requires source audit, merge/split audit, inverse audit and gap audit before permanent QL allocation.

## Automated acceptance gates

The new proof checks:

- independent mathematical integrity;
- no future-date past-tense `was` in English stems;
- four textually and semantically unique options;
- no internal explanation labels;
- no student-visible QA verification text;
- corrected inverse semantics;
- exclusive classification labels;
- anchored complete-year blocks;
- preferred ordinary-year distribution;
- all authority-specific curated coverage rules;
- lifecycle locks and permanent QL count of zero.

## Current governance gates

Approved:

- English editorial review of the corrected 220-question curated pack and 528-question audit pool.

Still closed:

- Final source audit
- Final merge/split, inverse and gap audits
- Formal English discovery/identity freeze
- Permanent QL allocation
- Hindi human freeze
- Punjabi human freeze
- Multilingual human parity
- Question Bank writes
- Mock-test eligibility
- Public publication
