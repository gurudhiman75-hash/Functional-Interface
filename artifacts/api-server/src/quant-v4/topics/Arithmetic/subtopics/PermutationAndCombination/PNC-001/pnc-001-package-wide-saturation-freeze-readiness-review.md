# PNC-001 Package-Wide Saturation & Freeze-Readiness Review

> **Package:** `PNC-001 — Counting Foundations, Basic Permutations & Basic Combinations`  
> **Canonical problems:** `PNC-CP-001` through `PNC-CP-006`  
> **Current English QLs:** `PNC-QL-001` through `PNC-QL-104`  
> **Current solve modes:** 34  
> **Review branch:** `feat/pnc-cp006-selection-role-assignment-proof`  
> **Review PR:** `#98`  
> **Baseline verified head:** `2e573f136976fe9f65cc0911a0acba3d87a853e5`  
> **Baseline workflow:** `30084137157`  
> **Date opened:** 2026-07-24  
> **Review status:** `PENDING PACKAGE-WIDE REVIEW`  
> **Freeze recommendation:** `NOT YET DECIDED`

---

## 1. Purpose

This review determines whether the first P&C package is:

1. correctly partitioned across its six fixed CP ownership boundaries;
2. sufficiently saturated for its target SSC, Banking, Railways and Punjab-state aptitude scope;
3. technically stable across generation, solving, verification, explanations, options and validation;
4. editorially realistic and diverse enough for mock-test use;
5. free from blocking duplicates, placeholders, ownership leakage and unsupported claims;
6. ready for English freeze, localization preparation and eventual Question Studio integration.

This is a review and correction phase, not an automatic expansion phase. New QLs or modes may be added only when the audit identifies a material structural gap. There is no required final QL count.

---

## 2. Current Verified Baseline

| Item | Baseline |
|---|---:|
| Active canonical problems | 6 |
| English QLs | 104 |
| Active solve modes | 34 |
| Explanation strategies | 34 |
| Easy QLs | 39 |
| Medium QLs | 44 |
| Hard QLs | 21 |
| Seeds per QL | 12 |
| Deterministic seed cases | 1,248 |
| Generated twice per seed | Yes |
| Exact duplicate English templates | 0 |
| Publicly publishable | No |
| Generation-engine routing | Disabled |
| Admin/Question Studio exposure | Disabled |

Baseline automated proof already passed:

- strict targeted TypeScript compilation;
- proof-test bundling;
- registry/language parity;
- placeholder resolution;
- deterministic repeatability;
- formula-solver and independent-verifier agreement;
- four unique positive options with one correct answer;
- all current validation gates;
- complete 104-QL checkpoint audit.

These results establish runtime proof only. They do not by themselves prove content saturation, full editorial maturity or production readiness.

---

## 3. Fixed Ownership Map

| CP | Ownership boundary | Current QLs | Current status |
|---|---|---:|---|
| `PNC-CP-001` | Fundamental counting principle, disjoint cases, complement, exact factor recovery and supporting factorial reasoning | 58 | Runtime proof |
| `PNC-CP-002` | Distinct linear permutations and direct positional assignments | 8 | Runtime proof |
| `PNC-CP-003` | Basic combinations and direct unordered selection | 8 | Runtime proof |
| `PNC-CP-004` | Digit, number, code and password formation | 12 | Runtime proof |
| `PNC-CP-005` | Word, letter and multiset arrangements | 8 | Partial-scope runtime proof; saturation must be reviewed carefully |
| `PNC-CP-006` | Selection-then-arrangement and role assignment | 10 | Runtime proof |

Ownership rule:

- CP-002 owns direct ordering from the full pool.
- CP-003 owns unordered selection only.
- CP-006 owns an explicit selection stage followed by ordering or role assignment.
- CP-004 owns digit/code semantics, including leading zero and repetition policy.
- CP-005 owns letter/word identity and indistinguishable multiplicities.
- General together/apart, position, category, circular and grouping restrictions remain in PNC-002 (`CP-007` through `CP-012`).

---

## 4. Review Method

Every finding must be classified as one of:

- **BLOCKER** — prevents merge, freeze or next-package implementation;
- **HIGH** — significant correctness, ownership or realism defect;
- **MEDIUM** — meaningful quality or coverage weakness;
- **LOW** — non-blocking polish or future improvement;
- **OBSERVATION** — evidence recorded without corrective action.

Every finding must record:

| Field | Required content |
|---|---|
| Finding ID | `PNC-RVW-###` |
| Severity | BLOCKER / HIGH / MEDIUM / LOW / OBSERVATION |
| CP/QL scope | Exact CP, QL, mode or file |
| Category | Coverage / ownership / math / runtime / explanation / option / editorial / localization / integration |
| Evidence | Reproducible example or measured result |
| Required action | Specific correction or documented acceptance |
| Status | OPEN / FIXED / ACCEPTED / DEFERRED |
| Verification | Test, audit, review or commit proving closure |

---

## 5. Package-Level Architecture Review

### 5.1 Package and CP ownership

- [ ] Every QL belongs to the correct one of the six fixed CPs.
- [ ] No CP-006 QL merely duplicates direct `nPr` ownership from CP-002.
- [ ] No CP-004 number/code QL is disguised as a generic permutation QL.
- [ ] No CP-005 word/multiset QL leaks general restriction ownership from CP-007/CP-008.
- [ ] No current QL requires CP-009 category-conditional selection.
- [ ] Complex mixed systems are not prematurely absorbed from CP-012.
- [ ] QL IDs may follow admission order without implying CP order.
- [ ] Companion-library boundaries remain understandable and maintainable.

**Architecture verdict:** `PENDING`

### 5.2 Authority separation

- [ ] Human-owned stems, registry records, constraints and explanation strategies remain separate from code-owned runtime logic.
- [ ] Solver remains the sole final-answer authority.
- [ ] Explanations consume solver evidence rather than recalculate independently.
- [ ] Options consume the final answer and misconception evidence without answer leakage.
- [ ] Validators independently reconstruct decisive invariants.
- [ ] CP-006 routed modules do not weaken CP-001–005 exhaustive typing or behavior.

**Authority verdict:** `PENDING`

### 5.3 Need-based architecture

- [ ] No fixed QL quota is treated as a target.
- [ ] No unused solve mode was declared in advance.
- [ ] Every active mode has at least one materially distinct admitted QL.
- [ ] Similar contexts reuse the same mode when the mathematical contract is identical.
- [ ] New modes are required by distinct solver/evidence/validator behavior.

**Need-based verdict:** `PENDING`

---

## 6. CP-by-CP Saturation Review

### 6.1 PNC-CP-001 — Counting Foundations

Current represented directions:

- sequential multiplication;
- mutually exclusive addition;
- disjoint sum-of-products;
- simple complement;
- missing-factor recovery;
- factorial value, identities, cancellation and bounded inverse reasoning.

Review:

- [ ] Contexts adequately cover routes, choices, menus, clothing, codes and other exam-relevant counting situations without context concentration.
- [ ] Addition-rule stems clearly establish mutual exclusivity.
- [ ] Product-rule stems clearly establish sequential independent stages.
- [ ] Case-partition stems use complete and non-overlapping cases.
- [ ] Complement stems define unrestricted and invalid spaces unambiguously.
- [ ] Factorial content is supporting foundation rather than an oversized algebra drill set.
- [ ] CP-001 does not absorb permutation, combination or restriction ownership.
- [ ] Additional proposed QLs mostly collapse into existing semantic fingerprints.

**Saturation verdict:** `PENDING`

### 6.2 PNC-CP-002 — Distinct Linear Permutations

Current represented directions:

- arrange all distinct objects;
- arrange `r` from `n` distinct objects;
- ranked medals and direct offices;
- bounded inverse `nPr` parameters.

Review:

- [ ] Direct all-object and partial-order constructions are covered.
- [ ] Ordered code/no-repetition ownership is reconciled with CP-004.
- [ ] Direct offices from the full candidate pool remain distinct from CP-006 select-then-assign systems.
- [ ] Inverse `n` and `r` search domains are unique and exam-realistic.
- [ ] No unrestricted positional motif of material importance is absent.
- [ ] Restricted starts/ends, relative order and gaps remain deferred to CP-008.

**Saturation verdict:** `PENDING`

### 6.3 PNC-CP-003 — Basic Combinations

Current represented directions:

- direct unordered selection;
- teams, committees, pairs and triples;
- bounded inverse `nCr` parameters;
- complementary-index symmetry.

Review:

- [ ] Direct selection contexts are diverse enough without noun substitution.
- [ ] Order-irrelevance is explicit or naturally implied.
- [ ] Symmetry and inverse directions are sufficiently represented.
- [ ] Conditional inclusion/exclusion and category casework remain deferred to CP-009.
- [ ] CP-003 does not duplicate the selection stage inside CP-006 without a distinct answer demand.

**Saturation verdict:** `PENDING`

### 6.4 PNC-CP-004 — Digit, Number, Code & Password Formation

Current represented directions:

- no-zero/no-repetition numbers;
- zero-inclusive leading-zero correction;
- repetition-allowed codes and numbers;
- even and odd numbers;
- divisibility by 5;
- leading-threshold cases;
- fixed-pattern alphanumeric codes;
- inverse alphabet size;
- exactly-one-pair code pattern.

Review:

- [ ] Every stem distinguishes number semantics from code/password semantics.
- [ ] Leading zero is handled correctly in all number families.
- [ ] Repetition policy is explicit and consistent.
- [ ] Parity and divisibility cases preserve no-repetition state.
- [ ] Threshold questions are controlled and not disguised unrestricted casework.
- [ ] Exactly-one-pair logic excludes triples, two pairs and all-distinct strings.
- [ ] Important exam-relevant digit-formation directions are not missing.
- [ ] Proposed additions do not actually belong to CP-007/CP-008 restrictions.

Candidate gaps to assess, not automatically implement:

- fixed-position digit restrictions;
- divisibility by 2/3/4/9/10 where P&C—not number theory—is the intended method;
- numbers within an interval requiring more than a first-digit threshold;
- repetition patterns beyond `2,1,1`;
- passwords with separate required character categories.

**Saturation verdict:** `PENDING`

### 6.5 PNC-CP-005 — Word, Letter & Multiset Arrangements

Current represented directions:

- one, two and three repeated categories;
- fixed unique or repeated first letter;
- indistinguishable-swap overcount factor;
- bounded recovery of one multiplicity;
- word and non-word multiset contexts.

Review:

- [ ] Direct repeated-letter word arrangements are sufficiently diverse.
- [ ] Fixed-position multiplicity reduction is correct for unique and repeated letters.
- [ ] Solver evidence clearly identifies numerator and all correction factors.
- [ ] Current coverage is not falsely treated as complete merely because multiset arithmetic works.
- [ ] Word-specific vowel/consonant or dictionary-order families are assessed against CP-005 ownership.
- [ ] General together/apart and position restrictions are not pulled forward from CP-007/CP-008.
- [ ] Partial selection-and-arrangement of letters is assessed for CP-005 versus CP-006 ownership.

Candidate gaps requiring an explicit decision:

- dictionary rank of a word with distinct or repeated letters;
- selecting and arranging a subset of letters from a word/multiset;
- simple vowel/consonant word profiles where letter identity is the primary concept;
- forming words with a specified first/last letter beyond the currently fixed BALLOON examples;
- repeated-letter arrangements under a word-specific condition that does not belong more cleanly to CP-007/CP-008.

**Saturation verdict:** `PENDING — HIGHEST-PRIORITY COVERAGE REVIEW`

### 6.6 PNC-CP-006 — Selection-Then-Arrangement & Role Assignment

Current represented directions:

- committee then chairperson;
- team then captain/vice-captain;
- committee then three offices;
- shortlist then ranked awards;
- select then arrange all selected objects;
- role-assignment multiplier;
- inverse recovery of total pool, selected size or role count.

Review:

- [ ] Every direct QL visibly contains both selection and ordering/assignment stages.
- [ ] One-chair, two-role and three-role contexts reuse the same mathematical authority.
- [ ] `nCs × sPk` evidence preserves both factors.
- [ ] `nCs × s! = nPs` is used as a bridge, not as a reason to reclassify the QL into CP-002.
- [ ] Role-multiplier QL isolates `sPk` only after a committee is already selected.
- [ ] Inverse search domains contain exactly one valid solution.
- [ ] Complex conditions remain deferred to CP-012.
- [ ] Additional proposed QLs mostly collapse into the four existing contracts.

**Saturation verdict:** `PENDING`

---

## 7. Mathematical Correctness Review

For every QL across representative and stress seeds:

- [ ] Parameters satisfy domain constraints.
- [ ] Final answer is an exact positive integer within the configured ceiling.
- [ ] Solver equation matches the actual computation.
- [ ] Independent verifier uses a genuinely separate construction where practical.
- [ ] Solver and verifier agree.
- [ ] Inverse modes reconstruct the target exactly.
- [ ] Inverse domains have a unique answer.
- [ ] Symmetry and equivalence identities are applied only under their stated conditions.
- [ ] Repetition, identity, order and leading-zero policies are explicit in evidence.
- [ ] No floating-point arithmetic affects counting authority.

Stress areas:

- factorial and multiset ceilings;
- CP-004 parity/divisibility case boundaries;
- CP-004 exact multiplicity pattern enumeration;
- CP-005 multiplicity sums and fixed repeated objects;
- CP-006 role count close to selected-group size;
- CP-006 inverse selected-size uniqueness.

**Mathematical verdict:** `PENDING`

---

## 8. Explanation Review

- [ ] Explanation begins by identifying whether the task is selection, arrangement, or both.
- [ ] Order relevance is stated naturally where confusion is likely.
- [ ] Every factor in the final product has a visible meaning.
- [ ] Case partitions name complete, non-overlapping cases.
- [ ] Multiset explanations state why repeated swaps do not create new outcomes.
- [ ] Digit/number explanations state the leading-zero and repetition rules.
- [ ] CP-006 explanations show selection count and role/arrangement count separately.
- [ ] Inverse explanations state the bounded search domain and exact match.
- [ ] No explanation merely repeats a formula without interpreting the scenario.
- [ ] No explanation recalculates independently from untrusted values.
- [ ] MathJax, plain equations and prose agree.

**Explanation verdict:** `PENDING`

---

## 9. Option & Distractor Review

- [ ] Every generated item has four unique options.
- [ ] Correct answer appears exactly once.
- [ ] Every distractor is a positive integer and remains within safe limits.
- [ ] Generic ±1 fallbacks remain below the configured cap.
- [ ] Distractors represent real misconceptions, not arbitrary noise.

Required misconception coverage:

- sum instead of product;
- product instead of sum;
- unrestricted total instead of complement;
- permutation instead of combination;
- combination instead of permutation;
- forgetting `r!` or identical-object correction;
- allowing leading zero;
- allowing forbidden repetition;
- missing parity/divisibility cases;
- selection-only versus assignment-only in CP-006;
- adding mixed stages instead of multiplying;
- `sCk`, `sPk` and `s^k` confusion.

- [ ] Distractors remain context-realistic and do not reveal the method through extreme magnitudes.
- [ ] Options do not contain duplicate rendered strings.

**Option verdict:** `PENDING`

---

## 10. Editorial Realism Review

Review all 104 English stems and representative generated instances.

- [ ] Stems resemble competitive-exam questions rather than classroom demonstrations.
- [ ] No artificial labels such as “Example”, “Sample” or “Template” remain.
- [ ] Grammar, punctuation and singular/plural agreement are correct after rendering.
- [ ] Variables have realistic nouns and units.
- [ ] Questions are self-contained.
- [ ] No stem exposes implementation terminology such as solve mode, registry or multiplicity state.
- [ ] Formal terms such as permutation, combination and factorial are used only when exam-realistic.
- [ ] Contexts are culturally and professionally neutral unless target-exam relevance justifies otherwise.
- [ ] No implausible committee, team, digit or role counts are generated.
- [ ] Answer demand is explicit.

Context-concentration review:

- [ ] No single noun/context family dominates a CP.
- [ ] Committee/team contexts do not overwhelm CP-003 and CP-006.
- [ ] Word examples in CP-005 are not limited to only APPLE/BALLOON/MISSISSIPPI in final mature coverage.
- [ ] Route/menu/clothing examples do not dominate CP-001.

**Editorial verdict:** `PENDING`

---

## 11. Duplicate & Semantic-Saturation Review

### 11.1 Exact duplicate gates

- [ ] Exact duplicate English templates: 0.
- [ ] Duplicate QL IDs: 0.
- [ ] Duplicate registry ownership: 0.
- [ ] Duplicate explanation IDs: 0.
- [ ] Duplicate generated options within an item: 0.

### 11.2 Near-duplicate review

Compare normalized stems after removing:

- noun substitutions;
- variable names and numeric placeholders;
- superficial word-order changes;
- singular/plural cosmetic differences.

- [ ] No pair of QLs has the same reasoning topology, answer demand, constraint profile and misconception profile without a documented editorial reason.
- [ ] Same-mode QLs add context, difficulty, solve direction or localization value.
- [ ] CP-001’s large 58-QL set is reviewed especially carefully for semantic clones.
- [ ] CP-006 direct role contexts are not merely renamed copies.

### 11.3 Saturation decision

For each CP, classify proposed additions as:

- material gap;
- useful editorial diversity;
- localization need;
- near-clone/reject;
- belongs to another CP/package.

**Duplicate/saturation verdict:** `PENDING`

---

## 12. Runtime & Determinism Review

Required automated gates:

- [ ] strict targeted TypeScript compilation;
- [ ] proof-test bundling;
- [ ] 104-QL coverage audit;
- [ ] 12 deterministic seeds per QL;
- [ ] each seed generated twice with identical output;
- [ ] independent-verifier agreement;
- [ ] validation passes for every case;
- [ ] registry/language parity;
- [ ] placeholder parity;
- [ ] all CP routing;
- [ ] unsupported Hindi/Punjabi requests fail explicitly;
- [ ] no generation-engine/admin/production route changed accidentally.

Recommended additional stress runs:

| Stress area | Minimum evidence |
|---|---:|
| All QLs | 50 seeds per QL |
| CP-004 parity/divisibility | 500 combined cases |
| CP-005 multiset/fixed-position | 500 combined cases |
| CP-006 inverse modes | 500 combined cases |
| Same-QL diversity | 100 seeds for each high-volume mode |
| Option uniqueness | all stress cases |
| Answer ceiling | all stress cases |

**Runtime verdict:** `PENDING`

---

## 13. Library & Placeholder Review

- [ ] Every English QL has exactly one active registry record.
- [ ] Every registry record references an existing QL.
- [ ] Template placeholders exactly match required variables.
- [ ] Render variables contain no unused or missing values.
- [ ] Explanation IDs resolve uniquely.
- [ ] Constraint and distractor profiles resolve uniquely.
- [ ] No stale CP-004/CP-005 misclassification remains in active files.
- [ ] Current checkpoint manifests match runtime counts.
- [ ] Historical reports are clearly dated and not mistaken for current state.
- [ ] Companion libraries have documented authority.

**Library verdict:** `PENDING`

---

## 14. Localization Readiness

English freeze must precede Hindi and Punjabi content authoring.

- [ ] English stems are final enough to avoid repeated translation churn.
- [ ] Placeholders are grammatical and reorderable in Hindi and Punjabi.
- [ ] Gendered nouns and role titles have localization guidance.
- [ ] Mathematical notation does not depend on English word order.
- [ ] Number/code distinctions can be translated unambiguously.
- [ ] “Selection”, “arrangement”, “distinct roles”, “repetition” and “identical objects” have approved terminology.
- [ ] Word-based CP-005 QLs have a localization policy: retain English source word, transliterate, or author language-specific words.
- [ ] Dictionary-rank or letter-position content, if admitted, has a language-specific ownership decision.
- [ ] Human-review CSV templates are prepared for English, Hindi and Punjabi.

**Localization verdict:** `PENDING`

---

## 15. Integration & Publication Readiness

Current state must remain non-public during this review.

- [ ] `publiclyPublishable` remains `false` until approval.
- [ ] Generation-engine discovery remains disabled until package-level approval.
- [ ] Question Studio/admin exposure remains disabled until review findings close.
- [ ] API contract and route ownership are documented before integration.
- [ ] Package identifier and CP filters are stable.
- [ ] Maturity transition criteria are explicit.
- [ ] Rollback path exists for integration changes.
- [ ] PNC-002 implementation can proceed independently without forcing premature PNC-001 publication.

**Integration verdict:** `PENDING`

---

## 16. Required Review Outputs

The review is complete only when the following are produced:

1. `pnc-001-package-wide-review-findings.md`
2. `pnc-001-ownership-overlap-audit.md`
3. `pnc-001-coverage-saturation-matrix.md`
4. `pnc-001-editorial-realism-audit.md`
5. `pnc-001-duplicate-and-near-clone-audit.md`
6. `pnc-001-runtime-stress-audit.md`
7. `pnc-001-language-readiness-report.md`
8. `pnc-001-final-maturity-audit.md`
9. human-review export covering all 104 English QLs

Any repairs must include a correction report and new final workflow evidence.

---

## 17. Findings Register

| Finding ID | Severity | Scope | Category | Finding | Required action | Status | Verification |
|---|---|---|---|---|---|---|---|
| `PNC-RVW-001` | — | — | — | Review not yet executed | Complete package-wide audit | OPEN | — |

---

## 18. Freeze Decision Rules

### Freeze blocked when any of the following remains

- mathematical or solver/verifier disagreement;
- unresolved placeholder or registry mismatch;
- invalid or non-unique options;
- incorrect CP ownership;
- material uncovered direction inside a PNC-001 CP;
- high-risk semantic duplicate concentration;
- unrealistic or ambiguous stems at meaningful scale;
- unclosed BLOCKER or HIGH findings;
- incomplete English human review;
- undocumented localization blockers;
- accidental production/admin exposure.

### Eligible for English freeze review when

- all automated gates are green on the final head;
- all BLOCKER and HIGH findings are fixed;
- every CP has an explicit saturation verdict;
- ownership overlap is resolved;
- full English human review is complete;
- remaining MEDIUM/LOW findings are fixed or consciously accepted;
- localization readiness is documented;
- publication remains disabled pending explicit product approval.

### Final verdict values

Use exactly one:

- `FREEZE BLOCKED`
- `REPAIR REQUIRED`
- `ELIGIBLE FOR ENGLISH FREEZE REVIEW`
- `ENGLISH FREEZE APPROVED`
- `PRODUCTION INTEGRATION APPROVED`

Current verdict:

```text
REVIEW NOT YET EXECUTED
```

---

## 19. Next Action

Execute this review against the final green CP-006 branch. Do not begin production integration or declare PNC-001 frozen from the existing runtime proof alone. PNC-002 design and implementation may proceed separately only if it does not bypass unresolved PNC-001 ownership or architecture findings.
