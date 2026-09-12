# ExamTree Reasoning V1 — OPS-001 Approved All-Contract Localization Report

Status: **runtime and full review export passed; original manual review accepted; targeted distractor-option correction awaits focused confirmation.**

## Scope

The approved V3 teaching runtime is localized across all 31 retained logical contracts for:

- Hindi (`hi-IN`)
- Punjabi (`pa-IN`)

This replaces the earlier representative-only 12-contract localization proof.

## Runtime proof

```text
31 retained contracts × 50 seeds × 2 locales = 3,100 localized questions
```

Latest dedicated workflow:

```text
Validate OPS-001 approved all-contract localization
Run ID: 30231451919
Conclusion: success
```

Passed gates:

```text
strict TypeScript                              PASS
answer parity with canonical English           PASS
correct-index parity                           PASS
four-option semantic parity                    PASS
option error-label parity                      PASS
solver-proof parity                            PASS
metadata parity                                PASS
residual English across stems/options/solutions 0
isolated combining marks                       0
Devanagari/Gurmukhi script presence            PASS
mobile stem budget (<= 280 characters)         PASS
language-adapted word operators                PASS
```

## Language-adapted word operators

`OPS-CAND-005` does not retain English operator words.

```text
English:   4 scale 3 combine 2
Hindi:     4 गुणा 3 जोड़ 2
Punjabi:   4 ਗੁਣਾ 3 ਜੋੜ 2
```

The replacement trace remains explicit in both localized explanations.

## Full review export

The latest successful workflow generated:

```text
Hindi:    31 contracts × 5 seeds = 155 questions
Punjabi:  31 contracts × 5 seeds = 155 questions
Total:                              310 questions
```

Artifact:

```text
ops-001-approved-hi-pa-v3-review-310
Artifact ID: 8640227148
```

The generated HTML now also includes:

- device-safe wrapping;
- no duplicate solution-step numbering.

## Original manual acceptance

The user manually accepted both localized review bundles on **2026-07-27**.

The acceptance covered:

- question wording;
- symbol correctness;
- visible replacement/interchange;
- explanation teaching quality;
- Hindi terminology;
- Punjabi terminology;
- natural language-adapted word operators.

The earlier V1/V2 explanation and localization exports remain rejected and must not be used.

## Device-discovered distractor-option defect

The browser screenshot audit later found residual English only in distractor options for three contracts:

```text
OPS-CAND-017  Only one pair is required
OPS-CAND-026  no number swap / no operator swap
OPS-CAND-027  no digit interchange / no operator interchange
```

These phrases are now localized in Hindi and Punjabi.

Preserved without change:

- correct answer;
- correct option index;
- option order;
- mathematical symbol/number content;
- option error labels;
- solver proof and semantic fingerprint.

The automated residual-English scan now includes every option value and passed all 3,100 localized questions.

## Targeted correction review

A focused artifact was generated so the user does not need to recheck all 310 records:

```text
3 affected contracts × 5 seeds × 2 locales = 30 records
Artifact: ops-001-targeted-hi-pa-option-fix-30
Artifact ID: 8640227370
```

## Gate decision

```text
ALL_31_HINDI_RUNTIME              = PASS
ALL_31_PUNJABI_RUNTIME            = PASS
FULL_MULTILINGUAL_REVIEW_EXPORT   = PASS
ORIGINAL_MANUAL_HINDI_REVIEW      = PASS
ORIGINAL_MANUAL_PUNJABI_REVIEW    = PASS
TARGETED_OPTION_AUTOMATION        = PASS
TARGETED_OPTION_MANUAL_CONFIRMATION = PENDING
DEVICE_GLYPH_AUDIT                = PASS
FINAL_SOURCE_RUNTIME_LEDGER       = PASS
PERMANENT_QL_ALLOCATION           = BLOCKED_PENDING_TARGETED_CONFIRMATION
PRODUCTION_WIRING                 = BLOCKED
```

Permanent `OPS-QL-*` IDs must not be allocated until the focused 30-record option correction is manually confirmed.