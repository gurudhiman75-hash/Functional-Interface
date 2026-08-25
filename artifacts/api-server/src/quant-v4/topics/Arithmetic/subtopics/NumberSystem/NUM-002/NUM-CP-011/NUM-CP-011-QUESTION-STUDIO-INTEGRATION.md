# NUM-CP-011 — Question Studio Integration

**Checkpoint:** `NUM-CP-011 — Factorials, Prime Valuations and Trailing Zeroes`  
**Package:** `NUM-002`  
**Permanent QLs:** `NUM-QL-213..225`  
**Languages:** English, Hindi and Punjabi  
**Runtime:** frozen authority source exposed to Question Studio only

## Integration boundary

Question Studio may generate review batches from the frozen CP011 authorities. This does not write generated content into the Question Bank and does not make any item test/mock/public eligible.

Source selection is explicit. CP011 claims a request only when at least one of these is present:

- checkpoint `NUM-CP-011`;
- pattern containing `NUM-CP-011`;
- permanent QL `NUM-QL-213..225`.

It does not claim a package-only `NUM-002` request, preserving CP008's historical package fallback.

## Shared NUM-002 capability

The shared Question Studio capability now aggregates:

- `NUM-CP-008` — QLs `166..184`;
- `NUM-CP-009` — QLs `185..196`;
- `NUM-CP-010` — QLs `197..212`;
- `NUM-CP-011` — QLs `213..225`.

Total frozen permanent QLs exposed through the current NUM-002 Question Studio capability: **60**.

## Admin-route ownership

The real admin route must independently recognize CP011. Static route proof requires:

```text
patternId includes num cp 011
checkpointId = NUM-CP-011
NUM-QL-213..225 -> NUM-CP-011
requested CP/QL CP011 -> NUM-002
Hindi/Punjabi target allowlist includes NUM-CP-011
```

The CP011 workflow reads and audits the route source directly so an engine-only integration cannot pass while the admin route is stale.

## Generated package contract

Every Question Studio package keeps:

- permanent QL and authority ID;
- prototype ancestry;
- mathematical fingerprint and hidden state;
- canonical/verifier agreement;
- correct-option binding;
- misconception metadata;
- frozen English or final Hindi/Punjabi learner content;
- source traceability.

Question Studio sets only its review-source visibility flag:

```text
runtimeMode = QUESTION_STUDIO_ACTIVE
questionStudioDiscoverable = true
questionBankStatus = NOT_STORED
questionBankWritable = false
testEligibility = INELIGIBLE
testEligible = false
mockTestEligible = false
publiclyPublishable = false
automaticStudentPublication = false
```

## Regression policy

The integration proof includes:

- all 13 QLs in all 3 languages;
- explicit QL generation and unfiltered authority reach;
- final multilingual textual-answer binding;
- NUM-002 shared capability aggregation;
- actual admin-route markers;
- CP010 dispatch regression, ensuring CP011 does not steal older requests.
