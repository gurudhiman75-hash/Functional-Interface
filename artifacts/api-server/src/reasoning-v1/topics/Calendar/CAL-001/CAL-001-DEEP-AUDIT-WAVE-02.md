# CAL-001 — Deep Audit Wave 02

Status: **IMPLEMENTED — VALIDATION PENDING**

Date: 2026-09-27

## Finding 1 — seed-driven difficulty inflation

The previous Calendar difficulty helper injected random-seed terms into three dimensions:

- `D1ArithmeticSegments = 1 + (seed % 3)`;
- `D9TrapCollisions = 2 + (seed % 2)`;
- `D10InformationFiltering = seed % 3`.

This allowed the same solve family to move between difficulty bands partly because of seed arithmetic rather than learner-visible reasoning structure.

### Remediation

The default dimensions are now derived from the completed problem state:

- arithmetic segments follow the actual worked-solution segment count, bounded to 1..4;
- trap-collision baseline is stable unless a specific family overrides it;
- information filtering follows the amount of structured learner-visible fact state rather than the seed;
- reverse reasoning, month boundaries, leap-day exposure, century exposure, count interpretation, output complexity and inverse reasoning remain semantic features;
- family-specific overrides continue to take precedence.

No question is promoted merely because its random seed happens to have a larger remainder.

## Finding 2 — silent requested-difficulty fallback

Previously, Question Studio searched 256 candidates for the requested band and then silently returned the first candidate of another band if no match was found.

The returned label was truthful, but the request contract was not.

### Remediation

- explicit permanent-QL + difficulty requests now fail honestly when the requested band is not naturally reachable;
- mixed chapter generation searches compatible QLs before failing;
- no runtime path relabels an easier question as harder or vice versa.

## Difficulty reachability proof

`cal-001-difficulty-reachability.test.ts` builds an executable QL × difficulty matrix.

For each of the 36 permanent QLs and each requested band:

- successful generation must report exactly the requested difficulty;
- an unavailable band must fail with the explicit reachability error;
- every QL must expose at least one natural band.

It also requests 12-question mixed batches for Easy, Medium and Hard and requires every returned question to match the requested band.

## Stem audit

A source scan of Calendar runtime stems found no systematic use of the mechanical wording patterns that were removed from other Reasoning chapters, including:

- “associated with”;
- “most closely linked”;
- broad/meta wording.

The active stems are primarily direct day/date prompts and generally align with Calendar exam convention.

This is not treated as final stem closure until the generated review sweep completes, but no broad stem rewrite is currently justified.

## Lifecycle documentation drift

The root README previously claimed the obsolete discovery-only state:

- permanent QLs = 0;
- Question Studio disabled;
- downstream eligibility disabled.

The README now describes the current authority:

- `CAL-QL-001..036`;
- active Question Studio;
- approval-gated Question Bank/test/mock/publication workflow;
- manual approval required;
- automatic student publication disabled.

Historical freeze records remain unchanged.

## Current disposition

```text
source/exam coverage:               strong prior closure; final audit recheck ongoing
solver/foundation correctness:      strong prior proof
learner explanation surface:        REMEDIATED
difficulty model:                   REMEDIATED
difficulty request honesty:         REMEDIATED
difficulty reachability proof:      ADDED; CI validation pending
stem realism:                       no systematic wording defect found
distractor semantics:               misconception-based; deeper generated sweep pending
diversity/fatigue resistance:       pending final generated-profile sweep
multilingual parity:                strong prior proof; current-surface sweep pending
lifecycle docs:                     REMEDIATED
novelty:                            DEFERRED
chapter deep-audit closure:         NOT YET
```

The next wave should focus on generated-content profile evidence: diversity, repeated structural fingerprints, distractor plausibility, explanation simplicity across all three locales, and any QL-specific outliers exposed by the reachability matrix.
