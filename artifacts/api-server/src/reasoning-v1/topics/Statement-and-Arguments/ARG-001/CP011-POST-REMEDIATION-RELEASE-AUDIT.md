# ARG-001 CP011 — Post-remediation release audit

## Decision

**Technical remediation: PASS / SUPERSEDING FREEZE ELIGIBLE.**

**Learner release: LOCKED PENDING SEPARATE MANUAL EDITORIAL APPROVAL.**

CP011 supersedes the blocked release decision recorded after CP008. It does not rewrite or invalidate CP003, CP006 or CP008 as historical records. Current learner-facing review generation is governed by CP009 remediation for ordinary Question Studio questions and CP010 correlated remediation for real-paper profiles.

## Why the historical release was blocked

The post-CP008 audit found unsafe Cartesian composition in the frozen historical path, including grammar agreement failures, noun/verb slot misuse, temporal duplication, actor/object mismatches, polarity errors and real-paper slot-correlation defects. CP006 and CP008 remain valid historical freeze evidence for what was certified at that time, but they are not current release authorities.

## CP009 core remediation audit

- Six permanent QLs remain the chapter identity surface.
- Easy, Medium and Hard are available for every QL.
- English remediation is exhaustively proved over 12,288 rendered semantic surfaces.
- Hindi and Punjabi remediation is exhaustively proved over 24,576 localized surfaces.
- Total exhaustively proved ordinary/core surfaces: 36,864.
- Current Question Studio ordinary generation reports CP009 as its source checkpoint and does not fall back to the frozen CP003/CP005 semantic authority.
- Deterministic seeded replay is required by the current adapter proof.

**Result: PASS.**

## CP010 correlated real-paper audit

- Historical CP007 real-paper requests are upgraded into the CP010 correlated layer.
- Supported SSC/banking profiles retain their required argument and option counts.
- Real-paper scenario slots are selected as compatible correlated scenarios instead of unsafe independent Cartesian combinations.
- EN/HI/PA and supported profile/difficulty combinations are exercised by the current proof chain.
- Question Studio normalizes the public difficulty contract consistently to `Easy`, `Medium`, `Hard` while preserving authority-level difficulty semantics internally.

**Result: PASS.**

## Question Studio routing audit

The current ARG-001 router must be mounted before both historical ARG real-paper and core routers. Ordinary ARG requests route to CP009 remediation; real-paper/profile requests route to CP010 correlated generation. Legacy CP005 and CP007 request identifiers are recognized and upgraded rather than allowed to select historical generation first.

**Result: PASS, subject to the CP011 proof and workflow remaining green.**

## Historical freeze preservation

CP011 does not modify frozen CP003/CP006/CP008 content. CI must continue to execute the exact CP006 and CP008 historical byte-freeze proofs. A future change that breaks either proof reopens CP011.

**Result: PASS.**

## Lifecycle and publication boundary

The remediated package remains review-only. Persistence, Question Bank writes, test eligibility, mock-test eligibility, public publication and automatic learner publication remain disabled. Manual editorial approval is still required. Technical certification is deliberately separated from learner-release approval.

**Result: PASS / LEARNER RELEASE REMAINS LOCKED.**

## CP011 superseding authority

Authority: `ARG_CP011_POST_REMEDIATION_SUPERSEDING_FREEZE_V1`

Status: `TECHNICAL_RELEASE_READY_MANUAL_EDITORIAL_APPROVAL_REQUIRED`

The superseding authority freezes the CP009 + CP010 remediated technical path as the current review authority. It does **not** authorize automatic learner release.

## Reopening conditions

CP011 must be reopened for any proven semantic, answer, localization, explanation, exam-realness or presentation defect; any loss of deterministic QL × difficulty × language coverage; any real-paper correlation regression; any routing precedence regression; any invalidation of CP006/CP008 historical freeze evidence; or any weakening of publication/lifecycle locks without a separate learner-release checkpoint.
