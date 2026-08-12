# NUM-CP-007 — Successive Division Ownership Amendment

**Status:** checkpoint-local design amendment  
**Reason:** source-backed SSC/RRB/reference fixtures proved a recurring family that was narrower than CP-008 but broader than the original “one-stage” wording for CP-007.

## Superseding ownership sentence

For `NUM-CP-007`, replace the narrow interpretation of:

> one-stage reconstruction and compatible propagation

with:

> **single-state division-lemma reconstruction and multi-stage successive quotient division when every stage is repeated application of the same division identity `N_i = d_i N_{i+1} + r_i`, with `0 <= r_i < d_i`.**

This amendment permits:

- reconstruction of the original number from successive quotient divisions;
- product-modulus remainder derived from a successive chain;
- reversing the order of successive divisors after reconstructing the common original number;
- finite multi-stage chains using only ordinary integer division at each stage.

It does **not** permit CP-007 to absorb:

- independent simultaneous congruences under unrelated moduli;
- CRT-style combination of independently specified residue classes;
- incompatible-modulus inference;
- large-power or theorem-led modular arithmetic.

Those remain `NUM-CP-008` (or `NUM-CP-009` when the final target is terminal digits).

## Rationale

The essential distinction is state topology:

```text
Successive division owned by CP-007:
N0 = d1*N1 + r1
N1 = d2*N2 + r2
N2 = d3*N3 + r3
```

Each later dividend is the quotient produced by the preceding stage.

By contrast, independent congruences owned by CP-008 have the form:

```text
N ≡ r1 (mod d1)
N ≡ r2 (mod d2)
...
```

where each condition constrains the same original number independently.

## Executable evidence

Wave 04 provides:

- `NUM-CP007-PROT-027` — reconstruct original number / product-modulus remainder from a successive chain;
- `NUM-CP007-PROT-028` — reverse the order of successive divisors and derive the new remainder sequence.

Both are proposed to merge into one permanent solve authority because they share the same repeated division-lemma state and differ only by target projection / re-application order.

No permanent QL is allocated by this amendment.
