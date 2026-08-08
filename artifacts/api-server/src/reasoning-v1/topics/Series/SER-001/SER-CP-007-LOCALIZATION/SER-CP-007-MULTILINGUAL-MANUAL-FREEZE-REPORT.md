# SER-CP-007 Multilingual Manual Freeze Report

## Decision

Hindi (`hi-IN`) and Punjabi (`pa-IN`) localization for `SER-001 — Series` is **approved for multilingual manual freeze**.

The explicit product-owner approval statement was recorded as `approved` on `2026-08-08` after review of the deterministic 104-triplet English–Hindi–Punjabi pack.

This decision freezes learner-facing Hindi and Punjabi content. It does **not** activate the chapter, expose it in Question Studio, permit Question Bank writes, make it test eligible, or publish it publicly.

## Approved reviewed head

```text
ae0da642814de6a96c04f30732c7bba03f18ca72
```

## Frozen scope

```text
Permanent QLs:                     13
Frozen prototype templates:       140
Independent learner release pools:135
Frozen locales:              hi-IN, pa-IN
Review triplets:                  104
English frozen references:       104
Hindi reviewed candidates:       104
Punjabi reviewed candidates:     104
Records per permanent QL:           8
```

## Parity evidence

Workflow run `31241724874` proved the finalized Hindi/Punjabi runtime across all 140 templates, three seeds per template and both locales.

```text
Localized packages:               840
Permanent QLs reached:             13
Deterministic regeneration:       PASS
Answer and option parity:         PASS
Difficulty and release parity:    PASS
Renderer parity:                  PASS
English learner-prose leaks:         0
Wrong-script contamination:          0
Lifecycle locks:                  PASS
```

## Manual-review evidence

Workflow run `31241724885` generated and validated the native-language review artifact.

```text
Artifact ID:       9017239441
Artifact name:     ser-001-cp007-native-language-review-104
Artifact digest:   sha256:268d0fff5b410eb8f1d8ec81686364d9a2b971246706c28bd7490b9ef82e75f3
```

The review pack includes the frozen English reference beside the Hindi and Punjabi candidate for each item, with options, answer, explanation, task, difficulty, release tier and reviewer controls.

## Frozen guarantees

The multilingual freeze guarantees that:

- permanent QL identity is unchanged;
- hidden logical state is unchanged;
- option content and order are unchanged;
- correct answer and correct option index are unchanged;
- task, difficulty, release tier and release-pool identity are unchanged;
- learner renderer contracts are unchanged;
- Hindi learner-facing content is approved;
- Punjabi learner-facing content is approved;
- Markdown line structure remains preserved;
- localization remains deterministic for the same template, locale and seed.

## Lifecycle boundary

```text
localizationStatus:          MULTILINGUAL_MANUAL_FREEZE_APPROVED
active:                      false
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```

## Reopening policy

The frozen content may be reopened only for a demonstrated:

- logical or answer-integrity defect;
- ambiguity or competing-answer defect;
- source, metadata or release-pool parity defect;
- Hindi meaning or naturalness defect;
- Punjabi meaning or naturalness defect;
- wrong-script contamination defect;
- Markdown or learner-rendering defect.

## Next authority

```text
SER_CP007_QUESTION_STUDIO_INTEGRATION_READINESS_AUDIT
```

Any integration proposal must preserve the inactive lifecycle boundary until a separate activation decision is explicitly approved.
