# NUM-CP-010 — Permanent Allocation and English Freeze

**Checkpoint:** `NUM-CP-010` — Digit Structure, Place Value and Number Reconstruction  
**Product-owner approval date:** 2026-08-22  
**Approved permanent authority count:** 16  
**Approved allocation:** `NUM-QL-197..212`  
**Next free Number System identity:** `NUM-QL-213`

## Approval authority

The product owner explicitly approved the final 16-authority CP010 merge/split after the exact-head source-saturation proof passed on `b83dc8baa1c3f8023b56e5533724a03658ab48ef`.

The approved allocation is:

| Permanent QL | Permanent authority | Source prototypes |
|---|---|---|
| NUM-QL-197 | Decimal place value — direct and inverse | P001, P009, P010 |
| NUM-QL-198 | Missing digit from digit aggregate | P002 |
| NUM-QL-199 | Number reversal / digit interchange reconstruction | P003, P004, P023 |
| NUM-QL-200 | Single-unknown column addition digit reconstruction | P005, P011 |
| NUM-QL-201 | Two-unknown column addition reconstruction | P020 |
| NUM-QL-202 | Column subtraction digit reconstruction | P006, P012 |
| NUM-QL-203 | Palindrome reconstruction | P007, P016 |
| NUM-QL-204 | Relational / consecutive digit reconstruction | P008, P024 |
| NUM-QL-205 | Least or greatest numeral under digit constraints | P013 |
| NUM-QL-206 | Complete valid digit/number set under decimal constraints | P014, P019 |
| NUM-QL-207 | Bounded digit-occurrence count | P015, P026 |
| NUM-QL-208 | Exact number of decimal digits | P017 |
| NUM-QL-209 | Digit-constraint solution multiplicity classification | P018 |
| NUM-QL-210 | Missing digit in multiplication with carry | P021 |
| NUM-QL-211 | Repeated decimal block / concatenation reconstruction | P022 |
| NUM-QL-212 | Digital root / repeated digit-sum reduction | P025 |

## Permanent runtime contract

The permanent English runtime is an identity/freeze adapter over the already-proven discovery generators. It does not replace their mathematics.

For merged authorities, permanent seeds rotate deterministically through every approved source prototype and maintain a separate source seed. Every generated package preserves the source verifier, mathematical fingerprint, options and worked explanation while adding permanent authority and QL identity.

## Lifecycle

The allocation/freeze does **not** activate delivery:

- `active: false`
- `questionStudioDiscoverable: false`
- `questionBankWritable: false`
- `testEligible: false`
- `publiclyPublishable: false`

Question Studio integration, Hindi/Punjabi localization, Question Bank writes, mock/test eligibility and public publication remain separate future gates.
