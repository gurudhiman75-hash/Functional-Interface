# ExamTree Reasoning V1 — OPS-001 Approved All-Contract Localization Report

Status: **runtime and export proof passed; manual Hindi/Punjabi review pending.**

## Scope

The approved V3 teaching runtime was localized across all 31 retained logical contracts for:

- Hindi (`hi-IN`)
- Punjabi (`pa-IN`)

This replaces the earlier representative-only 12-contract localization proof.

## Runtime proof

```text
31 retained contracts × 50 seeds × 2 locales = 3,100 localized questions
```

Dedicated workflow:

```text
Validate OPS-001 approved all-contract localization
Run ID: 30211519154
Conclusion: success
```

Passed gates:

```text
strict TypeScript                              PASS
answer parity with canonical English           PASS
correct-index parity                           PASS
four-option parity                             PASS
solver-proof parity                            PASS
metadata parity                                PASS
residual English instructional wording         0
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

## Review export

The successful workflow also generated:

```text
Hindi:    31 contracts × 5 seeds = 155 questions
Punjabi:  31 contracts × 5 seeds = 155 questions
Total:                              310 questions
```

Artifact:

```text
ops-001-approved-hi-pa-v3-review-310
Artifact ID: 8634589410
```

Files:

- `OPS-001-HI-APPROVED-V3-155.html`
- `OPS-001-HI-APPROVED-V3-155.md`
- `OPS-001-PA-APPROVED-V3-155.html`
- `OPS-001-PA-APPROVED-V3-155.md`
- `OPS-001-HI-PA-APPROVED-V3-310.csv`
- `OPS-001-HI-PA-APPROVED-V3-310.json`

## Important preservation contract

Localization changes instructional language only. The following remain identical to the canonical English question:

- mathematical options;
- answer;
- correct option index;
- task and solve mode;
- eligible-pool and survivor proof;
- semantic fingerprint and structural metadata.

## Gate decision

```text
ALL_31_HINDI_RUNTIME       = PASS
ALL_31_PUNJABI_RUNTIME     = PASS
MULTILINGUAL_REVIEW_EXPORT = PASS
MANUAL_HINDI_REVIEW        = PENDING
MANUAL_PUNJABI_REVIEW      = PENDING
PERMANENT_QL_ALLOCATION    = BLOCKED
PRODUCTION_WIRING          = BLOCKED
```

Permanent `OPS-QL-*` IDs must not be allocated until the localized manual-review files are accepted and the device/source-ledger gates are complete.
