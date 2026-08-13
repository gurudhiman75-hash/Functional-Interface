# INT-CP-004 Hindi/Punjabi V6 Native V4 Approval Record

## Decision

The product owner explicitly approved the Hindi/Punjabi V6 Native V4 review surface on **2026-08-13** after requesting three editorial corrections to the prior V3 candidate:

1. learner mathematics must use MathJax/LaTeX-standard notation rather than ASCII formula notation;
2. Punjabi compound interest must use the approved learner term `ਮਿਸ਼ਰਤ ਵਿਆਜ`;
3. question stems must be slightly fuller and more natural for competitive-exam presentation rather than terse command-style prompts.

Approval authority: `EXPLICIT_PRODUCT_OWNER_APPROVAL_2026_08_13`.

## Approved authority

```text
Canonical English freeze: INT-CP-004-EN-v2-frozen
Native editorial version: INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v4
QL range:                 INT-QL-067..INT-QL-085
Locales:                  hi-IN, pa-IN
Approved content head:    38ad6fdd7cde2c155c2121fb554f9fa3d11016af
Approval record:          this file on the localisation branch
Workflow run:             31716094213 — PASS
Evidence artifact ID:     9187335552
Evidence digest:          sha256:a383c700b0cafa2ca63ccccaf56665913d55d1eb36e40fdd9e2b92f823b85934
```

## Exact-head proof

The approved content head passed the complete migration workflow and inherited isolation contract.

```text
Native V4 questions:             3,800
Hindi / Punjabi:                 1,900 / 1,900
Mathematical parity checks:     22,800
Punjabi terminology checks:      3,800
LaTeX formula checks:            3,800
LaTeX calculation checks:        3,800
Stem-readability checks:         3,800
Table/prose parity checks:       3,800
Lifecycle checks:               26,600
API build:                       PASS
CP-001 pre-registration:         PASS (run 31716094214)
```

The reviewed 76-question pack in each locale proves:

```text
prose / tables:                  66 / 10
formula-first:                   76 / 76
LaTeX formula-first:             76 / 76
direct command-style endings:     0
rejected Punjabi term:            0
answer positions:          19 / 19 / 19 / 19
```

## Frozen mathematical boundary

V4 is an editorial/native-language layer only. It preserves the frozen English V6 authority exactly for:

- permanent QL identity;
- mathematical state;
- canonical solution;
- option values and option order;
- correct option index;
- representation and stem-family identity;
- difficulty and misconception ownership;
- inactive delivery lifecycle.

## Approved learner standard

```text
Punjabi compound interest:  ਮਿਸ਼ਰਤ ਵਿਆਜ
Mathematics:                 MATHJAX_LATEX
Stem style:                  SLIGHTLY_WORDIER_EXAM_STYLE
Explanation order:           formula → conversion → substitution → calculation → answer
```

## Lifecycle boundary

Approval does **not** authorize merge, Question Studio registration, staging, Question Bank storage, test eligibility or public publication. The approved source remains inactive until a separate immutable multilingual freeze wrapper is proven.
