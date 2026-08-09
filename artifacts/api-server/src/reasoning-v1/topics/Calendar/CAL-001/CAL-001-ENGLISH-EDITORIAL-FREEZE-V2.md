# CAL-001 English Editorial Freeze V2

Status: **APPROVED AND FROZEN FOR ENGLISH EDITORIAL CONTENT**

Freeze version: `CAL_001_ENGLISH_EDITORIAL_FREEZE_V2`

Approval date: `2026-08-09`

## Evidence reviewed

The final self-review covered:

- the regenerated 220-question curated English pack;
- the 528-question extended English audit pack;
- the 15-question source-gap review pack;
- all 44 approved discovery authorities;
- all three source-gap authorities;
- the frozen permanent mapping `CAL-QL-001..036`.

The review checked stem clarity, exam-style wording, tense, ambiguity, option uniqueness, answer correctness, distractor logic, explanation relevance and release-lock integrity.

## Blocking issue found and corrected

`CAL-PQL-033` asks for another year in which a specified month has the same calendar. Its answer generation was correct, but its explanation still used full-year criteria such as the weekday of 1 January and leap status.

The frozen explanation now uses the correct month-level criteria only:

1. the two months must begin on the same weekday;
2. the two months must have the same number of days.

It also explicitly warns that two months may match even when the full-year calendars do not.

## Additional editorial corrections

- Reworded backward-day questions as natural past-reference questions: `What day was it N days ago?`
- Kept the future-date tense guard, but no longer bans grammatically correct past tense.
- Replaced `Which day or days...` with `Which weekdays...` in frequency-set questions.
- Replaced awkward `weekday(s)` and `day(s)` text throughout English explanations.
- Removed `proleptic` and other unnecessarily technical learner-facing wording from odd-day explanations.
- Replaced mechanical zero-remainder wording such as `the first 0 weekdays` with a direct statement that every weekday occurs equally often.
- Reworked month and year frequency explanations to identify the actual extra weekdays and explain why the named weekday occurs 52, 53, 4 or 5 times.

## Machine-enforced freeze

`english-editorial-freeze-v2.test.ts` verifies 128 generated English packages for every one of the 44 approved discovery authorities, plus the 220-question curated selection.

It enforces:

- direct, concise stems;
- correct past versus future tense;
- four unique options and one correct answer;
- complete explanations;
- no internal labels or mechanical plural forms;
- correct month-level reasoning for `CAL-PQL-033`;
- clear zero-extra-day handling;
- English-only isolation;
- unchanged permanent identities and closed release gates.

The original Gregorian, generator, exam-readiness, stem-simplification, source-gap and permanent-identity proofs remain mandatory.

## Frozen inventory

```text
Approved discovery prototypes: 44
Approved source-gap prototypes:  3
Frozen source prototypes:       47
Permanent English QLs:          CAL-QL-001..036
Next available identity:        CAL-QL-037
```

## Release boundary

This approval freezes English editorial content and preserves the existing English identity freeze. It does not activate delivery.

```text
Hindi human freeze:          false
Punjabi human freeze:        false
Multilingual parity:         false
Question Studio:             disabled
Question Bank writes:        disabled
Mock-test eligibility:       disabled
Public publication:          disabled
```

## Final verdict

After the corrections above, CAL-001 is approved as exam-ready English Calendar content for the SSC, RRB and Punjab-state aptitude scope represented by the audited sources. The English stems, options, answers and explanations are frozen at V2. Any later English change must create a new editorial version and rerun the complete proof suite.
