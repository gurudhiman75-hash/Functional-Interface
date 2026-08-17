# WOR-001 Implementation Status — Question Studio Review Connected

## Current implementation

- five-checkpoint, review-only runtime;
- **24 prototypes / 20 task kinds**;
- **8 recommended permanent QL roots**;
- **8 source-deferred contracts**;
- **8 instance variants**;
- **60 real-word families / 720 globally unique provisional words**;
- real-word split: **18 Easy / 20 Medium / 22 Hard**;
- **60 Banking cluster families / 720 globally unique three-letter clusters**;
- Banking split: **20 Easy / 20 Medium / 20 Hard**;
- classic four-option and Banking five-option profiles;
- independent classic and Banking verification;
- EN/HI/PA generation;
- student-facing Banking editorial layer in EN/HI/PA;
- **Question Studio review package connected to the current shared workflow**;
- public release, Question Bank conversion and scored-test eligibility remain disabled.

## Pool and editorial status

The pool-expansion checkpoint remains valid and was not reopened. The chapter retains 60 real-word families / 720 words and 60 Banking families / 720 clusters with the existing Easy/Medium/Hard saturation and uniqueness evidence.

The Editorial Review V1 remediation also remains valid. CP-005 Banking student-facing output:

- does not expose transformed groups before the student solves the transformation;
- uses natural English ordinal/letter wording;
- avoids implementation-style numeric alphabet-offset language;
- uses remediated Hindi/Punjabi wording and ordinal case forms;
- keeps full transformation and independent-verification traces in internal metadata only.

Detailed editorial evidence: `WOR-001-EDITORIAL-REVIEW-V1.md`.

## Question Studio integration result

WOR-001 is now connected as a **review-visible, release-locked** package on branch `feature/wor-001-question-studio-integration-v1`, based directly on the then-current `New-main` rather than the stale editorial branch.

### Registered review surface

The registered package exposes:

- package/chapter: `WOR-001`;
- 5 checkpoints and all 24 prototypes;
- English, Hindi and Punjabi;
- Easy/Medium/Hard filtering with prototype-compatibility enforcement;
- deterministic seed control;
- specialist preview in the Question Studio operations page;
- persistent review-run creation;
- status counts for Studio items, approvals, needs-fix, rejections and Question Bank conversions.

The legacy/raw runtime adapter remains dormant as a release surface (`questionStudioVisible: false`). The **registered review package** is explicitly review-visible (`questionStudioVisible: true`). This separates editorial visibility from product/public visibility.

### Shared workflow persistence

Created WOR review runs use the existing Question Studio persistence model:

- `content.generation_runs`;
- `content.generation_run_items`;
- immutable `content.generation_item_versions`;
- `platform.audit_events`;
- `platform.outbox_events`.

The persisted review stem is self-contained: it includes the instruction plus the actual word/order/insertion prompt. This prevents incomplete cockpit rendering and false duplicate detection that would occur if only the instruction were stored.

### Shared review lifecycle

WOR items participate in the existing common cockpit for:

- unreviewed / needs-fix / rejected / approved decisions;
- automatic quality analysis;
- duplicate analysis using the complete persisted prompt;
- review-only bulk approval through the existing approval-policy hardening route.

Approval is deliberately classified as `review_only`. It records editorial approval but **does not convert the item to Question Bank**.

### Source-controlled correction policy

WOR carries independent solver/verifier evidence. Free-form editing of a generated stem/options would invalidate that evidence while leaving stale verification metadata behind. Therefore:

- persisted policy: `SOURCE_GENERATOR_ONLY`;
- ad-hoc shared-cockpit revision requests for WOR are rejected with `WOR_SOURCE_GENERATOR_ONLY`;
- editors should mark the item `Needs fix`, correct the WOR generator/localization source, then regenerate;
- WOR regeneration is intercepted before the generic Quant V4 regeneration route and is executed by the native WOR deterministic generator;
- regeneration writes a new immutable version and preserves all review/release locks;
- mixed WOR/non-WOR regeneration selections are rejected with `MIXED_GENERATION_ENGINES` so no item can be routed to the wrong generation engine.

The generic cockpit does not yet have a cross-package `revisionPolicy` UI contract, so its generic Revise control may still be visible. The backend source-control guard is authoritative; the dedicated WOR panel exposes only supported generation/review actions. A future shared-cockpit UX enhancement can consume `revisionPolicy` across all source-controlled packages without changing WOR correctness.

## Release locks

Every persisted WOR review payload explicitly carries:

- permanent QL / QL: `null`;
- `questionBankStatus: NOT_STORED`;
- `questionBankWritable: false`;
- `testEligibility: INELIGIBLE`;
- `testEligible: false`;
- `mockTestEligible: false`;
- `publiclyPublishable: false`;
- `automaticStudentPublication: false`;
- `manualApprovalRequired: true`;
- release freeze: `PENDING_NATIVE_SIGNOFF_AND_PERMANENT_QL`.

Question Studio review visibility therefore **does not mean release eligibility**.

## Automated evidence

### Classic runtime

- 6,840 localized generations;
- four answer positions: `[570, 570, 570, 570]`;
- **60/60 real-word families reached**;
- source/difficulty/independent-solver gates passed.

### Expanded real-word saturation

- 60 families / 720 words;
- tier counts: `{ EASY: 18, MEDIUM: 20, HARD: 22 }`;
- all family/token/ID uniqueness gates passed;
- all families reached in the 900-seed-per-tier audit;
- visible-set uniqueness >= 90% per tier;
- Easy shared-prefix question rate: **0.322**.

### Banking runtime and reservoir

- CP-005: 1,980 localized generations;
- answer positions: `[131, 134, 135, 126, 134]`;
- every Banking task and transformation covered;
- 60 families / 720 clusters;
- tier counts `{ EASY: 20, MEDIUM: 20, HARD: 20 }`;
- unique visible sets over 1,000 builds: Easy **974**, Medium **963**, Hard **975**;
- independent transform/sort/answer parity passed.

### Editorial and Question Studio validation

- 136-question classic English review pack retained;
- 33-question CP-005 review pack generated per locale;
- EN/HI/PA editorial leakage and wording guards passed;
- all 24 prototypes exercised through the Studio review authority in each locale;
- Studio persisted-payload quality score: **100** in the contract audit sample;
- shared approval disposition asserted as **`review_only`**;
- unsupported prototype/difficulty combinations rejected rather than silently remapped;
- API production build passed;
- admin-app production build passed.

Full green integration validation: GitHub Actions run `31990234535` on 2026-08-17. The first full-stack attempt correctly caught an admin-app JavaScript-target incompatibility (`replaceAll`); it was fixed and the complete suite was rerun green.

## Current maturity

`ARCHITECTURE_COMPLETE_POOLS_SATURATED_EDITORIAL_REMEDIATED_QUESTION_STUDIO_REVIEW_CONNECTED`

## Remaining gates

1. Native Hindi and Punjabi human editorial sign-off.
2. Final human English release sampling if desired before freeze.
3. Allocate and freeze the eight recommended permanent QL roots after editorial acceptance.
4. Convert the approved/frozen contracts from review-only to canonical Question Bank eligibility under an explicit release checkpoint.
5. Enable scored-test/mock/public use only after that release checkpoint passes.

No further raw object-pool expansion or Question Studio plumbing is currently required for WOR-001. The next substantive chapter checkpoint is **native sign-off + permanent QL freeze/release activation**.
