# BLR-001 — Chapter-Wide English Gap Audit

Status: **executable audit implemented; exact-head validation and remediation pending**.

## Purpose

The end-to-end design contains seven content checkpoints. `BLR-CP-007` is the final planned content checkpoint; no `BLR-CP-008` is currently justified.

This phase audits the complete English chapter as one system before any manual English freeze:

```text
BLR-CP-001 through BLR-CP-007
BLR-QL-001 through BLR-QL-035
```

`BLR-QL-036` remains unallocated. A new QL or checkpoint may be created only if this audit or a later source audit proves a materially uncovered generator, solver, answer, ambiguity, explanation, localisation or renderer contract.

## Executable audit surface

The audit includes:

- all frozen CP-003, CP-004, CP-005, CP-006 and CP-007 records;
- deterministic permanent-runtime sweeps across every CP-001 and CP-002 QL;
- all 35 permanent solve-authority mappings;
- contiguous QL sequencing;
- exact cross-QL learner-surface collision checks;
- normalized cross-QL template-overlap reporting;
- option uniqueness, correct-index and answer parity;
- learner-facing internal-jargon and broken-render checks;
- explicit gender-evidence checks for gendered answers;
- name-based gender-stereotype phrase rejection;
- checkpoint ownership and authority parity;
- review-only lifecycle locks;
- included-source coverage and explicit out-of-scope boundaries.

The human-review exporter provides two deterministic questions per permanent QL, the full ownership matrix, scope coverage, failure list and machine-readable summaries.

## Included chapter scope

Covered:

- direct, reverse, multi-edge and exact-lineage named-person relations;
- generation, person, pair and claim queries;
- pointer, photograph, portrait, conversation and nested role chains;
- shared family passages and marital-status questions;
- closed-universe counts and composition profiles;
- exact, broad, definite, possible, impossible and indeterminate semantics;
- coded relation decoding;
- coded expression construction, completion and validation.

Explicitly outside BLR-001 V1:

- Data Sufficiency answer contracts;
- profession, city, colour, floor, schedule or seating-led family puzzles;
- age arithmetic;
- inheritance law and genetic pedigree reasoning;
- step, half, adoptive and foster relations without later source justification;
- free-form runtime parsing.

## Freeze boundary

A green executable audit creates an **English gap-freeze candidate**, not an automatic product release.

The following remain separate explicit gates:

- manual English chapter freeze;
- Hindi and Punjabi localisation;
- multilingual parity proof and freeze;
- Question Studio integration;
- Question Bank storage;
- mock-test eligibility;
- public publication;
- production staging;
- PR merge.
