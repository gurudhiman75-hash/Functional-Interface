# NUM-CP-012 — Wave 00 Source and Ownership Register

**Checkpoint:** `NUM-CP-012`  
**Package:** `NUM-002`  
**Title:** Perfect Squares, Cubes and General Perfect Powers  
**Status:** discovery open; permanent QL count not proposed  
**Permanent QL allocation:** none

## Governing invariant

An integer is a perfect `k`th power exactly when every exponent in its prime factorisation is divisible by `k`. Multiplicative completion and reduction therefore operate on prime-exponent residues modulo `k`; root and boundary questions must preserve exact integer semantics rather than rely on decimal approximation.

The mere presence of a square/cube symbol does not make CP012 the owner. CP012 owns questions whose requested result materially depends on perfect-power classification, exact roots, perfect-power boundaries, or exponent-residue completion.

## Registered source and legacy demand

The chapter source/ownership audit provisionally maps these V2 families to CP012:

- `ns_perfect_square_completion`
- `ns_perfect_cube_completion`
- `ns_least_square_multiple`
- `ns_least_cube_multiple`
- `ns_square_factor_constraint`
- `ns_cube_factor_constraint`
- `ns_square_remainder_hybrid`
- `ns_square_divisibility_hybrid`
- `ns_square_factor_count_hybrid`

The audit requires:

- recovery of prime-exponent completion logic;
- square/cube merging only where a general perfect-power engine preserves learner reasoning;
- separate solve authorities only when answer semantic, shortcut or misconception topology materially differs;
- reassignment of generic algebraic square identities to Algebra.

The generic V2 optimisation/reconstruction pool also contains candidate states such as:

- `ns_minimum_addition`
- `ns_minimum_subtraction`
- `ns_minimum_multiplier`
- `ns_minimum_divisor`
- `ns_hidden_exponent_reconstruction`
- `ns_hidden_square_reconstruction`
- `ns_factor_count_square_hidden`

These labels are source candidates only. Ownership must be resolved from the requested semantic and necessary engine; none is automatically a CP012 authority.

## Mandatory source-gap discovery

Wave 01+ must search the following material families before permanent allocation.

### Recognition and exact roots

- identify whether a declared integer is a perfect square;
- perfect cube;
- general perfect `k`th power for exam-realistic `k`;
- exact integer square root;
- exact integer cube root;
- exact integer `k`th root where source-supported;
- verify a prime-factorisation-based perfect-power claim;
- terminal-digit compatibility as quick rejection only, never as sufficient proof.

### Range and boundary

- count perfect squares in a closed interval;
- count perfect cubes in a closed interval;
- nearest square/cube;
- least or greatest perfect power under a bound;
- consecutive perfect-power boundaries;
- terminal-pattern possible/impossible states where terminal evidence is used only as a necessary condition.

### Multiplicative completion and reduction

- least multiplier making a number a perfect square/cube/general `k`th power;
- least divisor making a number a perfect square/cube/general `k`th power;
- recover a missing prime exponent needed for perfect-power completion;
- least perfect-power multiple under a declared class;
- greatest perfect-power divisor;
- find a factor/number whose product with a declared integer is a perfect power.

### Additive completion

- least addition to reach the next perfect square;
- least subtraction to reach the previous perfect square;
- cube analogues where source-backed;
- nearest perfect power with an explicit tie convention.

### Solution-topology representations

Only after ordinary solve authorities are executable:

- claim / statement evaluation;
- bounded complete candidate set;
- one/many/no-solution classification;
- data sufficiency.

## Hard ownership boundaries

| Candidate | Owner | CP012 disposition |
|---|---|---|
| Perfect square/cube recognition from integer factorisation | CP012 | Retain |
| Exact integer square/cube/general root | CP012 | Retain |
| Least multiplier/divisor for perfect-power completion | CP012 | Retain |
| Missing exponent whose target condition is perfect `k`th power | CP012 | Retain |
| Count/nearest/boundary of numeric perfect powers | CP012 | Retain |
| Count of square/cube divisors of an integer | CP005 | Reassign |
| Ordinary divisor count merely constrained to be square/cube | CP005 or CP014 after ablation | Hold/reassign |
| Simplifying `sqrt(...)`, rationalising or surd arithmetic | Surds & Indices | Reassign |
| Algebraic identity such as `(a+b)^2` expansion/factorisation | Algebra | Reassign |
| Geometric area/side or volume/edge task | Mensuration | Reassign |
| Remainder requested from `n^2` or a square expression | CP008 candidate | Reassign unless perfect-power classification is essential |
| Terminal digit of square/cube as final answer | CP009 candidate | Reassign |
| Multi-engine task where perfect-power completion and another engine are independently necessary | CP014 candidate | Hold for ablation |

## Collision rules

### CP005 — divisor functions

```text
requested object = perfect-power status/root/completion of the integer → CP012
requested object = divisor count / square-divisor count / factor-count property → CP005
raw integer first needs perfect-power engine and then independent divisor-function reasoning → CP014 candidate
```

### Surds & Indices

```text
exact integer root as a Number System classification/inverse → CP012
symbolic radical simplification or exponent-law manipulation → Surds & Indices
```

### Algebra

```text
integer prime-exponent divisibility by k → CP012
polynomial square/cube identity or equation with no Number System perfect-power invariant → Algebra
```

### Mensuration

```text
integer nearest/completion to square or cube → CP012
side/area/volume interpretation is materially required → Mensuration
```

### CP008 / CP009

```text
remainder/residue is requested → CP008
terminal digit(s) are requested → CP009
square/cube terminal pattern used only to reject impossible perfect-power states → CP012 representation aid, not authority
```

## Conventions to close during discovery

- `0` is a perfect `k`th power for every positive integer `k` under ordinary integer convention because `0 = 0^k`; source representations may exclude zero only when the domain explicitly says positive integers.
- `1` is a perfect `k`th power for every positive integer `k`.
- Negative integers can be perfect odd powers but never perfect even powers over the integers.
- Exact roots must not be inferred from floating-point equality.
- A number already satisfying the target perfect-power class has least multiplier `1`, least divisor `1`, and least additive completion `0` where the question permits an unchanged number.
- “Least addition to make a perfect square” must state whether zero is allowed; ordinary ExamTree completion should allow zero unless wording says “next greater perfect square”.
- “Nearest perfect power” requires a deterministic tie rule when equal-distance candidates are possible.
- General `k` values must remain exam-realistic and source-backed; parameter generalisation alone is not a reason to generate exotic powers.
- Greatest perfect-power divisor must specify the target class (`square`, `cube`, or `k`th power) and return the divisor value, not its root unless explicitly requested.
- Least multiplier and least divisor are different residue transforms and must not share distractor logic blindly.

## Merge/split hypotheses to test

### Square/cube/general-`k` parameterisation

Initial hypothesis:

```text
same exponent-residue invariant
+ same completion transform
+ same answer semantic
→ merge square/cube/general-k as representations/parameters
```

Do **not** merge when:

- negative-domain behaviour changes materially (cube/odd power vs square/even power);
- a square/cube-specific boundary shortcut changes the learner algorithm;
- answer semantics differ (root vs multiplier vs divisor vs count);
- misconception topology materially changes.

### Recognition versus exact root

Recognition (`yes/no`) and exact root (`r`) share the same exact-power state but have different answer semantics. Wave discovery must test whether one authority with representation variants remains pedagogically clean or whether root reconstruction deserves a split.

### Additive versus multiplicative completion

These are presumed distinct until ablation proves otherwise:

- additive completion uses adjacent perfect-power boundaries;
- multiplicative completion uses prime-exponent residues.

They should not be merged merely because both use the phrase “make a perfect square/cube”.

## Temporary Wave 01 foundation candidates

Wave 01 should begin with the smallest executable engines required to prove the checkpoint:

1. `NUM-CP012-PROT-001` — perfect square/cube/general-`k` recognition from exact factorisation.
2. `NUM-CP012-PROT-002` — exact integer square/cube root.
3. `NUM-CP012-PROT-003` — least multiplier for perfect `k`th-power completion.
4. `NUM-CP012-PROT-004` — least divisor for perfect `k`th-power reduction.
5. `NUM-CP012-PROT-005` — recover a missing prime exponent to satisfy perfect-power class.
6. `NUM-CP012-PROT-006` — greatest perfect-`k`th-power divisor.
7. `NUM-CP012-PROT-007` — count perfect squares/cubes in a bounded interval.
8. `NUM-CP012-PROT-008` — least addition / subtraction to adjacent square or cube boundary, with direction explicit.

These are temporary discovery identities only. They do **not** imply eight permanent QLs.

## Verification contract

Canonical and verifier routes must be materially different.

Recommended pairings:

```text
prime-factor exponent divisibility / residue completion
↔ exact integer-power construction and divisibility checks

exact integer root via bounded integer method
↔ direct multiplication/power equality

range count from integer-root boundaries
↔ bounded enumeration of every integer in the rendered interval

least additive boundary completion
↔ bounded search from the rendered integer until an exact power is found
```

Every executable prototype must additionally prove:

- deterministic replay;
- exact canonical/verifier agreement;
- unique learner options;
- misconception-derived distractors;
- answer-position reachability;
- state diversity;
- structured human explanations;
- lifecycle locks.

## Lifecycle

All CP012 discovery outputs remain locked:

- `active = false`
- `questionStudioDiscoverable = false`
- `questionBankWritable = false`
- `testEligible = false`
- `publiclyPublishable = false`

No permanent ID is reserved. CP012 must obtain the actual next-free Number System QL only after CP011 has completed permanent allocation and the CP012 source-saturation count is itself approved.

## Wave 00 exit condition

Wave 0 is ready to close only when:

- V2/source families are registered;
- CP005 / Surds & Indices / Algebra / Mensuration / CP008 / CP009 boundaries are explicit;
- zero/one/negative/tie conventions are recorded;
- merge/split hypotheses are stated before implementation;
- Wave 01 prototype IDs remain temporary;
- no runtime or permanent-identity gate has opened.
