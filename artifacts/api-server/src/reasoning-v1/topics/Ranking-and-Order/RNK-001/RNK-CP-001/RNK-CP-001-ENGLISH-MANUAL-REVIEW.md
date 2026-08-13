# RNK-CP-001 — English Manual Review

Status: **approved for English discovery freeze; release surfaces remain locked**.

Review date: `2026-08-02`  
Review corpus: `54` questions (`9 authorities × 6 samples`)  
Full reviewed runtime: `2,880` questions (`9 authorities × 320 seeds`)

## Approval scope

The manual review covered every question in the final 54-record authority corpus, including stems, options, answer position, governing rule, worked steps, exam-speed shortcut, option diagnostics and conclusion.

Approved contexts:

- merit list;
- horizontal row;
- queue.

Approved answer semantics:

- rank;
- count;
- total.

This approval is English-only. It does not approve Hindi, Punjabi, Question Studio, Question Bank, mock tests or public publication.

## Review findings and remediation

The review rejected and remediated all observed learner-facing defects before approval:

- generic `people/person` wording inside merit-list questions;
- repeated formula-only rules, shortcuts and conclusions;
- `0 people are` and `1 people are` number agreement;
- sentence-initial and lowercase `one candidate/person are` agreement;
- accidental lowercasing of proper names;
- awkward possessive order such as `name's from-the-left rank`;
- bare rank results such as `gives 34 from the top`;
- mechanical zero/one edge explanations;
- raw `x` and `/` arithmetic notation;
- internal misconception identifiers in learner text.

The final reviewed layer preserves answers, options, evidence, normalized state, mathematical fingerprint and lifecycle fields exactly while changing learner-facing text only.

## Final evidence

```text
GitHub head:                 0593d2267d1f685d02c76b630d317de461b5c621
RNK workflow run:            30748612950
RNK workflow conclusion:     PASS
Artifact:                    8833703487
Artifact digest:             sha256:09869b6eedde47c59ac44ed6e08fadb1746a9750f0a7794784fb036fafa6222d
Reviewed projection digest:  sha256:c927dfb888a0a49666df1d14ab660360be84516f3c24a96e835d314c944e5597
```

The reviewed projection digest covers authority ID, seed, source provenance, stem, options, answer, correct index, explanation and mathematical fingerprint for all 54 approved questions.

## Manual verdict

```text
questions reviewed:             54 / 54
questions approved:             54 / 54
open English editorial blockers:     0
open CP-001 source dimensions:        0
provisional authorities:              9
permanent QLs before freeze:          0
verdict: APPROVED_FOR_ENGLISH_DISCOVERY_FREEZE
```

No production or learner delivery permission is granted by this approval.