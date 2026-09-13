# CAE-CP-008 — Multi-event Causal Reasoning Remediation — 2026-09-13

## Status

**Implemented for reviewed Question Studio generation.** The frozen V3 causal-world architecture remains unchanged.

The old CP-008 renderer mainly asked the learner to arrange four events in causal order. That covered sequence recognition but underused the canonical graph.

## Reviewed learner operations

`cp008-multi-event.ts` now projects the same four-node canonical causal chains into seven learner operations:

1. `SEQUENCE` — choose the valid causal order.
2. `IMMEDIATE_CAUSE` — identify the event directly producing a named event.
3. `IMMEDIATE_EFFECT` — identify the event directly following a named event.
4. `EARLIEST_CAUSE` — identify the earliest upstream cause of a final outcome.
5. `FINAL_EFFECT` — identify the most remote downstream effect of the initiating event.
6. `BRIDGE_ROLE` — identify an event that is an immediate effect of the source and an indirect cause of the final outcome.
7. `INVALID_RELATION` — identify the unsupported/improperly labelled causal link.

`cp008-reviewed.ts` ensures relation-claim options are localized in EN/HI/PA without changing semantic IDs or option order.

## Difficulty policy

Reviewed CP-008 emits MEDIUM and HARD only:

- sequence, immediate/remote cause/effect operations are MEDIUM;
- bridge-role and invalid-link discrimination are HARD.

Difficulty comes from causal distance and role discrimination rather than vocabulary.

## QA

`cp008-multi-event.test.ts` covers a 240-seed pass and requires:

- all seven learner operations are reachable;
- at least twenty distinct reviewed causal states;
- both MEDIUM and HARD bands;
- exactly four unique options and one correct answer;
- EN/HI/PA causal-state, answer, option-order and difficulty parity;
- no English relation-option leakage in Hindi/Punjabi;
- the ten-question reviewed CP-008 pack samples multiple learner operations and distinct causal states;
- Question Studio uses the reviewed CP-008 projection by default;
- explicit unsourced five-way requests remain on frozen V3.

## Source boundary

This is **Examtree advanced causal depth**, not currently claimed as a high-frequency SSC/Bank/Punjab paper format. It builds useful reasoning variety from the approved graph engine while keeping source-backed core profiles separately identified.

## Remaining gate

Execute the reviewed QA in CI/local repo and human-review the materialized CP-008 sample before production promotion.
