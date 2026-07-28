# CLS-001 — Classification / Odd One Out

Status: `OPEN_EXECUTABLE_DISCOVERY`

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

Classification asks the learner to identify the option that does not share the uniquely intended class, property or relation of the remaining options.

The chapter is not implemented as a bag of static facts or a generic "three are alike" template. Every admitted question must expose a machine-readable classification rule, construct a valid four-option state, prove that exactly one option is the outlier, and be independently re-solved from the displayed options.

## Open-inventory policy

Permanent QL and solve-mode totals are not predetermined. They will be discovered from source evidence and executable coverage across:

- semantic classes and relationships;
- lexical and word-structure properties;
- number properties and transformations;
- number pairs, triples and sets;
- alphabet and letter-pair properties;
- letter-cluster and word-pattern rules;
- mixed alpha-numeric-symbol states;
- direct outlier, odd-pair, class-member and equivalent-group task directions;
- inverse, edge, representation, ambiguity and misconception audits.

No `CLS-QL-*` identity is reserved by this design foundation.

## Provisional checkpoint ownership hypotheses

The following checkpoints organise discovery work only. They may be merged, split, reassigned or rejected after executable audits.

| Checkpoint | Working scope |
|---|---|
| `CLS-CP-001` | Semantic word and entity classification |
| `CLS-CP-002` | Semantic pair and relationship classification |
| `CLS-CP-003` | Lexical, spelling and word-structure classification |
| `CLS-CP-004` | Number-property classification |
| `CLS-CP-005` | Number-pair, triple and set classification |
| `CLS-CP-006` | Alphabet, letter-pair and letter-class classification |
| `CLS-CP-007` | Letter-cluster and explicit word-pattern classification |
| `CLS-CP-008` | Mixed token and bounded synthesis classification |

These are ownership hypotheses, not QL allocations.

## Strict chapter boundary

CLS-001 owns questions whose final task is classification by a visible or inferable common property or pair-local relation.

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

## Source foundation

Initial uploaded-source review confirms recurring competitive-exam forms covering:

- single-word semantic odd-one-out;
- word-pair relation odd-one-out;
- number odd-one-out;
- number-pair and number-set odd-one-out;
- letter, letter-pair and letter-cluster odd-one-out;
- jumbled-word semantic grouping;
- identify another member of a supplied class;
- identify the set most similar to a given set.

Source examples are discovery evidence only. They are not copied into production and do not determine a fixed QL count.

## First implementation milestone

Start `CLS-CP-001` with non-permanent English prototypes for curated semantic word classification. The first executable wave must establish:

1. a versioned semantic entity/class dataset;
2. positive class membership and explicit exclusion evidence;
3. four-option valid-state-first construction;
4. a canonical classifier and a materially separate independent verifier;
5. ambiguity rejection against alternative supported classes;
6. misconception-labelled distractors and balanced answer placement;
7. teacher-style explanations showing why three options form one class and why the fourth does not;
8. deterministic review exports;
9. zero permanent QLs until source, ownership, merge/split and gap audits close.

See:

- `CLS-001-END-TO-END-DESIGN.md`
- `CLS-001-SOURCE-AND-OWNERSHIP-AUDIT.md`
- `CLS-CP-001/CLS-CP-001-EXECUTABLE-DISCOVERY-PLAN.md`
