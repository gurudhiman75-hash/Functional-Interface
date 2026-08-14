# MEN-CP-010 — Permanent English Freeze V1

Authority: `MEN-CP010-PERMANENT-ENGLISH-FREEZE-V1`

## Decision

Freeze the reviewed English implementation for permanent QLs `MEN-002-QL-124..MEN-002-QL-149`.

This freeze applies to the English learner-facing contract only:

- permanent QL identity;
- template identity;
- solve-mode identity;
- representation routing;
- stem/editorial conventions;
- option semantics;
- verified answer;
- worked English explanation.

## Evidence inherited from the reviewed runtime

The pre-freeze runtime candidate was merged after:

- 26 permanent QLs;
- 1,664 deterministic runtime proof questions (`26 × 64`);
- all declared Wave 01–03 representation sources exercised;
- four answer positions demonstrated for every QL;
- 104 human-review records (`4 × 26`);
- exactly balanced review positions: `A=26, B=26, C=26, D=26`;
- four distinct review states per QL;
- required representation breadth in the review set;
- exam-style units and learner wording;
- natural capacity and percentage-change displays;
- simplified exact surds;
- state-specific worked calculations;
- production API build and repository regressions green.

## Freeze proof

`frozen-runtime-v1.test.ts` regenerates all `26 × 64 = 1,664` deterministic states through the frozen wrapper and requires:

- permanent QL/template/solve-mode parity;
- frozen English maturity and review status;
- mathematical verification;
- four unique options and exactly one correct option;
- all four correct-answer positions per QL;
- every declared representation source exercised;
- worked calculation present;
- the 104-question editorial audit remains green.

## Product boundary remains closed

English freeze is not product activation.

The following remain mandatory:

```text
active: false
questionStudioDiscoverable: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```

A later, separate activation gate must explicitly authorize Question Studio discovery / Question Bank writing / scored-test eligibility / publication.

## Resulting engineering state

```text
permanent identity:             FROZEN
solve mode:                     FROZEN
English implementation:         FROZEN
English review:                 APPROVED
Question Studio:                LOCKED
Question Bank:                  LOCKED
scored tests:                   LOCKED
public publication:             LOCKED
```
