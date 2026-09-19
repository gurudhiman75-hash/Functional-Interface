# COA-001 / COA-CP-012 — Internal Eligibility Review

Status: **PRODUCT-OWNER APPROVAL REQUIRED**

## Decision being reviewed

CP012 asks one narrow question:

> Is the already approved/frozen COA corpus ready to be used internally in Question Bank, Test Builder and Mock Builder while remaining completely blocked from public/student release?

No content changes are proposed in CP012.

## Evidence already frozen

COA currently has:

- **118 active ordinary semantic authorities**
- **10 source-backed presentation authorities**
- **130 total frozen semantic authorities**
- **260 Hindi/Punjabi localized learner surfaces**
- 8 active semantic QLs
- balanced ordinary answer classes inside each active QL
- at least 10 domains per active QL
- English/Hindi/Punjabi editorial approval
- Question Studio integration
- semantic anti-repetition inside a review batch
- truthful finite semantic capacity
- QL008 Medium/Hard-only difficulty integrity
- genuine exclusive-Either and three-action profile handling

## What CP012 changes before approval

Nothing in the live lifecycle.

The candidate remains:

- Question Studio: review-only
- Question Bank writable: **NO**
- Test eligible: **NO**
- Mock eligible: **NO**
- Public release: **NO**
- Student delivery: **NO**

The live Question Studio authority remains CP011.

## What approval would authorize

Approval would permit a lifecycle-only promotion with **no learner-content mutation**:

| Gate | After CP012 approval |
|---|---|
| Question Studio | Internal approved |
| Canonical persistence | Enabled |
| Question Bank writes | Enabled |
| Test Builder eligibility | Enabled |
| Mock Builder eligibility | Enabled |
| Public/student publication | **Still blocked** |
| Automatic learner publication | **Still blocked** |

## Content-identity protection

The CP012 proof compares the frozen CP011 question and CP012 candidate across:

- question ID and content fingerprint;
- semantic authority / QL / profile;
- language and locale;
- statement and instruction;
- actions/courses;
- options;
- correct answer and index;
- explanation;
- difficulty;
- domain.

Any change to those fields fails CP012.

## Recommendation recorded by the implementation

The technical candidate recommends:

- **YES** — internal Question Bank eligibility;
- **YES** — internal test eligibility;
- **YES** — internal mock eligibility;
- **NO** — public release;
- **NO** — direct student delivery.

This recommendation does not activate anything by itself.

## Approval gate

Approve CP012 only if you want COA to become internally usable by Question Bank/Test/Mock systems with public/student release still locked.

Until approval, the live runtime remains CP011 review-only.
