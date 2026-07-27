# ExamTree Reasoning V1 — OPS-001 Localized Consistency Audit V3

Status: prior corrected Hindi/Punjabi review files superseded.

## User-reported defect

The first Punjabi review question displayed an identity mapping:

```text
+ means +
− means +
× means ×
```

while its options, answer and explanation belonged to the corrected question:

```text
+ means ×
× means +
8 + 3 × 2
```

The same stale-stem composition defect existed in the Hindi counterpart for `OPS-CAND-001`, seed `0`.

## Root cause

The prior manual correction replaced the English question state and teaching explanation but retained localized stems generated from the rejected pre-correction pilot. A single localized record could therefore combine:

```text
old localized stem + corrected options + corrected answer + corrected explanation
```

## V3 construction rule

Every localized record is rebuilt from one corrected English record identified by:

```text
candidateId + seed
```

The following fields remain mathematically identical across English, Hindi and Punjabi:

- options;
- correct index;
- answer;
- explanation expressions and results;
- solver proof;
- metadata.

Only the stem, method prose, step labels and conclusion are localized.

## Audit scope

```text
Hindi records checked:   48
Punjabi records checked: 48
Total localized records: 96
```

## Automated verdicts

```text
identity mappings such as + means +:     0
localized/English option mismatches:     0
localized/English answer mismatches:     0
localized/English correct-index errors:  0
localized/English maths-step mismatches: 0
stem mapping vs explanation-key errors:  0
option-structure failures:               0
residual English stem instructions:      0
```

## Correct first Punjabi record

```text
ਜੇ + ਦਾ ਅਰਥ × ਹੈ, × ਦਾ ਅਰਥ + ਹੈ, ਤਾਂ 8 + 3 × 2 ਦਾ ਮੁੱਲ ਕੱਢੋ।
```

Teaching trace:

```text
+ → ×
× → +
8 + 3 × 2 → 8 × 3 + 2
8 × 3 = 24
24 + 2 = 26
```

## Freeze effect

```text
PREVIOUS_LOCALIZED_REVIEW_FILES = REJECTED
LOCALIZED_REVIEW_V3             = READY_FOR_MANUAL_REVIEW
PERMANENT_QL_ALLOCATION         = BLOCKED
PRODUCTION_WIRING               = BLOCKED
```

The source generators and permanent localization runtime must adopt the same record-binding and identity-mapping guards before chapter freeze.