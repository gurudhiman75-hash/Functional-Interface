# PNC-CP-011 — Grouping & Distribution Discovery and Ownership

## Checkpoint status

`EXECUTABLE DISCOVERY IN PROGRESS — NO PERMANENT QL IDS ALLOCATED`

This checkpoint starts CP-011 from the exact saturated CP-010 head. It establishes the mathematical ownership model, exact counting authorities, independent small-state enumerators and a provisional contract matrix before any question-language inventory is frozen.

The next available immutable family ID remains `PNC-QL-209`.

## Why discovery precedes QL allocation

Grouping and distribution changes meaning along several independent axes. A stem that says “divide” or “distribute” is not enough to determine the count.

The runtime must first resolve:

1. whether the objects are distinct or identical;
2. whether the receiving groups or boxes are labelled or interchangeable;
3. whether every receiver must be used;
4. whether group sizes are prescribed, equal, unequal or unrestricted;
5. whether whole-group swaps create a new outcome;
6. whether occupancy lower or upper bounds apply;
7. whether a named person/object relation changes the partition;
8. whether the task is direct counting or bounded inverse recovery.

Predetermining a QL count before proving these distinctions would either merge materially different authorities or inflate the inventory with cosmetic variants.

## Positive ownership

CP-011 owns systems whose primary authority is partitioning or occupancy:

- distinct people or objects divided into labelled groups of prescribed sizes;
- distinct people or objects divided into unnamed groups, including equal and mixed repeated sizes;
- formation of unnamed pairs or equal teams;
- correction for swaps of interchangeable equal-sized groups;
- distinct objects assigned to labelled boxes, departments, rooms or recipients;
- distinct objects partitioned among identical non-empty boxes;
- identical objects distributed among labelled recipients, with empty or non-empty conditions;
- exact numbers of non-empty recipients;
- common lower bounds and controlled uniform capacities;
- identical objects placed into identical non-empty boxes through integer-partition authority;
- small relation restrictions such as two specified people being in the same or different equal group;
- bounded inverse recovery when the grouping/distribution contract is otherwise fixed.

## Negative boundaries

CP-011 does not own:

- ordinary committee selection with no partition after selection — CP-003 or CP-009;
- role assignment after selection — CP-006;
- linear or circular arrangement inside or between groups — CP-007, CP-008 or CP-010;
- category quotas distributed across several groups when the coupled casework is the primary difficulty — CP-012;
- mixed circular-selection-distribution systems — CP-012;
- unrestricted advanced generating-function systems, non-uniform capacities or large bounded integer-solution systems without target-exam evidence;
- probability of a grouping outcome — Probability;
- deterministic puzzle clues that ask which member belongs to which group — Reasoning grouping/arrangement chapters.

## Source-backed baseline

The reviewed P&C design material identifies labelled groups, unlabelled groups, equal and unequal group sizes, distinct-object distribution, non-empty restrictions and controlled identical-object distribution as the core family.

The reviewed SSC reference material supplies explicit authority for:

- dividing distinct objects into two or three prescribed groups;
- dividing equal groups with and without whole-group order;
- correcting equal unnamed groups by the factorial of the number of interchangeable groups;
- distributing identical objects among labelled recipients with empty recipients allowed;
- distributing identical objects when every recipient receives at least one.

These references support the baseline but do not freeze the final ExamTree inventory. Additional QLs require a material runtime or exam-pattern distinction.

## Exact authority map

### 1. Distinct objects into prescribed groups

For labelled groups of sizes `s₁, …, sᵣ`, where `n = s₁ + … + sᵣ`:

\[
\frac{n!}{s_1!s_2!\cdots s_r!}
\]

For unnamed groups, equal-sized groups are interchangeable. If a group size occurs `m` times, divide by `m!` for that size multiplicity:

\[
\frac{n!}{\left(\prod_i s_i!\right)\left(\prod_j m_j!\right)}
\]

This single rule handles equal teams, unnamed pairs and mixed profiles such as `(3,3,2,2)` without pretending that all groups are separately labelled.

### 2. Distinct objects into labelled boxes

With empty boxes allowed:

\[
r^n
\]

With every box non-empty:

\[
r!\,S(n,r)
\]

where `S(n,r)` is a Stirling number of the second kind.

With exactly `k` of `r` labelled boxes non-empty:

\[
\binom{r}{k}k!S(n,k)
\]

### 3. Distinct objects into identical boxes

Exactly `k` non-empty identical boxes:

\[
S(n,k)
\]

At most `k` non-empty identical boxes:

\[
\sum_{j=0}^{k}S(n,j)
\]

Allowing any number of non-empty identical boxes gives the Bell number.

### 4. Identical objects into labelled boxes

With empty boxes allowed:

\[
\binom{n+r-1}{r-1}
\]

With every box non-empty:

\[
\binom{n-1}{r-1}
\]

With exactly `k` of `r` boxes non-empty:

\[
\binom{r}{k}\binom{n-1}{k-1}
\]

A common minimum is handled by first reserving the minimum for each box. A controlled uniform capacity uses bounded inclusion–exclusion.

### 5. Identical objects into identical boxes

Exactly `k` non-empty identical boxes is the integer-partition count `p_k(n)`. This is materially different from stars and bars because both object identity and box identity are collapsed.

The discovery prototype uses the recurrence:

\[
p_k(n)=p_{k-1}(n-1)+p_k(n-k)
\]

with exact boundary conditions.

## Executable discovery proof

`foundation/cp011-discovery-prototype.ts` currently provides:

- exact `bigint` factorial, power and combination helpers;
- prescribed labelled and unlabelled group counts;
- equal-team and unnamed-pair counts;
- Stirling and Bell authorities;
- distinct-object labelled/identical-box authorities;
- stars-and-bars authorities with non-empty, exact-use, minimum and capacity conditions;
- integer-partition authority for identical boxes;
- same-group/different-group restrictions for a specified pair;
- bounded inverse search;
- independent labelled-assignment enumeration;
- independent restricted-growth-string set-partition enumeration;
- independent weak-composition enumeration;
- independent integer-partition enumeration.

The discovery test compares 35 formula results against independent enumeration across seven mathematical families. It allocates no QL IDs and exposes nothing to Question Studio.

## Provisional contract admission rule

The companion contract matrix uses discovery IDs, not QL IDs. A candidate becomes a solve mode only when at least one admitted QL proves that it needs a distinct equation, parameter schema, evidence payload, validator invariant, independent verifier, explanation flow or misconception contract.

Candidates may merge when the runtime distinction is cosmetic. They may split when a shared mode would create optional-field sprawl or hide a change in symmetry/occupancy semantics.

## Next implementation gate

Permanent QL allocation may begin only after:

1. the executable discovery workflow passes on the stacked branch;
2. the provisional matrix is audited against the available SSC/Banking/Punjab references;
3. labelled/unlabelled wording rules are frozen;
4. controlled-scope versus CP-012 boundaries are recorded;
5. the first human-owned English stem set passes duplicate and ambiguity review.

At that point, `PNC-QL-209` will be assigned to the first admitted CP-011 QL. The final QL and solve-mode counts remain need-based.
