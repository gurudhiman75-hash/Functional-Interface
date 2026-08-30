# BTD-001 CP018 Public Release Readiness Authority v1

Status: **READY FOR EXPLICIT PUBLIC RELEASE APPROVAL — PUBLIC RELEASE NOT GRANTED**

CP018 certifies that the already scored-test-eligible and mock-test-eligible BTD exam projection has the provenance, placement, multilingual completeness and immutable learner content needed for a later public-release decision. This checkpoint is readiness-only.

## Source authority

CP018 requires the CP017 target state:

- question status: `published`;
- `testEligible = true`;
- `mockTestEligible = true`;
- `publiclyPublishable = false`;
- `automaticStudentPublication = false`;
- deterministic BTD projection bundle identity;
- English base plus approved Hindi and Punjabi authority;
- active exam and taxonomy placement.

## Readiness requirements

A future public eligibility grant must continue to prove:

- published certified BTD projection;
- scored-test eligibility still active;
- mock-test eligibility still active;
- active exam placement;
- active taxonomy placement;
- complete immutable English learner content;
- approved complete Hindi translation;
- approved complete Punjabi translation;
- learner content is not changed by the public-release transition;
- explicit public-release approval.

The proposed future state would change only the explicit public-delivery metadata:

- `testEligible = true` preserved;
- `mockTestEligible = true` preserved;
- `publiclyPublishable = true`;
- `automaticStudentPublication = false` remains locked.

CP018 itself does not authorize this mutation and does not add a public mutation route or service.

## Initial certification evidence

Exact head: `92a46694a992cd65df6011053454d0f9a4d0fa9b`

Workflow run: `33315248218`
Job: `99267343737`
Result: **SUCCESS**

Artifact: `9733244122`
Digest: `sha256:426b36ee5fcb18d93d55cfc55664c73416d1925d447ba6df7ab78464c79bc6f2`

The cumulative workflow first re-proved CP017 and then certified CP018 with:

- 20 permanent QLs;
- 2 exam scopes;
- 50 seeds per QL per exam;
- 2,000 public-release readiness plans;
- 2,000 deterministic replay checks;
- 14,000 source-state/placement checks;
- 20,000 readiness-requirement checks;
- 10,000 proposed-state checks;
- 1,982 unique projection bundle keys;
- 18 safe deterministic finite-pool repeats;
- 0 unsafe projection collisions;
- minimum QL × exam uniqueness: 48/50;
- static public-lock checks: PASS;
- API build: PASS;
- exact-head assertion: PASS.

## Lifecycle boundary

CP018 remains:

- `publicReleaseApprovalGranted = false`;
- `publiclyPublishable = false`;
- `automaticStudentPublication = false`;
- `projectionPublicEligibilityMutationAuthorized = false`;
- learner-content mutation unauthorized.

There is currently no new standalone student-facing public endpoint introduced by this checkpoint. Public eligibility remains a separate later CP019 decision.

No production projection was mutated during certification and no PR merge is authorized by this checkpoint.
