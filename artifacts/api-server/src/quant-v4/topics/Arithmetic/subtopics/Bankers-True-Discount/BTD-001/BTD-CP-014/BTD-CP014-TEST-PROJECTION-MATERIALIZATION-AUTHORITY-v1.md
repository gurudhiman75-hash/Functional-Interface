# BTD-001 CP014 — Test Projection Materialization Authority v1

## Decision

BTD-001 CP014 authorizes **explicit, admin-triggered exam-scoped test projection materialization** from the already certified CP012 Question Bank sources.

This checkpoint authorizes the projection write path only. It does **not** grant scored-test eligibility, mock-test eligibility, standalone public delivery, or automatic student publication.

## Upstream authority

- CP013 readiness authority: `BTD-001-CP013-SCORED-TEST-PROJECTION-READINESS-v1`
- CP012 source acceptance mode: `BANK_ONLY`
- CP012 Question Bank source rows remain immutable provenance authorities.

## Canonical multilingual projection model

Each exam/taxonomy-scoped BTD projection is materialized as:

1. one new English base `content.questions` / `content.question_versions` projection row;
2. target `exam_version_id` and canonical taxonomy links on that projection version;
3. approved Hindi translation copied from the exact frozen, manually approved CP012 Hindi source sibling;
4. approved Punjabi translation copied from the exact frozen, manually approved CP012 Punjabi source sibling;
5. immutable provenance back to all three CP012 source admission keys, source Question Bank IDs, and source version IDs.

The three CP012 EN/HI/PA bank rows are not repurposed, mutated, or directly selected as scored-test rows.

## Materialization safety

The materializer:

- requires an active exam version;
- requires every requested taxonomy node to be active and mapped to the selected exam version;
- requires Hindi and Punjabi to be active languages for that exam version;
- requires the exact EN/HI/PA CP012 source admission rows to exist and remain approved;
- re-checks source package, admission identity, source language, BANK_ONLY authority, frozen stem, difficulty, options, and downstream locks;
- uses an advisory transaction lock keyed by the deterministic projection bundle key;
- reuses an existing projection only when source and placement provenance match exactly;
- refuses projection-key collisions that resolve to different source or placement identity;
- creates the projection as `approved`, never `published`;
- does not assign `published_version_id` during materialization;
- writes an explicit `content.question.btd_test_projection_materialized` audit event.

## Blueprint-language hardening

Generated scored-test candidates are now required to use a canonical English base row. Hindi/Punjabi participation is through approved translations attached to that English base version.

This prevents raw language-specific CP012 Question Bank rows from entering the blueprint pool if their lifecycle changes later.

## Lifecycle boundary

CP014 state remains:

- `testProjectionMaterializationApproved = true`
- materialized question status = `approved`
- materialized question published = `false`
- `testEligibilityApprovalGranted = false`
- `testEligibility = INELIGIBLE`
- `testEligible = false`
- `mockTestEligible = false`
- `publiclyPublishable = false`
- `automaticStudentPublication = false`

No scored-test, mock-test, or public-delivery gate is opened by CP014.

## Certified implementation run

Validated implementation head before this authority note:

`f32b4b1e040f55c93b03e15ba3e3a4691c25840f`

GitHub Actions:

- run: `33300939589`
- job: `99228844795`
- conclusion: **SUCCESS**
- artifact: `9728921380`
- artifact digest: `sha256:e61e8036d4a634127cd8337eb027748ed46a205b4d6d29b0698f16f44f1549e2`

The cumulative workflow re-proved CP013 before CP014.

### CP014 measured audit

- permanent QLs: 20
- languages: EN / HI / PA
- seeds per QL: 50
- projection plans validated: 1,000
- source authorities validated: 3,000
- source parity checks: 3,000
- projection answer-model checks: 6,000
- deterministic replay checks: 1,000
- cross-exam scope-isolation checks: 1,000
- lifecycle checks: 8,000
- unique projection bundle keys: 996
- safe projection repeats: 4
- unsafe projection collisions: 0
- minimum unique frozen states in any QL scope: 49 / 50
- static materialization guards: PASS
- multilingual blueprint guards: PASS
- API build: PASS
- exact-head assertion: PASS

### Safe repeat interpretation

The four repeated projection bundle keys are **safe deterministic dedup repeats**, not collisions. Different deterministic seeds can resolve to the same certified frozen source state. A repeated bundle key is accepted only when the complete identity is identical: QL, all three CP012 source admission keys, exam version, primary taxonomy node, and full taxonomy set. Any mismatch remains a hard audit/materialization failure.

## Production-data note

No production Question Bank/test projection rows were materialized while certifying CP014 in this chat or CI. This checkpoint adds and certifies the explicit admin materialization path; executing it requires a real reviewed QL/seed plus a real exam-version/taxonomy placement through that guarded route.

## Next gate

The next checkpoint may grant scored-test eligibility only after the materialized projection contract is independently re-proved. It must keep mock-test and public-delivery gates separate unless explicitly authorized.
