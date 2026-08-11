# INT-CP-004 Question Studio Review Integration

## Status

INT-CP-004 is registered for **Question Studio review only** on the current-main integration branch.

This integration does not alter the approved learner content. It consumes the multilingual freeze authority:

- freeze: `INT-CP-004-HI-PA-v9-frozen`
- chapter: `INT-001`
- checkpoint: `INT-CP-004`
- permanent QLs: `INT-QL-067..INT-QL-085`
- registered languages: Hindi (`hi`) and Punjabi (`pa`)

## Current-main recovery method

The isolated Interest implementation line had diverged substantially from current `New-main`. A direct branch merge was rejected after it exposed 281 changed files / 511 commits.

The safe integration branch was created directly from current `New-main`, then only the frozen `Interest/INT-001` tree was transplanted by Git tree identity. No stale unrelated branch history was merged.

## Question Studio lifecycle

The adapter layer is deliberately distinct from the underlying source-freeze lifecycle.

The source frozen question remains inactive and non-deliverable. The Question Studio adapter grants only the ability to preview and persist review items:

```text
questionStudioRegistrationStatus: REGISTERED_REVIEW_ONLY
questionStudioStagingStatus:      REVIEW_QUEUE_ENABLED
questionStudioVisible:            true
questionStudioDiscoverable:       true
persistenceAllowed:               true
questionBankStatus:               NOT_STORED
questionBankWritable:             false
testEligibility:                  INELIGIBLE
testEligible:                     false
publiclyPublishable:              false
automaticStudentPublication:      false
```

Review approval therefore follows the existing narrow review-only approval policy and must skip Question Bank conversion.

## Frozen learner guarantees retained

Every review payload is generated through the multilingual frozen v9 runtime and fail-closes unless it retains:

- four distinct options and exactly one correct answer;
- zero learner-facing decimal tokens;
- formula as the first calculation step;
- explicit substitution/calculation after the formula;
- blank learner-facing wrong-option explanations;
- `ਮਿਸ਼ਰਤ ਵਿਆਜ` Punjabi terminology and the approved native-language surface;
- exact multilingual freeze identity and traceability.

## English boundary

English is intentionally **not** registered by this checkpoint. The historical English freeze predates the exam-friendly v9 numeric remediation and was not the learner surface approved for this Question Studio gate.

## Release boundary

This integration authorizes Question Studio preview, review-queue persistence and editorial review only. It does not authorize:

- Question Bank storage;
- scored-test or mock-test use;
- public/student delivery;
- automatic publication.

Those remain separate product-release gates.
