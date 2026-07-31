# CLS-001 — Classification / Odd One Out

Status: `CP001_CP002_MULTILINGUAL_FROZEN__CP003_CP004_CP005_ENGLISH_FROZEN`

## Product identity

- Reasoning family: `SYMBOLIC_SEQUENCE`
- Product code: `REAS-CLS`
- Chapter ID: `CLS-001`
- Student title: Classification / Odd One Out
- Target examinations: SSC, Banking and Punjab state examinations
- Primary locales: English (`en-IN`), Hindi (`hi-IN`) and Punjabi (`pa-IN`)
- Question Studio: disabled
- Question Bank: disabled
- Test eligibility: disabled
- Public publication: disabled

## Governing rule

Classification asks the learner to identify the item, pair or complete option-group that differs from—or uniquely belongs to—the intended class, property or relation.

Every admitted question must define a bounded rule universe, construct a valid state, prove one unique answer, reject competing answers and be independently re-solved. Four and five answer options are presentation and difficulty properties rather than separate QLs.

## Permanent inventory through CP-005

| QL | Checkpoint | Student task | Locale status |
|---|---|---|---|
| `CLS-QL-001` | `CLS-CP-001` | Find the semantic outlier among four or five items | Frozen multilingual runtime proof |
| `CLS-QL-002` | `CLS-CP-001` | Select another member of the shared semantic class | Frozen multilingual runtime proof |
| `CLS-QL-003` | `CLS-CP-001` | Select the only internally coherent semantic word-group | Frozen multilingual runtime proof |
| `CLS-QL-004` | `CLS-CP-002` | Find the word-pair whose internal semantic relationship differs from the others | Frozen multilingual runtime proof |
| `CLS-QL-005` | `CLS-CP-003` | Find the word whose visible spelling or structural property differs | Frozen English runtime proof |
| `CLS-QL-006` | `CLS-CP-003` | Resolve controlled jumbles, then find the semantic outlier | Frozen English runtime proof |
| `CLS-QL-007` | `CLS-CP-004` | Find the number whose conventional arithmetic or digit property differs | Frozen English runtime proof |
| `CLS-QL-008` | `CLS-CP-005` | Find the pair, triple or four-number tuple whose internal rule differs | Frozen English runtime proof |
| `CLS-QL-009` | `CLS-CP-005` | Select the number tuple following the same internal rule as a reference tuple | Frozen English runtime proof |

No later `CLS-QL-*` identity is reserved.

## Checkpoint map

| Checkpoint | Working scope | Status |
|---|---|---|
| `CLS-CP-001` | Semantic word and entity classification | `FROZEN_MULTILINGUAL_RUNTIME_PROOF` |
| `CLS-CP-002` | Semantic pair and relationship classification | `FROZEN_MULTILINGUAL_RUNTIME_PROOF` |
| `CLS-CP-003` | Lexical, spelling and word-structure classification | `FROZEN_ENGLISH_RUNTIME_PROOF` |
| `CLS-CP-004` | Number-property classification | `FROZEN_ENGLISH_RUNTIME_PROOF` |
| `CLS-CP-005` | Number-pair, triple and set classification | `FROZEN_ENGLISH_RUNTIME_PROOF` |
| `CLS-CP-006` | Alphabet, letter-pair and letter-class classification | Pending executable discovery |
| `CLS-CP-007` | Letter-cluster and explicit word-pattern classification | Pending executable discovery |
| `CLS-CP-008` | Mixed-token and bounded synthesis classification | Pending ownership audit |

## Frozen foundation summary

```text
Permanent QLs through CP-005:      9
Frozen solve contracts:            9
Answer-option counts:              4 and 5
Question Studio exposure:          disabled
Question Bank storage:             disabled
Test/publication eligibility:      disabled
```

### CLS-CP-001

```text
Permanent QLs:                 3
Source controls:               8
Semantic classes:              27
Unique English entities:       187
Locales:                       en-IN, hi-IN, pa-IN
```

### CLS-CP-002

```text
Permanent QLs:                 1
Source controls:               5
Total admitted relations:      55
Curated English fact pairs:    372
Multilingual-safe fact pairs:  160
Locales:                       en-IN, hi-IN, pa-IN
```

### CLS-CP-003

```text
Permanent English QLs:          2
Direct structural rules:        6
Governed English words:        630
Controlled jumble words:        35
Source controls:                 7
Locale frozen:                   en-IN
```

The six direct visible-word controls merge into `CLS-QL-005`. The jumbled-word task remains `CLS-QL-006` because it requires unique reconstruction before semantic classification. Every admitted jumble is rejected when a visible structural shortcut can identify an outlier.

### CLS-CP-004

```text
Permanent English QLs:          1
Domain:                         2 to 999
Domain size:                    998
Source controls:                13
Admitted rules:                 22
Locale frozen:                   en-IN
```

All source controls merge into `CLS-QL-007` because the answer object and proof contract remain one displayed number evaluated under one bounded conventional property. Arbitrary formula fitting is prohibited.

### CLS-CP-005

```text
Permanent English QLs:                  2
Complete competing-rule universe:      35
Odd-tuple permanent sources:            35
Equivalent-set permanent sources:       6
Represented arities:                 2, 3, 4
Pre-freeze executable evidence:       2004
Permanent runtime audit questions:    1380
Odd runtime unique:                 420 / 420
Equivalent runtime unique:          957 / 960
Option counts:                      4 and 5
Difficulties:            EASY, MEDIUM, HARD
Locale frozen:                         en-IN
```

`CLS-QL-008` merges odd ordered pairs, triples and complete four-number groups because they share one mismatch contract, answer object and independent proof topology. Numerical relation families, direction, option count and difficulty remain instance variables.

`CLS-QL-009` remains separate because the learner must first recover the signature of a supplied reference tuple and then select the unique matching candidate. Pair, triple and four-number forms merge as arity variants inside this reference-and-match contract.

Wave 1, generic source-gap Wave 2 and the digit-product supplement are independently re-solved against one 35-rule universe. The digit-product reference-set form passed a separate naturalness audit and is admitted to `CLS-QL-009`; it does not create another QL.

Every option explanation follows the approved teacher sequence:

```text
plain-language reason -> active inline-MathJax calculation -> match/failure result
```

Math-only option blocks, unused diagnostic arrays, permutation shortcuts, answer-scale giveaways and competing-rule answer conflicts are rejected automatically.

## Strict chapter boundary

CLS-001 owns questions whose final task is classification by a visible or inferable common property or option-local relation.

It excludes:

- rule transfer from a source pair to a target pair — Analogy;
- next, missing or wrong term in an ordered progression — Series;
- explicit alphabet-position operations asked directly — Alphabet Test;
- hidden encoding or decoding — Coding-Decoding;
- operator replacement and equation evaluation — Mathematical Operations;
- dictionary ordering — Word and Dictionary Order;
- figure odd-one-out — Figure Classification;
- general-knowledge questions with no stable governed dataset;
- open-ended free-text generation;
- questions with several equally defensible grouping rules.

## Authority documents

- `CLS-001-END-TO-END-DESIGN.md`
- `CLS-001-SOURCE-AND-OWNERSHIP-AUDIT.md`
- `CLS-CP-001/CLS-CP-001-FINAL-MULTILINGUAL-FREEZE.md`
- `CLS-CP-002/CLS-CP-002-FINAL-MULTILINGUAL-FREEZE.md`
- `CLS-CP-003/CLS-CP-003-FINAL-ENGLISH-FREEZE.md`
- `CLS-CP-004/CLS-CP-004-FINAL-ENGLISH-FREEZE.md`
- `CLS-CP-005/CLS-CP-005-FINAL-ENGLISH-FREEZE.md`
- `CLS-CP-005/CLS-CP-005-PRELIMINARY-MERGE-SPLIT-AUDIT.md`
- `CLS-CP-005/CLS-CP-005-SOURCE-GAP-AUDIT.md`
- `CLS-CP-005/CLS-CP-005-SOURCE-GAP-AUDIT-WAVE-2.md`
- `CLS-CP-005/CLS-CP-005-EDITORIAL-V2-AUDIT.md`

## Release locks

CP-001 and CP-002 are frozen multilingual review-only proofs. CP-003, CP-004 and CP-005 are frozen English review-only proofs. None are wired to Question Studio, Question Bank, tests or public publication. Hindi and Punjabi localisation for CP-003 through CP-005 require separate explicit phases.
