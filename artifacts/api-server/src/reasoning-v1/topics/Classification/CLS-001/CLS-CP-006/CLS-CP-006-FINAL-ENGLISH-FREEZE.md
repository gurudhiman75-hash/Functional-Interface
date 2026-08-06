# CLS-CP-006 — Final English Freeze

Status: `FROZEN_ENGLISH_RUNTIME_PROOF`

Permanent QLs: `2`

## Permanent learner contracts

### CLS-QL-010 — Find the odd single letter

Solve contract:

```text
CP006-FIND-ODD-SINGLE-LETTER
```

Learner action:

```text
evaluate the bounded alphabet property of every displayed letter
  -> identify the property shared by all but one option
  -> select the single letter with the different property
```

Admitted rule families:

- vowel/consonant class;
- odd/even alphabet-position class;
- first-half/second-half alphabet-position class.

The exact class, option count, answer position and difficulty are instance variables. They do not change the displayed answer object or the option-local classification proof.

### CLS-QL-011 — Find the odd ordered letter-pair

Solve contract:

```text
CP006-FIND-ODD-ORDERED-LETTER-PAIR
```

Learner action:

```text
preserve the displayed order of each complete letter-pair
  -> evaluate the same bounded internal relation for every option
  -> select the complete pair whose relation differs
```

Admitted rule families:

- absolute alphabet-position gap;
- signed alphabet-position gap;
- alphabet-position total;
- opposite-letter-pair status;
- ordered vowel/consonant composition.

The exact relation, direction, option count, answer position and difficulty are instance variables. They do not create additional QLs.

The ordered-pair contract remains separate from CLS-QL-010 because the answer object, internal-relation evidence and calculation topology differ from single-letter classification.

## Canonical domain

```text
Alphabet:                         A through Z
Forward positions:                A = 1 through Z = 26
Single-letter states:             26
Ordered distinct-letter pairs:    650
Complete compatible-rule registry: 8
```

Pair order is preserved. `A–D` and `D–A` are different states whenever direction is material.

## Source and ownership boundary

CP-006 owns only classification whose answer is one complete displayed single letter or one complete displayed ordered letter-pair.

It excludes:

- direct position, offset, pair-count, transformation or rearrangement tasks — Alphabet Test;
- three-or-more-letter cluster relations — CLS-CP-007;
- source-to-target transfer — Analogy;
- next, missing or wrong progression term — Series;
- hidden transformations — Coding-Decoding;
- renderer-dependent letter-shape rules without a separate visual proof.

## Source-gap and compression result

The source-gap audit found no meaningful uncovered CP-006 learner contract.

Equivalent wording and rule labels compress as follows:

- reverse-position parity into forward-position parity;
- reverse alphabet half into forward alphabet half;
- reverse signed gap into signed gap;
- reverse absolute gap into absolute gap;
- intervening-letter count into absolute-gap presentation;
- opposite-letter wording into the ordered-pair contract while retaining its source-salient rule label.

Source-thin prime/composite, pair-parity-composition and pair-half-composition families are not admitted. Arbitrary products, ratios, modular classes and renderer-dependent shape classes are rejected.

Result:

```text
Meaningful uncovered learner contracts: 0
Permanent learner contracts:            2
Admitted bounded rules:                  8
Compressed equivalent variants:         6
Deferred source-thin families:           3
Rejected candidate families:             2
```

## Ambiguous source-state finding

The printed state `W, N, P, B` is rejected even though its intended parity answer is `W`:

- parity identifies `W`;
- alphabet half independently identifies `B`.

The intended parity pattern is retained only through a controlled safe reconstruction such as `W, N, P, R`, where every compatible admitted rule supports the same answer.

```text
Ambiguous printed source states rejected: 1
Controlled source remediations proved:    1
```

A printed answer key never overrides a complete-registry competing-answer proof.

## Executable evidence

### Discovery and editorial proof

```text
Generated discovery questions:              480
Unique visible discovery questions:         480
Temporary source prototypes:                   8
Rules covered:                                  8
Task directions:                                2
Option counts:                               4, 5
Difficulty bands:              EASY, MEDIUM, HARD
Same-answer multi-rule states:                195
Maximum regeneration attempts:                  7

Generated editorial questions:               400
Unique explanation fingerprints:             400
Minimum fingerprints per prototype:           50
Pair questions:                               250
Calculation-complete pair questions:          200
```

### Permanent English runtime proof

```text
CLS-QL-010 generated:                         720
CLS-QL-010 unique visible questions:          719
CLS-QL-010 permanent sources:                   3
CLS-QL-010 answer-position counts: 182,180,155,167,36

CLS-QL-011 generated:                         720
CLS-QL-011 unique visible questions:          720
CLS-QL-011 permanent sources:                   5
CLS-QL-011 answer-position counts: 187,173,162,162,36

Rules covered across permanent QLs:             8
Option counts:                               4, 5
Difficulty bands:              EASY, MEDIUM, HARD
Same-answer multi-rule permanent states:       588
```

Every retained question is independently reparsed from its displayed options and solved against the complete compatible eight-rule registry. Multiple supporting rules are allowed only when every supporting rule identifies the stored answer.

## Editorial contract

Every learner-facing explanation must provide:

1. the common rule in plain language;
2. one explicit check for every option;
3. the active alphabet-position calculation when arithmetic is used;
4. an explicit match or failure conclusion for every option;
5. an action-led speed shortcut;
6. a relevant trap warning;
7. a final conclusion naming the stored answer.

The permanent audit rejects:

- fixed-cardinality stems that conflict with four- or five-option presentation;
- singular/plural defects such as `1 positions` or `1 places`;
- direct Alphabet Test operation wording;
- internal QL, prototype or rule identifiers in learner text;
- calculation-only evidence without a plain-language reason;
- competing-rule answer conflicts.

## Approved runtime proof

```text
Validated branch head: 592c3f5f3e506b8ad21ddd63379ab7cc42af07b3
Workflow run:         30602708016
Workflow result:      success
```

Exact-head artifacts:

```text
Permanent English review
  Artifact ID: 8782487073
  Digest:      sha256:88873b04104d54cdcb666b0776fa8a087b9628b9317e05cd731e84023ac4ab33
  Questions:   80

Discovery review
  Artifact ID: 8782486902
  Digest:      sha256:6b90ba3aa69170b689e57d322d75a82c8bb64b2865aca3c8946dab8d4a425261
  Questions:   64

Audit diagnostics
  Artifact ID: 8782486656
  Digest:      sha256:613510c81b6dc991dd3f9ea2d51995a29ba9b943a8c47a15511e32de2b003589
```

The permanent 80-question artifact was reviewed for both QLs, all eight source prototypes and rules, both option counts, all difficulty bands, lifecycle locks, cardinality integrity, singular/plural integrity and internal-identifier leakage. No defect remained.

## Lifecycle and integration policy

```text
Locale:                       en-IN
Review status:                FROZEN_ENGLISH_RUNTIME_PROOF
Question Studio exposure:     disabled
Question Bank storage:        disabled
Test eligibility:             disabled
Public publication:           disabled
Hindi localisation:           not started
Punjabi localisation:         not started
```

The English QL boundary is frozen. Product wiring and multilingual freeze require separate explicit phases. CLS-CP-007 must begin on a fresh branch and must not alter these identities without a chapter-level change-control audit.
