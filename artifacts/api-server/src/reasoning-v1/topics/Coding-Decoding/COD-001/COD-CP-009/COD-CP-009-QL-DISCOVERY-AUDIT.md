# COD-CP-009 — Provisional QL Discovery Audit

Status: **open discovery; no permanent QLs; no fixed count**.

This audit records the current candidate contracts, the evidence for each, provisional merge/split decisions, and remaining proof work. It must be updated from executable prototype results before any `COD-QL-*` IDs are assigned.

---

## 1. Discovery method

The audit covers every required axis:

1. source-observed exam formats;
2. concept and hidden-state differences;
3. query direction;
4. inverse contract;
5. answer semantics;
6. answer cardinality;
7. missing-member presentation;
8. inference topology;
9. ambiguity and solution multiplicity;
10. distractor truth predicate;
11. explanation proof obligation;
12. renderer and localization needs.

A candidate survives only when it is materially different on one or more of these axes and cannot be represented as an instance parameter of another contract.

---

## 2. Source-backed format inventory

Observed source formats support:

- exact code for one word from common-word/common-token comparison;
- exact word for one code token;
- chained deduction across several statements;
- a target whose code remains one of two possibilities;
- coding a new message or phrase from resolved components;
- sentence-code reasoning used as the subject of a Data Sufficiency question.

The Data Sufficiency wrapper is excluded from CP-009 ownership. The underlying solver may later be consumed by the Data Sufficiency chapter.

Missing-member and impossible-answer forms are common competitive-exam extensions but require executable prototype and broader source confirmation before permanent allocation.

---

## 3. Candidate contract table

| Candidate | Hidden-state need | Query predicate | Answer shape | Current decision |
|---|---|---|---|---|
| exact word → token | bijection solution space | target token invariant | one token | retain prototype |
| exact token → word | inverse bijection | target word invariant | one word | retain inverse prototype |
| exact phrase → token set | invariant image of word set | set equal in every solution | token set | retain prototype |
| exact token set → phrase | invariant inverse image | word set equal in every solution | phrase/word set | retain inverse prototype |
| missing token | invariant omitted member | one missing token | one token | retain presentation prototype |
| missing word | invariant omitted inverse member | one missing word | one word | retain inverse presentation prototype |
| possible token for word | partial solution space | relation true in some but not all solutions | one token | retain source-backed prototype |
| possible word for token | partial inverse space | relation true in some but not all solutions | one word | retain inverse prototype |
| impossible token for word | complete solution space | relation true in zero solutions | one token | retain prototype pending source/yield audit |
| impossible word for token | complete inverse space | relation true in zero solutions | one word | retain inverse prototype pending audit |
| possible phrase code | complete solution enumeration | offered set true in at least one solution | token set | retain advanced prototype |
| possible decoded phrase | complete inverse enumeration | offered word set true in at least one solution | phrase/word set | retain inverse advanced prototype |

No row is a QL at this stage.

---

## 4. Provisional merge decisions

### 4.1 Direct versus chained exact deduction

**Current decision:** one candidate contract per query predicate, with topology as an instance property.

Reason:

- both exact word-to-token questions return the same answer type;
- both use the same complete solution-space invariant;
- direct intersection, set difference and chained propagation differ in difficulty, not in correctness semantics;
- the explanation can render the shortest proof path dynamically.

Reopen split only if prototypes demonstrate incompatible generator domains, explanation schemas or ambiguity gates.

### 4.2 Three statements versus four/five/six statements

**Decision:** merge as instance parameters.

Statement count alone does not define a new reasoning contract.

### 4.3 Exact word-to-token versus missing-token

**Current decision:** retain separate prototypes.

Reason:

- missing-token presentation modifies a displayed row;
- it has a dedicated blank renderer and validation contract;
- the student answer is the omitted row member, not simply an abstract word's code;
- explanation must prove set completion at the blank.

The prototypes may merge later if runtime and editorial audits show no meaningful difference.

### 4.4 Possible versus impossible

**Decision:** separate.

Reason:

- possible requires an existence witness;
- impossible requires a universal exclusion proof;
- the option-validation predicates are complements but not interchangeable;
- distractor requirements reverse: possible questions need impossible distractors, while impossible questions need witnessed-possible distractors.

### 4.5 Atomic versus phrase/set answers

**Decision:** separate provisional contracts.

Reason:

- set canonicalization and option equality differ;
- phrase answers may combine independently inferred components;
- set distractors require omitted/extra/replaced-member models;
- the renderer and explanation must state order irrelevance.

### 4.6 Encode versus decode direction

**Decision:** retain inverse prototypes during discovery.

They may share the solver foundation, but inverse questions have different answer types, option pools, language templates and ambiguity risks.

---

## 5. Inference-mode inventory

The following solve modes must be exercised across the candidate contracts:

| Solve mode | Required proof |
|---|---|
| direct singleton intersection | one shared word and one shared token isolate the target |
| chained singleton propagation | an earlier resolved pair removes a later ambiguity |
| set-difference elimination | overlap sets are reduced by a third or later row |
| forked evidence join | independent branches jointly resolve the target |
| global bijection deduction | no local singleton suffices; one-to-one constraints resolve the target |
| complete possibility enumeration | candidate appears in some but not all solutions |
| complete impossibility enumeration | candidate appears in no solution while alternatives have witnesses |
| phrase-set composition | multiple target words are solved and combined |
| missing-member completion | one omitted row member is invariant |

These modes are exhaustive design requirements, not predetermined permanent QLs.

---

## 6. Edge-case inventory

Prototype audits must cover:

- target word appears in exactly two rows;
- target appears in three or more rows;
- target initially has two candidates;
- target initially has three candidates;
- no direct singleton exists anywhere;
- multiple valid complete mappings remain;
- only the target relation is invariant while unrelated pairs remain ambiguous;
- phrase code is invariant even though individual token assignments inside the phrase may swap;
- phrase code is not invariant;
- missing row member is unique;
- missing row member has multiple possibilities and must be rejected for exact contract;
- redundant row;
- disconnected row component;
- inconsistent row pair admitting no mapping;
- duplicate row with shuffled tokens;
- row subset that adds no information;
- token-order permutation;
- statement-order permutation;
- visually similar token pair;
- token accidentally equal to or suggestive of a source word;
- singular/plural or inflection collision in native text;
- function-word target versus content-word target.

---

## 7. Answer-semantics audit

### 7.1 Exact

An exact answer is accepted only when the query result is invariant across every valid mapping. The hidden generator mapping is irrelevant to this decision.

### 7.2 Possible

A possible answer is accepted only when:

- at least one valid mapping witnesses it;
- at least one valid mapping does not contain it, when the contract promises genuine uncertainty;
- all three distractors have zero witnesses.

### 7.3 Impossible

An impossible answer is accepted only when:

- it has zero valid mapping witnesses;
- each distractor has at least one witness;
- the explanation supplies an evidence-based contradiction or exclusion.

### 7.4 Phrase set

Token order does not affect equality. Option comparison uses canonical set serialization and rejects duplicate members.

---

## 8. Representation audit

Required representations:

- standard inline direction followed by statement-code rows;
- structured `STATEMENT_CODE_GRID`;
- one-row blank for missing-member prototypes;
- token-set options with normalized equality;
- phrase/word-set options with locale-aware display.

Not allocated as separate contracts:

- paragraph versus table visual layout;
- bullet versus numbered rows;
- different quotation styles;
- different deterministic token display orders.

---

## 9. Excluded ownership collisions

| Format | Owner | CP-009 decision |
|---|---|---|
| direct character substitution | COD-CP-001 | exclude |
| positional code-token order | COD-CP-001/005 depending operation | exclude |
| renaming real entities | COD-CP-008 | exclude |
| lookup table plus conditions | COD-CP-010 | exclude |
| operator/sign substitution | Mathematical Operations | exclude |
| determine whether statements are sufficient | Data Sufficiency | exclude wrapper; reusable solver allowed |
| general multi-attribute puzzle | Puzzle chapter | exclude |

---

## 10. Dataset discovery requirements

Before contract freeze, the English dataset must demonstrate enough natural variation across:

- descriptive statements;
- actor-action-object statements;
- linking-verb statements;
- modal/action statements;
- function-word and content-word targets;
- three-, four- and five-word sentences;
- multiple semantic themes without sensitive content.

No target contract is retained if it only works by producing unnatural sentence combinations.

---

## 11. Prototype evidence required for each candidate

Each candidate contract must produce a review corpus showing:

- at least three distinct inference topologies where logically applicable;
- deterministic variation over many seeds;
- all four answer positions;
- exact solver/verifier agreement;
- no option-predicate collision;
- no redundant row;
- standard exam wording;
- explanation proof appropriate to its answer semantics;
- no exact or normalized cross-contract stem duplication;
- acceptable generation yield within bounded attempts.

The exact seed count is chosen after initial yield measurement.

---

## 12. Current unresolved questions

1. Does exact token-set-to-phrase deserve a permanent inverse QL or merge with phrase-to-token under one bidirectional contract?
2. Are missing-token and missing-word forms materially distinct enough from atomic exact contracts after renderer abstraction?
3. Is the impossible-word inverse common enough in target exams to retain?
4. Can possible phrase-code questions be generated with natural statements and non-trivial but bounded solution spaces?
5. Should phrase answers be represented as `WORD_SET` rather than serialized `WORD_OR_LABEL`?
6. Does a source-backed “either A or B” answer require a complete candidate-set answer type?
7. What is the maximum active vocabulary that permits exhaustive proof with acceptable runtime?
8. Which topology properties should be metadata only, and which produce genuinely separate solve modes?

No permanent allocation is allowed while these remain unresolved.

---

## 13. Provisional discovery verdict

The current design has twelve candidate task contracts and nine required solve modes. These numbers are not target QL counts.

The likely stable conceptual boundaries are:

- exact versus possible versus impossible;
- encode versus inverse decode;
- atomic versus set answer;
- ordinary versus missing-member presentation.

Direct, chained, difference and global-bijection topologies are currently treated as runtime solve-mode variation. Executable prototypes must confirm or overturn that decision.

Final status: **OPEN — PROTOTYPE AND GAP AUDITS REQUIRED**.
