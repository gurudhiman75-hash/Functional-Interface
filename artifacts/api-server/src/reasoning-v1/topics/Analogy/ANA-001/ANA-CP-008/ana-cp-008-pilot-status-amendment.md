# ANA-CP-008 Pilot Status Amendment

Status: **GREEN NON-QL PILOT — ALLOCATION DISCOVERY IN PROGRESS**

This amendment supersedes stale current-status blocks in:

- `ana-cp-008-end-to-end-design.md`;
- `ana-cp-008-source-saturation.md`;
- the earlier current-stage section of `ana-cp-008-implementation-plan.md`.

It does not replace their ownership principles or historical source reasoning.

## 1. Current merged proof

The merged ANA-CP-008 pilot now contains:

```text
Typed token kinds: 7
Provisional runtime rule IDs: 12
Provisional contexts: 81
Exact source fixtures: 23
Mechanically proven presentation modes: 3
Permanent QL count: OPEN
Permanent solve-mode count: OPEN
Public production runtime: NONE
```

Typed token kinds:

```text
LETTER
LETTER_GROUP
NUMBER
LETTER_NUMBER
NUMBER_LETTER
CLUSTER_NUMBER
NUMBER_CLUSTER
```

## 2. Green validation gates

The dedicated CP-008 workflow currently proves:

- strict TypeScript over the complete pilot;
- canonical token parsing and round trips;
- signed whole-number support;
- exact number-first and cluster-first token ordering;
- replay of all 23 exact source fixtures;
- independent-solver agreement for every context;
- at least 40 uniquely matched source-target pairs per context;
- four canonical direct-completion options with exactly one correct answer;
- direct-completion presentation yield;
- equivalent-pair-selection presentation yield;
- odd/incorrect-pair presentation yield.

The latest root-and-token-order proof merged through PR #170.

## 3. Proven operational inventory

Current source-backed pilot authorities include:

1. ordinary-position sum/product from letter group to scalar;
2. ordinary-position sum rendered as a letter;
3. single-letter alphabet-position square;
4. independent single-letter shift plus fixed whole-number add/subtract;
5. shared signed delta across a cluster and number;
6. independent two-letter vector plus fixed signed number delta;
7. two-letter vector plus exact integer/rational multiplier;
8. two-letter vector plus direct cube or perfect-square-to-cube transform;
9. two-letter vector plus exact cube root of `n+1`;
10. number-letter digit-sum-square successor invariant;
11. number-first cluster vector plus exact multiplier;
12. number-first cluster vector plus exact square root of `n+1`.

The runtime-rule list is not the permanent solve-mode list. The operation-by-task allocation matrix records the required split/merge analysis.

## 4. Presentation status

### Direct completion

Status: **source-backed and mechanically proven**.

Eligible for permanent allocation discovery.

### Odd/incorrect pair selection

Status: **source-backed by recurring mixed exam forms and mechanically proven**.

Eligible for permanent allocation discovery after fixture-level editorial review.

### Equivalent-pair selection

Status: **mechanically proven but exact official mixed fixture still pending**.

Remain pilot-only. Do not allocate permanently yet.

### Inverse and double-missing tasks

Status: **deferred**.

No permanent allocation.

## 5. Explicit ownership boundaries retained

Still delegated or excluded:

- pure letter rules to CP-005/006;
- pure number analogies to numeric analogy checkpoints;
- meaningful word-value rules to CP-007 or Coding-Decoding by framing;
- direct code-system recovery to Coding-Decoding;
- long mixed-string navigation to Alphanumeric Series;
- pair-index-dependent progressive mixed vectors to CP-009;
- unrestricted equations inferred from one pair.

## 6. Remaining source gaps

No permanent context currently exists for:

- reverse-position aggregates;
- letter-pair absolute difference or gap;
- generic number-to-letter mapping;
- letter-driven numeric formulas;
- number-driven letter movement;
- unrestricted coupled invariants;
- inverse/double-missing mixed tasks.

These remain deferred unless recurring readable evidence and collision-safe runtime contracts are recovered.

## 7. Current stage

```text
Stage 0 — source recovery: partially blocked by File Library retrieval error
Stage 1 — typed token foundation: complete for pilot
Stage 2 — arithmetic/alphabet foundation: complete for admitted pilot contexts
Stage 3 — provisional rule inventory: complete for current evidence
Stage 4 — independent solver/matcher: complete for pilot
Stage 5 — cross-topic bridges: incomplete
Stage 6 — context yield: green for 81 contexts
Stage 7 — direct option yield: green for 81 contexts
Stage 8 — presentation yield: green for 3 modes across 81 contexts
Stage 9 — operation/task allocation discovery: in progress
Stage 10 — permanent manifest and production runtime: not started
```

## 8. Next required work

1. use the operation-by-task matrix to draft candidate language-template units without IDs;
2. build cross-check bridges against CP-005, CP-006, numeric analogy, CP-007, and Coding-Decoding;
3. perform a final source-gap and CP-009 ownership audit;
4. define misconception ownership per candidate solve contract;
5. prototype English stems and explanations;
6. test Hindi and Punjabi structural naturalness;
7. decide whether token-order variants need separate QL templates;
8. recover or formally supersede the unavailable audited manifest;
9. propose IDs and counts only after all gap audits are clean.

## 9. Safety boundary

The pilot remains non-public and non-production:

```text
no permanent QL IDs
no solve-mode freeze
no production generator
no Question Studio routing
no admin publishing
no mock-test publishing
no public endpoint
```
