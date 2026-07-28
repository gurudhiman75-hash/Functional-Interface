# COD-CP-008 — Renaming and Substitution Coding

Status: **open English discovery; two source-backed prototype solve contracts; no permanent QLs**.

This checkpoint is governed by `../cod-001-open-ql-discovery-amendment.md`. The old fixed reservation is not authoritative.

## Current source-backed boundary

Renaming questions provide statements such as:

```text
teacher is called doctor
doctor is called manager
manager is called peon
```

The coding operation is semantic renaming, not character substitution. The student must use the renamed label assigned to the real referent exactly once.

Two provisional solve contracts survive the first source and merge/split pass:

1. `DIRECT_RENAMED_LABEL` — the target referent is stated directly, such as asking what an hour is called;
2. `SEMANTIC_REFERENT_THEN_RENAME` — first resolve an ordinary fact, property, role or use, then apply the corresponding renamed label.

Mapping-chain length, cycle versus chain topology, colour/object/profession context and option wording are generated-instance properties, not separate QLs.

## Explicit exclusions

- character-to-character substitution belongs to `COD-CP-001`;
- sentence/artificial-language overlap belongs to `COD-CP-009`;
- conditional lookup tables belong to `COD-CP-010`;
- ordinary analogy or classification without a renaming layer belongs to its own reasoning chapter;
- time-sensitive, disputed or culturally unstable facts are forbidden.

## Safety

- permanent CP-008 QLs: **0**;
- next available chapter ID: `COD-QL-173`, not allocated;
- locale: English prototype only;
- Hindi/Punjabi: deferred until English ownership freezes;
- Question Studio and public publication: disabled.
