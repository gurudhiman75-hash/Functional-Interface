# COD-001 Evidence-Led QL Discovery Amendment

Status: **authoritative identity and future-expansion policy for COD-001**.

This document supersedes fixed allocations in legacy COD-001 design documents wherever they prescribe chapter totals, QL counts, ranges, rule-family counts or difficulty quotas before exhaustive discovery.

## 1. Stable implemented authority

The following permanent English identities are authoritative:

- `COD-CP-001`: `COD-QL-001` through `COD-QL-024`;
- `COD-CP-002`: `COD-QL-025` through `COD-QL-052`;
- `COD-CP-003`: `COD-QL-053` through `COD-QL-080`;
- `COD-CP-004`: `COD-QL-081` through `COD-QL-112`;
- `COD-CP-005`: `COD-QL-113` through `COD-QL-136`;
- `COD-CP-006`: `COD-QL-137` through `COD-QL-168`;
- `COD-CP-007`: `COD-QL-169` through `COD-QL-172`, governed by `COD-001-MANIFEST-AMENDMENT-CP007.md`;
- `COD-CP-008`: `COD-QL-173` through `COD-QL-174`, governed by `COD-001-MANIFEST-AMENDMENT-CP008.md`;
- `COD-CP-009`: `COD-QL-175` through `COD-QL-198`, governed by `COD-001-MANIFEST-AMENDMENT-CP009.md`;
- `COD-CP-010`: `COD-QL-199`, governed by `COD-001-MANIFEST-AMENDMENT-CP010.md`.

These **199 IDs** must not be reassigned.

## 2. Revoked legacy reservations

The following old reservations are not authoritative:

- `COD-CP-007` as 24 QLs or `COD-QL-169..192`; its actual allocation is four QLs ending at 172;
- `COD-CP-008` as 16 QLs or `COD-QL-193..208`; its actual allocation is two QLs ending at 174;
- `COD-CP-009` as 32 QLs or `COD-QL-209..240`; its actual allocation is 24 QLs ending at 198;
- `COD-CP-010` as 20 QLs or `COD-QL-241..260`; its actual allocation is one QL ending at 199;
- the chapter total of exactly 260 QLs;
- the chapter total of exactly 54 rule families;
- fixed checkpoint difficulty quotas derived from those counts.

Checkpoint numbering and scope boundaries remain valid. Only premature count and identity allocation is revoked.

## 3. Current English implementation frontier

```text
Stable permanent range: COD-QL-001..199
Permanent English QLs: 199
Implemented checkpoints: COD-CP-001..010
Next automatically available identity: none
```

The evidence-backed English checkpoint implementation closes at `COD-QL-199`. `COD-QL-200` is not reserved or automatically available.

## 4. Governing rule for any future expansion

A future COD-001 QL may be proposed only after all of the following complete:

1. new direct recurring exam-source evidence;
2. concept and source-format audit;
3. task-direction and inverse-contract audit;
4. answer-semantics audit;
5. edge-case and ambiguity audit;
6. representation and renderer audit;
7. solve-mode prototype audit;
8. merge/split audit proving material distinction from all 199 existing QLs;
9. chapter ownership and collision audit;
10. a new versioned discovery freeze;
11. an explicit manifest amendment authorising the new identity.

Implementation convenience, extra contexts, static renderer differences, action parameters and difficulty quotas are not sufficient grounds for a new QL.

## 5. Prototype identity policy

Any future candidate must use a non-permanent prototype ID until its new freeze is approved. Prototype IDs are not QLs, are not discoverable in Question Studio and may be merged, split, renamed or removed without migration.

## 6. Difficulty policy

Difficulty is calculated from generated instance properties. Coverage is measured rather than preallocated. No QL is created merely to satisfy a percentage target.

## 7. Freeze effect

The old 260-QL chapter is permanently revoked. The current evidence-backed English implementation contains **199 QLs**, subject to chapter-wide saturation, editorial and multilingual review before publication. Any later scope expansion must follow Section 4 and cannot silently extend the current range.
