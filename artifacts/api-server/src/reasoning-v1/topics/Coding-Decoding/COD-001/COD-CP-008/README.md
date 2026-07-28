# COD-CP-008 — Renaming and Substitution Coding

Status: **English discovery frozen under `COD_CP008_ENGLISH_DISCOVERY_FREEZE_V1`; two prototype solve contracts; no permanent QLs**.

This checkpoint is governed by `../cod-001-open-ql-discovery-amendment.md`. The old fixed reservation is not authoritative.

## Read in this order

1. `COD-CP-008-SOURCE-AND-BOUNDARY-AUDIT.md`;
2. `COD-CP-008-FINAL-DISCOVERY-FREEZE.md`;
3. `cp008-final-discovery-freeze.ts`;
4. the executable prototype runtime and audits.

## Frozen source-backed boundary

Renaming questions provide statements such as:

```text
teacher is called doctor
doctor is called manager
manager is called peon
```

The coding operation is semantic renaming, not character substitution. The student must use the renamed label assigned to the real referent exactly once.

Two solve contracts survive the complete source and merge/split pass:

1. `DIRECT_RENAMED_LABEL` — the target referent is stated directly, such as asking what an hour is called;
2. `SEMANTIC_REFERENT_THEN_RENAME` — first resolve an ordinary fact, property, role, category or use, then apply the corresponding renamed label.

Mapping-chain length, cycle versus chain topology, colour/object/profession context and option wording are generated-instance properties, not separate QLs. No recurring materially distinct inverse-original-referent task was found.

## Executable prototype evidence

- two non-permanent prototype contracts;
- 400 deterministic English questions;
- 15 curated semantic facts across attribute, category, function and role;
- open-chain and cycle coverage;
- three renderers;
- all four answer positions;
- Easy, Medium and Hard reach;
- independent solver agreement;
- zero permanent IDs and zero public exposure.

## Explicit exclusions

- character-to-character substitution belongs to `COD-CP-001`;
- sentence/artificial-language overlap belongs to `COD-CP-009`;
- conditional lookup tables belong to `COD-CP-010`;
- ordinary analogy or classification without a renaming layer belongs to its own reasoning chapter;
- time-sensitive, disputed or culturally unstable facts are forbidden;
- repeated chain traversal is a misconception, not a solve contract.

## Guarded next allocation

After this discovery freeze merges:

```text
COD-QL-173 — DIRECT_RENAMED_LABEL
COD-QL-174 — SEMANTIC_REFERENT_THEN_RENAME
```

## Safety

- permanent CP-008 QLs in this branch: **0**;
- next available chapter ID: `COD-QL-173`, not yet allocated;
- locale: English prototype only;
- Hindi/Punjabi: deferred until English ownership freezes;
- Question Studio and public publication: disabled.
