# CAL-001 — Deep Audit Wave 03

Status: **IMPLEMENTED — CI VALIDATION IN PROGRESS**

Date: 2026-09-27

## Focus

Wave 03 profiles the generated learner surface after the Wave 01 explanation cleanup and Wave 02 structural difficulty remediation.

Novelty remains deliberately deferred.

## Generated-content profile gate

`cal-001-generated-profile.test.ts` now audits:

- all 36 permanent QLs;
- English, Hindi and Punjabi;
- 12 deterministic seeds per QL per locale;
- 1,296 learner-facing generated surfaces;
- all 44 normal source prototypes with 8 deterministic packages each for distractor provenance.

### Learner-surface requirements

For every QL/locale profile:

- stem must be non-trivial;
- explanation must remain concise;
- four option displays must be unique;
- answer index must point to the reported answer;
- implementation vocabulary such as prototype/authority/fingerprint/internal IDs must not leak;
- at least three visibly different stems must appear across 12 seeds;
- at least three different mathematical fingerprints must appear across 12 seeds;
- answer position must vary across generation.

These are minimum fatigue-resistance gates, not novelty claims.

## Distractor audit

For every normal Calendar source prototype and sampled seeds:

- every wrong option must retain an explicit misconception ID;
- every wrong option must retain derivation evidence;
- arbitrary neighbour-number distractors without learner-error provenance are rejected.

The source-gap QLs retain their separately frozen source-gap option contracts and are covered by the permanent Question Studio option-integrity checks.

## Stem quality

A source-level scan found no systematic recurrence of mechanical wording patterns such as:

- associated with;
- most closely linked;
- broad/meta instructional wording.

Calendar stems are primarily direct date/day questions and do not currently justify a chapter-wide rewrite.

## CI governance finding

The Calendar validator did not previously execute the new deep-audit tests.

The current authoritative Calendar workflow now includes:

- Wave 01 learner-surface proof;
- QL × difficulty reachability proof;
- Wave 03 generated-content profile proof.

The proof logs are uploaded and their exit codes are enforced.

While adding these gates, the repository workflow-hygiene guard exposed an older policy violation: the Calendar workflow listed its own YAML in its automatic path filters. That self-trigger was removed to comply with the repository-wide CI fanout policy.

## Production-integration proof drift

An older Calendar integration proof still expected `adminQuestionStudioCalendarRouter` directly in the top-level route index.

Current architecture correctly mounts specialized Question Studio routers through `admin-question-studio-registry.ts`, which is itself mounted at `/admin/question-studio`.

The proof was updated to validate:

1. the Calendar router lazy import in the canonical Question Studio registry;
2. the registry mount of the Calendar router;
3. the existing Calendar route endpoints and admin review UI.

This updates the proof to the current architecture; no Calendar endpoint was removed.

## Current disposition

```text
source/exam coverage:               strong prior source-gap closure
solver/foundation correctness:      strong prior exhaustive proof
learner explanations:               REMEDIATED + permanent gate
difficulty model:                   REMEDIATED + reachability gate
difficulty request honesty:         REMEDIATED
stem realism:                       no systematic chapter-level defect found
distractor plausibility:            misconception-provenance gate added
visible diversity:                  generated-profile gate added
semantic diversity:                 generated-profile gate added
multilingual learner surface:       generated-profile gate added
Question Studio wiring:             current registry proof corrected
CI permanence:                      deep-audit tests wired into authority workflow
novelty:                            DEFERRED
chapter deep-audit closure:         NOT YET — exact-head CI and profile results pending
```

Calendar should only move to final deep-audit closure after the exact-head workflow passes the new gates and any outliers exposed by those gates are either remediated or explicitly justified.
