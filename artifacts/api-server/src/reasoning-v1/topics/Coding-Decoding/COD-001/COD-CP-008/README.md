# COD-CP-008 — Renaming and Substitution Coding

Status: **English discovery frozen under `COD_CP008_ENGLISH_DISCOVERY_FREEZE_V1`; `COD-QL-173..174` implemented at English runtime-proof maturity**.

This checkpoint is governed by `../cod-001-open-ql-discovery-amendment.md` and `../COD-001-MANIFEST-AMENDMENT-CP008.md`. The old fixed reservation is not authoritative.

## Read in this order

1. `COD-CP-008-SOURCE-AND-BOUNDARY-AUDIT.md`;
2. `COD-CP-008-FINAL-DISCOVERY-FREEZE.md`;
3. `../COD-001-MANIFEST-AMENDMENT-CP008.md`;
4. `COD-CP-008-IMPLEMENTATION-REPORT.md`;
5. the permanent and prototype runtime audits.

## Permanent inventory

```text
COD-QL-173 — DIRECT_RENAMED_LABEL
COD-QL-174 — SEMANTIC_REFERENT_THEN_RENAME
```

The coding operation is semantic renaming, not character substitution. The student must identify the real referent and use the renamed label assigned to it exactly once.

- `COD-QL-173` states the referent directly, such as asking what an hour is called.
- `COD-QL-174` first requires an ordinary fact, property, role, category or use, then applies the corresponding renamed label.

Mapping-chain length, cycle versus chain topology, context family and option wording are generated-instance properties, not separate QLs. No recurring materially distinct inverse-original-referent task was found.

## Runtime evidence

The permanent audit generates 400 English questions across the two QLs and proves:

- deterministic output;
- permanent solve-contract provenance;
- 15 curated semantic facts across attribute, category, function and role;
- open-chain and cycle coverage;
- three renderers and all four answer positions;
- Easy, Medium and Hard reach;
- independent solver agreement;
- injective maps without identity edges;
- exactly four unique options with one correct answer;
- complete one-step learner-facing explanations.

The frozen 400-question prototype audit remains a regression gate.

## Explicit exclusions

- character-to-character substitution belongs to `COD-CP-001`;
- sentence/artificial-language overlap belongs to `COD-CP-009`;
- conditional lookup tables belong to `COD-CP-010`;
- ordinary analogy or classification without a renaming layer belongs to its own reasoning chapter;
- time-sensitive, disputed or culturally unstable facts are forbidden;
- repeated chain traversal is a misconception, not a solve contract.

## Safety

- permanent CP-008 QLs: **2**;
- next available chapter ID: `COD-QL-175`;
- locale: English review-only;
- Hindi/Punjabi: deferred until English chapter ownership freezes;
- Question Studio, Question Bank, mock tests and public publication: disabled.
