# RNK-001 — Post-CP006 Chapter Gap Audit

Date: 2026-08-12  
Decision: **NO_NEW_QL_JUSTIFIED_YET**

## 1. Purpose

This audit was performed after freezing CP006 at `RNK-QL-039..041`.

It answers two questions:

1. Does the source-backed Ranking chapter still contain a materially different solve contract that deserves `RNK-QL-042`?
2. Is the current generation infrastructure diverse enough for Question Studio to produce large volumes without obvious presentation repetition?

The answers are:

```text
new Ranking authority justified now:  NO
frozen QLs to reopen:                 0
next available QL:                    RNK-QL-042
object/presentation pool expansion:   YES — significant
```

## 2. Source re-audit

The primary Ranking reference remains the Aggarwal Ranking chapter.

The source explicitly contains all of the following patterns:

- ordinary top/bottom and left/right rank arithmetic;
- total count from ranks at opposite ends;
- number of people between two ranked people;
- comparison tables that produce one strict order;
- comparison tables in which some people remain **uncomparable**;
- equal-score and equally-fast comparison classes;
- highest/lowest, exact position and middle-position queries;
- movement/standing-order style ranking examples.

Those source patterns now have implemented ownership across CP001..CP006.

The source also contains a mixed example that combines height comparison with gender/family inference. That does not justify another pure Ranking QL: the extra reasoning burden is Blood Relations / mixed-puzzle reasoning rather than Ranking itself.

## 3. Coverage after CP006

### CP001 — one-person rank arithmetic

Owns top/bottom or opposite-end conversion, totals, side counts and exact-middle arithmetic.

### CP002 — two-person positional constraints

Owns separation, people-between, mixed-end totals and exact/indeterminate total variants.

### CP003 — rank transformations

Owns interchange, movement, overtaking, insertion/removal and membership changes.

### CP004 — unique strict multi-entity order

State contract:

```text
ONE_UNIQUE_STRICT_TOTAL_ORDER
```

Frozen `RNK-QL-027..035`.

### CP005 — partial-order uncertainty

State contract:

```text
MULTIPLE_VALID_STRICT_TOTAL_ORDERS
```

Frozen `RNK-QL-036..038`.

### CP006 — equality-aware ranking

State contract:

```text
ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY
```

Frozen `RNK-QL-039..041`.

These three multi-entity state contracts are deliberately different. A new context or wording is not a new authority unless it changes the state, proof or answer contract.

## 4. Candidate gaps reviewed

### 4.1 Numerical rank after ties — HOLD

Example of the unsafe inference:

```text
Three candidates share 5th place. What rank follows?
```

This question is ambiguous unless a convention is declared. Competition ranking, dense ranking and fractional ranking do not produce the same answer.

The reviewed Ranking source proves equality classes, but it does **not** establish one universal post-tie numbering rule. Do not create a QL from an unstated convention.

### 4.2 Multiple independent tie groups — HOLD

A weak order such as:

```text
A = B > C > D = E > F
```

is mathematically straightforward, but no reviewed source fixture currently proves that this deserves a distinct exam authority rather than being a synthetic extension of CP006.

### 4.3 Tie class of three or more — HOLD

Likewise, a larger equality class is not automatically a new QL. It can be added later as a CP006 state-expansion only after source evidence and editorial review.

### 4.4 Shared Ranking caselets — INFRASTRUCTURE

A passage followed by several child questions can reuse existing QLs. Shared delivery does not itself change the solve contract.

### 4.5 Ranking + Blood Relation — OTHER CHAPTER / MIXED PUZZLE

If a question requires both comparative ordering and family/gender inference, both dimensions must be materially tested. Pure family inference does not become Ranking merely because a height statement appears in the stem.

### 4.6 “Advanced mixed transformations” — HOLD

CP001..CP006 already span arithmetic, pair constraints, movement, unique strict order, uncertainty and explicit equality. No reviewed source currently provides a non-overlapping advanced Ranking contract that needs `RNK-QL-042`.

## 5. Self-audit finding: the object pool was too small

The important remaining weakness is **not mathematical coverage**.

Several frozen generators use checkpoint-local name arrays. CP006, for example, was frozen from a 14-name English pool. That was sufficient to prove mathematics and editorial quality, but it is not the desired long-term Question Studio diversity for thousands of generated questions.

Changing those embedded pools now would invalidate frozen projections. Therefore the correct remediation is:

1. keep historical pools immutable inside frozen runtimes;
2. build a much larger versioned shared Ranking object registry;
3. require future discovery/runtime versions to opt into it explicitly;
4. keep projection compatibility tests around all frozen checkpoints.

## 6. RNK Object Pool V2

New future-facing shared registry:

```text
foundation/rnk-object-pool-v2.ts
```

Target/current inventory:

```text
people:             >= 96
male/female:        approximately balanced
locales/person:     English + Hindi + Punjabi
group objects:      >= 20
setting objects:    >= 18
ranking domains:    6
selection:          deterministic seeded API
Math.random():      prohibited in RNK V2 selector
```

The six ranking semantic domains are:

```text
GENERIC_RANK
SCORES
HEIGHT
SPEED
SENIORITY
PERFORMANCE
```

Group objects include candidates, students, applicants, trainees, interview candidates, runners, participants, employees, officers and other neutral exam-compatible groups.

Setting objects include merit lists, class rankings, recruitment/selection lists, interview shortlists, score rankings, training assessments, race orders, seniority lists and performance reviews.

## 7. Object-pool safety rules

The V2 registry must enforce:

- unique stable person IDs;
- unique visible names within each locale;
- NFC-normalized English/Hindi/Punjabi labels;
- no control characters;
- deterministic draws for a fixed seed;
- no repeated entity inside a generated group;
- balanced-gender selection mode for neutral Ranking contexts;
- deterministic setting/group selection;
- setting-to-group compatibility;
- no Seating Arrangement vocabulary or geometry in Ranking presentation objects;
- no name-based inference of rank, ability, seniority or performance.

## 8. Frozen compatibility rule

The new object pool is **not imported into CP004, CP005 or CP006 frozen projection paths**.

Their hashes must remain exactly:

```text
CP004
39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f

CP005
f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717

CP006
7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

Any object-pool change that modifies one of those hashes is a regression.

## 9. Roadmap correction

The original end-to-end design had provisional checkpoint assignments created before implementation evidence existed. It placed presentation-led contexts, attribute-led contexts and partial-order reasoning in later separate checkpoints.

Implementation proved that contexts are presentation dimensions, not QL ownership, while partial order and explicit equality deserve state-contract ownership.

The authoritative implemented map is now:

```text
CP001  one-person arithmetic
CP002  two-person positions/separation
CP003  movement/interchange/membership changes
CP004  unique strict total order
CP005  partial order / uncertainty
CP006  explicit equality / total preorder
CP007  CLOSED — no new authority justified yet
CP008  RESERVED — shared-caselet assembly is infrastructure
```

## 10. Final decision

Do **not** allocate `RNK-QL-042`.

Do **not** start CP007 question generation merely to continue numbering.

The next useful Ranking work is infrastructure-quality work:

- adopt the expanded object registry in future non-frozen generation versions;
- build broader context/surface variation around existing authorities when Question Studio integration is later authorized;
- reopen chapter discovery only when a primary exam source demonstrates a genuinely new solve contract.

## 11. Lifecycle

```text
frozen range:       RNK-QL-001..041
next available:     RNK-QL-042
CP007:              CLOSED / UNALLOCATED
Question Studio:    DISABLED
persistence:        DISABLED
Question Bank:      NOT_STORED
test eligibility:   INELIGIBLE
public publication: false
Hindi/Punjabi:      NOT_STARTED
```

This audit and pool expansion do not authorize merge, deployment, publication, persistence or Question Studio activation.
