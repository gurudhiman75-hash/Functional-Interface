# COD-001 Open QL Discovery Amendment

Status: **authoritative amendment for all unfinished COD-001 checkpoints**.

This document supersedes the fixed future allocations in `cod-001-chapter-manifest.md`, `cod-001-consolidated-design.md`, `cod-001-implementation-plan.md`, and old status documents wherever they prescribe a fixed chapter total, future QL counts, future QL ranges or difficulty counts before exhaustive discovery.

## 1. Stable implemented authority

The following merged identities are permanent:

- `COD-CP-001`: `COD-QL-001` through `COD-QL-024`;
- `COD-CP-002`: `COD-QL-025` through `COD-QL-052`;
- `COD-CP-003`: `COD-QL-053` through `COD-QL-080`;
- `COD-CP-004`: `COD-QL-081` through `COD-QL-112`;
- `COD-CP-005`: `COD-QL-113` through `COD-QL-136`;
- `COD-CP-006`: `COD-QL-137` through `COD-QL-168`;
- `COD-CP-007`: `COD-QL-169` through `COD-QL-172`, governed by `COD-001-MANIFEST-AMENDMENT-CP007.md`;
- `COD-CP-008`: `COD-QL-173` through `COD-QL-174`, governed by `COD-001-MANIFEST-AMENDMENT-CP008.md`.

These 174 IDs must not be reassigned.

## 2. Revoked future reservations

The following old reservations are not authoritative:

- `COD-CP-007` as 24 QLs or `COD-QL-169..192`; its actual frozen allocation is four QLs ending at 172;
- `COD-CP-008` as 16 QLs or `COD-QL-193..208`; its actual frozen allocation is two QLs ending at 174;
- `COD-CP-009` as exactly 32 QLs or `COD-QL-209..240`;
- `COD-CP-010` as exactly 20 QLs or `COD-QL-241..260`;
- the chapter total of exactly 260 QLs;
- the chapter total of exactly 54 rule families;
- any fixed checkpoint difficulty quota derived from those counts.

Checkpoint numbering and scope boundaries remain valid. Only premature identity and count allocation is revoked.

The next available chapter identity is `COD-QL-175`.

## 3. Governing discovery rule

A future QL is created only after the checkpoint completes:

1. concept and source-format audit;
2. task-direction audit;
3. inverse-contract audit;
4. answer-semantics audit;
5. edge-case and ambiguity audit;
6. representation and renderer audit;
7. solve-mode prototype audit;
8. merge/split audit proving each surviving contract is materially distinct;
9. gap audit showing no meaningful uncovered contract;
10. collision audit against existing chapter ownership.

Counts remain open while any meaningful gap or duplicate contract is unresolved.

## 4. Identity policy during design and prototyping

Before freeze, candidate contracts use non-permanent prototype IDs such as:

```text
COD-CP009-PROT-EXACT-WORD-TO-TOKEN
COD-CP009-PROT-POSSIBLE-TOKEN
```

Prototype IDs are not QLs, are not discoverable in Question Studio, and may be merged, split, renamed or removed without migration.

Permanent `COD-QL-*` IDs are assigned sequentially from the next available chapter identity only after the checkpoint discovery audit is approved.

## 5. Out-of-order checkpoint work

A later checkpoint may be designed or prototyped before an earlier checkpoint, provided that:

- it creates no permanent QL IDs that pre-empt unknown earlier counts;
- it does not edit chapter-wide registries as though its range were frozen;
- it uses checkpoint-local prototype registries;
- it remains non-publishable and undiscoverable;
- final allocation waits for the chapter sequence.

CP-009 discovery is already frozen. Its permanent allocation must now begin at `COD-QL-175` and use its final 24-contract solve authority sequentially. CP-010 remains open until its own discovery freeze.

## 6. Difficulty policy

Difficulty is calculated from generated instance properties. During discovery, coverage is measured rather than preallocated. A checkpoint is accepted when its reachable instance space contains appropriate Easy, Medium and Hard cases; no QL is created merely to satisfy a percentage target.

## 7. Freeze effect

The COD-001 chapter is not frozen at 260 QLs. Its final count becomes authoritative only after CP-009 and CP-010 permanent implementation, CP-010 exhaustive discovery, and the chapter-wide gap audit complete.
