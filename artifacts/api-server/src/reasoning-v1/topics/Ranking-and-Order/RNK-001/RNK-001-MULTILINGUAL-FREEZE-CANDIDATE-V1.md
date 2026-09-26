# RNK-001 Multilingual Freeze Candidate V1

## Current status

**TECHNICAL MULTILINGUAL CANDIDATE REMAINS VALID; FORMAL NATIVE/PRODUCT APPROVAL IS STILL REQUIRED.**

The last candidate head that completed the full GitHub suite is `60c20f88eba87e2f7dcae07299b328a961ca9831` on workflow run `32229246885` — **SUCCESS**.

The current head adds only approval-review tooling:

- `rnk-001-native-approval-review-pack-v1.mjs`;
- workflow steps that reconstruct one Hindi and one Punjabi approval pack from the pinned candidate evidence and retain them as an Actions artifact.

No localization authority, learner generator, answer, QL ownership, exam-delivery policy, shared Question Studio runtime or lifecycle flag changed between the last green head and this review-tooling head.

The first workflow attempt on the review-tooling head (`32246887138`) ended before a runner executed any step: the job exposes no step list and no packaged job log. Multiple unrelated workflows on the same commit show the same pre-step failure. Therefore this attempt is classified as **RUNNER / ACTIONS INFRASTRUCTURE BLOCKED**, not as an RNK content or review-pack test failure.

## Candidate boundary

- English authority: **FROZEN / unchanged**
- Permanent QLs: `RNK-QL-001..042`
- `RNK-QL-043`: **unallocated**
- Hindi technical coverage: **REVIEW_READY**
- Punjabi technical coverage: **REVIEW_READY**
- formal Hindi/Punjabi native/product approval: **NOT RECORDED**
- chapter multilingual freeze: **false**
- Hindi/Punjabi Question Studio delivery: **false**
- Question Bank write: **false**
- mock/test eligibility: **false**
- public publication: **false**

## Pinned checkpoint lineages

| CP | Permanent QLs | PR | Candidate head | Exact-head run | Retained learner artifact |
|---|---|---:|---|---:|---:|
| CP001 | QL001..009 | #793 | `d62bb7ea6bf8312a360318cf4939bd15bce057f0` | `32156515182` | `9332085480` |
| CP002 | QL010..017 | #798 | `0e29a4760f80c638c5e318cdc5dcff621fe3b9a4` | `32156263287` | `9331950882` |
| CP003 | QL018..026 | #803 | `618a5a8ebdc33eaad395a10297719cae030d8cc9` | `32156696225` | `9332197359` |
| CP004 | QL027..035 | #839 | `7ac8eeeb76cd2c259957baa67d30c1acb329f36e` | `32162654654` | `9334465846` |
| CP005 | QL036..038 | #879 | `7d28290d061329153935853cba28d5c3ffe63a43` | `32155944463` | `9332478402` |
| CP006 | QL039..041 | #895 | `361cf571f138572caebfd0ecb0fa145e9afdfda3` | `32153076870` | `9331032696` |
| CP007 | QL042 | #792 | `60d1fcca93efd27340f969ff8589b95195c2771e` | `32197317683` | `9346352174`, percentage `9346352864` |

## Provenance hardening

The consolidation pass found stale artifact references in CP003 and CP005 PR descriptions. Both PRs were corrected to their current-head run/artifact evidence.

The earlier directly audited learner packs were then compared with the current-head packs:

- CP003: rendered 144Q Markdown is byte-for-byte identical;
- CP005: rendered 48Q Markdown is byte-for-byte identical.

Thus the direct learner audit transfers to the current pinned heads.

## Approval-review bundle contract

The review-pack generator is designed to produce:

- one Hindi sample for every `RNK-QL-001..042`;
- one Punjabi sample for every `RNK-QL-001..042`;
- a separate QL042 40/60 percentage-presentation sample in each language;
- exact checkpoint-head and artifact provenance beside every sample;
- explicit unchecked approval/freeze locks.

For CP004, QL027/028 are taken from the V6 retained artifact. QL029..035 are regenerated from the V5-Final exporter at the exact V6 candidate head; the V6 exhaustive test proves those non-target learner surfaces are unchanged from V5 Final.

A local independent assembly pass over the same pinned inputs produced 42 unique QLs per language with no gap/overlap and the required 40/60 supplement. This is supporting review-tooling evidence only; the Actions-retained bundle remains pending a runner-executed workflow attempt.

## Last fully green chapter-level proof

Run `32229246885` passed:

1. pinned multilingual candidate coverage and lifecycle locks;
2. RNK exam-readiness authority/delivery boundary;
3. banking five-option delivery guard;
4. all 42 QLs through the shared Question Studio review path;
5. chapter-wide English content freeze;
6. API server build;
7. admin app build.

## Approval sequence

1. Review the pinned Hindi/Punjabi learner lineage.
2. Record explicit native/product approval for the exact pinned heads.
3. Only after all seven checkpoint approvals, combine the approved locale branches on a controlled integration branch.
4. Re-run combined-tree semantic/invariance/build gates.
5. Only a green combined tree may set chapter multilingual freeze.
6. Multilingual Question Studio activation remains a separate later product lifecycle transition.

No merge into `New-main`, multilingual freeze, multilingual Question Studio activation, Question Bank storage, mock/test eligibility, public publication or deployment is authorized by this candidate.
