# MIS-CP-004 Implementation Status

Status: **EXECUTABLE PROTOTYPE / ENGLISH REVIEW CANDIDATE**

## Implemented scope

MIS-CP-004 implements the blueprint's consecutive and structured-number relations as provisional semantic families:

| Candidate | Provisional authority |
|---|---|
| MIS-CAND-026 | n(n+1) |
| MIS-CAND-027 | n(n−1) |
| MIS-CAND-028 | a(a+b) |
| MIS-CAND-029 | b(a+b) |
| MIS-CAND-030 | a(a−b), positive difference |
| MIS-CAND-031 | product of three consecutive numbers |
| MIS-CAND-032 | sum of three consecutive numbers |
| MIS-CAND-033 | triangular number n(n+1)/2 |
| MIS-CAND-034 | small n! factorial relation |

The generic blueprint phrases "consecutive products" and "consecutive sums" are represented by three-term consecutive structures so they do not merely duplicate n(n+1).

## Source-thin governance

The factorial family is marked `sourceThin: true`.

It exists because the approved blueprint explicitly includes small factorial-derived relations **where exam-supported**, but it must not become a permanent QL until source saturation confirms sufficient real-exam support.

## Generation model

Every item is constructed rule-first:

1. select a structured mathematical rule;
2. generate complete valid groups;
3. independently solve each group;
4. choose 2 evidence groups, adding a third only if needed;
5. enumerate all CP004 semantic competitors of the same arity;
6. reject ambiguity;
7. choose a target with enough misconception-grounded distractors;
8. hide only the verified result;
9. render the question and friendly value-specific explanation.

Outputs remain positive integers <= 999.

## Audit

The deterministic generator audit covers:

~~~text
9 candidates × 80 seeds = 720 generated questions
~~~

It verifies determinism, arity, result bounds, independent solver agreement, ambiguity rejection, option uniqueness, governed distractors, answer-position balance, numeric breadth, structural fingerprints, and friendly explanations.

The source-thin factorial family uses a lower diversity floor because only 3! through 6! stay inside the configured answer band.

## Question Studio lifecycle

This checkpoint remains:

- review-only;
- English only;
- provisional candidate identities;
- permanent QL count unchanged at 0;
- no Question Bank write eligibility;
- no mock/public release;
- no localization until English review/source saturation.

## Next checkpoint

After review approval, continue to **MIS-CP-005 — Triangle number figures**.
