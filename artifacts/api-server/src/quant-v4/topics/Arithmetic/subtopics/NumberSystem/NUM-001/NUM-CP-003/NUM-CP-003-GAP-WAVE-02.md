# NUM-CP-003 — Divisibility and Missing Digits
## Gap Wave 02 — Direct, Inverse, Set and Range Expansion

**Status:** executable discovery candidate  
**Depends on:** green Wave 1 prototype foundation  
**Temporary contracts:** 9  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Question Studio / Question Bank / tests / public:** disabled

This wave expands the checkpoint after the architecture-establishing foundation. Its nine temporary contracts are a gap set, not a quota or final checkpoint inventory.

## 1. Temporary contracts

### 1.1 Complete set of valid missing digits

Returns every digit that makes the displayed numeral divisible.

Material distinction from the Wave 1 count task:

- answer semantic is a digit set, not a count;
- distractors can omit a valid member, include an invalid member or stop at the first success;
- correctness requires exact set equality.

### 1.2 Leading missing digit

Reconstructs a unique leading digit while enforcing the n-digit boundary.

Material distinction:

- digit domain is 1–9 rather than 0–9;
- zero is a semantic invalidity even if a divisibility test were otherwise considered;
- the explanation must teach the leading-zero restriction explicitly.

### 1.3 Two missing digits without an explicit sum relation

Finds the unique ordered pair satisfying two divisibility rules.

Material distinction:

- no auxiliary `X + Y` relation is supplied;
- the complete 100-pair domain must be searched or reduced by divisibility logic;
- swapped positions and one-rule-only candidates are distinct traps.

### 1.4 Missing digit in an arithmetic result

A displayed addition contains one missing result digit, and the completed result must also satisfy divisibility.

Material distinction:

- exact column arithmetic and divisibility provide two independent evidence paths;
- carry into the hidden place is part of the state;
- an answer that satisfies a digit rule but not the stated arithmetic is invalid.

### 1.5 Least repeated-1 length

Finds the shortest repunit divisible by a stated divisor.

Provisional ownership note:

- the visible task is divisibility of a repeated-digit numeral;
- the efficient solver is a remainder recurrence;
- final merge/split audit may reassign the solve authority to modular/cyclicity ownership while preserving the source fixture exactly once.

### 1.6 Divisibility of a power expression

Selects the only displayed divisor of `a^n − 1` or `a^n − a`.

Provisional ownership note:

- the student task is divisibility of an expression;
- modular exponentiation is the efficient method;
- final ownership may merge with NUM-CP-008 if the modular engine rather than the divisibility presentation is decisive.

### 1.7 Count multiples in an inclusive interval

Counts all numbers divisible by one divisor between two inclusive endpoints.

Material distinction:

- answer semantic is a range count;
- the canonical route uses cumulative floor counts;
- the verifier enumerates the bounded interval independently.

### 1.8 Count numbers divisible by one divisor but not another

Counts the required divisor’s multiples after removing only common multiples.

Material distinction:

- requires overlap removal by LCM;
- subtracting every multiple of the excluded divisor is a specific misconception;
- cross-checks the boundary between divisibility and HCF/LCM support without creating duplicate HCF/LCM ownership.

### 1.9 Greatest n-digit multiple

Finds the nearest multiple at or below the upper n-digit boundary.

Material distinction from the Wave 1 least-number task:

- optimisation direction is reversed;
- the next multiple must be proved outside the upper boundary;
- the upper rather than lower digit boundary is authoritative.

## 2. Exact generation and verification

| Contract | Canonical construction | Materially separate verification |
|---|---|---|
| complete digit set | divisibility helper over the digit domain | exact set reconstruction from all substitutions |
| leading digit | valid-state construction with 1–9 domain | independent 1–9 enumeration |
| two digits, no sum | filtered pair construction | complete 10 × 10 search |
| result digit | construct exact sum and hide one digit | reconstruct the exact visible addition result |
| repunit length | remainder recurrence | test every shorter repunit and the answer exactly |
| power expression | exact BigInt state with one true option | exact divisibility of every displayed divisor |
| interval multiple count | floor-count formula | direct bounded enumeration |
| one but not another | count first-divisor set minus LCM overlap | direct bounded predicate enumeration |
| greatest n-digit multiple | subtract upper-bound remainder | decrement from the upper boundary until divisible |

## 3. Proof matrix

The dedicated Wave 2 proof must run:

```text
9 temporary contracts × 100 seeds = 900 deterministic packages
```

Required outcomes:

- exact deterministic replay;
- canonical and independent answer agreement;
- four unique options;
- one correct option;
- all four answer positions for every contract;
- Easy, Medium and Hard reach;
- seven answer semantics;
- no permanent QLs;
- no lifecycle leakage.

Structural/editorial audit:

```text
9 temporary contracts × 60 seeds = 540 packages
```

Required outcomes:

- nine hidden-state topologies;
- at least sixteen misconception labels;
- value-specific diagnostics for every option;
- three-step minimum solution and three task-specific traps;
- no learner-facing temporary IDs, placeholders, non-finite values or control characters.

Review export:

```text
9 contracts × 3 seeds = 27 English questions
```

## 4. Remaining checkpoint gaps after Wave 02

Wave 02 still does not close NUM-CP-003. Later discovery must investigate:

- primitive divisibility-rule selection and reverse rule identification;
- missing digit in subtraction and multiplication;
- two missing digits with multiple valid pairs, count/set and impossible semantics;
- divisibility of long concatenations and algebraic repeated blocks;
- direct guaranteed divisors of power sums and differences;
- count divisible by one or more using inclusion–exclusion;
- count divisible by neither or exactly one condition;
- hidden divisor reconstruction;
- divisibility claim verification and statement combinations;
- data sufficiency and table/caselet representations;
- uploaded-source saturation and legacy fixture reconciliation;
- merge/split and CP-008/CP-006 ownership closure.

No permanent `NUM-QL-*` allocation is permitted after this wave.
