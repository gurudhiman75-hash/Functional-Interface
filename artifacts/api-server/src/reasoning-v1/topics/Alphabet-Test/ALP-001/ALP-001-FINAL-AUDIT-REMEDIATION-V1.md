# ALP-001 — Reasoning V1 Final-Audit Remediation V1

Status: `IMPLEMENTED_ON_REVIEW_BRANCH__CI_REQUIRED__NO_PUBLIC_PROMOTION`

## Why this remediation exists

The final Reasoning V1 audit found no P0 logic failure and no major source-backed Alphabet Test family missing inside the frozen ownership boundary. Four P1 weaknesses remained:

1. difficulty partly changed because the seed changed rather than because reasoning structure changed;
2. CP006–CP010 distractor labels were assigned after random wrong-value selection instead of being owned by the value construction;
3. CP006/CP007 word pools were too small for a 50/100-question fatigue standard;
4. Question Studio exposed only `qlId + seed + locale`, so the caller could not request chapter/checkpoint difficulty or an explicit exam delivery profile.

## Implemented changes

### Structural difficulty

- CP001–CP005 difficulty no longer receives any seed-cycle bonus.
- difficulty is computed from solve direction, inverse/composite structure, transformation complexity, occurrence tracking and bounded word-state features.
- CP006–CP010 difficulty is mapped from the actual solve contract, not from `seed % 3`.
- the advanced audit gate rejects any CP006–CP010 QL whose difficulty changes across seeds while the solve contract is unchanged.

This preserves the global Reasoning invariant: Hard cannot be created merely by a larger seed, longer displayed value or arbitrary numeric magnitude.

### Misconception-owned advanced distractors

CP006–CP010 now construct wrong values together with their error labels. Examples include:

- one-step / two-step position miscounts;
- opposite-reference use;
- wrong pair relation;
- wrong qualifying-pair-count word;
- reversed / adjacent-swap / rotated / partial transformed sequence;
- wrong-position or wrong-reference token scans.

The old post-hoc labels `SOURCE_ROW_EARLY`, `OPPOSITE_REFERENCE` and `WRONG_FINAL_CONDITION` are blocked by the final-audit gate. `DOMAIN_VALID_FALLBACK` is also blocked in audited advanced output.

The existing editorial layer still independently explains the displayed wrong value from the completed state, so a label cannot replace mathematical verification.

### Fatigue resistance

- CP006 source vocabulary expands from 12 words to more than 180 unique exam-neutral words.
- CP007 class-transformation vocabulary expands from 8 words to more than 160 eligible words.
- deterministic cycling replaces with-replacement random word selection for these families.
- every CP006/CP007 QL must produce at least 95 distinct visible questions across seeds 0–99.

This gate tests visible `stem + options`, not merely hidden seed/state diversity.

### Question Studio controls

The chapter-local registry retains backward-compatible `generate(qlId, seed, locale)` and adds `generateControlled(...)` with:

- optional checkpoint scope;
- optional exact QL scope;
- requested Easy/Medium/Hard difficulty;
- explicit exam profile;
- locale and seed.

Supported local profiles are currently:

- `SSC_CGL_TIER_I` — 4 options;
- `PUNJAB_STATE_4_OPTION` — 4 options.

`BANKING_GENERIC_5_OPTION` is deliberately declared but fails closed because the current ALP runtime still emits four options. Five-option Banking delivery remains part of the shared Reasoning exam-profile product gate and must not be simulated by silently presenting four options.

## New executable gate

`alp-001-final-audit.test.ts` proves:

- enlarged source pools are unique and above the required floor;
- advanced difficulty cannot drift with seed cycling;
- legacy/random advanced distractor labels are absent;
- CP006/CP007 pass the 100-question visible-fatigue test;
- controlled SSC/Punjab generation satisfies requested difficulty and four-option profile;
- unsupported five-option Banking generation fails closed.

The existing complete chapter workflow now executes this gate after the chapter, completion, localization and editorial audits.

## Lifecycle

This remediation does **not** change the chapter lifecycle:

```text
questionStudioDiscoverable:  chapter-local adapter only
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

No new permanent QL is allocated. The ownership boundary remains unchanged. Shared Reasoning-wide exam-profile weighting/distribution remains a separate product gate.
