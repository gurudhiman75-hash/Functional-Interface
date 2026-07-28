# COD-CP-009 — Implementation Plan

Status: **implementation roadmap; no permanent QLs; no runtime completion claimed**.

This plan deliberately separates solver proof, language-data proof, candidate-contract prototyping, QL discovery, permanent allocation, and production runtime. No stage may skip directly from design to a fixed QL registry.

---

## 1. Branch policy

Design branch:

```text
design/reasoning-cod-001-cp009-sentence-coding
```

Recommended implementation branches:

```text
feat/reasoning-cod-cp009-constraint-foundation
feat/reasoning-cod-cp009-english-prototypes
feat/reasoning-cod-cp009-ql-discovery-freeze
feat/reasoning-cod-cp009-english-runtime
feat/reasoning-cod-cp009-localization
```

All prototype branches target the latest stable COD-001 base. Permanent QL allocation must wait until earlier checkpoint ranges and the next chapter ID are known.

---

## 2. Stage 0 — Authority and source review

Required work:

- approve `cod-001-open-ql-discovery-amendment.md`;
- confirm checkpoint identity as `COD-CP-009`;
- review uploaded source formats and any additional SSC/Banking/Punjab references;
- classify exact, inverse, phrase, possible, impossible, missing-member and Data Sufficiency wrappers;
- record exclusions and cross-chapter ownership;
- approve prototype IDs and terminology.

Exit gate:

- no numbering dispute;
- no fixed QL count;
- no unresolved chapter-ownership conflict.

---

## 3. Stage 1 — Constraint foundation prototype

Implement checkpoint-local, non-discoverable modules:

```text
types.ts
canonical-set.ts
candidate-matrix.ts
constraint-solver.ts
independent-verifier.ts
solution-space.ts
solver-proof.test.ts
```

Capabilities:

- validate equal word/token cardinality per row;
- build active word and token universes;
- enforce a global bijection;
- propagate row intersections, exclusions and singletons;
- enumerate every consistent mapping within bounded domains;
- derive invariant pairs;
- derive candidate tokens per word and candidate words per token;
- classify exact, possible and impossible atomic relations;
- classify exact and possible set relations;
- emit deterministic diagnostics.

Mandatory tests:

- handwritten fixtures for each topology;
- inconsistent puzzle rejection;
- disconnected-component behavior;
- exact solution counts;
- comparison against an independent brute-force verifier;
- random small-universe differential testing;
- statement and token-order invariance;
- bounded-search failure diagnostics.

Exit gate:

- solver and independent verifier agree on every exhaustive fixture;
- no language rendering or QLs are added yet.

---

## 4. Stage 2 — Topology generator prototype

Implement:

```text
topology.ts
topology-generator.ts
row-minimality.ts
topology-proof.test.ts
```

Required topology families:

- direct singleton intersection;
- chained singleton propagation;
- set-difference elimination;
- forked evidence join;
- global bijection deduction;
- controlled partial information;
- phrase-set composition;
- missing-member completion.

The topology generator creates word-ID sets before any natural language is attached.

Mandatory audits:

- requested exact/possible/impossible multiplicity achieved;
- target connected to every required row;
- every row contributes to the query predicate;
- no duplicate or subset-equivalent rows;
- no accidental direct singleton in global-deduction topology;
- deterministic bounded yield;
- topology fingerprint stability.

Exit gate:

- abstract puzzles generate safely across all topology families;
- no sentence text is rendered yet.

---

## 5. Stage 3 — English language-data prototype

Implement curated, non-free-form data:

```text
datasets/code-tokens.ts
datasets/lexemes.en.ts
datasets/sentence-frames.en.ts
datasets/scenarios.en.ts
language-instantiator.ts
english-language-audit.test.ts
```

Requirements:

- natural semantic micro-scenarios;
- grammar-aware slot compatibility;
- controlled function-word use;
- content-word and function-word targets;
- sentence length three to five words;
- no random noun/verb mixing without compatibility;
- no sensitive or time-dependent content;
- neutral code tokens screened against active words and unintended meanings;
- skeleton-frequency metadata.

Review artifact:

- scenario catalogue showing every exact English statement family without code mappings;
- no QL IDs.

Exit gate:

- human approval of English sentence quality;
- sufficient scenario variety for every required topology.

---

## 6. Stage 4 — Exact atomic prototypes

Implement candidate contracts:

```text
COD-CP009-PROT-EXACT-WORD-TO-TOKEN
COD-CP009-PROT-EXACT-TOKEN-TO-WORD
```

Required files:

```text
prototype-contracts.ts
generator.ts
independent-solver.ts
ambiguity-checker.ts
distractors.ts
option-validator.ts
explanation-builder.ts
standard-exam-stem.ts
renderer-contract.ts
exact-atomic-prototype.test.ts
export-exact-atomic-review.ts
```

Coverage:

- direct singleton;
- chained singleton;
- set-difference;
- forked join;
- global bijection;
- forward and inverse direction;
- content and function words;
- three to six statement layouts.

Exit gate:

- exact answer invariant across every solution;
- all four option positions represented;
- no redundant rows;
- review stems and explanations approved.

---

## 7. Stage 5 — Exact set and missing-member prototypes

Implement candidates:

```text
COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS
COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE
COD-CP009-PROT-MISSING-TOKEN
COD-CP009-PROT-MISSING-WORD
```

Mandatory audits:

- canonical set equality;
- phrase answer invariant across all mappings;
- option member duplication rejection;
- omitted member invariant;
- blank renderer validity;
- correct explanation of order irrelevance;
- inverse language quality.

Exit gate:

- merge/split evidence gathered for exact atomic versus missing-member contracts;
- set answer type decision recorded.

---

## 8. Stage 6 — Partial-information prototypes

Implement candidates:

```text
COD-CP009-PROT-POSSIBLE-TOKEN
COD-CP009-PROT-POSSIBLE-WORD
COD-CP009-PROT-IMPOSSIBLE-TOKEN
COD-CP009-PROT-IMPOSSIBLE-WORD
COD-CP009-PROT-POSSIBLE-PHRASE-CODE
COD-CP009-PROT-POSSIBLE-DECODED-PHRASE
```

Mandatory audits:

- complete solution enumeration;
- selected possible option has at least one witness;
- selected possible option is not definite when required;
- possible distractors have zero witnesses;
- selected impossible option has zero witnesses;
- all impossible-question distractors have witnesses;
- explanation provides witness or contradiction as appropriate;
- bounded solution-space sizes;
- hard-difficulty instances without excessive reading load.

Exit gate:

- possible and impossible predicates independently verified;
- natural English review approved;
- low-yield or source-weak candidates identified for removal.

---

## 9. Stage 7 — Exhaustive QL discovery and merge/split audit

Inputs:

- all prototype test results;
- review corpora;
- source-format audit;
- generation yield and performance;
- duplicate and explanation-contract audits;
- unresolved questions from the discovery document.

Required decisions:

- merge or retain direct versus chained exact forms;
- merge or retain missing-member forms;
- retain or remove impossible inverse forms;
- retain or remove possible phrase forms;
- select final answer types;
- decide whether any solve mode needs its own QL;
- identify any missing concept, task, inverse, edge, representation or exam pattern;
- repeat prototypes until no meaningful gap remains.

Deliverables:

```text
COD-CP-009-FINAL-QL-DISCOVERY.md
COD-CP-009-COLLISION-AUDIT.md
COD-CP-009-ENGLISH-PROTOTYPE-REVIEW.md
```

Exit gate:

- final candidate boundaries approved;
- QL count discovered rather than targeted;
- earlier checkpoint allocation known or permanent IDs remain deferred.

---

## 10. Stage 8 — Permanent QL allocation

Only after Stage 7:

1. identify the next available chapter-wide QL ID;
2. assign one continuous permanent range to the approved CP-009 contracts;
3. replace prototype IDs with permanent QL IDs;
4. update the chapter manifest and chapter registry;
5. freeze solve modes and task ownership actually proven by the audit;
6. add migration notes showing each prototype's final merge/split outcome.

No permanent allocation occurs merely because the old manifest once reserved `209..240`.

---

## 11. Stage 9 — English runtime implementation

Convert approved prototypes into production checkpoint modules:

- final question-language registry;
- stable rule/task registry;
- production generator dispatch;
- runtime versioning;
- independent solver;
- ambiguity checker;
- option validator;
- structured renderer;
- explanation builder;
- difficulty scorer;
- review exporters;
- implementation report.

Production tests:

- high-seed deterministic stress per QL;
- solver/verifier agreement;
- exact/possible/impossible proof;
- row minimality;
- order invariance;
- answer-position distribution;
- difficulty distribution measured from instances;
- exact and normalized stem duplicates;
- sentence-skeleton concentration;
- unresolved placeholders;
- student-facing internal-ID leakage;
- API build.

Exit gate:

- English runtime proof complete;
- human English review accepted;
- checkpoint remains non-publishable.

---

## 12. Stage 10 — Hindi and Punjabi adaptation

Build native locale datasets rather than literal translations.

Order:

1. topology-preserving Hindi scenarios;
2. Hindi review and solver parity;
3. topology-preserving Punjabi scenarios;
4. Punjabi review and solver parity.

Required parity:

- solution multiplicity class;
- query semantics;
- topology fingerprint;
- answer cardinality;
- difficulty factors;
- option misconception roles;
- correct index where practical.

Required language gates:

- script integrity;
- native grammar and agreement;
- no unexplained English prose;
- code-token neutrality in locale;
- no unresolved placeholders;
- native manual approval.

---

## 13. Stage 11 — Question Studio and shared-solver exposure

Question Studio exposure follows checkpoint freeze. It must support reviewer-only solution-space diagnostics and student-safe previews.

The CP-009 solver may later expose a stable internal API to the Data Sufficiency chapter. That integration must not add Data Sufficiency QLs or answer semantics to CP-009 itself.

---

## 14. CI plan

Suggested workflows:

```text
reasoning-cod-001-cp009-solver-proof.yml
reasoning-cod-001-cp009-prototypes.yml
reasoning-cod-001-cp009-runtime.yml
reasoning-cod-001-cp009-localization.yml
```

Artifacts:

- solver differential report;
- topology-yield report;
- English scenario catalogue;
- prototype review HTML/JSONL;
- QL discovery matrix;
- final runtime review pack;
- localization review packs.

CI must distinguish:

- code written;
- tests executed;
- tests passed;
- source coverage reviewed;
- human editorial approval;
- freeze status.

---

## 15. Immediate next implementation action

Begin only the constraint foundation and abstract topology proof. Do not begin permanent language QLs, localization, Question Studio routing or chapter-wide ID allocation.

First implementation milestone:

```text
production solver versus independent exhaustive verifier
+ all exact/possible/impossible predicates
+ unordered code-token invariance
+ no permanent COD-QL IDs
```
