# NUM-CP-003 — Divisibility and Missing Digits
## Gap Wave 03 — Arithmetic Evidence, Inclusion–Exclusion and Review Representations

**Status:** executable discovery candidate  
**Depends on:** green Waves 01–02  
**Temporary contracts:** 9  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Question Studio / Question Bank / tests / public:** disabled

Wave 03 expands task direction, multi-answer counting and review-oriented representations. Its temporary contracts are evidence for later merge/split decisions, not a production inventory.

## 1. Temporary contracts

### 1.1 Missing digit in a difference

The exact subtraction result and a divisibility condition must agree.

### 1.2 Missing digit in a product

The exact multiplication result and a divisibility condition must agree.

Both arithmetic-result contracts are intentionally isolated for source review. They may later merge with the Wave 02 addition-result form as operation parameters if the solve and misconception contracts remain materially shared.

### 1.3 Count all ordered two-digit pairs

Counts the complete intersection of two divisibility-rule solution sets rather than returning one ordered pair.

### 1.4 Count divisible by either of two divisors

Uses inclusive range counts and subtracts the LCM overlap once.

### 1.5 Count divisible by neither divisor

Uses the complement of the two-divisor union inside an inclusive interval.

### 1.6 Count divisible by exactly one divisor

Removes the common-multiple overlap from both initial sets.

The three range predicates intentionally share one exact state engine. Later merge/split review will determine whether answer predicate is a parameter or a QL boundary.

### 1.7 Missing-digit data sufficiency

Computes the complete candidate set from each divisibility statement separately, then classifies:

- Statement I alone;
- Statement II alone;
- both together only;
- even together insufficient.

This is a representation contract layered on proven missing-digit mathematics. It creates no new numerical solver authority automatically.

### 1.8 Guaranteed divisor of a power difference

Uses the identity that `a^n − b^n` contains the factor `a − b`.

Ownership remains provisional between:

- CP-003 algebraic divisibility;
- CP-008 modular arithmetic;
- Algebra when the identity rather than number-theory inference dominates.

### 1.9 Divisibility claim verification

Selects the only true positive or negative divisibility statement after exact remainder checks.

This tests statement representation and negative-claim semantics without exposing internal IDs or trusting surface digit heuristics.

## 2. Exact verification routes

| Contract | Canonical route | Independent route |
|---|---|---|
| result digit in difference/product | construct exact arithmetic result and hide one digit | reconstruct complete arithmetic equality from visible operands |
| ordered-pair count | filtered divisibility search | independent complete 10 × 10 enumeration |
| either/neither/exactly one | floor counts plus LCM inclusion–exclusion | direct bounded predicate enumeration |
| data sufficiency | candidate-set cardinality logic | independent substitution of X = 0 through 9 for both statements |
| power difference | factor identity `a^n − b^n = (a−b)(...)` | exact BigInt evaluation and option divisibility |
| claim verification | assertion/remainder comparison | exact remainder calculation for every displayed claim |

## 3. Proof contract

```text
9 temporary contracts × 100 seeds = 900 deterministic packages
```

Required:

- deterministic replay;
- canonical/verifier agreement;
- four unique options;
- all four answer positions for every contract;
- Easy, Medium and Hard reach;
- five answer semantics;
- all four data-sufficiency result classes;
- value-specific option diagnostics;
- permanent QLs: 0.

Structural review:

```text
9 × 60 = 540 packages
```

Review export:

```text
9 × 3 = 27 English questions
```

## 4. Provisional merge and ownership hypotheses

```text
subtraction/product result digit
→ likely merge with addition-result operation parameter

range either/neither/exactly-one
→ likely one inclusion–exclusion authority with target predicate parameter,
   subject to explanation and misconception audit

data sufficiency
→ representation adapter over approved missing-digit authorities

power-difference guaranteed divisor
→ hold for CP-003/CP-008/Algebra ownership audit

claim verification
→ likely statement representation over direct divisibility authority
```

## 5. Remaining gaps after Wave 03

NUM-CP-003 is still open. Remaining work includes:

- primitive divisibility-rule recognition and reverse rule selection;
- two-digit pair set and possible/impossible semantics;
- missing digit in division or exact quotient evidence where source-backed;
- algebraic repeated blocks and concatenation identities;
- power-sum divisibility and parity conditions;
- three-divisor inclusion–exclusion where exam-realistic;
- hidden-divisor reconstruction;
- table and mini-caselet representations;
- source saturation and complete legacy fixture disposition;
- cross-CP ownership reconciliation;
- final checkpoint-wide merge/split audit.

No permanent ID allocation is authorised by this wave.
