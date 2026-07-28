# COD-CP-009 — Executable Gap and Merge/Split Resolution

Status: **executable discovery in progress; 12 contracts proven; 4 source-backed contracts still require prototypes; no permanent QLs**.

This document supersedes the provisional conclusions in `COD-CP-009-QL-DISCOVERY-AUDIT.md` wherever executable evidence is now available. It does not allocate `COD-QL-*` identities.

---

## 1. Governing rule

CP-009 QL count is discovered rather than targeted.

Permanent identities may be assigned only after:

1. every source-backed task contract has an executable prototype;
2. every inverse and answer-semantics boundary has been tested;
3. solve modes have been merge/split audited;
4. no meaningful concept, task, inverse, edge, representation or exam-pattern gap remains;
5. cross-contract duplicate and collision audits pass.

The 168 existing COD-001 QLs in CP-001 through CP-006 remain permanent and unaffected.

---

## 2. Executable foundation now proven

The merged CP-009 foundation provides:

- hidden bijective word-token systems;
- unordered statement and code-token-set semantics;
- a signature-group production solver;
- an independent brute-force mapping verifier;
- complete consistent-mapping enumeration;
- exact, possible and impossible relation classification;
- exact and possible word/token-set classification;
- missing-word and missing-token reconstruction;
- query-specific row-minimality checks;
- topology fingerprints invariant under row order, token order and relabelling;
- student-safe statement-grid payloads;
- curated English frames and scenarios;
- deterministic review exporters.

No prototype is publicly publishable or discoverable in Question Studio.

---

## 3. Proven inference topologies

| Topology | Complete mappings | Main proof demand | Status |
|---|---:|---|---|
| direct singleton intersection | 1 | one common word and token | proven |
| chained singleton propagation | 1 | resolve helper, then eliminate | proven |
| set-difference elimination | 2, target invariant | remove a later-row overlap | proven |
| forked evidence join | 1 | resolve two independent branches | proven |
| global bijection deduction | 1 | no local singleton; use global one-to-one structure | proven |
| controlled two-way partial information | 2 | two unresolved cross-pairings | proven |
| controlled three-way partial information | 6 | three unresolved cross-pairings | proven |
| invariant ambiguous phrase set | 2 | individual pairs swap, combined set fixed | proven |
| missing-member completion | 1 | reconstruct one omitted row member | proven |

Statement count and candidate width are not independent task contracts. They remain bounded instance parameters unless later editorial evidence shows a different solving operation.

---

## 4. Twelve executable task contracts

### 4.1 Exact atomic

1. exact word to code token;
2. exact code token to word.

Executable evidence:

- five exact topologies per direction;
- 800 audited questions;
- independently solved displayed puzzles;
- two active misconception distractors plus `Cannot be determined`;
- topology-specific explanations;
- natural English review completed.

Current merge decision:

- encode and inverse decode remain separate contracts;
- topology remains runtime solve-mode variation at the task-contract layer;
- final QL registry may still split solve-mode identities because the QL schema exposes one `solveMode` value. This decision remains open until the final registry design.

### 4.2 Exact invariant set

3. exact word set to code-token set;
4. exact code-token set to word set.

Executable evidence:

- two complete mappings remain;
- individual assignments are ambiguous;
- the combined two-member set is invariant;
- canonical unordered-set option equality is proven;
- encode and inverse answer domains remain distinct.

Decision: retain both inverse contracts.

### 4.3 Missing member

5. missing code token;
6. missing word.

Executable evidence:

- one displayed row contains one blank;
- the two complete rows identify the omitted pair;
- incomplete prompt reconstruction is independently solved;
- student payload and explanation are materially different from ordinary atomic exact questions.

Decision: retain separate presentation contracts. Missing token and missing word remain inverse contracts.

### 4.4 Possible atomic relation

7. possible code token for a word;
8. possible word for a code token.

Executable evidence:

- two-way and three-way uncertainty supported by one parameterised architecture;
- correct option has at least one but not all mapping witnesses;
- all distractors have zero witnesses;
- candidate width two versus three changes difficulty but not task semantics.

Decision: retain encode and inverse contracts; merge candidate width as an instance parameter.

### 4.5 Impossible atomic relation

9. impossible code token for a word;
10. impossible word for a code token.

Executable evidence:

- three-way topology supplies three witnessed distractors and one zero-witness answer;
- correct option is absent from all six complete mappings;
- every distractor has two witnesses;
- explanation uses universal exclusion rather than an existence witness.

Decision: retain possible and impossible as separate contracts. Retain both query directions during English runtime implementation. Broader source frequency remains an editorial weighting issue, not a correctness issue.

### 4.6 Possible mixed set

11. possible code-token set for a word pair;
12. possible word pair for a code-token set.

Executable evidence:

- one unresolved core member is combined with one independently resolved member;
- two-way topology yields two possible sets;
- three-way topology yields three possible sets;
- correct option is witnessed in some but not all mappings;
- every distractor set has zero witnesses;
- Medium/Hard difficulty varies with uncertainty width.

Decision: retain encode and inverse contracts; merge two-way and three-way width as instance parameters.

---

## 5. Newly discovered source-backed gaps

The executable matrix revealed that two source-observed behaviours are not represented by the twelve contracts above.

### 5.1 Exact composition from independently resolved components

Source inventory explicitly includes coding a new message or phrase from resolved components.

This is not the same as the proven invariant ambiguous-set contract:

- invariant ambiguous set: two individual pairs remain unresolved, but their combined set is fixed;
- resolved composition: two or more individual word-token pairs are independently proved in different evidence branches and then combined for a new query.

Required prototypes:

13. exact resolved word set to code-token set;
14. exact resolved code-token set to word set.

Required proof:

- each component pair is independently invariant;
- the queried combination does not appear as one displayed statement;
- the answer set is composed only after the component proofs;
- removing either evidence branch destroys the complete composed answer;
- set order remains irrelevant.

### 5.2 Complete candidate-set answer

Source inventory includes targets whose code remains one of two possibilities. Selecting one possible option does not fully represent the common exam answer form `either X or Y`.

Required prototypes:

15. complete possible-code set for one word;
16. complete possible-word set for one code token.

This differs from ordinary possible atomic questions:

- ordinary possible: choose one witnessed relation;
- complete candidate set: return the entire invariant candidate domain for one target.

Required proof:

- the option equals the target's complete candidate set across the solution space;
- no candidate is omitted;
- no impossible member is added;
- two-way and three-way candidate widths are supported;
- answer type is `CODE_TOKEN_SET` or `WORD_SET`, not a serialized sentence label.

These four contracts must be prototyped before permanent QL allocation.

---

## 6. Explicitly rejected formal expansions

The following are not retained merely because they are mathematically symmetrical:

### 6.1 Impossible phrase or set

Current decision: exclude from the permanent candidate inventory unless direct source evidence is found.

Reason:

- no inspected source pattern requires it;
- the skill is already exercised by impossible atomic relations and set validation;
- generating every predicate × direction × answer-cardinality product would create combinatorial content rather than exam-driven coverage.

### 6.2 Data Sufficiency wrapper

Excluded from CP-009 ownership. The solver may be reused by the Data Sufficiency chapter.

### 6.3 Positional code-token order

Excluded. CP-009 tokens are unordered membership sets. Positional encoding belongs to direct/permutation coding checkpoints.

### 6.4 Static layout variants

Table versus paragraph, bullet versus numbered row, quotation style and deterministic token order are renderer parameters, not QLs.

---

## 7. Current merge/split decisions

| Axis | Decision | Executable basis |
|---|---|---|
| encode vs inverse decode | split | different answer domains, options and language |
| exact vs possible vs impossible | split | invariant, existence and universal-exclusion proofs differ |
| atomic vs set answer | split | canonical set equality and distractors differ |
| ordinary vs missing-member | split | blank payload and reconstruction proof differ |
| two-way vs three-way uncertainty | merge | same predicate/generator architecture; width is parameter |
| statement count | merge | count alone does not change solve operation |
| possible vs complete candidate set | split | one witnessed member versus entire candidate domain |
| invariant ambiguous set vs resolved composition | split | different evidence and explanation obligations |
| exact atomic topology modes | task contract merged; final QL split unresolved | one runtime works, but QL `solveMode` is singular |

---

## 8. Dataset and editorial findings

The language runtime now has five reviewed scenarios for each of nine topologies. Manual review already caused two substantive corrections:

- awkward modifier sequences were replaced with natural actor-verb-object messages;
- reviewer-only abstract row/word identifiers were removed from student payloads.

Remaining dataset work before English freeze:

- add more independently reviewed semantic themes after task contracts freeze;
- check normalised sentence-skeleton concentration across all prototypes;
- audit function-word versus content-word target distribution;
- decide whether linking-verb or modal frames add genuine exam variation or only surface diversity;
- run exact and normalised cross-contract stem/explanation duplicate scans.

These are editorial/runtime-quality gates, not evidence for new task contracts by themselves.

---

## 9. Final prototype sequence

Before permanent IDs:

1. implement exact resolved-composition encode prototype;
2. implement exact resolved-composition inverse prototype;
3. implement complete candidate-code-set prototype;
4. implement complete candidate-word-set inverse prototype;
5. audit all sixteen contracts together;
6. perform solve-mode merge/split resolution for final QL registry;
7. run concept/task/inverse/edge/representation/exam-pattern gap audit;
8. freeze the discovered contract and solve-mode inventory;
9. only then allocate continuous `COD-QL-*` IDs after `COD-QL-168`.

---

## 10. Current verdict

- executable task contracts proven: **12**;
- source-backed task contracts still requiring prototypes: **4**;
- proven inference topologies: **9**;
- permanent CP-009 QLs: **0**;
- fixed CP-009 QL count: **none**;
- publishability: **false**.

Final status: **OPEN — FOUR SOURCE-BACKED GAP PROTOTYPES REMAIN**.
