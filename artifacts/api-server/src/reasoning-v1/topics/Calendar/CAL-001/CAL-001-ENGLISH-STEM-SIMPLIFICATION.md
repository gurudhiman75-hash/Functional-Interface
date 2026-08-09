# CAL-001 English Stem Simplification

Status: **IMPLEMENTED FOR REVIEW — PERMANENT IDENTITIES AND RELEASE LOCKS UNCHANGED**

Version: `CAL_001_ENGLISH_STEM_SIMPLIFICATION_V1`

## Purpose

The mathematical content of CAL-001 was already correct, but some English stems were longer or more technical than necessary. This pass simplifies selected learner-facing stems so that they are quicker to read and closer to SSC, RRB and state-exam wording.

The pass changes wording only. It does not change:

- dates or mathematical facts;
- correct answers;
- distractors or option order;
- explanations;
- difficulty calculation;
- checkpoint ownership;
- permanent QL identities;
- Hindi or Punjabi drafts;
- any Question Studio, Question Bank, mock-test or publication lock.

## Authorities simplified

Twenty-four discovery authorities receive the simplified English layer:

```text
CAL-PQL-003, 004, 006, 010, 011, 012, 013, 015,
CAL-PQL-016, 019, 021, 025, 026, 029, 030, 031,
CAL-PQL-032, 033, 034, 037, 038, 041, 043, 044
```

## Main wording changes

| Earlier wording style | Simplified exam-ready style |
|---|---|
| “After how many days at the earliest...” | “After how many days will it next be...” |
| “Find the weekday on...” | “What day is...” |
| “How many days are there from... not counting the starting date?” | “How many days after... is...?” |
| “Does the inclusive span...” | “Does the period..., including both dates...” |
| “proleptic Gregorian calendar” | “Gregorian calendar” with the year range stated directly |
| “calendar identical to” | “same calendar as” |
| “Which weekday(s)...” | “Which day or days...” |
| “Which weekday does its last day fall on?” | “On which day does the month end?” |

## Examples

```text
Before: Today is Saturday. After how many days at the earliest will it be Friday?
After:  Today is Saturday. After how many days will it next be Friday?
```

```text
Before: How many odd days are there in the first 237 complete years of the proleptic Gregorian calendar, from year 1 through year 237?
After:  How many odd days are there from year 1 to year 237 in the Gregorian calendar?
```

```text
Before: Are the full-year calendars of 2052 and 2080 identical? Choose the exact reason.
After:  Do 2052 and 2080 have the same calendar? Choose the correct reason.
```

```text
Before: February 1923 begins on Thursday. Which weekday does its last day fall on?
After:  February 1923 begins on Thursday. On which day does the month end?
```

## Machine gate

`english-stem-simplification.test.ts` verifies across 128 seeds per affected authority that:

- the simplified template is applied;
- stems remain direct questions;
- every stem contains at most 30 words;
- heavy phrases are absent;
- future-date `was` does not reappear;
- four-option and answer-index integrity remains unchanged;
- Hindi and Punjabi drafts are not modified.

The original Gregorian, generator, exam-readiness, source-gap and final identity-freeze proofs remain mandatory in the same workflow.

## Lifecycle

```text
English identity freeze:     unchanged
Permanent QLs:               CAL-QL-001..036
Next available identity:     CAL-QL-037
Hindi/Punjabi freeze:        false
Question Studio:             disabled
Question Bank writes:        disabled
Mock-test eligibility:       disabled
Public publication:          disabled
```
