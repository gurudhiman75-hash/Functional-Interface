# MEN-CP-010 — Permanent English Runtime V1 Candidate

Authority: `MEN-CP010-PERMANENT-ENGLISH-RUNTIME-V1-CANDIDATE`

## Status

`PERMANENT_ENGLISH_RUNTIME_CANDIDATE__HUMAN_REVIEW_REQUIRED__PRODUCT_LOCKED`

The 26 allocated MEN-CP-010 reasoning families (`MEN-002-QL-124..MEN-002-QL-149`) now have a deterministic English runtime candidate.

This is **not** an English freeze. Mathematical proof and permanent identity are stronger than the current editorial approval state.

## Runtime model

The runtime preserves the V4 reasoning-family merge while reusing the already machine-proved Wave 01–03 generators as representation sources.

Examples:

- one pyramid-volume QL can surface square, rectangular or triangular-base representations;
- one direct right-triangle QL can surface pyramid, conical-frustum, square-frustum or exact-surd representations;
- direct surface families can surface lateral/curved and total-area representations without creating duplicate QLs;
- inverse surface families deliberately include both lateral/curved and total-area forms;
- similarity, ratio, capacity, cost and scaling families retain their Wave-02 mathematical proof sources.

Every generated permanent question carries its permanent QL, template and solve-mode identity while preserving the source-wave/source-id trace for auditability.

## Machine proof target

The V1 runtime test generates:

```text
26 permanent QLs × 64 deterministic seeds = 1,664 questions
```

For every generated question it requires:

- permanent QL/template/solve-mode parity;
- exactly four unique options;
- exactly one correct option;
- correct-index parity;
- source mathematical verification;
- English teaching steps present;
- all product gates closed.

It additionally proves all declared representation sources are exercised and each permanent QL demonstrates all four answer positions across the deterministic proof set.

## Human review target

A separate balanced review builder selects exactly four records per QL:

```text
26 QLs × 4 answer positions = 104 review records
A = 26
B = 26
C = 26
D = 26
```

The review artifact includes:

- QL and cluster identity;
- source wave and source family;
- stem;
- four options and answer;
- teaching explanation;
- source verification.

Human review should judge exam realism, stem wording, distractor quality, explanation quality and representation breadth. Machine validity is not sufficient for freeze.

## Lifecycle boundary

```text
permanent QL allocation:       complete
permanent runtime candidate:   present
machine proof:                 pending CI
human English review:          pending
englishImplementationFrozen:   false
active:                        false
questionStudioDiscoverable:    false
questionBankStatus:            NOT_STORED
testEligibility:               INELIGIBLE
publiclyPublishable:           false
```

## Next decision

If CI passes, inspect the 104-question English review artifact. Remediate editorial weaknesses before changing `englishImplementationFrozen` or the chapter-wide engineering completion status.
