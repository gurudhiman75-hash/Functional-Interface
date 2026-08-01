# RNK-CP-001 — One-Person Rank Arithmetic

Status: **executable discovery; six provisional prototypes; zero permanent QLs**.

## Purpose

Establish the shared normalized rank state, deterministic valid-state construction, canonical solver, materially separate independent verifier, misconception-owned options and learner-facing teaching contract for direct one-person ranking questions.

## Provisional prototypes

```text
RNK-CP001-PROT-OPPOSITE-END-RANK
RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS
RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK
RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK
RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE
RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL
```

The six identities are implementation probes. They are not permanent QLs and may merge after source, inverse and representation audits.

## Structural invariants

For total `N` and target position `r` from the start:

```text
rank from end = N - r + 1
before count  = r - 1
after count   = N - r
N             = rank from start + rank from end - 1
```

Every generated state is constructed validly before learner evidence is rendered.

## Contexts

The same normalized state supports:

- merit list: top / bottom;
- horizontal row: left / right;
- queue: front / back.

Context is a presentation parameter. It does not create a new solver authority.

## First-wave proof target

The executable audit must prove:

- deterministic replay for every prototype and seed;
- canonical and independent solver agreement;
- valid range and invariant preservation;
- all three presentation contexts;
- boundary and interior target positions;
- unique four-option construction;
- exactly one correct option;
- all four answer positions per prototype;
- Easy, Medium and Hard reachability;
- four-tier English explanations with concrete substitution;
- complete lifecycle locks.

## Safety boundary

```text
permanentQlId:              null
reviewStatus:               UNREVIEWED
questionStudioDiscoverable: false
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
```
