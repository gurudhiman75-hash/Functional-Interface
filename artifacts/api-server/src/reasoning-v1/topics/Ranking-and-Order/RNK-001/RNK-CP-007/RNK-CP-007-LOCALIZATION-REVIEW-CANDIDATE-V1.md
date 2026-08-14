# RNK-CP-007 — Hindi/Punjabi Localization Review Candidate V1

Status: **EXECUTABLE REVIEW CANDIDATE — HUMAN LANGUAGE REVIEW REQUIRED — NOT MULTILINGUAL FROZEN**

Date: 2026-08-14

## Scope

This checkpoint localizes the already frozen English `RNK-QL-042 CATEGORY_COMPOSITION_AROUND_RANK` runtime into Hindi and Punjabi review candidates.

It does **not** change Ranking authority ownership, allocate `RNK-QL-043`, mutate the frozen English projection, enable Question Studio, persist questions, store them in the Question Bank, make them test-eligible, or publish them.

## Canonical source

```text
English authority:        RNK_CP007_ENGLISH_FREEZE_V1
permanent runtime:        RNK_CP007_PERMANENT_RUNTIME_V1
permanent QL:             RNK-QL-042
English question count:   192
English projection:       sha256:44aefb019c1a55308b58f4b285b1b6f7df97dea0185652d6de73e2dafbbd446b
```

## Localized candidate inventory

```text
Hindi review candidates:       192
Punjabi review candidates:     192
total localized candidates:    384
modes:                            4 x 48 per locale
surface styles:                   4 x 48 per locale
answer positions:                48 / 48 / 48 / 48 per locale
difficulty:                     144 Medium / 48 Hard per locale
new QLs allocated:                0
next available QL:              RNK-QL-043
```

The localizer reconstructs learner-facing text from the frozen structured state rather than translating the English string blindly. Localized target names and partition labels come from the pinned Ranking Object Pool V2.

## Executable parity contract

For every Hindi and Punjabi record the validation gate requires exact equality with its canonical English record for:

- permanent QL and authority;
- permanent ordinal and candidate ordinal;
- mode and difficulty;
- surface-style identity;
- partition identity;
- requested category and requested side;
- complete mathematical state;
- evidence object;
- all four numeric options;
- correct answer position and answer;
- mathematical fingerprint;
- permanent runtime fingerprint.

A locale-independent canonical semantic fingerprint is derived from those fields. Hindi and Punjabi variants of the same canonical item must share that fingerprint while having distinct locale-specific localization fingerprints.

## Learner-language gates

Each localized record must:

- contain the intended target script;
- contain no multi-letter residual English learner-facing words;
- contain no unresolved template placeholders;
- use the localized target person name;
- preserve all four English surface-style lanes as distinct localized surfaces;
- keep ahead/after semantics explicit in the target language.

These are machine gates only. They do not substitute for human Hindi/Punjabi editorial review.

## Manual review pack

`cp007-localization-review-export-v1.ts` produces a 64-question review pack:

```text
Hindi:    32 questions
Punjabi:  32 questions
```

Sampling is balanced at two questions for every `mode × surface-style` cell.

Human reviewers should specifically inspect natural exam-language phrasing, आगे/पीछे and ਅੱਗੇ/ਪਿੱਛੇ semantics, category-label naturalness, rank phrasing, and explanation readability.

## Lifecycle

```text
English frozen:                  true
Hindi/Punjabi machine parity:    EXECUTABLE_PROVED
Hindi/Punjabi human review:      REQUIRED
multilingual freeze:             false
RNK-QL-043 allocated:            false
Question Studio:                 DISABLED
persistence:                     DISABLED
Question Bank:                   NOT_STORED
test eligibility:                INELIGIBLE
public publication:              false
product delivery unlocked:       false
```

A later explicit human-language review and multilingual freeze record are required before CP007 can be considered Hindi/Punjabi frozen.
