# CLS-001 — Classification / Odd One Out

Status: `CP001_CP002_MULTILINGUAL_FROZEN__CP003_CP004_ENGLISH_FROZEN__CP005_ENGLISH_DISCOVERY_REVIEW`

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

## Permanent inventory through CP-004

| QL | Checkpoint | Student task | Locale status |
|---|---|---|---|
| `CLS-QL-001` | `CLS-CP-001` | Find the semantic outlier among four or five items | Frozen multilingual runtime proof |
| `CLS-QL-002` | `CLS-CP-001` | Select another member of the shared semantic class | Frozen multilingual runtime proof |
| `CLS-QL-003` | `CLS-CP-001` | Select the only internally coherent semantic word-group | Frozen multilingual runtime proof |
| `CLS-QL-004` | `CLS-CP-002` | Find the word-pair whose internal semantic relationship differs from the others | Frozen multilingual runtime proof |
| `CLS-QL-005` | `CLS-CP-003` | Find the word whose visible spelling or structural property differs | Frozen English runtime proof |
| `CLS-QL-006` | `CLS-CP-003` | Resolve controlled jumbles, then find the semantic outlier | Frozen English runtime proof |
| `CLS-QL-007` | `CLS-CP-004` | Find the number whose conventional arithmetic or digit property differs | Frozen English runtime proof |

No later `CLS-QL-*` identity is reserved.

## Checkpoint map

| Checkpoint | Working scope | Status |
|---|---|---|
| `CLS-CP-001` | Semantic word and entity classification | `FROZEN_MULTILINGUAL_RUNTIME_PROOF` |
| `CLS-CP-002` | Semantic pair and relationship classification | `FROZEN_MULTILINGUAL_RUNTIME_PROOF` |
| `CLS-CP-003` | Lexical, spelling and word-structure classification | `FROZEN_ENGLISH_RUNTIME_PROOF` |
| `CLS-CP-004` | Number-property classification | `FROZEN_ENGLISH_RUNTIME_PROOF` |
| `CLS-CP-005` | Number-pair, triple and set classification | `EXECUTABLE_ENGLISH_DISCOVERY__HUMAN_REVIEW_REQUIRED` |
| `CLS-CP-006` | Alphabet, letter-pair and letter-class classification | Pending executable discovery |
| `CLS-CP-007` | Letter-cluster and explicit word-pattern classification | Pending executable discovery |
| `CLS-CP-008` | Mixed-token and bounded synthesis classification | Pending ownership audit |

## Frozen foundation summary

```text
Permanent QLs through CP-004:      7
Frozen solve contracts:            7
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
Temporary prototypes:                 20
Bounded pair rules:                   10
Bounded triple rules:                  8
Task directions:                       3
Provisional learner-contract shapes:   2
Permanent QLs:                         0
Audit questions:                    1200
Unique visible questions:           1200
Review questions:                     60
Option counts:                    4 and 5
Difficulties:          EASY, MEDIUM, HARD
Locale:                              en-IN
Editorial layer:   rule-aware inline MathJax
```

The executable wave covers odd ordered pairs, odd ordered triples and reference-set matching. Every displayed state is independently re-solved against the complete eighteen-rule registry. A presentation-quality layer rejects reversed or permuted duplicate options, repeated-number giveaways, permutation-only reference matches and answers made obvious by numerical scale.

The learner-facing editorial layer is separate from canonical solver evidence. It renders only the active position-specific equation, uses ExamTree inline MathJax, labels every option `✅ Matches rule` or `❌ Fails rule`, and states the failed target explicitly. Raw pairwise sum/product arrays, standalone square dumps and generic `gives a different result` conclusions are prohibited by an automated 60-question editorial audit.

The preliminary merge/split audit provisionally merges pair and triple arity inside one odd-number-tuple contract. Reference-set matching remains a separate candidate contract because it changes the displayed state, match semantics and proof. These are discovery findings only; no permanent QL is allocated before human review and source-gap closure.

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
- `CLS-CP-005/CLS-CP-005-EXECUTABLE-DISCOVERY-PLAN.md`
- `CLS-CP-005/CLS-CP-005-PRELIMINARY-MERGE-SPLIT-AUDIT.md`
- `CLS-CP-005/CLS-CP-005-EDITORIAL-V2-AUDIT.md`

## Release locks

CP-001 and CP-002 are frozen multilingual review-only proofs. CP-003 and CP-004 are frozen English review-only proofs. CP-005 is English executable discovery awaiting human review and permanent-boundary closure. None are wired to Question Studio, Question Bank, tests or public publication.
