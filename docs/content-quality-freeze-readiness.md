# Content Quality freeze readiness

## Frozen aggregate scope

Content Quality is read-only aggregate reporting over canonical Question Bank, Question Studio review events, taxonomy, validation runs and translation records.

Included:
- 7, 30, 90 and 365 day windows
- review throughput and current question-state aggregates
- latest-resolution semantics for open review comments
- chapter/subtopic approval, target coverage and placeholder signals
- aggregate unresolved duplicate-decision signals
- latest chapter freeze state and stale-freeze detection
- reviewer assignment ageing at 48 and 96 hours
- validation-run and translation-readiness aggregates
- global canonical data-quality diagnostics
- bounded, formula-safe, non-PII CSV export

Excluded:
- automated duplicate decisions
- automatic chapter freeze/unfreeze
- reviewer performance scoring
- student data or student rankings
- mutation or auto-remediation
- speculative quality scores

## Correctness boundaries

Review comments use the latest resolution event for each comment rather than treating any historical resolved event as permanently final. Chapter freeze is diagnostic only: changes after the latest freeze event mark the freeze stale but do not mutate governance state. Assignment ageing is operational queue age, not completed-review productivity.

## Freeze decision

Source freeze-ready for the declared aggregate scope. Future changes should be limited to confirmed correctness defects, schema compatibility, performance hardening that preserves metric definitions, or separately designed expansions.

## Production certification boundary

Source freeze does not certify deployed runtime behaviour. API build, admin typecheck/tests/build, authenticated production queries and large-dataset timings must be observed through CI and deployment verification before production certification.
