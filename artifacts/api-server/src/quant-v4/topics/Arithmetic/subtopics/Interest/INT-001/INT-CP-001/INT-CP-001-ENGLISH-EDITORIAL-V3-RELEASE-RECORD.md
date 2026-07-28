# INT-001 / INT-CP-001 English Editorial V3 Release Record

Release ID: `INT-CP-001-EN-v3`  
Editorial standard: `FOUR_TIER_GOLD_V3`  
Mathematical baseline: `INT-CP-001-EN-v1`  
Supersedes editorial presentation: `INT-CP-001-EN-v2`  
Permanent QL range: `INT-QL-001..INT-QL-021`  
Status: **FROZEN_ENGLISH_CONTRACT — ENGLISH EDITORIAL APPROVED; UNPUBLISHED**

## Approval

English editorial approval was granted by the project owner on **2026-07-28**.

Approval covers:

- the 21-QL English mathematical inventory;
- the `FOUR_TIER_GOLD_V3` learner presentation;
- inline and display MathJax conventions;
- Indian currency grouping;
- exam-speed shortcuts;
- contextualised English stems;
- distractor explanations and misconception alignment.

Approval does **not** activate Question Bank storage, test eligibility, public publication or Question Studio routing. Hindi and Punjabi parity remain separate downstream gates.

## Scope

This release changes learner-facing English presentation only. It does not change:

- the 21 permanent Question Logics;
- any canonical solver or independent verifier;
- generated numerical states;
- exact correct answers;
- misconception ownership;
- option-position rotation;
- chapter ownership boundaries;
- publication, Question Bank, test or Question Studio eligibility.

## V3 improvements

V3 closes the final student-experience findings from the adversarial editorial audit:

1. raw ASCII fractions in learner prose are converted to inline MathJax;
2. indexed variables such as `t₁`, `t₂`, `A₁` and `A₂` use MathJax notation;
3. mixed fractions in stems, options and explanations use `\frac{}` rendering;
4. formula-like expressions such as `I/P`, `A/P`, `RT/100` and `I/(PT)` are rendered mathematically;
5. generic textbook openings are replaced by light exam-realistic fixed-deposit, term-deposit, savings-certificate or business-investment contexts;
6. transformed option text remains exactly synchronised with distractor analysis and misconception IDs.

## Exact proof

Validated code head:

`29c7d88e8eeeb1e9fe3ceed0c0cfa198a3659481`

Workflow:

```text
Validate INT-CP-001 final closure and freeze
Run:        30335946121
Conclusion: PASS
```

Evidence artifact:

```text
Artifact ID: 8679116461
Digest: sha256:af014bcde6797c4e9e7c517a94ddb06633f68afaaf8e0b0e19caae0df91d6718
```

## Exhaustive editorial audit

```text
21 QLs × 80 seeds = 1,680 final English packages
```

Observed:

```text
Four-tier packages:             1,680
Shortcut narratives:           1,680
Shortcut display equations:    1,680
Inline-MathJax packages:       1,680
Distractor analyses:           5,040
Generic textbook openings:         0
Fractional-money options:          0
Ungrouped currency findings:       0
Internal learner leaks:            0
```

All foundation, wave-02 and closure adapters passed. Every QL retained all four correct-answer positions and the previously frozen diversity guarantees.

## Lifecycle boundary

Every V3 package remains:

```text
maturity:                    FROZEN_ENGLISH_CONTRACT
reviewStatus:                FROZEN_ENGLISH_CONTRACT
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
questionStudioDiscoverable:  false
```

The English package is approved for downstream localisation and release preparation. Live deployment still requires Hindi/Punjabi parity, explicit publication-state changes and routing activation.