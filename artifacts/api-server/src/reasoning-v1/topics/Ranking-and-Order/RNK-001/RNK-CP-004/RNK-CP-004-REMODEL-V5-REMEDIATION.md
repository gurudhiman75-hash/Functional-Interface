# RNK-CP-004 — English Remodel V5 Remediation

Status: **implemented; manual English review and Question Studio renderer integration pending**.

Source review: `RNK-CP004-REMODEL-V4-CRITICAL-REVIEW.md`.

## Purpose

Remodel V5 retains the dependable V4 mathematics and corrects the remaining metadata-contract, learner-renderer and distractor-design issues before English freeze review.

## Implemented corrections

### Metadata contract

- replaced the ambiguous `Added edges` presentation with separate fields for:
  - core reduction edges;
  - displayed adjacent edges;
  - displayed non-adjacent edges;
  - added confirmatory non-adjacent edges;
- added the versioned difficulty authority `RNK_CP004_DIFFICULTY_V1`;
- preserved the difficulty score, label and component record together;
- split missing-comparison proof counting into:
  - shortest base-clue proof;
  - selected option relations;
  - completed proof relations.

### Learner and admin separation

- removed clue-role notes from learner explanations;
- stored normalized clue-role notes in admin metadata without quotation marks;
- removed raw Markdown `<details>` and `<summary>` output;
- introduced a native collapsed disclosure contract for optional learner distractor help;
- retained 360, 390 and 430 px targets as renderer requirements while explicitly leaving actual Question Studio UI validation pending integration.

### English explanation corrections

- removed `candidate(s)` placeholder grammar;
- direction-only pair distractor explanations now use the same visible local path as the decisive proof;
- exact-distance wrong-option reasons are derived from the actual option values;
- repetitive endpoint distractors are grouped into one compact explanation.

### Transitive-conclusion authority

Each `VALID_RANK_STATEMENT` question now contains:

```text
one valid conclusion requiring two or more statements
one true direct-clue distractor
one false reverse of a direct clue
one false reverse of the transitive conclusion
```

The authority-specific validator accepts a relation only when it is true, not directly stated, and supported by a path of at least two clue edges. The direct-true distractor is additionally proved to have no alternate multi-clue path.

## Executable scope

```text
provisional authorities:          11
runtime seeds per authority:     240
runtime questions:             2,640
English review questions:         66
permanent QLs allocated:           0
next available identity:  RNK-QL-027
```

## V5 proof summary

```text
misleading added-edge label: removed
difficulty model version: RNK_CP004_DIFFICULTY_V1
missing-comparison option edge counted: pass
admin clue notes separated: pass
native disclosure data contract: pass
raw HTML removed: pass
transitive authority-specific validation: pass
true direct-clue distractor: pass
pair local-path grounding: pass
exact-distance option-derived reasons: pass
review essential clues: 322
review confirmatory clues: 45
review unclassified clues: 0
average visible explanation words: 35.95
average words including optional help: 73.11
answer positions: 16/17/17/16
repeated four-answer sequences: 0
normalized semantic duplicates: 0
```

## Remaining gates

```text
manual English review of the V5 pack
Question Studio native-disclosure integration and UI/accessibility validation
source and inverse expansion
ownership and boundary audit
merge/split consolidation
permanent runtime proof
English discovery freeze
```

## Safety boundary

```text
CP-004 discovery frozen:        false
CP-004 permanent QL count:      open
Hindi/Punjabi:                  not started
Question Studio:                disabled
Question Bank:                  NOT_STORED
test eligibility:               INELIGIBLE
public publication:             false
```
