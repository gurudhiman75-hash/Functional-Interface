# CLS-001 — Classification / Odd One Out

Status: `CP001_FROZEN__CP002_FROZEN__CP003_EXECUTABLE_DISCOVERY`

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

Every admitted question must define a bounded rule universe, construct a valid state, prove one unique answer, reject competing answers, be independently re-solved and preserve identical logic across supported locales.

Four and five answer options are presentation and difficulty properties. They do not create separate QLs by themselves.

## Inventory policy

Permanent QL and solve-mode totals are not fixed for the chapter in advance. Each checkpoint is frozen only after source, task-direction, inverse, answer-object, representation, ambiguity, ownership and no-new-contract audits close.

| QL | Checkpoint | Student task | Status |
|---|---|---|---|
| `CLS-QL-001` | `CLS-CP-001` | Find the semantic outlier among four or five items | Frozen multilingual runtime proof |
| `CLS-QL-002` | `CLS-CP-001` | Select another member of the shared semantic class | Frozen multilingual runtime proof |
| `CLS-QL-003` | `CLS-CP-001` | Select the only internally coherent semantic word-group | Frozen multilingual runtime proof |
| `CLS-QL-004` | `CLS-CP-002` | Find the word-pair whose internal semantic relationship differs from the others | Frozen multilingual runtime proof |

No later `CLS-QL-*` identity is reserved. `CLS-CP-003` uses temporary prototype IDs only.

## Checkpoint map

| Checkpoint | Working scope | Status |
|---|---|---|
| `CLS-CP-001` | Semantic word and entity classification | `FROZEN_MULTILINGUAL_RUNTIME_PROOF` |
| `CLS-CP-002` | Semantic pair and relationship classification | `FROZEN_MULTILINGUAL_RUNTIME_PROOF` |
| `CLS-CP-003` | Lexical, spelling and word-structure classification | `EXECUTABLE_DISCOVERY_IN_PROGRESS` |
| `CLS-CP-004` | Number-property classification | Pending executable discovery |
| `CLS-CP-005` | Number-pair, triple and set classification | Pending executable discovery |
| `CLS-CP-006` | Alphabet, letter-pair and letter-class classification | Pending executable discovery |
| `CLS-CP-007` | Letter-cluster and explicit word-pattern classification | Pending executable discovery |
| `CLS-CP-008` | Mixed-token and bounded synthesis classification | Pending ownership audit |

The pending checkpoint names remain organisational hypotheses and may still be merged, split, reassigned or rejected.

## CLS-CP-001 frozen foundation

```text
Permanent QLs:                 3
Frozen solve contracts:        3
Source controls:               8
Semantic classes:              27
Unique English entities:       187
Locales:                       en-IN, hi-IN, pa-IN
Answer-option counts:          4 and 5
```

## CLS-CP-002 frozen foundation

```text
Permanent QLs:                 1
Frozen solve contracts:        1
Permanent identity:            CLS-QL-004
Solve contract:                CP002-FIND-ODD-SEMANTIC-RELATION-PAIR
Temporary source controls:     5
Stable semantic relations:     19
Lexical relations:             12
Class-pair relations:          24
Total admitted relations:      55
Curated English fact pairs:    372
Multilingual-safe fact pairs:  160
English-only discovery facts:  212
Locales:                       en-IN, hi-IN, pa-IN
Answer-option counts:          4 and 5
```

The frozen contract covers contrasting valid relations, synonym/antonym polarity, reversed direction, conservative false pairings, semantic class-pair contrast and recurring container/content, material/product, object/sound and one-generation family-role relations.

Final executable evidence includes 2,000 English discovery questions, 1,600 frozen English questions and 1,800 multilingual parity questions. All 55 relations, all five controls, both option counts, all answer positions and Easy/Medium/Hard instances are exercised.

## CLS-CP-003 discovery foundation

```text
Permanent QLs:                 0
Frozen solve contracts:        0
Temporary source controls:     7
Direct structural rules:       6
Additional resolution task:    controlled jumbled-word classification
Locale:                        en-IN discovery only
Answer-option counts:          4 and 5
Source saturation:             open; File Library retry required
```

The first wave tests:

- exact word length;
- vowel count;
- repeated-letter topology;
- palindrome status;
- first/last vowel-consonant class;
- governed prefix or suffix family;
- unique controlled unjumbling followed by semantic classification.

The first six controls compare visible word structure directly. The jumbled-word control adds an anagram-resolution stage and remains a separate merge/split candidate. Hindi and Punjabi must use script-specific governed word datasets; English structural questions will not be translated mechanically.

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
- general-knowledge questions with no stable classification contract;
- open-ended free-text semantic generation;
- questions with several equally defensible grouping rules.

Semantic odd word-pair relationships belong to `CLS-CP-002`. Visible word structure and controlled classification-final jumbles belong to `CLS-CP-003`, subject to its source and multilingual audits.

## Authority documents

- `CLS-001-END-TO-END-DESIGN.md`
- `CLS-001-SOURCE-AND-OWNERSHIP-AUDIT.md`
- `CLS-CP-001/CLS-CP-001-FINAL-MULTILINGUAL-FREEZE.md`
- `CLS-CP-001/CLS-CP-001-SIMPLIFIED-STUDENT-EXPLANATION-STANDARD.md`
- `CLS-CP-002/CLS-CP-002-SOURCE-SATURATION-AND-MERGE-SPLIT-AUDIT.md`
- `CLS-CP-002/CLS-CP-002-FINAL-MULTILINGUAL-FREEZE.md`
- `CLS-CP-003/CLS-CP-003-EXECUTABLE-DISCOVERY-PLAN.md`

## Release locks

`CLS-CP-001` and `CLS-CP-002` are frozen as multilingual review-only runtime proofs. `CLS-CP-003` is English discovery-only. All three remain unavailable to Question Studio, Question Bank, tests and public users until explicit integration approval is given.