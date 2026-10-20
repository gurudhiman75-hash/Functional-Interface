# Banking Number Series — memory-based question source extension

This extends the existing reviewed runtime with two source-supported Prelims
grammars: `CONSTANT_DIVISION` and `CONSECUTIVE_PRIME_DIFFERENCE`. The total
implemented vocabulary is now 21 grammars. It does not assert human approval,
whole-publisher source saturation or empirical frequency calibration.

## Sources and adjudication

The new ledger records 11 question locators from two accessible Adda247
memory-based PDFs: IBPS PO Prelims 2024 Q76–80 and SBI PO Prelims, 1 November
2023, Q47–52. These are publisher reconstructions, not official papers. The
IBPS PDF has no admitted held-date/shift identity in this pass; the SBI source
has no admitted shift. Neither is admitted as a complete calibrated section.
Full source questions and PDFs are not redistributed.

IBPS Q77's intended repeated division by 3 is independently verified: the wrong
term 220 must be replaced by 225. The original seven-term source has exactly
one repair across the current supported vocabulary. SBI Q49's intended
prime-difference missing value is independently calculated as 117.

IBPS Q80 supports subtracting successive primes beginning at 19, giving 2055
instead of 2054. Its exact seven-term surface also admits three other repairs
under the existing interleaved grammar. Therefore the intended arithmetic is
recorded without certifying a uniquely solvable source item. The regression
preserves this ambiguity hold rather than trusting the printed key.

Six additional candidate source families remain explicit implementation gaps;
two items remain unresolved. These are newly observed gaps and are not hidden
inside the old V3 closure. Exact reproduction of source widths is not asserted.
The ledger is `bns-source-review/memory-source-extension-20261017.json`.

## Implementation

- Constant division uses divisors 2, 3 and 4. Initial values are exact multiples
  of the full divisor chain, keeping all terms integral without recurring-decimal
  rounding. Independent templates reconstruct the ratio from observed numbers.
- Prime differences add or subtract scaled consecutive primes, with bounded
  offsets. The independent verifier separately constructs prime-gap templates;
  it does not consult generator states or supplied answers.
- Both families support next/missing/wrong tasks in English, Hindi and Punjabi,
  with numerical working and five unique options. All eight wrong-term error
  positions and all three existing missing positions remain covered.
- The existing eight-term wrong-item policy and unique-repair rejection remain
  in force. The two Prelims-backed additions are excluded from the existing
  bounded twelve-grammar Mains selector.

The existing BNS CI test automatically covers every advanced grammar. New
known-answer source fixtures and the exact-source ambiguity regression are
included in that blocking test. Existing review-only lifecycle restrictions
and the user's deferred live verification remain unchanged.

## Validation result

PASS: 4,572 English questions, 7,104 Hindi/Punjabi
questions, 288 targeted Mains checks, 22 source numeric fixtures and
132 malformed-number rejection cases. All added families passed 64 seeds per
task, deterministic replay, independent verification, answer-position coverage
and missing/error-position coverage. Scoped strict runtime TypeScript and patch
hygiene passed. The proof JSON records per-family coverage.
