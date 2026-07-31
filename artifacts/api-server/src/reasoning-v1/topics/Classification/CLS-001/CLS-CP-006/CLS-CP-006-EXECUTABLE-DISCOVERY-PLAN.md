# CLS-CP-006 — Alphabet, Letter-Pair and Letter-Class Classification

Status: `EXECUTED__SUPERSEDED_BY_FINAL_ENGLISH_FREEZE`

Final authority: `CLS-CP-006-FINAL-ENGLISH-FREEZE.md`

## Purpose

This checkpoint covers Classification questions whose displayed answer objects are single English letters or complete ordered letter-pairs. The learner identifies the option whose bounded alphabet class or internal pair relation differs from the others.

It excludes direct position, offset, count, transformation and rearrangement tasks owned by Alphabet Test. It also excludes three-or-more-letter cluster patterns owned by `CLS-CP-007`.

## Executed source-backed directions

1. `FIND_ODD_LETTER` — find the single letter with a different bounded alphabet class.
2. `FIND_ODD_LETTER_PAIR` — find the complete ordered letter-pair with a different internal relation.

The discovery hypotheses were exhaustively audited and froze as:

- `CLS-QL-010` — odd single letter;
- `CLS-QL-011` — odd complete ordered letter-pair.

## Executed prototype wave

### Single-letter classification

1. vowel/consonant class;
2. odd/even alphabet position;
3. first-half/second-half alphabet position.

### Ordered letter-pair classification

4. absolute position gap;
5. signed position gap;
6. sum of alphabet positions;
7. opposite-letter-pair status;
8. ordered vowel/consonant composition.

The eight prototypes measure source and rule coverage. They are not permanent QLs.

## Canonical alphabet model

```text
A = 1, B = 2, ... Z = 26
reverse position = 27 - forward position
opposite letters satisfy position sum = 27
signed pair gap = position(second) - position(first)
absolute pair gap = |position(second) - position(first)|
```

Pair order is preserved whenever direction is material.

## Implemented valid-state pipeline

```text
select governed source prototype
  -> select admitted rule and common value
  -> sample distinct governed inliers
  -> sample one controlled non-matching option
  -> place the answer deterministically
  -> parse the displayed options independently
  -> enumerate the complete compatible rule registry
  -> reject competing-answer states
  -> render teacher-style explanation
  -> emit review-only runtime state
```

Randomly choosing letters and inventing a relation afterwards is prohibited.

## Implemented ambiguity gate

A question is accepted only when:

- the intended rule supports the stored answer;
- at least one admitted rule supports an answer;
- every supporting rule identifies the same answer index;
- no second answer is defensible under the bounded registry.

The printed source state `W, N, P, B` was rejected because parity identifies `W` while alphabet half identifies `B`.

## Implemented editorial gate

Every accepted question includes:

1. a plain-language common rule;
2. one check for every option;
3. the active calculation when arithmetic is used;
4. an explicit match or failure statement;
5. an action-led shortcut;
6. a relevant trap warning;
7. a final answer conclusion.

The audit rejects fixed-cardinality stem mismatches, incorrect singular/plural wording, direct Alphabet Test operation language, internal identifier leakage and calculation-only evidence.

## Executed proof coverage

```text
Discovery questions:                 480
Unique discovery questions:          480
Editorial questions:                 400
Unique explanation fingerprints:     400
Permanent runtime questions:        1440
Permanent source prototypes:           8
Complete admitted rules:               8
Option counts:                      4, 5
Difficulties:           EASY, MEDIUM, HARD
Meaningful uncovered contracts:        0
Permanent QLs:                          2
```

## Final lifecycle boundary

```text
permanentQlIds:             CLS-QL-010, CLS-QL-011
reviewStatus:               FROZEN_ENGLISH_RUNTIME_PROOF
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```

No Question Studio, Question Bank, test or publication integration is authorised by the English freeze.
