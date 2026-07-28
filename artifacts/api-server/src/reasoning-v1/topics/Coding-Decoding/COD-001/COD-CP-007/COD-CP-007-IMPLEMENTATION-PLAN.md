# COD-CP-007 — Implementation Plan

Status: **approved implementation sequence for open discovery; permanent allocation prohibited**.

The implementation is English-first and prototype-first. QL counts are discovered from executable evidence rather than predetermined.

---

## Phase 0 — Design and source authority

Deliverables:

- source and boundary audit;
- end-to-end design;
- open QL discovery audit;
- checkpoint README and status authority;
- draft design PR.

Exit gate:

- CP-001 through CP-006 and CP-010 ownership collisions explicitly recorded;
- no fixed QL count or range;
- first source-proven family identified.

---

## Phase 1 — Token-string foundation

Implement checkpoint-local primitives for:

- digit token parsing without numeric coercion;
- preservation of leading zeroes;
- code-sequence serialization with explicit token boundaries;
- decimal modular arithmetic;
- deterministic seeded generation;
- token-domain validation;
- semantic option equality;
- canonical rule fingerprints.

Required tests:

- `0472` round-trips unchanged;
- encode/decode never use `Number(...)` for complete code strings;
- invalid tokens and length mismatches fail closed;
- deterministic seed reproduction.

---

## Phase 2 — Uniform modular digit translation prototype

Prototype family:

```text
UNIFORM_MODULAR_DIGIT_TRANSLATION
```

Non-permanent prototype directions:

- encode target;
- inverse decode target;
- recover missing token;
- infer and encode;
- choose matching code.

Implementation components:

- rule and parameter registry;
- source/code generator;
- eligible-rule ambiguity solver;
- independent verifier;
- misconception-labelled distractors;
- English stem and explanation renderer;
- review exporter;
- checkpoint-local CI workflow.

Exit gate:

- bounded generation over all shift values;
- wrap and leading-zero coverage;
- all task directions exercised;
- production/inverse verifier agreement;
- exact one-rule survival;
- four options and one correct answer;
- no internal terminology in student text.

---

## Phase 3 — Prototype saturation and merge/split

Generate a combined English review corpus across:

- all non-zero shifts;
- lengths 3 through 8;
- wrap counts;
- leading-zero states;
- repeated-digit profiles;
- task directions;
- answer positions;
- renderer variants.

Audit:

- exact and normalized stem collisions;
- exact and normalized explanation collisions;
- distractor concentration;
- generation yield;
- difficulty reach;
- whole-number arithmetic collision rejection;
- encode/inverse merge or split;
- missing-token presentation merge or split.

No permanent identity is assigned at this stage.

---

## Phase 4 — Targeted source expansion

Search uploaded and later approved sources specifically for:

- arbitrary digit substitution;
- digit-to-symbol maps;
- position-dependent digit transforms;
- mixed alphanumeric source strings;
- dual-channel transformations.

For each source-confirmed family:

1. add a non-permanent design amendment;
2. create the smallest executable prototype;
3. run collision tests against stable COD checkpoints;
4. retain, merge or remove the candidate based on executable evidence.

Formal symmetry is insufficient.

---

## Phase 5 — Final CP-007 discovery freeze

Run one combined checkpoint registry over every surviving prototype.

Required freeze audits:

- concept and source-format completeness;
- task and inverse completeness;
- edge and ambiguity completeness;
- renderer completeness;
- source recurrence;
- ownership collision;
- cross-contract duplication;
- final merge/split;
- bounded yield and difficulty reach;
- English editorial approval.

Only after this gate may permanent IDs be allocated sequentially beginning at the then-current next available chapter ID.

---

## Phase 6 — Permanent English runtime

After freeze:

- assign sequential `COD-QL-*` IDs;
- replace prototype registries with stable QL registries;
- integrate the approved English runtime into chapter discovery;
- generate complete editorial review packs;
- keep public publication disabled until review acceptance.

---

## Phase 7 — Localisation

After English approval:

- author natural Hindi and Punjabi instructions and explanations;
- keep digits, Latin letters and approved symbols unchanged;
- validate symbol fonts and line wrapping;
- run cross-locale logic parity;
- review each locale independently.

---

## Phase 8 — Question Studio and release

Enable Question Studio only after:

- permanent identities exist;
- runtime and editorial gates pass;
- locale status is explicit;
- reviewer metadata and exports are stable;
- public release flags remain separately controlled.

---

## Immediate next milestone

Implement the checkpoint-local foundation and the `UNIFORM_MODULAR_DIGIT_TRANSLATION` English prototype with no permanent QLs and no Question Studio route.
