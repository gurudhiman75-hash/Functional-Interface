# Expired chapter rollback review after #3484

Source reviewed: merge `4f6e5428c109afaf208a1be04c1c2ac2d49e6c49`.
Reported deadline: `2026-10-25T10:30:24Z` (16:00:24 IST).
Runtime identity: `examtree-qs-chapter-rollback@sarbedutech.iam.gserviceaccount.com`.

## Current incident boundary

Keep `examtree-qs-prod-chapter-rollback-trigger` ENABLED and both
`examtree-qs-prod` and `examtree-qs-chapter-prod` PAUSED. Do not invoke the
rollback Job manually: its apply path changes services and traffic and can pause
its Scheduler after success. Do not extend the release deadline to mask expiry.
No IAM, cloud resource, traffic, generation, publication or rollback changes
were performed in this review. The runtime has no gcloud executable or configured
cloud identity, so live state and effective IAM were not independently verified.

## Findings and prepared source fix

The reported project role grants Scheduler get/pause only. That role cannot
authorize Cloud Run service updates. Resource-level grants, IAM conditions and
deny policies must be reviewed before concluding the identity has effective
permissions. An expired release window is not itself proof of an expired IAM
condition. Read-only metadata preflight is not a permission or live recovery proof.

The controller pauses both queues first and aggregates dispatcher/service
failures. Service update failure prevents Scheduler self-pause. It deliberately
still attempts baseline traffic restoration after template update denial; this
is why running it would violate the current no-traffic-change instruction.

#3484 introduced `EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_LAUNCH_APPROVED`.
Prepared source now clears this API flag along with existing chapter flags,
requires it explicitly false in recovered templates, and rejects baselines where
it is true. Missing flags on older baselines remain compatible. Launch approval
is independent of release approval and is not required true on older candidates.
This closes a revocation gap; existing release and expiry checks already guard
the launcher. It does not repair the reported Cloud Run IAM denial.

## Concrete permission repair proposal — review only

First obtain sanitized failed execution evidence, immutable deployed rollback
image digest, exact denied permission and effective bindings/conditions for this
identity. Compare deployed code to this source; a merge does not update the Job.
Review these narrowly scoped capabilities, without applying grants:

| Resources in sarbedutech / asia-south1 | Capabilities to verify |
| --- | --- |
| Services examtree-api, examtree-qs-receiver-prod, examtree-universal-prod | run.services.get, run.services.update; template changes and traffic restoration both need update |
| Pinned baseline and serving revisions of those services | run.revisions.get |
| Dispatcher Jobs examtree-qs-dispatch-prod, examtree-qs-chapter-dispatch-prod | run.jobs.get, run.jobs.update |
| Both named Cloud Tasks queues | cloudtasks.queues.get, cloudtasks.queues.pause; no resume |
| Exact rollback Scheduler | cloudscheduler.jobs.get, cloudscheduler.jobs.pause |
| Three service runtime accounts pinned in controller SERVICES | iam.serviceAccounts.actAs where required by template updates |
| Cloud Run long-running operations | run.operations.get where required by CLI polling |

Use the narrowest supported resource scope; review project-level permissions
separately where resource-level bindings are unsupported. Do not add Owner,
Editor, broad Run Admin, generation invocation or Secret Manager access. Review
actual artifact/service-agent requirements only if sanitized errors establish
them. Separately verify Scheduler's existing OAuth identity can invoke only the
rollback Job. Do not conflate its invocation rights with rollback runtime rights.
Any proposed conditional grant must remain valid beyond the rollback deadline
and recovery period; an already expired condition cannot repair this incident.

No production repair is authorized here. Before any separately approved repair,
review whether successful scheduled recovery would self-pause the Scheduler:
the deployed controller may do so, while this incident requires it stay enabled.
Do not grant permissions or deploy a new image under the current constraints.
Prepare any required incident-specific keep-enabled behavior for separate review
before changing effective production permissions.

## Verification

22 controller unit tests and 15 stateful offline simulations pass, including
new launch-flag revocation, unsafe baseline rejection and final verification.
Existing permission-denial tests retain paused queues and enabled Scheduler.
`git diff --check` passes. These are mocked tests, not live rollback proof.

## Follow-up backend preparation

Prepared source now retains Scheduler ENABLED even after successful recovery.
It skips redundant traffic writes when desired and observed baseline traffic
are already pinned. A second complete scheduled recovery check is verified to
make zero mutations. No deployed state has been changed.

Backend readiness validation: all 48 focused offline backend tests pass,
covering API launch and saved-run retry, canonical catalog admission, isolated
dispatch, review batch policy and disabled receiver boot. The production receiver
bundle compiles successfully (13 existing source warnings). The loopback HTTP
tests require execution outside the restrictive local socket sandbox; they passed
with that access. No production database credentials or generation were used.
All 37 controller checks pass. Production is still blocked on cloud access,
effective rollback IAM review, separately authorized repair/deployment and live
acceptance; local readiness is not production readiness.
