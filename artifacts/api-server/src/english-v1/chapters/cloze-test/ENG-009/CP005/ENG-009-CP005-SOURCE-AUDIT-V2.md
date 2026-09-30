# ENG-009 CP005 — Mixed / New-pattern Cloze — Source / Coverage Audit V2

Status: `HUMAN_REVIEW_REQUIRED__CAN_FIT_V2__QUESTION_STUDIO_REVIEW_ONLY`

## Current scope

- 18 original analytical passages
- 6 governed blanks per passage
- 108 governed blank authorities
- Medium/Hard only
- modes: `phrasal-word`, `can-fit`, `cannot-fit`
- passage band: 300–540 words
- one shared passage per six-question set
- no copied public passage content

## V2 remediation

The post-closure quality audit found two concrete defects.

### 1. Can-fit answer ambiguity

The authority model stores three contextually acceptable words plus one rejected word. V1 rendered several accepted words as separate options while keying only one, so more than one option could be defensible.

V2 keeps the authority unchanged but renders:
- one keyed group containing the three accepted words;
- three distractor groups, each containing the governed rejected word.

The stem is now:

`Which group contains only words that can appropriately fill blank number N?`

Changed can-fit learner surfaces use `ENG-009-CP005-V2` question IDs.

### 2. Passage-length regression

Later breadth work left five base passages above the approved 540-word ceiling. C04–C08 were tightened without changing their topics, blank IDs, blank order, answer authorities, difficulty labels or explanation authorities.

Post-remediation lengths:
- C04: 338 words
- C05: 345
- C06: 352
- C07: 365
- C08: 381

## Validation contract

The CP005 regression must verify:
- 18 passages / 108 blanks;
- six numbered blanks per passage;
- 300–540 word band;
- deterministic replay;
- four unique rendered options;
- exactly one defensible can-fit option group;
- cannot-fit key equals the governed rejected word;
- stable six-question linked-set rendering;
- 6,000-question soak;
- Question Studio review-only lifecycle.

## Review boundary

This source revision changes learner-facing CP005 can-fit surfaces and five passage surfaces. Therefore:
- CP005 direct Question Studio output is fresh-review pending;
- CP006 `banking-new-pattern` sets sourced from CP005 are fresh-review pending;
- other ENG-009 profiles retain their prior approval state;
- production/test/mock/public release remains locked.

Full review artifact:
`ENG-009-CP005-FULL-REVIEW-V2.md`

Fresh human approval is required before the revision-pending flags are cleared.
