# CLS-001 — Classification / Odd One Out

Status: `CP001_FROZEN__CP002_EXECUTABLE_DISCOVERY_IN_PROGRESS`

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

The chapter is not implemented as a bag of static facts or a generic “three are alike” template. Every admitted question must:

1. define a bounded machine-readable rule universe;
2. construct a valid state before rendering;
3. prove one unique answer;
4. reject equally defensible competing answers;
5. be independently re-solved from the displayed state;
6. preserve identical logic across supported locales.

Four and five answer options are presentation and difficulty properties. They do not create separate QLs by themselves.

## Inventory policy

Permanent QL and solve-mode totals are not fixed for the chapter in advance. Each checkpoint is frozen only after source, task-direction, inverse, answer-object, representation, ambiguity, ownership and no-new-contract audits close.

`CLS-CP-001` has completed that process and owns:

| QL | Student task | Status |
|---|---|---|
| `CLS-QL-001` | Find the semantic outlier among four or five items | Frozen multilingual runtime proof |
| `CLS-QL-002` | Select another member of the shared semantic class | Frozen multilingual runtime proof |
| `CLS-QL-003` | Select the only internally coherent semantic word-group | Frozen multilingual runtime proof |

No later `CLS-QL-*` identity is reserved. `CLS-CP-002` currently uses temporary prototype IDs only.

## Checkpoint map

| Checkpoint | Working scope | Status |
|---|---|---|
| `CLS-CP-001` | Semantic word and entity classification | `FROZEN_MULTILINGUAL_RUNTIME_PROOF` |
| `CLS-CP-002` | Semantic pair and relationship classification | `EXECUTABLE_DISCOVERY_IN_PROGRESS` |
| `CLS-CP-003` | Lexical, spelling and word-structure classification | Pending executable discovery |
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
Inherited multi-membership:    91 entities
Direct multi-membership:       10 entities
Locales:                       en-IN, hi-IN, pa-IN
Answer-option counts:          4 and 5
```

The checkpoint supports direct semantic category, function, part/whole, hierarchy, cross-cutting membership, inverse class-member selection and coherent option-group selection.

## CLS-CP-002 discovery foundation

```text
Permanent QLs:                 0
Frozen solve contracts:        0
Temporary prototypes:          5
Stable directional relations:  15
Lexical relations:             12
Class-pair relations:          24
Curated imported facts:        324
Locale:                        en-IN discovery only
Answer-option counts:          4 and 5
```

The first wave tests:

- directional semantic relation outliers;
- synonym versus antonym polarity;
- reversed pair direction;
- category-correct but false pairings;
- pairs whose two words belong to another semantic class.

The generator uses curated Analogy facts and the frozen CP-001 semantic classes, but the task and solver remain Classification-owned. Volatile country/capital/state-capital/currency facts are excluded.

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

Semantic odd word-pair relationships belong to `CLS-CP-002`, because pair direction and relation signatures require a different solver contract.

## Authority documents

- `CLS-001-END-TO-END-DESIGN.md`
- `CLS-001-SOURCE-AND-OWNERSHIP-AUDIT.md`
- `CLS-CP-001/CLS-CP-001-FINAL-MULTILINGUAL-FREEZE.md`
- `CLS-CP-001/CLS-CP-001-SIMPLIFIED-STUDENT-EXPLANATION-STANDARD.md`
- `CLS-CP-002/CLS-CP-002-EXECUTABLE-DISCOVERY-PLAN.md`

## Release locks

`CLS-CP-001` is approved as a multilingual review-only runtime proof. `CLS-CP-002` is an English executable-discovery wave. Both remain unavailable to Question Studio, Question Bank, tests and public users until later explicit integration approval.
