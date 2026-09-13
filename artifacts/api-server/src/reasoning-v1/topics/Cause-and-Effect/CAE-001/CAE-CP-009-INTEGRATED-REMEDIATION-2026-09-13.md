# CAE-CP-009 — Integrated Causal Reasoning Remediation — 2026-09-13

## Status

**Implemented for reviewed Question Studio generation.** The frozen V3 graph architecture remains unchanged.

The old CP-009 surface concentrated on a single missing-link form. The reviewed layer now uses the same canonical worlds for broader integrated causal reasoning.

## Reviewed learner operations

`cp009-integrated.ts` implements six modes:

1. `MISSING_SINGLE` — complete one missing causal bridge.
2. `MISSING_PAIR` — complete two ordered missing intermediate events.
3. `RELATION_TYPE` — recognise that a source is an indirect, not direct, cause of the final outcome.
4. `CONNECTOR_PAIR` — select the ordered two-event connector linking source and outcome.
5. `NEXT_OUTCOME` — infer the next downstream event from the first three events.
6. `COMMON_CAUSE_RECONSTRUCTION` — infer the hidden common cause of two visible sibling effects.

The first five reuse four-node canonical chains. Common-cause reconstruction reuses existing `CAE-FAM-SHARED-PRESSURE` branching worlds. No second causal ontology was introduced.

## Difficulty policy

- single missing-link completion remains MEDIUM;
- double-gap, relation-type, connector-pair, next-outcome and common-cause reconstruction are HARD.

Difficulty comes from hidden structure, causal distance and discriminating direct versus indirect/common-cause relations, not difficult wording.

## Editorial safeguards

- visible endpoints are excluded from missing-link distractor eligibility;
- options must be unique;
- exactly one answer must be valid;
- pair-completion preserves order;
- explanations expose the causal trace simply;
- EN/HI/PA use the same semantic state and option identities.

## QA

`cp009-integrated.test.ts` covers a 240-seed pass and requires:

- all six integrated modes are reachable;
- at least twenty-four distinct reviewed semantic states;
- both MEDIUM and HARD bands;
- exactly four unique options and one correct answer;
- mode-specific structural invariants;
- EN/HI/PA causal-state, answer, option-order and difficulty parity;
- ten distinct states and multiple modes in the reviewed editorial pack;
- Question Studio routes CP-009 through `CAE-PLAN-INTEGRATED-V2` by default;
- explicit unsourced five-way requests remain on frozen V3.

## Source boundary

CP-009 remains **Examtree advanced/novel coverage** unless a specific learner operation is separately established by dated exam evidence. This work increases depth without mislabelling novelty as common exam frequency.

## Remaining gate

Execute the reviewed QA in CI/local repo, materialize the reviewed editorial pack, and human-review the CP-009 sample before chapter production freeze.
