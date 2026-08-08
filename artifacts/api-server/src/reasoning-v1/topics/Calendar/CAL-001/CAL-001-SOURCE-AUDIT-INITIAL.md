# CAL-001 Initial Source Audit

## Status

**Initial uploaded-book audit completed; final exam-source gate not passed.**

This audit used pattern-level evidence from the user's uploaded competitive-exam references. No question text is copied into the runtime. The final source gate remains closed because year-tagged SSC, RRB, Banking and Punjab-state papers, plus recent memory sets, still require documented review and human sign-off.

## Covered patterns

| Source pattern | Design mapping | Decision |
|---|---|---|
| Absolute weekday of a Gregorian date using odd days/century blocks | `CAL-PQL-014` | Covered |
| Basic N-day weekday movement | `CAL-PQL-001` / `002` | Covered |
| Leap-year identification and inclusive leap-year counts | `CAL-PQL-021`–`024` | Covered |
| Century-block odd days and 400-year exception | `CAL-PQL-025`–`028` | Covered |
| Same-date relation across years | `CAL-PQL-017` / `018` | Covered |
| Next identical full-year calendar | `CAL-PQL-029` | Covered |
| Month-calendar matching | `CAL-PQL-033` | Covered mathematically; representation review required |
| Five-occurrence weekdays in a month | `CAL-PQL-041` | Covered |
| Cross-month/reverse date relation | `CAL-PQL-006` / `007` | Covered |

## Discovery gaps retained explicitly

Two uploaded-book patterns are not silently forced into the 44-authority inventory:

1. **List every date in a month on which a named weekday occurs.** This has a date-set answer and may require a new authority or a split from the frequency checkpoint.
2. **Count how often a numbered date exists across a long year range** (for example, a leap-sensitive February date). This is a date-validity range count, not weekday frequency, and requires merge/split review.

These findings are recorded in `source-audit-gate.ts` as `NEW_AUTHORITY_REQUIRED`. Consequently:

```text
Source audit passed: false
Permanent QLs: 0
Question Studio public discovery: false
Question Bank writes: false
Mock-test eligibility: false
Public publication: false
```

## Remaining mandatory evidence

- SSC CGL, CHSL, CPO and MTS samples;
- RRB NTPC and Group D samples;
- IBPS, SBI and RRB Banking samples;
- Punjab-state recruitment samples;
- recent exam-memory sets with confidence labels;
- human merge/split decisions for every uncovered pattern.
