# TRG-001 Runtime Proof Status

Status: **IMPLEMENTED — PROOF ONLY / NOT ACTIVATED**

This checkpoint implements the first executable English runtime proof for `TRG-001` on top of the Phase 1 mathematical foundation. It is deliberately smaller than the planned 72-QL MVP and is not production-authorized.

## Scope

Exactly **30 permanent proof QLs** are implemented: five from each `TRG-001` canonical problem.

| CP | Proof QLs | Purpose |
|---|---|---|
| `TRG-CP-001` | `TRG-001-QL-001...005` | right-triangle ratios, Pythagorean reconstruction, side recovery, reciprocal ratio |
| `TRG-CP-002` | `TRG-001-QL-025...029` | standard values and exact standard-angle expressions |
| `TRG-CP-003` | `TRG-001-QL-049...053` | degree/radian conversion, complementary/reduction/coterminal relations |
| `TRG-CP-004` | `TRG-001-QL-073...077` | fundamental identities and expression simplification |
| `TRG-CP-005` | `TRG-001-QL-097...101` | derived ratios, conjugate identities and controlled relations |
| `TRG-CP-006` | `TRG-001-QL-121...125` | mixed expressions, angle-sum/double-angle applications and sine-area application |

All QL IDs remain inside the Phase 0 package-local allocation. No IDs outside these proof slots are claimed implemented by this checkpoint.

## Runtime contract

Each proof question is generated from:

1. permanent QL identity and solve mode;
2. deterministic seed;
3. canonical mathematical state;
4. exact Phase 1 arithmetic/angle/trig authority;
5. misconception-based distractors;
6. independent verification;
7. generated explanation;
8. final validation and deterministic fingerprint.

The runtime rejects mathematically equivalent option collisions before returning a question.

## Coverage demonstrated

The proof intentionally exercises all major `TRG-001` foundations before expansion:

- direct `sin`/`cos` side ratios;
- Pythagorean side reconstruction;
- side recovery from a trigonometric ratio;
- reciprocal/derived ratio reconstruction;
- exact standard values;
- exact standard-value products and powers;
- degree-to-radian and radian-to-degree conversion;
- complementary relations;
- quadrant/reduction/coterminal reasoning;
- `sin²θ + cos²θ = 1`;
- `1 + tan²θ = sec²θ`;
- `1 + cot²θ = cosec²θ`;
- rational identity simplification;
- `sec θ ± tan θ` and `cosec θ ± cot θ` conjugate relations;
- `sin θ + cos θ` derived relation;
- linear `a sin θ = b cos θ` relation;
- mixed standard-angle expressions;
- sine angle-sum expansion;
- double-angle expansion;
- triangle area using `1/2 ab sin C`;
- composite tangent/cotangent expression.

## Validation gates encoded in `runtime-proof.test.ts`

The committed test asserts:

- exactly 30 proof QLs;
- exactly five QLs per CP;
- 30 unique QL IDs;
- 30 distinct solve modes;
- all QLs stay inside their Phase 0 ranges;
- deterministic same-seed regeneration;
- valid final validator result;
- independent verifier agreement;
- exactly four options;
- exactly one correct option;
- no duplicate rendered options;
- valid correct index;
- activation locks remain closed;
- no unresolved stem placeholders;
- explanation has a meaningful rule and reasoning step;
- no long decimal leakage in published answers;
- same-QL stem variation across the canonical seed set.

## Implementation-harness evidence

Before committing the runtime proof, the implementation was exercised with the matching Phase 1 mathematical contracts:

- strict TypeScript contract compile: **PASS**;
- 12 canonical seeds per QL: **360 generated cases**;
- deterministic repeat check for all 360 canonical cases: **PASS**;
- 50-seed package sweep: **1,500 generated cases**;
- final validation across the sweep: **PASS**;
- independent verification across the sweep: **PASS**.

This evidence is implementation-harness evidence. It is not represented as a GitHub Actions/CI run where no such workflow has executed for this stacked checkpoint.

## Defects caught during proof construction

The proof stage exposed several option-design collisions where independently generated distractors simplified to the same mathematical value as another option. Those were corrected before commit. This validates the decision to compare options by canonical mathematical value rather than rendered text alone.

## Activation lock

Every generated proof question is forced to:

- `reviewStatus = UNREVIEWED`;
- `questionBankStatus = NOT_STORED`;
- `testEligibility = INELIGIBLE`;
- `publiclyPublishable = false`;
- `questionStudioDiscoverable = false`;
- `proofOnly = true`.

No Question Studio registry, Test Builder registry, question bank, or public production route is changed by this checkpoint.

## What this checkpoint does not claim

It does not claim:

- the 72-QL `TRG-001` MVP;
- `144/144` `TRG-001` completion;
- human editorial approval;
- Question Studio activation;
- production test eligibility;
- Hindi/Punjabi readiness;
- `TRG-002` implementation.

## Next authorized checkpoint

**TRG-001 MVP expansion: 72 / 144 English QLs.**

The 30 proof QLs should be retained as architectural anchors while the missing MVP QLs are added with the same exact-answer, option-equivalence, verification, determinism and activation-lock contracts.
