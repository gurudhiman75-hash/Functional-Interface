# Notes Studio NS-011 — Source independence integrity

## Goal

Make the existing Source Policy gate enforce what its templates already promise: multiple sources must represent genuinely independent evidence, not merely multiple database rows.

NS-011 does not add a new source model, a new source-sufficiency route, or a new publication path. It hardens the canonical Source Policy introduced on `New-main`.

## Integrity rules

Each source-pack template now carries two template-level integrity thresholds in addition to its role requirements:

| Template | Unique content | Publisher/domain identities |
| --- | ---: | ---: |
| Balanced | 2 | 2 |
| Official-first | 2 | 2 |
| Reference-led | 2 | 2 |
| Exam-focused | 2 | 1 |
| Quick revision | 1 | 1 |

`content_hash` is the canonical content-copy identity. Two rows with the same content hash count as one independent content copy.

Source identity is derived deterministically from normalized publisher metadata, falling back to the source URL host when publisher metadata is absent. Uploaded files with neither publisher nor a web host do not fabricate an identity.

## Evidence gate

`POST /admin/notes-studio/jobs/:jobId/evidence/rebuild` already passes through the Source Policy router before the evidence builder. NS-011 extends that existing server-side gate so evidence rebuild is blocked when:

- role/count requirements are incomplete;
- the pack does not have enough unique content hashes; or
- a template that promises independence does not have enough distinct publisher/domain identities.

The mature NS-003 evidence builder remains unchanged.

## Source Pack Proposals

The proposal engine now understands source integrity. It:

- avoids candidates whose content hash is already represented when unique content is missing;
- rewards a new publisher/domain identity;
- can propose an additional governed source even when role counts are already satisfied but independence is not;
- never invents a source role: a candidate still needs prior governed use in an allowed role;
- remains editor-applied only.

No external network search, automatic attachment, evidence generation, approval, or publication is introduced.

## Admin UX

Source Policy now displays:

- role requirement counts;
- unique content-hash count vs template minimum;
- distinct publisher/domain identity count vs template minimum;
- explicit independence gaps; and
- the existing lifecycle lock after evidence work begins.

## Additional correction

NS-011 fixes the UUID validator in `admin-notes-studio-source-policy.ts`; the previous expression omitted the separator before the final UUID segment and could reject valid job/source identifiers.

## Non-goals

- no new database migration;
- no new source registry;
- no automatic web discovery;
- no semantic source-authority classifier;
- no bypass of rights/retention policy;
- no change to learner publication boundaries.
