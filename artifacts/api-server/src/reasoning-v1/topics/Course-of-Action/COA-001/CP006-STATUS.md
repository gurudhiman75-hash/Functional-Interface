# COA-001 / COA-CP-006 — Status

Status: **APPROVED / ENGLISH CHECKPOINT FROZEN**

Approval recorded: **2026-09-17**  
Approval authority: product-owner review of `COA-CP-006-ENGLISH-REVIEW.md`.

## Approved scope

CP006 owns `COA-QL-008` — multi-step / ordered response.

Frozen English authority:
- 12 English semantic scenarios under QL008;
- exact 3 Only-I / 3 Only-II / 3 Both / 3 Neither answer balance;
- Easy, Medium and Hard coverage;
- broad operational domain spread;
- explicit sequence dependencies rather than generic paired-action wording;
- verification before irreversible action;
- containment before repair / restoration;
- evidence preservation before system change;
- immediate safeguard before delayed permanent remedy;
- wrong-order and wrong-timing near misses;
- Editorial V2 hardening approved;
- deterministic generator with both Course I / Course II orders reachable;
- four instruction surfaces;
- additive-safe regression proof preserving all earlier semantic authorities;
- dedicated CP006 CI gate;
- approved review authority: `COA-CP-006-ENGLISH-REVIEW.md`.

## QL008 boundary

QL008 is frozen only for cases where **order or dependency itself changes the quality of the response**.

It must not absorb ordinary questions where two independent actions can simply be judged good or bad. Those remain in their underlying semantic QL and use the approved CP005 paired-presentation layer.

Typical QL008 learner operations:
- verify → decide irreversible action;
- contain → investigate → correct;
- preserve evidence → change system state;
- restore immediate service → prevent recurrence;
- perform prerequisite → dependent action;
- reject a sensible step because it occurs too early or too late.

## Lifecycle

- CP001 English: APPROVED / FROZEN
- CP002 English: APPROVED / FROZEN
- CP003 English: APPROVED / FROZEN
- CP004 English: APPROVED / FROZEN
- CP005 paired presentation: APPROVED / FROZEN
- CP006 ordered response: APPROVED / FROZEN
- QL allocation: NOT FROZEN
- Question Studio: CLOSED
- Question Bank writes: CLOSED
- test/mock eligibility: CLOSED
- Hindi/Punjabi: NOT STARTED
- public/student delivery: CLOSED

Approval authorizes downstream chapter work only. It does not promote Question Studio, Question Bank, test/mock or public/student eligibility.
