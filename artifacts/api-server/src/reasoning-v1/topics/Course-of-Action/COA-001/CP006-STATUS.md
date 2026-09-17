# COA-001 / COA-CP-006 — Status

Status: **IMPLEMENTED / HUMAN REVIEW PENDING**

## Scope completed

CP006 owns `COA-QL-008` — multi-step / ordered response.

Implemented:

- 12 new English semantic scenarios under QL008;
- exact 3 Only-I / 3 Only-II / 3 Both / 3 Neither answer balance;
- Easy, Medium and Hard coverage;
- broad operational domain spread;
- explicit sequence dependencies rather than generic paired-action wording;
- verification before irreversible action;
- containment before repair / restoration;
- evidence preservation before system change;
- immediate safeguard before delayed permanent remedy;
- wrong-order and wrong-timing near misses;
- Editorial V2 hardening before human review;
- deterministic generator with both Course I / Course II orders reachable;
- four instruction surfaces;
- additive-safe regression proof preserving all earlier semantic authorities;
- dedicated CP006 CI gate;
- review pack: `COA-CP-006-ENGLISH-REVIEW.md`.

## QL008 boundary

QL008 is valid only when **order or dependency itself changes the quality of the response**.

It must not absorb ordinary questions where two independent actions can simply be judged good or bad. Those remain in their underlying semantic QL and use the CP005 paired-presentation layer.

Typical QL008 learner operations:

- verify → decide irreversible action;
- contain → investigate → correct;
- preserve evidence → change system state;
- restore immediate service → prevent recurrence;
- perform prerequisite → dependent action;
- reject a sensible step because it occurs too early or too late.

## Lifecycle

- CP001 English: APPROVED
- CP002 English: APPROVED
- CP003 English: HUMAN REVIEW PENDING
- CP004 English: HUMAN REVIEW PENDING
- CP005 paired presentation: APPROVED / FROZEN
- CP006 ordered response: HUMAN REVIEW PENDING
- QL allocation: NOT FROZEN
- Question Studio: CLOSED
- Question Bank writes: CLOSED
- test/mock eligibility: CLOSED
- Hindi/Punjabi: NOT STARTED
- public/student delivery: CLOSED

Green CI is not human editorial approval. CP006 must not be frozen or promoted until explicit product-owner approval is recorded.
