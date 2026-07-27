# COD-CP-007 — Uniform Modular Digit Translation Prototype Status

Status: **source-proven English prototype family saturated for its current five task contracts; checkpoint discovery remains open; no permanent QLs**.

This status does not freeze CP-007. It records executable evidence for the first admitted family only.

---

## 1. Implemented family

```text
UNIFORM_MODULAR_DIGIT_TRANSLATION
```

For every source digit `d` and non-zero shift `k`:

```text
encode(d) = (d + k) mod 10
decode(c) = (c - k) mod 10
```

Complete codes are ordered digit strings. Leading zeroes are preserved and no complete code is coerced into a number.

---

## 2. Non-permanent task contracts

1. explicit-rule target encoding;
2. inverse target decoding;
3. missing code-digit recovery;
4. infer-and-encode;
5. choose the matching complete code.

These are prototype IDs, not `COD-QL-*` records. Their final merge/split treatment remains open.

---

## 3. Mathematical proof

The 100-seed audit for each of the five contracts generated:

```text
Prototype contracts:       5
Seeds per contract:      100
Generated questions:     500
Distinct questions:      500
Distinct stems:          500
Permanent QLs:             0
```

Coverage reached:

```text
Leading zero in source:  140
Leading zero in code:    132
Repeated target digits:  401
Target with wrap:        370
Missing first position:   22
Missing middle position:  55
Missing final position:   23
```

Every prototype reached:

- all shifts `1..9`;
- all four answer positions;
- deterministic repeat generation;
- independent verifier agreement;
- three renderers;
- Easy, Medium and Hard instances across the family;
- four unique options with exactly one correct answer.

---

## 4. Ambiguity proof

Displayed evidence is accepted only when:

- exactly one non-zero uniform shift survives;
- a common whole-number delta does not explain all examples;
- reversal followed by a shift does not explain all examples;
- source/code lengths match;
- the intended forward and inverse results are unique.

A consistent arbitrary digit substitution can also describe the displayed pairs, but it is retained only as a more complex compatible model. The uniform translation is the canonical simplest source-backed rule.

---

## 5. Editorial proof

A second 500-question audit runs over the polished English runtime.

Normalised explanation skeletons:

```text
Explicit encode:          45
Inverse decode:           45
Missing token:            59
Infer and encode:         41
Choose matching code:     45
Cross-contract collisions: 0
```

Exact prose variation across 100 seeds:

| Task contract | Rule statements | Quick Methods |
|---|---:|---:|
| explicit encode | 31 | 31 |
| inverse decode | 36 | 36 |
| missing token | 25 | 35 |
| infer and encode | 33 | 66 |
| choose matching code | 35 | 44 |

The runtime also enforces:

- no “1 places” singular grammar drift;
- no internal prototype, registry, solver, parameter or fingerprint wording;
- two-part Reference Aid;
- task-specific Quick Method and proof path;
- option-specific Common Trap Alert;
- the exact correct answer in the conclusion.

---

## 6. Exact executable evidence

```text
Head SHA:        043e2d72bddf0bd37fc44423ccd0e47ecd88b9f3
Workflow:        Reasoning COD-001 CP-007 Uniform Digit Prototype
Run ID:          30290529549
Conclusion:      success
Audit artifact:  8662580302
Audit digest:    sha256:f60fcb2fcc231a092a70dcff997d8889967fc8092207ac1a5f5058d90cfe19ad
Review artifact: 8662581009
Review digest:   sha256:e7ab419e01f7b997d76c25c3e0b7e1f1d2547ce072e380ce4a54916cb6fa3768
COD runtime:     30290527792 — success
```

The integrated-admin workflow is independently red and is outside this checkpoint.

---

## 7. What is not frozen

The following still require targeted source and ownership work:

- arbitrary digit substitution;
- digit-to-symbol bijection;
- position-dependent digit transformation;
- pure digit permutation;
- alphanumeric dual-channel transformation;
- mixed-token substitution.

The five current task contracts also require a final checkpoint-wide merge/split audit after all source-backed families are known.

---

## 8. Safety boundary

- permanent CP-007 QLs: **0**;
- next available chapter ID: `COD-QL-169`, not reserved;
- Question Studio exposure: disabled;
- Hindi/Punjabi: not started;
- public publication: false.

Final verdict: **UNIFORM MODULAR DIGIT TRANSLATION PROTOTYPE SATURATED — CP-007 DISCOVERY REMAINS OPEN**.
