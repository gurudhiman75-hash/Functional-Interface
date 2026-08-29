# NUM-CP-010 — Wave 00 Source and Ownership Register

**Checkpoint:** `NUM-CP-010`  
**Package:** `NUM-002`  
**Title:** Digit Structure, Place Value and Number Reconstruction  
**Status:** discovery open; permanent QL count not proposed  
**Permanent QL allocation:** none

## Primary invariant

Decimal positional equations plus exact digit/carry/borrow propagation.

A retained CP010 question must require ordinary base-10 digit structure as the main inference. Cosmetic digits do not make a question CP010.

## Retained source families

From the Number System source/legacy audit:

- `ns_sum_of_digits`
- `ns_digit_interchange`
- `ns_digit_constraints`
- `ns_unknown_digit_equation`
- `ns_digit_sum_reconstruction`
- `ns_consecutive_digit_number`
- source-backed number/reverse-number structures

Required source-gap discovery:

- place value and face/place-value distinction;
- decimal digit equations;
- two-digit and three-digit reversal/reconstruction;
- carry-driven addition reconstruction;
- borrow-driven subtraction reconstruction;
- palindrome reconstruction;
- bounded digit occurrence;
- exact number-of-digits tasks where no approximate logarithmic policy is required.

## Hard ownership boundaries

| Candidate | Owner | CP010 disposition |
|---|---|---|
| Missing digit whose admissibility is governed by divisibility | CP003 | Reassign |
| One-stage remainder/division reconstruction | CP007 | Reassign |
| Independent modular conditions | CP008 | Reassign |
| Unit/last-two/last-three digit of powers | CP009 | Reassign |
| Decimal reversal/interchange/place-value equation | CP010 | Retain |
| Carry/borrow reconstruction | CP010 | Retain |
| Count arrangements/form numbers from digit multiset | P&C | Reassign; CP010 may only validate a property |
| General linear equation with incidental digits | Algebra | Reassign |
| Non-decimal base conversion/validity/arithmetic | CP013 | Reassign |
| Coded number/symbol replacement | Reasoning | Reassign |
| Genuine multi-engine item where decimal digit structure and another engine are both necessary | CP014 candidate | Hold for ablation |

## CP003 collision rule

```text
Divisibility determines the missing digit → CP003
Column arithmetic or a decimal place-value equation determines the digit → CP010
Arithmetic leaves multiple candidates and divisibility is materially necessary → ownership audit / CP014 ablation
```

## CP009 collision rule

```text
Requested terminal digit(s) of a power/expression → CP009
Requested decimal digit relation/reconstruction of an ordinary numeral → CP010
```

## CP013 collision rule

```text
Ordinary decimal digit equation → CP010
Stated base is essential to value, validity or arithmetic → CP013
```

## Wave 01 retained prototypes

1. `NUM-CP010-PROT-001` — direct place value of a specified decimal digit.
2. `NUM-CP010-PROT-002` — missing digit from an exact digit-sum total.
3. `NUM-CP010-PROT-003` — two-digit number reconstruction from reverse difference + digit sum.
4. `NUM-CP010-PROT-004` — three-digit number reconstruction from reverse difference + outer-digit sum + middle digit.
5. `NUM-CP010-PROT-005` — missing units digit in exact column addition, with carry states sampled.
6. `NUM-CP010-PROT-006` — missing units digit in exact column subtraction with mandatory borrow.
7. `NUM-CP010-PROT-007` — four-digit palindrome reconstruction from symmetry + digit sum.
8. `NUM-CP010-PROT-008` — three-digit consecutive-digit reconstruction.

These are discovery identities only. They do **not** imply eight permanent QLs. Merge/split happens only after later waves, saturation, generated-corpus review and explicit count approval.

## Lifecycle

All Wave 01 packages are locked:

- `active = false`
- `questionStudioDiscoverable = false`
- `questionBankWritable = false`
- `testEligible = false`
- `publiclyPublishable = false`

No permanent ID is reserved. The chapter-wide next-free ledger remains governed outside this branch.
