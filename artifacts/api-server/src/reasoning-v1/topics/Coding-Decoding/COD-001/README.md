# COD-001 — Coding–Decoding

Status: **COD-CP-001 through COD-CP-007 implemented at English runtime-proof maturity; COD-CP-008 English discovery frozen under `COD_CP008_ENGLISH_DISCOVERY_FREEZE_V1`; COD-CP-009 English discovery frozen under `COD_CP009_ENGLISH_DISCOVERY_FREEZE_V1`; COD-CP-010 remains unimplemented**.

Student-facing chapter: **Coding–Decoding**  
Reasoning V1 package: `COD-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Coding-Decoding/COD-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md` — product taxonomy and chapter boundaries.
2. `../../../REASONING-V1-ARCHITECTURE.md` — runtime, validation and localisation contracts.
3. `cod-001-open-ql-discovery-amendment.md` — allocation policy for unfinished checkpoints.
4. `COD-001-MANIFEST-AMENDMENT-CP007.md` and earlier merged identities — current permanent allocation authority.
5. checkpoint-specific approved discovery, freeze, implementation and review documents.
6. legacy chapter design documents where not superseded by amendments.

## Current stable English runtime

- `COD-CP-001`: `COD-QL-001..024`;
- `COD-CP-002`: `COD-QL-025..052`;
- `COD-CP-003`: `COD-QL-053..080`;
- `COD-CP-004`: `COD-QL-081..112`;
- `COD-CP-005`: `COD-QL-113..136`;
- `COD-CP-006`: `COD-QL-137..168`;
- `COD-CP-007`: `COD-QL-169..172`.

Total stable implemented QLs: **172**.

## COD-CP-007 implemented state

Freeze version:

```text
COD_CP007_ENGLISH_DISCOVERY_FREEZE_V1
```

Retained family:

```text
UNIFORM_MODULAR_DIGIT_TRANSLATION
```

Permanent solve contracts:

1. `COD-QL-169` — explicit forward application;
2. `COD-QL-170` — inverse decode;
3. `COD-QL-171` — recover one missing code digit;
4. `COD-QL-172` — infer the shift and apply it forward.

Choose-matching-code is a presentation variant of `COD-QL-172`. The runtime reuses the saturated prototype generator and independent ambiguity solver, preserves leading zeroes, handles decimal wrap and remains review-only.

The next available chapter identity is `COD-QL-173`.

## COD-CP-008 frozen discovery state

Freeze version:

```text
COD_CP008_ENGLISH_DISCOVERY_FREEZE_V1
```

Exactly two non-permanent English solve contracts survive:

1. `DIRECT_RENAMED_LABEL` — apply the renamed label to a directly stated referent;
2. `SEMANTIC_REFERENT_THEN_RENAME` — resolve one curated ordinary fact, property, role, category or use, then apply one renaming edge.

The prototype proof covers 400 deterministic questions, 15 curated facts, four semantic categories, open chains and cycles, all answer positions, all three renderers and Easy/Medium/Hard reach. Chain length, topology, context and option wording are instance properties.

Character substitution remains in CP-001; sentence overlap remains in CP-009; conditional tables remain in CP-010. No recurring materially distinct inverse-original-referent contract was found.

CP-008 currently has zero permanent QLs. After this freeze merges, the guarded allocation may assign exactly:

```text
COD-QL-173 — DIRECT_RENAMED_LABEL
COD-QL-174 — SEMANTIC_REFERENT_THEN_RENAME
```

Question Studio, localisation and public publication remain disabled.

## COD-CP-009 frozen discovery state

CP-009 has:

- freeze version `COD_CP009_ENGLISH_DISCOVERY_FREEZE_V1`;
- 16 source-backed English task contracts;
- eight forward/inverse pairs;
- ten topology families;
- 24 provisional solve contracts;
- 30 contract/topology pairings;
- a 720-question combined saturation gate;
- zero permanent CP-009 QLs.

Its allocation remains sequenced behind CP-008.

## Remaining chapter sequence

1. allocate and implement the two frozen CP-008 contracts;
2. allocate the frozen CP-009 contracts sequentially after CP-008;
3. design and implement CP-010;
4. complete chapter-wide English saturation and review;
5. implement Hindi and Punjabi after English ownership freezes;
6. connect reviewed content to Question Studio and later publication gates.

## Release boundary

- Question Studio visibility remains disabled.
- No COD-001 QL is publicly publishable yet.
- Hindi and Punjabi are not started for CP-007 or CP-008.
- Mathematical operations, coded inequalities, input-output, figure coding and cross-topic coded relations remain outside COD-001.
