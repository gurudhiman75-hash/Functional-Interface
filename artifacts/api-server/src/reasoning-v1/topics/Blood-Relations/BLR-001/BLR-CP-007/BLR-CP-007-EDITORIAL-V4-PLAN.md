# BLR-CP-007 Editorial V4 — Exam-Readiness Remediation

Status: **Wave 1 executable remediation candidate; no English freeze or product release is authorised.**

## Why V4 is required

V3 repaired graph validity, answer security and semantic scenario identity, but human review still found learner-facing weaknesses:

- one-token dictionary lookups were counted alongside real mock-test questions;
- colour-word code keys looked generated rather than exam-authentic;
- shared-set items repeated the full code key on every card;
- explanations often repeated the stem and conclusion instead of teaching the decisive path;
- difficulty labels were influenced by prototype names and affinal vocabulary rather than actual reasoning depth;
- all 32 `BLR-QL-034` missing-person questions used three to five disconnected clue components, creating synthetic candidate-elimination puzzles.

## Wave 1 changes

V4 preserves the validated V1/V2 graph solver and all 168 V3 answer packages, then adds an editorial release layer:

1. Remove neutral colour-word codes and remap them deterministically to exam-style symbols.
2. Render a shared code key once per four-item set rather than once per item.
3. Remodel stems by task and topology instead of reusing one generic shell.
4. Replace repeated explanation shells with decisive-path steps, QL-specific conclusions, varied shortcuts and varied traps.
5. Recalculate difficulty from decisive-link and task burden.
6. Separate the bank into:
   - 32 `FOUNDATION_PRACTICE` items;
   - 104 `RELEASE_CANDIDATE` items;
   - 32 `REMEDIATION_HOLD` items.
7. Hold every `BLR-QL-034` item outside release until a coherent connected-network scenario bank replaces the disconnected V3 constructions.

## Lifecycle boundary

All inherited lifecycle locks remain active:

```text
publiclyPublishable:    false
questionStudioVisible:  false
questionBankEligible:   false
mockTestEligible:       false
English freeze:         not granted
Hindi/Punjabi:          not started
```

## Next wave

`BLR_CP007_V4_QL034_COHERENT_NETWORK_REMODEL`

That wave must replace all 32 held missing-person scenarios with connected family networks, preserve four meaningful candidates, prove unique answers independently and then rerun the full V4 human-review export.
