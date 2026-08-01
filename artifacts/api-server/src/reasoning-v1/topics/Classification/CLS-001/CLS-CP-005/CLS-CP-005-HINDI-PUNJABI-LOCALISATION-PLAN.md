# CLS-CP-005 — Hindi and Punjabi Localisation Plan

Status: `EXECUTABLE_LOCALISATION__HUMAN_REVIEW_REQUIRED`

Permanent QLs:

- `CLS-QL-008 — Find the odd number tuple`
- `CLS-QL-009 — Select the tuple following the reference rule`

Target locales:

- Hindi: `hi-IN`
- Punjabi: `pa-IN`

## Canonical boundary

The frozen English runtime remains the only mathematical and solver authority.

Localisation may change only learner-facing delivery:

- question stems;
- rule descriptions;
- option explanations;
- step-by-step wording;
- exam-speed shortcuts;
- common-trap wording.

Localisation must not change:

- QL identity;
- solve contract;
- source prototype;
- source seed;
- displayed number tuples;
- option order;
- answer index;
- intended rule or rule value;
- canonical inline-MathJax calculations;
- 35-rule ambiguity proof;
- difficulty;
- lifecycle release locks.

## Language standard

Hindi and Punjabi text must sound like an SSC, Banking or Punjab-state examination explanation rather than a literal translation of an internal engine instruction.

Required style:

```text
simple teacher sentence -> unchanged canonical calculation -> clear result
```

The localisation must:

- use standard exam vocabulary;
- prefer short active sentences;
- vary question openings;
- use natural Gurmukhi grammar;
- explain the common rule before the calculation;
- keep position and direction wording clear;
- use positive trap guidance where possible;
- avoid raw internal identifiers and implementation terminology.

Rejected learner-facing language includes:

- literal developer wording;
- `case` / `मामला` / `ਮਾਮਲਾ` fillers;
- `invariant`, `registry`, `prototype` or solve-ID terminology;
- calculation-only option blocks;
- English `Matches rule` / `Fails rule` labels;
- passive or legal-sounding Punjabi;
- unnecessary Sanskritised Hindi or overly technical Punjabi.

## Executable coverage

The language pack contains learner-facing text for the complete frozen rule universe:

```text
Wave 1 rules:                    18
Source-gap Wave 2 rules:         16
Digit-product rule:               1
Total rules:                     35
Permanent QLs:                    2
Represented arities:          2, 3, 4
Option counts:                4 and 5
```

Every localised question is generated from its frozen English counterpart and must preserve exact mathematical parity.

## Review package

The review exporter selects one canonical question for every rule in every permanent QL, then renders both Hindi and Punjabi versions.

```text
Rules per QL per locale: 35
QLs:                      2
Locales:                  2
Review questions:       140
```

The review is intentionally not a freeze. Human review must assess:

- natural Hindi wording;
- natural Punjabi wording;
- agreement and sentence flow;
- standard exam terminology;
- clarity of positional rules;
- shortcut usefulness;
- trap usefulness;
- whether any sentence sounds translated rather than authored.

## Lifecycle

```text
English runtime:               FROZEN_ENGLISH_RUNTIME_PROOF
Hindi runtime:                 LOCALIZED_REVIEW_REQUIRED
Punjabi runtime:               LOCALIZED_REVIEW_REQUIRED
Question Studio exposure:      disabled
Question Bank storage:         disabled
Test eligibility:              disabled
Public publication:            disabled
```

Hindi and Punjabi may be frozen only after human review, remediation and a final multilingual parity proof.
