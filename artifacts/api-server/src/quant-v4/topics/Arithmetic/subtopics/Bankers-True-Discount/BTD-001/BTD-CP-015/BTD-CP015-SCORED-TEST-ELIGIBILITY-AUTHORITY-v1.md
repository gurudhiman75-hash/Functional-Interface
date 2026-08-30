# BTD-001 CP015 — Scored-Test Eligibility Authority v1

## Decision

BTD-001 CP015 authorizes **explicit scored-test eligibility activation for an already materialized CP014 exam-scoped projection**.

This is not a blanket chapter release. The admin must identify a concrete CP014 projection row, and that row must independently pass all CP015 state, placement, translation, option-model, and lifecycle checks before it is activated.

## Upstream authority

- CP014 materialization authority: `BTD-001-CP014-TEST-PROJECTION-MATERIALIZATION-v1`
- certified isolated CP014 head: `e77c6d84051d9d7b6b0e366f086daf1e112cc18b`
- CP014 source state: approved, unpublished, `testEligible=false`
- CP012 Question Bank source rows remain immutable provenance authorities.

## Activation model

The guarded CP015 action:

1. locks and reloads the exact projection row;
2. requires the CP014 materialization authority and deterministic `BTD-TEST-BUNDLE-*` identity;
3. requires `TEST_PROJECTION` mode and canonical English base language;
4. requires an active exam version and active mapped taxonomy nodes;
5. requires exactly one approved Hindi translation and one approved Punjabi translation, each complete and option-count aligned to English;
6. requires complete English stem/explanation and a valid single-correct option model;
7. refuses activation if mock-test or public-delivery state has drifted open;
8. changes only the projection eligibility metadata from `INELIGIBLE/false` to `ELIGIBLE/true`;
9. publishes the approved projection version into the internal blueprint pool;
10. keeps `mockTestEligible=false`, `publiclyPublishable=false`, and `automaticStudentPublication=false`;
11. records `content.question.btd_scored_test_eligibility_enabled` in the audit log.

The action is permission-gated by `tests.create` and uses optimistic `lock_version` conflict protection.

## Lifecycle boundary

CP015 authority state:

- `testEligibilityApprovalGranted = true`
- `testEligibility = ELIGIBLE`
- `testEligible = true`
- internal blueprint publication = authorized
- `mockTestEligible = false`
- `publiclyPublishable = false`
- `automaticStudentPublication = false`
- CP012 source Question Bank mutation = forbidden

No production BTD projection was activated while certifying this checkpoint.

## Original implementation certification

The original CP015 implementation was certified before CP014 route-isolation remediation:

- implementation head: `879eeb923a02ebdb6c1bcf55fc0b8d3588326d8c`
- run: `33303257946`
- job: `99235159829`
- result: **SUCCESS**
- artifact: `9729632550`
- artifact digest: `sha256:20d39e9adbe2c27dc62f98a6f902f51018015530d87d4f1785e502d0ff47e0b8`

## CP014-isolated restack certification

After CP014 moved its projection route out of the global route index and into the canonical Question Studio registry, CP015 was restacked as a **single seven-file eligibility overlay** directly on exact CP014 head `e77c6d84051d9d7b6b0e366f086daf1e112cc18b`.

Restacked implementation head before this authority-note update:

`a39bfc24a8878a0ef96eec299ad4a886ba20cb28`

GitHub Actions:

- PR-context run: `33318610900`
- job: `99276484894`
- conclusion: **SUCCESS**
- artifact: `9734225338`
- artifact digest: `sha256:27c2ccdc2eccc4a32a07365e501f6afa8f0939c61dd214394d715d33745b8b95`
- topology guard: **SUCCESS**
- unrelated NUM workflows triggered: **none**

The cumulative workflow first re-proved the corrected CP014 authority, then certified CP015.

### CP015 measured audit

- permanent QLs: 20
- exam scopes: 2
- seeds per QL per exam: 50
- eligibility plans validated: 2,000
- deterministic replay checks: 2,000
- placement checks: 10,000
- source-lock checks: 12,000
- lifecycle checks: 12,000
- test-only delivery-policy checks: 2,000
- blueprint-eligibility checks: 2,000
- unique projection bundle keys: 1,982
- safe deterministic repeats: 18
- unsafe projection collisions: 0
- minimum unique projection states in any QL × exam scope: 48 / 50
- CP014 cumulative re-proof: PASS
- static activation/downstream-lock guards: PASS
- API build: PASS
- exact-head assertion: PASS

### Safe repeat interpretation

A repeated bundle key is acceptable only when the complete source and placement identity is the same. Different deterministic seeds may resolve to an identical frozen CP012 source state. Any repeated key with different QL, source admission keys, exam version, primary taxonomy node, or taxonomy set is treated as an unsafe collision and fails certification.

## Production-data note

This checkpoint adds and certifies the explicit activation path only. No production BTD question was materialized or activated for scored tests during CI or this chat.

## Next gate

Mock-test eligibility and standalone/public delivery remain separate lifecycle decisions. Neither should be inferred from CP015 scored-test eligibility.
