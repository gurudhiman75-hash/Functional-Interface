# MAL-CP-003 Wave 04 — Source Contract Recovery

Status: **open discovery; authoritative as source-recovery evidence only**.

This wave does not allocate permanent `MAL-QL-*` identities, freeze solve modes, activate Question Studio delivery, or make any prototype publicly publishable.

## Direct source recovery

The uploaded 2017 revised and enlarged edition of R.S. Aggarwal's *Quantitative Aptitude for Competitive Examinations* supplies direct repeated-replacement evidence in two chapter locations:

- *Alligation or Mixture*, printed page 636, question 17: final original-liquid quantity after three equal remove-and-refill operations.
- *Ratio and Proportion*, printed page 453, question 242: final new-liquid:original-liquid ratio after equal repeated replacement.
- *Ratio and Proportion*, printed page 453, question 243: original vessel capacity reconstructed from a final original-liquid:new-liquid ratio after four equal replacements.

Existing ExamTree RAP-CP-017 review artifacts independently preserve:

- `RAP-QL-1101`: final original:new-liquid ratio;
- `RAP-QL-1102`: final original-liquid quantity with an explicit decimal-display contract.

## Newly recovered candidate contracts

```text
MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS
MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO
```

These are source-backed executable fixtures, not permanent QLs.

### Final ratio contract

The hidden state is mathematically equivalent to final original quantity and final original fraction, but the answer contract is different:

- output is an ordered ratio;
- ratio parts must be reduced;
- orientation is significant;
- `original:new liquid` and `new liquid:original` are different answers.

Therefore this candidate must remain distinct until the final representation merge/split audit decides whether answer semantics justify a separate QL.

### Vessel-volume inverse contract

The final evidence is supplied as a component ratio rather than as a final component quantity. The unknown is the original vessel capacity. This is a materially different inverse reconstruction surface and remains distinct pending full source and pedagogy audit.

## Ownership boundaries locked by source

### MAL-CP-002

A single homogeneous remove-and-refill operation used to reach a target two-component ratio remains owned by MAL-CP-002. The relevant source surfaces are the single-stage target-ratio questions adjacent to the repeated-replacement questions in the uploaded chapter.

### MAL-CP-004

When the replacement liquid has its own non-zero concentration, the state transition is conserved-solute mixing rather than pure geometric retention. That family is owned by MAL-CP-004.

## Display policy recovered

1. Exact terminating decimals remain decimals rather than being converted to mixed fractions.
2. An explicit two-decimal instruction must preserve trailing zeros, for example `72.90`.
3. Non-terminating exact values remain fractions unless the stem explicitly declares a rounding policy.
4. Ratio answers use reduced integer parts and preserve requested orientation.

## Freeze status

```text
Permanent QLs: 0
Frozen solve modes: 0
Question Studio exposure: disabled
Question Bank eligibility: disabled
Test eligibility: disabled
Public publication: disabled
Freeze readiness: false
```

The next required gates are broader source recovery, learner-contract merge/split review, misconception audit, approximation-policy coverage, and final chapter ownership closure.
