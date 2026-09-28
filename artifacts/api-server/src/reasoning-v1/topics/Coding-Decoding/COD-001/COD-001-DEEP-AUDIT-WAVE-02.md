# COD-001 — Deep Audit Wave 02

Status: **IMPLEMENTED — VALIDATION ACTIVE**

Date: 2026-09-28

## Focus

Wave 02 audits difficulty integrity and generated learner-surface quality across the completed 203-QL Coding–Decoding chapter.

Novelty remains deferred.

## Finding 1 — CP008 difficulty depended directly on seed

The renaming-code runtime used seed remainder checks inside difficulty assignment:

- direct-renaming difficulty used `seed % 3`;
- semantic-renaming difficulty used `seed % 4`.

That allowed otherwise comparable visible reasoning states to move between bands because of the random seed.

### Remediation

CP008 difficulty now follows only the displayed/generated reasoning burden.

Direct renamed-label questions:

- short open-chain mapping: Easy;
- cycle or denser mapping: Medium.

Semantic-referent-then-rename questions:

- baseline semantic recovery + renaming: Medium;
- category inference combined with a cycle or longer mapping: Hard.

No seed remainder participates in difficulty classification.

## Existing CP001–CP006 difficulty engine

The shared legacy scorer for CP001–CP006 was reviewed separately.

It already derives difficulty from:

- rule complexity;
- transformation depth;
- inference burden;
- information density;
- distractor proximity;
- target length/evidence state;
- checkpoint-specific structural constraints.

Its `allowedDifficulties` values are QL design bounds, not an explicit user difficulty request/fallback contract.

Wave 02 therefore does not rewrite that mature scorer without evidence of a generated-state defect.

## Permanent CP008 difficulty proof

`cod-001-deep-audit-wave2.test.ts` checks:

```text
2 permanent CP008 QLs × 3 locales × 60 seeds = 360 generated questions
```

For every instance it recomputes expected difficulty from:

- mapping topology;
- visible mapping length;
- semantic fact category.

It also checks basic stem hygiene and internal-word leakage.

## Chapter-wide generated profile

`cod-001-generated-profile.test.ts` adds a modern learner-surface profile over:

```text
203 QLs × 3 locales × 6 seeds = 3,654 Question Studio surfaces
```

For every QL/locale it requires:

- non-trivial stems;
- no mechanical/internal wording such as “associated with”, “most closely linked”, prototype/fingerprint/generator IDs;
- exactly four unique displayed options;
- a valid correct-answer index;
- no internal QA fields such as hidden fingerprints/source prototype IDs on the learner explanation surface;
- at least two visibly different stems across six seeds;
- at least two answer positions across six seeds.

This is a fatigue-resistance and learner-surface gate, not a novelty claim.

## Current disposition

```text
learner explanation projection:       REMEDIATED
Question Studio QA-field leakage:     REMEDIATED
CP008 seed-driven difficulty:         REMEDIATED
CP001–CP006 structural difficulty:    prior evidence strong
chapter-wide stem hygiene:            GENERATED PROFILE ADDED
visible repetition resistance:        GENERATED PROFILE ADDED
answer-position fingerprinting:       GENERATED PROFILE ADDED
option integrity:                     GENERATED PROFILE ADDED
multilingual parity:                  prior closure + current profile
distractor quality:                   deeper checkpoint/profile audit next
novelty:                              DEFERRED
chapter deep-audit closure:           NOT YET
```

Any QL that fails the generated profile should be remediated specifically rather than weakening the profile threshold.
